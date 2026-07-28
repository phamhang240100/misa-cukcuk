import React from 'react';
import { HeaderMenuDropdown } from './HeaderMenuDropdown';
import { InvoiceIcon } from './InvoiceIcon';
import { 
  Home, 
  Plus, 
  Globe, 
  CloudDownload, 
  ArrowLeftRight, 
  Receipt,
  Bell, 
  BellRing,
  Clock, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Menu,
  MessageSquare,
  Sparkles,
  Bike,
  Utensils,
  Calendar,
  Users,
  FileText,
  Pencil,
  X,
  Grid,
  List
} from 'lucide-react';
import { Order, AppView } from '../types';
import { SHOPEE_LOGO, GRAB_LOGO } from './OrderOnlineView';
import { DeliveryBikeIcon } from './DeliveryBikeIcon';
import { PickupStoreIcon } from './PickupStoreIcon';
import { DeliveryTicketIcon } from './DeliveryTicketIcon';
import { KitchenBarIcon } from './KitchenBarIcon';

const FULL_GRAB_LOGO = "https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=2203b93f-2d7a-49c1-a1ec-5a775d721814.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa";
const FULL_SHOPEE_LOGO = "https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=dd0332b1-04ed-4b2c-a8f9-176514e84a6e.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa";

const DEFAULT_DELIVERY_ORDERS = [
  { code: 'Grab-2000', channel: 'Grab', timeStatus: 'Vừa xong', customerName: 'Chị Nhàn', phone: '0987 456 221', time: '16:25', date: '27/07/2026', isOverdue8h: false, isPickupAtStore: false },
  { code: 'Grab-0001', channel: 'Grab', timeStatus: '2 phút trước', customerName: 'Anh Minh', phone: '0325 641 789', time: '16:23', date: '27/07/2026', isOverdue8h: false, isPickupAtStore: false },
  { code: 'SPF-8000', channel: 'ShopeeFood', timeStatus: '15 phút trước', customerName: 'Chị Thu', phone: '0321 236 528', time: '16:10', date: '27/07/2026', isOverdue8h: false, isPickupAtStore: false },
  { code: 'SPF-0040', channel: 'ShopeeFood', timeStatus: '30 phút trước', customerName: 'Anh Hoàng', phone: '0912 345 678', time: '15:55', date: '27/07/2026', isOverdue8h: false, isPickupAtStore: true },
  { code: 'SPF-2170', channel: 'ShopeeFood', timeStatus: '1 tiếng trước', customerName: 'Chị Phương', phone: '0386 168 230', time: '15:25', date: '27/07/2026', isOverdue8h: false, isPickupAtStore: true },
  { code: 'SPF-2180', channel: 'ShopeeFood', timeStatus: 'Quá 3 tiếng', customerName: 'Anh Tuấn', phone: '0903 888 999', time: '13:25', date: '27/07/2026', isOverdue8h: false, isPickupAtStore: false },
  { code: 'SPF-2190', channel: 'ShopeeFood', timeStatus: 'Quá 8 tiếng', customerName: 'Chị Ngọc', phone: '0386 168 229', time: '08:15', date: '27/07/2026', isOverdue8h: true, isPickupAtStore: false },
  { code: 'SPF-489027', channel: 'ShopeeFood', timeStatus: 'Quá 1 ngày', customerName: 'Hồ Thị Lan', phone: '0979 817 202', time: '10:01', date: '26/07/2026', isOverdue8h: true, isPickupAtStore: false }
];

const isOverdueTime = (timeStatus?: string, isOverdue8h?: boolean): boolean => {
  if (isOverdue8h) return true;
  if (!timeStatus) return false;
  const s = timeStatus.toLowerCase();
  return s.includes('quá') || s.includes('ngày');
};

interface MainOrderViewProps {
  grabUnconfirmedCount: number;
  shopeeUnconfirmedCount: number;
  onlineUnconfirmedCount: number;
  onNavigateToView: (view: AppView) => void;
  onSimulateNewOrder: (channel?: 'Grab' | 'ShopeeFood') => void;
  notifications: any[];
  onNotificationClick: (notif: any) => void;
  confirmedOrders?: Order[];
  onOpenDeliveryOrder?: (code: string, channel: string) => void;
}

