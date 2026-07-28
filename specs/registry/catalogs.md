---
type: catalog
---

# Sổ đăng ký bảng mã & hằng số dùng chung

> **SSOT** cho các bảng mã dùng ở 2+ module và các hằng số/ngưỡng được nhắc ở 2+ module. Định nghĩa **một lần** tại đây; module bind bằng quan hệ `consumes` (+ liên kết inline) tới heading-anchor `CAT-*` / `CONST-*`, **không chép lại giá trị**.

## Bảng mã

### CAT-DISH-STATUS — Trạng thái món trên ShopeeFood (module sở hữu: web-be-shopeefood)

| Mã | Nhãn | Ghi chú |
|------|-------|------------------|
| `AVAILABLE` | Có bán | Khách đặt được |
| `INACTIVE` | Ngừng bán | Không thời hạn — quán tự bật lại |

Được dùng bởi: web-be-shopeefood.

> ⛔ ShopeeFood còn giá trị thứ ba `OUT_OF_STOCK` (hết món **có thời hạn**, bắt buộc kèm khoảng giờ từ–đến). CukCuk **chủ động không dùng** — xem [D-WBE-05](../modules/web-be-shopeefood/decisions.md#D-WBE-05).

### CAT-BUSY-REASON — Lý do tạm ngừng nhận đơn (module sở hữu: web-be-shopeefood)

| Mã | Nhãn | Ghi chú |
|------|-------|------------------|
| `1` | Quán hết món | |
| `2` | Quán quá tải | **Mặc định** khi chủ quán để trống |
| `3` | Mất điện | |

Được dùng bởi: web-be-shopeefood. ShopeeFood **bắt buộc** phải gửi một trong ba giá trị này.

### CAT-PROMO-TYPE — Chương trình khuyến mại của ShopeeFood (module sở hữu: web-be-shopeefood)

| Mã | Nhãn | Ghi chú |
|------|-------|------------------|
| `PREPAID_SKU` | Trùm Deal | Không được sửa thông tin lẫn giá; phải chờ hết chương trình |
| `CHEAPMEAL` | Ăn Ngon Rẻ | Không được sửa giá/thông tin, không được xoá — **chỉ được đổi trạng thái** |

Được dùng bởi: web-be-shopeefood.

### CAT-MAP-OBJECT — Đối tượng phải ghép nối (module sở hữu: web-be-shopeefood)

| Mã | Nhãn | Ghi chú |
|------|-------|------------------|
| `DISH_GROUP` | Nhóm thực đơn | Bước 1 |
| `DISH` | Món ăn | Bước 2 |
| `TOPPING_GROUP` | Nhóm sở thích phục vụ | Bước 3 |
| `TOPPING` | Sở thích phục vụ | Bước 4 |

Được dùng bởi: web-be-shopeefood. Cả 4 đều **bắt buộc ghép đủ 100%**.

## Hằng số

### CONST-QR-TTL — Thời gian sống của mã quét kết nối
| Giá trị | Module sở hữu | Được dùng bởi |
|-------|-------|---------------|
| 15 phút (900 giây) | web-be-shopeefood | web-be-shopeefood |

Lấy theo giá trị ShopeeFood trả về lúc sinh mã, ⛔ không ghi cứng trong mã nguồn.

### CONST-DISCONNECT-WAIT — Thời gian chờ chủ quán xác nhận ngắt kết nối
| Giá trị | Module sở hữu | Được dùng bởi |
|-------|-------|---------------|
| 5 phút | web-be-shopeefood | web-be-shopeefood |

### CONST-DISCONNECT-POLL — Chu kỳ hỏi lại ShopeeFood khi chờ ngắt kết nối
| Giá trị | Module sở hữu | Được dùng bởi |
|-------|-------|---------------|
| 10 giây | web-be-shopeefood | web-be-shopeefood |

### CONST-MAX-TIMERANGE — Số khung giờ hoạt động tối đa mỗi ngày
| Giá trị | Module sở hữu | Được dùng bởi |
|-------|-------|---------------|
| 3 | web-be-shopeefood | web-be-shopeefood |

⚠️ Đây là ràng buộc **của CukCuk**, không phải của ShopeeFood — tài liệu ShopeeFood không nêu giới hạn nào. Xem [D-WBE-08](../modules/web-be-shopeefood/decisions.md#D-WBE-08).

### CONST-DISH-NAME-MAX — Độ dài tối đa tên món
| Giá trị | Module sở hữu | Được dùng bởi |
|-------|-------|---------------|
| 60 ký tự | web-be-shopeefood | web-be-shopeefood |

### CONST-DISH-DESC-MAX — Độ dài tối đa mô tả món
| Giá trị | Module sở hữu | Được dùng bởi |
|-------|-------|---------------|
| 250 ký tự | web-be-shopeefood | web-be-shopeefood |

### CONST-BUSY-CUTOFF — Mốc ShopeeFood tự mở lại gian hàng sau khi tạm ngừng
| Giá trị | Module sở hữu | Được dùng bởi |
|-------|-------|---------------|
| 5 giờ sáng hôm sau | web-be-shopeefood | web-be-shopeefood |

Ràng buộc **cứng của ShopeeFood** — gửi mốc kết thúc xa hơn cũng bị cắt về đây.

### CONST-RATE-LIMIT — Giới hạn số lượt gọi sang ShopeeFood
| Giá trị | Module sở hữu | Được dùng bởi |
|-------|-------|---------------|
| 25 lượt/giây trên mỗi địa chỉ máy chủ | web-be-shopeefood | web-be-shopeefood |

<!-- Điểm còn mở -->
[NEEDS-CLARIFICATION: Q-REG-01 (medium) — CONST-DISH-DESC-MAX đang đặt 250 ký tự, nhưng tài liệu ShopeeFood cho phép mô tả tới 500 ký tự. 250 là ràng buộc riêng của CukCuk hay ghi nhầm? — suggested: nới lên 500 để không chặn oan chủ quán]
[NEEDS-CLARIFICATION: Q-REG-02 (high) — Chưa có danh sách ký tự bị ShopeeFood cấm trong tên món. Không có danh sách thì không kiểm tra hợp lệ được. — suggested: hỏi ShopeeFood xin danh sách chính thức]
