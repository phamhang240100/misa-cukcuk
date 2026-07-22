# Module 01 — Kết nối / Authorization (CukCuk ↔ ShopeeFood)

> Vai trò: **ISV Partner** · Cơ chế: **OAuth2 Device Authorization** (`[API-Auth]`).
> Nguồn: `[API-Auth]` (chuẩn) + `[Q&A A.*]` + `[XMIND]` (nháp UI) + `[RESEARCH]` (UX).

## 1. Điều kiện tiên quyết (prerequisite)
| # | Điều kiện | Nguồn |
|---|---|---|
| P1 | Nhà hàng **đã có gian hàng trên ShopeeFood** (chưa có → không kết nối được) | `[Q&A A.7]` |
| P2 | IP server CukCuk đã được **whitelist** phía SPF | `[Q&A A.1]` |
| P3 | CukCuk đã cung cấp **webhook nhận đơn** + **endpoint menu** cho SPF | `[Q&A A.1]` |
| P4 | SPF đã cấp **client_id / client_secret** (khuyến nghị 1 client_id / 1 chuỗi-thương hiệu) | `[API-Auth]` |
| P5 | Người thao tác kết nối phải là **owner** gian hàng SPF | `[Q&A A.8]` |
| P6 | Nếu đang dùng POS cũ **Ocha** → phải liên hệ BI SPF gỡ kết nối Ocha trước | `[API-Auth §3]` |

## 2. Luồng kết nối (device-code)

```mermaid
sequenceDiagram
    autonumber
    actor U as Owner (tại web BE CukCuk)
    participant CC as CukCuk BE
    participant SPF as ShopeeFood OAuth2
    participant PA as Shopee Partner App (mobile owner)

    U->>CC: Bấm "Kết nối ShopeeFood"
    CC->>SPF: POST /oauth2/devicecode (client_id, scope, isv_store_id, isv_store_name)
    SPF-->>CC: device_code, user_code, verification_uri_complete, expires_in(=900s), interval(=5s)
    CC-->>U: Sinh QR từ verification_uri_complete + đồng hồ đếm ngược (expires_in)
    U->>PA: Quét QR → mở Shopee Partner App
    PA->>PA: Đăng nhập (owner) → xem tên quán để đối chiếu → "Confirm to Connect"
    loop Mỗi `interval` giây, tối đa expires_in
        CC->>SPF: POST /oauth2/token (grant_type=device_code, client_id, client_secret, code=device_code)
        alt Chưa xác nhận
            SPF-->>CC: error=authorization_pending → tiếp tục poll
        else Poll quá nhanh
            SPF-->>CC: error=slow_down → tăng interval
        else User từ chối
            SPF-->>CC: error=access_denied → BÁO THẤT BẠI
        else Hết hạn
            SPF-->>CC: error=expired_token → BÁO HẾT HẠN, cho "Tạo mã mới"
        else Thành công
            SPF-->>CC: access_token, refresh_token, expires_in(=3600), scope
        end
    end
    CC->>SPF: (option) GET /s2s/restaurant/get_restaurant_info (Bearer access_token)
    SPF-->>CC: store info → hiển thị tên quán xác nhận
    CC->>CC: Lưu token per-store (mapping 1:1 SPF store ↔ CukCuk store)
    CC-->>U: "Kết nối thành công" → chuyển màn Thiết lập
```

## 3. Màn hình & thành phần UI
| Màn / thành phần | Nội dung | Ghi chú |
|---|---|---|
| Danh sách ứng dụng (Applications) | Thêm app **ShopeeFood** (title, mô tả, nút Kết nối) | `[XMIND]` |
| Popup QR kết nối | QR sinh từ `verification_uri_complete` + **đồng hồ đếm ngược theo `expires_in` thật** + nút **"Tạo mã mới"** | U6 — KHÔNG hardcode 15' |
| Trạng thái polling | "Đang chờ xác nhận trên Shopee Partner App…" | interval từ response |
| Thông báo kết quả | Thành công (hiện tên quán) / Thất bại (lý do) | `[XMIND]` |
| Màn quản lý kết nối | Trạng thái đã kết nối, tên/ID store SPF, nút **Ngắt kết nối** | `[XMIND]`, `[API-Auth §3]` |

