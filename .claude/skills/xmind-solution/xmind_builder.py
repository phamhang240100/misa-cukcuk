#!/usr/bin/env python3
"""
xmind_builder — dựng file .xmind giải pháp nghiệp vụ (định dạng XMind hiện đại)
+ lint từ ngữ (chống lai tiếng Anh/jargon kỹ thuật).

Dùng trong code:
    from xmind_builder import T, build_xmind, lint
    root = T("Gốc", [ T("Nhánh 1", [ T("Lá") ]) ])
    build_xmind(root, "ra.xmind")      # tự chạy lint, in cảnh báo
    # lint(root) -> list [(đường-dẫn-node, token, gợi-ý)]

Dùng CLI:
    python3 xmind_builder.py tree.json ra.xmind      # tree.json = cây lồng {title, children:[...]}
    python3 xmind_builder.py --lint-only tree.json   # chỉ kiểm tra từ ngữ

Định dạng: content.json + metadata.json + manifest.json, structureClass = logic-right
(mọi nhánh chạy sang phải như bản tham khảo).
"""
import json, uuid, zipfile, sys, re

LOGIC_RIGHT = "org.xmind.ui.logic.right"


# ---------- Dựng cây ----------
def T(title, children=None):
    """Tạo 1 topic. children = list các topic con (do T() tạo)."""
    n = {"id": uuid.uuid4().hex, "class": "topic", "title": str(title)}
    if children:
        n["children"] = {"attached": children}
    return n


def _from_plain(node):
    """Chuyển dict thường {title, children:[...]} sang topic có id."""
    kids = [_from_plain(c) for c in node.get("children", [])]
    return T(node["title"], kids or None)


def count(node):
    c = 1
    for ch in node.get("children", {}).get("attached", []):
        c += count(ch)
    return c


# ---------- Lint từ ngữ ----------
# Token bị cấm trong doc nghiệp vụ (regex, không phân biệt hoa thường trừ mã trạng thái).
FORBIDDEN = [
    (r"\bPOST\b|\bGET\b|\bDELETE\b|\bPUT\b|\bPATCH\b", "tên phương thức API — mô tả hành vi thay vì (đẩy đơn/hủy đơn/hỏi lại trạng thái)"),
    (r"/deliveries|/quotes|/oauth2|endpoint|/v1/", "đường dẫn API — bỏ khỏi doc nghiệp vụ"),
    (r"\bwebhook\b", "→ 'đối tác báo trạng thái về'"),
    (r"\bpolling\b|\bpoll\b", "→ 'tự hỏi lại đối tác định kỳ'"),
    (r"\bvalidate\b|\bvalidation\b", "→ 'kiểm tra hợp lệ'"),
    (r"\bINSTANT\b|\bSAME_DAY\b|\bBULK\b", "→ 'Siêu tốc' (tên gói dịch vụ tiếng Việt)"),
    (r"\bcodType\b|\bADVANCED\b|\bREGULAR\b|\bserviceType\b|\bvehicleType\b", "field kỹ thuật — bỏ khỏi doc nghiệp vụ"),
    (r"\bIdempotency\b|\bmerchantOrderID\b|\bdeliveryID\b", "field kỹ thuật — nếu cần dùng 'chống gửi trùng đơn' / 'mã vận đơn'"),
    (r"\bdisabled\b|\benabled\b|\bDISABLED\b", "→ 'mờ đi, không bấm được' / 'bấm được'"),
    (r"auto-sync|auto sync|\bauto\b", "→ 'tự động chuyển' / 'tự động cập nhật'"),
    (r"\bAPI\b", "→ mô tả bằng hành vi nghiệp vụ, tránh nói 'API'"),
    (r"\bpopup\b|\bbanner\b|\btoast\b", "→ 'cảnh báo' / 'thông báo'"),
    (r"Quote API|quote", "→ 'lấy phí giao hàng từ đối tác'"),
]

# Mã trạng thái Grab được phép (khi kèm nghĩa Việt) + thuật ngữ sản phẩm.
STATUS_CODES = ["ALLOCATING", "PENDING_PICKUP", "PICKING_UP", "PENDING_DROP_OFF",
                "IN_DELIVERY", "IN_RETURN", "COMPLETED", "RETURNED",
                "CANCELED", "CANCELLED", "FAILED", "QUEUEING"]
WHITELIST = STATUS_CODES + ["Grab Express", "GrabExpress", "Grab Food", "Grab",
                            "CukCuk", "MISA", "COD", "VAT", "Ahamove", "AhaMove", "Haravan"]


def _strip_whitelist(text):
    t = text
    for w in WHITELIST:
        t = t.replace(w, " ")
    return t


def lint(node, _path=""):
    """Duyệt cây, trả list (đường-dẫn, đoạn-vi-phạm, gợi-ý). Bỏ qua token whitelist."""
    warns = []
    title = node.get("title", "")
    here = (_path + " › " + title) if _path else title
    scrub = _strip_whitelist(title)
    for pattern, hint in FORBIDDEN:
        for m in re.finditer(pattern, scrub):
            warns.append((here[:80], m.group(0), hint))
    for ch in node.get("children", {}).get("attached", []):
        warns.extend(lint(ch, here))
    return warns


# ---------- Xuất file ----------
def build_xmind(root, out_path, sheet_title="Sheet 1", run_lint=True):
    """Ghi root (topic do T() tạo) ra file .xmind. Trả (số_node, cảnh_báo_lint)."""
    root["structureClass"] = LOGIC_RIGHT
    sheet = {"id": uuid.uuid4().hex, "class": "sheet", "title": sheet_title, "rootTopic": root}
    content = [sheet]
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("content.json", json.dumps(content, ensure_ascii=False))
        z.writestr("metadata.json", json.dumps({"creator": {"name": "xmind-solution", "version": "1.0"}}, ensure_ascii=False))
        z.writestr("manifest.json", json.dumps({"file-entries": {"content.json": {}, "metadata.json": {}}}, ensure_ascii=False))
    warns = lint(root) if run_lint else []
    return count(root), warns


def _print_report(out_path, n, warns):
    print(f"Đã ghi: {out_path}")
    print(f"Tổng số node: {n}")
    if warns:
        print(f"\n⚠️  LINT — {len(warns)} chỗ nghi lai kỹ thuật (sửa theo glossary.md):")
        for path, tok, hint in warns[:60]:
            print(f"  • [{tok}] tại: {path}\n      {hint}")
        if len(warns) > 60:
            print(f"  ... và {len(warns) - 60} chỗ nữa")
    else:
        print("✅ Lint sạch — không phát hiện lai kỹ thuật.")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    lint_only = "--lint-only" in sys.argv
    if not args:
        print("Cách dùng: python3 xmind_builder.py tree.json [ra.xmind]   |   --lint-only tree.json")
        sys.exit(1)
    tree = json.load(open(args[0], encoding="utf-8"))
    root = _from_plain(tree)
    if lint_only:
        warns = lint(root)
        _print_report("(chỉ lint)", count(root), warns)
    else:
        out = args[1] if len(args) > 1 else "ra.xmind"
        n, warns = build_xmind(root, out)
        _print_report(out, n, warns)
