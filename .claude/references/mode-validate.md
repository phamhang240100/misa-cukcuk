# mode-validate: Graph validation reference

This mode validates cross-module consistency in specification files using a mechanical graph checker. All findings are **mechanical** (no judgment calls) and **must be zero** before a module flips `status: documented`.

## Running the validator

From the plugin root (`.claude/skills/spec/`), run:

```bash
python3 scripts/check_graph.py <specs-root>
```

Where `<specs-root>` is the path to your specifications directory (typically `specs/` or `specs_new/` in the project root). Example:

```bash
cd /path/to/project/.claude/skills/ba:spec
python3 scripts/check_graph.py ../../../specs/srs_final
```

The validator loads all `.md` files from the specs root, parses frontmatter relations and inline links, and performs five checks. It prints findings with codes, file paths, line numbers (if applicable), and messages:

```
[CODE] path/file.md:line — message
...
N finding(s)
```

Exit code is 1 if any findings exist, 0 if clean.

**Mechanical vs. semantic contract checking:** this validator only checks that a `consumes` (or `produces`/`triggers`/`gated-by`/`references`) edge RESOLVES — the target file/anchor exists (else `UNRESOLVED`). It does not check whether the shape of what's consumed actually matches what the owner produces (same fields, same meaning, same cardinality). That deeper contract matching is intentionally out of scope for this deterministic gate — it is handled by the semantic `CONTRACT` lens in `cross-module-consistency-checker` (see `mode-reconcile.md`). Do not expect `check_graph.py` to catch a field/shape mismatch between a producer and a consumer of the same anchor.

## Finding codes and remediation

### UNRESOLVED

**What it means:** A relation (in frontmatter) or inline markdown link targets a file or anchor that does not exist.

**Examples:**
- Relation targets a file not in the specs directory
- Relation or link references an anchor (e.g., `#Invoice`) that has no matching heading or explicit anchor ID in the target file
- Link text refers to a file path outside the specs tree

**How to fix:**
1. **For relations:** Verify the `target` field in frontmatter points to an existing file and (if specified) an existing anchor. Correct the path or anchor name.
2. **For inline links:** Check the markdown link syntax—ensure the file exists and the anchor exists in that file. Common fix: rename the target file or heading, or add an explicit anchor with `{#id}`.
3. **For same-file anchors:** If targeting the same file (e.g., `#MySection`), verify a heading with that text or an explicit `{#MySection}` exists in the current file.

---

### OWN_DUP

**What it means:** An entity (concept, identified by its anchor name) has two or more `owns` edges from different modules—multiple modules claim to own the same thing.

**Examples:**
- Both `modules/m02/concepts.md` and `modules/m05/concepts.md` declare `{type: owns, target: "#Invoice"}`
- Indicates conflicting ownership of a shared concept

**How to fix:**
1. Determine which module should be the single owner of this entity.
2. In the winning module's file, keep the `owns` edge.
3. In other modules, change `owns` to `consumes`, `produces`, `triggers`, `gated-by`, or `references` as appropriate (describing how they interact with the entity).
4. Do not leave an entity with multiple owners.

---

### OWN_ORPHAN

**What it means:** An entity is consumed, produced, triggered, gated by, or referenced by a module, but no module declares an `owns` edge for it. The entity has no declared owner.

**Examples:**
- Module M04 has `{type: consumes, target: "modules/m02/concepts.md#Ticket"}`
- But no module has `{type: owns, target: "#Ticket"}` or similar
- The entity is used but nobody is responsible for it

**How to fix:**
1. Identify which module should own this entity (typically the module that defines its core behavior or data structure).
2. Add an `owns` edge in that module's file pointing to the entity:
   ```yaml
   {type: owns, target: "#EntityName"}
   ```
3. Ensure the target anchor exists in your specs (is defined as a heading or explicit anchor).
4. If the entity is truly shared across modules, designate one as the canonical owner.

---

### MSG_LEAK

**What it means:** A module uses a message code (pattern `MSG_<X>_YYY`, e.g., `MSG_M02_E01`) whose prefix (`MSG_M02_`) is owned by a different module.

**Examples:**
- `modules/m03/court.md` contains text `MSG_M02_W08` but only `modules/m02/` owns the `MSG_M02_` prefix.
- A module is reusing another module's message namespace without permission.

