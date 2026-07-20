import React, {useState} from 'react';
import {
  Bike,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  DollarSign,
  Gift,
  Info,
  Pencil,
  Printer,
  Save,
  Search,
  SplitSquareHorizontal,
  Tag,
} from 'lucide-react';
import type {ConnectionState, DeliveryOrder, ToastKind} from '../../types';
import {formatCurrency} from '../../constants';

// ---------------------------------------------------------------------------
// Màn "Tính tiền" — full-screen, khớp ảnh chụp thật (Order tab → chọn đơn →
// Tính tiền). Sidebar trái (Thẻ thành viên / Khuyến mại) chỉ mang tính minh
// họa (ngoài phạm vi tích hợp Grab Express). Nút "Giao hàng" (xanh lá, icon
// xe) là hành động thật: gửi đơn sang Grab Express + chuyển sang Sổ giao hàng.
// ---------------------------------------------------------------------------

const PROMOS = [
  {label: 'Mua món tặng món', checked: false},
  {label: 'Mua M tặng N', checked: false},
  {label: 'Giảm giá hóa đơn 500k', checked: false},
  {label: 'Giảm 15% hóa đơn thứ 2', checked: false, desc: 'Giảm giá hóa đơn 15% cho hóa đơn thứ 2 trong ngày'},
];

