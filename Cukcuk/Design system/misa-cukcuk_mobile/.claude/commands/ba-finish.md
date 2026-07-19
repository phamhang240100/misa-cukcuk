---
description: Save and send a BA Clarity session — commits specs/ and prototype/ and pushes to team
---

Wrapper command to finalize a BA session. Hides git plumbing so the BA only has to answer "save and send?" — no `git add`, `git commit`, or `git push` needed.

Handles **two** things atomically:
1. `specs/` — BA Clarity output in the ai-sdlc repo
2. `prototype/` — UI prototype pages in the shadcn-kit submodule

**This command never runs `/ba-to-gsd` automatically.** Handing off to the developer is a separate, intentional step.

## Step 1 — Verify preconditions

1. **Branch check** — run `git branch --show-current`
   - Must start with `project/`. If not → abort:
     > ⚠️ You're on `{branch}`, not a project branch. `/ba-finish` only works
     > on project branches. Please ask a developer if you're unsure what to do.
   - Derive `project_name` by stripping `project/` prefix.

2. **At least one of the two must have changes**:
   - `specs_dirty` = true if `git status --porcelain specs/` is non-empty
   - `prototype_dirty` = true if either:
     - `git status --porcelain prototype` (parent repo pin changed), or
     - `cd prototype && git status --porcelain` (content changed inside submodule)
   - If both are false → report:
     > ℹ️ Nothing to save — neither `specs/` nor `prototype/` has changes.
     Stop execution.

3. **At least one of the two must exist with state**:
   - If `specs_dirty` → check `specs/.clarity/state.json` exists. If not → warn but don't abort (BA may have edited specs directly).
   - If `prototype_dirty` → check `prototype/.git` exists. If not → abort:
     > ❌ Prototype submodule is not initialized. Run `/init-workspace` first.

## Step 2 — Read session metadata

### specs/ metadata (if `specs_dirty`)
Parse `specs/.clarity/state.json` if present:
- `project` → project_name_from_state
- `current_version` → version
- `clarity_score` → score
- `phase` → current phase

Read `specs/.clarity/reports/clarity-v{version}.md` if present to extract:
- Number of TODO items by impact (🔴 High, 🟡 Medium, 🟢 Low)
- Previous clarity score if not v1 (to compute delta)

Count changed files in `specs/` (excluding `.clarity/`) — group by subdirectory.

### prototype/ metadata (if `prototype_dirty`)
Run inside `prototype/`:
- `git branch --show-current` → prototype_branch
- `git status --porcelain` → list of changed files
- `git log origin/{prototype_branch}..HEAD --oneline 2>/dev/null` → unpushed commits (may fail if branch is new)
- `find app/ -mindepth 1 -maxdepth 1 -type d | wc -l` → current page count

Check if prototype_branch exists on remote:
- `git ls-remote --heads origin {prototype_branch}` → if empty, mark `prototype_branch_is_new = true`

## Step 3 — Friendly summary

Print a human-readable summary. Do NOT show raw git diff.

```
📋 Session Summary — {project_name}

{if specs_dirty}:
  📄 BA Specs
     Clarity:      {score}% {delta if applicable}
     Version:      v{version}
     Changed:      {N} module specs, {N} business rules, {N} other
     Pending:      {N_high} high, {N_medium} medium, {N_low} low

{if prototype_dirty}:
  🎨 Prototype
     Branch:       {prototype_branch}{if new: " (new — will be created)"}
     Pages:        {page_count} total
     Changed:      {N} new files, {N} modified files
     Unpushed:     {N} commits ready to send
```

## Step 4 — Privacy check on discussion log (only if `specs_dirty`)

Check if `specs/.clarity/discussion-log.md` exists and has been modified
(`git status --porcelain specs/.clarity/discussion-log.md` non-empty, or the file is untracked).

If yes, use `AskUserQuestion`:

> `discussion-log.md` contains raw notes from your brainstorming sessions.
> Does it include anything you'd rather keep private
> (internal pricing, team dynamics, unfiltered client talk, draft ideas)?
>
> 1. **No, safe to commit** — include the discussion log
> 2. **Yes, exclude it** — keep the notes local only, don't send to team
> 3. **Show me what's in it first** — print the file contents before deciding

Handle:
- Option 1 → set `include_discussion_log = true`
- Option 2 → set `include_discussion_log = false`
- Option 3 → print the file with `Read` tool, then re-ask the same question (options 1 or 2 only this time)

If `discussion-log.md` does not exist or is unchanged → skip this step entirely.

## Step 5 — Confirm save strategy

Use `AskUserQuestion`. The options depend on what's dirty:

### Case A — Both specs and prototype dirty

