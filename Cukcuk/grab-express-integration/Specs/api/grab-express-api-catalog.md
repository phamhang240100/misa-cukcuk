---
type: api-catalog
feature: grab-express
status: draft
updated: 2026-07-20
source: developer-beta.stg-myteksi.com/docs/grab-express (fetched live 2026-07-20) — see §11
---

# Grab Express — API Catalog & Gap Analysis (C86574)

Tài liệu này liệt kê **toàn bộ API Grab Express cần dùng**, chi tiết từng field request/response, và phân tích **API/field Grab có nhưng CukCuk chưa dùng** vs **thứ CukCuk cần nhưng Grab không cung cấp**. Nguồn: fetch trực tiếp trang tài liệu chính thức Grab (không phải suy luận từ file cũ) — xem [[cukcuk-verify-over-provided-files]].

Đối chiếu nghiệp vụ: `../grab-express-brd.md`, `../sequence/grab-express-flow-spec.md`. Bảng mapping trạng thái đầy đủ: `grab-express-status-mapping.md`.

---

## 1. Xác thực (Auth)

| Mục | Giá trị |
|---|---|
| Cơ chế | OAuth 2.0 `client_credentials` |
| Token endpoint | `POST https://partner-api.grab.com/grabid/v1/oauth2/token` (staging = production, khác base path gọi API) |
| Scope | `grab_express.partner_deliveries` |
| Request body | `client_id`, `client_secret`, `grant_type=client_credentials`, `scope` |
| Response | `access_token` (JWT), `token_type=Bearer`, `expires_in` (mặc định ~7 ngày) |
| Cache | Tái sử dụng token tới khi hết hạn; gặp `401` thì tự refresh nền rồi gọi lại (BR-grab-express-001) |
| Base URL staging | `https://partner-api.grab.com/grab-express-sandbox` |
| Base URL production | `https://partner-api.grab.com/grab-express` |
| Header bắt buộc mọi API | `Content-Type: application/json`, `Authorization: Bearer <token>` |

---

## 2. Danh sách API (endpoint đầy đủ theo docs chính thức)

| # | Method | Path | Dùng cho | Trạng thái trong thiết kế CukCuk |
|---|---|---|---|---|
| 1 | POST | `/v1/deliveries/quotes` | Báo giá trước khi tạo đơn | ✅ Đã dùng (FR-pos-004) |
| 2 | POST | `/v1/deliveries` | Tạo vận đơn | ✅ Đã dùng (FR-pos-020..023) |
| 3 | GET | `/v1/deliveries/{deliveryID}` | Lấy trạng thái đơn (polling dự phòng) | ✅ Đã dùng (FR-pos-034, BR-grab-express-011) |
| 4 | DELETE | `/v1/deliveries/{deliveryID}` | Hủy 1 vận đơn | ✅ Đã dùng (FR-pos-053, BR-grab-express-017) |
| 5 | DELETE | `/v1/merchant/deliveries/{merchantOrderID}` | Hủy TẤT CẢ vận đơn gắn với 1 merchantOrderID | 🆕 **Mới bổ sung phiên này** — dùng làm cơ chế dọn dẹp khi nghi ngờ tạo trùng đơn do timeout (xem §6.1) |
| 6 | POST | `/v1/deliveries/tip/submit` | Tip tài xế sau khi COMPLETED | ⛔ Ngoài phạm vi v1 (xác nhận phiên 2026-07-20 — không có nghiệp vụ tip trong CukCuk) |
| 7 | POST | *(endpoint do CukCuk khai báo lúc đăng ký partner)* | Tracking Webhook — Grab đẩy cập nhật trạng thái | ✅ Đã dùng (FR-pos-030..034) |

---

## 3. Chi tiết field từng API

### 3.1 POST `/v1/deliveries/quotes` — Báo giá

**Request:**

