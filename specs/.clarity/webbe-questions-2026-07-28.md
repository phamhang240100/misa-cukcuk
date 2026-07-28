# Bộ câu hỏi làm rõ — Web BE, luồng tích hợp ShopeeFood

> **Cách dùng:** trả lời theo mã câu hỏi, ví dụ `Q-B03: b` hoặc `Q-B03: b, nhưng đổi 5 phút thành 10 phút`. Câu nào bỏ qua thì tôi lấy **▶ Đề xuất** làm mặc định và ghi rõ trong XMind là *giả định của BA*.
>
> Câu hỏi ở đây **chỉ hỏi nghiệp vụ** — chuyện gọi API nào, poll bao lâu là việc tôi tự đối chiếu tài liệu, không hỏi anh/chị.
>
> Nguồn đã đối chiếu: prototype `[PROTO-BE]`, `[DOC-MAP]` + 5 comment, `[DOC-RULE]`, `[API]` Foody External v0.0.17 + Authorization API for ISV Partner.
> Những gì đã chốt/đã tự giải nằm ở [webbe-triage-2026-07-28.md](webbe-triage-2026-07-28.md) — **không lặp lại ở đây**.

---

## A. Màn *Ứng dụng* — thẻ ShopeeFood

**Q-A01 — Ai được phép kết nối / ngắt kết nối?**
Quán có 1 chủ và 4 nhân viên thu ngân dùng chung CukCuk. Nhân viên ca tối mở màn Ứng dụng, thấy nút **Ngắt kết nối**.
(a) Chỉ tài khoản chủ/quản lý mới thấy các nút Kết nối, Ngắt kết nối, Đồng bộ, Tạm ngưng — thu ngân chỉ xem
(b) Ai đăng nhập được cũng làm được, không phân quyền
(c) Phân quyền theo vai trò có sẵn của CukCuk, tôi sẽ hỏi thêm danh sách vai trò
▶ **Đề xuất: (a)** — ngắt kết nối là hành động phá hoại, prototype hiện **không có** khái niệm phân quyền nào.

**Q-A02 — Có cần nhật ký thao tác không?**
Sáng ra chủ quán thấy 12 món biến mất khỏi ShopeeFood, không biết ai làm, lúc nào.
(a) Có màn *Nhật ký* ghi: ai · lúc nào · làm gì (đồng bộ / sửa món / ngắt kết nối / tạm ngưng)
(b) Không cần
▶ **Đề xuất: (a)** — vì `menu.sync` có thể xoá món hàng loạt.

**Q-A03 — Nút *In cấu hình* để làm gì?**
Prototype có nút này, bấm ra *"Chức năng đang tải mẫu in cấu hình…"* rồi hết.
(a) Bỏ nút
(b) In ra tờ tóm tắt: tên gian hàng đang nối, ngày kết nối, số món đã ghép — để chủ quán lưu hồ sơ
(c) Mục đích khác — xin cho biết
▶ **Đề xuất: (a)** — chưa thấy nhu cầu nghiệp vụ nào.

**Q-A04 — Nút *Gửi phản hồi cho MISA CukCuk*** (Email + Nội dung góp ý/báo lỗi)
(a) Giữ, gửi vào kênh hỗ trợ có sẵn của MISA
(b) Bỏ, đã có kênh hỗ trợ chung rồi
▶ **Đề xuất: (b)**

---

## B. Luồng kết nối gian hàng

**Q-B01 — Chủ quán trả lời sai câu hỏi đầu tiên.**
Modal chặn đầu hỏi *"Bạn đã có gian hàng trên ShopeeFood chưa?"*. Chủ quán bấm **[Tôi đã có gian hàng]** nhưng thật ra chưa có → quét QR sẽ hỏng.
(a) Bỏ luôn câu hỏi này, cứ cho quét QR — nếu chưa có gian hàng thì Shopee tự báo lỗi
(b) Giữ nguyên như prototype
(c) Giữ, nhưng nhánh "Chưa có" phải mở thẳng trang đăng ký ShopeeFood
▶ **Đề xuất: (c)**

