# Rà chéo toàn bộ tài liệu — 2026-07-28 (vòng 2)

> ## ⚠️ ĐỌC TRƯỚC — nguồn chuẩn đã đổi
>
> **`Docs/Nghiệp vụ/Tích hợp ShopeeFood với CukCuk.xmind` (tạo 28/07 23:39) là NGUỒN CHUẨN MỚI NHẤT.** File này (`[XM-NEW]`) là bản đặc tả Web BE + POS đã viết thành lời, 207 nhánh. Nó **mới hơn** mọi file `.clarity` và mọi `specs/modules/*.md`.
>
> Phần lớn mâu thuẫn `A1`–`A11` bên dưới **đã được `[XM-NEW]` giải quyết**. Giữ file này lại vì: (1) nó ghi lại *vì sao* các file cũ mâu thuẫn, (2) phần `§0` kiểm chứng PDF vẫn đúng và còn dùng được, (3) `§F` + `§G` bên dưới liệt những chỗ `[XM-NEW]` **chưa phủ**.
>
> ### ✅ Chốt 28/07 (chủ đầu tư trả lời trực tiếp)
>
> | # | Câu | Chốt |
> |---|---|---|
> | `A1` / `Q-D02` | Duyệt món | ⛔ **KHÔNG CÓ luồng duyệt món.** Chủ đầu tư khẳng định lại lần 2; `[XM-NEW]` cũng không có. `WBE-D7` **đúng**, tôi sai.<br>📌 Ghi nhận để tra sau, không hành động: `is_pending` là `required` ở 7 endpoint nhưng **mọi sample trong PDF đều `False`** ⇒ hợp lý là trường này không kích hoạt với ISV Partner |
> | `F1` / `Q-E05` | Lịch bán món | ✅ **BỎ tab Lịch bán món** — khớp phát hiện `F1` (ShopeeFood không có API lịch cấp món). ⚠️ Xem `G1`: `[XM-NEW]` vẫn còn **2 chỗ** mô tả tính năng này |
> | `A10` / `Q-C09` | Món khuyến mại | ✅ **Không đồng bộ món và giá thuộc CheapMeal.** ⇒ Đọc lại `WBE-D5` cho đúng: **vẫn lấy về, vẫn ghép nối bình thường**, chỉ là **không đẩy tên/giá của chúng lên** khi đăng. Khớp `[API]`: *"Cannot edit price, information or delete CheapMeal dish (except change status)"*.<br>⇒ `RR-01` và `BR-UNMAP-P2` **tự tan** — không còn món nào bị bỏ ghép |
> | `Q-I01` | Nhiều chi nhánh | ✅ **1 nhà hàng CukCuk ↔ 1 gian hàng ShopeeFood.** Không dùng `is_apply_all`/`branch_ids`.<br>📌 `[XM-NEW]` dòng *"Đáp ứng kết nối nhà hàng đơn và chi nhánh"* **không mâu thuẫn**: chuỗi vẫn dùng được, nhưng **mỗi chi nhánh kết nối gian hàng riêng của nó**, không có thao tác áp hàng loạt |
> | `G1` / `Q-E05` | Lịch bán món — bỏ tới đâu | ✅ **BỎ CẢ HAI CHỖ**: phần *Lịch bán món* (Màn Quản lý thực đơn) **và** bảng *Khung giờ hoạt động + nhóm thực đơn áp dụng* (Màn Thiết lập). Hai cái là cùng một tính năng.<br>⇒ Kéo theo: **bỏ luôn** cảnh báo chặn *"Bạn chưa thiết lập nhóm khung giờ. Vui lòng thêm nhóm khung giờ"* ở nút Đồng bộ. Màn Quản lý thực đơn còn **4 phần**, không phải 5 |
> | `G2` / `Q-D03` | Hết món có thời hạn | ✅ **GIỮ 2 TRẠNG THÁI**: *Có bán* / *Ngừng bán*. Không làm *Hết món có thời hạn*.<br>⇒ Ánh xạ `[API] DishStatus`: *Có bán* → `AVAILABLE=1`; *Ngừng bán* → `INACTIVE=3`. **Không bao giờ dùng `OUT_OF_STOCK=2`** ⇒ không phải xử lý `from_time`/`to_time`. Sạch. `Q-D04` (tự mở lại) **tự tan** vì không có gì hết hạn |
> | `G3` / `A6` | Nút Đồng bộ | ✅ **GIỮ 1 NÚT, tự phân biệt bên trong.** Xem `H1` |
>
> ### 🔴 Đính chính tên nút
>
> Tên đúng là **"Đồng bộ lên ShopeeFood"** (khớp prototype + ảnh chủ đầu tư gửi). `[XM-NEW]` gọi nó là *"Đăng lên ShopeeFood"* — **sai tên**, phải sửa lại toàn bộ trong XMind. Mọi chỗ tôi viết *"Đăng lên ShopeeFood"* ở file này đều hiểu là nút này.
>
> ### H1 — Rule cho nút *Đồng bộ lên ShopeeFood* (chốt 28/07)
>
> Chủ quán chỉ thấy **một** nút, không phải học thêm gì. Hệ thống tự nhận biết:
>
> | Trường hợp | Hành vi |
> |---|---|
> | **Chỉ sửa thuộc tính** của món/nhóm/STPV **đã ghép** (giá, tên, mô tả, ảnh, trạng thái, thứ tự) — tập món bán trên Shopee **không đổi** | Gọi **API sửa lẻ** (`dish.bulk_update` · `topping.update_prices` · `dish.set_statuses`…). ⛔ **KHÔNG** hiện cảnh báo đỏ. ⛔ **KHÔNG** xoá gì |
> | **Có thêm hoặc bớt** món khỏi danh sách bán trên ShopeeFood | Chạy **đẩy toàn bộ** (`menu.sync`). ✅ Hiện cảnh báo đỏ *"Dữ liệu không liên kết khi đồng bộ lên ShopeeFood sẽ bị mất…"* |
> | Món thuộc **CheapMeal / Trùm Deal** | ⛔ **Loại khỏi payload sửa** — không đẩy tên/giá của chúng trong mọi trường hợp (`[API]`: *"Cannot edit price, information or delete CheapMeal dish"*) |
>
> ⇒ Lợi ích: đổi giá một món không còn phải đối mặt thao tác xoá món. Và chủ quán **không quen tay bấm qua cảnh báo đỏ** — cảnh báo chỉ hiện đúng lúc nó có nghĩa.


> **Vì sao có file này:** phiên 28/07 sinh ra 4 file `.clarity` trong vòng ~70 phút (21:09 → 22:18) và sửa 4 file `specs/modules/`. Đọc kỹ lại **toàn văn** thì thấy các file **mâu thuẫn với nhau** và **mâu thuẫn nội bộ**, vì quyết định sau không được lan ngược về file trước.
>
> **Thứ tự thời gian (căn cứ phân xử: file sau thắng file trước, trừ khi file trước có bằng chứng sơ cấp `[API]`):**
> | Giờ | File |
> |---|---|
> | 20:40 | `delta-2026-07-28.md` |
> | 21:09 | `webbe-triage-2026-07-28.md` |
> | 21:22 | `webbe-questions-2026-07-28.md` (56 câu) |
> | 21:30 | `webbe-prototype-map-2026-07-28.md` §E — **24 quyết định `WBE-D1…D24`** |
> | 22:18 | `pos-prototype-map-2026-07-28.md` §9b — **22 quyết định `POS-D1…D22`** |
>
> ⚠️ Hệ quả quan trọng: **bộ 56 câu hỏi được viết TRƯỚC 24 quyết định `WBE-D*` 8 phút.** Không được đem nguyên bộ 56 câu đi hỏi — khoảng 20 câu đã tự đóng.

