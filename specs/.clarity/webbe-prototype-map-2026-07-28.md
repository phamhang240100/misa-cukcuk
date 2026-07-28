# Bản đồ luồng Web BE — trích từ prototype (2026-07-28)

> Nguồn: `[PROTO-BE]` = `Docs/UI/remix_-[nnhai2]-kết-nối-cukcuk---shopeefood-2.0/src/components/views/ApplicationsView.tsx` (16.955 dòng, 618 chuỗi UI tiếng Việt).
> **Đây là mô tả cái prototype ĐANG CÓ, chưa phải spec.** Mục ❓ là chỗ prototype thể hiện nhưng nghiệp vụ chưa chốt / nghi vấn không có nguồn dữ liệu.

---

## A. Màn *Ứng dụng* → thẻ ShopeeFood

**Panel chi tiết ứng dụng:**
| Trường | Giá trị prototype |
|---|---|
| Tên nhà cung cấp | — |
| Phiên bản tích hợp | `v4.1.2 (Bản cập nhật 2026)` |
| Trạng thái | *Chưa kết nối* / *Đã kết nối* |
| Tài khoản kết nối | — |
| Phạm vi truy cập quyền dữ liệu (Scopes) | — |
| **Mã cấu hình Endpoint (Webhook)** | *Chưa thiết lập* |
| Bảo mật & Đồng bộ dữ liệu | — |

Nút: **Kết nối ngay** · **In cấu hình** (*"Chức năng đang tải mẫu in cấu hình…"*) · **Thêm hành động** · **Gửi phản hồi cho MISA CukCuk** (Email liên hệ + Nội dung góp ý/báo lỗi)

❓ `WBE-Q-A1` — *Mã cấu hình Endpoint (Webhook)* là gì trên thực tế? CukCuk là ISV, webhook `/update_order` do CukCuk cung cấp cho SPF, chủ quán **không** cấu hình. Ô này để làm gì / ai nhập?
❓ `WBE-Q-A2` — *Phạm vi truy cập quyền dữ liệu (Scopes)*: hiển thị scope OAuth thật, hay chỉ là văn bản trấn an? (trùng việc-cần-làm "xác nhận danh sách scope" trong `questions-for-shopeefood.md`)

---

## B. Luồng kết nối (onboarding)

### B1. Modal chặn đầu: *"Bạn đã có gian hàng trên ShopeeFood chưa?"*
→ **[Chưa có]** / **[Tôi đã có gian hàng]**

**Nhánh "Chưa có"** → modal *"Bạn cần có gian hàng ShopeeFood trước khi kết nối"*
> *"CukCuk kết nối với gian hàng ShopeeFood hiện có của quán. Nếu chưa có gian hàng, hãy đăng ký trên ShopeeFood trước."*
3 bước hướng dẫn: `Đăng ký bán hàng trên ShopeeFood.` → `Chờ ShopeeFood xét duyệt và mở gian hàng.` → `Quay lại CukCuk để kết nối.`
Nút: **[Để sau]** / **[Đăng ký trên ShopeeFood]**

### B2. Modal QR — *"Kết nối CukCuk và Shopee Partner"*
- *"Vui lòng quét mã QR để thực hiện xác thực kết nối trên Shopee Partner"*
- Đếm ngược: *"Mã xác thực sẽ hết hiệu lực sau {mm:ss}"* — prototype đặt **900 giây (15 phút)**
- Lưu ý: *"Mỗi gian hàng trên đối tác chỉ kết nối tương ứng với 1 nhà hàng trên MISA CukCuk. Bạn cần đăng nhập tài khoản admin và chọn đúng quán cần tích hợp trên Shopee Partner."*
- Trạng thái quét: `idle → scanning → authorizing → success`
- Nút: **Xác nhận đã quét mã QR kết nối** → toast *"Kết nối thành công tài khoản ShopeeFood Partner!"*

❓ `WBE-Q-B1` — **900s có đúng không?** `[API-Auth]` device-code nêu `expires_in` mẫu **3600s**; prototype để 900s. Số nào là thật?
❓ `WBE-Q-B2` — Prototype dùng nút *"Xác nhận đã quét mã QR"* (người dùng tự bấm). Device-code flow chuẩn là **client tự poll** `/oauth2/token` cho tới khi được cấp. Chốt: poll tự động hay bắt bấm tay?
❓ `WBE-Q-B3` — Hết hạn mã QR thì UI làm gì? (prototype không có nhánh này — không có nút *Tạo mã mới*, không có thông báo hết hạn)
❓ `WBE-Q-B4` — Quét nhầm gian hàng đã liên kết với nhà hàng CukCuk khác → thông báo lỗi gì? (ràng buộc 1:1 chỉ được ghi ở dạng *lưu ý*, không có xử lý)

### B3. Màn *"Kết nối thành công!"*
Hiển thị: `Gian hàng:` · `Thực đơn:` · nút **Ngắt kết nối** → toast *"Đã ngắt kết nối tài khoản ShopeeFood Partner"*

### B4. Tiến trình đồng bộ ban đầu (4 bước, có progress bar)
> *"Hệ thống đang kết nối API và tải danh sách món ăn, nhóm thực đơn và sở thích phục vụ…"*

1. `Kết nối cổng dịch vụ ShopeeFood Partner`
2. `Tải dữ liệu danh sách món ăn & giá bán`
3. `Tải danh mục nhóm thực đơn & sở thích phục vụ`
4. `Chuẩn bị dữ liệu liên kết 4 bước`

