# Câu hỏi còn tồn cho ShopeeFood (đã rà kỹ nguồn — chỉ giữ mục CHƯA có lời đáp)

> Sau khi đối chiếu đầy đủ `[API]` + `[Q&A]` (4 sheet) + `[MAP]`, **đa số câu hỏi trước đã có lời đáp** và được chuyển thành business rule trong `modules/*` và `direction-analysis §5`. Danh sách dưới là các điểm **thực sự còn mở**.

## Còn mở

**🔴 Q1 (shipper) — Thời điểm thông tin tài xế về CukCuk**
Đã hỏi ở phiếu 29/06/2026 (mục 9) nhưng **SPF chưa phản hồi**. Cần biết: tại thời điểm đơn đồng bộ về (M_ASSIGNED) đã có tài xế chưa; nếu chưa, thông tin tài xế (tên/SĐT/biển số) về ở **trạng thái nào / qua tín hiệu nào** (liên quan `driver.update_arriving_times`, `ASSIGNING_DRIVER=11`).

**🟡 Q2 (token) — Chi tiết vòng đời token**
Tài liệu Authorization API nêu `expires_in` mẫu = 3600s. Cần xác nhận: (a) refresh_token có **đổi mới (rotate)** mỗi lần refresh không; (b) khi refresh thất bại/hết hạn thì nhà hàng **bắt buộc kết nối lại từ đầu** đúng không; (c) có **webhook báo disconnect** chủ động không (hiện chỉ biết cách poll `get_restaurant_info`).

**🟡 Q3 (UAT) — Cấp môi trường UAT**
Mỗi partner cấu hình/build riêng `[Q&A A.6, B.4]` → cần SPF **cấp cho CukCuk**: client_id/client_secret UAT, domain UAT (`gqaexternalapi.test.now.vn`, `partner.uat.shopee.vn`), và timeline.

### Nhóm Q-PAY — thông tin thanh toán hiển thị trên POS (mới, 2026-07-27)
> Phát sinh khi rà field-level PDF API **v0.0.17** để dựng khối tài chính POS. Chi tiết: `modules/04-thanh-toan-doi-soat.md`.

**🔴 Q-PAY-A — Xác nhận công thức "tiền quán thực nhận" không trừ khuyến mại 2 lần**
CukCuk dự kiến tính: **`Σ(merchant_price × số lượng) − commission_amount − tax_fee`**. `merchant_price` được tài liệu mô tả là *original price − merchant funded discount* (đã trừ phần quán tài trợ ở **cấp món**) ⇒ hiểu là **không phải trừ `total_merchant_discount` thêm lần nữa**. Nhờ SPF **xác nhận đúng/sai** và cho **một ví dụ số cụ thể** của đơn có cả KM cấp món (prepaid, có `dish_ids`) lẫn KM cấp đơn. → Hiểu sai chỗ này là **trừ khuyến mại 2 lần**, sai doanh thu quán.

**🔴 Q-PAY-B — `order.get_details` production có trả `commission_amount` và `customer_bill` không?**
Schema đánh dấu cả hai là *Required*, nhưng **sample reply trong chính tài liệu không có** 2 block này; đồng thời `[Q&A 1206-F.7]` trả lời rằng phí giao hàng / KM ShopeeFood tài trợ / phí dịch vụ **"không trả về trong order detail"**. → Cần xác nhận đơn thật trả về những field tiền nào, kèm 1 sample reply mới nhất (che dữ liệu nhạy cảm).

**🟠 Q-PAY-C — Ý nghĩa `pay_to_merchant.type = COD(1)`**
Với đơn ShopeeFood tại VN, `COD` nghĩa là **tài xế đưa tiền mặt cho quán lúc lấy hàng**, hay vẫn **Shopee đối soát chuyển vào ví quán sau**? Nếu tài xế đưa thì đưa **số tiền nào** (tiền món hay đã trừ hoa hồng/thuế)? Trường hợp nào một đơn có `type = COD` thay vì `MERCHANT_WALLET(6)`?

