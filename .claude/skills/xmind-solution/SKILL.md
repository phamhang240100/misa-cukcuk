---
name: xmind-solution
description: Dựng file XMind mô tả giải pháp/nghiệp vụ chi tiết (mindmap logic chạy sang phải) từ Specs, Google Docs, ảnh/file XMind cũ, hoặc mô tả tự do của BA. Đối chiếu nhiều nguồn, dừng hỏi BA khi có mâu thuẫn, viết bằng từ ngữ nghiệp vụ thuần Việt (không tên API/endpoint). Trigger khi BA nói "dựng xmind giải pháp", "tạo/vẽ xmind nghiệp vụ", "clone xmind theo luồng mới", "update xmind", hoặc /xmind-solution.
---

# xmind-solution — Dựng XMind giải pháp nghiệp vụ

Tạo file `.xmind` mô tả giải pháp/nghiệp vụ **chi tiết đầy đủ**, bố cục logic chạy sang phải, từ ngữ **thuần Việt cho BA/PO/dev đọc** (không phải doc kỹ thuật). Kết quả mở trực tiếp bằng XMind.

Kèm skill này: `glossary.md` (từ điển từ ngữ — BẮT BUỘC theo), `xmind_builder.py` (bộ sinh file + lint), `templates/change-record.md`.

## Khi nào chạy
BA muốn: dựng XMind giải pháp mới · clone/cập nhật XMind theo luồng mới · chuyển Specs/Docs thành XMind · sửa cấu trúc/từ ngữ một XMind sẵn có.

## Quy trình (7 bước)

### 1. Đọc nguồn
Nhận 1 hoặc nhiều nguồn:
- **Specs markdown trong repo** — đọc trực tiếp.
- **Google Docs** — WebFetch FAIL với Google Docs. Dùng `gws docs documents get --params '{"documentId":"<ID>"}'` qua Bash (không qua Skill tool), rồi trích text (paragraph + table). Xem [[gws-cli-google-docs]].
- **Ảnh chụp / file XMind cũ** — đọc kỹ từng ảnh (có thể là nhiều lát cắt của 1 sơ đồ lớn → ghép lại). Đánh dấu `[...]` chỗ ảnh cắt/mờ, KHÔNG bịa.
- **Mô tả tự do của BA** — cấu trúc hóa thành cây.
- BPMN/canvas (vd Camunda share): WebFetch thường trả rỗng — nói rõ với BA là không đọc được, đừng lặng lẽ bỏ.

Nguyên tắc: **đừng tin tuyệt đối ảnh "UI cũ"; đối chiếu nguồn chính thức hiện tại**, gắn nhãn xuất xứ. Xem [[cukcuk-verify-over-provided-files]].

### 2. Đối chiếu — mâu thuẫn thì DỪNG, hỏi BA
So các nguồn với nhau **và** với tài liệu/XMind hiện có. Phân loại vấn đề:
- **A.** Nguồn mới ↔ tài liệu cũ khác nhau.
- **B.** Mâu thuẫn nội bộ tài liệu cũ (lộ ra khi đối chiếu).
- **C.** Các nguồn mới mâu thuẫn nhau.
- **D.** Thiếu / chưa rõ.

Với mọi mâu thuẫn ảnh hưởng cấu trúc/nghiệp vụ: **DỪNG, dùng `AskUserQuestion` hỏi BA chốt trước khi dựng.** Không tự đoán. (Riêng lỗi rõ ràng theo nguồn chuẩn + BA đã xác nhận thì sửa, chỉ báo lại.)

> Lưu ý `AskUserQuestion`: truyền tham số `questions` dạng JSON hợp lệ (không escape `\u` thủ công, không backslash thừa) — nếu không sẽ lỗi parse.

### 3. Cấu trúc — mặc định theo NỀN TẢNG
Nhánh cấp 1 mặc định (điều chỉnh theo dự án):
- **Web BE (Web quản lý)** — thiết lập, kết nối đối tác, phân quyền.
- **POS (PC / Tablet / Mobile)** — lập đơn, các màn hình bán hàng, sổ giao hàng, thông báo.
- **Ảnh hưởng** — đổi tên ứng dụng, báo cáo, tác động khác.

