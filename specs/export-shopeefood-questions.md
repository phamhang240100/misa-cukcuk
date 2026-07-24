# Câu hỏi làm rõ — Tích hợp CukCuk ↔ ShopeeFood

> Ngày: 2026-07-23 · 7 mục cần đối tác phản hồi (đa số câu trước đã được đối tác trả lời ở các phiếu 12/06, 22/06, 29/06 — CukCuk đã tiếp thu). Mục 4–7 phát sinh khi rà kỹ vòng đời đơn.

**1. Thời điểm thông tin tài xế (câu hỏi 29/06 chưa có phản hồi) 🔴**
Khi đơn đồng bộ về CukCuk, tại thời điểm đó đã có thông tin tài xế chưa? Nếu chưa, thông tin tài xế (tên/SĐT/biển số) về vào **trạng thái nào** của đơn? CukCuk cần mốc này để hiển thị shipper cho nhà hàng.

**2. Vòng đời token**
Nhờ đối tác xác nhận: (a) refresh_token có đổi mới sau mỗi lần làm mới không; (b) khi token hết hạn/làm mới thất bại thì nhà hàng phải kết nối lại từ đầu đúng không; (c) có tín hiệu báo khi kết nối bị ngắt không, hay CukCuk chủ động kiểm tra?

**3. Môi trường UAT**
Nhờ đối tác cấp cho CukCuk thông tin môi trường thử nghiệm (client_id/secret UAT, domain UAT) và thời gian dự kiến, để CukCuk bắt đầu tích hợp thử.

**4. Thời hạn nhà hàng phải xác nhận đơn 🔴**
Trong `order.get_details` có `confirm_expired_time` / `confirm_remaining_time` / trạng thái `M_TIMEOUT`. Nhờ xác nhận: nhà hàng có **bao lâu để xác nhận** một đơn trước khi ShopeeFood **tự hủy**? Sau khi tự hủy, SPF bắn trạng thái gì về?

**5. Hoàn tiền / thanh toán lỗi**
`MerchantPaidStatus` có `REFUNDED` và `FAIL`. Nhờ cho biết các trạng thái này **phát sinh khi nào**, và order detail trả về gì (số tiền hoàn, phần quán bị ảnh hưởng) để CukCuk đối soát đúng.

**6. Đơn khách tự đến lấy (self-pickup)**
`ShippingMethod` có `CUSTOMER_PICKUP`. Với đơn khách tự đến lấy (không qua tài xế): ShopeeFood có bắn webhook/luồng trạng thái **giống đơn giao** không, hay khác? Nhà hàng đối chiếu với khách bằng thông tin gì?

**7. Thời điểm chốt "đã giao" (DELIVERED)**
Xác nhận: `DELIVERED` là mốc CukCuk dùng để **chốt đơn & ghi doanh thu**. Webhook `DELIVERED` có luôn được bắn không, và nếu CukCuk lỡ mất thì `order.get_list`/`get_details` vẫn phản ánh đúng trạng thái này đúng không?

**8. Quán nhận tiền thế nào & khi nào 🔴**
`order.get_details` có `pay_to_merchant.type` = **COD** hoặc **MERCHANT_WALLET** và `.status`. Nhờ làm rõ:
- (a) **MERCHANT_WALLET**: ShopeeFood **đối soát và chuyển tiền về tài khoản quán theo chu kỳ nào** (mỗi ngày/tuần/tháng)? `status` chuyển `PAID` tại thời điểm nào?
- (b) **`pay_to_merchant.type = COD`** nghĩa là gì với đơn ShopeeFood: **tài xế đưa tiền mặt cho quán lúc lấy hàng**, hay vẫn ShopeeFood đối soát chuyển sau? Nếu tài xế đưa, đưa **số tiền nào** (tiền món / đã trừ hoa hồng)?

---
## Cách phản hồi
Đối tác trả lời trực tiếp dưới từng mục. Xin cảm ơn.
