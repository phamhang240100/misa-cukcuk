---
type: message-prefix
---

# Sổ đăng ký tiền tố mã thông báo

> **SSOT cho tiền tố mã thông báo.** Mỗi module sở hữu **đúng một** tiền tố; ⛔ cấm trùng nhau. Thông báo dùng chung nhiều module thì dùng tiền tố chung duy nhất. ⛔ Module không được phát mã mang tiền tố của module khác — cần thì tự đặt mã mới trong tiền tố của mình.
>
> Module khai quyền sở hữu bằng quan hệ `owns` trỏ tới heading-anchor dưới đây. Bản đồ chính thức được sinh ra ở `registry/_views/prefixes.md`, ⛔ không sửa tay.

Mỗi tiền tố là một heading-anchor riêng: `registry/messages.md#MSG_{MOD}_`.

### MSG_GLOBAL_ — dùng chung
Phạm vi: chỉ những thông báo xuyên suốt nhiều module.

### MSG_WBE_ — web-be-shopeefood
Phạm vi: chỉ thông báo của Web BE tích hợp ShopeeFood.

Nhóm mã đang dùng:

| Nhóm | Ý nghĩa | Định nghĩa ở |
|---|---|---|
| `MSG_WBE_CONN_*` | Kết nối gian hàng | `edge-cases.md`, `requirements.md` |
| `MSG_WBE_LOAD_*` | Tải thực đơn về | `edge-cases.md` |
| `MSG_WBE_MAP_*` | Ghép nối thực đơn | `requirements.md`, `edge-cases.md` |
| `MSG_WBE_MENU_*` | Quản lý thực đơn | `data.md` (ràng buộc kiểm tra hợp lệ) |
| `MSG_WBE_SET_*` | Thiết lập giờ hoạt động, ngày nghỉ | `data.md` |
| `MSG_WBE_SYNC_*` | Đồng bộ lên ShopeeFood | `requirements.md`, `edge-cases.md` |
| `MSG_WBE_BUSY_*` | Tạm ngừng nhận đơn | `requirements.md`, `data.md` |
| `MSG_WBE_DISC_*` | Ngắt kết nối | `requirements.md`, `edge-cases.md` |

> Liệt kê đủ mọi câu chữ đang dùng: `grep -roh 'MSG_WBE_[A-Z_]*' specs/modules/web-be-shopeefood/ | sort -u`

### MSG_POS_ — pos-shopeefood
Phạm vi: chỉ thông báo của POS xử lý đơn ShopeeFood. *(module chưa viết)*

Quy tắc: một tiền tố ↔ một chủ sở hữu · chọn tiền tố không thể lẫn vào nhau · ⛔ cấm mượn mã của module khác cho tình huống của mình — phải tự đặt mã mới.
