# Tích hợp Grab Express với CukCuk (C86574)

## Phần Ứng dụng, bổ sung mục "Grab Express"

### Đáp ứng kết nối nhà hàng đơn và chi nhánh

### Mô tả: Hỗ trợ kết nối đối tác giao hàng Grab Express, giúp giảm thiểu thao tác thủ công và quản lý bằng tay khi giao hàng cho khách hàng.

## Khi nhấn vào "Grab Express"

### Nếu Nhà hàng/Chi nhánh chưa kết nối với GE, hiển thị màn hình Kết nối đối tác giao hàng Grab Express:

#### Vui lòng điền đầy đủ thông tin gian hàng để kết nối: Số điện thoại, Tỉnh/Thành phố, Quận/Huyện, Phường/Xã, Địa chỉ (Lấy thông tin từ Thiết lập hệ thống/Thiết lập chung/Thông tin chung)

##### Nếu Tỉnh/thành phố khác TP Hồ Chí Minh, TP Hà Nội, Đà Nẵng, Quảng Ninh, Cần Thơ -> cảnh báo "Grab Express chỉ hỗ trợ giao hàng khu vực TP Hà Nội, TP Hồ Chí Minh, Đà Nẵng, Quảng Ninh, Cần Thơ." -> đóng cảnh báo thì giữ nguyên thông tin

#### Checkbox: Yêu cầu xuất hóa đơn Phí vận chuyển (VAT)

##### Mặc định không tích chọn

##### Nếu tích chọn:

###### Hiển thị trường thông tin "Email phục vụ việc xuất hóa đơn"

- Bắt buộc nhập
  - Nếu không nhập thì khi chọn nút Kết nối hiển thị cảnh báo đỏ "Trường này không được để trống"
- Nếu nhập sai định dạng, hiển thị cảnh báo "Email chưa đúng định dạng, vui lòng kiểm tra lại."

###### Hiển thị Link: Đăng ký xuất hóa đơn tài chính (VAT) cho dịch vụ giao hàng - GrabExpress

- Chọn vào Link thì mở link gg form (new tab)
  - Link: https://docs.google.com/forms/d/e/1FAIpQLSdp_Aiy2qPABKzsjN_dOwv0AsuzYWCamwCnU8z_WxsQqj9n[...] `[ảnh bị cắt — điền nốt link]`

#### Chọn nút Kết nối:

##### Nếu thông tin nhà hàng đầy đủ (Số điện thoại, Địa chỉ, Tỉnh/Thành phố, Quận/Huyện, Phường/Xã) và Tỉnh/TP là 1 trong các tỉnh/tp: TP. Hồ Chí Minh, Hà Nội, Đà Nẵng, Quảng Ninh, Cần Thơ --> Kết nối thành công, chuyển nút thành Cập nhật và Hủy kết nối

- Cập nhật kết nối sau khi đã kết nối thành công: check validate các thông tin của nhà hàng tương tự như khi kết nối

##### Nếu bỏ trống 1 thông tin bất kỳ thì cảnh báo đỏ "Trường này không được để trống."

##### Nếu Tỉnh/thành phố khác TP Hồ Chí Minh, TP Hà Nội, Đà Nẵng, Quảng Ninh, Cần Thơ -> cảnh báo "Grab Express chỉ hỗ trợ giao hàng khu vực TP Hà Nội, TP Hồ Chí Minh, Đà Nẵng, Quảng Ninh, Cần Thơ." -> đóng cảnh báo thì giữ nguyên thông tin và không lưu thông tin kết nối

#### Nhấn Hủy kết nối

##### Nếu không có hóa đơn giao hàng nào hoặc tất cả các hóa đơn giao hàng của đối tác giao hàng tương ứng có trạng thái là Completed (Đơn hàng được giao thành công) hoặc Returned (Đơn hàng giao không thành công, Tài xế chuyển hoàn về Người Gửi/Grab Hub) thì show cảnh báo "Bạn có chắc chắn muốn hủy kết nối với đối tác giao hàng Grab Express không?", có nút Có và Không.

- Nhấn Có thì Quay về trạng thái chưa kết nối
- Nhấn nút Không: tắt cảnh báo, giữ nguyên trạng thái kết nối

##### Nếu vẫn còn ít nhất 1 hóa đơn giao hàng của đối tác giao hàng tương ứng có trạng thái khác Completed hoặc Returned thì show cảnh báo "Đối tác giao hàng Grab Express đang có hóa đơn trong quá trình giao vận. Nếu hủy kết nối bạn không thể tiếp tục nhận trạng thái đơn hàng từ đối tác. Bạn có chắc chắn muốn hủy kết nối với đối tác giao hàng Grab Express không?", có nút Có và Không.

- Nhấn Có thì Quay về trạng thái chưa kết nối
- Nhấn nút Không: tắt cảnh báo, giữ nguyên trạng thái kết nối

### Nếu Nhà hàng/Chi nhánh đã kết nối với GE, hiển thị màn hình thông tin kết nối đối tác giao hàng Grab Express

#### Chỉ các vai trò Quản trị hệ thống hoặc Quản lý chuỗi (Với chuỗi nhà hàng) hoặc [...] `[ảnh bị cắt — điền nốt vai trò]`
