#!/usr/bin/env bash
# svg2png.sh — rasterize .svg → .png ở độ nét cao bằng Chrome headless.
#
# Vì sao cần: PNG lấy trực tiếp từ plantuml.com bị chặn ở 4096px (biến PLANTUML_LIMIT_SIZE)
# → sơ đồ rộng bị CẮT chứ không phải thu nhỏ. Render .svg rồi tự rasterize thì không vướng.
#
#   ./svg2png.sh <file.svg> [scale]     scale mặc định = 3
#   ./svg2png.sh activity/*.svg
#
# Kích thước lấy tự động từ thuộc tính width/height trong file .svg.

set -euo pipefail
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "❌ Không thấy Google Chrome tại $CHROME"; exit 1; }

SCALE=3
ARGS=()
for x in "$@"; do
  if [[ "$x" =~ ^[0-9]+$ ]]; then SCALE="$x"; else ARGS+=("$x"); fi
done
[ ${#ARGS[@]} -gt 0 ] || { echo "Cách dùng: ./svg2png.sh <file.svg> [scale]"; exit 1; }

for SRC in "${ARGS[@]}"; do
  [ -f "$SRC" ] || { echo "⚠️  Bỏ qua, không thấy file: $SRC"; continue; }
  ABS="$(cd "$(dirname "$SRC")" && pwd)/$(basename "$SRC")"
  PNG="${ABS%.svg}.png"

  read -r W H < <(python3 - "$ABS" <<'PY'
import re, sys, math
s = open(sys.argv[1], encoding='utf-8').read(4000)
def px(attr):
    m = re.search(rf'\b{attr}\s*=\s*"([\d.]+)', s)
    return float(m.group(1)) if m else None
w, h = px('width'), px('height')
if not w or not h:                      # không có width/height → lấy từ viewBox
    m = re.search(r'viewBox\s*=\s*"[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"', s)
    w, h = float(m.group(1)), float(m.group(2))
print(math.ceil(w), math.ceil(h))
PY
)
  "$CHROME" --headless --disable-gpu --force-device-scale-factor="$SCALE" \
    --screenshot="$PNG" --window-size="$W,$H" \
    --default-background-color=FFFFFFFF --hide-scrollbars "file://$ABS" >/dev/null 2>&1

  python3 - "$PNG" "$W" "$H" "$SCALE" <<'PY'
import struct, sys, os
p = sys.argv[1]
d = open(p, 'rb').read(33)
w, h = struct.unpack('>II', d[16:24])
print(f"✅ {os.path.basename(p)}  {w}x{h}px  ({os.path.getsize(p)//1024}KB, scale x{sys.argv[4]})")
PY
done
