# Rà code chết trong 2 prototype — 2026-07-28

> **Vì sao rà:** BA phát hiện modal *"Bạn đã có gian hàng trên ShopeeFood chưa?"* đã bị bỏ khỏi luồng, nhưng tôi vẫn trích được câu chữ của nó và suýt đưa vào spec. ⇒ **Trích chuỗi văn bản KHÔNG chứng minh tính năng còn sống.**
> **Cách xác định:** một modal là "chết" khi cờ bật của nó **chưa bao giờ được đặt thành bật** (chỉ có lệnh tắt). Một hàm là "chết" khi nó được khai báo nhưng **không nút nào gọi**.
> Mọi mục dưới đây **đã kiểm chứng tay**, không phải kết quả máy quét thô.

## A. Web BE — `ApplicationsView.tsx`

### 🔴 Màn/hộp thoại KHÔNG BAO GIỜ MỞ ĐƯỢC

| Thành phần | Nội dung nó chứa | Nhận định |
|---|---|---|
| `showShopeeHaveStoreModal` | *"Bạn đã có gian hàng trên ShopeeFood chưa?"* + nhánh hướng dẫn đăng ký (*Đăng ký bán hàng* → *Chờ xét duyệt* → *Quay lại CukCuk*) | ✅ **BA xác nhận đã bỏ.** Chỉ còn tàn dư |
| `isLinkCukCukModalOpen` | *"Chọn món liên kết với MISA CukCuk"* — hộp chọn món để ghép | Đã bị thay bằng **ô chọn ngay trên dòng** trong wizard |
| `isLinkCukCukMenuGroupModalOpen` | *"Chọn nhóm thực đơn liên kết với MISA CukCuk"* | nt |
| `isLinkCukCukOptionGroupModalOpen` | hộp chọn nhóm STPV để ghép | nt |
| `isLinkStpvItemModalOpen` | *"Chọn sở thích phục vụ liên kết với MISA CukCuk"* | nt |
| `isInfoModalOpen` | hộp thông tin | không rõ dùng làm gì |

### 🔴 Thao tác khai báo nhưng không nút nào gọi

| Hàm | Là thao tác gì | Nhận định |
|---|---|---|
| `handleBulkUnlink` | **Hủy liên kết hàng loạt** — kèm câu *"Đã huỷ liên kết hàng loạt thành công cho {n} bản ghi!"* | ✅ **BA chốt bỏ hẳn** — nghiệp vụ không có case này |
| `openQuickLink` | Mở panel **Liên kết món nhanh** | ⚠️ **Cần BA quyết** — xem mục C |
| `handleToggleDay` | Bật/tắt một ngày trong tuần ở thiết lập giờ hoạt động | ⚠️ Cần kiểm tra lại: thiết lập giờ theo ngày có còn dùng không |

### ✅ Vẫn SỐNG (máy quét báo nhầm, đã kiểm chứng)
`handleStartMenuSync` (nút bắt đầu đồng bộ) · `handleSaveNewCukCukItem` (*Lưu & Liên kết*) · `handleAutoLinkActiveTab` (**tự ghép các món trùng tên**) · `openAddNewCukCukModal` (**thêm mới trực tiếp**, gọi ở 4 chỗ) · `isUtilityDropdownOpen` (menu tiện ích)

## B. POS — `DeliveryView.tsx`

### 🔴 Màn/hộp thoại KHÔNG BAO GIỜ MỞ ĐƯỢC

| Thành phần | Nội dung nó chứa |
|---|---|
| `showCancelModal` | Hộp **Hủy order** — *"Bạn có chắc chắn muốn hủy order … không?"* + danh sách lý do (*Quán quá đông · Nhà hàng đóng cửa · Khách đổi ý · Không có tài xế · Khác*) |
| `showPaymentCollectModal` | Hộp **Thu tiền khách hàng** |
| `showPrintReceipt` | Xem trước **hóa đơn in** |
| `showDeliveryPrintOverlay` | Lớp phủ **đang in phiếu giao hàng** |

