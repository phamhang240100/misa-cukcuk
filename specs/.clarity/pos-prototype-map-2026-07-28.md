# Bản đồ POS — trích từ prototype `pos-order-shopeefood` (2026-07-28)

> Nguồn `[PROTO-POS]`: `Docs/UI/remix_-[nnhai2]-pos-order-shopeefood/src/` — `OrderOnlineView.tsx` (2.169 dòng, 206 chuỗi), `DeliveryView.tsx` (4.196 dòng, 282 chuỗi), `MainOrderView.tsx` (840 dòng).
> Đọc kèm `delta-2026-07-28.md` (xung đột `XD-*`) và `webbe-prototype-map-2026-07-28.md`.

## 1. Các màn của POS — ⚠️ ĐÍNH CHÍNH

> Bản đầu của file này ghi *"`orderonline` = màn Giao hàng từ ShopeeFood"* — **SAI**. Đã tra lại định tuyến trong `App.tsx`.

| Mã view | Mở bằng cách nào | Component | Vai trò thật |
|---|---|---|---|
| `main` | mặc định | `MainOrderView` | Order tại quán / Sơ đồ món |
| `orderonline` | **bấm vào thông báo đơn mới** | `OrderOnlineView` | **Hộp đơn mới CHUNG cho cả 2 kênh** — nơi xác nhận/từ chối đơn vừa về |
| `grab` | menu *Giao hàng từ Grab* | `DeliveryView` `channel='Grab'` | Màn giao hàng kênh Grab |
| `shopeefood` | menu *Giao hàng từ ShopeeFood* | `DeliveryView` `channel='ShopeeFood'` | Màn giao hàng kênh ShopeeFood |
| `deliveryBook` | menu *Sổ giao hàng* | `DeliveryView` `initialShowDeliveryBook` | Sổ giao hàng chung các kênh |

### 🔑 Phát hiện quan trọng: **Grab và ShopeeFood dùng CHUNG một màn**

`DeliveryView` phục vụ cả 2 kênh, chỉ nhận `channel` làm tham số ⇒ **luồng thao tác giống hệt nhau**. Đây là bằng chứng trong code cho nhận định của BA: *"tham khảo từ Grab Express, luồng sẽ tựa tựa"*.

**Toàn bộ khác biệt Grab ↔ ShopeeFood trong prototype:**

| Điểm khác | Grab | ShopeeFood |
|---|---|---|
| Nhãn cột tổng tiền | **Tổng tiền** | **Thực nhận** |
| Dòng hoa hồng | *Hoa hồng Grab* | *Hoa hồng ShopeeFood* |
| Sau khi bấm **Xác nhận** | tiếp tục **in phiếu** | **chỉ toast** *"Đơn hàng {mã} đã được xác nhận"* rồi dừng, **không in** |
| Breadcrumb *‹ Quay lại màn hình chính (Sơ đồ món)* | có | **ẩn** |
| Tên đối tác | `GF-Grabfood` | `SF-ShopeeFood` |
| Màu thương hiệu | xanh lá | cam |

⇒ Khác biệt thực chất **chỉ nằm ở khối tiền và việc in phiếu**. Mọi thứ còn lại đã dùng chung.

**Thông báo đơn mới (chung 2 kênh):** *"Có đơn hàng {mã} gửi từ {Grabfood|ShopeeFood}. Bấm vào đây để xác nhận đơn hàng của khách hàng."* → bấm mở màn `orderonline`.

**Menu kênh trong prototype:** *Đặt giao hàng từ 5Food · Đặt giao hàng trên Web · **Giao hàng từ Grab** · **Giao hàng từ ShopeeFood** · Mời khách hàng sử dụng 5Food · Đặt chỗ từ 5Food* — cộng 2 chỉ báo *Khách hàng chưa đồng bộ* / *Hóa đơn chưa đồng bộ*.

### ✅ `WBE`→`POS-D1` — Luồng màn hình (BA chốt 28/07)

