---
name: analyze
description: >
  BA Clarity — Structured analysis of project requirements. Ingests input (docs, chat logs,
  discussion logs, meeting notes, mockups, code), detects unclear points across 7 categories,
  asks clarifying questions iteratively. User can finish at any time — generates full documents
  with TODO markers for unresolved items. Trigger when user has enough context and wants
  structured analysis: "analyze", "BA analyze", "analyze requirements".
---

# /ba:analyze

Ingest input → extract what's known → clarify iteratively → user says finish → generate documents.

## Step 1 — Ingest input

Accept anything: pasted text, uploaded files, screenshots, PDFs, meeting transcripts, existing specs, source code, **and `specs/.clarity/discussion-log.md`** if it exists (from prior `/ba:discuss` sessions). Treat key facts from discussion log as initial confirmed requirements; open questions become starting unclear points.

Extract:
- **Actors** — who interacts with the system
- **Actions** — what they do
- **Data flows** — what moves where
- **Business rules** — constraints and logic
- **Dependencies** — external systems, APIs, services

Split into domains/modules if scope is large enough (e.g., Auth, Orders, Payments).

## Step 2 — Detect unclear points (parallel sub-agents)

Spawn three agents in parallel in a single message:

- **`completeness-analyst`** — missing flows/fields/rules
- **`consistency-checker`** — contradictions and duplicates
- **`ba-domain-researcher`** — live web research for domain-specific probes (skip silently if domain unclear)

Pass all extracted requirements inline to each agent's prompt.

**For `ba-domain-researcher` specifically**, also pass:
- `PRIMARY_DOMAIN` — one-line business-domain label inferred from input (e.g. "restaurant POS", "online pharmacy", "coworking booking"). If you cannot confidently infer a domain, pass empty string — the researcher will return `[]`.
- `CORE_ENTITIES` — JSON array of entity names extracted
- `CACHE_PATH` — absolute path `specs/.clarity/domain-research.md`
- `ANSWERED_IDS`, `PENDING_IDS` — JSON arrays

**When project has 4+ modules**: spawn 1 pair of completeness+consistency per module group (e.g., Auth+Users pair, Orders+Payments pair). `ba-domain-researcher` still spawns **once** for the whole project — domain research is not per-module.

Each agent returns: `[{id_prefix, question, impact, suggested_default, source_url?}]`

**After all agents return**: merge results, deduplicate, assign final IDs, sort by impact.

**Dedup rule**: two items are duplicate if they reference the same data field or business rule and ask the same question. Keep the higher impact level. Prefer entries with `source_url` when deduping ties — they carry evidence.

## Step 3 — Iterative clarification loop (CONTINUOUS)

Present unclear points as questions — grouped by priority (🔴 High first), 3–5 at a time. After each round show status:

```
Clarity: X% — Y questions remaining (Z high-impact)
Score = answered_weight / total_weight × 100 (High×3, Medium×2, Low×1)
→ Type "finish" to generate documents now, or answer to continue.
```

Use `AskUserQuestion` to ask and wait for the user's response. **This is mandatory** — do not just list questions and stop.

After receiving each batch of answers:
1. Validate answers, check for conflicts with confirmed requirements. **If an answer is ambiguous** (vague wording, multiple interpretations, or you cannot map it to a specific requirement field) → **do NOT silently pick the most likely interpretation**. Use `AskUserQuestion` to clarify which interpretation the user meant. One follow-up per ambiguous answer is OK; after that, TODO it.
2. **Re-analyze using `completeness-analyst` + `consistency-checker`** again (or per-module pairs if 4+ modules) with the UPDATED requirement set. Each agent looks for NEW unclear points only. Skip re-analysis if all answers in the batch were TODO/skip/confirm-suggested-default. **Do NOT re-spawn `ba-domain-researcher`** on every loop — it caches results. Only re-spawn it if the answers reveal the domain changed (e.g. user clarified "this is actually a veterinary clinic, not general retail").
3. Merge new findings, deduplicate (same rule as Step 2), assign new IDs
4. Loop back — ask the next batch of questions via `AskUserQuestion`

### ⛔ Hard rules — "don't know → ask, don't infer"

