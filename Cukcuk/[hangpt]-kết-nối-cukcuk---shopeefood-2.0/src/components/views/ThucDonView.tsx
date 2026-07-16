import React, { useState } from 'react';
import { MENU_ITEMS_DATA } from '../../data';
import { MenuItem } from '../../types';
import { FilterCombobox } from '../FilterCombobox';
import { BulkActionBar } from '../BulkActionBar';
import { Tooltip } from '../Tooltip';
import { Search, RotateCw, Settings, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Trash, Edit3, CheckCircle2, XCircle, Info, Plus, X } from 'lucide-react';

interface ThucDonViewProps {
  onNotification: (message: string, type: 'success' | 'info') => void;
}

export const ThucDonView: React.FC<ThucDonViewProps> = ({ onNotification }) => {
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS_DATA);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Phở',
    price: 50000,
    unit: 'Bát',
    status: 'active' as const
  });

  const categories = ['Tất cả', 'Phở', 'Món ăn kèm', 'Đồ uống'];

  // Active sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<'thuc-don' | 'nhom-thuc-don' | 'so-thich' | 'lich-ban'>('thuc-don');

  // 1. Sub-tab state for "Nhóm thực đơn"
  const [menuGroups, setMenuGroups] = useState([
    { id: 'G01', name: 'Phở', desc: 'Các món phở nước truyền thống sử dụng bánh phở tươi', itemCount: 4, status: 'active' },
    { id: 'G02', name: 'Món ăn kèm', desc: 'Quẩy giòn, trứng chần bổ dưỡng ăn kèm món chính', itemCount: 2, status: 'active' },
    { id: 'G03', name: 'Đồ uống', desc: 'Nước ép trái cây tươi mát, cà phê và nước đóng chai', itemCount: 4, status: 'active' },
    { id: 'G04', name: 'Khai vị', desc: 'Nộm xoài tai heo, súp cua đồng quê khai vị nhẹ nhàng', itemCount: 0, status: 'inactive' },
  ]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', desc: '', status: 'active' });

  // 2. Sub-tab state for "Sở thích phục vụ"
  const [preferences, setPreferences] = useState([
    { id: 'P01', name: 'Ít hành', group: 'Phở', surcharge: 0, status: 'active' },
    { id: 'P02', name: 'Nhiều bánh phở', group: 'Phở', surcharge: 10000, status: 'active' },
    { id: 'P03', name: 'Trứng chần chín kĩ', group: 'Món ăn kèm', surcharge: 0, status: 'active' },
    { id: 'P04', name: 'Không lấy nước dùng', group: 'Phở', surcharge: 0, status: 'active' },
    { id: 'P05', name: 'Ít ngọt nhiều đá', group: 'Đồ uống', surcharge: 0, status: 'active' },
    { id: 'P06', name: 'Nước cam ép không đường', group: 'Đồ uống', surcharge: 0, status: 'active' },
  ]);
  const [selectedPrefIds, setSelectedPrefIds] = useState<string[]>([]);
  const [prefSearchTerm, setPrefSearchTerm] = useState('');
  const [isPrefFormOpen, setIsPrefFormOpen] = useState(false);
  const [newPref, setNewPref] = useState({ name: '', group: 'Phở', surcharge: 0, status: 'active' });

  // 3. Sub-tab state for "Lịch bán món"
  const [schedules, setSchedules] = useState([
    { id: 'S01', name: 'Thực đơn ăn sáng', days: 'Thứ 2 - Chủ nhật', time: '06:00 - 10:00', itemCount: 8, status: 'active' },
    { id: 'S02', name: 'Đặc sản trưa văn phòng', days: 'Thứ 2 - Thứ 6', time: '11:00 - 14:00', itemCount: 5, status: 'active' },
    { id: 'S03', name: 'Khung giờ lẩu tối', days: 'Thứ 2 - Chủ nhật', time: '18:00 - 22:30', itemCount: 10, status: 'active' },
    { id: 'S04', name: 'Combo đặc biệt cuối tuần', days: 'Thứ 7 - Chủ nhật', time: 'Cả ngày', itemCount: 3, status: 'inactive' },
  ]);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState('');
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ name: '', days: 'Thứ 2 - Chủ nhật', time: '06:00 - 10:00', status: 'active' });

  // Filter logic
  const filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'Tất cả' ? true : item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const filteredGroups = menuGroups.filter(g => 
    g.name.toLowerCase().includes(groupSearchTerm.toLowerCase()) || 
    g.desc.toLowerCase().includes(groupSearchTerm.toLowerCase())
  );

  const filteredPrefs = preferences.filter(p => 
    p.name.toLowerCase().includes(prefSearchTerm.toLowerCase()) || 
    p.group.toLowerCase().includes(prefSearchTerm.toLowerCase())
  );

  const filteredSchedules = schedules.filter(s => 
    s.name.toLowerCase().includes(scheduleSearchTerm.toLowerCase()) || 
    s.days.toLowerCase().includes(scheduleSearchTerm.toLowerCase())
  );

  // Simple Pagination
  const pageSize = 10;
  
  // 1. Pagination for Thực đơn
  const [currentPage, setCurrentPage] = useState(1);
  const totalCount = filteredItems.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const startRange = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalCount);

  // 2. Pagination for Nhóm thực đơn
  const [currentGroupPage, setCurrentGroupPage] = useState(1);
  const totalGroupCount = filteredGroups.length;
  const totalGroupPages = Math.ceil(totalGroupCount / pageSize) || 1;
  const paginatedGroups = filteredGroups.slice((currentGroupPage - 1) * pageSize, currentGroupPage * pageSize);
  const startGroupRange = totalGroupCount === 0 ? 0 : (currentGroupPage - 1) * pageSize + 1;
  const endGroupRange = Math.min(currentGroupPage * pageSize, totalGroupCount);

  // 3. Pagination for Sở thích phục vụ
  const [currentPrefPage, setCurrentPrefPage] = useState(1);
  const totalPrefCount = filteredPrefs.length;
  const totalPrefPages = Math.ceil(totalPrefCount / pageSize) || 1;
  const paginatedPrefs = filteredPrefs.slice((currentPrefPage - 1) * pageSize, currentPrefPage * pageSize);
  const startPrefRange = totalPrefCount === 0 ? 0 : (currentPrefPage - 1) * pageSize + 1;
  const endPrefRange = Math.min(currentPrefPage * pageSize, totalPrefCount);

  // 4. Pagination for Lịch bán món
  const [currentSchedulePage, setCurrentSchedulePage] = useState(1);
  const totalScheduleCount = filteredSchedules.length;
  const totalSchedulePages = Math.ceil(totalScheduleCount / pageSize) || 1;
  const paginatedSchedules = filteredSchedules.slice((currentSchedulePage - 1) * pageSize, currentSchedulePage * pageSize);
  const startScheduleRange = totalScheduleCount === 0 ? 0 : (currentSchedulePage - 1) * pageSize + 1;
  const endScheduleRange = Math.min(currentSchedulePage * pageSize, totalScheduleCount);

  // Selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedItems.map(i => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  // Group selection handlers
  const handleSelectAllGroups = (checked: boolean) => {
    if (checked) {
      setSelectedGroupIds(paginatedGroups.map(g => g.id));
    } else {
      setSelectedGroupIds([]);
    }
  };

  const handleSelectGroupRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedGroupIds(prev => [...prev, id]);
    } else {
      setSelectedGroupIds(prev => prev.filter(i => i !== id));
    }
  };

  // Pref selection handlers
  const handleSelectAllPrefs = (checked: boolean) => {
    if (checked) {
      setSelectedPrefIds(paginatedPrefs.map(p => p.id));
    } else {
      setSelectedPrefIds([]);
    }
  };

  const handleSelectPrefRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPrefIds(prev => [...prev, id]);
    } else {
      setSelectedPrefIds(prev => prev.filter(i => i !== id));
    }
  };

  // Schedule selection handlers
  const handleSelectAllSchedules = (checked: boolean) => {
    if (checked) {
      setSelectedScheduleIds(paginatedSchedules.map(s => s.id));
    } else {
      setSelectedScheduleIds([]);
    }
  };

  const handleSelectScheduleRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedScheduleIds(prev => [...prev, id]);
    } else {
      setSelectedScheduleIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.filter(i => i.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
    onNotification("Đã xóa món ăn khỏi thực đơn", "success");
  };

  const handleBulkDelete = () => {
    setItems(prev => prev.filter(i => !selectedIds.includes(i.id)));
    setSelectedIds([]);
    onNotification(`Đã xóa ${selectedIds.length} món khỏi thực đơn`, "success");
  };

  const handleBulkApprove = () => {
    setItems(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status: 'active' as const } : i));
    setSelectedIds([]);
    onNotification(`Đã mở bán cho ${selectedIds.length} món ăn được chọn`, "success");
  };

  // Form Submits
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdItem: MenuItem = {
      id: `m${items.length + 1}`,
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      unit: newItem.unit,
      status: newItem.status
    };
    setItems([createdItem, ...items]);
    setIsFormOpen(false);
    setNewItem({ name: '', category: 'Phở', price: 50000, unit: 'Bát', status: 'active' });
    onNotification(`Đã thêm món "${createdItem.name}" vào thực đơn`, "success");
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const group = {
      id: `G0${menuGroups.length + 1}`,
      name: newGroup.name,
      desc: newGroup.desc || 'Không có mô tả',
      itemCount: 0,
      status: newGroup.status
    };
    setMenuGroups([group, ...menuGroups]);
    setIsGroupFormOpen(false);
    setNewGroup({ name: '', desc: '', status: 'active' });
    onNotification(`Đã thêm nhóm thực đơn "${group.name}"`, "success");
  };

  const handleCreatePrefSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pref = {
      id: `P0${preferences.length + 1}`,
      name: newPref.name,
      group: newPref.group,
      surcharge: Number(newPref.surcharge),
      status: newPref.status
    };
    setPreferences([pref, ...preferences]);
    setIsPrefFormOpen(false);
    setNewPref({ name: '', group: 'Phở', surcharge: 0, status: 'active' });
    onNotification(`Đã thêm sở thích phục vụ "${pref.name}"`, "success");
  };

  const handleCreateScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schedule = {
      id: `S0${schedules.length + 1}`,
      name: newSchedule.name,
      days: newSchedule.days,
      time: newSchedule.time,
      itemCount: 0,
      status: newSchedule.status
    };
    setSchedules([schedule, ...schedules]);
    setIsScheduleFormOpen(false);
    setNewSchedule({ name: '', days: 'Thứ 2 - Chủ nhật', time: '06:00 - 10:00', status: 'active' });
    onNotification(`Đã thêm lịch bán món "${schedule.name}"`, "success");
  };

  return (
    <div className="flex flex-col h-full">
      {/* 1️⃣ Page Header / Bulk Action Bar overlay */}
      <div className="py-4 relative px-6 flex items-center justify-between bg-white border-b border-[#E9EAEB] select-none flex-shrink-0">
        {activeSubTab === 'thuc-don' && selectedIds.length > 0 ? (
          <div className="absolute inset-x-6 h-full flex items-center bg-transparent z-10 animate-fade-in">
            <BulkActionBar
              selectedCount={selectedIds.length}
              onClearSelection={() => setSelectedIds([])}
              onDelete={handleBulkDelete}
              onApprove={handleBulkApprove}
            />
          </div>
        ) : activeSubTab === 'nhom-thuc-don' && selectedGroupIds.length > 0 ? (
          <div className="absolute inset-x-6 h-full flex items-center bg-transparent z-10 animate-fade-in">
            <BulkActionBar
              selectedCount={selectedGroupIds.length}
              onClearSelection={() => setSelectedGroupIds([])}
              onDelete={() => {
                setMenuGroups(prev => prev.filter(g => !selectedGroupIds.includes(g.id)));
                setSelectedGroupIds([]);
                onNotification("Đã xóa nhóm thực đơn được chọn", "success");
              }}
              onApprove={() => {
                setMenuGroups(prev => prev.map(g => selectedGroupIds.includes(g.id) ? { ...g, status: 'active' } : g));
                setSelectedGroupIds([]);
                onNotification("Đã kích hoạt các nhóm thực đơn được chọn", "success");
              }}
            />
          </div>
        ) : activeSubTab === 'so-thich' && selectedPrefIds.length > 0 ? (
          <div className="absolute inset-x-6 h-full flex items-center bg-transparent z-10 animate-fade-in">
            <BulkActionBar
              selectedCount={selectedPrefIds.length}
              onClearSelection={() => setSelectedPrefIds([])}
              onDelete={() => {
                setPreferences(prev => prev.filter(p => !selectedPrefIds.includes(p.id)));
                setSelectedPrefIds([]);
                onNotification("Đã xóa các sở thích phục vụ được chọn", "success");
              }}
              onApprove={() => {
                setPreferences(prev => prev.map(p => selectedPrefIds.includes(p.id) ? { ...p, status: 'active' } : p));
                setSelectedPrefIds([]);
                onNotification("Đã kích hoạt các sở thích phục vụ được chọn", "success");
              }}
            />
          </div>
        ) : activeSubTab === 'lich-ban' && selectedScheduleIds.length > 0 ? (
          <div className="absolute inset-x-6 h-full flex items-center bg-transparent z-10 animate-fade-in">
            <BulkActionBar
              selectedCount={selectedScheduleIds.length}
              onClearSelection={() => setSelectedScheduleIds([])}
              onDelete={() => {
                setSchedules(prev => prev.filter(s => !selectedScheduleIds.includes(s.id)));
                setSelectedScheduleIds([]);
                onNotification("Đã xóa các lịch bán món được chọn", "success");
              }}
              onApprove={() => {
                setSchedules(prev => prev.map(s => selectedScheduleIds.includes(s.id) ? { ...s, status: 'active' } : s));
                setSelectedScheduleIds([]);
                onNotification("Đã kích hoạt các lịch bán món được chọn", "success");
              }}
            />
          </div>
        ) : (
          <>
            <h2 className="text-[#101828] font-semibold text-xl">
              {activeSubTab === 'thuc-don' && 'Quản lý thực đơn'}
              {activeSubTab === 'nhom-thuc-don' && 'Quản lý nhóm thực đơn'}
              {activeSubTab === 'so-thich' && 'Quản lý sở thích phục vụ'}
              {activeSubTab === 'lich-ban' && 'Quản lý lịch bán món'}
            </h2>
            <div className="flex items-center gap-2">
              {activeSubTab === 'thuc-don' && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-3 text-body-reg select-none cursor-pointer"
                  style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                >
                  <Plus className="w-4 h-4" />
                  Thêm món mới
                </button>
              )}
              {activeSubTab === 'nhom-thuc-don' && (
                <button
                  onClick={() => setIsGroupFormOpen(true)}
                  className="flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-3 text-body-reg select-none cursor-pointer"
                  style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                >
                  <Plus className="w-4 h-4" />
                  Thêm nhóm mới
                </button>
              )}
              {activeSubTab === 'so-thich' && (
                <button
                  onClick={() => setIsPrefFormOpen(true)}
                  className="flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-3 text-body-reg select-none cursor-pointer"
                  style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                >
                  <Plus className="w-4 h-4" />
                  Thêm sở thích mới
                </button>
              )}
              {activeSubTab === 'lich-ban' && (
                <button
                  onClick={() => setIsScheduleFormOpen(true)}
                  className="flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-3 text-body-reg select-none cursor-pointer"
                  style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                >
                  <Plus className="w-4 h-4" />
                  Thêm lịch bán
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* 💠 Horizontal Tabs Navigation under Page Header */}
      <div className="h-12 bg-white px-6 border-b border-[#E9EAEB] flex items-center flex-shrink-0 select-none">
        <div className="flex gap-4 h-full">
          <button
            onClick={() => setActiveSubTab('thuc-don')}
            className={`relative h-full flex items-center text-[13px] font-semibold transition-colors cursor-pointer px-4 hover:bg-[#EDFCF4] ${
              activeSubTab === 'thuc-don' ? 'text-[#2563EB]' : 'text-[#717680] hover:text-[#2563EB]'
            }`}
          >
            Thực đơn
            {activeSubTab === 'thuc-don' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('nhom-thuc-don')}
            className={`relative h-full flex items-center text-[13px] font-semibold transition-colors cursor-pointer px-4 hover:bg-[#EDFCF4] ${
              activeSubTab === 'nhom-thuc-don' ? 'text-[#2563EB]' : 'text-[#717680] hover:text-[#2563EB]'
            }`}
          >
            Nhóm thực đơn
            {activeSubTab === 'nhom-thuc-don' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('so-thich')}
            className={`relative h-full flex items-center text-[13px] font-semibold transition-colors cursor-pointer px-4 hover:bg-[#EDFCF4] ${
              activeSubTab === 'so-thich' ? 'text-[#2563EB]' : 'text-[#717680] hover:text-[#2563EB]'
            }`}
          >
            Sở thích phục vụ
            {activeSubTab === 'so-thich' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('lich-ban')}
            className={`relative h-full flex items-center text-[13px] font-semibold transition-colors cursor-pointer px-4 hover:bg-[#EDFCF4] ${
              activeSubTab === 'lich-ban' ? 'text-[#2563EB]' : 'text-[#717680] hover:text-[#2563EB]'
            }`}
          >
            Lịch bán món
            {activeSubTab === 'lich-ban' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* 2️⃣ Table Area */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div
          className="flex-1 flex flex-col bg-white overflow-hidden"
          style={{
            borderRadius: '8px',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.04)',
          }}
        >
        {/* Search & Filter header */}
        <div className="flex items-center justify-between border-b border-[#E9EAEB] px-3 select-none" style={{ height: '56px' }}>
          {activeSubTab === 'thuc-don' ? (
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm tên món ăn, đồ uống..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none"
                  style={{ height: '32px', borderRadius: '8px' }}
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]" />
              </div>

              <FilterCombobox
                label="Nhóm món:"
                value={categoryFilter}
                options={categories}
                onChange={(val) => setCategoryFilter(val)}
              />
            </div>
          ) : activeSubTab === 'nhom-thuc-don' ? (
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm nhóm thực đơn..."
                  value={groupSearchTerm}
                  onChange={(e) => setGroupSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none"
                  style={{ height: '32px', borderRadius: '8px' }}
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]" />
              </div>
            </div>
          ) : activeSubTab === 'so-thich' ? (
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm sở thích phục vụ..."
                  value={prefSearchTerm}
                  onChange={(e) => setPrefSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none"
                  style={{ height: '32px', borderRadius: '8px' }}
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm lịch bán món..."
                  value={scheduleSearchTerm}
                  onChange={(e) => setScheduleSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none"
                  style={{ height: '32px', borderRadius: '8px' }}
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeSubTab === 'thuc-don') {
                  setItems(MENU_ITEMS_DATA);
                  setSelectedIds([]);
                  setSearchTerm('');
                  setCategoryFilter('Tất cả');
                } else if (activeSubTab === 'nhom-thuc-don') {
                  setGroupSearchTerm('');
                  setSelectedGroupIds([]);
                } else if (activeSubTab === 'so-thich') {
                  setPrefSearchTerm('');
                  setSelectedPrefIds([]);
                } else {
                  setScheduleSearchTerm('');
                  setSelectedScheduleIds([]);
                }
                onNotification("Đã làm mới dữ liệu", "success");
              }}
              className="w-8 h-8 flex items-center justify-center text-[#717680] hover:text-[#2563EB] hover:bg-[#F0F6FE] transition-colors rounded-lg cursor-pointer"
              title="Làm mới"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content table */}
        <div className="flex-1 overflow-auto">
          {activeSubTab === 'thuc-don' && (
            <table className="w-full text-left table-fixed">
              <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10">
                <tr className="text-body-reg font-semibold text-[#101828] h-10">
                  <th className="w-12 pl-4">
                    <input
                      type="checkbox"
                      checked={paginatedItems.length > 0 && paginatedItems.every(i => selectedIds.includes(i.id))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                    />
                  </th>
                  <th className="w-24 pl-2">Mã món</th>
                  <th className="w-64 pl-2">Tên món ăn / Đồ uống</th>
                  <th className="w-36 pl-2">Nhóm danh mục</th>
                  <th className="w-24 pl-2">Đơn vị</th>
                  <th className="w-32 pl-2 text-right">Đơn giá bán (đ)</th>
                  <th className="w-32 pl-4 text-center">Trạng thái</th>
                  <th className="w-20 pr-4"></th>
                </tr>
              </thead>

              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-[#717680] bg-white">
                      Chưa có món ăn nào trong danh sách.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map(item => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleSelectRow(item.id, !isSelected)}
                        className={`h-11 border-b border-[#E9EAEB] cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#DDEAFC]' : 'hover:bg-[#DDEAFC]'
                        }`}
                      >
                        <td className="pl-4 py-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                            className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                          />
                        </td>

                        <td className="pl-2 font-mono text-xs font-semibold text-gray-500">{item.id.toUpperCase()}</td>
                        
                        <td className="pl-2 font-medium text-[#101828] truncate">{item.name}</td>
                        
                        <td className="pl-2">
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded border border-gray-200">
                            {item.category}
                          </span>
                        </td>

                        <td className="pl-2 text-[#717680]">{item.unit}</td>
                        
                        <td className="pl-2 font-semibold text-right text-[#101828] pr-2">
                          {item.price.toLocaleString('vi-VN')}
                        </td>

                        <td className="pl-4 text-center">
                          {item.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> Đang bán
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-300">
                              <XCircle className="w-3 h-3" /> Ngừng bán
                            </span>
                          )}
                        </td>

                        {/* Row actions */}
                        <td className="pr-4 py-1 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip content="Ngừng bán / Mở bán">
                              <button
                                onClick={() => {
                                  setItems(items.map(i => i.id === item.id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i));
                                  onNotification(`Đã đổi trạng thái bán cho món ${item.name}`, "success");
                                }}
                                className="w-7 h-7 flex items-center justify-center bg-white border border-[#D5D7DA] text-[#717680] hover:text-[#2563EB] hover:border-[#2563EB] rounded shadow-sm transition-all cursor-pointer"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Xóa khỏi thực đơn">
                              <button
                                onClick={(e) => handleDeleteItem(item.id, e)}
                                className="w-7 h-7 flex items-center justify-center bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded shadow-sm transition-all cursor-pointer"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {activeSubTab === 'nhom-thuc-don' && (
            <table className="w-full text-left table-fixed">
              <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10">
                <tr className="text-body-reg font-semibold text-[#101828] h-10">
                  <th className="w-12 pl-4">
                    <input
                      type="checkbox"
                      checked={paginatedGroups.length > 0 && paginatedGroups.every(g => selectedGroupIds.includes(g.id))}
                      onChange={(e) => handleSelectAllGroups(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                    />
                  </th>
                  <th className="w-24 pl-2">Mã nhóm</th>
                  <th className="w-48 pl-2">Tên nhóm</th>
                  <th className="w-80 pl-2">Mô tả chi tiết</th>
                  <th className="w-32 pl-2 text-center">Số lượng món</th>
                  <th className="w-32 pl-4 text-center">Trạng thái</th>
                  <th className="w-20 pr-4"></th>
                </tr>
              </thead>

              <tbody>
                {paginatedGroups.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-[#717680] bg-white">
                      Chưa có nhóm thực đơn nào.
                    </td>
                  </tr>
                ) : (
                  paginatedGroups.map(group => {
                    const isSelected = selectedGroupIds.includes(group.id);
                    return (
                      <tr
                        key={group.id}
                        onClick={() => handleSelectGroupRow(group.id, !isSelected)}
                        className={`h-11 border-b border-[#E9EAEB] cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#DDEAFC]' : 'hover:bg-[#DDEAFC]'
                        }`}
                      >
                        <td className="pl-4 py-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectGroupRow(group.id, e.target.checked)}
                            className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                          />
                        </td>

                        <td className="pl-2 font-mono text-xs font-semibold text-gray-500">{group.id}</td>
                        <td className="pl-2 font-medium text-[#101828] truncate">{group.name}</td>
                        <td className="pl-2 text-xs text-[#717680] truncate">{group.desc}</td>
                        <td className="pl-2 text-center text-[#101828] font-medium">{group.itemCount} món</td>

                        <td className="pl-4 text-center">
                          {group.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300">
                              Đang áp dụng
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-300">
                              Ngừng áp dụng
                            </span>
                          )}
                        </td>

                        {/* Row actions */}
                        <td className="pr-4 py-1 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip content="Đổi trạng thái áp dụng">
                              <button
                                onClick={() => {
                                  setMenuGroups(menuGroups.map(g => g.id === group.id ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g));
                                  onNotification(`Đã đổi trạng thái cho nhóm ${group.name}`, "success");
                                }}
                                className="w-7 h-7 flex items-center justify-center bg-white border border-[#D5D7DA] text-[#717680] hover:text-[#2563EB] hover:border-[#2563EB] rounded shadow-sm transition-all cursor-pointer"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Xóa nhóm">
                              <button
                                onClick={() => {
                                  setMenuGroups(prev => prev.filter(g => g.id !== group.id));
                                  setSelectedGroupIds(prev => prev.filter(id => id !== group.id));
                                  onNotification("Đã xóa nhóm thực đơn", "success");
                                }}
                                className="w-7 h-7 flex items-center justify-center bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded shadow-sm transition-all cursor-pointer"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {activeSubTab === 'so-thich' && (
            <table className="w-full text-left table-fixed">
              <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10">
                <tr className="text-body-reg font-semibold text-[#101828] h-10">
                  <th className="w-12 pl-4">
                    <input
                      type="checkbox"
                      checked={paginatedPrefs.length > 0 && paginatedPrefs.every(p => selectedPrefIds.includes(p.id))}
                      onChange={(e) => handleSelectAllPrefs(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                    />
                  </th>
                  <th className="w-24 pl-2">Mã ST</th>
                  <th className="w-48 pl-2">Sở thích phục vụ</th>
                  <th className="w-48 pl-2">Thuộc nhóm món</th>
                  <th className="w-32 pl-2 text-right">Thu thêm tiền (đ)</th>
                  <th className="w-32 pl-4 text-center">Trạng thái</th>
                  <th className="w-20 pr-4"></th>
                </tr>
              </thead>

              <tbody>
                {paginatedPrefs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-[#717680] bg-white">
                      Chưa có sở thích phục vụ nào.
                    </td>
                  </tr>
                ) : (
                  paginatedPrefs.map(pref => {
                    const isSelected = selectedPrefIds.includes(pref.id);
                    return (
                      <tr
                        key={pref.id}
                        onClick={() => handleSelectPrefRow(pref.id, !isSelected)}
                        className={`h-11 border-b border-[#E9EAEB] cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#DDEAFC]' : 'hover:bg-[#DDEAFC]'
                        }`}
                      >
                        <td className="pl-4 py-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectPrefRow(pref.id, e.target.checked)}
                            className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                          />
                        </td>

                        <td className="pl-2 font-mono text-xs font-semibold text-gray-500">{pref.id}</td>
                        <td className="pl-2 font-medium text-[#101828] truncate">{pref.name}</td>
                        <td className="pl-2 text-[#717680]">{pref.group}</td>
                        <td className="pl-2 text-right font-semibold text-[#101828]">
                          {pref.surcharge > 0 ? `+${pref.surcharge.toLocaleString('vi-VN')}` : 'Miễn phí'}
                        </td>

                        <td className="pl-4 text-center">
                          {pref.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300">
                              Đang sử dụng
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-300">
                              Ngừng sử dụng
                            </span>
                          )}
                        </td>

                        {/* Row actions */}
                        <td className="pr-4 py-1 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip content="Đổi trạng thái áp dụng">
                              <button
                                onClick={() => {
                                  setPreferences(preferences.map(p => p.id === pref.id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
                                  onNotification(`Đã đổi trạng thái cho ${pref.name}`, "success");
                                }}
                                className="w-7 h-7 flex items-center justify-center bg-white border border-[#D5D7DA] text-[#717680] hover:text-[#2563EB] hover:border-[#2563EB] rounded shadow-sm transition-all cursor-pointer"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Xóa sở thích">
                              <button
                                onClick={() => {
                                  setPreferences(prev => prev.filter(p => p.id !== pref.id));
                                  setSelectedPrefIds(prev => prev.filter(id => id !== pref.id));
                                  onNotification("Đã xóa sở thích phục vụ", "success");
                                }}
                                className="w-7 h-7 flex items-center justify-center bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded shadow-sm transition-all cursor-pointer"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {activeSubTab === 'lich-ban' && (
            <table className="w-full text-left table-fixed">
              <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10">
                <tr className="text-body-reg font-semibold text-[#101828] h-10">
                  <th className="w-12 pl-4">
                    <input
                      type="checkbox"
                      checked={paginatedSchedules.length > 0 && paginatedSchedules.every(s => selectedScheduleIds.includes(s.id))}
                      onChange={(e) => handleSelectAllSchedules(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                    />
                  </th>
                  <th className="w-24 pl-2">Mã lịch</th>
                  <th className="w-48 pl-2">Tên khung giờ</th>
                  <th className="w-64 pl-2">Các ngày áp dụng</th>
                  <th className="w-48 pl-2">Khung giờ áp dụng</th>
                  <th className="w-32 pl-2 text-center">Số món bán</th>
                  <th className="w-32 pl-4 text-center">Trạng thái</th>
                  <th className="w-20 pr-4"></th>
                </tr>
              </thead>

              <tbody>
                {paginatedSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-[#717680] bg-white">
                      Chưa có lịch bán món nào.
                    </td>
                  </tr>
                ) : (
                  paginatedSchedules.map(schedule => {
                    const isSelected = selectedScheduleIds.includes(schedule.id);
                    return (
                      <tr
                        key={schedule.id}
                        onClick={() => handleSelectScheduleRow(schedule.id, !isSelected)}
                        className={`h-11 border-b border-[#E9EAEB] cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#DDEAFC]' : 'hover:bg-[#DDEAFC]'
                        }`}
                      >
                        <td className="pl-4 py-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectScheduleRow(schedule.id, e.target.checked)}
                            className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                          />
                        </td>

                        <td className="pl-2 font-mono text-xs font-semibold text-gray-500">{schedule.id}</td>
                        <td className="pl-2 font-medium text-[#101828] truncate">{schedule.name}</td>
                        <td className="pl-2 text-xs text-[#717680] truncate">{schedule.days}</td>
                        <td className="pl-2 text-[#2563EB] font-medium">{schedule.time}</td>
                        <td className="pl-2 text-center text-[#101828] font-semibold">{schedule.itemCount} món</td>

                        <td className="pl-4 text-center">
                          {schedule.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300">
                              Đang hiệu lực
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-300">
                              Hết hiệu lực
                            </span>
                          )}
                        </td>

                        {/* Row actions */}
                        <td className="pr-4 py-1 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip content="Đổi trạng thái hiệu lực">
                              <button
                                onClick={() => {
                                  setSchedules(schedules.map(s => s.id === schedule.id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
                                  onNotification(`Đã đổi trạng thái cho ${schedule.name}`, "success");
                                }}
                                className="w-7 h-7 flex items-center justify-center bg-white border border-[#D5D7DA] text-[#717680] hover:text-[#2563EB] hover:border-[#2563EB] rounded shadow-sm transition-all cursor-pointer"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Xóa lịch bán">
                              <button
                                onClick={() => {
                                  setSchedules(prev => prev.filter(s => s.id !== schedule.id));
                                  setSelectedScheduleIds(prev => prev.filter(id => id !== schedule.id));
                                  onNotification("Đã xóa lịch bán món ăn", "success");
                                }}
                                className="w-7 h-7 flex items-center justify-center bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded shadow-sm transition-all cursor-pointer"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {activeSubTab === 'thuc-don' && (
          <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] flex items-center justify-between px-4 select-none flex-shrink-0" style={{ height: '40px' }}>
            <div className="text-body-sm text-[#717680]">
              Tổng số: <span className="font-semibold text-[#101828]">{totalCount}</span>
            </div>

            <div className="flex items-center gap-4 text-body-sm">
              <span className="text-[#717680]">Hiển thị: <span className="font-semibold text-[#101828]">{startRange} – {endRange}</span></span>

              <div className="flex items-center gap-0.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-[#101828] px-2">{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'nhom-thuc-don' && (
          <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] flex items-center justify-between px-4 select-none flex-shrink-0" style={{ height: '40px' }}>
            <div className="text-body-sm text-[#717680]">
              Tổng số nhóm: <span className="font-semibold text-[#101828]">{totalGroupCount}</span>
            </div>

            <div className="flex items-center gap-4 text-body-sm">
              <span className="text-[#717680]">Hiển thị: <span className="font-semibold text-[#101828]">{startGroupRange} – {endGroupRange}</span></span>

              <div className="flex items-center gap-0.5">
                <button
                  disabled={currentGroupPage === 1}
                  onClick={() => setCurrentGroupPage(1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentGroupPage === 1}
                  onClick={() => setCurrentGroupPage(currentGroupPage - 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-[#101828] px-2">{currentGroupPage} / {totalGroupPages}</span>
                <button
                  disabled={currentGroupPage === totalGroupPages}
                  onClick={() => setCurrentGroupPage(currentGroupPage + 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  disabled={currentGroupPage === totalGroupPages}
                  onClick={() => setCurrentGroupPage(totalGroupPages)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'so-thich' && (
          <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] flex items-center justify-between px-4 select-none flex-shrink-0" style={{ height: '40px' }}>
            <div className="text-body-sm text-[#717680]">
              Tổng số sở thích: <span className="font-semibold text-[#101828]">{totalPrefCount}</span>
            </div>

            <div className="flex items-center gap-4 text-body-sm">
              <span className="text-[#717680]">Hiển thị: <span className="font-semibold text-[#101828]">{startPrefRange} – {endPrefRange}</span></span>

              <div className="flex items-center gap-0.5">
                <button
                  disabled={currentPrefPage === 1}
                  onClick={() => setCurrentPrefPage(1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPrefPage === 1}
                  onClick={() => setCurrentPrefPage(currentPrefPage - 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-[#101828] px-2">{currentPrefPage} / {totalPrefPages}</span>
                <button
                  disabled={currentPrefPage === totalPrefPages}
                  onClick={() => setCurrentPrefPage(currentPrefPage + 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPrefPage === totalPrefPages}
                  onClick={() => setCurrentPrefPage(totalPrefPages)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'lich-ban' && (
          <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] flex items-center justify-between px-4 select-none flex-shrink-0" style={{ height: '40px' }}>
            <div className="text-body-sm text-[#717680]">
              Tổng số lịch: <span className="font-semibold text-[#101828]">{totalScheduleCount}</span>
            </div>

            <div className="flex items-center gap-4 text-body-sm">
              <span className="text-[#717680]">Hiển thị: <span className="font-semibold text-[#101828]">{startScheduleRange} – {endScheduleRange}</span></span>

              <div className="flex items-center gap-0.5">
                <button
                  disabled={currentSchedulePage === 1}
                  onClick={() => setCurrentSchedulePage(1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentSchedulePage === 1}
                  onClick={() => setCurrentSchedulePage(currentSchedulePage - 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-[#101828] px-2">{currentSchedulePage} / {totalSchedulePages}</span>
                <button
                  disabled={currentSchedulePage === totalSchedulePages}
                  onClick={() => setCurrentSchedulePage(currentSchedulePage + 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  disabled={currentSchedulePage === totalSchedulePages}
                  onClick={() => setCurrentSchedulePage(totalSchedulePages)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* 3️⃣ Create Form Popup */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white flex flex-col w-full max-w-md shadow-2xl relative" style={{ borderRadius: '12px' }}>
            <div className="flex items-center justify-between px-6 border-b border-[#E9EAEB]" style={{ height: '62px' }}>
              <h3 className="text-[#101828] font-semibold text-lg">Thêm món ăn / Đồ uống</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-[#717680] p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Tên món ăn / thức uống</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Phở bò tái gầu ngon"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                    style={{ height: '32px', borderRadius: '8px' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#717680]">Danh mục nhóm</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-2"
                      style={{ height: '32px', borderRadius: '8px' }}
                    >
                      <option value="Phở">Phở</option>
                      <option value="Món ăn kèm">Món ăn kèm</option>
                      <option value="Đồ uống">Đồ uống</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#717680]">Đơn vị tính</label>
                    <input
                      type="text"
                      required
                      placeholder="Bát, Ly, Cái..."
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                      style={{ height: '32px', borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#717680]">Đơn giá bán (đ)</label>
                    <input
                      type="number"
                      required
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                      className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                      style={{ height: '32px', borderRadius: '8px' }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#717680]">Mở bán ngay</label>
                    <select
                      value={newItem.status}
                      onChange={(e) => setNewItem({ ...newItem, status: e.target.value as any })}
                      className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-2"
                      style={{ height: '32px', borderRadius: '8px' }}
                    >
                      <option value="active">Đang bán</option>
                      <option value="inactive">Ngừng bán</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]" style={{ height: '56px' }}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Lưu món
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nhóm thực đơn Form Popup */}
      {isGroupFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white flex flex-col w-full max-w-md shadow-2xl relative" style={{ borderRadius: '12px' }}>
            <div className="flex items-center justify-between px-6 border-b border-[#E9EAEB]" style={{ height: '62px' }}>
              <h3 className="text-[#101828] font-semibold text-lg">Thêm nhóm thực đơn</h3>
              <button onClick={() => setIsGroupFormOpen(false)} className="text-[#717680] p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit}>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Tên nhóm thực đơn</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Đồ ăn nhanh, Món lẩu..."
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                    style={{ height: '32px', borderRadius: '8px' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Mô tả chi tiết</label>
                  <textarea
                    placeholder="Nhập mô tả cho nhóm thực đơn này..."
                    value={newGroup.desc}
                    onChange={(e) => setNewGroup({ ...newGroup, desc: e.target.value })}
                    className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3 py-1.5"
                    style={{ height: '64px', borderRadius: '8px', resize: 'none' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Trạng thái áp dụng</label>
                  <select
                    value={newGroup.status}
                    onChange={(e) => setNewGroup({ ...newGroup, status: e.target.value })}
                    className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-2"
                    style={{ height: '32px', borderRadius: '8px' }}
                  >
                    <option value="active">Đang áp dụng</option>
                    <option value="inactive">Ngừng áp dụng</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]" style={{ height: '56px' }}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGroupFormOpen(false)}
                    className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Lưu nhóm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sở thích phục vụ Form Popup */}
      {isPrefFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white flex flex-col w-full max-w-md shadow-2xl relative" style={{ borderRadius: '12px' }}>
            <div className="flex items-center justify-between px-6 border-b border-[#E9EAEB]" style={{ height: '62px' }}>
              <h3 className="text-[#101828] font-semibold text-lg">Thêm sở thích phục vụ</h3>
              <button onClick={() => setIsPrefFormOpen(false)} className="text-[#717680] p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrefSubmit}>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Sở thích phục vụ</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Không cay, Nhiều hành dấm..."
                    value={newPref.name}
                    onChange={(e) => setNewPref({ ...newPref, name: e.target.value })}
                    className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                    style={{ height: '32px', borderRadius: '8px' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#717680]">Thuộc nhóm món</label>
                    <select
                      value={newPref.group}
                      onChange={(e) => setNewPref({ ...newPref, group: e.target.value })}
                      className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-2"
                      style={{ height: '32px', borderRadius: '8px' }}
                    >
                      <option value="Phở">Phở</option>
                      <option value="Món ăn kèm">Món ăn kèm</option>
                      <option value="Đồ uống">Đồ uống</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#717680]">Thu thêm tiền (đ)</label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={newPref.surcharge}
                      onChange={(e) => setNewPref({ ...newPref, surcharge: Number(e.target.value) })}
                      className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                      style={{ height: '32px', borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Trạng thái sử dụng</label>
                  <select
                    value={newPref.status}
                    onChange={(e) => setNewPref({ ...newPref, status: e.target.value })}
                    className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-2"
                    style={{ height: '32px', borderRadius: '8px' }}
                  >
                    <option value="active">Đang sử dụng</option>
                    <option value="inactive">Ngừng sử dụng</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]" style={{ height: '56px' }}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPrefFormOpen(false)}
                    className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Lưu sở thích
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lịch bán món Form Popup */}
      {isScheduleFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white flex flex-col w-full max-w-md shadow-2xl relative" style={{ borderRadius: '12px' }}>
            <div className="flex items-center justify-between px-6 border-b border-[#E9EAEB]" style={{ height: '62px' }}>
              <h3 className="text-[#101828] font-semibold text-lg">Thêm lịch bán món</h3>
              <button onClick={() => setIsScheduleFormOpen(false)} className="text-[#717680] p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheduleSubmit}>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Tên khung giờ / Tên lịch bán</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Thực đơn tối đặc biệt"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                    className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                    style={{ height: '32px', borderRadius: '8px' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#717680]">Các ngày áp dụng</label>
                    <select
                      value={newSchedule.days}
                      onChange={(e) => setNewSchedule({ ...newSchedule, days: e.target.value })}
                      className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-2"
                      style={{ height: '32px', borderRadius: '8px' }}
                    >
                      <option value="Thứ 2 - Chủ nhật">Thứ 2 - Chủ nhật</option>
                      <option value="Thứ 2 - Thứ 6">Thứ 2 - Thứ 6</option>
                      <option value="Thứ 7 - Chủ nhật">Thứ 7 - Chủ nhật</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#717680]">Khung giờ áp dụng</label>
                    <input
                      type="text"
                      required
                      placeholder="06:00 - 22:00, Cả ngày..."
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                      style={{ height: '32px', borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Trạng thái hiệu lực</label>
                  <select
                    value={newSchedule.status}
                    onChange={(e) => setNewSchedule({ ...newSchedule, status: e.target.value })}
                    className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-2"
                    style={{ height: '32px', borderRadius: '8px' }}
                  >
                    <option value="active">Đang hiệu lực</option>
                    <option value="inactive">Hết hiệu lực</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]" style={{ height: '56px' }}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsScheduleFormOpen(false)}
                    className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Lưu lịch bán
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
