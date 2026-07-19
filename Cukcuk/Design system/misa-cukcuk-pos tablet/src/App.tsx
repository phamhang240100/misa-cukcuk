import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AuthScreen from './components/AuthScreen';
import OnboardingScreen from './components/OnboardingScreen';
import AccountingScreen from './components/AccountingScreen';
import TourGuideScreen from './components/TourGuideScreen';
import InteractiveTour from './components/InteractiveTour';
import MisaAvaAssistant from './components/MisaAvaAssistant';
import CukCukLogo from './components/CukCukLogo';
import { 
  User, Clock, Tag, Compass, Receipt, Banknote, QrCode, SplitSquareHorizontal, Printer, XCircle, 
  CheckCircle2, ChevronRight, Info, PlusCircle, Trash2, Eye, RotateCw, Delete,
  Save, MoreHorizontal, NotebookPen, FileText, ChevronDown, CookingPot,
  CreditCard, Ticket, X, Check, Search, Bell, ArrowLeft, Minus, Plus, Send, Calculator, RefreshCw, ClipboardPlus, ArrowDownRight,
  Users, Gift, LayoutGrid, UtensilsCrossed, ClipboardList, LayoutDashboard, Phone, Sparkles,
  LogOut, Settings, HelpCircle, MoveRight, Truck, ShoppingBag, CalendarDays, Wallet, Coins, ChevronUp, Grip, Grid3x3, MapPin,
  Monitor, Globe, Smartphone, FileUp, History, CircleDollarSign, ChevronLeft, ChevronRightIcon, ChevronLeftIcon, CloudDownload, ShieldCheck, 
  Headset, BookOpen, MessageSquare, Star, ArrowUpCircle, PackagePlus, BarChart3, PackageX,
  Timer, ChefHat, Beer
} from 'lucide-react';

type PaymentMethodType = 'cash' | 'transfer' | 'card' | 'voucher';

const BILLING_BANKS = [
  { id: 'vietcombank', name: 'Vietcombank', code: 'VCB', logo: 'https://api.vietqr.io/img/VCB.png' },
  { id: 'techcombank', name: 'Techcombank', code: 'TCB', logo: 'https://api.vietqr.io/img/TCB.png' },
  { id: 'bidv', name: 'BIDV', code: 'BIDV', logo: 'https://api.vietqr.io/img/BIDV.png' },
  { id: 'acb', name: 'ACB', code: 'ACB', logo: 'https://api.vietqr.io/img/ACB.png' },
  { id: 'mbbank', name: 'MB Bank', code: 'MB', logo: 'https://api.vietqr.io/img/MB.png' },
  { id: 'vietinbank', name: 'VietinBank', code: 'CTG', logo: 'https://api.vietqr.io/img/ICB.png' },
  { id: 'tpbank', name: 'TPBank', code: 'TPB', logo: 'https://api.vietqr.io/img/TPB.png' },
  { id: 'agribank', name: 'Agribank', code: 'VBA', logo: 'https://api.vietqr.io/img/VBA.png' },
];
interface SplitPayment {
  id: string;
  type: PaymentMethodType;
  amount: number;
}

  type ScreenType = 'orderList' | 'order' | 'payment' | 'invoices' | 'tables' | 'reservations' | 'tourguide';

const TableIcon = ({ className = "w-4 h-4", strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path d="M21.1428 8V16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.14282 8V16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.1428 3L8.14282 3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.1428 21L8.14282 21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="6.14282" y="6" width="12" height="12" rx="3" stroke="currentColor" strokeWidth={strokeWidth}/>
    </g>
  </svg>
);

const mockStaff = [
  { id: 'S001', name: 'Nguyễn Minh Trí' },
  { id: 'S002', name: 'Trần Thị Kim Ngân' },
  { id: 'S003', name: 'Lê Hoàng Hải' },
  { id: 'S004', name: 'Phạm Minh Thư' },
  { id: 'S005', name: 'Đỗ Quốc Huy' },
];

const SearchableStaffSelect = ({ label, value, setValue, icon: Icon, placeholder }: { label: string, value: string, setValue: (val: string) => void, icon: any, placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredStaff = mockStaff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));
  const selectedStaff = mockStaff.find(s => s.id === value);

  return (
    <div className="relative">
      {label && <label className="text-sm font-bold text-slate-700 block mb-2">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1976D2] bg-white flex items-center cursor-pointer transition-all hover:border-brand/50"
      >
        <Icon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <span className={`text-[13px] ${selectedStaff ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
          {selectedStaff ? `${selectedStaff.name} (${selectedStaff.id})` : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-[111] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 h-[200px]">
            <div className="p-2 border-b border-slate-50 shrink-0">
              <div className="relative">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Tìm kiếm..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-100 focus:outline-none focus:border-brand text-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredStaff.map(s => (
                <div 
                  key={s.id}
                  onClick={() => {
                    setValue(s.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group ${value === s.id ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-700">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.id}</span>
                  </div>
                  {value === s.id && <Check className="w-4 h-4 text-brand" />}
                </div>
              ))}
              {filteredStaff.length === 0 && (
                <div className="p-4 text-center text-slate-400 text-xs italic">Không tìm thấy nhân viên</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function App() {
  // --- AUTHENTICATION & ONBOARDING STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Questionnaire states
  const [businessType, setBusinessType] = useState<string>('Cafe, trà sữa');
  const [orderMethod, setOrderMethod] = useState<string>('Khách ngồi tại bàn, có nhân viên phục vụ và thanh toán vào cuối bữa');
  const [kitchenDevice, setKitchenDevice] = useState<string>('Máy in');
  
  // Onboarding detailed configurations
  const [isMenuSetup, setIsMenuSetup] = useState(false);
  const [isTableSetup, setIsTableSetup] = useState(false);
  const [isPaymentSetup, setIsPaymentSetup] = useState(false);
  const [isPrinterSetup, setIsPrinterSetup] = useState(false);
  const [isTaxSetup, setIsTaxSetup] = useState(false);
  const [isInvoiceSetup, setIsInvoiceSetup] = useState(false);
  
  const [customMenuItems, setCustomMenuItems] = useState<any[]>([
    { id: 201, name: 'Cà phê Muối Sông Hồng (Mùa Thu)', price: 39000, category: 'Đồ uống đóng chai', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
    { id: 202, name: 'Cà phê Trứng Hà Nội (Mùa Đông)', price: 49000, category: 'Đồ uống đóng chai', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80' },
    { id: 203, name: 'Trà Đào Cam Sả Thảo Mộc (Mùa Hè)', price: 45000, category: 'Đồ uống đóng chai', image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80' },
    { id: 204, name: 'Trà Hoa Cúc Mật Ong Nhãn Nhục (Mùa Xuân)', price: 45000, category: 'Đồ uống đóng chai', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
    { id: 205, name: 'Cà phê cốt dừa đá xay', price: 39000, category: 'Đồ uống đóng chai', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80' },
    { id: 206, name: 'Bánh Tiramisu truyền thống', price: 45000, category: 'Khác', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
    { id: 207, name: 'Bánh Croissant bơ tỏi thơm nóng', price: 35000, category: 'Khác', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' }
  ]);
  const [paymentSettings, setPaymentSettings] = useState<any>({
    qrBank: 'vietcombank',
    qrAccount: '',
    qrName: ''
  });
  const [billingAccounts, setBillingAccounts] = useState<any[]>([
    { id: '1', bank: 'vietcombank', account: '190399887766', holder: 'CONG TY TNHH PHONG CACH AM THUC', active: true },
    { id: '2', bank: 'techcombank', account: '190222333444', holder: 'NGUYEN QUOC HUY', active: false }
  ]);
  const [isAddingBillingAccount, setIsAddingBillingAccount] = useState(false);
  const [selectedBillingBank, setSelectedBillingBank] = useState('');
  const [newBillingAccountNo, setNewBillingAccountNo] = useState('');
  const [newBillingAccountHolder, setNewBillingAccountHolder] = useState('');
  const [connectedPrinters, setConnectedPrinters] = useState<any[]>([]);
  const [taxSettings, setTaxSettings] = useState<any>({
    rate: 10,
    isIncluded: true
  });
  const [invoiceSettings, setInvoiceSettings] = useState<any>({
    username: '',
    taxCode: '',
    isConnected: true
  });
  
  // Custom Table configuration overrides
  const [customZones, setCustomZones] = useState<string[]>(['Tầng 1', 'Tầng 2']);
  const [customTables, setCustomTables] = useState<any[]>([
    // Tầng 1 (6 bàn, spacious layout)
    { id: '101', name: 'Bàn 101', zone: 'Tầng 1', status: 'empty', x: 18, y: 25 },
    { id: '102', name: 'Bàn 102', zone: 'Tầng 1', status: 'empty', x: 50, y: 25 },
    { id: '103', name: 'Bàn 103', zone: 'Tầng 1', status: 'empty', x: 82, y: 25 },
    { id: '104', name: 'Bàn 104', zone: 'Tầng 1', status: 'empty', x: 18, y: 65 },
    { id: '105', name: 'Bàn 105', zone: 'Tầng 1', status: 'empty', x: 50, y: 65 },
    { id: '106', name: 'Bàn 106', zone: 'Tầng 1', status: 'empty', x: 82, y: 65 },

    // Tầng 2 (6 bàn, spacious layout)
    { id: '201', name: 'Bàn 201', zone: 'Tầng 2', status: 'empty', x: 18, y: 25 },
    { id: '202', name: 'Bàn 202', zone: 'Tầng 2', status: 'empty', x: 50, y: 25 },
    { id: '203', name: 'Bàn 203', zone: 'Tầng 2', status: 'empty', x: 82, y: 25 },
    { id: '204', name: 'Bàn 204', zone: 'Tầng 2', status: 'empty', x: 18, y: 65 },
    { id: '205', name: 'Bàn 205', zone: 'Tầng 2', status: 'empty', x: 50, y: 65 },
    { id: '206', name: 'Bàn 206', zone: 'Tầng 2', status: 'empty', x: 82, y: 65 },
  ]);
  const [kitchenStations, setKitchenStations] = useState<any[]>([
    { id: 'ST01', name: 'Quầy Bánh', categories: ['Đồ ăn nhẹ', 'Khác'] },
    { id: 'ST02', name: 'Quầy Pha Chế', categories: ['Cà phê', 'Trà hoa quả', 'Đá xay', 'Đồ uống đóng chai'] }
  ]);

  // --- ACCOUNTING MODULE STATES ---
  const [showAccounting, setShowAccounting] = useState(false);
  const [showInteractiveTour, setShowInteractiveTour] = useState(false);
  const [interactiveTourStep, setInteractiveTourStep] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([
    { id: 'T001', type: 'receipt', category: 'Doanh thu bán hàng', amount: 1500000, description: 'Doanh thu bán lẻ ngày 01/07', date: '2026-07-01' },
    { id: 'T002', type: 'payment', category: 'Chi phí nguyên liệu', amount: 350000, description: 'Mua thịt bò hầm của cơ sở phân phối MISA', date: '2026-07-02' }
  ]);

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('tables');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('orderList');
  
  // --- ORDER LIST STATE ---
  const [orderListTab, setOrderListTab] = useState<'all' | 'table' | 'takeaway' | 'delivery' | 'online'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'waiting_payment' | 'draft' | 'serving'>('all');
  const [isCompactView, setIsCompactView] = useState(false);
  const [filterMyOrders, setFilterMyOrders] = useState(false);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  
  // --- DELIVERY FILTERS ---
  const [deliveryStatus, setDeliveryStatus] = useState<'all' | 'pending' | 'delivering' | 'completed' | 'cancelled'>('all');
  const [deliveryPartner, setDeliveryPartner] = useState('all');
  const [orderSource, setOrderSource] = useState('all');
  const [selectedOnlineOrder, setSelectedOnlineOrder] = useState<any | null>(null);
  const [activeOrderMenuId, setActiveOrderMenuId] = useState<string | null>(null);
  const [orderMenuPos, setOrderMenuPos] = useState({ x: 0, y: 0 });

  // --- TOAST STATE ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [orders, setOrders] = useState<any[]>([]);

  // --- PAYMENT STATE ---
  const [paymentTab, setPaymentTab] = useState<'cash' | 'transfer' | 'split' | 'wallet'>('cash');
  const [walletType, setWalletType] = useState('Momo');
  const [showWalletQRDialog, setShowWalletQRDialog] = useState(false);
  const [showFeeDetailDialog, setShowFeeDetailDialog] = useState(false);
  const [showTaxBreakdownDialog, setShowTaxBreakdownDialog] = useState(false);
  const [isServiceFeeEnabled, setIsServiceFeeEnabled] = useState(false);
  const [isRepayingDebt, setIsRepayingDebt] = useState(false);
  const [showPaymentCustomerDropdown, setShowPaymentCustomerDropdown] = useState(false);

  const [cashReceived, setCashReceived] = useState<number>(0);
  const [requireEInvoice, setRequireEInvoice] = useState(false);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const orderItemsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orderItemsScrollRef.current && currentScreen === 'order') {
      orderItemsScrollRef.current.scrollTo({
        top: orderItemsScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [orderItems.length, currentScreen]);

  useEffect(() => {
    const hasNew = orderItems.some(item => item.isNew);
    if (hasNew) {
      const timer = setTimeout(() => {
        setOrderItems(prev => prev.map(item => item.isNew ? { ...item, isNew: false } : item));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderItems]);
  const [showBuyerInfoDialog, setShowBuyerInfoDialog] = useState(false);
  const [buyerType, setBuyerType] = useState<'personal' | 'company'>('company');
  const [buyerInfo, setBuyerInfo] = useState({
    name: 'Trần Xuân Thịnh',
    idCard: '',
    address: '',
    phone: '',
    passport: '',
    taxId: '',
    email: '',
    note: '',
    recipient: ''
  });
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([
    { id: '1', type: 'cash', amount: 0 }
  ]);

  // --- INVOICE LIST STATE ---
  const [invoiceTab, setInvoiceTab] = useState<'list' | 'search'>('list');
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceDateFrom, setInvoiceDateFrom] = useState('2024-01-01');
  const [invoiceDateTo, setInvoiceDateTo] = useState('2024-01-31');

  // --- RESERVATION STATE ---
  const [reservationSearchQuery, setReservationSearchQuery] = useState('');
  const [reservationSourceFilter, setReservationSourceFilter] = useState('all');
  const [reservationDateFrom, setReservationDateFrom] = useState('17/04/2026');
  const [reservationDateTo, setReservationDateTo] = useState('17/04/2026');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showReservationDetail, setShowReservationDetail] = useState(false);
  const [showReservationReject, setShowReservationReject] = useState(false);
  const [reservationDetailTab, setReservationDetailTab] = useState('info');
  const [showAddReservation, setShowAddReservation] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableSeats, setNewTableSeats] = useState(4);
  const [newTableFloor, setNewTableFloor] = useState('Tầng 1');
  const [newTableRoom, setNewTableRoom] = useState('Trong nhà');
  const [isPickingTable, setIsPickingTable] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [reservationErrors, setReservationErrors] = useState<Record<string, string>>({});
  const [pickingTableNames, setPickingTableNames] = useState<string[]>([]);
  const [isPickingDishes, setIsPickingDishes] = useState(false);
  
  const startPickingTable = (res?: any) => {
    setIsPickingTable(true);
    setCurrentScreen('tables');
    
    let currentTableStr = '';
    if (res) {
      setSelectedReservation(res);
      currentTableStr = res.table || '';
    } else {
      currentTableStr = newReservation.table || '';
    }

    if (currentTableStr && currentTableStr !== 'Chưa xếp bàn') {
      const names = currentTableStr.split(',').map(s => s.replace('Bàn ', '').trim());
      setPickingTableNames(names.filter(n => n));
    } else {
      setPickingTableNames([]);
    }
  };
  const [orderBackup, setOrderBackup] = useState<{items: any[], orderId: string | null}>({ items: [], orderId: null });
  const [showPreorderItemSelect, setShowPreorderItemSelect] = useState(false);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string>('none');
  const [showPrinterDialog, setShowPrinterDialog] = useState(false);
  const [activePrinterRole, setActivePrinterRole] = useState<'cashier' | 'kitchen' | 'bar'>('cashier');
  const [expandedPrinterConfigRole, setExpandedPrinterConfigRole] = useState<'cashier' | 'kitchen' | 'bar' | null>(null);
  const [connectingPrinterRole, setConnectingPrinterRole] = useState<'cashier' | 'kitchen' | 'bar' | null>(null);
  const [printerPaperSize, setPrinterPaperSize] = useState<Record<string, string>>({ cashier: 'K80', kitchen: 'K80', bar: 'K58' });
  const [printerCopies, setPrinterCopies] = useState<Record<string, number>>({ cashier: 1, kitchen: 1, bar: 1 });
  const [printerFontSize, setPrinterFontSize] = useState<Record<string, string>>({ cashier: 'normal', kitchen: 'normal', bar: 'normal' });
  const [printerOptions, setPrinterOptions] = useState<Record<string, { printLogo: boolean; printQr: boolean }>>({
    cashier: { printLogo: true, printQr: false },
    kitchen: { printLogo: false, printQr: false },
    bar: { printLogo: false, printQr: false }
  });
  // --- QUICK CONTEXT SETUP STATES ---
  const [showQuickAddDishDialog, setShowQuickAddDishDialog] = useState(false);
  const [quickAddDishName, setQuickAddDishName] = useState('');
  const [quickAddDishPrice, setQuickAddDishPrice] = useState<number>(0);
  const [quickAddDishCategory, setQuickAddDishCategory] = useState('Cà phê');

  const [showMisaAlert, setShowMisaAlert] = useState(false);
  const [showQuickMisaInvoiceDialog, setShowQuickMisaInvoiceDialog] = useState(false);
  const [quickInvoiceStep, setQuickInvoiceStep] = useState<number>(1);
  const [quickInvoiceOtpStep, setQuickInvoiceOtpStep] = useState(false);
  const [quickTaxCode, setQuickTaxCode] = useState('');
  const [quickMeInvoiceUser, setQuickMeInvoiceUser] = useState('');
  const [quickMeInvoicePass, setQuickMeInvoicePass] = useState('');
  const [quickInvoiceOtp, setQuickInvoiceOtp] = useState('');
  const [quickSignType, setQuickSignType] = useState('esign');
  const [quickEsignConnected, setQuickEsignConnected] = useState(false);
  const [quickEsignUser, setQuickEsignUser] = useState('');
  const [quickEsignPass, setQuickEsignPass] = useState('');
  const [quickEsignLoginOpen, setQuickEsignLoginOpen] = useState(false);
  const [quickEsignCertOpen, setQuickEsignCertOpen] = useState(false);
  const [quickIsCertSelected, setQuickIsCertSelected] = useState(false);
  const [quickShowComboDetail, setQuickShowComboDetail] = useState(false);
  const [quickAutoSendInvoice, setQuickAutoSendInvoice] = useState(true);
  const [quickIssueFromPos, setQuickIssueFromPos] = useState(true);
  const [quickAutoIssueOnPay, setQuickAutoIssueOnPay] = useState(false);

  const [pendingActionInvoice, setPendingActionInvoice] = useState<any | null>(null);
  const [pendingActionPayment, setPendingActionPayment] = useState(false);

  const [isScanningPrinters, setIsScanningPrinters] = useState(false);
  const [quickPrinterConnectingId, setQuickPrinterConnectingId] = useState<string | null>(null);

  const handleConnectPrinter = (role: 'cashier' | 'kitchen' | 'bar') => {
    setConnectingPrinterRole(role);
    setTimeout(() => {
      setConnectingPrinterRole(null);
      const printerTemplates = {
        cashier: { id: 'pr_01', name: 'Máy in hóa đơn thu ngân (LAN/Wifi)', spec: 'K80 • IP: 192.168.1.200', type: 'LAN', role: 'cashier' },
        kitchen: { id: 'pr_02', name: 'Máy in nhà bếp Hotpot & Grill (LAN)', spec: 'K80 • IP: 192.168.1.201', type: 'LAN', role: 'kitchen' },
        bar: { id: 'pr_03', name: 'Máy in nhãn dán ly quầy Bar (USB)', spec: 'K58 • Cổng USB001', type: 'USB', role: 'bar' }
      };
      const newPrinter = printerTemplates[role];
      setConnectedPrinters(prev => {
        if (prev.some(p => p.id === newPrinter.id)) return prev;
        return [...prev, newPrinter];
      });
      setIsPrinterSetup(true);
      showToast(`Đã kết nối thành công: ${newPrinter.name}!`, 'success');
    }, 1000);
  };

  const handleDisconnectPrinter = (role: 'cashier' | 'kitchen' | 'bar') => {
    setConnectedPrinters(prev => {
      const filtered = prev.filter(p => p.role !== role);
      if (filtered.length === 0) {
        setIsPrinterSetup(false);
      }
      return filtered;
    });
    showToast('Đã ngắt kết nối máy in', 'success');
  };

  const [showOtherItemDialog, setShowOtherItemDialog] = useState(false);
  const [otherItemData, setOtherItemData] = useState({
    name: '',
    qty: 1,
    unit: 'Đĩa',
    price: 0,
    note: '',
    prepArea: 'Bếp'
  });

  const getTimeSlotLabel = (id: string) => {
    switch(id) {
      case 'morning': return 'Khung giờ sáng';
      case 'noon': return 'Khung giờ trưa';
      case 'evening': return 'Khung giờ tối';
      default: return 'Không áp dụng';
    }
  };

  const autoSelectTimeByCurrentTime = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const totalMin = h * 60 + m;

    if (totalMin >= 8 * 60 && totalMin <= 10 * 60) return 'morning';
    if (totalMin >= 11 * 60 + 1 && totalMin < 14 * 60) return 'noon';
    
    // User special rule: 2:00 PM (14:00) -> evening
    if (totalMin >= 14 * 60 && totalMin <= 23 * 60 + 45) return 'evening';
    
    return 'none';
  };
  const [guestKeypadValue, setGuestKeypadValue] = useState('');
  const [showItemQtyKeypad, setShowItemQtyKeypad] = useState(false);
  const [editingItemQty, setEditingItemQty] = useState<{id: any, instanceId?: string, name: string} | null>(null);
  const [itemQtyKeypadValue, setItemQtyKeypadValue] = useState('');
  const [isFirstInputItemQty, setIsFirstInputItemQty] = useState(true);
  const [isFirstInputGuest, setIsFirstInputGuest] = useState(true);

  const [showOrderSummaryDialog, setShowOrderSummaryDialog] = useState(false);
  const [activeSummaryTab, setActiveSummaryTab] = useState<'food' | 'beverage'>('food');
  const [newReservation, setNewReservation] = useState<{
    customer: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    table: string;
    customerNote: string;
    kitchenNote: string;
    salesPerson: string;
    depositAmount: number;
    depositMethod: string;
    preorderedDishes: any[];
  }>({
    customer: '',
    phone: '',
    date: '2026-04-18',
    time: '18:00',
    guests: 1,
    table: '',
    customerNote: '',
    kitchenNote: '',
    salesPerson: '',
    depositAmount: 0,
    depositMethod: 'cash',
    preorderedDishes: []
  });

  const [showMoreReservationFields, setShowMoreReservationFields] = useState(false);

  const [reservations, setReservations] = useState<any[]>([]);

  const [rejectReason, setRejectReason] = useState('');
  const [rejectMethod, setRejectMethod] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [rejectError, setRejectError] = useState(false);

  const [selectedArea, setSelectedArea] = useState('Tất cả');
  
  // --- INVOICE ISSUE MODAL STATE ---
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [currentOrderCustomer, setCurrentOrderCustomer] = useState<any>(null);
  const [customers, setCustomers] = useState([
    { id: 'C001', name: 'Hoàng Thị Lan Anh', phone: '0903.240.391', debt: 150000, points: 1250 },
    { id: 'C002', name: 'Nguyễn Văn Hùng', phone: '0988.111.222', debt: 0, points: 840 },
    { id: 'C003', name: 'Lê Thu Trang', phone: '0912.333.444', debt: 2500000, points: 3100 },
    { id: 'C004', name: 'Trần Minh Tâm', phone: '0977.555.666', debt: -50000, points: 500 },
    { id: 'C005', name: 'Nguyễn Hoàng Nam', phone: '0901234567', debt: 0, points: 450 },
    { id: 'C006', name: 'Trần Thị Thanh Thảo', phone: '0912345678', debt: 120000, points: 890 },
    { id: 'C007', name: 'Lê Minh Hải', phone: '0987654321', debt: 0, points: 120 },
    { id: 'C008', name: 'Phạm Thu Hà', phone: '0901231111', debt: 450000, points: 230 }
  ]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (currentOrderCustomer) {
      setOrderDrawerData(prev => ({ 
        ...prev, 
        customerPhone: currentOrderCustomer.phone,
        customerName: currentOrderCustomer.name 
      }));
    }
  }, [currentOrderCustomer]);

  const getItemPromotion = (itemName: string) => {
    const p1 = ["Đậu lướt ván", "Mực nướng sa tế", "tốm sú nướng mọi", "lẩu ớt măng cay"];
    const p2 = ["Lạc rang húng lìu", "Ngô chiên"];
    
    const lowerName = itemName.toLowerCase();
    if (lowerName === "đậu lướt ván") {
      return [
        { id: 'p1_auto', label: "10% - Giảm nhiệt mùa hè", discount: 0.1, type: 'percent' as const, isAuto: true },
        { id: 'p1_new', label: "Giảm 10.000đ cho khách hàng mới", discount: 10000, type: 'amount' as const },
        { id: 'p1_vip', label: "Giảm 20% với khách VIP", discount: 0.2, type: 'percent' as const }
      ];
    }

    if (p1.some(p => p.toLowerCase() === lowerName)) {
      return [{ id: 'p1', label: "10% - Giảm nhiệt mùa hè", discount: 0.1, type: 'percent' as const, isAuto: true }];
    }
    if (p2.some(p => p.toLowerCase() === lowerName)) {
      return [{ id: 'p2', label: "Tặng món - Uống tẹt ga không xa mồi nhậu", type: 'gift' as const, discount: 0, isAuto: true }];
    }
    return [];
  };

  const removePromotionFromItem = (instanceId: string) => {
    setOrderItems(items => items.map(item => {
      // Don't allow removing promotion if item is already processing
      if (item.instanceId === instanceId && item.isProcessing) {
        return item;
      }
      return (item.instanceId === instanceId) 
        ? { ...item, isPromoRemoved: true } 
        : item;
    }));
  };

  const [selectedInvoiceForIssue, setSelectedInvoiceForIssue] = useState<any>(null);
  const [issueFormData, setIssueFormData] = useState({
    invoiceType: 'MTT',
    invoiceDate: '17/04/2026',
    series: '1C26MAH',
    customerName: 'Khách lẻ không lấy hóa đơn',
    sendToCustomer: false,
    recipientName: '',
    recipientEmail: '',
    signDigital: false,
    signingMethod: 'usb'
  });
  const [issueFormErrors, setIssueFormErrors] = useState<{ [key: string]: string }>({});

  // --- CUSTOMER EDIT MODAL STATE ---
  const [isCustomerEditOpen, setIsCustomerEditOpen] = useState(false);
  const [customerEditType, setCustomerEditType] = useState<'individual' | 'business'>('individual');
  const [customerEditData, setCustomerEditData] = useState({
    taxCode: '',
    buyerName: '',
    address: '',
    phone: '',
    passport: '',
    organizationName: '',
    budgetRelationCode: ''
  });
  const [customerEditErrors, setCustomerEditErrors] = useState<{ [key: string]: string }>({});

  const [mockInvoices, setMockInvoices] = useState<any[]>([]);

  // --- ITEM ACTIONS STATE ---
  const [activeItemActionMenuId, setActiveItemActionMenuId] = useState<string | null>(null);
  
  // Cancel Item Dialog
  const [showCancelItemDialog, setShowCancelItemDialog] = useState(false);
  const [itemToCancel, setItemToCancel] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('Khách đợi lâu');
  const [otherReason, setOtherReason] = useState('');

  // Transfer Item Dialog
  const [showTransferItemDialog, setShowTransferItemDialog] = useState(false);
  const [itemToTransfer, setItemToTransfer] = useState<any>(null);
  const [targetOrderId, setTargetOrderId] = useState<string | null>(null);

  // Promotion Dialog State
  const [showAppliedPromosDialog, setShowAppliedPromosDialog] = useState(false);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [viewingPromoDetail, setViewingPromoDetail] = useState<any | null>(null);
  const [selectedPromoIds, setSelectedPromoIds] = useState<string[]>([]);
  const [appliedOrderPromos, setAppliedOrderPromos] = useState<any[]>([]);

  const mockPromotions = [
    { 
      id: 'km1', 
      name: 'Giảm giá 10% - Menu Mùa Hè', 
      type: 'discount_item',
      target: 'Tất cả khách hàng',
      startDate: '01/04/2026',
      endDate: '31/08/2026',
      activeDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
      timeSlots: ['Cả ngày'],
      condition: 'Áp dụng cho các món trong danh mục Mùa Hè',
      description: 'Giảm giá trực tiếp trên món ăn x 10%',
      itemsList: [
        { itemName: 'Đậu lướt ván', discountValue: 10, discountType: 'percent', maxUsage: 5 },
        { itemName: 'Mực nướng sa tế', discountValue: 10, discountType: 'percent', maxUsage: 2 },
        { itemName: 'Tôm sú nướng mọi', discountValue: 10, discountType: 'percent', maxUsage: 2 }
      ]
    },
    { 
      id: 'km2', 
      name: 'Khách hàng thân thiết - Giảm 50.000đ', 
      type: 'discount_bill',
      target: 'Hạng thẻ Thân thiết',
      startDate: '01/01/2026',
      endDate: '31/12/2026',
      activeDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'],
      timeSlots: ['Trưa', 'Tối'],
      condition: 'Hóa đơn từ 500.000đ trở lên',
      description: 'Giảm 50k trên tổng hóa đơn',
      itemsList: [
        { itemName: 'Toàn bộ thực đơn', discountValue: 50000, discountType: 'amount', maxUsage: 1 }
      ]
    },
    { 
      id: 'km3', 
      name: 'Mua 2 Tặng 1 - Bia hơi Hà Nội', 
      type: 'gift_item',
      target: 'Tất cả khách hàng',
      startDate: '15/04/2026',
      endDate: '15/05/2026',
      activeDays: ['Thứ 7', 'Chủ nhật'],
      timeSlots: ['Tối'],
      condition: 'Mua 2 cốc bia hơi tặng 1 cốc',
      description: 'Tặng 1 món Bia hơi Hà Nội',
      itemsList: [
        { itemName: 'Bia hơi Hà Nội', discountValue: 100, discountType: 'percent', maxUsage: 3 }
      ]
    }
  ];

  // --- TABLE MAP STATE ---
  const [activeFloor, setActiveFloor] = useState('Tầng 1');
  const [activeRoom, setActiveRoom] = useState('Tất cả');
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tableFilter, setTableFilter] = useState<'all' | 'empty' | 'serving' | 'reserved' | 'waiting_payment' | 'upcoming_reservation'>('all');
  const [tableDetailType, setTableDetailType] = useState<'time' | 'guests' | 'staff' | 'amount'>('time');

  const [tablesList, setTablesList] = useState<any[]>(() => {
    return [
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `${101 + i}`,
        name: `Bàn ${101 + i}`,
        status: 'empty',
        seats: 4,
        type: 'square',
        floor: 'Tầng 1',
        room: 'Trong nhà'
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `${201 + i}`,
        name: `Bàn ${201 + i}`,
        status: 'empty',
        seats: 4,
        type: 'square',
        floor: 'Tầng 2',
        room: 'Trong nhà'
      }))
    ];
  });

  useEffect(() => {
    if (customTables && customTables.length > 0) {
      setTablesList(customTables.map(t => ({
        id: t.id,
        name: t.name,
        status: t.status || 'empty',
        seats: t.seats || 4,
        type: t.type || 'square',
        floor: t.zone || 'Tầng 1',
        room: t.room || 'Trong nhà'
      })));
    }
  }, [customTables]);

  const mockTables = tablesList;

  const [fee10Enabled, setFee10Enabled] = useState(true);
  const [feeOtherEnabled, setFeeOtherEnabled] = useState(true);
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [taxGTGTEnabled, setTaxGTGTEnabled] = useState(true);

  const basePrice = 280000;
  const promoDiscount = 73000;
  const feeSpecial = 10000;
  const fee10Value = 28000;
  const feeOtherValue = 20000;
  const taxTTDB = 15000;
  const taxGTGTValue = 28000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Math.round(amount));
  };
  // ==========================================
  // RENDER RESERVATIONS SCREEN
  // ==========================================
  const StatusBadge = ({ status, type = 'reservation' }: { status: string, type?: 'reservation' | 'invoice' | 'einvoice' }) => {
    const baseClasses = "px-4 py-1.5 rounded-[16px] text-sm font-medium border inline-flex items-center gap-1.5";
    
    if (type === 'invoice') {
      switch (status) {
        case 'paid': return (
          <span className={`${baseClasses} bg-emerald-50 text-emerald-600 border-emerald-100`}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            Đã thu tiền
          </span>
        );
        case 'debt': return (
          <span className={`${baseClasses} bg-orange-50 text-orange-600 border-orange-100`}>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            Ghi nợ
          </span>
        );
        case 'cancelled': return (
          <span className={`${baseClasses} bg-red-50 text-red-600 border-red-100`}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            Đã hủy
          </span>
        );
        default: return null;
      }
    }

    if (type === 'einvoice') {
      const issued = status === 'issued';
      return (
        <span className={`px-4 py-1.5 rounded-[16px] text-sm font-medium inline-flex items-center gap-1.5 border ${
          issued 
            ? 'bg-blue-50 text-blue-600 border-blue-100' 
            : 'bg-slate-50 text-slate-400 border-slate-200'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${issued ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
          {issued ? 'Đã phát hành' : 'Chưa phát hành'}
        </span>
      );
    }

    switch (status) {
      case 'pending': return (
        <span className={`${baseClasses} bg-orange-50 text-orange-600 border-orange-100`}>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
          Chờ xác nhận
        </span>
      );
      case 'confirmed': return (
        <span className={`${baseClasses} bg-blue-50 text-blue-600 border-blue-100`}>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          Chờ nhận bàn
        </span>
      );
      case 'rejected': return (
        <span className={`${baseClasses} bg-red-50 text-red-600 border-red-100`}>
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          Từ chối
        </span>
      );
      case 'seated': return (
        <span className={`${baseClasses} bg-emerald-50 text-emerald-600 border-emerald-100`}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          Đã nhận bàn
        </span>
      );
      default: return null;
    }
  };

  const handleAddPreorderItem = (item: any) => {
    if (showAddReservation) {
      setNewReservation(prev => ({
        ...prev,
        preorderedDishes: [...(prev.preorderedDishes || []), { ...item, qty: 1, note: '' }]
      }));
    } else if (selectedReservation) {
      setSelectedReservation((prev: any) => ({
        ...prev,
        preorderedDishes: [...(prev.preorderedDishes || []), { ...item, qty: 1, note: '' }]
      }));
    }
    showToast(`Đã thêm ${item.name}`);
  };

  const handleUpdatePreorderQty = (index: number, delta: number) => {
    if (showAddReservation) {
      setNewReservation(prev => {
        const updated = [...(prev.preorderedDishes || [])];
        updated[index].qty = Math.max(1, updated[index].qty + delta);
        return { ...prev, preorderedDishes: updated };
      });
    } else if (selectedReservation) {
      if (selectedReservation.status === 'seated') {
        showToast('Không thể chỉnh sửa món của đặt chỗ đã nhận bàn', 'error');
        return;
      }
      setSelectedReservation((prev: any) => {
        const updated = [...(prev.preorderedDishes || [])];
        updated[index].qty = Math.max(1, updated[index].qty + delta);
        return { ...prev, preorderedDishes: updated };
      });
    }
  };

  const handleRemovePreorderItem = (index: number) => {
    if (showAddReservation) {
      setNewReservation(prev => ({
        ...prev,
        preorderedDishes: (prev.preorderedDishes || []).filter((_, i) => i !== index)
      }));
    } else if (selectedReservation) {
      if (selectedReservation.status === 'seated') {
        showToast('Không thể xóa món của đặt chỗ đã nhận bàn', 'error');
        return;
      }
      setSelectedReservation((prev: any) => ({
        ...prev,
        preorderedDishes: (prev.preorderedDishes || []).filter((_, i) => i !== index)
      }));
    }
  };

  const calculatePreorderTotal = (dishes: any[] | undefined) => {
    if (!dishes) return 0;
    return dishes.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
  };

  const handleCheckIn = (res: any, chosenTables?: string) => {
    const tableStr = chosenTables || res.table || '';
    if (!tableStr || tableStr === 'Chưa xếp bàn') {
      // Cần chọn bàn trước
      setIsCheckingIn(true);
      startPickingTable(res);
      setShowReservationDetail(false);
      return;
    }

    // Tạo đơn hàng mới từ đặt chỗ
    const newOrder: any = {
      id: Date.now().toString(),
      channel: 'table',
      tables: tableStr.split(',').map(s => s.replace('Bàn ', '').trim()),
      orderNo: (orders.length + 20).toString(), 
      amount: calculatePreorderTotal(res.preorderedDishes || []),
      customer: res.customer,
      phone: res.phone,
      guests: res.guests,
      dishes: (res.preorderedDishes || []).length,
      time: '0h 01\'',
      minutes: 1,
      status: 'serving',
      isSentToKitchen: (res.preorderedDishes || []).length > 0,
      items: (res.preorderedDishes || []).map((d: any, i: number) => ({
        ...d,
        instanceId: `${d.id}-${Date.now()}-${i}`,
        addons: d.addons || [],
        note: d.note || '',
        isProcessing: true,
        round: 1
      }))
    };

    setOrders([newOrder, ...orders]);
    setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: 'seated', table: tableStr } : r));
    setShowReservationDetail(false);
    setIsCheckingIn(false);
    showToast(`Nhận bàn ${tableStr} thành công cho khách ${res.customer}`);
  };

  const handleSaveReservationEdits = () => {
    if (!selectedReservation) return;
    
    // Validate
    const errors: Record<string, string> = {};
    if (!selectedReservation.customer) errors.customer = 'Họ tên không được để trống';
    if (!selectedReservation.phone) errors.phone = 'Số điện thoại không được để trống';
    if (!selectedReservation.arrivalDate) errors.arrivalDate = 'Ngày đến không được để trống';
    if (!selectedReservation.arrivalTime) errors.arrivalTime = 'Giờ đến không được để trống';

    if (Object.keys(errors).length > 0) {
      setReservationErrors(errors);
      showToast('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    setReservationErrors({});
    setReservations(prev => prev.map(r => r.id === selectedReservation.id ? selectedReservation : r));
    showToast('Đã lưu thay đổi đặt chỗ');
  };

  const handleSaveReservation = () => {
    // Validate
    const errors: Record<string, string> = {};
    if (!newReservation.customer) errors.customer = 'Họ tên không được để trống';
    if (!newReservation.phone) errors.phone = 'Số điện thoại không được để trống';
    if (!newReservation.date) errors.date = 'Ngày đến không được để trống';
    if (!newReservation.time) errors.time = 'Giờ đến không được để trống';

    if (Object.keys(errors).length > 0) {
      setReservationErrors(errors);
      showToast('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    setReservationErrors({});
    const reservationData = {
      id: `DC${Date.now().toString().slice(-6)}`,
      source: 'pos' as 'pos' | 'website',
      createdAt: new Date().toLocaleString(),
      createDate: new Date().toLocaleDateString(),
      createTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      table: newReservation.table || 'Chưa xếp bàn',
      customer: newReservation.customer,
      phone: newReservation.phone,
      arrivalDate: newReservation.date,
      arrivalTime: newReservation.time,
      arrivalDateTime: `${newReservation.date} ${newReservation.time}`,
      guests: newReservation.guests,
      status: (newReservation.table ? 'confirmed' : 'pending') as 'pending' | 'confirmed' | 'rejected' | 'seated',
      note: newReservation.customerNote,
      customerNote: newReservation.customerNote,
      kitchenNote: newReservation.kitchenNote,
      salesPerson: newReservation.salesPerson,
      depositAmount: newReservation.depositAmount,
      depositMethod: newReservation.depositMethod,
      email: '',
      preorderedDishes: newReservation.preorderedDishes || [],
      history: [
        { time: new Date().toLocaleString(), action: 'Tạo đặt chỗ mới tại POS', user: 'Quầy thu ngân' }
      ]
    };

    setReservations([reservationData, ...reservations]);
    setShowAddReservation(false);
    setReservationErrors({});
    setNewReservation({
      customer: '', phone: '', date: '2026-04-18', time: '18:00',
      guests: 1, table: '', customerNote: '', kitchenNote: '', salesPerson: '', 
      depositAmount: 0, depositMethod: 'cash', preorderedDishes: []
    });
    setShowMoreReservationFields(false);
    showToast('Đã thêm đặt chỗ thành công');
  };

  const renderReservationsScreen = () => {
    return (
      <div className="flex-1 flex flex-col bg-background overflow-hidden relative">
        {/* Filter Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Tìm theo số điện thoại, tên khách hàng" 
              className="w-full h-10 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-all"
              value={reservationSearchQuery}
              onChange={(e) => setReservationSearchQuery(e.target.value)}
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative w-44">
            <select className="w-full h-10 pl-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal appearance-none focus:outline-none focus:border-brand transition-colors">
              <option>Tất cả trạng thái</option>
              <option>Chờ xác nhận</option>
              <option value="confirmed">Chờ nhận bàn</option>
              <option>Từ chối</option>
              <option>Đã nhận bàn</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative w-40">
            <select 
              value={reservationSourceFilter}
              onChange={(e) => setReservationSourceFilter(e.target.value)}
              className="w-full h-10 pl-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal appearance-none focus:outline-none focus:border-brand transition-colors"
            >
              <option value="all">Tất cả nguồn</option>
              <option value="pos">Tại POS</option>
              <option value="website">Từ Website</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative w-40">
            <select 
              className="w-full h-10 pl-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal appearance-none focus:outline-none focus:border-brand transition-colors"
            >
              <option>Hôm nay</option>
              <option>Tuần này</option>
              <option>Tháng này</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button 
              onClick={() => {
                setSelectedReservation(null);
                setNewReservation({
                  customer: '',
                  phone: '',
                  date: new Date().toISOString().split('T')[0],
                  time: '18:30',
                  guests: 2,
                  table: '',
                  note: '',
                  preorderedDishes: []
                });
                setShowAddReservation(true);
              }}
              className="px-4 h-10 flex items-center gap-2 bg-brand text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Thêm đặt chỗ
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 tracking-wider">Nguồn</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 tracking-wider">Thời gian</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 tracking-wider">Mã đặt chỗ</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 tracking-wider">Ngày đến</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 tracking-wider">Số lượng khách</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 tracking-wider">Tiền cọc</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 tracking-wider">Chức năng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
      {reservations.filter(res => {
                const matchesSource = reservationSourceFilter === 'all' || res.source === reservationSourceFilter;
                const q = reservationSearchQuery.toLowerCase();
                const matchesSearch = 
                  res.customer.toLowerCase().includes(q) || 
                  res.phone.includes(q) ||
                  (q.length >= 4 && res.phone.replace(/\D/g, '').endsWith(q));
                return matchesSource && matchesSearch;
              }).map(res => (
                <tr key={res.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-100 transition-all group-hover:bg-white group-hover:scale-110">
                      {res.source === 'website' ? (
                        <Globe className="w-5 h-5 text-brand" />
                      ) : (
                        <Monitor className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-slate-800">{res.createTime}</div>
                    <div className="text-sm text-slate-400 font-normal">{res.createDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-brand uppercase tracking-tighter cursor-pointer hover:underline" onClick={() => { setSelectedReservation(res); setShowReservationDetail(true); }}>{res.id}</div>
                    <div className="text-sm text-slate-400 font-normal">{res.table}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-slate-800">{res.customer}</div>
                    <div className="text-sm text-slate-400 font-normal">{res.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-slate-800">{res.arrivalDateTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5 font-normal text-slate-800 text-sm">
                      <Users className="w-4 h-4 text-slate-300" /> {res.guests}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {res.depositAmount > 0 ? (
                      <div>
                        <div className="text-sm font-bold text-brand">{formatCurrency(res.depositAmount)}</div>
                        <div className="text-sm text-slate-400 font-medium">
                          {res.depositMethod === 'cash' ? 'Tiền mặt' : res.depositMethod === 'transfer' ? 'Chuyển khoản' : 'Quẹt thẻ'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={res.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {res.status === 'pending' && (
                        <button 
                          onClick={() => { setSelectedReservation(res); setShowReservationDetail(true); }}
                          title="Xác nhận"
                          className="w-11 h-11 flex items-center justify-center text-brand border border-brand/20 bg-white hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                      {res.status === 'confirmed' && (
                        <button 
                          onClick={() => {
                            setSelectedReservation(res);
                            setShowReservationDetail(true);
                            handleCheckIn(res);
                          }}
                          title="Nhận bàn"
                          className="w-11 h-11 flex items-center justify-center text-teal-600 border border-teal-200 bg-white hover:bg-teal-50 rounded-xl transition-all shadow-sm"
                        >
                          <UtensilsCrossed className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="h-12 border-t border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-700">Tổng số: {reservations.length}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Số dòng/trang</span>
              <select className="h-10 border border-slate-200 rounded px-2 text-xs font-bold outline-none bg-white">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <div className="text-xs font-bold text-slate-600">
              1 - {reservations.length}
            </div>
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand transition-colors"><ChevronLeftIcon className="w-4 h-4" />|<div className="sr-only">First</div></button>
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand transition-colors"><ChevronRight className="w-4 h-4" /></button>
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand transition-colors"><ChevronRightIcon className="w-4 h-4" />|<div className="sr-only">Last</div></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [lastInteractedOrderId, setLastInteractedOrderId] = useState<string | null>(null);

  // Helper to compare addons
  const areAddonsEqual = (a1: any[], a2: any[]) => {
    const list1 = a1 || [];
    const list2 = a2 || [];
    if (list1.length !== list2.length) return false;
    const sorted1 = [...list1].sort((a, b) => a.name.localeCompare(b.name));
    const sorted2 = [...list2].sort((a, b) => a.name.localeCompare(b.name));
    return sorted1.every((addon, idx) => 
      addon.name === sorted2[idx].name && addon.qty === sorted2[idx].qty
    );
  };

  // Centralized merge logic for order items
  const mergeDraftItems = (items: any[]) => {
    const result: any[] = [];
    items.forEach(newItem => {
      // Only merge items in round 0 (draft)
      if (newItem.round !== 0) {
        result.push(newItem);
        return;
      }

      const existingIdx = result.findIndex(item => 
        item.round === 0 &&
        item.id === newItem.id &&
        (item.note || '') === (newItem.note || '') &&
        areAddonsEqual(item.addons, newItem.addons)
      );

      if (existingIdx > -1) {
        // Merge! 
        const isNewItemBeingCustomized = customizingItem && 
          ((newItem.instanceId && newItem.instanceId === customizingItem.instanceId) || (!newItem.instanceId && newItem.id === customizingItem.id));
        
        const mergedItem = {
          ...result[existingIdx],
          qty: result[existingIdx].qty + newItem.qty,
          isNew: result[existingIdx].isNew || newItem.isNew
        };

        if (isNewItemBeingCustomized) {
          mergedItem.instanceId = newItem.instanceId;
        }

        result[existingIdx] = mergedItem;
      } else {
        result.push(newItem);
      }
    });
    return result;
  };
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentOrderChannel, setCurrentOrderChannel] = useState<'table' | 'takeaway' | 'delivery' | 'reservation' | 'online'>('table');
  const [currentOrderGuests, setCurrentOrderGuests] = useState(1);
  const [showKitchenHistoryDialog, setShowKitchenHistoryDialog] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showNavConfirm, setShowNavConfirm] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<string | null>(null);
  
  // Order Drawer States
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [orderDrawerData, setOrderDrawerData] = useState<any>({
    servingStaff: '',
    salesStaff: '',
    customerNote: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    customerPhone: '',
    deliveryAddress: '',
    hasDeposit: false,
    depositAmount: 0,
    deliveryMethod: 'SELF',
    partnerOrderCode: '',
    deliveryFee: 0,
  });
  const [orderDrawerErrors, setOrderDrawerErrors] = useState<Record<string, string>>({});
  const [isSelectingTableForOrder, setIsSelectingTableForOrder] = useState(false);

  const resetOrderStates = () => {
    setCurrentOrderId('new');
    setOrderItems([]);
    setCurrentOrderGuests(1);
    setCurrentOrderCustomer(null);
    setPickingTableNames([]);
    setSelectedTable(null);
    setCurrentOrderChannel('table');
    setIsSelectingTableForOrder(false);
    setIsPickingTable(false);
    setOrderDrawerData({
      servingStaff: '',
      salesStaff: '',
      customerNote: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      customerPhone: '',
      deliveryAddress: '',
      hasDeposit: false,
      depositAmount: 0,
      deliveryMethod: 'SELF',
      partnerOrderCode: '',
      deliveryFee: 0,
    });
  };

  const handleSaveOrder = () => {
    if (currentOrderId === 'new') {
      const newId = `new-${Date.now()}`;
      const finalTables = currentOrderChannel === 'table' ? (pickingTableNames.length > 0 ? pickingTableNames : ['110']) : [];
      const newOrder = {
        id: newId,
        channel: currentOrderChannel,
        tables: finalTables,
        orderNo: (orders.length + 50).toString(),
        amount: totalAmount,
        customer: currentOrderCustomer ? currentOrderCustomer.name : 'Khách lẻ',
        customerData: currentOrderCustomer,
        guests: currentOrderGuests,
        dishes: orderItems.length,
        time: '0h 01\'',
        minutes: 1,
        status: 'serving',
        isSentToKitchen: false,
        items: orderItems,
        orderData: currentOrderChannel === 'delivery' ? orderDrawerData : null
      };
      setOrders([newOrder, ...orders]);
      setLastInteractedOrderId(newId);
      setCurrentOrderId(newId);
    } else {
      setOrders(prev => prev.map(o => o.id === currentOrderId ? { 
        ...o, 
        amount: totalAmount, 
        dishes: orderItems.length, 
        items: orderItems,
        customer: currentOrderCustomer ? currentOrderCustomer.name : o.customer,
        customerData: currentOrderCustomer || o.customerData,
        orderData: currentOrderChannel === 'delivery' ? orderDrawerData : o.orderData,
        tables: (currentOrderChannel === 'table' && pickingTableNames.length > 0) ? pickingTableNames : (o.tables || [])
      } : o));
      setLastInteractedOrderId(currentOrderId);
    }
    showToast('Đã lưu tạm tính thành công!');
  };

  const [pendingNav, setPendingNav] = useState<{ screen: string; forceReset?: boolean; setup?: () => void } | null>(null);

  const handleSafeNavigation = (screen: string, forceResetOrder = false, setupAction?: () => void) => {
    const hasItems = orderItems.length > 0;
    const hasTable = pickingTableNames.length > 0;
    const hasData = hasItems || hasTable;
    
    // Determine if we are in an active unsaved order session
    const isInOrderFlow = currentScreen === 'order' || (currentScreen === 'tables' && isSelectingTableForOrder);

    // Should we show the warning? 
    // Yes if: 
    // 1. We are in the order flow and have data
    // 2. AND we are navigating to a different main functional area OR resetting via sidebar
    const isMainAreaSwitch = screen !== currentScreen;
    // We also want to trigger it if user clicks "(+) Order" in sidebar while having data
    const isResettingWhileInFlow = forceResetOrder && hasData;

    const performNav = () => {
      if (setupAction) setupAction();
      if (forceResetOrder || (screen === 'order' && currentScreen !== 'order')) {
        resetOrderStates();
      }
      
      // Reset picking flags when shifting context
      const isDestOutsideFlow = screen !== 'order' && screen !== 'tables' && screen !== 'payment';
      if (isDestOutsideFlow || (screen === 'tables' && currentScreen !== 'tables')) {
        setIsSelectingTableForOrder(false);
        setIsPickingTable(false);
      }
      setCurrentScreen(screen);
    };

    if (isInOrderFlow && hasData && (isMainAreaSwitch || isResettingWhileInFlow)) {
      setPendingNav({ screen, forceReset: forceResetOrder, setup: setupAction });
      setShowNavConfirm(true);
    } else {
      performNav();
    }
  };

  const handleConfirmNavigation = (choice: 'cancel' | 'discard' | 'save') => {
    if (choice === 'cancel') {
      setShowNavConfirm(false);
      setPendingNav(null);
      return;
    }

    if (choice === 'save') {
      handleSaveOrder(); 
    }

    // Perform navigation after a delay if saving, or immediately if discarding
    const delay = choice === 'save' ? 500 : 0;
    
    setTimeout(() => {
      if (pendingNav) {
        const { screen, forceReset, setup } = pendingNav;
        if (setup) setup();
        
        // Always reset states if we chose KHÔNG LƯU (discard) 
        // OR if it's an explicit reset action
        if (choice === 'discard' || forceReset || (screen === 'order' && currentScreen !== 'order')) {
          resetOrderStates();
        }
        
        const isDestOutsideFlow = screen !== 'order' && screen !== 'tables' && screen !== 'payment';
        if (isDestOutsideFlow || (screen === 'tables' && currentScreen !== 'tables')) {
          setIsSelectingTableForOrder(false);
          setIsPickingTable(false);
        }
        setCurrentScreen(screen);
      }
      setPendingNav(null);
      setShowNavConfirm(false);
    }, delay);
  };

  const renderNavConfirmDialog = () => {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" key="nav-confirm-overlay">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-[500px] rounded-lg shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-[18px] font-black text-slate-800">Thông báo</h3>
          </div>
          <div className="p-8">
            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
              Dữ liệu của Order này chưa được lưu lại. Bạn có muốn lưu lại trước khi điều hướng sang chức năng khác không?
            </p>
          </div>
          <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100">
            <button 
              id="nav-confirm-cancel-btn"
              onClick={() => handleConfirmNavigation('cancel')}
              className="h-10 px-8 min-w-[120px] rounded-lg border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-all active:scale-95"
            >
              HỦY BỎ
            </button>
            <button 
              id="nav-confirm-discard-btn"
              onClick={() => handleConfirmNavigation('discard')}
              className="h-10 px-8 min-w-[120px] rounded-lg border border-red-200 bg-white text-red-500 font-bold text-[13px] hover:bg-red-50 transition-all active:scale-95"
            >
              KHÔNG LƯU
            </button>
            <button 
              id="nav-confirm-save-btn"
              onClick={() => handleConfirmNavigation('save')}
              className="h-10 px-8 min-w-[120px] rounded-lg bg-brand text-white font-bold text-[13px] hover:bg-brand-hover shadow-md shadow-brand/20 transition-all active:scale-95"
            >
              LƯU
            </button>
          </div>
        </motion.div>
      </div>
    );
  };
  const totalServiceFee = feeSpecial + (fee10Enabled ? fee10Value : 0) + (feeOtherEnabled ? feeOtherValue : 0);
  const activeDeliveryFee = currentOrderChannel === 'delivery' ? (orderDrawerData.deliveryFee || 0) : 0;
  const totalTax = taxTTDB + (taxGTGTEnabled ? taxGTGTValue : 0);
  const totalFeesAndTaxes = totalServiceFee + activeDeliveryFee + totalTax;

  const validateOrderDrawer = () => {
    const errors: Record<string, string> = {};
    if (currentOrderChannel === 'delivery') {
      if (!orderDrawerData.deliveryDate) errors.deliveryDate = 'Trường này không được để trống';
      if (!orderDrawerData.deliveryTime) errors.deliveryTime = 'Trường này không được để trống';
      
      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
      if (!orderDrawerData.customerPhone) {
        errors.customerPhone = 'Trường này không được để trống';
      } else if (!phoneRegex.test(orderDrawerData.customerPhone)) {
        errors.customerPhone = 'Số điện thoại không hợp lệ';
      }

      if (!orderDrawerData.deliveryAddress) errors.deliveryAddress = 'Trường này không được để trống';
      
      if (orderDrawerData.hasDeposit) {
        if (!orderDrawerData.depositAmount || orderDrawerData.depositAmount <= 0) {
          errors.depositAmount = 'Số tiền cọc phải lớn hơn 0';
        } else if (orderDrawerData.depositAmount > totalAmount) {
          errors.depositAmount = 'Số tiền cọc không được vượt quá tổng tiền';
        }
      }

      if (!orderDrawerData.deliveryMethod) errors.deliveryMethod = 'Trường này không được để trống';
    }
    setOrderDrawerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const renderOrderDrawer = () => {
    if (!isOrderDrawerOpen) return null;

    const channelLabels: Record<string, string> = {
      table: 'Tại bàn',
      takeaway: 'Mang về',
      delivery: 'Giao hàng',
      reservation: 'Đặt trước'
    };

    return (
      <AnimatePresence>
        <div key="order-dialog-container" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOrderDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Dialog Modal */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative p-6 flex items-center border-b border-slate-100">
               <h3 className="text-xl font-bold text-slate-800">
                 Thông tin Order: {channelLabels[currentOrderChannel] || 'Khác'}
               </h3>
               <button 
                 onClick={() => setIsOrderDrawerOpen(false)}
                 className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {(currentOrderChannel === 'table' || currentOrderChannel === 'takeaway' || currentOrderChannel === 'reservation') && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 w-32 shrink-0">Phục vụ</label>
                    <div className="flex-1">
                      <SearchableStaffSelect 
                        label=""
                        value={orderDrawerData.servingStaff}
                        setValue={(val) => setOrderDrawerData({ ...orderDrawerData, servingStaff: val })}
                        icon={User}
                        placeholder="Chọn nhân viên phục vụ..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 w-32 shrink-0">Kinh doanh</label>
                    <div className="flex-1">
                      <SearchableStaffSelect 
                        label=""
                        value={orderDrawerData.salesStaff}
                        setValue={(val) => setOrderDrawerData({ ...orderDrawerData, salesStaff: val })}
                        icon={BarChart3}
                        placeholder="Chọn nhân viên kinh doanh..."
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <label className="text-sm font-bold text-slate-700 w-32 shrink-0 mt-3">Ghi chú</label>
                    <div className="flex-1 space-y-1">
                      <textarea 
                        maxLength={500}
                        placeholder="Nhập ghi chú của khách..."
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1976D2] bg-white text-sm font-medium h-32 resize-none"
                        value={orderDrawerData.customerNote}
                        onChange={(e) => setOrderDrawerData({ ...orderDrawerData, customerNote: e.target.value })}
                      />
                      <div className="text-right text-xs text-slate-400">{orderDrawerData.customerNote.length}/500</div>
                    </div>
                  </div>
                </div>
              )}

              {currentOrderChannel === 'delivery' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 shrink-0 w-32">Ngày giao <span className="text-red-500">*</span></label>
                    <div className="flex-1 relative">
                      <input 
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full h-11 px-4 rounded-xl border ${orderDrawerErrors.deliveryDate ? 'border-[#F44336]' : 'border-slate-200'} focus:outline-none focus:border-[#1976D2] bg-white text-sm font-medium`}
                        value={orderDrawerData.deliveryDate}
                        onChange={(e) => {
                          setOrderDrawerData({ ...orderDrawerData, deliveryDate: e.target.value });
                          if (orderDrawerErrors.deliveryDate) setOrderDrawerErrors(prev => ({ ...prev, deliveryDate: '' }));
                        }}
                      />
                      {orderDrawerErrors.deliveryDate && <div className="text-[11px] text-[#F44336] mt-1 font-medium">{orderDrawerErrors.deliveryDate}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 shrink-0 w-32">Giờ giao <span className="text-red-500">*</span></label>
                    <div className="flex-1 relative">
                      <input 
                        type="time"
                        className={`w-full h-11 px-4 rounded-xl border ${orderDrawerErrors.deliveryTime ? 'border-[#F44336]' : 'border-slate-200'} focus:outline-none focus:border-[#1976D2] bg-white text-sm font-medium`}
                        value={orderDrawerData.deliveryTime}
                        onChange={(e) => {
                          setOrderDrawerData({ ...orderDrawerData, deliveryTime: e.target.value });
                          if (orderDrawerErrors.deliveryTime) setOrderDrawerErrors(prev => ({ ...prev, deliveryTime: '' }));
                        }}
                      />
                      {orderDrawerErrors.deliveryTime && <div className="text-[11px] text-[#F44336] mt-1 font-medium">{orderDrawerErrors.deliveryTime}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 shrink-0 w-32">Khách hàng <span className="text-red-500">*</span></label>
                    <div className="flex-1 relative">
                       <div className={`flex items-center gap-2 px-3 py-2 bg-white rounded-xl border ${orderDrawerErrors.customerPhone ? 'border-[#F44336]' : 'border-slate-200'} shadow-sm hover:border-brand/40 transition-all focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/10`}>
                        <User className="w-5 h-5 text-slate-400 shrink-0" />
                        <input 
                          type="text" 
                          placeholder="Nhập tên hoặc SĐT khách..."
                          className="flex-1 text-sm font-medium bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
                          value={currentOrderCustomer ? `${currentOrderCustomer.name} (${currentOrderCustomer.phone})` : customerSearchQuery}
                          onChange={(e) => {
                            if (currentOrderCustomer) setCurrentOrderCustomer(null);
                            setCustomerSearchQuery(e.target.value);
                            setShowCustomerDropdown(true);
                          }}
                          onFocus={() => setShowCustomerDropdown(true)}
                        />
                        {currentOrderCustomer && (
                          <button 
                            onClick={() => {
                              setCurrentOrderCustomer(null);
                              setCustomerSearchQuery('');
                            }}
                            className="text-red-500 hover:bg-red-50 p-0.5 rounded"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        <button 
                          onClick={() => setShowAddCustomerDialog(true)}
                          className="text-green-600 hover:bg-green-50 p-0.5 rounded transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Dropdown for Dialog - Reusing states */}
                      {showCustomerDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-[120] py-1 overflow-hidden">
                          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                            {customerSearchQuery ? 'Kết quả tìm kiếm' : 'Khách hàng gần đây'}
                          </div>
                          <div className="max-h-48 overflow-y-auto custom-scrollbar">
                            {customers
                              .filter(c => 
                                !customerSearchQuery || 
                                c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || 
                                c.phone.includes(customerSearchQuery)
                              )
                              .map((cust, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => {
                                    setCurrentOrderCustomer(cust);
                                    setCustomerSearchQuery('');
                                    setShowCustomerDropdown(false);
                                  }}
                                  className="flex flex-col px-4 py-2.5 hover:bg-brand/5 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                                >
                                  <div className="text-sm font-bold text-slate-700">{cust.name}</div>
                                  <div className="text-xs text-slate-400 font-medium">{cust.phone}</div>
                                </div>
                              ))}
                            {customers.filter(c => 
                                !customerSearchQuery || 
                                c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || 
                                c.phone.includes(customerSearchQuery)
                              ).length === 0 && (
                                <div className="px-4 py-6 text-center">
                                  <p className="text-sm text-slate-400 mb-2">Không tìm thấy</p>
                                  <button 
                                    onClick={() => {
                                      setNewCustomerData(prev => ({ ...prev, phone: /^\d+$/.test(customerSearchQuery) ? customerSearchQuery : '' }));
                                      setShowAddCustomerDialog(true);
                                      setShowCustomerDropdown(false);
                                    }}
                                    className="text-brand text-xs font-bold hover:underline"
                                  >
                                    Thêm mới
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                      
                      {/* Click outside for dropdown in drawer */}
                      {showCustomerDropdown && (
                        <div className="fixed inset-0 z-[119]" onClick={() => setShowCustomerDropdown(false)}></div>
                      )}
                      {orderDrawerErrors.customerPhone && <div className="text-[11px] text-[#F44336] mt-1 font-medium">{orderDrawerErrors.customerPhone}</div>}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-1">
                    <label className="text-sm font-bold text-slate-700 shrink-0 w-32 mt-3">Địa chỉ giao <span className="text-red-500">*</span></label>
                    <div className="flex-1 relative group">
                      <div className="relative">
                        <textarea 
                          maxLength={500}
                          placeholder="Nhập địa chỉ nhận hàng..."
                          className={`w-full p-4 pl-10 rounded-xl border ${orderDrawerErrors.deliveryAddress ? 'border-[#F44336]' : 'border-slate-200'} focus:outline-none focus:border-[#1976D2] bg-white text-sm font-medium h-24 resize-none`}
                          value={orderDrawerData.deliveryAddress}
                          onChange={(e) => {
                            setOrderDrawerData({ ...orderDrawerData, deliveryAddress: e.target.value });
                            if (orderDrawerErrors.deliveryAddress) setOrderDrawerErrors(prev => ({ ...prev, deliveryAddress: '' }));
                          }}
                        />
                        <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-4" />
                      </div>
                      
                      {/* Address Suggestions Mock */}
                      {orderDrawerData.deliveryAddress?.length >= 2 && !['79', '81', '12', '99', '25'].some(a => orderDrawerData.deliveryAddress.includes(a)) && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-[110] overflow-hidden">
                          {[
                            '79 Đường Láng, Ngã Tư Sở, Đống Đa, Hà Nội',
                            '81 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
                            '12 Phan Huy Chú, Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
                            '99 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
                            '25 Cát Linh, Quốc Tử Giám, Đống Đa, Hà Nội'
                          ].filter(addr => addr.toLowerCase().includes(orderDrawerData.deliveryAddress.toLowerCase())).map((suggestion, idx) => (
                            <div 
                              key={idx}
                              onClick={() => setOrderDrawerData({ ...orderDrawerData, deliveryAddress: suggestion })}
                              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0"
                            >
                              <MapPin className="w-4 h-4 text-slate-300" />
                              <span className="text-[13px] text-slate-600 font-medium">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {orderDrawerErrors.deliveryAddress && <div className="text-[11px] text-[#F44336] mt-1 font-medium">{orderDrawerErrors.deliveryAddress}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-32"></div>
                    <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-brand" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 text-sm">Đặt cọc trước</div>
                          <div className="text-xs text-slate-400">Khách đã thanh toán một phần</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setOrderDrawerData({ ...orderDrawerData, hasDeposit: !orderDrawerData.hasDeposit })}
                        className={`w-12 h-6 rounded-full transition-all relative ${orderDrawerData.hasDeposit ? 'bg-[#4CAF50]' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${orderDrawerData.hasDeposit ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  {orderDrawerData.hasDeposit && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex items-center gap-4 overflow-hidden">
                      <label className="text-sm font-bold text-slate-700 shrink-0 w-32">Số tiền cọc <span className="text-red-500">*</span></label>
                      <div className="flex-1 relative">
                        <input 
                          type="text"
                          placeholder="0"
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border ${orderDrawerErrors.depositAmount ? 'border-[#F44336]' : 'border-slate-200'} focus:outline-none focus:border-[#1976D2] bg-white text-sm font-bold text-right`}
                          value={orderDrawerData.depositAmount ? formatCurrency(orderDrawerData.depositAmount).replace(/đ|VND/g, '').trim() : ''}
                          onChange={(e) => {
                            const val = Number(e.target.value.replace(/\D/g, ''));
                            setOrderDrawerData({ ...orderDrawerData, depositAmount: val });
                            if (orderDrawerErrors.depositAmount) setOrderDrawerErrors(prev => ({ ...prev, depositAmount: '' }));
                          }}
                        />
                        <Coins className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        {orderDrawerErrors.depositAmount && <div className="text-[11px] text-[#F44336] mt-1 font-medium">{orderDrawerErrors.depositAmount}</div>}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 shrink-0 w-32">Hình thức giao <span className="text-red-500">*</span></label>
                    <div className="flex-1 relative">
                      <select 
                        value={orderDrawerData.deliveryMethod}
                        onChange={(e) => {
                          const val = e.target.value;
                          let fee = orderDrawerData.deliveryFee;
                          if (val !== 'SELF') {
                            fee = orderDrawerData.deliveryAddress?.length > 20 ? 50000 : 20000;
                          }
                          setOrderDrawerData({ ...orderDrawerData, deliveryMethod: val, deliveryFee: fee });
                        }}
                        className="w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1976D2] bg-white text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                      >
                        <option value="SELF">Nhà hàng tự giao</option>
                        <option value="GRAB">Grab</option>
                        <option value="AHAMOVE">Ahamove</option>
                        <option value="SHOPEE">ShopeeFood</option>
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 shrink-0 w-32">Mã đơn đối tác</label>
                    <div className="flex-1">
                      <input 
                        type="text"
                        disabled={orderDrawerData.deliveryMethod === 'SELF'}
                        placeholder={orderDrawerData.deliveryMethod === 'SELF' ? 'N/A' : 'Nhập mã vận đơn...'}
                        className={`w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1976D2] bg-white text-sm font-medium ${orderDrawerData.deliveryMethod === 'SELF' ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
                        value={orderDrawerData.partnerOrderCode}
                        onChange={(e) => setOrderDrawerData({ ...orderDrawerData, partnerOrderCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 shrink-0 w-32">Phí giao hàng</label>
                    <div className="flex-1 relative">
                      <input 
                        type="text"
                        readOnly={orderDrawerData.deliveryMethod !== 'SELF'}
                        placeholder="0"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1976D2] text-sm font-bold text-right ${orderDrawerData.deliveryMethod !== 'SELF' ? 'bg-slate-50 text-slate-600' : 'bg-white text-slate-900'}`}
                        value={orderDrawerData.deliveryFee ? formatCurrency(orderDrawerData.deliveryFee).replace(/đ|VND/g, '').trim() : ''}
                        onChange={(e) => {
                          if (orderDrawerData.deliveryMethod === 'SELF') {
                            const val = Number(e.target.value.replace(/\D/g, ''));
                            setOrderDrawerData({ ...orderDrawerData, deliveryFee: val });
                          }
                        }}
                      />
                      <Truck className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <label className="text-sm font-bold text-slate-700 shrink-0 w-32 mt-3">Ghi chú giao hàng</label>
                    <div className="flex-1">
                      <textarea 
                        maxLength={500}
                        placeholder="Nhập ghi chú thêm cho Shipper..."
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1976D2] bg-white text-sm font-medium h-24 resize-none"
                        value={orderDrawerData.customerNote}
                        onChange={(e) => setOrderDrawerData({ ...orderDrawerData, customerNote: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-[#f5f5f5] shrink-0">
               <button 
                 onClick={() => setIsOrderDrawerOpen(false)}
                 className="px-8 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all text-[13px] min-w-[120px]"
               >
                 Hủy bỏ
               </button>
               <button 
                 onClick={() => {
                   if (validateOrderDrawer()) {
                     setIsOrderDrawerOpen(false);
                     showToast('Cập nhật thông tin Order thành công');
                   } else {
                     showToast('Vui lòng kiểm tra lại thông tin', 'error');
                   }
                 }}
                 className="px-8 h-10 rounded-lg bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px] shadow-lg min-w-[120px]"
               >
                 Đồng ý
               </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  const getAppliedPromotionsSummary = () => {
    const itemPromos: any[] = [];
    orderItems.forEach(item => {
      const promos = !item.isPromoRemoved ? getItemPromotion(item.name) : [];
      let selectedPromo = null;
      if (promos.length > 0) {
        selectedPromo = item.selectedPromoId ? promos.find(p => p.id === item.selectedPromoId) : promos.find(p => p.isAuto) || promos[0];
      }
      if (selectedPromo) {
        const itemGross = (item.price || 0) * (item.qty || 0);
        let discAmount = 0;
        if (selectedPromo.type === 'percent' && selectedPromo.discount) discAmount = itemGross * selectedPromo.discount;
        else if (selectedPromo.type === 'amount' && selectedPromo.discount) discAmount = selectedPromo.discount * (item.qty || 0);
        else if (selectedPromo.type === 'gift') discAmount = (item.price || 0) * (item.qty || 0);

        itemPromos.push({
          id: selectedPromo.id,
          itemInstanceId: item.instanceId,
          label: selectedPromo.label || selectedPromo.name,
          discount: discAmount,
          type: 'item_level',
          itemName: item.name,
          qty: item.qty
        });
      }
    });

    const orderPromos = appliedOrderPromos.map(promo => {
      let discAmount = 0;
      if (promo.type === 'discount_bill') {
        const billInfo = promo.itemsList?.find((i: any) => i.itemName === 'Toàn bộ thực đơn');
        discAmount = billInfo?.discountValue || 0;
      } else if (promo.type === 'discount_item') {
        promo.itemsList?.forEach((pItem: any) => {
          const orderItemsMatching = orderItems.filter(oi => oi.name === pItem.itemName);
          orderItemsMatching.forEach(oi => {
            if (pItem.discountType === 'percent') discAmount += (oi.price * oi.qty * (pItem.discountValue / 100));
            else discAmount += pItem.discountValue * oi.qty;
          });
        });
      }
      return {
        id: promo.id,
        label: promo.name,
        discount: discAmount,
        type: 'order_level'
      };
    });

    return [...itemPromos, ...orderPromos];
  };

  const handleRemovePromotionSummary = (promo: any) => {
    if (promo.type === 'item_level') {
      removePromotionFromItem(promo.itemInstanceId);
      showToast(`Đã gỡ khuyến mại của món ${promo.itemName}`);
    } else {
      setAppliedOrderPromos(prev => prev.filter(p => p.id !== promo.id));
      setSelectedPromoIds(prev => prev.filter(id => id !== promo.id));
      showToast(`Đã gỡ chương trình ${promo.label}`);
    }
  };

  // --- ORDER STATE ---
  
  const totalGrossAmount = orderItems.reduce((sum, item) => {
    const itemGross = (item.price || 0) * (item.qty || 0);
    const addonsTotal = (item.addons || []).reduce((aSum: number, a: any) => aSum + ((a.price || 0) * (a.qty || 0)), 0);
    return sum + itemGross + addonsTotal;
  }, 0);

  const totalItemDiscount = orderItems.reduce((sum, item) => {
    const promos = !item.isPromoRemoved ? getItemPromotion(item.name) : [];
    let selectedPromo = null;
    if (promos.length > 0) {
      if (item.selectedPromoId) {
        selectedPromo = promos.find(p => p.id === item.selectedPromoId);
      } else {
        selectedPromo = promos.find(p => p.isAuto) || promos[0];
      }
    }

    if (selectedPromo) {
      const itemGross = (item.price || 0) * (item.qty || 0);
      let discValue = 0;
      if (selectedPromo.type === 'percent' && selectedPromo.discount) {
        discValue = itemGross * selectedPromo.discount;
      } else if (selectedPromo.type === 'amount' && selectedPromo.discount) {
        discValue = selectedPromo.discount * (item.qty || 0);
      } else if (selectedPromo.type === 'gift') {
        discValue = item.price || 0;
      }
      return sum + discValue;
    }
    return sum;
  }, 0);

  const totalOrderDiscount = appliedOrderPromos.reduce((sum, promo) => {
    if (promo.type === 'discount_bill') {
      const billInfo = promo.itemsList?.find((i: any) => i.itemName === 'Toàn bộ thực đơn');
      return sum + (billInfo?.discountValue || 0);
    }
    if (promo.type === 'discount_item') {
      let itemDiscountSum = 0;
      promo.itemsList?.forEach((pItem: any) => {
        const orderItemsMatching = orderItems.filter(oi => oi.name === pItem.itemName);
        orderItemsMatching.forEach(oi => {
          if (pItem.discountType === 'percent') {
            itemDiscountSum += (oi.price * oi.qty * (pItem.discountValue / 100));
          } else {
            itemDiscountSum += pItem.discountValue * oi.qty;
          }
        });
      });
      return sum + itemDiscountSum;
    }
    return sum;
  }, 0);

  const totalDiscountAll = totalItemDiscount + totalOrderDiscount;
  const totalAmount = totalGrossAmount - totalItemDiscount;
  
  // Tax & Fee grouping helper
  const alcoholKeywords = ['bia', 'rượu', 'tiger', 'saigon', 'hà nội', 'heineken', 'vodka', 'whisky', 'vang', 'cider', 'strongbow', 'rưượu'];
  
  const taxGroups = orderItems.reduce((acc: Record<string, any>, item) => {
    const isAlcohol = alcoholKeywords.some(k => item.name.toLowerCase().includes(k));
    const rate = isAlcohol ? 0.1 : 0.08;
    const key = rate === 0.1 ? '10%' : '8%';
    
    if (!acc[key]) {
      acc[key] = { rate, items: [], subtotal: 0 };
    }
    
    // Propose proportional discount to item
    const discountRatio = totalGrossAmount > 0 ? (1 - totalDiscountAll / totalGrossAmount) : 1;
    const itemDiscounted = (item.price * item.qty) * discountRatio;
    
    // Add service fee contribution if enabled
    const sFeeFactor = isServiceFeeEnabled ? 1.1 : 1;
    const taxableAmount = itemDiscounted * sFeeFactor;
    const taxValue = taxableAmount * rate;
    
    acc[key].subtotal += itemDiscounted;
    acc[key].items.push({ ...item, taxRatio: rate, taxValue, taxableAmount });
    return acc;
  }, {});

  const totalServiceFeeActual = isServiceFeeEnabled ? (totalGrossAmount - totalDiscountAll) * 0.1 : 0;
  const totalTaxAmountActual: number = (Object.values(taxGroups) as any[]).reduce((sum: number, group: any) => {
    return sum + (group.items.reduce((iSum: number, i: any) => iSum + (i.taxValue as number), 0) as number);
  }, 0);
  
  const totalFeesAndTaxesActual = totalTaxAmountActual + totalServiceFeeActual + (currentOrderChannel === 'delivery' ? activeDeliveryFee : 0);
  
  const finalTotal = totalGrossAmount - totalDiscountAll + totalFeesAndTaxesActual;
  
  // Debt Calculations
  const activeOrder = orders.find(o => o.id === currentOrderId);
  const selectedCustomerObj = customers.find(c => c.name === (activeOrder?.customer || currentOrderCustomer?.name));
  const remainingAfterPayment = cashReceived - finalTotal;
  const isUnderpaid = remainingAfterPayment < 0;
  const isOverpaid = remainingAfterPayment > 0;

  // Auto-reset repaying debt if underpaid
  useEffect(() => {
    if (isUnderpaid && isRepayingDebt) {
      setIsRepayingDebt(false);
    }
  }, [isUnderpaid]);
  
  let debtAmount = 0;
  let changeAmount = 0;

  if (isUnderpaid) {
    debtAmount = Math.abs(remainingAfterPayment);
    changeAmount = 0;
  } else if (isOverpaid) {
    if (selectedCustomerObj && selectedCustomerObj.debt > 0 && isRepayingDebt) {
      const debtToPay = Math.min(remainingAfterPayment, selectedCustomerObj.debt);
      debtAmount = -debtToPay;
      changeAmount = remainingAfterPayment - debtToPay;
    } else {
      debtAmount = 0;
      changeAmount = remainingAfterPayment;
    }
  } else {
    debtAmount = 0;
    changeAmount = 0;
  }

  const change = Math.max(0, cashReceived - finalTotal);
  const quickAmounts = [500000, 350000, 310000, finalTotal];

  // Automatically set cash received to final total when entering payment screen
  useEffect(() => {
    if (currentScreen === 'payment') {
      setCashReceived(finalTotal);
    }
  }, [currentScreen, finalTotal]);

  // Sync customer state with current order
  useEffect(() => {
    if (currentOrderId && currentOrderId !== 'new') {
      const order = orders.find(o => o.id === currentOrderId);
      if (order && order.customerData) {
        setCurrentOrderCustomer(order.customerData);
      } else if (order && order.customer) {
        // Fallback for demo data
        setCurrentOrderCustomer({ name: order.customer, phone: order.phone || '' });
      } else {
        setCurrentOrderCustomer(null);
      }
    } else {
      setCurrentOrderCustomer(null);
    }
  }, [currentOrderId, orders]);

  const menuCategories = ['Hay dùng', 'Cà phê', 'Trà hoa quả', 'Đá xay', 'Đồ uống đóng chai', 'Đồ ăn nhẹ'];
  const [activeCategory, setActiveCategory] = useState('Cà phê');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuSearchExpanded, setIsMenuSearchExpanded] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<any>(null);
  const [activeCustomCategory, setActiveCustomCategory] = useState<string>('');

  const initialMenuItems = [
    { id: 1, name: 'Cà phê Phin Sữa đá', price: 29000, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80', badge: '1', category: 'Cà phê',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Nhiều sữa', price: 5000 },
          { name: 'Ít ngọt', price: 0 },
          { name: 'Thêm đá', price: 0 },
          { name: 'Thêm trân châu', price: 8000 }
        ]}
      ],
      promotions: [
        { name: 'Giảm 10% khách quen', type: 'discount', value: 0.1 }
      ]
    },
    { id: 2, name: 'Bạc sỉu cốt dừa', price: 35000, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', badge: '1', category: 'Cà phê',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Ít ngọt', price: 0 },
          { name: 'Nhiều đá', price: 0 },
          { name: 'Thêm thạch cà phê', price: 8000 }
        ]}
      ]
    },
    { id: 3, name: 'Cà phê Muối Sông Hồng', price: 39000, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', category: 'Cà phê',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Nhiều muối', price: 0 },
          { name: 'Ít đá', price: 0 },
          { name: 'Không đá', price: 0 }
        ]}
      ]
    },
    { id: 4, name: 'Espresso Double', price: 32000, image: 'https://images.unsplash.com/photo-151097252790b-af4f42d914a9?auto=format&fit=crop&w=800&q=80', category: 'Cà phê',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Thêm đường', price: 0 },
          { name: 'Thêm shot espresso', price: 15000 }
        ]}
      ]
    },
    { id: 5, name: 'Caramel Macchiato đá', price: 45000, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80', category: 'Cà phê',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Thêm sốt caramel', price: 5000 },
          { name: 'Ít ngọt', price: 0 }
        ]}
      ]
    },
    { id: 6, name: 'Trà Đào Cam Sả Thảo Mộc', price: 45000, image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80', badge: '1', active: true, category: 'Trà hoa quả',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Nhiều sả', price: 0 },
          { name: 'Thêm thạch đào', price: 8000 },
          { name: 'Ít ngọt', price: 0 }
        ]}
      ]
    },
    { id: 7, name: 'Trà Vải Lài Măng Cụt', price: 45000, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', badge: '1', active: true, category: 'Trà hoa quả',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Nhiều thạch vải', price: 8000 },
          { name: 'Ít ngọt', price: 0 }
        ]}
      ]
    },
    { id: 8, name: 'Hồng trà Sữa Trân Châu', price: 39000, image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80', category: 'Trà hoa quả',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Thêm trân châu đen', price: 8000 },
          { name: 'Thêm trân châu trắng', price: 8000 },
          { name: 'Nhiều đá', price: 0 }
        ]}
      ]
    },
    { id: 9, name: 'Matcha đá xay cốt dừa', price: 49000, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80', category: 'Đá xay',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Thêm kem tươi (whipping)', price: 10000 },
          { name: 'Ít ngọt', price: 0 }
        ]}
      ]
    },
    { id: 10, name: 'Cookies đá xay', price: 49000, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', category: 'Đá xay',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Thêm sốt chocolate', price: 5000 },
          { name: 'Ít ngọt', price: 0 }
        ]}
      ]
    },
    { id: 11, name: 'Cà phê cốt dừa đá xay', price: 45000, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', category: 'Đá xay' },
    { id: 12, name: 'Nước suối tinh khiết Dasani', price: 15000, image: 'https://images.unsplash.com/photo-1608885898957-a599fb15ec35?auto=format&fit=crop&w=800&q=80', category: 'Đồ uống đóng chai' },
    { id: 13, name: 'Coca Cola lon mát lạnh', price: 19000, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80', category: 'Đồ uống đóng chai' },
    { id: 14, name: 'Nước ép cam nguyên chất', price: 39000, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80', category: 'Trà hoa quả' },
    { id: 15, name: 'Bánh Tiramisu truyền thống', price: 45000, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80', category: 'Đồ ăn nhẹ',
      availableAddons: [
        { category: 'Thêm sở thích', items: [
          { name: 'Thêm bột cacao', price: 0 },
          { name: 'Kèm dâu tây tươi', price: 10000 }
        ]}
      ]
    },
    { id: 16, name: 'Bánh Croissant bơ tỏi thơm nóng', price: 35000, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', category: 'Đồ ăn nhẹ' },
    { id: 17, name: 'Bánh Mousse Chanh Leo', price: 42000, image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=800&q=80', category: 'Đồ ăn nhẹ' }
  ];
  const menuItems = [...initialMenuItems, ...customMenuItems];

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Hay dùng' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const ensureItemInCart = (item: any) => {
    const existing = orderItems.find(oi => (oi.instanceId && item.instanceId && oi.instanceId === item.instanceId) || oi.id === item.id);
    if (!existing) {
      const ensuredId = item.instanceId || `${item.id}-ensured-${Date.now()}`;
      setOrderItems([...orderItems, { ...item, instanceId: ensuredId, qty: 1, addons: [], note: '' }]);
    }
  };

  const handleAddToCart = (item: any) => {
    const instanceId = `${item.id}-${Date.now()}`;
    const newItem = { ...item, instanceId, qty: 1, addons: [], note: '', isProcessing: false, round: 0, isNew: true };
    
    // Check if item belongs to "Đồ uống đóng chai" (bypasses immediate customization)
    const isBeverage = item.category === 'Đồ uống đóng chai';
    
    setOrderItems(prev => {
      const resetOldNew = prev.map(oi => ({ ...oi, isNew: false }));
      if (isBeverage) {
        // Beverages merge immediately
        return mergeDraftItems([...resetOldNew, newItem]);
      } else {
        // Food items always start on a new line to allow individual customization
        return [...resetOldNew, newItem];
      }
    });
    
    if (!isBeverage) {
      setCustomizingItem(newItem);
      
      // Set initial category for split view - prioritize "Thêm sở thích"
      if (item.availableAddons && item.availableAddons.length > 0) {
        const prefTab = item.availableAddons.find((a: any) => a.category === 'Thêm sở thích');
        setActiveCustomCategory(prefTab ? prefTab.category : item.availableAddons[0].category);
      } else {
        setActiveCustomCategory('Ghi chú');
      }
    }
  };

  const toggleAddon = (itemId: number, addon: { name: string, price: number }, instanceId?: string) => {
    setOrderItems(items => {
      const updated = items.map(item => {
        const matches = instanceId ? item.instanceId === instanceId : item.id === itemId;
        if (matches) {
          const existingAddon = item.addons.find((a: any) => a.name === addon.name);
          if (existingAddon) {
            return { ...item, addons: item.addons.filter((a: any) => a.name !== addon.name) };
          } else {
            return { ...item, addons: [...item.addons, { ...addon, qty: 1 }] };
          }
        }
        return item;
      });
      return mergeDraftItems(updated);
    });
  };

  const updateAddonQty = (itemId: any, addonName: string, delta: number) => {
    setOrderItems(items => {
      const updated = items.map(item => {
        const isMatch = item.instanceId ? item.instanceId === itemId : item.id === itemId;
        if (isMatch) {
          return {
            ...item,
            addons: (item.addons || []).map((a: any) => {
              if (a.name === addonName) {
                return { ...a, qty: Math.max(1, a.qty + delta) };
              }
              return a;
            })
          };
        }
        return item;
      });
      return mergeDraftItems(updated);
    });
  };

  const updateQty = (id: any, delta: number, instanceId?: string) => {
    setOrderItems(items => {
      // Find the specific item being clicked
      const targetItem = items.find(item => instanceId ? item.instanceId === instanceId : item.id === id);
      if (!targetItem) return items;

      if (delta > 0 && targetItem.isProcessing) {
        // INCREASING quantity of an ALREADY SENT item: 
        // Need to create a new draft (round 0) item or update existing draft
        const existingDraft = items.find(item => item.id === targetItem.id && !item.isProcessing);
        if (existingDraft) {
          return items.map(item => item.instanceId === existingDraft.instanceId ? { ...item, qty: item.qty + delta } : item);
        } else {
          // Add new draft item
          const newInstanceId = `${targetItem.id}-${Date.now()}`;
          return [...items, { ...targetItem, instanceId: newInstanceId, qty: delta, isProcessing: false, round: 0 }];
        }
      }

      // Normal behavior for draft items or decreasing qty (though reducing sent items usually needs rules, we'll allow it for UI flexibility for now)
      return items.map(item => {
        const isMatch = instanceId ? item.instanceId === instanceId : item.id === id;
        if (isMatch) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      });
    });
  };

  const removeItem = (id: any) => {
    setOrderItems(items => items.filter(item => item.instanceId ? item.instanceId !== id : item.id !== id));
  };

  // --- SPLIT PAYMENT HELPERS ---
  const splitRemaining = finalTotal - splitPayments.reduce((sum, p) => sum + p.amount, 0);

  const getPaymentIcon = (type: PaymentMethodType) => {
    switch (type) {
      case 'cash': return <Banknote className="w-6 h-6 text-green-600" />;
      case 'transfer': return <QrCode className="w-6 h-6 text-brand" />;
      case 'card': return <CreditCard className="w-6 h-6 text-purple-600" />;
      case 'voucher': return <Ticket className="w-6 h-6 text-orange-600" />;
    }
  };

  const handleAddSplitPayment = () => {
    if (splitRemaining <= 0) return;
    setSplitPayments([...splitPayments, { 
      id: Date.now().toString(), 
      type: 'cash', 
      amount: splitRemaining 
    }]);
  };

  const handleRemoveSplitPayment = (id: string) => {
    setSplitPayments(splitPayments.filter(p => p.id !== id));
  };

  const handleUpdateSplitPayment = (id: string, field: keyof SplitPayment, value: any) => {
    setSplitPayments(splitPayments.map(p => p.id === id ? { ...p, [field]: value } : p));
  };


  // ==========================================
  // SIDEBAR COMPONENT
  // ==========================================
  const Sidebar = () => (
    <div className="w-[90px] bg-white border-r border-slate-200 flex flex-col items-center py-8 shrink-0 relative z-50 h-full">
      {/* Logo */}
      <div className="mb-10 flex items-center justify-center">
        <CukCukLogo size={40} />
      </div>

      {/* Main active card / Add Order */}
      <div className="relative mb-8">
        <div id="tour-sidebar-order" className="w-[70px] h-[110px] bg-brand rounded-[24px] flex flex-col items-center border border-brand/20 overflow-hidden">
          <button 
            onClick={() => handleSafeNavigation('order', true)}
            className="w-full h-[62px] flex flex-col items-center justify-center pt-2 hover:bg-brand-hover transition-colors"
          >
            <Plus className="w-6 h-6 text-white mb-1" />
            <span className="text-white font-bold text-xs tracking-tighter -mt-1 leading-none">Order</span>
          </button>
          
          <div className="w-8 h-[1px] bg-white/30 shrink-0"></div>
          
          <button 
            onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
            className={`w-full flex-1 flex items-center justify-center hover:bg-brand-hover transition-all ${showQuickAddMenu ? 'bg-brand-hover' : ''}`}
          >
            <MoreHorizontal className="w-[22px] h-[22px] text-white" />
          </button>
        </div>

        {/* Quick Add Dropdown */}
        {showQuickAddMenu && (
          <div className="absolute left-[70px] top-0 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 w-56 animate-in fade-in slide-in-from-left-2 duration-200">
            {[
              { icon: <PlusCircle className="w-4 h-4" />, label: 'Thêm Order nhanh' },
              { icon: <Truck className="w-4 h-4" />, label: 'Thêm giao hàng' },
              { icon: <ShoppingBag className="w-4 h-4" />, label: 'Thêm mang về' },
              { icon: <CalendarDays className="w-4 h-4" />, label: 'Thêm đặt chỗ' },
              { icon: <Wallet className="w-4 h-4" />, label: 'Thu cọc' },
              { icon: <Coins className="w-4 h-4" />, label: 'Nạp tiền trả trước' },
            ].map((item, idx) => (
              <button 
                key={idx}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 font-bold text-sm transition-colors first:text-brand"
                onClick={() => {
                  setShowQuickAddMenu(false);
                  if (item.label === 'Thêm Order nhanh') {
                    handleSafeNavigation('order', true);
                  } else if (item.label === 'Thêm giao hàng') {
                    handleSafeNavigation('order', true, () => setCurrentOrderChannel('delivery'));
                  } else if (item.label === 'Thêm mang về') {
                    handleSafeNavigation('order', true, () => setCurrentOrderChannel('takeaway'));
                  } else if (item.label === 'Thêm đặt chỗ') {
                    handleSafeNavigation('order', true, () => setCurrentOrderChannel('reservation'));
                  }
                }}
              >
                <span className={idx === 0 ? 'text-brand' : 'text-slate-400'}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Menu items */}
      <div className="flex-1 flex flex-col gap-6 w-full items-center">
        {/* Secondary card */}
        <button 
          onClick={() => handleSafeNavigation('orderList')}
          className={`w-[70px] h-14 flex flex-col items-center justify-center rounded-[16px] transition-all ${
            currentScreen === 'orderList' || currentScreen === 'order' || currentScreen === 'payment'
              ? 'bg-brand-light text-brand' 
              : 'text-slate-400 hover:bg-slate-200/50'
          }`}
        >
          <ClipboardList className="w-6 h-6 mb-1" />
          <span className="text-[12px] font-bold">Order</span>
        </button>
        
        <button 
          id="tour-sidebar-tables"
          onClick={() => handleSafeNavigation('tables')}
          className={`w-[70px] h-14 flex flex-col items-center justify-center rounded-[16px] transition-all ${
            currentScreen === 'tables'
              ? 'bg-brand-light text-brand'
              : 'text-slate-400 hover:bg-slate-200/50'
          }`}
        >
          <TableIcon className="w-6 h-6 mb-1" strokeWidth={2} />
          <span className="text-[12px] font-bold">Bàn</span>
        </button>
        
        <button 
          id="tour-sidebar-invoices"
          onClick={() => handleSafeNavigation('invoices')}
          className={`w-[70px] h-14 flex flex-col items-center justify-center rounded-[16px] transition-all ${
            currentScreen === 'invoices'
              ? 'bg-brand-light text-brand' 
              : 'text-slate-400 hover:bg-slate-200/50'
          }`}
        >
          <FileText className="w-6 h-6 mb-1" />
          <span className="text-[12px] font-bold">Hóa đơn</span>
        </button>

        <button 
          id="tour-sidebar-reservations"
          onClick={() => handleSafeNavigation('reservations')}
          className={`w-[70px] h-14 flex flex-col items-center justify-center rounded-[16px] relative transition-all ${
            currentScreen === 'reservations'
              ? 'bg-brand-light text-brand' 
              : 'text-slate-400 hover:bg-slate-200/50'
          }`}
        >
          <CalendarDays className="w-6 h-6 mb-1" />
          <span className="text-[12px] font-bold">Đặt chỗ</span>
        </button>

        <button 
          onClick={() => handleSafeNavigation('tourguide')}
          className={`w-[70px] h-14 flex flex-col items-center justify-center rounded-[16px] relative transition-all ${
            currentScreen === 'tourguide'
              ? 'bg-brand-light text-brand' 
              : 'text-slate-400 hover:bg-slate-200/50'
          }`}
        >
          <Compass className="w-6 h-6 mb-1" />
          <span className="text-[12px] font-bold">Hướng dẫn</span>
        </button>
      </div>

      {/* Bottom icons */}
      <div className="flex flex-col gap-6 mt-auto items-center">
        <button 
          id="tour-sidebar-apps"
          onClick={() => setShowAppsMenu(true)}
          className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-200/50 rounded-2xl transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.33331 4.16666C3.33331 4.38768 3.42111 4.59964 3.57739 4.75592C3.73367 4.9122 3.94563 4.99999 4.16665 4.99999C4.38766 4.99999 4.59962 4.9122 4.7559 4.75592C4.91218 4.59964 4.99998 4.38768 4.99998 4.16666C4.99998 3.94565 4.91218 3.73369 4.7559 3.57741C4.59962 3.42113 4.38766 3.33333 4.16665 3.33333C3.94563 3.33333 3.73367 3.42113 3.57739 3.57741C3.42111 3.73369 3.33331 3.94565 3.33331 4.16666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.16665 4.16666C9.16665 4.38768 9.25444 4.59964 9.41072 4.75592C9.567 4.9122 9.77897 4.99999 9.99998 4.99999C10.221 4.99999 10.433 4.9122 10.5892 4.75592C10.7455 4.59964 10.8333 4.38768 10.8333 4.16666C10.8333 3.94565 10.7455 3.73369 10.5892 3.57741C10.433 3.42113 10.221 3.33333 9.99998 3.33333C9.77897 3.33333 9.567 3.42113 9.41072 3.57741C9.25444 3.73369 9.16665 3.94565 9.16665 4.16666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 4.16666C15 4.38768 15.0878 4.59964 15.2441 4.75592C15.4003 4.9122 15.6123 4.99999 15.8333 4.99999C16.0543 4.99999 16.2663 4.9122 16.4226 4.75592C16.5788 4.59964 16.6666 4.38768 16.6666 4.16666C16.6666 3.94565 16.5788 3.73369 16.4226 3.57741C16.2663 3.42113 16.0543 3.33333 15.8333 3.33333C15.6123 3.33333 15.4003 3.42113 15.2441 3.57741C15.0878 3.73369 15 3.94565 15 4.16666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33331 9.99999C3.33331 10.221 3.42111 10.433 3.57739 10.5893C3.73367 10.7455 3.94563 10.8333 4.16665 10.8333C4.38766 10.8333 4.59962 10.7455 4.7559 10.5893C4.91218 10.433 4.99998 10.221 4.99998 9.99999C4.99998 9.77898 4.91218 9.56702 4.7559 9.41074C4.59962 9.25446 4.38766 9.16666 4.16665 9.16666C3.94563 9.16666 3.73367 9.25446 3.57739 9.41074C3.42111 9.56702 3.33331 9.77898 3.33331 9.99999Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.16665 9.99999C9.16665 10.221 9.25444 10.433 9.41072 10.5893C9.567 10.7455 9.77897 10.8333 9.99998 10.8333C10.221 10.8333 10.433 10.7455 10.5892 10.5893C10.7455 10.433 10.8333 10.221 10.8333 9.99999C10.8333 9.77898 10.7455 9.56702 10.5892 9.41074C10.433 9.25446 10.221 9.16666 9.99998 9.16666C9.77897 9.16666 9.567 9.25446 9.41072 9.41074C9.25444 9.56702 9.16665 9.77898 9.16665 9.99999Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 9.99999C15 10.221 15.0878 10.433 15.2441 10.5893C15.4003 10.7455 15.6123 10.8333 15.8333 10.8333C16.0543 10.8333 16.2663 10.7455 16.4226 10.5893C16.5788 10.433 16.6666 10.221 16.6666 9.99999C16.6666 9.77898 16.5788 9.56702 16.4226 9.41074C16.2663 9.25446 16.0543 9.16666 15.8333 9.16666C15.6123 9.16666 15.4003 9.25446 15.2441 9.41074C15.0878 9.56702 15 9.77898 15 9.99999Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33331 15.8333C3.33331 16.0543 3.42111 16.2663 3.57739 16.4226C3.73367 16.5789 3.94563 16.6667 4.16665 16.6667C4.38766 16.6667 4.59962 16.5789 4.7559 16.4226C4.91218 16.2663 4.99998 16.0543 4.99998 15.8333C4.99998 15.6123 4.91218 15.4004 4.7559 15.2441C4.59962 15.0878 4.38766 15 4.16665 15C3.94563 15 3.73367 15.0878 3.57739 15.2441C3.42111 15.4004 3.33331 15.6123 3.33331 15.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.16665 15.8333C9.16665 16.0543 9.25444 16.2663 9.41072 16.4226C9.567 16.5789 9.77897 16.6667 9.99998 16.6667C10.221 16.6667 10.433 16.5789 10.5892 16.4226C10.7455 16.2663 10.8333 16.0543 10.8333 15.8333C10.8333 15.6123 10.7455 15.4004 10.5892 15.2441C10.433 15.0878 10.221 15 9.99998 15C9.77897 15 9.567 15.0878 9.41072 15.2441C9.25444 15.4004 9.16665 15.6123 9.16665 15.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 15.8333C15 16.0543 15.0878 16.2663 15.2441 16.4226C15.4003 16.5789 15.6123 16.6667 15.8333 16.6667C16.0543 16.6667 16.2663 16.5789 16.4226 16.4226C16.5788 16.2663 16.6666 16.0543 16.6666 15.8333C16.6666 15.6123 16.5788 15.4004 16.4226 15.2441C16.2663 15.0878 16.0543 15 15.8333 15C15.6123 15 15.4003 15.0878 15.2441 15.2441C15.0878 15.4004 15 15.6123 15 15.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-200/50 rounded-2xl transition-all relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </div>
  );

  // ==========================================
  // RENDER ORDER LIST SCREEN
  // ==========================================
  const renderOrderListScreen = () => {
    const filteredOrders = orders.filter(order => {
      // Status Filter from Footer
      if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) return false;

      // Logic: 'online' orders only show in 'online' tab. 
      if (orderListTab === 'all') {
        if (order.channel === 'online') return false;
      } else if (orderListTab === 'delivery') {
        if (order.channel !== 'delivery') return false;
        const matchesStatus = deliveryStatus === 'all' || 
          (deliveryStatus === 'pending' && order.status === 'waiting_payment') ||
          (deliveryStatus === 'delivering' && order.status === 'delivering') ||
          (deliveryStatus === 'completed' && order.status === 'serving') || // Assuming serving as completed for now
          (deliveryStatus === 'cancelled' && order.status === 'cancelled');
        if (!matchesStatus) return false;
        if (deliveryPartner !== 'all' && order.partner !== deliveryPartner) return false;
        if (orderSource !== 'all' && order.source !== orderSource) return false;
      } else {
        if (order.channel !== orderListTab) return false;
      }

      const q = orderSearchQuery.toLowerCase();
      const matchesSearch = 
        (order.tables?.join(', ') || order.label || '').toLowerCase().includes(q) || 
        order.customer.toLowerCase().includes(q) ||
        (q.length >= 4 && order.phone?.replace(/\D/g, '').endsWith(q));
      return matchesSearch;
    });

    const getTabCount = (tabId: string) => {
      if (tabId === 'all') return orders.filter(o => o.channel !== 'online').length;
      return orders.filter(o => o.channel === tabId).length;
    };

    const handleSendToKitchen = (orderId: string) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isSentToKitchen: true } : o));
      showToast('Gửi bếp thành công!');
    };

    const handleConfirmOnlineOrder = (orderId: string) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, channel: 'delivery', partner: 'Tự giao' } : o));
      showToast('Xác nhận đơn hàng thành công!');
      setSelectedOnlineOrder(null);
    };

    const handleRejectOnlineOrder = (orderId: string) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      showToast('Đã hủy đơn hàng!', 'error');
      setSelectedOnlineOrder(null);
    };

    return (
      <div className="flex-1 flex flex-col bg-background overflow-hidden relative">
        {/* Tab Navigation Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 relative">
          <div className="flex h-full overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'table', label: 'Tại bàn' },
              { id: 'takeaway', label: 'Mang về' },
              { id: 'delivery', label: 'Giao hàng' },
              { id: 'online', label: 'Xác nhận đơn online' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setOrderListTab(tab.id as any)}
                className={`px-6 h-full font-bold text-sm transition-all relative whitespace-nowrap flex items-center gap-2 ${
                  orderListTab === tab.id ? 'text-brand' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                <span className={`text-sm px-2 py-0.5 rounded-full font-bold ${
                  orderListTab === tab.id ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {getTabCount(tab.id)}
                </span>
                {orderListTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Header: Search, Filters & Summary */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-[300px] relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm bàn, khách hàng..." 
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-bold bg-white"
                value={orderSearchQuery || ''}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center">
              <select 
                value={filterMyOrders ? 'my_orders' : orderStatusFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'my_orders') {
                    setFilterMyOrders(true);
                    setOrderStatusFilter('all');
                  } else {
                    setFilterMyOrders(false);
                    setOrderStatusFilter(val as any);
                  }
                }}
                className="h-11 pl-4 pr-10 rounded-xl border border-slate-200 text-sm font-bold font-sans bg-white focus:outline-none focus:border-brand min-w-[180px] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-[size:16px] bg-no-repeat cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <option value="all">Tất cả</option>
                <option value="serving">Đang phục vụ</option>
                <option value="waiting_payment">Chờ thanh toán</option>
                <option value="draft">Lưu tạm tính</option>
                <option value="my_orders">Đơn của tôi</option>
              </select>
            </div>

            {/* Delivery Filters (Only visible in Delivery tab) - Positioned in the middle */}
            {orderListTab === 'delivery' && (
              <div className="flex items-center gap-3 ml-4">
                <select 
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value as any)}
                  className="h-11 pl-4 pr-10 rounded-xl border border-slate-200 text-sm font-bold font-sans bg-white focus:outline-none focus:border-brand min-w-[170px] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-[size:16px] bg-no-repeat cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ giao</option>
                  <option value="delivering">Đang giao</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
                <select 
                  value={deliveryPartner}
                  onChange={(e) => setDeliveryPartner(e.target.value)}
                  className="h-11 pl-4 pr-10 rounded-xl border border-slate-200 text-sm font-bold font-sans bg-white focus:outline-none focus:border-brand min-w-[150px] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-[size:16px] bg-no-repeat cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <option value="all">Tất cả đối tác</option>
                  <option value="Tự giao">Tự giao</option>
                  <option value="Grab food">Grab food</option>
                  <option value="Shopee food">Shopee food</option>
                </select>
                <select 
                  value={orderSource}
                  onChange={(e) => setOrderSource(e.target.value)}
                  className="h-11 pl-4 pr-10 rounded-xl border border-slate-200 text-sm font-bold font-sans bg-white focus:outline-none focus:border-brand min-w-[150px] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-[size:16px] bg-no-repeat cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <option value="all">Tất cả nguồn đơn</option>
                  <option value="App">App</option>
                  <option value="Website">Website</option>
                  <option value="Grab">Grab</option>
                  <option value="Shopee">Shopee</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-4 ml-auto shrink-0">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                <span>Tổng:</span>
                <span className="text-slate-800">{filteredOrders.length} order</span>
                <span className="w-px h-4 bg-slate-200 mx-1"></span>
                <span className="text-brand text-lg font-black shrink-0 whitespace-nowrap">
                  {formatCurrency((filteredOrders || []).reduce((sum, order) => sum + (order.amount || 0), 0))}
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Main Content: Order Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className={`grid gap-4 ${isCompactView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {filteredOrders.map(order => {
              const isWaitingPayment = order.status === 'waiting_payment';
              const isDelivery = order.channel === 'delivery' || order.channel === 'online';
              
              return (
                <div 
                  key={order.id} 
                  id={order.id === lastInteractedOrderId ? 'tour-first-order-card' : undefined}
                  onClick={() => {
                    setCurrentOrderId(order.id);
                    setOrderItems((order as any).items || []);
                    setCurrentOrderChannel((order.channel as any) || 'table');
                    setCurrentOrderGuests(order.guests || 0);

                    // Sync customer
                    const customer = customers.find(c => c.name === order.customer);
                    setCurrentOrderCustomer(customer || null);

                    if (order.tables && order.tables.length > 0) {
                      setSelectedTable(order.tables[0]);
                    }
                    if (order.channel === 'online') {
                      setSelectedOnlineOrder(order);
                    } else {
                      setCurrentScreen('order');
                    }
                  }}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer relative flex flex-col ${
                    activeOrderMenuId === order.id ? 'z-[165]' : 'z-auto'
                  } ${
                    order.id === lastInteractedOrderId
                      ? 'border-brand ring-4 ring-brand/10 shadow-lg scale-[1.02]'
                      : order.status === 'waiting_payment' 
                      ? 'border-orange-200 bg-orange-50/30' 
                      : order.status === 'draft'
                      ? 'border-green-200 bg-green-50/30'
                      : 'border-slate-200 hover:border-slate-300'
                  } ${isCompactView ? 'h-[100px]' : 'h-[220px]'}`}
                >
                  {order.id === lastInteractedOrderId && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-brand text-white text-xs font-black px-2 py-1 rounded-full shadow-sm animate-pulse">
                        Vừa làm việc
                      </div>
                    </div>
                  )}
                  <div className={`${isCompactView ? 'p-2.5' : 'p-3'} flex-1 flex flex-col gap-2`}>
                    {/* Header Row 1: Badge | ID + Timer */}
                    <div className="flex justify-between items-center">
                      <div className={`px-2 py-0.5 rounded-full flex items-center gap-1.5 border text-xs font-bold ${
                        order.channel === 'table' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                        order.channel === 'takeaway' ? 'bg-purple-50 border-purple-200 text-purple-600' :
                        (order.channel === 'delivery' || order.channel === 'online') ? (
                          order.partner === 'Grab food' ? 'bg-green-50 border-green-200 text-green-600' :
                          order.partner === 'Shopee food' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                          'bg-blue-50 border-blue-200 text-brand'
                        ) :
                        'bg-orange-50 border-orange-200 text-orange-600'
                      }`}>
                        {order.channel === 'table' ? <UtensilsCrossed className="w-3 h-3" /> : 
                         order.channel === 'takeaway' ? <ShoppingBag className="w-3 h-3" /> :
                         (order.channel === 'delivery' || order.channel === 'online') ? (
                           order.partner === 'Grab food' ? <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhuiQVP-z3RsAyzhD7DAZUWXNjRTXeJdATsQSY63ZvaCXCm4OoqzBsXOy2FqzNWO5IGhw1R8IL6ZN8BjspDoaRWeQB2gjoRZHIvx9PtjSvX3dQRoxiAIrq6wtb0D08C9-MXHS4TDn0F9nE/s1600/grab-food.png" className="w-3 h-3 object-contain" referrerPolicy="no-referrer" /> :
                           order.partner === 'Shopee food' ? <img src="https://1000logos.net/wp-content/uploads/2022/11/Shopee-Food-Emblem.png" className="w-3 h-3 object-contain" referrerPolicy="no-referrer" /> :
                           <Truck className="w-3 h-3" />
                         ) : <QrCode className="w-3 h-3" />}
                        {order.channel === 'table' ? 'Tại bàn' : 
                         order.channel === 'takeaway' ? 'Mang về' : 
                         (order.channel === 'delivery' || order.channel === 'online') ? (
                           order.partner === 'Grab food' ? 'Grab' :
                           order.partner === 'Shopee food' ? 'Shopee' :
                           'Tự giao'
                         ) : 'Online'}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-normal text-xs">
                        {isDelivery && (
                          <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 mr-1">
                            <Clock className="w-3 h-3" /> {order.minutes}p
                          </div>
                        )}
                        <span>#{order.orderNo}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {order.time}
                        </div>
                      </div>
                    </div>

                    {/* Header Row 2: Title | Status */}
                    <div className="flex justify-between items-start">
                      <h3 className={`${isCompactView ? 'text-lg' : 'text-xl'} font-black text-slate-800 truncate flex-1 mr-2`}>
                        {isDelivery ? (order.waybillNo ? `#${order.waybillNo}` : order.label) : (order.tables ? `Bàn ${order.tables.join(', ')}` : order.label)}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-normal border whitespace-nowrap ${
                        order.status === 'waiting_payment' 
                          ? 'bg-orange-100 border-orange-200 text-orange-600' 
                          : order.status === 'draft'
                          ? 'bg-green-100 border-green-200 text-green-600'
                          : 'bg-blue-100 border-blue-200 text-brand'
                      }`}>
                        {order.status === 'waiting_payment' ? 'Chờ thanh toán' : order.status === 'draft' ? 'Lưu tạm tính' : 'Đang phục vụ'}
                      </span>
                    </div>
                    
                    {/* Order Card Body */}
                    {!isCompactView && (
                      !isDelivery ? (
                        /* Table / Takeaway Layout */
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm font-normal text-slate-900 leading-none">{formatCurrency(order.amount)}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm font-normal text-slate-600 truncate leading-none">{order.customer}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UtensilsCrossed className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm font-normal text-slate-600 leading-none">{order.dishes} món</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm font-normal text-slate-600 leading-none">{order.guests} khách</span>
                          </div>
                        </div>
                      ) : (
                        /* Delivery Layout */
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-3 border-t border-slate-100">
                          {/* Row 1: Amount | Customer */}
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm font-normal text-brand leading-none">{formatCurrency(order.amount)}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm font-normal text-slate-600 truncate leading-none">{order.customer}</span>
                          </div>
                          {/* Row 2: Delivery Time | Phone */}
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm font-normal text-slate-600 leading-none">{order.deliveryTime || 'Sớm nhất'}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm font-normal text-slate-600 truncate leading-none">{order.phone || '—'}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {!isCompactView && order.channel !== 'online' && (
                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex gap-2" onClick={e => e.stopPropagation()}>
                      {order.channel === 'delivery' ? (
                        /* Delivery Buttons */
                        <>
                          <button className="flex-1 h-10 rounded-xl border-2 border-brand text-brand bg-white font-normal text-sm transition-all flex items-center justify-center gap-2 hover:bg-blue-50">
                            <Truck className="w-4 h-4" /> Giao hàng
                          </button>
                          <button 
                            disabled={order.isSentToKitchen}
                            onClick={() => handleSendToKitchen(order.id)}
                            className={`px-3 h-10 flex items-center gap-2 justify-center border rounded-xl font-normal text-sm active:scale-95 transition-all ${
                              order.isSentToKitchen 
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <UtensilsCrossed className="w-3.5 h-3.5" /> {order.isSentToKitchen ? 'Gửi bếp' : 'Gửi bếp'}
                          </button>
                          <div 
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                              setOrderMenuPos({ x: rect.right, y: rect.top });
                              setActiveOrderMenuId(activeOrderMenuId === order.id ? null : order.id);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                setOrderMenuPos({ x: rect.right, y: rect.top });
                                setActiveOrderMenuId(activeOrderMenuId === order.id ? null : order.id);
                              }
                            }}
                            className={`w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 active:scale-95 cursor-pointer transition-all relative ${activeOrderMenuId === order.id ? 'bg-slate-50 border-brand/50 text-brand' : ''}`}
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </div>
                        </>
                      ) : (
                        /* Table / Takeaway Buttons */
                        <>
                          <button 
                            onClick={() => {
                              setCurrentOrderId(order.id);
                              setOrderItems((order as any).items || []);
                              setPreviousScreen('orderList');
                              setCurrentScreen('payment');
                            }}
                            className={`flex-1 h-10 rounded-xl border-2 font-normal text-sm transition-all flex items-center justify-center gap-2 ${
                              isWaitingPayment
                                ? 'border-orange-500 text-orange-500 bg-white hover:bg-orange-50'
                                : 'border-brand text-brand bg-white hover:bg-blue-50'
                            }`}
                          >
                            <CircleDollarSign className="w-4 h-4" /> Tính tiền
                          </button>
                          <button 
                            disabled={order.isSentToKitchen}
                            onClick={() => handleSendToKitchen(order.id)}
                            className={`px-3 h-10 flex items-center gap-2 justify-center border rounded-xl font-normal text-sm active:scale-95 transition-all ${
                              order.isSentToKitchen 
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <UtensilsCrossed className="w-3.5 h-3.5" /> {order.isSentToKitchen ? 'Gửi bếp' : 'Gửi bếp'}
                          </button>
                          <div 
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                              setOrderMenuPos({ x: rect.right, y: rect.top });
                              setActiveOrderMenuId(activeOrderMenuId === order.id ? null : order.id);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                setOrderMenuPos({ x: rect.right, y: rect.top });
                                setActiveOrderMenuId(activeOrderMenuId === order.id ? null : order.id);
                              }
                            }}
                            className={`w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 active:scale-95 cursor-pointer transition-all relative ${activeOrderMenuId === order.id ? 'bg-slate-50 border-brand/50 text-brand' : ''}`}
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>


        {/* Online Order Detail Slide-out Panel */}
        {selectedOnlineOrder && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setSelectedOnlineOrder(null)}
            ></div>
            <div className="w-[500px] bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
              {/* Panel Tabs */}
              <div className="flex border-b border-slate-100">
                <button className="flex-1 py-4 text-sm font-bold text-brand border-b-2 border-brand">
                  Thông tin đơn hàng
                </button>
                <button className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Đối tác giao hàng
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900">Đơn giao hàng: {selectedOnlineOrder.waybillNo || selectedOnlineOrder.orderNo}</h2>
                  <p className="text-sm text-slate-400 mt-1 italic">Thời gian đặt: {selectedOnlineOrder.time} - 24/09/2024</p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <CalendarDays className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium tracking-wider">Thời gian nhận</p>
                      <p className="text-sm font-bold text-slate-700 mt-0.5">24/09/2024 - {selectedOnlineOrder.deliveryTime || '11:30'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium tracking-wider">Khách hàng</p>
                      <p className="text-sm font-bold text-slate-700 mt-0.5">{selectedOnlineOrder.customer} - {selectedOnlineOrder.phone || '0901234567'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium tracking-wider">Địa chỉ giao hàng</p>
                      <p className="text-sm font-bold text-slate-700 mt-0.5 leading-relaxed">
                        N03-T1 Ngoại Giao Đoàn, P.Xuân Tảo, Q.Bắc Từ Liêm, Hà Nội
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium tracking-wider">Thanh toán</p>
                      <p className="text-sm font-bold text-slate-700 mt-0.5">Thanh toán tiền mặt</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium tracking-wider">Ghi chú</p>
                      <p className="text-sm font-bold text-blue-500 mt-0.5 italic">
                        "giao hàng nhanh, tôi đang rất đói."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dish List */}
                <div className="mt-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-slate-900">Danh sách món</h3>
                    <button className="text-brand text-sm font-bold flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Thêm món
                    </button>
                  </div>
                  <div className="border rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-400 font-medium">
                        <tr>
                          <th className="px-4 py-3">Tên món</th>
                          <th className="px-4 py-3 text-center">SL</th>
                          <th className="px-4 py-3 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="px-4 py-4">
                            <p className="font-bold text-slate-700">Phở tái chín (45.000/Bát)</p>
                            <p className="text-xs text-blue-500 italic mt-0.5">Không ăn hành</p>
                            <p className="text-xs text-slate-400 mt-1">+ Thêm trứng trần</p>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-slate-600">4</td>
                          <td className="px-4 py-4 text-right font-bold text-slate-900">180.000</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4">
                            <p className="font-bold text-slate-700">Quẩy giòn (5.000/Cái)</p>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-slate-600">4</td>
                          <td className="px-4 py-4 text-right font-bold text-slate-900">20.000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-bold">Còn phải thu</span>
                    <Info className="w-4 h-4 text-brand" />
                  </div>
                  <span className="text-2xl font-black text-slate-900">{formatCurrency(selectedOnlineOrder.amount)}</span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRejectOnlineOrder(selectedOnlineOrder.id)}
                    className="flex-1 h-12 rounded-xl border border-red-200 text-red-500 font-bold hover:bg-red-50 transition-all"
                  >
                    Từ chối
                  </button>
                  <button 
                    onClick={() => handleConfirmOnlineOrder(selectedOnlineOrder.id)}
                    className="flex-1 h-12 rounded-xl border border-brand text-brand font-bold hover:bg-blue-50 transition-all"
                  >
                    Xác nhận & Giao hàng
                  </button>
                  <button 
                    onClick={() => handleConfirmOnlineOrder(selectedOnlineOrder.id)}
                    className="flex-1 h-12 rounded-xl bg-brand text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderOrderScreen = () => {
    const currentOrder = currentOrderId === 'new' ? null : orders.find(o => o.id === currentOrderId);
    const isSentToKitchen = currentOrder?.isSentToKitchen || false;

    return (
    <div className="h-full w-full overflow-hidden bg-background flex p-2 gap-2 font-sans text-slate-700">
      
      {/* LEFT COLUMN: Order List (~35%) */}
      <div className="w-[480px] shrink-0 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header Info */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3 min-w-0 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="text-slate-400 font-bold text-sm shrink-0 whitespace-nowrap">
                #{currentOrderId === 'new' ? (orders.length + 50) : orders.find(o => o.id === currentOrderId)?.orderNo}
              </div>
              <div className="w-[1px] h-4 bg-slate-200 shrink-0"></div>
              
              {/* Channel Selector (Combo) */}
              <div className="relative">
                <div 
                  onClick={() => {
                    if (isSentToKitchen) {
                      showToast('Không thể đổi hình thức phục vụ sau khi gửi bếp', 'error');
                      return;
                    }
                    setShowChannelDropdown(!showChannelDropdown);
                  }}
                  className={`flex items-center gap-2 px-3 h-11 rounded-lg border transition-all ${
                    isSentToKitchen ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  {(() => {
                    const option = [
                      { value: 'table', label: 'Tại bàn', icon: TableIcon },
                      { value: 'takeaway', label: 'Mang về', icon: ShoppingBag },
                      { value: 'delivery', label: 'Giao hàng', icon: Truck },
                      { value: 'reservation', label: 'Đặt trước', icon: CalendarDays },
                    ].find(o => o.value === currentOrderChannel);
                    const Icon = option?.icon || TableIcon;
                    return (
                      <div className="flex items-center gap-2 truncate">
                        <Icon className="w-4 h-4 text-brand shrink-0" />
                        <span className="text-sm font-bold text-slate-700 truncate max-w-[80px]">{option?.label}</span>
                      </div>
                    );
                  })()}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                
                {showChannelDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1">
                    {[
                      { value: 'table', label: 'Tại bàn', icon: TableIcon },
                      { value: 'takeaway', label: 'Mang về', icon: ShoppingBag },
                      { value: 'delivery', label: 'Giao hàng', icon: Truck },
                      { value: 'reservation', label: 'Đặt trước', icon: CalendarDays },
                    ].map(opt => (
                      <div 
                        key={opt.value}
                        onClick={() => {
                          setCurrentOrderChannel(opt.value as any);
                          setShowChannelDropdown(false);
                          
                          // BR-01: Reset toàn bộ dữ liệu drawer khi thay đổi Loại Order
                          setOrderDrawerData({
                            servingStaff: '',
                            salesStaff: '',
                            customerNote: '',
                            deliveryDate: new Date().toISOString().split('T')[0],
                            deliveryTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
                            customerPhone: '',
                            deliveryAddress: '',
                            hasDeposit: false,
                            depositAmount: 0,
                            deliveryMethod: 'SELF',
                            partnerOrderCode: '',
                            deliveryFee: 0,
                          });
                          setOrderDrawerErrors({});
                        }}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-600"
                      >
                        <opt.icon className="w-4 h-4 text-slate-400" />
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conditional Table/Guests UI */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {(currentOrderChannel === 'table' || currentOrderChannel === 'reservation') && (
                  <button 
                    onClick={() => {
                      setIsSelectingTableForOrder(true);
                      setIsPickingTable(true);
                      setTableFilter('all');
                      
                      // For 'table' channel, we want the default multi-select table picker
                      // For 'reservation' channel, we should ideally use the reservation picking context
                      if (currentOrderChannel === 'reservation') {
                        // If we are editing an existing reservation order, try to use its reservation object if it exists
                        const order = orders.find(o => o.id === currentOrderId);
                        if (order && order.reservationId) {
                           const res = reservations.find(r => r.id === order.reservationId);
                           if (res) setSelectedReservation(res);
                        }
                      } else {
                        setSelectedReservation(null);
                      }
                      
                      setPickingTableNames(
                        currentOrderId === 'new' 
                          ? pickingTableNames 
                          : (orders.find(o => o.id === currentOrderId)?.tables || [])
                      );
                      setCurrentScreen('tables');
                    }}
                    className="flex items-center gap-2 px-3 h-11 bg-slate-50 rounded-lg border border-slate-200 text-brand font-black text-sm hover:bg-slate-100 transition-all flex-1 min-w-0 max-w-[300px]"
                  >
                    <TableIcon className="w-[18px] h-[18px] shrink-0 text-brand" />
                    <span className="truncate">
                      {currentOrderId === 'new' 
                        ? (pickingTableNames.length > 0 ? pickingTableNames.map(t => `Bàn ${t}`).join(', ') : 'Chọn bàn')
                        : (orders.find(o => o.id === currentOrderId)?.tables?.map(t => `Bàn ${t}`).join(', ') || '...')
                      }
                    </span>
                  </button>
                )}

                {(currentOrderChannel === 'table' || currentOrderChannel === 'takeaway' || currentOrderChannel === 'delivery' || currentOrderChannel === 'reservation') && (
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    {currentOrderChannel !== 'delivery' && (
                      <button 
                        onClick={() => {
                          if (currentOrderChannel === 'table' || currentOrderChannel === 'takeaway') {
                            setGuestKeypadValue(currentOrderGuests.toString());
                            setIsFirstInputGuest(true);
                            setShowGuestPopup(true);
                          }
                        }}
                        className={`flex items-center gap-2 px-3 h-11 bg-slate-50 rounded-lg border border-slate-200 font-black text-sm transition-all shrink-0 ${
                          (currentOrderChannel === 'table' || currentOrderChannel === 'takeaway') ? 'cursor-pointer hover:bg-slate-100 text-brand' : 'text-slate-400'
                        }`}
                      >
                        <Users className="w-4 h-4 shrink-0" /> {currentOrderGuests}
                      </button>
                    )}
                    <button 
                      onClick={() => setIsOrderDrawerOpen(true)}
                      className={`w-11 h-11 flex items-center justify-center border rounded-lg transition-all ${
                        isOrderDrawerOpen 
                          ? 'bg-brand text-white border-brand' 
                          : 'bg-slate-50 border-slate-200 text-brand hover:bg-slate-100'
                      }`}
                      title="Thông tin bổ sung Order"
                    >
                      <NotebookPen className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Selection Bar */}
          <div className="flex items-center gap-2 relative">
            <div 
              className="flex-1 flex items-center gap-2 px-3 h-11 bg-white rounded-xl border border-slate-200 hover:border-brand/40 transition-all focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/10"
            >
              <div className="w-6 h-6 bg-brand rounded-md flex items-center justify-center text-white shrink-0">
                <User className="w-4 h-4" />
              </div>
              <input 
                type="text"
                placeholder="Nhập tên hoặc SĐT khách..."
                className="flex-1 text-sm font-medium bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 placeholder:italic"
                value={currentOrderCustomer ? `${currentOrderCustomer.name} (${currentOrderCustomer.phone})` : customerSearchQuery}
                onChange={(e) => {
                  if (currentOrderCustomer) setCurrentOrderCustomer(null);
                  setCustomerSearchQuery(e.target.value);
                  setShowCustomerDropdown(true);
                }}
                onFocus={() => setShowCustomerDropdown(true)}
              />
              {currentOrderCustomer && (
                <button 
                  onClick={() => {
                    setCurrentOrderCustomer(null);
                    setCustomerSearchQuery('');
                  }}
                  className="text-red-500 hover:bg-red-50 p-0.5 rounded"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button 
                onClick={() => setShowAddCustomerDialog(true)}
                className="text-green-600 hover:bg-green-50 p-0.5 rounded transition-colors"
                title="Thêm khách hàng mới"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showCustomerDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 text-xs font-bold text-slate-400 tracking-wider bg-slate-50/50">
                  {customerSearchQuery ? 'Kết quả tìm kiếm' : 'Khách hàng gần đây'}
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {customers
                    .filter(c => 
                      !customerSearchQuery || 
                      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || 
                      c.phone.includes(customerSearchQuery)
                    )
                    .map((cust, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (currentOrderId && currentOrderId !== 'new') {
                            setOrders(prev => prev.map(o => o.id === currentOrderId ? { ...o, customer: cust.name } : o));
                          }
                          setCurrentOrderCustomer(cust);
                          setCustomerSearchQuery('');
                          setShowCustomerDropdown(false);
                        }}
                        className="flex flex-col px-4 py-2.5 hover:bg-brand/5 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-700 flex items-center justify-between">
                            <span>{cust.name}</span>
                          </div>
                          <div className="text-[12px] text-slate-400 font-medium flex items-center flex-wrap gap-x-2">
                            <span>{cust.phone}</span>
                            <span className="text-slate-300">|</span>
                            {cust.debt !== 0 && (
                              <>
                                <span className={`italic font-bold ${cust.debt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                  Nợ: {formatCurrency(cust.debt)}
                                </span>
                                <span className="text-slate-300">|</span>
                              </>
                            )}
                            <span className="text-blue-500 font-bold">Điểm: {cust.points}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {customers.filter(c => 
                      !customerSearchQuery || 
                      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || 
                      c.phone.includes(customerSearchQuery)
                    ).length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-slate-400 mb-2">Không tìm thấy khách hàng</p>
                        <button 
                          onClick={() => {
                            setNewCustomerData(prev => ({ ...prev, phone: /^\d+$/.test(customerSearchQuery) ? customerSearchQuery : '' }));
                            setShowAddCustomerDialog(true);
                            setShowCustomerDropdown(false);
                          }}
                          className="text-brand text-sm font-bold hover:underline"
                        >
                          + Thêm mới "{customerSearchQuery}"
                        </button>
                      </div>
                    )}
                </div>
              </div>
            )}
            
            {/* Click outside to close dropdown */}
            {showCustomerDropdown && (
              <div className="fixed inset-0 z-40" onClick={() => setShowCustomerDropdown(false)}></div>
            )}
          </div>
        </div>

        {/* Order Items List */}
        <div className="flex-1 overflow-y-auto" ref={orderItemsScrollRef}>
          {orderItems.length > 0 ? (
            (() => {
              const rounds = Array.from(new Set(orderItems.map(item => (item.round as number) || 0))).sort((a, b) => {
                if (a === 0) return 1;
                if (b === 0) return -1;
                return (a as number) - (b as number);
              });
              return rounds.map((roundValue, rIdx) => {
                const round = roundValue as number;
                return (
                  <div key={round}>
                    {round > 0 && (
                      <div className="bg-slate-50 px-4 py-2 border-y border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-black text-slate-400 tracking-wider">LƯỢT {round}</span>
                        <div className="flex-1 h-[1px] bg-slate-200 mx-4"></div>
                      </div>
                    )}
                    {orderItems.filter(item => (item.round as number || 0) === round).map((item, index) => {
                      const promos = !item.isPromoRemoved ? getItemPromotion(item.name) : [];
                      let selectedPromo = null;
                      if (promos.length > 0) {
                        if (item.selectedPromoId) {
                          selectedPromo = promos.find(p => p.id === item.selectedPromoId);
                        } else {
                          selectedPromo = promos.find(p => p.isAuto) || promos[0];
                        }
                      }

                      return (
                      <div key={item.instanceId || `${item.id}-${index}`} className={`border-b border-slate-100 transition-all duration-500 relative ${item.isNew ? 'bg-blue-50/50' : selectedPromo ? 'bg-slate-50/20' : 'hover:bg-slate-50/30'}`}>
                        {item.isNew && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 z-10 animate-pulse"></div>
                        )}
                        {/* Main Item Row */}
                      <div 
                        className="px-3 py-3 grid grid-cols-[32px_1fr_120px_90px_40px] items-center gap-2 cursor-pointer group"
                        onClick={() => setCustomizingItem({ ...item, isFromCart: true })}
                      >
                        {/* 1. Processing Icon */}
                        <div className="flex items-center justify-center">
                          {item.isProcessing ? (
                            <div className="relative">
                              <CookingPot className="w-5 h-5 text-brand" />
                              <div className="absolute -top-1 left-1.5 flex gap-0.5">
                                <div className="w-0.5 h-2 bg-slate-300 rounded-full animate-steam"></div>
                                <div className="w-0.5 h-1.5 bg-slate-300 rounded-full animate-steam-delayed mt-1"></div>
                                <div className="w-0.5 h-2 bg-slate-300 rounded-full animate-steam-slow"></div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-5 h-5 group-hover:bg-brand/10 rounded-full flex items-center justify-center transition-colors">
                              <Search className="w-3.5 h-3.5 text-brand opacity-0 group-hover:opacity-100" />
                            </div>
                          )}
                        </div>

                        {/* 2. Item Info */}
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-sm text-slate-800 truncate" title={item.name}>
                            {item.name}
                          </div>
                          <div className="text-sm text-slate-400 font-normal">
                            {formatCurrency(item.price)} / {item.unit || (item.name.toLowerCase().includes('lẩu') ? 'Nồi' : (item.name.toLowerCase().includes('bia') || item.name.toLowerCase().includes('nước') ? 'Chai' : 'Đĩa'))}
                          </div>
                        </div>

                        {/* 3. Main Qty Controls */}
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg border border-slate-200 p-0.5 h-10" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => updateQty(item.id, -1, item.instanceId)}
                            className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-red-500 hover:bg-red-50 rounded-md transition-all active:scale-90"
                          >
                            <Minus className="w-4 h-4 stroke-[3]" />
                          </button>
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItemQty({ id: item.id, instanceId: item.instanceId, name: item.name });
                              setItemQtyKeypadValue(item.qty.toString());
                              setIsFirstInputItemQty(true);
                              setShowItemQtyKeypad(true);
                            }}
                            className="flex-1 text-center font-black text-sm text-slate-800 min-w-[24px] cursor-pointer hover:bg-white hover:shadow-sm rounded-md transition-all h-full flex items-center justify-center"
                          >
                            {item.qty}
                          </span>
                          <button 
                            onClick={() => updateQty(item.id, 1, item.instanceId)}
                            className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-green-600 hover:bg-green-50 rounded-md transition-all active:scale-90"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>

                        {/* 4. Total Price */}
                        <div className="text-right font-black text-sm text-slate-900 pr-1">
                          {formatCurrency(item.price * item.qty)}
                        </div>

                        {/* 5. Delete or Actions button */}
                        <div className="relative flex justify-center">
                          {item.isProcessing ? (
                            <>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  const id = item.instanceId || item.id;
                                  setActiveItemActionMenuId(activeItemActionMenuId === id ? null : id);
                                }}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                                  activeItemActionMenuId === (item.instanceId || item.id) 
                                    ? 'bg-slate-200 text-slate-800' 
                                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                }`}
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                              
                              {/* Item Action Menu Popover */}
                              <AnimatePresence>
                                {activeItemActionMenuId === (item.instanceId || item.id) && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-[100]" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveItemActionMenuId(null);
                                      }}
                                    />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                      className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 min-w-[200px] z-[101] overflow-hidden"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button 
                                        onClick={() => {
                                          const instanceId = `${item.id}-${Date.now()}`;
                                          const newItem = { ...item, instanceId, isProcessing: false, round: 0, isNew: true };
                                          setOrderItems(prev => {
                                            const reset = prev.map(oi => ({ ...oi, isNew: false }));
                                            return mergeDraftItems([...reset, newItem]);
                                          });
                                          setActiveItemActionMenuId(null);
                                          showToast('Nhân bản món thành công');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors whitespace-nowrap"
                                      >
                                        <PlusCircle className="w-4 h-4 text-brand" />
                                        Nhân bản
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setItemToTransfer(item);
                                          setShowTransferItemDialog(true);
                                          setActiveItemActionMenuId(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors whitespace-nowrap"
                                      >
                                        <SplitSquareHorizontal className="w-4 h-4 text-slate-400" />
                                        Chuyển sang Order khác
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setItemToCancel(item);
                                          setShowCancelItemDialog(true);
                                          setActiveItemActionMenuId(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors whitespace-nowrap"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        Hủy món
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeItem(item.instanceId || item.id); }}
                              className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Free Preferences (STPV) Row */}
                      {(item.addons || []).filter((a: any) => a.price === 0).length > 0 && (
                        <div className="px-3 pb-2 pl-[44px] flex flex-wrap gap-1" onClick={() => setCustomizingItem({ ...item, isFromCart: true })}>
                          {(item.addons || []).filter((a: any) => a.price === 0).map((addon: any, idx: number) => (
                            <span key={idx} className="bg-slate-50 text-slate-500 text-sm px-1.5 py-0.5 rounded font-normal border border-slate-200 uppercase whitespace-nowrap cursor-pointer">
                              {addon.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Ghi chú Row */}
                      {item.note && (
                        <div className="px-3 pb-2 pl-[44px]" onClick={() => setCustomizingItem({ ...item, isFromCart: true })}>
                          <div className="text-amber-700 text-sm px-0 py-0.5 font-normal italic flex items-start gap-1.5 cursor-pointer">
                            <NotebookPen className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60" />
                            <span className="break-words flex-1 leading-relaxed">{item.note}</span>
                          </div>
                        </div>
                      )}

                        {/* Promotion Row */}
                        {selectedPromo && (
                          <div className="px-3 pb-3 group/promo">
                            <div className="grid grid-cols-[32px_1fr_120px_90px_40px] items-center gap-2">
                              {/* Visual Connector Column */}
                              <div className="flex justify-center h-full relative">
                                <div className="w-[1.5px] border-l border-slate-200 border-dashed absolute top-0 bottom-1/2 left-1/2"></div>
                                <div className="h-[1.5px] border-t border-slate-200 border-dashed absolute top-1/2 left-1/2 right-1"></div>
                              </div>
                              
                              {/* Promotion Detail Box */}
                              <div className="col-span-2 bg-slate-50 rounded-xl p-2 flex items-center gap-2 min-w-0 transition-colors cursor-pointer" onClick={() => setCustomizingItem({ ...item, isFromCart: true })}>
                                <Tag className="w-4 h-4 text-red-500 shrink-0" />
                                <div className="text-sm font-medium text-red-500 italic truncate" title={selectedPromo.label}>
                                  {selectedPromo.label}
                                </div>
                              </div>

                              {/* Discount Amount */}
                              <div className="text-right font-black text-sm text-slate-900 pr-1">
                                {(() => {
                                  if (selectedPromo.type === 'percent') {
                                    return `-${formatCurrency(item.price * selectedPromo.discount! * item.qty)}`;
                                  } else if (selectedPromo.type === 'amount') {
                                    return `-${formatCurrency(selectedPromo.discount)}`;
                                  } else if (selectedPromo.type === 'gift') {
                                    return `-${formatCurrency(item.price)}`;
                                  }
                                  return '';
                                })()}
                              </div>

                              <div className="flex justify-center">
                                {item.isProcessing ? (
                                  <div className="w-10 h-10 flex items-center justify-center text-slate-200 cursor-not-allowed">
                                    <Trash2 className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); removePromotionFromItem(item.instanceId); }}
                                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Xóa khuyến mại"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Paid Preferences (Sub-items) */}
                      {item.addons?.filter((a: any) => a.price > 0).length > 0 && (
                        <div className="px-3 pb-3 space-y-1">
                          {item.addons?.filter((a: any) => a.price > 0).map((addon, idx) => (
                            <div key={idx} className="grid grid-cols-[32px_1fr_120px_90px_40px] items-center gap-2 py-1.5 bg-blue-50/30 rounded-lg">
                              {/* 1. Processing Icon for addon */}
                              <div className="flex items-center justify-center">
                                {item.isProcessing ? (
                                  <CookingPot className="w-3.5 h-3.5 text-blue-400" />
                                ) : (
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0 ml-1"></div>
                                )}
                              </div>

                              {/* 2. Addon Info */}
                              <div className="min-w-0 pr-2 flex items-center gap-2">
                                <div className="truncate">
                                  <div className="text-sm font-normal text-blue-700 truncate">{addon.name}</div>
                                  <div className="text-sm text-blue-400 font-normal">+{formatCurrency(addon.price)}</div>
                                </div>
                              </div>

                              {/* 3. Addon Qty Controls */}
                              <div className="flex items-center gap-1 bg-slate-100 rounded-lg border border-slate-200 p-0.5 h-10">
                                <button 
                                  onClick={() => updateAddonQty(item.instanceId || item.id, addon.name, -1)}
                                  className="w-9 h-9 flex items-center justify-center bg-white shadow-sm text-blue-600 hover:bg-blue-50 rounded-md transition-all active:scale-90"
                                >
                                  <Minus className="w-4 h-4 stroke-[3]" />
                                </button>
                                <span className="flex-1 text-center font-black text-sm text-blue-900 min-w-[24px]">{addon.qty}</span>
                                <button 
                                  onClick={() => updateAddonQty(item.instanceId || item.id, addon.name, 1)}
                                  className="w-9 h-9 flex items-center justify-center bg-white shadow-sm text-blue-600 hover:bg-blue-50 rounded-md transition-all active:scale-90"
                                >
                                  <Plus className="w-4 h-4 stroke-[3]" />
                                </button>
                              </div>

                              {/* 4. Addon Total Price */}
                              <div className="text-right font-black text-sm text-blue-700 pr-1">
                                {formatCurrency(addon.price * addon.qty)}
                              </div>

                              {/* 5. Empty col */}
                              <div></div>
                            </div>
                          ))}
                        </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                );
              });
            })()
        ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                <circle cx="50" cy="50" r="50" fill="url(#paint0_linear_empty_order_main)"/>
                <g clipPath="url(#clip0_empty_order_main)">
                  <path d="M31.2389 43.288C28.7651 48.0323 27.6186 57.1713 28.4096 64.6393L36.6428 59.0767C36.7144 56.2754 35.1689 47.1831 33.0852 43.2807C32.7071 42.5726 31.61 42.5764 31.2389 43.288Z" fill="white"/>
                  <path d="M38.7254 62.2266V43.5597C38.7254 43.1279 38.1189 42.9813 37.9034 43.3611C33.7168 50.7371 30.9262 57.8189 29.3761 64.6392L38.7254 62.2266Z" fill="#F0F0F0"/>
                  <path d="M27.8037 64.6395C30.7828 61.0698 35.0902 57.6113 40.1131 54.2127C40.4247 54.0019 40.8454 54.2239 40.8454 54.6V64.6395L34.3245 66.1166L27.8037 64.6395Z" fill="white"/>
                  <path d="M50.219 28.6756V34.7534H56.3579V28.6756C56.3579 28.1938 55.9674 27.8032 55.4855 27.8032H51.0914C50.6097 27.8032 50.219 28.1938 50.219 28.6756Z" fill="#407194"/>
                  <path d="M55.4857 27.8032H52.7402C53.2221 27.8032 53.6128 28.1938 53.6128 28.6756V34.7534H56.3581V28.6756C56.3579 28.1938 55.9674 27.8032 55.4857 27.8032Z" fill="#365F7E"/>
                  <path d="M45.9698 46.6528C46.2918 44.8462 47.2967 43.2123 48.802 42.1089L49.7193 41.4383C50.0339 41.2078 50.2188 40.8415 50.2188 40.453V34.7542H56.3577V40.453C56.3577 40.8415 56.5437 41.2078 56.8569 41.4383L57.7742 42.1089C59.2794 43.2123 60.2854 44.8462 60.6074 46.6528L53.2884 48.1298L45.9698 46.6528Z" fill="#8DBEFF"/>
                  <path d="M60.7199 58.9072V68.8972C60.7199 69.3433 60.3596 69.7037 59.9135 69.7037L53.2892 71.1809L46.6634 69.7037C46.2188 69.7037 45.8582 69.3433 45.8582 68.8972V58.9072H60.7199Z" fill="#8DBEFF"/>
                  <path d="M57.5868 46.6528C57.1156 45.2761 56.2323 44.0558 55.0284 43.1739L54.1126 42.5033C53.7979 42.2729 53.6129 41.908 53.6129 41.518V34.7542H56.3581V40.453C56.3581 40.8415 56.5441 41.2078 56.8573 41.4383L57.7746 42.1089C59.2798 43.2123 60.2857 44.8462 60.6078 46.6528H57.5868Z" fill="#4997FF"/>
                  <path d="M60.7196 58.9072V68.8972C60.7196 69.3433 60.3594 69.7037 59.9133 69.7037H57.1687C57.6133 69.7037 57.9737 69.3433 57.9737 68.8972V58.9072H60.7196Z" fill="#4997FF"/>
                  <path d="M45.8582 47.9153V58.9074L52.8135 61.3629C53.11 61.4676 53.4334 61.4678 53.7301 61.3635L60.72 58.9074V47.9153C60.72 47.4878 60.6816 47.0652 60.6079 46.6516H45.9703C45.8965 47.0652 45.8582 47.4878 45.8582 47.9153Z" fill="#F4DAA7"/>
                  <path d="M60.6623 47.0178C60.6469 46.8956 60.6292 46.7723 60.6077 46.6516H57.5839C57.8374 47.3924 57.9742 48.1775 57.9742 48.9805V59.872L60.7199 58.9073V47.9152C60.7198 47.6305 60.6964 47.2894 60.6623 47.0178Z" fill="#EEC06B"/>
                  <path d="M18.2852 64.6401H49.3863C49.9889 64.6401 50.2455 65.4063 49.7645 65.7693L45.0533 69.3234C44.7258 69.5706 44.3266 69.7043 43.9163 69.7043L33.8358 71.1814L23.7552 69.7043C23.3449 69.7043 22.9457 69.5706 22.6183 69.3234L17.907 65.7693C17.4261 65.4063 17.6826 64.6401 18.2852 64.6401Z" fill="#4980AC"/>
                  <path d="M70.0488 68.8556C69.4185 68.8556 68.9076 68.3447 68.9076 67.7144V57.4437C68.9076 56.8134 69.4185 56.3025 70.0488 56.3025C70.6791 56.3025 71.1901 56.8134 71.1901 57.4437V67.7144C71.1901 68.3447 70.6791 68.8556 70.0488 68.8556Z" fill="#D9D9D9"/>
                  <path d="M66.8271 48.5874L65.5919 56.6591C65.2307 59.0198 67.0575 61.1473 69.4455 61.1473H70.9392C73.3273 61.1473 75.1541 59.0198 74.7928 56.6591L73.5576 48.5874C73.497 48.1915 73.1565 47.8992 72.7559 47.8992H67.6286C67.2281 47.8990 66.8876 48.1914 66.8271 48.5874Z" fill="url(#paint1_linear_empty_order_main)"/>
                  <path d="M69.9294 66.3865C67.6472 66.3865 65.7704 68.1227 65.5483 70.3464C65.5246 70.5829 65.7071 70.7896 65.9447 70.7896L70.0514 72.2667L73.914 70.7896C74.1516 70.7896 74.3341 70.5829 74.3104 70.3464C74.0881 68.1227 72.2116 66.3865 69.9294 66.3865Z" fill="#DADADA"/>
                  <path d="M83.3383 90.1446C79.3904 92.6759 74.0879 93.5444 69.4075 92.2952C63.1528 96.7609 53.3398 97.9935 46.2186 94.6982C39.0974 97.9935 29.2844 96.7609 23.0295 92.2952C18.3491 93.5443 13.0467 92.6759 9.09876 90.1446C8.62356 89.8399 8.35826 89.2949 8.40967 88.7327L9.77352 73.8293C9.98741 71.4923 11.9473 69.7036 14.2941 69.7036H78.143C80.4897 69.7036 82.4496 71.4923 82.6635 73.8293L84.0274 88.7327C84.0788 89.2949 83.8136 89.8399 83.3383 90.1446Z" fill="#DDEBFD"/>
                  <path d="M84.0272 88.7329L82.7263 74.5174C82.6566 74.2837 82.8566 71.8371 80.5481 70.3929C79.8504 69.9564 79.0252 69.7036 78.1429 69.7036H14.2941C11.9473 69.7036 9.98745 71.4923 9.77356 73.8293L9.71063 74.5174C10.5718 73.4653 11.8791 72.8006 13.3307 72.8006H78.0873C78.5185 72.8006 78.8856 73.1056 78.9748 73.5275C79.0198 73.7405 79.0522 73.959 79.0711 74.1822L80.435 90.3597C80.4846 90.9477 80.2379 91.5159 79.7949 91.8526C81.0496 91.4173 82.243 90.8465 83.3328 90.1483C83.8101 89.8425 84.0789 89.2975 84.0272 88.7329Z" fill="#BED9FD"/>
                  <path d="M46.2183 81.9937C45.588 81.9937 45.0771 82.5046 45.0771 83.1349V95.1767C45.4638 95.0288 45.8455 94.8715 46.2183 94.6991C46.5911 94.8716 46.973 95.0289 47.3597 95.1768V83.135C47.3597 82.5046 46.8488 81.9937 46.2183 81.9937Z" fill="#BED9FD"/>
                  <path d="M69.4075 83.1968C68.7772 83.1968 68.2662 83.7077 68.2662 84.338V93.0501C68.6578 92.8099 69.0392 92.5593 69.4075 92.2963C69.7842 92.3969 70.1651 92.4822 70.5489 92.5556V84.338C70.5487 83.7079 70.0378 83.1968 69.4075 83.1968Z" fill="#BED9FD"/>
                  <path d="M23.0294 83.1968C22.3991 83.1968 21.8881 83.7077 21.8881 84.338V92.5556C22.2717 92.4823 22.6527 92.3969 23.0294 92.2963C23.3976 92.5593 23.779 92.8099 24.1706 93.0501V84.338C24.1706 83.7079 23.6597 83.1968 23.0294 83.1968Z" fill="#BED9FD"/>
                </g>
                <defs>
                  <linearGradient id="paint0_linear_empty_order_main" x1="50" y1="0" x2="49.5798" y2="94.958" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#CBEFFF"/>
                    <stop offset="0.521031" stopColor="#EDF8FF"/>
                    <stop offset="1" stopColor="white"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_empty_order_main" x1="73.234" y1="54.7548" x2="74.0743" y2="59.7968" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#E0E0E0"/>
                  </linearGradient>
                  <clipPath id="clip0_empty_order_main">
                    <rect width="75.6302" height="75.6302" fill="white" transform="translate(11.7647 24.3696)"/>
                  </clipPath>
                </defs>
              </svg>
              <p className="text-slate-500 font-normal text-sm">Vui lòng chọn món để thêm Order</p>
            </div>
          )}
        </div>

        {/* Bottom Summary Area */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setSelectedTimeSlotId(autoSelectTimeByCurrentTime());
                  setShowTimeSlotDialog(true);
                }}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-brand active:scale-95 transition-all"
              >
                <Timer className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setShowPromotionDialog(true)}
                className="relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-red-500 active:scale-95 transition-all"
              >
                <Gift className="w-6 h-6" />
                {appliedOrderPromos.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-in zoom-in duration-200">
                    {appliedOrderPromos.length}
                  </div>
                )}
              </button>
              <button 
                onClick={() => {
                  if (currentOrderId && currentOrderId !== 'new') {
                    setShowKitchenHistoryDialog(true);
                  } else {
                    showToast('Đơn hàng chưa có lịch sử gửi bếp');
                  }
                }}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-brand active:scale-95 transition-all"
              >
                <History className="w-6 h-6" />
              </button>
            </div>
            <div 
              onClick={() => setShowOrderSummaryDialog(true)}
              className="flex items-center gap-2 text-brand font-bold text-2xl cursor-pointer hover:opacity-80 transition-all active:scale-95"
            >
              <span className="text-slate-500 text-sm font-medium">Tổng tiền:</span>
              {formatCurrency(totalAmount)}
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>

          {/* Action Buttons Row 1 */}
          {isPickingDishes ? (
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => {
                  setOrderItems(orderBackup.items);
                  setCurrentOrderId(orderBackup.currentOrderId);
                  setIsPickingDishes(false);
                  setOrderBackup({ items: [], currentOrderId: null });
                  setCurrentScreen('reservations');
                  if (!selectedReservation) {
                    setShowAddReservation(true);
                  } else {
                    setShowReservationDetail(true);
                  }
                }}
                className="h-12 bg-slate-500 hover:bg-slate-600 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all active:scale-[0.98]"
              >
                <XCircle className="w-5 h-5 text-white" /> Hủy chọn
              </button>
              <button 
                onClick={() => {
                  if (!selectedReservation) {
                    setNewReservation(prev => ({ ...prev, preorderedDishes: orderItems }));
                  } else {
                    setSelectedReservation((prev: any) => ({ ...prev, preorderedDishes: orderItems }));
                  }
                  setOrderItems(orderBackup.items);
                  setCurrentOrderId(orderBackup.currentOrderId);
                  setIsPickingDishes(false);
                  setOrderBackup({ items: [], currentOrderId: null });
                  setCurrentScreen('reservations');
                  if (!selectedReservation) {
                    setShowAddReservation(true);
                  } else {
                    setShowReservationDetail(true);
                  }
                  showToast('Đã cập nhật món ăn đặt trước!');
                }}
                className="col-span-2 h-12 bg-brand hover:brightness-105 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all active:scale-[0.98]"
              >
                <CheckCircle2 className="w-5 h-5 text-white" /> Xác nhận chọn món
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Secondary Actions */}
              <div className="grid grid-cols-4 gap-2">
                <button 
                  onClick={() => {
                    handleSafeNavigation('orderList');
                  }}
                  className="flex items-center justify-center gap-1.5 h-11 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs active:scale-[0.98] transition-all"
                >
                  <XCircle className="w-4 h-4 text-[#717680]" /> Đóng
                </button>
                <button 
                  onClick={() => setShowPrinterDialog(true)}
                  className="flex items-center justify-center gap-1.5 h-11 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs active:scale-[0.98] transition-all"
                >
                  <Printer className="w-4 h-4 text-[#717680]" /> In tạm
                </button>
                <button 
                  onClick={() => setShowOtherItemDialog(true)}
                  className="flex items-center justify-center gap-1.5 h-11 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs active:scale-[0.98] transition-all"
                >
                  <Plus className="w-4 h-4 text-[#717680]" /> Món khác
                </button>
                <button 
                  onClick={() => showToast('Đã nhắc bếp thành công')}
                  className="flex items-center justify-center gap-1.5 h-11 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs active:scale-[0.98] transition-all"
                >
                  <Bell className="w-4 h-4 text-[#717680]" /> Nhắc bếp
                </button>
              </div>

              {/* Primary Actions */}
              <div className={`grid ${currentOrderChannel === 'delivery' ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
                <button 
                  id="tour-cart-save-btn"
                  onClick={() => {
                    handleSaveOrder();
                    setCurrentScreen('orderList');
                  }}
                  className="h-12 bg-[#12B76A] hover:brightness-105 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs active:scale-[0.98] transition-all shadow-sm"
                >
                  <Save className="w-5 h-5 text-white" /> Lưu
                </button>
                <button 
                  onClick={() => {
                    if (currentOrderChannel === 'delivery' && !validateOrderDrawer()) {
                      setIsOrderDrawerOpen(true);
                      return;
                    }

                    if (currentOrderChannel === 'delivery') {
                      const now = new Date();
                      const deliveryDateTime = new Date(`${orderDrawerData.deliveryDate}T${orderDrawerData.deliveryTime}`);
                      if (deliveryDateTime < now) {
                        if (!window.confirm('Thời gian giao đã qua, bạn có chắc chắn không?')) {
                          setIsOrderDrawerOpen(true);
                          return;
                        }
                      }
                    }

                    const maxRound = Math.max(0, ...orderItems.map(item => (item.round as number) || 0));
                    const nextRound = maxRound + 1;
                    
                    const updatedItems = orderItems.map(item => 
                      !item.isProcessing 
                        ? { ...item, isProcessing: true, round: nextRound } 
                        : item
                    );
                    
                    const itemsBeingSent = orderItems.filter(item => !item.isProcessing).map(item => ({...item}));
                    const historyEntry = {
                      round: nextRound,
                      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                      fullTime: new Date().toLocaleString('vi-VN'),
                      items: itemsBeingSent
                    };
                    
                    setOrderItems(updatedItems);
                    
                    if (currentOrderId === 'new') {
                      const newId = `new-${Date.now()}`;
                      const newOrder = {
                        id: newId,
                        channel: currentOrderChannel,
                        tables: currentOrderChannel === 'table' ? (selectedTable ? [selectedTable] : ['110']) : [],
                        orderNo: (orders.length + 50).toString(),
                        amount: totalAmount,
                        customer: currentOrderCustomer ? currentOrderCustomer.name : 'Khách lẻ',
                        customerData: currentOrderCustomer,
                        guests: currentOrderGuests,
                        dishes: updatedItems.length,
                        time: '0h 01\'',
                        minutes: 1,
                        status: 'serving',
                        isSentToKitchen: true,
                        items: updatedItems,
                        kitchenHistory: [historyEntry],
                        orderData: currentOrderChannel === 'delivery' ? orderDrawerData : null
                      };
                      setOrders([newOrder, ...orders]);
                      setLastInteractedOrderId(newId);
                      setCurrentOrderId(newId);
                    } else {
                      setOrders(prev => prev.map(o => o.id === currentOrderId ? { 
                        ...o, 
                        amount: totalAmount, 
                        dishes: updatedItems.length, 
                        isSentToKitchen: true, 
                        items: updatedItems,
                        customer: currentOrderCustomer ? currentOrderCustomer.name : o.customer,
                        customerData: currentOrderCustomer || o.customerData,
                        kitchenHistory: [...(o.kitchenHistory || []), historyEntry]
                      } : o));
                      setLastInteractedOrderId(currentOrderId);
                    }

                    showToast('Gửi bếp/bar thành công!');
                    setCurrentScreen('orderList');
                  }}
                  id="tour-cart-send-kitchen"
                  disabled={!orderItems.some(item => !item.isProcessing)}
                  className="h-12 bg-[#245FDF] hover:brightness-105 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChefHat className="w-5 h-5 text-white" /> Gửi bếp/bar
                </button>
                <button 
                  onClick={() => {
                    if (currentOrderChannel === 'delivery' && !validateOrderDrawer()) {
                      setIsOrderDrawerOpen(true);
                      return;
                    }

                    if (currentOrderChannel === 'delivery') {
                      const now = new Date();
                      const deliveryDateTime = new Date(`${orderDrawerData.deliveryDate}T${orderDrawerData.deliveryTime}`);
                      if (deliveryDateTime < now) {
                        if (!window.confirm('Thời gian giao đã qua, bạn có chắc chắn không?')) {
                          setIsOrderDrawerOpen(true);
                          return;
                        }
                      }
                    }

                    setPreviousScreen('order');
                    setCurrentScreen('payment');
                  }}
                  className="h-12 bg-[#F79009] hover:brightness-105 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs active:scale-[0.98] transition-all shadow-sm"
                >
                  <Receipt className="w-5 h-5 text-white" /> Tính tiền
                </button>
                
                {currentOrderChannel === 'delivery' && (
                  <button 
                    onClick={() => {
                      if (!validateOrderDrawer()) {
                        setIsOrderDrawerOpen(true);
                        return;
                      }

                      const now = new Date();
                      const deliveryDateTime = new Date(`${orderDrawerData.deliveryDate}T${orderDrawerData.deliveryTime}`);
                      if (deliveryDateTime < now) {
                        if (!window.confirm('Thời gian giao đã qua, bạn có chắc chắn không?')) {
                          setIsOrderDrawerOpen(true);
                          return;
                        }
                      }

                      showToast('Đã bắt đầu quy trình giao hàng!');
                      setCurrentScreen('orderList');
                      
                      if (currentOrderId !== 'new') {
                        setOrders(prev => prev.map(o => o.id === currentOrderId ? { ...o, status: 'delivering' } : o));
                      }
                    }}
                    className="h-12 bg-[#1570EF] hover:brightness-105 text-white rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs active:scale-[0.98] transition-all shadow-sm"
                  >
                    <Truck className="w-5 h-5 text-white" /> Giao hàng
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Menu or Customization (~65%) */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!customizingItem ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col gap-2 overflow-hidden"
            >
              {/* Menu Header: Categories & Search */}
            <div className="flex items-center gap-2 shrink-0">
              <div className={`flex-1 flex gap-2 overflow-x-auto hide-scrollbar py-1 transition-all duration-300 ${isMenuSearchExpanded ? 'opacity-0 pointer-events-none w-0' : 'opacity-100'}`}>
                {menuCategories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 h-11 rounded-full text-sm transition-all whitespace-nowrap border ${
                      activeCategory === cat 
                        ? 'bg-brand text-white border-brand font-black text-base' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className={`relative transition-all duration-300 ease-in-out flex items-center ${isMenuSearchExpanded ? 'w-full' : 'w-10'}`}>
                {isMenuSearchExpanded ? (
                  <div className="w-full flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="Tìm kiếm món ăn" 
                        value={searchQuery || ''}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-11 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:border-brand shadow-sm text-sm font-medium bg-white"
                      />
                      <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                    <button 
                      onClick={() => {
                        setIsMenuSearchExpanded(false);
                        setSearchQuery('');
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsMenuSearchExpanded(true)}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:border-brand hover:text-brand transition-all"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Menu Grid: 5 columns as per image */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-5 gap-2">
                {filteredMenuItems.map((item, idx) => (
                  <div 
                    id={idx === 0 ? "tour-menu-first-item" : undefined}
                    key={item.id}
                    onClick={() => handleAddToCart(item)}
                    className="bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col cursor-pointer active:scale-95 transition-all group"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {(() => {
                        const count = orderItems.filter(oi => oi.id === item.id).reduce((sum, oi) => sum + oi.qty, 0);
                        return count > 0 && (
                          <div className="absolute top-2 left-2 bg-brand text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-black border border-white z-10 animate-in zoom-in duration-300">
                            {count}
                          </div>
                        );
                      })()}
                      <div className="absolute top-0 right-0 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-bl-xl flex items-center gap-1 text-xs font-bold">
                        {formatCurrency(item.price)}
                        <Info className="w-3 h-3 opacity-80" />
                      </div>
                    </div>
                    <div className="p-2.5 text-center bg-white">
                      <div className="font-bold text-sm text-slate-700 line-clamp-1">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredMenuItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mt-2">
                  <PackageX className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-slate-600 font-bold text-sm text-center">
                    Không tìm thấy món "{searchQuery}"
                  </p>
                  <p className="text-slate-400 text-xs mt-1 text-center max-w-[280px]">
                    Món này chưa có trong thực đơn của nhà hàng. Bạn có muốn thiết lập thêm nhanh món mới?
                  </p>
                  <button 
                    onClick={() => {
                      setQuickAddDishName(searchQuery);
                      setQuickAddDishPrice(0);
                      setQuickAddDishCategory(activeCategory !== 'Hay dùng' ? activeCategory : 'Món chính');
                      setShowQuickAddDishDialog(true);
                    }}
                    className="mt-4 h-10 px-6 bg-brand text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-md shadow-blue-200"
                  >
                    <Plus className="w-4 h-4" /> Thêm nhanh món mới
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="customization"
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Customization Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                  {(customizingItem.id?.toString().startsWith('other_') || !customizingItem.image) ? (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <UtensilsCrossed className="w-6 h-6" />
                    </div>
                  ) : (
                    <img src={customizingItem.image} alt={customizingItem.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{customizingItem.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-brand font-black text-base">{formatCurrency(customizingItem.price)}</span>
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200 scale-90 origin-left h-10">
                      <button 
                        onClick={() => {
                          ensureItemInCart(customizingItem);
                          updateQty(customizingItem.id, -1);
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-white shadow-sm text-red-500 rounded-md transition-all active:scale-90"
                      >
                        <Minus className="w-4 h-4 stroke-[3]" />
                      </button>
                      <span className="w-8 text-center font-black text-slate-800 text-sm">
                        {orderItems.find(oi => oi.id === customizingItem.id)?.qty || 0}
                      </span>
                      <button 
                        onClick={() => {
                          ensureItemInCart(customizingItem);
                          updateQty(customizingItem.id, 1);
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-white shadow-sm text-green-600 rounded-md transition-all active:scale-90"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Split View Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar: Categories */}
              <div className="w-56 bg-slate-50 border-r border-slate-100 overflow-y-auto shrink-0">
                <div className="p-2 space-y-1">
                  {customizingItem.availableAddons?.map((group: any) => (
                    <button 
                      key={group.category}
                      onClick={() => setActiveCustomCategory(group.category)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all ${
                        activeCustomCategory === group.category 
                          ? 'bg-white text-brand shadow-sm border border-slate-200' 
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Tag className={`w-5 h-5 ${activeCustomCategory === group.category ? 'text-brand' : 'text-slate-400'}`} />
                        {group.category}
                      </div>
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        {orderItems.find(oi => (oi.instanceId && customizingItem.instanceId && oi.instanceId === customizingItem.instanceId) || oi.id === customizingItem.id)?.addons.filter((a: any) => group.items.some((gi: any) => gi.name === a.name)).length || 0}
                      </span>
                    </button>
                  ))}

                  {getItemPromotion(customizingItem.name).length > 0 && (
                    <button 
                      onClick={() => setActiveCustomCategory('Khuyến mại')}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold text-sm transition-all ${
                        activeCustomCategory === 'Khuyến mại' 
                          ? 'bg-white text-red-500 shadow-sm border border-red-100' 
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Gift className={`w-5 h-5 ${activeCustomCategory === 'Khuyến mại' ? 'text-red-500' : 'text-slate-400'}`} />
                      Khuyến mại
                    </button>
                  )}

                  <button 
                    onClick={() => setActiveCustomCategory('Ghi chú')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold text-sm transition-all ${
                      activeCustomCategory === 'Ghi chú' 
                        ? 'bg-white text-brand shadow-sm border border-slate-200' 
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <NotebookPen className={`w-5 h-5 ${activeCustomCategory === 'Ghi chú' ? 'text-brand' : 'text-slate-400'}`} />
                    Ghi chú
                  </button>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white relative">
                <AnimatePresence mode="wait">
                  {activeCustomCategory === 'Khuyến mại' && (
                    <motion.div 
                      key="promo"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-black text-slate-800">Chọn chương trình khuyến mại</h4>
                        <button 
                          onClick={() => {
                            const instanceId = customizingItem.instanceId;
                            setOrderItems(items => items.map(item => 
                              (item.instanceId === instanceId || (!instanceId && item.id === customizingItem.id))
                                ? { ...item, isPromoRemoved: !item.isPromoRemoved }
                                : item
                            ));
                          }}
                          className={`text-sm font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            (customizingItem.instanceId 
                              ? orderItems.find(oi => oi.instanceId === customizingItem.instanceId)
                              : orderItems.find(oi => oi.id === customizingItem.id && !oi.instanceId))?.isPromoRemoved
                              ? 'bg-slate-100 text-slate-400 border-slate-200'
                              : 'bg-red-50 text-red-500 border-red-100'
                          }`}
                        >
                          {(customizingItem.instanceId 
                            ? orderItems.find(oi => oi.instanceId === customizingItem.instanceId)
                            : orderItems.find(oi => oi.id === customizingItem.id && !oi.instanceId))?.isPromoRemoved ? 'Áp dụng lại' : 'Tạm dừng KM'}
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {getItemPromotion(customizingItem.name).map((promo: any, idx: number) => {
                          const itemInCart = customizingItem.instanceId 
                            ? orderItems.find(oi => oi.instanceId === customizingItem.instanceId)
                            : orderItems.find(oi => oi.id === customizingItem.id && !oi.instanceId);
                          const isSelected = itemInCart?.selectedPromoId ? itemInCart.selectedPromoId === promo.id : promo.isAuto;
                          const isDisabled = itemInCart?.isPromoRemoved;

                          return (
                            <label 
                              key={promo.id} 
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                                isSelected ? 'bg-red-50 border-red-200 ring-1 ring-red-100' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                              } ${isDisabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                                  <Gift className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold truncate">{promo.label}</div>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    {promo.isAuto ? 'Tự động áp dụng' : 'Khuyến mại tùy chọn'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-red-500 bg-red-500' : 'border-slate-300 bg-white'}`}>
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white animate-in zoom-in-50 duration-200"></div>}
                                </div>
                                <input 
                                  type="radio" 
                                  className="sr-only" 
                                  checked={isSelected}
                                  onChange={() => {
                                    const instanceId = customizingItem.instanceId;
                                    setOrderItems(items => items.map(item => 
                                      (item.instanceId === instanceId || (!instanceId && item.id === customizingItem.id))
                                        ? { ...item, selectedPromoId: promo.id, isPromoRemoved: false }
                                        : item
                                    ));
                                  }}
                                />
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {customizingItem.availableAddons?.map((group: any) => (
                    activeCustomCategory === group.category && (
                      <motion.div 
                        key={group.category} 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        <h4 className="text-base font-black text-slate-800 mb-3">{group.category}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {group.items?.map((addon: any, idx: number) => {
                            const itemInCart = customizingItem.instanceId 
                              ? orderItems.find(oi => oi.instanceId === customizingItem.instanceId)
                              : orderItems.find(oi => oi.id === customizingItem.id && !oi.instanceId);
                            const selectedAddon = itemInCart?.addons.find((a: any) => a.name === addon.name);
                            const isSelected = !!selectedAddon;
                            
                            return (
                              <div 
                                id={idx === 0 ? "tour-addon-first-item" : undefined}
                                key={addon.name}
                                onClick={() => {
                                  ensureItemInCart(customizingItem);
                                  toggleAddon(customizingItem.id, addon, customizingItem.instanceId);
                                }}
                                className={`p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 cursor-pointer ${
                                  isSelected 
                                    ? 'border-brand bg-blue-50 text-brand' 
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 shadow-sm'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                  isSelected ? 'bg-brand border-brand' : 'border-slate-200 bg-white'
                                }}`}>
                                  {isSelected && <Check className="w-4 h-4 text-white stroke-[4]" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold truncate">{addon.name}</div>
                                  {addon.price > 0 ? (
                                    <div className="text-sm opacity-70 font-medium text-brand">
                                      +{formatCurrency(addon.price)} {isSelected && selectedAddon.qty > 1 ? `(Tổng: ${formatCurrency(addon.price * selectedAddon.qty)})` : ''}
                                    </div>
                                  ) : (
                                    <div className="text-sm opacity-70 font-medium">Miễn phí</div>
                                  )}
                                </div>

                                {isSelected && addon.price > 0 && (
                                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200 shadow-sm h-10" onClick={e => e.stopPropagation()}>
                                    <button 
                                      onClick={() => updateAddonQty(customizingItem.instanceId || customizingItem.id, addon.name, -1)}
                                      className="w-9 h-9 flex items-center justify-center bg-white shadow-sm text-blue-600 hover:bg-blue-50 rounded-md transition-all active:scale-90"
                                    >
                                      <Minus className="w-4 h-4 stroke-[3]" />
                                    </button>
                                    <span className="w-8 text-center font-black text-sm text-slate-800">{selectedAddon.qty}</span>
                                    <button 
                                      onClick={() => updateAddonQty(customizingItem.instanceId || customizingItem.id, addon.name, 1)}
                                      className="w-9 h-9 flex items-center justify-center bg-white shadow-sm text-blue-600 hover:bg-blue-50 rounded-md transition-all active:scale-90"
                                    >
                                      <Plus className="w-4 h-4 stroke-[3]" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )
                  ))}

                  {activeCustomCategory === 'Ghi chú' && (
                    <motion.div 
                      key="notes"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <h4 className="text-base font-black text-slate-800">Ghi chú đặc biệt</h4>
                      
                      <div className="relative group">
                        <textarea 
                          placeholder="Ví dụ: Không hành, ít cay, nước trong..."
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand font-medium text-sm transition-all min-h-[120px] pr-12"
                          value={customizingItem.instanceId 
                            ? (orderItems.find(oi => oi.instanceId === customizingItem.instanceId)?.note || '')
                            : (orderItems.find(oi => oi.id === customizingItem.id && !oi.instanceId)?.note || '')
                          }
                          onChange={(e) => {
                            ensureItemInCart(customizingItem);
                            const instanceId = customizingItem.instanceId;
                            setOrderItems(items => {
                              const updated = items.map(item => 
                                (instanceId && item.instanceId === instanceId) || (!instanceId && item.id === customizingItem.id) 
                                  ? { ...item, note: e.target.value } 
                                  : item
                              );
                              return mergeDraftItems(updated);
                            });
                          }}
                        />
                        {customizingItem.instanceId 
                          ? orderItems.find(oi => oi.instanceId === customizingItem.instanceId)?.note && (
                            <button 
                              onClick={() => {
                                const instanceId = customizingItem.instanceId;
                                setOrderItems(items => {
                                  const updated = items.map(item => 
                                    item.instanceId === instanceId
                                      ? { ...item, note: '' } 
                                      : item
                                  );
                                  return mergeDraftItems(updated);
                                });
                              }}
                              className="absolute right-3 top-3 p-1.5 bg-slate-200 rounded-full text-slate-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )
                          : orderItems.find(oi => oi.id === customizingItem.id && !oi.instanceId)?.note && (
                            <button 
                              onClick={() => {
                                setOrderItems(items => {
                                  const updated = items.map(item => 
                                    (item.id === customizingItem.id && !item.instanceId)
                                      ? { ...item, note: '' } 
                                      : item
                                  );
                                  return mergeDraftItems(updated);
                                });
                              }}
                              className="absolute right-3 top-3 p-1.5 bg-slate-200 rounded-full text-slate-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )
                        }
                        <NotebookPen className="w-5 h-5 text-slate-300 absolute right-4 bottom-4" />
                      </div>

                      {/* Quick Notes */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {['Ít cay', 'Nhiều cay', 'Không hành', 'Chín kỹ', 'Tái', 'Thêm chanh', 'Thêm ớt', 'Uống lạnh', 'Thêm đá', 'Không đá'].map(note => {
                          const itemInCart = customizingItem.instanceId 
                            ? orderItems.find(oi => oi.instanceId === customizingItem.instanceId)
                            : orderItems.find(oi => oi.id === customizingItem.id && !oi.instanceId);
                          const isNoteActive = itemInCart?.note?.split(',').map((p: string) => p.trim()).includes(note);
                          
                          return (
                            <button
                              key={note}
                              onClick={() => {
                                ensureItemInCart(customizingItem);
                                const instanceId = customizingItem.instanceId;
                                setOrderItems(items => {
                                  const updated = items.map(item => {
                                    if ((instanceId && item.instanceId === instanceId) || (!instanceId && item.id === customizingItem.id)) {
                                      const currentNote = item.note || '';
                                      const parts = currentNote.split(',').map((p: string) => p.trim()).filter((p: string) => p !== '');
                                      if (parts.includes(note)) {
                                        const filtered = parts.filter((p: string) => p !== note);
                                        return { ...item, note: filtered.join(', ') };
                                      }
                                      return { ...item, note: [...parts, note].join(', ') };
                                    }
                                    return item;
                                  });
                                  return mergeDraftItems(updated);
                                });
                              }}
                              className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all border flex items-center gap-2 ${
                                isNoteActive
                                  ? 'bg-brand text-white border-brand shadow-md active:scale-95'
                                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-sm'
                              }`}
                            >
                              {!isNoteActive && <Plus className="w-3.5 h-3.5 text-slate-400" />}
                              {note}
                              {isNoteActive && <X className="w-3.5 h-3.5 ml-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Customization Footer */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0 flex justify-end gap-3">
              <button 
                onClick={() => setCustomizingItem(null)}
                className="px-8 h-10 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-bold text-[13px] shadow-sm active:scale-[0.98] transition-all flex items-center justify-center min-w-[120px]"
              >
                Hủy
              </button>
              <button 
                id="tour-customization-confirm"
                onClick={() => setCustomizingItem(null)}
                className="px-8 h-10 bg-brand text-white rounded-lg font-bold text-[13px] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center min-w-[120px] whitespace-nowrap"
              >
                Xác nhận {(() => {
                  const itemInCart = customizingItem.instanceId 
                    ? orderItems.find(oi => oi.instanceId === customizingItem.instanceId)
                    : orderItems.find(oi => oi.id === customizingItem.id && !oi.instanceId);
                  if (!itemInCart) return '';
                  
                  // Calculate discounted base price
                  const promos = !itemInCart.isPromoRemoved ? getItemPromotion(itemInCart.name) : [];
                  let selectedPromo = null;
                  if (promos.length > 0) {
                    selectedPromo = itemInCart.selectedPromoId ? promos.find(p => p.id === itemInCart.selectedPromoId) : promos.find(p => p.isAuto) || promos[0];
                  }

                  let basePrice = itemInCart.price;
                  let promoDiscount = 0;
                  if (selectedPromo) {
                    if (selectedPromo.type === 'percent') {
                      promoDiscount = basePrice * selectedPromo.discount! * itemInCart.qty;
                    } else if (selectedPromo.type === 'amount') {
                      promoDiscount = selectedPromo.discount!;
                    } else if (selectedPromo.type === 'gift') {
                      promoDiscount = basePrice;
                    }
                  }

                  const addonsTotal = (itemInCart.addons || []).reduce((sum: number, a: any) => sum + ((a.price || 0) * (a.qty || 0)), 0);
                  const total = (basePrice * itemInCart.qty) - promoDiscount + addonsTotal;
                  return `- ${formatCurrency(total)}`;
                })()}
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Item Quantity Keypad Popup */}
        <AnimatePresence>
          {showItemQtyKeypad && editingItemQty && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowItemQtyKeypad(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white rounded-lg shadow-2xl w-full max-w-[340px] overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[18px] font-black text-slate-800">Số lượng</h3>
                  <button 
                    onClick={() => setShowItemQtyKeypad(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-0">
                  {/* Display Area */}
                  <div className="p-8 flex items-center justify-between bg-slate-50/50">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const val = parseInt(itemQtyKeypadValue || '1');
                        if (val > 1) setItemQtyKeypadValue((val - 1).toString());
                      }}
                      className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <Minus className="w-6 h-6 text-slate-600" />
                    </motion.button>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-black text-slate-800 tabular-nums transition-all">
                        {itemQtyKeypadValue || '0'}
                      </span>
                      <span className="text-[12px] text-slate-400 font-bold mt-1 truncate max-w-[150px]">{editingItemQty.name}</span>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const val = parseInt(itemQtyKeypadValue || '0');
                        setItemQtyKeypadValue((val + 1).toString());
                      }}
                      className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <Plus className="w-6 h-6 text-brand" />
                    </motion.button>
                  </div>

                  {/* Num Pad Grid - Thin lines style */}
                  <div className="grid grid-cols-3 gap-px bg-slate-100">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <motion.button 
                        key={num}
                        whileTap={{ backgroundColor: '#f1f5f9', scale: 0.95 }}
                        onClick={() => {
                          if (isFirstInputItemQty || itemQtyKeypadValue === '0' || itemQtyKeypadValue === '') {
                            setItemQtyKeypadValue(num.toString());
                            setIsFirstInputItemQty(false);
                          }
                          else if (itemQtyKeypadValue.length < 3) setItemQtyKeypadValue(itemQtyKeypadValue + num);
                        }}
                        className="bg-white py-4 text-xl font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                      >
                        {num}
                      </motion.button>
                    ))}
                    <motion.button 
                      whileTap={{ backgroundColor: '#f1f5f9', scale: 0.95 }}
                      onClick={() => {
                        setItemQtyKeypadValue('');
                        setIsFirstInputItemQty(false);
                      }}
                      className="bg-white py-4 text-xl font-bold text-blue-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      C
                    </motion.button>
                    <motion.button 
                      whileTap={{ backgroundColor: '#f1f5f9', scale: 0.95 }}
                      onClick={() => {
                        if (isFirstInputItemQty) {
                          setItemQtyKeypadValue('0');
                          setIsFirstInputItemQty(false);
                        } else if (itemQtyKeypadValue === '0' || itemQtyKeypadValue === '') return;
                        else if (itemQtyKeypadValue.length < 3) setItemQtyKeypadValue(itemQtyKeypadValue + '0');
                      }}
                      className="bg-white py-4 text-xl font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      0
                    </motion.button>
                    <motion.button 
                      whileTap={{ backgroundColor: '#f1f5f9', scale: 0.95 }}
                      onClick={() => {
                        setItemQtyKeypadValue(itemQtyKeypadValue.slice(0, -1));
                        setIsFirstInputItemQty(false);
                      }}
                      className="bg-white py-4 text-xl font-bold text-red-500 hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center"
                    >
                      <Delete className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
                    <button 
                      onClick={() => setShowItemQtyKeypad(false)}
                      className="h-10 px-8 min-w-[120px] rounded-lg border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-all active:scale-95"
                    >
                      HỦY
                    </button>
                    <button 
                      onClick={() => {
                        const finalQty = Math.max(1, parseInt(itemQtyKeypadValue || '1'));
                        setOrderItems(prev => prev.map(item => {
                          const isMatch = editingItemQty && (editingItemQty.instanceId 
                            ? item.instanceId === editingItemQty.instanceId 
                            : item.id === editingItemQty.id);
                          return isMatch ? { ...item, qty: finalQty } : item;
                        }));
                        setShowItemQtyKeypad(false);
                        showToast('Cập nhật số lượng thành công');
                      }}
                      className="px-8 h-10 bg-brand text-white rounded-lg font-bold text-[13px] shadow-md hover:bg-brand/90 transition-all min-w-[120px]"
                    >
                      ĐỒNG Ý
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showGuestPopup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGuestPopup(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white rounded-lg shadow-2xl w-full max-w-[340px] overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[18px] font-black text-slate-800">Số người</h3>
                  <button 
                    onClick={() => setShowGuestPopup(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-0">
                  {/* Display Area */}
                  <div className="p-8 flex items-center justify-between bg-slate-50/50">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const val = parseInt(guestKeypadValue || '1');
                        if (val > 1) setGuestKeypadValue((val - 1).toString());
                      }}
                      className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <Minus className="w-6 h-6 text-slate-600" />
                    </motion.button>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-black text-slate-800 tabular-nums transition-all">
                        {guestKeypadValue || '0'}
                      </span>
                      <span className="text-[12px] text-slate-400 font-bold mt-1 tracking-wider">Khách</span>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const val = parseInt(guestKeypadValue || '0');
                        setGuestKeypadValue((val + 1).toString());
                      }}
                      className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <Plus className="w-6 h-6 text-brand" />
                    </motion.button>
                  </div>

                  {/* Num Pad Grid - Thin lines style */}
                  <div className="grid grid-cols-3 gap-px bg-slate-100">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <motion.button 
                        key={num}
                        whileTap={{ backgroundColor: '#f1f5f9', scale: 0.95 }}
                        onClick={() => {
                          if (isFirstInputGuest || guestKeypadValue === '0' || guestKeypadValue === '') {
                            setGuestKeypadValue(num.toString());
                            setIsFirstInputGuest(false);
                          }
                          else if (guestKeypadValue.length < 3) setGuestKeypadValue(guestKeypadValue + num);
                        }}
                        className="bg-white py-4 text-xl font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                      >
                        {num}
                      </motion.button>
                    ))}
                    <motion.button 
                      whileTap={{ backgroundColor: '#f1f5f9', scale: 0.95 }}
                      onClick={() => {
                        setGuestKeypadValue('');
                        setIsFirstInputGuest(false);
                      }}
                      className="bg-white py-4 text-xl font-bold text-blue-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      C
                    </motion.button>
                    <motion.button 
                      whileTap={{ backgroundColor: '#f1f5f9', scale: 0.95 }}
                      onClick={() => {
                        if (isFirstInputGuest) {
                          setGuestKeypadValue('0');
                          setIsFirstInputGuest(false);
                        } else if (guestKeypadValue === '0' || guestKeypadValue === '') return;
                        else if (guestKeypadValue.length < 3) setGuestKeypadValue(guestKeypadValue + '0');
                      }}
                      className="bg-white py-4 text-xl font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      0
                    </motion.button>
                    <motion.button 
                      whileTap={{ backgroundColor: '#f1f5f9', scale: 0.95 }}
                      onClick={() => {
                        setGuestKeypadValue(guestKeypadValue.slice(0, -1));
                        setIsFirstInputGuest(false);
                      }}
                      className="bg-white py-4 text-xl font-bold text-red-500 hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center"
                    >
                      <Delete className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
                    <button 
                      onClick={() => setShowGuestPopup(false)}
                      className="h-10 px-8 min-w-[120px] rounded-lg border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-all active:scale-95"
                    >
                      HỦY
                    </button>
                    <button 
                      onClick={() => {
                        const finalGuests = parseInt(guestKeypadValue || '1');
                        setCurrentOrderGuests(finalGuests);
                        // Update active order if editing existing
                        if (currentOrderId && currentOrderId !== 'new') {
                          setOrders(prev => prev.map(o => o.id === currentOrderId ? { ...o, guests: finalGuests } : o));
                        }
                        setShowGuestPopup(false);
                      }}
                      className="px-8 h-10 bg-brand text-white rounded-lg font-bold text-[13px] shadow-md hover:bg-brand/90 transition-all min-w-[120px]"
                    >
                      ĐỒNG Ý
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Time Slot Selection Dialog */}
        <AnimatePresence>
          {showTimeSlotDialog && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTimeSlotDialog(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white rounded-lg shadow-2xl w-full max-w-[520px] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="relative p-6 flex items-center border-b border-slate-100">
                   <h3 className="text-xl font-bold text-slate-800">Áp dụng giá theo khung giờ</h3>
                   <button 
                     onClick={() => setShowTimeSlotDialog(false)}
                     className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                   >
                     <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="p-6 space-y-6">
                   {[
                     { id: 'none', label: 'Không áp dụng', detail: '' },
                     { id: 'morning', label: 'Khung giờ sáng (08:00 - 10:00)', detail: 'Áp dụng từ Thứ 2 đến chủ nhật' },
                     { id: 'noon', label: 'Khung giờ trưa (11:01 - 14:00)', detail: 'Áp dụng từ Thứ 2 đến chủ nhật' },
                     { id: 'evening', label: 'Khung giờ tối (14:01 - 23:45)', detail: 'Áp dụng từ Thứ 2 đến chủ nhật' },
                   ].map((slot) => (
                     <div 
                       key={slot.id}
                       onClick={() => setSelectedTimeSlotId(slot.id)}
                       className="flex items-center gap-4 cursor-pointer group"
                     >
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                         selectedTimeSlotId === slot.id ? 'border-[#076EFF]' : 'border-slate-300 group-hover:border-slate-400'
                       }`}>
                         {selectedTimeSlotId === slot.id && <div className="w-3 h-3 rounded-full bg-[#076EFF]" />}
                       </div>
                       <div className="flex flex-col">
                         <span className={`text-[15px] font-medium ${selectedTimeSlotId === slot.id ? 'text-slate-900' : 'text-slate-700'}`}>
                           {slot.label}
                         </span>
                         {slot.detail && (
                           <span className="text-sm text-slate-400 italic font-normal">
                             {slot.detail}
                           </span>
                         )}
                       </div>
                     </div>
                   ))}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-[#f5f5f5]">
                   <button 
                     onClick={() => setShowTimeSlotDialog(false)}
                     className="px-8 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all text-[13px] min-w-[120px]"
                   >
                     Hủy bỏ
                   </button>
                   <button 
                     onClick={() => {
                        showToast(`Đã áp dụng: ${getTimeSlotLabel(selectedTimeSlotId)}`);
                        setShowTimeSlotDialog(false);
                     }}
                     className="px-8 h-10 rounded-lg bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px] shadow-lg min-w-[120px]"
                   >
                     Đồng ý
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ORDER SUMMARY DIALOG (DASHBOARD) */}
        <AnimatePresence>
          {showOrderSummaryDialog && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOrderSummaryDialog(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[8px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <h3 className="text-[18px] font-black text-slate-800">Thông tin Order</h3>
                  <button 
                    onClick={() => setShowOrderSummaryDialog(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all active:scale-90"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                  {/* Dashboard Cards (Single Line) */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Food Card */}
                    <button 
                      onClick={() => setActiveSummaryTab('food')}
                      className={`p-3 rounded-[8px] border-2 transition-all flex items-center gap-3 active:scale-95 ${
                        activeSummaryTab === 'food' 
                          ? 'border-brand bg-blue-50/50' 
                          : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        activeSummaryTab === 'food' ? 'bg-brand text-white' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                      }`}>
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                      <div className="text-left flex-1 flex items-center gap-2">
                        <span className={`text-[13px] font-bold ${activeSummaryTab === 'food' ? 'text-brand' : 'text-slate-500'}`}>Món ăn:</span>
                        <span className={`text-[16px] font-black transition-colors ${activeSummaryTab === 'food' ? 'text-brand' : 'text-slate-800'}`}>
                          {(() => {
                            const foodItems = orderItems.filter(item => item.category === 'Đồ ăn nhẹ' || item.category === 'Khác');
                            const uniqueIds = new Set(foodItems.map(item => item.id));
                            return uniqueIds.size;
                          })()}
                        </span>
                      </div>
                    </button>

                    {/* Beverage Card */}
                    <button 
                      onClick={() => setActiveSummaryTab('beverage')}
                      className={`p-3 rounded-[8px] border-2 transition-all flex items-center gap-3 active:scale-95 ${
                        activeSummaryTab === 'beverage' 
                          ? 'border-orange-500 bg-orange-50/50' 
                          : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        activeSummaryTab === 'beverage' ? 'bg-orange-500 text-white' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                      }`}>
                        <Beer className="w-4 h-4" />
                      </div>
                      <div className="text-left flex-1 flex items-center gap-2">
                        <span className={`text-[13px] font-bold ${activeSummaryTab === 'beverage' ? 'text-orange-500' : 'text-slate-500'}`}>Đồ uống:</span>
                        <span className={`text-[16px] font-black transition-colors ${activeSummaryTab === 'beverage' ? 'text-orange-500' : 'text-slate-800'}`}>
                          {(() => {
                            const bevItems = orderItems.filter(item => item.category !== 'Đồ ăn nhẹ' && item.category !== 'Khác');
                            const uniqueIds = new Set(bevItems.map(item => item.id));
                            return uniqueIds.size;
                          })()}
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Detailed List (Flat with border) */}
                  <div className="space-y-0 border-t border-slate-100">
                    <div className="flex items-center justify-between py-3">
                      <h4 className="text-[12px] font-bold text-slate-500 tracking-wider">
                        Danh sách {activeSummaryTab === 'food' ? 'món ăn' : 'đồ uống'}
                      </h4>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                      {(() => {
                        const filtered = orderItems.filter(item => 
                          activeSummaryTab === 'food' 
                            ? (item.category === 'Đồ ăn nhẹ' || item.category === 'Khác')
                            : (item.category !== 'Đồ ăn nhẹ' && item.category !== 'Khác')
                        );

                        // Merge logic: Group by item.id
                        const mergedMap: Record<string, any> = {};
                        filtered.forEach(item => {
                          const key = item.id;
                          if (!mergedMap[key]) {
                            mergedMap[key] = { ...item, qty: 0 };
                          }
                          mergedMap[key].qty += item.qty;
                        });
                        const mergedList = Object.values(mergedMap);

                        if (mergedList.length > 0) {
                          return mergedList.map((item: any, idx) => {
                            const addonsText = item.addons && item.addons.length > 0 
                              ? item.addons.map((a: any) => `+ ${a.name}`).join(', ') 
                              : '';
                            const noteText = item.note ? `Ghi chú: ${item.note}` : '';
                            const line2Parts = [addonsText, noteText].filter(Boolean);
                            const line2 = line2Parts.join(' | ');

                            return (
                              <div key={item.id} className="py-3 border-b border-slate-100 flex flex-col justify-center transition-all">
                                {/* Line 1 */}
                                <div className="flex justify-between items-center w-full">
                                  <div className="text-[13px] font-bold text-slate-800">
                                    {item.qty} x {item.name}
                                  </div>
                                  <div className="text-[13px] font-black text-slate-800">
                                    {formatCurrency(item.price * item.qty)}
                                  </div>
                                </div>
                                {/* Line 2 */}
                                {line2 && (
                                  <div className="text-[12px] font-normal italic text-slate-500 mt-1 pl-4">
                                    {line2}
                                  </div>
                                )}
                              </div>
                            );
                          });
                        }

                        return (
                          <div className="py-12 flex flex-col items-center justify-center text-slate-300 gap-3 text-center">
                            <CookingPot className="w-10 h-10 opacity-20" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Chưa có {activeSummaryTab === 'food' ? 'món ăn' : 'đồ uống'} nào</p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Footer with Close Button */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0 flex justify-end">
                  <button 
                    onClick={() => setShowOrderSummaryDialog(false)}
                    className="px-8 h-10 bg-brand text-white rounded-[8px] font-bold text-[13px] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center min-w-[120px]"
                  >
                    ĐÓNG
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Printer Setup & Receipt Preview Dialog */}
        <AnimatePresence>
          {showPrinterDialog && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPrinterDialog(false)}
                className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[880px] overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header inside Dialog */}
                <div className="p-5 border-b border-slate-100 shrink-0 bg-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand">
                      <Printer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Cấu hình máy in bán hàng</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Thiết lập riêng biệt các thiết bị in hóa đơn thu ngân, phiếu chế biến bếp và tem nhãn</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPrinterDialog(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 2-Column Dialog Body */}
                <div className="flex-1 flex overflow-hidden bg-slate-50/50 min-h-[480px] h-[550px] max-h-[75vh]">
                  
                  {/* Left Column: Granular Printer Configuration Items */}
                  <div className="w-[480px] border-r border-slate-200 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-white shrink-0">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-[11px] font-bold text-slate-400 tracking-wider">Các đầu mục thiết lập</span>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {connectedPrinters.length} máy in đang chạy
                        </span>
                      </div>

                      {/* Item 1: Cashier Printer */}
                      {(() => {
                        const isConnected = connectedPrinters.some(p => p.role === 'cashier');
                        const isConnecting = connectingPrinterRole === 'cashier';
                        const isExpanded = expandedPrinterConfigRole === 'cashier';
                        const isActive = activePrinterRole === 'cashier';

                        return (
                          <div 
                            onClick={() => setActivePrinterRole('cashier')}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                              isActive 
                                ? 'border-[#076EFF] bg-blue-50/20 shadow-sm' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                                  isConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'
                                }`}>
                                  <Printer className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-700 text-sm">1. Máy in hóa đơn Thu ngân</div>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    {isConnected ? 'HP LaserJet 400 M401 (192.168.1.200)' : 'Dùng in hóa đơn tạm tính & thanh toán'}
                                  </div>
                                </div>
                              </div>

                              <div>
                                {isConnected ? (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-bold text-[10px]">
                                    Đã kết nối
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold text-[10px]">
                                    Chưa kết nối
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions and expand panel */}
                            <div className="mt-3.5 flex items-center justify-between gap-2 pt-3 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                              <div className="flex gap-1.5">
                                {isConnected ? (
                                  <>
                                    <button
                                      onClick={() => showToast('Đang gửi lệnh in thử tới Máy in thu ngân...', 'success')}
                                      className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1 transition-all"
                                    >
                                      In thử
                                    </button>
                                    <button
                                      onClick={() => setExpandedPrinterConfigRole(isExpanded ? null : 'cashier')}
                                      className={`h-8 px-3 rounded-lg border font-bold text-xs flex items-center gap-1 transition-all ${
                                        isExpanded ? 'bg-slate-100 text-[#076EFF] border-[#076EFF]/30' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                      }`}
                                    >
                                      <Settings className="w-3.5 h-3.5" />
                                      Cấu hình mẫu
                                    </button>
                                  </>
                                ) : null}
                              </div>

                              <div>
                                {isConnecting ? (
                                  <div className="flex items-center gap-1.5 text-xs text-[#076EFF] font-bold">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    Đang kết nối...
                                  </div>
                                ) : isConnected ? (
                                  <button
                                    onClick={() => handleDisconnectPrinter('cashier')}
                                    className="h-8 px-3 rounded-lg text-red-600 font-bold text-xs hover:bg-red-50 transition-all"
                                  >
                                    Ngắt kết nối
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleConnectPrinter('cashier')}
                                    className="h-8 px-4 rounded-lg bg-brand text-white font-bold text-xs hover:brightness-110 active:scale-98 transition-all shadow-sm"
                                  >
                                    Kết nối nhanh
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Accordion Expansion: Config Settings */}
                            {isExpanded && isConnected && (
                              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in duration-200" onClick={e => e.stopPropagation()}>
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500">Cỡ giấy</span>
                                    <select 
                                      value={printerPaperSize.cashier}
                                      onChange={(e) => setPrinterPaperSize(prev => ({ ...prev, cashier: e.target.value }))}
                                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand text-xs"
                                    >
                                      <option value="K80">K80 (80mm)</option>
                                      <option value="K58">K58 (58mm)</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500">Số bản in (Liên)</span>
                                    <input 
                                      type="number"
                                      min={1}
                                      max={5}
                                      value={printerCopies.cashier}
                                      onChange={(e) => setPrinterCopies(prev => ({ ...prev, cashier: parseInt(e.target.value) || 1 }))}
                                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand text-xs font-bold"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500">Cỡ chữ hóa đơn</span>
                                    <select 
                                      value={printerFontSize.cashier}
                                      onChange={(e) => setPrinterFontSize(prev => ({ ...prev, cashier: e.target.value }))}
                                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand text-xs"
                                    >
                                      <option value="small">Nhỏ (75%)</option>
                                      <option value="normal">Tiêu chuẩn (100%)</option>
                                      <option value="large">Lớn (120%)</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1.5 pt-1.5 border-t border-slate-200/60 text-[11px]">
                                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                                    <input 
                                      type="checkbox"
                                      checked={printerOptions.cashier.printLogo}
                                      onChange={(e) => setPrinterOptions(prev => ({
                                        ...prev,
                                        cashier: { ...prev.cashier, printLogo: e.target.checked }
                                      }))}
                                      className="rounded text-brand focus:ring-brand w-3.5 h-3.5 border-slate-300"
                                    />
                                    In Logo MISA CukCuk ở đầu
                                  </label>


                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Item 2: Kitchen Printer */}
                      {(() => {
                        const isConnected = connectedPrinters.some(p => p.role === 'kitchen');
                        const isConnecting = connectingPrinterRole === 'kitchen';
                        const isExpanded = expandedPrinterConfigRole === 'kitchen';
                        const isActive = activePrinterRole === 'kitchen';

                        return (
                          <div 
                            onClick={() => setActivePrinterRole('kitchen')}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                              isActive 
                                ? 'border-[#076EFF] bg-blue-50/20 shadow-sm' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                                  isConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'
                                }`}>
                                  <UtensilsCrossed className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-700 text-sm">2. Máy in chế biến Nhà bếp</div>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    {isConnected ? 'Epson-LAN-X90 (192.168.1.201)' : 'Tự động gửi phiếu đặt món xuống khu vực bếp'}
                                  </div>
                                </div>
                              </div>

                              <div>
                                {isConnected ? (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-bold text-[10px]">
                                    Đã kết nối
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold text-[10px]">
                                    Chưa kết nối
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions and expand panel */}
                            <div className="mt-3.5 flex items-center justify-between gap-2 pt-3 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                              <div className="flex gap-1.5">
                                {isConnected ? (
                                  <>
                                    <button
                                      onClick={() => showToast('Đang gửi lệnh in phiếu chế biến thử tới bếp...', 'success')}
                                      className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1 transition-all"
                                    >
                                      In thử
                                    </button>
                                    <button
                                      onClick={() => setExpandedPrinterConfigRole(isExpanded ? null : 'kitchen')}
                                      className={`h-8 px-3 rounded-lg border font-bold text-xs flex items-center gap-1 transition-all ${
                                        isExpanded ? 'bg-slate-100 text-[#076EFF] border-[#076EFF]/30' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                      }`}
                                    >
                                      <Settings className="w-3.5 h-3.5" />
                                      Cấu hình mẫu
                                    </button>
                                  </>
                                ) : null}
                              </div>

                              <div>
                                {isConnecting ? (
                                  <div className="flex items-center gap-1.5 text-xs text-[#076EFF] font-bold">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    Đang kết nối...
                                  </div>
                                ) : isConnected ? (
                                  <button
                                    onClick={() => handleDisconnectPrinter('kitchen')}
                                    className="h-8 px-3 rounded-lg text-red-600 font-bold text-xs hover:bg-red-50 transition-all"
                                  >
                                    Ngắt kết nối
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleConnectPrinter('kitchen')}
                                    className="h-8 px-4 rounded-lg bg-brand text-white font-bold text-xs hover:brightness-110 active:scale-98 transition-all shadow-sm"
                                  >
                                    Kết nối nhanh
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Accordion Expansion: Config Settings */}
                            {isExpanded && isConnected && (
                              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in duration-200" onClick={e => e.stopPropagation()}>
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500">Cỡ giấy bếp</span>
                                    <select 
                                      value={printerPaperSize.kitchen}
                                      onChange={(e) => setPrinterPaperSize(prev => ({ ...prev, kitchen: e.target.value }))}
                                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand text-xs"
                                    >
                                      <option value="K80">K80 (80mm)</option>
                                      <option value="K58">K58 (58mm)</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500">Liên in chế biến</span>
                                    <input 
                                      type="number"
                                      min={1}
                                      max={5}
                                      value={printerCopies.kitchen}
                                      onChange={(e) => setPrinterCopies(prev => ({ ...prev, kitchen: parseInt(e.target.value) || 1 }))}
                                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand text-xs font-bold"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500">Cỡ chữ món ăn</span>
                                    <select 
                                      value={printerFontSize.kitchen}
                                      onChange={(e) => setPrinterFontSize(prev => ({ ...prev, kitchen: e.target.value }))}
                                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand text-xs"
                                    >
                                      <option value="small">Nhỏ (75%)</option>
                                      <option value="normal">Bình thường (100%)</option>
                                      <option value="large">Lớn đặc biệt (140% - Dễ nhìn)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Item 3: Bar Printer */}
                      {(() => {
                        const isConnected = connectedPrinters.some(p => p.role === 'bar');
                        const isConnecting = connectingPrinterRole === 'bar';
                        const isExpanded = expandedPrinterConfigRole === 'bar';
                        const isActive = activePrinterRole === 'bar';

                        return (
                          <div 
                            onClick={() => setActivePrinterRole('bar')}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                              isActive 
                                ? 'border-[#076EFF] bg-blue-50/20 shadow-sm' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                                  isConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'
                                }`}>
                                  <Beer className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-700 text-sm">3. Máy in tem nhãn Quầy Bar</div>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    {isConnected ? 'PRINTER-POS80-A (Cổng USB001)' : 'Tự động in nhãn decal dán cốc dán chai cho trà, bia'}
                                  </div>
                                </div>
                              </div>

                              <div>
                                {isConnected ? (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-bold text-[10px]">
                                    Đã kết nối
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold text-[10px]">
                                    Chưa kết nối
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions and expand panel */}
                            <div className="mt-3.5 flex items-center justify-between gap-2 pt-3 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                              <div className="flex gap-1.5">
                                {isConnected ? (
                                  <>
                                    <button
                                      onClick={() => showToast('Đang gửi lệnh in tem dán thử tới Quầy bar...', 'success')}
                                      className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1 transition-all"
                                    >
                                      In thử
                                    </button>
                                    <button
                                      onClick={() => setExpandedPrinterConfigRole(isExpanded ? null : 'bar')}
                                      className={`h-8 px-3 rounded-lg border font-bold text-xs flex items-center gap-1 transition-all ${
                                        isExpanded ? 'bg-slate-100 text-[#076EFF] border-[#076EFF]/30' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                      }`}
                                    >
                                      <Settings className="w-3.5 h-3.5" />
                                      Cấu hình mẫu
                                    </button>
                                  </>
                                ) : null}
                              </div>

                              <div>
                                {isConnecting ? (
                                  <div className="flex items-center gap-1.5 text-xs text-[#076EFF] font-bold">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    Đang kết nối...
                                  </div>
                                ) : isConnected ? (
                                  <button
                                    onClick={() => handleDisconnectPrinter('bar')}
                                    className="h-8 px-3 rounded-lg text-red-600 font-bold text-xs hover:bg-red-50 transition-all"
                                  >
                                    Ngắt kết nối
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleConnectPrinter('bar')}
                                    className="h-8 px-4 rounded-lg bg-brand text-white font-bold text-xs hover:brightness-110 active:scale-98 transition-all shadow-sm"
                                  >
                                    Kết nối nhanh
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Accordion Expansion: Config Settings */}
                            {isExpanded && isConnected && (
                              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in duration-200" onClick={e => e.stopPropagation()}>
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500">Khổ nhãn dán</span>
                                    <select 
                                      value={printerPaperSize.bar}
                                      onChange={(e) => setPrinterPaperSize(prev => ({ ...prev, bar: e.target.value }))}
                                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand text-xs"
                                    >
                                      <option value="K58">Nhãn dán 50x30mm</option>
                                      <option value="K80">Nhãn dán 40x30mm</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500">Bản in mỗi ly</span>
                                    <input 
                                      type="number"
                                      min={1}
                                      max={5}
                                      value={printerCopies.bar}
                                      onChange={(e) => setPrinterCopies(prev => ({ ...prev, bar: parseInt(e.target.value) || 1 }))}
                                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand text-xs font-bold"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-start gap-2 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-500 leading-normal">
                        MISA CukCuk hỗ trợ kết nối đồng thời nhiều máy in khác nhau để tối ưu hóa quy trình chế biến món ăn và thanh toán tự động.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Live Preview of selected thermal slip */}
                  <div className="flex-1 bg-slate-100 p-5 overflow-y-auto custom-scrollbar flex flex-col justify-between items-center relative">
                    <div className="w-full max-w-[340px] space-y-4 flex flex-col items-center">
                      <div className="w-full flex justify-between items-center bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setActivePrinterRole('cashier')}
                          className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all ${
                            activePrinterRole === 'cashier' 
                              ? 'bg-brand text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Hóa đơn
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePrinterRole('kitchen')}
                          className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all ${
                            activePrinterRole === 'kitchen' 
                              ? 'bg-brand text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Phiếu bếp
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePrinterRole('bar')}
                          className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all ${
                            activePrinterRole === 'bar' 
                              ? 'bg-brand text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Tem nhãn Bar
                        </button>
                      </div>

                      {/* Render Thermal Slip Preview depending on activePrinterRole */}
                      {activePrinterRole === 'cashier' ? (
                        /* Receipt Thermal View */
                        <div className="w-full bg-white shadow-lg border border-slate-200 px-5 py-6 rounded-b-md relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-2 before:bg-gradient-to-b before:from-slate-200/50 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-2 after:bg-gradient-to-t after:from-slate-200/50 font-mono text-slate-800 text-[11px] leading-normal animate-fadeIn">
                          {printerOptions.cashier.printLogo && (
                            <div className="flex justify-center mb-3">
                              <CukCukLogo size={32} className="opacity-80" />
                            </div>
                          )}
                          <div className="text-center space-y-1">
                            <h4 className="font-black text-xs tracking-wider uppercase">MISA CUKCUK RESTAURANT</h4>
                            <p className="text-[9px] text-slate-500 leading-normal">51 Lê Văn Lương, Thanh Xuân, Hà Nội</p>
                            <p className="text-[9px] text-slate-500">SĐT: 024.3795.9595</p>
                            <div className="w-full border-b border-dashed border-slate-300 my-2.5" />
                            <h5 className="font-bold text-xs tracking-widest mt-1">HÓA ĐƠN TẠM TÍNH</h5>
                            <p className="text-[8px] text-slate-400 mt-0.5">Bàn: {pickingTableNames.length > 0 ? pickingTableNames.join(', ') : 'Bàn 05'}</p>
                          </div>

                          <div className="space-y-0.5 text-[9px] text-slate-500 my-3">
                            <div className="flex justify-between">
                              <span>Vào: 12:30 17/04/2026</span>
                              <span>In: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Thu ngân: {userProfile?.name || 'Nguyễn Văn An'}</span>
                              <span>Khách: {selectedCustomerObj?.name || 'Khách vãng lai'}</span>
                            </div>
                          </div>

                          <div className="w-full border-b border-dashed border-slate-300 my-2" />

                          <div className="space-y-1.5">
                            <div className="grid grid-cols-[1fr_25px_50px_55px] font-black text-slate-700 text-[9px]">
                              <span>Tên món</span>
                              <span className="text-center">SL</span>
                              <span className="text-right">Đơn giá</span>
                              <span className="text-right">T.Tiền</span>
                            </div>
                            
                            <div className="w-full border-b border-slate-200 my-0.5" />

                            {orderItems.length > 0 ? (
                              orderItems.map((item) => (
                                <div key={item.instanceId || item.id} className="grid grid-cols-[1fr_25px_50px_55px] items-start text-slate-700 leading-tight">
                                  <span className="truncate pr-1">{item.name}</span>
                                  <span className="text-center">{item.qty}</span>
                                  <span className="text-right">{Math.round(item.price).toLocaleString('vi-VN')}</span>
                                  <span className="text-right font-bold">{(item.qty * item.price).toLocaleString('vi-VN')}</span>
                                </div>
                              ))
                            ) : (
                              <>
                                <div className="grid grid-cols-[1fr_25px_50px_55px] items-start text-slate-700">
                                  <span className="truncate pr-1">Phở chín nạm gầu</span>
                                  <span className="text-center">1</span>
                                  <span className="text-right">55.000</span>
                                  <span className="text-right font-bold">55.000</span>
                                </div>
                                <div className="grid grid-cols-[1fr_25px_50px_55px] items-start text-slate-700">
                                  <span className="truncate pr-1">Quẩy giòn nóng</span>
                                  <span className="text-center">3</span>
                                  <span className="text-right">5.000</span>
                                  <span className="text-right font-bold">15.000</span>
                                </div>
                                <div className="grid grid-cols-[1fr_25px_50px_55px] items-start text-slate-700">
                                  <span className="truncate pr-1">Bia hơi Hà Nội</span>
                                  <span className="text-center">2</span>
                                  <span className="text-right">15.000</span>
                                  <span className="text-right font-bold">30.000</span>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="w-full border-b border-dashed border-slate-300 my-2.5" />

                          <div className="space-y-0.5 text-[10px]">
                            <div className="flex justify-between text-slate-600">
                              <span>Cộng tiền hàng:</span>
                              <span>{orderItems.length > 0 ? formatCurrency(totalGrossAmount) : '100.000 đ'}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Thuế GTGT (8%):</span>
                              <span>{orderItems.length > 0 ? formatCurrency(totalAmount * 0.08) : '8.000 đ'}</span>
                            </div>
                            <div className="w-full border-b border-slate-200 my-1" />
                            <div className="flex justify-between font-black text-xs text-slate-900 pt-0.5">
                              <span>TỔNG CỘNG:</span>
                              <span>{orderItems.length > 0 ? formatCurrency(totalAmount * 1.08) : '108.000 đ'}</span>
                            </div>
                          </div>



                          <div className="text-center text-[8px] text-slate-400 mt-6 space-y-0.5">
                            <p className="italic">Cảm ơn Quý khách! Hẹn gặp lại!</p>
                            <p className="font-mono text-[7px] opacity-70">CukCuk POS • Cung cấp bởi MISA</p>
                          </div>
                        </div>
                      ) : activePrinterRole === 'kitchen' ? (
                        /* Kitchen Slip Thermal View */
                        <div className="w-full bg-white shadow-lg border border-slate-200 px-5 py-6 rounded-b-md relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-2 before:bg-gradient-to-b before:from-slate-200/50 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-2 after:bg-gradient-to-t after:from-slate-200/50 font-mono text-slate-800 text-[11px] leading-normal animate-fadeIn">
                          <div className="text-center space-y-1">
                            <h4 className="font-black text-sm text-slate-900 tracking-wider">Phiếu chế biến (Bếp)</h4>
                            <div className="px-3 py-1 bg-slate-900 text-white rounded font-bold text-xs inline-block mt-1">
                              Bàn: {pickingTableNames.length > 0 ? pickingTableNames.join(', ') : 'Bàn 05'}
                            </div>
                            <div className="w-full border-b border-dashed border-slate-300 my-2.5" />
                          </div>

                          <div className="space-y-0.5 text-[9px] text-slate-500 my-2">
                            <div>Nhân viên: {userProfile?.name || 'Nguyễn Văn An'}</div>
                            <div>Giờ gửi: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                            <div>Mục phục vụ: Đồ ăn nóng</div>
                          </div>

                          <div className="w-full border-b border-slate-300 my-2" />

                          {/* Food items only - filter beverages for kitchen printer role */}
                          <div className="space-y-2">
                            <div className="grid grid-cols-[25px_1fr] font-black text-slate-700 text-[10px]">
                              <span>SL</span>
                              <span>Tên món ăn cần chế biến</span>
                            </div>
                            <div className="w-full border-b border-slate-200" />
                            
                            {/* Filter or use custom items */}
                            {(() => {
                              const foodItems = orderItems.filter(i => i.category === 'Đồ ăn nhẹ' || i.category === 'Khác');
                              if (foodItems.length > 0) {
                                return foodItems.map(item => (
                                  <div key={item.id} className="grid grid-cols-[25px_1fr] items-start text-slate-800">
                                    <span className="font-black text-xs">{item.qty}</span>
                                    <div>
                                      <span className="font-bold text-xs">{item.name}</span>
                                      {item.note && <div className="text-[9px] italic text-red-500 pl-1">Chú ý: {item.note}</div>}
                                    </div>
                                  </div>
                                ));
                              } else {
                                return (
                                  <>
                                    <div className="grid grid-cols-[25px_1fr] items-start text-slate-800">
                                      <span className="font-black text-xs">1</span>
                                      <div>
                                        <span className="font-bold text-xs">Phở chín nạm gầu</span>
                                        <div className="text-[9px] italic text-red-500 font-bold pl-1">Chú ý: Nhiều bánh phở, không mì chính</div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-[25px_1fr] items-start text-slate-800">
                                      <span className="font-black text-xs">3</span>
                                      <div>
                                        <span className="font-bold text-xs">Quẩy giòn nóng</span>
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                            })()}
                          </div>

                          <div className="w-full border-b border-dashed border-slate-300 my-3" />

                          <div className="text-center text-[9px] text-slate-400 mt-4">
                            <p className="font-bold text-slate-700 italic">Vui lòng trả món nhanh chóng!</p>
                            <p className="text-[7px] mt-1">CukCuk K-Print Service</p>
                          </div>
                        </div>
                      ) : (
                        /* Bar Slip Thermal View */
                        <div className="w-full bg-white shadow-lg border border-slate-200 px-4 py-5 rounded-b-md relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-2 before:bg-gradient-to-b before:from-slate-200/50 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-2 after:bg-gradient-to-t after:from-slate-200/50 font-mono text-slate-800 text-[10px] leading-normal animate-fadeIn">
                          <div className="text-center space-y-1">
                            <h4 className="font-black text-xs text-slate-900">Tem chế biến ly đồ uống</h4>
                            <div className="flex justify-between text-[8px] text-slate-500 px-1 pt-1">
                              <span>Bàn: {pickingTableNames.length > 0 ? pickingTableNames.join(', ') : 'Bàn 05'}</span>
                              <span>Mã đơn: #202604</span>
                            </div>
                            <div className="w-full border-b border-dashed border-slate-200 my-2" />
                          </div>

                          {/* Drink items only */}
                          {(() => {
                            const drinkItems = orderItems.filter(i => i.category !== 'Đồ ăn nhẹ' && i.category !== 'Khác');
                            if (drinkItems.length > 0) {
                              return (
                                <div className="space-y-3">
                                  {drinkItems.map((item, idx) => (
                                    <div key={item.id} className="p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                                      <div className="flex justify-between font-black text-slate-800 text-[11px]">
                                        <span>{item.name}</span>
                                        <span>x {item.qty} ly</span>
                                      </div>
                                      <div className="text-[8px] text-slate-400 mt-1">Ly {idx + 1}/{drinkItems.length}</div>
                                      <div className="text-[8px] text-slate-500 italic mt-0.5">Sở thích: Ít đá, ít ngọt</div>
                                    </div>
                                  ))}
                                </div>
                              );
                            } else {
                              return (
                                <div className="space-y-3">
                                  <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                                    <div className="flex justify-between font-black text-slate-800 text-[11px]">
                                      <span>Trà sữa trân châu HK</span>
                                      <span>x 1 ly</span>
                                    </div>
                                    <div className="text-[8px] text-slate-400 mt-1">Ly 1/1</div>
                                    <div className="text-[8px] text-[#076EFF] font-bold italic mt-0.5">Sở thích: 70% Đá, 50% Đường</div>
                                  </div>

                                  <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                                    <div className="flex justify-between font-black text-slate-800 text-[11px]">
                                      <span>Bia hơi Hà Nội</span>
                                      <span>x 2 ly</span>
                                    </div>
                                    <div className="text-[8px] text-slate-400 mt-1">Sản phẩm 1/2 • 2/2</div>
                                    <div className="text-[8px] text-[#076EFF] font-bold italic mt-0.5">Sở thích: Ướp lạnh, rót bọt vừa</div>
                                  </div>
                                </div>
                              );
                            }
                          })()}

                          <div className="w-full border-b border-dashed border-slate-200 my-3.5" />
                          <div className="text-center text-[8px] text-slate-400">
                            <span>Giờ in: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • MISA CukCuk Bar</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Footer with aligned action buttons */}
                <div className="px-6 py-4 bg-white border-t border-slate-100 shrink-0 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowPrinterDialog(false)}
                    className="px-8 h-10 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all min-w-[120px]"
                  >
                    Đóng
                  </button>
                  <button 
                    onClick={() => {
                      showToast('Đã lưu toàn bộ cấu hình máy in thành công!', 'success');
                      setShowPrinterDialog(false);
                    }}
                    className="px-8 h-10 rounded-xl bg-brand text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all min-w-[120px] shadow-lg shadow-blue-500/15"
                  >
                    Lưu cấu hình
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Other Item Dialog */}
        <AnimatePresence>
          {showOtherItemDialog && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOtherItemDialog(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white rounded-lg shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col"
              >
                <div className="relative p-6 flex items-center border-b border-slate-100">
                   <h3 className="text-xl font-bold text-slate-800">Thêm món khác</h3>
                   <button 
                     onClick={() => setShowOtherItemDialog(false)}
                     className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                   >
                     <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tên món</label>
                    <input 
                      type="text"
                      className="w-full h-10 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-brand"
                      placeholder="Nhập tên món"
                      value={otherItemData.name}
                      onChange={(e) => setOtherItemData({...otherItemData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Số lượng</label>
                      <div className="flex items-center gap-1 bg-slate-100 rounded-lg border border-slate-200 p-0.5 h-10">
                        <button 
                          onClick={() => setOtherItemData({...otherItemData, qty: Math.max(1, otherItemData.qty - 1)})}
                          className="w-9 h-9 flex items-center justify-center bg-white shadow-sm text-red-500 hover:bg-red-50 rounded-md transition-all active:scale-90"
                        >
                          <Minus className="w-4 h-4 stroke-[3]" />
                        </button>
                        <div className="flex-1 text-center font-black text-lg text-slate-800 min-w-[32px]">
                          {otherItemData.qty}
                        </div>
                        <button 
                          onClick={() => setOtherItemData({...otherItemData, qty: otherItemData.qty + 1})}
                          className="w-9 h-9 flex items-center justify-center bg-white shadow-sm text-green-600 hover:bg-green-50 rounded-md transition-all active:scale-90"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Đơn vị tính</label>
                      <select 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand font-medium text-slate-700"
                        value={otherItemData.unit}
                        onChange={(e) => setOtherItemData({...otherItemData, unit: e.target.value})}
                      >
                        <option>Đĩa</option>
                        <option>Bát</option>
                        <option>Cái</option>
                        <option>Chai</option>
                        <option>Lon</option>
                        <option>Kg</option>
                        <option>Nồi</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Đơn giá</label>
                      <div className="relative">
                        <input 
                          type="text"
                          className="w-full h-10 pl-4 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:border-brand text-right font-black text-slate-800"
                          placeholder="0"
                          value={otherItemData.price === 0 ? '' : Math.round(otherItemData.price).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setOtherItemData({...otherItemData, price: val ? parseInt(val) : 0});
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">₫</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 text-right">Số tiền</label>
                      <div className="w-full h-10 px-4 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-end font-black text-brand text-xl">
                        {formatCurrency((otherItemData.price || 0) * (otherItemData.qty || 0))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Ghi chú</label>
                    <textarea 
                      className="w-full h-20 p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand text-sm placeholder:text-slate-300"
                      placeholder="Nhập ghi chú cho bếp/bar..."
                      value={otherItemData.note}
                      onChange={(e) => setOtherItemData({...otherItemData, note: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Chế biến tại</label>
                    <div className="flex gap-10">
                      {['Bếp', 'Bar'].map(area => (
                        <label key={area} className="flex items-center gap-3 cursor-pointer group">
                          <div 
                            onClick={() => setOtherItemData({...otherItemData, prepArea: area})}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              otherItemData.prepArea === area ? 'border-brand shadow-[0_0_0_3px_rgba(7,110,255,0.1)]' : 'border-slate-300 group-hover:border-slate-400 font-medium'
                            }`}
                          >
                            {otherItemData.prepArea === area && <div className="w-3 h-3 rounded-full bg-brand" />}
                          </div>
                          <span className={`text-[15px] font-bold ${otherItemData.prepArea === area ? 'text-brand' : 'text-slate-600'}`}>{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-[#f5f5f5]">
                   <button 
                     onClick={() => {
                        setShowOtherItemDialog(false);
                        setOtherItemData({ name: '', qty: 1, unit: 'Đĩa', price: 0, note: '', prepArea: 'Bếp' });
                     }}
                     className="px-8 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all text-[13px] min-w-[120px]"
                   >
                     Hủy bỏ
                   </button>
                   <button 
                     onClick={() => {
                        if (!otherItemData.name) {
                          showToast('Vui lòng nhập tên món');
                          return;
                        }
                        const newItem = {
                          id: `other_${Date.now()}`,
                          name: otherItemData.name,
                          price: otherItemData.price,
                          qty: otherItemData.qty,
                          unit: otherItemData.unit,
                          note: otherItemData.note,
                          prepArea: otherItemData.prepArea,
                          status: 'new',
                          isNew: true,
                          round: 0,
                          isProcessing: false,
                          instanceId: `other_${Date.now()}`
                        };
                        setOrderItems(prev => {
                          const reset = prev.map(oi => ({ ...oi, isNew: false }));
                          return [...reset, newItem];
                        });
                        showToast(`Đã thêm món: ${otherItemData.name}`);
                        setShowOtherItemDialog(false);
                        setOtherItemData({ name: '', qty: 1, unit: 'Đĩa', price: 0, note: '', prepArea: 'Bếp' });
                     }}
                     className="px-8 h-10 rounded-lg bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px] shadow-lg min-w-[120px]"
                   >
                     Đồng ý
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
    );
  };

  // ==========================================
  // RENDER TABLES SCREEN
  // ==========================================
  const renderTablesScreen = () => {
    const floors = customZones.map(zone => ({
      name: zone,
      count: tablesList.filter(t => t.floor === zone).length,
      rooms: ['Tất cả', 'Trong nhà', 'Ngoài trời']
    }));

    const tablesInArea = tablesList.map(table => {
      // Find if there's an active or waiting payment order for this table
      const activeOrder = orders.find(o => o.tables.includes(table.id) && o.status === 'serving');
      const waitingPaymentOrder = orders.find(o => o.tables.includes(table.id) && o.status === 'waiting_payment');
      
      let computedStatus = 'empty';
      let computedWaitingPayment = false;
      let computedAmount = 0;
      let computedGuests = 0;
      let computedTime = '';

      if (activeOrder) {
        computedStatus = 'serving';
        computedAmount = activeOrder.amount;
        computedGuests = activeOrder.guests;
        computedTime = activeOrder.time || "5'";
      } else if (waitingPaymentOrder) {
        computedStatus = 'serving';
        computedWaitingPayment = true;
        computedAmount = waitingPaymentOrder.amount;
        computedGuests = waitingPaymentOrder.guests;
        computedTime = waitingPaymentOrder.time || "5'";
      } else {
        const activeRes = reservations.find(r => (r.table === table.name || r.table === `Bàn ${table.id}`) && r.status === 'confirmed');
        if (activeRes) {
          computedStatus = 'reserved';
        }
      }

      return {
        ...table,
        status: computedStatus,
        waitingPayment: computedWaitingPayment,
        amount: computedAmount,
        guests: computedGuests,
        time: computedTime
      };
    }).filter(table => {
      const matchesSearch = table.name.toLowerCase().includes(tableSearchQuery.toLowerCase());
      const matchesFloor = table.floor === activeFloor;
      const matchesRoom = activeRoom === 'Tất cả' || table.room === activeRoom;
      return matchesSearch && matchesFloor && matchesRoom;
    }).map(table => {
      // Khi chọn bàn đặt chỗ (tương lai), các bàn đang dùng hiện tại được coi là trống
      // Chỉ giữ lại trạng thái 'reserved' cho các bàn đã được đặt trước khác
      if (isPickingTable && table.status === 'serving') {
        return { ...table, status: 'empty' };
      }
      return table;
    });

    const filteredTables = tablesInArea.filter(table => {
      let matchesFilter = tableFilter === 'all' || table.status === tableFilter;
      if (tableFilter === 'waiting_payment') matchesFilter = table.status === 'serving' && table.waitingPayment;
      if (tableFilter === 'upcoming_reservation') matchesFilter = table.status === 'reserved' && table.upcoming;
      return matchesFilter;
    });

    const targetGuests = isPickingTable ? (selectedReservation ? selectedReservation.guests : (isSelectingTableForOrder ? currentOrderGuests : newReservation.guests)) : 0;
    const targetTime = isPickingTable ? (selectedReservation ? (selectedReservation.arrivalDateTime?.split(' ')[1] || '18:30') : (isSelectingTableForOrder ? 'Bây giờ' : newReservation.time)) : '';

    const renderTableIcon = (table: any) => {
      const isSuggested = isPickingTable && (currentOrderChannel === 'reservation' || selectedReservation) && table.status === 'empty' && (table.seats >= targetGuests || (targetGuests >= 10 && table.room.includes('VIP')));
      const isNotSuggested = isPickingTable && (currentOrderChannel === 'reservation' || selectedReservation) && !isSuggested;

      const isPicked = pickingTableNames.includes(table.name);

      return (
      <div 
        id={`table-card-${table.id}`}
        key={table.id} 
        onClick={() => {
          if (isPickingTable) {
            if (table.status !== 'empty' && !pickingTableNames.includes(table.name)) {
               if (!window.confirm(`Bàn ${table.name} đã được đặt trước. Bạn vẫn muốn xếp bàn này (có thể trùng giờ)?`)) {
                 return;
               }
            }
            if (pickingTableNames.includes(table.name)) {
              setPickingTableNames(prev => prev.filter(n => n !== table.name));
            } else {
              // Logic: Khi chọn 1 bàn, nếu tổng số chỗ chưa đủ số khách và khách >= 10, tự động gợi ý/chọn bàn liền kề hoặc cả phòng VIP
              const currentTotalSeats = mockTables
                .filter(t => [...pickingTableNames].includes(t.name))
                .reduce((sum, t) => sum + t.seats, 0) + table.seats;

              if (targetGuests >= 10 && currentTotalSeats < targetGuests) {
                // Ưu tiên VIP: Nếu chọn 1 bàn trong phòng VIP, gợi ý chọn cả phòng
                if (table.room.includes('VIP')) {
                  const emptyVipTables = tablesInArea.filter(t => 
                    t.room === table.room && 
                    t.status === 'empty' && 
                    !pickingTableNames.includes(t.name) &&
                    t.name !== table.name
                  );
                  if (emptyVipTables.length > 0) {
                    setPickingTableNames(prev => [...prev, table.name, ...emptyVipTables.map(t => t.name)]);
                    showToast(`Đã tự động chọn các bàn trống trong phòng ${table.room} cho đoàn ${targetGuests} khách`);
                    return;
                  }
                }
                
                // Logic ghép bàn liền kề (nhiều hơn 1 bàn)
                let seatsAccumulated = table.seats;
                const tablesToPick = [table.name];
                
                const possibleAdjacents = tablesInArea
                  .filter(t => t.status === 'empty' && t.room === table.room && !pickingTableNames.includes(t.name) && t.name !== table.name)
                  .sort((a,b) => Math.abs(parseInt(a.id) - parseInt(table.id)) - Math.abs(parseInt(b.id) - parseInt(table.id)));

                for (let adj of possibleAdjacents) {
                  if (seatsAccumulated >= targetGuests) break;
                  tablesToPick.push(adj.name);
                  seatsAccumulated += adj.seats;
                }
                
                if (tablesToPick.length > 1) {
                  setPickingTableNames(prev => [...prev, ...tablesToPick]);
                  showToast(`Đã tự động ghép ${tablesToPick.length} bàn liền kề cho ${targetGuests} khách`);
                } else {
                  setPickingTableNames(prev => [...prev, table.name]);
                }
              } else {
                setPickingTableNames(prev => [...prev, table.name]);
              }
            }
            return;
          }
          if (table.status === 'empty') {
            // New Order
            setCurrentOrderId('new');
            setSelectedTable(table.id);
            setPickingTableNames([table.name]);
            setOrderItems([]);
            setCurrentOrderGuests(1);
            setPreviousScreen('tables');
            setCurrentScreen('order');
            showToast(`Mở bàn ${table.name}`);
          } else if (table.status === 'serving') {
            // Find existing order for this table
            const existingOrder = orders.find(o => o.tables.includes(table.id) && o.status === 'serving');
            if (existingOrder) {
              setCurrentOrderId(existingOrder.id);
              setOrderItems(existingOrder.items || []);
              setPickingTableNames(existingOrder.tables || []);
              setPreviousScreen('tables');
              setCurrentScreen('order');
              showToast(`Mở Order bàn ${table.name}`);
            } else {
              showToast(`Không tìm thấy Order cho bàn ${table.name}`, 'error');
            }
          }
        }}
        className={`flex flex-col items-center justify-center group cursor-pointer transition-all ${isNotSuggested ? 'opacity-40 hover:opacity-70' : 'hover:scale-105 active:scale-95'}`}
      >
        {isSuggested && (
          <div className="bg-brand text-white text-xs uppercase font-bold px-2 py-0.5 rounded-full absolute -top-12 z-30 shadow-md flex flex-col items-center gap-0 group-hover:-top-14 transition-all">
            <div className="flex items-center gap-1">
               <Sparkles className="w-3 h-3" /> Gợi ý
            </div>
            {table.room.includes('VIP') && <div className="text-xs opacity-90 border-t border-white/20 mt-0.5 pt-0.5">Phòng VIP</div>}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand rotate-45"></div>
          </div>
        )}
        <div className="relative">
          {/* Table Shape */}
          <div className={`
            ${table.type === 'round' ? 'w-24 h-24 rounded-full' : ''}
            ${table.type === 'square' ? 'w-24 h-24 rounded-2xl' : ''}
            ${table.type === 'rect' ? 'w-32 h-24 rounded-2xl' : ''}
            flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden p-2
            ${table.status === 'empty' ? 'border border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md' : ''}
            ${table.status === 'serving' && !table.waitingPayment ? 'bg-gradient-to-br from-brand to-blue-600 text-white shadow-lg shadow-blue-200 lg:shadow-blue-300/30' : ''}
            ${table.status === 'serving' && table.waitingPayment ? 'bg-gradient-to-br from-[#F59E0B] to-amber-600 text-white shadow-lg shadow-amber-200 animate-pulse' : ''}
            ${table.status === 'reserved' ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200' : ''}
            ${isPicked ? 'ring-4 ring-brand ring-offset-2 border-none shadow-xl scale-110 !bg-blue-50' : ''}
          `}>
            {/* Display table name */}
            <span className={`font-black text-sm tracking-wide ${isPicked ? 'text-brand' : (table.status === 'empty' ? 'text-slate-800' : 'text-white')}`}>
              {table.name}
            </span>

            {/* Display capacity or dynamic detail based on status */}
            {table.status === 'empty' ? (
              <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-normal">
                <Users className="w-3 h-3 text-slate-300" />
                {table.seats || 4} chỗ
              </span>
            ) : (
              <>
                <div className="w-10 h-[1px] bg-white/35 my-1" />
                <div className="flex items-center gap-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px] font-bold max-w-full truncate uppercase tracking-wider">
                  {tableDetailType === 'time' && (
                    <>
                      <Clock className="w-2.5 h-2.5" />
                      <span>{table.time}</span>
                    </>
                  )}
                  {tableDetailType === 'guests' && (
                    <>
                      <Users className="w-2.5 h-2.5" />
                      <span>{table.guests || table.seats} khách</span>
                    </>
                  )}
                  {tableDetailType === 'staff' && (
                    <>
                      <User className="w-2.5 h-2.5" />
                      <span>{table.staff || 'N/A'}</span>
                    </>
                  )}
                  {tableDetailType === 'amount' && (
                    <>
                      <Wallet className="w-2.5 h-2.5" />
                      <span>{formatCurrency(table.amount || 0)}</span>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Status Icons on the corner of the table */}
            {(table.status === 'serving' && table.waitingPayment) && (
              <div className="absolute top-1 right-1 bg-white text-[#F59E0B] p-1 rounded-full shadow border border-amber-100 flex items-center justify-center">
                <Receipt className="w-3 h-3 animate-bounce" />
              </div>
            )}

            {(table.status === 'reserved' && table.upcoming) && (
              <div className="absolute top-1 right-1 bg-white text-orange-600 p-1 rounded-full shadow border border-orange-100 flex items-center justify-center">
                <CalendarDays className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Chairs (Visual decoration with dynamic styles and hover movement) */}
          {table.type === 'round' && (
            <>
              {/* Top Chair */}
              <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-t-full transition-transform duration-300 group-hover:-translate-y-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              {/* Bottom Chair */}
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-b-full transition-transform duration-300 group-hover:translate-y-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              {/* Left Chair */}
              <div className={`absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-6 rounded-l-full transition-transform duration-300 group-hover:-translate-x-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              {/* Right Chair */}
              <div className={`absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-6 rounded-r-full transition-transform duration-300 group-hover:translate-x-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
            </>
          )}

          {table.type === 'square' && (
            <>
              {/* Top Chair */}
              <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-t-md transition-transform duration-300 group-hover:-translate-y-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              {/* Bottom Chair */}
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-b-md transition-transform duration-300 group-hover:translate-y-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              {/* Left Chair */}
              <div className={`absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-6 rounded-l-md transition-transform duration-300 group-hover:-translate-x-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              {/* Right Chair */}
              <div className={`absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-6 rounded-r-md transition-transform duration-300 group-hover:translate-x-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
            </>
          )}

          {table.type === 'rect' && (
            <>
              {/* Top Chairs */}
              <div className={`absolute -top-1 left-1/4 -translate-x-1/2 w-6 h-1 rounded-t-md transition-transform duration-300 group-hover:-translate-y-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              <div className={`absolute -top-1 left-3/4 -translate-x-1/2 w-6 h-1 rounded-t-md transition-transform duration-300 group-hover:-translate-y-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              {/* Bottom Chairs */}
              <div className={`absolute -bottom-1 left-1/4 -translate-x-1/2 w-6 h-1 rounded-b-md transition-transform duration-300 group-hover:translate-y-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              <div className={`absolute -bottom-1 left-3/4 -translate-x-1/2 w-6 h-1 rounded-b-md transition-transform duration-300 group-hover:translate-y-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              {/* Left Chair */}
              <div className={`absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-6 rounded-l-md transition-transform duration-300 group-hover:-translate-x-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
              {/* Right Chair */}
              <div className={`absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-6 rounded-r-md transition-transform duration-300 group-hover:translate-x-0.5 ${
                table.status === 'empty' ? 'bg-slate-200 border border-slate-300 shadow-sm' :
                isPicked ? 'bg-blue-300 border border-blue-400' :
                table.waitingPayment ? 'bg-amber-500 border border-amber-400' :
                table.status === 'serving' ? 'bg-blue-500 border border-blue-400' : 'bg-amber-600 border border-amber-500'
              }`} />
            </>
          )}
        </div>
      </div>
      );
    }

    const renderTableGrid = (tables: any[]) => (
      <div className="grid grid-cols-5 gap-y-20 gap-x-8">
        {tables.map(table => renderTableIcon(table))}
      </div>
    );

    return (
      <div className="flex-1 flex flex-col bg-[#EEF0F4] overflow-hidden">
        {isPickingTable && (!isSelectingTableForOrder || currentOrderChannel === 'reservation') && (
          <div className="bg-brand text-white px-6 py-2 flex justify-between items-center shadow-md z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm flex items-center gap-2">
                  {isSelectingTableForOrder && currentOrderChannel !== 'reservation' ? 'Chọn bàn cho đơn hàng' : 'Đang chọn bàn cho đặt chỗ'}
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                    {targetGuests} khách • {targetTime}
                  </span>
                </span>
                <p className="text-sm opacity-80 tracking-widest font-medium">
                  {isSelectingTableForOrder && currentOrderChannel !== 'reservation' 
                    ? 'Bạn có thể chọn một hoặc nhiều bàn khách ngồi' 
                    : 'Hệ thống gợi ý các bàn có thiết kế đáp ứng số lượng khách'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                if (isSelectingTableForOrder) {
                  setIsSelectingTableForOrder(false);
                  setCurrentScreen('order');
                  return;
                }
                setIsPickingTable(false);
                setIsCheckingIn(false);
                setCurrentScreen('reservations');
                if (selectedReservation) setShowReservationDetail(true);
                else setShowAddReservation(true);
              }}
              className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" /> HỦY CHỌN
            </button>
          </div>
        )}
        {/* Top Header: Search & View Modes */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
          <div className="w-[500px] relative">
            <input 
              type="text" 
              placeholder="Nhập tìm kiếm bàn" 
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-medium bg-slate-50"
              value={tableSearchQuery || ''}
              onChange={(e) => setTableSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          
          {!isPickingTable && (
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'time', label: 'Thời gian' },
                  { id: 'guests', label: 'Số khách' },
                  { id: 'staff', label: 'Nhân viên' },
                  { id: 'amount', label: 'Tổng tiền' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setTableDetailType(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-normal transition-all ${tableDetailType === tab.id ? 'bg-white shadow-sm text-brand' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => {
                  setNewTableName(`${tablesList.length + 101}`);
                  setNewTableSeats(4);
                  setNewTableFloor(activeFloor);
                  setNewTableRoom(activeRoom === 'Tất cả' ? 'Trong nhà' : activeRoom);
                  setShowAddTableModal(true);
                }}
                className="flex items-center gap-2 h-10 px-5 bg-brand text-white font-bold rounded-xl text-xs hover:bg-[#005FEA] transition-all shadow-md active:scale-95 shrink-0"
              >
                <PlusCircle className="w-4 h-4" /> Thêm bàn
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Floors & Rooms */}
          <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-4 flex flex-col gap-2 overflow-y-auto">
              {floors.map(floor => (
                <div key={floor.name} className="flex flex-col">
                  <button 
                    onClick={() => {
                      setActiveFloor(floor.name);
                      setActiveRoom('Tất cả');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      activeFloor === floor.name ? 'bg-brand text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-normal text-sm">{floor.name} ({floor.count})</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeFloor === floor.name ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeFloor === floor.name && floor.rooms.length > 0 && (
                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 pl-2">
                      {floor.rooms.map(room => (
                        <button 
                          key={room}
                          onClick={() => setActiveRoom(room)}
                          className={`p-2 text-left text-sm rounded-lg transition-all ${
                            activeRoom === room ? 'bg-blue-50 text-brand font-bold' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {room}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-auto p-6 flex justify-center">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2965/2965567.png" 
                alt="Table Illustration" 
                className="w-32 opacity-20 grayscale"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Main Content: Table Map */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Status Summary Bar - Filter Row */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shrink-0 overflow-x-auto hide-scrollbar">
              <div className="text-sm font-normal text-slate-400 whitespace-nowrap mr-2">Bộ lọc:</div>
              
              <div 
                onClick={() => setTableFilter('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border ${
                  tableFilter === 'all' ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-105' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-sm font-normal whitespace-nowrap">Tất cả ({tablesInArea.length})</span>
              </div>

              <div 
                onClick={() => setTableFilter('empty')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border ${
                  tableFilter === 'empty' ? 'bg-slate-200 text-slate-800 border-slate-300 shadow-md scale-105' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-2 h-2 rounded-full border border-slate-300 bg-white shadow-inner"></div>
                <span className="text-sm font-normal whitespace-nowrap">Bàn trống ({tablesInArea.filter(t => t.status === 'empty').length})</span>
              </div>

              <div 
                onClick={() => setTableFilter('reserved')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border ${
                  tableFilter === 'reserved' ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-105' : 'bg-white text-amber-500 border-amber-500/20 hover:bg-amber-50'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                <span className="text-sm font-normal whitespace-nowrap">Đặt trước ({tablesInArea.filter(t => t.status === 'reserved').length})</span>
              </div>

              {!isPickingTable && (
                <div 
                  onClick={() => setTableFilter('serving')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border ${
                    tableFilter === 'serving' ? 'bg-brand text-white border-brand shadow-md scale-105' : 'bg-white text-brand border-brand/20 hover:bg-blue-50'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                  <span className="text-sm font-normal whitespace-nowrap">Đang phục vụ ({tablesInArea.filter(t => t.status === 'serving').length})</span>
                </div>
              )}

              {tableFilter !== 'all' && (
                <button 
                  onClick={() => setTableFilter('all')}
                  className="ml-auto text-xs font-normal text-slate-400 hover:text-red-500 transition-colors tracking-widest pl-4"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Table Grid */}
            <div className="flex-1 overflow-y-auto p-12 bg-white m-4 rounded-2xl shadow-sm">
              {activeFloor === 'Tầng 1' && activeRoom === 'Tất cả' && filteredTables.some(t => t.room === 'Ngoài' || t.room === 'VIP1') ? (
                <div className="flex flex-col gap-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-sm font-normal text-slate-800 tracking-wider">Khu vực ngoài</h3>
                      <div className="flex-1 h-px bg-slate-100"></div>
                    </div>
                    {renderTableGrid(filteredTables.filter(t => t.room === 'Ngoài'))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                      <div className="flex items-center gap-4">
                        <h3 className="text-sm font-normal text-brand tracking-wider">VIP 1</h3>
                        <div className="flex-1 h-px bg-blue-100"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-12 gap-x-6">
                        {filteredTables.filter(t => t.room === 'VIP1').map(table => renderTableIcon(table))}
                      </div>
                    </div>

                    <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                      <div className="flex items-center gap-4">
                        <h3 className="text-sm font-normal text-brand tracking-wider">VIP 2</h3>
                        <div className="flex-1 h-px bg-blue-100"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-12 gap-x-6">
                        {filteredTables.filter(t => t.room === 'VIP2').map(table => renderTableIcon(table))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                renderTableGrid(filteredTables)
              )}
            </div>



            {isPickingTable && (
              <div className="bg-white border-t border-slate-200 p-4 shrink-0 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.05)] z-20">
                <div className="flex items-center gap-4 text-sm whitespace-nowrap overflow-hidden flex-1 mr-4">
                  <span className="font-normal text-slate-500 shrink-0">Đã chọn:</span>
                  <span className="font-bold text-brand truncate">
                    {pickingTableNames.length > 0 ? pickingTableNames.map(n => `Bàn ${n}`).join(', ') : 'Chưa có bàn nào'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if (isSelectingTableForOrder) {
                        setIsSelectingTableForOrder(false);
                        setCurrentScreen('order');
                        return;
                      }
                      setIsPickingTable(false);
                      setIsCheckingIn(false);
                      setCurrentScreen('reservations');
                      if (selectedReservation) setShowReservationDetail(true);
                      else setShowAddReservation(true);
                    }}
                    className="btn-cancel px-6"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={() => {
                      const tablesStr = pickingTableNames.length > 0 ? pickingTableNames.map(n => `Bàn ${n}`).join(', ') : '';
                      if (isSelectingTableForOrder) {
                        // In a real app we'd update the the order object, for now we update our local state/mock
                        if (currentOrderId && currentOrderId !== 'new') {
                          setOrders(prev => prev.map(o => o.id === currentOrderId ? { ...o, tables: pickingTableNames } : o));
                        }
                        setSelectedTable(pickingTableNames[0] || null);
                        setIsSelectingTableForOrder(false);
                        setCurrentScreen('order');
                        return;
                      }
                      if (!selectedReservation) {
                        setNewReservation(prev => ({ ...prev, table: tablesStr }));
                        setShowAddReservation(true);
                      } else {
                        if (isCheckingIn) {
                          handleCheckIn(selectedReservation, tablesStr);
                        } else {
                          const nextStatus = selectedReservation.status === 'pending' ? 'confirmed' : 'seated';
                          setReservations((prev: any) => prev.map((r: any) => r.id === selectedReservation.id ? { ...r, status: nextStatus, table: tablesStr } : r));
                          setSelectedReservation(prev => ({ ...prev, status: nextStatus, table: tablesStr }));
                          setShowReservationDetail(true);
                        }
                      }
                      setIsPickingTable(false);
                      setIsCheckingIn(false);
                      setCurrentScreen('reservations');
                      if (!isCheckingIn) {
                        showToast(`Đã lưu lựa chọn ${pickingTableNames.length} bàn`);
                      }
                    }}
                    disabled={pickingTableNames.length === 0}
                    className="btn-confirm px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Xác nhận {pickingTableNames.length > 0 ? `(${pickingTableNames.length})` : ''}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER INVOICES SCREEN
  // ==========================================
  const renderInvoicesScreen = () => {
    const filteredInvoices = mockInvoices.filter(inv => 
      inv.id.includes(invoiceSearchQuery) || 
      inv.customer.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
      inv.orderNo.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
    );

    const renderCustomerEditModal = () => {
      if (!isCustomerEditOpen) return null;

      const handleSave = () => {
        const errors: { [key: string]: string } = {};
        if (customerEditType === 'individual') {
          if (!customerEditData.buyerName.trim()) errors.buyerName = 'Trường này không được để trống';
          if (!customerEditData.address.trim()) errors.address = 'Trường này không được để trống';
        } else {
          if (!customerEditData.organizationName.trim()) errors.organizationName = 'Trường này không được để trống';
          if (!customerEditData.address.trim()) errors.address = 'Trường này không được để trống';
        }

        if (Object.keys(errors).length > 0) {
          setCustomerEditErrors(errors);
          return;
        }

        // Save logic
        const finalName = customerEditType === 'individual' ? customerEditData.buyerName : customerEditData.organizationName;
        setIssueFormData({ ...issueFormData, customerName: finalName });
        setIsCustomerEditOpen(false);
      };

      return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Cập nhật thông tin người mua</h2>
              <button 
                onClick={() => setIsCustomerEditOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Type Switcher */}
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${customerEditType === 'individual' ? 'border-brand' : 'border-slate-300'}`}>
                    {customerEditType === 'individual' && <div className="w-2.5 h-2.5 bg-brand rounded-full" />}
                  </div>
                  <input 
                    type="radio" 
                    className="hidden" 
                    name="customerEditType" 
                    checked={customerEditType === 'individual'} 
                    onChange={() => {
                        setCustomerEditType('individual');
                        setCustomerEditErrors({});
                    }}
                  />
                  <span className="text-sm font-normal text-slate-700">Cá nhân</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${customerEditType === 'business' ? 'border-brand' : 'border-slate-300'}`}>
                    {customerEditType === 'business' && <div className="w-2.5 h-2.5 bg-brand rounded-full" />}
                  </div>
                  <input 
                    type="radio" 
                    className="hidden" 
                    name="customerEditType" 
                    checked={customerEditType === 'business'} 
                    onChange={() => {
                        setCustomerEditType('business');
                        setCustomerEditErrors({});
                    }}
                  />
                  <span className="text-sm font-normal text-slate-700">Công ty/Hộ kinh doanh</span>
                </label>
              </div>

              {/* Form Content */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                {/* Field 1: Tax / CID */}
                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                  <label className="text-sm font-bold text-slate-800 text-left">
                    {customerEditType === 'individual' ? 'Căn cước công dân' : 'Mã số thuế/CCCD'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={customerEditType === 'individual' ? 'Nhập số CCCD người mua' : 'Nhập mã số thuế/CCCD chủ hộ KD'}
                    value={customerEditData.taxCode || ''}
                    onChange={(e) => setCustomerEditData({ ...customerEditData, taxCode: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                {/* Field 2: Name */}
                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                  <label className="text-sm font-bold text-slate-800 text-left">
                    {customerEditType === 'individual' ? 'Tên người mua' : 'Tên đơn vị'} <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <input 
                      type="text" 
                      placeholder={customerEditType === 'individual' ? 'Nhập tên người mua' : 'Nhập tên đơn vị'}
                      value={(customerEditType === 'individual' ? customerEditData.buyerName : customerEditData.organizationName) || ''}
                      onChange={(e) => setCustomerEditData({ 
                        ...customerEditData, 
                        [customerEditType === 'individual' ? 'buyerName' : 'organizationName']: e.target.value 
                      })}
                      className={`w-full h-10 px-3 bg-white border ${customerEditErrors.buyerName || customerEditErrors.organizationName ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors`}
                    />
                    {(customerEditErrors.buyerName || customerEditErrors.organizationName) && (
                      <div className="text-[11px] text-red-500 mt-1 text-left">{customerEditErrors.buyerName || customerEditErrors.organizationName}</div>
                    )}
                  </div>
                </div>

                {/* Field 3: Address */}
                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                  <label className="text-sm font-bold text-slate-800 text-left">Địa chỉ <span className="text-red-500">*</span></label>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nhập địa chỉ"
                      value={customerEditData.address || ''}
                      onChange={(e) => setCustomerEditData({ ...customerEditData, address: e.target.value })}
                      className={`w-full h-10 px-3 bg-white border ${customerEditErrors.address ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors`}
                    />
                    {customerEditErrors.address && (
                      <div className="text-[11px] text-red-500 mt-1 text-left">{customerEditErrors.address}</div>
                    )}
                  </div>
                </div>

                {/* Additional Fields based on type */}
                {customerEditType === 'individual' ? (
                  <>
                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-sm font-bold text-slate-800 text-left">Số điện thoại</label>
                      <input 
                        type="text" 
                        placeholder="Nhập số điện thoại người mua"
                        value={customerEditData.phone || ''}
                        onChange={(e) => setCustomerEditData({ ...customerEditData, phone: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-sm font-bold text-slate-800 text-left">Số hộ chiếu</label>
                      <input 
                        type="text" 
                        placeholder="Nhập số hộ chiếu"
                        value={customerEditData.passport || ''}
                        onChange={(e) => setCustomerEditData({ ...customerEditData, passport: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-sm font-bold text-slate-800 text-left">Tên người mua</label>
                      <input 
                        type="text" 
                        placeholder="Nhập tên người mua hàng"
                        value={customerEditData.buyerName}
                        onChange={(e) => setCustomerEditData({ ...customerEditData, buyerName: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-sm font-bold text-slate-800 text-left">Số điện thoại</label>
                      <input 
                        type="text" 
                        placeholder="Nhập số điện thoại người mua"
                        value={customerEditData.phone || ''}
                        onChange={(e) => setCustomerEditData({ ...customerEditData, phone: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-sm font-bold text-slate-800 text-left leading-tight">Mã quan hệ NS</label>
                      <input 
                        type="text" 
                        placeholder="Nhập mã quan hệ ngân sách"
                        value={customerEditData.budgetRelationCode}
                        onChange={(e) => setCustomerEditData({ ...customerEditData, budgetRelationCode: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsCustomerEditOpen(false)}
                className="px-6 h-10 rounded-lg border border-slate-300 text-sm font-normal text-slate-700 hover:bg-white transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={handleSave}
                className="px-8 h-10 rounded-lg bg-brand text-sm font-bold text-white hover:bg-brand-hover shadow-md transition-all active:scale-95"
              >
                Lưu
              </button>
            </div>
          </motion.div>
        </div>
      );
    };

    const totalAmountInvoices = (filteredInvoices || []).reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const renderIssueInvoiceModal = () => {
      if (!isIssueModalOpen) return null;

      const validate = () => {
        const errors: { [key: string]: string } = {};
        if (!issueFormData.invoiceDate) errors.invoiceDate = 'Trường này không được để trống';
        if (!issueFormData.series) errors.series = 'Trường này không được để trống';
        if (issueFormData.sendToCustomer) {
          if (!issueFormData.recipientEmail) {
            errors.recipientEmail = 'Trường này không được để trống';
          } else {
            const emails = issueFormData.recipientEmail.split(';').map(e => e.trim());
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emails.some(email => !emailRegex.test(email))) {
              errors.recipientEmail = 'Email không đúng định dạng';
            }
          }
        }
        return errors;
      };

      const errors = validate();
      const isValid = Object.keys(errors).length === 0;

      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-[650px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Phát hành hóa đơn</h2>
              <button 
                onClick={() => setIsIssueModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 pb-6 overflow-y-auto max-h-[80vh]">
              {/* 1. Loại hóa đơn - Hidden per request */}
              {/* 
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-800 mb-3 text-left">Loại hóa đơn phát hành</label>
                ...
              </div>
              */}

              {/* 2. Thông tin hóa đơn */}
              <div className="border border-slate-200 rounded-xl p-5 mb-6 space-y-5">
                {/* Ngày hóa đơn */}
                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-sm font-normal text-slate-600 text-left">
                      Ngày hóa đơn <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <div className="relative">
                        <input 
                          type="text" 
                          value={issueFormData.invoiceDate}
                          onChange={(e) => setIssueFormData({ ...issueFormData, invoiceDate: e.target.value })}
                          className={`w-full h-10 px-3 pr-10 bg-white border ${errors.invoiceDate ? 'border-[#D32F2F]' : (issueFormData.invoiceDate ? 'border-brand' : 'border-slate-300')} rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors`}
                        />
                        <CalendarDays className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.invoiceDate && <div className="text-[11px] text-[#D32F2F] mt-1 text-left">{errors.invoiceDate}</div>}
                    </div>
                  </div>

                  {/* Ký hiệu */}
                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-sm font-normal text-slate-600 text-left">
                      Ký hiệu <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={issueFormData.series}
                        onChange={(e) => setIssueFormData({ ...issueFormData, series: e.target.value })}
                        className="w-full h-10 px-3 pr-10 bg-white border border-slate-300 rounded-lg text-sm font-normal appearance-none focus:outline-none focus:border-brand transition-colors"
                      >
                        <option value="1C26MAH">1C26MAH</option>
                        <option value="1C26MBH">1C26MBH</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Khách hàng */}
                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-sm font-normal text-slate-600 text-left">Khách hàng</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">{issueFormData.customerName}</span>
                      <button 
                        onClick={() => {
                          // Initialize customer edit data with current name if possible
                          setCustomerEditData({
                            taxCode: '',
                            buyerName: issueFormData.customerName === 'Khách lẻ không lấy hóa đơn' ? '' : issueFormData.customerName,
                            address: '',
                            phone: '',
                            passport: '',
                            organizationName: '',
                            budgetRelationCode: ''
                          });
                          setCustomerEditErrors({});
                          setIsCustomerEditOpen(true);
                        }}
                        className="text-sm font-normal text-brand flex items-center gap-1 hover:underline"
                      >
                        <NotebookPen className="w-3.5 h-3.5" /> Sửa thông tin
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Tùy chọn gửi hóa đơn */}
                <div className="mb-6">
                  <label 
                    className="flex items-center gap-2 cursor-pointer mb-4"
                    onClick={() => setIssueFormData(prev => ({ ...prev, sendToCustomer: !prev.sendToCustomer }))}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${issueFormData.sendToCustomer ? 'bg-brand border-brand' : 'border-slate-300'}`}>
                      {issueFormData.sendToCustomer && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm font-normal text-slate-700">Gửi hóa đơn cho khách hàng</span>
                  </label>

                  {issueFormData.sendToCustomer && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pl-7 space-y-4 overflow-hidden"
                    >
                      <div className="space-y-1.5">
                        <label className="text-sm font-normal text-slate-600 block text-left">Tên người nhận</label>
                        <input 
                          type="text" 
                          placeholder="Nhập tên người nhận"
                          value={issueFormData.recipientName}
                          onChange={(e) => setIssueFormData({ ...issueFormData, recipientName: e.target.value })}
                          className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-normal text-slate-600 block text-left">
                          Email <span className="text-red-500 font-bold">*</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Mỗi email cách nhau bởi dấu ;"
                            value={issueFormData.recipientEmail}
                            onChange={(e) => setIssueFormData({ ...issueFormData, recipientEmail: e.target.value })}
                            className={`w-full h-10 px-3 bg-white border ${errors.recipientEmail ? 'border-[#D32F2F]' : (issueFormData.recipientEmail ? 'border-brand' : 'border-slate-300')} rounded-lg text-sm font-normal focus:outline-none focus:border-brand transition-colors`}
                          />
                          {errors.recipientEmail && <div className="text-[11px] text-[#D32F2F] mt-1 text-left">{errors.recipientEmail}</div>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 4. Tùy chọn ký số */}
                <label 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setIssueFormData(prev => ({ ...prev, signDigital: !prev.signDigital }))}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${issueFormData.signDigital ? 'bg-brand border-brand' : 'border-slate-300'}`}>
                    {issueFormData.signDigital && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-sm font-normal text-slate-700">Ký số khi phát hành hóa đơn</span>
                </label>

                {/* 5. Phương thức ký số (Chỉ hiển thị khi check Ký số) */}
                <AnimatePresence>
                  {issueFormData.signDigital && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-7 mt-4 space-y-3 overflow-hidden"
                    >
                      {/* Option A: USB TOKEN */}
                      <div 
                        onClick={() => setIssueFormData({ ...issueFormData, signingMethod: 'usb' })}
                        className={`p-3.5 border rounded-[6px] flex items-center gap-4 cursor-pointer transition-all ${issueFormData.signingMethod === 'usb' ? 'bg-brand-light border-brand' : 'bg-white border-[#BDBDBD] hover:bg-[#F5F5F5]'}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${issueFormData.signingMethod === 'usb' ? 'border-brand' : 'border-slate-300'}`}>
                          {issueFormData.signingMethod === 'usb' && <div className="w-2.5 h-2.5 bg-brand rounded-full" />}
                        </div>
                        
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                            <motion.div
                              animate={{ 
                                scale: [1, 1.05, 1]
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="w-full h-full flex items-center justify-center p-1.5"
                            >
                              <img 
                                src="https://cdn.pixabay.com/photo/2013/07/13/10/43/usb-157654_640.png" 
                                alt="USB TOKEN" 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </motion.div>
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-slate-800">Ký số trực tiếp qua USB TOKEN</span>
                            <span className="text-xs text-slate-500">Vui lòng mở MISA KYSO và cắm USB</span>
                          </div>
                        </div>
                      </div>

                      {/* Option B: MISA eSign */}
                      <div 
                        onClick={() => setIssueFormData({ ...issueFormData, signingMethod: 'esign' })}
                        className={`p-3.5 border rounded-[6px] flex items-center gap-4 cursor-pointer transition-all ${issueFormData.signingMethod === 'esign' ? 'bg-brand-light border-brand' : 'bg-white border-[#BDBDBD] hover:bg-[#F5F5F5]'}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${issueFormData.signingMethod === 'esign' ? 'border-brand' : 'border-slate-300'}`}>
                          {issueFormData.signingMethod === 'esign' && <div className="w-2.5 h-2.5 bg-brand rounded-full" />}
                        </div>
                        
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                            <img 
                              src="https://fastly.mwm-storage.mwmcdn.com/raw_files/01fc49cd-2d5b-47bd-8310-ccb00a309e87?height=640&format=webp" 
                              alt="MISA eSign" 
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-slate-800">Ký số từ xa qua MISA eSign</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-6 h-10 rounded-lg border border-slate-300 text-sm font-normal text-slate-700 hover:bg-white transition-colors"
                >
                  Hủy
                </button>
                <button 
                  className="px-6 h-10 rounded-lg border border-brand text-sm font-normal text-brand hover:bg-brand-light transition-colors"
                >
                  Xem trước
                </button>
                <button 
                  disabled={!isValid}
                  onClick={() => {
                    setMockInvoices(prev => prev.map(i => i.id === selectedInvoiceForIssue.id ? {...i, eInvoiceIssued: true} : i));
                    showToast(`Đã phát hành hóa đơn thành công!`);
                    setIsIssueModalOpen(false);
                  }}
                  className={`px-6 h-10 rounded-lg text-sm font-bold text-white transition-all ${isValid ? 'bg-brand hover:bg-brand-hover shadow-md active:scale-95' : 'bg-slate-300 cursor-not-allowed grayscale'}`}
                >
                  Phát hành
                </button>
              </div>
          </motion.div>
        </div>
      );
    };

    return (
      <div className="flex-1 flex flex-col bg-background overflow-hidden relative">
        {/* Top Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-8 shrink-0">
          <div className="flex h-full">
            {[
              { id: 'list', label: 'Danh sách hóa đơn' },
              { id: 'search', label: 'Tra cứu hóa đơn' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setInvoiceTab(tab.id as any)}
                className={`px-6 h-full font-normal text-sm transition-all relative ${
                  invoiceTab === tab.id ? 'text-brand' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {invoiceTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Tìm theo bàn/số HĐ/số order/KH..." 
              value={invoiceSearchQuery || ''}
              onChange={(e) => setInvoiceSearchQuery(e.target.value)}
              className="w-full h-10 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal focus:outline-none focus:border-brand"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative w-40">
            <select className="w-full h-10 pl-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal appearance-none focus:outline-none focus:border-brand">
              <option>Lọc</option>
              <option>Đã thu tiền</option>
              <option>Ghi nợ</option>
              <option>Đã hủy</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-slate-500">Từ</span>
            <div className="relative">
              <input 
                type="date" 
                value={invoiceDateFrom}
                onChange={(e) => setInvoiceDateFrom(e.target.value)}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal focus:outline-none focus:border-brand"
              />
            </div>
            <span className="text-sm font-normal text-slate-500">Đến</span>
            <div className="relative">
              <input 
                type="date" 
                value={invoiceDateTo}
                onChange={(e) => setInvoiceDateTo(e.target.value)}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
              <RotateCw className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto bg-white">
          <table id="tour-invoice-list" className="w-full border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 tracking-wider">Thời gian</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 tracking-wider">Số hóa đơn</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 tracking-wider">Khách lấy hóa đơn</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 tracking-wider">Tổng thanh toán</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 tracking-wider">HĐĐT</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 tracking-wider">Chức năng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-slate-800">{inv.time}</div>
                    <div className="text-sm text-slate-400 font-normal">{inv.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left cursor-pointer group/id" onClick={() => showToast(`Xem chi tiết hóa đơn ${inv.id}`)}>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-normal text-brand uppercase tracking-tighter group-hover/id:underline">{inv.id}</div>
                        <div className="text-sm text-slate-400 font-normal">{inv.orderNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-slate-800">{inv.customer}</div>
                    <div className="text-sm text-slate-400 font-normal">{inv.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {inv.invoiceRequested && (
                      <div className="flex items-center justify-center text-emerald-600">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-normal text-slate-800">{formatCurrency(inv.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={inv.status} type="invoice" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={inv.eInvoiceIssued ? 'issued' : 'not_issued'} type="einvoice" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!inv.eInvoiceIssued && (
                        <button 
                          onClick={() => {
                            if (!invoiceSettings.isConnected) {
                              setPendingActionInvoice(inv);
                              setShowMisaAlert(true);
                              return;
                            }
                            setSelectedInvoiceForIssue(inv);
                            setIssueFormData({
                              invoiceType: 'MTT',
                              invoiceDate: '17/04/2026',
                              series: '1C26MAH',
                              customerName: inv.customer || 'Khách lẻ không lấy hóa đơn',
                              sendToCustomer: false,
                              recipientName: inv.customer || '',
                              recipientEmail: '',
                              signDigital: false
                            });
                            setIsIssueModalOpen(true);
                          }}
                          title="Phát hành HĐĐT"
                          className="w-11 h-11 flex items-center justify-center text-brand border border-brand/20 bg-white hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => showToast(`In hóa đơn ${inv.id}`)}
                        className="w-11 h-11 flex items-center justify-center text-slate-500 border border-slate-200 bg-white hover:text-brand hover:border-brand/40 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                      <div className="relative group/more">
                        <button className="w-11 h-11 flex items-center justify-center text-slate-500 border border-slate-200 bg-white hover:text-brand hover:border-brand/40 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-2 w-48 hidden group-hover/more:block z-20">
                          {inv.status !== 'cancelled' && (
                            <>
                              <button 
                                onClick={() => {
                                  setMockInvoices(prev => prev.map(i => i.id === inv.id ? {...i, status: 'cancelled'} : i));
                                  showToast(`Đã hủy hóa đơn ${inv.id}`);
                                }}
                                className="w-full px-4 py-2 text-left text-sm font-normal text-red-500 hover:bg-red-50 flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" /> Hủy hóa đơn
                              </button>
                              {!inv.eInvoiceIssued && (
                                <button 
                                  onClick={() => {
                                    setSelectedInvoiceForIssue(inv);
                                    setIssueFormData({
                                      invoiceType: 'MTT',
                                      invoiceDate: '17/04/2026',
                                      series: '1C26MAH',
                                      customerName: inv.customer || 'Khách lẻ không lấy hóa đơn',
                                      sendToCustomer: false,
                                      recipientName: inv.customer || '',
                                      recipientEmail: '',
                                      signDigital: false
                                    });
                                    setIsIssueModalOpen(true);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm font-normal text-brand hover:bg-blue-50 flex items-center gap-2"
                                >
                                  <Send className="w-4 h-4" /> Phát hành HĐĐT
                                </button>
                              )}
                            </>
                          )}
                          <button className="w-full px-4 py-2 text-left text-sm font-normal text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Khác
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="h-12 bg-slate-50 border-t border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="text-sm font-normal text-slate-600">
            Tổng số: <span className="text-slate-800 font-normal">{filteredInvoices.length}</span>
          </div>
          <div className="text-sm font-normal text-slate-800">
            {formatCurrency(totalAmountInvoices)}
          </div>
        </div>

        {renderIssueInvoiceModal()}
        {renderCustomerEditModal()}
      </div>
    );
  };

  // ==========================================
  // RENDER PAYMENT SCREEN (Existing)
  // ==========================================
  const renderPaymentScreen = () => {
    const currentOrder = currentOrderId === 'new' ? null : orders.find(o => o.id === currentOrderId);
    return (
      <div className="h-full w-full overflow-hidden bg-background p-3 flex gap-3 font-sans text-slate-800">
        
        {/* LEFT COLUMN: Order Details (~30%) */}
        <div className="w-[400px] shrink-0 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Order Header */}
          <div className="bg-slate-50 p-3 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <button 
                onClick={() => setCurrentScreen('order')}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 active:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900 truncate max-w-[220px]">
                  {currentOrder?.tables?.length ? currentOrder.tables.map(t => `Bàn ${t}`).join(', ') : (currentOrder?.label || 'Bàn 101, 102')}
                </h2>
                <p className="text-sm text-slate-500 font-medium">#{currentOrder?.orderNo || '2410000001'}</p>
              </div>
              <div className="ml-auto flex items-center text-amber-600 text-sm font-medium bg-amber-50 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 mr-1" />
                1h05'
              </div>
            </div>
          
          {/* Customer Selection / Display */}
          <div className="relative">
            {!selectedCustomerObj ? (
              <button 
                onClick={() => setShowPaymentCustomerDropdown(true)}
                className="w-full h-[52px] flex items-center gap-3 px-4 rounded-xl border border-dashed border-brand/40 text-brand font-bold text-sm bg-blue-50/30 hover:bg-blue-50 transition-all group"
              >
                <div className="bg-brand text-white p-1 rounded-full group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Chọn khách hàng</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5 text-sm text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 relative group">
                <button 
                  onClick={() => setShowPaymentCustomerDropdown(true)}
                  className="bg-blue-100 p-1.5 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <User className="w-4 h-4 text-brand" />
                </button>
                <div className="flex-1 min-w-0" onClick={() => setShowPaymentCustomerDropdown(true)}>
                  <div className="font-bold flex items-center justify-between">
                    <span className="truncate">{selectedCustomerObj.name}</span>
                  </div>
                  <div className="text-[12px] flex items-center flex-wrap gap-x-2 mt-0.5">
                    <span className="text-slate-400 font-medium">{selectedCustomerObj.phone}</span>
                    <span className="text-slate-300">|</span>
                    {selectedCustomerObj.debt !== 0 && (
                      <>
                        <span className={`italic font-bold ${selectedCustomerObj.debt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          Nợ: {formatCurrency(selectedCustomerObj.debt)}
                        </span>
                        <span className="text-slate-300">|</span>
                      </>
                    )}
                    <span className="text-blue-500 font-bold">Điểm: {selectedCustomerObj.points}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentOrderId && currentOrderId !== 'new') {
                      setOrders(prev => prev.map(o => o.id === currentOrderId ? { ...o, customer: '' } : o));
                    }
                    setCurrentOrderCustomer(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {showPaymentCustomerDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 sticky top-0 bg-white border-b border-slate-50">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Tìm khách hàng..." 
                      autoFocus
                      className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-brand"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {customers
                    .filter(c => 
                      !customerSearchQuery || 
                      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || 
                      c.phone.includes(customerSearchQuery)
                    )
                    .map((cust, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (currentOrderId && currentOrderId !== 'new') {
                            setOrders(prev => prev.map(o => o.id === currentOrderId ? { ...o, customer: cust.name } : o));
                          }
                          setCurrentOrderCustomer(cust);
                          setCustomerSearchQuery('');
                          setShowPaymentCustomerDropdown(false);
                        }}
                        className="flex flex-col px-4 py-2.5 hover:bg-brand/5 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <div className="text-sm font-bold text-slate-700">{cust.name}</div>
                        <div className="text-[12px] text-slate-400 font-medium flex items-center justify-between">
                          <span>{cust.phone}</span>
                          <span className="text-blue-500 font-bold">Điểm: {cust.points}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {showPaymentCustomerDropdown && (
              <div className="fixed inset-0 z-40" onClick={() => setShowPaymentCustomerDropdown(false)}></div>
            )}
          </div>
        </div>

        {/* Order Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {(() => {
            // Merge identical items
            const mergedItems: any[] = [];
            orderItems.forEach(item => {
              const key = `${item.id}-${item.price}-${item.note || ''}-${JSON.stringify(item.addons)}`;
              const existing = mergedItems.find(mi => mi.mergeKey === key);
              if (existing) {
                existing.qty += item.qty;
              } else {
                mergedItems.push({ ...item, mergeKey: key });
              }
            });

            return mergedItems.map((item, index) => (
              <div key={item.instanceId || `${item.id}-${index}`} className="space-y-1">
                <div className="flex justify-between items-start group">
                  <div className="flex-1">
                    <div className="font-bold text-base text-slate-800 tracking-tight">
                      <span className="text-brand mr-2">{item.qty} x</span>
                      {item.name}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                      Đơn giá: {formatCurrency(item.price)}
                    </div>
                    {item.note && (
                      <div className="text-sm text-amber-600 font-bold italic mt-1.5 flex items-center gap-1">
                        <NotebookPen className="w-4 h-4" /> {item.note}
                      </div>
                    )}
                    {(() => {
                      const itemPromos = !item.isPromoRemoved ? getItemPromotion(item.name) : [];
                      let selectedPromo = null;
                      if (itemPromos.length > 0) {
                        selectedPromo = item.selectedPromoId ? itemPromos.find(p => p.id === item.selectedPromoId) : itemPromos.find(p => p.isAuto) || itemPromos[0];
                      }
                      if (selectedPromo) {
                        let discAmount = 0;
                        if (selectedPromo.type === 'percent' && selectedPromo.discount) discAmount = (item.price * item.qty) * selectedPromo.discount;
                        else if (selectedPromo.type === 'amount' && selectedPromo.discount) discAmount = selectedPromo.discount * item.qty;
                        else if (selectedPromo.type === 'gift') discAmount = item.price * item.qty;

                        return (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Tag className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-xs text-red-500 font-medium italic">
                              KM: {selectedPromo.label || selectedPromo.name} (-{formatCurrency(discAmount)})
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-base text-slate-900">{formatCurrency(item.price * item.qty)}</div>
                  </div>
                </div>
                
                {/* Addons */}
                {item.addons.map((addon: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center pl-4 text-sm">
                    <div className="text-slate-500 flex items-center gap-2">
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      {addon.name} ({addon.qty})
                    </div>
                    <div className="text-slate-600 font-medium">
                      {addon.price > 0 ? formatCurrency(addon.price * addon.qty) : ''}
                    </div>
                  </div>
                ))}
              </div>
            ));
          })()}
          {orderItems.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                <circle cx="50" cy="50" r="50" fill="url(#paint0_linear_empty_order)"/>
                <g clipPath="url(#clip0_empty_order)">
                  <path d="M31.2389 43.288C28.7651 48.0323 27.6186 57.1713 28.4096 64.6393L36.6428 59.0767C36.7144 56.2754 35.1689 47.1831 33.0852 43.2807C32.7071 42.5726 31.61 42.5764 31.2389 43.288Z" fill="white"/>
                  <path d="M38.7254 62.2266V43.5597C38.7254 43.1279 38.1189 42.9813 37.9034 43.3611C33.7168 50.7371 30.9262 57.8189 29.3761 64.6392L38.7254 62.2266Z" fill="#F0F0F0"/>
                  <path d="M27.8037 64.6395C30.7828 61.0698 35.0902 57.6113 40.1131 54.2127C40.4247 54.0019 40.8454 54.2239 40.8454 54.6V64.6395L34.3245 66.1166L27.8037 64.6395Z" fill="white"/>
                  <path d="M50.219 28.6756V34.7534H56.3579V28.6756C56.3579 28.1938 55.9674 27.8032 55.4855 27.8032H51.0914C50.6097 27.8032 50.219 28.1938 50.219 28.6756Z" fill="#407194"/>
                  <path d="M55.4857 27.8032H52.7402C53.2221 27.8032 53.6128 28.1938 53.6128 28.6756V34.7534H56.3581V28.6756C56.3579 28.1938 55.9674 27.8032 55.4857 27.8032Z" fill="#365F7E"/>
                  <path d="M45.9698 46.6528C46.2918 44.8462 47.2967 43.2123 48.802 42.1089L49.7193 41.4383C50.0339 41.2078 50.2188 40.8415 50.2188 40.453V34.7542H56.3577V40.453C56.3577 40.8415 56.5437 41.2078 56.8569 41.4383L57.7742 42.1089C59.2794 43.2123 60.2854 44.8462 60.6074 46.6528L53.2884 48.1298L45.9698 46.6528Z" fill="#8DBEFF"/>
                  <path d="M60.7199 58.9072V68.8972C60.7199 69.3433 60.3596 69.7037 59.9135 69.7037L53.2892 71.1809L46.6634 69.7037C46.2188 69.7037 45.8582 69.3433 45.8582 68.8972V58.9072H60.7199Z" fill="#8DBEFF"/>
                  <path d="M57.5868 46.6528C57.1156 45.2761 56.2323 44.0558 55.0284 43.1739L54.1126 42.5033C53.7979 42.2729 53.6129 41.908 53.6129 41.518V34.7542H56.3581V40.453C56.3581 40.8415 56.5441 41.2078 56.8573 41.4383L57.7746 42.1089C59.2798 43.2123 60.2857 44.8462 60.6078 46.6528H57.5868Z" fill="#4997FF"/>
                  <path d="M60.7196 58.9072V68.8972C60.7196 69.3433 60.3594 69.7037 59.9133 69.7037H57.1687C57.6133 69.7037 57.9737 69.3433 57.9737 68.8972V58.9072H60.7196Z" fill="#4997FF"/>
                  <path d="M45.8582 47.9153V58.9074L52.8135 61.3629C53.11 61.4676 53.4334 61.4678 53.7301 61.3635L60.72 58.9074V47.9153C60.72 47.4878 60.6816 47.0652 60.6079 46.6516H45.9703C45.8965 47.0652 45.8582 47.4878 45.8582 47.9153Z" fill="#F4DAA7"/>
                  <path d="M60.6623 47.0178C60.6469 46.8956 60.6292 46.7723 60.6077 46.6516H57.5839C57.8374 47.3924 57.9742 48.1775 57.9742 48.9805V59.872L60.7199 58.9073V47.9152C60.7198 47.6305 60.6964 47.2894 60.6623 47.0178Z" fill="#EEC06B"/>
                  <path d="M18.2852 64.6401H49.3863C49.9889 64.6401 50.2455 65.4063 49.7645 65.7693L45.0533 69.3234C44.7258 69.5706 44.3266 69.7043 43.9163 69.7043L33.8358 71.1814L23.7552 69.7043C23.3449 69.7043 22.9457 69.5706 22.6183 69.3234L17.907 65.7693C17.4261 65.4063 17.6826 64.6401 18.2852 64.6401Z" fill="#4980AC"/>
                  <path d="M70.0488 68.8556C69.4185 68.8556 68.9076 68.3447 68.9076 67.7144V57.4437C68.9076 56.8134 69.4185 56.3025 70.0488 56.3025C70.6791 56.3025 71.1901 56.8134 71.1901 57.4437V67.7144C71.1901 68.3447 70.6791 68.8556 70.0488 68.8556Z" fill="#D9D9D9"/>
                  <path d="M66.8271 48.5874L65.5919 56.6591C65.2307 59.0198 67.0575 61.1473 69.4455 61.1473H70.9392C73.3273 61.1473 75.1541 59.0198 74.7928 56.6591L73.5576 48.5874C73.497 48.1915 73.1565 47.8992 72.7559 47.8992H67.6286C67.2281 47.8990 66.8876 48.1914 66.8271 48.5874Z" fill="url(#paint1_linear_empty_order)"/>
                  <path d="M69.9294 66.3865C67.6472 66.3865 65.7704 68.1227 65.5483 70.3464C65.5246 70.5829 65.7071 70.7896 65.9447 70.7896L70.0514 72.2667L73.914 70.7896C74.1516 70.7896 74.3341 70.5829 74.3104 70.3464C74.0881 68.1227 72.2116 66.3865 69.9294 66.3865Z" fill="#DADADA"/>
                  <path d="M83.3383 90.1446C79.3904 92.6759 74.0879 93.5444 69.4075 92.2952C63.1528 96.7609 53.3398 97.9935 46.2186 94.6982C39.0974 97.9935 29.2844 96.7609 23.0295 92.2952C18.3491 93.5443 13.0467 92.6759 9.09876 90.1446C8.62356 89.8399 8.35826 89.2949 8.40967 88.7327L9.77352 73.8293C9.98741 71.4923 11.9473 69.7036 14.2941 69.7036H78.143C80.4897 69.7036 82.4496 71.4923 82.6635 73.8293L84.0274 88.7327C84.0788 89.2949 83.8136 89.8399 83.3383 90.1446Z" fill="#DDEBFD"/>
                  <path d="M84.0272 88.7329L82.7263 74.5174C82.6566 74.2837 82.8566 71.8371 80.5481 70.3929C79.8504 69.9564 79.0252 69.7036 78.1429 69.7036H14.2941C11.9473 69.7036 9.98745 71.4923 9.77356 73.8293L9.71063 74.5174C10.5718 73.4653 11.8791 72.8006 13.3307 72.8006H78.0873C78.5185 72.8006 78.8856 73.1056 78.9748 73.5275C79.0198 73.7405 79.0522 73.959 79.0711 74.1822L80.435 90.3597C80.4846 90.9477 80.2379 91.5159 79.7949 91.8526C81.0496 91.4173 82.243 90.8465 83.3328 90.1483C83.8101 89.8425 84.0789 89.2975 84.0272 88.7329Z" fill="#BED9FD"/>
                  <path d="M46.2183 81.9937C45.588 81.9937 45.0771 82.5046 45.0771 83.1349V95.1767C45.4638 95.0288 45.8455 94.8715 46.2183 94.6991C46.5911 94.8716 46.973 95.0289 47.3597 95.1768V83.135C47.3597 82.5046 46.8488 81.9937 46.2183 81.9937Z" fill="#BED9FD"/>
                  <path d="M69.4075 83.1968C68.7772 83.1968 68.2662 83.7077 68.2662 84.338V93.0501C68.6578 92.8099 69.0392 92.5593 69.4075 92.2963C69.7842 92.3969 70.1651 92.4822 70.5489 92.5556V84.338C70.5487 83.7079 70.0378 83.1968 69.4075 83.1968Z" fill="#BED9FD"/>
                  <path d="M23.0294 83.1968C22.3991 83.1968 21.8881 83.7077 21.8881 84.338V92.5556C22.2717 92.4823 22.6527 92.3969 23.0294 92.2963C23.3976 92.5593 23.779 92.8099 24.1706 93.0501V84.338C24.1706 83.7079 23.6597 83.1968 23.0294 83.1968Z" fill="#BED9FD"/>
                </g>
                <defs>
                  <linearGradient id="paint0_linear_empty_order" x1="50" y1="0" x2="49.5798" y2="94.958" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#CBEFFF"/>
                    <stop offset="0.521031" stopColor="#EDF8FF"/>
                    <stop offset="1" stopColor="white"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_empty_order" x1="73.234" y1="54.7548" x2="74.0743" y2="59.7968" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#E0E0E0"/>
                  </linearGradient>
                  <clipPath id="clip0_empty_order">
                    <rect width="75.6302" height="75.6302" fill="white" transform="translate(11.7647 24.3696)"/>
                  </clipPath>
                </defs>
              </svg>
              <p className="text-sm font-bold text-slate-500">Chưa có món nào</p>
            </div>
          )}
        </div>

        {/* Secondary Actions */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-3 shrink-0">
          <button 
            onClick={() => setShowPrinterDialog(true)}
            className="h-[78px] flex items-center justify-center gap-2 px-2 bg-white border border-slate-300 rounded-xl text-slate-700 active:bg-slate-50 active:text-blue-600 active:border-blue-300 transition-colors"
          >
            <Printer className="w-6 h-6" />
            <span className="font-bold text-base">In tạm tính</span>
          </button>
          <button 
            onClick={() => showToast('Tính năng đang phát triển', 'error')}
            className="h-[78px] flex items-center justify-center gap-2 px-2 bg-white border border-slate-300 rounded-xl text-slate-700 active:bg-slate-50 active:text-blue-600 active:border-blue-300 transition-colors"
          >
            <SplitSquareHorizontal className="w-6 h-6" />
            <span className="font-bold text-base">Tách HĐ</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Payment & Summary (~70%) */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        
        {/* Billing Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Receipt className="w-5 h-5 mr-2 text-brand" />
              Chi tiết thanh toán
            </h3>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex-1 grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 font-bold tracking-wider mb-1">Tiền hàng ({orderItems.length} món)</span>
                <span className="text-xl font-bold text-slate-700">{formatCurrency(totalGrossAmount)}</span>
              </div>
              
              <button 
                onClick={() => setShowAppliedPromosDialog(true)}
                className="flex flex-col text-left group transition-all"
              >
                <span className="text-sm text-red-400 font-bold tracking-wider mb-1 flex items-center gap-1">
                  Khuyến mại <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-xl font-bold text-red-500 group-hover:underline">
                  -{formatCurrency(totalDiscountAll)}
                </span>
              </button>

              <button 
                onClick={() => setShowFeeDetailDialog(true)}
                className="flex flex-col text-left group transition-all"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm text-slate-400 font-bold tracking-wider">Phí & Thuế</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between items-baseline min-w-[150px]">
                    <span className="text-xl font-bold text-slate-700 group-hover:underline">
                      {formatCurrency(totalFeesAndTaxesActual)}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div className="h-16 w-px bg-slate-100"></div>

            <div className="text-right min-w-[240px]">
              <span className="text-sm text-slate-400 font-bold tracking-wider mb-1 block">Tổng thanh toán</span>
              <span className="text-5xl font-black text-brand tracking-tighter leading-none">
                {formatCurrency(finalTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Processing Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          
          {/* Payment Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5 shrink-0">
            <button 
              onClick={() => setPaymentTab('cash')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-semibold text-sm transition-all ${
                paymentTab === 'cash' 
                  ? 'bg-white text-brand shadow-sm border border-slate-200' 
                  : 'text-slate-500 active:bg-slate-100 active:text-slate-700'
              }`}
            >
              <Banknote className="w-4 h-4" /> Tiền mặt
            </button>
            <button 
              onClick={() => setPaymentTab('transfer')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-semibold text-sm transition-all ${
                paymentTab === 'transfer' 
                  ? 'bg-white text-brand shadow-sm border border-slate-200' 
                  : 'text-slate-500 active:bg-slate-100 active:text-slate-700'
              }`}
            >
              <QrCode className="w-4 h-4" /> Chuyển khoản
            </button>
            <button 
              onClick={() => setPaymentTab('wallet')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-semibold text-sm transition-all ${
                paymentTab === 'wallet' 
                  ? 'bg-white text-brand shadow-sm border border-slate-200' 
                  : 'text-slate-500 active:bg-slate-100 active:text-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4" /> Ví điện tử
            </button>
            <button 
              onClick={() => setPaymentTab('split')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-semibold text-sm transition-all ${
                paymentTab === 'split' 
                  ? 'bg-white text-brand shadow-sm border border-slate-200' 
                  : 'text-slate-500 active:bg-slate-100 active:text-slate-700'
              }`}
            >
              <SplitSquareHorizontal className="w-4 h-4" /> Đa phương thức
            </button>
          </div>

          {/* Dynamic Payment Content - Scrollable if needed */}
          <div className="flex-1 p-4 flex flex-col justify-center overflow-y-auto">
            
            {/* CASH TAB */}
            {paymentTab === 'cash' && (
              <div className="max-w-md mx-auto w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Khách đưa (VNĐ)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formatCurrency(cashReceived)}
                      onChange={(e) => setCashReceived(Number(e.target.value.replace(/\D/g, '')))}
                      className="w-full text-3xl font-bold text-slate-800 border-2 border-blue-200 rounded-2xl py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-right"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-base">VND</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {quickAmounts.map((amt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCashReceived(amt)}
                      className="py-3 bg-slate-50 active:bg-blue-50 active:text-blue-700 active:border-blue-200 border border-slate-200 rounded-xl font-bold text-slate-700 text-sm transition-colors"
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-lg font-medium text-slate-600">
                      {isUnderpaid ? 'Công nợ:' : 'Tiền thừa trả khách:'}
                    </span>
                    <span className={`text-2xl font-bold ${isUnderpaid ? 'text-red-500' : 'text-green-600'}`}>
                      {formatCurrency(isUnderpaid ? debtAmount : changeAmount)}
                    </span>
                  </div>

                  {isOverpaid && selectedCustomerObj && selectedCustomerObj.debt > 0 && (
                    <label className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-slate-100 cursor-pointer hover:border-brand/30 hover:bg-blue-50/30 transition-all group h-[64px]">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="peer sr-only"
                          checked={isRepayingDebt}
                          onChange={(e) => setIsRepayingDebt(e.target.checked)}
                        />
                        <div className="w-7 h-7 border-2 border-slate-200 rounded-lg bg-white peer-checked:bg-brand peer-checked:border-brand transition-all flex items-center justify-center">
                          <Check className={`w-5 h-5 text-white transition-transform duration-300 ${isRepayingDebt ? 'scale-100' : 'scale-0'}`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold text-slate-700 group-hover:text-brand transition-colors">Trả nợ</span>
                      </div>
                      {isRepayingDebt && (
                        <div className="text-xl font-black text-brand animate-in fade-in slide-in-from-right-2 duration-300">
                          - {formatCurrency(Math.min(remainingAfterPayment, selectedCustomerObj.debt))}
                        </div>
                      )}
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* TRANSFER TAB */}
            {paymentTab === 'transfer' && (() => {
              const activeAccount = billingAccounts.find(acc => acc.active) || billingAccounts[0] || {
                bank: 'vietcombank',
                account: '190399887766',
                holder: 'CONG TY TNHH PHONG CACH AM THUC'
              };
              
              const activeBankInfo = BILLING_BANKS.find(b => b.id === activeAccount.bank) || {
                name: 'Vietcombank',
                code: 'VCB',
                logo: 'https://api.vietqr.io/img/VCB.png'
              };

              const handleCompletePayment = () => {
                // Find order to move to invoices
                const orderToComplete = orders.find(o => o.id === currentOrderId);
                const now = new Date();
                const newInvoiceId = (2404000187 + mockInvoices.length).toString();
                
                // Determine Invoice Status
                let invoiceStatus: 'paid' | 'debt' | 'cancelled' = 'paid';
                if (isUnderpaid) {
                  invoiceStatus = 'debt';
                }

                const newInvoice = {
                  id: newInvoiceId,
                  orderNo: orderToComplete 
                    ? `Order ${orderToComplete.orderNo} (${orderToComplete.tables ? orderToComplete.tables.map(t => t).join(', ') : 'Giao hàng'})`
                    : 'Đơn mới',
                  customer: selectedCustomerObj?.name || 'Khách lẻ không lấy hóa đơn',
                  phone: selectedCustomerObj?.phone || '',
                  amount: finalTotal,
                  status: invoiceStatus,
                  time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  date: now.toLocaleDateString('vi-VN'),
                  eInvoiceIssued: false,
                  invoiceRequested: true
                };

                // 1. Update Customer Debt Profile
                if (selectedCustomerObj) {
                  setCustomers(prev => prev.map(c => 
                    c.id === selectedCustomerObj.id 
                      ? { ...c, debt: c.debt + debtAmount } 
                      : c
                  ));
                }

                // 2. Hide order card if exists
                if (orderToComplete) {
                  setOrders(prev => prev.filter(o => o.id !== currentOrderId));
                }
                
                // 3. Add to invoices
                setMockInvoices(prev => [newInvoice, ...prev]);

                showToast('Thanh toán thành công!');
                setCurrentScreen('orderList');
                setCurrentOrderCustomer(null);
                setCashReceived(0);
                setIsRepayingDebt(false);
              };

              return (
                <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 h-full p-2 max-w-5xl mx-auto w-full">
                  
                  {/* Left Side: QR Code Panel */}
                  <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col items-center justify-center relative min-h-[340px]">
                    <div className="bg-white p-3.5 rounded-3xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center w-60 h-60 relative overflow-hidden shadow-sm">
                      <img 
                        src={`https://img.vietqr.io/image/${activeAccount.bank}-${activeAccount.account}-compact2.png?amount=${finalTotal}&addInfo=HD${orders.length + 1}%20THANH%20TOAN%20CUKCUK&accountName=${encodeURIComponent(activeAccount.holder)}`}
                        className="w-full h-full object-contain"
                        alt="VietQR Dynamic Code"
                        referrerPolicy="no-referrer"
                      />
                      {/* Scanning line animation */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#076EFF] opacity-40 animate-[bounce_2s_infinite]"></div>
                    </div>
                    
                    {/* Active account details under QR */}
                    <div className="mt-4 text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5">
                        <img src={activeBankInfo.logo} className="h-4 object-contain" alt={activeBankInfo.name} referrerPolicy="no-referrer" />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">{activeAccount.holder}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-500 font-mono">{activeAccount.account} ({activeBankInfo.code})</div>
                      <div className="text-[10px] text-slate-400">Quét mã bằng ứng dụng Ngân hàng hoặc Ví điện tử bất kỳ</div>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="hidden lg:block w-px bg-slate-200"></div>

                  {/* Right Side: Accounts List & Management / Adding form */}
                  <div className="w-[380px] shrink-0 flex flex-col justify-between">
                    
                    {!isAddingBillingAccount ? (
                      /* Display connected accounts */
                      <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tài khoản đối soát ({billingAccounts.length})</h4>
                              <p className="text-[10px] text-slate-400">Chọn tài khoản nhận tiền cho đơn hàng này</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBillingBank('');
                                setNewBillingAccountNo('');
                                setNewBillingAccountHolder('');
                                setIsAddingBillingAccount(true);
                              }}
                              className="h-7 px-2.5 bg-[#076EFF] hover:bg-[#0057D6] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors uppercase tracking-wider shrink-0"
                            >
                              <Plus className="w-3 h-3" />
                              Thêm mới
                            </button>
                          </div>

                          {/* Account Cards list */}
                          <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                            {billingAccounts.map(b => {
                              const bInfo = BILLING_BANKS.find(x => x.id === b.bank) || { name: b.bank, logo: 'https://api.vietqr.io/img/VCB.png', code: b.bank.toUpperCase() };
                              const isSelected = b.active;
                              return (
                                <div
                                  key={b.id}
                                  onClick={() => {
                                    setBillingAccounts(billingAccounts.map(x => ({ ...x, active: x.id === b.id })));
                                  }}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer shadow-sm relative ${
                                    isSelected 
                                      ? 'border-[#076EFF] bg-blue-50/20 ring-1 ring-[#076EFF]/10' 
                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1 shrink-0">
                                      <img src={bInfo.logo} className="max-h-full max-w-full object-contain" alt={bInfo.name} referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-slate-800 font-mono tracking-wide truncate">{b.account}</div>
                                      <div className="text-[9px] font-medium text-slate-500 uppercase truncate">{b.holder}</div>
                                      <div className="text-[8px] font-semibold text-slate-400 uppercase mt-0.5">{bInfo.code}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isSelected && (
                                      <span className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (billingAccounts.length <= 1) {
                                          showToast('Không thể xóa tài khoản đối soát cuối cùng', 'error');
                                          return;
                                        }
                                        const nextAccounts = billingAccounts.filter(x => x.id !== b.id);
                                        if (b.active) {
                                          nextAccounts[0].active = true;
                                        }
                                        setBillingAccounts(nextAccounts);
                                        showToast('Đã xóa liên kết tài khoản ngân hàng', 'success');
                                      }}
                                      className="w-7 h-7 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors border border-transparent"
                                      title="Xóa"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Amount display & Confirm Button */}
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                          <div>
                            <div className="text-[11px] text-slate-400 font-bold tracking-wider">Số tiền cần chuyển</div>
                            <div className="text-2xl font-black text-[#076EFF] tracking-tight">{formatCurrency(finalTotal)}</div>
                          </div>
                          
                          <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 flex gap-2">
                            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                              Quét mã VietQR này sẽ tự động chuyển đúng số tiền cùng nội dung giao dịch của hóa đơn.
                            </p>
                          </div>

                          <button 
                            onClick={handleCompletePayment}
                            className="w-full py-2.5 bg-[#076EFF] hover:bg-[#0057D6] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/15 uppercase tracking-wider h-10"
                          >
                            Xác nhận đã nhận tiền (Thủ công)
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Add new account form */
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1 flex flex-col justify-between">
                        {!selectedBillingBank ? (
                          /* Step 1: Select bank */
                          <div className="space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Chọn ngân hàng liên kết</h4>
                              <p className="text-[10px] text-slate-400">Chọn ngân hàng của thẻ nhận tiền</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[180px] custom-scrollbar pr-1 py-1">
                              {BILLING_BANKS.map(bank => (
                                <button
                                  type="button"
                                  key={bank.id}
                                  onClick={() => setSelectedBillingBank(bank.id)}
                                  className="p-2 border border-slate-200 hover:border-[#076EFF] hover:bg-white rounded-xl flex items-center gap-2 transition-all bg-white shadow-sm"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center p-1 border border-slate-50 rounded-lg bg-white shrink-0">
                                    <img src={bank.logo} className="max-h-full max-w-full object-contain" alt={bank.name} referrerPolicy="no-referrer" />
                                  </div>
                                  <span className="text-[10px] font-extrabold text-slate-700">{bank.code}</span>
                                </button>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => setIsAddingBillingAccount(false)}
                              className="w-full h-10 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase transition-all mt-2"
                            >
                              Hủy bỏ
                            </button>
                          </div>
                        ) : (
                          /* Step 2: Fill inputs */
                          (() => {
                            const selectedBankInfo = BILLING_BANKS.find(b => b.id === selectedBillingBank) || BILLING_BANKS[0];
                            return (
                              <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                                    <div className="flex items-center gap-2">
                                      <img src={selectedBankInfo.logo} className="h-4 object-contain" alt={selectedBankInfo.name} referrerPolicy="no-referrer" />
                                      <span className="text-xs font-bold text-slate-800">{selectedBankInfo.name}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedBillingBank('')}
                                      className="text-[9px] font-black text-[#076EFF] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-all animate-pulse"
                                    >
                                      Thay đổi
                                    </button>
                                  </div>

                                  {/* Inputs */}
                                  <div className="space-y-2.5">
                                    <div className="space-y-1">
                                      <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-600 block">Số tài khoản *</label>
                                        <button 
                                          type="button" 
                                          onClick={() => setNewBillingAccountNo('190399887766')}
                                          className="text-[8px] font-black bg-blue-50 text-[#076EFF] hover:bg-blue-100 px-1.5 py-0.5 rounded transition-all"
                                        >
                                          Điền mẫu
                                        </button>
                                      </div>
                                      <input 
                                        type="text" 
                                        placeholder="Nhập số tài khoản ngân hàng..."
                                        className="w-full h-10 px-2.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#076EFF] bg-white"
                                        value={newBillingAccountNo}
                                        onChange={(e) => setNewBillingAccountNo(e.target.value.replace(/\D/g, ''))}
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-600 block">Chủ tài khoản *</label>
                                        <button 
                                          type="button" 
                                          onClick={() => setNewBillingAccountHolder('CONG TY TNHH PHONG CACH AM THUC')}
                                          className="text-[8px] font-black bg-blue-50 text-[#076EFF] hover:bg-blue-100 px-1.5 py-0.5 rounded transition-all"
                                        >
                                          Điền mẫu
                                        </button>
                                      </div>
                                      <input 
                                        type="text" 
                                        placeholder="VIET HOA KHONG DAU..."
                                        className="w-full h-10 px-2.5 rounded-lg border border-slate-200 text-xs font-bold uppercase focus:outline-none focus:border-[#076EFF] bg-white"
                                        value={newBillingAccountHolder}
                                        onChange={(e) => setNewBillingAccountHolder(e.target.value.toUpperCase())}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedBillingBank('')}
                                    className="flex-1 h-10 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase transition-all"
                                  >
                                    Quay lại
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!newBillingAccountNo.trim() || !newBillingAccountHolder.trim()) {
                                        showToast('Vui lòng nhập đầy đủ thông tin số tài khoản và tên chủ thẻ', 'error');
                                        return;
                                      }
                                      const newAcc = {
                                        id: Date.now().toString(),
                                        bank: selectedBillingBank,
                                        account: newBillingAccountNo.trim(),
                                        holder: newBillingAccountHolder.trim().toUpperCase(),
                                        active: true
                                      };
                                      setBillingAccounts(billingAccounts.map(x => ({ ...x, active: false })).concat(newAcc));
                                      setIsAddingBillingAccount(false);
                                      showToast('Đã thêm tài khoản ngân hàng đối soát mới!', 'success');
                                    }}
                                    disabled={!newBillingAccountNo || !newBillingAccountHolder}
                                    className={`flex-1 h-10 text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${
                                      newBillingAccountNo && newBillingAccountHolder
                                        ? 'bg-[#076EFF] hover:bg-[#0057D6]'
                                        : 'bg-slate-300 cursor-not-allowed'
                                    }`}
                                  >
                                    Lưu thẻ
                                  </button>
                                </div>
                              </div>
                            );
                          })()
                        )}
                      </div>
                    )}

                  </div>

                </div>
              );
            })()}

            {/* WALLET TAB */}
            {paymentTab === 'wallet' && (
              <div className="max-w-md mx-auto w-full space-y-6">
                <div className="relative">
                  <label className="block text-sm font-bold text-slate-500 mb-2 tracking-tight">Chọn ví điện tử</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <select 
                        value={walletType}
                        onChange={(e) => setWalletType(e.target.value)}
                        className="w-full h-14 pl-12 pr-10 bg-white border-2 border-slate-200 rounded-2xl text-lg font-bold text-slate-800 focus:outline-none focus:border-brand appearance-none shadow-sm cursor-pointer"
                      >
                        <option value="Momo">Ví MoMo</option>
                        <option value="VNpay">VNPay-QR</option>
                        <option value="ShopeePay">Ví ShopeePay</option>
                        <option value="ZaloPay">Ví ZaloPay</option>
                        <option value="ViettelMoney">Viettel Money</option>
                      </select>
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center pointer-events-none">
                        <img 
                          src={
                            walletType === 'Momo' ? 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png' :
                            walletType === 'VNpay' ? 'https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAYQR-1.png' :
                            walletType === 'ShopeePay' ? 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ShopeePay-V.png' :
                            walletType === 'ZaloPay' ? 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png' :
                            'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-Viettel-Money.png'
                          } 
                          alt={walletType} 
                          className="w-full h-full object-contain rounded-md"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center shadow-inner">
                  <span className="text-base text-slate-400 font-bold tracking-widest block mb-1">Số tiền thanh toán qua {walletType}</span>
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            )}

            {/* SPLIT PAYMENT TAB */}
            {paymentTab === 'split' && (
              <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
                <div className="flex justify-between items-end mb-3 pb-3 border-b border-slate-200 shrink-0">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Thanh toán nhiều phương thức</h4>
                    <p className="text-sm text-slate-500">Khách hàng thanh toán bằng nhiều nguồn</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Còn thiếu</div>
                    <div className={`text-2xl font-bold ${splitRemaining > 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {formatCurrency(splitRemaining)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                  {splitPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                        {getPaymentIcon(payment.type)}
                      </div>
                      <div className="flex-1">
                        <select 
                          value={payment.type}
                          onChange={(e) => handleUpdateSplitPayment(payment.id, 'type', e.target.value as PaymentMethodType)}
                          className="font-bold text-base text-slate-800 bg-transparent border-none focus:ring-0 p-0 cursor-pointer w-full outline-none"
                        >
                          <option value="cash">Tiền mặt</option>
                          <option value="transfer">Chuyển khoản</option>
                          <option value="card">Quẹt thẻ</option>
                          <option value="voucher">Voucher</option>
                        </select>
                        {payment.type === 'transfer' && (
                          <div className="text-xs text-brand font-medium cursor-pointer mt-0.5">Hiển thị mã QR</div>
                        )}
                      </div>
                      <div className="w-48 relative shrink-0">
                        <input 
                          type="text" 
                          value={formatCurrency(payment.amount)}
                          onChange={(e) => handleUpdateSplitPayment(payment.id, 'amount', Number(e.target.value.replace(/\D/g, '')))}
                          className="w-full text-xl font-bold text-slate-800 border-2 border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 text-right"
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveSplitPayment(payment.id)}
                        className="p-2.5 text-slate-400 active:text-red-500 active:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <button 
                    onClick={handleAddSplitPayment}
                    className="w-full py-3.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-base active:bg-slate-50 active:border-slate-400 active:text-slate-700 transition-all flex items-center justify-center gap-2 mt-1"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Thêm phương thức
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* E-Invoice Checkbox Bar */}
          <div className="px-5 py-3 bg-blue-50/50 border-t border-slate-200 flex justify-between items-center shrink-0">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={requireEInvoice}
                  onChange={(e) => setRequireEInvoice(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-brand checked:border-brand transition-all cursor-pointer" 
                />
                <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span className="font-medium text-slate-700 text-base flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                Khách lấy hóa đơn điện tử
              </span>
            </label>
            {requireEInvoice && (
              <button 
                onClick={() => setShowBuyerInfoDialog(true)}
                className="text-sm text-brand font-bold active:text-blue-800"
              >
                Cập nhật thông tin xuất HĐ
              </button>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setCurrentScreen(previousScreen)}
              className="h-[70px] w-32 rounded-xl font-bold text-slate-600 bg-slate-100 active:bg-slate-200 transition-colors flex items-center justify-center gap-2 text-base"
            >
              <XCircle className="w-6 h-6" />
              Hủy
            </button>
            <button className="h-[70px] w-32 rounded-xl font-bold text-blue-700 bg-blue-50 border border-blue-200 active:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-base">
              <Save className="w-6 h-6" />
              Lưu tạm
            </button>
            <button 
              onClick={() => {
                if (paymentTab === 'wallet') {
                  setShowWalletQRDialog(true);
                  return;
                }
                
                // Intercept and request meInvoice quick setup if customer requested e-invoice but meInvoice is not connected
                if (requireEInvoice && !invoiceSettings.isConnected) {
                  setPendingActionPayment(true);
                  setShowMisaAlert(true);
                  return;
                }

                // Find order to move to invoices
                const orderToComplete = orders.find(o => o.id === currentOrderId);
                const now = new Date();
                const newInvoiceId = (2404000187 + mockInvoices.length).toString();
                
                // Determine Invoice Status
                let invoiceStatus: 'paid' | 'debt' | 'cancelled' = 'paid';
                if (isUnderpaid) {
                  invoiceStatus = 'debt';
                }

                const newInvoice = {
                  id: newInvoiceId,
                  orderNo: orderToComplete 
                    ? `Order ${orderToComplete.orderNo} (${orderToComplete.tables ? orderToComplete.tables.map(t => t).join(', ') : 'Giao hàng'})`
                    : 'Đơn mới',
                  customer: selectedCustomerObj?.name || 'Khách lẻ không lấy hóa đơn',
                  phone: selectedCustomerObj?.phone || '',
                  amount: finalTotal,
                  status: invoiceStatus,
                  time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  date: now.toLocaleDateString('vi-VN'),
                  eInvoiceIssued: false,
                  invoiceRequested: true
                };

                // 1. Update Customer Debt Profile
                if (selectedCustomerObj) {
                  setCustomers(prev => prev.map(c => 
                    c.id === selectedCustomerObj.id 
                      ? { ...c, debt: c.debt + debtAmount } 
                      : c
                  ));
                }

                // 2. Hide order card if exists
                if (orderToComplete) {
                  setOrders(prev => prev.filter(o => o.id !== currentOrderId));
                }
                
                // 3. Add to invoices
                setMockInvoices(prev => [newInvoice, ...prev]);

                showToast('Thanh toán thành công!');
                setCurrentScreen('orderList');
                setCurrentOrderCustomer(null);
                setCashReceived(0);
                setIsRepayingDebt(false);
              }}
              className="h-[70px] flex-1 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 active:scale-[0.98] shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-3 text-2xl"
            >
              <CheckCircle2 className="w-7 h-7" />
              <span>Thanh toán</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderReservationsModals = () => (
    <>
      <style>{`
        .reservation-badge {
          border-radius: 20px;
          padding: 4px 12px;
          font-weight: 600;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .badge-pending { background-color: #FFF3E0; color: #E65100; }
        .badge-confirmed { background-color: #E3F2FD; color: #1565C0; }
        .badge-rejected { background-color: #FFEBEE; color: #C62828; }
        .badge-seated { background-color: #E8F5E9; color: #2E7D32; }

        .res-table { width: 100%; border-collapse: collapse; }
        .res-table th { 
          text-align: left; 
          padding: 12px 16px; 
          font-size: 12px; 
          font-weight: bold; 
          color: #555; 
          text-transform: uppercase; 
          border-bottom: 1px solid #E0E0E0;
          background-color: white;
        }
        .res-table td { 
          padding: 12px 16px; 
          border-bottom: 1px solid #E0E0E0;
          vertical-align: middle;
        }
        .res-row:hover { background-color: #F5F5F5; }
        .res-id { color: #076EFF; cursor: pointer; font-weight: 600; }
        .res-id:hover { text-decoration: underline; }

        .action-btn {
          background: white;
          border: 1px solid #E0E0E0;
          border-radius: 6px;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover { background-color: #F5F5F5; }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100;
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .res-modal {
          background: white; border-radius: 12px; width: 100%; max-width: 600px;
          overflow: hidden; display: flex; flex-direction: column;
        }
        .reject-modal { max-width: 450px; }
        .table-modal { max-width: 800px; }

        .modal-header {
          padding: 16px 20px; border-bottom: 1px solid #E0E0E0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .modal-footer {
          padding: 16px 20px; border-top: 1px solid #E0E0E0;
          display: flex; gap: 12px; justify-content: flex-end;
        }

        .btn-confirm { background-color: #076EFF; color: white; min-width: 120px; height: 40px; padding: 0 32px; border-radius: 8px; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; }
        .btn-reject { background-color: #D32F2F; color: white; min-width: 120px; height: 40px; padding: 0 32px; border-radius: 8px; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; }
        .btn-cancel { background-color: white; color: #555; min-width: 120px; height: 40px; padding: 0 32px; border-radius: 8px; font-weight: bold; border: 1px solid #E0E0E0; font-size: 14px; display: flex; align-items: center; justify-content: center; }

        .tab-btn {
          padding: 12px 20px; font-weight: bold; border-bottom: 2px solid transparent; color: #555;
        }
        .tab-active { border-bottom-color: #076EFF; color: #076EFF; }

        .table-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; padding: 20px;
        }
        .table-card {
          border: 1px solid #E0E0E0; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; cursor: pointer; position: relative; transition: all 0.2s;
        }
        .table-card:hover { border-color: #076EFF; background-color: #F0F7FF; }
        .table-card.busy { opacity: 0.4; background-color: #F8FAFC; cursor: pointer; }
        .table-card.suggested { border-color: #F97316; background-color: #FFF7ED; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15); border-width: 2px; }
        .table-card.not-suggested { opacity: 0.4; }
        .table-card.not-suggested:hover { opacity: 0.8; }
      `}</style>

      {/* Detail Modal */}
      {showReservationDetail && selectedReservation && (
        <div className="modal-overlay" style={{zIndex: 110}}>
          <div className="res-modal !max-w-[900px]">
            <div className="modal-header">
              <h3 className="text-lg font-bold">Chi tiết đặt chỗ — {selectedReservation.id}</h3>
              <button onClick={() => setShowReservationDetail(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-[1fr_350px] gap-8">
                {/* Left Column: Information */}
                <div className="space-y-4">
                  {/* Status Summary */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-normal text-slate-400 uppercase">Mã: {selectedReservation.id}</span>
                    <StatusBadge status={selectedReservation.status} />
                  </div>

                  <div className="space-y-4">
                    {/* 1. Thông tin đặt chỗ */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-normal text-slate-600 text-left">Ngày giờ đến</label>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-normal text-brand">{selectedReservation.arrivalDateTime?.split(' ')[0] || '_'}</div>
                          <div className="text-sm font-normal text-brand">{selectedReservation.arrivalDateTime?.split(' ')[1] || '_'}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-normal text-slate-600 text-left">Bàn đặt</label>
                        <div className="text-sm font-normal text-slate-800">{selectedReservation.table || 'Chưa chọn bàn'}</div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-normal text-slate-600 text-left">Số lượng khách</label>
                        <div className="text-sm font-normal text-slate-800">{selectedReservation.guests} người</div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* 2. Thông tin khách hàng */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-normal text-slate-600 text-left">Số điện thoại</label>
                        <div className="text-sm font-normal text-slate-800">{selectedReservation.phone}</div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-normal text-slate-600 text-left">Họ tên</label>
                        <div className="text-sm font-normal text-slate-800">{selectedReservation.customer}</div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* 3. Tiền đặt cọc */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-normal text-slate-600 text-left">Tiền đặt cọc</label>
                        <div className="flex items-center gap-10">
                          <div className="text-sm font-normal text-brand">{formatCurrency(selectedReservation.depositAmount || 0)}</div>
                          <div className="text-sm font-normal text-slate-700">
                             Hình thức: {selectedReservation.depositMethod === 'cash' ? 'Tiền mặt' : selectedReservation.depositMethod === 'transfer' ? 'Chuyển khoản' : 'Quẹt thẻ'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* 4. Thông tin bổ sung */}
                    {(selectedReservation.customerNote || selectedReservation.note || selectedReservation.kitchenNote || selectedReservation.salesPerson) && (
                      <div className="space-y-4">
                        {(selectedReservation.customerNote || selectedReservation.note) && (
                          <div className="grid grid-cols-[120px_1fr] gap-4">
                            <label className="text-sm font-normal text-slate-600 text-left">Ghi chú khách</label>
                            <div className="text-sm text-slate-700 italic font-normal">{selectedReservation.customerNote || selectedReservation.note}</div>
                          </div>
                        )}
                        {selectedReservation.kitchenNote && (
                          <div className="grid grid-cols-[120px_1fr] gap-4">
                            <label className="text-sm font-normal text-slate-600 text-left">Ghi chú bếp</label>
                            <div className="text-sm text-slate-700 italic font-normal">{selectedReservation.kitchenNote}</div>
                          </div>
                        )}
                        {selectedReservation.salesPerson && (
                          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label className="text-sm font-normal text-slate-600 text-left">NV kinh doanh</label>
                            <div className="text-sm font-normal text-slate-700">
                              {selectedReservation.salesPerson === 'nv01' ? 'Nguyễn Thị Thùy' : 
                               selectedReservation.salesPerson === 'nv02' ? 'Trần Minh Quân' : 
                               selectedReservation.salesPerson === 'nv03' ? 'Lê Hoàng Nam' : selectedReservation.salesPerson}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedReservation?.history?.length > 0 && (
                    <div className="pt-6 border-t border-slate-200 space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> Lịch sử xử lý
                      </h4>
                      <div className="space-y-4 pt-1 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedReservation.history.map((h: any, idx: number) => (
                          <div key={idx} className="flex gap-4 relative">
                            {idx !== selectedReservation.history.length - 1 && (
                              <div className="absolute left-1.5 top-4 bottom-[-20px] w-px bg-slate-200" />
                            )}
                            <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300 shrink-0 mt-1 relative z-1" />
                            <div className="flex-1">
                              <div className="text-[12px] font-normal text-slate-700 leading-tight">{h.action}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-normal">
                                <Clock className="w-2.5 h-2.5" /> {h.time} • <User className="w-2.5 h-2.5" /> {h.user}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Pre-ordered Dishes */}
                <div className="flex flex-col h-full bg-slate-50 p-5 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-normal text-slate-500 flex items-center gap-2">
                      <UtensilsCrossed className="w-3.5 h-3.5" /> Đặt món
                    </h4>
                    {selectedReservation.status !== 'seated' && (
                      <button 
                        onClick={() => {
                          setOrderBackup({ items: orderItems, orderId: currentOrderId });
                          setOrderItems((selectedReservation.preorderedDishes || []).map((d: any) => ({
                            ...d,
                            id: d.id || Math.random().toString(), 
                            addons: d.addons || [],
                            qty: d.qty || 1,
                            price: d.price || 0
                          })));
                          setIsPickingDishes(true);
                          setCurrentScreen('order');
                          setShowReservationDetail(false);
                        }}
                        className="text-brand text-sm font-bold flex items-center gap-1 hover:underline"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Thêm món
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 min-h-[300px]">
                    {selectedReservation?.preorderedDishes?.length > 0 ? (
                      selectedReservation.preorderedDishes.map((dish: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center gap-3 shadow-sm">
                          <div className="flex-1">
                            <div className="text-sm font-normal text-slate-700 leading-tight">{dish.name}</div>
                            <div className="text-sm text-brand font-normal mt-0.5">{formatCurrency(dish.price || 0)}</div>
                            {dish.note && (
                              <div className="text-sm text-slate-400 italic mt-0.5 font-normal">Note: {dish.note}</div>
                            )}
                          </div>
                          {selectedReservation.status !== 'seated' && (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleUpdatePreorderQty(idx, -1)}
                                className="w-6 h-6 flex items-center justify-center border border-slate-200 rounded text-slate-500 hover:border-brand hover:text-brand"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-normal">{dish.qty}</span>
                              <button 
                                onClick={() => handleUpdatePreorderQty(idx, 1)}
                                className="w-6 h-6 flex items-center justify-center border border-slate-200 rounded text-slate-500 hover:border-brand hover:text-brand"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          {selectedReservation.status === 'seated' && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded border border-slate-200">
                              <span className="text-sm font-bold text-slate-500">SL: {dish.qty}</span>
                            </div>
                          )}
                          <div className="w-20 text-right text-sm font-normal text-slate-800">
                            {formatCurrency((dish.price || 0) * (dish.qty || 0))}
                          </div>
                          {selectedReservation.status !== 'seated' && (
                            <button 
                              onClick={() => handleRemovePreorderItem(idx)}
                              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-10">
                        <div className="relative mb-4">
                          <svg width="98" height="113" viewBox="0 0 98 113" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                            <g clipPath="url(#clip0_13184_6666_detail)">
                              <circle cx="49" cy="53" r="49" fill="url(#paint0_linear_13184_6666_detail)"/>
                              <path d="M55.4857 27.8032H52.7402C53.2221 27.8032 53.6128 28.1938 53.6128 28.6756V34.7534H56.3581V28.6756C56.3579 28.1938 55.9674 27.8032 55.4857 27.8032Z" fill="#365F7E"/>
                              <path d="M45.9698 46.6528C46.2918 44.8462 47.2967 43.2123 48.802 42.1089L49.7193 41.4383C50.0339 41.2078 50.2188 40.8415 50.2188 40.453V34.7542H56.3577V40.453C56.3577 40.8415 56.5437 41.2078 56.8569 41.4383L57.7742 42.1089C59.2794 43.2123 60.2854 44.8462 60.6074 46.6528L53.2884 48.1298L45.9698 46.6528Z" fill="#8DBEFF"/>
                              <path d="M60.7199 58.9072V68.8972C60.7199 69.3433 60.3596 69.7037 59.9135 69.7037L53.2892 71.1809L46.6634 69.7037C46.2188 69.7037 45.8582 69.3433 45.8582 68.8972V58.9072H60.7199Z" fill="#8DBEFF"/>
                              <path d="M57.5868 46.6528C57.1156 45.2761 56.2323 44.0558 55.0284 43.1739L54.1126 42.5033C53.7979 42.2729 53.6129 41.908 53.6129 41.518V34.7542H56.3581V40.453C56.3581 40.8415 56.5441 41.2078 56.8573 41.4383L57.7746 42.1089C59.2798 43.2123 60.2857 44.8462 60.6078 46.6528H57.5868Z" fill="#4997FF"/>
                              <path d="M60.7196 58.9072V68.8972C60.7196 69.3433 60.3594 69.7037 59.9133 69.7037H57.1687C57.6133 69.7037 57.9737 69.3433 57.9737 68.8972V58.9072H60.7196Z" fill="#4997FF"/>
                              <path d="M45.8582 47.9153V58.9074L52.8135 61.3629C53.11 61.4676 53.4334 61.4678 53.7301 61.3635L60.72 58.9074V47.9153C60.72 47.4878 60.6816 47.0652 60.6079 46.6516H45.9703C45.8965 47.0652 45.8582 47.4878 45.8582 47.9153Z" fill="#F4DAA7"/>
                              <path d="M60.6623 47.0178C60.6469 46.8956 60.6292 46.7723 60.6077 46.6516H57.5839C57.8374 47.3924 57.9742 48.1775 57.9742 48.9805V59.872L60.7199 58.9073V47.9152C60.7198 47.6305 60.6964 47.2894 60.6623 47.0178Z" fill="#EEC06B"/>
                              <path d="M18.2852 64.6401H49.3863C49.9889 64.6401 50.2455 65.4063 49.7645 65.7693L45.0533 69.3234C44.7258 69.5706 44.3266 69.7043 43.9163 69.7043L33.8358 71.1814L23.7552 69.7043C23.3449 69.7043 22.9457 69.5706 22.6183 69.3234L17.907 65.7693C17.4261 65.4063 17.6826 64.6401 18.2852 64.6401Z" fill="#4980AC"/>
                              <path d="M70.0488 68.8556C69.4185 68.8556 68.9076 68.3447 68.9076 67.7144V57.4437C68.9076 56.8134 69.4185 56.3025 70.0488 56.3025C70.6791 56.3025 71.1901 56.8134 71.1901 57.4437V67.7144C71.1901 68.3447 70.6791 68.8556 70.0488 68.8556Z" fill="#D9D9D9"/>
                              <path d="M66.8271 48.5874L65.5919 56.6591C65.2307 59.0198 67.0575 61.1473 69.4455 61.1473H70.9392C73.3273 61.1473 75.1541 59.0198 74.7928 56.6591L73.5576 48.5874C73.497 48.1915 73.1565 47.8992 72.7559 47.8992H67.6286C67.2281 47.899 66.8876 48.1914 66.8271 48.5874Z" fill="url(#paint1_linear_13184_6666_detail)"/>
                              <path d="M69.9294 66.3865C67.6472 66.3865 65.7704 68.1227 65.5483 70.3464C65.5246 70.5829 65.7071 70.7896 65.9447 70.7896L70.0514 72.2667L73.914 70.7896C74.1516 70.7896 74.3341 70.5829 74.3104 70.3464C74.0881 68.1227 72.2116 66.3865 69.9294 66.3865Z" fill="#DADADA"/>
                              <path d="M83.3383 90.1446C79.3904 92.6759 74.0879 93.5444 69.4075 92.2952C63.1528 96.7609 53.3398 97.9935 46.2186 94.6982C39.0974 97.9935 29.2844 96.7609 23.0295 92.2952C18.3491 93.5443 13.0467 92.6759 9.09876 90.1446C8.62356 89.8399 8.35826 89.2949 8.40967 88.7327L9.77352 73.8293C9.98741 71.4923 11.9473 69.7036 14.2941 69.7036H78.143C80.4897 69.7036 82.4496 71.4923 82.6635 73.8293L84.0274 88.7327C84.0788 89.2949 83.8136 89.8399 83.3383 90.1446Z" fill="#DDEBFD"/>
                              <path d="M84.0272 88.7329L82.7263 74.5174C82.6566 74.2837 82.8566 71.8371 80.5481 70.3929C79.8504 69.9564 79.0252 69.7036 78.1429 69.7036H14.2941C11.9473 69.7036 9.98745 71.4923 9.77356 73.8293L9.71063 74.5174C10.5718 73.4653 11.8791 72.8006 13.3307 72.8006H78.0873C78.5185 72.8006 78.8856 73.1056 78.9748 73.5275C79.0198 73.7405 79.0522 73.959 79.0711 74.1822L80.435 90.3597C80.4846 90.9477 80.2379 91.5159 79.7949 91.8526C81.0496 91.4173 82.243 90.8465 83.3328 90.1443C83.8101 89.8385 84.0789 89.2935 84.0272 88.7329Z" fill="#BED9FD"/>
                              <path d="M46.2183 81.9937C45.588 81.9937 45.0771 82.5046 45.0771 83.1349V95.1767C45.4638 95.0288 45.8455 94.8715 46.2183 94.6991C46.5911 94.8716 46.973 95.0289 47.3597 95.1768V83.135C47.3597 82.5046 46.8488 81.9937 46.2183 81.9937Z" fill="#BED9FD"/>
                              <path d="M69.4075 83.1968C68.7772 83.1968 68.2662 83.7077 68.2662 84.338V93.0501C68.6578 92.8099 69.0392 92.5593 69.4075 92.2963C69.7842 92.3969 70.1651 92.4822 70.5489 92.5556V84.338C70.5487 83.7079 70.0378 83.1968 69.4075 83.1968Z" fill="#BED9FD"/>
                              <path d="M23.0294 83.1968C22.3991 83.1968 21.8881 83.7077 21.8881 84.338V92.5556C22.2717 92.4823 22.6527 92.3969 23.0294 92.2963C23.3976 92.5593 23.779 92.8099 24.1706 93.0501V84.338C24.1706 83.7079 23.6597 83.1968 23.0294 83.1968Z" fill="#BED9FD"/>
                            </g>
                            <defs>
                              <linearGradient id="paint0_linear_13184_6666_detail" x1="50" y1="0" x2="49.5798" y2="94.958" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#CBEFFF"/>
                                <stop offset="0.521031" stopColor="#EDF8FF"/>
                                <stop offset="1" stopColor="white"/>
                              </linearGradient>
                              <linearGradient id="paint1_linear_13184_6666_detail" x1="73.234" y1="54.7548" x2="74.0743" y2="59.7968" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"/>
                                <stop offset="1" stopColor="#E0E0E0"/>
                              </linearGradient>
                              <clipPath id="clip0_13184_6666_detail">
                                <rect width="75.6302" height="75.6302" fill="white" transform="translate(11.7647 24.3696)"/>
                              </clipPath>
                            </defs>
                          </svg>
                          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-50">
                             <PlusCircle className="w-6 h-6 text-brand" />
                          </div>
                        </div>
                        <p className="text-base font-bold text-slate-700">Chưa có món đặt trước</p>
                        <p className="text-sm text-slate-400 mt-2 max-w-[200px] mx-auto">
                          Vui lòng nhấn <span className="text-brand font-bold">"Thêm món"</span> để bắt đầu chọn món ăn cho khách
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedReservation?.preorderedDishes?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex justify-between items-center bg-brand/5 p-3 rounded-lg border border-brand/10">
                        <span className="text-xs font-normal text-slate-500">Tổng tiền dự tính</span>
                        <span className="text-lg font-normal text-brand">
                          {formatCurrency(calculatePreorderTotal(selectedReservation.preorderedDishes))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowReservationDetail(false)} 
                className="px-8 h-10 rounded-lg border border-slate-300 text-[13px] font-bold text-slate-700 hover:bg-white transition-all min-w-[120px]"
              >
                Đóng
              </button>
              
              {selectedReservation.status === 'pending' && (
                <>
                  <button 
                    onClick={() => setShowReservationReject(true)} 
                    className="px-8 h-10 rounded-lg bg-red-600 text-[13px] font-bold text-white hover:bg-red-700 shadow-md transition-all min-w-[120px]"
                  >
                    Từ chối
                  </button>
                  <button 
                    onClick={() => {
                      setReservations(prev => prev.map(r => r.id === selectedReservation.id ? { ...r, status: 'confirmed' } : r));
                      setSelectedReservation(prev => ({ ...prev, status: 'confirmed' }));
                      showToast('Đã xác nhận đặt chỗ thành công');
                    }} 
                    className="px-8 h-10 rounded-lg bg-brand text-[13px] font-bold text-white hover:bg-brand-hover shadow-md transition-all min-w-[120px]"
                  >
                    Xác nhận
                  </button>
                </>
              )}

              {selectedReservation.status === 'confirmed' && (
                <button 
                  onClick={() => handleCheckIn(selectedReservation)}
                  className="px-8 h-10 rounded-lg bg-green-600 text-[13px] font-bold text-white hover:bg-green-700 shadow-md transition-all min-w-[120px]"
                >
                  Nhận bàn
                </button>
              )}

              {(selectedReservation.status !== 'seated' && selectedReservation.status !== 'pending' && selectedReservation.status !== 'confirmed') && (
                <button 
                  onClick={handleSaveReservationEdits}
                  className="px-8 h-10 rounded-lg bg-slate-800 text-[13px] font-bold text-white hover:bg-slate-900 shadow-md transition-all min-w-[120px]"
                >
                  Lưu chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showReservationReject && (
        <div className="modal-overlay" style={{zIndex: 110}}>
          <div className="res-modal reject-modal">
            <div className="modal-header">
              <h3 className="text-lg font-bold">❌ Từ chối đặt chỗ {selectedReservation?.id}</h3>
              <button onClick={() => setShowReservationReject(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Lý do từ chối: *</label>
                <div className="relative group">
                  <select 
                    className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-brand ${rejectError && !rejectReason ? 'border-red-500' : 'border-slate-300'}`}
                    value={rejectReason}
                    onChange={(e) => { setRejectReason(e.target.value); setRejectError(false); }}
                  >
                    <option value="">Chọn lý do...</option>
                    <option value="full">Hết bàn trong khung giờ yêu cầu</option>
                    <option value="closed">Nhà hàng đóng cửa ngày đó</option>
                    <option value="invalid">Yêu cầu không hợp lệ</option>
                    <option value="other">Lý do khác</option>
                  </select>
                  {rejectError && !rejectReason && (
                    <div className="absolute left-0 -top-10 z-[100] bg-slate-800 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-bounce pointer-events-none">
                      Vui lòng chọn lý do từ chối
                      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  )}
                  {rejectError && !rejectReason && (
                    <div className="absolute left-0 -top-10 z-[110] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                      Vui lòng chọn lý do từ chối
                      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {['Hết bàn', 'Nhà hàng sửa chữa', 'Yêu cầu đặc biệt không thể đáp ứng'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg">
                    <input 
                      type="radio" 
                      name="rejectMethod" 
                      className="w-4 h-4 accent-brand"
                      onChange={() => setRejectMethod(opt)}
                    />
                    <span className="text-sm text-slate-600">{opt}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Ghi chú thêm:</label>
                <textarea 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-brand h-24 text-sm"
                  placeholder="Nhập nội dung phản hồi cho khách..."
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer !border-t-0 !pt-2 pb-6 px-6">
              <button onClick={() => setShowReservationReject(false)} className="btn-cancel">Hủy</button>
              <button 
                onClick={() => {
                  if (!rejectReason) { setRejectError(true); return; }
                  setReservations(prev => prev.map(r => r.id === selectedReservation.id ? { ...r, status: 'rejected' } : r));
                  setShowReservationReject(false);
                  setShowReservationDetail(false);
                  showToast('Đã từ chối đặt chỗ thành công');
                }}
                className="btn-reject"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="modal-overlay" style={{zIndex: 120}}>
          <div className="res-modal !max-w-[450px]">
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800 tracking-tight">Thêm bàn mới</h2>
              <button 
                onClick={() => setShowAddTableModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 tracking-wider">Tên bàn / Số bàn</label>
                <input 
                  type="text"
                  placeholder="Nhập số bàn, ví dụ: 101, 102..."
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 tracking-wider">Số chỗ ngồi</label>
                <input 
                  type="number"
                  placeholder="Ví dụ: 4, 6, 8..."
                  value={newTableSeats}
                  onChange={(e) => setNewTableSeats(parseInt(e.target.value) || 4)}
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 tracking-wider">Tầng (Khu vực)</label>
                <select
                  value={newTableFloor}
                  onChange={(e) => setNewTableFloor(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-medium bg-white"
                >
                  {customZones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 tracking-wider">Phòng / Loại phòng</label>
                <select
                  value={newTableRoom}
                  onChange={(e) => setNewTableRoom(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-medium bg-white"
                >
                  <option value="Trong nhà">Trong nhà</option>
                  <option value="Ngoài trời">Ngoài trời</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 rounded-b-3xl border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowAddTableModal(false)}
                className="h-10 px-8 min-w-[120px] bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all active:scale-[0.98]"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  if (!newTableName.trim()) {
                    showToast('Vui lòng nhập tên bàn', 'error');
                    return;
                  }
                  if (tablesList.some(t => t.name.toLowerCase() === newTableName.trim().toLowerCase() && t.floor === newTableFloor)) {
                    showToast('Tên bàn này đã tồn tại ở tầng đã chọn', 'error');
                    return;
                  }
                  
                  const newTable = {
                    id: newTableName.trim(),
                    name: newTableName.trim(),
                    status: 'empty',
                    seats: newTableSeats,
                    type: newTableSeats > 6 ? 'rect' : (newTableSeats > 4 ? 'round' : 'square'),
                    floor: newTableFloor,
                    room: newTableRoom
                  };

                  setTablesList(prev => [...prev, newTable]);
                  setShowAddTableModal(false);
                  showToast(`Đã thêm bàn ${newTableName} thành công`, 'success');
                }}
                className="h-10 px-8 min-w-[120px] bg-brand text-white rounded-xl font-bold text-xs hover:bg-[#005FEA] transition-all active:scale-[0.98]"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reservation Modal */}
      {showAddReservation && (
        <div className="modal-overlay" style={{zIndex: 110}}>
          <div className="res-modal !max-w-[950px]">
            <div className="px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Thêm đặt chỗ mới</h2>
              <button 
                onClick={() => setShowAddReservation(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="px-6 pb-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-[1fr_350px] gap-6 mt-4">
                {/* Left Column: Reservation Details */}
                <div className="space-y-4">
                  {/* 1. Thông tin đặt chỗ */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <label className="text-sm font-normal text-slate-600 text-left">Ngày giờ đến <span className="text-red-500 font-normal">*</span></label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                          <input 
                            type="date" 
                            className={`w-full h-10 px-3 bg-white border ${reservationErrors.date ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm text-slate-800 font-normal focus:border-brand outline-none transition-colors`}
                            value={newReservation.date || ''}
                            onChange={(e) => {
                              setNewReservation({...newReservation, date: e.target.value});
                              if (reservationErrors.date) setReservationErrors(prev => { const n = {...prev}; delete n.date; return n; });
                            }}
                          />
                          {reservationErrors.date && (
                            <div className="absolute left-0 -top-10 z-[100] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                              {reservationErrors.date}
                              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
                            </div>
                          )}
                          {reservationErrors.date && (Object.keys(reservationErrors)[0] === 'date') && (
                            <div className="absolute left-0 -top-10 z-[90] bg-slate-700/90 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap animate-bounce pointer-events-none">
                              {reservationErrors.date}
                              <div className="absolute -bottom-1 left-4 w-1.5 h-1.5 bg-slate-700/90 rotate-45"></div>
                            </div>
                          )}
                        </div>
                        <div className="relative group">
                          <input 
                            type="time" 
                            className={`w-full h-10 px-3 bg-white border ${reservationErrors.time ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm text-slate-800 font-normal focus:border-brand outline-none transition-colors`}
                            value={newReservation.time || ''}
                            onChange={(e) => {
                              setNewReservation({...newReservation, time: e.target.value});
                              if (reservationErrors.time) setReservationErrors(prev => { const n = {...prev}; delete n.time; return n; });
                            }}
                          />
                          {reservationErrors.time && (
                            <div className="absolute left-0 -top-10 z-[100] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                              {reservationErrors.time}
                              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
                            </div>
                          )}
                          {reservationErrors.time && (Object.keys(reservationErrors)[0] === 'time') && (
                            <div className="absolute left-0 -top-10 z-[90] bg-slate-700/90 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap animate-bounce pointer-events-none">
                              {reservationErrors.time}
                              <div className="absolute -bottom-1 left-4 w-1.5 h-1.5 bg-slate-700/90 rotate-45"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <label className="text-sm font-normal text-slate-600 text-left">Bàn đặt</label>
                      <button 
                        onClick={() => {
                          setSelectedReservation(null);
                          startPickingTable(null);
                          setShowAddReservation(false);
                        }}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-left flex items-center justify-between hover:border-brand transition-all focus:border-brand outline-none"
                      >
                        <span className={newReservation.table ? 'text-slate-800 font-normal' : 'text-slate-400 font-normal'}>
                          {newReservation.table || 'Chọn bàn...'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-brand shrink-0" />
                      </button>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <label className="text-sm font-normal text-slate-600 text-left">Số lượng khách</label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setNewReservation({...newReservation, guests: Math.max(1, (newReservation.guests || 1) - 1)})}
                            className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-lg text-slate-600 hover:border-brand hover:text-brand transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input 
                            type="number" 
                            className="w-20 h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-normal text-center focus:border-brand outline-none transition-colors"
                            value={newReservation.guests !== undefined ? newReservation.guests : ''}
                            onChange={(e) => setNewReservation({...newReservation, guests: parseInt(e.target.value) || 0})}
                          />
                          <button 
                            onClick={() => setNewReservation({...newReservation, guests: (newReservation.guests || 0) + 1})}
                            className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-lg text-slate-600 hover:border-brand hover:text-brand transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {newReservation.guests >= 10 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-blue-600 bg-blue-50 py-1 px-2 rounded-md border border-blue-100 animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            <span>Gợi ý: Phòng VIP hoặc ghép bàn liền kề</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* 2. Thông tin khách hàng */}
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-normal text-slate-600 text-left">Số điện thoại <span className="text-red-500 font-normal">*</span></label>
                        <div className="relative group">
                          <input 
                            type="text" 
                            placeholder="Nhập số điện thoại..."
                            className={`w-full h-10 px-3 bg-white border ${reservationErrors.phone ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm text-slate-800 font-normal focus:border-brand outline-none transition-colors`}
                            value={newReservation.phone || ''}
                            onChange={(e) => {
                              setNewReservation({...newReservation, phone: e.target.value});
                              if (reservationErrors.phone) setReservationErrors(prev => { const n = {...prev}; delete n.phone; return n; });
                            }}
                          />
                          {reservationErrors.phone && (
                            <div className="absolute left-0 -top-10 z-[100] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                              {reservationErrors.phone}
                              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
                            </div>
                          )}
                          {reservationErrors.phone && (Object.keys(reservationErrors)[0] === 'phone') && (
                            <div className="absolute left-0 -top-10 z-[90] bg-slate-700/90 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap animate-bounce pointer-events-none">
                              {reservationErrors.phone}
                              <div className="absolute -bottom-1 left-4 w-1.5 h-1.5 bg-slate-700/90 rotate-45"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-sm font-normal text-slate-600 text-left">Họ tên <span className="text-red-500 font-normal">*</span></label>
                        <div className="relative group">
                          <input 
                            type="text" 
                            placeholder="Nhập họ tên khách hàng..."
                            className={`w-full h-10 px-3 bg-white border ${reservationErrors.customer ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm text-slate-800 font-normal focus:border-brand outline-none transition-colors`}
                            value={newReservation.customer || ''}
                            onChange={(e) => {
                              setNewReservation({...newReservation, customer: e.target.value});
                              if (reservationErrors.customer) setReservationErrors(prev => { const n = {...prev}; delete n.customer; return n; });
                            }}
                          />
                          {reservationErrors.customer && (
                            <div className="absolute left-0 -top-10 z-[100] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                              {reservationErrors.customer}
                              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
                            </div>
                          )}
                          {reservationErrors.customer && (Object.keys(reservationErrors)[0] === 'customer') && (
                            <div className="absolute left-0 -top-10 z-[90] bg-slate-700/90 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap animate-bounce pointer-events-none">
                              {reservationErrors.customer}
                              <div className="absolute -bottom-1 left-4 w-1.5 h-1.5 bg-slate-700/90 rotate-45"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* 3. Tiền đặt cọc */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <label className="text-sm font-normal text-slate-600 text-left">Tiền đặt cọc</label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-40">
                          <input 
                            type="text" 
                            className="w-full h-10 pl-3 pr-10 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-normal focus:border-brand outline-none transition-colors"
                            value={newReservation.depositAmount ? Math.round(newReservation.depositAmount).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) : ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setNewReservation({...newReservation, depositAmount: parseInt(val) || 0});
                            }}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-normal text-slate-400">đ</div>
                        </div>
                        <div className="relative flex-1">
                          <select 
                            className="w-full h-10 px-3 pr-10 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-normal focus:border-brand outline-none appearance-none transition-colors"
                            value={newReservation.depositMethod}
                            onChange={(e) => setNewReservation({...newReservation, depositMethod: e.target.value})}
                          >
                            <option value="cash">Tiền mặt</option>
                            <option value="transfer">Chuyển khoản</option>
                            <option value="card">Quẹt thẻ</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* 4. Thông tin bổ sung (Expandable) */}
                  <div className="overflow-hidden">
                    <button 
                      onClick={() => setShowMoreReservationFields(!showMoreReservationFields)}
                      className="w-full py-4 flex items-center justify-between text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-normal text-slate-700">Thông tin bổ sung</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showMoreReservationFields ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showMoreReservationFields && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pb-5 space-y-5 pt-2"
                        >
                          <div className="grid grid-cols-[120px_1fr] gap-4">
                            <label className="text-sm font-normal text-slate-600 text-left mt-2.5">Ghi chú khách</label>
                            <textarea 
                              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-normal focus:border-brand outline-none h-20 transition-colors"
                              placeholder="Thói quen, sở thích khách hàng..."
                              value={newReservation.customerNote || ''}
                              onChange={(e) => setNewReservation({...newReservation, customerNote: e.target.value})}
                            />
                          </div>

                          <div className="grid grid-cols-[120px_1fr] gap-4">
                            <label className="text-sm font-normal text-slate-600 text-left mt-2.5">Ghi chú bếp/bar</label>
                            <textarea 
                              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-normal focus:border-brand outline-none h-20 transition-colors"
                              placeholder="Không hành, ít đường..."
                              value={newReservation.kitchenNote || ''}
                              onChange={(e) => setNewReservation({...newReservation, kitchenNote: e.target.value})}
                            />
                          </div>

                          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label className="text-sm font-normal text-slate-600 text-left">NV kinh doanh</label>
                            <div className="relative">
                              <select 
                                className="w-full h-10 px-3 pr-10 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-normal focus:border-brand outline-none appearance-none transition-colors"
                                value={newReservation.salesPerson || ''}
                                onChange={(e) => setNewReservation({...newReservation, salesPerson: e.target.value})}
                              >
                                <option value="">Chọn nhân viên...</option>
                                <option value="nv01">Nguyễn Thị Thùy</option>
                                <option value="nv02">Trần Minh Quân</option>
                                <option value="nv03">Lê Hoàng Nam</option>
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right Column: Pre-ordered Dishes */}
                <div className="flex flex-col h-full border border-slate-200 rounded-xl p-5 overflow-hidden">
                  <div className="flex justify-between items-center mb-5">
                    <h4 className="text-sm font-normal text-slate-500 uppercase flex items-center gap-2">
                      <UtensilsCrossed className="w-3.5 h-3.5" /> Đặt món
                    </h4>
                    <button 
                      onClick={() => {
                        setOrderBackup({ items: orderItems, orderId: currentOrderId });
                        setOrderItems((newReservation.preorderedDishes || []).map((d: any) => ({
                          ...d,
                          id: d.id || Math.random().toString(), 
                          addons: d.addons || [],
                          qty: d.qty || 1,
                          price: d.price || 0
                        })));
                        setIsPickingDishes(true);
                        setCurrentScreen('order');
                        setShowAddReservation(false);
                      }}
                      className="px-4 h-10 rounded-lg border border-brand text-sm font-bold text-brand hover:bg-brand-light transition-all flex items-center gap-1"
                    >
                      <PlusCircle className="w-4 h-4" /> Thêm món
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 min-h-[350px]">
                    {newReservation?.preorderedDishes?.length > 0 ? (
                      newReservation.preorderedDishes.map((dish: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center gap-3 shadow-sm">
                          <div className="flex-1">
                            <div className="text-sm font-normal text-slate-700">{dish.name}</div>
                            <div className="text-xs text-brand font-normal">{formatCurrency(dish.price || 0)}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleUpdatePreorderQty(idx, -1)}
                              className="w-6 h-6 flex items-center justify-center border border-slate-200 rounded text-slate-500"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-normal text-sm">{dish.qty}</span>
                            <button 
                              onClick={() => handleUpdatePreorderQty(idx, 1)}
                              className="w-6 h-6 flex items-center justify-center border border-slate-200 rounded text-slate-500"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                             onClick={() => handleRemovePreorderItem(idx)}
                             className="text-red-400 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : ( 
                      <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-6 relative">
                          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="50" fill="url(#paint0_linear_13184_6666)"/>
                            <g clipPath="url(#clip0_13184_6666)">
                              <path d="M31.2389 43.288C28.7651 48.0323 27.6186 57.1713 28.4096 64.6393L36.6428 59.0767C36.7144 56.2754 35.1689 47.1831 33.0852 43.2807C32.7071 42.5726 31.61 42.5764 31.2389 43.288Z" fill="white"/>
                              <path d="M38.7254 62.2266V43.5597C38.7254 43.1279 38.1189 42.9813 37.9034 43.3611C33.7168 50.7371 30.9262 57.8189 29.3761 64.6392L38.7254 62.2266Z" fill="#F0F0F0"/>
                              <path d="M27.8037 64.6395C30.7828 61.0698 35.0902 57.6113 40.1131 54.2127C40.4247 54.0019 40.8454 54.2239 40.8454 54.6V64.6395L34.3245 66.1166L27.8037 64.6395Z" fill="white"/>
                              <path d="M50.219 28.6756V34.7534H56.3579V28.6756C56.3579 28.1938 55.9674 27.8032 55.4855 27.8032H51.0914C50.6097 27.8032 50.219 28.1938 50.219 28.6756Z" fill="#407194"/>
                              <path d="M55.4857 27.8032H52.7402C53.2221 27.8032 53.6128 28.1938 53.6128 28.6756V34.7534H56.3581V28.6756C56.3579 28.1938 55.9674 27.8032 55.4857 27.8032Z" fill="#365F7E"/>
                              <path d="M45.9698 46.6528C46.2918 44.8462 47.2967 43.2123 48.802 42.1089L49.7193 41.4383C50.0339 41.2078 50.2188 40.8415 50.2188 40.453V34.7542H56.3577V40.453C56.3577 40.8415 56.5437 41.2078 56.8569 41.4383L57.7742 42.1089C59.2794 43.2123 60.2854 44.8462 60.6074 46.6528L53.2884 48.1298L45.9698 46.6528Z" fill="#8DBEFF"/>
                              <path d="M60.7199 58.9072V68.8972C60.7199 69.3433 60.3596 69.7037 59.9135 69.7037L53.2892 71.1809L46.6634 69.7037C46.2188 69.7037 45.8582 69.3433 45.8582 68.8972V58.9072H60.7199Z" fill="#8DBEFF"/>
                              <path d="M57.5868 46.6528C57.1156 45.2761 56.2323 44.0558 55.0284 43.1739L54.1126 42.5033C53.7979 42.2729 53.6129 41.908 53.6129 41.518V34.7542H56.3581V40.453C56.3581 40.8415 56.5441 41.2078 56.8573 41.4383L57.7746 42.1089C59.2798 43.2123 60.2857 44.8462 60.6078 46.6528H57.5868Z" fill="#4997FF"/>
                              <path d="M60.7196 58.9072V68.8972C60.7196 69.3433 60.3594 69.7037 59.9133 69.7037H57.1687C57.6133 69.7037 57.9737 69.3433 57.9737 68.8972V58.9072H60.7196Z" fill="#4997FF"/>
                              <path d="M45.8582 47.9153V58.9074L52.8135 61.3629C53.11 61.4676 53.4334 61.4678 53.7301 61.3635L60.72 58.9074V47.9153C60.72 47.4878 60.6816 47.0652 60.6079 46.6516H45.9703C45.8965 47.0652 45.8582 47.4878 45.8582 47.9153Z" fill="#F4DAA7"/>
                              <path d="M60.6623 47.0178C60.6469 46.8956 60.6292 46.7723 60.6077 46.6516H57.5839C57.8374 47.3924 57.9742 48.1775 57.9742 48.9805V59.872L60.7199 58.9073V47.9152C60.7198 47.6305 60.6964 47.2894 60.6623 47.0178Z" fill="#EEC06B"/>
                              <path d="M18.2852 64.6401H49.3863C49.9889 64.6401 50.2455 65.4063 49.7645 65.7693L45.0533 69.3234C44.7258 69.5706 44.3266 69.7043 43.9163 69.7043L33.8358 71.1814L23.7552 69.7043C23.3449 69.7043 22.9457 69.5706 22.6183 69.3234L17.907 65.7693C17.4261 65.4063 17.6826 64.6401 18.2852 64.6401Z" fill="#4980AC"/>
                              <path d="M70.0488 68.8556C69.4185 68.8556 68.9076 68.3447 68.9076 67.7144V57.4437C68.9076 56.8134 69.4185 56.3025 70.0488 56.3025C70.6791 56.3025 71.1901 56.8134 71.1901 57.4437V67.7144C71.1901 68.3447 70.6791 68.8556 70.0488 68.8556Z" fill="#D9D9D9"/>
                              <path d="M66.8271 48.5874L65.5919 56.6591C65.2307 59.0198 67.0575 61.1473 69.4455 61.1473H70.9392C73.3273 61.1473 75.1541 59.0198 74.7928 56.6591L73.5576 48.5874C73.497 48.1915 73.1565 47.8992 72.7559 47.8992H67.6286C67.2281 47.899 66.8876 48.1914 66.8271 48.5874Z" fill="url(#paint1_linear_13184_6666)"/>
                              <path d="M69.9294 66.3865C67.6472 66.3865 65.7704 68.1227 65.5483 70.3464C65.5246 70.5829 65.7071 70.7896 65.9447 70.7896L70.0514 72.2667L73.914 70.7896C74.1516 70.7896 74.3341 70.5829 74.3104 70.3464C74.0881 68.1227 72.2116 66.3865 69.9294 66.3865Z" fill="#DADADA"/>
                              <path d="M83.3383 90.1446C79.3904 92.6759 74.0879 93.5444 69.4075 92.2952C63.1528 96.7609 53.3398 97.9935 46.2186 94.6982C39.0974 97.9935 29.2844 96.7609 23.0295 92.2952C18.3491 93.5443 13.0467 92.6759 9.09876 90.1446C8.62356 89.8399 8.35826 89.2949 8.40967 88.7327L9.77352 73.8293C9.98741 71.4923 11.9473 69.7036 14.2941 69.7036H78.143C80.4897 69.7036 82.4496 71.4923 82.6635 73.8293L84.0274 88.7327C84.0788 89.2949 83.8136 89.8399 83.3383 90.1446Z" fill="#DDEBFD"/>
                              <path d="M84.0272 88.7329L82.7263 74.5174C82.6566 74.2837 82.8566 71.8371 80.5481 70.3929C79.8504 69.9564 79.0252 69.7036 78.1429 69.7036H14.2941C11.9473 69.7036 9.98745 71.4923 9.77356 73.8293L9.71063 74.5174C10.5718 73.4653 11.8791 72.8006 13.3307 72.8006H78.0873C78.5185 72.8006 78.8856 73.1056 78.9748 73.5275C79.0198 73.7405 79.0522 73.959 79.0711 74.1822L80.435 90.3597C80.4846 90.9477 80.2379 91.5159 79.7949 91.8526C81.0496 91.4173 82.243 90.8465 83.3328 90.1483C83.8101 89.8425 84.0789 89.2975 84.0272 88.7329Z" fill="#BED9FD"/>
                              <path d="M46.2183 81.9937C45.588 81.9937 45.0771 82.5046 45.0771 83.1349V95.1767C45.4638 95.0288 45.8455 94.8715 46.2183 94.6991C46.5911 94.8716 46.973 95.0289 47.3597 95.1768V83.135C47.3597 82.5046 46.8488 81.9937 46.2183 81.9937Z" fill="#BED9FD"/>
                              <path d="M69.4075 83.1968C68.7772 83.1968 68.2662 83.7077 68.2662 84.338V93.0501C68.6578 92.8099 69.0392 92.5593 69.4075 92.2963C69.7842 92.3969 70.1651 92.4822 70.5489 92.5556V84.338C70.5487 83.7079 70.0378 83.1968 69.4075 83.1968Z" fill="#BED9FD"/>
                              <path d="M23.0294 83.1968C22.3991 83.1968 21.8881 83.7077 21.8881 84.338V92.5556C22.2717 92.4823 22.6527 92.3969 23.0294 92.2963C23.3976 92.5593 23.779 92.8099 24.1706 93.0501V84.338C24.1706 83.7079 23.6597 83.1968 23.0294 83.1968Z" fill="#BED9FD"/>
                            </g>
                            <defs>
                              <linearGradient id="paint0_linear_13184_6666" x1="50" y1="0" x2="49.5798" y2="94.958" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#CBEFFF"/>
                                <stop offset="0.521031" stopColor="#EDF8FF"/>
                                <stop offset="1" stopColor="white"/>
                              </linearGradient>
                              <linearGradient id="paint1_linear_13184_6666" x1="73.234" y1="54.7548" x2="74.0743" y2="59.7968" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"/>
                                <stop offset="1" stopColor="#E0E0E0"/>
                              </linearGradient>
                              <clipPath id="clip0_13184_6666">
                                <rect width="75.6302" height="75.6302" fill="white" transform="translate(11.7647 24.3696)"/>
                              </clipPath>
                            </defs>
                          </svg>
                          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-50">
                             <PlusCircle className="w-6 h-6 text-brand" />
                          </div>
                        </div>
                        <p className="text-base font-bold text-slate-700">Chưa có món đặt trước</p>
                        <p className="text-sm text-slate-400 mt-2 max-w-[200px] mx-auto">
                          Vui lòng nhấn <span className="text-brand font-bold">"Thêm món"</span> để bắt đầu chọn món ăn cho khách
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Tạm tính:</span>
                      <span className="text-lg font-black text-brand">{formatCurrency(calculatePreorderTotal(newReservation.preorderedDishes))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowAddReservation(false)} 
                className="px-8 h-10 rounded-lg border border-slate-300 text-[13px] font-bold text-slate-700 hover:bg-white transition-all min-w-[120px]"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSaveReservation}
                className="px-8 h-10 rounded-lg bg-brand text-[13px] font-bold text-white hover:bg-brand-hover shadow-md active:scale-95 transition-all min-w-[120px]"
              >
                Lưu đặt chỗ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-order Item Select Modal */}
      {showPreorderItemSelect && (
        <div className="modal-overlay" style={{zIndex: 120}}>
          <div className="res-modal !max-w-[800px] !h-[80vh]">
            <div className="modal-header">
              <h3 className="text-lg font-bold">Chọn món ăn đặt trước</h3>
              <button onClick={() => setShowPreorderItemSelect(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* Category Sidebar */}
              <div className="w-40 border-r border-slate-100 bg-slate-50 overflow-y-auto">
                {menuCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-white text-brand border-r-2 border-brand' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Item Grid */}
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                <div className="grid grid-cols-3 gap-4">
                  {menuItems.filter(item => activeCategory === 'Hay dùng' || item.category === activeCategory).map(item => {
                    const existingIdx = showAddReservation 
                      ? newReservation.preorderedDishes.findIndex(d => d.id === item.id)
                      : selectedReservation?.preorderedDishes.findIndex((d: any) => d.id === item.id);

                    return (
                      <div 
                        key={item.id}
                        className="border border-slate-100 rounded-xl p-3 flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group"
                      >
                        <div className="h-24 rounded-lg overflow-hidden bg-slate-100">
                           <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                        <div className="text-xs font-bold text-slate-700 line-clamp-2 h-8">{item.name}</div>
                        <div className="text-sm font-black text-brand">{formatCurrency(item.price)}</div>
                        
                        <button 
                          onClick={() => {
                            if (showAddReservation) {
                              handleAddPreorderItem(item);
                            } else {
                              // Direct edit to selectedReservation if in detail mode
                              const updatedDishes = [...(selectedReservation.preorderedDishes || [])];
                              const idx = updatedDishes.findIndex(d => d.id === item.id);
                              if (idx >= 0) {
                                updatedDishes[idx].qty += 1;
                              } else {
                                updatedDishes.push({ ...item, qty: 1, note: '' });
                              }
                              setReservations(prev => prev.map(r => r.id === selectedReservation.id ? { ...r, preorderedDishes: updatedDishes } : r));
                              showToast(`Đã thêm ${item.name}`);
                            }
                          }}
                          className="w-full py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Chọn món
                        </button>

                        {existingIdx >= 0 && (
                          <div className="absolute top-2 right-2 bg-brand text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white">
                            {showAddReservation 
                              ? newReservation.preorderedDishes[existingIdx].qty 
                              : selectedReservation.preorderedDishes[existingIdx].qty
                            }
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setShowPreorderItemSelect(false)} 
                className="btn-confirm bg-brand text-white px-10"
              >
                Xác nhận đã chọn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // ==========================================
  // RENDER APPS MENU (9-DOT MENU)
  // ==========================================
  const renderAppsMenu = () => {
    const mainApps = [
      { name: 'Kế toán Thu - Chi', icon: Wallet, color: 'bg-[#8BB723]' },
      { name: 'Khai báo thực đơn (AVA)', icon: UtensilsCrossed, color: 'bg-[#3AA8F0]' },
      { name: 'Quy trình Onboarding', icon: ClipboardList, color: 'bg-[#076EFF]' },
      { name: 'Virtual Tour Guide', icon: Compass, color: 'bg-[#9C27B0]' },
      { name: 'Nhập kho', icon: PackagePlus, color: 'bg-[#EA5297]' },
      { name: 'Xuất kho', icon: PackageX, color: 'bg-[#E54D42]' },
      { name: 'Lịch sử gửi bếp/bar - Nhắc bếp', icon: History, color: 'bg-[#F29D38]' },
      { name: 'Báo cáo tổng hợp', icon: BarChart3, color: 'bg-[#67C23A]' },
      { name: 'Nhật ký truy cập', icon: ShieldCheck, color: 'bg-[#40C9C6]' },
      { name: 'Đồng bộ dữ liệu', icon: CloudDownload, color: 'bg-[#5A67D8]' },
      { name: 'Thiết lập', icon: Settings, color: 'bg-[#4A5568]' },
    ];

    const supportMenu = [
      { icon: HelpCircle, label: 'Trợ giúp' },
      { icon: MessageSquare, label: 'Liên hệ với MISA CukCuk' },
      { icon: Star, label: 'Đánh giá ứng dụng' },
      { icon: ArrowUpCircle, label: 'Cập nhật' },
    ];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Darkened Background Image */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </motion.div>

        {/* Main Glassmorphism Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl h-[85vh] bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl flex overflow-hidden border border-white/40"
        >
          {/* Left Section */}
          <div className="flex-1 p-10 flex flex-col overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowAppsMenu(false)}
              className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all mb-8 font-bold text-sm w-fit"
            >
              <div className="p-1.5 rounded-xl border border-slate-200 group-hover:border-slate-400 group-hover:-translate-x-1 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
              Quay lại
            </button>

            {/* Apps Grid */}
            <div className="grid grid-cols-4 gap-x-8 gap-y-12 pr-6">
              {mainApps.map((app, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    if (app.name === 'Kế toán Thu - Chi') {
                      setShowAppsMenu(false);
                      setShowAccounting(true);
                    } else if (app.name === 'Virtual Tour Guide') {
                      setShowAppsMenu(false);
                      handleSafeNavigation('tourguide');
                    } else if (app.name === 'Khai báo thực đơn (AVA)' || app.name === 'Quy trình Onboarding' || app.name === 'Thiết lập') {
                      setShowAppsMenu(false);
                      setShowOnboarding(true);
                    } else {
                      showToast('Tính năng đang phát triển', 'error');
                    }
                  }}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div className={`w-16 h-16 ${app.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <app.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-normal text-slate-600 text-center leading-snug max-w-[120px] group-hover:text-brand transition-colors">{app.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Section (Profile & Support) */}
          <div className="w-[340px] bg-white border-l border-slate-100 p-8 flex flex-col items-center">
            {/* User Info */}
            <div className="flex flex-col items-center mb-8 text-center w-full">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-xl">
                  <img src="https://i.pravatar.cc/150?u=nvorder" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <h2 className="text-[18px] font-bold text-slate-800 mb-0.5">{userProfile?.name || 'NV Order'}</h2>
              <p className="text-sm font-bold text-slate-500 truncate w-full">{userProfile?.shopName || 'Phở phú gia'}</p>
              <p className="text-sm font-normal text-slate-400">{userProfile?.phone || 'phophugia.cukcuk.vn'}</p>
              
              <button 
                onClick={() => {
                  setIsLoggedIn(false);
                  setShowAppsMenu(false);
                  setUserProfile(null);
                  showToast('Đã đăng xuất khỏi hệ thống', 'success');
                }}
                className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Đăng xuất
              </button>
            </div>

            {/* Chat button */}
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#006E58' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast('Tính năng đang phát triển', 'error')}
              className="w-full h-14 bg-brand text-white rounded-xl flex items-center px-4 gap-4 mb-8 transition-all shadow-lg shadow-brand/20 group"
            >
              <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">Chat với tư vấn</span>
            </motion.button>

            {/* Support Menu */}
            <div className="w-full flex-1 overflow-y-auto custom-scrollbar-hidden">
              <div className="flex flex-col gap-1">
                {supportMenu.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => showToast('Tính năng đang phát triển', 'error')}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all text-slate-500 group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-brand/10 transition-colors">
                      <item.icon className="w-5 h-5 text-slate-400 group-hover:text-brand transition-colors" />
                    </div>
                    <span className="text-sm font-normal group-hover:text-slate-800 transition-colors">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // If not logged in, render the Auth/Register/SMS screen first
  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden relative select-none">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: `url("https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=c595569e-041d-499f-8d09-609dc2c72c91.png&preview=true&cId=69ba1fca7a0ff0333a05fc7e&tCode=misa&tenantcode=misa")` }}
        />

        {/* Visual Tablet Frame */}
        <div className="relative w-[1161px] h-[772px] max-w-full max-h-full rounded-[32px] border-[14px] border-slate-950 bg-slate-950 shadow-[0_30px_70px_-10px_rgba(15,23,42,0.25),0_0_0_1px_rgba(0,0,0,0.05),inset_0_0_10px_rgba(255,255,255,0.15)] flex flex-col overflow-hidden z-10 transition-all duration-300">
          
          {/* Subtle camera lens */}
          <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-slate-900 z-50 flex items-center justify-center border border-slate-800">
            <div className="w-1 h-1 rounded-full bg-blue-950/80" />
          </div>
          
          {/* Actual App Area inside the Tablet */}
          <div id="tablet-app-container" className="w-full h-full relative overflow-hidden bg-background rounded-[18px] flex flex-col select-text">
            <AuthScreen 
              onLogin={(profile) => {
                setUserProfile(profile);
                setIsLoggedIn(true);
                setShowOnboarding(true); // Auto-open onboarding flow upon registration/login
                showToast(`Đăng nhập thành công! Chào mừng ${profile.name}`, 'success');
              }}
            />
          </div>

          {/* Realistic screen glare reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.03] pointer-events-none z-40 rounded-[18px] m-[-1px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden relative select-none">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none" 
        style={{ backgroundImage: `url("https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=c595569e-041d-499f-8d09-609dc2c72c91.png&preview=true&cId=69ba1fca7a0ff0333a05fc7e&tCode=misa&tenantcode=misa")` }}
      />

      {/* Visual Tablet Frame */}
      <div className="relative w-[1161px] h-[772px] max-w-full max-h-full rounded-[32px] border-[14px] border-slate-950 bg-slate-950 shadow-[0_30px_70px_-10px_rgba(15,23,42,0.25),0_0_0_1px_rgba(0,0,0,0.05),inset_0_0_10px_rgba(255,255,255,0.15)] flex flex-col overflow-hidden z-10 transition-all duration-300">
        
        {/* Subtle camera lens */}
        <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-slate-900 z-50 flex items-center justify-center border border-slate-800">
          <div className="w-1 h-1 rounded-full bg-blue-950/80" />
        </div>
        
        {/* Actual App Area inside the Tablet */}
        <div id="tablet-app-container" className="w-full h-full relative overflow-hidden bg-background rounded-[18px] flex flex-col select-text">
          <div className="h-full w-full flex bg-background overflow-hidden relative">
      {/* Navigation Confirmation Dialog */}
      <AnimatePresence mode="wait">
        {showNavConfirm && renderNavConfirmDialog()}
      </AnimatePresence>

      {showOnboarding ? (
        <OnboardingScreen 
          userProfile={userProfile}
          onComplete={() => {
            setShowOnboarding(false);
            setCurrentScreen('tables');
            setShowInteractiveTour(true);
            showToast('Đã khởi chạy POS bán hàng sẵn sàng phục vụ!', 'success');
          }}
          customMenuItems={customMenuItems}
          setCustomMenuItems={setCustomMenuItems}
          isMenuSetup={isMenuSetup}
          setIsMenuSetup={setIsMenuSetup}
          isPaymentSetup={isPaymentSetup}
          setIsPaymentSetup={setIsPaymentSetup}
          isPrinterSetup={isPrinterSetup}
          setIsPrinterSetup={setIsPrinterSetup}
          isInvoiceSetup={isInvoiceSetup}
          setIsInvoiceSetup={setIsInvoiceSetup}
          isTableSetup={isTableSetup}
          setIsTableSetup={setIsTableSetup}
          isTaxSetup={isTaxSetup}
          setIsTaxSetup={setIsTaxSetup}
          paymentSettings={paymentSettings}
          setPaymentSettings={setPaymentSettings}
          connectedPrinters={connectedPrinters}
          setConnectedPrinters={setConnectedPrinters}
          taxSettings={taxSettings}
          setTaxSettings={setTaxSettings}
          invoiceSettings={invoiceSettings}
          setInvoiceSettings={setInvoiceSettings}
          customZones={customZones}
          setCustomZones={setCustomZones}
          customTables={customTables}
          setCustomTables={setCustomTables}
          kitchenStations={kitchenStations}
          setKitchenStations={setKitchenStations}
          businessType={businessType}
          setBusinessType={setBusinessType}
          orderMethod={orderMethod}
          setOrderMethod={setOrderMethod}
          kitchenDevice={kitchenDevice}
          setKitchenDevice={setKitchenDevice}
        />
      ) : (
        <>
          <Sidebar />
          {currentScreen === 'orderList' && renderOrderListScreen()}
          {currentScreen === 'order' && renderOrderScreen()}
          {currentScreen === 'payment' && renderPaymentScreen()}
          {currentScreen === 'invoices' && renderInvoicesScreen()}
          {currentScreen === 'tables' && renderTablesScreen()}
          {currentScreen === 'reservations' && renderReservationsScreen()}
          {currentScreen === 'tourguide' && (
            <TourGuideScreen 
              userProfile={userProfile}
              onNavigateToScreen={(screen) => handleSafeNavigation(screen)}
              onClose={() => handleSafeNavigation('reservations')}
              onStartInteractiveTour={(stepIdx) => {
                if (stepIdx !== undefined) {
                  setInteractiveTourStep(stepIdx);
                } else {
                  setInteractiveTourStep(0);
                }
                setShowInteractiveTour(true);
              }}
            />
          )}
          {renderReservationsModals()}
        </>
      )}

      <AnimatePresence>
        {showAppsMenu && renderAppsMenu()}
      </AnimatePresence>

      <AnimatePresence>
        {showAccounting && (
          <AccountingScreen 
            userProfile={userProfile}
            orders={orders}
            taxSettings={taxSettings}
            transactions={transactions}
            onAddTransaction={(tx) => setTransactions([tx, ...transactions])}
            onClose={() => setShowAccounting(false)}
          />
        )}
      </AnimatePresence>

      <InteractiveTour 
        isOpen={showInteractiveTour} 
        onClose={() => {
          setShowInteractiveTour(false);
          setShowAppsMenu(false);
          setCurrentScreen('orderList');
        }} 
        onNavigateToScreen={(screen) => handleSafeNavigation(screen)}
        onOpenAppsMenu={() => setShowAppsMenu(true)}
        currentScreen={currentScreen}
        initialStep={interactiveTourStep}
        orders={orders}
        customizingItem={customizingItem}
        orderItems={orderItems}
      />

      {/* Cancel Item Dialog */}
      <AnimatePresence>
        {showCancelItemDialog && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelItemDialog(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[450px] overflow-hidden flex flex-col"
            >
              <div className="relative p-6 flex items-center border-b border-slate-100">
                 <h3 className="text-xl font-bold text-slate-800">Hủy món</h3>
                 <button 
                   onClick={() => setShowCancelItemDialog(false)}
                   className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl border border-red-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                    {itemToCancel?.image ? (
                      <img src={itemToCancel.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UtensilsCrossed className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{itemToCancel?.name}</div>
                    <div className="text-sm text-slate-500">{formatCurrency(itemToCancel?.price || 0)} x {itemToCancel?.qty || 0}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Lý do hủy món</label>
                  <div className="space-y-2">
                    {['Khách đợi lâu', 'Khách đổi sang món khác', 'Khách không còn nhu cầu', 'Khác'].map(reason => (
                      <label 
                        key={reason} 
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          cancelReason === reason ? 'border-brand bg-blue-50/50' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="cancelReason" 
                          checked={cancelReason === reason} 
                          onChange={() => setCancelReason(reason)}
                          className="w-5 h-5 accent-brand"
                        />
                        <span className={`font-medium ${cancelReason === reason ? 'text-brand' : 'text-slate-700'}`}>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {cancelReason === 'Khác' && ( 
                  <textarea 
                    className="w-full h-24 p-4 rounded-xl border border-slate-200 focus:border-brand focus:outline-none text-sm"
                    placeholder="Nhập lý do khác..."
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                 <button 
                   onClick={() => setShowCancelItemDialog(false)}
                   className="px-8 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all text-[13px] min-w-[120px]"
                 >
                   Hủy bỏ
                 </button>
                 <button 
                   onClick={() => {
                      removeItem(itemToCancel.instanceId || itemToCancel.id);
                      showToast(`Đã hủy món: ${itemToCancel.name}`);
                      setShowCancelItemDialog(false);
                   }}
                   className="px-8 h-10 rounded-lg bg-red-500 text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px] shadow-lg min-w-[120px]"
                 >
                   Đồng ý
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Customer Dialog */}
      <AnimatePresence>
        {showAddCustomerDialog && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCustomerDialog(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Thêm khách hàng mới</h3>
                <button onClick={() => setShowAddCustomerDialog(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Tên khách hàng <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    placeholder="Nhập tên khách hàng..."
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-brand bg-white text-sm"
                    value={newCustomerData.name}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                  <input 
                    type="tel"
                    placeholder="Nhập số điện thoại..."
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-brand bg-white text-sm"
                    value={newCustomerData.phone}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="p-6 pt-0 flex justify-end gap-3">
                <button 
                  onClick={() => setShowAddCustomerDialog(false)}
                  className="px-8 h-10 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm min-w-[120px]"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => {
                    if (!newCustomerData.name || !newCustomerData.phone) {
                      showToast('Vui lòng nhập đầy đủ thông tin', 'error');
                      return;
                    }
                    const newCust = { ...newCustomerData };
                    setCustomers([newCust, ...customers]);
                    setCurrentOrderCustomer(newCust);
                    setShowAddCustomerDialog(false);
                    setNewCustomerData({ name: '', phone: '' });
                    showToast('Đã thêm khách hàng mới');
                  }}
                  className="px-8 h-10 rounded-xl bg-brand text-white font-bold hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 text-sm min-w-[120px]"
                >
                  Lưu lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Kitchen History Dialog */}
      <AnimatePresence>
        {showKitchenHistoryDialog && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKitchenHistoryDialog(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-[600px] h-[80vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Lịch sử gửi bếp/bar</h3>
                    <p className="text-sm text-slate-500">Xem lại các đợt gửi món phục vụ</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowKitchenHistoryDialog(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50">
                {(() => {
                  const currentOrder = orders.find(o => o.id === currentOrderId);
                  const history = currentOrder?.kitchenHistory || [];
                  
                  if (history.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                          <History className="w-8 h-8" />
                        </div>
                        <p className="text-slate-500 font-medium">Chưa có lịch sử gửi món cho đơn này</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      {history.map((entry: any, hIdx: number) => (
                        <div key={hIdx} className="relative pl-8 pb-2">
                          {/* Timeline vertical line */}
                          {hIdx !== history.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-200"></div>
                          )}
                          
                          {/* Timeline point */}
                          <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white ring-4 ring-brand/10 z-10">
                            <span className="text-[10px] font-bold">{entry.round}</span>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 bg-white border-b border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-800">Lượt gửi {entry.round}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> {entry.timestamp}
                                </span>
                              </div>
                              <button 
                                onClick={() => showToast(`Đang in lại lượt gửi bếp #${entry.round}...`)}
                                className="flex items-center gap-2 px-4 h-10 bg-brand/10 text-brand rounded-xl text-xs font-bold hover:bg-brand/20 transition-all active:scale-95"
                              >
                                <Printer className="w-4 h-4" /> In lại
                              </button>
                            </div>
                            <div className="p-4 bg-white">
                              <div className="space-y-3">
                                {entry.items.map((item: any, iIdx: number) => (
                                  <div key={iIdx} className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded-md text-xs font-bold text-slate-600 border border-slate-100">
                                          {item.qty}
                                        </span>
                                        <span className="text-sm font-bold text-slate-700">{item.name}</span>
                                      </div>
                                      {item.addons?.length > 0 && (
                                        <div className="pl-8 flex flex-wrap gap-x-2 gap-y-1 mt-1">
                                          {item.addons.map((a: any, idx: number) => (
                                            <span key={idx} className="text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                              +{a.name}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      {item.note && (
                                        <div className="pl-8 mt-1 flex items-center gap-1 text-[11px] text-brand font-medium italic">
                                          <NotebookPen className="w-3 h-3" /> {item.note}
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-sm font-bold text-black">
                                      {formatCurrency(item.price * item.qty)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="p-6 border-t border-slate-100 flex items-center justify-end bg-white shrink-0">
                <button 
                  onClick={() => setShowKitchenHistoryDialog(false)}
                  className="h-10 px-8 rounded-lg bg-brand text-white font-bold hover:bg-brand-hover active:scale-[0.98] transition-all shadow-lg shadow-brand/20 text-sm min-w-[120px]"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Applied Promotions Summary Dialog */}
      <AnimatePresence>
        {showAppliedPromosDialog && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAppliedPromosDialog(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-lg border border-slate-200 w-full max-w-[500px] overflow-hidden flex flex-col transition-all"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <h3 className="text-[18px] font-black text-slate-800">
                  Khuyến mại đã áp dụng
                </h3>
                <button 
                  onClick={() => {
                    setShowAppliedPromosDialog(false);
                    setShowPromotionDialog(true);
                  }}
                  className="flex items-center gap-1.5 px-4 h-9 bg-brand/5 text-brand rounded-lg border border-brand/20 text-sm font-bold hover:bg-brand/10 transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" /> Thêm KM
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[440px] overflow-y-auto custom-scrollbar">
                {getAppliedPromotionsSummary().length > 0 ? (
                  <div className="space-y-3">
                    {getAppliedPromotionsSummary().map((promo, idx) => (
                      <div key={`${promo.id}-${idx}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:bg-white hover:border-slate-200">
                        <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                          <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${promo.type === 'item_level' ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>
                            {promo.type === 'item_level' ? <Tag className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 text-[13px] leading-tight mb-0.5 truncate" title={promo.label}>
                              {promo.label}
                            </div>
                            <div className="text-[12px] text-slate-500 italic leading-snug truncate">
                              {promo.type === 'item_level' ? `Áp dụng cho: ${promo.itemName} (x${promo.qty})` : 'Áp dụng cho toàn đơn hàng'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right shrink-0">
                            <div className="font-black text-red-500 text-[13px]">-{formatCurrency(promo.discount)}</div>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePromotionSummary(promo);
                            }}
                            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                            title="Xóa khuyến mại"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Tag className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">Chưa áp dụng chương trình nào</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowAppliedPromosDialog(false)}
                  className="px-8 h-10 rounded-lg bg-brand text-white font-bold text-[13px] hover:brightness-110 active:scale-95 transition-all min-w-[120px]"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Promotion Dialog */}
      <AnimatePresence>
        {showPromotionDialog && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (viewingPromoDetail) {
                  setViewingPromoDetail(null);
                } else {
                  setShowPromotionDialog(false);
                }
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`relative bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                viewingPromoDetail ? 'w-full max-w-[900px] h-[600px]' : 'w-full max-w-[520px]'
              }`}
            >
              {/* Header */}
              <div className="relative p-6 flex items-center border-b border-slate-100 bg-white z-10 shrink-0">
                <div className="flex items-center gap-3">
                  {viewingPromoDetail && (
                    <button 
                      onClick={() => setViewingPromoDetail(null)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h3 className="text-xl font-bold text-slate-800">
                    {viewingPromoDetail ? 'Điều kiện áp dụng' : 'Chương trình khuyến mại'}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowPromotionDialog(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!viewingPromoDetail ? (
                /* List View */
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                  {mockPromotions.map((promo) => (
                    <div 
                      key={promo.id}
                      onClick={() => {
                        setSelectedPromoIds(prev => 
                          prev.includes(promo.id) 
                            ? prev.filter(id => id !== promo.id) 
                            : [...prev, promo.id]
                        );
                      }}
                      className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 cursor-pointer group transition-all"
                    >
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          selectedPromoIds.includes(promo.id) ? 'bg-[#076EFF] border-[#076EFF]' : 'border-slate-300 group-hover:border-slate-400'
                        }`}>
                        {selectedPromoIds.includes(promo.id) && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-[15px] font-bold text-slate-800">
                          {promo.name}
                        </span>
                        <span className="text-sm text-slate-400 font-normal">
                          {promo.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-black text-red-500">
                          {promo.itemsList ? (
                             promo.itemsList[0].discountType === 'percent' 
                               ? `-${promo.itemsList[0].discountValue}%` 
                               : `-${formatCurrency(promo.itemsList[0].discountValue)}`
                          ) : ''}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingPromoDetail(promo);
                          }}
                          className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-brand transition-all border border-transparent hover:border-slate-200 shadow-sm"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Detail View (Split) */
                <div className="flex-1 flex overflow-hidden border-b border-slate-100">
                  {/* Left: Conditions */}
                  <div className="w-[45%] border-r border-slate-100 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
                    <div>
                        <h4 className="text-[13px] font-normal text-slate-400 uppercase tracking-wider mb-3">Hình thức khuyến mại</h4>
                        <div className="flex items-center gap-3 text-slate-700 font-normal">
                          <div className="p-2 rounded-lg bg-white border border-slate-200">
                            {viewingPromoDetail.type === 'discount_item' ? <Tag className="w-5 h-5 text-brand" /> : 
                             viewingPromoDetail.type === 'discount_bill' ? <Receipt className="w-5 h-5 text-green-500" /> : 
                             <Gift className="w-5 h-5 text-red-500" />}
                          </div>
                          <span className="font-normal text-sm">
                            {viewingPromoDetail.type === 'discount_item' ? 'Giảm giá món' : 
                             viewingPromoDetail.type === 'discount_bill' ? 'Giảm giá hóa đơn' : 
                             'Tặng món'}
                          </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-normal text-slate-400 uppercase tracking-wider mb-3">Áp dụng cho</h4>
                        <div className="flex items-center gap-3 text-slate-700 font-normal text-sm">
                          <Users className="w-4 h-4 text-slate-400" />
                          {viewingPromoDetail.target}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-normal text-slate-400 uppercase tracking-wider mb-3">Thời gian áp dụng</h4>
                        <div className="space-y-2 text-slate-700 text-sm">
                          <div className="flex items-center gap-3 font-normal">
                            <Clock className="w-4 h-4 text-slate-400" />
                            Từ {viewingPromoDetail.startDate} - {viewingPromoDetail.endDate}
                          </div>
                          <div className="flex items-center gap-3 ml-7 text-sm text-slate-500 font-normal italic">
                            Các ngày: {viewingPromoDetail.activeDays.join(', ')}
                          </div>
                          <div className="flex items-center gap-3 ml-7 text-sm text-slate-500 font-normal italic">
                            Khung giờ: {viewingPromoDetail.timeSlots.join(', ')}
                          </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-normal text-slate-400 uppercase tracking-wider mb-3">Điều kiện áp dụng</h4>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-normal">
                          <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                          <span className="font-normal whitespace-pre-wrap">{viewingPromoDetail.condition}</span>
                        </div>
                    </div>
                  </div>

                  {/* Right: Items & Discounts */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <h4 className="text-[13px] font-normal text-slate-400 uppercase tracking-wider mb-2">Danh sách món áp dụng</h4>
                    <div className="space-y-3">
                        <div className="grid grid-cols-[1fr_100px_80px] gap-4 px-2 pb-2 text-[11px] font-normal text-slate-400 uppercase tracking-wider border-b border-slate-100">
                          <div>Tên món</div>
                          <div className="text-right">Mức giảm</div>
                          <div className="text-center">Tối đa</div>
                        </div>
                        {viewingPromoDetail.itemsList.map((item: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-[1fr_100px_80px] gap-4 p-2 rounded-lg border border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <div className="text-sm font-normal text-slate-700">{item.itemName}</div>
                            <div className="text-sm font-bold text-red-500 text-right">
                               {item.discountType === 'percent' ? `${item.discountValue}%` : formatCurrency(item.discountValue)}
                            </div>
                            <div className="text-sm font-normal text-slate-500 text-center">
                               {item.maxUsage}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-[#f5f5f5] shrink-0">
                <button 
                  onClick={() => {
                    if (viewingPromoDetail) {
                      setViewingPromoDetail(null);
                    } else {
                      setShowPromotionDialog(false);
                    }
                  }}
                  className="px-8 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all text-[13px] min-w-[120px]"
                >
                  {viewingPromoDetail ? 'Quay lại' : 'Hủy bỏ'}
                </button>
                <button 
                  onClick={() => {
                    if (viewingPromoDetail) {
                       if (!selectedPromoIds.includes(viewingPromoDetail.id)) {
                         setSelectedPromoIds(prev => [...prev, viewingPromoDetail.id]);
                       }
                       setViewingPromoDetail(null);
                    } else {
                      const selectedPromos = mockPromotions.filter(p => selectedPromoIds.includes(p.id));
                      setAppliedOrderPromos(selectedPromos);
                      if (selectedPromos.length > 0) {
                        showToast(`Đã áp dụng ${selectedPromos.length} chương trình khuyến mại`);
                      }
                      setShowPromotionDialog(false);
                    }
                  }}
                  className="px-8 h-10 rounded-lg bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px] shadow-lg min-w-[120px]"
                >
                  {viewingPromoDetail ? 'Chọn KM này' : 'Đồng ý'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTransferItemDialog && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTransferItemDialog(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col"
            >
              <div className="relative p-6 flex items-center border-b border-slate-100">
                 <h3 className="text-xl font-bold text-slate-800">Chuyển sang Order khác</h3>
                 <button 
                   onClick={() => setShowTransferItemDialog(false)}
                   className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="p-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl border border-blue-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                    {itemToTransfer?.image ? (
                      <img src={itemToTransfer.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UtensilsCrossed className="w-6 h-6 text-brand" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{itemToTransfer?.name}</div>
                    <div className="text-sm text-slate-500">{formatCurrency(itemToTransfer?.price || 0)} x {itemToTransfer?.qty || 0}</div>
                  </div>
                </div>

                <label className="block text-sm font-bold text-slate-700 mb-3">Chọn Order chuyển đến</label>
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {orders.filter(o => o.id !== currentOrderId).map(order => (
                    <label 
                      key={order.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        targetOrderId === order.id ? 'border-brand bg-blue-50 ring-1 ring-brand' : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="targetOrder" 
                          checked={targetOrderId === order.id} 
                          onChange={() => setTargetOrderId(order.id)}
                          className="w-5 h-5 accent-brand"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{order.label || `#${order.orderNo}`}</div>
                          <div className="text-xs text-slate-500">{order.customer || 'Khách lẻ'} - {formatCurrency(order.amount)}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'serving' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {order.status === 'serving' ? 'Đang phục vụ' : 'Hóa đơn tạm'}
                      </div>
                    </label>
                  ))}
                  {orders.filter(o => o.id !== currentOrderId).length === 0 && (
                    <div className="py-10 text-center text-slate-400">Không có Order khác để chuyển món</div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                 <button 
                   onClick={() => setShowTransferItemDialog(false)}
                   className="px-8 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all text-[13px] min-w-[120px]"
                 >
                   Hủy bỏ
                 </button>
                 <button 
                   onClick={() => {
                      if (!targetOrderId) {
                        showToast('Vui lòng chọn Order chuyển đến');
                        return;
                      }
                      
                      const targetOrder = orders.find(o => o.id === targetOrderId);
                      if (targetOrder && itemToTransfer) {
                        const updatedTargetItems = [...(targetOrder.items || []), itemToTransfer];
                        setOrders(prev => prev.map(o => {
                          if (o.id === targetOrderId) {
                            return { 
                              ...o, 
                              items: updatedTargetItems,
                              dishes: updatedTargetItems.length,
                              amount: (o.amount || 0) + (itemToTransfer.price * itemToTransfer.qty)
                            };
                          }
                          if (o.id === currentOrderId) {
                            const remainingItems = o.items.filter((i: any) => i.instanceId !== itemToTransfer.instanceId);
                            return {
                              ...o,
                              items: remainingItems,
                              dishes: remainingItems.length,
                              amount: (o.amount || 0) - (itemToTransfer.price * itemToTransfer.qty)
                            };
                          }
                          return o;
                        }));
                        
                        setOrderItems(prev => prev.filter(i => i.instanceId !== itemToTransfer.instanceId));
                        
                        showToast(`Đã chuyển ${itemToTransfer.name} sang ${targetOrder.label || `#${targetOrder.orderNo}`}`);
                        setShowTransferItemDialog(false);
                        setTargetOrderId(null);
                        setItemToTransfer(null);
                      }
                   }}
                   className="px-8 h-10 rounded-lg bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px] shadow-lg min-w-[120px]"
                 >
                   Đồng ý
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Info Drawer */}
      {renderOrderDrawer()}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
            toast.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 'bg-red-600 border-red-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-bold text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Wallet QR Dialog */}
      <AnimatePresence>
        {showWalletQRDialog && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalletQRDialog(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 100 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-[480px] overflow-hidden flex flex-col items-center"
            >
              <div className="p-8 w-full text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Số tiền cần thanh toán</h3>
                <div className="text-4xl font-black text-slate-900 mb-2">{formatCurrency(finalTotal)}</div>
                <p className="text-sm text-slate-400 font-medium px-4">
                  Quét mã thanh toán bằng ứng dụng {walletType}.<br />
                  Ví điện tử hoặc ứng dụng ngân hàng
                </p>

                <div className="my-8 relative group">
                  <div className="absolute -inset-4 bg-slate-50 border border-slate-100 rounded-3xl -z-10 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <QrCode className="w-48 h-48 mx-auto text-slate-900" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium italic">
                  <RotateCw className="w-4 h-4 animate-spin-slow" /> Chờ {walletType} phản hồi
                </div>
              </div>

              {/* Partner Logos */}
              <div className="px-6 py-6 w-full bg-[#fce4ec]/40 flex gap-4 overflow-hidden border-t border-[#f8bbd0]">
                <div className="flex-1 flex items-center gap-4">
                  <div className="shrink-0 border-r border-[#f48fb1] pr-4 py-2">
                    <img 
                      src={
                        walletType === 'Momo' ? 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' :
                        walletType === 'VNpay' ? 'https://vnpay.vn/wp-content/themes/vnpay/assets/images/logo-vnpay.png' :
                        'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ShopeePay-V.png'
                      } 
                      alt="Wallet Logo" 
                      className="h-10 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4 flex-1 opacity-60">
                    {['Vietcombank', 'Agribank', 'Techcombank', 'ACB', 'MB', 'TPBank', 'SCB', 'VietinBank'].map(bank => (
                      <div key={bank} className="h-4 flex items-center justify-center grayscale">
                        <span className="text-[9px] font-black tracking-tighter text-slate-600 truncate">{bank}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="w-full p-6 border-t border-slate-100 flex items-center gap-3">
                <button 
                  onClick={() => setShowWalletQRDialog(false)}
                  className="px-8 h-12 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  Đóng
                </button>
                <div className="flex-1"></div>
                <button 
                  onClick={() => {
                    showToast(`Đang kiểm tra kết quả...`);
                    // Mock success after a bit
                    setTimeout(() => {
                      setShowWalletQRDialog(false);
                      // Trigger payment success logic
                      const orderToComplete = orders.find(o => o.id === currentOrderId);
                      if (orderToComplete) {
                        const now = new Date();
                        const newInvoiceId = (2404000187 + mockInvoices.length).toString();
                        const newInvoice = {
                          id: newInvoiceId,
                          orderNo: `Order ${orderToComplete.orderNo} (${orderToComplete.tables ? orderToComplete.tables.map(t => t).join(', ') : 'Giao hàng'})`,
                          customer: orderToComplete.customer || 'Khách lẻ không lấy hóa đơn',
                          phone: orderToComplete.phone || '',
                          amount: finalTotal,
                          status: 'paid',
                          time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                          date: now.toLocaleDateString('vi-VN'),
                          eInvoiceIssued: false,
                          invoiceRequested: true
                        };
                        setOrders(prev => prev.filter(o => o.id !== currentOrderId));
                        setMockInvoices(prev => [newInvoice, ...prev]);
                        showToast('Thanh toán thành công!');
                        setCurrentScreen('orderList');
                      }
                    }, 1500);
                  }}
                  className="px-6 h-12 rounded-xl border border-brand text-brand font-bold hover:bg-blue-50 transition-all shadow-sm flex items-center gap-2"
                >
                  Kiểm tra
                </button>
                <button className="px-6 h-12 rounded-xl bg-brand text-white font-bold hover:bg-brand-hover active:scale-[0.98] transition-all shadow-md flex items-center gap-2">
                  <Printer className="w-4 h-4" /> In mã
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fee Detail Dialog */}
      <AnimatePresence>
        {activeOrderMenuId && (
          <div className="fixed inset-0 z-[200]">
            <div 
              className="absolute inset-0 bg-transparent" 
              onClick={() => setActiveOrderMenuId(null)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              style={{ 
                position: 'fixed',
                left: orderMenuPos.x - 256, // width of menu (w-64 = 256px)
                top: orderMenuPos.y - 10, // slightly above the button
                transform: 'translateY(-100%)' // pop upwards
              }}
              className="w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[201] overflow-hidden py-1"
              onClick={e => e.stopPropagation()}
            >
              {[
                { label: 'Gửi YC thanh toán', icon: Calculator },
                { label: 'Chuyển bàn', icon: RefreshCw },
                { label: 'Kiểm đồ', icon: ClipboardList },
                { label: 'Ghép order', icon: ClipboardPlus },
                { label: 'Tách order', icon: ArrowDownRight },
                { label: 'Hủy order', icon: XCircle, danger: true },
              ].map((item, idx) => (
                <React.Fragment key={idx}>
                  <button 
                    className={`w-full px-4 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left ${item.danger ? 'text-red-500' : 'text-slate-700'}`}
                    onClick={() => {
                      showToast(`Tính năng ${item.label} đang phát triển`);
                      setActiveOrderMenuId(null);
                    }}
                  >
                    <item.icon className={`w-5 h-5 ${item.danger ? 'text-red-400' : 'text-slate-400'}`} />
                    <span className="text-[15px] font-medium">{item.label}</span>
                  </button>
                  {idx < 5 && <div className="mx-4 border-b border-slate-50" />}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeeDetailDialog && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeeDetailDialog(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[400px] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">Chi tiết Phí & Thuế</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Service Fee Checkbox Row */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={isServiceFeeEnabled}
                        onChange={(e) => setIsServiceFeeEnabled(e.target.checked)}
                        className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-lg bg-white checked:bg-brand checked:border-brand transition-all cursor-pointer" 
                      />
                      <CheckCircle2 className="w-4 h-4 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <div className="select-none">
                      <div className="font-bold text-slate-700 text-sm">Phí dịch vụ 10%</div>
                      <div className="text-sm text-slate-400 font-medium italic">Tính trên tổng món</div>
                    </div>
                  </label>
                  {isServiceFeeEnabled && (
                    <span className="font-bold text-slate-700 text-sm">+{formatCurrency(totalServiceFeeActual)}</span>
                  )}
                </div>

                <div className="space-y-4 px-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium uppercase tracking-wider">Tổng tiền hàng:</span>
                    <span className="font-bold text-slate-700">{formatCurrency(totalGrossAmount - totalDiscountAll)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <button 
                      onClick={() => setShowTaxBreakdownDialog(true)}
                      className="text-brand font-bold uppercase tracking-wider text-sm flex items-center gap-1 hover:underline"
                    >
                      Thuế GTGT <Info className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-slate-700">{formatCurrency(totalTaxAmountActual)}</span>
                  </div>

                  {currentOrderChannel === 'delivery' && activeDeliveryFee > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Phí giao hàng:</span>
                      <span className="font-bold text-slate-700">+{formatCurrency(activeDeliveryFee)}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-500 uppercase tracking-widest text-sm">Tổng phí & thuế:</span>
                  <span className="text-2xl font-black text-brand">{formatCurrency(totalFeesAndTaxesActual)}</span>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                <button 
                  onClick={() => setShowFeeDetailDialog(false)}
                  className="flex-1 h-12 rounded-xl bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
                >
                  Xong
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tax Breakdown Dialog */}
      <AnimatePresence>
        {showTaxBreakdownDialog && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTaxBreakdownDialog(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">Chi tiết Thuế GTGT</h3>
                <button onClick={() => setShowTaxBreakdownDialog(false)} className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 active:bg-slate-100 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {Object.entries(taxGroups).length > 0 ? (
                  Object.entries(taxGroups).map(([key, group]: any) => (
                    <div key={key} className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b-2 border-brand/20 bg-brand/5 p-3 rounded-xl">
                        <div className="bg-brand text-white font-black px-4 py-1 rounded-lg text-lg shadow-sm">
                          Mức thuế {key}
                        </div>
                        <div className="flex-1 text-right text-sm text-brand font-bold">
                          {group.items.length} món
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {group.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start p-1">
                            <div className="flex-1 mr-4">
                              <div className="font-bold text-slate-700 text-[13px] uppercase">{item.name}</div>
                              <div className="text-sm text-slate-400 mt-0.5">
                                {formatCurrency(item.price)} x {item.qty}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[13px] font-bold text-slate-900">{formatCurrency(item.taxValue)}</div>
                              <div className="text-[12px] text-slate-400 mt-0.5 italic">Gốc: {formatCurrency(item.taxableAmount)}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                        <span className="font-bold text-slate-500 text-sm uppercase tracking-wider">TỔNG THUẾ {key}:</span>
                        <span className="text-lg font-black text-slate-900 underline decoration-brand/30 underline-offset-4">
                          {formatCurrency(group.items.reduce((s: number, i: any) => s + (i.taxValue as number), 0))}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-400">Không có dữ liệu thuế</div>
                )}
              </div>

              <div className="p-6 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400 font-medium uppercase tracking-widest mb-1">Tổng cộng Thuế GTGT</div>
                  <div className="text-3xl font-black text-white leading-none whitespace-nowrap">{formatCurrency(totalTaxAmountActual)}</div>
                </div>
                <button 
                  onClick={() => setShowTaxBreakdownDialog(false)}
                  className="px-10 h-14 rounded-2xl bg-brand text-white font-bold hover:brightness-110 active:scale-[0.95] transition-all shadow-xl shadow-brand/20 flex items-center gap-2 text-lg"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Buyer Info Dialog */}
      <AnimatePresence>
        {showBuyerInfoDialog && (
          <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBuyerInfoDialog(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-lg shadow-2xl w-full max-w-[620px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-slate-800">Thông tin xuất hóa đơn</h3>
                <button 
                  onClick={() => setShowBuyerInfoDialog(false)}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Type Selection */}
                <div className="flex gap-10 mb-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${buyerType === 'personal' ? 'border-brand' : 'border-slate-300'}`}>
                      {buyerType === 'personal' && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                    </div>
                    <input 
                      type="radio" 
                      className="hidden" 
                      checked={buyerType === 'personal'} 
                      onChange={() => setBuyerType('personal')} 
                    />
                    <span className={`text-sm font-medium ${buyerType === 'personal' ? 'text-slate-800' : 'text-slate-500'}`}>Cá nhân</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${buyerType === 'company' ? 'border-brand' : 'border-slate-300'}`}>
                      {buyerType === 'company' && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                    </div>
                    <input 
                      type="radio" 
                      className="hidden" 
                      checked={buyerType === 'company'} 
                      onChange={() => setBuyerType('company')} 
                    />
                    <span className={`text-sm font-medium ${buyerType === 'company' ? 'text-slate-800' : 'text-slate-500'}`}>Công ty/Hộ kinh doanh</span>
                  </label>
                </div>

                {/* Form Content Box */}
                <div className="bg-[#f8fafc]/50 border border-blue-50/50 rounded-lg p-8 space-y-5">
                  {buyerType === 'personal' ? (
                    <>
                      {/* Cá nhân Fields */}
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">Căn cước công dân</label>
                        <input 
                          type="text" 
                          value={buyerInfo.idCard || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, idCard: e.target.value})}
                          placeholder="Nhập số CCCD người mua"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">
                          Tên người mua <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={buyerInfo.name || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                          placeholder="Nhập tên người mua"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">
                          Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={buyerInfo.address || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, address: e.target.value})}
                          placeholder="Nhập địa chỉ"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">Số điện thoại</label>
                        <input 
                          type="text" 
                          value={buyerInfo.phone || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                          placeholder="Nhập số điện thoại người mua"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">Số hộ chiếu</label>
                        <input 
                          type="text" 
                          value={buyerInfo.passport || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, passport: e.target.value})}
                          placeholder="Nhập số hộ chiếu"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Công ty Fields */}
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">
                          Mã số thuế <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={buyerInfo.taxId || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, taxId: e.target.value})}
                          placeholder="Nhập mã số thuế"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">
                          Tên đơn vị <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={buyerInfo.name || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                          placeholder="Nhập tên đơn vị"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">
                          Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={buyerInfo.address || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, address: e.target.value})}
                          placeholder="Nhập địa chỉ"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">Người nhận HĐ</label>
                        <input 
                          type="text" 
                          value={buyerInfo.recipient || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, recipient: e.target.value})}
                          placeholder="Nhập tên người nhận hóa đơn"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-slate-700">Email nhận HĐ</label>
                        <input 
                          type="email" 
                          value={buyerInfo.email || ''}
                          onChange={(e) => setBuyerInfo({...buyerInfo, email: e.target.value})}
                          placeholder="Nhập email nhận hóa đơn"
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
                <button 
                  onClick={() => setShowBuyerInfoDialog(false)}
                  className="h-10 px-8 rounded-md border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-all text-[13px]"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    showToast('Đã lưu thông tin người mua');
                    setShowBuyerInfoDialog(false);
                  }}
                  className="h-10 px-10 rounded-md bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px]"
                >
                  Lưu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Add Dish Dialog */}
      <AnimatePresence>
        {showQuickAddDishDialog && (
          <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickAddDishDialog(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <h3 className="text-lg font-bold text-slate-800">Thêm nhanh món mới</h3>
                <button 
                  onClick={() => setShowQuickAddDishDialog(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wider block">
                    Tên món ăn / Đồ uống <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={quickAddDishName}
                    onChange={(e) => setQuickAddDishName(e.target.value)}
                    placeholder="Nhập tên món ăn..."
                    className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand transition-all text-[13px] text-slate-800 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 tracking-wider block">
                      Đơn giá (VND) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={quickAddDishPrice === 0 ? '' : Math.round(quickAddDishPrice).toLocaleString('vi-VN')}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setQuickAddDishPrice(val ? parseInt(val) : 0);
                        }}
                        placeholder="0"
                        className="w-full h-10 pl-4 pr-10 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand transition-all text-[13px] text-slate-850 font-black text-right"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₫</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 tracking-wider block">
                      Nhóm thực đơn <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={quickAddDishCategory}
                      onChange={(e) => setQuickAddDishCategory(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand font-bold text-slate-700 text-sm"
                    >
                      <option>Cà phê</option>
                      <option>Trà hoa quả</option>
                      <option>Đá xay</option>
                      <option>Đồ uống đóng chai</option>
                      <option>Đồ ăn nhẹ</option>
                      <option>Khác</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-500 leading-normal">
                    Món mới thêm sẽ tự động được lưu vào nhóm <span className="font-bold text-slate-700">"{quickAddDishCategory}"</span> của thực đơn chính, và đồng thời tự động đưa trực tiếp vào đơn hàng hiện tại để bạn phục vụ khách hàng ngay lập tức.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white shrink-0">
                <button 
                  onClick={() => setShowQuickAddDishDialog(false)}
                  className="h-10 px-8 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all text-[13px] min-w-[120px]"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => {
                    if (!quickAddDishName.trim()) {
                      showToast('Vui lòng nhập tên món', 'error');
                      return;
                    }
                    const newDishId = `dish_quick_${Date.now()}`;
                    const newMenuItem = {
                      id: newDishId,
                      name: quickAddDishName,
                      price: quickAddDishPrice,
                      category: quickAddDishCategory,
                      image: quickAddDishCategory.includes('uống') || quickAddDishCategory.includes('Rượu')
                        ? 'https://images.unsplash.com/photo-1544145945-f904253db0ad?w=120&auto=format&fit=crop&q=60'
                        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=60',
                      isCustom: true
                    };
                    setCustomMenuItems(prev => [...prev, newMenuItem]);
                    handleAddToCart(newMenuItem);
                    setSearchQuery('');
                    setShowQuickAddDishDialog(false);
                    showToast(`Đã thêm thành công món "${quickAddDishName}" vào thực đơn và giỏ hàng!`, 'success');
                  }}
                  className="h-10 px-8 rounded-xl bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px] min-w-[120px]"
                >
                  Lưu & Thêm đơn
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* meInvoice Warning Dialog */}
      <AnimatePresence>
        {showMisaAlert && (
          <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowMisaAlert(false);
                setPendingActionInvoice(null);
                setPendingActionPayment(false);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[440px] overflow-hidden flex flex-col"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500">
                  <Monitor className="w-6 h-6 stroke-2" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-800">Chưa kết nối MISA meInvoice!</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[320px] mx-auto">
                    Để phát hành hóa đơn điện tử máy tính tiền hợp lệ, bạn cần kết nối tài khoản hệ thống MISA meInvoice của doanh nghiệp.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
                <button 
                  onClick={() => {
                    setShowMisaAlert(false);
                    setPendingActionInvoice(null);
                    setPendingActionPayment(false);
                  }}
                  className="h-10 px-8 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all text-[13px] min-w-[120px]"
                >
                  Để sau
                </button>
                <button 
                  onClick={() => {
                    setShowMisaAlert(false);
                    // Initialize meInvoice quick states
                    setQuickTaxCode('0101243150');
                    setQuickMeInvoiceUser('misa_cuong_cashier');
                    setQuickMeInvoicePass('••••••••');
                    setQuickInvoiceStep(1);
                    setQuickInvoiceOtpStep(false);
                    setQuickEsignConnected(false);
                    setQuickIsCertSelected(false);
                    setQuickEsignUser('misa_cuong_esign');
                    setQuickEsignPass('••••••••');
                    setShowQuickMisaInvoiceDialog(true);
                  }}
                  className="h-10 px-8 rounded-xl bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px] min-w-[120px] shadow-md shadow-blue-200"
                >
                  Kết nối ngay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick meInvoice Connection Wizard */}
      <AnimatePresence>
        {showQuickMisaInvoiceDialog && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowQuickMisaInvoiceDialog(false);
                setPendingActionInvoice(null);
                setPendingActionPayment(false);
              }}
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[560px] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <Monitor className="w-5 h-5 text-brand" />
                  <span className="font-bold text-slate-800 text-lg">Liên kết nhanh Phần mềm xuất hóa đơn</span>
                </div>
                <button 
                  onClick={() => {
                    setShowQuickMisaInvoiceDialog(false);
                    setPendingActionInvoice(null);
                    setPendingActionPayment(false);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps Indicators */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 grid grid-cols-3 gap-2 shrink-0">
                {[
                  { step: 1, name: 'Đăng nhập MISA' },
                  { step: 2, name: 'Chữ ký số phát hành' },
                  { step: 3, name: 'Tùy chọn hóa đơn' }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${quickInvoiceStep === s.step ? 'bg-brand text-white' : quickInvoiceStep > s.step ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {quickInvoiceStep > s.step ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
                    </div>
                    <span className={`text-xs font-bold ${quickInvoiceStep === s.step ? 'text-slate-800' : 'text-slate-400'}`}>{s.name}</span>
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                
                {quickInvoiceStep === 1 && (
                  // Step 1 Layout
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Nhập mã số thuế và tài khoản đăng nhập meInvoice của cơ sở kinh doanh để thiết lập đồng bộ hóa đơn điện tử tự động.
                    </p>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 block tracking-wider">Mã số thuế doanh nghiệp <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          value={quickTaxCode}
                          onChange={(e) => setQuickTaxCode(e.target.value)}
                          placeholder="Mã số thuế doanh nghiệp (10 số)"
                          className="w-full h-10 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-bold text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block tracking-wider">Tên đăng nhập <span className="text-red-500">*</span></label>
                          <input 
                            type="text"
                            value={quickMeInvoiceUser}
                            onChange={(e) => setQuickMeInvoiceUser(e.target.value)}
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block tracking-wider">Mật khẩu <span className="text-red-500">*</span></label>
                          <input 
                            type="password"
                            value={quickMeInvoicePass}
                            onChange={(e) => setQuickMeInvoicePass(e.target.value)}
                            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-bold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    {quickInvoiceOtpStep && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 border border-blue-200/60 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-600 leading-normal">
                            Chúng tôi đã gửi mã xác thực OTP đến email <span className="font-bold text-slate-800">cuo***@gmail.com</span> kết nối với tài khoản của bạn. Vui lòng nhập mã để hoàn tất.
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 block tracking-wider">Mã xác nhận OTP <span className="text-red-500">*</span></label>
                          <input 
                            type="text"
                            value={quickInvoiceOtp}
                            onChange={(e) => setQuickInvoiceOtp(e.target.value)}
                            placeholder="Nhập mã OTP gồm 6 chữ số"
                            className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-black text-center tracking-widest text-slate-800"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {quickInvoiceStep === 2 && (
                  // Step 2 Layout
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Để tự động phát hành và ký số hóa đơn hợp lệ ngay tại quầy, vui lòng kết nối tài khoản chữ ký số của bạn.
                    </p>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div 
                        onClick={() => setQuickSignType('esign')}
                        className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-32 ${quickSignType === 'esign' ? 'border-brand bg-blue-50/20' : 'border-slate-200 hover:border-brand'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-brand bg-blue-50 px-2 py-0.5 rounded-full">MISA eSign</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${quickSignType === 'esign' ? 'border-brand' : 'border-slate-300'}`}>
                            {quickSignType === 'esign' && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                          </div>
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-sm leading-tight">Chữ ký số MISA eSign</div>
                          <div className="text-xs text-slate-400 font-normal mt-1 leading-snug">Ký số từ xa không cần USB token vật lý. Khuyên dùng.</div>
                        </div>
                      </div>

                      <div 
                        onClick={() => setQuickSignType('usb')}
                        className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-32 ${quickSignType === 'usb' ? 'border-brand bg-blue-50/20' : 'border-slate-200 hover:border-brand'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">USB Token</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${quickSignType === 'usb' ? 'border-brand' : 'border-slate-300'}`}>
                            {quickSignType === 'usb' && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                          </div>
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-sm leading-tight">USB Token Chữ ký số</div>
                          <div className="text-xs text-slate-400 font-normal mt-1 leading-snug">Sử dụng chữ ký số vật lý cắm vào cổng USB của máy thu ngân.</div>
                        </div>
                      </div>
                    </div>

                    {quickSignType === 'esign' ? (
                      <div className="space-y-3 border-t border-slate-100 pt-3">
                        {!quickEsignConnected ? (
                          <>
                            <div className="grid grid-cols-2 gap-3.5">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 block tracking-wider">Tên đăng nhập eSign</label>
                                <input 
                                  type="text"
                                  value={quickEsignUser}
                                  onChange={(e) => setQuickEsignUser(e.target.value)}
                                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-bold text-slate-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 block tracking-wider">Mật khẩu eSign</label>
                                <input 
                                  type="password"
                                  value={quickEsignPass}
                                  onChange={(e) => setQuickEsignPass(e.target.value)}
                                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-sm font-bold text-slate-800"
                                />
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                setQuickEsignConnected(true);
                                showToast('Đã kết nối chữ ký số MISA eSign thành công!', 'success');
                              }}
                              className="w-full h-10 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-sm"
                            >
                              Xác minh & Liên kết eSign
                            </button>
                          </>
                        ) : (
                          <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 flex gap-3 text-emerald-800">
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                            <div className="space-y-1 font-normal">
                              <div className="text-xs font-black text-emerald-900">ĐÃ LIÊN KẾT CHỮ KÝ SỐ MISA ESIGN</div>
                              <div className="text-xs leading-normal opacity-90">
                                <span className="font-bold">Đơn vị:</span> CÔNG TY CỔ PHẦN MISA • MST: 0101243150 <br />
                                <span className="font-bold">Serial:</span> 540129BA219E929EAA9892 <br />
                                <span className="font-bold">Hạn dùng:</span> 30/06/2028 (Còn lại 2 năm)
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center py-6 text-center text-slate-500">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 mb-2">
                          <Monitor className="w-5 h-5 animate-pulse" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">Đang tìm cổng thiết bị USB Token...</p>
                        <p className="text-xs text-slate-400 font-normal mt-0.5">Vui lòng cắm USB Token ký số của bạn vào cổng máy tính và chọn kết nối.</p>
                        <button 
                          onClick={() => {
                            setQuickSignType('esign');
                            setQuickEsignConnected(true);
                            showToast('Đã tự động kết nối giả lập Chữ ký số thành công!', 'success');
                          }}
                          className="mt-3 h-10 px-6 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
                        >
                          Mô phỏng cắm USB Token thành công
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {quickInvoiceStep === 3 && (
                  // Step 3 Layout
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Thiết lập các tham số vận hành hóa đơn điện tử máy tính tiền để tự động hóa quy trình bán hàng.
                    </p>

                    <div className="divide-y divide-slate-100 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                      <div className="flex items-center justify-between pb-3.5">
                        <div className="space-y-0.5 pr-4">
                          <div className="font-black text-slate-800 text-sm">Phát hành trực tiếp từ POS</div>
                          <div className="text-xs text-slate-400 font-normal leading-snug">Ký số và truyền dữ liệu hóa đơn lên cơ quan Thuế trực tiếp ngay sau khi nhấn phát hành tại màn hình POS.</div>
                        </div>
                        <div 
                          onClick={() => setQuickIssueFromPos(!quickIssueFromPos)}
                          className={`w-12 h-6.5 rounded-full p-0.5 cursor-pointer transition-all ${quickIssueFromPos ? 'bg-brand' : 'bg-slate-300'}`}
                        >
                          <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-all ${quickIssueFromPos ? 'translate-x-5.5' : 'translate-x-0'}`} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3.5">
                        <div className="space-y-0.5 pr-4">
                          <div className="font-black text-slate-800 text-sm">Tự động gửi email hóa đơn</div>
                          <div className="text-xs text-slate-400 font-normal leading-snug">Hệ thống meInvoice tự động gửi hóa đơn điện tử định dạng XML, PDF đến email khách hàng đăng ký.</div>
                        </div>
                        <div 
                          onClick={() => setQuickAutoSendInvoice(!quickAutoSendInvoice)}
                          className={`w-12 h-6.5 rounded-full p-0.5 cursor-pointer transition-all ${quickAutoSendInvoice ? 'bg-brand' : 'bg-slate-300'}`}
                        >
                          <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-all ${quickAutoSendInvoice ? 'translate-x-5.5' : 'translate-x-0'}`} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3.5">
                        <div className="space-y-0.5 pr-4">
                          <div className="font-black text-slate-800 text-sm">Tự động phát hành khi thanh toán</div>
                          <div className="text-xs text-slate-400 font-normal leading-snug">Hóa đơn điện tử sẽ tự động phát hành ngay sau khi nhấn nút Thanh toán thành công (không cần nhấn nút phát hành thủ công).</div>
                        </div>
                        <div 
                          onClick={() => setQuickAutoIssueOnPay(!quickAutoIssueOnPay)}
                          className={`w-12 h-6.5 rounded-full p-0.5 cursor-pointer transition-all ${quickAutoIssueOnPay ? 'bg-brand' : 'bg-slate-300'}`}
                        >
                          <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-all ${quickAutoIssueOnPay ? 'translate-x-5.5' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white shrink-0">
                <button 
                  onClick={() => {
                    if (quickInvoiceStep === 1) {
                      setShowQuickMisaInvoiceDialog(false);
                      setPendingActionInvoice(null);
                      setPendingActionPayment(false);
                    } else {
                      setQuickInvoiceStep(prev => prev - 1);
                    }
                  }}
                  className="h-10 px-8 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all text-[13px] min-w-[120px]"
                >
                  {quickInvoiceStep === 1 ? 'Hủy bỏ' : 'Quay lại'}
                </button>
                <button 
                  onClick={() => {
                    if (quickInvoiceStep === 1) {
                      if (!quickInvoiceOtpStep) {
                        setQuickInvoiceOtpStep(true);
                        setQuickInvoiceOtp('123456');
                        showToast('Đã gửi mã OTP xác thực qua email!', 'success');
                      } else {
                        setQuickInvoiceStep(2);
                      }
                    } else if (quickInvoiceStep === 2) {
                      if (!quickEsignConnected) {
                        showToast('Vui lòng kết nối chữ ký số trước khi tiếp tục', 'error');
                        return;
                      }
                      setQuickInvoiceStep(3);
                    } else if (quickInvoiceStep === 3) {
                      // Save meInvoice connection status
                      setInvoiceSettings({
                        username: quickMeInvoiceUser,
                        taxCode: quickTaxCode,
                        isConnected: true
                      });
                      setIsInvoiceSetup(true);
                      setShowQuickMisaInvoiceDialog(false);
                      showToast('Kết nối thành công hệ thống Phần mềm xuất hóa đơn!', 'success');

                      // Handle pending actions
                      if (pendingActionInvoice) {
                        const inv = pendingActionInvoice;
                        setPendingActionInvoice(null);
                        setSelectedInvoiceForIssue(inv);
                        setIssueFormData({
                          invoiceType: 'MTT',
                          invoiceDate: '17/04/2026',
                          series: '1C26MAH',
                          customerName: inv.customer || 'Khách lẻ không lấy hóa đơn',
                          sendToCustomer: false,
                          recipientName: inv.customer || '',
                          recipientEmail: '',
                          signDigital: false
                        });
                        setIsIssueModalOpen(true);
                      } else if (pendingActionPayment) {
                        setPendingActionPayment(false);
                        showToast('Bây giờ bạn đã có thể nhấn "Thanh toán" để hoàn tất phát hành hóa đơn!', 'success');
                      }
                    }
                  }}
                  className="h-10 px-8 rounded-xl bg-brand text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all text-[13px] min-w-[120px]"
                >
                  {quickInvoiceStep === 3 ? 'Hoàn thành' : 'Tiếp tục'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
          </div>
        </div>
        {/* Realistic screen glare reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.03] pointer-events-none z-40 rounded-[18px] m-[-1px]" />
      </div>
    </div>
  );
}
