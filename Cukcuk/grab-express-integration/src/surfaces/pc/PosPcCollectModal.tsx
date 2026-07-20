import React, {useState} from 'react';
import {X} from 'lucide-react';
import type {DeliveryOrder} from '../../types';
import {formatCurrency} from '../../constants';

// ---------------------------------------------------------------------------
// Popup "Thu tiền khách hàng" — bản PC, khớp ảnh chụp thật (thu tiền.png).
// Nghiệp vụ giữ nguyên bản tablet: Còn phải thu = COD tự tính, không nhập tay.
// ---------------------------------------------------------------------------

const roCls = 'h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-right text-[13px] font-semibold text-slate-700';

export const PosPcCollectModal: React.FC<{
  order: DeliveryOrder;
  onClose: () => void;
  onConfirm: () => void;
}> = ({order, onClose, onConfirm}) => {
  const [method, setMethod] = useState('Tiền mặt');
  const total = order.subtotal + order.shippingFeeCustomer;
  const stillOwed = order.isCod ? order.codAmount : total;

  return (
    <div className="absolute inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" onClick={onClose} />
      <div className="animate-scale-up relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#1570EF] px-5 py-3.5 text-white">
          <h3 className="text-[15px] font-bold">Thu tiền khách hàng</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3.5 p-5">
          <Row label="Khách hàng">
            <input value={order.customerName} disabled className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-600" />
          </Row>
          <Row label="Tổng tiền">
            <input value={formatCurrency(total)} disabled className={roCls} />
          </Row>
          <Row label="Tiền đặt cọc, Voucher, chiết khấu ĐTGH">
            <input value={formatCurrency(0)} disabled className={roCls} />
          </Row>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[13px] font-bold text-slate-800">Còn phải thu</span>
            <span className="text-[19px] font-black text-brand">{formatCurrency(stillOwed)}</span>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#1570EF]">
              <span className="h-2 w-2 rounded-full bg-[#1570EF]" />
            </span>
            <span className="text-[13px] font-semibold text-slate-700">Thu tiền</span>
          </div>

          <Row label="Hình thức thanh toán">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] font-medium outline-none focus:border-brand"
            >
              <option>Tiền mặt</option>
              <option>Chuyển khoản</option>
              <option>Quẹt thẻ</option>
              <option>Ví điện tử</option>
            </select>
          </Row>

          {!order.isCod && (
            <p className="text-[11.5px] text-slate-400">
              Đơn không thu hộ — còn phải thu = 0, xác nhận để đóng đơn (đồng nhất với nhà hàng tự giao).
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2.5 border-t border-slate-100 bg-[#f5f5f5] px-5 py-3.5">
          <button onClick={onClose} className="h-9 min-w-[110px] rounded-md border border-slate-300 bg-white px-6 text-[13px] font-bold text-slate-700 hover:bg-slate-50">
            Hủy bỏ
          </button>
          <button onClick={onConfirm} className="h-9 min-w-[110px] rounded-md bg-[#1570EF] px-6 text-[13px] font-bold text-white hover:brightness-110">
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
  <div>
    <label className="mb-1 block text-[12.5px] font-semibold text-slate-600">{label}</label>
    {children}
  </div>
);
