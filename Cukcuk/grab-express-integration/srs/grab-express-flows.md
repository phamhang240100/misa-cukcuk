---
type: srs-flows
feature: grab-express
updated: 2026-07-19
---

# Grab Express — Flows

## Flow: Kết nối đối tác Grab Express
**Trigger**: Nhà hàng khai báo hồ sơ người gửi và bấm Kết nối trong `Ứng dụng › Grab Express`
**Related UC**: TBD
**Related FR**: TBD
**Related E**: E-grab-express-005, E-grab-express-007, E-grab-express-008

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant CUK as MISA CukCuk
    participant GID as GrabID OAuth
    participant GE as Grab Express API

    Note over CUK,GID: Thiết lập 1 lần — MISA là Partner, có client_id/secret cấp-partner + callback URL (scope grab_express.partner_deliveries)

    CUK->>GID: POST /grabid/v1/oauth2/token (client_credentials, scope)
    GID-->>CUK: access_token Bearer + expires_in ~7 ngày
    Note over CUK: Cache token tới khi hết hạn hoặc gặp 401 (tự refresh nền)

    ND->>CUK: Khai báo SĐT, địa chỉ (lấy sẵn từ Thiết lập chung) rồi Kết nối
    Note over CUK: SĐT/địa chỉ = hồ sơ người gửi (sender), KHÔNG phải credential

    alt Địa chỉ trong vùng Grab phục vụ (validate động qua Quote API)
        CUK-->>ND: Kết nối thành công → hiện nút Cập nhật / Hủy kết nối
    else Ngoài vùng phủ / trống / email VAT sai
        CUK-->>ND: Cảnh báo lỗi tương ứng (E-grab-express-005/007/008)
    end
```

---

## Flow: Lập đơn và gửi sang Grab Express (đủ nhánh lỗi)
**Trigger**: Thu ngân lập đơn giao hàng, chọn đối tác Grab Express rồi Gửi đơn hàng
**Related UC**: TBD
**Related FR**: TBD
**Related E**: E-grab-express-001, E-grab-express-002, E-grab-express-003, E-grab-express-006

```mermaid
sequenceDiagram
    autonumber
    actor ND as Thu ngân
    participant CUK as MISA CukCuk
    participant GE as Grab Express API

    ND->>CUK: Lập đơn, chọn đối tác Grab Express (Loại DV = INSTANT, khóa)
    CUK->>GE: POST /deliveries/quotes (serviceType=INSTANT, origin, destination)

    alt Quote thành công
        GE-->>CUK: Phí giao và thời gian dự kiến
        CUK-->>ND: Phí trả đối tác (khóa) và phí thu khách (sửa được)
    else Quote thất bại hoặc ngoài vùng phủ
        GE-->>CUK: Lỗi hoặc không báo giá
        CUK-->>ND: Chặn Lưu đơn Grab Express, báo E-grab-express-001
    end

    Note over CUK: COD bằng tiền món cộng phí thu khách trừ đặt cọc. Cảnh báo nếu COD vượt hạn mức (đọc từ Grab, mặc định 2tr), E-grab-express-006

    ND->>CUK: Lưu (Chờ gửi đối tác) rồi Gửi đơn hàng
    Note over CUK: Khóa nút Gửi ngay khi bấm (chống double-click), re-validate COD và vùng phủ
    CUK->>GE: POST /deliveries [Idempotency-Key] (sender, recipient, packages, cashOnDelivery)

    alt Tạo vận đơn thành công
        GE-->>CUK: deliveryID kèm status ALLOCATING
        CUK-->>ND: Chờ gửi đối tác sang Chờ giao hàng (lưu Mã vận đơn, GE=ALLOCATING)
    else 401 token hết hạn
        GE-->>CUK: 401
        Note over CUK: Tự xin token mới rồi gọi lại POST /deliveries, thu ngân không thấy lỗi
    else 4xx sai payload hoặc ngoài vùng
        GE-->>CUK: 4xx kèm message
        CUK-->>ND: Giữ Chờ gửi đối tác, hiện message Grab để sửa rồi gửi lại (E-grab-express-002)
    else 5xx, timeout hoặc mất mạng
        GE-->>CUK: 5xx hoặc không phản hồi
        Note over CUK: Idempotency-Key chống tạo trùng, tự truy vấn lại trạng thái trước khi mở nút gửi lại
        CUK-->>ND: Giữ Chờ gửi đối tác, báo E-grab-express-003 (thử lại sau)
    end