| Field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `serviceType` | string | không | `INSTANT` / `SAME_DAY` / `BULK` — CukCuk khóa cứng `INSTANT` (BR-grab-express-002) |
| `vehicleType` | string | không | Mặc định `BIKE` — CukCuk không đổi |
| `codType` | string | không | `REGULAR` / `ADVANCED` — xem §6.3 (chưa rõ nghĩa từ Grab) |
| `packages[]` | array | có | `name`, `description` (≤500 ký tự), `quantity`, `price`, `dimensions{height,width,depth,weight}` |
| `origin` / `destination` | object | có | `address`, `keywords` (tên cửa hàng/tòa nhà), `coordinates{latitude,longitude}` (≥6 số thập phân), `address_L1/L2/L3` (Tỉnh/Quận/Phường), `cityCode`, `extra` |
| `cashOnDelivery.amount` | float64 | không | Số tiền COD dự kiến |
| `paymentMethod` | string | không | `CASH` / `CASHLESS` |
| `promoCode` | string | không | ⛔ Ngoài phạm vi v1 |

**Response:** `quotes[]` (mỗi quote gồm `service{id,type,name="GrabExpress"}`, `currency{code,symbol,exponent}`, `amount` (phí giao), `estimatedTimeline{pickup,dropoff}`, `distance` (mét), `discountInfo{amount,success,errorMsg}`), cộng `packages`/`origin`/`destination` echo lại.

> **Không có quote (lỗi hoặc ngoài vùng)** → CukCuk chặn Lưu đơn, báo E-grab-express-001/005 (BR-grab-express-006: vùng phủ validate động qua chính API này, không hard-code tỉnh).

---

### 3.2 POST `/v1/deliveries` — Tạo vận đơn

**Request:**

| Field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `merchantOrderID` | string | **có** | **Quyết định phiên 2026-07-20: dùng `orderNo` của CukCuk làm giá trị này, cố định không đổi qua các lần gửi lại** — là khóa chống tạo trùng vận đơn (xem §6.1) |
| `serviceType` | string | có | `INSTANT` (khóa) |
| `vehicleType` | string | không | `BIKE` (mặc định) |
| `codType` | string | không | **Quyết định phiên 2026-07-20: gửi `ADVANCED` cho mọi đơn COD** (khớp giả định Mô hình A — tài xế ứng tiền lúc lấy hàng). Grab không định nghĩa rõ 2 giá trị này khác nhau thế nào → **cần xác nhận lại với Grab trước khi go-live** (giữ nguyên OQ-01 liên quan). |
| `paymentMethod` | string | không | `CASHLESS` (mặc định) — khách không trả phí ship trực tiếp cho Grab |
| `payer` | string | không | `SENDER` (mặc định) — **Chỉ `SENDER` được dùng với `CASHLESS`** (rule chính thức từ Grab docs, không phải suy luận) |
| `highValue` | boolean | không | `false` — ⛔ ngoài phạm vi v1 (xác nhận phiên 2026-07-20) |
| `packages[]` | array | có | Giống Quote |
| `cashOnDelivery.amount` | float64 | không | **Không gửi field này nếu đơn không COD** (theo đúng docs Grab — "Do not pass this field if order is not a COD order") |
| `sender{}` | object | có | `firstName` (có), `lastName`, `title`, `companyName`, `email` (email HOẶC phone bắt buộc), `phone` (E.164 không `+`, email HOẶC phone bắt buộc), `smsEnabled` (có), `instruction` (≤1000 ký tự) |
| `recipient{}` | object | có | Cấu trúc giống `sender` |
| `origin` / `destination` | object | có | Giống Quote |
| `schedule.pickupTimeFrom/To` | RFC3339 | không | Chỉ dùng cho `SAME_DAY`/`BULK` — CukCuk dùng `INSTANT` nên **không cần field này** |
| `promoCode` | string | không | ⛔ Ngoài phạm vi v1 |

**Response (các field quan trọng cần lưu vào `DeliveryOrder`):**