---

## 0. Kiểm chứng trực tiếp trên PDF gốc (vòng này tự làm, không tin file tóm tắt)

> Lý do: `webbe-triage` §A-bis **tự thú nhận** đã đọc sai chính PDF này một lần (*"vòng 1 tôi đã kết luận sai rằng không có API sửa lẻ… Chủ đầu tư chỉ ra là sai"*). Nên mọi khẳng định `[API]` dưới đây được trích thẳng từ `pdftotext -layout` của `[Jan 2026] Foody External API Integration Official.pdf` (3.479 dòng), có số dòng.

### ✅ Đã kiểm chứng — đúng

| Khẳng định | Bằng chứng |
|---|---|
| `is_pending` là **`required bool`**, không phải optional | 7 chỗ: dòng `1236`, `1305`, `1392`, `1878`, `2111`, `2180`, `2216` — đều ghi `required bool is_pending` |
| `dish.get_approval_status` **có thật** | dòng `1889`–`1910`: `POST /s2s/dish/get_approval_status`, reply `{required uint32 status, required uint32 dish_id}` |
| `MenuObjectUpdateType` có `REJECT_REQUEST = 5` | dòng `534`–`539`: `ADD=1 · CHANGE_STATUS=2 · UPDATE=3 · DELETE=4 · REJECT_REQUEST=5` |
| `error_object_not_approved` | dòng `2271` |
| **API sửa lẻ có thật** | `dish.bulk_update` (`1328`), `dish.set_statuses` (`1403`), `dish.update_partner_id_mappings` (`1356`), `topping.bulk_update` (`2193`), `topping.update_prices` (`2462`) |
| **`menu.sync` huỷ diệt** — nguyên văn | dòng ~`2850`: *"If a dish is in ShopeeFood but not in Partner's menu: **will be deleted in ShopeeFood menu**"* |
| Sync fail vì món khuyến mại — nguyên văn | *"Sync task will be failed if: Include updating dish related to **Prepaid SKU** promotion (Trùm Deal) / Delete or not mapping a normal dish related to a **CheapMeal** dish (Ăn Ngon Rẻ)"* |
| `dish.set_statuses` bắt buộc `from_time`+`to_time` khi `OUT_OF_STOCK` | dòng `1414`–`1416`: *"required if set OUT_OF_STOCK"* |

### 🔴 F1 — PHÁT HIỆN MỚI, NẶNG: **"Lịch bán món" không có API nào để đẩy lên ShopeeFood**

Prototype có hẳn một phân đoạn *Lịch bán món* (khung giờ + nhóm thực đơn áp dụng), `[DOC-RULE]` có rule cho nó, `WBE-D23` đã chốt ngữ nghĩa "24/24" cho nó. Nhưng tra hết PDF:

- Toàn bộ **`3.4 Restaurant Api`** chỉ có 5 endpoint: `get_restaurant_info` · `get_operation_time_ranges` · `set_operation_time_ranges` · `set_restaurant_busy` · `get_restaurant_busy_infos` (mục lục dòng `240`–`244`). **Giờ hoạt động là cấp QUÁN, không có cấp món/nhóm.**
- Toàn bộ **`3.2 Dish Api`** (25 endpoint, mục lục dòng `183`–`207`) **không có endpoint lịch/khung giờ nào**.
- Grep `schedule` / `available_time` / `selling_time` / `serving_time` / `time_slot` trên cả 3.479 dòng → **0 kết quả**.
- Schema menu (§3.5 *Structure*, dòng `2770`–`2830`) — `categories` chỉ có `id · name · sequence · Available Status · sort_type`; `items` chỉ có `id · name · Available Status · description · sequence · price · photo`. **Không có trường giờ nào.**
- `from_time`/`to_time` duy nhất xuất hiện ở `dish.set_statuses` / `topping.set_statuses`, và **chỉ dành cho `OUT_OF_STOCK`** — đó là *hết món có thời hạn*, **không phải** lịch bán.

⇒ **ShopeeFood không có khái niệm "món này chỉ bán 06:00–10:00".** Muốn làm được thì CukCuk phải **tự chạy nội bộ**: đến giờ mở thì gọi `dish.set_statuses(AVAILABLE)`, đến giờ đóng thì gọi `dish.set_statuses(INACTIVE)` cho từng món trong nhóm — tức là một **bộ hẹn giờ chạy nền**, gọi API hàng loạt mỗi ngày, chịu rate limit 25 QPS.

**Đây là quyết định phạm vi, không phải chi tiết UI.** Phải chốt trước khi vẽ tab đó. `WBE-D23` đang chốt ngữ nghĩa cho một tính năng chưa xác định là có làm được không.

### 🟠 F2 — `menu.sync` là **PULL**, không phải PUSH

Request body của `POST /s2s/menu/sync` **chỉ có `partner_restaurant_id`** — không có payload thực đơn (dòng ~`2880`). Cơ chế thật: CukCuk **dựng sẵn endpoint** `{domain}/shopeefoodvn/getMenu?storeCode={partner_store_id}`, bấm sync là ShopeeFood **gọi ngược về** lấy toàn bộ thực đơn, rồi trả `task_id`.

⇒ Hệ quả cho `WBE-D12` (*sửa giá = lưu nháp, hiệu lực khi bấm Đồng bộ*): nếu `getMenu` phục vụ thẳng từ dữ liệu CukCuk thì **một cú `menu.sync` sẽ đẩy hết mọi bản nháp cùng lúc**, kể cả món chủ quán chưa muốn đẩy. Cơ chế "nháp" chỉ có nghĩa nếu đi bằng **API lẻ** (`dish.bulk_update`) — càng củng cố §A6.

### 🟠 F3 — `dish.get_approval_status` trả `status` nhưng **tài liệu không định nghĩa enum**

Reply là `required uint32 status`, sample `{'status': 3, 'dish_id': 16625}`. Grep `ApprovalStatus` trên toàn PDF → **0 kết quả**. Không biết `3` nghĩa là *đã duyệt*, *đang chờ*, hay *bị từ chối*. ⇒ **Câu hỏi cho ShopeeFood** (`Q-APR-01`).

### 🟢 F4 — 4 endpoint chưa file spec nào nhắc tới

| Endpoint | Dùng được vào việc gì |
|---|---|
| `dish.get_out_of_service` (`1430`) · `topping.get_out_of_service` | **Trả lời `Q-D04`** — hỏi lại ShopeeFood món nào đang hết, thay vì CukCuk tự đoán đã tự mở lại hay chưa |
| `3.6 Promotion Api` — `price_slash.set_discount` · `search_ids` · `usage.search_usage` · `item.item_usage.get_usage` (mục lục `247`–`251`) | CukCuk **đặt được khuyến mại gạch giá** lên ShopeeFood. Hoàn toàn ngoài phạm vi hiện tại — cần chốt có làm không |
| `driver.update_arriving_times` (`245`) | Liên quan `SPF-B1` (thời điểm thông tin tài xế) — có thể là mảnh còn thiếu |
| `menu.sync.get_task` (`2944`) + webhook `/s2s/menu/sync/task/callback` (`3324`) | Hai đường lấy kết quả sync — `WBE-D6` (toast + banner) cần chọn một |

