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
  Grid,
  TrendingUp,
  FileX,
  FileText,
  LayoutGrid,
  Settings,
  LogOut,
  User,
  Key,
  Shield,
  Languages,
  CheckCircle2,
  Info,
  X,
  Minus,
  Maximize2,
  Sparkles,
  Check,
  ArrowRight,
  Plus,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

  // Global onboarding states
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_onboarding_steps_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOnboardingCollapsed, setIsOnboardingCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_onboarding_collapsed_v3');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [onboardingBubbleState, setOnboardingBubbleState] = useState<'chat_bubble' | 'small_window'>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_onboarding_bubble_state_v3');
      return (saved as 'chat_bubble' | 'small_window') || 'small_window';
    } catch {
      return 'small_window';
    }
  });

  const [showTableModal, setShowTableModal] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  // Interactive table configuration state
  const [tables, setTables] = useState([
    { id: '1', name: 'Bàn 1', area: 'Tầng 1', status: 'empty', seats: 4 },
    { id: '2', name: 'Bàn 2', area: 'Tầng 1', status: 'occupied', seats: 2 },
    { id: '3', name: 'Bàn 3', area: 'Tầng 1', status: 'empty', seats: 6 },
    { id: '4', name: 'Bàn 4', area: 'Tầng 1', status: 'reserved', seats: 4 },
    { id: '5', name: 'Bàn VIP 1', area: 'Tầng 2', status: 'empty', seats: 10 },
    { id: '6', name: 'Bàn VIP 2', area: 'Tầng 2', status: 'occupied', seats: 8 },
  ]);
  const [activeArea, setActiveArea] = useState<'Tầng 1' | 'Tầng 2'>('Tầng 1');

  // Synchronize onboarding states with localStorage
  useEffect(() => {
    localStorage.setItem('cukcuk_onboarding_steps_v2', JSON.stringify(completedSteps));
  }, [completedSteps]);

  useEffect(() => {
    localStorage.setItem('cukcuk_onboarding_collapsed_v3', String(isOnboardingCollapsed));
  }, [isOnboardingCollapsed]);

  useEffect(() => {
    localStorage.setItem('cukcuk_onboarding_bubble_state_v3', onboardingBubbleState);
  }, [onboardingBubbleState]);

  // Toggle step
  const toggleStep = (stepIndex: number) => {
    let newSteps = [...completedSteps];
    if (newSteps.includes(stepIndex)) {
      newSteps = newSteps.filter(s => s !== stepIndex);
    } else {
      newSteps.push(stepIndex);
      // Burst confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
      triggerNotification(`Đã đánh dấu hoàn thành Bước ${stepIndex}`, "success");
    }
    setCompletedSteps(newSteps);

    // If 7 completed, grand celebrate!
    if (newSteps.length === 7) {
      setTimeout(() => {
        triggerGrandConfetti();
        triggerNotification("Chúc mừng! Bạn đã hoàn thành toàn bộ 7 bước thiết lập ban đầu!", "success");
      }, 300);
    }
  };

  const triggerGrandConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Steps description and actions
  const stepsData = [
    {
      index: 1,
      title: 'Thiết lập phương pháp tính thuế',
      desc: 'Cấu hình phương pháp tính thuế giá trị gia tăng (GTGT) và thuế suất áp dụng cho món ăn.',
      icon: <Percent className="w-4 h-4 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      actionLabel: 'Đến Thiết lập',
      action: () => {
        setActiveMenuId('settings');
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('chat_bubble');
        triggerNotification("Đã chuyển hướng đến Thiết lập phương pháp tính thuế và thu gọn hướng dẫn", "success");
      }
    },
    {
      index: 2,
      title: 'Khởi tạo thực đơn',
      desc: 'Khai báo nhóm thực đơn, danh mục món ăn, đồ uống kèm đơn giá, đơn vị tính và hình ảnh.',
      icon: <UtensilsCrossed className="w-4 h-4 text-orange-600" />,
      bgColor: 'bg-orange-50',
      actionLabel: 'Đến Thực đơn',
      action: () => {
        setActiveMenuId('thuc-don');
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('chat_bubble');
        triggerNotification("Đã chuyển hướng đến quản lý Thực đơn và thu gọn hướng dẫn", "success");
      }
    },
    {
      index: 3,
      title: 'Thiết lập sơ đồ bàn',
      desc: 'Sắp xếp phòng bàn, khu vực kinh doanh tầng 1, tầng 2 phù hợp với không gian thực tế.',
      icon: <Grid className="w-4 h-4 text-blue-600" />,
      bgColor: 'bg-blue-50',
      actionLabel: 'Sắp xếp bàn',
      action: () => {
        setShowTableModal(true);
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('chat_bubble');
      }
    },
    {
      index: 4,
      title: 'Thêm nhân viên & phân quyền',
      desc: 'Khai báo danh sách nhân viên phục vụ, thu ngân, bếp và cấu hình quyền hạn truy cập.',
      icon: <User className="w-4 h-4 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      actionLabel: 'Đến Nhân viên',
      action: () => {
        setActiveMenuId('settings');
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('chat_bubble');
        triggerNotification("Đã chuyển hướng đến cài đặt Nhân viên & Phân quyền và thu gọn hướng dẫn", "success");
      }
    },
    {
      index: 5,
      title: 'Thiết lập phương thức thanh toán',
      desc: 'Khai báo các tài khoản nhận tiền chuyển khoản QR Code, tiền mặt hoặc liên kết ví điện tử.',
      icon: <CreditCard className="w-4 h-4 text-pink-600" />,
      bgColor: 'bg-pink-50',
      actionLabel: 'Đến Thanh toán',
      action: () => {
        setActiveMenuId('settings');
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('chat_bubble');
        triggerNotification("Đã chuyển hướng đến thiết lập Phương thức thanh toán và thu gọn hướng dẫn", "success");
      }
    },
    {
      index: 6,
      title: 'Kết nối hóa đơn điện tử / Chữ ký số meInvoice',
      desc: 'Đồng bộ dữ liệu bán hàng trực tiếp và phát hành hóa đơn có mã của Cơ quan Thuế.',
      icon: <FileText className="w-4 h-4 text-amber-600" />,
      bgColor: 'bg-amber-50',
      actionLabel: 'Kết nối ngay',
      action: () => {
        setActiveMenuId('ung-dung');
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('chat_bubble');
        triggerNotification("Đã mở danh sách ứng dụng, chọn meInvoice để kết nối", "success");
      }
    },
    {
      index: 7,
      title: 'Cài đặt phần mềm bán hàng',
      desc: 'Tải bộ cài đặt phần mềm CukCuk bán hàng cho máy tính, điện thoại di động và máy tính bảng.',
      icon: <Download className="w-4 h-4 text-rose-600" />,
      bgColor: 'bg-rose-50',
      actionLabel: 'Tải phần mềm',
      action: () => {
        setShowDownloadModal(true);
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('chat_bubble');
      }
    }
  ];

  const totalSteps = stepsData.length;
  const completedCount = completedSteps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  // Sidebar mapping of icons
  const renderSidebarIcon = (iconName: string) => {
    const props = { className: "w-[18px] h-[18px] flex-shrink-0" };
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'FileDown': return <FileDown {...props} />;
      case 'FileUp': return <FileUp {...props} />;
      case 'ShoppingCart': return <ShoppingCart {...props} />;
      case 'Package': return <Package {...props} />;
      case 'Wallet': return <Wallet {...props} />;
      case 'CreditCard': return <CreditCard {...props} />;
      case 'PiggyBank': return <PiggyBank {...props} />;
      case 'Percent': return <Percent {...props} />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} />;
      case 'Grid': return <Grid {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'FileX': return <FileX {...props} />;
      case 'Settings': return <Settings {...props} />;
      case 'FileText': return <FileText {...props} />;
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
            {/* Custom logo icon */}
            <img 
              src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=2e0e75f9-784b-48d9-b545-ce17762135dc.png&isTemp=true&tenantCode=misa" 
              alt="MISA CukCuk" 
              className="h-6 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-extrabold text-base tracking-tight">MISA CukCuk</span>
          </div>

          {/* Restaurant switcher dropdown select */}
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
            onClick={() => {
              setShowDownloadModal(true);
              triggerNotification("Tải ứng dụng MISA CukCuk cho điện thoại & tablet", "info");
            }}
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

          {/* Settings gear icon on Header */}
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

          {/* User Profile Avatar */}
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

            {/* Profile Dropdown Card */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50 text-text-primary animate-scale-up"
              >
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
        
        {/* 💠 SIDEBAR */}
        <aside 
          className="flex-shrink-0 bg-white border-r border-[#E9EAEB] flex flex-col justify-between sticky top-12 bottom-0 overflow-y-auto select-none transition-all duration-300"
          style={{ width: isSidebarCollapsed ? '64px' : '220px', height: 'calc(100vh - 48px)' }}
        >
          <div className="py-2 space-y-0.5">
            {SIDEBAR_ITEMS
              .filter(item => item.id !== 'thiet-lap-ht')
              .map((item) => {
                const isActive = activeMenuId === item.id;
                return (
                  <div key={item.id} className="w-full">
                    <button
                      onClick={() => {
                        if (item.id === 'huy-hoa-don') {
                          setActiveMenuId('ung-dung');
                          setShopeeFoodDeepLinkActive(true);
                          triggerNotification(`Hủy hóa đơn - Kết nối ShopeeFood (Đã kết nối), tab Thực đơn`, "info");
                        } else if (item.id === 'ket-noi-vay-von') {
                          setActiveMenuId('ung-dung');
                          setShopeeFoodVayVonDeepLinkActive(true);
                          triggerNotification(`Kết nối vay vốn - Mở đồng bộ thực đơn ShopeeFood hoàn tất`, "success");
                        } else {
                          setActiveMenuId(item.id);
                          triggerNotification(`Mở phân hệ: ${item.title}`, "info");
                        }
                      }}
                      className={`w-full flex items-center text-left py-2 px-3 text-body-reg transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#F0F6FE] text-[#2563EB] font-semibold border-l-4 border-[#2563EB] rounded-l-none' 
                          : 'text-[#101828] hover:bg-gray-50 hover:text-blue-600 font-medium'
                      }`}
                      style={{ height: '36px' }}
                      title={item.title}
                    >
                      <div className={`mr-2.5 transition-colors ${isActive ? 'text-[#2563EB]' : 'text-[#717680]'}`}>
                        {renderSidebarIcon(item.iconName)}
                      </div>

                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1 text-xs">
                          {item.title}
                        </span>
                      )}

                      {!isSidebarCollapsed && item.hasArrow && (
                        <ChevronDown className="w-3 h-3 text-[#717680] opacity-60" />
                      )}
                    </button>

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

          <div className="p-2 border-t border-[#E9EAEB] flex justify-end bg-white">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-8 h-8 rounded-lg border border-[#D5D7DA] hover:border-[#2563EB] hover:bg-[#F0F6FE] flex items-center justify-center text-[#717680] hover:text-[#2563EB] transition-all cursor-pointer shadow-sm"
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
              <DashboardView 
                onNotification={triggerNotification} 
                onNavigate={(menuId) => setActiveMenuId(menuId)}
                completedSteps={completedSteps}
                setCompletedSteps={setCompletedSteps}
                isOnboardingCollapsed={isOnboardingCollapsed}
                setIsOnboardingCollapsed={setIsOnboardingCollapsed}
                onboardingBubbleState={onboardingBubbleState}
                setOnboardingBubbleState={setOnboardingBubbleState}
                stepsData={stepsData}
                showTableModal={showTableModal}
                setShowTableModal={setShowTableModal}
                showDownloadModal={showDownloadModal}
                setShowDownloadModal={setShowDownloadModal}
                tables={tables}
                setTables={setTables}
                activeArea={activeArea}
                setActiveArea={setActiveArea}
              />
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
                  Phân hệ này hiện đang trong quá trình đồng bộ và phát triển giao diện. Bạn vui lòng trải nghiệm phân hệ <strong>Ứng dụng</strong> (nhấp vào mục "Ứng dụng"), <strong>Bàn làm việc</strong>, <strong>Hóa đơn bán hàng</strong>, <strong>Thực đơn</strong> hoặc nhấp biểu tượng bánh răng trên đầu để xem <strong>Thiết lập</strong>.
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

      {/* ========================================================================= */}
      {/* 💠 GLOBAL MODAL POPUP 1: INTERACTIVE TABLE SETUP SCHEMATIC (BƯỚC 3) */}
      {/* ========================================================================= */}
      {showTableModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-lg text-[#2563EB]">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[#101828] font-bold text-base leading-tight">Thiết lập Sơ đồ Phòng bàn</h3>
                  <p className="text-xs text-[#717680] mt-0.5">Bố trí bàn ăn, tầng lầu cho Nhà hàng Phở Phú Gia</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTableModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Area Tab switchers */}
              <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                {(['Tầng 1', 'Tầng 2'] as const).map((area) => (
                  <button
                    key={area}
                    onClick={() => setActiveArea(area)}
                    className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      activeArea === area 
                        ? 'bg-white text-[#2563EB] shadow-xs' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>

              {/* Dynamic Table layout grid */}
              <div className="border border-dashed border-gray-200 rounded-xl p-6 bg-slate-50/50 min-h-[220px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {tables
                    .filter(t => t.area === activeArea)
                    .map((table) => {
                      let statusBg = 'border-gray-300 bg-white hover:border-[#2563EB]';
                      let statusText = 'Trống';
                      let statusDot = 'bg-gray-400';

                      if (table.status === 'occupied') {
                        statusBg = 'border-blue-400 bg-blue-50/30';
                        statusText = 'Đang có khách';
                        statusDot = 'bg-blue-500';
                      } else if (table.status === 'reserved') {
                        statusBg = 'border-amber-400 bg-amber-50/30';
                        statusText = 'Đã đặt trước';
                        statusDot = 'bg-amber-500';
                      }

                      return (
                        <div
                          key={table.id}
                          onClick={() => {
                            const updated = tables.map(t => {
                              if (t.id === table.id) {
                                const nextStatus = t.status === 'empty' ? 'occupied' : t.status === 'occupied' ? 'reserved' : 'empty';
                                return { ...t, status: nextStatus };
                              }
                              return t;
                            });
                            setTables(updated);
                            triggerNotification(`Đã chuyển trạng thái ${table.name} thành công`, "info");
                          }}
                          className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md ${statusBg}`}
                        >
                          <div className="font-bold text-xs text-[#101828]">{table.name}</div>
                          <div className="text-[10px] text-gray-500 mt-1">{table.seats} chỗ ngồi</div>
                          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-[#475467]">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                            {statusText}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <p className="text-[11px] text-[#717680] leading-relaxed italic text-center">
                💡 Nhấp vào từng ô bàn phía trên để thay đổi trạng thái mô phỏng giữa Trống &harr; Đang phục vụ &harr; Đặt trước
              </p>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 rounded-b-2xl select-none">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setShowTableModal(false);
                  if (!completedSteps.includes(3)) {
                    setCompletedSteps(prev => [...prev, 3]);
                    confetti({
                      particleCount: 80,
                      spread: 80,
                      origin: { y: 0.6 }
                    });
                    triggerNotification("Đã thiết lập và lưu sơ đồ phòng bàn thành công!", "success");
                  }
                }}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Lưu sơ đồ bàn
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💠 GLOBAL MODAL POPUP 2: DOWNLOAD CUKCUK APP LINKS (BƯỚC 7) */}
      {/* ========================================================================= */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-gray-100 flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[#101828] font-bold text-base leading-tight">Cài đặt phần mềm bán hàng</h3>
                  <p className="text-xs text-[#717680] mt-0.5">Tải bộ cài đặt cho mọi nền tảng thiết bị đầu cuối</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              
              <p className="text-xs text-[#717680] leading-relaxed">
                MISA CukCuk hỗ trợ đồng bộ dữ liệu thời gian thực trên mọi nền tảng. Vui lòng chọn phiên bản tải phù hợp với thiết bị của bạn:
              </p>

              <div className="space-y-2.5">
                {/* Windows card */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-200 rounded-xl hover:border-[#2563EB] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-[#2563EB] rounded-lg">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101828]">CukCuk cho Máy tính (Windows)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Dành cho quầy Thu ngân & Máy trạm của nhà hàng</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      triggerNotification("Đang tải bộ cài đặt CukCuk_Setup.exe (124MB)...", "info");
                    }}
                    className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#2563EB] text-[#2563EB] text-[11px] font-bold rounded-lg cursor-pointer transition-all"
                  >
                    Tải về (.EXE)
                  </button>
                </div>

                {/* Tablet card */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-200 rounded-xl hover:border-[#2563EB] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <Tablet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101828]">CukCuk cho Máy tính bảng (Android/iPad)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Dành cho nhân viên gọi món, order trực tiếp tại bàn</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => triggerNotification("Đang chuyển tiếp sang Apple App Store...", "info")}
                      className="px-2.5 py-1.5 bg-white border border-gray-200 hover:border-[#2563EB] text-[#2563EB] text-[10px] font-bold rounded-lg cursor-pointer transition-all"
                    >
                      App Store
                    </button>
                    <button 
                      onClick={() => triggerNotification("Đang chuyển tiếp sang Google Play Store...", "info")}
                      className="px-2.5 py-1.5 bg-white border border-gray-200 hover:border-[#2563EB] text-[#2563EB] text-[10px] font-bold rounded-lg cursor-pointer transition-all"
                    >
                      Google Play
                    </button>
                  </div>
                </div>

                {/* Mobile App */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-200 rounded-xl hover:border-[#2563EB] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101828]">CukCuk cho Điện thoại di động</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Dành cho nhân viên phục vụ & Chủ nhà hàng theo dõi báo cáo</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => triggerNotification("Quét mã QR Code hiển thị trên tài liệu hướng dẫn để tải nhanh", "info")}
                    className="px-3 py-1.5 bg-[#2563EB] text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-[#1D4ED8] transition-all flex items-center gap-1"
                  >
                    <span>Quét QR</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 rounded-b-2xl">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 cursor-pointer"
              >
                Đóng lại
              </button>
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  if (!completedSteps.includes(7)) {
                    setCompletedSteps(prev => [...prev, 7]);
                    confetti({
                      particleCount: 50,
                      spread: 60,
                      origin: { y: 0.6 }
                    });
                    triggerNotification("Đã ghi nhận cài đặt phần mềm thành công!", "success");
                  }
                }}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Xác nhận đã cài đặt
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💠 STICKY FLOATING ONBOARDING GUIDE WIDGET (Dual-state) */}
      {/* ========================================================================= */}
      {isOnboardingCollapsed && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 font-sans select-none">
          
          {/* State A: Ô cửa sổ nhỏ (small_window) */}
          {onboardingBubbleState === 'small_window' && (
            <div 
              className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scale-up"
              style={{ maxHeight: '460px', boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)' }}
            >
              {/* Header */}
              <div className="bg-[#1E62EC] px-4 py-3 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="font-bold text-xs tracking-tight">Hướng dẫn thiết lập ({completedCount}/7)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setOnboardingBubbleState('chat_bubble')}
                    className="p-1 hover:bg-white/10 rounded text-white transition-colors cursor-pointer"
                    title="Thu nhỏ thành bong bóng chat"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                      setIsOnboardingCollapsed(false);
                      setActiveMenuId('tong-quan');
                      triggerNotification("Đã khôi phục hướng dẫn sử dụng toàn màn hình", "info");
                    }}
                    className="p-1 hover:bg-white/10 rounded text-white transition-colors cursor-pointer"
                    title="Mở rộng toàn màn hình"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
                <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100 text-[#475467] leading-relaxed">
                  <div className="font-bold text-[#101828] text-[11px]">Chào Nguyễn Mai Anh,</div>
                  Để có thể bắt đầu sử dụng phần mềm MISA CukCuk, bạn vui lòng thực hiện theo các bước sau:
                </div>

                {/* Progress bar area */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-700">
                    <span>Tiến độ hoàn thành</span>
                    <span className="text-[#2563EB]">{progressPercent}% ({completedCount}/7)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#2563EB] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Scrollable list of steps */}
                <div className="space-y-1.5 overflow-y-auto pr-0.5" style={{ maxHeight: '180px' }}>
                  {stepsData.map((step) => {
                    const isStepCompleted = completedSteps.includes(step.index);
                    return (
                      <div 
                        key={step.index}
                        className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all ${
                          isStepCompleted 
                            ? 'bg-emerald-50/25 border-emerald-100 text-gray-400' 
                            : 'bg-white hover:bg-slate-50 border-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStep(step.index);
                            }}
                            className="focus:outline-none flex-shrink-0 cursor-pointer"
                          >
                            {isStepCompleted ? (
                              <Check className="w-4 h-4 text-emerald-600 font-bold" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-300 hover:border-[#2563EB] flex items-center justify-center bg-white" />
                            )}
                          </button>

                          <div 
                            onClick={() => step.action()}
                            className="flex-1 min-w-0 cursor-pointer text-left"
                          >
                            <div className={`font-semibold text-[11px] truncate ${isStepCompleted ? 'line-through text-gray-400' : ''}`}>
                              B{step.index}: {step.title}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => step.action()}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-[#2563EB] flex-shrink-0 transition-colors"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom control info banner */}
              <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 text-center flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-medium">Bong bóng đính kèm</span>
                <button
                  onClick={() => {
                    setIsOnboardingCollapsed(false);
                    setActiveMenuId('tong-quan');
                    triggerNotification("Đã khôi phục hướng dẫn sử dụng chính", "info");
                  }}
                  className="text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8]"
                >
                  Mở rộng giao diện &rarr;
                </button>
              </div>
            </div>
          )}

          {/* State B: Bong bóng chat nhỏ (chat_bubble) */}
          {onboardingBubbleState === 'chat_bubble' && (
            <button
              onClick={() => setOnboardingBubbleState('small_window')}
              className="w-14 h-14 bg-[#1E62EC] hover:bg-[#1D4ED8] text-white rounded-full shadow-2xl flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in border-2 border-white"
              title="Mở hướng dẫn thiết lập"
            >
              <span className="absolute -inset-1 rounded-full bg-[#1E62EC]/30 animate-ping opacity-75 pointer-events-none" />
              
              <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
              
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md min-w-[18px] text-center">
                {progressPercent}%
              </span>
              
              <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
                7 Bước Thiết Lập ({completedCount}/7)
              </span>
            </button>
          )}

        </div>
      )}

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
