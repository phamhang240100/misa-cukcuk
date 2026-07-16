import React, {useMemo, useState} from 'react';
import {
  Bike,
  ChevronRight,
  ClipboardList,
  Info,
  Pencil,
  Plus,
  Send,
  Truck,
  Utensils,
  X,
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
  formatCurrency,
  isSupportedProvince,
} from '../constants';
import {CUSTOMERS} from '../data';
import {
  AlertPopup,
  Button,
  Field,
  GeStatusPill,
  GrabExpressChip,
  InfoTip,
  Modal,
  inputCls,
} from '../components/ui';

interface Props {
  connection: ConnectionState;
  orders: DeliveryOrder[];
  setOrders: React.Dispatch<React.SetStateAction<DeliveryOrder[]>>;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
  goToBook: () => void;
}

// Giả lập mã ưu đãi + phí theo khoảng cách (mock)
const mockPartnerFee = (province: string) => {
  const table: Record<string, number> = {
    'TP. Hà Nội': 18000,
    'TP. Hồ Chí Minh': 22000,
    'Đà Nẵng': 16000,
    'Quảng Ninh': 25000,
    'Cần Thơ': 20000,
  };
  return table[province] ?? 20000;
};

const MOCK_CART = [
  {id: 'm1', name: 'Phở bò chín đặc biệt', qty: 2, price: 65000},
  {id: 'm8', name: 'Trà đá', qty: 2, price: 5000},
];