```

---

## Flow: Đồng bộ trạng thái (Hybrid auto-sync) và Thu tiền
**Trigger**: Đơn ở Chờ giao hàng; Grab Express đẩy webhook trạng thái, thu ngân thu tiền khi giao xong
**Related UC**: TBD
**Related FR**: TBD
**Related E**: E-grab-express-004

```mermaid
sequenceDiagram
    autonumber
    actor ND as Thu ngân
    participant CUK as MISA CukCuk
    participant GE as Grab Express API

    Note over CUK,GE: Auto-sync Hybrid: webhook đẩy bước giao hàng, gate cứng bước Thu tiền

    loop Mỗi lần Grab đổi trạng thái
        GE->>CUK: Webhook (deliveryID, status, timestamp) [xác thực header]
        Note over CUK: Trả 200 ngay, xử lý qua queue idempotent, bỏ qua event cũ hơn theo timestamp
        alt status = PICKING_UP
            CUK->>CUK: Auto chuyển Chờ giao hàng sang Đang giao hàng
            CUK-->>ND: Thông báo + đồng bộ trạng thái mọi thiết bị cùng chi nhánh
        else status = COMPLETED
            CUK-->>ND: Hiện banner "Chờ thu tiền" (KHÔNG tự đóng đơn)
        else status = CANCELED / FAILED / RETURNED
            CUK-->>ND: Cờ đỏ + cảnh báo (xem Flow xử lý trạng thái kết thúc)
        end
    end

    opt Webhook mất/trễ — dự phòng
        CUK->>GE: GET /deliveries/{id} (polling định kỳ)
        GE-->>CUK: Trạng thái mới nhất → đồng bộ như webhook
    end

    ND->>CUK: Bấm Thu tiền
    alt GE = COMPLETED
        CUK-->>ND: Mở màn thu tiền → xác nhận → Đã thanh toán
    else GE chưa COMPLETED
        CUK-->>ND: Chặn cứng + báo E-grab-express-004 (chưa giao xong)
    end
```

---

## Flow: Xử lý trạng thái kết thúc xấu (CANCELED / FAILED / RETURNED)
**Trigger**: Grab Express trả trạng thái hủy/thất bại/hoàn hàng khi đơn CukCuk chưa đóng
**Related UC**: TBD
**Related FR**: TBD
**Related E**: —

```mermaid
sequenceDiagram
    autonumber
    actor ND as Thu ngân
    participant CUK as MISA CukCuk
    participant GE as Grab Express API

    GE->>CUK: Webhook status = FAILED / CANCELED / RETURNED
    Note over CUK: Thu tiền vẫn bị chặn vì GE khác COMPLETED

    alt FAILED / CANCELED — món còn ở quán
        CUK->>CUK: Tự mở lại đơn về Chờ gửi đối tác (xóa Mã vận đơn/GE cũ) + cờ đỏ
        CUK-->>ND: Thông báo — gửi lại Grab / đổi đối tác (AhaMove, tự giao) / Hủy
        ND->>CUK: Chọn đối tác + Gửi lại (dùng lại đơn cũ)
    else RETURNED — món đã ra rồi quay về
        CUK-->>ND: Nhắc chọn Gửi lại (nếu còn tốt) hay Hủy
        opt Mô hình A — tài xế đã ứng COD lúc pickup
            Note over ND,GE: Quán hoàn khoản ứng cho tài xế khi nhận hàng về. Đơn không đóng Đã thanh toán. Cần Grab xác nhận cơ chế (OQ-01).
        end
    end

    opt Hủy đơn khi Grab còn cho hủy
        ND->>CUK: Hủy
        CUK->>GE: DELETE /deliveries/{id} — chỉ khi GE thuộc ALLOCATING / PENDING_PICKUP / PICKING_UP
    end
```
