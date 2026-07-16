import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Plus, Trash2, Check, LayoutGrid, UtensilsCrossed, Settings, 
  HelpCircle, Tablet, CreditCard, Printer, QrCode, ClipboardList, ShieldCheck, 
  ArrowRight, ArrowLeft, Coins, CheckCircle2, ChevronRight, RefreshCw, LogOut, 
  Info, List, ShieldAlert, PlusCircle, Laptop, Link2, Wifi, Bluetooth, Radio,
  Camera, Edit2, Save, Move, Grid, X, Loader2, ChevronDown, Search, Utensils, Wine,
  Coffee, Soup, Beer, Pizza, FileX, Ban, UserCheck, ShoppingCart, FileText, Percent,
  Layers, DollarSign, TrendingUp, Activity, Flame, Mic, Package, Users, Heart, BarChart3,
  Building2, Store
} from 'lucide-react';

interface OnboardingScreenProps {
  userProfile: any;
  onComplete: () => void;
  customMenuItems: any[];
  setCustomMenuItems: (items: any[]) => void;
  isMenuSetup: boolean;
  setIsMenuSetup: (val: boolean) => void;
  isPaymentSetup: boolean;
  setIsPaymentSetup: (val: boolean) => void;
  isPrinterSetup: boolean;
  setIsPrinterSetup: (val: boolean) => void;
  isInvoiceSetup: boolean;
  setIsInvoiceSetup: (val: boolean) => void;
  isTableSetup: boolean;
  setIsTableSetup: (val: boolean) => void;
  isTaxSetup: boolean;
  setIsTaxSetup: (val: boolean) => void;
  
  paymentSettings: any;
  setPaymentSettings: (val: any) => void;
  connectedPrinters: any[];
  setConnectedPrinters: (val: any[]) => void;
  taxSettings: any;
  setTaxSettings: (val: any) => void;
  invoiceSettings: any;
  setInvoiceSettings: (val: any) => void;
  
  customZones: string[];
  setCustomZones: (val: string[]) => void;
  customTables: any[];
  setCustomTables: (val: any[]) => void;
  kitchenStations: any[];
  setKitchenStations: (val: any[]) => void;

  // New survey props
  businessType?: string;
  setBusinessType?: (val: string) => void;
  orderMethod?: string;
  setOrderMethod?: (val: string) => void;
  kitchenDevice?: string;
  setKitchenDevice?: (val: string) => void;
}

const ONBOARDING_BANKS = [
  { id: 'vietcombank', name: 'Vietcombank', code: 'VCB', logo: 'https://api.vietqr.io/img/VCB.png' },
  { id: 'techcombank', name: 'Techcombank', code: 'TCB', logo: 'https://api.vietqr.io/img/TCB.png' },
  { id: 'bidv', name: 'BIDV', code: 'BIDV', logo: 'https://api.vietqr.io/img/BIDV.png' },
  { id: 'acb', name: 'ACB', code: 'ACB', logo: 'https://api.vietqr.io/img/ACB.png' },
  { id: 'mbbank', name: 'MB Bank', code: 'MB', logo: 'https://api.vietqr.io/img/MB.png' },
  { id: 'vietinbank', name: 'VietinBank', code: 'CTG', logo: 'https://api.vietqr.io/img/ICB.png' },
  { id: 'tpbank', name: 'TPBank', code: 'TPB', logo: 'https://api.vietqr.io/img/TPB.png' },
  { id: 'agribank', name: 'Agribank', code: 'VBA', logo: 'https://api.vietqr.io/img/VBA.png' },
];

const BANK_LIST_NEW = [
  { id: 'techcombank', name: 'Techcombank', code: 'TCB', logo: 'https://api.vietqr.io/img/TCB.png', color: '#E01E26', fallbackText: 'TCB' },
  { id: 'mbbank', name: 'MB Bank', code: 'MB', logo: 'https://api.vietqr.io/img/MB.png', color: '#004B91', fallbackText: 'MB' },
  { id: 'bidv', name: 'BIDV', code: 'BIDV', logo: 'https://api.vietqr.io/img/BIDV.png', color: '#005AAB', fallbackText: 'BIDV' },
  { id: 'vietinbank', name: 'VietinBank', code: 'CTG', logo: 'https://api.vietqr.io/img/ICB.png', color: '#0082C5', fallbackText: 'CTG' },
  { id: 'acb', name: 'ACB', code: 'ACB', logo: 'https://api.vietqr.io/img/ACB.png', color: '#0072C6', fallbackText: 'ACB' },
  { id: 'msb', name: 'MSB', code: 'MSB', logo: 'https://api.vietqr.io/img/MSB.png', color: '#F37021', fallbackText: 'MSB' },
  { id: 'vietcombank', name: 'Vietcombank', code: 'VCB', logo: 'https://api.vietqr.io/img/VCB.png', color: '#74B02A', fallbackText: 'VCB' },
  { id: 'vpbank', name: 'VPBank', code: 'VPB', logo: 'https://api.vietqr.io/img/VPB.png', color: '#009B4E', fallbackText: 'VPB' },
  { id: 'tpbank', name: 'TPBank', code: 'TPB', logo: 'https://api.vietqr.io/img/TPB.png', color: '#502384', fallbackText: 'TPB' },
];

