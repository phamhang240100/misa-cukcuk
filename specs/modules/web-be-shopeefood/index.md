---
id: web-be-shopeefood
type: module
status: clarifying
priority: P0
depends_on: []
relations:
  - {type: owns, target: "../../registry/entities.md#StoreConnection"}
  - {type: owns, target: "../../registry/entities.md#MenuMapping"}
  - {type: owns, target: "../../registry/entities.md#ShopeeDish"}
  - {type: owns, target: "../../registry/entities.md#ToppingGroup"}
  - {type: owns, target: "../../registry/entities.md#OperatingHours"}
  - {type: owns, target: "../../registry/entities.md#HolidayPeriod"}
  - {type: owns, target: "../../registry/entities.md#BusyPeriod"}
  - {type: owns, target: "../../registry/catalogs.md#CAT-DISH-STATUS"}
  - {type: owns, target: "../../registry/catalogs.md#CAT-BUSY-REASON"}
  - {type: owns, target: "../../registry/catalogs.md#CAT-PROMO-TYPE"}
  - {type: owns, target: "../../registry/catalogs.md#CAT-MAP-OBJECT"}
  - {type: owns, target: "../../registry/messages.md#MSG_WBE_"}
  - {type: gated-by, target: "../../registry/rbac.md#ROLE-OWNER", note: "mọi thao tác thay đổi dữ liệu"}
  - {type: gated-by, target: "../../registry/rbac.md#ROLE-CASHIER", note: "quyền xem — chưa chốt"}
---

# Web BE — Tích hợp ShopeeFood

> Màn quản lý gian hàng ShopeeFood ngay trong CukCuk: kết nối, ghép nối thực đơn, quản lý món, thiết lập giờ bán, đồng bộ lên sàn.

## Mục đích

Chủ quán đang phải mở song song hai phần mềm: CukCuk để quản lý quán, ứng dụng Shopee Partner để sửa thực đơn trên sàn — dẫn tới hai bên lệch nhau. Module này đưa toàn bộ việc quản lý gian hàng ShopeeFood về một chỗ, lấy thực đơn CukCuk làm bản gốc.

## Tác nhân

