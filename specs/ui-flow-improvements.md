# Luồng UI hiện tại (POS) → Cải tiến theo nghiệp vụ đúng

> Đối chiếu **luồng xử lý đơn trong UI draft** (`Docs/UI/pos-order-shopeefood` — DeliveryView) với **luồng nghiệp vụ đã chốt** (`business-cases-catalog.md` ③) + quyết định completion model.
> **Quyết định đã chốt (BA OK):** completion = **kết hợp** — nhân viên bấm "Đã bàn giao tài xế"; đơn **tự Hoàn thành khi ShopeeFood báo đã giao (DELIVERED)** + polling bù.
>
> **⚠️ ĐÍNH CHÍNH (v2):** "Thu tiền" là **nghiệp vụ thật**, KHÔNG bỏ. `order.get_details` có 2 khối tách biệt: `customer_pay` (khách trả **Shopee**) và **`pay_to_merchant`** (quán được trả) — `pay_to_merchant.type` = **COD(1) → quán thu từ tài xế** / **MERCHANT_WALLET(6) → Shopee đối soát vào ví quán**; `pay_to_merchant.status` = UNPAID/PAID/FAIL/REFUNDED. ⇒ POS **giữ bước "Thu tiền"** nhưng lấy hình thức & trạng thái từ `pay_to_merchant`, KHÔNG mặc định cứng.

## 1. Luồng UI hiện tại (as-is)
```
Đơn về → tab "Chưa xác nhận" (Grab / ShopeeFood tách riêng ✓)
  → Chi tiết đơn (danh sách món)
  → [Xác nhận] / [Từ chối + lý do]      (có gợi ý lý do nhanh ✓)
  → auto in tem "BẾP CHẾ BIẾN" (mã đơn, tên món, ghi chú) ✓ → tab "Đã xác nhận"
  → [Giao hàng]
  → [Hủy đơn + lý do]  (không chặn theo trạng thái)
  → Màn THU TIỀN:  "Còn phải thu: {tổng bill}"  + [IN TẠM TÍNH][LƯU TẠM HĐ][THU TIỀN F9]
  → [Hoàn thành]
```
→ Bản chất đang **bê nguyên luồng đơn tại quán** (có bước thu tiền mặt) áp cho đơn ShopeeFood.

## 2. Bảng lệch & cải tiến

