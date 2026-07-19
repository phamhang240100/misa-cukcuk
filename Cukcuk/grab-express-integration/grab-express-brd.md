---
type: brd
feature: grab-express
status: draft
updated: 2026-07-20
---

# BRD — Tích hợp Grab Express vào MISA CukCuk (C86574)

Tài liệu yêu cầu nghiệp vụ mô tả chi tiết luồng tích hợp đối tác giao hàng **Grab Express** vào MISA CukCuk, cho **2 phân hệ: Web quản lý** và **POS bán hàng**. Sơ đồ luồng chi tiết ở `srs/grab-express-flows.md` (sequence) và `bpmn/grab-express-flow.bpmn` (BPMN); rule & mã lỗi đầy đủ ở `srs/grab-express-flow-spec.md`.

---

## 1. Tổng quan

### 1.1 Bối cảnh
Nhà hàng dùng MISA CukCuk cần giao món cho khách qua đối tác vận chuyển. Grab Express được thêm làm một **hình thức giao hàng** bên cạnh *Nhà hàng tự giao / AhaMove / ShopeeFood*. Thu ngân lập đơn tại POS, hệ thống gửi vận đơn sang Grab, tài xế Grab lấy món tại quán và giao cho khách; MISA CukCuk theo dõi trạng thái và ghi nhận doanh thu.

### 1.2 Mục tiêu nghiệp vụ
| # | Mục tiêu |
|---|---|
| BO-01 | Cho phép nhà hàng kết nối và giao món qua Grab Express ngay trong MISA CukCuk, không cần thao tác ngoài hệ thống. |
| BO-02 | Tối ưu thao tác thu ngân: tự động cập nhật trạng thái giao theo Grab (không bấm tay từng bước), giảm sai lệch dữ liệu. |
| BO-03 | Bảo toàn tính đúng đắn dòng tiền: chỉ đóng đơn "Đã thanh toán" khi thu ngân xác nhận, tránh ghi nhận thu nhầm. |
| BO-04 | Cung cấp khả năng theo dõi, đối soát và báo cáo doanh thu theo đối tác Grab Express. |

### 1.3 Phạm vi

**Trong phạm vi (In scope):**
- Web quản lý: kết nối / cập nhật / hủy kết nối Grab Express; đổi tên "Grab" → "Grab Food".
- POS: lập đơn giao Grab Express, gửi đơn, đồng bộ trạng thái, thu tiền, xử lý đơn lỗi/hoàn, theo dõi ở Sổ giao hàng, xác nhận đơn online.
- Báo cáo: hiển thị đối tác Grab Express trong Bảng kê hóa đơn và Doanh thu theo đối tác.

**Ngoài phạm vi (Out of scope):**
- Màn hình phía Grab (app tài xế, trang Grab Merchant).
- Nghiệp vụ ví/nạp quỹ trả phí ship (chờ chốt mô hình tài chính — xem Mục 8).
- Luồng đơn Haravan/Website (nếu khác POS — cần xác nhận, xem Mục 8).

### 1.4 Đối tượng sử dụng
| Vai trò | Mô tả | Phân hệ |
|---|---|---|
| Quản lý nhà hàng / Quản trị | Kết nối, cập nhật, hủy kết nối đối tác; xem báo cáo | Web quản lý |
| Thu ngân (POS) | Lập đơn, gửi đơn, thu tiền, xử lý đơn lỗi, theo dõi giao hàng | POS |
| Hệ thống MISA CukCuk | Xác thực Grab, gửi/nhận trạng thái, đồng bộ tự động | Nền (backend) |
| Grab Express | Báo giá, tạo vận đơn, điều phối tài xế, đẩy trạng thái | Đối tác ngoài |

---

## 2. Nguyên tắc thiết kế lõi (áp dụng cho cả 2 phân hệ)