| Field | Lưu vào CukCuk? | Ghi chú |
|---|---|---|
| `deliveryID` | ✅ → `trackingNo` | Khóa chính đối soát với Grab (đã đủ, không cần thêm field — xác nhận phiên 2026-07-20) |
| `status` | ✅ → `geStatus` | Giá trị ban đầu `ALLOCATING` |
| `trackingURL` | ✅ **mới thêm** | **Quyết định: dùng làm nút "Xem lộ trình" thay cho bản đồ tự vẽ (DriverMapMock)** — xem §6.2. Hết hạn 48h sau pickup. |
| `courier` (null lúc tạo) | ⚠️ một phần | Chỉ lấy `name`, `phone` khi có (đã có `driverName`/`driverPhone`). **Không lấy** `pictureURL`, `rating`, `vehicle.licensePlate` (xác nhận phiên 2026-07-20: không cần hiển thị) |
| `cashOnDelivery.amount` | ✅ đã có (`codAmount`) | |
| `pickupPin` | ⛔ **Không lưu, không dùng** (xác nhận phiên 2026-07-20 — xem §6.4 lý do) |
| `invoiceNo` (của Grab) | ⛔ **Không lưu field riêng** (xác nhận phiên 2026-07-20 — dùng `trackingNo`/`deliveryID` làm khóa đối soát là đủ) |
| `advanceInfo` | ⚠️ Chỉ dùng `failedReason` khi có, không dùng phần còn lại | |
| `sender` / `recipient` / `quote` | Echo, không cần lưu lại (đã có sẵn ở phía CukCuk) | |

---

### 3.3 GET `/v1/deliveries/{deliveryID}` — Lấy trạng thái (polling dự phòng)

Response giống Create nhưng có thêm:

| Field | Ghi chú |
|---|---|
| `timeline{create,allocate,pickup,dropoff,completed,cancel,return,fail}` | Timestamp từng mốc — hữu ích cho báo cáo SLA nhưng **ngoài phạm vi v1** (chưa có yêu cầu hiển thị) |
| `courier.coordinates{latitude,longitude}` | GPS tài xế thời gian thực — **không dùng** vì đã chọn hướng trackingURL thay vì bản đồ tự build (§6.2) |
| `advanceInfo.failedReason` | Mã lý do khi `status=FAILED` — **Quyết định phiên 2026-07-20: hiển thị lý do cụ thể cho thu ngân** thay vì chỉ ghi chung "Thất bại" (xem bảng mã ở `grab-express-status-mapping.md` §4) |

**Xử lý lỗi 404** (mất đồng bộ, hiếm gặp): **Quyết định phiên 2026-07-20** — dừng tự động hỏi lại (polling) cho đơn đó, hiển thị cảnh báo "Không đồng bộ được với Grab Express" + nút làm mới thủ công, không tự thay đổi `cukcukStatus`.

**Tần suất polling** (chưa có trong thiết kế cũ — bổ sung làm default kỹ thuật, có thể chỉnh khi cấu hình thật):
- Bắt đầu polling nếu sau **60 giây** không nhận được webhook cho một bước chuyển trạng thái đang chờ.
- Polling mỗi **30 giây**.
- Sau **~5 phút** (≈10 lần) không có cập nhật mới → dừng tự động, chuyển sang nút "Làm mới thủ công".

---

### 3.4 DELETE `/v1/deliveries/{deliveryID}` — Hủy vận đơn

Chỉ cho phép khi `status` ∈ `{ALLOCATING, PENDING_PICKUP, PICKING_UP}` (bảng ràng buộc chính thức từ Grab — khớp đúng BR-grab-express-017 đã thiết kế). Response: `204 No Content`.

**Quyết định phiên 2026-07-20 (giữ nguyên hành vi hiện tại):** khi hủy, CukCuk **xóa đơn khỏi danh sách** Sổ giao hàng (không chuyển sang trạng thái kết thúc "Đã hủy" để lưu vết) — team đã cân nhắc và chủ động giữ hành vi đơn giản này cho v1.

