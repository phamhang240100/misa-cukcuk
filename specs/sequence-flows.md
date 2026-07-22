---
type: srs-flows
feature: cukcuk-shopeefood
updated: 2026-07-23
---

# CukCuk ↔ ShopeeFood — Sequence Flows

> Grounded theo `[API]` (Foody External + Authorization) + `[Q&A]`. Quy ước: `->>` = gọi/request, `-->>` = kết quả/response.

## Flow 1: Kết nối (OAuth2 Device Authorization)
**Trigger**: Chủ quán bấm "Kết nối ShopeeFood" trên web BE CukCuk.

```mermaid
sequenceDiagram
    actor Owner as Chủ quán
    participant CC as CukCuk BE
    participant SPF as ShopeeFood OAuth2
    participant PA as Shopee Partner App
    Owner->>CC: Bấm "Kết nối ShopeeFood"
    CC->>SPF: POST /oauth2/devicecode (client_id, scope, isv_store)
    SPF-->>CC: device_code, user_code, verification_uri, expires_in, interval
    CC-->>Owner: Hiển thị QR + đồng hồ đếm ngược
    Owner->>PA: Quét QR, đăng nhập (owner), Xác nhận kết nối
    loop Mỗi interval giây (tối đa expires_in)
        CC->>SPF: POST /oauth2/token (grant_type=device_code, code)
        alt Chưa xác nhận
            SPF-->>CC: error=authorization_pending
        else Hết hạn
            SPF-->>CC: error=expired_token
        else Thành công
            SPF-->>CC: access_token, refresh_token, expires_in
        end
    end
    CC->>CC: Lưu token theo cửa hàng (mapping 1:1)
    CC-->>Owner: Kết nối thành công (hiển thị tên quán)
    Note over CC,SPF: Refresh token định kỳ trước khi hết hạn
```

## Flow 2: Thiết lập & Đồng bộ Menu (1 chiều CukCuk → SPF)
**Trigger**: Sau kết nối, chủ quán mapping món rồi bấm Đồng bộ.

```mermaid
sequenceDiagram
    actor Owner as Chủ quán
    participant CC as CukCuk BE
    participant SPF as ShopeeFood
    Owner->>CC: Mapping món/nhóm/topping (gợi ý auto-match tên ~80%)
    Owner->>CC: Bấm Đồng bộ
    Note over CC: Cảnh báo: món chưa mapping sẽ bị XÓA trên SPF (mất lượt bán)
    alt Đồng bộ toàn bộ menu
        CC->>SPF: POST /s2s/menu/sync (partner_restaurant_id)
    else Đồng bộ 1 hoặc nhiều món (an toàn)
        CC->>SPF: sync theo món (không xóa món khác)
    end
    SPF-->>CC: task_id
    Note over SPF: mapped→update · chỉ có ở CukCuk→tạo mới · chỉ có ở SPF→xóa
    alt Nhận qua webhook
        SPF-->>CC: POST /menu/sync/task/callback (task_status, success/failed_items)
    else Chủ động hỏi
        CC->>SPF: POST /s2s/menu/sync/get_task (task_id)
        SPF-->>CC: task_status + failed_items_detail
    end
    CC-->>Owner: Kết quả (N món thành công / M lỗi)
```

## Flow 3: Nhận & Xử lý Đơn tại POS
**Trigger**: Khách đặt món trên app ShopeeFood.

```mermaid
sequenceDiagram
    actor Cust as Khách hàng
    participant SPF as ShopeeFood
    participant CC as CukCuk BE
    actor Staff as Nhân viên POS
    actor Driver as Tài xế
    Cust->>SPF: Đặt món & thanh toán (online/COD)
    SPF->>CC: Webhook /update_order (order_code, status=M_ASSIGNED)
    CC-->>SPF: 200 OK (ack ngay, xử lý async)
    CC->>SPF: POST /s2s/order/get_details (order_code)
    SPF-->>CC: Chi tiết đơn (món, merchant_price, commission, thuế...)
    CC->>Staff: Đơn vào tab "Chưa xác nhận" + thông báo
    alt Nhân viên XÁC NHẬN (thủ công hoặc auto sau ~2')
        Staff->>CC: Xác nhận đơn
        CC->>SPF: order.update (CONFIRM=0)
        CC->>Staff: Gửi bếp + in tem (nội bộ)
        SPF->>Driver: Điều phối tài xế
        Driver->>SPF: Lấy hàng (PICKED)
        Note over Staff: Sau PICKED không được hủy đơn
        Driver->>Cust: Giao hàng (DELIVERED)
        SPF->>CC: Webhook DELIVERED
        CC->>CC: Ghi nhận doanh thu & đối soát
        CC-->>Staff: Đơn sang tab "Hoàn thành"
    else Nhân viên TỪ CHỐI
        Staff->>CC: Từ chối + lý do (RejectOrderReason)
        CC->>SPF: order.update (OUT_OF_SERVICE=2)
        CC-->>Staff: Đơn sang tab "Hủy"
    end
    Note over CC,SPF: Miss webhook → CukCuk polling order.get_list bù đơn (không có replay)
```

## Flow 4: Ngắt kết nối
**Trigger**: Chủ quán bấm "Ngắt kết nối".

```mermaid
sequenceDiagram
    actor Owner as Chủ quán
    participant CC as CukCuk BE
    participant PA as Shopee Partner App
    participant SPF as ShopeeFood
    Owner->>CC: Bấm "Ngắt kết nối"
    CC-->>Owner: Hiển thị deeplink/QR ISV_AUTHORIZATION_DISCONNECT
    Owner->>PA: Quét/mở → hoàn tất ngắt trên Partner App
    loop Mỗi 10s trong 5 phút
        CC->>SPF: GET /s2s/restaurant/get_restaurant_info
        alt Còn trả success
            SPF-->>CC: Chưa ngắt xong
        else Trả lỗi (expired token)
            SPF-->>CC: Đã ngắt kết nối
        end
    end
    CC-->>Owner: Cập nhật trạng thái "Đã ngắt kết nối"
```
