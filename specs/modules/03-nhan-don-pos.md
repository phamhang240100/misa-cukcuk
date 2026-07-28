# Module 03 — Nhận & Xử lý Đơn tại POS (ShopeeFood → CukCuk)

> Nguồn: `[API §3.1 Order, §4.1 Order Webhook, §2 Status Machine]`, `[Q&A F, 2906-7]`, `[XMIND]` (luồng POS), `[RESEARCH]` (U2/U3/U5/U7).
> Enum tham chiếu (đã đối chiếu lại PDF `[API §2]` ngày 2026-07-25):
> `OrderMerchantStatus` (SPF noti): M_ASSIGNED=5, M_RECEIVED=6, CONFIRMED=3, PICKED=1, DELIVERED=2, M_OUT_OF_SERVICE=7, CANCELLED=8, ASSIGNING_DRIVER=11.
> **Status Machine (chuẩn API):** happy flow `M_ASSIGNED → M_RECEIVED → CONFIRMED → PICKED → DELIVERED`; hủy `M_ASSIGNED → M_RECEIVED → M_OUT_OF_SERVICE → CANCELLED`.
> `OrderListStatus`: PROCESSING=1, COMPLETED=2, CANCELLED=3, CONFIRMED=4.
> `OrderUpdateStatus` (partner gửi): CONFIRM=0, OUT_OF_SERVICE=2, CANCEL=6.
> `ConfirmMethod`: **MANUAL=1, AUTO=2** — bắt buộc gửi `AUTO=2` khi POS tự động xác nhận (AC-01).
> `ShippingMethod`: FOODY_DELIVERY=1, MERCHANT_DELIVERY=2, **CUSTOMER_PICKUP=3** (nhận diện đơn khách tự lấy).
> `MerchantPaidStatus`: UN_PAID=1, PAID=2, FAIL=3, REFUNDED=4.
>
> ⚠️ **ĐÍNH CHÍNH (2026-07-25)** — trước đây spec ghi nhầm "từ chối = 79/80/81". Thực tế là **hai bộ mã cho hai hành động khác nhau**:
> | Hành động | `status` gửi lên | Trường lý do | Giá trị hợp lệ |
> |---|---|---|---|
> | **Từ chối** đơn chưa xác nhận | `OUT_OF_SERVICE=2` | `reject_reasons.type` (`RejectOrderReason`) | WRONG_MENU=1 · RESTAURANT_BUSY=2 · RESTAURANT_CLOSES=3 · WRONG_COMMISSION=4 · CUSTOM=5 |
> | **Hủy** đơn đã xác nhận | `CANCEL=6` | `cancel_reasons.reason_ids[]` (lấy từ meta, **mảng**) | **79** Quán hết món · **80** Quán quá tải · **81** Quán đóng cửa |
>
> 🔴 UI draft `pos-order-shopeefood` đang dùng 79/80/81 cho **cả** màn Từ chối → **phải sửa**.

---

# 0. ⚠️ CẬP NHẬT LỚN 2026-07-28 — đọc mục này TRƯỚC

> Nguồn mới: `[DOC-MAP]` *Bảng mapping trạng thái ShopeeFood–CukCuk* + **5 comment của Hằng Phạm** + `[DOC-RULE]` *rule cần có* (đều ngày 28/07, **mới hơn** các quyết định 24–27/07 trong file này) + prototype POS `[PROTO-POS]`.
> Chi tiết đầy đủ: `../.clarity/delta-2026-07-28.md` và `../.clarity/pos-prototype-map-2026-07-28.md`.

## 0.1 Bộ trạng thái CukCuk — THAY THẾ toàn bộ từ vựng cũ

⛔ **Bỏ**: *Chưa xác nhận · Đang xử lý · Đã xử lý · Hoàn thành · Hủy*
✅ **Dùng**: **Chờ xác nhận · Chờ chuẩn bị đơn · Chờ giao hàng · Đang giao hàng · Chờ thanh toán · Đã thanh toán · Đã hủy** (`XD-03`, `POS-D9`)

| Trạng thái ShopeeFood | Nhãn hiển thị | Trạng thái CukCuk | Nút |
|---|---|---|---|
| `M_ASSIGNED` (5) | Đã đẩy đơn về quán | **Chờ xác nhận** | — |
| `M_RECEIVED` (6) | Quán đã nhận đơn | **Chờ xác nhận** | Từ chối · Xác nhận |
| `CONFIRMED` (3) | Quán đã xác nhận đơn | **Chờ chuẩn bị đơn** (chưa bấm Giao hàng)<br>**Chờ giao hàng** (đã bấm Giao hàng)<br>**Đã thanh toán** (đã bấm Thu tiền) | Hủy · Giao hàng · Thu tiền *(khi Chờ chuẩn bị đơn)*<br>Thu tiền *(khi Chờ giao hàng)* |
| `ASSIGNING_DRIVER` (11)<br>= `ASSIGNED` = `AUTO_ASSIGN` | Đang tìm tài xế | **giữ nguyên trạng thái đang có** — chỉ cập nhật thông tin tài xế | — |
| `DRIVER_IN_CHARGED` (10)<br>= `INCHARGED` | Tài xế đã nhận đơn | **giữ nguyên** — chỉ cập nhật thông tin tài xế | — |
| `PICKED` (1) | Tài xế đã lấy hàng | **Đang giao hàng** (chưa bấm Thu tiền)<br>**Đã thanh toán** (giữ nguyên nếu đã bấm Thu tiền) | Thu tiền *(khi Đang giao hàng)* |
| `DELIVERED` (2) | Giao hàng thành công | **Chờ thanh toán** → **Đã thanh toán** | Thu tiền *(khi Chờ thanh toán)* |
| `M_OUT_OF_SERVICE` (7) | Quán không thể phục vụ đơn hàng | **Đã hủy** | — |
| `CANCELLED` (8) | Đơn hàng đã bị hủy | **Đã hủy** | — |

📌 **`DRIVER_IN_CHARGED = INCHARGED = 10` là enum CÓ THẬT** trong `[API §2]` — bản trước của file này thiếu. Prototype POS cũng đã có nhãn cho nó.

