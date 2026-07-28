# Mode: export — client-friendly question list

## Step 1 — Collect open questions (lazy)

`grep -rn "NEEDS-CLARIFICATION" specs/` — each marker carries its `Q-*` ID, impact, question, and suggested default; the file path gives the module. That grep is the entire load — do not read spec bodies. If a question needs surrounding context to phrase well, read only the lines around that marker.

No markers found → tell the user there is nothing to export.

## Step 2 — Generate the list

Rewrite the markers as client-friendly questions. Read template `../templates/client-export.md`.

```markdown
# Questions for confirmation — {Project Name}

## {Business Topic A}
1. We understand that X works like this: "suggested answer". Is that correct?
2. Regarding Y — we propose: "suggested answer". Please confirm or let us know if different.
```

Rules:
- Group by business topic (usually the module), not technical category — no `Q-*` codes visible to the client, but keep a hidden mapping table at the end of your chat message (not in the export) so the refine mode can route the replies
- No jargon — write as if the client has no technical background
- Always include a proposed answer to confirm or correct
- 🔴 high-impact questions first · professional, polite English

## After export

> 📨 Exported {N} questions grouped by {N} topics.
> **Next**: `/clear` then `/ba:spec` when the client replies with answers.
