> # ⛔ FILE NÀY ĐÃ BỊ THAY THẾ (2026-07-29)
> **Dùng [`web-be-shopeefood/`](web-be-shopeefood/index.md)** — bản viết lại đúng hợp đồng định dạng `.claude/templates/`.
> File này là bản nháp tôi tự nghĩ bố cục, ⛔ không theo template, ⛔ không chạy được `check_graph.py`. Giữ lại chỉ để đối chiếu; xoá được bất cứ lúc nào.

# Module 05 — Web BE: Tích hợp ShopeeFood (bản hợp nhất)

> **File này THAY THẾ `01-ket-noi.md` và `02-dong-bo-menu.md`** cho phần Web BE. Hai file kia giữ lại để tra lịch sử quyết định, ⛔ **không dùng để build**.
>
> **Nguồn, theo thứ tự thắng:**
> | Nhãn | Nguồn | Ghi chú |
> |---|---|---|
> | `[CHỐT]` | Chủ đầu tư trả lời trực tiếp 28–29/07 | **Thắng tất cả** |
> | `[XM-NEW]` | `Docs/Nghiệp vụ/Tích hợp ShopeeFood với CukCuk.xmind` (28/07 23:39) | Nguồn chuẩn về màn hình & câu chữ |
> | `[API]` | `[Jan 2026] Foody External API Integration Official.pdf` v0.0.17 · `[Jan 2026][ISV Partner] Authorization API.pdf` | Thắng mọi suy đoán về kỹ thuật |
> | `[PROTO]` | `Docs/UI/remix_-[nnhai2]-kết-nối-cukcuk---shopeefood-2.0/` | Chỉ dùng khi 3 nguồn trên im lặng |
>
> Rà chéo & lý do các quyết định: `../.clarity/reconcile-2026-07-28.md`

---

## 0. Phạm vi

| | Nội dung |
|---|---|
| ✅ **Trong** | Thẻ ShopeeFood · kết nối/ngắt kết nối · tải thực đơn về · ghép nối 4 bước · quản lý thực đơn · thiết lập giờ + ngày lễ + tự động xác nhận · đồng bộ lên ShopeeFood · tạm ngừng nhận đơn |
| ⛔ **Ngoài** | Tab *Tổng quan* (doanh thu, đánh giá, AOV) `WBE-D1` · **Lịch bán món / khung giờ theo nhóm** `[CHỐT]` · **Luồng chờ ShopeeFood duyệt món** `[CHỐT]` · chuỗi nhiều chi nhánh dùng chung một thao tác `[CHỐT]` · Promotion API (`price_slash.*`) · nút *In cấu hình*, *Gửi phản hồi*, *Xuất khẩu*, *Sao chép sang CukCuk*, *Liên kết nhanh* |

**Quy mô:** 1 nhà hàng CukCuk ↔ 1 gian hàng ShopeeFood `[CHỐT]`. Chuỗi vẫn dùng được — **mỗi chi nhánh kết nối gian hàng riêng của nó**, không có thao tác áp hàng loạt cho nhiều chi nhánh.

---

## 1. Thẻ ShopeeFood trong màn *Ứng dụng*

**Thẻ gồm:** biểu tượng ShopeeFood · tiêu đề **ShopeeFood** kèm nhãn **NEW** · mô tả *"Kết nối ShopeeFood trên CUKCUK để đồng bộ đơn hàng, trạng thái hoạt động và thông tin gian hàng."* · nút **Chi tiết**.

| # | Rule |
|---|---|
| `BE-01` | Thẻ chỉ có **một** nút: **Chi tiết**. ⛔ Bỏ *In cấu hình*, *Gửi phản hồi cho MISA CukCuk*, *Thêm hành động* (prototype có, `[XM-NEW]` đã bỏ) |
| `BE-02` | ⛔ Panel chi tiết **không hiển thị** *Mã cấu hình Endpoint (Webhook)* và *Phạm vi truy cập quyền dữ liệu (Scopes)* — CukCuk là ISV, chủ quán không cấu hình 2 thứ này (`WBE-D24`) |
| `BE-03` | Bấm **Chi tiết**: chưa kết nối → §2 · đã kết nối → §5/§6 |
| `BE-04` | Nhà hàng **không** kết nối ShopeeFood: giữ nguyên nghiệp vụ hiện tại, không đổi gì |

---

## 2. Luồng kết nối gian hàng

> Cơ chế `[API-Auth]`: **OAuth2 Device Authorization**. ⛔ **Không có** modal chặn đầu *"Bạn đã có gian hàng ShopeeFood chưa?"* — `[XM-NEW]` đã bỏ.

### 2.1 Màn *Kết nối gian hàng ShopeeFood*

Hiển thị: **mã hình vuông** để quét bằng ứng dụng Shopee Partner + **đồng hồ đếm ngược 15 phút** + lưu ý `MSG-CONN-01`.

| # | Rule |
|---|---|
| `CONN-01` | Đồng hồ đếm ngược lấy theo **`expires_in` thật** từ `/oauth2/devicecode` (`[API]` trả `900`s = 15 phút). ⛔ Không ghi cứng 900 trong mã |
| `CONN-02` | ⛔ **Không có nút xác nhận.** Chủ quán quét mã và đồng ý bên Shopee Partner thì hệ thống **tự nhận biết** và chuyển màn (`WBE-D17`) |
| `CONN-03` | Cách tự nhận biết: CukCuk **tự hỏi lại** `/oauth2/token` mỗi **`interval` giây** (`[API]` trả `5`), cho tới khi được cấp hoặc hết hạn. Chu kỳ lấy từ response, không ghi cứng |
| `CONN-04` | Người quét **phải là chủ gian hàng ShopeeFood**. ShopeeFood **không kiểm tra hộ** việc chọn đúng quán ⇒ chủ quán tự đối chiếu tên quán hiển thị trên Shopee Partner (`[API-Auth]` BR-02). ⛔ Không thêm bước bắt xác nhận lại bên CukCuk |
| `CONN-05` | Một gian hàng ShopeeFood chỉ nối **một** nhà hàng CukCuk tại một thời điểm (`[API-Auth §3]`) |