| Tác nhân | Vai trò | Được làm gì trong module này |
|-------|------|---------------------------|
| Chủ quán / quản lý | [ROLE-OWNER](../../registry/rbac.md#ROLE-OWNER) | Toàn quyền: kết nối, ghép nối, sửa món, thiết lập, đồng bộ, tạm ngừng, ngắt kết nối |
| Thu ngân | [ROLE-CASHIER](../../registry/rbac.md#ROLE-CASHIER) | *Chưa chốt* — xem [Q-REG-04](../../registry/rbac.md) |
| ShopeeFood | Hệ thống ngoài | Cấp quyền truy cập, trả thực đơn về, nhận thực đơn đẩy lên, báo kết quả đồng bộ |

## Thực thể

| Thực thể | Mô tả một dòng | Chi tiết |
|--------|-------------|--------|
| `StoreConnection` | Liên kết giữa một nhà hàng CukCuk và một gian hàng ShopeeFood | `data.md` |
| `MenuMapping` | Cặp ghép nối giữa đối tượng ShopeeFood và đối tượng CukCuk | `data.md` |
| `ShopeeDish` | Món bán trên gian hàng, kèm giá riêng của kênh ShopeeFood | `data.md` |
| `ToppingGroup` | Nhóm sở thích phục vụ đẩy lên ShopeeFood | `data.md` |
| `OperatingHours` | Giờ mở cửa của quán trên kênh ShopeeFood theo từng ngày | `data.md` |
| `HolidayPeriod` | Kỳ nghỉ lễ / nghỉ tạm thời đặt trước theo ngày cụ thể | `data.md` |
| `BusyPeriod` | Lượt tạm ngừng nhận đơn đang có hiệu lực | `data.md` |

## Phụ thuộc

| Phụ thuộc | Loại | Cung cấp gì |
|-----------|------|------------------|
| ShopeeFood — cổng dịch vụ đối tác | Bên thứ ba | Cấp quyền truy cập, thực đơn gian hàng, nhận thực đơn đẩy lên, trạng thái gian hàng |
| Ứng dụng Shopee Partner (điện thoại chủ quán) | Bên thứ ba | Nơi chủ quán **bắt buộc** phải xác nhận khi kết nối và khi ngắt kết nối |
| Thực đơn chính của MISA CukCuk | Nội bộ | Nguồn món, nhóm món, sở thích phục vụ, đơn vị tính, giá bán tại quán |

## Tham chiếu dùng chung

Những gì module này bind vào `registry/` — chỉ bind, ⛔ không định nghĩa lại ở đây. Nguồn chuẩn là khối `relations:` ở frontmatter; bảng dưới chỉ để người đọc tra nhanh.

| Loại | Kiểu quan hệ | Đích (heading-anchor trong registry) | Vai trò trong module |
|------|-----------|-----------------------------------|---------------------|
| Thực thể (sở hữu) | `owns` | [`entities.md#StoreConnection`](../../registry/entities.md#StoreConnection) | Trạng thái kết nối — POS đọc lại |
| Thực thể (sở hữu) | `owns` | [`entities.md#MenuMapping`](../../registry/entities.md#MenuMapping) | Bảng ghép nối — POS đọc lại |
| Thực thể (sở hữu) | `owns` | [`entities.md#ShopeeDish`](../../registry/entities.md#ShopeeDish) | Món bán trên sàn — POS đọc lại |
| Bảng mã | `owns` | [`catalogs.md#CAT-DISH-STATUS`](../../registry/catalogs.md#CAT-DISH-STATUS) | Trạng thái món |
| Bảng mã | `owns` | [`catalogs.md#CAT-BUSY-REASON`](../../registry/catalogs.md#CAT-BUSY-REASON) | Lý do tạm ngừng nhận đơn |
| Bảng mã | `owns` | [`catalogs.md#CAT-PROMO-TYPE`](../../registry/catalogs.md#CAT-PROMO-TYPE) | Món thuộc chương trình khuyến mại |
| Bảng mã | `owns` | [`catalogs.md#CAT-MAP-OBJECT`](../../registry/catalogs.md#CAT-MAP-OBJECT) | Bốn loại đối tượng phải ghép nối |
| Vai trò | `gated-by` | [`rbac.md#ROLE-OWNER`](../../registry/rbac.md#ROLE-OWNER) | Mọi thao tác thay đổi dữ liệu |
| Vai trò | `gated-by` | [`rbac.md#ROLE-CASHIER`](../../registry/rbac.md#ROLE-CASHIER) | Quyền xem — chưa chốt |
| Tiền tố thông báo | `owns` | [`messages.md#MSG_WBE_`](../../registry/messages.md#MSG_WBE_) | Tiền tố dành riêng cho module này |

Hằng số dùng trong module lấy từ [`catalogs.md`](../../registry/catalogs.md): `CONST-QR-TTL`, `CONST-DISCONNECT-WAIT`, `CONST-DISCONNECT-POLL`, `CONST-MAX-TIMERANGE`, `CONST-DISH-NAME-MAX`, `CONST-DISH-DESC-MAX`, `CONST-BUSY-CUTOFF`, `CONST-RATE-LIMIT`.

## Điểm còn mở

| Mã | Nằm ở file | Nội dung ngắn |
|---|---|---|
| `Q-WBE-01` | `requirements.md` | Quán chưa có món nào trên gian hàng thì vào ghép nối kiểu gì |
| `Q-WBE-02` | `requirements.md` | Món quán không định bán trên ShopeeFood — chưa có lối thoát khỏi luật ghép đủ 100% |
| `Q-WBE-03` | `requirements.md` | Cảnh báo trước khi đồng bộ có liệt kê đích danh món sắp bị xoá không |
| `Q-WBE-04` | `requirements.md` | Số phút mặc định của tự động xác nhận đơn |
| `Q-WBE-05` | `data.md` | Ghi chú "giá đã gồm thuế" cạnh ô nhập giá |
| `Q-WBE-06` | `edge-cases.md` | Kỳ nghỉ lễ chồng lên giờ mở cửa thường thì bên nào thắng |
| `Q-WBE-07` | `edge-cases.md` | Ngắt kết nối rồi thì thực đơn trên gian hàng còn không |
| `Q-WBE-08` | `rules.md` | Có cần nhật ký thao tác không |
| `Q-REG-01`…`Q-REG-04` | `registry/*` | Giới hạn ký tự mô tả · danh sách ký tự cấm · giữ bản lưu ghép nối · phân quyền thu ngân |
