# misa-sdlc

Workspace BA + Prototype độc lập cho các dự án Misa. Seed từ toolchain `ai-sdlc`, git riêng, sửa/xóa skill thoải mái không ảnh hưởng workspace khác.

## Quy ước: 1 repo, mỗi dự án = 1 branch

- `base` — trunk chứa toolchain dùng chung (`.claude/`, agents, hooks, GSD, skills).
- `project/<tên>` — mỗi dự án Misa 1 branch, tách ra từ `base`.

```bash
git switch base
git switch -c project/<ten-du-an>   # bắt đầu dự án mới
```

Cập nhật toolchain cho mọi dự án: sửa trên `base` rồi `git merge base` vào từng branch project.

## Skill sẵn có

Commands (`.claude/commands/`):
- `/ba-start`, `/ba-finish`, `/ba-to-gsd` — vòng đời BA Clarity (ghi ra `specs/`)
- `/prototype-theme` — chọn platform + theme, dựng `prototype/themes/{platform}/`
- `/build-prototype` — build màn hình UI từ specs (chạy sau `/prototype-theme`)
- `/init-workspace` — bootstrap (init submodule, xác minh plugin/skill)
- `gsd:*` — hệ thống Get-Shit-Done

Plugin `ba@duongvanha-skills` + `deploy@duongvanha-skills` cài ở **user-scope** (dùng chung toàn máy), đã bật sẵn trong `.claude/settings.json`.

## Bắt đầu

```bash
git submodule update --init --recursive   # kéo prototype/ (shadcn-kit) nếu chưa có
```

Mở Claude Code trong folder này rồi chạy `/ba-start` (dự án mới) hoặc `/init-workspace` (lần đầu).
