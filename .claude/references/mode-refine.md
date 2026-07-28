# Mode: refine — process answers, update affected modules

Grep open markers → route answers to modules → load only affected folders → loop → update affected files only.

Read first:
1. **`../templates/format.md`** — layout, frontmatter, marker grammar, ID scheme
2. **`clarification-loop.md`** (same directory) — the question loop, sub-agent prompts, hard rules, pre-write gate (shared with the analyze mode)

This skill works entirely from files — a user can `/clear`, run `/ba:spec`, and it picks up exactly where things left off.

```
Progress:
- [ ] Load minimal context (overview + frontmatter + marker grep)
- [ ] Route answers / pick focus module
- [ ] Clarification loop (validate → persist → re-analyze)
- [ ] Session summary + confirm
- [ ] Finalize affected files only
```

## Step 1 — Restore context from disk (LAZY — never load everything)

1. `specs/overview.md` (module map). Missing → tell user to run `/ba:spec` first and abort, even if answers were provided.
2. Frontmatter scan of `specs/modules/*/index.md`.
3. `grep -rn "NEEDS-CLARIFICATION" specs/` → all open questions with `Q-*` ID, impact, location.

⛔ Do NOT read spec file bodies yet — module detail loads per module in Step 2.

Summarize to the user: project, per-module open-question counts (🔴/🟡/🟢), modules still `pending`/`clarifying`.

## Step 2 — Route answers, pick focus

If the user provided answers, map them to `Q-*` IDs (the marker's module prefix routes it):
`Q-ORD-03: answer` (explicit) · `skip Q-ORD-04` (marker stays) · `assume Q-ORD-05` (accept suggested default) · free-form text (map by content).

The referenced modules = **affected modules**. For each, now load: `index.md` (full) + only the files containing its markers or touched by the answers + its `decisions.md` (short — avoids re-deciding). `Q-GLOBAL-*` → the global files.

No answers provided → propose focus via `AskUserQuestion`: the module with the most 🔴 markers (options: that module / another / global items). One module at a time.

## Step 3 — Loop

Run the clarification loop from `clarification-loop.md` over the affected modules. Refine-specific details:

- Resolving a question = edit the spec text at the marker, delete the marker, append the `D-*` entry to `decisions.md` — persisted immediately per the loop rules.
- An answer that reveals new open questions → insert new markers at the relevant spots.
- `ba-domain-researcher`: cache-only here; spawn only if `specs/.clarity/domain-research.md` is missing or the domain itself changed.

## Step 4 — Session summary & confirm

```
📊 Session: {modules touched} · resolved {N} → decisions added {N} · new questions {N} · still open {N} ({H} 🔴)
```

`AskUserQuestion`: **Wrap up** (finalize files) / **Continue refining** (if open questions remain → back to Step 3).

## Step 5 — Finalize (affected files only)

Step 3 already persisted each resolution, so this is a consistency pass:

- Affected modules' `index.md`: refresh Open items; if a `pending`/`clarifying` module is now fully specified, ask before flipping `status: documented`.
- Delete resolved markers from `.clarity/intake/{slug}.md`.
- Global files only if a `Q-GLOBAL-*` was touched.
- Any affected module whose spec content changed (`requirements.md` / `rules.md` / `data.md` / `edge-cases.md`) → spawn `testcase-generator` per module **in parallel, background** — it regenerates `test-cases.md` from disk while you present changes. Never edit `test-cases.md` by hand.

⛔ Do not rewrite untouched modules "for consistency" — rewriting unloaded content from memory is how hallucinations enter specs. No report files, no changelogs — git is the history.

## Step 6 — Present changes

Show: modules touched, decisions added (IDs + one-liners), open questions remaining.

- No 🔴 left → ✅ ready for development. **Next**: `/clear` and build, or `/ba:spec export` for remaining 🟡/🟢.
- 🔴 remain → 📋 **Next**: `/clear` then `/ba:spec` with more answers, or `/ba:spec export`.

## Legacy layout migration

If `specs/` contains the old layout (`specs/.clarity/state.json`, flat `specs/modules/{name}.md` files, or `clarity-v{N}.md` reports): offer once via `AskUserQuestion` to migrate — split each flat module file into the folder set (content moved, not rewritten), convert report TODO items into inline markers, convert clarification-log entries into `decisions.md`, then delete `state.json`/reports. If declined, stop — do not mix layouts.

## Language

All output in English.