| # | Nguyên tắc |
|---|---|
| NT-01 | **Hai loại trạng thái**: trạng thái đơn **CukCuk** (Chờ gửi đối tác → Chờ giao hàng → Đang giao hàng → Đã thanh toán) và trạng thái **Grab Express (GE)** (10 trạng thái từ webhook). |
| NT-02 | **Hybrid auto-sync**: bước *giao hàng* tự đồng bộ từ Grab (tài xế lấy hàng → đơn tự chuyển *Đang giao hàng*, **bỏ nút Giao hàng thủ công**); bước *tiền* thì **gate thủ công**. |
| NT-03 | **Thu tiền luôn thủ công**, chỉ mở khi Grab đã giao xong (COMPLETED); **không bao giờ tự đóng** "Đã thanh toán" (kể cả đơn COD = 0). |
| NT-04 | **Thao tác tay là tối thượng**: khi thu ngân đã thao tác, auto không ghi đè; auto chỉ tiến, không lùi. |
| NT-05 | **Dự phòng**: nếu không nhận được cập nhật từ Grab, hệ thống tự hỏi lại Grab định kỳ (không phụ thuộc hoàn toàn webhook). |
| NT-06 | **Đồng bộ đa thiết bị**: trạng thái đơn + thông báo hiển thị nhất quán trên mọi thiết bị cùng chi nhánh. |
| NT-07 | **Xác thực cấp đối tác**: kết nối Grab dùng cơ chế xác thực ở cấp MISA (backend), người dùng **không nhập** khóa/mật khẩu; form kết nối chỉ khai báo hồ sơ người gửi (SĐT, địa chỉ). |

Bảng ánh xạ trạng thái **GE → CukCuk**:

| GE (từ Grab) | CukCuk (tự động) | Nút hiển thị |
|---|---|---|
| ALLOCATING / PENDING_PICKUP | (giữ) Chờ giao hàng | Hủy |
| PICKING_UP | **Tự động** → Đang giao hàng | Hủy (khi còn hủy được) |
| PENDING_DROP_OFF / IN_DELIVERY | (giữ) Đang giao hàng | — |
| COMPLETED | Banner "Chờ thu tiền" (không tự đóng) | **Thu tiền** |
| CANCELED / FAILED | Tự mở lại → Chờ gửi đối tác + cờ đỏ | Gửi lại / Đổi đối tác / Hủy |
| RETURNED | Nhắc thu ngân chọn | Gửi lại / Hủy |

---

## 3. PHÂN HỆ WEB QUẢN LÝ — Yêu cầu chi tiết

Đường dẫn: **Ứng dụng › Grab Express**. Người dùng: Quản lý nhà hàng / Quản trị.

### 3.1 Màn danh sách Ứng dụng
| ID | Yêu cầu |
|---|---|
| FR-web-001 | Hiển thị lưới ứng dụng, mỗi ứng dụng là một card có logo, tên, badge trạng thái (*Đã kết nối* / *New*) và link **Chi tiết**. |
| FR-web-002 | Danh sách gồm: Hóa đơn điện tử, MISA AMIS–Kế toán, **Grab Express** (badge New), **Grab Food** (đổi tên từ "Grab"), ShopeeFood (New), MISA SME.NET, AMIS Accounting, SMS Marketing, AhaMove. |
| FR-web-003 | Đổi nhãn hiển thị "Grab" → "Grab Food". Dữ liệu/đơn cũ tạo bằng tên "Grab" không bị ảnh hưởng về mặt nghiệp vụ *(cần xác nhận hiển thị lịch sử — xem Mục 8)*. |
| FR-web-004 | Click card Grab Express (hoặc **Chi tiết**) → mở màn Kết nối (3.2) nếu chưa kết nối, hoặc màn Cập nhật/Hủy (3.3) nếu đã kết nối. |

### 3.2 Màn Kết nối Grab Express
| ID | Yêu cầu |
|---|---|
| FR-web-010 | Form khai báo **hồ sơ người gửi**, lấy sẵn dữ liệu từ *Thiết lập chung*: SĐT, Tỉnh/TP, Quận/Huyện, Phường/Xã, Địa chỉ. Người dùng sửa được. |
| FR-web-011 | Checkbox **"Yêu cầu xuất hóa đơn Phí vận chuyển (VAT)"** — mặc định TẮT. |
| FR-web-012 | Khi bật checkbox VAT → hiện trường **Email xuất hóa đơn** (bắt buộc) + link đăng ký Google Form. |
| FR-web-013 | Nút **Kết nối** thực hiện validate (BR-web-01..03) rồi gửi yêu cầu kết nối tới Grab (qua backend, xác thực cấp đối tác — NT-07). |
| FR-web-014 | Kết nối thành công → thay nút thành **Cập nhật** + **Hủy kết nối**; badge card chuyển *Đã kết nối*. |