## 4. Quản lý token
| Rule | Chi tiết | Nguồn |
|---|---|---|
| TK1 | Lưu **access_token + refresh_token riêng cho từng store** | `[API-Auth]` |
| TK2 | Token dài > 2048 bytes → cột lưu phải đủ rộng | `[API-Auth]` |
| TK3 | **Refresh định kỳ** trước khi hết hạn (`expires_in` mẫu 3600s) qua `grant_type=refresh_token` | `[API-Auth]` |
| TK4 | Header gọi API: `Authorization: Bearer <access_token>` | `[API-Auth §3]` |
| TK5 | ISV **bỏ qua** `restaurant_id` bắt buộc ở hầu hết endpoint (token đã định danh store) | `[API-Auth §3]` |
| TK6 | Refresh fail / token thu hồi → chuyển store về trạng thái **"Mất kết nối"**, yêu cầu kết nối lại | thiết kế (verify D1) |

## 5. Ngắt kết nối (disconnect)
```mermaid
sequenceDiagram
    actor U as Owner
    participant CC as CukCuk
    participant PA as Shopee Partner App
    U->>CC: Bấm "Ngắt kết nối"
    CC-->>U: Hiển thị deeplink/QR ISV_AUTHORIZATION_DISCONNECT (client_id + spf_restaurant_id)
    U->>PA: Quét/mở → hoàn tất ngắt trên Partner App
    loop Mỗi 10s trong 5 phút
        CC->>PA: GET /s2s/restaurant/get_restaurant_info
        alt Trả success
            Note over CC: Chưa ngắt xong → tiếp tục
        else Trả lỗi (expired token)
            Note over CC: ĐÃ ngắt kết nối → cập nhật trạng thái
        end
    end
```
- Link theo môi trường: UAT `partner.uat.shopee.vn`, Live `partner.shopee.vn` `[API-Auth §3]`.

## 6. Business rules
- BR-01: Mapping **1:1** — 1 SPF store chỉ nối 1 CukCuk store tại một thời điểm; 1 client_id nối nhiều store `[Q&A A.1]`, `[API-Auth §3]`.
- BR-02: SPF **không validate** việc user chọn đúng store CukCuk — dựa vào **owner tự đối chiếu tên quán** hiển thị trên Partner App `[Q&A A.4, A.8]`.
- BR-03: Không có chiều đẩy store info CukCuk→SPF; chỉ **get_restaurant_info** SPF→CukCuk `[Q&A A.2]`.
- BR-04: Sau kết nối thành công, SPF trả **token** (không chỉ merchantID) — bắt buộc lưu `[Q&A A.9]`.

## 7. Edge cases
| # | Tình huống | Xử lý |
|---|---|---|
| E1 | Quét QR đã hết hạn (`expired_token`) | Báo hết hạn + nút "Tạo mã mới" (gọi lại /devicecode) |
| E2 | Owner đăng nhập **nhầm account/quán** khác | Partner App hiển thị tên quán để tự nhận diện; nếu sai → đăng xuất, đăng nhập đúng, quét lại `[API Authen Flow]` |
| E3 | User bấm từ chối (`access_denied`) | Báo thất bại, cho thử lại |
| E4 | Poll quá nhanh (`slow_down`) | Tăng interval theo yêu cầu server |
| E5 | Chưa có gian hàng SPF | Chặn kết nối, hướng dẫn đăng ký SPF trước `[Q&A A.7]` |
| E6 | Đang kết nối Ocha | Chặn + hướng dẫn liên hệ BI gỡ Ocha `[API-Auth §3]` |
| E7 | Mất mạng giữa lúc poll | Giữ device_code, tiếp tục poll đến `expires_in`; quá hạn → E1 |

## 8. TODO chờ SPF
- `SPF-Q2` 🟡: refresh_token có rotate không; fail thì phải re-link?; có webhook báo disconnect không (hiện chỉ biết poll `get_restaurant_info` — cách này đã có trong `[API-Auth §3]`).
- `SPF-Q3` 🟡: cấp UAT (client_id/secret, domain) + timeline.

> Ngắt kết nối (§5) đã có đủ trong `[API-Auth §3]` — không phải câu hỏi mở, chỉ cần xác nhận có thêm webhook disconnect hay không (gộp vào Q2).
