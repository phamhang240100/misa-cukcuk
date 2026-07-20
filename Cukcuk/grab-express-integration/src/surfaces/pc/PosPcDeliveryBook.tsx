import React, {useMemo, useState} from 'react';
import {Bell, RefreshCw, Search, Send, Truck, X, RotateCcw} from 'lucide-react';
import type {AppNotification, DeliveryOrder, GrabExpressStatus, ToastKind} from '../../types';
import {GE_LIFECYCLE, GE_STATUS, formatCurrency} from '../../constants';
import {Button, ConfirmDialog, GeStatusPill, Modal} from '../../components/ui';
import {DriverMapMock} from '../../components/DriverMapMock';
import {PosPcCollectModal} from './PosPcCollectModal';

const DEMO_DRIVERS = [
  {driverName: 'Nguyễn Văn Hùng', driverPhone: '0977 234 561'},
  {driverName: 'Trần Quốc Bảo', driverPhone: '0983 456 789'},
  {driverName: 'Lê Minh Đức', driverPhone: '0912 678 345'},
];

const PARTNER_TABS = ['Nhà hàng tự giao', 'Đối tác Ahamove', 'Loship', 'Đối tác Grab Express'];

const FINPUT = 'h-8 rounded-md border border-slate-300 bg-white px-2.5 text-[13px] text-slate-700 outline-none focus:border-brand';

const fullAddress = (o: DeliveryOrder) =>
  [o.address.freetext, o.address.ward, o.address.district, o.address.province].filter(Boolean).join(', ');

