import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  Plus, 
  Globe, 
  Cloud, 
  RefreshCw, 
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
  MoreVertical,
  Check,
  Printer,
  X,
  Gift,
  Info,
  Save
} from 'lucide-react';
import { Order, OrderStatus, SpfCancelReasonCode } from '../types';

// ShopeeFood: 3 lý do hủy hợp lệ theo API
const SPF_CANCEL_REASONS: { code: SpfCancelReasonCode; label: string; desc: string }[] = [
  { code: 79, label: 'Hết món', desc: 'Món ăn / nguyên liệu đã hết' },
  { code: 80, label: 'Quán quá tải', desc: 'Nhà hàng quá tải, chuẩn bị không kịp' },
  { code: 81, label: 'Quán đóng cửa', desc: 'Cửa hàng đang đóng cửa / nghỉ lễ' }
];

// ShopeeFood: mã rút gọn in tem bàn giao (4 ký tự cuối, bỏ ký tự đặc biệt)
const shortCode = (code: string) => code.replace(/[^0-9A-Za-z]/g, '').slice(-4).toUpperCase();

interface DeliveryViewProps {
  channel: 'Grab' | 'ShopeeFood';
  orders: Order[];
  onBackToMain: () => void;
  onConfirmOrder: (orderId: string) => void;
  onCompleteOrder: (orderId: string) => void;
  onDeleteOrder?: (orderId: string, reason?: string, reasonCode?: SpfCancelReasonCode) => void;
  activeTab?: OrderStatus;
  setActiveTab?: (tab: OrderStatus) => void;
  selectedOrderId?: string | null;
  setSelectedOrderId?: (orderId: string | null) => void;
  notifications?: any[];
  onNotificationClick?: (notif: any) => void;
  // ShopeeFood: sub-state "tài xế đã lấy" + cảnh báo đơn mới + case phụ (lift lên App)
  pickedOrderIds?: string[];
  onHandoverOrder?: (order: Order) => void;
  alertingOrderIds?: string[];
  onOrderAlertSeen?: (orderId: string) => void;
  onSimulateShopeeEdit?: (orderId: string) => void;
}

