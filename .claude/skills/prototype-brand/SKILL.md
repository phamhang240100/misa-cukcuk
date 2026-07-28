---
name: prototype-brand
description: >
  BA Clarity — Generate the theme contract for the prototype. Asks BA 3 questions (industry,
  tone, reference app), proposes a curated preset "personality" plus per-axis overrides
  (color, neutrals, elevation, density, radius, fonts, sidebar/table variants), optionally
  enriched by Anthropic's `frontend-design` skill. Outputs specs/brand.md (human-readable) +
  prototype/brand-config.md (machine-readable theme contract consumed by prototype-execute).
  Fail-soft if `frontend-design` is not installed. Trigger when user says "brand the
  prototype", "pick a brand", "prototype identity", "theme", or runs /ba:prototype-brand.
---

# /ba:prototype-brand

Load context → 3-question BA brief → propose **preset + axes** → BA confirms/tweaks → save theme contract.

## Why presets + axes (not free choice)

In admin UI ~90% of pixels are neutrals and text — accent color alone cannot differentiate clients. Real identity comes from the **combination of axes**: neutral temperature, elevation strategy, density, radius, type, sidebar/table variants. But free axis combinations produce broken looks (low contrast, clashing strategies), so BA picks a **curated preset** and tweaks at most 1–2 axes. Creativity happens here, once per client — never per screen.

## Step 1 — Load context

Read in parallel:
- `specs/overview.md` — project name, scope, domain
- `specs/glossary.md` — domain terms (helps match industry)
- `prototype/STARTER.md` § "Theme axes" — which axes this starter actually implements. **An axis the starter doesn't support cannot be configured** — fall back to the starter's default and list it under `unsupported-axes` in the output. If STARTER.md or the section is missing, assume all axes supported and note the assumption.

If specs missing → warn but continue; ask BA for project name and industry directly.

## Step 2 — BA brief (3 questions via `AskUserQuestion`)

Ask all 3 in one call:

1. **Industry** — `Construction`, `Fintech`, `Healthcare`, `Editorial/media`, `SaaS/productivity`, `Retail/e-commerce`, `Logistics`, `Legal`, `Other`
2. **Tone** — `Precise/corporate`, `Approachable/modern`, `Industrial/utilitarian`, `Editorial/warm`, `Playful/consumer`, `Dark-first pro`
3. **Reference app** — `Linear`, `Procore`, `Stripe`, `Notion`, `Figma`, `Supabase`, `Resend`, `Other (I'll name it)`

## The theme contract — presets and axes

### Axes (10)

| Axis | Values | What it changes |
|---|---|---|
| `primary` | OKLCH | UI chrome color |
| `accent` | OKLCH | reserved: $ amounts, overdue, compliance flags, focus ring |
| `neutral` | `warm` / `cool` / `pure` | background + surface + border ramp temperature |
| `elevation` | `flat-borders` / `soft-shadows` / `filled-surfaces` | how surfaces separate: 1px borders vs shadows vs tinted fills |
| `density` | `compact` / `comfortable` / `spacious` | row heights, padding scale, text sizes |
| `radius` | rem | global border-radius scale |
| `heading-font` + `body-font` | families | body must have tabular numerals; NOT Inter unless reference demands |
| `sidebar` | `light` / `dark` / `icon-rail` | shell chrome character |
| `table` | `lined` / `zebra` / `card-rows` | data surface character |
| `casing` | `sentence` / `title` / `uppercase-labels` | headings + table headers + section labels |

### Presets (pick by tone, modulate by industry/reference)

| Preset | neutral | elevation | density | radius | sidebar | table | casing | feels like |
|---|---|---|---|---|---|---|---|---|
| `crisp` | cool | flat-borders | compact | 0.25rem | light | lined | sentence | Linear — precise, engineering |
| `soft` | cool-white | soft-shadows | comfortable | 0.75rem | light | lined | sentence | Stripe — polished SaaS |
| `enterprise` | pure | flat-borders | compact | 0rem | dark | zebra | uppercase-labels | Carbon — institutional, dense |
| `warm-editorial` | warm | soft-shadows | spacious | 0.5rem | light | card-rows | title | calm professional services |
| `dark-pro` | cool (dark-first) | flat-borders | compact | 0.25rem | icon-rail | lined | sentence | operator console |

Tone → preset default: Precise/corporate → `crisp` · Approachable/modern → `soft` · Industrial/utilitarian → `enterprise` · Editorial/warm → `warm-editorial` · Playful/consumer → `soft` + radius 1rem + accent tweak · Dark-first pro → `dark-pro`.

Color derivation (primary/accent per tone) and font pairing (per reference app) — reuse these tables:

| Tone | Primary (oklch) | Accent |
|---|---|---|
| Precise/corporate | `oklch(0.55 0.18 250)` steel blue | `oklch(0.6 0.2 30)` amber |
| Approachable/modern | `oklch(0.7 0.15 180)` teal | `oklch(0.65 0.2 330)` pink |
| Industrial/utilitarian | `oklch(0.45 0.05 60)` dark khaki | `oklch(0.55 0.2 30)` orange |
| Editorial/warm | `oklch(0.45 0.1 40)` terracotta | `oklch(0.35 0.05 20)` umber |
| Playful/consumer | `oklch(0.7 0.2 330)` pink | `oklch(0.75 0.18 90)` yellow |
| Dark-first pro | `oklch(0.75 0.12 230)` ice blue | `oklch(0.7 0.2 30)` amber |

