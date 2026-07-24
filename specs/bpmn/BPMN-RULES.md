# Rule & ghi chú UX theo từng sơ đồ BPMN

> Engine BPMN chuẩn không vẽ được ghi chú rời, nên: **rule quan trọng nhúng thẳng vào tên bước** (đánh dấu `[UX:...]` / `[RULE:...]` trong sơ đồ), còn **chi tiết đầy đủ** ghi ở bảng này. Đọc kèm khi xem sơ đồ.

## A1 · Kết nối cửa hàng
| Bước | Rule / ghi chú |
|---|---|
| Hiện mã QR | **UX:** có đồng hồ đếm ngược; hết hạn thì hiện nút "Tạo mã mới" (không để user tự mò). |
| Đủ điều kiện? | Chỉ **chủ tài khoản** ShopeeFood mới kết nối được; quán **phải đã có gian hàng** trên ShopeeFood; đang nối POS cũ (Ocha) thì gỡ trước. |

## A2 · Đưa thực đơn lên ShopeeFood
| Bước | Rule / ghi chú |
|---|---|
| Tự động khớp món | ⭐ **UX quan trọng:** hệ so tên 2 danh sách, cặp nào **tên giống ≥80%** thì **ghép sẵn + gợi ý**; chủ quán chỉ duyệt/sửa. Cặp không chắc để chủ quán tự ghép. → đỡ ghép tay từng món (quán 50–100 món). Chạy cả **lần đầu** và **mỗi khi có món mới** sau này. |
| Ghép cả nhóm món & topping | ⭐ **RULE quan trọng:** **bắt buộc ghép cả nhóm**. Nếu món/nhóm **chưa ghép** mà bấm đồng bộ toàn bộ → ShopeeFood **xóa món cũ rồi tạo lại** → **mất lượt bán & đánh giá**. Vì vậy phải cảnh báo đỏ trước khi đồng bộ. |
| Chỉ có trên ShopeeFood | Không tự tạo món ở CukCuk; chủ quán tạo trong thực đơn quán rồi mới ghép. |

## A3 · Cập nhật thực đơn & tạm ngừng bán
| Bước | Rule / ghi chú |
|---|---|
| Tạm ngừng nhận đơn ngay | **UX:** đóng cửa **tức thì** (không đợi tới giờ theo lịch) — dùng khi hết nguyên liệu/nghỉ đột xuất, tránh đơn vào rồi phải hủy. |
| Sửa trên ShopeeFood | **RULE:** sửa thẳng trên app ShopeeFood **không** tự về CukCuk; lần đồng bộ sau có thể ghi đè. Nên sửa ở CukCuk rồi đẩy lên. |

## A4 · Thiết lập tùy chọn (cấu hình)
| Bước | Rule / ghi chú |
|---|---|
| Cách xác nhận đơn | 3 chế độ: **nhân viên tự bấm** (mặc định) / **tự động tất cả đơn** / **tự động chỉ đơn đã thanh toán**. Kèm **tự xác nhận sau 2 phút** nếu không ai thao tác (chuẩn ngành, tránh trễ giờ cao điểm). |
| Tự in tạm tính | Khi xác nhận / khi gửi bếp / tắt (tùy quán). |

## B1 · Nhận & xác nhận đơn
| Bước | Rule / ghi chú |
|---|---|
| Báo đơn về | ⭐ **UX quan trọng:** **chuông + nhấp nháy tab + báo liên tục** đến khi nhân viên xử lý — không để **sót đơn** dù đứng xa máy. |
| Xử lý đơn (2 phút) | Nếu bật auto: quá **2 phút** không thao tác → hệ tự xác nhận (có đếm ngược cảnh báo). |
| Để quá lâu | **RULE:** ShopeeFood có hạn xác nhận riêng — để quá hạn thì **ShopeeFood tự hủy đơn**. |

## B2 · Làm món → Giao → Hoàn thành
| Bước | Rule / ghi chú |
|---|---|
| Tài xế tới lấy | ⭐ **UX:** tem bàn giao in **mã đơn rút gọn (4–6 số cuối) cỡ lớn** + danh sách món → tài xế đối chiếu nhanh, ít sai (không cần OTP). |
| Hết món khi đang làm | **RULE:** chỉ **hủy cả đơn** (không bớt được 1 món qua kết nối); phải **báo khách trước**. |
| In hóa đơn + ghi nhận tiền | ⭐ **RULE quan trọng:** đơn ShopeeFood **không có màn thu tiền tại quầy** — quán không thu tiền khách. Chỉ **ghi nhận**; xem **tiền ShopeeFood trả về** (trạng thái: chờ đối soát → đã nhận). Tiền về từ **tài xế (COD)** hoặc **ShopeeFood đối soát chuyển sau** (đang hỏi ShopeeFood để chốt). |
| ShopeeFood báo đã giao xong | **RULE:** mốc **"đã giao xong"** mới **chốt hoàn thành & ghi doanh thu** (không phải lúc trao tài xế). |

## B3 · Hủy đơn
| Bước | Rule / ghi chú |
|---|---|
| Tài xế đã lấy hàng chưa? | ⭐ **RULE quan trọng:** chỉ được hủy **trước khi tài xế lấy hàng**; đã lấy rồi thì **không hủy được** trên POS. |
| In phiếu báo hủy cho bếp | **UX:** nếu bếp **đã in tem** rồi mới hủy → tự in **phiếu báo hủy** để bếp dừng làm, tránh lãng phí. |
