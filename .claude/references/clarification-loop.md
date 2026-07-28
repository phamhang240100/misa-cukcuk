# Clarification Loop — shared by the analyze and refine modes of /ba:spec

Terminology: an **open question** is an unresolved point; its on-disk form is a `[NEEDS-CLARIFICATION: ...]` **marker** (grammar in `templates/format.md`). A **scope unit** is whatever is being clarified right now: the whole project (single-pass), the cross-cutting slice (global round), or one module (module session).

## The loop

For migration/data-model questions, use these headings before asking:

1. **Relationship** — source/target entities and how they relate.
2. **Storage** — where the value is stored or computed on each side.
3. **Problem** — one concrete example showing why direct mapping fails.
4. **Solution** — exactly what migrates, does not migrate, or transforms.
5. **Decision** — one narrow confirmation question.

Keep one issue per explanation, but include relevant fields/counts, a small relationship/storage example, the rationale, and whether data is lost. Define technical terms plainly. If the user asks for detail, expand only that issue. Collect answers for the presented batch, then run the pre-write gate and persist once. For a partially answered compound marker, persist the confirmed part and leave only the unresolved part open.

Present open questions grouped by impact (🔴 high first), 3–5 at a time, via `AskUserQuestion` — **mandatory: never just list questions and stop**. After each round show:

```
{answered}/{total} resolved — {remaining} open ({H} 🔴 high)
→ Type "finish" to generate documents now, or answer to continue.
```

After each answered batch:

1. **Validate** each answer against the scope unit's confirmed content. Ambiguous answer (vague wording, multiple interpretations, can't map to a specific point) → one `AskUserQuestion` follow-up; still unclear → leave the marker, move on. Conflict with existing spec or a `CBR-*` → flag immediately.
2. **Persist immediately** — apply resolutions to the working file (markers live in `.clarity/intake/{slug}.md` before the spec exists, in the spec files after) so nothing is lost if the session ends.
3. **Re-analyze**: spawn `completeness-analyst` + `consistency-checker` in parallel with the UPDATED scope-unit content to find NEW open questions. Skip if the whole batch was skip/assume-default.
4. **Merge + dedupe** new findings (rule below), add them as markers, loop.

## Sub-agent prompts

Pass inline — never rely on agents reading files:
- The scope unit's requirement content (confirmed + open). In module sessions add a summary of global context (roles, `CBR-*`) — **never the whole project**.
- Existing `Q-*` and `D-*` IDs to exclude.

Each agent returns `[{id_prefix, question, impact, suggested_default, source_url?}]`.

**Dedup rule**: two items are duplicates if they reference the same data field or business rule and ask the same question. Keep the higher impact; prefer entries with `source_url` on ties. Assign final `Q-{MOD}-NN` IDs after merging.

**`ba-domain-researcher`**: spawn at most once per project (params: `PRIMARY_DOMAIN` — empty string if unsure, it returns `[]`; `CORE_ENTITIES` JSON array; `CACHE_PATH=specs/.clarity/domain-research.md`; `ANSWERED_IDS`; `PENDING_IDS`). It caches; later sessions read the cache file instead. Re-spawn ONLY if answers reveal the domain itself changed (e.g. "this is actually a veterinary clinic, not general retail").

## ⛔ Hard rules — "don't know → ask, don't infer"

- **Never silently fill a default** when information is missing or ambiguous. Exception: the "Default assumptions" list in the analyze mode.
- **Never end the loop on your own while 🔴 high questions remain.**
- **Never move to document generation by your own judgement.** Only triggers:
  1. User explicitly types `finish` / `done` / `enough` / `generate` / equivalent.
  2. Zero open questions remain.
- *"I think we have enough information"* is a forbidden self-trigger. `ok` / `sure` alone is not a trigger — re-ask with `AskUserQuestion`.
- User doesn't know → the marker stays (it ships in the spec as an open question), move on.
- You may suggest finishing when no 🔴 high questions remain — but the user types the word.

## Pre-write gate

Before writing spec files for any scope unit, `AskUserQuestion`:

> About to write **{files}**. Answered: {A} · Open questions that will ship as markers: {T} ({H} 🔴). Proceed? [Yes / No, keep asking / Cancel]

Never skip this gate, even with zero open questions. Cancel loses nothing — markers are already on disk.
