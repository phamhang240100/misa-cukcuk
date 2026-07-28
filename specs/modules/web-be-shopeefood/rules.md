# Web BE — Tích hợp ShopeeFood — Rule nghiệp vụ

> Mỗi rule định nghĩa **một lần duy nhất** ở đây. Mọi nơi khác (yêu cầu, tình huống biên, module khác) chỉ nhắc lại bằng mã.
> Rule xuyên suốt nhiều module nằm ở `specs/rules.md` dạng `CBR-*`.

## BR-WBE-01: Một gian hàng ShopeeFood chỉ nối một nhà hàng CukCuk

- **Rule**: Tại một thời điểm, một gian hàng ShopeeFood chỉ được liên kết với **đúng một** nhà hàng trên MISA CukCuk, và ngược lại. Muốn đổi thì phải ngắt liên kết cũ trước.
- **Trigger**: Khi chủ quán quét mã kết nối.
- **Exceptions**: Không có.
- **Example**: Chuỗi 3 chi nhánh Q1/Q3/Q7 có 3 gian hàng ShopeeFood riêng ⇒ 3 nhà hàng CukCuk riêng, mỗi cặp nối với nhau.
- **Decided in**: SA-01 (`../../overview.md`)

## BR-WBE-02: Hệ thống tự nhận biết kết nối, không có nút xác nhận

