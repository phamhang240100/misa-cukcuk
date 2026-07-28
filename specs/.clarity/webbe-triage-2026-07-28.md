# Triage câu hỏi Web BE — 2026-07-28

> Đầu vào: 26 mục `WBE-Q-*` trong [webbe-prototype-map-2026-07-28.md](webbe-prototype-map-2026-07-28.md) + `XD-*`/`DR-Q*` trong [delta-2026-07-28.md](delta-2026-07-28.md).
> Nguồn kiểm chứng mới: **`[API]`** = `Docs/API shopee/[Jan 2026] Foody External API Integration Official.pdf` (v0.0.17, 70 trang) và `[Jan 2026][ISV Partner] Authorization API.pdf` (03/04/2025, 14 trang).
> Nguyên tắc: `[API]` là nguồn sơ cấp — thắng mọi suy đoán từ prototype và bản nháp nội bộ.

---

## Bucket A — ĐÃ CÓ LỜI GIẢI TỪ `[API]` (không cần hỏi ai)

| ID | Câu hỏi cũ | ✅ Lời giải từ `[API]` | Prototype đúng/sai |
|---|---|---|---|
| `XD-04` | Enum tài xế `DRIVER_IN_CHARGED`/`ASSIGNED`/`AUTO_ASSIGN` có thật không? | **CÓ.** `INCHARGED = DRIVER_IN_CHARGED = 10`; `ASSIGNED = ASSIGNING_DRIVER = 11`; `AUTO_ASSIGN = ASSIGNING_DRIVER = 11` (đều *notify to partner*). Máy trạng thái: `M_ASSIGNED → M_RECEIVED → CONFIRMED → PICKED → DELIVERED` | `[DOC-MAP]` **ĐÚNG** |
| `WBE-Q-B1` | Mã QR sống 900s hay 3600s? | **900s ĐÚNG.** `/oauth2/devicecode` trả `expires_in: 900`; doc ghi rõ *"the user has **15 minutes** to sign in"*. Còn `expires_in: 3600` là tuổi thọ của **access_token**, hai thứ khác nhau | Prototype **ĐÚNG** |
| `WBE-Q-B2` | Poll tự động hay bắt người dùng bấm tay? | **POLL TỰ ĐỘNG.** `/oauth2/devicecode` trả kèm `interval: 5` = chu kỳ poll `/oauth2/token` (5 giây/lần). Mã lỗi khi poll: `authorization_pending` (chưa xong), `slow_down` (giảm tần suất), `expired_token` (hết hạn), `invalid_grant` | Prototype **SAI** — nút *"Xác nhận đã quét mã QR"* không đúng chuẩn |
| `WBE-Q-B3` | QR hết hạn thì UI làm gì? | Có mã lỗi **`expired_token`** = *"Device code has expired"* → UI phải bắt được và cho **tạo mã mới** | Prototype **THIẾU** nhánh này |
| `WBE-Q-B4` | Gian hàng đã liên kết nơi khác? | *"We only allow mapping **1 SPF store with 1 ISV store** at the same time."* Kèm chú ý: POS cũ là **Ocha** thì **không chuyển thẳng được** — chủ quán phải liên hệ **BI incharge của Shopee** gỡ kết nối Ocha trước rồi làm lại từ đầu | Prototype **THIẾU** — chỉ ghi ràng buộc 1:1 dạng *lưu ý*, không có xử lý lỗi |
| `WBE-Q-C5`<br>=`DR-Q3` | "Bỏ những món thuộc nhóm khuyến mại **gì**?" | **Trả lời được.** 2 nhóm: **Trùm Deal (Prepaid SKU)** và **Ăn Ngon Rẻ (CheapMeal)**.<br>Quy tắc `[API] menu.sync`: • Sync **thất bại** nếu payload có sửa món thuộc *Prepaid SKU*, hoặc xóa/không map một món thường có liên quan *CheapMeal* • *Không được* sửa giá / sửa thông tin / xóa món **CheapMeal** (chỉ được đổi trạng thái) • *Không được* sửa món thuộc **Prepaid SKU**, phải chờ hết khuyến mại | Prototype **CHƯA CÓ** khái niệm này |
| `WBE-Q-D7` | Cập nhật ảnh / sắp xếp thứ tự có API không? | **CÓ.** `dish.upload_picture` (`image_base_64`, `is_apply_all`). Menu có `sequence` (thứ tự món & nhóm) và `sort_type` (`1` = theo doanh số, `2` = theo thứ tự thủ công) | Prototype **ĐÚNG** — 3 nút này hợp lệ |
| `WBE-Q-D8` | Đẩy ngày nghỉ lễ lên SPF bằng cách nào? | **Bằng `set_operation_time_ranges`.** Mỗi phần tử `days` nhận **`custom_date` (yyyy-mm-dd)** *hoặc* `day_of_week`, cộng cờ **`is_closed`** (bool) và mảng `time_ranges` (`open_time`/`close_time` hh:mm).<br>⇒ Nghỉ Tết = đẩy N bản ghi `custom_date` + `is_closed = true`.<br>Lỗi: `error_invalid_start_time_end_time`, `error_overlap_time_range`, `error_invalid_time_range_id`, `error_duplicate_setting_time_range_day` | Prototype **ĐÚNG hướng**, thiếu ánh xạ sang API + thiếu 4 thông báo lỗi |
| `WBE-Q-D9` | 24/24 = `00:00–23:59`? | Đúng về mặt API: 1 `time_range` `00:00`–`23:59` với `is_closed = false` | Prototype **ĐÚNG** |
| `WBE-Q-D12` | Tạm ngưng có cần lý do & thời hạn? | **CÓ, cả hai bắt buộc.** `set_restaurant_busy` yêu cầu `start_date`, `end_date`, **`busy_reason_type`** (`1` hết món · `2` quá tải · `3` mất điện), trả về `busy_id`.<br>⚠️ *"We only allow the busy `end_date` **until 5am tomorrow** from the request time, **no matter what** `start_date` you send"*.<br>Đọc lại bằng `get_restaurant_busy_infos`; sửa/gia hạn bằng cách gửi lại kèm `busy_id` | Prototype **SAI/THIẾU** — không hỏi lý do, không hỏi thời hạn |
| `WBE-Q-D14` | Ngắt kết nối làm sao? | 🔥 **KHÔNG phải API.** Ngắt kết nối là **deep link sang Shopee Partner App**:<br>`https://partner.shopee.vn/app-link?enterCondition=tobToken&apprl=…ISV_AUTHORIZATION_DISCONNECT?client_id={app_id}&spf_restaurant_id={Res.ID}`<br>Shopee khuyến nghị **dựng thành QR** khi hiển thị trên desktop/POS. Sau đó CukCuk **poll `get_restaurant_info` mỗi 10 giây, trong tối đa 5 phút**: trả *success* = chủ quán **chưa** xong; trả *lỗi token hết hạn* = **đã ngắt xong** | Prototype **SAI HOÀN TOÀN** — đang làm 1 nút bấm phát ra toast |
| `WBE-Q-D1` | Phí sàn 20% cứng? | **SAI.** `order.get_details` trả **`commission_amount`** *theo từng đơn*, cùng `total_merchant_discount`, `extra_fee`, `tax_fee`, `customer_bill{…}`. Ngoài ra `merchant_price` có công thức riêng theo loại món (thường / Prepaid SKU / CheapMeal) | Prototype **SAI** — phải bỏ số cứng 20% |