export default function MainOrderView({
  grabUnconfirmedCount,
  shopeeUnconfirmedCount,
  onlineUnconfirmedCount,
  onNavigateToView,
  onSimulateNewOrder,
  notifications,
  onNotificationClick,
  confirmedOrders = [],
  onOpenDeliveryOrder
}: MainOrderViewProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [activeSubTab, setActiveSubTab] = React.useState<string>('delivery');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false);
  const [showReceiptDropdown, setShowReceiptDropdown] = React.useState(false);
  const [deliveryOrders, setDeliveryOrders] = React.useState(DEFAULT_DELIVERY_ORDERS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedChannel, setSelectedChannel] = React.useState<'all' | 'ShopeeFood' | 'Grab' | 'Website'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDeleteDeliveryOrder = (code: string) => {
    setDeliveryOrders(prev => prev.filter(o => o.code !== code));
  };

  // Synchronize newly confirmed orders from App (e.g. from ShopeeFood or Grab confirmation)
  const combinedDeliveryOrders = React.useMemo(() => {
    const newlyConfirmed = (confirmedOrders || [])
      .filter(o => o.status === 'confirmed')
      .map(o => {
        const parts = o.orderTime ? o.orderTime.split(' - ') : [];
        const timePart = parts[0] || '16:25';
        const datePart = parts[1] || '27/07/2026';
        let custName = o.driverName ? o.driverName.split('(')[0].trim() : 'Chị Nhàn';
        if (!custName || custName === 'Khách hàng') custName = 'Chị Nhàn';

        return {
          code: o.code,
          channel: o.channel || 'ShopeeFood',
          timeStatus: 'Vừa xong',
          customerName: custName,
          phone: o.customerPhone || '0981 234 567',
          time: timePart,
          date: datePart,
          isOverdue8h: false,
          isPickupAtStore: o.isPickupAtStore || o.code === 'SPF-0040' || o.code === 'SPF-2170'
        };
      });

    const newlyCodes = new Set(newlyConfirmed.map(c => c.code));
    const filteredLocal = deliveryOrders.filter(d => !newlyCodes.has(d.code));

    return [...newlyConfirmed, ...filteredLocal];
  }, [confirmedOrders, deliveryOrders]);

  const filteredDeliveryOrders = combinedDeliveryOrders.filter(o => {
    const matchesSearch = o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    const matchesChannel = selectedChannel === 'all' || o.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  return (
    <div id="main-order-view-container" className="flex flex-col h-full bg-white select-none text-[13px] font-sans">
      {/* Blue Top Header Bar */}
      <header id="main-header" className="bg-[#0973B9] h-11 text-white flex items-center justify-between px-2 shrink-0 border-b border-[#00497D] font-medium">
        <div id="header-left" className="flex items-center h-full">
          {/* Home Icon */}
          <button id="home-nav-btn" className="hover:bg-[#00497D] h-full px-3 flex items-center transition">
            <Home className="w-5 h-5" />
          </button>
          
          {/* Active Tab: Order */}
          <div id="active-order-tab" className="bg-white text-[#0973B9] h-full flex items-center px-4 font-bold text-sm gap-1.5 shadow-sm rounded-t-lg">
            <Globe className="w-4 h-4 text-[#0973B9]" />
            <span id="label-order" className="font-extrabold text-[#0973B9]">Order</span>
          </div>

          {/* Tab: Sơ đồ */}
          <button id="sodo-nav-btn" className="hover:bg-[#00497D] h-full px-4 flex items-center text-white/90 text-sm transition">
            <span id="label-sodo">Sơ đồ</span>
          </button>

          {/* Tab: Order Online */}
          <button 
            id="order-online-nav-btn" 
            onClick={() => onNavigateToView('orderonline')} 
            className="hover:bg-[#00497D] h-full px-4 flex items-center text-white/90 text-sm transition gap-1.5 relative"
          >
            <Bell className="w-4 h-4 text-white/80" />
            <span id="label-order-online">
              Order Online
            </span>
          </button>
        </div>

        {/* Header Center and Actions */}
        <div id="header-right" className="flex items-center h-full gap-1 sm:gap-1.5">
          {/* 1. + ORDER ▾ button */}
          <button id="add-order-btn" className="flex items-center gap-1 bg-transparent hover:bg-white/10 px-2.5 h-8 rounded text-white font-bold text-xs transition uppercase shrink-0">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="tracking-wider">ORDER</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/90 -ml-0.5" />
          </button>

          {/* 2. Hamburger menu button */}
          <div className="relative h-full">
            <button 
              id="menu-toggle-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`h-full px-2 sm:px-2.5 flex items-center hover:bg-[#00497D] transition ${dropdownOpen ? 'bg-[#00497D]' : ''}`}
              title="Danh sách chức năng"
            >
              <Menu className="w-5 h-5" />
            </button>
            <HeaderMenuDropdown 
              isOpen={dropdownOpen} 
              onClose={() => setDropdownOpen(false)} 
              onNavigateView={onNavigateToView}
            />
          </div>

          {/* 3. Globe icon */}
          <button id="globe-btn" className="hover:bg-[#00497D] p-2 rounded transition" title="MISA CUKCUK">
            <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 4. Cloud download icon */}
          <button id="cloud-sync-btn" className="hover:bg-[#00497D] p-2 rounded transition" title="Đồng bộ đám mây">
            <CloudDownload className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 5. Exchange / Arrows left right icon */}
          <button id="exchange-sync-btn" className="hover:bg-[#00497D] p-2 rounded transition" title="Đồng bộ dữ liệu">
            <ArrowLeftRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 6. Receipt icon with Dropdown */}
          <div className="relative" id="receipt-dropdown-container">
            <button 
              id="receipt-btn" 
              onClick={() => {
                setShowReceiptDropdown(!showReceiptDropdown);
                setShowNotificationsDropdown(false);
                setDropdownOpen(false);
              }}
              className={`p-2 rounded transition relative flex items-center justify-center ${
                onlineUnconfirmedCount > 0 
                  ? 'bg-[#F27024] text-white animate-pulse-fast' 
                  : 'hover:bg-[#00497D] text-white'
              }`} 
              title="Hóa đơn"
            >
              <div className="relative">
                <InvoiceIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                {onlineUnconfirmedCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#DA251C] text-white font-black text-[9px] w-3.5 h-3.5 rounded-sm flex items-center justify-center leading-none border border-white/20 select-none">
                    i
                  </span>
                )}
              </div>
            </button>

            {showReceiptDropdown && (
              <div className="absolute right-0 top-11 z-[100] w-[280px] bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 font-normal">
                {/* 1. Đặt giao hàng từ 5Food */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <DeliveryBikeIcon className="w-5 h-5 text-[#0973B9] shrink-0" />
                  <span className="text-gray-700 font-medium">Đặt giao hàng từ 5Food</span>
                </div>

                {/* 2. Đặt giao hàng trên Web */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <Globe className="w-5 h-5 text-[#0973B9] shrink-0" />
                  <span className="text-gray-700 font-medium">Đặt giao hàng trên Web</span>
                </div>

                {/* 3. Giao hàng từ Grab */}
                <div 
                  onClick={() => {
                    onNavigateToView('grab');
                    setShowReceiptDropdown(false);
                  }}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={GRAB_LOGO} 
                      alt="Grab" 
                      className="w-5 h-5 object-contain shrink-0 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-gray-700 font-medium">Giao hàng từ Grab</span>
                  </div>
                  {grabUnconfirmedCount > 0 ? (
                    <span className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                      {grabUnconfirmedCount}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal text-xs">(0)</span>
                  )}
                </div>

                {/* 4. Giao hàng từ ShopeeFood */}
                <div 
                  onClick={() => {
                    onNavigateToView('shopeefood');
                    setShowReceiptDropdown(false);
                  }}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={SHOPEE_LOGO} 
                      alt="ShopeeFood" 
                      className="w-5 h-5 object-contain shrink-0 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-gray-700 font-medium">Giao hàng từ ShopeeFood</span>
                  </div>
                  {shopeeUnconfirmedCount > 0 ? (
                    <span className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                      {shopeeUnconfirmedCount}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal text-xs">(0)</span>
                  )}
                </div>

                {/* 5. Mời khách hàng sử dụng 5Food */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <Utensils className="w-5 h-5 text-[#0973B9] shrink-0" />
                  <span className="text-gray-700 font-medium">Mời khách hàng sử dụng 5Food</span>
                </div>

                {/* 6. Đặt chỗ từ 5Food */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#0973B9] shrink-0" />
                    <span className="text-gray-700 font-medium">Đặt chỗ từ 5Food</span>
                  </div>
                  <span className="text-gray-400 font-normal text-xs">(0)</span>
                </div>

                {/* 7. Khách hàng chưa đồng bộ */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#0973B9] shrink-0" />
                    <span className="text-gray-700 font-medium">Khách hàng chưa đồng bộ</span>
                  </div>
                  <span className="text-gray-400 font-normal text-xs">(0)</span>
                </div>

                {/* 8. Hóa đơn chưa đồng bộ */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#0973B9] shrink-0" />
                    <span className="text-gray-700 font-medium">Hóa đơn chưa đồng bộ</span>
                  </div>
                  <span className="text-gray-400 font-normal text-xs">(0)</span>
                </div>
              </div>
            )}
          </div>

          {/* 7. Chat / Notifications Dropdown */}
          <div className="relative">
            <button 
              id="bell-alert-btn" 
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="hover:bg-[#00497D] p-2 rounded relative transition flex items-center justify-center"
              title="Thông báo đơn hàng"
            >
              <MessageSquare className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 top-11 z-50 w-[360px] bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-3 bg-[#0973B9] text-white font-bold flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Thông báo đơn hàng ({unreadCount} mới)</span>
                  </div>
                  <button onClick={() => setShowNotificationsDropdown(false)} className="text-white hover:text-gray-200 p-0.5 rounded hover:bg-white/10 transition cursor-pointer">✕</button>
                </div>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 font-medium text-xs">Không có thông báo mới.</div>
                  ) : (
                    notifications.map((notif) => {
                      const isGrab = notif.channel === 'Grab' || (notif.code && notif.code.startsWith('GF'));
                      return (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            onNotificationClick(notif);
                            setShowNotificationsDropdown(false);
                          }}
                          className={`p-3 hover:bg-[#F0F6FE] cursor-pointer transition-colors flex gap-2.5 items-center ${
                            notif.read ? 'bg-white opacity-70' : 'bg-[#F0F6FE]'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-[#0973B9] shrink-0" style={{ visibility: notif.read ? 'hidden' : 'visible' }} />
                          <img 
                            src={isGrab ? GRAB_LOGO : SHOPEE_LOGO} 
                            alt={isGrab ? 'Grab' : 'ShopeeFood'} 
                            className="w-5 h-5 object-contain shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900 truncate">
                                {notif.code ? `Đơn hàng mới ${notif.code}` : 'Đơn hàng mới'}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-1">{notif.timestamp}</span>
                            </div>
                            <span className="text-[11px] text-gray-600 truncate">{notif.text}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 8. User Profile */}
          <button id="user-profile-btn" className="hover:bg-[#00497D] p-2 rounded transition flex items-center justify-center" title="Tài khoản">
            <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Sub-Header bar / Filters selection */}
      <div id="filters-navbar" className="bg-white border-b border-gray-200 h-10 px-2 flex items-center justify-between shrink-0">
        <div id="sub-tabs-left" className="flex items-center gap-1.5 h-full py-1">
          <button
            id="tab-unpaid"
            onClick={() => setActiveSubTab('payment')}
            className={`h-full px-3.5 flex items-center justify-center rounded font-semibold text-center border transition text-xs ${
              activeSubTab === 'payment'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Chờ thanh toán (32)
          </button>

          <button
            id="tab-takeaway"
            onClick={() => setActiveSubTab('takeaway')}
            className={`h-full px-3.5 flex items-center justify-center rounded font-semibold text-center border transition text-xs ${
              activeSubTab === 'takeaway'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Mang về (5)
          </button>

          <button
            id="tab-delivery"
            onClick={() => setActiveSubTab('delivery')}
            className={`h-full px-3.5 flex items-center justify-center rounded font-semibold text-center border transition text-xs ${
              activeSubTab === 'delivery'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Chờ giao hàng ({combinedDeliveryOrders.length})
          </button>

          <button
            id="tab-reservation"
            onClick={() => setActiveSubTab('reservation')}
            className={`h-full px-3.5 flex items-center justify-center rounded font-semibold text-center border transition text-xs ${
              activeSubTab === 'reservation'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Đặt trước (1)
          </button>

          {/* Separator */}
          <div className="h-4 w-[1px] bg-gray-300 mx-1 shrink-0" />

          {/* Channel Filter (Kênh bán) styled as dropdown */}
          <div className="flex items-center gap-1.5 h-full shrink-0 select-none">
            <span className="text-xs font-semibold text-gray-600">Kênh bán:</span>
            <select
              id="filter-channel-select"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value as 'all' | 'ShopeeFood' | 'Grab' | 'Website')}
              className="h-7 px-2.5 bg-white border border-[#ccc] rounded text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#00497D] cursor-pointer shadow-xs"
            >
              <option value="all">Tất cả</option>
              <option value="ShopeeFood">ShopeeFood</option>
              <option value="Grab">Grab</option>
              <option value="Website">Website</option>
            </select>
          </div>
        </div>

        <div id="sub-filters-right" className="flex items-center gap-2">
          {/* Find Table / Order select box */}
          <div id="find-table-search" className="relative flex items-center bg-white border border-[#ccc] rounded px-2 py-1 h-7 text-xs w-32 cursor-pointer">
            <span id="find-table-text" className="text-gray-700 mr-auto truncate font-medium">Tìm số order</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0 ml-1" />
          </div>

          {/* Search bar */}
          <div id="search-bar-input-container" className="relative flex items-center bg-white border border-[#ccc] rounded px-2 py-1 h-7 w-48">
            <input 
              id="search-input"
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo số order..." 
              className="outline-none text-[11px] w-full text-gray-700 pr-5"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2" />
          </div>

          {/* Grid Layout Toggle Icon */}
          <button className="p-1 rounded border border-[#0973B9] bg-[#E0F2FE] text-[#0973B9] hover:bg-[#BAE6FD] transition" title="Xem dạng lưới">
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div id="mainscreen-body" className="flex-1 relative flex overflow-hidden bg-[#E5E5E5]">
        
        {activeSubTab === 'delivery' ? (
          <div className="flex-1 p-3 overflow-y-auto w-full">
            {filteredDeliveryOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-sm font-medium">Không tìm thấy order giao hàng nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-2.5">
                {filteredDeliveryOrders.map((order) => {
                  const overdue = isOverdueTime(order.timeStatus, order.isOverdue8h);
                  return (
                    <div 
                      key={order.code} 
                      className="bg-white border border-gray-300 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#006EB6] transition group select-none"
                    >
                      {/* Card Header (Blue bar) */}
                      <div className="bg-[#006EB6] text-white px-2.5 py-1.5 flex items-center justify-between text-xs sm:text-sm font-medium">
                        <span className="truncate pr-1 text-[14px]">{order.code}</span>
                        <span className="text-[13px] font-normal shrink-0 ml-1 text-white">
                          {order.timeStatus}
                        </span>
                      </div>

                      {/* Customer Name Row (Left: Customer Name, Right: Scooter or Pickup Store Icon) */}
                      <div className="p-2 border-b border-gray-200 bg-white flex items-center justify-between relative min-h-[42px]">
                        <span className="text-black font-semibold text-[15px] truncate text-left pl-2 pr-8 w-full block">
                          {order.customerName}
                        </span>
                        {(order.isPickupAtStore || order.code === 'SPF-0040' || order.code === 'SPF-2170') ? (
                          <PickupStoreIcon className="w-5 h-5 text-[#006EB6] shrink-0 absolute right-2.5 top-1/2 -translate-y-1/2" />
                        ) : (
                          <DeliveryBikeIcon className="w-5 h-5 text-[#006EB6] shrink-0 absolute right-2.5 top-1/2 -translate-y-1/2" />
                        )}
                      </div>

                      {/* Channel Logo & Time Row (Split 50/50 with vertical divider) */}
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200 bg-white text-center py-2 min-h-[46px] items-center">
                        <div className="px-1 flex items-center justify-center h-full">
                          {order.channel === 'Website' ? (
                            <Globe className="w-6 h-6 text-[#006EB6]" />
                          ) : (
                            <img 
                              src={order.channel === 'Grab' ? FULL_GRAB_LOGO : FULL_SHOPEE_LOGO} 
                              alt={order.channel || 'ShopeeFood'} 
                              className={`${order.channel === 'Grab' ? 'h-[30px] max-w-[90%]' : 'h-[23px] max-w-[85%]'} object-contain shrink-0`} 
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                        <div className={`text-[12px] font-mono px-1 flex flex-col items-center justify-center leading-tight ${
                          overdue ? 'text-[#DA251C] font-semibold' : 'text-gray-900 font-medium'
                        }`}>
                          <div>{order.time}</div>
                          <div>{order.date}</div>
                        </div>
                      </div>

                      {/* Card Footer Actions (4 Prominent Buttons with vertical dividers) */}
                      <div className="grid grid-cols-4 divide-x divide-gray-200 bg-[#F4F4F4] h-10 items-center">
                        <button 
                          onClick={() => {
                            if (onOpenDeliveryOrder) {
                              onOpenDeliveryOrder(order.code, 'ShopeeFood');
                            } else {
                              onNavigateToView('shopeefood');
                            }
                          }}
                          className="flex items-center justify-center h-full hover:bg-emerald-100/70 transition cursor-pointer" 
                          title="Giao hàng"
                        >
                          <DeliveryBikeIcon className="w-5 h-5 text-[#008A45]" />
                        </button>
                        <button 
                          className="flex items-center justify-center h-full hover:bg-gray-200 transition cursor-pointer" 
                          title="Sửa order"
                        >
                          <Pencil className="w-4.5 h-4.5 text-[#888888]" />
                        </button>
                        <button 
                          className="flex items-center justify-center h-full hover:bg-sky-100/70 transition cursor-pointer" 
                          title="Gửi bếp/bar"
                        >
                          <KitchenBarIcon className="w-5 h-5 text-[#888888]" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDeliveryOrder(order.code)}
                          className="flex items-center justify-center h-full hover:bg-red-100/70 transition cursor-pointer" 
                          title="Hủy order"
                        >
                          <X className="w-5 h-5 text-[#DA251C]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Left Side: Main Empty placeholder exactly as in Image 1 */
          <div id="empty-workspace" className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 relative bg-white">
            <div id="logo-fork-spoon-circle" className="w-40 h-40 rounded-full border-8 border-gray-300/60 flex items-center justify-center mb-6 text-gray-300/80">
              <svg id="fork-spoon-svg" className="w-20 h-20 fill-current opacity-70" viewBox="0 0 24 24">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm10-7h-3c-1.1 0-2 .9-2 2v5c0 1.66 1.34 3 3 3v10h2V12c1.66 0 3-1.34 3-3V4c0-2-2-2-2-2z" />
              </svg>
            </div>
            <p id="cooking-placeholder-text" className="text-base text-gray-500/90 font-medium">
              Nhà hàng chưa có order nào, vui lòng <strong className="text-gray-700">Thêm order</strong> để ghi món cho khách
            </p>
            <button 
              id="action-prompt-tip" 
              className="mt-3 text-xs bg-white hover:bg-gray-50 text-gray-700 font-medium px-3.5 py-1.5 rounded-lg border border-gray-300 shadow-sm transition flex items-center gap-1.5 cursor-pointer" 
              onClick={() => onSimulateNewOrder('ShopeeFood')}
            >
              <span>💡 Click vào đây để nhận đơn</span>
            </button>
          </div>
        )}

        {/* Right Side: Popover Dropdown (Matches dropdown menu) */}
        {dropdownOpen && (
          <div 
            id="delivery-popover-dropdown" 
            className="absolute right-2 top-2 z-20 w-72 bg-white rounded-md shadow-2xl border border-gray-200 text-gray-800 flex flex-col shrink-0 overflow-hidden text-[13px]"
          >
            <div id="dropdown-header" className="bg-gray-50 border-b border-gray-100 px-3 py-2 text-[11px] uppercase tracking-wider font-bold text-gray-400 flex items-center justify-between">
              <span>Phương thức trực tuyến</span>
              <button onClick={() => setDropdownOpen(false)} className="text-gray-400 hover:text-gray-600 font-normal normal-case">Đóng ✕</button>
            </div>
            
            <div id="dropdown-list" className="py-1">
              
              {/* Option 1: Đặt giao hàng từ 5Food */}
              <button 
                id="opt-5food-order"
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center transition"
              >
                <div id="icon-5f-order" className="w-5 h-5 mr-3 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-600 rounded">
                  5F
                </div>
                <span id="txt-5f-order">Đặt giao hàng từ 5Food</span>
              </button>

              {/* Option 2: Đặt giao hàng trên Web */}
              <button 
                id="opt-web-order"
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center transition"
              >
                <Globe id="icon-web-order" className="w-4 h-4 mr-3 text-cyan-600" />
                <span id="txt-web-order">Đặt giao hàng trên Web</span>
              </button>

              {/* Option 3: Giao hàng từ Grab (HIGHLIGHTED & INTERACTIVE) */}
              <button 
                id="opt-grab-order"
                onClick={() => onNavigateToView('grab')}
                className="w-full text-left px-4 py-3 bg-green-500/5 hover:bg-green-500/10 flex items-center justify-between transition border-y border-green-500/12 group relative"
              >
                <div id="grab-opt-left" className="flex items-center">
                  <img 
                    id="icon-grab-food" 
                    src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=5e1a7fa2-2197-4aa7-8b10-1f2fe9dbf40d.png&isTemp=true&tenantCode=misa" 
                    className="w-5 h-5 mr-3 rounded-full object-cover shadow-sm" 
                    referrerPolicy="no-referrer" 
                    alt="Grab" 
                  />
                  <span id="txt-grab-food" className="font-semibold text-green-800 group-hover:text-green-900">
                    Giao hàng từ Grab
                  </span>
                </div>
                {grabUnconfirmedCount > 0 ? (
                  <span id="badge-grab-count" className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                    {grabUnconfirmedCount}
                  </span>
                ) : (
                  <span id="badge-grab-count" className="text-gray-400 text-xs font-normal">
                    (0)
                  </span>
                )}
              </button>

              {/* Option 4: Giao hàng từ ShopeeFood (THE NEWLY REQUESTED COMPONENT ACTIVE) */}
              <button 
                id="opt-shopee-food-order"
                onClick={() => onNavigateToView('shopeefood')}
                className="w-full text-left px-4 py-3 bg-orange-500/5 hover:bg-orange-500/10 flex items-center justify-between transition border-b border-orange-500/12 group relative"
              >
                <div id="shopee-opt-left" className="flex items-center">
                  <img 
                    id="icon-shopee-food" 
                    src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=14b33c29-a6cd-4dc4-984c-e5c629967f3f.png&isTemp=true&tenantCode=misa" 
                    className="w-5 h-5 mr-3 rounded-full object-cover shadow-sm" 
                    referrerPolicy="no-referrer" 
                    alt="ShopeeFood" 
                  />
                  <span id="txt-shopee-food" className="font-semibold text-orange-850 group-hover:text-orange-900">
                    Giao hàng từ ShopeeFood
                  </span>
                </div>
                {/* Number count no longer blinks */}
                {shopeeUnconfirmedCount > 0 ? (
                  <span id="badge-shopee-count" className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                    {shopeeUnconfirmedCount}
                  </span>
                ) : (
                  <span id="badge-shopee-count" className="text-gray-400 text-xs font-normal">
                    (0)
                  </span>
                )}

                {/* Sparkling indicator for the newly requested addition */}
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-extrabold px-1 rounded-sm rotate-12 scale-90" id="shopee-new-badge">NEW</div>
              </button>

              {/* Option 5: Mời khách hàng sử dụng 5Food */}
              <button 
                id="opt-invite"
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center text-gray-600 transition"
              >
                <MessageSquare id="icon-invite" className="w-4 h-4 mr-3 text-blue-500" />
                <span id="txt-invite">Mời khách hàng sử dụng 5Food</span>
              </button>

              {/* Option 6: Đặt chỗ từ 5Food (0) */}
              <button 
                id="opt-res-5f"
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center justify-between text-gray-500 transition"
              >
                <div id="res-5f-left" className="flex items-center">
                  <span id="icon-res-5f" className="w-4 h-4 mr-3 border border-gray-300 rounded flex items-center justify-center text-[10px]">🗓</span>
                  <span id="txt-res-5f">Đặt chỗ từ 5Food</span>
                </div>
                <span id="badge-res-5f" className="text-gray-400 text-xs">(0)</span>
              </button>

              {/* Option 7: Khách hàng chưa đồng bộ (0) */}
              <button 
                id="opt-sync-customers"
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center justify-between text-gray-500 transition"
              >
                <div id="sync-customers-left" className="flex items-center">
                  <User id="icon-sync-customers" className="w-4 h-4 mr-3 text-gray-400" />
                  <span id="txt-sync-customers">Khách hàng chưa đồng bộ</span>
                </div>
                <span id="badge-sync-customers" className="text-gray-400 text-xs">(0)</span>
              </button>

              {/* Option 8: Hóa đơn chưa đồng bộ (0) */}
              <button 
                id="opt-sync-invoices"
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center justify-between text-gray-500 transition"
              >
                <div id="sync-invoices-left" className="flex items-center">
                  <span id="icon-sync-invoices" className="w-4 h-4 mr-3 border border-gray-300 rounded flex items-center justify-center text-[10px]">🧾</span>
                  <span id="txt-sync-invoices">Hóa đơn chưa đồng bộ</span>
                </div>
                <span id="badge-sync-invoices" className="text-gray-400 text-xs">(0)</span>
              </button>

            </div>
          </div>
        )}
      </div>

      {/* Primary Action bar above diagnostic footer */}
      <div id="main-action-toolbar" className="bg-white border-t border-gray-200 h-8 px-2 flex items-center justify-between shrink-0 text-xs text-gray-800">
        <div id="toolbar-left" className="flex items-center gap-1">
          {/* Dropdown - Tất cả - */}
          <div id="dropdown-all-orders" className="bg-white border border-[#ccc] px-2 py-0.5 h-6 rounded flex items-center gap-2 cursor-pointer w-24">
            <span id="dropdown-all-text" className="text-gray-700 truncate">- Tất cả -</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </div>

          <div id="order-count-indicator" className="h-full px-2 flex items-center font-semibold text-gray-700">
            Tổng số Order: <span className="ml-1 text-black font-extrabold">{activeSubTab === 'delivery' ? combinedDeliveryOrders.length : activeSubTab === 'payment' ? 32 : activeSubTab === 'takeaway' ? 5 : 1}</span>
          </div>
        </div>

        <div id="toolbar-mid" className="font-bold text-gray-700 select-all">
          Thêm Order: F2 hoặc ALT+T
        </div>

        <div id="toolbar-right" className="flex items-center gap-1">
          {/* chevron navigation button mimics */}
          <button id="chev-up-nav-btn" className="bg-white border border-[#ccc] hover:bg-gray-50 p-1 rounded h-6 w-8 flex items-center justify-center transition">
            <ChevronUp className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button id="chev-down-nav-btn" className="bg-white border border-[#ccc] hover:bg-gray-50 p-1 rounded h-6 w-8 flex items-center justify-center transition">
            <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* CUKCUK MISA Diagnostic Footer */}
      <footer id="cukcuk-footer" className="bg-[#0973B9] h-6 text-[#ebd5ff] font-sans text-[11px] flex items-center justify-between px-3 shrink-0 select-text">
        <div id="footer-db" className="font-semibold text-white/90">
          dblongviet - dblongviet.cukcuk2.misa.local
        </div>

        <div id="footer-support" className="flex items-center gap-2 font-medium">
          <span>Tổng đài tư vấn: <strong className="text-white">MISA SUPPORT</strong></span>
          <span className="text-white/45">|</span>
          <span>OVR</span>
          <span className="text-white/45">|</span>
          <span>NUM</span>
        </div>

        <div id="footer-time" className="flex items-center gap-2 font-mono">
          <span>SCRL</span>
          <span className="text-white/45">|</span>
          <span className="text-yellow-300 font-bold">04:06 CH - 17/03/2021</span>
        </div>
      </footer>
    </div>
  );
}
