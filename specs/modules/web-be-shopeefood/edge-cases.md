# Web BE — Tích hợp ShopeeFood — Tình huống biên

> Tình huống biên và lỗi **của riêng module này**. Loại toàn hệ thống nằm ở `specs/edge-cases.md`.

## EC-WBE-01: Mã quét kết nối hết hạn

- **Mức**: 🟡 Quan trọng
- **Điều kiện**: Chủ quán mở màn quét rồi đi phục vụ khách, quay lại sau khi mã đã quá thời hạn ([CONST-QR-TTL](../../registry/catalogs.md#CONST-QR-TTL)).
- **Xử lý mong muốn**: Làm mờ mã, hiện nút **Tạo mã mới**. ⛔ Không đóng màn, ⛔ không tự sinh mã mới (sinh liên tục sẽ tạo ra hàng loạt mã rác).
- **Người dùng thấy**: `MSG_WBE_CONN_EXPIRED` — *"Mã đã hết hạn"* + nút **Tạo mã mới**
- **Liên quan**: [REQ-WBE-01](requirements.md#REQ-WBE-01), [BR-WBE-02](rules.md#BR-WBE-02)

## EC-WBE-02: Rớt mạng khi đang tải thực đơn về

- **Mức**: 🟡 Quan trọng
- **Điều kiện**: Tiến trình 4 bước đang chạy dở thì mất mạng hoặc ShopeeFood không trả lời.
- **Xử lý mong muốn**: Dừng lại, báo lỗi, cho **Thử lại** — chạy tiếp **từ bước lỗi**, ⛔ không làm lại từ bước 1. **Giữ nguyên kết nối đã có**, ⛔ không bắt quét mã lại.
- **Người dùng thấy**: `MSG_WBE_LOAD_FAILED` — *"Không tải được thực đơn từ ShopeeFood. Kiểm tra kết nối mạng và thử lại."* + nút **Thử lại**
- **Liên quan**: [REQ-WBE-02](requirements.md#REQ-WBE-02)

## EC-WBE-03: Chủ quán bấm từ chối trên ứng dụng Shopee Partner

- **Mức**: 🟢 Nên có
- **Điều kiện**: Chủ quán quét mã rồi đổi ý, bấm từ chối bên ứng dụng Shopee Partner.
- **Xử lý mong muốn**: Báo kết nối thất bại, cho thử lại ngay mà không phải quay ra màn Ứng dụng.
- **Người dùng thấy**: `MSG_WBE_CONN_DENIED` — *"Kết nối không thành công. Bạn đã từ chối trên ứng dụng Shopee Partner."* + nút **Thử lại**
- **Liên quan**: [REQ-WBE-01](requirements.md#REQ-WBE-01)

## EC-WBE-04: Gian hàng đã liên kết nhà hàng CukCuk khác

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Chủ quán quét mã cho một gian hàng đang được nối với nhà hàng CukCuk khác.
- **Xử lý mong muốn**: Chặn, và **nêu đích danh tên nhà hàng** đang giữ liên kết — chỉ báo "đã liên kết" chung chung thì chủ quán không biết phải đi gỡ ở đâu.
- **Người dùng thấy**: `MSG_WBE_CONN_TAKEN` — *"Gian hàng ShopeeFood này đã liên kết với nhà hàng **{tên nhà hàng}** trên MISA CukCuk. Ngắt kết nối ở quán đó trước rồi thực hiện lại."*
- **Liên quan**: [BR-WBE-01](rules.md#BR-WBE-01), [VAL-WBE-01](data.md#VAL-WBE-01)

## EC-WBE-05: Quán đang dùng phần mềm bán hàng khác

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Gian hàng đang nối với một phần mềm bán hàng khác. CukCuk **không tự gỡ được** — bắt buộc chủ quán phải nhờ nhân viên phụ trách của ShopeeFood gỡ.
- **Xử lý mong muốn**: Chặn, hướng dẫn rõ phải liên hệ ai, và cho thử lại sau khi đã xử lý xong.
- **Người dùng thấy**: `MSG_WBE_CONN_OTHERPOS` — *"Gian hàng của bạn đang kết nối với phần mềm bán hàng khác. Vui lòng liên hệ nhân viên phụ trách của ShopeeFood để ngắt kết nối cũ, sau đó quay lại đây."* + nút **Đã xử lý xong, thử lại**
- **Liên quan**: [BR-WBE-01](rules.md#BR-WBE-01)

## EC-WBE-06: Gian hàng chưa có món nào

- **Mức**: 🟡 Quan trọng
- **Điều kiện**: Quán vừa mở gian hàng, thực đơn trên ShopeeFood còn trống. Vào màn ghép nối thì không có dòng nào để ghép.
- **Xử lý mong muốn**: *Chưa chốt* — xem `Q-WBE-01` ở `requirements.md`.
- **Người dùng thấy**: *Chưa chốt*
- **Liên quan**: [REQ-WBE-02](requirements.md#REQ-WBE-02), [REQ-WBE-03](requirements.md#REQ-WBE-03)

## EC-WBE-07: Hai món CukCuk trùng tên nhau

- **Mức**: 🟡 Quan trọng
- **Điều kiện**: CukCuk có hai món cùng tên ở hai nhóm khác nhau, ví dụ *Cà phê sữa* ở nhóm *Cà phê nóng* và *Cà phê đá*.
- **Xử lý mong muốn**: ⛔ Không tự ghép dòng nào. Danh sách chọn hiển thị dạng `[Mã] Tên` để chủ quán phân biệt được.
- **Người dùng thấy**: Cả hai dòng ở trạng thái *Chưa ghép*, hiển thị hai gạch ngang ở cột CukCuk.
- **Liên quan**: [BR-WBE-06](rules.md#BR-WBE-06), [BR-WBE-07](rules.md#BR-WBE-07)

## EC-WBE-08: Xoá món đang bán trên ShopeeFood

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Chủ quán chọn xoá một món còn ghép nối với gian hàng.
- **Xử lý mong muốn**: Chặn. Phải gỡ ghép trước rồi mới xoá được — nếu không, đơn mới có món đó sẽ không nhận được.
- **Người dùng thấy**: `MSG_WBE_MENU_DEL_LINKED` — *"Món này đang bán trên ShopeeFood. Vui lòng gỡ ghép nối trước khi xóa."*
- **Liên quan**: [BR-WBE-20](rules.md#BR-WBE-20)

## EC-WBE-09: Kỳ nghỉ lễ chồng lên giờ mở cửa thường

- **Mức**: 🟡 Quan trọng
- **Điều kiện**: Ngày 10/02 vừa nằm trong khung *Thứ 2: 08:00–22:00*, vừa nằm trong kỳ nghỉ *Tết Nguyên Đán 10/02 – 16/02*.
- **Xử lý mong muốn**: *Chưa chốt* — xem `Q-WBE-06` bên dưới.
- **Người dùng thấy**: *Chưa chốt*
- **Liên quan**: [REQ-WBE-05](requirements.md#REQ-WBE-05)

## EC-WBE-10: Đồng bộ thất bại vì món dính chương trình khuyến mại

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Trong gói đẩy lên có món thường **đang liên quan** tới chương trình *Ăn Ngon Rẻ* bị bỏ ghép, hoặc có món *Trùm Deal* bị sửa. ShopeeFood từ chối **cả lần đồng bộ**, không phải chỉ món đó.
- **Xử lý mong muốn**: Dải cảnh báo đỏ nêu **đích danh món gây lỗi** và nói rõ lý do là món đang chạy khuyến mại — chủ quán không tự đoán ra được. Kèm nút **Thử lại**.
- **Người dùng thấy**: `MSG_WBE_SYNC_FAILED` — *"Đồng bộ thất bại ở **{n}** món: **{danh sách tên món}**. Món đang chạy chương trình khuyến mại của ShopeeFood không được sửa."* + nút **Thử lại**
- **Liên quan**: [BR-WBE-16](rules.md#BR-WBE-16), [BR-WBE-19](rules.md#BR-WBE-19)

## EC-WBE-11: Đồng bộ đúng lúc quán đang đông đơn

- **Mức**: 🟢 Nên có
- **Điều kiện**: Chủ quán bấm đồng bộ lúc 12h trưa, đang có nhiều đơn chưa xong.
- **Xử lý mong muốn**: Ở **nhánh B** (đẩy lại toàn bộ) thì cảnh báo và cho chọn để sau; ở **nhánh A** thì ⛔ không cảnh báo gì vì thao tác an toàn.
- **Người dùng thấy**: `MSG_WBE_SYNC_PEAK` — *"Đang có **{n}** đơn ShopeeFood chưa hoàn thành. Nên đồng bộ toàn bộ thực đơn ngoài giờ cao điểm."* — nút **Vẫn đồng bộ** / **Để sau**
- **Liên quan**: [BR-WBE-15](rules.md#BR-WBE-15), [BR-WBE-17](rules.md#BR-WBE-17)

## EC-WBE-12: Gian hàng tự mở lại lúc 5 giờ sáng dù quán vẫn chưa sẵn sàng

- **Mức**: 🟡 Quan trọng
- **Điều kiện**: Quán tạm ngừng vì mất điện tối hôm trước; sáng vẫn chưa có điện nhưng ShopeeFood đã tự mở lại gian hàng theo [CONST-BUSY-CUTOFF](../../registry/catalogs.md#CONST-BUSY-CUTOFF).
- **Xử lý mong muốn**: Sáng hôm sau nhắc chủ quán biết gian hàng đã mở lại, để họ chủ động tạm ngừng tiếp nếu cần.
- **Người dùng thấy**: `MSG_WBE_BUSY_REOPENED` — *"Gian hàng ShopeeFood đã mở nhận đơn trở lại lúc 5:00 sáng nay."*
- **Liên quan**: [BR-WBE-22](rules.md#BR-WBE-22)

## EC-WBE-13: Chủ quán bỏ giữa chừng khi ngắt kết nối

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Bấm *Ngắt kết nối*, mở ứng dụng Shopee Partner rồi đổi ý không xác nhận; hoặc để quá thời hạn chờ.
- **Xử lý mong muốn**: Coi như **chưa ngắt**, quay về trạng thái đã kết nối, giữ nguyên mọi thứ. ⛔ Tuyệt đối không hiển thị đã ngắt khi chưa chắc chắn — nếu báo nhầm thì chủ quán tưởng đã xong, trong khi đơn vẫn chảy về.
- **Người dùng thấy**: `MSG_WBE_DISC_INCOMPLETE` — *"Bạn chưa hoàn tất ngắt kết nối trên ứng dụng ShopeeFood Partner."*
- **Liên quan**: [BR-WBE-23](rules.md#BR-WBE-23)

## EC-WBE-14: Kết nối tự đứt mà không do chủ quán bấm

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Chủ quán ngắt thẳng trên ứng dụng Shopee Partner không qua CukCuk; hoặc quyền truy cập hết hiệu lực do gia hạn thất bại. CukCuk chỉ phát hiện được khi gọi sang ShopeeFood bị từ chối.
- **Xử lý mong muốn**: Hiện chỉ báo ở mọi màn liên quan, kèm nút *Kết nối lại*. ⛔ Không được im lặng — không có chỉ báo thì nhân viên tưởng "hôm nay vắng đơn", cả ca không có đơn nào mà không ai biết.
- **Người dùng thấy**: `MSG_WBE_DISC_LOST` — *"Mất kết nối ShopeeFood. Đơn hàng mới sẽ không về CukCuk."* + nút **Kết nối lại**
- **Liên quan**: [BR-WBE-25](rules.md#BR-WBE-25)

## EC-WBE-15: Đẩy lại toàn bộ thực đơn khi còn dòng chưa ghép nối

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Chạy nhánh B của [BR-WBE-15](rules.md#BR-WBE-15) trong khi trên gian hàng còn món không có đối tượng CukCuk tương ứng.
- **Xử lý mong muốn**: Hiện cảnh báo **bắt buộc xác nhận** trước khi đẩy. Đây là thao tác **không hoàn tác được**: món bị xoá khỏi gian hàng và mất luôn số lượt đã bán tích luỹ.
- **Người dùng thấy**: `MSG_WBE_SYNC_DESTRUCTIVE` — *"Dữ liệu không liên kết khi đồng bộ lên ShopeeFood sẽ bị mất. Bạn có chắc chắn muốn tiếp tục thực hiện không?"*
- **Liên quan**: [BR-WBE-15](rules.md#BR-WBE-15), [BR-WBE-17](rules.md#BR-WBE-17), [REQ-WBE-07](requirements.md#REQ-WBE-07)

## EC-WBE-16: Bấm Tiếp tục khi còn dòng chưa ghép nối

- **Mức**: 🟡 Quan trọng
- **Điều kiện**: Chủ quán bấm **Tiếp tục** ở một trong bốn bước ghép nối trong khi còn dòng ở trạng thái *Chưa ghép*.
- **Xử lý mong muốn**: Chặn, ⛔ không cho sang bước sau, nêu rõ còn bao nhiêu dòng.
- **Người dùng thấy**: `MSG_WBE_MAP_INCOMPLETE` — *"Còn **{n}** món chưa được ghép nối. Vui lòng ghép nối toàn bộ thực đơn để tiếp tục."*
- **Liên quan**: [BR-WBE-09](rules.md#BR-WBE-09), [REQ-WBE-03](requirements.md#REQ-WBE-03)

## EC-WBE-17: Thực đơn có ký tự bị ShopeeFood cấm

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Trong tên món có ký tự nằm trong danh sách ShopeeFood không nhận. Đây là bước kiểm tra **đầu tiên** trước khi đồng bộ.
- **Xử lý mong muốn**: Chặn hẳn, ⛔ không cho đồng bộ cho tới khi sửa xong.
- **Người dùng thấy**: `MSG_WBE_SYNC_BADCHAR` — *"Thực đơn chứa ký tự không hợp lệ tại ShopeeFood. Vui lòng thay đổi"*
- **Liên quan**: [REQ-WBE-07](requirements.md#REQ-WBE-07) · ⚠️ chưa có danh sách ký tự cấm, xem `Q-REG-02` ở [`registry/catalogs.md`](../../registry/catalogs.md)

## EC-WBE-18: Ngắt kết nối khi còn đơn chưa hoàn thành

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Chủ quán bấm *Ngắt kết nối* trong khi còn đơn ShopeeFood đang xử lý dở.
- **Xử lý mong muốn**: Chặn. Ngắt lúc này thì các đơn dở mất đường cập nhật trạng thái, khách và tài xế không biết đơn đi đâu.
- **Người dùng thấy**: `MSG_WBE_DISC_BLOCKED` — *"Còn **{n}** đơn ShopeeFood chưa hoàn thành. Xử lý xong rồi mới ngắt kết nối được."*
- **Liên quan**: [BR-WBE-23](rules.md#BR-WBE-23), [REQ-WBE-09](requirements.md#REQ-WBE-09)

## EC-WBE-19: Kết nối sang một gian hàng ShopeeFood khác

- **Mức**: 🔴 Nghiêm trọng
- **Điều kiện**: Sau khi ngắt, chủ quán chọn nối với gian hàng khác chứ không phải gian hàng cũ.
- **Xử lý mong muốn**: Cảnh báo và bắt xác nhận, vì toàn bộ dữ liệu ghép nối của gian hàng cũ sẽ bị xoá. Đồng ý → sau khi nối thành công phải chạy lại màn ghép nối **từ đầu**. Không đồng ý → giữ nguyên mọi thứ.
- **Người dùng thấy**: `MSG_WBE_DISC_SWITCH` — *"Bạn có chắc chắn muốn kết nối với 1 Merchant ID gian hàng ShopeeFood khác không? Nếu kết nối mới dữ liệu gian hàng hiện tại trên CukCuk sẽ bị xóa"* — nút **Đồng ý** / **Không đồng ý**
- **Liên quan**: [BR-WBE-24](rules.md#BR-WBE-24), [REQ-WBE-09](requirements.md#REQ-WBE-09)

<!-- Điểm còn mở -->
[NEEDS-CLARIFICATION: Q-WBE-06 (low) — Ngày 10/02 vừa có khung giờ Thứ 2 08:00–22:00, vừa nằm trong kỳ nghỉ Tết. Kỳ nghỉ thắng và ngày đó đóng cửa hẳn, hay cảnh báo cho chủ quán tự xử lý? — suggested: kỳ nghỉ thắng, vì chủ quán khai kỳ nghỉ sau và cụ thể hơn]
[NEEDS-CLARIFICATION: Q-WBE-07 (high) — Sau khi ngắt kết nối, gian hàng và thực đơn trên ShopeeFood có còn nguyên không, khách có đặt được nữa không? Tài liệu ShopeeFood chỉ nói ngắt là thu hồi quyền truy cập, không nói số phận thực đơn. Nếu thực đơn vẫn còn và khách vẫn đặt được thì quán sẽ nhận đơn mà không biết. — suggested: hỏi ShopeeFood xác nhận; giả định tạm là gian hàng vẫn bán bình thường, chỉ đơn không chảy về CukCuk]
