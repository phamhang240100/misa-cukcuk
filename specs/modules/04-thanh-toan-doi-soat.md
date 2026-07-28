# Module 04 — Thông tin thanh toán hiển thị trên POS (ShopeeFood → CukCuk)

> **Câu hỏi gốc:** *"Khối thanh toán trên POS cần những thông tin gì của ShopeeFood?"*
> Nguồn đối chiếu: `[API]` = PDF *Foody External API Integration* **V 0.0.17 / Jan 28, 2026** (`Docs/API shopee/`), mục `order.get_details`, `order.get_list`, §2 Data Definition, §4.1 Order Webhook · `[Q&A]` = 4 sheet trong *Các câu hỏi CukCuk cần làm rõ với ShopeeFood.xlsx* · `[MAP]` = sheet *Thông tin đơn hàng*.
> Ngày rà: 2026-07-27.

---

## 0-BIS. ⚠️ CẬP NHẬT 2026-07-28 — `BR-PAY-01` BỊ LẬT

> Nguồn mới: `[DOC-MAP]` + `[CMT-HP]` + `[DOC-RULE]` (28/07) + prototype POS. Chi tiết: `../.clarity/delta-2026-07-28.md`, `../.clarity/pos-prototype-map-2026-07-28.md`.

| Rule | Trước | **Nay** |
|---|---|---|
| `BR-PAY-01` | *"Khối tài chính là **chỉ-đọc**. Không nút Thu tiền"* | 🔴 **SAI RỒI — CÓ nút *Thu tiền*.** *Thu tiền* = **gộp 2 thao tác**: báo ShopeeFood đơn đã xong **+** đóng đơn sang *Đã thanh toán* (`XD-01`, `[CMT-HP] C1`, `[DOC-RULE]`) |
| — | (không nêu) | **Màn tính tiền giữ nguyên như đơn thường** — vẫn có Tiền mặt / Chuyển khoản QR / Thẻ, nhập tiền khách đưa — nhưng **mặc định sẵn phương thức = *ShopeeFood*** (`POS-D3`, `POS-D5`) |
| — | (không nêu) | **Đơn đã hủy: KHÔNG có nút *Thu tiền***. Đơn đã bấm Thu tiền rồi mới bị hủy → giữ *Đã thanh toán* + **nhãn đỏ *"ShopeeFood báo huỷ"*** (`POS-D17`) |

**Giữ nguyên (vẫn đúng):** `BR-PAY-02` … `BR-PAY-10` — đặc biệt `BR-PAY-05` (poller phải gửi `mark_as_received = OFF`), `BR-PAY-08` (đơn hủy không tính doanh thu), `BR-PAY-09` (không trừ khuyến mại 2 lần), `BR-PAY-10` (không dựa vào `original_price`).

### ⚠️ Rủi ro kế toán `RR-05` (mới)

Đơn **đã bấm Thu tiền** rồi ShopeeFood mới báo hủy: trạng thái trả tiền chuyển `REFUNDED` — **tiền không về ví quán**, trong khi sổ CukCuk đã ghi đã thu ⇒ **cuối kỳ đối soát lệch đúng bằng số đơn đó**. Nhãn đỏ *"ShopeeFood báo huỷ"* là để kế toán trừ ra. Không tự sửa số liệu đã chốt, nhưng **không được im lặng**.

### 📌 Tra cứu dứt điểm: ShopeeFood trả về những phí gì (28/07)

