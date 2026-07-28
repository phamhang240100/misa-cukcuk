# Web BE — Tích hợp ShopeeFood — Quyết định

> Chỉ ghi thêm, ⛔ không sửa mục cũ. Git ghi lại **cái gì** đổi; file này ghi lại **vì sao** và **ai** chốt.
> Muốn lật một quyết định thì thêm quyết định mới có dòng `Thay thế: D-WBE-NN`.

## D-WBE-01: Không có luồng chờ ShopeeFood duyệt món (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — Chủ quán sửa giá món, CukCuk báo đồng bộ thành công. Nhưng nếu ShopeeFood chưa duyệt thì app khách vẫn hiện giá cũ, và ShopeeFood còn có thể từ chối hẳn. Web BE có cần trạng thái *Chờ duyệt* / *Bị từ chối* trên từng món không?
- **Quyết định**: **Không làm.** Thay đổi thực đơn có hiệu lực ngay, không có bước chờ duyệt.
- **Chốt bởi**: chủ đầu tư
- **Vì sao**: Chủ đầu tư khẳng định hai lần là cơ chế duyệt không áp cho luồng đối tác phần mềm. Kiểm chứng lại tài liệu ShopeeFood: trường báo *đang chờ duyệt* có tồn tại và luôn được trả về, nhưng **mọi ví dụ trong tài liệu đều trả về giá trị "không chờ duyệt"** — phù hợp với lời chủ đầu tư.
- **Áp vào**: SA-04 (`../../overview.md`), toàn bộ [REQ-WBE-04](requirements.md#REQ-WBE-04), [REQ-WBE-07](requirements.md#REQ-WBE-07)

## D-WBE-02: Bỏ nút xác nhận ở màn quét mã kết nối (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — Bản dựng thử có nút *"Xác nhận đã quét mã QR kết nối"* để chủ quán tự bấm. Có giữ không?
- **Quyết định**: **Bỏ.** Hệ thống tự nhận biết và tự chuyển màn.
- **Chốt bởi**: chủ đầu tư
- **Vì sao**: ShopeeFood đã cung cấp cách để CukCuk tự hỏi lại kết quả theo chu kỳ. Bắt chủ quán bấm thêm một nút là thừa, và nhất quán với luồng ngắt kết nối vốn cũng tự dò.
- **Áp vào**: [BR-WBE-02](rules.md#BR-WBE-02), [REQ-WBE-01](requirements.md#REQ-WBE-01)

## D-WBE-03: Món khuyến mại vẫn lấy về và vẫn ghép nối (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — Tài liệu nội bộ trước đó ghi *"không lấy id món khuyến mại về"*, khiến chúng biến mất khỏi danh sách ghép nối. Đúng vậy không?
- **Quyết định**: **Đọc lại cho đúng: vẫn lấy về, vẫn ghép nối bình thường.** Điều bị cấm là **không đồng bộ tên và giá** của món thuộc chương trình *Ăn Ngon Rẻ* và *Trùm Deal* lên ShopeeFood. Vẫn được đổi trạng thái *Có bán* / *Ngừng bán*.
- **Chốt bởi**: chủ đầu tư
- **Vì sao**: Cách hiểu cũ (ẩn hẳn khỏi danh sách) **tự tạo ra** đúng vấn đề mà chính tài liệu đó phải đi vá: món khuyến mại không được ghép ⇒ đơn có món đó về POS sẽ bị gắn cờ cần xử lý, và còn có nguy cơ làm hỏng cả lần đồng bộ. Cách hiểu đúng thì không phát sinh vấn đề nào.
- **Áp vào**: [BR-WBE-04](rules.md#BR-WBE-04), [BR-WBE-16](rules.md#BR-WBE-16), [CAT-PROMO-TYPE](../../registry/catalogs.md#CAT-PROMO-TYPE)

## D-WBE-04: Bỏ hoàn toàn lịch bán món theo khung giờ (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — Bản dựng thử có phần *Lịch bán món* trong màn Quản lý thực đơn và bảng *Khung giờ hoạt động + nhóm thực đơn áp dụng* trong màn Thiết lập. Có làm không?
- **Quyết định**: **Bỏ cả hai** — vì hai cái đó là **cùng một tính năng**. Bỏ luôn cảnh báo chặn *"Bạn chưa thiết lập nhóm khung giờ"* ở nút Đồng bộ. Toàn bộ thực đơn bán theo đúng *Thời gian hoạt động* của quán.
- **Chốt bởi**: chủ đầu tư
- **Vì sao**: ShopeeFood **không có** bất kỳ chỗ nào để nhận lịch bán ở cấp món hay cấp nhóm món — giờ hoạt động chỉ tồn tại ở **cấp cả quán**. Muốn làm thì CukCuk phải tự chạy bộ hẹn giờ nội bộ, đến giờ thì bật tắt từng món, chịu giới hạn tần suất gọi. Không đáng cho lần này.
- **Ghi chú**: ⚠️ **Thời gian hoạt động của nhà hàng thì GIỮ NGUYÊN** — đó là thứ khác, xem [REQ-WBE-05](requirements.md#REQ-WBE-05).
- **Áp vào**: [REQ-WBE-05](requirements.md#REQ-WBE-05), [REQ-WBE-07](requirements.md#REQ-WBE-07), phạm vi ở `../../overview.md`

## D-WBE-05: Trạng thái món chỉ có hai giá trị (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — ShopeeFood có ba trạng thái món: đang bán, hết món (bắt buộc kèm khoảng giờ từ–đến), ngừng bán. CukCuk có làm trạng thái *hết món có thời hạn* không?
- **Quyết định**: **Không.** Chỉ hai giá trị: *Có bán* và *Ngừng bán*.
- **Chốt bởi**: chủ đầu tư
- **Vì sao**: Giữ màn sửa món đơn giản. Hệ quả tốt kèm theo: không bao giờ phải xử lý cặp giờ bắt đầu – kết thúc, cũng không phải lo món tự mở bán lại lúc quán chưa có nguyên liệu.
- **Đánh đổi**: Quán hết nguyên liệu giữa ca thì đặt *Ngừng bán*, và **phải nhớ bật lại tay** hôm sau.
- **Áp vào**: [CAT-DISH-STATUS](../../registry/catalogs.md#CAT-DISH-STATUS), [REQ-WBE-04](requirements.md#REQ-WBE-04)

## D-WBE-06: Tự ghép chỉ khi tên trùng khớp hoàn toàn (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — Bản dựng thử ghi *"hệ thống đã tự động liên kết các món dựa theo mức độ tương đồng 80%"*. Có giữ cơ chế đo độ giống nhau không?
- **Quyết định**: **Bỏ.** Chỉ tự ghép khi tên trùng khớp hoàn toàn sau khi chuẩn hoá. Không hiện phần trăm, không cho chỉnh độ chặt lỏng. Nhập nhằng thì không ghép dòng nào. Bỏ luôn nút *Liên kết nhanh* và nút *Sao chép sang CukCuk*.
- **Chốt bởi**: chủ đầu tư
- **Vì sao**: Ghép nhầm món là ghi nhận sai đơn và sai doanh thu. *Trà đào* với *Trà đào cam sả* giống nhau tới 80% nhưng là hai món khác hẳn. Thà để chủ quán ghép tay còn hơn ghép sai âm thầm.
- **Áp vào**: [BR-WBE-05](rules.md#BR-WBE-05), [BR-WBE-06](rules.md#BR-WBE-06), [BR-WBE-07](rules.md#BR-WBE-07), [BR-WBE-11](rules.md#BR-WBE-11)

## D-WBE-07: Bắt buộc ghép đủ 100% cả bốn bước (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — Quán 312 món kéo theo khoảng 900 sở thích phục vụ. Bắt ghép đủ hết là rào rất nặng. Có nới cho sở thích phục vụ được ghép sau không?
- **Quyết định**: **Bắt đủ 100% cả bốn bước**, kể cả sở thích phục vụ. Không có nút bỏ qua.
- **Chốt bởi**: chủ đầu tư
- **Vì sao**: Đây cũng là cách các nền tảng cùng ngành làm — chặn không cho đẩy thực đơn khi còn món chưa ghép, vì món chưa ghép thì đơn về sẽ hỏng.
- **Đánh đổi**: Quán nhiều món sẽ mất nhiều thời gian lúc thiết lập ban đầu — chấp nhận. Bù lại bằng [BR-WBE-10](rules.md#BR-WBE-10) giữ nguyên tiến độ khi làm dở.
- **Áp vào**: [BR-WBE-09](rules.md#BR-WBE-09), [BR-WBE-10](rules.md#BR-WBE-10)

## D-WBE-08: Giới hạn 3 khung giờ mỗi ngày là ràng buộc của CukCuk (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — Bản dựng thử chặn *"Tối đa 3 khung giờ hoạt động cho mỗi ngày"*. Đây là ràng buộc của ShopeeFood hay CukCuk tự đặt?
- **Quyết định**: **Giữ giới hạn 3**, và **ghi rõ trong tài liệu đây là ràng buộc của CukCuk**, không phải của ShopeeFood.
- **Chốt bởi**: BA đề xuất, chủ đầu tư không phản đối
- **Vì sao**: Tài liệu ShopeeFood không nêu giới hạn nào. Sáng – trưa – tối là đủ cho mọi mô hình quán thực tế. Ghi rõ xuất xứ để sau này ai muốn nới thì biết là nới được, không phải đi hỏi ShopeeFood.
- **Áp vào**: [CONST-MAX-TIMERANGE](../../registry/catalogs.md#CONST-MAX-TIMERANGE), [VAL-WBE-09](data.md#VAL-WBE-09)

## D-WBE-09: Một nút đồng bộ, hệ thống tự phân biệt hai việc (2026-07-29)

- **Câu hỏi**: Q-WBE-00 — Sửa giá là lưu nháp, phải bấm *Đồng bộ lên ShopeeFood* mới có hiệu lực. Mà nút đó đẩy lại **toàn bộ** thực đơn và **xoá** món không có trong danh sách, mất luôn số lượt đã bán. Tức là đổi giá một món cũng phải chạy một thao tác có thể xoá món. Tách làm hai nút, hay để một nút?
- **Quyết định**: **Giữ đúng một nút**, hệ thống tự nhận biết bên trong:
  - Chỉ sửa thuộc tính của đối tượng đã ghép, tập món bán không đổi ⇒ chỉ cập nhật đúng những đối tượng vừa sửa, ⛔ không cảnh báo, ⛔ không xoá gì.
  - Có thêm hoặc bớt món khỏi danh sách bán ⇒ đẩy lại toàn bộ, ✅ hiện cảnh báo mất dữ liệu.
- **Chốt bởi**: chủ đầu tư
- **Vì sao**: Chủ quán không phải học thêm gì, vẫn chỉ một nút như đang thấy. Và cảnh báo đỏ chỉ hiện đúng lúc nó có nghĩa — nếu lần nào bấm cũng hiện thì chủ quán sẽ quen tay bấm qua, đến lúc thật sự mất món thì không đọc nữa.
- **Áp vào**: [BR-WBE-15](rules.md#BR-WBE-15), [REQ-WBE-07](requirements.md#REQ-WBE-07), [EC-WBE-11](edge-cases.md#EC-WBE-11)

## D-WBE-10: Cấu hình sở thích phục vụ đặt ở cấp nhóm (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — ShopeeFood cho đặt *bắt buộc chọn* và *số lượng tối đa* riêng cho **từng món**. CukCuk có làm theo không?
- **Quyết định**: **Không.** Đặt ở **cấp nhóm**, dùng chung cho mọi món.
- **Chốt bởi**: BA đề xuất theo bản đặc tả nghiệp vụ mới nhất
- **Vì sao**: Đơn giản hoá có chủ ý. Cấu hình theo từng món làm màn thiết lập phức tạp lên nhiều lần trong khi rất ít quán cần.
- **Ghi chú**: Ghi rõ vào tài liệu để sau này ⛔ không ai tưởng đây là thiếu sót.
- **Áp vào**: `ToppingGroup` (`data.md`), [VAL-WBE-08](data.md#VAL-WBE-08)

## D-WBE-11: Một nhà hàng nối một gian hàng, không làm chuỗi (2026-07-28)

- **Câu hỏi**: Q-WBE-00 — ShopeeFood cho phép áp một thay đổi thực đơn cho nhiều chi nhánh cùng lúc. Lần này có làm chuỗi không?
- **Quyết định**: **Không.** Một nhà hàng CukCuk nối một gian hàng ShopeeFood. Chuỗi vẫn dùng được — mỗi chi nhánh nối gian hàng riêng của nó, ⛔ nhưng không có thao tác áp hàng loạt cho nhiều chi nhánh.
- **Chốt bởi**: chủ đầu tư
- **Vì sao**: Làm chuỗi ngay sẽ kéo theo bộ chọn chi nhánh trên mọi màn thực đơn và mọi thao tác sửa/xoá đều phải hỏi áp cho chi nhánh nào — ảnh hưởng toàn bộ phạm vi.
- **Áp vào**: SA-01 (`../../overview.md`), [BR-WBE-01](rules.md#BR-WBE-01)
