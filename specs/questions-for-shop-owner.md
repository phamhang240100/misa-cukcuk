# Bộ câu hỏi khảo sát Chủ cửa hàng — bám tình huống thật

> Mỗi câu gắn với **một quyết định/ràng buộc cụ thể** trong thiết kế (cột "→ chốt gì"). Hỏi dạng **tình huống + lựa chọn** để câu trả lời sửa thẳng được vào spec. Cột "→ chốt gì" là ghi chú nội bộ cho BA, không đọc cho khách.

---

## A. Kết nối (Module 01)
| # | Câu hỏi (tình huống) | → chốt gì |
|---|---|---|
| A1 | Chỉ **chủ quán (chủ tài khoản Shopee)** mới quét mã kết nối được. Chủ quán có thường xuyên ở quán và tự thao tác máy tính tiền không, hay giao nhân viên? Nếu giao nhân viên thì xử lý sao? | ràng buộc "chỉ owner link được" (BR-02) có gây kẹt vận hành không |
| A2 | Máy tính tiền của quán là **máy tính/POS để bàn** hay tablet? Điện thoại của chủ quán có cài sẵn **app Shopee Partner** không? | QR hiện trên màn to → quét bằng điện thoại (luồng device-code) |
| A3 | Quán đã từng dùng phần mềm POS nào khác nối Shopee chưa (VD Ocha)? Còn đang nối không? | Ocha phải gỡ trước mới nối được (P6) |

## B. Thực đơn — mapping & đồng bộ (Module 02)
| # | Câu hỏi (tình huống) | → chốt gì |
|---|---|---|
| B1 | Tên món trên **ShopeeFood** với tên món tại **quán/CukCuk** có **giống nhau** không, hay đặt khác (VD tại quán "Bạc xỉu", trên Shopee "Bạc xỉu size M (Ưu đãi)")? Khác nhiều hay ít? | độ chính xác auto-match tên ~80% (DEC-MAP-01) |
| B2 | Hiện quán có **bao nhiêu món** trên ShopeeFood? Có món nào đang gắn **"Trùm Deal"** (mua trước dùng sau) hay **"Ăn Ngon Rẻ"** không? | các món này khoá — sync đụng vào sẽ lỗi (F11) → phải cảnh báo/loại trừ |
| B3 | **Tình huống:** khi bấm "Đồng bộ toàn bộ thực đơn", món nào đang có trên Shopee mà chưa được ghép cặp sẽ **bị xoá và mất hết lượt bán/đánh giá**. Anh/chị muốn: (a) hệ **bắt ghép hết** rồi mới cho đồng bộ, hay (b) chỉ **đẩy từng món mới** cho chắc? | guardrail full-sync hủy diệt (F2) — UI cảnh báo mức nào |
| B4 | Khi đổi giá/sửa món, anh/chị quen sửa **ở đâu**: trên CukCuk hay thẳng trên Shopee Partner? (Lưu ý: nếu thiết kế đẩy 1 chiều CukCuk→Shopee, **sửa trên Shopee sẽ không tự về CukCuk**, và lần đồng bộ sau có thể ghi đè.) | chiều đồng bộ 1 chiều (F1) có khớp thói quen không |
| B5 | Món của quán có nhiều **topping/tuỳ chọn** không (size, đá, đường, thêm trân châu…)? Có nhóm nào **bắt buộc chọn** / **chọn tối đa mấy loại**? | mapping nhóm STPV + min/max selection (§3 Module 02) |
| B6 | Quán có bán **combo** không? Nếu có, đang khai trên Shopee kiểu gì? (Shopee **chưa hỗ trợ combo** qua kết nối — cần biết để tư vấn) | F8 — xử lý combo ra sao |

## C. Nhận & xử lý đơn tại quán (Module 03)
| # | Câu hỏi (tình huống) | → chốt gì |
|---|---|---|
| C1 | Giờ cao điểm quán nhận **khoảng bao nhiêu đơn Shopee/giờ**? Ai là người bấm nhận (thu ngân/bếp/quản lý)? | tải hệ thống + vai trò trên màn POS |
| C2 | **Tình huống auto-confirm:** nếu bật chế độ "quá **2 phút** không ai bấm thì tự xác nhận đơn" — anh/chị thấy tiện, hay **sợ tự nhận nhầm** khi món đã hết? Muốn áp cho **mọi đơn** hay **chỉ đơn đã thanh toán trước**? | DEC-CONFIRM-01 (mặc định + phạm vi) |
| C3 | Khi xác nhận đơn, quán có **in phiếu/tem gửi bếp** không? Mẫu hiện tại in **những gì** (tên món, topping, ghi chú, số đơn)? In mấy liên? | in tem nội bộ (F4) — tái dùng mẫu nào |
| C4 | **Tình huống hết món giữa chừng:** đơn đã xác nhận nhưng 1 món vừa hết. Hiện anh/chị làm gì? (Lưu ý: kết nối **chỉ cho huỷ cả đơn**, không bớt được 1 món; và **hết hạn huỷ khi tài xế đã lấy hàng**.) | F5/F7 — nghiệp vụ huỷ, ràng buộc PICKED |
| C5 | Có khi nào quán muốn **sửa món trên đơn** Shopee (đổi tên, số lượng) tại máy không? (Kết nối chỉ cho **sửa tên hiển thị**, không đổi số lượng/giá) | F4/E7 — kỳ vọng sửa đơn |