### 🔴 Thao tác không ai gọi
`handleConfirmOrderDirectly` (xác nhận đơn không in) · `handleDeliveryOrderWithPrint` (giao hàng kèm in) · `handlePrintDeliverySlip` (in phiếu giao hàng)

### ✅ Vẫn SỐNG
`applyVatReduction` (ô tích *Áp dụng giảm thuế GTGT*) · `handleConfirmOrderWithPrint` · `handleCompletePayment` · `handlePrintKitchenAndLabel`

## C. `OrderOnlineView.tsx` và `MainOrderView.tsx`
✅ **Sạch** — không có màn chết, không có thao tác chết.

---

## D. Việc phải làm trước khi dựng XMind

| # | Việc | Trạng thái |
|---|---|---|
| 1 | Bỏ modal *"đã có gian hàng chưa"* khỏi spec module 01 | ✅ BA đã xác nhận, **cần sửa `01-ket-noi.md`** |
| 2 | Bỏ *Hủy liên kết hàng loạt* khỏi spec + prototype | ✅ BA đã chốt, đã sửa specs |
| 3 | **Liên kết nhanh / Sao chép / Hủy liên kết** — ✅ **BA chốt 28/07: KHÔNG có nút nào cả.** Hệ thống **tự ghép**, không cần bấm. Gỡ ghép bằng **icon 🗑 trên từng dòng**. ⇒ gỡ hết khỏi prototype | ✅ **đã chốt** |
| 4 | 4 hộp *"Chọn … liên kết với MISA CukCuk"* chết — ✅ **đúng, thiết kế cuối là ô chọn ngay trên dòng** | ✅ **đã chốt** |
| 5 | POS: hộp **Hủy order**, **Thu tiền**, **hóa đơn in**, **phiếu giao hàng** — ✅ **BA xác nhận nghiệp vụ VẪN CÓ**, prototype chỉ **chưa nối dây**. Kèm 2 rule mới: **Xác nhận → in phiếu bếp luôn** (`POS-D23`), **Giao hàng → in phiếu giao hàng luôn** (`POS-D24`), hộp Hủy order có **lý do bắt buộc** (`POS-D25`) | ✅ **đã chốt** |
| 6 | `handleToggleDay` — ✅ **BA chốt CÓ**: mỗi ngày T2–CN có danh sách chọn **Mở cửa / Đóng cửa** riêng, giống Shopee Merchant. Phải nối lại trong prototype | ✅ **đã chốt** |

## E. 🔑 Bài học rút ra cho cả dự án

**Prototype có 2 loại "code chết", ý nghĩa NGƯỢC NHAU — không được xử lý giống nhau:**

| Loại | Dấu hiệu | Ý nghĩa | Xử lý |
|---|---|---|---|
| **Tàn dư thiết kế cũ** | Tính năng đã có cách làm mới thay thế | Nghiệp vụ **đã bỏ** | Gỡ khỏi prototype **và** khỏi spec |
| **Chưa nối dây** | Tính năng đang được chốt là **CÓ** trong nghiệp vụ | Prototype **làm thiếu** | Giữ trong spec, ghi rõ *prototype phải nối lại* |

Ví dụ đối lập: hộp *"đã có gian hàng chưa"* = tàn dư (bỏ hẳn) · hộp *Hủy order* = chưa nối dây (phải làm).
⇒ **Không bao giờ suy "code chết = nghiệp vụ không có".** Phải hỏi BA từng cái.

> ⚠️ **Lưu ý khi đọc mục B:** POS có **2 bộ lý do hủy** — bộ trong `showCancelModal` (chết) và bộ trong `OrderOnlineView` (sống). Cả hai **đều không khớp** mã ShopeeFood ⇒ đã chốt `POS-D4`: chỉ giữ lý do ShopeeFood chấp nhận.