→ *"Môi trường kết nối hoàn tất!"* — hiện `Tên cửa hàng:` · `Số tài khoản:` · `Trạng thái đồng bộ: Chính thức`
→ nút **Bắt đầu Đồng bộ dữ liệu bán hàng**

❓ `WBE-Q-B5` — 4 bước này thất bại giữa chừng thì sao? Prototype **không có nhánh lỗi nào** (không timeout, không retry, không thông báo lỗi).

---

## C. Wizard ghép nối 4 bước

| Bước | Tên | Cảnh báo còn sót |
|---|---|---|
| 1 | **Thiết lập nhóm thực đơn** | *"Còn {n} nhóm thực đơn ShopeeFood chưa có nhóm tương ứng"* |
| 2 | **Thiết lập món ăn** | *"Còn {n} món ShopeeFood chưa có món tương ứng"* |
| 3 | **Thiết lập nhóm STPV** | *"Còn {n} nhóm STPV ShopeeFood chưa có nhóm tương ứng"* |
| 4 | **Thiết lập STPV** | *"Còn {n} STPV ShopeeFood chưa có STPV tương ứng"* |

> **STPV = Sở thích phục vụ** (topping / tuỳ chọn món: độ ngọt, độ đá, size, gia vị…)

**Cột bảng ghép:** `Món ShopeeFood` · `Món tương ứng trên MISA CukCuk` · `Giá bán` · `Trạng thái ghép nối` (*Đã ghép nối* / *Chưa ghép nối*)
Với STPV: `Giá thu thêm` · `Tiền thêm trên ShopeeFood`

**Thao tác trong wizard:**
- Dropdown chọn: *"Chọn món tương ứng…"* / *"Chọn nhóm tương ứng…"* / *"Chọn STPV tương ứng…"* + ô tìm *"Tìm mã, tên món…"* + mục **`-- Bỏ chọn --`**
- **Thêm mới trực tiếp trên MISA CukCuk** (4 loại: Nhóm thực đơn · Món ăn · Nhóm STPV · STPV)
  → modal: `Nhập tên...` · `Đơn vị tính` (mặc định *Dĩa*) · `Giá bán (đ)` · `Diễn giải`
  → ghi chú: *"Dữ liệu khởi tạo sẽ được đồng bộ trực tiếp lên hệ thống quản lý và liên kết ngay lập tức."*
  → nút **Lưu & Liên kết**
- **Liên kết món nhanh** (tự ghép trùng tên):
  - *"Đã thực hiện liên kết nhanh {count} món trùng tên thành công!"*
  - *"Không tìm thấy món chưa liên kết nào trùng tên với món tại MISA CukCuk."*
  - (có bản tương ứng cho nhóm thực đơn / STPV / nhóm STPV)
- **Xóa đối chiếu** / **Hủy liên kết** → *"Đã xóa món khỏi danh sách liên kết"*
- ⛔ ~~**Huỷ liên kết hàng loạt** → *"Đã huỷ liên kết hàng loạt thành công cho {n} bản ghi!"*~~ — **BỎ (BA chốt 28/07: nghiệp vụ không có case này)**. Prototype có hàm thật `handleBulkUnlink` → **phải gỡ**. Chỉ giữ hủy liên kết **từng dòng**
- **Sao chép sang CukCuk**: *"Đã sao chép "{tên}" sang MISA CukCuk"* (có bản cho nhóm / STPV / nhóm STPV)
- **Thêm món** (từ CukCuk lên SPF): *"Tích chọn các món ăn từ danh sách món của MISA CukCuk dưới đây để đồng bộ và thêm trực tiếp vào danh sách Thực đơn ShopeeFood của nhà hàng."*
  - chặn: *"Vui lòng chọn ít nhất 1 món ăn để đồng ý!"*
  - xong: *"Đã chọn và đồng bộ thêm {n} món ăn mới thành công!"*

**Chặn chuyển bước:** *"Còn {n} món chưa được ghép nối. Vui lòng ghép nối toàn bộ thực đơn để tiếp tục."*
**Kết thúc:** *"Hoàn thành thiết lập thực đơn ShopeeFood!"* → *"Hoàn tất kết nối ShopeeFood!"* → nút **Bắt đầu bán hàng**

**Sau đồng bộ menu về:** *"Đồng bộ thực đơn từ ShopeeFood về MISA CukCuk thành công!"* + *"Hệ thống đã tự động liên kết các món dựa theo mức độ tương đồng ({x}%). Vui lòng kiểm tra, điều chỉnh giá bán nếu cần và hoàn tất liên kết tất cả các món."*
→ khớp `DEC-MAP-01` (auto fuzzy-match ~80% + user xác nhận) ✅

❓ `WBE-Q-C1` — **Bắt buộc ghép 100%** mới cho qua bước. Quán 300 món thì đây là rào rất nặng. Có cho phép *bỏ qua tạm* / *ghép sau* không?
❓ `WBE-Q-C2` — Ngưỡng "mức độ tương đồng" hiển thị là bao nhiêu %? Người dùng có chỉnh được không?
❓ `WBE-Q-C3` — 1 món SPF ghép **nhiều** món CukCuk (combo) hoặc ngược lại — prototype chỉ cho **1:1**. Chốt 1:1?
❓ `WBE-Q-C4` — `DR-Q1` (nguyên văn `[DOC-RULE]`): *"Đơn bị lỗi mapping giữa SPF và CukCuk (món không có trên CukCuk) thì validate như nào??"* — tức là đơn về mà món chưa ghép thì xử lý ra sao.
❓ `WBE-Q-C5` — `DR-Q3` (nguyên văn `[DOC-RULE]`): *"Khi get thực đơn từ ShopeeFood về thì bỏ những món có id mà thuộc nhóm khuyến mại gì ấy??"* — món Prepaid/CheapMeal có bị loại khỏi danh sách ghép không?
❓ `WBE-Q-C6` — `[DOC-RULE]`: **món không thuộc nhóm nào** → pop-up *"món cần thuộc một nhóm thực đơn cụ thể trước khi ghép. Bạn có muốn cập nhật món ngay không?"* nút **Để sau / Chỉnh sửa** — prototype **chưa có** popup này.

