---
name: prototype-execute
description: >
  BA Clarity — Build the prototype. Reads the confirmed PROTOTYPE-PLAN + brand config +
  starter conventions, applies the brand to the theme file, then spawns parallel
  `ba-prototype-builder` subagents to replicate the starter's example module for each
  module in the plan. Commits atomically per module. Trigger when user says
  "build prototype", "run prototype-execute", "ship the prototype", "execute plan",
  or runs /ba:prototype-execute.
---

# /ba:prototype-execute

Precheck → apply brand → replicate starter pattern per module (parallel) → mock data → verify.

**Precondition**: `prototype/PROTOTYPE-PLAN.md` has a `<!-- CONFIRMED: ... -->` marker. If not → tell user to run `/ba:prototype-plan` first and stop.

## Step 1 — Precheck

Read in parallel:

- `prototype/PROTOTYPE-PLAN.md` — confirm CONFIRMED marker exists. If absent → abort with:
  > ❌ `prototype/PROTOTYPE-PLAN.md` is not confirmed yet. Run `/ba:prototype-plan` first, review, and confirm.
- `prototype/brand-config.md` — machine-readable brand tokens. If missing → abort with:
  > ❌ `prototype/brand-config.md` missing. Run `/ba:prototype-brand` first.
- `prototype/STARTER.md` — starter conventions. If missing → abort with:
  > ❌ `prototype/STARTER.md` missing. Ask the dev maintaining the starter to add it (see plugin README for format).

Extract from STARTER.md:
- **project type** (admin / mobile / marketing / dashboard / mixed)
- **theme file path** (e.g. `src/app/globals.css`, `theme.ts`, `tailwind.config.ts`)
- **example module path** (e.g. `src/app/(protected)/admin/_example/`)
- **registration entry file(s)** (e.g. `src/app/(protected)/resources.tsx`)
- **mock strategy** (e.g. `ra-data-fakerest`, MSW, local JSON)
- **tech stack**

Verify **example module** exists (Glob its path). If empty/absent → abort with:
> ❌ Starter example module at `{path}` is empty. Ask dev to populate `_example/` with a full working module before retrying.

Also run in parallel:
- `cd prototype && git status --porcelain` — abort if uncommitted changes: tell user to commit or stash first.
- `cd prototype && git branch --show-current` — record as `prototype_branch` for commit messages.

Summarize to user before continuing:

```
✅ Precheck passed
   Project type: {type}
   Starter branch: {branch}
   Theme file:    {path}
   Example dir:   {path}
   Modules to build: {N}

Proceed? (I will apply brand, then build {N} modules in parallel.)
```

Use `AskUserQuestion` to confirm before any write.

## Step 2 — Apply brand (Phase 1, sequential)

Read `prototype/brand-config.md` (format defined in `/ba:prototype-brand`).

Based on starter's **theme file path**:
- If it's `globals.css` (shadcn/Tailwind) → rewrite the `@theme` / `:root` variable block with tokens from brand-config.
- If it's `theme.ts` (MUI) → rewrite `createTheme({ palette, typography, shape, spacing })` with tokens. Accept lower quality (shadcn is primary).
- If it's `tailwind.config.ts` → update `theme.extend.colors/fontFamily/borderRadius`.
- Any other file type → best effort, follow the pattern visible in that file.

Copy `design-system/MASTER.md` (from `/ba:prototype-brand` output) to `prototype/DESIGN-SYSTEM.md` — the contract all subagents read. If the file is already at `prototype/DESIGN-SYSTEM.md`, leave it.

**Commit** `cd prototype && git add <theme-file> DESIGN-SYSTEM.md && git commit -m "feat(brand): apply brand tokens to theme"`.

## Step 3 — Scaffold modules (Phase 2, parallel subagents)

Parse `PROTOTYPE-PLAN.md` → list of modules with their spec paths. For each module, determine:
- `TARGET_MODULE_NAME` (the label from PROTOTYPE-PLAN, e.g. `Material Receiving`)
- `TARGET_RESOURCE` (camelCase), `TARGET_RESOURCE_PASCAL`, `TARGET_RESOURCE_KEBAB`
- `MODULE_SPEC` path (from PROTOTYPE-PLAN — usually `specs/modules/{name}.md`)

**Spawn all `ba-prototype-builder` subagents in a single message** (parallel tool calls):

For each module, call the Agent tool with:
- `subagent_type`: `ba-prototype-builder`
- `description`: `Build {PascalName} module`
- `prompt`: include absolute paths for STARTER_MD, EXAMPLE_DIR, DESIGN_SYSTEM_MD, **PROTOTYPE_PLAN_MD**, MODULE_SPEC, PROTOTYPE_ROOT, plus **TARGET_MODULE_NAME** and the 3 resource-name variants.

While subagents run, show the user which modules are being built.

**After all subagents return**:
1. Review each subagent's report.
   - **If a builder aborted asking for a plan/spec decision** (e.g. "Plan says field `X` but spec has no such field", "Plan silent on empty state for screen `Y`") → use `AskUserQuestion` to resolve with the user. Then update `PROTOTYPE-PLAN.md` / `MODULE_SPEC` with the decision (preserve `<!-- CONFIRMED -->` marker), and **re-dispatch** that module's builder. Do NOT silently guess.
   - **If a builder aborted on a structural/starter issue** (missing example, ambiguous registration) → surface to user, skip that module, continue with others.
2. For each successful module, commit atomically: `cd prototype && git add <files> && git commit -m "feat({resource-kebab}): scaffold prototype module"`.
3. If registration entry files got edited by multiple subagents in parallel and conflict → re-run the edits sequentially in orchestrator (main) to dedupe.

## Step 4 — Invoke aesthetic polish (Phase 2b, optional)

If the `frontend-design` skill is available (check by reading `$HOME/.claude/plugins/frontend-design/` or similar), invoke it on the changed files for a polish pass.

Skip silently if not installed. Do not block the workflow.

## Step 5 — Verify (Phase 4)

Use the `agent-browser` skill if available:
- Start the dev server (`cd prototype && bash init.sh` or `pnpm dev` depending on starter).
- Visit one screen per module (infer path from registration entry — e.g. `/admin/{resource-kebab}`).
- Verify: page renders without console errors, list/form/show interactions work.
- Collect results.

If `agent-browser` is not available, tell user to open the dev server manually and walk through the list of URLs.

## Step 6 — Final report

```
✅ Prototype ready — {N} modules built, {M} failed

Modules built:
  ✓ {PascalName}  — {path}
  ✓ ...
Modules failed:
  ✗ {PascalName} — {abort reason}

Brand applied to: {theme file}
Mock data seeded in: {mock strategy location}

Next steps:
  1. Review at http://localhost:3000/{first-module-path}
  2. If anything looks off, iterate by editing PROTOTYPE-PLAN.md and re-running /ba:prototype-execute on specific modules (or starting fresh).
  3. When happy, run `/ba-finish` (if available) to save prototype + specs.
```

## Operating principles

1. **Precheck hard, commit easy** — never start writing if preconditions fail. But once started, commit atomically so partial failure does not leave the tree messy.
2. **Starter is boss** — every path, naming, and mock strategy comes from STARTER.md or the example. Never hardcode assumptions.
3. **Subagents in parallel** — each module is isolated; spawn them all at once, then aggregate results.
4. **Never bypass failing preconditions** — if STARTER.md or example is missing, stop. Do not try to improvise.
5. **No backend code** — this skill builds UI mockups only. If the starter example includes tRPC stubs, subagents replicate those; do not invent them here.

## Language

All output in English. BA may input in any language.
