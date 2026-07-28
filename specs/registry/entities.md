---
type: entity-index
---

# Sổ đăng ký quyền sở hữu thực thể

> **SSOT** cho việc ai sở hữu thực thể nào. Mỗi thực thể xuất hiện **đúng một lần** với **đúng một** module sở hữu. Module không sở hữu thì bind vào hợp đồng bên dưới, ⛔ không khai lại trường.

## Bản đồ sở hữu

| Thực thể | Module sở hữu | Loại | Mô tả một dòng | Chia sẻ |
|--------|--------------------|------|----------|---------|
| `StoreConnection` | web-be-shopeefood | core | Liên kết giữa một nhà hàng CukCuk và một gian hàng ShopeeFood | shared-read |
| `MenuMapping` | web-be-shopeefood | join | Cặp ghép nối giữa đối tượng ShopeeFood và đối tượng CukCuk | shared-read |
| `ShopeeDish` | web-be-shopeefood | core | Món bán trên gian hàng ShopeeFood, kèm giá riêng của kênh | shared-read |
| `ToppingGroup` | web-be-shopeefood | core | Nhóm sở thích phục vụ đẩy lên ShopeeFood | private |
| `OperatingHours` | web-be-shopeefood | core | Giờ mở cửa của quán trên kênh ShopeeFood, theo từng ngày trong tuần | private |
| `HolidayPeriod` | web-be-shopeefood | core | Kỳ nghỉ lễ / nghỉ tạm thời đặt trước theo ngày cụ thể | private |
| `BusyPeriod` | web-be-shopeefood | core | Lượt tạm ngừng nhận đơn đang có hiệu lực | private |

Rules: mỗi dòng đúng một chủ sở hữu · không thực thể nào là `core` ở hai module · thực thể `shared-write` vẫn chỉ được ghi qua rule của module chủ sở hữu.

## Hợp đồng thực thể dùng chung

### StoreConnection — module sở hữu: web-be-shopeefood
- **Trường chuẩn:** `restaurantId: mã nhà hàng CukCuk` · `shopeeStoreId: mã gian hàng ShopeeFood` · `shopeeStoreName: tên gian hàng` · `status: trạng thái kết nối` · `connectedAt: thời điểm kết nối`
- **Tập trạng thái (giá trị cố định):** `NOT_CONNECTED | CONNECTED | LOST`
- **Ràng buộc:** một gian hàng ShopeeFood chỉ liên kết **một** nhà hàng CukCuk tại một thời điểm, và ngược lại (1–1).
- **Module dùng lại:** module POS (đọc `status` để hiện chỉ báo mất kết nối và để biết có nhận đơn hay không)

### MenuMapping — module sở hữu: web-be-shopeefood
- **Trường chuẩn:** `objectType: loại đối tượng` (xem [CAT-MAP-OBJECT](catalogs.md#CAT-MAP-OBJECT)) · `shopeeObjectId` · `cukcukObjectId` · `matchedBySystem: có phải hệ thống tự ghép không`
- **Tập trạng thái (giá trị cố định):** `MAPPED | UNMAPPED`
- **Ràng buộc:** ghép **1–1 theo cả hai chiều** — mỗi đối tượng chỉ thuộc đúng một cặp.
- **Module dùng lại:** module POS (đọc để biết món trong đơn về đã có món CukCuk tương ứng chưa)

### ShopeeDish — module sở hữu: web-be-shopeefood
- **Trường chuẩn:** `shopeeDishId` · `name` · `dishGroup` · `unit` · `basePrice: giá bán tại quán` · `shopeePrice: giá bán trên ShopeeFood` · `description` · `status` (xem [CAT-DISH-STATUS](catalogs.md#CAT-DISH-STATUS)) · `photo` · `promoType` (xem [CAT-PROMO-TYPE](catalogs.md#CAT-PROMO-TYPE)) · `hasUnsyncedChange: có thay đổi chưa đồng bộ`
- **Tập trạng thái (giá trị cố định):** xem [CAT-DISH-STATUS](catalogs.md#CAT-DISH-STATUS)
- **Module dùng lại:** module POS (đọc tên và giá để hiển thị dòng món trong đơn)

### ToppingGroup — module sở hữu: web-be-shopeefood
- **Trường chuẩn:** `name` · `isRequired: bắt buộc chọn nhóm` · `maxQuantity: số lượng được chọn tối đa` · `status`
- **Tập trạng thái (giá trị cố định):** `Sử dụng | Ngừng sử dụng | Ẩn`
- **Module dùng lại:** không có — dùng riêng trong module sở hữu

### OperatingHours — module sở hữu: web-be-shopeefood
- **Trường chuẩn:** `dayOfWeek: ngày trong tuần` · `isOpen: mở cửa hay đóng cửa` · `timeRanges: các khung giờ trong ngày`
- **Ràng buộc:** tối đa 3 khung giờ mỗi ngày, các khung không được chồng lấn nhau
- **Module dùng lại:** không có — dùng riêng trong module sở hữu

### HolidayPeriod — module sở hữu: web-be-shopeefood
- **Trường chuẩn:** `name: tên kỳ nghỉ` · `fromDate` · `toDate`
- **Ràng buộc:** dùng cho ngày nghỉ **không lặp lại**; nghỉ cố định hằng tuần thì đặt *Đóng cửa* ở `OperatingHours`
- **Module dùng lại:** không có — dùng riêng trong module sở hữu

### BusyPeriod — module sở hữu: web-be-shopeefood
- **Trường chuẩn:** `startAt` · `endAt` · `reason` (xem [CAT-BUSY-REASON](catalogs.md#CAT-BUSY-REASON))
- **Ràng buộc:** ShopeeFood tự kết thúc lượt tạm ngừng ở mốc [CONST-BUSY-CUTOFF](catalogs.md#CONST-BUSY-CUTOFF), bất kể `endAt` xa hơn
- **Module dùng lại:** không có — dùng riêng trong module sở hữu

<!-- Điểm còn mở -->
[NEEDS-CLARIFICATION: Q-REG-03 (medium) — Sau khi ngắt kết nối, `StoreConnection` giữ lại toàn bộ `MenuMapping` để lần sau nối lại dùng luôn. Nhưng nếu chủ quán nối sang gian hàng ShopeeFood KHÁC thì dữ liệu ghép nối cũ bị xoá. Có cần giữ bản lưu để khôi phục khi họ đổi ý không? — suggested: không giữ, đã có cảnh báo xác nhận trước khi xoá]