| Nhóm | Field | Tình trạng |
|---|---|---|
| **Phí của khách** (khối `customer_bill`) | `total_amount` · `shipping_fee` · `packing_fee` · `service_fee` · `surcharge_fee` · `hand_deliver_fee` · `vat_deliver_fee` · `confirm_fee` · `merchant_discount` · `foody_discount` · `total_discount` | 🔴 Schema có, **thực tế nhiều khả năng KHÔNG trả về** ⇒ `Q-PAY-B` |
| **Tiền quán** | `order_value` · `merchant_price` · `total_merchant_discount` · `merchant_discounts[]` · `pay_to_merchant{type,status}` | 🟢 Chắc chắn có |
| **Tiền quán** | `tax_fee` | 🟢 Có — **chỉ ở `order.get_list`** |
| **Tiền quán** | `commission_amount` | 🟡 Schema có, chưa thấy trong dữ liệu mẫu ⇒ `Q-PAY-B` |
| — | `extra_fee` | 🔴 Tài liệu **không định nghĩa** |

⚠️ **`XD-12`** — prototype POS đang hiện dòng *Phí giao hàng* / *Phí đóng gói* trong khối tiền: đây là **phí khách trả Shopee**, không phải tiền quán ⇒ bỏ hoặc luôn hiện "—".
⚠️ **`XD-14`** — prototype ghi cứng **Chiết khấu ĐTGH (20%)**; hoa hồng thật khác nhau theo quán ⇒ **không được hardcode**, phải lấy số thực từng đơn.
⇒ Cả hai **chưa chốt được** cho tới khi ShopeeFood trả lời `Q-PAY-B`.

---

## 0. Kết luận ngắn (đọc cái này trước)

**Đơn ShopeeFood không có nghiệp vụ thu ngân tại quầy** → khối "thanh toán" trên POS là **khối chỉ-đọc**, trả lời 3 câu hỏi của thu ngân/chủ quán:

1. **Khách đã trả Shopee chưa, trả bằng gì?** → `customer_pay.type`
2. **Quán được Shopee trả theo hình thức nào, đã nhận chưa?** → `pay_to_merchant.type` + `pay_to_merchant.status`
3. **Đơn này quán thực nhận bao nhiêu?** → tính từ `merchant_price` / `total_merchant_discount` / `commission_amount` / `tax_fee`

⚠️ **Nhưng:** hai con số mà `ui-flow-improvements.md` 🔴1 và `03-nhan-don-pos.md` BR-POS-02 đang yêu cầu hiển thị — *"Khách trả Shopee: X"* và *"Quán thực nhận: Y"* — **hiện chưa chứng minh được là lấy đủ dữ liệu**. Chi tiết ở §3 và §6. Đây là điểm chặn phải chốt với SPF trước khi build khối tài chính.

---

## 1. Ba tầng độ tin cậy của dữ liệu

Không phải field nào có trong schema PDF cũng chắc chắn có ngoài production. Sample reply của `order.get_details` trong chính PDF (§3.1, dữ liệu 2019) **thiếu** `commission_amount` và `customer_bill` dù schema đánh dấu *Required*. Vì vậy chia 3 tầng:

| Tầng | Nghĩa | Cách dùng |
|---|---|---|
| 🟢 **CHẮC** | Có trong schema **và** xuất hiện trong sample reply | Build thẳng |
| 🟡 **CHƯA XÁC NHẬN** | Có trong schema, **không** có trong sample, chưa thấy dữ liệu thật | Thiết kế UI có nhánh "—" khi thiếu; hỏi SPF (§6) |
| 🔴 **SAI ENDPOINT / KHÔNG CÓ** | Spec CukCuk đang giả định có, nhưng tài liệu không có ở chỗ đó | Phải sửa thiết kế |

---

## 2. Bảng field — POS cần lấy gì từ ShopeeFood

### 2.1 🟢 Tầng CHẮC

