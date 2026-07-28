# XMind cũ — bản chép lại đầy đủ (tham chiếu cấu trúc & câu chữ)

> Nguồn: 8 ảnh chụp trong `Docs/Nghiệp vụ/Xmind cũ/` (BA cung cấp 28/07).
> **Vai trò:** đây là **bản XMind CŨ** — dùng làm **chuẩn về cấu trúc, độ chi tiết và câu chữ**. Nội dung nghiệp vụ có chỗ đã lạc hậu so với quyết định 28/07 (xem mục ⚠️ cuối file).
> Chép nguyên văn, giữ đúng chính tả gốc (kể cả chỗ gõ sai như *"SF-ShopeeFoodfood"*, *"Raido button"*).

---

## Cấp 1: **PC**

### Tương tự như Grab, thêm phân hệ *Giao hàng từ ShopeeFood*

- **Hiển thị số lượng đơn hàng chưa xác nhận ngay cạnh tên menu.** VD: `Giao hàng từ ShopeeFood (6)`
- **Khi có đơn hàng mới đặt từ ShopeeFood**, hiển thị thông báo trên màn hình:
  > **"Khách hàng A vừa đặt 1 đơn hàng qua ứng dụng ShopeeFood. Bấm vào để xác nhận đơn hàng"**
  - Cho phép NV click vào thông báo. Khi NV click vào thông báo, hiển thị màn hình `Giao hàng từ ShopeeFood\ Tab Chưa xác nhận\ Thông tin đơn hàng`
- **Khi chọn phân hệ Giao hàng từ ShopeeFood, hiển thị 3 tab:** *Chưa xác nhận*, *Đã xác nhận* và *Đã hoàn thành* và thanh tìm kiếm mã đơn hàng (cho phép NV tìm kiếm mã đơn hàng của ShopeeFood nhanh chóng)

  **Tab Chưa xác nhận** — thể hiện các đơn hàng và thông tin đơn hàng KH đặt trên ShopeeFood và chưa được nhân viên xác nhận
  - Hiển thị danh sách đơn hàng gồm **4 cột**: `Đơn hàng` · `Số món` · `Tổng tiền` · `Thời gian đặt hàng`. **Hiển thị theo thứ tự đặt hàng từ xa đến gần**
  - Khi NV chọn từng đơn hàng → hiển thị chi tiết đơn hàng
    - **Thông tin đơn hàng:** Mã đơn hàng và Thời gian đặt
    - **Bảng các món KH đã đặt qua ShopeeFood gồm 3 cột:** `Tên món` · `Số lượng` · `Thành tiền`. Hiển thị **Tổng tiền** và **button Xác nhận**
      - Khi NV click button **Xác nhận** → đơn hàng **sẽ không hiển thị tại tab Chưa xác nhận** và **chuyển sang tab Đã xác nhận**. **Đồng thời đơn hàng sẽ được chuyển đến bếp/bar nếu đã thiết lập bếp/bar cho những món KH đã đặt**

  **Tab Đã xác nhận** — thể hiện các đơn hàng và thông tin đơn hàng đã được NV xác nhận. Hiển thị tương tự như tại tab Chưa xác nhận
  - Tại chi tiết từng đơn hàng, **thay button Xác nhận bằng button Giao hàng**. Khi chọn button **Giao hàng** → **hiển thị giao diện thanh toán như mọi đơn hàng khác**
  - **Cho phép NV sửa/thêm/xóa món và STPV đi kèm**

  **Tab Đã giao hàng** — thể hiện các đơn hàng và thông tin đơn hàng đã giao hoàn thành

- **Với các đơn hàng ShopeeFood đã xác nhận**, tại **Sổ giao hàng** và **tab Chờ giao hàng tại Order**, hiển thị đơn hàng ShopeeFood **tương tự như các đơn giao hàng khác** tại danh sách. Tại từng đơn hàng:
  - hiển thị **mã đơn hàng của ShopeeFood thay cho số order**
  - và **logo của ShopeeFood thay cho SĐT của KH**
  - **giữ nguyên mọi thông tin** như các đơn giao hàng khác
  - Khi chọn vào đơn hàng, cho phép **thêm/sửa/xóa** tương tự với các đơn giao hàng khác

### Tại Báo cáo khóa sổ
- Thêm **Đơn hàng ShopeeFood** trong **Thông tin phụ**

