# Domain Research — Ops flow: Restaurant POS ↔ ShopeeFood/GrabFood delivery (VN)

> Domain: Restaurant POS — quy trình nhận đơn giao hàng ShopeeFood/GrabFood tại quán (VN)
> Generated: 2026-07-23
> Sources:
> - https://driver.shopeefood.vn/tin-tuc/huong-dan-xu-ly-nhung-tinh-huong-thuong-gap-tai-buoc-nhan-don-va-lay-hang/
> - https://driver.shopeefood.vn/tin-tuc/huong-dan-xu-ly-nhung-tinh-huong-thuong-gap-tai-buoc-giao-hang/
> - https://help.sapo.vn/nhan-va-xu-ly-don-hang-shopee-food-tren-sapo
> - https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-foodapp/ket-noi-shopeefood/
> - https://merchant.grab.com/vn-vn/guides/default/quan-ly-don-hang-lay-tai-quan-va-don-hang-dat-truoc
> - https://www.grab.com/vn/en/blog/driver/gequytrinhgiaonhandonhang22/
> - https://vietpress.vn/shopee-ap-dung-chinh-sach-cod-moi-tu-ngay-11-3-d93639.html (chỉ dùng làm bối cảnh, KHÔNG áp dụng trực tiếp cho đơn nhà hàng — xem ghi chú)

## Câu hỏi 1 — Điểm chạm quán ↔ shipper khi giao hàng

**Thông tin tài xế/shipper thực sự kiểm tra khi lấy hàng (bằng chứng từ nguồn chính thức):**
- ShopeeFood Driver (hướng dẫn chính thức bước Nhận đơn & Lấy hàng): tài xế đối chiếu **mã đơn hàng**, **danh sách món**, **số lượng từng món**, và **xác nhận trực tiếp với nhân viên quán** trước khi nhận. Không có bước OTP; xác nhận dựa trên đối chiếu mã đơn + danh sách món bằng mắt.
- GrabExpress (chuẩn thao tác tài xế): "Đối tác sử dụng Mã đơn hàng để đối chiếu với nhân viên trước khi nhận đơn" — cùng mô hình: mã đơn là khóa đối chiếu chính, không phải tên khách.
- Sapo (POS FnB, tích hợp ShopeeFood chính thức): quy trình bàn giao cho tài xế nền tảng là **"Đối chiếu mã đơn hàng rút gọn xem có khớp chính xác với mã hiển thị trên ứng dụng Shopee Partner của tài xế"**, sau đó kiểm tra danh sách mặt hàng, rồi bấm "Giao và hoàn tất". Với đơn khách tự đến lấy: cũng dùng **mã đơn rút gọn** (ví dụ format `P123456...1234`) để đối chiếu với khách, không dùng tên khách.
- KiotViet FnB: in **mã đơn ShopeeFood đầy đủ** trên phiếu chế biến/bàn giao, nhưng thực tế nhân viên dùng **4 số cuối của mã đơn** để bàn giao nhanh cho tài xế (vì mã đầy đủ quá dài để đọc/so khớp nhanh khi đông đơn).
- iPOS FoodHub: đồng bộ toàn bộ đơn về 1 máy, tự động đẩy xuống bếp qua KDS, theo dõi trạng thái realtime; không có tài liệu công khai chi tiết về format tem bàn giao (không đưa vào bằng chứng cụ thể, tránh suy đoán).

**Kết luận vận hành:** Chìa khóa đối chiếu khi bàn giao là **MÃ ĐƠN (dạng rút gọn/vài ký tự cuối)** + **danh sách/số lượng món**, không phải tên khách hay OTP. Cả 2 vendor lớn (Sapo, KiotViet) đều rút gọn mã đơn để tăng tốc đối chiếu bằng mắt khi quán có nhiều đơn cùng lúc — đây là điểm khác biệt thiết kế đáng cân nhắc (rút gọn bao nhiêu ký tự, đặt ở đâu trên tem, cỡ chữ).

