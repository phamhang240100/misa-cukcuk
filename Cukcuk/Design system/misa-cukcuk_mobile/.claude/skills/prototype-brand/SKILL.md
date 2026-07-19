---
name: prototype-brand
description: >
  BA Clarity — Generate a visual brand identity for the prototype. Asks BA 3 questions
  (industry, tone, reference app), delegates to the `ui-ux-pro-max` skill to pick palette,
  UI style, font pairing, and UX rules from its local database, then distills a 7-token
  brand-config the execute skill will apply to the theme. Outputs specs/brand.md
  (human-readable) + prototype/brand-config.md (machine-readable). Fail-soft if
  ui-ux-pro-max is not installed. Trigger when user says "brand the prototype",
  "pick a brand", "prototype identity", or runs /ba:prototype-brand.
---

# /ba:prototype-brand

Load context → 3-question BA brief → delegate `ui-ux-pro-max` → 7 tokens → save.

## Step 1 — Load context

Read in parallel:
- `specs/overview.md` — project name, scope, domain
- `specs/glossary.md` — domain terms (helpful for matching industry)

If missing → warn but continue. Ask BA for project name and industry directly.

## Step 2 — BA brief (3 questions via `AskUserQuestion`)

Ask all 3 in one `AskUserQuestion` call:

1. **Industry** — options: `Construction`, `Fintech`, `Healthcare`, `Editorial/media`, `SaaS/productivity`, `Retail/e-commerce`, `Logistics`, `Legal`, `Other`
2. **Tone** — options: `Precise/corporate`, `Approachable/modern`, `Industrial/utilitarian`, `Editorial/warm`, `Playful/consumer`, `Dark-first pro`
3. **Reference app** (free-form for "Other", or options): `Linear`, `Procore`, `Stripe`, `Notion`, `Figma`, `Supabase`, `Resend`, `Other (I'll name it)`

Collect BA's answers. Keep them in memory for the next step.

## Step 3 — Delegate to `ui-ux-pro-max` (if installed)

Check whether `ui-ux-pro-max` skill is available. Common install paths:
- `~/.claude/plugins/ui-ux-pro-max-skill/`
- `~/.claude/skills/ui-ux-pro-max/`
- `<project>/.claude/skills/ui-ux-pro-max/`

If found: spawn a subagent (`general-purpose`, model `sonnet`) with a prompt like:

