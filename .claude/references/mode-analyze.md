# Mode: analyze — scope-first structured analysis

Resume check → ingest → **lock scope with BA** → clarify → document **one scope unit at a time**.

Read first, in this order:
1. **`../templates/format.md`** — spec layout, frontmatter contract, marker grammar, ID scheme (everything this skill writes)
2. **`clarification-loop.md`** (same directory) — the question loop, sub-agent prompts, hard rules, pre-write gate (shared with the refine mode)

Principles: context lives on disk, not in memory (BA can `/clear` anytime and re-run to resume) · versioning is git (no changelogs, no version numbers, no report snapshots) · one source of truth (open questions = inline markers; module status = `index.md` frontmatter; each rule defined once) · never analyze or generate more than one scope unit at a time — big generations hallucinate.

## Step 0 — Resume check

Check `specs/overview.md` and scan `specs/modules/*/index.md` **frontmatter only** (first ~10 lines each).

- **No `specs/overview.md`** → fresh project, go to Step 1.
- **Any module `pending` or `clarifying`** → resume: skip to **Module session**. Do NOT ask the user to re-provide input — everything needed is in `specs/` + `specs/.clarity/intake/`.
- **All modules `documented`** → suggest `/ba:spec` or `/ba:spec status`. Stop.

**Crash-consistency guard**: frontmatter can lie after an interrupted session. For every `documented` module, verify the folder actually contains all 6 spec files — if any are missing, the write was interrupted: flip it back to `clarifying` and resume it (its intake + decisions are on disk; rewrite the folder from them). Never trust `documented` without the files.

## Step 1 — Ingest input

Accept anything: pasted text, files, screenshots, PDFs, transcripts, existing specs, source code, **and `specs/.clarity/discussion-log.md`** if present (facts there = initial confirmed requirements; its open points = starting markers).

Extract: **actors**, **actions**, **data flows**, **business rules**, **dependencies**.

## Step 2 — Scope gate (MANDATORY — before any deep analysis)

Build a **Scope Map**: module list (slug, 1-line description, **owned entities**, priority, depends_on), in/out-of-scope list, roles, external dependencies.

### How to break modules — right-size rules

Cut by **business capability**, never by screen or tech layer (no "frontend", "database", "common/utils" modules).

A module is **right-sized** when ALL of these hold:
- **One sentence, no "and"** — "Manage orders from table to kitchen" ✅ · "Manage orders and process payments" ❌ split.
- **Owns 1–3 core entities**, and every entity in the project is owned by **exactly one** module (others reference by ID). Two modules writing the same entity = wrong boundary.
- **Fits one clarify-session**: foresee roughly **3–8 user stories**. More → split by sub-capability or actor. Fewer than 2 AND its entity's lifecycle is completed by a neighbor → merge into that neighbor.
- **Shallow dependencies** — uses other modules' entities by reference only. Two modules needing each other's internals both ways → merge or re-cut.

Standard cuts: CRUD-heavy domain → one module per aggregate entity (Clients, Cases, Invoices) · a workflow spanning entities → its own module (Billing, Appeals) · auth/roles/notifications → cross-cutting (`_global`), NOT a module — unless it carries real business flows (e.g. registration-approval workflow).

**Show your reasoning**: each module gets its 1-line responsibility + owned entities + why the boundary sits there. Where a cut is debatable, present merge and split variants as gate options with 1-line trade-offs and a recommendation — don't silently pick.

### The gate

Present the Scope Map via `AskUserQuestion` — BA can merge, split, rename, drop, add modules. Also propose the working style: **≤3 modules** → single pass (same layout) · **4+** → one module per session, cross-cutting first. BA may override either way.

**Never proceed past this gate without explicit confirmation.** A wrong or oversized scope unit is what produces hallucinated specs.

### On confirmation — persist scope to disk immediately

1. `specs/overview.md` — template `../templates/overview.md`.
2. `specs/glossary.md` — skeleton with terms so far.
2b. `specs/registry/entities.md`, `catalogs.md`, `rbac.md`, `messages.md` — from `../templates/registry/`. Seed from what is already known:
   - **entities.md**: place every entity extracted in Step 1 into the ownership map, exactly one owner each. An entity nobody clearly owns → keep the row with a `Q-REG-NN` marker (this is how orphan/contested entities surface at scope time).
   - **rbac.md**: the confirmed role taxonomy + known permissions; never model `isAdmin`/flags as roles.
   - **messages.md**: reserve one `MSG_<MOD>_` prefix per module (collision-free).
   - **catalogs.md**: any enum/lookup already known to be shared by 2+ modules; unknowns stay empty.
   Unknowns stay as `Q-REG-NN` markers — the registry is a living SSOT, seeded now and appended as modules land.
3. `specs/modules/{slug}/index.md` — skeleton per module: frontmatter (`id`, `status: pending`, `priority`, `depends_on`) + purpose line only.
4. `specs/.clarity/intake/{slug}.md` per module — template `../templates/intake.md`. **Quote the source input generously** — after `/clear` this is the only copy of what the client said about this module. Open questions found later are appended here as markers until the module's spec exists.