### 2.2 Bảng phản ứng theo mã lỗi `[API]`

| Mã lỗi `/oauth2/token` | Nghĩa | Web BE làm gì |
|---|---|---|
| `authorization_pending` | Chủ quán chưa bấm đồng ý | Tiếp tục hỏi lại, **không** báo gì |
| `slow_down` | Hỏi quá dày | **Tăng** chu kỳ hỏi lại, không báo gì |
| `access_denied` | Chủ quán bấm **từ chối** trên Shopee Partner | `MSG-CONN-05` + nút **Thử lại** |
| `expired_token` | Hết 15 phút | Làm **mờ mã** + hiện nút **Tạo mã mới** + `MSG-CONN-04`. ⛔ Không đóng màn, ⛔ không tự sinh mã mới (`WBE-D14`) |
| — (gian hàng đã liên kết nơi khác) | Vi phạm ràng buộc 1:1 | `MSG-CONN-03` — **nêu đích danh tên nhà hàng** đang giữ liên kết (`WBE-D15`) |
| — (đang dùng POS Ocha) | `[API-Auth §3]`: CukCuk **không tự gỡ được** | `MSG-CONN-06` — hướng dẫn liên hệ ShopeeFood gỡ Ocha trước |

### 2.3 Kết nối thành công

→ `MSG-CONN-02` → chuyển thẳng sang màn tải thực đơn (§3).

### 2.4 Quản lý quyền truy cập (kỹ thuật, không có UI)

| # | Rule |
|---|---|
| `CONN-06` | Lưu `access_token` + `refresh_token` **riêng cho từng nhà hàng** |
| `CONN-07` | `access_token` sống **3600s** ⇒ **làm mới định kỳ trước khi hết hạn** bằng `grant_type=refresh_token` |
| `CONN-08` | Cột lưu token phải chịu được chuỗi **> 2048 byte** (`[API-Auth]`) |
| `CONN-09` | Làm mới thất bại / quyền bị thu hồi → chuyển nhà hàng về trạng thái **Mất kết nối ShopeeFood** + hiện chỉ báo, ⛔ **không im lặng** (§9.4) |

---

## 3. Tải thực đơn từ ShopeeFood về

Tự động chạy ngay sau khi kết nối thành công. Hiển thị tiến trình **4 bước**:

1. Kết nối cổng dịch vụ ShopeeFood Partner
2. Tải danh sách món ăn và giá bán
3. Tải nhóm thực đơn và sở thích phục vụ
4. Chuẩn bị dữ liệu ghép nối

| # | Rule |
|---|---|
| `LOAD-01` | 🔴 **Món thuộc chương trình khuyến mại ShopeeFood (Trùm Deal / Ăn Ngon Rẻ) VẪN được lấy về và VẪN ghép nối bình thường.** Điều bị cấm là **không đồng bộ tên và giá của chúng lên** (§7) `[CHỐT]`.<br>⚠️ Đây là **đính chính** `WBE-D5` — bản cũ ghi *"không lấy về"*, gây ra `RR-01` và `BR-UNMAP-P2` một cách không cần thiết |
| `LOAD-02` | Tải thất bại → `MSG-LOAD-01` + nút **Thử lại**, **giữ nguyên kết nối đã có**, ⛔ không bắt quét mã lại (`WBE-D20`) |
| `LOAD-03` | **Thử lại chạy tiếp từ bước lỗi**, không làm lại từ bước 1 |
| `LOAD-04` | Tải xong → hiện `Tên cửa hàng` · `Số tài khoản` · `Trạng thái đồng bộ` + nút **Bắt đầu ghép nối dữ liệu bán hàng** |

---

## 4. Màn *Ghép nối thực đơn* — 4 bước

**Thứ tự bước:** `1. Nhóm thực đơn` → `2. Món ăn` → `3. Nhóm sở thích phục vụ` → `4. Sở thích phục vụ`

> **STPV = Sở thích phục vụ** (topping / tuỳ chọn: size, độ đá, độ ngọt, thêm trân châu…)

### 4.1 Bố cục mỗi bước

**Bảng 4 cột:** `<Đối tượng> trên ShopeeFood` · `<Đối tượng> tương ứng trên MISA CukCuk` · `Trạng thái ghép nối` · *(nút xoá ghép nối trên từng dòng)*

Đầu màn: **Tổng số dòng** + cảnh báo vàng `MSG-MAP-01`.

| # | Rule |
|---|---|
| `MAP-01` | Mỗi cột có **ô lọc riêng**. Cột *Trạng thái ghép nối* là danh sách chọn: `Tất cả` · `Đã ghép nối` · `Chưa ghép` |
| `MAP-02` | Cột MISA CukCuk hiển thị dạng **`[Mã] Tên`** — để phân biệt hai món trùng tên ở hai nhóm khác nhau |
| `MAP-03` | Dòng do **hệ thống tự ghép** phải có **dấu hiệu nhận biết** riêng, để chủ quán biết cần xem lại |
| `MAP-04` | Dòng **chưa ghép** hiển thị **hai gạch ngang** `--`, ⛔ không để trống (trống đọc ra là lỗi hiển thị) |

### 4.2 Tự ghép

