# Danh mục Case nghiệp vụ đầy đủ — CukCuk ↔ ShopeeFood

> Mục đích: "clear" toàn bộ case nghiệp vụ **trước khi vẽ BPMN chi tiết** (yêu cầu của sếp, Tab 2 mục D).
> Phương pháp: case được **suy ra từ enum + Q&A** (không dựa trí nhớ) để đảm bảo đầy đủ. Mỗi dòng = 1 nhánh BPMN.
> Cột **Trạng thái**: `✅ confirmed` (có nguồn chắc) · `🟡 assumed` (suy luận hợp lý, nên xác nhận) · `🔴 open` (chờ chốt).
> 3 section chính bám đúng 3 luồng sếp yêu cầu: **① Liên kết · ② Thiết lập & Thay đổi (rule/cấu hình) · ③ Xử lý đơn**.
>
> Quyết định đã chốt (input, không mở lại): Menu-IA=**kết hợp** · Bước-3-thiết-lập=**hoãn** · auto-confirm=**thủ công + 2'** · ~~mapping=auto-fuzzy~~ · luồng-bếp=**CukCuk sẵn có**.
>
> ⚠️ **CẬP NHẬT 2026-07-28** — 4 quyết định nền đã bị lật, phải đọc trước khi dùng file này:
> | Trước | Nay |
> |---|---|
> | mapping = **auto-fuzzy ~80%** | **chỉ tự ghép khi tên TRÙNG KHỚP**, bắt buộc ghép 100% (`WBE-D21`, `WBE-D2`) |
> | đơn ShopeeFood **không có nút Thu tiền** | **CÓ nút Thu tiền** = báo đơn xong + đóng đơn (`XD-01`) |
> | POS **5 tab riêng** (`DEC-CHANNEL-01`) | **4 tab**: Chưa xác nhận · Đã xác nhận · Đã hoàn thành · Đã huỷ (`POS-D2`) |
> | bộ trạng thái *Đang xử lý / Đã xử lý* | **Chờ chuẩn bị đơn · Chờ giao hàng · Đang giao hàng · Chờ thanh toán · Đã thanh toán** (`XD-03`) |
>
> Chi tiết: `modules/03-nhan-don-pos.md §0` · `.clarity/delta-2026-07-28.md` · `.clarity/webbe-prototype-map-2026-07-28.md` · `.clarity/pos-prototype-map-2026-07-28.md`

---

## ① LUỒNG LIÊN KẾT (Kết nối + Mapping + Đồng bộ menu)

### 1a. Kết nối / Ngắt kết nối
| Case | Trigger / điều kiện | Nhánh / quyết định | Kết cục | Rule + nguồn | TT |
|---|---|---|---|---|---|
| L1-01 | Bấm kết nối, quán **chưa có gian hàng** Shopee | — | Chặn, hướng dẫn đăng ký SPF | `[Q&A A.7]` | ✅ |
| L1-02 | Đang nối POS cũ **Ocha** | — | Chặn, liên hệ BI gỡ Ocha trước | `[API-Auth §3]` | ✅ |
| L1-03 | Người thao tác **không phải owner** | — | Không link được | `[Q&A A.8]` | ✅ |
| L1-04 | Sinh QR (devicecode) → quét → xác nhận trên Partner App | thành công | Trả token → lưu 1:1 → "Kết nối thành công" | `[API-Auth]` | ✅ |
| L1-05 | Poll token, user chưa xác nhận | `authorization_pending` | Poll tiếp theo `interval` | `[API-Auth]` | ✅ |
| L1-06 | Poll quá nhanh | `slow_down` | Giãn interval | `[API-Auth]` | ✅ |
| L1-07 | QR/device_code hết hạn | `expired_token` | Báo hết hạn + nút "Tạo mã mới" | `[API-Auth]` | ✅ |
| L1-08 | User bấm từ chối | `access_denied` | Báo thất bại, cho thử lại | `[API-Auth]` | ✅ |
| L1-09 | Owner đăng nhập **nhầm quán** | tên quán hiển thị sai | Tự nhận diện → đăng xuất → quét lại | `[API Authen Flow]` | ✅ |
| L1-10 | Mất mạng khi poll | — | Giữ device_code, poll tới hết hạn → L1-07 | thiết kế | 🟡 |
| L1-11 | 1 `client_id` dùng cho nhiều chi nhánh | — | Mapping **1:1** mỗi store | `[Q&A A.1]` | ✅ |
| L1-12 | Token gần hết hạn | — | Refresh định kỳ (grant_type=refresh_token) | `[API-Auth]` | ✅ |
| L1-13 | Refresh **thất bại** / token bị thu hồi | — | Chuyển "Mất kết nối" → yêu cầu re-link | thiết kế (Q2) | 🔴 |
| L1-14 | Bấm ngắt kết nối | — | Deeplink Partner App → poll `get_restaurant_info` 10s/5' → lỗi token = đã ngắt | `[API-Auth §3]` | ✅ |
| L1-15 | Có webhook báo disconnect? | — | Chưa rõ (hiện chỉ poll) | Q2 | 🔴 |

