# Kế hoạch BPMN (bản duyệt v2) — ngôn ngữ nghiệp vụ, thuần Việt

> Để **duyệt trước khi vẽ**. Nguyên tắc: mỗi sơ đồ = 1 câu chuyện đầu–cuối; **chữ thuần Việt** (bỏ webhook/order.update/reason 79…); các **mốc in phiếu** được vẽ rõ thành bước.

---

## NHÓM A — Kết nối, Thực đơn & Thiết lập

### A1. Kết nối cửa hàng với ShopeeFood
- **Bắt đầu:** Chủ quán bấm "Kết nối ShopeeFood".
- **Diễn biến:** Hiện mã QR → chủ quán quét, đăng nhập tài khoản ShopeeFood → xác nhận → kết nối xong, hiện tên quán.
- **Ngã rẽ:** Chưa có gian hàng trên ShopeeFood / quét nhầm quán / mã hết hạn → báo và làm lại.
- **Kết thúc:** *Đã kết nối* · *Chưa kết nối được*.

### A2. Đưa thực đơn lên ShopeeFood  ⭐ vẽ rõ cả 2 nhánh
- **Bắt đầu:** Vừa kết nối xong → hỏi **"Quán đã có thực đơn trên ShopeeFood chưa?"**
- **Nhánh 1 — ĐÃ CÓ thực đơn trên ShopeeFood:**
  - Lấy danh sách món đang có trên ShopeeFood về để đối chiếu → hệ **tự gợi ý ghép** món trùng tên → chủ quán xử lý 3 trường hợp:
    - Món có ở **cả hai bên** → xác nhận ghép cặp.
    - Món **chỉ có ở quán** → chọn đẩy lên (tạo mới trên ShopeeFood).
    - Món **chỉ có trên ShopeeFood** → tạo món đó trong thực đơn quán rồi ghép.
  - Ghép cả **nhóm món & nhóm tùy chọn (topping)** → đẩy thực đơn lên.
- **Nhánh 2 — CHƯA CÓ thực đơn trên ShopeeFood:**
  - Hiện thực đơn trống → chủ quán **chọn món từ thực đơn quán** để bán → đẩy lên (tạo mới toàn bộ).
- **Kết thúc:** *Thực đơn đã lên ShopeeFood* (hiện kết quả: bao nhiêu món thành công / lỗi).

### A3. Cập nhật thực đơn & tạm ngừng bán (thay đổi hằng ngày)
- **Bắt đầu:** Quán muốn thay đổi sau khi đã bán.
- **Ngã rẽ:** Sửa món/giá → đẩy lên · Hết một món → tắt món · Hết nguyên liệu/nghỉ đột xuất → **tạm ngừng nhận đơn ngay** · Đổi giờ mở–đóng cửa.
- **Kết thúc:** *ShopeeFood đã cập nhật*.

### A4. Thiết lập tùy chọn bán hàng (CẤU HÌNH)  ⭐ MỚI — chỗ cấu hình
- **Bắt đầu:** Chủ quán mở màn Thiết lập (bất cứ lúc nào sau kết nối).
- **Diễn biến (đặt từng mục rồi lưu):**
  - **Giờ mở–đóng cửa** (tối đa 3 khung/ngày) + **ngày nghỉ lễ**.
  - **Tự động xác nhận đơn:** Tắt (nhân viên tự bấm) / Bật cho **tất cả đơn** / Bật **chỉ đơn đã thanh toán**; kèm *tự xác nhận sau 2 phút*.
  - **Tự động in tạm tính:** khi xác nhận / khi gửi bếp / tắt.
  - **In phiếu bàn giao cho tài xế:** bật / tắt.
- **Kết thúc:** *Đã lưu thiết lập — áp dụng cho các đơn sau*.

---

## NHÓM B — Bán hàng (xử lý đơn) — có vẽ rõ MỐC IN PHIẾU

### B1. Nhận & xác nhận đơn
- **Bắt đầu:** Có đơn mới từ ShopeeFood.
- **Diễn biến:** Chuông báo + nhấp nháy (không sót đơn) → nhân viên mở đơn, xem món → **Xác nhận** (hoặc hệ **tự xác nhận sau 2 phút** nếu bật) → [🖨 nếu bật: **in tạm tính**] → chuyển làm món.
- **Ngã rẽ:** Xác nhận / Từ chối (lý do: hết món, quá tải, đóng cửa) / Để quá lâu → ShopeeFood tự hủy.
- **Kết thúc:** *Đã xác nhận (sang làm món)* · *Đơn bị từ chối*.

### B2. Làm món → Giao hàng → Hoàn thành
- **Bắt đầu:** Đơn đã xác nhận.
- **Diễn biến:** [🖨 **in tem chế biến (bếp/bar)**] Gửi bếp → Báo món đã xong → Tài xế tới lấy, đối chiếu **mã đơn rút gọn** + món [🖨 nếu bật: **in phiếu bàn giao**] → Giao cho khách → ShopeeFood báo đã giao → [🖨 **in hóa đơn / hóa đơn điện tử**] Ghi nhận doanh thu + xem **tiền ShopeeFood trả về** (chờ đối soát → đã nhận).
- **Ngã rẽ:** **Khách tự đến lấy** (không qua tài xế — đối chiếu mã với khách) / **Hết món khi đang làm** → báo khách → hủy.
- **Kết thúc:** *Đơn hoàn thành* · *Đơn hủy do hết món*.

### B3. Hủy đơn (theo thời điểm)
- **Bắt đầu:** Có yêu cầu hủy (quán / khách / ShopeeFood).
- **Ngã rẽ chính:** **Tài xế đã lấy hàng chưa?**
  - *Chưa lấy* → cho hủy; nếu **bếp đã in tem** → [🖨 **in phiếu báo hủy cho bếp**].
  - *Đã lấy* → không cho hủy, báo nhân viên.
- **Kết thúc:** *Đơn chuyển sang mục Hủy* · *Không hủy được (tài xế đã lấy)*.

---

## Các mốc IN PHIẾU (tổng hợp — đều nằm trong sơ đồ)
| Phiếu | In khi nào | Ở luồng |
|---|---|---|
| Tem chế biến (bếp/bar) | Khi xác nhận / gửi bếp | B2 |
| Hóa đơn tạm tính | Nếu bật (khi xác nhận / khi gửi bếp) | A4 bật → B1/B2 |
| Phiếu bàn giao (mã rút gọn + món) | Khi bàn giao tài xế (nếu bật) | B2 |
| Hóa đơn / hóa đơn điện tử | Khi đơn hoàn thành | B2 |
| Phiếu báo hủy cho bếp | Khi hủy mà bếp đã in tem | B3 |

## Chốt danh sách vẽ: A1, A2, A3, A4, B1, B2, B3 (7 sơ đồ) — bỏ nhóm C.