---

## A. Mâu thuẫn phải xử lý trước khi viết spec

### 🔴 A1 — Luồng "chờ ShopeeFood duyệt món": ba file nói ba kiểu

| Nguồn | Nói gì |
|---|---|
| `webbe-triage` §A-bis (21:09) | **"Web BE BẮT BUỘC phải có"** trạng thái *Chờ duyệt* / *Bị từ chối*, kèm 6 bằng chứng `[API]` |
| `webbe-questions` Q-D02 (21:22) | Xếp hạng **#1 gấp nhất** trong bảng *"Còn treo, cần quyết sớm nhất"* |
| `webbe-prototype-map` `WBE-D7` (21:30) | **"KHÔNG có bước chờ ShopeeFood duyệt món — món tạo từ CukCuk lên là bán được ngay. Bỏ `dish.get_approval_status` khỏi thiết kế"** |
| `modules/02-dong-bo-menu.md` dòng 18 | Đã chép `WBE-D7` vào spec như việc đã rồi |

**Bằng chứng `[API]` chống lại `WBE-D7`** — ✅ **tôi đã tự kiểm chứng lại trên PDF gốc, xem §0**, không lấy lại từ triage:
- **7 endpoint** trả `required bool is_pending` (dòng `1236`, `1305`, `1392`, `1878`, `2111`, `2180`, `2216`)
- endpoint riêng `dish.get_approval_status` → `{required uint32 status, required uint32 dish_id}` (dòng `1889`)
- `MenuObjectUpdateType` có **`REJECT_REQUEST = 5`** (dòng `539`) — ShopeeFood **từ chối được** yêu cầu thay đổi
- lỗi **`error_object_not_approved`** (dòng `2271`)

**Đánh giá:** `is_pending` là **`required`**, không phải `optional` — nghĩa là API luôn trả trường này, tức cơ chế duyệt **tồn tại** ở phía ShopeeFood bất kể CukCuk có muốn làm hay không. `WBE-D7` không phải quyết định *"có làm tính năng này không"* mà đang là quyết định *"có nhìn vào kết quả API trả về không"*.

**Hậu quả nếu giữ `WBE-D7` nguyên trạng:** chủ quán sửa giá món → CukCuk báo *"Đã đồng bộ thành công"* → thực tế `is_pending = true`, app khách **vẫn hiển thị giá cũ** → khách đặt giá cũ → quán chịu lỗ và không hiểu vì sao. Nếu bị `REJECT_REQUEST` thì thay đổi **không bao giờ** có hiệu lực mà không ai biết.

⇒ **Phải hỏi lại.** Đây là câu số 1.

### 🔴 A2 — "24/24" nghĩa là gì: hai file ngược nhau

| Nguồn | Kết luận |
|---|---|
| `webbe-triage` Bucket A `WBE-Q-D9` (21:09) | *"Đúng về mặt API: 1 `time_range` `00:00`–`23:59` với `is_closed = false`"* → **bán suốt ngày đêm** |
| `webbe-prototype-map` `WBE-D23` (21:30) | *"Món **không đặt lịch** thì **bán theo giờ mở cửa của quán**. '24/24' nghĩa là **không giới hạn thêm ngoài giờ mở cửa**, **KHÔNG PHẢI** bán suốt ngày đêm"* |
| `modules/02` dòng 17 + dòng 148 | Đã chép `WBE-D23` |

Hai cách hiểu cho ra hành vi khác hẳn nhau: quán mở 08:00–22:00, món không đặt lịch → theo triage thì món bán 00:00–23:59 (khách đặt được lúc 2h sáng), theo `WBE-D23` thì món chỉ bán 08:00–22:00.

⇒ `WBE-D23` mới hơn và hợp nghiệp vụ hơn. **Nhưng cả hai đều đang bàn về một thứ ShopeeFood không có** — xem `F1`: không tồn tại lịch bán cấp món/nhóm trong API. Cách hiểu của triage (*"1 `time_range` `00:00–23:59`"*) là **nhầm cấp**: `time_range` thuộc `restaurant.set_operation_time_ranges`, tức **giờ mở cửa của cả quán**, không phải giờ bán của món.

⇒ Câu hỏi thật không phải *"24/24 nghĩa là gì"* mà là **"có làm lịch bán món không, và làm bằng cách nào"** (`F1`). Chốt xong `F1` thì `A2` tự tan.

### 🟠 A3 — Auto-confirm 2 lựa chọn (`AC-02`): 3 nơi nói khác nhau, 1 nơi chưa sửa

| Nguồn | Nói gì |
|---|---|
| `webbe-triage` Bucket B (21:09) | **"Giữ"** lựa chọn *Tất cả đơn* / *Chỉ đơn đã thanh toán* |
| `webbe-questions` Q-E07 (21:22) | ▶ Đề xuất **(a) giữ cả hai** |
| `webbe-prototype-map` `WBE-D11` (21:30) | **"BỎ. `AC-02` bị hủy"** — lý do: đơn SPF gần như luôn đã thanh toán qua ví |
| `modules/02` dòng 15 + `modules/03` §0.2 | Đã chép `WBE-D11` ✅ |
| **`modules/03` §5 dòng 237** | ❌ **VẪN CÒN NGUYÊN** `AC-02` bản cũ, chưa gạch, chưa ghi chú |

⇒ `WBE-D11` thắng. **Phải xoá/gạch `modules/03:237`** — hiện file 03 đang tự mâu thuẫn với §0.2 của chính nó.

### 🟠 A4 — Cơ chế tự ghép: `modules/02` tự mâu thuẫn trong cùng một mục

`WBE-D21` (21:30) chốt: **chỉ tự ghép khi tên trùng khớp tuyệt đối**, không %, không cho chỉnh — và `DEC-MAP-01` (fuzzy ~80%) **bị thay**.

Nhưng trong `modules/02-dong-bo-menu.md`:
- dòng 11 (§0) — đã ghi đúng `WBE-D21` ✅
- **dòng 52** — tiêu đề §2 vẫn là *"Cơ chế mapping (**DEC-MAP-01: auto fuzzy-match** + user xác nhận)"* ❌
- **dòng 57** — sơ đồ mermaid vẫn vẽ nhánh *"Auto fuzzy-match tên **~80%**"* ❌
- **dòng 72** — bảng 3 case vẫn ghi *"**Auto-fuzzy** gợi ý → user xác nhận"* ❌
- dòng 76–87 — `BR-MAP-01` đã viết lại đúng ✅
- **dòng 181** — edge case E2 vẫn ghi *"**Auto-fuzzy match sai cặp**"* ❌

Tương tự `webbe-prototype-map` **dòng 103** vẫn ghi *"khớp `DEC-MAP-01` (auto fuzzy-match ~80% + user xác nhận) ✅"* trong khi `WBE-D21` ở dòng 243 cùng file nói ngược lại.