## 0.2 Quyết định lật ngược các mục đã chốt trước đó

| ID | Mục bị lật | Quyết định 28/07 |
|---|---|---|
| `XD-01` | `BR-POS-02`, `PM-01` — *"đơn ShopeeFood không có nút Thu tiền"* | 🔴 **CÓ nút Thu tiền.** *Thu tiền* = **gộp 2 thao tác**: báo ShopeeFood đơn đã xong **+** đóng đơn sang *Đã thanh toán*. Thu ngân chỉ bấm khi món đã xong (`POS-D12`, `POS-D15`) |
| `XD-02` | `DEC-CHANNEL-01` — *"5 tab riêng, KHÔNG dùng bộ 3 tab"* | 🔴 **HỦY.** Màn *Giao hàng từ ShopeeFood* dùng **4 tab**: *Chưa xác nhận · Đã xác nhận · Đã hoàn thành · Đã huỷ*. Grab giữ 3 tab (`POS-D2`) |
| `XD-06` | `AC-04` | Tự động xác nhận **chỉ thay cú bấm *Xác nhận*** → đơn sang *Chờ chuẩn bị đơn*. ⛔ **Bác bỏ `[DOC-RULE] §9`** (nhảy thẳng *Chờ giao hàng*) — như vậy là báo ShopeeFood đơn xong khi bếp chưa nấu (`POS-D6`) |
| — | `AC-02` (*Tất cả đơn / Chỉ đơn đã thanh toán*) | ⛔ **BỎ** — chỉ còn ô số phút (`WBE-D11`) |
| — | Khối *Đối tác giao hàng* | ⛔ **Bỏ** khối riêng; thông tin tài xế nhúng thẳng vào khối *Thông tin order* (`POS-D10`) |

## 0.3 Bản đồ màn hình POS (`POS-D1`, đóng `XD-10`)

| Trạng thái đơn | Màn *Giao hàng từ ShopeeFood* | *Sổ giao hàng* | *Danh sách order* |
|---|---|---|---|
| **Chờ xác nhận** | ✅ tab *Chưa xác nhận* | ⛔ **không hiện** | ⛔ không hiện |
| Sau khi **Xác nhận** | ✅ tab *Đã xác nhận* | ✅ có | ✅ tab *Chờ giao hàng* |
| **Chờ thanh toán** (đã giao, chưa thu) | ✅ tab *Đã xác nhận* (`POS-D13`) | ✅ | — |
| **Đã hủy / Từ chối** | ✅ tab *Đã huỷ* | ⛔ **Sổ giao hàng KHÔNG quản lý** (`POS-D14`) | — |

- Khớp `[CMT-HP] C5`: `M_ASSIGNED` + `M_RECEIVED` **không liệt kê ở Sổ giao hàng**.
- **Bỏ tab *Chờ xác nhận* khỏi Sổ giao hàng** (`POS-D18`) — với đơn ShopeeFood tab đó rỗng vĩnh viễn.
- 🔑 Trong prototype, **Grab và ShopeeFood dùng chung một màn** (`DeliveryView`), chỉ khác: nhãn tổng (*Tổng tiền* ↔ **Thực nhận**), dòng hoa hồng, và ShopeeFood **không in phiếu** sau khi Xác nhận.

## 0.4 Rule mới

