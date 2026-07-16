import React, {useMemo, useState} from 'react';
import {
  Banknote,
  Bell,
  CheckCircle2,
  RefreshCw,
  Search,
  Send,
  Truck,
  X,
} from 'lucide-react';
import type {
  AppNotification,
  ConnectionState,
  CukcukStatus,
  DeliveryOrder,
  GrabExpressStatus,
  ToastKind,
} from '../types';
import {
  CUKCUK_STATUS,
  GE_LIFECYCLE,
  GE_STATUS,
  formatCurrency,
} from '../constants';
import {
  AlertPopup,
  Button,
  ConfirmDialog,
  GeStatusPill,
  GrabExpressChip,
  Modal,
  inputCls,
} from '../components/ui';

interface Props {
  connection: ConnectionState;
  orders: DeliveryOrder[];
  setOrders: React.Dispatch<React.SetStateAction<DeliveryOrder[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
}

const CUKCUK_FILTER: {value: CukcukStatus | 'all'; label: string}[] = [
  {value: 'all', label: 'Tất cả'},
  {value: 'cho_gui_doi_tac', label: 'Chờ gửi đối tác'},
  {value: 'cho_giao_hang', label: 'Chờ giao hàng'},
  {value: 'dang_giao_hang', label: 'Đang giao hàng'},
  {value: 'da_thanh_toan', label: 'Đã thanh toán'},
];

const fullAddress = (o: DeliveryOrder) =>
  [o.address.freetext, o.address.ward, o.address.district, o.address.province]
    .filter(Boolean)
    .join(', ');

export const DeliveryBookSurface: React.FC<Props> = ({
  connection,
  orders,
  setOrders,
  notifications,
  setNotifications,
  pushToast,
}) => {
  const [cukcukF, setCukcukF] = useState<CukcukStatus | 'all'>('all');
  const [geF, setGeF] = useState<GrabExpressStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collectOrder, setCollectOrder] = useState<DeliveryOrder | null>(null);
  const [cancelOrder, setCancelOrder] = useState<DeliveryOrder | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const geOrders = orders; // toàn bộ đơn qua đối tác GE

