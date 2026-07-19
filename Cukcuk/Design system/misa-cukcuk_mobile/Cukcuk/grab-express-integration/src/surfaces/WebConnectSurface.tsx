import React, {useMemo, useState} from 'react';
import {
  ArrowLeft,
  BarChart3,
  Bell,
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
  Globe,
  Sparkles,
  Menu,
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
import {APPLICATIONS_DATA, type WebApp} from '../webData';
import {AlertPopup, Button, ConfirmDialog, Field, GrabExpressLogo, inputCls} from '../components/ui';

interface Props {
  connection: ConnectionState;
  setConnection: React.Dispatch<React.SetStateAction<ConnectionState>>;
  orders: DeliveryOrder[];
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
}

const SIDEBAR_ICONS: Record<string, React.ComponentType<{size?: number}>> = {
  LayoutDashboard,
  BarChart3,
  FileDown,
  FileUp,
  ShoppingCart,
  Package,
  Wallet,
  CreditCard,
  PiggyBank,
  Percent,
  UtensilsCrossed,
  FileX,
  Grid3x3,
  Settings,
  LayoutGrid,
  Globe,
  Sparkles,
  HelpCircle,
};

const SIDEBAR_ITEMS_IMAGE1 = [
  { id: 'tong-quan', title: 'Tổng quan', icon: 'LayoutDashboard' },
  { id: 'bao-cao', title: 'Báo cáo', icon: 'BarChart3', arrow: true },
  { id: 'mua-hang', title: 'Mua hàng', icon: 'ShoppingCart' },
  { id: 'kho', title: 'Kho', icon: 'Package' },
  { id: 'quy-tien-mat', title: 'Quỹ tiền mặt', icon: 'Wallet' },
  { id: 'quy-tien-gui', title: 'Quỹ tiền gửi', icon: 'CreditCard' },
  { id: 'chi-phi', title: 'Chi phí', icon: 'PiggyBank' },
  { id: 'khuyen-mai', title: 'Khuyến mại', icon: 'Percent' },
  { id: 'thuc-don', title: 'Thực đơn', icon: 'UtensilsCrossed' },
  { id: 'huy-order', title: 'Hủy order', icon: 'FileX' },
  { id: 'danh-muc', title: 'Danh mục', icon: 'Grid3x3' },
  { id: 'thiet-lap-he-thong', title: 'Thiết lập hệ thống', icon: 'Settings' },
  { id: 'ung-dung', title: 'Ứng dụng', icon: 'LayoutGrid' },
  { id: 'ban-hang-online', title: 'Bán hàng Online', icon: 'Globe', isNew: true },
  { id: '5food', title: '5Food', icon: 'Sparkles' },
  { id: 'tro-giup', title: 'Trợ giúp', icon: 'HelpCircle', arrow: true },
  { id: 'thue-bao', title: 'Thuê bao', icon: 'CreditCard' },
];

const MISA_LOGO =
  'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=2e0e75f9-784b-48d9-b545-ce17762135dc.png&isTemp=true&tenantCode=misa';
const AVATAR = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120';

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
      {/* ===== Header xanh MISA CukCuk đúng chuẩn Ảnh 1 ===== */}
      <header className="flex h-12 shrink-0 items-center justify-between bg-[#0073C4] px-3 text-white shadow-md">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <button className="rounded p-1 hover:bg-[#005A9C] transition-colors" title="Danh mục chức năng">
            <Menu className="h-5 w-5 text-white" />
          </button>
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-wider font-sans select-none">MISA CUKCUK</span>
          </div>

          <div className="h-5 w-[1px] bg-white/20 mx-1"></div>

          {/* Restaurant Dropdown (Skybar) */}
          <div className="relative">
            <button
              onClick={() => setRestOpen(!restOpen)}
              className="flex h-8 items-center gap-2 rounded bg-[#005A9C] px-3 text-xs font-semibold hover:bg-[#004B82] transition-colors"
            >
              <span className="max-w-[170px] truncate">{restaurant}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>
            {restOpen && (
              <div className="animate-fade-in absolute left-0 top-10 z-50 w-56 rounded border border-gray-100 bg-white py-1 text-slate-900 shadow-lg">
                {[RESTAURANT_DEFAULT.name, 'Chi nhánh Cầu Giấy', 'Chi nhánh Hoàn Kiếm'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRestaurant(r);
                      setRestOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 ${
                      restaurant === r ? 'bg-blue-50 font-bold text-[#0073C4]' : ''
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Header Sections */}
        <div className="flex items-center gap-3">
          {/* R58.0 Badge */}
          <span className="hidden md:inline text-xs font-semibold opacity-90 tracking-wide bg-[#005A9C] px-2 py-0.5 rounded text-blue-100 font-mono">
            R58.0
          </span>

          {/* Language selection dropdown */}
          <button className="flex h-8 items-center gap-1 rounded bg-[#005A9C]/60 hover:bg-[#005A9C] px-2.5 text-xs font-medium transition-colors">
            <span>Tiếng Việt (Tiếng Việt)</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>

          {/* Alert button (bell with red 2 dot) */}
          <button className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#005A9C] transition-colors" title="Thông báo">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm border border-red-400">
              2
            </span>
          </button>

          {/* Telephone Headset Support Icon */}
          <button className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#005A9C] transition-colors" title="Hỗ trợ kỹ thuật">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
            <span className="absolute -top-1 -right-2 bg-red-500 text-[8px] text-white px-1 font-extrabold rounded-full scale-90 border border-red-400 animate-pulse uppercase tracking-wider">
              New
            </span>
          </button>

          {/* User profile section */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/20">
            <button className="h-8 w-8 overflow-hidden rounded-full border border-white/40 shadow-sm hover:border-white transition-all">
              <img src={AVATAR} alt="User" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </button>
            <span className="hidden lg:inline text-xs font-semibold select-none">Nguyễn Thị Dung</span>
            <ChevronDown className="h-3 w-3 opacity-60 hidden lg:inline" />
          </div>
        </div>
      </header>

      {/* ===== Sidebar + Content ===== */}
      <div className="flex min-h-0 flex-1">
        {/* Sidebar xanh đậm đúng Ảnh 1 */}
        <aside className="hidden w-[200px] shrink-0 flex-col justify-between overflow-y-auto bg-[#005A9C] py-2 lg:flex">
          <div className="space-y-[1px]">
            {SIDEBAR_ITEMS_IMAGE1.map((item) => {
              const Icon = SIDEBAR_ICONS[item.icon] ?? LayoutGrid;
              const active = item.id === 'ung-dung';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'ung-dung') {
                      setOpenGe(false);
                    } else {
                      pushToast('info', item.title, 'Tính năng demo trong prototype.');
                    }
                  }}
                  className={`flex h-9 w-full items-center px-3 text-left text-xs transition-all ${
                    active
                      ? 'bg-[#008CD6] font-bold text-white shadow-inner'
                      : 'font-medium text-blue-100 hover:bg-[#004C84]/60 hover:text-white'
                  }`}
                >
                  <span className={`mr-2.5 ${active ? 'text-white' : 'text-blue-200/90'}`}>
                    <Icon size={15} />
                  </span>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.isNew && (
                    <span className="mr-1 inline-block bg-red-500 text-[8px] text-white px-1.5 py-0.2 font-extrabold rounded-full uppercase tracking-wider">
                      New
                    </span>
                  )}
                  {item.arrow && <ChevronDown className="h-3 w-3 text-blue-200/60" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Pane */}
        <section className="min-w-0 flex-1 overflow-y-auto bg-white">
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
    <div className="flex h-full flex-col bg-[#F0F2F4]">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-[#E9EAEB] bg-white px-6 py-4">
        <h2 className="text-xl font-bold text-[#101828]">Ứng dụng</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm ứng dụng..."
              className="h-8 w-52 rounded-lg border border-[#D5D7DA] pl-8 pr-3 text-[13px] outline-none placeholder:text-gray-400 focus:border-[#0073C4] focus:ring-1 focus:ring-[#0073C4]"
            />
          </div>
          <button
            onClick={() => pushToast('info', 'Gửi phản hồi', 'Cảm ơn bạn đã đóng góp ý kiến cho MISA CukCuk.')}
            className="flex h-8 min-w-[84px] items-center justify-center gap-1.5 rounded-lg border border-[#D5D7DA] bg-white px-3 text-[13px] font-medium text-[#101828] hover:bg-[#F0F6FE] hover:text-[#0073C4] transition-colors cursor-pointer"
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
              className="group flex cursor-pointer gap-4 rounded-xl border-2 border-white bg-white p-5 shadow-[0_4px_16px_0_rgba(0,0,0,0.03)] transition-all hover:scale-[1.01] hover:border-[#0073C4]/40 hover:shadow-md"
            >
              <AppLogo app={app} />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <h3 className="truncate text-base font-bold text-[#101828] group-hover:text-[#0073C4]">{app.title}</h3>
                      {app.isNew && (
                        <span className="inline-flex shrink-0 items-center rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          New
                        </span>
                      )}
                    </div>
                    {connected && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
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
                    className="text-[13px] font-bold text-[#0073C4] transition-all hover:text-[#005a9c] hover:underline"
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
// Màn Kết nối / Thông tin kết nối Grab Express - VẼ LẠI GIỐNG 100% ẢNH 1
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
    <div className="flex h-full flex-col bg-white">
      {/* Top action row */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E9EAEB] px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-[#0073C4] transition-colors cursor-pointer"
          >
            Ứng dụng
          </button>
          <span className="text-slate-400 select-none">&gt;</span>
          <span className="text-[#0073C4] font-bold select-none">Grab Express</span>
        </div>
        <button
          onClick={() => pushToast('info', 'Gửi phản hồi', 'Cảm ơn bạn đã đóng góp ý kiến cho MISA CukCuk.')}
          className="flex h-8 items-center justify-center gap-1.5 rounded border border-[#D5D7DA] bg-white px-4 text-xs font-semibold text-[#101828] hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span className="text-[#0073C4] font-bold">📢</span> Phản hồi
        </button>
      </div>

      {/* Main split view */}
      <div className="flex-1 overflow-y-auto px-8 py-8 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Panel: The Connection Form */}
          <div className="lg:col-span-7 pr-4">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 select-none">Kết nối Grab Express</h1>
            <p className="text-[13px] leading-relaxed text-slate-500 mb-6">
              Hỗ trợ kết nối đối tác giao hàng Grab Express, giúp giảm thiểu thao tác thủ công và quản lý bằng tay khi giao hàng cho khách hàng.
            </p>

            <p className="text-[13px] font-semibold text-slate-800 mb-5">
              Vui lòng điền đầy đủ thông tin của gian hàng để kết nối.
            </p>

            {/* Horizontal Alignment Form (labels on left, inputs on right) */}
            <div className="space-y-4 max-w-xl">
              {/* Phone Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-28 text-slate-600 text-xs font-medium">Số điện thoại</label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className={`w-full h-9 border rounded px-3 text-xs outline-none focus:border-[#0073C4] ${errors.phone ? 'border-red-500' : 'border-[#D2D2D2]'}`}
                    placeholder="Số điện thoại gian hàng"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-0.5">{errors.phone}</p>}
                </div>
              </div>

              {/* Province Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-28 text-slate-600 text-xs font-medium">Tỉnh thành phố</label>
                <div className="flex-1 relative">
                  <select
                    value={form.province}
                    onChange={(e) => {
                      const val = e.target.value;
                      set('province', val);
                      if (val === 'TP. Hà Nội') {
                        setForm((f) => ({ ...f, province: val, district: 'Quận Bắc Từ Liêm', ward: 'Phường Xuân Tảo' }));
                      } else if (val === 'TP. Hồ Chí Minh') {
                        setForm((f) => ({ ...f, province: val, district: 'Quận 1', ward: 'Phường Bến Nghé' }));
                      }
                    }}
                    className={`w-full h-9 border rounded px-3 text-xs bg-white outline-none focus:border-[#0073C4] appearance-none ${errors.province ? 'border-red-500' : 'border-[#D2D2D2]'}`}
                  >
                    <option value="">-- Chọn Tỉnh/TP --</option>
                    <option value="TP. Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Quảng Ninh">Quảng Ninh</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  {errors.province && <p className="text-red-500 text-[10px] mt-0.5">{errors.province}</p>}
                </div>
              </div>

              {/* District Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-28 text-slate-600 text-xs font-medium">Quận huyện</label>
                <div className="flex-1 relative">
                  <select
                    value={form.district}
                    onChange={(e) => set('district', e.target.value)}
                    className={`w-full h-9 border rounded px-3 text-xs bg-white outline-none focus:border-[#0073C4] appearance-none ${errors.district ? 'border-red-500' : 'border-[#D2D2D2]'}`}
                  >
                    <option value="">-- Chọn Quận/Huyện --</option>
                    {form.province === 'TP. Hà Nội' ? (
                      <>
                        <option value="Quận Bắc Từ Liêm">Quận Bắc Từ Liêm</option>
                        <option value="Quận Cầu Giấy">Quận Cầu Giấy</option>
                        <option value="Quận Hoàn Kiếm">Quận Hoàn Kiếm</option>
                        <option value="Quận Hai Bà Trưng">Quận Hai Bà Trưng</option>
                      </>
                    ) : form.province === 'TP. Hồ Chí Minh' ? (
                      <>
                        <option value="Quận 1">Quận 1</option>
                        <option value="Quận 3">Quận 3</option>
                        <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                      </>
                    ) : (
                      <>
                        <option value="Quận Bắc Từ Liêm">Quận Bắc Từ Liêm</option>
                        <option value="Quận Cầu Giấy">Quận Cầu Giấy</option>
                        <option value="Quận 1">Quận 1</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  {errors.district && <p className="text-red-500 text-[10px] mt-0.5">{errors.district}</p>}
                </div>
              </div>

              {/* Ward Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-28 text-slate-600 text-xs font-medium">Phường xã</label>
                <div className="flex-1 relative">
                  <select
                    value={form.ward}
                    onChange={(e) => set('ward', e.target.value)}
                    className={`w-full h-9 border rounded px-3 text-xs bg-white outline-none focus:border-[#0073C4] appearance-none ${errors.ward ? 'border-red-500' : 'border-[#D2D2D2]'}`}
                  >
                    <option value="">-- Chọn Phường/Xã --</option>
                    {form.district === 'Quận Bắc Từ Liêm' ? (
                      <>
                        <option value="Phường Xuân Tảo">Phường Xuân Tảo</option>
                        <option value="Phường Cổ Nhuế 1">Phường Cổ Nhuế 1</option>
                      </>
                    ) : (
                      <>
                        <option value="Phường Xuân Tảo">Phường Xuân Tảo</option>
                        <option value="Phường Nguyễn Du">Phường Nguyễn Du</option>
                        <option value="Phường Phạm Đình Hổ">Phường Phạm Đình Hổ</option>
                        <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  {errors.ward && <p className="text-red-500 text-[10px] mt-0.5">{errors.ward}</p>}
                </div>
              </div>

              {/* Address Input */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-28 text-slate-600 text-xs font-medium">Địa chỉ</label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    className={`w-full h-9 border rounded px-3 text-xs outline-none focus:border-[#0073C4] ${errors.address ? 'border-red-500' : 'border-[#D2D2D2]'}`}
                    placeholder="Số nhà, tên đường"
                  />
                  {errors.address && <p className="text-red-500 text-[10px] mt-0.5">{errors.address}</p>}
                </div>
              </div>

              {/* Checkbox VAT Row */}
              <div className="flex items-center gap-2.5 pt-2 sm:pl-32">
                <input
                  type="checkbox"
                  id="vat_chk"
                  checked={requireVat}
                  onChange={(e) => {
                    setRequireVat(e.target.checked);
                    if (!e.target.checked) setErrors((er) => ({...er, vatEmail: undefined}));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#0073C4] focus:ring-[#0073C4]"
                />
                <label htmlFor="vat_chk" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">
                  Yêu cầu xuất hóa đơn phí vận chuyển (VAT)
                </label>
              </div>

              {/* Email Input Row */}
              {requireVat && (
                <div className="animate-fade-in space-y-2 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-28 text-slate-600 text-xs font-medium">Email xuất hóa đơn</label>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={vatEmail}
                        onChange={(e) => {
                          setVatEmail(e.target.value);
                          setErrors((er) => ({...er, vatEmail: undefined}));
                        }}
                        className={`w-full h-9 border rounded px-3 text-xs outline-none focus:border-[#0073C4] ${errors.vatEmail ? 'border-red-500' : 'border-[#D2D2D2]'}`}
                        placeholder="vd: ketoan@nhahang.com"
                      />
                      {errors.vatEmail && <p className="text-red-500 text-[10px] mt-0.5">{errors.vatEmail}</p>}
                    </div>
                  </div>

                  <div className="sm:pl-32">
                    <a
                      href={VAT_FORM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-[#0073C4] hover:underline"
                    >
                      Đăng ký xuất hóa đơn tài chính (VAT) cho dịch vụ giao hàng - GrabExpress
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Form Connection Action Buttons */}
            <div className="mt-8 sm:pl-32">
              {!connection.isConnected ? (
                <button
                  onClick={handleConnect}
                  className="rounded-md bg-[#0073C4] px-10 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#005c9c] transition-all cursor-pointer"
                >
                  Kết nối
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleUpdate}
                    className="rounded-md bg-emerald-600 px-8 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => setConfirmUnlink(true)}
                    className="rounded-md bg-red-50 px-6 py-2.5 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    Hủy kết nối
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Beautiful Custom Grab Express Delivery Vector Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <svg viewBox="0 0 520 380" className="w-full h-auto drop-shadow-sm select-none">
                {/* Pastel Light-Green City skyline background */}
                <rect x="30" y="160" width="40" height="160" rx="3" fill="#D3EFE0" />
                <rect x="80" y="120" width="55" height="200" rx="4" fill="#D3EFE0" />
                <rect x="145" y="80" width="65" height="240" rx="4" fill="#C1EBCE" opacity="0.9" />
                
                {/* Windows on Building 3 */}
                <rect x="155" y="95" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="172" y="95" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="190" y="95" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="155" y="120" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="172" y="120" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="190" y="120" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="155" y="145" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="172" y="145" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="190" y="145" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="155" y="170" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="172" y="170" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="190" y="170" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="155" y="195" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="172" y="195" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="190" y="195" width="10" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />

                <rect x="220" y="140" width="50" height="180" rx="3" fill="#D3EFE0" />
                <rect x="280" y="100" width="60" height="220" rx="4" fill="#C1EBCE" />
                <rect x="290" y="115" width="12" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="312" y="115" width="12" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="290" y="140" width="12" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="312" y="140" width="12" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="290" y="165" width="12" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />
                <rect x="312" y="165" width="12" height="15" rx="1" fill="#FFFFFF" opacity="0.6" />

                {/* Tallest Building on the right */}
                <rect x="350" y="60" width="55" height="260" rx="4" fill="#B2E5C1" />
                <rect x="362" y="75" width="12" height="18" rx="1" fill="#FFFFFF" opacity="0.7" />
                <rect x="380" y="75" width="12" height="18" rx="1" fill="#FFFFFF" opacity="0.7" />
                <rect x="362" y="105" width="12" height="18" rx="1" fill="#FFFFFF" opacity="0.7" />
                <rect x="380" y="105" width="12" height="18" rx="1" fill="#FFFFFF" opacity="0.7" />
                <rect x="362" y="135" width="12" height="18" rx="1" fill="#FFFFFF" opacity="0.7" />
                <rect x="380" y="135" width="12" height="18" rx="1" fill="#FFFFFF" opacity="0.7" />
                <rect x="362" y="165" width="12" height="18" rx="1" fill="#FFFFFF" opacity="0.7" />
                <rect x="380" y="165" width="12" height="18" rx="1" fill="#FFFFFF" opacity="0.7" />

                {/* Ground Line / Park shapes */}
                <path d="M10 320 Q 150 290, 300 310 T 510 320 L 510 380 L 10 380 Z" fill="#E2F7EB" />
                <path d="M10 320 C 150 305, 350 300, 510 320" stroke="#00B14F" strokeWidth="6" strokeLinecap="round" fill="none" />

                {/* ===== Scooter Rider (Left) ===== */}
                {/* Scooter wheels */}
                <circle cx="95" cy="285" r="22" fill="#2E3A42" />
                <circle cx="95" cy="285" r="14" fill="#D5D9DC" />
                <circle cx="95" cy="285" r="5" fill="#2E3A42" />

                <circle cx="195" cy="290" r="22" fill="#2E3A42" />
                <circle cx="195" cy="290" r="14" fill="#D5D9DC" />
                <circle cx="195" cy="290" r="5" fill="#2E3A42" />

                {/* Scooter Body - Teal / Green */}
                {/* Floorboard */}
                <path d="M 100 278 L 180 282 L 180 270 Q 140 265, 110 262 Z" fill="#00A25C" />
                {/* Front Shield */}
                <path d="M 175 280 C 195 240, 190 195, 185 185 L 175 185 C 178 198, 182 235, 168 268 Z" fill="#00B14F" />
                <path d="M 183 185 C 180 195, 178 220, 170 245" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Front Mudguard */}
                <path d="M 185 275 C 190 260, 210 265, 205 280 Z" fill="#008E3E" />
                {/* Rear Cowl */}
                <path d="M 100 270 C 80 270, 70 240, 85 220 C 105 200, 135 210, 140 240 C 141 258, 120 270, 100 270 Z" fill="#00B14F" />
                {/* Scooter Seat */}
                <path d="M 105 220 C 115 210, 140 215, 150 230 L 100 230 Z" fill="#1C2E3B" />
                {/* Headlight & Handlebars */}
                <circle cx="184" cy="183" r="6" fill="#FFE57F" />
                <path d="M 178 185 L 172 178 M 184 183 L 180 174" stroke="#2E3A42" strokeWidth="3" strokeLinecap="round" />
                {/* Mirror */}
                <circle cx="171" cy="172" r="5" fill="#D5D9DC" stroke="#2E3A42" strokeWidth="1.5" />

                {/* Rider character */}
                {/* Legs */}
                <path d="M 125 225 L 115 268 L 135 268" stroke="#1C2E3B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Torso & Arms */}
                <path d="M 130 170 Q 150 175, 170 185" stroke="#00B14F" strokeWidth="11" strokeLinecap="round" fill="none" />
                <path d="M 125 155 C 135 155, 145 170, 145 200 C 130 220, 115 210, 125 155 Z" fill="#008E3E" />
                <path d="M 120 180 L 110 220" stroke="#1C2E3B" strokeWidth="10" strokeLinecap="round" fill="none" /> {/* back leg */}
                {/* Head & Helmet */}
                <circle cx="135" cy="142" r="10" fill="#FFCC80" /> {/* Skin */}
                {/* Helmet */}
                <path d="M 122 142 C 122 128, 148 128, 148 142 Z" fill="#00B14F" />
                <circle cx="135" cy="132" r="10" fill="#00B14F" />
                {/* Helmet Strap / Ear */}
                <path d="M 125 142 L 132 150 L 138 142" stroke="#2E3A42" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M 136 138 Q 146 142, 142 146" stroke="#2E3A42" strokeWidth="3" strokeLinecap="round" fill="none" /> {/* Visor */}

                {/* Grab delivery box on back */}
                <rect x="62" y="162" width="46" height="46" rx="4" fill="#00B14F" stroke="#008E3E" strokeWidth="1" />
                <text x="85" y="190" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="'Inter', sans-serif">Grab</text>
                {/* Carrier rack */}
                <path d="M 85 220 L 70 210 L 70 208 M 85 240 L 60 215" stroke="#78909C" strokeWidth="3" strokeLinecap="round" fill="none" />

                {/* ===== Standing Driver & Customer (Right) ===== */}
                {/* Standing Driver */}
                {/* Legs */}
                <line x1="330" y1="250" x2="330" y2="305" stroke="#1C2E3B" strokeWidth="7" strokeLinecap="round" />
                <line x1="342" y1="250" x2="342" y2="305" stroke="#1C2E3B" strokeWidth="7" strokeLinecap="round" />
                {/* Shoes */}
                <path d="M 324 305 L 334 305 L 334 309 Z" fill="#2E3A42" />
                <path d="M 338 305 L 348 305 L 348 309 Z" fill="#2E3A42" />
                {/* Torso (Green uniform) */}
                <rect x="322" y="195" width="26" height="58" rx="4" fill="#00B14F" />
                {/* White Stripe */}
                <rect x="333" y="195" width="4" height="58" fill="#FFFFFF" opacity="0.7" />
                {/* Arms & Hands */}
                <path d="M 322 205 L 312 225 L 316 235" stroke="#008E3E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M 348 205 Q 360 210, 365 220" stroke="#008E3E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Head & Green Helmet */}
                <circle cx="335" cy="180" r="8" fill="#FFCC80" />
                <path d="M 325 180 C 325 168, 345 168, 345 180 Z" fill="#00B14F" />
                <circle cx="335" cy="172" r="8" fill="#00B14F" />
                {/* Box / Package in driver's hands */}
                <rect x="304" y="222" width="18" height="18" rx="2" fill="#E5A93B" stroke="#CC8F1E" strokeWidth="1" />
                <line x1="304" y1="231" x2="322" y2="231" stroke="#CC8F1E" strokeWidth="1" />

                {/* Customer (Right) */}
                {/* Legs */}
                <line x1="410" y1="255" x2="402" y2="300" stroke="#FFCC80" strokeWidth="6" strokeLinecap="round" />
                <line x1="422" y1="255" x2="426" y2="298" stroke="#FFCC80" strokeWidth="6" strokeLinecap="round" />
                {/* Shoes */}
                <ellipse cx="400" cy="301" rx="6" ry="3" fill="#FFFFFF" stroke="#D5D9DC" strokeWidth="1" />
                <ellipse cx="428" cy="299" rx="6" ry="3" fill="#FFFFFF" stroke="#D5D9DC" strokeWidth="1" />
                {/* Torso (Green T-shirt) & Orange Pants */}
                <path d="M 405 235 L 425 235 L 428 258 L 402 258 Z" fill="#FF6D00" /> {/* Orange pants */}
                <path d="M 406 195 L 424 195 L 426 235 L 404 235 Z" fill="#00B14F" /> {/* Green shirt */}
                {/* Arms & Hands */}
                <path d="M 406 200 L 392 218 L 396 222" stroke="#008E3E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M 424 200 Q 436 210, 430 225" stroke="#008E3E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Head & Hair */}
                <circle cx="415" cy="180" r="7" fill="#FFCC80" />
                {/* Black Hair curly shape */}
                <path d="M 408 180 C 405 170, 425 170, 422 180 Q 425 190, 418 190 Q 408 190, 408 180" fill="#1C2E3B" />
                <circle cx="415" cy="174" r="8" fill="#1C2E3B" />
              </svg>
            </div>
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