**Business rules — Kết nối:**
| ID | Rule | Thông báo/Hành vi |
|---|---|---|
| BR-web-01 | Trường bắt buộc để trống | E-grab-express-008: "Trường này không được để trống." |
| BR-web-02 | Email VAT sai định dạng (khi bật checkbox) | E-grab-express-007: "Email chưa đúng định dạng…" |
| BR-web-03 | Địa chỉ ngoài khu vực Grab Express phục vụ | E-grab-express-005: cảnh báo Grab Express chưa hỗ trợ khu vực này. Khu vực phục vụ **validate động qua Grab** (không hard-code danh sách tỉnh). |
| BR-web-04 | Xác thực Grab ở cấp đối tác MISA; người dùng không nhập khóa/mật khẩu | SĐT/địa chỉ chỉ là hồ sơ người gửi đính vào mỗi vận đơn. |

### 3.3 Sau kết nối — Cập nhật / Hủy kết nối
| ID | Yêu cầu |
|---|---|
| FR-web-020 | **Cập nhật**: mở lại form (3.2), cho sửa hồ sơ người gửi / cấu hình VAT, lưu lại. |
| FR-web-021 | **Hủy kết nối**: xét trạng thái các đơn Grab Express hiện có (BR-web-05). |
| BR-web-05 | Nếu còn đơn **đang trong quá trình giao vận** (GE chưa ở trạng thái kết thúc {COMPLETED, RETURNED, CANCELED, FAILED}) → cảnh báo "đang có hóa đơn trong quá trình giao vận…" trước khi hủy. Nếu mọi đơn đã ở trạng thái kết thúc → cảnh báo thường (Có/Không). |

---

## 4. PHÂN HỆ POS — Yêu cầu chi tiết

Người dùng: Thu ngân. Bao gồm: lập & gửi đơn, đồng bộ trạng thái, thu tiền, xử lý đơn lỗi/hoàn, danh sách order, xác nhận đơn online, và **Sổ giao hàng** (theo dõi).

### 4.1 Lập đơn giao hàng, chọn Grab Express
| ID | Yêu cầu |
|---|---|
| FR-pos-001 | Trong màn thông tin **Giao hàng** của order: các trường Ngày giao, Giờ giao, Khách hàng, Địa chỉ giao, **Đặt cọc trước**, và **Hình thức giao** (dropdown: Nhà hàng tự giao / Grab Express / AhaMove / ShopeeFood). |
| FR-pos-002 | Chọn **Grab Express** → hiện nhóm trường GE: **Loại dịch vụ** = "Siêu tốc - Thực phẩm" (khóa, không đổi); **Phí GH trả đối tác** (chỉ hiện khi đủ Tỉnh/Quận/Phường, **không sửa**, có ⓘ); **Phí GH thu khách** (mặc định = phí trả đối tác, **sửa được**); **Thu hộ COD**. |
| FR-pos-003 | Chọn **Nhà hàng tự giao** → hiện Mã đơn đối tác (N/A) + Phí giao hàng (sửa được). *(Các đối tác khác ngoài phạm vi BRD này.)* |
| FR-pos-004 | Phí GH trả đối tác lấy từ **báo giá của Grab** theo điểm gửi/điểm giao. Nếu **không lấy được báo giá** → chặn Lưu đơn với đối tác Grab Express, báo E-grab-express-001 "Không lấy được phí giao hàng, thử lại" + cho thử lại. |

**Business rules — Phí & COD:**
| ID | Rule |
|---|---|
| BR-pos-01 | Loại dịch vụ khóa ở "Siêu tốc - Thực phẩm" — không cho chọn gói khác. |
| BR-pos-02 | **COD (tiền tài xế thu hộ) = Còn phải thu = (tiền món + Phí GH thu khách) − Đặt cọc trước**, tự tính khi Lưu, không nhập tay. |
| BR-pos-03 | Phí GH thu khách mặc định = Phí GH trả đối tác, sửa được. Nếu đặt **thấp hơn** phí trả đối tác → cảnh báo mềm (không chặn). |
| BR-pos-04 | Hạn mức COD lấy theo merchant từ Grab; nếu không có → mặc định **2.000.000đ**. COD vượt hạn mức → E-grab-express-006 "Chọn đối tác giao hàng khác". |

### 4.2 Lưu đơn — validate
| ID | Yêu cầu |
|---|---|
| FR-pos-010 | Nút **Lưu / Lưu & Thêm**: đơn Grab Express mặc định là **đơn thu hộ (COD)**, COD tự tính (BR-pos-02). |
| FR-pos-011 | Khi Lưu, validate: COD ≤ hạn mức (BR-pos-04), địa chỉ trong vùng Grab phục vụ (BR-web-03), có kết nối Grab. Không đạt → cảnh báo tương ứng và **không chuyển trạng thái**. |
| FR-pos-012 | Lưu thành công → đơn ở trạng thái **Chờ gửi đối tác**, xuất hiện ở tab **Giao hàng** của danh sách order. |

