---
description: Prepare workspace for a BA Clarity session — safety checks, git sync, session state detection
---

Wrapper command to safely onboard a BA/PO user into a BA Clarity session. Handles git plumbing and workspace checks so the BA never has to touch git directly.

**This command does NOT run `/discuss` or `/analyze` itself** — slash commands cannot call each other. It only verifies the workspace is ready and recommends the correct next command.

## Step 1 — Verify current branch

Run: `git branch --show-current`

- If the branch is `base`, `main`, or `master` → abort:
  > ⚠️ You're on the `{branch}` branch — this is the shared template, not a project.
  > Please ask a developer to switch you to the correct project branch
  > (e.g. `project/academy`).

- If the branch does not start with `project/` → abort with the same message and list available `project/*` branches using `git branch --list 'project/*'`.

- Otherwise continue. Remember `current_branch` for later output.

## Step 2 — Check for uncommitted changes

Run: `git status --porcelain`

If the output is non-empty → use `AskUserQuestion`:

> Working tree has uncommitted changes. What would you like to do?
> 1. **Continue** — keep them, I'll proceed (only safe if they don't conflict with the sync)
> 2. **Save them first** — commit with a temporary message `wip: save before ba session`
> 3. **Discard them** — throw away (cannot be undone)
> 4. **Abort** — stop, let me think

Handle each option:
- Continue → proceed to Step 3
- Save → `git add -A && git commit -m "wip: save before ba session"`
- Discard → `git reset --hard HEAD` (warn user this is irreversible before running)
- Abort → stop the command

## Step 3 — Sync latest from team

Run: `git fetch origin` and capture the result.

Check if remote has new commits:
- `git rev-list --count HEAD..origin/{current_branch}` → if > 0, there are new commits upstream

If upstream has new commits:
- Attempt `git pull --ff-only origin {current_branch}`
- If it succeeds → report: `✅ Pulled {N} new commits from team`
- If it fails (divergence) → abort:
  > ❌ Your branch and the team's version have diverged. Please ask a developer
  > to help reconcile before continuing. Do NOT run `git pull` or `git merge`
  > yourself unless you're comfortable with git.

If upstream is up to date → report: `✅ Already up to date with team`.

## Step 4 — Verify BA plugin is enabled

Read `.claude/settings.json`. Look inside `enabledPlugins` for a key containing `ba@`.

- If found → continue silently
- If missing → tell the user:
  > ⚠️ BA plugin is not enabled in this workspace. Please run these commands:
  >
  > ```
  > /plugin marketplace add duongvanha/agent-skills
  > /plugin install ba@agent-skills
  > /reload-plugins
  > ```
  >
  > Then run `/ba-start` again.
  Stop execution.

## Step 5 — Detect session state

Check for `specs/.clarity/state.json`:

### Case A — New session

If the file does not exist:
- Check if `project/` submodule has any existing `specs/` with domain documents:
  - Run: `ls project/specs/ 2>/dev/null` if `project/` exists
  - If it returns directories with `.md` files, list them as "raw source materials" that the BA can reference or paste into `/analyze`
- Set `session_state = "new"`
- Set `recommended_next = "/discuss (if exploring) or /analyze (if you have BRD/notes ready)"`

### Case B — Session in progress

If the file exists and contains pending items with any 🔴 High impact:
- Parse `state.json`: `project_name`, `current_version`, `clarity_score`, `phase`
- Read the pending count from `specs/.clarity/reports/clarity-v{current_version}.md` if possible
- Set `session_state = "continue"`
- Set `recommended_next = "/status (to see details) then /refine"`

### Case C — Session essentially complete

If the file exists and no 🔴 High pending items remain:
- Same parse as Case B
- Set `session_state = "ready for handoff"`
- Set `recommended_next = "/export (send remaining questions to client) or /ba-finish (save and send to team)"`

## Step 6 — Print the action card

Always print this at the end, formatted clearly:

```
┌─────────────────────────────────────────────────┐
│ BA Workspace Ready                              │
├─────────────────────────────────────────────────┤
│ Branch:    {current_branch}                     │
│ Project:   {project_name or "Not started yet"}  │
│ Status:    {session_state}                      │
│ Clarity:   {clarity_score}% (if applicable)     │
│                                                 │
│ Next:  {recommended_next}                       │
│                                                 │
│ When done this session: /ba-finish              │
└─────────────────────────────────────────────────┘
```

If the session is new, add after the card:
> 💡 Tip: If you have existing documents (BRD, meeting notes, screenshots),
> `/analyze` is the right starting point. Paste them in and answer
> the clarifying questions.

## Operating principles

1. **Never touch `project/` submodule** — that's developer territory, read-only for BA sessions
2. **Never delete `specs/`** — always preserve BA session data
3. **Never create a new branch** — if BA needs a new project, tell them to ask a developer
4. **Always give ONE recommended next command** — no paralysis
5. **Never run BA skills (`/analyze`, `/discuss`, `/refine`, `/export`, `/status`) directly** — cannot be done from within another slash command; just recommend them
6. **Always idempotent** — running `/ba-start` twice in a row should be safe

## Language

All output in English.