const WALLET_LIST_NEW = [
  { id: 'momo', name: 'Momo', code: 'MOMO', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png', color: '#A50064', fallbackText: 'MoMo' },
  { id: 'vnpay', name: 'VNPay', code: 'VNPAY', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png', color: '#005BAA', fallbackText: 'VNPay' },
  { id: 'zalopay', name: 'ZaloPay', code: 'ZALOPAY', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png', color: '#0084FF', fallbackText: 'Zalo' },
];

function BankLogo({ src, alt, fallbackText, color, size = 'normal' }: { src: string; alt: string; fallbackText: string; color: string; size?: 'normal' | 'large' | 'xl' }) {
  const [error, setError] = useState(false);
  const sizeClass = size === 'xl'
    ? 'w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-2'
    : size === 'large'
      ? 'w-16 h-10 rounded-lg p-1 px-2'
      : 'w-12 h-8 rounded-lg p-1 px-1.5';
  if (error || !src) {
    return (
      <div className={`${sizeClass} flex items-center justify-center font-bold text-sm text-white shadow-xs shrink-0`} style={{ backgroundColor: color }}>
        {fallbackText}
      </div>
    );
  }
  return (
    <div className={`${sizeClass} bg-white border border-[#E9EAEB] flex items-center justify-center shrink-0 shadow-[0_8px_16px_-4px_rgba(16,24,40,0.05)] overflow-hidden`}>
      <img src={src} alt={alt} onError={() => setError(true)} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
    </div>
  );
}

const KitchenPrinterIcon = () => (
  <img 
    src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=6abae2d5-b978-48eb-bde1-06233100c7ea.png&isTemp=true&tenantCode=misa" 
    alt="Máy in" 
    className="h-12 w-12 object-contain" 
    referrerPolicy="no-referrer"
  />
);

const TabletIcon = () => (
  <img 
    src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=21f951ff-7ecf-4f09-8f9a-7b370b89ab51.png&isTemp=true&tenantCode=misa" 
    alt="Tablet/POS" 
    className="h-12 w-12 object-contain" 
    referrerPolicy="no-referrer"
  />
);

const ClipboardIcon = () => (
  <img 
    src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=887ef113-65d5-493f-9ff4-a5ea7c99a8f1.png&isTemp=true&tenantCode=misa" 
    alt="Chỉ sử dụng giấy" 
    className="h-12 w-12 object-contain" 
    referrerPolicy="no-referrer"
  />
);

export default function OnboardingScreen({
  userProfile,
  onComplete,
  customMenuItems,
  setCustomMenuItems,
  isMenuSetup,
  setIsMenuSetup,
  isPaymentSetup,
  setIsPaymentSetup,
  isPrinterSetup,
  setIsPrinterSetup,
  isInvoiceSetup,
  setIsInvoiceSetup,
  isTableSetup,
  setIsTableSetup,
  isTaxSetup,
  setIsTaxSetup,
  paymentSettings,
  setPaymentSettings,
  connectedPrinters,
  setConnectedPrinters,
  taxSettings,
  setTaxSettings,
  invoiceSettings,
  setInvoiceSettings,
  customZones,
  setCustomZones,
  customTables,
  setCustomTables,
  kitchenStations,
  setKitchenStations,
  businessType,
  setBusinessType,
  orderMethod,
  setOrderMethod,
  kitchenDevice,
  setKitchenDevice
}: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // --- SURVEY ONBOARDING STATES ---
  const [showSurvey, setShowSurvey] = useState<boolean>(true);
  const [surveyStep, setSurveyStep] = useState<number>(1);
  const [selectedSurveyType, setSelectedSurveyType] = useState<string>(businessType || 'Cafe, Trà sữa');
  const [selectedSurveyMethod, setSelectedSurveyMethod] = useState<string>(() => {
    if (orderMethod) {
      if (orderMethod.includes('quầy') || orderMethod.includes('Tự chọn')) {
        return 'Gọi món và thanh toán tại quầy';
      }
    }
    return 'Gọi món và thanh toán tại quầy';
  });
  const [selectedSurveyDevice, setSelectedSurveyDevice] = useState<string>(kitchenDevice || 'Máy in');
  const [surveyBepDevice, setSurveyBepDevice] = useState<string[]>(['Máy in bếp']);
  const [surveyBarDevice, setSurveyBarDevice] = useState<string[]>(['Máy in bar']);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Bán hàng', 'Xuất hoá đơn', 'Kê khai thuế', 'Báo cáo doanh thu']);

  const toggleBepDevice = (id: string) => {
    setSurveyBepDevice(prev => {
      if (id === 'Chỉ sử dụng giấy') {
        return prev.includes(id) ? [] : [id];
      }
      const filtered = prev.filter(x => x !== 'Chỉ sử dụng giấy');
      if (filtered.includes(id)) {
        return filtered.filter(x => x !== id);
      } else {
        return [...filtered, id];
      }
    });
  };

  const toggleBarDevice = (id: string) => {
    setSurveyBarDevice(prev => {
      if (id === 'Chỉ sử dụng giấy') {
        return prev.includes(id) ? [] : [id];
      }
      const filtered = prev.filter(x => x !== 'Chỉ sử dụng giấy');
      if (filtered.includes(id)) {
        return filtered.filter(x => x !== id);
      } else {
        return [...filtered, id];
      }
    });
  };

  React.useEffect(() => {
    if (selectedSurveyType === 'Cafe, Trà sữa' || selectedSurveyType === 'Cafe, trà sữa') {
      setSelectedSurveyMethod('Gọi món và thanh toán tại quầy');
    } else {
      setSelectedSurveyMethod('Phục vụ tại bàn');
    }
  }, [selectedSurveyType]);

  const handleCompleteSurvey = () => {
    // Determine selectedSurveyDevice based on surveyBepDevice & surveyBarDevice
    let finalDevice = 'Máy in';
    const hasBepPaper = surveyBepDevice.includes('Chỉ sử dụng giấy');
    const hasBarPaper = surveyBarDevice.includes('Chỉ sử dụng giấy');
    
    const noBepDevice = hasBepPaper || surveyBepDevice.length === 0;
    const noBarDevice = hasBarPaper || surveyBarDevice.length === 0;

    if (noBepDevice && noBarDevice) {
      finalDevice = 'Không sử dụng thiết bị';
    } else if (surveyBepDevice.includes('Tablet/POS/Smart TV') || surveyBarDevice.includes('Tablet/POS/Smart TV')) {
      finalDevice = 'Máy tính bảng';
    }

    // 1. Save state
    if (setBusinessType) setBusinessType(selectedSurveyType);
    if (setOrderMethod) setOrderMethod(selectedSurveyMethod);
    if (setKitchenDevice) setKitchenDevice(finalDevice);
    setSelectedSurveyDevice(finalDevice);

    // 2. Customizations based on selections:
    // Question 1: business type -> auto load template
    if (selectedSurveyType === 'Cafe, Trà sữa' || selectedSurveyType === 'Cafe, trà sữa' || selectedSurveyType === 'Quán ăn vặt') {
      setCustomMenuItems(libraryTemplates.cafe);
      showToast(`Đã tự động khởi tạo thực đơn ${selectedSurveyType} mẫu phù hợp với mô hình của bạn!`, 'success');
    } else if (selectedSurveyType === 'Quán cơm, bún, phở' || selectedSurveyType === 'Quán ăn') {
      setCustomMenuItems(libraryTemplates.pho);
      showToast('Đã tự động khởi tạo thực đơn mẫu phù hợp với mô hình của bạn!', 'success');
    } else if (selectedSurveyType === 'Quán bia, rượu, nhậu' || selectedSurveyType === 'Bar/Pub/Club' || selectedSurveyType === 'Bar, Pub, Club' || selectedSurveyType === 'Nhà hàng' || selectedSurveyType === 'Buffet') {
      setCustomMenuItems(libraryTemplates.pub);
      showToast(`Đã tự động khởi tạo thực đơn ${selectedSurveyType} mẫu phù hợp với mô hình của bạn!`, 'success');
    } else {
      setCustomMenuItems(libraryTemplates.cafe);
    }

    // Question 2: order method
    // (Removed toast as requested: 'Bỏ mục tôi khoanh đỏ')


    // Question 3: kitchen device
    if (finalDevice === 'Không sử dụng thiết bị') {
      showToast('Cửa hàng không sử dụng thiết bị chế biến bếp/bar. Bỏ qua thiết lập bếp/bar.', 'info');
    }

    setShowSurvey(false);
  };

  // --- HIGH FIDELITY DISH EDIT MODAL STATES ---
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editActiveTab, setEditActiveTab] = useState<'info' | 'amount'>('info');
  const [editType, setEditType] = useState('Món ăn');
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editUnit, setEditUnit] = useState('Suất');
  const [editCategory, setEditCategory] = useState('Món chính');
  const [editTaxDeclaration, setEditTaxDeclaration] = useState('Không chọn');
  const [editTaxRateGTGT, setEditTaxRateGTGT] = useState('Không chọn');
  const [editTaxRateTNCN, setEditTaxRateTNCN] = useState('Không chọn');
  const [editIsTaxReduced, setEditIsTaxReduced] = useState(true);
  const [editImage, setEditImage] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [availableUnits, setAvailableUnits] = useState<string[]>(['Suất', 'Bát', 'Đĩa', 'Cốc', 'Chai', 'Lon', 'Đồng', 'Phần']);
  const [showAddUnitInput, setShowAddUnitInput] = useState(false);
  const [newUnitValue, setNewUnitValue] = useState('');

  const [availableCategories, setAvailableCategories] = useState<string[]>([
    'Cà phê', 'Trà hoa quả', 'Đá xay', 'Đồ uống đóng chai', 'Đồ ăn nhẹ', 'Khác'
  ]);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryValue, setNewCategoryValue] = useState('');

  const foodImages = [
    { url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1ccd2d?auto=format&fit=crop&w=800&q=80', label: 'Phở / Món Nước' },
    { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', label: 'Món Chính / Salad' },
    { url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80', label: 'Hải Sản' },
    { url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80', label: 'Món Nhậu' },
    { url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80', label: 'Bia / Rượu' },
    { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', label: 'Cà phê' },
    { url: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80', label: 'Trà sữa' },
    { url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80', label: 'Bánh ngọt' }
  ];

  const handleStartEditItem = (item: any) => {
    setEditingItem(item);
    setEditActiveTab('info');
    setEditType(item.category === 'Bia & Rượu' || item.category === 'Đồ uống đóng chai' ? 'Đồ uống' : 'Món ăn');
    setEditName(item.name || '');
    setEditPrice(item.price || 0);
    setEditUnit(item.unit || 'Suất');
    setEditCategory(item.category || 'Món chính');
    setEditTaxDeclaration(item.taxDeclaration || 'Không chọn');
    setEditTaxRateGTGT(item.taxRateGTGT || 'Không chọn');
    setEditTaxRateTNCN(item.taxRateTNCN || 'Không chọn');
    setEditIsTaxReduced(item.isTaxReduced !== undefined ? item.isTaxReduced : true);
    setEditImage(item.image || '');
    setShowImagePicker(false);
  };

  const handleSaveEditedItem = () => {
    if (!editName.trim()) {
      showToast('Tên món không được để trống', 'error');
      return;
    }
    const updated = customMenuItems.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          name: editName,
          price: editPrice,
          category: editCategory,
          type: editType,
          unit: editUnit,
          taxDeclaration: editTaxDeclaration,
          taxRateGTGT: editTaxRateGTGT,
          taxRateTNCN: editTaxRateTNCN,
          isTaxReduced: editIsTaxReduced,
          image: editImage
        };
      }
      return item;
    });
    setCustomMenuItems(updated);
    setEditingItem(null);
    showToast(`Đã lưu thay đổi cho món: ${editName}`, 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatCurrency = (amount: number | string) => {
    const numeric = typeof amount === 'string' ? parseInt(amount) || 0 : amount;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numeric);
  };

  // --- STEP 1: MENU DECLARATION STATES ---
  const [menuInputMode, setMenuInputMode] = useState<'ava' | 'manual' | 'library'>('ava');
  const [avaText, setAvaText] = useState(
    "Tôi mở quán phở, có các món:\nPhở bò chín 45k, Phở bò tái gầu 55k, Quẩy giòn 5k.\nĐồ uống: Bia Hà Nội 15k, Coca Cola 15k, Nước suối Lavie 10k."
  );
  const [isAvaProcessing, setIsAvaProcessing] = useState(false);
  const [avaLogs, setAvaLogs] = useState<string[]>([]);
  
  // Manual dish item form
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualCategory, setManualCategory] = useState('Cà phê');

  // Predefined libraries templates
  const libraryTemplates = {
    pho: [
      { id: 101, name: 'Phở chín bò nạm', price: 45000, category: 'Món chính', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1ccd2d?auto=format&fit=crop&w=800&q=80' },
      { id: 102, name: 'Phở bò tái gầu', price: 55000, category: 'Món chính', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1ccd2d?auto=format&fit=crop&w=800&q=80' },
      { id: 103, name: 'Quẩy giòn nóng', price: 5000, category: 'Khác', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80' },
      { id: 104, name: 'Bia hơi Hà Nội', price: 12000, category: 'Bia & Rượu', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80' },
      { id: 105, name: 'Trà đá Hà Nội', price: 5000, category: 'Đồ uống đóng chai', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80' }
    ],
    cafe: [
      { id: 201, name: 'Cà phê Muối Sông Hồng (Mùa Thu)', price: 39000, category: 'Cà phê', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
      { id: 202, name: 'Cà phê Trứng Hà Nội (Mùa Đông)', price: 49000, category: 'Cà phê', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80' },
      { id: 203, name: 'Trà Đào Cam Sả Thảo Mộc (Mùa Hè)', price: 45000, category: 'Trà hoa quả', image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80' },
      { id: 204, name: 'Trà Hoa Cúc Mật Ong Nhãn Nhục (Mùa Xuân)', price: 45000, category: 'Trà hoa quả', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
      { id: 205, name: 'Cà phê cốt dừa đá xay', price: 39000, category: 'Đá xay', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80' },
      { id: 206, name: 'Bánh Tiramisu truyền thống', price: 45000, category: 'Đồ ăn nhẹ', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
      { id: 207, name: 'Bánh Croissant bơ tỏi thơm nóng', price: 35000, category: 'Đồ ăn nhẹ', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' }
    ],
    pub: [
      { id: 301, name: 'Mực nướng sa tế', price: 185000, category: 'Món nhậu', image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80' },
      { id: 302, name: 'Sụn gà rang muối', price: 120000, category: 'Món nhậu', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80' },
      { id: 303, name: 'Bò lúc lắc khoai tây', price: 165000, category: 'Món chính', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
      { id: 304, name: 'Lẩu riêu cua bắp bò', price: 350000, category: 'Món chính', image: 'https://images.unsplash.com/photo-1547928576-a4a3323dce9a?auto=format&fit=crop&w=800&q=80' },
      { id: 305, name: 'Tháp bia tươi Heineken (3L)', price: 250000, category: 'Bia & Rượu', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80' }
    ]
  };

  // Run AI AVA Parser
  const runAvaAiParser = () => {
    if (!avaText.trim()) return;
    setIsAvaProcessing(true);
    setAvaLogs([]);
    
    const logs = [
      'AVA AI: Đang nhận dạng cấu trúc ngôn ngữ tự nhiên...',
      'AVA AI: Định danh thực phẩm và đồ uống trong đoạn mô tả...',
      'AVA AI: Tính toán và làm sạch đơn giá bán phỏng đoán...',
      'AVA AI: Phân bổ nhóm danh mục (Món nhậu, Món chính, Đồ uống...)',
      'AVA AI: Tự động tải hình ảnh minh họa độ phân giải cao...',
      'AVA AI: Thiết lập hoàn tất thực đơn thử nghiệm!'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setAvaLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          // Perform actual regex parsing on client
          const lines = avaText.split('\n');
          const parsedItems: any[] = [];
          let currentCategory = 'Món chính';
          
          lines.forEach((line, lineIdx) => {
            const cleanLine = line.trim();
            if (!cleanLine) return;

            // Check if line specifies group
            if (cleanLine.toLowerCase().includes('đồ uống') || cleanLine.toLowerCase().includes('nước') || cleanLine.toLowerCase().includes('bia')) {
              currentCategory = 'Đồ uống đóng chai';
            } else if (cleanLine.toLowerCase().includes('món ăn') || cleanLine.toLowerCase().includes('khai vị')) {
              currentCategory = 'Món chính';
            } else if (cleanLine.toLowerCase().includes('ăn vặt') || cleanLine.toLowerCase().includes('món nhậu')) {
              currentCategory = 'Món nhậu';
            }

            // Regex: match Name followed by Price (number + optional 'k' or 'đ' or 'VND')
            const regex = /([A-Za-zÀ-ỹ\d\s\(\)\-\+\/]+)\s+(\d+[\d.,]*)\s*(k|K|đ|Đ|vnd|VND|đồng|dong)?/gi;
            let match;
            while ((match = regex.exec(cleanLine)) !== null) {
              const name = match[1].trim().replace(/^[-+*\s]+/, '');
              let rawPrice = match[2].replace(/[.,]/g, '');
              let priceVal = parseInt(rawPrice);
              
              if (priceVal < 1000) {
                // E.g. "45k" or "45" -> 45000
                priceVal = priceVal * 1000;
              }

              // Filter out duplicate or nonsense names
              if (name.length > 2 && priceVal > 0) {
                let img = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                let finalCategory = currentCategory;

                // Intelligently assign photos and categories
                const lowerName = name.toLowerCase();
                if (lowerName.includes('bia')) {
                  img = 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80';
                  finalCategory = 'Bia & Rượu';
                } else if (lowerName.includes('rượu')) {
                  img = 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=079dc07c-0ad3-42f8-b7f0-56df1fb2aa02.jpg&isTemp=false&tenantCode=misa';
                  finalCategory = 'Bia & Rượu';
                } else if (lowerName.includes('coca') || lowerName.includes('pepsi') || lowerName.includes('nước ngọt')) {
                  img = 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=d4787925-7174-4c81-ab02-6810184b36bc.jpg&isTemp=false&tenantCode=misa';
                  finalCategory = 'Đồ uống đóng chai';
                } else if (lowerName.includes('suối') || lowerName.includes('lavie')) {
                  img = 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=61112b3b-859f-4894-b05a-9fd15190b77a.jpg&isTemp=false&tenantCode=misa';
                  finalCategory = 'Đồ uống đóng chai';
                } else if (lowerName.includes('quẩy') || lowerName.includes('bánh')) {
                  img = 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80';
                  finalCategory = 'Khác';
                } else if (lowerName.includes('phở') || lowerName.includes('bún') || lowerName.includes('lẩu')) {
                  img = 'https://images.unsplash.com/photo-1582878826629-29b7ad1ccd2d?auto=format&fit=crop&w=800&q=80';
                  finalCategory = 'Món chính';
                } else if (lowerName.includes('mực') || lowerName.includes('sụn gà') || lowerName.includes('đậu lướt')) {
                  img = 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80';
                  finalCategory = 'Món nhậu';
                }

                parsedItems.push({
                  id: Date.now() + Math.random(),
                  name,
                  price: priceVal,
                  category: finalCategory,
                  image: img,
                  availableAddons: [
                    { category: 'Thêm sở thích', items: [{ name: 'Ướp lạnh', price: 0 }, { name: 'Thêm đá', price: 0 }] }
                  ]
                });
              }
            }
          });

          if (parsedItems.length > 0) {
            setCustomMenuItems([...customMenuItems, ...parsedItems]);
            setIsMenuSetup(true);
            showToast(`AVA AI đã tạo thành công ${parsedItems.length} món ăn!`, 'success');
          } else {
            // fallback generic items if parsing failed
            const fallback = [
              { id: 991, name: 'Phở bò chín đặc biệt', price: 50000, category: 'Món chính', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1ccd2d?auto=format&fit=crop&w=800&q=80' },
              { id: 992, name: 'Quẩy giòn rụm', price: 5000, category: 'Khác', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80' },
              { id: 993, name: 'Coca lon', price: 15000, category: 'Đồ uống đóng chai', image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=d4787925-7174-4c81-ab02-6810184b36bc.jpg&isTemp=false&tenantCode=misa' }
            ];
            setCustomMenuItems([...customMenuItems, ...fallback]);
            setIsMenuSetup(true);
            showToast(`AVA AI tạo thành công thực đơn mẫu phỏng đoán`, 'success');
          }
          setIsAvaProcessing(false);
        }
      }, (index + 1) * 600);
    });
  };

  const [selectedOnboardingItemId, setSelectedOnboardingItemId] = useState<number | null>(null);

  const handleSelectOnboardingItem = (item: any) => {
    setSelectedOnboardingItemId(item.id);
    setEditName(item.name || '');
    setEditPrice(item.price || 0);
    setEditUnit(item.unit || 'Suất');
    setEditCategory(item.category || 'Cà phê');
    setEditType(item.category === 'Bia & Rượu' || item.category === 'Đồ uống đóng chai' ? 'Đồ uống' : 'Món ăn');
    setEditImage(item.image || '');
  };

  const handleAddNewOnboardingItem = () => {
    const newId = Date.now();
    const newItem = {
      id: newId,
      name: 'Món ăn mới ' + (customMenuItems.length + 1),
      price: 35000,
      category: 'Cà phê',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      unit: 'Suất',
      type: 'Món ăn'
    };
    const newList = [...customMenuItems, newItem];
    setCustomMenuItems(newList);
    setSelectedOnboardingItemId(newId);
    setEditName(newItem.name);
    setEditPrice(newItem.price);
    setEditUnit(newItem.unit);
    setEditCategory(newItem.category);
    setEditType(newItem.type);
    setEditImage(newItem.image);
    setIsMenuSetup(true);
    showToast('Đã thêm món mới vào thực đơn!', 'success');
  };

  const updateSelectedItemField = (field: string, value: any) => {
    if (!selectedOnboardingItemId) return;

    if (field === 'name') setEditName(value);
    else if (field === 'price') setEditPrice(value);
    else if (field === 'category') setEditCategory(value);
    else if (field === 'type') setEditType(value);
    else if (field === 'unit') setEditUnit(value);
    else if (field === 'image') setEditImage(value);
  };

  const handleSaveOnboardingItem = () => {
    if (!selectedOnboardingItemId) return;
    if (!editName.trim()) {
      showToast('Tên món không được để trống', 'error');
      return;
    }

    setCustomMenuItems(customMenuItems.map(item => {
      if (item.id === selectedOnboardingItemId) {
        return {
          ...item,
          name: editName,
          price: editPrice,
          category: editCategory,
          type: editType,
          unit: editUnit,
          image: editImage
        };
      }
      return item;
    }));
    showToast(`Đã lưu thay đổi cho món: ${editName}`, 'success');
  };

  const handleDeleteItem = (id: number) => {
    const next = customMenuItems.filter(item => item.id !== id);
    setCustomMenuItems(next);
    if (next.length === 0) {
      setIsMenuSetup(false);
      setSelectedOnboardingItemId(null);
    } else if (selectedOnboardingItemId === id) {
      handleSelectOnboardingItem(next[0]);
    }
  };

  React.useEffect(() => {
    if (currentStep === 2 && customMenuItems.length > 0 && !selectedOnboardingItemId) {
      handleSelectOnboardingItem(customMenuItems[0]);
    }
  }, [currentStep, customMenuItems.length, selectedOnboardingItemId]);

  // --- STEP 2: TABLE SCHEMA CONFIGS & DRAGGING STATES ---
  const [newZoneName, setNewZoneName] = useState('');
  const [newTableName, setNewTableName] = useState('');
  const [activeZone, setActiveZone] = useState('Tầng 1');
  const [editingZoneName, setEditingZoneName] = useState<string | null>(null);
  const [zoneRenameValue, setZoneRenameValue] = useState('');
  
  // Dragging states
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragStartCoords, setDragStartCoords] = useState({ x: 0, y: 0 });

  // Bulk add state
  const [bulkPrefix, setBulkPrefix] = useState('Bàn');
  const [bulkStartNum, setBulkStartNum] = useState(1);
  const [bulkQuantity, setBulkQuantity] = useState(5);
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  // Table edit state
  const [selectedOnboardingTableId, setSelectedOnboardingTableId] = useState<string | null>(null);
  const [showQuickSetup, setShowQuickSetup] = useState(false);

  React.useEffect(() => {
    if (currentStep === 3) {
      const tablesInZone = customTables.filter(t => t.zone === activeZone);
      if (tablesInZone.length > 0) {
        const isSelectedInZone = tablesInZone.some(t => t.id === selectedOnboardingTableId);
        if (!isSelectedInZone) {
          setSelectedOnboardingTableId(tablesInZone[0].id);
        }
      } else {
        setSelectedOnboardingTableId(null);
      }
    }
  }, [currentStep, activeZone, customTables.length]);

  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [tableRenameValue, setTableRenameValue] = useState('');
  const [isTableDetailModalOpen, setIsTableDetailModalOpen] = useState(false);
  const [tableDetailModalData, setTableDetailModalData] = useState<any | null>(null);

  const addCustomZone = () => {
    const trimmed = newZoneName.trim();
    if (!trimmed) return;
    if (customZones.includes(trimmed)) {
      showToast('Tên khu vực đã tồn tại', 'error');
      return;
    }
    setCustomZones([...customZones, trimmed]);
    setActiveZone(trimmed);
    setNewZoneName('');
    showToast(`Đã thêm khu vực: ${trimmed}`, 'success');
  };

  const deleteZone = (zoneToDelete: string) => {
    if (customZones.length <= 1) {
      showToast('Phải có ít nhất một khu vực', 'error');
      return;
    }
    const filteredZones = customZones.filter(z => z !== zoneToDelete);
    setCustomZones(filteredZones);
    // Delete tables in this zone too
    setCustomTables(customTables.filter(t => t.zone !== zoneToDelete));
    if (activeZone === zoneToDelete) {
      setActiveZone(filteredZones[0]);
    }
    showToast(`Đã xóa khu vực: ${zoneToDelete}`, 'success');
  };

  const renameZone = (oldName: string) => {
    const trimmed = zoneRenameValue.trim();
    if (!trimmed) {
      setEditingZoneName(null);
      return;
    }
    if (trimmed === oldName) {
      setEditingZoneName(null);
      return;
    }
    if (customZones.includes(trimmed)) {
      showToast('Khu vực này đã tồn tại', 'error');
      return;
    }
    
    // Update zones list
    setCustomZones(customZones.map(z => z === oldName ? trimmed : z));
    // Update tables zone references
    setCustomTables(customTables.map(t => t.zone === oldName ? { ...t, zone: trimmed } : t));
    
    if (activeZone === oldName) {
      setActiveZone(trimmed);
    }
    setEditingZoneName(null);
    showToast(`Đã đổi tên khu vực thành: ${trimmed}`, 'success');
  };

  const addCustomTable = () => {
    const trimmed = newTableName.trim();
    if (!trimmed) return;
    const exists = customTables.some(t => t.name === trimmed && t.zone === activeZone);
    if (exists) {
      showToast('Tên bàn đã tồn tại ở khu vực này', 'error');
      return;
    }
    const id = Date.now().toString();
    
    // Auto position in grid based on existing tables in activeZone (3-column spacious grid)
    const tablesInZone = customTables.filter(t => t.zone === activeZone);
    const count = tablesInZone.length;
    const row = Math.floor(count / 3);
    const col = count % 3;
    const x = 18 + col * 32;
    const y = 25 + row * 30;

    setCustomTables([...customTables, {
      id,
      name: trimmed,
      zone: activeZone,
      status: 'empty',
      x: Math.min(90, x),
      y: Math.min(90, y)
    }]);
    setNewTableName('');
    setIsTableSetup(true);
    showToast(`Đã thêm bàn: ${trimmed}`, 'success');
  };

  const addBulkTables = () => {
    if (bulkQuantity < 1 || bulkQuantity > 30) {
      showToast('Số lượng bàn tạo hàng loạt từ 1 đến 30', 'error');
      return;
    }
    
    const newTables: any[] = [];
    let addedCount = 0;
    
    const startNum = bulkStartNum;
    
    for (let i = 0; i < bulkQuantity; i++) {
      const num = startNum + i;
      const name = `${bulkPrefix} ${num}`;
      
      const exists = customTables.some(t => t.name === name && t.zone === activeZone) || 
                     newTables.some(t => t.name === name);
                     
      if (exists) {
        continue;
      }
      
      const id = `${Date.now()}-${i}`;
      
      // Auto position (3-column spacious grid)
      const totalCount = customTables.filter(t => t.zone === activeZone).length + addedCount;
      const row = Math.floor(totalCount / 3);
      const col = totalCount % 3;
      const x = 18 + col * 32;
      const y = 25 + row * 30;
      
      newTables.push({
        id,
        name,
        zone: activeZone,
        status: 'empty',
        x: Math.min(90, x),
        y: Math.min(90, y)
      });
      addedCount++;
    }
    
    if (addedCount > 0) {
      setCustomTables([...customTables, ...newTables]);
      setIsTableSetup(true);
      showToast(`Đã thêm nhanh ${addedCount} bàn mới!`, 'success');
    } else {
      showToast(`Không thêm được bàn nào do tên bàn đã tồn tại`, 'error');
    }
    setShowBulkAdd(false);
  };

  const autoAlignTables = () => {
    const tablesInZone = customTables.filter(t => t.zone === activeZone);
    if (tablesInZone.length === 0) return;
    
    // Map existing tables in activeZone to nice grid positions (3-column spacious grid)
    let idx = 0;
    const updated = customTables.map(t => {
      if (t.zone === activeZone) {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const x = 18 + col * 32;
        const y = 25 + row * 30;
        idx++;
        return {
          ...t,
          x: Math.min(90, x),
          y: Math.min(90, y)
        };
      }
      return t;
    });
    
    setCustomTables(updated);
    showToast('Đã tự động sắp xếp sơ đồ bàn phẳng thăng hàng!', 'success');
  };

  const renameTable = (id: string) => {
    const trimmed = tableRenameValue.trim();
    if (!trimmed) {
      setEditingTableId(null);
      return;
    }
    const exists = customTables.some(t => t.id !== id && t.name === trimmed && t.zone === activeZone);
    if (exists) {
      showToast('Tên bàn này đã tồn tại ở khu vực này', 'error');
      return;
    }
    
    setCustomTables(customTables.map(t => t.id === id ? { ...t, name: trimmed } : t));
    setEditingTableId(null);
    showToast(`Đã đổi tên bàn thành: ${trimmed}`, 'success');
  };

  const deleteTable = (id: string) => {
    setCustomTables(customTables.filter(t => t.id !== id));
  };

  const updateSelectedTableField = (field: string, value: any) => {
    if (!selectedOnboardingTableId) return;
    setCustomTables(customTables.map(t => {
      if (t.id === selectedOnboardingTableId) {
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  const handleOnboardingDeleteTable = (id: string) => {
    const filtered = customTables.filter(t => t.id !== id);
    setCustomTables(filtered);
    if (selectedOnboardingTableId === id) {
      const nextInZone = filtered.filter(t => t.zone === activeZone);
      if (nextInZone.length > 0) {
        setSelectedOnboardingTableId(nextInZone[0].id);
      } else {
        setSelectedOnboardingTableId(null);
      }
    }
    showToast('Đã xóa bàn thành công', 'success');
  };

  const renderSeats = (seatsCount: number, shape: string) => {
    const chairs = [];
    const total = seatsCount || 4;
    
    if (shape === 'round') {
      // For circular tables, render line seats pointing outwards
      for (let i = 0; i < total; i++) {
        const angle = (i * 360) / total;
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        
        // Seat center is outside the circular border (distance ~56% from center)
        const dist = 56;
        const left = 50 + cos * dist;
        const top = 50 + sin * dist;
        
        // Align capsule style perpendicular to radius
        chairs.push(
          <div 
            key={i} 
            className="absolute bg-[#94a3b8] rounded-full"
            style={{ 
              left: `${left}%`, 
              top: `${top}%`, 
              width: Math.abs(cos) > Math.abs(sin) ? '2.5px' : '12px',
              height: Math.abs(cos) > Math.abs(sin) ? '12px' : '2.5px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      }
    } else if (shape === 'rectangular') {
      // Rectangular table: usually wider, so seats are placed on sides
      if (total === 2) {
        chairs.push(
          <div key="l" className="absolute -left-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />,
          <div key="r" className="absolute -right-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />
        );
      } else if (total === 4) {
        chairs.push(
          <div key="t1" className="absolute -top-[8px] left-1/3 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="t2" className="absolute -top-[8px] left-2/3 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b1" className="absolute -bottom-[8px] left-1/3 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b2" className="absolute -bottom-[8px] left-2/3 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />
        );
      } else if (total === 6) {
        chairs.push(
          <div key="t1" className="absolute -top-[8px] left-1/4 -translate-x-1/2 w-3 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="t2" className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-3 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="t3" className="absolute -top-[8px] left-3/4 -translate-x-1/2 w-3 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b1" className="absolute -bottom-[8px] left-1/4 -translate-x-1/2 w-3 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b2" className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-3 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b3" className="absolute -bottom-[8px] left-3/4 -translate-x-1/2 w-3 h-[2.5px] bg-[#94a3b8] rounded-full" />
        );
      } else {
        // Fallback: draw 4 sides
        chairs.push(
          <div key="t" className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b" className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="l" className="absolute -left-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />,
          <div key="r" className="absolute -right-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />
        );
      }
    } else {
      // Square or default tables (fits the template image exactly!)
      if (total === 2) {
        chairs.push(
          <div key="t" className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b" className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />
        );
      } else if (total === 4) {
        chairs.push(
          <div key="t" className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b" className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="l" className="absolute -left-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />,
          <div key="r" className="absolute -right-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />
        );
      } else if (total === 6) {
        chairs.push(
          <div key="t1" className="absolute -top-[8px] left-1/3 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="t2" className="absolute -top-[8px] left-2/3 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b1" className="absolute -bottom-[8px] left-1/3 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b2" className="absolute -bottom-[8px] left-2/3 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="l" className="absolute -left-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />,
          <div key="r" className="absolute -right-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />
        );
      } else {
        // Fallback: draw 4 sides
        chairs.push(
          <div key="t" className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="b" className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-3.5 h-[2.5px] bg-[#94a3b8] rounded-full" />,
          <div key="l" className="absolute -left-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />,
          <div key="r" className="absolute -right-[8px] top-1/2 -translate-y-1/2 w-[2.5px] h-3.5 bg-[#94a3b8] rounded-full" />
        );
      }
    }
    
    return chairs;
  };

  const handleTableDragStart = (e: React.MouseEvent | React.TouchEvent, id: string, currentX: number, currentY: number) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDraggingTableId(id);
    setDragStartPos({ x: clientX, y: clientY });
    setDragStartCoords({ x: currentX, y: currentY });
  };

  const handleCanvasDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingTableId) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStartPos.x;
    const deltaY = clientY - dragStartPos.y;
    
    const container = document.getElementById('table-canvas-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    // Convert to percentage
    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;
    
    // Target coordinate (rounded to closest 2% for alignment snapping)
    let nextX = Math.round((dragStartCoords.x + deltaXPercent) / 2) * 2;
    let nextY = Math.round((dragStartCoords.y + deltaYPercent) / 2) * 2;
    
    // Bounds clamping: 5% to 92%
    nextX = Math.max(5, Math.min(92, nextX));
    nextY = Math.max(5, Math.min(92, nextY));
    
    setCustomTables(customTables.map(t => t.id === draggingTableId ? { ...t, x: nextX, y: nextY } : t));
  };

  const handleDragEnd = () => {
    if (draggingTableId) {
      setDraggingTableId(null);
      showToast('Đã cập nhật vị trí bàn!', 'success');
    }
  };

  const toggleCategoryInKitchen = (stationId: string, category: string) => {
    const updated = kitchenStations.map(st => {
      if (st.id === stationId) {
        const hasCat = st.categories.includes(category);
        return {
          ...st,
          categories: hasCat 
            ? st.categories.filter((c: string) => c !== category) 
            : [...st.categories, category]
        };
      }
      return st;
    });
    setKitchenStations(updated);
  };

  // --- STEP 3: PAYMENT INTEGRATIONS ---
  const [activePaymentType, setActivePaymentType] = useState<'static_qr' | 'jetpay' | 'pos'>('static_qr');
  const [enabledPayments, setEnabledPayments] = useState<{ [key: string]: boolean }>({
    cash: true,
    transfer: false,
    wallet: false,
  });
  const [connectedPayments, setConnectedPayments] = useState<{ [key: string]: boolean }>({
    'techcombank': false,
    'mbbank': false,
    'bidv': false,
    'vietinbank': false,
    'acb': false,
    'msb': false,
    'vietcombank': false,
    'vpbank': false,
    'tpbank': false,
    'momo': false,
    'vnpay': false,
    'zalopay': false,
    'sacombank': false,
    'lpbank': false,
    'shb': false,
    'pvcombank': false,
  });
  const [isAddingStatic, setIsAddingStatic] = useState(false);
  const [isAddingJetpay, setIsAddingJetpay] = useState(false);
  
  // Option 1: Static QR Multiple Banks State
  const [staticBanks, setStaticBanks] = useState<any[]>([
    { id: '1', bank: 'vietcombank', account: '190345678910', holder: 'TRAN PHAM QUOC KHANH' }
  ]);
  const [newStaticBank, setNewStaticBank] = useState('');
  const [newStaticAccount, setNewStaticAccount] = useState('');
  const [newStaticHolder, setNewStaticHolder] = useState('');

  // Option 2: Jetpay / Bankhub State
  const [jetpayBanks, setJetpayBanks] = useState<any[]>([
    { id: '1', bank: 'techcombank', account: '190399887766', holder: 'CONG TY CUKCUK VIET NAM' }
  ]);
  const [newJetpayBank, setNewJetpayBank] = useState('');
  const [newJetpayAccount, setNewJetpayAccount] = useState('');
  const [newJetpayHolder, setNewJetpayHolder] = useState('');

  // Option 3: POS Connectivity State
  const [posBrand, setPosBrand] = useState('smartpos');
  const [posConnType, setPosConnType] = useState('ip');
  const [posIpAddress, setPosIpAddress] = useState('192.168.1.150');
  const [posStatus, setPosStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Preview state for the QR rendering pane (on the right)
  const [selectedPreviewBank, setSelectedPreviewBank] = useState<any>({
    bank: 'vietcombank',
    account: '190345678910',
    holder: 'TRAN PHAM QUOC KHANH',
    type: 'static_qr'
  });

  // Tablet optimized popup state for Payment Details & POS Connectivity
  const [isPaymentDetailModalOpen, setIsPaymentDetailModalOpen] = useState(false);
  const [paymentDetailModalData, setPaymentDetailModalData] = useState<any | null>(null);
  const [isPosConfigModalOpen, setIsPosConfigModalOpen] = useState(false);
  const [posSimulationAmount, setPosSimulationAmount] = useState('420000');
  const [posSimulating, setPosSimulating] = useState(false);
  const [posSimulatedStep, setPosSimulatedStep] = useState<'idle' | 'waiting' | 'tapping' | 'authorizing' | 'success'>('idle');

  const handleAddStaticBank = () => {
    if (!newStaticBank) {
      showToast('Vui lòng chọn một ngân hàng trước!', 'error');
      return;
    }
    if (!newStaticAccount.trim() || !newStaticHolder.trim()) {
      showToast('Vui lòng nhập đầy đủ Số tài khoản và Tên chủ tài khoản!', 'error');
      return;
    }
    const newId = Date.now().toString();
    const newRecord = {
      id: newId,
      bank: newStaticBank,
      account: newStaticAccount.trim(),
      holder: newStaticHolder.trim().toUpperCase()
    };
    setStaticBanks([...staticBanks, newRecord]);
    setSelectedPreviewBank({ ...newRecord, type: 'static_qr' });
    setNewStaticAccount('');
    setNewStaticHolder('');
    setNewStaticBank('');
    setIsAddingStatic(false);
    showToast('Đã thêm tài khoản ngân hàng QR tĩnh mới!', 'success');
  };

  const handleDeleteStaticBank = (id: string) => {
    setStaticBanks(staticBanks.filter(b => b.id !== id));
    showToast('Đã xóa tài khoản ngân hàng QR tĩnh!', 'success');
  };

  const handleAddJetpayBank = () => {
    if (!newJetpayBank) {
      showToast('Vui lòng chọn một ngân hàng trước!', 'error');
      return;
    }
    if (!newJetpayAccount.trim() || !newJetpayHolder.trim()) {
      showToast('Vui lòng nhập đầy đủ Số tài khoản và Tên chủ tài khoản!', 'error');
      return;
    }
    const newId = Date.now().toString();
    const newRecord = {
      id: newId,
      bank: newJetpayBank,
      account: newJetpayAccount.trim(),
      holder: newJetpayHolder.trim().toUpperCase()
    };
    setJetpayBanks([...jetpayBanks, newRecord]);
    setSelectedPreviewBank({ ...newRecord, type: 'jetpay' });
    setNewJetpayAccount('');
    setNewJetpayHolder('');
    setNewJetpayBank('');
    setIsAddingJetpay(false);
    showToast('Đã kết nối tài khoản ngân hàng Jetpay/Bankhub mới!', 'success');
  };

  const handleDeleteJetpayBank = (id: string) => {
    setJetpayBanks(jetpayBanks.filter(b => b.id !== id));
    showToast('Đã ngắt kết nối tài khoản ngân hàng Jetpay!', 'success');
  };

  const handleConnectPOS = () => {
    setPosStatus('connecting');
    showToast('Đang quét thiết bị POS trong mạng nội bộ...', 'info');
    setTimeout(() => {
      setPosStatus('connected');
      showToast('Kết nối thiết bị quẹt thẻ POS thành công!', 'success');
    }, 1500);
  };

  const savePaymentSettings = () => {
    if (activePaymentType === 'static_qr' && staticBanks.length === 0) {
      showToast('Vui lòng cấu hình ít nhất một tài khoản nhận QR tĩnh', 'error');
      return;
    }
    if (activePaymentType === 'jetpay' && jetpayBanks.length === 0) {
      showToast('Vui lòng cấu hình ít nhất một tài khoản Jetpay/Bankhub', 'error');
      return;
    }
    if (activePaymentType === 'pos' && posStatus !== 'connected') {
      showToast('Vui lòng kết nối thiết bị POS trước khi lưu cấu hình', 'error');
      return;
    }

    const firstStatic = staticBanks[0] || { bank: 'vietcombank', account: '', holder: '' };
    const firstJetpay = jetpayBanks[0] || { bank: 'techcombank', account: '', holder: '' };

    setPaymentSettings({
      activePaymentType,
      staticBanks,
      jetpayBanks,
      posConfig: {
        brand: posBrand,
        connType: posConnType,
        ipAddress: posIpAddress,
        status: posStatus
      },
      // Keep legacy support intact:
      qrBank: activePaymentType === 'static_qr' ? firstStatic.bank : firstJetpay.bank,
      qrAccount: activePaymentType === 'static_qr' ? firstStatic.account : firstJetpay.account,
      qrName: activePaymentType === 'static_qr' ? firstStatic.holder.toUpperCase() : firstJetpay.holder.toUpperCase(),
      enableJetpay: activePaymentType === 'jetpay',
      enablePOS: activePaymentType === 'pos'
    });

    setIsPaymentSetup(true);
    showToast('Đã kích hoạt phương thức thanh toán thành công!', 'success');
  };

  // --- STEP 4: PRINTING SETUP ---
  const [posDeviceName, setPosDeviceName] = useState('LanAnh_Black2k');
  const [posDeviceIp, setPosDeviceIp] = useState('190.168.1.2');
  const [allowSpecialCharacters, setAllowSpecialCharacters] = useState(false);

  interface PrinterSetupItem {
    id: string;
    name: string;
    role: 'cashier' | 'kitchen' | 'bar';
    selectedPrinter: string;
    desc: string;
    isSearching?: boolean;
  }

  const [printerSetups, setPrinterSetups] = useState<PrinterSetupItem[]>([
    { id: '1', name: 'Máy in Thu ngân', role: 'cashier', selectedPrinter: 'HP LaserJet 400 M401', desc: 'In hóa đơn thanh toán cho khách hàng' },
    { id: '2', name: 'Máy in Nhà bếp', role: 'kitchen', selectedPrinter: 'HP LaserJet 400 M401 Bep', desc: 'In phiếu chế biến các món ăn gửi nhà bếp' },
    { id: '3', name: 'Máy in Quầy Bar', role: 'bar', selectedPrinter: 'Không chọn', desc: 'In phiếu chế biến đồ uống gửi quầy bar' }
  ]);

  const [isAddPrinterModalOpen, setIsAddPrinterModalOpen] = useState(false);
  const [newPrinterName, setNewPrinterName] = useState('');
  const [newPrinterRole, setNewPrinterRole] = useState<'cashier' | 'kitchen' | 'bar'>('kitchen');
  const [newPrinterSelected, setNewPrinterSelected] = useState('HP LaserJet 400 M401');

  const updatePrinterSelection = (id: string, value: string) => {
    setPrinterSetups(prev => prev.map(p => p.id === id ? { ...p, selectedPrinter: value } : p));
  };

  const handleSearchPrinter = (id: string) => {
    setPrinterSetups(prev => prev.map(p => p.id === id ? { ...p, isSearching: true } : p));
    const target = printerSetups.find(p => p.id === id);
    showToast(`Đang dò tìm máy in cho ${target?.name || 'thiết bị'}...`, 'info');
    setTimeout(() => {
      setPrinterSetups(prev => prev.map(p => p.id === id ? { ...p, isSearching: false } : p));
      showToast(`Đã tìm thấy máy in hoạt động cho ${target?.name}!`, 'success');
    }, 1200);
  };

  const handlePrintTest = (printerLabel: string) => {
    showToast(`Đang in thử phiếu test trên ${printerLabel}...`, 'success');
  };

  const handleCustomizePrinter = (printerLabel: string) => {
    showToast(`Mở cấu hình tùy chỉnh mẫu in cho ${printerLabel}`, 'success');
  };

  const removePrinterSetup = (id: string) => {
    setPrinterSetups(prev => prev.filter(p => p.id !== id));
    showToast('Đã xóa thiết lập máy in khu vực!', 'success');
  };

  const handleAddPrinterSetup = () => {
    if (!newPrinterName.trim()) {
      showToast('Vui lòng nhập tên thiết lập máy in/khu vực!', 'error');
      return;
    }
    const newId = Date.now().toString();
    const newPrinter: PrinterSetupItem = {
      id: newId,
      name: newPrinterName.trim(),
      role: newPrinterRole,
      selectedPrinter: newPrinterSelected,
      desc: newPrinterRole === 'cashier' 
        ? 'In hóa đơn thanh toán cho khách hàng' 
        : newPrinterRole === 'kitchen' 
          ? 'In phiếu chế biến các món ăn gửi nhà bếp' 
          : 'In phiếu chế biến đồ uống gửi quầy bar'
    };
    setPrinterSetups([...printerSetups, newPrinter]);
    setNewPrinterName('');
    setIsAddPrinterModalOpen(false);
    showToast(`Đã thêm thiết lập máy in: ${newPrinter.name}`, 'success');
  };

  const handleSavePrinterSetup = () => {
    const prs = printerSetups
      .filter(p => p.selectedPrinter !== 'Không chọn')
      .map(p => ({
        name: p.selectedPrinter,
        role: p.role,
        zone: 'Tầng 1',
        displayName: p.name
      }));
    setConnectedPrinters(prs);
    setIsPrinterSetup(true);
    showToast('Đã lưu cấu hình thiết bị in ấn thành công!', 'success');
  };

  // --- STEP 5: TAXES SETTINGS ---
  const [gtgtTaxMethod, setGtgtTaxMethod] = useState<'direct' | 'deduction'>('deduction');
  const [businessModel, setBusinessModel] = useState<'enterprise' | 'individual'>('enterprise');
  const [onlyOnRequest, setOnlyOnRequest] = useState(false);
  const [deductionType, setDeductionType] = useState<'single' | 'multiple'>('multiple');
  const [deductionSingleRate, setDeductionSingleRate] = useState('8%');
  const [menuPriceIncludesVat, setMenuPriceIncludesVat] = useState(false);
  const [applyVatReduction406, setApplyVatReduction406] = useState(false);
  const [allowCashierChangeTax, setAllowCashierChangeTax] = useState(false);
  const [taxForTakeaway, setTaxForTakeaway] = useState(true);
  const [taxForDelivery, setTaxForDelivery] = useState(true);
  const [taxForDeliveryFee, setTaxForDeliveryFee] = useState(true);

  const [tncnMethod, setTncnMethod] = useState<'percent_revenue' | 'taxable_income'>('taxable_income');
  const [tncnRate, setTncnRate] = useState('15%');
  const [specialConsumptionTax, setSpecialConsumptionTax] = useState<'no' | 'yes'>('yes');

  const [restaurantServiceCharge, setRestaurantServiceCharge] = useState<'none' | 'yes' | 'only_incurred'>('none');
  const [serviceChargeType, setServiceChargeType] = useState<'percent' | 'amount'>('percent');
  const [serviceChargePercent, setServiceChargePercent] = useState('8,00');
  const [serviceChargeAmount, setServiceChargeAmount] = useState('0');

  const [serviceChargeOnBeforeDiscount, setServiceChargeOnBeforeDiscount] = useState(true);
  const [applySpecialServiceChargeOnDish, setApplySpecialServiceChargeOnDish] = useState(true);
  const [addOtherServiceCharge, setAddOtherServiceCharge] = useState(true);

  const saveTaxSettings = () => {
    setTaxSettings({
      rate: gtgtTaxMethod === 'direct' ? 10 : parseFloat(deductionSingleRate.replace(',', '.')) || 0,
      isIncluded: gtgtTaxMethod === 'deduction' ? menuPriceIncludesVat : true,
    });
    setIsTaxSetup(true);
    showToast('Đã lưu cấu hình thuế và phí dịch vụ thành công!', 'success');
  };

  // --- STEP 6: E-INVOICE SETTINGS ---
  const [invoiceSubStep, setInvoiceSubStep] = useState<number>(1); // 1, 2, 3
  const [invoiceOtpStep, setInvoiceOtpStep] = useState<boolean>(false);
  const [esignLoginOpen, setEsignLoginOpen] = useState<boolean>(false);
  const [esignCertOpen, setEsignCertOpen] = useState<boolean>(false);
  const [showConnectForm, setShowConnectForm] = useState<boolean>(false);

  const [meInvoiceUser, setMeInvoiceUser] = useState('admin_huongviviet');
  const [meInvoicePass, setMeInvoicePass] = useState('MisaSupport2026!');
  const [taxCode, setTaxCode] = useState('123445678653244');
  const [eSignCloud, setESignCloud] = useState(true);
  const [invoiceOtp, setInvoiceOtp] = useState('17600');
  const [dontAskOtpAgain, setDontAskOtpAgain] = useState(false);
  const [otpSeconds, setOtpSeconds] = useState(29);

  React.useEffect(() => {
    let interval: any;
    if (invoiceOtpStep && otpSeconds > 0) {
      interval = setInterval(() => {
        setOtpSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [invoiceOtpStep, otpSeconds]);

  React.useEffect(() => {
    if (invoiceOtpStep) {
      setOtpSeconds(29);
    }
  }, [invoiceOtpStep]);

  const [selectedSignType, setSelectedSignType] = useState<'esign' | 'usb'>('esign');
  const [esignConnected, setEsignConnected] = useState(false);
  const [esignUser, setEsignUser] = useState('bahung4086@gmail.com');
  const [esignPass, setEsignPass] = useState('bahung_esign_pass');
  const [selectedCert, setSelectedCert] = useState<any>({
    name: 'TRẦN BÁ HÙNG',
    taxCode: '040202019461',
    issuer: 'MISA JOINT STOCK COMPANY',
    serial: '54010C2D9BA9320DD81729013890',
    expiry: '02/04/2026 - 03/12/2026'
  });
  const [isCertSelected, setIsCertSelected] = useState(false);

  // Checkboxes for Step 3
  const [showComboDetail, setShowComboDetail] = useState(false);
  const [autoSendInvoice, setAutoSendInvoice] = useState(true);
  const [paymentFixedTmCk, setPaymentFixedTmCk] = useState(false);
  const [extraInvoiceInfo, setExtraInvoiceInfo] = useState(false);
  const [showStpvWithFee, setShowStpvWithFee] = useState(false);
  const [showTipChange, setShowTipChange] = useState(false);
  const [showBilingual, setShowBilingual] = useState(false);
  const [allowGuestFill, setAllowGuestFill] = useState(false);
  const [qrExpiryHours, setQrExpiryHours] = useState('3');
  const [allowEditDeleteInvoice, setAllowEditDeleteInvoice] = useState(false);
  const [issueFromPos, setIssueFromPos] = useState(true);

  // Sub-options
  const [defaultSelectTakeInvoice, setDefaultSelectTakeInvoice] = useState(true);
  const [defaultSignOnIssue, setDefaultSignOnIssue] = useState(false);
  const [autoIssueOnPay, setAutoIssueOnPay] = useState(true);
  const [alwaysSendEmail, setAlwaysSendEmail] = useState(false);
  const [defaultInvoiceTemplate, setDefaultInvoiceTemplate] = useState('1C26MHL');

  // Customer defaults
  const [defCustomerName, setDefCustomerName] = useState('Khách không yêu cầu lấy hóa đơn');
  const [defCompanyName, setDefCompanyName] = useState('Khách lẻ');
  const [defCompanyAddress, setDefCompanyAddress] = useState('Khách lẻ');

  const saveInvoiceSettings = () => {
    if (!meInvoiceUser || !taxCode) {
      showToast('Vui lòng điền MST và tài khoản meInvoice', 'error');
      return;
    }
    setInvoiceSettings({
      username: meInvoiceUser,
      taxCode,
      isConnected: true,
      esignConnected: esignConnected,
      selectedSignType,
      otherSettings: {
        autoSendInvoice,
        issueFromPos,
        defaultSelectTakeInvoice,
        defaultSignOnIssue,
        autoIssueOnPay,
        alwaysSendEmail,
        defaultInvoiceTemplate,
        defCustomerName,
        defCompanyName,
        defCompanyAddress
      }
    });
    setIsInvoiceSetup(true);
    showToast('Kết nối meInvoice & eSign thành công!', 'success');
  };

  // Skip onboarding
  const handleSkipOnboarding = () => {
    setIsMenuSetup(true);
    setIsTableSetup(true);
    setIsPaymentSetup(true);
    setIsPrinterSetup(true);
    setIsTaxSetup(true);
    setIsInvoiceSetup(true);
    onComplete();
  };

  // Steps definitions
  const steps = [
    { num: 1, title: 'Thuế suất', desc: 'Phương pháp tính thuế' },
    { num: 2, title: 'Thực đơn', desc: 'AVA AI / Thủ công' },
    { num: 3, title: 'Sơ đồ bàn', desc: 'Thiết lập sơ đồ bàn' },
    { num: 4, title: 'Thanh toán', desc: 'VietQR, Thẻ ngân hàng' },
    { num: 5, title: 'Thiết lập in', desc: 'Kết nối máy in bill' },
    { num: 6, title: 'Hóa đơn', desc: 'Hóa đơn điện tử' }
  ];

  // Calculate completeness percentage
  const stepsState = [isTaxSetup, isMenuSetup, isTableSetup, isPaymentSetup, isPrinterSetup, isInvoiceSetup];
  const completedCount = stepsState.filter(Boolean).length;
  const percentage = Math.round((completedCount / 6) * 100);

  if (showSurvey) {
    const surveyMethodOptions = [
      {
        id: 'Phục vụ tại bàn',
        label: 'Phục vụ tại bàn',
        desc: 'Nhân viên đến bàn ghi nhận order, nhà bếp chế biến phục vụ, khách ăn xong mới thanh toán.',
        image: '/src/assets/images/table_service_1783357497671.jpg'
      },
      {
        id: 'Gọi món và thanh toán tại quầy',
        label: 'Gọi món và thanh toán tại quầy',
        desc: 'Khách hàng tự chọn món, thanh toán ngay tại quầy thu ngân và nhận chuông báo/chờ lấy đồ.',
        image: '/src/assets/images/counter_service_1783357512367.jpg'
      }
    ];

    const displayedMethodOptions = surveyMethodOptions;

    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-[#F0F9FF] via-[#E0F2FE] to-[#F0F9FF] relative overflow-hidden font-sans select-none p-3 sm:p-4">
        {/* Soft, premium ambient light blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[65%] h-[65%] rounded-full bg-[#076EFF]/12 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[75%] h-[75%] rounded-full bg-[#38BDF8]/15 blur-[160px] pointer-events-none" />
        <div className="absolute top-[25%] right-[15%] w-[45%] h-[45%] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none" />
        
        {/* Subtle elegant wave decorations */}
        <svg className="absolute bottom-0 left-0 w-full opacity-[0.12] text-[#076EFF] pointer-events-none" viewBox="0 0 1440 320" fill="currentColor">
          <path d="M0,160L80,176C160,192,320,224,480,218.7C640,213,800,171,960,160C1120,149,1280,171,1360,181.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
        </svg>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-[24px] border border-slate-100 max-w-[720px] w-full p-5 sm:p-5.5 flex flex-col justify-between sm:min-h-[515px] h-auto md:h-[515px] max-h-[95vh] relative z-10"
        >
          {/* Progress Step Header & Welcome Message */}
          <div className="flex flex-col items-center shrink-0 mb-3">
            <div className="text-center mb-2.5">
              <p className="text-[12.5px] font-medium text-[#076EFF] bg-blue-50/80 px-3.5 py-1.5 rounded-full inline-block leading-relaxed border border-blue-100/50 shadow-xs">
                Chào mừng bạn đến với MISA CukCuk! Trả lời vài câu hỏi để giúp chúng tôi phục vụ bạn tốt hơn.
              </p>
            </div>
            
            <div className="flex justify-center gap-2 w-full max-w-[160px]">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    stepNum === surveyStep 
                      ? 'bg-[#076EFF]' 
                      : stepNum < surveyStep 
                        ? 'bg-[#076EFF]/40' 
                        : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Centered Title */}
          <div className="text-center mb-4 shrink-0">
            <h2 className="text-[18px] font-black text-slate-900 leading-tight">
              {surveyStep === 1 && "Loại hình nhà hàng bạn đang kinh doanh là gì?"}
              {surveyStep === 2 && "Quy trình phục vụ chính của nhà hàng bạn là gì?"}
              {surveyStep === 3 && "Bếp/Bar của bạn đang sử dụng thiết bị nào để nhận order?"}
              {surveyStep === 4 && "Nhu cầu của bạn khi sử dụng phần mềm?"}
            </h2>
          </div>

          {/* Survey Content */}
          <div className="flex-1 flex flex-col justify-center py-2 overflow-y-auto custom-scrollbar">
            {surveyStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-in my-auto w-full">
                {[
                  { id: 'Nhà hàng', label: 'Nhà hàng', desc: 'Phục vụ món ăn, ẩm thực truyền thống, lẩu nướng, hải sản', icon: UtensilsCrossed },
                  { id: 'Quán ăn', label: 'Quán ăn', desc: 'Cơm bình dân, phở bò, bún chả, cơm văn phòng nhanh', icon: Soup },
                  { id: 'Cafe, Trà sữa', label: 'Cafe, Trà sữa', desc: 'Cà phê, trà trái cây, sinh tố, trà sữa, bánh ngọt', icon: Coffee },
                  { id: 'Buffet', label: 'Buffet', desc: 'Mô hình tự chọn, buffet nướng, lẩu, hải sản', icon: Flame },
                  { id: 'Bar/Pub/Club', label: 'Bar/Pub/Club', desc: 'Đồ uống pha chế có cồn, cocktail, nhạc DJ, vui chơi muộn', icon: Wine },
                  { id: 'Karaoke, Billiard', label: 'Karaoke, Billiard', desc: 'Phòng hát giải trí, câu lạc bộ bida kết hợp ăn uống', icon: Mic },
                  { id: 'Khác (Tiệm bánh, Căng tin, Tiệc cưới,...)', label: 'Khác (Tiệm bánh, Căng tin, Tiệc cưới,...)', desc: 'Các dịch vụ tiệm bánh, tin học, căng tin học đường, sự kiện', icon: Pizza },
                ].map((t) => {
                  const IconComponent = t.icon;
                  const isSelected = selectedSurveyType === t.id;
                  const isLastItem = t.id === 'Khác (Tiệm bánh, Căng tin, Tiệc cưới,...)';
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedSurveyType(t.id)}
                      className={`py-2 px-3 h-[60px] rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 relative ${
                        isSelected
                          ? 'border-[#076EFF] bg-[#F4F8FF] shadow-[0_4px_12px_rgba(7,110,255,0.06)]'
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                      } ${isLastItem ? 'sm:col-span-2' : ''}`}
                    >
                      <div className={`w-9.5 h-9.5 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-[#076EFF]/10 text-[#076EFF]' 
                          : 'bg-blue-50 text-[#076EFF]'
                      }`}>
                        <IconComponent className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5 pr-8 flex-1 text-left min-w-0">
                        <div className="text-[13.5px] font-bold text-slate-800 leading-snug truncate" title={t.label}>{t.label}</div>
                        <div className="text-[11px] text-slate-500 leading-normal font-normal line-clamp-1">{t.desc}</div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-3 text-[#076EFF]">
                          <CheckCircle2 className="w-5 h-5 fill-[#076EFF] text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {surveyStep === 2 && (
              <div className="grid grid-cols-2 gap-4.5 animate-fade-in w-full mx-auto my-auto">
                {displayedMethodOptions.map((m) => {
                  const isSelected = selectedSurveyMethod === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedSurveyMethod(m.id)}
                      className={`p-2.5 sm:p-3 rounded-[20px] border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-[#076EFF] bg-[#F4F8FF] shadow-[0_4px_12px_rgba(7,110,255,0.06)]'
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                      }`}
                    >
                      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50 relative">
                        <img src={m.image} alt={m.label} className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-2.5 text-center flex-1 flex items-center justify-center">
                        <span className={`text-[13px] font-bold leading-snug tracking-tight ${
                          isSelected ? 'text-[#076EFF]' : 'text-slate-800'
                        }`}>
                          {m.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-5.5 right-5.5 text-[#076EFF] z-10">
                          <CheckCircle2 className="w-5 h-5 fill-[#076EFF] text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {surveyStep === 3 && (
              <div className="space-y-4 w-full mx-auto animate-fade-in my-auto">
                {/* Kitchen Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-1.5 h-3.5 bg-[#076EFF] rounded-full" />
                    <span className="text-[12.5px] font-bold text-slate-800">Bộ phận bếp (có thể chọn nhiều):</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'Máy in bếp', label: 'Máy in bếp', icon: KitchenPrinterIcon },
                      { id: 'Tablet/POS/Smart TV', label: 'Tablet/POS/Smart TV', icon: TabletIcon },
                      { id: 'Chỉ sử dụng giấy', label: 'Chỉ sử dụng giấy', icon: ClipboardIcon },
                    ].map((opt) => {
                      const IconComponent = opt.icon;
                      const isSelected = surveyBepDevice.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleBepDevice(opt.id)}
                          className={`p-2 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 relative min-h-[85px] ${
                            isSelected
                              ? 'border-[#076EFF] bg-[#F4F8FF] shadow-[0_4px_12px_rgba(7,110,255,0.06)]'
                              : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-center h-10 w-full scale-90">
                            <IconComponent />
                          </div>
                          <span className="text-[11.5px] font-bold text-slate-800 leading-tight text-center">{opt.label}</span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 text-[#076EFF]">
                              <CheckCircle2 className="w-4 h-4 fill-[#076EFF] text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bar Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-1.5 h-3.5 bg-[#076EFF] rounded-full" />
                    <span className="text-[12.5px] font-bold text-slate-800">Bộ phận bar (có thể chọn nhiều):</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'Máy in bar', label: 'Máy in bar', icon: KitchenPrinterIcon },
                      { id: 'Tablet/POS/Smart TV', label: 'Tablet/POS/Smart TV', icon: TabletIcon },
                      { id: 'Chỉ sử dụng giấy', label: 'Chỉ sử dụng giấy', icon: ClipboardIcon },
                    ].map((opt) => {
                      const IconComponent = opt.icon;
                      const isSelected = surveyBarDevice.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleBarDevice(opt.id)}
                          className={`p-2 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 relative min-h-[85px] ${
                            isSelected
                              ? 'border-[#076EFF] bg-[#F4F8FF] shadow-[0_4px_12px_rgba(7,110,255,0.06)]'
                              : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-center h-10 w-full scale-90">
                            <IconComponent />
                          </div>
                          <span className="text-[11.5px] font-bold text-slate-800 leading-tight text-center">{opt.label}</span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 text-[#076EFF]">
                              <CheckCircle2 className="w-4 h-4 fill-[#076EFF] text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {surveyStep === 4 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mx-auto animate-fade-in my-auto">
                {[
                  { id: 'Bán hàng', label: 'Bán hàng', icon: ShoppingCart },
                  { id: 'Xuất hoá đơn', label: 'Xuất hoá đơn', icon: FileText },
                  { id: 'Kê khai thuế', label: 'Kê khai thuế', icon: Percent },
                  { id: 'Quản lý kho', label: 'Quản lý kho', icon: Package },
                  { id: 'Quản lý công nợ', label: 'Quản lý công nợ', icon: DollarSign },
                  { id: 'Quản lý nhân viên', label: 'Quản lý nhân viên', icon: Users },
                  { id: 'Báo cáo doanh thu', label: 'Báo cáo doanh thu', icon: BarChart3 },
                  { id: 'Chăm sóc khách hàng', label: 'Chăm sóc khách hàng', icon: Heart },
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = selectedNeeds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedNeeds(prev => prev.filter(x => x !== item.id));
                        } else {
                          setSelectedNeeds(prev => [...prev, item.id]);
                        }
                      }}
                      className={`p-2.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 relative min-h-[85px] ${
                        isSelected
                          ? 'border-[#076EFF] bg-[#F4F8FF] shadow-[0_4px_12px_rgba(7,110,255,0.06)]'
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                      }`}
                    >
                      <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#076EFF]/10 text-[#076EFF]' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <IconComponent className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[11.5px] font-bold text-slate-800 text-center leading-tight">{item.label}</span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-[#076EFF]">
                          <CheckCircle2 className="w-4 h-4 fill-[#076EFF] text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0 mt-4">
            <div>
              {surveyStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setSurveyStep(prev => prev - 1)}
                  className="h-10 px-4 text-slate-500 hover:text-slate-800 font-bold text-[13px] rounded-xl transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              ) : (
                <div />
              )}
            </div>
            
            <button
              type="button"
              onClick={() => {
                if (surveyStep < 4) {
                  setSurveyStep(prev => prev + 1);
                } else {
                  handleCompleteSurvey();
                }
              }}
              className="h-10 px-6 min-w-[130px] bg-[#076EFF] hover:bg-[#0057D6] text-white font-bold text-[13px] rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-95 flex items-center justify-center gap-1.5"
            >
              {surveyStep === 4 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Bắt đầu sử dụng</span>
                </>
              ) : (
                <>
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#EEF0F4] font-sans select-none overflow-hidden relative">
      
      {/* ONBOARDING PROGRESS HEADER */}
      <div className="h-14 bg-white border-b border-slate-100 px-6 shrink-0 flex items-center justify-between shadow-sm relative z-30">
        <div className="flex items-center gap-3.5">
          <div className="p-2 bg-brand/10 text-brand rounded-xl border border-brand/20 shadow-xs">
            <Tablet className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[15px] font-bold text-slate-800 leading-tight">Thiết lập bán hàng</h1>
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 text-emerald-600 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span className="text-[11px] font-semibold tracking-wide">Đã hoàn thành {completedCount}/6 bước ({percentage}%)</span>
            </div>
          </div>
        </div>

        {/* Progress Display */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSkipOnboarding}
            className="h-8 px-4 border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 rounded-lg text-xs transition-all hover:border-slate-300 min-w-[80px]"
          >
            Bỏ qua
          </button>
        </div>
      </div>

      {/* STEPPERS NAVIGATION RAIL */}
      <div className="h-14 bg-[#FAFAFA] border-b border-slate-200/60 px-6 shrink-0 flex items-center backdrop-blur-xs relative z-20">
        <div className="flex items-center w-full max-w-7xl justify-between mx-auto">
          {steps.map((st, idx) => {
            const isCompleted = stepsState[st.num - 1];
            const isActive = currentStep === st.num;
            return (
              <React.Fragment key={st.num}>
                <div 
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-3 cursor-pointer group transition-all duration-200 relative z-10 ${isActive ? 'scale-[1.01]' : 'opacity-90 hover:opacity-100'}`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                      : isActive 
                        ? 'bg-brand border-brand text-white shadow-md shadow-brand/20 ring-4 ring-brand/10' 
                        : 'bg-white border-slate-300 text-slate-500 group-hover:border-slate-400'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3px]" /> : st.num}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className={`text-[13px] font-bold leading-tight transition-colors duration-200 ${isActive ? 'text-brand' : isCompleted ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {st.title}
                    </div>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 mx-4 h-[2px] min-w-[20px] bg-slate-200 relative rounded-full overflow-hidden hidden sm:block">
                    <div 
                      className={`absolute inset-0 transition-all duration-500 ${
                        isCompleted && stepsState[idx + 1]
                          ? 'bg-emerald-500 w-full'
                          : isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-brand w-full'
                            : 'bg-slate-200 w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* CORE WORK AREA */}
      <div className="flex-1 p-3 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 flex-1 overflow-hidden flex flex-col relative">
          
          {/* STEP 1: MENU BUILDER */}
          {currentStep === 2 && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column: Menu Items List */}
              <div className="w-[380px] border-r border-slate-100 bg-white flex flex-col justify-between overflow-hidden shrink-0">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 tracking-wider">Thực đơn ({customMenuItems.length} món)</h3>
                  </div>
                  {customMenuItems.length > 0 && (
                    <button 
                      type="button"
                      onClick={() => {
                        setCustomMenuItems([]);
                        setSelectedOnboardingItemId(null);
                      }}
                      className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                    >
                      Xóa hết
                    </button>
                  )}
                </div>

                {/* Scrollable Item List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/30 custom-scrollbar">
                  {customMenuItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <UtensilsCrossed className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Thực đơn trống. Vui lòng bấm thêm món!</p>
                    </div>
                  ) : (
                    customMenuItems.map((item) => {
                      const isSelected = selectedOnboardingItemId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectOnboardingItem(item)}
                          className={`group p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#076EFF]/5 border-[#076EFF]/30 text-[#076EFF]'
                              : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-100/50">
                              {item.image ? (
                                <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <UtensilsCrossed className={`w-5 h-5 ${isSelected ? 'text-[#076EFF]' : 'text-slate-400'}`} />
                              )}
                            </div>
                            <div className="text-left overflow-hidden">
                              <div className={`font-bold text-xs truncate max-w-[180px] ${isSelected ? 'text-[#076EFF]' : 'text-slate-800'}`}>
                                {item.name}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span className="truncate max-w-[80px]">{item.category}</span>
                                <span>•</span>
                                <span className="font-bold text-slate-500">{formatCurrency(item.price)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id);
                            }}
                            className="w-10 h-10 -mr-2 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50/50 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                            title="Xóa món"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Sticky Action Footer */}
                <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={handleAddNewOnboardingItem}
                    className="w-full h-10 bg-[#076EFF] hover:bg-[#0661e0] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Thêm món
                  </button>
                </div>
              </div>

              {/* Right Column: Edit Panel / Details Form */}
              <div className="flex-1 bg-white flex flex-col overflow-hidden">
                {selectedOnboardingItemId && customMenuItems.length > 0 ? (
                  <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    <div className="h-14 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-white">
                      <span className="text-xs font-black text-slate-800 tracking-wider flex items-center gap-2">
                        <Edit2 className="w-4 h-4 text-[#076EFF]" /> Thiết lập chi tiết món ăn
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
                      {/* Tên món */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-slate-600 block">Tên món ăn / đồ uống <span className="text-red-500">*</span></label>
                        <input
                          required
                          type="text"
                          className="w-full h-10 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] focus:ring-1 focus:ring-[#076EFF] text-xs font-bold text-slate-800 bg-white transition-all"
                          value={editName}
                          onChange={(e) => updateSelectedItemField('name', e.target.value)}
                        />
                      </div>

                      {/* Loại món & Nhóm thực đơn */}
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 block">Loại món <span className="text-red-500">*</span></label>
                          <select
                            className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] focus:ring-1 focus:ring-[#076EFF] text-xs font-bold text-slate-700 bg-white transition-all"
                            value={editType}
                            onChange={(e) => updateSelectedItemField('type', e.target.value)}
                          >
                            <option value="Món ăn">Món ăn</option>
                            <option value="Đồ uống">Đồ uống</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 relative">
                          <label className="text-xs font-bold text-slate-600 block">Nhóm thực đơn</label>
                          <div className="flex gap-1.5 items-center">
                            <select
                              className="flex-1 h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] focus:ring-1 focus:ring-[#076EFF] text-xs font-bold text-slate-700 bg-white transition-all"
                              value={editCategory}
                              onChange={(e) => updateSelectedItemField('category', e.target.value)}
                            >
                              {availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                              className="w-10 h-10 shrink-0 bg-[#076EFF]/10 hover:bg-[#076EFF]/20 text-[#076EFF] rounded-xl flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {showAddCategoryInput && (
                            <div className="absolute right-0 bottom-12 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-20 w-52 space-y-2">
                              <label className="text-[11px] font-bold text-slate-500 block">Thêm nhóm mới</label>
                              <input 
                                type="text" 
                                placeholder="Ví dụ: Ăn vặt, Hải sản..."
                                className="w-full h-8 px-2 border border-slate-200 rounded-lg text-xs"
                                value={newCategoryValue}
                                onChange={(e) => setNewCategoryValue(e.target.value)}
                              />
                              <div className="flex gap-2 justify-end">
                                <button 
                                  type="button"
                                  onClick={() => setShowAddCategoryInput(false)}
                                  className="text-[10px] font-bold text-slate-400 px-2 py-1"
                                >
                                  Hủy
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (newCategoryValue.trim() && !availableCategories.includes(newCategoryValue.trim())) {
                                      const updatedCats = [...availableCategories, newCategoryValue.trim()];
                                      setAvailableCategories(updatedCats);
                                      updateSelectedItemField('category', newCategoryValue.trim());
                                      setNewCategoryValue('');
                                      setShowAddCategoryInput(false);
                                      showToast('Đã thêm nhóm mới', 'success');
                                    }
                                  }}
                                  className="text-[10px] font-bold bg-[#076EFF] text-white px-2 py-1 rounded"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Giá món & Đơn vị tính */}
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 block">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                          <input
                            required
                            type="number"
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] focus:ring-1 focus:ring-[#076EFF] text-xs font-black text-slate-800 bg-white transition-all"
                            value={editPrice}
                            onChange={(e) => updateSelectedItemField('price', parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div className="space-y-1.5 relative">
                          <label className="text-xs font-bold text-slate-600 block">Đơn vị tính <span className="text-red-500">*</span></label>
                          <div className="flex gap-1.5 items-center">
                            <select
                              className="flex-1 h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] focus:ring-1 focus:ring-[#076EFF] text-xs font-bold text-slate-700 bg-white transition-all"
                              value={editUnit}
                              onChange={(e) => updateSelectedItemField('unit', e.target.value)}
                            >
                              {availableUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => setShowAddUnitInput(!showAddUnitInput)}
                              className="w-10 h-10 shrink-0 bg-[#076EFF]/10 hover:bg-[#076EFF]/20 text-[#076EFF] rounded-xl flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {showAddUnitInput && (
                            <div className="absolute right-0 bottom-12 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-20 w-48 space-y-2">
                              <label className="text-[11px] font-bold text-slate-500 block">Thêm đơn vị mới</label>
                              <input 
                                type="text" 
                                placeholder="Ví dụ: Ly, Chén, Tô..."
                                className="w-full h-8 px-2 border border-slate-200 rounded-lg text-xs"
                                value={newUnitValue}
                                onChange={(e) => setNewUnitValue(e.target.value)}
                              />
                              <div className="flex gap-2 justify-end">
                                <button 
                                  type="button"
                                  onClick={() => setShowAddUnitInput(false)}
                                  className="text-[10px] font-bold text-slate-400 px-2 py-1"
                                >
                                  Hủy
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (newUnitValue.trim() && !availableUnits.includes(newUnitValue.trim())) {
                                      const updatedUnits = [...availableUnits, newUnitValue.trim()];
                                      setAvailableUnits(updatedUnits);
                                      updateSelectedItemField('unit', newUnitValue.trim());
                                      setNewUnitValue('');
                                      setShowAddUnitInput(false);
                                      showToast('Đã thêm đơn vị tính mới', 'success');
                                    }
                                  }}
                                  className="text-[10px] font-bold bg-[#076EFF] text-white px-2 py-1 rounded"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ảnh món */}
                      <div className="space-y-3 text-left">
                        <label className="text-xs font-bold text-slate-600 block">Ảnh minh họa món</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center rounded-2xl overflow-hidden shrink-0">
                            {editImage ? (
                              <img src={editImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <UtensilsCrossed className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                          
                          <div className="flex gap-2 relative">
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowImagePicker(!showImagePicker)}
                                className="h-10 px-4 bg-white border border-[#076EFF] text-[#076EFF] font-bold text-xs rounded-xl hover:bg-blue-50/50 transition-colors"
                              >
                                Chọn ảnh đại diện
                              </button>
                              {showImagePicker && (
                                <div className="absolute left-0 bottom-11 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 w-72 grid grid-cols-4 gap-2">
                                  {foodImages.map((img, idx) => (
                                    <div 
                                      key={idx}
                                      onClick={() => {
                                        updateSelectedItemField('image', img.url);
                                        setShowImagePicker(false);
                                      }}
                                      className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:border-[#076EFF] hover:scale-105 transition-all"
                                      title={img.label}
                                    >
                                      <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const randomIdx = Math.floor(Math.random() * foodImages.length);
                                updateSelectedItemField('image', foodImages[randomIdx].url);
                                showToast('Đã chọn ảnh mẫu từ thư viện!', 'success');
                              }}
                              className="h-10 w-10 bg-white border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors"
                              title="Ngẫu nhiên ảnh ngon mắt"
                            >
                              <Camera className="w-4 h-4 text-slate-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sticky Edit Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={handleSaveOnboardingItem}
                        className="h-10 min-w-[120px] px-8 bg-[#076EFF] hover:bg-[#0661e0] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <Save className="w-4 h-4" /> LƯU
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                      <UtensilsCrossed className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">Chưa chọn món ăn nào</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">Nhấn vào một món ăn ở danh mục bên trái để cấu hình thông tin chi tiết hoặc bấm "+ Thêm" để khởi tạo.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* STEP 2: TABLE LAYOUT DESIGNER */}
          {currentStep === 3 && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Zone List */}
              <div className="w-[340px] border-r border-slate-200 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar shrink-0 bg-white">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 tracking-wide">Danh sách khu vực</h3>
                    <p className="text-xs text-slate-500 mt-1">Quản lý danh sách các khu vực/tầng phục vụ khách hàng của nhà hàng.</p>
                  </div>

                  {/* Zones List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 tracking-wide">
                        Khu vực phục vụ
                      </label>
                      <span className="text-[11px] text-slate-400 font-bold">({customZones.length} khu vực)</span>
                    </div>

                    <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                      {customZones.map(zone => {
                        const isEditing = editingZoneName === zone;
                        const isActive = activeZone === zone;
                        const tablesCount = customTables.filter(t => t.zone === zone).length;

                        return (
                          <div 
                            key={zone}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              isActive 
                                ? 'bg-blue-50/50 border-[#076EFF]/30 text-[#076EFF]' 
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            {isEditing ? (
                              <div className="flex-1 flex gap-1.5 items-center">
                                <input 
                                  type="text"
                                  className="flex-1 h-8 px-2 text-xs rounded-lg border border-[#076EFF] bg-white focus:outline-none"
                                  value={zoneRenameValue}
                                  onChange={(e) => setZoneRenameValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') renameZone(zone);
                                    if (e.key === 'Escape') setEditingZoneName(null);
                                  }}
                                  autoFocus
                                />
                                <button 
                                  onClick={() => renameZone(zone)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                  title="Lưu"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setEditingZoneName(null)}
                                  className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                  title="Hủy"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <button 
                                  onClick={() => {
                                    setActiveZone(zone);
                                    setIsTableSetup(true);
                                  }}
                                  className="flex-1 text-left font-bold text-xs flex items-center gap-2.5"
                                >
                                  <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-[#076EFF]' : 'bg-slate-300'}`}></span>
                                  <span>{zone}</span>
                                  <span className="text-[10px] text-slate-400 font-normal">({tablesCount} bàn)</span>
                                </button>
                                
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => {
                                      setEditingZoneName(zone);
                                      setZoneRenameValue(zone);
                                    }}
                                    className="p-1 text-slate-400 hover:text-[#076EFF] hover:bg-white rounded transition-colors"
                                    title="Sửa tên"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  {customZones.length > 1 && (
                                    <button 
                                      onClick={() => deleteZone(zone)}
                                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-white rounded transition-colors"
                                      title="Xóa khu vực"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Add zone input */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <input 
                        type="text"
                        placeholder="Thêm khu vực mới..."
                        className="flex-1 h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs cursor-pointer"
                        value={newZoneName}
                        onChange={(e) => setNewZoneName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addCustomZone();
                        }}
                      />
                      <button 
                        onClick={addCustomZone}
                        className="h-10 px-4 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors shrink-0"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Kéo thả các bàn trên sơ đồ bên phải để bố trí sơ đồ bàn thực tế của quán.
                </div>
              </div>

              {/* Center: Blueprint Floor Layout Canvas */}
              <div className="flex-1 bg-slate-100 p-6 flex flex-col justify-between overflow-hidden relative select-none">
                
                {/* Header Actions for layout */}
                <div className="h-14 bg-white rounded-2xl border border-slate-200/80 px-4 flex items-center justify-between shrink-0 shadow-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-[#076EFF]" />
                    <h4 className="font-bold text-xs text-slate-800 tracking-wider">
                      Sơ đồ bàn: {activeZone} ({customTables.filter(t => t.zone === activeZone).length} bàn)
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Toggle quick setup button */}
                    <button 
                      onClick={() => setShowQuickSetup(!showQuickSetup)}
                      className={`h-10 px-4 border text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                        showQuickSetup 
                          ? 'bg-[#076EFF] text-white border-[#076EFF]' 
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#076EFF]/40 hover:bg-slate-50'
                      }`}
                      title="Thiết lập nhanh sơ đồ bàn"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Thiết lập nhanh
                    </button>

                    {/* Add single table button */}
                    <button 
                      onClick={() => {
                        const nextIndex = customTables.filter(t => t.zone === activeZone).length + 1;
                        const defaultName = `Bàn ${nextIndex}`;
                        const id = Date.now().toString();
                        
                        // position (3-column spacious grid)
                        const count = customTables.filter(t => t.zone === activeZone).length;
                        const row = Math.floor(count / 3);
                        const col = count % 3;
                        const x = 18 + col * 32;
                        const y = 25 + row * 30;

                        setCustomTables([...customTables, {
                          id,
                          name: defaultName,
                          zone: activeZone,
                          seats: 4,
                          shape: 'round',
                          status: 'empty',
                          x: Math.min(90, x),
                          y: Math.min(90, y),
                          active: true
                        }]);
                        setSelectedOnboardingTableId(id);
                        setIsTableSetup(true);
                        showToast(`Đã thêm ${defaultName}`, 'success');
                      }}
                      className="h-10 px-4 bg-[#076EFF] hover:bg-[#0057D6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Thêm 1 bàn
                    </button>
                  </div>
                </div>

                {/* Quick Setup Form Overlay inside Center Area */}
                <AnimatePresence>
                  {showQuickSetup && (
                    <motion.div 
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-4 shadow-md flex flex-wrap items-center justify-between gap-4 shrink-0"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wide">Tự động khởi tạo hàng loạt</span>
                        <span className="text-[11px] text-slate-400 font-sans">Sinh tự động danh sách bàn trong khu vực này</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-bold">Tiền tố:</span>
                          <input 
                            type="text"
                            className="w-20 h-9 px-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#076EFF] font-bold text-center"
                            value={bulkPrefix}
                            onChange={(e) => setBulkPrefix(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-bold">Bắt đầu từ:</span>
                          <input 
                            type="number"
                            className="w-16 h-9 px-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#076EFF] font-bold text-center"
                            value={bulkStartNum}
                            onChange={(e) => setBulkStartNum(parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-bold">Số lượng:</span>
                          <input 
                            type="number"
                            className="w-16 h-9 px-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#076EFF] font-bold text-center"
                            value={bulkQuantity}
                            onChange={(e) => setBulkQuantity(parseInt(e.target.value) || 5)}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowQuickSetup(false)}
                          className="h-9 px-3 text-xs text-slate-500 font-bold rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          Hủy
                        </button>
                        <button 
                          onClick={() => {
                            addBulkTables();
                            setShowQuickSetup(false);
                          }}
                          className="h-9 px-4 bg-[#076EFF] text-white text-xs font-bold rounded-lg hover:bg-[#0057D6] transition-colors shadow"
                        >
                          Khởi tạo tự động
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Visual Drag & Drop Canvas Wrapper */}
                <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl relative overflow-hidden flex flex-col shadow-inner">


                  <div className="absolute top-3 right-3 z-10 pointer-events-none flex items-center gap-2 bg-white/80 border border-slate-200/60 px-2.5 py-1 rounded-lg text-[9px] font-bold text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#076EFF]"></div> Cửa ra vào
                  </div>

                  {/* Blueprint Floor Layout Canvas */}
                  <div 
                    id="table-canvas-container"
                    onMouseMove={handleCanvasDragMove}
                    onTouchMove={handleCanvasDragMove}
                    onMouseUp={handleDragEnd}
                    onTouchEnd={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    className="flex-1 w-full h-full relative cursor-default"
                    style={{
                      backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  >
                    {/* Entrance Marker */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-2.5 bg-slate-200 rounded-t-lg border-x border-t border-slate-200 flex items-center justify-center pointer-events-none">
                      <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-50 px-1.5 rounded -top-2 relative">LỐI VÀO CHÍNH</span>
                    </div>



                     {/* Custom Tables */}
                     {customTables.filter(t => t.zone === activeZone).map(tbl => {
                       const isDragging = draggingTableId === tbl.id;
                       const isSelected = tbl.id === selectedOnboardingTableId;
                       const xPercent = tbl.x !== undefined ? tbl.x : 50;
                       const yPercent = tbl.y !== undefined ? tbl.y : 50;

                       // Shape sizing matching the template photo exactly
                       const shapeClass = 
                         tbl.shape === 'rectangular' 
                           ? 'w-[84px] h-[56px] rounded-[10px]' 
                           : tbl.shape === 'square' 
                             ? 'w-[56px] h-[56px] rounded-[10px]' 
                             : 'w-[56px] h-[56px] rounded-full';

                       const bgAndBorderClass = isDragging
                         ? 'bg-[#F0F6FE] border border-dashed border-[#076EFF] text-[#076EFF] shadow-lg z-50 cursor-grabbing scale-105'
                         : isSelected
                           ? 'bg-[#F0F6FE] border-2 border-dashed border-[#076EFF] text-[#076EFF] shadow-md z-30 cursor-grab'
                           : 'bg-white border border-dashed border-[#A4A7AE] text-[#101828] hover:border-[#076EFF] shadow-sm z-20 cursor-grab';

                       return (
                         <div
                           key={tbl.id}
                           onMouseDown={(e) => handleTableDragStart(e, tbl.id, xPercent, yPercent)}
                           onTouchStart={(e) => handleTableDragStart(e, tbl.id, xPercent, yPercent)}
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedOnboardingTableId(tbl.id);
                             setTableDetailModalData({ ...tbl });
                             setIsTableDetailModalOpen(true);
                           }}
                           className={`absolute flex flex-col items-center justify-center transition-all select-none group ${shapeClass} ${bgAndBorderClass}`}
                           style={{
                             left: `${xPercent}%`,
                             top: `${yPercent}%`,
                             transform: 'translate(-50%, -50%)',
                           }}
                         >
                           {/* Render dynamic seat dots as lines around the table */}
                           {renderSeats(tbl.seats || 4, tbl.shape || 'round')}

                           <div className={`text-[13px] font-semibold text-center select-none ${isDragging || isSelected ? 'text-[#076EFF]' : 'text-[#101828]'}`}>
                             {tbl.name}
                           </div>

                           {/* Hover Delete Button */}
                           <button 
                             onMouseDown={(e) => {
                               e.stopPropagation();
                               e.preventDefault();
                               handleOnboardingDeleteTable(tbl.id);
                             }}
                             className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 shadow opacity-0 group-hover:opacity-100 transition-opacity z-30 animate-fadeIn"
                             title="Xóa bàn"
                           >
                             <Plus className="w-3 h-3 rotate-45" />
                           </button>
                         </div>
                       );
                     })}

                    {/* Empty state overlay if zero tables */}
                    {customTables.filter(t => t.zone === activeZone).length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-slate-400 pointer-events-none">
                        <Move className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-xs font-bold text-slate-500">Sơ đồ trống</p>
                        <p className="text-[11px] text-slate-400 mt-1">Sử dụng nút "Thiết lập nhanh" hoặc "Thêm 1 bàn" để khởi tạo sơ đồ bàn.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STEP 3: PAYMENT INTEGRATIONS */}
          {currentStep === 4 && (
            <div className="flex-1 flex flex-col justify-start bg-white p-4 md:p-6 overflow-y-auto custom-scrollbar">
              <div className="max-w-6xl w-full mx-auto font-sans">
                {/* Step Header */}
                <h2 className="text-[20px] font-bold text-slate-800 tracking-tight leading-tight">
                  Thiết lập hình thức thanh toán
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5">
                  Kích hoạt các phương thức thanh toán đáp ứng tại nhà hàng của bạn. Giúp phần mềm tự động xuất mã QR thanh toán động và theo dõi dòng tiền chính xác.
                </p>

                {/* Horizontal Divider */}
                <div className="border-b border-slate-200/60 my-4" />

                {/* Section Title */}
                <h3 className="text-[11px] font-bold text-slate-400 tracking-wider mb-2.5">
                  Các hình thức thanh toán
                </h3>

                {/* Checkbox Cards */}
                <div className="space-y-3">
                  
                  {/* Card 1: Tiền mặt */}
                  <div
                    onClick={() => setEnabledPayments(prev => ({ ...prev, cash: !prev.cash }))}
                    className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                      enabledPayments.cash
                        ? 'border-brand bg-[#076EFF]/[0.02] shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Checkbox Box */}
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                      enabledPayments.cash
                        ? 'bg-brand border-brand text-white shadow-xs'
                        : 'bg-white border-slate-300'
                    }`}>
                      {enabledPayments.cash && (
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      )}
                    </div>
                    
                    {/* Label & Description */}
                    <div className="flex-1">
                      <h4 className="text-[15px] font-bold text-slate-800 leading-snug">
                        Tiền mặt
                      </h4>
                      <p className="text-xs text-slate-500 font-normal mt-0.5 leading-normal">
                        Thanh toán trực tiếp tại quầy bằng tiền mặt
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Chuyển khoản */}
                  <div className="flex flex-col gap-2.5">
                    <div
                      onClick={() => setEnabledPayments(prev => ({ ...prev, transfer: !prev.transfer }))}
                      className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                        enabledPayments.transfer
                          ? 'border-brand bg-[#076EFF]/[0.02] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Checkbox Box */}
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        enabledPayments.transfer
                          ? 'bg-brand border-brand text-white shadow-xs'
                          : 'bg-white border-slate-300'
                      }`}>
                        {enabledPayments.transfer && (
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        )}
                      </div>
                      
                      {/* Label & Description */}
                      <div className="flex-1">
                        <h4 className="text-[15px] font-bold text-slate-800 leading-snug">
                          Chuyển khoản
                        </h4>
                        <p className="text-xs text-slate-500 font-normal mt-0.5 leading-normal">
                          Tự động tạo mã QR chuyển khoản động theo hóa đơn
                        </p>
                      </div>
                    </div>

                    {/* Expandable sub-grid of Banks */}
                    {enabledPayments.transfer && (
                      <div className="ml-0.5 mt-3">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Kết nối tài khoản ngân hàng nhận VietQR
                          </h4>
                          <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                            {BANK_LIST_NEW.filter(b => connectedPayments[b.id]).length}/{BANK_LIST_NEW.length} đã kết nối
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {BANK_LIST_NEW.map((bank) => {
                            const isConnected = connectedPayments[bank.id];
                            return (
                              <div
                                key={bank.id}
                                className={`bg-white border rounded-2xl p-3 flex items-center justify-between gap-2.5 transition-all duration-300 relative ${
                                  isConnected 
                                    ? 'border-emerald-300 bg-emerald-50/[0.01] shadow-[0_4px_16px_rgba(16,24,40,0.03)]' 
                                    : 'border-[#E9EAEB] hover:border-[#245FDF]/40 hover:shadow-[0_8px_16px_-4px_rgba(16,24,40,0.06)]'
                                }`}
                              >
                                <div className="shrink-0">
                                  <BankLogo src={bank.logo} alt={bank.name} fallbackText={bank.fallbackText} color={bank.color} size="xl" />
                                </div>
                                
                                <div className="flex flex-col items-end gap-1.5 flex-1 min-w-0 text-right">
                                  <h4 className="text-[13px] font-bold text-[#101828] leading-tight break-words truncate w-full" title={bank.name}>
                                    {bank.name}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConnectedPayments(prev => ({ ...prev, [bank.id]: !prev[bank.id] }));
                                      showToast(
                                        !isConnected 
                                          ? `Đã kết nối tài khoản ${bank.name} thành công!` 
                                          : `Đã ngắt kết nối với ${bank.name}`,
                                        !isConnected ? 'success' : 'info'
                                      );
                                    }}
                                    className={`h-7 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all shrink-0 border ${
                                      isConnected
                                        ? 'bg-emerald-50 hover:bg-red-50 text-emerald-600 hover:text-[#F04438] border-emerald-200 hover:border-red-200 shadow-2xs'
                                        : 'bg-white text-[#245FDF] border-[#245FDF] hover:bg-[#F0F6FE]'
                                    }`}
                                  >
                                    {isConnected ? (
                                      <>
                                        <X className="w-3.5 h-3.5 stroke-[2.5px]" />
                                        Hủy kết nối
                                      </>
                                    ) : (
                                      <>
                                        <Link2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                                        Kết nối
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 3: Ví điện tử */}
                  <div className="flex flex-col gap-2.5">
                    <div
                      onClick={() => setEnabledPayments(prev => ({ ...prev, wallet: !prev.wallet }))}
                      className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                        enabledPayments.wallet
                          ? 'border-brand bg-[#076EFF]/[0.02] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Checkbox Box */}
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        enabledPayments.wallet
                          ? 'bg-brand border-brand text-white shadow-xs'
                          : 'bg-white border-slate-300'
                      }`}>
                        {enabledPayments.wallet && (
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        )}
                      </div>
                      
                      {/* Label & Description */}
                      <div className="flex-1">
                        <h4 className="text-[15px] font-bold text-slate-800 leading-snug">
                          Ví điện tử
                        </h4>
                        <p className="text-xs text-slate-500 font-normal mt-0.5 leading-normal">
                          Chấp nhận thanh toán bằng ví Momo, ZaloPay, VNPAY
                        </p>
                      </div>
                    </div>

                    {/* Expandable sub-grid of Wallets */}
                    {enabledPayments.wallet && (
                      <div className="ml-0.5 mt-3">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Kết nối cổng thanh toán Ví điện tử
                          </h4>
                          <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                            {WALLET_LIST_NEW.filter(w => connectedPayments[w.id]).length}/{WALLET_LIST_NEW.length} đã kết nối
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {WALLET_LIST_NEW.map((wallet) => {
                            const isConnected = connectedPayments[wallet.id];
                            return (
                              <div
                                key={wallet.id}
                                className={`bg-white border rounded-2xl p-3 flex items-center justify-between gap-2.5 transition-all duration-300 relative ${
                                  isConnected 
                                    ? 'border-emerald-300 bg-emerald-50/[0.01] shadow-[0_4px_16px_rgba(16,24,40,0.03)]' 
                                    : 'border-[#E9EAEB] hover:border-[#245FDF]/40 hover:shadow-[0_8px_16px_-4px_rgba(16,24,40,0.06)]'
                                }`}
                              >
                                <div className="shrink-0">
                                  <BankLogo src={wallet.logo} alt={wallet.name} fallbackText={wallet.fallbackText} color={wallet.color} size="xl" />
                                </div>
                                
                                <div className="flex flex-col items-end gap-1.5 flex-1 min-w-0 text-right">
                                  <h4 className="text-[13px] font-bold text-[#101828] leading-tight break-words truncate w-full" title={wallet.name}>
                                    {wallet.name}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConnectedPayments(prev => ({ ...prev, [wallet.id]: !prev[wallet.id] }));
                                      showToast(
                                        !isConnected 
                                          ? `Đã kết nối tài khoản ${wallet.name} thành công!` 
                                          : `Đã ngắt kết nối với ${wallet.name}`,
                                        !isConnected ? 'success' : 'info'
                                      );
                                    }}
                                    className={`h-7 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all shrink-0 border ${
                                      isConnected
                                        ? 'bg-emerald-50 hover:bg-red-50 text-emerald-600 hover:text-[#F04438] border-emerald-200 hover:border-red-200 shadow-2xs'
                                        : 'bg-white text-[#245FDF] border-[#245FDF] hover:bg-[#F0F6FE]'
                                    }`}
                                  >
                                    {isConnected ? (
                                      <>
                                        <X className="w-3.5 h-3.5 stroke-[2.5px]" />
                                        Hủy kết nối
                                      </>
                                    ) : (
                                      <>
                                        <Link2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                                        Kết nối
                                      </>
                                    )}
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

          {/* HIDDEN_LEGACY_PAYMENTS */}
          {false && (
            <div className="flex-1 flex overflow-hidden bg-[#EEF0F4]">
              
              {/* Left Config Panel: Clean navigation menu */}
              <div className="w-[320px] border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 bg-white">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Cổng thanh toán</h3>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">
                      Thiết lập và quản lý các cổng thanh toán nhận tiền của nhà hàng.
                    </p>
                  </div>

                  {/* Vertical navigation items */}
                  <div className="flex flex-col gap-3">
                    
                    {/* 1. Ngân hàng thông thường (QR tĩnh) */}
                    <button
                      type="button"
                      onClick={() => {
                        setActivePaymentType('static_qr');
                        setIsAddingStatic(false);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3.5 ${
                        activePaymentType === 'static_qr'
                          ? 'border-[#076EFF] bg-blue-50/20 ring-1 ring-[#076EFF]/10'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        activePaymentType === 'static_qr' ? 'bg-[#076EFF] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-800">1. QR tài khoản cá nhân</div>
                        <div className="text-[9px] text-slate-400 font-normal mt-0.5 truncate">VietQR tĩnh nhận tiền nhanh</div>
                        
                        {/* Status badge */}
                        <div className="mt-1">
                          {staticBanks.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              Đã liên kết ({staticBanks.length})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                              Chưa thiết lập
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* 2. Thanh toán có đối soát (QR động) */}
                    <button
                      type="button"
                      onClick={() => {
                        setActivePaymentType('jetpay');
                        setIsAddingJetpay(false);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3.5 ${
                        activePaymentType === 'jetpay'
                          ? 'border-[#076EFF] bg-blue-50/20 ring-1 ring-[#076EFF]/10'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        activePaymentType === 'jetpay' ? 'bg-[#076EFF] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Link2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-800">2. Đối soát MISA Jetpay</div>
                        <div className="text-[9px] text-slate-400 font-normal mt-0.5 truncate">QR động tự động báo Có</div>
                        
                        {/* Status badge */}
                        <div className="mt-1">
                          {jetpayBanks.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              Đã kết nối ({jetpayBanks.length})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                              Chưa thiết lập
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* 3. Thiết bị quẹt thẻ POS */}
                    <button
                      type="button"
                      onClick={() => {
                        setActivePaymentType('pos');
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3.5 ${
                        activePaymentType === 'pos'
                          ? 'border-[#076EFF] bg-blue-50/20 ring-1 ring-[#076EFF]/10'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        activePaymentType === 'pos' ? 'bg-[#076EFF] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-800">3. Máy quẹt thẻ POS</div>
                        <div className="text-[9px] text-slate-400 font-normal mt-0.5 truncate">Đồng bộ thiết bị cầm tay</div>
                        
                        {/* Status badge */}
                        <div className="mt-1">
                          {posStatus === 'connected' ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              Đã đồng bộ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                              Chưa kết nối
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="p-3 bg-[#076EFF]/5 border border-[#076EFF]/15 rounded-xl flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#076EFF] shrink-0 mt-0.5" />
                    <div className="text-[10px] text-slate-500 font-medium leading-normal">
                      Hệ thống hỗ trợ cấu hình đa cổng nhận tiền, tự động chia sẻ thông tin thanh toán cho từng bàn cực tiện lợi.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Configuration Input Panel */}
              <div className="flex-1 bg-[#EEF0F4] p-6 overflow-y-auto custom-scrollbar">
                
                {/* 1. NGÂN HÀNG THÔNG THƯỜNG (QR TĨNH) */}
                {activePaymentType === 'static_qr' && (
                  <div className="h-full flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-7xl w-full mx-auto"
                    >
                      {/* Connected accounts list */}
                      <div className="xl:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <div>
                              <h4 className="text-sm font-black text-slate-800 uppercase">Danh sách tài khoản ({staticBanks.length})</h4>
                              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Tài khoản ngân hàng của bạn đã liên kết</p>
                            </div>
                            {!isAddingStatic && (
                              <button
                                type="button"
                                onClick={() => {
                                  setNewStaticBank('');
                                  setNewStaticAccount('');
                                  setNewStaticHolder('');
                                  setIsAddingStatic(true);
                                }}
                                className="h-8 px-3 bg-[#076EFF] hover:bg-[#0057D6] text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider shrink-0"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Thêm mới
                              </button>
                            )}
                          </div>

                          <div className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                            {staticBanks.length === 0 ? (
                              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                <QrCode className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <span className="text-[11px] font-bold text-slate-500 block">Chưa có tài khoản nào</span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">Nhấp vào "Thêm mới" để kết nối tài khoản ngân hàng của bạn</span>
                              </div>
                            ) : (
                              staticBanks.map((b) => {
                                const bInfo = ONBOARDING_BANKS.find(x => x.id === b.bank) || { name: b.bank, logo: 'https://api.vietqr.io/img/VCB.png', code: b.bank.toUpperCase() };
                                const isSelectedPreview = selectedPreviewBank && selectedPreviewBank.id === b.id;
                                return (
                                  <div
                                    key={b.id}
                                    onClick={() => setSelectedPreviewBank({ ...b, type: 'static_qr' })}
                                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all shadow-sm ${
                                      isSelectedPreview 
                                        ? 'border-[#076EFF] bg-blue-50/10' 
                                        : 'bg-slate-50 hover:bg-slate-100/55 border-slate-200/60'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-16 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1 px-1.5 shrink-0 overflow-hidden shadow-xs">
                                        <img src={bInfo.logo} className="max-h-full max-w-full object-contain" alt={bInfo.name} referrerPolicy="no-referrer" />
                                      </div>
                                      <div>
                                        <div className="text-xs font-black text-slate-800 font-mono tracking-wide">{b.account}</div>
                                        <div className="text-[10px] font-bold text-slate-700 uppercase mt-0.5">{b.holder}</div>
                                        <div className="text-[9px] font-semibold text-slate-400 uppercase mt-0.5">{bInfo.code} • Cổng Thu Ngân</div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStaticBank(b.id);
                                        showToast('Đã xóa liên kết tài khoản ngân hàng', 'success');
                                      }}
                                      className="w-8 h-8 hover:bg-red-50 text-red-500 rounded-lg flex items-center justify-center transition-colors shrink-0 border border-transparent hover:border-red-100"
                                      title="Xóa tài khoản"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed font-medium">
                          * Hệ thống CUKCUK sẽ tự động chuyển đổi số tài khoản trên thành mã VietQR động chứa đúng số tiền cần thanh toán cho từng đơn hàng của khách.
                        </div>
                      </div>

                      {/* Interactive Preview or Add New Form on the Right */}
                      <div className="xl:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[400px]">
                        {!isAddingStatic ? (
                          <div className="flex flex-col items-center justify-between h-full space-y-4">
                            <div className="w-full text-center pb-3 border-b border-slate-100">
                              <span className="text-[9px] font-semibold text-[#076EFF] tracking-wider block">Bản xem trước hóa đơn</span>
                              <h4 className="text-xs font-bold text-slate-700 mt-0.5">VietQR thanh toán tự động</h4>
                            </div>

                            {staticBanks.length > 0 ? (
                              <>
                                {/* Dynamic VietQR Preview Box */}
                                {(() => {
                                  const previewItem = staticBanks.find(b => b.id === selectedPreviewBank?.id) || staticBanks[0];
                                  return (
                                    <>
                                      <div className="my-3 relative p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col items-center w-full max-w-[240px] shadow-inner">
                                        {/* Ambient pulse line scanner effect */}
                                        <div className="absolute inset-x-0 h-0.5 bg-[#076EFF] animate-bounce top-1/2 opacity-35" />
                                        
                                        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-md">
                                          <img
                                            src={`https://img.vietqr.io/image/${previewItem.bank}-${previewItem.account}-compact2.png?amount=120000&addInfo=BAN%2005%20CUKCUK&accountName=${encodeURIComponent(previewItem.holder)}`}
                                            className="w-36 h-36 object-contain mx-auto"
                                            alt="Mã QR thanh toán mẫu"
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>

                                        <div className="w-full text-center mt-3 space-y-0.5">
                                          <span className="text-[10px] font-bold text-slate-800 tracking-wide uppercase">{previewItem.holder}</span>
                                          <div className="text-[10px] font-bold text-slate-500 font-mono">{previewItem.account}</div>
                                          <div className="text-[11px] font-bold text-[#076EFF] pt-1">Số tiền: 120,000đ</div>
                                          <div className="text-[8px] text-slate-400 font-mono font-bold mt-0.5">Nội dung: Ban 05 CukCuk</div>
                                        </div>
                                      </div>

                                      <div className="w-full bg-blue-50/45 border border-blue-100 p-3 rounded-xl text-center text-[10px] text-slate-500 leading-normal">
                                        Quét thử bằng ứng dụng ngân hàng bất kỳ để kiểm tra tính đúng đắn của tài khoản thụ hưởng.
                                      </div>
                                    </>
                                  );
                                })()}
                              </>
                            ) : (
                              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                                <QrCode className="w-12 h-12 text-slate-200 mb-2" />
                                <span className="text-xs font-bold text-slate-500">Chưa có mã xem trước</span>
                                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">Hãy thêm mới một tài khoản ngân hàng ở phía bên trái để tạo mã thanh toán QR</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-full flex flex-col justify-between">
                            {!newStaticBank ? (
                              <div className="space-y-4">
                                <div className="pb-3 border-b border-slate-100 text-center">
                                  <span className="text-[9px] font-semibold text-[#076EFF] tracking-wider block">Bước 1: Lựa chọn đối tác</span>
                                  <h4 className="text-sm font-bold text-slate-800 mt-0.5">Chọn ngân hàng thụ hưởng</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-2.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                                  {ONBOARDING_BANKS.map(bank => (
                                    <button
                                      type="button"
                                      key={bank.id}
                                      onClick={() => setNewStaticBank(bank.id)}
                                      className="p-3 border border-slate-200 hover:border-[#076EFF] hover:bg-blue-50/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all text-center h-20 group bg-white shadow-sm hover:shadow-md"
                                    >
                                      <img src={bank.logo} className="h-6 object-contain group-hover:scale-105 transition-transform" alt={bank.name} referrerPolicy="no-referrer" />
                                      <span className="text-[10px] font-extrabold text-slate-600 group-hover:text-[#076EFF]">{bank.code}</span>
                                    </button>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsAddingStatic(false)}
                                  className="w-full h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all tracking-wider"
                                >
                                  Hủy bỏ & quay lại
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-5">
                                {/* Form Header */}
                                {(() => {
                                  const bankInfo = ONBOARDING_BANKS.find(b => b.id === newStaticBank) || ONBOARDING_BANKS[0];
                                  return (
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1 px-1.5 shrink-0 overflow-hidden shadow-xs">
                                          <img src={bankInfo.logo} className="max-h-full max-w-full object-contain" alt={bankInfo.name} referrerPolicy="no-referrer" />
                                        </div>
                                        <div>
                                          <span className="text-[9px] font-semibold text-[#076EFF] tracking-wider block">Bước 2: Cấu hình thông tin</span>
                                          <h4 className="text-xs font-bold text-slate-800">{bankInfo.name} ({bankInfo.code})</h4>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setNewStaticBank('')}
                                        className="text-[10px] font-bold text-slate-500 hover:text-[#076EFF] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                                      >
                                        Thay đổi
                                      </button>
                                    </div>
                                  );
                                })()}

                                {/* Inputs */}
                                <div className="space-y-4">
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <label className="text-[11px] font-bold text-slate-600 block">Số tài khoản thụ hưởng *</label>
                                      <button 
                                        type="button" 
                                        onClick={() => setNewStaticAccount('190399887766')}
                                        className="text-[9px] font-black bg-blue-50 text-[#076EFF] hover:bg-blue-100 px-2 py-0.5 rounded transition-all"
                                      >
                                        Điền mẫu
                                      </button>
                                    </div>
                                    <input 
                                      type="text" 
                                      placeholder="Nhập số tài khoản ngân hàng chính xác..."
                                      className="w-full h-10 px-3 rounded-lg border border-[#076EFF] text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#076EFF] bg-white"
                                      value={newStaticAccount}
                                      onChange={(e) => setNewStaticAccount(e.target.value.replace(/\D/g, ''))}
                                      autoFocus
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <label className="text-[11px] font-bold text-slate-600 block">Họ và tên chủ tài khoản *</label>
                                      <button 
                                        type="button" 
                                        onClick={() => setNewStaticHolder('NGUYEN QUOC HUY')}
                                        className="text-[9px] font-black bg-blue-50 text-[#076EFF] hover:bg-blue-100 px-2 py-0.5 rounded transition-all"
                                      >
                                        Điền mẫu
                                      </button>
                                    </div>
                                    <input 
                                      type="text" 
                                      placeholder="Nhập tên chủ tài khoản (VIET HOA KHONG DAU)..."
                                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-bold focus:outline-none focus:border-[#076EFF] bg-white"
                                      value={newStaticHolder}
                                      onChange={(e) => setNewStaticHolder(e.target.value.toUpperCase())}
                                    />
                                  </div>
                                </div>

                                {/* Confirm Button */}
                                <div className="pt-2 flex gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setIsAddingStatic(false)}
                                    className="flex-1 h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all tracking-wider"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleAddStaticBank}
                                    disabled={!newStaticAccount || !newStaticHolder}
                                    className={`h-10 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all tracking-wider ${
                                      newStaticAccount && newStaticHolder
                                        ? 'bg-[#076EFF] hover:bg-[#0057D6] shadow-md shadow-blue-500/10 flex-1'
                                        : 'bg-slate-300 cursor-not-allowed w-full'
                                    }`}
                                  >
                                    <Plus className="w-4 h-4" />
                                    Lưu tài khoản
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* 2. THANH TOÁN CÓ ĐỐI SOÁT (QR ĐỘNG) */}
                {activePaymentType === 'jetpay' && (
                  <div className="h-full flex flex-col justify-center">
                    {!isAddingJetpay && jetpayBanks.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-7xl w-full mx-auto"
                      >
                        {/* Connected MISA Jetpay accounts */}
                        <div className="xl:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                              <div>
                                <h4 className="text-sm font-bold text-slate-800">Đối tác Jetpay / Bankhub</h4>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Tài khoản đối soát giao dịch thời gian thực</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewJetpayBank('');
                                  setNewJetpayAccount('');
                                  setNewJetpayHolder('');
                                  setIsAddingJetpay(true);
                                }}
                                className="h-8 px-3 bg-[#076EFF] hover:bg-[#0057D6] text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors tracking-wider shrink-0"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Thêm kết nối
                              </button>
                            </div>

                            <div className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                              {jetpayBanks.map(b => {
                                const bInfo = ONBOARDING_BANKS.find(x => x.id === b.bank) || { name: b.bank, logo: 'https://api.vietqr.io/img/VCB.png', code: b.bank.toUpperCase() };
                                return (
                                  <div
                                    key={b.id}
                                    className="p-3 bg-[#076EFF]/5 rounded-xl border border-[#076EFF]/20 flex items-center justify-between transition-all shadow-sm"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-16 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1 px-1.5 shrink-0 overflow-hidden shadow-xs">
                                        <img src={bInfo.logo} className="max-h-full max-w-full object-contain" alt={bInfo.name} referrerPolicy="no-referrer" />
                                      </div>
                                      <div>
                                        <div className="text-xs font-black text-slate-800 font-mono tracking-wide">{b.account}</div>
                                        <div className="text-[10px] font-bold text-slate-700 mt-0.5">{b.holder}</div>
                                        <div className="text-[9px] font-black text-[#076EFF] mt-1 flex items-center gap-1">
                                          <span className="w-1 h-1 rounded-full bg-[#076EFF] animate-ping" />
                                          Trạng thái: Hoạt động (WebHook)
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleDeleteJetpayBank(b.id);
                                        showToast('Đã xóa tích hợp cổng Jetpay', 'success');
                                      }}
                                      className="w-8 h-8 hover:bg-red-50 text-red-500 rounded-lg flex items-center justify-center transition-colors shrink-0 border border-transparent hover:border-red-100"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5">
                            <Activity className="w-4 h-4 text-[#076EFF] mt-0.5 shrink-0" />
                            <span className="text-[9px] text-slate-500 font-medium leading-relaxed">
                              Khi có bất kỳ giao dịch chuyển khoản VietQR thành công, MISA Jetpay sẽ gửi thông tin "Báo Có" thông qua WebHook để CUKCUK gạch nợ hóa đơn hoàn toàn tự động.
                            </span>
                          </div>
                        </div>

                        {/* Automated Reconciliation Simulator */}
                        <div className="xl:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[400px]">
                          <div className="w-full text-center pb-3 border-b border-slate-100">
                            <span className="text-[9px] font-black text-[#076EFF] tracking-wider block">Giả lập giao dịch chuyển khoản</span>
                            <h4 className="text-xs font-bold text-slate-700 mt-0.5">Hệ thống đối soát tự động</h4>
                          </div>

                          {/* Simulation visual */}
                          <div className="my-5 p-4 bg-slate-50 border border-slate-150 rounded-2xl w-full text-center space-y-4">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-b border-slate-200/60 pb-2">
                              <span>Mã đơn: #CUK-9821</span>
                              <span className="font-mono text-slate-700">Bàn số 12</span>
                            </div>

                            <div className="space-y-1">
                              <div className="text-xl font-black text-slate-800 font-mono">155,000đ</div>
                              <p className="text-[10px] text-slate-400 font-medium">Nội dung WebHook giả lập sẽ được gửi đến máy bán hàng</p>
                            </div>

                            {/* Simulation buttons */}
                            <button
                              type="button"
                              onClick={() => {
                                showToast('Đang gửi tín hiệu WebHook giả lập đến CUKCUK...', 'info');
                                setTimeout(() => {
                                  showToast('Giao dịch thành công! Đã tự động đối soát & in hóa đơn!', 'success');
                                }, 1500);
                              }}
                              className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/10 transition-colors tracking-wider"
                            >
                              Giả lập khách chuyển khoản
                            </button>
                          </div>

                          <div className="bg-[#076EFF]/5 border border-[#076EFF]/15 p-3 rounded-xl text-center text-[10px] text-slate-500 leading-normal">
                            Sử dụng nút giả lập để thử nghiệm luồng chạy thực tế. Không cần thiết lập thêm bất kỳ mã lập trình nào.
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full mx-auto space-y-5"
                      >
                        {!newJetpayBank ? (
                          <div className="space-y-4">
                            <div className="pb-3 border-b border-slate-100 text-center">
                              <span className="text-[9px] font-semibold text-[#076EFF] tracking-wider block">Tích hợp Jetpay</span>
                              <h4 className="text-sm font-bold text-slate-800 mt-0.5">Chọn ngân hàng đối soát cổng Jetpay</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                              {ONBOARDING_BANKS.map(bank => (
                                <button
                                  type="button"
                                  key={bank.id}
                                  onClick={() => setNewJetpayBank(bank.id)}
                                  className="p-3 border border-slate-200 hover:border-[#076EFF] hover:bg-blue-50/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all text-center h-20 group bg-white shadow-sm hover:shadow-md"
                                >
                                  <img src={bank.logo} className="h-6 object-contain group-hover:scale-105 transition-transform" alt={bank.name} referrerPolicy="no-referrer" />
                                  <span className="text-[10px] font-extrabold text-slate-600 group-hover:text-[#076EFF]">{bank.code}</span>
                                </button>
                              ))}
                            </div>
                            {jetpayBanks.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setIsAddingJetpay(false)}
                                className="w-full h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl uppercase transition-all tracking-wider"
                              >
                                HỦY BỎ & QUAY LẠI
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-5">
                            {/* Header */}
                            {(() => {
                              const bankInfo = ONBOARDING_BANKS.find(b => b.id === newJetpayBank) || ONBOARDING_BANKS[0];
                              return (
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1 px-1.5 shrink-0 overflow-hidden shadow-xs">
                                      <img src={bankInfo.logo} className="max-h-full max-w-full object-contain" alt={bankInfo.name} referrerPolicy="no-referrer" />
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-semibold text-[#076EFF] tracking-wider block">Kết nối Jetpay</span>
                                      <h4 className="text-xs font-bold text-slate-800">Ngân hàng {bankInfo.name}</h4>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setNewJetpayBank('')}
                                    className="text-[10px] font-bold text-slate-500 hover:text-[#076EFF] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                                  >
                                    Thay đổi
                                  </button>
                                </div>
                              );
                            })()}

                            {/* Inputs */}
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <label className="text-[11px] font-bold text-slate-600 block">Số tài khoản đăng ký Jetpay *</label>
                                  <button 
                                    type="button" 
                                    onClick={() => setNewJetpayAccount('190399887766')}
                                    className="text-[9px] font-black bg-blue-50 text-[#076EFF] hover:bg-blue-100 px-2 py-0.5 rounded transition-all"
                                  >
                                    Điền mẫu
                                  </button>
                                </div>
                                <input 
                                  type="text" 
                                  placeholder="Nhập số tài khoản ngân hàng đã liên kết Jetpay..."
                                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono font-bold focus:outline-none focus:border-[#076EFF] bg-slate-50/50"
                                  value={newJetpayAccount}
                                  onChange={(e) => setNewJetpayAccount(e.target.value.replace(/\D/g, ''))}
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <label className="text-[11px] font-bold text-slate-600 block">Tên doanh nghiệp / Chủ hộ kinh doanh *</label>
                                  <button 
                                    type="button" 
                                    onClick={() => setNewJetpayHolder('CONG TY TNHH PHONG CACH AM THUC')}
                                    className="text-[9px] font-black bg-blue-50 text-[#076EFF] hover:bg-blue-100 px-2 py-0.5 rounded transition-all"
                                  >
                                    Điền mẫu
                                  </button>
                                </div>
                                <input 
                                  type="text" 
                                  placeholder="Nhập tên doanh nghiệp đầy đủ (VIET HOA KHONG DAU)..."
                                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-bold uppercase focus:outline-none focus:border-[#076EFF] bg-slate-50/50"
                                  value={newJetpayHolder}
                                  onChange={(e) => setNewJetpayHolder(e.target.value.toUpperCase())}
                                />
                              </div>
                            </div>

                            {/* Confirm Button */}
                            <div className="pt-2 flex gap-3">
                              {jetpayBanks.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setIsAddingJetpay(false)}
                                  className="flex-1 h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl uppercase transition-all tracking-wider"
                                >
                                  Quay lại
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={handleAddJetpayBank}
                                disabled={!newJetpayAccount || !newJetpayHolder}
                                className={`h-10 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider ${
                                  newJetpayAccount && newJetpayHolder
                                    ? 'bg-[#076EFF] hover:bg-[#0057D6] shadow-md shadow-blue-500/10 flex-1'
                                    : 'bg-slate-300 cursor-not-allowed w-full'
                                }`}
                              >
                                <Link2 className="w-4 h-4" />
                                Kích hoạt cổng
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                {activePaymentType === 'pos' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Left Column: Form Setup */}
                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-slate-100">
                          <span className="text-[9px] font-semibold text-[#076EFF] tracking-wider block">Kết nối phần cứng</span>
                          <h4 className="text-sm font-bold text-slate-800 mt-0.5">Cấu hình máy quẹt thẻ POS</h4>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Nhà cung cấp POS *</label>
                          <select 
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-semibold bg-white"
                            value={posBrand}
                            onChange={(e) => setPosBrand(e.target.value)}
                          >
                            <option value="smartpos">MISA SmartPOS</option>
                            <option value="payoo">Payoo POS Terminal</option>
                            <option value="nextpay">NextPay / SmartPOS</option>
                            <option value="mpos">mPOS.vn (VIMO)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Giao thức truyền dẫn *</label>
                          <select 
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-semibold bg-white"
                            value={posConnType}
                            onChange={(e) => setPosConnType(e.target.value)}
                          >
                            <option value="ip">Wi-Fi (Giao thức TCP/IP mạng nội bộ)</option>
                            <option value="usb">Cáp USB vật lý (Virtual COM Port)</option>
                            <option value="bluetooth">Sóng Bluetooth không dây</option>
                          </select>
                        </div>

                        {posConnType === 'ip' ? (
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">Địa chỉ IP thiết bị *</label>
                            <input 
                              type="text"
                              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                              value={posIpAddress}
                              onChange={(e) => setPosIpAddress(e.target.value)}
                              placeholder="Ví dụ: 192.168.1.150"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">Cổng kết nối ảo (COM) *</label>
                            <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold bg-white">
                              <option value="COM3">COM3 (USB Serial Driver)</option>
                              <option value="COM4">COM4 (USB Serial Driver)</option>
                              <option value="COM1">COM1 (Cổng DB9 truyền thống)</option>
                            </select>
                          </div>
                        )}

                        <div className="space-y-1.5 pt-1">
                          <label className="text-[11px] font-bold text-slate-600 block">Trạng thái kết nối phần cứng</label>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${posStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                            <span className="text-xs font-extrabold text-slate-700 uppercase">
                              {posStatus === 'connected' ? 'THIẾT BỊ SẴN SÀNG (ĐÃ KẾT NỐI)' : 'CHƯA LIÊN KẾT ĐƯỢC'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setPosStatus('connecting');
                            showToast('Đang quét tín hiệu thiết bị POS...', 'info');
                            setTimeout(() => {
                              setPosStatus('connected');
                              showToast('Tích hợp kết nối thiết bị POS thành công!', 'success');
                            }, 1200);
                          }}
                          className="w-full h-10 border border-[#076EFF] hover:bg-blue-50 text-[#076EFF] text-xs font-bold rounded-xl transition-all font-sans uppercase tracking-wider"
                        >
                          DÒ TÌM & KẾT NỐI LẠI THIẾT BỊ
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Physical Terminal Simulator */}
                    <div className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-center items-center relative border border-slate-100 min-h-[300px]">
                      <div className="absolute top-2 left-3 text-[8px] font-black text-slate-300 tracking-widest uppercase select-none font-mono">
                        Terminal Payment Simulator Screen
                      </div>

                      <div className="flex flex-col items-center w-full max-w-xs">
                        {/* POS physical block */}
                        <div className="w-[180px] bg-slate-900 rounded-[24px] p-2.5 pt-5 pb-6 shadow-xl border-2 border-slate-800 flex flex-col gap-1.5 relative mx-auto">
                          <div className="text-center text-[7px] font-black text-slate-500 uppercase tracking-widest">
                            {posBrand.toUpperCase()} TERMINAL
                          </div>

                          <div className="bg-slate-950 p-2 rounded-lg flex flex-col gap-1.5 border border-slate-800">
                            <div className="flex justify-between items-center text-[6px] text-slate-500 font-mono">
                              <span>{posConnType === 'ip' ? posIpAddress : 'USB DRIVER'}</span>
                              <span className={`w-1 h-1 rounded-full ${posStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            </div>

                            {/* Screen interface */}
                            <div className="bg-slate-900 rounded p-2 min-h-[90px] text-center font-mono flex flex-col justify-between">
                              {posStatus !== 'connected' ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                  <ShieldAlert className="w-5 h-5 text-slate-600 mb-1" />
                                  <div className="text-[8px] text-slate-400 font-bold uppercase">OFFLINE</div>
                                </div>
                              ) : posSimulatedStep === 'idle' ? (
                                <div className="flex-1 flex flex-col justify-between text-left">
                                  <span className="text-[6px] text-slate-500">READY FOR ORDER</span>
                                  <div className="py-1 text-center text-[8px] text-emerald-400 font-bold">POS SẴN SÀNG</div>
                                  <span className="text-[6px] text-slate-600 text-center">CUKCUK v1.2</span>
                                </div>
                              ) : posSimulatedStep === 'waiting' ? (
                                <div className="flex-1 flex flex-col justify-between text-left">
                                  <span className="text-[6px] text-slate-500">ORDER SUM SENT</span>
                                  <div className="py-1 text-center">
                                    <div className="text-[7px] text-slate-400">CẦN THANH TOÁN</div>
                                    <div className="text-[10px] text-white font-extrabold mt-0.5">{formatCurrency(parseInt(posSimulationAmount))}</div>
                                  </div>
                                  <span className="text-[6px] text-amber-500 font-bold animate-pulse text-center">XIN MỜI CHẠM / QUẸT THẺ</span>
                                </div>
                              ) : posSimulatedStep === 'authorizing' ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                  <Loader2 className="w-5 h-5 text-[#076EFF] animate-spin mb-1" />
                                  <div className="text-[7px] text-[#076EFF] font-bold">XÁC THỰC GD...</div>
                                </div>
                              ) : (
                                <div className="flex-1 flex flex-col justify-between text-center">
                                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mt-1" />
                                  <div className="text-[8px] text-emerald-400 font-bold uppercase mt-1">GD THÀNH CÔNG</div>
                                  <span className="text-[6px] text-slate-500 mt-0.5">ĐÃ HOÀN TẤT</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center px-1 text-[6px] text-slate-600 font-mono tracking-widest">
                            <span>TAP CHIP CARD</span>
                            <div className="flex gap-0.5">
                              <span className="w-0.5 h-0.5 rounded-full bg-slate-800" />
                              <span className="w-0.5 h-0.5 rounded-full bg-slate-800" />
                            </div>
                          </div>
                        </div>

                        {/* Simulation parameters */}
                        {posStatus === 'connected' && (
                          <div className="w-full mt-3 space-y-2">
                            {posSimulatedStep === 'idle' && (
                              <button
                                type="button"
                                onClick={() => setPosSimulatedStep('waiting')}
                                className="w-full h-8 bg-[#076EFF] hover:bg-[#0057D6] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors"
                              >
                                GỬI GIẢ LẬP GIAO DỊCH ({formatCurrency(parseInt(posSimulationAmount))})
                              </button>
                            )}

                            {posSimulatedStep === 'waiting' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPosSimulatedStep('authorizing');
                                  setTimeout(() => {
                                    setPosSimulatedStep('success');
                                    showToast('Giả lập quẹt thẻ POS thành công!', 'success');
                                  }, 1500);
                                }}
                                className="w-full h-8 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors animate-pulse"
                              >
                                GIẢ LẬP CHẠM THẺ ĐỂ QUẸT
                              </button>
                            )}

                            {posSimulatedStep === 'success' && (
                              <button
                                type="button"
                                onClick={() => setPosSimulatedStep('idle')}
                                className="w-full h-8 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors"
                              >
                                THỰC HIỆN LẠI GIẢ LẬP
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          )}

          {/* STEP 4: PRINTING SETUP */}
          {currentStep === 5 && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#EEF0F4] p-5">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-800 tracking-wide">
                    Thiết lập máy in các bộ phận
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Cấu hình thiết bị in hóa đơn và phiếu chế biến cho từng khu vực quầy / bếp / bar
                  </p>
                </div>
                {/* Dynamically add printer button */}
                <button
                  type="button"
                  onClick={() => setIsAddPrinterModalOpen(true)}
                  className="h-8 px-4 bg-[#076EFF] hover:bg-[#0057D6] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm thiết lập máy in
                </button>
              </div>

              {/* Stack of Horizontal Printer Rows */}
              <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto custom-scrollbar pr-1 pb-2 max-w-7xl mx-auto w-full">
                {printerSetups.map((p) => (
                  <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all duration-200">
                    {/* Left Section: Icon and Role info */}
                    <div className="flex items-center gap-3.5 min-w-[240px] md:w-1/3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        p.role === 'cashier' ? 'bg-blue-50 text-[#076EFF]' :
                        p.role === 'kitchen' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {p.role === 'cashier' ? <Printer className="w-5 h-5" /> :
                         p.role === 'kitchen' ? <Utensils className="w-5 h-5" /> :
                         <Wine className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-bold text-slate-800 tracking-wider">{p.name}</h4>
                        <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">{p.desc}</p>
                      </div>
                    </div>

                    {/* Right Section: Fields (Select, Search, Test Print) */}
                    <div className="flex flex-1 flex-wrap items-center gap-3 md:justify-end">
                      <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">Chọn máy in:</span>
                      
                      {/* Select printer dropdown */}
                      <div className="flex-1 min-w-[180px] max-w-[280px]">
                        <div className="relative">
                          <select
                            value={p.selectedPrinter}
                            onChange={(e) => updatePrinterSelection(p.id, e.target.value)}
                            className="w-full h-8 pl-3.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-bold text-slate-700 bg-white appearance-none cursor-pointer shadow-xs"
                          >
                            <option value="HP LaserJet 400 M401">HP LaserJet 400 M401</option>
                            <option value="HP LaserJet 400 M401 Bep">HP LaserJet 400 M401 Bep</option>
                            <option value="Epson-LAN-X90">Epson-LAN-X90</option>
                            <option value="PRINTER-POS80-A">PRINTER-POS80-A</option>
                            <option value="Không chọn">Không chọn</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Search Button */}
                      <button
                        type="button"
                        onClick={() => handleSearchPrinter(p.id)}
                        disabled={p.isSearching}
                        className="h-8 px-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0"
                      >
                        {p.isSearching ? (
                          <Loader2 className="w-3.5 h-3.5 text-[#076EFF] animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        Tìm máy in
                      </button>

                      {/* Print Test Button */}
                      <button
                        type="button"
                        onClick={() => handlePrintTest(p.name)}
                        disabled={p.selectedPrinter === 'Không chọn'}
                        className={`h-8 px-5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0 ${
                          p.selectedPrinter === 'Không chọn'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-[#076EFF] hover:bg-[#0057D6] text-white'
                        }`}
                      >
                        <Printer className="w-3.5 h-3.5" />
                        In thử
                      </button>

                      {/* Delete button for dynamically added printer setups */}
                      {p.id !== '1' && p.id !== '2' && p.id !== '3' && (
                        <button
                          type="button"
                          onClick={() => removePrinterSetup(p.id)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors shrink-0"
                          title="Xóa thiết lập máy in này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* DIALOG THÊM MÁY IN KHU VỰC */}
              <AnimatePresence>
                {isAddPrinterModalOpen && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsAddPrinterModalOpen(false)}
                      className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                    />

                    {/* Dialog Container */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-6 z-10"
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setIsAddPrinterModalOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Header */}
                      <div className="mb-5">
                        <h3 className="text-base font-bold text-slate-900">
                          Thêm thiết lập máy in
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Thêm cấu hình in ấn cho một khu vực bếp, bar hoặc quầy thu ngân mới.
                        </p>
                      </div>

                      {/* Form Body */}
                      <div className="space-y-4 mb-6">
                        {/* Tên khu vực/máy in */}
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#101828] block">
                            Tên thiết lập máy in / Khu vực <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newPrinterName}
                            onChange={(e) => setNewPrinterName(e.target.value)}
                            placeholder="Ví dụ: Máy in Bếp tầng 2, Bar ngoài trời..."
                            className="w-full h-8 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-bold text-slate-700 bg-white shadow-xs"
                          />
                        </div>

                        {/* Vai trò */}
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#101828] block">
                            Vai trò bộ phận <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={newPrinterRole}
                              onChange={(e) => setNewPrinterRole(e.target.value as any)}
                              className="w-full h-8 pl-3 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-bold text-slate-700 bg-white appearance-none cursor-pointer shadow-xs"
                            >
                              <option value="kitchen">Máy in Nhà bếp (Chế biến thức ăn)</option>
                              <option value="bar">Máy in Quầy Bar (Chế biến đồ uống)</option>
                              <option value="cashier">Máy in Thu ngân (In hóa đơn)</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Chọn máy in */}
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#101828] block">
                            Chọn thiết bị máy in
                          </label>
                          <div className="relative">
                            <select
                              value={newPrinterSelected}
                              onChange={(e) => setNewPrinterSelected(e.target.value)}
                              className="w-full h-8 pl-3 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-bold text-slate-700 bg-white appearance-none cursor-pointer shadow-xs"
                            >
                              <option value="HP LaserJet 400 M401">HP LaserJet 400 M401</option>
                              <option value="HP LaserJet 400 M401 Bep">HP LaserJet 400 M401 Bep</option>
                              <option value="Epson-LAN-X90">Epson-LAN-X90</option>
                              <option value="PRINTER-POS80-A">PRINTER-POS80-A</option>
                              <option value="Không chọn">Không chọn</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsAddPrinterModalOpen(false)}
                          className="h-8 min-w-[120px] px-8 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all"
                        >
                          Hủy bỏ
                        </button>
                        <button
                          type="button"
                          onClick={handleAddPrinterSetup}
                          className="h-8 min-w-[120px] px-8 bg-[#076EFF] hover:bg-[#0057D6] text-white rounded-lg text-xs font-bold transition-all"
                        >
                          Thêm mới
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* STEP 5: TAXES SETTINGS */}
          {currentStep === 1 && (
            <div className="flex-1 bg-[#F0F2F4] overflow-y-auto custom-scrollbar p-6 flex flex-col items-center">
              
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-[0_1px_2px_rgba(16,24,40,0.05)] w-full max-w-7xl space-y-8 animate-fade-in my-auto">
                <div>
                  <h2 className="text-[20px] font-bold text-[#101828] tracking-tight leading-tight">
                    Thiết lập phương pháp tính thuế
                  </h2>
                  <p className="text-sm text-[#717680] font-normal leading-relaxed mt-1.5">
                    Thiết lập phương pháp tính thuế giúp MISA CukCuk tự động cấu hình bảng tính thuế và nhóm ngành nghề phù hợp nhất với nhà hàng.
                  </p>
                </div>

                <div className="border-b border-[#E9EAEB]" />

                {/* Phần 1: Câu hỏi về mô hình đăng ký kinh doanh: Sẽ có 2 thẻ nằm ngang */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#101828] tracking-wider flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#245FDF] text-white text-[11px] font-semibold">1</span>
                    Mô hình đăng ký kinh doanh của bạn là gì?
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1: Doanh nghiệp / Công ty */}
                    <div
                      onClick={() => {
                        setBusinessModel('enterprise');
                        setGtgtTaxMethod('deduction');
                      }}
                      className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 flex items-start gap-4 relative ${
                        businessModel === 'enterprise'
                          ? 'border-[#245FDF] bg-[#F0F6FE] ring-1 ring-[#245FDF]/20 shadow-sm'
                          : 'border-[#D5D7DA] bg-white hover:border-[#245FDF] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        businessModel === 'enterprise' ? 'bg-[#245FDF] text-white' : 'bg-[#FAFAFA] text-[#717680]'
                      }`}>
                        <Building2 className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-sm font-bold text-[#101828] block">Doanh nghiệp / Công ty</span>
                        <span className="text-[11.5px] text-[#717680] font-normal leading-relaxed mt-1.5 block">
                          Áp dụng cho các công ty/doanh nghiệp có tư cách pháp nhân. Thường nộp thuế theo Phương pháp khấu trừ.
                        </span>
                      </div>
                      {businessModel === 'enterprise' && (
                        <div className="absolute top-4 right-4 text-[#245FDF]">
                          <CheckCircle2 className="w-5 h-5 fill-[#245FDF] text-white" />
                        </div>
                      )}
                    </div>

                    {/* Card 2: Hộ kinh doanh cá thể / Cá nhân */}
                    <div
                      onClick={() => {
                        setBusinessModel('individual');
                        setGtgtTaxMethod('direct');
                      }}
                      className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 flex items-start gap-4 relative ${
                        businessModel === 'individual'
                          ? 'border-[#245FDF] bg-[#F0F6FE] ring-1 ring-[#245FDF]/20 shadow-sm'
                          : 'border-[#D5D7DA] bg-white hover:border-[#245FDF] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        businessModel === 'individual' ? 'bg-[#245FDF] text-white' : 'bg-[#FAFAFA] text-[#717680]'
                      }`}>
                        <Store className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-sm font-bold text-[#101828] block">Cá nhân / Hộ kinh doanh</span>
                        <span className="text-[11.5px] text-[#717680] font-normal leading-relaxed mt-1.5 block">
                          Áp dụng cho các hộ kinh doanh gia đình, cá nhân kinh doanh tự do. Thường nộp thuế theo Phương pháp trực tiếp.
                        </span>
                      </div>
                      {businessModel === 'individual' && (
                        <div className="absolute top-4 right-4 text-[#245FDF]">
                          <CheckCircle2 className="w-5 h-5 fill-[#245FDF] text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#E9EAEB]" />

                {/* Phần 2: Hiển thị phương pháp tính thuế GTGT */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#101828] tracking-wider flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#245FDF] text-white text-[11px] font-semibold">2</span>
                    Phương pháp tính thuế GTGT áp dụng
                  </h3>

                  {/* 2 Tax method toggle options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div
                      onClick={() => setGtgtTaxMethod('deduction')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-start gap-3 relative ${
                        gtgtTaxMethod === 'deduction'
                          ? 'border-[#245FDF] bg-[#F0F6FE] ring-1 ring-[#245FDF]/20 shadow-xs'
                          : 'border-[#D5D7DA] bg-white hover:border-[#245FDF] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={gtgtTaxMethod === 'deduction'}
                        onChange={() => setGtgtTaxMethod('deduction')}
                        className="mt-0.5 w-4 h-4 text-[#245FDF] focus:ring-[#245FDF] border-slate-300 shrink-0"
                      />
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="text-xs font-bold text-[#101828] block">Phương pháp khấu trừ</span>
                        <span className="text-[10px] text-[#717680] font-normal leading-relaxed mt-1 block">
                          Phù hợp cho Doanh nghiệp nộp thuế GTGT dựa trên hóa đơn đầu vào - đầu ra (mức 5%, 8%, 10%).
                        </span>
                      </div>
                    </div>

                    <div
                      onClick={() => setGtgtTaxMethod('direct')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-start gap-3 relative ${
                        gtgtTaxMethod === 'direct'
                          ? 'border-[#245FDF] bg-[#F0F6FE] ring-1 ring-[#245FDF]/20 shadow-xs'
                          : 'border-[#D5D7DA] bg-white hover:border-[#245FDF] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={gtgtTaxMethod === 'direct'}
                        onChange={() => setGtgtTaxMethod('direct')}
                        className="mt-0.5 w-4 h-4 text-[#245FDF] focus:ring-[#245FDF] border-slate-300 shrink-0"
                      />
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="text-xs font-bold text-[#101828] block">Trực tiếp trên doanh thu</span>
                        <span className="text-[10px] text-[#717680] font-normal leading-relaxed mt-1 block">
                          Phù hợp cho Hộ kinh doanh nộp thuế theo tỷ lệ % khoán trực tiếp dựa trên doanh thu thực tế bán.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic sub-options depending on selected method */}
                  <div className="mt-3">
                    {gtgtTaxMethod === 'deduction' ? (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-[#F8F9FC] border border-[#E9EAEB] rounded-xl space-y-4 text-left"
                      >
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-[#245FDF] tracking-wider block">
                            Cấu hình mức thuế suất áp dụng
                          </span>
                          
                          <div className="flex flex-col gap-2.5">
                            <label className="flex items-center gap-3 cursor-pointer py-1 select-none">
                              <input
                                type="radio"
                                name="deductionTypeRadio"
                                checked={deductionType === 'multiple'}
                                onChange={() => setDeductionType('multiple')}
                                className="w-4.5 h-4.5 text-[#245FDF] focus:ring-[#245FDF] border-[#D5D7DA] bg-white cursor-pointer"
                              />
                              <span className="font-semibold text-[13px] text-[#101828]">Áp dụng nhiều mức thuế suất</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer py-1 select-none">
                              <input
                                type="radio"
                                name="deductionTypeRadio"
                                checked={deductionType === 'single'}
                                onChange={() => setDeductionType('single')}
                                className="w-4.5 h-4.5 text-[#245FDF] focus:ring-[#245FDF] border-[#D5D7DA] bg-white cursor-pointer"
                              />
                              <span className="font-semibold text-[13px] text-[#101828]">Chỉ áp dụng 1 mức thuế suất</span>
                            </label>
                          </div>

                          {deductionType === 'single' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="pt-4 mt-2 border-t border-slate-200/60 space-y-4"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-700">Mức thuế suất mặc định</span>
                                <div className="flex gap-2">
                                  {['5%', '8%', '10%'].map((rate) => (
                                    <button
                                      type="button"
                                      key={rate}
                                      onClick={() => setDeductionSingleRate(rate)}
                                      className={`px-4 h-8 text-xs font-bold rounded-lg transition-all duration-200 ${
                                        deductionSingleRate === rate
                                          ? 'bg-[#245FDF] text-white shadow-xs'
                                          : 'bg-white border border-[#D5D7DA] text-slate-600 hover:border-[#245FDF]'
                                      }`}
                                    >
                                      {rate}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <span className="text-xs font-bold text-slate-700">Giá thực đơn đã bao gồm VAT</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={menuPriceIncludesVat}
                                    onChange={(e) => setMenuPriceIncludesVat(e.target.checked)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#245FDF]"></div>
                                </label>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-[#F8F9FC] border border-[#E9EAEB] rounded-xl space-y-4 text-left"
                      >
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-[#245FDF] tracking-wider block">
                            Phương thức tính thuế TNCN
                          </span>
                          
                          <div className="flex flex-col gap-2.5">
                            <label className="flex items-center gap-3 cursor-pointer py-1 select-none">
                              <input
                                type="radio"
                                name="tncnMethodRadio"
                                checked={tncnMethod === 'percent_revenue'}
                                onChange={() => setTncnMethod('percent_revenue')}
                                className="w-4.5 h-4.5 text-[#245FDF] focus:ring-[#245FDF] border-[#D5D7DA] bg-white cursor-pointer"
                              />
                              <span className="font-semibold text-[13px] text-[#101828]">Theo tỷ lệ % trên doanh thu</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer py-1 select-none">
                              <input
                                type="radio"
                                name="tncnMethodRadio"
                                checked={tncnMethod === 'taxable_income'}
                                onChange={() => setTncnMethod('taxable_income')}
                                className="w-4.5 h-4.5 text-[#245FDF] focus:ring-[#245FDF] border-[#D5D7DA] bg-white cursor-pointer"
                              />
                              <span className="font-semibold text-[13px] text-[#101828]">Thu nhập tính thuế</span>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-[#717680] border-t border-[#E9EAEB] pt-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#717680] shrink-0" />
                  Hệ thống thiết lập mặc định các biểu thuế & phí tinh gọn, giúp chủ quán dễ dàng bắt đầu ngay.
                </div>
              </div>

            </div>
          )}

          {/* STEP 6: E-INVOICE SETTINGS */}
          {currentStep === 6 && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              
              {/* Header inside Step 6 */}
              <div className="shrink-0 px-6 py-3 border-b border-slate-200 bg-white flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-4 bg-[#016fbb] rounded-full"></span>
                  Phần mềm xuất hóa đơn
                </span>
                <div className="flex items-center gap-2">
                  <button className="h-8 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs font-bold flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Giúp
                  </button>
                  <button className="h-8 px-3 border border-slate-200 hover:bg-slate-50 text-[#016fbb] rounded text-xs font-bold flex items-center gap-1">
                    Phản hồi
                  </button>
                </div>
              </div>

              {/* Sub-Stepper header matching the stepper mockup - Compact Inline Style */}
              <div className="shrink-0 flex items-center justify-center py-2.5 px-6 border-b border-slate-100 bg-white">
                <div className="flex items-center justify-between w-full max-w-2xl text-xs">
                  {/* Step 1 */}
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all shrink-0 ${
                      invoiceSubStep >= 1 
                        ? 'bg-[#016fbb] border-[#016fbb] text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      {invoiceSubStep > 1 ? (
                        <Check className="w-3 h-3 text-white stroke-[3px]" />
                      ) : (
                        <span>1</span>
                      )}
                    </div>
                    <span className={`text-[12px] font-bold whitespace-nowrap transition-colors ${
                      invoiceSubStep === 1 ? 'text-[#016fbb]' : 'text-slate-500 font-medium'
                    }`}>
                      Phần mềm xuất hóa đơn
                    </span>
                  </div>

                  {/* Line 1-2 */}
                  <div className="flex-1 h-0.5 mx-3 bg-slate-100 relative max-w-[40px]">
                    <div className="absolute left-0 top-0 h-full bg-[#016fbb] transition-all duration-300" style={{ width: invoiceSubStep > 1 ? '100%' : '0%' }}></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all shrink-0 ${
                      invoiceSubStep >= 2 
                        ? 'bg-[#016fbb] border-[#016fbb] text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      {invoiceSubStep > 2 ? (
                        <Check className="w-3 h-3 text-white stroke-[3px]" />
                      ) : (
                        <span>2</span>
                      )}
                    </div>
                    <span className={`text-[12px] font-bold whitespace-nowrap transition-colors ${
                      invoiceSubStep === 2 ? 'text-[#016fbb]' : 'text-slate-500 font-medium'
                    }`}>
                      Thiết lập ký số tự động
                    </span>
                  </div>

                  {/* Line 2-3 */}
                  <div className="flex-1 h-0.5 mx-3 bg-slate-100 relative max-w-[40px]">
                    <div className="absolute left-0 top-0 h-full bg-[#016fbb] transition-all duration-300" style={{ width: invoiceSubStep > 2 ? '100%' : '0%' }}></div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all shrink-0 ${
                      invoiceSubStep >= 3 
                        ? 'bg-[#016fbb] border-[#016fbb] text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <span>3</span>
                    </div>
                    <span className={`text-[12px] font-bold whitespace-nowrap transition-colors ${
                      invoiceSubStep === 3 ? 'text-[#016fbb]' : 'text-slate-500 font-medium'
                    }`}>
                      Thiết lập khác
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-step view content */}
              <div className={`flex-1 ${invoiceOtpStep ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'} p-6 bg-white`}>
                
                {/* SUB-STEP 1 */}
                {invoiceSubStep === 1 && (
                  <div className="h-full flex flex-col justify-between">
                    {!invoiceOtpStep ? (
                      /* Credentials Login */
                      <div className="w-full flex items-center justify-center py-6 min-h-[320px]">
                        {!showConnectForm ? (
                          /* MISA meInvoice Landing Page exactly as requested */
                          <div className="flex flex-col items-center justify-center py-6 max-w-2xl mx-auto w-full text-center">
                            {/* Logo */}
                            <div className="flex items-center gap-3.5 justify-center mb-6">
                              <div className="w-14 h-14 rounded-full bg-[#076EFF] flex items-center justify-center shadow-md">
                                <svg className="w-10 h-10 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20,80 C35,80 45,60 55,40 C65,20 75,15 85,15" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                                  <path d="M15,55 C30,55 40,35 50,15 C60,-5 70,-10 80,-10" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.4" />
                                  <path d="M35,95 C50,95 60,75 70,55 C80,35 90,30 100,30" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
                                </svg>
                              </div>
                              <div className="flex flex-col items-start leading-none text-left">
                                <div className="flex items-baseline font-sans">
                                  <span className="text-2xl font-bold text-[#245FDF] tracking-tight">MISA </span>
                                  <span className="text-2xl font-bold text-[#0082FF] tracking-tight ml-1">meInvoice</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#717680] mt-1">Phần mềm hóa đơn điện tử</span>
                              </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-lg sm:text-[22px] font-bold text-[#101828] mb-4 tracking-tight leading-snug">
                              Kết nối phần mềm hoá đơn điện tử MISA meInvoice
                            </h2>

                            {/* Description */}
                            <p className="text-[13px] text-[#717680] leading-relaxed mb-8 max-w-xl">
                              <strong className="font-bold text-[#101828]">MISA meInvoice</strong> là phần mềm <strong className="font-bold text-[#101828]">Hóa đơn điện tử</strong> giúp nhà hàng lập, tra cứu, lưu trữ hóa đơn bằng các phương tiện điện tử thay thế hóa đơn giấy truyền thống. Từ đó giảm chi phí in ấn, lưu trữ an toàn, tra cứu dễ dàng...
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-4">
                              <a 
                                href="https://www.meinvoice.vn/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="h-10 px-8 border border-[#245FDF] text-[#245FDF] bg-white hover:bg-[#F0F6FE] transition-colors rounded-lg font-bold text-[13px] flex items-center justify-center shadow-2xs"
                              >
                                Đăng ký ngay
                              </a>
                              <button 
                                onClick={() => setShowConnectForm(true)}
                                className="h-10 px-8 bg-[#245FDF] hover:bg-[#1C4ED8] text-white transition-colors rounded-lg font-bold text-[13px] flex items-center justify-center shadow-md shadow-[#245FDF]/10"
                              >
                                Kết nối MISA meInvoice
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Credentials Login form, styled beautifully and matching */
                          <div className="w-full lg:w-[380px] bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm mx-auto">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Laptop className="w-4 h-4 text-[#245FDF]" />
                                <span className="text-[#101828] font-bold text-[13px] tracking-tight">Kết nối meInvoice</span>
                              </div>
                              <button 
                                onClick={() => setShowConnectForm(false)}
                                className="text-xs font-bold text-[#245FDF] hover:underline"
                              >
                                Quay lại
                              </button>
                            </div>

                            <p className="text-[11px] text-[#717680] leading-relaxed mb-4">
                              Vui lòng cung cấp thông tin tài khoản meInvoice của quý khách để thiết lập đồng bộ hóa đơn.
                            </p>

                            <div className="space-y-3.5">
                              <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold text-slate-700">Mã số thuế/CCCD <span className="text-red-500">*</span></label>
                                <input 
                                  type="text"
                                  className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#245FDF] text-xs font-bold shadow-2xs bg-white"
                                  value={taxCode}
                                  onChange={(e) => setTaxCode(e.target.value)}
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold text-slate-700">Tên đăng nhập <span className="text-red-500">*</span></label>
                                <input 
                                  type="text"
                                  className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#245FDF] text-xs font-bold shadow-2xs bg-white"
                                  value={meInvoiceUser}
                                  onChange={(e) => setMeInvoiceUser(e.target.value)}
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold text-slate-700">Mật khẩu <span className="text-red-500">*</span></label>
                                <input 
                                  type="password"
                                  className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#245FDF] text-xs font-bold shadow-2xs bg-white"
                                  value={meInvoicePass}
                                  onChange={(e) => setMeInvoicePass(e.target.value)}
                                />
                              </div>

                              <button 
                                onClick={() => {
                                  if (!taxCode || !meInvoiceUser || !meInvoicePass) {
                                    showToast('Vui lòng điền đầy đủ thông tin (*)', 'error');
                                    return;
                                  }
                                  setInvoiceOtpStep(true);
                                }}
                                className="w-full h-10 mt-2 bg-[#245FDF] hover:bg-[#1C4ED8] text-white rounded-lg font-bold text-xs transition-colors shadow-sm"
                              >
                                Kết nối tài khoản
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Step 1b: OTP Input Form (exactly matching OTP screen mockup) */
                      <div className="h-full flex flex-col justify-between -mx-6 -my-6 bg-white overflow-hidden">
                        {/* Centered Content Area */}
                        <div className="flex-1 overflow-hidden flex flex-col items-center justify-center px-6 py-4 max-w-2xl mx-auto w-full">
                          
                          {/* Envelope Icon */}
                          <div className="w-12 h-12 bg-[#F0F6FE] rounded-full flex items-center justify-center text-[#245FDF] mb-3 shadow-2xs">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>

                          {/* Title */}
                          <h2 className="text-[18px] font-bold text-[#101828] mb-1.5 tracking-tight text-center">
                            Xác thực tài khoản MISA meInvoice
                          </h2>

                          {/* Description */}
                          <p className="text-[13px] text-[#717680] leading-relaxed text-center mb-3 max-w-lg font-normal">
                            Mã xác thực OTP đã được gửi đến email đăng ký <strong className="font-bold text-[#101828]">anhduong.hn@misa.com.vn</strong>. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác) và nhập mã xác thực gồm 6 chữ số bên dưới.
                          </p>

                          {/* Wide centered input with dots placeholder */}
                          <div className="w-full max-w-sm mx-auto mb-3">
                            <input 
                              type="text"
                              maxLength={6}
                              placeholder="••••••"
                              className="w-full h-11 rounded-lg border border-slate-200 text-center tracking-[6px] text-[16px] text-[#101828] placeholder-slate-300 focus:outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] font-bold shadow-2xs bg-white"
                              value={invoiceOtp}
                              onChange={(e) => setInvoiceOtp(e.target.value)}
                            />
                          </div>

                          {/* Resend timer */}
                          <p className="text-[13px] text-[#717680] font-medium mb-3 text-center">
                            {otpSeconds > 0 ? `Gửi lại mã (${otpSeconds}s)` : 'Gửi lại mã'}
                          </p>

                          {/* Checkbox "Không hỏi lại trên thiết bị này" */}
                          <div className="flex items-center gap-3 justify-center">
                            <input 
                              id="dontAskOtpAgain"
                              type="checkbox"
                              checked={dontAskOtpAgain}
                              onChange={(e) => setDontAskOtpAgain(e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300 text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                            />
                            <label htmlFor="dontAskOtpAgain" className="text-[13px] text-[#101828] font-normal cursor-pointer select-none">
                              Không hỏi lại trên thiết bị này
                            </label>
                          </div>

                        </div>

                        {/* Bottom Actions Footer matching the mockup */}
                        <div className="h-16 bg-[#F8F9FA] border-t border-slate-100 px-6 flex items-center justify-between shrink-0 relative z-10">
                          {/* Left: Back Button */}
                          <button
                            onClick={() => setInvoiceOtpStep(false)}
                            className="flex items-center gap-2 text-[13px] font-bold text-[#101828] hover:text-[#245FDF] transition-colors"
                          >
                            <svg className="w-4 h-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            <span>Quay lại</span>
                          </button>

                          {/* Right: Action Buttons */}
                          <div className="flex items-center gap-5">
                            <button
                              onClick={() => showToast('Đã gửi yêu cầu gửi lại qua kênh khác', 'info')}
                              className="text-[13px] font-bold text-[#245FDF] hover:underline"
                            >
                              Thử cách khác
                            </button>
                            <button
                              onClick={() => {
                                if (!invoiceOtp) {
                                  showToast('Vui lòng nhập mã xác thực', 'error');
                                  return;
                                }
                                setInvoiceSubStep(2);
                                setInvoiceOtpStep(false);
                                showToast('Đã xác thực tài khoản MISA meInvoice thành công!', 'success');
                              }}
                              className="h-10 px-8 bg-[#245FDF] hover:bg-[#1C4ED8] text-white font-bold rounded-lg text-[13px] transition-colors shadow-sm flex items-center justify-center"
                            >
                              Xác thực
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}

                {/* SUB-STEP 2 */}
                {invoiceSubStep === 2 && (
                  <div className="flex flex-col justify-between h-full">
                    <div className="py-2">
                      <h4 className="text-center font-bold text-slate-800 text-xs mb-6">
                        Vui lòng chọn hình thức ký số
                      </h4>

                      <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto items-stretch justify-center">
                        
                        {/* MISA eSign Card */}
                        <div 
                          onClick={() => setSelectedSignType('esign')}
                          className={`flex-1 max-w-[340px] p-5 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                            selectedSignType === 'esign' 
                              ? 'border-[#016fbb] bg-white shadow-md' 
                              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                          }`}
                        >
                          <div className="absolute top-4 right-4">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              selectedSignType === 'esign' 
                                ? 'bg-[#016fbb] border-[#016fbb] text-white' 
                                : 'border-slate-300'
                            }`}>
                              {selectedSignType === 'esign' && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                                eSign
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-800 text-xs">MISA eSign</div>
                                <div className="text-[9px] text-slate-400 font-bold">Chữ ký số từ xa</div>
                              </div>
                            </div>

                            <span className="inline-block bg-[#f47a20] text-white text-[9px] font-black px-2 py-0.5 rounded">
                              Khuyến dùng
                            </span>

                            <div className="space-y-1">
                              <div className="font-bold text-slate-800 text-[11px]">Ký số từ xa MISA eSign</div>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                Hỗ trợ ký số hóa đơn điện tử mọi lúc, mọi nơi trực tiếp trên Cloud cực kỳ an toàn và ổn định.
                              </p>
                              <a href="#esign-guide" className="text-[11px] text-[#016fbb] font-bold hover:underline inline-block pt-1">
                                Xem hướng dẫn kết nối tại đây
                              </a>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center">
                            {esignConnected ? (
                              <div className="text-center w-full">
                                <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  {esignUser}
                                </div>
                                <div className="text-[10px] text-emerald-600 font-bold mt-1">Đã liên kết chứng thư số</div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEsignConnected(false);
                                    setIsCertSelected(false);
                                    showToast('Đã hủy kết nối MISA eSign', 'info');
                                  }}
                                  className="mt-3 px-3 py-1 border border-red-200 hover:bg-red-50 text-red-500 font-bold rounded text-[10px] transition-colors"
                                >
                                  Hủy kết nối
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEsignLoginOpen(true);
                                }}
                                className="w-full h-8.5 border border-[#016fbb] hover:bg-[#016fbb]/5 text-[#016fbb] font-black rounded text-[11px] transition-colors"
                              >
                                Kết nối MISA eSign
                              </button>
                            )}
                          </div>
                        </div>

                        {/* USB Token Card */}
                        <div 
                          onClick={() => setSelectedSignType('usb')}
                          className={`flex-1 max-w-[340px] p-5 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                            selectedSignType === 'usb' 
                              ? 'border-[#016fbb] bg-white shadow-md' 
                              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                          }`}
                        >
                          <div className="absolute top-4 right-4">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              selectedSignType === 'usb' 
                                ? 'bg-[#016fbb] border-[#016fbb] text-white' 
                                : 'border-slate-300'
                            }`}>
                              {selectedSignType === 'usb' && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
                                <Radio className="w-4 h-4 text-[#016fbb]" />
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-800 text-xs">Ký qua USB</div>
                                <div className="text-[9px] text-slate-400 font-bold">Cắm thiết bị token</div>
                              </div>
                            </div>

                            <div className="space-y-2 text-[11px] text-slate-500 leading-relaxed pt-2">
                              <p>- Thiết bị đang sử dụng phải cài đặt công cụ <span className="font-bold text-slate-800">MISA KYSO</span>. Vui lòng tải <a href="#kyso" className="text-[#016fbb] font-bold hover:underline">tại đây</a>.</p>
                              <p>- Cần cắm USB Token chứa chữ ký số khi thực hiện xuất hóa đơn.</p>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 italic">
                            * Phù hợp cho PC/Laptop thu ngân cố định tại quầy.
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Bottom buttons sub-step 2 */}
                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setInvoiceSubStep(1)} 
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Quay lại
                      </button>

                      <button
                        onClick={() => {
                          if (selectedSignType === 'esign' && !esignConnected) {
                            showToast('Vui lòng kết nối MISA eSign trước khi tiếp tục', 'error');
                            return;
                          }
                          setInvoiceSubStep(3);
                        }}
                        className="h-9 px-8 bg-[#016fbb] hover:bg-[#005ea2] text-white font-bold rounded text-xs transition-colors"
                      >
                        Tiếp tục
                      </button>
                    </div>

                  </div>
                )}

                {/* SUB-STEP 3 */}
                {invoiceSubStep === 3 && (
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col lg:flex-row items-stretch gap-8">
                      
                      {/* Left Side: Mockup Scroll */}
                      <div className="hidden lg:flex flex-col items-center justify-center border-r border-slate-100 pr-6 shrink-0 max-w-[280px] w-full">
                        <div className="relative w-48 h-32 bg-slate-800 rounded-xl p-2 shadow-lg flex flex-col justify-between">
                          <div className="flex-1 bg-gradient-to-tr from-[#016fbb] to-sky-600 rounded p-2 flex flex-col justify-between overflow-hidden relative">
                            <div className="flex justify-between items-center">
                              <div className="w-1 h-1 rounded-full bg-white/50"></div>
                              <div className="w-6 h-1.5 bg-white/20 rounded"></div>
                            </div>
                            <div className="bg-white rounded p-1 shadow-lg border border-slate-100 flex flex-col gap-1 w-2/3 mx-auto translate-y-3.5 border-dashed">
                              <div className="h-0.5 bg-slate-200 rounded w-1/2"></div>
                              <div className="h-0.5 bg-slate-100 rounded w-full"></div>
                              <div className="h-0.5 bg-slate-100 rounded w-5/6"></div>
                            </div>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-slate-600 mx-auto mt-0.5"></div>
                        </div>
                        <div className="w-54 h-2 bg-slate-600 rounded-b-xl relative shadow"></div>

                        <div className="mt-5 text-center text-[10px] text-slate-400 leading-relaxed max-w-[180px]">
                          Tự động phát hành HĐĐT ngay sau khi thanh toán, đồng bộ dữ liệu thời gian thực.
                        </div>
                      </div>

                      {/* Right Side: Options list exactly matching checklist mockup */}
                      <div className="flex-1 overflow-y-auto max-h-[460px] pr-2 custom-scrollbar">
                        <div className="space-y-4 text-xs font-sans">
                          
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-xs">Cấu hình xuất hóa đơn và gửi email</h4>
                          </div>

                          <div className="space-y-3 pt-1">
                            {/* 1 */}
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={showComboDetail}
                                onChange={(e) => setShowComboDetail(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-[#016fbb]"
                              />
                              <span className="text-slate-700 font-medium">Hiển thị chi tiết món trong combo trên HĐĐT</span>
                              <span className="text-blue-500 font-bold">ⓘ</span>
                            </label>

                            {/* 2 */}
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={autoSendInvoice}
                                onChange={(e) => setAutoSendInvoice(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-[#016fbb]"
                              />
                              <span className="text-slate-800 font-bold">Tự động gửi hóa đơn cho khách hàng</span>
                            </label>

                            {/* 3 */}
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={paymentFixedTmCk}
                                onChange={(e) => setPaymentFixedTmCk(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-[#016fbb]"
                              />
                              <span className="text-slate-700 font-medium">Hình thức thanh toán cố định là TM/CK</span>
                            </label>

                            {/* 4 */}
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={extraInvoiceInfo}
                                onChange={(e) => setExtraInvoiceInfo(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-[#016fbb]"
                              />
                              <span className="text-slate-700 font-medium">Thêm Thông tin mở rộng cho hóa đơn khi phát hành HĐĐT</span>
                              <span className="text-blue-500 font-bold">ⓘ</span>
                            </label>

                            {/* 5 */}
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={showStpvWithFee}
                                onChange={(e) => setShowStpvWithFee(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-[#016fbb]"
                              />
                              <span className="text-slate-700 font-medium">Hiển thị STPV có tính phí trên HĐĐT</span>
                            </label>

                            {/* 6 */}
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={showTipChange}
                                onChange={(e) => setShowTipChange(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-[#016fbb]"
                              />
                              <span className="text-slate-700 font-medium">Hiển thị tiền Khách tip/không lấy tiền thừa trên HĐĐT</span>
                            </label>

                            {/* 7 */}
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={showBilingual}
                                onChange={(e) => setShowBilingual(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-[#016fbb]"
                              />
                              <span className="text-slate-700 font-medium">Hiển thị tên món song ngữ trên HĐĐT</span>
                            </label>

                            {/* 8 */}
                            <label className="flex items-start gap-2.5 cursor-not-allowed opacity-50">
                              <input type="checkbox" disabled checked={allowGuestFill} className="mt-0.5 w-4 h-4 rounded" />
                              <span className="text-slate-700 font-medium">Cho phép khách tự điền thông tin xuất HĐĐT</span>
                            </label>

                            {/* 9 */}
                            <div className="flex items-center gap-2 pl-6 pt-0.5 text-[11px]">
                              <span className="text-slate-600 font-medium">Thiết lập thời gian hiệu lực mã QR Code nhập thông tin phát hành HĐĐT</span>
                              <input 
                                type="text" 
                                value={qrExpiryHours}
                                onChange={(e) => setQrExpiryHours(e.target.value)}
                                className="w-10 h-6 border border-slate-200 rounded text-center font-bold"
                              />
                              <span className="text-slate-600">giờ</span>
                            </div>

                            {/* 10 */}
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={allowEditDeleteInvoice}
                                onChange={(e) => setAllowEditDeleteInvoice(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-[#016fbb]"
                              />
                              <span className="text-slate-700 font-medium">Cho phép sửa/hủy hóa đơn bán hàng khi đã phát hành HDDT</span>
                            </label>

                            {/* 11 & Sub-options */}
                            <div className="space-y-2.5 pt-1.5">
                              <label className="flex items-start gap-2.5 cursor-pointer">
                                <input 
                                  type="checkbox"
                                  checked={issueFromPos}
                                  onChange={(e) => setIssueFromPos(e.target.checked)}
                                  className="mt-0.5 w-4 h-4 rounded text-[#016fbb]"
                                />
                                <span className="text-slate-800 font-extrabold">Phát hành hóa đơn điện tử từ máy tính tiền</span>
                              </label>

                              {issueFromPos && (
                                <div className="pl-6 space-y-2.5 border-l-2 border-slate-100/80 ml-2">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox"
                                      checked={defaultSelectTakeInvoice}
                                      onChange={(e) => setDefaultSelectTakeInvoice(e.target.checked)}
                                      className="w-3.5 h-3.5 text-[#016fbb]"
                                    />
                                    <span className="text-slate-600 font-medium">Mặc định tích chọn Khách lấy HĐ GTGT và Phát hành hóa đơn ngay</span>
                                    <span className="text-blue-500">ⓘ</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox"
                                      checked={defaultSignOnIssue}
                                      onChange={(e) => setDefaultSignOnIssue(e.target.checked)}
                                      className="w-3.5 h-3.5 text-[#016fbb]"
                                    />
                                    <span className="text-slate-600 font-medium">Mặc định ký hóa đơn khi phát hành hóa đơn điện tử từ máy tính tiền</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox"
                                      checked={autoIssueOnPay}
                                      onChange={(e) => setAutoIssueOnPay(e.target.checked)}
                                      className="w-3.5 h-3.5 text-[#016fbb]"
                                    />
                                    <span className="text-slate-600 font-medium">Tự động phát hành HĐĐT ngay sau khi thu tiền từ máy tính tiền</span>
                                    <span className="text-blue-500">ⓘ</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox"
                                      checked={alwaysSendEmail}
                                      onChange={(e) => setAlwaysSendEmail(e.target.checked)}
                                      className="w-3.5 h-3.5 text-[#016fbb]"
                                    />
                                    <span className="text-slate-600 font-medium">Luôn gửi email hóa đơn cho khách hàng</span>
                                  </label>
                                </div>
                              )}
                            </div>

                            {/* 12 */}
                            <div className="flex items-center gap-3 pl-6 pt-1">
                              <span className="text-slate-700 font-extrabold">Mẫu hóa đơn mặc định</span>
                              <select 
                                value={defaultInvoiceTemplate}
                                onChange={(e) => setDefaultInvoiceTemplate(e.target.value)}
                                className="h-8 px-2.5 border border-slate-200 bg-white rounded text-xs font-bold focus:outline-none focus:border-[#016fbb]"
                              >
                                <option value="1C26MHL">1C26MHL</option>
                                <option value="1C22MAB">1C22MAB</option>
                                <option value="2C23TBC">2C23TBC</option>
                              </select>
                            </div>

                            {/* 13 */}
                            <div className="pt-4 border-t border-slate-100 pl-6 space-y-3">
                              <h5 className="font-extrabold text-slate-800 text-[10px] tracking-wider">
                                Thông tin mặc định khi khách hàng không yêu cầu lấy hóa đơn điện tử
                              </h5>
                              
                              <div className="space-y-2.5 max-w-lg">
                                <div>
                                  <div className="text-slate-500 mb-1 text-[11px] font-bold">Tên khách hàng</div>
                                  <input 
                                    type="text"
                                    value={defCustomerName}
                                    onChange={(e) => setDefCustomerName(e.target.value)}
                                    className="w-full h-8 px-3 border border-slate-200 rounded text-xs text-slate-700"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <div className="text-slate-500 mb-1 text-[11px] font-bold">Tên công ty</div>
                                    <input 
                                      type="text"
                                      value={defCompanyName}
                                      onChange={(e) => setDefCompanyName(e.target.value)}
                                      className="w-full h-8 px-3 border border-slate-200 rounded text-xs text-slate-700"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-slate-500 mb-1 text-[11px] font-bold">Địa chỉ công ty</div>
                                    <input 
                                      type="text"
                                      value={defCompanyAddress}
                                      onChange={(e) => setDefCompanyAddress(e.target.value)}
                                      className="w-full h-8 px-3 border border-slate-200 rounded text-xs text-slate-700"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom buttons sub-step 3 */}
                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setInvoiceSubStep(2)} 
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Quay lại
                      </button>

                      <button
                        onClick={() => {
                          saveInvoiceSettings();
                          onComplete();
                        }}
                        className="h-10 px-10 bg-[#016fbb] hover:bg-[#005ea2] text-white font-black rounded text-xs flex items-center gap-1.5 shadow-md shadow-[#016fbb]/20 animate-bounce-short"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Hoàn thành
                      </button>
                    </div>

                  </div>
                )}

              </div>

              {/* HIGH FIDELITY POPUPS FOR MISA eSign CONNECTION */}
              <AnimatePresence>
                {/* eSign Login */}
                {esignLoginOpen && (
                  <div className="absolute inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setEsignLoginOpen(false)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
                    />

                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative z-[210] border border-slate-100 text-center"
                    >
                      <button 
                        onClick={() => setEsignLoginOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col items-center mb-5">
                        <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl p-2 flex items-center justify-center text-white text-base font-bold shadow-md shadow-indigo-500/10">
                          eSign
                        </div>
                        <div className="font-extrabold text-slate-800 text-sm mt-3">MISA eSign</div>
                        <p className="text-xs text-slate-500 mt-1">Đăng nhập để làm việc với <span className="font-bold">MISA eSign</span></p>
                      </div>

                      <div className="space-y-4 text-left">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Tên đăng nhập/Email</label>
                          <input 
                            type="text" 
                            className="w-full h-10 px-3 rounded border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            value={esignUser}
                            onChange={(e) => setEsignUser(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Mật khẩu</label>
                          <input 
                            type="password" 
                            className="w-full h-10 px-3 rounded border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            value={esignPass}
                            onChange={(e) => setEsignPass(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-2.5 pt-2">
                          <button
                            onClick={() => {
                              if (!esignUser || !esignPass) {
                                showToast('Vui lòng điền tài khoản & mật khẩu eSign', 'error');
                                  return;
                              }
                              setEsignLoginOpen(false);
                              setEsignCertOpen(true);
                              showToast('Đăng nhập eSign thành công!', 'success');
                            }}
                            className="flex-1 h-10 bg-[#1e70e4] hover:bg-[#155cb8] text-white font-extrabold rounded text-xs transition-colors shadow-sm"
                          >
                            Đăng nhập
                          </button>
                          <button className="w-10 h-10 border border-[#1e70e4] text-[#1e70e4] hover:bg-blue-50/50 rounded flex items-center justify-center transition-colors shrink-0">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                              <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </button>
                        </div>

                        <div className="text-center pt-1">
                          <a href="#forgot" className="text-xs text-[#1e70e4] font-bold hover:underline">Quên mật khẩu?</a>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                          <div className="text-center text-[10px] text-slate-400 font-sans mb-3">Hoặc đăng nhập với</div>
                          <div className="flex justify-center gap-4">
                            <button className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                              <span className="text-[10px] font-black text-red-500">G</span>
                            </button>
                            <button className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                              <span className="text-[9px] font-black text-blue-500">Zalo</span>
                            </button>
                            <button className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                              <span className="text-[10px] font-black text-slate-800">A</span>
                            </button>
                            <button className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                              <span className="text-[8px] font-black text-blue-600">MS</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Select Certificate */}
                {esignCertOpen && (
                  <div className="absolute inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setEsignCertOpen(false)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
                    />

                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden relative z-[210] border-2 border-[#016fbb]"
                    >
                      {/* Title Bar precisely matching the image header bar */}
                      <div className="bg-[#016fbb] px-4 py-2.5 flex justify-between items-center text-white">
                        <span className="text-xs font-black tracking-wider">Chọn chứng thư số</span>
                        <button 
                          onClick={() => setEsignCertOpen(false)}
                          className="text-white/80 hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Filter Search Table Body */}
                      <div className="p-4 bg-slate-100">
                        <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-inner">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                                <th className="p-2 border-r border-slate-200">Tên chứng thư</th>
                                <th className="p-2 border-r border-slate-200">Mã số thuế/CMND</th>
                                <th className="p-2 border-r border-slate-200">Tổ chức chứng thực</th>
                                <th className="p-2 border-r border-slate-200">Số serial</th>
                                <th className="p-2">Thời gian</th>
                              </tr>
                              <tr className="bg-white border-b border-slate-200">
                                <td className="p-1.5 border-r border-slate-200">
                                  <div className="relative">
                                    <span className="absolute left-1.5 top-1.5 text-slate-400 font-bold">*</span>
                                    <input type="text" placeholder="Tìm..." className="w-full h-7 pl-4 pr-1 border border-slate-200 rounded text-[11px]" />
                                  </div>
                                </td>
                                <td className="p-1.5 border-r border-slate-200">
                                  <div className="relative">
                                    <span className="absolute left-1.5 top-1.5 text-slate-400 font-bold">*</span>
                                    <input type="text" placeholder="Tìm..." className="w-full h-7 pl-4 pr-1 border border-slate-200 rounded text-[11px]" />
                                  </div>
                                </td>
                                <td className="p-1.5 border-r border-slate-200">
                                  <div className="relative">
                                    <span className="absolute left-1.5 top-1.5 text-slate-400 font-bold">*</span>
                                    <input type="text" placeholder="Tìm..." className="w-full h-7 pl-4 pr-1 border border-slate-200 rounded text-[11px]" />
                                  </div>
                                </td>
                                <td className="p-1.5 border-r border-slate-200">
                                  <div className="relative">
                                    <span className="absolute left-1.5 top-1.5 text-slate-400 font-bold">*</span>
                                    <input type="text" placeholder="Tìm..." className="w-full h-7 pl-4 pr-1 border border-slate-200 rounded text-[11px]" />
                                  </div>
                                </td>
                                <td className="p-1.5">
                                  <div className="relative">
                                    <span className="absolute left-1.5 top-1.5 text-slate-400 font-bold">*</span>
                                    <input type="text" placeholder="Tìm..." className="w-full h-7 pl-4 pr-1 border border-slate-200 rounded text-[11px]" />
                                  </div>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-blue-50/80 hover:bg-blue-100/50 cursor-pointer font-bold text-slate-800 transition-colors">
                                <td className="p-3.5 border-r border-slate-200/60">{selectedCert.name}</td>
                                <td className="p-3.5 border-r border-slate-200/60">{selectedCert.taxCode}</td>
                                <td className="p-3.5 border-r border-slate-200/60 text-slate-500 font-medium">{selectedCert.issuer}</td>
                                <td className="p-3.5 border-r border-slate-200/60 font-mono text-[10px] text-slate-500">{selectedCert.serial}</td>
                                <td className="p-3.5 text-slate-500 font-medium">{selectedCert.expiry}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-end gap-2.5 mt-4">
                          <button
                            onClick={() => {
                              setEsignConnected(true);
                              setIsCertSelected(true);
                              setEsignCertOpen(false);
                              showToast('Chứng thư số ' + selectedCert.name + ' đã được chọn!', 'success');
                            }}
                            className="h-8.5 px-5 bg-[#016fbb] hover:bg-[#005ea2] text-white font-bold rounded text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Check className="w-4 h-4 stroke-[3px]" /> Chọn
                          </button>
                          <button
                            onClick={() => setEsignCertOpen(false)}
                            className="h-8.5 px-5 bg-white border border-red-200 hover:bg-red-50 text-red-500 font-bold rounded text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <X className="w-4 h-4" /> Không
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>
          )}

        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="mt-3 shrink-0 flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-md">
          <button
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
            }}
            disabled={currentStep === 1}
            className="h-10 px-5 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold text-xs text-slate-600 flex items-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-white disabled:border-slate-100"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Quay lại
          </button>

          <div className="flex gap-3">
            {currentStep < 6 ? (
              <button
                onClick={() => {
                  if (currentStep === 1) {
                    saveTaxSettings();
                  } else if (currentStep === 2) {
                    setIsMenuSetup(true);
                  } else if (currentStep === 3) {
                    setIsTableSetup(true);
                  } else if (currentStep === 4) {
                    setIsPaymentSetup(true);
                  } else if (currentStep === 5) {
                    handleSavePrinterSetup();
                  }
                  setCurrentStep(currentStep + 1);
                }}
                className="h-10 px-7 bg-brand text-white hover:bg-brand-hover rounded-xl font-bold text-xs flex items-center gap-2 transition-all duration-200 shadow-lg shadow-brand/10 hover:shadow-brand/20 active:scale-98 group"
              >
                Tiếp theo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="h-10 px-8 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-bold text-xs flex items-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/15 active:scale-98 animate-pulse-subtle"
              >
                <CheckCircle2 className="w-4 h-4" />
                Hoàn tất & Khởi động POS bán hàng
              </button>
            )}
          </div>
        </div>

      </div>

      {/* HIGH FIDELITY DISH EDIT MODAL (SỬA MÓN) */}
      <AnimatePresence>
        {editingItem && (
          <div className="absolute inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop with elegant blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Tablet-optimized high-fidelity Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#EEF0F4] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[680px] z-10"
            >
              {/* Elegant header */}
              <div className="h-14 bg-[#076EFF] flex justify-between items-center px-6 shrink-0 text-white relative">
                <h3 className="font-black text-base tracking-wider">
                  Sửa thông tin món chi tiết (Tablet view)
                </h3>
                <button 
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* High-contrast tabs */}
              <div className="bg-white flex border-b border-slate-200 shrink-0 text-xs font-bold px-6">
                <button
                  type="button"
                  onClick={() => setEditActiveTab('info')}
                  className={`py-4 px-6 transition-all border-b-2 ${
                    editActiveTab === 'info' 
                      ? 'border-[#076EFF] text-[#076EFF] font-black' 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Thông tin chi tiết món
                </button>
                <button
                  type="button"
                  onClick={() => setEditActiveTab('amount')}
                  className={`py-4 px-6 transition-all border-b-2 ${
                    editActiveTab === 'amount' 
                      ? 'border-[#076EFF] text-[#076EFF] font-black' 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Định lượng nguyên vật liệu (NVL)
                </button>
              </div>

              {/* Tab Contents - Desktop/Tablet optimized 2-column layout */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24 custom-scrollbar">
                {editActiveTab === 'info' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Essential Food Info */}
                    <div className="space-y-4">
                      {/* Tên món */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1.5 shadow-sm">
                        <label className="text-[13px] font-bold text-slate-700 block">Tên món <span className="text-red-500">*</span></label>
                        <input
                          required
                          type="text"
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-bold text-slate-800"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </div>

                      {/* Loại món & Nhóm thực đơn */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1.5 shadow-sm">
                          <label className="text-[13px] font-bold text-slate-700 block">Loại món <span className="text-red-500">*</span></label>
                          <select
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-semibold text-slate-700 bg-white"
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                          >
                            <option value="Món ăn">Món ăn</option>
                            <option value="Đồ uống">Đồ uống</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1.5 shadow-sm relative">
                          <label className="text-[13px] font-bold text-slate-700 block">Nhóm thực đơn</label>
                          <div className="flex gap-1.5 items-center">
                            <select
                              className="flex-1 h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-semibold text-slate-700 bg-white"
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                            >
                              {availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                              className="w-8 h-8 shrink-0 bg-[#076EFF]/10 hover:bg-[#076EFF]/20 text-[#076EFF] rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {showAddCategoryInput && (
                            <div className="absolute right-4 bottom-16 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-20 w-52 space-y-2">
                              <label className="text-[11px] font-bold text-slate-500 block">Thêm nhóm thực đơn</label>
                              <input 
                                type="text" 
                                placeholder="Ví dụ: Tráng miệng, Hải sản..."
                                className="w-full h-8 px-2 border border-slate-200 rounded-lg text-xs"
                                value={newCategoryValue}
                                onChange={(e) => setNewCategoryValue(e.target.value)}
                              />
                              <div className="flex gap-2 justify-end">
                                <button 
                                  type="button"
                                  onClick={() => setShowAddCategoryInput(false)}
                                  className="text-[10px] font-bold text-slate-400 px-2 py-1"
                                >
                                  Hủy
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (newCategoryValue.trim() && !availableCategories.includes(newCategoryValue.trim())) {
                                      setAvailableCategories([...availableCategories, newCategoryValue.trim()]);
                                      setEditCategory(newCategoryValue.trim());
                                      setNewCategoryValue('');
                                      setShowAddCategoryInput(false);
                                      showToast('Đã thêm nhóm mới', 'success');
                                    }
                                  }}
                                  className="text-[10px] font-bold bg-[#076EFF] text-white px-2 py-1 rounded"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Giá món & Đơn vị tính */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1.5 shadow-sm">
                          <label className="text-[13px] font-bold text-slate-700 block">Giá món <span className="text-red-500">*</span></label>
                          <input
                            required
                            type="number"
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-black text-slate-800"
                            value={editPrice}
                            onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1.5 shadow-sm relative">
                          <label className="text-[13px] font-bold text-slate-700 block">Đơn vị tính <span className="text-red-500">*</span></label>
                          <div className="flex gap-1.5 items-center">
                            <select
                              className="flex-1 h-11 px-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-semibold text-slate-700 bg-white"
                              value={editUnit}
                              onChange={(e) => setEditUnit(e.target.value)}
                            >
                              {availableUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => setShowAddUnitInput(!showAddUnitInput)}
                              className="w-8 h-8 shrink-0 bg-[#076EFF]/10 hover:bg-[#076EFF]/20 text-[#076EFF] rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {showAddUnitInput && (
                            <div className="absolute right-4 bottom-16 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-20 w-48 space-y-2">
                              <label className="text-[11px] font-bold text-slate-500 block">Thêm đơn vị tính</label>
                              <input 
                                type="text" 
                                placeholder="Ví dụ: Ly, Thố, Tô..."
                                className="w-full h-8 px-2 border border-slate-200 rounded-lg text-xs"
                                value={newUnitValue}
                                onChange={(e) => setNewUnitValue(e.target.value)}
                              />
                              <div className="flex gap-2 justify-end">
                                <button 
                                  type="button"
                                  onClick={() => setShowAddUnitInput(false)}
                                  className="text-[10px] font-bold text-slate-400 px-2 py-1"
                                >
                                  Hủy
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (newUnitValue.trim() && !availableUnits.includes(newUnitValue.trim())) {
                                      setAvailableUnits([...availableUnits, newUnitValue.trim()]);
                                      setEditUnit(newUnitValue.trim());
                                      setNewUnitValue('');
                                      setShowAddUnitInput(false);
                                      showToast('Đã thêm đơn vị tính mới', 'success');
                                    }
                                  }}
                                  className="text-[10px] font-bold bg-[#076EFF] text-white px-2 py-1 rounded"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ảnh món */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-sm">
                        <label className="text-[13px] font-bold text-slate-700 block">Ảnh minh họa món</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center rounded-2xl overflow-hidden shrink-0">
                            {editImage ? (
                              <img src={editImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <UtensilsCrossed className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                          
                          <div className="flex gap-2 relative">
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowImagePicker(!showImagePicker)}
                                className="h-10 px-4 bg-white border border-[#076EFF] text-[#076EFF] font-bold text-xs rounded-xl hover:bg-blue-50/50 transition-colors"
                              >
                                Chọn ảnh đại diện
                              </button>
                              {showImagePicker && (
                                <div className="absolute left-0 top-11 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 w-72 grid grid-cols-4 gap-2">
                                  {foodImages.map((img, idx) => (
                                    <div 
                                      key={idx}
                                      onClick={() => {
                                        setEditImage(img.url);
                                        setShowImagePicker(false);
                                      }}
                                      className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:border-brand hover:scale-105 transition-all"
                                      title={img.label}
                                    >
                                      <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const randomIdx = Math.floor(Math.random() * foodImages.length);
                                setEditImage(foodImages[randomIdx].url);
                                showToast('Đã chọn ảnh mẫu từ thư viện!', 'success');
                              }}
                              className="h-10 w-10 bg-white border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors"
                              title="Ngẫu nhiên ảnh ngon mắt"
                            >
                              <Camera className="w-4 h-4 text-slate-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Tax Settings & Config */}
                    <div className="space-y-4">
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4 shadow-sm h-full">
                        <h4 className="text-[13px] font-black text-[#076EFF] tracking-wider border-b pb-2 border-slate-100 flex items-center gap-1.5">
                          <Percent className="w-4 h-4 text-[#076EFF]" />
                          Cấu hình Thuế & Phí dịch vụ
                        </h4>

                        {/* Kê khai thuế GTGT, TNCN */}
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-slate-600 block">Kê khai thuế cho món ăn này</label>
                          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                            <button
                              type="button"
                              onClick={() => {
                                setEditTaxDeclaration('Không chọn');
                                setEditTaxRateGTGT('Không chọn');
                                setEditTaxRateTNCN('Không chọn');
                              }}
                              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                                editTaxDeclaration === 'Không chọn'
                                  ? 'bg-white text-slate-800 shadow-sm'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Không áp dụng
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditTaxDeclaration('Có chọn');
                                if (editTaxRateGTGT === 'Không chọn') setEditTaxRateGTGT('8%');
                                if (editTaxRateTNCN === 'Không chọn') setEditTaxRateTNCN('1.5%');
                              }}
                              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                                editTaxDeclaration === 'Có chọn'
                                  ? 'bg-[#076EFF] text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Có kê khai thuế
                            </button>
                          </div>
                        </div>

                        {/* Tỷ lệ tính thuế GTGT (%) & TNCN */}
                        {editTaxDeclaration === 'Có chọn' && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 pt-2"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 block">Tỷ lệ thuế GTGT (%)</label>
                                <select
                                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-bold text-slate-700 bg-white"
                                  value={editTaxRateGTGT}
                                  onChange={(e) => setEditTaxRateGTGT(e.target.value)}
                                >
                                  <option value="Không chọn">Không chọn</option>
                                  <option value="5%">5%</option>
                                  <option value="8%">8% (Mức ưu đãi)</option>
                                  <option value="10%">10% (Tiêu chuẩn)</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 block">Tỷ lệ thuế TNCN (%)</label>
                                <select
                                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-xs font-bold text-slate-700 bg-white"
                                  value={editTaxRateTNCN}
                                  onChange={(e) => setEditTaxRateTNCN(e.target.value)}
                                >
                                  <option value="Không chọn">Không chọn</option>
                                  <option value="1%">1%</option>
                                  <option value="1.5%">1.5%</option>
                                  <option value="2%">2%</option>
                                </select>
                              </div>
                            </div>

                            {/* Món được giảm thuế GTGT Checkbox */}
                            <div className="flex items-start gap-2.5 pt-3 border-t border-slate-100">
                              <input
                                type="checkbox"
                                id="edit_is_reduced"
                                checked={editIsTaxReduced}
                                onChange={(e) => setEditIsTaxReduced(e.target.checked)}
                                className="w-4 h-4 mt-0.5 text-[#076EFF] border-slate-300 rounded focus:ring-[#076EFF]"
                              />
                              <label htmlFor="edit_is_reduced" className="text-[11px] text-slate-500 font-medium cursor-pointer select-none leading-relaxed">
                                Món ăn này thuộc diện được giảm thuế GTGT theo quy định mới nhất của Chính phủ (Nghị quyết giảm thuế).
                              </label>
                            </div>
                          </motion.div>
                        )}

                        {editTaxDeclaration !== 'Có chọn' && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-[11px] text-slate-400 font-medium">
                            Món ăn này sẽ không chịu các khoản thuế GTGT & TNCN khi thanh toán hóa đơn.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ĐỊNH LƯỢNG NVL - Tablet Optimized List */
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2 shadow-sm">
                      <h4 className="text-sm font-black text-slate-800">Nguyên vật liệu cấu thành 1 {editUnit} [{editName}]</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Thiết lập định lượng hao phí nguyên liệu thô để hệ thống tự động trừ kho nguyên liệu và tính toán chính xác biên lợi nhuận, giá vốn thực tế khi món ăn được phục vụ.
                      </p>
                    </div>

                    {/* High-fidelity table grid representing materials */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="grid grid-cols-12 gap-4 bg-slate-50 px-5 py-3 text-xs font-black text-slate-500 border-b border-slate-100">
                        <div className="col-span-6">Tên nguyên vật liệu thô</div>
                        <div className="col-span-3 text-right">Hao phí định mức</div>
                        <div className="col-span-3 text-center">Trạng thái</div>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {[
                          { name: 'Bánh phở tươi', amount: 0.22, unit: 'kg' },
                          { name: 'Thịt bò thăn lát mỏng', amount: 0.15, unit: 'kg' },
                          { name: 'Hành lá tươi', amount: 0.02, unit: 'kg' },
                          { name: 'Nước hầm xương bò', amount: 0.45, unit: 'lít' },
                          { name: 'Gia vị thảo mộc', amount: 0.01, unit: 'hộp' }
                        ].map((nvl, idx) => (
                          <div key={idx} className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center text-xs">
                            <div className="col-span-6 font-bold text-slate-700">{nvl.name}</div>
                            <div className="col-span-3 text-right font-black text-slate-800">
                              {nvl.amount} {nvl.unit}
                            </div>
                            <div className="col-span-3 flex justify-center">
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-full border border-emerald-100">
                                Đã thiết lập
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full h-11 border-2 border-dashed border-slate-300 hover:border-[#076EFF] text-slate-500 hover:text-[#076EFF] text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all bg-white"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm hao phí nguyên vật liệu mới
                    </button>
                  </div>
                )}
              </div>

              {/* Tablet Footer: Align buttons to the right, equal size, h-10, min-w-[120px], consistent spacing */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200/80 flex justify-end gap-3 shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="h-10 px-8 min-w-[120px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors active:scale-[0.98]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedItem}
                  className="h-10 px-8 min-w-[120px] bg-[#076EFF] hover:bg-[#0057D6] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/10 transition-colors active:scale-[0.98]"
                >
                  Lưu thay đổi
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-white text-xs font-bold ${
              toast.type === 'success' ? 'bg-slate-900 border-slate-800' : toast.type === 'info' ? 'bg-[#245FDF] border-[#1570EF]' : 'bg-red-500 border-red-400'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            ) : toast.type === 'info' ? (
              <Info className="w-4.5 h-4.5 text-white animate-bounce-subtle" />
            ) : (
              <ShieldAlert className="w-4.5 h-4.5 text-white" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TABLE DETAIL TABLET MODAL */}
      <AnimatePresence>
        {isTableDetailModalOpen && tableDetailModalData && (
          <div className="absolute inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTableDetailModalOpen(false)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl md:max-w-3xl bg-[#F0F2F4] rounded-2xl shadow-Large border border-[#D5D7DA] overflow-hidden flex flex-col h-[500px] z-10"
            >
              {/* Header */}
              <div className="h-12 bg-[#076EFF] text-white px-4 shrink-0 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <Tablet className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[13px] font-black tracking-wider">Cấu hình chi tiết bàn ăn</h2>
                    <p className="text-[10px] text-blue-100 font-normal">Quản lý sức chứa, hình dáng và tọa độ hiển thị bàn ăn</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsTableDetailModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Parameters form */}
                <div className="w-[320px] md:w-[350px] bg-white border-r border-[#E9EAEB] p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar shrink-0">
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-[#076EFF] tracking-wide border-b pb-1.5 border-slate-100">Thông tin bàn ăn</div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#101828]">Tên bàn ăn *</label>
                      <input 
                        type="text"
                        className="w-full h-8 px-3 rounded-lg border border-[#D5D7DA] focus:outline-none focus:border-[#076EFF] text-xs font-bold text-[#101828]"
                        value={tableDetailModalData.name}
                        onChange={(e) => setTableDetailModalData({ ...tableDetailModalData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#101828]">Khu vực / Tầng *</label>
                      <div className="relative">
                        <select 
                          className="w-full h-8 pl-3 pr-8 rounded-lg border border-[#D5D7DA] focus:outline-none focus:border-[#076EFF] text-xs font-semibold text-[#101828] bg-white appearance-none cursor-pointer"
                          value={tableDetailModalData.zone}
                          onChange={(e) => setTableDetailModalData({ ...tableDetailModalData, zone: e.target.value })}
                        >
                          {customZones.map(z => (
                            <option key={z} value={z}>{z}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#717680]">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#101828]">Số lượng ghế</label>
                        <div className="relative">
                          <select 
                            className="w-full h-8 pl-3 pr-8 rounded-lg border border-[#D5D7DA] focus:outline-none focus:border-[#076EFF] text-xs font-semibold text-[#101828] bg-white appearance-none cursor-pointer"
                            value={tableDetailModalData.seats || 4}
                            onChange={(e) => setTableDetailModalData({ ...tableDetailModalData, seats: parseInt(e.target.value) || 4 })}
                          >
                            <option value={2}>2 Ghế</option>
                            <option value={4}>4 Ghế</option>
                            <option value={6}>6 Ghế</option>
                            <option value={8}>8 Ghế</option>
                            <option value={10}>10 Ghế</option>
                            <option value={12}>12 Ghế</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#717680]">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#101828]">Hình dáng bàn</label>
                        <div className="relative">
                          <select 
                            className="w-full h-8 pl-3 pr-8 rounded-lg border border-[#D5D7DA] focus:outline-none focus:border-[#076EFF] text-xs font-semibold text-[#101828] bg-white appearance-none cursor-pointer"
                            value={tableDetailModalData.shape || 'round'}
                            onChange={(e) => setTableDetailModalData({ ...tableDetailModalData, shape: e.target.value })}
                          >
                            <option value="round">Hình Tròn</option>
                            <option value="square">Hình Vuông</option>
                            <option value="rectangular">Hình Dài</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#717680]">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-bold text-[#717680]">Trục X (%)</label>
                        <input 
                          type="number"
                          className="w-full h-8 px-3 rounded-lg border border-[#D5D7DA] text-xs font-mono font-bold bg-[#F2F4F7] text-[#101828]"
                          value={tableDetailModalData.x}
                          onChange={(e) => setTableDetailModalData({ ...tableDetailModalData, x: Math.max(5, Math.min(95, parseInt(e.target.value) || 50)) })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-bold text-[#717680]">Trục Y (%)</label>
                        <input 
                          type="number"
                          className="w-full h-8 px-3 rounded-lg border border-[#D5D7DA] text-xs font-mono font-bold bg-[#F2F4F7] text-[#101828]"
                          value={tableDetailModalData.y}
                          onChange={(e) => setTableDetailModalData({ ...tableDetailModalData, y: Math.max(5, Math.min(95, parseInt(e.target.value) || 50)) })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] font-bold text-[#101828] block">Trạng thái bàn ăn</label>
                      <button 
                        type="button"
                        onClick={() => setTableDetailModalData({ ...tableDetailModalData, active: !tableDetailModalData.active })}
                        className={`w-full h-8 border rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          tableDetailModalData.active !== false
                            ? 'bg-[#E8F8F0] border-[#A3E6C2] text-[#12B76A]'
                            : 'bg-[#F2F4F7] border-[#D5D7DA] text-[#717680]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${tableDetailModalData.active !== false ? 'bg-[#12B76A] animate-pulse' : 'bg-[#717680]'}`} />
                        {tableDetailModalData.active !== false ? 'SẴN SÀNG PHỤC VỤ (HOẠT ĐỘNG)' : 'TẠM KHÓA / BẢO TRÌ'}
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#717680] border-t border-[#E9EAEB] pt-2.5 flex items-center gap-1.5 mt-2">
                    <Info className="w-3.5 h-3.5 text-[#717680] shrink-0" />
                    Hiển thị trực tiếp trên sơ đồ POS.
                  </div>
                </div>

                {/* Right Side: Visual seat & coordinate layout preview */}
                <div className="flex-1 bg-[#FAFAFA] p-4 flex flex-col justify-center items-center overflow-hidden relative">
                  <div className="absolute top-3.5 left-4 text-[9px] font-bold text-slate-400 tracking-wider uppercase select-none">
                    Visual Seating Simulation & Position Map
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#D5D7DA] shadow-Small flex flex-col items-center max-w-xs w-full relative">
                    <div className="text-[10px] text-[#717680] font-bold mb-3 tracking-wider">
                      Bản vẽ phối cảnh 2D
                    </div>
                    
                    <div className="w-40 h-40 bg-[#FAFAFA] border border-[#E9EAEB] rounded-xl flex items-center justify-center relative shadow-inner mb-3.5">
                      {/* Central table shape rendering */}
                      <div className={`w-20 h-20 border-2 border-[#076EFF]/60 bg-[#076EFF]/5 flex flex-col items-center justify-center relative transition-all ${
                        tableDetailModalData.shape === 'round' ? 'rounded-full' : tableDetailModalData.shape === 'rectangular' ? 'rounded-lg w-28 h-12' : 'rounded-lg'
                      }`}>
                        <span className="text-[11px] font-bold text-[#076EFF] truncate max-w-[70px]">{tableDetailModalData.name}</span>
                        <span className="text-[8px] font-bold text-[#717680] font-mono mt-0.5">{tableDetailModalData.seats} GHẾ</span>
                      </div>

                      {/* Seating dots generated dynamically */}
                      {Array.from({ length: tableDetailModalData.seats || 4 }).map((_, i) => {
                        const total = tableDetailModalData.seats || 4;
                        const angle = (i * 360) / total;
                        const radius = tableDetailModalData.shape === 'rectangular' ? 44 : 52;
                        const rad = (angle * Math.PI) / 180;
                        const x = Math.cos(rad) * radius;
                        const y = Math.sin(rad) * radius;

                        return (
                          <div 
                            key={i}
                            className="absolute w-3.5 h-3.5 rounded-full bg-slate-200 border border-white shadow-xs flex items-center justify-center text-[7px] font-bold text-[#717680] transition-all"
                            style={{
                              transform: `translate(${x}px, ${y}px)`
                            }}
                          >
                            {i+1}
                          </div>
                        );
                      })}
                    </div>

                    <div className="w-full space-y-1 bg-[#F0F2F4] p-2 rounded-lg border border-[#E9EAEB] text-center">
                      <div className="text-[9px] font-bold text-[#717680] tracking-wider">Tọa độ trên sơ đồ [{tableDetailModalData.zone}]</div>
                      <div className="text-[11px] font-bold text-[#101828] font-mono">X: {tableDetailModalData.x}% • Y: {tableDetailModalData.y}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="h-12 bg-white border-t border-[#E9EAEB] px-4 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTableDetailModalOpen(false)}
                  className="h-8 px-6 min-w-[100px] bg-[#F2F4F7] hover:bg-[#E9EAEB] text-[#717680] font-bold text-xs rounded-lg transition-colors active:scale-[0.98]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Check duplicate name
                    const duplicate = customTables.some(
                      t => t.id !== tableDetailModalData.id && 
                      t.name.trim().toLowerCase() === tableDetailModalData.name.trim().toLowerCase() && 
                      t.zone === tableDetailModalData.zone
                    );
                    if (duplicate) {
                      showToast('Tên bàn đã tồn tại ở khu vực này!', 'error');
                      return;
                    }
                    setCustomTables(customTables.map(t => t.id === tableDetailModalData.id ? tableDetailModalData : t));
                    setIsTableDetailModalOpen(false);
                    showToast(`Đã lưu cấu hình chi tiết cho bàn ${tableDetailModalData.name}!`, 'success');
                  }}
                  className="h-8 px-6 min-w-[100px] bg-[#076EFF] hover:bg-[#0057D6] text-white font-bold text-xs rounded-lg transition-colors active:scale-[0.98]"
                >
                  Xác nhận lưu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. PAYMENT DETAIL TABLET MODAL */}
      <AnimatePresence>
        {isPaymentDetailModalOpen && paymentDetailModalData && (
          <div className="absolute inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentDetailModalOpen(false)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#EEF0F4] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[650px] z-10"
            >
              {/* Header */}
              <div className="h-16 bg-[#076EFF] text-white px-6 shrink-0 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-wider">Chi tiết tài khoản thanh toán & QR Code (Tablet View)</h2>
                    <p className="text-[10px] text-blue-100 font-medium font-sans">Cấu hình thông tin tài khoản ngân hàng nhận tiền thụ hưởng, đối soát dòng tiền tự động</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPaymentDetailModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-5 h-5 text-white rotate-45" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Parameters form */}
                <div className="w-[450px] bg-white border-r border-slate-200 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar shrink-0">
                  <div className="space-y-4">
                    <div className="text-xs font-black text-[#076EFF] tracking-wide border-b pb-2 border-slate-100">Thông tin thụ hưởng</div>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Ngân hàng thụ hưởng *</label>
                      <select 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand text-xs font-semibold bg-white"
                        value={paymentDetailModalData.bank}
                        onChange={(e) => setPaymentDetailModalData({ ...paymentDetailModalData, bank: e.target.value })}
                      >
                        <option value="vietcombank">Vietcombank (VCB)</option>
                        <option value="techcombank">Techcombank (TCB)</option>
                        <option value="bidv">BIDV Bank (BIDV)</option>
                        <option value="acb">ACB Bank (ACB)</option>
                        <option value="mbbank">MB Bank (MBB)</option>
                        <option value="vietinbank">VietinBank (CTG)</option>
                        <option value="tpbank">TPBank (TPB)</option>
                        <option value="agribank">Agribank (VBA)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Số tài khoản thụ hưởng *</label>
                      <input 
                        type="text"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand text-xs font-mono font-bold"
                        value={paymentDetailModalData.account}
                        onChange={(e) => setPaymentDetailModalData({ ...paymentDetailModalData, account: e.target.value.replace(/\D/g, '') })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Tên chủ tài khoản (Viết hoa không dấu) *</label>
                      <input 
                        type="text"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand text-xs font-bold uppercase"
                        value={paymentDetailModalData.holder}
                        onChange={(e) => setPaymentDetailModalData({ ...paymentDetailModalData, holder: e.target.value.toUpperCase() })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Loại tích hợp liên kết</label>
                      <input 
                        type="text"
                        disabled
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 text-slate-500"
                        value={paymentDetailModalData.type === 'jetpay' ? 'Kết nối Jetpay Bankhub Callback' : 'Mã VietQR Tĩnh Thông Thường'}
                      />
                    </div>

                    <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl space-y-1.5 text-[11px] text-slate-600 leading-relaxed">
                      <strong>💡 Kiểm thử thanh toán hóa đơn:</strong>
                      <p>Dữ liệu thụ hưởng này đã được đăng ký mã định danh ngân hàng an toàn. Mã QR đối ứng sẽ tự động cập nhật ngay lập tức ở bảng xem trước.</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    VietQR 2.0 chuẩn Napas đảm bảo chuyển tiền liên ngân hàng 24/7 lập tức.
                  </div>
                </div>

                {/* Right Side: Visual QR Card Preview */}
                <div className="flex-1 bg-slate-50 p-6 flex flex-col justify-center items-center overflow-hidden relative">
                  <div className="absolute top-4 left-6 text-[10px] font-black text-slate-300 tracking-widest uppercase select-none font-mono">
                    Dynamic VietQR Live Preview Screen
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg flex flex-col items-center max-w-sm w-full relative">
                    <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${paymentDetailModalData.type === 'jetpay' ? 'bg-[#076EFF]' : 'bg-emerald-500'} animate-pulse`} />
                        <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase font-mono">
                          {paymentDetailModalData.type === 'jetpay' ? 'JETPAY CLOUD INTEGRATED' : 'VIETQR STATIC STANDARD'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-brand text-white text-[8px] font-black rounded uppercase">
                        Active
                      </span>
                    </div>

                    {/* QR Preview box */}
                    <div className="w-52 h-52 bg-slate-50 rounded-2xl border border-slate-200/60 p-2.5 overflow-hidden flex items-center justify-center relative mb-4 shadow-inner">
                      <img 
                        src={`https://img.vietqr.io/image/${paymentDetailModalData.bank}-${paymentDetailModalData.account}-compact2.png?amount=0&addInfo=THANH%20TOAN%20CUKCUK`}
                        className="w-full h-full object-contain"
                        alt="VietQR Code"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg shadow-md border border-slate-100 flex items-center justify-center p-0.5">
                        <img 
                          src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=80&q=80" 
                          className="w-full h-full object-cover rounded" 
                        />
                      </div>
                    </div>

                    {/* Bank account details */}
                    <div className="space-y-1.5 w-full bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-center">
                      <div className="text-[9px] font-black text-slate-400 font-mono">
                        Ngân hàng {paymentDetailModalData.bank.toUpperCase()}
                      </div>
                      <div className="font-mono text-base font-black text-slate-800 tracking-wider">
                        {paymentDetailModalData.account.replace(/(\d{4})(?=\d)/g, '$1 ')}
                      </div>
                      <div className="text-[11px] font-bold text-[#076EFF] tracking-wide">
                        {paymentDetailModalData.holder}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="h-16 bg-white border-t border-slate-200 px-6 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPaymentDetailModalOpen(false)}
                  className="h-10 px-8 min-w-[120px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors active:scale-[0.98]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Update appropriate bank array
                    if (paymentDetailModalData.type === 'jetpay') {
                      setJetpayBanks(jetpayBanks.map(b => b.id === paymentDetailModalData.id ? paymentDetailModalData : b));
                    } else {
                      setStaticBanks(staticBanks.map(b => b.id === paymentDetailModalData.id ? paymentDetailModalData : b));
                    }
                    setSelectedPreviewBank(paymentDetailModalData);
                    setIsPaymentDetailModalOpen(false);
                    showToast(`Đã lưu thay đổi thông tin tài khoản thụ hưởng!`, 'success');
                  }}
                  className="h-10 px-8 min-w-[120px] bg-[#076EFF] hover:bg-[#0057D6] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/10 transition-colors active:scale-[0.98]"
                >
                  Xác nhận lưu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. POS CONFIGURATION TABLET MODAL */}
      <AnimatePresence>
        {isPosConfigModalOpen && (
          <div className="absolute inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosConfigModalOpen(false)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#EEF0F4] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[650px] z-10"
            >
              {/* Header */}
              <div className="h-16 bg-[#076EFF] text-white px-6 shrink-0 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-wider">Cấu hình liên kết thiết bị quẹt thẻ POS (Tablet View)</h2>
                    <p className="text-[10px] text-blue-100 font-medium font-sans font-sans">Kết nối thiết bị quẹt thẻ ATM, Visa nội bộ trực tiếp với phần mềm thanh toán hóa đơn</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPosConfigModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-5 h-5 text-white rotate-45" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Parameters form */}
                <div className="w-[450px] bg-white border-r border-slate-200 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar shrink-0">
                  <div className="space-y-4">
                    <div className="text-xs font-black text-[#076EFF] tracking-wide border-b pb-2 border-slate-100">Cấu hình phần cứng</div>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Nhà cung cấp POS *</label>
                      <select 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand text-xs font-semibold bg-white"
                        value={posBrand}
                        onChange={(e) => setPosBrand(e.target.value)}
                      >
                        <option value="smartpos">MISA SmartPOS</option>
                        <option value="payoo">Payoo POS Terminal</option>
                        <option value="nextpay">NextPay / SmartPOS</option>
                        <option value="mpos">mPOS.vn (VIMO)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Giao thức truyền dẫn *</label>
                      <select 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand text-xs font-semibold bg-white"
                        value={posConnType}
                        onChange={(e) => setPosConnType(e.target.value)}
                      >
                        <option value="ip">Wi-Fi (Giao thức TCP/IP mạng nội bộ)</option>
                        <option value="usb">Cáp USB vật lý (Virtual COM Port)</option>
                        <option value="bluetooth">Sóng Bluetooth không dây</option>
                      </select>
                    </div>

                    {posConnType === 'ip' ? (
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Địa chỉ IP thiết bị *</label>
                        <input 
                          type="text"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                          value={posIpAddress}
                          onChange={(e) => setPosIpAddress(e.target.value)}
                          placeholder="Ví dụ: 192.168.1.150"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Cổng kết nối ảo (COM) *</label>
                        <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold bg-white">
                          <option value="COM3">COM3 (USB Serial Driver)</option>
                          <option value="COM4">COM4 (USB Serial Driver)</option>
                          <option value="COM1">COM1 (Cổng DB9 truyền thống)</option>
                        </select>
                      </div>
                    )}

                    <div className="space-y-2 pt-2">
                      <label className="text-[11px] font-bold text-slate-600 block">Trạng thái kết nối phần cứng</label>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${posStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                        <span className="text-xs font-extrabold text-slate-700">
                          {posStatus === 'connected' ? 'Thiết bị sẵn sàng (Đã kết nối)' : 'Chưa liên kết được'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPosStatus('connecting');
                        showToast('Đang quét tín hiệu thiết bị POS...', 'info');
                        setTimeout(() => {
                          setPosStatus('connected');
                          showToast('Tích hợp kết nối thiết bị POS thành công!', 'success');
                        }, 1200);
                      }}
                      className="w-full h-10 border border-[#076EFF] hover:bg-blue-50 text-[#076EFF] text-xs font-bold rounded-lg transition-all"
                    >
                      DÒ TÌM & KẾT NỐI LẠI THIẾT BỊ
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Đồng bộ số tiền hóa đơn tức thì giúp hạn chế sai sót gõ nhầm số tiền.
                  </div>
                </div>

                {/* Right Side: POS Hardware Terminal & Simulation */}
                <div className="flex-1 bg-slate-50 p-6 flex flex-col justify-center items-center overflow-hidden relative">
                  <div className="absolute top-4 left-6 text-[10px] font-black text-slate-300 tracking-widest uppercase select-none font-mono">
                    Terminal Payment Simulator Screen
                  </div>

                  <div className="flex flex-col items-center w-full max-w-sm">
                    {/* POS physical block */}
                    <div className="w-[240px] bg-slate-900 rounded-[28px] p-3 pt-6 pb-8 shadow-2xl border-2 border-slate-800 flex flex-col gap-2 relative">
                      <div className="text-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        {posBrand.toUpperCase()} TERMINAL
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl flex flex-col gap-2 border border-slate-800">
                        <div className="flex justify-between items-center text-[7px] text-slate-500 font-mono">
                          <span>{posConnType === 'ip' ? posIpAddress : 'USB DRIVER'}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${posStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </div>

                        {/* Screen interface */}
                        <div className="bg-slate-900 rounded-lg p-3 min-h-[120px] text-center font-mono flex flex-col justify-between">
                          {posStatus !== 'connected' ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <ShieldAlert className="w-6 h-6 text-slate-600 mb-1" />
                              <div className="text-[9px] text-slate-400 font-bold uppercase">OFFLINE</div>
                            </div>
                          ) : posSimulatedStep === 'idle' ? (
                            <div className="flex-1 flex flex-col justify-between text-left">
                              <span className="text-[7px] text-slate-500">READY FOR ORDER</span>
                              <div className="py-2 text-center text-[10px] text-emerald-400 font-bold">POS sẵn sàng</div>
                              <span className="text-[7px] text-slate-600 text-center">CUKCUK v1.2</span>
                            </div>
                          ) : posSimulatedStep === 'waiting' ? (
                            <div className="flex-1 flex flex-col justify-between text-left">
                              <span className="text-[7px] text-slate-500">ORDER SUM SENT</span>
                              <div className="py-1 text-center">
                                <div className="text-[8px] text-slate-400">Cần thanh toán</div>
                                <div className="text-[12px] text-white font-extrabold mt-0.5">{formatCurrency(parseInt(posSimulationAmount))}</div>
                              </div>
                              <span className="text-[7px] text-amber-500 font-bold animate-pulse text-center">Xin mời chạm / quẹt thẻ</span>
                            </div>
                          ) : posSimulatedStep === 'authorizing' ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <Loader2 className="w-6 h-6 text-[#076EFF] animate-spin mb-1" />
                              <div className="text-[8px] text-[#076EFF] font-bold">Xác thực GD...</div>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col justify-between text-center">
                              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mt-2" />
                              <div className="text-[10px] text-emerald-400 font-bold mt-1">GD thành công</div>
                              <span className="text-[7px] text-slate-500 mt-1">Đã đóng hóa đơn</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center px-1 text-[7px] text-slate-600 font-mono tracking-widest">
                        <span>TAP CHIP CARD</span>
                        <div className="flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-slate-800" />
                          <span className="w-1 h-1 rounded-full bg-slate-800" />
                        </div>
                      </div>
                    </div>

                    {/* Simulation parameters */}
                    {posStatus === 'connected' && (
                      <div className="w-full mt-4 space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 font-sans">Số tiền thử nghiệm giả lập (VND)</label>
                          <input 
                            type="number"
                            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold text-right font-mono"
                            value={posSimulationAmount}
                            onChange={(e) => setPosSimulationAmount(e.target.value)}
                          />
                        </div>

                        <button
                          type="button"
                          disabled={posSimulating}
                          onClick={() => {
                            setPosSimulating(true);
                            setPosSimulatedStep('waiting');
                            showToast(`Đã đẩy số tiền ${formatCurrency(parseInt(posSimulationAmount))} sang máy POS...`, 'info');
                            
                            setTimeout(() => {
                              setPosSimulatedStep('authorizing');
                              setTimeout(() => {
                                setPosSimulatedStep('success');
                                setPosSimulating(false);
                                showToast('Giao dịch quẹt thẻ thành công! Đồng bộ đóng hóa đơn CUKCUK!', 'success');
                                setTimeout(() => {
                                  setPosSimulatedStep('idle');
                                }, 3000);
                              }, 1500);
                            }, 3000);
                          }}
                          className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow"
                        >
                          <CreditCard className="w-4 h-4" />
                          {posSimulating ? 'Đang chờ thanh toán...' : 'Đẩy lệnh giao dịch sang POS'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="h-16 bg-white border-t border-slate-200 px-6 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPosConfigModalOpen(false)}
                  className="h-10 px-8 min-w-[120px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPosConfigModalOpen(false);
                    showToast('Đã lưu cấu hình thiết bị quẹt thẻ POS thành công!', 'success');
                  }}
                  className="h-10 px-8 min-w-[120px] bg-[#076EFF] hover:bg-[#0057D6] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/10 transition-colors"
                >
                  Xác nhận kết nối
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-white text-xs font-bold ${
              toast.type === 'success' ? 'bg-slate-900 border-slate-800' : toast.type === 'info' ? 'bg-[#245FDF] border-[#1570EF]' : 'bg-red-500 border-red-400'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            ) : toast.type === 'info' ? (
              <Info className="w-4.5 h-4.5 text-white animate-bounce-subtle" />
            ) : (
              <ShieldAlert className="w-4.5 h-4.5 text-white" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