### 4.3 Gửi đơn sang Grab Express (đủ nhánh lỗi)
| ID | Yêu cầu |
|---|---|
| FR-pos-020 | Nút **Gửi đơn hàng** (ở trạng thái Chờ gửi đối tác) → hiển thị màn Hóa đơn giao hàng với thông tin sẽ gửi sang Grab → kiểm tra kết nối → gửi vận đơn. |
| FR-pos-021 | **Chống double-send**: khóa nút ngay khi bấm; nếu đơn đã ở *Chờ giao hàng* trở đi thì từ chối gửi lần 2 ("Đơn đã được gửi"). Hệ thống dùng khóa chống tạo trùng vận đơn khi mạng chập chờn. |
| FR-pos-022 | Re-validate COD ≤ hạn mức + vùng phủ ngay trước khi gửi (phòng khi đơn bị sửa sau khi Lưu). |
| FR-pos-023 | **Gửi thành công** → đơn chuyển **Chờ giao hàng**, lưu **Mã vận đơn**, GE = ALLOCATING. |
| FR-pos-024 | **Gửi lỗi do dữ liệu (sai thông tin/ngoài vùng)** → giữ đơn ở *Chờ gửi đối tác*, hiện thông báo lỗi từ Grab để thu ngân sửa rồi gửi lại (E-grab-express-002). |
| FR-pos-025 | **Gửi lỗi tạm thời (Grab lỗi / quá hạn / mất mạng)** → giữ đơn ở *Chờ gửi đối tác*, báo E-grab-express-003 "Không thể gửi đơn, thử lại sau"; hệ thống tự kiểm tra lại trạng thái trước khi mở nút gửi lại. |

### 4.4 Đồng bộ trạng thái giao hàng (Hybrid auto-sync)
| ID | Yêu cầu |
|---|---|
| FR-pos-030 | Hệ thống nhận cập nhật trạng thái từ Grab và **tự đồng bộ** trạng thái giao của đơn CukCuk (NT-02). |
| FR-pos-031 | Khi tài xế **đã lấy hàng** (GE = PICKING_UP) → đơn **tự chuyển** Chờ giao hàng → **Đang giao hàng**. **Không còn nút "Giao hàng" thủ công** cho đơn Grab Express. |
| FR-pos-032 | Khi Grab **giao xong** (GE = COMPLETED) → hiện banner **"Chờ thu tiền"**; đơn **không tự đóng**. |
| FR-pos-033 | Mọi thay đổi trạng thái sinh **thông báo** và **đồng bộ trên mọi thiết bị cùng chi nhánh** (NT-06). Thông báo ưu tiên thiết bị tạo đơn. |
| FR-pos-034 | **Dự phòng**: nếu không nhận được cập nhật từ Grab, hệ thống tự hỏi lại Grab định kỳ để không kẹt trạng thái (NT-05). |

### 4.5 Thu tiền (gate theo trạng thái giao)
| ID | Yêu cầu |
|---|---|
| FR-pos-040 | Nút **Thu tiền** chỉ **mở khi Grab đã giao xong** (GE = COMPLETED). Bấm khi chưa giao xong → chặn, báo E-grab-express-004 "Đơn chưa giao xong, chưa thể thu tiền." |
| FR-pos-041 | Bấm Thu tiền → mở màn thu tiền, xác nhận → đơn đóng sang **Đã thanh toán**. Áp dụng cho cả đơn **COD = 0** (mở màn thu tiền, còn phải thu = 0, xác nhận để đóng đơn) — đồng nhất với nhà hàng tự giao. |
| BR-pos-05 | **Không bao giờ tự đóng** "Đã thanh toán" — luôn cần thu ngân xác nhận (NT-03). |

