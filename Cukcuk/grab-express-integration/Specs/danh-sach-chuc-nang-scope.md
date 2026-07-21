---
type: scope-function-list
feature: grab-express
status: draft
updated: 2026-07-21
---

# Danh sách chức năng — Tích hợp Grab Express vào MISA CukCuk (C86574)

Tổng hợp scope chức năng để trình quản lý. Mỗi dòng gắn mã FR/BR truy vết về `grab-express-brd.md`.
Phân hệ: **Web** = Web quản lý · **POS** = App bán hàng (thu ngân) · **BE** = Nền/Backend · **BC** = Báo cáo (dùng chung).

## A. Web quản lý

| # | Phân hệ | Tên chức năng | Nội dung nâng cấp | Mã |
|---|---|---|---|---|
| 1 | Web | Danh sách ứng dụng | Thêm card **Grab Express** (badge *New*) vào lưới Ứng dụng; **đổi tên "Grab" → "Grab Food"**; card mở màn Kết nối/Cập nhật theo trạng thái. | FR-web-001..004 |
| 2 | Web | Kết nối Grab Express | Form khai báo **hồ sơ người gửi** (lấy sẵn từ Thiết lập chung, sửa được); checkbox **"Xuất hóa đơn phí vận chuyển (VAT)"** + Email VAT; validate trường bắt buộc / email / **vùng phủ động qua Quote API** (không hard-code tỉnh). | FR-web-010..014 · BR-web-01..04 |
| 3 | Web | Cập nhật / Hủy kết nối | Sửa lại hồ sơ người gửi & cấu hình VAT; **Hủy kết nối** có cảnh báo nếu còn đơn đang trong quá trình giao vận. | FR-web-020..021 · BR-web-05 |

## B. POS — App bán hàng (thu ngân)

| # | Phân hệ | Tên chức năng | Nội dung nâng cấp | Mã |
|---|---|---|---|---|
| 4 | POS | Lập đơn giao Grab Express | Thêm **Grab Express** vào dropdown Hình thức giao; nhóm trường GE: **Loại DV khóa "Siêu tốc - Thực phẩm" (INSTANT)**, **Phí trả đối tác** (khóa, từ báo giá Grab), **Phí thu khách** (sửa được), **COD tự tính** = (tiền món + phí thu khách) − đặt cọc. | FR-pos-001..004 · BR-pos-01..04 |
| 5 | POS | Lưu đơn — validate | Lưu → **Chờ giao hàng** (sub-status *chưa gửi đối tác*); validate COD ≤ 2.000.000đ (hằng số cố định), vùng phủ (Quote), có kết nối Grab trước khi lưu. | FR-pos-010..012 |
| 6 | POS | Gửi đơn sang Grab | Nút **Giao hàng** (POST /deliveries) → màn xem trước Hóa đơn giao hàng → gọi tạo vận đơn; **chống double-send** (khóa nút + Idempotency-Key); re-validate COD/vùng phủ; xử lý đủ nhánh lỗi 4xx/5xx/timeout/401. | FR-pos-020..025 · BR-016 |
| 7 | POS | Đồng bộ trạng thái (Hybrid auto-sync) | Tài xế **đã lấy hàng (PENDING_DROP_OFF)** → **tự chuyển Đang giao hàng**, **bỏ nút "Giao hàng" thủ công**; đồng bộ đa thiết bị cùng chi nhánh; **dự phòng polling** (60s→30s→~5 phút). | FR-pos-030..034 · BR-007,011,012 |
| 8 | POS | Thu tiền (gate theo giao hàng) | Nút **Thu tiền** chỉ mở khi Grab = **COMPLETED**; **không bao giờ tự đóng** "Đã thanh toán" (kể cả COD = 0); luôn cần thu ngân xác nhận. | FR-pos-040..041 · BR-008 · BR-pos-05 |
| 9 | POS | Xử lý trạng thái kết thúc xấu | **CANCELED/FAILED** → tự mở lại về **Chờ giao hàng** (sub-status *chưa gửi*) + cờ đỏ; **RETURNED** → nhắc thu ngân chọn; cho **Giao hàng (gửi lại) / Đổi đối tác / Hủy** (dùng lại đơn cũ, không tạo HĐ trùng); Hủy sang Grab chỉ khi GE ∈ {ALLOCATING, PENDING_PICKUP, PICKING_UP}. **IN_RETURN**: nút Giao hàng disabled, không Hủy. | FR-pos-050..054 · BR-013,014,015,017,019 |
| 10 | POS | Danh sách order — tab Giao hàng | Tab **Giao hàng** (kèm số đếm); bộ lọc Trạng thái giao / Đối tác / Nguồn đơn; 2 dạng xem Card ⟷ List; chip Grab Express + pill trạng thái GE; nút thao tác theo trạng thái. | FR-pos-060..062 |
| 11 | POS | Xác nhận đơn online | Đơn Website/App vào tab **Xác nhận đơn online**; panel 2 tab; chọn **Grab Express** ở tab Đối tác; xác nhận → tạo đơn Chờ gửi đối tác. | FR-pos-070..072 |
| 12 | POS | Sổ giao hàng — theo dõi Grab Express | Thêm tab **Grab Express**; bộ lọc theo **Trạng thái GE** + Mã vận đơn/Số HĐ/khách; lưới cột đầy đủ; sinh **thông báo** khi Grab đổi trạng thái, click mở đúng đơn. | FR-pos-080..084 |