**Q-B02 — Quán đang dùng POS khác (Ocha).**
Tài liệu Shopee ghi rõ: một gian hàng chỉ nối được một phần mềm tại một thời điểm; nếu đang nối Ocha thì **phải liên hệ nhân viên Shopee gỡ trước**, CukCuk không tự gỡ được.
(a) Khi phát hiện, hiện màn hướng dẫn: *"Gian hàng của bạn đang kết nối với phần mềm khác. Vui lòng liên hệ nhân viên phụ trách của ShopeeFood để ngắt kết nối cũ, sau đó quay lại đây."* + nút *Đã xử lý xong, thử lại*
(b) Chỉ báo lỗi ngắn gọn rồi thôi
▶ **Đề xuất: (a)**

**Q-B03 — Quét mã xong nhưng chọn nhầm gian hàng.**
Chủ quán có 2 gian hàng ShopeeFood (chi nhánh Q1 và Q3). Đang thiết lập cho nhà hàng "Ánh Dương Q1" trên CukCuk nhưng lúc quét lại chọn gian hàng Q3.
(a) CukCuk hiện tên gian hàng vừa nối và **bắt xác nhận**: *"Bạn đang kết nối nhà hàng **Ánh Dương Q1** với gian hàng **Ánh Dương Q3**. Đúng chưa?"* → **Đúng / Chọn lại**
(b) Cứ nối, sai thì ngắt làm lại
▶ **Đề xuất: (a)** — vì ngắt kết nối là luồng nặng (xem Q-H01).

**Q-B04 — Mã QR hết hạn (15 phút).**
Chủ quán mở màn quét rồi đi phục vụ khách, 20 phút sau quay lại.
(a) Mã mờ đi + chữ *"Mã đã hết hạn"* + nút **Tạo mã mới**
(b) Tự sinh mã mới, không cần bấm
▶ **Đề xuất: (a)** — tự sinh liên tục sẽ tạo mã rác.

**Q-B05 — Bao lâu thì bỏ cuộc?**
Đang chờ chủ quán bấm duyệt bên app Shopee.
(a) Chờ hết 15 phút của mã rồi mới báo hết hạn
(b) Sau 2 phút hiện thêm gợi ý *"Chưa thấy phản hồi. Bạn đã mở app Shopee Partner và bấm Đồng ý chưa?"* nhưng vẫn chờ tiếp
▶ **Đề xuất: (b)**

**Q-B06 — Đang tải dữ liệu ban đầu thì rớt mạng.**
Tiến trình 4 bước (tải món, nhóm, sở thích phục vụ) đang chạy dở thì mất mạng. Prototype **không có nhánh lỗi nào**.
(a) Dừng, báo *"Không tải được dữ liệu từ ShopeeFood. Vui lòng kiểm tra kết nối mạng."* + nút **Thử lại** (chạy lại từ bước lỗi, không làm lại từ đầu)
(b) Tự thử lại ngầm 3 lần rồi mới báo lỗi
▶ **Đề xuất: (a) + tự thử lại 3 lần trước khi hiện lỗi** (kết hợp cả hai)

**Q-B07 — Gian hàng ShopeeFood chưa có món nào.**
Quán mới mở gian hàng, thực đơn trên Shopee còn trống.
(a) Bỏ qua wizard ghép nối, đi thẳng luồng *đẩy thực đơn CukCuk lên ShopeeFood*
(b) Vẫn vào wizard, hiện trạng thái rỗng và hướng dẫn bấm **Thêm món**
▶ **Đề xuất: (a)** — đây là kịch bản rất phổ biến với quán mới.

---

## C. Wizard ghép nối 4 bước

> Đã chốt: **bắt buộc ghép 100%** (`WBE-Q-C1`), **1 món SPF ↔ 1 món CukCuk** (`WBE-Q-C3`).

**Q-C01 — Ghép 100% nhưng bỏ dở giữa chừng.**
Quán 312 món, chủ quán ghép được 180 món thì hết giờ, đóng máy. Hôm sau mở lại.
(a) Giữ nguyên tiến độ, vào lại đúng bước đang dở, còn 132 món
(b) Làm lại từ đầu
▶ **Đề xuất: (a)** — bắt buộc, nếu không thì quy tắc 100% là bất khả thi.

**Q-C02 — Ghép 100% nhưng có món quán không định bán trên Shopee.**
Trong 312 món của gian hàng có 8 món quán đã ngừng bán từ lâu, không muốn ghép.
(a) Cho phép đánh dấu **"Không bán trên ShopeeFood"** — món đó không tính vào bộ đếm chặn, và sẽ được đặt Ngừng bán trên gian hàng
(b) Vẫn bắt ghép, không có lối thoát
▶ **Đề xuất: (a)** — nếu không thì quy tắc 100% sẽ khiến chủ quán bịa món để ghép cho xong.

