# CukCuk × Grab Express — Prototype luồng tích hợp (C86574)

Prototype tương tác mô phỏng **toàn bộ luồng tích hợp đối tác giao hàng Grab Express** vào MISA CukCuk,
dựng theo mindmap yêu cầu tại `../Luồng/*.jpg`. Khớp design system của 2 prototype tham khảo:

| | Tham khảo | Brand | Body |
|---|---|---|---|
| Web quản lý | `[hangpt]-kết-nối-cukcuk---shopeefood-2.0` | `#2563EB` | Inter 13px |
| POS bán hàng | `[tbhung]_onboarding_pos---v3` | `#076EFF` | Inter 13px |
| Grab (đối tác) | — | `#00B14F` | — |

Stack: **Vite 6 + React 19 + Tailwind v4 + lucide-react** (giống hệt 2 bản tham khảo). Brand đổi theo `data-surface` (web/pos).

## Chạy

```bash
cd "Cukcuk/grab-express-integration"
npm install
npm run dev            # http://localhost:3100
```

Thanh trên cùng chuyển **4 bề mặt**: **Web quản lý · POS bán hàng (tablet) · POS PC · Sổ giao hàng**.
State kết nối / đơn hàng / thông báo dùng chung giữa cả 3 nền tảng POS → luồng liền mạch (kết nối ở Web, tạo đơn ở POS tablet hoặc PC, theo dõi chung ở Sổ giao hàng).

## 4 bề mặt

