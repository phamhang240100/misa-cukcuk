# Phân tích hướng đi — Tích hợp MISA CukCuk ↔ ShopeeFood

> **Trạng thái:** Bản phân tích định hướng (v1) — đã chốt phạm vi.
>
> **PHẠM VI ĐÃ CHỐT (BA xác nhận):**
> - ✅ Làm cả **4 luồng**: Kết nối+Menu · Nhận đơn POS · Đối soát+Báo cáo · Nâng cao UX đa kênh.
> - ✅ **CHỈ ShopeeFood** lần này (Grab loại khỏi phạm vi; khung UI/dữ liệu vẫn để đa kênh cho tương lai, không build Grab).
> - ✅ Tôi **dựng Customer Journey Map** → xem `customer-journey.md`.
> - ✅ 2 mâu thuẫn phí → **gộp vào danh sách hỏi SPF** → xem `questions-for-shopeefood.md` (không tự giả định).
>
> **QUYẾT ĐỊNH SẢN PHẨM ĐÃ CHỐT (refine v1):**
> - ✅ **Mapping menu = Auto fuzzy-match (~80%) + user xác nhận** (cả lần đầu & khi có món mới) — mô hình KiotViet (U1).
> - ✅ **Auto-confirm = mặc định thủ công + tự xác nhận sau ~2'** nếu không thao tác; bật/tắt trong Cài đặt (U2).
> - ✅ **Nút "Tạm ngưng bán online" đẩy đóng cửa lên SPF tức thì** — ưu tiên MVP (U4, phụ thuộc endpoint câu hỏi B6).
> **Nguồn & độ tin cậy (provenance):**
> `[API]` Tài liệu API ShopeeFood (Foody External + Authorization) — **CHUẨN**, ưu tiên cao nhất.
> `[Q&A]` Excel "Các câu hỏi CukCuk cần làm rõ" (đã có phản hồi SPF) — **CHUẨN**.
> `[MAP]` Excel "Mô tả chi tiết mapping" — **CHUẨN** (mức chi tiết trường).
> `[XMIND]` Sơ đồ "Tích hợp shopee.xmind" — **BẢN NHÁP**, làm sau, cân nhắc lại.
> `[UI]` 2 app phác thảo (web BE + POS) — **BẢN NHÁP UI**, chỉ để tham chiếu ý tưởng.
> Nguyên tắc: khi mâu thuẫn → `[API]`/`[Q&A]` thắng `[XMIND]`/`[UI]`.

---

## 1. Bối cảnh & mô hình tích hợp

CukCuk tích hợp ShopeeFood với vai trò **ISV Partner** (không phải Brand). Điều này quyết định toàn bộ kiến trúc:

| Khía cạnh | Brand (KHÔNG dùng) | **ISV Partner (CukCuk dùng)** | Nguồn |
|---|---|---|---|
| Xác thực request | HMAC-SHA256 signature (app_key/post_key) | **Bearer access_token** (bỏ qua bước ký) | `[API]` §1 "ignore this step if you are an ISV Partner" |
| Lấy token | — | OAuth2 **Device Authorization** (`/oauth2/devicecode` → `/oauth2/token`) | `[API-Auth]` |
| Quản lý token | — | **Mỗi cửa hàng 1 cặp access/refresh token**, phải refresh định kỳ tránh hết hạn | `[API-Auth]` Note |
| Mapping store | — | **1 client_id ↔ nhiều store; mapping 1:1** SPF store ↔ CukCuk store | `[Q&A]` A.1 |

**Điều kiện bắt buộc trước khi kết nối** `[Q&A A.1]`: (1) Whitelist IP server CukCuk; (2) Webhook nhận noti đơn; (3) Endpoint menu để SPF get menu; (4) Auth; (5) Whitelist SPF id để cho phép SPF gọi API. → **Nhà hàng phải đã có gian hàng trên ShopeeFood** mới kết nối được (`[Q&A A.7]`: "Không kết nối được" nếu chưa có gian hàng). Chỉ **owner** mới link được (`[Q&A A.8]`).