⇒ Thuần dọn dẹp, không cần hỏi ai. Nhưng **phải dọn**, nếu không dev đọc §2 sẽ dựng fuzzy match.

### 🟠 A5 — "Đơn không bao giờ chứa món chưa ghép" — kết luận sai của triage

`webbe-triage` Bucket C (21:09) suy ra từ `WBE-Q-C1`:
> *"⇒ Kéo theo: nửa Web BE của `DR-Q1` **tự đóng** — **đơn không bao giờ chứa món chưa ghép**, vì không cho bán khi chưa ghép xong"*

`webbe-prototype-map` `WBE-D3` + `BR-UNMAP-P1…P5` (21:30) liệt kê **5 nguồn** vẫn làm phát sinh món chưa ghép **sau khi** đã ghép 100%:
`P1` món tạo thẳng trên Partner App · `P2` món Trùm Deal/Ăn Ngon Rẻ do SPF tự setup (**nguồn thường xuyên nhất**) · `P3` món bị xoá ở CukCuk sau khi sync · `P4` đơn về đúng lúc đang đồng bộ · `P5` vừa huỷ liên kết hàng loạt chưa sync lại

⇒ **Kết luận của triage sai.** Bắt ghép 100% chỉ chặn được ở *thời điểm thiết lập*, không chặn được *trôi dạt về sau*. `BR-UNMAP-01…05` là đúng và **bắt buộc phải có**.

### 🟠 A6 — Sửa giá lưu nháp rồi "Đồng bộ" — đồng bộ bằng đường nào?

| Nguồn | Nói gì |
|---|---|
| `webbe-triage` §A-bis | **Hai con đường tách bạch**: `menu.sync` = đẩy **toàn bộ** thực đơn, đây mới là cái **huỷ diệt**. Thao tác **hằng ngày** đi bằng **API lẻ** (`dish.update`, `dish.bulk_update`, `topping.update_prices`…), **không huỷ diệt gì** |
| `WBE-D12` | *"Sửa giá bán ShopeeFood = **lưu nháp**. Chỉ có hiệu lực khi chủ quán bấm **Đồng bộ lên ShopeeFood**"* |
| `WBE-D2` / prototype §D4 | Nút *Đồng bộ lên ShopeeFood* gắn với cảnh báo ***"Dữ liệu không liên kết khi đồng bộ sẽ bị mất"*** |

> ⚠️ **Đây là SUY LUẬN của tôi, không phải mâu thuẫn có sẵn trong tài liệu** (khác `A1`–`A5`): tôi suy ra nút *Đồng bộ lên ShopeeFood* của prototype **chính là** `menu.sync` — căn cứ duy nhất là câu cảnh báo "dữ liệu không liên kết sẽ bị mất" trùng khớp với hành vi huỷ diệt đã kiểm chứng của `menu.sync`. Prototype không ghi nó gọi API nào. Nếu suy luận này sai thì `A6` không thành vấn đề.

⇒ Nếu suy luận đúng, ghép `WBE-D12` với nút hiện có nghĩa là: **mỗi lần chủ quán đổi giá một món, hệ thống chạy một lần full-sync huỷ diệt.** Cộng thêm `F2` (`menu.sync` là pull) thì còn tệ hơn: nó đẩy **mọi bản nháp cùng lúc**, không lọc được món nào.

**Phải tách làm hai nút, không nơi nào đang ghi việc này:**
- *Cập nhật lên ShopeeFood* (thao tác hằng ngày) → `dish.bulk_update` / `topping.update_prices` — **an toàn**, chỉ đụng món đã sửa
- *Đẩy lại toàn bộ thực đơn* (lần đầu / khôi phục) → `menu.sync` — **huỷ diệt**, giữ nguyên cảnh báo đỏ

### 🟠 A7 — Lý do tạm ngưng: "không bắt buộc" nhưng API bắt buộc

`BR-BUSY-04` (có trong cả `webbe-prototype-map` §E3 lẫn `modules/02` dòng 162) tự ghi nhận mâu thuẫn mà **chưa giải**:
> *"**Lý do (không bắt buộc)** — dropdown Chọn lý do: hết món · quá tải · mất điện. ⚠️ ShopeeFood **bắt buộc** phải có lý do ⇒ để trống thì CukCuk tự gán mặc định (**đề xuất: quán quá tải**) — **cần BA xác nhận**"*

`[API] set_restaurant_busy` yêu cầu `busy_reason_type` (`1` hết món · `2` quá tải · `3` mất điện) là trường bắt buộc. `webbe-questions` Q-G01 hỏi lại đúng câu này.

⇒ **Vẫn treo.** Phải chốt: bắt chọn, hay để trống rồi tự gán *quá tải*.

### 🟢 A8 — `webbe-triage` đã lỗi thời ở 3 chỗ

| Mục trong triage | Thực tế |
|---|---|
| Bucket C-2 vẫn liệt `WBE-Q-A1` (*Mã cấu hình Endpoint/Webhook*) là **"còn phải hỏi"** | `WBE-D24` (21:30) đã **ẩn hẳn** trường này khỏi panel → đóng |
| Bucket D vẫn gửi `WBE-Q-A2` (*danh sách scope*) cho SPF | `WBE-D24` cũng ẩn luôn trường Scopes → không còn chặn UI (vẫn có thể hỏi SPF nhưng không chặn) |
| Bucket B đề xuất giữ các thẻ tab *Tổng quan* (doanh thu, AOV, top món) | Bucket C **cùng file** đã chốt **bỏ hẳn tab Tổng quan**; `WBE-D1` xác nhận lại |

### 🟢 A9 — `webbe-prototype-map` tuyên bố hoàn thành sai sự thật

Dòng 284: *"✅ **Web BE chốt xong ngày 2026-07-28.** Chỉ còn 1 câu phải hỏi ShopeeFood: `Q-DISC-01` và 1 rủi ro `RR-01`."*

Không đúng. Bộ 56 câu ở `webbe-questions` (viết trước đó 8 phút) chỉ được `WBE-D1…D24` đóng khoảng 20 câu. **~35 câu vẫn chưa ai trả lời** — xem §B.

### 🔴 A10 — Món khuyến mại: ẩn đi hay hiện ra? (mới phát hiện ở vòng này)

| Nguồn | Nói gì |
|---|---|
| `WBE-D5` (21:30) + `modules/02` `BR-MAP-02` | *"**Không lấy id** của các món khuyến mại khi lấy thực đơn về ⇒ **không xuất hiện** trong danh sách ghép nối"* |
| `webbe-questions` `Q-C09` (21:22) ▶ Đề xuất | *"**Hiện** trong danh sách kèm nhãn *Đang chạy khuyến mại — không sửa được*, khoá nút sửa/xoá, nhưng **vẫn bắt ghép nối**"* |
| `RR-01` (cùng file với `WBE-D5`) | Tự cảnh báo: *"Bỏ qua **món khuyến mại** thì đúng, nhưng **món thường đang dính chương trình** thì **vẫn phải ghép và phải khoá sửa**"* |
| `BR-UNMAP-P2` | Gọi món Trùm Deal/Ăn Ngon Rẻ là **"nguồn phát sinh món chưa ghép thường xuyên nhất"** — hệ quả trực tiếp của `WBE-D5` |