---

## D. Màn ShopeeFood chính — 3 tab

Header: `Ánh Dương ShopeeFood` · `Đang mở cửa` · `Đồng bộ tự động` · `4.8 / 5.0 (328 đánh giá)`
Thanh nút: **Đồng bộ lên ShopeeFood** · **Tạm ngừng nhận đơn** ⇄ **Tiếp tục nhận đơn** · **Phản hồi** · **Tính năng mở rộng** · **Ngắt kết nối** · **Quay lại danh sách**

### D1. Tab *Tổng quan*
Bộ lọc: `Hôm nay` · `Hôm qua` · `7 ngày qua` · `30 ngày qua` · nút **Làm mới dữ liệu**

| Thẻ | Nội dung |
|---|---|
| **Thực nhận (Sau phí sàn)** | phụ đề **`Đã trừ 20% phí Shopee & Khuyến mãi`** |
| Tổng số đơn hàng | + *"so với kỳ trước"* |
| Trung bình đơn (AOV) | — |
| Biểu đồ doanh thu theo khung giờ | *"Doanh thu tính theo giờ đặt đơn thực tế trên ShopeeFood"* |
| Khung giờ cao điểm (Peak Hours) | Giờ Trưa (11:00–13:30) · Giờ Tối (17:30–20:00) · Giờ Xế & Đêm (Khác) |
| Thời gian chuẩn bị | `6.5 phút / đơn` — *Đạt chuẩn* |
| Top 5 món bán chạy nhất trên ShopeeFood | + nút *Xem thực đơn* |
| Cảnh báo & Lời khuyên tối ưu gian hàng | *"2 món đang ngưng bán trên ShopeeFood"* → *"Mở lại bán món ngay →"* |
| Đánh giá gần nhất (5★) | `15 phút trước` |
| Chân trang | *"Tự động đồng bộ mỗi 5 phút từ CukCuk POS"* · *"Kết nối ổn định"* |

🔴 `WBE-Q-D1` — **`Đã trừ 20% phí Shopee & Khuyến mãi` là số cứng.** Mâu thuẫn thẳng với `modules/04` §4: thực nhận = `Σ(merchant_price×SL) − commission_amount − tax_fee`, trong đó `commission_amount` lấy từ API **theo từng đơn** và đang chờ `Q-PAY-B`. Hoa hồng còn khác nhau theo quán/ngành hàng. **Không được hardcode 20%.**
🔴 `WBE-Q-D2` — **Nguồn dữ liệu tab Tổng quan?** `[API]` không có endpoint analytics. Suy ra phải **tự tính từ đơn CukCuk đã nhận** — nhưng như vậy: đơn miss webhook sẽ làm lệch số; và `Đánh giá 4.8/5.0`, `328 đánh giá`, `Đánh giá gần nhất` **không có nguồn nào** trong API v0.0.17.
❓ `WBE-Q-D3` — *"Tự động đồng bộ mỗi 5 phút từ CukCuk POS"* — mâu thuẫn `SG-01` (polling **2–5 phút** để bù đơn miss). Là cùng một cơ chế hay hai cái khác nhau?
❓ `WBE-Q-D4` — *"Thời gian chuẩn bị 6.5 phút/đơn — Đạt chuẩn"*: chuẩn là bao nhiêu, ai định nghĩa?

### D2. Tab *Quản lý thực đơn* — 5 phân đoạn
`Thực đơn` · `Nhóm thực đơn` · `Sở thích` · `Sở thích phục vụ` · `Lịch bán món`

**Cột:** `Ảnh` · `Mã món` · `Tên món` · `Giá bán trên ShopeeFood` · `Trạng thái` · `Món tương ứng` (Đã ghép/Chưa ghép) · `Nhóm thực đơn`
**Thanh thao tác:** Sửa · Xóa món · Cập nhật ảnh · Sắp xếp thứ tự · Xuất khẩu · Tải lại (Nạp) · Hướng dẫn (Giúp) · Làm mới · **Liên kết món nhanh**

Validation đã có:
- *"Vui lòng chọn 1 món để sửa"* · *"Vui lòng chọn món để xóa"* · *"Vui lòng chọn món để cập nhật ảnh"*
- *"Vui lòng chọn 1 nhóm thực đơn để sửa"* / *"…để di chuyển"*
- *"Nhóm thực đơn đã ở vị trí đầu tiên"* / *"…cuối cùng"* (tương tự cho STPV, sở thích phục vụ)
- *"Tên nhóm thực đơn không được để trống"*

**Modal Sửa Món ăn:** Tên · Nhóm thực đơn · `Giá bán ShopeeFood` · Mô tả · `Trạng thái món` · `Ảnh đại diện` (Chọn ảnh mẫu / Tải lên tệp ảnh… / Xóa ảnh) · danh sách STPV kèm món (Khôi phục mặc định)
> Trợ giúp: *"Bạn có thể cấu hình tên món, nhóm thực đơn, giá bán và các sở thích kèm theo của món ăn trước khi đồng bộ."*