> Nguyên văn BA: *"màn giao hàng từ shopeefood sẽ quản lý toàn bộ đơn của shopeefood. khi nhấn xác nhận xong đơn vào sổ giao hàng, vào tab đã xác nhận của giao hàng từ shopeefood và tab chờ giao hàng của danh sách order. nhưng chờ xác nhận thì nằm ở mỗi màn giao hàng từ shopeefood thôi"*

| Trạng thái đơn | Màn *Giao hàng từ ShopeeFood* | *Sổ giao hàng* | *Danh sách order* |
|---|---|---|---|
| **Chờ xác nhận** | ✅ tab *Chưa xác nhận* | ⛔ **không hiện** | ⛔ không hiện |
| **Sau khi Xác nhận** | ✅ tab *Đã xác nhận* | ✅ có | ✅ tab *Chờ giao hàng* |

⇒ Khớp `[CMT-HP] C5`: `M_ASSIGNED` + `M_RECEIVED` **không liệt kê ở Sổ giao hàng**. Đóng `XD-10`.

## 1b. 🔑 Prototype đang chứa **CẢ HAI** thiết kế tab

| Màn | Bộ tab trong code | Ứng với |
|---|---|---|
| `DeliveryView` (Giao hàng từ Grab / ShopeeFood / Sổ giao hàng) | `unconfirmed` · `confirmed` · `completed` → **3 tab**: *Chưa xác nhận · Đã xác nhận · Đã hoàn thành* | ✅ `[DOC-MAP]` + quyết định `XD-02` (BA chốt 3 tab) |
| `OrderOnlineView` (hộp đơn mới) | `unconfirmed` · `processing` · `processed` · `completed` · `cancelled` → **5 tab** | ❌ `DEC-CHANNEL-01` (25/07) — thiết kế **đã bị hủy** |

⇒ Giải thích vì sao trước đây mô tả lệch nhau: hai màn trong cùng một bản dựng theo **hai thiết kế khác thời điểm**. Theo `XD-02`, **`DeliveryView` 3 tab là chuẩn**.

📌 **Phát hiện thêm:** Sổ giao hàng có **tab con lọc theo đối tác**: `Tất cả` · `ShopeeFood` · **`AhaMove`** — AhaMove là kênh thứ ba **chưa hề có trong specs**.

## 2. Bộ tab màn *Giao hàng từ ShopeeFood*

`Chưa xác nhận` · `Đã xác nhận` · `Đã hoàn thành` · `Đã huỷ` — **4 tab** (prototype đã có sẵn tab *Đã huỷ*) → đóng `XD-09`: **có tab Đã huỷ riêng**, không trộn vào *Hoàn thành*.

Bộ lọc kèm theo: `Đối tác:` + `Tất cả` · ô tìm *"Tìm kiếm mã đơn, SĐT, khách hàng"* · nhãn `Lấy tại quán` cho đơn khách tự lấy.
Rỗng: *"Không có đơn hàng nào trong danh sách"* / *"Không tìm thấy đơn hàng nào — Thay đổi bộ lọc hoặc thêm đơn hàng giả lập để thử nghiệm."*

## 3. Nhãn tiếng Việt cho từng trạng thái ShopeeFood `[PROTO-POS]`

| Trạng thái SPF | Nhãn prototype |
|---|---|
| `M_ASSIGNED` | **Đã đẩy đơn về quán** |
| `M_RECEIVED` | **Quán đã nhận đơn** |
| `CONFIRMED` | **Quán đã xác nhận đơn** |
| `ASSIGNING_DRIVER` | **Đang tìm tài xế** |
| `DRIVER_IN_CHARGED` | **Tài xế đã nhận đơn** |
| `PICKED` | **Tài xế đã lấy hàng** |
| `DELIVERED` | **Giao hàng thành công** |
| `M_OUT_OF_SERVICE` | **Quán không thể phục vụ đơn hàng** |
| `CANCELLED` | **Đơn hàng đã bị hủy** |

📌 Prototype **đã có** `DRIVER_IN_CHARGED` — khớp `[DOC-MAP]` và khớp PDF API (`INCHARGED = DRIVER_IN_CHARGED = 10`). ⇒ `XD-04` đóng hoàn toàn; chỉ `modules/03` là thiếu.

