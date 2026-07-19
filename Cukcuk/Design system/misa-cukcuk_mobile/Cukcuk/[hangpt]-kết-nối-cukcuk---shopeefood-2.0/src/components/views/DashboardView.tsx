import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  ShoppingCart, 
  Users, 
  RefreshCw, 
  Settings2, 
  Info,
  CheckCircle2,
  Circle,
  ArrowRight,
  ExternalLink,
  Percent,
  UtensilsCrossed,
  Grid,
  CreditCard,
  FileText,
  Download,
  Check,
  X,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  Minus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  onNotification: (message: string, type: 'success' | 'info') => void;
  onNavigate?: (menuId: string) => void;
  completedSteps: number[];
  setCompletedSteps: React.Dispatch<React.SetStateAction<number[]>>;
  isOnboardingCollapsed: boolean;
  setIsOnboardingCollapsed: (val: boolean) => void;
  onboardingBubbleState: 'chat_bubble' | 'small_window';
  setOnboardingBubbleState: (val: 'chat_bubble' | 'small_window') => void;
  stepsData: any[];
  showTableModal: boolean;
  setShowTableModal: (val: boolean) => void;
  showDownloadModal: boolean;
  setShowDownloadModal: (val: boolean) => void;
  tables: any[];
  setTables: React.Dispatch<React.SetStateAction<any[]>>;
  activeArea: 'Tầng 1' | 'Tầng 2';
  setActiveArea: (val: 'Tầng 1' | 'Tầng 2') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNotification, 
  onNavigate,
  completedSteps,
  setCompletedSteps,
  isOnboardingCollapsed,
  setIsOnboardingCollapsed,
  onboardingBubbleState,
  setOnboardingBubbleState,
  stepsData,
  showTableModal,
  setShowTableModal,
  showDownloadModal,
  setShowDownloadModal,
  tables,
  setTables,
  activeArea,
  setActiveArea
}) => {
  const [activeTab, setActiveTab] = useState<'tong-quan' | 'huong-dan'>('tong-quan');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('Tháng này');
  
  // Responsive dimensions tracking for charts using ResizeObserver
  const barChartContainerRef = useRef<HTMLDivElement>(null);
  const [barChartWidth, setBarChartWidth] = useState(400);

  useEffect(() => {
    if (!barChartContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setBarChartWidth(entry.contentRect.width || 400);
      }
    });
    observer.observe(barChartContainerRef.current);
    return () => observer.disconnect();
  }, [activeTab]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onNotification("Dữ liệu tổng quan đã được cập nhật mới nhất", "success");
    }, 800);
  };

  // Toggle single step state
  const toggleStep = (stepIndex: number) => {
    let newSteps = [...completedSteps];
    if (newSteps.includes(stepIndex)) {
      newSteps = newSteps.filter(s => s !== stepIndex);
    } else {
      newSteps.push(stepIndex);
      // Burst confetti on individual step completion
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
      onNotification(`Đã đánh dấu hoàn thành Bước ${stepIndex}`, "success");
    }
    setCompletedSteps(newSteps);

    // Trigger grand confetti if all 7 steps are complete
    if (newSteps.length === 7) {
      setTimeout(() => {
        triggerGrandConfetti();
        onNotification("Chúc mừng! Bạn đã hoàn thành toàn bộ 7 bước thiết lập ban đầu!", "success");
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

  // Sample scorecards data
  const scorecards = [
    {
      title: 'Doanh thu',
      value: '24.580.000',
      unit: 'đ',
      trend: 12.5,
      isUp: true,
      icon: <DollarSign className="w-5 h-5 text-blue-600" />,
      iconBg: 'bg-blue-50',
      sparkline: [20, 35, 28, 45, 60, 52, 75]
    },
    {
      title: 'Hóa đơn đã bán',
      value: '142',
      unit: 'hđ',
      trend: 8.3,
      isUp: true,
      icon: <Receipt className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      sparkline: [30, 42, 38, 55, 62, 58, 68]
    },
    {
      title: 'Sản lượng order',
      value: '458',
      unit: 'món',
      trend: -3.2,
      isUp: false,
      icon: <ShoppingCart className="w-5 h-5 text-rose-600" />,
      iconBg: 'bg-rose-50',
      sparkline: [50, 45, 48, 40, 38, 42, 35]
    },
    {
      title: 'Khách hàng mới',
      value: '68',
      unit: 'khách',
      trend: 18.2,
      isUp: true,
      icon: <Users className="w-5 h-5 text-purple-600" />,
      iconBg: 'bg-purple-50',
      sparkline: [10, 15, 25, 20, 35, 42, 50]
    }
  ];

  // Daily revenue bar data
  const revenueData = [
    { day: 'Thứ 2', revenue: 3200000 },
    { day: 'Thứ 3', revenue: 4500000 },
    { day: 'Thứ 4', revenue: 2100000 },
    { day: 'Thứ 5', revenue: 5600000 },
    { day: 'Thứ 6', revenue: 7800000 },
    { day: 'Thứ 7', revenue: 11200000 },
    { day: 'Chủ Nhật', revenue: 13500000 }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  // Donut chart data: maximum 6 categories, others merged to "Khác"
  const donutData = [
    { name: 'Phở bò', value: 45, color: '#2563EB' },
    { name: 'Phở gà', value: 25, color: '#10B981' },
    { name: 'Quẩy giòn', value: 15, color: '#F59E0B' },
    { name: 'Đồ uống', value: 8, color: '#8B5CF6' },
    { name: 'Trứng chần', value: 5, color: '#EC4899' },
    { name: 'Khác', value: 2, color: '#6B7280' }
  ];

  const donutTotal = donutData.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativePercent = 0;

  // Onboarding steps definition
  const steps = [
    {
      index: 1,
      title: 'Thiết lập phương pháp tính thuế',
      desc: 'Cấu hình phương pháp tính thuế giá trị gia tăng (GTGT) và thuế suất áp dụng cho món ăn.',
      icon: <Percent className="w-5 h-5 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      actionLabel: 'Đến Thiết lập',
      action: () => {
        onNavigate?.('settings');
        if (!completedSteps.includes(1)) {
          setCompletedSteps(prev => [...prev, 1]);
        }
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('small_window');
        onNotification("Đã chuyển hướng đến Thiết lập phương pháp tính thuế và thu nhỏ hướng dẫn", "success");
      }
    },
    {
      index: 2,
      title: 'Khởi tạo thực đơn',
      desc: 'Khai báo nhóm thực đơn, danh mục món ăn, đồ uống kèm đơn giá, đơn vị tính và hình ảnh.',
      icon: <UtensilsCrossed className="w-5 h-5 text-orange-600" />,
      bgColor: 'bg-orange-50',
      actionLabel: 'Đến Thực đơn',
      action: () => {
        onNavigate?.('thuc-don');
        if (!completedSteps.includes(2)) {
          setCompletedSteps(prev => [...prev, 2]);
        }
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('small_window');
        onNotification("Đã chuyển hướng đến quản lý Thực đơn và thu nhỏ hướng dẫn", "success");
      }
    },
    {
      index: 3,
      title: 'Thiết lập sơ đồ bàn',
      desc: 'Sắp xếp phòng bàn, khu vực kinh doanh tầng 1, tầng 2 phù hợp với không gian thực tế.',
      icon: <Grid className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
      actionLabel: 'Sắp xếp bàn',
      action: () => {
        setShowTableModal(true);
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('small_window');
      }
    },
    {
      index: 4,
      title: 'Thêm nhân viên & phân quyền',
      desc: 'Khai báo danh sách nhân viên phục vụ, thu ngân, bếp và cấu hình quyền hạn truy cập.',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      actionLabel: 'Đến Nhân viên',
      action: () => {
        onNavigate?.('settings');
        if (!completedSteps.includes(4)) {
          setCompletedSteps(prev => [...prev, 4]);
        }
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('small_window');
        onNotification("Đã chuyển hướng đến cài đặt Nhân viên & Phân quyền và thu nhỏ hướng dẫn", "success");
      }
    },
    {
      index: 5,
      title: 'Thiết lập phương thức thanh toán',
      desc: 'Khai báo các tài khoản nhận tiền chuyển khoản QR Code, tiền mặt hoặc liên kết ví điện tử.',
      icon: <CreditCard className="w-5 h-5 text-pink-600" />,
      bgColor: 'bg-pink-50',
      actionLabel: 'Đến Thanh toán',
      action: () => {
        onNavigate?.('settings');
        if (!completedSteps.includes(5)) {
          setCompletedSteps(prev => [...prev, 5]);
        }
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('small_window');
        onNotification("Đã chuyển hướng đến thiết lập Phương thức thanh toán và thu nhỏ hướng dẫn", "success");
      }
    },
    {
      index: 6,
      title: 'Kết nối hóa đơn điện tử / Chữ ký số meInvoice',
      desc: 'Đồng bộ dữ liệu bán hàng trực tiếp và phát hành hóa đơn có mã của Cơ quan Thuế.',
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      actionLabel: 'Kết nối ngay',
      action: () => {
        onNavigate?.('ung-dung');
        if (!completedSteps.includes(6)) {
          setCompletedSteps(prev => [...prev, 6]);
        }
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('small_window');
        onNotification("Đã mở danh sách ứng dụng, chọn meInvoice để kết nối", "success");
      }
    },
    {
      index: 7,
      title: 'Cài đặt phần mềm bán hàng',
      desc: 'Tải bộ cài đặt phần mềm CukCuk bán hàng cho máy tính, điện thoại di động và máy tính bảng.',
      icon: <Download className="w-5 h-5 text-rose-600" />,
      bgColor: 'bg-rose-50',
      actionLabel: 'Tải phần mềm',
      action: () => {
        setShowDownloadModal(true);
        setIsOnboardingCollapsed(true);
        setOnboardingBubbleState('small_window');
      }
    }
  ];

  const totalSteps = steps.length;
  const completedCount = completedSteps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="flex flex-col h-full bg-[#F0F2F4]">
      
      {/* 💠 PAGE HEADER WITH INTEGRATED TABS */}
      <div className="bg-white border-b border-[#E9EAEB] select-none flex-shrink-0">
        <div className="flex items-center justify-between py-3.5 px-6">
          <div>
            <h2 className="text-[#101828] font-bold text-lg tracking-tight">Bàn làm việc</h2>
            <p className="text-[#717680] text-xs mt-0.5">
              {activeTab === 'tong-quan' 
                ? 'Theo dõi thời gian thực kết quả kinh doanh của nhà hàng Phở Phú Gia' 
                : 'Thực hiện các bước thiết lập cơ bản để sẵn sàng bắt đầu hoạt động bán hàng'}
            </p>
          </div>
          
          {activeTab === 'tong-quan' && (
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(e.target.value);
                  onNotification(`Đã chuyển bộ lọc thời gian sang: ${e.target.value}`, "info");
                }}
                className="text-xs bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-3 py-1.5 rounded-lg font-medium cursor-pointer"
                style={{ height: '32px' }}
              >
                <option>Hôm nay</option>
                <option>Hôm qua</option>
                <option>Tuần này</option>
                <option>Tháng này</option>
                <option>Quý này</option>
                <option>Năm nay</option>
              </select>

              <button
                onClick={handleRefresh}
                className="flex items-center justify-center p-1.5 bg-white border border-[#D5D7DA] text-[#717680] hover:text-[#2563EB] hover:bg-[#F0F6FE] transition-colors rounded-lg cursor-pointer"
                style={{ width: '32px', height: '32px' }}
                title="Tải lại dữ liệu"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#2563EB]' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic sub-tabs */}
        <div className="flex px-6 border-t border-gray-100 bg-[#FAFAFB]">
          <button
            onClick={() => setActiveTab('tong-quan')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'tong-quan'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#717680] hover:text-[#101828]'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('huong-dan')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'huong-dan'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#717680] hover:text-[#101828]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>Hướng dẫn sử dụng</span>
              {completedCount < totalSteps && (
                <span className="bg-[#2563EB] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalSteps - completedCount}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* 💠 MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 overflow-y-auto">
        
        {/* ======================= TAB 1: TỔNG QUAN ======================= */}
        {activeTab === 'tong-quan' && (
          <div className="p-6 space-y-6">
            
            {/* 1️⃣ Scorecards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scorecards.map((card, idx) => (
                <div
                  key={idx}
                  className="relative flex justify-between p-5 transition-all duration-300 hover:shadow-md select-none group"
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #FFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div className="flex flex-col justify-between h-full space-y-2">
                    <div>
                      <span className="text-xs text-[#717680] font-medium block uppercase tracking-wider">
                        {card.title}
                      </span>
                      <span className="text-xl font-bold text-[#101828] mt-1 block">
                        {card.value}
                        <span className="text-xs font-normal text-gray-500 ml-1">{card.unit}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-xs">
                      {card.isUp ? (
                        <span className="flex items-center text-emerald-600 font-semibold">
                          <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          +{card.trend}%
                        </span>
                      ) : (
                        <span className="flex items-center text-rose-600 font-semibold">
                          <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          {card.trend}%
                        </span>
                      )}
                      <span className="text-[#717680] opacity-80">so với kỳ trước</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full">
                    <div className={`p-2 rounded-lg ${card.iconBg} transition-transform group-hover:scale-110`}>
                      {card.icon}
                    </div>

                    <div className="w-20 h-8 mt-4 overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 100 30">
                        <polyline
                          fill="none"
                          stroke={card.isUp ? "#10B981" : "#EF4444"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={card.sparkline.map((val, index) => `${(index / (card.sparkline.length - 1)) * 100},${30 - (val / 80) * 25}`).join(' ')}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRefresh();
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                      title="Tải lại thẻ này"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotification(`Mở thiết lập cấu hình tham số cho thẻ ${card.title}`, "info");
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                      title="Cấu hình chỉ số"
                    >
                      <Settings2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2️⃣ Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Left main: Revenue bar chart */}
              <div
                ref={barChartContainerRef}
                className="col-span-1 lg:col-span-2 p-5 flex flex-col justify-between hover:shadow-md select-none group relative"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #FFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.03)',
                  height: '350px'
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[#101828] font-semibold text-base">Doanh thu theo ngày trong tuần</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={handleRefresh}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                      title="Tải lại biểu đồ"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => onNotification("Mở cấu hình hiển thị biểu đồ cột doanh thu", "info")}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                      title="Thiết lập biểu đồ"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 mt-4 relative flex items-end justify-between px-2 h-48 border-b border-gray-100">
                  {revenueData.map((d, index) => {
                    const heightPercent = (d.revenue / maxRevenue) * 80;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 group/bar relative">
                        <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[11px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-md">
                          {d.revenue.toLocaleString('vi-VN')} đ
                        </div>
                        <div
                          className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-500 w-10 md:w-14"
                          style={{
                            height: `${heightPercent}%`,
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px',
                          }}
                        />
                        <span className="text-[11px] text-[#717680] mt-2 font-medium">
                          {d.day}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  <span>Doanh thu cao nhất: Thứ Chủ Nhật (13.5M)</span>
                  <span>Tổng tuần: {(50300000).toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Right main: Product distribution Donut chart */}
              <div
                className="p-5 flex flex-col justify-between hover:shadow-md select-none group relative"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #FFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.03)',
                  height: '350px'
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[#101828] font-semibold text-base">Cơ cấu món ăn bán chạy (Donut)</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={handleRefresh}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                      title="Tải lại cơ cấu"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => onNotification("Mở cấu hình bộ lọc cơ cấu bán hàng", "info")}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                      title="Thiết lập"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F3F4F6" strokeWidth="4.2" />
                      {donutData.map((item, index) => {
                        const percent = item.value;
                        const strokeDasharray = `${percent} ${100 - percent}`;
                        const strokeDashoffset = 100 - cumulativePercent;
                        cumulativePercent += percent;

                        return (
                          <circle
                            key={index}
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="4.2"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-700 hover:stroke-[5] cursor-pointer"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-[#717680] font-semibold uppercase tracking-wider">Tổng order</span>
                      <span className="text-lg font-bold text-[#101828]">458</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {donutData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[#101828] truncate flex-1 font-medium">{item.name}</span>
                      <span className="text-[#717680] font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: HƯỚNG DẪN SỬ DỤNG ======================= */}
        {activeTab === 'huong-dan' && (
          <div className="p-6 max-w-4xl mx-auto space-y-6">

            {isOnboardingCollapsed && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fade-in select-none">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 text-[#2563EB] rounded-lg mt-0.5">
                    <Sparkles className="w-5 h-5 animate-pulse text-amber-500" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#1E62EC]">Đã thu nhỏ thành bong bóng tiện ích</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">Tiến trình onboarding đang hoạt động ở góc dưới cùng bên phải màn hình. Bạn có thể tự do chuyển đổi màn hình mà không lo gián đoạn.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOnboardingCollapsed(false)}
                  className="bg-white border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-lg text-[#2563EB] hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer self-end sm:self-auto"
                >
                  Mở rộng lại
                </button>
              </div>
            )}
            
            {/* Greeting & Quick Progress Panel */}
            <div 
              className="p-6 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm select-none animate-fade-in"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2563EB] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">MISA Onboarding</span>
                  <h3 className="text-base font-bold text-[#101828]">Chào Nguyễn Mai Anh,</h3>
                </div>
                <p className="text-[#101828] font-semibold text-sm leading-relaxed">
                  Để có thể bắt đầu sử dụng phần mềm MISA CukCuk, bạn vui lòng thực hiện theo các bước sau
                </p>
                <p className="text-xs text-[#717680] font-medium">
                  Hoàn thiện cấu hình hệ thống giúp bạn tối ưu hóa quy trình bán món, in hóa đơn và theo dõi doanh thu chuẩn xác.
                </p>
                {!isOnboardingCollapsed && (
                  <button
                    onClick={() => {
                      setIsOnboardingCollapsed(true);
                      setOnboardingBubbleState('chat_bubble');
                      onNotification("Đã thu gọn hướng dẫn sử dụng thành bong bóng hình tròn ở góc dưới màn hình!", "success");
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] hover:text-[#1D4ED8] font-bold text-xs rounded-lg transition-all cursor-pointer border border-blue-200 select-none shadow-xs"
                    title="Thu gọn hướng dẫn"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Thu gọn hướng dẫn thành bong bóng</span>
                  </button>
                )}
              </div>

              {/* Graphical Circular Progress / Meter */}
              <div className="flex-shrink-0 flex flex-col items-center bg-white border border-gray-100 px-5 py-4 rounded-xl shadow-xs min-w-[170px]">
                <span className="text-[11px] text-[#717680] font-bold uppercase tracking-wider mb-2">Tiến trình thiết lập</span>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="#F3F4F6" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="26" 
                      stroke="#2563EB" 
                      strokeWidth="5" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - progressPercent / 100)}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-[#101828]">{progressPercent}%</span>
                </div>
                <span className="text-xs font-bold text-[#2563EB] mt-2">{completedCount}/{totalSteps} bước hoàn thành</span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {steps.map((step) => {
                const isCompleted = completedSteps.includes(step.index);
                return (
                  <div
                    key={step.index}
                    className={`p-4 bg-white rounded-xl border-2 transition-all duration-200 flex items-start gap-4 shadow-xs select-none hover:border-gray-300 relative ${
                      isCompleted ? 'border-emerald-200 bg-emerald-50/10' : 'border-white'
                    }`}
                  >
                    {/* Toggle Checkbox Column */}
                    <button
                      onClick={() => toggleStep(step.index)}
                      className="mt-1 flex-shrink-0 focus:outline-none cursor-pointer group"
                      title={isCompleted ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
                    >
                      {isCompleted ? (
                        <div className="w-5.5 h-5.5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs hover:bg-emerald-600 transition-colors">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5.5 h-5.5 rounded-full border-2 border-gray-300 hover:border-[#2563EB] hover:bg-blue-50 flex items-center justify-center transition-all bg-white">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                      )}
                    </button>

                    {/* Step Icon */}
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${step.bgColor}`}>
                      {step.icon}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-semibold truncate ${
                          isCompleted ? 'text-gray-500 line-through' : 'text-[#101828]'
                        }`}>
                          Bước {step.index}: {step.title}
                        </h4>
                        {isCompleted && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Đã hoàn thành
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#717680] mt-1 pr-4 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {/* Action Column */}
                    <div className="flex-shrink-0 self-center">
                      <button
                        onClick={step.action}
                        className={`text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 select-none transition-all cursor-pointer ${
                          isCompleted 
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 rounded-lg' 
                            : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg shadow-sm'
                        }`}
                      >
                        <span>{step.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick action: Reset steps */}
            {completedCount > 0 && (
              <div className="flex justify-end pt-2 select-none">
                <button
                  onClick={() => {
                    if (confirm("Bạn có muốn đặt lại toàn bộ tiến trình thiết lập không?")) {
                      setCompletedSteps([]);
                      onNotification("Đã thiết lập lại toàn bộ tiến trình", "info");
                    }
                  }}
                  className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  Đặt lại tiến trình onboarding
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
