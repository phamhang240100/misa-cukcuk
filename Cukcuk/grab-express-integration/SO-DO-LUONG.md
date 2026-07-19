# Sơ đồ luồng — Tích hợp Grab Express vào MISA CukCuk (C86574)

Sơ đồ hóa từ file yêu cầu `Tích hợp Grab Express với CukCuk(C86574).xmind` (mindmap tại `../Luồng/*.jpg`),
đối chiếu tài liệu chính thức [Grab Express — Order State Machine](https://developer.grab.com/docs/grab-express/#order-state-machine)
và tham khảo cách [Sapo tích hợp Grab Express](https://support.sapo.vn/tich-hop-grab-express).

- **Swimlane** chia theo đối tượng tham gia quy trình: **Quản lý NH** · **Thu ngân (POS)** · **Hệ thống CukCuk** · **Grab Express**.
- Một sơ đồ tổng end-to-end: khai báo/kết nối ở Web quản lý → lập đơn ở POS → gửi đơn → giao đơn → theo dõi trạng thái.

> **Khu vực Grab Express hỗ trợ** (dùng trong các bước validate S3 · S6): hiện gồm **Hà Nội · TP. Hồ Chí Minh · Đà Nẵng · Quảng Ninh · Cần Thơ**. Danh sách này có thể thay đổi khi Grab mở rộng vùng phục vụ — sơ đồ dùng cách gọi theo nghiệp vụ thay vì cố định con số "5 tỉnh".

---

## 1. Sơ đồ quy trình (Swimlane end-to-end)

```mermaid
flowchart TD
    subgraph QL["🧑‍💼 Quản lý nhà hàng — Web quản lý"]
        direction TB
        A1["Vào Ứng dụng › Grab Express"]
        A2["Điền form kết nối:<br/>SĐT · Tỉnh/TP · Quận · Phường · Địa chỉ<br/>(tùy chọn: VAT → Email xuất hóa đơn)"]
        A3(["Nhấn Kết nối"])
    end

    subgraph POS["🧾 Thu ngân — POS bán hàng"]
        direction TB
        P1["Lập order giao hàng<br/>Hình thức giao = Grab Express"]
        P2(["Lưu / Lưu & Thêm"])
        P3(["Gửi đơn hàng"])
        P4(["Giao hàng"])
        P5(["Thu tiền"])
        P6["Sổ giao hàng:<br/>theo dõi trạng thái GE"]
    end

    subgraph CUK["⚙️ Hệ thống CukCuk"]
        direction TB
        S1{"Nhà hàng/CN<br/>đã kết nối GE?"}
        S2["Hiển thị form kết nối<br/>(lấy sẵn từ Thiết lập chung)"]
        S3{"Validate:<br/>đủ field? email đúng?<br/>địa chỉ thuộc khu vực<br/>Grab Express hỗ trợ?"}
        S4["✅ Đã kết nối"]
        S5["Hiển thị field GE:<br/>Loại DV (khóa) · Phí trả đối tác (khóa)<br/>· Phí thu khách (sửa được)"]
        S5b["Bấm Lưu: đơn = thu hộ<br/>COD tự tính = Còn phải thu"]
        S6{"COD ≤ 2.000.000đ & địa chỉ<br/>trong khu vực GE hỗ trợ?"}
        S7["Đơn: Chờ gửi đối tác"]
        S8{"Kết nối GE OK?"}
        S9["Đơn: Chờ giao hàng<br/>+ Mã vận đơn · GE = ALLOCATING"]
        S10["Đơn: Đang giao hàng"]
        S11["Nhận trạng thái GE<br/>⚠️ KHÔNG tự map trạng thái CukCuk<br/>→ sinh Thông báo"]
        S12["Đơn: Đã thanh toán"]
    end

    subgraph GE["🛵 Grab Express"]
        direction TB
        G1["Tạo vận đơn<br/>trả deliveryID / Mã vận đơn"]
        G2["State machine:<br/>ALLOCATING → PENDING_PICKUP → PICKING_UP<br/>→ PENDING_DROP_OFF → IN_DELIVERY → COMPLETED<br/>(lỗi: CANCELED / FAILED · trả hàng: IN_RETURN → RETURNED)"]
        G3["Webhook đẩy trạng thái<br/>mỗi lần đổi state"]
    end

    %% --- Kết nối ở Web quản lý ---
    A1 --> S1
    S1 -- "Chưa" --> S2 --> A2 --> A3 --> S3
    S3 -- "Trống / Email sai / Ngoài khu vực hỗ trợ → cảnh báo" --> A2
    S3 -- "Hợp lệ" --> S4
    S1 -- "Rồi" --> S4

    %% --- Lập đơn ở POS ---
    S4 --> P1 --> S5 --> P2 --> S5b --> S6
    S6 -- "Không → cảnh báo,<br/>chọn đối tác GH khác" --> P1
    S6 -- "Có" --> S7 --> P3 --> S8
    S8 -- "Không → popup lỗi kết nối" --> P3
    S8 -- "Có → đẩy đơn sang GE" --> G1 --> S9

    %% --- Trạng thái CukCuk (thao tác thủ công) ---
    S9 --> P4 --> S10 --> P5 --> S12

    %% --- Trạng thái Grab Express (webhook, song song) ---
    S9 -. "GE xử lý giao vận" .-> G2 --> G3
    G3 -. "trạng thái GE" .-> S11
    S11 -. "hiển thị ở thiết bị tạo đơn" .-> P6
    P6 -. "click thông báo → mở đúng hóa đơn" .-> S11

    classDef end0 fill:#00B14F,color:#fff,stroke:#00B14F;
    classDef warn fill:#FEF0C7,stroke:#F79009,color:#7A2E0E;
    class S11 warn;
```

**Ghi chú các nhánh rẽ (business rules):**

| Điểm quyết định | Điều kiện | Xử lý |
|---|---|---|
| `S3` Validate kết nối | Trống field | *"Trường này không được để trống."* |
| | Email sai định dạng | *"Email chưa đúng định dạng, vui lòng kiểm tra lại."* |
| | Địa chỉ ngoài khu vực Grab Express hỗ trợ | Cảnh báo *"Grab Express chỉ hỗ trợ TP Hà Nội, TP HCM, Đà Nẵng, Quảng Ninh, Cần Thơ."* → giữ nguyên, không lưu kết nối |
| `S6` Lưu đơn | COD > 2.000.000đ | Cảnh báo *"GrabExpress chỉ hỗ trợ Thu hộ (COD) tối đa 2.000.000đ…"* → Chọn đối tác GH khác / Đóng |
| | Địa chỉ ngoài khu vực Grab Express hỗ trợ | Cảnh báo tương tự → chọn đối tác khác |
| `S8` Gửi đơn | Không kết nối được GE | Popup *"Chương trình không kết nối được với đối tác giao hàng Grab Express…"* |
| Hủy kết nối (từ `S4`) | Còn đơn ≠ COMPLETED/RETURNED | Cảnh báo *"đang có hóa đơn trong quá trình giao vận…"* → Có / Không |
| | Tất cả đơn = COMPLETED/RETURNED | Cảnh báo thường → Có / Không |

> **Lưu ý cốt lõi:** hai làn **Hệ thống CukCuk** (S9→S10→S12, do thu ngân thao tác thủ công) và **Grab Express** (G2→G3, do webhook) chạy **song song, độc lập**. CukCuk chỉ **nhận và lưu** trạng thái GE để hiển thị + sinh thông báo, **không tự động map/chuyển** trạng thái đơn trên CukCuk.

---

## 2. Sequence diagram — Toàn bộ luồng tích hợp

```mermaid
sequenceDiagram
    autonumber
    actor QL as Quản lý NH
    actor TN as Thu ngân (POS)
    participant CUK as Hệ thống CukCuk
    participant G as GrabID OAuth
    participant GE as Grab Express API

    Note over CUK,GE: 0 · Thiết lập một lần (backend): MISA đăng ký Partner<br/>client_id/secret · callback URL · scope grab_express.partner_deliveries

    rect rgb(255,247,224)
    Note over CUK,G: 1 · Lấy và cache access token
    CUK->>G: POST /oauth2/token (client_credentials, scope)
    G-->>CUK: access_token Bearer (~7 ngày)
    Note over CUK: Cache token tới khi hết hạn hoặc gặp 401
    end

    rect rgb(237,243,255)
    Note over QL,CUK: 2 · Kết nối nhà hàng (Web quản lý)
    QL->>CUK: Điền SĐT, địa chỉ, VAT/Email rồi Kết nối
    Note over CUK: Validate field/email/khu vực GE.<br/>SĐT/địa chỉ = hồ sơ người gửi, KHÔNG phải credential
    CUK-->>QL: Kết nối thành công (nút Cập nhật / Hủy kết nối)
    end

    rect rgb(237,255,243)
    Note over TN,GE: 3 · Lập đơn và báo phí
    TN->>CUK: Lập order, đối tác = Grab Express (Loại DV khóa)
    CUK->>GE: POST /deliveries/quotes (serviceType=INSTANT, origin, destination)
    GE-->>CUK: Phí giao + thời gian dự kiến
    CUK-->>TN: Phí trả đối tác (khóa) · Phí thu khách (sửa được)
    TN->>CUK: Nhập phí thu khách rồi Lưu
    Note over CUK: COD tự tính = Còn phải thu.<br/>Kiểm tra COD ≤ 2tr và địa chỉ trong khu vực GE
    CUK-->>TN: Đơn: Chờ gửi đối tác
    end

    rect rgb(237,255,243)
    Note over TN,GE: 4 · Gửi đơn sang Grab Express
    TN->>CUK: Gửi đơn hàng
    CUK->>GE: POST /deliveries (serviceType, sender, recipient,<br/>packages, cashOnDelivery, paymentMethod)
    GE-->>CUK: deliveryID / Mã vận đơn · ALLOCATING
    Note over CUK: Nếu 401 → xin token mới rồi gọi lại
    CUK-->>TN: Đơn: Chờ gửi đối tác → Chờ giao hàng<br/>(lưu Mã vận đơn, GE = ALLOCATING)
    end

    rect rgb(255,248,237)
    Note over CUK,GE: 5 · Webhook cập nhật trạng thái — CukCuk KHÔNG auto-map
    loop Mỗi lần GE đổi state (giao thành công)
        GE->>CUK: Webhook (deliveryID, status, timestamp)
        Note over CUK: Lưu trạng thái GE, không đổi trạng thái đơn
        CUK-->>TN: Thông báo trạng thái (chỉ thiết bị tạo đơn)
    end
    alt GE trả CANCELED / FAILED / RETURNED
        GE->>CUK: Webhook status = CANCELED / FAILED / RETURNED
        Note over CUK: Đơn CukCuk GIỮ NGUYÊN trạng thái<br/>(Chờ giao hàng / Đang giao hàng)
        CUK-->>TN: Thông báo → thu ngân tự xử lý (Hủy / hoàn)<br/>❓ chưa có quy tắc chốt
    end
    end

    rect rgb(237,243,255)
    Note over TN,CUK: 6 · Hoàn tất phía CukCuk (thủ công)
    TN->>CUK: Giao hàng → Đang giao hàng
    TN->>CUK: Thu tiền → Đã thanh toán
    end

    opt Hủy đơn (khi cần)
        TN->>CUK: Hủy
        CUK->>GE: DELETE /deliveries/{id} (chỉ QUEUEING / ALLOCATING / PICKING_UP)
    end
```

---

## 3. State machine Grab Express (tham chiếu)

```mermaid
stateDiagram-v2
    [*] --> ALLOCATING: Tạo vận đơn
    ALLOCATING --> PENDING_PICKUP: Đã gán tài xế
    PENDING_PICKUP --> PICKING_UP: Tài xế đi lấy hàng
    PICKING_UP --> PENDING_DROP_OFF: Đã lấy hàng
    PENDING_DROP_OFF --> IN_DELIVERY: Tới điểm giao
    IN_DELIVERY --> COMPLETED: Giao thành công
    COMPLETED --> [*]

    ALLOCATING --> FAILED: Không tìm được tài xế
    ALLOCATING --> CANCELED: Người gửi hủy
    PENDING_PICKUP --> CANCELED
    PICKING_UP --> CANCELED
    PICKING_UP --> IN_RETURN: Giao thất bại
    PENDING_DROP_OFF --> IN_RETURN
    IN_RETURN --> RETURNED: Trả hàng
    RETURNED --> [*]
    FAILED --> [*]
    CANCELED --> [*]
```

| Trạng thái GE | Ý nghĩa | Kết thúc |
|---|---|---|
| `ALLOCATING` | Đang tìm tài xế | |
| `PENDING_PICKUP` | Đã tìm được tài xế | |
| `PICKING_UP` | Tài xế đang tới lấy hàng | |
| `PENDING_DROP_OFF` | Đã lấy hàng, đang giao | |
| `IN_DELIVERY` | Đơn đang được giao | |
| `COMPLETED` | Giao thành công | ✅ |
| `IN_RETURN` | Giao thất bại, đang hoàn hàng | |
| `RETURNED` | Đã trả hàng | ✅ |
| `CANCELED` | Hủy bởi tài xế/người gửi | ✅ |
| `FAILED` | Không tìm được tài xế | ✅ |

> `COMPLETED` / `RETURNED` là trạng thái kết thúc → cho phép **Hủy kết nối** không hiện cảnh báo giao vận.

---

## Nguồn
- Grab Express Developer — Order State Machine & API: https://developer.grab.com/docs/grab-express/#order-state-machine
- Sapo — Tích hợp Grab Express (tham khảo luồng nghiệp vụ): https://support.sapo.vn/tich-hop-grab-express
- File yêu cầu gốc: `Cukcuk/Luồng/*.jpg` (XMind C86574)
