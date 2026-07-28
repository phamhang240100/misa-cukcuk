from __future__ import annotations
import re, pathlib
from dataclasses import dataclass, field

@dataclass
class Edge:
    type: str; target_file: str; target_anchor: str | None; src: str; note: str | None = None
@dataclass
class Link:
    target_file: str; target_anchor: str | None; src_line: int
@dataclass
class Node:
    path: str; type: str | None = None; id: str | None = None
    frontmatter: dict = field(default_factory=dict)
    anchors: set = field(default_factory=set)
    relations: list = field(default_factory=list)
    inline_links: list = field(default_factory=list)
@dataclass
class Graph:
    root: str; nodes: dict = field(default_factory=dict)

_FM = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
_REL = re.compile(r"\{type:\s*([a-z-]+)\s*,\s*target:\s*\"([^\"]+)\"(?:\s*,\s*note:\s*\"([^\"]*)\")?\s*\}")
_LINK = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
_HEAD = re.compile(r"^#{1,6}\s+(\S+)")

def _split_target(t: str):
    if "#" in t:
        f, a = t.split("#", 1); return f, a
    return t, None

def _norm(base: pathlib.Path, rel: str, root: pathlib.Path) -> str:
    if rel.startswith("#"):            # same-file anchor
        return str(base.relative_to(root)).replace("\\", "/")
    p = (base.parent / rel).resolve()
    try:
        return str(p.relative_to(root)).replace("\\", "/")
    except ValueError:
        return rel   # outside root; keep raw so resolver flags it

def _read_frontmatter(text: str) -> tuple[dict, str]:
    m = _FM.match(text)
    if not m: return {}, text
    fm, body = {}, m.group(1)
    for line in body.splitlines():
        mm = re.match(r"^([a-zA-Z_]+):\s*(.*)$", line)
        if mm and mm.group(2).strip() not in ("", "|", ">"):
            fm[mm.group(1)] = mm.group(2).strip()
    return fm, text[m.end():]

def load_graph(root: str) -> Graph:
    root_p = pathlib.Path(root).resolve()
    g = Graph(root=str(root_p))
    for path in sorted(root_p.rglob("*.md")):
        rel = str(path.relative_to(root_p)).replace("\\", "/")
        text = path.read_text(encoding="utf-8")
        fm, _ = _read_frontmatter(text)
        n = Node(path=rel, type=fm.get("type"), id=fm.get("id"), frontmatter=fm)
        # relations (parse anywhere in frontmatter block)
        fmblock = _FM.match(text).group(1) if _FM.match(text) else ""
        for t, tgt, note in _REL.findall(fmblock):
            tf, ta = _split_target(tgt)
            n.relations.append(Edge(t, _norm(path, tf if tf else "#", root_p) if tf else rel, ta, rel, note or None))
        # anchors from headings (first token) + explicit {#id} + frontmatter id
        for i, line in enumerate(text.splitlines(), 1):
            hm = _HEAD.match(line)
            if hm:
                tok = hm.group(1).rstrip(":")
                exp = re.search(r"\{#([^}]+)\}", line)
                n.anchors.add(exp.group(1) if exp else tok)
        if n.id: n.anchors.add(n.id)
        # inline links (body only, skip frontmatter)
        body = text[_FM.match(text).end():] if _FM.match(text) else text
        base_line = text[:_FM.match(text).end()].count("\n") if _FM.match(text) else 0
        for i, line in enumerate(body.splitlines(), 1):
            for tgt in _LINK.findall(line):
                if tgt.startswith(("http://", "https://", "mailto:")): continue
                tf, ta = _split_target(tgt)
                n.inline_links.append(Link(_norm(path, tf if tf else "#", root_p) if tf else rel, ta, base_line + i))
        g.nodes[rel] = n
    return g

@dataclass
class Finding:
    code: str; path: str; line: int | None; message: str

def _anchor_ok(g: Graph, target_file: str, anchor: str | None) -> tuple[bool, str]:
    if target_file not in g.nodes:
        return False, f"file not found: {target_file}"
    if anchor is None:
        return True, ""
    if anchor in g.nodes[target_file].anchors:
        return True, ""
    return False, f"anchor #{anchor} not found in {target_file}"

def check_resolve(g: Graph) -> list:
    out = []
    for n in g.nodes.values():
        for e in n.relations:
            ok, why = _anchor_ok(g, e.target_file, e.target_anchor)
            if not ok:
                out.append(Finding("UNRESOLVED", n.path, None, f"relation {e.type} -> {e.target_file}#{e.target_anchor}: {why}"))
        for l in n.inline_links:
            ok, why = _anchor_ok(g, l.target_file, l.target_anchor)
            if not ok:
                out.append(Finding("UNRESOLVED", n.path, l.src_line, f"link -> {l.target_file}#{l.target_anchor}: {why}"))
    return out