export const PosOrderSurface: React.FC<Props> = ({
  connection,
  orders,
  setOrders,
  pushToast,
  goToBook,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<DeliveryOrder | null>(null);

  // đơn hiển thị trên Danh sách order: Chờ gửi đối tác + Chờ giao hàng
  const listed = orders.filter(
    (o) => o.cukcukStatus === 'cho_gui_doi_tac' || o.cukcukStatus === 'cho_giao_hang',
  );

  const updateStatus = (id: string, patch: Partial<DeliveryOrder>) =>
    setOrders((os) => os.map((o) => (o.id === id ? {...o, ...patch} : o)));

  return (
    <div className="flex h-full">
      {/* Sidebar POS mini */}
      <aside className="hidden w-20 shrink-0 flex-col items-center gap-1 border-r border-border-neutral-light bg-white py-3 md:flex">
        {[
          {icon: <ClipboardList size={20} />, label: 'Order', active: true},
          {icon: <Utensils size={20} />, label: 'Thực đơn'},
          {icon: <Truck size={20} />, label: 'Giao hàng'},
        ].map((m) => (
          <button
            key={m.label}
            className={`flex w-16 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium ${
              m.active ? 'bg-brand-light text-brand' : 'text-text-secondary hover:bg-gray-50'
            }`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </aside>

      {/* Danh sách order */}
      <section className="min-w-0 flex-1 overflow-y-auto p-5">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-text-primary">Danh sách order</h2>
              <p className="text-[13px] text-text-secondary">
                Nhóm <b>Chờ giao hàng</b> · đơn Grab Express hiển thị biểu tượng đối tác.
              </p>
            </div>
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => {
                if (!connection.isConnected) {
                  pushToast(
                    'warning',
                    'Chưa kết nối Grab Express',
                    'Vào Web quản lý › Ứng dụng để kết nối trước khi tạo đơn GE.',
                  );
                }
                setFormOpen(true);
              }}
            >
              Tạo đơn giao hàng
            </Button>
          </div>

          {/* Group Chờ giao hàng */}
          <div className="rounded-2xl border border-border-neutral-light bg-white">
            <div className="flex items-center justify-between border-b border-border-neutral-light px-4 py-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-text-primary">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-warning">
                  <Truck size={14} />
                </span>
                Chờ giao hàng
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-text-secondary">
                  {listed.length}
                </span>
              </div>
              <button onClick={goToBook} className="text-[12px] font-semibold text-brand hover:underline">
                Mở Sổ giao hàng
              </button>
            </div>

            {listed.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-icon-neutral">
                  <Truck size={22} />
                </div>
                <div className="text-[13px] font-semibold text-text-primary">Chưa có đơn chờ giao</div>
                <div className="text-[12px] text-text-hint">Tạo đơn giao hàng để gửi qua Grab Express.</div>
              </div>
            ) : (
              <div className="divide-y divide-border-neutral-light">
                {listed.map((o) => (
                  <OrderRow
                    key={o.id}
                    order={o}
                    onPrimary={() => setInvoiceOrder(o)}
                    onCancel={() => {
                      updateStatus(o.id, {cukcukStatus: 'da_thanh_toan', geStatus: o.geStatus});
                      // demo: hủy = loại khỏi danh sách; nếu Chờ giao hàng thì gửi hủy sang GE
                      setOrders((os) => os.filter((x) => x.id !== o.id));
                      pushToast(
                        'info',
                        'Đã hủy đơn',
                        o.cukcukStatus === 'cho_giao_hang'
                          ? 'Đã gửi trạng thái Hủy sang Grab Express.'
                          : 'Xử lý tương tự order nhà hàng tự giao.',
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="mt-3 text-[12px] text-text-hint">
            * Đơn <b>Đang giao hàng</b> và <b>Đã thanh toán</b> không hiển thị ở Danh sách order — xem tại <b>Sổ giao hàng</b>.
          </p>
        </div>
      </section>

      {/* Form Thông tin giao hàng */}
      {formOpen && (
        <DeliveryInfoForm
          connection={connection}
          onClose={() => setFormOpen(false)}
          pushToast={pushToast}
          onSaved={(order, addMore) => {
            setOrders((os) => [order, ...os]);
            pushToast('success', 'Đã lưu đơn', `Đơn ${order.orderNo} ở trạng thái Chờ gửi đối tác.`);
            if (!addMore) setFormOpen(false);
          }}
        />
      )}

      {/* Hóa đơn giao hàng (tính tiền) — Gửi đơn hàng / Giao hàng */}
      {invoiceOrder && (
        <InvoiceDeliveryScreen
          order={invoiceOrder}
          connection={connection}
          onClose={() => setInvoiceOrder(null)}
          pushToast={pushToast}
          onSend={(id) => {
            const tracking = 'GE-' + Math.floor(8_000_000_000 + (id.charCodeAt(1) || 3) * 137_000);
            updateStatus(id, {
              cukcukStatus: 'cho_giao_hang',
              geStatus: 'ALLOCATING',
              trackingNo: tracking,
            });
            setInvoiceOrder(null);
            pushToast('success', 'Đã gửi đơn sang Grab Express', 'Đơn chuyển sang Chờ giao hàng · GE đang tìm tài xế.');
          }}
          onDeliver={(id) => {
            updateStatus(id, {cukcukStatus: 'dang_giao_hang'});
            setInvoiceOrder(null);
            pushToast('success', 'Đã giao hàng', 'Đơn chuyển sang Đang giao hàng.');
            goToBook();
          }}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// 1 dòng đơn trong Danh sách order
// ---------------------------------------------------------------------------
const OrderRow: React.FC<{
  order: DeliveryOrder;
  onPrimary: () => void;
  onCancel: () => void;
}> = ({order, onPrimary, onCancel}) => {
  const isSend = order.cukcukStatus === 'cho_gui_doi_tac';
  const st = CUKCUK_STATUS[order.cukcukStatus];
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50/60">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[13px] font-bold text-text-primary">{order.orderNo}</span>
          <GrabExpressChip />
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{color: st.color, background: st.bg}}
          >
            {st.label}
          </span>
          {order.geStatus && <GeStatusPill status={order.geStatus} />}
        </div>
        <div className="truncate text-[12.5px] text-text-secondary">
          {order.customerName} · {order.customerPhone} · {order.address.freetext}, {order.address.ward}, {order.address.district}, {order.address.province}
        </div>
      </div>
      <div className="text-right">
        <div className="text-[14px] font-black text-text-primary">
          {formatCurrency(order.subtotal + order.shippingFeeCustomer)}
        </div>
        <div className="text-[11px] text-text-hint">COD {formatCurrency(order.codAmount)}</div>
      </div>
      <div className="flex items-center gap-1.5">
        {isSend && (
          <button
            title="Sửa order"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-icon-neutral hover:bg-gray-100"
          >
            <Pencil size={16} />
          </button>
        )}
        <Button
          variant="grab"
          size="sm"
          icon={isSend ? <Send size={15} /> : <Truck size={15} />}
          onClick={onPrimary}
        >
          {isSend ? 'Gửi đơn hàng' : 'Giao hàng'}
        </Button>
        <button
          onClick={onCancel}
          title="Hủy"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-icon-neutral hover:bg-red-50 hover:text-danger"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Form Thông tin giao hàng — chọn đối tác Grab Express
// ---------------------------------------------------------------------------
const DeliveryInfoForm: React.FC<{
  connection: ConnectionState;
  onClose: () => void;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
  onSaved: (order: DeliveryOrder, addMore: boolean) => void;
}> = ({connection, onClose, pushToast, onSaved}) => {
  const [customer, setCustomer] = useState<Customer>(CUSTOMERS[0]);
  const defaultAddr = customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0];
  const [addr, setAddr] = useState<CustomerAddress>({...defaultAddr});
  const [note, setNote] = useState('');
  const [isCod, setIsCod] = useState(true);
  const [feeCustomer, setFeeCustomer] = useState<number | null>(null);
  const [provinceAlert, setProvinceAlert] = useState(false);
  const [codAlert, setCodAlert] = useState(false);
  const [connFailAlert, setConnFailAlert] = useState(false);

  const subtotal = MOCK_CART.reduce((s, i) => s + i.qty * i.price, 0);
  const addressComplete = !!(addr.province && addr.district && addr.ward);
  const partnerFee = addressComplete ? mockPartnerFee(addr.province) : 0;
  const effectiveFeeCustomer = feeCustomer ?? partnerFee;
  const total = subtotal + effectiveFeeCustomer;
  const codAmount = total; // COD = còn phải thu

  const pickCustomer = (c: Customer) => {
    setCustomer(c);
    const d = c.addresses.find((a) => a.isDefault) ?? c.addresses[0];
    setAddr({...d});
    setFeeCustomer(null);
  };

  const changeProvince = (p: string) => {
    setAddr((a) => ({...a, province: p}));
    setFeeCustomer(null);
    if (p && !isSupportedProvince(p)) setProvinceAlert(true);
  };

  const buildOrder = (): DeliveryOrder => ({
    id: 'o' + Date.now(),
    orderNo: 'DH' + String(150 + Math.floor(performance.now() % 90)).padStart(6, '0'),
    customerName: customer.name,
    customerPhone: customer.phone,
    address: addr,
    items: MOCK_CART,
    subtotal,
    shippingFeePartner: partnerFee,
    shippingFeeCustomer: effectiveFeeCustomer,
    isCod,
    codAmount: isCod ? codAmount : 0,
    note: note.trim() || undefined,
    serviceType: SERVICE_TYPE_DEFAULT,
    cukcukStatus: 'cho_gui_doi_tac',
    geStatus: undefined,
    scheduledTime: '—',
    createdAt: 'vừa xong',
  });

  const doSave = (addMore: boolean) => {
    if (!isSupportedProvince(addr.province)) {
      setProvinceAlert(true);
      return;
    }
    // Mặc định luôn là đơn thu hộ (COD) — kiểm tra ngưỡng 2 triệu
    if (isCod && codAmount > MAX_COD) {
      setCodAlert(true);
      return;
    }
    // Demo: 15% khả năng không kết nối được đối tác khi lưu
    if (!connection.isConnected) {
      setConnFailAlert(true);
      return;
    }
    onSaved(buildOrder(), addMore);
  };

  return (
    <Modal
      open
      onClose={onClose}
      width={620}
      title={
        <span className="flex items-center gap-2">
          Thông tin giao hàng
          <GrabExpressChip />
        </span>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="secondary" onClick={() => doSave(true)}>
            Cất & Thêm
          </Button>
          <Button variant="grab" onClick={() => doSave(false)} className="min-w-[120px]">
            Cất
          </Button>
        </>
      }
    >
      {/* Đối tác giao hàng */}
      <div className="mb-4 rounded-xl border border-grab/30 bg-grab-light/40 p-3">
        <div className="mb-1 text-[12px] font-medium text-text-secondary">Đối tác giao hàng</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-grab text-white">
              <Bike size={17} />
            </span>
            <span className="text-[14px] font-bold text-text-primary">Grab Express</span>
          </div>
          <span className="text-[12px] text-text-secondary">
            Loại dịch vụ: <b className="text-text-primary">{SERVICE_TYPE_DEFAULT}</b>
            <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-text-hint">Không sửa</span>
          </span>
        </div>
      </div>

      {/* Người nhận */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Khách nhận hàng" required>
          <select
            value={customer.id}
            onChange={(e) => pickCustomer(CUSTOMERS.find((c) => c.id === e.target.value)!)}
            className={inputCls()}
          >
            {CUSTOMERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.phone}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Số điện thoại người nhận" required>
          <input value={customer.phone} readOnly className={inputCls() + ' bg-gray-50'} />
        </Field>
      </div>

      <div className="mt-4">
        <Field
          label="Địa chỉ nhận hàng"
          required
          hint={
            customer.hasDeliveredBefore
              ? 'Đã hiển thị địa chỉ mặc định. Sửa địa chỉ sẽ được lưu thành địa chỉ mới khi Đồng ý.'
              : 'Lần đầu giao cho khách này — địa chỉ sẽ tự lưu & đặt làm mặc định khi Đồng ý.'
          }
        >
          <input
            value={addr.freetext}
            onChange={(e) => setAddr((a) => ({...a, freetext: e.target.value}))}
            className={inputCls()}
            placeholder="Số nhà, tên đường"
          />
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <select value={addr.province} onChange={(e) => changeProvince(e.target.value)} className={inputCls()}>
          <option value="">Tỉnh/TP</option>
          {ALL_PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          value={addr.district}
          onChange={(e) => setAddr((a) => ({...a, district: e.target.value}))}
          className={inputCls()}
          placeholder="Quận/Huyện"
        />
        <input
          value={addr.ward}
          onChange={(e) => setAddr((a) => ({...a, ward: e.target.value}))}
          className={inputCls()}
          placeholder="Phường/Xã"
        />
      </div>

      {/* Phí GH */}
      <div className="mt-4 rounded-xl border border-border-neutral-light">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-text-primary">
            Phí GH trả đối tác
            <InfoTip text={MSG.feeHint} />
          </span>
          {addressComplete ? (
            <span className="text-[14px] font-bold text-text-primary">{formatCurrency(partnerFee)}</span>
          ) : (
            <span className="text-[12px] italic text-text-hint">Điền đủ Tỉnh/TP · Quận/Huyện · Phường/Xã để hiện phí</span>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border-neutral-light px-4 py-3">
          <span className="text-[13px] font-medium text-text-primary">Phí GH thu khách</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={effectiveFeeCustomer}
              onChange={(e) => setFeeCustomer(Number(e.target.value))}
              disabled={!addressComplete}
              className="h-9 w-32 rounded-lg border border-border-neutral px-3 text-right text-[14px] font-bold text-text-primary outline-none focus:border-brand disabled:bg-gray-50"
            />
            <span className="text-[13px] text-text-hint">đ</span>
          </div>
        </div>
      </div>

      {/* Thu hộ COD */}
      <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-border-neutral-light px-4 py-3">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={isCod} onChange={(e) => setIsCod(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" />
          <span className="text-[13px] font-medium text-text-primary">Thu tiền hộ (COD)</span>
          <span className="text-[11px] text-text-hint">Mặc định bật · COD = Còn phải thu</span>
        </div>
        <span className="text-[14px] font-black text-text-primary">
          {isCod ? formatCurrency(codAmount) : formatCurrency(0)}
        </span>
      </label>

      {/* Ghi chú */}
      <div className="mt-4">
        <Field label="Ghi chú giao hàng">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 255))}
            rows={2}
            className="w-full resize-none rounded-lg border border-border-neutral px-3 py-2 text-[13px] outline-none focus:border-brand"
            placeholder="Không bắt buộc — tối đa 255 ký tự"
          />
        </Field>
        <div className="mt-1 text-right text-[11px] text-text-hint">{note.length}/255</div>
      </div>

      {/* Tổng kết */}
      <div className="mt-4 space-y-1.5 rounded-xl bg-gray-50 p-4 text-[13px]">
        <Row label="Tiền hàng" value={formatCurrency(subtotal)} />
        <Row label="Phí GH thu khách" value={formatCurrency(effectiveFeeCustomer)} />
        <div className="mt-1 flex items-center justify-between border-t border-border-neutral-light pt-2">
          <span className="font-semibold text-text-primary">Còn phải thu</span>
          <span className="text-[16px] font-black text-brand">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Cảnh báo Tỉnh/TP */}
      <AlertPopup
        open={provinceAlert}
        title="Khu vực chưa được hỗ trợ"
        message={MSG.provinceUnsupportedPickOther}
        primaryText="Chọn đối tác GH khác"
        onPrimary={() => {
          setProvinceAlert(false);
          pushToast('info', 'Chuyển sang Nhà hàng tự giao', 'Hình thức giao đổi sang Nhà hàng tự giao và cho phép chỉnh sửa.');
          onClose();
        }}
        onClose={() => setProvinceAlert(false)}
      />

      {/* Cảnh báo COD > 2 triệu */}
      <AlertPopup
        open={codAlert}
        title="Vượt hạn mức thu hộ"
        message={MSG.codOverLimit}
        primaryText="Chọn đối tác GH khác"
        onPrimary={() => {
          setCodAlert(false);
          pushToast('info', 'Chuyển sang Nhà hàng tự giao', 'Cho phép chỉnh sửa thông tin giao hàng.');
          onClose();
        }}
        onClose={() => setCodAlert(false)}
      />

      {/* Không kết nối được đối tác */}
      <AlertPopup
        open={connFailAlert}
        title="Không kết nối được đối tác"
        message={MSG.connectFailed}
        primaryText="Chọn đối tác GH khác"
        onPrimary={() => {
          setConnFailAlert(false);
          pushToast('info', 'Chuyển sang Nhà hàng tự giao');
          onClose();
        }}
        onClose={() => setConnFailAlert(false)}
      />
    </Modal>
  );
};

const Row: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div className="flex items-center justify-between">
    <span className="text-text-secondary">{label}</span>
    <span className="font-medium text-text-primary">{value}</span>
  </div>
);

// ---------------------------------------------------------------------------
// Hóa đơn giao hàng (tính tiền) — nút Gửi đơn hàng hoặc Giao hàng
// ---------------------------------------------------------------------------
const InvoiceDeliveryScreen: React.FC<{
  order: DeliveryOrder;
  connection: ConnectionState;
  onClose: () => void;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
  onSend: (id: string) => void;
  onDeliver: (id: string) => void;
}> = ({order, connection, onClose, pushToast, onSend, onDeliver}) => {
  const isSend = order.cukcukStatus === 'cho_gui_doi_tac';
  const [connFail, setConnFail] = useState(false);
  const total = order.subtotal + order.shippingFeeCustomer;

  const handlePrimary = () => {
    if (isSend) {
      // kiểm tra kết nối với GE
      if (!connection.isConnected) {
        setConnFail(true);
        return;
      }
      onSend(order.id);
    } else {
      onDeliver(order.id);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      width={560}
      title={
        <span className="flex items-center gap-2">
          {isSend ? 'Gửi đơn hàng' : 'Hóa đơn giao hàng'} · {order.orderNo}
          <GrabExpressChip />
        </span>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button
            variant="grab"
            icon={isSend ? <Send size={16} /> : <Truck size={16} />}
            onClick={handlePrimary}
            className="min-w-[150px]"
          >
            {isSend ? 'Gửi đơn hàng' : 'Giao hàng'}
          </Button>
        </>
      }
    >
      {/* Thông tin gửi sang GE */}
      <div className="mb-4 rounded-xl border border-border-neutral-light">
        <div className="border-b border-border-neutral-light px-4 py-2.5 text-[12px] font-semibold text-text-secondary">
          Thông tin đơn gửi sang Grab Express
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 p-4 text-[13px]">
          <Info2 label="Loại dịch vụ" value={order.serviceType} />
          <Info2 label="Địa chỉ lấy hàng" value={`${connection.info.address}, ${connection.info.province}`} />
          <Info2 label="Người gửi" value="Nguyễn Thu Hằng (thu ngân)" />
          <Info2 label="SĐT gửi" value={connection.info.phone} />
          <Info2 label="Người nhận" value={`${order.customerName} · ${order.customerPhone}`} />
          <Info2
            label="Địa chỉ giao"
            value={`${order.address.freetext}, ${order.address.ward}, ${order.address.district}, ${order.address.province}`}
          />
          {connection.requireVatInvoice && (
            <Info2 label="Email xuất HĐ" value={connection.vatEmail || '—'} />
          )}
          <Info2 label="Thu hộ (COD)" value={order.isCod ? formatCurrency(order.codAmount) : 'Không'} />
        </div>
      </div>

      {/* Món */}
      <div className="mb-3 space-y-1.5">
        {order.items.map((it) => (
          <div key={it.id} className="flex items-center justify-between text-[13px]">
            <span className="text-text-primary">
              {it.qty} × {it.name}
            </span>
            <span className="font-medium text-text-primary">{formatCurrency(it.qty * it.price)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 rounded-xl bg-gray-50 p-4 text-[13px]">
        <Row label="Tiền hàng" value={formatCurrency(order.subtotal)} />
        <Row label="Phí GH thu khách" value={formatCurrency(order.shippingFeeCustomer)} />
        <Row label="Phí GH trả đối tác" value={formatCurrency(order.shippingFeePartner)} />
        <div className="mt-1 flex items-center justify-between border-t border-border-neutral-light pt-2">
          <span className="font-semibold text-text-primary">Tổng tiền</span>
          <span className="text-[16px] font-black text-brand">{formatCurrency(total)}</span>
        </div>
      </div>

      <AlertPopup
        open={connFail}
        title="Không kết nối được đối tác"
        message={MSG.connectFailed}
        primaryText="Chọn đối tác GH khác"
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

const Info2: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div className="min-w-0">
    <div className="text-[11px] text-text-hint">{label}</div>
    <div className="truncate font-medium text-text-primary" title={value}>
      {value}
    </div>
  </div>
);