> 📌 Có **một khối lặp lại gần giống** ở phía dưới ảnh, với danh sách đơn hiển thị thêm `Tên KH`, `SĐT KH` — nhiều khả năng là nhánh **Mobile/Tablet**. Ảnh bị cắt, chưa đọc được đầy đủ.

---

## Cấp 1: **Web BE** *(màn Kết nối ShopeeFood)*

- Hiển thị màn hình **thiết lập giờ bán món từ thứ 2 đến chủ nhật**, cho phép QL thiết lập giờ bán món
- **Hiển thị màn hình Kết nối ShopeeFood (tương tự Grab)**

### Button: Quay lại
Khi click button → quay lại màn hình các Ứng dụng

### Button: **Đăng lên ShopeeFood**
Khi click button → các thông tin QL sửa/thêm/xóa sẽ được cập nhật lên app ShopeeFood

**4 cảnh báo kiểm tra trước khi đăng:**
1. Nếu thực đơn chứa **món có ký tự cấm** tại ShopeeFood → cảnh báo:
   > *"Thực đơn chứa ký tự không hợp lệ tại ShopeeFood. Vui lòng thay đổi"*
2. Nếu **không thiết lập nhóm khung giờ** → cảnh báo:
   > *"Bạn chưa thiết lập nhóm khung giờ. Vui lòng thêm nhóm khung giờ"*
3. Nếu **danh mục thực đơn có món không hợp lệ** → cảnh báo:
   > *"Bạn chỉ có thể đăng lên ShopeeFood các món hợp lệ. Các món không hợp lệ vui lòng vào danh sách Thực đơn để chỉnh sửa. Bạn có muốn tiếp tục không?"* — **Có/không**
   - **Có:** thực hiện đăng các món hợp lệ lên chương trình (lưu ý sắp xếp đúng thứ tự tại PM lên ShopeeFood)
   - Khi cập nhật các món không hợp lệ và đăng lên ShopeeFood thì **cập nhật lại thứ tự đã thiết lập**
4. Nếu có món ở **trạng thái Không hợp lệ** → cảnh báo:
   > *"Vui lòng chỉnh sửa lại các món chưa hợp lệ trước khi đăng lên ShopeeFood"*

### Tab: **Nhóm khung giờ**
- **Button: Thêm khung giờ** → khi click hiển thị **popup Thêm khung giờ**
  - `Tên nhóm khung giờ (*)` — ô trống để KH nhập tên. **Rule: Trường này không được bỏ trống**
  - `Khung giờ hoạt động`: **radio button** *Toàn bộ khung giờ* và *Chọn khung giờ*
    - Khi QL chọn **Toàn bộ khung giờ** → khung giờ hoạt động sẽ là toàn bộ các khung giờ trong Thiết lập
    - Khi QL chọn **Chọn khung giờ** → hiển thị dropbox các khung giờ trong Thiết lập để QL chọn (**có thể chọn nhiều khung giờ khác nhau**)
  - **Bảng Chọn nhóm thực đơn áp dụng**, gồm 2 cột: `Thứ tự` và `Nhóm thực đơn`. Cho phép QL chọn các nhóm thực đơn trong nhóm thực đơn tại tab Thực đơn và **cho phép sắp xếp thứ tự** các dòng nhóm thực đơn
- **Button: Sửa, Xóa, Nạp, Giúp** (rule tương tự như TTVN)
- **Bảng gồm 2 cột:** `Khung giờ hoạt động` và `Nhóm thực đơn`

### Tab: **Thực đơn**
- Hiển thị **bảng gồm 6 cột**: `Ảnh` · `Món ăn/Đồ uống` · `Nhóm thực đơn` · `Đơn vị tính` · `Giá bán` · `Giá bán ShopeeFood`
  (cho phép **Sửa, Xóa, Sắp xếp thứ tự, Nạp và Trợ giúp**). **Cho phép lọc tất cả các cột trừ cột Ảnh.**
- **Button: Chọn món**
  - Cho phép QL chọn các món đang có trong thực đơn của nhà hàng (cho phép lọc *Loại món*, *nhóm thực đơn* và tìm kiếm *Món ăn/Đồ uống*)
  - Cho phép chọn các món có **tên hoặc mô tả có số lượng ký tự vượt quá quy định** của PM. Khi nhập xong, tại bảng Thực đơn hiển thị **trạng thái Không hợp lệ** tại dòng đó
  - Khi chọn món vào thực đơn: vẫn chọn bình thường ⇒ **các món chưa thuộc nhóm thực đơn nào thì sẽ có trạng thái Không hợp lệ**. **Nếu món ăn có STPV chưa thuộc nhóm TPV nào thì có trạng thái là Không hợp lệ**