---

### 3.5 DELETE `/v1/merchant/deliveries/{merchantOrderID}` — Hủy theo Merchant Order ID 🆕

**API này KHÔNG có trong thiết kế/prototype hiện tại — bổ sung mới từ phiên phân tích này.**

Dùng để hủy **tất cả** vận đơn Grab gắn với 1 `merchantOrderID`, không cần biết `deliveryID`.

**Ca dùng cụ thể cho CukCuk:** khi bấm "Gửi đơn hàng" mà mạng chập chờn/timeout — CukCuk không biết chắc Grab đã tạo vận đơn thành công hay chưa. **Quyết định phiên 2026-07-20:**
1. Luôn gửi `merchantOrderID = orderNo` (cố định, không đổi qua các lần gửi lại) — biến `orderNo` thành khóa idempotency tự nhiên.
2. Trước khi cho phép "Gửi lại" sau lỗi timeout, hệ thống tự gọi `GET /deliveries` (theo `deliveryID` đã lưu nếu có, hoặc kiểm tra qua log/side-channel) để xác nhận đã có vận đơn hay chưa.
3. Nếu phát hiện đã lỡ tạo trùng (2 `deliveryID` cho cùng 1 `merchantOrderID`) → dùng `DELETE /merchant/deliveries/{merchantOrderID}` để dọn dẹp toàn bộ, sau đó tạo lại sạch.

---

### 3.6 POST `/v1/deliveries/tip/submit` — Tip tài xế

Có trong API Grab nhưng **⛔ ngoài phạm vi v1** — CukCuk không có nghiệp vụ tip tài xế. Ghi nhận để biết Grab hỗ trợ, không thiết kế field/UI cho tính năng này.

Ràng buộc (nếu sau này cần): chỉ tip được đơn `COMPLETED`, trong vòng 48h, tip 1 lần duy nhất, không hủy/hoàn được sau khi đã giải ngân.

---

### 3.7 Tracking Webhook — Grab đẩy cập nhật trạng thái

**Headers:** `Content-Type: application/json`, `Authorization` (mô tả chung chung là "API access token key" — **không phải HMAC chữ ký body**), `Authorization-Id`.

> **Đính chính OQ-05:** tài liệu chính thức Grab **không có cơ chế HMAC/chữ ký body** cho webhook — chỉ có 2 header nói trên. Xác thực = so khớp giá trị `Authorization` + `Authorization-Id` với giá trị đã cấu hình lúc kết nối partner. **Vẫn cần xác nhận cơ chế so khớp chính xác với đội kỹ thuật Grab trước khi go-live** (docs không mô tả chi tiết cách CukCuk phải validate 2 header này).

**Payload:**

| Field | Ghi chú |
|---|---|
| `deliveryID`, `merchantOrderID` | Khóa liên kết đơn |
| `timestamp` (unix) | Dùng để bỏ qua event cũ hơn (out-of-order) |
| `status` | Trạng thái mới — xem `grab-express-status-mapping.md` |
| `trackURL` | Hết hạn 48h sau pickup — dùng cho nút "Xem lộ trình" (§6.2) |
| `pickupPin` | ⛔ Không dùng (§6.4) |
| `failedReason` | Dùng khi `status=FAILED` (hiển thị cho thu ngân — quyết định phiên này) |
| `driver{name,phone,licensePlate,photoURL,currentLat,currentLng}` | Chỉ lấy `name`/`phone`; **không lấy** `licensePlate`/`photoURL`/GPS (đã quyết định không cần) |
| `pickupProofURL` / `dropoffProofURL` / `cancelProofURL` | **⛔ Không lưu ở v1** (quyết định phiên 2026-07-20) — các URL này hết hạn ~2h, nếu sau này cần làm bằng chứng tranh chấp phải quay lại thiết kế tải-và-lưu ảnh ngay lúc nhận webhook. |
| `sender.relationship` / `recipient.relationship` | Người nhận hộ (không phải người đặt) — chưa có nghiệp vụ, để trống |