**Q-C03 — Máy tự ghép nhầm.**
Quán có "Trà đào" và "Trà đào cam sả". Máy tự ghép "Trà đào" (Shopee) → "Trà đào cam sả" (CukCuk) vì giống nhau nhiều chữ.
(a) Món máy tự ghép hiện nhãn **"Hệ thống gợi ý"** khác màu, chủ quán phải xem lại; có nút **Xác nhận tất cả gợi ý**
(b) Máy ghép xong coi như xong, chủ quán tự dò
▶ **Đề xuất: (a)** — ghép sai món là ghi nhận sai đơn, sai doanh thu.

**~~Q-C04 — Giá hai bên lệch nhau~~ · ~~Q-C05 — Ghi nhận đơn lấy giá bên nào~~ — ĐÃ RÚT (28/07)**
> Tôi đặt hai câu này dựa trên giả định *"quán để giá Shopee cao hơn giá tại quán"*. Chủ đầu tư chỉ ra là sai và **đúng**:
> - `[PROTO-BE] src/types.ts` chỉ có **một trường giá duy nhất** (`price`) — *"Giá bán"* và *"Giá bán trên ShopeeFood"* là **cùng một trường**, khác nhãn theo ngữ cảnh.
> - Cộng với `Q-D01` đã chốt **CukCuk là bản gốc** ⇒ đồng bộ đẩy giá CukCuk lên gian hàng ⇒ **hai bên luôn cùng một giá**.
>
> ⇒ Không có chuyện lệch giá, không có chuyện chọn giá bên nào. **Quy tắc:** một món — một giá, do CukCuk quản.

**Q-C06 — Món ăn kèm (STPV) có bắt ghép 100% không?**
Quán 312 món kéo theo ~900 lựa chọn ăn kèm (size, đá, đường, topping).
(a) Bắt 100% cả 4 bước như hiện tại
(b) Bắt 100% với nhóm thực đơn + món; ăn kèm thì cho phép để sau
▶ **Đề xuất: (b)** — 900 dòng ghép tay là rào cản thật; và ăn kèm chưa ghép chỉ ảnh hưởng chi tiết đơn, không làm hỏng đơn.

**Q-C07 — Cùng một topping, giá khác nhau tuỳ món.**
"Thêm trân châu" trong món Trà sữa là 5.000đ, trong món Sữa tươi là 7.000đ. ShopeeFood cho phép như vậy, prototype đang cho một giá duy nhất.
(a) Cho đặt giá riêng theo từng món
(b) Một giá dùng chung cho mọi món
▶ **Đề xuất: (a)** — vì gian hàng Shopee đang có thể đã cấu hình như vậy; ép một giá sẽ ghi đè sai.

**Q-C08 — Món ăn kèm bắt buộc / số lượng được chọn.**
"Chọn size" là bắt buộc, chọn đúng 1; "Chọn topping" không bắt buộc, chọn tối đa 3. Và cùng nhóm này lại có quy định khác nhau ở từng món.
(a) Cho cấu hình bắt buộc/không và số lượng tối thiểu–tối đa **theo từng món**
(b) Cấu hình chung cho cả nhóm, áp cho mọi món
▶ **Đề xuất: (a)** — Shopee lưu theo từng món.

**Q-C09 — Món khuyến mại của Shopee (Trùm Deal / Ăn Ngon Rẻ).**
Tài liệu Shopee: món thuộc *Trùm Deal* và *Ăn Ngon Rẻ* **không được sửa giá, sửa thông tin hay xoá**, chỉ được đổi trạng thái bán. Nếu đụng vào thì cả lần đồng bộ **thất bại toàn bộ**.
(a) Hiện trong danh sách kèm nhãn **"Đang chạy khuyến mại ShopeeFood — không sửa được"**, khoá các nút sửa/xoá, nhưng **vẫn bắt ghép nối** (ghép là chuyện của CukCuk, không đụng Shopee)
(b) Ẩn hẳn khỏi danh sách
(c) Cho sửa, hỏng thì báo lỗi
▶ **Đề xuất: (a)**