| # | Rule |
|---|---|
| `MAP-05` | Hệ thống **tự ghép sẵn ngay khi mở màn**. ⛔ **Không có** nút chạy tự ghép, ⛔ không có nút *Liên kết nhanh*, ⛔ không có nút *Sao chép sang CukCuk* |
| `MAP-06` | **Chỉ tự ghép khi tên hai bên TRÙNG KHỚP HOÀN TOÀN.** ⛔ Không tính điểm phần trăm, ⛔ không hiển thị mức độ giống, ⛔ không cho chủ quán chỉnh độ chặt/lỏng (`WBE-D21` — hủy `DEC-MAP-01` fuzzy ~80%) |
| `MAP-07` | **Chuẩn hoá trước khi so tên:** bỏ dấu tiếng Việt · bỏ dấu câu · gộp khoảng trắng thừa về một · không phân biệt hoa/thường.<br>⇒ *"Cà phê sữa"* khớp *"CA PHE SUA"* và *"Ca-phe  sua"* |
| `MAP-08` | **Nhập nhằng:** có từ **2 dòng trở lên** cùng tên trùng khớp → ⛔ **không tự ghép dòng nào**, để chủ quán tự chọn. Tránh ghép nhầm |
| `MAP-09` | Mỗi dòng chỉ ghép với **đúng một** dòng bên kia (1–1, cả hai chiều). Do mô hình `dish.update_partner_id_mappings` của `[API]`: mỗi món ShopeeFood đúng một `partner_dish_id` |
| `MAP-10` | Combo bán trên ShopeeFood ⇒ phải có **một món combo tương ứng** bên CukCuk (hệ quả của `MAP-09`) |

### 4.3 Ghép tay

| # | Rule |
|---|---|
| `MAP-11` | Bấm ô ghép trên một dòng → danh sách chọn có **ô tìm theo mã và tên** + mục **Bỏ chọn** để gỡ ghép |
| `MAP-12` | Chọn món CukCuk **chưa thuộc nhóm thực đơn nào** → `MSG-MAP-03`, nút **Để sau** / **Chỉnh sửa**.<br>· **Chỉnh sửa** → mở thẳng màn sửa món để chọn nhóm, xong quay lại ghép tiếp<br>· **Để sau** → đóng cảnh báo, dòng đó **vẫn ở trạng thái Chưa ghép** |
| `MAP-13` | Nút **xoá ghép nối** trên từng dòng chỉ gỡ **đúng dòng đó**. ⛔ **Không có** thao tác gỡ ghép hàng loạt |
| `MAP-14` | Nút **Thêm mới trực tiếp trên MISA CukCuk** → màn nhập `Tên` · `Đơn vị tính` · `Giá bán` · `Diễn giải` → nút **Lưu và Liên kết** vừa tạo mới bên CukCuk vừa ghép luôn vào dòng đang chọn |
| `MAP-15` | Món có trên ShopeeFood mà CukCuk **không có** → chủ quán dùng `MAP-14` để tạo. ⛔ Hệ thống **không tự tạo** món ở CukCuk |

### 4.4 Chặn chuyển bước & hoàn tất

| # | Rule |
|---|---|
| `MAP-16` | Bấm **Tiếp tục** khi còn dòng chưa ghép → `MSG-MAP-02`, **không cho sang bước sau**. Áp cho **cả 4 bước**, kể cả STPV |
| `MAP-17` | Ghép đủ cả 4 bước → hoàn tất thiết lập, cho **bắt đầu bán hàng** |
| `MAP-18` | Ghép dở rồi thoát → **giữ nguyên tiến độ**, lần sau vào lại đúng bước đang dở. ⛔ Không bắt làm lại từ đầu |

---

## 5. Màn *Quản lý thực đơn* — 4 phần

> ⚠️ `[XM-NEW]` ghi **5 phần**. `[CHỐT]` đã **bỏ phần *Lịch bán món*** ⇒ còn **4**.

**Thứ tự:** `1. Nhóm thực đơn` → `2. Thực đơn` → `3. Nhóm sở thích phục vụ` → `4. Sở thích phục vụ`

### 5.1 Phần *Thực đơn*

**Bảng 6 cột:** `Ảnh` · `Món ăn/Đồ uống` · `Nhóm thực đơn` · `Đơn vị tính` · `Giá bán` · `Giá bán ShopeeFood`
Lọc được **mọi cột trừ cột Ảnh**.

| # | Rule |
|---|---|
| `MENU-01` | Nút **Chọn món** — chọn món đang có trong thực đơn nhà hàng để đưa lên ShopeeFood. Có lọc theo `Loại món`, `Nhóm thực đơn` và tìm theo tên món |
| `MENU-02` | Nút **Sửa** → mở màn sửa món. 📌 **Dùng chung màn chỉnh sửa thực đơn hiện hành của MISA CukCuk**, ⛔ không dựng riêng (`WBE-D22`) |
| `MENU-03` | Chọn **Sửa** hoặc **Xoá** mà chưa chọn dòng nào → `MSG-MENU-01` / `MSG-MENU-02` |
| `MENU-04` | ⛔ **Không cho xoá** món đang bán trên ShopeeFood nếu **chưa gỡ ghép** — xoá sẽ làm đơn mới không nhận được món (`MSG-MENU-03`) |

### 5.2 Màn *Sửa Món ăn* — 2 tab

**Tab *Thông tin chung*:**

| Trường | Bắt buộc | Hành vi |
|---|---|---|
| `Tên món` | ✅ | Tối đa **60 ký tự**. Vượt → `MSG-MENU-04` |
| `Nhóm thực đơn` | — | Lấy theo món đã chọn bên CukCuk. Món **chưa thuộc nhóm nào** thì **bắt buộc phải chọn** |
| `Đơn vị tính` | — | Lấy theo món bên CukCuk |
| `Giá bán` | — | Giá bán tại quán, lấy theo món bên CukCuk |
| `Giá bán ShopeeFood` | ✅ | Cho sửa. Xem `MENU-06` |
| `Mô tả` | — | Tối đa **250 ký tự**. Vượt → `MSG-MENU-05` |
| `Trạng thái món` | — | **Có bán** / **Ngừng bán** — đúng **2 giá trị** `[CHỐT]` |
| `Ảnh đại diện` | — | Định dạng `.jpg` `.jpeg` `.png` `.gif`. Nút `...` chọn ảnh · nút `✕` xoá ảnh |

Nút đáy: **Hủy** · **Lưu**

**Tab *Sở thích phục vụ*:** bảng 3 cột `Sở thích phục vụ` · `Nhóm sở thích phục vụ` · `Thu thêm`

