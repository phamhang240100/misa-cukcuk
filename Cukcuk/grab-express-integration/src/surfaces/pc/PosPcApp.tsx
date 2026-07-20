import React, {useState} from 'react';
import type {AppNotification, ConnectionState, DeliveryOrder, OrderItem, ToastKind} from '../../types';
import {SERVICE_TYPE_DEFAULT} from '../../constants';
import type {PosMenuItem} from '../../posMenu';
import {ConfirmDialog} from '../../components/ui';
import {PosPcShell, type PcScreen} from './PosPcShell';
import {PosPcOrderScreen, type PcCartItem} from './PosPcOrderScreen';
import {PosPcDeliveryInfoModal, type DeliveryDraft} from './PosPcDeliveryInfoModal';
import {PosPcOrderListScreen} from './PosPcOrderListScreen';
import {PosPcDeliveryBook} from './PosPcDeliveryBook';
import {PosPcCheckoutScreen} from './PosPcCheckoutScreen';
import {PosPcOnlineOrderScreen} from './PosPcOnlineOrderScreen';
import {PosPcOnlineOrderPanel} from './PosPcOnlineOrderPanel';
import {PC_ONLINE_ORDERS, type OnlineOrder} from './onlineOrder';

// ---------------------------------------------------------------------------
// Container bản POS PC — quản lý điều hướng (Order / Danh sách order / Sổ
// giao hàng) + state soạn đơn (cart + thông tin giao hàng). Dùng chung
// `orders`/`connection`/`notifications` với bản tablet (App.tsx truyền xuống)
// nên 2 bề mặt luôn đồng bộ dữ liệu.
// ---------------------------------------------------------------------------

