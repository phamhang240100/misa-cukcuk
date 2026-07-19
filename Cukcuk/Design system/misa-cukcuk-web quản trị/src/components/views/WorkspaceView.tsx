import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  Check, 
  Circle, 
  ArrowRight, 
  Plus, 
  Send, 
  Bot, 
  FileText, 
  TrendingUp, 
  UserCheck, 
  CreditCard, 
  Percent, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  RefreshCw,
  RotateCw,
  Search,
  BookOpen,
  Settings,
  HelpCircle,
  Info,
  Monitor,
  Server,
  Smartphone,
  Tablet,
  Tv,
  Download,
  Play,
  QrCode,
  Video,
  X,
  ChefHat,
  Receipt,
  Briefcase,
  Users,
  Printer,
  PlusCircle,
  Trash2,
  Trash,
  UploadCloud,
  Image,
  Edit,
  XCircle,
  Eye,
  EyeOff,
  Mail,
  Feather,
  Cpu,
  Lock,
  User,
  Phone,
  Headphones,
  LayoutGrid,
  Share2,
  Copy,
  FilePlus
} from 'lucide-react';

const OrderStaffIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 12H15M9 16H15" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const getItemType = (dish: any): string => {
  if (dish.itemType) return dish.itemType;
  const typeLower = (dish.type || '').toLowerCase();
  const nameLower = (dish.name || '').toLowerCase();
  if (typeLower.includes('bia') || typeLower.includes('uống') || nameLower.includes('bia') || nameLower.includes('rượu') || nameLower.includes('nước') || nameLower.includes('coca') || nameLower.includes('tiger') || nameLower.includes('heineken') || nameLower.includes('aquafina') || nameLower.includes('lon') || nameLower.includes('chai')) {
    return 'Đồ uống';
  }
  if (typeLower.includes('combo') || nameLower.includes('combo')) {
    return 'Combo';
  }
  return 'Đồ ăn';
};

const getCookingAreas = (dish: any): string[] => {
  if (dish.cookingAreas !== undefined && Array.isArray(dish.cookingAreas)) return dish.cookingAreas;
  const itemType = getItemType(dish);
  if (itemType === 'Đồ uống') {
    return ['Bar'];
  }
  return ['Bếp'];
};

interface CookingAreasSelectorProps {
  values: string[];
  kitchenAreas: any[];
  onChange: (updated: string[]) => void;
  onAddArea?: (newAreaName: string) => void;
  onOpenAddAreaPopup?: () => void;
  borderless?: boolean;
  large?: boolean;
  text13?: boolean;
}

const CookingAreasSelector = ({ values, kitchenAreas, onChange, onAddArea, onOpenAddAreaPopup, borderless, large, text13 }: CookingAreasSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleArea = (areaName: string) => {
    if (values.includes(areaName)) {
      onChange(values.filter(v => v !== areaName));
    } else {
      onChange([...values, areaName]);
    }
  };

  const availableAreas = kitchenAreas.map((k: any) => k.name);
  if (availableAreas.length === 0) availableAreas.push('Bếp', 'Bar');

  const handleAddQuickArea = () => {
    const trimmed = newAreaName.trim();
    if (!trimmed) return;
    if (availableAreas.includes(trimmed)) {
      setNewAreaName('');
      return;
    }
    if (onAddArea) {
      onAddArea(trimmed);
    }
    // Mặc định check luôn khu vực mới thêm
    onChange([...values, trimmed]);
    setNewAreaName('');
  };

  return (
    <div className="relative inline-block w-full text-slate-800" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between select-none transition-all cursor-pointer ${
          large
            ? 'h-[36px] px-3 text-[13px] font-semibold text-[#101828] border border-[#D5D7DA] focus-within:border-[#245FDF] rounded-lg bg-white hover:bg-slate-50'
            : borderless
              ? `h-8 px-2.5 ${text13 ? 'text-[13px]' : 'text-[11px]'} font-bold text-slate-700 border-none bg-slate-50 hover:bg-slate-100/80 rounded-lg`
              : `h-8 px-2.5 ${text13 ? 'text-[13px]' : 'text-[11px]'} font-bold text-slate-700 border border-slate-300 rounded bg-white hover:bg-slate-50 focus-within:ring-1 focus-within:ring-[#245FDF]`
        }`}
      >
        <div
          className="flex-1 truncate h-full flex items-center"
        >
          <span className="truncate">{values.length === 0 ? '(Chưa chọn)' : values.join(', ')}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
          <ChevronDown
            className="w-3.5 h-3.5 text-[#6B707A]"
          />
          {onOpenAddAreaPopup && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAddAreaPopup();
              }}
              className="p-1 hover:bg-[#F0F6FE] rounded text-[#245FDF] hover:text-[#245FDF] transition-colors cursor-pointer flex items-center justify-center border-none bg-transparent shadow-none"
              title="Thêm Bếp/Bar"
            >
              <Plus className="w-3 h-3 stroke-[3.5]" />
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] p-2 text-left w-[300px] flex flex-col">
          <div className="max-h-36 overflow-y-auto pr-1 flex flex-col gap-0.5">
            {availableAreas.map((areaName: string) => {
              const checked = values.includes(areaName);
              return (
                <label key={areaName} className="flex items-center gap-2 px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer text-[13px] font-semibold text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArea(areaName)}
                    className="rounded border-slate-300 text-[#245FDF] focus:ring-[#245FDF] w-3.5 h-3.5"
                  />
                  <span>{areaName}</span>
                </label>
              );
            })}
          </div>
          
          {!onOpenAddAreaPopup && (
            <div className="border-t border-slate-100 pt-2 mt-2 px-0.5 pb-0.5">
              <div className="flex gap-1.5 items-center">
                <input
                  type="text"
                  placeholder="Thêm khu vực..."
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  className="flex-1 h-8 px-2 border border-slate-200 rounded-md text-[13px] font-normal focus:ring-1 focus:ring-blue-500 bg-white focus:outline-hidden"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddQuickArea();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddQuickArea();
                  }}
                  className="px-3 h-8 bg-[#245FDF] hover:bg-blue-700 text-white rounded-md text-[13px] font-bold cursor-pointer transition-colors flex-shrink-0"
                >
                  Thêm mới
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const VUON_BIA_DISHES = [
  { name: 'Lẩu dê Phong Dê đặc biệt', code: 'MA01', type: 'Lẩu', unit: 'Nồi', price: 390000, rateOrGroup: '8%' },
  { name: 'Dê tái chanh Phong Dê', code: 'MA02', type: 'Món chính', unit: 'Đĩa', price: 185000, rateOrGroup: '8%' },
  { name: 'Dê nướng tảng Phong Dê', code: 'MA03', type: 'Món chính', unit: 'Đĩa', price: 250000, rateOrGroup: '8%' },
  { name: 'Đùi dê đút lò Phong Dê', code: 'MA04', type: 'Món chính', unit: 'Cái', price: 1200000, rateOrGroup: '8%' },
  { name: 'Cơm cháy sốt dê Phong Dê', code: 'MA05', type: 'Khai vị', unit: 'Đĩa', price: 95000, rateOrGroup: '8%' },
  { name: 'Gỏi tai dê Phong Dê', code: 'MA06', type: 'Khai vị', unit: 'Đĩa', price: 120000, rateOrGroup: '8%' },
  { name: 'Súp dê hầm sâm Phong Dê', code: 'MA07', type: 'Khai vị', unit: 'Bát', price: 65000, rateOrGroup: '8%' },
  { name: 'Dê xào lăn Phong Dê', code: 'MA08', type: 'Món chính', unit: 'Đĩa', price: 175000, rateOrGroup: '8%' },
  { name: 'Bia hơi Hà Nội (Ly 500ml)', code: 'DU01', type: 'Bia & Đồ uống', unit: 'Ly', price: 20000, rateOrGroup: '10%' },
  { name: 'Bia tươi Tiger Draft (Ly 330ml)', code: 'DU02', type: 'Bia & Đồ uống', unit: 'Ly', price: 35000, rateOrGroup: '10%' },
  { name: 'Rượu mơ Yên Tử hảo hạng', code: 'DU03', type: 'Bia & Đồ uống', unit: 'Chai', price: 180000, rateOrGroup: '10%' },
  { name: 'Nước suối Aquafina 500ml', code: 'DU04', type: 'Bia & Đồ uống', unit: 'Chai', price: 15000, rateOrGroup: '8%' },
  { name: 'Chả dê nướng mỡ chài Phong Dê', code: 'MA09', type: 'Món chính', unit: 'Đĩa', price: 180000, rateOrGroup: '8%' },
  { name: 'Dê né tỏi bản gang Phong Dê', code: 'MA10', type: 'Món chính', unit: 'Đĩa', price: 195000, rateOrGroup: '8%' },
  { name: 'Nầm dê nướng chao Phong Dê', code: 'MA11', type: 'Khai vị', unit: 'Đĩa', price: 190000, rateOrGroup: '8%' },
  { name: 'Dê hấp tỏi sả Phong Dê', code: 'MA12', type: 'Khai vị', unit: 'Đĩa', price: 180000, rateOrGroup: '8%' },
  { name: 'Cháo dê đỗ xanh Phong Dê', code: 'MA13', type: 'Món chính', unit: 'Tô', price: 75000, rateOrGroup: '8%' },
  { name: 'Tiết canh dê Phong Dê', code: 'MA14', type: 'Món chính', unit: 'Bát', price: 35000, rateOrGroup: '8%' },
  { name: 'Dê chao dầu vừng Phong Dê', code: 'MA15', type: 'Món chính', unit: 'Đĩa', price: 175000, rateOrGroup: '8%' },
  { name: 'Gỏi thịt dê hành tây Phong Dê', code: 'MA16', type: 'Món chính', unit: 'Đĩa', price: 130000, rateOrGroup: '8%' },
  { name: 'Lẩu dê nhúng mẻ Phong Dê', code: 'MA17', type: 'Lẩu', unit: 'Nồi', price: 380000, rateOrGroup: '8%' },
  { name: 'Bia chai Heineken Silver', code: 'DU05', type: 'Bia & Đồ uống', unit: 'Chai', price: 28000, rateOrGroup: '10%' },
  { name: 'Bia chai Saigon Special', code: 'DU06', type: 'Bia & Đồ uống', unit: 'Chai', price: 22000, rateOrGroup: '10%' },
  { name: 'Nước ngọt Coca-Cola lon', code: 'DU07', type: 'Bia & Đồ uống', unit: 'Lon', price: 20000, rateOrGroup: '8%' },
  { name: 'Đậu phộng rang tỏi ớt', code: 'MA18', type: 'Khai vị', unit: 'Đĩa', price: 25000, rateOrGroup: '8%' },
  { name: 'Dê ủ trấu bản xứ', code: 'MA19', type: 'Món chính', unit: 'Đĩa', price: 210000, rateOrGroup: '8%' },
  { name: 'Lẩu cua đồng bắp bò', code: 'MA20', type: 'Lẩu', unit: 'Nồi', price: 350000, rateOrGroup: '8%' },
  { name: 'Gà rang muối hạt', code: 'MA21', type: 'Món chính', unit: 'Đĩa', price: 220000, rateOrGroup: '8%' },
  { name: 'Khoai tây chiên bơ tỏi', code: 'MA22', type: 'Khai vị', unit: 'Đĩa', price: 45000, rateOrGroup: '8%' },
  { name: 'Ngô chiên bơ giòn', code: 'MA23', type: 'Khai vị', unit: 'Đĩa', price: 45000, rateOrGroup: '8%' },
  { name: 'Đậu hũ chiên sả ớt', code: 'MA24', type: 'Khai vị', unit: 'Đĩa', price: 50000, rateOrGroup: '8%' },
  { name: 'Sườn sụn rang muối', code: 'MA25', type: 'Món chính', unit: 'Đĩa', price: 165000, rateOrGroup: '8%' },
  { name: 'Ếch xào măng cay', code: 'MA26', type: 'Món chính', unit: 'Đĩa', price: 150000, rateOrGroup: '8%' },
  { name: 'Mực trứng hấp hành gừng', code: 'MA27', type: 'Món chính', unit: 'Đĩa', price: 220000, rateOrGroup: '8%' },
  { name: 'Tôm nướng muối ớt', code: 'MA28', type: 'Món chính', unit: 'Đĩa', price: 240000, rateOrGroup: '8%' },
  { name: 'Cá quả nướng mọi', code: 'MA29', type: 'Món chính', unit: 'Con', price: 320000, rateOrGroup: '8%' },
  { name: 'Cá lăng nướng riềng mẻ', code: 'MA30', type: 'Món chính', unit: 'Đĩa', price: 280000, rateOrGroup: '8%' },
  { name: 'Chân gà chiên mắm', code: 'MA31', type: 'Khai vị', unit: 'Đĩa', price: 95000, rateOrGroup: '8%' },
  { name: 'Sụn gà rang muối', code: 'MA32', type: 'Khai vị', unit: 'Đĩa', price: 120000, rateOrGroup: '8%' },
  { name: 'Lòng dê xào khế chua', code: 'MA33', type: 'Món chính', unit: 'Đĩa', price: 140000, rateOrGroup: '8%' },
  { name: 'Dồi dê nướng thơm', code: 'MA34', type: 'Khai vị', unit: 'Đĩa', price: 120000, rateOrGroup: '8%' },
  { name: 'Dê nướng mọi mật ong', code: 'MA35', type: 'Món chính', unit: 'Đĩa', price: 230000, rateOrGroup: '8%' },
  { name: 'Rau muống xào tỏi', code: 'MA36', type: 'Rau & Canh', unit: 'Đĩa', price: 45000, rateOrGroup: '8%' },
  { name: 'Cải ngồng luộc chấm trứng', code: 'MA37', type: 'Rau & Canh', unit: 'Đĩa', price: 50000, rateOrGroup: '8%' },
  { name: 'Mướp đắng ruốc đá', code: 'MA38', type: 'Khai vị', unit: 'Đĩa', price: 55000, rateOrGroup: '8%' },
  { name: 'Kim chi cải thảo', code: 'MA39', type: 'Khai vị', unit: 'Đĩa', price: 25000, rateOrGroup: '8%' },
  { name: 'Cơm chiên tỏi trứng', code: 'MA40', type: 'Món chính', unit: 'Đĩa', price: 65000, rateOrGroup: '8%' },
  { name: 'Cơm chiên hải sản', code: 'MA41', type: 'Món chính', unit: 'Đĩa', price: 120000, rateOrGroup: '8%' },
  { name: 'Mì xào bò rau cải', code: 'MA42', type: 'Món chính', unit: 'Đĩa', price: 95000, rateOrGroup: '8%' },
  { name: 'Miến xào lòng mề dê', code: 'MA43', type: 'Món chính', unit: 'Đĩa', price: 95000, rateOrGroup: '8%' },
  { name: 'Bia chai 333', code: 'DU08', type: 'Bia & Đồ uống', unit: 'Chai', price: 18000, rateOrGroup: '10%' },
  { name: 'Rượu táo mèo Tây Bắc', code: 'DU09', type: 'Bia & Đồ uống', unit: 'Chai', price: 150000, rateOrGroup: '10%' },
  { name: 'Rượu nếp cái hoa vàng', code: 'DU10', type: 'Bia & Đồ uống', unit: 'Chai', price: 120000, rateOrGroup: '10%' },
  { name: 'Nước cam ép nguyên chất', code: 'DU11', type: 'Bia & Đồ uống', unit: 'Ly', price: 40000, rateOrGroup: '8%' },
  { name: 'Nước dừa xiêm tươi', code: 'DU12', type: 'Bia & Đồ uống', unit: 'Quả', price: 35000, rateOrGroup: '8%' },
  { name: 'Trà đá Hà Nội', code: 'DU13', type: 'Bia & Đồ uống', unit: 'Ly', price: 5000, rateOrGroup: '8%' },
  { name: 'Chanh leo tuyết đá', code: 'DU14', type: 'Bia & Đồ uống', unit: 'Ly', price: 30000, rateOrGroup: '8%' },
  { name: 'Sinh tố bơ béo ngậy', code: 'DU15', type: 'Bia & Đồ uống', unit: 'Ly', price: 45000, rateOrGroup: '8%' },
  { name: 'Sinh tố xoài cát thơm', code: 'DU16', type: 'Bia & Đồ uống', unit: 'Ly', price: 40000, rateOrGroup: '8%' },
  { name: 'Trà sữa trân châu truyền thống', code: 'DU17', type: 'Bia & Đồ uống', unit: 'Ly', price: 35000, rateOrGroup: '8%' },
  { name: 'Lẩu thái hải sản chua cay', code: 'MA44', type: 'Lẩu', unit: 'Nồi', price: 380000, rateOrGroup: '8%' },
  { name: 'Gỏi sứa tai heo đu đủ', code: 'MA45', type: 'Khai vị', unit: 'Đĩa', price: 110000, rateOrGroup: '8%' },
  { name: 'Khoai lang kén chiên', code: 'MA46', type: 'Khai vị', unit: 'Đĩa', price: 40000, rateOrGroup: '8%' },
  { name: 'Salad hoàng đế sốt mè', code: 'MA47', type: 'Khai vị', unit: 'Đĩa', price: 75000, rateOrGroup: '8%' },
  { name: 'Nộm bò khô đu đủ', code: 'MA48', type: 'Khai vị', unit: 'Đĩa', price: 85000, rateOrGroup: '8%' },
  { name: 'Đậu hũ Tứ Xuyên cay nồng', code: 'MA49', type: 'Món chính', unit: 'Đĩa', price: 90000, rateOrGroup: '8%' },
  { name: 'Nấm đùi gà xào tỏi', code: 'MA50', type: 'Rau & Canh', unit: 'Đĩa', price: 70000, rateOrGroup: '8%' },
  { name: 'Canh chua thịt băm hành hoa', code: 'MA51', type: 'Rau & Canh', unit: 'Bát', price: 60000, rateOrGroup: '8%' }
];

interface WorkspaceViewProps {
  onNotification: (message: string, type?: 'success' | 'info') => void;
  setActiveMenuId: (menuId: string) => void;
  completedSteps: Record<number, boolean>;
  setCompletedSteps: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  onSendMessageToAi: (text: string) => void;
  chatMessages: Array<{ sender: 'user' | 'ai'; text: string; time: string }>;
  isAiTyping: boolean;
  onStartTaxGuidance?: () => void;
  onStartMenuGuidance?: () => void;
  onStartEmployeeGuidance?: () => void;
  onStartPaymentGuidance?: () => void;
  onStartInvoiceGuidance?: () => void;
  onStepActivated?: (stepNumber: number | null) => void;
  onAddAiMessage?: (text: string) => void;
  isAiSheetOpen?: boolean;
  onOpenAiSheet?: () => void;
  onCompleteOnboarding?: () => void;
  showTrialBanner?: boolean;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ 
  onNotification, 
  setActiveMenuId,
  completedSteps,
  setCompletedSteps,
  onSendMessageToAi,
  chatMessages,
  isAiTyping,
  onStartTaxGuidance,
  onStartMenuGuidance,
  onStartEmployeeGuidance,
  onStartPaymentGuidance,
  onStartInvoiceGuidance,
  onStepActivated,
  onAddAiMessage,
  isAiSheetOpen = false,
  onOpenAiSheet,
  onCompleteOnboarding,
  showTrialBanner = true
}) => {
  // Chatbox AI state
  const [chatInput, setChatInput] = useState('');
  const [bannerChatText, setBannerChatText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const allBefore7Completed = [1, 2, 3, 4, 5, 6].every(id => completedSteps[id]);
  const allStepsCompleted = [1, 2, 3, 4, 5, 6, 7].every(id => completedSteps[id]);

  // Onboarding tour states
  const [showWorkspaceTour, setShowWorkspaceTour] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [tourCoords, setTourCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const [activeModalStep, setActiveModalStep] = useState<number | null>(null);

  // 7-step Setup Modal tour states
  const [showStepTour, setShowStepTour] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
  });
  const [stepTourCoords, setStepTourCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const handleCloseTour = (completed: boolean = false) => {
    localStorage.setItem('cukcuk_workspace_tour_completed', 'true');
    setShowWorkspaceTour(false);
    if (completed) {
      onNotification('🎉 Chúc mừng! Bạn đã sẵn sàng khám phá Bàn làm việc.', 'success');
      changeModalStep(1);
    } else {
      onNotification('Đã hoàn tất hướng dẫn tham quan Bàn làm việc.', 'info');
    }
    // Scroll the main content area to top smoothly
    setTimeout(() => {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const tourSteps = [
    {
      targetId: 'misa-ava-featured-chatbox',
      title: 'Chào mừng bạn đến với MISA CukCuk',
      content: 'Tôi là MISA AVA - Trợ lý ảo AI đồng hành cùng bạn. Hệ thống đã chuẩn bị sẵn sơ đồ thiết lập cá nhân hóa cho mô hình Nhà hàng Phong Dê của bạn để bắt đầu vận hành nhanh chóng nhất.',
      placement: 'bottom' as const
    },
    {
      targetId: 'setup-accordion-card',
      title: 'Hướng dẫn thiết lập 7 bước chuẩn',
      content: 'Giúp bạn từng bước khai báo thông tin thuế, lập thực đơn, sơ đồ bàn, nhân viên và kết nối hóa đơn điện tử một cách mạch lạc, không lo bỏ sót thủ tục quan trọng.',
      placement: 'bottom' as const
    },
    {
      targetId: 'software-install-card',
      title: 'Hệ sinh thái ứng dụng MISA CukCuk',
      content: 'Tải và cài đặt các ứng dụng bán hàng, ghi order, chế biến cho từng bộ phận để tối ưu hóa quy trình phục vụ của nhà hàng.',
      placement: 'top' as const
    }
  ];

  // Auto-start onboarding tour if not completed
  useEffect(() => {
    const isCompleted = localStorage.getItem('cukcuk_workspace_tour_completed');
    if (!isCompleted) {
      setShowWorkspaceTour(true);
      setCurrentTourStep(0);
    }
  }, []);

  // Update tour spotlight coordinates based on current highlighted element
  useEffect(() => {
    if (showWorkspaceTour) {
      const step = tourSteps[currentTourStep];
      const element = document.getElementById(step.targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const updateCoords = () => {
          const rect = element.getBoundingClientRect();
          setTourCoords({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
        };
        const timer = setTimeout(updateCoords, 450);
        window.addEventListener('resize', updateCoords);
        window.addEventListener('scroll', updateCoords);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('resize', updateCoords);
          window.removeEventListener('scroll', updateCoords);
        };
      } else {
        setTourCoords(null);
      }
    } else {
      setTourCoords(null);
    }
  }, [showWorkspaceTour, currentTourStep]);

  // Update setup modal tour spotlight coordinates
  useEffect(() => {
    if (activeModalStep !== null && showStepTour[activeModalStep]) {
      let targetId = '';
      if (activeModalStep === 1) targetId = 'setup-step1-tax-selector';
      else if (activeModalStep === 2) targetId = 'setup-step2-ava-action';
      else if (activeModalStep === 3) targetId = 'setup-step3-kitchen-warning';
      else if (activeModalStep === 4) targetId = 'setup-step4-tables-editor';
      else if (activeModalStep === 5) targetId = 'setup-step5-vietqr-section';
      else if (activeModalStep === 6) targetId = 'setup-step6-auto-invoice';
      else if (activeModalStep === 7) targetId = 'setup-step7-pin-checkbox';

      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const updateCoords = () => {
          const rect = element.getBoundingClientRect();
          setStepTourCoords({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
        };
        const timer = setTimeout(updateCoords, 450);
        window.addEventListener('resize', updateCoords);
        window.addEventListener('scroll', updateCoords);
        const modalContainer = document.querySelector('.overflow-y-auto');
        if (modalContainer) {
          modalContainer.addEventListener('scroll', updateCoords);
        }
        return () => {
          clearTimeout(timer);
          window.removeEventListener('resize', updateCoords);
          window.removeEventListener('scroll', updateCoords);
          if (modalContainer) {
            modalContainer.removeEventListener('scroll', updateCoords);
          }
        };
      } else {
        setStepTourCoords(null);
      }
    } else {
      setStepTourCoords(null);
    }
  }, [activeModalStep, showStepTour]);

  // Steps timeline ref and scroll function for mobile/small screen
  const stepsTimelineRef = useRef<HTMLDivElement>(null);
  const [isTimelineOverflowing, setIsTimelineOverflowing] = useState<boolean>(false);

  const checkTimelineOverflow = () => {
    if (stepsTimelineRef.current) {
      const { scrollWidth, clientWidth } = stepsTimelineRef.current;
      setIsTimelineOverflowing(scrollWidth > clientWidth);
    }
  };

  const scrollStepsTimeline = (direction: 'left' | 'right') => {
    if (stepsTimelineRef.current) {
      const amount = direction === 'left' ? -150 : 150;
      stepsTimelineRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };



  const changeModalStep = (step: number | null) => {
    setActiveModalStep(step);
    if (step === 3) {
      setShowStep3Guide(true);
    }
    if (onStepActivated) {
      onStepActivated(step);
    }
  };

  useEffect(() => {
    if (activeModalStep !== null) {
      // Check overflow and scroll active step into view after DOM renders
      const timer = setTimeout(() => {
        checkTimelineOverflow();
        const element = document.getElementById(`step-timeline-btn-${activeModalStep}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 150);

      window.addEventListener('resize', checkTimelineOverflow);

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined' && stepsTimelineRef.current) {
        resizeObserver = new ResizeObserver(() => {
          checkTimelineOverflow();
        });
        resizeObserver.observe(stepsTimelineRef.current);
      }

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkTimelineOverflow);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    }
  }, [activeModalStep]);

  // States and helper definitions for step popups
  const [activeFlow, setActiveFlow] = useState<'excel' | 'ava' | 'manual' | null>(null);
  const [excelStepSub, setExcelStepSub] = useState<number>(1);
  const [excelFileSelected, setExcelFileSelected] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [avaStepSub, setAvaStepSub] = useState<number>(1);
  const [menuImageSelected, setMenuImageSelected] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [step2Tab, setStep2Tab] = useState<'excel' | 'ava' | 'manual'>('excel');
  const [extractedDishes, setExtractedDishes] = useState<any[]>([]);
  const handleAvaSave = () => {};

  // Step 2: Menu Items Mock DB
  const [menuItems, setMenuItems] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_menu_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        let modified = false;
        const updated = parsed.map((item: any) => {
          const nameLower = (item.name || '').toLowerCase();
          if (nameLower.includes('bia') || nameLower.includes('rượu')) {
            if (item.rateOrGroup !== '10%') {
              modified = true;
              return { ...item, rateOrGroup: '10%' };
            }
          }
          return item;
        });
        if (modified) {
          localStorage.setItem('cukcuk_menu_items', JSON.stringify(updated));
        }
        return updated;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Step 3: Kitchen / Bar Areas
  const [kitchenAreas, setKitchenAreas] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_kitchen_areas');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Bếp', type: 'Bếp', area: 'Khu dã ngoại', device: 'Máy in', printTime: 'In sau khi gửi yêu cầu chế biến', description: 'Chế biến các món ăn nóng, lẩu, nướng', dishes: [] },
        { id: '2', name: 'Bar', type: 'Bar', area: 'Quầy chính', device: 'Không sử dụng', printTime: 'In sau khi gửi yêu cầu chế biến', description: 'Pha chế đồ uống, rót bia', dishes: [] }
      ];
    } catch {
      return [
        { id: '1', name: 'Bếp', type: 'Bếp', area: 'Khu dã ngoại', device: 'Máy in', printTime: 'In sau khi gửi yêu cầu chế biến', description: 'Chế biến các món ăn nóng, lẩu, nướng', dishes: [] },
        { id: '2', name: 'Bar', type: 'Bar', area: 'Quầy chính', device: 'Không sử dụng', printTime: 'In sau khi gửi yêu cầu chế biến', description: 'Pha chế đồ uống, rót bia', dishes: [] }
      ];
    }
  });

  // Step 7 employee filtering states
  const [filterStep7Code, setFilterStep7Code] = useState('');
  const [filterStep7Name, setFilterStep7Name] = useState('');
  const [filterStep7Gender, setFilterStep7Gender] = useState('');
  const [filterStep7Role, setFilterStep7Role] = useState('');
  const [filterStep7Email, setFilterStep7Email] = useState('');
  const [filterStep7Phone, setFilterStep7Phone] = useState('');

  // Step 4: Employees
  const [employees, setEmployees] = useState<any[]>(() => {
    const defaultAdmin = { 
      code: 'NV01', 
      name: 'Nguyễn Quang Dũng', 
      role: 'Quản trị hệ thống', 
      email: 'nqdung@gmail.com', 
      phone: '0901234567',
      gender: 'Nam',
      status: 'Chính thức',
      timekeepingCode: '',
      birthday: '',
      identityCard: '',
      issueDate: '',
      issuePlace: '',
      allowLogin: true
    };
    try {
      const saved = localStorage.getItem('cukcuk_employees');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Ensure there is at least one Quản trị hệ thống role present
          const hasAdmin = parsed.some(emp => emp.role === 'Quản trị hệ thống');
          if (hasAdmin) {
            return parsed.map(emp => {
              const name = emp.name === 'Hồ Xuân Minh Nhật' || emp.name === 'Nguyễn Văn Minh' ? 'Nguyễn Quang Dũng' : (emp.name || 'Nguyễn Quang Dũng');
              return {
                code: emp.code || 'NV01',
                name,
                role: emp.role || 'Quản trị hệ thống',
                email: name === 'Nguyễn Quang Dũng' ? 'nqdung@gmail.com' : (emp.email || emp.contact || 'cukcuk@software.misa.com.vn'),
                phone: emp.phone || '0901234567',
                gender: emp.gender || 'Nam',
                status: emp.status || 'Chính thức',
                timekeepingCode: emp.timekeepingCode || '',
                birthday: emp.birthday || '',
                identityCard: emp.identityCard || '',
                issueDate: emp.issueDate || '',
                issuePlace: emp.issuePlace || '',
                allowLogin: emp.allowLogin !== undefined ? emp.allowLogin : true
              };
            });
          } else {
            // Prepend default admin
            const updated = [defaultAdmin, ...parsed];
            localStorage.setItem('cukcuk_employees', JSON.stringify(updated));
            return updated;
          }
        }
      }
      return [defaultAdmin];
    } catch {
      return [defaultAdmin];
    }
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (filterStep7Code.trim()) {
        if (!emp.code?.toLowerCase().includes(filterStep7Code.toLowerCase().trim())) return false;
      }
      if (filterStep7Name.trim()) {
        if (!emp.name?.toLowerCase().includes(filterStep7Name.toLowerCase().trim())) return false;
      }
      if (filterStep7Gender) {
        if (emp.gender !== filterStep7Gender) return false;
      }
      if (filterStep7Role) {
        if (emp.role !== filterStep7Role) return false;
      }
      if (filterStep7Email.trim()) {
        if (!emp.email?.toLowerCase().includes(filterStep7Email.toLowerCase().trim())) return false;
      }
      if (filterStep7Phone.trim()) {
        if (!emp.phone?.toLowerCase().includes(filterStep7Phone.toLowerCase().trim())) return false;
      }
      return true;
    });
  }, [employees, filterStep7Code, filterStep7Name, filterStep7Gender, filterStep7Role, filterStep7Email, filterStep7Phone]);

  const [step2Page, setStep2Page] = useState<number>(1);
  const [step2PageSize, setStep2PageSize] = useState<number>(100);
  const [step3Page, setStep3Page] = useState<number>(1);
  const [step3PageSize, setStep3PageSize] = useState<number>(100);

  // States for Step 3 (Bếp/Bar) filtering
  const [filterStep3Name, setFilterStep3Name] = useState('');
  const [filterStep3Type, setFilterStep3Type] = useState('');
  const [filterStep3Area, setFilterStep3Area] = useState('');
  const [filterStep3Dishes, setFilterStep3Dishes] = useState('');
  const [filterStep3DishesOp, setFilterStep3DishesOp] = useState<'=' | '<=' | '>='>('>=');

  // Step 3 unique areas list memo
  const uniqueStep3Areas = useMemo(() => {
    return Array.from(new Set(kitchenAreas.map(item => item.area || 'Mặc định').filter(Boolean)));
  }, [kitchenAreas]);

  // Filtered Step 3 kitchen areas memo
  const filteredKitchenAreas = useMemo(() => {
    return kitchenAreas.filter(area => {
      // 1. Tên bếp/bar
      if (filterStep3Name.trim()) {
        const search = filterStep3Name.trim().toLowerCase();
        if (!area.name?.toLowerCase().includes(search)) return false;
      }
      // 2. Loại
      if (filterStep3Type) {
        const type = area.type || 'Bếp';
        if (type !== filterStep3Type) return false;
      }
      // 3. Khu vực
      if (filterStep3Area) {
        const areaName = area.area || 'Mặc định';
        if (areaName !== filterStep3Area) return false;
      }
      // 4. Số món chế biến
      if (filterStep3Dishes.trim()) {
        const count = getEffectiveDishesForArea(area).length;
        const val = Number(filterStep3Dishes.trim());
        if (!isNaN(val)) {
          if (filterStep3DishesOp === '=') {
            if (count !== val) return false;
          } else if (filterStep3DishesOp === '<=') {
            if (count > val) return false;
          } else if (filterStep3DishesOp === '>=') {
            if (count < val) return false;
          }
        } else {
          if (!String(count).includes(filterStep3Dishes.trim())) return false;
        }
      }
      return true;
    });
  }, [kitchenAreas, filterStep3Name, filterStep3Type, filterStep3Area, filterStep3Dishes, filterStep3DishesOp, menuItems]);

  // Adjust page size / page when filtered kitchen areas length changes to prevent empty page view
  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(filteredKitchenAreas.length / step3PageSize));
    if (step3Page > maxPages) {
      setStep3Page(maxPages);
    }
  }, [filteredKitchenAreas.length, step3PageSize, step3Page]);

  // States for manual custom dish addition
  const [isAddDishPopupOpen, setIsAddDishPopupOpen] = useState(false);
  const [isStep2SaveDropdownOpen, setIsStep2SaveDropdownOpen] = useState(false);
  const [selectedKitchenAreaForDishes, setSelectedKitchenAreaForDishes] = useState<any | null>(null);
  const [filterPopupCode, setFilterPopupCode] = useState('');
  const [filterPopupName, setFilterPopupName] = useState('');
  const [filterPopupType, setFilterPopupType] = useState('');
  const [filterPopupUnit, setFilterPopupUnit] = useState('');
  const [filterPopupPrice, setFilterPopupPrice] = useState('');
  const [filterPopupPriceOp, setFilterPopupPriceOp] = useState('<=');
  const [newDishName, setNewDishName] = useState('');
  const [newDishCode, setNewDishCode] = useState('');
  const [newDishType, setNewDishType] = useState('Món chính');
  const [newDishItemType, setNewDishItemType] = useState('Đồ ăn');
  const [newDishCookingAreas, setNewDishCookingAreas] = useState<string[]>(['Bếp']);
  const [newDishUnit, setNewDishUnit] = useState('Đĩa');
  const [newDishPrice, setNewDishPrice] = useState<number>(100000);
  const [newDishTax, setNewDishTax] = useState('8%');
  const [editingDishIndex, setEditingDishIndex] = useState<number | null>(null);

  // States for step 2 inline table editing & selection
  const [inlineEditingIndex, setInlineEditingIndex] = useState<number | null>(null);
  const [tempEditValues, setTempEditValues] = useState<{
    name: string;
    code: string;
    type: string;
    itemType: string;
    cookingAreas: string[];
    unit: string;
    price: number;
    rateOrGroup: string;
  } | null>(null);
  const [selectedDishIndexes, setSelectedDishIndexes] = useState<number[]>([]);

  // States for bulk edit popup
  const [isBulkEditPopupOpen, setIsBulkEditPopupOpen] = useState(false);
  const [bulkEditValues, setBulkEditValues] = useState({
    name: '',
    type: 'Món chính',
    itemType: 'Đồ ăn',
    cookingAreas: [] as string[],
    unit: 'Đĩa',
    price: 0,
    rateOrGroup: '8%'
  });
  const [bulkEditEnabled, setBulkEditEnabled] = useState({
    name: false,
    type: false,
    itemType: false,
    cookingAreas: false,
    unit: false,
    price: false,
    rateOrGroup: false
  });

  // Filter States for Step 2 Table
  const [filterName, setFilterName] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterItemType, setFilterItemType] = useState('');
  const [filterCookingArea, setFilterCookingArea] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPriceOp, setFilterPriceOp] = useState<'=' | '<=' | '>='>('>=');
  const [filterPriceVal, setFilterPriceVal] = useState('');
  const [filterTax, setFilterTax] = useState('');

  // Filtered Menu Items Memo
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(dish => {
      // 1. Tên món
      if (filterName.trim()) {
        const search = filterName.trim().toLowerCase();
        if (!dish.name?.toLowerCase().includes(search)) return false;
      }
      // 2. Mã món
      if (filterCode.trim()) {
        const search = filterCode.trim().toLowerCase();
        if (!dish.code?.toLowerCase().includes(search)) return false;
      }
      // 3. Nhóm thực đơn
      if (filterGroup) {
        if (dish.type !== filterGroup) return false;
      }
      // 4. Loại món
      if (filterItemType) {
        const type = getItemType(dish);
        if (type !== filterItemType) return false;
      }
      // 5. Chế biến tại
      if (filterCookingArea) {
        const areas = getCookingAreas(dish);
        if (!areas.includes(filterCookingArea)) return false;
      }
      // 6. Đơn vị tính
      if (filterUnit.trim()) {
        const search = filterUnit.trim().toLowerCase();
        if (!dish.unit?.toLowerCase().includes(search)) return false;
      }
      // 7. Giá bán
      if (filterPriceVal.trim()) {
        const priceNum = parseFloat(filterPriceVal.replace(/[,.]/g, ''));
        if (!isNaN(priceNum)) {
          if (filterPriceOp === '=') {
            if (dish.price !== priceNum) return false;
          } else if (filterPriceOp === '<=') {
            if (dish.price > priceNum) return false;
          } else if (filterPriceOp === '>=') {
            if (dish.price < priceNum) return false;
          }
        }
      }
      // 8. Thuế suất
      if (filterTax) {
        const taxVal = dish.rateOrGroup || '8%';
        if (taxVal !== filterTax) return false;
      }
      return true;
    });
  }, [
    menuItems,
    filterName,
    filterCode,
    filterGroup,
    filterItemType,
    filterCookingArea,
    filterUnit,
    filterPriceOp,
    filterPriceVal,
    filterTax
  ]);

  // Adjust page size / page when filtered items length changes to prevent empty page view
  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(filteredMenuItems.length / step2PageSize));
    if (step2Page > maxPages) {
      setStep2Page(maxPages);
    }
  }, [filteredMenuItems.length, step2PageSize, step2Page]);

  const handleOpenAddDishPopup = () => {
    setEditingDishIndex(null);
    setNewDishName('');
    setNewDishCode('');
    setNewDishType('Món chính');
    setNewDishItemType('Đồ ăn');
    setNewDishCookingAreas(['Bếp']);
    setNewDishUnit('Đĩa');
    setNewDishPrice(100000);
    setNewDishTax('8%');
    setIsAddDishPopupOpen(true);
    setIsStep2SaveDropdownOpen(false);
  };

  const handleOpenEditDishPopup = (index: number) => {
    const dish = menuItems[index];
    setEditingDishIndex(index);
    setNewDishName(dish.name || '');
    setNewDishCode(dish.code || '');
    setNewDishType(dish.type || 'Món chính');
    setNewDishItemType(getItemType(dish));
    setNewDishCookingAreas(getCookingAreas(dish));
    setNewDishUnit(dish.unit || 'Đĩa');
    setNewDishPrice(dish.price || 0);
    setNewDishTax(dish.rateOrGroup || '8%');
    setIsAddDishPopupOpen(true);
    setIsStep2SaveDropdownOpen(false);
  };

  const handleRowDoubleClick = (idx: number, dish: any) => {
    setInlineEditingIndex(idx);
    setTempEditValues({
      name: dish.name || '',
      code: dish.code || '',
      type: dish.type || 'Món chính',
      itemType: getItemType(dish),
      cookingAreas: getCookingAreas(dish),
      unit: dish.unit || 'Đĩa',
      price: dish.price || 0,
      rateOrGroup: dish.rateOrGroup || '8%'
    });
  };

  const handleSaveInlineEdit = (idx: number) => {
    if (!tempEditValues) return;
    setMenuItems(prev => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        name: tempEditValues.name,
        code: tempEditValues.code,
        type: tempEditValues.type,
        itemType: tempEditValues.itemType,
        cookingAreas: tempEditValues.cookingAreas,
        unit: tempEditValues.unit,
        price: Number(tempEditValues.price) || 0,
        rateOrGroup: tempEditValues.rateOrGroup
      };
      localStorage.setItem('cukcuk_menu_items', JSON.stringify(updated));
      return updated;
    });
    setInlineEditingIndex(null);
    setTempEditValues(null);
    onNotification("Đã cập nhật thông tin món ăn trực tiếp thành công!", "success");
  };

  const handleCancelInlineEdit = () => {
    setInlineEditingIndex(null);
    setTempEditValues(null);
  };

  const handleOpenBulkEditPopup = () => {
    setBulkEditValues({
      name: '',
      type: 'Món chính',
      itemType: 'Đồ ăn',
      cookingAreas: ['Bếp'],
      unit: 'Đĩa',
      price: 0,
      rateOrGroup: '8%'
    });
    setBulkEditEnabled({
      name: false,
      type: false,
      itemType: false,
      cookingAreas: false,
      unit: false,
      price: false,
      rateOrGroup: false
    });
    setIsBulkEditPopupOpen(true);
  };

  const handleApplyBulkEdit = () => {
    const targetIndexes = selectedDishIndexes.length > 0
      ? selectedDishIndexes
      : menuItems.map((_, i) => i);

    setMenuItems(prev => {
      const updated = [...prev];
      targetIndexes.forEach(idx => {
        if (idx >= 0 && idx < updated.length) {
          const item = { ...updated[idx] };
          if (bulkEditEnabled.name) item.name = bulkEditValues.name;
          if (bulkEditEnabled.type) item.type = bulkEditValues.type;
          if (bulkEditEnabled.itemType) {
            item.itemType = bulkEditValues.itemType;
            if (!bulkEditEnabled.cookingAreas) {
              item.cookingAreas = bulkEditValues.itemType === 'Đồ uống' ? ['Bar'] : ['Bếp'];
            }
          }
          if (bulkEditEnabled.cookingAreas) item.cookingAreas = bulkEditValues.cookingAreas;
          if (bulkEditEnabled.unit) item.unit = bulkEditValues.unit;
          if (bulkEditEnabled.price) item.price = Number(bulkEditValues.price) || 0;
          if (bulkEditEnabled.rateOrGroup) item.rateOrGroup = bulkEditValues.rateOrGroup;
          
          updated[idx] = item;
        }
      });
      localStorage.setItem('cukcuk_menu_items', JSON.stringify(updated));
      return updated;
    });
    
    setIsBulkEditPopupOpen(false);
    setSelectedDishIndexes([]);
    onNotification(`Đã cập nhật hàng loạt thành công cho ${targetIndexes.length} món ăn!`, 'success');
  };

  const handleSelectRow = (idx: number) => {
    setSelectedDishIndexes(prev => {
      if (prev.includes(idx)) {
        return prev.filter(item => item !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  const currentPagedDishes = filteredMenuItems.slice((step2Page - 1) * step2PageSize, step2Page * step2PageSize);
  const pagedActualIndexes = currentPagedDishes.map((dish) => menuItems.findIndex(m => m.code === dish.code));
  const isAllPageSelected = pagedActualIndexes.length > 0 && pagedActualIndexes.every(idx => selectedDishIndexes.includes(idx));

  const handleSelectAllPage = () => {
    if (isAllPageSelected) {
      setSelectedDishIndexes(prev => prev.filter(idx => !pagedActualIndexes.includes(idx)));
    } else {
      setSelectedDishIndexes(prev => {
        const next = [...prev];
        pagedActualIndexes.forEach(idx => {
          if (!next.includes(idx)) next.push(idx);
        });
        return next;
      });
    }
  };

  const handleExcelImportRun = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setExcelStepSub(1);
      setExcelFileSelected(false);
      setMenuItems(VUON_BIA_DISHES);
      localStorage.setItem('cukcuk_menu_items', JSON.stringify(VUON_BIA_DISHES));
      setActiveFlow(null);
      onNotification(`🎉 Đã nhập khẩu thành công ${VUON_BIA_DISHES.length} món ăn từ file Excel của Nhà hàng Phong Dê!`, 'success');
    }, 1500);
  };

  const handleAvaExtractRun = () => {
    setIsScanning(true);
    setAvaStepSub(2);
    setTimeout(() => {
      setIsScanning(false);
      setAvaStepSub(1);
      setMenuImageSelected(false);
      setMenuItems(VUON_BIA_DISHES);
      localStorage.setItem('cukcuk_menu_items', JSON.stringify(VUON_BIA_DISHES));
      setActiveFlow(null);
      onNotification(`✨ MISA AVA đã nhận diện thành công hình ảnh thực đơn và tạo ${VUON_BIA_DISHES.length} món ăn cho Nhà hàng Phong Dê!`, 'success');
    }, 2000);
  };

  const handleManualEntryInit = () => {
    setMenuItems(VUON_BIA_DISHES);
    localStorage.setItem('cukcuk_menu_items', JSON.stringify(VUON_BIA_DISHES));
    setActiveFlow(null);
    onNotification(`✍️ Đã tạo thành công ${VUON_BIA_DISHES.length} món ăn mẫu chuẩn chân dung Nhà hàng Phong Dê!`, 'success');
  };

  const handleAddCustomDish = (andAdd: boolean = false, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newDishName.trim()) {
      onNotification('⚠️ Vui lòng nhập tên món ăn!', 'info');
      return;
    }
    const code = newDishCode.trim() || `MA${String(menuItems.length + 1).padStart(2, '0')}`;
    const newDish = {
      name: newDishName.trim(),
      code: code,
      type: newDishType,
      itemType: newDishItemType,
      cookingAreas: newDishCookingAreas,
      unit: newDishUnit,
      price: Number(newDishPrice) || 0,
      rateOrGroup: newDishTax
    };
    
    if (editingDishIndex !== null) {
      setMenuItems(prev => {
        const updated = [...prev];
        updated[editingDishIndex] = newDish;
        localStorage.setItem('cukcuk_menu_items', JSON.stringify(updated));
        return updated;
      });
      onNotification('🎉 Đã cập nhật món ăn thành công!', 'success');
      setEditingDishIndex(null);
      setIsAddDishPopupOpen(false);
    } else {
      setMenuItems(prev => {
        const updated = [newDish, ...prev];
        localStorage.setItem('cukcuk_menu_items', JSON.stringify(updated));
        return updated;
      });
      onNotification('➕ Thêm món ăn mới thành công!', 'success');
      
      if (andAdd) {
        setNewDishName('');
        setNewDishCode('');
        setNewDishType('Món chính');
        setNewDishItemType('Đồ ăn');
        setNewDishCookingAreas(['Bếp']);
        setNewDishUnit('Đĩa');
        setNewDishPrice(100000);
        setNewDishTax('8%');
      } else {
        setIsAddDishPopupOpen(false);
      }
    }
  };

  const handleDeleteDish = (index: number) => {
    setMenuItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('cukcuk_menu_items', JSON.stringify(updated));
      return updated;
    });
    onNotification('🗑️ Đã xóa món ăn khỏi thực đơn!', 'success');
  };

  const handleClearAllDishes = () => {
    setMenuItems([]);
    localStorage.removeItem('cukcuk_menu_items');
    setActiveFlow(null);
    onNotification('🧹 Đã xóa toàn bộ thực đơn để thiết lập lại!', 'success');
  };

  // Step 3 Local States & Helpers
  const [isAreaFormOpen, setIsAreaFormOpen] = useState<boolean>(false);
  const [areaFormMode, setAreaFormMode] = useState<'create' | 'edit'>('create');
  const [areaFormIndex, setAreaFormIndex] = useState<number | null>(null);
  const [isSaveDropdownOpen, setIsSaveDropdownOpen] = useState<boolean>(false);

  // Handle click outside of inline editing row to save changes without exiting prematurely on selector click
  useEffect(() => {
    if (inlineEditingIndex === null || !tempEditValues) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (isAreaFormOpen) return;
      const activeRow = document.getElementById(`edit-row-${inlineEditingIndex}`);
      if (activeRow && !activeRow.contains(e.target as Node)) {
        // Double check if click is inside any overlay or dialog/modal that might have been opened
        const isClickInModal = (e.target as HTMLElement).closest('.fixed, .absolute[z-') !== null;
        if (!isClickInModal) {
          handleSaveInlineEdit(inlineEditingIndex);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inlineEditingIndex, isAreaFormOpen, tempEditValues]);

  // Individual fields for the form
  const [areaType, setAreaType] = useState<'Bếp' | 'Bar'>('Bếp');
  const [areaName, setAreaName] = useState<string>('');
  const [areaDevice, setAreaDevice] = useState<'Máy tính bảng' | 'Máy in' | 'Không sử dụng'>('Máy in');
  const [areaPrintTime, setAreaPrintTime] = useState<'In sau khi gửi yêu cầu chế biến' | 'In sau khi trả món'>('In sau khi gửi yêu cầu chế biến');
  const [areaDescription, setAreaDescription] = useState<string>('');
  const [areaZone, setAreaZone] = useState<string>('Khu dã ngoại');
  const [areaSelectedDishes, setAreaSelectedDishes] = useState<string[]>([]);

  // Dish selection sub-modal
  const [isDishSelectOpen, setIsDishSelectOpen] = useState<boolean>(false);
  const [tempSelectedDishes, setTempSelectedDishes] = useState<string[]>([]);
  const [filterDishName, setFilterDishName] = useState<string>('');
  const [filterDishGroup, setFilterDishGroup] = useState<string>('');
  const [filterDishPrep, setFilterDishPrep] = useState<string>('');

  const handleOpenEditArea = (idx: number) => {
    const area = kitchenAreas[idx];
    setAreaFormMode('edit');
    setAreaFormIndex(idx);
    setAreaType(area.type || 'Bếp');
    setAreaName(area.name || '');
    setAreaDevice(area.device || 'Máy in');
    setAreaPrintTime(area.printTime || 'In sau khi gửi yêu cầu chế biến');
    setAreaDescription(area.description || '');
    setAreaZone(area.area || 'Khu dã ngoại');
    setAreaSelectedDishes(getEffectiveDishesForArea(area));
    setIsAreaFormOpen(true);
    setIsSaveDropdownOpen(false);
  };

  const handleOpenCreateArea = () => {
    setAreaFormMode('create');
    setAreaFormIndex(null);
    setAreaType('Bếp');
    setAreaName('');
    setAreaDevice('Máy in');
    setAreaPrintTime('In sau khi gửi yêu cầu chế biến');
    setAreaDescription('');
    setAreaZone('Khu dã ngoại');
    setAreaSelectedDishes([]);
    setIsAreaFormOpen(true);
    setIsSaveDropdownOpen(false);
  };

  const handleSaveAreaForm = (andAdd: boolean = false) => {
    if (!areaName.trim()) {
      onNotification('⚠️ Vui lòng nhập tên bếp/bar!', 'warning');
      return;
    }

    const newArea = {
      id: areaFormIndex !== null ? kitchenAreas[areaFormIndex].id : String(Date.now()),
      name: areaName,
      type: areaType,
      area: areaZone,
      device: areaDevice,
      printTime: areaPrintTime,
      description: areaDescription,
      dishes: areaSelectedDishes
    };

    let updated = [...kitchenAreas];
    if (areaFormMode === 'edit' && areaFormIndex !== null) {
      updated[areaFormIndex] = newArea;
      onNotification(`💾 Đã lưu cấu hình "${areaName}" thành công!`, 'success');
    } else {
      updated.push(newArea);
      onNotification(`➕ Đã thêm bếp/bar "${areaName}" thành công!`, 'success');
    }

    setKitchenAreas(updated);
    localStorage.setItem('cukcuk_kitchen_areas', JSON.stringify(updated));

    if (andAdd) {
      // Reset form fields
      setAreaFormMode('create');
      setAreaFormIndex(null);
      setAreaType('Bếp');
      setAreaName('');
      setAreaDevice('Máy in');
      setAreaPrintTime('In sau khi gửi yêu cầu chế biến');
      setAreaDescription('');
      setAreaZone('Khu dã ngoại');
      setAreaSelectedDishes([]);
    } else {
      setIsAreaFormOpen(false);
    }
  };

  const handleDeleteArea = (idx: number) => {
    const updated = kitchenAreas.filter((_, i) => i !== idx);
    setKitchenAreas(updated);
    localStorage.setItem('cukcuk_kitchen_areas', JSON.stringify(updated));
    onNotification('🗑️ Đã xóa bếp/bar thành công!', 'info');
  };

  const handleAddKitchenAreaQuick = (name: string) => {
    const newArea = {
      id: String(Date.now()),
      name: name,
      type: name.toLowerCase().includes('bar') ? 'Bar' : 'Bếp',
      area: 'Quầy chính',
      device: 'Không sử dụng',
      printTime: 'In sau khi gửi yêu cầu chế biến',
      description: `Khu vực ${name} được thêm nhanh`,
      dishes: []
    };
    const updated = [...kitchenAreas, newArea];
    setKitchenAreas(updated);
    localStorage.setItem('cukcuk_kitchen_areas', JSON.stringify(updated));
    onNotification(`➕ Đã thêm nhanh khu vực "${name}" thành công!`, 'success');
  };

  const getEffectiveDishesForArea = (area: any) => {
    const dishesList = menuItems.length > 0 ? menuItems : VUON_BIA_DISHES;
    const autoDishes = dishesList
      .filter(dish => {
        const areas = getCookingAreas(dish);
        return areas.includes(area.name);
      })
      .map(dish => dish.name);
    
    if (autoDishes.length > 0) {
      return autoDishes;
    }
    return area.dishes || [];
  };

  const getDishPrepLocation = (dishName: string) => {
    const preps: string[] = [];
    kitchenAreas.forEach(area => {
      const effDishes = getEffectiveDishesForArea(area);
      if (effDishes && effDishes.includes(dishName)) {
        preps.push(area.name);
      }
    });
    return preps.length > 0 ? preps.join(', ') : 'Chưa thiết lập';
  };

  // Step 4 Local States & Helpers
  const [empCode, setEmpCode] = useState<string>('');
  const [empName, setEmpName] = useState<string>('');
  const [empRole, setEmpRole] = useState<string>('Thu ngân');
  const [empContact, setEmpContact] = useState<string>('');
  const [empEmail, setEmpEmail] = useState<string>('');
  const [empPhone, setEmpPhone] = useState<string>('');
  const [isAddEmployeePopupOpen, setIsAddEmployeePopupOpen] = useState<boolean>(false);
  const [step4Page, setStep4Page] = useState<number>(1);
  const [step4PageSize, setStep4PageSize] = useState<number>(100);

  // New employee extra states to replicate the detailed form
  const [editingEmployeeIndex, setEditingEmployeeIndex] = useState<number | null>(null);
  const [activeEmpPopupTab, setActiveEmpPopupTab] = useState<string>('general');
  const [empTimekeepingCode, setEmpTimekeepingCode] = useState<string>('');
  const [empGender, setEmpGender] = useState<string>('Nam');
  const [empBirthday, setEmpBirthday] = useState<string>('');
  const [empIdentityCard, setEmpIdentityCard] = useState<string>('');
  const [empIssueDate, setEmpIssueDate] = useState<string>('');
  const [empIssuePlace, setEmpIssuePlace] = useState<string>('');
  const [empStatus, setEmpStatus] = useState<string>('Chính thức');
  const [empAllowLogin, setEmpAllowLogin] = useState<boolean>(false);
  const [empPassword, setEmpPassword] = useState<string>('');
  const [empConfirmPassword, setEmpConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [empUsePin, setEmpUsePin] = useState<boolean>(false);
  const [empPin, setEmpPin] = useState<string>('');
  const [empConfirmPin, setEmpConfirmPin] = useState<string>('');
  const [isStep4SaveDropdownOpen, setIsStep4SaveDropdownOpen] = useState<boolean>(false);
  const [showStep3Guide, setShowStep3Guide] = useState<boolean>(true);

  // Advanced roles subtable and popup states
  const [empBranches, setEmpBranches] = useState<{ id: string; branchName: string; roles: string[] }[]>([]);
  const [activeBranchRowIdForRoles, setActiveBranchRowIdForRoles] = useState<string | null>(null);
  const [isRolesPopupOpen, setIsRolesPopupOpen] = useState<boolean>(false);
  const [selectedPopupRoles, setSelectedPopupRoles] = useState<string[]>([]);
  const [activeBranchRowIdForBranchDropdown, setActiveBranchRowIdForBranchDropdown] = useState<string | null>(null);
  const [branchSearchQuery, setBranchSearchQuery] = useState<string>('');
  const [selectedBranchRowId, setSelectedBranchRowId] = useState<string | null>(null);

  const handlePinChange = (index: number, value: string, type: 'pin' | 'confirm') => {
    const cleanVal = value.replace(/[^0-9]/g, '').slice(-1);
    if (type === 'pin') {
      const currentPinArr = empPin.padEnd(4, ' ').split('');
      currentPinArr[index] = cleanVal || ' ';
      const newPin = currentPinArr.join('').trimEnd();
      setEmpPin(newPin);
      
      if (cleanVal && index < 3) {
        const isSecond = document.activeElement?.id.startsWith('pin-2-');
        const prefix = isSecond ? 'pin-2-' : 'pin-';
        const nextInput = document.getElementById(`${prefix}${index + 1}`);
        nextInput?.focus();
      }
    } else {
      const currentConfirmArr = empConfirmPin.padEnd(4, ' ').split('');
      currentConfirmArr[index] = cleanVal || ' ';
      const newConfirm = currentConfirmArr.join('').trimEnd();
      setEmpConfirmPin(newConfirm);
      
      if (cleanVal && index < 3) {
        const isSecond = document.activeElement?.id.startsWith('confirm-pin-2-');
        const prefix = isSecond ? 'confirm-pin-2-' : 'confirm-pin-';
        const nextInput = document.getElementById(`${prefix}${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, type: 'pin' | 'confirm') => {
    if (e.key === 'Backspace') {
      if (type === 'pin') {
        const currentPinArr = empPin.padEnd(4, ' ').split('');
        if (!currentPinArr[index] || currentPinArr[index] === ' ') {
          if (index > 0) {
            const isSecond = e.currentTarget.id.startsWith('pin-2-');
            const prefix = isSecond ? 'pin-2-' : 'pin-';
            const prevInput = document.getElementById(`${prefix}${index - 1}`);
            prevInput?.focus();
            currentPinArr[index - 1] = ' ';
            setEmpPin(currentPinArr.join('').trimEnd());
          }
        } else {
          currentPinArr[index] = ' ';
          setEmpPin(currentPinArr.join('').trimEnd());
        }
      } else {
        const currentConfirmArr = empConfirmPin.padEnd(4, ' ').split('');
        if (!currentConfirmArr[index] || currentConfirmArr[index] === ' ') {
          if (index > 0) {
            const isSecond = e.currentTarget.id.startsWith('confirm-pin-2-');
            const prefix = isSecond ? 'confirm-pin-2-' : 'confirm-pin-';
            const prevInput = document.getElementById(`${prefix}${index - 1}`);
            prevInput?.focus();
            currentConfirmArr[index - 1] = ' ';
            setEmpConfirmPin(currentConfirmArr.join('').trimEnd());
          }
        } else {
          currentConfirmArr[index] = ' ';
          setEmpConfirmPin(currentConfirmArr.join('').trimEnd());
        }
      }
    }
  };

  const handleDismissStep3Guide = () => {
    setShowStep3Guide(false);
  };

  const handleOpenAddEmployee = () => {
    setEditingEmployeeIndex(null);
    setEmpCode(`NV0${employees.length + 1}`);
    setEmpName('');
    setEmpRole(''); // Default is empty (no checkbox selected)
    setEmpEmail('');
    setEmpPhone('');
    setEmpTimekeepingCode('');
    setEmpGender('Nam');
    setEmpBirthday('');
    setEmpIdentityCard('');
    setEmpIssueDate('');
    setEmpIssuePlace('');
    setEmpStatus('Chính thức');
    setEmpAllowLogin(true); // Default to true so account fields show fully by default
    setEmpPassword('');
    setEmpConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setEmpUsePin(false);
    setEmpPin('');
    setEmpConfirmPin('');
    setActiveEmpPopupTab('general');
    
    // Initialize branches subtable with 1 empty row for "no selection" default
    const defaultBranches = [{ id: '1', branchName: '', roles: [] }];
    setEmpBranches(defaultBranches);
    setSelectedBranchRowId('1');
    setIsAddEmployeePopupOpen(true);
  };

  const handleOpenEditEmployee = (index: number) => {
    const emp = employees[index];
    setEditingEmployeeIndex(index);
    setEmpCode(emp.code || '');
    setEmpName(emp.name || '');
    
    // Resolve role/position
    const currentPos = (emp.role === 'Quản trị hệ thống' || emp.role === 'Quản lý chuỗi' || emp.role === 'Giám sát')
      ? emp.role 
      : '';
    setEmpRole(currentPos);
    
    setEmpEmail(emp.email && emp.email !== '—' ? emp.email : '');
    setEmpPhone(emp.phone && emp.phone !== '—' ? emp.phone : '');
    
    // Extra fields
    setEmpTimekeepingCode(emp.timekeepingCode || '');
    setEmpGender(emp.gender || 'Nam');
    setEmpBirthday(emp.birthday || '');
    setEmpIdentityCard(emp.identityCard || '');
    setEmpIssueDate(emp.issueDate || '');
    setEmpIssuePlace(emp.issuePlace || '');
    setEmpStatus(emp.status || 'Chính thức');
    setEmpAllowLogin(emp.allowLogin !== undefined ? emp.allowLogin : true);
    setEmpPassword(emp.password || '');
    setEmpConfirmPassword(emp.password || '');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setEmpUsePin(emp.usePin !== undefined ? emp.usePin : false);
    setEmpPin(emp.pin || '');
    setEmpConfirmPin(emp.pin || '');
    
    // Load branches subtable
    const initialBranches = emp.branches || (
      emp.role === 'Giám sát' ? [{ id: '1', branchName: '', roles: ['Giám sát'] }] :
      (emp.role === 'Quản trị hệ thống' || emp.role === 'Quản lý chuỗi') ? [] :
      [{ id: '1', branchName: '', roles: emp.role ? emp.role.split(', ') : [] }]
    );
    setEmpBranches(initialBranches);
    setSelectedBranchRowId(initialBranches[0]?.id || null);
    
    setActiveEmpPopupTab('general');
    setIsAddEmployeePopupOpen(true);
  };

  const handleSaveEmployee = (andAdd: boolean = false, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!empCode.trim() || !empName.trim()) {
      onNotification('⚠️ Vui lòng nhập đầy đủ Mã nhân viên và Họ tên!', 'info');
      return;
    }
    if (empUsePin) {
      if (empPin.replace(/\s/g, '').length < 4) {
        onNotification('⚠️ Vui lòng nhập Mã PIN gồm 4 chữ số!', 'info');
        return;
      }
      if (empPin !== empConfirmPin) {
        onNotification('⚠️ Xác nhận mã PIN không khớp!', 'info');
        return;
      }
    }
    const finalRole = empRole === 'Quản trị hệ thống' || empRole === 'Quản lý chuỗi' || empRole === 'Giám sát'
      ? empRole 
      : (empBranches.length > 0 
          ? Array.from(new Set(empBranches.flatMap(b => b.roles))).filter(Boolean).join(', ') || '—'
          : '—');

    const updatedEmp = { 
      code: empCode.trim(), 
      name: empName.trim(), 
      role: finalRole, 
      email: empEmail.trim() || '—', 
      phone: empPhone.trim() || '—',
      timekeepingCode: empTimekeepingCode.trim(),
      gender: empGender,
      birthday: empBirthday,
      identityCard: empIdentityCard.trim(),
      issueDate: empIssueDate,
      issuePlace: empIssuePlace.trim(),
      status: empStatus,
      allowLogin: (empRole === 'Giám sát' || empRole === '') ? true : empAllowLogin,
      password: empPassword,
      usePin: empUsePin,
      pin: empPin,
      branches: empBranches
    };

    if (editingEmployeeIndex !== null) {
      setEmployees(prev => {
        const updated = [...prev];
        updated[editingEmployeeIndex] = updatedEmp;
        localStorage.setItem('cukcuk_employees', JSON.stringify(updated));
        return updated;
      });
      onNotification(`🎉 Đã cập nhật thông tin nhân viên ${empName}!`, 'success');
      setEditingEmployeeIndex(null);
      setIsAddEmployeePopupOpen(false);
    } else {
      setEmployees(prev => {
        const updated = [...prev, updatedEmp];
        localStorage.setItem('cukcuk_employees', JSON.stringify(updated));
        return updated;
      });
      onNotification(`🎉 Đã thêm nhân viên ${empName} mới vào hệ thống!`, 'success');
      
      if (andAdd) {
        // Clear fields but stay in modal
        const nextCodeNum = employees.length + 2;
        setEmpCode(`NV${String(nextCodeNum).padStart(2, '0')}`);
        setEmpName('');
        setEmpRole('Thu ngân');
        setEmpEmail('');
        setEmpPhone('');
        setEmpTimekeepingCode('');
        setEmpGender('Nam');
        setEmpBirthday('');
        setEmpIdentityCard('');
        setEmpIssueDate('');
        setEmpIssuePlace('');
        setEmpStatus('Chính thức');
        setEmpAllowLogin(false);
        setEmpPassword('');
        setEmpConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setEmpUsePin(false);
        setEmpPin('');
        setEmpConfirmPin('');
      } else {
        setEmpCode('');
        setEmpName('');
        setEmpRole('Thu ngân');
        setEmpEmail('');
        setEmpPhone('');
        setEmpTimekeepingCode('');
        setEmpGender('Nam');
        setEmpBirthday('');
        setEmpIdentityCard('');
        setEmpIssueDate('');
        setEmpIssuePlace('');
        setEmpStatus('Chính thức');
        setEmpAllowLogin(false);
        setEmpPassword('');
        setEmpConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setEmpUsePin(false);
        setEmpPin('');
        setEmpConfirmPin('');
        setEditingEmployeeIndex(null);
        setIsAddEmployeePopupOpen(false);
      }
    }
  };

  const handleDeleteEmployee = (index: number) => {
    const empToDelete = employees[index];
    if (empToDelete && empToDelete.role === 'Quản trị hệ thống') {
      onNotification('⚠️ Không thể xóa nhân viên quyền Quản trị hệ thống (tài khoản đang sử dụng)!', 'warning');
      return;
    }
    setEmployees(prev => {
      const updated = prev.filter((_, idx) => idx !== index);
      localStorage.setItem('cukcuk_employees', JSON.stringify(updated));
      return updated;
    });
    onNotification('🗑️ Đã xóa nhân viên khỏi danh sách!', 'success');
  };

  // Step 5 Local States & Helpers
  const [step5Areas, setStep5Areas] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_step5_areas');
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cukcuk_step5_areas', JSON.stringify(step5Areas));
  }, [step5Areas]);

  // Form states for Add/Edit Area popup
  const [isStep5PopupOpen, setIsStep5PopupOpen] = useState(false);
  const [step5PopupMode, setStep5PopupMode] = useState<'add' | 'edit'>('add');
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [areaCode, setAreaCode] = useState('');
  const [step5AreaName, setStep5AreaName] = useState('');
  const [areaParentId, setAreaParentId] = useState<string>('none');
  const [areaTablesCount, setAreaTablesCount] = useState<number>(10);
  const [areaSeatsCount, setAreaSeatsCount] = useState<number>(60);
  const [step5AreaDescription, setStep5AreaDescription] = useState('');

  // States for Quick Setup popup (Thiết lập nhanh sơ đồ)
  const [isQuickSetupPopupOpen, setIsQuickSetupPopupOpen] = useState(false);
  const [quickSetupAreaCount, setQuickSetupAreaCount] = useState<number>(3);
  const [quickSetupRows, setQuickSetupRows] = useState<Array<{ key: string; code: string; name: string; tablesCount: number; startFrom: number }>>([
    { key: '1', code: '1', name: 'Tầng 1', tablesCount: 1, startFrom: 1 },
    { key: '2', code: '2', name: 'Tầng 2', tablesCount: 1, startFrom: 1 },
    { key: '3', code: '3', name: 'Tầng 3', tablesCount: 1, startFrom: 1 }
  ]);
  const [isSelectTablePatternOpen, setIsSelectTablePatternOpen] = useState<boolean>(false);
  const [selectedTablePattern, setSelectedTablePattern] = useState<string>('Mẫu 1');
  const [quickSetupSeats, setQuickSetupSeats] = useState<number>(6);

  // New Quick Setup states
  const [isDesignerQuickSetupOpen, setIsDesignerQuickSetupOpen] = useState<boolean>(false);
  const [quickSetupDoorPosition, setQuickSetupDoorPosition] = useState<string>('Trên');
  const [quickSetupTableCount, setQuickSetupTableCount] = useState<number>(10);
  const [quickSetupTableShape, setQuickSetupTableShape] = useState<string>('Bàn chữ nhật');
  const [quickSetupSeatsPerTable, setQuickSetupSeatsPerTable] = useState<number>(6);
  const [quickSetupPrefix, setQuickSetupPrefix] = useState<string>('B');
  const [quickSetupStartFrom, setQuickSetupStartFrom] = useState<number>(1);
  const [quickSetupAdvancedOpen, setQuickSetupAdvancedOpen] = useState<boolean>(true);
  const [quickSetupRowCount, setQuickSetupRowCount] = useState<number>(3);
  const [quickSetupArrangeType, setQuickSetupArrangeType] = useState<'vertical' | 'horizontal'>('vertical');

  // Step 4 filtering states
  const [filterStep4Code, setFilterStep4Code] = useState('');
  const [filterStep4Name, setFilterStep4Name] = useState('');
  const [filterStep4Tables, setFilterStep4Tables] = useState('');
  const [filterStep4Seats, setFilterStep4Seats] = useState('');
  const [filterStep4TablesOp, setFilterStep4TablesOp] = useState<'=' | '<=' | '>='>('>=');
  const [filterStep4SeatsOp, setFilterStep4SeatsOp] = useState<'=' | '<=' | '>='>('>=');


  // States for interactive table designer
  const [isStep5DesignerOpen, setIsStep5DesignerOpen] = useState(false);
  const [designerAreaId, setDesignerAreaId] = useState<string | null>(null);
  const [designerTables, setDesignerTables] = useState<any[]>([]);
  const [initialDesignerTables, setInitialDesignerTables] = useState<any[]>([]);
  const [designerDoors, setDesignerDoors] = useState<{ id: string; x: number; y: number }[]>([]);
  const [designerRooms, setDesignerRooms] = useState<{ id: string; name: string; x: number; y: number }[]>([]);
  const [designerBgPattern, setDesignerBgPattern] = useState<string | null>(null);
  const [draggingElement, setDraggingElement] = useState<{ id: string; type: 'table' | 'door' | 'room' } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeGuides, setActiveGuides] = useState<{ x?: number; y?: number } | null>(null);
  const [resizingRoom, setResizingRoom] = useState<{
    id: string;
    direction: 'w' | 'h' | 'se';
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);
  const [openDoorDropdownId, setOpenDoorDropdownId] = useState<string | null>(null);
  const [activeTableDropdownId, setActiveTableDropdownId] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<'shape' | 'seats' | 'status' | 'style' | null>(null);
  const [editingTableInModal, setEditingTableInModal] = useState<any | null>(null);
  const [modalTableName, setModalTableName] = useState<string>('');
  const [modalTableSeats, setModalTableSeats] = useState<number>(6);
  const [modalTableShape, setModalTableShape] = useState<string>('Bàn chữ nhật');
  const [modalTableStatus, setModalTableStatus] = useState<'empty' | 'serving' | 'booked'>('empty');

  // Multi-selection states and Portal coordinate states for dropdowns
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
  const [dragSelectionBox, setDragSelectionBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const [doorDropdownCoords, setDoorDropdownCoords] = useState<{ top: number; left: number; doorId: string } | null>(null);
  const [tableDropdownCoords, setTableDropdownCoords] = useState<{ top: number; left: number; tblId: string } | null>(null);

  // Toggle tree node expansion
  const toggleAreaExpand = (id: string) => {
    setStep5Areas(prev => prev.map(area => {
      if (area.id === id) {
        return { ...area, isExpanded: !area.isExpanded };
      }
      return area;
    }));
  };

  const renderDemoTable = (status: 'empty' | 'serving' | 'reserved', label: string) => {
    let tableBg = '';
    let textColor = '';
    let chairBg = '';

    if (status === 'empty') {
      tableBg = 'bg-[#245FDF]';
      textColor = 'text-white';
      chairBg = 'bg-[#245FDF]';
    } else if (status === 'serving') {
      tableBg = 'bg-[#CBD5E1]';
      textColor = 'text-slate-600';
      chairBg = 'bg-[#CBD5E1]';
    } else {
      tableBg = 'bg-[#FDB022]';
      textColor = 'text-amber-950';
      chairBg = 'bg-[#FDB022]';
    }

    if (selectedTablePattern === 'Mẫu 2') {
      // Bàn tròn
      return (
        <div className="relative flex items-center justify-center w-24 h-20 transition-all duration-300">
          {/* Table */}
          <div className={`w-12 h-12 ${tableBg} rounded-full flex items-center justify-center shadow-xs z-10 transition-all duration-300`}>
            <span className={`text-[10px] ${textColor} font-bold select-none`}>{label}</span>
          </div>
          {/* Chairs */}
          <div className="absolute top-2">
            <div className={`w-3.5 h-1.5 ${chairBg} rounded-t-[2px] transition-all duration-300`}></div>
          </div>
          <div className="absolute bottom-2">
            <div className={`w-3.5 h-1.5 ${chairBg} rounded-b-[2px] transition-all duration-300`}></div>
          </div>
          <div className="absolute left-3">
            <div className={`w-1.5 h-3.5 ${chairBg} rounded-l-[2px] transition-all duration-300`}></div>
          </div>
          <div className="absolute right-3">
            <div className={`w-1.5 h-3.5 ${chairBg} rounded-r-[2px] transition-all duration-300`}></div>
          </div>
        </div>
      );
    }

    if (selectedTablePattern === 'Mẫu 3') {
      // Bàn vuông
      return (
        <div className="relative flex items-center justify-center w-24 h-20 transition-all duration-300">
          {/* Table */}
          <div className={`w-11 h-11 ${tableBg} rounded-md flex items-center justify-center shadow-xs z-10 transition-all duration-300`}>
            <span className={`text-[10px] ${textColor} font-bold select-none`}>{label}</span>
          </div>
          {/* Chairs */}
          <div className="absolute top-2.5">
            <div className={`w-3.5 h-1.5 ${chairBg} rounded-t-[1.5px] transition-all duration-300`}></div>
          </div>
          <div className="absolute bottom-2.5">
            <div className={`w-3.5 h-1.5 ${chairBg} rounded-b-[1.5px] transition-all duration-300`}></div>
          </div>
          <div className="absolute left-3.5">
            <div className={`w-1.5 h-3.5 ${chairBg} rounded-l-[1.5px] transition-all duration-300`}></div>
          </div>
          <div className="absolute right-3.5">
            <div className={`w-1.5 h-3.5 ${chairBg} rounded-r-[1.5px] transition-all duration-300`}></div>
          </div>
        </div>
      );
    }

    // Default: Bàn chữ nhật (Mẫu 1)
    return (
      <div className="relative flex items-center justify-center w-24 h-20 transition-all duration-300">
        {/* Table */}
        <div className={`w-16 h-10 ${tableBg} rounded-md flex items-center justify-center shadow-xs z-10 transition-all duration-300`}>
          <span className={`text-[10px] ${textColor} font-bold select-none`}>{label}</span>
        </div>
        {/* Chairs */}
        <div className="absolute top-3 flex gap-2">
          <div className={`w-3 h-1 ${chairBg} rounded-t-[1px] transition-all duration-300`}></div>
          <div className={`w-3 h-1 ${chairBg} rounded-t-[1px] transition-all duration-300`}></div>
        </div>
        <div className="absolute bottom-3 flex gap-2">
          <div className={`w-3 h-1 ${chairBg} rounded-b-[1px] transition-all duration-300`}></div>
          <div className={`w-3 h-1 ${chairBg} rounded-b-[1px] transition-all duration-300`}></div>
        </div>
        <div className="absolute left-2.5">
          <div className={`w-1 h-3 ${chairBg} rounded-l-[1px] transition-all duration-300`}></div>
        </div>
        <div className="absolute right-2.5">
          <div className={`w-1 h-3 ${chairBg} rounded-r-[1px] transition-all duration-300`}></div>
        </div>
      </div>
    );
  };

  // Check if area should be displayed based on parents expansion
  const isAreaVisible = (area: any, allAreas: any[]): boolean => {
    if (area.parentId === null) return true;
    const parent = allAreas.find(a => a.id === area.parentId);
    if (!parent) return true;
    if (!parent.isExpanded) return false;
    return isAreaVisible(parent, allAreas);
  };

  // Recursive stats computer
  const getAreaComputedStats = (area: any, allAreas: any[]): { tables: number, seats: number } => {
    const children = allAreas.filter(a => a.parentId === area.id);
    if (children.length === 0) {
      return { tables: area.tables || 0, seats: area.seats || 0 };
    }
    let totalTables = 0;
    let totalSeats = 0;
    children.forEach(child => {
      const stats = getAreaComputedStats(child, allAreas);
      totalTables += stats.tables;
      totalSeats += stats.seats;
    });
    return { tables: totalTables, seats: totalSeats };
  };

  const handleOpenAddArea = () => {
    setStep5PopupMode('add');
    setEditingAreaId(null);
    setDesignerAreaId('new_area_temp_id');
    setAreaCode('B');
    setStep5AreaName('');
    setAreaParentId('none');
    setStep5AreaDescription('');
    
    // Initialize default tables for welcoming experience
    const generated = [];
    for (let i = 1; i <= 6; i++) {
      const formattedNum = i < 10 ? '0' + i : '' + i;
      const isEven = i % 2 === 0;
      const colIndex = isEven ? 1 : 0;
      const rowIndex = Math.floor((i - 1) / 2);
      generated.push({
        id: 'tbl-temp-' + i + '-' + Date.now(),
        name: 'B' + formattedNum,
        seats: 6,
        x: colIndex * 150 + 120,
        y: rowIndex * 100 + 80,
        status: 'empty',
        shape: 'Bàn chữ nhật'
      });
    }
    setDesignerTables(generated);
    setInitialDesignerTables(generated);
    setDesignerDoors([{ id: 'door-default', x: 20, y: 160 }]);
    setDesignerRooms([]);
    setDesignerBgPattern(null);
    setIsStep5DesignerOpen(true);
  };

  const handleOpenEditStep5Area = (id: string) => {
    handleOpenDesigner(id);
  };

  const handleDeleteStep5Area = (id: string) => {
    setStep5Areas(prev => {
      // Find all IDs to delete (the item and its recursive descendants)
      const getDescendantIds = (parentId: string, list: any[]): string[] => {
        let ids = [parentId];
        list.forEach(item => {
          if (item.parentId === parentId) {
            ids = [...ids, ...getDescendantIds(item.id, list)];
          }
        });
        return ids;
      };
      const idsToDelete = getDescendantIds(id, prev);
      const updated = prev.filter(a => !idsToDelete.includes(a.id));
      onNotification('🗑️ Đã xóa khu vực và các khu vực con thành công!', 'success');
      return updated;
    });
  };

  const handleSaveArea = () => {
    if (!areaCode.trim() || !step5AreaName.trim()) {
      onNotification('⚠️ Vui lòng điền đầy đủ Ký hiệu và Tên khu vực!', 'warning');
      return;
    }

    const totalTables = designerTables.length;
    const totalSeats = designerTables.reduce((sum, t) => sum + t.seats, 0);

    if (step5PopupMode === 'add') {
      const newId = String(Date.now());
      let depth = 0;
      let pId = areaParentId === 'none' ? null : areaParentId;
      if (pId) {
        const parent = step5Areas.find(a => a.id === pId);
        if (parent) {
          depth = (parent.depth || 0) + 1;
        }
      }

      const newArea = {
        id: newId,
        code: areaCode.toUpperCase(),
        name: step5AreaName,
        tables: totalTables,
        seats: totalSeats,
        isExpanded: true,
        isParent: false,
        parentId: pId,
        depth: depth,
        description: step5AreaDescription,
        savedTables: designerTables.map(t => {
          if (t.id.includes('temp')) {
            return { ...t, id: t.id.replace('temp', newId) };
          }
          return t;
        }),
        savedDoors: designerDoors,
        savedRooms: designerRooms,
        savedBgPattern: designerBgPattern
      };

      setStep5Areas(prev => {
        let updated = prev.map(a => {
          if (pId && a.id === pId) {
            return { ...a, isParent: true, isExpanded: true };
          }
          return a;
        });
        updated.push(newArea);
        return updated;
      });
      onNotification('🎉 Đã thêm khu vực mới và thiết lập sơ đồ thành công!', 'success');
    } else {
      // Edit mode
      setStep5Areas(prev => {
        let pId = areaParentId === 'none' ? null : areaParentId;
        let depth = 0;
        if (pId) {
          const parent = prev.find(a => a.id === pId);
          if (parent) {
            depth = (parent.depth || 0) + 1;
          }
        }

        return prev.map(a => {
          if (a.id === editingAreaId) {
            return {
              ...a,
              code: areaCode.toUpperCase(),
              name: step5AreaName,
              parentId: pId,
              depth: depth,
              tables: totalTables,
              seats: totalSeats,
              description: step5AreaDescription,
              savedTables: designerTables,
              savedDoors: designerDoors,
              savedRooms: designerRooms,
              savedBgPattern: designerBgPattern
            };
          }
          return a;
        });
      });
      onNotification('✨ Đã cập nhật khu vực và sơ đồ phòng bàn thành công!', 'success');
    }
    setIsStep5DesignerOpen(false);
  };

  const handleQuickSetup = () => {
    setQuickSetupAreaCount(3);
    setQuickSetupRows([
      { key: '1', code: '1', name: 'Tầng 1', tablesCount: 1, startFrom: 1 },
      { key: '2', code: '2', name: 'Tầng 2', tablesCount: 1, startFrom: 1 },
      { key: '3', code: '3', name: 'Tầng 3', tablesCount: 1, startFrom: 1 }
    ]);
    setSelectedTablePattern('Mẫu 1');
    setIsQuickSetupPopupOpen(true);
  };

  const handleInitializeQuickSetupRows = () => {
    const count = Math.max(1, Math.min(20, quickSetupAreaCount));
    const newRows = [];
    for (let i = 1; i <= count; i++) {
      newRows.push({
        key: String(i),
        code: String(i),
        name: `Tầng ${i}`,
        tablesCount: 1,
        startFrom: 1
      });
    }
    setQuickSetupRows(newRows);
    onNotification(`✨ Đã khởi tạo cấu hình cho ${count} khu vực!`, 'info');
  };

  const handleNewQuickSetupSubmit = () => {
    const totalTables = Number(quickSetupTableCount) || 10;
    const shape = quickSetupTableShape;
    const seats = Number(quickSetupSeatsPerTable) || 6;
    const prefix = quickSetupPrefix || 'B';
    const startFrom = Number(quickSetupStartFrom) || 1;
    const rowCount = Number(quickSetupRowCount) || 3;
    const arrangeType = quickSetupArrangeType; // 'vertical' | 'horizontal'

    const generated: any[] = [];
    for (let i = 0; i < totalTables; i++) {
      const tableNum = startFrom + i;
      const formattedNum = tableNum < 10 ? `0${tableNum}` : `${tableNum}`;
      
      let rowIndex = 0;
      let colIndex = 0;
      if (arrangeType === 'vertical') {
        rowIndex = i % rowCount;
        colIndex = Math.floor(i / rowCount);
      } else {
        colIndex = i % rowCount;
        rowIndex = Math.floor(i / rowCount);
      }
      
      const x = colIndex * 150 + 120;
      const y = rowIndex * 100 + 80;

      generated.push({
        id: `tbl-${designerAreaId}-${Date.now()}-${i}`,
        name: `${prefix}${formattedNum}`,
        seats: seats,
        x: x,
        y: y,
        status: 'empty',
        shape: shape
      });
    }

    let doorX = 20;
    let doorY = 160;
    if (quickSetupDoorPosition === 'Trên') {
      doorX = 360;
      doorY = 20;
    } else if (quickSetupDoorPosition === 'Dưới') {
      doorX = 360;
      doorY = 320;
    } else if (quickSetupDoorPosition === 'Trái') {
      doorX = 20;
      doorY = 160;
    } else if (quickSetupDoorPosition === 'Phải') {
      doorX = 720;
      doorY = 160;
    }

    setDesignerTables(generated);
    setDesignerDoors([{ id: `door-${Date.now()}`, x: doorX, y: doorY }]);
    setDesignerRooms([]);
    setDesignerBgPattern(null);
    setIsDesignerQuickSetupOpen(false);
    onNotification(`✨ Đã tự động thiết lập nhanh sơ đồ gồm ${totalTables} bàn!`, 'success');
  };

  const handleQuickSetupSubmit = () => {
    const hasEmpty = quickSetupRows.some(r => !r.code.trim() || !r.name.trim());
    if (hasEmpty) {
      onNotification('⚠️ Vui lòng nhập đầy đủ Ký hiệu và Tên cho toàn bộ các khu vực!', 'warning');
      return;
    }
    setIsSelectTablePatternOpen(true);
  };

  const handleConfirmTablePattern = () => {
    const newAreas = quickSetupRows.map((row, index) => {
      const areaId = `quick-area-${Date.now()}-${index}`;
      const tablesNum = Number(row.tablesCount) || 1;
      const startNum = Number(row.startFrom) || 1;
      
      return {
        id: areaId,
        code: row.code.toUpperCase(),
        name: row.name,
        tables: tablesNum,
        seats: tablesNum * quickSetupSeats,
        isExpanded: true,
        isParent: false,
        parentId: null,
        depth: 0,
        prefix: row.code,
        startFrom: startNum,
        seatsPerTable: quickSetupSeats,
        shape: selectedTablePattern === 'Mẫu 1' ? 'Bàn chữ nhật' : 'Bàn tròn',
        description: `Khu vực thiết lập nhanh theo ${selectedTablePattern}`
      };
    });

    setStep5Areas(newAreas);
    setIsSelectTablePatternOpen(false);
    setIsQuickSetupPopupOpen(false);
    onNotification(`⚡ Đã thiết lập nhanh toàn bộ sơ đồ phòng bàn nhà hàng thành công!`, 'success');
  };

  const handleElementMouseDown = (e: React.MouseEvent, id: string, type: 'table' | 'door' | 'room') => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to prevent drag selection from triggering on canvas click
    setDraggingElement({ id, type });
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setActiveTableDropdownId(null);
    setTableDropdownCoords(null);
    setDoorDropdownCoords(null);

    // Update table selections
    if (type === 'table') {
      setSelectedTableIds(prev => {
        if (prev.includes(id)) {
          return prev; // Keep current selection if already selected
        }
        return [id]; // Otherwise, select only this clicked table
      });
    } else {
      setSelectedTableIds([]);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, id: string, direction: 'w' | 'h' | 'se') => {
    e.stopPropagation();
    e.preventDefault();
    const room = designerRooms.find(r => r.id === id);
    if (!room) return;
    setResizingRoom({
      id,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startW: room.w || 320,
      startH: room.h || 160
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (resizingRoom) {
      e.preventDefault();
      const deltaX = e.clientX - resizingRoom.startX;
      const deltaY = e.clientY - resizingRoom.startY;
      
      const newW = Math.max(100, resizingRoom.startW + (resizingRoom.direction === 'h' ? 0 : deltaX));
      const newH = Math.max(80, resizingRoom.startH + (resizingRoom.direction === 'w' ? 0 : deltaY));
      
      setDesignerRooms(prev => prev.map(r => r.id === resizingRoom.id ? { ...r, w: newW, h: newH } : r));
      return;
    }

    // Drag selection box handler
    if (dragSelectionBox) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      
      setDragSelectionBox(prev => prev ? {
        ...prev,
        currentX: x,
        currentY: y
      } : null);

      // Evaluate intersections with tables
      const selLeft = Math.min(dragSelectionBox.startX, x);
      const selRight = Math.max(dragSelectionBox.startX, x);
      const selTop = Math.min(dragSelectionBox.startY, y);
      const selBottom = Math.max(dragSelectionBox.startY, y);

      const intersectingIds: string[] = [];
      for (const tbl of designerTables) {
        let width = 88;
        let height = 60;
        if (tbl.shape === 'Bàn tròn') {
          width = 78;
          height = 78;
        } else if (tbl.shape === 'Bàn vuông') {
          width = 70;
          height = 70;
        }

        const tblLeft = tbl.x;
        const tblRight = tbl.x + width;
        const tblTop = tbl.y;
        const tblBottom = tbl.y + height;

        const isIntersecting = !(tblRight < selLeft || tblLeft > selRight || tblBottom < selTop || tblTop > selBottom);
        if (isIntersecting) {
          intersectingIds.push(tbl.id);
        }
      }
      setSelectedTableIds(intersectingIds);
      return;
    }

    if (!draggingElement) return;
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    
    const boundedX = Math.max(0, Math.min(canvasRect.width - 100, x));
    const boundedY = Math.max(0, Math.min(canvasRect.height - 80, y));

    if (draggingElement.type === 'table') {
      let finalX = boundedX;
      let finalY = boundedY;
      let guides: { x?: number; y?: number } | null = null;
      const snapThreshold = 10;
      
      const currentTbl = designerTables.find(t => t.id === draggingElement.id);
      if (currentTbl) {
        const otherTables = designerTables.filter(t => t.id !== draggingElement.id && !selectedTableIds.includes(t.id));

        let snappedX = false;
        let snappedY = false;

        for (const other of otherTables) {
          if (!snappedX && Math.abs(boundedX - other.x) < snapThreshold) {
            finalX = other.x;
            snappedX = true;
            guides = { ...guides, x: other.x };
          }
          if (!snappedY && Math.abs(boundedY - other.y) < snapThreshold) {
            finalY = other.y;
            snappedY = true;
            guides = { ...guides, y: other.y };
          }
        }

        const deltaX = finalX - currentTbl.x;
        const deltaY = finalY - currentTbl.y;

        // If dragging table is part of a multi-table selection, move all of them relative to the dragged table!
        if (selectedTableIds.includes(draggingElement.id) && selectedTableIds.length > 1) {
          setDesignerTables(prev => prev.map(t => {
            if (selectedTableIds.includes(t.id)) {
              return {
                ...t,
                x: Math.max(0, Math.min(canvasRect.width - 80, t.x + deltaX)),
                y: Math.max(0, Math.min(canvasRect.height - 80, t.y + deltaY))
              };
            }
            return t;
          }));
        } else {
          setDesignerTables(prev => prev.map(t => t.id === draggingElement.id ? { ...t, x: finalX, y: finalY } : t));
        }
        setActiveGuides(guides);
      }
    } else if (draggingElement.type === 'door') {
      setDesignerDoors(prev => prev.map(d => d.id === draggingElement.id ? { ...d, x: boundedX, y: boundedY } : d));
      setActiveGuides(null);
    } else if (draggingElement.type === 'room') {
      setDesignerRooms(prev => prev.map(r => r.id === draggingElement.id ? { ...r, x: boundedX, y: boundedY } : r));
      setActiveGuides(null);
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingElement(null);
    setResizingRoom(null);
    setActiveGuides(null);
    setDragSelectionBox(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;

    setActiveTableDropdownId(null);
    setOpenDoorDropdownId(null);
    setDoorDropdownCoords(null);
    setTableDropdownCoords(null);

    setSelectedTableIds([]);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragSelectionBox({
      startX: x,
      startY: y,
      currentX: x,
      currentY: y
    });
  };

  const handleOpenDesigner = (id: string) => {
    const area = step5Areas.find(a => a.id === id);
    if (!area) return;
    setDesignerAreaId(id);
    setEditingAreaId(id);
    setStep5PopupMode('edit');
    setAreaCode(area.code || '');
    setStep5AreaName(area.name || '');
    setAreaParentId(area.parentId || 'none');
    setStep5AreaDescription(area.description || '');
    
    // Clear selection & portal positions
    setSelectedTableIds([]);
    setDragSelectionBox(null);
    setDoorDropdownCoords(null);
    setTableDropdownCoords(null);
    setActiveTableDropdownId(null);
    setOpenDoorDropdownId(null);

    if (area.savedTables) {
      // Convert any legacy shapes to enforce 2 shapes rule (Bàn chữ nhật / Bàn tròn)
      const validatedTables = area.savedTables.map((t: any) => ({
        ...t,
        shape: t.shape === 'Bàn tròn' ? 'Bàn tròn' : 'Bàn chữ nhật'
      }));
      setDesignerTables(validatedTables);
      setInitialDesignerTables(validatedTables);
      setDesignerDoors(area.savedDoors || []);
      setDesignerRooms(area.savedRooms || []);
      setDesignerBgPattern(area.savedBgPattern || null);
    } else {
      // Generate some tables based on the area's table counts in an elegant 2-column layout
      const count = area.tables || 5;
      const prefix = area.prefix !== undefined ? area.prefix : (area.code || 'B');
      const startFrom = area.startFrom !== undefined ? area.startFrom : 1;
      const seatsPerTable = area.seatsPerTable !== undefined ? area.seatsPerTable : (Math.ceil((area.seats || (count * 6)) / count) || 6);
      const shape = area.shape === 'Bàn tròn' ? 'Bàn tròn' : 'Bàn chữ nhật';

      const generated = [];
      for (let i = 1; i <= count; i++) {
        const tableNum = startFrom + i - 1;
        const formattedNum = tableNum < 10 ? `0${tableNum}` : `${tableNum}`;
        
        // 2-column layout: left column (odd index) and right column (even index)
        const isEven = i % 2 === 0;
        const colIndex = isEven ? 1 : 0;
        const rowIndex = Math.floor((i - 1) / 2);
        
        generated.push({
          id: `tbl-${id}-${i}-${Date.now()}`,
          name: `${prefix}${formattedNum}`,
          seats: seatsPerTable,
          x: colIndex * 150 + 120, // Clean, spacious coordinate
          y: rowIndex * 100 + 80,
          status: 'empty',
          shape: shape
        });
      }
      setDesignerTables(generated);
      setInitialDesignerTables(generated);
      setDesignerDoors([{ id: 'door-default', x: 20, y: 160 }]); // Standard door on the left of the canvas as in image
      setDesignerRooms([]);
      setDesignerBgPattern(null);
    }
    setIsStep5DesignerOpen(true);
  };

  const handleSaveDesignerTables = () => {
    if (!designerAreaId) return;
    // Calculate total tables & seats
    const totalTables = designerTables.length;
    const totalSeats = designerTables.reduce((sum, t) => sum + t.seats, 0);

    setStep5Areas(prev => prev.map(a => {
      if (a.id === designerAreaId) {
        return {
          ...a,
          tables: totalTables,
          seats: totalSeats,
          savedTables: designerTables,
          savedDoors: designerDoors,
          savedRooms: designerRooms,
          savedBgPattern: designerBgPattern
        };
      }
      return a;
    }));

    setIsStep5DesignerOpen(false);
    onNotification(`💾 Đã lưu cấu hình sơ đồ tương tác của ${step5Areas.find(a => a.id === designerAreaId)?.name}!`, 'success');
  };

  const handleAddDesignerTable = () => {
    const nextIdx = designerTables.length + 1;
    const area = step5Areas.find(a => a.id === designerAreaId);
    const code = area ? area.code : 'B';
    const nextNum = (area?.startFrom || 1) + nextIdx - 1;
    const formattedNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    
    // Determine a clean position inside canvas
    const isEven = nextIdx % 2 === 0;
    const colIndex = isEven ? 1 : 0;
    const rowIndex = Math.floor((nextIdx - 1) / 2);
    
    setDesignerTables(prev => [
      ...prev,
      {
        id: `tbl-${designerAreaId}-${nextIdx}-${Date.now()}`,
        name: `${code}${formattedNum}`,
        seats: 6,
        x: colIndex * 360 + 200,
        y: rowIndex * 85 + 40,
        status: 'empty',
        shape: 'Bàn chữ nhật'
      }
    ]);
    onNotification(`✨ Đã thêm bàn mới ${code}${formattedNum} vào khu vực!`, 'success');
  };

  // Step 6 Local States & Helpers
  const [selectedPaymentType, setSelectedPaymentType] = useState<'transfer' | 'wallet' | null>(null);
  const bankList = ['Vietcombank', 'MB Bank', 'Techcombank', 'BIDV', 'ACB', 'VietinBank'];
  const walletList = ['Momo', 'ZaloPay', 'ShopeePay', 'VNPAY'];

  const getBankLogo = (bankName: string) => {
    switch (bankName) {
      case 'Vietcombank':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.3967 1.48877C11.5913 2.05291 10.5545 3.33365 10.6612 5.16329C10.7984 7.74003 13.6344 12.6496 14.9913 14.8299C17.3546 18.6569 20.1601 22.1027 23.2705 25.2893C25.7862 27.7746 27.3719 28.3234 30.0706 24.6489C32.3729 21.6148 34.4922 18.6111 36.3066 14.8451C37.0995 13.1984 37.8466 11.3993 38.5022 9.37146C39.2036 7.00817 38.9596 4.91934 36.6421 3.39464C38.8681 4.47718 39.8439 6.47453 39.9811 8.68534C40.1184 10.8199 39.478 13.1375 38.9901 14.8451C37.7856 19.099 36.2304 23.3834 34.2635 27.2409C32.7846 30.1531 30.8939 33.6599 29.0033 36.2519C24.8257 42 20.8309 40.1399 16.1349 36.2519C13.1617 33.7819 10.2953 30.6715 7.84053 27.2562C5.35527 23.8256 2.62606 18.7331 1.00988 14.8146C-1.20093 9.46294 0.521977 6.71848 3.25118 4.98033C6.25484 3.07445 10.7527 1.99192 14.3967 1.48877Z" fill="url(#paint0_linear_9622_56843)"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M14.29 13.7017C18.6354 13.0461 29.9334 12.3447 33.8976 14.403C35.2241 15.0892 35.2546 16.0192 35.1326 17.0713C35.529 16.3547 35.9102 15.6076 36.2914 14.8452C37.0842 13.1985 37.8313 11.3994 38.4869 9.37154C39.1883 7.00826 38.9444 4.91943 36.6268 3.39473C35.773 2.93732 34.7819 2.61713 33.8976 2.35793C31.2904 1.59558 28.3935 1.29065 25.4813 1.07719C24.2768 0.985706 23.0265 1.00095 21.7458 1.00095C19.4435 1.00095 16.9125 1.15342 14.3967 1.48886C11.5913 2.05299 10.5545 3.33374 10.6612 5.16338C10.7832 7.35894 12.8568 11.2469 14.3052 13.7017H14.29Z" fill="url(#paint1_linear_9622_56843)"/>
            <defs>
              <linearGradient id="paint0_linear_9622_56843" x1="35.1174" y1="25.9602" x2="3.22069" y2="3.62335" gradientUnits="userSpaceOnUse">
                <stop stopColor="#006840"/>
                <stop offset="0.4" stopColor="#007A48"/>
                <stop offset="1" stopColor="#86C440"/>
              </linearGradient>
              <linearGradient id="paint1_linear_9622_56843" x1="15.1133" y1="1.29065" x2="33.9891" y2="14.5098" gradientUnits="userSpaceOnUse">
                <stop stopColor="#006840"/>
                <stop offset="0.3" stopColor="#007A48"/>
                <stop offset="1" stopColor="#86C440"/>
              </linearGradient>
            </defs>
          </svg>
        );
      case 'Techcombank':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M26.6683 7L20.0049 13.6452V13.6644L26.6683 20.3096L20.0049 26.9548V26.9692L26.6683 33.6144L40.0001 20.3096L26.6683 7Z" fill="#EC1C24"/>
            <path d="M13.3365 7L19.9904 13.6452V13.6644L13.3365 20.3096L19.9904 26.9548V26.9692L13.3365 33.6144L0 20.3096L13.3365 7Z" fill="#EC1C24"/>
          </svg>
        );
      case 'ACB':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M22.1437 13C17.9594 12.9999 14.5673 16.4199 14.5673 20.6388C14.5673 24.8576 17.9594 28.2776 22.1437 28.2775C24.2055 28.2774 26.0736 27.4461 27.4396 26.099C27.5824 25.9588 27.5506 25.6992 27.4396 25.587L25.8831 24.0131C25.7325 23.8608 25.4875 23.8955 25.4085 23.9737C24.6172 24.7584 23.5472 25.2398 22.3696 25.2397C19.9325 25.2397 17.9569 23.177 17.957 20.6328C17.957 18.0987 19.9177 16.0405 22.3452 16.0263C22.3533 16.0263 22.3614 16.0263 22.3696 16.0263C23.5149 16.0263 24.5584 16.4817 25.3427 17.2285C25.4335 17.3149 25.6601 17.303 25.7932 17.1682L27.3316 15.6113C27.4047 15.5373 27.5431 15.2901 27.3864 15.1273C26.0253 13.8106 24.179 13.0001 22.1437 13ZM6.61202 13.3741C6.50043 13.3838 6.26068 13.4508 6.12681 13.8301C5.94833 14.3358 1.08004 27.3556 1.08004 27.3556C1.08004 27.3556 0.832126 27.8699 1.20893 27.8699H4.02478C4.02478 27.8699 4.33035 27.8538 4.50092 27.3256L5.39447 24.559H10.5768L11.4913 27.4249C11.4913 27.4249 11.6006 27.8699 12.0171 27.8699H14.9819C14.9819 27.8699 15.2993 27.851 15.101 27.4048C14.9026 26.9586 10.1031 13.7706 10.1031 13.7706C10.1031 13.7706 10.024 13.3741 9.48857 13.3741H6.67233C6.67233 13.3741 6.64922 13.3708 6.61202 13.3741ZM28.8929 13.3741C28.8929 13.3741 28.5429 13.3629 28.5429 13.7363V27.5113C28.5429 27.5113 28.5433 27.8699 28.8854 27.8699H34.6641C34.6641 27.8699 37.262 27.8767 38.6309 26.5077C39.9999 25.1388 39.6266 23.101 39.6266 23.101C39.6266 23.101 39.3 20.7675 36.7177 20.1764C36.7177 20.1764 39.0357 19.5232 38.8879 16.8009C38.6697 14.4176 36.5185 13.3741 34.2834 13.3741H28.8929ZM31.732 15.9065H33.8553C33.8553 15.9065 35.6443 15.9064 35.6676 17.5631C35.691 19.2199 33.793 19.1812 33.793 19.1812H31.732V15.9065ZM8.00103 16.4875L9.76054 22.001H6.22063L8.00103 16.4875ZM31.732 21.569H34.1356C34.1356 21.569 36.321 21.5842 36.3365 23.4743C36.3521 25.3644 34.2365 25.3647 34.2365 25.3647H31.732V21.569Z" fill="#1F419B"/>
            <path d="M25.0907 20.6298C25.0907 20.9718 25.0233 21.3104 24.8925 21.6264C24.7616 21.9424 24.5698 22.2294 24.3279 22.4713C24.0861 22.7131 23.799 22.9049 23.4831 23.0358C23.1671 23.1666 22.8285 23.234 22.4865 23.234C22.1445 23.234 21.8059 23.1666 21.4899 23.0358C21.174 22.9049 20.8869 22.7131 20.6451 22.4713C20.4033 22.2294 20.2114 21.9424 20.0806 21.6264C19.9497 21.3104 19.8823 20.9718 19.8823 20.6298C19.8823 20.2878 19.9497 19.9492 20.0806 19.6332C20.2114 19.3173 20.4033 19.0302 20.6451 18.7884C20.8869 18.5466 21.174 18.3547 21.4899 18.2239C21.8059 18.093 22.1445 18.0256 22.4865 18.0256C22.8285 18.0256 23.1671 18.093 23.4831 18.2239C23.799 18.3547 24.0861 18.5466 24.3279 18.7884C24.5698 19.0302 24.7616 19.3173 24.8925 19.6332C25.0233 19.9492 25.0907 20.2878 25.0907 20.6298Z" fill="#00AEEF"/>
          </svg>
        );
      case 'MB Bank':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M23.2333 0.0734574C23.9662 -0.110991 24.7856 0.05387 25.3651 0.546004C26.3404 1.31808 26.5085 2.88834 25.712 3.84649C24.1784 5.63221 22.64 7.41303 21.1048 9.19712C20.7041 9.66885 20.0488 9.90717 19.4391 9.79781C18.8254 9.70477 18.2834 9.26242 18.0623 8.68459C17.8468 8.15491 17.9121 7.52729 18.2206 7.0474C19.3934 5.11722 20.5662 3.18704 21.7357 1.25442C22.0491 0.679036 22.5959 0.23587 23.2333 0.0734574Z" fill="#EB2D4B"/>
            <path d="M24.6174 7.49467C25.2075 7.29226 25.9102 7.44325 26.337 7.90682C26.599 8.17451 26.7492 8.53933 26.7778 8.91149C27.0242 11.4995 27.2748 14.0867 27.5196 16.6746C27.6021 17.3994 27.3548 18.16 26.8202 18.6644C26.0636 19.4365 24.7578 19.554 23.8625 18.9574C23.1394 18.4922 22.7028 17.6173 22.7917 16.7587C23.0447 14.1152 23.2961 11.4709 23.5532 8.82743C23.6128 8.22593 24.0486 7.69054 24.6174 7.49467Z" fill="#EB2D4B"/>
            <path d="M2.7491 7.5869C3.71133 7.32246 4.82129 7.71503 5.35913 8.56545C6.57273 10.5609 7.78226 12.5597 8.99586 14.5559C9.23744 14.9412 9.33946 15.417 9.2456 15.865C9.14032 16.4861 8.6743 17.0256 8.07852 17.2272C7.39948 17.4745 6.58089 17.2647 6.11569 16.7097C4.59277 14.9395 3.06658 13.1726 1.54447 11.4024C0.839323 10.583 0.817287 9.27631 1.48897 8.43079C1.80237 8.0219 2.25125 7.71911 2.7491 7.5869Z" fill="#EB2D4B"/>
            <path d="M9.60323 9.13914C9.89541 9.04365 10.2121 9.04365 10.51 9.11057C13.0922 9.68759 15.677 10.2524 18.2576 10.8351C19.4133 11.1052 20.218 12.3417 20.0025 13.508C19.8556 14.6089 18.8403 15.4977 17.7328 15.5148C17.3639 15.5312 16.9975 15.4455 16.6621 15.2986C14.2577 14.2531 11.8525 13.2092 9.44816 12.1654C8.85238 11.9148 8.46144 11.2742 8.48756 10.6319C8.49572 9.96507 8.96827 9.33909 9.60323 9.13914Z" fill="#EB2D4B"/>
            <path d="M30.084 15.6561C30.7019 15.4275 31.3376 15.6854 31.9457 15.8136C33.9036 16.2755 35.8615 16.7358 37.8203 17.1961C38.3034 17.3079 38.7564 17.5618 39.0828 17.938C39.606 18.5118 39.8068 19.354 39.6101 20.1049C39.4534 20.7668 38.9849 21.3405 38.3793 21.6457C37.7648 21.9559 37.0172 21.9828 36.383 21.7143C34.2317 20.8084 32.0763 19.909 29.9249 19.0031C29.2793 18.7256 28.8394 18.0343 28.8696 17.3308C28.8647 16.5881 29.3789 15.8854 30.084 15.6561Z" fill="#EB2D4B"/>
            <path d="M11.1383 16.7783C12.2107 16.4984 13.4153 17.0844 13.861 18.0972C14.2421 18.915 14.1074 19.945 13.5149 20.6281C11.8435 22.5199 10.1712 24.4109 8.49972 26.3027C8.31037 26.5174 8.12919 26.75 7.87781 26.8961C7.26081 27.2805 6.38019 27.1842 5.87908 26.6504C5.37634 26.1624 5.26452 25.3356 5.61057 24.7276C6.95231 22.4497 8.29405 20.1719 9.63987 17.8956C9.95816 17.3374 10.5131 16.9236 11.1383 16.7783Z" fill="#EB2D4B"/>
            <path d="M30.974 21.2581C31.6 21.0933 32.3206 21.3308 32.6952 21.8662C33.1017 22.4056 33.1107 23.2006 32.7254 23.7539C32.5491 24.0175 32.2864 24.2126 31.9966 24.3358C29.6118 25.3691 27.2271 26.4047 24.8439 27.4421C24.1723 27.7481 23.3577 27.7302 22.7089 27.3768C21.9425 26.9703 21.439 26.1207 21.4643 25.2523C21.4545 24.1922 22.2511 23.1957 23.2851 22.968C25.8478 22.3958 28.4121 21.8327 30.974 21.2581Z" fill="#EB2D4B"/>
            <path d="M14.8273 24.321C15.8108 24.0133 16.9713 24.4173 17.5157 25.3004C18.8729 27.5888 20.2196 29.8847 21.5727 32.1764C21.8527 32.64 21.8812 33.2439 21.6429 33.7311C21.3948 34.2535 20.8447 34.6199 20.2645 34.6338C19.7887 34.6656 19.3079 34.4648 18.9864 34.1155C17.4063 32.3233 15.8214 30.5367 14.2413 28.7453C13.8235 28.276 13.3395 27.8092 13.2105 27.1677C12.889 25.9859 13.6447 24.645 14.8273 24.321Z" fill="#EB2D4B"/>
            <path d="M10.4321 27.7538C11.3291 27.5277 12.3264 28.1129 12.5598 29.0074C12.8177 29.8366 12.3737 30.8119 11.5715 31.1506C9.40297 32.0606 7.23447 32.9722 5.06353 33.8773C4.08008 34.2846 2.85015 33.9279 2.24947 33.0457C1.76305 32.3707 1.67654 31.4346 2.0234 30.6788C2.31395 30.021 2.92442 29.5224 3.62304 29.3559C5.89273 28.8229 8.16243 28.2867 10.4321 27.7538Z" fill="#EB2D4B"/>
            <path d="M24.7125 28.8981C25.2756 28.7479 25.9065 28.8989 26.3448 29.2825C26.7153 29.6 26.9365 30.0758 26.9602 30.5622C27.1299 32.6271 27.3013 34.6903 27.4735 36.7543C27.5062 37.1362 27.5502 37.5198 27.5192 37.9034C27.4515 38.5931 27.0467 39.2345 26.4688 39.6116C25.8012 40.058 24.9019 40.1225 24.173 39.7895C23.2989 39.4051 22.7187 38.4527 22.7872 37.4986C22.957 35.4003 23.1373 33.3028 23.3079 31.2053C23.3602 30.745 23.3283 30.2562 23.5479 29.8334C23.7748 29.3706 24.2114 29.0205 24.7125 28.8981Z" fill="#EB2D4B"/>
          </svg>
        );
      case 'BIDV':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M10.3137 27.1932C10.7499 25.3071 11.8007 23.4885 12.9867 21.9773C13.4152 21.4315 14.6484 20.5669 14.5795 19.8144C14.503 18.9613 13.2112 17.9449 12.7176 17.2702C11.64 15.8011 10.8468 14.0718 10.3941 12.3094C10.2512 11.7546 9.75896 10.4794 10.0752 9.94757C10.3775 9.43746 11.5992 9.61472 12.0953 9.64915C13.4203 9.7397 14.7619 9.94374 16.0385 10.311C16.6506 10.487 17.5586 10.9946 18.1962 10.8645C19.08 10.6847 19.9102 9.00258 20.5032 8.36622C21.9545 6.80782 23.7756 5.4522 25.7077 4.54929C25.26 3.49081 24.3074 2.61597 23.4173 1.91456C18.4245 -2.02606 10.5484 0.402074 8.77572 6.58465C7.8741 9.73205 8.65712 13.2531 10.0931 16.1263C10.5101 16.9616 11.0138 17.7944 11.5724 18.543C11.8313 18.8899 12.3631 19.349 12.3631 19.8157C12.3631 20.3475 11.677 20.9431 11.3786 21.3422C10.4782 22.5435 9.75131 23.8813 9.22207 25.2854C9.08179 25.6552 8.6482 26.4689 8.92238 26.8451C9.16213 27.1703 9.94771 27.146 10.3137 27.1932ZM10.6963 10.4003C10.7422 12.5951 13.3106 11.9434 15.0221 12.3693C16.1061 12.6397 18.1478 14.0285 19.1935 13.79C19.9549 13.6166 20.8807 11.4052 21.3934 10.7829C23.087 8.72967 25.1083 7.51943 27.363 6.20334C27.7966 7.78979 28.4342 9.24999 28.614 10.9104C28.7237 11.9064 28.4419 13.549 28.8398 14.4442C29.0349 14.8816 29.6317 14.9518 30.036 15.0908C31.0511 15.444 32.0292 15.8662 32.9615 16.3992C34.0442 17.0177 35.0848 17.7293 36.0145 18.5647C36.318 18.8376 36.7975 19.5198 37.2757 19.3898C37.8305 19.2393 38.1812 18.2484 38.3929 17.7804C39.1963 15.9962 39.6133 13.9991 39.3392 12.0556C38.6301 7.01314 34.0786 3.83386 29.1458 4.17946C25.9142 4.40646 23.0525 6.67392 20.8769 8.87506C20.2367 9.52417 19.3389 11.4499 18.5087 11.7304C17.9425 11.9217 16.7475 11.1757 16.1711 11.0226C14.3321 10.5367 12.5863 10.4003 10.6963 10.4003ZM25.5801 7.72858C25.8964 9.87743 26.5226 11.7355 26.469 13.9622C26.4537 14.5564 25.9398 15.9401 26.4193 16.398C26.9702 16.9221 28.5324 16.9616 29.2695 17.209C30.9669 17.7804 32.5802 18.6718 33.9766 19.7902C34.4421 20.1639 35.7505 21.0553 35.7505 21.7121C35.7505 22.2426 34.6168 22.8203 34.2316 23.0779C33.1247 23.8163 31.9183 24.4386 30.6698 24.8977C30.115 25.1005 29.1305 25.2051 28.711 25.6336C28.1983 26.1564 28.5515 27.6523 28.4699 28.3397C28.1753 30.8342 26.8962 32.9549 26.4715 35.3372C28.3909 35.9506 30.4683 36.2095 32.4514 35.7312C39.2805 34.0861 40.909 26.0098 37.2413 20.7071C35.9329 18.8146 33.6476 17.2868 31.5612 16.3648C30.7552 16.0077 28.5821 15.6965 28.1307 14.9543C27.669 14.1955 28.0185 12.5453 27.9981 11.6756C27.9598 10.1376 27.5313 8.52308 26.9817 7.09604L25.5801 7.72858ZM24.5625 32.408C23.0398 31.4566 21.6778 30.0666 20.6627 28.5911C20.261 28.007 19.6845 26.404 19.0418 26.1259C18.2103 25.7663 16.1482 27.062 15.2746 27.3005C12.7483 27.9917 10.4438 27.7711 7.89581 27.4471C8.27712 25.6005 9.0831 23.8343 10.0587 22.2312C10.4591 21.5732 11.524 20.604 11.5265 19.8146C11.5304 18.8377 10.0816 17.3737 9.60596 16.5065C8.63037 14.7287 8.15214 12.7559 7.76956 10.7817C6.43816 10.8991 5.10549 11.7816 4.08016 12.5901C-0.814374 16.4427 -0.693223 23.8738 4.46147 27.4828C7.26582 29.4455 10.8277 29.7031 14.1294 29.1726C15.17 29.0055 17.2271 27.9024 18.1873 28.1638C18.7115 28.3067 19.0609 29.1943 19.3491 29.61C20.2074 30.8547 21.2263 31.9323 22.3983 32.8849C22.7223 33.1489 23.3076 33.7713 23.7705 33.6935C24.2462 33.6131 24.4515 32.7918 24.5625 32.408ZM24.0538 34.8257L19.7842 31.1363L17.9363 28.9645L14.3859 29.8101L8.15234 29.8636C8.15234 32.6399 8.87798 35.3052 10.861 37.3482C14.933 41.5414 21.6091 40.4905 25.018 36.0972C26.6312 34.0185 27.3989 31.4258 27.7075 28.8459C27.8108 27.9851 27.4078 25.8439 27.9486 25.2114C28.474 24.5967 30.0451 24.4526 30.7988 24.1771C32.3649 23.6058 33.7779 22.685 35.1246 21.7209C34.9065 21.2593 34.4525 20.6153 33.8518 20.7186C33.1747 20.8346 32.4133 21.5615 31.8165 21.902C30.7478 22.5091 29.5682 22.949 28.3822 23.2627C27.8567 23.4018 26.57 23.4171 26.2231 23.8507C25.9566 24.1822 26.1389 24.7803 26.1823 25.1553C26.2945 26.1015 26.2563 27.1294 26.2142 28.0808C26.1019 30.5803 24.9899 32.5889 24.0538 34.8257Z" fill="#FFC72F"/>
          </svg>
        );
      case 'VietinBank':
      case 'ViettinBank':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g clipPath="url(#clip0_9622_56860)">
              <path fillRule="evenodd" clipRule="evenodd" d="M14.136 14.1551L25.8579 14.1551V24.4832C30.2145 25.1517 34.3383 26.55 38.0944 28.5433C39.3138 25.9613 40 23.0726 40 20.0183C40 8.96044 31.0355 0 19.9939 0C8.94608 0 0 8.96044 0 20.0183C0 23.0603 0.68021 25.949 1.89344 28.531C5.65567 26.5377 9.76718 25.1455 14.136 24.4832V14.1551Z" fill="#005791"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M19.9939 40C26.9854 40 33.1373 36.4061 36.7219 30.9599C31.7281 28.3165 26.0234 26.814 19.9756 26.814C13.9401 26.814 8.25376 28.3105 3.26603 30.9538C6.84444 36.3999 12.9903 40 19.9939 40Z" fill="#D71147"/>
            </g>
            <defs>
              <clipPath id="clip0_9622_56860">
                <rect width="40" height="40" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] uppercase border border-indigo-100">
            {bankName.substring(0, 3)}
          </div>
        );
    }
  };

  const getWalletLogo = (walletName: string) => {
    switch (walletName) {
      case 'Momo':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g clipPath="url(#clip0_2_6798)">
              <path fillRule="evenodd" clipRule="evenodd" d="M37.2973 0H2.7027C1.21622 0 0 1.21622 0 2.7027V37.2973C0 38.7838 1.21622 40 2.7027 40H37.2973C38.7838 40 40 38.7838 40 37.2973V2.7027C40 1.21622 38.7838 0 37.2973 0Z" fill="#A50064"/>
              <path d="M27.6757 18.7838C30.8514 18.7838 33.4189 16.2162 33.4189 13.0405C33.4189 9.86487 30.8514 7.2973 27.6757 7.2973C24.5 7.2973 21.9324 9.86487 21.9324 13.0405C21.9324 16.2162 24.5 18.7838 27.6757 18.7838ZM27.6757 10.5946C29.027 10.5946 30.1216 11.6892 30.1216 13.0405C30.1216 14.3919 29.027 15.4865 27.6757 15.4865C26.3243 15.4865 25.2297 14.3919 25.2297 13.0405C25.2297 11.6892 26.3243 10.5946 27.6757 10.5946Z" fill="white"/>
              <path d="M27.6757 21.2703C24.5 21.2703 21.9324 23.8378 21.9324 27.0135C21.9324 30.1892 24.5 32.7568 27.6757 32.7568C30.8514 32.7568 33.4189 30.1892 33.4189 27.0135C33.4189 23.8378 30.8514 21.2703 27.6757 21.2703ZM27.6757 29.4595C26.3243 29.4595 25.2297 28.3649 25.2297 27.0135C25.2297 25.6622 26.3243 24.5676 27.6757 24.5676C29.027 24.5676 30.1216 25.6622 30.1216 27.0135C30.1216 28.3649 29.027 29.4595 27.6757 29.4595Z" fill="white"/>
              <path d="M15.973 21.2703C15 21.2703 14.1081 21.5946 13.3919 22.1351C12.6757 21.5946 11.7703 21.2703 10.8108 21.2703C8.43243 21.2703 6.5 23.2027 6.5 25.5811V32.7703H9.7973V25.5405C9.7973 25 10.2297 24.5676 10.7703 24.5676C11.3108 24.5676 11.7432 25 11.7432 25.5405V32.7568H15.0405V25.5405C15.0405 25 15.473 24.5676 16.0135 24.5676C16.5541 24.5676 16.9865 25 16.9865 25.5405V32.7568H20.2703V25.5676C20.2703 23.2027 18.3514 21.2703 15.973 21.2703Z" fill="white"/>
              <path d="M15.973 7.2973C15 7.2973 14.1081 7.62163 13.3919 8.16217C12.6757 7.62163 11.7703 7.2973 10.8108 7.2973C8.41891 7.2973 6.48648 9.22973 6.48648 11.6081V18.7838H9.78378V11.5676C9.78378 11.027 10.2162 10.5946 10.7568 10.5946C11.2973 10.5946 11.7297 11.027 11.7297 11.5676V18.7838H15.027V11.5676C15.027 11.027 15.4595 10.5946 16 10.5946C16.5405 10.5946 16.973 11.027 16.973 11.5676V18.7838H20.2703V11.6081C20.2703 9.22973 18.3513 7.2973 15.973 7.2973Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_2_6798">
                <rect width="40" height="40" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      case 'ShopeePay':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M36.1919 9.62267H5.81963C5.3755 9.62267 4.94955 9.44623 4.63551 9.13218C4.32146 8.81813 4.14502 8.3922 4.14502 7.94807C4.14365 7.74939 4.21997 7.55804 4.35769 7.41484C4.49542 7.27164 4.68366 7.18792 4.88224 7.18156H32.125C32.327 7.18156 32.5207 7.10132 32.6635 6.95849C32.8064 6.81565 32.8866 6.62193 32.8866 6.41994V3.67613C32.8868 3.44375 32.8387 3.21385 32.7452 3.00109C32.6518 2.78833 32.515 2.59734 32.3437 2.44029C32.1725 2.28324 31.9704 2.16356 31.7503 2.08886C31.5302 2.01417 31.2971 1.98608 31.0656 2.00641L3.48105 4.44752C2.52879 4.52961 1.64222 4.96678 0.997358 5.67224C0.352494 6.3777 -0.003506 7.29987 2.60323e-05 8.25565V34.7661C2.60323e-05 35.776 0.401243 36.7447 1.11541 37.4588C1.82957 38.173 2.79817 38.5742 3.80815 38.5742H36.1919C37.2019 38.5742 38.1705 38.173 38.8846 37.4588C39.5988 36.7447 40 35.776 40 34.7661V13.4454C40 12.4355 39.5988 11.4669 38.8846 10.7527C38.1705 10.0385 37.2019 9.63731 36.1919 9.63731" fill="#EE4D2D"/>
            <path d="M26.8083 29.5568C26.6999 30.5073 26.3363 31.4108 25.7561 32.1714C25.176 32.9321 24.4008 33.5216 23.5128 33.8775C22.3984 34.33 21.199 34.5349 19.9976 34.478C18.3302 34.4239 16.6951 34.0039 15.2081 33.2477C14.5272 32.8736 13.8846 32.4337 13.2894 31.9344C13.1527 31.8221 13.0844 31.7196 13.2162 31.539L13.9925 30.4063C14.0172 30.3657 14.0511 30.3314 14.0913 30.3061C14.1315 30.2808 14.1771 30.2651 14.2244 30.2604C14.2717 30.2557 14.3195 30.262 14.364 30.2788C14.4084 30.2957 14.4484 30.3226 14.4807 30.3575L14.7199 30.543C16.2308 31.7548 18.0832 32.4633 20.0171 32.5691C22.59 32.5349 24.455 31.3876 24.787 29.6398C25.1532 27.6869 23.5958 26.0074 20.5932 25.0749C19.2999 24.6433 18.0318 24.1397 16.7948 23.5663C14.702 22.3457 13.7256 20.7493 13.8655 18.7768C14.0755 16.0477 16.624 14.002 19.856 13.9923C21.3172 13.9955 22.7631 14.2909 24.1084 14.8613C24.6876 15.1134 25.2446 15.4139 25.7732 15.7596C25.8161 15.7809 25.8538 15.8113 25.8837 15.8488C25.9135 15.8862 25.9348 15.9298 25.946 15.9763C25.9572 16.0229 25.958 16.0714 25.9484 16.1183C25.9388 16.1652 25.919 16.2094 25.8904 16.2479C25.7635 16.4578 25.4022 17.0534 25.2313 17.2975C25.119 17.4635 24.9823 17.4879 24.7822 17.361C23.3358 16.3946 21.6393 15.8704 19.8999 15.8524C17.6932 15.8963 16.0283 17.1999 15.9209 18.9868C15.8916 20.5979 17.1268 21.7696 19.7486 22.668C25.1581 24.3963 27.2086 26.4224 26.818 29.6056" fill="white"/>
          </svg>
        );
      case 'ZaloPay':
        return (
          <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M31.014 0.5H9.98598C4.74701 0.5 0.5 4.72814 0.5 9.94382V31.0562C0.5 36.2719 4.74701 40.5 9.98598 40.5H31.014C36.253 40.5 40.5 36.2719 40.5 31.0562V9.94382C40.5 4.72814 36.253 0.5 31.014 0.5Z" fill="white" stroke="#EAEAEA" strokeMiterlimit="10"/>
            <path d="M4.43524 11.2564C4.06976 9.0001 5.61014 6.87508 7.8765 6.51122L36.2293 1.95545C34.7657 1.03499 33.0317 0.5 31.1726 0.5H10.1445C4.90586 0.5 0.658539 4.72845 0.658539 9.94382V31.0562C0.658539 35.9442 4.38851 39.9633 9.16989 40.4502L4.43691 11.2564H4.43524Z" fill="#0068FF"/>
            <path d="M25.268 13.0923C25.0878 12.9078 24.8575 12.8165 24.5788 12.8165C24.1682 12.8165 23.8678 13.0125 23.6792 13.4046C23.277 12.9344 22.7263 12.6985 22.0287 12.6985C21.1909 12.6985 20.4867 13.0208 19.9159 13.6638C19.3451 14.3068 19.0598 15.091 19.0598 16.0165C19.0598 16.9419 19.3451 17.7261 19.9159 18.3691C20.4867 19.0121 21.1909 19.3344 22.0287 19.3344C22.7263 19.3344 23.277 19.0985 23.6792 18.6283C23.8678 19.0204 24.1682 19.2165 24.5788 19.2165C24.8575 19.2165 25.0878 19.1251 25.268 18.9406C25.4483 18.7562 25.5384 18.5303 25.5384 18.2644V13.7701C25.5384 13.5043 25.4483 13.2783 25.268 13.0939V13.0923ZM23.267 17.1313C23.0334 17.432 22.7096 17.5816 22.3007 17.5816C21.8919 17.5816 21.5681 17.432 21.3345 17.1313C21.1008 16.8306 20.984 16.4601 20.984 16.0165C20.984 15.5728 21.1008 15.2023 21.3345 14.9016C21.5681 14.6009 21.8902 14.4513 22.3007 14.4513C22.7113 14.4513 23.0334 14.6009 23.267 14.9016C23.5007 15.2023 23.6175 15.5728 23.6175 16.0165C23.6175 16.4601 23.5007 16.8306 23.267 17.1313Z" fill="#0068FF"/>
            <path d="M27.7146 18.9407C27.5344 19.1251 27.3041 19.2165 27.0253 19.2165C26.7466 19.2165 26.5163 19.1251 26.3361 18.9407C26.1559 18.7563 26.0657 18.2645 26.0657 18.2645V10.2196C26.0657 9.95377 26.1559 9.72781 26.3361 9.54338C26.5163 9.35896 26.7466 9.26758 27.0253 9.26758C27.3041 9.26758 27.5344 9.35896 27.7146 9.54338C27.8948 9.72781 27.985 9.95377 27.985 10.2196V18.2645C27.985 18.532 27.8948 18.7563 27.7146 18.9407Z" fill="#0068FF"/>
            <path d="M34.0781 13.6622C33.4623 13.0192 32.6779 12.6969 31.725 12.6969C30.772 12.6969 29.9943 13.0142 29.3918 13.6506C28.7877 14.2853 28.4856 15.0745 28.4856 16.0149C28.4856 16.9553 28.7877 17.7445 29.3918 18.3791C29.996 19.0138 30.7737 19.3328 31.725 19.3328C32.6762 19.3328 33.4623 19.0122 34.0781 18.3675C34.6689 17.7395 34.9643 16.9553 34.9643 16.0149C34.9643 15.0745 34.6689 14.2903 34.0781 13.6622ZM32.6929 17.1297C32.4593 17.4304 32.1372 17.58 31.7266 17.58C31.3161 17.58 30.994 17.4304 30.7603 17.1297C30.5267 16.829 30.4099 16.4585 30.4099 16.0149C30.4099 15.5713 30.5267 15.2007 30.7603 14.9C30.994 14.5993 31.3161 14.4498 31.7266 14.4498C32.1372 14.4498 32.4593 14.5993 32.6929 14.9C32.9265 15.2007 33.0434 15.5713 33.0434 16.0149C33.0434 16.4585 32.9265 16.829 32.6929 17.1297Z" fill="#0068FF"/>
            <path d="M17.9967 12.9195C18.6759 12.0473 19.0147 11.4608 19.0147 11.1584C19.0147 10.4589 18.5724 10.11 17.6879 10.11H13.025C12.6579 10.11 12.3758 10.1964 12.1739 10.3692C11.9736 10.542 11.8718 10.7663 11.8718 11.0421C11.8718 11.3179 11.972 11.5422 12.1739 11.715C12.3758 11.8878 12.6579 11.9742 13.025 11.9742H16.2276L12.1272 17.2477C11.8585 17.5933 11.7249 17.899 11.7249 18.1665C11.7249 18.9341 12.234 19.3162 13.252 19.3162H18.0634C18.8328 19.3162 19.2166 18.9956 19.2166 18.3526C19.2166 17.7096 18.8328 17.3889 18.0634 17.3889H14.5254L17.9967 12.9212V12.9195Z" fill="#0068FF"/>
            <path d="M15.5451 24.2824H14.3468V26.7597H15.5451C15.9055 26.7597 16.1959 26.6434 16.4196 26.4091C16.6432 26.1748 16.7533 25.8791 16.7533 25.5202C16.7533 25.1613 16.6415 24.8656 16.4196 24.6313C16.1959 24.3971 15.9055 24.2808 15.5451 24.2808V24.2824Z" fill="#03CA77"/>
            <path d="M21.5197 26.6118C21.1392 26.6118 20.8421 26.7514 20.6252 27.0288C20.4082 27.3063 20.2997 27.6502 20.2997 28.0606C20.2997 28.471 20.4082 28.8133 20.6252 29.0924C20.8421 29.3699 21.1392 29.5094 21.5197 29.5094C21.9002 29.5094 22.1973 29.3699 22.4142 29.0924C22.6312 28.8149 22.7396 28.0606 22.7396 28.0606C22.7396 27.6502 22.6312 27.308 22.4142 27.0288C22.1973 26.7514 21.8985 26.6118 21.5197 26.6118Z" fill="#03CA77"/>
            <path d="M29.9793 20.7401H12.6161C12.037 20.7401 11.5664 21.207 11.5664 21.7835V31.9119C11.5664 32.4884 12.0354 32.9553 12.6161 32.9553H26.3228C26.1776 32.819 26.1058 32.6595 26.1058 32.4768C26.1058 32.3272 26.1392 32.1711 26.2076 32.0066L26.8535 30.576L25.0661 26.1333C25.0143 26.007 24.9876 25.8691 24.9876 25.7196C24.9876 25.5252 25.0694 25.3607 25.2346 25.2278C25.3999 25.0932 25.5718 25.0267 25.752 25.0267C26.1492 25.0267 26.4195 25.2161 26.5614 25.5983L27.6746 28.6305L28.8661 25.5983C29.0163 25.2178 29.285 25.0267 29.6756 25.0267C29.8558 25.0267 30.0277 25.0932 30.1929 25.2278C30.3581 25.3623 30.4399 25.5268 30.4399 25.7196C30.4399 25.8691 30.4132 26.007 30.3615 26.1333L27.7129 32.5333C27.6412 32.7127 27.5527 32.8523 27.4509 32.9569H29.9776C30.5567 32.9569 31.0274 32.4901 31.0274 31.9135V21.7852C31.0274 21.2086 30.5584 20.7418 29.9776 20.7418L29.9793 20.7401ZM17.7163 27.5538C17.1689 28.0523 16.4796 28.3015 15.6502 28.3015H14.3468V30.2188C14.3468 30.5079 14.265 30.7306 14.0998 30.8901C13.9346 31.0496 13.7243 31.1293 13.4656 31.1293C13.2069 31.1293 12.9966 31.0496 12.8314 30.8901C12.6662 30.7306 12.5844 30.5063 12.5844 30.2188V23.651C12.5844 23.0429 12.8898 22.7389 13.5006 22.7389H15.5784C16.4479 22.7389 17.1655 22.9981 17.733 23.5164C18.3004 24.0348 18.5841 24.7061 18.5841 25.5335C18.5841 26.3609 18.2937 27.0404 17.7146 27.5555L17.7163 27.5538ZM24.517 30.1391C24.517 30.3866 24.4336 30.5943 24.2667 30.7654C24.0998 30.9366 23.8862 31.0213 23.6275 31.0213C23.247 31.0213 22.97 30.8402 22.7964 30.4764C22.4242 30.9117 21.9152 31.1293 21.2693 31.1293C20.495 31.1293 19.8425 30.8319 19.3151 30.2371C18.7877 29.6423 18.524 28.9162 18.524 28.0589C18.524 27.2016 18.7877 26.4755 19.3151 25.8807C19.8425 25.2859 20.495 24.9885 21.2693 24.9885C21.9152 24.9885 22.4242 25.2062 22.7964 25.6415C22.97 25.2793 23.2487 25.0965 23.6275 25.0965C23.8862 25.0965 24.0981 25.1812 24.2667 25.3524C24.4336 25.5235 24.517 25.7312 24.517 25.9787V30.1391Z" fill="#03CA77"/>
          </svg>
        );
      case 'VNPAY':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g clipPath="url(#clip0_2_7378)">
              <path fillRule="evenodd" clipRule="evenodd" d="M22.4268 14.1652L19.4597 17.1323L19.3124 17.2776L17.6669 18.9251L16.1667 20.4253L16.0214 20.5726L14.6311 21.9608L14.4858 22.1081C14.0695 22.5244 13.6081 22.8661 13.1191 23.1371C12.8717 23.2726 12.6184 23.3904 12.3592 23.4905C11.7819 23.7144 11.1751 23.844 10.5644 23.8833C10.1894 23.9088 9.81038 23.899 9.43728 23.8518C8.63023 23.7556 7.84084 23.4984 7.11822 23.0801C6.80993 22.9014 6.49182 22.7149 6.2287 22.4537C6.2287 22.4537 6.22739 22.4537 6.22477 22.4537L0.534141 16.7631C0.439886 16.659 0.355449 16.5471 0.284758 16.4253C0.104103 16.119 3.05176e-05 15.7656 3.05176e-05 15.3866C3.05176e-05 15.3277 0.00199416 15.2668 0.00788508 15.2099C0.0157396 15.1215 0.0294851 15.0371 0.0471579 14.9546L0.0825034 14.8191C0.159085 14.5658 0.284758 14.3262 0.457559 14.1102C0.502722 14.0552 0.551813 14.0022 0.602868 13.9472L0.699086 13.853L6.45255 8.09755H6.45451L9.93997 4.61013C10.7176 3.83253 11.9566 3.79718 12.7715 4.50998L22.4268 14.1652Z" fill="#005AAA"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M6.16784 22.3987C6.18551 22.4164 6.20318 22.4341 6.22282 22.4517C6.48595 22.7129 6.80406 22.9014 7.11628 23.0801C7.8389 23.4984 8.62828 23.7556 9.43534 23.8518C9.80843 23.897 10.1874 23.9068 10.5625 23.8832C11.1732 23.8459 11.7799 23.7144 12.3572 23.4925C12.6164 23.3923 12.8697 23.2745 13.1172 23.139C13.6061 22.868 14.0676 22.5264 14.4839 22.1101L14.6292 21.9648L16.0194 20.5745L16.7224 19.8696L18.3679 18.224L19.3105 17.2795L19.4578 17.1342L25.4351 11.1588L27.8994 8.4883L28.0467 8.34299C28.7988 7.59091 30.0202 7.59091 30.7722 8.34299L32.1213 9.69201L32.1645 9.73717C31.5675 9.70968 30.9647 9.92372 30.513 10.3655L25.9456 14.8583L25.8985 14.9133L17.9497 22.7345L17.9379 22.7247L15.0101 25.6014L14.8137 25.8076C14.584 26.0315 14.1009 26.4576 13.4569 26.7619C13.1643 26.8994 12.8678 26.9995 12.5732 27.0624C12.3985 27.0977 12.2198 27.1193 12.045 27.1272H11.9115C11.4461 27.1272 10.9905 27.0231 10.5526 26.8228L9.17614 25.4502L8.61453 24.8867L6.03824 22.2809L6.15606 22.4007L6.16784 22.3987ZM39.4358 19.7262L32.8164 26.4458L26.0183 33.348C25.8023 33.5659 25.5745 33.7603 25.3349 33.9371C25.3271 33.9449 25.3173 33.9528 25.3074 33.9606C25.2741 33.9842 25.2426 34.0078 25.2073 34.0313C25.2034 34.0352 25.1994 34.0372 25.1955 34.0411C24.1705 34.7755 22.9118 35.2056 21.5569 35.2056C19.8819 35.2056 18.362 34.5497 17.2369 33.4795L17.0817 33.3421L15.9114 32.1737L12.6263 28.8866L11.3774 27.6377C11.5561 27.6672 11.7367 27.6789 11.9174 27.6789H12.0686C12.2787 27.6691 12.4868 27.6436 12.693 27.6024C13.0288 27.5336 13.3685 27.4178 13.7023 27.2607C14.421 26.921 14.9571 26.4497 15.2104 26.2003C15.3105 26.1021 15.3852 26.0197 15.4166 25.9843L17.9438 23.5023L17.9536 23.5141L26.6407 14.9663L26.6879 14.9114L30.9077 10.7583C31.4752 10.2026 32.3628 10.1299 33.0088 10.5737L34.0083 11.5732H34.0103L39.4358 16.9987C39.483 17.0478 39.5301 17.0969 39.5713 17.1479C40.1859 17.9059 40.1388 19.0252 39.4358 19.7262Z" fill="#ED1C24"/>
              <path d="M21.5313 15.0587L20.9737 15.6144L19.9958 14.6306C19.8426 14.4755 19.8446 14.2261 19.9958 14.0749C20.1509 13.9217 20.3983 13.9217 20.5534 14.0749L21.5294 15.0567L21.5313 15.0587ZM19.8838 16.7062L19.3262 17.2599L16.255 14.1652C15.1142 13.0184 13.449 12.6139 11.9075 13.1127C11.7014 13.1795 11.4795 13.0675 11.4127 12.8614C11.3459 12.6532 11.4598 12.4313 11.666 12.3645C13.4902 11.7735 15.4637 12.2507 16.8127 13.6115L19.8819 16.7062H19.8838ZM16.5908 19.9992L16.0332 20.5569L12.9483 17.4484C12.7951 17.2952 12.7971 17.0459 12.9483 16.8907C13.1034 16.7376 13.3528 16.7395 13.5059 16.8927L16.5889 19.9992H16.5908ZM18.2364 18.3537L17.6787 18.9094L14.6017 15.8068C13.8515 15.0488 12.6223 15.0449 11.8663 15.795C11.1103 16.5471 11.1044 17.7744 11.8565 18.5304L13.8398 20.5313C13.9929 20.6845 13.9929 20.9339 13.8398 21.089C13.6866 21.2422 13.4372 21.2402 13.2821 21.087L11.2969 19.0861C10.2404 18.0198 10.2463 16.2938 11.3126 15.2354C12.3788 14.179 14.1068 14.1868 15.1613 15.2511L18.2364 18.3517V18.3537ZM13.1329 23.1253C13.1329 23.1253 13.1211 23.1312 13.1152 23.1351C12.8737 23.2667 12.6282 23.3825 12.3749 23.4807L9.64543 20.7277C7.93706 19.0056 7.69357 16.3075 9.06419 14.3105C9.1879 14.1318 9.43336 14.0867 9.61205 14.2084C9.7927 14.3321 9.8359 14.5776 9.71416 14.7563C8.55757 16.4411 8.76376 18.7169 10.2051 20.17L13.1348 23.1233L13.1329 23.1253ZM18.4661 12.5315C18.3129 12.6827 18.0616 12.6787 17.9065 12.5256C15.3459 9.94534 11.1633 9.92964 8.5831 12.4883C6.00484 15.0488 5.98717 19.2314 8.54776 21.8116L10.5526 23.8342C10.5664 23.8479 10.5801 23.8636 10.588 23.8793C10.5782 23.8793 10.5683 23.8793 10.5585 23.8793C10.1933 23.9049 9.82412 23.895 9.46281 23.8518L7.99008 22.3654C5.12317 19.4788 5.14084 14.7955 8.02935 11.9286C10.9179 9.06171 15.5992 9.08134 18.4661 11.9699L18.472 11.9757C18.6252 12.1289 18.6212 12.3763 18.4661 12.5315Z" fill="#009EDB"/>
            </g>
            <defs>
              <clipPath id="clip0_2_7378">
                <rect width="40" height="40" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] uppercase border border-indigo-100">
            {walletName.substring(0, 3)}
          </div>
        );
    }
  };

  const handleConnectBank = (bank: string) => {
    setConnectedPayments((prev: any) => {
      let currentBanks = [...prev.banks];
      if (currentBanks.includes(bank)) {
        currentBanks = currentBanks.filter(b => b !== bank);
      } else {
        currentBanks.push(bank);
      }
      const updated = {
        ...prev,
        transfer: currentBanks.length > 0,
        banks: currentBanks
      };
      localStorage.setItem('cukcuk_connected_payments', JSON.stringify(updated));
      return updated;
    });
    onNotification(`Đã cập nhật trạng thái kết nối ngân hàng ${bank}!`, 'success');
  };

  const handleConnectWallet = (wallet: string) => {
    setConnectedPayments((prev: any) => {
      let currentWallets = [...prev.wallets];
      if (currentWallets.includes(wallet)) {
        currentWallets = currentWallets.filter(w => w !== wallet);
      } else {
        currentWallets.push(wallet);
      }
      const updated = {
        ...prev,
        wallet: currentWallets.length > 0,
        wallets: currentWallets
      };
      localStorage.setItem('cukcuk_connected_payments', JSON.stringify(updated));
      return updated;
    });
    onNotification(`Đã cập nhật trạng thái kết nối ví ${wallet}!`, 'success');
  };

  const handleToggleTransfer = () => {
    setConnectedPayments((prev: any) => {
      const nextConnected = !prev.transfer;
      const updated = {
        ...prev,
        transfer: nextConnected
      };
      localStorage.setItem('cukcuk_connected_payments', JSON.stringify(updated));
      return updated;
    });
    onNotification(`Đã ${!connectedPayments.transfer ? 'kích hoạt' : 'ngừng'} phương thức Chuyển khoản!`, 'info');
  };

  const handleToggleWallet = () => {
    setConnectedPayments((prev: any) => {
      const nextConnected = !prev.wallet;
      const updated = {
        ...prev,
        wallet: nextConnected
      };
      localStorage.setItem('cukcuk_connected_payments', JSON.stringify(updated));
      return updated;
    });
    onNotification(`Đã ${!connectedPayments.wallet ? 'kích hoạt' : 'ngừng'} phương thức Ví điện tử!`, 'info');
  };

  // State and Helpers for Connect detail popup (ngân hàng / ví)
  const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false);
  const [paymentDetailsTarget, setPaymentDetailsTarget] = useState<{ type: 'bank' | 'wallet'; name: string } | null>(null);
  const [formAccountNumber, setFormAccountNumber] = useState('');
  const [formAccountName, setFormAccountName] = useState('');
  const [formBranch, setFormBranch] = useState('');
  const [formPhoneNumber, setFormPhoneNumber] = useState('');

  // State for Custom Bank Connection (For banks not in standard list)
  const [isCustomBankModalOpen, setIsCustomBankModalOpen] = useState(false);
  const [customBankSelectedBank, setCustomBankSelectedBank] = useState('');
  const [customBankOtherName, setCustomBankOtherName] = useState('');
  const [customBankAccountNumber, setCustomBankAccountNumber] = useState('');
  const [customBankAccountName, setCustomBankAccountName] = useState('');
  const [customBankBranch, setCustomBankBranch] = useState('');
  const [editingCustomBankName, setEditingCustomBankName] = useState<string | null>(null);

  const OTHER_POPULAR_BANKS = [
    'Agribank',
    'VPBank',
    'Sacombank',
    'HDBank',
    'VIB',
    'TPBank',
    'SHB',
    'MSB',
    'OCB',
    'SeABank',
    'LPBank',
    'Eximbank',
    'PVcomBank',
    'Bac A Bank',
    'Nam A Bank',
    'NCB',
    'BVBank',
    'VietABank',
    'OceanBank',
    'Shinhan Bank',
    'HSBC',
    'Woori Bank'
  ];

  const handleSaveCustomBank = () => {
    let finalBankName = customBankSelectedBank === 'Other' ? customBankOtherName.trim() : customBankSelectedBank;
    
    if (!finalBankName) {
      onNotification('Vui lòng chọn hoặc nhập tên ngân hàng!', 'warning');
      return;
    }
    if (!customBankAccountNumber.trim()) {
      onNotification('Vui lòng nhập số tài khoản!', 'warning');
      return;
    }
    if (!customBankAccountName.trim()) {
      onNotification('Vui lòng nhập tên chủ tài khoản!', 'warning');
      return;
    }

    const uppercaseAccountName = customBankAccountName.toUpperCase().trim();

    setConnectedPayments((prev: any) => {
      const nextDetails = { ...(prev.details || {}) };
      
      // If we are editing, and changed the bank name, remove old entry
      if (editingCustomBankName && editingCustomBankName !== finalBankName) {
        delete nextDetails[editingCustomBankName];
      }

      nextDetails[finalBankName] = {
        accountNumber: customBankAccountNumber.trim(),
        accountName: uppercaseAccountName,
        branch: customBankBranch.trim()
      };

      let nextBanks = [...(prev.banks || [])];
      if (editingCustomBankName) {
        nextBanks = nextBanks.filter(b => b !== editingCustomBankName);
      }
      if (!nextBanks.includes(finalBankName)) {
        nextBanks.push(finalBankName);
      }

      const updated = {
        ...prev,
        banks: nextBanks,
        transfer: true,
        details: nextDetails
      };

      localStorage.setItem('cukcuk_connected_payments', JSON.stringify(updated));
      return updated;
    });

    onNotification(editingCustomBankName 
      ? `Đã cập nhật thông tin ngân hàng ${finalBankName}!` 
      : `Đã kết nối thành công ngân hàng ${finalBankName}!`, 'success');
      
    handleCloseCustomBankModal();
  };

  const handleCloseCustomBankModal = () => {
    setIsCustomBankModalOpen(false);
    setCustomBankSelectedBank('');
    setCustomBankOtherName('');
    setCustomBankAccountNumber('');
    setCustomBankAccountName('');
    setCustomBankBranch('');
    setEditingCustomBankName(null);
  };

  // JetPay BankHub States
  const [isJetPayModalOpen, setIsJetPayModalOpen] = useState(false);
  const [jetPayStep, setJetPayStep] = useState(1);
  const [jetPayBankName, setJetPayBankName] = useState('Techcombank');
  const [jetPayCccd, setJetPayCccd] = useState('');
  const [jetPayOwnerName, setJetPayOwnerName] = useState('');
  const [jetPayStoreName, setJetPayStoreName] = useState('Quán phở Anh Hai');
  const [jetPayBranchName, setJetPayBranchName] = useState('Chi nhánh Hồ Chí Minh');

  // Trigger 3-second automatic QR verification scanning transitions
  useEffect(() => {
    let timer: any;
    if (isJetPayModalOpen && jetPayStep === 3) {
      timer = setTimeout(() => {
        setJetPayStep(4);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isJetPayModalOpen, jetPayStep]);

  const openPaymentDetailsModal = (type: 'bank' | 'wallet', name: string) => {
    if (type === 'bank') {
      if (bankList.includes(name)) {
        setJetPayBankName(name);
        setJetPayStep(1);
        const existing = connectedPayments.details?.[name] || {};
        setJetPayCccd(existing.cccd || '037098001234');
        setJetPayOwnerName(existing.accountName || 'NGUYEN QUANG DUNG');
        setJetPayStoreName(existing.storeName || 'Quán phở Anh Hai');
        setJetPayBranchName(existing.branch || 'Chi nhánh Hồ Chí Minh');
        setIsJetPayModalOpen(true);
      } else {
        const existing = connectedPayments.details?.[name] || {};
        setCustomBankSelectedBank(OTHER_POPULAR_BANKS.includes(name) ? name : 'Other');
        setCustomBankOtherName(OTHER_POPULAR_BANKS.includes(name) ? '' : name);
        setCustomBankAccountNumber(existing.accountNumber || '');
        setCustomBankAccountName(existing.accountName || '');
        setCustomBankBranch(existing.branch || '');
        setEditingCustomBankName(name);
        setIsCustomBankModalOpen(true);
      }
    } else {
      setPaymentDetailsTarget({ type, name });
      const existing = connectedPayments.details?.[name] || {};
      setFormAccountNumber(existing.accountNumber || '');
      setFormAccountName(existing.accountName || '');
      setFormBranch(existing.branch || '');
      setFormPhoneNumber(existing.phoneNumber || '');
      setIsPaymentDetailsModalOpen(true);
    }
  };

  const renderBankLogo = (bank: string) => {
    if (bank === 'Techcombank') {
      return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="relative w-5.5 h-5.5 bg-[#E02424] flex items-center justify-center rounded-sm rotate-45 flex-shrink-0">
            <div className="w-1 h-full bg-white -rotate-45 absolute" />
            <div className="w-full h-1 bg-white -rotate-45 absolute" />
          </div>
          <span className="text-[11px] font-black tracking-tight text-[#E02424] uppercase font-sans">Techcombank</span>
        </div>
      );
    }
    if (bank === 'Vietcombank') {
      return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-5.5 h-5.5 rounded-full bg-[#10B981] flex items-center justify-center text-white font-black text-[9px] flex-shrink-0">VCB</div>
          <span className="text-[11px] font-black tracking-tight text-[#10B981] uppercase font-sans">Vietcombank</span>
        </div>
      );
    }
    if (bank === 'MB Bank') {
      return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-5.5 h-5.5 rounded-md bg-[#1E3A8A] flex items-center justify-center text-white font-black text-[9px] flex-shrink-0">MB</div>
          <span className="text-[11px] font-black tracking-tight text-[#1E3A8A] uppercase font-sans">MB Bank</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="w-5.5 h-5.5 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-[9px] uppercase flex-shrink-0">
          {bank.substring(0, 3)}
        </div>
        <span className="text-[11px] font-black tracking-tight text-slate-800 uppercase font-sans">{bank}</span>
      </div>
    );
  };

  const handleFinishJetPayConnection = () => {
    const bankName = jetPayBankName;
    setConnectedPayments((prev: any) => {
      const nextDetails = { ...(prev.details || {}) };
      nextDetails[bankName] = {
        accountNumber: '1903998888',
        accountName: jetPayOwnerName.toUpperCase().trim() || 'NGUYEN VAN A',
        branch: jetPayBranchName.trim() || 'Chi nhánh Hồ Chí Minh',
        cccd: jetPayCccd.trim(),
        storeName: jetPayStoreName.trim()
      };

      let nextBanks = [...(prev.banks || [])];
      if (!nextBanks.includes(bankName)) {
        nextBanks.push(bankName);
      }

      const updated = {
        ...prev,
        banks: nextBanks,
        transfer: true,
        details: nextDetails
      };

      localStorage.setItem('cukcuk_connected_payments', JSON.stringify(updated));
      return updated;
    });

    onNotification(`🎉 Đã kết nối thành công ngân hàng ${bankName}!`, 'success');
    setIsJetPayModalOpen(false);
  };

  const handleSavePaymentDetails = () => {
    if (!paymentDetailsTarget) return;
    const { type, name } = paymentDetailsTarget;
    
    // Validation
    if (type === 'bank') {
      if (!formAccountNumber.trim() || !formAccountName.trim()) {
        onNotification('Vui lòng nhập đầy đủ Số tài khoản và Tên tài khoản!', 'warning');
        return;
      }
    } else {
      if (!formPhoneNumber.trim() || !formAccountName.trim()) {
        onNotification('Vui lòng nhập đầy đủ Số điện thoại và Tên tài khoản!', 'warning');
        return;
      }
    }

    setConnectedPayments((prev: any) => {
      const nextDetails = { ...(prev.details || {}) };
      nextDetails[name] = type === 'bank' 
        ? { accountNumber: formAccountNumber.trim(), accountName: formAccountName.trim(), branch: formBranch.trim() }
        : { phoneNumber: formPhoneNumber.trim(), accountName: formAccountName.trim() };

      let nextBanks = [...(prev.banks || [])];
      let nextWallets = [...(prev.wallets || [])];

      if (type === 'bank') {
        if (!nextBanks.includes(name)) {
          nextBanks.push(name);
        }
      } else {
        if (!nextWallets.includes(name)) {
          nextWallets.push(name);
        }
      }

      const updated = {
        ...prev,
        banks: nextBanks,
        wallets: nextWallets,
        transfer: type === 'bank' ? true : prev.transfer,
        wallet: type === 'wallet' ? true : prev.wallet,
        details: nextDetails
      };

      localStorage.setItem('cukcuk_connected_payments', JSON.stringify(updated));
      return updated;
    });

    onNotification(`Đã kết nối thành công ${name}!`, 'success');
    setIsPaymentDetailsModalOpen(false);
    setPaymentDetailsTarget(null);
  };

  const handleDisconnectPaymentMethod = (type: 'bank' | 'wallet', name: string) => {
    setConnectedPayments((prev: any) => {
      const nextDetails = { ...(prev.details || {}) };
      delete nextDetails[name];

      let nextBanks = [...(prev.banks || [])];
      let nextWallets = [...(prev.wallets || [])];

      if (type === 'bank') {
        nextBanks = nextBanks.filter(b => b !== name);
      } else {
        nextWallets = nextWallets.filter(w => w !== name);
      }

      const updated = {
        ...prev,
        banks: nextBanks,
        wallets: nextWallets,
        details: nextDetails
      };

      localStorage.setItem('cukcuk_connected_payments', JSON.stringify(updated));
      return updated;
    });
    onNotification(`Đã ngắt kết nối ${name}!`, 'info');
  };

  // Step 7 Local States & Helpers (Kết nối hóa đơn điện tử)
  const [meInvoiceConnected, setMeInvoiceConnected] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_meinvoice_connected') === 'true';
  });
  const [eSignConnected, setESignConnected] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_esign_connected') === 'true';
  });
  const [isMeInvoiceModalOpen, setIsMeInvoiceModalOpen] = useState<boolean>(false);
  const [showMeInvoicePass, setShowMeInvoicePass] = useState<boolean>(false);
  const [mstInput, setMstInput] = useState<string>('0101243150-669');
  const [meInvoiceUser, setMeInvoiceUser] = useState<string>('anhduong.hn@misa.com.vn');
  const [meInvoicePass, setMeInvoicePass] = useState<string>('••••••••••••');
  const [eSignPhone, setESignPhone] = useState<string>('0987654321');
  const [eSignPin, setESignPin] = useState<string>('••••••');

  const [meInvoiceSubStep, setMeInvoiceSubStep] = useState<'login' | 'verify' | 'connected' | 'digital_signature' | 'config'>('login');
  const [signatureMethod, setSignatureMethod] = useState<'esign' | 'usb' | null>('esign');
  const [isCertificateSelectorOpen, setIsCertificateSelectorOpen] = useState<boolean>(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState<'misa' | 'minh'>('misa');
  const [meInvoiceVerificationCode, setMeInvoiceVerificationCode] = useState<string>('');
  const [meInvoiceCountdown, setMeInvoiceCountdown] = useState<number>(59);
  const [meInvoiceDonotAskAgain, setMeInvoiceDonotAskAgain] = useState<boolean>(false);

  // States for Step 2 - Invoice setup configuration
  const [allowPublishFromPos, setAllowPublishFromPos] = useState<boolean>(true);
  const [autoPublishAfterPayment, setAutoPublishAfterPayment] = useState<boolean>(true);
  const [autoPublishAtTime, setAutoPublishAtTime] = useState<boolean>(true);
  const [printQrOnBill, setPrintQrOnBill] = useState<boolean>(true);
  const [qrValidityHours, setQrValidityHours] = useState<string>('2');
  const [defaultInvoiceTemplate, setDefaultInvoiceTemplate] = useState<string>('');
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState<boolean>(false);
  const [defaultCustName, setDefaultCustName] = useState<string>('Khách lẻ');
  const [defaultCompName, setDefaultCompName] = useState<string>('Khách lẻ không lấy hóa đơn');
  const [defaultCompAddr, setDefaultCompAddr] = useState<string>('Khách lẻ không lấy hóa đơn');

  // Hiển thị trên HĐĐT (Show on e-invoice)
  const [showComboDetails, setShowComboDetails] = useState<boolean>(false);
  const [showBilingual, setShowBilingual] = useState<boolean>(false);
  const [showFixedPayment, setShowFixedPayment] = useState<boolean>(false);
  const [showExtendedInfo, setShowExtendedInfo] = useState<boolean>(false);
  const [showPaidPreferences, setShowPaidPreferences] = useState<boolean>(false);
  const [showTipNoChange, setShowTipNoChange] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isMeInvoiceModalOpen && meInvoiceSubStep === 'verify' && meInvoiceCountdown > 0) {
      timer = setInterval(() => {
        setMeInvoiceCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMeInvoiceModalOpen, meInvoiceSubStep, meInvoiceCountdown]);

  useEffect(() => {
    if (isMeInvoiceModalOpen) {
      if (meInvoiceConnected) {
        if (meInvoiceSubStep !== 'digital_signature' && meInvoiceSubStep !== 'config') {
          setMeInvoiceSubStep('connected');
        }
      } else {
        setMeInvoiceSubStep('login');
        setMeInvoiceVerificationCode('');
        setMeInvoiceCountdown(59);
      }
    }
  }, [isMeInvoiceModalOpen, meInvoiceConnected]);

  useEffect(() => {
    (window as any)._cukcuk_workspace_action = (action: string) => {
      if (action === 'go_to_step1_popup') {
        changeModalStep(1);
        return true;
      }
      if (action === 'complete_step1') {
        setCompletedSteps(prev => {
          const updated = { ...prev, 1: true };
          localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
          return updated;
        });
        changeModalStep(null);
        onNotification('🎉 Phương pháp tính thuế đã được thiết lập thành công!', 'success');
        onSendMessageToAi('Tôi đã hoàn thành Bước 1. Hãy hướng dẫn tôi tiếp tục sang Bước 2.');
        return true;
      }
      if (action === 'go_to_step2_popup') {
        changeModalStep(2);
        return true;
      }
      if (action === 'scan_image_popup') {
        changeModalStep(2);
        setActiveFlow('ava');
        return true;
      }
      if (action === 'excel_import_popup') {
        changeModalStep(2);
        setActiveFlow('excel');
        return true;
      }
      if (action === 'manual_popup') {
        changeModalStep(2);
        handleOpenAddDishPopup();
        return true;
      }
      if (action === 'complete_step2') {
        setCompletedSteps(prev => {
          const updated = { ...prev, 2: true };
          localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
          return updated;
        });
        changeModalStep(null);
        onNotification('🎉 Khai báo thực đơn đã được thiết lập thành công!', 'success');
        onSendMessageToAi('Tôi đã hoàn thành Bước 2. Hãy hướng dẫn tôi tiếp tục sang Bước 3.');
        return true;
      }
      if (action === 'go_to_step3_popup') {
        changeModalStep(3);
        return true;
      }
      if (action === 'add_kitchen_popup') {
        changeModalStep(3);
        handleOpenCreateArea();
        return true;
      }
      if (action === 'complete_step3_popup') {
        setCompletedSteps(prev => {
          const updated = { ...prev, 3: true };
          localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
          return updated;
        });
        changeModalStep(null);
        onNotification('🎉 Thiết lập Bếp/Bar đã hoàn thiện!', 'success');
        onSendMessageToAi('Tôi đã hoàn thành Bước 3. Hãy hướng dẫn tôi tiếp tục sang Bước 4.');
        return true;
      }
      if (action === 'go_to_step4_popup') {
        changeModalStep(4);
        return true;
      }
      if (action === 'add_zone_popup') {
        changeModalStep(4);
        handleOpenAddArea();
        setStep5AreaName('Sân thượng (Rooftop)');
        setAreaCode('RT');
        onNotification('✍️ Đã điền khu vực mẫu, bạn chỉ cần nhấn "Lưu thông tin"!', 'info');
        return true;
      }
      if (action === 'complete_step4_popup') {
        setCompletedSteps(prev => {
          const updated = { ...prev, 4: true };
          localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
          return updated;
        });
        changeModalStep(null);
        onNotification('🎉 Sơ đồ bàn đã hoàn thiện!', 'success');
        onSendMessageToAi('Tôi đã hoàn thành Bước 4. Hãy hướng dẫn tôi tiếp tục sang Bước 5.');
        return true;
      }
      if (action === 'go_to_step5_popup') {
        changeModalStep(5);
        return true;
      }
      if (action === 'connect_qr_popup') {
        changeModalStep(5);
        setSelectedPaymentType('transfer');
        handleConnectBank('Vietcombank');
        return true;
      }
      if (action === 'complete_step5_popup') {
        setCompletedSteps(prev => {
          const updated = { ...prev, 5: true };
          localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
          return updated;
        });
        changeModalStep(null);
        onNotification('🎉 Thiết lập hình thức thanh toán hoàn tất!', 'success');
        onSendMessageToAi('Tôi đã hoàn thành Bước 5. Hãy hướng dẫn tôi tiếp tục sang Bước 6.');
        return true;
      }
      if (action === 'go_to_step6_popup') {
        changeModalStep(6);
        return true;
      }
      if (action === 'connect_meinvoice_popup') {
        changeModalStep(6);
        setIsMeInvoiceModalOpen(true);
        if (!meInvoiceConnected) {
          setMeInvoiceSubStep('login');
        } else {
          setMeInvoiceSubStep('connected');
        }
        return true;
      }
      if (action === 'complete_step6_popup') {
        setCompletedSteps(prev => {
          const updated = { ...prev, 6: true };
          localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
          return updated;
        });
        changeModalStep(null);
        onNotification('🎉 Đã hoàn tất kết nối Hóa đơn điện tử!', 'success');
        onSendMessageToAi('Tôi đã hoàn thành Bước 6. Hãy hướng dẫn tôi tiếp tục sang Bước 7.');
        return true;
      }
      if (action === 'go_to_step7_popup') {
        changeModalStep(7);
        return true;
      }
      if (action === 'add_employee_popup') {
        changeModalStep(7);
        handleOpenAddEmployee();
        setEmpCode('NV012');
        setEmpName('Lê Hoàng Long');
        setEmpContact('0912345678');
        setEmpPhone('0912345678');
        setEmpRole('Thu ngân');
        onNotification('✍️ Đã điền thông tin nhân viên mẫu, bạn chỉ cần nhấn "Thêm nhân viên"!', 'info');
        return true;
      }
      if (action === 'complete_step7_popup') {
        setCompletedSteps(prev => {
          const updated = { ...prev, 7: true };
          localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
          return updated;
        });
        changeModalStep(null);
        onNotification('🎉 Khai báo nhân viên đã hoàn thiện!', 'success');
        if (onCompleteOnboarding) {
          onCompleteOnboarding();
        } else {
          onSendMessageToAi('Chúc mừng đã hoàn thành tất cả 7 bước thiết lập!');
        }
        return true;
      }
      return false;
    };

    return () => {
      (window as any)._cukcuk_workspace_action = null;
    };
  }, [onStepActivated, completedSteps]);

  // Step 1: Tax Method
  const [taxMethod, setTaxMethod] = useState<'khau_tru' | 'truc_tiep' | null>(() => {
    return (localStorage.getItem('cukcuk_tax_method') as any) || 'khau_tru';
  });
  const [taxRateType, setTaxRateType] = useState<'one_rate' | 'multi_rate'>(() => {
    return (localStorage.getItem('cukcuk_tax_rate_type') as any) || 'multi_rate';
  });
  const [taxRateValue, setTaxRateValue] = useState<string>(() => {
    return localStorage.getItem('cukcuk_tax_rate_value') || '8%';
  });
  const [tncnMethod, setTncnMethod] = useState<'percentage' | 'income'>(() => {
    return (localStorage.getItem('cukcuk_tncn_method') as any) || 'percentage';
  });
  const [tncnRate, setTncnRate] = useState<string>(() => {
    return localStorage.getItem('cukcuk_tncn_rate') || '15%';
  });

  useEffect(() => {
    setStep2Page(1);
  }, [menuItems.length]);

  useEffect(() => {
    const handleResetSteps = () => {
      // Step 1 reset
      setTaxMethod('khau_tru');
      setTaxRateType('one_rate');
      setTaxRateValue('8%');
      setTncnMethod('percentage');
      setTncnRate('15%');
      
      // Step 2 reset
      setMenuItems([]);
      
      // Step 3 reset
      setKitchenAreas([
        { id: '1', name: 'Bếp', type: 'Bếp', area: 'Khu dã ngoại', device: 'Máy in', printTime: 'In sau khi gửi yêu cầu chế biến', description: 'Chế biến các món ăn nóng, lẩu, nướng', dishes: [] },
        { id: '2', name: 'Bar', type: 'Bar', area: 'Quầy chính', device: 'Không sử dụng', printTime: 'In sau khi gửi yêu cầu chế biến', description: 'Pha chế đồ uống, rót bia', dishes: [] }
      ]);
      
      // Step 4 reset
      setEmployees([
        { 
          code: 'NV01', 
          name: 'Nguyễn Quang Dũng', 
          role: 'Quản trị hệ thống', 
          email: 'nqdung@gmail.com', 
          phone: '0901234567',
          gender: 'Nam',
          status: 'Chính thức',
          timekeepingCode: '',
          birthday: '',
          identityCard: '',
          issueDate: '',
          issuePlace: '',
          allowLogin: true
        }
      ]);
      
      // Step 5 reset
      setTableZones([]);
      setStep5Areas([]);
      
      // Step 6 reset
      setConnectedPayments({
        cash: true,
        transfer: false,
        wallet: false,
        banks: [],
        wallets: []
      });
      
      // Step 7 reset
      setMeInvoiceConnected(false);
      setESignConnected(false);

      // Reset onboarding tour
      localStorage.removeItem('cukcuk_workspace_tour_completed');
      setShowWorkspaceTour(true);
      setCurrentTourStep(0);
    };
    window.addEventListener('cukcuk_reset_steps', handleResetSteps);
    return () => {
      window.removeEventListener('cukcuk_reset_steps', handleResetSteps);
    };
  }, []);

  useEffect(() => {
    setStep3Page(1);
  }, [kitchenAreas.length]);

  // Step 5: Table layout (Zones & Tables)
  const [tableZones, setTableZones] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_table_zones');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Step 6: Payment methods connected
  const [connectedPayments, setConnectedPayments] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_connected_payments');
      return saved ? JSON.parse(saved) : {
        cash: true,
        transfer: false,
        wallet: false,
        banks: [] as string[],
        wallets: [] as string[]
      };
    } catch {
      return {
        cash: true,
        transfer: false,
        wallet: false,
        banks: [],
        wallets: []
      };
    }
  });

  // Save changes to localstorage automatically
  useEffect(() => {
    if (taxMethod) {
      localStorage.setItem('cukcuk_tax_method', taxMethod);
    } else {
      localStorage.removeItem('cukcuk_tax_method');
    }
    localStorage.setItem('cukcuk_tax_rate_type', taxRateType);
    localStorage.setItem('cukcuk_tax_rate_value', taxRateValue);
    localStorage.setItem('cukcuk_tncn_method', tncnMethod);
    localStorage.setItem('cukcuk_tncn_rate', tncnRate);
  }, [taxMethod, taxRateType, taxRateValue, tncnMethod, tncnRate]);

  useEffect(() => {
    localStorage.setItem('cukcuk_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('cukcuk_kitchen_areas', JSON.stringify(kitchenAreas));
  }, [kitchenAreas]);

  useEffect(() => {
    localStorage.setItem('cukcuk_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('cukcuk_table_zones', JSON.stringify(tableZones));
  }, [tableZones]);

  useEffect(() => {
    localStorage.setItem('cukcuk_connected_payments', JSON.stringify(connectedPayments));
  }, [connectedPayments]);

  // Read scale from survey to decide whether to show Kitchen Step
  const showKitchenStep = (() => {
    const scale = localStorage.getItem('cukcuk_scale') || '';
    if (scale.includes('Không sử dụng thiết bị')) {
      return false;
    }
    return true; // Default to true if not found or if they chose tablet/printer
  })();

  // Build setup steps list (always show all 7 steps for maximum clarity and sync with AVA)
  const steps = [
    {
      id: 1,
      title: 'Bước 1: Thiết lập phương pháp tính thuế',
      taskName: 'Thiết lập phương pháp tính thuế',
      description: 'Thiết lập phương pháp tính thuế giúp MISA CukCuk tự động cấu hình bảng tính thuế và nhóm ngành nghề phù hợp nhất với nhà hàng.',
    },
    {
      id: 2,
      title: 'Bước 2: Khai báo thực đơn',
      taskName: 'Khai báo thực đơn',
      description: 'Đồng bộ món ăn, giá bán và đơn vị tính bằng MISA AVA, tải tệp Excel hoặc nhập thủ công.',
    },
    {
      id: 3,
      title: 'Bước 3: Thiết lập Bếp/Bar',
      taskName: 'Thiết lập Bếp/Bar',
      description: 'Thiết lập danh sách khu vực chế biến để tự động in và điều phối món ăn xuống Bếp/Bar hợp lý.',
      skippable: true,
    },
    {
      id: 4,
      title: 'Bước 4: Sơ đồ bàn',
      taskName: 'Sơ đồ bàn',
      description: 'Sắp xếp danh sách khu vực và số lượng bàn của nhà hàng để tối ưu khâu ghi order và phục vụ tại bàn.',
      skippable: true,
    },
    {
      id: 5,
      title: 'Bước 5: Thiết lập hình thức thanh toán',
      taskName: 'Thiết lập hình thức thanh toán',
      description: 'Kích hoạt các phương thức thanh toán đáp ứng tại nhà hàng của bạn. Giúp phần mềm tự động xuất mã QR thanh toán động và theo dõi dòng tiền chính xác.',
      skippable: true,
    },
    {
      id: 6,
      title: 'Bước 6: Kết nối hóa đơn điện tử',
      taskName: 'Kết nối hóa đơn điện tử',
      description: 'Đồng bộ dịch vụ hóa đơn điện tử máy tính tiền MISA meInvoice với Cơ quan Thuế để cấp mã ký số bảo mật, tự động xuất hóa đơn trong 2 giây.',
      skippable: true,
    },
    {
      id: 7,
      title: 'Bước 7: Khai báo nhân viên',
      taskName: 'Khai báo nhân viên',
      description: 'Phân quyền tài khoản đăng nhập cho Thu ngân ca sáng, Phục vụ ca tối và Bếp để đối soát doanh thu chi tiết.',
      skippable: true,
    },
  ];

  const prevCompletedStepsRef = useRef<Record<number, boolean> | null>(null);

  useEffect(() => {
    // Initialize on first mount
    if (prevCompletedStepsRef.current === null) {
      prevCompletedStepsRef.current = { ...completedSteps };
      return;
    }

    // Identify newly completed step
    let newlyCompletedStepId: number | null = null;
    for (let id = 1; id <= 7; id++) {
      if (completedSteps[id] && !prevCompletedStepsRef.current[id]) {
        newlyCompletedStepId = id;
        break;
      }
    }

    // Update ref
    prevCompletedStepsRef.current = { ...completedSteps };

    if (newlyCompletedStepId !== null) {
      const nextStepId = newlyCompletedStepId + 1;
      if (nextStepId <= 7) {
        // Auto collapse the completed step and expand the next step
        setExpandedStep(nextStepId);
      }
    }
  }, [completedSteps, steps, onAddAiMessage, onSendMessageToAi]);

  // --- END GETTING STARTED POPUP SETTINGS ---

  // Operational apps installation states
  const [selectedQrApp, setSelectedQrApp] = useState<{ role: string; qrUrl: string; platform: string } | null>(null);
  const [staffPhone, setStaffPhone] = useState('');
  const [expandedSubCard, setExpandedSubCard] = useState<string | null>(null);
  const [activeShareCard, setActiveShareCard] = useState<{ role: string; id: string } | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [isSendingShareEmail, setIsSendingShareEmail] = useState(false);

  const handleSendDownloadLink = () => {
    if (!staffPhone.trim()) {
      onNotification('⚠️ Vui lòng nhập số điện thoại hoặc tài khoản Zalo nhân viên!', 'info');
      return;
    }
    onNotification(`🚀 Đã gửi tin nhắn SMS chứa link tải ứng dụng đến số ${staffPhone}!`, 'success');
    setStaffPhone('');
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const [aiReportCompletedCount, setAiReportCompletedCount] = useState(0);

  // Suggested questions for quick-click chat interaction
  const suggestedQuestions = [
    'Hướng dẫn nhanh các tính năng của MISA CukCuk',
    'Gợi ý thực đơn giúp tăng doanh thu cho quán bia',
    'Hướng dẫn kê khai thuế nhà hàng năm 2026'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    onSendMessageToAi(text);
    if (!textToSend) setChatInput('');
  };

  const handleStartStep = (stepNumber: number, stepName: string) => {
    // Check if they click Step 2, they must have completed Step 1
    if (stepNumber === 2 && !completedSteps[1]) {
      onNotification('⚠️ Lưu ý: Bạn bắt buộc phải cấu hình Phương pháp tính thuế tại Bước 1 trước khi khai báo thực đơn!', 'info');
      changeModalStep(1);
      return;
    }

    if (stepNumber >= 1 && stepNumber <= 7) {
      changeModalStep(stepNumber);
      onNotification(`Đang mở bảng thiết lập cho: ${stepName}`, 'info');
    }
  };

  const handleSkipStep = (stepNumber: number, stepName: string) => {
    setCompletedSteps(prev => {
      const updated = { ...prev, [stepNumber]: true };
      localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
      return updated;
    });

    let msg = `⏭️ Đã bỏ qua Bước ${stepNumber}: ${stepName}!`;
    if (stepNumber === 4) msg = '⏭️ Đã bỏ qua Bước 4: Thiết lập sơ đồ bàn!';
    if (stepNumber === 5) msg = '⏭️ Đã bỏ qua Bước 5: Thiết lập thanh toán!';
    onNotification(msg, 'info');

    if (stepNumber === 7) {
      onSendMessageToAi('Tôi đã hoàn thành Bước 7. Hãy hướng dẫn tôi kết thúc 7 bước thiết lập.');
    }
  };

  const goToStep = (stepNumber: number, bypassCheck: boolean = false) => {
    if (stepNumber >= 1 && stepNumber <= 7) {
      if (!bypassCheck && stepNumber === 2 && !completedSteps[1]) {
        onNotification('⚠️ Lưu ý: Bạn bắt buộc phải cấu hình Phương pháp tính thuế tại Bước 1 trước khi khai báo thực đơn!', 'info');
        changeModalStep(1);
        return;
      }
      changeModalStep(stepNumber);
    }
  };

  const completeStepAndGoNext = (currentStepId: number, skip: boolean = false) => {
    if (!skip) {
      if (currentStepId === 1) {
        if (!taxMethod) {
          onNotification('⚠️ Vui lòng chọn phương pháp tính thuế GTGT phù hợp cho nhà hàng!', 'info');
          return;
        }
      }
      if (currentStepId === 2) {
        if (!menuItems || menuItems.length === 0) {
          onNotification('⚠️ Vui lòng thêm hoặc tạo ít nhất một món ăn vào thực đơn!', 'info');
          return;
        }
      }
      if (currentStepId === 6) {
        if (!meInvoiceConnected) {
          onNotification('⚠️ Vui lòng kết nối MISA meInvoice', 'info');
          return;
        }
      }
    }

    setCompletedSteps(prev => {
      const updated = { ...prev, [currentStepId]: true };
      localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
      return updated;
    });

    if (skip) {
      onNotification(`⏭️ Đã bỏ qua Bước ${currentStepId}!`, 'info');
    } else {
      let msg = '🎉 Thiết lập thành công!';
      if (currentStepId === 1) msg = '🎉 Thiết lập phương pháp tính thuế thành công!';
      if (currentStepId === 2) msg = '🎉 Lưu thực đơn thành công!';
      if (currentStepId === 3) msg = '🎉 Thiết lập Bếp/Bar thành công!';
      if (currentStepId === 4) msg = '🎉 Cấu hình sơ đồ bàn nhà hàng hoàn tất!';
      if (currentStepId === 5) msg = '🎉 Thiết lập hình thức thanh toán hoàn tất!';
      if (currentStepId === 6) msg = '🎉 Kết nối hóa đơn điện tử hoàn tất!';
      if (currentStepId === 7) msg = '🎉 Thiết lập nhân viên hoàn tất!';
      onNotification(msg, 'success');
    }

    if (currentStepId < 7) {
      goToStep(currentStepId + 1, true);
    } else {
      const incompleteBefore7 = [1, 2, 3, 4, 5, 6].filter(id => !completedSteps[id]);
      if (incompleteBefore7.length > 0) {
        const lowestIncomplete = incompleteBefore7[0];
        goToStep(lowestIncomplete, true);
      } else {
        changeModalStep(null);
        if (onCompleteOnboarding) {
          onCompleteOnboarding();
        } else {
          onSendMessageToAi('Tôi đã hoàn thành Bước 7. Hãy hướng dẫn tôi kết thúc 7 bước thiết lập.');
        }
      }
    }
  };

  const softwareCards = [
    {
      id: 'cashier',
      role: 'Thu ngân, Lễ Tân',
      badge: 'Máy tính (PC), Máy POS',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
      tagline: 'Quản lý két tiền mặt, ghi nhận order tại quầy, xuất hóa đơn & bàn giao ca.',
      platform: 'Windows (Máy PC, Máy POS đặt cố định)',
      desc: 'Ghi order nhanh chóng, áp dụng khuyến mãi, quản lý dòng két tiền an toàn, in hóa đơn tạm tính/chính thức và bàn giao ca dễ dàng.',
      icon: Receipt,
      iconBg: 'bg-blue-50 text-blue-600',
      iconActiveBg: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
      image: "https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=4ebc354e-733f-4ed2-9863-004a57d117e5.png&preview=true&cId=69e9c29d0426675a2209dee1&tenantcode=misa",
      platforms: ['Windows'],
      actions: [
        { label: 'Tải bộ cài', type: 'download', onClick: () => onNotification('Đang chuẩn bị tải bộ cài đặt Thu ngân & Lễ tân CukCuk...', 'success') },
        { label: 'Xem hướng dẫn', type: 'doc', onClick: () => onNotification('Mở hướng dẫn cấu hình chi tiết máy POS thu ngân', 'info') },
        { label: 'Video hướng dẫn', type: 'video', onClick: () => onNotification('Đang mở video hướng dẫn lắp đặt thiết bị thu ngân...', 'info') }
      ]
    },
    {
      id: 'waiter',
      role: 'Nhân viên ghi order',
      badge: 'Điện thoại Android/iOS',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-100',
      tagline: 'Đặt món trực tiếp tại bàn khách, gửi ngay xuống khu chế biến chỉ trong 1 chạm.',
      platform: 'Điện thoại, Máy tính bảng (Android, iOS)',
      desc: 'Ghi nhận order trực quan theo sơ đồ bàn, quản lý số khách, ghi chú món ăn chi tiết và gửi yêu cầu tức thì đến Bếp/Bar qua Wifi.',
      icon: OrderStaffIcon,
      iconBg: 'bg-orange-50 text-orange-600',
      iconActiveBg: 'bg-orange-600 text-white shadow-md shadow-orange-500/20',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://cukcuk.vn/waiter-app',
      platforms: ['Android', 'iOS'],
      actions: [
        { label: 'Tài liệu hướng dẫn', type: 'doc', onClick: () => onNotification('Mở tài liệu hướng dẫn sử dụng app Ghi Order cho nhân viên', 'info') },
        { label: 'Video hướng dẫn', type: 'video', onClick: () => onNotification('Đang mở video hướng dẫn sử dụng ứng dụng ghi order...', 'info') }
      ]
    },
    {
      id: 'kitchen',
      role: 'Bếp/Bar',
      badge: 'KDS, Tablet, Smart TV',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      tagline: 'Hiển thị danh sách món cần chế biến trực quan, gộp món và báo trả món.',
      platform: 'Máy tính bảng Android, Smart TV Android',
      desc: 'Hiển thị danh sách món cần chế biến theo thứ tự gọi, tự động gộp số lượng các món cùng loại và báo hoàn thành món chỉ với 1 chạm.',
      icon: ChefHat,
      iconBg: 'bg-emerald-50 text-emerald-600',
      iconActiveBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://cukcuk.vn/kitchen-app',
      platforms: ['Android'],
      actions: [
        { label: 'Tài liệu hướng dẫn', type: 'doc', onClick: () => onNotification('Mở tài liệu hướng dẫn thiết lập màn hình bếp/bar', 'info') },
        { label: 'Video hướng dẫn', type: 'video', onClick: () => onNotification('Đang mở video hướng dẫn lắp đặt màn hình bếp...', 'info') }
      ]
    },
    {
      id: 'manager',
      role: 'Quản lý, Chủ quán',
      badge: 'App Quản lý (Điện thoại)',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
      tagline: 'Theo dõi tình hình kinh doanh, doanh thu, báo cáo mọi lúc mọi nơi.',
      platform: 'Điện thoại (Android, iOS)',
      desc: 'Theo dõi tức thời doanh thu, số lượng hóa đơn, lượng bàn đang sử dụng và xem báo cáo kinh doanh trực quan mọi lúc mọi nơi.',
      icon: Briefcase,
      iconBg: 'bg-purple-50 text-purple-600',
      iconActiveBg: 'bg-purple-600 text-white shadow-md shadow-purple-500/20',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://cukcuk.vn/manager-app',
      platforms: ['Android', 'iOS'],
      actions: [
        { label: 'Tài liệu hướng dẫn', type: 'doc', onClick: () => onNotification('Mở tài liệu hướng dẫn sử dụng App Quản lý cho chủ quán', 'info') },
        { label: 'Video hướng dẫn', type: 'video', onClick: () => onNotification('Đang mở video giới thiệu và sử dụng App Quản lý...', 'info') }
      ]
    }
  ];

  return (
    <div className="w-full px-6 py-6 select-none animate-fade-in" id="workspace-layout">
      
      {/* 🔮 Onboarding Tour Overlay & Spotlight */}
      {showWorkspaceTour && createPortal(
        <div className="fixed inset-0 z-[100000] overflow-hidden pointer-events-none">
          {/* Transparent click-blocking backdrop */}
          <div className="absolute inset-0 bg-transparent pointer-events-auto" />
          
          {/* Target Spotlight Highlight - utilizing fixed position and large box shadow to dim surroundings while keeping target bright */}
          {tourCoords && (
            <div 
              className="fixed border-[3.5px] border-[#2563EB] rounded-2xl shadow-[0_0_0_9999px_rgba(15,23,42,0.65),0_0_30px_rgba(37,99,235,0.7)] z-[100001] transition-all duration-300 pointer-events-none"
              style={{
                top: tourCoords.top - 8,
                left: tourCoords.left - 8,
                width: tourCoords.width + 16,
                height: tourCoords.height + 16,
              }}
            />
          )}

          {/* Interactive Tooltip Card */}
          <div 
            className="fixed bg-white rounded-2xl border border-slate-200/80 shadow-[0_24px_64px_rgba(15,23,42,0.22)] p-5 flex gap-4 transition-all duration-300 pointer-events-auto z-[100002]"
            style={(() => {
              if (!tourCoords) return { bottom: '24px', left: '50%', transform: 'translateX(-50%)', width: '92%' };
              const step = tourSteps[currentTourStep];
              const isMobile = window.innerWidth < 768;
              
              if (isMobile) {
                return {
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                };
              }
              
              const tooltipWidth = 460;
              const tooltipHeight = 220; // Estimated height
              
              // Calculate horizontal position centered relative to the target
              const targetCenterX = tourCoords.left + (tourCoords.width / 2);
              let left = targetCenterX - (tooltipWidth / 2);
              // Constrain horizontal boundary inside the viewport
              left = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, left));
              
              // Determine vertical placement based on available space and requested placement
              const spaceBelow = window.innerHeight - (tourCoords.top + tourCoords.height);
              const spaceAbove = tourCoords.top;
              
              let top = tourCoords.top + tourCoords.height + 16; // default bottom
              
              if (step.placement === 'top' || (spaceBelow < tooltipHeight && spaceAbove > spaceBelow)) {
                top = tourCoords.top - tooltipHeight - 16;
              }
              
              // Constraint vertical boundary inside the viewport to avoid the 48px header
              top = Math.max(64, Math.min(window.innerHeight - tooltipHeight - 16, top));
              
              return {
                top: `${top}px`,
                left: `${left}px`,
                width: `${tooltipWidth}px`
              };
            })()}
          >
            {/* Mascot Image Inside Tooltip */}
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#F4F9FF] to-[#EBF5FF] rounded-xl border border-blue-100 flex items-end justify-center overflow-hidden shadow-xs pt-1 px-1 pb-0">
              <img 
                src="https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=24d46582-1265-4400-a254-d9bf281f9b2f.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa" 
                alt="MISA AVA"
                className="w-full h-full object-contain object-bottom pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Tooltip Content Column */}
            <div className="flex-1 text-left flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-2 py-0.5 select-none">
                    Bước {currentTourStep + 1} / {tourSteps.length}
                  </span>
                  <button 
                    onClick={() => handleCloseTour(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg cursor-pointer"
                    title="Bỏ qua hướng dẫn"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
                
                <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-1.5 mb-1 select-none">
                  {tourSteps[currentTourStep].title}
                  <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-100 animate-pulse flex-shrink-0" />
                </h3>
                
                <p className="text-[12.5px] font-semibold text-slate-600 leading-relaxed select-none mb-3.5">
                  {tourSteps[currentTourStep].content}
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleCloseTour(false)}
                  className="text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  Bỏ qua
                </button>

                <div className="flex items-center gap-2">
                  {currentTourStep > 0 && (
                    <button
                      onClick={() => setCurrentTourStep(prev => prev - 1)}
                      className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[12px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Quay lại
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (currentTourStep < tourSteps.length - 1) {
                        setCurrentTourStep(prev => prev + 1);
                      } else {
                        handleCloseTour(true);
                      }
                    }}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[12px] px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-xs shadow-blue-500/10 flex items-center gap-1"
                  >
                    <span>{currentTourStep === tourSteps.length - 1 ? 'Bắt đầu thiết lập' : 'Tiếp tục'}</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 🔮 Onboarding Step-by-Step Tour Overlay & Spotlight */}
      {activeModalStep !== null && showStepTour[activeModalStep] && stepTourCoords && createPortal(
        <div className="fixed inset-0 z-[100000] overflow-hidden pointer-events-none font-sans">
          {/* Transparent click-blocking backdrop */}
          <div className="absolute inset-0 bg-transparent pointer-events-auto" />
          
          {/* Target Spotlight Highlight */}
          <div 
            className="fixed border-[3.5px] border-[#245FDF] rounded-2xl shadow-[0_0_0_9999px_rgba(16,20,27,0.75),0_0_30px_rgba(36,95,223,0.65)] z-[100001] transition-all duration-300 pointer-events-none"
            style={{
              top: stepTourCoords.top - 8,
              left: stepTourCoords.left - 8,
              width: stepTourCoords.width + 16,
              height: stepTourCoords.height + 16,
            }}
          />

          {/* Interactive Tooltip Card with AVA mascot */}
          <div 
            className="fixed bg-white rounded-2xl border border-slate-200/80 shadow-[0_24px_64px_rgba(16,20,27,0.22)] p-5 flex gap-4 transition-all duration-300 pointer-events-auto z-[100002]"
            style={(() => {
              const isMobile = window.innerWidth < 768;
              if (isMobile) {
                return {
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                };
              }
              
              const tooltipWidth = 460;
              const tooltipHeight = 210; // Estimated height
              
              // Calculate horizontal position centered relative to the target
              const targetCenterX = stepTourCoords.left + (stepTourCoords.width / 2);
              let left = targetCenterX - (tooltipWidth / 2);
              left = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, left));
              
              // Place above or below based on space
              const spaceBelow = window.innerHeight - (stepTourCoords.top + stepTourCoords.height);
              const spaceAbove = stepTourCoords.top;
              
              let top = stepTourCoords.top + stepTourCoords.height + 16; // default bottom
              if (spaceBelow < tooltipHeight && spaceAbove > spaceBelow) {
                top = stepTourCoords.top - tooltipHeight - 16;
              }
              
              top = Math.max(64, Math.min(window.innerHeight - tooltipHeight - 16, top));
              
              return {
                top: `${top}px`,
                left: `${left}px`,
                width: `${tooltipWidth}px`
              };
            })()}
          >
            {/* Mascot Image Inside Tooltip */}
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#F0F6FE] to-white rounded-xl border border-blue-100 flex items-end justify-center overflow-hidden shadow-xs pt-1 px-1 pb-0">
              <img
                src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=98b0a90c-9059-4684-b088-09a3a2f70e6a.png&isTemp=true&tenantCode=misa"
                alt="Trợ lý AVA"
                className="w-14 h-14 md:w-[72px] md:h-[72px] object-contain object-bottom select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Tooltip text contents & actions */}
            <div className="flex-1 flex flex-col justify-between text-left">
              <div>
                <h4 className="text-[14px] font-extrabold text-[#10141B] flex items-center leading-snug">
                  {(() => {
                    if (activeModalStep === 1) return 'Thiết lập phương pháp tính thuế';
                    if (activeModalStep === 2) return 'Khai báo thực đơn';
                    if (activeModalStep === 3) return 'Thiết lập Bếp/Bar';
                    if (activeModalStep === 4) return 'Sơ đồ bàn';
                    if (activeModalStep === 5) return 'Thiết lập hình thức thanh toán';
                    if (activeModalStep === 6) return 'Kết nối hóa đơn điện tử';
                    return 'Khai báo nhân viên';
                  })()}
                </h4>
                <p className="text-[#6B707A] text-[12.5px] leading-relaxed font-normal mt-1.5">
                  {(() => {
                    if (activeModalStep === 1) return (
                      <>
                        <strong>Để MISA CukCuk</strong> hỗ trợ tính tiền và báo cáo thuế chính xác, bạn hãy chọn phương pháp thuế phù hợp với mô hình nhà hàng. Trợ lý AVA đề xuất sử dụng Phương pháp khấu trừ với <strong>mức thuế suất GTGT 8% cho dịch vụ ăn uống và 10% đối với rượu, bia.</strong>
                      </>
                    );
                    if (activeModalStep === 2) return (
                      <>
                        Để xây dựng thực đơn nhanh chóng, CukCuk hỗ trợ các phương thức linh hoạt từ <strong>nhập Excel</strong>, <strong>khai báo thủ công</strong>, đến <strong>quét ảnh bằng AI</strong>. Đặc biệt, các món Đồ ăn sẽ được <strong>tự động thêm vào Khu vực Bếp</strong> và các món Đồ uống đã được <strong>tự động thêm vào Khu vực Bar</strong>.
                      </>
                    );
                    if (activeModalStep === 3) return (
                      <>
                        Thiết lập khu vực chế biến giúp <strong>tự động in phiếu chế biến xuống đúng bếp/bar</strong> tương ứng ngay khi nhân viên gửi order, <strong>tránh thất thoát hay chậm trễ</strong>. Để tối ưu hóa quy trình, các món Đồ ăn khai báo ở Bước 2 đã được <strong>tự động thêm vào Khu vực Bếp</strong> và các món Đồ uống đã được <strong>tự động thêm vào Khu vực Bar</strong>.
                      </>
                    );
                    if (activeModalStep === 4) return (
                      <>
                        Sơ đồ phòng bàn trực quan giúp <strong>phục vụ gọi món nhanh theo đúng vị trí thực tế</strong>, <strong>thu ngân kiểm soát bàn trống và thanh toán chính xác</strong>. Trợ lý AVA đề xuất tạo các khu vực bàn đặc thù bao gồm: <strong>Khu vực Sân vườn, Khu vực Trong nhà và Phòng VIP</strong>.
                      </>
                    );
                    if (activeModalStep === 5) return (
                      <>
                        Đa dạng hóa phương thức thanh toán giúp khách hàng <strong>thanh toán tiện lợi</strong> và thu ngân <strong>đối soát doanh số nhanh chóng</strong>. Trợ lý AVA đề xuất kích hoạt ngay phương thức <strong>Chuyển khoản VietQR động</strong> để khách <strong>quét mã chuyển khoản nhanh tại bàn, tự động điền số tiền</strong>.
                      </>
                    );
                    if (activeModalStep === 6) return (
                      <>
                        Việc liên kết hóa đơn điện tử giúp <strong>xuất hóa đơn trực tiếp từ máy tính tiền</strong> ngay khi khách hoàn tất thanh toán. Trợ lý AVA đề xuất tích hợp giải pháp <strong>MISA meInvoice</strong> cùng chữ ký số từ xa <strong>MISA eSign</strong> để xuất hóa đơn <strong>nhanh chóng, chuyên nghiệp và hợp lệ</strong>.
                      </>
                    );
                    return (
                      <>
                        Khai báo danh sách nhân viên giúp bạn <strong>quản lý chặt ca làm việc, két tiền</strong>, <strong>hạn chế tối đa thất thoát doanh thu</strong>. Trợ lý AVA đề xuất tạo tài khoản riêng cho <strong>Thu ngân</strong> quản lý két tiền mặt, <strong>Phục vụ</strong> ghi order di động và <strong>Bếp/Bar</strong> để theo dõi chế biến.
                      </>
                    );
                  })()}
                </p>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-end mt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStepTour(prev => ({ ...prev, [activeModalStep]: false }));
                    }}
                    className="h-[28px] px-3.5 bg-[#245FDF] hover:bg-[#1B4EBA] border-none text-white font-bold text-[12px] rounded-lg cursor-pointer transition-all flex items-center justify-center"
                  >
                    Tôi đã hiểu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* 💠 Beautiful AVA Welcome Banner replacing the search bar */}
      <div 
        className="relative bg-gradient-to-br from-[#F4F9FF] to-[#EBF5FF] rounded-2xl border-2 border-[#2563EB] shadow-[0_12px_32px_rgba(37,99,235,0.12),0_4px_12px_rgba(37,99,235,0.03)] px-6 pt-6 pb-0 mb-6 overflow-hidden flex flex-col md:flex-row items-center md:items-end gap-6" 
        id="misa-ava-featured-chatbox"
      >
        {/* Left Side: Avatar Image of MISA AVA - Enlarged and flush to the bottom stroke */}
        <div className="flex-shrink-0 relative w-40 h-40 md:w-56 md:h-56 flex items-end justify-center select-none">
          <img 
            src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=6e842963-9a57-4fe8-8884-0660a2f42603.png&isTemp=true&tenantCode=misa" 
            alt="MISA AVA"
            className="w-full h-full object-contain pointer-events-none transform hover:scale-105 transition-all duration-300 drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Side: Text & Welcome Message content */}
        {allStepsCompleted ? (
          <div className="flex-1 text-left flex flex-col justify-center gap-3 z-10 pb-6 md:pb-6 md:self-center w-full">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              Xin chào, Nguyễn Quang Dũng <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-100 animate-pulse" />
            </h2>
            
            <p className="text-[13px] md:text-sm text-slate-600 font-medium leading-relaxed">
              Tôi là Trợ lý ảo MISA AVA. Hãy đặt bất kỳ câu hỏi nào về quy trình hoạt động, điều chỉnh thực đơn, sơ đồ bàn, thanh toán VietQR hay xuất hóa đơn điện tử để tôi hỗ trợ bạn tức thì.
            </p>

            {/* Chatbox hỏi MISA AVA */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!bannerChatText.trim()) return;
                onSendMessageToAi(bannerChatText);
                if (onOpenAiSheet) {
                  onOpenAiSheet();
                }
                setBannerChatText('');
              }}
              className="relative flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 mt-1 shadow-sm focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:border-[#2563EB] transition-all w-full max-w-2xl"
            >
              <input 
                type="text"
                value={bannerChatText}
                onChange={(e) => setBannerChatText(e.target.value)}
                placeholder="Hỏi MISA AVA... (ví dụ: Làm thế nào để sửa sơ đồ bàn?)"
                className="flex-1 text-[13px] md:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none outline-hidden focus:outline-hidden focus:ring-0 pr-8"
              />
              <button 
                type="submit"
                disabled={!bannerChatText.trim()}
                className={`p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                  bannerChatText.trim() 
                    ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white active:scale-95' 
                    : 'bg-slate-100 text-slate-300 pointer-events-none'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 text-left flex flex-col gap-3.5 z-10 pb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              Xin chào, Nguyễn Quang Dũng <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-100 animate-pulse" />
            </h2>
            
            <p className="text-[13px] md:text-sm text-slate-700 font-medium leading-relaxed">
              👋 <strong>Chào mừng bạn đến với MISA CukCuk!</strong> Trợ lý ảo MISA AVA đã chuẩn bị sẵn <strong>Hướng dẫn Thiết lập 7 bước</strong> dành riêng cho mô hình <strong>Nhà hàng Phong Dê</strong> của bạn.
            </p>

            {/* Sparkles Notice Section */}
            <div className="flex items-start gap-2.5 text-[12px] md:text-[13px] text-slate-600 bg-white/75 border border-blue-100 rounded-xl p-3 shadow-2xs">
              <p className="leading-relaxed">
                <strong>🎯 Nhiệm vụ đầu tiên:</strong> Nhấn nút bên dưới để thiết lập phương pháp tính thuế GTGT cho nhà hàng.
              </p>
            </div>

            {/* Action button */}
            <div className="pt-1">
              <button 
                onClick={() => changeModalStep(1)}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-bold text-[13px] md:text-sm px-6 py-2.5 rounded-xl cursor-pointer transition-all shadow-md shadow-blue-500/25 flex items-center gap-2"
              >
                <span>Bắt đầu thiết lập</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Ambient Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 💠 Section 1: "Hướng dẫn Thiết lập" styled EXACTLY like the screenshot */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden mb-6" id="setup-accordion-card">
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-left">
              <h2 className="text-lg md:text-xl font-bold text-[#101828]">Hướng dẫn thiết lập</h2>
              <p className="text-[13px] text-[#475467] mt-1 font-medium">
                Cùng MISA CukCuk làm quen các bước xây dựng và vận hành nhà hàng
              </p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=7f381468-f0d3-4a6d-9f8d-bfec40947df0.png&isTemp=true&tenantCode=misa" 
                alt="Chào mừng" 
                className="h-16 md:h-20 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Horizontal progress bar */}
          <div className="flex items-center gap-4 mt-5">
            <div className="flex-1 h-2 bg-[#F2F4F7] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1570EF] rounded-full transition-all duration-500"
                style={{ width: `${(steps.filter(s => completedSteps[s.id]).length / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-[13px] text-[#475467] font-semibold flex-shrink-0 select-none">
              Đã hoàn thành {steps.filter(s => completedSteps[s.id]).length} trên {steps.length} bước
            </span>
          </div>
        </div>

        {/* Steps List (Collapsible Accordions) */}
        <div className="divide-y divide-slate-100">
          {steps.map((step) => {
            const isExpanded = expandedStep === step.id;
            const isCompleted = completedSteps[step.id];

            return (
              <div key={step.id} className={`transition-colors ${isExpanded ? 'bg-[#F0F6FE]' : ''}`}>
                {/* Accordion Row Header */}
                <div 
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className={`flex items-center justify-between px-6 py-4 cursor-pointer select-none transition-colors ${isExpanded ? 'hover:bg-[#E0EEFE]' : 'hover:bg-slate-50/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompletedSteps(prev => {
                          const updated = { ...prev, [step.id]: !prev[step.id] };
                          localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
                          return updated;
                        });
                        onNotification(`Đã cập nhật trạng thái ${step.taskName}`, 'success');
                      }}
                      className="flex-shrink-0 cursor-pointer focus:outline-hidden"
                    >
                      {isCompleted ? (
                        <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shadow-xs animate-scale-up">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="flex-shrink-0 block w-5 h-5 rounded-full border-2 border-dashed border-slate-400 bg-white hover:border-blue-500 transition-colors" />
                      )}
                    </button>
                    <span className="text-sm font-bold text-[#101828]">{step.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#667085]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#667085]" />
                  )}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="pl-14 pr-6 pb-5 flex flex-col items-start gap-3 animate-fade-in text-left">
                    <p className="text-[13px] text-[#475467] leading-relaxed font-medium">
                      {step.description}
                    </p>

                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <button
                          onClick={() => handleStartStep(step.id, step.taskName)}
                          className="border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-[13px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
                        >
                          Cấu hình lại
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartStep(step.id, step.taskName)}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
                          >
                            Thiết lập
                          </button>
                          {(step as any).skippable && (
                            <button
                              onClick={() => handleSkipStep(step.id, step.taskName)}
                              className="px-4 py-2 text-[13px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                            >
                              Bỏ qua
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 💠 Section 2: "Cài đặt phần mềm" */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden mb-6" id="software-install-card">
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h2 className="text-base md:text-lg font-bold text-[#101828]">Cài đặt phần mềm bán hàng</h2>
            <p className="text-[13px] text-[#475467] mt-1 font-medium font-sans leading-relaxed sm:whitespace-nowrap">
              Tải và cài đặt các ứng dụng tương thích cho từng bộ phận để tối ưu quy trình đồng bộ tại nhà hàng
            </p>
          </div>
          <div className="flex-shrink-0">
            <img 
              src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=64a37e40-3e3e-4cf2-8804-37c368908a43.png&isTemp=true&tenantCode=misa" 
              alt="Cài đặt phần mềm" 
              className="h-16 md:h-20 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Tiêu đề & Nút tải hướng dẫn cài đặt chung (PDF) */}
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] md:text-sm font-bold text-slate-800">
              Phần mềm cho từng bộ phận
            </h3>
            <button
              onClick={() => {
                onNotification('Đang chuẩn bị tải tài liệu "Huong_dan_cai_dat_thiet_bi_CukCuk.pdf"...', 'success');
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#245FDF] hover:bg-blue-700 text-white text-[12px] font-bold px-4 py-2 rounded-lg border border-transparent cursor-pointer transition-all active:scale-95 shadow-xs whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-white" />
              Tải hướng dẫn
            </button>
          </div>

          {/* Clean, fully open grid of 4 modules without expand/collapse */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {softwareCards.map((card) => {
              const CardIcon = card.icon;

              return (
                <div 
                  key={card.id}
                  className="border border-slate-200 bg-white rounded-xl p-5 flex flex-col justify-between hover:shadow-sm hover:border-[#245FDF]/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 justify-between">
                    {/* Left side: Content (Title, Subtitle/Desc, Platforms) */}
                    <div className="flex-1 min-w-0 text-left">
                      {/* Top row with Icon, Role, Badge */}
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                          <CardIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-[13.5px] font-bold text-slate-900 leading-none">Dành cho {card.role}</h4>
                            <span className={`text-[9.5px] border font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans leading-none ${card.badgeColor}`}>
                              {card.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* App description (Shortened) */}
                      <p className="text-[12px] text-[#6B707A] mt-3 font-medium font-sans leading-relaxed">
                        {card.desc}
                      </p>

                      {/* Platforms tag lists */}
                      <div className="flex flex-wrap items-center gap-3 mt-3 select-none">
                        {card.platforms.includes('Windows') && (
                          <div className="flex items-center gap-1 py-0.5">
                            <Monitor className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px] font-semibold text-[#6B707A]">Windows (PC/POS)</span>
                          </div>
                        )}
                        {card.platforms.includes('Android') && (
                          <div className="flex items-center gap-1 py-0.5">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.25391 1.74414C3.06456 1.93348 2.95898 2.21312 2.95898 2.53125V21.4688C2.95898 21.7869 3.06456 22.0665 3.25391 22.2559L13.1117 12.398L3.25391 1.74414Z" fill="#0DF2FE"/>
                              <path d="M17.0674 8.44238L13.1113 12.3984L17.0674 16.3545L20.5947 14.3496C21.603 13.7744 21.603 11.0224 20.5947 10.4473L17.0674 8.44238Z" fill="#FFC900"/>
                              <path d="M13.1113 12.3984L3.25391 22.2559C3.51865 22.5206 3.96102 22.5323 4.45344 22.252L17.0674 15.0718L13.1113 12.3984Z" fill="#FF1943"/>
                              <path d="M13.1113 12.3984L17.0674 8.44238L4.45344 1.26224C3.96102 0.981832 3.51865 0.993514 3.25391 1.25826L13.1113 12.3984Z" fill="#00F177"/>
                            </svg>
                            <span className="text-[11px] font-bold text-[#475467]">Android</span>
                          </div>
                        )}
                        {card.platforms.includes('iOS') && (
                          <div className="flex items-center gap-1 py-0.5">
                            <svg className="w-3.5 h-3.5 flex-shrink-0 fill-current text-slate-900" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.029-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.07 1.004 1.45 2.185 3.078 3.766 3.014 1.524-.058 2.098-.981 3.937-.981 1.829 0 2.366.981 3.96.95 1.624-.029 2.664-1.479 3.654-2.924 1.153-1.68 1.624-3.303 1.654-3.385-.03-.015-3.174-1.218-3.204-4.814-.03-2.994 2.445-4.434 2.564-4.514-1.404-2.059-3.564-2.295-4.324-2.355-2.009-.163-3.29 1.04-3.96 1.04zm2.14-3.834c.829-1.024 1.389-2.445 1.234-3.864-1.215.05-2.69.81-3.564 1.829-.765.885-1.434 2.325-1.254 3.714 1.355.105 2.755-.655 3.584-1.679z"/>
                            </svg>
                            <span className="text-[11px] font-bold text-[#475467]">iOS</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side: Image / QR Code */}
                    <div className="flex-shrink-0 self-start">
                      {card.image ? (
                        <div className="w-24 h-24 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                          <img 
                            src={card.image}
                            alt={card.role}
                            className="w-full h-full object-contain select-none"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : card.qrUrl ? (
                        <div 
                          onClick={() => setSelectedQrApp({ role: card.role, qrUrl: card.qrUrl!, platform: card.platform })}
                          className="w-24 h-24 bg-slate-50 border border-slate-100 p-1.5 rounded-xl flex flex-col items-center justify-center cursor-pointer group relative"
                        >
                          <img 
                            src={card.qrUrl} 
                            alt="QR Code" 
                            className="w-[82px] h-[82px] object-contain select-none"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <span className="text-[9px] bg-slate-900/80 text-white font-bold px-1 py-0.5 rounded shadow-xs">QR</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Action buttons row (at the bottom) */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                      {card.actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={act.onClick}
                          className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-2xs ${
                            act.type === 'download' 
                              ? 'bg-[#245FDF] hover:bg-blue-700 text-white' 
                              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {act.type === 'download' && <Download className="w-3.5 h-3.5" />}
                          {act.type === 'doc' && <BookOpen className="w-3.5 h-3.5" />}
                          {act.type === 'video' && <Video className="w-3.5 h-3.5" />}
                          {act.label}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setActiveShareCard({ role: card.role, id: card.id });
                          setShareEmail('');
                        }}
                        className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer bg-white hover:bg-slate-50 text-[#245FDF] border border-[#245FDF]/20 transition-all active:scale-95 shadow-2xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Chia sẻ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Footer "Bạn đã xem hết" conforming to screenshot */}
      <div className="flex items-center justify-center gap-1.5 py-6 border-t border-slate-200/50 text-slate-400 text-[13px] font-bold select-none">
        <Check className="w-4 h-4 text-slate-400" />
        <span>Bạn đã xem hết</span>
      </div>

      {/* 💠 QR Code Modal */}
      {selectedQrApp && (
        <div 
          className={`fixed top-0 left-0 bottom-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in ${
            isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
          }`} 
          onClick={() => setSelectedQrApp(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3">
              <div>
                <h4 className="text-sm font-bold text-[#101828]">Mã QR tải ứng dụng nhanh</h4>
                <p className="text-[12px] text-blue-600 font-extrabold mt-0.5">{selectedQrApp.role} • {selectedQrApp.platform}</p>
              </div>
              <button 
                onClick={() => setSelectedQrApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center py-6">
              {/* QR container with scanning effect */}
              <div className="relative w-40 h-40 bg-white p-2 rounded-xl border-2 border-blue-100 shadow-inner flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedQrApp.qrUrl} 
                  alt="Mã QR CukCuk"
                  className="w-full h-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
                {/* Laser line scanning effect */}
                <div className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_#2563eb] animate-qr-scan" />
              </div>
              
              <p className="text-[13px] text-center text-[#475467] max-w-xs mt-4 font-semibold leading-relaxed font-sans">
                Quét mã QR bằng camera điện thoại hoặc Zalo để tải ứng dụng. Hãy hướng dẫn nhân viên thuộc bộ phận tương ứng thiết lập để bắt đầu làm việc.
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedQrApp(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💠 Share Modal */}
      {activeShareCard && (
        <div 
          className={`fixed top-0 left-0 bottom-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in ${
            isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
          }`} 
          onClick={() => setActiveShareCard(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-[#101828]">Chia sẻ hướng dẫn thiết lập</h4>
                <p className="text-[12px] text-blue-600 font-extrabold mt-0.5">Dành cho: {activeShareCard.role}</p>
              </div>
              <button 
                onClick={() => setActiveShareCard(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-left">
              <p className="text-xs text-[#475467] leading-relaxed">
                Tải trực tiếp tài liệu hướng dẫn định dạng PDF hoặc sao chép liên kết hướng dẫn cấu hình thiết bị bán hàng chi tiết cho riêng bộ phận này.
              </p>

              {/* Action 1: Tải file PDF */}
              <button 
                onClick={() => {
                  onNotification(`Đang tải file "Huong_dan_thiet_lap_cho_${activeShareCard.id}.pdf"...`, 'success');
                  setActiveShareCard(null);
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#245FDF] hover:bg-blue-700 text-white text-[13px] font-bold py-2.5 px-4 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                Tải hướng dẫn
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Hoặc sao chép link</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* Action 2: Sao chép link */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[#6B707A] uppercase tracking-wider">Đường dẫn hướng dẫn thiết lập</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    readOnly
                    value={`https://cukcuk.vn/setup/${activeShareCard.id}`}
                    className="flex-1 bg-[#F0F2F4] border border-[#D0D5DD] rounded-lg px-3 py-2 text-[13px] text-[#10141B] font-sans outline-hidden select-all"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://cukcuk.vn/setup/${activeShareCard.id}`);
                      onNotification(`📋 Đã sao chép đường dẫn hướng dẫn cho ${activeShareCard.role} thành công!`, 'success');
                    }}
                    className="bg-white border border-[#245FDF] text-[#245FDF] hover:bg-[#F0F6FE] text-[13px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    Sao chép
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💠 Interactive Setup Popups (Constrained dynamically to keep MISA AVA visible) */}
      {activeModalStep !== null && (
        <div 
          className={`fixed inset-y-0 left-0 bg-[#F1F3F5] z-40 animate-fade-in flex flex-col ${
            isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
          }`}
          style={{ top: showTrialBanner ? '92px' : '48px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header with beautiful horizontal 7-step progress bar */}
          <div className="bg-white border-b border-slate-200 flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between px-[20px] py-3 md:py-0 md:h-16 gap-3 md:gap-4 shadow-xs font-sans relative">
            {/* Title Row on mobile, Left on desktop */}
            <div className="flex items-center justify-between md:justify-start flex-shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[18px] md:text-[20px] font-bold text-slate-900 whitespace-nowrap">
                  Hướng dẫn thiết lập
                </h3>
              </div>
              {/* Close Button on Mobile */}
              <button 
                onClick={() => changeModalStep(null)}
                className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Steps timeline container - Flexbox layout, no overlapping absolute position */}
            <div className="flex-1 flex items-center justify-center min-w-0 select-none">
              {isTimelineOverflowing && (
                <button
                  type="button"
                  onClick={() => scrollStepsTimeline('left')}
                  className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-all active:scale-90 shadow-2xs mr-2 flex-shrink-0"
                  title="Quay lại"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
              )}

              <div 
                ref={stepsTimelineRef}
                className="flex-1 flex items-center overflow-x-auto py-1.5 scrollbar-none scroll-smooth justify-start min-w-0"
              >
                <div className="flex items-center gap-1.5 md:gap-3 flex-nowrap px-1 mx-auto">
                  {steps.map((s, idx) => {
                    const isCurrent = s.id === activeModalStep;
                    const isDone = completedSteps[s.id];
                    
                    return (
                      <React.Fragment key={s.id}>
                        {/* Step item */}
                        <button
                          id={`step-timeline-btn-${s.id}`}
                          type="button"
                          onClick={() => goToStep(s.id)}
                          className="flex items-center gap-2 flex-shrink-0 cursor-pointer focus:outline-hidden transition-all group"
                        >
                          {/* Circle */}
                          <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[12px] font-bold border transition-all ${
                            isCurrent 
                              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs' 
                              : isDone
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-600'
                          }`}>
                            {isDone && !isCurrent ? (
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            ) : (
                              s.id
                            )}
                          </div>
                          
                          {/* Label */}
                          <span className={`text-[13px] font-bold transition-colors whitespace-nowrap ${
                            isCurrent 
                              ? 'text-[#2563EB]' 
                              : isDone
                                ? 'text-emerald-600'
                                : 'text-slate-400 group-hover:text-slate-600'
                          }`}>
                            {s.id === 1 ? 'Thuế suất' :
                             s.id === 2 ? 'Thực đơn' :
                             s.id === 3 ? 'Bếp/Bar' :
                             s.id === 4 ? 'Sơ đồ bàn' :
                             s.id === 5 ? 'Thanh toán' :
                             s.id === 6 ? 'Hóa đơn điện tử' : 'Nhân viên'}
                          </span>
                        </button>
                        
                        {/* Connector line (except last step) */}
                        {idx < steps.length - 1 && (
                          <div className={`h-[1px] w-4 sm:w-6 md:w-10 transition-colors ${
                            completedSteps[s.id] && completedSteps[s.id+1] ? 'bg-emerald-400' : 'bg-slate-200'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {isTimelineOverflowing && (
                <button
                  type="button"
                  onClick={() => scrollStepsTimeline('right')}
                  className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-all active:scale-90 shadow-2xs ml-2 flex-shrink-0"
                  title="Tiếp theo"
                >
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>

            {/* Close button on Desktop */}
            <button 
              onClick={() => changeModalStep(null)}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Card content wrapper */}
          <div className="flex-1 p-[20px] bg-[#F1F3F5] flex flex-col overflow-hidden">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/60 w-full max-w-full flex-1 flex flex-col overflow-hidden">
              <div className={`p-[20px] flex-1 flex flex-col min-h-0 ${
                ((activeModalStep === 2 && menuItems.length > 0) || activeModalStep === 3 || activeModalStep === 4 || activeModalStep === 7) 
                  ? 'overflow-hidden' 
                  : 'overflow-y-auto'
              }`}>
                {(() => {
                  const currentStepData = steps.find(s => s.id === activeModalStep);
                  if (!currentStepData) return null;
                  return (
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left flex-shrink-0 select-none">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[16px] font-bold text-slate-900 leading-tight flex items-center gap-3">
                          <span>{currentStepData.title}</span>
                        </h4>
                        <p className="text-[13px] text-slate-500 mt-1.5 font-medium leading-relaxed">
                          {currentStepData.description}
                        </p>
                      </div>

                      {/* Header Buttons for Step 2, 3, 4, 7 */}
                      {activeModalStep === 2 && menuItems.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                          {selectedDishIndexes.length > 0 && (
                            <button
                              type="button"
                              onClick={handleOpenBulkEditPopup}
                              className="px-3.5 py-2 text-[13px] font-bold text-[#0066FF] bg-white hover:bg-blue-50/50 border border-[#0066FF] rounded-lg flex items-center gap-1.5 transition-all cursor-pointer select-none h-[36px] active:scale-95 shadow-xs animate-fade-in"
                            >
                              <Edit className="w-4 h-4 text-[#0066FF]" />
                              Sửa hàng loạt ({selectedDishIndexes.length})
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setActiveFlow('excel')}
                            className="px-3.5 py-2 text-[13px] font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer select-none h-[36px] active:scale-95"
                          >
                            <UploadCloud className="w-4 h-4 text-slate-500" />
                            Nhập khẩu
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveFlow('ava')}
                            className="px-3.5 py-2 text-[13px] font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer select-none h-[36px] active:scale-95"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            Tạo thực đơn từ ảnh
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenAddDishPopup}
                            className="px-4 py-2 text-[13px] font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs select-none h-[36px] active:scale-95"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            Thêm món
                          </button>
                        </div>
                      )}

                      {activeModalStep === 3 && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={handleOpenCreateArea}
                            className="px-4 py-2 text-[13px] font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer shadow-xs select-none h-[36px] flex items-center gap-1.5 active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                            Thêm mới
                          </button>
                        </div>
                      )}

                      {activeModalStep === 4 && step5Areas.length > 0 && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={handleQuickSetup}
                            className="h-[36px] px-4 border border-[#245FDF] text-[#245FDF] hover:bg-[#245FDF]/5 bg-white font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer outline-none"
                          >
                            Thiết lập nhanh
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenAddArea}
                            className="h-[36px] px-3.5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-[8px] flex items-center justify-center gap-1.5 transition-all cursor-pointer outline-none shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Thêm mới
                          </button>
                        </div>
                      )}

                      {activeModalStep === 7 && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={handleOpenAddEmployee}
                            className="px-4 py-2 text-[13px] font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-all cursor-pointer shadow-xs select-none active:scale-95 h-[36px] flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            Thêm mới
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

              {activeModalStep === 1 && (
                <div className="flex flex-col h-full text-left">
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="text-[13px] font-bold text-slate-700 block mb-2">Phương pháp tính thuế GTGT</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="setup-step1-tax-selector">
                        {/* Option A: Khấu trừ */}
                        <button
                          type="button"
                          onClick={() => setTaxMethod('khau_tru')}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex gap-3 relative overflow-hidden ${
                            taxMethod === 'khau_tru'
                              ? 'border-[#2563EB] bg-blue-50/40 shadow-xs ring-1 ring-blue-500/30'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            taxMethod === 'khau_tru' ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <Percent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 pr-3">
                            <h4 className="text-[13px] font-bold text-slate-800">Phương pháp khấu trừ</h4>
                            <p className="text-[13px] text-slate-500 mt-1 leading-normal font-medium">
                              Phù hợp nhà hàng quy mô lớn, có đầy đủ hóa đơn đầu vào.
                            </p>
                          </div>
                        </button>

                        {/* Option B: Trực tiếp */}
                        <button
                          type="button"
                          onClick={() => setTaxMethod('truc_tiep')}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex gap-3 relative overflow-hidden ${
                            taxMethod === 'truc_tiep'
                              ? 'border-[#2563EB] bg-blue-50/40 shadow-xs ring-1 ring-blue-500/30'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            taxMethod === 'truc_tiep' ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div className="flex-1 pr-3">
                            <h4 className="text-[13px] font-bold text-slate-800">Trực tiếp trên doanh thu</h4>
                            <p className="text-[13px] text-slate-500 mt-1 leading-normal font-medium">
                              Phù hợp hộ kinh doanh, cá nhân kinh doanh nộp thuế theo phương pháp kê khai hoặc tính % trực tiếp trên doanh thu.
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Sub-options for Khấu trừ */}
                    {taxMethod === 'khau_tru' && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3 animate-fade-in">
                        <span className="text-[13px] font-extrabold text-blue-800 block">Cấu hình mức thuế suất áp dụng</span>
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-slate-700">
                              <input
                                type="radio"
                                name="taxRateType"
                                checked={taxRateType === 'multi_rate'}
                                onChange={() => setTaxRateType('multi_rate')}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span>Áp dụng nhiều mức thuế suất</span>
                            </label>
                            <p className="text-[12px] text-slate-500 pl-5 leading-relaxed font-normal">
                              (Theo nghị quyết NQ204/2025/QH15, mức thuế GTGT giảm từ 10% xuống 8% và trừ một số nhóm hàng hóa, dịch vụ. Nhà hàng có thể thiết lập nhiều mức thuế và áp dụng cho từng hàng hóa theo đúng quy định.)
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-slate-700">
                              <input
                                type="radio"
                                name="taxRateType"
                                checked={taxRateType === 'one_rate'}
                                onChange={() => setTaxRateType('one_rate')}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span>Chỉ áp dụng 1 mức thuế suất</span>
                            </label>

                            {taxRateType === 'one_rate' && (
                              <div className="pl-5 mt-1 animate-fade-in flex items-center gap-3">
                                <span className="text-[13px] text-slate-500 font-medium">Nhập hoặc chọn thuế suất (%)</span>
                                <input
                                  type="text"
                                  value={taxRateValue}
                                  onChange={(e) => setTaxRateValue(e.target.value)}
                                  className="bg-white border border-[#D0D5DD] rounded-lg px-2.5 py-1 text-[13px] font-bold outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-24"
                                  placeholder="8%"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sub-options for Trực tiếp */}
                    {taxMethod === 'truc_tiep' && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3 animate-fade-in">
                        <span className="text-[13px] font-extrabold text-blue-800 block">Cấu hình tỷ lệ nộp thuế trên doanh thu</span>
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-slate-700">
                              <input
                                type="radio"
                                name="tncnMethod"
                                checked={tncnMethod === 'percentage'}
                                onChange={() => {
                                  setTncnMethod('percentage');
                                  setTncnRate('4.5%');
                                }}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span>Áp dụng đối với Hộ kinh doanh, Cá nhân kinh doanh</span>
                            </label>
                            <p className="text-[12px] text-slate-500 pl-5 leading-relaxed font-normal">
                              (Theo Thông tư 40/2021/TT-BTC, dịch vụ ăn uống áp dụng mức thuế suất: <strong>3% thuế GTGT</strong> và <strong>1.5% thuế TNCN</strong>, tổng cộng <strong>4.5% trên doanh thu</strong>).
                            </p>
                          </div>

                          <div className="flex flex-col gap-1 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-slate-700">
                              <input
                                type="radio"
                                name="tncnMethod"
                                checked={tncnMethod === 'income'}
                                onChange={() => {
                                  setTncnMethod('income');
                                  setTncnRate('5%');
                                }}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span>Áp dụng đối với Doanh nghiệp nộp thuế trực tiếp</span>
                            </label>
                            <p className="text-[12px] text-slate-500 pl-5 leading-relaxed font-normal">
                              (Theo quy định về thuế GTGT trực tiếp đối với dịch vụ ăn uống, nhà hàng, doanh nghiệp áp dụng mức thuế suất <strong>5% thuế GTGT trên doanh thu</strong>).
                            </p>
                          </div>

                          {/* Detail of selected rate */}
                          <div className="pl-5 mt-2 pt-2 border-t border-slate-200/60 animate-fade-in flex items-center gap-3">
                            <span className="text-[13px] text-slate-600 font-medium">Tổng thuế suất áp dụng:</span>
                            <span className="text-[13px] font-bold text-[#245FDF] bg-[#F0F6FE] px-2.5 py-1 rounded-md">
                              {tncnMethod === 'percentage' ? '4.5% (3% GTGT + 1.5% TNCN)' : '5% (GTGT trực tiếp)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {activeModalStep === 2 && (
                <div className="flex-1 flex flex-col min-h-0 text-left">
                  {menuItems.length === 0 ? (
                    /* EMPTY STATE: 3 INITIAL ACTIONS */
                    <div className="flex-1 flex flex-col justify-center py-4 select-none animate-fade-in">
                      {true ? (
                        <div id="setup-step2-ava-action" className="space-y-6">
                          <div className="text-center max-w-md mx-auto">
                            <h3 className="text-slate-800 font-bold text-[16px] mb-1">
                              Thiết lập thực đơn nhà hàng
                            </h3>
                            <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                              Vui lòng lựa chọn một phương thức bên dưới để bắt đầu cấu hình danh mục món ăn cho nhà hàng của bạn.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            {/* Option 1: Excel */}
                            <div 
                              onClick={() => setActiveFlow('excel')}
                              className="group border border-slate-200 hover:border-[#2563EB] hover:shadow-md bg-white rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between h-52 text-left"
                            >
                              <div className="space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                  <UploadCloud className="w-5 h-5" />
                                </div>
                                <h4 className="text-slate-800 font-bold text-[14px]">
                                  Nhập khẩu từ Excel
                                </h4>
                                <p className="text-slate-500 text-[13px] font-medium leading-normal">
                                  Tải lên danh sách thực đơn đã có sẵn của bạn dưới dạng tệp Excel (.xlsx).
                                </p>
                              </div>
                              <span className="text-[13px] font-bold text-[#2563EB] group-hover:underline flex items-center gap-1 mt-2">
                                Bắt đầu nhập khẩu <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>

                            {/* Option 2: Manual Init */}
                            <div 
                              onClick={handleOpenAddDishPopup}
                              className="group border border-slate-200 hover:border-[#2563EB] hover:shadow-md bg-white rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between h-52 text-left"
                            >
                              <div className="space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                  <PlusCircle className="w-5 h-5" />
                                </div>
                                <h4 className="text-slate-800 font-bold text-[14px]">
                                  Thêm mới trực tiếp
                                </h4>
                                <p className="text-slate-500 text-[13px] font-medium leading-normal">
                                  Tự thêm mới thủ công từng món ăn, đồ uống trực tiếp vào thực đơn của bạn.
                                </p>
                              </div>
                              <span className="text-[13px] font-bold text-amber-600 group-hover:underline flex items-center gap-1 mt-2">
                                Thêm món mới ngay <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>

                            {/* Option 3: MISA AVA */}
                            <div 
                              onClick={() => setActiveFlow('ava')}
                              className="group border border-slate-200 hover:border-[#2563EB] hover:shadow-md bg-white rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between h-52 text-left"
                            >
                              <div className="space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                  <Sparkles className="w-5 h-5" />
                                </div>
                                <h4 className="text-slate-800 font-bold text-[14px] flex items-center gap-1.5 leading-snug">
                                  Tạo thực đơn từ ảnh
                                </h4>
                                <p className="text-slate-500 text-[13px] font-medium leading-normal">
                                  Tải lên ảnh chụp thực đơn giấy, MISA AVA sẽ tự động phân tích và tạo món.
                                </p>
                              </div>
                              <span className="text-[13px] font-bold text-emerald-600 group-hover:underline flex items-center gap-1 mt-2">
                                Quét hình ảnh AI <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    /* DATA TABLE STATE: POPULATED DISHES LIST */
                    <div className="flex-1 flex flex-col min-h-0 animate-fade-in select-none">
                      {/* DATA TABLE WRAPPER - STRETCHES TO EDGES */}
                      <div className="flex-1 flex flex-col min-h-0 -mx-[20px] -mb-[20px] border-t border-slate-200/65 overflow-hidden bg-white">
                        <div className="flex-1 min-h-[220px] overflow-y-auto">
                          <table className="w-full text-left border-collapse select-none">
                          <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10">
                            <tr>
                              <th className="py-2.5 pl-[20px] pr-3 text-[13px] font-bold text-slate-800 w-[52px] text-center">
                                <input
                                  type="checkbox"
                                  checked={isAllPageSelected}
                                  onChange={handleSelectAllPage}
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                                />
                              </th>
                              <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800">Tên món</th>
                              <th className="py-2.5 px-3 text-[13px] font-bold text-slate-800 w-[150px] min-w-[150px] max-w-[150px]">Mã món</th>
                              <th className="py-2.5 px-3 text-[13px] font-bold text-slate-800 w-[150px] min-w-[150px] max-w-[150px]">Loại món</th>
                              <th className="py-2.5 px-3 text-[13px] font-bold text-slate-800 w-[150px] min-w-[150px] max-w-[150px]">Nhóm thực đơn</th>
                              <th className="py-2.5 px-3 text-[13px] font-bold text-slate-800 text-right w-[150px] min-w-[150px] max-w-[150px]">Giá bán</th>
                              <th className="py-2.5 px-3 text-[13px] font-bold text-slate-800 w-[180px] min-w-[180px] max-w-[180px]">Chế biến tại</th>
                              <th className="py-2.5 px-3 text-[13px] font-bold text-slate-800 w-[120px] min-w-[120px] max-w-[120px]">Đơn vị tính</th>
                              <th className="py-2.5 px-3 text-[13px] font-bold text-slate-800 w-[120px] min-w-[120px] max-w-[120px] text-left">Thuế</th>
                              <th className="py-2.5 pl-3 pr-[20px] text-[13px] font-bold text-slate-800 w-[116px] text-center">Thao tác</th>
                            </tr>
                            <tr className="bg-[#FAFAFA] border-b border-[#E9EAEB]">
                              <th className="py-1 pl-[20px] pr-3 text-center"></th>
                              {/* Tên món */}
                              <th className="py-1 px-4">
                                <div className="flex items-center border border-slate-200 rounded bg-white text-[12px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                  <div className="w-[26px] h-full flex-shrink-0 flex items-center justify-center bg-slate-50 border-r border-slate-200 text-slate-500 font-bold select-none text-[12px]">*</div>
                                  <input
                                    type="text"
                                    value={filterName}
                                    onChange={(e) => {
                                      setFilterName(e.target.value);
                                      setStep2Page(1);
                                    }}
                                    className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[12px] font-semibold"
                                  />
                                </div>
                              </th >
                              {/* Mã món */}
                              <th className="py-1 px-3 w-[150px] min-w-[150px] max-w-[150px]" >
                                <div className="flex items-center border border-slate-200 rounded bg-white text-[12px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                  <div className="w-[26px] h-full flex-shrink-0 flex items-center justify-center bg-slate-50 border-r border-slate-200 text-slate-500 font-bold select-none text-[12px]">*</div>
                                  <input
                                    type="text"
                                    value={filterCode}
                                    onChange={(e) => {
                                      setFilterCode(e.target.value);
                                      setStep2Page(1);
                                    }}
                                    className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[12px] font-semibold"
                                  />
                                </div>
                              </th >
                              {/* Loại món */}
                              <th className="py-1 px-3 w-[150px] min-w-[150px] max-w-[150px]" >
                                <div className="relative">
                                  <select
                                    value={filterItemType}
                                    onChange={(e) => {
                                      setFilterItemType(e.target.value);
                                      setStep2Page(1);
                                    }}
                                    className="w-full h-[26px] border border-slate-200 rounded bg-white text-slate-700 text-[12px] font-semibold pl-1.5 pr-5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden cursor-pointer appearance-none"
                                  >
                                    <option value="">Tất cả</option>
                                    <option value="Đồ ăn">Đồ ăn</option>
                                    <option value="Đồ uống">Đồ uống</option>
                                    <option value="Combo">Combo</option>
                                    <option value="Khác">Khác</option>
                                  </select>
                                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </th >
                              {/* Nhóm thực đơn */}
                              <th className="py-1 px-3 w-[150px] min-w-[150px] max-w-[150px]" >
                                <div className="relative">
                                  <select
                                    value={filterGroup}
                                    onChange={(e) => {
                                      setFilterGroup(e.target.value);
                                      setStep2Page(1);
                                    }}
                                    className="w-full h-[26px] border border-slate-200 rounded bg-white text-slate-700 text-[12px] font-semibold pl-1.5 pr-5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden cursor-pointer appearance-none"
                                  >
                                    <option value="">Tất cả</option>
                                    {Array.from(new Set(menuItems.map(item => item.type).filter(Boolean))).map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </th >
                              {/* Giá bán */}
                              <th className="py-1 px-3 w-[150px] min-w-[150px] max-w-[150px]" >
                                <div className="flex items-center border border-slate-200 rounded bg-white text-[12px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                  <select
                                    value={filterPriceOp}
                                    onChange={(e) => {
                                      setFilterPriceOp(e.target.value as any);
                                      setStep2Page(1);
                                    }}
                                    className="bg-slate-50 text-slate-600 border-r border-slate-200 h-full px-1 text-[12px] font-bold focus:outline-hidden cursor-pointer select-none appearance-none text-center w-[26px] flex-shrink-0"
                                  >
                                    <option value="=">=</option>
                                    <option value="<=">&le;</option>
                                    <option value=">=">&ge;</option>
                                  </select>
                                  <input
                                    type="text"
                                    value={filterPriceVal}
                                    onChange={(e) => {
                                      setFilterPriceVal(e.target.value);
                                      setStep2Page(1);
                                    }}
                                    className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[12px] font-semibold text-right"
                                  />
                                </div>
                              </th >
                              {/* Chế biến tại */}
                              <th className="py-1 px-3 w-[180px] min-w-[180px] max-w-[180px]" >
                                <div className="relative">
                                  <select
                                    value={filterCookingArea}
                                    onChange={(e) => {
                                      setFilterCookingArea(e.target.value);
                                      setStep2Page(1);
                                    }}
                                    className="w-full h-[26px] border border-slate-200 rounded bg-white text-slate-700 text-[12px] font-semibold pl-1.5 pr-5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden cursor-pointer appearance-none"
                                  >
                                    <option value="">Tất cả</option>
                                    {Array.from(new Set(kitchenAreas.map(item => item.name).filter(Boolean))).map(name => (
                                      <option key={name} value={name}>{name}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </th >
                              {/* Đơn vị tính */}
                              <th className="py-1 px-3 w-[120px] min-w-[120px] max-w-[120px]" >
                                <div className="flex items-center border border-slate-200 rounded bg-white text-[12px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                  <div className="w-[26px] h-full flex-shrink-0 flex items-center justify-center bg-slate-50 border-r border-slate-200 text-slate-500 font-bold select-none text-[12px]">*</div>
                                  <input
                                    type="text"
                                    value={filterUnit}
                                    onChange={(e) => {
                                      setFilterUnit(e.target.value);
                                      setStep2Page(1);
                                    }}
                                    className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[12px] font-semibold"
                                  />
                                </div>
                              </th >
                              {/* Thuế suất */}
                              <th className="py-1 px-3 w-[120px] min-w-[120px] max-w-[120px]" >
                                <div className="relative">
                                  <select
                                    value={filterTax}
                                    onChange={(e) => {
                                      setFilterTax(e.target.value);
                                      setStep2Page(1);
                                    }}
                                    className="w-full h-[26px] border border-slate-200 rounded bg-white text-slate-700 text-[12px] font-semibold pl-1.5 pr-5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden cursor-pointer appearance-none"
                                  >
                                    <option value="">Tất cả</option>
                                    {Array.from(new Set(menuItems.map(item => item.rateOrGroup || '8%'))).map(tax => (
                                      <option key={tax} value={tax}>{tax}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </th>
                              <th className="py-1 pl-3 pr-[20px]"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[13px] font-semibold text-slate-700">
                            {filteredMenuItems.slice((step2Page - 1) * step2PageSize, step2Page * step2PageSize).map((dish, idx) => {
                              const actualIndex = menuItems.findIndex(m => m.code === dish.code);
                              const isEditing = actualIndex === inlineEditingIndex;
                              const isSelected = selectedDishIndexes.includes(actualIndex);

                              const handleKeyDown = (e: React.KeyboardEvent) => {
                                if (e.key === 'Enter') {
                                  handleSaveInlineEdit(actualIndex);
                                } else if (e.key === 'Escape') {
                                  handleCancelInlineEdit();
                                }
                              };

                              return (
                                <tr
                                  key={idx}
                                  id={`edit-row-${actualIndex}`}
                                  onDoubleClick={() => {
                                    if (!isEditing) {
                                      handleRowDoubleClick(actualIndex, dish);
                                    }
                                  }}
                                  className={`transition-colors select-none group cursor-pointer ${
                                    isEditing
                                      ? 'bg-blue-50/50'
                                      : isSelected
                                      ? 'bg-blue-50/30 hover:bg-blue-50/40'
                                      : 'hover:bg-[#EDFCF4]/40 odd:bg-slate-50/25'
                                  }`}
                                >
                                  {/* Checkbox column */}
                                  <td className="py-2.5 pl-[20px] pr-3 text-center w-[52px]" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleSelectRow(actualIndex)}
                                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                                    />
                                  </td>

                                  {/* Tên món */}
                                  <td className="py-2.5 px-4 text-slate-900 font-bold">
                                    {isEditing && tempEditValues ? (
                                      <input
                                        type="text"
                                        value={tempEditValues.name}
                                        onKeyDown={handleKeyDown}
                                        onChange={e => setTempEditValues(prev => prev ? { ...prev, name: e.target.value } : null)}
                                        className="w-full h-8 px-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 text-[13px] font-bold text-slate-900 bg-white focus:outline-hidden"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      dish.name
                                    )}
                                  </td>

                                  {/* Mã món */}
                                  <td className="py-2.5 px-3 text-slate-500 w-[150px] min-w-[150px] max-w-[150px]">
                                    {isEditing && tempEditValues ? (
                                      <input
                                        type="text"
                                        value={tempEditValues.code}
                                        disabled
                                        className="w-full h-8 px-2 border border-slate-200 rounded text-[13px] text-slate-400 bg-slate-100/70 cursor-not-allowed focus:outline-hidden font-medium"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      dish.code
                                    )}
                                  </td>

                                  {/* Loại món */}
                                  <td className="py-2.5 px-3 text-slate-600 w-[150px] min-w-[150px] max-w-[150px]">
                                    {isEditing && tempEditValues ? (
                                      <select
                                        value={tempEditValues.itemType}
                                        onChange={e => {
                                          const val = e.target.value;
                                          setTempEditValues(prev => {
                                            if (!prev) return null;
                                            const nextAreas = val === 'Đồ uống' ? ['Bar'] : ['Bếp'];
                                            return { ...prev, itemType: val, cookingAreas: nextAreas };
                                          });
                                        }}
                                        className="w-full h-8 px-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 text-[13px] text-slate-700 bg-white font-semibold cursor-pointer focus:outline-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <option value="Đồ ăn">Đồ ăn</option>
                                        <option value="Đồ uống">Đồ uống</option>
                                        <option value="Combo">Combo</option>
                                        <option value="Khác">Khác</option>
                                      </select>
                                    ) : (
                                      <span className="font-semibold text-slate-700">{getItemType(dish)}</span>
                                    )}
                                  </td>

                                  {/* Nhóm thực đơn */}
                                  <td className="py-2.5 px-3 text-slate-600 w-[150px] min-w-[150px] max-w-[150px]">
                                    {isEditing && tempEditValues ? (
                                      <input
                                        type="text"
                                        value={tempEditValues.type}
                                        onKeyDown={handleKeyDown}
                                        onChange={e => setTempEditValues(prev => prev ? { ...prev, type: e.target.value } : null)}
                                        className="w-full h-8 px-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 text-[13px] text-slate-700 bg-white focus:outline-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      dish.type || 'Món chính'
                                    )}
                                  </td>

                                  {/* Giá bán */}
                                  <td className="py-2.5 px-3 text-slate-900 font-bold text-right w-[150px] min-w-[150px] max-w-[150px]">
                                    {isEditing && tempEditValues ? (
                                      <input
                                        type="number"
                                        value={tempEditValues.price}
                                        onKeyDown={handleKeyDown}
                                        onChange={e => setTempEditValues(prev => prev ? { ...prev, price: Number(e.target.value) || 0 } : null)}
                                        className="w-full h-8 px-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 text-[13px] font-bold text-slate-900 text-right bg-white focus:outline-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      `${(dish.price || 0).toLocaleString('vi-VN')} đ`
                                    )}
                                  </td>

                                  {/* Chế biến tại */}
                                  <td className="py-2.5 px-3 text-slate-600 w-[180px] min-w-[180px] max-w-[180px]" onClick={(e) => e.stopPropagation()}>
                                    {isEditing && tempEditValues ? (
                                      <CookingAreasSelector
                                        values={tempEditValues.cookingAreas}
                                        kitchenAreas={kitchenAreas}
                                        onChange={updated => setTempEditValues(prev => prev ? { ...prev, cookingAreas: updated } : null)}
                                        onAddArea={handleAddKitchenAreaQuick}
                                        onOpenAddAreaPopup={handleOpenCreateArea}
                                        text13={true}
                                      />
                                    ) : (
                                      (() => {
                                        const areas = getCookingAreas(dish);
                                        return (
                                          <div className="flex items-center gap-1 max-w-[156px] overflow-hidden whitespace-nowrap" title={areas.join(', ')}>
                                            {areas.slice(0, 2).map(area => (
                                              <span
                                                key={area}
                                                className={`px-1.5 py-0.5 rounded text-[12px] font-bold border truncate max-w-[70px] inline-block flex-shrink-0 ${
                                                  area === 'Bar'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                }`}
                                              >
                                                {area}
                                              </span>
                                            ))}
                                            {areas.length > 2 && (
                                              <span className="relative group inline-block flex-shrink-0 select-none">
                                                <span className="text-slate-400 font-bold text-[12px] cursor-help">
                                                  ...
                                                </span>
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[11px] font-medium rounded px-2.5 py-1.5 whitespace-nowrap z-50 shadow-md">
                                                  {areas.slice(2).join(', ')}
                                                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                                </span>
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })()
                                    )}
                                  </td>

                                  {/* Đơn vị tính */}
                                  <td className="py-2.5 px-3 text-slate-600 w-[120px] min-w-[120px] max-w-[120px]">
                                    {isEditing && tempEditValues ? (
                                      <input
                                        type="text"
                                        value={tempEditValues.unit}
                                        onKeyDown={handleKeyDown}
                                        onChange={e => setTempEditValues(prev => prev ? { ...prev, unit: e.target.value } : null)}
                                        className="w-full h-8 px-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 text-[13px] text-slate-700 bg-white focus:outline-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      dish.unit
                                    )}
                                  </td>

                                  {/* Thuế suất */}
                                  <td className="py-2.5 px-3 text-left w-[120px] min-w-[120px] max-w-[120px] text-slate-700 font-semibold text-[13px]">
                                    {isEditing && tempEditValues ? (
                                      <input
                                        type="text"
                                        value={tempEditValues.rateOrGroup}
                                        onKeyDown={handleKeyDown}
                                        onChange={e => setTempEditValues(prev => prev ? { ...prev, rateOrGroup: e.target.value } : null)}
                                        className="w-full h-8 px-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 text-[12px] font-bold text-slate-700 text-left bg-white focus:outline-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      dish.rateOrGroup || '8%'
                                    )}
                                  </td>

                                  {/* Thao tác */}
                                  <td className="py-2.5 pl-3 pr-[20px] text-center" onClick={(e) => e.stopPropagation()}>
                                    {isEditing ? null : (
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditDishPopup(actualIndex)}
                                          className="text-[#2563EB] hover:text-blue-700 hover:bg-blue-50 border-none p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center active:scale-90 select-none"
                                          title="Sửa món"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDish(actualIndex)}
                                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-none p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center active:scale-90 select-none"
                                          title="Xóa món"
                                        >
                                          <Trash className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination for Step 2 */}
                      {filteredMenuItems.length > 0 && (
                        <div className="bg-white border-t border-[#E9EAEB] flex flex-wrap items-center justify-between px-[20px] py-2 md:py-0 min-h-[44px] gap-2 select-none flex-shrink-0">
                          <div className="flex items-center gap-1.5 text-[13px] text-[#475467] font-semibold">
                            <button
                              type="button"
                              disabled={step2Page === 1}
                              onClick={() => setStep2Page(1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                              title="Trang đầu"
                            >
                              <ChevronsLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={step2Page === 1}
                              onClick={() => setStep2Page(prev => Math.max(1, prev - 1))}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                              title="Trang trước"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                            <span className="text-slate-600">Trang</span>
                            <input
                              type="number"
                              min={1}
                              max={Math.max(1, Math.ceil(filteredMenuItems.length / step2PageSize))}
                              value={step2Page}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const maxPages = Math.max(1, Math.ceil(filteredMenuItems.length / step2PageSize));
                                if (!isNaN(val) && val >= 1 && val <= maxPages) {
                                  setStep2Page(val);
                                }
                              }}
                              className="w-12 h-7 rounded-lg border border-slate-300 bg-white text-center font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <span className="text-slate-600">trên {Math.max(1, Math.ceil(filteredMenuItems.length / step2PageSize))}</span>

                            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                            <button
                              type="button"
                              disabled={step2Page === Math.max(1, Math.ceil(filteredMenuItems.length / step2PageSize))}
                              onClick={() => setStep2Page(prev => Math.min(Math.max(1, Math.ceil(filteredMenuItems.length / step2PageSize)), prev + 1))}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                              title="Trang sau"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={step2Page === Math.max(1, Math.ceil(filteredMenuItems.length / step2PageSize))}
                              onClick={() => setStep2Page(Math.max(1, Math.ceil(filteredMenuItems.length / step2PageSize)))}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                              title="Trang cuối"
                            >
                              <ChevronsRight className="w-4 h-4" />
                            </button>

                            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                            <button
                              type="button"
                              onClick={() => {
                                setStep2Page(1);
                                setFilterName('');
                                setFilterCode('');
                                setFilterGroup('');
                                setFilterItemType('');
                                setFilterCookingArea('');
                                setFilterUnit('');
                                setFilterPriceVal('');
                                setFilterTax('');
                                onNotification("Đã tải lại và xoá bộ lọc danh sách!", "success");
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 cursor-pointer transition-colors border border-transparent"
                              title="Tải lại và xoá bộ lọc"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>

                            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                            <div className="relative">
                              <select
                                value={step2PageSize}
                                onChange={(e) => {
                                  const size = parseInt(e.target.value);
                                  setStep2PageSize(size);
                                  setStep2Page(1);
                                }}
                                className="h-7 pl-2 pr-6 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none"
                              >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                              </select>
                              <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          <div className="text-[13px] text-[#475467] font-semibold">
                            Hiển thị {filteredMenuItems.length === 0 ? 0 : (step2Page - 1) * step2PageSize + 1} – {Math.min(filteredMenuItems.length, step2Page * step2PageSize)} trên {filteredMenuItems.length} kết quả
                          </div>
                        </div>
                      )}
                      </div>
                    </div>
                  )}

                  {/* POPUP MODAL FOR EXCEL FLOW */}
                  {activeFlow === 'excel' && (
                    <div 
                      className={`fixed top-0 left-0 bottom-0 bg-black/60 backdrop-blur-xs z-[9500] flex items-center justify-center p-4 animate-fade-in ${
                        isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
                      }`}
                      onClick={() => setActiveFlow(null)}
                    >
                      <div 
                        className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col border border-slate-200 overflow-hidden animate-scale-up text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 bg-white border-b border-[#E9EAEB] text-[#101828] flex-shrink-0" style={{ height: "48px" }}>
                          <h3 className="font-bold text-[15px] text-[#101828] font-sans">
                            Nhập khẩu thực đơn từ Excel
                          </h3>
                          <button
                            type="button"
                            onClick={() => setActiveFlow(null)}
                            className="text-[#717680] hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 text-left">
                          <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-4 rounded-lg">
                            <span className="text-[20px] mt-0.5">📋</span>
                            <p className="text-[13px] text-slate-600 leading-normal font-medium">
                              <strong>Nhập khẩu thực đơn từ Excel.</strong> Thích hợp khi quý khách đã có sẵn danh sách thực đơn từ các file excel cũ hoặc phần mềm khác.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] font-bold text-slate-700">Tải lên tệp dữ liệu thực đơn</span>
                              <button 
                                type="button"
                                onClick={() => onNotification("Đang tải xuống file mẫu thuc_don_the_gioi_hai_san.xlsx...", "info")}
                                className="text-[13px] font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1"
                              >
                                Tải file mẫu .xlsx
                              </button>
                            </div>

                            <div 
                              onClick={() => setExcelFileSelected(true)}
                              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                                excelFileSelected ? 'border-emerald-400 bg-emerald-50/25' : 'border-slate-300 hover:border-[#2563EB] bg-slate-50/30'
                              }`}
                            >
                              {excelFileSelected ? (
                                <div className="space-y-2">
                                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                    <Check className="w-5 h-5 stroke-[3]" />
                                  </div>
                                  <span className="text-[13px] font-bold text-slate-800 block">anh_chụp_menu_nha_hang_Phong_De.xlsx</span>
                                  <span className="text-[12px] text-slate-500 font-semibold">Đã nạp file thành công • {VUON_BIA_DISHES.length} món ăn mẫu</span>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="text-3xl text-slate-400">📊</div>
                                  <span className="text-[13px] font-bold text-slate-700 block">Kéo thả tệp hoặc click để chọn file thực đơn</span>
                                  <p className="text-[12px] text-slate-400 font-medium">Định dạng hỗ trợ: .xlsx, .xls</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setActiveFlow(null)}
                            className="h-[32px] min-w-[84px] px-4 bg-white border border-[#D5D7DA] hover:bg-gray-50 text-[#101828] font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            disabled={!excelFileSelected || isImporting}
                            onClick={handleExcelImportRun}
                            className={`h-[32px] min-w-[120px] px-4 border-none text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans shadow-sm ${
                              excelFileSelected && !isImporting ? 'bg-[#245FDF] hover:bg-[#1B4EBA]' : 'bg-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {isImporting ? 'Đang đồng bộ...' : 'Đồng bộ thực đơn'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* POPUP MODAL FOR AVA AI FLOW */}
                  {activeFlow === 'ava' && (
                    <div 
                      className={`fixed top-0 left-0 bottom-0 bg-black/60 backdrop-blur-xs z-[9500] flex items-center justify-center p-4 animate-fade-in ${
                        isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
                      }`}
                      onClick={() => setActiveFlow(null)}
                    >
                      <div 
                        className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col border border-slate-200 overflow-hidden animate-scale-up text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 bg-white border-b border-[#E9EAEB] text-[#101828] flex-shrink-0" style={{ height: "48px" }}>
                          <h3 className="font-bold text-[15px] text-[#101828] font-sans">
                            Tạo thực đơn thông minh bằng MISA AVA
                          </h3>
                          <button
                            type="button"
                            onClick={() => setActiveFlow(null)}
                            className="text-[#717680] hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 text-left">
                          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                            <span className="text-[20px] mt-0.5">✨</span>
                            <p className="text-[13px] text-emerald-950 leading-normal font-medium">
                              <strong>Trợ lý MISA AVA.</strong> Chỉ cần tải lên ảnh chụp cuốn thực đơn giấy, AI sẽ tự động đọc, trích xuất danh sách món, loại món, đơn vị tính và giá bán nhanh chóng.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] font-bold text-slate-700">Tải ảnh chụp thực đơn của bạn</span>
                            </div>

                            <div 
                              onClick={() => setMenuImageSelected(true)}
                              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                                menuImageSelected ? 'border-emerald-400 bg-emerald-50/25' : 'border-slate-300 hover:border-[#2563EB] bg-slate-50/30'
                              }`}
                            >
                              {menuImageSelected ? (
                                <div className="space-y-2">
                                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                    <Check className="w-5 h-5 stroke-[3]" />
                                  </div>
                                  <span className="text-[13px] font-bold text-slate-800 block">anh_chụp_menu_nha_hang_Phong_De.png</span>
                                  <span className="text-[12px] text-slate-500 font-semibold">Đã nạp ảnh thành công • {VUON_BIA_DISHES.length} món ăn mẫu</span>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="text-3xl text-slate-400">📸</div>
                                  <span className="text-[13px] font-bold text-slate-700 block">Kéo thả hình ảnh thực đơn hoặc click để chọn ảnh</span>
                                  <p className="text-[12px] text-slate-400 font-medium">Định dạng hỗ trợ: JPG, PNG, WEBP</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setActiveFlow(null)}
                            className="h-[32px] min-w-[84px] px-4 bg-white border border-[#D5D7DA] hover:bg-gray-50 text-[#101828] font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            disabled={!menuImageSelected || isScanning}
                            onClick={handleAvaExtractRun}
                            className={`h-[32px] min-w-[120px] px-4 border-none text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans shadow-sm ${
                              menuImageSelected && !isScanning ? 'bg-[#245FDF] hover:bg-[#1B4EBA]' : 'bg-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {isScanning ? 'Đang quét...' : 'Quét ảnh & Trích xuất'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* POPUP MODAL FOR MANUAL ENTRY FLOW */}
                  {activeFlow === 'manual' && (
                    <div 
                      className={`fixed top-0 left-0 bottom-0 bg-black/60 backdrop-blur-xs z-[9500] flex items-center justify-center p-4 animate-fade-in ${
                        isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
                      }`}
                      onClick={() => setActiveFlow(null)}
                    >
                      <div 
                        className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col border border-slate-200 overflow-hidden animate-scale-up text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 bg-white border-b border-[#E9EAEB] text-[#101828] flex-shrink-0" style={{ height: "48px" }}>
                          <h3 className="font-bold text-[15px] text-[#101828] font-sans">
                            Thêm mới thực đơn trực tiếp
                          </h3>
                          <button
                            type="button"
                            onClick={() => setActiveFlow(null)}
                            className="text-[#717680] hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4 text-left">
                          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg">
                            <span className="text-[20px] mt-0.5">✍️</span>
                            <p className="text-[13px] text-amber-950 leading-normal font-medium">
                              <strong>Thêm mới trực tiếp trên phần mềm.</strong> Quý khách có thể khởi tạo nhanh danh sách món ăn mẫu của nhà hàng hoặc bắt đầu tự thêm mới thủ công từng món.
                            </p>
                          </div>

                          <div className="space-y-3 pt-2">
                            {/* Method 1: Prepopulate */}
                            <div 
                              onClick={() => {
                                handleManualEntryInit();
                              }}
                              className="group border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/15 p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 text-left"
                            >
                              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0 mt-0.5">
                                <Sparkles className="w-4.5 h-4.5" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-slate-800 font-bold text-[13px] group-hover:text-[#2563EB] transition-colors">
                                  Cách A: Khởi tạo nhanh {VUON_BIA_DISHES.length} món ăn mẫu chuẩn
                                </h4>
                                <p className="text-slate-500 text-[12px] font-medium leading-relaxed">
                                  Nạp sẵn danh mục {VUON_BIA_DISHES.length} món ăn chuẩn phong cách Nhà hàng Phong Dê để thử nghiệm đầy đủ các tính năng đặt bàn, gọi món và báo cáo doanh thu.
                                </p>
                              </div>
                            </div>

                            {/* Method 2: Blank Start */}
                            <div 
                              onClick={() => {
                                setMenuItems([]);
                                localStorage.setItem('cukcuk_menu_items', JSON.stringify([]));
                                setActiveFlow(null);
                                setIsAddDishPopupOpen(true);
                                onNotification('✍️ Đã mở form tự thêm mới món ăn thủ công!', 'success');
                              }}
                              className="group border border-slate-200 hover:border-[#2563EB] hover:bg-emerald-50/10 p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 text-left"
                            >
                              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors flex-shrink-0 mt-0.5">
                                <Plus className="w-4.5 h-4.5" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-slate-800 font-bold text-[13px] group-hover:text-emerald-600 transition-colors">
                                  Cách B: Tự thêm tay thủ công từng món
                                </h4>
                                <p className="text-slate-500 text-[12px] font-medium leading-relaxed">
                                  Bắt đầu với một thực đơn trống và tự mình gõ thêm mới từng món ăn theo nhu cầu cụ thể của quán.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setActiveFlow(null)}
                            className="h-[32px] min-w-[84px] px-4 bg-white border border-[#D5D7DA] hover:bg-gray-50 text-[#101828] font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans"
                          >
                            Quay lại
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FORM CHỌN MÓN POPUP MODAL */}
                  {isAddDishPopupOpen && (
                    <div className={`fixed top-0 left-0 bottom-0 bg-black/60 z-[9999] flex items-center justify-center p-4 animate-fade-in select-none ${
                      isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
                    }`}>
                      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl h-[520px] flex flex-col border border-slate-200 overflow-hidden animate-scale-up text-slate-800">
                        {/* Title Bar */}
                        <div className="bg-white border-b border-slate-200 text-slate-900 px-6 py-4 flex justify-between items-center flex-shrink-0 select-none shadow-xs">
                          <h3 className="font-sans font-bold text-[16px] text-slate-950">
                            {editingDishIndex !== null ? 'Sửa món' : 'Thêm món'}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsAddDishPopupOpen(false)}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Đóng"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={(e) => { e.preventDefault(); handleAddCustomDish(false); }} className="flex-1 flex flex-col overflow-hidden bg-white">
                          <div className="flex-1 overflow-y-auto p-6 flex flex-col text-left">
                            {/* Inputs */}
                            <div className="space-y-4">
                              {/* Tên món */}
                              <div className="flex items-center">
                                <label className="w-[130px] text-[13px] font-sans font-bold text-[#101828] select-none flex-shrink-0">
                                  Tên món <span className="text-red-500">(*)</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={newDishName}
                                  onChange={(e) => setNewDishName(e.target.value)}
                                  placeholder="VD: Ba chỉ bò Mỹ"
                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans font-semibold outline-hidden transition-all"
                                />
                              </div>

                              {/* Mã món */}
                              <div className="flex items-center">
                                <label className="w-[130px] text-[13px] font-sans font-bold text-[#101828] select-none flex-shrink-0">
                                  Mã món <span className="text-red-500">(*)</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={newDishCode}
                                  onChange={(e) => setNewDishCode(e.target.value)}
                                  placeholder="VD: MA01"
                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans font-semibold outline-hidden transition-all"
                                />
                              </div>

                              {/* Loại món / Nhóm thực đơn */}
                              <div className="flex items-center">
                                <label className="w-[130px] text-[13px] font-sans font-bold text-[#101828] select-none flex-shrink-0">
                                  Nhóm thực đơn
                                </label>
                                <select
                                  value={newDishType}
                                  onChange={(e) => setNewDishType(e.target.value)}
                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-hidden transition-all cursor-pointer font-bold"
                                >
                                  <option value="Món chính">Món chính</option>
                                  <option value="Khai vị">Khai vị</option>
                                  <option value="Lẩu">Lẩu</option>
                                  <option value="Bia & Đồ uống">Bia & Đồ uống</option>
                                </select>
                              </div>

                              {/* Loại món */}
                              <div className="flex items-center">
                                <label className="w-[130px] text-[13px] font-sans font-bold text-[#101828] select-none flex-shrink-0">
                                  Loại món
                                </label>
                                <select
                                  value={newDishItemType}
                                  onChange={(e) => {
                                    setNewDishItemType(e.target.value);
                                    if (e.target.value === 'Đồ uống') {
                                      setNewDishCookingAreas(['Bar']);
                                    } else {
                                      setNewDishCookingAreas(['Bếp']);
                                    }
                                  }}
                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-hidden transition-all cursor-pointer font-bold"
                                >
                                  <option value="Đồ ăn">Đồ ăn</option>
                                  <option value="Đồ uống">Đồ uống</option>
                                  <option value="Combo">Combo</option>
                                  <option value="Khác">Khác</option>
                                </select>
                              </div>

                              {/* Chế biến tại */}
                              <div className="flex items-center">
                                <label className="w-[130px] text-[13px] font-sans font-bold text-[#101828] select-none flex-shrink-0">
                                  Chế biến tại
                                </label>
                                <div className="flex-1">
                                  <CookingAreasSelector
                                    values={newDishCookingAreas}
                                    kitchenAreas={kitchenAreas}
                                    onChange={(updated) => setNewDishCookingAreas(updated)}
                                    onAddArea={handleAddKitchenAreaQuick}
                                    onOpenAddAreaPopup={handleOpenCreateArea}
                                    text13={true}
                                  />
                                </div>
                              </div>

                              {/* Đơn vị tính */}
                              <div className="flex items-center">
                                <label className="w-[130px] text-[13px] font-sans font-bold text-[#101828] select-none flex-shrink-0">
                                  Đơn vị tính <span className="text-red-500">(*)</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={newDishUnit}
                                  onChange={(e) => setNewDishUnit(e.target.value)}
                                  placeholder="VD: Đĩa, Ly, Chai..."
                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans font-semibold outline-hidden transition-all"
                                />
                              </div>

                              {/* Đơn giá bán */}
                              <div className="flex items-center">
                                <label className="w-[130px] text-[13px] font-sans font-bold text-[#101828] select-none flex-shrink-0">
                                  Đơn giá bán (đ) <span className="text-red-500">(*)</span>
                                </label>
                                <input
                                  type="number"
                                  required
                                  value={newDishPrice}
                                  onChange={(e) => setNewDishPrice(Number(e.target.value) || 0)}
                                  placeholder="Đơn giá"
                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans font-bold text-left outline-hidden transition-all"
                                />
                              </div>

                              {/* Thuế suất */}
                              <div className="flex items-center">
                                <label className="w-[130px] text-[13px] font-sans font-bold text-[#101828] select-none flex-shrink-0">
                                  Thuế suất GTGT
                                </label>
                                <select
                                  value={newDishTax}
                                  onChange={(e) => setNewDishTax(e.target.value)}
                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-hidden transition-all cursor-pointer font-bold"
                                >
                                  <option value="8%">8% (Giảm thuế)</option>
                                  <option value="10%">10% (Chuẩn)</option>
                                  <option value="5%">5%</option>
                                  <option value="KTS">KTS (Không thuế)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end items-center gap-2.5 flex-shrink-0 rounded-b-xl">
                            <button
                              type="button"
                              onClick={() => setIsAddDishPopupOpen(false)}
                              className="h-[32px] min-w-[84px] px-4 bg-white border border-[#D5D7DA] hover:bg-gray-50 text-[#101828] font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans"
                            >
                              Hủy bỏ
                            </button>

                            {editingDishIndex !== null ? (
                              <button
                                type="submit"
                                className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans shadow-sm active:scale-95"
                              >
                                Lưu
                              </button>
                            ) : (
                              /* Combo Button: Lưu & Lưu và Thêm */
                              <div className="relative flex items-center">
                                <button
                                  type="submit"
                                  className="h-[32px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-l-[8px] flex items-center justify-center transition-all cursor-pointer font-sans shadow-sm active:scale-95 border-r border-[#1B4EBA]"
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsStep2SaveDropdownOpen(!isStep2SaveDropdownOpen);
                                  }}
                                  className="h-[32px] px-2.5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-r-[8px] flex items-center justify-center transition-all cursor-pointer font-sans shadow-sm active:scale-95"
                                  title="Thêm lựa chọn"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>

                                {isStep2SaveDropdownOpen && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-40 bg-transparent" 
                                      onClick={() => setIsStep2SaveDropdownOpen(false)} 
                                    />
                                    <div className="absolute right-0 bottom-full mb-2 bg-white border border-[#E9EAEB] rounded-lg shadow-md z-50 py-1 min-w-[130px] animate-fade-in text-left">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setIsStep2SaveDropdownOpen(false);
                                          handleAddCustomDish(true);
                                        }}
                                        className="w-full text-left px-3.5 py-2 text-[13px] text-[#101828] hover:bg-[#F9FAFB] font-semibold transition-colors cursor-pointer"
                                      >
                                        Lưu và thêm
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {isBulkEditPopupOpen && (
                    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/60 z-[9999] flex items-center justify-center p-4 animate-fade-in select-none">
                      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[620px] max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden animate-scale-up text-slate-800">
                        {/* Title Bar */}
                        <div className="bg-white border-b border-slate-200 text-slate-900 px-6 py-4 flex justify-between items-center flex-shrink-0 select-none shadow-xs">
                          <div>
                            <h3 className="font-sans font-bold text-[16px] text-slate-950">
                              Sửa thông tin hàng loạt
                            </h3>
                            <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                              {selectedDishIndexes.length > 0 ? (
                                <>Đang áp dụng thay đổi cho <strong className="text-blue-600">{selectedDishIndexes.length} món ăn</strong> đã chọn.</>
                              ) : (
                                <>Đang áp dụng thay đổi cho <strong className="text-emerald-600">tất cả {menuItems.length} món ăn</strong> trong thực đơn.</>
                              )}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsBulkEditPopupOpen(false)}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Đóng"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Fields List */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-left">
                          
                          {/* 1. Tên món */}
                          <div className="flex items-center gap-4 py-1">
                            <label className="text-[13px] font-bold text-slate-700 w-[140px] flex-shrink-0">
                              Tên món ăn
                            </label>
                            <input
                              type="text"
                              value={bulkEditValues.name}
                              onChange={(e) => {
                                setBulkEditValues(prev => ({ ...prev, name: e.target.value }));
                                setBulkEditEnabled(prev => ({ ...prev, name: true }));
                              }}
                              placeholder="Nhập tên món ăn mới để thay đổi..."
                              className="flex-1 h-[36px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] text-[#101828] text-[13px] font-sans font-semibold rounded-lg outline-hidden transition-all placeholder:text-slate-400 placeholder:font-medium bg-white"
                            />
                          </div>

                          {/* 2. Nhóm thực đơn */}
                          <div className="flex items-center gap-4 py-1">
                            <label className="text-[13px] font-bold text-slate-700 w-[140px] flex-shrink-0">
                              Nhóm thực đơn
                            </label>
                            <input
                              type="text"
                              value={bulkEditValues.type}
                              onChange={(e) => {
                                setBulkEditValues(prev => ({ ...prev, type: e.target.value }));
                                setBulkEditEnabled(prev => ({ ...prev, type: true }));
                              }}
                              placeholder="VD: Khai vị, Lẩu, Hải sản..."
                              className="flex-1 h-[36px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] text-[#101828] text-[13px] font-sans font-semibold rounded-lg outline-hidden transition-all placeholder:text-slate-400 placeholder:font-medium bg-white"
                            />
                          </div>

                          {/* 3. Loại món */}
                          <div className="flex items-center gap-4 py-1">
                            <label className="text-[13px] font-bold text-slate-700 w-[140px] flex-shrink-0">
                              Loại món
                            </label>
                            <select
                              value={bulkEditValues.itemType}
                              onChange={(e) => {
                                setBulkEditValues(prev => ({ ...prev, itemType: e.target.value }));
                                setBulkEditEnabled(prev => ({ ...prev, itemType: true }));
                              }}
                              className="flex-1 h-[36px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] text-[#101828] text-[13px] font-sans font-semibold rounded-lg outline-hidden transition-all cursor-pointer bg-white"
                            >
                              <option value="Đồ ăn">Đồ ăn</option>
                              <option value="Đồ uống">Đồ uống</option>
                              <option value="Combo">Combo</option>
                              <option value="Khác">Khác</option>
                            </select>
                          </div>

                          {/* 4. Chế biến tại */}
                          <div className="flex items-center gap-4 py-1">
                            <label className="text-[13px] font-bold text-slate-700 w-[140px] flex-shrink-0">
                              Chế biến tại
                            </label>
                            <div className="flex-1">
                              <CookingAreasSelector
                                values={bulkEditValues.cookingAreas}
                                kitchenAreas={kitchenAreas}
                                onChange={(updated) => {
                                  setBulkEditValues(prev => ({ ...prev, cookingAreas: updated }));
                                  setBulkEditEnabled(prev => ({ ...prev, cookingAreas: true }));
                                }}
                                onAddArea={handleAddKitchenAreaQuick}
                                onOpenAddAreaPopup={handleOpenCreateArea}
                                large={true}
                              />
                            </div>
                          </div>

                          {/* 5. Đơn vị tính */}
                          <div className="flex items-center gap-4 py-1">
                            <label className="text-[13px] font-bold text-slate-700 w-[140px] flex-shrink-0">
                              Đơn vị tính
                            </label>
                            <input
                              type="text"
                              value={bulkEditValues.unit}
                              onChange={(e) => {
                                setBulkEditValues(prev => ({ ...prev, unit: e.target.value }));
                                setBulkEditEnabled(prev => ({ ...prev, unit: true }));
                              }}
                              placeholder="VD: Đĩa, Ly, Chai, Cái..."
                              className="flex-1 h-[36px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] text-[#101828] text-[13px] font-sans font-semibold rounded-lg outline-hidden transition-all placeholder:text-slate-400 placeholder:font-medium bg-white"
                            />
                          </div>

                          {/* 6. Giá bán */}
                          <div className="flex items-center gap-4 py-1">
                            <label className="text-[13px] font-bold text-slate-700 w-[140px] flex-shrink-0">
                              Đơn giá bán (đ)
                            </label>
                            <input
                              type="number"
                              value={bulkEditValues.price || ''}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setBulkEditValues(prev => ({ ...prev, price: val }));
                                setBulkEditEnabled(prev => ({ ...prev, price: true }));
                              }}
                              placeholder="Nhập đơn giá bán mới..."
                              className="flex-1 h-[36px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] text-[#101828] text-[13px] font-sans font-bold rounded-lg outline-hidden transition-all text-right placeholder:text-slate-400 placeholder:font-medium placeholder:text-left bg-white"
                            />
                          </div>

                          {/* 7. Thuế suất */}
                          <div className="flex items-center gap-4 py-1">
                            <label className="text-[13px] font-bold text-slate-700 w-[140px] flex-shrink-0">
                              Thuế suất GTGT
                            </label>
                            <select
                              value={bulkEditValues.rateOrGroup}
                              onChange={(e) => {
                                setBulkEditValues(prev => ({ ...prev, rateOrGroup: e.target.value }));
                                setBulkEditEnabled(prev => ({ ...prev, rateOrGroup: true }));
                              }}
                              className="flex-1 h-[36px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] text-[#101828] text-[13px] font-sans font-bold rounded-lg outline-hidden transition-all cursor-pointer bg-white"
                            >
                              <option value="8%">8% (Giảm thuế)</option>
                              <option value="10%">10% (Chuẩn)</option>
                              <option value="5%">5%</option>
                              <option value="KTS">KTS (Không thuế)</option>
                            </select>
                          </div>

                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end items-center gap-3 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsBulkEditPopupOpen(false)}
                            className="h-[34px] px-4 bg-white border border-[#D5D7DA] hover:bg-gray-50 text-[#101828] font-bold text-[13px] rounded-[4px] flex items-center justify-center transition-all cursor-pointer font-sans"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            onClick={handleApplyBulkEdit}
                            disabled={!Object.values(bulkEditEnabled).some(Boolean)}
                            className="h-[34px] px-5 bg-[#245FDF] hover:bg-[#1B4EBA] disabled:bg-slate-200 disabled:text-slate-400 disabled:border-transparent disabled:cursor-not-allowed text-white font-bold text-[13px] rounded-[4px] flex items-center justify-center transition-all cursor-pointer font-sans shadow-sm active:scale-95"
                          >
                            Áp dụng thay đổi
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* REMOVED PREVIOUS TABS AND CONTENT BLOCKS */}
              {false && activeModalStep === 2 && (
                <div className="hidden">
                  <div className="flex border-b border-slate-200 mb-4 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setStep2Tab('excel')}
                      className={`flex-1 py-2.5 text-[13px] font-bold border-b-2 text-center transition-colors cursor-pointer ${
                        step2Tab === 'excel' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      📂 Nhập khẩu từ Excel
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep2Tab('ava')}
                      className={`flex-1 py-2.5 text-[13px] font-bold border-b-2 text-center transition-colors cursor-pointer ${
                        step2Tab === 'ava' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      📸 Tạo từ hình ảnh (MISA AVA)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep2Tab('manual')}
                      className={`flex-1 py-2.5 text-[13px] font-bold border-b-2 text-center transition-colors cursor-pointer ${
                        step2Tab === 'manual' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      ✍️ Thêm trực tiếp trên phần mềm
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1 min-h-[300px]">
                    {/* TAB EXCEL */}
                    {step2Tab === 'excel' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                          <span className="text-[20px]">📋</span>
                          <p className="text-[13px] text-slate-600 leading-normal font-medium">
                            <strong>Cách 1: Nhập khẩu từ Excel.</strong> Thích hợp khi có sẵn danh sách thực đơn món ăn từ file Excel cũ hoặc file quản lý nội bộ.
                          </p>
                        </div>

                        {/* Step Tracker removed */}

                        {excelStepSub === 1 && (
                          <div className="space-y-4 py-2 animate-fade-in">
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] font-bold text-slate-700">Tải lên tệp dữ liệu thực đơn</span>
                              <button 
                                onClick={() => onNotification("Đang tải xuống file Excel thực đơn mẫu...", "info")}
                                className="text-[13px] font-bold text-[#2563EB] hover:underline"
                              >
                                📥 Tải file mẫu .xlsx
                              </button>
                            </div>

                            <div 
                              onClick={() => setExcelFileSelected(true)}
                              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                                excelFileSelected ? 'border-emerald-400 bg-emerald-50/25' : 'border-slate-300 hover:border-[#2563EB] bg-slate-50/30'
                              }`}
                            >
                              {excelFileSelected ? (
                                <div className="space-y-2">
                                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                    <Check className="w-5 h-5 stroke-[3]" />
                                  </div>
                                  <span className="text-[13px] font-bold text-slate-800 block">anh_chụp_menu_nha_hang_Phong_De.xlsx</span>
                                  <span className="text-[13px] text-slate-500 font-semibold">Đã tải lên tệp mẫu • 42KB</span>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="text-3xl text-slate-400">📊</div>
                                  <span className="text-[13px] font-bold text-slate-700 block">Kéo thả tệp hoặc click để chọn file thực đơn</span>
                                  <p className="text-[13px] text-slate-400 font-medium">Định dạng hỗ trợ: .xlsx, .xls</p>
                                </div>
                              )}
                            </div>

                            {excelFileSelected && (
                              <button
                                type="button"
                                onClick={() => setExcelStepSub(2)}
                                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[13px] py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                Tiếp tục sang bước tiếp theo
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}

                        {excelStepSub === 2 && (
                          <div className="space-y-4 py-2 animate-fade-in">
                            <span className="text-[13px] font-bold text-slate-700 block">Kiểm tra ánh xạ thông tin (Bản xem trước)</span>
                            <div className="border border-slate-200 rounded-lg overflow-hidden text-[13px] max-h-36 overflow-y-auto">
                              <table className="w-full text-left divide-y divide-slate-100">
                                <thead className="bg-slate-50 text-slate-500 font-semibold">
                                  <tr>
                                    <th className="p-2">Tên món</th>
                                    <th className="p-2">Mã món</th>
                                    <th className="p-2">Đơn giá</th>
                                    <th className="p-2">Thuế suất / Nhóm</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-150 font-medium">
                                  <tr>
                                    <td className="p-2">Phở xào bò</td>
                                    <td className="p-2">E01</td>
                                    <td className="p-2">65,000đ</td>
                                    <td className="p-2">8%</td>
                                  </tr>
                                  <tr>
                                    <td className="p-2">Phở bò tái lăn</td>
                                    <td className="p-2">E02</td>
                                    <td className="p-2">50,000đ</td>
                                    <td className="p-2">8%</td>
                                  </tr>
                                  <tr>
                                    <td className="p-2">Nước hột gà</td>
                                    <td className="p-2">E03</td>
                                    <td className="p-2">8,000đ</td>
                                    <td className="p-2">5%</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="flex justify-between gap-3 mt-4">
                              <button
                                type="button"
                                onClick={() => setExcelStepSub(1)}
                                className="px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-250 cursor-pointer"
                              >
                                Quay lại
                              </button>
                              <button
                                type="button"
                                onClick={handleExcelImportRun}
                                className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[13px] py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                {isImporting ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    Đang đồng bộ thực đơn...
                                  </>
                                ) : (
                                  'Thực hiện đồng bộ'
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {excelStepSub === 3 && (
                          <div className="space-y-4 py-4 text-center animate-fade-in flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">Hoàn thành nhập khẩu Excel!</h4>
                              <p className="text-[13px] text-slate-500 mt-1 leading-normal">
                                CukCuk đã đồng bộ thành công danh sách món ăn từ file Excel vào thực đơn nhà hàng.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => completeStepAndGoNext(2)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] py-2.5 rounded-lg cursor-pointer transition-colors"
                            >
                              Tiếp tục
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB AVA IMAGE */}
                    {step2Tab === 'ava' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 p-3 rounded-lg">
                          <span className="text-[20px]">✨</span>
                          <p className="text-[13px] text-indigo-950 leading-normal font-medium">
                            <strong>Cách 2: Tạo từ hình ảnh bằng MISA AVA.</strong> Chụp ảnh menu giấy hoặc tải ảnh chụp thực đơn lên, AVA sẽ nhận diện, tạo tên, đơn vị tính và giá bán tự động.
                          </p>
                        </div>

                        {/* Steps Subtracker removed */}

                        {avaStepSub === 1 && (
                          <div className="space-y-4 py-2 animate-fade-in">
                            <span className="text-[13px] font-bold text-slate-700 block">Tải ảnh chụp menu thực đơn</span>
                            <div 
                              onClick={() => setMenuImageSelected(true)}
                              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                                menuImageSelected ? 'border-indigo-400 bg-indigo-50/25' : 'border-slate-300 hover:border-indigo-500 bg-slate-50/30'
                              }`}
                            >
                              {menuImageSelected ? (
                                <div className="space-y-2">
                                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto text-indigo-600 overflow-hidden relative">
                                    <img 
                                      src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=27a8e564-f87d-449a-b620-fef9e2113373.png&isTemp=true&tenantCode=misa" 
                                      alt="Preview" 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="text-[13px] font-bold text-slate-800 block">menu_giay_pho_phu_gia.jpg</span>
                                  <span className="text-[13px] text-slate-500 font-semibold">Đã tải lên tệp ảnh • 1.2MB</span>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="text-3xl text-slate-400">📸</div>
                                  <span className="text-[13px] font-bold text-slate-700 block">Click để chọn hoặc kéo thả ảnh chụp thực đơn</span>
                                  <p className="text-[13px] text-slate-400 font-medium">Định dạng hỗ trợ: JPEG, PNG, WEBP</p>
                                </div>
                              )}
                            </div>

                            {menuImageSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAvaStepSub(2);
                                  handleAvaExtractRun();
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                🚀 Nhấn Tạo thực đơn
                              </button>
                            )}
                          </div>
                        )}

                        {avaStepSub === 2 && (
                          <div className="py-8 text-center animate-fade-in flex flex-col items-center justify-center space-y-4">
                            <div className="relative w-16 h-16 rounded-full border border-indigo-100 flex items-center justify-center bg-indigo-50/50">
                              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                              <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-pulse" />
                            </div>
                            <div>
                              <h4 className="text-[13px] font-bold text-indigo-950">MISA AVA đang đọc và trích xuất thực đơn...</h4>
                              <p className="text-[13px] text-slate-500 mt-1">Sử dụng mô hình AI nhận diện văn bản OCR và xử lý thông tin thực đơn tự động.</p>
                            </div>
                          </div>
                        )}

                        {avaStepSub === 3 && (
                          <div className="space-y-4 py-2 animate-fade-in">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] font-bold text-slate-700 block">Cập nhật thông tin thực đơn (Kết quả từ AI AVA)</span>
                              <span className="text-[13px] font-semibold text-emerald-600">✨ Trích xuất thành công 4 món</span>
                            </div>

                            <div className="border border-slate-200 rounded-lg overflow-hidden text-[13px] max-h-48 overflow-y-auto">
                              <table className="w-full text-left divide-y divide-slate-100">
                                <thead className="bg-slate-50 text-slate-500 font-semibold">
                                  <tr>
                                    <th className="p-2">Tên món</th>
                                    <th className="p-2 w-20">Mã món</th>
                                    <th className="p-2 w-16">ĐVT</th>
                                    <th className="p-2 w-24">Đơn giá</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-150 font-medium">
                                  {extractedDishes.map((dish, i) => (
                                    <tr key={i}>
                                      <td className="p-1.5">
                                        <input 
                                          type="text" 
                                          value={dish.name} 
                                          onChange={(e) => {
                                            const updated = [...extractedDishes];
                                            updated[i].name = e.target.value;
                                            setExtractedDishes(updated);
                                          }}
                                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-[13px] outline-hidden focus:border-blue-500"
                                        />
                                      </td>
                                      <td className="p-1.5">
                                        <input 
                                          type="text" 
                                          value={dish.code} 
                                          onChange={(e) => {
                                            const updated = [...extractedDishes];
                                            updated[i].code = e.target.value;
                                            setExtractedDishes(updated);
                                          }}
                                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-[13px] outline-hidden focus:border-blue-500"
                                        />
                                      </td>
                                      <td className="p-1.5">
                                        <input 
                                          type="text" 
                                          value={dish.unit} 
                                          onChange={(e) => {
                                            const updated = [...extractedDishes];
                                            updated[i].unit = e.target.value;
                                            setExtractedDishes(updated);
                                          }}
                                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-[13px] outline-hidden focus:border-blue-500"
                                        />
                                      </td>
                                      <td className="p-1.5">
                                        <input 
                                          type="number" 
                                          value={dish.price} 
                                          onChange={(e) => {
                                            const updated = [...extractedDishes];
                                            updated[i].price = Number(e.target.value);
                                            setExtractedDishes(updated);
                                          }}
                                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-[13px] outline-hidden focus:border-blue-500"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="flex justify-between gap-3 mt-4">
                              <button
                                type="button"
                                onClick={() => setAvaStepSub(1)}
                                className="px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-250 cursor-pointer"
                              >
                                Quay lại tải ảnh
                              </button>
                              <button
                                type="button"
                                onClick={handleAvaSave}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Nhấn Lưu thực đơn
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB MANUAL ENTRY */}
                    {step2Tab === 'manual' && (
                      <div className="space-y-4 py-3">
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <span className="text-[20px]">✍️</span>
                          <p className="text-[13px] text-blue-950 leading-normal font-medium">
                            <strong>Cách 3: Thêm trực tiếp trên phần mềm.</strong> Hệ thống sẽ chuyển bạn sang trang quản lý danh mục thực đơn đầy đủ với form nhập, nhóm thực đơn, định lượng nguyên vật liệu đầy đủ.
                          </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 text-slate-600 text-[13px] leading-relaxed font-semibold">
                          <p className="text-[13px] font-bold text-slate-800">Các bước sẽ thực hiện:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Bước 1: Nhập Tên món</li>
                            <li>Bước 2: Nhập Mã món</li>
                            <li>Bước 3: Chọn Đơn vị tính</li>
                            <li>Bước 4: Nhập giá bán</li>
                            <li>
                              Bước 5: {taxMethod === 'truc_tiep' 
                                ? 'Chọn Nhóm ngành nghề (đối với phương pháp Trực tiếp doanh thu)' 
                                : 'Chọn Thuế suất (đối với phương pháp Khấu trừ áp dụng nhiều thuế suất)'}
                            </li>
                            <li>Bước 6: Nhấn Lưu</li>
                          </ol>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId('thuc-don');
                            onNotification('🚀 Đã chuyển sang phân hệ Thực đơn chính!', 'success');
                            changeModalStep(null);
                          }}
                          className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[13px] py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          Chuyển hướng sang danh mục Thực đơn
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeModalStep === 3 && (
                <div className="flex-1 flex flex-col min-h-0 text-left">
                  {/* MAIN STEP 3: TABLE LIST */}
                  <div className="flex-1 flex flex-col min-h-0 text-left animate-fade-in select-none" id="setup-step3-kitchen-warning">

                    {/* DATA TABLE WRAPPER - STRETCHES TO EDGES */}
                    <div className="flex-1 flex flex-col min-h-0 -mx-[20px] -mb-[20px] border-t border-slate-200/65 overflow-hidden bg-white">
                      <div className="flex-1 min-h-[220px] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                        <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 pl-[20px] pr-4 text-[13px] font-bold text-slate-800">Tên bếp/bar</th>
                            <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800 w-36">Loại</th>
                            <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800 w-44">Khu vực</th>
                            <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800 w-40 text-left">Số món chế biến</th>
                            <th className="py-2.5 pl-4 pr-[20px] text-[13px] font-bold text-slate-800 w-36 text-center">Thao tác</th>
                          </tr>
                          <tr className="bg-[#FAFAFA] border-b border-[#E9EAEB]">
                            {/* Tên bếp/bar */}
                            <th className="py-1 pl-[20px] pr-4">
                              <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                <div className="w-6 h-full flex items-center justify-center bg-slate-50 border-r border-slate-200 text-slate-500 font-bold select-none text-[13px]">*</div>
                                <input
                                  type="text"
                                  value={filterStep3Name}
                                  onChange={(e) => {
                                    setFilterStep3Name(e.target.value);
                                    setStep3Page(1);
                                  }}
                                  placeholder=""
                                  className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                                />
                              </div>
                            </th>
                            {/* Loại */}
                            <th className="py-1 px-4 w-36">
                              <div className="relative">
                                <select
                                  value={filterStep3Type}
                                  onChange={(e) => {
                                    setFilterStep3Type(e.target.value);
                                    setStep3Page(1);
                                  }}
                                  className="w-full h-[26px] border border-slate-200 rounded bg-white text-slate-700 text-[13px] font-semibold pl-1.5 pr-5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden cursor-pointer appearance-none"
                                >
                                  <option value="">Tất cả</option>
                                  <option value="Bếp">Bếp</option>
                                  <option value="Bar">Bar</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </th>
                            {/* Khu vực */}
                            <th className="py-1 px-4 w-44">
                              <div className="relative">
                                <select
                                  value={filterStep3Area}
                                  onChange={(e) => {
                                    setFilterStep3Area(e.target.value);
                                    setStep3Page(1);
                                  }}
                                  className="w-full h-[26px] border border-slate-200 rounded bg-white text-slate-700 text-[13px] font-semibold pl-1.5 pr-5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden cursor-pointer appearance-none"
                                >
                                  <option value="">Tất cả</option>
                                  {uniqueStep3Areas.map(areaName => (
                                    <option key={areaName} value={areaName}>{areaName}</option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </th>
                            <th className="py-1 px-4 w-40">
                              <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                <select
                                  value={filterStep3DishesOp}
                                  onChange={(e) => {
                                    setFilterStep3DishesOp(e.target.value as any);
                                    setStep3Page(1);
                                  }}
                                  className="bg-slate-50 text-slate-600 border-r border-slate-200 h-full px-1 text-[13px] font-bold focus:outline-hidden cursor-pointer select-none appearance-none text-center w-[26px] flex-shrink-0"
                                >
                                  <option value="=">=</option>
                                  <option value="<=">&le;</option>
                                  <option value=">=">&ge;</option>
                                </select>
                                <input
                                  type="text"
                                  value={filterStep3Dishes}
                                  onChange={(e) => {
                                    setFilterStep3Dishes(e.target.value);
                                    setStep3Page(1);
                                  }}
                                  placeholder=""
                                  className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold text-left"
                                />
                              </div>
                            </th>
                            <th className="py-1 pl-4 pr-[20px] w-36"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[13px] font-semibold text-slate-700">
                          {filteredKitchenAreas.slice((step3Page - 1) * step3PageSize, step3Page * step3PageSize).map((area, idx) => {
                            const actualIndex = kitchenAreas.indexOf(area);
                            return (
                              <tr key={idx} className="hover:bg-[#EDFCF4]/40 odd:bg-slate-50/25 transition-colors">
                                <td className="py-2.5 pl-[20px] pr-4 text-slate-900 font-bold">
                                  <span>{area.name}</span>
                                </td>
                                <td className="py-2.5 px-4">
                                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                                    area.type === 'Bar' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {area.type || 'Bếp'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 text-slate-600 font-medium">{area.area || 'Mặc định'}</td>
                                <td className="py-2.5 px-4 text-left font-bold text-[13px]">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedKitchenAreaForDishes(area);
                                      setFilterPopupCode('');
                                      setFilterPopupName('');
                                      setFilterPopupType('');
                                      setFilterPopupUnit('');
                                      setFilterPopupPrice('');
                                      setFilterPopupPriceOp('<=');
                                    }}
                                    className="text-[#245FDF] hover:underline cursor-pointer border-none bg-transparent p-0 font-bold"
                                  >
                                    {getEffectiveDishesForArea(area).length}
                                  </button>
                                </td>
                                <td className="py-2.5 pl-4 pr-[20px] text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditArea(actualIndex)}
                                      className="text-[#2563EB] hover:text-blue-700 hover:bg-blue-50 border-none p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center"
                                      title="Sửa"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteArea(actualIndex)}
                                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-none p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center"
                                      title="Xóa bếp/bar"
                                    >
                                      <Trash className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {kitchenAreas.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold text-[13px]">
                                Chưa có khu vực chế biến nào. Vui lòng bấm nút phía trên để thêm mới!
                              </td>
                            </tr>
                          )}
                          {kitchenAreas.length > 0 && filteredKitchenAreas.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold text-[13px]">
                                Không tìm thấy khu vực chế biến nào phù hợp với bộ lọc!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination for Step 3 */}
                    {filteredKitchenAreas.length > 0 && (
                      <div className="bg-white border-t border-[#E9EAEB] flex flex-wrap items-center justify-between px-[20px] py-2 md:py-0 min-h-[44px] gap-2 select-none flex-shrink-0">
                        <div className="flex items-center gap-1.5 text-[13px] text-[#475467] font-semibold">
                          <button
                            type="button"
                            disabled={step3Page === 1}
                            onClick={() => setStep3Page(1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                            title="Trang đầu"
                          >
                            <ChevronsLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={step3Page === 1}
                            onClick={() => setStep3Page(prev => Math.max(1, prev - 1))}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                            title="Trang trước"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                          <span className="text-slate-600">Trang</span>
                          <input
                            type="number"
                            min={1}
                            max={Math.max(1, Math.ceil(filteredKitchenAreas.length / step3PageSize))}
                            value={step3Page}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              const maxPages = Math.max(1, Math.ceil(filteredKitchenAreas.length / step3PageSize));
                              if (!isNaN(val) && val >= 1 && val <= maxPages) {
                                  setStep3Page(val);
                              }
                            }}
                            className="w-12 h-7 rounded-lg border border-slate-300 bg-white text-center font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="text-slate-600">trên {Math.max(1, Math.ceil(filteredKitchenAreas.length / step3PageSize))}</span>

                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                          <button
                            type="button"
                            disabled={step3Page === Math.max(1, Math.ceil(filteredKitchenAreas.length / step3PageSize))}
                            onClick={() => setStep3Page(prev => Math.min(Math.max(1, Math.ceil(filteredKitchenAreas.length / step3PageSize)), prev + 1))}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                            title="Trang sau"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={step3Page === Math.max(1, Math.ceil(filteredKitchenAreas.length / step3PageSize))}
                            onClick={() => setStep3Page(Math.max(1, Math.ceil(filteredKitchenAreas.length / step3PageSize)))}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                            title="Trang cuối"
                          >
                            <ChevronsRight className="w-4 h-4" />
                          </button>

                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                          <button
                            type="button"
                            onClick={() => {
                              setStep3Page(1);
                              onNotification("Đã tải lại danh sách bếp/bar!", "success");
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 cursor-pointer transition-colors border border-transparent"
                            title="Tải lại"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                          <div className="relative">
                            <select
                              value={step3PageSize}
                              onChange={(e) => {
                                const size = parseInt(e.target.value);
                                setStep3PageSize(size);
                                setStep3Page(1);
                              }}
                              className="h-7 pl-2 pr-6 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none"
                            >
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div className="text-[13px] text-[#475467] font-semibold">
                          Hiển thị {filteredKitchenAreas.length === 0 ? 0 : (step3Page - 1) * step3PageSize + 1} – {Math.min(filteredKitchenAreas.length, step3Page * step3PageSize)} trên {filteredKitchenAreas.length} kết quả
                        </div>
                      </div>
                    )}
                    </div>
                  </div>

                  {/* AREA FORM AND DISH SELECT HAVE BEEN MOVED OUTSIDE STEP 3 FOR GLOBAL AVAILABILITY (E.G., ACCESSIBLE IN STEP 2) */}


                </div>
              )}

              {activeModalStep === 7 && (
                <div className="flex-1 flex flex-col min-h-0 text-left">
                  {/* MAIN STEP 4: TABLE LIST */}
                  <div className="flex-1 flex flex-col min-h-0 text-left animate-fade-in select-none">


                    {/* DATA TABLE WRAPPER - STRETCHES TO EDGES */}
                    <div id="setup-step7-pin-checkbox" className="flex-1 flex flex-col min-h-0 -mx-[20px] -mb-[20px] border-t border-slate-200/65 overflow-hidden bg-white">
                      <div className="flex-1 min-h-[220px] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                        <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 pl-[20px] pr-4 text-[13px] font-bold text-slate-800" style={{ width: '136px', minWidth: '136px', maxWidth: '136px' }}>Mã NV</th>
                            <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800">Họ và tên</th>
                            <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>Giới tính</th>
                            <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800" style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}>Vị trí làm việc</th>
                            <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800 w-[200px]">Email</th>
                            <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800 w-32">Số điện thoại</th>
                            <th className="py-2.5 pl-4 pr-[20px] text-[13px] font-bold text-slate-800 w-32 text-center">Thao tác</th>
                          </tr>
                          {/* Hàng Filter bổ sung */}
                          <tr className="bg-[#F9FAFB] border-b border-[#E9EAEB]">
                            {/* Mã NV */}
                            <th className="py-1 pl-[20px] pr-4" style={{ width: '136px', minWidth: '136px', maxWidth: '136px' }}>
                              <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                <div className="w-[26px] flex-shrink-0 h-full flex items-center justify-center bg-white border-r border-slate-200 text-[#475467] font-semibold select-none text-[14px] leading-none pt-[3px]">*</div>
                                <input
                                  type="text"
                                  value={filterStep7Code}
                                  onChange={(e) => {
                                    setFilterStep7Code(e.target.value);
                                    setStep4Page(1);
                                  }}
                                  placeholder=""
                                  className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                                />
                              </div>
                            </th>
                            {/* Họ và tên */}
                            <th className="py-1 px-4">
                              <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                <div className="w-[26px] flex-shrink-0 h-full flex items-center justify-center bg-white border-r border-slate-200 text-[#475467] font-semibold select-none text-[14px] leading-none pt-[3px]">*</div>
                                <input
                                  type="text"
                                  value={filterStep7Name}
                                  onChange={(e) => {
                                    setFilterStep7Name(e.target.value);
                                    setStep4Page(1);
                                  }}
                                  placeholder=""
                                  className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                                />
                              </div>
                            </th>
                            {/* Giới tính */}
                            <th className="py-1 px-4" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                              <div className="relative">
                                <select
                                  value={filterStep7Gender}
                                  onChange={(e) => {
                                    setFilterStep7Gender(e.target.value);
                                    setStep4Page(1);
                                  }}
                                  className="w-full h-[26px] border border-slate-200 rounded bg-white text-slate-700 text-[13px] font-semibold pl-1.5 pr-5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden cursor-pointer appearance-none text-left"
                                >
                                  <option value="">Tất cả</option>
                                  <option value="Nam">Nam</option>
                                  <option value="Nữ">Nữ</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </th>
                            {/* Vị trí làm việc */}
                            <th className="py-1 px-4" style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}>
                              <div className="relative">
                                <select
                                  value={filterStep7Role}
                                  onChange={(e) => {
                                    setFilterStep7Role(e.target.value);
                                    setStep4Page(1);
                                  }}
                                  className="w-full h-[26px] border border-slate-200 rounded bg-white text-slate-700 text-[13px] font-semibold pl-1.5 pr-5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden cursor-pointer appearance-none text-left"
                                >
                                  <option value="">Tất cả</option>
                                  <option value="Quản trị hệ thống">Quản trị hệ thống</option>
                                  <option value="Quản lý chuỗi">Quản lý chuỗi</option>
                                  <option value="Giám sát">Giám sát</option>
                                  <option value="Thu ngân">Thu ngân</option>
                                  <option value="Bếp/Bar">Bếp/Bar</option>
                                  <option value="Bếp / Bar">Bếp / Bar</option>
                                  <option value="Phục vụ">Phục vụ</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </th>
                            {/* Email */}
                            <th className="py-1 px-4 w-[200px]">
                              <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                <div className="w-[26px] flex-shrink-0 h-full flex items-center justify-center bg-white border-r border-slate-200 text-[#475467] font-semibold select-none text-[14px] leading-none pt-[3px]">*</div>
                                <input
                                  type="text"
                                  value={filterStep7Email}
                                  onChange={(e) => {
                                    setFilterStep7Email(e.target.value);
                                    setStep4Page(1);
                                  }}
                                  placeholder=""
                                  className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                                />
                              </div>
                            </th>
                            {/* Số điện thoại */}
                            <th className="py-1 px-4 w-32">
                              <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                <div className="w-[26px] flex-shrink-0 h-full flex items-center justify-center bg-white border-r border-slate-200 text-[#475467] font-semibold select-none text-[14px] leading-none pt-[3px]">*</div>
                                <input
                                  type="text"
                                  value={filterStep7Phone}
                                  onChange={(e) => {
                                    setFilterStep7Phone(e.target.value);
                                    setStep4Page(1);
                                  }}
                                  placeholder=""
                                  className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                                />
                              </div>
                            </th>
                            {/* Thao tác */}
                            <th className="py-1 pl-4 pr-[20px] w-32"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[13px] font-semibold text-slate-700">
                          {filteredEmployees.slice((step4Page - 1) * step4PageSize, step4Page * step4PageSize).map((emp, idx) => {
                            const actualIndex = (step4Page - 1) * step4PageSize + idx;
                            return (
                              <tr key={idx} className="hover:bg-[#EDFCF4]/40 odd:bg-slate-50/25 transition-colors">
                                <td className="py-2.5 pl-[20px] pr-4 text-slate-900 font-bold" style={{ width: '136px', minWidth: '136px', maxWidth: '136px' }}>
                                  <span>{emp.code}</span>
                                </td>
                                <td className="py-2.5 px-4 text-slate-900 font-bold">
                                  <span>{emp.name}</span>
                                </td>
                                <td className="py-2.5 px-4 text-slate-600 font-medium" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                                  <span>{emp.gender || 'Nam'}</span>
                                </td>
                                <td className="py-2.5 px-4" style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}>
                                  <span className={`px-2 py-0.5 rounded-md text-[13px] font-bold ${
                                    emp.role === 'Quản trị hệ thống' ? 'bg-purple-100 text-purple-800' :
                                    emp.role === 'Quản lý chuỗi' ? 'bg-indigo-100 text-indigo-800' :
                                    emp.role === 'Giám sát' ? 'bg-emerald-100 text-emerald-800' :
                                    emp.role === 'Thu ngân' ? 'bg-blue-100 text-blue-800' :
                                    emp.role === 'Bếp/Bar' || emp.role === 'Bếp / Bar' ? 'bg-amber-100 text-amber-800' :
                                    'bg-slate-100 text-slate-800'
                                  }`}>
                                    {emp.role || '—'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 text-slate-600 font-medium break-all">{emp.email || '—'}</td>
                                <td className="py-2.5 px-4 text-slate-600 font-medium">{emp.phone || '—'}</td>
                                <td className="py-2.5 pl-4 pr-[20px] text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditEmployee(actualIndex)}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-transparent p-1.5 rounded-md transition-all cursor-pointer inline-flex items-center justify-center"
                                      title="Sửa nhân viên"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    {emp.role === 'Quản trị hệ thống' ? (
                                      <button
                                        type="button"
                                        disabled
                                        className="text-slate-300 border border-transparent p-1.5 rounded-md cursor-not-allowed inline-flex items-center justify-center opacity-50"
                                        title="Không thể xóa Quản trị hệ thống (tài khoản đang sử dụng)"
                                      >
                                        <Trash className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteEmployee(actualIndex)}
                                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent p-1.5 rounded-md transition-all cursor-pointer inline-flex items-center justify-center"
                                        title="Xóa nhân viên"
                                      >
                                        <Trash className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredEmployees.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold text-[13px]">
                                Chưa tìm thấy nhân viên phù hợp với bộ lọc.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination for Step 4 */}
                    {employees.length > 0 && (
                      <div className="bg-white border-t border-[#E9EAEB] flex flex-wrap items-center justify-between px-[20px] py-2 md:py-0 min-h-[44px] gap-2 select-none flex-shrink-0">
                        <div className="flex items-center gap-1.5 text-[13px] text-[#475467] font-semibold">
                          <button
                            type="button"
                            disabled={step4Page === 1}
                            onClick={() => setStep4Page(1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                            title="Trang đầu"
                          >
                            <ChevronsLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={step4Page === 1}
                            onClick={() => setStep4Page(prev => Math.max(1, prev - 1))}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                            title="Trang trước"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                          <span className="text-slate-600">Trang</span>
                          <input
                            type="number"
                            min={1}
                            max={Math.max(1, Math.ceil(filteredEmployees.length / step4PageSize))}
                            value={step4Page}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              const maxPages = Math.max(1, Math.ceil(filteredEmployees.length / step4PageSize));
                              if (!isNaN(val) && val >= 1 && val <= maxPages) {
                                setStep4Page(val);
                              }
                            }}
                            className="w-12 h-7 rounded-lg border border-slate-300 bg-white text-center font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="text-slate-600">trên {Math.max(1, Math.ceil(filteredEmployees.length / step4PageSize))}</span>

                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                          <button
                            type="button"
                            disabled={step4Page === Math.max(1, Math.ceil(filteredEmployees.length / step4PageSize))}
                            onClick={() => setStep4Page(prev => Math.min(Math.max(1, Math.ceil(filteredEmployees.length / step4PageSize)), prev + 1))}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                            title="Trang sau"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={step4Page === Math.max(1, Math.ceil(filteredEmployees.length / step4PageSize))}
                            onClick={() => setStep4Page(Math.max(1, Math.ceil(filteredEmployees.length / step4PageSize)))}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors border border-transparent"
                            title="Trang cuối"
                          >
                            <ChevronsRight className="w-4 h-4" />
                          </button>

                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                          <button
                            type="button"
                            onClick={() => {
                              setStep4Page(1);
                              setFilterStep7Code('');
                              setFilterStep7Name('');
                              setFilterStep7Gender('');
                              setFilterStep7Role('');
                              setFilterStep7Email('');
                              setFilterStep7Phone('');
                              onNotification("Đã tải lại danh sách nhân viên!", "success");
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 cursor-pointer transition-colors border border-transparent"
                            title="Tải lại"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                          <div className="relative">
                            <select
                              value={step4PageSize}
                              onChange={(e) => {
                                const size = parseInt(e.target.value);
                                setStep4PageSize(size);
                                setStep4Page(1);
                              }}
                              className="h-7 pl-2 pr-6 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none"
                            >
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div className="text-[13px] text-[#475467] font-semibold">
                          Hiển thị {filteredEmployees.length === 0 ? 0 : (step4Page - 1) * step4PageSize + 1} – {Math.min(filteredEmployees.length, step4Page * step4PageSize)} trên {filteredEmployees.length} kết quả
                        </div>
                      </div>
                    )}
                    </div>
                  </div>

                  {/* FORM POPUP OVERLAY */}
                  {isAddEmployeePopupOpen && (
                    <div className={`fixed top-0 left-0 bottom-0 bg-black/40 z-[9990] flex items-center justify-center p-4 animate-fade-in font-sans ${
                      isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
                    }`}>
                      <div
                        className="bg-white flex flex-col w-full max-w-[700px] max-h-[90vh] shadow-2xl relative overflow-hidden animate-scale-in"
                        style={{ borderRadius: "12px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header Modal - White background, Black title, as per instructions */}
                        <div
                          className="flex items-center justify-between px-6 bg-white border-b border-[#E9EAEB] text-[#101828] flex-shrink-0"
                          style={{ height: "48px" }}
                        >
                          <h3 className="text-[#101828] font-bold text-[16px] font-sans">
                            {editingEmployeeIndex !== null ? 'Sửa nhân viên' : 'Thêm nhân viên'}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsAddEmployeePopupOpen(false)}
                            className="text-[#717680] hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent outline-none flex items-center justify-center"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Form Content - Scrollable body */}
                        <div className="p-6 flex-1 overflow-y-auto max-h-[65vh] bg-white min-h-[350px]">
                          <div className="space-y-4 text-left">
                              <h4 className="text-[14px] font-bold text-[#101828] border-b border-gray-100 pb-1 mb-3">
                                Chi tiết
                              </h4>

                              {/* Row 1: Mã nhân viên */}
                              <div className="flex items-center gap-3">
                                <span className="w-[110px] text-[13px] font-sans text-[#101828] select-none flex-shrink-0">
                                  Mã nhân viên <span className="text-red-500">(*)</span>
                                </span>
                                <input
                                  type="text"
                                  required
                                  value={empCode}
                                  onChange={(e) => setEmpCode(e.target.value)}
                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-bold font-sans outline-none transition-all"
                                />
                              </div>

                              {/* Row 2: Họ và tên */}
                              <div className="flex items-center gap-3">
                                <span className="w-[110px] text-[13px] font-sans text-[#101828] select-none flex-shrink-0">
                                  Họ và tên <span className="text-red-500">(*)</span>
                                </span>
                                <input
                                  type="text"
                                  required
                                  value={empName}
                                  onChange={(e) => setEmpName(e.target.value)}
                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-bold font-sans outline-none transition-all"
                                />
                              </div>

                              {/* Row 3: Vị trí làm việc */}
                              <div className="flex flex-col gap-2 pt-1">
                                <div className="flex items-start gap-3">
                                  <span className="w-[110px] text-[13px] font-sans text-[#101828] select-none flex-shrink-0 pt-1">
                                    Vị trí làm việc <span className="text-red-500">(*)</span>
                                  </span>
                                  <div className="flex-1 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-sans text-slate-700">
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={empRole === 'Quản trị hệ thống'}
                                        onChange={() => {
                                          const nextRole = empRole === 'Quản trị hệ thống' ? '' : 'Quản trị hệ thống';
                                          setEmpRole(nextRole);
                                          setEmpBranches([]);
                                        }}
                                        className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 cursor-pointer"
                                      />
                                      <span className="select-none">Quản trị hệ thống</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={empRole === 'Quản lý chuỗi'}
                                        onChange={() => {
                                          const nextRole = empRole === 'Quản lý chuỗi' ? '' : 'Quản lý chuỗi';
                                          setEmpRole(nextRole);
                                          setEmpBranches([]);
                                        }}
                                        className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 cursor-pointer"
                                      />
                                      <span className="select-none">Quản lý chuỗi</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={empRole === 'Giám sát'}
                                        onChange={() => {
                                          const nextRole = empRole === 'Giám sát' ? '' : 'Giám sát';
                                          setEmpRole(nextRole);
                                          if (nextRole === 'Giám sát') {
                                            const newId = Date.now().toString();
                                            setEmpBranches([{ id: newId, branchName: '', roles: ['Giám sát'] }]);
                                            setSelectedBranchRowId(newId);
                                          } else {
                                            const newId = Date.now().toString();
                                            setEmpBranches([{ id: newId, branchName: '', roles: [] }]);
                                            setSelectedBranchRowId(newId);
                                          }
                                        }}
                                        className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 cursor-pointer"
                                      />
                                      <span className="select-none">Giám sát</span>
                                    </label>
                                  </div>
                                </div>
                              </div>

                              {/* Roles subtable */}
                              {!(empRole === 'Quản trị hệ thống' || empRole === 'Quản lý chuỗi') && (
                                <div className="pl-[123px] pr-2">
                                  <div className="border border-[#D5D7DA] rounded-[4px] bg-white">
                                    <table className="w-full text-left border-collapse text-[13px] font-sans">
                                      <thead className="bg-[#FAFAFA] border-b border-[#D5D7DA]">
                                        <tr>
                                          <th className="py-2 px-3 font-semibold text-slate-700 w-1/2 border-r border-[#D5D7DA] text-center text-[13px]">
                                            Tên nhà hàng
                                          </th>
                                          <th className="py-2 px-3 font-semibold text-slate-700 w-1/2 text-center text-[13px]">
                                            Vai trò
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-[#D5D7DA] text-slate-600 bg-white">
                                        {empBranches.map((row) => {
                                          const isSelected = selectedBranchRowId === row.id;
                                          const isDropdownOpen = activeBranchRowIdForBranchDropdown === row.id;
                                          
                                          const branchList = [
                                            'MISA CukCuk Restaurant',
                                            'MISA CukCuk Premium',
                                            'CukCuk Quận 1',
                                            'CukCuk Hồ Tây',
                                            'Nhà hàng Hương Việt',
                                            'CukCuk Đà Nẵng',
                                            'CukCuk Nha Trang'
                                          ];

                                          return (
                                            <tr 
                                              key={row.id} 
                                              onClick={() => setSelectedBranchRowId(row.id)}
                                              className="transition-colors cursor-pointer select-none bg-white hover:bg-[#FAFAFA]"
                                            >
                                              {/* Cột Tên nhà hàng */}
                                              <td className="py-2.5 px-3 border-r border-[#D5D7DA] relative">
                                                <div className="relative w-full min-h-[28px] flex items-center">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setSelectedBranchRowId(row.id);
                                                      setActiveBranchRowIdForBranchDropdown(isDropdownOpen ? null : row.id);
                                                      setBranchSearchQuery('');
                                                    }}
                                                    className="w-full text-left font-medium text-[13px] bg-transparent border-none outline-none focus:outline-none flex items-center justify-between text-slate-800"
                                                  >
                                                    <span className={row.branchName ? 'text-slate-900 font-semibold' : 'text-slate-400 font-normal italic'}>
                                                      {row.branchName || 'Chọn nhà hàng...'}
                                                    </span>
                                                    <ChevronDown className="w-3.5 h-3.5 text-[#6B707A] flex-shrink-0 ml-1" />
                                                  </button>

                                                  {/* Dropdown chọn Nhà hàng kèm search */}
                                                  {isDropdownOpen && (
                                                    <div 
                                                      className="absolute left-0 top-[32px] w-[260px] max-h-[240px] bg-white border border-[#D5D7DA] rounded-[4px] shadow-lg z-[99] flex flex-col overflow-hidden"
                                                      onClick={(e) => e.stopPropagation()}
                                                    >
                                                      {/* Search input inside dropdown */}
                                                      <div className="p-1.5 border-b border-[#E9EAEB] bg-[#FAFAFA] flex items-center gap-1">
                                                        <Search className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
                                                        <input
                                                          type="text"
                                                          value={branchSearchQuery}
                                                          onChange={(e) => setBranchSearchQuery(e.target.value)}
                                                          placeholder="Tìm tên nhà hàng..."
                                                          className="w-full h-7 px-2 py-1 text-[12px] bg-white border border-[#D5D7DA] rounded-[3px] outline-none focus:border-[#245FDF]"
                                                          autoFocus
                                                        />
                                                      </div>
                                                      {/* List scroll */}
                                                      <div className="overflow-y-auto flex-1 py-1 max-h-[180px]">
                                                        {branchList.filter(b => 
                                                          b.toLowerCase().includes(branchSearchQuery.toLowerCase())
                                                        ).length === 0 ? (
                                                          <div className="px-3 py-2 text-[12px] text-slate-400 italic">
                                                            Không tìm thấy nhà hàng
                                                          </div>
                                                        ) : (
                                                          branchList.filter(b => 
                                                            b.toLowerCase().includes(branchSearchQuery.toLowerCase())
                                                          ).map((branch) => (
                                                            <button
                                                              key={branch}
                                                              type="button"
                                                              onClick={() => {
                                                                const updated = empBranches.map(item => 
                                                                  item.id === row.id ? { ...item, branchName: branch } : item
                                                                );
                                                                setEmpBranches(updated);
                                                                setActiveBranchRowIdForBranchDropdown(null);
                                                              }}
                                                              className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#F0F6FE] hover:text-[#245FDF] text-slate-700 transition-colors cursor-pointer font-medium"
                                                            >
                                                              {branch}
                                                            </button>
                                                          ))
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </td>

                                              {/* Cột Vai trò */}
                                              <td className="py-2.5 pl-3 pr-9 relative select-none">
                                                <div className="flex flex-wrap gap-1.5 w-full">
                                                  {row.roles.length === 0 ? (
                                                    <span className="text-slate-400 text-[12px] italic">Chưa chọn vai trò</span>
                                                  ) : (
                                                    row.roles.map((r) => (
                                                      <div 
                                                        key={r} 
                                                        className="flex items-center gap-1 bg-[#F0F6FE] text-[#245FDF] px-1.5 py-0.5 rounded-[3px] text-[11px] font-semibold border border-[#D5D7DA]"
                                                      >
                                                        <span>{r}</span>
                                                        <button
                                                          type="button"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            const updatedRoles = row.roles.filter(x => x !== r);
                                                            const updated = empBranches.map(item => 
                                                              item.id === row.id ? { ...item, roles: updatedRoles } : item
                                                            );
                                                            setEmpBranches(updated);
                                                          }}
                                                          className="hover:text-red-500 font-bold ml-0.5 text-[10px] bg-transparent border-none p-0 cursor-pointer text-[#6B707A]"
                                                        >
                                                          ✕
                                                        </button>
                                                      </div>
                                                    ))
                                                  )}
                                                </div>

                                                {/* Three dots button on the far right */}
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedBranchRowId(row.id);
                                                    setActiveBranchRowIdForRoles(row.id);
                                                    setSelectedPopupRoles(row.roles || []);
                                                    setIsRolesPopupOpen(true);
                                                  }}
                                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 border border-[#D5D7DA] rounded bg-[#FAFAFA] hover:bg-slate-100 flex items-center justify-center text-[#6B707A] cursor-pointer focus:outline-none text-[11px] font-bold shadow-xs"
                                                  title="Tùy chọn vai trò"
                                                >
                                                  ...
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="flex items-center justify-between mt-2 select-none">
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newId = Date.now().toString();
                                          setEmpBranches(prev => [...prev, { id: newId, branchName: '', roles: [] }]);
                                          setSelectedBranchRowId(newId);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-[#D5D7DA] bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded cursor-pointer transition-colors shadow-xs"
                                      >
                                        <FilePlus className="w-3.5 h-3.5 text-[#245FDF]" />
                                        <span>Thêm dòng</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (empBranches.length <= 1) {
                                            onNotification('⚠️ Cần giữ lại ít nhất một dòng phân quyền!', 'info');
                                            return;
                                          }
                                          const targetId = selectedBranchRowId || empBranches[empBranches.length - 1].id;
                                          const filtered = empBranches.filter(b => b.id !== targetId);
                                          setEmpBranches(filtered);
                                          setSelectedBranchRowId(filtered[filtered.length - 1]?.id || null);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-[#D5D7DA] bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded cursor-pointer transition-colors shadow-xs"
                                      >
                                        <X className="w-3.5 h-3.5 text-rose-500 font-bold" />
                                        <span>Xóa dòng</span>
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const targetRow = empBranches.find(b => b.id === selectedBranchRowId) || empBranches[empBranches.length - 1];
                                        if (!targetRow) return;
                                        const newId = Date.now().toString();
                                        setEmpBranches(prev => [...prev, { ...targetRow, id: newId }]);
                                        setSelectedBranchRowId(newId);
                                        onNotification('🎉 Đã sao chép dòng phân quyền thành công!', 'success');
                                      }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-[#D5D7DA] bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded cursor-pointer transition-colors shadow-xs"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-[#245FDF]" />
                                      <span>Sao chép</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                                  {/* Account Section */}
                                  {!(empRole === 'Quản trị hệ thống' || empRole === 'Quản lý chuỗi') && (
                                    <div className="pt-4 mt-2 border-t border-gray-100">
                                      <h4 className="text-[14px] font-bold text-[#101828] mb-3">
                                        Tài khoản
                                      </h4>
                                      <div className="space-y-4">
                                        {((empAllowLogin || empRole === 'Giám sát' || empRole === '')) ? (
                                          <div className="space-y-4 text-left">
                                            <p className="text-[13px] italic text-[#10141B] font-normal leading-normal mb-3 select-none">
                                              Nhân viên đăng nhập bằng mã nhân viên và mật khẩu do nhà hàng tạo.
                                            </p>
                                            
                                            <div className="space-y-4">
                                              {/* Email Field */}
                                              {!(empRole === '' || empRole === 'Giám sát') && (
                                                <div className="flex items-center gap-3">
                                                  <span className="w-[110px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                    Email
                                                  </span>
                                                  <input
                                                    type="email"
                                                    value={empEmail}
                                                    onChange={(e) => setEmpEmail(e.target.value)}
                                                    placeholder=""
                                                    className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                                                  />
                                                </div>
                                              )}

                                              {/* Phone Field */}
                                              {!(empRole === '' || empRole === 'Giám sát') && (
                                                <div className="flex items-center gap-3">
                                                  <span className="w-[110px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                    Số điện thoại
                                                  </span>
                                                  <input
                                                    type="text"
                                                    value={empPhone}
                                                    onChange={(e) => setEmpPhone(e.target.value)}
                                                    placeholder=""
                                                    className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                                                  />
                                                </div>
                                              )}

                                              {/* Password input */}
                                              <div className="flex items-center gap-3">
                                                <span className="w-[110px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                  Mật khẩu truy cập <span className="text-rose-600 font-bold">(*)</span>
                                                </span>
                                                <div className="relative flex-1">
                                                  <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={empPassword}
                                                    onChange={(e) => setEmpPassword(e.target.value)}
                                                    placeholder=""
                                                    className="w-full h-[32px] pl-3 pr-9 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 cursor-pointer select-none active:scale-95"
                                                  >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Confirm Password input */}
                                              <div className="flex items-center gap-3">
                                                <span className="w-[110px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                  Xác nhận mật khẩu <span className="text-rose-600 font-bold">(*)</span>
                                                </span>
                                                <div className="relative flex-1">
                                                  <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={empConfirmPassword}
                                                    onChange={(e) => setEmpConfirmPassword(e.target.value)}
                                                    placeholder=""
                                                    className="w-full h-[32px] pl-3 pr-9 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 cursor-pointer select-none active:scale-95"
                                                  >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Password guidelines */}
                                              <div className="pl-[122px]">
                                                <p className="text-[12px] text-[#717680] leading-normal font-sans">
                                                  Mật khẩu phải có ít nhất 8 ký tự bao gồm cả chữ hoa, chữ thường và chữ số.
                                                </p>
                                              </div>

                                              {/* PIN checkbox and dynamic inputs */}
                                              <div className="flex flex-col gap-3 pt-1">
                                                <div className="flex items-center gap-2 pl-[122px]">
                                                  <label className="flex items-center gap-2 cursor-pointer text-[13px] font-sans text-[#10141B] select-none font-medium">
                                                    <input
                                                      type="checkbox"
                                                      checked={empUsePin}
                                                      onChange={(e) => setEmpUsePin(e.target.checked)}
                                                      className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 cursor-pointer"
                                                    />
                                                    <span>Sử dụng MÃ PIN để đăng nhập nhanh trên các thiết bị bán hàng</span>
                                                  </label>
                                                </div>

                                                {empUsePin && (
                                                  <div className="flex flex-col gap-4 pl-[122px] mt-1 text-left">
                                                    {/* Mã PIN group */}
                                                    <div className="flex items-center gap-3">
                                                      <span className="w-[130px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                        Mã PIN <span className="text-rose-600 font-bold">(*)</span>
                                                      </span>
                                                      <div className="flex gap-1.5">
                                                        {[0, 1, 2, 3].map((idx) => {
                                                          const val = empPin[idx] || '';
                                                          return (
                                                            <input
                                                              key={`pin-1-${idx}`}
                                                              id={`pin-${idx}`}
                                                              type="password"
                                                              maxLength={1}
                                                              pattern="[0-9]*"
                                                              inputMode="numeric"
                                                              value={val === ' ' ? '' : val}
                                                              onChange={(e) => handlePinChange(idx, e.target.value, 'pin')}
                                                              onKeyDown={(e) => handlePinKeyDown(idx, e, 'pin')}
                                                              className="w-[34px] h-[34px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] text-center text-[16px] font-bold bg-white outline-none transition-all"
                                                            />
                                                          );
                                                        })}
                                                      </div>
                                                    </div>

                                                    {/* Xác nhận mã PIN group */}
                                                    <div className="flex items-center gap-3">
                                                      <span className="w-[130px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                        Xác nhận mã PIN <span className="text-rose-600 font-bold">(*)</span>
                                                      </span>
                                                      <div className="flex gap-1.5">
                                                        {[0, 1, 2, 3].map((idx) => {
                                                          const val = empConfirmPin[idx] || '';
                                                          return (
                                                            <input
                                                              key={`conf-1-${idx}`}
                                                              id={`confirm-pin-${idx}`}
                                                              type="password"
                                                              maxLength={1}
                                                              pattern="[0-9]*"
                                                              inputMode="numeric"
                                                              value={val === ' ' ? '' : val}
                                                              onChange={(e) => handlePinChange(idx, e.target.value, 'confirm')}
                                                              onKeyDown={(e) => handlePinKeyDown(idx, e, 'confirm')}
                                                              className="w-[34px] h-[34px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] text-center text-[16px] font-bold bg-white outline-none transition-all"
                                                            />
                                                          );
                                                        })}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="space-y-4 text-left">
                                            <p className="text-[13px] italic text-[#10141B] font-normal leading-normal mb-3 select-none">
                                              Nhập 1 trong 2 thông tin Email hoặc Số điện thoại. Nếu nhập cả 2 thì hệ thống sẽ lấy Email là tài khoản kích hoạt.
                                            </p>
                                            
                                            <div className="space-y-4">
                                              {/* Email Field */}
                                              <div className="flex items-center gap-3">
                                                <span className="w-[110px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                  Email
                                                </span>
                                                <input
                                                  type="email"
                                                  value={empEmail}
                                                  onChange={(e) => setEmpEmail(e.target.value)}
                                                  placeholder=""
                                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                                                />
                                              </div>

                                              {/* Phone Field */}
                                              <div className="flex items-center gap-3">
                                                <span className="w-[110px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                  Số điện thoại
                                                </span>
                                                <input
                                                  type="text"
                                                  value={empPhone}
                                                  onChange={(e) => setEmpPhone(e.target.value)}
                                                  placeholder=""
                                                  className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                                                />
                                              </div>

                                              {/* PIN section */}
                                              <div className="flex flex-col gap-3 pt-1">
                                                <div className="flex items-center gap-2 pl-[122px]">
                                                  <label className="flex items-center gap-2 cursor-pointer text-[13px] font-sans text-[#10141B] select-none font-medium">
                                                    <input
                                                      type="checkbox"
                                                      checked={empUsePin}
                                                      onChange={(e) => setEmpUsePin(e.target.checked)}
                                                      className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 cursor-pointer"
                                                    />
                                                    <span>Sử dụng MÃ PIN để đăng nhập nhanh trên các thiết bị bán hàng</span>
                                                  </label>
                                                </div>

                                                {empUsePin && (
                                                  <div className="flex flex-col gap-4 pl-[122px] mt-1 text-left">
                                                    {/* Mã PIN group */}
                                                    <div className="flex items-center gap-3">
                                                      <span className="w-[130px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                        Mã PIN <span className="text-rose-600 font-bold">(*)</span>
                                                      </span>
                                                      <div className="flex gap-1.5">
                                                        {[0, 1, 2, 3].map((idx) => {
                                                          const val = empPin[idx] || '';
                                                          return (
                                                            <input
                                                              key={`pin-2-${idx}`}
                                                              id={`pin-2-${idx}`}
                                                              type="password"
                                                              maxLength={1}
                                                              pattern="[0-9]*"
                                                              inputMode="numeric"
                                                              value={val === ' ' ? '' : val}
                                                              onChange={(e) => handlePinChange(idx, e.target.value, 'pin')}
                                                              onKeyDown={(e) => handlePinKeyDown(idx, e, 'pin')}
                                                              className="w-[34px] h-[34px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] text-center text-[16px] font-bold bg-white outline-none transition-all"
                                                            />
                                                          );
                                                        })}
                                                      </div>
                                                    </div>

                                                    {/* Xác nhận mã PIN group */}
                                                    <div className="flex items-center gap-3">
                                                      <span className="w-[130px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                        Xác nhận mã PIN <span className="text-rose-600 font-bold">(*)</span>
                                                      </span>
                                                      <div className="flex gap-1.5">
                                                        {[0, 1, 2, 3].map((idx) => {
                                                          const val = empConfirmPin[idx] || '';
                                                          return (
                                                            <input
                                                              key={`conf-2-${idx}`}
                                                              id={`confirm-pin-2-${idx}`}
                                                              type="password"
                                                              maxLength={1}
                                                              pattern="[0-9]*"
                                                              inputMode="numeric"
                                                              value={val === ' ' ? '' : val}
                                                              onChange={(e) => handlePinChange(idx, e.target.value, 'confirm')}
                                                              onKeyDown={(e) => handlePinKeyDown(idx, e, 'confirm')}
                                                              className="w-[34px] h-[34px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] text-center text-[16px] font-bold bg-white outline-none transition-all"
                                                            />
                                                          );
                                                        })}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Account Section for System Admin / Chain Manager */}
                                {(empRole === 'Quản trị hệ thống' || empRole === 'Quản lý chuỗi') && (
                                  <div className="pt-4 mt-2 border-t border-gray-100">
                                    <h4 className="text-[14px] font-bold text-[#101828] mb-3">
                                      Tài khoản
                                    </h4>
                                    <div className="space-y-4 text-left">
                                      {/* Instruction italic text */}
                                      <p className="text-[13px] italic text-[#10141B] font-normal leading-normal mb-3 select-none">
                                        Nhập 1 trong 2 thông tin Email hoặc Số điện thoại. Nếu nhập cả 2 thì hệ thống sẽ lấy Email là tài khoản kích hoạt.
                                      </p>

                                      <div className="space-y-4">
                                        {/* Email row */}
                                        <div className="flex items-center gap-3">
                                          <div className="w-[110px] flex items-center gap-1 select-none flex-shrink-0">
                                            <span className="text-[13px] font-sans text-[#10141B] font-medium">Email</span>
                                            <Info className="w-3.5 h-3.5 text-[#245FDF] stroke-[2.5]" />
                                          </div>
                                          <input
                                            type="email"
                                            value={empEmail}
                                            onChange={(e) => setEmpEmail(e.target.value)}
                                            placeholder=""
                                            className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                                          />
                                        </div>

                                        {/* Phone row */}
                                        <div className="flex items-center gap-3">
                                          <div className="w-[110px] flex items-center gap-1 select-none flex-shrink-0">
                                            <span className="text-[13px] font-sans text-[#10141B] font-medium">Số điện thoại</span>
                                            <Info className="w-3.5 h-3.5 text-[#245FDF] stroke-[2.5]" />
                                          </div>
                                          <input
                                            type="text"
                                            value={empPhone}
                                            onChange={(e) => setEmpPhone(e.target.value)}
                                            placeholder=""
                                            className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                                          />
                                        </div>

                                        {/* PIN Checkbox and PIN Inputs */}
                                        <div className="flex flex-col gap-3 pt-1">
                                          <div className="flex items-center gap-2 pl-[122px]">
                                            <label className="flex items-center gap-2 cursor-pointer text-[13px] font-sans text-[#10141B] select-none font-medium">
                                              <input
                                                type="checkbox"
                                                checked={empUsePin}
                                                onChange={(e) => setEmpUsePin(e.target.checked)}
                                                className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 cursor-pointer"
                                              />
                                              <span>Sử dụng MÃ PIN để đăng nhập nhanh trên các thiết bị bán hàng</span>
                                            </label>
                                          </div>

                                          {empUsePin && (
                                            <div className="flex flex-col gap-4 pl-[122px] mt-1 text-left">
                                              {/* Mã PIN group */}
                                              <div className="flex items-center gap-3">
                                                <span className="w-[130px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                  Mã PIN <span className="text-rose-600 font-bold">(*)</span>
                                                </span>
                                                <div className="flex gap-1.5">
                                                  {[0, 1, 2, 3].map((idx) => {
                                                    const val = empPin[idx] || '';
                                                    return (
                                                      <input
                                                        key={`pin-3-${idx}`}
                                                        id={`pin-3-${idx}`}
                                                        type="password"
                                                        maxLength={1}
                                                        pattern="[0-9]*"
                                                        inputMode="numeric"
                                                        value={val === ' ' ? '' : val}
                                                        onChange={(e) => handlePinChange(idx, e.target.value, 'pin')}
                                                        onKeyDown={(e) => handlePinKeyDown(idx, e, 'pin')}
                                                        className="w-[34px] h-[34px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] text-center text-[16px] font-bold bg-white outline-none transition-all"
                                                      />
                                                    );
                                                  })}
                                                </div>
                                              </div>

                                              {/* Xác nhận mã PIN group */}
                                              <div className="flex items-center gap-3">
                                                <span className="w-[130px] text-[13px] font-sans text-[#10141B] select-none flex-shrink-0 font-medium">
                                                  Xác nhận mã PIN <span className="text-rose-600 font-bold">(*)</span>
                                                </span>
                                                <div className="flex gap-1.5">
                                                  {[0, 1, 2, 3].map((idx) => {
                                                    const val = empConfirmPin[idx] || '';
                                                    return (
                                                      <input
                                                        key={`conf-3-${idx}`}
                                                        id={`confirm-pin-3-${idx}`}
                                                        type="password"
                                                        maxLength={1}
                                                        pattern="[0-9]*"
                                                        inputMode="numeric"
                                                        value={val === ' ' ? '' : val}
                                                        onChange={(e) => handlePinChange(idx, e.target.value, 'confirm')}
                                                        onKeyDown={(e) => handlePinKeyDown(idx, e, 'confirm')}
                                                        className="w-[34px] h-[34px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] text-center text-[16px] font-bold bg-white outline-none transition-all"
                                                      />
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-slate-50 border-t border-[#E9EAEB] flex justify-end gap-2.5 flex-shrink-0 select-none">
                          <button
                            type="button"
                            onClick={() => setIsAddEmployeePopupOpen(false)}
                            className="h-[32px] min-w-[72px] px-4 bg-white hover:bg-slate-50 border border-[#D5D7DA] text-slate-700 font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-colors cursor-pointer outline-none"
                          >
                            Hủy bỏ
                          </button>

                          {editingEmployeeIndex !== null ? (
                            <button
                              type="button"
                              onClick={() => handleSaveEmployee(false)}
                              className="h-[32px] min-w-[96px] px-5 bg-[#245FDF] hover:bg-[#1B4EBA] border-none text-white font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer outline-none shadow-sm"
                            >
                              Lưu
                            </button>
                          ) : (
                            /* Combo Button for Step 4 Employee */
                            <div className="relative flex items-center">
                              <button
                                type="button"
                                onClick={() => handleSaveEmployee(false)}
                                className="h-[32px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-l-[8px] flex items-center justify-center transition-all cursor-pointer outline-none shadow-sm border-r border-[#1B4EBA]"
                              >
                                Lưu
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsStep4SaveDropdownOpen(!isStep4SaveDropdownOpen);
                                }}
                                className="h-[32px] px-2.5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-r-[8px] flex items-center justify-center transition-all cursor-pointer outline-none shadow-sm"
                                title="Thêm lựa chọn"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>

                              {isStep4SaveDropdownOpen && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40 bg-transparent" 
                                    onClick={() => setIsStep4SaveDropdownOpen(false)} 
                                  />
                                  <div className="absolute right-0 bottom-full mb-2 bg-white border border-[#E9EAEB] rounded-lg shadow-md z-50 py-1 min-w-[130px] animate-fade-in text-left">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsStep4SaveDropdownOpen(false);
                                        handleSaveEmployee(true);
                                      }}
                                      className="w-full text-left px-3.5 py-2 text-[13px] text-[#101828] hover:bg-[#F9FAFB] font-semibold transition-colors cursor-pointer"
                                    >
                                      Lưu và thêm
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {isRolesPopupOpen && (
                    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4 animate-fade-in font-sans">
                      <div 
                        className="bg-white flex flex-col w-full max-w-[760px] max-h-[85vh] shadow-2xl relative overflow-hidden animate-scale-in"
                        style={{ borderRadius: "12px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header Modal - White background, Black title */}
                        <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#E9EAEB] flex-shrink-0">
                          <h3 className="text-[#101828] font-bold text-[15px] font-sans">
                            Chọn vai trò
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsRolesPopupOpen(false)}
                            className="text-[#717680] hover:text-red-500 p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent outline-none flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 overflow-y-auto max-h-[480px] bg-white text-left">
                          
                          {/* SECTION 1: VAI TRÒ BÁN HÀNG */}
                          <div className="mb-6">
                            <h4 className="text-[12px] font-bold text-[#6B707A] tracking-wider mb-4 pb-1 border-b border-slate-100 uppercase">
                              Vai trò bán hàng
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                              {/* Left Column */}
                              <div className="space-y-4">
                                {[
                                  { name: 'Ghi order', desc: 'Ghi order và phục vụ khách hàng.' },
                                  { name: 'Ghi order kiêm thu tiền', desc: 'Ghi order, phục vụ khách hàng, thu tiền trên điện thoại.' },
                                  { name: 'Thu ngân', desc: 'Ghi yêu cầu đặt chỗ, ghi order, tính tiền và thu tiền.' }
                                ].map((role) => {
                                  const isChecked = selectedPopupRoles.includes(role.name);
                                  return (
                                    <label 
                                      key={role.name} 
                                      className="flex items-start gap-3 cursor-pointer group select-none border-b border-dashed border-slate-100 pb-3 last:border-0 last:pb-0"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setSelectedPopupRoles(prev => prev.filter(r => r !== role.name));
                                          } else {
                                            setSelectedPopupRoles(prev => [...prev, role.name]);
                                          }
                                        }}
                                        className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 mt-0.5 cursor-pointer flex-shrink-0"
                                      />
                                      <div className="flex-1">
                                        <span className="text-[13px] font-bold text-[#245FDF] group-hover:underline">
                                          {role.name}
                                        </span>
                                        <p className="text-[#6B707A] text-[12px] font-normal leading-normal mt-0.5">
                                          {role.desc}
                                        </p>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>

                              {/* Right Column */}
                              <div className="space-y-4">
                                {[
                                  { name: 'Lễ tân', desc: 'Ghi nhận yêu cầu đặt chỗ của khách hàng.' },
                                  { name: 'Bếp', desc: 'Chế biến và trả món, lập phiếu báo hàng.' },
                                  { name: 'Bar', desc: 'Chế biến và trả món, lập phiếu báo hàng.' },
                                  { name: 'Nhân viên kinh doanh', desc: 'Tư vấn dịch vụ cho khách hàng.' },
                                  { name: 'Nhân viên trả đồ', desc: 'Theo dõi món trả và trả đồ cho khách hàng.' },
                                  { name: 'Điều chỉnh giá bán', desc: 'Chỉnh sửa giá món khi order.' }
                                ].map((role) => {
                                  const isChecked = selectedPopupRoles.includes(role.name);
                                  return (
                                    <label 
                                      key={role.name} 
                                      className="flex items-start gap-3 cursor-pointer group select-none border-b border-dashed border-slate-100 pb-3 last:border-0 last:pb-0"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setSelectedPopupRoles(prev => prev.filter(r => r !== role.name));
                                          } else {
                                            setSelectedPopupRoles(prev => [...prev, role.name]);
                                          }
                                        }}
                                        className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 mt-0.5 cursor-pointer flex-shrink-0"
                                      />
                                      <div className="flex-1">
                                        <span className="text-[13px] font-bold text-[#245FDF] group-hover:underline">
                                          {role.name}
                                        </span>
                                        <p className="text-[#6B707A] text-[12px] font-normal leading-normal mt-0.5">
                                          {role.desc}
                                        </p>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* SECTION 2: VAI TRÒ QUẢN LÝ */}
                          <div>
                            <h4 className="text-[12px] font-bold text-[#6B707A] tracking-wider mb-4 pb-1 border-b border-slate-100 uppercase">
                              Vai trò quản lý
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                              {/* Left Column */}
                              <div className="space-y-4">
                                {[
                                  { name: 'Kiểm soát order', desc: 'Xác nhận ghép order, tách order, hủy order, hủy món, chuyển món, chuyển bàn, xác nhận kết quả kiểm đồ và tính tiền.' },
                                  { name: 'Quản lý nhân sự', desc: 'Thiết lập ca, phân ca và theo dõi dữ liệu chấm công của nhân sự.' },
                                  { name: 'Quản lý thực đơn', desc: 'Lập và chỉnh sửa các món trong thực đơn.' },
                                  { name: 'Quản lý nhà hàng', desc: 'Quản lý tất cả hoạt động của nhà hàng.' },
                                  { name: 'Mua hàng', desc: 'Lập đơn đặt hàng, nhập hàng.' }
                                ].map((role) => {
                                  const isChecked = selectedPopupRoles.includes(role.name);
                                  return (
                                    <label 
                                      key={role.name} 
                                      className="flex items-start gap-3 cursor-pointer group select-none border-b border-dashed border-slate-100 pb-3 last:border-0 last:pb-0"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setSelectedPopupRoles(prev => prev.filter(r => r !== role.name));
                                          } else {
                                            setSelectedPopupRoles(prev => [...prev, role.name]);
                                          }
                                        }}
                                        className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 mt-0.5 cursor-pointer flex-shrink-0"
                                      />
                                      <div className="flex-1">
                                        <span className="text-[13px] font-bold text-[#245FDF] group-hover:underline">
                                          {role.name}
                                        </span>
                                        <p className="text-[#6B707A] text-[12px] font-normal leading-normal mt-0.5">
                                          {role.desc}
                                        </p>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>

                              {/* Right Column */}
                              <div className="space-y-4">
                                {[
                                  { name: 'Quản lý khách hàng', desc: 'Giới thiệu thông tin nhà hàng, các chương trình ưu đãi của nhà hàng đến khách hàng trên ứng dụng 5Food.' },
                                  { name: 'Quản lý quỹ tiền mặt', desc: 'Thu - chi tiền mặt và quản lý quỹ tiền mặt.' },
                                  { name: 'Quản lý quỹ tiền gửi', desc: 'Thu - chi tiền gửi và quản lý tiền gửi ngân hàng.' },
                                  { name: 'Nhân viên Marketing', desc: 'Giới thiệu thông tin nhà hàng, triển khai các chương trình khuyến mại và chăm sóc khách hàng.' },
                                  { name: 'Quản lý chi phí', desc: 'Tổng hợp chi phí phát sinh hàng tháng.' },
                                  { name: 'Kế toán thuế', desc: 'Hỗ trợ theo dõi, báo cáo và thực hiện các nghiệp vụ kế toán thuế cho nhà hàng.' }
                                ].map((role) => {
                                  const isChecked = selectedPopupRoles.includes(role.name);
                                  return (
                                    <label 
                                      key={role.name} 
                                      className="flex items-start gap-3 cursor-pointer group select-none border-b border-dashed border-slate-100 pb-3 last:border-0 last:pb-0"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setSelectedPopupRoles(prev => prev.filter(r => r !== role.name));
                                          } else {
                                            setSelectedPopupRoles(prev => [...prev, role.name]);
                                          }
                                        }}
                                        className="text-[#245FDF] focus:ring-[#245FDF] rounded border-slate-300 w-4 h-4 mt-0.5 cursor-pointer flex-shrink-0"
                                      />
                                      <div className="flex-1">
                                        <span className="text-[13px] font-bold text-[#245FDF] group-hover:underline">
                                          {role.name}
                                        </span>
                                        <p className="text-[#6B707A] text-[12px] font-normal leading-normal mt-0.5">
                                          {role.desc}
                                        </p>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50 border-t border-[#E9EAEB] flex justify-end gap-2 flex-shrink-0 select-none">
                          <button
                            type="button"
                            onClick={() => setIsRolesPopupOpen(false)}
                            className="h-[32px] min-w-[72px] px-4 bg-white hover:bg-slate-50 border border-[#D5D7DA] text-slate-700 font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-colors cursor-pointer outline-none"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = empBranches.map(item => 
                                item.id === activeBranchRowIdForRoles ? { ...item, roles: selectedPopupRoles } : item
                              );
                              setEmpBranches(updated);
                              setIsRolesPopupOpen(false);
                              onNotification('Đã lưu vai trò thành công!', 'success');
                            }}
                            className="h-[32px] min-w-[80px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] border-none text-white font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer outline-none shadow-sm"
                          >
                            Đồng ý
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeModalStep === 4 && (
                <div className="flex-1 flex flex-col min-h-0 text-left">

                  {step5Areas.length === 0 ? (
                    <div className="flex-1 flex flex-col justify-center pt-8 pb-14 select-none animate-fade-in bg-white border border-slate-200 rounded-lg -mx-[20px] -mb-[20px]">
                      <div id="setup-step4-tables-editor" className="space-y-6">
                        <div className="text-center max-w-md mx-auto">
                          <h3 className="text-slate-800 font-bold text-[16px] mb-1">
                            Thiết lập sơ đồ phòng bàn
                          </h3>
                          <p className="text-[#6B707A] text-[13px] font-medium leading-relaxed">
                            Vui lòng lựa chọn một phương thức bên dưới để bắt đầu cấu hình sơ đồ khu vực và bàn ăn cho nhà hàng của bạn.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto px-4">
                          {/* Option 1: Thiết lập nhanh */}
                          <div 
                            onClick={handleQuickSetup}
                            className="group border border-slate-200 hover:border-[#245FDF] hover:shadow-md bg-white rounded-xl pt-6 px-6 pb-7 cursor-pointer transition-all flex flex-col justify-between h-[220px] text-left"
                          >
                            <div className="space-y-2">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#245FDF] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <h4 className="text-slate-800 font-bold text-[14px]">
                                Thiết lập nhanh sơ đồ
                              </h4>
                              <p className="text-[#6B707A] text-[12px] font-medium leading-normal">
                                Tạo nhanh sơ đồ bàn ghế, khu vực cho toàn bộ nhà hàng theo các mẫu chuẩn thiết lập sẵn.
                              </p>
                            </div>
                            <span className="text-[13px] font-bold text-[#245FDF] group-hover:underline flex items-center gap-1 mt-3 font-sans">
                              Thiết lập nhanh ngay <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>

                          {/* Option 2: Thêm mới trực tiếp */}
                          <div 
                            onClick={handleOpenAddArea}
                            className="group border border-slate-200 hover:border-[#245FDF] hover:shadow-md bg-white rounded-xl pt-6 px-6 pb-7 cursor-pointer transition-all flex flex-col justify-between h-[220px] text-left"
                          >
                            <div className="space-y-2">
                              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                <PlusCircle className="w-5 h-5" />
                              </div>
                              <h4 className="text-slate-800 font-bold text-[14px]">
                                Thêm mới trực tiếp
                              </h4>
                              <p className="text-[#6B707A] text-[#6B707A] text-[12px] font-medium leading-normal">
                                Tự thêm mới, khai báo từng khu vực hoặc phòng bàn chi tiết theo sơ đồ thực tế.
                              </p>
                            </div>
                            <span className="text-[13px] font-bold text-emerald-600 group-hover:underline flex items-center gap-1 mt-3 font-sans">
                              Thêm mới ngay <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Main tree table */
                    <div className="border-t border-slate-200/65 rounded-none bg-white flex-1 min-h-[300px] overflow-y-auto -mx-[20px] -mb-[20px]">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-[#FAFAFA]">
                          <th className="py-2.5 pl-[20px] pr-4 text-[13px] font-bold text-slate-800 w-52">Ký hiệu</th>
                          <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800">Tên</th>
                          <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800 w-32 text-right">Số bàn</th>
                          <th className="py-2.5 px-4 text-[13px] font-bold text-slate-800 w-32 text-right">Chỗ ngồi</th>
                          <th className="py-2.5 pl-4 pr-[20px] text-[13px] font-bold text-slate-800 w-52 text-center">Thao tác</th>
                        </tr>
                        <tr className="bg-[#FAFAFA] border-b border-[#E9EAEB]">
                          {/* Ký hiệu */}
                          <th className="py-1 pl-[20px] pr-4 w-52">
                            <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                              <div className="w-6 h-full flex items-center justify-center bg-slate-50 border-r border-slate-200 text-slate-500 font-bold select-none text-[13px]">*</div>
                              <input
                                type="text"
                                value={filterStep4Code}
                                onChange={(e) => setFilterStep4Code(e.target.value)}
                                placeholder=""
                                className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                              />
                            </div>
                          </th>
                          {/* Tên */}
                          <th className="py-1 px-4">
                            <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                              <div className="w-6 h-full flex items-center justify-center bg-slate-50 border-r border-slate-200 text-slate-500 font-bold select-none text-[13px]">*</div>
                              <input
                                type="text"
                                value={filterStep4Name}
                                onChange={(e) => setFilterStep4Name(e.target.value)}
                                placeholder=""
                                className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                              />
                            </div>
                          </th>
                          {/* Số bàn */}
                          <th className="py-1 px-4 w-32 text-right">
                            <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                              <select
                                value={filterStep4TablesOp}
                                onChange={(e) => setFilterStep4TablesOp(e.target.value as any)}
                                className="bg-slate-50 text-slate-600 border-r border-slate-200 h-full px-1 text-[13px] font-bold focus:outline-hidden cursor-pointer select-none appearance-none text-center w-[26px] flex-shrink-0"
                              >
                                <option value="=">=</option>
                                <option value="<=">&le;</option>
                                <option value=">=">&ge;</option>
                              </select>
                              <input
                                type="text"
                                value={filterStep4Tables}
                                onChange={(e) => setFilterStep4Tables(e.target.value)}
                                placeholder=""
                                className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold text-right"
                              />
                            </div>
                          </th>
                          {/* Chỗ ngồi */}
                          <th className="py-1 px-4 w-32 text-right">
                            <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                              <select
                                value={filterStep4SeatsOp}
                                onChange={(e) => setFilterStep4SeatsOp(e.target.value as any)}
                                className="bg-slate-50 text-slate-600 border-r border-slate-200 h-full px-1 text-[13px] font-bold focus:outline-hidden cursor-pointer select-none appearance-none text-center w-[26px] flex-shrink-0"
                              >
                                <option value="=">=</option>
                                <option value="<=">&le;</option>
                                <option value=">=">&ge;</option>
                              </select>
                              <input
                                type="text"
                                value={filterStep4Seats}
                                onChange={(e) => setFilterStep4Seats(e.target.value)}
                                placeholder=""
                                className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold text-right"
                              />
                            </div>
                          </th>
                          {/* Thao tác */}
                          <th className="py-1 pl-4 pr-[20px] w-52"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[13px] font-semibold text-slate-700">
                        {step5Areas.filter(area => isAreaVisible(area, step5Areas)).filter((area) => {
                          if (filterStep4Code.trim()) {
                            if (!area.code.toLowerCase().includes(filterStep4Code.trim().toLowerCase())) return false;
                          }
                          if (filterStep4Name.trim()) {
                            if (!area.name.toLowerCase().includes(filterStep4Name.trim().toLowerCase())) return false;
                          }
                          const computedStats = getAreaComputedStats(area, step5Areas);
                          if (filterStep4Tables.trim()) {
                            const val = Number(filterStep4Tables.trim());
                            if (!isNaN(val)) {
                              if (filterStep4TablesOp === '=') {
                                if (computedStats.tables !== val) return false;
                              } else if (filterStep4TablesOp === '<=') {
                                if (computedStats.tables > val) return false;
                              } else if (filterStep4TablesOp === '>=') {
                                if (computedStats.tables < val) return false;
                              }
                            } else {
                              if (!String(computedStats.tables).includes(filterStep4Tables.trim())) return false;
                            }
                          }
                          if (filterStep4Seats.trim()) {
                            const val = Number(filterStep4Seats.trim());
                            if (!isNaN(val)) {
                              if (filterStep4SeatsOp === '=') {
                                if (computedStats.seats !== val) return false;
                              } else if (filterStep4SeatsOp === '<=') {
                                if (computedStats.seats > val) return false;
                              } else if (filterStep4SeatsOp === '>=') {
                                if (computedStats.seats < val) return false;
                              }
                            } else {
                              if (!String(computedStats.seats).includes(filterStep4Seats.trim())) return false;
                            }
                          }
                          return true;
                        }).map((area) => {
                          const computedStats = getAreaComputedStats(area, step5Areas);
                          const hasChildren = step5Areas.some(a => a.parentId === area.id);
                          
                          return (
                            <tr 
                              key={area.id} 
                              className={`hover:bg-slate-50/85 transition-colors ${
                                area.parentId === null ? 'bg-slate-50/30' : ''
                              }`}
                            >
                              {/* Ký hiệu with collapsible tree arrows */}
                              <td className="py-2.5 pr-4" style={{ paddingLeft: `${20 + (area.depth || 0) * 16}px` }}>
                                <div className="flex items-center gap-1.5">
                                  {area.isParent || hasChildren ? (
                                    <button
                                      type="button"
                                      onClick={() => toggleAreaExpand(area.id)}
                                      className="p-1 hover:bg-slate-100 rounded-md transition-all text-slate-500 cursor-pointer inline-flex items-center justify-center"
                                    >
                                      {area.isExpanded ? (
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-700" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="w-6" /> // spacer for alignment
                                  )}
                                  <span className={area.parentId === null ? "font-bold text-slate-900" : "font-medium text-slate-700"}>
                                    {area.code}
                                  </span>
                                </div>
                              </td>

                              {/* Tên */}
                              <td className="py-2.5 px-4 text-slate-900 font-semibold">
                                <span className={area.parentId === null ? "font-bold" : "font-medium"}>
                                  {area.name}
                                </span>
                              </td>

                              {/* Số bàn */}
                              <td className="py-2.5 px-4 text-right text-slate-800 font-bold">
                                {computedStats.tables}
                              </td>

                              {/* Chỗ ngồi */}
                              <td className="py-2.5 px-4 text-right text-slate-800 font-bold">
                                {computedStats.seats}
                              </td>

                              {/* Thao tác */}
                              <td className="py-2.5 pl-4 pr-[20px] text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditStep5Area(area.id)}
                                    className="text-[#245FDF] hover:text-[#1849A9] hover:bg-blue-50 border border-transparent p-1.5 rounded-md transition-all cursor-pointer inline-flex items-center justify-center"
                                    title="Sửa khu vực"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStep5Area(area.id)}
                                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent p-1.5 rounded-md transition-all cursor-pointer inline-flex items-center justify-center"
                                    title="Xóa khu vực"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  )}

                  {/* STEP 5 POPUPS RENDERED INLINE */}


                  {/* THIẾT LẬP NHANH SƠ ĐỒ KHU VỰC VÀ SỐ BÀN POPUP (Restore) */}
                  {isQuickSetupPopupOpen && (
                    <div className={`fixed top-0 left-0 bottom-0 bg-black/40 flex items-center justify-center z-[100100] animate-fade-in p-4 ${
                      isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
                    }`}>
                      <div className="bg-white rounded-[8px] shadow-xl border border-[#E9EAEB] max-w-xl w-full overflow-hidden font-sans">
                        {/* Header - White background with black text */}
                        <div className="bg-white border-b border-[#E9EAEB] px-4 py-3 flex items-center justify-between text-[#101828] flex-shrink-0">
                          <h3 className="font-bold text-[14px]">Thiết lập nhanh sơ đồ nhà hàng</h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onNotification('💡 Trợ giúp thiết lập nhanh sơ đồ nhà hàng!', 'info');
                              }}
                              className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                              title="Giúp"
                            >
                              <HelpCircle className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsQuickSetupPopupOpen(false)}
                              className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Body Form */}
                        <div className="p-5 space-y-4 text-left bg-white text-[13px]">
                          <p className="text-[13px] text-[#344054] font-medium leading-relaxed">
                            Để tạo được sơ đồ nhà hàng, bạn vui lòng trả lời những câu hỏi dưới đây:
                          </p>

                          {/* 1. Nhà hàng có bao nhiêu khu vực? */}
                          <div className="py-2">
                            <label className="block text-[13px] font-bold text-slate-800 mb-3">
                              1. Nhà hàng có bao nhiêu khu vực?
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={quickSetupAreaCount}
                                min={1}
                                max={20}
                                onChange={(e) => setQuickSetupAreaCount(Math.max(1, Math.min(20, Number(e.target.value))))}
                                className="w-24 bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-md px-3 py-1.5 text-[13px] outline-none transition-all font-semibold text-center text-[#101828]"
                              />
                              <button
                                type="button"
                                onClick={handleInitializeQuickSetupRows}
                                className="h-[32px] px-4 border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] rounded-[8px] transition-all cursor-pointer"
                              >
                                Khởi tạo
                              </button>
                            </div>
                          </div>

                          {/* 2. Mỗi khu vực có bao nhiêu bàn? */}
                          <div className="py-2 space-y-3">
                            <label className="block text-[13px] font-bold text-slate-800 mb-3">
                              2. Mỗi khu vực có bao nhiêu bàn?
                            </label>
                            
                            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[220px] overflow-y-auto">
                              <table className="w-full text-left border-collapse text-[13px]">
                                <thead className="bg-[#F8F9FA] border-b border-slate-200 sticky top-0 font-bold text-slate-700 z-10">
                                  <tr>
                                    <th className="px-3 py-2 text-center w-[15%] text-[13px]">Ký hiệu</th>
                                    <th className="px-3 py-2 w-[40%] text-[13px]">Tên khu vực</th>
                                    <th className="px-3 py-2 text-center w-[22%] text-[13px]">Số bàn</th>
                                    <th className="px-3 py-2 text-center w-[23%] text-[13px]">Đánh số bàn từ</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {quickSetupRows.map((row) => (
                                    <tr key={row.key} className="hover:bg-slate-50/50">
                                      <td className="px-3 py-1.5 text-center">
                                        <input
                                          type="text"
                                          value={row.code}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setQuickSetupRows(prev => prev.map(r => r.key === row.key ? { ...r, code: val } : r));
                                          }}
                                          className="w-full bg-white border border-[#D5D7DA] rounded px-2 py-1 text-[13px] text-center focus:border-[#245FDF] outline-none text-[#101828] font-medium"
                                        />
                                      </td>
                                      <td className="px-3 py-1.5">
                                        <input
                                          type="text"
                                          value={row.name}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setQuickSetupRows(prev => prev.map(r => r.key === row.key ? { ...r, name: val } : r));
                                          }}
                                          className="w-full bg-white border border-[#D5D7DA] rounded px-2 py-1 text-[13px] focus:border-[#245FDF] outline-none text-[#101828] font-medium"
                                        />
                                      </td>
                                      <td className="px-3 py-1.5 text-center">
                                        <input
                                          type="number"
                                          value={row.tablesCount}
                                          min={1}
                                          onChange={(e) => {
                                            const val = Math.max(1, Number(e.target.value));
                                            setQuickSetupRows(prev => prev.map(r => r.key === row.key ? { ...r, tablesCount: val } : r));
                                          }}
                                          className="w-full bg-white border border-[#D5D7DA] rounded px-2 py-1 text-[13px] text-center focus:border-[#245FDF] outline-none text-[#101828] font-semibold"
                                        />
                                      </td>
                                      <td className="px-3 py-1.5 text-center">
                                        <input
                                          type="number"
                                          value={row.startFrom}
                                          min={1}
                                          onChange={(e) => {
                                            const val = Math.max(1, Number(e.target.value));
                                            setQuickSetupRows(prev => prev.map(r => r.key === row.key ? { ...r, startFrom: val } : r));
                                          }}
                                          className="w-full bg-white border border-[#D5D7DA] rounded px-2 py-1 text-[13px] text-center focus:border-[#245FDF] outline-none text-[#101828] font-semibold"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* 3. Loại bàn */}
                          <div className="py-2">
                            <label className="block text-[13px] font-bold text-slate-800 mb-3">
                              3. Loại bàn (Số ghế)?
                            </label>
                            <div className="relative w-44">
                              <select
                                value={quickSetupSeats}
                                onChange={(e) => setQuickSetupSeats(Number(e.target.value))}
                                className="w-full h-[36px] border border-[#D5D7DA] rounded bg-white text-[#10141B] text-[13px] font-semibold pl-3 pr-10 focus:ring-1 focus:ring-[#245FDF] focus:border-[#245FDF] focus:outline-hidden cursor-pointer appearance-none"
                              >
                                {[2, 4, 6, 8, 10, 12].map((num) => (
                                  <option key={num} value={num}>{num} ghế</option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-[#6B707A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Footer - Hủy bỏ trước Tiếp tục, no icons */}
                        <div className="px-5 py-3 border-t border-[#E9EAEB] flex items-center justify-end gap-2 bg-[#F8F9FA] flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsQuickSetupPopupOpen(false)}
                            className="h-[32px] px-4 bg-white border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            onClick={handleQuickSetupSubmit}
                            className="h-[32px] px-5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                          >
                            Tiếp tục
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHỌN MẪU BÀN POPUP */}
                  {isSelectTablePatternOpen && createPortal(
                    <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-[100110] animate-fade-in p-4 ${
                      isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
                    }`}>
                      <div className="bg-white rounded-xl shadow-xl border border-[#E9EAEB] max-w-lg w-full overflow-hidden font-sans">
                        {/* Header */}
                        <div className="bg-white border-b border-[#E9EAEB] px-6 h-[62px] flex items-center justify-between">
                          <h3 className="text-[#101828] font-bold text-lg">
                            Chọn mẫu bàn
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsSelectTablePatternOpen(false)}
                            className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 bg-white text-left">
                          <div className="flex items-center gap-3">
                            <label className="text-[13px] font-semibold text-[#344054] w-20 flex-shrink-0">
                              Mẫu bàn
                            </label>
                            <select
                              value={selectedTablePattern}
                              onChange={(e) => setSelectedTablePattern(e.target.value)}
                              className="flex-1 bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-md px-3 py-1.5 text-[13px] outline-none transition-all font-medium text-[#101828]"
                            >
                              <option value="Mẫu 1">Mẫu 1 (Bàn chữ nhật)</option>
                              <option value="Mẫu 2">Mẫu 2 (Bàn tròn)</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-4">
                            {/* Bàn trống */}
                            <div className="flex flex-col items-center gap-4 border border-dashed border-slate-200 p-4 rounded-xl">
                              <span className="text-[13px] font-bold text-slate-700">Bàn trống</span>
                              {renderDemoTable('empty', 'T1')}
                            </div>

                            {/* Đang phục vụ */}
                            <div className="flex flex-col items-center gap-4 border border-dashed border-slate-200 p-4 rounded-xl">
                              <span className="text-[13px] font-bold text-slate-700">Đang phục vụ</span>
                              {renderDemoTable('serving', 'T2')}
                            </div>

                            {/* Đặt trước */}
                            <div className="flex flex-col items-center gap-4 border border-dashed border-slate-200 p-4 rounded-xl">
                              <span className="text-[13px] font-bold text-slate-700">Đặt trước</span>
                              {renderDemoTable('reserved', 'T3')}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-[#E9EAEB] flex items-center justify-end gap-2 bg-white">
                          <button
                            type="button"
                            onClick={() => setIsSelectTablePatternOpen(false)}
                            className="h-[32px] px-4 border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] rounded-[4px] transition-all cursor-pointer"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmTablePattern}
                            className="h-[32px] px-5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-[4px] transition-all cursor-pointer"
                          >
                            Đồng ý
                          </button>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}



                    {isStep5DesignerOpen && createPortal(
                    <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-[100020] animate-fade-in p-4 ${
                      isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
                    }`}>
                      <div className="bg-white rounded-xl shadow-xl border border-[#E9EAEB] max-w-[1440px] w-[95vw] flex flex-col h-[90vh] overflow-hidden font-sans select-none text-left">
                        {/* Header - White background, black title with Help Circle icon */}
                        <div className="bg-white border-b border-[#E9EAEB] px-6 h-[54px] flex items-center justify-between flex-shrink-0">
                          <h3 className="text-[#101828] font-extrabold text-[15px] font-sans flex items-center gap-2">
                            {step5PopupMode === 'add' ? 'Thêm mới khu vực & Thiết lập sơ đồ' : `Thiết lập sơ đồ & Thông tin khu vực: ${step5AreaName || ''}`}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onNotification('💡 Trợ giúp: Nhập thông tin khu vực ở cột trái. Kéo thả các bàn, cửa hoặc phòng để thay đổi vị trí. Rê chuột vào bàn để đổi kiểu dáng, số lượng ghế hoặc xóa bàn.', 'info');
                              }}
                              className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                              title="Giúp"
                            >
                              <HelpCircle className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsStep5DesignerOpen(false)}
                              className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                              title="Đóng"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Split Main Area */}
                        <div className="flex-1 flex overflow-hidden">
                          {/* Left Panel: Form details and CAD-like design options */}
                          <div className="w-[285px] border-r border-[#E9EAEB] bg-[#F8F9FA] flex flex-col justify-start overflow-y-auto flex-shrink-0 p-4 space-y-4">
                            {/* SECTION 1: THÔNG TIN KHU VỰC */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
                                <MapPin className="w-4 h-4 text-[#245FDF]" />
                                <span className="text-[12px] font-extrabold text-[#101828] uppercase tracking-wider">Thông tin khu vực</span>
                              </div>
                              
                              {/* Tên khu vực */}
                              <div className="space-y-1.5 text-left">
                                <label className="text-[12px] font-bold text-[#344054]">
                                  Tên khu vực <span className="text-red-500">(*)</span>
                                </label>
                                <input
                                  type="text"
                                  value={step5AreaName}
                                  onChange={(e) => setStep5AreaName(e.target.value)}
                                  placeholder="Ví dụ: Tầng 1, Sân thượng..."
                                  className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-md px-3 py-1.5 text-[13px] outline-none transition-all font-medium text-[#101828]"
                                />
                              </div>

                              {/* Ký hiệu */}
                              <div className="space-y-1.5 text-left">
                                <label className="text-[12px] font-bold text-[#344054]">
                                  Ký hiệu khu vực <span className="text-red-500">(*)</span>
                                </label>
                                <input
                                  type="text"
                                  value={areaCode}
                                  onChange={(e) => setAreaCode(e.target.value)}
                                  placeholder="Ví dụ: T1, ST..."
                                  className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-md px-3 py-1.5 text-[13px] outline-none transition-all font-medium text-[#101828]"
                                />
                              </div>

                              {/* Thuộc */}
                              <div className="space-y-1.5 text-left">
                                <label className="text-[12px] font-bold text-[#344054]">
                                  Thuộc (khu vực)
                                </label>
                                <select
                                  value={areaParentId}
                                  onChange={(e) => setAreaParentId(e.target.value)}
                                  className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-md px-3 py-1.5 text-[13px] outline-none transition-all font-medium text-[#101828] cursor-pointer"
                                >
                                  <option value="none">-- Khu vực độc lập (Không phân cấp) --</option>
                                  {step5Areas.filter(a => a.id !== editingAreaId).map(a => (
                                    <option key={a.id} value={a.id}>
                                      {a.name} ({a.code})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Mô tả */}
                              <div className="space-y-1.5 text-left">
                                <label className="text-[12px] font-bold text-[#344054]">
                                  Mô tả chi tiết
                                </label>
                                <textarea
                                  value={step5AreaDescription}
                                  onChange={(e) => setStep5AreaDescription(e.target.value)}
                                  placeholder="Ví dụ: Khu dã ngoại ngoài trời..."
                                  rows={2}
                                  className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-md px-3 py-1.5 text-[13px] outline-none transition-all font-medium text-[#101828]"
                                />
                              </div>
                            </div>

                            {/* SECTION 2: CÔNG CỤ THIẾT KẾ SƠ ĐỒ */}
                            <div className="space-y-4 pt-4 border-t border-slate-200">
                              <div className="flex items-center gap-1.5 pb-1">
                                <LayoutGrid className="w-4 h-4 text-[#245FDF]" />
                                <span className="text-[12px] font-extrabold text-[#101828] uppercase tracking-wider">Thêm vật thể vào sơ đồ</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={handleAddDesignerTable}
                                  className="h-[36px] px-2 bg-white hover:bg-[#245FDF]/5 border border-[#245FDF] text-[#245FDF] font-bold text-[12px] rounded-[8px] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                  Thêm bàn
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newId = 'door-' + Date.now();
                                    setDesignerDoors(prev => [...prev, { id: newId, x: 20, y: 80 }]);
                                    onNotification('✨ Đã thêm Cửa mới vào sơ đồ. Hãy kéo thả đến vị trí phù hợp!', 'success');
                                  }}
                                  className="h-[36px] px-2 bg-white hover:bg-slate-50 border border-[#D5D7DA] text-slate-700 font-bold text-[12px] rounded-[8px] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5 text-slate-500" />
                                  Thêm cửa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newId = 'room-' + Date.now();
                                    const roomNumber = designerRooms.length + 1;
                                    setDesignerRooms(prev => [...prev, { id: newId, name: `Phòng ${roomNumber}`, x: 80, y: 80, w: 320, h: 160 }]);
                                    onNotification('✨ Đã thêm Phòng mới vào sơ đồ. Hãy kéo thả và kéo giãn để căn chỉnh!', 'success');
                                  }}
                                  className="h-[36px] px-2 bg-white hover:bg-[#245FDF]/5 border border-[#245FDF]/60 text-[#245FDF] font-bold text-[12px] rounded-[8px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs col-span-2"
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#245FDF]" />
                                  Thêm phòng
                                </button>
                              </div>

                              {/* SECTION 3: TÙY CHỈNH HÌNH NỀN & KIỂU DÁNG */}
                              <div className="space-y-3 pt-3 border-t border-dashed border-slate-200">
                                <div className="space-y-1.5 text-left">
                                  <label className="text-[12px] font-bold text-[#344054]">
                                    Ảnh nền (Lưới sàn)
                                  </label>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {[
                                      { name: 'Không nền', value: null },
                                      { name: 'Kiến trúc', value: 'architect' },
                                      { name: 'Kỹ thuật', value: 'technical' },
                                      { name: 'Sàn gỗ sồi', value: 'wood' }
                                    ].map(p => (
                                      <button
                                        key={String(p.value)}
                                        type="button"
                                        onClick={() => {
                                          setDesignerBgPattern(p.value);
                                          onNotification('🎨 Đã áp dụng ảnh nền: ' + p.name + '!', 'info');
                                        }}
                                        className={`h-[36px] text-[12px] font-bold rounded-[8px] border transition-all cursor-pointer ${
                                          designerBgPattern === p.value
                                            ? 'border-[#245FDF] bg-[#245FDF]/5 text-[#245FDF]'
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                      >
                                        {p.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                  <label className="text-[12px] font-bold text-[#344054]">
                                    Đổi loại bàn hàng loạt
                                  </label>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {['Bàn chữ nhật', 'Bàn tròn'].map(shape => (
                                      <button
                                        key={shape}
                                        type="button"
                                        onClick={() => {
                                          setDesignerTables(prev => prev.map(t => ({ ...t, shape: shape })));
                                          onNotification('🔄 Đã chuyển tất cả bàn sang kiểu dáng: ' + shape + '!', 'success');
                                        }}
                                        className="h-[36px] text-[12px] font-bold rounded-[8px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center text-center"
                                      >
                                        {shape.replace('Bàn ', '')}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Panel: Drag and drop visualization workspace */}
                          <div className="flex-1 bg-slate-100 p-5 overflow-hidden flex flex-col justify-between">
                            {/* Header of the workspace */}
                            <div className="mb-2 select-none">
                              <span className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#245FDF] animate-pulse" />
                                Màn hình bố trí bàn (Kéo thả để căn chỉnh)
                              </span>
                            </div>

                            <div 
                              className="flex-1 bg-white border border-[#D5D7DA] rounded-lg relative overflow-hidden select-none"
                              onMouseMove={handleCanvasMouseMove}
                              onMouseUp={handleCanvasMouseUp}
                              onMouseLeave={handleCanvasMouseUp}
                              onMouseDown={handleCanvasMouseDown}
                              style={{
                                backgroundImage: designerBgPattern === 'architect' 
                                  ? 'linear-gradient(#F1F5F9 1px, transparent 1px), linear-gradient(90deg, #F1F5F9 1px, transparent 1px)'
                                  : designerBgPattern === 'technical'
                                  ? 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)'
                                  : designerBgPattern === 'wood'
                                  ? 'linear-gradient(rgba(244, 63, 94, 0.05) 1px, transparent 1px)'
                                  : 'none',
                                backgroundSize: designerBgPattern === 'architect' ? '30px 30px' : designerBgPattern === 'technical' ? '20px 20px' : 'none',
                                backgroundColor: designerBgPattern === 'wood' ? '#FAF9F6' : '#FFFFFF'
                              }}
                            >
                              {/* Smart Guides (Auto-alignment indicators like Figma) */}
                              {activeGuides?.x !== undefined && (
                                <div 
                                  className="absolute top-0 bottom-0 border-l border-dashed border-rose-500 z-30 pointer-events-none"
                                  style={{ left: `${activeGuides.x}px` }}
                                >
                                  <div className="absolute top-2 left-1.5 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow-xs font-mono font-bold whitespace-nowrap">
                                    Căn lề X: {activeGuides.x}px
                                  </div>
                                </div>
                              )}
                              {activeGuides?.y !== undefined && (
                                <div 
                                  className="absolute left-0 right-0 border-t border-dashed border-rose-500 z-30 pointer-events-none"
                                  style={{ top: `${activeGuides.y}px` }}
                                >
                                  <div className="absolute left-2.5 top-1.5 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow-xs font-mono font-bold whitespace-nowrap">
                                    Căn lề Y: {activeGuides.y}px
                                  </div>
                                </div>
                              )}

                              {/* Global transparent close overlay for door action dropdown */}
                              {openDoorDropdownId && (
                                <div 
                                  className="absolute inset-0 z-15 bg-transparent" 
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setOpenDoorDropdownId(null);
                                  }} 
                                />
                              )}

                              {/* Render Doors */}
                              {designerDoors.map((door) => {
                                const angle = (door as any).angle || 0;
                                const isDropdownOpen = openDoorDropdownId === door.id;
                                return (
                                  <div
                                    key={door.id}
                                    className={`absolute select-none cursor-grab active:cursor-grabbing group transition-transform duration-200 ${
                                      isDropdownOpen ? 'z-30' : 'z-20'
                                    }`}
                                    style={{ 
                                      left: door.x + 'px', 
                                      top: door.y + 'px',
                                      transform: `rotate(${angle}deg)`,
                                      transformOrigin: 'center'
                                    }}
                                    onMouseDown={(e) => {
                                      handleElementMouseDown(e, door.id, 'door');
                                    }}
                                  >
                                    <div className="relative">
                                      <svg width="40" height="80" viewBox="0 0 40 80" className="text-[#245FDF]">
                                        <line x1="2" y1="0" x2="2" y2="80" stroke="#94A3B8" strokeWidth="2" />
                                        <path d="M 2 40 A 38 38 0 0 0 40 2 L 2 2" fill="none" stroke="#245FDF" strokeWidth="2" />
                                        <path d="M 2 40 A 38 38 0 0 1 40 78 L 2 78" fill="none" stroke="#245FDF" strokeWidth="2" />
                                      </svg>

                                      {/* Action Button - appears on hover, or stays visible when dropdown is open */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          if (openDoorDropdownId === door.id) {
                                            setOpenDoorDropdownId(null);
                                            setDoorDropdownCoords(null);
                                          } else {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setOpenDoorDropdownId(door.id);
                                            setDoorDropdownCoords({
                                              top: rect.bottom + window.scrollY,
                                              left: rect.left + window.scrollX,
                                              doorId: door.id
                                            });
                                          }
                                        }}
                                        className={`absolute -top-3 -right-3 bg-white border border-[#D5D7DA] hover:bg-slate-50 text-[#6B707A] hover:text-[#10141B] rounded-full w-6 h-6 flex items-center justify-center transition-opacity shadow-md cursor-pointer z-30 ${
                                          isDropdownOpen ? 'opacity-100 ring-2 ring-[#245FDF]' : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                        title="Thao tác cửa"
                                      >
                                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Render Rooms */}
                              {designerRooms.map((room) => {
                                const w = room.w || 320;
                                const h = room.h || 160;
                                return (
                                  <div
                                    key={room.id}
                                    className="absolute select-none cursor-grab active:cursor-grabbing group bg-[#F0F6FE]/10 border-2 border-dashed border-[#245FDF]/35 hover:border-[#245FDF]/70 hover:bg-[#F0F6FE]/20 rounded-lg transition-colors"
                                    style={{ 
                                      left: room.x + 'px', 
                                      top: room.y + 'px',
                                      width: w + 'px',
                                      height: h + 'px',
                                      zIndex: 5
                                    }}
                                    onMouseDown={(e) => handleElementMouseDown(e, room.id, 'room')}
                                  >
                                    {/* Room name tag inside - Elegant styled container resembling the image */}
                                    <div className="absolute top-0 left-0 bg-white border-r-2 border-b-2 border-[#245FDF] px-3 py-1 text-[13px] font-extrabold text-[#245FDF] rounded-tl-md rounded-br-md shadow-2xs z-10 flex items-center gap-1.5 select-none">
                                      <input
                                        type="text"
                                        value={room.name}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setDesignerRooms(prev => prev.map(r => r.id === room.id ? { ...r, name: val } : r));
                                        }}
                                        className="bg-transparent border-none font-bold text-[13px] text-[#245FDF] focus:outline-none w-20 focus:bg-slate-50 px-1 rounded text-left"
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                      />
                                    </div>

                                    {/* Delete Room button */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDesignerRooms(prev => prev.filter(r => r.id !== room.id));
                                      }}
                                      className="absolute -top-2.5 -right-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer border-none z-30"
                                      title="Xóa phòng"
                                    >
                                      ✕
                                    </button>

                                    {/* RESIZE HANDLES */}
                                    {/* Right edge resize grip */}
                                    <div
                                      className="absolute top-2 right-0 bottom-2 w-2 hover:bg-[#245FDF]/30 cursor-ew-resize flex items-center justify-center transition-colors rounded-r z-20"
                                      onMouseDown={(e) => handleResizeMouseDown(e, room.id, 'w')}
                                      title="Kéo rộng/hẹp"
                                    >
                                      <div className="w-[2px] h-6 bg-slate-400 rounded-full group-hover:bg-[#245FDF]" />
                                    </div>

                                    {/* Bottom edge resize grip */}
                                    <div
                                      className="absolute left-2 bottom-0 right-2 h-2 hover:bg-[#245FDF]/30 cursor-ns-resize flex items-center justify-center transition-colors rounded-b z-20"
                                      onMouseDown={(e) => handleResizeMouseDown(e, room.id, 'h')}
                                      title="Kéo dài/ngắn"
                                    >
                                      <div className="h-[2px] w-6 bg-slate-400 rounded-full group-hover:bg-[#245FDF]" />
                                    </div>

                                    {/* Bottom-right corner resize grip */}
                                    <div
                                      className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-20"
                                      onMouseDown={(e) => handleResizeMouseDown(e, room.id, 'se')}
                                      title="Kéo giãn 2 chiều"
                                    >
                                      <svg width="10" height="10" viewBox="0 0 10 10" className="text-slate-400 hover:text-[#245FDF] transition-colors">
                                        <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <line x1="8" y1="5" x2="5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                      </svg>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Render Tables */}
                              {designerTables.map((tbl) => {
                                const isSelected = draggingElement?.id === tbl.id;
                                const isTableSelected = selectedTableIds.includes(tbl.id);
                                
                                // Dynamic background colors style based on custom styling or status
                                const bgHex = tbl.customColor || (
                                  tbl.status === 'serving' 
                                    ? '#94A3B8' 
                                    : tbl.status === 'booked' 
                                    ? '#FDB022' 
                                    : '#245FDF'
                                );
                                const textHex = tbl.status === 'booked' && !tbl.customColor ? '#451a03' : '#FFFFFF';

                                let width = 88;
                                let height = 60;
                                if (tbl.shape === 'Bàn tròn') {
                                  width = 78;
                                  height = 78;
                                } else if (tbl.shape === 'Bàn vuông') {
                                  width = 70;
                                  height = 70;
                                }

                                return (
                                  <div
                                    key={tbl.id}
                                    onMouseDown={(e) => handleElementMouseDown(e, tbl.id, 'table')}
                                    className={`absolute select-none flex items-center justify-center transition-all group z-10 ${
                                      isSelected ? 'cursor-grabbing shadow-lg' : 'cursor-grab hover:shadow-md'
                                    } ${isTableSelected ? 'ring-2 ring-[#245FDF] ring-offset-2 rounded-[8px]' : ''}`}
                                    style={{ left: tbl.x + 'px', top: tbl.y + 'px', width: width + 'px', height: height + 'px' }}
                                  >
                                    <div className="relative w-full h-full flex items-center justify-center">
                                      {tbl.shape === 'Bàn tròn' ? (
                                        <>
                                          {/* Radial chairs around round table */}
                                          {(() => {
                                            const chairs = [];
                                            const seatsCount = tbl.seats || 6;
                                            for (let i = 0; i < seatsCount; i++) {
                                              const angle = (i * 2 * Math.PI) / seatsCount;
                                              const radius = 28;
                                              const cx = width / 2 + radius * Math.cos(angle);
                                              const cy = height / 2 + radius * Math.sin(angle);
                                              chairs.push({ cx, cy, angle });
                                            }
                                            return chairs.map((chair, cIdx) => {
                                              const rot = (chair.angle * 180) / Math.PI + 90;
                                              return (
                                                <div
                                                  key={cIdx}
                                                  className="absolute w-[12px] h-[6px] rounded-[1.5px]"
                                                  style={{
                                                    left: (chair.cx - 6) + 'px',
                                                    top: (chair.cy - 3) + 'px',
                                                    transform: 'rotate(' + rot + 'deg)',
                                                    backgroundColor: bgHex
                                                  }}
                                                />
                                              );
                                            });
                                          })()}
                                          
                                          {/* Table circle body */}
                                          <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center shadow-xs" style={{ backgroundColor: bgHex }}>
                                            <span className="text-[12px] font-bold select-none" style={{ color: textHex }}>
                                              {tbl.name.match(/\d+$/)?.[0] || tbl.name.replace(/^\D+/, '') || tbl.name}
                                            </span>
                                          </div>
                                        </>
                                      ) : tbl.shape === 'Bàn vuông' ? (
                                        <>
                                          {/* Chairs on 4 sides, distributed based on tbl.seats */}
                                          {(() => {
                                            const seatsCount = tbl.seats || 4;
                                            const chairs = [];
                                            if (seatsCount <= 2) {
                                              chairs.push(<div key="l" className="absolute left-1 top-1/2 -translate-y-1/2 w-[6px] h-3.5 rounded-l-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              chairs.push(<div key="r" className="absolute right-1 top-1/2 -translate-y-1/2 w-[6px] h-3.5 rounded-r-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                            } else if (seatsCount === 4) {
                                              chairs.push(<div key="t" className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-[6px] rounded-t-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              chairs.push(<div key="b" className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-[6px] rounded-b-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              chairs.push(<div key="l" className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[6px] h-3.5 rounded-l-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              chairs.push(<div key="r" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[6px] h-3.5 rounded-r-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                            } else {
                                              const perSide = Math.floor(seatsCount / 4);
                                              const remainder = seatsCount % 4;

                                              // Top
                                              const topCount = perSide + (remainder > 0 ? 1 : 0);
                                              for (let i = 0; i < topCount; i++) {
                                                const leftOffset = topCount > 1 ? `${20 + (i * 60) / (topCount - 1)}%` : '50%';
                                                chairs.push(<div key={`t-${i}`} className="absolute top-1.5 w-3.5 h-[6px] rounded-t-[1.5px] -translate-x-1/2" style={{ left: leftOffset, backgroundColor: bgHex }} />);
                                              }
                                              // Bottom
                                              const bottomCount = perSide + (remainder > 1 ? 1 : 0);
                                              for (let i = 0; i < bottomCount; i++) {
                                                const leftOffset = bottomCount > 1 ? `${20 + (i * 60) / (bottomCount - 1)}%` : '50%';
                                                chairs.push(<div key={`b-${i}`} className="absolute bottom-1.5 w-3.5 h-[6px] rounded-b-[1.5px] -translate-x-1/2" style={{ left: leftOffset, backgroundColor: bgHex }} />);
                                              }
                                              // Left
                                              const leftCount = perSide + (remainder > 2 ? 1 : 0);
                                              for (let i = 0; i < leftCount; i++) {
                                                const topOffset = leftCount > 1 ? `${20 + (i * 60) / (leftCount - 1)}%` : '50%';
                                                chairs.push(<div key={`l-${i}`} className="absolute left-1.5 w-[6px] h-3.5 rounded-l-[1.5px] -translate-y-1/2" style={{ top: topOffset, backgroundColor: bgHex }} />);
                                              }
                                              // Right
                                              const rightCount = perSide;
                                              for (let i = 0; i < rightCount; i++) {
                                                const topOffset = rightCount > 1 ? `${20 + (i * 60) / (rightCount - 1)}%` : '50%';
                                                chairs.push(<div key={`r-${i}`} className="absolute right-1.5 w-[6px] h-3.5 rounded-r-[1.5px] -translate-y-1/2" style={{ top: topOffset, backgroundColor: bgHex }} />);
                                              }
                                            }
                                            return chairs;
                                          })()}
                                          
                                          {/* Table square body */}
                                          <div className="w-[38px] h-[38px] rounded-[4px] flex items-center justify-center shadow-xs" style={{ backgroundColor: bgHex }}>
                                            <span className="text-[12px] font-bold select-none" style={{ color: textHex }}>
                                              {tbl.name.match(/\d+$/)?.[0] || tbl.name.replace(/^\D+/, '') || tbl.name}
                                            </span>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          {/* Rectangular table */}
                                          {(() => {
                                            const seatsCount = tbl.seats || 6;
                                            const chairs = [];
                                            if (seatsCount <= 2) {
                                              chairs.push(<div key="t" className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[13px] h-[6px] rounded-t-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              chairs.push(<div key="b" className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[13px] h-[6px] rounded-b-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                            } else if (seatsCount === 4) {
                                              chairs.push(<div key="t" className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[13px] h-[6px] rounded-t-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              chairs.push(<div key="b" className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[13px] h-[6px] rounded-b-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              chairs.push(<div key="l" className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[6px] h-[13px] rounded-l-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              chairs.push(<div key="r" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[6px] h-[13px] rounded-r-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                            } else {
                                              chairs.push(<div key="l" className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[6px] h-[13px] rounded-l-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              chairs.push(<div key="r" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[6px] h-[13px] rounded-r-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              
                                              const sideCount = Math.floor((seatsCount - 2) / 2);
                                              for (let i = 0; i < sideCount; i++) {
                                                const centerX = sideCount > 1 ? (30 + (i * 28) / (sideCount - 1)) : 44;
                                                chairs.push(<div key={`t-${i}`} className="absolute top-1.5 w-[13px] h-[6px] rounded-t-[1.5px] -translate-x-1/2" style={{ left: `${centerX}px`, backgroundColor: bgHex }} />);
                                                chairs.push(<div key={`b-${i}`} className="absolute bottom-1.5 w-[13px] h-[6px] rounded-b-[1.5px] -translate-x-1/2" style={{ left: `${centerX}px`, backgroundColor: bgHex }} />);
                                              }
                                              if ((seatsCount - 2) % 2 !== 0) {
                                                chairs.push(<div key="t-extra" className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[13px] h-[6px] rounded-t-[1.5px]" style={{ backgroundColor: bgHex }} />);
                                              }
                                            }
                                            return chairs;
                                          })()}
                                          
                                          {/* Table rectangle body */}
                                          <div className="w-[56px] h-[30px] rounded-[4px] flex items-center justify-center shadow-xs" style={{ backgroundColor: bgHex }}>
                                            <span className="text-[12px] font-bold select-none" style={{ color: textHex }}>
                                              {tbl.name.match(/\d+$/)?.[0] || tbl.name.replace(/^\D+/, '') || tbl.name}
                                            </span>
                                          </div>
                                        </>
                                      )}

                                      {/* Settings button shown on hover or when dropdown is open */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (activeTableDropdownId === tbl.id) {
                                            setActiveTableDropdownId(null);
                                            setTableDropdownCoords(null);
                                          } else {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setActiveTableDropdownId(tbl.id);
                                            setTableDropdownCoords({
                                              top: rect.bottom + window.scrollY,
                                              left: rect.left + window.scrollX,
                                              tblId: tbl.id
                                            });
                                            setActiveSubmenu(null);
                                          }
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className={`absolute -top-2.5 -right-2.5 w-6 h-6 bg-white border rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all z-40 ${
                                          activeTableDropdownId === tbl.id 
                                            ? 'opacity-100 bg-[#F0F6FE] border-[#245FDF] text-[#245FDF]' 
                                            : 'opacity-0 group-hover:opacity-100 bg-white border-[#D5D7DA] text-[#6B707A] hover:text-[#245FDF] hover:bg-[#F0F6FE] hover:border-[#245FDF]'
                                        }`}
                                        title="Cài đặt bàn"
                                      >
                                        <Settings className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Drag Selection Box overlay */}
                              {dragSelectionBox && (() => {
                                const left = Math.min(dragSelectionBox.startX, dragSelectionBox.currentX);
                                const top = Math.min(dragSelectionBox.startY, dragSelectionBox.currentY);
                                const width = Math.abs(dragSelectionBox.startX - dragSelectionBox.currentX);
                                const height = Math.abs(dragSelectionBox.startY - dragSelectionBox.currentY);
                                return (
                                  <div 
                                    className="absolute border-2 border-dashed border-[#245FDF] bg-[#245FDF]/10 rounded pointer-events-none z-50"
                                    style={{ left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` }}
                                  />
                                );
                              })()}

                              {/* Floating Bulk Actions Bar */}
                              {selectedTableIds.length > 1 && (
                                <div 
                                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-row flex-nowrap items-center gap-3 px-4 py-2.5 bg-white border border-[#E9EAEB] rounded-xl shadow-2xl animate-fade-in text-[13px] text-[#10141B] font-sans font-semibold whitespace-nowrap"
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <span className="text-[#245FDF] bg-[#F0F6FE] px-2 py-1 rounded-md text-[12px] whitespace-nowrap flex-shrink-0">
                                    Đã chọn {selectedTableIds.length} bàn
                                  </span>

                                  <div className="h-4 w-px bg-[#E9EAEB] flex-shrink-0" />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const dummyTbl = {
                                        id: 'bulk',
                                        name: 'Hàng loạt',
                                        seats: designerTables.find(t => selectedTableIds.includes(t.id))?.seats || 6,
                                        shape: designerTables.find(t => selectedTableIds.includes(t.id))?.shape || 'Bàn chữ nhật',
                                        status: 'empty'
                                      };
                                      setEditingTableInModal(dummyTbl);
                                      setModalTableName('Hàng loạt');
                                      setModalTableSeats(dummyTbl.seats);
                                      setModalTableShape(dummyTbl.shape);
                                      setModalTableStatus('empty');
                                    }}
                                    className="h-[32px] px-3 bg-white hover:bg-[#F0F6FE] hover:text-[#245FDF] border border-[#D5D7DA] hover:border-[#245FDF] text-[#101828] font-bold rounded-[6px] transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-[#FF7A00]" />
                                    <span className="whitespace-nowrap">Thiết lập chung</span>
                                  </button>

                                  <div className="h-4 w-px bg-[#E9EAEB] flex-shrink-0" />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDesignerTables(prev => prev.filter(t => !selectedTableIds.includes(t.id)));
                                      setSelectedTableIds([]);
                                      onNotification(`🗑️ Đã loại bỏ các bàn đã chọn thành công!`, 'info');
                                    }}
                                    className="h-[32px] px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-[6px] transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5 text-red-500" />
                                    <span className="whitespace-nowrap">Loại bỏ</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setSelectedTableIds([])}
                                    className="h-[32px] w-[32px] bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-[6px] flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                                    title="Hủy chọn"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}

                              {designerTables.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#717680] text-[13px] font-bold gap-2">
                                  <span className="text-lg">🪑 Sơ đồ trống</span>
                                  <span>Thêm bàn ở cột bên trái hoặc sử dụng "Thiết lập nhanh sơ đồ"</span>
                                </div>
                              )}
                            </div>

                            {/* Legend & Statistics Footer */}
                            <div className="bg-[#F8F9FA] border border-[#E9EAEB] border-t-0 p-3 rounded-b-lg text-[13px] text-slate-600 font-semibold text-left flex items-center justify-between flex-shrink-0 select-none">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#245FDF]" /> Bàn trống</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#94A3B8]" /> Đang phục vụ</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#FDB022]" /> Đã đặt trước</span>
                              </div>
                              <div className="text-[#101828] font-bold">
                                Tổng số: <span className="text-[#245FDF]">{designerTables.length} bàn</span> • Chỗ ngồi: <span className="text-[#245FDF]">{designerTables.reduce((sum, t) => sum + t.seats, 0)} ghế</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer containing the primary action buttons */}
                        <div className="px-6 py-4 border-t border-[#E9EAEB] flex items-center justify-between bg-white flex-shrink-0">
                          <div>
                            <button
                              type="button"
                              onClick={() => setIsDesignerQuickSetupOpen(true)}
                              className="h-[36px] px-4 bg-white border border-[#245FDF] hover:bg-[#245FDF]/5 text-[#245FDF] font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center"
                            >
                              Thiết lập nhanh sơ đồ
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsStep5DesignerOpen(false)}
                              className="h-[36px] px-5 border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveArea}
                              className="h-[36px] px-6 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                            >
                              Lưu
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>,
                    document.body
                  )}

                  {/* DOOR DROPDOWN PORTAL */}
                  {doorDropdownCoords && createPortal(
                    <div 
                      className="fixed bg-white border border-[#E9EAEB] rounded-lg shadow-xl py-1.5 min-w-[150px] z-[100200] font-sans text-[13px] text-[#10141B] animate-fade-in text-left shadow-2xl"
                      style={{ top: doorDropdownCoords.top + 'px', left: doorDropdownCoords.left + 'px' }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setDesignerDoors(prev => prev.map(d => d.id === doorDropdownCoords.doorId ? { ...d, angle: (((d as any).angle || 0) + 90) % 360 } : d));
                          setOpenDoorDropdownId(null);
                          setDoorDropdownCoords(null);
                          onNotification('🔄 Đã xoay cửa 90°!', 'info');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#F0F6FE] hover:text-[#245FDF] flex items-center gap-2 cursor-pointer font-semibold border-none bg-transparent"
                      >
                        <RefreshCw className="w-4 h-4 text-[#245FDF]" />
                        <span>Xoay cửa 90°</span>
                      </button>

                      <div className="h-px bg-[#E9EAEB] my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setDesignerDoors(prev => prev.filter(d => d.id !== doorDropdownCoords.doorId));
                          setOpenDoorDropdownId(null);
                          setDoorDropdownCoords(null);
                          onNotification('🗑️ Đã xóa cửa thành công!', 'info');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer font-semibold border-none bg-transparent"
                      >
                        <X className="w-4 h-4 text-red-500" />
                        <span>Xóa cửa</span>
                      </button>
                    </div>,
                    document.body
                  )}

                  {/* TABLE DROPDOWN PORTAL */}
                  {tableDropdownCoords && createPortal(
                    <div 
                      className="fixed bg-white border border-[#E9EAEB] rounded-lg shadow-xl py-1.5 min-w-[170px] z-[100200] font-sans text-[13px] text-[#10141B] animate-fade-in text-left shadow-2xl"
                      style={{ top: tableDropdownCoords.top + 'px', left: tableDropdownCoords.left + 'px' }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Option 1: Thiết lập bàn */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const tbl = designerTables.find(t => t.id === tableDropdownCoords.tblId);
                          if (tbl) {
                            setEditingTableInModal(tbl);
                            setModalTableName(tbl.name);
                            setModalTableSeats(tbl.seats || 6);
                            setModalTableShape(tbl.shape || 'Bàn vuông');
                            setModalTableStatus(tbl.status || 'empty');
                          }
                          setActiveTableDropdownId(null);
                          setTableDropdownCoords(null);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#F0F6FE] hover:text-[#245FDF] flex items-center gap-2 cursor-pointer font-semibold border-none bg-transparent"
                      >
                        <Edit className="w-4 h-4 text-[#FF7A00]" />
                        <span>Thiết lập bàn</span>
                      </button>

                      <div className="h-px bg-[#E9EAEB] my-1" />

                      {/* Option 3: Loại bỏ bàn */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDesignerTables(prev => prev.filter(t => t.id !== tableDropdownCoords.tblId));
                          setActiveTableDropdownId(null);
                          setTableDropdownCoords(null);
                          onNotification('🗑️ Đã xóa bàn thành công!', 'info');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer font-semibold border-none bg-transparent"
                      >
                        <X className="w-4 h-4 text-red-500" />
                        <span>Loại bỏ bàn</span>
                      </button>
                    </div>,
                    document.body
                  )}

                  {/* MODAL THIẾT LẬP THÔNG TIN BÀN CHI TIẾT */}
                  {editingTableInModal && createPortal(
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100100] animate-fade-in p-4">
                      <div className="bg-white rounded-[8px] shadow-xl border border-[#E9EAEB] max-w-sm w-full overflow-hidden font-sans">
                        {/* Header - White background with black text */}
                        <div className="bg-white border-b border-[#E9EAEB] px-4 py-3 flex items-center justify-between text-[#101828] flex-shrink-0">
                          <h3 className="font-bold text-[14px] text-black">Thiết lập bàn</h3>
                          <button
                            type="button"
                            onClick={() => setEditingTableInModal(null)}
                            className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Body Form */}
                        <div className="p-5 space-y-4 text-left bg-white text-[13px]">
                          {/* Số bàn */}
                          {editingTableInModal.id !== 'bulk' && (
                            <div className="flex items-center gap-3">
                              <label className="text-[13px] font-semibold text-[#101828] w-[110px] flex-shrink-0">
                                Số bàn <span className="text-red-500">(*)</span>
                              </label>
                              <input
                                type="text"
                                value={modalTableName}
                                onChange={(e) => setModalTableName(e.target.value)}
                                className="flex-1 bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-3 h-[32px] text-[13px] outline-none font-semibold text-[#101828]"
                              />
                            </div>
                          )}

                          {/* Số ghế */}
                          <div className="flex items-center gap-3">
                            <label className="text-[13px] font-semibold text-[#101828] w-[110px] flex-shrink-0">
                              Số ghế <span className="text-red-500">(*)</span>
                            </label>
                            <select
                              value={modalTableSeats}
                              onChange={(e) => setModalTableSeats(Number(e.target.value))}
                              className="flex-1 bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-3 h-[32px] text-[13px] outline-none font-medium text-[#101828] cursor-pointer"
                            >
                              {[2, 4, 6, 8, 10, 12].map(n => (
                                <option key={n} value={n}>{n} ghế</option>
                              ))}
                            </select>
                          </div>

                          {/* Kiểu dáng bàn */}
                          <div className="flex items-center gap-3">
                            <label className="text-[13px] font-semibold text-[#101828] w-[110px] flex-shrink-0">
                              Kiểu dáng bàn <span className="text-red-500">(*)</span>
                            </label>
                            <select
                              value={modalTableShape}
                              onChange={(e) => setModalTableShape(e.target.value)}
                              className="flex-1 bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-3 h-[32px] text-[13px] outline-none font-medium text-[#101828] cursor-pointer"
                            >
                              <option value="Bàn chữ nhật">Bàn chữ nhật</option>
                              <option value="Bàn tròn">Bàn tròn</option>
                            </select>
                          </div>
                        </div>

                        {/* Footer - Hủy bỏ trước Lưu, no icons */}
                        <div className="px-5 py-3 border-t border-[#E9EAEB] flex items-center justify-end gap-2 bg-[#F8F9FA] flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingTableInModal(null)}
                            className="h-[32px] px-4 bg-white border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (editingTableInModal.id !== 'bulk' && !modalTableName.trim()) {
                                onNotification('⚠️ Số bàn không được để trống!', 'error');
                                return;
                              }
                              if (editingTableInModal.id === 'bulk') {
                                setDesignerTables(prev => prev.map(t => {
                                  if (selectedTableIds.includes(t.id)) {
                                    return {
                                      ...t,
                                      seats: modalTableSeats,
                                      shape: modalTableShape
                                    };
                                  }
                                  return t;
                                }));
                                onNotification(`💾 Đã cập nhật hàng loạt ${selectedTableIds.length} bàn thành công!`, 'success');
                                setSelectedTableIds([]);
                              } else {
                                setDesignerTables(prev => prev.map(t => t.id === editingTableInModal.id ? {
                                  ...t,
                                  name: modalTableName,
                                  seats: modalTableSeats,
                                  shape: modalTableShape
                                } : t));
                                onNotification(`💾 Đã cập nhật bàn ${modalTableName} thành công!`, 'success');
                              }
                              setEditingTableInModal(null);
                            }}
                            className="h-[32px] px-5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                          >
                            Lưu
                          </button>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}

                  {/* THIẾT LẬP NHANH SƠ ĐỒ THIẾT KẾ POPUP */}
                  {isDesignerQuickSetupOpen && createPortal(
                    <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-[100100] animate-fade-in p-4 ${
                      isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
                    }`}>
                      <div className="bg-white rounded-[8px] shadow-xl border border-[#E9EAEB] max-w-md w-full overflow-hidden font-sans">
                        {/* Header - White background with black text */}
                        <div className="bg-white border-b border-[#E9EAEB] px-4 py-3 flex items-center justify-between text-[#101828] flex-shrink-0">
                          <h3 className="font-bold text-[14px]">Thiết lập nhanh sơ đồ</h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onNotification('💡 Trợ giúp thiết lập nhanh sơ đồ thiết kế!', 'info');
                              }}
                              className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                              title="Giúp"
                            >
                              <HelpCircle className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsDesignerQuickSetupOpen(false)}
                              className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Body Form */}
                        <div className="p-5 space-y-4 text-left bg-white text-[13px]">
                          {/* Vị trí cửa */}
                          <div className="flex items-center gap-3">
                            <label className="text-[13px] font-semibold text-[#101828] w-[130px] flex-shrink-0">
                              Vị trí cửa <span className="text-red-500">(*)</span>
                            </label>
                            <select
                              value={quickSetupDoorPosition}
                              onChange={(e) => setQuickSetupDoorPosition(e.target.value)}
                              className="flex-1 bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-3 h-[32px] text-[13px] outline-none font-medium text-[#101828] cursor-pointer"
                            >
                              <option value="Trên">Trên</option>
                              <option value="Dưới">Dưới</option>
                              <option value="Trái">Trái</option>
                              <option value="Phải">Phải</option>
                            </select>
                          </div>

                          {/* Số bàn */}
                          <div className="flex items-center gap-3">
                            <label className="text-[13px] font-semibold text-[#101828] w-[130px] flex-shrink-0">
                              Số bàn <span className="text-red-500">(*)</span>
                            </label>
                            <div className="flex-1 flex gap-2">
                              <input
                                type="number"
                                min={1}
                                value={quickSetupTableCount}
                                onChange={(e) => setQuickSetupTableCount(Math.max(1, Number(e.target.value)))}
                                className="w-[80px] bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-3 h-[32px] text-[13px] outline-none text-[#101828] font-semibold text-right"
                              />
                              <select
                                value={quickSetupTableShape}
                                onChange={(e) => setQuickSetupTableShape(e.target.value)}
                                className="flex-1 bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-3 h-[32px] text-[13px] outline-none font-medium text-[#101828] cursor-pointer"
                              >
                                <option value="Bàn chữ nhật">Bàn chữ nhật</option>
                                <option value="Bàn tròn">Bàn tròn</option>
                              </select>
                            </div>
                          </div>

                          {/* Loại bàn */}
                          <div className="flex items-center gap-3">
                            <label className="text-[13px] font-semibold text-[#101828] w-[130px] flex-shrink-0">
                              Loại bàn (Số ghế) <span className="text-red-500">(*)</span>
                            </label>
                            <select
                              value={quickSetupSeatsPerTable}
                              onChange={(e) => setQuickSetupSeatsPerTable(Number(e.target.value))}
                              className="w-[120px] bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-3 h-[32px] text-[13px] outline-none font-medium text-[#101828] cursor-pointer"
                            >
                              <option value={2}>2</option>
                              <option value={4}>4</option>
                              <option value={6}>6</option>
                              <option value={8}>8</option>
                              <option value={10}>10</option>
                              <option value={12}>12</option>
                            </select>
                          </div>

                          {/* Section: Đánh số bàn */}
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                            <span className="text-[13px] font-extrabold text-[#101828]">Đánh số bàn</span>
                            <HelpCircle className="w-4 h-4 text-[#245FDF] stroke-[2.5]" />
                          </div>

                          {/* Ký hiệu & Bắt đầu từ in same row */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-[13px] font-medium text-[#101828] w-[60px] flex-shrink-0">
                                Ký hiệu <span className="text-red-500">(*)</span>
                              </label>
                              <input
                                type="text"
                                value={quickSetupPrefix}
                                onChange={(e) => setQuickSetupPrefix(e.target.value)}
                                className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-2 h-[32px] text-[13px] outline-none text-[#101828] font-medium"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-[13px] font-medium text-[#101828] w-[70px] flex-shrink-0">
                                Bắt đầu <span className="text-red-500">(*)</span>
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={quickSetupStartFrom}
                                onChange={(e) => setQuickSetupStartFrom(Math.max(1, Number(e.target.value)))}
                                className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-2 h-[32px] text-[13px] outline-none text-[#101828] font-medium text-right"
                              />
                            </div>
                          </div>

                          {/* Accordion: Thiết lập nâng cao */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setQuickSetupAdvancedOpen(!quickSetupAdvancedOpen)}
                              className="flex items-center gap-1 text-[13px] font-semibold text-[#245FDF] hover:underline cursor-pointer focus:outline-none"
                            >
                              Thiết lập nâng cao
                              {quickSetupAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>

                          {quickSetupAdvancedOpen && (
                            <div className="bg-slate-50 border border-slate-200 rounded-[4px] p-3 space-y-3 animate-fade-in">
                              <div className="flex items-center gap-3">
                                <label className="text-[13px] font-medium text-[#101828] w-[118px] flex-shrink-0">
                                  Số dãy bàn
                                </label>
                                <input
                                  type="number"
                                  min={1}
                                  value={quickSetupRowCount}
                                  onChange={(e) => setQuickSetupRowCount(Math.max(1, Number(e.target.value)))}
                                  className="w-[80px] bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] px-3 h-[32px] text-[13px] outline-none text-[#101828] font-medium text-right"
                                />
                              </div>
                              <div className="space-y-2 pl-[131px]">
                                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#101828] font-medium select-none">
                                  <input
                                    type="radio"
                                    name="quickSetupArrangeType"
                                    checked={quickSetupArrangeType === 'vertical'}
                                    onChange={() => setQuickSetupArrangeType('vertical')}
                                    className="text-[#245FDF] focus:ring-[#245FDF] h-4 w-4"
                                  />
                                  Xếp bàn theo dãy dọc
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#101828] font-medium select-none">
                                  <input
                                    type="radio"
                                    name="quickSetupArrangeType"
                                    checked={quickSetupArrangeType === 'horizontal'}
                                    onChange={() => setQuickSetupArrangeType('horizontal')}
                                    className="text-[#245FDF] focus:ring-[#245FDF] h-4 w-4"
                                  />
                                  Xếp bàn theo dãy ngang
                                </label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer - Hủy bỏ trước Lưu, no icons */}
                        <div className="px-5 py-3 border-t border-[#E9EAEB] flex items-center justify-end gap-2 bg-[#F8F9FA] flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsDesignerQuickSetupOpen(false)}
                            className="h-[32px] px-4 bg-white border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            onClick={handleNewQuickSetupSubmit}
                            className="h-[32px] px-5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                          >
                            Lưu
                          </button>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}

                </div>
              )}

              {activeModalStep === 5 && (
                <div className="flex flex-col h-full text-left">
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                      {/* Main forms selection */}
                      <div id="setup-step5-vietqr-section" className="space-y-2.5">

                        {/* 1. Tiền mặt (Mặc định) */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                          <input type="checkbox" checked disabled className="w-5 h-5 text-[#245FDF] focus:ring-blue-500 rounded cursor-not-allowed flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="text-[13px] font-bold text-slate-800">Tiền mặt</h4>
                            <p className="text-[13px] text-slate-500 font-medium">Thanh toán trực tiếp tại quầy bằng tiền mặt</p>
                          </div>
                        </div>

                        {/* 2. Chuyển khoản */}
                        <div className={`border rounded-xl p-3 flex flex-col gap-3 transition-colors ${
                          connectedPayments.transfer ? 'border-blue-400 bg-blue-50/10' : 'border-slate-200 bg-white'
                        }`}>
                        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleToggleTransfer}>
                          <input 
                            type="checkbox" 
                            checked={!!connectedPayments.transfer} 
                            onChange={(e) => {
                              // Stop propagation because we handle toggle on parent container click
                              e.stopPropagation();
                              handleToggleTransfer();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 text-[#245FDF] focus:ring-blue-500 rounded cursor-pointer flex-shrink-0" 
                          />
                          <div className="flex-1">
                            <h4 className="text-[13px] font-bold text-slate-800">Chuyển khoản</h4>
                            <p className="text-[13px] text-slate-500 font-medium">
                              {connectedPayments.transfer 
                                ? (connectedPayments.banks.length > 0 
                                    ? `Đã kích hoạt: ${connectedPayments.banks.join(', ')}` 
                                    : 'Phương thức chuyển khoản đã được kích hoạt (Vui lòng kết nối ngân hàng phía dưới)')
                                : 'Tự động tạo mã QR chuyển khoản động theo hóa đơn'}
                            </p>
                          </div>
                        </div>

                        {connectedPayments.transfer && (
                          <div className="border-t border-slate-100 pt-3 animate-fade-in space-y-2.5">
                            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide block">Danh sách các ngân hàng hỗ trợ:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {bankList.map((bank) => {
                                const isConnected = connectedPayments.banks.includes(bank);
                                const hasDetails = !!connectedPayments.details?.[bank];
                                const isReallyConnected = isConnected && hasDetails;
                                return (
                                  <div key={bank} className={`flex items-center justify-between p-2.5 rounded-lg border gap-3 text-[13px] transition-all ${
                                    isReallyConnected 
                                      ? 'bg-emerald-50/80 border-emerald-200' 
                                      : 'border-slate-100 bg-slate-50/40'
                                  }`}>
                                    <div className="flex items-center gap-3 text-left min-w-0 flex-1">
                                      {/* Logo container */}
                                      <div className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden">
                                        {getBankLogo(bank)}
                                      </div>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-bold text-slate-800 text-[13px]">{bank}</span>
                                        {isReallyConnected ? (
                                          <div className="space-y-0.5 mt-0.5">
                                            <div className="text-[12px] text-emerald-600 font-bold">
                                              Đã kết nối
                                            </div>
                                            <div className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                              STK: <span className="font-semibold text-slate-800">{connectedPayments.details?.[bank]?.accountNumber}</span>
                                              {connectedPayments.details?.[bank]?.branch && (
                                                <> • CN: <span className="font-semibold text-slate-800">{connectedPayments.details?.[bank]?.branch}</span></>
                                              )}
                                              <br />
                                              Chủ TK: <span className="font-semibold text-slate-800">{connectedPayments.details?.[bank]?.accountName}</span>
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="text-[12px] text-slate-400 font-medium">Chưa kết nối</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      {isReallyConnected && (
                                        <button
                                          type="button"
                                          onClick={() => handleDisconnectPaymentMethod('bank', bank)}
                                          className="text-red-500 hover:text-red-700 text-[12px] font-bold px-2 py-1 rounded-[8px] hover:bg-red-50 transition-all cursor-pointer"
                                        >
                                          Ngắt
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => openPaymentDetailsModal('bank', bank)}
                                        className={`px-3 py-1 rounded-[8px] text-[12px] font-bold border transition-all cursor-pointer ${
                                          isReallyConnected
                                            ? 'bg-white border-[#245FDF] text-[#245FDF] hover:bg-blue-50/50'
                                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                      >
                                        {isReallyConnected ? 'Sửa' : 'Kết nối'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Custom/Added banks that are not in the standard 6 list */}
                              {((connectedPayments.banks || []).filter((b: string) => !bankList.includes(b))).map((bank: string) => {
                                const hasDetails = !!connectedPayments.details?.[bank];
                                return (
                                  <div key={bank} className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/80 gap-3 text-[13px] transition-all animate-fade-in">
                                    <div className="flex items-center gap-3 text-left min-w-0 flex-1">
                                      {/* Logo container */}
                                      <div className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden">
                                        {getBankLogo(bank)}
                                      </div>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-bold text-slate-800 text-[13px]">{bank}</span>
                                        <div className="space-y-0.5 mt-0.5">
                                          <div className="text-[12px] text-emerald-600 font-bold">
                                            Đã kết nối
                                          </div>
                                          <div className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                            STK: <span className="font-semibold text-slate-800">{connectedPayments.details?.[bank]?.accountNumber}</span>
                                            {connectedPayments.details?.[bank]?.branch && (
                                              <> • CN: <span className="font-semibold text-slate-800">{connectedPayments.details?.[bank]?.branch}</span></>
                                            )}
                                            <br />
                                            Chủ TK: <span className="font-semibold text-slate-800">{connectedPayments.details?.[bank]?.accountName}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleDisconnectPaymentMethod('bank', bank)}
                                        className="text-red-500 hover:text-red-700 text-[12px] font-bold px-2 py-1 rounded-[8px] hover:bg-red-50 transition-all cursor-pointer"
                                      >
                                        Ngắt
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => openPaymentDetailsModal('bank', bank)}
                                        className="px-3 py-1 rounded-[8px] text-[12px] font-bold border bg-white border-[#245FDF] text-[#245FDF] hover:bg-blue-50/50 transition-all cursor-pointer"
                                      >
                                        Sửa
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Button to add other/custom bank */}
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomBankSelectedBank('');
                                  setCustomBankOtherName('');
                                  setCustomBankAccountNumber('');
                                  setCustomBankAccountName('');
                                  setCustomBankBranch('');
                                  setEditingCustomBankName(null);
                                  setIsCustomBankModalOpen(true);
                                }}
                                className="flex items-center justify-center p-2.5 rounded-lg border border-dashed border-slate-300 hover:border-[#245FDF] bg-white hover:bg-slate-50 text-[#245FDF] hover:text-[#1B4EBA] font-bold gap-2 text-[13px] transition-all cursor-pointer min-h-[58px]"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Thêm ngân hàng khác...</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. Ví điện tử */}
                      <div className={`border rounded-xl p-3 flex flex-col gap-3 transition-colors ${
                        connectedPayments.wallet ? 'border-indigo-400 bg-indigo-50/10' : 'border-slate-200 bg-white'
                      }`}>
                      <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleToggleWallet}>
                          <input 
                            type="checkbox" 
                            checked={!!connectedPayments.wallet} 
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleWallet();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer flex-shrink-0" 
                          />
                          <div className="flex-1">
                            <h4 className="text-[13px] font-bold text-slate-800">Ví điện tử</h4>
                            <p className="text-[13px] text-slate-500 font-medium">
                              {connectedPayments.wallet 
                                ? (connectedPayments.wallets.length > 0 
                                    ? `Đã kích hoạt: ${connectedPayments.wallets.join(', ')}` 
                                    : 'Phương thức ví điện tử đã được kích hoạt (Vui lòng kết nối ví phía dưới)')
                                : 'Chấp nhận thanh toán bằng ví Momo, ZaloPay, ShopeePay, VNPAY'}
                            </p>
                          </div>
                        </div>

                        {connectedPayments.wallet && (
                          <div className="border-t border-slate-100 pt-3 animate-fade-in space-y-2.5">
                            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide block">Danh sách ví điện tử hỗ trợ:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {walletList.map((wallet) => {
                                const isConnected = connectedPayments.wallets.includes(wallet);
                                const hasDetails = !!connectedPayments.details?.[wallet];
                                const isReallyConnected = isConnected && hasDetails;
                                return (
                                  <div key={wallet} className={`flex items-center justify-between p-2.5 rounded-lg border gap-3 text-[13px] transition-all ${
                                    isReallyConnected 
                                      ? 'bg-emerald-50/80 border-emerald-200' 
                                      : 'border-slate-100 bg-slate-50/40'
                                  }`}>
                                    <div className="flex items-center gap-3 text-left min-w-0 flex-1">
                                      {/* Logo container */}
                                      <div className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden">
                                        {getWalletLogo(wallet)}
                                      </div>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-bold text-slate-800 text-[13px]">{wallet}</span>
                                        {isReallyConnected ? (
                                          <div className="space-y-0.5 mt-0.5">
                                            <div className="text-[12px] text-emerald-600 font-bold">
                                              Đã kết nối
                                            </div>
                                            <div className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                              SĐT: <span className="font-semibold text-slate-800">{connectedPayments.details?.[wallet]?.phoneNumber}</span>
                                              <br />
                                              Chủ TK: <span className="font-semibold text-slate-800">{connectedPayments.details?.[wallet]?.accountName}</span>
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="text-[12px] text-slate-400 font-medium">Chưa kết nối</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      {isReallyConnected && (
                                        <button
                                          type="button"
                                          onClick={() => handleDisconnectPaymentMethod('wallet', wallet)}
                                          className="text-red-500 hover:text-red-700 text-[12px] font-bold px-2 py-1 rounded-[8px] hover:bg-red-50 transition-all cursor-pointer"
                                        >
                                          Ngắt
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => openPaymentDetailsModal('wallet', wallet)}
                                        className={`px-3 py-1 rounded-[8px] text-[12px] font-bold border transition-all cursor-pointer ${
                                          isReallyConnected
                                            ? 'bg-white border-indigo-500 text-indigo-600 hover:bg-indigo-50/50'
                                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                      >
                                        {isReallyConnected ? 'Sửa' : 'Kết nối'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 💠 STEP 7 POPUP: KẾT NỐI HÓA ĐƠN ĐIỆN TỬ */}
              {activeModalStep === 6 && (
                <div className="flex flex-col h-full justify-center items-center flex-1 animate-fade-in text-left pb-4 min-h-[400px]" id="step-7-modal-content">
                  {/* Onboarding Introduction Container */}
                  <div id="setup-step6-auto-invoice" className="text-center py-6 max-w-2xl mx-auto flex-shrink-0">
                    {/* MISA meInvoice Logo centered above the title */}
                    <div className="flex justify-center mb-5 select-none">
                      <img 
                        src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=23db9d1b-4469-4241-9b85-68c364947109.png&isTemp=true&tenantCode=misa" 
                        alt="MISA meInvoice Logo" 
                        className="w-auto h-12 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#1D2939] leading-tight tracking-tight mb-2">
                      Kết nối phần mềm hoá đơn điện tử MISA meInvoice
                    </h2>
                    <p className="text-[13px] sm:text-[13.5px] text-[#475467] leading-relaxed font-medium mb-5">
                      <span className="font-bold">MISA meInvoice</span> là phần mềm <span className="font-bold text-slate-800">Hóa đơn điện tử</span> giúp nhà hàng lập, tra cứu, lưu trữ hóa đơn bằng các phương tiện điện tử thay thế hóa đơn giấy truyền thống. Từ đó giảm chi phí in ấn, lưu trữ an toàn, tra cứu dễ dàng...
                    </p>

                    {/* Connection Button Actions */}
                    <div className="flex flex-col items-center justify-center gap-2">
                      {!(meInvoiceConnected && eSignConnected) ? (
                        <div className="flex flex-row items-center justify-center gap-3">
                          <a
                            href="https://meinvoice.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-[38px] px-6 border border-[#245FDF] hover:bg-blue-50/50 text-[#245FDF] font-bold text-[14px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            Đăng ký ngay
                          </a>
                          <button
                            type="button"
                            onClick={() => setIsMeInvoiceModalOpen(true)}
                            className="h-[38px] px-8 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[14px] rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            Kết nối MISA meInvoice
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 w-full max-w-md text-left transition-all shadow-xs">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                              <Check className="w-4 h-4 stroke-[3.5]" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[13.5px] font-bold text-emerald-800">Đã kết nối thành công!</h4>
                              <div className="text-[12.5px] text-slate-500 font-medium mt-1.5 space-y-0.5">
                                <div>MST: <span className="font-bold text-slate-700">{mstInput}</span></div>
                                <div>Tài khoản: <span className="font-bold text-slate-700">{meInvoiceUser}</span></div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setMeInvoiceSubStep('connected');
                                  setIsMeInvoiceModalOpen(true);
                                }}
                                className="text-[#245FDF] hover:text-blue-700 hover:underline font-bold text-[12.5px] transition-colors mt-2.5 text-left cursor-pointer focus:outline-hidden block"
                              >
                                Xem thông tin kết nối
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Sticky Footer (Ghim dưới cùng và tràn viền) */}
        <div className="bg-white border-t border-slate-200 pt-[12px] pb-[12px] pl-[20px] pr-[20px] flex items-center justify-between flex-shrink-0 font-sans w-full">
          {/* Left side: Trống */}
          <div></div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-2.5">
            {activeModalStep > 1 && (
              <button
                type="button"
                onClick={() => goToStep(activeModalStep - 1)}
                className="px-4 py-2 text-[13px] font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Quay lại
              </button>
            )}

            {activeModalStep >= 3 && (
              <button
                type="button"
                onClick={() => completeStepAndGoNext(activeModalStep, true)}
                className="px-4 py-2 text-[13px] font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Bỏ qua
              </button>
            )}

            <button
              type="button"
              onClick={() => completeStepAndGoNext(activeModalStep)}
              className="px-5 py-2 text-[13px] font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer shadow-xs transition-colors"
            >
              {activeModalStep === 7 && allBefore7Completed ? 'Hoàn tất hướng dẫn' : 'Tiếp tục'}
            </button>
          </div>
        </div>

          {/* POPUP HIỂN THỊ DANH SÁCH MÓN ĂN CHẾ BIẾN TẠI BẾP/BAR */}
          {selectedKitchenAreaForDishes && (() => {
            const areaDishes = getEffectiveDishesForArea(selectedKitchenAreaForDishes);
            const dishesList = menuItems.length > 0 ? menuItems : VUON_BIA_DISHES;
            const matchingDishes = areaDishes.map((dishName: string) => {
              return dishesList.find(d => d.name === dishName) || {
                name: dishName,
                code: 'N/A',
                type: 'Khác',
                unit: 'Đĩa',
                price: 0,
              };
            });

            const filteredMatchingDishes = matchingDishes.filter((dish: any) => {
              if (filterPopupCode && !dish.code.toLowerCase().includes(filterPopupCode.toLowerCase())) return false;
              if (filterPopupName && !dish.name.toLowerCase().includes(filterPopupName.toLowerCase())) return false;
              if (filterPopupType && dish.type !== filterPopupType) return false;
              if (filterPopupUnit && !dish.unit.toLowerCase().includes(filterPopupUnit.toLowerCase())) return false;
              if (filterPopupPrice.trim()) {
                const val = Number(filterPopupPrice.trim());
                if (!isNaN(val)) {
                  if (filterPopupPriceOp === '=') {
                    if (dish.price !== val) return false;
                  } else if (filterPopupPriceOp === '<=') {
                    if (dish.price > val) return false;
                  } else if (filterPopupPriceOp === '>=') {
                    if (dish.price < val) return false;
                  }
                }
              }
              return true;
            });

            return (
              <div className="fixed inset-0 bg-black/60 z-[100050] flex items-center justify-center p-4 animate-fade-in select-none">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[580px] flex flex-col border border-slate-200 overflow-hidden animate-scale-up text-slate-800">
                  {/* Title Bar */}
                  <div className="bg-white border-b border-slate-200 text-slate-900 px-6 py-4 flex justify-between items-center flex-shrink-0 select-none shadow-xs">
                    <h3 className="font-sans font-bold text-[16px] text-slate-950">
                      Danh sách món chế biến tại bếp/bar: {selectedKitchenAreaForDishes.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedKitchenAreaForDishes(null)}
                      className="text-[#6B707A] hover:text-[#10141B] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body with Table */}
                  <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col min-h-0">
                    <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden flex flex-col min-h-0 bg-white">
                      <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left border-collapse table-fixed">
                          <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10">
                            <tr>
                              <th className="py-2 px-3 text-[13px] font-bold text-slate-800 w-[15%]">Mã món</th>
                              <th className="py-2 px-3 text-[13px] font-bold text-slate-800 w-[40%]">Tên món</th>
                              <th className="py-2 px-3 text-[13px] font-bold text-slate-800 w-[20%]">Nhóm thực đơn</th>
                              <th className="py-2 px-3 text-[13px] font-bold text-slate-800 w-[12%]">Đơn vị tính</th>
                              <th className="py-2 px-3 text-[13px] font-bold text-slate-800 w-[13%] text-right">Giá bán</th>
                            </tr>
                            <tr className="bg-[#FAFAFA] border-b border-[#E9EAEB]">
                              {/* Mã món Filter */}
                              <th className="py-1 px-2">
                                <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                  <div className="w-6 h-full flex items-center justify-center bg-white border-r border-slate-200 text-slate-500 font-bold select-none text-[13px]">*</div>
                                  <input
                                    type="text"
                                    value={filterPopupCode}
                                    onChange={(e) => setFilterPopupCode(e.target.value)}
                                    placeholder=""
                                    className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                                  />
                                </div>
                              </th>
                              {/* Tên món Filter */}
                              <th className="py-1 px-2">
                                <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                  <div className="w-6 h-full flex items-center justify-center bg-white border-r border-slate-200 text-slate-500 font-bold select-none text-[13px]">*</div>
                                  <input
                                    type="text"
                                    value={filterPopupName}
                                    onChange={(e) => setFilterPopupName(e.target.value)}
                                    placeholder=""
                                    className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                                  />
                                </div>
                              </th>
                              {/* Nhóm thực đơn Filter */}
                              <th className="py-1 px-2">
                                <div className="relative">
                                  <select
                                    value={filterPopupType}
                                    onChange={(e) => setFilterPopupType(e.target.value)}
                                    className="w-full h-[26px] border border-slate-200 rounded bg-white text-[#10141B] text-[13px] font-semibold pl-1.5 pr-5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden cursor-pointer appearance-none"
                                  >
                                    <option value="">Tất cả</option>
                                    <option value="Khai vị">Khai vị</option>
                                    <option value="Món chính">Món chính</option>
                                    <option value="Lẩu">Lẩu</option>
                                    <option value="Bia & Đồ uống">Bia & Đồ uống</option>
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 text-[#6B707A] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </th>
                              {/* Đơn vị tính Filter */}
                              <th className="py-1 px-2">
                                <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                  <div className="w-6 h-full flex items-center justify-center bg-white border-r border-slate-200 text-slate-500 font-bold select-none text-[13px]">*</div>
                                  <input
                                    type="text"
                                    value={filterPopupUnit}
                                    onChange={(e) => setFilterPopupUnit(e.target.value)}
                                    placeholder=""
                                    className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold"
                                  />
                                </div>
                              </th>
                              {/* Giá bán Filter */}
                              <th className="py-1 px-2">
                                <div className="flex items-center border border-slate-200 rounded bg-white text-[13px] font-normal h-[26px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                                  <select
                                    value={filterPopupPriceOp}
                                    onChange={(e) => setFilterPopupPriceOp(e.target.value)}
                                    className="bg-white text-slate-600 border-r border-slate-200 h-full px-1 text-[13px] font-bold focus:outline-hidden cursor-pointer select-none appearance-none text-center w-[26px] flex-shrink-0"
                                  >
                                    <option value="=">=</option>
                                    <option value="<=">&le;</option>
                                    <option value=">=">&ge;</option>
                                  </select>
                                  <input
                                    type="text"
                                    value={filterPopupPrice}
                                    onChange={(e) => setFilterPopupPrice(e.target.value)}
                                    placeholder=""
                                    className="flex-1 h-full px-1.5 bg-white text-slate-800 focus:outline-hidden text-[13px] font-semibold text-left"
                                  />
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[13px] font-normal text-slate-700 bg-white">
                            {filteredMatchingDishes.map((dish: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="py-2.5 px-3 text-slate-900 font-medium truncate">{dish.code}</td>
                                <td className="py-2.5 px-3 text-slate-900 font-bold truncate">{dish.name}</td>
                                <td className="py-2.5 px-3 text-slate-600 truncate">{dish.type}</td>
                                <td className="py-2.5 px-3 text-slate-600 truncate">{dish.unit}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                                  {dish.price.toLocaleString('vi-VN')}
                                </td>
                              </tr>
                            ))}
                            {filteredMatchingDishes.length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                                  Không có món ăn nào phù hợp với bộ lọc!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end bg-white">
                    <button
                      type="button"
                      onClick={() => setSelectedKitchenAreaForDishes(null)}
                      className="h-[36px] px-5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-lg transition-all cursor-pointer flex items-center justify-center border-none"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* JETPAY BANKHUB BROWSER SIMULATOR POPUP */}
          {isJetPayModalOpen && (
            <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100000] animate-fade-in p-4`}>
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden font-sans flex flex-col h-[85vh] max-h-[680px]">
                {/* 1. MOCK BROWSER CHROME */}
                <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 flex-shrink-0">
                  {/* Left window controls */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <div 
                      onClick={() => setIsJetPayModalOpen(false)}
                      className="w-3 h-3 rounded-full bg-rose-400 cursor-pointer hover:bg-rose-500 transition-colors" 
                      title="Đóng"
                    />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  {/* Middle Address bar */}
                  <div className="bg-white border border-slate-200 px-3 py-1 text-[11px] text-slate-500 rounded-lg flex items-center gap-1.5 flex-1 max-w-xl mx-4 select-none overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-semibold flex-shrink-0">Secure Connection</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-600 truncate">https://bankhub.jetpay.vn/connect/{jetPayBankName.toLowerCase()}?merchant_id=MCH0123&appName=CukCuk</span>
                  </div>
                  {/* Right close button */}
                  <button 
                    onClick={() => setIsJetPayModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. JETPAY CONTENT CONTAINER */}
                <div className="flex-1 overflow-y-auto flex flex-col bg-white">
                  {/* 2a. JETPAY SHARED HEADER */}
                  <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                      {/* JetPay Logo */}
                      <div className="flex items-center gap-2">
                        <div className="relative w-7 h-7 flex-shrink-0">
                          <div className="absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-[#00D1FF] opacity-90 mix-blend-multiply" />
                          <div className="absolute bottom-0.5 right-0.5 w-4.5 h-4.5 rounded-full bg-[#00DF89] opacity-90 mix-blend-multiply" />
                        </div>
                        <div className="flex flex-col leading-none text-left">
                          <span className="text-[14px] font-bold text-slate-800 tracking-tight">JetPay</span>
                          <span className="text-[9px] font-extrabold text-slate-500 tracking-wider">BankHub</span>
                        </div>
                      </div>
                      {/* Divider */}
                      <div className="w-px h-6 bg-slate-200" />
                      {/* Selected Bank Logo */}
                      {renderBankLogo(jetPayBankName)}
                    </div>

                    {/* Contact Details */}
                    <div className="flex items-center gap-4 text-slate-500 text-[12px] font-bold">
                      <div className="flex items-center gap-1 text-[#10B981]">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hotline: 1900 2169</span>
                      </div>
                      <button 
                        onClick={() => onNotification('Đang gửi yêu cầu hỗ trợ tư vấn...', 'info')}
                        className="flex items-center gap-1 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        <Headphones className="w-3.5 h-3.5" />
                        <span>Yêu cầu tư vấn</span>
                      </button>
                    </div>
                  </div>

                  {/* 2b. STEP RENDERER */}
                  <div className="p-8 flex-1 flex flex-col justify-center">
                    {jetPayStep === 1 && (
                      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center">
                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
                          Kết nối ngân hàng {jetPayBankName} để tự động xác nhận thanh toán
                        </h2>
                        <p className="text-[13px] text-slate-500 font-bold uppercase tracking-wider mt-2.5">
                          Kiểm tra điều kiện trước khi "Kết nối"
                        </p>

                        <div className="mt-8 border border-slate-200 rounded-2xl bg-slate-50/50 p-6 w-full text-left flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-xs">
                            <User className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[15px] font-extrabold text-slate-900">
                              Dành cho tài khoản cá nhân
                            </h4>
                            <p className="text-[13px] text-slate-500 font-medium mt-1 leading-relaxed">
                              Trường hợp chưa có tài khoản, hướng dẫn đăng ký <span className="text-blue-600 underline font-semibold cursor-pointer" onClick={() => onNotification('Đang mở hướng dẫn đăng ký tài khoản...', 'info')}>tại đây</span>
                            </p>
                          </div>
                          <button
                            onClick={() => setJetPayStep(2)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] py-2.5 px-6 rounded-lg cursor-pointer transition-colors flex-shrink-0 shadow-sm shadow-emerald-500/10 active:scale-95 duration-200"
                          >
                            Kết nối
                          </button>
                        </div>
                      </div>
                    )}

                    {jetPayStep === 2 && (
                      <div className="flex-1 flex flex-col">
                        <div className="text-left mb-6">
                          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
                            Kết nối ngân hàng {jetPayBankName} để tự động xác nhận thanh toán
                          </h2>
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium mt-1 text-[13px]">
                            <span>Nhập thông tin tài khoản cá nhân để kết nối dịch vụ thông báo thanh toán QR tiền vào</span>
                            <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 cursor-pointer" title="Thông tin dịch vụ" />
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row gap-8 items-center md:items-start">
                          {/* Left Illustration */}
                          <div className="w-full md:w-5/12 flex justify-center">
                            <div className="bg-[#EEF4FF] rounded-2xl p-6 flex items-center justify-center w-full max-w-sm h-full shadow-xs">
                              <svg viewBox="0 0 200 200" className="w-full max-h-52 object-contain">
                                <circle cx="100" cy="110" r="45" fill="#BFDBFE" />
                                <circle cx="100" cy="110" r="30" fill="#DBEAFE" />
                                <circle cx="105" cy="85" r="22" fill="#FED7AA" />
                                <path d="M83 85 C83 60, 127 60, 127 85 C127 95, 83 95, 83 85 Z" fill="#1E293B" />
                                <circle cx="98" cy="82" r="2" fill="#1E293B" />
                                <circle cx="112" cy="82" r="2" fill="#1E293B" />
                                <path d="M102 90 Q105 94 108 90" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none" />
                                <path d="M97 104 L105 110 L113 104" fill="#10B981" />
                                <path d="M85 107 C85 107, 75 135, 75 145 C75 145, 100 155, 135 145 C135 135, 125 107, 125 107 Z" fill="#60A5FA" />
                                <circle cx="78" cy="122" r="16" fill="#FBBF24" />
                                <text x="78" y="127" fontSize="15" fontWeight="bold" fill="#78350F" textAnchor="middle">$</text>
                                <path d="M90 120 C95 120, 100 115, 102 110" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" fill="none" />
                                <path d="M150 60 L152 65 L157 65 L153 68 L155 73 L150 70 L145 73 L147 68 L143 65 L148 65 Z" fill="#38BDF8" />
                                <path d="M50 150 L52 153 L55 153 L53 155 L54 158 L50 156 L46 158 L47 155 L45 153 L48 153 Z" fill="#38BDF8" />
                              </svg>
                            </div>
                          </div>

                          {/* Right Form */}
                          <div className="flex-1 w-full space-y-4 text-left text-[13px]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-[13px] font-bold text-slate-700">
                                  Căn cước công dân/Căn cước <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={jetPayCccd}
                                  onChange={(e) => setJetPayCccd(e.target.value)}
                                  placeholder="Nhập số căn cước công dân/căn cước"
                                  className="w-full bg-white border border-[#D5D7DA] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-slate-800"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-[13px] font-bold text-slate-700">
                                  Tên chủ tài khoản <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={jetPayOwnerName}
                                  onChange={(e) => setJetPayOwnerName(e.target.value.toUpperCase())}
                                  placeholder="Nhập tên"
                                  className="w-full bg-white border border-[#D5D7DA] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-slate-800"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="block text-[13px] font-bold text-slate-700">
                                  Tên cửa hàng <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 font-semibold text-slate-800">
                                  <div>Quán phở Anh Hai</div>
                                  <div className="text-[11px] text-slate-500 font-bold mt-0.5">ID: MCH0123</div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[13px] font-bold text-slate-700">
                                  Tên chi nhánh <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 font-semibold text-slate-800">
                                  <div>Chi nhánh Hồ Chí Minh</div>
                                  <div className="text-[11px] text-slate-500 font-bold mt-0.5">ID: MCN0123</div>
                                </div>
                              </div>
                            </div>

                            <p className="text-[11.5px] text-slate-500 italic mt-3 leading-relaxed">
                              *ID được JetPay tạo tự động, dùng riêng cho việc kết nối cửa hàng, chi nhánh này với {jetPayBankName}.
                            </p>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                              <button
                                onClick={() => setJetPayStep(1)}
                                className="px-5 py-2 text-[13px] font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                              >
                                Quay lại
                              </button>
                              <button
                                onClick={() => {
                                  if (!jetPayCccd.trim() || !jetPayOwnerName.trim()) {
                                    onNotification('Vui lòng nhập đầy đủ số Căn cước công dân và Tên chủ tài khoản!', 'warning');
                                    return;
                                  }
                                  setJetPayStep(3);
                                }}
                                className="px-5 py-2 text-[13px] font-bold text-white bg-emerald-600 hover:bg-emerald-750 rounded-lg cursor-pointer transition-colors shadow-xs"
                              >
                                Kết nối
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {jetPayStep === 3 && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        {/* Scan Line Style */}
                        <style>{`
                          @keyframes scan {
                            0% { top: 0%; opacity: 0.8; }
                            50% { top: 100%; opacity: 1; }
                            100% { top: 0%; opacity: 0.8; }
                          }
                          .qr-scan-line {
                            position: absolute;
                            left: 0;
                            right: 0;
                            height: 3px;
                            background: #10B981;
                            box-shadow: 0 0 12px 4px rgba(16, 185, 129, 0.6);
                            animation: scan 2s infinite ease-in-out;
                          }
                        `}</style>

                        <div className="relative border border-slate-200 rounded-2xl p-4 bg-white shadow-md w-44 h-44 flex items-center justify-center overflow-hidden">
                          {/* Active scan line */}
                          <div className="qr-scan-line" />
                          
                          {/* Crisp SVG QR code without demo overlay */}
                          <svg viewBox="0 0 100 100" className="w-36 h-36">
                            <rect x="0" y="0" width="30" height="30" fill="none" stroke="black" strokeWidth="4" />
                            <rect x="8" y="8" width="14" height="14" fill="black" />
                            <rect x="70" y="0" width="30" height="30" fill="none" stroke="black" strokeWidth="4" />
                            <rect x="78" y="8" width="14" height="14" fill="black" />
                            <rect x="0" y="70" width="30" height="30" fill="none" stroke="black" strokeWidth="4" />
                            <rect x="8" y="78" width="14" height="14" fill="black" />
                            <rect x="40" y="5" width="10" height="10" fill="black" />
                            <rect x="55" y="15" width="5" height="15" fill="black" />
                            <rect x="40" y="25" width="15" height="5" fill="black" />
                            <rect x="5" y="40" width="10" height="10" fill="black" />
                            <rect x="20" y="45" width="15" height="15" fill="black" />
                            <rect x="5" y="55" width="15" height="5" fill="black" />
                            <rect x="40" y="40" width="20" height="20" fill="black" />
                            <rect x="45" y="45" width="10" height="10" fill="white" />
                            <rect x="70" y="40" width="10" height="10" fill="black" />
                            <rect x="85" y="45" width="10" height="15" fill="black" />
                            <rect x="70" y="55" width="15" height="5" fill="black" />
                            <rect x="40" y="70" width="15" height="10" fill="black" />
                            <rect x="50" y="85" width="20" height="10" fill="black" />
                            <rect x="80" y="70" width="10" height="20" fill="black" />
                            <rect x="90" y="90" width="10" height="10" fill="black" />
                          </svg>
                        </div>

                        <h4 className="text-[15px] font-extrabold text-slate-850 mt-6">
                          Vui lòng xác thực kết nối trên {jetPayBankName} Mobile
                        </h4>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">
                          Kiểm tra thông báo trên ứng dụng hoặc quét mã QR để xem yêu cầu xác thực
                        </p>
                        
                        <div className="mt-4 font-bold text-[14px] text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5 inline-flex items-center gap-1.5 shadow-2xs select-none">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                          </span>
                          <span>Thời gian xác thực: <span className="font-mono">60:00</span></span>
                        </div>

                        <div className="flex items-center gap-3 mt-8">
                          <button
                            onClick={() => setJetPayStep(2)}
                            className="px-5 py-2 text-[13px] font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                          >
                            Kết nối lại
                          </button>
                          <button
                            onClick={() => onNotification('Đang tải tài liệu hướng dẫn xác thực...', 'info')}
                            className="px-5 py-2 text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50/20 border border-blue-500 rounded-lg cursor-pointer transition-colors"
                          >
                            Hướng dẫn xác thực
                          </button>
                        </div>
                      </div>
                    )}

                    {jetPayStep === 4 && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
                        <div className="bg-emerald-50 rounded-full p-5 flex items-center justify-center mb-6 shadow-sm shadow-emerald-500/5">
                          <svg viewBox="0 0 200 200" className="w-24 h-24 object-contain">
                            <circle cx="100" cy="100" r="50" fill="#10B981" />
                            <path d="M75 100 L92 117 L125 80" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <path d="M40 50 L42 55 L47 55 L43 58 L45 63 L40 60 L35 63 L37 58 L33 55 L38 55 Z" fill="#FBBF24" />
                            <path d="M160 50 L162 55 L167 55 L163 58 L165 63 L160 60 L155 63 L157 58 L153 55 L158 55 Z" fill="#FBBF24" />
                            <path d="M50 150 L52 155 L57 155 L53 158 L55 163 L50 160 L45 163 L47 158 L43 155 L48 155 Z" fill="#38BDF8" />
                            <path d="M150 150 L152 155 L157 155 L153 158 L155 163 L150 160 L145 163 L147 158 L143 155 L148 155 Z" fill="#38BDF8" />
                          </svg>
                        </div>

                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
                          Kết nối ngân hàng {jetPayBankName} thành công
                        </h2>
                        <p className="text-[13px] text-slate-500 font-medium mt-3 leading-relaxed">
                          Anh/chị có thể bật/tắt dịch vụ thông báo thanh toán QR về phần mềm <span className="font-bold text-slate-800">MISA CukCuk</span> cho từng tài khoản tại <span className="font-bold text-slate-800">“Danh sách tài khoản”</span>
                        </p>

                        <div className="mt-8">
                          <button
                            onClick={handleFinishJetPayConnection}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[13px] py-2.5 px-8 rounded-lg cursor-pointer transition-colors shadow-md shadow-emerald-500/10 active:scale-95 duration-200"
                          >
                            Đóng
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* POPUP THÊM/SỬA NGÂN HÀNG NGOÀI DANH SÁCH */}
          {isCustomBankModalOpen && (
            <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-[100000] animate-fade-in p-4 ${
              isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
            }`}>
              <div className="bg-white rounded-md shadow-xl border border-[#E9EAEB] max-w-md w-full overflow-hidden font-sans">
                {/* Header - White background, black title matching design system */}
                <div className="bg-white border-b border-[#E9EAEB] px-5 py-4 flex items-center justify-between flex-shrink-0">
                  <h3 className="font-bold text-[15px] text-[#10141B]">
                    {editingCustomBankName ? 'Cập nhật tài khoản ngân hàng' : 'Thêm tài khoản ngân hàng'}
                  </h3>
                  <button
                    type="button"
                    onClick={handleCloseCustomBankModal}
                    className="text-[#6B707A] hover:text-[#10141B] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Body */}
                <div className="p-5 space-y-4 text-left bg-white text-[13px] text-[#10141B]">
                  {/* Chọn ngân hàng */}
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-bold text-slate-700">
                      Chọn ngân hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={customBankSelectedBank}
                        onChange={(e) => {
                          setCustomBankSelectedBank(e.target.value);
                          if (e.target.value !== 'Other') {
                            setCustomBankOtherName('');
                          }
                        }}
                        className="w-full h-[36px] border border-[#D5D7DA] rounded bg-white text-[#10141B] text-[13px] font-semibold pl-3 pr-10 focus:ring-1 focus:ring-[#245FDF] focus:border-[#245FDF] focus:outline-hidden cursor-pointer appearance-none"
                      >
                        <option value="">-- Chọn ngân hàng --</option>
                        {OTHER_POPULAR_BANKS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                        <option value="Other">Khác (Tự nhập tên ngân hàng)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#6B707A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tên ngân hàng khác (nếu chọn Other) */}
                  {customBankSelectedBank === 'Other' && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="block text-[13px] font-bold text-slate-700">
                        Nhập tên ngân hàng khác <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customBankOtherName}
                        onChange={(e) => setCustomBankOtherName(e.target.value)}
                        placeholder="Nhập tên ngân hàng (ví dụ: Agribank)"
                        className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-[#10141B]"
                      />
                    </div>
                  )}

                  {/* Số tài khoản */}
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-bold text-slate-700">
                      Số tài khoản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customBankAccountNumber}
                      onChange={(e) => setCustomBankAccountNumber(e.target.value)}
                      placeholder="Nhập số tài khoản ngân hàng"
                      className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-[#101828]"
                    />
                  </div>

                  {/* Tên chủ tài khoản */}
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-bold text-slate-700">
                      Tên chủ tài khoản (Viết hoa không dấu) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customBankAccountName}
                      onChange={(e) => setCustomBankAccountName(e.target.value.toUpperCase())}
                      placeholder="Ví dụ: NGUYEN VAN A"
                      className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-[#101828]"
                    />
                  </div>

                  {/* Chi nhánh ngân hàng */}
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-bold text-slate-700">
                      Chi nhánh ngân hàng / Tỉnh, TP (Không bắt buộc)
                    </label>
                    <input
                      type="text"
                      value={customBankBranch}
                      onChange={(e) => setCustomBankBranch(e.target.value)}
                      placeholder="Ví dụ: Chi nhánh Hà Nội"
                      className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-[#101828]"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3.5 border-t border-[#E9EAEB] flex items-center justify-end gap-2.5 bg-[#F8F9FA] flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCloseCustomBankModal}
                    className="h-[32px] px-4 bg-white border border-[#D5D7DA] hover:bg-slate-50 text-[#6B707A] font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomBank}
                    className="h-[32px] px-5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* POPUP KẾT NỐI CHI TIẾT NGÂN HÀNG / VÍ ĐIỆN TỬ */}
          {isPaymentDetailsModalOpen && paymentDetailsTarget && (
            <div className={`fixed top-0 left-0 bottom-0 bg-black/40 flex items-center justify-center z-[100000] animate-fade-in p-4 ${
              isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
            }`}>
              <div className="bg-white rounded-md shadow-xl border border-[#E9EAEB] max-w-md w-full overflow-hidden font-sans">
                {/* Header - White background, black title matching design system */}
                <div className="bg-white border-b border-[#E9EAEB] px-5 py-4 flex items-center justify-between flex-shrink-0">
                  <h3 className="font-bold text-[15px] text-[#101828]">
                    Kết nối {paymentDetailsTarget.type === 'bank' ? 'Ngân hàng' : 'Ví điện tử'} {paymentDetailsTarget.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaymentDetailsModalOpen(false);
                      setPaymentDetailsTarget(null);
                    }}
                    className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Body */}
                <div className="p-5 space-y-4 text-left bg-white text-[13px]">
                  {paymentDetailsTarget.type === 'bank' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-bold text-slate-700">
                          Tên ngân hàng
                        </label>
                        <input
                          type="text"
                          value={paymentDetailsTarget.name}
                          disabled
                          className="w-full bg-slate-50 border border-[#D5D7DA] rounded px-3 py-2 text-[13px] text-[#475467] font-semibold outline-none cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-bold text-slate-700">
                          Số tài khoản <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formAccountNumber}
                          onChange={(e) => setFormAccountNumber(e.target.value)}
                          placeholder="Nhập số tài khoản ngân hàng"
                          className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-[#101828]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-bold text-slate-700">
                          Tên chủ tài khoản (Viết hoa không dấu) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formAccountName}
                          onChange={(e) => setFormAccountName(e.target.value.toUpperCase())}
                          placeholder="Ví dụ: NGUYEN VAN A"
                          className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-[#101828]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-bold text-slate-700">
                          Chi nhánh / Tỉnh, TP (Không bắt buộc)
                        </label>
                        <input
                          type="text"
                          value={formBranch}
                          onChange={(e) => setFormBranch(e.target.value)}
                          placeholder="Ví dụ: Chi nhánh Hà Nội"
                          className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-[#101828]"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-bold text-slate-700">
                          Ví điện tử
                        </label>
                        <input
                          type="text"
                          value={paymentDetailsTarget.name}
                          disabled
                          className="w-full bg-slate-50 border border-[#D5D7DA] rounded px-3 py-2 text-[13px] text-[#475467] font-semibold outline-none cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-bold text-slate-700">
                          Số điện thoại liên kết <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formPhoneNumber}
                          onChange={(e) => setFormPhoneNumber(e.target.value)}
                          placeholder="Nhập số điện thoại đăng ký ví"
                          className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-[#101828]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-bold text-slate-700">
                          Tên chủ tài khoản <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formAccountName}
                          onChange={(e) => setFormAccountName(e.target.value)}
                          placeholder="Nhập tên người sở hữu ví"
                          className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded px-3 py-2 text-[13px] outline-none transition-all font-semibold text-[#101828]"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-[#E9EAEB] flex items-center justify-end gap-2 bg-[#F8F9FA] flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaymentDetailsModalOpen(false);
                      setPaymentDetailsTarget(null);
                    }}
                    className="h-[32px] px-4 bg-white border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePaymentDetails}
                    className="h-[32px] px-5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] rounded-[8px] transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* POPUP THIẾT LẬP KẾT NỐI MISA MEINVOICE & CHỮ KÝ SỐ ESIGN */}
          {isMeInvoiceModalOpen && (
            <div className={`fixed top-0 left-0 bottom-0 bg-black/40 flex items-center justify-center z-[100000] animate-fade-in p-4 ${
              isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
            }`}>
              <div className="bg-white rounded-xl shadow-2xl border border-[#E9EAEB] max-w-3xl w-full overflow-hidden font-sans">
                {/* Header - White background, bold title matching design system */}
                <div className="bg-white border-b border-[#E9EAEB] px-6 py-4 flex items-center justify-between flex-shrink-0">
                  <h3 className="font-extrabold text-[18px] text-[#1D2939]">
                    Kết nối MISA meInvoice
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMeInvoiceModalOpen(false)}
                    className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>



                {/* 3-Step Progress Indicator */}
                <div className="flex items-center justify-center gap-3 md:gap-5 py-4 px-6 border-b border-slate-100 bg-white select-none overflow-x-auto">
                  {/* Step 1: Kết nối */}
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    {(meInvoiceSubStep === 'digital_signature' || meInvoiceSubStep === 'config') ? (
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-[#245FDF] text-[#245FDF]">
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#245FDF] text-white font-bold text-[13px]">
                        1
                      </div>
                    )}
                    <div className="text-left">
                      <div className={`text-[13px] font-bold leading-tight ${(meInvoiceSubStep === 'digital_signature' || meInvoiceSubStep === 'config') ? 'text-[#475467]' : 'text-[#245FDF]'}`}>Kết nối</div>
                      <div className="text-[12px] text-[#717680] font-medium leading-tight mt-0.5">MISA meInvoice</div>
                    </div>
                  </div>

                  {/* Connecting Line 1 */}
                  <div className="w-8 md:w-12 h-[1px] bg-[#D5D7DA]"></div>

                  {/* Step 2: Thiết lập ký số */}
                  <div className={`flex items-center gap-2.5 flex-shrink-0 ${(meInvoiceSubStep === 'digital_signature' || meInvoiceSubStep === 'config') ? 'opacity-100' : 'opacity-60'}`}>
                    {meInvoiceSubStep === 'config' ? (
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-[#245FDF] text-[#245FDF]">
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </div>
                    ) : (
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold ${meInvoiceSubStep === 'digital_signature' ? 'bg-[#245FDF] text-white' : 'bg-white border border-[#D5D7DA] text-[#717680]'}`}>
                        2
                      </div>
                    )}
                    <div className="text-left">
                      <div className={`text-[13px] font-bold leading-tight ${meInvoiceSubStep === 'digital_signature' ? 'text-[#245FDF]' : (meInvoiceSubStep === 'config' ? 'text-[#475467]' : 'text-[#717680]')}`}>Thiết lập ký số</div>
                      <div className="text-[12px] text-[#717680] font-medium leading-tight mt-0.5">Dịch vụ chữ ký số</div>
                    </div>
                  </div>

                  {/* Connecting Line 2 */}
                  <div className="w-8 md:w-12 h-[1px] bg-[#D5D7DA]"></div>

                  {/* Step 3: Thiết lập hoá đơn */}
                  <div className={`flex items-center gap-2.5 flex-shrink-0 ${meInvoiceSubStep === 'config' ? 'opacity-100' : 'opacity-60'}`}>
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold ${meInvoiceSubStep === 'config' ? 'bg-[#245FDF] text-white' : 'bg-white border border-[#D5D7DA] text-[#717680]'}`}>
                      3
                    </div>
                    <div className="text-left">
                      <div className={`text-[13px] font-bold leading-tight ${meInvoiceSubStep === 'config' ? 'text-[#245FDF]' : 'text-[#475467]'}`}>Thiết lập hoá đơn</div>
                      <div className="text-[12px] text-[#717680] font-medium leading-tight mt-0.5">Ký hiệu mẫu hóa đơn & thông tin phát hành</div>
                    </div>
                  </div>
                </div>

                {/* Form Body */}
                <div className="max-h-[60vh] overflow-y-auto bg-white">
                  {meInvoiceSubStep === 'login' && (
                    <>
                      {/* Banner block */}
                      <div className="m-6 p-4 rounded-xl bg-[#F0F5FF] border border-[#E0EAFF] flex items-start gap-4 text-left">
                        {/* Left side: MISA meInvoice logo & text description */}
                        <div className="flex-1">
                          <div className="flex items-center mb-2.5 select-none">
                            <img 
                              src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=23db9d1b-4469-4241-9b85-68c364947109.png&isTemp=true&tenantCode=misa" 
                              alt="MISA meInvoice Logo" 
                              className="w-auto h-7 object-contain rounded-md"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <p className="text-[13px] text-[#344054] leading-relaxed font-medium">
                            Giúp cửa hàng <span className="font-bold text-[#101828]">lập, tra cứu, lưu trữ hóa đơn</span> bằng các phương tiện điện tử thay thế hóa đơn giấy truyền thống. Từ đó giảm chi phí in ấn, lưu trữ an toàn, tra cứu dễ dàng...
                          </p>
                        </div>

                        {/* Right side: Illustration of laptop & printed invoice */}
                        <div className="hidden md:block flex-shrink-0 w-[140px] h-[95px] relative overflow-hidden flex items-center justify-center">
                          <img 
                            src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=03d8ccc0-c613-4ebd-be93-53778107629e.png&isTemp=true&tenantCode=misa" 
                            alt="MISA meInvoice Illustration" 
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      {/* Form input layout styled exactly as the provided mockup image */}
                      <div className="px-6 pb-6 space-y-4">
                        {/* MST / CCCD */}
                        <div className="flex flex-col sm:grid sm:grid-cols-[200px_1fr] sm:items-center gap-1.5 sm:gap-4 text-left">
                          <label className="text-[13.5px] font-bold text-[#344054] flex items-center gap-1">
                            Mã số thuế/CCCD chủ hộ <span className="text-[#D92D20]">*</span>
                          </label>
                          <input
                            type="text"
                            value={mstInput}
                            onChange={(e) => setMstInput(e.target.value)}
                            placeholder="Nhập mã số thuế hoặc CCCD"
                            className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-lg px-3.5 py-2 text-[13.5px] outline-none transition-all text-[#101828] font-semibold"
                          />
                        </div>

                        {/* Tên đăng nhập */}
                        <div className="flex flex-col sm:grid sm:grid-cols-[200px_1fr] sm:items-center gap-1.5 sm:gap-4 text-left">
                          <label className="text-[13.5px] font-bold text-[#344054] flex items-center gap-1">
                            Tên đăng nhập <span className="text-[#D92D20]">*</span>
                          </label>
                          <input
                            type="text"
                            value={meInvoiceUser}
                            onChange={(e) => setMeInvoiceUser(e.target.value)}
                            placeholder="Nhập email hoặc số điện thoại"
                            className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-lg px-3.5 py-2 text-[13.5px] outline-none transition-all text-[#101828] font-semibold"
                          />
                        </div>

                        {/* Mật khẩu */}
                        <div className="flex flex-col sm:grid sm:grid-cols-[200px_1fr] sm:items-center gap-1.5 sm:gap-4 text-left relative">
                          <label className="text-[13.5px] font-bold text-[#344054] flex items-center gap-1">
                            Mật khẩu <span className="text-[#D92D20]">*</span>
                          </label>
                          <div className="relative w-full">
                            <input
                              type={showMeInvoicePass ? 'text' : 'password'}
                              value={meInvoicePass}
                              onChange={(e) => setMeInvoicePass(e.target.value)}
                              placeholder="Nhập mật khẩu tài khoản"
                              className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-lg pl-3.5 pr-10 py-2 text-[13.5px] outline-none transition-all text-[#101828] font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => setShowMeInvoicePass(!showMeInvoicePass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#717680] hover:text-[#101828]"
                            >
                              {showMeInvoicePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Register promotion link */}
                        <div className="flex sm:grid sm:grid-cols-[200px_1fr] gap-4 text-left pt-2 select-none">
                          <div className="hidden sm:block"></div>
                          <p className="text-[13px] text-[#475467] font-semibold">
                            Bạn chưa có tài khoản MISA meInvoice?{' '}
                            <a 
                              href="https://meinvoice.vn" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[#245FDF] hover:underline font-bold"
                            >
                              Đăng ký ngay
                            </a>
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {meInvoiceSubStep === 'verify' && (
                    <div className="p-6 text-center max-w-xl mx-auto flex flex-col items-center select-none">
                      {/* Email Icon */}
                      <div className="w-12 h-12 rounded-full bg-[#E0EAFF] flex items-center justify-center text-[#245FDF] mb-4 shadow-sm animate-bounce">
                        <Mail className="w-6 h-6" />
                      </div>

                      <h4 className="text-[16px] font-extrabold text-[#1D2939] mb-2 text-center">
                        Xác thực tài khoản MISA meInvoice
                      </h4>
                      <p className="text-[13px] text-[#475467] leading-relaxed mb-6 font-medium text-center">
                        Mã xác thực OTP đã được gửi đến email đăng ký <span className="font-bold text-[#101828]">{meInvoiceUser}</span>. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác) và nhập mã xác thực gồm 6 chữ số bên dưới.
                      </p>

                      {/* Code input styled beautifully as requested */}
                      <div className="w-full max-w-xs mb-4">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="••••••"
                          value={meInvoiceVerificationCode}
                          onChange={(e) => setMeInvoiceVerificationCode(e.target.value)}
                          className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-lg px-4 py-2.5 text-[14px] sm:text-[14.5px] outline-none transition-all text-[#101828] placeholder-[#98A2B3] font-semibold text-center tracking-wider"
                        />
                      </div>

                      {/* Countdown Timer */}
                      <div className="text-[13px] text-[#717680] font-medium mb-6 select-none">
                        {meInvoiceCountdown > 0 ? (
                          <span>Gửi lại mã ({meInvoiceCountdown}s)</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setMeInvoiceCountdown(59);
                              onNotification('📩 Đã gửi lại mã xác nhận qua email!', 'success');
                            }}
                            className="text-[#245FDF] font-bold hover:underline cursor-pointer"
                          >
                            Gửi lại mã
                          </button>
                        )}
                      </div>

                      {/* Donot ask again checkbox */}
                      <div className="w-full max-w-lg flex items-center gap-2.5 text-left mb-2 px-1 select-none">
                        <input
                          id="donot-ask-checkbox"
                          type="checkbox"
                          checked={meInvoiceDonotAskAgain}
                          onChange={(e) => setMeInvoiceDonotAskAgain(e.target.checked)}
                          className="w-4 h-4 text-[#245FDF] border-[#D5D7DA] rounded-sm focus:ring-[#245FDF] cursor-pointer"
                        />
                        <label htmlFor="donot-ask-checkbox" className="text-[13px] text-[#344054] font-semibold cursor-pointer">
                          Không hỏi lại trên thiết bị này
                        </label>
                      </div>
                    </div>
                  )}

                  {meInvoiceSubStep === 'connected' && (
                    <div className="m-6 p-5 rounded-2xl bg-[#F0F9FF] border border-[#B9E6FE] flex flex-col gap-4 text-left relative min-h-[180px]">
                      {/* Laptop illustration positioned absolutely on the top right */}
                      <div className="hidden md:flex absolute top-5 right-5 w-[140px] h-[95px] items-center justify-center select-none">
                        <img 
                          src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=03d8ccc0-c613-4ebd-be93-53778107629e.png&isTemp=true&tenantCode=misa" 
                          alt="MISA meInvoice Illustration" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Header logo row (Logo & Status Badge) */}
                      <div className="flex items-center gap-3 select-none pr-0 md:pr-[160px]">
                        <img 
                          src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=23db9d1b-4469-4241-9b85-68c364947109.png&isTemp=true&tenantCode=misa" 
                          alt="MISA meInvoice Logo" 
                          className="w-auto h-8 object-contain rounded-md"
                          referrerPolicy="no-referrer"
                        />

                        {/* Green Connected Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#12B76A] text-white text-[12px] font-bold select-none">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                          Đã kết nối
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[13px] text-[#344054] font-medium leading-relaxed pr-0 md:pr-[160px]">
                        Bạn có thể phát hành ngay hóa đơn điện tử từ <span className="font-bold text-[#101828]">MISA CukCuk</span>. Vui lòng kiểm tra thiết lập thuế và hóa đơn để đảm bảo phát hành chính xác.
                      </p>

                      {/* White status stats card - extending full width to the edge */}
                      <div className="w-full bg-white rounded-xl border border-[#D5D7DA] p-4 space-y-2.5 shadow-xs mt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[13px] border-b border-slate-50 pb-2">
                          <span className="text-[#475467] font-semibold">Mã số thuế/ CCCD chủ hộ:</span>
                          <span className="font-extrabold text-[#101828]">0101243150-669</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[13px] border-b border-slate-50 pb-2">
                          <span className="text-[#475467] font-semibold">Số hoá đơn còn được sử dụng:</span>
                          <span className="font-extrabold text-[#101828]">888.988</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px]">
                          <span className="text-[#475467] font-semibold">Số hóa đơn từ MTT còn được sử dụng:</span>
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-[#101828]">11.452</span>
                            <a
                              href="https://meinvoice.vn"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#245FDF] hover:underline font-bold text-[13px] inline-flex items-center gap-1"
                            >
                              Mua thêm <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {meInvoiceSubStep === 'digital_signature' && (
                    <div className="px-6 py-5 space-y-5 text-left">
                      {/* Section Title */}
                      <div className="select-none">
                        <h4 className="text-[14px] font-bold text-[#101828]">Thiết lập chữ ký số phát hành hóa đơn</h4>
                        <p className="text-[12.5px] text-[#475467] mt-1 font-medium">Chọn phương thức ký số của cửa hàng để tự động ký và phát hành HĐĐT</p>
                      </div>

                      {/* Two cards side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Card 1: MISA eSign */}
                        <div 
                          onClick={() => {
                            setSignatureMethod('esign');
                            if (!eSignConnected) {
                              setIsMeInvoiceModalOpen(false);
                              setIsCertificateSelectorOpen(true);
                            }
                          }}
                          className={`relative border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between ${signatureMethod === 'esign' ? 'border-[#245FDF] bg-[#F5F8FF]' : 'border-[#D5D7DA] hover:border-[#98A2B3] bg-white'}`}
                        >
                          {/* Radio Selector Top Right */}
                          <div className="absolute top-5 right-5">
                            {signatureMethod === 'esign' ? (
                              <div className="w-5 h-5 rounded-full border-[1.5px] border-[#245FDF] flex items-center justify-center bg-[#245FDF]">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-[1.5px] border-[#D5D7DA] bg-white" />
                            )}
                          </div>

                          <div className="space-y-4">
                            {/* Header row: Logo, Name, Badge */}
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-white border border-[#E9EAEB] flex items-center justify-center p-1 shadow-xs flex-shrink-0 overflow-hidden">
                                <img
                                  src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=66b68431-5f08-47ab-a094-25d3961139d0.png&isTemp=true&tenantCode=misa"
                                  alt="MISA eSign"
                                  className="w-10 h-10 object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[14.5px] font-extrabold text-[#101828]">MISA eSign</span>
                                  <span className="px-2 py-0.5 rounded-[4px] bg-[#12B76A] text-white text-[11px] font-bold select-none">Khuyên dùng</span>
                                </div>
                                <p className="text-[12px] text-[#475467] font-semibold">Dịch vụ chữ ký số</p>
                              </div>
                            </div>

                            {/* Bullet points & information */}
                            <div className="space-y-2.5 pt-1">
                              <h5 className="text-[13px] font-bold text-[#101828]">Chữ ký số từ xa MISA eSign</h5>
                              <ul className="space-y-2 text-[12.5px] text-[#344054] font-medium leading-relaxed list-disc pl-4">
                                <li>Chữ ký số từ xa MISA eSign hỗ trợ ký mọi lúc, mọi nơi, an toàn và đảm bảo bảo mật tuyệt đối</li>
                                <li>
                                  Xem hướng dẫn kết nối{' '}
                                  <a href="https://esign.misa.vn" target="_blank" rel="noopener noreferrer" className="text-[#245FDF] hover:underline font-bold" onClick={(e) => e.stopPropagation()}>
                                    tại đây
                                  </a>.
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Connection button */}
                          <div className="pt-4 mt-auto">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSignatureMethod('esign');
                                setIsMeInvoiceModalOpen(false);
                                setIsCertificateSelectorOpen(true);
                              }}
                              className={`w-full h-[36px] font-bold text-[13px] rounded-lg border transition-all cursor-pointer inline-flex items-center justify-center ${eSignConnected && signatureMethod === 'esign' ? 'bg-[#E0EAFF] border-[#B2CCFF] text-[#245FDF]' : 'bg-white border-[#245FDF] text-[#245FDF] hover:bg-blue-50/40'}`}
                            >
                              {eSignConnected && signatureMethod === 'esign' ? '✓ Đã kết nối MISA eSign' : 'Kết nối MISA eSign'}
                            </button>
                          </div>
                        </div>

                        {/* Card 2: USB Token */}
                        <div 
                          onClick={() => setSignatureMethod('usb')}
                          className={`relative border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between ${signatureMethod === 'usb' ? 'border-[#245FDF] bg-[#F5F8FF]' : 'border-[#D5D7DA] hover:border-[#98A2B3] bg-white'}`}
                        >
                          {/* Radio Selector Top Right */}
                          <div className="absolute top-5 right-5">
                            {signatureMethod === 'usb' ? (
                              <div className="w-5 h-5 rounded-full border-[1.5px] border-[#245FDF] flex items-center justify-center bg-[#245FDF]">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-[1.5px] border-[#D5D7DA] bg-white" />
                            )}
                          </div>

                          <div className="space-y-4">
                            {/* Header row: Logo, Name, Badge */}
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] shadow-sm flex-shrink-0">
                                <Cpu className="w-6 h-6 stroke-[1.8]" />
                              </div>
                              <div>
                                <span className="text-[14.5px] font-extrabold text-[#101828]">USB ký số</span>
                                <p className="text-[12px] text-[#475467] font-semibold">Thiết bị USB token</p>
                              </div>
                            </div>

                            {/* Bullet points & information */}
                            <div className="space-y-2.5 pt-1">
                              <h5 className="text-[13px] font-bold text-[#101828]">Ký trực tiếp qua USB</h5>
                              <ul className="space-y-2 text-[12.5px] text-[#344054] font-medium leading-relaxed list-disc pl-4">
                                <li>Thiết bị đang sử dụng phải cài đặt công cụ MISA KYSO. Nếu chưa có công cụ, vui lòng tải <a href="https://kyso.misa.vn" target="_blank" rel="noopener noreferrer" className="text-[#245FDF] hover:underline font-bold" onClick={(e) => e.stopPropagation()}>tại đây</a>.</li>
                                <li>Thiết bị cần được cắm usb chứa chữ ký số khi thực hiện phát hành.</li>
                                <li>
                                  <span className="font-bold">Lưu ý:</span> Bạn cần thực hiện các bước trên mới có thể ký số được trên MISA meInvoice.
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Balance spacer */}
                          <div className="pt-4 mt-auto">
                            <div className="h-[36px] w-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {meInvoiceSubStep === 'config' && (
                    <div className="px-6 py-5 space-y-6">
                      {/* Section Title */}
                      <div className="text-left select-none">
                        <h4 className="text-[14px] font-bold text-[#101828]">Thiết lập phát hành Hoá đơn điện tử (HĐĐT)</h4>
                      </div>

                      {/* Toggle 1: Cho phép phát hành HĐĐT từ máy tính tiền */}
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setAllowPublishFromPos(!allowPublishFromPos)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 ${allowPublishFromPos ? 'bg-[#245FDF]' : 'bg-[#D5D7DA]'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${allowPublishFromPos ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                          <span className="text-[13px] font-semibold text-[#344054] select-none cursor-pointer" onClick={() => setAllowPublishFromPos(!allowPublishFromPos)}>
                            Cho phép phát hành HĐĐT từ máy tính tiền
                          </span>
                        </div>

                        {allowPublishFromPos && (
                          <div className="pl-12 flex items-center gap-2 select-none">
                            <input
                              id="auto-publish-checkbox"
                              type="checkbox"
                              checked={autoPublishAfterPayment}
                              onChange={(e) => setAutoPublishAfterPayment(e.target.checked)}
                              className="w-4 h-4 text-[#245FDF] border-[#D5D7DA] rounded-sm focus:ring-[#245FDF] cursor-pointer"
                            />
                            <label htmlFor="auto-publish-checkbox" className="text-[13px] text-[#344054] font-medium cursor-pointer flex items-center gap-1.5">
                              Tự động phát hành HĐĐT ngay sau khi thu tiền trên máy tính tiền
                              <HelpCircle className="w-3.5 h-3.5 text-[#245FDF] cursor-help" title="Thông tin thêm" />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Toggle 2: Tự động phát hành tất cả hóa đơn... */}
                      <div className="space-y-3.5 text-left">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => setAutoPublishAtTime(!autoPublishAtTime)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 mt-0.5 ${autoPublishAtTime ? 'bg-[#245FDF]' : 'bg-[#D5D7DA]'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${autoPublishAtTime ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                          <span className="text-[13px] font-semibold text-[#344054] leading-relaxed select-none cursor-pointer" onClick={() => setAutoPublishAtTime(!autoPublishAtTime)}>
                            Tự động phát hành tất cả hóa đơn tại thời điểm cụ thể trong ngày (bao gồm Hóa đơn thường - đã có thông tin khách hàng và Hóa đơn từ máy tính tiền)
                          </span>
                        </div>

                        {autoPublishAtTime && (
                          <div className="pl-12 space-y-3">
                            {/* Khung giờ phát hành */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 select-none">
                              <span className="text-[13px] text-[#475467] font-medium">Khung giờ phát hành:</span>
                              <div className="flex-1 max-w-xs bg-white border border-[#D5D7DA] rounded-lg px-3 py-1.5 flex items-center justify-between text-[13px]">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-flex items-center gap-1 bg-[#F2F4F7] border border-[#E4E7EC] px-2 py-0.5 rounded text-[12px] font-medium text-[#344054]">
                                    18:00 <X className="w-3 h-3 text-[#717680] cursor-pointer" />
                                  </span>
                                  <span className="inline-flex items-center gap-1 bg-[#F2F4F7] border border-[#E4E7EC] px-2 py-0.5 rounded text-[12px] font-medium text-[#344054]">
                                    22:00 <X className="w-3 h-3 text-[#717680] cursor-pointer" />
                                  </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-[#717680]" />
                              </div>
                            </div>

                            {/* Alert note box */}
                            <div className="p-3.5 rounded-xl bg-[#F0F5FF] border border-[#E0EAFF] text-[13px] text-[#344054] leading-relaxed font-medium flex items-start gap-2.5">
                              <Info className="w-4 h-4 text-[#245FDF] flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-[#245FDF]">Lưu ý:</span> Hệ thống sẽ tự động phát hành tất cả hóa đơn trong ngày vào lúc 23:55. Các hóa đơn chưa có thông tin phát hành sẽ được phát hành theo thiết lập mặc định nếu khách hàng không yêu cầu lấy HĐĐT.
                                <br />
                                Trong thời gian này, không thực hiện phát hành thủ công để tránh phát sinh lỗi.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Toggle 3: In mã QR... */}
                      <div className="space-y-3.5 text-left">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => setPrintQrOnBill(!printQrOnBill)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 mt-0.5 ${printQrOnBill ? 'bg-[#245FDF]' : 'bg-[#D5D7DA]'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${printQrOnBill ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                          <span className="text-[13px] font-semibold text-[#344054] leading-relaxed select-none cursor-pointer" onClick={() => setPrintQrOnBill(!printQrOnBill)}>
                            In mã QR trên phiếu thanh toán để khách hàng tự nhập thông tin xuất HĐĐT
                          </span>
                        </div>

                        {printQrOnBill && (
                          <div className="pl-12 space-y-3">
                            <div className="select-none">
                              <button type="button" className="text-[#245FDF] hover:underline text-[13px] font-bold cursor-pointer">
                                Tùy chỉnh người nhận thông báo
                              </button>
                              <span className="text-[13px] text-[#717680] font-medium ml-1">
                                (Đã chọn <span className="italic">0</span> nhân viên)
                              </span>
                            </div>

                            {/* Grey input info box */}
                            <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E4E7EC] text-[13px] text-[#344054] font-medium flex items-center gap-2 max-w-lg">
                              <span>Hiệu lực mã QR</span>
                              <input
                                type="text"
                                value={qrValidityHours}
                                onChange={(e) => setQrValidityHours(e.target.value)}
                                className="w-12 h-8 text-center bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-md text-[13px] font-bold outline-none"
                              />
                              <span>giờ (từ thời điểm thu tiền để KH nhập thông tin xuất HĐĐT)</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[#F2F4F7]"></div>

                      {/* Mẫu hoá đơn mặc định */}
                      <div className="space-y-3 text-left">
                        <h5 className="text-[13.5px] font-bold text-[#101828]">Mẫu hoá đơn mặc định</h5>
                        <div className="flex flex-col sm:grid sm:grid-cols-[200px_1fr] sm:items-center gap-2 sm:gap-4">
                          <label className="text-[13px] font-semibold text-[#344054]">
                            Chọn mẫu hoá đơn mặc định
                          </label>
                          <div className="relative max-w-xs w-full">
                            <button
                              type="button"
                              onClick={() => {
                                setDefaultInvoiceTemplate('');
                                setIsTemplateDropdownOpen(!isTemplateDropdownOpen);
                              }}
                              className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-lg px-3 py-2.5 text-[13px] outline-hidden transition-all font-semibold text-[#101828] cursor-pointer text-left flex items-center justify-between pr-10 min-h-[38px]"
                            >
                              <span className={defaultInvoiceTemplate ? 'text-[#101828]' : 'text-slate-400 font-medium'}>
                                {defaultInvoiceTemplate || ''}
                              </span>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680] pointer-events-none" />
                            </button>

                            {isTemplateDropdownOpen && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40 cursor-default" 
                                  onClick={() => setIsTemplateDropdownOpen(false)} 
                                />
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-[#D5D7DA] rounded-lg shadow-lg py-2.5 px-3.5 z-50 text-[13px] flex flex-col gap-2 animate-fade-in text-left">
                                  <div className="text-slate-400 text-[12px] font-medium">Không có dữ liệu mẫu hóa đơn</div>
                                  <div className="h-px bg-slate-100 my-0.5" />
                                  <a
                                    href="https://app.meinvoice.vn/login/1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                      setIsTemplateDropdownOpen(false);
                                    }}
                                    className="text-[#245FDF] hover:underline font-bold text-left cursor-pointer flex items-center gap-1.5 py-1 text-[13px]"
                                  >
                                    Thiết lập mẫu hoá đơn mặc định {"->"}
                                  </a>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[#F2F4F7]"></div>

                      {/* Thông tin KH mặc định khi không yêu cầu lấy HĐĐT */}
                      <div className="space-y-4 text-left">
                        <h5 className="text-[13.5px] font-bold text-[#101828]">Thông tin KH mặc định khi không yêu cầu lấy HĐĐT</h5>
                        <div className="space-y-3 max-w-2xl">
                          {/* Tên khách hàng */}
                          <div className="flex flex-col sm:grid sm:grid-cols-[200px_1fr] sm:items-center gap-1.5 sm:gap-4">
                            <label className="text-[13px] font-semibold text-[#475467]">Tên khách hàng</label>
                            <input
                              type="text"
                              value={defaultCustName}
                              onChange={(e) => setDefaultCustName(e.target.value)}
                              className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-lg px-3.5 py-2 text-[13px] outline-none transition-all text-[#101828] font-medium"
                            />
                          </div>
                          {/* Tên công ty */}
                          <div className="flex flex-col sm:grid sm:grid-cols-[200px_1fr] sm:items-center gap-1.5 sm:gap-4">
                            <label className="text-[13px] font-semibold text-[#475467]">Tên công ty</label>
                            <input
                              type="text"
                              value={defaultCompName}
                              onChange={(e) => setDefaultCompName(e.target.value)}
                              className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-lg px-3.5 py-2 text-[13px] outline-none transition-all text-[#101828] font-medium"
                            />
                          </div>
                          {/* Địa chỉ công ty */}
                          <div className="flex flex-col sm:grid sm:grid-cols-[200px_1fr] sm:items-center gap-1.5 sm:gap-4">
                            <label className="text-[13px] font-semibold text-[#475467]">Địa chỉ công ty</label>
                            <input
                              type="text"
                              value={defaultCompAddr}
                              onChange={(e) => setDefaultCompAddr(e.target.value)}
                              className="w-full bg-white border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-lg px-3.5 py-2 text-[13px] outline-none transition-all text-[#101828] font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[#F2F4F7]"></div>

                      {/* Hiển thị trên Hoá đơn điện tử */}
                      <div className="space-y-4 text-left">
                        <h5 className="text-[13.5px] font-bold text-[#101828]">Hiển thị trên Hoá đơn điện tử</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
                          {/* Col 1 */}
                          <div className="space-y-4">
                            {/* Item 1 */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setShowComboDetails(!showComboDetails)}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 ${showComboDetails ? 'bg-[#245FDF]' : 'bg-[#D5D7DA]'}`}
                              >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${showComboDetails ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                              <span className="text-[13px] text-[#344054] font-medium flex items-center gap-1.5 select-none cursor-pointer" onClick={() => setShowComboDetails(!showComboDetails)}>
                                Chi tiết món trong Combo
                                <HelpCircle className="w-3.5 h-3.5 text-[#98A2B3] cursor-help" onClick={(e) => e.stopPropagation()} />
                              </span>
                            </div>

                            {/* Item 2 */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setShowBilingual(!showBilingual)}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 ${showBilingual ? 'bg-[#245FDF]' : 'bg-[#D5D7DA]'}`}
                              >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${showBilingual ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                              <span className="text-[13px] text-[#344054] font-medium flex items-center gap-1.5 select-none cursor-pointer" onClick={() => setShowBilingual(!showBilingual)}>
                                Tên món song ngữ
                                <HelpCircle className="w-3.5 h-3.5 text-[#98A2B3] cursor-help" onClick={(e) => e.stopPropagation()} />
                              </span>
                            </div>

                            {/* Item 3 */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setShowFixedPayment(!showFixedPayment)}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 ${showFixedPayment ? 'bg-[#245FDF]' : 'bg-[#D5D7DA]'}`}
                              >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${showFixedPayment ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                              <span className="text-[13px] text-[#344054] font-medium flex items-center gap-1.5 select-none cursor-pointer" onClick={() => setShowFixedPayment(!showFixedPayment)}>
                                Hình thức thanh toán cố định: TM/CK
                                <HelpCircle className="w-3.5 h-3.5 text-[#98A2B3] cursor-help" onClick={(e) => e.stopPropagation()} />
                              </span>
                            </div>

                            {/* Item 4 */}
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                onClick={() => setShowExtendedInfo(!showExtendedInfo)}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 mt-0.5 ${showExtendedInfo ? 'bg-[#245FDF]' : 'bg-[#D5D7DA]'}`}
                              >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${showExtendedInfo ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                              <span className="text-[13px] text-[#344054] font-medium flex items-center gap-1.5 flex-wrap select-none cursor-pointer" onClick={() => setShowExtendedInfo(!showExtendedInfo)}>
                                Thêm thông tin mở rộng cho hóa đơn khi phát hành HĐĐT
                                <HelpCircle className="w-3.5 h-3.5 text-[#98A2B3] cursor-help" onClick={(e) => e.stopPropagation()} />
                                <span className="text-[#245FDF] hover:underline cursor-pointer font-bold text-[12px] ml-1" onClick={(e) => e.stopPropagation()}>Xem hướng dẫn</span>
                              </span>
                            </div>
                          </div>

                          {/* Col 2 */}
                          <div className="space-y-4">
                            {/* Item 5 */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setShowPaidPreferences(!showPaidPreferences)}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 ${showPaidPreferences ? 'bg-[#245FDF]' : 'bg-[#D5D7DA]'}`}
                              >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${showPaidPreferences ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                              <span className="text-[13px] text-[#344054] font-medium flex items-center gap-1.5 select-none cursor-pointer" onClick={() => setShowPaidPreferences(!showPaidPreferences)}>
                                Sở thích phục vụ có tính phí
                                <HelpCircle className="w-3.5 h-3.5 text-[#98A2B3] cursor-help" onClick={(e) => e.stopPropagation()} />
                              </span>
                            </div>

                            {/* Item 6 */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setShowTipNoChange(!showTipNoChange)}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 ${showTipNoChange ? 'bg-[#245FDF]' : 'bg-[#D5D7DA]'}`}
                              >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${showTipNoChange ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                              <span className="text-[13px] text-[#344054] font-medium flex items-center gap-1.5 select-none cursor-pointer" onClick={() => setShowTipNoChange(!showTipNoChange)}>
                                Tiền Khách tip/Không lấy tiền thừa
                                <HelpCircle className="w-3.5 h-3.5 text-[#98A2B3] cursor-help" onClick={(e) => e.stopPropagation()} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#E9EAEB] flex items-center justify-between bg-[#F8F9FA] flex-shrink-0 min-h-[70px]">
                  {meInvoiceSubStep === 'login' ? (
                    <>
                      <div className="flex-1"></div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsMeInvoiceModalOpen(false)}
                          className="h-[38px] px-5 bg-white border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!mstInput.trim() || !meInvoiceUser.trim() || !meInvoicePass.trim()) {
                              onNotification('⚠️ Vui lòng nhập đầy đủ các thông tin bắt buộc!', 'warning');
                              return;
                            }
                            setMeInvoiceSubStep('verify');
                            setMeInvoiceCountdown(59);
                          }}
                          className="h-[38px] px-6 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center shadow-sm"
                        >
                          Đăng nhập
                        </button>
                      </div>
                    </>
                  ) : meInvoiceSubStep === 'verify' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMeInvoiceSubStep('login')}
                        className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold text-[13px] sm:text-[13.5px] cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5 text-[#475467]" />
                        <span>Quay lại</span>
                      </button>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setMeInvoiceVerificationCode('123456');
                            onNotification('💡 Đã tự động nhập mã OTP mẫu: 123456', 'info');
                          }}
                          className="text-[#245FDF] hover:underline font-bold text-[13px] sm:text-[13.5px] cursor-pointer"
                        >
                          Thử cách khác
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!meInvoiceVerificationCode.trim()) {
                              onNotification('⚠️ Vui lòng nhập mã xác thực OTP!', 'warning');
                              return;
                            }
                            setMeInvoiceConnected(true);
                            setESignConnected(true);
                            localStorage.setItem('cukcuk_meinvoice_connected', 'true');
                            localStorage.setItem('cukcuk_esign_connected', 'true');
                            setMeInvoiceSubStep('connected');
                            onNotification('🎉 Xác thực OTP thành công!', 'success');
                          }}
                          className="h-[38px] px-6 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center shadow-sm"
                        >
                          Xác thực
                        </button>
                      </div>
                    </>
                  ) : meInvoiceSubStep === 'digital_signature' ? (
                    <>
                      <div className="flex-1"></div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMeInvoiceSubStep('connected')}
                          className="h-[38px] px-5 bg-white border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                          Quay lại
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!signatureMethod) {
                              onNotification('⚠️ Vui lòng chọn phương thức ký số để tiếp tục!', 'warning');
                              return;
                            }
                            if (signatureMethod === 'esign' && !eSignConnected) {
                              onNotification('⚠️ Vui lòng click "Kết nối MISA eSign" để hoàn tất thiết lập ký số!', 'warning');
                              return;
                            }
                            setMeInvoiceSubStep('config');
                          }}
                          className="h-[38px] px-6 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center shadow-sm"
                        >
                          Tiếp theo
                        </button>
                      </div>
                    </>
                  ) : meInvoiceSubStep === 'config' ? (
                    <>
                      <div className="flex-1"></div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMeInvoiceSubStep('digital_signature')}
                          className="h-[38px] px-5 bg-white border border-[#D5D7DA] hover:bg-slate-50 text-slate-700 font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                          Quay lại
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMeInvoiceModalOpen(false);
                            onNotification('🎉 Lưu thiết lập phát hành HĐĐT thành công!', 'success');
                          }}
                          className="h-[38px] px-6 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center shadow-sm"
                        >
                          Lưu
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1"></div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setMeInvoiceConnected(false);
                            setESignConnected(false);
                            localStorage.removeItem('cukcuk_meinvoice_connected');
                            localStorage.removeItem('cukcuk_esign_connected');
                            setMeInvoiceSubStep('login');
                            onNotification('🔌 Đã ngắt kết nối Hóa đơn điện tử MISA meInvoice!', 'info');
                          }}
                          className="h-[38px] px-5 bg-white border border-[#FDA29B] hover:bg-[#FEF3F2] text-[#D92D20] font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                          Ngắt kết nối
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMeInvoiceSubStep('digital_signature');
                          }}
                          className="h-[38px] px-6 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center shadow-sm"
                        >
                          Tiếp theo
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FORM POPUP OVERLAY */}
          {isAreaFormOpen && (
            <div className={`fixed top-0 left-0 bottom-0 bg-black/60 z-[100010] flex items-center justify-center p-4 animate-fade-in select-none ${
              isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
            }`}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[580px] flex flex-col border border-slate-200 overflow-hidden animate-scale-in">
                {/* Title Bar - Black title, white background, "?" help and "X" close buttons in the top right */}
                <div className="bg-white border-b border-slate-200 text-slate-900 px-5 py-4 flex justify-between items-center flex-shrink-0 select-none shadow-xs">
                  <h3 className="font-sans font-bold text-[16px] text-slate-950">
                    {areaFormMode === 'create' ? 'Thêm Bếp/Bar' : 'Sửa Bếp/Bar'}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onNotification('ℹ️ Bếp/Bar dùng để định tuyến in tem gọi món và quản lý địa điểm chế biến món ăn.', 'info');
                      }}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Trợ giúp"
                    >
                      <HelpCircle className="w-5 h-5 stroke-[2.2]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAreaFormOpen(false)}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Đóng"
                    >
                      <X className="w-5 h-5 stroke-[2.2]" />
                    </button>
                  </div>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left bg-white text-[13px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Loại */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5 text-[13px]">
                        Loại <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={areaType}
                        onChange={(e) => setAreaType(e.target.value as 'Bếp' | 'Bar')}
                        className="w-full bg-white border border-[#D0D5DD] focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-1.5 font-semibold text-slate-800 outline-hidden transition-all shadow-2xs text-[13px]"
                      >
                        <option value="Bếp">Bếp</option>
                        <option value="Bar">Bar</option>
                      </select>
                    </div>

                    {/* Tên bếp/bar */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5 text-[13px]">
                        Tên bếp/bar <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                        placeholder="VD: Bếp nướng, Bếp lẩu, Bar pha chế..."
                        className="w-full bg-white border border-[#D0D5DD] focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-1.5 font-semibold text-slate-800 outline-hidden transition-all shadow-2xs text-[13px]"
                      />
                    </div>
                  </div>

                  {/* Sử dụng thiết bị */}
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5 text-[13px]">Sử dụng thiết bị</label>
                    <div className="flex flex-wrap items-center gap-6 py-1">
                      {[
                        { value: 'Máy tính bảng', label: 'Máy tính bảng' },
                        { value: 'Máy in', label: 'Máy in' },
                        { value: 'Không sử dụng', label: 'Không sử dụng' }
                      ].map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold select-none text-[13px]">
                          <input
                            type="radio"
                            name="areaDevice"
                            value={opt.value}
                            checked={areaDevice === opt.value}
                            onChange={() => setAreaDevice(opt.value as any)}
                            className="text-blue-600 focus:ring-blue-500 rounded-full w-4 h-4"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Thời điểm in tem */}
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5 text-[13px]">Thời điểm in tem</label>
                    <div className="flex flex-wrap items-center gap-6 py-1">
                      {[
                        { value: 'In sau khi gửi yêu cầu chế biến', label: 'In sau khi gửi yêu cầu chế biến', tooltip: 'In tem nhãn khi món được gửi bếp/bar' },
                        { value: 'In sau khi trả món', label: 'In sau khi trả món', tooltip: 'In tem nhãn khi bếp/bar thực hiện trả món trên ứng dụng KDS' }
                      ].map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold select-none text-[13px]">
                          <input
                            type="radio"
                            name="areaPrintTime"
                            value={opt.value}
                            checked={areaPrintTime === opt.value}
                            onChange={() => setAreaPrintTime(opt.value as any)}
                            className="text-blue-600 focus:ring-blue-500 rounded-full w-4 h-4"
                          />
                          <span className="flex items-center gap-1">
                            {opt.label}
                            <span className="relative group inline-block">
                              <span className="text-blue-500 font-bold text-[13px] cursor-help hover:underline">ⓘ</span>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[13px] font-medium rounded px-2.5 py-1.5 whitespace-nowrap z-50 shadow-md">
                                {opt.tooltip}
                                {/* Little arrow */}
                                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                              </span>
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Diễn giải */}
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5 text-[13px]">Diễn giải</label>
                    <textarea
                      value={areaDescription}
                      onChange={(e) => setAreaDescription(e.target.value)}
                      placeholder="Mô tả công việc chế biến của bếp/bar..."
                      rows={2}
                      className="w-full bg-white border border-[#D0D5DD] focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-1.5 font-semibold text-slate-800 outline-hidden transition-all shadow-2xs resize-none text-[13px]"
                    />
                  </div>

                  {/* Khu vực chế biến */}
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5 text-[13px]">Khu vực chế biến</label>
                    <select
                      value={areaZone}
                      onChange={(e) => setAreaZone(e.target.value)}
                      className="w-full bg-white border border-[#D0D5DD] focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-1.5 font-semibold text-slate-800 outline-hidden transition-all shadow-2xs text-[13px]"
                    >
                      <option value="Khu dã ngoại">Khu dã ngoại</option>
                      <option value="Quầy chính">Quầy chính</option>
                      <option value="Khu trong nhà">Khu trong nhà</option>
                      <option value="Sân vườn">Sân vườn</option>
                    </select>
                  </div>

                  {/* List of dishes section */}
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-900 text-[13px] font-semibold">
                        Chế biến {areaSelectedDishes.length} món
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTempSelectedDishes([...areaSelectedDishes]);
                          setFilterDishName('');
                          setFilterDishGroup('');
                          setFilterDishPrep('');
                          setIsDishSelectOpen(true);
                        }}
                        className="text-[#2563EB] hover:text-[#1D4ED8] hover:bg-blue-50 border border-[#2563EB] bg-white px-3 py-1.5 rounded-lg flex items-center transition-colors cursor-pointer font-bold text-[13px] select-none h-[32px] shadow-2xs"
                      >
                        Chọn món
                      </button>
                    </div>

                    {/* Mini table of selected dishes */}
                    <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto bg-slate-50/50">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10 text-[13px] font-bold text-slate-800">
                          <tr>
                            <th className="py-2 px-3">Tên món</th>
                            <th className="py-2 px-3 w-40">Nhóm thực đơn</th>
                            <th className="py-2 px-3 w-16 text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[13px] font-semibold text-slate-700 bg-white">
                          {areaSelectedDishes.map((dishName, sidx) => {
                            // Helper to find category
                            const foundDish = menuItems.find(m => m.name === dishName) || VUON_BIA_DISHES.find(d => d.name === dishName);
                            return (
                              <tr key={sidx} className="hover:bg-slate-50">
                                <td className="py-2 px-3 font-bold text-slate-900">{dishName}</td>
                                <td className="py-2 px-3 text-slate-500 font-medium">
                                  {foundDish?.type || 'Món chính'}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAreaSelectedDishes(prev => prev.filter(d => d !== dishName));
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {areaSelectedDishes.length === 0 && (
                            <tr>
                              <td colSpan={3} className="py-6 text-center text-slate-400 font-medium text-[13px]">
                                Chưa có món nào được gán chế biến ở khu vực này. Vui lòng bấm "Chọn món"!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Form Footer */}
                <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex justify-end items-center gap-2.5 flex-shrink-0 select-none rounded-b-xl">
                  <button
                    type="button"
                    onClick={() => setIsAreaFormOpen(false)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-lg transition-all cursor-pointer text-[13px] flex items-center justify-center shadow-2xs active:scale-95 h-[36px]"
                  >
                    Hủy bỏ
                  </button>
                  
                  {areaFormMode === 'edit' ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveAreaForm(false);
                      }}
                      className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg transition-all cursor-pointer text-[13px] flex items-center justify-center shadow-sm active:scale-95 h-[36px]"
                    >
                      Lưu
                    </button>
                  ) : (
                    /* Combo Button: Lưu & Lưu và Thêm */
                    <div className="relative flex items-center">
                      {/* Main Save Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSaveDropdownOpen(false);
                          handleSaveAreaForm(false);
                        }}
                        className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-l-lg transition-all cursor-pointer text-[13px] flex items-center justify-center shadow-sm active:scale-95 h-[36px] border-r border-blue-700"
                      >
                        Lưu
                      </button>
                      {/* Dropdown Chevron Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSaveDropdownOpen(!isSaveDropdownOpen);
                        }}
                        className="px-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-r-lg transition-all cursor-pointer text-[13px] flex items-center justify-center shadow-sm active:scale-95 h-[36px]"
                        title="Thêm lựa chọn"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu Option */}
                      {isSaveDropdownOpen && (
                        <>
                          {/* Invisible click-away backdrop */}
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={() => setIsSaveDropdownOpen(false)} 
                          />
                          <div className="absolute right-0 bottom-full mb-2 bg-white border border-[#E9EAEB] rounded-lg shadow-md z-50 py-1 min-w-[130px] animate-fade-in text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setIsSaveDropdownOpen(false);
                                handleSaveAreaForm(true);
                              }}
                              className="w-full text-left px-3.5 py-2 text-[13px] text-[#101828] hover:bg-[#F9FAFB] font-semibold transition-colors cursor-pointer"
                            >
                              Lưu và thêm
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* FORM CHỌN MÓN SUB-MODAL OVERLAY */}
          {isDishSelectOpen && (
            <div className={`fixed top-0 left-0 bottom-0 bg-black/60 z-[100020] flex items-center justify-center p-4 animate-fade-in select-none ${
              isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
            }`}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[560px] flex flex-col border border-slate-200 overflow-hidden">
                {/* Title Bar - Black title, white background, "?" help and "X" close buttons in the top right */}
                <div className="bg-white border-b border-slate-200 text-slate-900 px-5 py-4 flex justify-between items-center flex-shrink-0 select-none shadow-xs">
                  <h3 className="font-sans font-bold text-[15px] text-slate-950">
                    Chọn món cho bếp/bar - {areaName || (areaType === 'Bar' ? 'Quầy Bar' : 'Nhà Bếp')}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onNotification('ℹ️ Chọn các món ăn được định tuyến để chế biến tại khu vực này. Tích chọn ô vuông bên cạnh để chọn.', 'info');
                      }}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Trợ giúp"
                    >
                      <HelpCircle className="w-5 h-5 stroke-[2.2]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDishSelectOpen(false)}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Đóng"
                    >
                      <X className="w-5 h-5 stroke-[2.2]" />
                    </button>
                  </div>
                </div>

                {/* Table with Top Filters */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0 bg-slate-50/35">
                  <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse table-fixed">
                      <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10 text-[13px] font-bold text-slate-800">
                        {/* Headers */}
                        <tr>
                          <th className="py-2.5 px-3 w-12 text-center">
                            <input
                              type="checkbox"
                              checked={
                                (() => {
                                  const dishesList = menuItems.length > 0 ? menuItems : VUON_BIA_DISHES;
                                  const filtered = dishesList.filter(dish => {
                                    const prepLoc = getDishPrepLocation(dish.name);
                                    return (
                                      dish.name.toLowerCase().includes(filterDishName.toLowerCase()) &&
                                      (dish.type || 'Món chính').toLowerCase().includes(filterDishGroup.toLowerCase()) &&
                                      (prepLoc || '').toLowerCase().includes(filterDishPrep.toLowerCase())
                                    );
                                  });
                                  if (filtered.length === 0) return false;
                                  return filtered.every(dish => tempSelectedDishes.includes(dish.name));
                                })()
                              }
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const dishesList = menuItems.length > 0 ? menuItems : VUON_BIA_DISHES;
                                const filtered = dishesList.filter(dish => {
                                  const prepLoc = getDishPrepLocation(dish.name);
                                  return (
                                    dish.name.toLowerCase().includes(filterDishName.toLowerCase()) &&
                                    (dish.type || 'Món chính').toLowerCase().includes(filterDishGroup.toLowerCase()) &&
                                    (prepLoc || '').toLowerCase().includes(filterDishPrep.toLowerCase())
                                  );
                                });
                                if (checked) {
                                  setTempSelectedDishes(prev => {
                                    const next = [...prev];
                                    filtered.forEach(dish => {
                                      if (!next.includes(dish.name)) next.push(dish.name);
                                    });
                                    return next;
                                  });
                                } else {
                                  setTempSelectedDishes(prev => {
                                    return prev.filter(name => !filtered.some(f => f.name === name));
                                  });
                                }
                              }}
                              className="text-[#245FDF] focus:ring-blue-500 rounded cursor-pointer"
                            />
                          </th>
                          <th className="py-2.5 px-3">Tên món</th>
                          <th className="py-2.5 px-3 w-56">Nhóm thực đơn</th>
                          <th className="py-2.5 px-3 w-56">Chế biến tại</th>
                        </tr>
                        {/* Search Filters Row */}
                        <tr className="bg-slate-50/70 border-b border-[#E9EAEB]">
                          <td className="py-1.5 px-3 text-center">
                            <span className="text-slate-400 text-xs">🔍</span>
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="text"
                              value={filterDishName}
                              onChange={(e) => setFilterDishName(e.target.value)}
                              placeholder="Lọc tên món..."
                              className="w-full bg-white border border-[#D0D5DD] focus:border-[#2563EB] rounded-md px-2 py-1 text-xs font-medium outline-hidden"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="text"
                              value={filterDishGroup}
                              onChange={(e) => setFilterDishGroup(e.target.value)}
                              placeholder="Lọc nhóm thực đơn..."
                              className="w-full bg-white border border-[#D0D5DD] focus:border-[#2563EB] rounded-md px-2 py-1 text-xs font-medium outline-hidden"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              type="text"
                              value={filterDishPrep}
                              onChange={(e) => setFilterDishPrep(e.target.value)}
                              placeholder="Lọc nơi chế biến..."
                              className="w-full bg-white border border-[#D0D5DD] focus:border-[#2563EB] rounded-md px-2 py-1 text-xs font-medium outline-hidden"
                            />
                          </td>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[13px] font-semibold text-slate-700">
                        {(() => {
                          const dishesList = menuItems.length > 0 ? menuItems : VUON_BIA_DISHES;
                          const filtered = dishesList.filter(dish => {
                            const prepLoc = getDishPrepLocation(dish.name);
                            return (
                              dish.name.toLowerCase().includes(filterDishName.toLowerCase()) &&
                              (dish.type || 'Món chính').toLowerCase().includes(filterDishGroup.toLowerCase()) &&
                              (prepLoc || '').toLowerCase().includes(filterDishPrep.toLowerCase())
                            );
                          });

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={4} className="py-10 text-center text-slate-400 font-semibold text-[13px]">
                                  Không tìm thấy món ăn nào phù hợp với bộ lọc!
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((dish, dIdx) => {
                            const isChecked = tempSelectedDishes.includes(dish.name);
                            const prepLoc = getDishPrepLocation(dish.name);
                            return (
                              <tr 
                                key={dIdx} 
                                onClick={() => {
                                  if (isChecked) {
                                    setTempSelectedDishes(prev => prev.filter(d => d !== dish.name));
                                  } else {
                                    setTempSelectedDishes(prev => [...prev, dish.name]);
                                  }
                                }}
                                className={`hover:bg-[#EDFCF4]/40 cursor-pointer transition-colors ${isChecked ? 'bg-emerald-50/30' : ''}`}
                              >
                                <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setTempSelectedDishes(prev => prev.filter(d => d !== dish.name));
                                      } else {
                                        setTempSelectedDishes(prev => [...prev, dish.name]);
                                      }
                                    }}
                                    className="text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer"
                                  />
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-900">{dish.name}</td>
                                <td className="py-2.5 px-3 text-slate-600 font-medium">{dish.type || 'Món chính'}</td>
                                <td className="py-2.5 px-3">
                                  <span className={`px-2 py-0.5 rounded-md text-[12px] font-bold ${
                                    prepLoc === 'Chưa thiết lập' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {prepLoc}
                                  </span>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex justify-end items-center gap-2.5 flex-shrink-0 select-none">
                  <button
                    type="button"
                    onClick={() => setIsDishSelectOpen(false)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-lg transition-all cursor-pointer text-[13px] flex items-center justify-center shadow-2xs active:scale-95 h-[36px]"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAreaSelectedDishes([...tempSelectedDishes]);
                      setIsDishSelectOpen(false);
                      onNotification(`Đã cập nhật ${tempSelectedDishes.length} món chế biến vào form!`, 'success');
                    }}
                    className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg transition-all cursor-pointer text-[13px] flex items-center justify-center shadow-sm active:scale-95 h-[36px]"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}

      </div>
    )}

          {/* POPUP CHỌN CHỨNG THƯ SỐ */}
          {isCertificateSelectorOpen && (
            <div className={`fixed top-0 left-0 bottom-0 bg-black/40 flex items-center justify-center z-[100010] animate-fade-in p-4 text-left ${
              isAiSheetOpen ? 'right-0 md:right-[400px]' : 'right-0'
            }`}>
              <div className="bg-white rounded-xl shadow-2xl border border-[#E9EAEB] max-w-2xl w-full overflow-hidden font-sans">
                {/* Header - White background, bold title matching design system */}
                <div className="bg-white border-b border-[#E9EAEB] px-6 py-4 flex items-center justify-between flex-shrink-0">
                  <h3 className="font-extrabold text-[18px] text-[#1D2939]">
                    Chọn chứng thư số
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setMeInvoiceSubStep('digital_signature');
                      setIsCertificateSelectorOpen(false);
                      setIsMeInvoiceModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#98A2B3] hover:text-[#475467] hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body with certificate items */}
                <div className="p-6 space-y-4 text-left">
                  {/* Item 1: CÔNG TY CỔ PHẦN MISA */}
                  <div 
                    onClick={() => setSelectedCertificateId('misa')}
                    className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all text-left ${
                      selectedCertificateId === 'misa' 
                        ? 'border-2 border-[#245FDF] bg-[#F5F8FF]/30' 
                        : 'border-[#E9EAEB] hover:border-[#D5D7DA] bg-white'
                    }`}
                  >
                    {/* Left: Brand Logo */}
                    <div className="w-11 h-11 rounded-lg bg-white border border-[#E9EAEB] flex items-center justify-center p-1 flex-shrink-0 shadow-xs mt-0.5 overflow-hidden">
                      <img
                        src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=66b68431-5f08-47ab-a094-25d3961139d0.png&isTemp=true&tenantCode=misa"
                        alt="MISA eSign"
                        className="w-9 h-9 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 space-y-1 select-none text-left">
                      <h4 className="text-[14.5px] font-extrabold text-[#101828]">
                        CÔNG TY CỔ PHẦN MISA
                      </h4>
                      <div className="space-y-0.5 text-[12.5px] text-[#475467] font-semibold text-left">
                        <p>
                          Tài khoản: <span className="text-[#344054] font-bold">010112349432</span>
                        </p>
                        <p className="break-all">
                          Số chứng thư: <span className="text-[#344054] font-medium">54010C6774072FC0B1B45963D6DD3017</span>
                        </p>
                        <p>
                          Hiệu lực: <span className="text-[#344054] font-medium">16/01/2026 - 03/12/2026</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Check Circle */}
                    <div className="flex-shrink-0 self-center">
                      {selectedCertificateId === 'misa' ? (
                        <div className="w-5.5 h-5.5 rounded-full bg-[#245FDF] flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                      ) : (
                        <div className="w-5.5 h-5.5 rounded-full border border-[#D5D7DA] bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Item 2: NGUYỄN NAM MINH (KẾ TOÁN) */}
                  <div 
                    onClick={() => setSelectedCertificateId('minh')}
                    className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all text-left ${
                      selectedCertificateId === 'minh' 
                        ? 'border-2 border-[#245FDF] bg-[#F5F8FF]/30' 
                        : 'border-[#E9EAEB] hover:border-[#D5D7DA] bg-white'
                    }`}
                  >
                    {/* Left: Brand Logo */}
                    <div className="w-11 h-11 rounded-lg bg-white border border-[#E9EAEB] flex items-center justify-center p-1 flex-shrink-0 shadow-xs mt-0.5 overflow-hidden">
                      <img
                        src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=66b68431-5f08-47ab-a094-25d3961139d0.png&isTemp=true&tenantCode=misa"
                        alt="MISA eSign"
                        className="w-9 h-9 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 space-y-1 select-none text-left">
                      <h4 className="text-[14.5px] font-extrabold text-[#101828]">
                        NGUYỄN NAM MINH (KẾ TOÁN)
                      </h4>
                      <div className="space-y-0.5 text-[12.5px] text-[#475467] font-semibold text-left">
                        <p>
                          Tài khoản: <span className="text-[#344054] font-bold">0987654321</span>
                        </p>
                        <p className="break-all">
                          Số chứng thư: <span className="text-[#344054] font-medium">54010C6774072FC0B1B45963D6DD3017</span>
                        </p>
                        <p>
                          Hiệu lực: <span className="text-[#344054] font-medium">16/01/2026 - 03/12/2026</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Check Circle */}
                    <div className="flex-shrink-0 self-center">
                      {selectedCertificateId === 'minh' ? (
                        <div className="w-5.5 h-5.5 rounded-full bg-[#245FDF] flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                      ) : (
                        <div className="w-5.5 h-5.5 rounded-full border border-[#D5D7DA] bg-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer with Đồng ý button */}
                <div className="bg-[#F9FAFB] border-t border-[#E9EAEB] px-6 py-4 flex items-center justify-end flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setESignConnected(true);
                      localStorage.setItem('cukcuk_esign_connected', 'true');
                      setMeInvoiceSubStep('digital_signature');
                      setIsCertificateSelectorOpen(false);
                      setIsMeInvoiceModalOpen(true);
                      onNotification('🎉 Đã liên kết meInvoice và chữ ký số MISA eSign thành công!', 'success');
                    }}
                    className="h-[38px] px-6 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-[13px] sm:text-[13.5px] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center shadow-sm"
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            </div>
          )}

    </div>
  );
};
