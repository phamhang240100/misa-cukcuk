# Domain Research — CukCuk × Grab Express Integration

> Domain: restaurant POS ↔ Grab Express last-mile delivery API integration (Vietnam)
> Generated: 2026-07-19
> Sources:
> - https://www.grab.com/vn/en/blog/driver/quytrinhboihoan-cod/ (official Grab VN)
> - https://www.grab.com/vn/en/blog/driver/grabexpresschushop/ (official Grab VN)
> - https://www.grab.com/vn/en/campaign/grabexpress-dich-vu-giao-hang-chu-shop-nang-muc-ung-tien-truoc-len-den-5-trieu/ (official Grab VN)
> - https://www.grab.com/vn/en/blog/driver/capnhathanmucboihoan-expansion/ (official Grab VN)
> - https://api.ghtk.vn/docs/submit-order/webhook/ (competitor, official docs — GHTK)
> - https://developers.ahamove.com/en/docs/webhook (competitor, official docs — AhaMove)
> - https://developers.ahamove.com/en/docs/overall-process (competitor, official docs — AhaMove)
> - https://hookdeck.com/webhooks/guides/webhook-ordering-why-its-hard-and-how-to-handle-it (industry best practice)
> - https://hookdeck.com/webhooks/guides/implement-webhook-idempotency (industry best practice)
> - https://boldsign.com/blogs/webhook-best-practices-retries-idempotency/ (industry best practice)
> - developer.grab.com (attempted — JS-rendered SPA, **content not retrievable** via fetch; exact GrabExpress delivery-status enum / webhook event list could NOT be verified from primary source in this session — flagged as a gap, not guessed)

## Key research findings (with provenance)

