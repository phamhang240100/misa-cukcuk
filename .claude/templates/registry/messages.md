---
type: message-prefix
---

# Message Prefix Registry

> **SSOT for message-code prefixes.** Each module owns exactly one reserved prefix; collisions are forbidden. Cross-cutting messages use the single reserved global prefix. A module never emits another module's prefix; it declares ownership via an `owns` relation (module → `registry/messages.md#MSG_{MOD}_`) — this file just indexes those edges (the authoritative map is generated to `registry/_views/prefixes.md`).

Each prefix is its own heading-anchor: `registry/messages.md#MSG_{MOD}_`.

### MSG_GLOBAL_ — (global)
Scope: cross-cutting only.

### MSG_{MOD}_ — {slug}
Scope: messages of {slug} only.

Rules: one prefix ↔ one owner (no `MSG_TR_*` shared by Trust and Tasks) · pick module prefixes that cannot alias each other · borrowing another module's code for a local situation is forbidden — mint your own.

<!-- Open items -->
[NEEDS-CLARIFICATION: Q-REG-NN (medium) — <prefix collision>? — suggested: <reassignment>]