export default function DeliveryView({
  channel,
  orders,
  onBackToMain,
  onConfirmOrder,
  onCompleteOrder,
  onDeleteOrder,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  selectedOrderId: externalSelectedOrderId,
  setSelectedOrderId: externalSelectedOrderIdSetter,
  notifications = [],
  onNotificationClick,
  pickedOrderIds = [],
  onHandoverOrder,
  alertingOrderIds = [],
  onOrderAlertSeen,
  onSimulateShopeeEdit
}: DeliveryViewProps) {
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
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [applyVatReduction, setApplyVatReduction] = useState(true);
  const [selectedPromos, setSelectedPromos] = useState<string[]>([]);
  const [searchPromoQuery, setSearchPromoQuery] = useState('');
  const [showPaymentCollectModal, setShowPaymentCollectModal] = useState(false);
  const [enteredCustomerPayment, setEnteredCustomerPayment] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card'>('cash');
  const [printBillAfterCheck, setPrintBillAfterCheck] = useState(true);
  const [openDrawerAfterCheck, setOpenDrawerAfterCheck] = useState(true);

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

  const [showDeliveryPrintOverlay, setShowDeliveryPrintOverlay] = useState(false);
  const [deliveryPrintOrder, setDeliveryPrintOrder] = useState<Order | null>(null);

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // ShopeeFood: lý do hủy/từ chối theo mã API (79/80/81)
  const [spfCancelReasonCode, setSpfCancelReasonCode] = useState<SpfCancelReasonCode>(79);

  // P10a: Báo hết món (multi-select món → cảnh báo hủy CẢ đơn)
  const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);
  const [outOfStockItemIds, setOutOfStockItemIds] = useState<string[]>([]);

  // P10b: Báo trễ (busy_info — không đổi trạng thái đơn)
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState<number>(15);
  const [delayNotices, setDelayNotices] = useState<Record<string, number>>({});

  // P8: highlight danh sách món khi chuyển đơn từ thông báo
  const [highlightItemsTable, setHighlightItemsTable] = useState(false);

  // Filter orders by active status & channel (completed tab includes both completed and cancelled)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const isChannelMatch = order.channel === channel;
      if (!isChannelMatch) return false;

      let isStatusMatch = false;
      if (activeTab === 'completed') {
        isStatusMatch = order.status === 'completed' || order.status === 'cancelled';
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
  }, [orders, channel, activeTab, searchQuery]);

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

  // P7: đang xem đơn SPF đang cảnh báo → tắt chuông + nhấp nháy cho đơn đó
  useEffect(() => {
    if (selectedOrder && onOrderAlertSeen && alertingOrderIds.includes(selectedOrder.id)) {
      onOrderAlertSeen(selectedOrder.id);
    }
  }, [selectedOrder?.id, alertingOrderIds]);

  // P8: chuyển đơn (từ thông báo hoặc danh sách) → cuộn tới danh sách Món + highlight 2s (chỉ SPF)
  useEffect(() => {
    if (!selectedOrderId || channel !== 'ShopeeFood') return;
    const el = document.getElementById('details-items-table');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setHighlightItemsTable(true);
    const timer = setTimeout(() => setHighlightItemsTable(false), 2000);
    return () => clearTimeout(timer);
  }, [selectedOrderId, channel]);

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
    
    // P10c: đơn SPF bị Shopee cập nhật → đóng dấu "ĐÃ CẬP NHẬT" trên phiếu bếp in lại
    const updatedStampKitchenHtml = targetOrder.updatedByShopee
      ? '<div style="border: 2px solid #000; font-weight: 900; font-size: 13px; text-align: center; padding: 4px 0; margin: 6px 0; letter-spacing: 1px;">*** ĐÃ CẬP NHẬT ***</div>'
      : '';

    const kitchenHtml = `
      <div class="kitchen-slip">
        <div class="center">
          <div class="kitchen-title">BẾP CHẾ BIẾN (KITCHEN)</div>
          <div class="kitchen-subtitle">*** PHIẾU BÁO CUNG ỨNG - KHÔNG THANH TOÁN ***</div>
          ${updatedStampKitchenHtml}
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
            ${targetOrder.driverName ? `
              <tr>
                <td style="font-weight: bold;">Tài xế nhận:</td>
                <td style="text-align: right;">${targetOrder.driverName}</td>
              </tr>
            ` : ''}
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

    // P6 — ShopeeFood: TEM BÀN GIAO — mã rút gọn cỡ lớn + Tên món/SL.
    // KHÔNG in địa chỉ khách, tên khách, tổng tiền (tài xế đối chiếu bằng app, quán không thu tiền)
    if (targetOrder.channel === 'ShopeeFood') {
      const isPickup = targetOrder.orderType === 'customer_pickup';
      const sc = shortCode(targetOrder.code);
      const spfItemsHtml = targetOrder.items.map((item: any, idx: number) => (
        '<tr>' +
          '<td style="padding: 5px 2px; font-size: 12px; font-weight: 600;">' + (idx + 1) + '. ' + item.name + '</td>' +
          '<td style="padding: 5px 2px; text-align: right; font-size: 15px; font-weight: 800;">x' + item.qty + '</td>' +
        '</tr>'
      )).join('');
      const updatedStampHtml = targetOrder.updatedByShopee
        ? '<div style="border: 2px solid #000; font-weight: 900; font-size: 13px; text-align: center; padding: 4px 0; margin: 8px 0; letter-spacing: 1px;">*** ĐÃ CẬP NHẬT ***</div>'
        : '';
      const pickupHtml = isPickup
        ? '<div style="font-size: 13px; font-weight: 900; text-align: center; border: 1.5px dashed #000; padding: 5px 0; margin: 6px 0;">KHÁCH TỰ ĐẾN LẤY<br/>Mã nhận đơn: ' + (targetOrder.pickupCode || '—') + '</div>'
        : '';

      printWindow.document.write(`
        <html>
          <head>
            <title>MISA CUKCUK - Tem Bàn Giao #${targetOrder.code}</title>
            <style>
              @page { size: 80mm auto; margin: 0; }
              body {
                font-family: 'Courier New', Courier, monospace;
                width: 74mm; margin: 0 auto; padding: 12px 4px;
                color: #000; background: #fff; font-size: 11px; line-height: 1.35;
                -webkit-print-color-adjust: exact; print-color-adjust: exact;
              }
              .center { text-align: center; }
              .divider { border-top: 1px dashed #000; margin: 6px 0; }
              table { width: 100%; border-collapse: collapse; }
              table.items-table td { border-bottom: 1px dotted #999; vertical-align: top; }
            </style>
          </head>
          <body>
            <div class="center">
              <div style="font-size: 11px; font-weight: bold;">${isPickup ? 'TEM ĐƠN TỰ ĐẾN LẤY' : 'TEM BÀN GIAO TÀI XẾ'} — SHOPEEFOOD</div>
              <div style="font-size: 44px; font-weight: 900; letter-spacing: 2px; margin: 6px 0 2px 0;">${sc}</div>
              <div style="font-size: 10px; color: #333;">Mã đầy đủ: ${targetOrder.code}</div>
              ${pickupHtml}
              ${updatedStampHtml}
              <div class="divider"></div>
            </div>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="text-align: left; border-bottom: 1.5px dashed #000; padding: 4px 0; font-size: 11px;">Tên món</th>
                  <th style="text-align: right; border-bottom: 1.5px dashed #000; padding: 4px 0; font-size: 11px;">SL</th>
                </tr>
              </thead>
              <tbody>${spfItemsHtml}</tbody>
            </table>
            <div class="divider"></div>
            <div class="center" style="font-size: 11px; font-weight: bold;">
              TỔNG SỐ MÓN: ${targetOrder.items.reduce((acc: number, item: any) => acc + item.qty, 0)}
            </div>
            <div class="center" style="font-size: 9px; color: #444; margin-top: 8px;">
              Không thu tiền tại quầy — ShopeeFood đối soát qua ví<br/>In lúc ${new Date().toLocaleTimeString('vi-VN')} · Powered by MISA CUKCUK
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() { window.print(); window.close(); }, 400);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
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
    try {
      handlePrintKitchenAndLabel(order);
    } catch (e) {
      // safe fallback if window.open is blocked by sandboxing
    }
    setKitchenPrintOrder(order);
    setShowKitchenPrintOverlay(true);
    setTimeout(() => {
      setShowKitchenPrintOverlay(false);
      setActiveTab('confirmed');
      setSelectedOrderId(order.id);
    }, 2200);
  };

  const handleDeliveryOrderWithPrint = (order: Order) => {
    try {
      handlePrintDeliverySlip(order);
    } catch (e) {
      // safe fallback if window.open is blocked by sandboxing
    }
    setDeliveryPrintOrder(order);
    setShowDeliveryPrintOverlay(true);
    setTimeout(() => {
      setShowDeliveryPrintOverlay(false);
      setShippedOrderIds((prev) => [...prev, order.id]);
    }, 2200);
  };

  // ShopeeFood: nút "GIAO HÀNG" (giữ nguyên nhãn) = in tem bàn giao + chuyển PICKED (App đặt timer auto-DELIVERED)
  const handleShopeeHandover = (order: Order) => {
    try {
      handlePrintDeliverySlip(order);
    } catch (e) {
      // safe fallback if window.open is blocked by sandboxing
    }
    setDeliveryPrintOrder(order);
    setShowDeliveryPrintOverlay(true);
    setTimeout(() => {
      setShowDeliveryPrintOverlay(false);
    }, 2200);
    if (onHandoverOrder) onHandoverOrder(order);
  };

  const handleConfirmOrderDirectly = (order: Order) => {
    onConfirmOrder(order.id);
    setActiveTab('confirmed');
    setSelectedOrderId(order.id);
  };

  // Get brand colors theme
  const isGrab = channel === 'Grab';
  const brandBg = isGrab ? 'bg-green-600' : 'bg-[#0973B9]';
  const brandText = isGrab ? 'text-green-600' : 'text-[#0973B9]';
  const brandBorder = isGrab ? 'border-green-600' : 'border-[#0973B9]';
  const brandBadgeCount = isGrab ? 'bg-green-600 text-white' : 'bg-[#0973B9] text-white';
  const tabActiveBg = isGrab ? 'bg-[#00497D] text-white' : 'bg-[#00497D] text-white';
  const rowSelectedBg = isGrab ? 'bg-[#b3d3ea] border-b border-[#a2c8e3]' : 'bg-[#F0F6FE] border-b border-[#0973B9]/30';

  const unreadCount = notifications.filter(n => !n.read).length;

  // P7: còn đơn SPF chưa được mở → nhấp nháy tab "Chưa xác nhận" liên tục
  const hasSpfAlerts = !isGrab && alertingOrderIds.length > 0;

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
            {isGrab && (
              <span 
                id="channel-leading-badge" 
                className={`w-5 h-5 rounded-full ${brandBg} text-white font-extrabold text-[9px] flex items-center justify-center`}
              >
                G
              </span>
            )}
            <span id="channel-title" className={`font-extrabold ${brandText}`}>
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
        <div id="div-head-right" className="flex items-center h-full gap-1">
          {/* Green plus order button */}
          <button id="deliv-new-order-btn" className="flex items-center gap-1 bg-transparent hover:bg-white/10 px-3 py-1.5 rounded text-white font-bold text-xs transition mr-2 uppercase border border-white/30">
            <Plus className="w-4 h-4" />
            <span>Order</span>
          </button>

          <button id="deliv-menu-btn" className="h-full px-3 flex items-center hover:bg-[#00497D] transition">
            <Menu className="w-5 h-5" />
          </button>

          {/* Vertical divider */}
          <div id="deliv-divider" className="h-5 w-px bg-white/20 mx-1"></div>

          {/* Web notification glove icon */}
          <button id="deliv-globe-btn" className="hover:bg-[#00497D] p-2 rounded relative transition">
            <Globe className="w-4 h-4" />
            <span id="deliv-glove-badge" className="absolute top-1 right-1 bg-red-600 text-[9px] font-bold text-white leading-none rounded-full min-w-4 h-4 flex items-center justify-center p-0.5">9</span>
          </button>

          {/* Cloud upload sync */}
          <button id="deliv-cloud-btn" className="hover:bg-[#00497D] p-2 rounded transition">
            <Cloud className="w-4 h-4" />
          </button>

          {/* Refresh/Exchange icon */}
          <button id="deliv-refresh-btn" className="hover:bg-[#00497D] p-2 rounded transition">
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Bell Notifications */}
          <div className="relative">
            <button 
              id="deliv-bell-btn" 
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="hover:bg-[#00497D] p-2 rounded relative transition"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span id="deliv-bell-badge" className="absolute top-1 right-1 bg-red-600 text-[9px] font-bold text-white leading-none rounded-full w-4 h-4 flex items-center justify-center p-0.5 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 top-11 z-50 w-[360px] bg-white text-gray-900 rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-3 bg-[#0973B9] text-white font-bold flex items-center justify-between">
                  <span>Thông báo đơn hàng ({unreadCount})</span>
                  <button onClick={() => setShowNotificationsDropdown(false)} className="text-white hover:text-gray-200">✕</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 font-medium">Không có thông báo mới.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          if (onNotificationClick) {
                            onNotificationClick(notif);
                          }
                          setShowNotificationsDropdown(false);
                        }}
                        className={`p-3 border-b border-gray-100 hover:bg-[#F0F6FE] cursor-pointer transition-colors flex gap-2.5 items-start text-left ${
                          notif.read ? 'bg-white opacity-75' : 'bg-[#F0F6FE]'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-[#0973B9] mt-1.5 shrink-0" style={{ visibility: notif.read ? 'hidden' : 'visible' }} />
                        <div className="flex-1 flex flex-col gap-0.5">
                          <span className="text-xs font-semibold leading-normal text-gray-900">{notif.text}</span>
                          <span className="text-[10px] text-gray-400 font-mono font-bold">{notif.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button id="deliv-clock-btn" className="hover:bg-[#00497D] p-2 rounded transition">
            <Clock className="w-4 h-4" />
          </button>

          <button id="deliv-user-btn" className="hover:bg-[#00497D] p-2 rounded transition flex items-center justify-center">
            <User className="w-4 h-4" />
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
            className={`h-full px-4 flex items-center justify-center rounded font-semibold text-center border transition relative ${
              activeTab === 'unconfirmed'
                ? isGrab ? 'bg-[#026b97] text-white border-[#02567a]' : 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } ${hasSpfAlerts ? 'animate-pulse ring-2 ring-red-500 ring-offset-1' : ''}`}
          >
            Chưa xác nhận
            {hasSpfAlerts && (
              <span id="tab-unconfirmed-alert-dot" className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
            )}
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
            <div id="col-h-total" className="w-1/4 px-1 text-right pr-3 text-xs">Tổng tiền</div>
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
                    <div id={`order-code-${order.code}`} className="w-1/4 px-1 text-left pl-3 font-semibold text-gray-900 flex items-center gap-1 flex-wrap">
                      <span className={`w-1.5 h-1.5 rounded-full ${brandBg} ${!isGrab && alertingOrderIds.includes(order.id) ? 'animate-ping bg-red-600' : ''}`}></span>
                      <span className={!isGrab && alertingOrderIds.includes(order.id) ? 'animate-pulse text-red-600' : ''}>{order.code}</span>
                      {/* SPF: badge tài xế đã lấy (PICKED) */}
                      {!isGrab && order.status === 'confirmed' && pickedOrderIds.includes(order.id) && (
                        <span id={`badge-picked-${order.code}`} className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 leading-none">
                          Tài xế đã lấy
                        </span>
                      )}
                      {/* SPF: badge đơn khách tự đến lấy */}
                      {!isGrab && order.orderType === 'customer_pickup' && (
                        <span id={`badge-pickup-${order.code}`} className="text-[9px] font-bold text-[#f26522] bg-orange-50 border border-orange-200 rounded px-1 py-0.5 leading-none">
                          🛍 Tự đến lấy
                        </span>
                      )}
                      {/* SPF: badge đơn bị Shopee cập nhật */}
                      {!isGrab && order.updatedByShopee && order.status !== 'cancelled' && (
                        <span id={`badge-updated-${order.code}`} className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 rounded px-1 py-0.5 leading-none">
                          ĐÃ CẬP NHẬT
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
              
              {/* Info Block Viewport */}
              <div id="details-header" className="bg-gray-50 p-4 border-b border-gray-200 shrink-0">
                <div id="details-header-top-row" className="flex items-center justify-between mb-2">
                  <span id="title-info-header" className="text-gray-500 text-xs font-bold uppercase tracking-wider block">Thông tin đơn hàng</span>
                </div>

                {/* P10c: banner đỏ khi Shopee sửa đơn sau khi gửi */}
                {!isGrab && selectedOrder.updatedByShopee && selectedOrder.status !== 'cancelled' && (
                  <div id="spf-updated-banner" className="bg-red-600 text-white rounded px-3 py-2 mb-2 text-xs font-bold flex items-center gap-2">
                    <span className="animate-pulse">⚠</span>
                    <span>Đơn đã được cập nhật từ ShopeeFood — kiểm tra lại danh sách món trước khi chế biến / bàn giao!</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h2 id="details-code-title" className={`text-xl font-extrabold ${brandText} tracking-tight block`}>
                    {selectedOrder.code}
                  </h2>
                  {/* SPF: badge trạng thái bàn giao tài xế (PICKED) ở header chi tiết */}
                  {!isGrab && selectedOrder.status === 'confirmed' && pickedOrderIds.includes(selectedOrder.id) && (
                    <span id="details-picked-badge" className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-full px-2 py-0.5">
                      ✓ Tài xế đã lấy
                    </span>
                  )}
                  {/* P10d: badge đơn khách tự đến lấy */}
                  {!isGrab && selectedOrder.orderType === 'customer_pickup' && (
                    <span id="details-pickup-badge" className="text-[10px] font-bold text-[#f26522] bg-orange-50 border border-orange-300 rounded-full px-2 py-0.5">
                      🛍 Khách tự đến lấy
                    </span>
                  )}
                </div>

                <div id="details-time-row" className="text-gray-700 text-xs mb-3 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Thời gian đặt: <strong className="text-gray-900">{selectedOrder.orderTime}</strong></span>
                  {/* P10b: đã báo trễ — busy_info, trạng thái đơn giữ nguyên */}
                  {!isGrab && delayNotices[selectedOrder.id] !== undefined && (
                    <span id="spf-delay-notice" className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-300 rounded-full px-2 py-0.5">
                      ⏱ Đã báo trễ +{delayNotices[selectedOrder.id]} phút
                    </span>
                  )}
                </div>

                {/* Additional detailed items (thêm chi tiết đơn hàng as user requested) */}
                <div id="detail-recipient-box" className="bg-white border border-gray-200 rounded-md p-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-1.5" id="c-phone-row">
                    <Phone className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-gray-500 block">SĐT khách hàng</span>
                      <strong className="text-gray-800">{selectedOrder.customerPhone || 'Không có SĐT'}</strong>
                    </div>
                  </div>
                  
                  {/* P10d: đơn tự đến lấy — thay dòng tài xế bằng Mã nhận đơn, ẩn địa chỉ giao */}
                  {!isGrab && selectedOrder.orderType === 'customer_pickup' ? (
                    <div className="flex items-start gap-1.5" id="c-driver-row">
                      <span className="text-base leading-none mt-0.5 shrink-0">🛍</span>
                      <div>
                        <span className="text-gray-500 block">Khách tự đến lấy — Mã nhận đơn</span>
                        <strong className="text-[#f26522] text-sm tracking-widest">{selectedOrder.pickupCode || '—'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-1.5" id="c-driver-row">
                      <Truck className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-gray-500 block">Tài xế giao hàng</span>
                        <strong className="text-gray-800">{selectedOrder.driverName || 'Chưa phân phối tài xế'}</strong>
                        {selectedOrder.driverPhone && <span className="text-gray-500 block text-[10px]">{selectedOrder.driverPhone}</span>}
                      </div>
                    </div>
                  )}

                  {!(!isGrab && selectedOrder.orderType === 'customer_pickup') && (
                    <div className="flex items-start gap-1.5 md:col-span-2 border-t border-gray-100 pt-2 mt-1" id="c-address-row">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-gray-500 block">Địa chỉ giao hàng</span>
                        <span className="text-gray-700 font-semibold">{selectedOrder.deliveryAddress || 'Nhận tại cửa hàng'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List Table inside Detail Panel */}
              {/* P8: highlight ring 2s khi chuyển đơn từ thông báo (chỉ SPF) */}
              <div id="details-items-table" className={`flex-1 overflow-y-auto transition-shadow duration-500 ${highlightItemsTable ? 'ring-2 ring-inset ring-[#0973B9]' : ''}`}>
                <div id="table-header-items" className="flex bg-[#ededed] border-b border-[#ccc] text-gray-700 font-bold sticky top-0 z-10 h-7 items-center">
                  <div className="w-[32%] px-2 text-left pl-4 text-xs">Tên món</div>
                  <div className="w-[18%] px-2 text-right text-xs">Đơn giá</div>
                  <div className="w-[10%] px-1 text-center text-xs">SL</div>
                  <div className="w-[20%] px-2 text-right text-xs">Thành tiền</div>
                  <div className="w-[20%] px-2 text-left pr-4 text-xs">Ghi chú món</div>
                </div>

                <div id="table-body-items" className="divide-y divide-gray-100">
                  {selectedOrder.items.map((item, index) => (
                    <div 
                      key={item.id} 
                      id={`item-row-${index}`}
                      className="flex items-center py-2.5 bg-white hover:bg-gray-50 text-gray-850 cursor-default select-none border-b border-gray-100"
                    >
                      <div className="w-[32%] px-2 pl-4 font-semibold text-gray-900 truncate" id={`item-name-${index}`} title={item.name}>
                        {item.name}
                      </div>
                      <div className="w-[18%] px-2 text-right text-gray-650 font-mono" id={`item-price-${index}`}>
                        {formatVND(item.originalPrice || (item.totalPrice / (item.qty || 1)))}
                      </div>
                      <div className="w-[10%] px-1 text-center text-gray-600 font-mono" id={`item-qty-${index}`}>
                        {item.qty.toFixed(2).replace('.', ',')}
                      </div>
                      <div className="w-[20%] px-2 text-right font-bold text-gray-800 font-mono" id={`item-total-${index}`}>
                        {formatVND(item.totalPrice)}
                      </div>
                      <div className="w-[20%] px-2 text-left pr-4 text-gray-500 italic truncate" id={`item-note-${index}`} title={item.note || ''}>
                        {item.note || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom total line and Action Confirm Buttons */}
              <div id="details-pane-footer" className="border-t border-gray-200 p-3 bg-white shrink-0 flex flex-col gap-2">
                
                {/* Total price section */}
                <div id="details-total-price-row" className="relative flex items-center justify-between py-1.5 px-1 z-30">
                  <span id="label-total-price-bottom" className="text-base font-bold text-gray-800">Tổng tiền</span>
                  <div className="flex items-center gap-3">
                    <span id="val-total-price-bottom" className="text-2xl font-black text-gray-950 font-mono">
                      {formatVND(selectedOrder.totalPrice)}
                    </span>
                    
                    {/* Interactive 3-dots menu with price breakdown popover */}
                    <div className="relative">
                      <button 
                        id="deliv-more-options" 
                        onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                        className={`p-1.5 hover:bg-gray-100 rounded transition relative ${showPriceBreakdown ? 'bg-gray-200 text-gray-850' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Xem chi tiết các khoản phí và khuyến mại"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {showPriceBreakdown && (
                        <div 
                          id="price-breakdown-card" 
                          className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 text-gray-850 overflow-hidden"
                          style={{ filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15))' }}
                        >
                          {/* Title Header bar */}
                          <div className={`px-3 py-2 text-white font-bold text-xs flex items-center justify-between ${brandBg}`}>
                            <span>Chi tiết thanh toán ({selectedOrder.code})</span>
                            <button 
                              onClick={() => setShowPriceBreakdown(false)} 
                              className="text-white/80 hover:text-white font-bold text-xs"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Breakdown Lines */}
                          <div className="p-3 divide-y divide-gray-100 text-xs">
                            {/* Line 1: Thành tiền (đã trừ khuyến mại món) */}
                            <div className="flex justify-between py-2 text-gray-700" id="bd-row-subtotal">
                              <div className="flex flex-col text-left">
                                <span className="font-semibold">Thành tiền</span>
                                <span className="text-[10px] text-gray-400 font-normal">(Đã trừ KM món)</span>
                              </div>
                              <span className="font-bold text-gray-900 font-mono">{formatVND(breakdown.subtotalDiscounted)}</span>
                            </div>

                            {/* Line 2: Khuyến mại hóa đơn */}
                            <div className="flex justify-between py-2 text-rose-600 text-left" id="bd-row-discount">
                              <span className="font-semibold">Khuyến mại hóa đơn</span>
                              <span className="font-bold font-mono">-{formatVND(breakdown.billDiscount)}</span>
                            </div>

                            {/* Line 3: Phí vận chuyển */}
                            <div className="flex justify-between py-2 text-gray-750 text-left" id="bd-row-delivery">
                              <span className="font-medium">Phí vận chuyển</span>
                              <span className="font-bold text-gray-800 font-mono">+{formatVND(breakdown.deliveryFee)}</span>
                            </div>

                            {/* Line 4: Phí áp dụng */}
                            <div className="flex justify-between py-2 text-gray-750 text-left" id="bd-row-platform">
                              <span className="font-medium">Phí áp dụng</span>
                              <span className="font-bold text-gray-800 font-mono">+{formatVND(breakdown.platformFee)}</span>
                            </div>

                            {/* Line 5: Tip cho vận chuyển */}
                            <div className="flex justify-between py-2 text-indigo-600 text-left" id="bd-row-tip">
                              <span className="font-semibold text-indigo-650">Tip cho vận chuyển</span>
                              <span className="font-bold font-mono">+{formatVND(breakdown.driverTip)}</span>
                            </div>

                            {/* Verification Summary matches total precisely */}
                            <div className="flex justify-between pt-2.5 pb-0.5 border-t border-dashed border-gray-300 text-left" id="bd-row-sum-total">
                              <span className="font-bold text-gray-950 text-xs uppercase tracking-wide">Thành tiền</span>
                              <span className="font-black text-sm text-gray-950 font-mono">{formatVND(selectedOrder.totalPrice)}</span>
                            </div>
                          </div>

                          {/* OK CTA */}
                          <div className="bg-gray-50 px-3 py-2 border-t border-gray-100 flex justify-end">
                            <button 
                              onClick={() => setShowPriceBreakdown(false)}
                              className={`px-3 py-1 text-xs font-bold text-white rounded transition shadow-sm ${isGrab ? 'bg-[#026b97] hover:bg-[#02567a]' : 'bg-[#0973B9] hover:bg-[#00497D]'}`}
                            >
                              ĐỒNG Ý
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* P10: hành động phụ ShopeeFood — Báo hết món / Báo trễ / Giả lập Shopee sửa đơn */}
                {!isGrab && (selectedOrder.status === 'unconfirmed' || selectedOrder.status === 'confirmed') && !pickedOrderIds.includes(selectedOrder.id) && (
                  <div id="spf-secondary-actions" className="flex items-center gap-1.5 flex-wrap">
                    <button
                      id="spf-out-of-stock-btn"
                      onClick={() => {
                        setOutOfStockItemIds([]);
                        setShowOutOfStockModal(true);
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded transition"
                    >
                      🍽 Báo hết món
                    </button>
                    <button
                      id="spf-delay-btn"
                      onClick={() => {
                        setDelayMinutes(15);
                        setShowDelayModal(true);
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded transition"
                    >
                      ⏱ Báo trễ
                    </button>
                    <button
                      id="spf-sim-edit-btn"
                      onClick={() => {
                        if (onSimulateShopeeEdit) onSimulateShopeeEdit(selectedOrder.id);
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-dashed border-amber-400 rounded transition"
                      title="Nút demo: giả lập ShopeeFood cập nhật đơn sau khi gửi"
                    >
                      ⚡ Giả lập Shopee sửa đơn
                    </button>
                  </div>
                )}

                {/* P1/P2: khối tài chính CHỈ-ĐỌC — Shopee luôn thanh toán qua ví đối soát, không thu tiền tại quầy */}
                {!isGrab && selectedOrder.status !== 'cancelled' && (
                  <div id="spf-finance-readonly" className="bg-[#F0F6FE] border border-[#0973B9]/30 rounded p-2.5 flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Khách trả Shopee:</span>
                      <span id="spf-customer-paid" className="font-bold text-gray-900 font-mono">{formatVND(selectedOrder.totalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Quán thực nhận (sau HH/thuế/KM):</span>
                      <span id="spf-merchant-net" className="font-bold text-[#0973B9] font-mono">
                        {formatVND(selectedOrder.merchantNetAmount ?? Math.round(selectedOrder.totalPrice * 0.8))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-[#0973B9]/15 pt-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-500 italic">ShopeeFood thanh toán qua ví đối soát — không thu tiền tại quầy</span>
                      {selectedOrder.settlementStatus === 'received' ? (
                        <span id="spf-settlement-badge" className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-full px-2 py-0.5 shrink-0">
                          ✓ Đã nhận vào ví
                        </span>
                      ) : (
                        <span id="spf-settlement-badge" className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-300 rounded-full px-2 py-0.5 shrink-0">
                          Chờ đối soát
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Primary dynamic status action button */}
                <div id="action-buttons-box" className="flex items-center justify-between gap-2 border-t border-gray-100 pt-2">
                  {/* Delete / Confirm grouping on the left */}
                  <div className="flex items-center gap-2">
                    {/* Unconfirmed reject option */}
                    {selectedOrder.status === 'unconfirmed' && (
                      <button
                        id="deliv-reject-btn"
                        onClick={() => {
                          setRejectOrderId(selectedOrder.id);
                          setRejectReasonType('Hết món ăn');
                          setRejectReasonCustom('Hết món ăn / Nguyên liệu chế biến');
                          setSpfCancelReasonCode(79);
                          setShowRejectModal(true);
                        }}
                        className="px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 font-bold rounded transition border border-red-200 flex items-center"
                      >
                        TỪ CHỐI
                      </button>
                    )}

                    {/* Confirmed cancel option as requested by brief */}
                    {/* P5: SPF sau khi tài xế đã lấy (PICKED) → không thể hủy nữa */}
                    {selectedOrder.status === 'confirmed' && (
                      <button
                        id="deliv-cancel-btn"
                        disabled={!isGrab && pickedOrderIds.includes(selectedOrder.id)}
                        onClick={() => {
                          setCancelOrderId(selectedOrder.id);
                          setCancelReasonText('');
                          setSpfCancelReasonCode(79);
                          setShowCancelModal(true);
                        }}
                        title={
                          !isGrab && pickedOrderIds.includes(selectedOrder.id)
                            ? 'Tài xế đã lấy hàng — không thể hủy đơn ở bước này'
                            : undefined
                        }
                        className={`px-4 py-2.5 text-xs font-bold rounded transition border flex items-center ${
                          !isGrab && pickedOrderIds.includes(selectedOrder.id)
                            ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'text-rose-500 hover:bg-rose-50 border-rose-200'
                        }`}
                      >
                        HỦY ĐƠN
                      </button>
                    )}

                    {/* Print icon button */}
                    {/* P9: điểm còn open — prototype chọn ẨN nút In tạm tính với đơn ShopeeFood (không thu tiền tại quầy) */}
                    {isGrab && (
                      <button
                        id="deliv-print-btn-bottom"
                        onClick={() => setShowPrintReceipt(true)}
                        className="p-2.5 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded transition border border-gray-200 flex items-center justify-center"
                        title="In tạm tính"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {selectedOrder.status === 'unconfirmed' && (
                    <button
                      id="confirm-action-submit-btn"
                      onClick={() => {
                        handleConfirmOrderWithPrint(selectedOrder);
                      }}
                      className={`px-8 py-2.5 text-white font-bold rounded shadow hover:brightness-110 active:scale-95 transition text-[13px] bg-[#0973B9]`}
                    >
                      XÁC NHẬN ĐƠN
                    </button>
                  )}

                  {/* Grab: GIAO HÀNG → THU TIỀN (giữ nguyên 100% luồng cũ) */}
                  {isGrab && selectedOrder.status === 'confirmed' && (
                    !shippedOrderIds.includes(selectedOrder.id) ? (
                      <button
                        id="complete-action-submit-btn"
                        onClick={() => {
                          handleDeliveryOrderWithPrint(selectedOrder);
                        }}
                        className="px-8 py-2.5 text-white font-bold bg-[#1aa059] hover:bg-[#168a4d] rounded shadow active:scale-95 transition text-[13px] flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> GIAO HÀNG
                      </button>
                    ) : (
                      <button
                        id="collect-money-action-submit-btn"
                        onClick={() => {
                          setPaymentOrder(selectedOrder);
                          setApplyVatReduction(true);
                          setSelectedPromos([]);
                          setSearchPromoQuery('');
                        }}
                        className="px-8 py-2.5 text-white font-bold bg-amber-500 hover:bg-amber-600 rounded shadow active:scale-95 transition text-[13px] flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> THU TIỀN
                      </button>
                    )
                  )}

                  {/* ShopeeFood: giữ nhãn "GIAO HÀNG" — hành vi = in tem bàn giao + PICKED; KHÔNG có bước THU TIỀN */}
                  {!isGrab && selectedOrder.status === 'confirmed' && (
                    !pickedOrderIds.includes(selectedOrder.id) ? (
                      <button
                        id="complete-action-submit-btn"
                        onClick={() => {
                          handleShopeeHandover(selectedOrder);
                        }}
                        className="px-8 py-2.5 text-white font-bold bg-[#1aa059] hover:bg-[#168a4d] rounded shadow active:scale-95 transition text-[13px] flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> GIAO HÀNG
                      </button>
                    ) : (
                      <div
                        id="spf-picked-waiting-chip"
                        className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-300 rounded px-3 py-2 font-bold text-xs"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Đã bàn giao tài xế — chờ ShopeeFood xác nhận giao</span>
                      </div>
                    )
                  )}

                  {selectedOrder.status === 'completed' && (
                    <div id="success-done-status" className="flex items-center gap-1.5 text-green-600 font-extrabold pr-2 py-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Đã hoàn thành & Giao hàng thành công</span>
                    </div>
                  )}

                  {selectedOrder.status === 'cancelled' && (
                    <div id="cancelled-status-badge" className="flex flex-col items-end gap-0.5 text-rose-600 font-extrabold pr-2 py-1 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <X className="w-5 h-5 bg-rose-100 p-0.5 rounded-full" />
                        <span>Đơn hàng đã hủy / từ chối</span>
                      </div>
                      {selectedOrder.note && (
                        <span className="text-[11px] text-gray-500 font-medium font-sans">Lý do: {selectedOrder.note}</span>
                      )}
                      {!isGrab && selectedOrder.cancelReasonCode && (
                        <span id="spf-cancel-reason-code" className="text-[10px] text-gray-400 font-medium font-sans">
                          Mã lý do gửi ShopeeFood: {selectedOrder.cancelReasonCode}
                        </span>
                      )}
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

      {/* Từ chối đơn hàng (Reject Modal) with interactive reasons */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] font-sans text-xs select-none text-left">
          <div className="w-[480px] max-w-full bg-white rounded-xl shadow-2xl border border-gray-150 flex flex-col overflow-hidden animate-in scale-in duration-200">
            {/* Header Modal */}
            <div className="h-[62px] flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-none">
              <h3 className="text-base font-semibold text-gray-900">Từ chối đơn hàng</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-[#717680] hover:text-gray-900 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body Form */}
            <div className="px-6 pb-4 flex flex-col gap-3 text-gray-700">
              {/* P5: SPF chỉ chấp nhận 3 mã lý do API (79/80/81) — thay text tự do bằng radio */}
              {!isGrab ? (
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-gray-500 text-xs">Chọn lý do từ chối (ShopeeFood chỉ chấp nhận 3 lý do):</label>
                  <div className="flex flex-col gap-1.5" id="spf-reject-reason-list">
                    {SPF_CANCEL_REASONS.map((r) => (
                      <label
                        key={r.code}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                          spfCancelReasonCode === r.code
                            ? 'bg-[#F0F6FE] border-[#0973B9]/50'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="spf-reject-reason"
                          checked={spfCancelReasonCode === r.code}
                          onChange={() => setSpfCancelReasonCode(r.code)}
                          className="mt-0.5 h-3.5 w-3.5 text-[#0973B9] focus:ring-[#0973B9]"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-xs">
                            {r.label} <span className="text-[10px] text-gray-400 font-mono">(mã {r.code})</span>
                          </span>
                          <span className="text-[10px] text-gray-500">{r.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-medium text-gray-500 text-xs">Vui lòng nhập lý do từ chối đơn hàng này:</label>
                    <textarea
                      placeholder="Nhập lý do chi tiết từ chối..."
                      value={rejectReasonCustom}
                      onChange={(e) => setRejectReasonCustom(e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#245FDF] focus:border-[#245FDF] focus:outline-none font-medium leading-relaxed text-gray-900"
                      autoFocus
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gợi ý lý do nhanh:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Hết món ăn / Nguyên liệu chế biến',
                        'Nhà hàng quá tải, chuẩn bị không kịp',
                        'Không có tài xế tiếp nhận đơn',
                        'Cửa hàng đang đóng cửa / Nghỉ lễ'
                      ].map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setRejectReasonCustom(reason)}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] transition font-medium ${
                            rejectReasonCustom === reason
                              ? 'bg-[#F0F6FE] border-[#245FDF]/50 text-[#245FDF]'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Action */}
            <div className="h-14 bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 flex items-center justify-end gap-2 shrink-0">
              <button 
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="h-[32px] min-w-[84px] px-4 bg-white hover:bg-gray-50 border border-[#D5D7DA] rounded-lg text-gray-700 font-semibold transition text-xs uppercase"
              >
                BỎ QUA
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (onDeleteOrder && rejectOrderId) {
                    if (!isGrab) {
                      // SPF: gửi đúng mã lý do API 79/80/81
                      const reason = SPF_CANCEL_REASONS.find((r) => r.code === spfCancelReasonCode);
                      onDeleteOrder(rejectOrderId, reason ? reason.label : 'Từ chối bởi nhà hàng', spfCancelReasonCode);
                    } else {
                      const finalReason = rejectReasonCustom.trim() || 'Từ chối bởi nhà hàng';
                      onDeleteOrder(rejectOrderId, finalReason);
                    }
                  }
                  setShowRejectModal(false);
                }}
                className="h-[32px] min-w-[84px] px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition active:scale-95 text-xs uppercase"
              >
                TỪ CHỐI
              </button>
            </div>
          </div>
        </div>
      )}

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
              {/* P5: SPF chỉ chấp nhận 3 mã lý do API (79/80/81) — thay text tự do bằng radio */}
              {!isGrab ? (
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-gray-500 text-xs">Chọn lý do hủy đơn (ShopeeFood chỉ chấp nhận 3 lý do):</label>
                  <div className="flex flex-col gap-1.5" id="spf-cancel-reason-list">
                    {SPF_CANCEL_REASONS.map((r) => (
                      <label
                        key={r.code}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                          spfCancelReasonCode === r.code
                            ? 'bg-[#F0F6FE] border-[#0973B9]/50'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="spf-cancel-reason"
                          checked={spfCancelReasonCode === r.code}
                          onChange={() => setSpfCancelReasonCode(r.code)}
                          className="mt-0.5 h-3.5 w-3.5 text-[#0973B9] focus:ring-[#0973B9]"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-xs">
                            {r.label} <span className="text-[10px] text-gray-400 font-mono">(mã {r.code})</span>
                          </span>
                          <span className="text-[10px] text-gray-500">{r.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
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
                  if (onDeleteOrder && cancelOrderId) {
                    if (!isGrab) {
                      // SPF: gửi đúng mã lý do API 79/80/81
                      const reason = SPF_CANCEL_REASONS.find((r) => r.code === spfCancelReasonCode);
                      onDeleteOrder(cancelOrderId, reason ? reason.label : 'Hủy bỏ bởi nhà hàng', spfCancelReasonCode);
                    } else {
                      const finalReason = cancelReasonText.trim() || 'Hủy bỏ bởi nhà hàng';
                      onDeleteOrder(cancelOrderId, finalReason);
                    }
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
                    {selectedOrder.driverName && (
                      <tr>
                        <td style={{ fontWeight: 'bold' }}>Tài xế:</td>
                        <td style={{ textAlign: 'right' }}>{selectedOrder.driverName}</td>
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

      {/* Màn TÍNH TIỀN đầy đủ chỉ dành cho Grab — đơn ShopeeFood không thu tiền tại quầy (P1/P2) */}
      {paymentOrder && paymentOrder.channel === 'Grab' && (() => {
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
        if (selectedPromos.includes('KM HĐ 100%')) {
          promoDiscount = itemsSum; // 100% discount
        }
        
        const grandTotal = Math.max(0, itemsSum + serviceFee - vatDiscount - promoDiscount);

        const allPromos = [
          { id: 'giảm giá món', label: 'giảm giá món', desc: 'Giảm 5% cho một số sản phẩm' },
          { id: 'Tặng ăn chính', label: 'Tặng ăn chính', desc: 'Khuyến mại tặng kèm món ăn chính' },
          { id: 'KM HĐ 100%', label: 'KM HĐ 100%', desc: 'Miễn phí 100% hóa đơn' },
          { id: 'KM ăn chính 100', label: 'KM ăn chính 100', desc: 'Ưu đãi ăn chính đặc biệt' },
          { id: 'Mua 2 món ăn', label: 'Mua 2 món ăn', desc: 'Mua 2 tặng 1 nước giải khát' },
          { id: 'Giảm 15% hóa đơn thứ 2', label: 'Giảm 15% hóa đơn thứ 2', desc: 'Ưu đãi giảm 15% cho hóa đơn tiếp theo' }
        ];

        const filteredPromos = allPromos.filter(p => 
          p.label.toLowerCase().includes(searchPromoQuery.toLowerCase())
        );

        const handleCompletePayment = () => {
          onCompleteOrder(paymentOrder.id);
          setPaymentOrder(null);
          setActiveTab('completed');
          setSelectedOrderId(paymentOrder.id);
        };

        // Date String for right side of mini header
        const nowObj = new Date();
        const displayDateTime = nowObj.toLocaleDateString('vi-VN') + ' ' + nowObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        return (
          <div className="fixed inset-0 z-50 bg-[#e4ecf0] flex flex-col font-sans text-xs text-[#333] select-none text-left">
            {/* Top MISA CUKCUK main header */}
            <header className="h-11 bg-[#026b97] text-white flex items-center justify-between px-3 shrink-0 shadow-md">
              <div className="flex items-center h-full">
                {/* Home tab button */}
                <div 
                  onClick={() => setPaymentOrder(null)}
                  className="h-full px-4 flex items-center justify-center border-r border-[#02567a] cursor-pointer hover:bg-[#02567a] transition-all"
                >
                  <Home className="w-5 h-5 text-sky-100" />
                </div>
                {/* Tabs */}
                <div className="h-full bg-white text-[#026b97] px-4 flex items-center gap-1.5 font-bold cursor-pointer border-r border-gray-200 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#026b97] animate-pulse"></div>
                  <span>Order</span>
                </div>
                <div className="h-full px-4 flex items-center gap-1.5 text-sky-100 hover:bg-[#02567a] cursor-pointer transition">
                  <span>Sơ đồ</span>
                </div>
                <div className="h-full px-4 flex items-center gap-1.5 text-sky-100 hover:bg-[#02567a] cursor-pointer transition gap-2">
                  <Globe className="w-3.5 h-3.5 text-sky-200" />
                  <span>Order Online</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* + ORDER Button */}
                <button className="bg-sky-50 bg-opacity-15 hover:bg-opacity-25 text-white font-extrabold px-3 py-1.5 rounded flex items-center gap-1 border border-sky-300 border-opacity-35 text-[11px] transition">
                  <Plus className="w-3.5 h-3.5" />
                  <span>ORDER</span>
                  <ChevronDown className="w-3 h-3 text-sky-200" />
                </button>

                {/* Util icons similar to CUKCUK */}
                <div className="flex items-center gap-2 text-sky-100">
                  <button className="p-1.5 hover:bg-[#02567a] rounded" title="Menu"><Menu className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-[#02567a] rounded" title="Wifi"><Globe className="w-4 h-4 text-emerald-400" /></button>
                  <button className="p-1.5 hover:bg-[#02567a] rounded" title="Cloud Sync"><Cloud className="w-4 h-4 text-amber-300" /></button>
                  <button className="p-1.5 hover:bg-[#02567a] rounded" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-[#02567a] rounded" title="Nhắc nhở"><Bell className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-[#02567a] rounded" title="User"><User className="w-4 h-4 text-sky-200" /></button>
                </div>

                <div className="text-[11px] font-semibold text-sky-100 font-mono flex items-center gap-1 bg-sky-950 bg-opacity-30 px-2 py-1 rounded">
                  <Clock className="w-3 h-3 text-sky-300" />
                  <span>{displayDateTime}</span>
                </div>
              </div>
            </header>

            {/* Workplace below Header */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column Sidebar */}
              <aside className="w-[310px] bg-[#e4ecf0] p-2 flex flex-col gap-2 shrink-0 border-r border-[#cbd5e1] overflow-y-auto text-left">
                
                {/* Membership Card Box */}
                <div className="bg-white rounded border border-gray-300 p-2.5 shadow-sm flex flex-col gap-2 shrink-0">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                    <div className="font-bold text-[#026b97] flex items-center gap-1.5 text-xs">
                      <User className="w-4 h-4" />
                      <span>Thẻ thành viên</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold mb-0.5">Mã thành viên:</div>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Nhập mã thành viên..." 
                          className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs pr-7 focus:outline-none focus:ring-1 focus:ring-[#026b97]" 
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold mb-0.5">Tên thành viên:</div>
                      <div className="flex gap-1">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            placeholder="Tên thành viên..." 
                            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none" 
                          />
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2" />
                        </div>
                        <button className="bg-[#1aa059] hover:bg-[#168a4d] text-white p-1 rounded flex items-center justify-center shrink-0 w-7 h-7 shadow" title="Thêm thành viên">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition mt-1">
                    <span>SỬ DỤNG ĐIỂM & MÃ ƯU ĐÃI</span>
                    <span className="text-[#026b97] font-extrabold">&gt;</span>
                  </button>
                </div>

                {/* Promotions Programs Box */}
                <div className="bg-white rounded border border-gray-300 p-2.5 shadow-sm flex-1 flex flex-col gap-2 min-h-[220px] text-left">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                    <div className="font-bold text-[#026b97] flex items-center gap-1.5 text-xs">
                      <Gift className={`w-4 h-4 ${isGrab ? 'text-sky-500' : 'text-[#0973B9]'}`} />
                      <span>Chương trình khuyến mại</span>
                    </div>
                  </div>

                  {/* Search box for promos */}
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm CTKM..." 
                      value={searchPromoQuery}
                      onChange={(e) => setSearchPromoQuery(e.target.value)}
                      className="w-full bg-[#f4f6f8] border border-gray-200 rounded px-2.5 py-1 text-xs pr-7 focus:outline-none" 
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1.5" />
                  </div>

                  {/* List of checked promos with customized responsive styles */}
                  <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-1.5 bg-[#fcfdfe] flex flex-col gap-1.5">
                    {filteredPromos.map((promo) => {
                      const isChecked = selectedPromos.includes(promo.id);
                      return (
                        <label 
                          key={promo.id} 
                          className={`flex items-start gap-2 p-1.5 rounded cursor-pointer transition select-none ${
                            isChecked ? 'bg-sky-50 border border-sky-200 text-sky-950' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedPromos(prev => prev.filter(v => v !== promo.id));
                              } else {
                                setSelectedPromos(prev => [...prev, promo.id]);
                              }
                            }}
                            className="mt-0.5 rounded text-[#026b97] focus:ring-[#026b97] h-3.5 w-3.5"
                          />
                          <div className="flex flex-col text-left">
                            <span className="font-semibold text-[11px] leading-tight">{promo.label}</span>
                            <span className="text-[9px] text-gray-400 leading-tight mt-0.5">{promo.desc}</span>
                          </div>
                        </label>
                      );
                    })}
                    {filteredPromos.length === 0 && (
                      <div className="text-center text-gray-400 py-6 text-[10px]">Không tìm thấy CTKM</div>
                    )}
                  </div>

                  {/* Sidebar other controllers inside Box 2 */}
                  <div className="flex items-center gap-1 justify-between pt-1 border-t border-gray-100">
                    <button className="flex-1 max-w-[190px] border border-dashed border-gray-300 text-gray-500 hover:text-gray-700 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-0.5 transition bg-white">
                      <Plus className="w-3.5 h-3.5" /> Thêm CTKM khác
                    </button>
                    {/* Direction arrows */}
                    <div className="flex gap-1 shrink-0">
                      <button className="border border-gray-200 hover:border-gray-300 p-1 rounded bg-white" title="Trượt lên">
                        <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      <button className="border border-gray-200 hover:border-gray-300 p-1 rounded bg-white" title="Trượt xuống">
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional controls at the bottom left */}
                <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm py-1.5 rounded font-extrabold text-[11px] flex items-center justify-center gap-1.5 shrink-0 transition">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 block"></span>
                  <span>Phím tắt (F1)</span>
                </button>
              </aside>

              {/* Right Column Detail Content */}
              <main className="flex-1 bg-white flex flex-col overflow-hidden border-l border-gray-200 text-left">
                
                {/* Mini Header of Receipt detail */}
                <div className="bg-[#f0f4f8] border-b border-gray-300 h-10 px-3 flex items-center justify-between shrink-0 font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPaymentOrder(null)} 
                      className="p-1 hover:bg-gray-200 rounded text-[#026b97] hover:text-[#02567a] font-black transition"
                      title="Quay lại"
                    >
                      <ArrowLeft className="w-4 h-4 inline mr-1" /> Quay lại
                    </button>
                    <span className="text-[#026b97] text-sm ml-2 font-mono font-black">{paymentOrder.code}</span>
                    <span className="bg-sky-100 text-[#026b97] font-bold px-1.5 py-0.5 rounded text-[10px] uppercase ml-1">{paymentOrder.channel}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono font-bold">
                    <span>Thời gian đặt: {paymentOrder.orderTime}</span>
                  </div>
                </div>

                {/* Main Table Area */}
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#e4ecf0] text-gray-700 uppercase font-black tracking-wide text-[11px] sticky top-0 shadow-sm z-10">
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
                                <span className="text-[10px] leading-none">🎁</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {/* Empty state filler rows matching standard MISA design */}
                  <div className="h-24 bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Thông tin đơn hàng thanh toán từ {paymentOrder.channel}</span>
                  </div>
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
                        <span className="w-3.5 h-3.5 rounded-full border border-sky-400 text-sky-600 flex items-center justify-center text-[9px] cursor-help" title="Gồm phí vận chuyển và phí kết nối nền tảng">i</span>
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
                        <p className="text-[10px] text-gray-500 leading-tight italic bg-amber-50 px-2 py-1.5 rounded border border-amber-200 text-left font-mono font-semibold">
                          * Đã giảm {formatVND(vatDiscount)} đồng, tương ứng 20% mức tỷ lệ % để tính thuế giá trị gia tăng theo Nghị quyết số 204/2025/QH15
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <input type="checkbox" id="request-gtgt-invoice" className="rounded text-[#026b97]" />
                      <label htmlFor="request-gtgt-invoice" className="text-gray-500 hover:text-gray-700 cursor-pointer text-[10px] font-semibold leading-none">
                        Khách lấy hóa đơn GTGT. Xem chi tiết &gt;&gt;
                      </label>
                    </div>
                  </div>

                  {/* Right Column Calculus */}
                  <div className="w-1/2 flex flex-col gap-3 justify-end pl-4 text-left">
                    <div className="flex justify-between items-center bg-sky-50 bg-opacity-40 p-2.5 rounded border border-sky-100">
                      <span className="text-gray-700 font-extrabold text-[13px] uppercase tracking-wide">Tổng thanh toán:</span>
                      <span className="text-[#026b97] font-black text-xl font-mono">{formatVND(grandTotal)}</span>
                    </div>

                    <div className="flex justify-between items-center text-gray-600 font-semibold gap-2">
                      <button className="border border-gray-300 hover:bg-gray-50 flex items-center gap-1.5 px-3 py-1.5 rounded shadow-sm text-xs font-bold shrink-0 transition bg-white" title="Chọn Voucher">
                        <Gift className={`w-4 h-4 ${isGrab ? 'text-sky-400' : 'text-[#0973B9]'}`} />
                        <span>Voucher</span>
                      </button>
                      <span className="text-[11px] text-gray-400 italic">Vui lòng chọn khuyến mại bên trái</span>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center bg-amber-50 bg-opacity-30 p-2.5 rounded border border-amber-100">
                      <span className="text-amber-950 font-black text-[13px] uppercase tracking-wide">Còn phải thu:</span>
                      <span className="text-amber-600 font-extrabold text-xl font-mono">{formatVND(grandTotal)}</span>
                    </div>
                  </div>

                </div>

                {/* Bottom gray action bar and back button */}
                <div className="bg-[#f0f2f4] border-t border-gray-300 h-14 px-3 flex items-center justify-between shrink-0">
                  <button 
                    onClick={() => setPaymentOrder(null)}
                    className="h-10 px-4 bg-white hover:bg-gray-100 text-[#026b97] border border-gray-300 rounded font-black text-[11px] shadow-sm flex items-center gap-1.5 transition active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>QUAY LẠI</span>
                  </button>

                  <div className="flex gap-2">
                    <button className="h-10 px-3 bg-white hover:bg-gray-50 text-[#026b97] border border-gray-300 hover:border-gray-400 rounded font-bold text-[11px] flex items-center gap-1 shadow-sm transition">
                      TÁCH HĐ
                    </button>
                    
                    <button 
                      onClick={() => handlePrintDeliverySlip(paymentOrder)}
                      className="h-10 px-3 bg-white hover:bg-gray-50 text-[#026b97] border border-gray-200 rounded font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                    >
                      <Printer className="w-4 h-4 text-sky-600" />
                      <span>IN TẠM TÍNH</span>
                    </button>

                    <button className="h-10 px-3 bg-white hover:bg-gray-50 text-[#026b97] border border-gray-200 rounded font-bold text-[11px] flex items-center gap-1 shadow-sm transition">
                      <Save className="w-4 h-4 text-amber-500" />
                      <span>LƯU TẠM HĐ</span>
                    </button>

                    <button 
                      onClick={() => {
                        setEnteredCustomerPayment(grandTotal);
                        setPaymentMethod('cash');
                        setShowPaymentCollectModal(true);
                      }}
                      className="h-10 px-8 bg-[#f26522] hover:bg-[#d94f12] text-white font-extrabold rounded flex items-center gap-2 shadow active:scale-95 transition tracking-wide text-xs"
                    >
                      <span>$ THU TIỀN</span>
                    </button>
                  </div>
                </div>

              </main>

            </div>

            {/* Blue status bar on bottom of MISA CUKCUK */}
            <footer className="h-6 bg-[#026b97] text-sky-100 flex items-center justify-between px-3 text-[10px] shrink-0 font-medium">
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
                                src={`https://img.vietqr.io/image/MB-02471088800-compact2.png?amount=${grandTotal}&addInfo=Chuyen%20khoan%20cukcuk%20${paymentOrder.code}&accountName=NHA%20HANG%20CUKCUK%20MAKT`}
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
                              <span>Chủ TK: NHA HANG CUKCUK MAKT</span>
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

          </div>
        );
      })()}

      {/* P10a: Báo hết món — multi-select món, cảnh báo API SPF chỉ hủy CẢ đơn */}
      {showOutOfStockModal && selectedOrder && !isGrab && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] font-sans text-xs select-none text-left">
          <div className="w-[480px] max-w-full bg-white rounded-xl shadow-2xl border border-gray-150 flex flex-col overflow-hidden animate-in scale-in duration-200">
            {/* Header Modal */}
            <div className="h-[62px] flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-none">
              <h3 className="text-base font-semibold text-gray-900">Báo hết món — đơn {selectedOrder.code}</h3>
              <button onClick={() => setShowOutOfStockModal(false)} className="text-[#717680] hover:text-gray-900 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <div className="px-6 pb-4 flex flex-col gap-3 text-gray-700">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-gray-500 text-xs">Chọn món đã hết trong đơn:</label>
                <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto" id="spf-out-of-stock-list">
                  {selectedOrder.items.map((item) => {
                    const isChecked = outOfStockItemIds.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition ${
                          isChecked ? 'bg-[#F0F6FE] border-[#0973B9]/50' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setOutOfStockItemIds((prev) =>
                              isChecked ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                            );
                          }}
                          className="h-3.5 w-3.5 rounded text-[#0973B9] focus:ring-[#0973B9]"
                        />
                        <span className="font-semibold text-gray-900 flex-1">{item.name}</span>
                        <span className="text-gray-500 font-mono">x{item.qty}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Cảnh báo đỏ — ràng buộc API */}
              <div id="spf-out-of-stock-warning" className="bg-red-50 border border-red-300 rounded-lg p-3 text-red-700 font-semibold leading-relaxed flex items-start gap-2">
                <span className="text-sm">⚠</span>
                <span>
                  API ShopeeFood <strong>chỉ hỗ trợ hủy CẢ đơn</strong>, không hủy được từng món.
                  Vui lòng <strong>gọi xác nhận với khách</strong> trước khi thao tác — đơn sẽ bị hủy với lý do "Hết món" (mã 79).
                </span>
              </div>
            </div>

            {/* Footer Action */}
            <div className="h-14 bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowOutOfStockModal(false)}
                className="h-[32px] min-w-[84px] px-4 bg-white hover:bg-gray-50 border border-[#D5D7DA] rounded-lg text-gray-700 font-semibold transition text-xs uppercase"
              >
                BỎ QUA
              </button>
              <button
                type="button"
                id="spf-out-of-stock-confirm-btn"
                disabled={outOfStockItemIds.length === 0}
                onClick={() => {
                  const names = selectedOrder.items
                    .filter((it) => outOfStockItemIds.includes(it.id))
                    .map((it) => it.name)
                    .join(', ');
                  if (onDeleteOrder) {
                    onDeleteOrder(selectedOrder.id, `Hết món: ${names}`, 79);
                  }
                  setShowOutOfStockModal(false);
                }}
                className={`h-[32px] px-5 font-bold rounded-lg shadow-sm transition text-xs uppercase ${
                  outOfStockItemIds.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 text-white active:scale-95'
                }`}
              >
                HỦY CẢ ĐƠN (LÝ DO 79)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* P10b: Báo trễ — gửi busy_info cho ShopeeFood, KHÔNG đổi trạng thái đơn */}
      {showDelayModal && selectedOrder && !isGrab && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] font-sans text-xs select-none text-left">
          <div className="w-[420px] max-w-full bg-white rounded-xl shadow-2xl border border-gray-150 flex flex-col overflow-hidden animate-in scale-in duration-200">
            {/* Header Modal */}
            <div className="h-[62px] flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-none">
              <h3 className="text-base font-semibold text-gray-900">Báo trễ — đơn {selectedOrder.code}</h3>
              <button onClick={() => setShowDelayModal(false)} className="text-[#717680] hover:text-gray-900 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <div className="px-6 pb-4 flex flex-col gap-3 text-gray-700">
              <label className="font-medium text-gray-500 text-xs">Quán cần thêm bao nhiêu phút để chuẩn bị món?</label>
              <div className="flex gap-1.5" id="spf-delay-minute-chips">
                {[10, 15, 20, 30].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDelayMinutes(m)}
                    className={`flex-1 py-2.5 rounded-lg border font-bold transition ${
                      delayMinutes === m
                        ? 'bg-[#0973B9] text-white border-[#0973B9]'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    +{m} phút
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 italic bg-amber-50 border border-amber-200 rounded p-2 leading-relaxed">
                ShopeeFood sẽ thông báo cho khách và tài xế thời gian chuẩn bị mới. Trạng thái đơn <strong>giữ nguyên</strong> — không cần thao tác gì thêm.
              </p>
            </div>

            {/* Footer Action */}
            <div className="h-14 bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowDelayModal(false)}
                className="h-[32px] min-w-[84px] px-4 bg-white hover:bg-gray-50 border border-[#D5D7DA] rounded-lg text-gray-700 font-semibold transition text-xs uppercase"
              >
                BỎ QUA
              </button>
              <button
                type="button"
                id="spf-delay-confirm-btn"
                onClick={() => {
                  setDelayNotices((prev) => ({ ...prev, [selectedOrder.id]: delayMinutes }));
                  setShowDelayModal(false);
                }}
                className="h-[32px] px-5 bg-[#0973B9] hover:bg-[#00497D] text-white font-bold rounded-lg shadow-sm transition active:scale-95 text-xs uppercase"
              >
                GỬI BÁO TRỄ +{delayMinutes} PHÚT
              </button>
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
                    {/* P10c: dấu "ĐÃ CẬP NHẬT" khi Shopee sửa đơn sau khi gửi */}
                    {kitchenPrintOrder.updatedByShopee && (
                      <div className="border-2 border-black font-black text-[12px] py-1 my-2 tracking-widest">*** ĐÃ CẬP NHẬT ***</div>
                    )}
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
          <div className="w-[440px] max-w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-750 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-100">
            
            {/* Header info */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                  <div className="w-8 h-8 rounded-full bg-[#1aa059] flex items-center justify-center text-white font-bold text-xs shrink-0">
                    🖨️
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 ml-1">
                  <span className="font-extrabold text-sm tracking-wide text-white uppercase flex items-center gap-2">
                    {deliveryPrintOrder.channel === 'ShopeeFood'
                      ? (deliveryPrintOrder.orderType === 'customer_pickup' ? 'IN TEM ĐƠN TỰ ĐẾN LẤY' : 'IN TEM BÀN GIAO TÀI XẾ')
                      : 'IN PHIẾU GIAO HÀNG'}
                    <span className="bg-emerald-500 text-[8px] px-1.5 py-0.5 rounded text-slate-950 font-black animate-pulse">AUTOMATIC</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {deliveryPrintOrder.channel === 'ShopeeFood' ? 'Đang tự động in tem bàn giao...' : 'Đang tự động in phiếu giao hàng...'}
                  </span>
                </div>
              </div>
              <div className="text-right text-slate-400 font-mono text-[10px]">
                PORT: PRINTER_LPT2
              </div>
            </div>

            {/* Main printed outputs simulator - Centered delivery receipt paper */}
            <div className="p-6 flex flex-col bg-slate-950 max-h-[70vh] overflow-y-auto items-stretch">
              
              {/* Simulated Delivery Slip paper */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                  {deliveryPrintOrder.channel === 'ShopeeFood' ? '📝 Tem bàn giao ShopeeFood' : '📝 Phiếu giao hàng (Delivery Slip)'}
                </span>
                <div className="bg-white text-slate-900 p-5 rounded shadow-xl border border-slate-300 font-mono text-[11px] leading-relaxed relative overflow-hidden select-text min-h-[380px]">
                  {/* Cut lines paper visual effect */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-gray-200 to-transparent"></div>

                  {deliveryPrintOrder.channel === 'ShopeeFood' ? (
                    <>
                      {/* P6 — Tem bàn giao SPF: mã rút gọn cỡ lớn + món/SL, KHÔNG địa chỉ/tên khách/tổng tiền */}
                      <div className="text-center font-bold">
                        <div className="text-[11px] font-black uppercase">
                          {deliveryPrintOrder.orderType === 'customer_pickup' ? 'TEM ĐƠN TỰ ĐẾN LẤY' : 'TEM BÀN GIAO TÀI XẾ'} — SHOPEEFOOD
                        </div>
                        <div id="spf-slip-short-code" className="text-[44px] leading-none font-black tracking-widest my-2">
                          {shortCode(deliveryPrintOrder.code)}
                        </div>
                        <div className="text-[10px] text-gray-600">Mã đầy đủ: {deliveryPrintOrder.code}</div>
                        {deliveryPrintOrder.orderType === 'customer_pickup' && (
                          <div className="border border-dashed border-black font-black text-[12px] py-1 my-2">
                            KHÁCH TỰ ĐẾN LẤY — Mã nhận đơn: {deliveryPrintOrder.pickupCode || '—'}
                          </div>
                        )}
                        {deliveryPrintOrder.updatedByShopee && (
                          <div className="border-2 border-black font-black text-[12px] py-1 my-2 tracking-widest">*** ĐÃ CẬP NHẬT ***</div>
                        )}
                        <div className="border-t border-dashed border-gray-400 my-2"></div>
                      </div>

                      <div className="grid grid-cols-12 font-bold text-gray-800 py-1 border-b border-gray-150">
                        <span className="col-span-9">TÊN MÓN</span>
                        <span className="col-span-3 text-right">SL</span>
                      </div>

                      <div className="flex flex-col gap-1.5 py-1.5">
                        {deliveryPrintOrder.items.map((item) => (
                          <div key={item.id} className="grid grid-cols-12 items-start py-0.5 border-b border-gray-100 last:border-0 text-xs">
                            <span className="col-span-9 font-extrabold text-black truncate">{item.name}</span>
                            <span className="col-span-3 text-right font-black text-sm">x{item.qty}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-dashed border-gray-400 my-2"></div>
                      <div className="flex justify-between font-extrabold text-black text-xs">
                        <span>TỔNG SỐ MÓN:</span>
                        <span>{deliveryPrintOrder.items.reduce((acc, item) => acc + item.qty, 0)}</span>
                      </div>
                      <div className="text-center text-[9px] text-gray-500 font-sans mt-3">
                        Không thu tiền tại quầy — ShopeeFood đối soát qua ví
                      </div>

                      <div className="text-center font-sans text-[8px] font-black tracking-widest text-gray-400 mt-4 select-none uppercase">
                        *MISA-CUKCUK-SHOPEEFOOD*
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center font-bold">
                        <div className="text-[13px] font-black uppercase">MISA CUKCUK - PHIẾU GIAO HÀNG</div>
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
                        <div><strong>Tài xế:</strong> {deliveryPrintOrder.driverName || 'Chưa phân phối'}</div>
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
                    </>
                  )}
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
}