1. **[Official Grab VN, confirmed]** Grab's "Giao hàng Chủ Shop COD" service model is *inverted* vs typical COD: the driver **advances cash to the shop at pickup time** (up to 2–5 triệu VNĐ depending on tier), then collects payment from the end customer later. This matches and refines the prior verified-facts memory note.
2. **[Official Grab VN, confirmed]** Since 1/4/2025, if a delivery fails/is unsuccessful, Grab reimburses the advanced amount **to the driver's cash wallet within 7 business days** from when Grab's Returns-Information team fully verifies the return report. This is a driver-side reimbursement cycle for FAILED deliveries — **not** a standard "merchant waits N days for COD cash" cycle. This corrects the prior "đối soát 1–3 ngày" note, which conflated two different things.
3. **[Official Grab VN, confirmed]** COD ceiling: general GrabExpress COD cap = **2,000,000đ**; the "Giao hàng Chủ Shop" (regular shop-owner) tier can go up to **5,000,000đ**; the 2–5tr VIP shop-owner COD tier was **temporarily suspended as of 21/2/2025** per a Grab VN announcement — tier/eligibility must be confirmed with the merchant's actual Grab contract, not assumed.
4. **[Competitor, official docs — GHTK]** GHTK's canonical order-status list **explicitly separates** "Đã giao hàng / Chưa đối soát" (status 5, delivered/unreconciled) from "Đã đối soát" (status 6, reconciled) as two distinct states — strong real-world precedent from a major VN carrier for **not collapsing "delivered" and "payment reconciled" into a single auto-triggered status**.
5. **[Competitor, official docs — GHTK]** Webhook retry policy: GHTK retries **once** if the partner endpoint doesn't return HTTP 200; no explicit dedup mechanism is documented — partner is expected to build idempotency (e.g., using `label_id` + `action_time`).
6. **[Competitor, official docs — AhaMove]** AhaMove's order-level webhook statuses (from sample payload): `IDLE`, `ASSIGNING`, `ACCEPTED`, `COMPLETED`, `CANCELLED`, with a separate stop-level status for multi-drop orders. AhaMove documents a **separate "Payment Flow" page** distinct from "Order Status Flow" and "Webhook & Callback flow" — another precedent for keeping delivery state and payment/reconciliation state as separate concerns.
7. **[Industry best practice, multiple sources]** Webhooks are at-least-once delivery; retries and out-of-order arrival are normal. Recommended: stable event ID + processed marker + unique constraint for idempotency; OR treat webhook as a signal to re-fetch canonical resource state rather than trusting payload; use timestamp/sequence precedence to reject stale/late events.
8. **[Gap — could not verify]** The exact GrabExpress/Grab Deliveries API delivery-status enum (whether `QUEUEING`, `ALLOCATING`, `PICKING`, `IN_DELIVERY`, `COMPLETED`, `CANCELED`, `FAILED`, `RETURNED` are literal field values) could not be confirmed from developer.grab.com in this session (JS SPA, no accessible static content). **Do not hardcode these names without verifying against Grab's actual partner API reference or a captured sandbox webhook payload.**
9. **[Inference, flagged]** Because the shop is paid via advance-at-pickup (finding #1) rather than post-delivery remittance, the CukCuk "money received" moment may logically be closer to a pickup/COD-advance-confirmed event than a delivery-completion event — this reframes when "Thu tiền" should even become relevant, and raises a new question: what happens to the shop's books if a delivery fails *after* the advance was already paid out.

## Question bank

```json
[
  {
    "id_prefix": "DOM",
    "question": "Nên tự động đồng bộ trạng thái Grab Express (qua webhook) vào vòng đời đơn hàng CukCuk hoàn toàn, hay chỉ tự động cho các trạng thái 'đang giao' và giữ bước 'Thu tiền' là thao tác thủ công của thu ngân? (GHTK — một hãng vận chuyển lớn tại VN — tách rõ 'Đã giao hàng/Chưa đối soát' và 'Đã đối soát' thành 2 trạng thái khác nhau trong state machine chính thức của họ, không gộp làm một).",
    "impact": "high",
    "suggested_default": "Auto-advance trạng thái giao hàng (Đang giao/Đã giao) từ webhook, nhưng giữ 'Thu tiền'/'Đã thanh toán' là hành động thủ công (hoặc gated bằng một điều kiện xác nhận riêng) — theo đúng tiền lệ tách bạch của GHTK và AhaMove (AhaMove tách hẳn 'Payment Flow' khỏi 'Order Status Flow').",
    "source_url": "https://api.ghtk.vn/docs/submit-order/webhook/"
  },
  {
    "id_prefix": "DOM",
    "question": "Với dịch vụ 'Giao hàng Chủ Shop COD' của Grab, tài xế ỨNG TIỀN cho cửa hàng ngay lúc lấy hàng (pickup) chứ không phải sau khi giao xong — vậy sự kiện nào của Grab (nếu có, cần Grab xác nhận) đánh dấu 'cửa hàng đã nhận tiền ứng', và CukCuk có nên dùng sự kiện đó (thay vì 'delivered') để mở khoá/tự động hoá nút 'Thu tiền'?",
    "impact": "high",
    "suggested_default": "Giữ 'Thu tiền' là thao tác thủ công cho tới khi Grab xác nhận (qua API/hợp đồng) có một field/webhook riêng đánh dấu thời điểm ứng tiền; không suy đoán tên field.",
    "source_url": "https://www.grab.com/vn/en/blog/driver/grabexpresschushop/"
  },
  {
    "id_prefix": "DOM",
    "question": "Nếu đơn giao hàng THẤT BẠI/bị hoàn sau khi Grab đã ứng tiền cho cửa hàng lúc pickup, CukCuk có cần một trạng thái/luồng 'Hoàn lại tiền ứng' (điều chỉnh sổ sách đơn hàng) không, vì theo chính sách Grab, tài xế được Grab hoàn 100% tiền ứng trong vòng 7 ngày làm việc kể từ khi bộ phận xác minh hoàn tất?",
    "impact": "high",
    "suggested_default": "Có — thêm trạng thái/luồng ngoại lệ 'Đơn hoàn/thất bại sau khi đã ứng tiền' để kế toán cửa hàng đối chiếu, tách biệt khỏi luồng hủy đơn thông thường (COD=0).",
    "source_url": "https://www.grab.com/vn/en/blog/driver/quytrinhboihoan-cod/"
  },
  {
    "id_prefix": "DOM",
    "question": "CukCuk sẽ dùng khoá idempotency nào để chống xử lý trùng webhook Grab Express (event ID riêng của Grab? hay deliveryId+status+timestamp)? Cả tài liệu công khai của GHTK lẫn AhaMove đều KHÔNG có cơ chế dedup chuẩn hoá — mỗi bên tích hợp phải tự xây.",
    "impact": "high",
    "suggested_default": "Lưu (deliveryId, status, eventTimestamp) làm khoá duy nhất đã xử lý; nếu Grab cung cấp event/message ID riêng thì ưu tiên dùng ID đó thay vì tự ghép khoá.",
    "source_url": "https://hookdeck.com/webhooks/guides/implement-webhook-idempotency"
  },
  {
    "id_prefix": "DOM",
    "question": "Khi webhook Grab đến không đúng thứ tự (ví dụ 'delivered' đến trước 'in_delivery' do retry/độ trễ mạng), CukCuk có nên so sánh timestamp sự kiện với trạng thái hiện tại đã lưu và bỏ qua sự kiện đến muộn/cũ hơn không, thay vì ghi đè trạng thái vô điều kiện?",
    "impact": "high",
    "suggested_default": "Có — chỉ áp dụng webhook nếu eventTimestamp mới hơn trạng thái đang lưu; log và bỏ qua (không lỗi cứng) các sự kiện đến muộn hơn trạng thái hiện tại.",
    "source_url": "https://hookdeck.com/webhooks/guides/webhook-ordering-why-its-hard-and-how-to-handle-it"
  },
  {
    "id_prefix": "DOM",
    "question": "Danh sách trạng thái giao hàng/webhook chính xác của Grab Express Partner Deliveries API (ví dụ có thật sự tồn tại QUEUEING/ALLOCATING/PICKING/IN_DELIVERY/COMPLETED/CANCELED/RETURNED hay không) KHÔNG thể xác minh từ tài liệu công khai (developer.grab.com là SPA không thể fetch tĩnh) trong lần research này — team có bản Postman collection / sandbox payload thật từ hợp đồng đối tác Grab để lấy đúng tên field trước khi build bảng mapping trạng thái không?",
    "impact": "medium",
    "suggested_default": "Bắt buộc lấy payload webhook thật từ Grab sandbox (qua đầu mối BD/partner support) trước khi chốt bảng mapping trạng thái — không hardcode tên trạng thái suy đoán.",
    "source_url": "https://developer.grab.com/"
  },
  {
    "id_prefix": "DOM",
    "question": "Ngưỡng cảnh báo COD 2.000.000đ trong CukCuk có đang dùng đúng hạn mức của gói dịch vụ Grab mà cửa hàng CukCuk hiện ký (COD thường tối đa 2 triệu, 'Giao hàng Chủ Shop' tối đa 5 triệu, gói VIP 2–5 triệu đang tạm ngưng từ 21/2/2025) hay là một con số MISA tự đặt cứng, cần theo hạn mức Grab trả về theo từng merchant?",
    "impact": "medium",
    "suggested_default": "Đọc hạn mức COD từ response quote/config API của Grab theo từng merchant (nếu API hỗ trợ) thay vì hardcode 2.000.000đ; nếu API không trả field này thì giữ 2.000.000đ làm mặc định an toàn và ghi rõ giả định.",
    "source_url": "https://www.grab.com/vn/en/campaign/grabexpress-dich-vu-giao-hang-chu-shop-nang-muc-ung-tien-truoc-len-den-5-trieu/"
  },
  {
    "id_prefix": "DOM",
    "question": "Danh sách '5 tỉnh' phủ sóng trong tài liệu dự án cũ có vẻ sai/lỗi thời (Grab VN công bố COD phủ sóng ~16+ tỉnh/thành và mở rộng theo thời gian) — CukCuk nên validate khả năng phục vụ (serviceability) động qua response của API Quote/Coverage của Grab tại thời điểm tạo đơn, thay vì hardcode danh sách tỉnh cố định trong DeliveryConnection?",
    "impact": "medium",
    "suggested_default": "Validate serviceability động qua API Quote (lỗi/response 'not serviceable' từ Grab) thay vì danh sách tỉnh hardcode.",
    "source_url": "https://www.grab.com/vn/en/blog/driver/capnhathanmucboihoan-expansion/"
  },
  {
    "id_prefix": "DOM",
    "question": "Chính sách retry webhook của Grab Express (số lần, backoff) chưa xác minh được từ nguồn chính thống trong lần research này — theo tiền lệ GHTK (retry đúng 1 lần nếu không nhận HTTP 200), CukCuk có nên thiết kế endpoint webhook trả 200 ngay lập tức rồi xử lý bất đồng bộ (queue) để tránh bỏ lỡ sự kiện do timeout xử lý đồng bộ không?",
    "impact": "medium",
    "suggested_default": "Trả HTTP 200 ngay khi nhận webhook hợp lệ, đẩy vào hàng đợi xử lý bất đồng bộ (idempotent), không phụ thuộc giả định số lần retry của Grab.",
    "source_url": "https://api.ghtk.vn/docs/submit-order/webhook/"
  },
  {
    "id_prefix": "DOM",
    "question": "Ngay cả khi trạng thái giao hàng được tự động đồng bộ, thu ngân có cần một bước xác nhận thủ công cuối cùng ('đã đối soát tiền mặt với tài xế/Grab') trước khi đơn được đóng — tương tự bước 'Đã đối soát' tách biệt của GHTK — để tránh đóng đơn 'Đã thanh toán' trước khi tiền thực sự về?",
    "impact": "medium",
    "suggested_default": "Có — giữ một bước xác nhận thủ công cuối (hybrid: auto-advance trạng thái giao hàng, nhưng đóng đơn/'Đã thanh toán' vẫn cần xác nhận của thu ngân), trừ khi Grab cung cấp webhook đối soát tiền rõ ràng.",
    "source_url": "https://api.ghtk.vn/docs/submit-order/webhook/"
  }
]
```