  const filtered = useMemo(
    () =>
      geOrders.filter((o) => {
        if (cukcukF !== 'all' && o.cukcukStatus !== cukcukF) return false;
        if (geF !== 'all' && o.geStatus !== geF) return false;
        if (q.trim()) {
          const s = q.trim().toLowerCase();
          const hay = [o.trackingNo, o.invoiceNo, o.orderNo, o.customerName]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!hay.includes(s)) return false;
        }
        return true;
      }),
    [geOrders, cukcukF, geF, q],
  );

  const patch = (id: string, p: Partial<DeliveryOrder>) =>
    setOrders((os) => os.map((o) => (o.id === id ? {...o, ...p} : o)));

  // Mô phỏng GE cập nhật trạng thái -> tạo thông báo
  const simulateGeUpdate = () => {
    const target = orders.find(
      (o) =>
        o.trackingNo &&
        o.geStatus &&
        GE_LIFECYCLE.includes(o.geStatus) &&
        o.geStatus !== 'COMPLETED',
    );
    if (!target) {
      pushToast('info', 'Không có đơn đang giao vận', 'Hãy gửi một đơn sang GE để mô phỏng cập nhật.');
      return;
    }
    const idx = GE_LIFECYCLE.indexOf(target.geStatus!);
    const next = GE_LIFECYCLE[Math.min(idx + 1, GE_LIFECYCLE.length - 1)];
    patch(target.id, {geStatus: next});
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
    pushToast(
      'info',
      'Grab Express cập nhật trạng thái',
      `Đơn ${refNo} (${target.trackingNo}) · ${GE_STATUS[next].label}`,
    );
  };

  const openNotif = (n: AppNotification) => {
    setNotifications((ns) => ns.map((x) => (x.id === n.id ? {...x, read: true} : x)));
    setSelectedId(n.orderId);
    setCukcukF('all');
    setGeF('all');
    setQ('');
    setNotifOpen(false);
    // scroll into view
    setTimeout(() => document.getElementById('row-' + n.orderId)?.scrollIntoView({block: 'center', behavior: 'smooth'}), 60);
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-border-neutral-light bg-white px-5 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-primary">Sổ giao hàng</h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<RefreshCw size={15} />} onClick={simulateGeUpdate}>
              Mô phỏng GE cập nhật
            </Button>
            <div className="relative">
              <Button variant="secondary" size="sm" icon={<Bell size={15} />} onClick={() => setNotifOpen((v) => !v)}>
                Thông báo
                {unread > 0 && (
                  <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </Button>
              {notifOpen && (
                <NotifPanel
                  notifications={notifications}
                  onClose={() => setNotifOpen(false)}
                  onOpen={openNotif}
                />
              )}
            </div>
          </div>
        </div>

        {/* Tabs đối tác */}
        <div className="flex items-center gap-1">
          {['Nhà hàng tự giao', 'AhaMove', 'Grab Express'].map((t) => (
            <button
              key={t}
              className={`relative rounded-t-lg px-4 py-2 text-[13px] font-semibold ${
                t === 'Grab Express'
                  ? 'text-grab'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {t === 'Grab Express' && <GrabExpressChip />}
                {t !== 'Grab Express' && t}
              </span>
              {t === 'Grab Express' && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-grab" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border-neutral-light bg-white px-5 py-3">
        <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
          <span>Từ ngày</span>
          <input type="date" defaultValue="2026-07-16" className={inputCls() + ' h-9 w-40'} />
          <span>đến</span>
          <input type="date" defaultValue="2026-07-16" className={inputCls() + ' h-9 w-40'} />
        </div>
        <select value={cukcukF} onChange={(e) => setCukcukF(e.target.value as any)} className={inputCls() + ' h-9 w-48'}>
          {CUKCUK_FILTER.map((f) => (
            <option key={f.value} value={f.value}>
              Trạng thái CukCuk: {f.label}
            </option>
          ))}
        </select>
        <select value={geF} onChange={(e) => setGeF(e.target.value as any)} className={inputCls() + ' h-9 w-56'}>
          <option value="all">Trạng thái GE: Tất cả</option>
          {(Object.keys(GE_STATUS) as GrabExpressStatus[]).map((k) => (
            <option key={k} value={k}>
              {k} — {GE_STATUS[k].label}
            </option>
          ))}
        </select>
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-icon-neutral" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm Mã vận đơn, Số hóa đơn, khách hàng"
            className={inputCls() + ' h-9 pl-9'}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="min-h-0 flex-1 overflow-auto bg-[#f0f2f4] p-5">
        <div className="overflow-hidden rounded-2xl border border-border-neutral-light bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="sticky top-0 z-10 bg-gray-50 text-[12px] font-semibold text-text-secondary">
              <tr>
                <th className="px-4 py-3">Mã vận đơn / Số HĐ</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3 whitespace-nowrap">Giờ hẹn trả</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Phí thu khách</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Phí trả đối tác</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái GE</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-neutral-light">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-icon-neutral">
                      <Truck size={22} />
                    </div>
                    <div className="text-[13px] font-semibold text-text-primary">Không có đơn phù hợp</div>
                    <div className="text-[12px] text-text-hint">Thử đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm.</div>
                  </td>
                </tr>
              )}
              {filtered.map((o) => {
                const st = CUKCUK_STATUS[o.cukcukStatus];
                const selected = selectedId === o.id;
                return (
                  <tr
                    key={o.id}
                    id={'row-' + o.id}
                    className={`align-top transition-colors ${
                      selected ? 'bg-grab-light/60 ring-1 ring-inset ring-grab/40' : 'hover:bg-gray-50/60'
                    }`}
                    onClick={() => setSelectedId(o.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-text-primary">{o.trackingNo ?? '—'}</div>
                      <div className="text-[11px] text-text-hint">{o.invoiceNo ?? o.orderNo}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-text-primary">{o.customerName}</div>
                      <div className="max-w-[240px] text-[11.5px] leading-snug text-text-secondary">{fullAddress(o)}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{o.scheduledTime}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-text-primary">
                      {formatCurrency(o.shippingFeeCustomer)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-text-secondary">
                      {formatCurrency(o.shippingFeePartner)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-black text-text-primary">
                      {formatCurrency(o.subtotal + o.shippingFeeCustomer)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <GeStatusPill status={o.geStatus} />
                        <span
                          className="w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold"
                          style={{color: st.color, background: st.bg}}
                        >
                          {st.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RowActions
                        order={o}
                        onSend={() => {
                          if (!connection.isConnected) {
                            pushToast('warning', 'Chưa kết nối Grab Express');
                            return;
                          }
                          patch(o.id, {
                            cukcukStatus: 'cho_giao_hang',
                            geStatus: 'ALLOCATING',
                            trackingNo: o.trackingNo ?? 'GE-' + Math.floor(8_800_000_000 + Math.abs(o.id.length * 918_271)),
                          });
                          pushToast('success', 'Đã gửi đơn sang Grab Express', 'Chuyển sang Chờ giao hàng.');
                        }}
                        onDeliver={() => {
                          patch(o.id, {cukcukStatus: 'dang_giao_hang'});
                          pushToast('success', 'Đã giao hàng', 'Chuyển sang Đang giao hàng.');
                        }}
                        onCollect={() => setCollectOrder(o)}
                        onCancel={() => setCancelOrder(o)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-[12px] text-text-hint">
          <span className="mt-0.5">ℹ️</span>
          <span>
            Lưu ý: Đơn đã chuyển đối tác thì hệ thống <b>chỉ nhận trạng thái do GE trả về</b>, không tự map và tự chuyển
            trạng thái trên CukCuk — thu ngân phải tự thao tác với đơn hàng.
          </span>
        </p>
      </div>

      {/* Thu tiền khách hàng */}
      {collectOrder && (
        <CollectModal
          order={collectOrder}
          onClose={() => setCollectOrder(null)}
          onConfirm={() => {
            patch(collectOrder.id, {cukcukStatus: 'da_thanh_toan'});
            pushToast('success', 'Đã thu tiền', 'Đơn chuyển sang Đã thanh toán.');
            setCollectOrder(null);
          }}
        />
      )}

      {/* Hủy đơn */}
      <ConfirmDialog
        open={!!cancelOrder}
        title="Hủy đơn giao hàng"
        tone="danger"
        message={
          cancelOrder?.cukcukStatus === 'cho_giao_hang'
            ? 'Hủy đơn này sẽ đồng thời gửi trạng thái Hủy sang Grab Express. Bạn chắc chắn?'
            : 'Bạn có chắc chắn muốn hủy đơn giao hàng này?'
        }
        onConfirm={() => {
          if (cancelOrder) {
            const sentToGe = cancelOrder.cukcukStatus === 'cho_giao_hang';
            setOrders((os) => os.filter((x) => x.id !== cancelOrder.id));
            pushToast('info', 'Đã hủy đơn', sentToGe ? 'Đã gửi trạng thái Hủy sang Grab Express.' : undefined);
          }
          setCancelOrder(null);
        }}
        onCancel={() => setCancelOrder(null)}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
const RowActions: React.FC<{
  order: DeliveryOrder;
  onSend: () => void;
  onDeliver: () => void;
  onCollect: () => void;
  onCancel: () => void;
}> = ({order, onSend, onDeliver, onCollect, onCancel}) => {
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };
  if (order.cukcukStatus === 'da_thanh_toan')
    return (
      <div className="flex justify-end">
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[12px] font-semibold text-green-700">
          <CheckCircle2 size={13} /> Đã thanh toán
        </span>
      </div>
    );
  return (
    <div className="flex items-center justify-end gap-1.5">
      {order.cukcukStatus === 'cho_gui_doi_tac' && (
        <Button variant="grab" size="sm" icon={<Send size={14} />} onClick={stop(onSend)}>
          Gửi đơn
        </Button>
      )}
      {order.cukcukStatus === 'cho_giao_hang' && (
        <Button variant="grab" size="sm" icon={<Truck size={14} />} onClick={stop(onDeliver)}>
          Giao hàng
        </Button>
      )}
      {order.cukcukStatus === 'dang_giao_hang' && (
        <Button variant="grab" size="sm" icon={<Banknote size={14} />} onClick={stop(onCollect)}>
          Thu tiền
        </Button>
      )}
      <button
        onClick={stop(onCancel)}
        title="Hủy"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-icon-neutral hover:bg-red-50 hover:text-danger"
      >
        <X size={15} />
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
const CollectModal: React.FC<{
  order: DeliveryOrder;
  onClose: () => void;
  onConfirm: () => void;
}> = ({order, onClose, onConfirm}) => {
  const total = order.subtotal + order.shippingFeeCustomer;
  return (
    <Modal
      open
      onClose={onClose}
      width={420}
      title={`Thu tiền khách · ${order.orderNo}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="grab" onClick={onConfirm} className="min-w-[120px]">
            Đồng ý
          </Button>
        </>
      }
    >
      <div className="mb-3 text-[13px] text-text-secondary">
        Khách: <b className="text-text-primary">{order.customerName}</b> · {order.customerPhone}
      </div>
      <div className="space-y-2 rounded-xl bg-gray-50 p-4 text-[13px]">
        <div className="flex justify-between">
          <span className="text-text-secondary">Tiền hàng</span>
          <span className="font-medium">{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Phí GH thu khách</span>
          <span className="font-medium">{formatCurrency(order.shippingFeeCustomer)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border-neutral-light pt-2">
          <span className="font-semibold">Khách phải trả</span>
          <span className="text-[18px] font-black text-brand">{formatCurrency(total)}</span>
        </div>
      </div>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
const NotifPanel: React.FC<{
  notifications: AppNotification[];
  onClose: () => void;
  onOpen: (n: AppNotification) => void;
}> = ({notifications, onClose, onOpen}) => (
  <>
    <div className="fixed inset-0 z-20" onClick={onClose} />
    <div className="animate-scale-up absolute right-0 top-full z-30 mt-2 w-[360px] overflow-hidden rounded-2xl border border-border-neutral-light bg-white shadow-xl">
      <div className="border-b border-border-neutral-light px-4 py-3 text-[13px] font-semibold text-text-primary">
        Thông báo từ Grab Express
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-10 text-center text-[12px] text-text-hint">
            Chưa có thông báo. Nhấn <b>Mô phỏng GE cập nhật</b> để xem.
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => onOpen(n)}
              className={`flex w-full gap-3 border-b border-border-neutral-light px-4 py-3 text-left hover:bg-gray-50 ${
                n.read ? '' : 'bg-grab-light/30'
              }`}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grab-light text-grab">
                <Truck size={15} />
              </span>
              <div className="min-w-0">
                <div className="text-[12.5px] leading-snug text-text-primary">
                  Đơn hàng <b>{n.refNo}</b> ({n.trackingNo}) của khách hàng <b>{n.customerName}</b> đã được Grab Express
                  cập nhật trạng thái <b>{GE_STATUS[n.geStatus].label}</b>
                </div>
                <div className="mt-0.5 text-[11px] text-text-hint">{n.time} · Bấm để mở đúng hóa đơn</div>
              </div>
              {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-grab" />}
            </button>
          ))
        )}
      </div>
    </div>
  </>
);
