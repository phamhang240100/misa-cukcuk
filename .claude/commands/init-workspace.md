---
description: Bootstrap workspace - init submodules, install required plugins and skills
---

Khởi chạy workspace ai-sdlc cho người mới clone về. Thực hiện tuần tự các bước sau, dừng lại báo lỗi nếu có bước nào fail.

## 1. Init các submodule

Chạy:

```bash
git submodule update --init --recursive
```

Kiểm tra `prototype/` đã có nội dung (`ls prototype/`). Nếu branch hiện tại có submodule `project/`, nó cũng sẽ được kéo về.

## 2. Cài plugin marketplace + các plugin

Các lệnh sau là **slash command của Claude Code**, không phải bash. Nói với user chạy thủ công trong giao diện Claude Code:

```
/plugin marketplace add duongvanha/agent-skills
/plugin install deploy@agent-skills
/plugin install ba@agent-skills
/reload-plugins
```

Sau khi user chạy xong, các plugin `deploy` và `ba` sẽ khả dụng. File `.claude/settings.json` của repo đã có sẵn `enabledPlugins` nên các plugin sẽ tự bật cho workspace này.

## 3. Xác minh skills đã sẵn sàng

Các skill sau phải xuất hiện trong danh sách (kiểm tra qua `/skills` hoặc system reminder):

- `agent-browser`
- `find-skills`
- `deploy:deploy` (sau khi cài plugin ở bước 2)
- `ba:*` (analyze, discuss, refine, export, status, help — sau khi cài plugin ở bước 2)
- `gsd:*` (nhiều lệnh GSD, đi kèm `.claude/get-shit-done/`)

Nếu thiếu skill nào, báo user kiểm tra lại bước cài tương ứng.

## 4. Báo cáo

In ra kết quả ngắn gọn cho user:
- Submodule nào đã init thành công
- Lệnh `/plugin` user cần chạy
- Skill nào đã sẵn sàng / thiếu
