import React, {useMemo, useState} from 'react';
import {
  Bell,
  Bike,
  CalendarDays,
  ChefHat,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock,
  Compass,
  FileText,
  Gift,
  Globe,
  History,
  Info,
  LayoutGrid,
  List,
  ClipboardCheck,
  UtensilsCrossed,
  MapPin,
  Minus,
  MoreHorizontal,
  NotebookPen,
  Coins,
  Wallet,
  Plus,
  Printer,
  Receipt,
  Save,
  Search,
  Send,
  ShoppingBag,
  Timer,
  Trash2,
  Truck,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import type {
  ConnectionState,
  CukcukStatus,
  Customer,
  CustomerAddress,
  DeliveryOrder,
  ToastKind,
} from '../types';
import {
  ALL_PROVINCES,
  CUKCUK_STATUS,
  MAX_COD,
  MSG,
  SERVICE_TYPE_DEFAULT,
  WARDS,
  districtsOf,
  formatCurrency,
  quoteDelivery,
} from '../constants';
import {CUSTOMERS} from '../data';
import {MENU_CATEGORIES, POS_MENU, type PosMenuItem} from '../posMenu';
import {
  AlertPopup,
  Button,
  Field,
  GeStatusPill,
  GrabExpressChip,
  GrabExpressLogo,
  InfoTip,
  Modal,
  inputCls,
} from '../components/ui';
import {PosCheckoutScreen} from './PosCheckoutScreen';

interface Props {
  connection: ConnectionState;
  orders: DeliveryOrder[];
  setOrders: React.Dispatch<React.SetStateAction<DeliveryOrder[]>>;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
  goToBook: () => void;
}

interface CartItem extends PosMenuItem {
  qty: number;
}

type DeliveryMethod = 'SELF' | 'GRAB' | 'AHAMOVE' | 'SHOPEE';
const METHOD_LABELS: Record<DeliveryMethod, string> = {
  SELF: 'Nhà hàng tự giao',
  GRAB: 'Grab Express',
  AHAMOVE: 'AhaMove',
  SHOPEE: 'ShopeeFood',
};

// Ảnh có fallback gradient + emoji nếu URL lỗi
const DishImg: React.FC<{item: PosMenuItem}> = ({item}) => {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${item.tint} text-3xl`}>
        {item.emoji}
      </div>
    );
  return (
    <img
      src={item.image}
      alt={item.name}
      onError={() => setErr(true)}
      referrerPolicy="no-referrer"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  );
};

export const PosOrderSurface: React.FC<Props> = ({
  connection,
  orders,
  setOrders,
  pushToast,
  goToBook,
}) => {
  const [screen, setScreen] = useState<'order' | 'orderList' | 'checkout'>('order');
  const [checkoutOrder, setCheckoutOrder] = useState<DeliveryOrder | null>(null);

  // ---- Order compose state ----
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [custSearch, setCustSearch] = useState('');
  const [showCustDrop, setShowCustDrop] = useState(false);
  const [activeCat, setActiveCat] = useState('Hay dùng');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ---- Thông tin Order: Giao hàng ----
  // Mặc định "Nhà hàng tự giao" — thu ngân chủ động đổi sang Grab Express khi cần.
  const [method, setMethod] = useState<DeliveryMethod>('SELF');
  const [deliveryDate, setDeliveryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [deliveryTime, setDeliveryTime] = useState(() => {
    const d = new Date(Date.now() + 30 * 60000);
    return d.toTimeString().slice(0, 5);
  });
  const [hasDeposit, setHasDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [selfFee, setSelfFee] = useState(0);
  const [partnerCode, setPartnerCode] = useState('');
  const [custErr, setCustErr] = useState(false);
  const [addrErr, setAddrErr] = useState(false);
  const [addr, setAddr] = useState<CustomerAddress>({
    id: 'new', freetext: '', ward: '', district: '', province: '', isDefault: false,
  });
  const [feeCustomer, setFeeCustomer] = useState<number | null>(null);
  const [isCod, setIsCod] = useState(true);
  const [note, setNote] = useState('');
  // Demo (BR-006 / E-005): mô phỏng Grab KHÔNG báo giá được cho địa chỉ hiện tại.
  const [simNoQuote, setSimNoQuote] = useState(false);
  const isGrab = method === 'GRAB';

  // ---- Alerts / modals ----
  const [provinceAlert, setProvinceAlert] = useState(false);
  const [codAlert, setCodAlert] = useState(false);
  const [connFailAlert, setConnFailAlert] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const addressComplete = !!(addr.province && addr.district && addr.ward);
  // BR-006 — phí + vùng phục vụ suy ra động từ Quote (không theo allow-list tỉnh).
  // simNoQuote = demo Grab không báo giá được (E-005).
  const quote = useMemo(
    () => (simNoQuote ? {covered: false, fee: 0} : quoteDelivery(addr)),
    [addr, simNoQuote],
  );
  const partnerFee = quote.covered ? quote.fee : 0;
  const feeCust = feeCustomer ?? partnerFee;
  const total = subtotal + feeCust;
  // BR-003 — COD (Còn phải thu) = (tiền món + phí GH thu khách) − Đặt cọc trước.
  const codAmount = Math.max(0, total - (hasDeposit ? depositAmount : 0));

  const orderNo = 'DH' + String(150 + orders.length).padStart(6, '0');

  const filteredMenu = useMemo(
    () => POS_MENU.filter((m) => activeCat === 'Hay dùng' || m.category === activeCat),
    [activeCat],
  );

  const addToCart = (m: PosMenuItem) =>
    setCart((c) => {
      const ex = c.find((x) => x.id === m.id);
      if (ex) return c.map((x) => (x.id === m.id ? {...x, qty: x.qty + 1} : x));
      return [...c, {...m, qty: 1}];
    });
  const bump = (id: string, d: number) =>
    setCart((c) =>
      c.map((x) => (x.id === id ? {...x, qty: Math.max(0, x.qty + d)} : x)).filter((x) => x.qty > 0),
    );
  const removeItem = (id: string) => setCart((c) => c.filter((x) => x.id !== id));

  const pickCustomer = (c: Customer) => {
    setCustomer(c);
    const d = c.addresses.find((a) => a.isDefault) ?? c.addresses[0];
    setAddr({...d});
    setFeeCustomer(null);
    setCustSearch('');
    setShowCustDrop(false);
  };

  const buildOrder = (): DeliveryOrder => ({
    id: 'o' + Date.now(),
    orderNo,
    customerName: customer?.name ?? 'Khách lẻ',
    customerPhone: customer?.phone ?? '',
    address: addr,
    items: cart.map((i) => ({id: i.id, name: i.name, qty: i.qty, price: i.price})),
    subtotal,
    shippingFeePartner: partnerFee,
    shippingFeeCustomer: feeCust,
    isCod,
    codAmount: isCod ? codAmount : 0,
    note: note.trim() || undefined,
    serviceType: SERVICE_TYPE_DEFAULT,
    cukcukStatus: 'cho_gui_doi_tac',
    geStatus: undefined,
    scheduledTime: '—',
    createdAt: 'vừa xong',
  });

  const resetCompose = () => {
    setCart([]);
    setCustomer(null);
    setAddr({id: 'new', freetext: '', ward: '', district: '', province: '', isDefault: false});
    setFeeCustomer(null);
    setNote('');
  };

  const doSave = () => {
    if (cart.length === 0) {
      pushToast('warning', 'Chưa chọn món', 'Vui lòng chọn món để thêm Order.');
      return;
    }
    const custMissing = !customer;
    const addrMissing = isGrab ? !(addr.freetext.trim() && addressComplete) : !addr.freetext.trim();
    if (custMissing || addrMissing) {
      setCustErr(custMissing);
      setAddrErr(addrMissing);
      setDrawerOpen(true);
      return;
    }
    if (isGrab) {
      if (!quote.covered) {
        setProvinceAlert(true);
        return;
      }
      if (isCod && codAmount > MAX_COD) {
        setCodAlert(true);
        return;
      }
      if (!connection.isConnected) {
        setConnFailAlert(true);
        return;
      }
      setOrders((os) => [buildOrder(), ...os]);
      pushToast('success', 'Đã lưu đơn', `Đơn ${orderNo} ở trạng thái Chờ gửi đối tác.`);
      resetCompose();
      setScreen('orderList');
    } else {
      pushToast('success', 'Đã lưu đơn', `${METHOD_LABELS[method]} — xử lý như nghiệp vụ hiện tại.`);
      resetCompose();
    }
  };

  const resetToOtherPartner = () => {
    pushToast('info', 'Chuyển sang Nhà hàng tự giao', 'Cho phép chỉnh sửa thông tin giao hàng.');
    setProvinceAlert(false);
    setCodAlert(false);
    setConnFailAlert(false);
  };

  const patchStatus = (id: string, patch: Partial<DeliveryOrder>) =>
    setOrders((os) => os.map((o) => (o.id === id ? {...o, ...patch} : o)));

  return (
    <div className="flex h-full items-center justify-center overflow-auto bg-[#e7e9ee] p-4">
      {/* Tablet frame */}
      <div className="relative flex h-[772px] w-[1161px] max-h-full max-w-full shrink-0 flex-col overflow-hidden rounded-[32px] border-[14px] border-slate-950 bg-slate-950 shadow-[0_30px_70px_-10px_rgba(15,23,42,0.35)]">
        <div className="relative flex h-full w-full select-text flex-col overflow-hidden rounded-[18px] bg-[#EEF0F4]">
          <div className="flex h-full">
            <Sidebar screen={screen} setScreen={setScreen} />

            <div className="min-w-0 flex-1 p-3">
              {screen === 'order' ? (
                <div className="flex h-full gap-3">
                  {/* LEFT: Order panel */}
                  <div className="flex w-[420px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {/* Header */}
                    <div className="flex flex-col gap-2.5 border-b border-slate-100 p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-400">#{50 + orders.length}</span>
                        <div className="h-4 w-px bg-slate-200" />
                        <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
                          <Truck className="h-4 w-4 text-brand" />
                          <span className="text-sm font-bold text-slate-700">Giao hàng</span>
                          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div className="flex flex-1 items-center justify-end">
                          <button
                            onClick={() => setDrawerOpen(true)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                              addressComplete
                                ? 'border-brand bg-brand text-white'
                                : 'border-slate-200 bg-slate-50 text-brand hover:bg-slate-100'
                            }`}
                            title="Thông tin giao hàng"
                          >
                            <NotebookPen className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Hàng Hình thức giao */}
                      <button
                        onClick={() => setDrawerOpen(true)}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left ${
                          isGrab ? 'border-grab/30 bg-grab-light/50' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isGrab ? (
                            <GrabExpressLogo size={28} withText={false} />
                          ) : (
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
                              <Truck className="h-4 w-4" />
                            </span>
                          )}
                          <span className="text-[13px] font-bold text-slate-700">{METHOD_LABELS[method]}</span>
                          {isGrab && <GrabExpressChip />}
                        </span>
                        <span className={`text-[12px] font-medium ${isGrab ? 'text-grab' : 'text-brand'}`}>
                          {isGrab ? (addressComplete ? formatCurrency(partnerFee) : 'Nhập địa chỉ') : 'Chi tiết'} ›
                        </span>
                      </button>

                      {/* Customer bar */}
                      <div className="relative flex items-center gap-2">
                        <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-brand/60">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
                            <User className="h-4 w-4" />
                          </span>
                          <input
                            value={customer ? `${customer.name} (${customer.phone})` : custSearch}
                            onChange={(e) => {
                              if (customer) setCustomer(null);
                              setCustSearch(e.target.value);
                              setShowCustDrop(true);
                            }}
                            onFocus={() => setShowCustDrop(true)}
                            placeholder="Nhập tên hoặc SĐT khách..."
                            className="flex-1 border-none bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:italic placeholder:text-slate-400"
                          />
                          {customer && (
                            <button onClick={() => setCustomer(null)} className="rounded p-0.5 text-red-500 hover:bg-red-50">
                              <XCircle className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        {showCustDrop && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowCustDrop(false)} />
                            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-2xl">
                              <div className="bg-slate-50/50 px-4 py-2 text-xs font-bold tracking-wider text-slate-400">
                                {custSearch ? 'Kết quả tìm kiếm' : 'Khách hàng gần đây'}
                              </div>
                              {CUSTOMERS.filter(
                                (c) =>
                                  !custSearch ||
                                  c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
                                  c.phone.includes(custSearch),
                              ).map((c) => (
                                <div
                                  key={c.id}
                                  onClick={() => pickCustomer(c)}
                                  className="cursor-pointer border-b border-slate-50 px-4 py-2.5 last:border-0 hover:bg-brand/5"
                                >
                                  <div className="text-sm font-bold text-slate-700">{c.name}</div>
                                  <div className="text-[12px] font-medium text-slate-400">
                                    {c.phone}
                                    {c.hasDeliveredBefore && ' · đã có đơn giao'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto">
                      {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-sky-100 to-white text-5xl">
                            🍽️
                          </div>
                          <p className="text-sm font-normal text-slate-500">Vui lòng chọn món để thêm Order</p>
                        </div>
                      ) : (
                        cart.map((it) => (
                          <div key={it.id} className="border-b border-slate-100">
                            <div className="grid grid-cols-[1fr_120px_90px_40px] items-center gap-2 px-3 py-3">
                              <div className="min-w-0 pr-2">
                                <div className="truncate text-sm font-bold text-slate-800">{it.name}</div>
                                <div className="text-sm font-normal text-slate-400">
                                  {formatCurrency(it.price)} / {it.unit}
                                </div>
                              </div>
                              <div className="flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                                <button
                                  onClick={() => bump(it.id, -1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-red-500 hover:bg-red-50"
                                >
                                  <Minus className="h-4 w-4 stroke-[3]" />
                                </button>
                                <span className="flex-1 text-center text-sm font-black text-slate-800">{it.qty}</span>
                                <button
                                  onClick={() => bump(it.id, 1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-green-600 hover:bg-green-50"
                                >
                                  <Plus className="h-4 w-4 stroke-[3]" />
                                </button>
                              </div>
                              <div className="text-right text-sm font-black text-slate-900">
                                {formatCurrency(it.price * it.qty)}
                              </div>
                              <div className="flex justify-center">
                                <button
                                  onClick={() => removeItem(it.id)}
                                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Bottom summary */}
                    <div className="border-t border-slate-100 bg-white p-3">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconBtn tone="brand"><Timer className="h-6 w-6" /></IconBtn>
                          <IconBtn tone="red"><Gift className="h-6 w-6" /></IconBtn>
                          <IconBtn tone="brand"><History className="h-6 w-6" /></IconBtn>
                        </div>
                        <div className="flex items-center gap-2 text-2xl font-bold text-brand">
                          <span className="text-sm font-medium text-slate-500">Tổng tiền:</span>
                          {formatCurrency(total)}
                          <ChevronRight className="h-6 w-6" />
                        </div>
                      </div>

                      <div className="mb-2 grid grid-cols-4 gap-2">
                        <SecBtn icon={<XCircle className="h-4 w-4 text-[#717680]" />} label="Đóng" onClick={() => setScreen('orderList')} />
                        <SecBtn icon={<Printer className="h-4 w-4 text-[#717680]" />} label="In tạm" onClick={() => pushToast('info', 'In tạm tính')} />
                        <SecBtn icon={<Plus className="h-4 w-4 text-[#717680]" />} label="Món khác" onClick={() => pushToast('info', 'Thêm món khác')} />
                        <SecBtn icon={<Bell className="h-4 w-4 text-[#717680]" />} label="Nhắc bếp" onClick={() => pushToast('success', 'Đã nhắc bếp')} />
                      </div>

                      {/* Bỏ nút "Giao hàng" — thông tin giao hàng đã ở đầu order; đơn Grab không giao thủ công (BR-007). Lưu → Chờ gửi đối tác. */}
                      <div className="grid grid-cols-3 gap-2">
                        <PrimBtn color="#12B76A" icon={<Save className="h-5 w-5" />} label="Lưu" onClick={doSave} />
                        <PrimBtn color="#245FDF" icon={<ChefHat className="h-5 w-5" />} label="Gửi bếp/bar" onClick={() => cart.length ? pushToast('success', 'Gửi bếp/bar thành công!') : pushToast('warning', 'Chưa chọn món')} />
                        <PrimBtn color="#F79009" icon={<Receipt className="h-5 w-5" />} label="Tính tiền" onClick={() => pushToast('info', 'Mở màn tính tiền')} />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Menu */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="flex flex-1 gap-2 overflow-x-auto py-1">
                        {MENU_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveCat(cat)}
                            className={`h-11 whitespace-nowrap rounded-full border px-6 text-sm transition-all ${
                              activeCat === cat
                                ? 'border-brand bg-brand text-base font-black text-white'
                                : 'border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-brand hover:text-brand">
                        <Search className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1">
                      <div className="grid grid-cols-5 gap-2">
                        {filteredMenu.map((m) => {
                          const count = cart.find((c) => c.id === m.id)?.qty ?? 0;
                          return (
                            <div
                              key={m.id}
                              onClick={() => addToCart(m)}
                              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all active:scale-95"
                            >
                              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                <DishImg item={m} />
                                {count > 0 && (
                                  <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white bg-brand text-sm font-black text-white">
                                    {count}
                                  </div>
                                )}
                                <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl bg-black/50 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                  {formatCurrency(m.price)}
                                  <Info className="h-3 w-3 opacity-80" />
                                </div>
                              </div>
                              <div className="bg-white p-2.5 text-center">
                                <div className="line-clamp-1 text-sm font-bold text-slate-700">{m.name}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : screen === 'checkout' && checkoutOrder ? (
                <PosCheckoutScreen
                  order={checkoutOrder}
                  connection={connection}
                  isGrab
                  onClose={() => setScreen('orderList')}
                  onSend={(id) => {
                    patchStatus(id, {
                      cukcukStatus: 'cho_giao_hang',
                      geStatus: 'ALLOCATING',
                      trackingNo: 'GE-' + Math.floor(8_800_000_000 + Math.abs(id.length * 918_271)),
                    });
                    pushToast('success', 'Đã gửi đơn sang Grab Express', 'Chuyển sang Chờ giao hàng · Grab Express đang tìm tài xế.');
                    setScreen('orderList');
                    goToBook();
                  }}
                  pushToast={pushToast}
                />
              ) : (
                <DanhSachOrder
                  orders={orders}
                  connection={connection}
                  onCompose={() => setScreen('order')}
                  onInvoice={(o) => {
                    setCheckoutOrder(o);
                    setScreen('checkout');
                  }}
                  onCancel={(o) => {
                    const sentToGe = o.cukcukStatus === 'cho_giao_hang';
                    setOrders((os) => os.filter((x) => x.id !== o.id));
                    pushToast('info', 'Đã hủy đơn', sentToGe ? 'Đã gửi trạng thái Hủy sang Grab Express.' : undefined);
                  }}
                  onConfirmOnline={(o, deliver) => {
                    setOrders((os) => [o, ...os]);
                    pushToast('success', 'Đã xác nhận đơn online', `Đơn ${o.orderNo} chuyển sang Chờ gửi đối tác (Grab Express).`);
                    if (deliver) {
                      setCheckoutOrder(o);
                      setScreen('checkout');
                    }
                  }}
                  goToBook={goToBook}
                />
              )}
            </div>
          </div>

          {/* ===== Overlays — render BÊN TRONG khung tablet (absolute) ===== */}
          {/* Modal Thông tin Order: Giao hàng */}
          {drawerOpen && (
            <DeliveryInfoModal
              method={method}
              setMethod={setMethod}
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              deliveryTime={deliveryTime}
              setDeliveryTime={setDeliveryTime}
              customer={customer}
              onPickCustomer={pickCustomer}
              custErr={custErr}
              setCustErr={setCustErr}
              addr={addr}
              setAddr={setAddr}
              addrErr={addrErr}
              setAddrErr={setAddrErr}
              addressComplete={addressComplete}
              hasDeposit={hasDeposit}
              setHasDeposit={setHasDeposit}
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              partnerCode={partnerCode}
              setPartnerCode={setPartnerCode}
              selfFee={selfFee}
              setSelfFee={setSelfFee}
              partnerFee={partnerFee}
              feeCust={feeCust}
              setFeeCustomer={setFeeCustomer}
              isCod={isCod}
              setIsCod={setIsCod}
              codAmount={codAmount}
              note={note}
              setNote={setNote}
              subtotal={subtotal}
              total={total}
              simNoQuote={simNoQuote}
              setSimNoQuote={setSimNoQuote}
              quoteCovered={quote.covered}
              onProvinceUnsupported={() => setProvinceAlert(true)}
              onClose={() => setDrawerOpen(false)}
            />
          )}

      {/* Alerts */}
      <AlertPopup
        contained
        open={provinceAlert}
        title="Khu vực chưa được hỗ trợ"
        message={MSG.areaNoQuote}
        primaryText="Chọn đối tác giao hàng khác"
        onPrimary={resetToOtherPartner}
        onClose={() => setProvinceAlert(false)}
      />
      <AlertPopup
        contained
        open={codAlert}
        title="Vượt hạn mức thu hộ"
        message={MSG.codOverLimit}
        primaryText="Chọn đối tác giao hàng khác"
        onPrimary={resetToOtherPartner}
        onClose={() => setCodAlert(false)}
      />
      <AlertPopup
        contained
        open={connFailAlert}
        title="Không kết nối được đối tác"
        message={MSG.connectFailed}
        primaryText="Chọn đối tác giao hàng khác"
        onPrimary={resetToOtherPartner}
        onClose={() => setConnFailAlert(false)}
      />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sidebar rail
// ---------------------------------------------------------------------------
const CukCukMark: React.FC<{size?: number}> = ({size = 34}) => (
  <div
    className="flex items-center justify-center rounded-2xl bg-brand-light font-black text-brand"
    style={{width: size, height: size}}
  >
    C
  </div>
);

const Sidebar: React.FC<{screen: string; setScreen: (s: 'order' | 'orderList') => void}> = ({
  screen,
  setScreen,
}) => (
  <div className="relative flex h-full w-[90px] shrink-0 flex-col items-center border-r border-slate-200 bg-white py-6">
    <div className="mb-8">
      <CukCukMark />
    </div>
    <div className="mb-8">
      <div className="flex h-[110px] w-[70px] flex-col items-center overflow-hidden rounded-[24px] border border-brand/20 bg-brand">
        <button
          onClick={() => setScreen('order')}
          className="flex h-[62px] w-full flex-col items-center justify-center pt-2 hover:bg-brand-hover"
        >
          <Plus className="mb-1 h-6 w-6 text-white" />
          <span className="-mt-1 text-xs font-bold leading-none tracking-tighter text-white">Order</span>
        </button>
        <div className="h-px w-8 shrink-0 bg-white/30" />
        <button className="flex w-full flex-1 items-center justify-center hover:bg-brand-hover">
          <MoreHorizontal className="h-[22px] w-[22px] text-white" />
        </button>
      </div>
    </div>
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <RailBtn active={screen === 'order' || screen === 'orderList'} icon={<ClipboardList className="mb-1 h-6 w-6" />} label="Order" onClick={() => setScreen('orderList')} />
      <RailBtn icon={<TableGlyph />} label="Bàn" />
      <RailBtn icon={<FileText className="mb-1 h-6 w-6" />} label="Hóa đơn" />
      <RailBtn icon={<CalendarDays className="mb-1 h-6 w-6" />} label="Đặt chỗ" />
      <RailBtn icon={<Compass className="mb-1 h-6 w-6" />} label="Hướng dẫn" />
    </div>
    <div className="mt-auto flex flex-col items-center gap-6">
      <button className="flex h-12 w-12 items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-200/50">
        <ShoppingBag className="h-6 w-6" />
      </button>
      <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-200/50">
        <Bell className="h-6 w-6" />
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
      </button>
    </div>
  </div>
);

const TableGlyph: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mb-1">
    <path d="M21 8v8M3 8v8M16 3H8M16 21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="6" y="6" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const RailBtn: React.FC<{active?: boolean; icon: React.ReactNode; label: string; onClick?: () => void}> = ({
  active,
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex h-14 w-[70px] flex-col items-center justify-center rounded-[16px] transition-all ${
      active ? 'bg-brand-light text-brand' : 'text-slate-400 hover:bg-slate-200/50'
    }`}
  >
    {icon}
    <span className="text-[12px] font-bold">{label}</span>
  </button>
);

const IconBtn: React.FC<{tone: 'brand' | 'red'; children: React.ReactNode}> = ({tone, children}) => (
  <button
    className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white transition-all active:scale-95 ${
      tone === 'red' ? 'text-red-500' : 'text-brand'
    }`}
  >
    {children}
  </button>
);

const SecBtn: React.FC<{icon: React.ReactNode; label: string; onClick?: () => void}> = ({icon, label, onClick}) => (
  <button
    onClick={onClick}
    className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98]"
  >
    {icon} {label}
  </button>
);

const PrimBtn: React.FC<{color: string; icon: React.ReactNode; label: string; onClick?: () => void}> = ({
  color,
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    style={{backgroundColor: color}}
    className="flex h-12 items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white transition-all hover:brightness-105 active:scale-[0.98]"
  >
    <span className="text-white">{icon}</span> {label}
  </button>
);


// ---------------------------------------------------------------------------
// Danh sách order — tabs kênh + toggle Card/List
// ---------------------------------------------------------------------------
type OrderTab = 'all' | 'table' | 'takeaway' | 'delivery' | 'online';

interface OnlineOrder {
  id: string;
  orderNo: string;
  source: string; // Website / App / Grab / Shopee
  customerName: string;
  customerPhone: string;
  freetext: string;
  province: string;
  district: string;
  ward: string;
  items: {id: string; name: string; qty: number; price: number}[];
  subtotal: number;
  note?: string;
  deliveryTime: string;
  createdAt: string;
}

interface ListRow {
  key: string;
  channel: 'table' | 'takeaway' | 'delivery' | 'online';
  chip: string;
  title: string;
  orderNo: string;
  time: string;
  amount: number;
  customer: string;
  dishes: number;
  guests?: number;
  address?: string;
  statusLabel: string;
  statusTone: 'blue' | 'orange' | 'green';
  ge?: DeliveryOrder;
  online?: OnlineOrder;
}

const ONLINE_ORDERS: OnlineOrder[] = [
  {
    id: 'on1', orderNo: 'ONL-24091', source: 'Website', customerName: 'Đỗ Quang Huy', customerPhone: '0977 555 111',
    freetext: 'N03-T1 Ngoại Giao Đoàn', province: 'TP. Hà Nội', district: 'Quận Cầu Giấy', ward: 'Phường Dịch Vọng',
    items: [
      {id: 'm1', name: 'Phở bò chín đặc biệt', qty: 2, price: 65000},
      {id: 'm4', name: 'Quẩy giòn', qty: 3, price: 5000},
    ],
    subtotal: 145000, note: 'Giao nhanh giúp mình, đang đói.', deliveryTime: '11:30', createdAt: '10:58 16/07/2026',
  },
  {
    id: 'on2', orderNo: 'ONL-24092', source: 'App', customerName: 'Vũ Thanh Tú', customerPhone: '0966 222 333',
    freetext: '12 Phan Huy Chú', province: 'TP. Hà Nội', district: 'Quận Hoàn Kiếm', ward: 'Phường Phạm Đình Hổ',
    items: [{id: 'm2', name: 'Phở bò tái lăn', qty: 1, price: 70000}],
    subtotal: 70000, deliveryTime: '12:00', createdAt: '11:12 16/07/2026',
  },
];

const SAMPLE_ORDERS: ListRow[] = [
  {key: 's1', channel: 'table', chip: 'Tại bàn', title: 'Bàn 110', orderNo: '54', time: "0h 05'", amount: 29000, customer: 'Khách lẻ', dishes: 1, guests: 1, statusLabel: 'Đang phục vụ', statusTone: 'blue'},
  {key: 's2', channel: 'takeaway', chip: 'Mang về', title: 'Mang về #52', orderNo: '52', time: "0h 12'", amount: 75000, customer: 'Anh Tú', dishes: 2, guests: 1, statusLabel: 'Chờ thanh toán', statusTone: 'orange'},
];

const CHIP_STYLE: Record<string, string> = {
  table: 'bg-blue-50 border-blue-200 text-blue-600',
  takeaway: 'bg-purple-50 border-purple-200 text-purple-600',
  delivery: 'bg-grab-light border-grab/30 text-grab',
  online: 'bg-orange-50 border-orange-200 text-orange-600',
};
const STATUS_STYLE: Record<'blue' | 'orange' | 'green', string> = {
  blue: 'bg-blue-100 border-blue-200 text-brand',
  orange: 'bg-orange-100 border-orange-200 text-orange-600',
  green: 'bg-green-100 border-green-200 text-green-600',
};
const filterSelect =
  'h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-brand cursor-pointer';

const DanhSachOrder: React.FC<{
  orders: DeliveryOrder[];
  connection: ConnectionState;
  onCompose: () => void;
  onInvoice: (o: DeliveryOrder) => void;
  onCancel: (o: DeliveryOrder) => void;
  onConfirmOnline: (o: DeliveryOrder, deliver: boolean) => void;
  goToBook: () => void;
}> = ({orders, connection, onCompose, onInvoice, onCancel, onConfirmOnline, goToBook}) => {
  const [tab, setTab] = useState<OrderTab>('all');
  const [view, setView] = useState<'card' | 'list'>('card');
  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState('all'); // trạng thái order
  const [dStatus, setDStatus] = useState('all'); // trạng thái giao (GE)
  const [partner, setPartner] = useState('all'); // đối tác
  const [source, setSource] = useState('all'); // nguồn đơn
  const [onlineList, setOnlineList] = useState<OnlineOrder[]>(ONLINE_ORDERS);
  const [panelOrder, setPanelOrder] = useState<OnlineOrder | null>(null);

  // Đơn Grab Express hiển thị ở Danh sách order CHỈ khi còn Chờ gửi đối tác — gửi
  // (Giao hàng) xong là rời khỏi Order ngay, theo dõi tiếp ở Sổ giao hàng (không trùng 2 nơi).
  const geRows: ListRow[] = orders
    .filter((o) => o.cukcukStatus === 'cho_gui_doi_tac')
    .map((o) => ({
      key: o.id,
      channel: 'delivery',
      chip: 'Grab Express',
      title: o.trackingNo ?? o.orderNo,
      orderNo: o.orderNo.replace('DH', ''),
      time: o.createdAt,
      amount: o.subtotal + o.shippingFeeCustomer,
      customer: o.customerName,
      dishes: o.items.length,
      address: `${o.address.district}, ${o.address.province}`,
      statusLabel: CUKCUK_STATUS[o.cukcukStatus].label,
      statusTone: 'orange',
      ge: o,
    }));

  const onlineRows: ListRow[] = onlineList.map((o) => ({
    key: o.id,
    channel: 'online',
    chip: o.source,
    title: o.orderNo,
    orderNo: o.orderNo,
    time: o.createdAt,
    amount: o.subtotal,
    customer: o.customerName,
    dishes: o.items.length,
    address: `${o.district}, ${o.province}`,
    statusLabel: 'Chưa xác nhận',
    statusTone: 'orange',
    online: o,
  }));

  const nonOnline = [...SAMPLE_ORDERS, ...geRows];
  const count = (t: OrderTab) =>
    t === 'all' ? nonOnline.length : t === 'online' ? onlineRows.length : nonOnline.filter((r) => r.channel === t).length;

  const rows = (tab === 'online' ? onlineRows : nonOnline).filter((r) => {
    if (tab !== 'all' && tab !== 'online' && r.channel !== tab) return false;
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      if (!`${r.title} ${r.customer} ${r.orderNo}`.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const confirmOnline = (deliveryOrder: DeliveryOrder, online: OnlineOrder, deliver: boolean) => {
    setOnlineList((l) => l.filter((x) => x.id !== online.id));
    setPanelOrder(null);
    onConfirmOnline(deliveryOrder, deliver);
  };

  const totalAmount = rows.reduce((s, r) => s + r.amount, 0);

  const TABS: {id: OrderTab; label: string}[] = [
    {id: 'all', label: 'Tất cả'},
    {id: 'table', label: 'Tại bàn'},
    {id: 'takeaway', label: 'Mang về'},
    {id: 'delivery', label: 'Giao hàng'},
    {id: 'online', label: 'Xác nhận đơn online'},
  ];

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Tab bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex h-full items-center gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex h-full items-center gap-2 whitespace-nowrap px-4 text-sm font-bold transition-all ${
                tab === t.id ? 'text-brand' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tab === t.id ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'}`}>
                {count(t.id)}
              </span>
              {tab === t.id && <span className="absolute inset-x-2 bottom-0 h-1 rounded-t-full bg-brand" />}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={goToBook} className="text-[13px] font-semibold text-brand hover:underline">
            Sổ giao hàng
          </button>
          <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={onCompose}>
            Tạo đơn giao hàng
          </Button>
        </div>
      </div>

      {/* Sub header */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
        <div className="relative w-[240px]">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm bàn, khách hàng..."
            className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm font-medium outline-none focus:border-brand"
          />
        </div>

        {/* Trạng thái order (mọi tab) */}
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className={filterSelect}>
          <option value="all">Tất cả</option>
          <option value="serving">Đang phục vụ</option>
          <option value="waiting_payment">Chờ thanh toán</option>
          <option value="draft">Lưu tạm tính</option>
          <option value="mine">Đơn của tôi</option>
        </select>

        {/* Bộ lọc riêng tab Giao hàng: trạng thái giao · đối tác · nguồn đơn */}
        {tab === 'delivery' && (
          <>
            <select value={dStatus} onChange={(e) => setDStatus(e.target.value)} className={filterSelect}>
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ giao</option>
              <option value="delivering">Đang giao</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <select value={partner} onChange={(e) => setPartner(e.target.value)} className={filterSelect}>
              <option value="all">Tất cả đối tác</option>
              <option value="self">Nhà hàng tự giao</option>
              <option value="grab">Grab Express</option>
              <option value="aha">AhaMove</option>
              <option value="shopee">ShopeeFood</option>
            </select>
            <select value={source} onChange={(e) => setSource(e.target.value)} className={filterSelect}>
              <option value="all">Tất cả nguồn đơn</option>
              <option value="app">App</option>
              <option value="web">Website</option>
              <option value="grab">Grab</option>
              <option value="shopee">Shopee</option>
            </select>
          </>
        )}

        <div className="ml-auto flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 p-0.5">
            <button
              onClick={() => setView('card')}
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${view === 'card' ? 'bg-brand text-white' : 'text-slate-400 hover:bg-slate-50'}`}
              title="Dạng thẻ"
            >
              <LayoutGrid className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${view === 'list' ? 'bg-brand text-white' : 'text-slate-400 hover:bg-slate-50'}`}
              title="Dạng danh sách"
            >
              <List className="h-[18px] w-[18px]" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
            <span>Tổng:</span>
            <span className="text-slate-800">{rows.length} order</span>
            <span className="mx-1 h-4 w-px bg-slate-200" />
            <span className="whitespace-nowrap text-lg font-black text-brand">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#EEF0F4] p-4">
        {rows.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <div className="text-5xl">🧾</div>
            <div className="text-[13px] font-semibold text-slate-700">Chưa có order nào</div>
            <div className="text-[12px] text-slate-400">Nhấn “Tạo đơn giao hàng” để gửi qua Grab Express.</div>
          </div>
        ) : view === 'card' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r) => (
              <OrderCard key={r.key} row={r} onInvoice={onInvoice} onCancel={onCancel} onOpenOnline={setPanelOrder} />
            ))}
          </div>
        ) : (
          <OrderListTable rows={rows} onInvoice={onInvoice} onCancel={onCancel} onOpenOnline={setPanelOrder} />
        )}
      </div>

      {panelOrder && (
        <OnlineOrderPanel
          order={panelOrder}
          connection={connection}
          onClose={() => setPanelOrder(null)}
          onConfirm={(deliveryOrder, deliver) => confirmOnline(deliveryOrder, panelOrder, deliver)}
        />
      )}
    </div>
  );
};

const ChipIcon: React.FC<{channel: ListRow['channel']}> = ({channel}) =>
  channel === 'table' ? (
    <UtensilsCrossed className="h-3 w-3" />
  ) : channel === 'takeaway' ? (
    <ShoppingBag className="h-3 w-3" />
  ) : channel === 'online' ? (
    <Globe className="h-3 w-3" />
  ) : (
    <GrabExpressLogo size={13} withText={false} />
  );

const OrderCard: React.FC<{
  row: ListRow;
  onInvoice: (o: DeliveryOrder) => void;
  onCancel: (o: DeliveryOrder) => void;
  onOpenOnline?: (o: OnlineOrder) => void;
}> = ({row, onInvoice, onCancel, onOpenOnline}) => {
  const isGe = row.channel === 'delivery';
  const isOnline = row.channel === 'online';
  const isSend = row.ge?.cukcukStatus === 'cho_gui_doi_tac';
  return (
    <div className="flex h-[220px] flex-col rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-bold ${CHIP_STYLE[row.channel]}`}>
            <ChipIcon channel={row.channel} />
            {row.chip}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-normal text-slate-400">
            <span>#{row.orderNo}</span>
            <Clock className="h-3 w-3" /> {row.time}
          </div>
        </div>
        <div className="mt-2 flex items-start justify-between">
          <h3 className="mr-2 flex-1 truncate text-xl font-black text-slate-800">{row.title}</h3>
          <span className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-xs ${STATUS_STYLE[row.statusTone]}`}>{row.statusLabel}</span>
        </div>
        {row.ge?.geStatus && (
          <div className="mt-2">
            <GeStatusPill status={row.ge.geStatus} />
          </div>
        )}
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-3">
          <Cell icon={<Wallet className="h-4 w-4 text-slate-400" />} value={formatCurrency(row.amount)} strong={isGe} />
          <Cell icon={<User className="h-4 w-4 text-slate-400" />} value={row.customer} />
          <Cell icon={<UtensilsCrossed className="h-4 w-4 text-slate-400" />} value={`${row.dishes} món`} />
          {isGe || isOnline ? (
            <Cell icon={<Truck className="h-4 w-4 text-slate-400" />} value={row.address ?? ''} />
          ) : (
            <Cell icon={<Users className="h-4 w-4 text-slate-400" />} value={`${row.guests} khách`} />
          )}
        </div>
      </div>
      <div className="flex gap-2 border-t border-slate-100 pt-3">
        {isOnline ? (
          <button
            onClick={() => onOpenOnline?.(row.online!)}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white hover:bg-brand-hover"
          >
            <ClipboardCheck className="h-4 w-4" /> Xác nhận đơn
          </button>
        ) : isGe && row.ge ? (
          // FR-pos-062 — Chờ gửi đối tác → Gửi đơn hàng; Chờ/Đang giao hàng → chỉ còn nút Hủy (không nút Giao hàng thủ công).
          isSend ? (
            <button
              onClick={() => onInvoice(row.ge!)}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white hover:bg-brand-hover"
            >
              <Truck className="h-4 w-4" /> Giao hàng
            </button>
          ) : null
        ) : (
          <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand bg-white text-sm font-medium text-brand hover:bg-blue-50">
            <CircleDollarSign className="h-4 w-4" /> Tính tiền
          </button>
        )}
        {!isOnline &&
          (isGe && row.ge ? (
            <button
              onClick={() => onCancel(row.ge!)}
              className={`flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-danger ${
                isSend ? '' : 'flex-1'
              }`}
            >
              <XCircle className="h-4 w-4" /> Hủy
            </button>
          ) : (
            <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <ChefHat className="h-3.5 w-3.5" /> Gửi bếp
            </button>
          ))}
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const Cell: React.FC<{icon: React.ReactNode; value: string; strong?: boolean}> = ({icon, value, strong}) => (
  <div className="flex min-w-0 items-center gap-2">
    {icon}
    <span className={`truncate text-sm leading-none ${strong ? 'font-bold text-brand' : 'font-normal text-slate-600'}`}>{value}</span>
  </div>
);

const OrderListTable: React.FC<{
  rows: ListRow[];
  onInvoice: (o: DeliveryOrder) => void;
  onCancel: (o: DeliveryOrder) => void;
  onOpenOnline?: (o: OnlineOrder) => void;
}> = ({rows, onInvoice, onCancel, onOpenOnline}) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <table className="w-full text-left text-[13px]">
      <thead className="bg-slate-50 text-[12px] font-semibold text-slate-500">
        <tr>
          <th className="px-4 py-3">Kênh</th>
          <th className="px-4 py-3">Mã / Bàn</th>
          <th className="px-4 py-3">Khách hàng</th>
          <th className="px-4 py-3 text-center">Món</th>
          <th className="px-4 py-3 text-right">Tổng tiền</th>
          <th className="px-4 py-3">Trạng thái</th>
          <th className="px-4 py-3 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map((r) => {
          const isGe = r.channel === 'delivery';
          const isSend = r.ge?.cukcukStatus === 'cho_gui_doi_tac';
          return (
            <tr key={r.key} className="hover:bg-slate-50/60">
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-bold ${CHIP_STYLE[r.channel]}`}>
                  <ChipIcon channel={r.channel} /> {r.chip}
                </span>
              </td>
              <td className="px-4 py-3 font-bold text-slate-800">{r.title}</td>
              <td className="px-4 py-3 text-slate-600">{r.customer}</td>
              <td className="px-4 py-3 text-center text-slate-600">{r.dishes}</td>
              <td className="px-4 py-3 text-right font-black text-slate-800">{formatCurrency(r.amount)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className={`w-fit rounded-full border px-2 py-0.5 text-xs ${STATUS_STYLE[r.statusTone]}`}>{r.statusLabel}</span>
                  {r.ge?.geStatus && <GeStatusPill status={r.ge.geStatus} />}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  {r.channel === 'online' ? (
                    <Button variant="primary" size="sm" icon={<ClipboardCheck className="h-4 w-4" />} onClick={() => onOpenOnline?.(r.online!)}>
                      Xác nhận
                    </Button>
                  ) : isGe && r.ge ? (
                    <>
                      {/* FR-pos-062 — Chờ gửi đối tác → Gửi đơn; Chờ/Đang giao → chỉ Hủy (không nút Giao hàng thủ công). */}
                      {isSend && (
                        <Button variant="primary" size="sm" icon={<Truck className="h-4 w-4" />} onClick={() => onInvoice(r.ge!)}>
                          Giao hàng
                        </Button>
                      )}
                      <button onClick={() => onCancel(r.ge!)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-danger">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <Button variant="secondary" size="sm" icon={<CircleDollarSign className="h-4 w-4" />}>
                      Tính tiền
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// ---------------------------------------------------------------------------
// Xác nhận đơn online — slide-out panel (2 tab), chọn đối tác Grab Express
// ---------------------------------------------------------------------------
const OnlineOrderPanel: React.FC<{
  order: OnlineOrder;
  connection: ConnectionState;
  onClose: () => void;
  onConfirm: (deliveryOrder: DeliveryOrder, deliver: boolean) => void;
}> = ({order, connection, onClose, onConfirm}) => {
  const [ptab, setPtab] = useState<'info' | 'partner'>('info');
  const [method, setMethod] = useState<DeliveryMethod>('GRAB');
  const [feeCustomer, setFeeCustomer] = useState<number | null>(null);
  const [provinceAlert, setProvinceAlert] = useState(false);
  const [simNoQuote, setSimNoQuote] = useState(false); // demo: Grab không báo giá được

  const isGrab = method === 'GRAB';
  // BR-006 — coverage + phí từ Quote động (simNoQuote = demo ngoài vùng).
  const quote = quoteDelivery(order);
  const supported = !simNoQuote && quote.covered;
  const partnerFee = isGrab && supported ? quote.fee : 0;
  const feeCust = feeCustomer ?? partnerFee;
  const total = order.subtotal + (isGrab ? feeCust : 0);

  const build = (): DeliveryOrder => ({
    id: 'o' + Date.now(),
    orderNo: order.orderNo,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    address: {id: 'on', freetext: order.freetext, ward: order.ward, district: order.district, province: order.province, isDefault: true},
    items: order.items,
    subtotal: order.subtotal,
    shippingFeePartner: partnerFee,
    shippingFeeCustomer: feeCust,
    isCod: true,
    codAmount: total,
    serviceType: SERVICE_TYPE_DEFAULT,
    cukcukStatus: 'cho_gui_doi_tac',
    geStatus: undefined,
    scheduledTime: order.deliveryTime,
    createdAt: 'vừa xong',
  });

  const doConfirm = (deliver: boolean) => {
    if (isGrab && !supported) {
      setProvinceAlert(true);
      setPtab('partner');
      return;
    }
    onConfirm(build(), deliver);
  };

  return (
    <div className="absolute inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="animate-slide-left relative z-10 flex h-full w-[500px] flex-col bg-white">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {(['info', 'partner'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPtab(t)}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                ptab === t ? 'border-b-2 border-brand text-brand' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'info' ? 'Thông tin đơn hàng' : 'Đối tác giao hàng'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {ptab === 'info' ? (
            <>
              <div className="mb-5">
                <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
                  Đơn giao hàng: {order.orderNo}
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-600">{order.source}</span>
                </h2>
                <p className="mt-1 text-sm italic text-slate-400">Thời gian đặt: {order.createdAt}</p>
              </div>
              <div className="space-y-4">
                <PanelInfo icon={<CalendarDays className="h-5 w-5 text-slate-400" />} label="Thời gian nhận" value={`${order.deliveryTime} · ${order.createdAt.split(' ')[1] ?? ''}`} />
                <PanelInfo icon={<User className="h-5 w-5 text-slate-400" />} label="Khách hàng" value={`${order.customerName} · ${order.customerPhone}`} />
                <PanelInfo icon={<MapPin className="h-5 w-5 text-slate-400" />} label="Địa chỉ giao hàng" value={`${order.freetext}, ${order.ward}, ${order.district}, ${order.province}`} />
                {order.note && <PanelInfo icon={<NotebookPen className="h-5 w-5 text-slate-400" />} label="Ghi chú" value={order.note} accent />}
              </div>
              <div className="mt-8">
                <h3 className="mb-3 font-black text-slate-900">Danh sách món</h3>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 font-medium text-slate-400">
                      <tr>
                        <th className="px-4 py-3">Tên món</th>
                        <th className="px-4 py-3 text-center">SL</th>
                        <th className="px-4 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.items.map((it) => (
                        <tr key={it.id}>
                          <td className="px-4 py-3 font-bold text-slate-700">{it.name}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-600">{it.qty}</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(it.qty * it.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              <Row label="Hình thức giao" required>
                <div className="relative">
                  <select
                    value={method}
                    onChange={(e) => {
                      const m = e.target.value as DeliveryMethod;
                      setMethod(m);
                      if (m === 'GRAB' && !supported) setProvinceAlert(true);
                    }}
                    className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-brand"
                  >
                    <option value="SELF">Nhà hàng tự giao</option>
                    <option value="GRAB">Grab Express</option>
                    <option value="AHAMOVE">AhaMove</option>
                    <option value="SHOPEE">ShopeeFood</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </Row>

              {isGrab ? (
                <div className="mt-4 space-y-4">
                  <Row label="Loại dịch vụ">
                    <input value={SERVICE_TYPE_DEFAULT} disabled className={rowInput() + ' cursor-not-allowed bg-slate-50 text-slate-500'} />
                  </Row>
                  {/* Demo control — mô phỏng Grab không báo giá được (E-005) */}
                  <Row label="">
                    <div className="flex items-center justify-between rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-2.5">
                      <span className="flex items-center gap-2 text-[12.5px] font-medium text-amber-700">
                        <Info className="h-4 w-4" /> Demo: Grab không báo giá được
                      </span>
                      <button
                        type="button"
                        onClick={() => setSimNoQuote((v) => !v)}
                        className={`relative h-6 w-12 shrink-0 rounded-full transition-all ${simNoQuote ? 'bg-amber-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${simNoQuote ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </Row>
                  <Row label="Phí GH trả đối tác">
                    <div className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                        Theo Grab Express <InfoTip text={MSG.feeHint} />
                      </span>
                      {supported ? (
                        <span className="text-sm font-bold text-slate-800">{formatCurrency(partnerFee)}</span>
                      ) : (
                        <span className="text-[12px] font-semibold text-amber-600">Không báo giá được</span>
                      )}
                    </div>
                  </Row>
                  <Row label="Phí GH thu khách">
                    <input
                      type="number"
                      value={feeCust}
                      onChange={(e) => setFeeCustomer(Number(e.target.value))}
                      className={rowInput() + ' text-right font-bold'}
                    />
                  </Row>
                  {connection.isConnected ? (
                    <div className="rounded-xl bg-grab-light/50 px-3 py-2 text-[12.5px] text-grab">
                      Nhà hàng đã kết nối Grab Express — đơn sẽ vào <b>Chờ gửi đối tác</b> sau khi xác nhận.
                    </div>
                  ) : (
                    <div className="rounded-xl bg-amber-50 px-3 py-2 text-[12.5px] text-amber-700">
                      Chưa kết nối Grab Express (vào Web quản lý › Ứng dụng để kết nối).
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-500">
                  Hình thức <b>{METHOD_LABELS[method]}</b> — xử lý theo nghiệp vụ đối tác tương ứng.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/40 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-slate-600">
              Còn phải thu <Info className="h-4 w-4 text-brand" />
            </span>
            <span className="text-2xl font-black text-slate-900">{formatCurrency(total)}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="h-11 flex-1 rounded-xl border border-red-200 font-bold text-red-500 hover:bg-red-50">
              Từ chối
            </button>
            <button onClick={() => doConfirm(true)} className="h-11 flex-1 rounded-xl border border-brand font-bold text-brand hover:bg-blue-50">
              Xác nhận & Giao hàng
            </button>
            <button onClick={() => doConfirm(false)} className="h-11 flex-1 rounded-xl bg-brand font-bold text-white hover:bg-brand-hover">
              Xác nhận
            </button>
          </div>
        </div>
      </div>

      <AlertPopup
        contained
        open={provinceAlert}
        title="Khu vực chưa được hỗ trợ"
        message={MSG.areaNoQuote}
        onClose={() => setProvinceAlert(false)}
      />
    </div>
  );
};

const PanelInfo: React.FC<{icon: React.ReactNode; label: string; value: string; accent?: boolean}> = ({icon, label, value, accent}) => (
  <div className="flex items-start gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs font-medium tracking-wider text-slate-400">{label}</p>
      <p className={`mt-0.5 text-sm font-bold leading-relaxed ${accent ? 'italic text-blue-500' : 'text-slate-700'}`}>{value}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Modal "Thông tin Order: Giao hàng" — dropdown nhiều Hình thức giao
// ---------------------------------------------------------------------------
const rowInput = (err?: boolean) =>
  `w-full h-11 px-4 rounded-xl border ${
    err ? 'border-danger' : 'border-slate-200'
  } focus:outline-none focus:border-brand bg-white text-sm font-medium`;

const DeliveryInfoModal: React.FC<{
  method: DeliveryMethod;
  setMethod: (m: DeliveryMethod) => void;
  deliveryDate: string;
  setDeliveryDate: (s: string) => void;
  deliveryTime: string;
  setDeliveryTime: (s: string) => void;
  customer: Customer | null;
  onPickCustomer: (c: Customer) => void;
  custErr: boolean;
  setCustErr: (b: boolean) => void;
  addr: CustomerAddress;
  setAddr: React.Dispatch<React.SetStateAction<CustomerAddress>>;
  addrErr: boolean;
  setAddrErr: (b: boolean) => void;
  addressComplete: boolean;
  hasDeposit: boolean;
  setHasDeposit: (b: boolean) => void;
  depositAmount: number;
  setDepositAmount: (n: number) => void;
  partnerCode: string;
  setPartnerCode: (s: string) => void;
  selfFee: number;
  setSelfFee: (n: number) => void;
  partnerFee: number;
  feeCust: number;
  setFeeCustomer: (n: number) => void;
  isCod: boolean;
  setIsCod: (b: boolean) => void;
  codAmount: number;
  note: string;
  setNote: (s: string) => void;
  subtotal: number;
  total: number;
  simNoQuote: boolean;
  setSimNoQuote: (b: boolean) => void;
  quoteCovered: boolean;
  onProvinceUnsupported: () => void;
  onClose: () => void;
}> = (p) => {
  const isGrab = p.method === 'GRAB';
  const isSelf = p.method === 'SELF';

  const handleConfirm = () => {
    const custMissing = !p.customer;
    const addrMissing = isGrab ? !(p.addr.freetext.trim() && p.addressComplete) : !p.addr.freetext.trim();
    p.setCustErr(custMissing);
    p.setAddrErr(addrMissing);
    if (custMissing || addrMissing) return;
    // BR-006 — chặn Lưu khi Grab không báo giá được (E-001/E-005).
    if (isGrab && !p.quoteCovered) {
      p.onProvinceUnsupported();
      return;
    }
    p.onClose();
  };

  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={p.onClose} />
      <div className="animate-scale-up relative flex max-h-[92%] w-full max-w-[600px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="relative flex items-center border-b border-slate-100 p-5">
          <h3 className="text-xl font-bold text-slate-800">Thông tin Order: Giao hàng</h3>
          {isGrab && <GrabExpressChip className="ml-2" />}
          <button onClick={p.onClose} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Ngày giao */}
          <Row label="Ngày giao" required>
            <input type="date" value={p.deliveryDate} onChange={(e) => p.setDeliveryDate(e.target.value)} className={rowInput()} />
          </Row>
          {/* Giờ giao */}
          <Row label="Giờ giao" required>
            <input type="time" value={p.deliveryTime} onChange={(e) => p.setDeliveryTime(e.target.value)} className={rowInput()} />
          </Row>

          {/* Khách hàng */}
          <Row label="Khách hàng" required>
            <div
              className={`flex h-11 items-center gap-2 rounded-xl border bg-white px-3 ${
                p.custErr ? 'border-danger' : 'border-slate-200'
              }`}
            >
              <User className="h-5 w-5 shrink-0 text-slate-400" />
              <select
                value={p.customer?.id ?? ''}
                onChange={(e) => {
                  const c = CUSTOMERS.find((x) => x.id === e.target.value);
                  if (c) {
                    p.onPickCustomer(c);
                    p.setCustErr(false);
                  }
                }}
                className="flex-1 border-none bg-transparent text-sm font-medium text-slate-800 outline-none"
              >
                <option value="">Nhập tên hoặc SĐT khách...</option>
                {CUSTOMERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.phone}
                  </option>
                ))}
              </select>
              <div className="h-4 w-px bg-slate-200" />
              <Plus className="h-5 w-5 text-green-600" />
            </div>
            {p.custErr && <div className="mt-1 text-[11px] font-medium text-danger">Trường này không được để trống</div>}
          </Row>

          {/* Địa chỉ giao */}
          <Row label="Địa chỉ giao" required alignTop>
            <div className="relative">
              <textarea
                value={p.addr.freetext}
                onChange={(e) => {
                  p.setAddr((a) => ({...a, freetext: e.target.value}));
                  if (e.target.value.trim()) p.setAddrErr(false);
                }}
                placeholder={isGrab ? 'Số nhà, tên đường (VD: 88 Bà Triệu)...' : 'Nhập địa chỉ nhận hàng...'}
                className={`w-full resize-none rounded-xl border p-4 pl-10 text-sm font-medium outline-none focus:border-brand ${
                  isGrab ? 'h-11' : 'h-20'
                } ${p.addrErr ? 'border-danger' : 'border-slate-200'}`}
              />
              <MapPin className="absolute left-3 top-4 h-5 w-5 text-slate-400" />
            </div>
            {p.addrErr && <div className="mt-1 text-[11px] font-medium text-danger">Trường này không được để trống</div>}
            {isGrab && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                <select
                  value={p.addr.province}
                  onChange={(e) => {
                    const prov = e.target.value;
                    // BR-006 — coverage kiểm tra khi đủ địa chỉ + có báo giá, không chặn theo tỉnh.
                    p.setAddr((a) => ({...a, province: prov, district: '', ward: ''}));
                  }}
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand"
                >
                  <option value="">Tỉnh/TP</option>
                  {ALL_PROVINCES.map((pr) => (
                    <option key={pr} value={pr}>
                      {pr}
                    </option>
                  ))}
                </select>
                <select
                  value={p.addr.district}
                  disabled={!p.addr.province}
                  onChange={(e) => p.setAddr((a) => ({...a, district: e.target.value, ward: ''}))}
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">Quận/Huyện</option>
                  {districtsOf(p.addr.province).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={p.addr.ward}
                  disabled={!p.addr.district}
                  onChange={(e) => {
                    const ward = e.target.value;
                    p.setAddr((a) => ({...a, ward}));
                    // Đủ địa chỉ + Grab không báo giá được → cảnh báo ngoài vùng (E-005).
                    const covered = !p.simNoQuote && quoteDelivery({...p.addr, ward}).covered;
                    if (isGrab && ward && !covered) p.onProvinceUnsupported();
                  }}
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">Phường/Xã</option>
                  {WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Row>

          {/* Đặt cọc trước */}
          <Row label="">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                  <Wallet className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-700">Đặt cọc trước</div>
                  <div className="text-xs text-slate-400">Khách đã thanh toán một phần</div>
                </div>
              </div>
              <button
                onClick={() => p.setHasDeposit(!p.hasDeposit)}
                className={`relative h-6 w-12 rounded-full transition-all ${p.hasDeposit ? 'bg-[#4CAF50]' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${p.hasDeposit ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </Row>
          {p.hasDeposit && (
            <Row label="Số tiền cọc" required>
              <div className="relative">
                <input
                  type="number"
                  value={p.depositAmount || ''}
                  onChange={(e) => p.setDepositAmount(Number(e.target.value))}
                  placeholder="0"
                  className={rowInput() + ' pl-10 text-right font-bold'}
                />
                <Coins className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </Row>
          )}

          {/* Hình thức giao */}
          <Row label="Hình thức giao" required>
            <div className="relative">
              <select
                value={p.method}
                onChange={(e) => p.setMethod(e.target.value as DeliveryMethod)}
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-brand"
              >
                <option value="SELF">Nhà hàng tự giao</option>
                <option value="GRAB">Grab Express</option>
                <option value="AHAMOVE">AhaMove</option>
                <option value="SHOPEE">ShopeeFood</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </Row>

          {/* ==== Khối theo Hình thức giao ==== */}
          {isGrab ? (
            <>
              <Row label="Loại dịch vụ">
                <input
                  value={SERVICE_TYPE_DEFAULT}
                  disabled
                  className={rowInput() + ' cursor-not-allowed bg-slate-50 text-slate-500'}
                />
              </Row>
              {/* Demo control — mô phỏng Grab KHÔNG báo giá được (E-005), thay cho việc hard-code vùng */}
              <Row label="">
                <div className="flex items-center justify-between rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-2.5">
                  <span className="flex items-center gap-2 text-[12.5px] font-medium text-amber-700">
                    <Info className="h-4 w-4" /> Demo: Grab không báo giá được (ngoài vùng phục vụ)
                  </span>
                  <button
                    type="button"
                    onClick={() => p.setSimNoQuote(!p.simNoQuote)}
                    className={`relative h-6 w-12 shrink-0 rounded-full transition-all ${p.simNoQuote ? 'bg-amber-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${p.simNoQuote ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </Row>
              <Row label="Phí GH trả đối tác">
                <div className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                    Theo Grab Express <InfoTip text={MSG.feeHint} />
                  </span>
                  {!p.addressComplete ? (
                    <span className="text-[12px] italic text-slate-400">Điền đủ Tỉnh/Quận/Phường</span>
                  ) : p.quoteCovered ? (
                    <span className="text-sm font-bold text-slate-800">{formatCurrency(p.partnerFee)}</span>
                  ) : (
                    <span className="text-[12px] font-semibold text-amber-600">Không báo giá được</span>
                  )}
                </div>
              </Row>
              <Row label="Phí GH thu khách">
                <>
                  <div className="relative">
                    <input
                      type="number"
                      value={p.feeCust}
                      disabled={!p.addressComplete}
                      onChange={(e) => p.setFeeCustomer(Number(e.target.value))}
                      className={rowInput() + ' pl-10 text-right font-bold disabled:bg-slate-50'}
                    />
                    <Truck className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>
                  {/* BR-pos-03 — cảnh báo mềm (không chặn) khi thu khách < trả đối tác */}
                  {p.addressComplete && p.quoteCovered && p.feeCust < p.partnerFee && (
                    <div className="mt-1 text-[12px] text-amber-600">
                      Phí thu khách thấp hơn phí trả đối tác — nhà hàng bù phần chênh {formatCurrency(p.partnerFee - p.feeCust)}.
                    </div>
                  )}
                </>
              </Row>
              {/* BR-pos-02 — COD = Còn phải thu, tự tính (không nhập tay, không tick). */}
              <Row label="Thu hộ (COD)">
                <div className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <span className="text-[13px] text-slate-500">Tài xế thu của khách khi giao</span>
                  <span className="text-sm font-black text-slate-800">{formatCurrency(p.codAmount)}</span>
                </div>
              </Row>
            </>
          ) : (
            <>
              <Row label="Mã đơn đối tác">
                <input
                  disabled={isSelf}
                  value={isSelf ? '' : p.partnerCode}
                  onChange={(e) => p.setPartnerCode(e.target.value)}
                  placeholder={isSelf ? 'N/A' : 'Nhập mã vận đơn...'}
                  className={rowInput() + (isSelf ? ' cursor-not-allowed bg-slate-50 opacity-50' : '')}
                />
              </Row>
              <Row label="Phí giao hàng">
                <div className="relative">
                  <input
                    type="number"
                    readOnly={!isSelf}
                    value={isSelf ? p.selfFee || '' : 25000}
                    onChange={(e) => isSelf && p.setSelfFee(Number(e.target.value))}
                    placeholder="0"
                    className={`h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-right text-sm font-bold outline-none focus:border-brand ${
                      !isSelf ? 'bg-slate-50 text-slate-600' : 'bg-white text-slate-900'
                    }`}
                  />
                  <Truck className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </Row>
            </>
          )}

          {/* Ghi chú giao hàng */}
          <Row label="Ghi chú giao hàng" alignTop>
            <textarea
              value={p.note}
              onChange={(e) => p.setNote(e.target.value.slice(0, 255))}
              placeholder="Nhập ghi chú thêm cho Shipper..."
              className="h-20 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm font-medium outline-none focus:border-brand"
            />
          </Row>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-[#f5f5f5] px-5 py-4">
          <button onClick={p.onClose} className="h-10 min-w-[120px] rounded-lg border border-slate-300 bg-white px-8 text-[13px] font-bold text-slate-700 hover:bg-slate-50">
            Hủy bỏ
          </button>
          <button onClick={handleConfirm} className="h-10 min-w-[120px] rounded-lg bg-brand px-8 text-[13px] font-bold text-white hover:brightness-110 active:scale-[0.98]">
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{label: string; required?: boolean; alignTop?: boolean; children: React.ReactNode}> = ({
  label,
  required,
  alignTop,
  children,
}) => (
  <div className={`flex gap-4 ${alignTop ? 'items-start' : 'items-center'}`}>
    <label className={`w-32 shrink-0 text-sm font-bold text-slate-700 ${alignTop ? 'mt-3' : ''}`}>
      {label}
      {required && <span className="text-danger"> *</span>}
    </label>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

// ---------------------------------------------------------------------------
// Hóa đơn giao hàng (Gửi đơn / Giao hàng)
// ---------------------------------------------------------------------------
const InvoiceDeliveryScreen: React.FC<{
  order: DeliveryOrder;
  connection: ConnectionState;
  onClose: () => void;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
  onSend: (id: string) => void;
}> = ({order, connection, onClose, pushToast, onSend}) => {
  const [connFail, setConnFail] = useState(false);
  const total = order.subtotal + order.shippingFeeCustomer;

  // BR-007 — màn này chỉ để Gửi đơn sang Grab Express; không có Giao hàng thủ công (auto-sync lo bước giao).
  const handlePrimary = () => {
    if (!connection.isConnected) {
      setConnFail(true);
      return;
    }
    onSend(order.id);
  };

  return (
    <Modal
      open
      contained
      onClose={onClose}
      width={560}
      title={
        <span className="flex items-center gap-2">
          Giao hàng · {order.orderNo}
          <GrabExpressChip />
        </span>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="grab" icon={<Send className="h-4 w-4" />} onClick={handlePrimary} className="min-w-[150px]">
            Giao hàng
          </Button>
        </>
      }
    >
      <div className="mb-4 rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 px-4 py-2.5 text-[12px] font-semibold text-slate-500">
          Thông tin đơn gửi sang Grab Express
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 p-4 text-[13px]">
          <Info2 label="Loại dịch vụ" value={order.serviceType} />
          <Info2 label="Địa chỉ lấy hàng" value={`${connection.info.address}, ${connection.info.province}`} />
          <Info2 label="Người gửi" value="Nguyễn Thu Hằng (thu ngân)" />
          <Info2 label="SĐT gửi" value={connection.info.phone} />
          <Info2 label="Người nhận" value={`${order.customerName} · ${order.customerPhone}`} />
          <Info2 label="Địa chỉ giao" value={`${order.address.freetext}, ${order.address.ward}, ${order.address.district}, ${order.address.province}`} />
          {connection.requireVatInvoice && <Info2 label="Email xuất hóa đơn" value={connection.vatEmail || '—'} />}
          <Info2 label="Thu hộ (COD)" value={order.isCod ? formatCurrency(order.codAmount) : 'Không'} />
        </div>
      </div>

      <div className="mb-3 space-y-1.5">
        {order.items.map((it) => (
          <div key={it.id} className="flex items-center justify-between text-[13px]">
            <span className="text-slate-800">
              {it.qty} × {it.name}
            </span>
            <span className="font-medium text-slate-800">{formatCurrency(it.qty * it.price)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 rounded-xl bg-slate-50 p-4 text-[13px]">
        <RowKV label="Tiền hàng" value={formatCurrency(order.subtotal)} />
        <RowKV label="Phí GH thu khách" value={formatCurrency(order.shippingFeeCustomer)} />
        <RowKV label="Phí GH trả đối tác" value={formatCurrency(order.shippingFeePartner)} />
        <div className="mt-1 flex items-center justify-between border-t border-slate-200 pt-2">
          <span className="font-semibold text-slate-800">Tổng tiền</span>
          <span className="text-[16px] font-black text-brand">{formatCurrency(total)}</span>
        </div>
      </div>

      <AlertPopup
        contained
        open={connFail}
        title="Không kết nối được đối tác"
        message={MSG.connectFailed}
        primaryText="Chọn đối tác giao hàng khác"
        onPrimary={() => {
          setConnFail(false);
          pushToast('info', 'Chuyển sang Nhà hàng tự giao');
          onClose();
        }}
        onClose={() => setConnFail(false)}
      />
    </Modal>
  );
};

const RowKV: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

const Info2: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div className="min-w-0">
    <div className="text-[11px] text-slate-400">{label}</div>
    <div className="truncate font-medium text-slate-800" title={value}>
      {value}
    </div>
  </div>
);
