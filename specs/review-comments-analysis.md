# Phân tích comment review (Google Doc) ↔ specs & UI draft

> Nguồn: Google Doc **2 tab** — Tab 1 (15 ghi chú tổng quát) + **Tab 2 (feedback UI/UX chi tiết + chỉ đạo BPMN)** + UI draft `Docs/UI` (POS + web BE).
> Phân loại: ✅ **Đã có lời đáp** (trỏ spec) · 🟠 **Cần quyết định** (đưa vào vòng hỏi) · 🔬 **Đang research** (real-ops, chạy nền).

| # | Comment | Trạng thái | Kết luận / trỏ |
|---|---------|-----------|----------------|
| 1 | Cơ chế tự động khớp món? | ✅ | Auto fuzzy-match tên ~80% + user xác nhận — `DEC-MAP-01`, `Module 02 §2` |
| 2 | Có cần thiết lập **Tài khoản nhận tiền** (NH/Ví)? | ✅ | **KHÔNG** — cài khi đăng ký bán trên SPF, là quy trình nhà hàng ↔ SPF `[Q&A 1206-B.1,B.2]`. ⚠️ UI web BE đang có mục "Ví" → **nên bỏ khỏi phạm vi CukCuk** |
| 3 | Quy tắc liên kết món (1-1?) | ✅ | Mapping **1-1** cho món/nhóm/topping `[Q&A 2906-5]`, `Module 02 §2` |
| 4 | Luồng cập nhật thực đơn Shopee (sửa trên Partner → về CukCuk) | ✅ | **KHÔNG sync ngược** — sửa trên Shopee Partner không về CukCuk `[Q&A C.1] F1`. Muốn tham chiếu chỉ có `get_dish` |
| 5 | Luồng cập nhật menu trực tiếp từ CukCuk | ✅ | Đồng bộ 1 chiều CukCuk→SPF (mapping-first + guardrail) `Module 02` |
| 6 | **Để thực đơn Shopee ở "kết nối Shopee" hay ở thực đơn chính CukCuk?** | ✅ CHỐT | **Kết hợp**: thực đơn gốc quản lý ở CukCuk; mapping + giá Shopee + giờ bán đặt ở **màn kết nối Shopee**. (BA chốt) |
| 7 | Tính năng cần có ở màn quản lý thực đơn & thiết lập | ✅ | Tabs Món/Nhóm/STPV/Lịch trình/Thiết lập `Module 02 §3`; vị trí theo #6 (kết hợp) |
| 8 | **Có bắt buộc phiếu giao hàng?** | ✅ CHỐT (research) | **Không cần phiếu giao đầy đủ** (địa chỉ khách nằm ở app tài xế). Khâu bàn giao chỉ cần đối chiếu **mã đơn rút gọn (4–6 ký tự cuối, cỡ lớn) + danh sách món/SL** (Sapo/KiotViet đều vậy, không OTP). "Hoá đơn bán hàng" là chứng từ **nội bộ/đối soát** gắn vào đơn — tách khỏi tem bàn giao. Chi tiết: `.clarity/domain-research-ops.md`, `Module 03` |
| 9 | Sếp: **chia khung Grab/ShopeeFood riêng** | ✅ | POS draft **đã tách** (view 'grab' / 'shopeefood' riêng, tab & đơn riêng). Giữ nguyên hướng này (khung đa kênh, kênh riêng) — dù lần này build Shopee trước |
| 10 | Click order ở thông báo → chi tiết → **focus vào Món** cho nhân viên | ✅ | `NT-02` + chi tiết đơn ưu tiên **danh sách món** (tên/SL/topping/ghi chú) `Module 03 §4`. Default: mở đúng tab + cuộn tới list món |
| 11 | **Chuyển bếp/bar chế biến (nếu có) → "có lần làm không" → cf với khách** | 🟠 | Luồng bếp chưa có trong spec — xem Q3 |
| 12 | Điểm chạm shipper — phiếu highlight gì, báo cáo lại | 🔬 | Research real-ops đang chạy → sẽ bổ sung nội dung phiếu giao + info shipper cần |
| 13 | Thời điểm **thu tiền & bấm bill** trong nghiệp vụ thực tế | 🔬 | Research đang chạy → chốt bước "thu tiền/hoàn thành" (đơn SPF quán không thực thu, xem `PM-01..05`) |
| 14 | Cần nghiên cứu kĩ quy trình | 🔬 | Bao trùm bởi research #12/#13 + `customer-journey.md` |
| 15 | Luồng khuyến mại áp dụng Shopee? | ✅ | Chỉ **giá gạch (price_slash)** qua API; loại khác liên hệ SPF setup `F6`, `Module 02 M6` |

## Đối chiếu với UI draft
- **POS** (`pos-order-shopeefood`): đã có view riêng Grab / ShopeeFood + tab trạng thái/đơn chọn riêng từng kênh → **khớp comment #9**. Chi tiết đơn bên phải → khớp #10.
- **Web BE** (`web BE- kết-nối...`): màn `ThucDonView` có tabs Món / Nhóm món / Sở thích phục vụ / Lịch trình / Thiết lập → khớp #7. ⚠️ Có xuất hiện mục **"Ví"** → theo #2 nên **loại bỏ** (không phải việc của CukCuk).

---

# TAB 2 — Feedback UI/UX chi tiết & chỉ đạo BPMN

