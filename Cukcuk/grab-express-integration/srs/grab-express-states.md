---
type: srs-states
feature: grab-express
updated: 2026-07-18
---

# Grab Express — States

## State: GrabExpressDelivery
**Related entity**: GrabExpressDelivery (vận đơn Grab Express)
**Related UC**: TBD
**Related BR**: TBD

> Trạng thái do Grab Express trả về qua webhook. MISA CukCuk chỉ **nhận & lưu** trạng thái này để hiển thị + sinh thông báo — **KHÔNG tự map** sang trạng thái đơn CukCuk (Chờ gửi đối tác / Chờ giao hàng / Đang giao hàng / Đã thanh toán).

```mermaid
stateDiagram-v2
    [*] --> ALLOCATING : tạo vận đơn

    ALLOCATING --> PENDING_PICKUP : đã gán tài xế
    ALLOCATING --> FAILED : không tìm được tài xế
    ALLOCATING --> CANCELED : người gửi hủy

    PENDING_PICKUP --> PICKING_UP : tài xế đi lấy hàng
    PENDING_PICKUP --> CANCELED : hủy

    PICKING_UP --> PENDING_DROP_OFF : đã lấy hàng
    PICKING_UP --> CANCELED : hủy
    PICKING_UP --> IN_RETURN : giao thất bại

    PENDING_DROP_OFF --> IN_DELIVERY : tới điểm giao
    PENDING_DROP_OFF --> IN_RETURN : giao thất bại

    IN_DELIVERY --> COMPLETED : giao thành công

    IN_RETURN --> RETURNED : đã trả hàng về người gửi

    COMPLETED --> [*]
    RETURNED --> [*]
    CANCELED --> [*]
    FAILED --> [*]

    note right of COMPLETED
        COMPLETED và RETURNED là trạng thái kết thúc.
        Khi mọi đơn đạt 2 trạng thái này, cho Hủy kết nối không cảnh báo giao vận.
    end note
```

### Invalid transitions
| From | To | Why not |
|---|---|---|
| COMPLETED | (bất kỳ) | Trạng thái kết thúc — giao thành công không quay lại |
| RETURNED | IN_DELIVERY | Đã trả hàng về người gửi, không giao lại trên cùng vận đơn |
| CANCELED / FAILED | ALLOCATING | Đơn đã hủy/thất bại không tự tái điều phối — phải tạo vận đơn mới |
| IN_DELIVERY | CANCELED | Grab chỉ cho hủy tới PICKING_UP; đã tới điểm giao không hủy được |