| # | Rule |
|---|---|
| `MENU-05` | Ba thông tin STPV lấy theo món đã chọn bên CukCuk — ⛔ **không cho sửa nội dung**, chỉ cho **thêm dòng** và **xoá dòng** |
| `MENU-06` | 🔴 Sửa **Giá bán ShopeeFood** chỉ là **lưu nháp**. Chỉ có hiệu lực khi bấm **Đồng bộ lên ShopeeFood** (§7). Trong lúc đó màn phải hiện dấu hiệu **"Có thay đổi chưa đồng bộ"** |
| `MENU-07` | Món có STPV **chưa thuộc nhóm nào** → **bắt buộc phải chọn** nhóm sở thích phục vụ |

**Ánh xạ `Trạng thái món` sang `[API] DishStatus`:**

| Trạng thái CukCuk | `[API]` |
|---|---|
| Có bán | `AVAILABLE = 1` |
| Ngừng bán | `INACTIVE = 3` |
| — | ⛔ **`OUT_OF_STOCK = 2` KHÔNG dùng** `[CHỐT]` ⇒ không phải xử lý `from_time`/`to_time` |

### 5.3 Định nghĩa **món Không hợp lệ**

Một món bị coi là **Không hợp lệ** nếu thoả **bất kỳ** điều nào:
1. Chưa thuộc nhóm thực đơn nào
2. Có sở thích phục vụ chưa thuộc nhóm nào
3. Tên món vượt 60 ký tự **hoặc** mô tả vượt 250 ký tự

⇒ Món Không hợp lệ **không được đồng bộ lên ShopeeFood** (§7).

### 5.4 Phần *Nhóm sở thích phục vụ*

**Bảng 4 cột:** `Nhóm sở thích phục vụ` · `Bắt buộc chọn nhóm` · `Số lượng được chọn tối đa` · `Trạng thái`

| # | Rule |
|---|---|
| `MENU-08` | **Bắt buộc chọn nhóm** = `Có` → khách đặt hàng **bắt buộc phải chọn**; = `Không` → khách tự chọn hoặc không tuỳ nhu cầu |
| `MENU-09` | **Số lượng được chọn tối đa** = `1 loại` hoặc `Nhiều loại`. Chọn *Nhiều loại* → **bắt buộc nhập số lượng tối đa** |
| `MENU-10` | **Trạng thái nhóm**: `Sử dụng` · `Ngừng sử dụng` · `Ẩn` |
| `MENU-11` | 📌 Cấu hình `MENU-08`/`MENU-09` đặt ở **cấp nhóm**, dùng chung cho mọi món. `[API]` cho phép đặt **theo từng món** (`topping.set_group_quantity` nhận `partner_dish_id`; `dish.create_topping_mapping` có `is_required` riêng) nhưng **CukCuk chủ động không dùng** — đơn giản hoá có chủ ý, không phải thiếu sót |

---

## 6. Màn *Thiết lập*

### 6.1 Thời gian hoạt động

7 dòng từ **Thứ 2** đến **Chủ nhật**. Mỗi ngày: danh sách chọn `Mở cửa`/`Đóng cửa` · giờ `Từ` · giờ `Đến` · nút **+** thêm khung giờ.

| # | Rule |
|---|---|
| `SET-01` | Mặc định mọi ngày **Mở cửa 08:00–22:00** |
| `SET-02` | **Tối đa 3 khung giờ mỗi ngày** → vượt: `MSG-SET-01`.<br>📌 `[API] set_operation_time_ranges` **không nêu** giới hạn này ⇒ đây là **ràng buộc của CukCuk**, ghi rõ để sau không ai tưởng là của ShopeeFood |
| `SET-03` | Phải có **ít nhất 1 khung giờ** → xoá hết: `MSG-SET-02` |
| `SET-04` | Các khung giờ **trong cùng một ngày không được trùng nhau** → `MSG-SET-05` (`[API]` có lỗi tương ứng `error_overlap_time_range`) |
| `SET-05` | Nút **Thiết lập nhanh** — áp cùng cài đặt cho **tất cả các ngày** → `MSG-SET-03` |
| `SET-06` | Ngày quán **nghỉ cố định hằng tuần** → chọn `Đóng cửa` cho ngày đó |
| `SET-07` | Đẩy lên bằng `set_operation_time_ranges` với `day_of_week` + `is_closed` + mảng `time_ranges`.<br>⚠️ Thao tác này **ghi đè giờ mở cửa của gian hàng ShopeeFood** — không phải giờ riêng của CukCuk |

### 6.2 Cài đặt ngày lễ và ngày nghỉ tạm thời

Mỗi kỳ nghỉ: `Tên kỳ nghỉ` · `Từ ngày` · `Đến ngày`. Đặt trước được **cả năm**.

| # | Rule |
|---|---|
| `SET-08` | Chưa có kỳ nghỉ nào → `MSG-SET-04` |
| `SET-09` | Dùng cho ngày nghỉ **không lặp lại**. Nghỉ **cố định hằng tuần** thì dùng *Thời gian hoạt động* (`SET-06`) |
| `SET-10` | Đẩy lên bằng `set_operation_time_ranges` với **`custom_date` (yyyy-mm-dd)** + **`is_closed = true`**, mỗi ngày nghỉ một bản ghi. Nghỉ Tết 7 ngày = 7 bản ghi `[API]` |
| `SET-11` | Đến ngày, gian hàng **tự đóng nhận đơn**; hết kỳ nghỉ **tự mở lại**. Chủ quán không phải làm gì thêm |

### 6.3 Cài đặt đơn hàng

Ô bật **Tự động xác nhận đơn** + ô nhập **số phút**.