### 1b. Mapping món (sau kết nối) — concept pop-up Tab 2
| Case | Trigger / điều kiện | Nhánh / quyết định | Kết cục | Rule + nguồn | TT |
|---|---|---|---|---|---|
| L1-16 | Sau kết nối, pop-up **"Đã có thực đơn trên Shopee chưa?"** | **Có** | Dùng `get_dish` **kéo DS món Shopee về 1 lần để đối chiếu/mapping** — KHÔNG tạo món CukCuk, KHÔNG sync ngược về sau | `[Q&A 1206 get dish]` + F1 | ✅ |
| L1-17 | " | **Không** | Hiện màn thực đơn trống, chờ chọn món từ CukCuk | Tab 2 T-A2 | ✅ |
| L1-18 | Ghép cặp tên món | auto-fuzzy ~80% | Gợi ý cặp, user duyệt | DEC-MAP-01 | ✅ |
| L1-19 | Món có ở **cả 2 bên** | — | Mapping thủ công/gợi ý (C-A) | `[XMIND]` | ✅ |
| L1-20 | Món **chỉ ở CukCuk** | — | Đồng bộ → tạo mới trên Shopee (C-B) | `[Q&A C.4]` | ✅ |
| L1-21 | Món **chỉ ở Shopee** | — | **KHÔNG tự tạo** ở CukCuk; user tạo ở thực đơn chính rồi map (C-C) | `[Q&A C.3]` F1 | ✅ |
| L1-22 | Chưa map nhóm món / nhóm STPV | — | Bắt buộc map cả nhóm — nếu không, sync sẽ **xóa & tạo lại → mất lượt bán** | `[Q&A 2906-5]` | ✅ |

### 1c. Đồng bộ menu (CukCuk → SPF) & kết quả
| Case | Trigger / điều kiện | Nhánh / quyết định | Kết cục | Rule + nguồn | TT |
|---|---|---|---|---|---|
| L1-23 | Bấm Đồng bộ | **toàn bộ** (`menu.sync`) | mapped→update · chỉ-CukCuk→tạo · **chỉ-Shopee→XÓA** (cảnh báo mất lượt bán) | `[API §3.5]` `[Q&A C.6]` F2 | ✅ |
| L1-24 | Bấm Đồng bộ | **1/nhiều món** | Chỉ tác động món được chọn (an toàn, không xóa) | `[Q&A C.2]` | ✅ |
| L1-25 | Sync đụng món **Prepaid SKU (Trùm Deal)** | — | Task **FAIL** — không sửa được, đợi hết CTKM | `[API §3.5 Warning]` F11 | ✅ |
| L1-26 | Sync **xóa/bỏ-map** món thường liên quan **CheapMeal** | — | Task **FAIL** | `[API §3.5]` F11 | ✅ |
| L1-27 | Nhận kết quả sync | webhook callback / `get_task` | `TaskStatus`: success/failed/retry/processing/pending + `failed_items_detail` → hiển thị N ok/M lỗi | `[API §3.5]` | ✅ |

---

## ② LUỒNG THIẾT LẬP & THAY ĐỔI