| Field `[API]` | Kiểu / Enum | Nghĩa nghiệp vụ | Hiển thị trên POS |
|---|---|---|---|
| `customer_pay.type` | `BuyerPaymentMethod`: COD=1 · CYBER_SOURCE=4 · TOPPAY=6 · VNPAY=8 | **Khách trả Shopee bằng gì** (tiền mặt cho tài xế / thẻ / ví) | Dòng *"Khách thanh toán: Tiền mặt / Thẻ / VNPAY"* — **chỉ để biết**, không phải tiền quán nhận |
| `pay_to_merchant.type` | `PaymentMethod`: COD=1 · MERCHANT_WALLET=6 | **Hình thức Shopee trả cho quán** | Dòng *"Shopee trả quán qua: Ví đối soát"*. ⚠️ Xem Q-PAY-C nếu gặp `COD=1` |
| `pay_to_merchant.status` | `MerchantPaidStatus`: UN_PAID=1 · PAID=2 · FAIL=3 · REFUNDED=4 | **Quán đã được trả tiền chưa** | Badge: *Chờ đối soát* (1) · *Đã nhận vào ví* (2) · *Trả tiền lỗi* (3, 🔴 cảnh báo) · *Đã hoàn tiền* (4, 🔴 cảnh báo) |
| `order_value` | `{value, unit, text}` | Tổng thành tiền các món **theo giá khách thấy** (đã trừ KM gạch giá/flash sale/prepaid). Kiểm chứng bằng sample: 88.000+113.000+90.000 = 291.000 = `order_value` | Dòng *"Tiền món (giá khách thấy)"*. ⛔ **KHÔNG** phải doanh thu quán |
| `total_merchant_discount` | `{value, unit, text}` | Tổng tiền giảm giá **quán chịu** trên cả đơn `[Q&A 22062026-Q2]` | Dòng *"Khuyến mại quán tài trợ"* |
| `merchant_discounts[]` | `{name, code, merchant_discount{...}, dish_ids[]}` | Chi tiết từng khoản KM quán chịu; có `dish_ids` nếu là KM cấp món (prepaid) `[API changelog v0.0.15]` | Bung chi tiết khi bấm vào dòng KM |
| dish `price` | `{value, unit, text}` | Giá khách trả cho món. **Prepaid SKU luôn = 0đ** `[API note]` | Cột đơn giá. ⚠️ Món prepaid hiện **0đ** → cần chú thích *"Deal trả trước"*, nếu không thu ngân tưởng lỗi |
| dish `original_price` | `{...}` — ⚠️ **`optional`**, không có trong sample nào | Giá gốc trước mọi khuyến mại | Gạch ngang cạnh giá **chỉ khi có giá trị**; ⛔ không dùng làm đầu vào công thức (BR-PAY-10) |
| dish `merchant_price` | `{...}` | **Giá gốc − phần quán tài trợ** = doanh thu món của quán `[API note v0.0.13]` | Không hiện ở dòng món; dùng để tính khối tài chính |
| dish `total` | `{...}` | Thành tiền món | Cột thành tiền |
| `vat_info` | `{id, tax_number, address, company_name, status}` | Khách yêu cầu **hóa đơn VAT** cho đơn | Khối *"Xuất hóa đơn cho khách"* — SPF **không xuất HĐĐT** `[Q&A 22062026-Q7, 1206-F.6]` → CukCuk tự xuất, cần MST/tên/địa chỉ này |

### 2.2 🟡 Tầng CHƯA XÁC NHẬN

| Field | Schema nói | Vấn đề | Ảnh hưởng POS |
|---|---|---|---|
| `commission_amount` | *Required object* trong `order.get_details` | **Không có** trong sample reply của chính PDF | Không có nó thì **không tính được "quán thực nhận"** |
| `customer_bill.*` (`total_amount`, `shipping_fee`, `service_fee`, `packing_fee`, `surcharge_fee`, `hand_deliver_fee`, `vat_deliver_fee`, `confirm_fee`, `merchant_discount`, `foody_discount`, `total_discount`) | Cả block *Required* | **Không có** trong sample; và `[Q&A 1206-F.7]` nói thẳng *"Phí giao hàng / KM ShopeeFood tài trợ / Phí dịch vụ — **những khoản trên không trả về trong order detail**"* | ⇒ Con số **"Khách trả Shopee: X"** trong BR-POS-02 **có thể không lấy được**. Xem §3 |
| `total_value` | *Required object* | **Không định nghĩa** trong tài liệu. Sample: `order_value` 291.000 vs `total_value` 145.500 (đúng 50%) → là data test giảm 50%, **không suy ra được ngữ nghĩa** | ⛔ **Cấm dùng làm đầu vào công thức** cho tới khi SPF xác nhận |
| `extra_fee` | *Required object* | Không định nghĩa; sample = 0đ | Chưa đưa vào khối tài chính |

