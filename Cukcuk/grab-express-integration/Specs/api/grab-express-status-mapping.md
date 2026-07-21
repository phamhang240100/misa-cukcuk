---
type: status-mapping
feature: grab-express
status: draft
updated: 2026-07-20
source: developer-beta.stg-myteksi.com/docs/grab-express (fetched live 2026-07-20)
---

# Grab Express ↔ CukCuk — Bảng mapping trạng thái đầy đủ (C86574)

Thay thế/bổ sung bảng mapping ở `../grab-express-brd.md` §2 và `../sequence/grab-express-flow-spec.md` §3 — bổ sung `IN_RETURN` (thiếu hoàn toàn ở 2 file gốc) và làm rõ `QUEUEING`.

---

## 1. Toàn bộ 11 trạng thái Grab Express (theo docs chính thức)

| Trạng thái Grab | Ý nghĩa | Áp dụng cho CukCuk? |
|---|---|---|
| `QUEUEING` | Trạng thái khởi tạo CHỈ dành cho đơn đặt lịch (`serviceType=SAME_DAY`/`BULK` với khung giờ lấy hàng trong tương lai) | ❌ **Không xảy ra** — CukCuk chỉ dùng `serviceType=INSTANT` (BR-grab-express-002), đơn `INSTANT` luôn khởi tạo thẳng ở `ALLOCATING`. *(Đính chính: `QUEUEING` có thật trong mô hình 11 trạng thái của Grab — không phải "không tồn tại" như flow-spec cũ viết ở §8-mục 1; lý do đúng là nó không áp dụng cho scope INSTANT-only của CukCuk, không phải vì Grab không có trạng thái này.)* |
| `ALLOCATING` | Khởi tạo đơn `INSTANT` — đang tìm tài xế | ✅ |
| `PENDING_PICKUP` | Đã tìm được tài xế, tài xế chưa xuất phát | ✅ |
| `PICKING_UP` | Tài xế đang trên đường tới lấy hàng | ✅ |
| `PENDING_DROP_OFF` | Tài xế đã lấy hàng, đang trên đường giao | ✅ |
| `IN_DELIVERY` | Tài xế đã tới nơi giao (đang giao) | ✅ |
| `IN_RETURN` | Giao không thành công, tài xế đang mang hàng **quay về** quán (CHƯA về tới) | ✅ **Bổ sung mới trong bảng mapping (thiếu ở tài liệu gốc)** |
| `COMPLETED` | Giao thành công (**kết thúc**) | ✅ |
| `RETURNED` | Tài xế đã về tới quán, trả lại hàng (**kết thúc**) | ✅ |
| `CANCELED` / `CANCELLED` | Đơn bị hủy (**kết thúc**) | ✅ — xem lưu ý chính tả ở §3 |
| `FAILED` | Không giao được: hết hạn SLA / tài xế hủy / không tìm được tài xế (**kết thúc**) | ✅ |

---

## 2. Bảng mapping GE → CukCuk (đầy đủ, đã bổ sung IN_RETURN)

| GE (Grab) | CukCuk status | Nhãn phụ hiển thị | Nút hiển thị | Có cho phép Hủy sang Grab không? |
|---|---|---|---|---|
| `ALLOCATING` | Chờ giao hàng | — | Hủy | ✅ Có |
| `PENDING_PICKUP` | Chờ giao hàng | — | Hủy | ✅ Có |
| `PICKING_UP` | **(giữ) Chờ giao hàng** *(sửa 2026-07-22: KHÔNG còn auto ở đây)* | — | Hủy | ✅ Có (giới hạn cuối cùng còn hủy được) |
| `PENDING_DROP_OFF` | **Tự động** → Đang giao hàng *(mốc auto-sync mới)* | — | — (không nút) | ❌ Không |
| `IN_DELIVERY` | Đang giao hàng | — | — (không nút) | ❌ Không |
| `IN_RETURN` 🆕 | **Chờ giao hàng** *(sửa 2026-07-22: chuyển từ Đang giao hàng)* | **"Đang hoàn hàng"** (chữ nhỏ phụ) | **Giao hàng (DISABLED), không Hủy** | ❌ Không — hàng đang trên xe tài xế trên đường về, quán chưa cầm lại được để kiểm tra nên nút Giao hàng bị khóa; chờ tới `RETURNED` mới Gửi lại/Hủy |
| `COMPLETED` (chưa thu) | Đang giao hàng — nhãn "Chờ thu tiền" (không tự đóng) | — | **Thu tiền** | ❌ Không (đã hoàn tất) |
| `COMPLETED` (đã thu) | Đã thanh toán | — | — | ❌ Không |
| `CANCELED`/`CANCELLED` | Tự mở lại → **Chờ giao hàng** (sub-status *chưa gửi*) + cờ đỏ | — | **Giao hàng (gửi lại)** / Đổi đối tác / Hủy | ❌ Không (đã kết thúc) |
| `FAILED` | Tự mở lại → **Chờ giao hàng** (sub-status *chưa gửi*) + cờ đỏ | **Hiển thị lý do cụ thể** (xem §4) | **Giao hàng (gửi lại)** / Đổi đối tác / Hủy | ❌ Không (đã kết thúc) |
| `RETURNED` | (giữ) **Chờ giao hàng** — nhắc thu ngân chọn | — | **Giao hàng (gửi lại)** / Hủy | ❌ Không (đã kết thúc) |