interface Props {
  connection: ConnectionState;
  orders: DeliveryOrder[];
  setOrders: React.Dispatch<React.SetStateAction<DeliveryOrder[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
}

export const PosPcApp: React.FC<Props> = ({connection, orders, setOrders, notifications, setNotifications, pushToast}) => {
  const [screen, setScreen] = useState<PcScreen>('orderList');
  const [cart, setCart] = useState<PcCartItem[]>([]);
  const [draft, setDraft] = useState<DeliveryDraft | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [discardConfirm, setDiscardConfirm] = useState(false);
  const [cancelOrder, setCancelOrder] = useState<DeliveryOrder | null>(null);
  const [checkoutOrder, setCheckoutOrder] = useState<DeliveryOrder | null>(null);
  const [onlineList, setOnlineList] = useState<OnlineOrder[]>(PC_ONLINE_ORDERS);
  const [onlinePanelOrder, setOnlinePanelOrder] = useState<OnlineOrder | null>(null);

  const resetCompose = () => {
    setCart([]);
    setDraft(null);
  };

  const startDeliveryOrder = () => {
    resetCompose();
    setScreen('order');
    setModalOpen(true);
  };

  const notImplemented = () =>
    pushToast('info', 'Ngoài phạm vi prototype', 'Bản demo POS PC tập trung luồng Giao hàng Grab Express.');

  const addItem = (item: PosMenuItem) =>
    setCart((c) => {
      const existed = c.find((x) => x.id === item.id);
      if (existed) return c.map((x) => (x.id === item.id ? {...x, qty: x.qty + 1} : x));
      return [...c, {...item, qty: 1}];
    });
  const changeQty = (id: string, qty: number) => setCart((c) => c.map((x) => (x.id === id ? {...x, qty} : x)));
  const removeItem = (id: string) => setCart((c) => c.filter((x) => x.id !== id));

  const buildOrder = (): DeliveryOrder | null => {
    if (!draft || cart.length === 0) return null;
    const items: OrderItem[] = cart.map((c) => ({id: c.id, name: c.name, qty: c.qty, price: c.price}));
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const now = new Date();
    const hhmm = now.toTimeString().slice(0, 5);
    return {
      id: 'pc' + Date.now(),
      orderNo: 'PC' + String(Date.now()).slice(-6),
      customerName: draft.customer?.name ?? 'Khách lẻ',
      customerPhone: draft.customer?.phone ?? '',
      address: draft.address,
      items,
      subtotal,
      shippingFeePartner: draft.partnerFee,
      shippingFeeCustomer: draft.feeCustomer,
      isCod: draft.isCod,
      codAmount: subtotal + draft.feeCustomer,
      serviceType: SERVICE_TYPE_DEFAULT,
      cukcukStatus: 'cho_gui_doi_tac',
      geStatus: undefined,
      scheduledTime: `${draft.deliveryTime} ${draft.deliveryDate.split('-').reverse().join('/')}`,
      createdAt: hhmm,
      note: draft.note || undefined,
    };
  };

  const handleSave = (andAdd: boolean) => {
    const o = buildOrder();
    if (!o) return;
    setOrders((os) => [o, ...os]);
    pushToast('success', 'Đã lưu order giao hàng', `${o.orderNo} · Chờ gửi đối tác.`);
    resetCompose();
    if (andAdd) {
      setModalOpen(true);
    } else {
      setScreen('orderList');
    }
  };

  const handleCancelCompose = () => {
    if (cart.length === 0 && !draft) {
      setScreen('orderList');
      return;
    }
    setDiscardConfirm(true);
  };

  const handleConfirmSend = (id: string) => {
    setOrders((os) =>
      os.map((x) =>
        x.id === id
          ? {
              ...x,
              cukcukStatus: 'cho_giao_hang',
              geStatus: 'ALLOCATING',
              geStatusUpdatedAt: 'vừa xong',
              trackingNo: x.trackingNo ?? 'GE-' + Math.floor(8_800_000_000 + Math.abs(x.id.length * 918_271)),
            }
          : x,
      ),
    );
    pushToast('success', 'Đã gửi đơn sang Grab Express', 'Chuyển sang Chờ giao hàng.');
    setCheckoutOrder(null);
    // Khớp bản tablet (PosOrderSurface: setScreen('orderList'); goToBook();) — gửi xong bay
    // khỏi màn Order sang Sổ giao hàng để thu ngân theo dõi ngay trạng thái GE.
    setScreen('book');
  };

  // FR-pos-072 — Từ chối / Xác nhận & Giao hàng / Xác nhận: tạo đơn Chờ gửi đối tác.
  const handleRejectOnline = (o: OnlineOrder) => {
    setOnlineList((l) => l.filter((x) => x.id !== o.id));
    setOnlinePanelOrder(null);
    pushToast('info', 'Đã từ chối đơn online', `Đơn ${o.orderNo} không được xử lý.`);
  };

  const handleConfirmOnline = (online: OnlineOrder, deliveryOrder: DeliveryOrder, deliver: boolean) => {
    setOnlineList((l) => l.filter((x) => x.id !== online.id));
    setOnlinePanelOrder(null);
    setOrders((os) => [deliveryOrder, ...os]);
    pushToast('success', 'Đã xác nhận đơn online', `Đơn ${deliveryOrder.orderNo} chuyển sang Chờ gửi đối tác (Grab Express).`);
    if (deliver) {
      setCheckoutOrder(deliveryOrder);
      setScreen('checkout');
    } else {
      setScreen('orderList');
    }
  };

  return (
    <div className="flex h-full items-center justify-center overflow-auto bg-[#0f172a] p-3">
      <div className="relative h-full max-h-[900px] w-full max-w-[1280px]">
        <PosPcShell
          screen={screen}
          onNavigate={setScreen}
          onAddOrderDelivery={startDeliveryOrder}
          onAddOrderDineIn={notImplemented}
          onAddOrderTakeaway={notImplemented}
          unreadCount={notifications.filter((n) => !n.read).length}
          onlineCount={onlineList.length}
        >
          {screen === 'order' && (
            <PosPcOrderScreen
              draft={draft}
              cart={cart}
              onAddItem={addItem}
              onChangeQty={changeQty}
              onRemoveItem={removeItem}
              onCancel={handleCancelCompose}
              onSave={() => handleSave(false)}
              onSaveAndAdd={() => handleSave(true)}
              onEditDelivery={() => setModalOpen(true)}
              pushToast={pushToast}
            />
          )}
          {screen === 'orderList' && (
            <PosPcOrderListScreen
              orders={orders}
              onOpenInvoice={(o) => {
                setCheckoutOrder(o);
                setScreen('checkout');
              }}
              onCancel={(o) => setCancelOrder(o)}
            />
          )}
          {screen === 'onlineOrders' && (
            <PosPcOnlineOrderScreen orders={onlineList} onOpen={(o) => setOnlinePanelOrder(o)} />
          )}
          {screen === 'checkout' && checkoutOrder && (
            <PosPcCheckoutScreen
              order={checkoutOrder}
              connection={connection}
              onBack={() => {
                setCheckoutOrder(null);
                setScreen('orderList');
              }}
              onConfirmSend={handleConfirmSend}
              pushToast={pushToast}
            />
          )}
          {screen === 'book' && (
            <PosPcDeliveryBook
              orders={orders}
              setOrders={setOrders}
              notifications={notifications}
              setNotifications={setNotifications}
              pushToast={pushToast}
            />
          )}
        </PosPcShell>

        {onlinePanelOrder && (
          <PosPcOnlineOrderPanel
            order={onlinePanelOrder}
            connection={connection}
            onClose={() => setOnlinePanelOrder(null)}
            onReject={() => handleRejectOnline(onlinePanelOrder)}
            onConfirm={(deliveryOrder, deliver) => handleConfirmOnline(onlinePanelOrder, deliveryOrder, deliver)}
          />
        )}

        {modalOpen && (
          <PosPcDeliveryInfoModal
            initial={draft ?? undefined}
            onConfirm={(d) => {
              setDraft(d);
              setModalOpen(false);
            }}
            onClose={() => {
              setModalOpen(false);
              if (!draft) setScreen('orderList');
            }}
          />
        )}

        <ConfirmDialog
          open={discardConfirm}
          contained
          title="Hủy order đang soạn"
          tone="danger"
          message="Món đã chọn và thông tin giao hàng sẽ không được lưu. Bạn có chắc chắn muốn hủy bỏ?"
          onConfirm={() => {
            resetCompose();
            setDiscardConfirm(false);
            setScreen('orderList');
          }}
          onCancel={() => setDiscardConfirm(false)}
        />

        <ConfirmDialog
          open={!!cancelOrder}
          contained
          title="Hủy đơn giao hàng"
          tone="danger"
          message="Bạn có chắc chắn muốn hủy đơn giao hàng này?"
          onConfirm={() => {
            if (cancelOrder) {
              setOrders((os) => os.filter((x) => x.id !== cancelOrder.id));
              pushToast('info', 'Đã hủy đơn');
            }
            setCancelOrder(null);
          }}
          onCancel={() => setCancelOrder(null)}
        />
      </div>
    </div>
  );
};
