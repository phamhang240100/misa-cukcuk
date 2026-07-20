import React from 'react';
import {CalendarClock, Globe, MapPin} from 'lucide-react';
import {formatCurrency} from '../../constants';
import type {OnlineOrder} from './onlineOrder';

// ---------------------------------------------------------------------------
// Tab "Order Online" — danh sách đơn từ Website/App chờ xác nhận. Click 1 đơn
// mở PosPcOnlineOrderPanel (2 tab: Thông tin đơn hàng / Đối tác giao hàng).
// ---------------------------------------------------------------------------

export const PosPcOnlineOrderScreen: React.FC<{
  orders: OnlineOrder[];
  onOpen: (o: OnlineOrder) => void;
}> = ({orders, onOpen}) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h2 className="text-[15px] font-bold text-slate-800">Đơn hàng Online</h2>
        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[12px] font-semibold text-orange-600">
          Chờ xác nhận ({orders.length})
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {orders.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
            <Globe size={36} />
            <div className="text-[13px] text-slate-400">Không có đơn online nào đang chờ xác nhận</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => onOpen(o)}
                className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between bg-orange-500 px-3 py-2 text-white">
                  <span className="text-[13px] font-bold">{o.orderNo}</span>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10.5px] font-bold">{o.source}</span>
                </div>
                <div className="space-y-1.5 px-3 py-2.5">
                  <div className="text-[13px] font-semibold text-slate-800">{o.customerName}</div>
                  <div className="text-[11.5px] text-slate-400">{o.customerPhone}</div>
                  <div className="flex items-start gap-1 text-[11.5px] leading-snug text-slate-500">
                    <MapPin size={12} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">
                      {o.freetext}, {o.ward}, {o.district}, {o.province}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <CalendarClock size={12} /> Nhận lúc {o.deliveryTime} · Đặt {o.createdAt}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11.5px] text-slate-400">{o.items.length} món</span>
                    <span className="text-[13px] font-bold text-slate-800">{formatCurrency(o.subtotal)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
