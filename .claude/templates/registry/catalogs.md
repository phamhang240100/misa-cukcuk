---
type: catalog
---

# Shared Catalogs & Constants Registry

> **SSOT for enumerations/lookup catalogs used by 2+ modules, and numeric constants/config defaults referenced in 2+ modules.** Defined once here; modules bind by a `consumes` relation (+ inline link) to the `CAT-*` / `CONST-*` heading-anchor below and never re-list the values.

## Catalogs

Each catalog is its own heading — the heading's first token (`CAT-{NAME}`) is the anchor a module's `relations` and inline links resolve against (`registry/catalogs.md#CAT-{NAME}`).

### CAT-{NAME} — {title} (owner: {slug})
| Code | Label | Flags / metadata |
|------|-------|------------------|
| {code} | {label} | {flags} |

Referenced by: {slug}, {slug}. Source of truth for count + values + flags.

## Constants

Each constant is its own heading for the same reason — anchor `registry/catalogs.md#CONST-{NAME}`.

### CONST-{NAME} — {desc}
| Value | Owner | Referenced by |
|-------|-------|---------------|
| {value+unit} | {slug} | {slugs} |

Rules: a value appearing in 2+ modules MUST be a `CAT-`/`CONST-` heading here · modules bind to the anchor, never the literal.

<!-- Open items -->
[NEEDS-CLARIFICATION: Q-REG-NN (high) — <catalog with conflicting counts/values>? — suggested: <which one is canonical>]
