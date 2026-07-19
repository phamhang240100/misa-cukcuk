---
description: Choose prototype platforms and themes — multi-platform workspace setup
---

Let the BA pick which platforms (admin, desktop, mobile) to prototype and which theme to use for each. Hides git submodule plumbing. The prototype/ submodule points to shadcn-kit's `workspace` branch, which contains sub-submodules for each platform.

## Concepts

- **Platform**: admin, desktop, or mobile — each is a separate Next.js app with its own port
- **Theme**: the UI library/design system for a platform (react-aria, main/shadcn, mui, gluestack)
- **workspace.json**: config file in prototype/ that records which platforms are enabled and which theme each uses

### Port mapping

| Platform | Dev port | Production pattern |
|---|---|---|
| admin | 3000 | `{project}-admin.teval.site` |
| desktop | 3001 | `{project}-desktop.teval.site` |
| mobile | 3002 | `{project}-mobile.teval.site` |

## Step 1 — Verify current branch

Run: `git branch --show-current`

- If the branch does not start with `project/` → abort:
  > ⚠️ You're on `{branch}`, not a project branch. `/prototype-theme` only
  > works on project branches. Please ask a developer if you're unsure what to do.

- Otherwise, derive `project_name` by stripping the `project/` prefix.
  Example: `project/academy` → `project_name = academy`.

## Step 2 — Ensure prototype submodule is initialized

Check if `prototype/.git` exists:
- If missing → run `git submodule update --init prototype`
- If still fails → abort:
  > ❌ Could not initialize the prototype submodule. Please run `/init-workspace`
  > first and make sure you have SSH access to GitHub.

Check which branch prototype/ is on:
- Run: `cd prototype && git branch --show-current`
- If NOT `workspace` → switch:
  ```bash
  cd prototype
  git fetch origin
  git checkout workspace
  git pull --ff-only origin workspace
  git submodule update --init --recursive
  cd ..
  ```

## Step 3 — Read current workspace state

Read `prototype/workspace.json` if it exists. Remember `current_config`.

Check each platform's submodule status:
```bash
cd prototype
for platform in admin desktop mobile; do
  if [ -d "themes/$platform/.git" ]; then
    branch=$(cd "themes/$platform" && git branch --show-current)
    echo "$platform: $branch"
  else
    echo "$platform: not initialized"
  fi
done
cd ..
```

## Step 4 — Safety checks

### 4a — Uncommitted changes in any platform

For each initialized platform:
```bash
cd prototype/themes/{platform} && git status --porcelain
```

If any platform has uncommitted changes → abort:
> ❌ You have unsaved changes in `prototype/themes/{platform}/`. Please run `/ba-finish` first
> to save them, or ask a developer for help.

### 4b — Existing pages count

For each initialized platform:
```bash
cd prototype/themes/{platform} && find app/ -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l
```

Remember counts as `existing_pages[platform]`.

## Step 5 — Detect session state and backup

### 5a — Check for saved workspace

Check if workspace has been configured before by looking for a saved branch:
- Run: `cd prototype && git branch -r | grep "origin/${project_name}" | head -1`

If found → use `AskUserQuestion`:
> Found saved workspace for `{project_name}`. What would you like to do?
>
> 1. **Restore saved work** — continue where the team left off
> 2. **Start fresh** — configure new platforms and themes (current work will be backed up)
> 3. **Cancel** — do nothing

- **Restore** → checkout the saved branch, restore workspace.json, init submodules. Skip to Step 9.
- **Start fresh** → continue to Step 5b
- **Cancel** → abort

If no saved workspace found → continue to Step 6.

### 5b — Backup existing prototype (before starting fresh)

For each platform that has existing pages (`existing_pages[platform] > 0` from Step 4b):

1. List what exists:
   > Found existing prototype pages:
   > - `themes/{platform}/app/{module_1}/`
   > - `themes/{platform}/app/{module_2}/`
   > - ...

2. Create a git snapshot for safe revert:
   ```bash
   cd prototype/themes/{platform}
   git add -A
   git commit -m "snapshot: backup before reconfigure — $(date +%Y%m%d-%H%M%S)"
   cd ../../..
   ```
   Remember this commit hash as `snapshot_sha[platform]`.

3. Print:
   > ✅ Backed up `{platform}` prototype (snapshot `{snapshot_sha}`).
   > You can revert to this version anytime.

After all platforms are backed up → continue to Step 6.

⚠️ The snapshot commits allow reverting at any time. When wrapping up in `/build-prototype`, the BA will be offered the choice to keep new work or revert to these snapshots.

## Step 6 — Choose platforms

Use `AskUserQuestion`:

> Which platforms do you need for this prototype?
>
> 1. **Desktop only** — single web app (most common)
> 2. **Mobile only** — mobile web app
> 3. **Admin only** — admin panel
> 4. **Admin + Desktop** — admin panel + public website
> 5. **Desktop + Mobile** — desktop web + mobile web
> 6. **Admin + Desktop + Mobile** — full suite
> 7. **Custom** — pick individual platforms
> 8. **Cancel** — do nothing

