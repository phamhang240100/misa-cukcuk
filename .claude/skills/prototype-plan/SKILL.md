---
name: prototype-plan
description: >
  BA Clarity — Generate a theme-agnostic UX plan for the prototype. Reads specs + starter
  conventions, produces a screen-and-flow list adapted to the project type (admin, mobile,
  marketing, dashboard, mixed), then asks BA to confirm. Output goes to
  prototype/PROTOTYPE-PLAN.md. No technical language — BA reads screens and flows only.
  Trigger when user says "plan prototype", "prototype plan", "build a plan for the prototype",
  or runs /ba:prototype-plan.
---

# /ba:prototype-plan

Load specs → read starter conventions → extract per-module screens & flows → BA confirm → lock plan.

## Step 1 — Load inputs (lazy)

Read in parallel:
- `specs/overview.md` — project name, module map, scope, roles
- `specs/rules.md` — cross-cutting rules (CBR-*)
- `specs/glossary.md` — domain terms
- `prototype/STARTER.md` — starter conventions

Then read every module's `specs/modules/{slug}/index.md` (small files: purpose, actors, entities, deps). Do NOT bulk-load the rest; open a module's `data.md` and `requirements.md` only when extracting that module's screens in Step 3, one module at a time. `rules.md`/`edge-cases.md` only if a screen decision depends on them.

(Legacy flat layout `specs/modules/{name}.md`: read those files instead, and suggest running `/ba:spec` to migrate.)

If `specs/` is missing or empty → abort:
> ❌ No specs found. Run `/ba:spec` first to produce specs.

If `prototype/STARTER.md` is missing → warn, but continue. Ask BA the project type with `AskUserQuestion`:
> ⚠️ `prototype/STARTER.md` not found. Ask the dev to add it, or pick the project type now to proceed.

## Step 2 — Determine project type + screen vocabulary

From STARTER.md (or BA answer), map project type to **screen vocabulary** used in the plan:

| Project type | Screen vocabulary |
|---|---|
| `admin` | List / Create Dialog / View Dialog / Edit Dialog / Confirmation Dialog / Detail Page (only with sub-entities) |
| `mobile` | List Screen / Detail Screen / Form Screen / Bottom Sheet |
| `marketing` | Landing Section / Feature Section / CTA Block / Contact Form |
| `dashboard` | Overview Panel / Widget / Detail Drawer / Filter Panel |
| `mixed` | Ask BA per module which section it belongs to (admin vs public vs mobile), then apply the corresponding vocabulary for each |

Use `AskUserQuestion` only for the `mixed` case, asking the BA to tag each module.

## Step 3a — Inject shell/auth/profile/dashboard (admin + dashboard only)

Before extracting business modules, prepend these **built-in sections** to the plan. Their *presence* is built-in for `admin` and `dashboard` project types (the BA does not need to spec them) — but the Dashboard's *contents* are derived from the module specs, per below.

Order at the top of the plan:

1. **App Shell** — persistent chrome: sidebar nav (grouped by module family), top header (breadcrumb auto from route, theme toggle, user menu with Profile + Sign out), responsive collapse.
2. **Auth** — 3 screens outside the shell:
   - **Sign-In Page** — email + password + "Forgot" link + link to Register. No SSO unless BA asks.
   - **Register Page** — request-an-account form (first/last name, email, role, office, LSO number if legal-domain, password + confirm, AUP checkbox). Submit → "Request submitted, await admin approval" success screen.
   - **Forgot Password Page** — email input → "Check your email" confirmation screen.
3. **Dashboard** — landing at `/` inside the shell. **Derive the contents from the module specs** — the dashboard is the single most client-specific screen and the cheapest differentiation you have; a generic dashboard wastes it. Compose:
   - **4 KPI cards** from the P0 modules: entity counts (from `data.md` entities), financial sums (money-typed fields), and counts of records in attention states (from `data.md` state machines — e.g. "overdue", "pending approval")
   - **1 "today's activity" list** from whichever P0 entity carries dates (appointments, hearings, deliveries — read the domain from `overview.md`)
   - **1 exceptions panel** from state-machine "bad" states across modules (items needing attention)
   - **1 recent-activity feed**
   Name every KPI/panel with the domain's own vocabulary (from `glossary.md`) — "Hearings today", not "Today's items". Only fall back to generic labels when specs are too thin to derive.
4. **Profile** — personal info form (name, phone, ext), security card (change password, sign out everywhere), active sessions table, recent activity. Accessible from user menu in shell.

If project type is `mobile` or `marketing` — **skip** this step. These app archetypes don't need the same shell.

For project type `mixed` — ask BA via `AskUserQuestion` whether the shell/auth/profile apply.

Each injected section uses the same Fields + Actions + States format as business modules. Write them generically (no specific-entity invention). Examples: Dashboard KPIs use "Entity count / Outstanding financial / Exceptions flagged / Variance" instead of naming entities the spec hasn't agreed on.

## Step 3 — Extract per-module screens & flows