**4 luồng nghiệp vụ chính:**
1. **Kết nối / Authorization** (QR device-code → Shopee Partner App → xác thực)
2. **Thiết lập & Đồng bộ Menu** (1 chiều CukCuk → SPF, có mapping)
3. **Nhận & Xử lý Đơn hàng** (webhook → get_details → vòng đời đơn tại POS)
4. **Đối soát tài chính** (commission, thuế, khuyến mại, giá gạch)

---

## 2. Những phát hiện THEN CHỐT (thay đổi cách build)

Đây là các ràng buộc kỹ thuật quan trọng nhất — bất kỳ tính năng nào phác thảo trái với các điểm này đều phải chỉnh.

### F1 — Menu đồng bộ **1 chiều** CukCuk → SPF, KHÔNG kéo ngược `[Q&A C.1, C.5, B.4]`
- Sửa menu trực tiếp trên Shopee Partner **không** đồng bộ về CukCuk.
- Giá bán lưu tại SPF là nguồn thật, **không cập nhật ngược** về CukCuk `[Q&A 1206-B.4]`.

### F2 — Full-sync menu có tính **HỦY DIỆT** `[Q&A C.6]` ⚠️
- Khi gọi `menu.sync` (toàn bộ), **món có trên SPF nhưng không mang id CukCuk sẽ bị XÓA** → **mất lượt bán / lịch sử món cũ**.
- ⇒ **Bắt buộc mapping trước khi đồng bộ**, và UI phải cảnh báo đỏ rõ ràng. Đây là rủi ro nghiệp vụ số 1.

### F3 — KHÔNG có cơ chế gửi lại webhook (no replay) `[Q&A F.9]` ⚠️
- Nếu CukCuk mất kết nối / rớt webhook → SPF **không** noti lại.
- ⇒ CukCuk **phải** tự có cơ chế đối soát chủ động: định kỳ gọi `order.get_list` theo trạng thái + khoảng thời gian để bù đơn thiếu. **Đây là requirement, không phải tùy chọn.**

### F4 — Nhiều thao tác chỉ làm được trên **Partner App**, KHÔNG có API `[Q&A 2206]`
- Sửa thông tin đơn / sửa món trên đơn: **API chưa hỗ trợ** (chỉ Partner App). POS chỉ được sửa *tên* món hiển thị cục bộ `[Q&A 2906-6]`.
- In hóa đơn / phiếu giao hàng: **API chưa hỗ trợ in bill** (chỉ Partner App) `[Q&A 2206-8]`.
- Xuất hóa đơn điện tử: SPF **chưa hỗ trợ** → CukCuk dùng HĐĐT riêng của mình `[Q&A 2206-7]`.

### F5 — Giá món **đã gồm thuế/VAT**, KHÔNG đồng bộ thuế riêng `[Q&A 2906-1,2]`
- Giá đẩy từ CukCuk lên SPF được hiểu là **đã bao gồm toàn bộ thuế/VAT**. SPF chỉ tính **seller_tax trên subtotal**.

### F6 — Chỉ hỗ trợ **1 loại khuyến mại qua API: giá gạch (price_slash)** `[Q&A 3, 2906-8]`
- Các CTKM khác (tặng món, mua M tặng N, giảm hóa đơn, đồng giá…) **phải liên hệ SPF setup thủ công**, không qua API.
- SPF chỉ trả về phần khuyến mại **do nhà hàng tài trợ** trong order detail `[Q&A D.5]`.

### F7 — Hủy đơn từ POS chỉ được **trước khi tài xế lấy hàng (PICKED)** `[Q&A 2906-7]`

### F8 — Không hỗ trợ **combo** `[Q&A 2906-4]`; không phân loại món đặc biệt (đóng gói/cồn) `[Q&A 2906-3]`.