**Exception patterns đã xác nhận (driver.shopeefood.vn — bước Nhận đơn/Lấy hàng):**
- Quán làm món chậm >20 phút: tài xế xác nhận lại thời gian với quán; nếu khách không đợi được thì hủy theo quy định.
- Quán hết món: tài xế gọi khách xác nhận → vào "Sửa đơn" → "Hết món" → xóa món hết hàng; nếu hết toàn bộ đơn thì liên hệ quán để hủy.
- Sai giá món: tài xế báo khách, có bước "Báo sai giá" kèm tải hóa đơn, hoặc hủy nếu khách không đồng ý.
- Không tìm thấy quán/quán đóng cửa: tài xế gọi quán tối thiểu 3 lần (cách nhau ~3 phút) trước khi từ chối kèm bằng chứng ảnh.
- Đơn bị hủy (Sapo): hệ thống tự động in "phiếu hủy" xuống bếp để dừng chế biến — xác nhận có luồng in tem hủy riêng biệt với tem chế biến gốc.

## Câu hỏi 2 — Thời điểm thu tiền & bấm "hoàn thành" đơn

**Hai mô hình thiết kế khác nhau đã tìm thấy giữa các POS FnB VN (đây là khác biệt quan trọng cần BA chốt):**

1. **Mô hình Sapo — hoàn thành do nhân viên quán chủ động bấm tại thời điểm bàn giao:** Sau khi đối chiếu mã đơn + món với tài xế, nhân viên quán bấm nút **"Giao và hoàn tất"** ngay tại quầy — đây là trigger hoàn thành đơn, xảy ra TRƯỚC khi tài xế thực giao hàng tới khách.
2. **Mô hình KiotViet — hoàn thành do nền tảng đẩy trạng thái về, không phải quán bấm:** Trạng thái đơn tại quán đi qua Mới → Tìm tài xế → Xế đang đến → Đang giao → **Đã giao** (trạng thái cuối, tự động khi ShopeeFood báo tài xế đã giao xong cho khách) — quán KHÔNG chủ động bấm "hoàn thành giao hàng tới khách"; hệ thống tự hoàn thành khi nhận callback từ ShopeeFood. Doanh thu ghi nhận tự động = "Tổng tiền quán nhận" (đã trừ chiết khấu).

→ Đây là câu hỏi BA cốt lõi: nghiệp vụ CukCuk nên theo mô hình nào — quán tự chốt tại điểm bàn giao (Sapo) hay hệ thống tự chốt theo callback nền tảng khi giao xong cho khách (KiotViet)? Ảnh hưởng trực tiếp tới thời điểm in bill, ghi nhận doanh thu, đối soát ca.

**Về việc "thu tiền" thực tế của nhân viên quán:**
- Không tìm thấy bằng chứng nào cho thấy nhân viên quán thực hiện thao tác "thu tiền mặt" cho đơn giao qua app (khớp với bối cảnh đã biết: khách trả tiền cho ShopeeFood/tài xế, không trả trực tiếp quán).
- Nút bấm phía ShopeeFood Merchant liên quan tới bàn giao được gọi là "Báo tài xế đã xong món" / "Xác nhận" — ngôn ngữ hệ thống nói về "món đã xong", không phải "đã thu tiền". Điều này củng cố: hành động của nhân viên quán tại bước bàn giao là **đánh dấu trạng thái giao hàng**, không phải một bút toán thu tiền.
- KiotViet ghi nhận doanh thu tự động bằng con số ròng sau chiết khấu — không có bước nhân viên nhập số tiền thu.

**Lưu ý về COD (cảnh báo phạm vi):** Có tìm thấy thông tin chính sách COD mới (từ 11/3) áp dụng cho dịch vụ **Shopee Xpress Instant (SPX Instant)** — đây là dịch vụ giao hàng/bưu kiện của Shopee, KHÔNG phải luồng đơn hàng ShopeeFood (đặt món ăn tại quán). Không nên áp dụng trực tiếp chi tiết chính sách này (ẩn số tiền thu hộ tới khi tài xế bấm "Đã lấy hàng") cho luồng ShopeeFood nhà hàng vì chưa có bằng chứng xác nhận áp dụng tương tự — nguồn không đề cập rõ COD trong luồng giao hàng ShopeeFood thông thường (driver.shopeefood.vn — bước Giao hàng — không đề cập chi tiết thu tiền COD/online trong quy trình bình thường). Đây nên là một câu hỏi mở, không phải giả định.