> **Đính chính BR-grab-express-010 (idempotency key):** payload webhook **không có field ID sự kiện riêng nào cả** (đã kiểm chứng lại toàn bộ field). Rule cũ viết "event ID nếu có, fallback deliveryID+status+timestamp" đang hiểu nhầm đây là *phương án dự phòng* — thực tế **đây là phương án DUY NHẤT**, không có "nếu có". Cập nhật: `idempotency key = deliveryID + status + timestamp` (luôn luôn, không có nhánh khác).

---

## 4. Enum tham chiếu

| Enum | Giá trị | CukCuk dùng |
|---|---|---|
| `serviceType` | `INSTANT`, `SAME_DAY`, `BULK` | Chỉ `INSTANT` (khóa cứng, BR-grab-express-002) |
| `vehicleType` | `BIKE`, `CAR`, `JUSTEXPRESS`, `VAN`, `TRUCK`, `TRIKE`, `EBIKE`, `SUV`, `BOXPICKUPTRUCK`, `TRICYCLE`, `CYCLE`, `FOOT` | Chỉ `BIKE` (mặc định) |
| `codType` | `REGULAR`, `ADVANCED` | `ADVANCED` (quyết định phiên này — xem §3.2, cần Grab xác nhận nghĩa thật) |
| `paymentMethod` | `CASH`, `CASHLESS` | `CASHLESS` (mặc định) |
| `payer` | `SENDER`, `RECIPIENT` | `SENDER` (bắt buộc khi `CASHLESS`) |
| Trạng thái vận đơn (11 giá trị) | Xem `grab-express-status-mapping.md` | |

---

## 5. Rate limit (tham khảo khi thiết kế retry/backoff)

| API | Production | Staging |
|---|---|---|
| Quotes | 300 req/s | 5 req/s |
| Create Delivery | 33 req/s | 5 req/s |
| Get Delivery | 33 req/s | 5 req/s |
| Cancel (cả 2 loại) | 33 req/s | 5 req/s |
| Tracking Webhook (nhận vào) | 33 req/s | 5 req/s |
| Submit Tip | 5 req/s | 5 req/s |

---

## 6. GAP ANALYSIS — Tổng hợp các điểm lệch

### 6.1 API Grab có, CukCuk trước đây CHƯA khai thác — nay đã quyết định dùng/không dùng

| Field/API | Có trong Grab? | Quyết định |
|---|---|---|
| `trackingURL` (tracking link cho khách/nhân viên xem lộ trình thật) | ✅ | **Dùng** — thay thế bản đồ tự vẽ (DriverMapMock) |
| `DELETE /merchant/deliveries/{merchantOrderID}` | ✅ | **Dùng** — dọn dẹp khi nghi tạo trùng vận đơn do timeout |
| `advanceInfo.failedReason` | ✅ | **Dùng** — hiển thị lý do cụ thể khi FAILED |
| `pickupPin` | ✅ | **Không dùng** — không có bằng chứng nào (kể cả từ các đơn vị POS VN khác đã tích hợp Grab Express) cho thấy PIN này cần đọc cho tài xế; blog quy trình tài xế chính thức của Grab mô tả xác minh lúc lấy hàng bằng "Mã đơn hàng", không phải PIN |
| `courier.vehicle.licensePlate`, `courier.rating`, `driver.photoURL` | ✅ | **Không dùng** — không cần thiết cho nghiệp vụ hiện tại |
| `pickupProofURL`/`dropoffProofURL`/`cancelProofURL` | ✅ | **Không dùng ở v1** — cân nhắc lại nếu phát sinh nhu cầu bằng chứng tranh chấp |
| `invoiceNo` riêng của Grab | ✅ | **Không lưu field riêng** — `trackingNo` (=`deliveryID`) đã đủ làm khóa đối soát |
| `POST /deliveries/tip/submit` | ✅ | **Ngoài phạm vi** — không có nghiệp vụ tip |
| `highValue`, `promoCode` | ✅ | **Ngoài phạm vi v1** |
| `courier.coordinates` (GPS thời gian thực) | ✅ | **Không dùng** — hệ quả của quyết định dùng trackingURL thay vì bản đồ tự build |

