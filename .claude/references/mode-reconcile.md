# Mode: reconcile — cross-module boundary sweep

Run **any time**, over whatever modules exist so far — NOT gated on "all documented". Its only job: find and mark conflicts at module boundaries and against the `registry/` SSOT. It never rewrites module business logic; it produces open-question markers (unresolved) or `decisions.md` entries (resolved with the BA).

Read first: `../templates/format.md` (registry layer + marker grammar + OKF graph model: `type`/`relations`, closed edge vocabulary, anchor rule).

## Step 0 — Gather (cheap)

- Read `specs/registry/*` (the SSOT).
- Scan `specs/modules/*/index.md` frontmatter → list modules that are `documented` or `clarifying`. `pending` modules have no body yet — skip them (note in the summary that they are unswept).
- Build the boundary set from the **typed graph**, not from re-reading prose: collect every node's frontmatter `relations` list (each module `index.md`, `data.md`, `rules.md`, and every `registry/*` file). Boundaries are edges whose `target` crosses a file — `owns`/`consumes`/`produces`/`triggers`/`gated-by`/`references`/`defined-by`/`depends-on` entries that point outside the declaring module. Prose is read only to get `evidence` quotes for findings the graph already located, never to discover them.

## Step 1 — Detect

### Step 1a — Mechanical (script, first)

Run `python3 skills/spec/scripts/check_graph.py <specs-root>` (run from the plugin root, i.e. `.claude/`) before spawning anything. This is deterministic graph validation, cheap, and catches the mechanical classes outright:

| Code | Meaning |
|------|---------|
| `UNRESOLVED` | a `relations` edge or inline link points at a file/anchor that doesn't exist |
| `OWN_DUP` | two-plus modules declare `owns` on the same anchor |
| `OWN_ORPHAN` | something is `consumes`d/`produces`d/etc. but nothing `owns` it |
| `MSG_LEAK` | a message code uses another module's owned `MSG_<MOD>_` prefix |
| `ID_DUP` | the same ID heading is defined twice |
| `EDGE_VOCAB` | a relation uses an edge type outside the closed vocabulary |

Every finding here is a boundary conflict already — fold it straight into Step 2's lens tally (`OWN_DUP`/`OWN_ORPHAN` → `OWN`, `MSG_LEAK` → `MSG`, `ID_DUP` → `DUP`, `UNRESOLVED`/`EDGE_VOCAB` → fix the graph edge itself, it's a structural error, not a BA question). Do not ask the agent below to re-find what the script already found.

### Step 1b — Semantic (agent, second)

Spawn `cross-module-consistency-checker` (one or, for many modules, a few in parallel split by lens or module group) for what the script cannot see — meaning-level boundary conflicts (same concept, different name/shape; contradictory business rules across modules; RBAC intent drift). Pass it inline:
- the resolved `relations` edges relevant to the modules in scope (not raw prose) so it keys off the same graph the script validated,
- `check_graph.py`'s output so it doesn't re-derive what's mechanical,
- the registry files and each documented module's relevant slices (for `evidence` quoting only),
- the already-answered `Q-*`/`D-*` IDs to exclude.

Never rely on the agent reading files beyond what you pass — pass it inline.

Merge + dedupe results (same entity/field/rule + same question = duplicate; keep higher impact). Assign `Q-REG-NN` IDs for registry-level conflicts, or `Q-<MOD>-NN` when the fix clearly lands in one module.

## Step 1c — Blast-radius (before proposing any fix)

Before proposing a change to any shared concept (a registry entity/catalog/role/message-prefix, or anything with an `owns` edge targeting it), list every **inbound** `consumes`/`references` edge pointing at that concept's anchor — i.e. every module that depends on it. That list is the set of consumers that MUST be re-verified against the proposed fix before it's applied, not just the module where the conflict was noticed. Include this list in the finding presented to the BA in Step 2 (a "Consumers to re-verify" line) so a resolution can't silently break a module nobody looked at.

## Step 2 — Resolve with the BA

Present findings grouped by impact (🔴 high first), 3–5 at a time, via `AskUserQuestion` (same loop as clarification-loop.md — never just list and stop). For each, show the blast-radius consumer list from Step 1c alongside it. For each:
- **Resolved** → apply the fix to the SSOT: update `registry/*` (canonical owner/value) and/or the offending module to reference the ID; append a decision entry — a registry-level decision (`D-REG-NN`) goes in the global `specs/decisions.md`, a module-scoped decision (`D-<MOD>-NN`) goes in that module's `decisions.md`; delete any now-stale text. Then walk the blast-radius list from Step 1c and confirm each consuming module's `relations` edge and prose still match the new canonical shape — re-open a finding for any that don't.
- **Unresolved / needs client** → write a `[NEEDS-CLARIFICATION: Q-… ]` marker at the exact spot (in `registry/*` for registry-level, in the module file for module-level).

Persist immediately after each batch.

## Step 3 — Loop until dry

A sweep is not done after one pass. After resolving a batch (Step 2), re-run Step 1a (`check_graph.py`) and re-scan the graph for any new/re-opened findings surfaced by the blast-radius walk (fixes can ripple: changing a canonical shape to satisfy one consumer can break another). Repeat Steps 1–2 until **two consecutive passes come back clean** (0 mechanical findings, 0 new semantic findings, blast-radius walk confirms every consumer matches). Only then proceed to Step 4.

## Step 4 — Report (wrap-up gate)

The full sweep — Steps 0 through 3, including the dry-loop — is a gate: do not report success and do not hand control back until `check_graph.py` exits clean AND two consecutive passes found nothing new.

```
Reconcile sweep — {D} documented modules swept, {P} pending skipped.
check_graph.py: clean after {N} passes (2 consecutive dry).
Boundary conflicts: {found} → {resolved} resolved (decisions), {open} open markers.
By lens: OWN {n} · CAT {n} · MSG {n} · RBAC {n} · CONTRACT {n} · DUP {n}
Blast-radius re-verifications: {n} consumers checked, {n} re-opened.
Next: answer open 🔴, or /clear then /ba:spec to continue the next module.
```

No 🔴 open, `check_graph.py` clean, and every shared thing traces to one registry entry → boundaries are clean for the modules swept so far.