**Thiết lập nhóm STPV:** `Bắt buộc chọn nhóm sở thích phục vụ khi ghi nhận món:` **Có/Không** · `Số lượng sở thích phục vụ được chọn tối đa:` **1 loại / Nhiều loại (Tối đa: n)**

❓ `WBE-Q-D5` — Phân đoạn *Sở thích* và *Sở thích phục vụ* **khác nhau chỗ nào**? (prototype có cả hai, tên gần giống)
❓ `WBE-Q-D6` — Sửa **giá bán trên ShopeeFood** ngay tại Web BE: giá này đẩy lên SPF hay chỉ lưu nội bộ? `CONSTRAINT` nói giá **đã gồm VAT** — UI không nhắc.
❓ `WBE-Q-D7` — **Cập nhật ảnh / Sắp xếp thứ tự / Xuất khẩu**: `[API §3.5]` có hỗ trợ đẩy ảnh và `sequence/sort_type` không? Nếu không thì 3 nút này là thao tác chỉ-Partner-App (`CONSTRAINT-F4`).

### D3. Tab *Thiết lập*

**(a) Thời gian hoạt động** — `Mở cửa` / `Đóng cửa`, `Từ` – `Đến`
- **Thiết lập nhanh** → *"Áp dụng các cài đặt này cho tất cả các ngày"* → *"Đã thiết lập nhanh thời gian hoạt động thành công cho tất cả các ngày!"*
- Giới hạn: *"Tối đa 3 khung giờ hoạt động cho mỗi ngày!"* · *"Cần ít nhất 1 khung giờ hoạt động!"*
- *"Đã lưu thiết lập thời gian hoạt động thành công!"* / *"Đã hủy bỏ thay đổi thời gian hoạt động"*

**(b) Cài đặt ngày lễ / Ngày nghỉ tạm thời**
> *"Thiết lập trước những ngày nhà hàng sẽ ngừng nhận đơn trên ShopeeFood trong năm (ngày nghỉ lễ, ngày bảo trì, Tết…)."*
- Trường: `Tên kỳ nghỉ` (ví dụ: *Tết Nguyên Đán*) · `Từ ngày` · `Đến ngày`
- Rỗng: *"Chưa thiết lập ngày nghỉ lễ nào. Vui lòng thêm bên dưới."*

**(c) Khung giờ hoạt động + Nhóm thực đơn áp dụng** (= Lịch bán món)
- Trường: `Tên khung giờ` (ví dụ: *Thứ 3 Thứ 6*) · `Khung giờ hoạt động` · `Nhóm thực đơn áp dụng` · `Thứ tự`
- Chọn nhóm: `-- Chọn nhóm thực đơn --`, `(Chưa chọn nhóm)`, *Double click để sửa*, **Toàn bộ khung giờ**
- Validation: *"Vui lòng nhập tên khung giờ!"*
- Toast: *"Đã thêm khung giờ thành công!"* · *"Đã cập nhật khung giờ thành công!"* · *"Đã xóa khung giờ!"* · *"Đã lưu lịch bán món thành công!"*

**(d) Cài đặt đơn hàng**
- **Tự động xác nhận Order** — *"Hệ thống POS tự động phản hồi xác nhận đơn hàng khi nhận được Order đồng bộ từ ShopeeFood."*
- *"Tự động xác nhận sau ___ phút nếu chưa được xác nhận thủ công"*
- *"Đã lưu thiết lập cài đặt đơn hàng thành công!"* / *"Đã hủy bỏ thay đổi cài đặt đơn hàng"*

❓ `WBE-Q-D8` — **Ngày lễ/ngày nghỉ**: `[API §3.4]` chỉ có `set_operation_time_ranges` + `set_restaurant_busy` (busy tối đa **đến 5h sáng hôm sau**). Nghỉ Tết 7 ngày **đẩy lên SPF bằng cách nào**? Hay chỉ lưu nội bộ rồi CukCuk tự gọi API mỗi ngày?
❓ `WBE-Q-D9` — `[DOC-RULE]`: *"Lịch bán món nếu không cấu hình thì mặc định là 24/24"* — prototype mặc định `00:00–23:59`. Xác nhận 24/24 = `00:00–23:59`?
❓ `WBE-Q-D10` — **Giới hạn 3 khung giờ/ngày** là ràng buộc của SPF hay CukCuk tự đặt?
❓ `WBE-Q-D11` — `AC-02` nói auto-confirm có 2 lựa chọn (*Tất cả đơn* / *Chỉ đơn đã thanh toán*) — prototype **chỉ có** ô số phút, **thiếu** lựa chọn này.

### D4. Đồng bộ lên ShopeeFood
Modal **"Xác nhận đồng bộ lên ShopeeFood"**:
- *"Một số danh mục chưa được liên kết hoàn toàn"*
- `Trạng thái liên kết hiện tại:` — Nhóm thực đơn / Thực đơn / Sở thích phục vụ (STPV) / Nhóm STPV → *"Đã liên kết hết"*
- ⚠️ *"**Dữ liệu không liên kết khi đồng bộ lên ShopeeFood sẽ bị mất.** Bạn có chắc chắn muốn tiếp tục thực hiện đồng bộ không?"*
- Nút: **Đồng bộ ngay** → *"Đang tải dữ liệu thực đơn lên ShopeeFood…"*

→ khớp `CONSTRAINT-F2` (full-sync hủy diệt) ✅

