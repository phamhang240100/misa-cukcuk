# Domain Research — CukCuk x ShopeeFood ISV Integration

> Domain: Restaurant POS ↔ food-delivery aggregator integration (ShopeeFood ISV, OAuth2 device-code)
> Generated: 2026-07-22
> Sources: see per-question `source_url` and reference list at bottom

## 1. Competitor / reference comparison table

| Nền tảng | Mô hình kết nối | Đồng bộ menu | Nhận đơn tại POS | Đối soát | Điểm mạnh UX | Điểm yếu / giới hạn (theo nguồn) |
|---|---|---|---|---|---|---|
| **iPOS FoodHub** (iPOS.vn) | Kết nối qua app iPOS FoodHub, gom nhiều app giao đồ ăn (GrabFood, ShopeeFood, MoMo CHOL, WebOrder) vào 1 hệ thống | Đồng bộ nhanh từ FABi/FABiBox ra nhiều nền tảng; đánh dấu hết món, chỉnh giá theo kênh, hiển thị nhóm món/size/topping trên thiết bị POS | Tất cả đơn từ các kênh dồn về **1 máy POS duy nhất**, tự động đẩy xuống KDS bếp, theo dõi trạng thái đơn real-time | Doanh thu đa kênh đồng bộ về FABi, báo cáo doanh thu chi tiết theo kênh gồm chiết khấu, phí sàn, phí giao hàng | Màn hình "unified order" hợp nhất mọi kênh — giảm thao tác chuyển app | Trang chỉ nói lợi ích kinh doanh, không công bố chi tiết kỹ thuật KDS/exception handling |
| **Sapo FnB** | QR code hiển thị trên Sapo, quét bằng app Shopee Partner (đăng nhập quyền admin quán) để xác thực; **QR có hiệu lực 15 phút** | Bật "Cho phép bán trên ShopeeFood" → đẩy tên/ảnh/mô tả/giá từ Sapo sang ShopeeFood; giá ShopeeFood mặc định = giá bán chuẩn Sapo, có thể tách chính sách giá riêng kênh; **liên kết mặt hàng chỉ thực hiện 1 lần** lúc kết nối ban đầu, các món mới sau này phải liên kết thủ công lại | Đơn "Chờ nhận" → **auto-accept sau 2 phút nếu không thao tác**; có thể từ chối với lý do (hết hàng, đóng cửa, sai giá); trạng thái tài xế: Đang tìm ship → Đã có shipper → Shipper đã lấy → Giao thành công; nút "In mặt hàng" gửi bếp; đơn hủy hiện nhãn đỏ "Đơn bị hủy" + tự in phiếu hủy bếp | Doanh thu bán hàng & thuế khấu trừ ShopeeFood hiển thị ngay trên Sapo | QR-based linking rất giống flow OAuth device-code của CukCuk; auto-accept timer là pattern chuẩn ngành | Việc liên kết món chỉ 1 lần → rủi ro món mới không tự map, cần thao tác thủ công |
| **KiotViet FnB** | Mở app KiotViet Restaurant Mgmt → "Nhiều hơn" → ShopeeFood → chọn chi nhánh → mở "Shopee Partner" → xác nhận điều khoản → "Xác nhận & Tích hợp" | **Auto-fuzzy-match tên món ≥80% giống nhau** giữa 2 hệ thống ngay sau kết nối; 2 tab soát: "Món" và "Nhóm tùy chọn"; món không khớp có thể map tay hoặc tạo nhanh; "Xác nhận thực đơn" để chốt trước khi bán | Thông báo real-time + âm thanh khi có đơn; **2 chế độ**: "Xác nhận thủ công" (auto-accept sau 2 phút nếu bỏ qua) hoặc "Tự động xác nhận" (confirm ngay); 3 trạng thái: Chờ xử lý / Đã xử lý / Đã hủy; "Đã làm xong" báo tài xế; đơn tự hoàn tất khi giao xong | Doanh thu ghi nhận là "Tổng tiền quán nhận" (đã trừ hoa hồng đối tác) | Auto-fuzzy-match tên món giảm thao tác thủ công đáng kể so với Sapo; cho phép chọn chế độ auto-confirm toàn cục | — |
| **Ocha POS** | Có tài liệu đào tạo chính thức từ ShopeeFood Uni cho việc kết nối/gian hàng, nhưng nội dung chi tiết (steps) không truy cập được qua trang public (yêu cầu đăng nhập khóa học) | Không xác nhận được chi tiết qua nguồn công khai | Không xác nhận được chi tiết qua nguồn công khai | Không xác nhận được | Được ShopeeFood liệt kê là đối tác POS chính thức có khóa học riêng | Nội dung sau paywall/login — không kiểm chứng được chi tiết |
| **Nhanh.vn** | 1 tài khoản đăng nhập Nhanh.vn quản lý đơn từ nhiều app giao đồ ăn, đồng bộ qua điện thoại hoặc máy POS | Không có chi tiết kỹ thuật công khai về mapping món | Đơn đồng bộ nhanh qua điện thoại/POS | Không có chi tiết công khai | — | Nguồn xác nhận: "ShopeeFood hiện chưa công bố thông tin API" — mâu thuẫn với thực tế ISV hiện tại → nguồn này đã cũ, không đáng tin cho phần API |
| **GrabMerchant app** | App quản lý đơn GrabFood/GrabMart + GrabPay, 1 app cho toàn bộ vận hành merchant | — | 1 app quản lý đơn cho nhiều dịch vụ Grab (food + mart) | — | Thiết kế phải phục vụ nhiều vai trò (chủ quán kiêm thu ngân) — ghi nhận trong nghiên cứu UI/usability học thuật | — |