### 2.3 🔴 Tầng SAI ENDPOINT — phải sửa spec

| Điểm | Thực tế trong `[API]` |
|---|---|
| **`tax_fee` (thuế seller) KHÔNG có trong `order.get_details`** | Schema `get_details` **không có field thuế nào**. Field duy nhất chứa chữ "tax" là `vat_info.tax_number` — đó là **MST của khách** xin hóa đơn, không phải thuế quán bị khấu trừ. `tax_fee {value, unit, text}` **chỉ tồn tại trong `order.get_list`** |
| ⇒ **Đính chính `customer-journey.md:74`** | Câu *"Các trường phục vụ tính (b) đều có trong `order.get_details`… seller tax"* là **SAI**. Muốn có thuế phải gọi **`order.get_list`** |
| ⇒ **Kiến trúc:** poller đối soát phải dùng `order.get_list` | `get_list` trả cùng lúc `pay_to_merchant{type,status}` **và** `tax_fee` — vừa bù đơn miss (SG-01) vừa lấy thuế + trạng thái trả tiền. `get_details` một mình **không đủ** để dựng khối tài chính |

---

## 3. Hai con số BR-POS-02 đang yêu cầu — tình trạng thật

| Con số POS muốn hiện | Nguồn cần | Tình trạng |
|---|---|---|
| **"Khách trả Shopee: X"** | `customer_bill.total_amount` | 🔴 **Coi như KHÔNG lấy được** — 3 nguồn cùng chỉ một hướng: (1) `[Q&A 1206-F.7]` trả lời thẳng các khoản buyer-side *"không trả về trong order detail"*; (2) sample reply không có block này; (3) **changelog không hề có** entry thêm `customer_bill` — mà changelog **có** ghi các lần bổ sung field vào `get_details` (v0.0.13 thêm `merchant_price`, v0.0.15 sửa `merchant_discounts`) ⇒ field này có từ đầu mà vẫn không xuất hiện trong dữ liệu |
| **"Quán thực nhận: Y"** | `merchant_price` (🟢) + `commission_amount` (🟡) + `tax_fee` (🔴 phải lấy từ `get_list`) | Tính được **chỉ khi** `commission_amount` có thật ngoài production **và** poller có gọi `get_list`. `commission_amount` là field **merchant-side** nên lời đáp F.7 không phủ nó ⇒ vẫn còn cửa, nhưng **phải chốt Q-PAY-B trước khi build dòng này** |

### 🆕 Quyết định thiết kế (2026-07-27)

**Mặc định: BỎ dòng *"Khách trả Shopee"* khỏi khối tài chính POS.** Thay bằng *Tiền món (giá khách thấy)* = `order_value`, kèm nhãn *"chưa gồm phí giao/phí dịch vụ Shopee thu của khách"*. POS **không cần** con số khách trả — đó không phải nghiệp vụ của quán, và cũng không có nguồn dữ liệu.
Q-PAY-B giữ lại như **câu hỏi xác nhận**, không phải điều kiện chặn: nếu SPF khẳng định có trả `customer_bill` thì mới bổ sung dòng đó lại.
Riêng dòng **"Quán thực nhận"** thì **có chặn** — chờ Q-PAY-B xác nhận `commission_amount`.

---

## 4. Công thức "Quán thực nhận" & cái bẫy trừ 2 lần

Công thức chuẩn `[Q&A 22062026-Q5]`:

```
Tiền quán thực nhận = tiền món − KM quán tài trợ − commission − thuế
```