## Tổng hợp so sánh 3 POS (bằng chứng trực tiếp)

| Vendor | Cách đối chiếu bàn giao | Trigger "hoàn thành" | Ghi nhận doanh thu |
|---|---|---|---|
| Sapo | Mã đơn rút gọn (vd `P123456...1234`) đối chiếu với app tài xế | Nhân viên bấm "Giao và hoàn tất" tại quầy khi trao hàng | Không nêu chi tiết công thức |
| KiotViet | Mã đơn đầy đủ in trên phiếu, thực tế dùng 4 số cuối để giao nhanh | Tự động khi ShopeeFood báo trạng thái "Đã giao" (callback nền tảng) | Tự động = tổng tiền quán nhận sau chiết khấu |
| iPOS | Không có bằng chứng chi tiết công khai (không đưa vào kết luận) | Không có bằng chứng chi tiết | Không có bằng chứng chi tiết |

## Question bank (JSON)

```json
[
  {
    "id_prefix": "DOM",
    "question": "Nghiệp vụ CukCuk nên theo mô hình nào cho bước \"hoàn thành giao hàng\": (a) nhân viên quán chủ động bấm hoàn thành ngay khi trao túi hàng cho tài xế (mô hình Sapo), hay (b) hệ thống tự cập nhật hoàn thành khi ShopeeFood báo tài xế đã giao xong tới khách (mô hình KiotViet)? Lựa chọn này quyết định thời điểm chốt bill và ghi nhận doanh thu.",
    "impact": "high",
    "suggested_default": "Theo mô hình Sapo: nhân viên bấm hoàn thành tại thời điểm bàn giao cho tài xế (quán không cần chờ callback giao-tới-khách, phù hợp vận hành quầy bận rộn)",
    "source_url": "https://help.sapo.vn/nhan-va-xu-ly-don-hang-shopee-food-tren-sapo"
  },
  {
    "id_prefix": "DOM",
    "question": "Xác nhận: hành động \"hoàn thành\"/bàn giao đơn app tại quán chỉ là đánh dấu trạng thái giao hàng, KHÔNG phát sinh bút toán thu tiền tại quầy (vì khách trả tiền cho ShopeeFood/tài xế) — CukCuk có cần một trạng thái bill riêng \"đã bàn giao - chờ đối soát\" thay vì \"đã thanh toán\" không?",
    "impact": "high",
    "suggested_default": "Có — bill của đơn app chuyển trạng thái \"đã bàn giao/hoàn tất giao hàng\", tách biệt khỏi khái niệm \"đã thu tiền tại quầy\"; doanh thu thực nhận cập nhật khi đối soát với ShopeeFood",
    "source_url": "https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-foodapp/ket-noi-shopeefood/"
  },
  {
    "id_prefix": "DOM",
    "question": "Tem/phiếu bàn giao cho tài xế nên in mã đơn ShopeeFood dạng nào để đối chiếu nhanh: mã đầy đủ, hay mã rút gọn (vài ký tự cuối, cỡ chữ lớn) như cách Sapo/KiotViet đang làm để giảm sai sót khi quán có nhiều đơn cùng lúc?",
    "impact": "high",
    "suggested_default": "In mã rút gọn (4-6 ký tự cuối của mã đơn) với cỡ chữ lớn, nổi bật ở đầu tem, kèm danh sách món + số lượng bên dưới",
    "source_url": "https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-foodapp/ket-noi-shopeefood/"
  },
  {
    "id_prefix": "DOM",
    "question": "Khi đơn bị hủy (khách/tài xế/quán hủy) sau khi bếp đã bắt đầu chế biến, hệ thống CukCuk có cần tự động in một \"phiếu hủy\" riêng xuống bếp để báo dừng làm món (giống cơ chế Sapo) không, hay chỉ cập nhật trạng thái trên màn hình mà không in gì thêm?",
    "impact": "high",
    "suggested_default": "Tự động in phiếu hủy riêng xuống bếp khi đơn chuyển trạng thái hủy, để tránh bếp tiếp tục làm món đã hủy",
    "source_url": "https://help.sapo.vn/nhan-va-xu-ly-don-hang-shopee-food-tren-sapo"
  },
  {
    "id_prefix": "DOM",
    "question": "Khi quán phát hiện hết món/sai giá SAU khi đơn đã được xác nhận và tài xế đang trên đường tới lấy hàng (quán phải \"Sửa đơn\" trên ShopeeFood Merchant), CukCuk có cần tự động in lại/cập nhật tem bếp phản ánh đúng danh sách món mới không?",
    "impact": "high",
    "suggested_default": "Có — khi có sửa đơn (hết món/sai giá) sau xác nhận, hệ thống in tem cập nhật hoặc đánh dấu rõ tem cũ đã lỗi thời để tránh giao nhầm món",
    "source_url": "https://driver.shopeefood.vn/tin-tuc/huong-dan-xu-ly-nhung-tinh-huong-thuong-gap-tai-buoc-nhan-don-va-lay-hang/"
  },
  {
    "id_prefix": "DOM",
    "question": "Với đơn giao qua ShopeeFood/GrabFood, tem/phiếu bàn giao có cần hiển thị trạng thái thanh toán của đơn (đã thanh toán online vs COD) để nhân viên quán biết cách ứng xử khi trao hàng cho tài xế, hay việc thu tiền hoàn toàn nằm ngoài phạm vi thao tác của quán và không cần thể hiện trên tem?",
    "impact": "medium",
    "suggested_default": "Không bắt buộc hiển thị trên tem bàn giao (quán không tham gia thu tiền), nhưng nên lưu trong dữ liệu đơn để phục vụ đối soát/báo cáo",
    "source_url": "https://driver.shopeefood.vn/tin-tuc/huong-dan-xu-ly-nhung-tinh-huong-thuong-gap-tai-buoc-giao-hang/"
  },
  {
    "id_prefix": "DOM",
    "question": "Khi tài xế đến trễ hoặc quán chờ quá lâu (tài xế xác nhận thời gian chờ >20 phút theo hướng dẫn ShopeeFood) mà chưa có ai tới lấy, nhân viên quán cần thao tác gì trên POS: giữ nguyên phiếu bếp chờ, chủ động liên hệ ShopeeFood, hay có nút \"báo chậm giao\" riêng?",
    "impact": "medium",
    "suggested_default": "Giữ trạng thái đơn chờ bàn giao, không hủy tự động; hiển thị cảnh báo thời gian chờ quá X phút để nhân viên chủ động xử lý",
    "source_url": "https://driver.shopeefood.vn/tin-tuc/huong-dan-xu-ly-nhung-tinh-huong-thuong-gap-tai-buoc-nhan-don-va-lay-hang/"
  },
  {
    "id_prefix": "DOM",
    "question": "Đơn \"khách tự đến lấy\" (self pickup, không qua tài xế nền tảng) dùng cùng cơ chế đối chiếu mã đơn rút gọn với khách hàng (theo mô hình Sapo) — CukCuk có cần một luồng UI/tem riêng cho loại đơn này (không có bước bàn giao tài xế, đối chiếu trực tiếp với khách) không?",
    "impact": "medium",
    "suggested_default": "Có — tách luồng riêng: tem/màn hình hiển thị rõ \"Khách tự đến lấy\", đối chiếu mã đơn rút gọn trực tiếp với khách, không có bước gán/chờ tài xế",
    "source_url": "https://help.sapo.vn/nhan-va-xu-ly-don-hang-shopee-food-tren-sapo"
  },
  {
    "id_prefix": "DOM",
    "question": "Theo cơ chế tự động nhận đơn sau 2 phút không thao tác (áp dụng cả trên ShopeeFood lẫn Sapo nếu quán không bật nhận thủ công), CukCuk có cần cảnh báo/đếm ngược rõ ràng cho nhân viên quán trước khi hệ thống tự động xác nhận đơn, để tránh nhận đơn mà bếp không kịp làm?",
    "impact": "medium",
    "suggested_default": "Hiển thị đếm ngược và cảnh báo âm thanh trước khi tự động xác nhận, cho phép nhân viên chủ động từ chối trong 2 phút nếu bếp quá tải",
    "source_url": "https://help.sapo.vn/nhan-va-xu-ly-don-hang-shopee-food-tren-sapo"
  }
]
```
