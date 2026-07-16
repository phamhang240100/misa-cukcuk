---
description: Bootstrap workspace - init submodules, verify vendored skills
---

Khởi chạy workspace misa-sdlc cho người mới clone về. Thực hiện tuần tự các bước sau, dừng lại báo lỗi nếu có bước nào fail.

## 1. Init các submodule

Chạy:

```bash
git submodule update --init --recursive
```

Kiểm tra `prototype/` đã có nội dung (`ls prototype/`). Nếu branch hiện tại có submodule `project/`, nó cũng sẽ được kéo về.

## 2. Xác minh skills đã sẵn sàng

Workspace này **vendor toàn bộ skill vào repo** (không phụ thuộc plugin marketplace) — các skill nằm sẵn trong `.claude/skills/` nên không cần cài `/plugin` gì cả. Kiểm tra qua `/skills` hoặc system reminder, phải thấy:

- BA: `analyze`, `discuss`, `refine`, `export`, `status`, `help`, `prototype-brand`, `prototype-plan`, `prototype-execute` (từ `.claude/skills/`, dùng `.claude/templates/` + 4 agent `ba-*`/`completeness-analyst`/`consistency-checker`)
- `deploy` (từ `.claude/skills/deploy/`)
- `agent-browser`, `find-skills`, `react-aria`, `design-taste-frontend`
- `gsd:*` (nhiều lệnh GSD, đi kèm `.claude/get-shit-done/`)

Nếu thiếu skill nào, kiểm tra lại `.claude/skills/<tên>/SKILL.md` có tồn tại không. Vì skill là local, chỉ cần file có mặt là được nhận — không cần bước cài đặt.

## 3. Báo cáo

In ra kết quả ngắn gọn cho user:
- Submodule nào đã init thành công
- Skill nào đã sẵn sàng / thiếu