| # | Rule |
|---|---|
| `SET-12` | **Mặc định tắt.** Bật thì đặt số phút — quá số phút đó chưa ai bấm thì hệ thống tự xác nhận |
| `SET-13` | Tự động xác nhận **chỉ thay cú bấm *Xác nhận***, đơn sang **Chờ chuẩn bị đơn**. ⛔ **Không** tự chuyển thẳng sang *Chờ giao hàng* — như vậy là báo ShopeeFood đơn đã xong khi bếp chưa nấu, tài xế tới sớm đứng chờ |
| `SET-14` | ⛔ **Không có** lựa chọn *Tất cả đơn* / *Chỉ đơn đã thanh toán* — đơn ShopeeFood gần như luôn đã thanh toán qua ví (`WBE-D11`, hủy `AC-02`) |
| `SET-15` | Khi POS tự xác nhận → `order.update` phải gửi **`confirm_method = AUTO(2)`**; nhân viên bấm tay → **`MANUAL(1)`** |

### 6.4 ⚠️ Phân biệt hai thứ dễ nhầm — giữ cái nào, bỏ cái nào

> Hai thứ này tên gần giống nhau. **Chỉ bỏ cái thứ hai.**

| | **Thời gian hoạt động** (§6.1) | **Khung giờ hoạt động + nhóm thực đơn áp dụng** |
|---|---|---|
| Là gì | **Giờ mở cửa của nhà hàng** — Thứ 2…Chủ nhật, Mở/Đóng cửa, giờ Từ–Đến, tối đa 3 khung/ngày | Bảng ghép **khung giờ ↔ nhóm thực đơn**: nhóm *Món sáng* chỉ bán 06:00–10:00 |
| Thực chất | Giờ bán hàng của **cả quán** | **Lịch bán món** — giới hạn giờ ở **cấp nhóm món** |
| `[API]` | ✅ Có: `restaurant.set_operation_time_ranges` | ⛔ **Không có gì cả** — không endpoint, không trường trong schema menu |
| Quyết định | ✅ **GIỮ NGUYÊN** `[CHỐT]` | ⛔ **BỎ HẲN** `[CHỐT]` |

**Đã bỏ:** bảng *Khung giờ hoạt động và nhóm thực đơn áp dụng* (`Tên khung giờ` · `Khung giờ hoạt động` · `Nhóm thực đơn áp dụng` · `Thứ tự`) và phần *Lịch bán món* trong Màn Quản lý thực đơn — **hai cái này là cùng một tính năng**.

**Lý do bỏ:** `[API]` không có bất kỳ endpoint hay trường nào cho lịch bán cấp món/nhóm. Grep `schedule` / `available_time` / `selling_time` / `time_slot` trên toàn bộ 3.479 dòng tài liệu → **0 kết quả**. Schema menu chỉ có `id · name · sequence · Available Status · price · description · photo`, không có trường giờ nào. Chi tiết: `reconcile-2026-07-28.md §F1`.

⇒ **Kéo theo:** bỏ luôn cảnh báo chặn *"Bạn chưa thiết lập nhóm khung giờ. Vui lòng thêm nhóm khung giờ"* ở nút Đồng bộ (§7.3) — vì không còn nhóm khung giờ để thiết lập.

⇒ **Hệ quả nghiệp vụ:** toàn bộ thực đơn bán theo đúng **Thời gian hoạt động** của quán (§6.1). Muốn món chỉ bán buổi sáng thì chủ quán tự đặt *Ngừng bán* / *Có bán* theo tay.

---

## 7. Nút **Đồng bộ lên ShopeeFood**

> 📌 **Tên nút chuẩn là "Đồng bộ lên ShopeeFood"** — khớp prototype và bản dựng thật. `[XM-NEW]` gọi *"Đăng lên ShopeeFood"* là **sai tên**, phải sửa.

### 7.1 🔴 Rule cốt lõi — một nút, tự phân biệt hai việc `[CHỐT]`

Chủ quán chỉ thấy **một** nút. Hệ thống tự nhận biết mình đang làm gì:

| Trường hợp | Hành vi | Cảnh báo đỏ? |
|---|---|---|
| **A — Chỉ sửa thuộc tính** của món/nhóm/STPV **đã ghép** (giá, tên, mô tả, ảnh, trạng thái, thứ tự). Tập món bán trên ShopeeFood **không đổi** | Gọi **API sửa lẻ**: `dish.bulk_update` · `topping.update_prices` · `dish.set_statuses` · `dish.upload_picture`. ⛔ Không xoá gì | ⛔ **KHÔNG** |
| **B — Có thêm hoặc bớt** món khỏi danh sách bán trên ShopeeFood | **Đẩy toàn bộ** bằng `menu.sync` | ✅ **CÓ** — `MSG-SYNC-04` |

**Vì sao:** `menu.sync` có tính huỷ diệt — `[API]` nguyên văn: *"If a dish is in ShopeeFood but not in Partner's menu: **will be deleted** in ShopeeFood menu"*, kèm mất **số lượt đã bán** hiển thị cho khách. Đổi giá một món mà phải chạy thao tác đó là rủi ro không cần thiết, trong khi `[API]` có sẵn API sửa lẻ an toàn tuyệt đối.

**Lợi ích phụ:** cảnh báo đỏ chỉ hiện đúng lúc nó có nghĩa ⇒ chủ quán **không quen tay bấm qua**.

### 7.2 Món khuyến mại — loại khỏi payload sửa `[CHỐT]`

| # | Rule |
|---|---|
| `SYNC-01` | ⛔ **Không đồng bộ tên và giá** của món thuộc **Ăn Ngon Rẻ (CheapMeal)** và **Trùm Deal (Prepaid SKU)** — trong **mọi** trường hợp, cả nhánh A lẫn B.<br>`[API]` nguyên văn: *"Cannot edit price, information or delete CheapMeal dish (except **change status**)"* và *"Cannot edit dishes related to Prepaid SKU, need wait after this promotion ends"* |
| `SYNC-02` | ✅ **Vẫn được đổi trạng thái** (Có bán / Ngừng bán) của món CheapMeal — `[API]` cho phép |
| `SYNC-03` | Món khuyến mại **vẫn nằm trong danh sách, vẫn được ghép nối bình thường** (`LOAD-01`) ⇒ ⛔ không phát sinh món chưa ghép, ⛔ không làm fail lần đồng bộ |