| Reference | Heading font | Body font |
|---|---|---|
| Linear | `Geist` | `Geist` |
| Procore | `DM Sans` | `DM Sans` |
| Stripe | `Sohne` fallback `Geist` | `Geist` |
| Notion / Figma | `Inter` | `Inter` |
| Supabase | `Geist Mono` headings | `Geist` |
| Resend | `Berkeley Mono` fallback `JetBrains Mono` headings | `Inter` |
| Other/none | `DM Sans` | `DM Sans` |

### Validity rules (check before presenting)

- Accent must be readable on the background: OKLCH lightness delta ≥ 0.35 in both light and dark modes (execute lightens for dark, but don't start from an impossible pair).
- `filled-surfaces` requires `neutral: warm|cool` (tinted fills are invisible on `pure`).
- `icon-rail` sidebar requires ≤ 9 top-level nav groups (check overview module map; more → fall back to `dark`).
- Same-industry repeat client (BA mentions it or you know it): propose a preset **different** from the previous client's — differentiation between clients is the point.

## Step 3 — Enrich via `frontend-design` (if installed)

Check availability (registers as `frontend-design:frontend-design`; also look under `~/.claude/plugins/*/frontend-design/`, `~/.claude/plugins/cache/anthropics-claude-code/*/skills/frontend-design/`, `<project>/.claude/skills/frontend-design/`).

**If installed**, spawn a subagent (`general-purpose`, model `sonnet`):

> Invoke the `frontend-design` skill to propose a brand direction for a `{industry}` project, `{tone}` tone, referencing `{reference_app}`. Output feeds a working admin prototype. Return: (1) which of these presets fits best: crisp / soft / enterprise / warm-editorial / dark-pro, (2) values for these axes: primary (OKLCH), accent (OKLCH), neutral warm|cool|pure, elevation flat-borders|soft-shadows|filled-surfaces, density compact|comfortable|spacious, radius (rem), heading-font, body-font (tabular numerals, not Inter unless reference demands), sidebar light|dark|icon-rail, table lined|zebra|card-rows, casing sentence|title|uppercase-labels, (3) a 1-paragraph aesthetic direction with a name (e.g. "Chancery Modern"), (4) a 1-paragraph preview describing how screens will feel. Optionally write a richer doc to `design-system/MASTER.md`.

Subagent fails or not installed → derive everything from the static tables above (fail-soft; mention `/plugin install frontend-design@anthropics-claude-code` for richer results).

## Step 4 — Present & confirm

Show the BA: preset name, the 10 axes as a table, the preview paragraph. Then `AskUserQuestion`:

> Theme proposal: **{preset}** — {aesthetic direction name}. Accept?
> 1. **Accept** 2. **Tweak an axis** (density / elevation / sidebar / table / radius / colors) 3. **Different preset** (show the other 4)

On tweak: apply, re-check validity rules, re-present. Loop until accept. **Cap tweaks at ~2 axes** — beyond that, suggest switching preset instead (heavy tweaking breaks the curated coherence).

## Step 5 — Write outputs

### `specs/brand.md` (human-readable)

```markdown
# Brand — {Project Name}

## BA brief
- **Industry / Tone / Reference**: {answers}

## Theme: preset `{preset}`{, tweaked: {axis list} if any}

| Axis | Value | Why |
|---|---|---|
| Primary | `{oklch}` | {1-line} |
| Accent | `{oklch}` | ... |
| Neutral | {value} | ... |
| Elevation | {value} | ... |
| Density | {value} | ... |
| Radius | `{rem}` | ... |
| Heading / Body font | {families} | ... |
| Sidebar | {value} | ... |
| Table | {value} | ... |
| Casing | {value} | ... |

## Preview idea
{1 short paragraph — how screens will feel}

## Source
{frontend-design | static mapping (fail-soft)}
```

### `prototype/brand-config.md` (machine-readable — the theme contract)

```markdown
# brand-config

<!-- Theme contract. Consumed by /ba:prototype-execute. Do not edit by hand —
     to change the look, edit axes here IS the steering wheel for regen. -->

project: {name}
source: frontend-design | static
preset: {preset}

tokens:
  primary: {oklch}
  accent: {oklch}
  radius: {rem}
  heading-font: {family}
  body-font: {family}

axes:
  neutral: {warm|cool|pure}
  elevation: {flat-borders|soft-shadows|filled-surfaces}
  density: {compact|comfortable|spacious}
  sidebar: {light|dark|icon-rail}
  table: {lined|zebra|card-rows}
  casing: {sentence|title|uppercase-labels}

unsupported-axes: [{axes the starter doesn't implement — starter default applies}]
master-doc: {path to design-system/MASTER.md or "n/a"}
```

## Step 6 — Next step

> ✅ Theme contract saved (`specs/brand.md` + `prototype/brand-config.md`).
>
> **Next**: `/clear` then `/ba:prototype-plan`, then `/ba:prototype-execute`. Don't like the foundation later? Edit the axes in brand-config and regen — the config is the steering wheel, git is the undo.

## Rules

- **3 questions max** — BA doesn't want a design interview. Everything else is proposed, not asked.
- **Fail-soft is real** — static tables must produce a valid contract for any tone × industry × reference combo.
- **Axes the starter doesn't support are not silently configured** — list them in `unsupported-axes` and tell the BA.
- **Brand-config is machine input** — BA edits happen via this skill (or by editing axes + regen), not by hand-editing token values.

## Language

All output in English.