## 4. Chi tiết đơn — các khối

**Khối *Thông tin order*:** Thời gian đặt · Ghi chú đơn hàng (*"Không có ghi chú"*) · `Kênh đẩy về` · `Trạng thái hiện tại`
**Khối *Đối tác giao hàng*:** `Tài xế nhận giao hàng` · `Số điện thoại:` (*Chưa cập nhật*) · `Biển số xe:` · rỗng thì *"Chưa có thông tin tài xế — Đơn hàng đang chờ hệ thống phân công tài xế."*
⚠️ Mâu thuẫn `DEC-CHANNEL-01` (chốt 25/07) vốn ghi *"KHÔNG có tab Đối tác giao hàng"* — prototype vẫn có khối này. Cần chốt lại.

**Khối tài chính** (`Xem chi tiết thanh toán`):
`Tổng tiền món` · `Giảm giá` · `Chiết khấu` · `Phí giao hàng` · `Phí đóng gói` · `Thuế khấu trừ` · **`Quán thực nhận`**
🔴 **Xung đột `XD-12`:** `modules/04` §2.2 kết luận **`phí giao hàng` / `phí đóng gói` là buyer-side, ShopeeFood KHÔNG trả về cho merchant** (`[Q&A 1206-F.7]`). Prototype vẫn hiện 2 dòng này ⇒ hoặc bỏ 2 dòng, hoặc luôn hiện "—".

**Danh sách món:** `Tên món` · `Thành tiền`; tổng hiện song song `Tổng tiền` và **`Thực nhận`**.

## 5. Nút theo trạng thái `[PROTO-POS]`

| Màn | Nút thấy trong prototype |
|---|---|
| *Giao hàng từ ShopeeFood* | `Xác nhận` · `Từ chối` · `Hủy đơn` · `Hoàn tất chuẩn bị` · `Đã xong` |
| *Sổ giao hàng* | `Xác nhận` · `Từ chối` · `Hủy đơn` · **`Thu tiền`** · `Đã hoàn thành` |

⇒ Nút **Thu tiền** đã có sẵn trong prototype Sổ giao hàng → khớp `XD-01` (BA chốt CÓ nút Thu tiền).

## 6. Màn tính tiền (trong `DeliveryView`) — **có nhập phương thức thanh toán**

> BA nhắc 28/07: *"màn tính tiền có cho nhập phương thức mà?"* — xác nhận đúng.

- Phương thức: **💵 Tiền mặt · 📲 Chuyển khoản (QR) · 💳 Thẻ ATM/Visa**
- Dòng tiền: `KHÁCH PHẢI TRẢ (1)` · `KHÁCH ĐƯA (2)` · `TIỀN THỪA TRẢ KHÁCH (3)` · `KHÁCH THIẾU TÀI CHÍNH:`
- Nút làm tròn: `Đúng số tiền` · `Tròn chục nghìn` · `Tròn 50 nghìn` · `Tròn 100 nghìn` · `Tròn 500 nghìn`
- Chốt: **`ĐỒNG Ý (F9)`** · `❌ HỦY BỎ` · chặn: *"Vui lòng nhập tiền khách đưa đủ trước"*
- QR: *"QUÉT MÃ QR CHUYỂN KHOẢN (MB Bank / NAPAS)"* · Thẻ: *"QUẸT HOẶC CẮM THẺ POS"* + `Mã số giao dịch POS (Nếu có):`
- Tính năng khác: `Tự động in hóa đơn nhiệt` · `Mở ngăn kéo đựng tiền` · `Đồng bộ báo cáo thuế`
- Khối phí: `Phí dịch vụ: Gồm phí vận chuyển và phí kết nối nền tảng` · **`Chiết khấu ĐTGH (20%)`** · `Áp dụng giảm thuế GTGT` · `Khách lấy hóa đơn GTGT`
- **Xong thanh toán → toast `"Đơn hàng {mã} đã sẵn sàng giao"`** ⇒ khớp `[CMT-HP] C1` (thu tiền xong thì báo ShopeeFood đơn đã xong)

