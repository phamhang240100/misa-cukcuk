---
id: {slug}
type: module
status: pending
priority: P0
depends_on: []
relations:
  - {type: owns, target: "#{Entity}"}
  - {type: consumes, target: "../{other-slug}/data.md#{Entity}", note: "{why this module reads it}"}
  - {type: depends-on, target: "../{other-slug}/index.md"}
  - {type: gated-by, target: "../../registry/rbac.md#{ROLE-ID}"}
---

# {MODULE_NAME}

> {One-line description}

## Purpose

{What business problem this module solves, who it serves — 2-3 sentences max}

## Actors

| Actor | Role | Permissions in this module |
|-------|------|---------------------------|
| {actor} | {role} | {what they can do} |

## Entities

| Entity | Description | Detail |
|--------|-------------|--------|
| {entity} | {1-line} | `data.md` |

## Dependencies

| Dependency | Type | What it provides |
|-----------|------|------------------|
| {module/service} | Internal / External / 3rd-party | {1-line} |

## Shared references

What this module binds to in `registry/` (bind only — never redefine here). These are **not** bare IDs: each is a typed edge in this file's frontmatter `relations:` (canonical, machine-checked by `check_graph.py`), plus a markdown link `[ID](file#ID)` at first mention in prose. The table below is a human-readable index of those same edges — the `relations:` block above is the source of truth.

| Kind | Edge type | Target (registry heading-anchor) | Role in this module |
|------|-----------|-----------------------------------|---------------------|
| Entity (owned) | `owns` | `#{Entity}` (this file) | this module owns it — contract in `registry/entities.md` |
| Entity (consumed) | `consumes` | `../{owner-slug}/data.md#{Entity}` | reads/uses via owner contract |
| Catalog | `consumes` | `../../registry/catalogs.md#CAT-{NAME}` | {where used} |
| Constant | `consumes` | `../../registry/catalogs.md#CONST-{NAME}` | {where used} |
| Role | `gated-by` | `../../registry/rbac.md#{ROLE-ID}` | {which actions} |
| Message prefix | `owns` | `../../registry/messages.md#MSG_{MOD}_` | this module's reserved prefix |

## Open items

{List of unresolved `Q-{MOD}-NN` markers currently in this module's files, one line each with file name — or `none`.}

> Keep this file to one screen. It is the entry point every skill and reader loads first — detail belongs in `requirements.md`, `data.md`, `rules.md`, `edge-cases.md`, `decisions.md`, and the generated `test-cases.md`.