Map selections:
- Option 1 → `enabled = [desktop]`
- Option 2 → `enabled = [mobile]`
- Option 3 → `enabled = [admin]`
- Option 4 → `enabled = [admin, desktop]`
- Option 5 → `enabled = [desktop, mobile]`
- Option 6 → `enabled = [admin, desktop, mobile]`
- Option 7 → ask which platforms individually
- Option 8 → abort

## Step 7 — Choose theme for each enabled platform

For each enabled platform, use `AskUserQuestion`:

> Choose theme for **{platform}**:
>
> 1. **react-aria** — React Aria + FSD + tasteskill (default, production-grade, bring-your-own design)
> 2. **main** — shadcn/ui + Tailwind (versatile)
> 3. **mui** — Material UI (enterprise look, data-heavy UIs)
> 4. **gluestack** — gluestack-ui + Tailwind (mobile-first, responsive)

Set defaults to suggest:
- admin → recommend `mui` (data-heavy admin panels)
- desktop → recommend `react-aria` (production-grade, full control)
- mobile → recommend `gluestack` (mobile-first design)

Remember the selection as `theme_choices[platform]`.

### Safety warning if existing pages

If `existing_pages[platform] > 0` AND the chosen theme differs from the current theme:

> ⚠️ `{platform}` currently has `{count}` page(s) built with `{current_theme}`.
> Switching to `{new_theme}` will replace them.
>
> Your current work is saved — switch back anytime via `/prototype-theme`.
>
> Continue? (Yes / No)

If No → keep current theme for this platform, continue to next platform.

## Step 8 — Execute the switch

### 8a — Update workspace.json

Write `prototype/workspace.json`:
```json
{
  "platforms": {
    "admin": { "theme": "{theme}", "port": 3000, "enabled": {true/false} },
    "desktop": { "theme": "{theme}", "port": 3001, "enabled": {true/false} },
    "mobile": { "theme": "{theme}", "port": 3002, "enabled": {true/false} }
  },
  "defaultPlatform": "{first enabled platform}"
}
```

### 8b — Switch submodule branches

For each enabled platform where the theme changed:

> Theme `react-aria` dùng nhánh submodule `unstyled` của shadcn-kit (Radix/React-Aria base) — map `react-aria` → branch `unstyled` khi checkout; các theme khác giữ tên branch trùng tên theme.

```bash
cd prototype/themes/{platform}
git fetch origin
git checkout {theme_branch}
git pull --ff-only origin {theme_branch}
cd ../../..
```

If pull fails (divergence) → abort for that platform:
> ❌ The remote version of `{theme_branch}` has diverged for `{platform}`.
> Please ask a developer to help reconcile.

### 8c — Create project branch for each platform (if new)

For each enabled platform, check if a project-specific branch exists:
- Branch name convention: `{project_name}-{platform}` (e.g., `academy-admin`, `academy-desktop`)
- If branch does NOT exist on remote → create local branch:
  ```bash
  cd prototype/themes/{platform}
  git checkout -b {project_name}-{platform}
  cd ../../..
  ```
  This branch will be pushed by `/ba-finish` on first save.

### 8d — Stage changes

```bash
git add prototype
```

⚠️ Do NOT commit. `/ba-finish` handles atomic save.

## Step 9 — Report

Print:

```
✅ Prototype workspace ready

Project:    {project_name}

Platforms:
  {✅/⬜} admin     — {theme} — http://localhost:3000
  {✅/⬜} desktop   — {theme} — http://localhost:3001
  {✅/⬜} mobile    — {theme} — http://localhost:3002

Next steps:
  1. cd prototype && bash init.sh    (installs deps + starts enabled servers)
  2. /build-prototype                (build UI screens from specs)

When done, run /ba-finish to save everything.
```

Use ✅ for enabled, ⬜ for disabled.

If any platforms are new (no existing branch), add:
> 💡 New platform branches will be pushed to shadcn-kit the first time you run `/ba-finish`.

## Operating principles

1. **workspace branch is the default** — prototype/ should always be on the `workspace` branch, which contains the multi-platform structure
2. **Each platform = its own submodule** — themes/admin, themes/desktop, themes/mobile are independent Next.js apps
3. **Branch naming**: `{project_name}-{platform}` (e.g., `academy-admin`, `academy-desktop`, `academy-mobile`)
4. **Never destroy saved work** — uncommitted changes always abort with guidance
5. **Never push during theme switch** — that's `/ba-finish`'s job
6. **Never commit the pin here** — let `/ba-finish` handle atomic save
7. **Cancel is always available** — BA can back out at any decision point
8. **Defaults are smart** — desktop→react-aria (default), admin→mui, mobile→gluestack

## Language

All output in English.