🔴 **Xung đột `XD-13`:** đơn ShopeeFood khách **đã trả tiền cho Shopee**, quán không thu tiền mặt. Nhưng màn tính tiền đang bắt **chọn phương thức + nhập tiền khách đưa + trả lại tiền thừa**. Cần chốt: với đơn SPF thì màn này ở chế độ nào.
🔴 **Xung đột `XD-14`:** `Chiết khấu ĐTGH (20%)` là **số cứng** — cùng lỗi với thẻ *Thực nhận* ở Web BE (`WBE-D1` đã bỏ tab Tổng quan vì lý do này). Hoa hồng thật khác nhau theo quán.

## 7. Lý do từ chối / hủy trong prototype

**Từ chối nhận đơn** (`Từ chối nhận đơn hàng`):
- *Nhà hàng tạm hết món trong thực đơn*
- *Quán quá tải, bận không phục vụ kịp*
- *Đã hết giờ bán hàng / chuẩn bị đóng cửa*
- *Khách hàng gọi điện báo hủy đơn*
- *Không liên hệ được với tài xế / khách hàng*

**Hủy đơn đã xác nhận** (`Hủy đơn hàng` — *"Vui lòng nhập lý do hủy bỏ đơn hàng đã xác nhận này"*), gợi ý nhanh:
- *Khách hàng yêu cầu hủy đơn* · *Nhà hàng hết món đột xuất* · *Không có tài xế giao hàng* · *Trùng lặp đơn hàng*

**Hủy order ở Sổ giao hàng:** *Quán quá đông · Nhà hàng đóng cửa · Khách đổi ý / hủy đơn · Không có tài xế · Khác*

Trường bổ sung: `Ghi chú/Lý do bổ sung (không bắt buộc):` — *"Nhập lý do chi tiết…"* · nút `Bỏ qua` / `Xác nhận hủy đơn` / `Xác nhận từ chối`
Toast: *"Đã ${hủy|từ chối} đơn hàng ${mã}"*

🔴 **Xung đột `XD-15`:** `modules/03` chốt bộ mã hợp lệ — **Từ chối** chỉ có 5 lý do (sai thực đơn · quán quá tải · quán đóng cửa · sai hoa hồng · khác) và **Hủy** chỉ có 3 (hết món · quá tải · đóng cửa). Danh sách prototype **không khớp**: có *"Khách hàng gọi điện báo hủy đơn"*, *"Không liên hệ được với tài xế"*, *"Trùng lặp đơn hàng"* — ShopeeFood **không có mã tương ứng**. Phải ánh xạ lại hoặc bỏ.

## 8. Phiếu in

| Phiếu | Tiêu đề in |
|---|---|
| Phiếu in bếp chế biến | **PHIẾU BÁO BẾP** — có `Ghi chú từ khách:` |
| Phiếu in giao hàng | **NHÀ HÀNG PHONG DÊ - PHIẾU GIAO HÀNG** / *"*** HÓA ĐƠN GIAO HÀNG KHÁCH HÀNG ***"* — có `Khách hàng` · `Điện thoại` · `Địa chỉ giao` · `DANH SÁCH MÓN GIAO HÀNG` · `TỔNG TIỀN THANH TOÁN:` · `Hình thức thanh toán:` |
| Phiếu tạm tính | **PHIẾU TẠM TÍNH** — *"Mẫu in tạm tính - Không dùng để thanh toán thực tế"* |

Toast: *"Đã nhận đơn {mã} và chuyển sang Đang xử lý"* · *"Đã chuyển đơn {mã} sang Đã xử lý"* · *"Đã in phiếu giao hàng cho đơn hàng {mã}"*