**Q-C10 — Món chưa thuộc nhóm nào.** *(`[DOC-RULE]` đã chỉ định)*
Popup *"Món cần thuộc một nhóm thực đơn cụ thể trước khi ghép. Bạn có muốn cập nhật món ngay không?"* — **Để sau / Chỉnh sửa**.
(a) Bấm **Chỉnh sửa** mở luôn ô chọn nhóm ngay tại chỗ, xong quay lại ghép tiếp
(b) Bấm **Chỉnh sửa** chuyển sang màn danh mục món của CukCuk, chủ quán tự tìm đường quay lại
▶ **Đề xuất: (a)**

**Q-C11 — Món trên Shopee mà CukCuk không có.**
Gian hàng Shopee có "Combo 2 người ăn", CukCuk không có món này.
(a) Nút **Sao chép sang CukCuk** tạo món mới bên CukCuk rồi ghép luôn (prototype đã có)
(b) Chủ quán tự sang danh mục CukCuk tạo tay
▶ **Đề xuất: (a)** — prototype đã làm đúng, chỉ cần chốt: món tạo tự động lấy **đơn vị tính** và **nhóm** nào làm mặc định? (prototype để *Dĩa*)

**Q-C12 — Hai món CukCuk trùng tên.**
CukCuk có 2 món cùng tên "Cà phê sữa" ở 2 nhóm khác nhau (Cà phê nóng / Cà phê đá).
(a) Danh sách chọn hiển thị kèm **mã món + tên nhóm** để phân biệt
(b) Chỉ hiện tên
▶ **Đề xuất: (a)**

**Q-C13 — Một món CukCuk bị ghép cho 2 món Shopee.**
Chủ quán lỡ chọn món "Cơm gà" của CukCuk cho cả "Cơm gà" và "Cơm gà xối mỡ" bên Shopee.
(a) Chặn, báo *"Món này đã được ghép với **Cơm gà** trên ShopeeFood"*
(b) Cho phép, hai món Shopee cùng trỏ về một món CukCuk
▶ **Đề xuất: (a)** — nếu cho phép thì báo cáo bán hàng theo món sẽ gộp sai.

---

## D. Tab *Quản lý thực đơn* (dùng hằng ngày, sau khi đã kết nối)

**Q-D01 — Sửa món xong thì ai là bản gốc?**
Chủ quán sửa tên món ở Web BE của CukCuk. Cùng lúc nhân viên khác sửa tên món đó trên app Shopee Partner.
(a) CukCuk là bản gốc — mỗi lần đồng bộ sẽ ghi đè lại thông tin lên Shopee
(b) Ai sửa sau thắng, CukCuk tải về đè lên
(c) Cảnh báo khi phát hiện hai bên lệch nhau, chủ quán chọn giữ bên nào
▶ **Đề xuất: (a)** làm nguyên tắc, **(c)** làm lớp bảo vệ. Đây là câu **gốc rễ** của cả tab này.

**Q-D02 — Sửa món có hiệu lực ngay không?**
Tài liệu Shopee cho thấy một số thay đổi thực đơn **phải chờ ShopeeFood duyệt**, và có thể **bị từ chối**. Trong lúc chờ, app khách vẫn hiển thị thông tin cũ.
(a) Món hiện nhãn **"Chờ ShopeeFood duyệt"**; bị từ chối thì hiện **"ShopeeFood không duyệt"** kèm nút *Sửa lại và gửi lại*
(b) Thêm hẳn màn *Theo dõi thay đổi thực đơn* liệt kê mọi yêu cầu đang chờ / đã duyệt / bị từ chối
(c) Cả hai
(d) Chưa làm ở phiên bản này
▶ **Đề xuất: (c)** — nếu không có, chủ quán sẽ tưởng đã sửa xong trong khi khách vẫn đặt giá cũ.

**Q-D03 — Hết món thì hết đến bao giờ?**
Quán hết thịt bò lúc 19h. ShopeeFood phân biệt rõ *hết món tạm thời* (phải có thời hạn) và *ngừng bán* (không thời hạn).
(a) Hai nút riêng: **Hết món tạm thời** (hỏi đến khi nào, mặc định hết ngày hôm nay) và **Ngừng bán** (không hạn)
(b) Một nút, tự đặt hết ngày hôm nay
(c) Một nút, luôn hỏi
▶ **Đề xuất: (a)** — hai việc này khác nhau về nghiệp vụ: hết nguyên liệu ≠ bỏ món khỏi thực đơn.

**Q-D04 — Hết món hết hạn thì có tự mở lại không?**
Đặt hết món đến 23:59. Sang hôm sau món tự bán lại dù bếp vẫn chưa có nguyên liệu.
(a) Tự mở lại, và sáng hôm sau nhắc chủ quán *"3 món đã tự mở bán lại"*
(b) Tự mở lại, không nhắc
▶ **Đề xuất: (a)**

