---
type: clarification-log
feature: grab-express
status: final
updated: 2026-07-20
---

# Clarification Log — Phiên phân tích API Grab Express (2026-07-20)

Ghi lại toàn bộ câu hỏi/quyết định trong phiên phân tích API + mapping trạng thái, để tra cứu lý do sau này (đối chiếu `../grab-express-brd.md`, `../sequence/grab-express-flow-spec.md`, `grab-express-api-catalog.md`, `grab-express-status-mapping.md`).

**Nguồn gốc phiên:** đọc trực tiếp `developer-beta.stg-myteksi.com/docs/grab-express` (fetch live), đối chiếu prototype hiện có (`src/`) và 2 sub-agent phân tích (completeness-analyst + consistency-checker) so sánh spec cũ ↔ docs thật.

| # | Câu hỏi | Quyết định | Ghi chú/rủi ro còn lại |
|---|---|---|---|
| 1 | Bản đồ tài xế: dùng trackingURL thật của Grab hay build bản đồ riêng? | **Dùng trackingURL của Grab** — nút "Xem lộ trình" mở link, thay DriverMapMock | Link hết hạn 48h sau pickup |
| 2 | `codType` gửi giá trị gì khi tạo vận đơn COD? | **`ADVANCED`** cho mọi đơn COD | Grab không định nghĩa rõ REGULAR/ADVANCED khác nhau thế nào — rủi ro cần verify trước go-live (OQ-07) |
| 3 | Khi Hủy đơn, có giữ lại làm bản ghi "Đã hủy" cho báo cáo không? | **Giữ hành vi hiện tại** — xóa khỏi danh sách | Đã cân nhắc kỹ, hệ quả: WebReportsView sẽ không phản ánh đơn đã hủy |
| 4 | `IN_RETURN` map sang trạng thái/nút gì? | ~~Giữ "Đang giao hàng" + không nút~~ **⚠️ SUPERSEDED 2026-07-22:** map sang **Chờ giao hàng** + nhãn "Đang hoàn hàng"; nút **Giao hàng disabled**, không Hủy (xem `../luong-moi-change-2026-07-22.md`) | Khác `FAILED` vì hàng đã rời quán, đang trên xe tài xế quay về — quán chưa cầm lại để kiểm tra |
| 5 | Có tự tải & lưu ảnh bằng chứng (pickup/dropoff/cancel proof, hết hạn ~2h) không? | **Không làm ở v1** | Rủi ro: mất bằng chứng nếu có khiếu nại "không nhận được hàng" — chấp nhận cho v1 |
| 6 | `pickupPin` — có cần lưu/hiển thị không? | **Không** — bỏ hoàn toàn | Research: không tìm thấy đơn vị POS VN nào dùng; blog Grab mô tả xác minh bằng "Mã đơn hàng", không phải PIN |
| 7 | Có cần cơ chế chống gửi trùng đơn (idempotency) khi timeout không? | **Có** — `merchantOrderID = orderNo` cố định + kiểm tra lại trước khi cho Gửi lại | Dùng `DELETE /merchant/deliveries/{merchantOrderID}` làm cơ chế dọn dẹp nếu phát hiện trùng |
| 8 | Có cần lưu riêng `invoiceNo` của Grab (khác `invoiceNo`/`trackingNo` CukCuk) không? | **Không cần field mới** — `trackingNo` (=`deliveryID`) đã đủ làm khóa đối soát | |
| 9 | Có cần hiển thị biển số xe tài xế (`licensePlate`) không? | **Không cần** | |
| 10 | Có cần hiển thị lý do cụ thể khi `FAILED` không? | **Có** — hiển thị lý do cụ thể (mã 2/5/6) thay vì chỉ ghi "Thất bại" | |
| 11 | Xử lý `GET /deliveries/{id}` trả 404 lúc polling? | **Dừng tự động polling đơn đó**, hiện cảnh báo "Không đồng bộ được với Grab" + nút làm mới thủ công | |
| 12 | `highValue` và `promoCode` có cần dùng ở v1 không? | **Ngoài phạm vi v1** | |
| 13 | Nơi lưu 2 tài liệu mới (API catalog + status mapping)? | **`Specs/api/`** cạnh spec hiện có (`bpmn/`, `sequence/`) | |

## Các điểm tự chốt (không cần hỏi — chỉ là đính chính dựa trên fact đã kiểm chứng từ docs, không phải quyết định nghiệp vụ)

- `CANCELED` vs `CANCELLED`: docs Grab tự mâu thuẫn, không có "chính tả chuẩn" — khuyến nghị chuẩn hóa cả 2 dạng ở tầng adapter, verify sandbox trước go-live.
- `QUEUEING`: có tồn tại trong mô hình 11 trạng thái Grab, chỉ không áp dụng vì CukCuk dùng `INSTANT`-only.
- Hạn mức COD theo merchant: xác nhận Grab không có API này → `MAX_COD` là hằng số cấu hình cố định (đóng OQ-02).
- Idempotency key webhook: xác nhận không có event ID riêng → key luôn là `deliveryID+status+timestamp` (đóng OQ-04).
- Xác thực webhook: xác nhận không có HMAC/chữ ký body, chỉ có header `Authorization`+`Authorization-Id` (đóng một phần OQ-05 — cách so khớp cụ thể vẫn cần hỏi Grab).

## Câu hỏi vẫn còn mở, cần hỏi Grab/Kế toán trực tiếp (không tự quyết được từ docs)

- **OQ-01** — Cơ chế hoàn tiền ứng COD thực tế khi RETURNED/FAILED (tay-trao-tay hay qua ví/đối soát ~7 ngày)?
- **OQ-06** — Mô hình ví/thanh toán phí ship giữa MISA và Grab?
- **OQ-07 (mới)** — `codType=REGULAR` vs `ADVANCED` khác nhau thế nào về chức năng?
- Cách so khớp header `Authorization`/`Authorization-Id` cụ thể cho webhook (phần còn lại của OQ-05).
- Chính tả `CANCELED`/`CANCELLED` thật trong payload sandbox (phần còn lại của OQ-03).
