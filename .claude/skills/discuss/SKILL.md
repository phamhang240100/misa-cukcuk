---
name: discuss
description: >
  BA Clarity — Free-form discussion to gather project context. For early-stage ideas,
  brainstorming, or when the user doesn't have full requirements yet. Keeps a session log
  that accumulates context over time. Trigger when user wants to talk through an idea,
  says "let's discuss", "I have an idea", "let me explain the project", or provides
  fragmented/incomplete input that isn't ready for structured analysis.
---

# /ba:discuss

Free-form conversation to gather project context. No structured output required — just listen, ask smart questions, and log everything.

## When to use

- User has an idea but not full requirements
- Early brainstorming / exploration phase
- User wants to talk through the project before committing to formal analysis

## Step 1 — Check for existing context

Read `specs/.clarity/discussion-log.md` if it exists. If found, briefly summarize what was discussed before so the user knows where they left off.

## Step 2 — Conversational exploration

Have a natural conversation. Your goal is to extract as much context as possible:

- What problem are they solving? For whom?
- What's the core workflow?
- Who are the users/actors?
- What exists today? What's changing?
- Any constraints (budget, timeline, tech, team size)?

**Ask one question at a time.** Follow the thread naturally — don't interrogate with a checklist. Use `AskUserQuestion` to keep the conversation going.

If the user doesn't know something, that's fine — note it and move on. Don't push.

## Step 3 — Continuously update session log

After each meaningful exchange, append to `specs/.clarity/discussion-log.md`:

```markdown
# Discussion Log — {Project Name or "Untitled"}

> Last updated: {date}
> Status: Gathering context

## Key Facts Learned
- {fact 1}
- {fact 2}
...

## Open Questions (user doesn't know yet)
- {question 1}
- {question 2}

## Raw Notes
### {date} — Round {N}
Q: {what you asked}
A: {what user said}
→ Extracted: {key takeaway}
```

## Step 4 — End of session

When the user wants to stop or conversation naturally winds down:

1. Save/update `specs/.clarity/discussion-log.md`
2. Summarize what you've learned so far
3. Assess readiness:

**If enough context for analysis** (core workflow + actors + main rules are known):
> ✅ There's enough context here to run a structured analysis.
>
> **Next step**: `/clear` then `/ba:analyze`

**If not enough yet**:
> 📝 Session saved. We have a good start but still need: {what's missing}.
>
> **Next step**: `/clear` then `/ba:discuss` to continue, or provide more docs/notes.

## Language

All output in English. User may input in any language.