### D5. Tạm ngừng nhận đơn
Modal **"Tạm ngừng nhận đơn?"**
> *"Khi tạm ngừng nhận đơn, nhà hàng của bạn trên ứng dụng ShopeeFood sẽ chuyển sang trạng thái **Đóng cửa tạm thời**. Khách hàng sẽ không thể đặt món cho đến khi bạn bật lại nhận đơn. Bạn có chắc chắn muốn thực hiện?"*
- Nút **Tạm ngừng** → *"Đã tạm ngừng nhận đơn trên ShopeeFood thành công!"*
- Bật lại → *"Đã mở nhận đơn trở lại trên ShopeeFood thành công!"*

→ khớp `DEC-PAUSE-01` ✅
❓ `WBE-Q-D12` — `set_restaurant_busy` yêu cầu **lý do** (1 hết món / 2 quá tải / 3 mất điện) và có **giới hạn tới 5h sáng hôm sau**. Prototype **không hỏi lý do, không hỏi thời hạn**. Chốt: ẩn đi chọn mặc định lý do nào, và hết hạn lúc 5h sáng thì tự mở lại hay giữ đóng?
❓ `WBE-Q-D13` — `DR-Q4` (nguyên văn `[DOC-RULE]`): *"Tạm ngưng nhận đơn: cần check lại trên shopee merchant và làm tương tự"*.

### D6. Ngắt kết nối
Nút **Ngắt kết nối** → *"Đã ngắt kết nối với ShopeeFood!"*
❓ `WBE-Q-D14` — Prototype ngắt **không có modal xác nhận** ở màn này (chỉ nhánh khác có `showUnlinkedConfirmModal`). Ngắt rồi thì: thực đơn trên SPF còn không? đơn đang chạy xử lý sao? dữ liệu ghép nối có giữ để lần sau kết nối lại không?

---

## E. ✅ Quyết định đã chốt (phiên 28/07)

| ID | Quyết định | Ảnh hưởng |
|---|---|---|
| `WBE-D1` | **Tab *Tổng quan* KHÔNG làm lần này** — bỏ khỏi phạm vi | Gỡ `WBE-Q-D1`…`D4`. Kéo theo: không cần hardcode 20% phí sàn, không cần nguồn dữ liệu đánh giá sao. Màn ShopeeFood còn **2 tab**: *Quản lý thực đơn* · *Thiết lập* |
| `WBE-D2` | **Wizard giữ bắt buộc ghép nối 100%** mới cho sang bước tiếp / cho đồng bộ lên SPF | Khớp chuẩn ngành (Deliverect chặn publish menu khi còn món chưa link). Đánh đổi: onboarding quán nhiều món sẽ lâu — chấp nhận |
| `WBE-D3` | **Đơn có món chưa ghép → VẪN NHẬN ĐƠN + gắn cờ *"Cần xử lý"*** | Xem `BR-UNMAP-01…05` bên dưới. ⛔ Không tự động từ chối đơn |
| `WBE-D4` | Viết **rule phòng ngừa cho cả 5 nguồn** phát sinh món chưa ghép | Xem `BR-UNMAP-P1…P5` |

| `WBE-D5` | **Món khuyến mại của ShopeeFood** (*Trùm Deal* / *Ăn Ngon Rẻ*): khi lấy thực đơn từ SPF về, **không lấy id của các món khuyến mại này** — chúng không xuất hiện trong danh sách ghép nối | Đóng `DR-Q3`/`WBE-Q-C5`. ⚠️ Rủi ro tồn đọng ghi ở `RR-01` |
| `WBE-D6` | **Đồng bộ thực đơn lên ShopeeFood**: chỉ **toast + banner lỗi**, không làm panel lịch sử đồng bộ | Bấm Đồng bộ → toast *"Đang đồng bộ…"*; xong → toast kết quả; lỗi → **banner đỏ trên đầu màn + nút Thử lại**. Vì đồng bộ là bất đồng bộ và **có thể fail**, banner phải nêu **món nào gây lỗi** |
| `WBE-D7` | **Không có bước "chờ ShopeeFood duyệt món"** — món tạo từ CukCuk lên là bán được ngay | Bỏ `dish.get_approval_status` khỏi thiết kế |
| `WBE-D8` | **Lịch nghỉ lễ / ngày nghỉ: nghiệp vụ khả thi** — đặt trước cả năm theo từng ngày, đến ngày đó quán tự đóng nhận đơn trên ShopeeFood | Đóng `WBE-Q-D8` |

| `WBE-D9` | **Tạm ngừng nhận đơn — bám theo UI Shopee Merchant** (BA gửi ảnh 28/07, đóng `DR-Q4`/`WBE-Q-D12`) | Xem `BR-BUSY-01…05` |
| `WBE-D10` | **Ngắt kết nối: nghiêng phương án "hỏi xác nhận + giữ nguyên dữ liệu ghép nối"** — nhưng BA yêu cầu **nghiên cứu kỹ thêm** trước khi chốt | ⏸️ chưa chốt cứng — xem `WBE-Q-D14` |
| `WBE-D11` | **Tự động xác nhận đơn: chỉ có ô số phút.** Bỏ lựa chọn *Tất cả đơn / Chỉ đơn đã thanh toán* | `AC-02` **bị hủy**. Lý do: đơn ShopeeFood gần như luôn đã thanh toán qua ví nên phân biệt không còn ý nghĩa |
| `WBE-D12` | **Sửa giá bán ShopeeFood = lưu nháp.** Chỉ có hiệu lực khi chủ quán bấm **Đồng bộ lên ShopeeFood** | Màn thực đơn phải có nhãn **"Có thay đổi chưa đồng bộ"**; cho sửa nhiều món rồi đồng bộ một lần |

