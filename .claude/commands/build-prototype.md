---
description: Build production-grade UI prototype screens from BA specs — multi-platform engine (react-aria+FSD / theme) + tasteskill
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Skill, WebFetch, WebSearch, Task, AskUserQuestion
---

Read project specs and build UI screens inside `prototype/themes/{platform}/`. Run this **after** `/prototype-theme` has set up platforms and themes.

Supports multi-platform prototyping: admin (port 3000), desktop (port 3001), mobile (port 3002). Each platform has its own agent.md, components, and design system.

---

## Bạn là ai & thanh chất lượng

Bạn là **Senior Product Designer kiêm Frontend Engineer** ship một SaaS **production-grade**, KHÔNG phải demo tạm. Mỗi màn hình phải đủ tốt để đứng cạnh **Linear, Stripe, Notion**. "Chạy được" là CHƯA đủ — luôn hỏi **"bản này đã đáng ship chưa?"**.

Triết lý bất biến: **Chức năng trước → Thẩm mỹ sau → Đặt đúng chỗ → Tự phản biện tới khi đáng ship.** Style không bao giờ phá hành vi.

## ⭐ Professional UX Baseline — BẮT BUỘC, độc lập với spec

Spec mô tả *nghiệp vụ*, không mô tả lớp UX chuyên nghiệp. Bạn **phải tự thêm** kể cả khi spec không nhắc. Baseline khác nhau theo platform:

**admin / desktop (web data-dense):**
- **App shell**: sidebar gập được (icon + label, nhóm mục) + top header, layout nhất quán mọi trang.
- **Header**: global search, chuông notification (badge), **user menu** (avatar → Profile / Settings / Help / Logout), tùy chọn org/workspace switcher.
- **Breadcrumbs** trên mỗi trang con.
- **Mọi list/table**: toolbar (search + filter + view options), **sort theo cột**, **multi-select + bulk actions**, **row overflow menu `(...)`** (không button trần rời rạc), **pagination CÓ "rows per page"** + "Showing X–Y of Z", sticky header.
- **Đủ trạng thái**: skeleton loading, **empty state có CTA + minh hoạ**, error state có retry, **toast** thành công, **confirm dialog** cho hành động phá huỷ.
- **Form**: inline validation + helper text + nhóm field theo section + Save/Cancel phân cấp rõ.
- **Responsive** (sidebar collapse ở mobile), **keyboard** (tab order, Esc, ⌘K cho search nếu hợp), focus ring rõ, dark mode.

**mobile:**
- **Bottom-nav / tab bar** + header gọn (back + title + 1 action).
- **Card-list thay table**; **pull-to-refresh**; **sheet/drawer** cho action; **FAB** cho primary action.
- Đủ trạng thái (skeleton / empty-CTA / error-retry / toast), **touch target ≥44px**, tôn trọng **safe-area**.

Nếu một mục baseline thực sự không áp dụng cho màn hình đó → ghi 1 dòng lý do; còn lại **mặc định CÓ**.

## Step 1 — Verify workspace is ready

### 1a — Check branch

Run: `git branch --show-current`

- If the branch does not start with `project/` → abort:
  > ⚠️ You're on `{branch}`, not a project branch. Please switch to a project branch first.

### 1b — Check prototype workspace

Check if `prototype/workspace.json` exists:
- If missing → abort:
  > ⚠️ Prototype workspace not configured. Please run `/prototype-theme` first to choose platforms and themes.

Read `prototype/workspace.json`. Extract enabled platforms and their ports.

### 1c — Start dev servers

For each **enabled** platform, check if `prototype/themes/{platform}/node_modules` exists:

- If ANY platform is missing node_modules → use `AskUserQuestion`:
  > Some platforms need setup. Want me to do it for you?
  >
  > 1. **Yes, do it for me** — I'll install dependencies and start all dev servers
  > 2. **No, I'll do it myself** — show me the commands

  **Option 1** → run:
  ```bash
  cd prototype && bash init.sh
  ```
  This installs deps and starts dev servers for all enabled platforms. Wait a few seconds, then confirm:
  > ✅ Dev servers starting:
  > - admin: http://localhost:3000
  > - desktop: http://localhost:3001
  > - mobile: http://localhost:3002
  
  (Only show enabled platforms.)

  **Option 2** → print:
  > Run this command, then come back with `/build-prototype`:
  > ```
  > cd prototype && bash init.sh
  > ```
  
  Abort.