> What would you like to save?
>
> 1. **Save everything and send to team** — commit specs + prototype, push both to GitHub
> 2. **Save everything, send later** — commit only, push later
> 3. **Save specs only** — keep prototype changes unsaved for now
> 4. **Save prototype only** — keep specs changes unsaved for now
> 5. **Cancel** — don't do anything

### Case B — Only specs dirty

> What would you like to do with the BA specs?
>
> 1. **Save and send to team** — commit + push
> 2. **Save only** — commit, push later
> 3. **Cancel** — don't do anything

### Case C — Only prototype dirty

> What would you like to do with the prototype?
>
> 1. **Save and send to team** — commit + push
> 2. **Save only** — commit, push later
> 3. **Cancel** — don't do anything

Set two flags based on the answer:
- `save_specs` — true if specs should be committed this run
- `save_prototype` — true if prototype should be committed this run
- `push` — true if "send to team" is chosen

If Cancel → stop, print: "Nothing changed. Run `/ba-finish` again when ready."

## Step 6 — Save prototype first (if `save_prototype`)

Prototype must be committed and pushed **before** the parent pin, otherwise the
parent will pin a SHA that doesn't exist on the shadcn-kit remote.

```bash
cd prototype
git add -A
git commit -m "ba: {project_name} prototype — {YYYY-MM-DD}"
```

If commit fails → friendly error:
> ❌ Couldn't save the prototype. A git hook or check rejected the commit.
> Please ask a developer to help resolve.
Do NOT attempt `--no-verify`.

If `push = true`:
- If `prototype_branch_is_new = true`:
  ```bash
  git push -u origin {prototype_branch}
  ```
- Otherwise:
  ```bash
  git push
  ```
- On push failure → friendly error:
  > ❌ Couldn't send the prototype to the team — there might be new changes
  > from others. Your work is saved locally. Please ask a developer to help sync.

If `push = false`:
- Skip push, but remember that the prototype commit exists locally only.

Return to the parent repo: `cd ..`

## Step 7 — Save specs (if `save_specs`)

1. Stage files:
   - `git add specs/`
   - If `include_discussion_log` is false → `git reset HEAD specs/.clarity/discussion-log.md`

2. If `save_prototype` was also done → stage the prototype pin update too:
   - `git add prototype`

3. Build commit message:
   - If both specs and prototype: `ba: {project_name} session {date} — clarity {score}% + prototype update`
   - If only specs: `ba: {project_name} session {date} — clarity {score}%`

4. Run: `git commit -m "{message}"`

5. If commit fails → friendly error (same as Step 6).

## Step 7b — Save prototype pin only (if `save_prototype = true` and `save_specs = false`)

If BA chose to save prototype but not specs:

```bash
git add prototype
git commit -m "ba: {project_name} prototype update — {date}"
```

This updates the parent pin to match the new prototype SHA.

## Step 8 — Push parent repo (only if `push = true`)

Run `git push`.

- On success → report: `✅ Sent to team.`
- On failure → friendly error:
  > ❌ Couldn't send to team — there might be new changes from others that
  > conflict with yours. Your work is saved locally (commit hash {sha}).
  > Please ask a developer to help sync.
  Do NOT attempt force push.

If `push = false`:
- Report: `💾 Saved locally. Run /ba-finish again or ask a developer to push when ready.`

## Step 9 — Handoff card

Always print this at the end:

```
✅ Session saved

Saved in this run:
  {if save_specs}: 📄 BA Specs (clarity {score}%)
  {if save_prototype}: 🎨 Prototype ({prototype_branch})

For developer review:
  • Clarity report:  specs/.clarity/reports/clarity-v{version}.md
  • Module specs:    specs/modules/
  • Prototype URL:   http://localhost:3000 (after `cd prototype && bash init.sh`)
  • Pending items:   {N_high} high-priority questions

Recommended next steps:
  • For BA: /export       — produce a client-friendly question list
  • For BA: /prototype-theme — switch prototype if needed
  • For dev: /ba-to-gsd      — generate development plan from the specs

To resume later: /ba-start
```

## Operating principles

1. **Never force anything** — no `--no-verify`, no `--force`, no `reset --hard`
2. **Commit order matters** — prototype first (inner submodule), then parent (pin update)
3. **Push order matters** — prototype push first, then parent push
4. **Never auto-run `/ba-to-gsd`** — that is a separate, deliberate dev action
5. **Always give the BA a graceful exit** — Cancel option at every decision point
6. **Never show raw git output** — translate to friendly language
7. **Always report the commit SHA on failure** — so a developer can help recover
8. **Handle new prototype branches** — use `-u origin` the first time a project's prototype branch is pushed

## Language

All output in English.