🔴 **Xung đột `XD-16`:** `BR-POS-03` chốt **ẩn nút "In tạm tính"** với đơn ShopeeFood — prototype vẫn có màn *Xem trước Mẫu in Tạm tính*.
⚠️ **`XD-17`:** toast prototype dùng từ vựng cũ (*"Đang xử lý"*, *"Đã xử lý"*) trong khi `XD-03` đã chốt bộ từ vựng mới (*Chờ chuẩn bị đơn / Chờ giao hàng / Đang giao hàng*). Phải thống nhất lại toàn bộ.

## 9. Thông báo đơn mới

`Thông báo đơn hàng` · *"Đơn hàng mới {mã}"* · rỗng: *"Không có thông báo mới."*

---

## 9b. ✅ Quyết định POS chốt 28/07

| ID | Quyết định | Ảnh hưởng |
|---|---|---|
| `POS-D1` | **Luồng màn hình** (§1b) — *Chờ xác nhận* chỉ nằm ở màn Giao hàng từ ShopeeFood; xác nhận xong thì đơn vào Sổ giao hàng + tab *Đã xác nhận* + tab *Chờ giao hàng* của danh sách order | Đóng `XD-10` |
| `POS-D2` | **4 tab cho ShopeeFood**: *Chưa xác nhận · Đã xác nhận · Đã hoàn thành · **Đã huỷ*** — Grab giữ 3 tab | Đóng `XD-02`, `XD-09`. Lý do có tab Đã huỷ: đơn SPF là đơn khách thật, cần xem **lý do hủy** và kích hoạt **in phiếu hủy bếp** (`AP-02`). Gỡ màn `OrderOnlineView` 5 tab (thiết kế cũ) |
| `POS-D3` | **Màn tính tiền giữ nguyên như đơn thường** — vẫn cho chọn Tiền mặt / Chuyển khoản (QR) / Thẻ, vẫn nhập tiền khách đưa | Đóng `XD-05`, `XD-13`. Nhân viên không phải học luồng khác. ⚠️ Rủi ro `RR-02` bên dưới |
| `POS-D4` | **Chỉ giữ lý do ShopeeFood chấp nhận.** Từ chối: *sai thực đơn · quán quá tải · quán đóng cửa · sai hoa hồng · khác*. Hủy: *hết món · quá tải · đóng cửa*. Lý do khác → nhét vào ô ghi chú tự do | Đóng `XD-15`. **Bỏ** khỏi prototype: *Khách hàng gọi điện báo hủy đơn · Không liên hệ được với tài xế/khách hàng · Trùng lặp đơn hàng · Khách đổi ý · Không có tài xế · Nhà hàng đóng cửa (trùng)* |

| `POS-D5` | **Màn tính tiền mặc định sẵn phương thức = *ShopeeFood***, vẫn cho thu ngân đổi nếu cần | Giảm thiểu `RR-02` — thu ngân chỉ cần bấm **ĐỒNG Ý (F9)** |
| `POS-D6` | **Tự động xác nhận chỉ thay cú bấm *Xác nhận*** → đơn sang **Chờ chuẩn bị đơn**. Vẫn phải bấm *Giao hàng* khi làm xong món | ⛔ **Bác bỏ `[DOC-RULE] §9`** (nhảy thẳng *Chờ giao hàng*) — vì như vậy là tự báo ShopeeFood đơn đã xong khi bếp chưa nấu, tài xế tới sớm. Đóng `XD-06` |
| `POS-D7` | **AhaMove ngoài phạm vi** — lần này chỉ làm tích hợp ShopeeFood | Không đào, không thiết kế cho AhaMove; chỉ tránh phá vỡ tab sẵn có |

