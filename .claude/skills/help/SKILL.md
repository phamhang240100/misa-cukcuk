---
name: help
description: >
  BA Clarity — Show workflow overview, commands, and quick start guide. Trigger when user
  asks "how does this work", "what can you do", "help", "get started", or runs /ba:help.
---

# /ba:help

Display the full BA Clarity workflow, when to use each command, and a quick start example.

## Output to show the user

---

## BA Clarity — Workflow Overview

BA Clarity turns raw ideas and messy requirements into dev-ready specs, then into a visual prototype.

---

### The Workflow

```
SPECS                              PROTOTYPE
  /ba:spec  (one command,            /ba:prototype-brand   → identity
   auto-routed modes:)               /ba:prototype-plan    → screens & flows
   discuss → analyze →               /ba:prototype-execute → scaffold
   refine → export · status
```

**`/ba:spec`** — the single entry point for the spec phase. It checks what already exists on disk and routes itself:

- **discuss** — early-stage idea, no requirements yet. Free-form conversation, logged to `specs/.clarity/discussion-log.md` so you can come back across sessions.
- **analyze** — you have material (docs, notes, screenshots, code). BA locks a **Scope Map** with you first (modules, priority, in/out of scope), then asks clarifying questions. Small projects (≤3 modules) run in one pass; large projects go **one module per session** — `/clear` and run `/ba:spec` again to continue, progress is saved on disk.
- **refine** — client sent answers. BA routes each answer to its module, loads only the affected folders, resolves the inline `NEEDS-CLARIFICATION` markers, and records each decision + rationale in that module's `decisions.md`.

Whenever a module's spec is written or changed (analyze & refine), a background `testcase-generator` agent regenerates that module's `test-cases.md` — QA test cases with a coverage matrix and full `TC-* → REQ/BR/EC/VAL` traceability — in parallel, without slowing the session down.
- **export** — generates a clean, jargon-free question list to send to the client.
- **status** — progress per module + recommended next action.

You never pick the mode by hand — `/ba:spec` detects it and confirms in one sentence. Saying it in words works too: "client replied", "export questions", "where are we?".

**Prototype phase** (after specs are ready):

- **`/ba:prototype-brand`** — pick the theme contract. 3 questions (industry, tone, reference app) → a curated preset (crisp / soft / enterprise / warm-editorial / dark-pro) + tweakable axes (colors, neutrals, elevation, density, radius, fonts, sidebar/table variants), via Anthropic's `frontend-design` skill (fail-soft static mapping). Output: `specs/brand.md` + `prototype/brand-config.md`.
- **`/ba:prototype-plan`** — turn module specs into a BA-readable plan of screens and flows, adapted to project type (admin, mobile, marketing, dashboard, mixed). You review and confirm. Output: `prototype/PROTOTYPE-PLAN.md`.
- **`/ba:prototype-execute`** — applies the theme, builds the foundation (shell/auth/profile/dashboard), **you approve it** (not happy? adjust an axis in brand-config, it resets and regenerates — cheap), then freezes it and spawns parallel builder subagents per module, gated by typecheck + token-lint. Output: pages in `prototype/`.

---

### Commands

| Command | When to use |
|---|---|
| `/ba:spec` | Anything spec-related — it figures out the right mode from disk + your message |
| `/ba:prototype-brand` | Pick visual identity (once per project) |
| `/ba:prototype-plan` | Generate screen + flow list for BA to confirm |
| `/ba:prototype-execute` | Scaffold the prototype from the confirmed plan |
| `/ba:help` | Show this guide |

---

### Quick Start

**Option A — I have a vague idea:**
```
/ba:spec           → it starts a discussion
→ talk it through
→ /clear, /ba:spec → when there's enough, it moves to analysis
```

**Option B — I have docs/notes ready:**
```
/ba:spec
→ paste or upload materials
→ confirm the Scope Map (modules + working style)
→ answer clarifying questions (or type "finish")
→ large project? /clear, /ba:spec — continues one module per session
→ client replied later? /clear, /ba:spec — paste the answers
```

**Option C — specs done, ready for prototype:**
```
/ba:prototype-brand   → pick visual identity
/clear
/ba:prototype-plan    → confirm screens & flows
/clear
/ba:prototype-execute → build the prototype
```

---

### Requirements for prototype phase

Before `/ba:prototype-execute`, the prototype starter should provide `prototype/STARTER.md` — convention file (project type, tech stack, registration entries, mock strategy, supported theme axes). If missing, execute auto-infers one and asks for confirmation. No example module is required — builders compose from the confirmed plan + PATTERNS.md.

See `plugins/ba/README.md` for the exact format.

External skills used by the prototype phase (both optional):
- Anthropic `frontend-design` — brand direction for `/ba:prototype-brand`. Install: `/plugin install frontend-design@anthropics-claude-code`
- `agent-browser` — visual verification after build

---

### Tips

- Always `/clear` between sessions — everything reads from files, not conversation history
- Large projects: `/clear` between modules too — one module per session keeps specs grounded
- Each module lives in `specs/modules/<slug>/` (index, requirements, data, rules, edge-cases, decisions); open questions are inline `[NEEDS-CLARIFICATION: ...]` markers
- Versioning is git — specs carry no changelogs or version numbers
- Run `/ba:spec` any time you're unsure what's next — status mode tells you