- **Button: Sửa** — cho phép QL sửa thông tin món và STPV của món
  - **Tab Thông tin chung** gồm: `Tên món(*)` · `Nhóm thực đơn` · `Giá bán` · `Giá bán ShopeeFood (*)` · `Mô tả` · `Trạng thái món` · `Ảnh đại diện`. Cho phép QL sửa thông tin chung của món ăn
    - `Tên món (*)`: **Bắt buộc nhập**, số ký tự **tối đa là 60 ký tự**. Khi sửa thông tin món: cảnh báo **quá ký tự tên món (60)**
    - `Nhóm thực đơn` và `Giá bán` được **đồng bộ lên theo món đã chọn trên Cukcuk**
      - Với món chưa thuộc nhóm thực đơn nào: **required thông tin nhóm thực đơn**
    - `Giá bán ShopeeFood (*)`: **Bắt buộc nhập**
    - `Mô tả`: **Không bắt buộc** nhập, số ký tự nhập **tối đa 250 ký tự**. Khi sửa thông tin món: cảnh báo **quá ký tự mô tả món (250)**
    - `Trạng thái món`: cho phép QL lựa chọn **Có bán** hoặc **ngừng bán**
  - **Tab Sở thích phục vụ**: hiển thị tên món và ghi chú
    > *"Ghi lại các STPV của khách hàng giúp nhân viên phục vụ chọn nhanh order. VD: không cay/ ít hành/ thêm phomai…"*
    và **bảng gồm 3 cột**: `Sở thích phục vụ` · `Nhóm STPV` · `Thu thêm`.
    3 thông tin này sẽ được **đồng bộ theo món đã chọn trên thực đơn Cukcuk**. **Không cho phép QL chỉnh sửa, chỉ cho phép QL thêm dòng, xóa dòng**
    - Với món ăn có STPV chưa thuộc nhóm STPV nào: **required thông tin nhóm STPV**

### Tab: **Nhóm Sở thích phục vụ**
- Hiển thị **bảng gồm 4 cột**: `Nhóm sở thích phục vụ` · `Bắt buộc chọn nhóm STPV` · `Số lượng STPV được chọn tối đa` · `Trạng thái` (tương tự TTVN)
- Các nhóm STPV sẽ **tự động được hiển thị ở bảng theo các món được thêm vào thực đơn trên ShopeeFood**
- Cho phép QL sửa Nhóm STPV. Khi chọn **Sửa** → hiển thị **popup Sửa Nhóm STPV - Tên nhóm STPV**
  - Hiển thị **thứ tự từng STPV trong nhóm** và cho phép QL **sắp xếp lại thứ tự STPV** trong nhóm
  - `Bắt buộc chọn nhóm STPV`: cho phép QL chọn **Có** hoặc **Không**. Nếu chọn **Có**, KH đặt hàng **bắt buộc phải chọn STPV**. Nếu chọn **Không**, KH có thể lựa chọn STPV theo món hoặc không tùy nhu cầu KH
  - `Giới hạn số lượng STPV được chọn tối đa`: **Raido button** *1 loại* hoặc *Nhiều loại*. Nếu QL chọn **Nhiều loại**, QL phải nhập số lượng STPV tối đa
  - `Trạng thái nhóm STPV`: **Radio button** *Sử dụng / Ngừng sử dụng / Ẩn*

### Tab: **Thiết lập**
- **Giờ bán món:** Hiển thị tương tự như TTVN, cho phép QL **chọn/sửa/thêm các khung thời gian từ thứ 2 đến chủ nhật**
- **Ngừng nhận đơn:** Cho phép QL thiết lập ngừng nhận đơn
  - Hiển thị **popup** khi QL chọn *Thiết lập ngừng nhận đơn*
    - *"Nhà hàng ngừng nhận đơn và tiếp tục nhận đơn lại sau:"*
    - **Box cho phép QL chọn thời gian: 30 phút, 1 giờ, cả ngày** (Khi NH chọn thời gian, nhà hàng trên ShopeeFood sẽ **dừng hoạt động cho đến khi hết thời gian được chọn**)