`[API]` đã kiểm chứng (§0): sync **fail toàn bộ** nếu *"Delete or **not mapping** a normal dish related to a CheapMeal dish"*.

⇒ `WBE-D5` (ẩn đi) **tự tạo ra** đúng cái lỗi mà `RR-01` và `BR-UNMAP-P2` phải đi vá. Ẩn món khuyến mại ⇒ không ghép ⇒ mọi đơn deal gắn cờ *Cần xử lý*, và có nguy cơ làm **fail cả lần đồng bộ**. Đề xuất `Q-C09(a)` (hiện + khoá sửa + vẫn bắt ghép) **an toàn hơn hẳn**.

⇒ **Phải hỏi lại `WBE-D5`.**

### 🟠 A11 — Món có trên Shopee mà CukCuk không có: tạo tự động hay không?

| Nguồn | Nói gì |
|---|---|
| `modules/02` `M5` (`[Q&A C.3]`) | *"Món chỉ có ở SPF, chưa có ở CukCuk → **KHÔNG tự tạo** ở CukCuk (user tự tạo ở thực đơn chính rồi map)"* |
| `modules/02` bảng 3 case, `C-C` | *"**Không auto tạo** (M5); user tạo ở thực đơn chính CukCuk rồi map"* |
| Prototype `[PROTO-BE]` §C | Có sẵn nút **Sao chép sang CukCuk** → *"Đã sao chép "{tên}" sang MISA CukCuk"*, và nút **Thêm mới trực tiếp trên MISA CukCuk** → *"Dữ liệu khởi tạo sẽ được đồng bộ trực tiếp lên hệ thống quản lý và **liên kết ngay lập tức**"* |
| `webbe-questions` `Q-C11` ▶ Đề xuất | **(a)** dùng nút *Sao chép sang CukCuk* — tức **ngược `M5`** |

⇒ `M5` là quy tắc cũ lấy từ `[Q&A C.3]`; prototype mới đã làm ngược lại và tiện hơn nhiều. **Phải chốt bỏ `M5` hay bỏ nút.** Nếu giữ nút thì còn phải chốt: món tạo tự động lấy **đơn vị tính** và **nhóm thực đơn** nào làm mặc định (prototype để *Dĩa*).

---

## B. Mâu thuẫn phía POS

### 🟠 B1 — `pos-prototype-map` §10 đã lỗi thời ngay khi viết

§10 *"Xung đột POS còn mở sau phiên 28/07"* liệt 12 mục, nhưng **8 mục đã bị chính §9b ở ngay phía trên đóng**:

| Mục §10 ghi "còn mở" | Thực tế đã đóng bởi |
|---|---|
| `XD-05` (Giao hàng → mở màn tính tiền?) | `POS-D3` |
| `XD-13` (màn tính tiền có bắt chọn phương thức?) | `POS-D3` + `POS-D5` |
| `XD-15` (lý do từ chối/hủy không khớp mã SPF) | `POS-D4` |
| `XD-16` (còn *In tạm tính*) | `POS-D8` |
| `XD-17` (từ vựng trạng thái lẫn lộn) | `POS-D9` |
| `XD-06` (auto-confirm nhảy thẳng *Chờ giao hàng*) | `POS-D6` |
| `XD-08` (khoá nút Hủy sau `PICKED`) | `POS-D11` |
| `XD-11` (`mark_as_received` — ai đánh dấu, lúc nào) | `POS-D21` |
| Khối *Đối tác giao hàng* | `POS-D10` |

**Còn mở thật:** `XD-12` + `XD-14` (khối tiền — **chặn bởi `Q-PAY-B` phía ShopeeFood**) và `DR-Q2` (đã đóng bởi `POS-D20`, §10 xếp 🟢 là đúng nhưng vẫn nên gỡ).

### 🟠 B2 — `modules/03` §10 checklist vẫn theo thiết kế đã hủy

Dòng 295: *"🔴 Tách kênh + **5 tab riêng** cho ShopeeFood — `DEC-CHANNEL-01`"*
Nhưng §0.2 của chính file đó đã ghi `DEC-CHANNEL-01` **HỦY**, thay bằng **4 tab** (`POS-D2`).

Dòng 305: *"🟢 Đổi nhãn nút SPF **'GIAO HÀNG' → 'Bàn giao tài xế'**"*
Nhưng `[DOC-MAP]` + `[DOC-RULE]` + toàn bộ `POS-D*` đều dùng nhãn **"Giao hàng"**. Đây là chỉ đạo **ngược chiều** với bộ từ vựng đã chốt ở §0.1.

Dòng 306: *"🟢 Thống nhất tên trạng thái: dùng **'Đang xử lý'**"*
Nhưng §0.1 đã **bỏ hẳn** từ *"Đang xử lý"*, thay bằng *Chờ chuẩn bị đơn*.

Dòng 179 (§4 bảng thao tác) vẫn dùng nút *"Bàn giao tài xế"* / *"Đã làm xong"* thay vì *Giao hàng* / *Thu tiền*.

Dòng 139–147 (sơ đồ stateDiagram §3) vẫn dùng `ChuaXacNhan → DangXuLy → DaXuLy → HoanThanh` — từ vựng cũ đã bị bỏ.

⇒ `modules/03` đang có **§0 đúng, phần thân sai**. Ai đọc từ trên xuống thì gặp đúng trước; ai tra §4/§10 thì gặp sai.

### 🟢 B3 — Đánh số rủi ro POS bị hổng

`RR-04` được viện dẫn ở `POS-D12` (*"⚠️ Kéo theo `RR-04`"*) và ở `Lỗi 1` (*"BA chốt giữ → xem `RR-04`"*) nhưng **không có `RR-04` trong bảng ⚠️ Rủi ro tồn đọng** (bảng chỉ có `RR-02`, `RR-03`).
`RR-05` được mô tả đầy đủ trong `POS-D17` và trong `modules/04` §0-BIS nhưng cũng **không có trong bảng**.
`RR-01` nằm ở file Web BE, không ở file POS.

⇒ Phải gom `RR-01…RR-05` về **một bảng duy nhất**, và viết bổ sung `RR-04` (nội dung suy ra được: *bấm Thu tiền ở Chờ chuẩn bị đơn = báo ShopeeFood đơn đã xong khi bếp chưa nấu → tài xế tới sớm, đứng chờ*).

---

## C. Đối chiếu từng câu trong bộ 56 — có kiểm tra được

> Mục đích: `§A9` đã bác bỏ tuyên bố *"Web BE chốt xong"*, nhưng nếu tôi thay bằng một con số ước lượng thì cũng không kiểm tra được. Bảng này liệt **đủ 56 mã**, mỗi mã ghi rõ ai đóng nó. Anh dò được ngay nếu tôi hỏi lại câu đã có đáp án.

**Tổng kết: 56 = 10 đã đóng + 1 đóng một phần + 6 tự chốt bằng `[API]` + 3 mâu thuẫn + 36 còn mở.**