export const PosPcCheckoutScreen: React.FC<{
  order: DeliveryOrder;
  connection: ConnectionState;
  onBack: () => void;
  onConfirmSend: (id: string) => void;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
}> = ({order, connection, onBack, onConfirmSend, pushToast}) => {
  const [eInvoice, setEInvoice] = useState(false);
  const [promoChecked, setPromoChecked] = useState<Record<number, boolean>>({});

  const canSend = order.cukcukStatus === 'cho_gui_doi_tac';
  const total = order.subtotal + order.shippingFeeCustomer;
  const remaining = order.isCod ? order.codAmount : total;

  const handleDeliver = () => {
    if (!canSend) {
      pushToast('warning', 'Đơn đã được gửi');
      return;
    }
    if (!connection.isConnected) {
      pushToast('warning', 'Chưa kết nối Grab Express', 'Vào Web quản lý › Ứng dụng để kết nối.');
      return;
    }
    onConfirmSend(order.id);
  };

  return (
    <div className="flex h-full bg-[#EEF0F4]">
      {/* ===== Sidebar trái — minh họa (ngoài phạm vi Grab Express) ===== */}
      <div className="flex w-[300px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-slate-200 bg-white p-3">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-brand">
            <Tag size={14} /> Thẻ thành viên
          </div>
          <div className="relative mb-2">
            <input placeholder="Mã thành viên" className="h-9 w-full rounded-md border border-slate-300 pl-3 pr-8 text-[13px] outline-none focus:border-brand" />
            <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="relative">
            <select className="h-9 w-full appearance-none rounded-md border border-slate-300 pl-3 pr-8 text-[13px] outline-none focus:border-brand">
              <option>Tên thành viên</option>
              <option>{order.customerName}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <button className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 px-3 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50">
          Sử dụng điểm &amp; mã ưu đãi
          <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
        </button>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-brand">
            <Gift size={14} /> Chương trình khuyến mại
          </div>
          <div className="relative mb-2">
            <input placeholder="Tìm kiếm CTKM" className="h-9 w-full rounded-md border border-slate-300 pl-3 pr-8 text-[13px] outline-none focus:border-brand" />
            <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="space-y-1.5">
            {PROMOS.map((p, i) => (
              <label key={p.label} className="flex items-start gap-2 rounded-md border border-slate-100 p-2 text-[12.5px] hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={!!promoChecked[i]}
                  onChange={(e) => setPromoChecked((s) => ({...s, [i]: e.target.checked}))}
                  className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
                />
                <span className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-700">{p.label}</div>
                  {p.desc && promoChecked[i] && <div className="text-[11px] text-slate-400">{p.desc}</div>}
                </span>
                <Info size={13} className="mt-0.5 shrink-0 text-slate-300" />
              </label>
            ))}
          </div>
        </div>

        <button className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-brand/40 text-[12.5px] font-bold text-brand hover:bg-brand-light">
          + Khuyến mại khác
        </button>

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-3">
          <button className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 hover:text-slate-700">
            <Clock size={14} /> Giá theo khung giờ
          </button>
          <div className="text-[12px] text-slate-400">Phím tắt</div>
        </div>
      </div>

      {/* ===== Main ===== */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header order */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
          <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
            <ChevronLeft size={18} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
            <Pencil size={15} />
          </button>
          <span className="text-[14px] font-bold text-brand">{order.trackingNo ?? order.orderNo}</span>
          <span className="text-[12.5px] text-slate-400">Người giao</span>
          <input placeholder="Chưa phân công" className="h-8 flex-1 rounded-md border border-slate-200 px-3 text-[13px] outline-none focus:border-brand" />
          <span className="shrink-0 text-[12.5px] text-slate-400">{order.scheduledTime}</span>
        </div>

        {/* Bảng món */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="sticky top-0 bg-[#FAFAFA] text-[12px] font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-2.5">Tên món</th>
                <th className="px-4 py-2.5 text-center">SL</th>
                <th className="px-4 py-2.5 text-right">Đơn giá</th>
                <th className="px-4 py-2.5 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((it) => (
                <tr key={it.id}>
                  <td className="px-4 py-2.5 font-medium text-slate-800">{it.name}</td>
                  <td className="px-4 py-2.5 text-center text-slate-600">{it.qty.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{formatCurrency(it.price)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{formatCurrency(it.qty * it.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổng tiền */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
          <div className="flex items-end justify-between">
            <div className="space-y-1.5 text-[13px]">
              <div className="flex items-center gap-6">
                <span className="font-bold text-slate-800">Thành tiền</span>
                <span className="font-bold text-slate-800">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center gap-6 text-slate-500">
                <span>Phí giao hàng</span>
                <span className="font-medium text-slate-700">{formatCurrency(order.shippingFeeCustomer)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12.5px] text-slate-500">Tổng thanh toán</div>
              <div className="text-[22px] font-black text-brand">{formatCurrency(total)}</div>
              <div className="mt-1 text-[12.5px] text-slate-500">
                Còn phải thu <span className="font-bold text-slate-800">{formatCurrency(remaining)}</span>
              </div>
            </div>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-slate-600">
            <input type="checkbox" checked={eInvoice} onChange={(e) => setEInvoice(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" />
            Khách lấy hóa đơn GTGT
          </label>
        </div>

        {/* Nút hành động */}
        <div className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white p-3">
          <button onClick={onBack} className="flex h-10 items-center gap-1.5 rounded-md border border-slate-300 px-4 text-[13px] font-bold text-slate-600 hover:bg-slate-50">
            <ChevronLeft size={15} /> Quay lại
          </button>
          <button
            onClick={() => pushToast('info', 'Tách hóa đơn')}
            className="flex h-10 items-center gap-1.5 rounded-md border border-slate-300 px-4 text-[13px] font-bold text-slate-600 hover:bg-slate-50"
          >
            <SplitSquareHorizontal size={15} /> Tách HĐ
          </button>
          <button
            onClick={() => pushToast('info', 'In tạm tính')}
            className="flex h-10 items-center gap-1.5 rounded-md border border-slate-300 px-4 text-[13px] font-bold text-slate-600 hover:bg-slate-50"
          >
            <Printer size={15} /> In tạm tính
          </button>
          <button
            onClick={() => pushToast('info', 'Đã lưu tạm hóa đơn')}
            className="flex h-10 items-center gap-1.5 rounded-md border border-slate-300 px-4 text-[13px] font-bold text-slate-600 hover:bg-slate-50"
          >
            <Save size={15} /> Lưu tạm HĐ
          </button>
          <button
            onClick={() =>
              pushToast(
                'info',
                'Đơn giao hàng thu tiền tại Sổ giao hàng',
                'Grab Express thu hộ (COD) khi giao thành công — mở nút Thu tiền ở Sổ giao hàng lúc đó.',
              )
            }
            className="ml-auto flex h-10 items-center gap-1.5 rounded-md bg-[#F59E0B] px-5 text-[13px] font-bold text-white hover:brightness-105"
          >
            <DollarSign size={16} /> Thu tiền
          </button>
          <button
            onClick={handleDeliver}
            className="flex h-10 items-center gap-1.5 rounded-md bg-[#12B76A] px-5 text-[13px] font-bold text-white hover:brightness-105"
          >
            <Bike size={16} /> Giao hàng
          </button>
        </div>
      </div>
    </div>
  );
};