### A-bis — Bổ sung sau khi đọc kỹ `[API] §3.2 Dish` + `§3.3 Topping` (28/07, vòng 2)

> ⚠️ Vòng 1 tôi đã kết luận sai rằng *"không có API sửa lẻ, mọi thay đổi phải qua `menu.sync` full-sync"*. Chủ đầu tư chỉ ra là sai. Đọc lại §3.2/§3.3 thì **có đầy đủ API lẻ**. Ghi lại cho đúng:

| ID | Câu hỏi cũ | ✅ Lời giải từ `[API]` |
|---|---|---|
| `WBE-Q-D6` | Sửa giá tại Web BE đẩy lên SPF kiểu gì? | **Có API sửa lẻ, không cần full-sync.** `dish.update` (`partner_dish_id` + `price`/`name`/`partner_dish_group_id`/`display_order`/`description`/`picture_id`) · `dish.bulk_update` (mảng nhiều món) · `topping.update_prices` · `topping.update`/`bulk_update` · `dish.set_statuses` · `topping.set_statuses` · `dish.upload_picture` / `delete_picture` · `dish.create_topping_mapping` / `delete_topping_mapping` · `topping.set_group_quantity` |
| — | Vậy `menu.sync` dùng khi nào? | **Hai con đường tách bạch:** `menu.sync` = **đẩy toàn bộ thực đơn** (dùng lúc thiết lập ban đầu / đẩy lại toàn bộ) — đây mới là cái *huỷ diệt* (`CONSTRAINT-F2`). Thao tác **hằng ngày** đi bằng API lẻ ở trên, **không** huỷ diệt gì |
| `WBE-Q-C3` | Ghép 1:1 hay 1-nhiều (combo)? | **1:1 — do mô hình dữ liệu API, không phải lựa chọn nghiệp vụ.** `dish.update_partner_id_mappings` nhận mảng `{dish_id, partner_dish_id}` — mỗi món SPF đúng **một** `partner_dish_id`. Combo trên SPF ⇒ phải là **một** món trên CukCuk |
| `WBE-Q-D5` | *Sở thích* vs *Sở thích phục vụ* khác gì? | **API chỉ có 2 tầng:** `DISH_ATTRIBUTE = 3` (Topping Group = **Nhóm STPV**) và `DISH_ATTRIBUTE_VALUE = 4` (Topping = **STPV**). ⇒ 2 phân đoạn *Sở thích* và *Sở thích phục vụ* của prototype là **trùng nhau**, phải gộp còn 2 phân đoạn |