### 1. Web quản lý — `Ứng dụng › Grab Express` (`src/surfaces/WebConnectSurface.tsx`)
- **Full shell MISA CukCuk**: header xanh (9-dot · logo MISA CukCuk · chọn nhà hàng/chi nhánh · ngôn ngữ/tải app/chuông/trợ giúp/thiết lập/avatar) + sidebar đầy đủ (Bàn làm việc … Ứng dụng) + lưới **ứng dụng logo thật**, mỗi card có badge *Đã kết nối*/**New** và link **Chi tiết**.
- Danh sách Ứng dụng đầy đủ: Hóa đơn điện tử · MISA AMIS–Kế toán · **Grab Express** (New) · **Grab Food** (đổi tên từ "Grab") · ShopeeFood (New) · MISA SME.NET 2020 · AMIS Accounting · SMS Marketing · AhaMove.
- Màn kết nối: form lấy sẵn thông tin từ *Thiết lập chung* (SĐT, Tỉnh/TP, Quận/Huyện, Phường/Xã, Địa chỉ).
- Checkbox **Yêu cầu xuất hóa đơn Phí vận chuyển (VAT)** (mặc định tắt) → hiện *Email xuất hóa đơn* (bắt buộc) + link đăng ký GG Form.
- **Kết nối** → validate: trống → *"Trường này không được để trống."*; email sai → *"Email chưa đúng định dạng…"*; địa chỉ ngoài **khu vực Grab Express hỗ trợ** → cảnh báo GE chỉ hỗ trợ Hà Nội, TP.HCM, Đà Nẵng, Quảng Ninh, Cần Thơ.
- Sau kết nối: nút đổi thành **Cập nhật** + **Hủy kết nối**.
- **Hủy kết nối** phân nhánh theo trạng thái đơn GE: đơn còn giao vận (≠ COMPLETED/RETURNED) → cảnh báo "đang có hóa đơn trong quá trình giao vận…"; ngược lại → cảnh báo thường. Có/Không.

### 2. POS bán hàng — Order & Giao hàng (`src/surfaces/PosOrderSurface.tsx`)
- **Full UI POS** dựng bám bản `[tbhung]_onboarding_pos---v3`: khung tablet, rail icon trái (Order/Bàn/Hóa đơn/Đặt chỗ/Hướng dẫn), màn **Order (trang chủ)** với header kênh *Giao hàng*, lưới món 5 cột (ảnh + badge giá), thanh nút màu chuẩn `Lưu #12B76A · Gửi bếp/bar #245FDF · Tính tiền #F79009 · Gửi đơn #1570EF`. Bỏ onboarding/auth/tour, vào thẳng màn trang chủ. Drawer & popup **đóng khung trong tablet** (`contained`), không trôi ra viewport.
- **Danh sách order** (đúng bản gốc): tab kênh **Tất cả / Tại bàn / Mang về / Giao hàng / Xác nhận đơn online** (kèm số đếm) · search + lọc trạng thái order + Tổng order/tiền · **2 dạng xem: Card ⟷ List** (toggle). Riêng tab **Giao hàng** có thêm 3 filter: **Trạng thái giao** (Chờ giao / Đang giao / Đã hoàn thành / Đã hủy) · **Đối tác** · **Nguồn đơn**.
- **Xác nhận đơn online** (tab): đơn từ Website/App chờ xác nhận → slide-out panel 2 tab (**Thông tin đơn hàng** / **Đối tác giao hàng**). Ở tab Đối tác chọn **Grab Express** → hiện Loại dịch vụ (khóa) · Phí GH trả đối tác · Phí GH thu khách + cảnh báo địa chỉ ngoài khu vực Grab Express hỗ trợ. Footer **Từ chối / Xác nhận & Giao hàng / Xác nhận** → tạo đơn **Chờ gửi đối tác** sang tab Giao hàng. Đơn Grab Express nằm ở tab **Giao hàng**, chỉ hiện **Chờ gửi đối tác** + **Chờ giao hàng** (ẩn Đang giao / Đã thanh toán), có chip Grab Express + trạng thái CukCuk + pill GE, nút **Gửi đơn hàng / Giao hàng / Hủy**.
- **Thông tin Order: Giao hàng** (modal giữa, đúng bản gốc): Ngày giao · Giờ giao · Khách hàng · Địa chỉ giao · Đặt cọc trước · **Hình thức giao** = dropdown nhiều đối tác (**Nhà hàng tự giao / Grab Express / AhaMove / ShopeeFood**). Chọn **Grab Express** mới hiện field GE: Loại dịch vụ *Siêu tốc - Thực phẩm* (khóa) · **Phí GH trả đối tác** (chỉ hiện khi đủ Tỉnh/Quận/Phường, ⓘ, không sửa) · **Phí GH thu khách** (mặc định = phí trả đối tác, sửa được) · Thu hộ COD. Chọn *Nhà hàng tự giao* → Mã đơn đối tác (N/A) + Phí giao hàng (sửa được).
- **Lưu / Lưu & Thêm**: mặc định đơn thu hộ **COD = Còn phải thu**; COD > **2.000.000đ** → cảnh báo "Chọn đối tác GH khác / Đóng"; địa chỉ ngoài khu vực Grab Express hỗ trợ → cảnh báo; không kết nối được → popup.
- **Gửi đơn hàng** (Chờ gửi đối tác) → màn Hóa đơn giao hàng hiển thị **thông tin gửi sang GE** → kiểm tra kết nối → chuyển **Chờ giao hàng** (sinh Mã vận đơn, GE = ALLOCATING).
- **Giao hàng** (Chờ giao hàng) → **Đang giao hàng**.

### 3. Sổ giao hàng — tab Grab Express (`src/surfaces/DeliveryBookSurface.tsx` bản tablet · `src/surfaces/pc/PosPcDeliveryBook.tsx` bản PC)
- Tab **Grab Express** (cạnh Nhà hàng tự giao / AhaMove / Loship).
- Bộ lọc: khoảng ngày · **Trạng thái Grab Express** (10 trạng thái, viết đầy đủ không viết tắt) · tìm Mã vận đơn/Số hóa đơn/khách.
- Lưới (đã áp update yêu cầu mới nhất — xem mục *Update Google Doc* bên dưới): **Mã vận đơn / hóa đơn** · **Order/Hóa đơn** (cột riêng) · Khách hàng (tên + địa chỉ gộp 4 cấp) · **SĐT tài xế** · Giờ hẹn trả · Phí thu khách · Phí trả đối tác · Tổng tiền · **Trạng thái Grab Express** (đã ẩn cột Trạng thái CukCuk) · **Thời gian** cập nhật.
- Thao tác theo trạng thái: **Chờ gửi đối tác** → **Giao hàng**/Hủy (đổi tên từ "Gửi đơn hàng") · **Chờ/Đang giao hàng** → tự đồng bộ, chỉ còn Hủy · **Chờ thu tiền (GE=COMPLETED)** → Thu tiền/Hủy · **Đã thanh toán** → icon.
- **Nhấp đúp vào đơn đang giao vận** (đã gửi đối tác) → mở **bản đồ lộ trình giao hàng** (`src/components/DriverMapMock.tsx`): tuyến đường quán→khách, vị trí tài xế theo % tiến trình trạng thái GE, tên/SĐT tài xế, ETA.
- **Mô phỏng Grab Express cập nhật** → đẩy trạng thái GE + sinh **thông báo** đúng format:
  *"Đơn hàng ‹Số HĐ/Order› (Mã vận đơn) của khách hàng ‹tên› đã được Grab Express cập nhật trạng thái ‹trạng thái›"* → click mở đúng dòng.
