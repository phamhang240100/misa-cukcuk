#!/usr/bin/env python3
# Chèn đường ngăn + 2 nhãn giai đoạn (in hoa, in đậm) lên BPMN tổng quan.
# BPMN engine không hỗ trợ "group/giai đoạn" trong IR, nên đây là bước hậu-xử-lý ảnh.
# Cách dùng: đặt bản render SẠCH ở <clean> rồi chạy — xuất ra <out>.
#   python3 annotate-phases.py tong-quan-tich-hop.clean.png tong-quan-tich-hop.png
# Ranh giới 2 giai đoạn = DI y=1370 (giữa Task_hours bottom 1345 và Task_order top 1395).
import sys
from PIL import Image, ImageDraw, ImageFont

clean = sys.argv[1] if len(sys.argv) > 1 else "tong-quan-tich-hop.png"
out = sys.argv[2] if len(sys.argv) > 2 else "tong-quan-tich-hop.png"

im = Image.open(clean).convert("RGB")
d = ImageDraw.Draw(im)
# Map DI (pool 0..1630 x, 0..2720 y) -> px (4..4770 x, 4..2996 y) của render 4800x3000
sx = (4770 - 4) / 1630.0
sy = (2996 - 4) / 2720.0
def px(dx, dy): return (4 + dx * sx, 4 + dy * sy)
x0, y_div = px(0, 1370); x1, _ = px(1630, 1370)
y_div = int(y_div)
ACCENT = (21, 101, 192)  # xanh dương dịu
# đường kẻ ngăn mảnh, đứt nhẹ cho tinh tế
for xs in range(int(x0), int(x1), 44):
    d.line([(xs, y_div), (min(xs + 26, int(x1)), y_div)], fill=ACCENT, width=3)

fb = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
f = ImageFont.truetype(fb, 40)
def label(text, cy, above):
    tb = d.textbbox((0, 0), text, font=f); tw, th = tb[2] - tb[0], tb[3] - tb[1]
    padx, pady, r = 26, 16, 20
    x = 60
    top = cy - (th + 2 * pady) - 16 if above else cy + 16
    d.rounded_rectangle([x, top, x + tw + 2 * padx, top + th + 2 * pady], radius=r, fill=ACCENT)
    d.text((x + padx, top + pady - tb[1]), text, font=f, fill=(255, 255, 255))
label("GIAI ĐOẠN 1 · KẾT NỐI SHOPEEFOOD TRÊN WEB BE", y_div, above=True)
label("GIAI ĐOẠN 2 · XỬ LÝ ĐƠN TRÊN POS", y_div, above=False)
im.save(out)
print("saved", out)
