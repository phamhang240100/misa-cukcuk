# Câu hỏi cần làm rõ — Tích hợp Grab Express × MISA CukCuk (C86574)

Tổng hợp các điểm **chưa rõ / cần chốt** phát hiện khi sơ đồ hóa file XMind, đối chiếu
[tài liệu Grab Express](https://developer.grab.com/docs/grab-express/) và cách Sapo tích hợp.
Xếp theo nhóm, gắn mức độ ưu tiên và đối tượng trả lời.

**Mức độ:** 🔴 Chặn (phải có mới thiết kế/dev được) · 🟡 Quan trọng · ⚪ Nên có
**Đối tượng:** `PO` = Product/BA yêu cầu · `Grab` = đối tác Grab · `Dev` = kỹ thuật MISA · `KT` = Kế toán/Vận hành

---

## A. Xác thực & phân quyền (Authentication) — phần bạn thấy chưa rõ

> Bối cảnh: Màn "Kết nối" chỉ thu **SĐT + địa chỉ**. Đây **không phải** cơ chế xác thực — chúng chỉ là hồ sơ *người gửi (sender)* đính vào mỗi vận đơn. Auth thật là **OAuth 2.0 `client_credentials`** ở cấp **đối tác MISA** (token endpoint GrabID, Bearer token ~7 ngày), cấu hình ở backend, người dùng không nhập.

| # | Câu hỏi | Ưu tiên | Hỏi ai |
|---|---|---|---|
| A1 | Mô hình credential: **tất cả nhà hàng dùng CHUNG** `client_id/secret` cấp-partner của MISA, hay **mỗi nhà hàng/chuỗi có credential riêng**? (quyết định đối soát, bảo mật, rate-limit, cô lập sự cố) | 🔴 | PO·Grab |
| A2 | `client_id`/`client_secret` lưu ở đâu, **xoay vòng (rotate)** thế nào? Quy trình khi secret bị lộ? | 🔴 | Dev |
| A3 | Scope xác nhận là `grab_express.partner_deliveries`? Có cần scope khác cho quote / cancel? | 🟡 | Dev·Grab |
| A4 | Token cache ở tầng nào (per-server / shared)? Xử lý **đồng thời** khi token hết hạn (nhiều request cùng xin token)? | 🟡 | Dev |
| A5 | Gặp **401 giữa lúc thu ngân bấm Gửi đơn**: auto refresh + retry ngầm, hay báo lỗi cho thu ngân? Thu ngân thấy gì? | 🔴 | PO·Dev |
| A6 | **Xác thực webhook** từ Grab: dùng header `Authorization-Id` + `Authorization` do MISA tự đặt? Có thêm **HMAC/chữ ký** không (Grab ghi "không bắt buộc")? Chống **giả mạo webhook** thế nào? | 🔴 | Dev·Grab |
| A7 | **Chống mạo danh nhà hàng**: khai báo chỉ SĐT + địa chỉ, có cần **OTP/verify SĐT** không? Gì đảm bảo đúng nhà hàng đó kết nối? | 🔴 | PO |
| A8 | "Hủy kết nối" ở nghiệp vụ = xóa hồ sơ sender, hay **revoke** gì phía Grab? Ảnh hưởng đơn đang chạy? | 🟡 | PO·Dev |

---

## B. Onboarding & cấp phát (Provisioning)

| # | Câu hỏi | Ưu tiên | Hỏi ai |
|---|---|---|---|
| B1 | Có **bước duyệt/kích hoạt thủ công** phía MISA hoặc Grab không (giống lane *"Dự án kiểm tra trạng thái kết nối"* trong sơ đồ Grabfood)? Nếu có thì "Kết nối" ở web chỉ là *gửi yêu cầu* — trạng thái thật do đội Dự án chốt. Thời gian bao lâu? | 🔴 | PO |
| B2 | **Sandbox vs Production**: mỗi môi trường credential riêng — luồng chuyển sang prod cho từng nhà hàng thế nào? | 🟡 | Dev·Grab |
| B3 | Grab kích hoạt theo **city/country** — 5 tỉnh (HN, HCM, ĐN, QN, CT) có phải **đăng ký từng tỉnh** với Grab không? | 🟡 | Grab |
| B4 | Nhà hàng có **cần tài khoản Grab merchant riêng** không, hay chỉ là sender dưới tài khoản partner MISA? | 🔴 | PO·Grab |

---

## C. Phí, thanh toán, đối soát

| # | Câu hỏi | Ưu tiên | Hỏi ai |
|---|---|---|---|
| C1 | **Ai trả "Phí GH trả đối tác"** cho Grab? MISA ứng rồi thu lại nhà hàng, hay nhà hàng có ví/hợp đồng thanh toán riêng với Grab? | 🔴 | PO·KT |
| C2 | **COD** do tài xế thu hộ: tiền về đâu, **đối soát** với nhà hàng thế nào, chu kỳ bao lâu? | 🔴 | KT·Grab |
| C3 | **Phí thu khách ≠ phí trả đối tác** (thu khách sửa được): phần chênh lệch ai hưởng / ai chịu? | 🟡 | PO·KT |
| C4 | **Hóa đơn VAT phí vận chuyển**: ai xuất (Grab hay MISA)? Điều kiện đã khai email? Link GG Form dùng làm gì? | 🟡 | PO·KT |
| C5 | **Hoàn tiền** khi Hủy / FAILED / RETURNED: phí đã tính xử lý ra sao? | 🟡 | KT |

---

## D. API & môi trường kỹ thuật

| # | Câu hỏi | Ưu tiên | Hỏi ai |
|---|---|---|---|
| D1 | **Version API** và **base URL production** chốt? (`/grab-express/v1/...`) | 🟡 | Dev |
| D2 | **Rate limit / quota** bao nhiêu? Xử lý **429** thế nào? | 🟡 | Dev·Grab |
| D3 | **Idempotency** khi tạo đơn để tránh **double-create** lúc retry/mạng chập chờn? Key theo gì? | 🔴 | Dev |
| D4 | **Toạ độ (lat/long)** địa chỉ lấy/giao lấy từ đâu (geocode nào)? Grab yêu cầu **≥ 6 chữ số thập phân**. | 🔴 | Dev |
| D5 | "Siêu tốc - Thực phẩm" map sang **serviceType** nào của Grab? Có nhiều gói không? | 🟡 | Dev·Grab |
| D6 | Kích thước/khối lượng gói hàng (`packages`) lấy từ đâu — có bắt buộc không? | ⚪ | Dev·PO |

---

## E. Đồng bộ trạng thái & webhook

| # | Câu hỏi | Ưu tiên | Hỏi ai |
|---|---|---|---|
| E1 | Webhook **mất / không tới**: có **polling dự phòng** `GET /deliveries/{id}` không? Tần suất? | 🔴 | Dev |
| E2 | Webhook đến **sai thứ tự (out-of-order)**: xử lý bằng `timestamp` — quy tắc bỏ qua trạng thái cũ? | 🟡 | Dev |
| E3 | **Retry policy** của Grab khi callback lỗi? MISA phải trả **2xx trong bao lâu**? | 🟡 | Dev·Grab |
| E4 | **Bảng map 10 trạng thái GE** ↔ hiển thị/nghiệp vụ CukCuk có chốt chưa? (Lưu ý chính tả: Grab dùng **`CANCELED`**, XMind ghi `CANCELLED`) | 🔴 | PO·Dev |
| E5 | Thông báo **chỉ hiện ở thiết bị tạo đơn** — nếu thiết bị đó offline / thu ngân khác ca thì sao? | 🟡 | PO |
| E6 | **GE trả về CANCELED / FAILED / RETURNED** (không auto-map → đơn CukCuk kẹt ở *Chờ giao hàng* / *Đang giao hàng*): thu ngân được thao tác gì? **Gửi lại** (Grab / đổi đối tác) hay **chỉ Hủy**? Có nên cảnh báo/đổi màu thay vì im lặng? | 🔴 | PO |
| E7 | Các trạng thái hủy GE trả về **từ đâu, ứng với trạng thái CukCuk nào**? Dự kiến: **FAILED** = GE `ALLOCATING` (chưa tìm được tài xế) → đơn còn *Chờ giao hàng*; **CANCELED** = sau khi tài xế đã nhận (`PENDING_PICKUP`/`PICKING_UP`), thường vẫn *Chờ giao hàng* (thu ngân chưa bấm Giao hàng); **RETURNED** = sau pickup, có thể lúc *Đang giao hàng*. Xác nhận đúng không? | 🟡 | PO·Grab |

---

## F. Nghiệp vụ & tình huống biên (Edge cases)

| # | Câu hỏi | Ưu tiên | Hỏi ai |
|---|---|---|---|
| F1 | **Sửa đơn sau khi đã gửi GE** (đổi địa chỉ/món/COD): cho phép không? Nếu có thì đồng bộ lại với Grab thế nào? | 🔴 | PO |
| F2 | **Hủy đơn khi Grab đã `PICKING_UP` / `IN_DELIVERY`**: Grab chỉ cho hủy tới `PICKING_UP` — nghiệp vụ CukCuk xử lý ra sao khi quá trạng thái? | 🔴 | PO |
| F3 | Tài xế **trả hàng (`RETURNED`)**: nghiệp vụ CukCuk (hoàn kho? hủy hóa đơn? thu/hoàn phí?) | 🟡 | PO |
| F4 | Đơn **Order online / Haravan** khác gì luồng POS? (XMind có nhánh riêng — cần vẽ bổ sung?) | 🟡 | PO |
| F5 | **Nhiều chi nhánh**: kết nối theo **từng chi nhánh** hay **toàn chuỗi**? Quyền role nào được kết nối/hủy (Quản trị / Quản lý chuỗi)? | 🔴 | PO |
| F6 | Đổi **"Grab" → "Grab Food"**: ảnh hưởng dữ liệu/đơn cũ đã tạo bằng tên "Grab"? | ⚪ | PO |
| F7 | Giới hạn **COD ≤ 2.000.000đ** và **5 tỉnh** là do Grab hay do MISA đặt? Có thay đổi theo thời gian không (hard-code hay cấu hình)? | 🟡 | PO·Grab |
| F8 | **Đơn COD = 0** (khách đã thu đủ trước, Còn phải thu = 0): sau khi giao xong có cần nút **Thu tiền** không? → ✅ **ĐÃ CHỐT (PO): GIỮ NGUYÊN nút Thu tiền** — bấm mở màn thu tiền, Còn phải thu = 0, xác nhận để đóng đơn sang *Đã thanh toán* (đồng nhất nhà hàng tự giao). | ✅ | ĐÃ CHỐT |

---

## G. Bảo mật & tuân thủ

| # | Câu hỏi | Ưu tiên | Hỏi ai |
|---|---|---|---|
| G1 | **PII khách hàng** (tên, SĐT, địa chỉ) gửi sang Grab: có điều khoản/đồng ý dữ liệu chưa? | 🟡 | PO·Legal |
| G2 | **Log/audit** khi gửi đơn & nhận webhook (đối soát tranh chấp)? Lưu bao lâu? | 🟡 | Dev |
| G3 | Lưu `access_token` / `client_secret`: **mã hóa at-rest**? Ai truy cập được? | 🟡 | Dev |

---

## H. Trạng thái đơn & điều kiện hiển thị nút (Giao hàng / Thu tiền)

> Bối cảnh: **2 loại trạng thái chạy song song, độc lập** — trạng thái đơn **CukCuk** (đổi *chỉ* khi thu ngân bấm nút) và trạng thái **Grab Express** (do webhook). CukCuk **không tự map** GE → CukCuk. Nút gắn theo trạng thái CukCuk: *Chờ gửi đối tác* → **Gửi đơn hàng**; *Chờ giao hàng* → **Giao hàng**; *Đang giao hàng* → **Thu tiền**; *Đã thanh toán* → hết nút.

| # | Câu hỏi | Ưu tiên | Hỏi ai |
|---|---|---|---|
| H1 | **Có gate nút theo trạng thái GE không?** Hiện XMind cho bấm **Giao hàng / Thu tiền** bất kể GE đang ở đâu → thu ngân có thể bấm **Giao hàng** khi GE mới `ALLOCATING` (đang tìm tài xế). Có nên chặn/cảnh báo (vd chỉ cho Giao hàng khi GE ≥ `PICKING_UP`, chỉ cho Thu tiền khi GE = `COMPLETED`)? | 🔴 | PO |
| H2 | Khi GE trả **`CANCELED` / `FAILED` / `RETURNED`** mà đơn CukCuk **chưa đóng** (vẫn Chờ giao / Đang giao): có **chặn Thu tiền** / cảnh báo / tự đổi trạng thái CukCuk không? (rủi ro: đánh dấu "đã thu" cho đơn khách chưa nhận) | 🔴 | PO |
| H3 | Nút **Hủy** ở các trạng thái CukCuk có **gọi hủy vận đơn sang Grab** không (chỉ được khi GE ∈ QUEUEING/ALLOCATING/PICKING_UP)? Nếu GE quá trạng thái đó thì Hủy phía CukCuk xử lý sao? | 🔴 | PO·Dev |

---

## I. Thu tiền, đặt cọc & mô hình thanh toán phí ship

> **Nghiên cứu thị trường (có nguồn):** GrabExpress dùng mô hình **aggregator** — cửa hàng **không cần tài khoản Grab**, chỉ nhập tên+SĐT người gửi; Grab trừ phí ship từ **"ví tín dụng của Đối tác"**. AhaMove thì ngược lại — **mỗi cửa hàng 1 tài khoản/ví riêng** (SĐT trỏ tới ví đã đăng ký), phí trừ ví cửa hàng. → Chi tiết ở `NGHIEN-CUU-MO-HINH-THANH-TOAN.md` (nếu tạo). **[Suy luận]** với MISA-Grab, "Đối tác giữ ví" nhiều khả năng là **MISA**, nhưng **chưa có tài liệu MISA xác nhận** — cần chốt ở I1.

| # | Câu hỏi | Ưu tiên | Hỏi ai |
|---|---|---|---|
| I1 | **Mô hình tài khoản MISA-Grab là gì** — aggregator (ví của MISA, cửa hàng không có tài khoản Grab) hay per-merchant (cửa hàng có ví Grab riêng)? *(Gắn với A1/B4. Suy luận hiện tại: aggregator, vì form chỉ có SĐT/địa chỉ giống mẫu Haravan.)* | 🔴 | PO·Grab |
| I2 | Nếu aggregator: **cơ chế MISA thu lại phí ship từ cửa hàng** là gì — **quỹ trả trước quản lý ở MISA** (cần thêm màn Nạp quỹ/Số dư), **công nợ/postpaid** (đối soát định kỳ), hay **cấn trừ vào COD**? | 🔴 | PO·KT |
| I3 | **Đơn KHÔNG COD** (khách trả đủ trước, không thu phí ship, COD=0): phí trả đối tác **trừ ở đâu**, khi nào? Đây là case không có tiền trong đơn để bù phí → nguồn tiền lấy từ đâu? | 🔴 | PO·KT |
| I4 | **Hết số dư ví / vượt hạn mức công nợ**: Grab từ chối đơn → CukCuk có **cảnh báo "không đủ số dư"** khi Gửi đơn không? Chặn hay cho gửi? | 🔴 | PO·Dev |
| I5 | Nút **Thu tiền** với đơn GE-COD = **thu tiền mặt tại quầy** hay chỉ **ghi nhận/đóng đơn** (vì tiền đã do tài xế Grab thu hộ)? Nếu mở màn tính tiền thì "còn phải thu tại quầy" = 0? | 🔴 | PO·KT |
| I6 | **Thời điểm bấm Thu tiền**: ngay khi giao xong, hay chờ tới lúc **Grab đối soát chuyển COD về** (1–3 ngày)? Ai xác nhận đã nhận đủ tiền từ Grab? Có tự đối soát không? | 🟡 | PO·KT |
| I7 | **Đặt cọc trước**: COD = *Còn phải thu* = Tổng − Cọc. Cọc hạch toán vào đâu? Khi Thu tiền có tự trừ cọc để ra "còn phải thu = 0" không? Nếu Cọc ≥ Tổng thì COD = 0 xử lý sao? | 🟡 | PO·KT |
| I8 | Với đơn có COD: Grab chuyển **nguyên số COD về MISA rồi MISA cấn phí ship**, hay Grab chuyển thẳng cửa hàng? Ai đối soát với cửa hàng? | 🟡 | KT·Grab |

---

## Tóm tắt các câu 🔴 CHẶN (cần trả lời trước tiên)

1. **A1** — Credential chung của MISA hay riêng từng nhà hàng?
2. **A5** — Xử lý 401 lúc gửi đơn (thu ngân thấy gì)?
3. **A6** — Xác thực & chống giả mạo webhook?
4. **A7** — Chống mạo danh nhà hàng khi chỉ nhập SĐT/địa chỉ?
5. **B1** — Có bước duyệt/kích hoạt thủ công không? Bao lâu?
6. **B4** — Nhà hàng có cần tài khoản Grab merchant riêng?
7. **C1 / C2** — Ai trả phí đối tác? COD & đối soát về đâu?
8. **D3 / D4** — Idempotency tạo đơn? Nguồn toạ độ lat/long?
9. **E1 / E4** — Polling dự phòng khi mất webhook? Bảng map 10 trạng thái?
10. **F1 / F2 / F5** — Sửa/hủy đơn sau khi gửi GE? Kết nối theo chi nhánh hay chuỗi?
11. **H1 / H2** — Gate nút Giao hàng/Thu tiền theo trạng thái GE? Xử lý khi GE CANCELED/FAILED/RETURNED?
12. **I1 / I2 / I3** — Mô hình ví (aggregator hay per-merchant)? MISA thu phí lại từ cửa hàng thế nào? Đơn không-COD lấy tiền phí ở đâu?
13. **I4 / I5** — Cảnh báo hết số dư ví khi gửi đơn? Nút Thu tiền = thu quầy hay chỉ ghi nhận (COD tài xế đã thu hộ)?

> **Nhóm mô hình tài chính (I1–I3)** là **quyết định nền tảng** — nên chốt trước, vì nó quyết định có cần thêm màn Nạp quỹ/Số dư và toàn bộ luồng đối soát.

---

## Nguồn tham chiếu
- Grab Express Developer (Auth · State machine · Webhook): https://developer.grab.com/docs/grab-express/
- Sapo — Tích hợp Grab Express: https://help.sapo.vn/huong-dan-ket-noi-doi-tac-grab
- Haravan — Kết nối GrabExpress (không cần tài khoản Grab, chỉ nhập tên+SĐT): https://help.haravan.com/docs/shipping/connect-carriers/huong-dan-ket-noi-nha-van-chuyen-grabexpress-tren-haravan/
- Grab VN — Thanh toán Giao Hàng Công Ty (trừ phí từ ví tín dụng đối tác): https://www.grab.com/vn/en/blog/driver/ghct-tienmat/
- Grab VN — Quy trình COD (tài xế thu hộ, chuyển về 1–3 ngày): https://www.grab.com/vn/en/blog/driver/quytrinhboihoan-cod/
- CukCuk — Kết nối đối tác giao hàng AhaMove (cửa hàng đăng ký tài khoản AhaMove trước): https://helpv2.cukcuk.vn/vi/kb/ket_noi_doi_tac_giao_hang
- AhaMove Developers — Payment flow (BALANCE trừ ví cửa hàng): https://developers.ahamove.com/docs/payment-flow
- File yêu cầu gốc: `Cukcuk/Luồng/*.jpg` (XMind C86574)
