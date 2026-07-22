import React, { useState } from 'react';
import { Settings, Shield, Bell, Users, Globe, Database, HelpCircle, ArrowLeft, Search, CheckCircle, Info } from 'lucide-react';

interface SettingsViewProps {
  onNotification: (message: string, type: 'success' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNotification }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detail'>('overview');
  const [selectedGroup, setSelectedGroup] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form states for settings
  const [restaurantName, setRestaurantName] = useState('Nhà hàng Phở Phú Gia');
  const [phoneNumber, setPhoneNumber] = useState('024 3765 4321');
  const [address, setAddress] = useState('142 Đường Láng, Đống Đa, Hà Nội');
  const [language, setLanguage] = useState('Tiếng Việt');
  const [enableNotification, setEnableNotification] = useState(true);

  const settingGroups = [
    {
      id: 'general',
      title: 'Thiết lập chung',
      desc: 'Thông tin cửa hàng, múi giờ, ngôn ngữ liên lạc.',
      icon: <Settings className="w-5 h-5 text-blue-600" />,
      subitems: ['Thông tin nhà hàng', 'Thông tin liên hệ', 'Thiết lập múi giờ & tiền tệ', 'Cấu hình ngôn ngữ']
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
                          + và {group.subitems.length - 3} thiết lập khác
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        /* 2️⃣ MÀN HÌNH CHI TIẾT THIẾT LẬP (Detail Layout có Sidebar) */
        <div className="flex-1 p-6 overflow-hidden flex">
          <div className="flex-1 flex overflow-hidden min-h-0 bg-white" style={{ borderRadius: '12px', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.04)' }}>
          {/* Sidebar Thiết lập bên trái */}
          <div className="w-[240px] flex-shrink-0 bg-[#FAFAFA] border-r border-[#E9EAEB] flex flex-col p-4 space-y-4">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer select-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </button>

            <div className="font-semibold text-[#101828] text-sm">Danh mục thiết lập</div>

            {/* Vertical Menu items */}
            <div className="space-y-1 flex-1 overflow-y-auto">
              {settingGroups.map((group) => {
                const isActive = group.id === selectedGroup;
                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-body-reg rounded-lg flex items-center gap-2.5 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#F0F6FE] text-[#2563EB] font-semibold border-l-4 border-[#2563EB] rounded-l-none' 
                        : 'text-[#101828] hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <div className={isActive ? 'text-[#2563EB]' : 'text-[#717680]'}>
                      {group.icon}
                    </div>
                    <span className="truncate">{group.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nội dung chi tiết bên phải */}
          <div className="flex-1 flex flex-col min-w-0 bg-white p-6 overflow-y-auto">
            {/* Header section info */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
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

            {/* Section Card */}
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
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