**~~Q-D05 — POS báo hết món~~ — ĐÃ RÚT (28/07)**
> Tôi viết câu này dựa trên một chức năng **không tồn tại**. Chủ đầu tư chất vấn *"báo ở đâu?"* và **đúng**: tôi đã grep `[PROTO-POS]` — POS **không có** chức năng báo hết món. Chuỗi *"Hết món ăn"* trong `DeliveryView.tsx` / `OrderOnlineView.tsx` chỉ là **lý do từ chối / huỷ đơn**, hoàn toàn khác việc tắt bán món.
> Nơi tắt bán món là **Web BE** (cột *Trạng thái* + *Trạng thái món* trong modal Sửa món) — đã hỏi ở `Q-D03`, `Q-D04`.
> ⇒ Bỏ câu này. Nếu sau này muốn cho POS tắt bán món thì đó là **yêu cầu mới**, không phải làm rõ cái đang có.

**Q-D06 — Xoá món.**
Chủ quán chọn 5 món rồi bấm **Xoá món**.
(a) Modal xác nhận nêu rõ hậu quả: *"5 món sẽ bị xoá khỏi gian hàng ShopeeFood và khách sẽ không đặt được nữa. Lịch sử đơn cũ vẫn được giữ."* → **Xoá / Huỷ**
(b) Xoá luôn, có toast hoàn tác
▶ **Đề xuất: (a)**

**Q-D07 — Ảnh món.**
(a) Ảnh do bên nào quản? Đẩy ảnh từ CukCuk lên Shopee, hay chỉ tải ảnh Shopee về xem?
(b) Prototype có nút *Cập nhật ảnh* với 3 lựa chọn: Chọn ảnh mẫu / Tải lên tệp / Xoá ảnh — giữ cả ba?
▶ **Đề xuất:** đẩy được cả hai chiều, nhưng bỏ *Chọn ảnh mẫu* (ảnh mẫu chung không hợp với món thật của quán).

**Q-D08 — Sắp xếp thứ tự món hiển thị trên app khách.**
ShopeeFood cho xếp theo *doanh số bán* hoặc *thứ tự thủ công*.
(a) Cho chủ quán chọn kiểu sắp xếp và kéo thả thứ tự ngay tại Web BE
(b) Bỏ, để chủ quán làm bên app Shopee
▶ **Đề xuất: (a)** nếu muốn Web BE là nơi làm việc chính; **(b)** nếu muốn thu gọn phạm vi.

**Q-D09 — Nút *Xuất khẩu*.**
Xuất ra để làm gì — đối chiếu thực đơn, hay gửi kế toán?
(a) Xuất file Excel danh sách món + giá hai bên + trạng thái ghép nối
(b) Bỏ nút
▶ **Đề xuất: (a)** với đúng nội dung trên.

---

## E. Tab *Thiết lập*

**Q-E01 — Giờ mở cửa: ai là bản gốc?**
Giờ mở cửa đã có sẵn trên gian hàng Shopee. Chủ quán cũng khai giờ mở cửa trong CukCuk cho việc bán tại quán.
(a) Giờ trên Web BE là giờ **riêng cho kênh ShopeeFood**, không dính gì giờ bán tại quán
(b) Dùng chung một bộ giờ cho cả quán lẫn Shopee
▶ **Đề xuất: (a)** — quán có thể mở 6h nhưng chỉ nhận đơn Shopee từ 8h.

**Q-E02 — Giới hạn 3 khung giờ mỗi ngày.**
Prototype chặn *"Tối đa 3 khung giờ hoạt động cho mỗi ngày!"*. Tài liệu ShopeeFood **không nêu** giới hạn này.
(a) Giữ 3 — sáng/trưa/tối là đủ
(b) Bỏ giới hạn
▶ **Đề xuất: (a)**, ghi rõ trong tài liệu đây là ràng buộc của CukCuk chứ không phải của Shopee.

**Q-E03 — Nghỉ Tết 7 ngày.**
Chủ quán khai kỳ nghỉ *Tết Nguyên Đán 10/02 → 16/02*.
(a) Đến ngày là gian hàng tự đóng, hết kỳ nghỉ tự mở lại, chủ quán không phải làm gì
(b) Chỉ nhắc chủ quán, chủ quán tự bấm tạm ngưng
▶ **Đề xuất: (a)**