export const PosPcDeliveryBook: React.FC<{
  orders: DeliveryOrder[];
  setOrders: React.Dispatch<React.SetStateAction<DeliveryOrder[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
}> = ({orders, setOrders, notifications, setNotifications, pushToast}) => {
  const [geF, setGeF] = useState<GrabExpressStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collectOrder, setCollectOrder] = useState<DeliveryOrder | null>(null);
  const [cancelOrder, setCancelOrder] = useState<DeliveryOrder | null>(null);
  const [returnOrder, setReturnOrder] = useState<DeliveryOrder | null>(null);
  const [mapOrder, setMapOrder] = useState<DeliveryOrder | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (geF !== 'all' && o.geStatus !== geF) return false;
        if (q.trim()) {
          const s = q.trim().toLowerCase();
          const hay = [o.trackingNo, o.invoiceNo, o.orderNo, o.customerName].filter(Boolean).join(' ').toLowerCase();
          if (!hay.includes(s)) return false;
        }
        return true;
      }),
    [orders, geF, q],
  );

  const patch = (id: string, p: Partial<DeliveryOrder>) => setOrders((os) => os.map((o) => (o.id === id ? {...o, ...p} : o)));

  const reopen = (o: DeliveryOrder) => {
    patch(o.id, {cukcukStatus: 'cho_gui_doi_tac', geStatus: undefined, trackingNo: undefined});
    pushToast('info', 'Đã mở lại đơn', 'Đơn quay về Chờ gửi đối tác — gửi lại hoặc đổi đối tác.');
  };

  const simulateGeUpdate = () => {
    const target = orders.find(
      (o) => o.trackingNo && o.geStatus && GE_LIFECYCLE.includes(o.geStatus) && o.geStatus !== 'COMPLETED',
    );
    if (!target) {
      pushToast('info', 'Không có đơn đang giao vận', 'Hãy gửi một đơn sang Grab Express để mô phỏng cập nhật.');
      return;
    }
    const idx = GE_LIFECYCLE.indexOf(target.geStatus!);
    const next = GE_LIFECYCLE[Math.min(idx + 1, GE_LIFECYCLE.length - 1)];
    const autoSync: Partial<DeliveryOrder> =
      ['PICKING_UP', 'PENDING_DROP_OFF', 'IN_DELIVERY'].includes(next) && target.cukcukStatus === 'cho_giao_hang'
        ? {cukcukStatus: 'dang_giao_hang'}
        : {};
    const driverAssign: Partial<DeliveryOrder> =
      next !== 'ALLOCATING' && next !== 'PENDING_PICKUP' && !target.driverName
        ? DEMO_DRIVERS[Math.floor(Math.random() * DEMO_DRIVERS.length)]
        : {};
    patch(target.id, {geStatus: next, geStatusUpdatedAt: 'vừa xong', ...autoSync, ...driverAssign});
    const refNo = target.invoiceNo ?? target.orderNo;
    const notif: AppNotification = {
      id: 'n' + Date.now(),
      orderId: target.id,
      refNo,
      trackingNo: target.trackingNo!,
      customerName: target.customerName,
      geStatus: next,
      read: false,
      time: 'vừa xong',
    };
    setNotifications((ns) => [notif, ...ns]);
    if (next === 'COMPLETED') {
      pushToast('warning', 'Chờ thu tiền', `Đơn ${refNo} đã giao xong — mở nút Thu tiền để đóng đơn.`);
    } else {
      pushToast('info', 'Grab Express cập nhật trạng thái', `Đơn ${refNo} · ${GE_STATUS[next].label}`);
    }
  };

  const unread = notifications.filter((n) => !n.read).length;
  const sum = (fn: (o: DeliveryOrder) => number) => filtered.reduce((s, o) => s + fn(o), 0);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Tab đối tác */}
      <div className="flex shrink-0 items-center gap-1 border-b border-slate-200 px-3 pt-2">
        {PARTNER_TABS.map((t) => {
          const active = t === 'Đối tác Grab Express';
          return (
            <button
              key={t}
              className={`relative rounded-t-lg px-4 py-2 text-[13px] font-semibold transition-colors ${
                active ? 'text-brand' : 'text-slate-400'
              }`}
            >
              {t}
              {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" />}
            </button>
          );
        })}
      </div>

      {/* Bộ lọc */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 px-3 py-2">
        <span className="text-[12px] text-slate-500">Từ</span>
        <input type="date" defaultValue="2026-07-20" className={FINPUT + ' w-[128px]'} />
        <span className="text-[12px] text-slate-500">đến</span>
        <input type="date" defaultValue="2026-07-20" className={FINPUT + ' w-[128px]'} />
        <select value={geF} onChange={(e) => setGeF(e.target.value as GrabExpressStatus | 'all')} className={FINPUT + ' w-56'}>
          <option value="all">Tất cả trạng thái Grab Express</option>
          {(Object.keys(GE_STATUS) as GrabExpressStatus[]).map((k) => (
            <option key={k} value={k}>
              {GE_STATUS[k].label}
            </option>
          ))}
        </select>
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm Mã vận đơn, Số hóa đơn, khách hàng…"
            className={FINPUT + ' w-full pl-8'}
          />
        </div>
        <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={simulateGeUpdate}>
          Mô phỏng Grab Express
        </Button>
        <div className="relative">
          <Button variant="secondary" size="sm" icon={<Bell size={14} />} onClick={() => setNotifOpen((v) => !v)}>
            Thông báo
            {unread > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
              <div className="animate-scale-up absolute right-0 top-full z-30 mt-2 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-800">
                  Thông báo từ Grab Express
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center text-[12px] text-slate-400">
                      Chưa có thông báo. Nhấn <b>Mô phỏng Grab Express</b> để xem.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          setNotifications((ns) => ns.map((x) => (x.id === n.id ? {...x, read: true} : x)));
                          setSelectedId(n.orderId);
                          setNotifOpen(false);
                        }}
                        className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${
                          n.read ? '' : 'bg-brand-light/40'
                        }`}
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                          <Truck size={15} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[12.5px] leading-snug text-slate-700">
                            Đơn hàng <b>{n.refNo}</b> ({n.trackingNo}) của khách hàng <b>{n.customerName}</b> đã được Grab
                            Express cập nhật trạng thái <b>{GE_STATUS[n.geStatus].label}</b>
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-400">{n.time} · Bấm để mở đúng hóa đơn</div>
                        </div>
                        {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bảng */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[#FAFAFA] text-[12px] font-semibold text-slate-600 shadow-[0_1px_0_#E9EAEB]">
            <tr>
              <th className="px-4 py-3">Mã vận đơn / hóa đơn</th>
              <th className="px-4 py-3">Order/Hóa đơn</th>
              <th className="px-4 py-3">Tên khách hàng</th>
              <th className="whitespace-nowrap px-4 py-3">SĐT tài xế</th>
              <th className="whitespace-nowrap px-4 py-3">Giờ hẹn trả</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">Phí GH thu khách</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">Phí GH trả đối tác</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-3 py-3">Trạng thái Grab Express</th>
              <th className="whitespace-nowrap px-3 py-3">Thời gian</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-24 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Truck size={22} />
                  </div>
                  <div className="text-[13px] font-semibold text-slate-700">Không có đơn phù hợp</div>
                  <div className="text-[12px] text-slate-400">Thử đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm.</div>
                </td>
              </tr>
            )}
            {filtered.map((o) => {
              const selected = selectedId === o.id;
              return (
                <tr
                  key={o.id}
                  id={'row-' + o.id}
                  onClick={() => setSelectedId(o.id)}
                  onDoubleClick={() => o.geStatus && setMapOrder(o)}
                  title={o.geStatus ? 'Nhấp đúp để xem lộ trình vận chuyển' : undefined}
                  className={`align-top transition-colors ${selected ? 'bg-brand-light' : 'hover:bg-slate-50'} ${
                    o.geStatus ? 'cursor-pointer' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-bold text-slate-800">{o.trackingNo ?? '—'}</td>
                  <td className="px-4 py-2.5 text-slate-600">{o.invoiceNo ?? o.orderNo}</td>
                  <td className="max-w-[200px] px-4 py-2.5">
                    <div className="truncate font-semibold text-slate-800" title={o.customerName}>
                      {o.customerName}
                    </div>
                    <div className="line-clamp-2 text-[11.5px] leading-snug text-slate-500" title={fullAddress(o)}>
                      {fullAddress(o)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-600">{o.driverPhone ?? '—'}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-600">{o.scheduledTime}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right font-medium text-slate-800">
                    {formatCurrency(o.shippingFeeCustomer)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right text-slate-500">{formatCurrency(o.shippingFeePartner)}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right font-black text-slate-800">
                    {formatCurrency(o.subtotal + o.shippingFeeCustomer)}
                  </td>
                  <td className="px-3 py-2.5">
                    {o.geStatus ? <GeStatusPill status={o.geStatus} /> : <span className="text-[12px] text-slate-400">Chưa gửi đối tác</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-slate-500">{o.geStatusUpdatedAt ?? '—'}</td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <PcRowActions
                      order={o}
                      onSend={() => {
                        patch(o.id, {
                          cukcukStatus: 'cho_giao_hang',
                          geStatus: 'ALLOCATING',
                          geStatusUpdatedAt: 'vừa xong',
                          trackingNo: o.trackingNo ?? 'GE-' + Math.floor(8_800_000_000 + Math.abs(o.id.length * 918_271)),
                        });
                        pushToast('success', 'Đã gửi đơn sang Grab Express', 'Chuyển sang Chờ giao hàng.');
                      }}
                      onResend={() => reopen(o)}
                      onReturned={() => setReturnOrder(o)}
                      onCollect={() => setCollectOrder(o)}
                      onCancel={() => setCancelOrder(o)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          {filtered.length > 0 && (
            <tfoot className="sticky bottom-0 bg-[#FAFAFA] text-[13px] font-bold text-slate-800 shadow-[0_-1px_0_#E9EAEB]">
              <tr>
                <td className="px-4 py-2.5" colSpan={5}>
                  Tổng: {filtered.length} đơn
                </td>
                <td className="px-4 py-2.5 text-right">{formatCurrency(sum((o) => o.shippingFeeCustomer))}</td>
                <td className="px-4 py-2.5 text-right">{formatCurrency(sum((o) => o.shippingFeePartner))}</td>
                <td className="px-4 py-2.5 text-right">{formatCurrency(sum((o) => o.subtotal + o.shippingFeeCustomer))}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {collectOrder && (
        <PosPcCollectModal
          order={collectOrder}
          onClose={() => setCollectOrder(null)}
          onConfirm={() => {
            patch(collectOrder.id, {cukcukStatus: 'da_thanh_toan'});
            pushToast('success', 'Đã thu tiền', 'Đơn chuyển sang Đã thanh toán.');
            setCollectOrder(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!cancelOrder}
        contained
        title="Hủy đơn giao hàng"
        tone="danger"
        message={
          cancelOrder && ['ALLOCATING', 'PENDING_PICKUP', 'PICKING_UP'].includes(cancelOrder.geStatus ?? '')
            ? 'Đơn đang ở giai đoạn còn hủy được — hệ thống sẽ gửi lệnh Hủy vận đơn sang Grab Express. Bạn chắc chắn?'
            : 'Bạn có chắc chắn muốn hủy đơn giao hàng này (xử lý phía CukCuk)?'
        }
        onConfirm={() => {
          if (cancelOrder) {
            const toGrab = ['ALLOCATING', 'PENDING_PICKUP', 'PICKING_UP'].includes(cancelOrder.geStatus ?? '');
            setOrders((os) => os.filter((x) => x.id !== cancelOrder.id));
            pushToast('info', 'Đã hủy đơn', toGrab ? 'Đã gửi lệnh Hủy vận đơn sang Grab Express.' : undefined);
          }
          setCancelOrder(null);
        }}
        onCancel={() => setCancelOrder(null)}
      />

      {returnOrder && (
        <Modal
          open
          contained
          width={460}
          onClose={() => setReturnOrder(null)}
          title="Đơn bị hoàn về quán"
          footer={
            <>
              <Button
                variant="danger"
                onClick={() => {
                  setOrders((os) => os.filter((x) => x.id !== returnOrder.id));
                  pushToast('info', 'Đã hủy đơn hoàn');
                  setReturnOrder(null);
                }}
              >
                Hủy đơn
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  reopen(returnOrder);
                  setReturnOrder(null);
                }}
              >
                Gửi lại
              </Button>
            </>
          }
        >
          <p className="text-[13px] leading-relaxed text-slate-600">
            Grab Express báo <b>Trả hàng</b> — món đã ra khỏi quán rồi được hoàn về (có thể đã hỏng). Vui lòng kiểm tra và
            chọn: <b>Gửi lại</b> nếu món còn tốt, hoặc <b>Hủy đơn</b>.
          </p>
        </Modal>
      )}

      {mapOrder && <DriverMapMock order={mapOrder} onClose={() => setMapOrder(null)} contained />}
    </div>
  );
};

const PcRowActions: React.FC<{
  order: DeliveryOrder;
  onSend: () => void;
  onResend: () => void;
  onReturned: () => void;
  onCollect: () => void;
  onCancel: () => void;
}> = ({order, onSend, onResend, onReturned, onCollect, onCancel}) => {
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  if (order.cukcukStatus === 'da_thanh_toan') {
    return (
      <div className="flex items-center justify-end gap-1.5 text-[12.5px] font-semibold text-green-600">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50">✓</span> Đã thanh toán
      </div>
    );
  }

  const failed = order.geStatus === 'FAILED' || order.geStatus === 'CANCELLED';
  const returned = order.geStatus === 'RETURNED';
  const readyCollect = order.geStatus === 'COMPLETED';

  return (
    <div className="flex items-center justify-end gap-1.5">
      {failed ? (
        <button onClick={stop(onResend)} className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md bg-brand px-3 text-[12.5px] font-semibold text-white hover:brightness-105">
          <Send size={13} /> Gửi lại
        </button>
      ) : returned ? (
        <button onClick={stop(onReturned)} className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md bg-brand px-3 text-[12.5px] font-semibold text-white hover:brightness-105">
          <RotateCcw size={13} /> Xử lý hoàn
        </button>
      ) : order.cukcukStatus === 'cho_gui_doi_tac' ? (
        <button onClick={stop(onSend)} className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md bg-[#17B7C7] px-3 text-[12.5px] font-semibold text-white hover:brightness-105">
          <Truck size={14} /> Giao hàng
        </button>
      ) : readyCollect ? (
        <button onClick={stop(onCollect)} className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md bg-[#F59E0B] px-3 text-[12.5px] font-semibold text-white hover:brightness-105">
          <span className="text-[13px]">$</span> Thu tiền
        </button>
      ) : null /* Chờ giao hàng / Đang giao hàng: tự đồng bộ theo webhook GE, chỉ còn nút Hủy — khớp bản tablet */}
      <button onClick={stop(onCancel)} title="Hủy" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-danger">
        <X size={15} />
      </button>
    </div>
  );
};