### F9 — Vòng đời trạng thái đơn `[API §2 Order Status Machine]`
- **Happy flow:** `M_ASSIGNED(5)` → `M_RECEIVED(6)` → `CONFIRMED(3)` → `PICKED(1)` → `DELIVERED(2)`
- **Hủy:** `M_ASSIGNED` → `M_RECEIVED` → `M_OUT_OF_SERVICE(7)` → `CANCELLED(8)`
- Partner cập nhật đơn qua `OrderUpdateStatus`: `CONFIRM=0`, `OUT_OF_SERVICE=2` (xin hủy), `CANCEL=6`. Từ chối đơn có lý do: `WRONG_MENU / RESTAURANT_BUSY / RESTAURANT_CLOSES / WRONG_COMMISSION / CUSTOM`.

### F10 — Rate limit **25 QPS/IP** `[API §Non-functional]` → cân nhắc throttle khi sync menu lớn & polling.

---

## 3. Review UI bản phác thảo — Hợp lý / Chưa hợp lý / Cần cải tiến

Lăng kính chính: **mỗi tính năng có được API hậu thuẫn không?** (điểm advisor nhấn mạnh).

### 3A. App WEB BE (kết nối + thiết lập) — `ApplicationsView, ThucDonView, SettingsView, DashboardView, InvoicesView`

| Tính năng phác thảo | Đánh giá | Ghi chú |
|---|---|---|
| Kết nối qua QR → Shopee Partner App → thông báo thành công/thất bại | ✅ **Hợp lý** | Khớp `[API-Auth]` device-code flow. |
| Tab Menu: Món / Nhóm món / Sở thích phục vụ (topping) / Lịch trình | ✅ **Hợp lý** | Khớp `[MAP]` — mapping cả nhóm món, món, nhóm topping, topping `[Q&A 2906-5]`. |
| Nút "Đồng bộ" + cảnh báo "món chưa mapping sẽ mất" | ✅ **Rất cần** | Đúng với F2. **Cảnh báo phải mạnh hơn** — nêu rõ "mất lượt bán/lịch sử". |
| Thiết lập giờ hoạt động (tối đa 3 khung/ngày) + lịch trình theo khung giờ | ✅ **Hợp lý** | Cần xác nhận API nào set giờ mở/đóng cửa (mục §4 mở). |
| Đồng bộ **mô tả, ảnh, giá SPF, thứ tự nhóm món** | ⚠️ **Cần kiểm chứng** | Xác nhận từng trường này có trong endpoint menu (`[MAP]` liệt kê nhưng cần đối chiếu API menu). |
| Sửa **giá bán ShopeeFood** ngay trên CukCuk | ✅ Hợp lý | Nhưng nhớ F1: SPF không đẩy giá ngược lại — CukCuk là nguồn khi user chủ động sync. |
| Kéo menu **từ SPF về CukCuk** (khi đã có sẵn menu trên SPF) | ❌ **Chưa hợp lý / mâu thuẫn** | `[Q&A C.3]`: "món có ở SPF chưa có ở CukCuk → **KHÔNG** đồng bộ về". XMIND lại vẽ "đồng bộ gian hàng về CukCuk". → **Chỉ mapping thủ công 2 chiều, KHÔNG auto tạo món CukCuk từ SPF.** |
| Menu **combo** | ❌ **Bỏ** | F8 — SPF chưa support. |
| InvoicesView (hóa đơn/đối soát) | ⚠️ **Phụ thuộc §4** | Xem mâu thuẫn phí ở §5. Cần chốt trường đối soát trước khi dựng. |

### 3B. App POS (nhận đơn) — `MainOrderView, DeliveryView`

