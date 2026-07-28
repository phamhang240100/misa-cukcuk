---
name: prototype-execute
description: >
  BA Clarity — Build the prototype. Reads the confirmed PROTOTYPE-PLAN + brand config +
  starter conventions, applies the brand to both light and dark theme, writes a
  consistency contract (PATTERNS.md) that every builder must follow, scaffolds shell +
  auth + profile + dashboard, then spawns parallel `ba-prototype-builder` subagents
  for each business module. Commits atomically. Trigger when user says "build prototype",
  "run prototype-execute", "ship the prototype", "execute plan", or runs /ba:prototype-execute.
---

# /ba:prototype-execute

Precheck → brand apply (light + dark) → write PATTERNS.md contract → build foundation (shell, auth, profile, dashboard) → **BA approves foundation, then freeze** → fan-out modules → tsc + token-lint gates → auto-wire nav → verify.

**Variance containment**: all visual creativity is spent in the foundation phase and reviewed once; after the freeze, module builders have zero styling freedom. Rejecting the foundation is cheap (`git reset` + adjust brand-config axes + regen) because fan-out hasn't run yet.

**Precondition**: `prototype/PROTOTYPE-PLAN.md` has a `<!-- CONFIRMED: ... -->` marker. If not → tell user to run `/ba:prototype-plan` first and stop.

## Design principle

This skill is **theme- and stack-agnostic**. It does NOT mandate specific component names or file names. Starters differ (shadcn, MUI, react-admin, Chakra, Mantine, plain). The skill's job is to make **N parallel subagents converge on the same output** by:

1. Writing a single **consistency contract** (`prototype/PATTERNS.md`) that enumerates every design decision subagents would otherwise drift on.
2. Requiring every subagent to read that contract and apply it literally.

Do NOT ship components as part of the skill. Do NOT reference shadcn-specific classnames in the skill doc.

## Step 1 — Precheck

Read in parallel:

- `prototype/PROTOTYPE-PLAN.md` — confirm CONFIRMED marker. Absent → abort:
  > ❌ Plan not confirmed yet. Run `/ba:prototype-plan`.
- `prototype/brand-config.md` — machine-readable brand tokens. Missing → abort:
  > ❌ Run `/ba:prototype-brand` first.
- `prototype/STARTER.md` — starter conventions. Missing → go to Step 1b (auto-generate).

**DO NOT require an example module.** Builders compose from plan + PATTERNS.md. No `_example/` dependency.