### 7.3 Kiểm tra trước khi đồng bộ (theo thứ tự)

| Thứ tự | Điều kiện | Phản ứng |
|---|---|---|
| 1 | Thực đơn chứa món có **ký tự cấm tại ShopeeFood** | `MSG-SYNC-01` — chặn.<br>⚠️ **Còn thiếu:** chưa có danh sách ký tự cấm (§11 `OPEN-03`) |
| 2 | Danh mục có **món Không hợp lệ** (§5.3) | `MSG-SYNC-02` — nút **Có** / **Không**.<br>· **Có** → đồng bộ **các món hợp lệ**, giữ đúng thứ tự đã sắp xếp<br>· **Không** → đóng cảnh báo, ⛔ không đồng bộ gì |
| 3 | Còn dòng **chưa ghép nối** *(chỉ ở nhánh B)* | `MSG-SYNC-04` — cảnh báo mất dữ liệu |

⛔ **Bỏ** kiểm tra *"Bạn chưa thiết lập nhóm khung giờ"* — tính năng đã bỏ (§6.4).

### 7.4 Kết quả đồng bộ

| # | Rule |
|---|---|
| `SYNC-04` | Việc đồng bộ **chạy nền**, có thể mất một lúc và **có thể thất bại** |
| `SYNC-05` | Chỉ báo kết quả bằng **thông báo ngắn + dải cảnh báo lỗi**. ⛔ **Không** làm màn lịch sử đồng bộ (`WBE-D6`) |
| `SYNC-06` | Lấy kết quả bằng `menu.sync.get_task` (CukCuk chủ động hỏi) **hoặc** webhook `/s2s/menu/sync/task/callback` (ShopeeFood bắn về). 📌 **Chọn webhook** — nhanh hơn, không tốn quota |
| `SYNC-07` | Thất bại → **dải cảnh báo đỏ nêu đích danh món nào gây lỗi** + nút **Thử lại** (`MSG-SYNC-05`) |
| `SYNC-08` | Sau khi sửa món Không hợp lệ và đồng bộ lại → **cập nhật lại đúng thứ tự đã thiết lập** |
| `SYNC-09` | Tôn trọng **rate limit 25 QPS/IP** — xếp hàng khi đẩy thực đơn lớn |

---

## 8. Nút **Tạm ngừng nhận đơn**

### 8.1 Chọn thời hạn

Các mốc chọn nhanh: **30 phút** · **60 phút** · **Hết hôm nay** · **Chọn thời gian**

| # | Rule |
|---|---|
| `BUSY-01` | Chọn *Chọn thời gian* → hiện **Thời gian bắt đầu** và **Thời gian kết thúc** |
| `BUSY-02` | Thời gian bắt đầu **trước thời điểm hiện tại** → `MSG-BUSY-01` |
| `BUSY-03` | 🔴 ShopeeFood **chỉ giữ trạng thái tạm ngừng tới 5 giờ sáng hôm sau**, bất kể chọn mốc xa hơn.<br>`[API]` nguyên văn: *"We only allow the busy `end_date` **until 5am tomorrow** from the request time, **no matter what** `start_date` you send"*.<br>⇒ Chọn quá mốc đó thì **phải báo trước**: `MSG-BUSY-02` |
| `BUSY-04` | **Nghỉ dài ngày phải dùng *Cài đặt ngày lễ*** (§6.2), ⛔ không dùng Tạm ngừng |

### 8.2 Lý do

| # | Rule |
|---|---|
| `BUSY-05` | Ô **Lý do** — **không bắt buộc** với chủ quán. Ba lựa chọn: `hết món` · `quá tải` · `mất điện` |
| `BUSY-06` | ⚠️ Nhưng `[API] set_restaurant_busy` **bắt buộc** `busy_reason_type` ⇒ để trống thì **hệ thống tự gán mặc định = *quán quá tải*** (`busy_reason_type = 2`) `[CHỐT]` |

### 8.3 Xác nhận & phản hồi

Trước khi thực hiện: `MSG-BUSY-03` (modal xác nhận).
Thành công: `MSG-BUSY-04` · Bật lại: `MSG-BUSY-05`

| # | Rule |
|---|---|
| `BUSY-07` | Tạm ngừng **chỉ chặn đơn mới**. Đơn đang làm dở **vẫn phải hoàn tất bình thường** — ghi câu này lên modal để chủ quán yên tâm bấm |
| `BUSY-08` | Đọc lại trạng thái bằng `get_restaurant_busy_infos`; sửa/gia hạn bằng cách gửi lại kèm **`busy_id`** đã nhận |

---

## 9. Nút **Ngắt kết nối**

### 9.1 🔴 CukCuk KHÔNG tự ngắt được

`[API-Auth §3]`: ngắt kết nối **không phải là một lời gọi API** — đó là **deep link sang Shopee Partner App**. Chủ quán **bắt buộc** phải xác nhận bên đó, y như lúc kết nối.

| # | Rule |
|---|---|
| `DISC-01` | Bấm *Ngắt kết nối* → CukCuk hiện **mã hình vuông** để chủ quán quét và xác nhận ngắt bên Shopee Partner App.<br>(`[API-Auth]` khuyến nghị dựng thành mã quét khi hiển thị trên máy để bàn) |
| `DISC-02` | Trong lúc chờ, CukCuk **tự hỏi lại mỗi 10 giây, trong tối đa 5 phút** bằng `get_restaurant_info`:<br>· trả **thành công** = chủ quán **chưa** xong → tiếp tục chờ<br>· trả **lỗi quyền hết hiệu lực** = **đã ngắt xong** |
| `DISC-03` | Quá **5 phút** chưa xác nhận → coi như **chưa ngắt**, quay về trạng thái *Đã kết nối*, báo `MSG-DISC-02`.<br>⛔ **Tuyệt đối không** hiển thị "đã ngắt" khi chưa chắc chắn |
| `DISC-04` | Ngắt xong → `MSG-DISC-03` + quay về trạng thái **chưa kết nối** |

