# Clarity Report v1 — Tích hợp MISA CukCuk ↔ ShopeeFood

**Ngày:** 2026-07-23 · **Phase:** refine · **Clarity score:** 72% (High×3/Med×2/Low×1)
**Vai trò tích hợp:** ISV Partner (OAuth2 device-code + Bearer token).

> Báo cáo tự chứa để resume. Nguồn chuẩn: `[API]` tài liệu API, `[Q&A]` Excel phản hồi SPF, `[MAP]` Excel mapping. `[XMIND]`/`[UI]` là nháp. Chi tiết đầy đủ: `../../direction-analysis.md`, `../../customer-journey.md`, `../../questions-for-shopeefood.md`, `../domain-research.md`.

## 1. Tóm tắt
Tích hợp CukCuk (POS nhà hàng) với ShopeeFood qua 4 luồng: **Kết nối+Menu · Nhận đơn POS · Đối soát+Báo cáo · Nâng cao UX**. Chỉ ShopeeFood lần này. Phân tích định hướng, customer journey, benchmark đối thủ và danh sách câu hỏi SPF đã hoàn tất. Các điểm chờ chủ yếu cần **ShopeeFood xác nhận** (không phải quyết định nội bộ).

## 2. Domains / Modules
| # | Module | Trạng thái |
|---|---|---|
| 01 | Kết nối / Authorization (device-code QR, token, disconnect) | Spec chi tiết → `modules/01-ket-noi.md` |
| 02 | Thiết lập & Đồng bộ Menu (mapping, sync 1 chiều, giờ hoạt động) | Spec chi tiết → `modules/02-dong-bo-menu.md` |
| 03 | Nhận & Xử lý Đơn tại POS (webhook, vòng đời đơn, bù đơn) | Spec chi tiết → `modules/03-nhan-don-pos.md` |
| 04 | Đối soát & Báo cáo | Công thức & field đã rõ từ Q&A (v2) — sẵn sàng viết spec chi tiết |
| 05 | Nâng cao UX đa kênh | Khuyến nghị U1–U7 trong direction §3C |

## 3. Confirmed Requirements
| ID | Nội dung | Nguồn |
|---|---|---|
| SCOPE-01..04 | Làm cả 4 luồng; chỉ ShopeeFood; Grab out-of-scope (giữ khung đa kênh) | BA |
| MODEL-ISV | Xác thực Bearer token, device-code flow, bỏ HMAC; token per-store, refresh định kỳ; mapping 1:1 store | `[API-Auth]`, `[Q&A A.1]` |
| DEC-MAP-01 | Mapping menu = **auto fuzzy-match ~80% + user xác nhận** (lần đầu & khi có món mới) | BA (research U1) |
| DEC-CONFIRM-01 | Auto-confirm = **mặc định thủ công + tự xác nhận sau ~2'**; bật/tắt trong Cài đặt | BA (research U2) |
| DEC-PAUSE-01 | **Nút "Tạm ngưng bán online" đẩy đóng cửa lên SPF tức thì** — ưu tiên MVP | BA (research U4) |
| CONSTRAINT-F1..F10 | 10 ràng buộc kỹ thuật then chốt (menu 1 chiều, full-sync hủy diệt, no webhook replay, nhiều thao tác chỉ Partner App, giá gồm VAT, chỉ KM giá gạch, hủy trước PICKED, không combo, status machine, 25 QPS) | `[API]`, `[Q&A]` → direction §2 |

## 4. TODO — Pending Clarification (đã rà kỹ nguồn, rút còn 3 mục)
| # | ID | Câu hỏi | Impact |
|---|----|---------|--------|
| 1 | SPF-Q1 | Thời điểm thông tin tài xế về CukCuk (đã hỏi 29/06, SPF chưa trả lời) | 🔴 High |
| 2 | SPF-Q2 | Vòng đời token: refresh rotate? re-link khi fail? webhook disconnect? | 🟡 Med |
| 3 | SPF-Q3 | Cấp môi trường UAT (client_id/secret, domain, timeline) | 🟡 Med |

> **Đính chính v2:** các mục A1/A2/A3/A4/A5/B2–B6/C1–C5/E1/E2 ở v1 **thực ra đã có lời đáp** trong `[Q&A]`/`[API §3.4/§3.5]` — đã chuyển thành business rule (xem `modules/*`, `direction §5`, `customer-journey §3`). Sai sót do đọc bản Excel bị cắt ký tự; đã đọc lại đầy đủ. Công thức tiền quán thực nhận = *tiền món − KM quán tài trợ − commission − thuế* `[Q&A 22062026-Q5]`.

## 5. Scope Assumptions (do not ask client)
| # | Giả định | Lý do |
|---|---|---|
| SA-01 | Grab không build lần này, chỉ giữ khung UI đa kênh | BA chốt "chỉ ShopeeFood" |
| SA-02 | HĐĐT dùng hệ thống CukCuk hiện có, không xuất qua SPF | `[Q&A 2206-7]` SPF chưa hỗ trợ |
| SA-03 | In tem/phiếu bếp là mẫu nội bộ CukCuk, không in qua SPF | `[Q&A 2206-8]` F4 |

## 6. Next
`/ba:export` để gửi câu hỏi SPF (5 mục 🔴) · đi sâu module 03/04 sau khi SPF phản hồi phí.
