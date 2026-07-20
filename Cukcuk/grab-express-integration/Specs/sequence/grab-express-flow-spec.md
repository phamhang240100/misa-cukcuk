---
type: srs
feature: grab-express
status: draft
updated: 2026-07-19
---

# Grab Express × MISA CukCuk — Mô tả luồng tích hợp đầy đủ

Tài liệu mô tả nghiệp vụ đầy đủ của luồng tích hợp đối tác giao hàng Grab Express vào MISA CukCuk (C86574), sau khi tối ưu về logic và UX. Sequence diagram nằm ở `grab-express-flows.md`, state machine nằm ở `grab-express-states.md`.

## 1. Bối cảnh & quyết định thiết kế lõi

Trước đây hệ thống chạy **2 luồng trạng thái độc lập**: trạng thái đơn CukCuk (đổi *chỉ* khi thu ngân bấm nút) và trạng thái Grab Express — GE (do webhook), **không tự map** vào nhau. Hệ quả: thu ngân có thể bấm *Giao hàng* khi GE mới `ALLOCATING` (chưa có tài xế), dữ liệu lệch thực tế.

**Quyết định:** chuyển sang **mô hình Hybrid auto-sync** — tự động đồng bộ các bước *giao hàng* từ webhook, nhưng **gate bước tiền** để thu ngân xác nhận.

| Nguyên tắc | Chốt |
|---|---|
| Auto-sync bước giao hàng | GE `PICKING_UP` → **tự** đẩy đơn CukCuk *Chờ giao hàng* → *Đang giao hàng*. **Bỏ nút "Giao hàng" thủ công** cho đơn Grab Express. |
| Gate bước tiền | Nút *Thu tiền* **luôn thủ công**, **chặn cứng**: chỉ mở khi GE = `COMPLETED`. |
| Không tự đóng đơn | **Không bao giờ** tự đóng sang *Đã thanh toán* (kể cả đơn COD = 0) — luôn cần thu ngân bấm *Thu tiền*. |
| Manual tối thượng | Khi thu ngân đã thao tác tay, tắt auto cho bước đó; auto-sync **chỉ tiến, không lùi**, không ghi đè trạng thái tay. |
| Dự phòng webhook | **Polling** `GET /deliveries/{id}` định kỳ để không phụ thuộc hoàn toàn webhook. |
| Đồng bộ đa thiết bị | Trạng thái đơn + thông báo đồng bộ cho **mọi thiết bị cùng chi nhánh** (không chỉ máy tạo đơn). |

## 2. Actors

| Actor | Vai trò |
|---|---|
| Người dùng / Thu ngân | Kết nối đối tác (Web quản lý); lập đơn, gửi đơn, thu tiền, hủy (POS) |
| MISA CukCuk | Web quản lý + POS + Backend: xác thực OAuth, gọi API Grab, nhận webhook, đồng bộ trạng thái |
| GrabID OAuth | Cấp `access_token` (client_credentials, cấp-partner) |
| Grab Express API | Báo giá (quote), tạo/hủy vận đơn, gửi webhook trạng thái |

## 3. Vòng đời đơn Grab Express (đã tối ưu)

```
Lập đơn → [quote OK] → Lưu (Chờ gửi đối tác)
        → Gửi đơn hàng (tay) → [POST /deliveries OK] → Chờ giao hàng (GE=ALLOCATING)
        → [webhook PICKING_UP: AUTO] → Đang giao hàng
        → [webhook COMPLETED: banner "Chờ thu tiền"]
        → Thu tiền (tay, chỉ mở khi COMPLETED) → Đã thanh toán
```

Bảng map trạng thái **GE → CukCuk**:

