---
type: change-record
feature: grab-express
status: applied
created: 2026-07-22
sources:
  - "Doc 4 — Bảng mapping trạng thái GE-CukCuk (Google Doc 1ZiQCL-2xjs9CghGti2CC5CJXC5AN0M8uNcZgZevjTm0)"
  - "Doc 3 — API Catalog (Google Doc 192aOv3GUsvDBhokZwXCI7HRtLmccC8MeRf5muRMC3SQ)"
  - "Sequence diagram Mermaid (Google Doc 1KuzBwya1ChpPasGjNw3Ke972vfb7MMm4Gbh56vWp_tU)"
  - "BPMN tổng quan (Camunda share 60e02a03) — chưa trích được text (canvas)"
  - "Hướng dẫn trực tiếp của BA (filter Sổ giao hàng, IN_RETURN, COD 2M)"
---

# Grab Express — Bản ghi thay đổi "luồng mới" (2026-07-22)

Đối chiếu tài liệu mới (4 nguồn + chỉ đạo BA) với Specs hiện tại. Ghi lại vấn đề phát hiện, quyết định đã chốt, và các sửa đổi đã áp vào Specs + XMind.

## 1. Quyết định đã chốt (BA xác nhận 2026-07-22)

| # | Điểm | Chốt |
|---|------|------|
| C1 | Trạng thái sau CANCELED/FAILED | Chỉ **3 trạng thái CukCuk**: Chờ giao hàng / Đang giao hàng / Đã thanh toán. "Chưa gửi đối tác" là **sub-status GE** trong nhóm *Chờ giao hàng* (không phải trạng thái CukCuk riêng). |
| C2 | Nhãn nút gửi đơn | **1 nút "Giao hàng"** cho cả gửi lần đầu và gửi lại (sau CANCELED/FAILED/RETURNED). |
| C3+D4 | Nút khi IN_RETURN | Nút **Giao hàng DISABLED**, **không có Hủy**. |
| D3 | Hủy đơn | **Hủy thủ công** (thu ngân bấm) = **xóa khỏi Sổ**. Grab tự trả **CANCELED** = **giữ đơn**, hiển thị "Đã hủy" để Gửi lại. |

## 2. Mô hình trạng thái luồng mới

Filter "Tất cả trạng thái" (trạng thái CukCuk) — 3 nhóm, mỗi nhóm gom các trạng thái GE:

| Nhóm CukCuk | Trạng thái GE hiển thị |
|---|---|
| **Chờ giao hàng** | chưa gửi đối tác (trống), ALLOCATING (đang tìm tài xế), PENDING_PICKUP (đã tìm được tài xế), PICKING_UP (tài xế đang tới lấy), IN_RETURN (đang hoàn hàng), RETURNED (đã trả hàng), CANCELED (đã hủy), FAILED (không tìm được tài xế) |
| **Đang giao hàng** | PENDING_DROP_OFF (đã lấy hàng), IN_DELIVERY (đang giao), COMPLETED chưa thu (Chờ thu tiền) |
| **Đã thanh toán** | COMPLETED đã thu (giao thành công & đã thanh toán) |

Bảng mapping GE → CukCuk + nút (nguồn chuẩn = Doc 4, đã hòa giải với chỉ đạo BA):

| GE | CukCuk | Nhãn/Ý nghĩa | Nút |
|---|---|---|---|
| chưa gửi (trống) | Chờ giao hàng | Chưa gửi đối tác | Giao hàng / Hủy |
| ALLOCATING | Chờ giao hàng | Đang tìm tài xế | Hủy |
| PENDING_PICKUP | Chờ giao hàng | Đã tìm được tài xế | Hủy |
| PICKING_UP | Chờ giao hàng | Tài xế đang tới lấy | Hủy |
| **PENDING_DROP_OFF** | **Đang giao hàng (AUTO)** | Đã lấy hàng | — |
| IN_DELIVERY | Đang giao hàng | Đang giao | — |
| **IN_RETURN** | **Chờ giao hàng** | Đang hoàn hàng | **Giao hàng (disabled), không Hủy** |
| COMPLETED (chưa thu) | Đang giao hàng | Chờ thu tiền | Thu tiền |
| COMPLETED (đã thu) | Đã thanh toán | Đã thanh toán | — |
| CANCELED | Chờ giao hàng | Đã hủy | Giao hàng (gửi lại) / Hủy |
| FAILED | Chờ giao hàng | Không tìm được tài xế (+ lý do mã 2/5/6) | Giao hàng (gửi lại) / Hủy |
| RETURNED | Chờ giao hàng | Đã trả hàng | Giao hàng (gửi lại) / Hủy |

Nguyên tắc: **auto-sync chỉ tiến, không lùi, không ghi đè thao tác tay**; Thu tiền thủ công, chặn cứng chỉ mở khi COMPLETED, **không bao giờ tự đóng** Đã thanh toán.

## 3. Vấn đề phát hiện & xử lý

### A. Tài liệu mới mâu thuẫn Specs cũ → đã sửa Specs
- **A1. Mốc auto-sync:** cũ = `PICKING_UP` → Đang giao hàng (SAI). Mới = **`PENDING_DROP_OFF`**. Sửa: `danh-sach-chuc-nang-scope.md`, `grab-express-brd.md` (§mapping + FR-pos-031), `api/grab-express-status-mapping.md`, `sequence/grab-express-flow-spec.md` (BR-007, §3, vòng đời).
- **A2. IN_RETURN:** cũ = Đang giao hàng, không nút. Mới = **Chờ giao hàng, Giao hàng disabled, không Hủy**. Sửa các file trên + BR-019.

### B. Lỗi mâu thuẫn nội bộ Specs cũ (lộ ra khi đối chiếu) → đã sửa
- **B1. Hạn mức COD:** `grab-express-brd.md` (BR-pos-04) + `sequence/grab-express-flows.md` còn ghi "đọc từ Grab" — SAI. Đúng = **2.000.000đ hằng số cố định** (Grab không có API trả hạn mức COD theo merchant — xác nhận trong `api/grab-express-api-catalog.md` + BR-005). BA xác nhận lại 2026-07-22.
- **B2. FR-pos-031** mô tả sai "PICKING_UP = đã lấy hàng" — đúng: PICKING_UP = tài xế đang tới lấy; đã lấy = PENDING_DROP_OFF.

### C. Hai tài liệu mới mâu thuẫn nhau → đã chốt (mục 1)
- C1 (Chờ giao hàng vs Chờ gửi đối tác), C2 (Giao hàng vs Gửi lại), C3 (IN_RETURN nút "—" vs disable).

### D. Bổ sung
- **Filter 3 nhóm** "Tất cả trạng thái" (mới) — thêm vào Sổ giao hàng.
- **Polling chi tiết:** sau 60s không webhook → mỗi 30s → ~5 phút/10 lần dừng → nút "Làm mới thủ công" (nâng cấp BR-011).
- IN_RETURN vốn bị sót khỏi liệt kê filter của BA → đã đưa vào nhóm Chờ giao hàng.

## 4. File đã cập nhật
- XMind: `Docs/Luồng/Tích hợp Grab Express với CukCuk (luồng mới).xmind` (giữ bản cũ để so sánh).
- Specs: xem các sửa đổi A/B ở mục 3.