**Q-E04 — Kỳ nghỉ chồng lên giờ mở cửa thường.**
Ngày 10/02 vừa có khung giờ *Thứ 2: 08:00–22:00*, vừa nằm trong kỳ nghỉ Tết.
(a) Kỳ nghỉ **thắng**, ngày đó đóng cửa
(b) Cảnh báo cho chủ quán tự xử lý
▶ **Đề xuất: (a)**

**Q-E05 — Lịch bán món.**
Nhóm "Món sáng" chỉ bán 06:00–10:00.
(a) Ngoài khung giờ đó, nhóm món tự ẩn khỏi app khách rồi tự hiện lại
(b) Chỉ là ghi chú nội bộ cho quán, app khách vẫn hiện
▶ **Đề xuất: (a)**. Kèm: `[DOC-RULE]` ghi *"không cấu hình thì mặc định 24/24"* — xác nhận nghĩa là **món luôn bán, không giới hạn giờ**?

**Q-E06 — Một món nằm trong hai nhóm có lịch khác nhau.**
Món "Bánh mì" thuộc cả nhóm "Món sáng" (06–10h) và "Ăn vặt" (cả ngày).
(a) Cứ có một nhóm đang mở là món được bán
(b) Phải mọi nhóm đều mở
(c) Chặn không cho một món thuộc hai nhóm có lịch khác nhau
▶ **Đề xuất: (a)**

**Q-E07 — Tự động xác nhận đơn: áp cho đơn nào?**
Quyết định cũ `AC-02` có 2 lựa chọn (*Tất cả đơn* / *Chỉ đơn đã thanh toán*), prototype chỉ còn ô số phút.
(a) Giữ cả hai lựa chọn
(b) Chỉ *Tất cả đơn*
▶ **Đề xuất: (a)**

**Q-E08 — Tự động xác nhận sau bao nhiêu phút?**
(a) Mặc định bao nhiêu phút, cho phép chỉnh trong khoảng nào? (ShopeeFood có giới hạn thời gian phải phản hồi đơn — nếu chậm quá đơn tự huỷ)
▶ **Đề xuất:** mặc định **2 phút**, cho chỉnh 1–5 phút, và chặn không cho đặt vượt quá thời hạn Shopee cho phép. Xin xác nhận con số.

**Q-E09 — Bật tự động xác nhận trong lúc quán đang quá tải.**
Bếp đang dồn 15 đơn, máy vẫn tự nhận thêm.
(a) Có ngưỡng cảnh báo: quá N đơn chưa xong thì tạm dừng tự động xác nhận và báo chủ quán
(b) Không cần
▶ **Đề xuất: (b)** cho phiên bản này — ghi nhận (a) làm mong muốn về sau. Xin xác nhận.

---

## F. Đồng bộ thực đơn lên ShopeeFood

**Q-F01 — Cảnh báo mất dữ liệu đã đủ mạnh chưa?**
Prototype cảnh báo *"Dữ liệu không liên kết khi đồng bộ lên ShopeeFood sẽ bị mất."* Thực tế: **món có trên gian hàng mà không nằm trong lần đẩy sẽ bị xoá khỏi gian hàng**.
(a) Liệt kê đích danh **những món sắp bị xoá** trước khi cho bấm, thay vì câu cảnh báo chung
(b) Giữ nguyên câu cảnh báo chung
▶ **Đề xuất: (a)** — đây là thao tác không hoàn tác được.

**Q-F02 — Đồng bộ thất bại giữa chừng.**
Trong lần đẩy có một món đang chạy *Trùm Deal* → ShopeeFood từ chối **cả lần đồng bộ**.
(a) Kiểm tra trước khi gửi, chặn lại và chỉ đích danh món gây lỗi
(b) Cứ gửi, hỏng thì hiện lỗi thô của Shopee
▶ **Đề xuất: (a)**

**Q-F03 — Bao lâu thì biết kết quả?**
Đồng bộ toàn bộ thực đơn là việc chạy nền, không trả kết quả ngay.
(a) Hiện màn chờ có tiến độ, xong thì báo *"Đã đồng bộ {n} món thành công, {m} món lỗi"* kèm danh sách lỗi
(b) Báo *"Đã gửi yêu cầu"* rồi thôi, chủ quán tự kiểm tra
▶ **Đề xuất: (a)**