## C. Báo cáo (dùng chung)

| # | Phân hệ | Tên chức năng | Nội dung nâng cấp | Mã |
|---|---|---|---|---|
| 13 | BC | Bảng kê hóa đơn | Cột **Đối tác giao hàng** hiển thị "Grab Express" cho đơn tương ứng. | FR-rep-001 |
| 14 | BC | Doanh thu theo đối tác giao hàng | Có dòng **Grab Express** và chi tiết doanh thu. | FR-rep-002 |

## D. Nền / Backend

| # | Phân hệ | Tên chức năng | Nội dung nâng cấp | Mã |
|---|---|---|---|---|
| 15 | BE | Xác thực & kết nối Grab | OAuth 2.0 **client_credentials cấp-partner MISA**, cache Bearer ~7 ngày, tự refresh khi 401. | BR-001 |
| 16 | BE | Nhận webhook + đồng bộ | Nhận webhook trạng thái Grab (xác thực header), trả 200 ngay, xử lý qua **queue idempotent**, bỏ event out-of-order; **polling dự phòng** GET /deliveries/{id}. | BR-010,011 |

## E. Chức năng cần chốt trước khi vào scope (đang thảo luận — chưa có trong BRD)

| # | Phân hệ | Tên chức năng | Nội dung nâng cấp | Ghi chú |
|---|---|---|---|---|
| 17 | POS | In phiếu tạm / tem giao hàng | In tem ở bước **xác nhận đơn / đóng gói** (không đợi tài xế), sau khi đã chốt phí/COD; **cho in lại** khi order còn mở & khi đổi đối tác; **không in mã vận đơn** lên tem (Grab dùng phiếu gửi điện tử phía tài xế). | Gap — BRD chưa định nghĩa; xem thảo luận 2026-07-21 |
| 18 | POS | Quy tắc số tiền khi đổi đối tác | Chốt: số tiền **khách phải trả** có giữ nguyên khi đổi đối tác nội bộ hay nhảy theo phí đối tác mới → quyết định việc có bắt buộc in lại tem không. | Chính sách — **do khách hàng/PO quyết** |

## Ghi chú cho quản lý

- **Trọng tâm nâng cấp**: chuyển từ 2 luồng trạng thái độc lập sang **Hybrid auto-sync** — tự đồng bộ bước *giao hàng* từ Grab, **gate thủ công** bước *tiền* (mục 7, 8). Đây là thay đổi UX lớn nhất so với bản cũ.
- **Câu hỏi mở còn treo** (ảnh hưởng scope): cơ chế hoàn tiền ứng COD khi hoàn/thất bại, mô hình ví trả phí ship — chi tiết ở `grab-express-brd.md` Mục 8 (OQ-01, OQ-04...).
- Danh sách này bám theo scope BRD hiện tại; mục E là các điểm phát sinh khi rà soát nghiệp vụ in bill, cần chốt trước khi đưa vào kế hoạch dev.