def _owned_key(e: Edge) -> str:
    return f"{e.target_file}#{e.target_anchor}"

def check_ownership(g: Graph) -> list:
    # Ownership is keyed by anchor (entity) name, not target_file#anchor: an "owns"
    # edge normally uses a same-file anchor target (e.g. "#Invoice"), which _norm
    # resolves to the declaring file's OWN path. That makes target_file unique per
    # owner and _owned_key() unable to ever detect two different modules owning the
    # same entity. Grouping by target_anchor alone is what actually captures
    # "N modules claim to own the same named entity".
    out = []
    owners: dict[str, list[str]] = {}
    consumed: dict[str, tuple[str, list[str]]] = {}  # anchor -> (full key for message, all consumer paths)
    for n in g.nodes.values():
        for e in n.relations:
            if e.type == "owns" and e.target_anchor:
                owners.setdefault(e.target_anchor, []).append(n.path)
            if e.type in ("consumes", "produces", "triggers", "gated-by", "references") and e.target_anchor:
                key, consumers = consumed.setdefault(e.target_anchor, (_owned_key(e), []))
                consumers.append(n.path)
    for anchor, owns in owners.items():
        if len(owns) >= 2:
            out.append(Finding("OWN_DUP", owns[0], None, f"{anchor} owned by {len(owns)} modules: {', '.join(owns)}"))
    for anchor, (key, consumers) in consumed.items():
        if anchor not in owners:
            out.append(Finding("OWN_ORPHAN", consumers[0], None, f"{key} is consumed by {', '.join(consumers)} but has no owns edge"))
    return out

_MSG = re.compile(r"\bMSG_[A-Z0-9]+_[A-Z0-9]+\b")
_PREFIX = re.compile(r"^(MSG_[A-Z0-9]+_)")

def _module_of(path: str) -> str | None:
    parts = path.split("/")
    return parts[1] if len(parts) > 2 and parts[0] == "modules" else None

def check_prefixes(g: Graph) -> list:
    out = []
    # map owned prefix -> owner module dir
    prefix_owner: dict[str, str] = {}
    for n in g.nodes.values():
        for e in n.relations:
            if e.type == "owns" and e.target_anchor and _PREFIX.match(e.target_anchor):
                prefix_owner[e.target_anchor] = _module_of(n.path)
    import pathlib as _pl
    for n in g.nodes.values():
        mod = _module_of(n.path)
        if not mod: continue
        text = (_pl.Path(g.root) / n.path).read_text(encoding="utf-8")
        for code in set(_MSG.findall(text)):
            pm = _PREFIX.match(code)
            pref = pm.group(1)
            owner = prefix_owner.get(pref)
            if owner is not None and owner != mod:
                out.append(Finding("MSG_LEAK", n.path, None, f"{code} uses prefix {pref} owned by module {owner}, not {mod}"))
    return out

def check_ids(g: Graph) -> list:
    out = []
    import pathlib as _pl
    idpat = re.compile(r"^#{1,6}\s+((?:REQ|BR|CBR|VAL|EC|D|Q|CAT|CONST|TC|ROLE)-[A-Z0-9-]+)")
    for n in g.nodes.values():
        seen = {}
        text = (_pl.Path(g.root) / n.path).read_text(encoding="utf-8")
        for line in text.splitlines():
            m = idpat.match(line)
            if m:
                seen[m.group(1)] = seen.get(m.group(1), 0) + 1
        for i, c in seen.items():
            if c >= 2:
                out.append(Finding("ID_DUP", n.path, None, f"{i} defined {c} times in {n.path}"))
    return out

VOCAB = {"owns","consumes","produces","triggers","gated-by","depends-on","references","defined-by"}

def check_vocab(g: Graph) -> list:
    out = []
    for n in g.nodes.values():
        for e in n.relations:
            if e.type not in VOCAB:
                out.append(Finding("EDGE_VOCAB", n.path, None, f"unknown relation type '{e.type}' (allowed: {sorted(VOCAB)})"))
    return out

def run(root: str) -> list:
    g = load_graph(root)
    findings = []
    for fn in (check_vocab, check_resolve, check_ownership, check_prefixes, check_ids):
        findings += fn(g)
    return findings

if __name__ == "__main__":
    import sys as _s
    root = _s.argv[1] if len(_s.argv) > 1 else "specs"
    fs = run(root)
    for f in fs:
        loc = f"{f.path}:{f.line}" if f.line else f.path
        print(f"[{f.code}] {loc} — {f.message}")
    print(f"\n{len(fs)} finding(s)")
    _s.exit(1 if fs else 0)