**Q-F04 — Đồng bộ lúc đang có đơn.**
Chủ quán bấm đồng bộ lúc 12h trưa, đang có 6 đơn chưa xong.
(a) Cảnh báo *"Đang có 6 đơn chưa hoàn thành. Nên đồng bộ ngoài giờ cao điểm."* → **Vẫn đồng bộ / Để sau**
(b) Không cần cảnh báo
▶ **Đề xuất: (a)**

---

## G. Tạm ngưng nhận đơn

**Q-G01 — Lý do tạm ngưng.**
ShopeeFood **bắt buộc** phải chọn lý do, chỉ có 3: *hết món* · *quá tải* · *mất điện*.
(a) Hỏi chủ quán chọn 1 trong 3
(b) Không hỏi, luôn gửi mặc định *quá tải*
▶ **Đề xuất: (a)** — nhưng nếu (b) thì xin xác nhận lấy lý do nào làm mặc định.

**Q-G02 — Tạm ngưng đến bao giờ.**
ShopeeFood **không cho tạm ngưng quá 5h sáng hôm sau** — dù khai dài hơn cũng bị cắt về mốc đó.
(a) Cho chọn: *30 phút · 1 tiếng · 2 tiếng · Đến hết hôm nay*, và nói rõ *"ShopeeFood sẽ tự mở lại gian hàng chậm nhất lúc 5:00 sáng mai."*
(b) Chỉ có bật/tắt, không thời hạn
▶ **Đề xuất: (a)**

**Q-G03 — 5h sáng gian hàng tự mở lại.**
Quán tạm ngưng vì mất điện tối qua, sáng vẫn chưa có điện, nhưng gian hàng đã tự mở.
(a) Sáng hôm sau CukCuk nhắc: *"Gian hàng ShopeeFood đã mở nhận đơn trở lại lúc 5:00."*
(b) Không nhắc
▶ **Đề xuất: (a)**

**Q-G04 — Đơn đang chạy khi tạm ngưng.**
(a) Xác nhận: tạm ngưng chỉ chặn **đơn mới**, các đơn đang làm vẫn phải hoàn tất bình thường — có ghi câu này lên modal không?
▶ **Đề xuất:** có, ghi rõ để chủ quán yên tâm bấm.

---

## H. Ngắt kết nối

**Q-H01 — Ngắt kết nối là việc của ai?**
Tài liệu Shopee: CukCuk **không tự ngắt được**. Chủ quán phải mở app Shopee Partner và tự xác nhận ở đó; CukCuk chỉ ngồi chờ và dò xem xong chưa.
(a) Web BE hiện màn hướng dẫn + mã QR mở app Shopee, kèm màn chờ *"Đang chờ bạn xác nhận trên ứng dụng Shopee Partner…"*, xong thì báo *Đã ngắt kết nối*
(b) Giữ nút bấm phát ra thông báo như prototype (**không đúng thực tế**)
▶ **Đề xuất: (a)** — đây là chỗ prototype sai nặng nhất.

**Q-H02 — Chủ quán bỏ giữa chừng.**
Bấm ngắt, mở app Shopee rồi đổi ý không xác nhận.
(a) Sau 5 phút chờ, CukCuk báo *"Chưa hoàn tất ngắt kết nối. Gian hàng vẫn đang được kết nối."* và giữ nguyên mọi thứ
(b) Coi như đã ngắt
▶ **Đề xuất: (a)**

**Q-H03 — Ngắt xong thì còn lại gì?**
(a) Thực đơn đã đẩy lên gian hàng Shopee: **giữ nguyên** trên Shopee (CukCuk không xoá)
(b) Bảng ghép nối 312 món: **giữ lại**, lần sau nối lại gian hàng cũ thì dùng lại được ngay
(c) Đơn Shopee đã ghi nhận: **giữ nguyên** trong báo cáo, không mất
Xin xác nhận cả ba, hoặc nêu chỗ khác ý.
▶ **Đề xuất:** giữ cả ba như trên.

**Q-H04 — Đang có đơn dở mà ngắt.**
(a) Chặn: *"Đang có 3 đơn ShopeeFood chưa hoàn thành. Vui lòng xử lý xong trước khi ngắt kết nối."*
(b) Cho ngắt, đơn dở tự xử lý tại quán
▶ **Đề xuất: (a)**