Ánh xạ sang field — 2 cách về lý thuyết, nhưng **chỉ 1 cách khả thi**:

| Cách | Công thức | Tình trạng |
|---|---|---|
| ✅ **(A) dựa trên `merchant_price`** — **chọn cách này** | `Σ(merchant_price × quantity) − commission_amount − tax_fee` | `merchant_price` **đã trừ** phần quán tài trợ ở cấp món rồi `[API note v0.0.13]` → ⛔ **không được trừ `total_merchant_discount` lần nữa** |
| ❌ **(B) dựa trên giá gốc** — **không dùng được** | `Σ(original_price × quantity) − total_merchant_discount − commission_amount − tax_fee` | `original_price` là **`optional`** trong schema và **không xuất hiện trong bất kỳ sample nào** của tài liệu (chỉ có đúng 2 lần trong toàn PDF, đều ở phần schema) ⇒ **không có số gốc để làm nền công thức** |

⚠️ **Rủi ro còn lại của cách (A):** cần SPF xác nhận `total_merchant_discount` **không** phải khoản phải trừ thêm sau `merchant_price`. Việc `merchant_discounts[]` **có `dish_ids`** (KM cấp món) cho thấy nó **trùng** với phần đã nằm trong `merchant_price` → nếu làm ẩu `Σ merchant_price − total_merchant_discount` là **trừ khuyến mại 2 lần**, báo cáo doanh thu sai. → **Q-PAY-A** (§7) là câu **xác nhận (A) không trừ trùng**, không còn là câu "chọn A hay B".

⇒ **`total_merchant_discount` / `merchant_discounts[]` trên POS chỉ để HIỂN THỊ** (*"Khuyến mại quán tài trợ"* — cho chủ quán thấy mình đang gánh bao nhiêu), **không tham gia phép trừ** trong công thức thực nhận.

**Ví dụ chuẩn từ `[API]`:** giá gốc 20, deal 10 (quán tài trợ 4, Shopee tài trợ 6) → `price` (khách thấy) = 10 · `merchant_price` = 20 − 4 = **16**. ⇒ Doanh thu quán tính trên **16**, không phải 10. Đây là lý do **cấm dùng `order_value` làm doanh thu quán**.

---

## 5. Lấy dữ liệu thanh toán về POS bằng cách nào

| Việc | Endpoint | Lưu ý |
|---|---|---|
| Lấy thông tin thanh toán khi đơn về | `order.get_details` | Có `customer_pay`, `pay_to_merchant`, `order_value`, `merchant_price`… |
| Lấy **thuế** + trạng thái trả tiền để đối soát | `order.get_list` | **Bắt buộc** — `tax_fee` chỉ có ở đây (§2.3) |
| Biết khi nào `pay_to_merchant.status` đổi UN_PAID → PAID | ❌ **Không có webhook** | Payload webhook `/update_order` chỉ gồm `order_code, update_type, restaurant_id, pick_time, status, merchant_note, note_for_shipper, partner_restaurant_id` — **không có field tiền nào**. ⇒ Trạng thái trả tiền **chỉ biết được bằng polling** |

🆕 **BR-PAY-05 (kỹ thuật, quan trọng):** khi polling `order.get_details` để làm mới thông tin thanh toán, **phải gửi `mark_as_received = OFF`**. Tham số này **mặc định = ON** và sẽ tự đánh dấu đơn là *đã nhận* (M_RECEIVED) — poller đối soát vô tình đổi trạng thái đơn là lỗi nghiệp vụ.

📌 `[Q&A 1206-D.2]`: các khoản phí **được trừ trực tiếp trên từng đơn**, không phải cộng dồn cuối kỳ ⇒ số "quán thực nhận" hiển thị **theo từng đơn** là hợp lệ. (Chu kỳ Shopee **chuyển tiền** vào tài khoản quán vẫn là câu hỏi mở Q8.)

