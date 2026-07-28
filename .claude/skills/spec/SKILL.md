---
name: spec
description: >
  BA Clarity — Single entry point for the whole spec workflow. An **OKF profile** (concepts +
  typed relations + graph validator). Detects project state from disk and routes to the right
  mode: free-form discussion for early ideas, scope-first structured analysis (large projects
  run one module per session), processing client answers, validating the graph, exporting a
  client-friendly question list, or showing progress. Trigger for anything spec-related: "let's
  discuss my idea", "analyze requirements", "continue the analysis", "client replied", "here
  are the answers", "validate", "check the graph", "export questions", "send to client", "status",
  "where are we", "how clear are we", or /ba:spec.
---

# /ba:spec

One command for the whole spec phase. Detect state → confirm the mode in one sentence → read that mode's file → run it.

## Step 1 — Detect state (cheap scans only)

1. `specs/overview.md` exists?
2. Frontmatter of `specs/modules/*/index.md` (first ~10 lines each) → module statuses.
3. `grep -rln "NEEDS-CLARIFICATION" specs/` → open questions?
4. `specs/.clarity/discussion-log.md` exists?
5. The user's message: did they paste answers? provide docs? ask a question? just say "go"?

## Step 2 — Route

| Disk state + user intent | Mode | Read |
|---|---|---|
| No `specs/`, vague idea / wants to talk it through | **discuss** | `../../references/mode-discuss.md` |
| No `specs/` (or only a discussion log), has material for analysis | **analyze** | `../../references/mode-analyze.md` |
| Any module `pending` / `clarifying` | **analyze** (resume) | `../../references/mode-analyze.md` |
| Specs exist + user pasted answers / wants to resolve open questions | **refine** | `../../references/mode-refine.md` |
| User asks for the client question list | **export** | `../../references/mode-export.md` |
| User asks to reconcile / sweep conflicts, or all/most modules `documented` and want a cross-check | **reconcile** | `../../references/mode-reconcile.md` |
| User asks to validate / check the graph, or before flipping a module documented | **validate** | `../../references/mode-validate.md` |
| User asks progress / what's next | **status** | inline below |
| Legacy layout detected (`state.json`, flat `modules/*.md`, `clarity-v*.md`) | migration — see `mode-refine.md` § Legacy layout | `../../references/mode-refine.md` |

**Confirm before running** (one sentence, via `AskUserQuestion` only when ambiguous): *"3/7 modules documented, your message contains client answers → running refine on Orders. OK?"* If the state and intent match unambiguously (e.g. user typed "export"), state the mode in one line and proceed — no question needed.

Modes share `../../references/clarification-loop.md` and the format contract `../../templates/format.md` — each mode file says when to read them. Load only the one mode file you routed to.

## Status (inline — no separate file)

Answer from the Step 1 scans alone — **never read spec bodies**:

```
Project: {name}
Modules ({documented}/{total} documented):
| Module | Priority | Status | Open questions |
|--------|----------|--------|----------------|
| {name} | P0 | pending / clarifying / documented | 🔴{n} 🟡{n} 🟢{n} |

Open questions: {n} (🔴 {n} · 🟡 {n} · 🟢 {n})
Recommended next: {action}
```

Next steps (reconcile mandatory before prototype): modules `pending`/`clarifying` → `/clear` then `/ba:spec` · 2+ modules `documented` → **MUST run** `/ba:spec reconcile` (sweep boundaries, loop-until-dry) · 🔴 open → answer or export · nothing open, boundaries clean, **and reconciled** → prototype ready.

## Language

All output in English. User may input in any language.
