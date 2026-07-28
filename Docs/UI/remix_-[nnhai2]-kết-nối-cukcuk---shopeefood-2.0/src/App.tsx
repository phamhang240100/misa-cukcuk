/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Download, 
  Bell, 
  HelpCircle, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Compass,
  Clock,
  Utensils,
  FileText,
  ShoppingBag,
  Home,
  Wallet,
  Plus,
  Store,
  QrCode,
  Globe,
  AppWindow,
  Bike,
  Gift,
  Users,
  List,
  LayoutGrid,
  Settings,
  LogOut,
  User,
  Key,
  Shield,
  Languages,
  CheckCircle2,
  Info,
  X
} from 'lucide-react';

import { SidebarMenuItem } from './types';
import { SIDEBAR_ITEMS } from './data';
import { ApplicationsView } from './components/views/ApplicationsView';
import { DashboardView } from './components/views/DashboardView';
import { InvoicesView } from './components/views/InvoicesView';
import { ThucDonView } from './components/views/ThucDonView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [activeMenuId, setActiveMenuId] = useState<string>('ung-dung');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('Nhà hàng Phở Phú Gia');
  const [shopeeFoodDeepLinkActive, setShopeeFoodDeepLinkActive] = useState<boolean>(false);
  const [shopeeFoodVayVonDeepLinkActive, setShopeeFoodVayVonDeepLinkActive] = useState<boolean>(false);

  // Custom toast notification system
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sidebar mapping of icons
  const renderSidebarIcon = (item: SidebarMenuItem) => {
    if (item.logoUrl) {
      return (
        <img 
          src={item.logoUrl} 
          alt={item.title} 
          className="w-[22px] h-[22px] rounded-md object-contain flex-shrink-0 mr-2.5 shadow-xs" 
        />
      );
    }

    if (item.isBadgeIcon) {
      const getBadgeIcon = (name: string) => {
        const iconProps = { className: "w-3.5 h-3.5 text-white" };
        switch (name) {
          case 'Store': return <Store {...iconProps} />;
          case 'QrCode': return <QrCode {...iconProps} />;
          case 'Globe': return <Globe {...iconProps} />;
          case 'AppWindow': return <AppWindow {...iconProps} />;
          case 'Bike': return <Bike {...iconProps} />;
          default: return <Store {...iconProps} />;
        }
      };

      return (
        <div className={`w-[22px] h-[22px] rounded-md ${item.badgeBg || 'bg-[#2563EB]'} flex items-center justify-center flex-shrink-0 mr-2.5 shadow-xs`}>
          {getBadgeIcon(item.iconName)}
        </div>
      );
    }

    const props = { className: "w-[18px] h-[18px] flex-shrink-0" };
    switch (item.iconName) {
      case 'Compass': return <Compass {...props} />;
      case 'Clock': return <Clock {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'Home': return <Home {...props} />;
      case 'Wallet': return <Wallet {...props} />;
      case 'Gift': return <Gift {...props} />;
      case 'Users': return <Users {...props} />;
      case 'List': return <List {...props} />;
      case 'LayoutGrid': return <LayoutGrid {...props} />;
      default: return <LayoutGrid {...props} />;
    }
  };

  // Close profile and other menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setIsProfileOpen(false);
      setIsRestaurantOpen(false);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F4] text-text-primary antialiased">
      
      {/* 💠 HEADING HEADER (height 48px, fixed top) */}
      <header 
        className="fixed top-0 left-0 right-0 z-40 bg-[#1E62EC] h-12 flex items-center justify-between px-3 select-none text-white shadow-sm border-b border-[#2563EB]/40"
      >
        {/* Left Side Header: Logo and Restaurant Selector */}
        <div className="flex items-center gap-3">
          {/* 9-dot Grid dots icon */}
          <button 
            onClick={() => triggerNotification("Chuyển đổi phân hệ phần mềm MISA...", "info")}
            className="p-1 hover:bg-[#2563EB] rounded cursor-pointer transition-colors"
            title="Danh sách dịch vụ MISA"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <circle cx="5" cy="5" r="2" />
              <circle cx="12" cy="5" r="2" />
              <circle cx="19" cy="5" r="2" />
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
              <circle cx="5" cy="19" r="2" />
              <circle cx="12" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
            </svg>
          </button>

          {/* Logo MISA CukCuk */}
          <div 
            onClick={() => {
              setActiveMenuId('ung-dung');
              triggerNotification("Quay lại màn hình Ứng dụng chính", "info");
            }}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {/* Custom high fidelity logo icon */}
            <img 
              src="https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=d2e24a57-2c35-492b-9e96-b3d9c6190ca4.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa" 
              alt="MISA CukCuk" 
              className="h-6 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-extrabold text-base tracking-tight">MISA CukCuk</span>
          </div>

          {/* Restaurant switcher dropdown select (Styled exactly as instructions) */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-md text-xs font-semibold select-none cursor-pointer border border-[#1E62EC] transition-all ml-4"
              style={{ height: '32px' }}
            >
              <span className="truncate max-w-[150px]">{selectedRestaurant}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {isRestaurantOpen && (
              <div 
                className="absolute left-4 top-10 w-52 bg-white text-text-primary rounded-lg shadow-lg py-1 border border-gray-100 z-50 animate-fade-in"
              >
                {['Nhà hàng Phở Phú Gia', 'Chi nhánh Cầu Giấy', 'Chi nhánh Hoàn Kiếm'].map((rest) => (
                  <button
                    key={rest}
                    onClick={() => {
                      setSelectedRestaurant(rest);
                      setIsRestaurantOpen(false);
                      triggerNotification(`Đã chuyển sang chi nhánh: ${rest}`, "success");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedRestaurant === rest ? 'text-[#2563EB] font-bold bg-[#F0F6FE]' : 'text-[#101828]'
                    }`}
                  >
                    {rest}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Header Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => triggerNotification("Thay đổi ngôn ngữ hiển thị hệ thống", "info")}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium hover:bg-[#2563EB] rounded cursor-pointer"
              style={{ height: '32px' }}
            >
              <span>Tiếng Việt</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>

          {/* Download apps button with Notification Badge 1 */}
          <button 
            onClick={() => triggerNotification("Tải ứng dụng MISA CukCuk cho điện thoại & tablet", "info")}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#2563EB] rounded-lg cursor-pointer relative"
            title="Tải ứng dụng"
          >
            <Download className="w-[18px] h-[18px]" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center border border-[#1E62EC]">
              1
            </span>
          </button>

          {/* Bell Icon Notification */}
          <button 
            onClick={() => triggerNotification("Chưa có thông báo hệ thống mới nào", "info")}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#2563EB] rounded-lg cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>

          {/* Help Center */}
          <button 
            onClick={() => triggerNotification("Đang mở Trung tâm Trợ giúp MISA CukCuk...", "info")}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#2563EB] rounded-lg cursor-pointer"
            title="Trợ giúp"
          >
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>

          {/* Settings gear icon on Header as per instructions */}
          <button 
            onClick={() => {
              setActiveMenuId('settings');
              triggerNotification("Mở thiết lập cấu hình hệ thống", "info");
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
              activeMenuId === 'settings' ? 'bg-[#1D4ED8]' : 'hover:bg-[#2563EB]'
            }`}
            title="Thiết lập hệ thống"
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>

          {/* More options triple dot */}
          <button 
            onClick={() => triggerNotification("Hiển thị tính năng mở rộng khác...", "info")}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#2563EB] rounded-lg cursor-pointer"
          >
            <MoreVertical className="w-[18px] h-[18px]" />
          </button>

          {/* User Profile Avatar (Displays picture, click to toggle dropdown profile card) */}
          <div className="relative ml-1" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-white hover:border-[#F0F6FE] focus:outline-none transition-all cursor-pointer shadow"
            >
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120" 
                alt="User profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Profile Dropdown Card (Formulated as requested by guidelines) */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50 text-text-primary animate-scale-up"
              >
                {/* Profile header with user picture & details centered */}
                <div className="flex flex-col items-center px-4 py-3 border-b border-gray-100 select-none">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120" 
                      alt="User profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="font-bold text-sm text-[#101828]">Nguyễn Thị Thanh Hà</div>
                  <div className="text-[11px] text-[#717680] mt-0.5 font-medium">cukcuk@software.misa.com.vn</div>
                </div>

                {/* Profile menus list */}
                <div className="py-1">
                  <button 
                    onClick={() => triggerNotification("Chức năng đổi mật khẩu đang được bảo trì", "info")}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#101828] hover:bg-gray-50 transition-colors font-medium text-left cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-[#717680]" />
                    Đổi mật khẩu
                  </button>
                  <button 
                    onClick={() => {
                      setActiveMenuId('settings');
                      triggerNotification("Mở trang Thiết lập tài khoản", "info");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#101828] hover:bg-gray-50 transition-colors font-medium text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#717680]" />
                    Thiết lập tài khoản
                  </button>
                  <button 
                    onClick={() => {
                      setActiveMenuId('settings');
                      triggerNotification("Mở trang Thiết lập bảo mật", "info");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#101828] hover:bg-gray-50 transition-colors font-medium text-left cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-[#717680]" />
                    Thiết lập bảo mật
                  </button>
                  <button 
                    onClick={() => triggerNotification("Tính năng đổi ngôn ngữ trong cài đặt cá nhân", "info")}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#101828] hover:bg-gray-50 transition-colors font-medium text-left cursor-pointer"
                  >
                    <Languages className="w-4 h-4 text-[#717680]" />
                    Đổi ngôn ngữ
                  </button>
                </div>

                {/* Logout action */}
                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button 
                    onClick={() => triggerNotification("Phiên làm việc thử nghiệm - Không thể đăng xuất", "info")}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-semibold text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main container holding Sidebar and Main Content */}
      <div className="flex-1 flex pt-12 min-h-0">
        
        {/* 💠 SIDEBAR (occupies full height minus header, collapsible) */}
        <aside 
          className="flex-shrink-0 bg-white border-r border-[#E9EAEB] flex flex-col justify-between sticky top-12 bottom-0 overflow-y-auto select-none transition-all duration-300"
          style={{ width: isSidebarCollapsed ? '64px' : '220px', height: 'calc(100vh - 48px)' }}
        >
          {/* Sidebar Menu vertical items list */}
          <div className="py-2 space-y-0.5">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = activeMenuId === item.id || (item.id === 'shopee-food' && activeMenuId === 'ung-dung' && shopeeFoodDeepLinkActive);
              return (
                <div key={item.id} className="w-full">
                  {/* Section Header if present */}
                  {!isSidebarCollapsed && item.sectionHeader && (
                    <div className="flex items-center justify-between px-3 pt-3.5 pb-1.5 select-none">
                      <span className="text-[11px] font-bold text-[#98A2B3] tracking-wider uppercase">
                        {item.sectionHeader}
                      </span>
                      {item.hasPlusButton && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerNotification("Thêm kênh bán hàng mới", "info");
                          }}
                          className="p-0.5 text-[#98A2B3] hover:text-[#101828] rounded cursor-pointer transition-colors"
                          title="Thêm kênh bán hàng"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Divider if specified */}
                  {item.isDividerBefore && (
                    <div className="border-t border-[#F2F4F7] my-2 mx-3" />
                  )}

                  <button
                    onClick={() => {
                      if (item.id === 'shopee-food' || item.id === 'food-delivery') {
                        setActiveMenuId('ung-dung');
                        setShopeeFoodDeepLinkActive(true);
                        triggerNotification(`Kênh bán hàng: ${item.title}`, "info");
                      } else {
                        setActiveMenuId(item.id);
                        triggerNotification(`Mở phân hệ: ${item.title}`, "info");
                      }
                    }}
                    className={`w-full flex items-center text-left py-2 px-3 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#F0F6FE] text-[#2563EB] font-semibold border-l-[3px] border-[#2563EB]' 
                        : 'text-[#101828] hover:bg-gray-50 hover:text-blue-600 font-medium border-l-[3px] border-transparent'
                    }`}
                    style={{ height: '38px' }}
                    title={item.title}
                  >
                    {/* Left icon with active color overrides */}
                    <div className={`transition-colors ${!item.isBadgeIcon ? (isActive ? 'text-[#2563EB] mr-2.5' : 'text-[#667085] mr-2.5') : ''}`}>
                      {renderSidebarIcon(item)}
                    </div>

                    {/* Item text (hidden when collapsed) */}
                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1 text-[13px]">
                        {item.title}
                      </span>
                    )}

                    {/* Right Indicator arrow (hidden when collapsed) */}
                    {!isSidebarCollapsed && item.hasArrow && (
                      <ChevronDown className="w-3.5 h-3.5 text-[#98A2B3] flex-shrink-0 ml-1.5" />
                    )}
                  </button>

                  {/* Submenu lists when the item has children and is active and NOT collapsed */}
                  {!isSidebarCollapsed && isActive && item.children && (
                    <div className="bg-gray-50 py-1 border-l-2 border-blue-200 ml-4 animate-fade-in">
                      {item.children.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => triggerNotification(`Mở tính năng phụ: ${sub}`, "info")}
                          className="w-full text-left pl-6 pr-3 py-1.5 text-[11px] text-[#717680] hover:text-[#2563EB] hover:bg-blue-50 transition-colors font-medium truncate"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Sidebar Collapse/Expand Toggle arrow as per screenshot */}
          <div className="p-2.5 border-t border-[#E9EAEB] flex justify-end bg-white">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-8 h-8 rounded-lg border border-[#D5D7DA] hover:border-[#2563EB] hover:bg-[#F0F6FE] flex items-center justify-center text-[#667085] hover:text-[#2563EB] transition-all cursor-pointer shadow-xs"
              title={isSidebarCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </aside>

        {/* 💠 MAIN CONTENT AREA */}
        <main 
          className="flex-1 overflow-y-auto bg-[#F0F2F4]"
          style={{ height: 'calc(100vh - 48px)', padding: '0px' }}
        >
          <div className="h-full">
            {activeMenuId === 'ung-dung' && (
              <ApplicationsView 
                onNotification={triggerNotification} 
                shopeeFoodDeepLinkActive={shopeeFoodDeepLinkActive}
                onResetDeepLink={() => setShopeeFoodDeepLinkActive(false)}
                shopeeFoodVayVonDeepLinkActive={shopeeFoodVayVonDeepLinkActive}
                onResetVayVonDeepLink={() => setShopeeFoodVayVonDeepLinkActive(false)}
              />
            )}
            
            {activeMenuId === 'tong-quan' && (
              <DashboardView onNotification={triggerNotification} />
            )}

            {activeMenuId === 'hd-ban-hang' && (
              <InvoicesView onNotification={triggerNotification} />
            )}

            {activeMenuId === 'thuc-don' && (
              <ThucDonView onNotification={triggerNotification} />
            )}

            {activeMenuId === 'settings' && (
              <SettingsView onNotification={triggerNotification} />
            )}

            {/* Other unimplemented modules - showing high quality placeholders */}
            {activeMenuId !== 'ung-dung' && 
             activeMenuId !== 'tong-quan' && 
             activeMenuId !== 'hd-ban-hang' && 
             activeMenuId !== 'thuc-don' && 
             activeMenuId !== 'settings' && (
              <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-sm p-12 text-center border-2 border-white">
                <div className="w-16 h-16 rounded-full bg-[#F0F6FE] text-[#2563EB] flex items-center justify-center mb-4">
                  <LayoutGrid className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-[#101828]">Phân hệ đang được hoàn thiện</h3>
                <p className="text-xs text-[#717680] max-w-md mt-1 leading-relaxed">
                  Phân hệ này hiện đang trong quá trình đồng bộ và phát triển giao diện. Bạn vui lòng trải nghiệm phân hệ <strong>Ứng dụng</strong> (nhấp vào mục "Ứng dụng"), <strong>Tổng quan</strong>, <strong>Hóa đơn bán hàng</strong>, <strong>Thực đơn</strong> hoặc nhấp biểu tượng bánh răng trên đầu để xem <strong>Thiết lập</strong>.
                </p>
                <button
                  onClick={() => setActiveMenuId('ung-dung')}
                  className="mt-6 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 select-none cursor-pointer"
                  style={{ height: '32px', borderRadius: '8px' }}
                >
                  Trải nghiệm Ứng dụng tích hợp
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 💠 SLIDING POPUP TOAST SYSTEM */}
      {toast && (
        <div 
          className="fixed top-14 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl animate-fade-in max-w-sm md:max-w-md w-max border border-white/10"
          style={{ zIndex: 10000 }}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs font-semibold leading-normal flex-1">
            {toast.message}
          </div>
          <button 
            onClick={() => setToast(null)} 
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