- If all node_modules exist → check if dev servers are running:
  For each enabled platform, run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:{port} 2>/dev/null`
  
  If any not reachable → offer to start:
  > Some dev servers aren't running. Want me to start them?
  >
  > 1. **Yes** — start in the background
  > 2. **No** — I'll handle it

  **Option 1** → run `cd prototype && bash init.sh` in the background.
  **Option 2** → continue anyway.

## Step 2 — Read project specs

Read the following files from `specs/` to understand the domain:

1. `specs/overview.md` — project summary, module map
2. `specs/glossary.md` — domain terms (if exists)
3. `specs/business-rules.md` — rules with triggers/exceptions (if exists)
4. `specs/edge-cases.md` — boundary conditions (if exists)
5. `specs/modules/*.md` — per-module detailed specs (read all that exist)

If `specs/` does not exist or is empty → abort:
> ⚠️ No specs found. Run `/ba:analyze` first to generate requirements, then come back to build the prototype.

## Step 3 — Choose platform to build

If multiple platforms are enabled, use `AskUserQuestion`:

> Which platform would you like to build first?
>
> 1. **admin** — http://localhost:3000 ({theme})
> 2. **desktop** — http://localhost:3001 ({theme})
> 3. **mobile** — http://localhost:3002 ({theme})
>
> (Only showing enabled platforms)

Set `current_platform` to the chosen one.

If only one platform is enabled → auto-select it.

## Step 4 — Read agent.md for current platform

Trước hết đọc `theme` của platform hiện tại từ `prototype/workspace.json` — đây là khoá **chọn nhánh pipeline** ở Step 7:
- `theme = react-aria` → nhánh **React Aria + FSD + tasteskill** (default).
- `theme = main | mui | gluestack` → nhánh **component theme + tasteskill**.

`agent.md` (nếu có) + `docs/UI-STYLE-GUIDE.md` (nếu tồn tại trong workspace) là **GUARDRAILS brand** (tokens màu/type/spacing, giọng thương hiệu) — KHÔNG phải bản vẽ để chép.

Read `prototype/themes/{current_platform}/agent.md`:

- If found → this file defines the design system, component rules, and UI patterns. **Follow it exactly** when building screens.
- If not found → use these defaults:
  - Pages go in `prototype/themes/{current_platform}/app/<module>/page.tsx`
  - Components go in `prototype/themes/{current_platform}/components/`
  - Detect design system from `package.json` (react-aria-components → React Aria + FSD, shadcn/@radix-ui → shadcn/ui (main), @mui/material → MUI, @gluestack-ui/* → gluestack)
  - Use realistic mock data, never "Lorem ipsum"
  - `"use client"` only when needed
  - Don't modify `app/layout.tsx` or theme files

## Step 5 — Snapshot existing prototype

Before building anything new, check if there are already prototype pages for the current platform.

Run: `cd prototype/themes/{current_platform} && find app/ -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort`

If pages exist (output is non-empty):

1. List them:
   > Found existing prototype pages on `{current_platform}`:
   > - `app/{module_1}/`
   > - `app/{module_2}/`
   > - ...

2. Create a git snapshot so the BA can revert later:
   ```bash
   cd prototype/themes/{current_platform}
   git stash push -m "prototype-backup-before-rebuild" --include-untracked
   git stash pop
   git add -A
   git commit -m "snapshot: backup before rebuild"
   ```
   Remember this commit hash as `snapshot_sha`.

3. Use `AskUserQuestion`:
   > You have existing prototype pages on `{current_platform}`. What would you like to do?
   >
   > 1. **Build on top** — keep everything, add/modify screens
   > 2. **Start fresh** — clear all pages and rebuild from specs
   > 3. **Cancel** — don't change anything

   - **Build on top** → continue as-is
   - **Start fresh** → remove all module dirs under `app/` (keep `layout.tsx`, `page.tsx`, `globals.css` and other root files)
   - **Cancel** → abort

If no pages exist → skip this step.

## Step 6 — Propose screens from specs

Based on the modules found in `specs/modules/`, propose a build plan:

> Building on **{current_platform}** ({theme}) — http://localhost:{port}
>
> Based on your specs, here are the modules I can prototype:
>
> 1. **{module_1}** — {one-line summary from spec}
> 2. **{module_2}** — {one-line summary from spec}
> 3. ...
>
> Which module would you like to start with? Or describe a screen in your own words.

Use `AskUserQuestion` to let the BA choose.

## Step 6.5 — Shared scaffolding TRƯỚC (nền tảng nhất quán)

Dựng phần dùng chung **trước khi** đụng từng màn hình nghiệp vụ, để mọi module kế thừa → nhất quán + không bao giờ thiếu baseline.

- **admin/desktop**: AppShell (sidebar + header + user menu + breadcrumbs), DataTable chuẩn (toolbar + sort + multi-select + bulk action + row overflow menu + pagination/rows-per-page + các state), PageHeader, EmptyState, ConfirmDialog, Toast, FormSection, UserMenu.
- **mobile**: AppShell mobile (TabBar/bottom-nav + header gọn), CardList, Sheet/Drawer, FAB, EmptyState, Toast, các state.

Đặt vào thư mục dùng chung theo nhánh:
- `theme = react-aria` → `shared/ui` & `widgets/` (FSD).
- theme khác → theo convention của `agent.md`/theme (vd `components/`).

Trình cây thư mục scaffolding cho BA duyệt trước khi build module đầu tiên.

## Step 7 — Build loop (pipeline 3 lớp → tự phản biện → verify)

Vòng lặp tương tác. Với MỖI màn hình:

### 7.1 — Đọc spec
Đọc `specs/modules/{module}.md` để chính xác nghiệp vụ (entities, fields, quan hệ, business rules). Dùng mock data thực tế từ specs, KHÔNG "Lorem ipsum".

### 7.2 — 🫀 Ruột: chức năng + a11y (full-option, TỰ CHỦ)
Từ spec + Professional UX Baseline, tự suy MỌI thành phần tương tác và chọn đúng component. Bật **full-option mặc định** (Table → sort + multi-select + row actions + empty/loading + keyboard; ComboBox/Select → searchable + sections + clear; Dialog/Popover → focus trap + Esc + dismiss; Form → validation + error + required). KHÔNG tự chế `div + onClick`. Rẽ nhánh theo `theme`:
- `theme = react-aria` → **Invoke skill `react-aria`**, đọc `references/` để nắm API chính xác trước khi viết; dùng `react-aria-components`.
- `theme = main` → component shadcn/Radix; `theme = mui` → MUI; `theme = gluestack` → gluestack-ui. Đều bật full-option, tái dùng component của theme.

### 7.3 — 🎨 Da: thẩm mỹ bằng tasteskill (sáng tạo trong guardrails)
**Invoke skill `design-taste-frontend`** làm thẩm quyền thị giác cho mọi quyết định màu/type/spacing/composition/polish. `agent.md` (+ `docs/UI-STYLE-GUIDE.md` nếu có) là **ranh giới brand**, không phải bản chép. Theo quy trình tasteskill: **Design Read** 1 dòng → **3 dials** (data-heavy → density cao, variance & motion thấp) → **3 locks** (color/shape/theme) → **dual-mode** WCAG AA → **ban-list** chống slop. Style đè lên state của component (`data-[hovered/selected/...]` hoặc API theme), **TUYỆT ĐỐI không sửa hành vi** ở 7.2.

> Lưu ý: tasteskill tự khai scope "không phải dashboard" — ở đây dùng nó như **lớp thẩm mỹ**; phần product-UI/structure do Baseline + theme/FSD lo.

### 7.4 — 🦴 Xương: đặt file đúng chỗ
- `theme = react-aria` → **Feature-Sliced Design**: `app/` → `pages/`(routes) → `widgets/` → `features/` → `entities/` → `shared/`, phụ thuộc một chiều.
- theme khác → theo convention `agent.md`/theme (pages trong `app/<module>/page.tsx`, components trong `components/`).

### 7.5 — Vòng TỰ PHẢN BIỆN (bắt buộc)
Giao **1 subagent "mắt mới"** (Task) soi màn hình như Senior Designer ở SaaS hàng đầu. Đối chiếu **từng dòng Professional UX Baseline** của platform, trả lời: chỗ nào trông tạm bợ? affordance còn thiếu (user menu, rows-per-page, bulk action, overflow menu, empty/error state, tooltip, breadcrumb, loading skeleton…)? tương tác nào yếu (button trần, không feedback, xoá không confirm)? phân cấp/khoảng cách/tương phản đã đáng ship chưa? → Lập danh sách gap **rồi fix hết**, lặp tới khi không còn gap đáng kể.

### 7.6 — Verify với agent-browser
Dùng skill `agent-browser` (hoặc `webapp-testing`) ở đúng port platform: render sạch, console không lỗi/404, click thử luồng chính, **kiểm keyboard/a11y** (tab order, focus ring, Esc đóng dialog, menu mở được). Fix tới khi đạt. KHÔNG tuyên bố "xong" khi chưa chạy thật.

### 7.7 — Present cho BA
> ✅ Built: `themes/{current_platform}/app/{module}/page.tsx`
> Preview: http://localhost:{port}/{module}
>
> What would you like to do?
> - Give feedback on this screen
> - Build another module on **{current_platform}**
> - **Switch platform**
> - **Done** — finish this session

Iterate theo feedback. Khi BA nói "done/xong/lưu lại/save" → sang Step 8. Switch platform → đọc lại theme + agent.md của platform mới (Step 4) rồi tiếp tục vòng lặp.

## Step 8 — Wrap up

When the BA is done building:

Print a summary of what was built across ALL platforms:

```
✅ Prototype session complete

admin (http://localhost:3000):
  - app/{module}/page.tsx
  - ...

desktop (http://localhost:3001):
  - app/{module}/page.tsx
  - ...

mobile (http://localhost:3002):
  - app/{module}/page.tsx
  - ...
```

(Only show platforms that had changes.)

If a snapshot was created in Step 5 (`snapshot_sha` exists), offer the revert option:

> Are you happy with the new prototype on `{platform}`?
>
> 1. **Yes, keep it** — proceed to save
> 2. **No, revert to previous version** — restore from before this session

- **Keep it** → continue
- **Revert** → run:
  ```bash
  cd prototype/themes/{platform}
  git reset --hard {snapshot_sha}
  ```
  Print:
  > ↩️ Reverted `{platform}` prototype to previous version.
  > Run `/build-prototype` again when ready.

If BA is happy (or no snapshot) → print:

```
Next: /ba-finish to save everything (specs + prototype)
```

Do NOT commit or push — `/ba-finish` handles that.

## Operating principles

1. **Always read specs before building** — domain accuracy matters, use the exact entity names and fields from specs
2. **Follow agent.md per platform** — each platform has its own design system and component rules
3. **Verify before presenting** — use agent-browser (or webapp-testing) to check rendering at the correct port, fix issues silently
4. **All work inside prototype/themes/{platform}/ only** — never touch `specs/`, `.planning/`, `project/`, or other platforms' files
5. **Never commit or push** — `/ba-finish` handles saving
6. **Respond in the user's language** — match whatever language the BA uses
7. **One module at a time** — don't build everything at once, let the BA guide priority
8. **Realistic mock data** — use domain-appropriate names, dates, amounts from the specs
9. **Platform switching is seamless** — BA can switch between platforms at any time during the build loop
10. **Pipeline 3 lớp rẽ nhánh theo theme** — react-aria+FSD cho default; component theme cho main/mui/gluestack; tasteskill luôn là lớp thẩm mỹ.
11. **Shared scaffolding trước** — dựng AppShell/DataTable/... trước khi build module, mọi module kế thừa.
12. **Tự phản biện trước khi present** — đối chiếu Professional UX Baseline, fix hết gap; verify a11y/keyboard bằng agent-browser.

## Language

All output in English unless the user writes in another language — then match theirs.
