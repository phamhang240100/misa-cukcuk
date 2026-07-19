import React, {useMemo, useState} from 'react';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Bike,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  FileUp,
  FileX,
  Grid3x3,
  HelpCircle,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  Link2Off,
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
import {APPLICATIONS_DATA, SIDEBAR_ITEMS, type WebApp} from '../webData';
import {AlertPopup, Button, ConfirmDialog, Field, GrabExpressLogo, inputCls} from '../components/ui';

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

  const editing = !connection.isConnected;

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
    <div className="mx-auto max-w-[720px] p-6">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={15} /> Ứng dụng
      </button>

      <div className="overflow-hidden rounded-2xl border border-border-neutral-light bg-white">
        <div className="flex items-center justify-between border-b border-border-neutral-light bg-grab-light/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <GrabExpressLogo size={44} withText={false} />
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
                className={inputCls(!!errors.phone)}
                placeholder="Số điện thoại gian hàng"
              />
            </Field>

            <Field label="Tỉnh/Thành phố" required error={errors.province}>
              <select value={form.province} onChange={(e) => set('province', e.target.value)} className={inputCls(!!errors.province)}>
                <option value="">-- Chọn Tỉnh/TP --</option>
                {ALL_PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Quận/Huyện" required error={errors.district}>
              <input value={form.district} onChange={(e) => set('district', e.target.value)} className={inputCls(!!errors.district)} placeholder="Quận/Huyện" />
            </Field>
            <Field label="Phường/Xã" required error={errors.ward}>
              <input value={form.ward} onChange={(e) => set('ward', e.target.value)} className={inputCls(!!errors.ward)} placeholder="Phường/Xã" />
            </Field>
            <Field label="Địa chỉ" required error={errors.address}>
              <input value={form.address} onChange={(e) => set('address', e.target.value)} className={inputCls(!!errors.address)} placeholder="Số nhà, tên đường" />
            </Field>
          </div>

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
                <div className="text-[13px] font-semibold text-text-primary">Yêu cầu xuất hóa đơn Phí vận chuyển (VAT)</div>
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
                <a href={VAT_FORM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline">
                  <ExternalLink size={14} />
                  Đăng ký xuất hóa đơn tài chính (VAT) cho dịch vụ giao hàng - GrabExpress
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {!connection.isConnected ? (
              <Button variant="grab" icon={<Link2 size={16} />} onClick={handleConnect} className="min-w-[140px]">
                Kết nối
              </Button>
            ) : (
              <>
                <Button variant="danger" icon={<Link2Off size={16} />} onClick={() => setConfirmUnlink(true)} className="min-w-[140px]">
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

      <AlertPopup
        open={provinceAlert}
        title="Khu vực chưa được hỗ trợ"
        message={MSG.provinceUnsupported}
        onClose={() => setProvinceAlert(false)}
      />

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
