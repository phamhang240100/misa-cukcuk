---
type: role
---

# RBAC Registry

> **SSOT for the role taxonomy and the permission matrix.** No module defines its own roles or invents role names. Modules bind to a role via a `gated-by` relation (+ inline link) to the role's heading-anchor below, never a bare role name. If a module needs a permission not listed, add the row here first.

## Roles (closed taxonomy)

Each role is its own heading — first token (`{ROLE-ID}`) is the anchor: `registry/rbac.md#{ROLE-ID}`.

### {ROLE-ID} — {name}
| Field | Value |
|-------|-------|
| Description | {who} |
| Is a real role? | yes (never model `isAdmin`/flags as roles) |

## Permission matrix (role × module × action)

| Role | Module | Action | Allowed | Gate (none / password / owner-only) |
|------|--------|--------|---------|--------------------------------------|
| {role} | {slug} | {action} | yes/no | {gate} |

Rules: one taxonomy for the whole system · a name used in a module but absent here is a drift → fix here · carve-outs (e.g. read-only auditor viewing financials) are explicit rows, not per-module prose.

<!-- Open items -->
[NEEDS-CLARIFICATION: Q-REG-NN (high) — <role drift / undefined role>? — suggested: <resolution>]
