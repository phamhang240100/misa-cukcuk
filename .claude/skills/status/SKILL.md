---
name: status
description: >
  BA Clarity — Show current project status: clarity score, answered vs pending unclear points,
  current phase, and recommended next action. Trigger when user says "status", "where are we",
  "progress", "how clear are we", "what's pending".
---

# /ba:status

Read `specs/.clarity/state.json` to find current version, then read `specs/.clarity/reports/clarity-v{N}.md` → output summary.

**If no `.clarity/` folder exists**, tell user to start with `/ba:discuss` or `/ba:analyze`.

## Output format

```
Project: {name}
Phase: {phase}
Clarity Score: {score}% (v{version})

Answered: {n} items
Pending:  {n} items (🔴 {n} High, 🟡 {n} Medium, 🟢 {n} Low)
TODO:     {n} items (unresolved, marked in spec files)

Spec files: {list generated files in specs/}

Recommended next action: {what to do}
```

## Phases

| Phase | Meaning |
|-------|---------|
| `discussion` | Gathering context via `/ba:discuss` |
| `analysis` | Iterative clarification in `/ba:analyze` |
| `documented` | Documents generated, may have TODOs |
| `complete` | No 🔴 High items remain |

## After status

Based on current state, suggest the appropriate next step:
- Pending 🔴 High items → `/ba:refine` or `/ba:export`
- Only Medium/Low TODOs → ready for dev, optionally `/ba:refine`
- No pending items → ready for dev

## Language

All output in English.