> Invoke the `ui-ux-pro-max` skill to generate a design system for a project in the `{industry}` industry with `{tone}` tone, referencing `{reference_app}`. Use `search.py --design-system --persist` (or equivalent per the skill's SKILL.md). Output should land in `design-system/MASTER.md` and `assets/design-tokens.json` / `.css`. After the skill finishes, read those files and return:
>
> - Palette (primary hex, background hex, accent hex)
> - Typography (heading font, body font)
> - Shape (border radius value)
> - Density (spacing scale)
> - Shadow style (flat vs elevated)
> - Link to MASTER.md for details

Wait for the subagent's report. If it fails for any reason → fall through to Step 3b.

## Step 3b — Fail-soft (if ui-ux-pro-max is not installed or fails)

Use the following static mapping table to derive tokens directly from the BA's 3 answers.

### Industry × Tone → base palette

Pick the palette by the tone first, modulate by industry:

| Tone | Primary (oklch) | Background | Accent |
|---|---|---|---|
| Precise/corporate | `oklch(0.55 0.18 250)` (steel blue) | `oklch(0.98 0 0)` (zinc-50) | `oklch(0.6 0.2 30)` (amber) |
| Approachable/modern | `oklch(0.7 0.15 180)` (teal) | `oklch(0.99 0.005 80)` (stone-50) | `oklch(0.65 0.2 330)` (pink) |
| Industrial/utilitarian | `oklch(0.45 0.05 60)` (dark khaki) | `oklch(0.96 0.01 60)` (stone-100) | `oklch(0.55 0.2 30)` (orange) |
| Editorial/warm | `oklch(0.45 0.1 40)` (terracotta) | `oklch(0.96 0.015 80)` (cream) | `oklch(0.35 0.05 20)` (umber) |
| Playful/consumer | `oklch(0.7 0.2 330)` (pink) | `oklch(0.99 0 0)` (white) | `oklch(0.75 0.18 90)` (yellow) |
| Dark-first pro | `oklch(0.75 0.12 230)` (ice blue) | `oklch(0.15 0.01 240)` (near-black) | `oklch(0.7 0.2 30)` (amber) |

### Tone → shape + density + shadow

| Tone | Radius | Density | Shadow |
|---|---|---|---|
| Precise/corporate | `0.25rem` | compact | flat (none) |
| Approachable/modern | `0.75rem` | comfortable | soft (1-layer) |
| Industrial/utilitarian | `0rem` | compact | none |
| Editorial/warm | `0.5rem` | spacious | soft |
| Playful/consumer | `1rem` | spacious | soft |
| Dark-first pro | `0.25rem` | compact | flat |

### Reference app → font pairing (override)

| Reference | Heading font | Body font |
|---|---|---|
| Linear | Inter (drop for distinctiveness → `Geist`) | Geist |
| Procore | `DM Sans` | `DM Sans` |
| Stripe | `Sohne` fallback `Geist` | `Geist` |
| Notion | `Inter` | `Inter` |
| Figma | `Inter` | `Inter` |
| Supabase | `Custom` fallback `Geist Mono` for headings | `Geist` |
| Resend | `Berkeley Mono` fallback `JetBrains Mono` headings | `Inter` |
| Other/none | `DM Sans` heading | `DM Sans` body |

If the BA typed a custom reference app, try to match it against the table by name similarity; otherwise default to `DM Sans` / `DM Sans`.

### Output

Combine selections into 7 tokens:

```yaml
primary: <oklch>
background: <oklch>
accent: <oklch>
radius: <rem>
heading-font: <family>
body-font: <family>
density: compact | comfortable | spacious
shadow: none | flat | soft | layered
```

## Step 4 — Write outputs

### `specs/brand.md` (human-readable for BA review)

```markdown
# Brand — {Project Name}

> Generated: {date}

## BA brief
- **Industry**: {industry}
- **Tone**: {tone}
- **Reference**: {reference_app}

## Tokens (7)
| Token | Value | Why |
|---|---|---|
| Primary | `{oklch}` | {1-line rationale} |
| Background | `{oklch}` | ... |
| Accent | `{oklch}` | ... |
| Radius | `{rem}` | ... |
| Heading font | `{family}` | ... |
| Body font | `{family}` | ... |
| Density | `{value}` | ... |
| Shadow | `{value}` | ... |

## Preview idea
{1 short paragraph describing how screens will feel — e.g. "Compact admin tables with steel-blue accents on a near-white stone background; sharp corners and flat surfaces read as precise and corporate."}

## Source
{Either "Generated by ui-ux-pro-max — see design-system/MASTER.md" or "Generated from static mapping (fail-soft — ui-ux-pro-max not installed)."}
```

### `prototype/brand-config.md` (machine-readable for execute)

```markdown
# brand-config

<!-- Consumed by /ba:prototype-execute. Do not edit by hand. -->

project: {name}
generated: {ISO date}
source: ui-ux-pro-max | static

tokens:
  primary: {oklch}
  background: {oklch}
  accent: {oklch}
  radius: {rem}
  heading-font: {family}
  body-font: {family}
  density: {value}
  shadow: {value}

master-doc: {path to design-system/MASTER.md or "n/a"}
```

## Step 5 — Show BA the preview + next step

Show the "Preview idea" paragraph from `specs/brand.md` to the user. Then:

> ✅ Brand saved.
> - Human-readable: `specs/brand.md`
> - Machine-readable: `prototype/brand-config.md`
> {if ui-ux-pro-max ran: + `design-system/MASTER.md`}
>
> **Next step**: `/clear` then `/ba:prototype-plan`, then `/ba:prototype-execute`.

## Rules

- **Always suggest**, never ask more than 3 questions — BA doesn't want a design interview.
- **Fail-soft is real** — the static mapping must produce a valid 7-token set for any combination of the 6 tones × 9 industries × 8 references. Do not abort if `ui-ux-pro-max` is missing.
- **Brand-config is machine input, not BA reading material** — do not ask BA to edit it. All BA edits happen in `specs/brand.md`, then re-run `/ba:prototype-brand` to refresh.

## Language

All output in English.