| `POS-D8` | **Ẩn nút *In tạm tính*** với đơn ShopeeFood | Giữ `BR-POS-03`. Gỡ màn *Xem trước Mẫu in Tạm tính* khỏi luồng SPF. Đóng `XD-16` |
| `POS-D9` | **Thống nhất toàn bộ tên trạng thái theo bộ mới** — rà sạch *"Đang xử lý"* / *"Đã xử lý"* trong mọi toast & nhãn | Dùng: *Chờ xác nhận · Chờ chuẩn bị đơn · Chờ giao hàng · Đang giao hàng · Chờ thanh toán · Đã thanh toán · Đã hủy*. Đóng `XD-17` |
| `POS-D10` | **Bỏ khối *Đối tác giao hàng*** khỏi chi tiết đơn (BA không chọn giữ) | Thông tin tài xế nhúng thẳng vào khối *Thông tin order*, đúng `DEC-CHANNEL-01` |
| `POS-D11` | 🔴 `XD-08` **đóng — không cần thiết kế gì thêm.** `[DOC-MAP]` đã quy định nút Hủy **chỉ có ở *Chờ chuẩn bị đơn***; sang *Chờ giao hàng* / *Đang giao hàng* chỉ còn nút **Thu tiền** | Bộ nút tự khóa theo trạng thái. BA nhắc đúng 28/07 |
| `POS-D12` | **Giữ nút *Thu tiền* ngay từ *Chờ chuẩn bị đơn*** — BA chốt: *"phù hợp linh động cho nhà hàng"* | ⚠️ Kéo theo `RR-04` |
| `POS-D13` | **Trạng thái *Chờ thanh toán* (đã giao xong, chưa bấm Thu tiền) → nằm ở tab *Đã xác nhận*** | Vá `Lỗi 2`. Đơn còn việc phải làm thì phải nằm chỗ nhân viên đang nhìn; chỉ sang *Hoàn thành* khi đã đóng tiền |
| `POS-D14` | **Đơn bị từ chối (`M_OUT_OF_SERVICE`) chỉ hiển thị ở màn *Giao hàng từ ShopeeFood* (tab Đã huỷ). *Sổ giao hàng* KHÔNG quản lý trạng thái này** | Bổ sung dòng còn thiếu của `[DOC-MAP]` |

| `POS-D15` | ⛔ **`Lỗi 1` KHÔNG phải lỗi** — BA giải thích: *"khi thu tiền thì là thao tác của cả 2 giao hàng + thu tiền, tức là báo đã làm đơn xong và thông báo sang ShopeeFood cho tài xế biết, và thu tiền luôn"* | Nút *Thu tiền* ở *Chờ chuẩn bị đơn* là **lối tắt gộp 2 thao tác**, thu ngân chỉ bấm khi món đã xong. Khớp `[DOC-RULE]`: *"nhấn Thu tiền mà chưa nhấn Giao hàng = làm cả hai"* |
| `POS-D16` | **Tài xế lấy hàng khi chưa bấm *Giao hàng*** → **chỉ ghi nhận nội bộ**, lấy thời điểm tài xế lấy hàng làm thời điểm giao, tự chuyển *Đang giao hàng*. ⛔ **KHÔNG** gọi báo sang ShopeeFood | 🔒 **Bắt buộc về mặt kỹ thuật**, không phải lựa chọn: `order.ready` có sẵn lỗi `"Unable to update picked orders."` ⇒ gọi sẽ lỗi. Nút *Giao hàng* phải **tự ẩn** khi đơn đã sang *Đang giao hàng*. Vá `Hở 2` |
| `POS-D17` | **Đơn đã hủy: KHÔNG có nút *Thu tiền*.** Đơn đã bấm Thu tiền rồi mới bị ShopeeFood hủy → **giữ *Đã thanh toán*** + **nhãn đỏ *"ShopeeFood báo huỷ"*** | Vá `Hở 4`. Căn cứ: `BR-PAY-08` đơn hủy không tính doanh thu; ShopeeFood hủy đơn **không đổi trường tiền** nên số tiền hiện trên đơn là số cũ; `order.ready` trả lỗi `"Unable to update canceled orders."`.<br>⚠️ `RR-05`: đơn đã thu rồi bị hủy sẽ chuyển `REFUNDED` — tiền **không về ví quán** trong khi sổ đã ghi thu ⇒ cuối kỳ lệch. Nhãn đỏ là để kế toán trừ ra |
| `POS-D18` | **Bỏ tab *Chờ xác nhận* khỏi Sổ giao hàng** | Vá `Hở 5`. Đơn chưa xác nhận chỉ nằm ở màn *Giao hàng từ ShopeeFood* (`POS-D1`) |