### 9.2 Chặn ngắt

| # | Rule |
|---|---|
| `DISC-05` | ⛔ Còn **đơn ShopeeFood chưa hoàn thành** → **không cho ngắt**: `MSG-DISC-01` |

### 9.3 Sau khi ngắt

| # | Rule |
|---|---|
| `DISC-06` | Ngắt rồi kết nối lại với **cùng gian hàng** → **giữ nguyên toàn bộ dữ liệu ghép nối**, ⛔ không phải ghép lại từ đầu |
| `DISC-07` | Chọn kết nối với **gian hàng ShopeeFood khác** → `MSG-DISC-04`, nút **Đồng ý** / **Không đồng ý**.<br>· **Đồng ý** → sau khi kết nối thành công, hiện lại màn ghép nối thực đơn **từ đầu**<br>· **Không đồng ý** → không có gì thay đổi |

### 9.4 Kết nối tự đứt (không do chủ quán bấm trong CukCuk)

| # | Rule |
|---|---|
| `DISC-08` | Chủ quán có thể **ngắt thẳng trên Shopee Partner App**, không qua CukCuk. Khi đó CukCuk chỉ biết lúc **mất quyền truy cập** ⇒ **phải** hiện chỉ báo `MSG-DISC-05`, ⛔ không được im lặng |
| `DISC-09` | Quyền truy cập cũng có thể **hết hạn** nếu làm mới token thất bại (`CONN-09`) → dùng **cùng** chỉ báo `MSG-DISC-05` + nút **Kết nối lại**. ⛔ Không làm màn mới |

---

## 10. Sổ đăng ký thông báo (`MSG-*`)

> Mọi câu chữ hiển thị cho người dùng đều có mã. Sửa câu chữ thì sửa ở đây, không sửa rải rác.

### 10.1 Kết nối

| Mã | Loại | Nội dung |
|---|---|---|
| `MSG-CONN-01` | Lưu ý | *"Mỗi gian hàng trên đối tác chỉ kết nối tương ứng với 1 nhà hàng trên MISA CukCuk. Bạn cần đăng nhập tài khoản admin và chọn đúng quán cần tích hợp trên Shopee Partner"* |
| `MSG-CONN-02` | Thành công | *"Kết nối thành công tài khoản ShopeeFood Partner!"* |
| `MSG-CONN-03` | Chặn | *"Gian hàng ShopeeFood này đã liên kết với nhà hàng **{tên nhà hàng}** trên MISA CukCuk. Ngắt kết nối ở quán đó trước rồi thực hiện lại."* |
| `MSG-CONN-04` | Hết hạn | *"Mã đã hết hạn"* + nút **Tạo mã mới** |
| `MSG-CONN-05` | Thất bại | *"Kết nối không thành công. Bạn đã từ chối trên ứng dụng Shopee Partner."* + nút **Thử lại** |
| `MSG-CONN-06` | Chặn | *"Gian hàng của bạn đang kết nối với phần mềm bán hàng khác. Vui lòng liên hệ nhân viên phụ trách của ShopeeFood để ngắt kết nối cũ, sau đó quay lại đây."* |

### 10.2 Tải thực đơn

| Mã | Loại | Nội dung |
|---|---|---|
| `MSG-LOAD-01` | Lỗi | *"Không tải được thực đơn từ ShopeeFood. Kiểm tra kết nối mạng và thử lại."* + nút **Thử lại** |

### 10.3 Ghép nối

| Mã | Loại | Nội dung |
|---|---|---|
| `MSG-MAP-01` | Cảnh báo vàng | *"Còn **{n}** {đối tượng} ShopeeFood chưa có {đối tượng} tương ứng"* |
| `MSG-MAP-02` | Chặn | *"Còn **{n}** món chưa được ghép nối. Vui lòng ghép nối toàn bộ thực đơn để tiếp tục."* |
| `MSG-MAP-03` | Chặn | *"Món cần thuộc một nhóm thực đơn cụ thể trước khi ghép. Bạn có muốn cập nhật món ngay không?"* — nút **Để sau** / **Chỉnh sửa** |

### 10.4 Quản lý thực đơn

| Mã | Loại | Nội dung |
|---|---|---|
| `MSG-MENU-01` | Validation | *"Vui lòng chọn 1 món để sửa"* |
| `MSG-MENU-02` | Validation | *"Vui lòng chọn món để xóa"* |
| `MSG-MENU-03` | Chặn | *"Món này đang bán trên ShopeeFood. Vui lòng gỡ ghép nối trước khi xóa."* |
| `MSG-MENU-04` | Validation | *"Tên món không được vượt quá 60 ký tự"* |
| `MSG-MENU-05` | Validation | *"Mô tả món không được vượt quá 250 ký tự"* |
| `MSG-MENU-06` | Chỉ báo | *"Có thay đổi chưa đồng bộ"* |

### 10.5 Thiết lập

| Mã | Loại | Nội dung |
|---|---|---|
| `MSG-SET-01` | Chặn | *"Tối đa 3 khung giờ hoạt động cho mỗi ngày!"* |
| `MSG-SET-02` | Chặn | *"Cần ít nhất 1 khung giờ hoạt động!"* |
| `MSG-SET-03` | Thành công | *"Đã thiết lập nhanh thời gian hoạt động thành công cho tất cả các ngày!"* |
| `MSG-SET-04` | Rỗng | *"Chưa thiết lập ngày nghỉ lễ nào. Vui lòng thêm bên dưới."* |
| `MSG-SET-05` | Validation | *"Các khung giờ trong cùng một ngày không được trùng nhau"* — ứng `[API] error_overlap_time_range` |

### 10.6 Đồng bộ