| `WBE-D13` | **Chặn ngắt kết nối khi còn đơn ShopeeFood chưa hoàn thành** | *"Còn {n} đơn ShopeeFood chưa hoàn thành. Xử lý xong rồi mới ngắt kết nối được."* → bổ sung `BR-DISC-07` |
| `WBE-D14` | **Mã QR hết hạn** → làm mờ mã + nút **Tạo mã mới** | Đóng `WBE-Q-B3`. Không đóng modal, không tự sinh mã |
| `WBE-D15` | **Gian hàng đã liên kết nhà hàng CukCuk khác** → báo **rõ tên nhà hàng** đang giữ liên kết | *"Gian hàng ShopeeFood này đã liên kết với nhà hàng **{tên quán}** trên MISA CukCuk. Ngắt kết nối ở quán đó trước rồi thực hiện lại."* Đóng `WBE-Q-B4` |
| `WBE-D16` | **Popup "món chưa thuộc nhóm thực đơn"** — làm đúng như `[DOC-RULE]`, có **chặn** | Chọn món CukCuk chưa thuộc nhóm nào để ghép → popup *"Món cần thuộc một nhóm thực đơn cụ thể trước khi ghép. Bạn có muốn cập nhật món ngay không?"* — nút **Để sau** / **Chỉnh sửa** (mở thẳng form sửa món). Đóng `WBE-Q-C6` |
| `WBE-D17` | **Quét QR kết nối: hệ thống tự nhận biết**, bỏ nút *"Xác nhận đã quét mã QR kết nối"* | Nhất quán với luồng ngắt kết nối (`BR-DISC-02` — tự dò định kỳ). Người dùng quét xong là màn tự chuyển, không phải bấm thêm. Đóng `WBE-Q-B2` |

| `WBE-D18` | 🔴 **Prototype đặt tên SAI.** Hai phân đoạn phải là **Nhóm STPV** và **STPV** — không phải *"Sở thích"* / *"Sở thích phục vụ"* | Đổi nhãn 2 phân đoạn trong tab *Quản lý thực đơn* cho khớp tên bước 3–4 của wizard (*Thiết lập nhóm STPV* / *Thiết lập STPV*). Đóng `WBE-Q-D5` |
| `WBE-D23` | **Lịch bán món**: món **không đặt lịch** thì **bán theo giờ mở cửa của quán** | *"24/24"* trong `[DOC-RULE]` = *không giới hạn thêm ngoài giờ mở cửa*, **không phải** bán suốt ngày đêm. Đóng `WBE-Q-D9` |
| `WBE-D19` | **Ghép món chỉ 1–1.** Combo bán trên ShopeeFood phải có **1 món combo tương ứng** bên CukCuk | Nhất quán ràng buộc "không hỗ trợ combo" đã ghi trong specs. Đóng `WBE-Q-C3` |
| `WBE-D20` | **Lỗi khi tải thực đơn về** → báo lỗi + nút **Thử lại**, **giữ nguyên kết nối** (không bắt quét QR lại) | *"Không tải được thực đơn từ ShopeeFood. Kiểm tra kết nối mạng và thử lại."* Đóng `WBE-Q-B5` |
| `WBE-D21` | **Tự ghép chỉ khi tên trùng khớp.** Không cho chủ quán chỉnh độ chặt/lỏng, không hiện % tương đồng | ⚠️ **Sửa lại prototype**: bỏ câu *"Hệ thống đã tự động liên kết các món dựa theo mức độ tương đồng ({x}%)"*. Đóng `WBE-Q-C2`.<br>⚠️ Kéo theo: `DEC-MAP-01` trong `clarity-v1` ghi *"auto fuzzy-match ~80%"* → **bị thay** bằng ghép trùng tên tuyệt đối |
| `WBE-D22` | 📌 **Màn chỉnh sửa thực đơn KHÔNG theo prototype** — phải **giống màn chỉnh sửa thực đơn hiện hành của MISA CukCuk** (BA chốt 28/07) | Bỏ thiết kế modal *Sửa Món ăn* của prototype (`§D2`). Cần lấy đúng màn thực đơn CukCuk làm chuẩn — tham chiếu gần nhất có trong repo: `[PROTO-BE]/src/components/views/ThucDonView.tsx` |

### E3. Rule *Tạm ngừng nhận đơn* (`BR-BUSY-*`) — bám UI Shopee Merchant

> Nguồn: ảnh chụp UI Shopee Merchant do BA gửi 2026-07-28.

| # | Rule |
|---|---|
| `BR-BUSY-01` | Bấm *Tạm ngừng nhận đơn* → hiện **lựa chọn nhanh**: `30 phút` · `60 phút` · `Hết hôm nay` · `Chọn thời gian` (bản Merchant còn có mốc `15 phút` / `45 phút` / `1 giờ` — chốt bộ mốc khi dựng UI) |
| `BR-BUSY-02` | Chọn *Chọn thời gian* → hiện **Thời gian bắt đầu** và **Thời gian kết thúc** |
| `BR-BUSY-03` | Validation nguyên văn Merchant: ***"Vui lòng chọn thời gian bắt đầu sau thời gian hiện tại"*** |
| `BR-BUSY-04` | **Lý do (không bắt buộc)** — dropdown *Chọn lý do*: hết món · quá tải · mất điện.<br>⚠️ **Ràng buộc:** ShopeeFood **bắt buộc** phải có lý do ⇒ để trống thì CukCuk tự gán mặc định (đề xuất: *quán quá tải*). Cần BA xác nhận mặc định |
| `BR-BUSY-05` | ⚠️ **Ràng buộc nghiệp vụ quan trọng:** ShopeeFood **chỉ giữ trạng thái tạm ngưng tới 5h sáng hôm sau**, bất kể chủ quán chọn mốc kết thúc xa hơn. ⇒ Nếu chọn quá mốc đó, UI **phải báo trước**: *"ShopeeFood sẽ tự mở nhận đơn lại từ 5h sáng mai theo giờ mở cửa của quán."* Nghỉ dài ngày phải dùng **Lịch nghỉ lễ** (`WBE-D8`), không dùng Tạm ngừng |

