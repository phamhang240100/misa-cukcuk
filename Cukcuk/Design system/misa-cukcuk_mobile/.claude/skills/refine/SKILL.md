---
name: refine
description: >
  BA Clarity — Interactive refinement loop. Loads context from disk, re-analyzes the entire
  requirement set for unclear points, asks clarifying questions one batch at a time using
  AskUserQuestion, validates answers, and loops until all high-impact items are resolved.
  Also accepts client answers if provided upfront. Trigger when user says "refine",
  "here are the answers", "client replied", or pastes responses to BA questions.
---

# /ba:refine

Load context from disk → process answers → re-analyze for gaps → ask questions → loop until clear → confirm action → update documents → present changes.

**Key principle**: This skill works entirely from files — no conversation memory needed. A user can start a fresh session, run `/ba:refine`, and it picks up exactly where things left off.

## Step 1 — Restore full context from disk

Read `specs/.clarity/state.json` to find current version, then read `specs/.clarity/reports/clarity-v{N}.md` — this is the single source of truth. Also read all spec files in `specs/` to have full picture.

**If files don't exist**, tell user to run `/ba:analyze` first — abort immediately even if user provided answers upfront (answers cannot be processed without baseline context).

Briefly summarize current state to user: project name, clarity score, how many pending items — so they know what's loaded.

## Step 2 — Process any provided answers

If the user provided answers along with the refine command, map them first:

Accept flexible formats:
- `AMB-001: answer here` — explicit
- `skip AMB-002` — keep pending
- `assume CON-001` — accept suggested default
- Free-form text — agent maps to relevant IDs

Validate each answer:
- Specific enough to implement? If vague, add to question queue
- Conflicts with confirmed requirement? Flag immediately
- Reveals new unclear points? Add them with new IDs

Cross-reference every new answer against all confirmed requirements to prevent contradictions.

## Step 3 — Re-analyze for gaps using parallel sub-agents (EVERY loop iteration)

Skip re-analysis if all answers in the batch were TODO/skip/confirm-suggested-default.

Otherwise, spawn **`completeness-analyst`** and **`consistency-checker`** agents in parallel. Pass all requirement content inline — do not rely on agents reading files. Include `answered_ids` and existing pending IDs so agents exclude them.

**`ba-domain-researcher`** — spawn **in parallel with the above only on the first loop iteration of the session**, OR when the user's answers reveal the project's primary domain changed (e.g. user clarified "this is actually a veterinary clinic, not general retail"). Pass `PRIMARY_DOMAIN`, `CORE_ENTITIES`, `CACHE_PATH=specs/.clarity/domain-research.md`, `ANSWERED_IDS`, `PENDING_IDS`. The researcher caches results, so subsequent iterations reuse the cache without re-searching. Skip entirely if `PRIMARY_DOMAIN` is unclear.

**When project has 4+ modules**: spawn 1 pair per module group instead of 1 pair for everything. `ba-domain-researcher` stays a single spawn for the whole project.

**After all agents return**: merge, deduplicate (same data field/business rule + same question = duplicate, keep higher impact), assign new IDs, sort by impact.

## Step 4 — Ask questions using AskUserQuestion (LOOP)

Present unclear points as questions — grouped by priority (🔴 High first), 3–5 at a time. Show status:

```
Clarity: X% — Y questions remaining (Z high-impact)
```

Use `AskUserQuestion` to ask and wait for the user's response. **This is mandatory** — do not just list questions and stop.

After receiving answers:
1. Validate and cross-reference (same as Step 2). **If an answer is ambiguous**, call `AskUserQuestion` to clarify — do NOT silently pick an interpretation. One follow-up per ambiguous answer; after that, TODO it.
2. **Save `state.json`** immediately — persist progress so nothing is lost if session ends
3. Go back to **Step 3** — spawn `completeness-analyst` + `consistency-checker` again to re-analyze
4. If new unclear points found → continue asking
5. If no pending questions remain → proceed to Step 5

### ⛔ Hard rules — "don't know → ask, don't infer"

- **Never silently fill a default** when info is missing/ambiguous. Use `AskUserQuestion` first.
- **Never end the loop on your own while 🔴 High items remain.**
- **Only explicit user triggers** advance to Step 5:
  1. User types `finish` / `done` / `enough` / `stop` / equivalent.
  2. Zero pending items remain.
- "I think we have enough" / "let me summarize now" are **not valid self-triggers**.
- User doesn't know → mark TODO, move on.

## Step 5 — Confirm next action

**Save `state.json`** first — persist final loop state before presenting.

Show a summary of the session:

```
📊 Session summary:
- Resolved: {N} items
- New items found: {N}
- Remaining pending: {N} (X high-impact)
- Clarity: X% → Y%
```

Then ask user via `AskUserQuestion`:

> What would you like to do?
> 1. **Update docs** — write all changes to spec files now
> 2. **Continue refining** — keep asking questions *(only shown if pending items remain)*

If user chooses **Continue** → return to **Step 3** (re-analyze then resume question loop).

Wait for user's choice. Do NOT update docs without explicit confirmation.

## Step 6 — Update all documents (only after user confirms)

### Pre-write confirmation gate

Before writing any file, call `AskUserQuestion` to confirm:

> About to generate **clarity-v{N+1}.md** + update spec files.
> - Resolved this session: {R} items
> - New items found: {F}
> - TODO (unresolved): {T} items, including {H} 🔴 High
> Proceed? [Yes / No, keep asking / Cancel]

- **Yes** → continue writing files below.
- **No, keep asking** → return to Step 3.
- **Cancel** → stop, do not write anything (state.json already persisted, no data loss).

Never skip this gate. The version bump only happens with explicit Yes — even if the user chose "Update docs" in Step 5, re-confirm here because file writes are irreversible.

Increment version. Update **all** files — not just the report:

1. **`reports/clarity-v{N}.md`** — New version of full report. Move answered items to confirmed, add new unclear points, update score. Self-contained for resume.
2. **`state.json`** — Updated version, score, pending/answered IDs.
3. **Spec files in `specs/`** — Update `overview.md`, `business-rules.md`, `edge-cases.md`, `glossary.md`, `modules/*.md`, `clarification-log.md` with newly confirmed requirements. Remove `<!-- TODO -->` markers for resolved items.

## Step 7 — Present changes to user

Show what changed: which items resolved, any new items found, new score.

**If no 🔴 High items remain:**
> ✅ Clarity {X}% — no high-impact items pending. Report is ready for development.
>
> **Next step**: `/clear` (clears conversation context) — start building, or `/ba:export` (client-ready question list) for remaining Medium/Low items.

**If 🔴 High items remain (user chose to finish early):**
> 📋 Clarity {X}% — {N} high-impact items still pending.
>
> **Next step**: `/clear` then `/ba:refine` when you have more answers, or `/ba:export` to send questions to client.

## Language

All output in English.