| `POS-D19` | **Thông báo đơn mới**: *"Đơn ShopeeFood mới {mã} — {n} món. Bấm để xác nhận."* (kèm icon nhấp nháy) | Vá chỗ `[DOC-RULE]` để trống *"có thông báo …"*. Ngắn, thấy ngay đơn to hay nhỏ. Thay câu dài của prototype |
| `POS-D20` | **Đơn *Lấy tại quán* / *Quán tự giao*** → gắn **tag** trên dòng đơn; đơn lấy tại quán hiện thêm **Mã nhận đơn** để khách đối chiếu | Đóng `DR-Q2`. 📌 BA lưu ý: **không cần xử lý gì về tài xế** — khối thông tin tài xế đã bỏ (`POS-D10`), và **ShopeeFood sẽ không trả về các trạng thái liên quan tài xế** với loại đơn này |
| `POS-D21` | **Báo *"Quán đã nhận đơn"* ngay khi đơn về hệ thống** (tự động), không chờ nhân viên mở đơn | Đóng `XD-11`. Nhân viên vẫn phải bấm *Xác nhận* riêng — 2 mốc khác nhau.<br>⚠️ Lưu ý kỹ thuật cho dev: việc này **không được** để poller đối soát vô tình kích hoạt (`BR-PAY-05`) |
| `POS-D22` | **Đơn bị sửa bên Shopee Partner — làm đúng `[DOC-RULE]`**: toast *"đơn [{mã}] vừa được cập nhật từ shopee"* · dòng **(i)** *"Đơn hàng được cập nhật lúc {hh:mm} từ shopee partner"* · **chấm than nhỏ** cạnh món bị đổi, rê chuột/chạm hiện tooltip *"món được cập nhật lúc {hh:mm} từ shopee partner"* | Đóng edge case `[DOC-RULE]` |

### 🔬 Phân tích logic bộ trạng thái `[DOC-MAP]` (28/07)

| # | Vấn đề phát hiện | Trạng thái |
|---|---|---|
| `Lỗi 1` | Nút *Thu tiền* có ngay ở *Chờ chuẩn bị đơn* → bấm là đơn thành *Đã thanh toán* → rơi vào tab *Hoàn thành* **khi bếp chưa nấu**. Cộng `[CMT-HP] C1` (thu tiền → báo SPF đơn xong) ⇒ báo ShopeeFood đơn sẵn sàng khi chưa làm | ✅ BA chốt **giữ** (linh động) → xem `RR-04` |
| `Lỗi 2` | *Chờ thanh toán* không thuộc tab nào (tab *Đã xác nhận* chỉ gồm 3 trạng thái vận chuyển; tab *Hoàn thành* chỉ có *Đã thanh toán*) ⇒ đơn giao xong chưa đóng tiền **biến mất khỏi màn hình** | ✅ Vá bằng `POS-D13` |
| `Hở 1` | Bảng **thiếu dòng `M_OUT_OF_SERVICE`** | ✅ Vá bằng `POS-D14` |
| `Hở 2` | `PICKED` khi chưa bấm *Giao hàng* → doc ghi *"mặc định thời gian tài xế lấy hàng là thời gian giao hàng"*. **Có tự báo sang ShopeeFood không?** Tài xế đã cầm đồ đi rồi thì báo "đơn sẵn sàng" là vô nghĩa | ⏸️ còn mở |
| `Hở 3` | `ASSIGNING_DRIVER` / `DRIVER_IN_CHARGED` để trống cột CukCuk — cần ghi rõ **giữ nguyên trạng thái đang có**, chỉ cập nhật thông tin tài xế | ⏸️ còn mở |
| `Hở 4` | Đơn đã ở *Đã thanh toán* mà ShopeeFood hủy sau đó → doc không nói xử lý | ⏸️ còn mở |
| `Hở 5` | Tab *Chờ xác nhận* của **Sổ giao hàng** rỗng vĩnh viễn với đơn ShopeeFood (do `POS-D1`) ⇒ tab đó dành cho kênh khác | ⏸️ cần xác nhận |