| GE (webhook) | CukCuk tự động | Nút hiển thị |
|---|---|---|
| `ALLOCATING` | (giữ) Chờ giao hàng | Hủy |
| `PENDING_PICKUP` | (giữ) Chờ giao hàng | Hủy |
| `PICKING_UP` | **AUTO** → Đang giao hàng | Hủy (chỉ khi ≤ PICKING_UP) |
| `PENDING_DROP_OFF` | (giữ) Đang giao hàng | — |
| `IN_DELIVERY` | (giữ) Đang giao hàng | — |
| `IN_RETURN` | (giữ) Đang giao hàng + nhãn phụ "Đang hoàn hàng" | — (không nút, kể cả Hủy — hàng đang trên xe tài xế, quán chưa cầm lại được để kiểm tra) |
| `COMPLETED` | Banner "Chờ thu tiền" (KHÔNG tự đóng) | **Thu tiền** |
| `CANCELED` / `FAILED` | Tự mở lại → Chờ gửi đối tác + cờ đỏ (FAILED kèm hiển thị lý do cụ thể — mã 2/5/6, xem `../api/grab-express-status-mapping.md` §4) | Gửi lại / Đổi đối tác / Hủy |
| `RETURNED` | Nhắc thu ngân chọn | Gửi lại / Hủy |

> Bảng mapping đầy đủ 11 trạng thái + lý do khác biệt IN_RETURN vs FAILED: `../api/grab-express-status-mapping.md`.

## 4. Business Rules

| ID | Rule |
|---|---|
| BR-grab-express-001 | Xác thực = OAuth 2.0 `client_credentials` cấp-partner MISA, Bearer ~7 ngày, cache; gặp 401 thì tự refresh nền + gọi lại (thu ngân không thấy lỗi). |
| BR-grab-express-002 | Loại dịch vụ = `INSTANT` ("Siêu tốc - Thực phẩm"), khóa — không cho chọn gói khác. |
| BR-grab-express-003 | COD (`cashOnDelivery`) = (tiền món + Phí GH thu khách) − Đặt cọc trước. |
| BR-grab-express-004 | Phí trả đối tác (khóa, từ Quote); Phí thu khách (sửa được, mặc định = phí trả đối tác). Phí thu khách < phí trả đối tác → cảnh báo mềm (không chặn). |
| BR-grab-express-005 | Grab **không có API** trả hạn mức COD theo merchant (xác nhận 2026-07-20). `MAX_COD` là **hằng số cấu hình cố định, mặc định 2.000.000đ** (không lookup động). Re-check cả lúc Lưu và lúc Gửi đơn. |
| BR-grab-express-006 | Vùng phục vụ **validate động qua Quote API** — Grab báo giá được = phục vụ được. KHÔNG hard-code danh sách 5 tỉnh. |
| BR-grab-express-007 | Auto-sync Hybrid: GE `PICKING_UP` tự đẩy *Chờ giao hàng* → *Đang giao hàng*. Bỏ nút *Giao hàng* thủ công cho đơn Grab Express. |
| BR-grab-express-008 | Nút *Thu tiền* luôn thủ công, chặn cứng: chỉ mở khi GE = `COMPLETED`. Không bao giờ tự đóng *Đã thanh toán*. |
| BR-grab-express-009 | Manual tối thượng: thao tác tay của thu ngân tắt auto cho bước đó; auto-sync chỉ tiến, không lùi, không ghi đè trạng thái tay. |
| BR-grab-express-010 | Webhook: xác thực bằng header `Authorization` + `Authorization-Id` (Grab **không có** cơ chế HMAC/chữ ký body — xác nhận 2026-07-20, cách so khớp cụ thể cần hỏi Grab trước go-live); trả `200` ngay + xử lý bất đồng bộ qua queue idempotent; bỏ qua event out-of-order theo `timestamp`; idempotency key = `deliveryID + status + timestamp` (Grab **không có** field event ID riêng trong payload webhook — xác nhận 2026-07-20, đây là cách duy nhất, không có nhánh dự phòng khác). |
| BR-grab-express-011 | Polling `GET /deliveries/{id}` định kỳ làm dự phòng khi webhook mất/trễ, đồng bộ như webhook. |
| BR-grab-express-012 | Trạng thái đơn + thông báo đồng bộ cho mọi thiết bị cùng chi nhánh; thông báo vẫn ưu tiên máy tạo đơn. |
| BR-grab-express-013 | GE `FAILED`/`CANCELED` (món còn ở quán) → tự mở lại đơn về *Chờ gửi đối tác* (xóa Mã vận đơn/GE cũ) + cờ đỏ; cho Gửi lại / Đổi đối tác (AhaMove, tự giao) / Hủy — dùng lại đơn cũ, không tạo hóa đơn trùng. |
| BR-grab-express-014 | GE `RETURNED` (món đã ra rồi quay về) → nhắc thu ngân chọn *Gửi lại* (nếu còn tốt) hay *Hủy*; KHÔNG tự mở lại. |
| BR-grab-express-015 | COD Mô hình A (tài xế ứng tiền lúc pickup): đơn `RETURNED`/`FAILED` sau pickup → hoàn khoản ứng cho tài xế; đơn không đóng *Đã thanh toán*. **[Assumption — cần Grab/KT xác nhận cơ chế hoàn thực tế]** |
| BR-grab-express-016 | Gửi đơn: khóa nút ngay khi bấm (chống double-click); server chặn gửi lần 2 nếu đơn đã ≥ *Chờ giao hàng* ("Đơn đã được gửi"); `Idempotency-Key` chống double-create. |
| BR-grab-express-017 | Hủy sang Grab (`DELETE /deliveries/{id}`) chỉ khi GE ∈ {`ALLOCATING`, `PENDING_PICKUP`, `PICKING_UP`}. Quá trạng thái này thì Hủy phía CukCuk xử lý riêng (không gọi Grab). |
| BR-grab-express-018 | Hủy kết nối an toàn (không cảnh báo giao vận) khi mọi đơn đã ở trạng thái kết thúc: {`COMPLETED`, `RETURNED`, `CANCELED`, `FAILED`}. |
| BR-grab-express-019 🆕 | GE `IN_RETURN` (đã lấy hàng, giao lỗi, đang trên đường mang về — CHƯA về tới) → giữ CukCuk status *Đang giao hàng* + nhãn phụ "Đang hoàn hàng"; KHÔNG có nút thao tác nào (kể cả Hủy); chỉ tới khi chuyển hẳn sang `RETURNED` (đã về tới quán) mới nhắc thu ngân Gửi lại/Hủy (BR-014). *(Quyết định 2026-07-20 — trước đây bảng mapping thiếu hẳn trạng thái này.)* |
| BR-grab-express-020 🆕 | `codType` gửi trong `POST /deliveries`: luôn `ADVANCED` cho mọi đơn COD (khớp giả định Mô hình A). **Grab không định nghĩa rõ REGULAR/ADVANCED khác nhau thế nào** — đây là giả định rủi ro, cần verify với Grab trước go-live (OQ-07). |
| BR-grab-express-021 🆕 | `merchantOrderID` gửi cho Grab = `orderNo` của CukCuk, **cố định không đổi** qua các lần gửi lại cùng 1 đơn — dùng làm khóa idempotency. Khi Gửi đơn timeout/không rõ kết quả, trước khi cho phép Gửi lại phải kiểm tra lại trạng thái (GET theo `deliveryID` đã lưu nếu có); nếu phát hiện tạo trùng vận đơn, dùng `DELETE /merchant/deliveries/{merchantOrderID}` để dọn dẹp toàn bộ rồi tạo lại sạch. |
| BR-grab-express-022 🆕 | GE `FAILED` kèm `failedReason` (mã 2/5/6) → hiển thị lý do cụ thể cho thu ngân thay vì chỉ ghi chung "Thất bại"; mã 2 (nghi đơn ảo/sai thông tin) → nhắc kiểm tra lại thông tin người nhận trước khi Gửi lại. Xem bảng đầy đủ `../api/grab-express-status-mapping.md` §4. |

