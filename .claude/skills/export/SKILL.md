---
name: export
description: >
  BA Clarity — Produce a client-friendly question list from pending unclear points. No jargon,
  no codes, grouped by business topic, copy-paste ready for direct client communication.
  Trigger when user says "export questions", "send to client", "client questions", "export".
---

# /ba:export

## Step 1 — Load context

Read `specs/.clarity/state.json` to find current version, then read pending unclear points from `specs/.clarity/reports/clarity-v{N}.md`.

**If files don't exist**, tell user to run `/ba:analyze` first.

## Step 2 — Generate client-friendly questions

Rewrite pending unclear points as client-friendly questions.

## Output format

```markdown
# Questions for confirmation — {Project Name}

## {Business Topic A}
1. We understand that X works like this: "suggested answer". Is that correct?
2. Regarding Y — we propose: "suggested answer". Please confirm or let us know if different.

## {Business Topic B}
3. We need to know: {specific question in plain language}
```

Rules:
- Group by business topic, not technical category (no AMB/MIS codes)
- No jargon — write as if the client has no technical background
- Always include a proposed answer for the client to confirm or correct
- Professional, polite English

Read template from `../../templates/client-export.md`.

## After export

> 📨 Exported {N} questions grouped by {N} topics.
>
> **Next step**: `/clear` then `/ba:refine` when client replies with answers.

## Language

All output in English.