Then: single pass → **Single-pass flow**. Otherwise → **Global round**.

## Single-pass flow (small projects)

```
Progress:
- [ ] Spawn detectors (completeness + consistency + domain-researcher)
- [ ] Clarification loop until "finish"
- [ ] Pre-write gate
- [ ] Write all module folders + global files
- [ ] Wrap-up
```

Spawn all three detector agents in parallel in one message — `completeness-analyst`, `consistency-checker`, `ba-domain-researcher` (skip silently if domain unclear) — per the sub-agent rules in `clarification-loop.md`, with all extracted requirements inline. Write findings as markers into the intake files, then run the loop.

On finish trigger + pre-write gate: write the full spec — every module folder (6 files, templates in `../templates/module/`), `specs/rules.md` (CBR-*), `specs/edge-cases.md` (EC-GLOBAL-*), `specs/decisions.md`, final `overview.md` + `glossary.md`. Unresolved markers move from intake into the spec files at the exact relevant spots; answered questions become `decisions.md` entries; every module's frontmatter → `status: documented`. Then spawn one `testcase-generator` **per module in parallel (one message, background)** — each gets only its module path; they write `test-cases.md` while you do **Wrap-up**. Relay each generator's one-line summary (and any uncovered/blocked atoms) when they finish.

## Global round (large projects — same session as the scope gate)

Clarify only **cross-cutting** concerns: roles & permissions, auth, shared entities, integrations, project-wide rules — do NOT dive into module details yet.

Spawn `completeness-analyst` + `consistency-checker` with only the cross-cutting slice inline, plus `ba-domain-researcher` once for the whole project. Global questions = `Q-GLOBAL-NN`, markers in `specs/.clarity/intake/_global.md`. Run the loop.

On finish trigger + pre-write gate, write: final `overview.md`, `glossary.md`, `specs/rules.md`, `specs/edge-cases.md`, `specs/decisions.md` (D-GLOBAL-*). Unresolved global markers go inline in those files. Then hand off:

> ✅ Scope locked, global concerns clarified. {N} modules pending.
>
> **Next**: `/clear` then `/ba:spec` — resumes with **{first pending module by priority}**. One module per session keeps specs grounded. (Type "continue" to do it now instead — fresh session recommended.)

## Module session (each subsequent run — or "continue")

```
Module {slug} progress:
- [ ] Confirm target module with BA
- [ ] frontmatter → clarifying
- [ ] Claim registry (entities/prefix/roles/catalogs used by this module)
- [ ] Right-size check (re-split if oversized)
- [ ] Spawn detectors (this module only)
- [ ] Clarification loop until "finish"
- [ ] Pre-write gate
- [ ] Write specs/modules/{slug}/ (6 files)
- [ ] Spawn testcase-generator (background — runs while handing off)
- [ ] Hand off to next module
```

**Context budget — load ONLY**: frontmatter scan of all `index.md` (to pick the target) · `specs/overview.md` · `specs/glossary.md` · `specs/.clarity/intake/{slug}.md`. ⛔ NOT other modules' folders or intake files, NOT raw input. If a question genuinely needs another module, open only that module's `index.md`.

1. Pick the highest-priority `pending` module. Confirm via `AskUserQuestion`: *"Continue with **{module}** ({done}/{total} documented)?"* — yes / pick another / stop.
2. Set frontmatter `status: clarifying` (persist immediately).
2b. **Claim registry (before clarifying).** Load `specs/registry/*` (frontmatter-cheap files, read fully). For this module:
   - Register the entities it owns/consumes. If an entity it needs is already owned by another module → bind to that owner's contract (do not re-declare). If two modules would own the same entity, or an entity it needs has no owner → **raise the conflict now** (`AskUserQuestion`), resolve, update `entities.md`.
   - Confirm its reserved `MSG_<MOD>_` prefix; if a message it needs would reuse another module's prefix → conflict, mint its own.
   - Bind roles/catalogs/constants to existing registry IDs; a needed value that differs from the registry's → conflict, reconcile in the registry (single source), not in the module.
   Context budget: this adds `specs/registry/*` to the allowed loads — still NOT other modules' folders.