- **Thiết lập thông tin kết nối:** Màn hình hiển thị cho phép QL thiết lập thông tin kết nối với ShopeeFood tương tự thiết lập ban đầu khi QL chọn Ứng dụng ShopeeFood: cho phép **nhập ShopeeFood Merchant ID** để kết nối lại với gian hàng ShopeeFood khác
  - Khi QL chọn kết nối với **Merchant ID khác Merchant ID đang sử dụng** → hiển thị thông báo:
    > *"Bạn có chắc chắn muốn kết nối với 1 Merchant ID gian hàng ShopeeFood khác không? Nếu kết nối mới dữ liệu gian hàng hiện tại trên Cukcuk sẽ bị xóa"* — 2 lựa chọn **Đồng ý** và **Không đồng ý**
    - Nếu QL chọn **Đồng ý**: sau khi kết nối thành công, hiển thị lại **Màn hình liên kết thực đơn từ ShopeeFood về Cukcuk**
    - Nếu QL chọn **Không đồng ý**: không có gì thay đổi

---

## Cấp 1: **Báo cáo\Bán hàng** — 🎯 *nhánh ẢNH HƯỞNG*

- Tại các **Báo cáo về doanh thu**, đều hiển thị thêm **doanh thu đến từ đối tác ShopeeFood**
- Tại **Danh sách hóa đơn**, **So sánh phiếu tạm tính với hóa đơn**, **So sánh order và hóa đơn**
  - Hiển thị thêm các hóa đơn đơn hàng được đặt từ ShopeeFood **đã hoàn thành**
- **Bảng kê hóa đơn:** Thêm các hóa đơn bán hàng qua đối tác ShopeeFood
- **Thêm Doanh thu theo đối tác giao hàng**
  - Tương tự như TTVN, bảng gồm cột `Tên đối tác` và `Doanh thu`
    (trong Doanh thu, thể hiện các cột: **Tổng · Tiền hàng · Tiền phí · Tiền thuế · Khuyến mại · Chiết khấu**)

## Cấp 1: **Danh mục\Đối tác giao hàng** — 🎯 *nhánh ẢNH HƯỞNG*

- Khi QL đã kết nối xong với gian hàng ShopeeFood → **tự động hiển thị đối tác ShopeeFood trong danh mục Đối tác giao hàng**
  - `Mã đối tác`: **SF-ShopeeFood**
  - `Tên đối tác`: **SF-ShopeeFoodfood** *(nguyên văn — có vẻ gõ thừa "food")*
  - `Chiết khấu`: **tự động lấy chiết khấu theo ShopeeFood đang chiết khấu của cửa hàng và cho phép QL sửa chiết khấu**

---

## ⚠️ Đối chiếu với quyết định 28/07 — chỗ nào XMind cũ đã lạc hậu

| # | XMind cũ | Quyết định 28/07 | Xử lý |
|---|---|---|---|
| 1 | Kết nối bằng **nhập ShopeeFood Merchant ID** | **Quét mã QR** ủy quyền, hệ thống tự nhận biết | ✅ Dùng bản mới |
| 2 | Đổi gian hàng → **"dữ liệu gian hàng hiện tại trên Cukcuk sẽ bị xóa"** | Ngắt kết nối **giữ nguyên dữ liệu ghép nối** (`BR-DISC-05`) | ⚠️ **Mâu thuẫn — cần BA chốt** |
| 3 | Tab Web BE: *Nhóm khung giờ · Thực đơn · Nhóm STPV · Thiết lập* | Prototype mới: tab *Quản lý thực đơn* (5 phân đoạn) + *Thiết lập* | ⚠️ **Cần BA chốt dùng bộ tab nào** |
| 4 | Ngừng nhận đơn: **30 phút / 1 giờ / cả ngày** | Bám Shopee Merchant: **30 phút · 60 phút · Hết hôm nay · Chọn thời gian** + lý do | ✅ Dùng bản mới (`BR-BUSY-*`) |
| 5 | POS **3 tab** (*Chưa xác nhận · Đã xác nhận · Đã hoàn thành*) | **4 tab** — thêm *Đã huỷ* (`POS-D2`) | ✅ Dùng bản mới |
| 6 | Xác nhận → *"đồng thời đơn hàng sẽ được chuyển đến bếp/bar"* | Xác nhận → **in phiếu bếp luôn** (`POS-D23`) | ✅ Nhất quán, bổ sung chi tiết in |
| 7 | Tab Đã xác nhận: **cho phép NV sửa/thêm/xóa món và STPV** | `BR-POS-01`: ⛔ **KHÔNG cho sửa** SL/giá/topping đơn ShopeeFood | 🔴 **Mâu thuẫn nặng — cần BA chốt** |
| 8 | Giao hàng → *"hiển thị giao diện thanh toán như mọi đơn hàng khác"* | ✅ Khớp `POS-D3` (màn tính tiền giữ nguyên) | ✅ |
| 9 | Không có nút *Thu tiền* riêng | **CÓ nút Thu tiền** (`XD-01`) | ✅ Dùng bản mới |