- **Never silently fill a default** when information is missing or ambiguous. If the user hasn't said it, don't assume it — `AskUserQuestion` first. Exception: items in the "Default assumptions (never ask client)" list below can be assumed silently.
- **Never end the loop on your own while 🔴 High items remain.** Keep asking.
- **Never move to Step 4 by your own judgement.** The ONLY triggers to proceed to Step 4 are:
  1. User **explicitly** types `finish` / `done` / `enough` / `generate` / `that's enough` / equivalent.
  2. No pending items remain at all (every question resolved or TODO'd by the user).
- Phrases like *"I think we have enough information"* / *"let me generate the document now"* are **not valid self-triggers**. Treat them as forbidden.
- If user doesn't know an answer → mark as TODO, don't push. Move to next question.
- You may suggest finishing when no 🔴 High items remain, but the user must type the trigger word. Even a *nod* in chat (`ok`, `sure`) is **not** sufficient — re-ask with `AskUserQuestion` if unclear.

### Sub-agent prompt content

When spawning each agent, include in the prompt:
- All requirement content inline (confirmed + pending) — do not rely on agents reading files
- The list of `answered_ids` and existing pending IDs — agents must exclude these

## Step 4 — Generate documents

Triggered **only** by the hard-rule triggers from Step 3 (explicit finish keyword, or zero pending items).

### Pre-write confirmation gate

Before writing any file, call `AskUserQuestion` to confirm:

> About to generate **clarity-v{N+1}.md** + spec files.
> - Answered: {A} items
> - TODO (unresolved): {T} items, including {H} 🔴 High
> Proceed? [Yes / No, keep asking / Cancel]

- **Yes** → continue writing files below.
- **No, keep asking** → return to Step 3 loop.
- **Cancel** → stop, do not write anything.

Never skip this gate, even when all items are answered. The version bump only happens with explicit Yes.

If `state.json` already exists, increment `current_version` by 1. Otherwise start at **v1**.

Generate ALL files:

### Clarity state (`specs/.clarity/`)

1. **`reports/clarity-v{N}.md`** — Single source of truth for resuming sessions. Follow template `../../templates/clarity-report.md`. Contains everything: summary, domains, confirmed requirements, pending unclear points, **TODO items** for unresolved questions:

```markdown
## TODO — Pending Clarification
| # | ID | Question | Impact | Suggested Default |
|---|----|----------|--------|-------------------|
| 1 | MIS-003 | How are refunds handled? | 🔴 High | Full refund within 30 days |
| 2 | EDG-001 | Max file upload size? | 🟢 Low | 10MB |
```

2. **`state.json`** — `{ project, current_version, clarity_score, phase, updated_at, answered_ids, pending_ids, todo_ids }`

### Spec documents (`specs/`)

Generate from confirmed requirements + reasonable defaults for TODOs. Follow templates in `../../templates/`:

| Template | Output | Description |
|----------|--------|-------------|
| `overview.md` | `specs/overview.md` | Project summary, module map, scope, roles |
| `glossary.md` | `specs/glossary.md` | Domain terms — devs read this first |
| `business-rules.md` | `specs/business-rules.md` | All rules with triggers, exceptions, examples |
| `edge-cases.md` | `specs/edge-cases.md` | Boundary conditions and error scenarios |
| `module-spec.md` | `specs/modules/{name}.md` | Detailed spec per module (one file each) |
| `clarification-log.md` | `specs/clarification-log.md` | Full Q&A audit trail from this session |

**For TODO items**: include them in the relevant spec file with a `<!-- TODO: {ID} — {question} -->` marker so devs know what's unconfirmed.

### Scoring
Weight by impact — High (×3), Medium (×2), Low (×1). Score is informational — the real readiness signal is whether any 🔴 High impact items remain unresolved.

### Scope Assumptions
Include in report — visible to BA, marked "do not ask client":

```markdown
## Scope Assumptions (do not ask client)
| # | Assumption | Rationale |
|---|-----------|-----------|
| SA-001 | Web only, no offline | Client didn't mention offline/mobile |
```

## Step 5 — Present & guide next step

Display the full Clarity Report to the user. Then:

**If no 🔴 High items remain:**
> ✅ Analysis complete — Clarity {X}%. No high-impact items pending.
>
> **Next step**: `/clear` (clears conversation context) then `/ba:refine` if client sends answers, or `/ba:export` (client-ready question list) to send questions to client.

**If 🔴 High items remain as TODO:**
> 📋 Analysis saved — Clarity {X}%. {N} high-impact items still pending as TODO.
>
> **Next step**: `/clear` then `/ba:refine` when you have more answers, or `/ba:export` to send pending questions to client.

---

## Default assumptions (never ask client)

- Web only, always online — no PWA, no offline
- No data migration — fresh start
- No mobile app — responsive web is enough
- Single language, single timezone/currency
- No legacy integration
- No phased rollout
- Standard auth (email/password or SSO)
- No audit logging
- No real-time — polling is fine

**Principle: don't open doors the client hasn't knocked on.**

## Language

All output in English. BA may input in any language.

## Tech stack context (fixed — do not flag as unclear unless requirement explicitly conflicts)

Next.js (App Router) + tRPC + Prisma + Shadcn/MUI · react-data-grid · React Admin · NextAuth · PostgreSQL · React Native (mobile only if needed, no native code).

## Core principles

1. **Always suggest an answer** — pick the simplest, dev-friendly default. Clients confirm faster than they explain from scratch.
2. **Simplest viable solution** — solo dev, ship fast
3. **Atomic requirements** — each must be independently testable
4. **Mermaid for flows** — every major tool renders it
