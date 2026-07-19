---
type: srs-flows
feature: grab-express
updated: 2026-07-18
---

# Grab Express — Flows

## Flow: Tích hợp Grab Express (kết nối, lập đơn, giao đơn, cập nhật trạng thái)
**Trigger**: Nhà hàng dùng Grab Express làm đối tác giao hàng trong MISA CukCuk
**Related UC**: TBD
**Related FR**: TBD
**Related E**: TBD

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant CUK as MISA CukCuk
    participant GID as GrabID OAuth
    participant GE as Grab Express API

    Note over CUK,GID: Thiết lập 1 lần — MISA đăng ký Partner, có client_id/secret + callback URL (scope grab_express.partner_deliveries)

    CUK->>GID: POST /grabid/v1/oauth2/token (grant_type=client_credentials, scope)
    GID-->>CUK: access_token Bearer + expires_in khoảng 7 ngày
    Note over CUK: Cache token tới khi hết hạn hoặc gặp 401

    ND->>CUK: Khai báo SĐT, địa chỉ rồi Kết nối
    Note over CUK: SĐT/địa chỉ = hồ sơ người gửi, KHÔNG phải credential
    CUK-->>ND: Kết nối thành công → hiện nút Cập nhật / Hủy kết nối

    ND->>CUK: Lập order, chọn đối tác Grab Express (Loại DV = Siêu tốc - Thực phẩm, khóa)
    CUK->>GE: POST /deliveries/quotes [Bearer] (serviceType=INSTANT, origin, destination)
    GE-->>CUK: Phí giao + thời gian dự kiến
    CUK-->>ND: Loại DV (khóa), phí trả đối tác (khóa), phí thu khách (sửa được) — COD tự tính = Còn phải thu khi Lưu

    ND->>CUK: Lưu đơn (Chờ gửi đối tác) rồi Gửi đơn hàng
    CUK->>GE: POST /deliveries [Bearer] (serviceType=INSTANT, sender, recipient, packages, cashOnDelivery, paymentMethod)
    alt Kết nối OK
        GE-->>CUK: deliveryID / Mã vận đơn + status ALLOCATING
        CUK-->>ND: Chuyển trạng thái đơn CukCuk: Chờ gửi đối tác → Chờ giao hàng (lưu Mã vận đơn, GE = ALLOCATING)
    else 401 Unauthorized
        GE-->>CUK: 401
        CUK->>GID: Xin access_token mới
        GID-->>CUK: access_token
        CUK->>GE: Gọi lại POST /deliveries
    end

    loop Mỗi lần Grab đổi trạng thái (luồng giao thành công)
        GE->>CUK: Webhook [headers Authorization-Id, Authorization] (deliveryID, status, timestamp)
        Note over CUK: Xác thực header + timestamp — lưu trạng thái GE (KHÔNG auto-map trạng thái CukCuk)
        CUK->>ND: Thông báo trạng thái (chỉ thiết bị tạo đơn)
    end

    alt GE trả về CANCELED / FAILED / RETURNED (tài xế/GE hủy, giao thất bại, hoàn hàng)
        GE->>CUK: Webhook status = CANCELED / FAILED / RETURNED
        Note over CUK: VẪN không tự đổi trạng thái đơn CukCuk (đơn giữ nguyên Chờ giao / Đang giao)
        CUK->>ND: Thông báo trạng thái → thu ngân tự xử lý (Hủy / hoàn) — chưa có quy tắc chốt
    end

    ND->>CUK: Giao hàng (Đang giao) rồi Thu tiền (Đã thanh toán)
    Note over CUK: Thao tác thủ công phía CukCuk, độc lập trạng thái GE

    opt Hủy đơn
        ND->>CUK: Hủy
        CUK->>GE: DELETE /deliveries/id [Bearer] — chỉ khi QUEUEING / ALLOCATING / PICKING_UP
    end
```
