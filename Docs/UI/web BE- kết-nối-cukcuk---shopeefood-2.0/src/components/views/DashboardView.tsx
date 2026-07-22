import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Receipt, ShoppingCart, Users, RefreshCw, Settings2, Info } from 'lucide-react';

interface DashboardViewProps {
  onNotification: (message: string, type: 'success' | 'info') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNotification }) => {
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
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onNotification("Dữ liệu tổng quan đã được cập nhật mới nhất", "success");
    }, 800);
  };

  // Sample data
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
    { name: 'Khác', value: 2, color: '#6B7280' } // Grouped "Others" as per rule
  ];

  const donutTotal = donutData.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="flex flex-col h-full bg-[#F0F2F4]">
      {/* Page Header */}
      <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-[#E9EAEB] select-none flex-shrink-0">
        <div>
          <h2 className="text-[#101828] font-semibold text-xl">Tổng quan hoạt động</h2>
          <p className="text-[#717680] text-xs">Theo dõi thời gian thực kết quả kinh doanh của nhà hàng Phở Phú Gia</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Timeframe Select */}
          <select
            value={timeRange}
            onChange={(e) => {
              setTimeRange(e.target.value);
              onNotification(`Đã chuyển bộ lọc thời gian sang: ${e.target.value}`, "info");
            }}
            className="text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-3"
            style={{ height: '32px', borderRadius: '8px' }}
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* 1️⃣ Scorecards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scorecards.map((card, idx) => {
          return (
            <div
              key={idx}
              className="relative flex justify-between p-5 transition-all duration-300 hover:shadow-md select-none group"
              style={{
                borderRadius: '12px',
                border: '2px solid #FFF',
                backgroundColor: 'rgba(255, 255, 255, 0.80)',
                boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Left Column */}
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

              {/* Right Column: Icon & Sparkline */}
              <div className="flex flex-col items-end justify-between h-full">
                <div className={`p-2 rounded-lg ${card.iconBg} transition-transform group-hover:scale-110`}>
                  {card.icon}
                </div>

                {/* Microsparkline */}
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

              {/* Hover Quick Action controls */}
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
          );
        })}
      </div>

      {/* 2️⃣ Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4">
        {/* Left main: Revenue bar chart (2/3 width on large screens) */}
        <div
          ref={barChartContainerRef}
          className="col-span-1 lg:col-span-2 p-5 flex flex-col justify-between hover:shadow-md select-none group relative"
          style={{
            borderRadius: '12px',
            border: '2px solid #FFF',
            backgroundColor: 'rgba(255, 255, 255, 0.80)',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.04)',
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

          {/* SVG Bar Chart with Rounded Top corners of 4px as requested */}
          <div className="flex-1 mt-4 relative flex items-end justify-between px-2 h-48 border-b border-gray-100">
            {revenueData.map((d, index) => {
              const heightPercent = (d.revenue / maxRevenue) * 80; // keep max height 80%
              return (
                <div key={index} className="flex flex-col items-center flex-1 group/bar relative">
                  {/* Tooltip popup on bar hover */}
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[11px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-md">
                    {d.revenue.toLocaleString('vi-VN')} đ
                  </div>
                  
                  {/* Bar with top left and right corners rounded by 4px as requested */}
                  <div
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-all duration-500 w-10 md:w-14"
                    style={{
                      height: `${heightPercent}%`,
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                    }}
                  />

                  {/* Day label */}
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

        {/* Right main: Product distribution Donut chart (1/3 width) */}
        <div
          className="p-5 flex flex-col justify-between hover:shadow-md select-none group relative"
          style={{
            borderRadius: '12px',
            border: '2px solid #FFF',
            backgroundColor: 'rgba(255, 255, 255, 0.80)',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.04)',
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

          {/* SVG Donut Chart with elegant details */}
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

              {/* Centered Total Label inside Donut hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] text-[#717680] font-semibold uppercase tracking-wider">Tổng order</span>
                <span className="text-lg font-bold text-[#101828]">458</span>
              </div>
            </div>
          </div>

          {/* Donut Chart Legend - Max 6 categories as requested! */}
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
  </div>
  );
};