| Mã | Nội dung ngắn | Tình trạng |
|---|---|---|
| `Q-A01` | Ai được kết nối / ngắt (phân quyền) | 🔵 **MỞ** — không `WBE-D*` nào chạm tới |
| `Q-A02` | Nhật ký thao tác | 🔵 **MỞ** |
| `Q-A03` | Nút *In cấu hình* | 🔵 **MỞ** — `WBE-D24` chỉ ẩn 2 **trường** trong panel, không nói gì về nút |
| `Q-A04` | Nút *Gửi phản hồi cho MISA* | 🔵 **MỞ** |
| `Q-B01` | Trả lời sai modal *"đã có gian hàng chưa"* | 🔵 **MỞ** |
| `Q-B02` | Quán đang dùng Ocha | 🟢 **TỰ CHỐT** — `[API-Auth §3]` nêu rõ phải liên hệ BI Shopee gỡ trước |
| `Q-B03` | Quét đúng nhưng **chọn nhầm gian hàng của chính mình** | 🔵 **MỞ** — `WBE-D15` chỉ xử lý ca *gian hàng đã liên kết quán khác*, khác ca này |
| `Q-B04` | Mã QR hết hạn | ✅ **ĐÓNG** — `WBE-D14` |
| `Q-B05` | Nhắc sau 2 phút chờ | 🔵 **MỞ** (nhỏ) |
| `Q-B06` | Rớt mạng khi tải dữ liệu ban đầu | ✅ **ĐÓNG** — `WBE-D20` |
| `Q-B07` | Gian hàng ShopeeFood chưa có món nào | 🔵 **MỞ** |
| `Q-C01` | Ghép dở giữa chừng, có lưu tiến độ không | 🔵 **MỞ** |
| `Q-C02` | Món quán **không định bán** trên Shopee | 🔵 **MỞ** 🔴 — `WBE-D2` bắt 100% nhưng **không cho lối thoát** |
| `Q-C03` | Máy tự ghép nhầm — có nhãn *"Hệ thống gợi ý"* không | 🔵 **MỞ (phần còn lại)** — `WBE-D21` bỏ %, `BR-MAP-01.4` xử lý ca trùng ≥2 tên; **chưa** trả lời chuyện gắn nhãn |
| `Q-C06` | STPV có bắt ghép 100% không | 🔵 **MỞ** 🔴 — ~900 dòng ghép tay |
| `Q-C07` | Giá topping khác nhau tuỳ món | 🟢 **TỰ CHỐT** — `topping.update_prices` nhận cặp `partner_topping_id`+`partner_dish_id` (dòng `2462`) |
| `Q-C08` | Bắt buộc / min-max theo từng món | 🟢 **TỰ CHỐT** — `topping.set_group_quantity` theo `partner_dish_id`; `dish.create_topping_mapping` có `is_required` riêng |
| `Q-C09` | Món Trùm Deal / Ăn Ngon Rẻ hiển thị thế nào | ⚠️ **MÂU THUẪN** — xem `A10` |
| `Q-C10` | Món chưa thuộc nhóm nào | ✅ **ĐÓNG** — `WBE-D16` |
| `Q-C11` | Món SPF mà CukCuk không có | ⚠️ **MÂU THUẪN** — xem `A11` |
| `Q-C12` | Hai món CukCuk trùng tên | 🔵 **MỞ** (nhỏ) |
| `Q-C13` | Một món CukCuk ghép cho 2 món SPF | 🔵 **MỞ** 🔴 — `WBE-D19` chốt 1-1 theo chiều SPF→CukCuk; **chiều ngược API vẫn cho phép** |
| `Q-D01` | Ai là bản gốc của thực đơn | ✅ **ĐÓNG** — chốt *CukCuk là bản gốc* |
| `Q-D02` | **Duyệt món** | ⚠️ **MÂU THUẪN** — `A1`, ưu tiên số 1 |
| `Q-D03` | Hết món đến bao giờ / tách *Ngừng bán* | 🔵 **MỞ** 🔴 — API **bắt buộc** `from_time`+`to_time` (dòng `1414`) |
| `Q-D04` | Hết món hết hạn có tự mở lại | 🔵 **MỞ** — có `dish.get_out_of_service` hỗ trợ (`F4`) |
| `Q-D06` | Xoá món | 🔵 **MỞ** |
| `Q-D07` | Ảnh món | 🔵 **MỞ** (kỹ thuật đã khả thi: `dish.upload_picture`) |
| `Q-D08` | Sắp xếp thứ tự hiển thị | 🔵 **MỞ** (kỹ thuật khả thi: `sequence` + `sort_type`) |
| `Q-D09` | Nút *Xuất khẩu* | 🔵 **MỞ** |
| `Q-E01` | Giờ mở cửa: riêng kênh Shopee hay dùng chung | 🔵 **MỞ** 🔴 — `set_operation_time_ranges` **ghi đè giờ của gian hàng**, chọn sai là đổi giờ bán thật |
| `Q-E02` | Giới hạn 3 khung giờ/ngày | 🟢 **TỰ CHỐT** — `[API]` không nêu giới hạn ⇒ là ràng buộc CukCuk tự đặt |
| `Q-E03` | Nghỉ Tết 7 ngày | ✅ **ĐÓNG** — `WBE-D8`; cách làm: `custom_date` + `is_closed=true` (dòng `2619`–`2621`) |
| `Q-E04` | Kỳ nghỉ chồng lên giờ mở cửa thường | 🔵 **MỞ** |
| `Q-E05` | Lịch bán món | 🔵 **MỞ** 🔴 — **chưa chắc làm được**, xem `F1` |
| `Q-E06` | Món thuộc 2 nhóm có lịch khác nhau | ⏸️ **treo theo `F1`** |
| `Q-E07` | Auto-confirm áp cho đơn nào | ✅ **ĐÓNG** — `WBE-D11` bỏ 2 lựa chọn |
| `Q-E08` | Auto-confirm sau bao nhiêu phút | 🔵 **MỞ** — cần biết hạn phản hồi của SPF (hỏi SPF) |
| `Q-E09` | Ngưỡng quá tải khi bật auto-confirm | 🔵 **MỞ** (nhỏ) |
| `Q-F01` | Liệt kê đích danh món **sắp bị xoá** | 🔵 **MỞ** 🔴 — thao tác không hoàn tác được |
| `Q-F02` | Chặn trước món Trùm Deal gây fail | 🟢 **TỰ CHỐT** — điều kiện fail đã ghi nguyên văn trong `[API §3.5]` |
| `Q-F03` | Bao lâu biết kết quả đồng bộ | 🟢 **TỰ CHỐT** — `menu.sync.get_task` **hoặc** webhook `/s2s/menu/sync/task/callback`; chọn 1 (`F4`) |
| `Q-F04` | Đồng bộ lúc giờ cao điểm | 🔵 **MỞ** (nhỏ) |
| `Q-G01` | Lý do tạm ngưng | 🔵 **MỞ** 🔴 — xem `A7` |
| `Q-G02` | Tạm ngưng đến bao giờ | ✅ **ĐÓNG** — `BR-BUSY-01/02/05` |
| `Q-G03` | 5h sáng tự mở lại — có nhắc không | 🔵 **MỞ** (nhỏ) |
| `Q-G04` | Câu trấn an *"chỉ chặn đơn mới"* trên modal | 🔵 **MỞ** (nhỏ) |
| `Q-H01` | Ngắt kết nối là việc của ai | ✅ **ĐÓNG** — `BR-DISC-01/02` |
| `Q-H02` | Bỏ giữa chừng khi ngắt | ✅ **ĐÓNG** — `BR-DISC-03` |
| `Q-H03` | Ngắt xong còn lại gì | 🟡 **ĐÓNG MỘT PHẦN** — `BR-DISC-05` giữ ghép nối ✅; *thực đơn trên gian hàng còn không* vẫn là **giả định** `BR-DISC-06` ⇒ chờ `Q-DISC-01` |
| `Q-H04` | Đang có đơn dở mà ngắt | ✅ **ĐÓNG** — `WBE-D13` / `BR-DISC-07` |
| `Q-I01` | Chuỗi nhiều chi nhánh | 🔵 **MỞ** 🔴 — API hỗ trợ sẵn `is_apply_all`/`branch_ids` |
| `Q-I02` | Ngôn ngữ (có nhập tên tiếng Anh không) | 🔵 **MỞ** (nhỏ — API có `name_en`) |
| `Q-I03` | Ghi chú *"giá đã gồm VAT"* cạnh ô nhập giá | 🔵 **MỞ** (nhỏ) |
| `Q-I04` | Đơn vị tiền & làm tròn | 🔵 **MỞ** (nhỏ) |
| `Q-I05` | Chế độ chạy thử | 🔵 **MỞ** (nhỏ) |