| # | UI hiện tại | Lệch nghiệp vụ | Cải tiến đề xuất | Case |
|---|---|---|---|---|
| 🔴 1 | Màn **THU TIỀN / TÍNH TIỀN đầy đủ** ("Còn phải thu = tổng bill" + bàn phím số + $ THU TIỀN/F9) | Đơn ShopeeFood **không có nghiệp vụ tính tiền/thu ngân tại quầy**: giá cố định, Shopee đối soát chuyển sau, quán chỉ **ghi nhận** | **Bỏ màn tính tiền.** Thay bằng **khối thông tin tài chính chỉ-đọc**: "Khách trả Shopee: X" · "Quán thực nhận (sau HH/thuế/KM): Y" · **trạng thái đối soát** = `pay_to_merchant.status`. (Nếu Q8 xác nhận COD=tài xế đưa tiền → thêm 1 xác nhận nhẹ "đã nhận tiền từ tài xế", KHÔNG phải màn tính tiền) | L3-25,26,36 |
| 🟠 2 | Hình thức thanh toán **mặc định cứng "SFP"** + nhân viên tự bấm Hoàn thành | Hình thức/trạng thái trả nên **đọc từ dữ liệu**; và "giao xong" nên theo Shopee | Hình thức = **`pay_to_merchant.type`** (COD → **thu từ tài xế** / MERCHANT_WALLET → **Shopee đối soát**); trạng thái đã trả = **`pay_to_merchant.status`**. Tách **2 trục độc lập**: **① Thu tiền** (theo pay_to_merchant) và **② Hoàn thành giao** (theo `DELIVERED`, có polling bù) | L3-10,14,24 |
| 🟠 3 | Nút **"Giao hàng"** | Ngụ ý **quán tự đi giao**; thực tế **tài xế** tới lấy | Đổi nhãn → **"Báo món đã xong / Bàn giao tài xế"** (gọi `order.ready`; trạng thái theo `PICKED`) | L3-10,12 |
| 🟠 4 | **Hủy đơn** bấm được mọi lúc | Sau khi **tài xế lấy hàng (PICKED)** không hủy được | **Disable nút Hủy sau PICKED**; lý do map `reason_id` 79 hết món / 80 quá tải / 81 đóng cửa | L3-13,18,28 |
| 🟠 5 | Tem bếp có mã đơn (dạng đầy đủ) | Khâu **bàn giao tài xế** cần đối chiếu nhanh, mã dài khó đọc | Tem bàn giao in **mã rút gọn (4–6 ký tự cuối) cỡ lớn, nổi bật** + danh sách món/SL (không cần địa chỉ khách — nằm ở app tài xế) | L2-09, L3-12 |
| 🟠 6 | Không thấy cơ chế báo đơn nổi bật | **Dễ miss đơn** (sếp nhấn mạnh Tab 2) | **Chuông + nhấp nháy tab + thông báo liên tục** đến khi nhân viên xử lý, dù đứng xa PC | L3-03 |
| 🟡 7 | **IN TẠM TÍNH / LƯU TẠM HĐ** | Đơn SPF có cần hóa đơn tạm tính không? (nghiệp vụ tạm tính là của đơn tại quán) | Cân nhắc **ẩn/bỏ** với đơn SPF; nếu giữ, chỉ để in **chứng từ nội bộ** gắn đơn — không phải bước thu tiền (T-B3, cần nghiên cứu nghiệp vụ cũ) | Tab2 T-B3 |
| 🟡 8 | **Thiếu** các case | Chưa có: hết món giữa chừng, báo trễ, đơn bị Shopee sửa, đơn tự đến lấy | Bổ sung: nút **"Báo hết món"** (reason 79 + out_of_stock, hủy cả đơn, confirm khách) · **"Báo trễ"** (busy_info, không hủy) · **banner "Đơn đã cập nhật"** khi Shopee sửa (in tem "ĐÃ CẬP NHẬT") · **luồng/tem riêng cho đơn tự đến lấy** | L3-18,29,31,15 |

## 3. Luồng POS sau cải tiến (to-be)
```
Đơn về → chuông + nhấp nháy → tab "Chưa xác nhận" (badge kênh)
  → Chi tiết đơn (focus danh sách món)
  → [Xác nhận] (thủ công / auto sau 2') / [Từ chối + lý do 79/80/81]
  → gửi bếp (luồng CukCuk sẵn có) + in tem bếp
  → [Báo món đã xong / Bàn giao tài xế]  → in tem bàn giao (mã rút gọn nổi bật + món)
       (sau PICKED: khóa Hủy)
  → (KHÔNG có màn tính tiền) Khối tài chính chỉ-đọc: "Khách trả Shopee: X" · "Quán thực nhận: Y"
       · trạng thái đối soát = pay_to_merchant.status (chờ đối soát → đã nhận)
  → (tự động) Shopee báo đã giao (DELIVERED) → HOÀN THÀNH + ghi nhận doanh thu/HĐĐT  [polling bù nếu miss]
  ── nhánh phụ: Báo hết món (79) · Báo trễ (busy_info) · Đơn bị Shopee sửa (banner) · Đơn tự đến lấy
```

## 4. Việc tiếp
Các cải tiến 🔴/🟠 nên phản ánh vào redesign màn POS trước khi vẽ BPMN luồng "Xử lý đơn" (để BPMN bám UI đúng). Điểm 🟡-7 (tạm tính) cần nghiên cứu nghiệp vụ cũ CukCuk như sếp lưu ý (Tab 2).
