import React, {useMemo, useState} from 'react';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Bike,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  Download,
  FileDown,
  FileText,
  FileUp,
  FileX,
  Grid3x3,
  HelpCircle,
  LayoutDashboard,
  LayoutGrid,
  Link2Off,
  Megaphone,
  MessageSquare,
  MoreVertical,
  Package,
  Percent,
  PiggyBank,
  Search,
  Settings,
  Settings2,
  ShoppingCart,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
  XCircle,
} from 'lucide-react';
import type {ConnectionState, DeliveryOrder, ToastKind} from '../types';
import {
  ALL_PROVINCES,
  GE_TERMINAL,
  MSG,
  VAT_FORM_URL,
  WARDS,
  districtsOf,
  isEmail,
} from '../constants';
import {RESTAURANT_DEFAULT} from '../data';
import {APPLICATIONS_DATA, SIDEBAR_ITEMS, type WebApp} from '../webData';
import {Button, ConfirmDialog, GrabExpressLogo, inputCls} from '../components/ui';

interface Props {
  connection: ConnectionState;
  setConnection: React.Dispatch<React.SetStateAction<ConnectionState>>;
  orders: DeliveryOrder[];
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
}

const SIDEBAR_ICONS: Record<string, React.ComponentType<{size?: number}>> = {
  LayoutDashboard, BarChart3, FileDown, FileUp, ShoppingCart, Package, Wallet,
  CreditCard, PiggyBank, Percent, UtensilsCrossed, Grid3x3, TrendingUp, FileX,
  FileText, LayoutGrid,
};

const MISA_LOGO =
  'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=2e0e75f9-784b-48d9-b545-ce17762135dc.png&isTemp=true&tenantCode=misa';
const AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120';

