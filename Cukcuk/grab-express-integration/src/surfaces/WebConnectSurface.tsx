import React, {useMemo, useState} from 'react';
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  ExternalLink,
  LayoutGrid,
  Link2,
  Link2Off,
  Search,
  Settings2,
  ShoppingBag,
  Store,
} from 'lucide-react';
import type {ConnectionState, DeliveryOrder, ToastKind} from '../types';
import {
  ALL_PROVINCES,
  GE_TERMINAL,
  MSG,
  VAT_FORM_URL,
  isEmail,
  isSupportedProvince,
} from '../constants';
import {RESTAURANT_DEFAULT} from '../data';
import {
  AlertPopup,
  Button,
  ConfirmDialog,
  Field,
  GrabExpressChip,
  GrabExpressMark,
  InfoTip,
  inputCls,
} from '../components/ui';

interface Props {
  connection: ConnectionState;
  setConnection: React.Dispatch<React.SetStateAction<ConnectionState>>;
  orders: DeliveryOrder[];
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
}

const APP_CATALOG = [
  {id: 'ge', title: 'Grab Express', cat: 'Vận chuyển', isNew: true, kind: 'ge' as const,
    desc: 'Hỗ trợ kết nối đối tác giao hàng Grab Express, giúp giảm thiểu thao tác thủ công và quản lý bằng tay khi giao hàng cho khách hàng.'},
  {id: 'grabfood', title: 'Grab Food', cat: 'Vận chuyển', kind: 'grabfood' as const,
    desc: 'Kết nối ngay Grab Food trên CUKCUK để chủ động kiểm soát đơn hàng, giờ đóng/mở cửa nhà hàng của bạn.'},
  {id: 'ahamove', title: 'AhaMove', cat: 'Vận chuyển', kind: 'aha' as const,
    desc: 'Hỗ trợ kết nối đối tác giao hàng AhaMove, giúp giảm thiểu thao tác thủ công khi giao hàng cho khách hàng.'},
  {id: 'shopeefood', title: 'ShopeeFood', cat: 'Vận chuyển', kind: 'shopee' as const,
    desc: 'Kết nối ShopeeFood trên CUKCUK để đồng bộ đơn hàng, trạng thái hoạt động và thông tin gian hàng.'},
];

const SIDEBAR = [
  'Bàn làm việc', 'Báo cáo', 'Hóa đơn bán hàng', 'Kho', 'Thực đơn',
  'Khuyến mại', 'Thiết lập hệ thống', 'Ứng dụng',
];

function AppIcon({kind}: {kind: string}) {
  if (kind === 'ge')
    return <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-grab text-white"><Bike size={22} /></div>;
  if (kind === 'grabfood')
    return <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-grab text-white"><ShoppingBag size={22} /></div>;
  if (kind === 'aha')
    return <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white"><Bike size={22} /></div>;
  return <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white"><Store size={22} /></div>;
}