Process **one module at a time** — this is when you open that module's `data.md` + `requirements.md`. For each module, extract:
- **Entity** (what the module manages — `index.md` / `data.md`)
- **Actors** (who uses it — `index.md`)
- **Actions** (list/create/read/update/delete/archive + custom actions — `requirements.md` REQ sections)
- **Key fields** (the 3–5 most important fields for list columns — `data.md`)
- **Flows** (happy path + key alternates — the Flow blocks inside `requirements.md`)

Translate each into the chosen screen vocabulary. Example for admin:
- action "list" → **{Entity} List** — search, filter by {key fields}, button `+ New {Entity}`
- action "create" → **New {Entity} Dialog** — fields: {list}
- action "read" → **View {Entity} Dialog** — read-only, actions: Edit / Archive
- action "update" → **Edit {Entity} Dialog** — pre-filled, editable
- action "archive" → **Archive Confirmation Dialog**

Do not invent screens the spec doesn't justify. If a spec only mentions "list + create", produce 2 screens, not 4.

## Step 4 — Write `prototype/PROTOTYPE-PLAN.md`

Plan must be **thick enough** — each screen fully specifies **fields + actions + states** so builder has no room to invent. Thin plans (label + one-liner) are forbidden.

Follow this structure:

```markdown
# Prototype Plan — {Project Name}

> Project type: {type}
> Generated: {date}

## Module: {Module Name}

### Screens

#### {Screen 1 label}
- **Purpose**: {one-line, no tech terms}
- **Fields shown** (list every one — name + short note):
  - {Field A} — {note, e.g. "status badge"}
  - {Field B} — ...
- **Actions** (every button/link/interaction):
  - {Action 1, e.g. "Create new" → opens Create Dialog}
  - {Action 2, e.g. "Archive" → opens Archive Confirmation}
- **States** (must list each that applies; "not applicable" is fine but must be explicit):
  - Empty: {what shows when zero records}
  - Loading: {what shows while fetching} — OR `not applicable` if static
  - Error: {what shows on failure} — OR `not applicable`
  - Disabled/read-only: {when + what}

#### {Screen 2 label}
... (same shape)

### User Flow
1. {Actor} → {Screen} → {action} → {outcome}
2. ...

---

(repeat per module)

---

## Open notes
{anything BA should decide later, or modules skipped because specs are incomplete}
```

Rules for writing:
- **No technical language** — no component names (`DataGrid`, `Dialog`, `Drawer`), no CSS/theme/token mentions, no file paths. "Dialog" is OK as screen vocabulary only.
- **Every screen must have Fields + Actions + States** — no exceptions. If you can't fill one of the three, ask BA via `AskUserQuestion` before finalizing the plan; do NOT guess.
- **Fields come from module spec only** — if a field is not in the spec, don't add it. If the spec is missing a field you think is needed → ask BA, do not infer.
- **Actions come from module spec only** — same rule. Actions not in spec → ask BA.
- **States**: every screen must explicitly state empty / loading / error — even if "not applicable" (for static screens). This blocks builder from inventing toasts/spinners on their own.
- **No "and more" / "etc."** — enumerate. Builder reads the list literally.
- **Flows are short** — 2–5 numbered steps, each naming an actor + screen + action + outcome.

Save the file. Do not add the `CONFIRMED` marker yet.

## Step 5 — Present to BA and invite edits

Show the generated plan to the user in the chat, then ask via `AskUserQuestion`:

> Plan generated at `prototype/PROTOTYPE-PLAN.md`. What next?
>
> 1. **Confirm** — lock the plan and move to `/ba:prototype-execute`
> 2. **Edit inline** — tell me which module/screen to change and I'll update
> 3. **I'll edit the file myself** — I'll re-check when you say "done"
> 4. **Abort** — discard and leave the file as-is

Loop on option 2/3 until BA picks 1 or 4.

## Step 6 — Lock the plan (when BA confirms)

`Edit` the plan file to insert a confirmation marker at the very top (after the `#` title):

```markdown
# Prototype Plan — {Project Name}

<!-- CONFIRMED: {ISO date} -->
...
```

Show the user:

> ✅ Plan locked at `prototype/PROTOTYPE-PLAN.md`.
>
> **Next step**: `/clear` then `/ba:prototype-brand` (if brand config missing) then `/ba:prototype-execute`.

## Step 7 — Status when aborted

If BA aborts or doesn't confirm:

> 📝 Plan saved to `prototype/PROTOTYPE-PLAN.md` without the confirmation marker. `/ba:prototype-execute` will refuse to run until the marker is present.
>
> You can re-run `/ba:prototype-plan` any time.

## Rules

- **Starter vocabulary is law** — once you pick a project type, stick to its screen vocabulary. Do not mix "Dialog" and "Screen" in the same admin plan.
- **Specs are ground truth for screens** — do not invent actions, entities, fields, or states not in the spec.
- **Don't know → ask, don't infer.** If a screen needs a field/action/state that the spec doesn't cover, call `AskUserQuestion` to ask BA — do not infer from "common pattern" or "usually admin panels have...".
- **BA language only** — the plan is for the BA to confirm, not for devs. Zero technical jargon.
- **Never auto-confirm** — the plan is only locked when BA explicitly confirms in chat.

## Language

All output in English.
