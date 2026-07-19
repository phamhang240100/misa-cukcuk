import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Users, Globe, Database, HelpCircle, ArrowLeft, Search, CheckCircle, Info, Percent, Pencil } from 'lucide-react';

interface SettingsViewProps {
  onNotification: (message: string, type: 'success' | 'info') => void;
  activeTab?: 'overview' | 'detail';
  setActiveTab?: React.Dispatch<React.SetStateAction<'overview' | 'detail'>>;
  selectedGroup?: string;
  setSelectedGroup?: React.Dispatch<React.SetStateAction<string>>;
  taxChecklist?: Array<{ id: number; text: string; isCompleted: boolean }>;
  onTaxTaskToggle?: (id: number) => void;
  onSaveTaxSettings?: () => void;
  initialIsEditing?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  onNotification,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  selectedGroup: propSelectedGroup,
  setSelectedGroup: propSetSelectedGroup,
  taxChecklist = [],
  onTaxTaskToggle,
  onSaveTaxSettings,
  initialIsEditing
}) => {
  const [localActiveTab, setLocalActiveTab] = useState<'overview' | 'detail'>('overview');
  const [localSelectedGroup, setLocalSelectedGroup] = useState<string>('general');

  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const setActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : setLocalActiveTab;
  const selectedGroup = propSelectedGroup !== undefined ? propSelectedGroup : localSelectedGroup;
  const setSelectedGroup = propSetSelectedGroup !== undefined ? propSetSelectedGroup : setLocalSelectedGroup;

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form states for settings
  const [restaurantName, setRestaurantName] = useState('Nhà hàng Phong Dê');
  const [phoneNumber, setPhoneNumber] = useState('024 3765 4321');
  const [address, setAddress] = useState('142 Đường Láng, Đống Đa, Hà Nội');
  const [language, setLanguage] = useState('Tiếng Việt');
  const [enableNotification, setEnableNotification] = useState(true);

  // Old simple Tax States (kept for reference or general compatibility)
  const [defaultTaxRate, setDefaultTaxRate] = useState<string>('8%');
  const [alcoholTaxRate, setAlcoholTaxRate] = useState<string>('10%');
  const [applyTaxToInvoice, setApplyTaxToInvoice] = useState<boolean>(true);
  const [taxRoundingMethod, setTaxRoundingMethod] = useState<string>('round_1');

  // New detailed tax calculation method states according to new requirements
  const [taxMethod, setTaxMethod] = useState<'khau_tru' | 'truc_tiep_doanh_thu'>(() => {
    return (localStorage.getItem('cukcuk_tax_method') as 'khau_tru' | 'truc_tiep_doanh_thu') || 'khau_tru';
  });
  const [deductionOption, setDeductionOption] = useState<'single' | 'multiple'>(() => {
    return (localStorage.getItem('cukcuk_deduction_option') as 'single' | 'multiple') || 'single';
  });
  const [singleTaxRate, setSingleTaxRate] = useState<string>(() => {
    return localStorage.getItem('cukcuk_single_tax_rate') || '8%';
  });
  const [pitOption, setPitOption] = useState<'percent_revenue' | 'taxable_income'>(() => {
    return (localStorage.getItem('cukcuk_pit_option') as 'percent_revenue' | 'taxable_income') || 'percent_revenue';
  });
  const [taxableIncomeRate, setTaxableIncomeRate] = useState<string>(() => {
    return localStorage.getItem('cukcuk_taxable_income_rate') || '15%';
  });

  // Additional fine-grained Tax and Service Fee states
  const [onlyCalculateOnRequest, setOnlyCalculateOnRequest] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_tax_only_on_request') === 'true';
  });
  const [onlyCalculateOnRequestOption, setOnlyCalculateOnRequestOption] = useState<'single' | 'multiple'>(() => {
    return (localStorage.getItem('cukcuk_tax_only_on_request_option') as 'single' | 'multiple') || 'multiple';
  });
  const [onlyCalculateOnRequestSingleRate, setOnlyCalculateOnRequestSingleRate] = useState<string>(() => {
    return localStorage.getItem('cukcuk_tax_only_on_request_single_rate') || '8';
  });
  const [menuPriceIncludesVat, setMenuPriceIncludesVat] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_tax_menu_includes_vat') === 'true';
  });
  const [applyTaxReduction406, setApplyTaxReduction406] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_tax_reduction_406') === 'true';
  });
  const [allowCashierToChange, setAllowCashierToChange] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_tax_allow_cashier_change') === 'true';
  });
  const [taxTakeaway, setTaxTakeaway] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_tax_takeaway') === 'true';
  });
  const [taxDelivery, setTaxDelivery] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_tax_delivery') === 'true';
  });
  const [taxDeliveryFee, setTaxDeliveryFee] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_tax_delivery_fee') === 'true';
  });
  const [taxDeliveryFeeRate, setTaxDeliveryFeeRate] = useState<string>(() => {
    return localStorage.getItem('cukcuk_tax_delivery_fee_rate') || '15%';
  });
  const [taxServiceFee, setTaxServiceFee] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_tax_service_fee') === 'true';
  });
  const [taxServiceFeeOption, setTaxServiceFeeOption] = useState<'mon' | 'chung'>(() => {
    return (localStorage.getItem('cukcuk_tax_service_fee_option') as 'mon' | 'chung') || 'mon';
  });
  const [taxServiceFeeCommonRate, setTaxServiceFeeCommonRate] = useState<string>(() => {
    return localStorage.getItem('cukcuk_tax_service_fee_common_rate') || '10%';
  });
  const [specialConsumptionTax, setSpecialConsumptionTax] = useState<'co' | 'khong'>(() => {
    return (localStorage.getItem('cukcuk_special_consumption_tax') as 'co' | 'khong') || 'co';
  });

  // Service fee states
  const [serviceFeeOption, setServiceFeeOption] = useState<'khong' | 'co' | 'phat_sinh'>(() => {
    return (localStorage.getItem('cukcuk_service_fee_option') as 'khong' | 'co' | 'phat_sinh') || 'khong';
  });

  // Independent edit states
  const [isTaxEditing, setIsTaxEditing] = useState<boolean>(() => {
    return selectedGroup === 'tax';
  });
  const [isServiceFeeEditing, setIsServiceFeeEditing] = useState(false);

  // Sync with prop initial editing state
  useEffect(() => {
    if (selectedGroup === 'tax' && initialIsEditing) {
      setIsTaxEditing(true);
    }
  }, [initialIsEditing, selectedGroup]);

  const settingGroups = [
    {
      id: 'general',
      title: 'Thiết lập chung',
      desc: 'Thông tin cửa hàng, múi giờ, ngôn ngữ liên lạc.',
      icon: <Settings className="w-5 h-5 text-blue-600" />,
      subitems: ['Thông tin nhà hàng', 'Thông tin liên hệ', 'Thiết lập múi giờ & tiền tệ', 'Cấu hình ngôn ngữ']
    },
    {
      id: 'tax',
      title: 'Khai báo thuế suất',
      desc: 'Cấu hình mức thuế suất GTGT 8%, 10% và áp dụng lên hóa đơn.',
      icon: <Percent className="w-5 h-5 text-indigo-600 animate-pulse" />,
      subitems: ['Mức thuế suất chính', 'Thuế suất cho rượu bia', 'Hóa đơn áp dụng thuế']
    },
    {
      id: 'security',
      title: 'Thiết lập bảo mật',
      desc: 'Mật khẩu bảo vệ, phân quyền nhân viên, bảo mật 2 lớp.',
      icon: <Shield className="w-5 h-5 text-indigo-600" />,
      subitems: ['Thay đổi mật khẩu', 'Nhật ký đăng nhập', 'Xác thực OTP', 'Danh sách phân quyền']
    },
    {
      id: 'notifications',
      title: 'Cấu hình thông báo',
      desc: 'Gửi email tự động, thông báo âm thanh bàn ăn, SMS.',
      icon: <Bell className="w-5 h-5 text-amber-600" />,
      subitems: ['Thông báo đơn hàng mới', 'Cảnh báo tồn kho', 'SMS chăm sóc khách hàng', 'Email báo cáo định kỳ']
    },
    {
      id: 'employees',
      title: 'Quản lý nhân viên',
      desc: 'Phân ca kíp, chấm công, tính lương và hoa hồng bán hàng.',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      subitems: ['Danh sách nhân viên', 'Cơ cấu ca làm việc', 'Thiết lập bảng lương', 'Đánh giá KPI']
    },
    {
      id: 'integration',
      title: 'Kết nối API & Data',
      desc: 'Cấu hình Webhook, liên kết dữ liệu, backup phục hồi.',
      icon: <Database className="w-5 h-5 text-rose-600" />,
      subitems: ['Danh sách Webhooks', 'Token truy cập API', 'Sao lưu cơ sở dữ liệu', 'Khôi phục lịch sử giao dịch']
    }
  ];

  const handleGroupClick = (groupId: string) => {
    setSelectedGroup(groupId);
    setActiveTab('detail');
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    onNotification("Đã lưu các thiết lập cấu hình thành công", "success");
  };

  const currentGroupObj = settingGroups.find(g => g.id === selectedGroup) || settingGroups[0];

  return (
    <div className="h-full flex flex-col select-none bg-[#F0F2F4]">
      {/* 1️⃣ MÀN HÌNH TỔNG QUAN THIẾT LẬP */}
      {activeTab === 'overview' ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header of overview */}
          <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-[#E9EAEB] select-none flex-shrink-0">
            <div>
              <h2 className="text-[#101828] font-semibold text-xl">Thiết lập hệ thống</h2>
              <p className="text-[#717680] text-xs">Cấu hình các tham số vận hành cho toàn bộ nhà hàng</p>
            </div>

            {/* Search Input for Settings */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm thiết lập..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none w-64 placeholder-gray-400"
                style={{ height: '32px', borderRadius: '8px' }}
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]" />
            </div>
          </div>

          {/* Cards Grid layout 3-4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 overflow-y-auto">
            {settingGroups
              .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.desc.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((group) => {
                return (
                  <div
                    key={group.id}
                    onClick={() => handleGroupClick(group.id)}
                    className="bg-white p-5 border-2 border-white hover:border-[#2563EB]/40 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Icon & Title */}
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#F0F6FE] group-hover:scale-105 transition-all">
                          {group.icon}
                        </div>
                        <h3 className="text-[#101828] font-semibold text-base group-hover:text-[#2563EB] transition-colors">
                          {group.title}
                        </h3>
                      </div>
                      
                      <p className="text-[#717680] text-xs leading-relaxed mb-4">
                        {group.desc}
                      </p>
                    </div>

                    {/* Subitems lists */}
                    <div className="border-t border-gray-100 pt-3 space-y-1.5">
                      {group.subitems.slice(0, 3).map((item, i) => (
                        <div key={i} className="text-xs text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1 font-medium">
                          <span className="w-1 h-1 bg-[#2563EB] rounded-full" />
                          {item}
                        </div>
                      ))}
                      {group.subitems.length > 3 && (
                        <span className="text-[10px] text-gray-400 block pt-0.5">
                          và {group.subitems.length - 3} tùy chọn khác...
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        /* 2️⃣ MÀN HÌNH CHI TIẾT THIẾT LẬP (DETAIL TAB) */
        <div className="flex flex-1 overflow-hidden">
          {/* Nội dung chi tiết bên phải */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] p-6 overflow-y-auto">
            {selectedGroup === 'tax' ? (
              <div className="space-y-6 max-w-3xl flex-1">
                {/* Header section info */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setActiveTab('overview');
                        setIsEditing(false);
                        setIsTaxEditing(false);
                        setIsServiceFeeEditing(false);
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition-colors shadow-xs"
                      title="Quay lại danh sách"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-[#101828] font-bold text-[20px]">Thuế/Phí dịch vụ</h3>
                  </div>
                </div>

                {/* 1. THẺ THUẾ */}
                {isTaxEditing ? (
                  <div className="border-2 border-[#1E62EC] rounded-xl bg-white p-6 shadow-md flex flex-col space-y-5 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="text-sm font-bold text-[#101828]">Thuế</h4>
                    </div>

                    {/* A. Phương pháp tính thuế GTGT */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-[#101828]">Phương pháp tính thuế GTGT</span>
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex items-center gap-8 pl-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="radio"
                            name="taxMethod"
                            checked={taxMethod === 'truc_tiep_doanh_thu'}
                            onChange={() => setTaxMethod('truc_tiep_doanh_thu')}
                            className="w-4 h-4 text-[#1E62EC] focus:ring-[#1E62EC]"
                          />
                          <span>Trực tiếp trên doanh thu</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="radio"
                            name="taxMethod"
                            checked={taxMethod === 'khau_tru'}
                            onChange={() => setTaxMethod('khau_tru')}
                            className="w-4 h-4 text-[#1E62EC] focus:ring-[#1E62EC]"
                          />
                          <span>Phương pháp khấu trừ</span>
                        </label>
                      </div>

                      <div className="flex flex-col gap-1.5 pl-1 pt-1">
                        <button type="button" className="text-[13px] font-semibold text-[#1E62EC] hover:underline flex items-center gap-1.5 text-left w-fit cursor-pointer">
                          Thiết lập % tính thuế
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        <button type="button" className="text-[13px] font-semibold text-[#1E62EC] hover:underline flex items-center gap-1.5 text-left w-fit cursor-pointer">
                          Thiết lập nhóm ngành nghề của phí dịch vụ, phí giao hàng
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    {/* B. Các checkbox cấu hình chi tiết */}
                    <div className="space-y-4 pt-1">
                      {/* 1. Chỉ tính khi khách yêu cầu */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={onlyCalculateOnRequest}
                            onChange={(e) => setOnlyCalculateOnRequest(e.target.checked)}
                            className="w-4 h-4 text-[#1E62EC] rounded border-slate-300 focus:ring-[#1E62EC]"
                          />
                          <span>Chỉ tính khi khách yêu cầu</span>
                        </label>
                        <div className="pl-6 flex flex-wrap items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-600">
                            <input
                              type="radio"
                              name="onlyCalculateOnRequestOption"
                              disabled={!onlyCalculateOnRequest}
                              checked={onlyCalculateOnRequestOption === 'multiple'}
                              onChange={() => setOnlyCalculateOnRequestOption('multiple')}
                              className="w-3.5 h-3.5 text-[#1E62EC] disabled:opacity-50"
                            />
                            <span>Áp dụng nhiều mức thuế suất</span>
                          </label>
                          <button 
                            type="button" 
                            disabled={!onlyCalculateOnRequest || onlyCalculateOnRequestOption !== 'multiple'}
                            className="text-[13px] font-semibold text-[#1E62EC] hover:underline flex items-center gap-1 disabled:text-slate-400 cursor-pointer mr-4"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            Thiết lập các mức thuế suất
                          </button>

                          <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-600">
                            <input
                              type="radio"
                              name="onlyCalculateOnRequestOption"
                              disabled={!onlyCalculateOnRequest}
                              checked={onlyCalculateOnRequestOption === 'single'}
                              onChange={() => setOnlyCalculateOnRequestOption('single')}
                              className="w-3.5 h-3.5 text-[#1E62EC] disabled:opacity-50"
                            />
                            <span>Chỉ áp dụng 1 mức thuế suất</span>
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              disabled={!onlyCalculateOnRequest || onlyCalculateOnRequestOption !== 'single'}
                              value={onlyCalculateOnRequestSingleRate}
                              onChange={(e) => setOnlyCalculateOnRequestSingleRate(e.target.value)}
                              placeholder=""
                              className="w-12 h-7 text-center text-[13px] border border-slate-300 rounded focus:outline-none focus:border-[#1E62EC] disabled:bg-slate-50 disabled:text-slate-400"
                            />
                            <span className="text-[13px] text-slate-500">%</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Giá món trên thực đơn đã bao gồm VAT */}
                      <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={menuPriceIncludesVat}
                          onChange={(e) => setMenuPriceIncludesVat(e.target.checked)}
                          className="w-4 h-4 text-[#1E62EC] rounded border-slate-300 focus:ring-[#1E62EC]"
                        />
                        <span>Giá món trên thực đơn đã bao gồm VAT</span>
                      </label>

                      {/* 3. Áp dụng giảm thuế GTGT theo nghị quyết */}
                      <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={applyTaxReduction406}
                          onChange={(e) => setApplyTaxReduction406(e.target.checked)}
                          className="w-4 h-4 text-[#1E62EC] rounded border-slate-300 focus:ring-[#1E62EC]"
                        />
                        <span>Áp dụng giảm thuế GTGT theo nghị quyết <strong className="font-bold text-slate-800">406/NQ-UBTVQH15</strong></span>
                      </label>

                      {/* 4. Cho phép thu ngân thay đổi tính theo từng đơn hàng */}
                      <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={allowCashierToChange}
                          onChange={(e) => setAllowCashierToChange(e.target.checked)}
                          className="w-4 h-4 text-[#1E62EC] rounded border-slate-300 focus:ring-[#1E62EC]"
                        />
                        <span>Cho phép thu ngân thay đổi tính theo từng đơn hàng</span>
                      </label>

                      {/* 5. Tính thuế cho đơn hàng mang về */}
                      <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={taxTakeaway}
                          onChange={(e) => setTaxTakeaway(e.target.checked)}
                          className="w-4 h-4 text-[#1E62EC] rounded border-slate-300 focus:ring-[#1E62EC]"
                        />
                        <span>Tính thuế cho đơn hàng mang về</span>
                      </label>

                      {/* 6. Tính thuế cho đơn hàng giao hàng */}
                        {/* 7. Tính thuế cho cả phí giao hàng */}
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={taxDeliveryFee}
                            onChange={(e) => setTaxDeliveryFee(e.target.checked)}
                            className="w-4 h-4 text-[#1E62EC] rounded border-slate-300 focus:ring-[#1E62EC]"
                          />
                          <span>Tính thuế cho cả phí giao hàng</span>
                        </label>
                        <select
                          disabled={!taxDeliveryFee}
                          value={taxDeliveryFeeRate}
                          onChange={(e) => setTaxDeliveryFeeRate(e.target.value)}
                          className="text-[13px] border border-slate-300 rounded px-2 bg-white focus:outline-none focus:border-[#1E62EC] h-7 w-24 disabled:bg-slate-50 disabled:text-slate-400"
                        >
                          <option value="5%">5%</option>
                          <option value="8%">8%</option>
                          <option value="10%">10%</option>
                          <option value="15%">15%</option>
                        </select>
                      </div>

                      {/* 8. Tính thuế cho phí dịch vụ */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={taxServiceFee}
                            onChange={(e) => setTaxServiceFee(e.target.checked)}
                            className="w-4 h-4 text-[#1E62EC] rounded border-slate-300 focus:ring-[#1E62EC]"
                          />
                          <span>Tính thuế cho phí dịch vụ theo:</span>
                        </label>
                        <div className="pl-6 flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-600">
                            <input
                              type="radio"
                              name="taxServiceFeeOption"
                              disabled={!taxServiceFee}
                              checked={taxServiceFeeOption === 'mon'}
                              onChange={() => setTaxServiceFeeOption('mon')}
                              className="w-3.5 h-3.5 text-[#1E62EC] disabled:opacity-50"
                            />
                            <span>Thuế suất của món</span>
                          </label>
                          
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-600">
                              <input
                                type="radio"
                                name="taxServiceFeeOption"
                                disabled={!taxServiceFee}
                                checked={taxServiceFeeOption === 'chung'}
                                onChange={() => setTaxServiceFeeOption('chung')}
                                className="w-3.5 h-3.5 text-[#1E62EC] disabled:opacity-50"
                              />
                              <span>Mức thuế suất chung</span>
                            </label>
                            <select
                              disabled={!taxServiceFee || taxServiceFeeOption !== 'chung'}
                              value={taxServiceFeeCommonRate}
                              onChange={(e) => setTaxServiceFeeCommonRate(e.target.value)}
                              className="text-[13px] border border-slate-300 rounded px-2 bg-white focus:outline-none focus:border-[#1E62EC] h-7 w-24 disabled:bg-slate-50 disabled:text-slate-400"
                            >
                              <option value="5%">5%</option>
                              <option value="8%">8%</option>
                              <option value="10%">10%</option>
                              <option value="15%">15%</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-150" />

                    {/* C. Phương pháp tính thuế TNCN */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-[#101828]">Phương pháp tính thuế TNCN</span>
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex items-center gap-6 pl-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="radio"
                            name="pitOption"
                            checked={pitOption === 'percent_revenue'}
                            onChange={() => setPitOption('percent_revenue')}
                            className="w-4 h-4 text-[#1E62EC] focus:ring-[#1E62EC]"
                          />
                          <span className="flex items-center gap-1">
                            Theo tỷ lệ % trên doanh thu
                            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          </span>
                        </label>
                        
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                            <input
                              type="radio"
                              name="pitOption"
                              checked={pitOption === 'taxable_income'}
                              onChange={() => setPitOption('taxable_income')}
                              className="w-4 h-4 text-[#1E62EC] focus:ring-[#1E62EC]"
                            />
                            <span>Thu nhập tính thuế</span>
                          </label>
                          <select
                            disabled={pitOption !== 'taxable_income'}
                            value={taxableIncomeRate}
                            onChange={(e) => setTaxableIncomeRate(e.target.value)}
                            className="text-[13px] border border-slate-300 rounded px-2 bg-white focus:outline-none focus:border-[#1E62EC] h-7 w-24 disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="15%">15%</option>
                            <option value="17%">17%</option>
                            <option value="20%">20%</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-150" />

                    {/* D. Thuế tiêu thụ đặc biệt khi bán hàng */}
                    <div className="space-y-3">
                      <div className="text-[13px] font-bold text-[#101828]">Thuế tiêu thụ đặc biệt khi bán hàng</div>
                      <div className="flex items-center gap-8 pl-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="radio"
                            name="specialConsumptionTax"
                            checked={specialConsumptionTax === 'co'}
                            onChange={() => setSpecialConsumptionTax('co')}
                            className="w-4 h-4 text-[#1E62EC] focus:ring-[#1E62EC]"
                          />
                          <span>Có</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="radio"
                            name="specialConsumptionTax"
                            checked={specialConsumptionTax === 'khong'}
                            onChange={() => setSpecialConsumptionTax('khong')}
                            className="w-4 h-4 text-[#1E62EC] focus:ring-[#1E62EC]"
                          />
                          <span>Không</span>
                        </label>
                      </div>
                      <button type="button" className="text-[13px] font-semibold text-[#1E62EC] hover:underline flex items-center gap-1.5 text-left w-fit cursor-pointer pl-1">
                        Thiết lập biểu thuế tiêu thụ đặc biệt
                      </button>
                    </div>

                    {/* E. Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsTaxEditing(false);
                          onNotification("Đã hủy bỏ thay đổi cấu hình thuế", "info");
                        }}
                        className="bg-white hover:bg-slate-50 border border-[#D5D7DA] text-[#101828] font-semibold px-5 text-xs transition-all cursor-pointer rounded-lg shadow-xs"
                        style={{ height: '32px' }}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('cukcuk_tax_method', taxMethod);
                          localStorage.setItem('cukcuk_tax_only_on_request', onlyCalculateOnRequest ? 'true' : 'false');
                          localStorage.setItem('cukcuk_tax_only_on_request_option', onlyCalculateOnRequestOption);
                          localStorage.setItem('cukcuk_tax_only_on_request_single_rate', onlyCalculateOnRequestSingleRate);
                          localStorage.setItem('cukcuk_tax_menu_includes_vat', menuPriceIncludesVat ? 'true' : 'false');
                          localStorage.setItem('cukcuk_tax_reduction_406', applyTaxReduction406 ? 'true' : 'false');
                          localStorage.setItem('cukcuk_tax_allow_cashier_change', allowCashierToChange ? 'true' : 'false');
                          localStorage.setItem('cukcuk_tax_takeaway', taxTakeaway ? 'true' : 'false');
                          localStorage.setItem('cukcuk_tax_delivery', taxDelivery ? 'true' : 'false');
                          localStorage.setItem('cukcuk_tax_delivery_fee', taxDeliveryFee ? 'true' : 'false');
                          localStorage.setItem('cukcuk_tax_delivery_fee_rate', taxDeliveryFeeRate);
                          localStorage.setItem('cukcuk_tax_service_fee', taxServiceFee ? 'true' : 'false');
                          localStorage.setItem('cukcuk_tax_service_fee_option', taxServiceFeeOption);
                          localStorage.setItem('cukcuk_tax_service_fee_common_rate', taxServiceFeeCommonRate);
                          localStorage.setItem('cukcuk_pit_option', pitOption);
                          localStorage.setItem('cukcuk_taxable_income_rate', taxableIncomeRate);
                          localStorage.setItem('cukcuk_special_consumption_tax', specialConsumptionTax);

                          setIsTaxEditing(false);
                          if (onSaveTaxSettings) {
                            onSaveTaxSettings();
                          } else {
                            onNotification("Đã lưu và áp dụng cấu hình thuế suất!", "success");
                          }
                        }}
                        className="bg-[#1E62EC] hover:bg-[#154fc4] text-white font-semibold px-5 text-xs transition-all cursor-pointer rounded-lg shadow-sm"
                        style={{ height: '32px' }}
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  /* READ-ONLY TAX CARD */
                  <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-xs flex flex-col space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="text-sm font-bold text-[#101828]">Thuế</h4>
                      <button
                        onClick={() => setIsTaxEditing(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer select-none"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                        Sửa
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-[13px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 font-medium">Phương pháp tính thuế GTGT</span>
                        <span className="text-[#101828] font-bold">
                          {taxMethod === 'truc_tiep_doanh_thu' ? 'Trực tiếp trên doanh thu' : 'Phương pháp khấu trừ'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 font-medium">Chỉ tính khi khách yêu cầu</span>
                        <span className="text-[#101828] font-bold">
                          {onlyCalculateOnRequest 
                            ? `Có (${onlyCalculateOnRequestOption === 'single' ? `Chỉ áp dụng 1 mức thuế suất: ${onlyCalculateOnRequestSingleRate || '0'}%` : 'Áp dụng nhiều mức thuế suất'})` 
                            : 'Không'}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 font-medium">Giá món trên thực đơn đã bao gồm VAT</span>
                        <span className="text-[#101828] font-bold">{menuPriceIncludesVat ? 'Có' : 'Không'}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 font-medium">Áp dụng giảm thuế theo nghị quyết 406/NQ-UBTVQH15</span>
                        <span className="text-[#101828] font-bold">{applyTaxReduction406 ? 'Có' : 'Không'}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 font-medium">Cho phép thu ngân thay đổi tính theo từng đơn hàng</span>
                        <span className="text-[#101828] font-bold">{allowCashierToChange ? 'Có' : 'Không'}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 font-medium">Tính thuế cho đơn hàng mang về / giao hàng</span>
                        <span className="text-[#101828] font-bold">
                          {taxTakeaway && taxDelivery ? 'Có (Cả 2)' : taxTakeaway ? 'Chỉ mang về' : taxDelivery ? 'Chỉ giao hàng' : 'Không'}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 font-medium">Phương pháp tính thuế TNCN</span>
                        <span className="text-[#101828] font-bold">
                          {pitOption === 'percent_revenue' ? 'Theo tỷ lệ % trên doanh thu' : `Thu nhập tính thuế (${taxableIncomeRate})`}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 font-medium">Thuế tiêu thụ đặc biệt khi bán hàng</span>
                        <span className="text-[#101828] font-bold">{specialConsumptionTax === 'co' ? 'Có' : 'Không'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PHẦN PHÍ DỊCH VỤ */}
                {isServiceFeeEditing ? (
                  <div className="border-2 border-[#1E62EC] rounded-xl bg-white p-6 shadow-md flex flex-col space-y-4 animate-fade-in">
                    <div className="pb-2 border-b border-slate-100">
                      <h4 className="text-sm font-bold text-[#101828]">Phí dịch vụ</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[13px] font-bold text-[#101828]">Tính phí dịch vụ tại nhà hàng</div>
                      <div className="flex flex-col md:flex-row md:items-center gap-6 pl-1 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="radio"
                            name="serviceFeeOption"
                            checked={serviceFeeOption === 'khong'}
                            onChange={() => setServiceFeeOption('khong')}
                            className="w-4 h-4 text-[#1E62EC] focus:ring-[#1E62EC]"
                          />
                          <span>Không</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="radio"
                            name="serviceFeeOption"
                            checked={serviceFeeOption === 'co'}
                            onChange={() => setServiceFeeOption('co')}
                            className="w-4 h-4 text-[#1E62EC] focus:ring-[#1E62EC]"
                          />
                          <span>Có</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                          <input
                            type="radio"
                            name="serviceFeeOption"
                            checked={serviceFeeOption === 'phat_sinh'}
                            onChange={() => setServiceFeeOption('phat_sinh')}
                            className="w-4 h-4 text-[#1E62EC] focus:ring-[#1E62EC]"
                          />
                          <span>Chỉ tính khi có phát sinh</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsServiceFeeEditing(false);
                          onNotification("Đã hủy bỏ thay đổi phí dịch vụ", "info");
                        }}
                        className="bg-white hover:bg-slate-50 border border-[#D5D7DA] text-[#101828] font-semibold px-5 text-[13px] transition-all cursor-pointer rounded-lg shadow-xs"
                        style={{ height: '32px' }}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('cukcuk_service_fee_option', serviceFeeOption);
                          setIsServiceFeeEditing(false);
                          onNotification("Đã lưu thiết lập phí dịch vụ thành công!", "success");
                        }}
                        className="bg-[#1E62EC] hover:bg-[#154fc4] text-white font-semibold px-5 text-[13px] transition-all cursor-pointer rounded-lg shadow-sm"
                        style={{ height: '32px' }}
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  /* READ-ONLY SERVICE FEE CARD */
                  <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-xs flex flex-col space-y-4 animate-fade-in">
                    <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#101828]">Phí dịch vụ</h4>
                      <button
                        onClick={() => setIsServiceFeeEditing(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 text-[13px] font-semibold rounded-lg shadow-xs transition-all cursor-pointer select-none"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                        Sửa
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-500 text-[13px] font-medium">Tính phí dịch vụ tại nhà hàng</div>
                      <div className="text-[#101828] text-[13px] font-bold pt-1">
                        {serviceFeeOption === 'khong' ? 'Không' : serviceFeeOption === 'co' ? 'Có' : 'Chỉ tính khi có phát sinh'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ORIGINAL FORM LAYOUT FOR OTHER GROUPS */
              <>
                {/* Header section info */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 flex-shrink-0">
                  <div>
                    <h3 className="text-[#101828] font-bold text-lg">{currentGroupObj.title}</h3>
                    <p className="text-[#717680] text-xs mt-0.5">{currentGroupObj.desc}</p>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-[#2563EB] hover:bg-[#1E40AF] text-white text-body-reg font-semibold px-4 cursor-pointer"
                      style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                    >
                      Chỉnh sửa
                    </button>
                  ) : null}
                </div>

                {/* Section Card Form */}
                <form onSubmit={handleSave} className="space-y-6 max-w-2xl flex-1">
                  <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                      Cấu hình tham số vận hành
                    </h4>

                    {/* Switch contents based on current selected group */}
                    {selectedGroup === 'general' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <label className="text-body-reg text-[#717680] font-medium">Tên nhà hàng</label>
                          <div className="col-span-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                                style={{ height: '32px', borderRadius: '8px' }}
                              />
                            ) : (
                              <div className="text-body-reg text-[#101828] font-semibold py-1 border-b border-[#E9EAEB]">
                                {restaurantName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                          <label className="text-body-reg text-[#717680] font-medium">Số điện thoại bàn</label>
                          <div className="col-span-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                                style={{ height: '32px', borderRadius: '8px' }}
                              />
                            ) : (
                              <div className="text-body-reg text-[#101828] font-semibold py-1 border-b border-[#E9EAEB]">
                                {phoneNumber}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                          <label className="text-body-reg text-[#717680] font-medium">Địa chỉ cơ sở</label>
                          <div className="col-span-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                                style={{ height: '32px', borderRadius: '8px' }}
                              />
                            ) : (
                              <div className="text-body-reg text-[#101828] font-semibold py-1 border-b border-[#E9EAEB]">
                                {address}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                          <label className="text-body-reg text-[#717680] font-medium">Ngôn ngữ hiển thị</label>
                          <div className="col-span-2">
                            {isEditing ? (
                              <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-2"
                                style={{ height: '32px', borderRadius: '8px' }}
                              >
                                <option>Tiếng Việt</option>
                                <option>English (Tiếng Anh)</option>
                                <option>日本語 (Tiếng Nhật)</option>
                              </select>
                            ) : (
                              <div className="text-body-reg text-[#101828] font-semibold py-1 border-b border-[#E9EAEB]">
                                {language}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : selectedGroup === 'notifications' ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div>
                            <div className="text-body-reg font-semibold text-[#101828]">Bật thông báo hệ thống</div>
                            <div className="text-xs text-[#717680]">Nhận báo cáo nhanh và cảnh báo âm thanh khi có order mới</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={enableNotification}
                            disabled={!isEditing}
                            onChange={(e) => setEnableNotification(e.target.checked)}
                            className="w-5 h-5 rounded text-[#2563EB]"
                          />
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div>
                            <div className="text-body-reg font-semibold text-[#101828]">Đồng bộ dữ liệu hóa đơn điện tử tự động</div>
                            <div className="text-xs text-[#717680]">Tự động xuất hóa đơn khi đơn hàng chuyển sang Hoàn thành</div>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            disabled={!isEditing}
                            className="w-5 h-5 rounded text-[#2563EB]"
                          />
                        </div>
                      </div>
                    ) : (
                      // Fallback generic settings parameters
                      <div className="space-y-4 py-8 text-center text-gray-400">
                        <Info className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p className="text-xs">
                          Bản mẫu thử nghiệm thiết lập "{currentGroupObj.title}" hiện đang sử dụng cấu hình mặc định an toàn.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* If editing, show footer action within form */}
                  {isEditing && (
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          onNotification("Đã hủy bỏ các thay đổi", "info");
                        }}
                        className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-semibold px-4 text-body-reg select-none cursor-pointer"
                        style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-semibold px-4 text-body-reg select-none cursor-pointer"
                        style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                      >
                        Lưu
                      </button>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