### ⚠️ Rủi ro tồn đọng POS

| # | Rủi ro |
|---|---|
| `RR-02` | `POS-D3` giữ màn tính tiền như đơn thường ⇒ thu ngân **có thể chọn nhầm "Tiền mặt"** cho đơn khách đã trả Shopee, làm sai báo cáo quỹ tiền mặt cuối ca. Đề xuất giảm thiểu: **mặc định sẵn** phương thức = *ShopeeFood* khi mở màn (vẫn cho đổi), không để trống bắt chọn |
| `RR-03` | `POS-D4` bỏ lý do *"Khách hàng gọi điện báo hủy đơn"* — đây là tình huống **có thật và hay gặp**. Thu ngân sẽ phải chọn một lý do không đúng bản chất (vd *quán quá tải*) ⇒ số liệu hủy đơn gửi ShopeeFood bị méo. Cần theo dõi và có thể xin ShopeeFood bổ sung mã |

## 9c. 📌 Phí ShopeeFood trả về — tra cứu dứt điểm (28/07)

| Nhóm | Field | Tình trạng |
|---|---|---|
| **Phí của khách** (khối `customer_bill` trong `order.get_details`) | `total_amount` · `shipping_fee` · `packing_fee` · `service_fee` · `surcharge_fee` · `hand_deliver_fee` · `vat_deliver_fee` · `confirm_fee` · `merchant_discount` · `foody_discount` · `total_discount` | 🔴 Schema có, **thực tế nhiều khả năng KHÔNG trả về**: `[Q&A 1206-F.7]` nói thẳng không trả; sample không có; changelog không có mục thêm ⇒ `Q-PAY-B` |
| **Tiền quán** | `order_value` · `merchant_price` (mỗi món) · `total_merchant_discount` · `merchant_discounts[]` · `pay_to_merchant{type,status}` | 🟢 Chắc chắn có |
| **Tiền quán** | `tax_fee` | 🟢 Có — nhưng **chỉ ở `order.get_list`** |
| **Tiền quán** | `commission_amount` | 🟡 Schema có, **chưa thấy trong dữ liệu mẫu** ⇒ `Q-PAY-B` |
| — | `extra_fee` | 🔴 Tài liệu **không định nghĩa** |

⇒ Chưa chốt được `XD-12` / `XD-14` cho tới khi ShopeeFood trả lời `Q-PAY-B`.

## 10. Xung đột POS còn mở sau phiên 28/07

| ID | Nội dung | Mức |
|---|---|---|
| `XD-05` | Nhấn *Giao hàng* → mở màn tính tiền? (prototype: có, và màn đó cho nhập phương thức) | 🔴 |
| `XD-13` | Đơn SPF khách đã trả Shopee — màn tính tiền có bắt chọn phương thức / nhập tiền khách đưa không | 🔴 |
| `XD-14` | `Chiết khấu ĐTGH (20%)` hardcode | 🔴 |
| `XD-15` | Danh sách lý do từ chối/hủy của prototype không khớp mã ShopeeFood | 🔴 |
| `XD-12` | Khối tài chính hiện *Phí giao hàng* / *Phí đóng gói* — ShopeeFood không trả về | 🟠 |
| `XD-16` | Prototype còn *In tạm tính* dù `BR-POS-03` bảo ẩn | 🟠 |
| `XD-17` | Từ vựng trạng thái cũ/mới lẫn lộn trong toast | 🟠 |
| `XD-06` | Auto-confirm nhảy thẳng *Chờ giao hàng* | 🟠 |
| `XD-08` | Khóa nút Hủy sau khi tài xế lấy hàng | 🟠 |
| `XD-11` | `mark_as_received` — ai đánh dấu đã nhận, lúc nào | 🟠 |
| — | Khối *Đối tác giao hàng* — prototype có, `DEC-CHANNEL-01` bảo bỏ | 🟠 |
| `DR-Q2` | *"Với các shipping method khác: có nên tương tự?"* (nguyên văn `[DOC-RULE]`) | 🟢 |
