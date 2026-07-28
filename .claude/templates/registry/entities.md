---
type: entity-index
---

# Entity Ownership Registry

> **SSOT for who owns each entity.** Every entity in the system appears here exactly once with exactly one owning module. Non-owner modules reference an entity by name/ID only and bind to the contract below — they never re-declare its fields. Seeded at the scope-gate; appended whenever a module introduces a new shared entity.

## Ownership map

| Entity | Owner (module slug) | Kind | One-line | Sharing |
|--------|--------------------|------|----------|---------|
| {Entity} | {slug} | core / lookup / join | {what it is} | private / shared-read / shared-write |

Rules: exactly one owner per row · no entity may be `core` in two modules · a `shared-write` entity is still written only through the owner module's rules.

## Shared-entity contracts

For every entity marked `shared-read`/`shared-write`, the **owner** locks the contract here; consumers bind to it. Each `### {Entity} — owner {slug}` heading below is a heading-anchor: its first token (`{Entity}`) is the ID other files target as `registry/entities.md#{Entity}` in an `owns`/`consumes` relation and in inline links — never as a bare name.

### {Entity} — owner {slug}
- **Canonical fields:** `field: type` · `field: type` …
- **Status enum (fixed values):** `A | B | C`
- **Consumers:** {slug} (reads {fields}) · {slug} (requests write via owner)

<!-- Open items -->
[NEEDS-CLARIFICATION: Q-REG-NN (high) — <unowned/contested entity>? — suggested: <owner>]