| # | Rule |
|---|---|
| `POS-D11` | **Nút *Hủy* chỉ có ở *Chờ chuẩn bị đơn***. Sang *Chờ giao hàng* / *Đang giao hàng* chỉ còn *Thu tiền* ⇒ ràng buộc F7 (cấm hủy sau khi tài xế lấy hàng) **tự thỏa mãn**, không cần thiết kế thêm |
| `POS-D16` | Tài xế lấy hàng khi **chưa bấm *Giao hàng*** → **chỉ ghi nhận nội bộ** (lấy thời điểm tài xế lấy hàng làm thời điểm giao), tự chuyển *Đang giao hàng*. ⛔ **KHÔNG** gọi báo sang ShopeeFood.<br>🔒 Bắt buộc kỹ thuật: `order.ready` có sẵn lỗi `"Unable to update picked orders."` Nút *Giao hàng* phải **tự ẩn** khi đơn đã sang *Đang giao hàng* |
| `POS-D17` | **Đơn đã hủy: KHÔNG có nút *Thu tiền*.** Đơn đã bấm Thu tiền rồi mới bị ShopeeFood hủy → **giữ *Đã thanh toán*** + **nhãn đỏ *"ShopeeFood báo huỷ"***.<br>⚠️ `RR-05`: đơn đó sẽ chuyển `REFUNDED` — tiền **không về ví quán** trong khi sổ đã ghi thu ⇒ cuối kỳ lệch, nhãn đỏ là để kế toán trừ ra |
| `POS-D19` | **Thông báo đơn mới — dùng nguyên văn XMind cũ** *(sửa 28/07, thay câu tôi tự đề xuất)*:<br>· Cạnh tên menu hiện **số đơn chưa xác nhận**: `Giao hàng từ ShopeeFood (6)`<br>· Đơn mới về → thông báo trên màn hình: ***"Khách hàng A vừa đặt 1 đơn hàng qua ứng dụng ShopeeFood. Bấm vào để xác nhận đơn hàng"***<br>· Bấm vào thông báo → mở `Giao hàng từ ShopeeFood \ Tab Chưa xác nhận \ Thông tin đơn hàng`<br>· Danh sách đơn **sắp theo thời gian đặt, từ xa đến gần** |
| `POS-D26` | **Trong Sổ giao hàng và tab Chờ giao hàng của Order**, đơn ShopeeFood hiển thị **như mọi đơn giao hàng khác**, chỉ khác: hiện **mã đơn ShopeeFood thay cho số order**, và **logo ShopeeFood thay cho số điện thoại khách** *(nguyên văn XMind cũ)* |
| `POS-D20` | Đơn **Lấy tại quán** / **Quán tự giao** → gắn **tag** trên dòng đơn; đơn lấy tại quán hiện thêm **Mã nhận đơn**.<br>📌 Không cần xử lý gì về tài xế — ShopeeFood **không trả về trạng thái liên quan tài xế** với loại đơn này (đóng `DR-Q2`) |
| `POS-D21` | Báo ***"Quán đã nhận đơn"* ngay khi đơn về hệ thống** (tự động), không chờ nhân viên mở đơn. Nhân viên vẫn bấm *Xác nhận* riêng — 2 mốc khác nhau. ⚠️ Không được để poller đối soát vô tình kích hoạt (`BR-PAY-05`) |
| `POS-D22` | **Đơn bị sửa bên Shopee Partner**: toast *"đơn [{mã}] vừa được cập nhật từ shopee"* · dòng **(i)** *"Đơn hàng được cập nhật lúc {hh:mm} từ shopee partner"* · **chấm than nhỏ** cạnh món bị đổi, rê chuột/chạm hiện *"món được cập nhật lúc {hh:mm} từ shopee partner"* |
| `POS-D3` | **Màn tính tiền giữ nguyên như đơn thường** (vẫn có Tiền mặt / Chuyển khoản QR / Thẻ), nhưng **mặc định sẵn phương thức = *ShopeeFood*** (`POS-D5`) — thu ngân chỉ cần bấm **ĐỒNG Ý (F9)**.<br>⚠️ `RR-02`: nếu để trống bắt chọn, thu ngân dễ chọn nhầm *Tiền mặt* → sai quỹ tiền mặt cuối ca |
| `POS-D4` | **Lý do từ chối / hủy — chỉ giữ lý do ShopeeFood chấp nhận.** Từ chối: *sai thực đơn · quán quá tải · quán đóng cửa · sai hoa hồng · khác*. Hủy: *hết món · quá tải · đóng cửa*. Lý do khác → ô ghi chú tự do.<br>⛔ **Bỏ** khỏi prototype: *Khách hàng gọi điện báo hủy đơn · Không liên hệ được với tài xế/khách hàng · Trùng lặp đơn hàng · Khách đổi ý · Không có tài xế*.<br>⚠️ `RR-03`: *"khách gọi báo hủy"* là tình huống có thật và hay gặp — thu ngân sẽ phải chọn lý do sai bản chất ⇒ số liệu hủy gửi ShopeeFood bị méo. Cân nhắc xin ShopeeFood bổ sung mã |
| `POS-D8` | **Ẩn nút *In tạm tính*** với đơn ShopeeFood — giữ `BR-POS-03` |
| `POS-D27` | 🔴 **GIỮ dòng *Còn phải thu*** trên màn tính tiền của đơn ShopeeFood (BA chốt 29/07).<br>⛔ **Lật `BR-POS-02`** — quyết định 24/07 "bỏ dòng Còn phải thu" **không dùng nữa**. Màn tính tiền thật (ảnh BA gửi, đơn SPF-104) có đủ: *Tổng thanh toán · Voucher · Điểm · Chiết khấu ĐTGH · **Còn phải thu*** |
| `POS-D28` | **Chiết khấu đối tác giao hàng lấy theo mức ShopeeFood đang áp cho cửa hàng**, cho phép quản lý sửa (BA chốt 29/07).<br>⛔ **Không ghi cứng 20%** — đóng `XD-14`. Nguồn: nhánh *Danh mục Đối tác giao hàng* của XMind cũ ghi *"tự động lấy chiết khấu theo ShopeeFood đang chiết khấu của cửa hàng và cho phép QL sửa chiết khấu"* |
| `POS-D29` | **Màn Chi tiết thanh toán** (mở từ nút ba chấm ở dòng *Thực nhận* trong chi tiết đơn) — chuẩn theo ảnh BA gửi, đơn SPF-0040:<br>· Nhóm tiền của khách: `Tổng tiền món` · `Giảm giá` (đỏ, dấu trừ) · `Chiết khấu` · `Phí giao hàng` · `Phí đóng gói`<br>· Nhóm ShopeeFood khấu trừ: `Hoa hồng ShopeeFood` (dấu trừ) · `Thuế khấu trừ`<br>· Kết quả: **`QUÁN THỰC NHẬN`**, in đậm, tách bằng đường kẻ<br>✅ Kiểm chứng bằng số trong ảnh: 95.000 − 5.000 − 0 − 3.000 − 0 = **87.000** khớp *QUÁN THỰC NHẬN*<br>⚠️ **Đính chính `XD-12`:** màn thật **CÓ hiển thị** `Phí giao hàng` và `Phí đóng gói` (ảnh cho số cụ thể 12.000). Kết luận trước đó "không hiển thị 2 khoản này" là **sai** |
| `POS-D30` | **Chi tiết đơn ở tab Chưa xác nhận** — chuẩn theo ảnh: mã đơn màu cam kèm **nhãn phương thức giao hàng** (*Lấy tại quán* / *Quán tự giao* / *ShopeeFood giao*) · thời gian đặt dạng `02:30 CH - 18/06/2026` · bảng món 3 cột `Tên món · SL · Thành tiền` · dòng tổng **Thực nhận** + nút ba chấm · hai nút **Từ chối** / **Xác nhận** |
| `POS-D23` | 🖨 **Bấm *Xác nhận* → IN PHIẾU BẾP LUÔN** (BA chốt 28/07).<br>⚠️ Prototype đang làm **ngược**: với kênh ShopeeFood chỉ hiện thông báo *"Đơn hàng {mã} đã được xác nhận"* rồi dừng, **không in** (khác Grab vốn có in) ⇒ **phải sửa prototype** |
| `POS-D24` | 🖨 **Bấm *Giao hàng* → IN PHIẾU GIAO HÀNG LUÔN** (BA chốt 28/07) |
| `POS-D25` | **Hộp thoại *Hủy order*** *(chuẩn theo ảnh BA gửi 28/07)*:<br>· Tiêu đề **Hủy order**<br>· Nội dung ***"Bạn có chắc chắn muốn hủy order {mã đơn} không?"***<br>· ***Lý do hủy*** **\*** (dấu sao đỏ = **bắt buộc**) → danh sách chọn, mặc định ***Hết món ăn***<br>· Nút **CÓ** / **KHÔNG**<br>⚠️ Prototype có sẵn hộp này nhưng **chưa nối dây** (không mở được) ⇒ phải nối lại |