**Nhận định chung (đồng thuận đa nguồn):** Xu hướng ngành VN là (1) unified order screen gom mọi kênh giao hàng vào 1 màn hình duy nhất trên POS, (2) auto-accept timer ~2 phút làm fallback an toàn khi nhân viên bận, (3) menu linking có 2 trường phái — auto-fuzzy-match (KiotViet) tốt hơn manual one-time-only (Sapo) vì giảm rủi ro món mới không đồng bộ.

## 2. Best practice tích hợp aggregator ↔ POS (nguồn quốc tế)

- **Webhook + idempotency**: gán unique ID cho mỗi event, lưu ID đã xử lý kèm timestamp để chặn duplicate khi bên gửi (Grab/Shopee-style platforms) retry cùng 1 webhook nhiều lần. (nguồn: KitchenHub)
- **Ack trước, xử lý sau**: trả 200 OK ngay khi nhận webhook, xử lý nghiệp vụ bất đồng bộ qua queue để tránh timeout khiến bên gửi retry chồng chéo. (KitchenHub)
- **Time-window accept/deny**: chuẩn ngành quốc tế (DoorDash-style) là phải accept/deny trong một khung giờ cố định (ví dụ 11.5 phút) nếu không đơn tự hủy — tương tự cơ chế auto-accept 2 phút của Sapo/KiotViet nhưng ở quy mô lớn hơn. (Wix Restaurants API docs)
- **Vì ShopeeFood API không hỗ trợ webhook replay** (đã biết từ trước, ghi trong input) → best practice là **polling định kỳ `order.get_details`/order-list API làm cơ chế dự phòng đối soát** khi nghi ngờ có webhook bị miss, kết hợp mapping trạng thái 1 chiều (không cho phép trạng thái tụt lùi). (KitchenHub — status mapping "enforce one-directional updates")
- **Unified order aggregation**: các nền tảng quốc tế (Deliverect, Checkmate, Olo, OrderOut) đều định vị là lớp trung gian gom nhiều kênh giao hàng vào 1 luồng đơn hàng đẩy thẳng vào POS — xác nhận lại xu hướng "unified order screen" thấy ở thị trường VN.

## 3. Customer journey ShopeeFood ảnh hưởng tới thao tác POS

Luồng chuẩn (theo help.shopee.vn, driver.shopeefood.vn, bachhoaxanh.com):

1. Khách đặt đơn → 2. Hệ thống tìm tài xế ("Đang tìm ship...") → 3. Tài xế nhận đơn + quán chuẩn bị món (song song) → 4. Tài xế tới lấy hàng → 5. Giao khách → 6. Khách nhận & thanh toán/hoàn tất.

