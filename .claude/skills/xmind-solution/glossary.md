# Từ điển từ ngữ — XMind giải pháp nghiệp vụ

Nguyên tắc gốc: **thuần tiếng Việt, chính xác – rõ ràng – ngắn gọn – đầy đủ.** Đây là tài liệu mô tả nghiệp vụ cho BA/PO/dev đọc, KHÔNG phải tài liệu kỹ thuật. Không chèn tiếng Anh trong ngoặc, không tên API/endpoint.

## 1. Bảng thay thế (Tránh → Dùng)

| Tránh (kỹ thuật / jargon) | Dùng (nghiệp vụ) |
|---|---|
| khóa / lock / khóa cứng | **không cho chỉnh sửa** |
| disabled / mờ / grey out | **mờ đi, không bấm được** |
| enabled / active | **bấm được / đang bật** |
| auto-sync / auto / tự động sync | **tự động chuyển** / **tự động cập nhật** |
| POST /deliveries · tạo vận đơn · create delivery | **đẩy đơn sang đối tác** (hành động nút "Giao hàng") |
| DELETE · hủy vận đơn · cancel delivery | **hủy đơn với đối tác** |
| GET /deliveries · fetch status | **hỏi lại trạng thái đơn** |
| webhook | **đối tác báo trạng thái về** |
| polling | **tự hỏi lại đối tác định kỳ** |
| validate / validation | **kiểm tra hợp lệ** |
| serviceType = INSTANT | **Siêu tốc** |
| codType / ADVANCED / REGULAR | *(không đưa vào doc nghiệp vụ)* |
| Idempotency-Key / merchantOrderID | *(không đưa vào doc nghiệp vụ; nếu cần: "chống gửi trùng đơn")* |
| Quote API / báo giá qua API | **lấy phí giao hàng từ đối tác** |
| banner / popup / toast | **cảnh báo** / **thông báo** |
| field / trường dữ liệu | **trường thông tin** |
| flag / cờ | **đánh dấu** (vd "đánh dấu đỏ") |
| COD | **tiền thu hộ (COD)** — giữ "COD" vì là thuật ngữ nghiệp vụ quen thuộc |
| VAT | **hóa đơn VAT** — giữ, thuật ngữ nghiệp vụ |

## 2. Mã trạng thái Grab — GIỮ mã + nghĩa Việt

Trong doc nghiệp vụ, mã trạng thái Grab được giữ lại (vì cần đối chiếu với đối tác) NHƯNG luôn kèm nghĩa tiếng Việt, dạng `MÃ — Nghĩa Việt`:

| Mã Grab | Nghĩa Việt (dùng trong doc) |
|---|---|
| (trống) | Chưa gửi đối tác |
| ALLOCATING | Đang tìm tài xế |
| PENDING_PICKUP | Đã tìm được tài xế |
| PICKING_UP | Tài xế đang tới lấy |
| PENDING_DROP_OFF | Đã lấy hàng |
| IN_DELIVERY | Đang giao |
| IN_RETURN | Đang hoàn hàng |
| COMPLETED | Giao thành công |
| RETURNED | Đã trả hàng |
| CANCELED | Đã hủy |
| FAILED | Không tìm được tài xế / giao thất bại |

## 3. Được phép giữ nguyên (whitelist)

Tên sản phẩm / nhãn UI / thuật ngữ nghiệp vụ chuẩn: **Grab Express, GrabExpress, Grab Food, CukCuk, MISA, COD, VAT**, tên nút đúng sản phẩm ("Giao hàng", "Thu tiền", "Hủy", "Kết nối"...), tên màn hình ("Sổ giao hàng", "Order online"...), và các **mã trạng thái Grab** ở mục 2 (khi kèm nghĩa Việt).

## 4. Câu điều kiện

Viết dạng **"Nếu … thì …"** hoặc **"Khi … → …"**, chủ ngữ là người dùng/hệ thống, ngắn gọn:
- ✅ "Khi tài xế đã lấy hàng → đơn tự chuyển sang Đang giao hàng."
- ✅ "Nếu địa chỉ ngoài vùng phục vụ → cảnh báo và không cho lưu."
- ❌ "Auto-sync khi webhook PENDING_DROP_OFF fire → transition to IN_DELIVERY state."