## 0.5 Còn treo — chờ ShopeeFood

| Mã | Nội dung | Chặn |
|---|---|---|
| 🔴 `Q-PAY-B` | Đơn thật có trả `commission_amount` / khối phí của khách không | Toàn bộ **khối tiền** trên POS (`XD-12`, `XD-14`) |
| 🔴 `Q-PAY-A` | Xác nhận công thức tiền quán thực nhận không trừ khuyến mại 2 lần | Dòng *Quán thực nhận* |
| 🔴 `SPF-B1` | Thời điểm thông tin tài xế về CukCuk (hỏi 29/06, chưa trả lời) | Hiển thị tài xế |

⚠️ **`XD-12`** — khối tiền prototype đang có dòng *Phí giao hàng* / *Phí đóng gói*, nhưng đây là **phí của khách trả Shopee**, `[Q&A 1206-F.7]` nói **không trả về cho merchant**.
⚠️ **`XD-14`** — prototype ghi cứng **Chiết khấu ĐTGH (20%)**; hoa hồng thật khác nhau theo quán ⇒ **không được hardcode**.

---

## 1. Kiến trúc nhận tín hiệu (webhook → xử lý)

```mermaid
sequenceDiagram
    autonumber
    participant SPF as ShopeeFood
    participant WH as CukCuk Webhook /update_order
    participant Q as Queue (async)
    participant CC as CukCuk BE
    participant POS as Màn POS

    SPF->>WH: POST /update_order (order_code, update_type, restaurant_id, status, pick_time, notes)
    WH-->>SPF: 200 OK NGAY (ack, reply empty)
    WH->>Q: Đẩy event vào queue
    Note over Q: Idempotency — bỏ qua nếu order_code+status đã xử lý
    Q->>CC: order.get_details(order_code) [Bearer token store]
    CC->>POS: Tạo/cập nhật đơn theo trạng thái → hiển thị đúng tab
    CC->>POS: Thông báo (chuông/popup) nếu đơn mới
```

**Rule kiến trúc `[RESEARCH]` U3:**
- AR-01: **Ack 200 OK ngay**, xử lý nghiệp vụ **bất đồng bộ** qua queue (SPF `reply: empty`).
- AR-02: **Idempotency** — lưu (order_code + status) đã xử lý; SPF retry không tạo trùng.
- AR-03: **Trạng thái chỉ tiến, không lùi** — map một chiều theo status machine, chặn cập nhật ngược.
- AR-04: `update_type`: UPDATE_ORDER=1 (đổi bất kỳ field) / UPDATE_ORDER_STATUS=2 (chỉ đổi status). Cả 2 đều → gọi `order.get_details` lấy bản mới nhất.
- AR-05: Không gửi email báo đơn cho khách với đơn đồng bộ từ ShopeeFood `[XMIND]`.

## 2. Lưới an toàn — bù đơn miss (F3, bắt buộc)
Do SPF **không gửi lại** webhook đã miss `[Q&A F.9]`:
- SG-01: **Polling `order.get_list`** định kỳ **mỗi 2–5 phút** (theo status + khoảng thời gian; params `from_date`, `last_request`, `from_item_id`, `request_count`, `sort`).
  - 🆕 **SG-01b (2026-07-27):** poller này **kiêm luôn nguồn dữ liệu tài chính** — `order.get_list` là nơi **duy nhất** trả `tax_fee` (thuế seller) và cũng trả `pay_to_merchant{type,status}`. Webhook `/update_order` **không có field tiền nào** ⇒ trạng thái trả tiền chỉ cập nhật được qua polling. Chi tiết: `04-thanh-toan-doi-soat.md` §5.
- SG-02: Đối chiếu với đơn đã có trên POS; đơn nào SPF có mà POS chưa có → **tạo bù + cảnh báo thu ngân** (popup + log).
- SG-03: Tôn trọng rate limit **25 QPS/IP**.
- 🆕 **SG-04 (UI)**: đơn được tạo bù phải gắn nhãn **"Đơn bù đồng bộ"** + popup cảnh báo thu ngân (không im lặng chèn vào danh sách).
- 🆕 **SG-05 (UI)**: POS hiển thị chỉ báo **"Mất kết nối ShopeeFood"** khi webhook/polling lỗi liên tiếp hoặc token bị thu hồi (TK6) — nếu không, nhân viên tưởng "hôm nay vắng đơn".

## 3. Vòng đời đơn & màn hình POS

```mermaid
stateDiagram-v2
    [*] --> ChuaXacNhan: Webhook M_ASSIGNED(5) + get_details
    ChuaXacNhan --> DangXuLy: Xác nhận (CONFIRM=0) → tạo order, tự gửi bếp/bar nếu bật + in tem
    ChuaXacNhan --> Huy: Từ chối (OUT_OF_SERVICE=2) + lý do (gồm hết món)
    DangXuLy --> Huy: Hủy (CANCEL=6) — CHỈ trước PICKED; đã gửi bếp → in phiếu hủy bếp
    DangXuLy --> DaXuLy: Đơn tài xế giao — tài xế lấy hàng (PICKED)
    DangXuLy --> HoanThanh: Đơn tự lấy — khách đến lấy tại quán = hoàn thành
    DaXuLy --> HoanThanh: Tài xế giao xong (DELIVERED) → hóa đơn + ghi doanh thu
    HoanThanh --> [*]
    Huy --> [*]
```

> ⛔ **PHẦN DƯỚI ĐÂY (5 tab + DEC-CHANNEL-01) ĐÃ BỊ THAY THẾ ngày 2026-07-28 — xem §0.2, §0.3.** Giữ lại để tra cứu lịch sử quyết định, **không dùng để build**.