**🔥 Phát hiện mới — LUỒNG DUYỆT MÓN, prototype thiếu hoàn toàn:**

| Bằng chứng `[API]` | Ý nghĩa |
|---|---|
| `dish.create` / `dish.update` / `dish.delete` / `dish.delete_picture` / `topping.create` / `topping.update` / `topping.delete` **đều trả `required bool is_pending`** | Thay đổi thực đơn **không có hiệu lực ngay** — có trường hợp phải **chờ ShopeeFood duyệt** |
| `dish.get_approval_status` → `{status, dish_id}` | Có endpoint **hỏi lại kết quả duyệt** |
| `topping.get_groups` có lỗi **`error_object_not_approved`** | Đối tượng chưa duyệt thì không dùng được |
| `MenuObjectUpdateType`: `ADD=1` `CHANGE_STATUS=2` `UPDATE=3` `DELETE=4` **`REJECT_REQUEST=5`** | ShopeeFood có thể **TỪ CHỐI** yêu cầu thay đổi |
| Menu Webhook `§4.2 partner_api_url_callback` | SPF **bắn ngược** kết quả duyệt về cho CukCuk |
| Lỗi chung `error_object_invalid_to_update` | Đối tượng đang ở trạng thái không cho sửa |

⇒ Web BE **bắt buộc** phải có: trạng thái *Chờ ShopeeFood duyệt* / *Bị từ chối* trên từng món, nơi theo dõi, và xử lý webhook duyệt. **Prototype không có một chữ nào về việc này.**

