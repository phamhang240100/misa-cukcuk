import React, {useState} from 'react';
import {
  BarChart3,
  Check,
  ChevronDown,
  FileSpreadsheet,
  HelpCircle,
  PieChart,
} from 'lucide-react';

// Báo cáo hiển thị số thuần (không hậu tố "đ"), theo mẫu MISA CukCuk.
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

type ReportId = 'doanh-thu-doi-tac' | 'bang-ke-hoa-don';

const REPORTS: {id: ReportId; title: string}[] = [
  {id: 'doanh-thu-doi-tac', title: 'Doanh thu theo đối tác giao hàng và sàn TMĐT'},
  {id: 'bang-ke-hoa-don', title: 'Bảng kê hóa đơn'},
];

// ---- Dữ liệu mẫu: Doanh thu theo đối tác (FR-rep-002) ----
interface PartnerRow {
  partner: string;
  count: number;
  total: number;
  goods: number;
  fee: number;
  vat: number;
  promo: number;
  discount: number;
  sct: number;
}
const PARTNER_ROWS: PartnerRow[] = [
  {partner: 'Nhà hàng tự giao', count: 4, total: 686800, goods: 599111, fee: 30000, vat: 57689, promo: 0, discount: 0, sct: 0},
  {partner: 'Grab Express', count: 3, total: 468000, goods: 405000, fee: 63000, vat: 40500, promo: 0, discount: 0, sct: 0},
  {partner: 'ShopeeFood', count: 2, total: 250000, goods: 220000, fee: 20000, vat: 22000, promo: 10000, discount: 0, sct: 0},
];

// ---- Dữ liệu mẫu: Bảng kê hóa đơn (FR-rep-001) — đủ cột theo template/CSV ----
interface InvoiceRow {
  date: string;
  inOut: string;
  invoiceNo: string;
  table: string; // Bàn
  guests: number; // Số khách
  cashier: string; // Thu ngân
  before: number; // Doanh thu trước GG (1)
  itemDiscount: number; // Giảm giá món
  discount: number; // Chiết khấu
  voucher: number; // Voucher
  points: number; // Đổi điểm
  after: number; // Doanh thu sau GG (3=1-2)
  vat: number; // Tiền thuế GTGT (4)
  total: number; // Tổng thanh toán (5=3+4)
  cash: number; // Tiền mặt
  transfer: number; // Chuyển khoản
  debt: number; // Khách nợ
  customer: string; // Khách hàng
  service: string; // Hình thức PV
  area: string; // Khu vực
  server: string; // Phục vụ
  bankAcc: string; // TK NH/Ví điện tử
  partner: string; // Đối tác giao hàng
  note: string; // Ghi chú
};
const INVOICE_ROWS: InvoiceRow[] = [
  {date: '16/07/2026', inOut: '11:20 - 12:05', invoiceNo: 'HD00147', table: '', guests: 1, cashier: 'Nguyễn Thu Hằng', before: 195000, itemDiscount: 0, discount: 0, voucher: 0, points: 0, after: 195000, vat: 19500, total: 219000, cash: 0, transfer: 219000, debt: 0, customer: 'Phạm Thùy Linh', service: 'Giao hàng', area: '', server: 'Nguyễn Thu Hằng', bankAcc: 'PVcomBank VietQR', partner: 'Grab Express', note: ''},
  {date: '16/07/2026', inOut: '11:35 - 12:30', invoiceNo: 'HD00151', table: '', guests: 1, cashier: 'Nguyễn Thu Hằng', before: 190000, itemDiscount: 0, discount: 0, voucher: 0, points: 0, after: 190000, vat: 19000, total: 210000, cash: 210000, transfer: 0, debt: 0, customer: 'Trần Minh Anh', service: 'Giao hàng', area: '', server: 'Nguyễn Thu Hằng', bankAcc: '', partner: 'Grab Express', note: 'Gọi trước khi giao'},
  {date: '16/07/2026', inOut: '10:05 - 10:15', invoiceNo: 'HD00149', table: '', guests: 1, cashier: 'Nguyễn Thu Hằng', before: 70000, itemDiscount: 0, discount: 0, voucher: 0, points: 0, after: 70000, vat: 7000, total: 95000, cash: 0, transfer: 95000, debt: 0, customer: 'Phạm Thùy Linh', service: 'Giao hàng', area: '', server: 'Nguyễn Thu Hằng', bankAcc: 'ACB VietQR', partner: 'Grab Express', note: ''},
  {date: '16/07/2026', inOut: '09:12 - 09:40', invoiceNo: '2603000061', table: 'Bàn 5', guests: 2, cashier: 'Nguyễn Nam 1', before: 348675, itemDiscount: 0, discount: 0, voucher: 0, points: 0, after: 348675, vat: 0, total: 348675, cash: 348675, transfer: 0, debt: 0, customer: 'Khách lẻ', service: 'Tại nhà hàng', area: 'Tầng 1', server: 'Nguyễn Nam 1', bankAcc: '', partner: '', note: ''},
  {date: '16/07/2026', inOut: '13:02 - 13:44', invoiceNo: '2603000064', table: '', guests: 1, cashier: 'Nguyễn Nam 1', before: 306000, itemDiscount: 25000, discount: 0, voucher: 0, points: 0, after: 281000, vat: 0, total: 281000, cash: 281000, transfer: 0, debt: 0, customer: 'Nguyễn Văn A', service: 'Mang về', area: '', server: 'Nguyễn Nam 1', bankAcc: '', partner: '', note: ''},
  {date: '16/07/2026', inOut: '14:10 - 14:35', invoiceNo: '2603000067', table: 'Bàn 2', guests: 3, cashier: 'Nguyễn Nam 1', before: 137358, itemDiscount: 0, discount: 0, voucher: 0, points: 0, after: 137358, vat: 0, total: 137358, cash: 0, transfer: 137358, debt: 0, customer: 'CtTrang', service: 'Tại nhà hàng', area: 'Tầng 1', server: 'Nguyễn Nam 1', bankAcc: 'ACB bank', partner: '', note: ''},
];

