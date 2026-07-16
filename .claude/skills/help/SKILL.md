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

BA Clarity helps you turn raw ideas and messy requirements into dev-ready specs, then into a visual prototype, through structured analysis and iterative clarification.

---

### The Workflow

```
CLARIFY SPECS
  /ba:discuss   →   /ba:analyze   →   /ba:refine   →   /ba:export
    (explore)        (structure)       (clarify)        (deliver)

BUILD PROTOTYPE
  /ba:prototype-brand  →  /ba:prototype-plan  →  /ba:prototype-execute
    (identity)             (screens & flows)       (scaffold)
```

**Phase 1 — Explore** `/ba:discuss`
Free-form conversation when you have an idea but not full requirements yet. BA asks smart questions, logs to `specs/.clarity/discussion-log.md`. Come back across sessions without losing context.

**Phase 2 — Structure** `/ba:analyze`
Feed in anything: pasted text, docs, screenshots, meeting notes, or code. BA extracts actors, actions, business rules, and data flows — then asks clarifying questions across 7 lenses.

**Phase 3 — Clarify** `/ba:refine`
Got answers from the client? Paste them in. BA reads the existing specs, resolves open questions, updates all documents. Run as many times as needed.

**Phase 4 — Deliver** `/ba:export`
Generates a clean, professional question list for the client — no internal jargon, copy-paste ready.

**Phase 5 — Brand** `/ba:prototype-brand`
Pick a visual identity for the prototype. Answer 3 questions (industry, tone, reference app). BA picks palette, fonts, shape, and density using the `ui-ux-pro-max` skill (or a fail-soft static mapping). Output: `specs/brand.md` + `prototype/brand-config.md`.

**Phase 6 — Plan the prototype** `/ba:prototype-plan`
Turn the module specs into a BA-readable plan of screens and flows — adapted to the project type (admin, mobile, marketing, dashboard, mixed). You review and confirm. Output: `prototype/PROTOTYPE-PLAN.md`.

**Phase 7 — Build the prototype** `/ba:prototype-execute`
Applies the brand tokens to the theme, then spawns parallel subagents that replicate the starter's example module for every module in the plan. Commits atomically. UI mockup only — no backend logic. Output: pages in `prototype/`.

---

### Commands

| Command | When to use |
|---|---|
| `/ba:discuss` | Early-stage idea, brainstorming, incomplete info |
| `/ba:analyze` | Have enough context, want structured analysis |
| `/ba:refine` | Client sent answers, need to update specs |
| `/ba:export` | Ready to send questions/summary to client |
| `/ba:prototype-brand` | Pick visual identity (once per project) |
| `/ba:prototype-plan` | Generate screen + flow list for BA to confirm |
| `/ba:prototype-execute` | Scaffold the prototype by replicating starter example per module |
| `/ba:status` | Check current progress and what's blocking |
| `/ba:help` | Show this guide |

---

### Quick Start

**Option A — I have a vague idea:**
```
/ba:discuss
→ Talk through your project
→ /clear, then /ba:analyze when ready
```

**Option B — I have docs/notes ready:**
```
/ba:analyze
→ Paste or upload your materials
→ Answer clarifying questions (or say "finish" to stop)
→ /clear, then /ba:refine when client replies
```

**Option C — specs done, ready for prototype:**
```
/ba:prototype-brand      → pick visual identity
/clear
/ba:prototype-plan       → confirm screens & flows
/clear
/ba:prototype-execute    → build the prototype
```

---

### Requirements for prototype phase

Before running `/ba:prototype-execute`, your prototype starter must provide:
- `prototype/STARTER.md` — convention file describing project type, tech stack, example module path, registration entry files, and mock strategy.
- `prototype/<example-module-dir>/` — one complete example module the skill can replicate.

If these are missing, the dev maintaining the starter branch needs to add them. See `plugins/ba/README.md` for the exact format.

External skills used by the prototype phase:
- [`ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — 161 palettes + 67 UI styles + 57 font pairings + 99 UX rules. Optional: fails soft to a static mapping.
- Anthropic `frontend-design` skill — aesthetic polish pass. Optional.
- `agent-browser` — automated visual verification. Optional.

---

### Tips

- Always `/clear` between skills — each skill reads from files, not conversation history
- Specs are saved to `specs/.clarity/` in your project folder
- Prototype artifacts are saved to `prototype/` (a git submodule on most projects)
- `/ba:status` shows what's done, what's blocking, and what to do next
- You can run `/ba:refine` multiple times as more answers come in
- You can re-run `/ba:prototype-plan` and re-edit before confirming