### 6.2 CukCuk cần nhưng Grab KHÔNG cung cấp (gap thật sự — chưa có API)

| Nhu cầu CukCuk | Kết luận sau khi đọc kỹ toàn bộ trang docs |
|---|---|
| API tra cứu **hạn mức COD theo merchant** | **Không tồn tại.** Không có bất kỳ endpoint nào trả về giới hạn COD theo merchant. → BR-grab-express-005 cần viết lại: không phải "đọc từ Grab nếu có API", mà **`MAX_COD` là hằng số cấu hình cố định (mặc định 2.000.000đ), không có lookup động**. Đóng OQ-02. |
| API **sửa/dời lịch giao** sau khi đã tạo đơn | Không có. Chỉ có `schedule.pickupTimeFrom/To` lúc *tạo* đơn (áp dụng cho `SAME_DAY`/`BULK`, không áp dụng `INSTANT`). Muốn đổi giờ hẹn trả sau khi đã gửi đơn → phải hủy (nếu còn hủy được) rồi tạo lại. |
| API **liệt kê/tìm kiếm nhiều vận đơn** cùng lúc | Không có — chỉ có `GET /deliveries/{deliveryID}` theo từng ID. CukCuk phải tự lưu và quản lý danh sách `deliveryID` phía mình (đã đúng theo thiết kế hiện tại, Sổ giao hàng lưu trực tiếp trong `DeliveryOrder`). |
| API/báo cáo **đối soát, thanh toán (settlement)** giữa Grab và merchant | **Không có trong trang tài liệu API đối tác này.** Đây là mảng tài chính/kế toán riêng (khác API vận hành giao nhận) — cần hỏi trực tiếp đội Grab Partnership/Finance, không tìm thấy endpoint liên quan. Ảnh hưởng: FR-rep-001/002 (Bảng kê hóa đơn, Doanh thu theo đối tác) chỉ dùng được dữ liệu **phía CukCuk tự tính** (phí, COD), KHÔNG có nguồn xác nhận chéo tự động từ Grab. Giữ nguyên OQ-06 (mô hình ví/thanh toán) là mở. |
| Event ID duy nhất cho mỗi lần webhook (idempotency "chuẩn") | **Không có** — xem đính chính ở §3.7. Đã đóng OQ-04 với kết luận: chỉ có `deliveryID+status+timestamp`. |
| Cơ chế xác thực chữ ký (HMAC) cho webhook | **Không có** trong docs — chỉ có header `Authorization`/`Authorization-Id` chung chung. Đã đóng OQ-05 một phần: xác nhận "không phải HMAC", nhưng **cách so khớp 2 header cụ thể vẫn cần hỏi đội kỹ thuật Grab** trước go-live. |
| Định nghĩa rõ `codType=REGULAR` khác `ADVANCED` thế nào | **Không có** — trang docs liệt kê 2 giá trị nhưng không giải thích khác biệt chức năng. Team đã quyết định gửi `ADVANCED` (khớp giả định "tài xế ứng tiền lúc lấy hàng") nhưng đây **vẫn là giả định chưa Grab xác nhận** — giữ nguyên như một rủi ro triển khai, nên hỏi Grab trước go-live thật. |
| Mô tả cơ chế hoàn tiền khi tài xế đã ứng COD mà đơn `RETURNED`/`FAILED` | **Không có** — khái niệm "tài xế ứng tiền cho quán" hoàn toàn không xuất hiện trong docs API (chỉ có `cashOnDelivery.amount` = "số tiền cần thu, 0 nếu không COD"). Đây vẫn là giả định nghiệp vụ (Mô hình A) chưa được API hay tài liệu chính thức xác nhận — giữ nguyên OQ-01 mở, mức độ rủi ro cao vì ảnh hưởng trực tiếp luồng tiền. |