## 5. Mã lỗi (Error Codes)

| ID | Tình huống | Wording / hành vi |
|---|---|---|
| E-grab-express-001 | Quote thất bại (Grab không báo giá / dịch vụ gián đoạn) | "Không lấy được phí giao hàng, thử lại." → **chặn Lưu đơn** với đối tác Grab Express cho tới khi có báo giá. |
| E-grab-express-002 | Gửi đơn lỗi `4xx` (sai payload / ngoài vùng phát hiện lúc gửi) | Hiện message Grab; giữ đơn ở *Chờ gửi đối tác*; sửa rồi gửi lại. |
| E-grab-express-003 | Gửi đơn lỗi `5xx` / timeout / mất mạng | "Không thể gửi đơn, thử lại sau."; giữ *Chờ gửi đối tác*; Idempotency-Key + truy vấn lại trạng thái trước khi mở nút gửi lại. |
| E-grab-express-004 | Bấm *Thu tiền* khi GE chưa `COMPLETED` | "Đơn chưa giao xong, chưa thể thu tiền." → chặn cứng. |
| E-grab-express-005 | Địa chỉ ngoài vùng Grab Express phục vụ | Cảnh báo Grab Express chưa hỗ trợ khu vực này (phát hiện qua Quote API). |
| E-grab-express-006 | COD vượt hạn mức | "COD vượt hạn mức Grab Express — chọn đối tác giao hàng khác." |
| E-grab-express-007 | Email xuất hóa đơn VAT sai định dạng | "Email chưa đúng định dạng…" |
| E-grab-express-008 | Trường bắt buộc để trống | "Trường này không được để trống." |
| E-grab-express-009 | Grab từ chối do không đủ số dư ví/hạn mức công nợ | Cảnh báo khi Gửi đơn. **[TODO — phụ thuộc mô hình ví, xem OQ]** |

