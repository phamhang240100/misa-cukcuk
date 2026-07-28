---
type: role
relations:
  - {type: owns, target: "#ROLE-OWNER"}
  - {type: owns, target: "#ROLE-CASHIER"}
---

# Sổ đăng ký vai trò & quyền

> **SSOT** cho danh sách vai trò và ma trận quyền. ⛔ Không module nào tự đặt tên vai trò riêng. Module bind vào vai trò bằng quan hệ `gated-by` (+ liên kết inline) tới heading-anchor bên dưới, ⛔ không viết tên vai trò trần trong câu chữ. Nếu một module cần quyền chưa có trong bảng, **thêm dòng ở đây trước**.

## Vai trò (danh sách đóng)

### ROLE-OWNER — Chủ quán / Quản lý nhà hàng
| Trường | Giá trị |
|-------|-------|
| Mô tả | Người đứng tên nhà hàng trên CukCuk, chịu trách nhiệm về thực đơn và giá bán |
| Là vai trò thật? | có |

### ROLE-CASHIER — Thu ngân
| Trường | Giá trị |
|-------|-------|
| Mô tả | Nhân viên trực ca, xử lý đơn hàng tại POS |
| Là vai trò thật? | có |

## Ma trận quyền (vai trò × module × hành động)

| Vai trò | Module | Hành động | Được phép | Rào chắn |
|------|--------|--------|---------|--------------------------------------|
| ROLE-OWNER | web-be-shopeefood | Kết nối gian hàng | có | không |
| ROLE-OWNER | web-be-shopeefood | Ngắt kết nối | có | phải xác nhận trên ứng dụng Shopee Partner |
| ROLE-OWNER | web-be-shopeefood | Ghép nối thực đơn | có | không |
| ROLE-OWNER | web-be-shopeefood | Sửa / xoá món | có | không |
| ROLE-OWNER | web-be-shopeefood | Đồng bộ lên ShopeeFood | có | không |
| ROLE-OWNER | web-be-shopeefood | Tạm ngừng nhận đơn | có | không |
| ROLE-OWNER | web-be-shopeefood | Thiết lập giờ hoạt động, ngày nghỉ | có | không |
| ROLE-CASHIER | web-be-shopeefood | Xem màn quản lý gian hàng | *chưa chốt* | — |
| ROLE-CASHIER | web-be-shopeefood | Mọi hành động thay đổi dữ liệu | *chưa chốt* | — |

Quy tắc: một danh sách vai trò duy nhất cho cả hệ thống · tên vai trò dùng trong module mà không có ở đây là lệch chuẩn, phải sửa tại đây · trường hợp ngoại lệ phải là dòng riêng, không viết rải rác trong module.

<!-- Điểm còn mở -->
[NEEDS-CLARIFICATION: Q-REG-04 (high) — Thu ngân mở màn Ứng dụng, nhìn thấy nút Ngắt kết nối và nút Đồng bộ lên ShopeeFood. Hai nút này đều phá hoại được: ngắt kết nối làm đơn mới không về, đồng bộ có thể xoá món khỏi gian hàng. Chỉ ROLE-OWNER mới thấy các nút thay đổi, hay ai đăng nhập được cũng làm được? — suggested: chỉ ROLE-OWNER được thao tác, ROLE-CASHIER chỉ xem]