- Lưu ý: đơn đã chuyển đối tác → hệ thống **chỉ nhận** trạng thái GE, **không tự map/chuyển** trạng thái CukCuk.

### 4. POS PC — Order & Sổ giao hàng (`src/surfaces/pc/`)
- **Full UI POS PC** dựng theo ảnh chụp thật (Omnissa VDI) + design system enterprise SaaS tham khảo (`Docs/Design system`): header xanh full-width, tab **Order / Sơ đồ / Order Online**, `+ORDER` dropdown (Tại bàn/Mang về/**Giao hàng**), menu **Nghiệp vụ** (hamburger) có mục **Sổ giao hàng**.
- **Order (gọi món)**: lưới món 5 cột trái + giỏ hàng phải (Tên món/SL/Thành tiền), footer **Hủy bỏ / Gửi bếp/bar / Cất / Cất & Thêm / Tính tiền**.
- **`+ORDER › Thêm order Giao hàng`** → mở popup **Thông tin giao hàng** (`PosPcDeliveryInfoModal.tsx`, radio Ngồi tại bàn/Gói mang về/**Giao hàng tận nơi**, trái = thông tin khách hàng, phải = Hình thức giao hàng/đối tác) — tái dùng đúng nghiệp vụ COD/quote/validate của bản tablet (`constants.ts` dùng chung).
- **Danh sách order** (`PosPcOrderListScreen.tsx`): tab Chờ thanh toán/Mang về/**Chờ giao hàng**/Đặt trước dạng card, icon Giao hàng để gửi đối tác.
- **Thu tiền khách hàng** (`PosPcCollectModal.tsx`): Khách hàng/Tổng tiền/Tiền đặt cọc-Voucher-chiết khấu ĐTGH/Còn phải thu (tự tính)/Hình thức thanh toán.
- **Sổ giao hàng PC** (`PosPcDeliveryBook.tsx`): bảng full-window (không khung tablet), đủ cột theo update mới nhất, double-click mở bản đồ lộ trình.
- Dùng **chung state** `orders`/`connection`/`notifications` với bản tablet qua `App.tsx` → 2 bề mặt luôn đồng bộ dữ liệu theo thời gian thực.

## Update Google Doc (áp dụng cả bản tablet + PC)

| # | Yêu cầu | Trạng thái |
|---|---|---|
| 1 | "Mã vận đơn / Số HĐ" → "Mã vận đơn / hóa đơn" | ✅ |
| 2 | Thêm cột Order/Hóa đơn (tách riêng khỏi Mã vận đơn) | ✅ |
| 3 | Thêm cột SĐT tài xế | ✅ |
| 4 | Thêm cột Thời gian cạnh Trạng thái Grab Express | ✅ |
| 5 | Ẩn cột Trạng thái đơn (CukCuk), chỉ giữ Trạng thái Grab Express | ✅ |
| 6 | Không viết tắt (GE→Grab Express, HĐ→Hóa đơn, GH khác→giao hàng) | ✅ |
| 7 | Đổi nút "Gửi đơn hàng" → "Giao hàng" | ✅ |
| 8 | Nhấp đúp đơn đang giao → bản đồ lộ trình + vị trí tài xế | ✅ (mock tĩnh) |
| 9 | Đơn Grab đã lấy hàng có cho hủy không? / Báo cáo bỏ cột "nhà hàng tự giao" | 📋 để lại — chưa chốt phạm vi màn Báo cáo |

## Sơ đồ luồng

```mermaid
flowchart TD
    A[Ứng dụng › Grab Express] -->|Chưa kết nối| B[Form kết nối<br/>SĐT/Địa chỉ + VAT]
    B -->|Validate OK & thuộc khu vực GE hỗ trợ| C[Đã kết nối]
    B -.Ngoài khu vực hỗ trợ / trống / email sai.-> B

    C --> D[POS: Tạo đơn giao hàng<br/>Đối tác = Grab Express]
    D -->|Lưu / Lưu & Thêm| E{COD ≤ 2tr &<br/>trong khu vực GE hỗ trợ?}
    E -.Không.-> X[Cảnh báo → Chọn đối tác GH khác]
    E -->|Có| F[Chờ gửi đối tác]
    F -->|Gửi đơn hàng → kiểm tra kết nối| G[Chờ giao hàng<br/>Mã vận đơn · GE=ALLOCATING]
    G -->|Giao hàng| H[Đang giao hàng]
    H -->|Thu tiền| I[Đã thanh toán]

    G -. GE trả trạng thái .-> N[Thông báo → Sổ giao hàng]
    H -. GE trả trạng thái .-> N
```

### State machine Grab Express (do GE trả về)

```mermaid
flowchart LR
    ALLOCATING --> PENDING_PICKUP --> PICKING_UP --> PENDING_DROP_OFF --> IN_DELIVERY --> COMPLETED
    PICKING_UP -.-> CANCELLED
    ALLOCATING -.-> FAILED
    IN_DELIVERY -.-> IN_RETURN --> RETURNED
```

`COMPLETED` / `RETURNED` = trạng thái kết thúc → cho phép Hủy kết nối không cảnh báo giao vận.

## Đối chiếu yêu cầu (mindmap `../Luồng`)

| Nhóm yêu cầu | Trạng thái |
|---|---|
| Ứng dụng: thêm Grab Express, đổi Grab → Grab Food | ✅ |
| Form kết nối + lấy thông tin Thiết lập chung | ✅ |
| Checkbox VAT + Email bắt buộc + link GG Form | ✅ |
| Validate trống / email sai / địa chỉ ngoài khu vực Grab Express hỗ trợ | ✅ |
| Kết nối → Cập nhật/Hủy; Hủy phân nhánh theo trạng thái đơn | ✅ |
| POS: Danh sách order (nhóm, chip GE, ẩn Đang giao/Đã TT) | ✅ |
| Thông tin giao hàng: dịch vụ khóa, phí trả đối tác/thu khách, ghi chú 255 | ✅ |
| Địa chỉ mặc định / lưu địa chỉ mới | ✅ |
| COD mặc định = còn phải thu, cảnh báo > 2tr | ✅ |
| Gửi đơn → kiểm tra kết nối → thông tin gửi sang GE | ✅ |
| Luồng trạng thái Chờ gửi → Chờ giao → Đang giao → Đã TT | ✅ |
| Sổ giao hàng: tab GE, bộ lọc, lưới, thao tác theo trạng thái | ✅ |
| 10 trạng thái GE + không auto-map | ✅ |
| Thông báo GE trả về + click mở đúng hóa đơn | ✅ |
| Xác nhận đơn online: chọn đối tác Grab Express → Xác nhận / Xác nhận & Giao hàng | ✅ |

## Cấu trúc mã

```
src/
├── App.tsx                       # shell + chuyển 4 bề mặt + state dùng chung
├── constants.ts                  # khu vực GE hỗ trợ, COD 2tr, message chuẩn, nhãn trạng thái, state machine
├── types.ts · data.ts            # domain types + mock (kết nối, khách, đơn nhiều trạng thái, tài xế)
├── components/
│   ├── ui.tsx                    # Modal, ConfirmDialog, AlertPopup, Field, Toast, GE pill, Grab mark
│   └── DriverMapMock.tsx         # bản đồ lộ trình + vị trí tài xế (dùng chung tablet + PC)
└── surfaces/
    ├── WebConnectSurface.tsx     # bề mặt 1 — Web quản lý
    ├── PosOrderSurface.tsx       # bề mặt 2 — POS bán hàng (tablet)
    ├── DeliveryBookSurface.tsx   # bề mặt 2 — Sổ giao hàng (tablet)
    └── pc/                       # bề mặt 3 — POS PC
        ├── PosPcApp.tsx              # container: điều hướng + state soạn đơn
        ├── PosPcShell.tsx            # header xanh + Nghiệp vụ + ORDER dropdown
        ├── PosPcOrderScreen.tsx      # gọi món + giỏ hàng
        ├── PosPcDeliveryInfoModal.tsx# popup Thông tin giao hàng
        ├── PosPcOrderListScreen.tsx  # danh sách order dạng card
        ├── PosPcCollectModal.tsx     # popup Thu tiền khách hàng
        └── PosPcDeliveryBook.tsx     # Sổ giao hàng full-window
```