**How to fix:**
1. **Option A (preferred):** Mint a new message prefix for the consuming module.
   - Determine your module's prefix (e.g., `MSG_M03_` for M03).
   - Change all occurrences of the leaked message code to use your prefix (e.g., `MSG_M02_W08` → `MSG_M03_W08`).
   - Ensure the owning module declares `{type: owns, target: "#MSG_M03_"}` in its frontmatter.

2. **Option B:** If the message is truly shared/reused, have the consuming module declare co-ownership:
   - Add an `owns` edge in the consuming module for the prefix it's using.
   - Document why both modules need to own the prefix in a note.

3. Validate no MSG_ leaks remain by re-running the validator.

---

### ID_DUP

**What it means:** Within a single file, a structured ID (REQ, BR, CBR, VAL, EC, D, Q, CAT, CONST, TC, or ROLE followed by a hyphen and alphanumeric code) appears in two or more heading lines.

**Scope note:** this check only fires on the closed set of prefixed ID forms above (e.g. `ROLE-FINANCE` rbac role IDs are included). A duplicate heading that is a bare entity name (no ID prefix, e.g. two `### Invoice` headings in different files) is not this check's job — that class of collision is caught by `UNRESOLVED` (ambiguous anchor resolution) and `OWN_DUP` (two modules both `owns` the same anchor), not `ID_DUP`.

**Examples:**
- Two headings both labeled `## REQ-001` in the same file
- Two test cases both labeled `## TC-3-05` in the same file
- Breaks traceability and confuses tooling

**How to fix:**
1. Scan the file for duplicate heading IDs (typically in markdown headings like `## REQID Message`).
2. Deduplicate by:
   - Renumbering one instance to a unique ID (e.g., `## REQ-002`)
   - Removing the duplicate if it's truly redundant
   - Merging the content if both are describing the same requirement
3. Ensure all IDs in the file are unique.
4. Re-run the validator to confirm the finding is gone.

---

### EDGE_VOCAB

**What it means:** A relation in frontmatter uses a `type` value outside the closed vocabulary of allowed relation types.

**Allowed types:** `owns`, `consumes`, `produces`, `triggers`, `gated-by`, `depends-on`, `references`, `defined-by`

**Examples:**
- `{type: uses, target: "#Concept"}` — `uses` is not allowed, should be `consumes` or `references`
- `{type: extends, target: "#Base"}` — `extends` is not in the vocab
- `{type: requiress, target: "#Item"}` — typo; should be `depends-on` or `gated-by`

**How to fix:**
1. Identify the incorrect `type` value in the relation.
2. Choose the semantically correct type from the allowed vocabulary:
   - **owns:** This module is responsible for defining/controlling this entity.
   - **consumes:** This module uses/reads an entity defined elsewhere.
   - **produces:** This module generates/creates instances of an entity.
   - **triggers:** This module initiates behavior in an entity.
   - **gated-by:** Access to this module is controlled by an entity (e.g., permission).
   - **depends-on:** This module requires (but does not consume) another entity to function.
   - **references:** This module points to/documents an entity without using it directly.
   - **defined-by:** This entity is defined/required by another entity (less common; inverse of `owns`).
3. Update the `type` field and re-run the validator.

---

## Regenerating views

After fixing findings and confirming the validator returns zero results, regenerate the specification views:

```bash
python3 scripts/gen_views.py <specs-root>
```

This script:
- Reads all `owns` edges from the graph
- Generates `<specs-root>/registry/_views/ownership-map.md` (which concepts are owned by which modules)
- Generates `<specs-root>/registry/_views/prefixes.md` (which `MSG_<MOD>_` prefixes are owned by which modules)

Example:
```bash
python3 scripts/gen_views.py ../../../specs/srs_final
```

---

## The GATE rule

**Mechanical findings MUST be zero before a module flips `status: documented`.**

Before marking a module as complete and documented:

1. Run the validator on the specs root
2. Address all findings:
   - UNRESOLVED: fix broken links and anchors
   - OWN_DUP: reconcile ownership
   - OWN_ORPHAN: add missing owns edges
   - MSG_LEAK: mint own prefix or reconcile
   - ID_DUP: deduplicate IDs
   - EDGE_VOCAB: use allowed relation types
3. Re-run the validator until exit code is 0 (zero findings)
4. Regenerate views
5. Only then update the module's frontmatter: `status: documented`

This ensures the specification graph is consistent, traceable, and tool-readable.