Extract from STARTER.md:
- project type (admin / mobile / marketing / dashboard / mixed)
- theme file path
- tech stack (framework, language, package manager)
- routing convention (file-based / central router / resources)
- primitive library (what's imported from where — e.g. `@/components/ui/*` for shadcn)

Also:
- `cd prototype && git status --porcelain` — if dirty, let user decide (allow override).
- `cd prototype && git rev-parse --abbrev-ref HEAD` — detached HEAD is OK.

Show summary + confirm via `AskUserQuestion` before any write.

## Step 1b — Auto-generate STARTER.md if missing

Infer starter profile from signals:
- `components.json` + `@/components/ui/*` → shadcn/ui
- `react-admin` / `ra-data-*` in deps → react-admin
- `@mui/material` in deps → MUI
- `app/layout.*` + `next.config.*` → Next.js app-router
- `pages/_app.*` → Next.js pages-router
- `vite.config.*` + React → Vite + React
- Tailwind v4 (`@import "tailwindcss"`) → Tailwind 4

Write a minimal STARTER.md with the detected profile. Show it + confirm via `AskUserQuestion`.

## Step 2 — Apply brand to BOTH light and dark

Read `prototype/brand-config.md` — it is a **theme contract**: 5 tokens + 6 axes (`neutral`, `elevation`, `density`, `sidebar`, `table`, `casing`). Tokens map to theme variables; axes map to structural/styling choices that Step 3 translates into PATTERNS.md decisions and Step 4 builds into the foundation. Axes listed under `unsupported-axes` use the starter's default — do not improvise support.

Rules:

1. **Update both modes**. If the starter has `:root` + `.dark` blocks (shadcn/Tailwind), write both. If MUI, export both `createTheme({ palette: { mode: 'light' } })` and `{ mode: 'dark' }`. If another system, find its dark-mode equivalent.
2. **Contrast-aware accent for dark mode**. If the brand accent has OKLCH lightness < 0.5, lighten it to ~0.7 while preserving chroma + hue for the dark block. Apply the same to `--ring` (or equivalent). This prevents the common "oxblood invisible on dark background" bug.
3. **Font variables**. If the brand picks specific fonts (serif headings, mono numerics, sans body), wire them through the starter's font loader mechanism (e.g. `next/font` variables → `--font-sans`, `--font-serif`, `--font-mono`). Apply via a base CSS layer: h1/h2/h3 get serif, tables get tabular-nums, code uses mono.

Copy the brand master doc to `prototype/DESIGN-SYSTEM.md` if one is produced by `/ba:prototype-brand`.

**Commit**: `feat(brand): apply brand tokens to light + dark themes`.

## Step 3 — Write `prototype/PATTERNS.md` (the consistency contract)

This is the **single most important file** for cross-subagent consistency. Every builder reads it.

**Derive, don't invent**: every decision below is the translation of a brand-config token/axis into the starter's idiom — `density: compact` → row padding `py-2` + `text-sm`; `elevation: flat-borders` → table/card wrappers use `border` and no shadow utilities; `table: zebra` → striped rows; `casing: uppercase-labels` → section labels and table headers. Where brand-config is silent, pick the starter's default. PATTERNS.md must state the chosen value AND which axis it came from, so a brand-config change makes it obvious what to regenerate.

Write decisions for every dimension that otherwise drifts between subagents:

### Typography
- Which font is used for page titles (H1), section titles (H2), sub-sections (H3), body, mono/code, and the brand display face — by **utility class or CSS variable name from the starter** (e.g. `font-serif`, `font-mono`, `font-sans`). Do NOT mandate inline styles.
- Where tabular numerals are applied (currency, dates, codes, ID columns).
- Text sizes used in the app (pick: `text-xs` / `text-sm` / default / `text-lg` for which element class).

### Page layout
- Page container width (e.g. "max-w-[1400px] mx-auto" or "max-w-6xl"), padding.
- Where breadcrumbs live, separator glyph, clickable behavior.
- Header pattern: title element + description + right-slot CTA.

### Tables
- Wrapper style (border? rounded? bg-card? Pick one and stick to it).
- Header row style (muted bg? default? bold?).
- Row density (padding — `py-2` compact, `py-3` comfortable).
- Hover state.
- Entity-link column (clickable code → opens View dialog or detail page).
- Row-actions placement (dropdown / inline icons).

### Toolbar above table
- Order: tabs → search → filter toggle → bulk actions (standard), OR flex however starter prefers. Pick one.
- Search input behaves as: debounced vs live vs enter-to-search.
- "Advanced Filters" toggle naming + icon.

### Filter panel
- Container style (what bg, border, padding, rounded).
- Label style (uppercase mini vs sentence-case regular).
- Control sizing (use starter defaults unless otherwise noted).
- Footer buttons (Reset + Apply, order, alignment).

### Pagination
- One pattern only. Pick: (a) starter's Pagination component, (b) custom "← Prev | Page X of Y | Next →", (c) "Showing X of Y". Do not mix.

### Dialogs
- Default max-width per dialog type (form dialog, confirmation, wizard).
- Title font (serif / sans).
- Footer button order (Cancel outlined left, primary right — standard).
- Destructive confirmation uses AlertDialog variant.

### Forms
- Label style + required-indicator + error-text style.
- Input spacing (`space-y-1.5`).
- Section separation (separator vs grid).

### Buttons
- Variants and their semantics: primary (default CTA), outline (secondary), ghost (tertiary / icon-only row action), destructive (delete/irreversible). Never use accent color as a CTA background.
- When to use `size` override: almost never. Starter defaults are the contract.
- Icons inside buttons: size (e.g. `size-4` in default button, `size-3.5` in small contexts), left vs right of text.

### Badges
- Variants and their semantics: status (outline + muted), priority (filled), compliance (accent outline), destructive (solid warning).
- Currency / overdue / regulatory flags use the brand accent color.

### Colors
- Accent color is allowed ONLY on: currency values, overdue / late indicators, compliance / regulatory flags, financial totals, ring/focus state.
- Accent is FORBIDDEN on: primary CTAs, nav items (active uses primary), ordinary badges, default borders.
- Destructive (red) only on delete confirmations.

### Currency + Numbers
- Format (locale-aware or fixed).
- Font (mono? default with tabular-nums?).
- Color (accent for amounts in financial modules; plain in others).

### Dates
- Format (ISO `yyyy-MM-dd` or localized `MMM d, yyyy` — pick one).
- Relative dates ("2 hours ago") use what utility?

### Entity codes
- Scheme (e.g. `PREFIX-YYYY-####`), font (mono), tabular-nums, accent-free.

### Empty / Loading / Error states
- Empty: icon + title + 1-line explanation + optional primary CTA.
- Loading: skeleton rows (for tables), spinner (for save action).
- Error: banner with retry action.
- Exact wording patterns: "No X yet. Create your first X." / "Couldn't load X. Try again." — standardize.

### Icons
- Library (lucide / heroicons / phosphor).
- Sizes used and where.

### Mock data
- Row count per list (e.g. 15–20).
- Realism rules: locale-appropriate names, plausible addresses, realistic amounts, entity codes matching the scheme above, enum coverage (every enum value represented by at least one row).
- No "Lorem ipsum".

### Interactive behavior contract (MUST be enforced)

Every button / form / filter / toggle / action must be **workable against local state**. A prototype with no-op buttons is a dead prototype.

Enumerate:

- **List state shape**: how is the data array held? (e.g. `const [rows, setRows] = useState<Entity[]>(MOCK)`). Standardize.
- **Create mutation**: on Save, append a new row (with a generated id + code per the entity-code scheme) to the list; close dialog; show a success toast.
- **Update mutation**: on Save from Edit dialog, `map` over rows and replace the edited one; close dialog; success toast.
- **Delete / Void / Archive mutation**: remove or flag-update the row in local state; close confirm dialog; toast.
- **Status toggle / Activate / Deactivate**: flip the boolean in local state; inline toast.
- **Filter chips / tabs**: actually filter the rows displayed.
- **Search input**: actually filters by whatever columns are listed in PATTERNS.md (case-insensitive substring).
- **Sort**: actually sorts by the column the user picks.
- **Pagination**: slice rows by current page + page size.
- **Bulk actions** (if present per contract): process every selected row (mutate state + clear selection); toast shows N processed.
- **Drag-to-reorder** (if present): reorder local array; toast on drop.
- **Validation**: required fields that are empty block Save and show inline error; no blank-form submissions.
- **Dialog close behavior**: ESC + overlay click + explicit Cancel all dismiss without mutation.
- **Toast pattern**: which library (typically sonner for shadcn), where mounted, position. Success vs error vs info variants and when each applies.
- **Fake-async delay**: optional. If the starter wants Save-in-progress feel, a 300ms `setTimeout` is fine. Otherwise instant.

**Auth / Profile / Dashboard interactivity**:
- Login Sign-in → validates required fields, then routes to `/` (or the landing).
- Register submit → validates required fields, then shows the success state.
- Forgot submit → validates email format, shows the "check your email" success state.
- Profile Save → updates local form state + toast. "Sign out everywhere" → toast + disabled effect (no real logout).
- Dashboard KPI / cards → clickable if contract says so; link to the relevant list.

### Miscellaneous starter-specific gotchas
- If the primitive library has known gotchas (e.g. shadcn `SelectContent` default `position="item-aligned"` mis-aligns dropdowns — patch to `"popper"`, or shadcn `Dialog` default `sm:max-w-sm` hidden under app-level overrides), document the patch or the workaround here.
- If the starter needs its main layout to have `min-w-0 overflow-x-hidden` (e.g. shadcn sidebar), note it.

Save as `prototype/PATTERNS.md`. **Commit**: `feat(patterns): write consistency contract for builders`.

## Step 4 — Build the foundation (shell, auth, profile, dashboard)

The plan (from `/ba:prototype-plan`) declared these as sections. Build them NOW, before fan-out.

For each of the 4 foundation sections (App Shell, Auth, Profile, Dashboard), follow PATTERNS.md and the plan's spec exactly. Generic guidance:

- **App Shell** — persistent layout per the `sidebar` axis (light / dark / icon-rail) + top header + theme toggle + user menu. Nav items are derived from plan's module list (grouping preserved from plan). Placeholder NAV config is fine now — Step 8 rewires it with final routes.
- **Auth** — 3 outside-shell pages (sign-in / register / forgot). Forms pull fields from plan's Auth section. Submit handlers are no-ops that route to `/` or a success state.
- **Profile** — inside-shell page. Pull sections + fields from plan's Profile section.
- **Dashboard** — inside-shell landing at `/`. KPI cards + panels per the plan (the plan derives them from the module specs — build what the plan says, don't re-derive).

Commit: `feat(foundation): theme + shell + auth + profile + dashboard`.

## Step 4b — Foundation approval gate (then FREEZE)

The foundation is where all visual identity lives — review it BEFORE spending tokens on N modules.

1. Start the dev server; if the `agent-browser` skill is available, capture `/` (light + dark), `/login`, `/profile` screenshots for the BA. Otherwise give the URLs to review manually.
2. `AskUserQuestion`:
   > Foundation ready (preset `{preset}`). Approve and build {N} modules on top?
   > 1. **Approve — freeze foundation and fan out**
   > 2. **Adjust theme** — tell me what feels wrong; I'll map it to brand-config axes (e.g. "nặng nề quá" → density compact→comfortable, elevation filled→flat-borders), `git reset --hard` to the pre-brand commit, and regenerate Steps 2–4. Feedback goes into the config, never a blind reroll.
   > 3. **Abort**
3. Loop on option 2 until approved. Each iteration costs only the foundation — fan-out hasn't run.
4. On approve, the foundation is **frozen**: record in PATTERNS.md (`## FROZEN — {date}`) that theme files, shared components, and PATTERNS.md itself must NOT be modified by module builders. A builder needing a missing pattern reports back (Step 6) — the orchestrator extends PATTERNS.md; builders never edit shared surfaces.

## Step 5 — Pre-scan plan for ambiguities (batched)

Before fan-out, scan `PROTOTYPE-PLAN.md` for issues that would cause independent aborts from parallel builders:

- Plan fields referencing spec fields that don't exist
- Plan screens not enumerating all required states
- Plan actions without a clear target

Batch all ambiguities into a single `AskUserQuestion`. Apply answers to plan or specs (preserve CONFIRMED marker).

## Step 6 — Fan-out business modules

For each business module, extract a **structured contract** from the plan:

```json
{
  "name": "...",
  "resource": { "camel": "...", "pascal": "...", "kebab": "..." },
  "route": "/...",
  "screens": [
    { "type": "list", "fields": [...], "actions": [...], "states": {...}, "filters": [...] },
    { "type": "createDialog", "fields": [...], ... },
    ...
  ],
  "detail_page": true | false,
  "spec_path": "specs/modules/{slug}/ — builder reads index.md, then data.md + requirements.md; never the whole specs/ tree"
}
```

Inject the JSON inline in each subagent prompt — avoids 10× redundant re-reads of the plan file.

**Spawn all `ba-prototype-builder` subagents in a single message** (parallel tool calls).

Each subagent prompt must include:
- The module's JSON contract (inline)
- Absolute paths: `STARTER_MD`, `DESIGN_SYSTEM_MD`, **`PATTERNS_MD`**, `MODULE_SPEC`, `PROTOTYPE_ROOT`
- Pointer to the primitive-library import path (from STARTER.md)
- **No `EXAMPLE_DIR`**. No reference to an example module.

Show user which modules are building.

After all return:
- If any builder reported "pattern X undefined in PATTERNS.md" → extend PATTERNS.md, re-dispatch that builder.
- If builders edited a central config file in parallel → re-apply sequentially in orchestrator to dedupe.

## Step 7 — Gates: TypeScript + token-lint

**7a. TypeScript**: `cd prototype && <typecheck-command>` (from STARTER.md: `npx tsc --noEmit`, or `vue-tsc`, or starter's equivalent).

**7b. Token-lint** — mechanical enforcement that builders used tokens, not raw values. Grep the module files written this run:

```bash
grep -rnE '\[#[0-9a-fA-F]{3,8}\]|#[0-9a-fA-F]{6}|\[[0-9]+(px|rem)\]|style=\{\{' <module files>
```

Every hit is a violation (allowed exceptions: mock-data strings, SVG fill in icon files if the starter's icons work that way — note exceptions in PATTERNS.md). Raw hex, arbitrary Tailwind values, and inline styles bypass the theme contract — they are how "one accent for the whole app" quietly breaks. Also check the freeze: `git diff --name-only` must not touch theme files / shared components / PATTERNS.md from a builder commit.

For both gates: map each violation to its module, re-dispatch that module's builder with the violation list attached. Max 2 retries per module; surface persistent failures to user.

## Step 8 — Auto-wire nav + landing

- Regenerate the shell's nav config from the final module list (route, label, icon from a label → icon map).
- Update landing/dashboard links to point to real routes.
- Group items if the plan groups modules (Practice / Finance / Operations / Administration, etc.).

Commit: `feat(nav): auto-generate sidebar nav from module list`.

## Step 9 — Atomic commits

For each successful module: `git add <files> && git commit -m "feat({resource-kebab}): scaffold prototype module"`.

Final marker: `git commit --allow-empty -m "chore(prototype): scaffold complete"`.

## Step 10 — Verify

Use `agent-browser` skill if available:
- Start dev server (`npm run dev` / `pnpm dev`)
- Visit `/`, `/login`, `/profile`, and one screen per module
- Check: no console errors, sidebar nav works, theme toggle works, dark-mode contrast on accent elements, dialogs render at intended widths, no horizontal page overflow

If unavailable, tell user to run the dev server and walk through URLs manually.

## Step 11 — Final report

```
✅ Prototype ready — {N} modules + shell + auth + dashboard

Routes:
  /                       Dashboard
  /login, /register, /forgot   Auth
  /profile                Profile
  /<module>               {N} business modules

Brand: light + dark both wired ({theme file})
Patterns contract: prototype/PATTERNS.md
Skeleton: shell + auth + profile + dashboard

Next:
  1. Review at http://localhost:3000/
  2. Incremental edit: update PROTOTYPE-PLAN.md then re-run — only changed modules rebuild.
  3. Deploy when happy.
```

## Operating principles

1. **PATTERNS.md is the contract** — inconsistency happens when N subagents each decide typography / pagination / filter panel on their own. The contract kills that window. And the contract itself is derived from brand-config axes — the theme contract steers, PATTERNS.md translates, builders obey.
2. **Foundation approved before fan-out** — all visual variance is contained in one reviewable, cheaply-regenerable phase. Reject = `git reset` + axis change, not a full rebuild.
3. **Theme-agnostic, stack-agnostic** — never hard-code component names or CSS classes in the skill doc. Write RULES, let the orchestrator translate to the starter's idiom in PATTERNS.md.
4. **Update both light and dark** — brand apply writes both with contrast math. Dark mode is not a stretch goal.
5. **No `_example/` dependency** — removing it eliminates a common failure mode ("starter not ready").
6. **Gates are mechanical, not judgment** — typecheck + token-lint + freeze-check; re-dispatch offending modules. Convention without a gate is a suggestion.
7. **Commit atomically** — partial failure should leave a clean tree.

## Language

All output in English.