**🟠 Q-PAY-D — Định nghĩa `total_value` và `extra_fee`**
Hai field này là *Required* trong `order.get_details` nhưng **không được mô tả** trong tài liệu. Trong sample, `order_value` = 291.000đ còn `total_value` = 145.500đ → nhờ SPF cho định nghĩa và công thức.

**🟠 Q-PAY-E — `tax_fee` chỉ có ở `order.get_list`**
Field thuế seller (`tax_fee`) xuất hiện trong reply của `order.get_list` nhưng **không có** trong `order.get_details`. Đây là **đúng thiết kế** hay thiếu sót tài liệu? Nếu đúng thiết kế, xác nhận `order.get_list` là nguồn chính thức để lấy thuế phục vụ đối soát.

**🟠 Q-PAY-F — Có webhook khi `pay_to_merchant.status` đổi không?**
Payload webhook `/update_order` hiện **không chứa field tiền nào**. Khi trạng thái trả tiền cho quán đổi `UN_PAID → PAID` (hoặc `FAIL`/`REFUNDED`), SPF **có bắn tín hiệu** không? Nếu không, SPF khuyến nghị **tần suất polling** bao nhiêu để không đụng rate limit 25 QPS?

**🟡 Q-PAY-G — Khi nào phát sinh `REFUNDED(4)` / `FAIL(3)`**
Hai trạng thái này phát sinh trong tình huống nào, và **số tiền hoàn** được trả về ở field nào — biết rằng `[Q&A 1206-F.5]` nói order detail **không đổi field tiền** khi đơn bị hủy, chỉ đổi status. (Trùng điểm mở L3-21 đã nêu trước đây.)

### Nhóm mới phát sinh 2026-07-28

**🟠 Q-DISC-01 — Ngắt kết nối rồi thì gian hàng/thực đơn trên ShopeeFood còn không?**
Tài liệu ủy quyền chỉ mô tả cơ chế thu hồi quyền truy cập, **không nói** điều gì xảy ra với thực đơn đã đồng bộ. Cần xác nhận: sau khi ngắt, (a) gian hàng vẫn hoạt động và khách vẫn đặt được, thực đơn giữ nguyên — chỉ là đơn không chảy về CukCuk nữa; hay (b) có tác động gì khác tới thực đơn/gian hàng? Đồng thời: **đơn đang chạy dở** tại thời điểm ngắt được xử lý thế nào?

**🟠 Q-REASON-01 — Bổ sung mã lý do hủy "khách gọi điện báo hủy đơn"**
Bộ mã hủy hiện chỉ có *hết món · quá tải · đóng cửa*. Nhưng tình huống **khách gọi trực tiếp cho quán xin hủy** là có thật và hay gặp. Hiện thu ngân buộc phải chọn một lý do sai bản chất (vd *quán quá tải*) → số liệu hủy đơn của quán bị méo, ảnh hưởng đánh giá gian hàng. Đề nghị ShopeeFood cân nhắc bổ sung mã cho tình huống này.

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
| Field đối soát trả về | Commission, Tax, KM gạch giá, Prepaid, CheapMeal.<br>⚠️ **Đính chính 2026-07-27:** lời đáp này **không nói field nằm ở endpoint nào**. Đối chiếu PDF v0.0.17: **`tax_fee` chỉ có trong `order.get_list`, KHÔNG có trong `order.get_details`**; `commission_amount` có trong schema `get_details` nhưng chưa thấy trong dữ liệu mẫu → xem **Q-PAY-B / Q-PAY-E** và `modules/04-thanh-toan-doi-soat.md` | 1206-D.6 + `[API v0.0.17]` |
| Bù đơn khi miss | không re-noti → dùng `order.get_list` chủ động | 1206-F.9 + API §3.1 |