## 6. Câu hỏi mở / cần xác nhận (TODO)

> Cập nhật 2026-07-20 sau khi đọc trực tiếp trang docs API chính thức của Grab (`../api/grab-express-api-catalog.md`) — đóng OQ-02, OQ-04, OQ-05; OQ-03 giải quyết một phần; OQ-01/OQ-06 vẫn mở (Grab không có API/docs nào mô tả 2 điểm này).

| ID | Câu hỏi | Trạng thái | Hỏi ai |
|---|---|---|---|
| OQ-01 | Cơ chế hoàn tiền ứng COD thực tế khi RETURNED/FAILED: tay-trao-tay tại cửa hàng hay qua ví/đối soát (~7 ngày làm việc)? (Ảnh hưởng BR-015) | 🔴 **Vẫn mở** — khái niệm "tài xế ứng tiền" không xuất hiện trong docs API Grab, cần hỏi trực tiếp | Grab · KT |
| OQ-02 | Grab có API trả **hạn mức COD theo merchant** không? Nếu không, chốt fallback 2.000.000đ. (BR-005) | ✅ **Đã đóng** — không có API này trong toàn bộ docs. `MAX_COD` là hằng số cấu hình cố định, không có lookup động (sửa BR-grab-express-005). | — |
| OQ-03 | **Enum trạng thái thật** của Grab Express — lấy payload sandbox để verify (`QUEUEING` có tồn tại không? Tài liệu cũ dùng `CANCELLED` sai chính tả). | 🟡 **Giải quyết một phần** — `QUEUEING` CÓ tồn tại (dành cho SAME_DAY/BULK, không áp dụng INSTANT); chính tả CANCELED/CANCELLED bản thân docs Grab cũng không nhất quán → cần verify payload sandbox thật trước go-live (xem `../api/grab-express-status-mapping.md` §3) | Grab · Dev |
| OQ-04 | Webhook có **event ID riêng** cho idempotency không? (BR-010) | ✅ **Đã đóng** — không có, payload webhook không có field ID sự kiện nào. Sửa BR-grab-express-010: key = `deliveryID+status+timestamp` (luôn luôn, không có nhánh "nếu có event ID"). | — |
| OQ-05 | Xác thực webhook có **HMAC/chữ ký** không, chống giả mạo thế nào? | 🟡 **Giải quyết một phần** — xác nhận KHÔNG có HMAC/chữ ký body; chỉ có header `Authorization` + `Authorization-Id`. Cách so khớp 2 header cụ thể vẫn cần hỏi đội kỹ thuật Grab trước go-live. | Grab · Dev |
| OQ-06 | **Mô hình ví** MISA-Grab: aggregator (ví MISA, cửa hàng không có tài khoản Grab) hay per-merchant? MISA thu lại phí ship từ cửa hàng thế nào? (Nhóm I trong `../CAU-HOI-CAN-LAM-RO.md`) | 🔴 **Vẫn mở** — không tìm thấy API/docs đối soát-thanh toán nào trong trang tài liệu đối tác vận hành (khác mảng tài chính) | PO · Grab · KT |
| OQ-07 🆕 | `codType=REGULAR` vs `ADVANCED` khác nhau thế nào về mặt chức năng? Team đã quyết định gửi `ADVANCED` (khớp giả định Mô hình A) nhưng docs Grab không định nghĩa — rủi ro cần verify trước go-live. | 🔴 **Mới phát sinh** | Grab · Dev |