// Logo ứng dụng có fallback gradient + chữ nếu URL lỗi
const AppLogo: React.FC<{app: WebApp}> = ({app}) => {
  const [err, setErr] = useState(false);
  const radius = app.round ? 'rounded-full' : 'rounded-2xl';
  if (app.isGrabExpress) return <GrabExpressLogo size={56} />;
  if (err || !app.imageUrl)
    return (
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center bg-gradient-to-br ${app.tint ?? 'from-slate-400 to-slate-600'} text-[15px] font-black text-white ${radius}`}
      >
        {app.short ?? '?'}
      </div>
    );
  return (
    <img
      src={app.imageUrl}
      alt={app.title}
      onError={() => setErr(true)}
      referrerPolicy="no-referrer"
      className={`h-14 w-14 shrink-0 object-cover ${radius}`}
    />
  );
};

export const WebConnectSurface: React.FC<Props> = ({
  connection,
  setConnection,
  orders,
  pushToast,
}) => {
  const [openGe, setOpenGe] = useState(false);
  const [restaurant, setRestaurant] = useState(RESTAURANT_DEFAULT.name);
  const [restOpen, setRestOpen] = useState(false);

  return (
    <div className="flex h-full flex-col bg-[#F0F2F4]">
      {/* ===== Header xanh MISA CukCuk ===== */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#2563EB]/40 bg-[#1E62EC] px-3 text-white">
        <div className="flex items-center gap-3">
          <button className="rounded p-1 hover:bg-[#2563EB]" title="Dịch vụ MISA">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <circle cx="5" cy="5" r="2" /><circle cx="12" cy="5" r="2" /><circle cx="19" cy="5" r="2" />
              <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
              <circle cx="5" cy="19" r="2" /><circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
            </svg>
          </button>
          <div className="flex items-center gap-1.5">
            <img src={MISA_LOGO} alt="MISA CukCuk" className="h-6 w-auto object-contain" referrerPolicy="no-referrer"
              onError={(e) => ((e.currentTarget.style.display = 'none'))} />
            <span className="text-base font-extrabold tracking-tight">MISA CukCuk</span>
          </div>
          <div className="relative ml-4">
            <button
              onClick={() => setRestOpen(!restOpen)}
              className="flex h-8 items-center gap-1.5 rounded-md border border-[#1E62EC] bg-[#2563EB] pl-3 pr-2 text-xs font-semibold hover:bg-[#1D4ED8]"
            >
              <span className="max-w-[170px] truncate">{restaurant}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>
            {restOpen && (
              <div className="animate-fade-in absolute left-0 top-10 z-50 w-56 rounded-lg border border-gray-100 bg-white py-1 text-text-primary shadow-lg">
                {[RESTAURANT_DEFAULT.name, 'Chi nhánh Cầu Giấy', 'Chi nhánh Hoàn Kiếm'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRestaurant(r);
                      setRestOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 ${
                      restaurant === r ? 'bg-[#F0F6FE] font-bold text-[#2563EB]' : ''
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-8 items-center gap-1 rounded px-2.5 text-xs font-medium hover:bg-[#2563EB]">
            <span>Tiếng Việt</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>
          <button className="relative flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#2563EB]" title="Tải ứng dụng">
            <Download className="h-[18px] w-[18px]" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#1E62EC] bg-red-500 text-[9px] font-bold">1</span>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#2563EB]" title="Thông báo"><Bell className="h-[18px] w-[18px]" /></button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#2563EB]" title="Trợ giúp"><HelpCircle className="h-[18px] w-[18px]" /></button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#2563EB]" title="Thiết lập"><Settings className="h-[18px] w-[18px]" /></button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#2563EB]"><MoreVertical className="h-[18px] w-[18px]" /></button>
          <button className="ml-1 h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow">
            <img src={AVATAR} alt="User" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </button>
        </div>
      </header>

      {/* ===== Sidebar + Content ===== */}
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[220px] shrink-0 flex-col justify-between overflow-y-auto border-r border-[#E9EAEB] bg-white lg:flex">
          <div className="space-y-0.5 py-2">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = SIDEBAR_ICONS[item.icon] ?? LayoutGrid;
              const active = item.id === 'ung-dung';
              return (
                <button
                  key={item.id}
                  className={`flex h-9 w-full items-center px-3 text-left text-xs transition-all ${
                    active
                      ? 'border-l-4 border-[#2563EB] bg-[#F0F6FE] font-semibold text-[#2563EB]'
                      : 'font-medium text-[#101828] hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <span className={`mr-2.5 ${active ? 'text-[#2563EB]' : 'text-[#717680]'}`}>
                    <Icon size={16} />
                  </span>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.arrow && <ChevronDown className="h-3 w-3 text-[#717680] opacity-60" />}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end border-t border-[#E9EAEB] bg-white p-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D5D7DA] text-[#717680] hover:border-[#2563EB] hover:bg-[#F0F6FE] hover:text-[#2563EB]">
              <ArrowLeft size={16} />
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1 overflow-y-auto">
          {!openGe ? (
            <ApplicationsList
              connection={connection}
              onOpenGe={() => setOpenGe(true)}
              pushToast={pushToast}
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
    </div>
  );
};

// ---------------------------------------------------------------------------
// Ứng dụng — lưới card logo thật + "Chi tiết"
// ---------------------------------------------------------------------------
const ApplicationsList: React.FC<{
  connection: ConnectionState;
  onOpenGe: () => void;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
}> = ({connection, onOpenGe, pushToast}) => {
  const [q, setQ] = useState('');
  const apps = APPLICATIONS_DATA.filter((a) => a.title.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="flex h-full flex-col">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-[#E9EAEB] bg-white px-6 py-4">
        <h2 className="text-xl font-semibold text-[#101828]">Ứng dụng</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm ứng dụng..."
              className="h-8 w-52 rounded-lg border border-[#D5D7DA] pl-8 pr-3 text-[13px] outline-none placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
          <button
            onClick={() => pushToast('info', 'Gửi phản hồi', 'Cảm ơn bạn đã đóng góp ý kiến cho MISA CukCuk.')}
            className="flex h-8 min-w-[84px] items-center justify-center gap-1.5 rounded-lg border border-[#D5D7DA] bg-white px-3 text-[13px] font-medium text-[#101828] hover:bg-[#F0F6FE] hover:text-[#2563EB]"
          >
            <MessageSquare className="h-4 w-4 text-[#717680]" /> Phản hồi
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-6 lg:grid-cols-2">
        {apps.map((app) => {
          const connected = app.isGrabExpress ? connection.isConnected : app.isConnected;
          return (
            <div
              key={app.id}
              onClick={() => (app.isGrabExpress ? onOpenGe() : pushToast('info', app.title, 'Ứng dụng minh hoạ trong prototype.'))}
              className="group flex cursor-pointer gap-4 rounded-xl border-2 border-white bg-white/80 p-5 shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] transition-all hover:scale-[1.01] hover:border-[#2563EB]/40"
            >
              <AppLogo app={app} />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <h3 className="truncate text-base font-semibold text-[#101828] group-hover:text-[#2563EB]">{app.title}</h3>
                      {app.isNew && (
                        <span className="inline-flex shrink-0 items-center rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          New
                        </span>
                      )}
                    </div>
                    {connected && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Đã kết nối
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#717680]">{app.description}</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      app.isGrabExpress ? onOpenGe() : pushToast('info', app.title, 'Ứng dụng minh hoạ trong prototype.');
                    }}
                    className="text-[13px] font-semibold text-[#2563EB] transition-all hover:text-[#1D4ED8] hover:underline"
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {apps.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
            <Search className="mb-2 h-12 w-12 text-gray-300" />
            <p className="text-[13px]">Không tìm thấy ứng dụng nào phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Màn Kết nối / Thông tin kết nối Grab Express
// ---------------------------------------------------------------------------
type Errors = Partial<Record<'phone' | 'province' | 'district' | 'ward' | 'address' | 'vatEmail', string>>;

// Hàng nhập liệu ngang: nhãn bên trái + ô nhập bên phải (theo layout UI cũ)
const LABEL_W = 'w-[132px]';
const FormRow: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({label, required, error, children}) => (
  <div className="flex items-start gap-4">
    <label className={`${LABEL_W} shrink-0 pt-2.5 text-[13px] text-text-primary`}>
      {label}
      {required && <span className="text-danger"> *</span>}
    </label>
    <div className="min-w-0 flex-1">
      {children}
      {error && (
        <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-danger">
          <XCircle size={13} /> {error}
        </div>
      )}
    </div>
  </div>
);

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
  const [confirmUnlink, setConfirmUnlink] = useState(false);

  const editing = !connection.isConnected;

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({...f, [k]: v}));
    setErrors((e) => ({...e, [k]: undefined}));
  };

  // Đổi Tỉnh/TP thì reset Quận/Huyện & Phường/Xã cho khớp danh sách mới
  const onProvince = (v: string) => {
    setForm((f) => ({...f, province: v, district: '', ward: ''}));
    setErrors((e) => ({...e, province: undefined, district: undefined, ward: undefined}));
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
    // BR-006 — KHÔNG hard-code danh sách tỉnh/TP. Vùng phục vụ được validate động
    // qua Quote API lúc tạo đơn giao hàng (Grab báo giá được = phục vụ được).
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

  const hasInProgress = useMemo(
    () => orders.some((o) => o.trackingNo && o.geStatus && !GE_TERMINAL.includes(o.geStatus)),
    [orders],
  );

  const confirmUnlinkNow = () => {
    setConfirmUnlink(false);
    setConnection((c) => ({...c, isConnected: false}));
    pushToast('info', 'Đã hủy kết nối Grab Express', 'Nhà hàng quay về trạng thái chưa kết nối.');
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Thanh trên: Quay lại (trái) + Phản hồi (phải) — theo UI cũ */}
      <div className="flex items-center justify-between px-6 pt-5">
        <button
          onClick={onBack}
          className="inline-flex h-9 items-center gap-1 rounded-md bg-brand pl-2.5 pr-3.5 text-[13px] font-semibold text-white hover:bg-brand-hover"
        >
          <ChevronLeft size={16} /> Quay lại
        </button>
        <button
          onClick={() => pushToast('info', 'Gửi phản hồi', 'Cảm ơn bạn đã đóng góp ý kiến cho MISA CukCuk.')}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border-neutral bg-white px-3 text-[13px] font-medium text-text-secondary hover:bg-gray-50 hover:text-brand"
        >
          <Megaphone size={15} /> Phản hồi
        </button>
      </div>

      {/* Nội dung: form bên trái + minh hoạ bên phải */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[1200px] gap-8 px-6 py-8 md:px-10">
          {/* CỘT TRÁI — Form */}
          <div className="w-full max-w-[600px] shrink-0">
            <div className="mb-2 flex items-center gap-2.5">
              <h1 className="text-[26px] font-bold leading-tight text-text-primary">Kết nối Grab Express</h1>
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
            <p className="max-w-[520px] text-[13.5px] leading-relaxed text-text-secondary">
              Hỗ trợ kết nối đối tác giao hàng Grab Express, giúp giảm thiểu thao tác thủ công và quản
              lý bằng tay khi giao hàng cho khách hàng.
            </p>
            <p className="mt-5 text-[13.5px] font-medium text-text-primary">
              Vui lòng điền đầy đủ thông tin của gian hàng để kết nối.
            </p>

            <div className="mt-5 max-w-[560px] space-y-3.5">
              <FormRow label="Số điện thoại" required error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className={inputCls(!!errors.phone)}
                  placeholder="Số điện thoại gian hàng"
                />
              </FormRow>

              <FormRow label="Tỉnh/Thành phố" required error={errors.province}>
                <select
                  value={form.province}
                  onChange={(e) => onProvince(e.target.value)}
                  className={inputCls(!!errors.province)}
                >
                  <option value="">-- Chọn Tỉnh/TP --</option>
                  {ALL_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </FormRow>

              <FormRow label="Quận/Huyện" required error={errors.district}>
                <select
                  value={form.district}
                  onChange={(e) => set('district', e.target.value)}
                  className={inputCls(!!errors.district)}
                >
                  <option value="">-- Chọn Quận/Huyện --</option>
                  {districtsOf(form.province).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </FormRow>

              <FormRow label="Phường/Xã" required error={errors.ward}>
                <select
                  value={form.ward}
                  onChange={(e) => set('ward', e.target.value)}
                  className={inputCls(!!errors.ward)}
                >
                  <option value="">-- Chọn Phường/Xã --</option>
                  {WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </FormRow>

              <FormRow label="Địa chỉ" required error={errors.address}>
                <input
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  className={inputCls(!!errors.address)}
                  placeholder="Số nhà, tên đường"
                />
              </FormRow>

              {/* Checkbox VAT — thẳng cột với ô nhập */}
              <div className="flex gap-4 pt-1">
                <div className={`${LABEL_W} shrink-0`} />
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={requireVat}
                    onChange={(e) => {
                      setRequireVat(e.target.checked);
                      if (!e.target.checked) setErrors((er) => ({...er, vatEmail: undefined}));
                    }}
                    className="h-4 w-4 accent-[var(--color-brand)]"
                  />
                  <span className="text-[13px] font-medium text-text-primary">
                    Yêu cầu xuất hóa đơn phí vận chuyển (VAT)
                  </span>
                </label>
              </div>

              {requireVat && (
                <div className="animate-slide-up space-y-2">
                  <FormRow label="Email xuất hóa đơn" required error={errors.vatEmail}>
                    <input
                      value={vatEmail}
                      onChange={(e) => {
                        setVatEmail(e.target.value);
                        setErrors((er) => ({...er, vatEmail: undefined}));
                      }}
                      className={inputCls(!!errors.vatEmail)}
                      placeholder="vd: ketoan@nhahang.com"
                    />
                  </FormRow>
                  <div className="flex gap-4">
                    <div className={`${LABEL_W} shrink-0`} />
                    <a
                      href={VAT_FORM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[13px] font-medium text-brand hover:underline"
                    >
                      Đăng ký xuất hóa đơn tài chính (VAT) cho dịch vụ giao hàng - GrabExpress
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Nút hành động — thẳng cột với ô nhập */}
            <div className="mt-8 flex gap-3 pl-[148px]">
              {!connection.isConnected ? (
                <Button variant="primary" onClick={handleConnect} className="min-w-[150px]">
                  Kết nối
                </Button>
              ) : (
                <>
                  <Button variant="danger" icon={<Link2Off size={16} />} onClick={() => setConfirmUnlink(true)} className="min-w-[140px]">
                    Hủy kết nối
                  </Button>
                  <Button variant="primary" icon={<Settings2 size={16} />} onClick={handleUpdate} className="min-w-[140px]">
                    Cập nhật
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* CỘT PHẢI — Minh hoạ giao hàng Grab */}
          <div className="hidden flex-1 items-start justify-center pt-4 xl:flex">
            <GrabDeliveryScene />
          </div>
        </div>
      </div>

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

// ---------------------------------------------------------------------------
// Minh hoạ giao hàng Grab (SVG nội tuyến, xanh Grab) — thay ảnh minh hoạ UI cũ
// ---------------------------------------------------------------------------
const GrabDeliveryScene: React.FC = () => (
  <svg viewBox="0 0 560 440" className="h-auto w-full max-w-[560px]" role="img" aria-label="Minh hoạ giao hàng Grab Express">
    {/* Nền bo tròn xanh nhạt */}
    <ellipse cx="300" cy="250" rx="270" ry="180" fill="#EAF9F0" />
    <circle cx="470" cy="90" r="46" fill="#D6F2E1" />
    <circle cx="90" cy="120" r="26" fill="#D6F2E1" />

    {/* Thành phố (skyline) */}
    <g>
      <rect x="150" y="120" width="60" height="180" rx="6" fill="#B7E4C7" />
      <rect x="215" y="80" width="70" height="220" rx="6" fill="#95D5B2" />
      <rect x="290" y="140" width="52" height="160" rx="6" fill="#74C69D" />
      <rect x="348" y="100" width="66" height="200" rx="6" fill="#B7E4C7" />
      <rect x="420" y="160" width="46" height="140" rx="6" fill="#95D5B2" />
      {/* cửa sổ */}
      <g fill="#EAF9F0">
        <rect x="162" y="140" width="12" height="12" rx="2" /><rect x="186" y="140" width="12" height="12" rx="2" />
        <rect x="162" y="166" width="12" height="12" rx="2" /><rect x="186" y="166" width="12" height="12" rx="2" />
        <rect x="162" y="192" width="12" height="12" rx="2" /><rect x="186" y="192" width="12" height="12" rx="2" />
        <rect x="230" y="102" width="14" height="14" rx="2" /><rect x="256" y="102" width="14" height="14" rx="2" />
        <rect x="230" y="132" width="14" height="14" rx="2" /><rect x="256" y="132" width="14" height="14" rx="2" />
        <rect x="230" y="162" width="14" height="14" rx="2" /><rect x="256" y="162" width="14" height="14" rx="2" />
        <rect x="364" y="122" width="12" height="12" rx="2" /><rect x="388" y="122" width="12" height="12" rx="2" />
        <rect x="364" y="148" width="12" height="12" rx="2" /><rect x="388" y="148" width="12" height="12" rx="2" />
      </g>
    </g>

    {/* Mặt đường */}
    <rect x="70" y="300" width="420" height="10" rx="5" fill="#95D5B2" />

    {/* Tài xế Grab trên xe máy */}
    <g transform="translate(196 196)">
      {/* thùng hàng phía sau */}
      <rect x="-2" y="44" width="46" height="44" rx="6" fill="#00B14F" />
      <rect x="6" y="52" width="30" height="16" rx="3" fill="#EAF9F0" />
      <text x="21" y="65" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="800" fill="#00B14F">Grab</text>

      {/* thân xe */}
      <path d="M52 96 q28 -14 66 -2 l10 14 h-86 z" fill="#0E9F6E" />
      <rect x="120" y="70" width="10" height="34" rx="4" fill="#0E9F6E" />
      <rect x="120" y="66" width="26" height="8" rx="4" fill="#0E9F6E" />

      {/* bánh xe */}
      <circle cx="58" cy="112" r="20" fill="#1F2937" /><circle cx="58" cy="112" r="8" fill="#D1FADF" />
      <circle cx="150" cy="112" r="20" fill="#1F2937" /><circle cx="150" cy="112" r="8" fill="#D1FADF" />

      {/* tài xế */}
      <path d="M78 96 q-6 -30 14 -44 l14 8 q-14 12 -8 36 z" fill="#00B14F" />
      <circle cx="104" cy="40" r="15" fill="#2ECC71" />
      <path d="M89 40 a15 15 0 0 1 30 0 z" fill="#00B14F" />
      <rect x="92" y="40" width="24" height="6" rx="3" fill="#0E9F6E" />
      <circle cx="120" cy="72" r="6" fill="#00B14F" />
    </g>

    {/* Người nhận hàng đứng bên phải */}
    <g transform="translate(384 214)">
      <circle cx="0" cy="0" r="13" fill="#F0A868" />
      <path d="M-13 22 q13 -14 26 0 l4 62 h-34 z" fill="#F59E0B" />
      <rect x="-14" y="84" width="12" height="20" rx="4" fill="#334155" />
      <rect x="2" y="84" width="12" height="20" rx="4" fill="#334155" />
    </g>
  </svg>
);
