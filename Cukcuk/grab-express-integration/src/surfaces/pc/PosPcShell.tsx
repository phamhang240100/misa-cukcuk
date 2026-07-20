import React, {useState} from 'react';
import {
  Bell,
  ChevronDown,
  Cloud,
  Globe,
  Grid3x3,
  HelpCircle,
  Home,
  Map,
  Menu,
  MonitorSmartphone,
  Notebook,
  Plus,
  RefreshCw,
  Settings,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Khung windowed dùng chung cho bản POS PC — khớp ảnh chụp thật (Omnissa VDI,
// header xanh full-width, tab Order/Sơ đồ/Order Online, +ORDER dropdown,
// menu Nghiệp vụ, status bar dưới cùng).
// ---------------------------------------------------------------------------

export type PcScreen = 'order' | 'orderList' | 'onlineOrders' | 'checkout' | 'book';

export const PC_ORDER_TABS: {id: PcScreen; label: string}[] = [
  {id: 'orderList', label: 'Order'},
];

const NGHIEP_VU_ITEMS = [
  {label: 'Danh sách order', icon: ShoppingBag},
  {label: 'Danh sách hóa đơn', icon: Notebook},
  {label: 'Sổ giao hàng', icon: Truck, screen: 'book' as PcScreen},
  {label: 'Báo cáo tổng hợp', icon: Grid3x3},
  {label: 'Thiết lập', icon: Settings},
];

export const PosPcShell: React.FC<{
  screen: PcScreen;
  onNavigate: (s: PcScreen) => void;
  onAddOrderDelivery: () => void;
  onAddOrderDineIn: () => void;
  onAddOrderTakeaway: () => void;
  unreadCount?: number;
  onlineCount?: number;
  onOpenBell?: () => void;
  children: React.ReactNode;
}> = ({
  screen,
  onNavigate,
  onAddOrderDelivery,
  onAddOrderDineIn,
  onAddOrderTakeaway,
  unreadCount = 0,
  onlineCount = 0,
  onOpenBell,
  children,
}) => {
  const [orderMenuOpen, setOrderMenuOpen] = useState(false);
  const [nghiepVuOpen, setNghiepVuOpen] = useState(false);

  const inOrderModule = screen === 'order' || screen === 'orderList' || screen === 'onlineOrders' || screen === 'checkout';

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-300 bg-[#EEF0F4] shadow-[0_20px_50px_-15px_rgba(15,23,42,0.35)]">
      {/* ===== Header xanh full-width ===== */}
      <header className="relative flex h-12 shrink-0 items-center justify-between bg-[#1570EF] px-1 text-white">
        <div className="flex h-full items-center">
          <button
            onClick={() => onNavigate('orderList')}
            title="Trang chủ"
            className="flex h-full items-center px-3 hover:bg-white/10"
          >
            <Home className="h-5 w-5" />
          </button>

          {inOrderModule ? (
            <>
              <TabBtn
                active={screen === 'orderList' || screen === 'order' || screen === 'checkout'}
                onClick={() => onNavigate('orderList')}
                icon={<ShoppingBag className="h-4 w-4" />}
              >
                Order
              </TabBtn>
              <TabBtn active={false} disabled icon={<Map className="h-4 w-4" />}>
                Sơ đồ
              </TabBtn>
              <TabBtn
                active={screen === 'onlineOrders'}
                onClick={() => onNavigate('onlineOrders')}
                icon={<Globe className="h-4 w-4" />}
              >
                Order Online
                {onlineCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                    {onlineCount}
                  </span>
                )}
              </TabBtn>
            </>
          ) : (
            <TabBtn active icon={<Truck className="h-4 w-4" />}>
              Sổ giao hàng
            </TabBtn>
          )}
        </div>

        <div className="flex items-center gap-0.5 pr-1">
          {/* +ORDER dropdown */}
          <div className="relative">
            <button
              onClick={() => setOrderMenuOpen((v) => !v)}
              className="flex h-8 items-center gap-1.5 rounded bg-white/15 px-2.5 text-[13px] font-bold hover:bg-white/25"
            >
              <Plus className="h-4 w-4" /> ORDER
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>
            {orderMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOrderMenuOpen(false)} />
                <div className="animate-scale-up absolute right-0 top-full z-40 mt-1.5 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 text-slate-700 shadow-2xl">
                  <DropdownItem
                    icon={<User className="h-4 w-4 text-brand" />}
                    label="Thêm order Tại bàn"
                    onClick={() => {
                      setOrderMenuOpen(false);
                      onAddOrderDineIn();
                    }}
                  />
                  <DropdownItem
                    icon={<ShoppingBag className="h-4 w-4 text-brand" />}
                    label="Thêm order Mang về"
                    onClick={() => {
                      setOrderMenuOpen(false);
                      onAddOrderTakeaway();
                    }}
                  />
                  <DropdownItem
                    icon={<Truck className="h-4 w-4 text-brand" />}
                    label="Thêm order Giao hàng"
                    onClick={() => {
                      setOrderMenuOpen(false);
                      onAddOrderDelivery();
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Nghiệp vụ (hamburger) */}
          <div className="relative">
            <button
              onClick={() => setNghiepVuOpen((v) => !v)}
              title="Nghiệp vụ"
              className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/15"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
            {nghiepVuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNghiepVuOpen(false)} />
                <div className="animate-scale-up absolute right-0 top-full z-40 mt-1.5 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 text-slate-700 shadow-2xl">
                  {NGHIEP_VU_ITEMS.map((it) => (
                    <DropdownItem
                      key={it.label}
                      icon={<it.icon className="h-4 w-4 text-brand" />}
                      label={it.label}
                      onClick={() => {
                        setNghiepVuOpen(false);
                        if (it.screen) onNavigate(it.screen);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {[Globe, Cloud, RefreshCw, HelpCircle].map((Icon, i) => (
            <button key={i} className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/15">
              <Icon className="h-[18px] w-[18px]" />
            </button>
          ))}
          <button onClick={onOpenBell} className="relative flex h-8 w-8 items-center justify-center rounded hover:bg-white/15">
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-white px-0.5 text-[9px] font-bold text-[#1570EF]">
                {unreadCount}
              </span>
            )}
          </button>
          <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <User className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {/* ===== Nội dung ===== */}
      <div className="min-h-0 flex-1 overflow-hidden bg-[#EEF0F4]">{children}</div>

      {/* ===== Status bar dưới ===== */}
      <footer className="flex h-6 shrink-0 items-center justify-between bg-[#1570EF] px-3 text-[11px] font-medium text-white/90">
        <span className="flex items-center gap-1.5">
          <MonitorSmartphone className="h-3 w-3" /> Nhà hàng Phở Thìn 13 Lò Đúc · phothin.cukcuk2.misa.local
        </span>
        <span className="flex items-center gap-3">
          <span>Tổng đài tư vấn: MISA SUPPORT</span>
          <span className="opacity-70">OVR | NUM</span>
        </span>
      </footer>
    </div>
  );
};

const TabBtn: React.FC<{
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({active, disabled, icon, onClick, children}) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`flex h-full items-center gap-1.5 px-4 text-[13px] font-semibold transition-colors ${
      active ? 'bg-white text-[#1570EF]' : disabled ? 'cursor-not-allowed text-white/50' : 'text-white/90 hover:bg-white/10'
    }`}
  >
    {icon}
    {children}
  </button>
);

const DropdownItem: React.FC<{icon: React.ReactNode; label: string; onClick: () => void}> = ({icon, label, onClick}) => (
  <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium hover:bg-brand-light">
    {icon}
    {label}
  </button>
);