| Tính năng phác thảo | Đánh giá | Ghi chú |
|---|---|---|
| Gộp **Grab + ShopeeFood** vào 1 màn nhận đơn online | ✅ **Rất tốt (UX)** | Đúng chuẩn ngành "unified order". Nhưng cần chốt Grab có trong phạm vi lần này không (§ câu hỏi mở). |
| Tab: Chưa xác nhận / Đã xác nhận / Hoàn thành / Hủy | ✅ **Hợp lý** | Khớp `OrderListStatus` + `[XMIND]`. |
| Thông báo đơn mới (giống Grab) + không gửi email cho khách | ✅ Hợp lý | `[XMIND]`. |
| Xác nhận → gửi bếp + in tem/phiếu bếp | ✅ Hợp lý | In **nội bộ CukCuk** (không phải in qua SPF). Phân biệt rõ với F4. |
| Từ chối đơn (popup lý do) | ✅ Hợp lý | Map với `RejectOrderReason`. |
| Nút Giao hàng → in phiếu giao hàng | ⚠️ **Sửa nhãn** | F4: **không có API in bill/phiếu giao của SPF**. Nếu in thì là mẫu **nội bộ CukCuk**, mã vận đơn SPF không in (giống chuẩn Grab Express đã làm — xem memory). |
| Nút "Thu tiền", hình thức mặc định = **SPF** | ⚠️ **Cần làm rõ ngữ nghĩa** | Xem mâu thuẫn "Còn phải thu" ở §5. Với đơn SPF, tiền do SPF đối soát, **nhà hàng không thực thu từ khách** → nút này chỉ đánh dấu đã thanh toán. |
| Sửa **tên/số lượng/topping/giá** món trên đơn tại POS | ❌ **Chưa hợp lý** | F4: chỉ được sửa **tên món hiển thị cục bộ**; số lượng/giá/topping **không** sửa được (không có API, không đẩy ngược SPF). |
| Hủy đơn tại POS ở mọi trạng thái | ⚠️ **Ràng buộc** | F7: chỉ hủy được **trước PICKED**. UI phải disable nút hủy sau khi tài xế lấy hàng. |
| Trường "Còn phải thu" theo công thức XMind | ❌ **Nghi mislabel** | Xem §5. |

---

### 3C. Benchmark đối thủ & đề xuất cải tiến UX  `[RESEARCH]`
> Nguồn: research web (iPOS, Sapo, KiotViet, Ocha, GrabMerchant + best practice quốc tế). Chi tiết & link: `.clarity/domain-research.md`.

**So sánh nhanh cách đối thủ tích hợp ShopeeFood/aggregator:**