Điểm chạm ảnh hưởng POS:
- **Khóa nút hủy sau khi quán bấm "Chấp nhận"** — vì hệ thống coi là đã bắt đầu chế biến. → CukCuk cần đảm bảo trạng thái "đã chấp nhận" trên POS đồng bộ tức thời để tránh quán vẫn thấy nút hủy dù ShopeeFood đã khóa.
- **Auto-hủy nếu "Đang tìm tài xế" quá 10-15 phút không tìm được tài xế**, hoặc quán đóng cửa/tạm đóng và tài xế xác nhận điều đó → đơn tự hủy phía ShopeeFood, POS phải nhận được cancel event và tự in phiếu hủy bếp (như Sapo làm).
- **Món hết hàng phát hiện giữa chừng**: tài xế phải gọi khách trước khi bớt món; hủy toàn đơn cần phối hợp với quán → gợi ý CukCuk cần luồng "báo hết món/hủy một phần" đồng bộ ngược lên ShopeeFood, không chỉ đồng bộ sold-out trước khi nhận đơn.
- **Giá menu lệch**: tài xế chụp hóa đơn báo khách nếu giá POS khác giá hiển thị trên app → nhấn mạnh tầm quan trọng của đồng bộ giá 2 chiều chính xác, tránh lệch giá.
- **Quán làm món lâu (>20 phút)**: có hỗ trợ từ ShopeeFood, không ảnh hưởng điểm tài xế, nhưng ảnh hưởng trải nghiệm khách — gợi ý cảnh báo "quá giờ chuẩn bị" trên màn POS.

## 4. Đối soát tài chính (tax/commission) — cập nhật quan trọng

- Từ **01/04/2025** (theo Luật số 56/2024/QH15 & Nghị định 117/2025/NĐ-CP): **ShopeeFood tự động khấu trừ, kê khai và nộp thuế thay** đối tác kinh doanh — thuế bị trừ tự động **trước khi** tiền được chuyển vào tài khoản người bán. Đối tác đã bị khấu trừ **không cần tự kê khai/nộp** thuế GTGT & TNCN cho các giao dịch đó nữa.
- **Phí hoa hồng (commission) theo thỏa thuận hợp tác giữa ShopeeFood và đối tác không được tính vào doanh thu chịu thuế** (Nghị định 117/2025/NĐ-CP).
- **Hàng tháng ShopeeFood gửi mẫu đối soát (reconciliation template) qua email** cho đối tác nhà hàng để xác nhận doanh thu, phí hoa hồng và các khoản liên quan; đối tác cũng có thể tự tra cứu qua ShopeeFood Partner/Merchant > Báo cáo > Xem tổng hợp > Quản lý, tùy chỉnh khoảng thời gian.
- Chưa tìm được nguồn tiếng Việt xác nhận chi tiết cơ chế **chia sẻ chi phí "Price Slash"/mã giảm giá** giữa ShopeeFood và quán tại VN (chỉ có nguồn Shopee Malaysia nói merchant tự tạo discount qua tab Promotion, không xác nhận cơ chế trợ giá 2 bên tại VN) — cần merchant.shopeefood.vn/edu xác nhận riêng, KHÔNG khẳng định số liệu.

## 5. Đề xuất UX cụ thể theo từng màn hình (dựa trên bằng chứng ở trên)

**Màn kết nối (QR / device-code):**
- Hiển thị đồng hồ đếm ngược hết hạn ngay trên mã QR (tham chiếu Sapo: QR hết hạn sau 15 phút) và nút "Tạo mã mới" khi hết hạn, thay vì để người dùng phát hiện lỗi khi quét mã đã hết hạn — nhưng **thời hạn thực tế phải lấy từ device_code expiry của ShopeeFood OAuth2 server**, không tự chọn 15 phút cho CukCuk.
- Sau khi quét thành công, hiển thị rõ trạng thái từng bước (đang xác thực → đã liên kết chi nhánh → đang đồng bộ menu lần đầu) thay vì một loading chung chung — theo mô hình từng bước rõ ràng của KiotViet.

**Màn thiết lập menu (mapping dish/topping):**
- Áp dụng auto-fuzzy-match tên món (kiểu KiotViet, ngưỡng ~80% tương đồng) ngay sau khi đồng bộ lần đầu, giảm thao tác map tay so với mô hình one-time-manual-link của Sapo.
- Tách 2 tab rà soát riêng: "Món" và "Nhóm topping/tùy chọn" (theo KiotViet) để nhân viên không bị rối khi cùng lúc xử lý cả món và topping.
- Với món mới tạo sau này, tự động chạy lại fuzzy-match thay vì yêu cầu map thủ công 100% (khắc phục điểm yếu của Sapo).