### E4. Ngắt kết nối (`BR-DISC-*`) — kết quả nghiên cứu 28/07

> Nguồn: `[API-Auth]` *Authorization API for ISV Partner*, mục **3. Disconnect ISV store with SPF store**.

🔴 **Prototype đang thiết kế SAI.** Hiện tại: bấm *Ngắt kết nối* → toast *"Đã ngắt kết nối với ShopeeFood!"* — coi như xong ngay tại CukCuk.
**Thực tế: CukCuk KHÔNG tự ngắt được.** Chủ quán **bắt buộc phải xác nhận trên Shopee Partner App**, y như lúc kết nối.

| # | Rule |
|---|---|
| `BR-DISC-01` | Bấm *Ngắt kết nối* → CukCuk hiện **mã QR** để chủ quán quét bằng Shopee Partner App và xác nhận ngắt bên đó. (Tài liệu **khuyến nghị dùng QR** khi hiển thị trên máy để bàn/POS) |
| `BR-DISC-02` | Trong lúc chờ, CukCuk **tự dò mỗi 10 giây, trong tối đa 5 phút** để biết chủ quán đã xác nhận xong chưa |
| `BR-DISC-03` | Quá 5 phút chưa xác nhận → **coi như chưa ngắt**, quay về trạng thái *Đã kết nối*, báo *"Bạn chưa hoàn tất ngắt kết nối trên ứng dụng ShopeeFood Partner."* ⛔ Không được hiện "đã ngắt" khi chưa chắc |
| `BR-DISC-04` | Chủ quán có thể **ngắt thẳng trên Partner App** mà không qua CukCuk. Khi đó CukCuk chỉ phát hiện được lúc mất hiệu lực truy cập ⇒ **phải** hiện chỉ báo *"Mất kết nối ShopeeFood"* (`SG-05`), không được im lặng |
| `BR-DISC-05` | Sau khi ngắt: **giữ nguyên toàn bộ dữ liệu ghép nối** để lần sau kết nối lại không phải ghép lại từ đầu (`WBE-D10`) |
| `BR-DISC-06` | ⚠️ **Giả định cần SPF xác nhận:** ngắt kết nối chỉ thu hồi quyền truy cập — **gian hàng và thực đơn trên ShopeeFood vẫn còn, khách vẫn đặt được**, chỉ là đơn không chảy về CukCuk nữa. Tài liệu không nói rõ ⇒ ghi thành câu hỏi `Q-DISC-01` |

**Đơn đang chạy khi ngắt:** chưa có nguồn nào nói. Đề xuất chặn ngắt khi còn đơn chưa hoàn thành → cần BA chốt.

### E5. ✅ Đóng thêm nhờ `[API-Auth]`

| Điểm mở | Kết luận |
|---|---|
| `WBE-Q-B1` (900s hay 3600s) | **Prototype ĐÚNG.** `900s` = hạn của **mã QR kết nối**; `3600s` = hạn của **quyền truy cập** sau khi kết nối xong. Hai thứ khác nhau, không mâu thuẫn |

| `WBE-D24` | **Ẩn** *Mã cấu hình Endpoint (Webhook)* và *Phạm vi truy cập quyền dữ liệu (Scopes)* khỏi panel chi tiết ứng dụng | Panel chỉ giữ: tên nhà cung cấp · phiên bản tích hợp · trạng thái kết nối · tài khoản đang kết nối. Đóng `WBE-Q-A1`, `WBE-Q-A2` |

> ✅ **Web BE chốt xong ngày 2026-07-28.** Chỉ còn 1 câu phải hỏi ShopeeFood: `Q-DISC-01` (ngắt kết nối rồi thì thực đơn trên gian hàng còn không) và 1 rủi ro theo dõi `RR-01`.

### E0. ⚠️ Rủi ro tồn đọng cần theo dõi

| # | Rủi ro |
|---|---|
| `RR-01` | `WBE-D5` bỏ qua món khuyến mại. `[API §3.5]` cảnh báo lần đồng bộ sẽ **thất bại toàn bộ** nếu có *"món thường có liên quan tới món Ăn Ngon Rẻ"* bị bỏ ghép, hoặc có *"món liên quan tới Trùm Deal"* bị sửa. ⇒ Bỏ qua **món khuyến mại** thì đúng, nhưng **món thường đang dính chương trình khuyến mại** thì vẫn phải ghép và phải khóa sửa — nếu không, chủ quán bấm Đồng bộ sẽ **fail cả lần đồng bộ** mà không hiểu vì sao. Banner lỗi ở `WBE-D6` **phải nói được lý do này** |

### E1. Rule xử lý đơn có món chưa ghép (`BR-UNMAP-*`)

> Căn cứ research 28/07: **Deliverect** — món chưa link thì đơn **fail**, nên họ chặn publish menu từ gốc. **Checkmate** — khi vẫn lọt, đẩy phiếu bếp *"Order Attention Required"* kèm đủ thông tin, đơn vào POS **giá trị 0đ**, bắt nhân viên nhập tay; **không bao giờ tự từ chối đơn của khách**.
> Nguồn: help.deliverect.com (Match Products, Orders FAQ) · support.itsacheckmate.com (Order Management FAQs) · cuboh.com (Eliminate delivery order errors).