## D. Tiền, thuế & đối soát (Module 04)
| # | Câu hỏi (tình huống) | → chốt gì |
|---|---|---|
| D1 | Trên màn đơn, con số nào quan trọng với anh/chị hơn: **"tiền khách phải trả"** hay **"tiền quán thực nhận"** (đã trừ hoa hồng, thuế, khuyến mại quán chịu)? Hay cần **cả hai**? | định nghĩa lại "Còn phải thu" (PM-03) |
| D2 | Anh/chị có biết công thức **tiền thực nhận = tiền món − KM quán tài trợ − hoa hồng − thuế** không? Hiện đối soát con số này **bằng cách nào** (email Shopee, app, tự tính tay)? | cách hiển thị & báo cáo đối soát |
| D3 | Shopee **thu hộ & nộp hộ thuế** hộ kinh doanh rồi mới chuyển tiền. Anh/chị có cần CukCuk **tách rõ khoản thuế đã trừ** để kế toán không tính trùng không? | ghi nhận gross vs net (A5 research) |
| D4 | Đơn Shopee anh/chị có **xuất hoá đơn điện tử** không? Xuất từ **phần mềm nào** (Shopee không hỗ trợ xuất HĐĐT)? | F4 — dùng HĐĐT riêng CukCuk |

## E. Khuyến mại & tạm ngưng bán
| # | Câu hỏi (tình huống) | → chốt gì |
|---|---|---|
| E1 | Quán hay chạy khuyến mại gì trên Shopee? (giảm giá **món** / giảm **hoá đơn** / mua 1 tặng 1 / đồng giá / freeship). Loại nào chạy nhiều nhất? | chỉ **giảm giá món (giá gạch)** đồng bộ được qua kết nối (F6) — cái khác phải làm tay trên Shopee |
| E2 | **Tình huống hết nguyên liệu/nghỉ đột xuất:** anh/chị có muốn 1 nút **"Tạm ngưng nhận đơn Shopee ngay lập tức"** ngay trên máy tính tiền không? Thường ngưng khoảng bao lâu? | DEC-PAUSE-01 (`set_restaurant_busy`) |

## F. Bối cảnh triển khai
| # | Câu hỏi (tình huống) | → chốt gì |
|---|---|---|
| F1 | Quán có **mấy chi nhánh**? Mỗi chi nhánh một gian ShopeeFood riêng đúng không? | mapping 1:1 store, nhiều store/1 tài khoản |
| F2 | Ngoài Shopee, quán có bán **GrabFood/Be** không? Có muốn xem **chung một màn nhận đơn** với Shopee không (lần này làm Shopee trước)? | khung UI đa kênh (SA-01) |
| F3 | Nhân viên bấm máy có **rành công nghệ** không? Mạng internet ở quán có hay rớt không? | độ đơn giản UI + rủi ro mất kết nối/rớt đơn |

## G. Đau nhất & mong muốn (mở — hỏi cuối)
| # | Câu hỏi |
|---|---|
| G1 | Việc bán Shopee hiện nay khiến anh/chị **mất thời gian / hay sai nhất** ở khâu nào? |
| G2 | Nếu CukCuk làm được **đúng 1 điều** để việc bán Shopee nhẹ đi, anh/chị mong điều gì nhất? |
| G3 | Có tính năng nào ở phần mềm khác anh/chị thấy hay và **muốn có**? |
| G4 | Điều gì khiến anh/chị thấy **"kết nối này đáng dùng, đáng trả tiền"**? |

---
## Cách dùng
Trả lời A–F → đối chiếu & chỉnh `modules/01–04`; đặc biệt B3 (guardrail sync), C2 (auto-confirm), D1 (tiền thực nhận), E2 (tạm ngưng). Trả lời G → xếp ưu tiên giai đoạn "Nâng cao UX". Ý hé lộ yêu cầu mới → `/ba:refine`.