export const WebConnectSurface: React.FC<Props> = ({
  connection,
  setConnection,
  orders,
  pushToast,
}) => {
  const [openGe, setOpenGe] = useState(false);
  return (
    <div className="flex h-full">
      {/* Sidebar CukCuk web */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border-neutral-light bg-white lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border-neutral-light px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-[15px] font-black text-white">C</div>
          <span className="text-[15px] font-bold text-text-primary">CukCuk</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {SIDEBAR.map((s) => (
            <div
              key={s}
              className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] ${
                s === 'Ứng dụng'
                  ? 'bg-brand-light font-semibold text-brand'
                  : 'text-text-secondary hover:bg-gray-50'
              }`}
            >
              {s === 'Ứng dụng' ? <LayoutGrid size={16} /> : <span className="h-4 w-4 rounded bg-gray-200" />}
              {s}
            </div>
          ))}
        </nav>
        <div className="border-t border-border-neutral-light p-3 text-[12px] text-text-hint">
          {RESTAURANT_DEFAULT.name}
        </div>
      </aside>

      {/* Content */}
      <section className="min-w-0 flex-1 overflow-y-auto">
        {!openGe ? (
          <ApplicationsList
            connected={connection.isConnected}
            onOpenGe={() => setOpenGe(true)}
          />
        ) : (
          <GrabExpressConnect
            connection={connection}
            setConnection={setConnection}
            orders={orders}
            pushToast={pushToast}
            onBack={() => setOpenGe(false)}
          />
        )}
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Danh sách ứng dụng
// ---------------------------------------------------------------------------
const ApplicationsList: React.FC<{connected: boolean; onOpenGe: () => void}> = ({
  connected,
  onOpenGe,
}) => (
  <div className="mx-auto max-w-[980px] p-6">
    <div className="mb-1 flex items-center gap-2 text-[12px] text-text-hint">
      <span>Ứng dụng</span>
    </div>
    <h2 className="mb-1 text-text-primary">Ứng dụng</h2>
    <p className="mb-5 text-[13px] text-text-secondary">
      Kết nối CukCuk với các đối tác để mở rộng khả năng bán hàng và vận chuyển.
    </p>

    <div className="mb-4 flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-icon-neutral" />
        <input placeholder="Tìm kiếm ứng dụng" className={inputCls() + ' pl-9'} />
      </div>
      <div className="flex gap-1 rounded-lg bg-white p-1 text-[13px]">
        {['Tất cả', 'Vận chuyển', 'Hóa đơn & Kế toán'].map((c, i) => (
          <button
            key={c}
            className={`rounded-md px-3 py-1.5 font-medium ${
              i === 1 ? 'bg-brand-light text-brand' : 'text-text-secondary hover:bg-gray-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>

    <div className="mb-2 text-[13px] font-semibold text-text-secondary">Vận chuyển</div>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {APP_CATALOG.map((app) => {
        const isGe = app.kind === 'ge';
        return (
          <div
            key={app.id}
            className="group flex flex-col rounded-2xl border border-border-neutral-light bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start gap-3">
              <AppIcon kind={app.kind} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-text-primary">{app.title}</span>
                  {app.isNew && (
                    <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-danger">
                      MỚI
                    </span>
                  )}
                  {isGe && connected && (
                    <span className="inline-flex items-center gap-1 rounded bg-grab-light px-1.5 py-0.5 text-[10px] font-bold text-grab">
                      <CheckCircle2 size={11} /> Đã kết nối
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-text-hint">{app.cat}</div>
              </div>
            </div>
            <p className="mb-4 line-clamp-3 flex-1 text-[12.5px] leading-relaxed text-text-secondary">
              {app.desc}
            </p>
            <div className="flex justify-end">
              {isGe ? (
                <Button variant={connected ? 'secondary' : 'primary'} size="sm" onClick={onOpenGe}>
                  {connected ? 'Xem kết nối' : 'Kết nối'}
                </Button>
              ) : (
                <Button variant="secondary" size="sm" disabled>
                  Kết nối
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Màn hình Kết nối / Thông tin kết nối Grab Express
// ---------------------------------------------------------------------------
type Errors = Partial<Record<'phone' | 'province' | 'district' | 'ward' | 'address' | 'vatEmail', string>>;

const GrabExpressConnect: React.FC<{
  connection: ConnectionState;
  setConnection: React.Dispatch<React.SetStateAction<ConnectionState>>;
  orders: DeliveryOrder[];
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
  onBack: () => void;
}> = ({connection, setConnection, orders, pushToast, onBack}) => {
  const [form, setForm] = useState(connection.info);
  const [requireVat, setRequireVat] = useState(connection.requireVatInvoice);
  const [vatEmail, setVatEmail] = useState(connection.vatEmail);
  const [errors, setErrors] = useState<Errors>({});
  const [provinceAlert, setProvinceAlert] = useState(false);
  const [confirmUnlink, setConfirmUnlink] = useState(false);

  const editing = !connection.isConnected; // chưa kết nối => nhập; đã kết nối => hiển thị + Cập nhật

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({...f, [k]: v}));
    setErrors((e) => ({...e, [k]: undefined}));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    (['phone', 'province', 'district', 'ward', 'address'] as const).forEach((k) => {
      if (!form[k]?.trim()) e[k] = MSG.emptyField;
    });
    if (requireVat) {
      if (!vatEmail.trim()) e.vatEmail = MSG.emptyField;
      else if (!isEmail(vatEmail)) e.vatEmail = MSG.emailInvalid;
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return false;
    // Tỉnh/TP phải thuộc 5 tỉnh hỗ trợ
    if (!isSupportedProvince(form.province)) {
      setProvinceAlert(true);
      return false;
    }
    return true;
  };

  const handleConnect = () => {
    if (!validate()) return;
    setConnection({
      isConnected: true,
      info: form,
      requireVatInvoice: requireVat,
      vatEmail: requireVat ? vatEmail : '',
    });
    pushToast('success', 'Kết nối Grab Express thành công', 'Nhà hàng đã sẵn sàng gửi đơn qua Grab Express.');
  };

  const handleUpdate = () => {
    if (!validate()) return;
    setConnection((c) => ({
      ...c,
      info: form,
      requireVatInvoice: requireVat,
      vatEmail: requireVat ? vatEmail : '',
    }));
    pushToast('success', 'Cập nhật kết nối thành công');
  };

  // Hủy kết nối — kiểm tra trạng thái đơn của GE
  const hasInProgress = useMemo(
    () =>
      orders.some(
        (o) => o.trackingNo && o.geStatus && !GE_TERMINAL.includes(o.geStatus),
      ),
    [orders],
  );

  const confirmUnlinkNow = () => {
    setConfirmUnlink(false);
    setConnection((c) => ({...c, isConnected: false}));
    pushToast('info', 'Đã hủy kết nối Grab Express', 'Nhà hàng quay về trạng thái chưa kết nối.');
  };

  return (
    <div className="mx-auto max-w-[720px] p-6">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={15} /> Ứng dụng
      </button>

      <div className="overflow-hidden rounded-2xl border border-border-neutral-light bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-neutral-light bg-grab-light/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-grab text-white">
              <Bike size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-text-primary">Grab Express</span>
                {connection.isConnected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-grab-light px-2 py-0.5 text-[11px] font-bold text-grab">
                    <CheckCircle2 size={12} /> Đã kết nối
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                    Chưa kết nối
                  </span>
                )}
              </div>
              <div className="text-[12px] text-text-secondary">Đối tác giao hàng · Nhà hàng đơn & chi nhánh</div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="mb-4 rounded-lg bg-blue-50/60 px-3 py-2.5 text-[12.5px] leading-relaxed text-brand">
            Vui lòng điền đầy đủ thông tin gian hàng để kết nối. Thông tin được lấy sẵn từ{' '}
            <b>Thiết lập hệ thống › Thiết lập chung › Thông tin chung</b>, bạn có thể chỉnh sửa nếu cần.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Số điện thoại" required error={errors.phone} className="md:col-span-2">
              <input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                readOnly={!editing && connection.isConnected ? false : false}
                className={inputCls(!!errors.phone)}
                placeholder="Số điện thoại gian hàng"
              />
            </Field>

            <Field label="Tỉnh/Thành phố" required error={errors.province}>
              <select
                value={form.province}
                onChange={(e) => set('province', e.target.value)}
                className={inputCls(!!errors.province)}
              >
                <option value="">-- Chọn Tỉnh/TP --</option>
                {ALL_PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Quận/Huyện" required error={errors.district}>
              <input
                value={form.district}
                onChange={(e) => set('district', e.target.value)}
                className={inputCls(!!errors.district)}
                placeholder="Quận/Huyện"
              />
            </Field>
            <Field label="Phường/Xã" required error={errors.ward}>
              <input
                value={form.ward}
                onChange={(e) => set('ward', e.target.value)}
                className={inputCls(!!errors.ward)}
                placeholder="Phường/Xã"
              />
            </Field>
            <Field label="Địa chỉ" required error={errors.address}>
              <input
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                className={inputCls(!!errors.address)}
                placeholder="Số nhà, tên đường"
              />
            </Field>
          </div>

          {/* Checkbox VAT */}
          <div className="mt-5 rounded-xl border border-border-neutral-light p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={requireVat}
                onChange={(e) => {
                  setRequireVat(e.target.checked);
                  if (!e.target.checked) setErrors((er) => ({...er, vatEmail: undefined}));
                }}
                className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
              />
              <div>
                <div className="text-[13px] font-semibold text-text-primary">
                  Yêu cầu xuất hóa đơn Phí vận chuyển (VAT)
                </div>
                <div className="text-[12px] text-text-hint">Mặc định không tích chọn.</div>
              </div>
            </label>

            {requireVat && (
              <div className="animate-slide-up mt-4 space-y-3 pl-7">
                <Field label="Email phục vụ việc xuất hóa đơn" required error={errors.vatEmail}>
                  <input
                    value={vatEmail}
                    onChange={(e) => {
                      setVatEmail(e.target.value);
                      setErrors((er) => ({...er, vatEmail: undefined}));
                    }}
                    className={inputCls(!!errors.vatEmail)}
                    placeholder="vd: ketoan@nhahang.com"
                  />
                </Field>
                <a
                  href={VAT_FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline"
                >
                  <ExternalLink size={14} />
                  Đăng ký xuất hóa đơn tài chính (VAT) cho dịch vụ giao hàng - GrabExpress
                </a>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            {!connection.isConnected ? (
              <Button variant="grab" icon={<Link2 size={16} />} onClick={handleConnect} className="min-w-[140px]">
                Kết nối
              </Button>
            ) : (
              <>
                <Button
                  variant="danger"
                  icon={<Link2Off size={16} />}
                  onClick={() => setConfirmUnlink(true)}
                  className="min-w-[140px]"
                >
                  Hủy kết nối
                </Button>
                <Button variant="grab" icon={<Settings2 size={16} />} onClick={handleUpdate} className="min-w-[140px]">
                  Cập nhật
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cảnh báo Tỉnh/TP không hỗ trợ */}
      <AlertPopup
        open={provinceAlert}
        title="Khu vực chưa được hỗ trợ"
        message={MSG.provinceUnsupported}
        onClose={() => setProvinceAlert(false)}
      />

      {/* Confirm Hủy kết nối — nội dung theo trạng thái đơn GE */}
      <ConfirmDialog
        open={confirmUnlink}
        title="Hủy kết nối Grab Express"
        tone={hasInProgress ? 'danger' : 'warning'}
        message={hasInProgress ? MSG.unlinkInProgress : MSG.unlinkClean}
        onConfirm={confirmUnlinkNow}
        onCancel={() => setConfirmUnlink(false)}
      />
    </div>
  );
};
