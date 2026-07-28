import React, { useState, useMemo, useEffect } from 'react';
import { HeaderMenuDropdown } from './HeaderMenuDropdown';
import { InvoiceIcon } from './InvoiceIcon';
import { 
  Home, 
  Plus, 
  Globe, 
  CloudDownload, 
  Cloud,
  ArrowLeftRight, 
  RefreshCw,
  Receipt,
  MessageSquare,
  Bell, 
  Clock, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Menu,
  CheckCircle,
  Phone,
  MapPin,
  Truck,
  ArrowLeft,
  DollarSign,
  MoreVertical,
  Check,
  Printer,
  X,
  FileText,
  Gift,
  ChevronsLeft,
  Pencil,
  LayoutGrid,
  Info,
  Save,
  Bike,
  Utensils,
  Calendar,
  Users,
  BookMarked,
  UtensilsCrossed,
  CornerUpRight,
  CreditCard,
  ChevronRight
} from 'lucide-react';

const CukcukLogoIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9.57827 19.2C9.28743 19.1898 9.00149 19.1178 8.73722 18.9883C8.60679 18.9284 8.48091 18.8579 8.36072 18.7773L1.27139 13.9306C0.858056 13.6551 0.5223 13.2662 0.299473 12.8049C0.0766463 12.3436 -0.0250196 11.827 0.00521373 11.3095C0.0337751 10.893 0.15034 10.4887 0.346212 10.1267C0.571843 10.5458 0.889317 10.9009 1.27169 11.1617L8.36072 16.0088C8.70859 16.3164 9.14684 16.4847 9.5994 16.4847C10.0519 16.4847 10.4902 16.3164 10.8381 16.0088L17.9271 11.1617C18.3096 10.901 18.6271 10.5459 18.8526 10.1267C19.0482 10.4888 19.1647 10.8931 19.1936 11.3095C19.2236 11.827 19.1218 12.3436 18.899 12.8048C18.6761 13.2661 18.3404 13.655 17.9271 13.9306L10.8381 18.7777C10.4556 19.0228 10.0238 19.1675 9.57827 19.2Z" fill="#2C438D"/>
    <path d="M9.59957 11.9468C9.30284 11.9335 9.0123 11.8523 8.74785 11.7087C8.61324 11.6402 8.4838 11.5608 8.3607 11.4712L1.27201 6.62416C0.858684 6.34847 0.522923 5.95946 0.300053 5.49815C0.077184 5.03683 -0.0245596 4.52027 0.0055343 4.0027C0.0485734 3.47872 0.223177 2.97662 0.511102 2.54877C0.799026 2.12093 1.18972 1.78299 1.64244 1.5703L4.17873 0.334242C4.58544 0.137839 5.027 0.0362453 5.47374 0.0361774C6.0401 0.0344141 6.59596 0.198505 7.08029 0.51045L9.57859 2.132L12.0062 0.500446C12.4992 0.171296 13.07 -0.00225554 13.6522 2.21341e-05C14.0987 0.000122264 14.5401 0.101795 14.9466 0.298165L17.5579 1.56998C18.0106 1.78265 18.4014 2.12053 18.6893 2.54838C18.9772 2.97623 19.1518 3.47839 19.1948 4.00239C19.2249 4.51996 19.1233 5.03658 18.9004 5.49791C18.6775 5.95924 18.3417 6.34821 17.9283 6.62384L10.8393 11.4705C10.7163 11.5605 10.5869 11.64 10.4522 11.7083C10.1875 11.8522 9.89662 11.9336 9.59957 11.9468ZM5.65562 2.27717C5.54402 2.27683 5.43364 2.30192 5.33193 2.35075L2.9074 3.53166C2.82096 3.56745 2.74529 3.62745 2.68845 3.70535C2.63161 3.78325 2.59572 3.87609 2.58463 3.97395C2.58122 4.06581 2.60169 4.15689 2.64379 4.2372C2.68589 4.31751 2.748 4.38397 2.82329 4.42924L9.59927 9.062L16.3752 4.42924C16.4506 4.38401 16.5127 4.31759 16.5549 4.23728C16.5971 4.15697 16.6175 4.06584 16.6142 3.97395C16.603 3.8761 16.5671 3.78332 16.5103 3.70543C16.4535 3.62753 16.3778 3.56748 16.2914 3.53166L13.7964 2.31624C13.6947 2.26747 13.5843 2.24247 13.4728 2.24299C13.3304 2.24172 13.1907 2.28291 13.0692 2.36177L9.9955 4.42664C9.87519 4.50347 9.73767 4.54458 9.59731 4.54566C9.45694 4.54674 9.3189 4.50776 9.19756 4.43279L6.05003 2.3895C5.93044 2.31524 5.79413 2.27688 5.65562 2.27851V2.27717Z" fill="#34BFA3"/>
    <path d="M9.57825 15.7123C9.285 15.7001 8.99782 15.6198 8.73687 15.4771C8.60558 15.4098 8.47966 15.3312 8.36036 15.2422L1.27167 10.3948C0.858299 10.1192 0.522479 9.73039 0.299601 9.26911C0.0767219 8.80783 -0.0249764 8.2912 0.00519279 7.77367C0.0344567 7.34986 0.154519 6.93882 0.356199 6.57188C0.581153 6.98303 0.894955 7.33136 1.27167 7.58816L8.36036 12.4352C8.70828 12.7428 9.14662 12.9113 9.59923 12.9113C10.0518 12.9113 10.4901 12.7428 10.8381 12.4352L17.9271 7.58816C18.3038 7.33136 18.6176 6.98303 18.8426 6.57188C19.0443 6.9388 19.1644 7.34985 19.1936 7.77367C19.2237 8.29114 19.1219 8.80773 18.899 9.26895C18.6762 9.73017 18.3404 10.119 17.9271 10.3945L10.8381 15.2419C10.7112 15.3306 10.5782 15.4091 10.4403 15.4767C10.1715 15.618 9.87786 15.6982 9.57825 15.7123Z" fill="#5D78FF"/>
  </svg>
);
import { Order, OrderStatus } from '../types';
import { SHOPEE_LOGO, GRAB_LOGO } from './OrderOnlineView';
import { DeliveryBikeIcon } from './DeliveryBikeIcon';

interface DeliveryViewProps {
  channel: 'Grab' | 'ShopeeFood';
  orders: Order[];
  onBackToMain: () => void;
  onNavigateToView?: (view: any) => void;
  onConfirmOrder: (orderId: string) => void;
  onCompleteOrder: (orderId: string) => void;
  onDeleteOrder?: (orderId: string, reason?: string) => void;
  activeTab?: OrderStatus;
  setActiveTab?: (tab: OrderStatus) => void;
  selectedOrderId?: string | null;
  setSelectedOrderId?: (orderId: string | null) => void;
  notifications?: any[];
  onNotificationClick?: (notif: any) => void;
  onlineUnconfirmedCount?: number;
  grabUnconfirmedCount?: number;
  shopeeUnconfirmedCount?: number;
  initialPaymentOrderCode?: string | null;
  onClearInitialPaymentOrderCode?: () => void;
  initialShowDeliveryBook?: boolean;
}

