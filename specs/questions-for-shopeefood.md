# Câu hỏi còn tồn cho ShopeeFood (đã rà kỹ nguồn — chỉ giữ mục CHƯA có lời đáp)

> Sau khi đối chiếu đầy đủ `[API]` + `[Q&A]` (4 sheet) + `[MAP]`, **đa số câu hỏi trước đã có lời đáp** và được chuyển thành business rule trong `modules/*` và `direction-analysis §5`. Danh sách dưới là các điểm **thực sự còn mở**.

## Còn mở

**🔴 Q1 (shipper) — Thời điểm thông tin tài xế về CukCuk**
Đã hỏi ở phiếu 29/06/2026 (mục 9) nhưng **SPF chưa phản hồi**. Cần biết: tại thời điểm đơn đồng bộ về (M_ASSIGNED) đã có tài xế chưa; nếu chưa, thông tin tài xế (tên/SĐT/biển số) về ở **trạng thái nào / qua tín hiệu nào** (liên quan `driver.update_arriving_times`, `ASSIGNING_DRIVER=11`).

**🟡 Q2 (token) — Chi tiết vòng đời token**
Tài liệu Authorization API nêu `expires_in` mẫu = 3600s. Cần xác nhận: (a) refresh_token có **đổi mới (rotate)** mỗi lần refresh không; (b) khi refresh thất bại/hết hạn thì nhà hàng **bắt buộc kết nối lại từ đầu** đúng không; (c) có **webhook báo disconnect** chủ động không (hiện chỉ biết cách poll `get_restaurant_info`).

**🟡 Q3 (UAT) — Cấp môi trường UAT**
Mỗi partner cấu hình/build riêng `[Q&A A.6, B.4]` → cần SPF **cấp cho CukCuk**: client_id/client_secret UAT, domain UAT (`gqaexternalapi.test.now.vn`, `partner.uat.shopee.vn`), và timeline.

## Việc cần làm (không phải câu hỏi SPF — CukCuk tự lấy/tự quyết)
- Lấy **JSON template menu** của SPF: `https://dpaste.com/BZT43338J` để dựng đúng endpoint `getMenu`.
- Xác nhận danh sách **scope** OAuth CukCuk cần đăng ký (order.read/write, menu…) theo `/oauth2/devicecode`.

---
## Đã có lời đáp — KHÔNG hỏi lại (đối chiếu nhanh)
| Chủ đề | Kết luận | Nguồn |
|---|---|---|
| Phí giao/dịch vụ/KM-SPF trong order detail | `customer_bill` là buyer-side, **không trả cho merchant** | 22062026-Q1, 1206-F.7 |
| Công thức tiền quán thực nhận | tiền món − KM quán tài trợ − commission − thuế | 22062026-Q5 |
| Đơn hủy | order detail không đổi field, chỉ đổi status | 1206-F.5 |
| Sửa đơn / hủy một phần | API chưa support edit, **chỉ allow cancel** (toàn bộ) | 29062026-Q6 |
| Hủy từ POS | chỉ khi **chưa PICKED** | 29062026-Q7 |
| Schema menu / thứ tự / out-of-stock | có đủ trong API §3.5 (id/sequence/sort_type/Available Status) | API §3.5 |
| Giờ hoạt động / tạm ngưng bán | `set_operation_time_ranges`, `set_restaurant_busy` | API §3.4 |
| Sync xóa/tạo/update món; Prepaid & CheapMeal | logic rõ + cảnh báo fail khi đụng Prepaid/CheapMeal | API §3.5, 1206-C.6 |
| KM đồng bộ được | chỉ **giá gạch (price_slash)**; còn lại liên hệ SPF setup | 1206-B.3, 29062026-Q8 |
| Field đối soát trả về | Commission, Tax, KM gạch giá, Prepaid, CheapMeal | 1206-D.6 |
| Bù đơn khi miss | không re-noti → dùng `order.get_list` chủ động | 1206-F.9 + API §3.1 |
