import React, {useState} from 'react';
import {Pencil, Truck, User, X} from 'lucide-react';
import type {DeliveryOrder} from '../../types';
import {formatCurrency} from '../../constants';
import {GeStatusPill, GrabExpressLogo} from '../../components/ui';

type ListTab = 'cho_thanh_toan' | 'mang_ve' | 'cho_giao_hang' | 'dat_truoc';

const TABS: {id: ListTab; label: string}[] = [
  {id: 'cho_thanh_toan', label: 'Chờ thanh toán'},
  {id: 'mang_ve', label: 'Mang về'},
  {id: 'cho_giao_hang', label: 'Chờ giao hàng'},
  {id: 'dat_truoc', label: 'Đặt trước'},
];

export const PosPcOrderListScreen: React.FC<{
  orders: DeliveryOrder[];
  onOpenInvoice: (o: DeliveryOrder) => void;
  onCancel: (o: DeliveryOrder) => void;
}> = ({orders, onOpenInvoice, onCancel}) => {
  const [tab, setTab] = useState<ListTab>('cho_giao_hang');

  // Khớp bản tablet: đơn rời khỏi màn Order NGAY khi đã gửi Grab Express (cukcukStatus
  // khác cho_gui_doi_tac) — chỉ theo dõi tiếp ở Sổ giao hàng, không hiện trùng 2 nơi.
  const deliveryOrders = orders.filter((o) => o.cukcukStatus === 'cho_gui_doi_tac');
  const countFor = (t: ListTab) => (t === 'cho_giao_hang' ? deliveryOrders.length : 0);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-3 pt-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative rounded-t-lg px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              tab === t.id ? 'text-brand' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label} ({countFor(t.id)})
            {tab === t.id && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" />}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {tab !== 'cho_giao_hang' ? (
          <EmptyState />
        ) : deliveryOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {deliveryOrders.map((o) => (
              <OrderCard key={o.id} order={o} onOpenInvoice={() => onOpenInvoice(o)} onCancel={() => onCancel(o)} />
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-500">
        <span>-Tất cả-</span>
        <span>
          Tổng số Order: <b className="text-slate-700">{tab === 'cho_giao_hang' ? deliveryOrders.length : 0}</b>
        </span>
      </div>
    </div>
  );
};

const OrderCard: React.FC<{order: DeliveryOrder; onOpenInvoice: () => void; onCancel: () => void}> = ({
  order,
  onOpenInvoice,
  onCancel,
}) => {
  const canSend = order.cukcukStatus === 'cho_gui_doi_tac';
  const done = order.cukcukStatus === 'da_thanh_toan';
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Header — khớp card gốc: mã order + giờ bên trái. Logo Grab Express (đủ lớn để
          nhận diện) đặt góc phải. */}
      <div className="flex items-center justify-between gap-2 bg-brand px-3 py-2 text-white">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold">{order.orderNo}</div>
          <div className="text-[10.5px] font-medium opacity-80">{order.scheduledTime}</div>
        </div>
        <GrabExpressLogo size={32} className="shrink-0 rounded-md" />
      </div>

      {/* Body — khớp card gốc: tên khách + SĐT + trạng thái + tổng tiền */}
      <div className="space-y-1 px-3 py-2.5">
        <div className="text-[13px] font-semibold text-slate-800">{order.customerName}</div>
        <div className="text-[11.5px] text-slate-400">{order.customerPhone}</div>
        <div className="pt-0.5">
          <GeStatusPill status={order.geStatus} />
        </div>
        <div className="pt-1 text-[13px] font-bold text-slate-800">{formatCurrency(order.subtotal + order.shippingFeeCustomer)}</div>
      </div>

      {/* Icon row — giữ nguyên bố cục gốc: 1 icon xe (giao hàng) + sửa + khách hàng + hủy, không thêm chữ */}
      <div className="flex items-center justify-around border-t border-slate-100 py-1.5">
        {canSend ? (
          <button onClick={onOpenInvoice} title="Giao hàng" className="flex h-8 w-8 items-center justify-center rounded-lg text-brand hover:bg-brand-light">
            <Truck size={16} />
          </button>
        ) : (
          <span title={done ? 'Đã thanh toán' : 'Grab Express đang tự động cập nhật trạng thái'} className="flex h-8 w-8 items-center justify-center text-slate-300">
            <Truck size={16} />
          </span>
        )}
        <button title="Chỉnh sửa" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
          <Pencil size={15} />
        </button>
        <button title="Khách hàng" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
          <User size={15} />
        </button>
        {!done && (
          <button onClick={onCancel} title="Hủy" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-danger">
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
    <Truck size={36} />
    <div className="text-[13px] text-slate-400">Không có order nào</div>
  </div>
);