| Nền tảng | Đồng bộ menu | Nhận đơn POS | Điểm học được |
|---|---|---|---|
| **iPOS FoodHub** | Gom Grab/SPF/MoMo/Web vào 1 hệ thống, giá theo kênh | **Unified order screen** → dồn 1 máy POS, đẩy KDS bếp | Mô hình gom kênh + KDS |
| **Sapo FnB** | Link món **1 lần lúc kết nối** (món mới phải map tay) → *điểm yếu* | Auto-accept sau **2 phút**; hủy → nhãn đỏ + **tự in phiếu hủy bếp** | Auto-accept fallback; in phiếu hủy |
| **KiotViet FnB** | **Auto fuzzy-match tên món ≥80%** (chạy cả lần đầu & khi có món mới) → *tốt nhất* | 2 chế độ: thủ công (auto-accept 2') / tự động | Fuzzy-match giảm thao tác mapping |
| **GrabMerchant** | — | 1 app đa dịch vụ | — |

**Đồng thuận ngành → đưa vào thiết kế CukCuk:**

| # | Khuyến nghị UX | Áp cho màn | Ưu tiên |
|---|---|---|---|
| U1 | **Auto fuzzy-match tên món (~80%)** khi mapping — chạy cả lúc kết nối lần đầu **và mỗi khi có món mới** (hơn hẳn kiểu link 1 lần của Sapo). Hiện danh sách "chưa khớp" để user xác nhận. | Menu mapping | 🔴 Cao |
| U2 | **Auto-accept có đếm ngược** trên từng đơn (mặc định thủ công, tự xác nhận sau ~2') + tùy chọn "Tự động xác nhận toàn bộ" trong Cài đặt. | POS nhận đơn | 🔴 Cao |
| U3 | **Lưới an toàn đối soát (F3):** ack webhook 200 ngay + xử lý async; **idempotency** (lưu id event đã xử lý chống trùng khi SPF retry); **polling `order.get_list` mỗi 2–5'** bù đơn miss + cảnh báo thu ngân. Trạng thái chỉ tiến, không lùi. | POS + BE | 🔴 Cao |
| U4 | **Nút "Tạm ngưng bán online"** đẩy trạng thái đóng cửa lên SPF **tức thì** (không đợi lịch giờ) — tránh đơn vào khi hết nguyên liệu/nghỉ đột xuất. | Thiết lập / POS | 🟡 |
| U5 | Nhận cancel event → nếu đơn **đã in bếp** thì **tự in phiếu hủy** kèm mã đơn để bếp dừng nấu. | POS | 🟡 |
| U6 | QR kết nối: **đếm ngược hết hạn + nút "Tạo mã mới"** — nhưng lấy **đúng thời hạn thực từ device-code của SPF** (không hardcode 15' như Sapo). | Kết nối | 🟡 |
| U7 | Màn nhận đơn **unified có badge kênh**, kiến trúc chừa chỗ mở rộng kênh — khớp quyết định "chỉ ShopeeFood nhưng khung đa kênh". | POS | 🟢 |

**Lưu ý đối soát quan trọng `[RESEARCH]`:** Từ **01/04/2025**, ShopeeFood **tự khấu trừ & nộp thuế thay** đối tác trước khi chuyển tiền (net payout); đối soát hàng tháng qua email. ⇒ CukCuk nên ghi nhận **cả gross và net-of-commission/tax**, đánh dấu rõ khoản thuế SPF đã khấu trừ để **không hạch toán trùng**. (Cơ chế chia sẻ chi phí Price Slash tại VN chưa xác nhận được qua nguồn công khai → đã đưa vào câu hỏi SPF E1/E2.)

---

## 4. Khoảng trống (Completeness) — cái CHƯA có trong tài liệu

1. **Luồng phía khách hàng (customer journey)** — user tự nhận "chưa tìm hiểu gì". Cần map: khách đặt trên app ShopeeFood → thanh toán (online/COD) → nhà hàng nhận & xác nhận → chuẩn bị → tài xế nhận & lấy hàng → giao → hoàn thành; và **điểm chạm nào ảnh hưởng thao tác POS** (VD: khi nào shipper info về CukCuk `[Q&A 2906-9]` chưa có lời đáp rõ).
2. **API set giờ mở/đóng cửa & nhận đơn** — XMind mô tả UI giờ hoạt động nhưng chưa đối chiếu endpoint nào (Restaurant API §3.4) thực sự bật/tắt nhận đơn theo khung giờ.
3. **Cơ chế đối soát chủ động (F3)** — chưa có thiết kế cho polling `order.get_list` bù đơn thiếu.
4. **Auto-confirm order** — `[XMIND]` có (tất cả đơn / chỉ đơn đã thanh toán) nhưng cần chốt điều kiện & rủi ro (xác nhận nhầm khi hết món).
5. **Xử lý out-of-stock / tạm ngừng bán** đẩy lên SPF — `[Q&A C.10]` có API, chưa có luồng UI hoàn chỉnh.
6. **Trạng thái token hết hạn / refresh thất bại / ngắt kết nối** (`[API-Auth]` disconnect qua deeplink + poll get_restaurant_info) — cần luồng UI báo "mất kết nối, cần kết nối lại".
7. **Đơn hủy sau khi đã gửi bếp / đã nấu** — xử lý tồn/nguyên liệu, ghi nhận doanh thu như thế nào.

## 5. Điểm đã làm rõ từ nguồn (đã đối chiếu kỹ — KHÔNG còn là mâu thuẫn)

1. **Phí trong order.get_details — ĐÃ RÕ, không mâu thuẫn.** `customer_bill` là **bill phía KHÁCH (buyer-side)** — chứa phí giao/dịch vụ/đóng gói của SPF với khách. `[Q&A 22062026-Q1, 1206-F.7]` xác nhận **các khoản buyer-side này KHÔNG trả về cho merchant**; order_detail chỉ trả field liên quan merchant. ⇒ Đối soát của nhà hàng **không** dùng `customer_bill`, mà dùng field merchant.
2. **"Còn phải thu" — ĐÃ RÕ công thức `[Q&A 22062026-Q5]`.** Tách 2 chỉ số:
   - **Tiền khách phải trả** = tiền món − KM + phí giao + phí áp dụng + tip + phí khác SPF (tham khảo).
   - **Tiền nhà hàng thực nhận** = **tiền món − KM quán tài trợ − commission − thuế** (đối soát chính).
   Chi tiết: `customer-journey.md §3`, `modules/03-nhan-don-pos.md §6`.
3. **Menu SPF → CukCuk**: XMind ("đồng bộ gian hàng về CukCuk") **sai** vs `[Q&A C.3]` ("không đồng bộ món SPF về"). Muốn kéo menu SPF về CukCuk chỉ có thể dùng `get_dish` để tham chiếu, không tự tạo món. → Theo `[Q&A]`.
4. **"Tự động in hóa đơn tạm tính"** `[XMIND]` — là in **nội bộ CukCuk** (F4), không qua SPF.

**Ràng buộc MỚI phát hiện khi đọc kỹ API §3.5 (bổ sung F11):**
- Món thuộc **Prepaid SKU (Trùm Deal)**: **không sửa được**, sync sẽ **fail** nếu cố update → phải đợi hết chương trình.
- Món **CheapMeal (Ăn Ngon Rẻ)**: không sửa giá/thông tin/xóa (chỉ đổi status); **xóa/bỏ-mapping** một món thường liên quan CheapMeal → sync **fail**.
- Endpoint menu CukCuk cung cấp: `{domain}/shopeefoodvn/getMenu?storeCode={partner_store_id}` theo **JSON template của SPF** (dpaste). Giờ hoạt động: `set_operation_time_ranges`; tạm ngưng bán tức thì: `set_restaurant_busy` (reason 1 hết món/2 quá tải/3 blackout, tối đa đến 5h sáng hôm sau).

---

## 6. Đề xuất hướng đi & phân kỳ (roadmap)

**Nguyên tắc:** bám sát cái API làm được; đẩy cái API không làm được sang "thao tác trên Partner App" hoặc "nội bộ CukCuk".

- **Giai đoạn 1 — Kết nối & Đồng bộ Menu (nền móng)**
  Auth device-code/QR → quản lý token per-store → mapping menu (món/nhóm/topping) → đồng bộ 1 chiều có **guardrail mapping-first + cảnh báo hủy diệt (F2)** → thiết lập giờ hoạt động → out-of-stock.
- **Giai đoạn 2 — Nhận & Xử lý Đơn tại POS (giá trị cốt lõi)**
  Webhook → get_details → màn nhận đơn (gộp kênh) → vòng đời đơn (xác nhận/từ chối/hủy theo F7) → gửi bếp/in tem nội bộ → **cơ chế đối soát chủ động bù đơn (F3)**.
- **Giai đoạn 3 — Đối soát & Báo cáo**
  Sau khi chốt mâu thuẫn phí (§5). Ghi nhận doanh thu, commission, thuế, KM; báo cáo (tổng hợp bán hàng, doanh thu theo thời gian/mặt hàng — `[XMIND]` Báo cáo). HĐĐT dùng hệ thống riêng CukCuk.
- **Giai đoạn 4 — Nâng cao UX** (fold competitor research vào — đang chạy nền): dashboard đa kênh, cảnh báo mất kết nối, auto-confirm thông minh, trạng thái tài xế realtime.

---

## 7. Câu hỏi mở cần chốt (đưa vào vòng làm rõ)
Xem `.clarity/` — các điểm §4, §5 + quyết định phạm vi (MVP, Grab có trong scope?, chiến lược bù đơn, verify mâu thuẫn phí).