---

## 6. Rule hiển thị khối tài chính POS

| # | Rule |
|---|---|
| ~~**BR-PAY-01**~~ | ⛔ **ĐÃ LẬT 28/07 — xem §0-BIS.** ~~Khối tài chính là chỉ-đọc. Không bàn phím số, không nút *Thu tiền*~~ → **CÓ nút *Thu tiền***, màn tính tiền giữ nguyên như đơn thường (mặc định phương thức *ShopeeFood*). ✅ **Vẫn giữ**: không có dòng *Còn phải thu* |
| **BR-PAY-02** | Hình thức & trạng thái trả tiền **đọc từ `pay_to_merchant`**, ⛔ không hardcode "SFP" |
| **BR-PAY-03** | `pay_to_merchant.status` = FAIL(3) hoặc REFUNDED(4) → **badge đỏ + cảnh báo thu ngân**, không im lặng |
| **BR-PAY-04** | Món **prepaid** hiện `price` = 0đ → phải kèm nhãn *"Deal trả trước"*, tránh hiểu là lỗi giá |
| **BR-PAY-05** | Poller `get_details` phải gửi `mark_as_received = OFF` (§5) |
| **BR-PAY-06** | Field ở tầng 🟡 chưa có dữ liệu → hiện **"—"** kèm tooltip *"ShopeeFood chưa trả về"*, ⛔ **không hiện 0đ** (0đ đọc ra là "quán không nhận được đồng nào") |
| **BR-PAY-07** | ⛔ Không dùng `total_value`, `extra_fee`, `customer_bill` làm đầu vào bất kỳ công thức doanh thu nào cho tới khi SPF xác nhận |
| **BR-PAY-08** | Đơn **hủy**: `[Q&A 1206-F.5]` order detail **không đổi field tiền**, chỉ đổi status ⇒ POS phải **tự loại đơn CANCELLED khỏi doanh thu**, không tin số tiền còn hiển thị trên đơn hủy |
| **BR-PAY-09** | ⛔ **`total_merchant_discount` không tham gia phép trừ** — chỉ hiển thị (§4). Nền doanh thu quán là `Σ merchant_price × SL` |
| **BR-PAY-10** | ⛔ Không dựa vào `original_price` để tính bất cứ thứ gì — field `optional`, **không có trong sample nào**. Chỉ dùng để gạch giá **khi có giá trị**; không có thì ẩn |

**Layout đề xuất (khối chỉ-đọc, dưới danh sách món):**

```
─── THANH TOÁN ────────────────────────────────
Khách thanh toán Shopee   Ví VNPAY        [customer_pay.type]
Shopee trả quán qua       Ví đối soát     [pay_to_merchant.type]
Trạng thái                ● Chờ đối soát  [pay_to_merchant.status]
───────────────────────────────────────────────
Tiền món (giá khách thấy)          291.000đ   [order_value] — tham khảo, KHÔNG vào công thức
   ↳ trong đó KM quán tài trợ       20.000đ   [total_merchant_discount] ▸ chi tiết — chỉ để biết
───────────────────────────────────────────────
Doanh thu món của quán             311.000đ   [Σ merchant_price × SL]  ← nền công thức
Hoa hồng ShopeeFood               − 35.000đ   [commission_amount]  🟡 chờ Q-PAY-B
Thuế (SPF thu hộ)                 −  7.000đ   [tax_fee — lấy từ order.get_list]
───────────────────────────────────────────────
QUÁN THỰC NHẬN                     269.000đ   (§4 cách A — chờ Q-PAY-A xác nhận không trừ trùng)
```

> 📌 Đọc kỹ layout: **"Tiền món (giá khách thấy)" và "KM quán tài trợ" nằm ở khối trên, KHÔNG bị trừ vào khối dưới.** Doanh thu quán bắt đầu từ `Σ merchant_price` — con số này **có thể LỚN HƠN** `order_value` khi Shopee tài trợ một phần khuyến mại (ví dụ §4: khách trả 10, quán ghi nhận 16). Nếu thu ngân thấy "quán thực nhận" > "tiền món" thì **đó là đúng**, cần chú thích rõ trên UI để không bị báo là bug.

