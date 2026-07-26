#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sinh SVG 'Bản đồ điểm chạm toàn trình — CukCuk x ShopeeFood'.
Layout tự tính: chiều cao mỗi làn = theo nội dung chip dài nhất trong làn."""
import html, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "touchpoint-map.svg"

# ---------- cấu hình khung ----------
M = 24                 # lề
LABEL_W = 176          # cột tên vai
BAND_GAP = 12
N_BANDS = 4
BAND_W = 396
W = M + LABEL_W + 10 + N_BANDS * BAND_W + (N_BANDS - 1) * BAND_GAP + M

TITLE_H = 64
HEAD_H = 54
LANE_GAP = 10
CHIP_PAD_X = 11
CHIP_PAD_Y = 9
CHIP_GAP = 8
LINE_H = 17
FS = 12.6

BANDS = [
    ("①  KẾT NỐI", "Làm 1 lần", "#4C6EF5", "#EDF0FE"),
    ("②  THỰC ĐƠN", "Thiết lập & thay đổi", "#0CA678", "#E7F7F1"),
    ("③  XỬ LÝ ĐƠN", "Hằng ngày — trọng tâm", "#E8590C", "#FDF0E6"),
    ("④  ĐỐI SOÁT & BÁO CÁO", "Cuối ca / định kỳ", "#7048E8", "#F1ECFD"),
]

LANES = [
    ("Khách hàng", "trên app ShopeeFood"),
    ("Chủ quán", "web CukCuk"),
    ("Nhân viên POS", "máy bán hàng"),
    ("Bếp / Bar", "tem chế biến"),
    ("Tài xế", "điểm bàn giao"),
]

N, S, W_ = "normal", "star", "warn"

# CELLS[(lane_idx, band_idx)] = [(text, kind), ...]
CELLS = {
    (0, 2): [("Đặt món & trả tiền trên app ShopeeFood — quán không thu tiền của khách", N),
             ("Nhận hàng → đơn TỰ chuyển Hoàn thành, nhân viên không phải nhớ bấm", S)],

    (1, 0): [("Bấm Kết nối → quét QR bằng Shopee Partner App → xong", N),
             ("Không phải nhập bất kỳ mã kỹ thuật nào", S)],
    (1, 1): [("Duyệt các cặp món hệ thống TỰ khớp tên (~80%) — chỉ sửa chỗ chưa khớp", S),
             ("Đặt giá bán Shopee, giờ mở/đóng cửa, ngày lễ", N),
             ("Tạm ngưng bán TỨC THÌ khi hết nguyên liệu — không đợi đến giờ đóng cửa", S),
             ("Món chưa ghép nối sẽ bị XOÁ trên Shopee khi đồng bộ toàn bộ → bắt buộc ghép trước, cảnh báo đỏ", W_)],
    (1, 3): [("Tiền quán THỰC NHẬN (đã trừ hoa hồng, thuế, KM quán tài trợ)", N),
             ("Hiệu suất kênh ShopeeFood từ khi kết nối", N)],

    (2, 2): [("Đơn về: chuông + nhấp nháy tab LIÊN TỤC đến khi có người xử lý — đứng xa PC vẫn biết", S),
             ("Xác nhận thủ công, hoặc đếm ngược TỰ xác nhận sau ~2 phút", S),
             ("Từ chối / báo hết món / báo trễ — có lý do sẵn, một chạm", N),
             ("KHÔNG còn màn tính tiền. Chỉ hiển thị: Khách trả Shopee X · Quán thực nhận Y · trạng thái đối soát", S)],
    (2, 3): [("Biên bản bàn giao ca trong ngày", N)],

    (3, 2): [("Tem bếp TỰ IN ngay khi đơn được xác nhận — không ai phải bấm thêm", S),
             ("Đơn bị huỷ sau khi đã gửi bếp → TỰ in phiếu báo huỷ để bếp dừng nấu", S)],

    (4, 2): [("Đến lấy hàng — đối chiếu MÃ RÚT GỌN 4–6 ký tự cỡ lớn + danh sách món", S),
             ("Từ thời điểm tài xế lấy hàng: KHOÁ nút Huỷ đơn", W_)],
}

# ---------- wrap text ----------
WIDE = set("MWmwĐƯỠ")
def cw(ch):
    if ch in WIDE: return FS * 0.86
    if ch in "iljI.,:;|!'’ ": return FS * 0.33
    if ch.isupper(): return FS * 0.68
    return FS * 0.56

def wrap(text, maxw):
    lines, cur, curw = [], [], 0.0
    for word in text.split(" "):
        ww = sum(cw(c) for c in word) + cw(" ")
        if cur and curw + ww > maxw:
            lines.append(" ".join(cur)); cur, curw = [word], ww
        else:
            cur.append(word); curw += ww
    if cur: lines.append(" ".join(cur))
    return lines

CHIP_TEXT_W = BAND_W - 2 * 10 - 2 * CHIP_PAD_X - 16   # 16 = chỗ cho badge ★/⚠

def chip_lines(text, kind):
    extra = 16 if kind in (S, W_) else 0
    return wrap(text, BAND_W - 20 - 2 * CHIP_PAD_X - extra)

def chip_h(text, kind):
    return len(chip_lines(text, kind)) * LINE_H + 2 * CHIP_PAD_Y

# ---------- tính chiều cao làn ----------
lane_h = []
for li in range(len(LANES)):
    h = 54
    for bi in range(N_BANDS):
        chips = CELLS.get((li, bi), [])
        if not chips: continue
        tot = sum(chip_h(t, k) for t, k in chips) + CHIP_GAP * (len(chips) - 1) + 20
        h = max(h, tot)
    lane_h.append(h)

lane_y, y = [], TITLE_H + HEAD_H + 12
for h in lane_h:
    lane_y.append(y); y += h + LANE_GAP
LEGEND_Y = y + 4
H = LEGEND_Y + 46 + M

band_x = [M + LABEL_W + 10 + i * (BAND_W + BAND_GAP) for i in range(N_BANDS)]

# ---------- vẽ ----------
o = []
a = o.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif">')
a(f'<rect width="{W}" height="{H}" fill="#ffffff"/>')
a(f'<text x="{M}" y="34" font-size="21" font-weight="700" fill="#1A1A1A">Bản đồ điểm chạm toàn trình — CukCuk ↔ ShopeeFood</text>')
a(f'<text x="{M}" y="53" font-size="12.5" fill="#666">Ai chạm vào · chạm ở đâu · trải nghiệm thay đổi thế nào</text>')

# header 4 chặng
for i, (t, sub, col, light) in enumerate(BANDS):
    x = band_x[i]
    a(f'<rect x="{x}" y="{TITLE_H}" width="{BAND_W}" height="{HEAD_H}" rx="7" fill="{col}"/>')
    a(f'<text x="{x + BAND_W/2:.0f}" y="{TITLE_H + 23}" font-size="14.5" font-weight="700" fill="#fff" text-anchor="middle">{html.escape(t)}</text>')
    a(f'<text x="{x + BAND_W/2:.0f}" y="{TITLE_H + 41}" font-size="11.5" fill="#ffffff" fill-opacity="0.88" text-anchor="middle">{html.escape(sub)}</text>')

# nền cột chặng chạy suốt các làn
top = TITLE_H + HEAD_H + 12
bot = lane_y[-1] + lane_h[-1]
for i, (_, _, col, light) in enumerate(BANDS):
    a(f'<rect x="{band_x[i]}" y="{top}" width="{BAND_W}" height="{bot - top}" rx="7" fill="{light}" fill-opacity="0.55"/>')

# làn
for li, (name, sub) in enumerate(LANES):
    ly, lh = lane_y[li], lane_h[li]
    a(f'<rect x="{M}" y="{ly}" width="{LABEL_W}" height="{lh}" rx="7" fill="#F1F3F5" stroke="#DEE2E6"/>')
    a(f'<text x="{M + 14}" y="{ly + lh/2 - 3:.0f}" font-size="13.6" font-weight="700" fill="#212529">{html.escape(name)}</text>')
    a(f'<text x="{M + 14}" y="{ly + lh/2 + 14:.0f}" font-size="11" fill="#868E96">{html.escape(sub)}</text>')
    if li < len(LANES) - 1:
        yy = ly + lh + LANE_GAP / 2
        a(f'<line x1="{M}" y1="{yy}" x2="{W - M}" y2="{yy}" stroke="#E9ECEF" stroke-width="1"/>')

    for bi in range(N_BANDS):
        chips = CELLS.get((li, bi), [])
        if not chips: continue
        col = BANDS[bi][2]
        cx = band_x[bi] + 10
        cw_ = BAND_W - 20
        cy = ly + 10
        for text, kind in chips:
            lines = chip_lines(text, kind)
            ch = len(lines) * LINE_H + 2 * CHIP_PAD_Y
            if kind == W_:
                fill, stroke, tcol = "#FFF4F4", "#E03131", "#A61E1E"
            elif kind == S:
                fill, stroke, tcol = "#FFFFFF", col, "#212529"
            else:
                fill, stroke, tcol = "#FFFFFF", "#CED4DA", "#343A40"
            a(f'<rect x="{cx}" y="{cy}" width="{cw_}" height="{ch}" rx="6" fill="{fill}" stroke="{stroke}" stroke-width="{1.4 if kind in (S, W_) else 1}"/>')
            tx = cx + CHIP_PAD_X
            if kind in (S, W_):
                badge = "★" if kind == S else "⚠"
                bcol = col if kind == S else "#E03131"
                a(f'<text x="{tx}" y="{cy + CHIP_PAD_Y + 12.5}" font-size="12.5" fill="{bcol}">{badge}</text>')
                tx += 16
            for k, ln in enumerate(lines):
                a(f'<text x="{tx}" y="{cy + CHIP_PAD_Y + 12.5 + k * LINE_H}" font-size="{FS}" fill="{tcol}">{html.escape(ln)}</text>')
            cy += ch + CHIP_GAP

# legend
a(f'<rect x="{M}" y="{LEGEND_Y}" width="{W - 2*M}" height="40" rx="7" fill="#F8F9FA" stroke="#E9ECEF"/>')
a(f'<text x="{M + 14}" y="{LEGEND_Y + 25}" font-size="12.4" fill="#495057">'
  f'<tspan fill="#E8590C" font-size="13">★</tspan> điểm cải tiến trải nghiệm so với bản phác thảo ban đầu '
  f'&#160;&#160;&#160;<tspan fill="#E03131" font-size="13">⚠</tspan> ràng buộc bắt buộc phải tuân thủ (rủi ro nghiệp vụ)'
  f'&#160;&#160;&#160;—&#160; Chi tiết từng nhánh: sơ đồ swimlane từng luồng (phụ lục)</text>')
a('</svg>')

open(OUT, "w", encoding="utf-8").write("\n".join(o))
print(f"OK {OUT}  {W}x{H}")