### 4.6 Xử lý trạng thái kết thúc xấu (Hủy / Thất bại / Hoàn hàng)
| ID | Yêu cầu |
|---|---|
| FR-pos-050 | Grab trả **CANCELED / FAILED** (chưa giao được, món còn ở quán) → đơn **tự mở lại về Chờ gửi đối tác** (xóa Mã vận đơn/GE cũ) + gắn **cờ đỏ** + thông báo. |
| FR-pos-051 | Grab trả **RETURNED** (đã lấy hàng rồi hoàn về quán, món có thể hỏng) → **nhắc thu ngân** chọn cách xử lý; không tự mở lại. |
| FR-pos-052 | Sau khi cờ/nhắc, thu ngân chọn: **Gửi lại / đổi đối tác** (đơn quay lại Chờ gửi đối tác, dùng lại đơn cũ, không tạo hóa đơn trùng) hoặc **Hủy đơn**. |
| FR-pos-053 | Nút **Hủy** chỉ gọi hủy vận đơn sang Grab khi GE còn cho hủy (ALLOCATING / PENDING_PICKUP / PICKING_UP); quá trạng thái đó thì Hủy chỉ xử lý phía CukCuk. |
| FR-pos-054 | **[Giả định — cần Grab/Kế toán chốt]** Nếu tài xế đã ứng tiền COD lúc lấy hàng mà đơn RETURNED/FAILED → quán hoàn khoản ứng cho tài xế; đơn không đóng "Đã thanh toán". Cơ chế hoàn thực tế: xem Mục 8 (OQ-01). |

### 4.7 Danh sách order — tab Giao hàng
| ID | Yêu cầu |
|---|---|
| FR-pos-060 | Danh sách order có các tab: Tất cả / Tại bàn / Mang về / **Giao hàng** / Xác nhận đơn online (kèm số đếm), search + lọc trạng thái + Tổng order/tiền, **2 dạng xem Card ⟷ List**. |
| FR-pos-061 | Tab **Giao hàng** có thêm bộ lọc: **Trạng thái giao** (Chờ giao / Đang giao / Đã hoàn thành / Đã hủy), **Đối tác**, **Nguồn đơn**. |
| FR-pos-062 | Đơn Grab Express hiển thị chip *Grab Express* + trạng thái CukCuk + pill trạng thái GE; nút theo trạng thái: *Chờ gửi đối tác* → **Gửi đơn hàng / Hủy**; *Chờ giao hàng* & *Đang giao hàng* → **Hủy** (đơn tự tiến trạng thái giao, không có nút Giao hàng); *COMPLETED* → **Thu tiền / Hủy**; *Đã thanh toán* → hết nút. |

### 4.8 Xác nhận đơn online
| ID | Yêu cầu |
|---|---|
| FR-pos-070 | Đơn từ Website/App vào tab **Xác nhận đơn online** → panel 2 tab: **Thông tin đơn hàng** / **Đối tác giao hàng**. |
| FR-pos-071 | Ở tab Đối tác chọn **Grab Express** → hiện Loại dịch vụ (khóa), Phí GH trả đối tác, Phí GH thu khách + cảnh báo nếu địa chỉ ngoài vùng phục vụ. |
| FR-pos-072 | Footer: **Từ chối / Xác nhận & Giao hàng / Xác nhận** → tạo đơn **Chờ gửi đối tác** sang tab Giao hàng. |

### 4.9 Sổ giao hàng — theo dõi giao Grab Express
| ID | Yêu cầu |
|---|---|
| FR-pos-080 | Tab **Grab Express** (cạnh Nhà hàng tự giao / AhaMove). |
| FR-pos-081 | Bộ lọc: khoảng ngày · Trạng thái CukCuk · **Trạng thái GE** (10 trạng thái) · tìm theo Mã vận đơn / Số HĐ / khách hàng. |
| FR-pos-082 | Lưới cột: Mã vận đơn/Số HĐ · Khách hàng (tên + địa chỉ) · Giờ hẹn trả · Phí thu khách · Phí trả đối tác · Tổng tiền · Trạng thái GE. |
| FR-pos-083 | Thao tác theo trạng thái CukCuk (như FR-pos-062). |
| FR-pos-084 | Khi Grab cập nhật trạng thái → sinh thông báo đúng format: *"Đơn hàng ‹Số HĐ/Order› (Mã vận đơn) của khách hàng ‹tên› đã được Grab Express cập nhật trạng thái ‹trạng thái›"*; click mở đúng dòng đơn. |

---

## 5. Báo cáo (liên quan cả 2 phân hệ)
| ID | Yêu cầu |
|---|---|
| FR-rep-001 | **Bảng kê hóa đơn**: cột Đối tác giao hàng hiển thị "Grab Express" cho đơn tương ứng. |
| FR-rep-002 | **Doanh thu theo đối tác**: có dòng Grab Express và chi tiết. |

---