export default function DeliveryView({
  channel,
  orders,
  onBackToMain,
  onNavigateToView,
  onConfirmOrder,
  onCompleteOrder,
  onDeleteOrder,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  selectedOrderId: externalSelectedOrderId,
  setSelectedOrderId: externalSelectedOrderIdSetter,
  notifications = [],
  onNotificationClick,
  onlineUnconfirmedCount = 0,
  grabUnconfirmedCount = 0,
  shopeeUnconfirmedCount = 0,
  initialPaymentOrderCode,
  onClearInitialPaymentOrderCode,
  initialShowDeliveryBook = false
}: DeliveryViewProps) {
  const displayGrabUnconfirmed = useMemo(() => {
    const countFromOrders = orders.filter((o) => o.channel === 'Grab' && o.status === 'unconfirmed').length;
    return Math.max(grabUnconfirmedCount, countFromOrders);
  }, [grabUnconfirmedCount, orders]);

  const displayShopeeUnconfirmed = useMemo(() => {
    const countFromOrders = orders.filter((o) => o.channel === 'ShopeeFood' && o.status === 'unconfirmed').length;
    return Math.max(shopeeUnconfirmedCount, countFromOrders);
  }, [shopeeUnconfirmedCount, orders]);
  const [localActiveTab, setLocalActiveTab] = useState<OrderStatus>('unconfirmed');
  const [localSelectedOrderId, setLocalSelectedOrderId] = useState<string | null>(null);

  const activeTab = externalActiveTab !== undefined ? externalActiveTab : localActiveTab;
  const setActiveTab = (tab: OrderStatus) => {
    if (externalSetActiveTab) {
      externalSetActiveTab(tab);
    } else {
      setLocalActiveTab(tab);
    }
  };

  const selectedOrderId = externalSelectedOrderId !== undefined ? externalSelectedOrderId : localSelectedOrderId;
  const setSelectedOrderId = (id: string | null) => {
    if (externalSelectedOrderIdSetter) {
      externalSelectedOrderIdSetter(id);
    } else {
      setLocalSelectedOrderId(id);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showPrintReceipt, setShowPrintReceipt] = useState(false);
  const [shippedOrderIds, setShippedOrderIds] = useState<string[]>([]);
  const [notifiedDriverOrderIds, setNotifiedDriverOrderIds] = useState<string[]>([]);
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [collectMoneyOrderData, setCollectMoneyOrderData] = useState<{
    id: string;
    code: string;
    customerName: string;
    totalPrice: number;
    isBookRow?: boolean;
  } | null>(null);
  const [collectPaymentMethod, setCollectPaymentMethod] = useState<string>('Chuyển khoản');
  const [collectAccount, setCollectAccount] = useState<string>('BIDV - 01256598');

  // Sổ giao hàng state
  const [showDeliveryBook, setShowDeliveryBook] = useState<boolean>(initialShowDeliveryBook);
  const [deliveryBookPartnerTab, setDeliveryBookPartnerTab] = useState<'all' | 'ahamove' | 'shopeefood'>('shopeefood');
  const [deliveryBookFromDate, setDeliveryBookFromDate] = useState('06/01/2021');
  const [deliveryBookToDate, setDeliveryBookToDate] = useState('06/01/2021');
  const [deliveryBookStatusFilter, setDeliveryBookStatusFilter] = useState<string>('all');
  const [deliveryBookShopeeStatusFilter, setDeliveryBookShopeeStatusFilter] = useState<string>('all');
  const [deliveryBookPartnerFilter, setDeliveryBookPartnerFilter] = useState<string>('ShopeeFood');
  const [deliveryBookSearchQuery, setDeliveryBookSearchQuery] = useState('');
  const [paidRowIds, setPaidRowIds] = useState<Record<string, boolean>>({ 'row-1': true });
  const [bookRowStatuses, setBookRowStatuses] = useState<Record<string, string>>({ 'row-1': 'delivered' });
  const [selectedDeliveryBookRowId, setSelectedDeliveryBookRowId] = useState<string>('row-1');

  useEffect(() => {
    if (initialShowDeliveryBook) {
      setShowDeliveryBook(true);
    }
  }, [initialShowDeliveryBook]);

  useEffect(() => {
    if (initialPaymentOrderCode) {
      let found = orders.find(o => o.code === initialPaymentOrderCode || o.id === initialPaymentOrderCode);
      if (!found) {
        found = {
          id: `ord-${initialPaymentOrderCode}`,
          code: initialPaymentOrderCode,
          channel: channel || 'ShopeeFood',
          itemsCount: 2,
          totalPrice: 100000,
          orderTime: '06/01/2021 10:39',
          status: 'confirmed',
          customerPhone: '01256.862.536',
          customerName: 'A. Tuấn',
          deliveryAddress: '22 Bis Nguyễn Thị Minh Khai, Đa Kao, Quận 1',
          driverName: 'Minh Ngọc',
          driverPhone: '0912 345 678',
          driverPlate: '29A-12345',
          driverStatus: 'Đang giao hàng',
          note: 'Vui lòng dùng lạnh / Giao hàng khách',
          items: [
            { id: 'item-1', name: 'Ngô chiên', originalPrice: 25000, qty: 1, totalPrice: 25000 },
            { id: 'item-2', name: 'Mỳ tôm xào bò', originalPrice: 75000, qty: 1, totalPrice: 75000 }
          ]
        };
      }
      setPaymentOrder(found);
      setApplyVatReduction(false);
      setRequestGtgtInvoice(false);
      setSelectedPromos([]);
      setSearchPromoQuery('');
      if (onClearInitialPaymentOrderCode) {
        onClearInitialPaymentOrderCode();
      }
    }
  }, [initialPaymentOrderCode, orders, channel, onClearInitialPaymentOrderCode]);
  const [applyVatReduction, setApplyVatReduction] = useState(false);
  const [requestGtgtInvoice, setRequestGtgtInvoice] = useState(false);
  const [selectedPromos, setSelectedPromos] = useState<string[]>([]);
  const [highlightedPromoIndex, setHighlightedPromoIndex] = useState<number>(0);
  const [searchPromoQuery, setSearchPromoQuery] = useState('');
  const [showPaymentCollectModal, setShowPaymentCollectModal] = useState(false);
  const [enteredCustomerPayment, setEnteredCustomerPayment] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card'>('cash');
  const [printBillAfterCheck, setPrintBillAfterCheck] = useState(true);
  const [openDrawerAfterCheck, setOpenDrawerAfterCheck] = useState(true);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showReceiptDropdown, setShowReceiptDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Custom reject/cancel states and kitchen printing overlay simulation
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReasonType, setRejectReasonType] = useState<string>('Hết món ăn');
  const [rejectReasonCustom, setRejectReasonCustom] = useState<string>('');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState<string>('');

  const [showKitchenPrintOverlay, setShowKitchenPrintOverlay] = useState(false);
  const [kitchenPrintOrder, setKitchenPrintOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [showDeliveryPrintOverlay, setShowDeliveryPrintOverlay] = useState(false);
  const [deliveryPrintOrder, setDeliveryPrintOrder] = useState<Order | null>(null);

  // Filter orders by active status & channel (completed tab includes both completed and cancelled)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const isChannelMatch = order.channel === channel;
      if (!isChannelMatch) return false;

      // Hide order if it has been shipped/processed via 'Thông báo tài xế' when in active tabs
      if (shippedOrderIds.includes(order.id) && activeTab !== 'completed') {
        return false;
      }

      let isStatusMatch = false;
      if (activeTab === 'completed') {
        isStatusMatch = order.status === 'completed' || order.status === 'cancelled' || shippedOrderIds.includes(order.id);
      } else {
        isStatusMatch = order.status === activeTab;
      }

      if (!isStatusMatch) return false;

      const query = searchQuery.toLowerCase();
      return (
        order.code.toLowerCase().includes(query) ||
        (order.customerPhone || '').includes(searchQuery) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    });
  }, [orders, channel, activeTab, searchQuery, shippedOrderIds]);

  // Synchronize selection: Mặc định chọn hiển thị bản ghi đầu tiên
  useEffect(() => {
    if (filteredOrders.length > 0) {
      const found = filteredOrders.find((o) => o.id === selectedOrderId);
      if (!found) {
        setSelectedOrderId(filteredOrders[0].id);
      }
    } else {
      setSelectedOrderId(null);
    }
  }, [activeTab, channel, filteredOrders.length]);

  // Handle selected order selection safely
  const selectedOrder = useMemo(() => {
    if (filteredOrders.length === 0) return null;
    const found = filteredOrders.find((o) => o.id === selectedOrderId);
    return found || filteredOrders[0];
  }, [filteredOrders, selectedOrderId]);

  // Resolve breakdown helper
  const getOrderBreakdown = (order: Order) => {
    const itemsSum = order.items.reduce((acc, item) => acc + item.totalPrice, 0);

    // If already specified in order, use that
    let subtotalDiscounted = order.subtotalDiscounted;
    let billDiscount = order.billDiscount;
    let deliveryFee = order.deliveryFee;
    let platformFee = order.platformFee;
    let driverTip = order.driverTip;

    if (
      subtotalDiscounted !== undefined &&
      billDiscount !== undefined &&
      deliveryFee !== undefined &&
      platformFee !== undefined &&
      driverTip !== undefined
    ) {
      return {
        subtotalDiscounted,
        billDiscount,
        deliveryFee,
        platformFee,
        driverTip
      };
    }

    // Dynamic deterministic generation based on order code/id and totalPrice
    // Case GF-720 (Matches Image 2 exactly)
    if (order.code === 'GF-720') {
      return {
        subtotalDiscounted: 390000,
        billDiscount: 20000,
        deliveryFee: 30000,
        platformFee: 5000,
        driverTip: 5000
      };
    }

    // Case GF-256
    if (order.code === 'GF-256') {
      return {
        subtotalDiscounted: 240000,
        billDiscount: 15000,
        deliveryFee: 25000,
        platformFee: 5000,
        driverTip: 5000
      };
    }

    // General adaptive solver
    deliveryFee = 25000;
    platformFee = 4000;
    
    if (order.totalPrice <= 50000) {
      deliveryFee = 15000;
      platformFee = 1000;
      driverTip = 0;
      subtotalDiscounted = itemsSum;
      billDiscount = Math.max(0, subtotalDiscounted + deliveryFee + platformFee - order.totalPrice);
      if (subtotalDiscounted - billDiscount < 0) {
        subtotalDiscounted = order.totalPrice;
        deliveryFee = 0;
        platformFee = 0;
        billDiscount = 0;
      }
    } else {
      driverTip = order.totalPrice > 400000 ? 5000 : 2000;
      const estimatedDishDiscount = Math.round((itemsSum * 0.08) / 1000) * 1000;
      subtotalDiscounted = itemsSum - estimatedDishDiscount;
      
      billDiscount = subtotalDiscounted + deliveryFee + platformFee + driverTip - order.totalPrice;
      
      if (billDiscount < 0) {
        subtotalDiscounted = order.totalPrice - deliveryFee - platformFee - driverTip;
        billDiscount = 0;
        if (subtotalDiscounted < 0) {
          subtotalDiscounted = order.totalPrice;
          deliveryFee = 0;
          platformFee = 0;
          driverTip = 0;
        }
      }
    }

    return {
      subtotalDiscounted,
      billDiscount,
      deliveryFee,
      platformFee,
      driverTip
    };
  };

  const breakdown = useMemo(() => {
    if (!selectedOrder) return {
      subtotalDiscounted: 0,
      billDiscount: 0,
      deliveryFee: 0,
      platformFee: 0,
      driverTip: 0
    };
    return getOrderBreakdown(selectedOrder);
  }, [selectedOrder]);

  // Format currency in Vietnamese format (e.g. 410.000,00)
  const formatVND = (num: number) => {
    return num.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const renderCollectMoneyModal = () => {
    if (!collectMoneyOrderData) return null;
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] font-sans text-xs select-none text-left">
        <div className="w-[520px] max-w-full bg-white shadow-2xl border border-gray-300 flex flex-col overflow-hidden animate-in fade-in duration-150">
          {/* Header Bar - Blue */}
          <div className="h-10 bg-[#0073B9] text-white px-3.5 flex items-center justify-between shrink-0">
            <span className="font-bold text-sm text-white">Thu tiền khách hàng</span>
            <button 
              type="button" 
              onClick={() => setCollectMoneyOrderData(null)} 
              className="text-white hover:opacity-80 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Form */}
          <div className="p-5 sm:p-6 flex flex-col gap-3 text-gray-800 text-xs sm:text-sm bg-white">
            {/* Field 1: Khách hàng */}
            <div className="flex items-center gap-3">
              <label className="w-[180px] shrink-0 text-gray-800 font-normal">
                Khách hàng
              </label>
              <input 
                type="text" 
                readOnly 
                value={collectMoneyOrderData.customerName || ''} 
                className="flex-1 bg-[#E8EEF5] border border-gray-300 px-3 py-1.5 text-gray-800 rounded-none cursor-not-allowed font-medium"
              />
            </div>

            {/* Field 2: Tổng tiền / Thực nhận */}
            <div className="flex items-center gap-3">
              <label className="w-[180px] shrink-0 text-gray-800 font-normal">
                {channel === 'ShopeeFood' || (collectMoneyOrderData.isBookRow && deliveryBookPartnerTab === 'shopeefood') ? 'Thực nhận' : 'Tổng tiền'}
              </label>
              <input 
                type="text" 
                readOnly 
                value={collectMoneyOrderData.totalPrice ? collectMoneyOrderData.totalPrice.toLocaleString('vi-VN') : '0'} 
                className="flex-1 bg-[#E8EEF5] border border-gray-300 px-3 py-1.5 text-right font-mono font-bold text-gray-900 rounded-none cursor-not-allowed"
              />
            </div>

            {/* Field 3: Tiền đặt cọc, Voucher, chiết khấu ĐTGH... */}
            <div className="flex items-center gap-3">
              <label className="w-[180px] shrink-0 text-gray-800 font-normal leading-tight">
                Tiền đặt cọc, Voucher, chiết khấu ĐTGH...
              </label>
              <input 
                type="text" 
                readOnly 
                value="0" 
                className="flex-1 bg-[#E8EEF5] border border-gray-300 px-3 py-1.5 text-right font-mono text-gray-800 rounded-none cursor-not-allowed"
              />
            </div>

            {/* Field 4: Còn phải thu */}
            <div className="flex items-center gap-3">
              <label className="w-[180px] shrink-0 text-gray-800 font-normal">
                Còn phải thu
              </label>
              <input 
                type="text" 
                readOnly 
                value={collectMoneyOrderData.totalPrice ? collectMoneyOrderData.totalPrice.toLocaleString('vi-VN') : '0'} 
                className="flex-1 bg-[#E8EEF5] border border-gray-300 px-3 py-1.5 text-right font-mono font-bold text-gray-900 rounded-none cursor-not-allowed"
              />
            </div>

            {/* Radio option */}
            <div className="flex items-center gap-3 my-1">
              <div className="w-[180px] shrink-0"></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked 
                  readOnly 
                  className="w-4 h-4 text-[#0073B9] focus:ring-0 cursor-pointer" 
                />
                <span className="font-normal text-gray-800">Thu tiền</span>
              </label>
            </div>

            {/* Field 5: Hình thức thanh toán */}
            <div className="flex items-center gap-3">
              <label className="w-[180px] shrink-0 text-gray-800 font-normal">
                Hình thức thanh toán
              </label>
              <div className="relative flex-1">
                <select 
                  value={collectPaymentMethod}
                  onChange={(e) => setCollectPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-gray-300 px-3 py-1.5 pr-8 text-gray-800 focus:outline-none focus:border-[#0073B9] rounded-none appearance-none cursor-pointer"
                >
                  <option value="Chuyển khoản">Chuyển khoản</option>
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Thẻ ATM / Visa">Thẻ ATM / Visa</option>
                  <option value="Ví điện tử">Ví điện tử</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Field 6: Tài khoản thu */}
            <div className="flex items-center gap-3">
              <label className="w-[180px] shrink-0 text-gray-800 font-normal">
                Tài khoản thu
              </label>
              <div className="relative flex-1">
                <select 
                  value={collectAccount}
                  onChange={(e) => setCollectAccount(e.target.value)}
                  className="w-full bg-white border border-gray-300 px-3 py-1.5 pr-8 text-gray-800 focus:outline-none focus:border-[#0073B9] rounded-none appearance-none cursor-pointer"
                >
                  <option value="BIDV - 01256598">BIDV - 01256598</option>
                  <option value="Vietcombank - 0987654321">Vietcombank - 0987654321</option>
                  <option value="Techcombank - 1902847192">Techcombank - 1902847192</option>
                  <option value="Tiền mặt tại quỹ">Tiền mặt tại quỹ</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-[#EFEFEF] p-3 px-4 flex items-center justify-end gap-3 border-t border-gray-200 shrink-0">
            <button 
              type="button"
              onClick={() => {
                const mainId = collectMoneyOrderData.id;
                const bookId = mainId.startsWith('book-') ? mainId : `book-${mainId}`;
                const rawId = mainId.startsWith('book-') ? mainId.replace('book-', '') : mainId;

                if (onCompleteOrder && rawId) {
                  onCompleteOrder(rawId);
                }
                setPaidRowIds(prev => ({ 
                  ...prev, 
                  [mainId]: true, 
                  [bookId]: true,
                  [rawId]: true 
                }));
                setBookRowStatuses(prev => ({ 
                  ...prev, 
                  [mainId]: 'delivered', 
                  [bookId]: 'delivered',
                  [rawId]: 'delivered' 
                }));
                
                setShowDeliveryBook(true);
                setDeliveryBookPartnerTab('shopeefood');
                setActiveTab('completed');
                setSelectedOrderId(collectMoneyOrderData.id);
                if (paymentOrder) {
                  if (onNavigateToView) {
                    if (paymentOrder.channel === 'ShopeeFood') {
                      onNavigateToView('shopeefood');
                    } else if (paymentOrder.channel === 'Grab') {
                      onNavigateToView('grab');
                    }
                  }
                  setPaymentOrder(null);
                }
                
                setToastMessage(`Đã thu tiền cho đơn hàng ${collectMoneyOrderData.code}`);
                setTimeout(() => {
                  setToastMessage(null);
                }, 2500);
                setCollectMoneyOrderData(null);
              }}
              className="px-6 py-1.5 bg-[#0073B9] hover:bg-[#005a92] text-white font-bold text-xs sm:text-sm uppercase cursor-pointer rounded-none min-w-[90px] shadow-xs transition"
            >
              <span className="underline decoration-white">Đ</span>ỒNG Ý
            </button>
            <button 
              type="button"
              onClick={() => setCollectMoneyOrderData(null)}
              className="px-6 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-[#DA251C] font-bold text-xs sm:text-sm uppercase cursor-pointer rounded-none min-w-[90px] transition"
            >
              H<span className="underline decoration-[#DA251C]">Ủ</span>Y BỎ
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showDeliveryBook) {
    const staticRawBookRows = [
      {
        id: 'row-1',
        code: 'X4HL81',
        invoiceNo: '2112000010',
        customerName: '',
        partnerName: 'GF-Grabfood',
        partnerType: 'GrabFood',
        driverName: '',
        departTime: '06/01/2021 10:39',
        dueTime: '06/01/2021 10:34',
        totalPrice: 72000,
        status: 'shipping'
      },
      {
        id: 'row-2',
        code: 'GF-720',
        invoiceNo: '2112000011',
        customerName: 'A. Hùng',
        partnerName: 'GF-Grabfood',
        partnerType: 'GrabFood',
        driverName: 'Đoàn Văn Hùng',
        departTime: '06/01/2021 10:45',
        dueTime: '06/01/2021 11:15',
        totalPrice: 390000,
        status: 'shipping'
      },
      {
        id: 'row-3',
        code: 'SPF-102',
        invoiceNo: '2112000012',
        customerName: 'Chị Mai',
        partnerName: 'SF-ShopeeFood',
        partnerType: 'ShopeeFood',
        driverName: 'Lê Hoài Nam',
        departTime: '06/01/2021 11:00',
        dueTime: '06/01/2021 11:30',
        totalPrice: 185000,
        status: 'shipping',
        shopeeFoodStatus: 'Đang giao hàng'
      },
      {
        id: 'row-4',
        code: 'AH-882',
        invoiceNo: '2112000013',
        customerName: 'Cty MISA',
        partnerName: 'AH-AhaMove',
        partnerType: 'AhaMove',
        driverName: 'Phạm Tuấn',
        departTime: '06/01/2021 11:15',
        dueTime: '06/01/2021 11:45',
        totalPrice: 210000,
        status: 'shipping'
      },
      {
        id: 'row-5',
        code: 'SPF-205',
        invoiceNo: '2112000014',
        customerName: 'A. Nam',
        partnerName: 'SF-ShopeeFood',
        partnerType: 'ShopeeFood',
        driverName: 'Nguyễn Đức',
        departTime: '06/01/2021 11:20',
        dueTime: '06/01/2021 11:50',
        totalPrice: 95000,
        status: 'shipping',
        shopeeFoodStatus: 'Đang đến quán'
      }
    ];

    const confirmedAppOrders = orders
      .filter((o) => o.status === 'confirmed' || o.status === 'completed')
      .map((o) => ({
        id: `book-${o.id}`,
        code: o.code,
        invoiceNo: `2112${(o.code.replace(/[^0-9]/g, '') || '100').padStart(6, '0')}`,
        customerName: o.customerPhone ? o.customerPhone : 'Khách hàng',
        partnerName: o.channel === 'ShopeeFood' ? 'SF-ShopeeFood' : 'GF-Grabfood',
        partnerType: o.channel === 'ShopeeFood' ? 'ShopeeFood' : 'GrabFood',
        driverName: o.driverName ? o.driverName.split('(')[0].trim() : (o.channel === 'ShopeeFood' ? 'Tài xế ShopeeFood' : 'Tài xế Grab'),
        departTime: o.orderTime,
        dueTime: o.orderTime,
        totalPrice: o.totalPrice,
        status: o.status === 'completed' ? 'delivered' : 'shipping',
        shopeeFoodStatus: o.driverStatus || (o.status === 'completed' ? 'Giao hàng hoàn tất' : 'Đang giao hàng')
      }));

    const existingCodes = new Set(staticRawBookRows.map((r) => r.code));
    const dynamicBookRows = confirmedAppOrders.filter((r) => !existingCodes.has(r.code));

    const rawBookRows = [...dynamicBookRows, ...staticRawBookRows];

    const deliveryBookRows = rawBookRows.map(r => ({
      ...r,
      status: bookRowStatuses[r.id] || r.status
    }));

    const filteredBookRows = deliveryBookRows.filter(row => {
      // Sub-header partner tab filter
      if (deliveryBookPartnerTab === 'ahamove' && row.partnerType !== 'AhaMove') return false;
      if (deliveryBookPartnerTab === 'shopeefood' && row.partnerType !== 'ShopeeFood') return false;

      // Dropdown partner filter
      if (deliveryBookPartnerFilter !== 'all' && row.partnerType !== deliveryBookPartnerFilter) return false;

      // Dropdown status filter
      if (deliveryBookStatusFilter === 'shipping') {
        if (row.status !== 'shipping' && !paidRowIds[row.id]) return false;
      } else if (deliveryBookStatusFilter !== 'all' && row.status !== deliveryBookStatusFilter) {
        return false;
      }

      // ShopeeFood Status Filter
      if (deliveryBookPartnerTab === 'shopeefood' && deliveryBookShopeeStatusFilter !== 'all') {
        const shopeeStatus = (row.shopeeFoodStatus || '').toLowerCase();
        const filterVal = deliveryBookShopeeStatusFilter.toLowerCase();
        
        if (filterVal === 'đang đến quán') {
          if (!shopeeStatus.includes('đến quán') && !shopeeStatus.includes('cửa hàng') && !shopeeStatus.includes('chờ lấy') && !shopeeStatus.includes('nhận đơn')) {
            return false;
          }
        } else if (filterVal === 'đang giao hàng') {
          if (!shopeeStatus.includes('giao hàng') && !shopeeStatus.includes('di chuyển') && !shopeeStatus.includes('đang giao')) {
            return false;
          }
        } else if (filterVal === 'giao hàng hoàn tất') {
          if (!shopeeStatus.includes('hoàn tất') && !shopeeStatus.includes('hoàn thành') && !shopeeStatus.includes('đã giao')) {
            return false;
          }
        } else if (filterVal === 'đã hủy') {
          if (!shopeeStatus.includes('hủy')) {
            return false;
          }
        } else {
          if (!shopeeStatus.includes(filterVal)) return false;
        }
      }

      // Search query
      if (deliveryBookSearchQuery) {
        const q = deliveryBookSearchQuery.toLowerCase();
        const matchCode = row.code.toLowerCase().includes(q);
        const matchInv = row.invoiceNo.toLowerCase().includes(q);
        const matchCust = row.customerName.toLowerCase().includes(q);
        const matchDriver = row.driverName.toLowerCase().includes(q);
        if (!matchCode && !matchInv && !matchCust && !matchDriver) return false;
      }

      return true;
    });

    const totalSum = filteredBookRows.reduce((sum, r) => sum + r.totalPrice, 0);

    return (
      <div className="flex flex-col h-full bg-white text-[13px] font-sans select-none text-left">
        {/* Top Header copied from existing screens */}
        <header id="delivery-book-header" className="bg-[#0973B9] h-11 text-white flex items-center justify-between px-2 shrink-0 border-b border-[#00497D] font-medium">
          <div className="flex items-center h-full">
            {/* Home Icon */}
            <button 
              onClick={() => {
                setShowDeliveryBook(false);
                onBackToMain();
              }}
              className="hover:bg-[#00497D] h-full px-3 flex items-center transition cursor-pointer"
              title="Quay lại trang chính"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
            
            {/* Active Tab: Order */}
            <button 
              onClick={() => setShowDeliveryBook(false)}
              className="bg-white text-[#0973B9] h-full flex items-center px-4 font-bold text-sm gap-1.5 shadow-sm rounded-t-lg cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#0973B9]" />
              <span className="font-extrabold text-[#0973B9]">Order</span>
            </button>

            {/* Tab: Sơ đồ */}
            <button 
              onClick={() => {
                setShowDeliveryBook(false);
                onBackToMain();
              }}
              className="hover:bg-[#00497D] h-full px-4 flex items-center text-white/90 text-sm transition cursor-pointer"
            >
              <span>Sơ đồ</span>
            </button>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center h-full gap-1 sm:gap-1.5">
            <button className="flex items-center gap-1 bg-transparent hover:bg-white/10 px-2.5 h-8 rounded text-white font-bold text-xs transition uppercase shrink-0">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="tracking-wider">ORDER</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/90 -ml-0.5" />
            </button>

            <div className="relative h-full">
              <button 
                onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
                className={`h-full px-2 sm:px-2.5 flex items-center hover:bg-[#00497D] transition ${headerMenuOpen ? 'bg-[#00497D]' : ''}`}
                title="Danh sách chức năng"
              >
                <Menu className="w-5 h-5" />
              </button>
              <HeaderMenuDropdown 
                isOpen={headerMenuOpen} 
                onClose={() => setHeaderMenuOpen(false)} 
                onNavigateView={(v) => {
                  if (v === 'deliveryBook') {
                    setShowDeliveryBook(true);
                  } else if (onNavigateToView) {
                    onNavigateToView(v);
                  }
                }}
              />
            </div>

            <button className="hover:bg-[#00497D] p-2 rounded transition" title="MISA CUKCUK">
              <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
            <button className="hover:bg-[#00497D] p-2 rounded transition" title="Đồng bộ đám mây">
              <CloudDownload className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
            <button className="hover:bg-[#00497D] p-2 rounded transition" title="Đồng bộ dữ liệu">
              <ArrowLeftRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
            <button className="hover:bg-[#00497D] p-2 rounded transition relative" title="Hóa đơn">
              <div className="relative">
                <InvoiceIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                {onlineUnconfirmedCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#DA251C] text-white font-black text-[9px] w-3.5 h-3.5 rounded-sm flex items-center justify-center leading-none border border-white/20 select-none">
                    i
                  </span>
                )}
              </div>
            </button>
            <button className="hover:bg-[#00497D] p-2 rounded transition" title="Tổng đài">
              <Phone className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
            <button className="hover:bg-[#00497D] p-2 rounded transition" title="Tài khoản">
              <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>

        {/* 2. Secondary Sub-Header Tabs */}
        <div className="bg-[#eef2f5] border-b border-gray-300 px-2 pt-1 flex items-center gap-1 shrink-0 font-sans text-[13px]">
          {/* Tab 1: Đối tác giao hàng */}
          <button
            onClick={() => {
              setDeliveryBookPartnerTab('all');
              setDeliveryBookPartnerFilter('all');
            }}
            className={`px-4 py-1.5 font-bold transition cursor-pointer border-t border-x rounded-t ${
              deliveryBookPartnerTab === 'all'
                ? 'bg-[#00507D] text-white border-[#003c5f] shadow-sm'
                : 'bg-[#e5e9ec] hover:bg-gray-200 text-gray-800 border-gray-300'
            }`}
          >
            Đối tác giao hàng
          </button>

          {/* Tab 2: Đối tác AhaMove */}
          <button
            onClick={() => {
              setDeliveryBookPartnerTab('ahamove');
              setDeliveryBookPartnerFilter('AhaMove');
            }}
            className={`px-4 py-1.5 font-bold transition cursor-pointer border-t border-x rounded-t ${
              deliveryBookPartnerTab === 'ahamove'
                ? 'bg-[#00507D] text-white border-[#003c5f] shadow-sm'
                : 'bg-[#e5e9ec] hover:bg-gray-200 text-gray-800 border-gray-300'
            }`}
          >
            Đối tác AhaMove
          </button>

          {/* Tab 3: Đối tác ShopeeFood (Added as requested) */}
          <button
            onClick={() => {
              setDeliveryBookPartnerTab('shopeefood');
              setDeliveryBookPartnerFilter('ShopeeFood');
            }}
            className={`px-4 py-1.5 font-bold transition cursor-pointer border-t border-x rounded-t ${
              deliveryBookPartnerTab === 'shopeefood'
                ? 'bg-[#00507D] text-white border-[#003c5f] shadow-sm'
                : 'bg-[#e5e9ec] hover:bg-gray-200 text-gray-800 border-gray-300'
            }`}
          >
            Đối tác ShopeeFood
          </button>
        </div>

        {/* 3. Filter Bar */}
        <div className="bg-white border-b border-gray-300 px-3 py-1.5 flex flex-wrap items-center gap-2.5 text-[13px] font-sans shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-700">Từ ngày</span>
            <div className="relative flex items-center border border-gray-300 rounded px-2 py-1 bg-white">
              <input 
                type="text" 
                value={deliveryBookFromDate} 
                onChange={(e) => setDeliveryBookFromDate(e.target.value)}
                className="w-[85px] outline-none text-gray-800 text-[13px]" 
              />
              <Calendar className="w-3.5 h-3.5 text-gray-500 ml-1" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-700">Đến ngày</span>
            <div className="relative flex items-center border border-gray-300 rounded px-2 py-1 bg-white">
              <input 
                type="text" 
                value={deliveryBookToDate} 
                onChange={(e) => setDeliveryBookToDate(e.target.value)}
                className="w-[85px] outline-none text-gray-800 text-[13px]" 
              />
              <Calendar className="w-3.5 h-3.5 text-gray-500 ml-1" />
            </div>
          </div>

          {/* Dropdown status */}
          <select 
            value={deliveryBookStatusFilter} 
            onChange={(e) => setDeliveryBookStatusFilter(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-[13px] rounded focus:outline-none bg-white text-gray-800 cursor-pointer"
          >
            <option value="shipping">Đang giao hàng</option>
            <option value="delivered">Đã giao hàng</option>
            <option value="cancelled">Đã hủy</option>
            <option value="all">Tất cả trạng thái</option>
          </select>

          {/* ShopeeFood status dropdown filter */}
          {deliveryBookPartnerTab === 'shopeefood' && (
            <select 
              value={deliveryBookShopeeStatusFilter} 
              onChange={(e) => setDeliveryBookShopeeStatusFilter(e.target.value)}
              className="border border-gray-300 px-2 py-1 text-[13px] rounded focus:outline-none bg-white text-gray-800 cursor-pointer font-sans"
            >
              <option value="all">Tất cả Trạng thái ShopeeFood</option>
              <option value="Đang đến quán">Đang đến quán</option>
              <option value="Đang giao hàng">Đang giao hàng</option>
              <option value="Giao hàng hoàn tất">Giao hàng hoàn tất</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          )}

          {/* Dropdown partner */}
          {deliveryBookPartnerTab !== 'shopeefood' && (
            <select 
              value={deliveryBookPartnerFilter} 
              onChange={(e) => setDeliveryBookPartnerFilter(e.target.value)}
              className="border border-gray-300 px-2 py-1 text-[13px] rounded focus:outline-none bg-white text-gray-800 cursor-pointer"
            >
              <option value="all">Tất cả ĐTGH</option>
              <option value="GrabFood">GrabFood</option>
              <option value="ShopeeFood">ShopeeFood</option>
              <option value="AhaMove">AhaMove</option>
            </select>
          )}

          {/* Search Input */}
          <div className="flex-1 flex items-center border border-gray-300 rounded overflow-hidden min-w-[280px]">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo số hóa đơn, khách hàng, người giao hàng ..." 
              value={deliveryBookSearchQuery}
              onChange={(e) => setDeliveryBookSearchQuery(e.target.value)}
              className="flex-1 px-2.5 py-1 text-[13px] outline-none text-gray-800 placeholder-gray-400"
            />
            <button className="px-2.5 py-1 bg-gray-50 border-l border-gray-300 hover:bg-gray-100 text-gray-600 transition cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. Table Area */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-left border-collapse text-[13px] font-sans">
            <thead>
              <tr className="bg-[#eef2f5] border-b border-gray-300 text-gray-900 font-bold h-8">
                <th className={`px-2 py-1 border-r border-gray-300 min-w-[95px] ${deliveryBookPartnerTab === 'shopeefood' ? 'text-left pl-3' : 'text-center'}`}></th>
                <th className="px-3 py-1 border-r border-gray-300 min-w-[170px] text-center">Order/Hóa đơn</th>
                {deliveryBookPartnerTab === 'shopeefood' && (
                  <th className="px-3 py-1 border-r border-gray-300 min-w-[155px]">Trạng thái ShopeeFood</th>
                )}
                <th className="px-3 py-1 border-r border-gray-300 min-w-[150px]">Tên khách hàng</th>
                {deliveryBookPartnerTab !== 'shopeefood' && (
                  <th className="px-3 py-1 border-r border-gray-300 min-w-[140px]">Đối tác giao hàng</th>
                )}
                <th className="px-3 py-1 border-r border-gray-300 min-w-[120px]">Người giao</th>
                <th className="px-3 py-1 border-r border-gray-300 min-w-[130px]">Giờ đi giao</th>
                <th className="px-3 py-1 border-r border-gray-300 min-w-[130px]">Giờ hẹn trả</th>
                <th className="px-3 py-1 text-right min-w-[110px]">
                  {channel === 'ShopeeFood' || deliveryBookPartnerTab === 'shopeefood' ? 'Thực nhận' : 'Tổng tiền'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookRows.map((row) => {
                const isSelected = selectedDeliveryBookRowId === row.id;
                const isPaid = paidRowIds[row.id];
                const rawId = row.id.startsWith('book-') ? row.id.replace('book-', '') : row.id;
                const isNeedShip = row.partnerType === 'ShopeeFood' && row.id.startsWith('book-') && !shippedOrderIds.includes(rawId);

                return (
                  <tr 
                    key={row.id}
                    onClick={() => setSelectedDeliveryBookRowId(row.id)}
                    className={`border-b border-gray-200 h-10 transition cursor-pointer ${
                      isSelected ? 'bg-[#b0d5ed] font-medium' : 'hover:bg-sky-50 bg-white'
                    }`}
                  >
                    {/* Separate Thu tiền column (No header name) */}
                    <td className={`px-2 py-1 border-r border-gray-200 ${deliveryBookPartnerTab === 'shopeefood' ? 'text-left pl-3' : 'text-center'}`}>
                      {isPaid ? (
                        deliveryBookPartnerTab === 'shopeefood' ? (
                          <div className="text-[12px] font-bold text-green-600 flex items-center gap-1 h-6">
                            <span className="font-extrabold text-[14px]">✓</span>
                            <span>Đã thanh toán</span>
                          </div>
                        ) : (
                          <button
                            disabled
                            className="px-2 py-0.5 rounded text-[11px] font-bold shadow-xs transition flex items-center justify-center gap-1 mx-auto bg-[#28a745] text-white cursor-default opacity-95"
                          >
                            <span className="w-3 h-3 border border-white rounded-xs flex items-center justify-center text-[9px] leading-none bg-white/20">
                              ✓
                            </span>
                            <span>Đã thanh toán</span>
                          </button>
                        )
                      ) : isNeedShip ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShippedOrderIds((prev) => [...prev, rawId]);
                          }}
                          className="px-2 py-0.5 rounded text-[11px] font-bold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 transition flex items-center justify-center gap-1 ml-0 cursor-pointer shadow-2xs h-6"
                        >
                          <Bike className="w-3.5 h-3.5 text-gray-500" />
                          <span>Giao hàng</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCollectMoneyOrderData({
                              id: row.id,
                              code: row.code,
                              customerName: row.customerName || row.partnerName,
                              totalPrice: row.totalPrice,
                              isBookRow: true
                            });
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold shadow-xs transition flex items-center justify-center gap-1 ${
                            deliveryBookPartnerTab === 'shopeefood' ? 'ml-0' : 'mx-auto'
                          } bg-[#FF8000] hover:bg-[#e67300] text-white cursor-pointer h-6`}
                        >
                          <span className="w-3 h-3 border border-white rounded-xs flex items-center justify-center text-[9px] leading-none bg-white/20 font-black">
                            $
                          </span>
                          <span>Thu tiền</span>
                        </button>
                      )}
                    </td>

                    {/* Order/Hóa đơn cell */}
                    <td className="px-3 py-1 border-r border-gray-200">
                      <div className="flex flex-col leading-tight font-mono">
                        <span className="font-bold text-gray-900">{row.code}</span>
                        <span className="text-gray-600 text-[12px]">{row.invoiceNo}</span>
                      </div>
                    </td>

                    {/* Trạng thái ShopeeFood cell */}
                    {deliveryBookPartnerTab === 'shopeefood' && (
                      <td className="px-3 py-1 border-r border-gray-200">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold inline-block border ${
                          isPaid
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : (row.shopeeFoodStatus || '').includes('hoàn tất') || (row.shopeeFoodStatus || '').includes('hoàn thành') || (row.shopeeFoodStatus || '').includes('đã giao')
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : (row.shopeeFoodStatus || '').includes('hủy')
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : (row.shopeeFoodStatus || '').includes('giao hàng') || (row.shopeeFoodStatus || '').includes('di chuyển') || (row.shopeeFoodStatus || '').includes('đang giao')
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {isPaid ? 'Giao hàng hoàn tất' : (row.shopeeFoodStatus || 'Đang chuẩn bị')}
                        </span>
                      </td>
                    )}

                    {/* Customer */}
                    <td className="px-3 py-1 border-r border-gray-200 text-gray-800">
                      {row.customerName || '-'}
                    </td>

                    {/* Partner */}
                    {deliveryBookPartnerTab !== 'shopeefood' && (
                      <td className="px-3 py-1 border-r border-gray-200 text-gray-800">
                        {row.partnerName}
                      </td>
                    )}

                    {/* Driver */}
                    <td className="px-3 py-1 border-r border-gray-200 text-gray-800">
                      {row.driverName || '-'}
                    </td>

                    {/* Depart time */}
                    <td className="px-3 py-1 border-r border-gray-200 text-gray-800 font-mono text-[12px]">
                      {row.departTime}
                    </td>

                    {/* Due time */}
                    <td className="px-3 py-1 border-r border-gray-200 text-gray-800 font-mono text-[12px]">
                      {row.dueTime}
                    </td>

                    {/* Total price */}
                    <td className="px-3 py-1 text-right font-bold text-gray-900 font-mono">
                      {row.totalPrice.toLocaleString('vi-VN')}
                    </td>
                  </tr>
                );
              })}

              {filteredBookRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500 font-medium">
                    Không tìm thấy đơn hàng giao hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Summary / Footer Bar */}
        <div className="bg-white border-t border-gray-300 px-4 py-2 flex items-center justify-end gap-6 text-[13px] font-sans shrink-0">
          <div className="font-bold text-gray-900 flex items-center gap-4">
            <span>{channel === 'ShopeeFood' || deliveryBookPartnerTab === 'shopeefood' ? 'Thực nhận:' : 'Tổng tiền:'}</span>
            <span className="text-base text-gray-900 font-extrabold font-mono">{totalSum.toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <button className="p-1 hover:bg-gray-100 rounded border border-gray-300 cursor-pointer" title="Con trỏ">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4L7 18.5V2z" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded border border-gray-300 cursor-pointer" title="Lên đầu trang">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6. System status bar at bottom */}
        <footer className="h-6 bg-[#026b97] text-sky-100 flex items-center justify-between px-3 text-[12px] shrink-0 font-medium select-none">
          <div>Cơm mẹ nấu 1 - commenau.cukcuk2.misa.local</div>
          <div className="font-mono">Tổng đài tư vấn: MISA SUPPORT | OVR | NUM</div>
          <div className="font-mono">10:39 - 06/01/2021</div>
        </footer>

        {renderCollectMoneyModal()}

        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200 border border-gray-700/50 backdrop-blur-md">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  const handlePrint = () => {
    if (!selectedOrder) return;
    const printContent = document.getElementById('thermal-receipt-printable-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank', 'width=450,height=650');
    if (!printWindow) {
      alert("Trình duyệt đã chặn cửa sổ Pop-up. Vui lòng cho phép Pop-up để tiến hành in hóa đơn.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>MISA CUKCUK - Phiếu Tạm Tính #${selectedOrder.code}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              width: 74mm; 
              margin: 0 auto; 
              padding: 12px 4px;
              color: #000;
              background: #fff;
              font-size: 11px;
              line-height: 1.35;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .title { font-size: 15px; font-weight: bold; text-transform: uppercase; margin: 8px 0 4px 0; letter-spacing: 0.5px; }
            .subtitle { font-size: 10px; margin-bottom: 10px; color: #444; }
            .divider { border-top: 1px dashed #000; margin: 6px 0; }
            .double-divider { border-top: 2px dashed #000; margin: 8px 0; }
            .dotted-divider { border-top: 1px dotted #000; margin: 6px 0; }
            
            table { width: 100%; border-collapse: collapse; }
            
            table.info-table { margin: 6px 0; }
            table.info-table td { padding: 2px 0; font-size: 11px; vertical-align: top; }
            
            table.items-table { margin: 8px 0; }
            table.items-table th { text-align: left; font-weight: bold; border-bottom: 1.5px dashed #000; padding: 4px 0; font-size: 11px; }
            table.items-table td { padding: 5px 0; vertical-align: top; font-size: 11px; border-bottom: 1px dotted #aaa; }
            
            .totals-section { margin-top: 6px; }
            .totals-row { display: flex; justify-content: space-between; padding: 2.5px 0; font-size: 11px; }
            .totals-row.bold { font-weight: bold; }
            .grand-total { font-size: 14px; font-weight: bold; padding: 6px 0; display: flex; justify-content: space-between; border-top: 1.5px dashed #000; border-bottom: 1.5px dashed #000; margin-top: 5px; margin-bottom: 5px; }
            
            .footer { margin-top: 16px; text-align: center; font-size: 9px; color: #444; line-height: 1.4; }
            .barcode-container { display: flex; justify-content: center; align-items: flex-end; height: 32px; margin: 10px 0 4px 0; gap: 1.2px; }
            .barcode-bar { background-color: #000 !important; height: 32px; display: inline-block; }
          </style>
        </head>
        <body class="select-none">
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintKitchenAndLabel = (orderToPrint?: any) => {
    const targetOrder = orderToPrint || selectedOrder;
    if (!targetOrder) return;
    
    const printWindow = window.open('', '_blank', 'width=450,height=650');
    if (!printWindow) {
      alert("Trình duyệt đã chặn cửa sổ Pop-up. Vui lòng cho phép Pop-up để tiến hành in hóa đơn.");
      return;
    }
    
    const kitchenHtml = `
      <div class="kitchen-slip">
        <div class="center">
          <div class="kitchen-title">BẾP CHẾ BIẾN (KITCHEN)</div>
          <div class="kitchen-subtitle">*** PHIẾU BÁO CUNG ỨNG - KHÔNG THANH TOÁN ***</div>
          <div class="dotted-divider"></div>
        </div>
        
        <table class="info-table">
          <tbody>
            <tr>
              <td style="width: 40%; font-weight: bold;">MÃ ĐƠN HÀNG:</td>
              <td style="width: 60%; text-align: right; font-size: 20px; font-weight: 800; color: #000;">${targetOrder.code}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Thời gian in:</td>
              <td style="text-align: right;">${new Date().toLocaleTimeString('vi-VN')} ${new Date().toLocaleDateString('vi-VN')}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Kênh giao hàng:</td>
              <td style="text-align: right; font-weight: bold;">${targetOrder.channel}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Điện thoại:</td>
              <td style="text-align: right;">${targetOrder.customerPhone || 'Không có'}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="divider"></div>
        
        <div class="section-title">DANH SÁCH MÓN CHẾ BIẾN</div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 70%; text-align: left; font-size: 11px;">Tên món dịch vụ</th>
              <th style="width: 30%; text-align: right; font-size: 11px;">SL</th>
            </tr>
          </thead>
          <tbody>
            ${targetOrder.items.map((item: any, idx: number) => `
              <tr>
                <td style="font-size: 12px; font-weight: 500; padding: 6px 0;">${idx + 1}. ${item.name}</td>
                <td style="font-size: 15px; font-weight: 800; text-align: right; color: #000;">x${item.qty}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="double-divider"></div>
        
        <div class="center font-bold" style="font-size: 12px; margin-top: 5px;">
          TỔNG SỐ LƯỢNG MÓN: ${targetOrder.items.reduce((acc: number, item: any) => acc + item.qty, 0)}
        </div>
        
        <div class="dotted-divider" style="margin-top: 15px;"></div>
        <div class="center" style="font-size: 9px; color: #666; font-style: italic; margin-top: 4px;">
          [Thiết bị MISA CUKCUK - In lúc ${new Date().toLocaleTimeString('vi-VN')}]
        </div>
      </div>
    `;

    let labelsHtml = '';

    printWindow.document.write(`
      <html>
        <head>
          <title>In Phiếu Bếp và Tem Nhãn #${targetOrder.code}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              width: 74mm; 
              margin: 0 auto; 
              padding: 10px 4px;
              color: #000;
              background: #fff;
              font-size: 11px;
              line-height: 1.35;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            
            /* Dividers */
            .divider { border-top: 1px dashed #000; margin: 6px 0; }
            .double-divider { border-top: 2px dashed #000; margin: 8px 0; }
            .dotted-divider { border-top: 1px dotted #000; margin: 6px 0; }
            
            table { width: 100%; border-collapse: collapse; }
            
            /* Kitchen slip styles */
            .kitchen-slip {
              padding: 4px;
            }
            .kitchen-title {
              font-size: 16px;
              font-weight: 900;
              letter-spacing: 0.5px;
              text-align: center;
              margin-bottom: 2px;
            }
            .kitchen-subtitle {
              font-size: 9px;
              color: #444;
              text-align: center;
              margin-bottom: 6px;
            }
            .section-title {
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              margin: 8px 0 4px 0;
              text-align: center;
              background-color: #eee !important;
              padding: 3px 0;
            }
            
            table.info-table td { padding: 3px 0; font-size: 11px; vertical-align: middle; }
            table.items-table th { text-align: left; font-weight: bold; border-bottom: 1.5px dashed #000; padding: 4px 0; font-size: 11px; }
            table.items-table td { padding: 6px 0; vertical-align: middle; border-bottom: 1px dotted #ccc; }
            
            /* Label Stamp Styles */
            .label-stamp {
              padding: 15px 4px 4px 4px;
              border: 1px dashed #bbb;
              margin-top: 15px;
              background-color: #fff;
            }
            .label-header {
              font-size: 11px;
              font-weight: bold;
              letter-spacing: 0.5px;
            }
            table.label-info-table td { padding: 2px 0; font-size: 10px; }
            .label-item-box {
              padding: 6px 0;
              text-align: center;
            }
            .item-name-large {
              font-size: 14px;
              font-weight: 800;
              margin-bottom: 4px;
              text-transform: uppercase;
            }
            .item-qty-large {
              font-size: 15px;
              font-weight: 900;
              background-color: #000 !important;
              color: #fff !important;
              padding: 3px 0;
              margin: 4px auto;
              width: 85%;
              text-align: center;
            }
            .mini-barcode-container {
              display: flex;
              justify-content: center;
              align-items: flex-end;
              height: 16px;
              margin: 4px auto 2px auto;
              gap: 1.1px;
            }
            
            /* Media breaks for seamless receipt splitting */
            @media print {
              .page-break { 
                page-break-before: always;
                break-before: page;
                height: 0;
                margin: 0;
                border: none;
              }
              .label-stamp {
                border: none;
                padding-top: 10px;
                margin-top: 0;
              }
            }
          </style>
        </head>
        <body>
          ${kitchenHtml}
          ${labelsHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintDeliverySlip = (orderToPrint?: any) => {
    const targetOrder = orderToPrint || selectedOrder;
    if (!targetOrder) return;

    const b = getOrderBreakdown(targetOrder);
    const printWindow = window.open('', '_blank', 'width=450,height=650');
    if (!printWindow) {
      alert("Trình duyệt đã chặn cửa sổ Pop-up. Vui lòng cho phép Pop-up để tiến hành in hóa đơn.");
      return;
    }

    const itemsHtml = targetOrder.items.map((item: any, idx: number) => {
      const unitPrice = item.originalPrice || Math.round(item.totalPrice / item.qty);
      return '<tr>' +
        '<td style="text-align: center;">' + (idx + 1) + '</td>' +
        '<td style="padding-left: 4px;">' + item.name + '</td>' +
        '<td style="text-align: center; font-weight: bold;">' + item.qty + '</td>' +
        '<td style="text-align: right;">' + formatVND(unitPrice) + '</td>' +
        '<td style="text-align: right; font-weight: bold;">' + formatVND(item.totalPrice) + '</td>' +
      '</tr>';
    }).join('');

    const driverTipRowHtml = b.driverTip > 0 ? 
      '<div class="totals-row"><span>Tip cho vận chuyển:</span><span>+' + formatVND(b.driverTip) + '</span></div>' : '';

    const addressRowHtml = targetOrder.deliveryAddress ? 
      '<tr><td style="font-weight: bold;">Đ/c:</td><td style="text-align: right; font-size: 10px; line-height: 1.2;">' + targetOrder.deliveryAddress + '</td></tr>' : 
      '<tr><td style="font-weight: bold;">Đ/c:</td><td style="text-align: right; font-size: 10px; line-height: 1.2;">SN 14, ngách 68/53/16, Trần Thái Tông</td></tr>';

    const driverRowHtml = targetOrder.driverName ? 
      '<tr><td style="font-weight: bold;">Giao hàng:</td><td style="text-align: right;">' + targetOrder.driverName + '</td></tr>' : 
      '<tr><td style="font-weight: bold;">Giao hàng:</td><td style="text-align: right;">Minh Ngọc</td></tr>';

    const phoneStr = targetOrder.customerPhone || '01256.862.536';
    const customerNameStr = targetOrder.customerPhone ? ('A. ' + (targetOrder.channel === 'Grab' ? 'Grab' : 'Shopee') + ' Customer') : 'A. Tuấn';

    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');

    printWindow.document.write(`
      <html>
        <head>
          <title>MISA CUKCUK - Phiếu Giao Hàng #${targetOrder.code}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              width: 74mm; 
              margin: 0 auto; 
              padding: 12px 4px;
              color: #000;
              background: #fff;
              font-size: 10px;
              line-height: 1.35;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .title { font-size: 15px; font-weight: bold; text-transform: uppercase; margin: 8px 0 2px 0; letter-spacing: 0.5px; }
            .subtitle { font-size: 10px; margin-bottom: 10px; color: #444; }
            .divider { border-top: 1px dashed #000; margin: 6px 0; }
            
            table { width: 100%; border-collapse: collapse; }
            table.info-table { margin: 6px 0; }
            table.info-table td { padding: 2.5px 0; font-size: 10px; vertical-align: top; }
            
            table.items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 10px 0; 
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
            }
            table.items-table th { 
              font-size: 10px; 
              font-weight: bold; 
              border-bottom: 1px dashed #000; 
              border-right: 1px dashed #000;
              padding: 4px 1px;
            }
            table.items-table th:last-child {
              border-right: none;
            }
            table.items-table td { 
              padding: 4.5px 2px; 
              font-size: 10px; 
              border-bottom: 1px dashed #000; 
              border-right: 1px dashed #000;
              vertical-align: top;
            }
            table.items-table td:last-child {
              border-right: none;
            }
            
            .totals-section { margin-top: 6px; }
            .totals-row { display: flex; justify-content: space-between; padding: 2.5px 0; font-size: 10px; }
            .grand-total { font-size: 13px; font-weight: bold; padding: 6px 0; display: flex; justify-content: space-between; border-top: 1.5px dashed #000; border-bottom: 1.5px dashed #000; margin-top: 5px; margin-bottom: 5px; }
            .barcode-container { display: flex; justify-content: center; align-items: flex-end; height: 32px; margin: 10px 0 4px 0; gap: 1.2px; }
            .barcode-bar { background-color: #000 !important; height: 32px; display: inline-block; }
          </style>
        </head>
        <body class="select-none">
          <div class="center" style="font-size: 9px; line-height: 1.2;">
            <div style="font-weight: bold; font-size: 9px; margin-bottom: 2px;">SĐT. 047 645 6 548</div>
            <div class="bold" style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">PHIẾU GIAO HÀNG</div>
            <div style="font-size: 10px; font-weight: bold; margin: 2px 0;">(Giao hàng)</div>
            <div style="font-size: 10px; font-weight: bold; color: #111;">Số: ${targetOrder.code}</div>
            
            <div class="divider"></div>
          </div>

          <table class="info-table">
            <tbody>
              <tr>
                <td style="width: 35%; font-weight: bold;">Số đơn:</td>
                <td style="width: 65%; text-align: right; font-weight: bold;">21</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Ngày:</td>
                <td style="text-align: right;">19/02/24 (12.00 CH - 02.15 CH)</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Bàn:</td>
                <td style="text-align: right;">401</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Phục vụ:</td>
                <td style="text-align: right;">Trương Thị Thu Hà</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Thu ngân:</td>
                <td style="text-align: right;">Hoàng Thị Hiền</td>
              </tr>
              ${driverRowHtml}
              <tr>
                <td style="font-weight: bold;">KH:</td>
                <td style="text-align: right; font-weight: bold;">${customerNameStr}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Thẻ:</td>
                <td style="text-align: right;">Vàng</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">SĐT:</td>
                <td style="text-align: right; font-weight: bold;">${phoneStr}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Hẹn giao:</td>
                <td style="text-align: right;">19/02/2024 (15.00)</td>
              </tr>
              ${addressRowHtml}
              <tr>
                <td style="font-weight: bold;">Ghi chú:</td>
                <td style="text-align: right;">Vui lòng dùng lạnh / Giao hàng khách</td>
              </tr>
            </tbody>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8%; text-align: center;">STT</th>
                <th style="width: 44%; text-align: left; padding-left: 4px;">Tên món</th>
                <th style="width: 8%; text-align: center;">SL</th>
                <th style="width: 18%; text-align: right;">ĐG</th>
                <th style="width: 22%; text-align: right;">TT</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals-section">
            <div class="totals-row">
              <span style="font-weight: bold;">Tên hàng sau thuế:</span>
              <span class="bold">${formatVND(targetOrder.items.reduce((acc: number, item: any) => acc + item.totalPrice, 0))}</span>
            </div>

            <div class="totals-row">
              <span>Khuyến mại:</span>
              <span class="bold">-${formatVND(b.billDiscount)}</span>
            </div>

            <div class="totals-row">
              <span style="font-weight: bold;">Tiền hàng sau KM:</span>
              <span class="bold">${formatVND(b.subtotalDiscounted)}</span>
            </div>

            <div class="totals-row">
              <span>Phí giao hàng:</span>
              <span>+${formatVND(b.deliveryFee)}</span>
            </div>

            <div class="totals-row">
              <span>Phí áp dụng:</span>
              <span>+${formatVND(b.platformFee)}</span>
            </div>

            ${driverTipRowHtml}

            <div class="grand-total">
              <span>THÀNH TIỀN:</span>
              <span>${formatVND(targetOrder.totalPrice)}</span>
            </div>
            
            <div class="totals-row" style="font-weight: bold; font-size: 11px;">
              <span>CẦN PHẢI THU:</span>
              <span>${formatVND(targetOrder.totalPrice)}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="center" style="font-size: 9px; color: #333; margin-top: 10px; line-height: 1.4;">
            <p style="font-weight: bold; margin: 2px 0;">TRÂN TRỌNG CẢM ƠN!</p>
            <p style="font-weight: bold; margin: 2px 0;">Powered by MISA CUKCUK</p>
            
            <div class="barcode-container">
              <div class="barcode-bar" style="width: 2px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 3px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 2px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 4px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 2px;"></div>
              <div class="barcode-bar" style="width: 3px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 2px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 3px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 4px;"></div>
              <div class="barcode-bar" style="width: 2px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 3px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 2px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 3px;"></div>
              <div style="width: 12px; display: inline-block;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 3px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 2px;"></div>
              <div class="barcode-bar" style="width: 4px;"></div>
              <div class="barcode-bar" style="width: 1px;"></div>
              <div class="barcode-bar" style="width: 2px;"></div>
            </div>
            
            <div style="text-transform: uppercase; letter-spacing: 2px; font-weight: bold; font-size: 8px; color: #111; margin-top: 4px;">
              *CUKCUK-${targetOrder.code}*
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleConfirmOrderWithPrint = (order: Order) => {
    onConfirmOrder(order.id);
    if (channel === 'ShopeeFood') {
      setToastMessage(`Đơn hàng ${order.code} đã được xác nhận`);
      setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      setSelectedOrderId(null);
      return;
    }
    try {
      handlePrintKitchenAndLabel(order);
    } catch (e) {
      // safe fallback if window.open is blocked by sandboxing
    }
    setKitchenPrintOrder(order);
    setShowKitchenPrintOverlay(true);
    setTimeout(() => {
      setShowKitchenPrintOverlay(false);
      setSelectedOrderId(null);
    }, 2200);
  };

  const handleDeliveryOrderWithPrint = (order: Order) => {
    onConfirmOrder(order.id);
    onCompleteOrder(order.id);
    setShippedOrderIds((prev) => [...prev, order.id]);
    setToastMessage(`Đã in phiếu giao hàng cho đơn hàng ${order.code}`);
    setTimeout(() => {
      setToastMessage(null);
      onBackToMain();
    }, 1500);
  };

  const handleConfirmOrderDirectly = (order: Order) => {
    onConfirmOrder(order.id);
    setSelectedOrderId(null);
  };

  // Get brand colors theme
  const isGrab = channel === 'Grab';
  const brandBg = isGrab ? 'bg-green-600' : 'bg-[#EE4D2D]';
  const brandText = isGrab ? 'text-green-600' : 'text-[#EE4D2D]';
  const brandBorder = isGrab ? 'border-green-600' : 'border-[#EE4D2D]';
  const brandBadgeCount = isGrab ? 'bg-green-600 text-white' : 'bg-[#EE4D2D] text-white';
  const tabActiveBg = 'bg-[#00497D] text-white';
  const rowSelectedBg = 'bg-[#b3d3ea] border-b border-[#a2c8e3]';

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div id="delivery-view-container" className="flex flex-col h-full bg-white select-none text-[13px] font-sans">
      {/* Top Main Indigo/Blue Header Bar */}
      <header id="delivery-header" className="bg-[#0973B9] h-11 text-white flex items-center justify-between px-2 shrink-0 border-b border-[#00497D] font-medium">
        <div id="div-head-left" className="flex items-center h-full">
          {/* Back/Home Icon to return to Main Screen 1 */}
          <button 
            id="back-home-btn"
            onClick={onBackToMain}
            className="hover:bg-[#00497D] h-full px-3 flex items-center transition gap-1.5 group"
            title="Quay lại danh sách chính"
          >
            <Home className="w-5 h-5" />
            <ArrowLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          {/* Active Tab Screen 2 Header Tab */}
          <div id="active-channel-tab" className="bg-white text-gray-800 h-full flex items-center px-4 font-bold border-t-2 border-[#00497D] text-sm gap-2">
            {isGrab ? (
              <span 
                id="channel-leading-badge" 
                className={`w-5 h-5 rounded-full bg-green-600 text-white font-extrabold text-[9px] flex items-center justify-center`}
              >
                G
              </span>
            ) : (
              <img src={SHOPEE_LOGO} alt="ShopeeFood" className="w-5 h-5 object-contain shrink-0 rounded-full" referrerPolicy="no-referrer" />
            )}
            <span id="channel-title" className="font-extrabold text-gray-900">
              Giao hàng từ {channel}
            </span>
          </div>

          {/* Breadcrumb link */}
          {channel !== 'ShopeeFood' && (
            <button 
              id="nav-back-link" 
              onClick={onBackToMain}
              className="hover:bg-[#00497D] h-full px-4 text-white/70 text-xs flex items-center transition"
            >
              ‹ Quay lại màn hình chính (Sơ đồ món)
            </button>
          )}
        </div>

        {/* Header Right Actions */}
        <div id="div-head-right" className="flex items-center h-full gap-1 sm:gap-1.5">
          {/* 1. + ORDER ▾ button */}
          <button id="deliv-new-order-btn" className="flex items-center gap-1 bg-transparent hover:bg-white/10 px-2.5 h-8 rounded text-white font-bold text-xs transition uppercase shrink-0">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="tracking-wider">ORDER</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/90 -ml-0.5" />
          </button>

          {/* 2. Hamburger menu button */}
          <div className="relative h-full">
            <button 
              id="deliv-menu-btn" 
              onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
              className={`h-full px-2 sm:px-2.5 flex items-center hover:bg-[#00497D] transition ${headerMenuOpen ? 'bg-[#00497D]' : ''}`} 
              title="Danh sách chức năng"
            >
              <Menu className="w-5 h-5" />
            </button>
            <HeaderMenuDropdown 
              isOpen={headerMenuOpen} 
              onClose={() => setHeaderMenuOpen(false)} 
              onNavigateView={onNavigateToView}
            />
          </div>

          {/* 3. Globe icon */}
          <button id="deliv-globe-btn" className="hover:bg-[#00497D] p-2 rounded transition" title="MISA CUKCUK">
            <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 4. Cloud download icon */}
          <button id="deliv-cloud-btn" className="hover:bg-[#00497D] p-2 rounded transition" title="Đồng bộ đám mây">
            <CloudDownload className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 5. Exchange / Arrows left right icon */}
          <button id="deliv-refresh-btn" className="hover:bg-[#00497D] p-2 rounded transition" title="Đồng bộ dữ liệu">
            <ArrowLeftRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 6. Receipt icon with Dropdown */}
          <div className="relative" id="deliv-receipt-dropdown-container">
            <button 
              id="deliv-receipt-btn" 
              onClick={() => {
                setShowReceiptDropdown(!showReceiptDropdown);
                setShowNotificationsDropdown(false);
              }}
              className={`p-2 rounded transition relative flex items-center justify-center ${
                onlineUnconfirmedCount > 0 
                  ? 'bg-[#F27024] text-white animate-pulse-fast' 
                  : 'hover:bg-[#00497D] text-white'
              }`} 
              title="Hóa đơn"
            >
              <div className="relative">
                <InvoiceIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                {onlineUnconfirmedCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#DA251C] text-white font-black text-[9px] w-3.5 h-3.5 rounded-sm flex items-center justify-center leading-none border border-white/20 select-none">
                    i
                  </span>
                )}
              </div>
            </button>

            {!paymentOrder && showReceiptDropdown && (
              <div className="absolute right-0 top-11 z-[100] w-[280px] bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 font-normal">
                {/* 1. Đặt giao hàng từ 5Food */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <DeliveryBikeIcon className="w-5 h-5 text-[#0973B9] shrink-0" />
                  <span className="text-gray-700 font-medium">Đặt giao hàng từ 5Food</span>
                </div>

                {/* 2. Đặt giao hàng trên Web */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <Globe className="w-5 h-5 text-[#0973B9] shrink-0" />
                  <span className="text-gray-700 font-medium">Đặt giao hàng trên Web</span>
                </div>

                {/* 3. Giao hàng từ Grab */}
                <div 
                  onClick={() => {
                    if (onNavigateToView) onNavigateToView('grab');
                    setShowReceiptDropdown(false);
                  }}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={GRAB_LOGO} 
                      alt="Grab" 
                      className="w-5 h-5 object-contain shrink-0 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-gray-700 font-medium">Giao hàng từ Grab</span>
                  </div>
                  {displayGrabUnconfirmed > 0 ? (
                    <span className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                      {displayGrabUnconfirmed}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal text-xs">(0)</span>
                  )}
                </div>

                {/* 4. Giao hàng từ ShopeeFood */}
                <div 
                  onClick={() => {
                    if (onNavigateToView) onNavigateToView('shopeefood');
                    setShowReceiptDropdown(false);
                  }}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={SHOPEE_LOGO} 
                      alt="ShopeeFood" 
                      className="w-5 h-5 object-contain shrink-0 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-gray-700 font-medium">Giao hàng từ ShopeeFood</span>
                  </div>
                  {displayShopeeUnconfirmed > 0 ? (
                    <span className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                      {displayShopeeUnconfirmed}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal text-xs">(0)</span>
                  )}
                </div>

                {/* 5. Mời khách hàng sử dụng 5Food */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <Utensils className="w-5 h-5 text-[#0973B9] shrink-0" />
                  <span className="text-gray-700 font-medium">Mời khách hàng sử dụng 5Food</span>
                </div>

                {/* 6. Đặt chỗ từ 5Food */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#0973B9] shrink-0" />
                    <span className="text-gray-700 font-medium">Đặt chỗ từ 5Food</span>
                  </div>
                  <span className="text-gray-400 font-normal text-xs">(0)</span>
                </div>

                {/* 7. Khách hàng chưa đồng bộ */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#0973B9] shrink-0" />
                    <span className="text-gray-700 font-medium">Khách hàng chưa đồng bộ</span>
                  </div>
                  <span className="text-gray-400 font-normal text-xs">(0)</span>
                </div>

                {/* 8. Hóa đơn chưa đồng bộ */}
                <div 
                  onClick={() => setShowReceiptDropdown(false)}
                  className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors text-xs sm:text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#0973B9] shrink-0" />
                    <span className="text-gray-700 font-medium">Hóa đơn chưa đồng bộ</span>
                  </div>
                  <span className="text-gray-400 font-normal text-xs">(0)</span>
                </div>
              </div>
            )}
          </div>

          {/* 7. Chat / Notifications Dropdown */}
          <div className="relative">
            <button 
              id="deliv-bell-btn" 
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="hover:bg-[#00497D] p-2 rounded relative transition flex items-center justify-center"
              title="Thông báo đơn hàng"
            >
              <MessageSquare className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 top-11 z-50 w-[360px] bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-3 bg-[#0973B9] text-white font-bold flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Thông báo đơn hàng ({unreadCount} mới)</span>
                  </div>
                  <button onClick={() => setShowNotificationsDropdown(false)} className="text-white hover:text-gray-200 p-0.5 rounded hover:bg-white/10 transition cursor-pointer">✕</button>
                </div>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 font-medium text-xs">Không có thông báo mới.</div>
                  ) : (
                    notifications.map((notif) => {
                      const isGrab = notif.channel === 'Grab' || (notif.code && notif.code.startsWith('GF'));
                      return (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            if (onNotificationClick) {
                              onNotificationClick(notif);
                            }
                            setShowNotificationsDropdown(false);
                          }}
                          className={`p-3 hover:bg-[#F0F6FE] cursor-pointer transition-colors flex gap-2.5 items-center text-left ${
                            notif.read ? 'bg-white opacity-70' : 'bg-[#F0F6FE]'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-[#0973B9] shrink-0" style={{ visibility: notif.read ? 'hidden' : 'visible' }} />
                          <img 
                            src={isGrab ? GRAB_LOGO : SHOPEE_LOGO} 
                            alt={isGrab ? 'Grab' : 'ShopeeFood'} 
                            className="w-5 h-5 object-contain shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900 truncate">
                                {notif.code ? `Đơn hàng mới ${notif.code}` : 'Đơn hàng mới'}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-1">{notif.timestamp}</span>
                            </div>
                            <span className="text-[11px] text-gray-600 truncate">{notif.text}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 8. User Profile */}
          <button id="deliv-user-btn" className="hover:bg-[#00497D] p-2 rounded transition flex items-center justify-center" title="Tài khoản">
            <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Screen 2 Filters Area (Tabs + Search code) */}
      <div id="sub-filters-container" className="bg-white border-b border-gray-200 h-10 px-2 flex items-center justify-between shrink-0">
        <div id="tabs-status" className="flex items-center gap-1 h-full py-1">
          <button
            id="tab-status-unconfirmed"
            onClick={() => {
              setActiveTab('unconfirmed');
              setSelectedOrderId(null);
              setShowPriceBreakdown(false);
            }}
            className={`h-full px-4 flex items-center justify-center rounded font-semibold text-center border transition ${
              activeTab === 'unconfirmed'
                ? isGrab ? 'bg-[#026b97] text-white border-[#02567a]' : 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Chưa xác nhận
          </button>

          <button
            id="tab-status-confirmed"
            onClick={() => {
              setActiveTab('confirmed');
              setSelectedOrderId(null);
              setShowPriceBreakdown(false);
            }}
            className={`h-full px-4 flex items-center justify-center rounded font-semibold text-center border transition ${
              activeTab === 'confirmed'
                ? isGrab ? 'bg-[#026b97] text-white border-[#02567a]' : 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Đã xác nhận
          </button>

          <button
            id="tab-status-completed"
            onClick={() => {
              setActiveTab('completed');
              setSelectedOrderId(null);
              setShowPriceBreakdown(false);
            }}
            className={`h-full px-4 flex items-center justify-center rounded font-semibold text-center border transition ${
              activeTab === 'completed'
                ? isGrab ? 'bg-[#026b97] text-white border-[#02567a]' : 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Đã hoàn thành
          </button>
        </div>

        {/* Search input bar matching image */}
        <div id="search-code-bar" className="flex items-center">
          <div id="search-input-wrapper" className="relative flex items-center bg-white border border-[#ccc] rounded px-2 h-7 w-64 shadow-inner">
            <input 
              id="search-code-input"
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mã đơn hàng, món, SĐT..." 
              className="outline-none text-xs w-full text-gray-700 pr-6"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-8 text-gray-400 hover:text-gray-600 text-xs"
                id="clear-search-btn"
              >
                ✕
              </button>
            )}
            <button id="search-action-btn" className="absolute right-0 h-full px-2 border-l border-[#ccc] flex items-center justify-center hover:bg-gray-50 rounded-r">
              <Search className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Split Pane Workspace */}
      <div id="split-pane-workspace" className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Orders List Table */}
        <div id="left-orders-pane" className="w-1/2 flex flex-col border-r border-[#ccc] bg-white overflow-hidden h-full">
          {/* Table Header Row */}
          <div id="table-header-orders" className="flex border-b border-[#ccc] bg-[#ededed] text-gray-700 font-bold divide-x divide-gray-300 h-8 items-center text-center shrink-0">
            <div id="col-h-code" className="w-1/4 px-1 text-left pl-3 text-xs">Đơn hàng</div>
            <div id="col-h-qty" className="w-1/6 px-1 text-xs">Số món</div>
            <div id="col-h-total" className="w-1/4 px-1 text-right pr-3 text-xs">
              {channel === 'ShopeeFood' ? 'Thực nhận' : 'Tổng tiền'}
            </div>
            <div id="col-h-time" className="w-1/3 px-1 text-left pl-3 text-xs">Thời gian đặt hàng</div>
          </div>

          {/* Table Body - Orders List Scrollable */}
          <div id="table-body-orders" className="flex-1 overflow-y-auto divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div id="empty-filtered-orders" className="p-8 text-center text-gray-400 flex flex-col items-center justify-center h-full gap-2">
                <CheckCircle className="w-10 h-10 text-gray-300" />
                <p className="text-sm font-medium">Không tìm thấy đơn hàng nào</p>
                <p className="text-[11px] text-gray-400">Thay đổi bộ lọc hoặc thêm đơn hàng giả lập để thử nghiệm.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    id={`order-row-${order.code}`}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setShowPriceBreakdown(false);
                    }}
                    className={`flex items-center text-center py-2.5 cursor-pointer select-none divide-x divide-transparent text-gray-800 transition-colors ${
                      isSelected ? rowSelectedBg : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Code Column */}
                    <div id={`order-code-${order.code}`} className="w-1/4 px-1 text-left pl-3 font-semibold text-gray-900 flex flex-col justify-center gap-0.5">
                      <span className="leading-tight">{order.code}</span>
                      {(order.isPickupAtStore || order.code === 'SPF-0040' || order.code === 'SPF-2170') && (
                        <span className="bg-[#E53935] text-white text-[9px] font-bold px-1 py-0.2 rounded uppercase w-fit leading-tight shadow-2xs">
                          Lấy tại quán
                        </span>
                      )}
                    </div>

                    {/* Qty Column */}
                    <div id={`order-qty-${order.code}`} className="w-1/6 px-1 text-center font-mono">
                      {order.itemsCount}
                    </div>

                    {/* Price Column */}
                    <div id={`order-price-${order.code}`} className="w-1/4 px-1 text-right pr-3 font-semibold font-mono text-gray-700">
                      {formatVND(order.totalPrice)}
                    </div>

                    {/* Order Time Column */}
                    <div id={`order-time-${order.code}`} className="w-1/3 px-1 text-left pl-3 text-xs text-gray-500 leading-tight">
                      {order.orderTime}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Control bar / Table bottom action */}
          <div id="left-pane-footer" className="bg-white border-t border-gray-200 h-8 px-2 flex items-center justify-between shrink-0 text-xs">
            <span className="text-gray-600 font-semibold">
              Đang hiển thị: <span className="text-black font-extrabold">{filteredOrders.length}</span> đơn hàng
            </span>
            <div id="pagination-mimic" className="flex gap-1">
              <button id="page-prev-btn" className="bg-white border border-[#ccc] p-0.5 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50" disabled>
                <ChevronDown className="w-4 h-4 text-gray-600 rotate-90" />
              </button>
              <button id="page-next-btn" className="bg-white border border-[#ccc] p-0.5 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50" disabled>
                <ChevronUp className="w-4 h-4 text-gray-600 rotate-90" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Order Details Pane (Matches Image 2 details side) */}
        <div id="right-details-pane" className="w-1/2 flex flex-col bg-white overflow-hidden h-full">
          {selectedOrder ? (
            <div id="order-details-wrapper" className="flex-1 flex flex-col overflow-hidden">
              
              {/* Info Block Viewport - Header Title Bar */}
              <div id="details-header-title-bar" className="bg-[#f0f0f0] px-3.5 py-2 border-b border-gray-300 shrink-0">
                <span id="title-info-header" className="text-gray-900 text-sm font-bold block">Thông tin đơn hàng</span>
              </div>

              {/* Order Code & Order Time Section */}
              <div id="details-header" className="p-3.5 bg-white border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h2 id="details-code-title" className={`text-lg sm:text-xl font-bold ${brandText} tracking-tight`}>
                    {selectedOrder.code}
                  </h2>
                  {(selectedOrder.isPickupAtStore || selectedOrder.code === 'SPF-0040' || selectedOrder.code === 'SPF-2170') && (
                    <span className="bg-[#E53935] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wide inline-flex items-center gap-1 shadow-2xs">
                      Lấy tại quán
                    </span>
                  )}
                </div>

                <div id="details-time-row" className="text-gray-900 text-xs sm:text-[13px]">
                  Thời gian đặt: <strong className="font-bold text-gray-900">{selectedOrder.orderTime}</strong>
                </div>
              </div>

              {/* Items List Table inside Detail Panel */}
              <div id="details-items-table" className="flex-1 overflow-y-auto">
                <div id="table-header-items" className="flex bg-[#e8e8e8] border-b border-gray-300 text-gray-900 font-bold sticky top-0 z-10 py-1.5 px-3.5 text-xs sm:text-[13px]">
                  <div className="w-[58%] text-left font-bold">Tên món</div>
                  <div className="w-[17%] text-center font-bold">SL</div>
                  <div className="w-[25%] text-right font-bold">Thành tiền</div>
                </div>

                <div id="table-body-items" className="divide-y divide-gray-100">
                  {selectedOrder.items.map((item, index) => {
                    const unitPriceVal = item.originalPrice || (item.qty ? item.totalPrice / item.qty : item.totalPrice);
                    const isSelectedRow = index === 0;
                    return (
                      <div 
                        key={item.id || index} 
                        id={`item-row-${index}`}
                        className={`flex items-center py-2.5 px-3.5 text-xs sm:text-[13px] border-b border-gray-100 ${
                          isSelectedRow ? 'bg-[#b3d3ea] text-black font-medium' : 'bg-white hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        <div className="w-[58%] text-left pr-2 truncate" id={`item-name-${index}`} title={item.name}>
                          {item.name}
                        </div>
                        <div className="w-[17%] text-center font-mono" id={`item-qty-${index}`}>
                          {item.qty.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="w-[25%] text-right font-mono font-medium" id={`item-total-${index}`}>
                          {formatVND(item.totalPrice)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom total line and Action Confirm Buttons */}
              <div id="details-pane-footer" className="bg-white shrink-0 flex flex-col">
                
                {/* Total price section */}
                <div id="details-total-price-row" className="relative flex items-center justify-between py-2.5 px-3.5 border-t border-gray-200 z-30">
                  <span id="label-total-price-bottom" className="text-sm sm:text-base font-bold text-gray-900">
                    {channel === 'ShopeeFood' ? 'Thực nhận' : 'Tổng tiền'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span id="val-total-price-bottom" className="text-base sm:text-lg font-extrabold text-gray-900 font-mono">
                      {formatVND(selectedOrder.totalPrice)}
                    </span>
                    
                    {/* Interactive 3-dots menu with price breakdown popover */}
                    <div className="relative">
                      <button 
                        id="deliv-more-options" 
                        onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100 text-[#0973B9] transition-colors"
                        title="Xem chi tiết các khoản phí và khuyến mại"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {showPriceBreakdown && (() => {
                        const itemsSum = selectedOrder.items.reduce((acc, item) => acc + item.totalPrice, 0);
                        const discountVal = breakdown.billDiscount || 0;
                        const commissionVal = breakdown.platformFee || Math.round((itemsSum - discountVal) * 0.2);
                        const taxVal = 0;
                        const netReceivedVal = Math.max(0, itemsSum - discountVal - commissionVal - taxVal);

                        return (
                          <div 
                            id="price-breakdown-card" 
                            className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 text-gray-850 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
                            style={{ filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15))' }}
                          >
                            {/* Title Header bar */}
                            <div className="px-3 py-2.5 bg-white text-gray-900 font-bold text-xs flex items-center justify-between border-b border-gray-200">
                              <span>Chi tiết thanh toán ({selectedOrder.code})</span>
                              <button 
                                onClick={() => setShowPriceBreakdown(false)} 
                                className="text-gray-400 hover:text-gray-700 font-bold text-xs p-0.5 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>

                            {/* Breakdown Lines */}
                            <div className="p-3.5 space-y-2 text-xs">
                              {/* Section 1 */}
                              <div className="space-y-1.5">
                                {/* 1. Tổng tiền món */}
                                <div className="flex justify-between items-center text-gray-800" id="bd-row-items-total">
                                  <span className="font-semibold">Tổng tiền món</span>
                                  <span className="font-bold text-gray-900 font-mono">{formatVND(itemsSum)}</span>
                                </div>

                                {/* 2. Giảm giá */}
                                <div className="flex justify-between items-center text-rose-600" id="bd-row-discount">
                                  <span className="font-semibold">Giảm giá</span>
                                  <span className="font-bold font-mono">-{formatVND(discountVal)}</span>
                                </div>

                                {/* 3. Chiết khấu */}
                                <div className="flex justify-between items-center text-gray-800" id="bd-row-rebate">
                                  <span className="font-semibold">Chiết khấu</span>
                                  <span className="font-bold text-gray-900 font-mono">0đ</span>
                                </div>

                                {/* 4. Phí giao hàng */}
                                <div className="flex justify-between items-center text-gray-800" id="bd-row-delivery-fee">
                                  <span className="font-semibold">Phí giao hàng</span>
                                  <span className="font-bold text-gray-900 font-mono">{breakdown.deliveryFee ? formatVND(breakdown.deliveryFee) : '0đ'}</span>
                                </div>

                                {/* 5. Phí đóng gói */}
                                <div className="flex justify-between items-center text-gray-800" id="bd-row-packing-fee">
                                  <span className="font-semibold">Phí đóng gói</span>
                                  <span className="font-bold text-gray-900 font-mono">0đ</span>
                                </div>
                              </div>

                              {/* Section 2 Divider */}
                              <div className="border-t border-gray-200 pt-2 space-y-1.5">
                                {/* 6. Hoa hồng ShopeeFood */}
                                <div className="flex justify-between items-center text-gray-800" id="bd-row-commission">
                                  <span className="font-semibold">Hoa hồng {isGrab ? 'Grab' : 'ShopeeFood'}</span>
                                  <span className="font-bold text-gray-900 font-mono">-{formatVND(commissionVal)}</span>
                                </div>

                                {/* 7. Thuế khấu trừ */}
                                <div className="flex justify-between items-center text-gray-800" id="bd-row-tax">
                                  <span className="font-semibold">Thuế khấu trừ</span>
                                  <span className="font-bold text-gray-900 font-mono">{formatVND(taxVal)}</span>
                                </div>
                              </div>

                              {/* Section 3 Divider */}
                              <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-gray-300 text-left mt-2" id="bd-row-net-received">
                                <span className="font-extrabold text-gray-900 text-xs uppercase tracking-wide">Quán thực nhận</span>
                                <span className="font-black text-sm text-[#00497D] font-mono">{formatVND(netReceivedVal)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Gray bottom action bar with 'Từ chối' and 'Xác nhận' / 'Hủy đơn', 'Thông báo tài xế', 'Thu tiền' button */}
                <div id="action-buttons-box" className="bg-[#E1E1E1] p-2 px-3.5 flex justify-end items-center gap-2">
                  {selectedOrder.status === 'unconfirmed' ? (
                    <>
                      <button
                        id="reject-action-submit-btn"
                        onClick={() => {
                          setRejectOrderId(selectedOrder.id);
                          setRejectReasonCustom('Hết món ăn');
                          setShowRejectModal(true);
                        }}
                        className="px-6 h-[50px] bg-white text-[#DA251C] border border-gray-300 hover:bg-red-50 text-xs sm:text-sm font-bold transition rounded-none flex items-center justify-center cursor-pointer uppercase"
                      >
                        Từ chối
                      </button>
                      <button
                        id="confirm-action-submit-btn"
                        onClick={() => {
                          handleConfirmOrderWithPrint(selectedOrder);
                        }}
                        className="px-6 h-[50px] bg-[#0073B9] hover:bg-[#005a92] text-white text-xs sm:text-sm font-bold transition shadow-sm rounded-none flex items-center justify-center cursor-pointer uppercase"
                      >
                        Xác nhận
                      </button>
                    </>
                  ) : selectedOrder.status === 'confirmed' ? (() => {
                    const isDriverNotified = notifiedDriverOrderIds.includes(selectedOrder.id);
                    const isPickup = selectedOrder.isPickupAtStore || selectedOrder.code === 'SPF-0040' || selectedOrder.code === 'SPF-2170';
                    return (
                      <>
                        <button
                          id="cancel-action-submit-btn"
                          onClick={() => {
                            setRejectOrderId(selectedOrder.id);
                            setRejectReasonCustom('Hết món ăn');
                            setShowRejectModal(true);
                          }}
                          className="px-6 h-[50px] bg-white text-[#DA251C] border border-gray-300 hover:bg-red-50 text-xs sm:text-sm font-bold transition rounded-none flex items-center justify-center cursor-pointer uppercase"
                        >
                          HỦY ĐƠN
                        </button>
                        <button
                          id="collect-money-action-submit-btn"
                          onClick={() => {
                            setPaymentOrder(selectedOrder);
                            setApplyVatReduction(false);
                            setRequestGtgtInvoice(false);
                            setSelectedPromos([]);
                            setSearchPromoQuery('');
                          }}
                          className="px-6 h-[50px] bg-[#FF8000] hover:bg-[#e67300] text-white text-xs sm:text-sm font-bold transition shadow-sm rounded-none flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                        >
                          <DollarSign className="w-5 h-5 text-white" />
                          <span>Thu tiền</span>
                        </button>
                        <button
                          id="delivery-action-submit-btn"
                          onClick={() => {
                            // Mark order as shipped/handled so it is processed, then open the delivery book
                            setShippedOrderIds((prev) => [...prev, selectedOrder.id]);
                            setShowDeliveryBook(true);
                            setDeliveryBookPartnerTab('shopeefood');
                            setToastMessage(`Đơn hàng ${selectedOrder.code} đã sẵn sàng giao`);
                            setTimeout(() => {
                              setToastMessage(null);
                            }, 3000);
                          }}
                          className="px-6 h-[50px] bg-[#008A45] hover:bg-[#007338] text-white text-xs sm:text-sm font-bold transition shadow-sm rounded-none flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                        >
                          <DeliveryBikeIcon className="w-5 h-5 text-white" />
                          <span>Giao hàng</span>
                        </button>
                      </>
                    );
                  })() : (
                    <div className="text-xs font-bold text-gray-700 px-3 py-1">
                      {selectedOrder.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div id="no-order-selected-state" className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6">
              <CheckCircle className="w-12 h-12 text-gray-200 mb-2" />
              <p className="text-sm font-semibold">Chưa chọn đơn hàng</p>
              <p className="text-xs text-gray-400">Chọn một đơn hàng từ bên trái để xem đầy đủ chi tiết.</p>
            </div>
          )}
        </div>

      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200 border border-gray-700/50 backdrop-blur-md">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CUKCUK MISA Diagnostic Footer */}
      <footer id="cukcuk-footer-detail" className="bg-[#026b97] h-6 text-[#9adcff] font-sans text-[11px] flex items-center justify-between px-3 shrink-0 select-text">
        <div id="footer-dl" className="font-semibold text-white/90">
          dblongviet - dblongviet.cukcuk2.misa.local
        </div>

        <div id="footer-support-dl" className="flex items-center gap-2 font-medium">
          <span>Tổng đài tư vấn: <strong className="text-white">MISA SUPPORT</strong></span>
          <span className="text-white/45">|</span>
          <span>OVR</span>
          <span className="text-white/45">|</span>
          <span>NUM</span>
        </div>

        <div id="footer-time-dl" className="flex items-center gap-2 font-mono">
          <span>SCRL</span>
          <span className="text-white/45">|</span>
          <span className="text-yellow-300 font-bold">04:03 CH - 17/03/2021</span>
        </div>
      </footer>

      {/* Từ chối / Hủy order (Reject Modal) matching CUKCUK MISA design */}
      {showRejectModal && (() => {
        const orderToReject = orders.find(o => o.id === rejectOrderId) || selectedOrder;
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] font-sans text-xs select-none text-left">
            <div className="w-[460px] max-w-full bg-white shadow-2xl border border-gray-300 flex flex-col overflow-hidden animate-in fade-in duration-150">
              {/* Header Modal - Blue Bar */}
              <div className="h-10 bg-[#0073B9] text-white px-3.5 flex items-center justify-between shrink-0">
                <span className="font-bold text-sm text-white">Hủy order</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm hover:opacity-80 cursor-pointer select-none">?</span>
                  <button 
                    type="button" 
                    onClick={() => setShowRejectModal(false)} 
                    className="text-white hover:opacity-80 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Body Form */}
              <div className="p-5 sm:p-6 flex flex-col gap-6 text-gray-800 text-xs sm:text-sm bg-white">
                <div className="text-gray-800 font-normal leading-relaxed">
                  Bạn có chắc chắn muốn hủy order <strong className="font-semibold text-gray-900">{orderToReject?.code || '3IJC1I'}</strong> không?
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-gray-800 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0">
                    Lý do hủy <span className="text-[#DA251C] font-bold">*</span>
                  </label>
                  <div className="relative flex-1">
                    <select 
                      value={rejectReasonCustom}
                      onChange={(e) => setRejectReasonCustom(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-none px-3 py-1.5 pr-8 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#0073B9] appearance-none cursor-pointer"
                    >
                      <option value="Hết món ăn">Hết món ăn</option>
                      <option value="Quán quá đông">Quán quá đông</option>
                      <option value="Nhà hàng đóng cửa">Nhà hàng đóng cửa</option>
                      <option value="Khách đổi ý / hủy đơn">Khách đổi ý / hủy đơn</option>
                      <option value="Không có tài xế">Không có tài xế</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="bg-[#EFEFEF] p-3 px-4 flex items-center justify-end gap-3 border-t border-gray-200 shrink-0">
                <button 
                  type="button"
                  onClick={() => {
                    const finalReason = rejectReasonCustom || 'Hết món ăn';
                    if (onDeleteOrder && orderToReject) {
                      onDeleteOrder(orderToReject.id, finalReason);
                    }
                    if (paymentOrder && orderToReject && paymentOrder.id === orderToReject.id) {
                      setPaymentOrder(null);
                    }
                    setShowRejectModal(false);
                  }}
                  className="px-7 py-2 bg-[#00497D] hover:bg-[#003860] text-white font-bold text-xs sm:text-sm uppercase cursor-pointer rounded-none min-w-[80px] shadow-sm transition"
                >
                  CÓ
                </button>
                <button 
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-[#DA251C] font-bold text-xs sm:text-sm uppercase cursor-pointer rounded-none min-w-[80px] transition"
                >
                  KHÔNG
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal "Thu tiền khách hàng" matching CUKCUK MISA exact design */}
      {renderCollectMoneyModal()}

      {/* Hủy đơn hàng (Cancel Modal) */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] font-sans text-xs select-none text-left">
          <div className="w-[480px] max-w-full bg-white rounded-xl shadow-2xl border border-gray-150 flex flex-col overflow-hidden animate-in scale-in duration-200">
            {/* Header Modal */}
            <div className="h-[62px] flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-none">
              <h3 className="text-base font-semibold text-gray-900">Hủy đơn hàng</h3>
              <button onClick={() => setShowCancelModal(false)} className="text-[#717680] hover:text-gray-900 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body Form */}
            <div className="px-6 pb-4 flex flex-col gap-3 text-gray-700">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-gray-500 text-xs">Vui lòng nhập lý do hủy bỏ đơn hàng đã xác nhận này:</label>
                <textarea 
                  placeholder="Nhập lý do cụ thể hủy đơn (ví dụ: khách gọi điện hủy, hết nguyên liệu chế biến gấp...)"
                  value={cancelReasonText}
                  onChange={(e) => setCancelReasonText(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#245FDF] focus:border-[#245FDF] focus:outline-none font-medium leading-relaxed text-gray-900"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5 mt-1.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gợi ý lý do nhanh:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Khách hàng yêu cầu hủy đơn',
                    'Nhà hàng hết món đột xuất',
                    'Không có tài xế giao hàng',
                    'Trùng lặp đơn hàng'
                  ].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setCancelReasonText(reason)}
                      className={`px-3 py-1.5 rounded-lg border text-[11px] transition font-medium ${
                        cancelReasonText === reason
                          ? 'bg-[#F0F6FE] border-[#245FDF]/50 text-[#245FDF]'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="h-14 bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 flex items-center justify-end gap-2 shrink-0">
              <button 
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="h-[32px] min-w-[84px] px-4 bg-white hover:bg-gray-50 border border-[#D5D7DA] rounded-lg text-gray-700 font-semibold transition text-xs uppercase"
              >
                BỎ QUA
              </button>
              <button 
                type="button"
                onClick={() => {
                  const finalReason = cancelReasonText.trim() || 'Hủy bỏ bởi nhà hàng';
                  if (onDeleteOrder && cancelOrderId) {
                    onDeleteOrder(cancelOrderId, finalReason);
                  }
                  setShowCancelModal(false);
                }}
                className="h-[32px] min-w-[84px] px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition active:scale-95 text-xs uppercase"
              >
                HỦY ĐƠN HÀNG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEMP PRINT RECEIPT MODAL PREVIEW */}
      {showPrintReceipt && selectedOrder && (
        <div 
          id="print-receipt-modal" 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity"
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-sm w-full overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div id="print-modal-header" className="px-4 py-3 bg-[#026b97] text-white font-bold text-sm flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Printer className="w-4 h-4" />
                <span>Xem trước Mẫu in Tạm tính</span>
              </div>
              <button 
                onClick={() => setShowPrintReceipt(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Receipt paper viewport scrollable */}
            <div className="p-5 bg-gray-100 overflow-y-auto flex-1 flex justify-center">
              <div 
                id="thermal-receipt-printable-content" 
                className="bg-[#fffdf8] p-6 shadow-md border border-gray-200 w-[74mm] rounded-xs font-mono text-black text-xs select-text leading-relaxed"
                style={{ fontFamily: "'Courier New', Courier, monospace" }}
              >
                <div className="center text-center">
                  <div className="bold text-xs tracking-wider uppercase" style={{ fontSize: '12px' }}>MISA CUKCUK PLATFORM</div>
                  <div className="text-[10px] text-gray-600" style={{ fontSize: '9px', fontWeight: '500' }}>Cửa hàng liên kết {channel}</div>
                  <div className="text-[10px] text-gray-500" style={{ fontSize: '9px' }}>CSKH: 1900 8198 - TPHCM</div>
                  
                  <div className="divider"></div>
                  
                  <div className="title" style={{ fontSize: '15px', fontWeight: 'bold', margin: '6px 0', color: '#000' }}>PHIẾU TẠM TÍNH</div>
                  <div className="subtitle" style={{ fontSize: '10px', color: '#333' }}>Số đơn: {selectedOrder.code}</div>
                </div>

                <table className="info-table">
                  <tbody>
                    <tr>
                      <td style={{ width: '35%', fontWeight: 'bold' }}>Giờ in:</td>
                      <td style={{ width: '65%', textAlign: 'right' }}>{new Date().toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Mã đơn:</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{selectedOrder.code}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Đối tác:</td>
                      <td style={{ textAlign: 'right' }}>{channel}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Khách hàng:</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{selectedOrder.customerPhone || 'Chưa cập nhật'}</td>
                    </tr>
                    {selectedOrder.deliveryAddress && (
                      <tr>
                        <td style={{ fontWeight: 'bold' }}>Địa chỉ:</td>
                        <td style={{ textAlign: 'right', fontSize: '10px', lineHeight: '1.2' }}>{selectedOrder.deliveryAddress}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="divider"></div>

                {/* Items grid */}
                <table className="items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>Tên món</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>SL</th>
                      <th style={{ width: '35%', textAlign: 'right' }}>T.Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={item.id || index}>
                        <td>{item.name}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatVND(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Section */}
                <div className="totals-section">
                  <div className="totals-row">
                    <span>Cộng tiền món:</span>
                    <span className="bold">{formatVND(selectedOrder.items.reduce((acc, item) => acc + item.totalPrice, 0))}</span>
                  </div>
                  
                  <div className="totals-row">
                    <span>T. Tiền (đã trừ KM món):</span>
                    <span className="bold">{formatVND(breakdown.subtotalDiscounted)}</span>
                  </div>

                  <div className="totals-row">
                    <span>Khuyến mại hóa đơn:</span>
                    <span className="bold">-{formatVND(breakdown.billDiscount)}</span>
                  </div>

                  <div className="totals-row">
                    <span>Phí vận chuyển:</span>
                    <span>+{formatVND(breakdown.deliveryFee)}</span>
                  </div>

                  <div className="totals-row">
                    <span>Phí áp dụng:</span>
                    <span>+{formatVND(breakdown.platformFee)}</span>
                  </div>

                  {breakdown.driverTip > 0 && (
                    <div className="totals-row">
                      <span>Tip cho vận chuyển:</span>
                      <span>+{formatVND(breakdown.driverTip)}</span>
                    </div>
                  )}

                  <div className="grand-total">
                    <span>THÀNH TIỀN:</span>
                    <span>{formatVND(selectedOrder.totalPrice)}</span>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="center" style={{ fontSize: '9px', color: '#333', textAlign: 'center', marginTop: '10px', lineHeight: '1.4' }}>
                  <p style={{ fontStyle: 'italic', margin: '2px 0' }}>Mẫu in tạm tính - Không dùng để thanh toán thực tế</p>
                  <p style={{ fontWeight: 'bold', margin: '2px 0' }}>Powered by MISA CUKCUK</p>
                  
                  {/* Highly polished CSS scanable Barcode simulation */}
                  <div className="barcode-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '32px', margin: '14px 0 6px 0', gap: '1.2px' }}>
                    <div style={{ width: '2px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '3px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '2px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '4px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '2px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '3px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '2px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '3px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '4px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '2px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '3px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '2px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '3px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '12px' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '3px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '2px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '4px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '1px', height: '32px', backgroundColor: '#000' }}></div>
                    <div style={{ width: '2px', height: '32px', backgroundColor: '#000' }}></div>
                  </div>
                  
                  <div style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', fontSize: '9px', color: '#111', marginTop: '4px' }}>
                    *CUKCUK-{selectedOrder.code}*
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div id="print-modal-footer" className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
              <button 
                onClick={() => setShowPrintReceipt(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded border border-gray-300 transition duration-150 uppercase"
              >
                ĐÓNG
              </button>
              
              <button 
                onClick={handlePrint}
                className={`px-5 py-2 text-xs font-bold text-white rounded flex items-center gap-1.5 shadow transition duration-150 uppercase ${
                  isGrab ? 'bg-[#026b97] hover:bg-[#02567a]' : 'bg-[#0973B9] hover:bg-[#00497D]'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>IN HÓA ĐƠN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentOrder && (() => {
        const itemsSum = paymentOrder.items.reduce((acc, item) => acc + item.totalPrice, 0);
        // Calculate service fee exactly similar to ratio in screen
        const serviceFee = Math.round(itemsSum * 0.06875);
        // VAT discount: 0.6% of items sum if checked
        const vatDiscount = applyVatReduction ? Math.round(itemsSum * 0.006) : 0;
        
        // Custom Promo logic
        let promoDiscount = 0;
        if (selectedPromos.includes('giảm giá món')) {
          promoDiscount += Math.round(itemsSum * 0.05); // 5%
        }
        if (selectedPromos.includes('Giảm 15% hóa đơn thứ 2')) {
          promoDiscount += Math.round(itemsSum * 0.15); // 15%
        }
        if (selectedPromos.includes('giảm giá hóa đơn 500k')) {
          promoDiscount += 500000;
        }
        if (selectedPromos.includes('KM HĐ 100%')) {
          promoDiscount = itemsSum; // 100% discount
        }
        
        const grandTotal = Math.max(0, itemsSum + serviceFee - vatDiscount - promoDiscount);

        const allPromos: { id: string; label: string; desc: string }[] = [];

        const filteredPromos = allPromos.filter(p => 
          p.label.toLowerCase().includes(searchPromoQuery.toLowerCase())
        );

        const handleCompletePayment = () => {
          onCompleteOrder(paymentOrder.id);
          if (onNavigateToView && paymentOrder) {
            if (paymentOrder.channel === 'ShopeeFood') {
              onNavigateToView('shopeefood');
            } else if (paymentOrder.channel === 'Grab') {
              onNavigateToView('grab');
            }
          }
          setPaymentOrder(null);
          setShowDeliveryBook(false);
          setActiveTab('completed');
          setSelectedOrderId(paymentOrder.id);
        };

        // Date String for right side of mini header
        const nowObj = new Date();
        const displayDateTime = nowObj.toLocaleDateString('vi-VN') + ' ' + nowObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        return (
          <div className="fixed inset-0 z-50 bg-[#e4ecf0] flex flex-col font-sans text-xs text-[#333] select-none text-left">
            {/* Top MISA CUKCUK main header - Identical to Main Screen Header */}
            <header id="main-header" className="bg-[#0973B9] h-11 text-white flex items-center justify-between px-2 shrink-0 font-medium text-[13px] font-sans">
              <div id="header-left" className="flex items-center h-full">
                {/* Home Icon */}
                <button 
                  id="home-nav-btn" 
                  onClick={() => {
                    setPaymentOrder(null);
                    onBackToMain();
                  }} 
                  className="hover:bg-[#00497D] h-full px-3 flex items-center transition cursor-pointer"
                  title="Trang chủ / Sơ đồ"
                >
                  <Home className="w-5 h-5 text-white" />
                </button>
                
                {/* Active Tab: Order */}
                <div id="active-order-tab" className="bg-white text-[#0973B9] h-full flex items-center px-4 font-bold text-sm gap-1.5 shadow-sm rounded-t-lg">
                  <Globe className="w-4 h-4 text-[#0973B9]" />
                  <span id="label-order" className="font-extrabold text-[#0973B9]">Order</span>
                </div>

                {/* Tab: Sơ đồ */}
                <button 
                  id="sodo-nav-btn" 
                  onClick={() => {}}
                  className="hover:bg-[#00497D] h-full px-4 flex items-center text-white/90 text-sm transition cursor-pointer"
                >
                  <span id="label-sodo">Sơ đồ</span>
                </button>

                {/* Tab: Order Online */}
                <button 
                  id="order-online-nav-btn" 
                  onClick={() => {}} 
                  className="hover:bg-[#00497D] h-full px-4 flex items-center text-white/90 text-sm transition gap-1.5 relative cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-white/80" />
                  <span id="label-order-online">
                    Order Online
                  </span>
                  {onlineUnconfirmedCount > 0 && (
                    <span className="bg-[#DA251C] text-white font-extrabold text-[13px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm border border-white/20">
                      {onlineUnconfirmedCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Header Right Actions */}
              <div id="header-right" className="flex items-center h-full gap-1 sm:gap-1.5">
                {/* 1. + ORDER ▾ button */}
                <button id="add-order-btn" className="flex items-center gap-1 bg-transparent hover:bg-white/10 px-2.5 h-8 rounded text-white font-bold text-[13px] transition uppercase shrink-0 border border-transparent cursor-pointer">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span className="tracking-wider">ORDER</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/90 -ml-0.5" />
                </button>

                {/* 2. Menu */}
                <div className="relative h-full">
                  <button 
                    id="menu-toggle-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`h-full px-2 sm:px-2.5 flex items-center hover:bg-[#00497D] transition cursor-pointer ${dropdownOpen ? 'bg-[#00497D]' : ''}`}
                    title="Danh sách chức năng"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <HeaderMenuDropdown 
                    isOpen={dropdownOpen} 
                    onClose={() => setDropdownOpen(false)} 
                    onNavigateView={onNavigateToView}
                  />
                </div>

                {/* 3. Globe */}
                <button id="globe-btn" className="hover:bg-[#00497D] p-2 rounded transition cursor-pointer" title="MISA CUKCUK">
                  <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>

                {/* 4. Cloud download */}
                <button id="cloud-sync-btn" className="hover:bg-[#00497D] p-2 rounded transition cursor-pointer" title="Đồng bộ đám mây">
                  <CloudDownload className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>

                {/* 5. Arrow left right */}
                <button id="exchange-sync-btn" className="hover:bg-[#00497D] p-2 rounded transition cursor-pointer" title="Đồng bộ dữ liệu">
                  <ArrowLeftRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>

                {/* 6. Receipt with Dropdown */}
                <div className="relative" id="receipt-dropdown-container">
                  <button 
                    id="receipt-btn" 
                    onClick={() => {
                      setShowReceiptDropdown(!showReceiptDropdown);
                      setShowNotificationsDropdown(false);
                      setDropdownOpen(false);
                    }}
                    className={`p-2 rounded transition relative flex items-center justify-center cursor-pointer ${
                      onlineUnconfirmedCount > 0 
                        ? 'bg-[#F27024] text-white animate-pulse-fast' 
                        : 'hover:bg-[#00497D] text-white'
                    }`} 
                    title="Hóa đơn"
                  >
                    <div className="relative">
                      <InvoiceIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                      {onlineUnconfirmedCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-[#DA251C] text-white font-black text-[9px] w-3.5 h-3.5 rounded-sm flex items-center justify-center leading-none border border-white/20 select-none">
                          i
                        </span>
                      )}
                    </div>
                  </button>

                  {showReceiptDropdown && (
                    <div className="absolute right-0 top-11 z-[100] w-[280px] bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 font-normal">
                      <div 
                        onClick={() => setShowReceiptDropdown(false)}
                        className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-100 text-[13px]"
                      >
                        <DeliveryBikeIcon className="w-5 h-5 text-[#0973B9] shrink-0" />
                        <span className="text-gray-700 font-medium">Đặt giao hàng từ 5Food</span>
                      </div>

                      <div 
                        onClick={() => setShowReceiptDropdown(false)}
                        className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-100 text-[13px]"
                      >
                        <Globe className="w-5 h-5 text-[#0973B9] shrink-0" />
                        <span className="text-gray-700 font-medium">Đặt giao hàng trên Web</span>
                      </div>

                      <div 
                        onClick={() => {
                          if (onNavigateToView) onNavigateToView('grab');
                          setShowReceiptDropdown(false);
                          setPaymentOrder(null);
                        }}
                        className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-[13px]"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={GRAB_LOGO} 
                            alt="Grab" 
                            className="w-5 h-5 object-contain shrink-0 rounded-full"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-gray-700 font-medium">Giao hàng từ Grab</span>
                        </div>
                        {displayGrabUnconfirmed > 0 ? (
                          <span className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                            {displayGrabUnconfirmed}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-normal text-xs">(0)</span>
                        )}
                      </div>

                      <div 
                        onClick={() => {
                          if (onNavigateToView) onNavigateToView('shopeefood');
                          setShowReceiptDropdown(false);
                          setPaymentOrder(null);
                        }}
                        className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-[13px]"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={SHOPEE_LOGO} 
                            alt="ShopeeFood" 
                            className="w-5 h-5 object-contain shrink-0 rounded-full"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-gray-700 font-medium">Giao hàng từ ShopeeFood</span>
                        </div>
                        {displayShopeeUnconfirmed > 0 ? (
                          <span className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                            {displayShopeeUnconfirmed}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-normal text-xs">(0)</span>
                        )}
                      </div>

                      {/* 5. Mời khách hàng sử dụng 5Food */}
                      <div 
                        onClick={() => setShowReceiptDropdown(false)}
                        className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-100 text-[13px]"
                      >
                        <Utensils className="w-5 h-5 text-[#0973B9] shrink-0" />
                        <span className="text-gray-700 font-medium">Mời khách hàng sử dụng 5Food</span>
                      </div>

                      {/* 6. Đặt chỗ từ 5Food */}
                      <div 
                        onClick={() => setShowReceiptDropdown(false)}
                        className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-[13px]"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-[#0973B9] shrink-0" />
                          <span className="text-gray-700 font-medium">Đặt chỗ từ 5Food</span>
                        </div>
                        <span className="text-gray-400 font-normal text-xs">(0)</span>
                      </div>

                      {/* 7. Khách hàng chưa đồng bộ */}
                      <div 
                        onClick={() => setShowReceiptDropdown(false)}
                        className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-gray-100 text-[13px]"
                      >
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-[#0973B9] shrink-0" />
                          <span className="text-gray-700 font-medium">Khách hàng chưa đồng bộ</span>
                        </div>
                        <span className="text-gray-400 font-normal text-xs">(0)</span>
                      </div>

                      {/* 8. Hóa đơn chưa đồng bộ */}
                      <div 
                        onClick={() => setShowReceiptDropdown(false)}
                        className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3 cursor-pointer transition-colors text-[13px]"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#0973B9] shrink-0" />
                          <span className="text-gray-700 font-medium">Hóa đơn chưa đồng bộ</span>
                        </div>
                        <span className="text-gray-400 font-normal text-xs">(0)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Message / Notification with Dropdown */}
                <div className="relative">
                  <button 
                    id="bell-alert-btn" 
                    onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                    className="hover:bg-[#00497D] p-2 rounded relative transition flex items-center justify-center cursor-pointer"
                    title="Thông báo đơn hàng"
                  >
                    <MessageSquare className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>

                  {showNotificationsDropdown && (
                    <div className="absolute right-0 top-11 z-50 w-[360px] bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="p-3 bg-[#0973B9] text-white font-bold flex items-center justify-between text-[13px] sm:text-sm">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>Thông báo đơn hàng</span>
                        </div>
                        <button onClick={() => setShowNotificationsDropdown(false)} className="text-white hover:text-gray-200 p-0.5 rounded hover:bg-white/10 transition cursor-pointer">✕</button>
                      </div>
                      <div className="p-4 text-center text-gray-500 font-medium text-[13px]">Không có thông báo mới.</div>
                    </div>
                  )}
                </div>

                {/* 8. Phone */}
                <button id="phone-btn" className="hover:bg-[#00497D] p-2 rounded transition cursor-pointer" title="Tổng đài">
                  <Phone className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>

                {/* 9. User */}
                <button id="user-btn" className="hover:bg-[#00497D] p-2 rounded transition cursor-pointer" title="Tài khoản">
                  <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>
              </div>
            </header>

            {/* Workplace below Header */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column Sidebar */}
              <aside className="w-[300px] bg-[#f2f6f9] flex flex-col shrink-0 border-r border-gray-300 overflow-y-auto text-left font-sans select-none">
                
                {/* 1. Thẻ thành viên Header */}
                <div className="bg-[#e2edf4] border-b border-gray-300 px-3 py-1.5 flex items-center gap-1.5 font-bold text-[#0073BA] text-[13px]">
                  <CreditCard className="w-4 h-4 text-[#0073BA]" />
                  <span>Thẻ thành viên</span>
                </div>

                {/* Form fields for Thẻ thành viên */}
                <div className="p-2.5 bg-[#f0f4f8] border-b border-gray-300 flex flex-col gap-2">
                  {/* Row 1: Mã thành viên */}
                  <div className="flex items-center gap-2">
                    <span className="w-[90px] text-[13px] text-gray-800 font-normal shrink-0">Mã thành viên</span>
                    <div className="flex-1 bg-white border border-gray-300 h-7 flex items-center px-1.5 justify-between focus-within:border-[#0073BA]">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <CukcukLogoIcon className="w-4.5 h-4.5 shrink-0" />
                        <span className="text-gray-300 font-light ml-0.5">|</span>
                        <input 
                          type="text" 
                          placeholder=""
                          className="w-full h-full text-[13px] outline-none border-none px-1 text-gray-800"
                        />
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Tên thành viên */}
                  <div className="flex items-center gap-2">
                    <span className="w-[90px] text-[13px] text-gray-800 font-normal shrink-0">Tên thành viên</span>
                    <div className="flex-1 flex items-center gap-1">
                      <div className="flex-1 bg-white border border-gray-300 h-7 flex items-center justify-between px-2 cursor-pointer hover:border-gray-400">
                        <span className="text-gray-400 text-[13px]"></span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <button className="w-7 h-7 bg-[#f4f6f8] hover:bg-gray-200 border border-gray-300 flex items-center justify-center shrink-0 cursor-pointer">
                        <Plus className="w-4 h-4 text-[#008A45] stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Row 3: SỬ DỤNG ĐIỂM & MÃ ƯU ĐÃI */}
                  <button className="w-full h-8 bg-white border border-gray-300 hover:bg-gray-50 text-[#0073BA] font-bold text-[12px] flex items-center justify-between px-3 cursor-pointer transition shadow-2xs mt-0.5">
                    <span className="mx-auto">SỬ DỤNG ĐIỂM & MÃ ƯU ĐÃI</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                  </button>
                </div>

                {/* 2. Chương trình khuyến mại Header */}
                <div className="bg-[#e2edf4] border-b border-gray-300 px-3 py-1.5 flex items-center gap-1.5 font-bold text-[#0073BA] text-[13px]">
                  <Gift className="w-4 h-4 text-[#0073BA]" />
                  <span>Chương trình khuyến mại</span>
                </div>

                {/* Search CTKM */}
                <div className="p-2 bg-white border-b border-gray-200">
                  <div className="bg-white border border-gray-300 h-7 flex items-center justify-between pl-2 pr-1">
                    <input 
                      type="text" 
                      value={searchPromoQuery}
                      onChange={(e) => setSearchPromoQuery(e.target.value)}
                      placeholder="Tìm kiếm CTKM" 
                      className="w-full h-full text-[13px] outline-none border-none text-gray-800 placeholder-gray-400"
                    />
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </div>

                {/* Promos List */}
                <div className="flex-1 bg-white overflow-y-auto">
                  {filteredPromos.map((promo, idx) => {
                    const isHighlighted = highlightedPromoIndex === idx;
                    const isChecked = selectedPromos.includes(promo.id);

                    return (
                      <div 
                        key={promo.id}
                        onClick={() => {
                          setHighlightedPromoIndex(idx);
                          if (isChecked) {
                            setSelectedPromos(selectedPromos.filter(id => id !== promo.id));
                          } else {
                            setSelectedPromos([...selectedPromos, promo.id]);
                          }
                        }}
                        className={`px-3 py-2 border-b border-gray-100 flex items-start justify-between cursor-pointer transition-colors ${
                          isHighlighted ? 'bg-[#9ec8e4]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                          <div className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 bg-white ${
                            isChecked ? 'border-[#0073BA]' : 'border-gray-300'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 text-gray-800 stroke-[3]" />}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-[13px] leading-tight ${
                              isHighlighted ? 'text-[#00497D] font-bold' : isChecked ? 'text-[#0073BA] font-medium' : 'text-gray-800 font-normal'
                            }`}>
                              {promo.label}
                            </span>
                            {promo.desc && (
                              <span className="text-[11px] text-gray-500 truncate max-w-[180px] mt-0.5">
                                {promo.desc}
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="text-[#0073BA] hover:text-[#00497D] p-0.5 mt-0.5 shrink-0 cursor-pointer"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* 3. Bottom controls */}
                <div className="p-2 bg-[#f0f4f8] border-t border-gray-300 flex flex-col gap-1.5 shrink-0">
                  {/* Row 1: KHUYẾN MẠI KHÁC & Arrows */}
                  <div className="flex gap-1.5">
                    <button className="flex-1 h-8 bg-white border border-gray-300 hover:bg-gray-50 text-[#0073BA] font-bold text-[12px] flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs">
                      <Plus className="w-4 h-4 text-[#008A45] stroke-[2.5]" />
                      <span>KHUYẾN <span className="underline">M</span>ẠI KHÁC</span>
                    </button>
                    <button className="w-8 h-8 bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-600 cursor-pointer shadow-2xs">
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="w-8 h-8 bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-600 cursor-pointer shadow-2xs">
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Row 2: GIÁ THEO KHUNG GIỜ & Phím tắt */}
                  <div className="flex gap-1.5">
                    <button className="flex-1 h-9 bg-white border border-gray-300 hover:bg-gray-50 text-[#0073BA] font-bold text-[12px] flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs">
                      <div className="w-4 h-4 rounded-full border border-[#0073BA] flex items-center justify-center text-[#0073BA] text-[10px] font-bold">
                        $
                      </div>
                      <span>GIÁ THEO KHUNG GIỜ</span>
                    </button>
                    <button className="w-[85px] h-9 bg-[#e2edf4] border border-gray-300 hover:bg-gray-200 text-[#0073BA] font-bold text-[12px] flex flex-col items-center justify-center leading-tight cursor-pointer transition shadow-2xs">
                      <CornerUpRight className="w-3.5 h-3.5 text-[#0073BA]" />
                      <span>Phím tắt</span>
                    </button>
                  </div>
                </div>

              </aside>

              {/* Right Column Detail Content */}
              <main className="flex-1 bg-white flex flex-col overflow-hidden border-l border-gray-200 text-left">
                
                {/* Sub Header of Receipt detail matching screenshot 2 */}
                <div className="bg-[#eef2f5] border-b border-gray-300 h-8 px-2 flex items-center justify-between shrink-0 text-[13px] font-sans">
                  <div className="flex items-center gap-2 flex-1 mr-4">
                    <button 
                      onClick={() => setPaymentOrder(null)} 
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 bg-[#e5e9ec] hover:bg-gray-200 text-gray-600 transition shrink-0 cursor-pointer"
                      title="Thu gọn / Quay lại"
                    >
                      <ChevronsLeft className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button 
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 bg-[#e5e9ec] hover:bg-gray-200 text-gray-600 transition shrink-0 cursor-pointer"
                      title="Sửa đơn hàng"
                    >
                      <Pencil className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <span className="text-[#0073BA] font-bold text-[13px] ml-1 shrink-0 font-sans flex items-center gap-1.5">
                      <span>{paymentOrder.code}</span>
                      {(paymentOrder.isPickupAtStore || paymentOrder.code === 'SPF-0040' || paymentOrder.code === 'SPF-2170') && (
                        <span className="bg-[#E53935] text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Lấy tại quán
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-gray-800 text-[13px] font-normal">
                    <span>06/01/2021 10:39</span>
                  </div>
                </div>

                {/* Main Table Area */}
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#e4ecf0] text-gray-700 uppercase font-black tracking-wide text-[13px] sticky top-0 shadow-sm z-10">
                      <tr>
                        <th className="py-2.5 px-4 text-left font-extrabold w-[45%]">Tên món</th>
                        <th className="py-2.5 px-2 text-center font-extrabold w-[15%]">SL</th>
                        <th className="py-2.5 px-3 text-right font-extrabold w-[20%]">Đơn giá</th>
                        <th className="py-2.5 px-4 text-right font-extrabold w-[20%]">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentOrder.items.map((item) => {
                        const unitPrice = item.originalPrice || Math.round(item.totalPrice / item.qty);
                        return (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-sky-50 transition-colors">
                            <td className="py-3 px-4 text-[#334155] font-bold text-left">
                              <span>{item.name}</span>
                            </td>
                            <td className="py-3 px-2 text-center text-gray-900 font-bold font-mono">
                              {item.qty},00
                            </td>
                            <td className="py-3 px-3 text-right text-gray-600 font-medium font-mono">
                              {formatVND(unitPrice)}
                            </td>
                            <td className="py-3 px-4 text-right text-[#0f172a] font-bold font-mono flex items-center justify-end gap-2.5">
                              <span>{formatVND(item.totalPrice)}</span>
                              {/* Gift present label icon */}
                              <div className="w-5 h-5 flex items-center justify-center rounded bg-[#ffeaeb] border border-[#ffcfd2] text-[#ff4c57] relative cursor-pointer shadow-sm" title="Hàng khuyến mại/Quà tặng">
                                <span className="text-[13px] leading-none">🎁</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Calculations Bottom Area */}
                <div className="bg-[#fcfdfd] border-t border-gray-300 p-4 shrink-0 flex gap-4 text-left">
                  
                  {/* Left Column Calculus */}
                  <div className="w-1/2 flex flex-col gap-2.5 border-r border-[#cbd5e1] pr-4">
                    <div className="flex justify-between items-center text-gray-600 font-bold text-left">
                      <span>Thành tiền:</span>
                      <span className="text-gray-900 font-mono font-black text-sm">{formatVND(itemsSum)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sky-700 font-bold text-left">
                      <span className="flex items-center gap-1">
                        <span>Phí dịch vụ:</span>
                        <span className="w-3.5 h-3.5 rounded-full border border-sky-400 text-sky-600 flex items-center justify-center text-[13px] cursor-help" title="Gồm phí vận chuyển và phí kết nối nền tảng">i</span>
                      </span>
                      <span className="font-mono text-sm">{formatVND(serviceFee)}</span>
                    </div>

                    <div className="border-t border-gray-100 pt-2 flex flex-col gap-1.5 text-left">
                      <div className="flex justify-between items-center text-gray-700">
                        <label className="flex items-center gap-1.5 font-bold cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={applyVatReduction}
                            onChange={(e) => setApplyVatReduction(e.target.checked)}
                            className="rounded text-[#026b97] focus:ring-[#026b97] h-3.5 w-3.5"
                          />
                          <span>Áp dụng giảm thuế GTGT</span>
                        </label>
                        <span className="text-red-500 font-mono font-extrabold text-sm">
                          -{formatVND(vatDiscount)}
                        </span>
                      </div>
                      
                      {applyVatReduction && (
                        <p className="text-[13px] text-gray-500 leading-tight italic bg-amber-50 px-2 py-1.5 rounded border border-amber-200 text-left font-mono font-semibold">
                          * Đã giảm {formatVND(vatDiscount)} đồng, tương ứng 20% mức tỷ lệ % để tính thuế giá trị gia tăng theo Nghị quyết số 204/2025/QH15
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="checkbox" 
                        id="request-gtgt-invoice" 
                        checked={requestGtgtInvoice}
                        onChange={(e) => setRequestGtgtInvoice(e.target.checked)}
                        className="rounded text-[#026b97] cursor-pointer" 
                      />
                      <label htmlFor="request-gtgt-invoice" className="text-gray-500 hover:text-gray-700 cursor-pointer text-[13px] font-semibold leading-none">
                        Khách lấy hóa đơn GTGT. Xem chi tiết &gt;&gt;
                      </label>
                    </div>
                  </div>

                  {/* Right Column Calculus */}
                  <div className="w-1/2 flex flex-col gap-2 pl-4 text-left font-sans select-none justify-between">
                    
                    {/* Row 1: Tổng thanh toán */}
                    <div className="flex justify-between items-center text-[13px] font-bold text-gray-900 mt-1">
                      <span>Tổng thanh toán</span>
                      <span className="font-bold">{formatVND(itemsSum)}</span>
                    </div>

                    {/* Row 2: Voucher & Điểm buttons */}
                    <div className="flex items-center gap-2 my-0.5">
                      <button 
                        className="bg-[#f0f2f4] hover:bg-gray-200 border border-gray-300 px-2.5 py-1 flex items-center gap-1.5 text-[13px] text-gray-800 cursor-pointer transition"
                        title="Voucher"
                      >
                        <Gift className="w-4 h-4 text-[#e06500]" />
                        <span>Voucher</span>
                      </button>
                      <button 
                        className="bg-[#f0f2f4] hover:bg-gray-200 border border-gray-300 px-3 py-1 text-[13px] font-bold text-[#0073BA] cursor-pointer transition"
                        title="Điểm"
                      >
                        Điểm
                      </button>
                    </div>

                    {/* Row 3: Chiết khấu ĐTGH (20%) */}
                    <div className="flex justify-between items-center text-[13px] text-[#0073BA]">
                      <span className="cursor-pointer hover:underline">Chiết khấu ĐTGH (20%)</span>
                      <span className="text-gray-900 font-normal">{formatVND(Math.round(itemsSum * 0.2))}</span>
                    </div>

                    {/* Row 4: Còn phải thu */}
                    <div className="flex justify-between items-center text-[15px] font-bold text-gray-900 mt-1">
                      <span className="font-extrabold">Còn phải thu</span>
                      <span className="font-extrabold text-[20px] text-gray-900">{formatVND(grandTotal)}</span>
                    </div>

                  </div>

                </div>

                {/* Bottom gray action bar and back button */}
                <div className="bg-[#f0f2f4] border-t border-gray-300 h-14 px-3 flex items-center justify-between shrink-0">
                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={() => setPaymentOrder(null)}
                      className="h-10 px-4 bg-white hover:bg-gray-100 text-[#026b97] border border-gray-300 rounded font-black text-[13px] shadow-sm flex items-center gap-1.5 transition active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>QUAY LẠI</span>
                    </button>

                    <button
                      id="cancel-payment-order-btn"
                      onClick={() => {
                        setRejectOrderId(paymentOrder.id);
                        setRejectReasonCustom('Hết món ăn');
                        setShowRejectModal(true);
                      }}
                      className="h-10 px-4 bg-white text-[#DA251C] border border-gray-300 hover:bg-red-50 text-xs sm:text-sm font-bold transition rounded flex items-center justify-center cursor-pointer uppercase"
                    >
                      HỦY ĐƠN
                    </button>
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      id="collect-money-payment-order-btn"
                      onClick={() => {
                        setCollectMoneyOrderData({
                          id: paymentOrder.id,
                          code: paymentOrder.code,
                          customerName: paymentOrder.customerName || paymentOrder.channel,
                          totalPrice: paymentOrder.totalPrice,
                          isBookRow: false
                        });
                      }}
                      className="h-10 px-5 bg-[#FF8000] hover:bg-[#e67300] text-white text-xs sm:text-sm font-bold transition rounded flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                    >
                      <DollarSign className="w-5 h-5 text-white" />
                      <span>Thu tiền</span>
                    </button>

                    <button
                      id="delivery-payment-order-btn"
                      onClick={() => {
                        setShippedOrderIds((prev) => [...prev, paymentOrder.id]);
                        setToastMessage(`Đơn hàng ${paymentOrder.code} đã sẵn sàng giao`);
                        setTimeout(() => {
                          setToastMessage(null);
                        }, 3000);
                        setPaymentOrder(null);
                        setShowDeliveryBook(true);
                        setDeliveryBookPartnerTab('shopeefood');
                      }}
                      className="h-10 px-5 bg-[#008A45] hover:bg-[#007338] text-white text-xs sm:text-sm font-bold transition rounded flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                    >
                      <DeliveryBikeIcon className="w-5 h-5 text-white" />
                      <span>Giao hàng</span>
                    </button>
                  </div>
                </div>

              </main>

            </div>

            {/* Blue status bar on bottom of MISA CUKCUK */}
            <footer className="h-6 bg-[#026b97] text-sky-100 flex items-center justify-between px-3 text-[13px] shrink-0 font-medium">
              <div>MAKT - cttrang.cukcuk2.misa.local</div>
              <div className="font-mono">Tổng đài tư vấn: 024 7108 8800 | OVR | NUM | {displayDateTime}</div>
            </footer>

            {/* MISA CUKCUK Thu tiền Popup modal */}
            {showPaymentCollectModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 font-sans text-xs text-[#333] select-none text-left">
                <div className="w-[660px] max-w-full bg-white rounded shadow-2xl border border-[#026b97] flex flex-col overflow-hidden animate-in fade-in duration-200">
                  
                  {/* Title bar */}
                  <div className="h-10 bg-[#026b97] text-white flex items-center justify-between px-3.5 font-bold shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold tracking-wide uppercase">THU TIỀN</span>
                      <span className="text-[10px] bg-sky-950 bg-opacity-30 rounded px-1.5 py-0.5 ml-1 select-none font-mono font-medium">F9</span>
                    </div>
                    <button 
                      onClick={() => setShowPaymentCollectModal(false)}
                      className="text-sky-100 hover:text-white p-1 rounded transition"
                      title="Đóng (ESC)"
                    >
                      <X className="w-4 h-4 cursor-pointer" />
                    </button>
                  </div>

                  {/* Main interface inside popup */}
                  <div className="flex-1 flex overflow-hidden min-h-[385px] bg-[#f0f4f8]">
                    
                    {/* Left main area: choice of method, details of money */}
                    <div className="flex-1 bg-[#fcfdfe] p-4 flex flex-col gap-3.5">
                      
                      {/* Method Selector Tabs */}
                      <div className="flex bg-[#cbd5e1] p-0.5 rounded gap-0.5 shrink-0">
                        <button 
                          type="button"
                          onClick={() => {
                            setPaymentMethod('cash');
                            setEnteredCustomerPayment(grandTotal);
                          }}
                          className={`flex-1 py-2 font-bold rounded text-center transition flex justify-center items-center gap-1.5 ${
                            paymentMethod === 'cash' ? 'bg-[#026b97] text-white shadow-sm' : 'hover:bg-slate-200 text-gray-700'
                          }`}
                        >
                          <span>💵 Tiền mặt</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setPaymentMethod('transfer');
                            setEnteredCustomerPayment(grandTotal);
                          }}
                          className={`flex-1 py-2 font-bold rounded text-center transition flex justify-center items-center gap-1.5 ${
                            paymentMethod === 'transfer' ? 'bg-[#026b97] text-white shadow-sm' : 'hover:bg-slate-200 text-gray-700'
                          }`}
                        >
                          <span>📲 Chuyển khoản (QR)</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setPaymentMethod('card');
                            setEnteredCustomerPayment(grandTotal);
                          }}
                          className={`flex-1 py-2 font-bold rounded text-center transition flex justify-center items-center gap-1.5 ${
                            paymentMethod === 'card' ? 'bg-[#026b97] text-white shadow-sm' : 'hover:bg-slate-200 text-gray-700'
                          }`}
                        >
                          <span>💳 Thẻ ATM/Visa</span>
                        </button>
                      </div>

                      {/* Dynamic Details Content depending on selection */}
                      <div className="flex-1 flex flex-col gap-3.5">
                        
                        {/* Row: Khách phải trả */}
                        <div className="flex items-center justify-between bg-sky-50 bg-opacity-35 border border-sky-100 rounded p-3 h-12">
                          <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">KHÁCH PHẢI TRẢ (1):</span>
                          <span className="font-mono font-black text-lg text-[#026b97]">{formatVND(grandTotal)}</span>
                        </div>

                        {paymentMethod === 'cash' && (
                          <div className="flex-1 flex flex-col gap-3.5">
                            {/* Row Input: Khách đưa */}
                            <div className="flex items-center justify-between border border-gray-300 bg-white rounded p-1.5 focus-within:ring-1 focus-within:ring-[#026b97] h-12">
                              <span className="font-semibold text-gray-700 pl-1.5 text-[11px] uppercase tracking-wider">KHÁCH ĐƯA (2):</span>
                              <div className="flex items-center gap-1.5">
                                <input 
                                  type="text" 
                                  value={enteredCustomerPayment.toLocaleString('vi-VN')}
                                  onChange={(e) => {
                                    const numeric = parseInt(e.target.value.replace(/\./g, '')) || 0;
                                    setEnteredCustomerPayment(numeric);
                                  }}
                                  className="w-40 text-right font-mono font-bold text-base text-[#1aa059] border-none focus:outline-none bg-transparent pr-1"
                                />
                                <button 
                                  type="button"
                                  onClick={() => setEnteredCustomerPayment(0)}
                                  className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded p-1 w-5 h-5 flex items-center justify-center text-[10px]"
                                >
                                  ✖
                                </button>
                              </div>
                            </div>

                            {/* Grid suggestions for speedy select */}
                            <div className="grid grid-cols-3 gap-1.5 mt-1">
                              <button 
                                type="button"
                                onClick={() => setEnteredCustomerPayment(grandTotal)}
                                className="py-2 bg-sky-50 text-sky-800 font-bold border border-sky-200 rounded hover:bg-sky-100 font-mono transition text-[10px]"
                              >
                                Đúng số tiền
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  const snapTenK = Math.ceil(grandTotal / 10000) * 10000;
                                  setEnteredCustomerPayment(snapTenK);
                                }}
                                className="py-2 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 font-mono font-bold text-gray-700 transition text-[10px]"
                              >
                                Tròn chục nghìn
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  const snapFiftyK = Math.ceil(grandTotal / 50000) * 50000;
                                  setEnteredCustomerPayment(snapFiftyK);
                                }}
                                className="py-2 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 font-mono font-bold text-gray-700 transition text-[10px]"
                              >
                                Tròn 50 nghìn
                              </button>

                              <button 
                                type="button"
                                onClick={() => {
                                  const snapOneHundredK = Math.ceil(grandTotal / 100000) * 100000;
                                  setEnteredCustomerPayment(snapOneHundredK);
                                }}
                                className="py-2 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 font-mono font-bold text-gray-700 transition text-[10px]"
                              >
                                Tròn 100 nghìn
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  const snapFiveHundredK = Math.ceil(grandTotal / 500000) * 500000;
                                  setEnteredCustomerPayment(snapFiveHundredK);
                                }}
                                className="py-2 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 font-mono font-bold text-gray-700 transition text-[10px]"
                              >
                                Tròn 500 nghìn
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  setEnteredCustomerPayment(prev => prev + 500000);
                                }}
                                className="py-2 bg-amber-50 border border-amber-200 text-amber-805 font-bold rounded hover:bg-amber-100 font-mono transition text-[10px]"
                              >
                                +500K VND
                              </button>
                            </div>

                            {/* Tiền thừa / Tiền thiếu display */}
                            {(() => {
                              const balance = enteredCustomerPayment - grandTotal;
                              return (
                                <div className="flex-1 flex flex-col justify-end mt-2">
                                  <div className={`p-3 rounded border flex items-center justify-between ${
                                    balance >= 0 
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                                      : 'bg-[#fff5f5] border-[#ffcfd2] text-red-950'
                                  }`}>
                                    <span className="font-bold text-[10px] uppercase tracking-wider">
                                      {balance >= 0 ? 'TIỀN THỪA TRẢ KHÁCH (3):' : 'KHÁCH THIẾU TÀI CHÍNH:'}
                                    </span>
                                    <span className={`font-mono font-black text-lg ${
                                      balance >= 0 ? 'text-[#1aa059]' : 'text-red-500 animate-pulse'
                                    }`}>
                                      {formatVND(Math.abs(balance))}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}

                          </div>
                        )}

                        {paymentMethod === 'transfer' && (
                          <div className="flex-1 flex flex-col items-center justify-center p-3 select-none text-center bg-gray-50 rounded border border-gray-200 gap-2.5">
                            <p className="text-gray-500 font-bold mb-0.5 text-[10px]">QUÉT MÃ QR CHUYỂN KHOẢN (MB Bank / NAPAS)</p>
                            <div className="relative p-1.5 bg-white rounded border-2 border-dashed border-sky-300 flex items-center justify-center shadow-md select-text shrink-0">
                              <img 
                                src={`https://img.vietqr.io/image/MB-02471088800-compact2.png?amount=${grandTotal}&addInfo=Chuyen%20khoan%20cukcuk%20${paymentOrder.code}&accountName=NHA%20HANG%20PHONG%20DE`}
                                alt="VietQR" 
                                className="w-[155px] h-[155px] block"
                                referrerPolicy="referrer"
                              />
                              <div className="absolute inset-x-0 bottom-0 py-0.5 bg-sky-600 text-white font-extrabold text-[8px] uppercase tracking-wider rounded-b">
                                Quét tự động
                              </div>
                            </div>
                            <div className="flex flex-col gap-0.5 justify-center items-center text-gray-600 font-bold font-mono text-[9px] mt-0.5">
                              <span>Ngân hàng Quân Đội (MB Bank) | STK: 02471088800</span>
                              <span>Chủ TK: NHA HANG PHONG DÊ</span>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'card' && (
                          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 rounded border border-gray-200 gap-3 text-center">
                            <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 animate-bounce">
                              <Save className="w-7 h-7 text-sky-600" />
                            </div>
                            <p className="text-gray-600 font-bold text-center">QUẸT HOẶC CẮM THẺ POS</p>
                            <div className="w-full flex flex-col gap-1 text-left">
                              <div className="text-[10px] text-gray-500 font-bold">Mã số giao dịch POS (Nếu có):</div>
                              <input 
                                type="text" 
                                placeholder="Nhập mã giao dịch..." 
                                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#026b97] font-mono focus:outline-none" 
                              />
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium font-sans">Liên kết rơ-le thiết bị POS MISA CUKCUK tự động</span>
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Right side area: summary, receipt, checklists */}
                    <div className="w-[230px] border-l border-gray-200 p-4 bg-gray-50 flex flex-col gap-4 text-left">
                      
                      <div className="flex flex-col gap-2">
                        <span className="font-extrabold text-[#026b97] text-[10px] uppercase tracking-wide border-b border-gray-200 pb-1 flex items-center gap-1 shrink-0">
                          <User className="w-3.5 h-3.5" />
                          <span>Thông tin đơn hàng</span>
                        </span>
                        
                        <div className="flex flex-col gap-1.5 text-gray-600 font-medium">
                          <div className="flex justify-between">
                            <span>Khách hàng:</span>
                            <span className="text-gray-900 font-bold">{paymentOrder.customerName || 'Khách vãng lai'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mã hóa đơn:</span>
                            <span className="text-gray-900 font-bold font-mono">{paymentOrder.code}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Thu ngân:</span>
                            <span className="text-[#026b97] font-bold">h_anh26</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SĐT:</span>
                            <span className="text-gray-900 font-bold font-mono">{paymentOrder.customerPhone || 'Không có'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-2 mt-1">
                        <span className="font-extrabold text-[#026b97] text-[10px] uppercase tracking-wide border-b border-gray-200 pb-1">
                          Tính năng khác
                        </span>

                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-600">
                            <input 
                              type="checkbox" 
                              checked={printBillAfterCheck}
                              onChange={(e) => setPrintBillAfterCheck(e.target.checked)}
                              className="rounded text-[#026b97] focus:ring-[#026b97] h-3.5 w-3.5"
                            />
                            <span>Tự động in hóa đơn nhiệt</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-600">
                            <input 
                              type="checkbox" 
                              checked={openDrawerAfterCheck}
                              onChange={(e) => setOpenDrawerAfterCheck(e.target.checked)}
                              className="rounded text-[#026b97] focus:ring-[#026b97] h-3.5 w-3.5"
                            />
                            <span>Mở ngăn kéo đựng tiền</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-not-allowed select-none opacity-50 font-medium text-gray-400">
                            <input 
                              type="checkbox" 
                              disabled 
                              checked={true}
                              className="rounded text-gray-400 h-3.5 w-3.5 cursor-not-allowed"
                            />
                            <span>Đồng bộ báo cáo thuế</span>
                          </label>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Footer action bar inside popup */}
                  <div className="h-14 bg-gray-100 border-t border-gray-200 px-4 flex items-center justify-between shrink-0">
                    <button 
                      type="button"
                      onClick={() => setShowPaymentCollectModal(false)}
                      className="h-10 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded font-bold text-gray-750 transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>❌ HỦY BỎ</span>
                    </button>

                    <div className="flex gap-2">
                      {paymentMethod === 'cash' && (enteredCustomerPayment < grandTotal) && (
                        <div className={`text-[10px] font-bold px-2 flex items-center mr-1 ${
                          isGrab 
                            ? 'text-sky-700 bg-sky-50 border border-sky-200' 
                            : 'text-[#0973B9] bg-[#F0F6FE] border border-[#0973B9]/30'
                        }`}>
                          Vui lòng nhập tiền khách đưa đủ trước
                        </div>
                      )}
                      <button 
                        type="button"
                        onClick={() => {
                          handleCompletePayment();
                          setShowPaymentCollectModal(false);
                        }}
                        disabled={paymentMethod === 'cash' && enteredCustomerPayment < grandTotal}
                        className={`h-10 px-8 font-black rounded flex items-center justify-center gap-1.5 shadow transition text-xs tracking-wide text-white ${
                          (paymentMethod === 'cash' && enteredCustomerPayment < grandTotal)
                            ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                            : 'bg-[#1aa059] hover:bg-[#168a4d] active:scale-95 cursor-pointer'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>ĐỒNG Ý (F9)</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}



            {/* Immersive Kitchen Print Simulation Overlay */}
            {showKitchenPrintOverlay && kitchenPrintOrder && (
              <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm font-sans text-xs select-none">
                <div className="w-[440px] max-w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-left text-slate-100">
                  
                  {/* Header info */}
                  <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0973B9] flex items-center justify-center text-white font-bold text-xs shrink-0 animate-ping">
                        🖨️
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#0973B9] flex items-center justify-center text-white font-bold text-xs absolute shrink-0">
                        🖨️
                      </div>
                      <div className="flex flex-col gap-0.5 ml-1">
                        <span className="font-extrabold text-sm tracking-wide text-white uppercase flex items-center gap-2">
                          MISA CUKCUK - TRUYỀN TẢI IN BẾP
                          <span className="bg-sky-500 text-[8px] px-1 py-0.5 rounded text-slate-950 font-black animate-pulse">AUTOMATIC</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Đang tự động in mẫu in gửi bếp...</span>
                      </div>
                    </div>
                    <div className="text-right text-slate-400 font-mono text-[10px]">
                      PORT: PRINTER_LPT1
                    </div>
                  </div>

                  {/* Main printed outputs simulator - Centered kitchen receipt paper */}
                  <div className="p-6 flex flex-col bg-slate-950 max-h-[70vh] overflow-y-auto items-stretch">
                    
                    {/* Simulated Kitchen Receipt paper */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                        📝 Mẫu phiếu in bếp (Kitchen Slip)
                      </span>
                      <div className="bg-white text-slate-900 p-5 rounded shadow-xl border border-slate-300 font-mono text-[11px] leading-relaxed relative overflow-hidden select-text min-h-[380px]">
                        {/* Cut lines paper visual effect */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-gray-200 to-transparent"></div>
                        
                        <div className="text-center font-bold">
                          <div className="text-[13px] font-black">BẾP CHẾ BIẾN (KITCHEN)</div>
                          <div className="text-[9px] text-gray-500 font-sans tracking-tight mt-0.5">*** PHIẾU BÁO CUNG ỨNG - KHÔNG THANH TOÁN ***</div>
                          <div className="border-t border-dashed border-gray-400 my-2"></div>
                        </div>

                        <div className="flex justify-between items-center text-xs my-1">
                          <span className="font-bold">MÃ ĐƠN HÀNG:</span>
                          <span className="font-black text-lg text-black">{kitchenPrintOrder.code}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-600 mb-2">
                          <span>Giờ đặt: {kitchenPrintOrder.orderTime.split(' - ')[0]}</span>
                          <span>In: {new Date().toLocaleTimeString('vi-VN')}</span>
                        </div>

                        <div className="border-t border-dashed border-gray-400 my-1"></div>
                        <div className="grid grid-cols-12 font-bold text-gray-800 py-1 border-b border-gray-150">
                          <span className="col-span-8">TÊN MÓN ĂN</span>
                          <span className="col-span-2 text-center">SL</span>
                          <span className="col-span-2 text-right">G.CHÚ</span>
                        </div>

                        <div className="flex flex-col gap-1.5 py-1.5">
                          {kitchenPrintOrder.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 items-start py-0.5 border-b border-gray-100 last:border-0 text-xs">
                              <span className="col-span-8 font-extrabold text-black">{item.name}</span>
                              <span className="col-span-2 text-center font-black text-sm bg-gray-100 rounded py-0.5">{item.qty}</span>
                              <span className={`col-span-2 text-right text-[10px] font-sans font-semibold ${isGrab ? 'text-sky-700' : 'text-[#0973B9]'}`}>{item.note || 'Không'}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-dashed border-gray-400 my-2"></div>
                        <div className="text-[10px] text-gray-600">
                          <div className="font-bold text-black font-sans mb-1 text-[11px]">Ghi chú đơn:</div>
                          <p className="font-sans italic leading-relaxed text-gray-700 bg-yellow-50 p-2 border border-yellow-100 rounded">
                            {kitchenPrintOrder.note || 'Không có ghi chú đơn hàng từ khách hàng.'}
                          </p>
                        </div>
                        
                        <div className="text-center font-sans text-[8px] font-black tracking-widest text-gray-400 mt-6 select-none uppercase">
                          *MISA-CUKCUK-KITCHEN*
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Progressive loading simulation bottom bar */}
                  <div className="p-4 bg-slate-800 border-t border-slate-700 flex flex-col gap-2 shrink-0">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                      <span className="flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-[#0973B9] shrink-0"></span>
                        Đang truyền dữ liệu in & gửi bếp...
                      </span>
                      <span>95% Hoàn thành</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#0973B9] to-sky-400 h-2 rounded-full w-[95%] transition-all duration-1000"></div>
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium text-center font-sans tracking-wide mt-0.5">
                      ⚠️ Khuyến nghị: Không tắt màn hình hoặc can thiệp cáp kết nối máy in nhiệt MISA CUKCUK.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Immersive Delivery Print Simulation Overlay */}
            {showDeliveryPrintOverlay && deliveryPrintOrder && (
              <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-xs font-sans text-xs select-none text-left">
                <div className="w-[440px] max-w-full max-h-[90vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-750 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-100">
                  
                  {/* Header info */}
                  <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                        <div className="w-8 h-8 rounded-full bg-[#1aa059] flex items-center justify-center text-white font-bold text-xs shrink-0">
                          🖨️
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5 ml-1">
                        <span className="font-extrabold text-sm tracking-wide text-white uppercase flex items-center gap-2">
                          IN PHIẾU GIAO HÀNG
                          <span className="bg-emerald-500 text-[8px] px-1.5 py-0.5 rounded text-slate-950 font-black animate-pulse">AUTOMATIC</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Đang tự động in phiếu giao hàng...</span>
                      </div>
                    </div>
                    <div className="text-right text-slate-400 font-mono text-[10px]">
                      PORT: PRINTER_LPT2
                    </div>
                  </div>

                  {/* Main printed outputs simulator - Centered delivery receipt paper */}
                  <div className="p-6 flex flex-col bg-slate-950 flex-1 min-h-0 overflow-y-auto items-stretch">
                    
                    {/* Simulated Delivery Slip paper */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                        📝 Phiếu giao hàng (Delivery Slip)
                      </span>
                      <div className="bg-white text-slate-900 p-5 rounded shadow-xl border border-slate-300 font-mono text-[11px] leading-relaxed relative overflow-hidden select-text min-h-[380px]">
                        {/* Cut lines paper visual effect */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-gray-200 to-transparent"></div>
                        
                        <div className="text-center font-bold">
                          <div className="text-[13px] font-black uppercase">NHÀ HÀNG PHONG DÊ - PHIẾU GIAO HÀNG</div>
                          <div className="text-[9px] text-gray-500 font-sans tracking-tight mt-0.5">*** HÓA ĐƠN GIAO HÀNG KHÁCH HÀNG ***</div>
                          <div className="border-t border-dashed border-gray-400 my-2"></div>
                        </div>

                        <div className="flex justify-between items-center text-xs my-1">
                          <span className="font-bold">MÃ ĐƠN HÀNG:</span>
                          <span className="font-black text-lg text-black">{deliveryPrintOrder.code}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-600 mb-2">
                          <span>Giờ đặt: {deliveryPrintOrder.orderTime.split(' - ')[0]}</span>
                          <span>In: {new Date().toLocaleTimeString('vi-VN')}</span>
                        </div>

                        <div className="border-t border-dashed border-gray-400 my-1"></div>
                        
                        {/* Recipient Details */}
                        <div className="text-[10px] text-gray-700 font-sans flex flex-col gap-1 my-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                          <div><strong>Khách hàng:</strong> {deliveryPrintOrder.customerPhone ? ('A. ' + (deliveryPrintOrder.channel === 'Grab' ? 'Grab' : 'Shopee') + ' Customer') : 'A. Tuấn'}</div>
                          <div><strong>Điện thoại:</strong> {deliveryPrintOrder.customerPhone || '01256.862.536'}</div>
                          <div><strong>Địa chỉ:</strong> {deliveryPrintOrder.deliveryAddress || 'Nhận tại cửa hàng'}</div>
                        </div>

                        <div className="border-t border-dashed border-gray-400 my-1"></div>
                        <div className="grid grid-cols-12 font-bold text-gray-800 py-1 border-b border-gray-150">
                          <span className="col-span-6">TÊN MÓN</span>
                          <span className="col-span-2 text-center">SL</span>
                          <span className="col-span-4 text-right">THÀNH TIỀN</span>
                        </div>

                        <div className="flex flex-col gap-1.5 py-1.5">
                          {deliveryPrintOrder.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 items-start py-0.5 border-b border-gray-100 last:border-0 text-xs">
                              <span className="col-span-6 font-extrabold text-black truncate">{item.name}</span>
                              <span className="col-span-2 text-center font-black text-sm bg-gray-100 rounded py-0.5">{item.qty}</span>
                              <span className="col-span-4 text-right font-black">{formatVND(item.totalPrice)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-dashed border-gray-400 my-2"></div>
                        <div className="flex justify-between font-extrabold text-black text-xs">
                          <span>TỔNG TIỀN ĐƠN:</span>
                          <span>{formatVND(deliveryPrintOrder.totalPrice)}</span>
                        </div>
                        
                        <div className="text-center font-sans text-[8px] font-black tracking-widest text-gray-400 mt-6 select-none uppercase">
                          *MISA-CUKCUK-SHIPPING*
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Progressive loading simulation bottom bar */}
                  <div className="p-4 bg-slate-800 border-t border-slate-700 flex flex-col gap-2 shrink-0">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                      <span className="flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        Đang truyền dữ liệu in phiếu giao hàng...
                      </span>
                      <span>100% Hoàn thành</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full w-full transition-all duration-1000"></div>
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium text-center font-sans tracking-wide mt-0.5">
                      ⚠️ Khuyến nghị: Không tắt màn hình hoặc can thiệp cáp kết nối máy in nhiệt MISA CUKCUK.
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>
        );
      })()}
    </div>
  );
}