**~~5 tab danh sách~~** `[XMIND]`, `[API OrderListStatus]`:
| Tab | Gồm | Cột hiển thị |
|---|---|---|
| Chưa xác nhận | Đơn SPF mới về, chưa xác nhận (`M_ASSIGNED`) | Mã ShopeeFood · Số món · Tổng tiền · Thời gian đặt |
| Đang xử lý | Đã xác nhận, đang làm món (`CONFIRMED`) — gồm cả bước báo món xong | như trên |
| Đã xử lý | **Đơn tài xế giao** đã được tài xế lấy, đang giao (`PICKED`) | như trên |
| Hoàn thành | Đã giao xong (`DELIVERED`); đơn tự lấy: khách lấy xong vào thẳng đây | như trên |
| Hủy | Đơn từ chối / hủy / SPF hủy (`CANCELLED`) | như trên + lý do |

### ~~DEC-CHANNEL-01~~ — ⛔ **ĐÃ HỦY 2026-07-28** (xem §0.2 `XD-02`)
> ~~Tách kênh ShopeeFood (chốt 2026-07-25, BA)~~ — thay bằng **4 tab** ở §0.3. Nội dung dưới giữ để tra cứu.

- **Màn Order Online tách theo kênh**: ShopeeFood / Grab / (chừa khung kênh sau). Khớp chỉ đạo sếp `[Review #9]`.
- **Kênh ShopeeFood dùng bộ 5 tab riêng ở trên**, KHÔNG dùng chung bộ 3 tab (*Chưa xác nhận / Đã xác nhận / Đã hoàn thành*) của màn Order Online hiện hành — lý do: SPF có các trạng thái mà kênh cũ không có, đặc biệt:
  - `PICKED` (**tài xế đã lấy hàng**) — mốc **khóa nút Hủy** (F7), bắt buộc phải nhìn thấy được ở cấp tab chứ không chỉ badge trong dòng;
  - `CANCELLED` phải tách khỏi *Hoàn thành* vì cần hiển thị **lý do hủy** và kích hoạt **in phiếu hủy bếp** (AP-02).
- **Grab giữ nguyên 100% luồng + 3 tab cũ**, không đụng vào.
- Danh sách hiển thị bên trái, **chi tiết đơn bên phải** khi chọn dòng `[XMIND]`.
- **Không có tab "Đối tác giao hàng"** trong pane chi tiết đơn SPF (chốt 2026-07-25) — thông tin tài xế nhúng thẳng vào khối *Thông tin order*, kèm trạng thái **"Đang tìm tài xế"** khi SPF chưa gán (`ASSIGNING_DRIVER=11`).

## 4. Chi tiết đơn & thao tác
**Thông tin đơn** `[XMIND]`, `[API order.get_details]`: Mã ShopeeFood, thời gian đặt, ghi chú; danh sách món (Tên · Đơn giá · SL · Thành tiền · ghi chú món), topping theo món.

**Thao tác theo trạng thái:**
| Trạng thái | Nút | Hành động |
|---|---|---|
| Chưa xác nhận | **Xác nhận** | CONFIRM=0 → tạo order, sang **Đang xử lý**; nếu *tự động gửi bếp/bar* bật → tự **gửi bếp/bar + in tem** (tắt → nút *Gửi bếp/bar* thủ công) |
| Chưa xác nhận | **Từ chối** | `status=OUT_OF_SERVICE(2)` + `reject_reasons.type` ∈ **{1 sai thực đơn, 2 quán quá tải, 3 quán đóng cửa, 4 sai hoa hồng, 5 khác}** → sang **Hủy**. ⚠️ KHÔNG dùng 79/80/81 ở đây |
| Đang xử lý | **Bàn giao tài xế** / **Đã làm xong** | Món xong: đơn tài xế giao → *Bàn giao tài xế* (`order.ready` + in phiếu bàn giao mã rút gọn); đơn khách tự lấy → *Đã làm xong* (`order.ready`, khách đối chiếu mã) |
| Đang xử lý | **Hủy đơn** | ⛔ CHỈ bật khi **chưa PICKED** (F7). `status=CANCEL(6)` + `cancel_reasons.reason_ids[]` ∈ **{79 hết món, 80 quá tải, 81 đóng cửa}** (chọn được nhiều). Nếu có **79** → bắt buộc kèm `out_of_stock.dishes[]` (≥1 món + `from`/`to`). Đã gửi bếp → **in phiếu báo hủy bếp** (AP-02) |
| — | ⛔ ~~*(không có nút Thu tiền)*~~ — **ĐÃ LẬT 28/07, xem §0.2 `XD-01`: CÓ nút Thu tiền** | ~~Đơn ShopeeFood không thu tiền tại quầy.~~ `DELIVERED` → **tự Hoàn thành + in hóa đơn/HĐĐT + ghi doanh thu**. Đơn tự lấy hoàn thành khi khách xác nhận / SPF auto sau ~60'. Trạng thái trả tiền chỉ hiển thị theo `pay_to_merchant.status`. |

### 🆕 BR-POS-01..04 — Khác biệt bắt buộc so với màn Order Online hiện hành
> Rút ra khi đối chiếu ảnh chụp sản phẩm thật (2026-07-24). Đây là **rule chặn**, không phải gợi ý.

