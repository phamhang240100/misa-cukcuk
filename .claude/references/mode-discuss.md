# Mode: discuss — free-form context gathering

No structured output required — just listen, ask smart questions, and log everything.

## Step 1 — Check for existing context

Read `specs/.clarity/discussion-log.md` if it exists. If found, briefly summarize what was discussed before so the user knows where they left off.

## Step 2 — Conversational exploration

Have a natural conversation. Extract as much context as possible:

- What problem are they solving? For whom?
- What's the core workflow?
- Who are the users/actors?
- What exists today? What's changing?
- Any constraints (budget, timeline, tech, team size)?

**Ask one question at a time.** Follow the thread naturally — don't interrogate with a checklist. Use `AskUserQuestion` to keep the conversation going. If the user doesn't know something, note it and move on — don't push.

## Step 3 — Continuously update session log

After each meaningful exchange, append to `specs/.clarity/discussion-log.md`:

```markdown
# Discussion Log — {Project Name or "Untitled"}

> Status: Gathering context

## Key Facts Learned
- {fact}

## Open Questions (user doesn't know yet)
- {question}

## Raw Notes
### Round {N}
Q: {what you asked}
A: {what user said}
→ Extracted: {key takeaway}
```

## Step 4 — End of session

When the user wants to stop or the conversation winds down:

1. Save the log
2. Summarize what you've learned
3. Assess readiness:

**Enough context for analysis** (core workflow + actors + main rules known):
> ✅ There's enough context to run a structured analysis.
> **Next**: `/clear` then `/ba:spec` — it will pick up the discussion log and start the scope gate.

**Not enough yet**:
> 📝 Session saved. Still need: {what's missing}.
> **Next**: `/clear` then `/ba:spec` to continue discussing, or provide more docs/notes.
