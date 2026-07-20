import React, {useMemo, useState} from 'react';
import {
  Banknote,
  Bell,
  ChevronDown,
  Cloud,
  Home,
  Menu,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Truck,
  User,
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
import {CUKCUK_STATUS, GE_LIFECYCLE, GE_STATUS, formatCurrency} from '../constants';
import {Button, ConfirmDialog, GeStatusPill, Modal} from '../components/ui';
import {DriverMapMock} from '../components/DriverMapMock';

// Tài xế demo — gán khi đơn chuyển PICKING_UP trở đi (mô phỏng GE trả về).
const DEMO_DRIVERS = [
  {driverName: 'Nguyễn Văn Hùng', driverPhone: '0977 234 561'},
  {driverName: 'Trần Quốc Bảo', driverPhone: '0983 456 789'},
  {driverName: 'Lê Minh Đức', driverPhone: '0912 678 345'},
];

// Ô lọc (không ép w-full để nằm gọn 1 hàng ngang)
const FINPUT =
  'h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-brand';

interface Props {
  connection: ConnectionState;
  orders: DeliveryOrder[];
  setOrders: React.Dispatch<React.SetStateAction<DeliveryOrder[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
  goToOrder?: () => void;
}

const CUKCUK_FILTER: {value: CukcukStatus | 'all'; label: string}[] = [
  {value: 'all', label: 'Tất cả'},
  {value: 'cho_gui_doi_tac', label: 'Chờ gửi đối tác'},
  {value: 'cho_giao_hang', label: 'Chờ giao hàng'},
  {value: 'dang_giao_hang', label: 'Đang giao hàng'},
  {value: 'da_thanh_toan', label: 'Đã thanh toán'},
];

const PARTNER_TABS = ['Nhà hàng tự giao', 'Đối tác AhaMove', 'Loship', 'Đối tác Grab Express'];

const fullAddress = (o: DeliveryOrder) =>
  [o.address.freetext, o.address.ward, o.address.district, o.address.province]
    .filter(Boolean)
    .join(', ');

export const DeliveryBookSurface: React.FC<Props> = ({
  orders,
  setOrders,
  notifications,
  setNotifications,
  pushToast,
  goToOrder,
}) => {
  const [cukcukF, setCukcukF] = useState<CukcukStatus | 'all'>('all');
  const [geF, setGeF] = useState<GrabExpressStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collectOrder, setCollectOrder] = useState<DeliveryOrder | null>(null);
  const [cancelOrder, setCancelOrder] = useState<DeliveryOrder | null>(null);
  const [returnOrder, setReturnOrder] = useState<DeliveryOrder | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mapOrder, setMapOrder] = useState<DeliveryOrder | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
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
    [orders, cukcukF, geF, q],
  );

  const patch = (id: string, p: Partial<DeliveryOrder>) =>
    setOrders((os) => os.map((o) => (o.id === id ? {...o, ...p} : o)));

  const reopen = (o: DeliveryOrder) => {
    // FR-pos-050/052 — mở lại về Chờ gửi đối tác, xóa mã vận đơn/GE cũ (dùng lại đơn cũ).
    patch(o.id, {cukcukStatus: 'cho_gui_doi_tac', geStatus: undefined, trackingNo: undefined});
    pushToast('info', 'Đã mở lại đơn', 'Đơn quay về Chờ gửi đối tác — gửi lại hoặc đổi đối tác.');
  };

  // Mô phỏng GE cập nhật trạng thái (Hybrid auto-sync) -> tạo thông báo
  const simulateGeUpdate = () => {
    const target = orders.find(
      (o) =>
        o.trackingNo &&
        o.geStatus &&
        GE_LIFECYCLE.includes(o.geStatus) &&
        o.geStatus !== 'COMPLETED',
    );
    if (!target) {
      pushToast('info', 'Không có đơn đang giao vận', 'Hãy gửi một đơn sang Grab Express để mô phỏng cập nhật.');
      return;
    }
    const idx = GE_LIFECYCLE.indexOf(target.geStatus!);
    const next = GE_LIFECYCLE[Math.min(idx + 1, GE_LIFECYCLE.length - 1)];
    // FR-pos-031 — GE PICKING_UP tự đẩy Chờ giao hàng → Đang giao hàng (không có nút Giao hàng thủ công).
    const autoSync: Partial<DeliveryOrder> =
      ['PICKING_UP', 'PENDING_DROP_OFF', 'IN_DELIVERY'].includes(next) &&
      target.cukcukStatus === 'cho_giao_hang'
        ? {cukcukStatus: 'dang_giao_hang'}
        : {};
    // Gán tài xế demo khi tài xế bắt đầu tới lấy hàng trở đi (nếu đơn chưa có).
    const driverAssign: Partial<DeliveryOrder> =
      next !== 'ALLOCATING' && next !== 'PENDING_PICKUP' && !target.driverName
        ? DEMO_DRIVERS[Math.floor(Math.random() * DEMO_DRIVERS.length)]
        : {};
    patch(target.id, {
      geStatus: next,
      geStatusUpdatedAt: 'vừa xong',
      ...autoSync,
      ...driverAssign,
    });
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
    // FR-pos-032 — COMPLETED: banner Chờ thu tiền, không tự đóng.
    if (next === 'COMPLETED') {
      pushToast('warning', 'Chờ thu tiền', `Đơn ${refNo} đã giao xong — mở nút Thu tiền để đóng đơn.`);
    } else {
      pushToast('info', 'Grab Express cập nhật trạng thái', `Đơn ${refNo} · ${GE_STATUS[next].label}`);
    }
  };

  const openNotif = (n: AppNotification) => {
    setNotifications((ns) => ns.map((x) => (x.id === n.id ? {...x, read: true} : x)));
    setSelectedId(n.orderId);
    setCukcukF('all');
    setGeF('all');
    setQ('');
    setNotifOpen(false);
    setTimeout(
      () => document.getElementById('row-' + n.orderId)?.scrollIntoView({block: 'center', behavior: 'smooth'}),
      60,
    );
  };

  const unread = notifications.filter((n) => !n.read).length;
  const sum = (fn: (o: DeliveryOrder) => number) => filtered.reduce((s, o) => s + fn(o), 0);

  return (
    <div className="flex h-full items-center justify-center overflow-auto bg-[#e7e9ee] p-4">
      {/* Khung tablet */}
      <div className="relative flex h-[772px] w-[1161px] max-h-full max-w-full shrink-0 flex-col overflow-hidden rounded-[32px] border-[14px] border-slate-950 bg-slate-950 shadow-[0_30px_70px_-10px_rgba(15,23,42,0.35)]">
        <div className="relative flex h-full w-full select-text flex-col overflow-hidden rounded-[18px] bg-[#EEF0F4]">
          {/* ===== Thanh xanh POS trên cùng ===== */}
          <header className="flex h-12 shrink-0 items-center justify-between bg-brand px-2 text-white">
            <div className="flex h-full items-center">
              <button
                onClick={goToOrder}
                title="Về màn Order"
                className="flex h-full items-center gap-1.5 px-3 hover:bg-white/10"
              >
                <Home className="h-5 w-5" />
              </button>
              <div className="flex h-full items-center gap-2 bg-white/15 px-4 text-[13px] font-semibold">
                <Receipt className="h-4 w-4" /> Sổ giao hàng
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={goToOrder}
                className="flex h-8 items-center gap-1.5 rounded bg-white/15 px-2.5 text-[13px] font-bold hover:bg-white/25"
              >
                <Plus className="h-4 w-4" /> ORDER
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              </button>
              {[Menu, Cloud, RefreshCw, Receipt, Phone].map((Icon, i) => (
                <button key={i} className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/15">
                  <Icon className="h-[18px] w-[18px]" />
                </button>
              ))}
              <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <User className="h-[18px] w-[18px]" />
              </button>
            </div>
          </header>

          {/* ===== Tab đối tác ===== */}
          <div className="flex shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-3 pt-2">
            {PARTNER_TABS.map((t) => {
              const active = t === 'Đối tác Grab Express';
              return (
                <button
                  key={t}
                  className={`relative rounded-t-lg px-4 py-2 text-[13px] font-semibold transition-colors ${
                    active ? 'text-brand' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                  {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" />}
                </button>
              );
            })}
          </div>

          {/* ===== Bộ lọc (1 hàng ngang như UI cũ) ===== */}
          <div className="flex shrink-0 flex-nowrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
            <span className="shrink-0 text-[12px] text-slate-500">Từ</span>
            <input type="date" defaultValue="2026-07-16" className={FINPUT + ' w-[130px] shrink-0'} />
            <span className="shrink-0 text-[12px] text-slate-500">đến</span>
            <input type="date" defaultValue="2026-07-16" className={FINPUT + ' w-[130px] shrink-0'} />
            <select
              value={cukcukF}
              onChange={(e) => setCukcukF(e.target.value as CukcukStatus | 'all')}
              className={FINPUT + ' w-36 shrink-0'}
            >
              {CUKCUK_FILTER.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <select
              value={geF}
              onChange={(e) => setGeF(e.target.value as GrabExpressStatus | 'all')}
              className={FINPUT + ' w-52 shrink-0'}
            >
              <option value="all">Tất cả trạng thái Grab Express</option>
              {(Object.keys(GE_STATUS) as GrabExpressStatus[]).map((k) => (
                <option key={k} value={k}>
                  {GE_STATUS[k].label}
                </option>
              ))}
            </select>
            <div className="relative min-w-0 flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm Mã vận đơn, Số hóa đơn, khách hàng…"
                className={FINPUT + ' w-full pl-9'}
              />
            </div>
            {/* Affordance demo (không thuộc UI thật) */}
            <Button variant="secondary" size="sm" icon={<RefreshCw size={15} />} onClick={simulateGeUpdate}>
              Mô phỏng Grab Express
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
                <NotifPanel notifications={notifications} onClose={() => setNotifOpen(false)} onOpen={openNotif} />
              )}
            </div>
          </div>

          {/* ===== Bảng ===== */}
          <div className="min-h-0 flex-1 overflow-auto bg-white">
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
                    <td colSpan={11} className="px-4 py-20 text-center">
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
                      className={`align-top transition-colors ${
                        selected ? 'bg-brand-light' : 'hover:bg-slate-50'
                      } ${o.geStatus ? 'cursor-pointer' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{o.trackingNo ?? '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{o.invoiceNo ?? o.orderNo}</td>
                      <td className="max-w-[220px] px-4 py-3">
                        <div className="truncate font-semibold text-slate-800" title={o.customerName}>
                          {o.customerName}
                        </div>
                        <div className="line-clamp-2 text-[11.5px] leading-snug text-slate-500" title={fullAddress(o)}>
                          {fullAddress(o)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{o.driverPhone ?? '—'}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{o.scheduledTime}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-800">
                        {formatCurrency(o.shippingFeeCustomer)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-slate-500">
                        {formatCurrency(o.shippingFeePartner)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-black text-slate-800">
                        {formatCurrency(o.subtotal + o.shippingFeeCustomer)}
                      </td>
                      {/* Trạng thái Grab Express — chỉ giữ trạng thái này, ẩn trạng thái CukCuk (update Google Doc) */}
                      <td className="px-3 py-3">
                        {o.geStatus ? (
                          <GeStatusPill status={o.geStatus} />
                        ) : (
                          <span className="text-[12px] text-slate-400">Chưa gửi đối tác</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[12px] text-slate-500">
                        {o.geStatusUpdatedAt ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <RowActions
                          order={o}
                          onSend={() => {
                            patch(o.id, {
                              cukcukStatus: 'cho_giao_hang',
                              geStatus: 'ALLOCATING',
                              geStatusUpdatedAt: 'vừa xong',
                              trackingNo:
                                o.trackingNo ?? 'GE-' + Math.floor(8_800_000_000 + Math.abs(o.id.length * 918_271)),
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
                    <td className="px-4 py-2.5" colSpan={4}>
                      Tổng: {filtered.length} đơn
                    </td>
                    <td className="px-4 py-2.5" />
                    <td className="px-4 py-2.5 text-right">{formatCurrency(sum((o) => o.shippingFeeCustomer))}</td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(sum((o) => o.shippingFeePartner))}</td>
                    <td className="px-4 py-2.5 text-right">
                      {formatCurrency(sum((o) => o.subtotal + o.shippingFeeCustomer))}
                    </td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* ===== Status bar dưới ===== */}
          <footer className="flex h-7 shrink-0 items-center justify-between bg-brand px-3 text-[11px] font-medium text-white/90">
            <span>Nhà hàng Phở Thìn 13 Lò Đúc · phothin.cukcuk.vn</span>
            <span className="flex items-center gap-3">
              <span>Tổng đài tư vấn: MISA SUPPORT</span>
              <span className="opacity-70">OVR | NUM</span>
            </span>
          </footer>

          {/* Thu tiền */}
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
            contained
            title="Hủy đơn giao hàng"
            tone="danger"
            message={
              cancelOrder &&
              ['ALLOCATING', 'PENDING_PICKUP', 'PICKING_UP'].includes(cancelOrder.geStatus ?? '')
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

          {/* FR-pos-051 — RETURNED: nhắc thu ngân chọn */}
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
                Grab Express báo <b>Trả hàng</b> — món đã ra khỏi quán rồi được hoàn về (có thể đã hỏng). Vui lòng
                kiểm tra và chọn: <b>Gửi lại</b> nếu món còn tốt, hoặc <b>Hủy đơn</b>.
              </p>
            </Modal>
          )}

          {/* FR — Google Doc update: click đúp đơn đang giao → bản đồ lộ trình + vị trí tài xế */}
          {mapOrder && <DriverMapMock order={mapOrder} onClose={() => setMapOrder(null)} contained />}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Nút thao tác theo trạng thái (FR-pos-062 / FR-pos-083) — KHÔNG có nút Giao hàng thủ công.
const RowActions: React.FC<{
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

  // Đơn đã thanh toán → hết nút (trạng thái đã hiển thị ở cột Trạng thái đơn).
  if (order.cukcukStatus === 'da_thanh_toan') return <span className="text-slate-300">—</span>;

  const failed = order.geStatus === 'FAILED' || order.geStatus === 'CANCELLED';
  const returned = order.geStatus === 'RETURNED';
  const readyCollect = order.geStatus === 'COMPLETED';

  return (
    <div className="flex items-center justify-end gap-1.5">
      {failed ? (
        <Button variant="primary" size="sm" icon={<Send size={14} />} onClick={stop(onResend)}>
          Gửi lại
        </Button>
      ) : returned ? (
        <Button variant="primary" size="sm" icon={<RotateCcw size={14} />} onClick={stop(onReturned)}>
          Xử lý hoàn
        </Button>
      ) : order.cukcukStatus === 'cho_gui_doi_tac' ? (
        <Button variant="primary" size="sm" icon={<Truck size={14} />} onClick={stop(onSend)}>
          Giao hàng
        </Button>
      ) : readyCollect ? (
        // FR-pos-040 — Thu tiền chỉ mở khi COMPLETED.
        <button
          onClick={stop(onCollect)}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#F59E0B] px-3 text-[13px] font-semibold text-white hover:brightness-105"
        >
          <Banknote size={14} /> Thu tiền
        </button>
      ) : null /* Chờ giao hàng / Đang giao hàng: tự đồng bộ, chỉ còn nút Hủy */}
      <button
        onClick={stop(onCancel)}
        title="Hủy"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-danger"
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
      contained
      onClose={onClose}
      width={420}
      title={`Thu tiền khách · ${order.invoiceNo ?? order.orderNo}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={onConfirm} className="min-w-[120px]">
            Xác nhận thu tiền
          </Button>
        </>
      }
    >
      <div className="mb-3 text-[13px] text-slate-500">
        Khách: <b className="text-slate-800">{order.customerName}</b> · {order.customerPhone}
      </div>
      <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-[13px]">
        <div className="flex justify-between">
          <span className="text-slate-500">Tiền hàng</span>
          <span className="font-medium">{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Phí GH thu khách</span>
          <span className="font-medium">{formatCurrency(order.shippingFeeCustomer)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-2">
          <span className="font-semibold">Còn phải thu</span>
          <span className="text-[18px] font-black text-brand">{formatCurrency(order.isCod ? order.codAmount : total)}</span>
        </div>
      </div>
      {order.isCod ? null : (
        <p className="mt-3 text-[12px] text-slate-400">
          Đơn không thu hộ — còn phải thu = 0, xác nhận để đóng đơn (đồng nhất với nhà hàng tự giao).
        </p>
      )}
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
    <div className="animate-scale-up absolute right-0 top-full z-30 mt-2 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-800">
        Thông báo từ Grab Express
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-10 text-center text-[12px] text-slate-400">
            Chưa có thông báo. Nhấn <b>Mô phỏng Grab Express</b> để xem.
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => onOpen(n)}
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
);
