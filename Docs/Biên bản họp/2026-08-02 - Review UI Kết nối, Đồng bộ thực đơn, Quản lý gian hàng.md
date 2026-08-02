# BIÊN BẢN HỌP — Review UI ShopeeFood

**Ngày:** 02/08/2026
**Nội dung:** Review màn hình Kết nối gian hàng, Đồng bộ thực đơn, Quản lý gian hàng, Chọn món
**Thành phần:** (điền sau)
**Người ghi:** (điền sau)

---

## 1. Kết nối gian hàng

| # | Nội dung góp ý | Ghi chú |
|---|---|---|
| 1.1 | Thông báo kết quả kết nối phải hiển thị **cả toast message và thông báo ở chuông** | Lý do: người dùng quét QR xong có thể tắt màn hình đi làm việc khác → toast trôi mất, không biết kết nối thành công/thất bại |
| 1.2 | Kiểm tra lại phía ShopeeFood có trả về **mã lỗi/lỗi cụ thể** không | Nếu có → phải định nghĩa nội dung toast message tương ứng cho từng lỗi. **Cần confirm với SPF** |

---

## 2. Đồng bộ thực đơn

### 2.1 Chức năng bổ sung
- Cân nhắc bổ sung màn **thêm mới hàng loạt** nhóm thực đơn / món.
- Bổ sung **nút "Lấy dữ liệu"** để lấy lại đúng dữ liệu đồng bộ ban đầu.
- Bổ sung **sắp xếp (sort)** ở các bảng.
- Lưu **step đang thực hiện**: khi nhấn "Tiếp tục" thì ghi nhận step; thoát giữa chừng, vào đồng bộ lại vẫn mở đúng step đó.

### 2.2 Hiển thị dữ liệu
- Màn đồng bộ thực đơn: cân nhắc **đẩy các món chưa map lên đầu danh sách**.
- Phân biệt rõ ràng hơn các món **hệ thống tự động ghép** — hoặc cho phép **lọc ra** các món tự động ghép.
- Cân nhắc hiển thị thêm **cột giá bán trên CukCuk** để người dùng so sánh.

### 2.3 Dropdown mapping / chọn món
- Danh sách món MISA CukCuk **chỉ lấy Món ăn và Đồ uống**.
- **Chỉ lấy nhóm/món đang phục vụ**, không lấy nhóm/món đã ngừng bán.

### 2.4 Cảnh báo khi thêm món
- Khi thêm món mà **nhóm thực đơn của món đó đã có trong danh sách đồng bộ** → hiển thị **cảnh báo xác nhận**: sẽ tự động thêm món vào thực đơn, có muốn tiếp tục không?

### 2.5 Màn hình thêm món
- Trường "Loại" **chỉ gồm Món ăn / Đồ uống**.
- **Ẩn** option "Món ăn theo nguyên vật liệu" và "Món ăn theo nhóm".

---

## 3. Quản lý gian hàng

### 3.1 Màn danh sách
- **Bỏ** nút Xuất khẩu và nút Tải lại.
- **Bỏ** tag "Mở cửa".
- **Bổ sung sort** ở các bảng.
- "Sắp xếp thứ tự": **đổi lại text UX writing** cho dễ hiểu hơn — làm rõ đây là sắp xếp thứ tự thực đơn hiển thị lên ShopeeFood.

### 3.2 Màn Chọn món
- **Chỉ hiển thị các món chưa có trong Menu**.
- **Chỉ lấy Món ăn / Đồ uống**.
- **Bỏ** nút "Lưu và đồng bộ".

---

## 4. Việc cần làm (Action items)

| # | Việc | Người phụ trách | Deadline | Trạng thái |
|---|---|---|---|---|
| 1 | Confirm với ShopeeFood: API có trả về mã lỗi cụ thể khi kết nối gian hàng thất bại không? | | | Chờ SPF |
| 2 | Định nghĩa nội dung toast message theo từng loại lỗi (sau khi có (1)) | | | Chờ (1) |
| 3 | Bổ sung thông báo ở chuông cho kết quả kết nối gian hàng | | | Cần làm |
| 4 | Cập nhật UI Đồng bộ thực đơn: sort, cột giá CukCuk, phân biệt món auto-map, nút Lấy dữ liệu | | | Cần làm |
| 5 | Bổ sung logic lưu step khi đồng bộ dở dang | | | Cần làm |
| 6 | Cập nhật điều kiện lọc danh sách món (chỉ Món ăn/Đồ uống, đang phục vụ, chưa có trong Menu) | | | Cần làm |
| 7 | Bổ sung popup cảnh báo tự động thêm món khi nhóm thực đơn đã có trong DS đồng bộ | | | Cần làm |
| 8 | Cập nhật màn Quản lý gian hàng: bỏ Xuất khẩu/Tải lại/tag Mở cửa, thêm sort, sửa UX writing | | | Cần làm |
| 9 | Cập nhật màn Chọn món (thuộc Quản lý gian hàng): bỏ nút "Lưu và đồng bộ" | | | Cần làm |
| 10 | Đánh giá tính khả thi màn thêm mới hàng loạt nhóm thực đơn/món | | | Cần cân nhắc |

---

## 5. Điểm còn mở / cần làm rõ

- ShopeeFood trả về những mã lỗi nào khi kết nối gian hàng? (chưa có tài liệu)
- Màn "thêm mới hàng loạt" — phạm vi làm đến đâu (chỉ nhóm, hay cả nhóm + món)?
- Nút "Lấy dữ liệu": lấy lại dữ liệu ban đầu sẽ ghi đè hay cảnh báo mất mapping đang làm dở?
- Text mới cho chức năng "Sắp xếp thứ tự" — cần chốt câu chữ cụ thể.