## A. Redesign màn Kết nối & Đồng bộ thực đơn (web BE — Module 01/02)
| # | Chỉ đạo từ sếp/team | Loại | Xử lý |
|---|---|---|---|
| T-A1 | **Wording lại** màn giới thiệu + bước "B1 - Quét QR": bỏ chữ thừa, gọn, friendly | Directive | Áp vào spec UI Module 01 (micro-copy) |
| T-A2 | **Concept mới:** Nhấn kết nối → pop-up hỏi *"Đã có thực đơn trên ShopeeFood chưa?"* → **Có**: đồng bộ thực đơn về / **Không**: hiện thực đơn trống. **Bỏ màn riêng, dùng pop-up + tự điều hướng** | Directive | Cập nhật luồng Module 01→02; lưu ý F1 (kéo về chỉ tham chiếu qua get_dish) |
| T-A3 | Bước 2 Đồng bộ: sửa **độ rộng cột "Đơn vị tính"** | UI nhỏ | Ghi chú UI |
| T-A4 | Đổi nhãn trạng thái **"Chưa/Đã liên kết" → "Đã ghép nối"** (hoặc từ hợp lý hơn) | Wording | Chốt thuật ngữ trong glossary |
| T-A5 | **Bỏ dạng tab → chia bước con:** tách **"Đồng bộ món"** và **"Đồng bộ STPV"** thành 2 bước (tab khó dùng) | Directive | Redesign IA Module 02 §3 |
| T-A6 | Thêm cột **"Nhóm thực đơn tương ứng"** ngay sau cột "Món tương ứng"; **bỏ tab "Nhóm thực đơn" & "Nhóm STPV"** | Directive | Gộp mapping nhóm vào dòng món |
| T-A7 | **Phân biệt rõ** thông tin nào của **ShopeeFood** vs **CukCuk** trên màn | Directive | Nguyên tắc thiết kế (2 cụm/màu/nhãn) |
| T-A8 | **Cân nhắc bỏ/hoãn Bước 3 "Thiết lập bán hàng"** — thiết lập ngay khi kết nối hay để sau? | 🟠 Cần quyết + research | Xem Q4 |
| T-A9 | **Bỏ button "Nhập khẩu"** (import file) — chỉ chọn món từ thực đơn | Directive | Bỏ khỏi UI |
| T-A10 | Thêm **"hiệu quả bán hàng"** (hiệu suất kênh Shopee) — đặt ở màn nào (Tổng quan?) | 🟠 Cần quyết | Xem Q5 (báo cáo) |

## B. POS & xử lý đơn (Module 03)
| # | Chỉ đạo | Xử lý |
|---|---|---|
| T-B1 | **Không được miss đơn:** khi order về → nổi bật, **chuông + nhấp nháy tab + thông báo liên tục** dù nhân viên ở xa PC | Bổ sung spec notification Module 03 §7 (chi tiết hành vi báo) |
| T-B2 | Order online về vào **màn Online** — mô tả chi tiết chuông/nhấp nháy để vào xác nhận kịp | như trên |
| T-B3 | Nghiên cứu **in tạm tính** để vào màn thanh toán có hợp lý không; màn chi tiết thanh toán cải tiến gì | 🔬 gắn research thu-tiền/bill (#13) |
| T-B4 | (lặp Tab 1) chuông/focus món/bếp-bar/shipper/thu tiền | đã xử lý ở bảng Tab 1 (#10–13) |

## C. Báo cáo (Module 04/05)
| # | Chỉ đạo | Xử lý |
|---|---|---|
| T-C1 | Báo cáo **biên bản bàn giao ca** trong ngày | Thêm vào phạm vi báo cáo |
| T-C2 | Báo cáo **hiệu suất kinh doanh theo kênh** (ShopeeFood) từ khi kết nối đến nay | Thêm vào phạm vi báo cáo |

## D. 🎯 Chỉ đạo lớn: VẼ BPMN CHI TIẾT từng luồng (BPMN tổng quan đã có)
Sếp yêu cầu vẽ **BPMN chi tiết, đi sâu logic + edge case** cho các luồng nhỏ:
1. **Liên kết CukCuk ↔ Shopee** (kết nối + mapping)
2. **Thiết lập khi khách thay đổi món/giá, hóa đơn, rule xác nhận đơn**
3. **Luồng xử lý đơn hàng** (đầy đủ nhánh + edge case)
+ **Trình bày toàn trình cho sếp:** Kết nối → Đồng bộ thực đơn → Xử lý đơn → Báo cáo (gồm điểm chạm bếp/bar/shipper).

## Tổng hợp trạng thái
- ✅ **Đã chốt:** #1-5,7,9,10,15 (Tab 1); #6 (kết hợp); #8 (research phiếu giao); #11 (luồng bếp CukCuk); T-A1,A3,A4,A5,A6,A7,A9, T-B1/B2 (directive → áp vào spec)
- 🔬 **Research xong:** shipper touchpoint (#12), thu-tiền/bill (#13) → xem `.clarity/domain-research-ops.md`
- 🟠 **Còn quyết:** Q4 (bỏ/hoãn Bước 3 thiết lập — T-A8) · Q5 (nơi đặt báo cáo hiệu suất — T-A10) · model "hoàn thành đơn" (Sapo vs KiotViet, từ research)
- 🎯 **Deliverable lớn:** BPMN chi tiết 3 luồng (mục D)
