---
description: Bridge BA Clarity specs to GSD planning — convert specs/ into .planning/ drafts
---

Bridge between the `ba@duongvanha-skills` plugin (which produces `specs/`) and the GSD workflow (which reads from `.planning/`).

**Goal**: ingest the full output of BA Clarity and generate **draft** `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md` in `.planning/` so the dev can review and jump straight to `/gsd:plan-phase` **without running `/gsd:new-project`** (BA already did the deep analysis).

## Step 1 — Preconditions

1. Read `specs/.clarity/state.json`. If missing → abort with:
   > ❌ `specs/.clarity/state.json` not found. Run `/analyze` first to produce BA specs.

2. Read `current_version` from `state.json`, locate `specs/.clarity/reports/clarity-v{N}.md`.

3. Check if `.planning/` already exists:
   - If absent → create it, continue
   - If it already contains `PROJECT.md`, `REQUIREMENTS.md`, or `ROADMAP.md` → ask via `AskUserQuestion`:
     > `.planning/` already has files. How to proceed?
     > 1. **Overwrite** — replace existing, backup old copies to `.planning/.backup-{timestamp}/`
     > 2. **Merge** — only generate missing files, keep existing ones
     > 3. **Abort** — stop, do nothing
   - Honor the user's choice

## Step 2 — Ingest all BA outputs

Read **every** file below (do not skip any):

**Required**:
- `specs/overview.md` — project name, what-it-is, scope, module map, roles
- `specs/glossary.md` — domain terms (dev context)
- `specs/business-rules.md` — rules with triggers/exceptions/examples
- `specs/edge-cases.md` — boundary conditions
- `specs/modules/*.md` — detailed per-module specs (use Glob to list all, read all)
- `specs/clarification-log.md` — Q&A audit trail
- `specs/.clarity/reports/clarity-v{N}.md` — single source of truth, **most important** — contains Confirmed Requirements and Pending TODOs

**Optional (if present)**:
- `specs/.clarity/discussion-log.md` — context from `/discuss`

## Step 3 — Extract structured data

From the files above, extract an internal structure:

```
project_name      — from specs/overview.md heading
what_it_is        — description paragraph in overview.md (2-3 sentences)
core_value        — "Core Value" or "Goal" line in overview.md (infer from main module if absent)
modules[]         — each: { name, description, actors, key_rules, dependencies }
requirements[]    — flattened from modules + business-rules; each: { id, category, description, impact, source_module }
constraints[]     — from overview.md (tech stack is T3 fixed) + business-rules (performance, security)
out_of_scope[]    — from overview.md "Out of Scope" section (if present)
todos[]           — pending items from clarity-v{N}.md: { id, question, impact, suggested_default }
decisions[]       — confirmed answers from clarification-log.md
```

**Requirement ID convention**: `{MODULE_PREFIX}-{NN}` — e.g. module `auth` → `AUTH-01`, `AUTH-02`. Prefix is uppercase, 3-5 leading characters of the module name.

## Step 4 — Generate `.planning/PROJECT.md`

Use template `../get-shit-done/templates/project.md`. Fill in:

| Section | Data source |
|---|---|
| `# [Project Name]` | `project_name` |
| `## What This Is` | `what_it_is` |
| `## Core Value` | `core_value` |
| `### Active` | each module → one bullet `- [ ] {module_name}: {one-line description}` |
| `### Out of Scope` | `out_of_scope[]` |
| `## Context` | 3 lines: "Imported from BA Clarity v{N}", "Clarity score: {X}%", "Source: specs/.clarity/reports/clarity-v{N}.md" |
| `## Constraints` | First row: `**Tech stack**: Next.js 15 + tRPC + Prisma + Shadcn/MUI + PostgreSQL (fixed per BA Clarity)`. Append any other constraints from business-rules |
| `## Key Decisions` | Table from `decisions[]` (Decision / Rationale / Outcome=Pending) |
| `*Last updated*` | `{today} after /ba-to-gsd bridge from clarity-v{N}` |

## Step 5 — Generate `.planning/REQUIREMENTS.md`

Use template `../get-shit-done/templates/requirements.md`. Fill in:

- Heading `# Requirements: {project_name}`
- `**Defined**: {today}`, `**Core Value**: {core_value}`
- Section `## v1 Requirements`:
  - Each module → one sub-heading `### {Module Name}`
  - Under each sub-heading, list its requirements
  - Format: `- [ ] **{ID}**: {description}`
  - **TODO markers**: if a requirement derives from an unclarified TODO, add `<!-- TODO: {clarity_id} — {question} -->` on the next line