**Chi tiết kỹ thuật khác prototype chưa thể hiện:**
- `DishStatus` / `ToppingStatus` = `AVAILABLE = 1` · `OUT_OF_STOCK = 2` · `INACTIVE = 3`. Đặt `OUT_OF_STOCK` thì **bắt buộc** có `from_time` + `to_time` (hết món **có thời hạn**, không phải tắt vĩnh viễn).
- `topping.update_prices` nhận cặp **`partner_topping_id` + `partner_dish_id`** ⇒ **cùng một STPV có giá khác nhau tuỳ món**. Prototype đang cho 1 giá duy nhất.
- `topping.set_group_quantity` đặt `min_quantity` / `max_quantity` **theo từng món** (`partner_dish_id`), không phải theo nhóm dùng chung. Prototype đang đặt ở cấp nhóm.
- `dish.create_topping_mapping` có cờ **`is_required`** và **`price`** riêng cho từng cặp món–STPV.
- Hầu hết API có `is_apply_all` + `branch_ids` ⇒ hỗ trợ **chuỗi nhiều chi nhánh**. Prototype chỉ 1 quán.

**Số dư:** 16 mục đóng lại bằng nguồn sơ cấp, không tốn một câu hỏi nào cho khách hàng.

---

## Bucket B — ĐỦ CĂN CỨ ĐỂ BA TỰ CHỐT (chỉ cần xác nhận)

| ID | Đề xuất chốt | Căn cứ |
|---|---|---|
| `WBE-Q-D1` | Bỏ dòng *"Đã trừ 20% phí Shopee & Khuyến mãi"*. Thực nhận tính **theo từng đơn** từ `commission_amount` API trả về; nhãn đổi thành *"Đã trừ phí sàn & khuyến mãi"* (không có số) | `[API]` + `modules/04 §4` |
| `WBE-Q-D2` | Bỏ khỏi phạm vi: `4.8/5.0`, `328 đánh giá`, *Đánh giá gần nhất*, *Thời gian chuẩn bị – Đạt chuẩn*. `[API]` v0.0.17 **không có** endpoint đánh giá/analytics nào. Các thẻ còn lại (doanh thu, số đơn, AOV, top món, khung giờ) **tự tính từ đơn CukCuk đã nhận** | `[API]` không có nguồn |
| `WBE-Q-C6` | Đưa popup *"Món cần thuộc một nhóm thực đơn cụ thể trước khi ghép. Bạn có muốn cập nhật món ngay không?"* — nút **Để sau / Chỉnh sửa** vào spec | `[DOC-RULE]` chỉ định rõ |
| `WBE-Q-D11` | Giữ lựa chọn *Tất cả đơn* / *Chỉ đơn đã thanh toán* của `AC-02`, prototype bổ sung thêm | `AC-02` đã chốt trước đó |
| `WBE-Q-B2/B3/B4` | Vẽ lại luồng QR: poll 5s · 4 trạng thái lỗi · nhánh hết hạn có nút *Tạo mã mới* · nhánh gian hàng đã liên kết POS khác | Bucket A |
| `WBE-Q-D12` | Modal *Tạm ngưng nhận đơn* phải hỏi **lý do** (3 lựa chọn) + **đến khi nào**, và chặn/cảnh báo khi vượt mốc 5h sáng hôm sau | Bucket A |
| `WBE-Q-D14` | Thay nút ngắt kết nối bằng luồng QR + màn chờ *"Đang chờ bạn xác nhận trên Shopee Partner…"* + đếm ngược 5 phút + poll 10s | Bucket A |

---

## Bucket C — ĐÃ HỎI & ĐÃ CHỐT (phiên 28/07)

