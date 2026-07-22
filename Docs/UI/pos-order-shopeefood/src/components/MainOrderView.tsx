import React from 'react';
import { 
  Home, 
  Plus, 
  Globe, 
  Cloud, 
  RefreshCw, 
  Bell, 
  Clock, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Menu,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';

interface MainOrderViewProps {
  orders?: Order[];
  grabUnconfirmedCount: number;
  shopeeUnconfirmedCount: number;
  onNavigateToView: (view: 'main' | 'grab' | 'shopeefood') => void;
  onSimulateNewOrder: (channel: 'Grab' | 'ShopeeFood') => void;
  notifications: any[];
  onNotificationClick: (notif: any) => void;
  onConfirmOrder?: (orderId: string) => void;
  onCompleteOrder?: (orderId: string) => void;
  onDeleteOrder?: (orderId: string, reason?: string) => void;
  setShopeeSelectedOrderId?: (id: string | null) => void;
  setGrabSelectedOrderId?: (id: string | null) => void;
  setShopeeActiveTab?: (tab: any) => void;
  setGrabActiveTab?: (tab: any) => void;
}

export default function MainOrderView({
  orders = [],
  grabUnconfirmedCount,
  shopeeUnconfirmedCount,
  onNavigateToView,
  onSimulateNewOrder,
  notifications,
  onNotificationClick,
  onConfirmOrder,
  onCompleteOrder,
  onDeleteOrder,
  setShopeeSelectedOrderId,
  setGrabSelectedOrderId,
  setShopeeActiveTab,
  setGrabActiveTab
}: MainOrderViewProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(true);
  const [activeSubTab, setActiveSubTab] = React.useState<string>('payment');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const deliveryOrders = React.useMemo(() => {
    return orders.filter(order => order.status === 'unconfirmed' || order.status === 'confirmed');
  }, [orders]);

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
          <div id="active-order-tab" className="bg-transparent text-white h-full flex items-center px-4 font-bold border-b-2 border-white text-sm">
            <span id="label-order">Order</span>
          </div>

          {/* Tab: Sơ đồ */}
          <button id="sodo-nav-btn" className="hover:bg-[#00497D] h-full px-4 flex items-center text-white/90 text-sm transition">
            <span id="label-sodo">Sơ đồ</span>
          </button>
        </div>

        {/* Header Center and Actions */}
        <div id="header-right" className="flex items-center h-full gap-1">
          {/* Green plus order button */}
          <button id="add-order-btn" className="flex items-center gap-1 bg-transparent hover:bg-white/10 px-3 py-1.5 rounded text-white font-bold text-xs transition mr-2 uppercase border border-white/30">
            <Plus className="w-4 h-4" />
            <span>Order</span>
          </button>

          {/* Dropdown switch list button */}
          <button 
            id="menu-toggle-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`h-full px-3 flex items-center hover:bg-[#00497D] transition relative ${dropdownOpen ? 'bg-[#00497D]' : ''}`}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Vertical divider */}
          <div id="divider-right" className="h-5 w-px bg-white/20 mx-1"></div>

          {/* Web notification glove icon */}
          <button id="globe-btn" className="hover:bg-[#00497D] p-2 rounded relative transition">
            <Globe className="w-4 h-4" />
            <span id="badge-globe" className="absolute top-1 right-1 bg-red-600 text-[9px] font-bold text-white leading-none rounded-full min-w-4 h-4 flex items-center justify-center p-0.5">9</span>
          </button>

          {/* Cloud Upload Icon */}
          <button id="cloud-sync-btn" className="hover:bg-[#00497D] p-2 rounded transition">
            <Cloud className="w-4 h-4" />
          </button>

          {/* Refresh/Exchange icon */}
          <button id="exchange-sync-btn" className="hover:bg-[#00497D] p-2 rounded transition">
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Alert / Bell Notification icon with custom dropdown */}
          <div className="relative">
            <button 
              id="bell-alert-btn" 
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="hover:bg-[#00497D] p-2 rounded relative transition"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span id="badge-bell" className="absolute top-1 right-1 bg-red-600 text-[9px] font-bold text-white leading-none rounded-full w-4 h-4 flex items-center justify-center p-0.5 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 top-11 z-50 w-[360px] bg-white text-gray-900 rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-3 bg-[#0973B9] text-white font-bold flex items-center justify-between">
                  <span>Thông báo đơn hàng ({unreadCount})</span>
                  <button onClick={() => setShowNotificationsDropdown(false)} className="text-white hover:text-gray-200">✕</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 font-medium">Không có thông báo mới.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          onNotificationClick(notif);
                          setShowNotificationsDropdown(false);
                        }}
                        className={`p-3 border-b border-gray-100 hover:bg-[#F0F6FE] cursor-pointer transition-colors flex gap-2.5 items-start ${
                          notif.read ? 'bg-white opacity-75' : 'bg-[#F0F6FE]'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-[#0973B9] mt-1.5 shrink-0" style={{ visibility: notif.read ? 'hidden' : 'visible' }} />
                        <div className="flex-1 flex flex-col gap-0.5">
                          <span className="text-xs font-semibold leading-normal text-gray-900">{notif.text}</span>
                          <span className="text-[10px] text-gray-400 font-mono font-bold">{notif.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Clock icon */}
          <button id="clock-btn" className="hover:bg-[#00497D] p-2 rounded transition">
            <Clock className="w-4 h-4" />
          </button>

          {/* User Profile */}
          <button id="user-profile-btn" className="hover:bg-[#00497D] p-2 rounded transition flex items-center justify-center">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Sub-Header bar / Filters selection */}
      <div id="filters-navbar" className="bg-white border-b border-gray-200 h-10 px-2 flex items-center justify-between shrink-0">
        <div id="sub-tabs-left" className="flex items-center gap-1.5 h-full py-1">
          <button
            id="tab-unpaid"
            onClick={() => setActiveSubTab('payment')}
            className={`h-full px-4 flex items-center justify-center rounded font-semibold text-center border transition ${
              activeSubTab === 'payment'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Chờ thanh toán (0)
          </button>

          <button
            id="tab-takeaway"
            onClick={() => setActiveSubTab('takeaway')}
            className={`h-full px-4 flex items-center justify-center rounded font-semibold text-center border transition ${
              activeSubTab === 'takeaway'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Mang về (0)
          </button>

          <button
            id="tab-delivery"
            onClick={() => setActiveSubTab('delivery')}
            className={`h-full px-4 flex items-center justify-center rounded font-semibold text-center border transition ${
              activeSubTab === 'delivery'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Chờ giao hàng ({deliveryOrders.length})
          </button>

          <button
            id="tab-reservation"
            onClick={() => setActiveSubTab('reservation')}
            className={`h-full px-4 flex items-center justify-center rounded font-semibold text-center border transition ${
              activeSubTab === 'reservation'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Đặt trước (0)
          </button>
        </div>

        <div id="sub-filters-right" className="flex items-center gap-2">
          {/* Find Table select box */}
          <div id="find-table-search" className="relative flex items-center bg-white border border-[#ccc] rounded px-2 py-1 h-7 text-xs w-28">
            <span id="find-table-text" className="text-gray-500 mr-auto truncate">Tìm bàn</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </div>

          {/* Search bar */}
          <div id="search-bar-input-container" className="relative flex items-center bg-white border border-[#ccc] rounded px-2 py-1 h-7 w-44">
            <input 
              id="search-input"
              type="text" 
              placeholder="Tìm theo..." 
              className="outline-none text-[11px] w-full text-gray-700 pr-4"
              disabled
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-1.5" />
          </div>
        </div>
      </div>

      {/* Main Workspace Body with Dropdown Sidebar Layout */}
      <div id="mainscreen-body" className="flex-1 relative flex overflow-hidden">
        
        {/* Left Side: Main Empty placeholder exactly as in Image 1, or delivery orders grid matching user's image */}
        {activeSubTab === 'delivery' ? (
          <div id="delivery-workspace" className="flex-1 flex flex-col bg-gray-50 p-4 overflow-y-auto h-full text-left">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[#0973B9] font-bold text-sm flex items-center gap-2">
                <span>📋 ĐƠN HÀNG CHỜ GIAO HÀNG ({deliveryOrders.length})</span>
                <span className="text-[11px] text-gray-500 font-normal italic">(Tự động nhận diện đối tác thứ ba)</span>
              </h3>
              
              <button 
                onClick={() => onSimulateNewOrder('ShopeeFood')}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1 rounded text-[11px] flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <span>➕ Nhận đơn ShopeeFood giả lập</span>
              </button>
            </div>

            {deliveryOrders.length === 0 ? (
              <div id="empty-delivery-workspace" className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-8 border border-dashed border-gray-300 rounded bg-white">
                <p className="font-semibold text-sm">Chưa có đơn hàng trực tuyến nào</p>
                <p className="text-xs text-gray-400 mt-1">Bấm nút "Nhận đơn ShopeeFood giả lập" hoặc click nút "Click vào đây" bên dưới để tạo đơn thử nghiệm.</p>
              </div>
            ) : (
              <div id="delivery-orders-grid" className="flex flex-wrap gap-2 pb-4">
                {deliveryOrders.map((order) => {
                  // Determine minutes remaining for tag mock realism
                  const isGrab = order.channel === 'Grab';
                  const remainingMinutes = order.code === 'GF-720' ? 16 : (order.code === 'SPF-901' ? 25 : (order.code === 'SPF-502' ? 12 : 30));
                  
                  // Edit click details routing
                  const handleEditOrder = () => {
                    onNavigateToView(isGrab ? 'grab' : 'shopeefood');
                    if (isGrab) {
                      if (setGrabActiveTab) setGrabActiveTab(order.status);
                      if (setGrabSelectedOrderId) setGrabSelectedOrderId(order.id);
                    } else {
                      if (setShopeeActiveTab) setShopeeActiveTab(order.status);
                      if (setShopeeSelectedOrderId) setShopeeSelectedOrderId(order.id);
                    }
                  };

                  const handleDispatchCourier = () => {
                    alert(`🚀 Đang liên kết API để kết nối với đối tác vận chuyển ${order.channel} tìm tài xế cho đơn hàng ${order.code}!`);
                  };

                  return (
                    <div 
                      key={order.id}
                      id={`tag-order-${order.code}`}
                      className="bg-white border border-gray-300 rounded overflow-hidden shadow-md flex flex-col w-[220px] shrink-0 text-xs text-gray-800 hover:shadow-lg hover:border-blue-400 transition"
                    >
                      {/* Top Header Bar */}
                      <div className="bg-[#0973B9] text-white px-3 py-1.5 flex justify-between items-center font-bold">
                        <span className="font-bold text-sm">{order.code}</span>
                        <span className="text-[11px] font-normal">Còn {remainingMinutes} phút</span>
                      </div>
                      
                      {/* Driver & Partner row */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-white">
                        <div className="flex items-center gap-1">
                          {isGrab ? (
                            <span className="text-green-600 font-extrabold text-[13px] tracking-tight">Grab</span>
                          ) : (
                            <span className="text-[#f26522] font-extrabold text-[13px] tracking-tight">ShopeeFood</span>
                          )}
                        </div>
                        <span className="text-[#d8540c] font-bold text-sm truncate max-w-[110px]" title={order.driverName}>
                          {order.driverName ? order.driverName.split(' ')[0] : 'Chưa có'}
                        </span>
                        <div className="text-[#0973B9] shrink-0">
                          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 15c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12.3-6.4c.3-.5.7-.9 1.2-1.1L20 7l-1.5-1.5-1.5 1.5c-.2.5-.3 1.1-.3 1.6H13V7h-2v1.6H8.7c0-.5-.1-1.1-.3-1.6L6.9 5.5 5.4 7l1.5.5c.5.2.9.6 1.2 1.1H5v3h14V8.6h-2.7z"/>
                          </svg>
                        </div>
                      </div>
                      
                      {/* Phone & Date Time row */}
                      <div className="grid grid-cols-2 border-b border-gray-100 text-center bg-white">
                        <div className="border-r border-gray-100 py-1.5 px-2 flex items-center justify-center font-bold text-gray-700 text-[12.5px] font-mono">
                          {order.driverPhone ? order.driverPhone.replace(/\s+/g, '') : 'Chưa có SĐT'}
                        </div>
                        <div className="py-1 px-1 flex flex-col justify-center items-center text-[10px] leading-tight text-gray-600 font-mono font-medium">
                          <span className="font-bold text-gray-800">{order.orderTime.split(' - ')[0]}</span>
                          <span className="text-[9px] text-gray-400">{order.orderTime.split(' - ')[1]}</span>
                        </div>
                      </div>
                      
                      {/* 4 Action block row exactly matching POS image style */}
                      <div className="grid grid-cols-4 bg-[#f4f5f7] border-t border-gray-100 text-center text-sm font-bold divide-x divide-gray-200">
                        {/* 1. Green Driver Motor Rider icon */}
                        <button 
                          onClick={() => {
                            if (onCompleteOrder) onCompleteOrder(order.id);
                          }}
                          className="py-2 hover:bg-emerald-50 transition flex items-center justify-center text-green-600"
                          title="Giao đi / Hoàn thành"
                        >
                          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 15c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12.3-6.4c.3-.5.7-.9 1.2-1.1L20 7l-1.5-1.5-1.5 1.5c-.2.5-.3 1.1-.3 1.6H13V7h-2v1.6H8.7c0-.5-.1-1.1-.3-1.6L6.9 5.5 5.4 7l1.5.5c.5.2.9.6 1.2 1.1H5v3h14V8.6h-2.7z"/>
                          </svg>
                        </button>
                        
                        {/* 2. Pencil Icon */}
                        <button 
                          onClick={handleEditOrder}
                          className="py-2 hover:bg-gray-150 transition flex items-center justify-center text-gray-500"
                          title="Sửa / Chi tiết đơn hàng"
                        >
                          <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        
                        {/* 3. Paper Airplane / Courier call icon */}
                        <button 
                          onClick={handleDispatchCourier}
                          className="py-2 hover:bg-blue-50 transition flex items-center justify-center text-[#0973B9]"
                          title="Gọi shipper đối tác"
                        >
                          <svg className="w-4.5 h-4.5 transform rotate-45" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                          </svg>
                        </button>
                        
                        {/* 4. Delete X icon */}
                        <button 
                          onClick={() => {
                            if (onDeleteOrder) onDeleteOrder(order.id, 'Hủy đơn từ màn hình Chờ giao hàng');
                          }}
                          className="py-2 hover:bg-rose-50 transition flex items-center justify-center text-rose-500"
                          title="Từ chối / Hủy đơn"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div id="empty-workspace" className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 relative">
            <div id="logo-fork-spoon-circle" className="w-40 h-40 rounded-full border-8 border-gray-300/60 flex items-center justify-center mb-6 text-gray-300/80">
              {/* Custom SVG inside the circle representing Spoon & Fork */}
              <svg id="fork-spoon-svg" className="w-20 h-20 fill-current opacity-70" viewBox="0 0 24 24">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm10-7h-3c-1.1 0-2 .9-2 2v5c0 1.66 1.34 3 3 3v10h2V12c1.66 0 3-1.34 3-3V4c0-2-2-2-2-2z" />
              </svg>
            </div>
            <p id="cooking-placeholder-text" className="text-base text-gray-500/90 font-medium">
              Nhà hàng chưa có order nào, vui lòng <strong className="text-gray-700">Thêm order</strong> để ghi món cho khách
            </p>
            <div id="action-prompt-tip" className="mt-2 text-xs text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full" onClick={() => onSimulateNewOrder('ShopeeFood')}>
              <span>💡 Click vào đây để nhận đơn từ ứng dụng giao hàng ShopeeFood!</span>
            </div>
          </div>
        )}

        {/* Right Side: Popover Dropdown (Matches dropdown menu from Image 1) */}
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
                <span id="badge-grab-count" className="bg-red-500 text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                  {grabUnconfirmedCount}
                </span>
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
                <span id="badge-shopee-count" className="bg-orange-600 text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                  {shopeeUnconfirmedCount}
                </span>

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
            Tổng số Order: <span className="ml-1 text-black font-extrabold">0</span>
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