### 2a. Cấu hình / Rule bật-tắt (mục sếp gọi tên: "rule tắt/bật... cấu hình")
| Case | Cấu hình | Giá trị / nhánh | Hành vi | Nguồn | TT |
|---|---|---|---|---|---|
| L2-01 | **Auto-confirm đơn** | OFF (mặc định) | Nhân viên tự bấm xác nhận | DEC-CONFIRM-01 | ✅ |
| L2-02 | " | ON — **tất cả đơn** | Mọi đơn tự xác nhận khi về | `[XMIND]` | ✅ |
| L2-03 | " | ON — **chỉ đơn đã thanh toán** | Chỉ đơn PAID tự xác nhận | `[XMIND]` | ✅ |
| L2-04 | **Auto-confirm timeout** | ~2' không thao tác | Tự xác nhận + **đếm ngược/cảnh báo** trước khi tự chạy | research U2 + Tab 2 | ✅ |
| L2-05 | **Auto-in tạm tính** | "khi xác nhận" / "khi gửi bếp" | In hóa đơn tạm tính nội bộ theo mốc chọn | `[XMIND]` | ✅ |
| L2-06 | **Giờ hoạt động** | tối đa 3 khung/ngày | `set_operation_time_ranges` (day_of_week/custom_date, is_closed, time_ranges); cài nhanh cả tuần | `[API §3.4]` | ✅ |
| L2-07 | **Ngày lễ** | on/off | Đặt trước ngày nghỉ → ngừng nhận đơn | `[XMIND]` | ✅ |
| L2-08 | **Tạm ngưng bán tức thì** | reason 1 hết món/2 quá tải/3 blackout | `set_restaurant_busy` (tối đa đến 5h sáng hôm sau) | `[API §3.4]` DEC-PAUSE-01 | ✅ |
| L2-09 | **In phiếu bàn giao** | bật/tắt | Nội dung: mã đơn rút gọn (4–6 ký tự cuối, cỡ lớn) + DS món/SL | research-ops | 🟡 |
| L2-10 | **Bước 3 "Thiết lập bán hàng"** | **HOÃN** | Tách khỏi luồng kết nối; chỉnh sau ở màn riêng | BA chốt (Tab 2 T-A8) | ✅ |