- **Rule**: Màn quét mã **không có** nút xác nhận. Chủ quán quét mã và bấm đồng ý bên ứng dụng Shopee Partner thì CukCuk tự nhận biết và tự chuyển màn. CukCuk tự hỏi lại ShopeeFood theo chu kỳ do ShopeeFood chỉ định lúc sinh mã.
- **Trigger**: Từ lúc hiện mã cho tới khi mã hết hạn ([CONST-QR-TTL](../../registry/catalogs.md#CONST-QR-TTL)).
- **Exceptions**: Không có.
- **Example**: Chủ quán quét lúc 10:00, bấm đồng ý lúc 10:02 → màn CukCuk tự chuyển sang bước tải thực đơn, không phải bấm gì thêm.
- **Decided in**: [D-WBE-02](decisions.md#D-WBE-02)

## BR-WBE-03: ShopeeFood không kiểm tra hộ việc chọn đúng quán

- **Rule**: ShopeeFood **không** đối chiếu hộ xem chủ quán có chọn đúng gian hàng cần nối hay không. Chủ quán tự đối chiếu tên quán hiển thị trên ứng dụng Shopee Partner. CukCuk ⛔ không thêm bước bắt xác nhận lại.
- **Trigger**: Khi chủ quán chọn gian hàng trên ứng dụng Shopee Partner.
- **Exceptions**: Nếu gian hàng đó đã liên kết nhà hàng CukCuk khác thì bị chặn — xem [EC-WBE-04](edge-cases.md#EC-WBE-04).
- **Example**: Chủ quán có 2 gian hàng Q1 và Q3, chọn nhầm Q3 → CukCuk vẫn nối Q3, muốn sửa phải ngắt kết nối rồi làm lại.
- **Decided in**: từ tài liệu ShopeeFood

## BR-WBE-04: Món khuyến mại vẫn lấy về và vẫn ghép nối

- **Rule**: Món thuộc [CAT-PROMO-TYPE](../../registry/catalogs.md#CAT-PROMO-TYPE) **vẫn được tải về** và **vẫn nằm trong danh sách ghép nối như mọi món khác**. Điều bị cấm là đồng bộ *tên* và *giá* của chúng lên ShopeeFood — xem [BR-WBE-16](#BR-WBE-16).
- **Trigger**: Khi tải thực đơn từ ShopeeFood về, và ở cả 4 bước ghép nối.
- **Exceptions**: Không có.
- **Example**: Món "Combo Trùm Deal 39K" đang chạy chương trình → vẫn hiện trong bước 2, chủ quán vẫn phải ghép nó với một món CukCuk.
- **Decided in**: [D-WBE-03](decisions.md#D-WBE-03)

## BR-WBE-05: Chỉ tự ghép khi tên trùng khớp hoàn toàn

- **Rule**: Hệ thống tự ghép sẵn ngay khi mở màn ghép nối. Chỉ tự ghép khi tên hai bên **trùng khớp hoàn toàn** sau khi chuẩn hoá. ⛔ Không tính điểm phần trăm, ⛔ không hiển thị mức độ giống nhau, ⛔ không cho chủ quán chỉnh độ chặt lỏng. ⛔ Không có nút chạy tự ghép, không có nút liên kết nhanh, không có nút sao chép.
- **Trigger**: Khi mở màn ghép nối, và mỗi khi có món mới.
- **Exceptions**: [BR-WBE-06](#BR-WBE-06) — trường hợp nhập nhằng thì không tự ghép.
- **Example**: "Cà phê sữa" khớp "CA PHE SUA" và "Ca-phe  sua"; ⛔ không khớp "Cà phê sữa đá".
- **Decided in**: [D-WBE-06](decisions.md#D-WBE-06)

## BR-WBE-06: Nhập nhằng thì không tự ghép dòng nào

- **Rule**: Nếu có **từ hai dòng trở lên** cùng tên trùng khớp thì ⛔ không tự ghép dòng nào, để chủ quán tự chọn.
- **Trigger**: Trong lúc hệ thống tự ghép.
- **Exceptions**: Không có.
- **Example**: CukCuk có hai món tên "Cà phê sữa" ở nhóm *Cà phê nóng* và *Cà phê đá* → cả hai để trạng thái chưa ghép, chủ quán tự chọn theo mã món.
- **Decided in**: [D-WBE-06](decisions.md#D-WBE-06)

## BR-WBE-07: Chuẩn hoá tên trước khi so sánh

- **Rule**: Trước khi so tên phải: bỏ dấu tiếng Việt · bỏ dấu câu · gộp khoảng trắng thừa về một · không phân biệt chữ hoa chữ thường.
- **Trigger**: Mỗi lần chạy tự ghép.
- **Exceptions**: Không có.
- **Example**: `"Trà Đào  Cam-Sả"` và `"tra dao cam sa"` được coi là trùng khớp.
- **Decided in**: [D-WBE-06](decisions.md#D-WBE-06)

## BR-WBE-08: Ghép nối là quan hệ một–một theo cả hai chiều

- **Rule**: Mỗi đối tượng ShopeeFood ghép với **đúng một** đối tượng CukCuk, và mỗi đối tượng CukCuk cũng chỉ thuộc **đúng một** cặp. Combo bán trên ShopeeFood phải có **một món combo tương ứng** bên CukCuk.
- **Trigger**: Khi chọn ô ghép nối trên một dòng.
- **Exceptions**: Không có.
- **Example**: ⛔ Không được lấy món "Cơm gà" của CukCuk ghép cho cả "Cơm gà" lẫn "Cơm gà xối mỡ" bên ShopeeFood — nếu cho phép thì báo cáo bán hàng theo món sẽ gộp sai.
- **Decided in**: từ mô hình dữ liệu của ShopeeFood

## BR-WBE-09: Bắt buộc ghép đủ 100% cả bốn bước

- **Rule**: Còn dòng chưa ghép thì ⛔ không cho sang bước tiếp theo. Áp cho **cả 4 loại đối tượng** trong [CAT-MAP-OBJECT](../../registry/catalogs.md#CAT-MAP-OBJECT), kể cả sở thích phục vụ.
- **Trigger**: Khi bấm *Tiếp tục* ở mỗi bước.
- **Exceptions**: Không có — ⛔ không có nút bỏ qua.
- **Example**: Quán 312 món, ghép được 180 → bấm *Tiếp tục* bị chặn, còn 132 món phải ghép nốt.
- **Decided in**: [D-WBE-07](decisions.md#D-WBE-07)

## BR-WBE-10: Giữ nguyên tiến độ ghép nối khi bỏ dở

- **Rule**: Chủ quán ghép dở rồi thoát thì hệ thống **giữ nguyên tiến độ**; lần sau vào lại đúng bước đang dở. ⛔ Không bắt làm lại từ đầu.
- **Trigger**: Khi thoát màn ghép nối giữa chừng.
- **Exceptions**: Không có.
- **Example**: Hôm nay ghép 180/312 món rồi đóng máy → mai mở lại còn đúng 132 món chưa ghép.
- **Decided in**: hệ quả bắt buộc của [BR-WBE-09](#BR-WBE-09)

## BR-WBE-11: Gỡ ghép từng dòng, không gỡ hàng loạt

- **Rule**: Nút xoá ghép nối trên một dòng chỉ gỡ **đúng dòng đó**. ⛔ Không có thao tác gỡ ghép hàng loạt.
- **Trigger**: Khi bấm nút xoá ghép nối trên một dòng.
- **Exceptions**: Ngoại lệ duy nhất: nối sang gian hàng ShopeeFood khác thì toàn bộ dữ liệu ghép nối bị xoá — xem [BR-WBE-24](#BR-WBE-24).
- **Example**: Ghép nhầm 1 món trong 312 món → chỉ gỡ đúng món đó, 311 món còn lại giữ nguyên.
- **Decided in**: [D-WBE-06](decisions.md#D-WBE-06)

## BR-WBE-12: Món phải thuộc một nhóm thực đơn mới ghép được

- **Rule**: Chọn một món CukCuk **chưa thuộc nhóm thực đơn nào** để ghép thì bị chặn, phải chọn nhóm trước.
- **Trigger**: Khi chọn món CukCuk trong ô ghép nối.
- **Exceptions**: Không có.
- **Example**: Món "Bánh mì thịt nướng" mới tạo, chưa gán nhóm → hiện `MSG_WBE_MAP_NO_GROUP`, bấm *Chỉnh sửa* mở thẳng màn sửa món để chọn nhóm.
- **Decided in**: từ tài liệu nghiệp vụ gốc

## BR-WBE-13: CukCuk là bản gốc của thực đơn

- **Rule**: Mọi thay đổi thực đơn đi **một chiều** từ CukCuk sang ShopeeFood. Sửa trực tiếp trên ứng dụng Shopee Partner sẽ bị ghi đè ở lần đồng bộ sau.
- **Trigger**: Mọi lần đồng bộ.
- **Exceptions**: Không có.
- **Example**: Nhân viên sửa giá món trên Shopee Partner lúc 9h; chủ quán đồng bộ từ CukCuk lúc 10h → giá quay về giá CukCuk.
- **Decided in**: SA-02 (`../../overview.md`)

## BR-WBE-14: Sửa giá bán ShopeeFood là lưu nháp

- **Rule**: Sửa *Giá bán ShopeeFood* trong màn sửa món chỉ **lưu nháp** trong CukCuk, chưa có hiệu lực với khách. Chỉ có hiệu lực khi bấm *Đồng bộ lên ShopeeFood*. Trong lúc đó màn thực đơn phải hiện dấu hiệu **Có thay đổi chưa đồng bộ** (`MSG_WBE_MENU_UNSYNCED`).
- **Trigger**: Khi lưu màn sửa món có thay đổi giá.
- **Exceptions**: Không có.
- **Example**: Đổi 30.000 → 32.000 rồi bấm *Lưu* → app khách vẫn hiện 30.000 cho tới khi bấm đồng bộ.
- **Decided in**: từ tài liệu nghiệp vụ gốc

## BR-WBE-15: Nút Đồng bộ tự phân biệt hai việc

- **Rule**: Chỉ có **một** nút *Đồng bộ lên ShopeeFood*. Hệ thống tự nhận biết:
  - **Nhánh A** — chỉ sửa thuộc tính của đối tượng **đã ghép** (giá, tên, mô tả, ảnh, trạng thái, thứ tự) và **tập món bán trên ShopeeFood không đổi** ⇒ chỉ cập nhật đúng những đối tượng vừa sửa. ⛔ Không hiện cảnh báo mất dữ liệu, ⛔ không xoá gì.
  - **Nhánh B** — có **thêm hoặc bớt** món khỏi danh sách bán trên ShopeeFood ⇒ đẩy lại **toàn bộ** thực đơn và **phải** hiện cảnh báo `MSG_WBE_SYNC_DESTRUCTIVE`.
- **Trigger**: Khi bấm nút *Đồng bộ lên ShopeeFood*.
- **Exceptions**: [BR-WBE-16](#BR-WBE-16) luôn được áp ở cả hai nhánh.
- **Example**: Đổi giá một cái bánh mì → nhánh A, không cảnh báo gì. Bỏ 3 món khỏi danh sách bán → nhánh B, hiện cảnh báo đỏ.
- **Decided in**: [D-WBE-09](decisions.md#D-WBE-09)

## BR-WBE-16: Không đồng bộ tên và giá món khuyến mại

- **Rule**: Món thuộc [CAT-PROMO-TYPE](../../registry/catalogs.md#CAT-PROMO-TYPE) ⛔ **không được đẩy tên và giá** lên ShopeeFood, ở **cả hai nhánh** của [BR-WBE-15](#BR-WBE-15). ✅ **Vẫn được đổi trạng thái** *Có bán* / *Ngừng bán*.
- **Trigger**: Mỗi lần đồng bộ.
- **Exceptions**: Không có.
- **Example**: Món "Combo Ăn Ngon Rẻ 25K" → bấm đồng bộ vẫn chạy bình thường nhưng tên và giá của nó không nằm trong gói gửi đi; nếu quán đặt *Ngừng bán* thì trạng thái vẫn được gửi.
- **Decided in**: [D-WBE-03](decisions.md#D-WBE-03)

## BR-WBE-17: Đẩy lại toàn bộ sẽ xoá món không có trong danh sách

- **Rule**: Ở nhánh B của [BR-WBE-15](#BR-WBE-15), món **có trên gian hàng ShopeeFood mà không có trong thực đơn CukCuk sẽ bị xoá khỏi gian hàng**, kèm mất luôn **số lượt đã bán** hiển thị cho khách. Đây là lý do bắt buộc ghép đủ trước khi đồng bộ.
- **Trigger**: Khi chạy nhánh B.
- **Exceptions**: Không có — thao tác **không hoàn tác được**.
- **Example**: Gian hàng có 315 món, thực đơn CukCuk đẩy lên 312 món → 3 món kia bị xoá cùng toàn bộ lượt bán tích luỹ.
- **Decided in**: từ tài liệu ShopeeFood

## BR-WBE-18: Chỉ đồng bộ món hợp lệ

- **Rule**: Món **Không hợp lệ** (định nghĩa ở [VAL-WBE-05](data.md#VAL-WBE-05)) ⛔ không được đồng bộ. Hệ thống hỏi chủ quán: bỏ qua chúng để đồng bộ phần còn lại, hay dừng lại để sửa.
- **Trigger**: Trước mỗi lần đồng bộ.
- **Exceptions**: Không có.
- **Example**: 312 món, 4 món chưa có nhóm thực đơn → hiện `MSG_WBE_SYNC_INVALID`; chọn *Có* thì đẩy 308 món hợp lệ, giữ đúng thứ tự đã sắp xếp.
- **Decided in**: từ tài liệu nghiệp vụ gốc

## BR-WBE-19: Kết quả đồng bộ báo bằng thông báo ngắn và cảnh báo lỗi

- **Rule**: Việc đồng bộ **chạy nền**, có thể mất một lúc và có thể thất bại. Chỉ báo kết quả bằng thông báo ngắn + dải cảnh báo lỗi. ⛔ Không làm màn lịch sử đồng bộ. Khi thất bại, cảnh báo **phải nêu đích danh món nào gây lỗi** và lý do.
- **Trigger**: Sau khi ShopeeFood xử lý xong gói thực đơn.
- **Exceptions**: Không có.
- **Example**: `MSG_WBE_SYNC_FAILED` — *"Đồng bộ thất bại ở 2 món: Combo Trùm Deal 39K, Trà đào cam sả. Món đang chạy chương trình khuyến mại của ShopeeFood không được sửa."*
- **Decided in**: từ tài liệu nghiệp vụ gốc

## BR-WBE-20: Không cho xoá món đang bán trên ShopeeFood

- **Rule**: ⛔ Không cho xoá món đang có ghép nối còn hiệu lực với ShopeeFood. Phải gỡ ghép trước.
- **Trigger**: Khi bấm *Xoá* trên màn Thực đơn.
- **Exceptions**: Không có.
- **Example**: Xoá món "Cơm gà" đang bán trên sàn → chặn, vì đơn mới có món đó sẽ không nhận được.
- **Decided in**: từ tài liệu nghiệp vụ gốc

## BR-WBE-21: Tạm ngừng nhận đơn chỉ chặn đơn mới

- **Rule**: Tạm ngừng nhận đơn chỉ chặn **đơn mới**; đơn đang xử lý dở **vẫn hoàn tất bình thường**. Câu này phải ghi rõ trên màn xác nhận để chủ quán yên tâm bấm.
- **Trigger**: Khi bấm *Tạm ngừng nhận đơn*.
- **Exceptions**: Không có.
- **Example**: Đang có 6 đơn dở, bấm tạm ngừng → 6 đơn đó vẫn nấu và giao bình thường, chỉ không có đơn thứ 7.
- **Decided in**: từ tài liệu ShopeeFood

## BR-WBE-22: ShopeeFood tự mở lại gian hàng lúc 5 giờ sáng hôm sau

- **Rule**: ShopeeFood chỉ giữ trạng thái tạm ngừng tới [CONST-BUSY-CUTOFF](../../registry/catalogs.md#CONST-BUSY-CUTOFF), bất kể chủ quán chọn mốc kết thúc xa hơn. Nếu chọn quá mốc đó thì **phải báo trước** (`MSG_WBE_BUSY_CUTOFF`). Nghỉ dài ngày **phải dùng** *Cài đặt ngày lễ*, ⛔ không dùng *Tạm ngừng nhận đơn*.
- **Trigger**: Khi chọn thời gian kết thúc vượt mốc.
- **Exceptions**: Không có.
- **Example**: Mất điện tối thứ Bảy, chọn tạm ngừng đến hết Chủ nhật → hệ thống báo trước là 5 giờ sáng Chủ nhật gian hàng sẽ tự mở lại.
- **Decided in**: từ tài liệu ShopeeFood

## BR-WBE-23: CukCuk không tự ngắt kết nối được

- **Rule**: Ngắt kết nối **bắt buộc** phải do chủ quán xác nhận trên ứng dụng Shopee Partner, y như lúc kết nối. CukCuk hiện mã cho chủ quán quét, rồi tự hỏi lại ShopeeFood mỗi [CONST-DISCONNECT-POLL](../../registry/catalogs.md#CONST-DISCONNECT-POLL) trong tối đa [CONST-DISCONNECT-WAIT](../../registry/catalogs.md#CONST-DISCONNECT-WAIT). ⛔ **Tuyệt đối không** hiển thị "đã ngắt" khi chưa chắc chắn.
- **Trigger**: Khi bấm *Ngắt kết nối*.
- **Exceptions**: Không có.
- **Example**: Bấm ngắt lúc 14:00, chủ quán không mở ứng dụng → 14:05 CukCuk báo chưa hoàn tất và giữ nguyên trạng thái đã kết nối.
- **Decided in**: từ tài liệu ShopeeFood

## BR-WBE-24: Giữ dữ liệu ghép nối khi nối lại cùng gian hàng

- **Rule**: Ngắt kết nối rồi nối lại **cùng gian hàng** thì giữ nguyên toàn bộ dữ liệu ghép nối, ⛔ không phải ghép lại từ đầu. Nếu chọn nối sang **gian hàng khác** thì phải cảnh báo là dữ liệu gian hàng hiện tại sẽ bị xoá, và sau khi nối thành công phải chạy lại màn ghép nối từ đầu.
- **Trigger**: Khi kết nối lại sau khi đã ngắt.
- **Exceptions**: Không có.
- **Example**: Quán đổi máy chủ rồi nối lại chính gian hàng cũ → 312 cặp ghép nối vẫn còn nguyên.
- **Decided in**: từ tài liệu nghiệp vụ gốc

## BR-WBE-25: Mất kết nối phải hiện chỉ báo, không được im lặng

- **Rule**: Khi quyền truy cập hết hiệu lực — do chủ quán ngắt thẳng trên ứng dụng Shopee Partner, hoặc do gia hạn thất bại — CukCuk **phải** hiện chỉ báo `MSG_WBE_DISC_LOST` kèm nút *Kết nối lại*. ⛔ Không được im lặng, ⛔ không làm màn mới.
- **Trigger**: Ngay khi phát hiện quyền truy cập không còn hiệu lực.
- **Exceptions**: Không có.
- **Example**: Không có chỉ báo thì nhân viên tưởng "hôm nay vắng đơn", cả ca không có đơn nào mà không ai biết.
- **Decided in**: từ tài liệu ShopeeFood

<!-- Điểm còn mở -->
[NEEDS-CLARIFICATION: Q-WBE-08 (medium) — Sáng ra chủ quán thấy 12 món biến mất khỏi gian hàng ShopeeFood, không biết ai làm và lúc nào. Có cần màn Nhật ký ghi lại ai · lúc nào · làm gì (đồng bộ, sửa món, gỡ ghép, ngắt kết nối, tạm ngừng) không? — suggested: có, vì một cú đồng bộ nhánh B xoá món hàng loạt và không hoàn tác được]