### C-bis — Câu chuyển thẳng ShopeeFood (không chặn XMind)

`Q-PAY-A`…`Q-PAY-G` (7 câu, `modules/04` §7) · `Q-DISC-01` (ngắt rồi thực đơn còn không) · **`Q-APR-01` mới** (enum `status` của `dish.get_approval_status`, xem `F3`) · `WBE-Q-A2` (danh sách scope) · `WBE-Q-D3` (rate limit thực tế) · `SPF-B1` (thời điểm thông tin tài xế) · `SPF-B2` (`pick_time`) · `RR-03` (xin bổ sung mã lý do *"khách gọi báo hủy"*)

---

## D. Việc dọn dẹp bắt buộc (không cần hỏi ai)

| # | File | Sửa gì |
|---|---|---|
| D1 | `modules/03` dòng 237 | Gạch `AC-02`, ghi *"BỎ theo `WBE-D11`"* |
| D2 | `modules/02` dòng 52, 57, 72, 181 | Bỏ mọi dấu vết *fuzzy-match ~80%*; §2 phải trỏ về `BR-MAP-01` |
| D3 | `webbe-prototype-map` dòng 103 | Bỏ *"khớp `DEC-MAP-01` (auto fuzzy ~80%) ✅"* |
| D4 | `webbe-prototype-map` dòng 284 | Bỏ tuyên bố *"Web BE chốt xong"* |
| D5 | `webbe-triage` Bucket B, C-2, D | Gỡ `WBE-Q-A1`, `WBE-Q-A2`, `WBE-Q-D11`, các thẻ tab Tổng quan |
| D6 | `pos-prototype-map` §10 | Gỡ 9 mục đã đóng, chỉ giữ `XD-12`/`XD-14` |
| D7 | `pos-prototype-map` bảng rủi ro | Bổ sung `RR-04`, `RR-05`; gom `RR-01…05` về một bảng |
| D8 | `modules/03` dòng 139–147, 179, 295, 305, 306 | Thay toàn bộ từ vựng cũ (*Đang xử lý / Đã xử lý / Bàn giao tài xế / 5 tab*) bằng bộ đã chốt ở §0.1 + `POS-D2` |
| D9 | `customer-journey.md` dòng 74 | Bỏ khẳng định seller tax có trong `order.get_details` (`modules/04` §8 đã ghi việc này, chưa làm) |

---

## G. `[XM-NEW]` chưa phủ những gì (đối chiếu 207 nhánh với bộ 56 câu)

> Đây là phần **còn giá trị nhất** của file này sau khi `[XM-NEW]` xuất hiện.

### G0 — `[XM-NEW]` đã âm thầm đóng nhiều câu (tốt, ghi lại để khỏi hỏi lại)

| Câu | `[XM-NEW]` giải quyết thế nào |
|---|---|
| `Q-A03`,`Q-A04` | Thẻ ShopeeFood chỉ còn **nút Chi tiết** ⇒ *In cấu hình* và *Gửi phản hồi* **đã bị bỏ** |
| `Q-B01` | **Không còn modal** *"Bạn đã có gian hàng chưa?"* ⇒ bỏ luôn câu hỏi |
| `Q-B02` | Có rule Ocha (dòng 23) |
| `Q-B03` | Chốt: *"ShopeeFood không kiểm tra hộ, chủ quán tự đối chiếu tên quán"* ⇒ **không** thêm bước bắt xác nhận |
| `Q-C03` | *"kèm dấu hiệu cho biết dòng này do hệ thống tự ghép"* |
| `Q-C06` | Bắt ghép **100% cả 4 bước**, kể cả STPV |
| `Q-C11` | *"không có nút Sao chép"* ⇒ `M5` giữ nguyên, `A11` đóng |
| `Q-C12` | Cột CukCuk hiển thị dạng **`[Mã] Tên`** |
| `Q-C13` | *"Mỗi dòng chỉ được ghép với đúng một dòng bên kia"* |
| `Q-D06` | *"Không cho xóa món đang bán trên ShopeeFood nếu chưa gỡ ghép"* |
| `Q-D09` | Không còn nút *Xuất khẩu* ⇒ bỏ |
| `Q-E01` | Thời gian hoạt động nằm trong màn Thiết lập **của ShopeeFood** ⇒ giờ riêng cho kênh |
| `Q-G01` | *"Lý do không bắt buộc… để trống thì hệ thống tự chọn mặc định là quán quá tải"* ⇒ đóng `A7` |
| `XD-14` | *"Chiết khấu đối tác giao hàng lấy theo mức ShopeeFood đang áp cho cửa hàng và cho phép quản lý sửa. Không ghi cứng 20%"* |

### G1 — 🔴 `[XM-NEW]` tự mâu thuẫn: "Bỏ tab Lịch bán món" nhưng còn 2 chỗ

Chủ đầu tư chốt **bỏ**, nhưng `[XM-NEW]` vẫn còn mô tả tính năng này ở **hai nơi khác tên nhau**:
- **Màn Quản lý thực đơn**, phần thứ 5: *"Lịch bán món: món nào không đặt lịch thì bán theo giờ mở cửa của quán"*
- **Màn Thiết lập**: *"Khung giờ hoạt động và nhóm thực đơn áp dụng"* — bảng `Tên khung giờ · Khung giờ hoạt động · Nhóm thực đơn áp dụng · Thứ tự`

⇒ Hai chỗ này **là cùng một tính năng**. Bỏ thì phải bỏ cả hai. Nhưng cái thứ hai còn bị nút *Đăng lên ShopeeFood* phụ thuộc: *"Nếu chưa thiết lập nhóm khung giờ, hiển thị cảnh báo **Bạn chưa thiết lập nhóm khung giờ. Vui lòng thêm nhóm khung giờ**"* — bỏ tính năng thì cảnh báo này cũng phải bỏ. **Cần xác nhận.**

### G2 — 🔴 Hết món có thời hạn: `[XM-NEW]` chỉ có Có bán / Ngừng bán