### 2b. Thay đổi thực đơn / món / giá
| Case | Trigger / điều kiện | Nhánh / quyết định | Kết cục | Nguồn | TT |
|---|---|---|---|---|---|
| L2-11 | Thêm/sửa món ở **CukCuk** → đồng bộ | từng món / toàn bộ | Cập nhật lên Shopee (theo L1-23/24) | `[Q&A C.2]` | ✅ |
| L2-12 | Đổi **giá** ở CukCuk → đẩy sang | — | Shopee cập nhật; **giá Shopee KHÔNG về CukCuk** | `[Q&A 1206-B.4]` F1 | ✅ |
| L2-13 | Sửa món **trực tiếp trên Shopee Partner** | — | **KHÔNG về CukCuk**; lần sync sau có thể ghi đè | `[Q&A C.1]` F1 | ✅ |
| L2-14 | Xóa món ở **CukCuk** → đồng bộ | xóa 1 món / full sync | Shopee xóa món tương ứng | `[Q&A C.8]` | ✅ |
| L2-15 | Xóa món ở **Shopee** | — | CukCuk không đổi; sync sau **tạo lại** trên Shopee | `[Q&A C.9]` | ✅ |
| L2-16 | **Hết món** | item / cả quán | item = Available Status **UNAVAILABLE**; cả quán = `set_restaurant_busy` reason 1 | `[API §3.5/§3.4]` `[Q&A C.10]` | ✅ |
| L2-17 | Đổi tên/mô tả/**thứ tự** nhóm/món | — | Đồng bộ qua `sequence`/`sort_type` | `[API §3.5]` | ✅ |
| L2-18 | Nhóm STPV | bắt buộc / không, min/max | Map selectionRangeMin/Max | `[API §3.5]` `[MAP]` | ✅ |
| L2-19 | Món **combo** | — | **Không hỗ trợ** — không đồng bộ | `[Q&A 2906-4]` F8 | ✅ |
| L2-20 | **Khuyến mại** | giá gạch / loại khác | Chỉ **price_slash** qua API; loại khác liên hệ SPF setup tay | `[Q&A 2906-8]` F6 | ✅ |

---

## ③ LUỒNG XỬ LÝ ĐƠN (theo Order Status Machine)

> Vòng đời: `M_ASSIGNED(5)` → `M_RECEIVED(6)` → `CONFIRMED(3)` → `PICKED(1)` → `DELIVERED(2)`; hủy: `M_OUT_OF_SERVICE(7)` → `CANCELLED(8)`.

| Case | Trigger / điều kiện | Nhánh / quyết định | Kết cục | Rule + nguồn | TT |
|---|---|---|---|---|---|
| L3-01 | Khách đặt + thanh toán | online (`PAID`) / COD (`UNPAID`) | SPF webhook `M_ASSIGNED` | `[API]` | ✅ |
| L3-02 | Nhận webhook | — | Ack 200 → `get_details` → tab **Chưa xác nhận** + **thông báo** | `[API §4.1]` | ✅ |
| L3-03 | Thông báo đơn mới | — | **Chuông + nhấp nháy tab + báo liên tục** đến khi xử lý (không miss dù ở xa PC) | Tab 2 T-B1 | ✅ |
| L3-04 | Webhook **trùng** (SPF retry) | idempotency | Bỏ qua, không tạo trùng | research U3 | ✅ |
| L3-05 | `update_type` | UPDATE_ORDER / UPDATE_ORDER_STATUS | Đều gọi `get_details` lấy bản mới | `[API]` | ✅ |
| L3-06 | Nhân viên **xác nhận** | thủ công (`CONFIRM=0`) | → gửi bếp (**luồng CukCuk sẵn có**) + in tem | `[API]` Q3 | ✅ |
| L3-07 | Auto-confirm | theo L2-02/03/04 | Tự xác nhận | DEC-CONFIRM-01 | ✅ |
| ⭐L3-08 | **Deadline xác nhận phía SPF** | `allow_confirm`, `confirm_expired_time`, `confirm_remaining_time`, `M_TIMEOUT` | SPF có đồng hồ riêng — quá hạn SPF có thể **tự hủy**. CukCuk phải tự xác nhận **trước** deadline SPF (khác clock 2') | `[API order.get_details]` | 🔴 |
| L3-09 | Nhân viên **từ chối** | `OUT_OF_SERVICE=2` + `reject_reasons.type` (WRONG_MENU/RESTAURANT_BUSY/RESTAURANT_CLOSES/WRONG_COMMISSION/CUSTOM) | → Hủy | `[API §2/order.update]` | ✅ |
| L3-10 | **Báo đã xong món** | `order.ready` (/s2s/order/ready) | Đánh dấu sẵn sàng; lỗi nếu đơn đã picked/delivered/canceled | `[API order.ready]` | ✅ |
| L3-11 | SPF điều phối tài xế | `ASSIGNING_DRIVER=11` | Thông tin shipper về CukCuk — **thời điểm chưa rõ** | B1 | 🔴 |
| L3-12 | **Bàn giao tài xế** | đối chiếu **mã rút gọn (4–6 ký tự cuối) + DS món** | `PICKED` | research-ops | ✅ |
| L3-13 | Sau `PICKED` | — | **Không được hủy** (nút hủy disable) | `[Q&A 2906-7]` F7 | ✅ |
| L3-14 | Giao xong | `DELIVERED` | Đơn hoàn thành → ghi nhận doanh thu | `[API]` | ✅ |
| ⭐L3-15 | **Đơn KHÁCH TỰ ĐẾN LẤY** | `ShippingMethod=CUSTOMER_PICKUP(3)` | Không có tài xế; đối chiếu mã với **khách**; tem/luồng riêng | `[API ShippingMethod]` research-ops | 🟡 |
| L3-16 | **Khách tự hủy** (từ app) | status → `CANCELLED` noti | `get_details` (field không đổi, chỉ status) → tab Hủy | `[Q&A F.5]` | ✅ |
| L3-17 | **SPF tự hủy** (không tìm được tài xế / quán đóng) | `M_OUT_OF_SERVICE`→`CANCELLED` | Nếu đã in bếp → **tự in phiếu hủy** cho bếp | research U5 | ✅ |
| ⭐L3-18 | **Hết món giữa chừng** (sau xác nhận) | `order.update` cancel_reason **79** + `out_of_stock`(dish, from/to) | Chỉ **HỦY CẢ ĐƠN** (API không bớt 1 món); **confirm khách trước** | `[API order.update]` `[Q&A 2906-6]` | ✅ |
| L3-19 | **Sửa đơn** | API không cho edit | POS chỉ sửa **tên hiển thị** cục bộ; SL/topping không đổi | `[Q&A 2906-6]` F4 | ✅ |
| L3-20 | **Sai giá** | `order.update` `price_updates` (dish/topping price) | Cập nhật giá món/topping | `[API order.update]` | 🟡 |
| ⭐L3-21 | **Hoàn tiền / thanh toán lỗi** | `MerchantPaidStatus` = `REFUNDED(4)` / `FAIL(3)` | Ghi nhận trạng thái, điều chỉnh đối soát | `[API MerchantPaidStatus]` | 🔴 |
| L3-22 | **Miss webhook** | không nhận noti (không có replay) | Polling `order.get_list` định kỳ 2–5' bù đơn + cảnh báo | `[Q&A F.9]` F3 | ✅ |
| L3-23 | Đơn đã thanh toán trước | — | Hiển thị trạng thái **đã thanh toán** | `[Q&A 2206-6]` | ✅ |
| ✅L3-24 | **Chốt "đơn XONG" & ghi doanh thu** — **ĐÃ CHỐT (kết hợp)** | Nhân viên bấm **"đã bàn giao tài xế"** (thao tác) | Đơn **tự Hoàn thành + ghi doanh thu khi Shopee báo `DELIVERED`** + polling bù (F3). Trục **giao** tách khỏi trục **thu tiền** (L3-36) | BA OK · research-ops + F3 | ✅ |
| L3-36 | **Quán nhận tiền** (nghiệp vụ thật) | `pay_to_merchant.type` = COD / **MERCHANT_WALLET** (mô hình chính: **Shopee đối soát & chuyển tiền về TK quán SAU, net sau HH+thuế**); `.status` = UNPAID→PAID/FAIL/REFUNDED | POS bước "Thu tiền" **đọc** hình thức+trạng thái từ `pay_to_merchant` (không mặc định cứng). `customer_pay` = khách trả Shopee (khác). ⚠️ Ý nghĩa `type=COD` (tài xế đưa tiền hay đối soát sau) + chu kỳ chuyển tiền → **hỏi SPF (Q8)** | `[API]` + `[Q&A B.1/B.2]` | 🔴 |

### 3b. Đối soát (khi đơn hoàn thành)
| Case | Nội dung | Nguồn | TT |
|---|---|---|---|
| L3-25 | **Tiền quán thực nhận** = tiền món − KM quán tài trợ − commission − thuế.<br>Ánh xạ field: **`Σ(merchant_price × SL) − commission_amount − tax_fee`** (KM quán tài trợ **đã nằm trong** `merchant_price` → ⛔ không trừ `total_merchant_discount` thêm lần nữa) → chờ xác nhận **Q-PAY-A**. Chi tiết: `modules/04-thanh-toan-doi-soat.md` §4 | `[Q&A 22062026-Q5]` + `[API v0.0.17]` | 🟠 |
| L3-26 | Field đối soát: `order_value`, `merchant_price`, `merchant_discount`, `commission_amount`, seller tax; **không** dùng `customer_bill` (buyer-side).<br>⚠️ **Đính chính 2026-07-27:** **`tax_fee` KHÔNG có trong `order.get_details`** — chỉ có ở **`order.get_list`** ⇒ poller đối soát phải gọi `get_list`. `commission_amount` chưa thấy trong dữ liệu mẫu → **Q-PAY-B**. Chi tiết: `modules/04-thanh-toan-doi-soat.md` §2.3 | `[Q&A 22062026-Q1]` + `[API v0.0.17]` | 🟠 |
| L3-27 | Đơn hủy: field tiền **không đổi**, chỉ đổi status | `[Q&A F.5]` | ✅ |

---

## Bảng enum tham chiếu (để BPMN map trạng thái)
- **OrderMerchantStatus:** M_ASSIGNED=5 · M_RECEIVED=6 · CONFIRMED=3 · PICKED=1 · DELIVERED=2 · M_OUT_OF_SERVICE=7 · CANCELLED=8 · ASSIGNING_DRIVER=11
- **OrderUpdateStatus (partner gửi):** CONFIRM=0 · OUT_OF_SERVICE=2 · CANCEL=6
- **cancel reason_ids:** 79 hết món (kèm out_of_stock) · 80 quá tải · 81 đóng cửa
- **RejectOrderReason:** WRONG_MENU=1 · RESTAURANT_BUSY=2 · RESTAURANT_CLOSES=3 · WRONG_COMMISSION=4 · CUSTOM=5
- **ShippingMethod:** FOODY_DELIVERY=1 · MERCHANT_DELIVERY=2 · **CUSTOMER_PICKUP=3**
- **PaymentMethod:** COD=1 · MERCHANT_WALLET=6 · **MerchantPaidStatus:** UNPAID=1 · PAID=2 · FAIL=3 · REFUNDED=4
- **TaskStatus (menu sync):** failed · success · retry · processing · pending
- **DishStatus:** AVAILABLE=1 · OUT_OF_STOCK=2 · INACTIVE=3

## Điểm CÒN MỞ (chặn BPMN chi tiết — cần chốt/hỏi SPF)
| ID | Vấn đề | Ảnh hưởng |
|---|---|---|
| ✅ L3-24 | ~~Model chốt "đơn xong"~~ → ĐÃ CHỐT: bàn giao (thao tác) + tự hoàn thành theo DELIVERED | (đã giải quyết) |
| 🔴 L3-08 | Deadline xác nhận phía SPF vs auto-confirm 2' (clock nào chạy trước) | Rule auto-confirm + nhánh timeout |
| 🔴 L3-21 | Khi nào có REFUNDED/FAIL, SPF trả gì | Đối soát + trạng thái đơn |
| 🔴 L3-11 | Thời điểm thông tin tài xế về (B1) | Hiển thị shipper |
| 🔴 L1-13/15 | Token refresh-fail / webhook disconnect (Q2) | Luồng mất kết nối |
| 🟡 L3-15 | Đơn tự đến lấy (CUSTOMER_PICKUP) — SPF có bắn không, khác gì | Luồng/tem riêng |

---

## ④ Case BỔ SUNG sau kiểm tra đầy đủ (audit completeness v1)
> Audit độc lập map từng enum → case, phát hiện 9 gap. Đã bổ sung dưới đây.

| Case | Trigger / điều kiện | Nhánh / quyết định | Kết cục | Nguồn | TT |
|---|---|---|---|---|---|
| L3-28 | **Hủy đơn đã xác nhận vì quá tải / đóng cửa** (không chỉ hết món) | `order.update` CANCEL=6 + `reason_id` **80** (quá tải) / **81** (đóng cửa) — chỉ trước PICKED | Đơn sang Hủy | `[API order.update]` (79/80/81 KHÁC busy_reason 1/2/3) | ✅ |
| L3-29 | **Quán làm chậm / tài xế chờ >20'** | `order.update` `busy_info` (total_minute, from/to) — **KHÔNG đổi status** | Nút **"Báo trễ"**: báo SPF/khách thời gian trễ, đơn vẫn chạy | `[API order.update]` research-ops | 🟡 |
| L3-30 | **Đơn quán tự giao** (`MERCHANT_DELIVERY`) | không có bước bàn giao tài xế SPF | Quán tự đánh dấu giao xong (nếu VN có phát sinh) | `[API ShippingMethod]` | 🔴 hỏi SPF |
| L3-31 | **SPF/khách sửa nội dung đơn** (`UPDATE_ORDER`) khi đơn đang ở tab chưa/đã xác nhận | get_details bản mới → **cảnh báo banner đỏ**; nếu đã in tem → in tem **"ĐÃ CẬP NHẬT"** | Nhân viên thấy rõ thay đổi | `[API OrderUpdateType]` | 🟡 |
| L3-32 | **Nhiều món hết cùng lúc / nhiều lý do hủy** | `out_of_stock` nhận **mảng nhiều dish** trong 1 call; nhiều lý do → ưu tiên 79>80>81 | 1 lần gọi xử lý hết | `[API order.update]` | 🟡 xác nhận SPF |
| L3-33 | **Trùng đơn do webhook + polling chạy song song** cùng `order_code` | Dedup bằng `order_code` + **unique constraint DB** (insert-if-not-exists), không chỉ idempotency in-memory | Không tạo trùng | thiết kế (AR-02/SG) | ✅ |
| L3-34 | **Đổi ca / đăng xuất** khi countdown auto-confirm 2' đang chạy | Countdown chạy **server-side độc lập** phiên đăng nhập | Không treo/reset khi không ai xem màn | thiết kế | 🟡 |
| L3-35 | **Đơn tồn qua nửa đêm / khung giờ đóng cửa** | Chốt doanh thu theo **ngày đặt** hay **ngày giao**? | Quy tắc cutoff báo cáo | thiết kế | 🔴 quyết |
| L1-28 | **Menu sync có item lỗi** (`failed_items_detail`) | Cho **sync lại riêng item lỗi** (sync-theo-món), không full sync lại | Khắc phục nhanh | `[API §3.5]` | 🟡 |
| L1-29 | **Whitelist IP** phía SPF (P2) | Quy trình + SLA: ai request, bao lâu, retry nếu chưa kịp go-live | Chuẩn bị go-live | logistics | 🔴 hỏi SPF |

> **Đã xác nhận đủ (audit):** kết nối/auth, menu-sync core + guardrail + mapping 3 case + Prepaid/CheapMeal, công thức đối soát, ngữ nghĩa thanh toán. `MenuObjectUpdateType` (ADD/CHANGE/UPDATE/DELETE) đã rải trong L1-20/L2-11/14/16.