| # | Rule | Lý do |
|---|---|---|
| BR-POS-01 | ⛔ **Ẩn/disable nút "Thêm món" và nút ✕ xóa món** trên chi tiết đơn ShopeeFood. POS chỉ được sửa **tên món hiển thị cục bộ**; SL/giá/topping **không** sửa | E7, F4, `[Q&A 2906-6]` |
| ~~BR-POS-02~~ | ⛔ **ĐÃ LẬT HOÀN TOÀN (29/07)** — xem `POS-D27`, `POS-D28` ở §0.4. **GIỮ dòng *Còn phải thu***; khối tài chính **không** còn là chỉ-đọc vì đã có nút *Thu tiền*. Nội dung gốc (không dùng nữa):<br>~~⛔ Bỏ dòng "Còn phải thu" với đơn SPF~~ — con số này là *tiền khách trả SPF*, không phải tiền quán nhận → gây hiểu nhầm khi đối soát. Thay bằng **khối chỉ-đọc**: *Khách trả Shopee* / *Quán thực nhận (sau HH/thuế/KM)* + badge *Chờ đối soát / Đã nhận vào ví*.<br>⚠️ **Điều kiện (2026-07-27):** dòng *Khách trả Shopee* lấy từ `customer_bill.total_amount` — **chưa chứng minh được là SPF có trả về** (`[Q&A 1206-F.7]` nói khoản buyer-side không trả cho merchant; sample API cũng không có block này) ⇒ **phụ thuộc Q-PAY-B**; nếu SPF xác nhận không có thì **bỏ dòng này**, chỉ giữ *Tiền món (giá khách thấy)* = `order_value`. Field-level + layout: `04-thanh-toan-doi-soat.md` | PM-01…PM-05 |
| BR-POS-03 | ⛔ **Ẩn nút "In tạm tính"** với đơn SPF — tạm tính là nghiệp vụ đơn tại quán | chốt 2026-07-24, `[Review T-B3]` |
| BR-POS-04 | POS **không có nút "Hoàn thành"** cho đơn khách tự lấy — hoàn thành do SPF chốt (khách xác nhận / auto ~60'). POS chỉ hiển thị trạng thái *Chờ khách đến lấy* + **Mã nhận đơn** | memory 2026-07-24 |

### 🆕 §4b — Hết món & các trường đi kèm `order.update`

> ⚠️ **ĐÍNH CHÍNH (2026-07-25)**: bản trước của mục này ghi *"Báo trễ = gửi `busy_info`, không đổi trạng thái đơn"* — **SAI**.
> Đọc lại schema `order.update`: `busy_info` là **object con của `reject_reasons`**, cùng cấp với `out_of_stock` / `price_updates` / `custom_note`.
> Nó là **chi tiết đi kèm khi TỪ CHỐI/HỦY** với lý do *quán quá tải*, **không phải** thao tác giữ đơn lại và báo khách chờ thêm.
> Nút "Báo trễ" đã bị **gỡ khỏi prototype POS**.

| Thao tác | Payload | Ghi chú UI |
|---|---|---|
| **Hết món** (là một nhánh của **Hủy đơn**, không phải nút riêng) | `cancel_reasons.reason_ids=[79]` + `out_of_stock.dishes[]` (mỗi món: `order_dish_id`, `dish_id`, **`from`**, **`to`**) và/hoặc `out_of_stock.toppings[]` | Chọn lý do *Quán hết món* trong màn Hủy đơn → hiện danh sách món + khoảng giờ hết. ⚠️ **Hủy CẢ đơn**, không bỏ được từng món |
| **(kèm theo khi hủy vì quá tải)** | `reject_reasons.busy_info` = `{ total_minute, from, to }` | Chỉ là mô tả "quán bận trong bao lâu" gửi kèm lý do hủy — không có UI riêng |
| **(tham khảo)** | `reject_reasons.price_updates` cho phép đề xuất **cập nhật giá** món/topping khi từ chối | Chưa đưa vào phạm vi lần này — ghi nhận để BPMN "khách đổi món/giá" |

**Không có endpoint nào cho nghiệp vụ "đơn này sẽ chậm, giữ đơn và báo khách chờ thêm".** Hai thứ gần nhất, đều khác việc:
| Thứ có thật | Là gì | Thuộc đâu |
|---|---|---|
| `pick_time` (trong `order.update`) | Giờ tài xế đến lấy hàng. Schema cho phép gửi, nhưng **tài liệu không nói merchant có quyền đẩy giờ mới** | → `SPF-B2` 🔴 câu hỏi mở |
| `restaurant.set_restaurant_busy` | Tạm ngưng nhận đơn **cả quán** (1 hết món / 2 quá tải / 3 mất điện), tối đa đến 5h sáng hôm sau | Màn Thiết lập bên web BE — Module 02, không phải thao tác trên 1 đơn |

### 🆕 §4c — Đơn có món CHƯA GHÉP với thực đơn CukCuk (`BR-UNMAP-*`, chốt 28/07)

> Đóng `DR-Q1` — câu hỏi nhóm để mở trong `[DOC-RULE]`: *"Đơn mà bị lỗi mapping giữa SPF và CukCuk (món không có trên CukCuk) thì validate như nào??"*
> Căn cứ research 28/07: **Deliverect** — món chưa link thì đơn **fail**, nên chặn publish menu từ gốc. **Checkmate** — khi vẫn lọt, đẩy phiếu bếp *"Order Attention Required"* kèm đủ thông tin, đơn vào POS **giá trị 0đ**, bắt nhập tay; **không bao giờ tự từ chối đơn của khách**.

| # | Rule |
|---|---|
| `BR-UNMAP-01` | Đơn có món chưa ghép **vẫn được nhận về POS bình thường**. ⛔ Tuyệt đối **không** tự gửi từ chối `WRONG_MENU` — 5 nguồn phát sinh đều **không do khách gây ra**, từ chối là quán mất đơn + tụt hạng gian hàng |
| `BR-UNMAP-02` | Món chưa ghép hiển thị **nguyên tên + giá của ShopeeFood**, gắn nhãn ⚠️ **"Món chưa liên kết"**. Bếp vẫn đọc và làm được — đây là mục tiêu số 1 |
| `BR-UNMAP-03` | Đơn chứa món chưa ghép mang cờ **"Cần xử lý"** ở **cấp đơn** (thấy ngay trên danh sách, không chỉ trong chi tiết) + popup nhắc thu ngân ghép nối |
| `BR-UNMAP-04` | **Doanh thu ghi theo giá ShopeeFood** của món đó. ⛔ **Không trừ kho** (không biết định lượng nguyên liệu) → phải cảnh báo lệch kho cho chủ quán |
| `BR-UNMAP-05` | Web BE có **danh sách "Món chưa liên kết phát sinh từ đơn"** — gom mọi món lạ đã từng xuất hiện để chủ quán ghép bù một lượt |

**5 nguồn phát sinh & rule phòng ngừa** (`BR-UNMAP-P1…P5`):

| # | Nguồn | Phòng ngừa |
|---|---|---|
| `P1` | Món tạo/sửa **thẳng trên Shopee Partner App** (`CONSTRAINT-F4`) | **Dò menu ShopeeFood định kỳ** (cùng nhịp poller đơn): phát hiện món lạ → đưa vào danh sách *Món chưa liên kết* + cảnh báo Web BE **trước khi** có đơn rơi vào |
| `P2` | Món **Trùm Deal / Ăn Ngon Rẻ** do ShopeeFood tự setup | ⚠️ **Nguồn thường xuyên nhất.** `WBE-D5` bỏ id món khuyến mại khi lấy thực đơn ⇒ **bắt buộc** phải có nhánh nhận đơn cho chúng, nếu không mọi đơn deal đều gắn cờ *Cần xử lý* |
| `P3` | Món **bị xóa/ngừng bán ở CukCuk** sau khi đã đồng bộ | **Chặn xóa** món đang có liên kết ShopeeFood còn hiệu lực → *"Món này đang bán trên ShopeeFood. Xóa sẽ làm đơn mới không nhận được món."* + buộc đồng bộ lại trước |
| `P4` | Đơn về **đúng lúc đang đồng bộ menu** | Không chặn nhận đơn; đơn nhận trong cửa sổ này được đối chiếu lại sau khi đồng bộ xong, khớp được thì **tự gỡ cờ** *Cần xử lý* |
| ~~`P5`~~ | ~~Vừa hủy liên kết hàng loạt mà chưa đồng bộ lại~~ | ⛔ **BỎ (chốt 28/07)** — nghiệp vụ **không có** thao tác hủy liên kết hàng loạt. Prototype Web BE đang có hàm này (`handleBulkUnlink` + toast *"Đã huỷ liên kết hàng loạt thành công cho {n} bản ghi!"*) → **phải gỡ khỏi prototype** |
| `P5'` | Hủy liên kết **từng món** rồi chưa đồng bộ lại | Banner đỏ thường trú *"Còn {n} món chưa liên kết — đơn có món này sẽ cần xử lý tay"* + **chặn nút Đồng bộ lên ShopeeFood** cho tới khi ghép đủ |

## 5. Auto-confirm & auto-print (DEC-CONFIRM-01)
- AC-01: Mặc định **thủ công**; nếu bật *tự động xác nhận*, đặt **X phút** — quá X phút chưa thao tác → **tự xác nhận** (fallback U2). Tắt → chờ nhân viên xử lý.
- AC-02: Nếu bật auto-confirm → 2 lựa chọn: **Tất cả đơn** / **Chỉ đơn đã thanh toán** `[XMIND]`.
- AP-01: **🆕 Tự động gửi bếp/bar** (chốt 2026-07-24): ngay khi đơn xác nhận → tự gửi bếp/bar + in tem bếp; tắt → nhân viên bấm *Gửi bếp/bar*. (Thay cho ~~Tự động in hóa đơn tạm tính~~ — **đã bỏ**: tạm tính là nghiệp vụ đơn tại quán, không áp cho đơn ShopeeFood.)
- AP-02 (U5): Nhận **cancel event** → nếu đơn **đã gửi bếp (đã in tem)** thì **tự in phiếu hủy** kèm mã đơn để bếp dừng nấu.
- 🆕 **AC-03**: khi POS tự xác nhận → `order.update` phải gửi **`confirm_method = AUTO(2)`**; nhân viên bấm tay → **`MANUAL(1)`** (mặc định). Giúp SPF và báo cáo phân biệt được nguồn xác nhận.
- 🆕 **AC-04 (UI)**: bật auto-confirm → thẻ đơn ở tab *Chưa xác nhận* hiện **đồng hồ đếm ngược X phút**; hết giờ đơn tự chuyển sang *Đang xử lý* kèm badge **"Tự động xác nhận"** để thu ngân biết mình không bấm.
- 🆕 **AP-03 (UI)**: khi *Tự động gửi bếp/bar* **tắt** → chi tiết đơn phải có nút **"Gửi bếp/bar"** thủ công; sau khi gửi, đơn mang trạng thái **"Đã gửi bếp"** (đây là điều kiện kích hoạt AP-02 — không có trạng thái này thì không biết có phải in phiếu hủy hay không).

## 6. Thanh toán & "tiền" trên đơn ShopeeFood ⚠️
- PM-01: Đơn SPF — **nhà hàng gần như không trực tiếp thu tiền khách** (online: khách trả SPF trước, PAID; COD: tài xế thu hộ). Nút "Thu tiền" chỉ **đánh dấu đã thanh toán**, hình thức = ShopeeFood. Xem `customer-journey.md §3`.
- PM-02: Với đơn prepaid, lấy được **trạng thái đã thanh toán** để hiển thị `[Q&A 2206-6]`.
- PM-03: Trường "Còn phải thu" bản nháp đang tính **tiền khách phải trả** ≠ tiền nhà hàng nhận. **Cả 2 công thức đã được SPF xác nhận `[Q&A 22062026-Q5]` — không cần hỏi thêm:**
  - **(a) Tiền khách phải trả** = tiền món − KM + phí giao + phí áp dụng + tip + phí khác SPF → hiển thị **tham khảo**.
  - **(b) Tiền nhà hàng thực nhận** = **tiền món − KM quán tài trợ − commission − thuế (seller tax)** → chỉ số đối soát chính.
- PM-04: Nguồn field cho (b) trong `order.get_details`: `order_value`, `merchant_price` (đã trừ phần quán tài trợ món), `merchant_discount`/`total_merchant_discount` (tiền giảm **quán chịu** cả đơn), `commission_amount`, seller tax. **Không** dùng `customer_bill` (buyer-side, không trả cho merchant) `[Q&A 22062026-Q1, 1206-F.7]`.
- PM-05: Phí được trừ **trực tiếp trên từng đơn**, không đối soát riêng `[Q&A 1206-D.2]`. Field đối soát: Commission, Tax, KM gạch giá, Prepaid, CheapMeal `[Q&A 1206-D.6]`.

## 7. Thông báo
- NT-01: Đơn mới từ SPF → thông báo (chuông + popup) tương tự đơn Grab `[XMIND]`.
- NT-02: Bấm thông báo → mở chi tiết đơn đúng tab theo trạng thái hiện tại.
- 🆕 **NT-03 (T-B1/T-B2 — "không được miss đơn")**: còn đơn SPF chưa mở → **chuông kêu + tab *Chưa xác nhận* nhấp nháy liên tục**, kể cả khi nhân viên đang ở tab *Order* / *Sơ đồ*. Chỉ tắt khi đơn đó được mở ra xem.
- 🆕 **NT-04 (Review #10 — "focus vào Món")**: mở đơn từ thông báo → tự **cuộn tới danh sách Món + highlight ~2s**, vì việc đầu tiên của nhân viên là đọc món để làm, không phải đọc thông tin khách.

## 8. Edge cases
| # | Tình huống | Xử lý |
|---|---|---|
| E1 | Webhook đến nhưng get_details lỗi/timeout | Retry có backoff; nếu vẫn lỗi, polling (§2) sẽ bù |
| E2 | Nhận webhook trùng (SPF retry) | Idempotency AR-02 bỏ qua |
| E3 | Status về không đúng thứ tự | AR-03 chỉ tiến không lùi |
| E4 | Bấm Hủy sau khi tài xế đã PICKED | Nút bị disable (F7); nếu cần hủy → xử lý qua Partner App |
| E5 | SPF tự hủy (không tìm được tài xế / quán đóng cửa) | Đơn sang Hủy + AP-02 in phiếu hủy bếp |
| E6 | Đơn bị điều chỉnh phía SPF (B3) | Nếu có UPDATE_ORDER → get_details cập nhật lại (⚠️ chờ xác nhận B3) |
| E7 | POS sửa món trên đơn | Chỉ được sửa **tên món hiển thị cục bộ**; SL/giá/topping không sửa (F4, `[Q&A 2906-6]`) → ẩn "Thêm món"/✕ (BR-POS-01) |
| 🆕 E8 | Báo hết món nhưng chưa chọn món nào | Chặn gửi — API bắt buộc `out_of_stock.dishes[]` ≥1 khi `reason_id=79` |
| 🆕 E9 | `order.ready` gọi lại lần 2 / gọi khi đơn đã PICKED, DELIVERED, CANCELLED | API trả lỗi (*"Unable to update picked/delivered/canceled/ready orders"*) → disable nút sau lần bấm đầu, hiện thông báo thay vì retry |
| 🆕 E10 | Gọi API quá dày | `error_reach_notify_limit` / `error_wait_notify_delay` → throttle phía POS, không cho bấm liên tiếp |

## 9. TODO chờ SPF (đã rút gọn sau khi rà kỹ nguồn)
- `SPF-B1` 🔴 **(mở thật)**: thời điểm thông tin tài xế về CukCuk — đã hỏi 29/06 nhưng SPF **chưa trả lời** → cần theo dõi để hiển thị shipper.

> Các mục trước đây liệt kê (A1, A2, B2, B3, B4, B5…) **đã có lời đáp** trong `[Q&A]`/`[API]` — xem PM-03/04/05, edit-order (E7), hủy (F7), polling (§2 dùng `order.get_list` sẵn có). Không hỏi lại.
> ✅ Mâu thuẫn enum lý do từ chối/hủy **đã gỡ** ngày 2026-07-25 bằng cách tra thẳng `[API §2 + order.update]` — không phải câu hỏi cho SPF.

---

## 10. 🆕 Phạm vi prototype POS (chốt 2026-07-25)

**Bắt đầu từ lúc đơn ShopeeFood đổ về** — không dựng đăng nhập server / mở ca / order tại bàn / sơ đồ phòng bàn.

| Hạng mục | Quyết định |
|---|---|
| Nền dựng | Giữ `Docs/UI/pos-order-shopeefood` (màn Order Online đứng riêng) |
| Vẫn giữ | Dải header POS (**Order · Sơ đồ · Order Online**) — **bắt buộc**, vì cần nó để demo NT-03 (nhân viên đang ở tab khác, tab *Order Online* nhấp nháy) |
| Không dựng | `Docs/UI/remix_-[hangpt]-onboarding-pc-offline-3.0` (app POS đầy đủ: login → mở ca → order → tính tiền → HĐĐT). Tab *Order Online* của bản này đang rỗng — để dành cho lần ghép thật |
| Gỡ trước khi demo | Nút demo **"⚡ Giả lập Shopee sửa đơn"** → chuyển vào panel demo riêng, không nằm cùng hàng nút nghiệp vụ |

### Checklist gap phải vá trong prototype
| | Hạng mục | Rule |
|---|---|---|
| 🔴 | Tách kênh + 5 tab riêng cho ShopeeFood | DEC-CHANNEL-01 |
| 🔴 | Sửa mã lý do: Từ chối = 1–5, Hủy = 79/80/81 | §4 |
| 🔴 | Nút "Gửi bếp/bar" thủ công + trạng thái *Đã gửi bếp* | AP-03 |
| 🔴 | In phiếu hủy bếp khi hủy đơn đã gửi bếp | AP-02 |
| 🔴 | Đơn bù đồng bộ + cảnh báo thu ngân | SG-04 |
| 🟡 | Đếm ngược X phút + badge *Tự động xác nhận* | AC-04 |
| 🟡 | Khối tài xế trong *Thông tin order* + trạng thái *Đang tìm tài xế* | DEC-CHANNEL-01 |
| 🟡 | Bỏ "Thêm món"/✕, bỏ "Còn phải thu", ẩn "In tạm tính" | BR-POS-01…03 |
| 🟡 | Đơn tự lấy: *Chờ khách đến lấy* + Mã nhận đơn, không có nút Hoàn thành | BR-POS-04 |
| 🟡 | Chỉ báo *Mất kết nối ShopeeFood* | SG-05 |
| 🟢 | Đổi nhãn nút SPF **"GIAO HÀNG" → "Bàn giao tài xế"** (hành vi = `order.ready` + in tem bàn giao) | glossary |
| 🟢 | Thống nhất tên trạng thái: dùng **"Đang xử lý"** (không dùng "Đã xác nhận") | glossary, T-A4 |
| 🟢 | Báo hết món: bổ sung chọn khoảng thời gian `from`/`to` | §4b |