const FBTN =
  'flex h-8 items-center gap-1.5 rounded-md border border-[#D5D7DA] bg-white px-3 text-[13px] font-medium text-[#101828] hover:bg-[#F0F6FE] hover:text-[#245FDF]';
const FINPUT = 'h-8 rounded-md border border-[#D5D7DA] bg-white px-2.5 text-[13px] outline-none focus:border-[#245FDF]';

export const WebReportsView: React.FC = () => {
  const [report, setReport] = useState<ReportId>('doanh-thu-doi-tac');
  const [picker, setPicker] = useState(false);
  const current = REPORTS.find((r) => r.id === report)!;

  return (
    <div className="flex h-full flex-col bg-[#F0F2F4]">
      {/* Page header: Chọn báo cáo · Tiêu đề · Trợ giúp */}
      <div className="flex items-center justify-between border-b border-[#E9EAEB] bg-white px-4 py-2.5">
        <div className="relative">
          <button onClick={() => setPicker((v) => !v)} className="flex h-9 items-center gap-2 rounded-md bg-[#245FDF] px-4 text-[13px] font-semibold text-white hover:bg-[#1D4FC4]">
            Chọn báo cáo <ChevronDown className="h-4 w-4" />
          </button>
          {picker && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setPicker(false)} />
              <div className="animate-fade-in absolute left-0 top-11 z-30 w-[360px] overflow-hidden rounded-lg border border-[#E9EAEB] bg-white py-1 shadow-xl">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#A4A7AE]">Bán hàng</div>
                {REPORTS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setReport(r.id);
                      setPicker(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-[#F0F6FE] ${
                      r.id === report ? 'font-semibold text-[#245FDF]' : 'text-[#101828]'
                    }`}
                  >
                    {r.title}
                    {r.id === report && <Check className="h-4 w-4 text-[#245FDF]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold uppercase tracking-wide text-[#245FDF]">
          {current.title}
        </h2>
        <button className="flex h-8 items-center gap-1.5 rounded-md border border-[#D5D7DA] bg-white px-3 text-[13px] font-medium text-[#717680] hover:bg-[#F0F6FE]">
          <HelpCircle className="h-4 w-4" /> Giúp
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E9EAEB] bg-white px-4 py-2.5">
        <div className="relative">
          <select className={FINPUT + ' h-9 w-36 appearance-none pr-8'} defaultValue="thang-nay">
            <option value="thang-nay">Tháng này</option>
            <option value="thang-truoc">Tháng trước</option>
            <option value="tuy-chon">Tùy chọn</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717680]" />
        </div>
        <span className="text-[13px] text-[#717680]">Từ ngày</span>
        <input type="date" defaultValue="2026-07-01" className={FINPUT + ' h-9'} />
        <span className="text-[13px] text-[#717680]">Đến ngày</span>
        <input type="date" defaultValue="2026-07-31" className={FINPUT + ' h-9'} />
        <button className="flex h-9 items-center gap-1.5 rounded-md bg-[#245FDF] px-4 text-[13px] font-semibold text-white hover:bg-[#1D4FC4]">
          Lấy dữ liệu
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button className={FBTN}>
            {report === 'doanh-thu-doi-tac' ? <PieChart className="h-4 w-4 text-[#245FDF]" /> : <BarChart3 className="h-4 w-4 text-[#245FDF]" />}
            Xem biểu đồ
          </button>
          <button className={FBTN}>
            <FileSpreadsheet className="h-4 w-4 text-[#12B76A]" /> Xuất khẩu
          </button>
        </div>
      </div>

      {/* Nội dung báo cáo */}
      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="overflow-x-auto rounded-lg border border-[#E9EAEB] bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.04)]">
          {report === 'doanh-thu-doi-tac' ? <PartnerRevenueTable /> : <InvoiceListTable />}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
const PartnerRevenueTable: React.FC = () => {
  const sum = (fn: (r: PartnerRow) => number) => PARTNER_ROWS.reduce((s, r) => s + fn(r), 0);
  const th = 'border border-[#E9EAEB] px-3 py-2.5 text-[12px] font-semibold text-[#101828]';
  const td = 'border border-[#E9EAEB] px-3 py-2.5 text-[13px]';
  return (
    <table className="w-full min-w-[980px] border-collapse text-right">
      <thead className="bg-[#FAFAFA]">
        <tr>
          <th className={th + ' text-left'} rowSpan={2}>Đối tác</th>
          <th className={th} rowSpan={2}>SL hóa đơn</th>
          <th className={th + ' text-center'} colSpan={7}>Doanh thu</th>
        </tr>
        <tr>
          {['Tổng', 'Tiền hàng', 'Tiền phí', 'Tiền thuế GTGT', 'Khuyến mại', 'Chiết khấu', 'Tiền thuế TTĐB'].map((h) => (
            <th key={h} className={th}>{h}</th>
          ))}
        </tr>
        {/* Hàng lọc theo mẫu MISA */}
        <tr className="bg-white">
          <td className="border border-[#E9EAEB] px-2 py-1"><input placeholder="*" className="h-7 w-full rounded border border-[#E9EAEB] px-2 text-[12px] outline-none" /></td>
          {Array.from({length: 8}).map((_, i) => (
            <td key={i} className="border border-[#E9EAEB] px-2 py-1">
              <div className="flex items-center gap-1">
                <span className="text-[12px] text-[#A4A7AE]">≤</span>
                <input className="h-7 w-full rounded border border-[#E9EAEB] px-1 text-[12px] outline-none" />
              </div>
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {PARTNER_ROWS.map((r) => (
          <tr key={r.partner} className="hover:bg-[#F0F6FE]/50">
            <td className={td + ' text-left font-semibold text-[#245FDF]'}>{r.partner}</td>
            <td className={td}>{r.count}</td>
            <td className={td + ' font-semibold'}>{fmt(r.total)}</td>
            <td className={td}>{fmt(r.goods)}</td>
            <td className={td}>{fmt(r.fee)}</td>
            <td className={td}>{fmt(r.vat)}</td>
            <td className={td}>{fmt(r.promo)}</td>
            <td className={td}>{fmt(r.discount)}</td>
            <td className={td}>{fmt(r.sct)}</td>
          </tr>
        ))}
        <tr className="bg-[#FAFAFA] font-bold text-[#101828]">
          <td className={td + ' text-left'}>Tổng</td>
          <td className={td}>{sum((r) => r.count)}</td>
          <td className={td}>{fmt(sum((r) => r.total))}</td>
          <td className={td}>{fmt(sum((r) => r.goods))}</td>
          <td className={td}>{fmt(sum((r) => r.fee))}</td>
          <td className={td}>{fmt(sum((r) => r.vat))}</td>
          <td className={td}>{fmt(sum((r) => r.promo))}</td>
          <td className={td}>{fmt(sum((r) => r.discount))}</td>
          <td className={td}>{fmt(sum((r) => r.sct))}</td>
        </tr>
      </tbody>
    </table>
  );
};

// ---------------------------------------------------------------------------
const InvoiceListTable: React.FC = () => {
  const th = 'border border-[#E9EAEB] px-3 py-2 text-[12px] font-semibold text-[#101828] whitespace-nowrap';
  const td = 'border border-[#E9EAEB] px-3 py-2.5 text-[13px] whitespace-nowrap';
  const num = (n: number) => (n ? fmt(n) : '0');
  const sum = (fn: (r: InvoiceRow) => number) => INVOICE_ROWS.reduce((s, r) => s + fn(r), 0);
  // Các cột số để render hàng lọc "≤."
  const NUM_COLS = 13;
  return (
    <table className="w-full min-w-[2400px] border-collapse text-right">
      <thead className="bg-[#FAFAFA]">
        <tr>
          {['Ngày', 'Giờ vào - ra', 'Số hóa đơn', 'Bàn', 'Số khách', 'Thu ngân', 'Doanh thu trước GG (1)'].map((h) => (
            <th key={h} className={th + ' text-left'} rowSpan={2}>{h}</th>
          ))}
          <th className={th + ' text-center'} colSpan={4}>Các khoản giảm trừ doanh thu (2)</th>
          {['Doanh thu sau GG (3=1-2)', 'Tiền thuế GTGT (4)', 'Tổng thanh toán (5=3+4)', 'Tiền mặt', 'Chuyển khoản', 'Khách nợ'].map((h) => (
            <th key={h} className={th} rowSpan={2}>{h}</th>
          ))}
          {['Khách hàng', 'Hình thức PV', 'Khu vực', 'Phục vụ', 'TK NH/Ví điện tử', 'Đối tác giao hàng', 'Ghi chú'].map((h) => (
            <th key={h} className={th + ' text-left'} rowSpan={2}>{h}</th>
          ))}
        </tr>
        <tr>
          {['Giảm giá món', 'Chiết khấu', 'Voucher', 'Đổi điểm'].map((h) => (
            <th key={h} className={th}>{h}</th>
          ))}
        </tr>
        {/* Hàng lọc theo mẫu MISA */}
        <tr className="bg-white">
          <td className="border border-[#E9EAEB] px-2 py-1"><input placeholder="=." className="h-7 w-24 rounded border border-[#E9EAEB] px-2 text-[12px] outline-none" /></td>
          {Array.from({length: 5}).map((_, i) => (
            <td key={'a' + i} className="border border-[#E9EAEB] px-2 py-1"><input placeholder="*" className="h-7 w-full min-w-[70px] rounded border border-[#E9EAEB] px-2 text-[12px] outline-none" /></td>
          ))}
          {Array.from({length: NUM_COLS}).map((_, i) => (
            <td key={'n' + i} className="border border-[#E9EAEB] px-2 py-1">
              <div className="flex items-center gap-1">
                <span className="text-[12px] text-[#A4A7AE]">≤</span>
                <input className="h-7 w-full min-w-[60px] rounded border border-[#E9EAEB] px-1 text-[12px] outline-none" />
              </div>
            </td>
          ))}
          {Array.from({length: 6}).map((_, i) => (
            <td key={'t' + i} className="border border-[#E9EAEB] px-2 py-1"><input placeholder="*" className="h-7 w-full min-w-[70px] rounded border border-[#E9EAEB] px-2 text-[12px] outline-none" /></td>
          ))}
        </tr>
      </thead>
      <tbody>
        {INVOICE_ROWS.map((r, i) => (
          <tr key={i} className="hover:bg-[#F0F6FE]/50">
            <td className={td + ' text-left'}>{r.date}</td>
            <td className={td + ' text-left text-[#717680]'}>{r.inOut}</td>
            <td className={td + ' text-left font-semibold text-[#245FDF]'}>{r.invoiceNo}</td>
            <td className={td + ' text-left'}>{r.table || '—'}</td>
            <td className={td}>{r.guests}</td>
            <td className={td + ' text-left'}>{r.cashier}</td>
            <td className={td}>{num(r.before)}</td>
            <td className={td}>{num(r.itemDiscount)}</td>
            <td className={td}>{num(r.discount)}</td>
            <td className={td}>{num(r.voucher)}</td>
            <td className={td}>{num(r.points)}</td>
            <td className={td + ' font-semibold'}>{num(r.after)}</td>
            <td className={td}>{num(r.vat)}</td>
            <td className={td + ' font-semibold'}>{num(r.total)}</td>
            <td className={td}>{num(r.cash)}</td>
            <td className={td}>{num(r.transfer)}</td>
            <td className={td}>{num(r.debt)}</td>
            <td className={td + ' text-left'}>{r.customer}</td>
            <td className={td + ' text-left'}>{r.service}</td>
            <td className={td + ' text-left'}>{r.area || '—'}</td>
            <td className={td + ' text-left'}>{r.server}</td>
            <td className={td + ' text-left'}>{r.bankAcc || '—'}</td>
            <td className={td + ' text-left'}>
              {r.partner ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#E6F7EE] px-2 py-0.5 text-[12px] font-semibold text-[#00B14F]">
                  {r.partner}
                </span>
              ) : (
                <span className="text-[#A4A7AE]">—</span>
              )}
            </td>
            <td className={td + ' text-left text-[#717680]'}>{r.note || '—'}</td>
          </tr>
        ))}
        <tr className="bg-[#FAFAFA] font-bold text-[#101828]">
          <td className={td + ' text-left'} colSpan={6}>Tổng: {INVOICE_ROWS.length} hóa đơn</td>
          <td className={td}>{fmt(sum((r) => r.before))}</td>
          <td className={td}>{fmt(sum((r) => r.itemDiscount))}</td>
          <td className={td}>{fmt(sum((r) => r.discount))}</td>
          <td className={td}>{fmt(sum((r) => r.voucher))}</td>
          <td className={td}>{fmt(sum((r) => r.points))}</td>
          <td className={td}>{fmt(sum((r) => r.after))}</td>
          <td className={td}>{fmt(sum((r) => r.vat))}</td>
          <td className={td}>{fmt(sum((r) => r.total))}</td>
          <td className={td}>{fmt(sum((r) => r.cash))}</td>
          <td className={td}>{fmt(sum((r) => r.transfer))}</td>
          <td className={td}>{fmt(sum((r) => r.debt))}</td>
          <td className={td} colSpan={7} />
        </tr>
      </tbody>
    </table>
  );
};