## 6. Mã lỗi & thông báo (tổng hợp)
| Mã | Tình huống | Wording/Hành vi |
|---|---|---|
| E-grab-express-001 | Không lấy được báo giá | Chặn Lưu đơn GE + "Không lấy được phí giao hàng, thử lại" |
| E-grab-express-002 | Gửi đơn lỗi dữ liệu | Hiện message Grab; giữ Chờ gửi đối tác; sửa rồi gửi lại |
| E-grab-express-003 | Gửi đơn lỗi tạm thời | "Không thể gửi đơn, thử lại sau"; giữ Chờ gửi đối tác |
| E-grab-express-004 | Thu tiền khi chưa giao xong | Chặn + "Đơn chưa giao xong, chưa thể thu tiền" |
| E-grab-express-005 | Ngoài vùng Grab phục vụ | Cảnh báo Grab chưa hỗ trợ khu vực |
| E-grab-express-006 | COD vượt hạn mức | "Chọn đối tác giao hàng khác" |
| E-grab-express-007 | Email VAT sai định dạng | "Email chưa đúng định dạng…" |
| E-grab-express-008 | Trường bắt buộc trống | "Trường này không được để trống." |
| E-grab-express-009 | Không đủ số dư ví/hạn mức công nợ | Cảnh báo khi gửi đơn — **[TODO, phụ thuộc mô hình ví, Mục 8]** |

---

## 7. Ràng buộc & giả định
| ID | Nội dung |
|---|---|
| RB-01 | Web quản lý + POS luôn online (không xét offline). |
| RB-02 | Xác thực Grab ở cấp đối tác MISA (1 credential dùng chung), cửa hàng là người gửi *(còn treo mô hình ví — Mục 8)*. |
| GĐ-01 | COD theo mô hình tài xế **ứng tiền lúc lấy hàng** — cần Grab/Kế toán xác nhận cơ chế hoàn (OQ-01). |
| GĐ-02 | "Siêu tốc - Thực phẩm" ánh xạ sang gói giao nhanh (INSTANT) của Grab. |

---

## 8. Câu hỏi mở / phụ thuộc (cần chốt trước khi dev phần liên quan)
| ID | Câu hỏi | Hỏi ai |
|---|---|---|
| OQ-01 | Cơ chế hoàn tiền ứng COD khi RETURNED/FAILED: tay-trao-tay tại quán hay qua ví/đối soát (~7 ngày)? | Grab · Kế toán |
| OQ-02 | Grab có API trả hạn mức COD theo merchant không? Nếu không, chốt fallback 2tr. | Grab · Dev |
| OQ-03 | Danh sách trạng thái/tên chính xác của Grab (verify qua sandbox trước khi dựng bảng map). | Grab · Dev |
| OQ-04 | Mô hình ví/thanh toán phí ship (aggregator hay per-merchant; MISA thu lại phí thế nào)? Ảnh hưởng E-009 và có cần màn Nạp quỹ/Số dư không. | PO · Grab · Kế toán |
| OQ-05 | Đơn Website/Haravan khác gì luồng POS (có cần luồng riêng)? | PO |
| OQ-06 | Đổi "Grab" → "Grab Food": hiển thị đơn/lịch sử cũ tạo bằng tên "Grab" thế nào? | PO |

> Chi tiết đầy đủ các câu hỏi nền tảng: `CAU-HOI-CAN-LAM-RO.md`.

---

## 9. Thuật ngữ
| Thuật ngữ | Nghĩa |
|---|---|
| GE | Grab Express |
| Vận đơn / Mã vận đơn | Mã đơn giao do Grab tạo khi nhận đơn |
| COD | Tiền thu hộ = Còn phải thu (tài xế thu của khách) |
| Phí GH trả đối tác | Phí giao hàng MISA/nhà hàng trả cho Grab (khóa, từ báo giá) |
| Phí GH thu khách | Phí giao hàng thu của khách (sửa được) |
| Chờ gửi đối tác / Chờ giao hàng / Đang giao hàng / Đã thanh toán | 4 trạng thái đơn phía CukCuk |
| Hybrid auto-sync | Tự đồng bộ bước giao từ Grab, gate thủ công bước thu tiền |

---

## 10. Tài liệu liên quan
- Sequence flow chi tiết: `srs/grab-express-flows.md`
- Sơ đồ BPMN luồng bước người dùng: `bpmn/grab-express-flow.bpmn` (+ editor html)
- Spec rule & mã lỗi đầy đủ (BR-001..018): `srs/grab-express-flow-spec.md`
- State machine trạng thái GE: `srs/grab-express-states.md` *(cần cập nhật theo Hybrid — xem ghi chú)*
- Câu hỏi cần làm rõ: `CAU-HOI-CAN-LAM-RO.md`