| ID | Câu hỏi | ✅ Chốt |
|---|---|---|
| `WBE-Q-C1` | Bắt buộc ghép nối **100%** món mới cho qua bước? | **BẮT BUỘC 100%.** Giữ nguyên chặn *"Còn {n} món chưa được ghép nối. Vui lòng ghép nối toàn bộ thực đơn để tiếp tục."* Không có nút bỏ qua. ⇒ Kéo theo: nửa Web BE của `DR-Q1` **tự đóng** — đơn không bao giờ chứa món chưa ghép, vì không cho bán khi chưa ghép xong |
| `WBE-Q-D2` | Phạm vi tab *Tổng quan* | **BỎ HẲN TAB TỔNG QUAN** khỏi phạm vi. ⇒ `WBE-Q-D1` (20% cứng), `WBE-Q-D3`, `WBE-Q-D4` **tự đóng theo** vì không còn màn nào dùng |
| `WBE-Q-C3` | Ghép 1:1 hay 1-nhiều? | **1:1** — xem A-bis, do mô hình `partner_dish_id` của API |
| `WBE-Q-D6` | Sửa giá đẩy lên SPF kiểu gì? | **Gọi API lẻ `dish.update`** — xem A-bis |
| `WBE-Q-D5` | *Sở thích* vs *Sở thích phục vụ* | **Gộp còn 2 tầng** Nhóm STPV + STPV — xem A-bis |

## Bucket C-2 — CÒN PHẢI HỎI

| ID | Câu hỏi | Vì sao chặn |
|---|---|---|
| `WBE-Q-D10` | Giới hạn **3 khung giờ/ngày** là của SPF hay CukCuk tự đặt? | `[API] set_operation_time_ranges` **không nêu** giới hạn số lượng ⇒ nghi là CukCuk tự đặt |
| `WBE-Q-A1` | *Mã cấu hình Endpoint (Webhook)* trên màn Ứng dụng là gì, ai nhập? | CukCuk là ISV, webhook do CukCuk cung cấp cho SPF — chủ quán không cấu hình |
| `WBE-Q-E1` **mới** | Món đang **Chờ ShopeeFood duyệt** (`is_pending = true`) thì Web BE hiển thị & cho thao tác thế nào? Bị **từ chối** (`REJECT_REQUEST`) thì báo gì, có cho sửa gửi lại không? | Luồng lớn prototype thiếu hoàn toàn — xem A-bis |
| `WBE-Q-E2` **mới** | Có làm **chuỗi nhiều chi nhánh** (`is_apply_all` / `branch_ids`) ở phiên bản này không? | API hỗ trợ sẵn; prototype chỉ 1 quán. Ảnh hưởng toàn bộ màn thực đơn |
| `WBE-Q-E3` **mới** | *Hết món* (`OUT_OF_STOCK`) **bắt buộc** có `from_time`+`to_time`. Web BE hỏi người dùng khoảng thời gian, hay tự đặt mặc định (vd. đến cuối ngày)? | `[API] dish.set_statuses` bắt buộc; prototype chỉ có bật/tắt |

---

## Bucket D — CHUYỂN CHO SHOPEEFOOD (không chặn XMind)

| ID | Câu hỏi gửi SPF |
|---|---|
| `WBE-Q-A2` | Danh sách scope OAuth chính thức mà CukCuk được cấp (`order.read`, `order.write`, …) |
| `WBE-Q-D13`=`DR-Q4` | Hành vi *Tạm ngưng nhận đơn* trên Shopee Merchant App để CukCuk làm tương tự |
| `WBE-Q-D3` | Chu kỳ đồng bộ khuyến nghị & rate limit thực tế |
| `WBE-Q-C2` | SPF có gợi ý ngưỡng tương đồng khi tự ghép món không |

---

## Phần bị tách ra, KHÔNG thuộc phiên Web BE

`DR-Q1` (đơn về mà món chưa ghép) có **hai nửa**:
- ✅ **Nửa Web BE (trong phạm vi):** Web BE bảo đảm gì về độ đầy đủ của ghép nối *trước khi* đơn có thể về → phụ thuộc `WBE-Q-C1`.
- ⏸️ **Nửa POS (park):** POS xử lý ra sao khi đơn chứa món chưa ghép vẫn về tới → giữ trong nhóm park cùng `XD-05`, `XD-06`, `XD-08`, `XD-09`, `XD-10`, `XD-11`, `DR-Q2`.