3. **Re-split guard**: if clarification reveals the module breaks the right-size rules (10+ user stories emerging, a second entity cluster with its own lifecycle, a responsibility needing "and") — pause, propose a split via `AskUserQuestion`. On approval: update `overview.md`'s module map, create the new module's `index.md` skeleton + intake file (moving the relevant quotes and markers), resume with the smaller module. Never push through an oversized module.
4. Spawn `completeness-analyst` + `consistency-checker` for **this module only** (sub-agent rules in `clarification-loop.md`; read the domain-research cache instead of re-spawning the researcher). Run the loop.
5. On finish trigger + pre-write gate: write `specs/modules/{slug}/` — all 6 files from `../templates/module/`. Rules referenced from requirements by ID only — never restate rule text. Unresolved markers move from intake into the spec files at the exact relevant spots; `index.md` Open items lists them; answered questions become `D-{MOD}-NN` entries. **Write order matters**: content files first, then `index.md` with `status: documented` LAST — the frontmatter flip is the commit point. If the session dies mid-write, the module still reads as `clarifying` and the crash-consistency guard (Step 0) rebuilds it.
   Before flipping `index.md` to `documented`: if this module introduced a new shared entity, catalog, constant, or needs a new permission, **append it to `specs/registry/*` first** (registry is the SSOT — the module only references the new ID). The module's `index.md` → "Shared references" lists every registry ID it binds to.

   **5b. Mandatory QA gate — REQUIRED before the `documented` flip. Do NOT flip `status: documented` until every sub-step below is clean:**
   1. Run `python3 skills/spec/scripts/check_graph.py <specs-root>` (run from the plugin root, i.e. `.claude/`; mechanical validator, see `mode-validate.md`). Mechanical findings — `UNRESOLVED`, `OWN_DUP`, `OWN_ORPHAN`, `MSG_LEAK`, `ID_DUP`, `EDGE_VOCAB` — **MUST all be 0**. Do NOT flip to `documented` until `check_graph.py` exits 0. Any nonzero finding → fix the just-written files and re-run; this is not optional and not deferrable to a later reconcile.
   2. Spawn `consistency-checker` + `completeness-analyst` again, this time on the **just-written module files on disk** (not only the clarify-loop input from step 4) — a fresh semantic pass catches drift introduced by the writing step itself. Every finding they return MUST become either a fix applied immediately to the written files, or an explicit `[NEEDS-CLARIFICATION]` marker left in place (never silently dropped).
   3. Only flip `index.md` to `status: documented` once BOTH hold: (a) `check_graph.py` is clean (exit 0), AND (b) all semantic findings from 5b.2 are resolved into fixes or intentional `[NEEDS-CLARIFICATION]` markers. A module with unresolved mechanical findings or un-triaged semantic findings MUST stay `clarifying`.
   4. Immediately after the flip, regenerate views: `python3 skills/spec/scripts/gen_views.py <specs-root>` (run from the plugin root, i.e. `.claude/`).
6. Spawn `testcase-generator` in the **background** with just the module path — it reads the folder from disk and writes `test-cases.md` (the 7th file) while you hand off. Don't wait for it; relay its one-line summary when it completes. If it reports uncovered atoms, that's a spec bug — fix before the next module.
7. Hand off:

> ✅ Module **{name}** documented ({done}/{total}). {K} open questions remain in it.
>
> **Next**: `/clear` then `/ba:spec` → resumes with **{next module}**. Or type "continue".
> Also: {N} modules documented — run `/ba:spec reconcile` to sweep cross-module boundaries before continuing.

Immediately after the `documented` flip (before the hand-off message above, or as its first action), auto-run a **module-scoped reconcile**: this module's edges (entities/messages/catalogs/roles it claims or consumes) against sibling modules only — not the full-project sweep. Use the same checks as `mode-reconcile.md`, restricted to `{slug}`'s registry bindings vs. the modules it touches. Any cross-module conflict found here is surfaced now, while this module's context is still loaded, rather than deferred to the later full `/ba:spec reconcile` sweep.

"continue" → loop to 1 in-session, but recommend `/clear` after every 1–2 modules — a long session accumulates context and defeats the purpose.

After the last module → **Wrap-up**.

## Wrap-up

- No 🔴 markers left → ✅ analysis complete. **Next**: `/clear` then `/ba:spec` when client sends answers, or `/ba:spec export` for a client-ready question list.
- 🔴 markers remain → 📋 saved with {N} high-impact open questions (grep `NEEDS-CLARIFICATION`). Same next steps.
- Before sending to the client or moving to prototype: run `/ba:spec reconcile` to sweep cross-module boundaries (entity ownership, catalog/message/RBAC drift) across all documented modules.

Scope Assumptions go in `overview.md`, marked "do not ask client".

## Default assumptions (never ask client)

Web only, always online — no PWA/offline · no data migration · no mobile app (responsive web) · single language/timezone/currency · no legacy integration · no phased rollout · standard auth (email/password or SSO) · no audit logging · no real-time (polling is fine).

**Principle: don't open doors the client hasn't knocked on.**

## Tech stack context (fixed — do not flag as an open question unless a requirement explicitly conflicts)

Next.js (App Router) + tRPC + Prisma + Shadcn/MUI · react-data-grid · React Admin · NextAuth · PostgreSQL · React Native (mobile only if needed, no native code).

## Style

- All output in English; BA may input in any language.
- **Always suggest an answer** with every question — simplest dev-friendly default; clients confirm faster than they explain.
- Simplest viable solution (solo dev, ship fast) · atomic requirements, EARS acceptance criteria · Mermaid for diagrams, never ASCII art.