### 6.3 `codType` — rủi ro triển khai cần theo dõi

Vì Grab không định nghĩa rõ `REGULAR` vs `ADVANCED`, quyết định gửi `ADVANCED` cho mọi đơn COD (phiên 2026-07-20) là **giả định có rủi ro**. Khuyến nghị: chạy thử ở sandbox với cả 2 giá trị trước go-live, quan sát khác biệt thực tế trong response/webhook (nếu có), và hỏi thẳng đội kỹ thuật/đối tác Grab. Liên quan trực tiếp OQ-01 (cơ chế hoàn ứng COD).

### 6.4 `pickupPin` — vì sao quyết định bỏ

Nghiên cứu riêng trong phiên này (WebSearch) không tìm thấy bất kỳ đơn vị POS Việt Nam nào (Sapo…) hiển thị `pickupPin` cho nhân viên; blog quy trình tài xế chính thức của Grab (`grab.com/vn/en/blog/driver/...`) mô tả xác minh lúc lấy hàng bằng "Mã đơn hàng", không nhắc PIN; đối chiếu Uber Direct (courier tương tự) thì cơ chế PIN chỉ áp dụng ở **giao hàng (dropoff)**, đưa cho **khách hàng**, không phải lúc lấy hàng. → Quyết định: bỏ hoàn toàn field này ở v1, không lưu không hiển thị.

---

## 7. Bảng field cần thêm/bớt vào `DeliveryOrder` (đối chiếu `src/types.ts`)

| Field | Hành động | Lý do |
|---|---|---|
| `trackingUrl` | ➕ Thêm | Nút "Xem lộ trình" mở link Grab thật (thay DriverMapMock) |
| `failedReasonCode` | ➕ Thêm | Hiển thị lý do cụ thể khi `geStatus=FAILED` |
| `pickupPin` | 🚫 Không thêm | Quyết định §6.4 |
| `geInvoiceNo` (invoiceNo riêng của Grab) | 🚫 Không thêm | `trackingNo` đã đủ làm khóa đối soát |
| `driverLicensePlate`, `driverRating`, `driverPhotoUrl` | 🚫 Không thêm | Không cần cho nghiệp vụ hiện tại |
| `pickupProofUrl`/`dropoffProofUrl`/`cancelProofUrl` | 🚫 Không thêm ở v1 | Cân nhắc lại nếu có nhu cầu bằng chứng tranh chấp |
| `codType` (giá trị gửi cho Grab, không cần hiển thị UI) | ➕ Thêm (internal, không hiển thị) | Bắt buộc phải gửi khi tạo vận đơn COD — hiện thiết kế hoàn toàn thiếu field này |
| `merchantOrderID` (= `orderNo`, tường minh hóa) | ℹ️ Không cần field mới | `orderNo` hiện có đã dùng trực tiếp làm giá trị này |

---

## 8. Nguồn tham khảo

- Grab Express API docs (fetch trực tiếp 2026-07-20): `developer-beta.stg-myteksi.com/docs/grab-express/#grabexpress`
- Grab quy trình tài xế GrabExpress (tiếng Việt, chính thức): `grab.com/vn/en/blog/driver/gequytrinhgiaonhandonhang22/`
- Đối chiếu ngành (không phải Grab, chỉ dùng để so sánh mẫu hình pincode): Uber Direct developer docs — `developer.uber.com/docs/deliveries/guides/pincode`
- Prototype hiện có: `src/types.ts`, `src/constants.ts`, `src/surfaces/DeliveryBookSurface.tsx`, `src/surfaces/pc/PosPcDeliveryBook.tsx`, `src/components/DriverMapMock.tsx`
- Quyết định nghiệp vụ trong phiên phân tích: xem `clarification-log-2026-07-20.md`