### ✅ 3 mâu thuẫn đã chốt (28/07)

| # | Quyết định |
|---|---|
| 7 | **KHÔNG cho sửa/thêm/xóa món và STPV** trên đơn ShopeeFood — giữ `BR-POS-01`. Lý do: ShopeeFood không có cách nhận thay đổi; sửa bên CukCuk thì 2 bên lệch nhau, khách đã trả tiền theo đơn gốc. ⇒ **Bỏ dòng này của XMind cũ.** Chỉ được sửa **tên món hiển thị cục bộ** |
| 2 | **Nối sang gian hàng ShopeeFood KHÁC → XÓA dữ liệu cũ** (theo XMind cũ). Cảnh báo nguyên văn: *"Bạn có chắc chắn muốn kết nối với 1 Merchant ID gian hàng ShopeeFood khác không? Nếu kết nối mới dữ liệu gian hàng hiện tại trên Cukcuk sẽ bị xóa"* — **Đồng ý / Không đồng ý**.<br>⚠️ Phân biệt với `BR-DISC-05`: **ngắt rồi nối lại CÙNG gian hàng thì GIỮ** dữ liệu ghép nối |
| 3 | **Dùng bộ tab của prototype mới**, nhưng **đổi thứ tự — đưa *Nhóm thực đơn* lên trước** ⇒ thứ tự phân đoạn tab *Quản lý thực đơn*: **Nhóm thực đơn → Thực đơn → Nhóm STPV → STPV → Lịch bán món**.<br>📌 Khớp luôn thứ tự 4 bước của wizard ghép nối (nhóm trước, chi tiết sau) |

## ✅ Nội dung XMind cũ nên GIỮ (bản mới chưa có)

| # | Nội dung |
|---|---|
| 1 | **Số đơn chưa xác nhận cạnh tên menu**: `Giao hàng từ ShopeeFood (6)` |
| 2 | **Câu thông báo đơn mới đúng chuẩn**: *"Khách hàng A vừa đặt 1 đơn hàng qua ứng dụng ShopeeFood. Bấm vào để xác nhận đơn hàng"* ⇒ **thay câu tôi tự đề xuất ở `POS-D19`** |
| 3 | **Sắp xếp danh sách đơn theo thời gian đặt từ xa đến gần** |
| 4 | **Trong Sổ giao hàng**: hiện **mã đơn ShopeeFood thay cho số order**, **logo ShopeeFood thay cho SĐT khách** |
| 5 | **4 cảnh báo kiểm tra trước khi đăng thực đơn** (ký tự cấm · chưa có nhóm khung giờ · món không hợp lệ · món trạng thái Không hợp lệ) |
| 6 | **Giới hạn ký tự**: tên món **60**, mô tả **250** — kèm cảnh báo quá ký tự |
| 7 | **Khái niệm "món Không hợp lệ"**: món chưa thuộc nhóm thực đơn, hoặc có STPV chưa thuộc nhóm STPV, hoặc vượt ký tự |
| 8 | **Báo cáo khóa sổ**: thêm *Đơn hàng ShopeeFood* trong *Thông tin phụ* |
| 9 | **Toàn bộ nhánh Báo cáo & Danh mục đối tác giao hàng** (nội dung nhánh Ảnh hưởng) |
| 10 | **Chiết khấu đối tác**: tự lấy theo mức ShopeeFood đang áp cho cửa hàng, **cho phép QL sửa** ⇒ trả lời `XD-14` (không hardcode 20%) |