| # | Rule |
|---|---|
| `BR-UNMAP-01` | Đơn SPF có món chưa ghép **vẫn được nhận về POS bình thường**. ⛔ Tuyệt đối không tự gửi `OUT_OF_SERVICE`/`WRONG_MENU` — 5 nguồn phát sinh đều **không do khách gây ra**, từ chối là quán mất đơn + tụt hạng gian hàng |
| `BR-UNMAP-02` | Món chưa ghép hiển thị **nguyên tên + giá của ShopeeFood**, gắn nhãn ⚠️ **"Món chưa liên kết"**. Bếp vẫn đọc và làm được — đây là mục tiêu số 1 |
| `BR-UNMAP-03` | Đơn chứa món chưa ghép mang cờ **"Cần xử lý"** ở cấp đơn (nhìn thấy ngay trên danh sách, không chỉ trong chi tiết) + popup nhắc thu ngân ghép nối |
| `BR-UNMAP-04` | **Doanh thu ghi theo giá ShopeeFood** của món đó. ⛔ **Không trừ kho** cho món chưa ghép (không biết định lượng nguyên liệu) → phải có cảnh báo lệch kho cho chủ quán |
| `BR-UNMAP-05` | Web BE có **danh sách "Món chưa liên kết phát sinh từ đơn"** — gom mọi món lạ đã từng xuất hiện trong đơn để chủ quán ghép bù một lượt, thay vì ghép lẻ từng đơn |

### E2. Rule phòng ngừa theo 5 nguồn phát sinh (`BR-UNMAP-P*`)

| # | Nguồn phát sinh | Rule phòng ngừa |
|---|---|---|
| `BR-UNMAP-P1` | Món tạo/sửa **thẳng trên Shopee Partner App** (`CONSTRAINT-F4`) | **Dò menu SPF định kỳ** (cùng nhịp poller đơn): phát hiện `dish_id` lạ → đưa vào danh sách *Món chưa liên kết* + cảnh báo trên Web BE **trước khi** có đơn rơi vào |
| `BR-UNMAP-P2` | Món **Prepaid / CheapMeal** do SPF tự setup | Phụ thuộc `DR-Q3` (còn mở): nếu loại nhóm khuyến mại khỏi danh sách ghép thì **bắt buộc** phải có nhánh nhận đơn cho chúng — nếu không mọi đơn deal đều gắn cờ *Cần xử lý*. ⚠️ Đây là nguồn **thường xuyên nhất**, không được bỏ qua |
| `BR-UNMAP-P3` | Món **bị xóa/ngừng bán ở CukCuk** sau khi đã sync | **Chặn xóa** món đang có liên kết SPF còn hiệu lực → cảnh báo *"Món này đang bán trên ShopeeFood. Xóa sẽ làm đơn mới không nhận được món."* + buộc đồng bộ lại trước |
| `BR-UNMAP-P4` | Đơn về **đúng lúc đang đồng bộ menu** (race) | Trong lúc đồng bộ lên SPF: **không chặn nhận đơn**, nhưng đơn nhận trong cửa sổ này được đối chiếu lại sau khi đồng bộ xong; món khớp được thì tự gỡ cờ *Cần xử lý* |
| `BR-UNMAP-P5` | Vừa **Hủy liên kết hàng loạt** mà chưa đồng bộ lại | Sau thao tác hủy hàng loạt → banner đỏ thường trú *"Còn {n} món chưa liên kết — đơn có món này sẽ cần xử lý tay"* + **chặn nút Đồng bộ lên ShopeeFood** cho tới khi ghép đủ (nhất quán với `WBE-D2`) |

---

## F. Tổng hợp điểm mở Web BE

| Nhóm | ID |
|---|---|
**Đã đóng:** `WBE-Q-C1` → `WBE-D2` · `WBE-Q-C4`/`DR-Q1` → `WBE-D3`+`BR-UNMAP-*` · `WBE-Q-D1`,`D2`,`D3`,`D4` → **hủy** theo `WBE-D1` (bỏ tab Tổng quan)

| Nhóm | ID còn mở |
|---|---|
| 🔴 Cao | `WBE-Q-D8` (đẩy ngày nghỉ lễ lên SPF bằng API nào) · `WBE-Q-C5`=`DR-Q3` (loại món nhóm khuyến mại — chặn `BR-UNMAP-P2`) |
| 🟠 Vừa | `WBE-Q-B1` (900s vs 3600s) · `WBE-Q-B2` (poll hay bấm tay) · `WBE-Q-B3` (QR hết hạn) · `WBE-Q-B4` (gian hàng đã liên kết) · `WBE-Q-B5` (lỗi giữa chừng) · `WBE-Q-C6` (popup món chưa có nhóm) · `WBE-Q-D6` (sửa giá đẩy lên SPF?) · `WBE-Q-D7` (ảnh/thứ tự/xuất khẩu có API?) · `WBE-Q-D11` (thiếu lựa chọn auto-confirm) · `WBE-Q-D12` (lý do & thời hạn tạm ngưng) · `WBE-Q-D14` (ngắt kết nối) |
| 🟢 Thấp | `WBE-Q-A1` · `WBE-Q-A2` · `WBE-Q-C2` · `WBE-Q-C3` · `WBE-Q-D5` · `WBE-Q-D9` · `WBE-Q-D10` · `WBE-Q-D13` |