- Section `## Out of Scope`: table from `out_of_scope[]`
- Section `## Traceability`: leave empty (filled once roadmap exists)

## Step 6 — Generate `.planning/ROADMAP.md`

Use template `../get-shit-done/templates/roadmap.md`. Fill in:

- Heading `# Roadmap: {project_name}`
- `## Overview`: one paragraph "Build v1 of {project_name} by delivering {N} modules across {N} phases"
- `## Phases` — **infer dependencies**:
  - Modules with dependency on `auth`, `user` → Phase 1 (foundation)
  - Simple CRUD modules with no dependencies → Phase 2
  - Modules that depend on other modules → later phases
  - Reporting/analytics modules → final phases
  - Default: 1 phase = 1 module, unless two modules are tightly coupled
- For each phase:
  ```
  ### Phase {N}: {Module Name}
  **Goal**: {one-line}
  **Depends on**: {previous phase or "Nothing (first phase)"}
  **Requirements**: [{ID list from that module}]
  **Success Criteria**:
    1. {observable behavior}
    2. ...
  **Plans**: TBD (will be generated by /gsd:plan-phase)
  ```

**Principle**: this is a **draft**. Prepend `<!-- DRAFT: please review and adjust before /gsd:plan-phase -->` to the top of ROADMAP.md.

## Step 7 — Generate `.planning/BA-HANDOFF.md`

Supplementary file, not in GSD templates but needed so the dev does not lose context:

```markdown
# BA Handoff — {Project Name}

**Imported from**: specs/.clarity/reports/clarity-v{N}.md
**Clarity score**: {X}%
**Date**: {today}

## What was imported

- PROJECT.md — high-level context
- REQUIREMENTS.md — {N} requirements across {M} categories
- ROADMAP.md — {K} phases (draft, please review)

## Open TODOs — action required

Pending clarifications from BA. The dev must either:
- Answer with best judgment (record as decision in PROJECT.md)
- Or escalate back to client via `/export` and `/refine`

| # | ID | Question | Impact | Suggested Default |
|---|----|----------|--------|-------------------|
| 1 | {id} | {question} | 🔴 High | {default} |
| ... |

## Key decisions already confirmed

From specs/clarification-log.md:
- {decision 1}
- {decision 2}
- ...

## Source specs

Full details in:
- specs/overview.md — scope + module map
- specs/glossary.md — domain terms (READ THIS FIRST)
- specs/business-rules.md — every rule with examples
- specs/modules/ — per-module deep specs
- specs/.clarity/reports/clarity-v{N}.md — BA source of truth

## Next steps

1. **Review** the 3 draft files above — especially ROADMAP.md phase ordering
2. **Resolve** any blocking 🔴 High TODOs
3. Run `/gsd:plan-phase 1` to generate PLAN.md for Phase 1
4. When ready, `/gsd:execute-phase 1`
```

## Step 8 — Report to user

Print a summary:

```
✅ Bridge complete — BA Clarity v{N} → .planning/

Generated:
  .planning/PROJECT.md         ({M} modules mapped to Active requirements)
  .planning/REQUIREMENTS.md    ({N} requirements, {T} TODOs)
  .planning/ROADMAP.md         ({K} phases draft)
  .planning/BA-HANDOFF.md      (review summary + open TODOs)

⚠️  Pending clarifications: {T_high} High, {T_mid} Medium, {T_low} Low
    Review .planning/BA-HANDOFF.md before proceeding.

Next steps:
  1. Review the 4 files above
  2. Adjust ROADMAP.md phase ordering if needed
  3. /gsd:plan-phase 1   — generate PLAN.md for Phase 1
```

## Operating principles

1. **Never overwrite silently** — always ask before touching an existing `.planning/`
2. **Draft, not final** — every generated file starts with `<!-- DRAFT from /ba-to-gsd -->`
3. **Do not over-infer** — when data is missing, use the placeholder `[TBD - fill after review]` instead of fabricating
4. **Preserve traceability** — every requirement should reference its source in `specs/` via inline comment if needed
5. **TODO markers must be copied verbatim** — `<!-- TODO: {clarity_id} — {question} -->` so the dev immediately sees unresolved gaps
6. **Never mutate `specs/`** — that is the BA source of truth; the bridge is read-only for it

## Language

All output files and user-facing reports: **English**.