`[XM-NEW]`: *"Trạng thái món cho chọn **Có bán** hoặc **Ngừng bán**"*. Nhưng `[API] DishStatus` có **ba** giá trị: `AVAILABLE=1` · `OUT_OF_STOCK=2` · `INACTIVE=3`, và đặt `OUT_OF_STOCK` thì **bắt buộc** kèm `from_time`+`to_time` (kiểm chứng dòng `1414`–`1416`).

*Ngừng bán* ứng với `INACTIVE`. Vậy **hết nguyên liệu tạm thời** (hết thịt bò lúc 19h, mai có lại) đi đường nào? Nếu dùng *Ngừng bán* thì hôm sau phải nhớ bật tay lại. `[XM-NEW]` chưa trả lời. **Còn mở.**

### G3 — 🔴 `A6` vẫn nguyên: một nút "Đăng lên ShopeeFood" làm cả hai việc

`[XM-NEW]` xác nhận đúng cái tôi lo ở `A6`:
- *"Sửa Giá bán ShopeeFood chỉ là **lưu nháp**, chỉ có hiệu lực khi bấm **Đăng lên ShopeeFood**"*
- *"Nút **Đăng lên ShopeeFood**: đẩy **toàn bộ** thực đơn đã ghép lên gian hàng"*
- *"Món có trên ShopeeFood mà không có trong thực đơn CukCuk **sẽ bị xóa** khỏi gian hàng, kèm theo **mất luôn số lượt đã bán**"*

⇒ Đổi giá **một** món cũng phải chạy nguyên một lần đẩy toàn bộ có tính huỷ diệt. Trong khi `[API]` có sẵn `dish.update` / `dish.bulk_update` / `topping.update_prices` để sửa lẻ, an toàn tuyệt đối. **Còn mở** — xem `A6` + `F2`.

### G4 — 🟠 Ràng buộc mới `[XM-NEW]` đưa ra mà chưa có nguồn

| Ràng buộc | Vấn đề |
|---|---|
| Tên món **tối đa 60 ký tự** | `[API]` **không nêu** giới hạn cho `name`. Là ràng buộc của CukCuk hay của ShopeeFood? |
| Mô tả **tối đa 250 ký tự** | `[API §3.5]` ghi `description` **≤ 500 ký tự**. `[XM-NEW]` đang chặt hơn — cố ý hay nhầm? |
| *"món có **ký tự cấm** tại ShopeeFood"* | **Chưa có danh sách ký tự cấm** ở bất kỳ đâu. Không có danh sách thì không validate được |

### G5 — 🟠 `Q-C08` bị đơn giản hoá so với API

`[XM-NEW]` đặt *Bắt buộc chọn nhóm* và *Số lượng tối đa* ở **cấp nhóm STPV**. `[API]` cho đặt **theo từng món** (`topping.set_group_quantity` nhận `partner_dish_id`; `dish.create_topping_mapping` có `is_required` riêng từng cặp).

⇒ Không sai, chỉ là **đơn giản hoá có chủ ý**. Cần ghi rõ vào spec là *"CukCuk dùng cấu hình chung cấp nhóm, không dùng cấu hình theo món dù API cho phép"* — để sau này không ai tưởng là thiếu sót.

### G6 — 🔵 Còn mở, mức nhỏ (`[XM-NEW]` không nhắc)

`Q-A01` phân quyền · `Q-A02` nhật ký thao tác · `Q-B05` nhắc khi chờ quét lâu · `Q-B07` gian hàng chưa có món nào · `Q-C01` lưu tiến độ ghép dở · `Q-C02` lối thoát cho món quán không định bán 🔴 · `Q-D04` hết món hết hạn tự mở lại · `Q-E04` kỳ nghỉ chồng giờ mở cửa · `Q-E08` số phút mặc định của tự động xác nhận · `Q-E09` ngưỡng quá tải · `Q-F01` liệt kê đích danh món sắp bị xoá · `Q-F04` đăng lúc giờ cao điểm · `Q-I02` tên tiếng Anh · `Q-I03` ghi chú VAT · `Q-I04` làm tròn · `Q-I05` chạy thử

---

## E. Kết luận & thứ tự làm

**Không có file nào trên đĩa hiện đang đúng hoàn toàn.** Mỗi file đúng ở phần viết sau cùng, sai ở phần viết trước — vì quyết định mới không được lan ngược.

### Vòng 1 — 6 câu chặn, phải chốt trước khi gõ chữ nào vào spec

| # | Câu | Vì sao chặn |
|---|---|---|
| 1 | `A1` / `Q-D02` — **duyệt món** (`is_pending`, `REJECT_REQUEST`) | Thêm 2 trạng thái vào **mọi** dòng món. `WBE-D7` đang mâu thuẫn với nguồn sơ cấp |
| 2 | `F1` — **lịch bán món không có API**, có làm bằng bộ hẹn giờ nội bộ không | Cả một tab của prototype phụ thuộc câu này |
| 3 | `A10` / `WBE-D5` — **món khuyến mại ẩn hay hiện** | Ẩn ⇒ tự sinh ra `RR-01` + `BR-UNMAP-P2` |
| 4 | `Q-I01` — **chuỗi nhiều chi nhánh** | Ảnh hưởng toàn bộ màn thực đơn |
| 5 | `Q-D03` — **hết món có thời hạn**, tách khỏi *Ngừng bán* | Trạng thái thứ 3 trên dòng món; API bắt buộc `from_time`/`to_time` |
| 6 | `A6`+`F2` — **tách nút "Cập nhật" (API lẻ) khỏi "Đẩy lại toàn bộ" (`menu.sync`)** | Không tách thì mỗi lần đổi giá là một lần huỷ diệt |

### Vòng 2 — dọn dẹp Web BE, không cần hỏi ai
`D1` · `D2` · `D3` · `D4` · `D5` · `D9` (xem §D)

### Vòng 3 — viết spec từng luồng
B kết nối → C wizard ghép nối → D thực đơn hằng ngày → E thiết lập → F đồng bộ → G tạm ngưng → H ngắt kết nối.
Vừa viết vừa lập **sổ đăng ký thông báo** `MSG-*` (yêu cầu *"từng câu thông báo lỗi"*).

### Vòng 4 — POS (sau khi xong Web BE)
Dọn `D6`, `D7`, `D8` + chốt `Hở 3` + 4 rủi ro `RR-*`. `XD-12`/`XD-14` chờ ShopeeFood trả lời `Q-PAY-B`, **không chặn** XMind.

### Vòng 5 — xuất XMind, cả 2 nhánh Web BE + POS trong một file.

---

### 📌 Quyết định của tôi về cách tổ chức (anh bác thì tôi đổi)

- **Giữ nguyên kiểu file phẳng** `specs/modules/NN-*.md`, không chuyển sang `templates/module/` (thư-mục-mỗi-module). Chuyển đổi là việc anh không yêu cầu. Đánh đổi: **không dùng được bộ kiểm tra nhất quán chéo tự động**, tôi rà tay ở vòng 5. Web BE sẽ tách thêm `05-thiet-lap.md`, `06-duyet-mon.md` (nếu `A1` chốt là có làm).
- **Toàn bộ tiếng Việt**, kể cả khi file skill ghi *"output in English"* — vì mọi thứ trên đĩa và XMind đều tiếng Việt.