**~~Q-H05 — Shopee tự cắt kết nối~~ — GỘP VÀO NHÓM H (28/07)**
> Chủ đầu tư: *"ngắt thì cũng ghi rồi mà"* — đúng, `Q-H01`–`Q-H04` đã phủ luồng ngắt kết nối.
> Tôi chỉ ghi thêm **một nhánh** dùng chung màn cảnh báo đó, **không hỏi lại**: ngoài việc chủ quán chủ động ngắt, kết nối còn có thể **tự đứt** (chủ quán ngắt thẳng bên app Shopee, hoặc quyền truy cập hết hạn — tài liệu ISV ghi *"Need refresh token periodically to avoid expired authorization"*).
> **Giả định BA:** dùng lại đúng trạng thái *Chưa kết nối* + băng cảnh báo *"Kết nối với ShopeeFood đã ngừng. Đơn hàng mới sẽ không về CukCuk."* + nút **Kết nối lại**. Không thêm màn mới. Anh/chị chỉ cần bác nếu không đồng ý.

---

## I. Câu hỏi xuyên suốt

**Q-I01 — Quán nhiều chi nhánh.**
ShopeeFood cho phép áp một thay đổi thực đơn cho nhiều chi nhánh cùng lúc. Prototype đang làm cho một quán.
(a) Phiên bản này chỉ làm **một quán ↔ một gian hàng**, chuỗi để sau
(b) Làm chuỗi ngay
▶ **Đề xuất: (a)**

**Q-I02 — Ngôn ngữ.**
ShopeeFood lưu cả tên tiếng Việt và tiếng Anh cho món.
(a) Chỉ làm tiếng Việt
(b) Cho nhập cả tên tiếng Anh
▶ **Đề xuất: (a)**

**Q-I03 — Thuế.**
Ràng buộc đã ghi: giá đưa lên ShopeeFood **đã bao gồm VAT**. Prototype không nhắc gì.
(a) Ghi chú ngay cạnh ô nhập giá: *"Giá bán trên ShopeeFood đã bao gồm VAT"*
(b) Không cần
▶ **Đề xuất: (a)**

**Q-I04 — Đơn vị tiền và làm tròn.**
(a) Có trường hợp nào ra số lẻ không (chia khuyến mại, chiết khấu theo phần trăm)? Làm tròn tới đồng hay tới trăm đồng?
▶ **Đề xuất:** làm tròn tới **đồng**. Xin xác nhận.

**Q-I05 — Quán muốn xem thử trước khi bán thật.**
(a) Có cần chế độ chạy thử / môi trường kiểm thử cho chủ quán không?
(b) Không, nối là bán thật luôn
▶ **Đề xuất: (b)** cho phiên bản này (prototype có nhắc *"Trạng thái đồng bộ: Chính thức"* — nghĩa là có ngụ ý một trạng thái khác, xin làm rõ).

---

---

## Đã chốt trong phiên 28/07

| Mã | Chốt |
|---|---|
| `Q-D01` | **CukCuk là bản gốc của thực đơn.** Mọi thay đổi đi từ CukCuk; sửa bên app Shopee Partner sẽ bị ghi đè ở lần đồng bộ sau. ⇒ Kéo theo: một món chỉ có **một giá** (xem Q-C04/C05 đã rút) |

## Đã rút vì tôi đặt sai (không phải câu hỏi thật)

| Mã | Lý do |
|---|---|
| `Q-C04`, `Q-C05` | Giả định lệch giá hai kênh — sai, prototype chỉ có một trường giá và CukCuk là bản gốc |
| `Q-D05` | Giả định POS có chức năng báo hết món — sai, không tồn tại trong `[PROTO-POS]` |
| `Q-H05` | Trùng nhóm H đã có; giữ lại làm một nhánh, không hỏi lại |

## Còn treo, cần quyết sớm nhất

| Thứ tự | Mã | Vì sao gấp |
|---|---|---|
| 1 | `Q-D02` | Chờ ShopeeFood duyệt thay đổi thực đơn — luồng lớn prototype thiếu hoàn toàn |
| 2 | `Q-H01` | Ngắt kết nối phải làm bên app Shopee — prototype đang làm sai hẳn |
| 3 | `Q-F01` | Đồng bộ có thể **xoá món khỏi gian hàng**, cảnh báo hiện tại quá nhẹ |
| 4 | `Q-C02` | Bắt ghép 100% nhưng chưa có lối thoát cho món quán không định bán |
| 5 | `Q-G01`, `Q-G02` | Tạm ngưng bắt buộc có lý do + thời hạn, prototype không hỏi gì |