> Các câu hỏi nền tảng khác (A1–I8) tiếp tục theo dõi ở `../CAU-HOI-CAN-LAM-RO.md`. Chi tiết đầy đủ nguồn dẫn chứng cho các đóng/mở ở trên: `../api/grab-express-api-catalog.md` §6.

## 7. Assumptions (không hỏi khách)

| ID | Giả định | Lý do |
|---|---|---|
| SA-01 | COD theo Mô hình A (ứng lúc pickup) | Nguồn research Grab VN + chốt phiên BA; đánh dấu cần Grab xác nhận (OQ-01) |
| SA-02 | Web quản lý + POS luôn online | Không đề cập offline |
| SA-03 | Xác thực cấp-partner (1 credential MISA), cửa hàng là sender | Form chỉ nhập SĐT/địa chỉ (mẫu aggregator); còn treo ở OQ-06 |

## 8. Đính chính so với tài liệu cũ

| # | Sửa | Nguồn chuẩn |
|---|---|---|
| 1 | ~~Bỏ trạng thái `QUEUEING` khỏi luật hủy — không có trong mô hình 10 trạng thái~~ **Sửa lại 2026-07-20:** `QUEUEING` **có tồn tại** trong mô hình 11 trạng thái chính thức của Grab (khởi tạo cho đơn đặt lịch `SAME_DAY`/`BULK`) — chỉ là **không áp dụng** vì CukCuk chỉ dùng `INSTANT` (BR-grab-express-002). Nếu sau này CukCuk hỗ trợ đặt lịch giao, phải bổ sung xử lý `QUEUEING`. | docs API Grab chính thức (fetch 2026-07-20) |
| 2 | ~~Chính tả chuẩn = `CANCELED` (không `CANCELLED`)~~ **Sửa lại 2026-07-20:** bản thân docs Grab **không nhất quán** giữa `CANCELED`/`CANCELLED` (bảng trạng thái ghi 1 chữ L, cột webhook ghi 2 chữ L) — không có "chính tả chuẩn" duy nhất để chốt. Khuyến nghị: chuẩn hóa cả 2 dạng về 1 giá trị nội bộ ở tầng adapter, verify bằng payload sandbox thật trước go-live. Xem `../api/grab-express-status-mapping.md` §3. | docs API Grab chính thức (fetch 2026-07-20) — đã đính chính lại lần nữa vì đính chính trước đó cũng chưa chính xác |
| 3 | `IN_RETURN` đến từ `PICKING_UP` / `PENDING_DROP_OFF`, KHÔNG từ `IN_DELIVERY` | `grab-express-states.md` |
| 4 | Hủy kết nối an toàn xét đủ 4 trạng thái kết thúc | `grab-express-states.md` |
| 5 | Vùng phủ validate động (Quote API), không hard-code 5 tỉnh | domain research |
| 6 🆕 | `IN_RETURN` **thiếu hoàn toàn** khỏi bảng mapping GE→CukCuk ở §3 (chỉ được nhắc tới ở mục #3 trên về nguồn gốc chuyển trạng thái, chưa từng định nghĩa nó map sang đâu) — đã bổ sung: giữ "Đang giao hàng" + nhãn phụ "Đang hoàn hàng", không nút Hủy | Phân tích 2026-07-20 |
| 7 🆕 | BR-grab-express-005 (hạn mức COD): bỏ nhánh "đọc từ Grab nếu có API" — xác nhận Grab không có API này, `MAX_COD` là hằng số cấu hình cố định | docs API Grab chính thức (fetch 2026-07-20) |
| 8 🆕 | BR-grab-express-010 (idempotency key): bỏ nhánh "event ID nếu có" — webhook Grab không có field ID sự kiện, key luôn là `deliveryID+status+timestamp` | docs API Grab chính thức (fetch 2026-07-20) |
| 9 🆕 | BR-grab-express-010 (xác thực webhook): xác nhận không có HMAC/chữ ký body, chỉ có header `Authorization`+`Authorization-Id` — cách so khớp cụ thể vẫn cần hỏi Grab | docs API Grab chính thức (fetch 2026-07-20) |