| Mã | Loại | Nội dung |
|---|---|---|
| `MSG-SYNC-01` | Chặn | *"Thực đơn chứa ký tự không hợp lệ tại ShopeeFood. Vui lòng thay đổi"* |
| `MSG-SYNC-02` | Hỏi | *"Bạn chỉ có thể đồng bộ lên ShopeeFood các món hợp lệ. Các món không hợp lệ vui lòng vào danh sách Thực đơn để chỉnh sửa. Bạn có muốn tiếp tục không?"* — nút **Có** / **Không** |
| `MSG-SYNC-03` | Đang chạy | *"Đang đồng bộ thực đơn lên ShopeeFood…"* |
| `MSG-SYNC-04` | Cảnh báo đỏ | *"Dữ liệu không liên kết khi đồng bộ lên ShopeeFood sẽ bị mất. Bạn có chắc chắn muốn tiếp tục thực hiện không?"* — **chỉ hiện ở nhánh B** (§7.1) |
| `MSG-SYNC-05` | Lỗi | *"Đồng bộ thất bại ở **{n}** món: **{danh sách tên món}**. {Lý do}."* + nút **Thử lại** |

### 10.7 Tạm ngừng nhận đơn

| Mã | Loại | Nội dung |
|---|---|---|
| `MSG-BUSY-01` | Validation | *"Vui lòng chọn thời gian bắt đầu sau thời gian hiện tại"* |
| `MSG-BUSY-02` | Cảnh báo | *"ShopeeFood sẽ tự mở nhận đơn lại từ 5 giờ sáng mai theo giờ mở cửa của quán."* |
| `MSG-BUSY-03` | Xác nhận | *"Khi tạm ngừng nhận đơn, nhà hàng của bạn trên ứng dụng ShopeeFood sẽ chuyển sang trạng thái **Đóng cửa tạm thời**. Khách hàng sẽ không thể đặt món cho đến khi bạn bật lại nhận đơn. Các đơn đang xử lý vẫn hoàn tất bình thường. Bạn có chắc chắn muốn thực hiện?"* |
| `MSG-BUSY-04` | Thành công | *"Đã tạm ngừng nhận đơn trên ShopeeFood thành công!"* |
| `MSG-BUSY-05` | Thành công | *"Đã mở nhận đơn trở lại trên ShopeeFood thành công!"* |

### 10.8 Ngắt kết nối

| Mã | Loại | Nội dung |
|---|---|---|
| `MSG-DISC-01` | Chặn | *"Còn **{n}** đơn ShopeeFood chưa hoàn thành. Xử lý xong rồi mới ngắt kết nối được."* |
| `MSG-DISC-02` | Cảnh báo | *"Bạn chưa hoàn tất ngắt kết nối trên ứng dụng ShopeeFood Partner."* |
| `MSG-DISC-03` | Thành công | *"Đã ngắt kết nối tài khoản ShopeeFood Partner"* |
| `MSG-DISC-04` | Xác nhận | *"Bạn có chắc chắn muốn kết nối với 1 Merchant ID gian hàng ShopeeFood khác không? Nếu kết nối mới dữ liệu gian hàng hiện tại trên CukCuk sẽ bị xóa"* — nút **Đồng ý** / **Không đồng ý** |
| `MSG-DISC-05` | Chỉ báo đỏ | *"Mất kết nối ShopeeFood. Đơn hàng mới sẽ không về CukCuk."* + nút **Kết nối lại** |

---

## 11. Còn mở

| Mã | Nội dung | Mức | Chặn gì |
|---|---|---|---|
| `OPEN-01` | **Phân quyền** — chỉ chủ/quản lý mới thấy nút Kết nối / Ngắt kết nối / Đồng bộ / Tạm ngừng, hay ai đăng nhập cũng làm được? | 🔴 | Ngắt kết nối và Đồng bộ đều là thao tác phá hoại được |
| `OPEN-02` | **Nhật ký thao tác** — có ghi ai · lúc nào · làm gì không? | 🟠 | Sáng ra mất 12 món mà không biết ai làm |
| `OPEN-03` | **Danh sách ký tự cấm tại ShopeeFood** | 🔴 | `MSG-SYNC-01` không validate được nếu không có danh sách |
| `OPEN-04` | Giới hạn **tên 60 / mô tả 250 ký tự** là của CukCuk hay ShopeeFood? `[API §3.5]` ghi `description` ≤ **500** | 🟠 | Nếu là của CukCuk thì đang chặt hơn cần thiết |
| `OPEN-05` | **Món quán không định bán trên ShopeeFood** — bắt ghép 100% nhưng chưa có lối thoát. Quán có 8 món ngừng bán từ lâu thì làm sao qua được bước ghép? | 🔴 | Chủ quán sẽ ghép bừa cho xong |
| `OPEN-06` | Gian hàng ShopeeFood **chưa có món nào** (quán mới mở) — vào wizard rỗng hay đi thẳng luồng đẩy thực đơn lên? | 🟠 | Kịch bản phổ biến với quán mới |
| `OPEN-07` | **Số phút mặc định** của tự động xác nhận, và khoảng cho phép chỉnh | 🟠 | Cần biết hạn phản hồi đơn của ShopeeFood |
| `OPEN-08` | Kỳ nghỉ lễ **chồng lên** giờ mở cửa thường — kỳ nghỉ thắng, hay cảnh báo? | 🟢 | |
| `OPEN-09` | `MSG-SYNC-04` có **liệt kê đích danh** món sắp bị xoá không, hay chỉ câu cảnh báo chung? | 🟠 | Thao tác không hoàn tác được |
| `OPEN-10` | Ghi chú *"Giá bán ShopeeFood đã bao gồm VAT"* cạnh ô nhập giá — có cần không? | 🟢 | `M4`: giá đã gồm toàn bộ thuế |
| `OPEN-11` | Tên món **tiếng Anh** (`[API]` có `name_en`) — có nhập không? | 🟢 | |

### Chuyển ShopeeFood

`Q-DISC-01` — ngắt kết nối rồi thì gian hàng và thực đơn trên ShopeeFood **có còn nguyên** không, khách có đặt được nữa không? (`[API-Auth]` không nói rõ) · `WBE-Q-A2` danh sách scope OAuth · `WBE-Q-D3` chu kỳ đồng bộ khuyến nghị và rate limit thực tế