Nếu nguồn tổ chức theo cách khác rõ ràng thì bám nguồn, nhưng ưu tiên gom theo nền tảng. **Bảng mapping trạng thái = 1 nhánh riêng** (mỗi dòng: `MÃ — Nghĩa Việt → trạng thái CukCuk | Nút: ...`).

### 4. Viết từ ngữ — theo `glossary.md`, rồi CHẠY LINT
- Đọc và áp `glossary.md`: thuần Việt; bỏ API/endpoint; "không cho chỉnh sửa" (không "khóa"); "mờ đi, không bấm được" (không "disabled"); "đẩy đơn sang đối tác" (không "POST"); "tự động chuyển" (không "auto-sync").
- **Giữ mã trạng thái Grab kèm nghĩa Việt**: `PENDING_DROP_OFF — Đã lấy hàng`.
- Câu điều kiện dạng **"Nếu … thì …"** / **"Khi … → …"**. Chính xác – rõ ràng – ngắn gọn – đầy đủ.
- Sau khi dựng cây (trong Python), `build_xmind()` tự chạy `lint()` và IN CẢNH BÁO các chỗ nghi lai kỹ thuật. **Phải xử lý hết cảnh báo** (sửa từ hoặc xác nhận là whitelist) trước khi giao BA.

### 5. Độ chi tiết — ĐẦY ĐỦ
Mô tả từng điều kiện, cảnh báo, và **nút theo trạng thái** (ma trận nút: trạng thái nào hiện nút gì, nút nào mờ). Sâu 5–6 cấp như bản tham khảo. Không cắt bớt nhánh lá quan trọng.

### 6. Dựng file + change-record
- Dùng `xmind_builder.py`: `from xmind_builder import T, build_xmind`. Cây lồng bằng `T(title, [con...])`, gọi `build_xmind(root, out_path)`.
- **Đặt tên & giữ bản cũ:** khi clone/cập nhật, ghi ra file MỚI (vd `... (luồng mới).xmind`), **giữ nguyên file cũ để so sánh**. Không ghi đè bản cũ.
- **Change-record:** khi clone/cập nhật (đối chiếu ≥2 nguồn hoặc sửa từ bản cũ) → viết 1 file theo `templates/change-record.md` (vấn đề A/B/C/D + quyết định + file sửa). Dựng mới hoàn toàn thì không cần.
- Nếu sửa Specs kèm theo: sửa đúng dòng, đánh dấu `*(sửa <ngày>)*`, và grep xác nhận không còn tàn dư mâu thuẫn.

### 7. Review — mở bằng XMind
Mở file cho BA xem: `open "<đường dẫn>.xmind"`. Nếu XMind báo lỗi định dạng (bản cũ kén `content.json`) → chuyển sang định dạng `content.xml` (XMind 8). Tóm tắt cây cấp 1–2 + các điểm đã đổi, rồi **lặp** theo phản hồi BA.

## Định dạng kỹ thuật (đã lo trong xmind_builder.py)
File `.xmind` = zip gồm `content.json` + `metadata.json` + `manifest.json`; `rootTopic.structureClass = org.xmind.ui.logic.right` (chạy sang phải). Không cần nhớ chi tiết — chỉ dùng `T()` + `build_xmind()`.

## Checklist trước khi giao BA
- [ ] Đã đối chiếu nguồn; mâu thuẫn đã hỏi BA chốt (không tự đoán).
- [ ] Nhánh cấp 1 theo nền tảng (Web BE / POS / Ảnh hưởng) hoặc theo nguồn.
- [ ] Bảng mapping trạng thái là 1 nhánh riêng, mã Grab kèm nghĩa Việt.
- [ ] **Lint sạch** (không lọt API/endpoint/jargon; đã áp glossary).
- [ ] Chi tiết đầy đủ, có ma trận nút theo trạng thái.
- [ ] Giữ file cũ; có change-record nếu clone/cập nhật.
- [ ] Mở được bằng XMind.