**Vì sao `IN_RETURN` khác `FAILED`/`CANCELED`:** `FAILED`/`CANCELED` xảy ra **trước khi hàng rời quán** (không tìm được tài xế, hoặc hủy trước lúc lấy hàng) → món ăn vẫn còn nguyên tại quán, mở lại đơn ngay lập tức là hợp lý. `IN_RETURN` xảy ra **sau khi hàng đã rời quán và giao thất bại** — tài xế đang vật lý mang hàng quay về, quán chưa cầm lại được để kiểm tra tình trạng món ăn, nên chưa thao tác gì cho tới khi trạng thái chuyển hẳn sang `RETURNED` (tài xế đã về tới, quán đã cầm hàng).

---

## 3. Lưu ý chính tả `CANCELED` vs `CANCELLED`

Tài liệu chính thức của Grab **tự mâu thuẫn** giữa 2 cách viết: bảng liệt kê trạng thái ghi `CANCELED` (1 chữ L), nhưng cột "Webhook State" cùng bảng lại ghi `CANCELLED` (2 chữ L). Bản thân `types.ts` hiện tại của CukCuk dùng `CANCELLED` (2 chữ L), trong khi 3 file spec markdown (`grab-express-brd.md`, `grab-express-flow-spec.md`, `grab-express-flows.md`) đều đã sửa thành `CANCELED` (1 chữ L) theo một "đính chính" trước đây — đính chính đó dựa trên giả định 1 cách viết đúng duy nhất, nhưng thực tế Grab không nhất quán.

**Khuyến nghị kỹ thuật (không chặn tiến độ, áp dụng khi code):** ở tầng adapter nhận webhook, **chuẩn hóa cả 2 cách viết về cùng 1 giá trị nội bộ** (vd. luôn map về `CANCELLED` khớp `types.ts` hiện tại) trước khi lưu vào `DeliveryOrder.geStatus`, để không phụ thuộc vào việc Grab gửi payload thật với chính tả nào. **Cần verify bằng 1 đơn hủy thật ở sandbox Grab trước go-live** để biết chắc payload thật gửi chính tả nào.

---

## 4. Mã lý do khi `FAILED` (`advanceInfo.failedReason` / webhook `failedReason`)

**Quyết định phiên 2026-07-20: hiển thị lý do cụ thể cho thu ngân** (không chỉ ghi chung chung "Thất bại"), vì lý do ảnh hưởng tới việc có nên Gửi lại ngay hay cần kiểm tra lại thông tin trước.

| Mã | Lý do (theo docs Grab) | Gợi ý hành động hiển thị cho thu ngân |
|---|---|---|
| `2` | Tài xế hủy: nghi ngờ đơn ảo / sai thông tin người gửi | ⚠️ Nhắc kiểm tra lại SĐT/địa chỉ người nhận trước khi bấm Gửi lại |
| `5` | Grab (vận hành) tự hủy đơn | Có thể Gửi lại bình thường |
| `6` | Không tìm được tài xế | Có thể Gửi lại, hoặc gợi ý đổi đối tác nếu giờ cao điểm |

> Nếu Grab trả mã không nằm trong bảng trên (docs không liệt kê đầy đủ) → hiển thị message gốc từ Grab kèm mã số, không chặn thao tác Gửi lại/Hủy.

---

## 5. Bảng ràng buộc Hủy (tham chiếu — đã khớp đúng thiết kế hiện tại)

| Trạng thái GE | Cho phép `DELETE /deliveries/{id}`? |
|---|---|
| `ALLOCATING` | ✅ |
| `PENDING_PICKUP` | ✅ |
| `PICKING_UP` | ✅ |
| `PENDING_DROP_OFF` | ❌ |
| `IN_DELIVERY` | ❌ |
| `IN_RETURN` | ❌ (ngầm định — không nằm trong danh sách cho phép của Grab) |
| `COMPLETED` / `RETURNED` / `CANCELED` / `FAILED` | ❌ (đã kết thúc) |

Khớp đúng BR-grab-express-017 đã thiết kế trước đó — không phát hiện sai lệch.

---

## 6. Việc cần cập nhật ở tài liệu gốc

- `../grab-express-brd.md` §2: bổ sung dòng `IN_RETURN` vào bảng mapping (đã thực hiện — xem phần "Cập nhật §2.5").
- `../sequence/grab-express-flow-spec.md` §3: bổ sung dòng `IN_RETURN`; §8 mục 1: sửa lại lý do loại `QUEUEING` cho chính xác hơn (đã thực hiện — xem phần "Cập nhật §8").
- `../sequence/grab-express-flow-spec.md` §6: đóng OQ-02, OQ-04, OQ-05 (đã thực hiện).