**Màn nhận đơn (POS order screen):**
- Thiết kế unified order screen có nhãn/badge kênh rõ ràng (theo iPOS FoodHub/KiotViet), chừa kiến trúc mở rộng cho các kênh giao hàng khác trong tương lai dù hiện tại chỉ có ShopeeFood.
- Hiển thị đồng hồ đếm ngược auto-accept (theo mô hình 2 phút của Sapo/KiotViet) ngay trên từng đơn đang chờ, và cho phép quán chọn chế độ "Xác nhận thủ công" hoặc "Tự động xác nhận" trong Cài đặt.
- Khi nhận cancel event từ ShopeeFood, tự động hiện nhãn đỏ "Đơn bị hủy" và tự in phiếu hủy bếp nếu đơn đã được đẩy in trước đó (theo Sapo), tránh bếp tiếp tục chế biến đơn đã hủy.

## Question bank

```json
[
  {
    "id_prefix": "DOM",
    "question": "Thời hạn hiệu lực của device-code/QR (do ShopeeFood OAuth2 server quy định) là bao nhiêu phút, và màn kết nối CukCuk có cần hiển thị đồng hồ đếm ngược + nút 'Tạo mã mới' khi hết hạn (giống Sapo hiển thị QR hiệu lực 15 phút) thay vì để người dùng tự phát hiện lỗi khi quét mã đã hết hạn?",
    "impact": "high",
    "suggested_default": "Xác nhận thời hạn thực tế từ ShopeeFood device-code API, hiển thị đếm ngược trên UI và tự động cho phép 'Tạo mã mới' khi hết hạn (không tự đặt cứng 15 phút nếu ShopeeFood quy định khác)",
    "source_url": "https://help.sapo.vn/ket-noi-tai-khoan-va-lien-ket-mat-hang-shopee-food-voi-sapo"
  },
  {
    "id_prefix": "DOM",
    "question": "Khi có món mới tạo trên CukCuk sau khi đã kết nối ShopeeFood, hệ thống có tự động gợi ý map theo tên giống (fuzzy match) như KiotViet (khớp ≥80% tên món), hay bắt buộc thao tác map thủ công mỗi lần như Sapo (chỉ map 1 lần duy nhất lúc kết nối ban đầu)?",
    "impact": "high",
    "suggested_default": "Auto-match theo tên món tương tự, hiển thị danh sách chưa khớp để nhân viên xác nhận/link thủ công (theo mô hình KiotViet)",
    "source_url": "https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-foodapp/ket-noi-shopeefood/"
  },
  {
    "id_prefix": "DOM",
    "question": "CukCuk có cần 2 chế độ nhận đơn — 'Xác nhận thủ công' (có auto-accept timeout dự phòng) và 'Tự động xác nhận toàn bộ' — để quán tự chọn theo mô hình vận hành, giống KiotViet, hay chỉ hỗ trợ 1 chế độ cố định?",
    "impact": "high",
    "suggested_default": "Mặc định 'Xác nhận thủ công' với auto-accept sau 2 phút không thao tác; cho phép quán bật 'Tự động xác nhận' trong Cài đặt",
    "source_url": "https://help.sapo.vn/nhan-va-xu-ly-don-hang-shopee-food-tren-sapo"
  },
  {
    "id_prefix": "DOM",
    "question": "Vì API ShopeeFood không hỗ trợ replay webhook đã miss, chiến lược đối soát dự phòng là gì — polling định kỳ order.get_details/order-list theo chu kỳ bao lâu, và khi phát hiện đơn bị miss thì cảnh báo cho ai (nhân viên quán / vận hành CukCuk)?",
    "impact": "high",
    "suggested_default": "Polling order-list mỗi 2-5 phút để đối chiếu đơn mới, cảnh báo popup + log cho nhân viên thu ngân nếu phát hiện đơn ShopeeFood chưa có trên POS",
    "source_url": "https://www.trykitchenhub.com/post/reliable-webhook-handling-best-practices-to-prevent-duplicate-data-in-your-pos"
  },
  {
    "id_prefix": "DOM",
    "question": "Khi ShopeeFood tự động hủy đơn (do không tìm được tài xế >10-15 phút, hoặc quán được tài xế xác nhận đã đóng cửa), CukCuk có tự động in phiếu hủy gửi bếp nếu đơn đã được đẩy in trước đó không (giống Sapo hiện nhãn đỏ 'Đơn bị hủy' + tự in phiếu hủy bếp)?",
    "impact": "high",
    "suggested_default": "Có — khi nhận cancel event, nếu đơn đã in bếp thì tự in phiếu hủy bổ sung kèm mã đơn để nhân viên bếp dừng chế biến",
    "source_url": "https://help.sapo.vn/nhan-va-xu-ly-don-hang-shopee-food-tren-sapo"
  },
  {
    "id_prefix": "DOM",
    "question": "Từ 01/04/2025 ShopeeFood tự khấu trừ và nộp thuế thay đối tác trước khi chuyển tiền — CukCuk có cần đối chiếu số tiền thực nhận (net-of-tax, net-of-commission) khớp với mẫu đối soát hàng tháng ShopeeFood gửi qua email, hay chỉ ghi nhận số liệu gross rồi để kế toán tự xử lý thuế?",
    "impact": "high",
    "suggested_default": "Ghi nhận cả gross revenue và net-of-commission/tax theo báo cáo ShopeeFood, đánh dấu rõ khoản thuế đã khấu trừ để không hạch toán trùng",
    "source_url": "https://merchant.shopeefood.vn/edu/article/cap-nhat-quan-trong-ve-quy-dinh-thue-khi-kinh-doanh-tren-shopeefood-ap-dung-tu-01042025"
  },
  {
    "id_prefix": "DOM",
    "question": "Khi quán tạm đóng cửa ngoài lịch (nghỉ đột xuất, hết nguyên liệu toàn bộ) mà tài xế đã tới nơi và xác nhận đóng cửa, ShopeeFood tự hủy đơn — CukCuk có cơ chế đồng bộ 'tạm ngưng nhận đơn' 2 chiều (bật ở POS → tắt gian hàng ShopeeFood ngay lập tức) để tránh tình huống này xảy ra từ trước không?",
    "impact": "high",
    "suggested_default": "Nút 'Tạm ngưng bán online' trên POS đẩy trạng thái đóng cửa lên ShopeeFood ngay lập tức (không cần đợi lịch hoạt động theo giờ)",
    "source_url": "https://driver.shopeefood.vn/tin-tuc/huong-dan-xu-ly-nhung-tinh-huong-thuong-gap-tai-buoc-nhan-don-va-lay-hang/"
  },
  {
    "id_prefix": "DOM",
    "question": "Màn hình nhận đơn của CukCuk cho ShopeeFood có nên thiết kế theo hướng 'unified order screen' (gộp nhãn kênh, chuẩn bị sẵn chỗ cho các kênh giao hàng khác trong tương lai) giống mô hình iPOS FoodHub/KiotViet FnB, hay thiết kế riêng biệt chỉ dành cho ShopeeFood?",
    "impact": "medium",
    "suggested_default": "Thiết kế màn hình đơn hàng chung có nhãn/badge kênh (ShopeeFood), kiến trúc chừa chỗ mở rộng kênh khác sau này",
    "source_url": "https://ipos.vn/nhan-don-online-tu-dong-tren-may-tinh-tien-pos/"
  },
  {
    "id_prefix": "DOM",
    "question": "Khi phát hiện món hết hàng giữa chừng sau khi đơn đã được xác nhận (tài xế đã gọi khách xác nhận bớt món), CukCuk có hỗ trợ thao tác 'bớt món/hủy một phần' đồng bộ ngược lên ShopeeFood và điều chỉnh lại tổng tiền đơn, hay chỉ hỗ trợ hủy toàn bộ đơn?",
    "impact": "medium",
    "suggested_default": "Hỗ trợ hủy một phần món trong đơn đã xác nhận, tự động điều chỉnh tổng tiền và đồng bộ lên ShopeeFood",
    "source_url": "https://driver.shopeefood.vn/tin-tuc/huong-dan-xu-ly-nhung-tinh-huong-thuong-gap-tai-buoc-nhan-don-va-lay-hang/"
  },
  {
    "id_prefix": "DOM",
    "question": "Cơ chế chia sẻ chi phí khuyến mãi/mã giảm giá (Price Slash, merchant discount) giữa ShopeeFood và quán — quán có phải gánh 1 phần chi phí giảm giá khi tham gia chương trình khuyến mãi của sàn không, và CukCuk có cần hiển thị riêng khoản 'merchant-funded discount' trong đối soát để phân biệt với discount do sàn tự chi trả?",
    "impact": "medium",
    "suggested_default": "Chưa xác nhận được cơ chế cụ thể tại VN qua nguồn công khai — cần hỏi trực tiếp merchant.shopeefood.vn/edu hoặc hợp đồng đối tác để xác nhận tỷ lệ chia sẻ chi phí trước khi thiết kế màn đối soát",
    "source_url": "https://help.shopee.com.my/portal/1/article/78383-%5BShopeeFood-Merchant%5D-How-to-Manage-Item-Discounts-via-Promotion-in-the-Partner-App"
  }
]
```
