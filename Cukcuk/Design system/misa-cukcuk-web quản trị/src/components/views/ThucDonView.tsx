import React, { useState, useEffect } from 'react';
import { MENU_ITEMS_DATA } from '../../data';
import { MenuItem } from '../../types';
import { FilterCombobox } from '../FilterCombobox';
import { BulkActionBar } from '../BulkActionBar';
import { Tooltip } from '../Tooltip';
import { 
  Search, 
  RotateCw, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Eye, 
  Trash, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Plus, 
  X,
  Sparkles,
  FileSpreadsheet,
  UploadCloud,
  Check,
  Loader2,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';

interface ThucDonViewProps {
  onNotification: (message: string, type: 'success' | 'info') => void;
  completedSteps?: Record<number, boolean>;
  setCompletedSteps?: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  openMenuModalType?: 'none' | 'scan_image' | 'excel_import' | 'manual_entry';
  setOpenMenuModalType?: (type: 'none' | 'scan_image' | 'excel_import' | 'manual_entry') => void;
  onSendMessageToAi?: (text: string) => void;
  setActiveMenuId?: (id: string) => void;
  isMenuGuidanceActive?: boolean;
  activeMenuGuideTab?: 'excel' | 'ava' | 'manual';
  setActiveMenuGuideTab?: (tab: 'excel' | 'ava' | 'manual') => void;
  excelMenuChecklist?: any[];
  setExcelMenuChecklist?: React.Dispatch<React.SetStateAction<any[]>>;
  avaMenuChecklist?: any[];
  setAvaMenuChecklist?: React.Dispatch<React.SetStateAction<any[]>>;
  manualMenuChecklist?: any[];
  setManualMenuChecklist?: React.Dispatch<React.SetStateAction<any[]>>;
}

export const ThucDonView: React.FC<ThucDonViewProps> = ({ 
  onNotification,
  completedSteps,
  setCompletedSteps,
  openMenuModalType,
  setOpenMenuModalType,
  onSendMessageToAi,
  setActiveMenuId,
  isMenuGuidanceActive,
  activeMenuGuideTab,
  setActiveMenuGuideTab,
  excelMenuChecklist,
  setExcelMenuChecklist,
  avaMenuChecklist,
  setAvaMenuChecklist,
  manualMenuChecklist,
  setManualMenuChecklist
}) => {
  const [items, setItems] = useState<MenuItem[]>(() => {
    return completedSteps && completedSteps[2] ? MENU_ITEMS_DATA : [];
  });
  
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      if (completedSteps && completedSteps[2]) {
        setItems(MENU_ITEMS_DATA);
      } else {
        setItems([]);
      }
      setHasInitialized(true);
    }
  }, [completedSteps, hasInitialized]);

  // Sync state for local modal opening
  const [localModalType, setLocalModalType] = useState<'none' | 'scan_image' | 'excel_import' | 'manual_entry'>('none');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanPreviewDishes, setScanPreviewDishes] = useState<any[]>([]);
  const [avaWizardStep, setAvaWizardStep] = useState<1 | 2 | 3 | 4>(1);

  const [isExcelUploading, setIsExcelUploading] = useState(false);
  const [excelUploadedFile, setExcelUploadedFile] = useState<string | null>(null);
  const [excelPreviewDishes, setExcelPreviewDishes] = useState<any[]>([]);
  const [excelWizardStep, setExcelWizardStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (openMenuModalType && openMenuModalType !== 'none') {
      setLocalModalType(openMenuModalType);
      
      // Auto open form popup if manual_entry is selected
      if (openMenuModalType === 'manual_entry') {
        setIsFormOpen(true);
      }
    }
  }, [openMenuModalType]);

  const handleCloseLocalModal = () => {
    setLocalModalType('none');
    if (setOpenMenuModalType) {
      setOpenMenuModalType('none');
    }
    setIsScanning(false);
    setScanStep(0);
    setIsExcelUploading(false);
    setExcelUploadedFile(null);
    setAvaWizardStep(1);
    setExcelWizardStep(1);
  };

  const handleFinishScanAva = () => {
    const scannedItems: MenuItem[] = scanPreviewDishes.map((d, index) => ({
      id: `ava-${index + 1}`,
      name: d.name,
      category: d.category,
      price: d.price,
      unit: d.unit,
      status: 'active'
    }));
    setItems(scannedItems);
    
    if (isMenuGuidanceActive && setAvaMenuChecklist) {
      setAvaMenuChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
    }

    if (setCompletedSteps) {
      setCompletedSteps(prev => ({ ...prev, 2: true }));
    }
    
    handleCloseLocalModal();
    onNotification("Đã đồng bộ thực đơn từ ảnh thông qua MISA AVA! 🎉", "success");

    if (onSendMessageToAi) {
      onSendMessageToAi("COMPLETE_STEP2_AVA");
    }
  };

  const handleFinishImportExcel = () => {
    const excelItems: MenuItem[] = excelPreviewDishes.map((d, index) => ({
      id: `xls-${index + 1}`,
      name: d.name,
      category: d.category,
      price: d.price,
      unit: d.unit,
      status: 'active'
    }));
    setItems(excelItems);
    
    if (isMenuGuidanceActive && setExcelMenuChecklist) {
      setExcelMenuChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
    }

    if (setCompletedSteps) {
      setCompletedSteps(prev => ({ ...prev, 2: true }));
    }
    
    handleCloseLocalModal();
    onNotification("Đã nhập khẩu danh mục thực đơn từ file Excel chuẩn! 📊", "success");

    if (onSendMessageToAi) {
      onSendMessageToAi("COMPLETE_STEP2_EXCEL");
    }
  };
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    code: '',
    category: 'Phở',
    price: 50000,
    unit: 'Bát',
    status: 'active' as const,
    taxGroup: 'Dịch vụ ăn uống',
    taxRate: '8%'
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

  const updateManualChecklist = (stepId: number, isCompleted: boolean) => {
    if (isMenuGuidanceActive && setManualMenuChecklist) {
      setManualMenuChecklist(prev => prev.map(item => item.id === stepId ? { ...item, isCompleted } : item));
    }
  };

  const updateExcelChecklist = (stepId: number, isCompleted: boolean) => {
    if (isMenuGuidanceActive && setExcelMenuChecklist) {
      setExcelMenuChecklist(prev => prev.map(item => item.id === stepId ? { ...item, isCompleted } : item));
    }
  };

  const updateAvaChecklist = (stepId: number, isCompleted: boolean) => {
    if (isMenuGuidanceActive && setAvaMenuChecklist) {
      setAvaMenuChecklist(prev => prev.map(item => item.id === stepId ? { ...item, isCompleted } : item));
    }
  };

  // Form Submits
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemCode = newItem.code.trim() || `m${items.length + 1}`;
    const createdItem: MenuItem = {
      id: itemCode,
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      unit: newItem.unit,
      status: newItem.status
    };
    setItems([createdItem, ...items]);
    setIsFormOpen(false);
    
    // Complete manual checklist Step 5
    updateManualChecklist(5, true);

    setNewItem({ 
      name: '', 
      code: '', 
      category: 'Phở', 
      price: 50000, 
      unit: 'Bát', 
      status: 'active',
      taxGroup: 'Dịch vụ ăn uống',
      taxRate: '8%'
    });
    onNotification(`Đã thêm món "${createdItem.name}" (Mã: ${itemCode}) vào thực đơn`, "success");

    // Automatically complete Step 2 if not completed yet
    if (completedSteps && !completedSteps[2]) {
      if (setCompletedSteps) {
        setCompletedSteps(prev => ({ ...prev, 2: true }));
      }
      if (onSendMessageToAi) {
        onSendMessageToAi('COMPLETE_STEP2_MANUAL');
      }
    }
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
            <h2 className="text-[#101828] font-semibold text-xl flex items-center gap-2">
              {activeSubTab === 'thuc-don' && (
                <>
                  <span>Quản lý thực đơn</span>
                  <span className="bg-[#EFF6FF] text-[#2563EB] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#DBEAFE] animate-pulse">
                    {items.length} món
                  </span>
                </>
              )}
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
            Thực đơn ({items.length})
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
        {completedSteps && !completedSteps[2] && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-fade-in flex-shrink-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  Bạn đang thực hiện Bước 2: Khai báo thực đơn (Thêm trực tiếp trên phần mềm)
                </h4>
                <p className="text-[11px] text-blue-700 leading-relaxed mt-0.5">
                  Hãy thêm trực tiếp các món ăn, đồ uống của nhà hàng bằng nút <strong>Thêm</strong> bên dưới. Nhấn vào nút bên phải khi hoàn tất để quay lại Bàn làm việc!
                </p>
              </div>
            </div>
            {setActiveMenuId && setCompletedSteps && (
              <button
                onClick={() => {
                  setCompletedSteps(prev => ({ ...prev, 2: true }));
                  setActiveMenuId('ban-lam-viec');
                  onNotification("Tuyệt vời! Đã hoàn thành Bước 2: Khai báo thực đơn và quay lại Bàn làm việc.", "success");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
              >
                Xác nhận hoàn thành & Quay lại
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        {completedSteps && completedSteps[2] && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-fade-in flex-shrink-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  Khai báo thực đơn thành công! (Bước 2 hoàn tất)
                </h4>
                <p className="text-[11px] text-emerald-700 leading-relaxed mt-0.5">
                  Trợ lý **MISA AVA** đã tự động đồng bộ danh sách món ăn vào hệ thống. Bạn đã sẵn sàng để tiếp tục thiết lập ban đầu?
                </p>
              </div>
            </div>
            {setActiveMenuId && (
              <button
                onClick={() => {
                  setActiveMenuId('ban-lam-viec');
                  onNotification("Đã chuyển sang Bàn làm việc để thực hiện Bước 3: Khai báo nhân viên!", "success");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
              >
                Tiếp tục sang Bước 3
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
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
        <div className="flex-1 overflow-auto flex flex-col">
          {activeSubTab === 'thuc-don' && items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-gray-200 m-4 rounded-xl select-none">
              <div className="w-16 h-16 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4 shadow-xs">
                <Sparkles className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="text-lg font-bold text-[#101828] mb-2">Thực đơn chưa có món ăn nào</h3>
              <p className="text-xs text-[#717680] max-w-lg mb-8 leading-relaxed font-medium">
                Để bắt đầu vận hành bán hàng và in hóa đơn, vui lòng khai báo danh mục món ăn của nhà hàng bạn bằng một trong ba phương thức thông minh dưới đây:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                {/* Option 1: MISA AVA */}
                <div className="bg-slate-50/50 hover:bg-indigo-50/25 border-2 border-slate-200 hover:border-indigo-300 rounded-xl p-5 flex flex-col justify-between items-center transition-all hover:shadow-xs duration-300 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1.5 text-center leading-tight">1. Khai báo bằng MISA AVA</h4>
                    <p className="text-[10px] text-slate-500 text-center leading-relaxed font-medium mb-4">
                      Tự động nhận diện thực đơn thông minh bằng công nghệ AI từ ảnh chụp thực đơn giấy hoặc bảng hiệu.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setLocalModalType('scan_image');
                      onNotification("Bắt đầu quy trình quét hình ảnh thông minh bằng AI!", "success");
                    }}
                    className="w-full text-xs font-bold py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Quét hình ảnh bằng AI
                  </button>
                </div>

                {/* Option 2: Excel */}
                <div className="bg-slate-50/50 hover:bg-emerald-50/25 border-2 border-slate-200 hover:border-emerald-300 rounded-xl p-5 flex flex-col justify-between items-center transition-all hover:shadow-xs duration-300 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1.5 text-center leading-tight">2. Nhập khẩu bằng Excel</h4>
                    <p className="text-[10px] text-slate-500 text-center leading-relaxed font-medium mb-4">
                      Tải lên danh mục món ăn hàng loạt cực kỳ nhanh chóng bằng file Excel biểu mẫu chuẩn của MISA CukCuk.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setLocalModalType('excel_import');
                      onNotification("Mở giao diện nhập khẩu tệp Excel!", "success");
                    }}
                    className="w-full text-xs font-bold py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Nhập khẩu bằng Excel
                  </button>
                </div>

                {/* Option 3: Manual */}
                <div className="bg-slate-50/50 hover:bg-blue-50/25 border-2 border-slate-200 hover:border-blue-300 rounded-xl p-5 flex flex-col justify-between items-center transition-all hover:shadow-xs duration-300 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Plus className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1.5 text-center leading-tight">3. Khai báo thủ công</h4>
                    <p className="text-[10px] text-slate-500 text-center leading-relaxed font-medium mb-4">
                      Tự thêm thủ công từng món ăn chi tiết, nhập tên món, nhóm món ăn và giá bán tương ứng.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsFormOpen(true);
                    }}
                    className="w-full text-xs font-bold py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Thêm món thủ công
                  </button>
                </div>
              </div>
            </div>
          ) : activeSubTab === 'thuc-don' ? (
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
          ) : null}

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

      {/* 🤖 MISA AVA Intelligent Scanner Modal */}
      {localModalType === 'scan_image' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-white flex flex-col w-full max-w-xl shadow-2xl relative" style={{ borderRadius: '16px' }}>
            <div className="flex items-center justify-between px-6 border-b border-[#E9EAEB]" style={{ height: '64px' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-[#101828] font-bold text-base leading-tight">Tạo thực đơn bằng MISA AVA</h3>
                  <p className="text-[10px] text-gray-500 font-medium">Bóc tách món ăn bằng trí tuệ nhân tạo từ ảnh</p>
                </div>
              </div>
              <button onClick={handleCloseLocalModal} className="text-[#717680] p-1.5 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="bg-indigo-50/40 border-b border-indigo-100/50 px-6 py-3 flex items-center justify-between text-[11px] font-semibold text-gray-500 select-none">
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${avaWizardStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
                <span className={avaWizardStep === 1 ? 'text-indigo-700 font-bold' : avaWizardStep > 1 ? 'text-indigo-900' : ''}>Tải ảnh</span>
              </div>
              <div className="h-px bg-indigo-200 flex-1 mx-3" />
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${avaWizardStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
                <span className={avaWizardStep === 2 ? 'text-indigo-700 font-bold' : avaWizardStep > 2 ? 'text-indigo-900' : ''}>Tạo thực đơn</span>
              </div>
              <div className="h-px bg-indigo-200 flex-1 mx-3" />
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${avaWizardStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
                <span className={avaWizardStep === 3 ? 'text-indigo-700 font-bold' : avaWizardStep > 3 ? 'text-indigo-900' : ''}>Cập nhật</span>
              </div>
              <div className="h-px bg-indigo-200 flex-1 mx-3" />
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${avaWizardStep >= 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>4</span>
                <span className={avaWizardStep === 4 ? 'text-indigo-700 font-bold' : ''}>Lưu</span>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              
              {/* STEP 1: TẢI ẢNH THỰC ĐƠN */}
              {avaWizardStep === 1 && !isScanning && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-gray-500 font-medium">
                    <strong>Bước 1:</strong> Bạn hãy tải lên tệp ảnh chụp bảng giá thực đơn của nhà hàng hoặc biểu hiệu. AVA sẽ quét để bóc tách món ăn.
                  </p>
                  
                  {/* Drop zone click simulation */}
                  <div 
                    onClick={() => {
                      updateAvaChecklist(1, true);
                      setScanPreviewDishes([
                        { name: 'Phở Bò Chín', category: 'Phở', price: 50000, unit: 'Bát' },
                        { name: 'Phở Gà Ta', category: 'Phở', price: 45000, unit: 'Bát' },
                        { name: 'Quẩy Giòn', category: 'Món ăn kèm', price: 10000, unit: 'Đĩa' },
                        { name: 'Trứng Chần', category: 'Món ăn kèm', price: 5000, unit: 'Quả' },
                        { name: 'Cam Ép Tươi', category: 'Đồ uống', price: 30000, unit: 'Cốc' },
                        { name: 'Trà Đá', category: 'Đồ uống', price: 5000, unit: 'Cốc' },
                      ]);
                      setAvaWizardStep(2);
                      onNotification("Đã tải lên ảnh chụp thực đơn thành công!", "success");
                    }}
                    className="border-2 border-dashed border-[#D5D7DA] hover:border-indigo-500 hover:bg-indigo-50/20 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-[#E9EAEB]">
                      <UploadCloud className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-indigo-600">Click để chọn ảnh chụp thực đơn</span>
                      <span className="text-xs text-gray-500"> hoặc kéo thả vào đây</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Hỗ trợ JPG, PNG, WEBP tối đa 10MB</p>
                  </div>

                  {/* Sample selection option */}
                  <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-indigo-200 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-900">Sử dụng ảnh thực đơn mẫu chuẩn</h4>
                        <p className="text-[10px] text-indigo-600 font-medium mt-0.5">Tệp menu_restaurant_pho.png sẵn có</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateAvaChecklist(1, true);
                        setScanPreviewDishes([
                          { name: 'Phở Bò Chín', category: 'Phở', price: 50000, unit: 'Bát' },
                          { name: 'Phở Gà Ta', category: 'Phở', price: 45000, unit: 'Bát' },
                          { name: 'Quẩy Giòn', category: 'Món ăn kèm', price: 10000, unit: 'Đĩa' },
                          { name: 'Trứng Chần', category: 'Món ăn kèm', price: 5000, unit: 'Quả' },
                          { name: 'Cam Ép Tươi', category: 'Đồ uống', price: 30000, unit: 'Cốc' },
                          { name: 'Trà Đá', category: 'Đồ uống', price: 5000, unit: 'Cốc' },
                        ]);
                        setAvaWizardStep(2);
                        onNotification("Đã chọn tệp thực đơn mẫu chuẩn của quán Phở!", "success");
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Sử dụng mẫu
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: NHẤN TẠO THỰC ĐƠN */}
              {avaWizardStep === 2 && !isScanning && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-indigo-200 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Ảnh thực đơn: menu_restaurant_pho.png</h4>
                      <p className="text-[10px] text-gray-500 font-medium">Đã tải lên và sẵn sàng xử lý bóc tách</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    <strong>Bước 2:</strong> Bạn vui lòng nhấn nút <strong>"Tạo thực đơn"</strong> bên dưới để trợ lý MISA AVA sử dụng AI nhận diện và trích xuất danh sách món ăn từ ảnh chụp.
                  </p>

                  <div className="flex flex-col items-center justify-center py-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsScanning(true);
                        setScanStep(1);
                        setTimeout(() => setScanStep(2), 500);
                        setTimeout(() => setScanStep(3), 1000);
                        setTimeout(() => setScanStep(4), 1500);
                        setTimeout(() => {
                          setIsScanning(false);
                          updateAvaChecklist(2, true);
                          setAvaWizardStep(3);
                          onNotification("MISA AVA đã bóc tách dữ liệu thành công!", "success");
                        }, 2000);
                      }}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-200 cursor-pointer flex items-center gap-2 text-xs transition-all animate-pulse"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Nhấn Tạo thực đơn
                    </button>
                    <p className="text-[10px] text-gray-400 font-semibold mt-3">Quá trình quét và bóc tách AI mất khoảng 2 giây</p>
                  </div>
                </div>
              )}

              {/* IS SCANNING ANIMATION WITH DETAILED OCR LOGS */}
              {isScanning && (
                <div className="py-6 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin flex items-center justify-center"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-1 w-full max-w-sm mt-1">
                    <h4 className="text-sm font-bold text-slate-800">MISA AVA đang trích xuất dữ liệu...</h4>
                    <p className="text-[11px] text-gray-500 font-medium">Hệ thống đang bóc tách ký tự quang học thông minh</p>
                  </div>

                  {/* Progress Logs */}
                  <div className="w-full bg-slate-50 border border-slate-150 rounded-xl p-4 text-left font-mono text-[10px] space-y-2 mt-2 text-slate-600">
                    <div className="flex items-center gap-2">
                      {scanStep >= 1 ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />}
                      <span className={scanStep >= 1 ? "text-slate-800 font-semibold" : ""}>[1/4] Truyền tải và tối ưu hóa ảnh thực đơn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {scanStep >= 2 ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : scanStep === 1 ? <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" /> : <span className="text-gray-300">●</span>}
                      <span className={scanStep >= 2 ? "text-slate-800 font-semibold" : scanStep === 1 ? "text-indigo-600" : "text-gray-400"}>[2/4] Nhận diện ký tự quang học (OCR AI)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {scanStep >= 3 ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : scanStep === 2 ? <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" /> : <span className="text-gray-300">●</span>}
                      <span className={scanStep >= 3 ? "text-slate-800 font-semibold" : scanStep === 2 ? "text-indigo-600" : "text-gray-400"}>[3/4] Trích xuất danh sách món, nhóm món và đơn giá</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {scanStep >= 4 ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : scanStep === 3 ? <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" /> : <span className="text-gray-300">●</span>}
                      <span className={scanStep >= 4 ? "text-slate-800 font-semibold" : scanStep === 3 ? "text-indigo-600" : "text-gray-400"}>[4/4] Tự động đồng hóa cấu trúc dữ liệu CukCuk</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CẬP NHẬT THÔNG TIN NẾU CẦN (WITH INLINE EDITABLE FORM) */}
              {avaWizardStep === 3 && !isScanning && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <p className="text-xs font-semibold">
                      <strong>Bước 3:</strong> Nhận diện thành công 6 món ăn! Bạn có thể chỉnh sửa trực tiếp thông tin nếu cần trước khi lưu.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left table-fixed">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 h-8 sticky top-0">
                        <tr>
                          <th className="pl-3 w-[45%]">Tên món</th>
                          <th className="w-[20%]">Nhóm món</th>
                          <th className="w-[15%] text-center">ĐVT</th>
                          <th className="w-[20%] text-right pr-3">Đơn giá</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] text-slate-600 divide-y divide-slate-100 bg-white">
                        {scanPreviewDishes.map((dish, i) => (
                          <tr key={i} className="h-10 hover:bg-slate-50">
                            <td className="pl-2 py-1">
                              <input
                                type="text"
                                value={dish.name}
                                onChange={(e) => {
                                  const updated = [...scanPreviewDishes];
                                  updated[i].name = e.target.value;
                                  setScanPreviewDishes(updated);
                                }}
                                className="w-full text-[11px] font-semibold text-slate-800 border border-slate-200 px-1.5 rounded focus:border-indigo-500 focus:outline-none"
                                style={{ height: '26px' }}
                              />
                            </td>
                            <td className="py-1">
                              <select
                                value={dish.category}
                                onChange={(e) => {
                                  const updated = [...scanPreviewDishes];
                                  updated[i].category = e.target.value;
                                  setScanPreviewDishes(updated);
                                }}
                                className="w-full text-[11px] text-slate-700 bg-white border border-slate-200 px-1 rounded focus:border-indigo-500 focus:outline-none"
                                style={{ height: '26px' }}
                              >
                                <option value="Phở">Phở</option>
                                <option value="Món ăn kèm">Món ăn kèm</option>
                                <option value="Đồ uống">Đồ uống</option>
                              </select>
                            </td>
                            <td className="py-1 text-center">
                              <input
                                type="text"
                                value={dish.unit}
                                onChange={(e) => {
                                  const updated = [...scanPreviewDishes];
                                  updated[i].unit = e.target.value;
                                  setScanPreviewDishes(updated);
                                }}
                                className="w-12 text-[11px] text-slate-600 border border-slate-200 px-1 rounded text-center focus:border-indigo-500 focus:outline-none"
                                style={{ height: '26px', margin: '0 auto' }}
                              />
                            </td>
                            <td className="py-1 pr-2">
                              <input
                                type="number"
                                value={dish.price}
                                onChange={(e) => {
                                  const updated = [...scanPreviewDishes];
                                  updated[i].price = Number(e.target.value);
                                  setScanPreviewDishes(updated);
                                }}
                                className="w-full text-[11px] font-mono font-bold text-slate-800 border border-slate-200 px-1.5 rounded text-right focus:border-indigo-500 focus:outline-none"
                                style={{ height: '26px' }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateAvaChecklist(3, true);
                        setAvaWizardStep(4);
                        onNotification("Đã cập nhật thông tin thực đơn!", "success");
                      }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      Tiếp tục đến Bước 4
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: NHẤN LƯU */}
              {avaWizardStep === 4 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-indigo-950 mb-1">Xác nhận Lưu thực đơn</h4>
                    <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
                      <strong>Bước 4:</strong> Hãy kiểm tra kỹ lại một lần nữa trước khi nhấn Lưu. Nhấn nút <strong>"Lưu"</strong> ở góc phải bên dưới để chính thức nạp danh sách 6 món vào thực đơn chính.
                    </p>
                  </div>

                  <div className="bg-[#FAFAFA] border border-slate-150 rounded-xl p-4 flex justify-between items-center text-xs text-slate-700">
                    <div>
                      <div className="font-bold text-slate-900">Nhà hàng Phong Dê</div>
                      <div className="text-[10px] text-gray-500 font-semibold">Thực đơn quét bởi MISA AVA</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-indigo-600 text-sm block">6 món ăn</span>
                      <span className="text-[10px] text-gray-400 font-semibold">Trạng thái: Sẵn sàng</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]" style={{ height: '64px', borderRadius: '0 0 16px 16px' }}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseLocalModal}
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-semibold px-4 text-xs select-none cursor-pointer"
                  style={{ height: '36px', borderRadius: '8px' }}
                >
                  Hủy
                </button>
                {avaWizardStep === 4 && (
                  <button
                    type="button"
                    onClick={handleFinishScanAva}
                    className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold px-5 text-xs select-none cursor-pointer flex items-center gap-1.5 shadow-xs"
                    style={{ height: '36px', borderRadius: '8px' }}
                  >
                    Lưu
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📊 Excel Import Modal */}
      {localModalType === 'excel_import' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-white flex flex-col w-full max-w-lg shadow-2xl relative" style={{ borderRadius: '16px' }}>
            <div className="flex items-center justify-between px-6 border-b border-[#E9EAEB]" style={{ height: '64px' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-[#101828] font-bold text-base leading-tight">Nhập khẩu thực đơn từ Excel</h3>
                  <p className="text-[10px] text-gray-500 font-medium">Khai báo danh mục món ăn hàng loạt</p>
                </div>
              </div>
              <button onClick={handleCloseLocalModal} className="text-[#717680] p-1.5 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="bg-emerald-50/40 border-b border-emerald-100/50 px-6 py-3 flex items-center justify-between text-[11px] font-semibold text-gray-500 select-none">
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${excelWizardStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
                <span className={excelWizardStep === 1 ? 'text-emerald-700 font-bold' : excelWizardStep > 1 ? 'text-emerald-900' : ''}>Tải file dữ liệu</span>
              </div>
              <div className="h-px bg-emerald-200 flex-1 mx-4" />
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${excelWizardStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
                <span className={excelWizardStep === 2 ? 'text-emerald-700 font-bold' : excelWizardStep > 2 ? 'text-emerald-900' : ''}>Chọn Tiếp tục</span>
              </div>
              <div className="h-px bg-emerald-200 flex-1 mx-4" />
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${excelWizardStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
                <span className={excelWizardStep === 3 ? 'text-emerald-700 font-bold' : ''}>Chọn Thực hiện</span>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              
              {/* STEP 1: TẢI FILE DỮ LIỆU */}
              {excelWizardStep === 1 && !isExcelUploading && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-[#F8F9FA] border border-[#E9EAEB] rounded-xl p-4 space-y-3 text-left">
                    <h4 className="text-xs font-bold text-slate-800">Quy trình chuẩn bị tệp:</h4>
                    <ol className="text-[11px] text-gray-500 space-y-1.5 pl-4 list-decimal font-medium">
                      <li>Tải tệp mẫu Excel chuẩn của MISA CukCuk: <a href="#" className="text-[#2563EB] hover:underline font-bold" onClick={(e) => { e.preventDefault(); onNotification("Đã tải tệp mẫu CukCuk_Menu_Import_Template.xlsx xuống máy tính của bạn!", "info"); }}>[Tải tệp mẫu excel chuẩn]</a></li>
                      <li>Điền danh sách các món ăn của quán vào tệp mẫu vừa tải.</li>
                      <li>Kéo thả tệp excel của bạn vào khung bên dưới để đồng bộ nhanh.</li>
                    </ol>
                  </div>

                  <div 
                    onClick={() => {
                      setIsExcelUploading(true);
                      setTimeout(() => {
                        setIsExcelUploading(false);
                        updateExcelChecklist(1, true);
                        setExcelUploadedFile("ThucDon_NhahangPhoHanoi_2026.xlsx");
                        setExcelPreviewDishes([
                          { name: 'Phở Bò Tái Lăn', category: 'Phở', price: 55000, unit: 'Bát' },
                          { name: 'Phở Bò Sốt Vang', category: 'Phở', price: 60000, unit: 'Bát' },
                          { name: 'Quẩy Khô', category: 'Món ăn kèm', price: 2000, unit: 'Cái' },
                          { name: 'Pepsi Cô-ca', category: 'Đồ uống', price: 15000, unit: 'Lon' }
                        ]);
                        setExcelWizardStep(2);
                        onNotification("Tải file dữ liệu thành công! Nhấn Tiếp tục ở Bước 2", "success");
                      }, 1000);
                    }}
                    className="border-2 border-dashed border-[#D5D7DA] hover:border-emerald-500 hover:bg-emerald-50/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-[#E9EAEB]">
                      <UploadCloud className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-emerald-600">Click để tải file dữ liệu lên</span>
                      <span className="text-xs text-gray-500"> hoặc kéo thả vào đây</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Hỗ trợ định dạng XLS, XLSX tối đa 5MB</p>
                  </div>

                  {/* Quick demo trigger */}
                  <div className="text-center">
                    <span className="text-[11px] text-gray-400">Bạn muốn thử nhanh? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsExcelUploading(true);
                        setTimeout(() => {
                          setIsExcelUploading(false);
                          updateExcelChecklist(1, true);
                          setExcelUploadedFile("ThucDon_NhahangPhoHanoi_2026.xlsx");
                          setExcelPreviewDishes([
                            { name: 'Phở Bò Tái Lăn', category: 'Phở', price: 55000, unit: 'Bát' },
                            { name: 'Phở Bò Sốt Vang', category: 'Phở', price: 60000, unit: 'Bát' },
                            { name: 'Quẩy Khô', category: 'Món ăn kèm', price: 2000, unit: 'Cái' },
                            { name: 'Pepsi Cô-ca', category: 'Đồ uống', price: 15000, unit: 'Lon' }
                          ]);
                          setExcelWizardStep(2);
                          onNotification("Đã nạp file dữ liệu mẫu thành công!", "success");
                        }, 1000);
                      }}
                      className="text-[11px] text-[#2563EB] hover:underline font-bold cursor-pointer"
                    >
                      Sử dụng tệp excel giả định của quán Phở
                    </button>
                  </div>
                </div>
              )}

              {isExcelUploading && (
                <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin flex items-center justify-center"></div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-800">Đang đọc và phân tích dữ liệu Excel...</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Vui lòng đợi trong giây lát</p>
                  </div>
                </div>
              )}

              {/* STEP 2: CHỌN TIẾP TỤC */}
              {excelWizardStep === 2 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 text-emerald-850 px-4 py-3 rounded-xl">
                    <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950">{excelUploadedFile}</h4>
                      <p className="text-[10px] text-emerald-700 font-medium">Tìm thấy <strong className="font-bold text-emerald-950">4 món ăn hợp lệ</strong> chuẩn bị đồng bộ.</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    <strong>Bước 2:</strong> Vui lòng xem trước danh sách món ăn từ tệp dưới đây và nhấn nút <strong>"Chọn Tiếp tục"</strong> ở góc phải bên dưới để chuyển sang bước thực hiện.
                  </p>

                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left table-fixed">
                      <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] text-[11px] font-bold text-slate-700 h-8 sticky top-0">
                        <tr>
                          <th className="pl-3 w-1/2">Tên món</th>
                          <th className="w-1/4">Nhóm món</th>
                          <th className="w-1/4 text-right pr-3">Đơn giá</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] text-slate-600 divide-y divide-slate-100 bg-white">
                        {excelPreviewDishes.map((dish, i) => (
                          <tr key={i} className="h-8 hover:bg-slate-50">
                            <td className="pl-3 font-semibold text-slate-800 truncate">{dish.name}</td>
                            <td>{dish.category}</td>
                            <td className="text-right pr-3 font-mono font-bold text-slate-800">{dish.price.toLocaleString('vi-VN')} đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateExcelChecklist(2, true);
                        setExcelWizardStep(3);
                        onNotification("Nhấn Chọn Thực hiện ở Bước 3 để hoàn tất nhập khẩu!", "success");
                      }}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      Chọn Tiếp tục
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CHỌN THỰC HIỆN */}
              {excelWizardStep === 3 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-emerald-950 mb-1">Xác nhận Thực hiện nhập khẩu</h4>
                    <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                      <strong>Bước 3:</strong> Bạn đã hoàn tất chuẩn bị và xem trước. Hãy nhấn nút <strong>"Chọn Thực hiện"</strong> ở góc phải bên dưới để chính thức nhập khẩu 4 món ăn này vào phần mềm.
                    </p>
                  </div>

                  <div className="bg-[#FAFAFA] border border-slate-150 rounded-xl p-4 flex justify-between items-center text-xs text-slate-700">
                    <div>
                      <div className="font-bold text-slate-900">Nguồn tệp dữ liệu: Excel SpreadSheet</div>
                      <div className="text-[10px] text-gray-500 font-semibold">Tên file: {excelUploadedFile}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 text-sm block">4 món ăn</span>
                      <span className="text-[10px] text-gray-400 font-semibold">Phần mềm: MISA CukCuk</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]" style={{ height: '64px', borderRadius: '0 0 16px 16px' }}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseLocalModal}
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-semibold px-4 text-xs select-none cursor-pointer"
                  style={{ height: '36px', borderRadius: '8px' }}
                >
                  Hủy
                </button>
                {excelWizardStep === 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      updateExcelChecklist(3, true);
                      handleFinishImportExcel();
                    }}
                    className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold px-5 text-xs select-none cursor-pointer shadow-xs"
                    style={{ height: '36px', borderRadius: '8px' }}
                  >
                    Chọn Thực hiện
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