---

## 7. Câu hỏi mở cho ShopeeFood (mới, phát sinh từ rà soát này)

| ID | Câu hỏi | Vì sao chặn |
|---|---|---|
| 🔴 **Q-PAY-A** | Xác nhận công thức **`Σ(merchant_price × SL) − commission_amount − tax_fee`** là đúng — tức `total_merchant_discount` / `merchant_discounts[]` **đã nằm trong** `merchant_price` và **không phải trừ thêm**. Nhờ SPF cho 1 ví dụ số cụ thể của đơn có **cả** KM cấp món (prepaid, có `dish_ids`) **và** KM cấp đơn | Hiểu sai → **trừ khuyến mại 2 lần** → sai doanh thu quán |
| 🔴 **Q-PAY-B** | `order.get_details` ngoài production **có thật sự trả `commission_amount` và block `customer_bill`** không? Sample trong tài liệu không có 2 block này, còn `[Q&A 1206-F.7]` nói phí buyer-side không trả cho merchant | Quyết định khối tài chính POS hiện được **mấy con số** |
| 🟠 **Q-PAY-C** | `pay_to_merchant.type = COD(1)` (giá trị trong sample) nghĩa là gì với đơn ShopeeFood tại VN — vẫn Shopee đối soát vào ví, hay **tài xế đưa tiền mặt cho quán lúc lấy hàng**? Nếu là tài xế đưa thì đưa **số tiền nào** | POS đang thiết kế theo mô hình **ví-only** (chốt BA 2026-07-23). Nếu production trả COD thì phải chốt lại **nhãn hiển thị** |
| 🟠 **Q-PAY-D** | Định nghĩa chính xác của **`total_value`** và **`extra_fee`** trong `order.get_details` (tài liệu không mô tả) | Đang phải cấm dùng 2 field này |
| 🟠 **Q-PAY-E** | `tax_fee` chỉ có ở `order.get_list`, không có ở `order.get_details` — **đúng ý đồ** hay thiếu sót tài liệu? Nếu đúng, xác nhận `get_list` là nguồn thuế chính thức | Quyết định kiến trúc poller đối soát |
| 🟠 **Q-PAY-F** | Khi `pay_to_merchant.status` đổi UN_PAID → PAID, SPF **có bắn webhook** không (payload `/update_order` hiện không có field tiền)? Nếu không, tần suất polling khuyến nghị là bao nhiêu | Không có câu này thì badge *Đã nhận vào ví* luôn trễ, và tốn quota 25 QPS |
| 🟡 **Q-PAY-G** | `REFUNDED(4)` / `FAIL(3)` phát sinh khi nào, và số tiền hoàn được trả về ở field nào (order detail không đổi field khi hủy `[1206-F.5]`) | Trùng câu hỏi cũ về L3-21 — vẫn chưa có lời đáp |

---

## 8. Việc phải sửa trong spec hiện có

1. `customer-journey.md:74` — bỏ khẳng định seller tax có trong `order.get_details`; ghi rõ **`tax_fee` ở `order.get_list`**.
2. `03-nhan-don-pos.md` BR-POS-02 — dòng *"Khách trả Shopee"* phải gắn điều kiện **phụ thuộc Q-PAY-B**; nếu SPF xác nhận không có `customer_bill` thì bỏ dòng đó.
3. `03-nhan-don-pos.md` §2 SG-01 — nêu rõ poller `order.get_list` **kiêm luôn** nhiệm vụ lấy `tax_fee` + `pay_to_merchant.status`, không chỉ bù đơn miss.
4. `questions-for-shopeefood.md` — bổ sung Q-PAY-A…G vào mục "Còn mở".
