import React, { useState, useMemo, useEffect } from 'react';
import { HeaderMenuDropdown } from './HeaderMenuDropdown';
import { InvoiceIcon } from './InvoiceIcon';
import { 
  Home, 
  Plus, 
  Globe, 
  Truck, 
  Search, 
  CheckCircle2, 
  Receipt, 
  User, 
  CreditCard, 
  Info, 
  X,
  FileText,
  Check,
  Menu,
  CloudDownload,
  ArrowLeftRight,
  MessageSquare,
  ChevronDown,
  Bell,
  Clock,
  Printer,
  AlertTriangle,
  Lock,
  Bike,
  Utensils,
  Calendar,
  Users,
  ShieldCheck,
  Activity,
  XCircle
} from 'lucide-react';
import { Order, AppView } from '../types';
import { DeliveryBikeIcon } from './DeliveryBikeIcon';

export const SHOPEE_LOGO = "https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=86c3811c-13d4-46c7-8dc2-f484b09d7552.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa";
export const GRAB_LOGO = "https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=71956450-e39c-4bc5-98e9-aea9568acff0.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa";

export type ShopeePartnerStatus = 
  | 'Đã đẩy đơn về quán'
  | 'Quán đã nhận đơn'
  | 'Quán đã xác nhận đơn'
  | 'Đang tìm tài xế'
  | 'Tài xế đã nhận đơn'
  | 'Tài xế đã lấy hàng'
  | 'Giao hàng thành công'
  | 'Quán không thể phục vụ đơn hàng'
  | 'Đơn hàng đã bị hủy';

interface OrderOnlineViewProps {
  onBackToMain: () => void;
  onNavigateToView: (view: AppView) => void;
  notifications?: any[];
  onNotificationClick?: (notif: any) => void;
  orders?: OnlineOrder[];
  setOrders?: React.Dispatch<React.SetStateAction<OnlineOrder[]>>;
  grabUnconfirmedCount?: number;
  shopeeUnconfirmedCount?: number;
  onlineUnconfirmedCount?: number;
  onConfirmAppOrder?: (orderId: string) => void;
}

export interface OnlineOrder {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  orderTime: string;
  receiveTime: string;
  timeAgo: string;
  itemsCountStr: string;
  totalPriceStr: string;
  totalPriceNum: number;
  paymentMethod: string;
  channel?: 'ShopeeFood' | 'Grab';
  status: 'unconfirmed' | 'processing' | 'processed' | 'completed' | 'cancelled';
  partnerStatus?: ShopeePartnerStatus; // Trạng thái ShopeeFood đẩy về (chỉ xem, không thể edit)
  note?: string; // Ghi chú đơn hàng
  cancelReason?: string; // Lý do hủy đơn
  cancelledBy?: string; // Do người dùng hủy hay quán hủy
  driverName?: string; // Tên tài xế
  driverPhone?: string; // SĐT tài xế
  driverPlate?: string; // Biển số xe
  driverStatus?: string; // Trạng thái giao hàng
  items: {
    id: string;
    name: string;
    qtyStr: string;
    totalPriceStr: string;
    note?: string; // Ghi chú món ăn
  }[];
}

export function getShopeeStatusProgression(order: OnlineOrder) {
  let currentStatus: ShopeePartnerStatus = order.partnerStatus || 'Đã đẩy đơn về quán';

  if (!order.partnerStatus) {
    if (order.status === 'unconfirmed') {
      currentStatus = 'Đã đẩy đơn về quán';
    } else if (order.status === 'processing') {
      if (order.driverName) {
        currentStatus = 'Tài xế đã nhận đơn';
      } else {
        currentStatus = 'Đang tìm tài xế';
      }
    } else if (order.status === 'processed') {
      currentStatus = 'Tài xế đã lấy hàng';
    } else if (order.status === 'completed') {
      currentStatus = 'Giao hàng thành công';
    } else if (order.status === 'cancelled') {
      if (order.cancelledBy && (order.cancelledBy.includes('quán') || order.cancelledBy.includes('từ chối'))) {
        currentStatus = 'Quán không thể phục vụ đơn hàng';
      } else {
        currentStatus = 'Đơn hàng đã bị hủy';
      }
    }
  }

  const stepsSequence: { title: ShopeePartnerStatus }[] = [
    { title: 'Đã đẩy đơn về quán' },
    { title: 'Quán đã nhận đơn' },
    { title: 'Quán đã xác nhận đơn' },
    { title: 'Đang tìm tài xế' },
    { title: 'Tài xế đã nhận đơn' },
    { title: 'Tài xế đã lấy hàng' },
    { title: 'Giao hàng thành công' }
  ];

  const isCancelled = currentStatus === 'Đơn hàng đã bị hủy';
  const isRejected = currentStatus === 'Quán không thể phục vụ đơn hàng';

  let activeIndex = stepsSequence.findIndex(s => s.title === currentStatus);
  if (activeIndex === -1 && !isCancelled && !isRejected) {
    activeIndex = 0;
  }

  return {
    currentStatus,
    stepsSequence,
    activeIndex,
    isCancelled,
    isRejected
  };
}

export const INITIAL_ONLINE_ORDERS: OnlineOrder[] = [
  {
    id: 'oo-u1',
    code: 'SPF-829103',
    customerName: 'Trần Thanh Hương',
    phone: '0983123456',
    address: 'Số 18 Hàng Buồm, Phường Hàng Buồm, Quận Hoàn Kiếm, Hà Nội',
    orderTime: '16:07 - 07/24/2026',
    receiveTime: '16:45 - 07/24/2026',
    timeAgo: '5 phút trước',
    itemsCountStr: '3 món',
    totalPriceStr: '140.000',
    totalPriceNum: 140000,
    paymentMethod: 'Thanh toán qua Ví ShopeePay',
    channel: 'ShopeeFood',
    status: 'unconfirmed',
    partnerStatus: 'Đã đẩy đơn về quán',
    note: 'Giao nhanh giúp em, trân châu để riêng không bị nát ạ.',
    items: [
      {
        id: 'item-u1-1',
        name: 'Trà sữa Trân châu Đường đen (L)',
        qtyStr: '2',
        totalPriceStr: '70.000',
        note: 'Ít ngọt, đá riêng'
      },
      {
        id: 'item-u1-2',
        name: 'Bánh tráng nướng phô mai đặc biệt',
        qtyStr: '1',
        totalPriceStr: '35.000',
        note: 'Nhiều phô mai'
      },
      {
        id: 'item-u1-3',
        name: 'Trà đào cam sả hạt chia (M)',
        qtyStr: '1',
        totalPriceStr: '35.000'
      }
    ]
  },
  {
    id: 'oo-u2',
    code: 'GF-992104',
    customerName: 'Nguyễn Quốc Việt',
    phone: '0912888999',
    address: 'Số 42 Hàng Bạc, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội',
    orderTime: '16:10 - 07/24/2026',
    receiveTime: '16:50 - 07/24/2026',
    timeAgo: '2 phút trước',
    itemsCountStr: '2 món',
    totalPriceStr: '90.000',
    totalPriceNum: 90000,
    paymentMethod: 'Ví GrabPay',
    channel: 'Grab',
    status: 'unconfirmed',
    items: [
      {
        id: 'item-u2-1',
        name: 'Cơm tấm sườn bì chả đặc biệt',
        qtyStr: '1',
        totalPriceStr: '65.000'
      },
      {
        id: 'item-u2-2',
        name: 'Canh khổ qua dồn thịt',
        qtyStr: '1',
        totalPriceStr: '25.000'
      }
    ]
  },
  {
    id: 'oo-u3',
    code: 'SPF-881205',
    customerName: 'Lê Minh Tuấn',
    phone: '0936999000',
    address: '12 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    orderTime: '16:12 - 07/24/2026',
    receiveTime: '16:55 - 07/24/2026',
    timeAgo: 'Vừa xong',
    itemsCountStr: '2 món',
    totalPriceStr: '70.000',
    totalPriceNum: 70000,
    paymentMethod: 'Thanh toán tiền mặt',
    channel: 'ShopeeFood',
    status: 'unconfirmed',
    partnerStatus: 'Quán đã nhận đơn',
    items: [
      {
        id: 'item-u3-1',
        name: 'Phở bò tái nạm',
        qtyStr: '1',
        totalPriceStr: '60.000',
        note: 'Không củ hành'
      },
      {
        id: 'item-u3-2',
        name: 'Quẩy giòn (3 cái)',
        qtyStr: '1',
        totalPriceStr: '10.000'
      }
    ]
  },
  {
    id: 'oo-u4',
    code: 'GF-554106',
    customerName: 'Phạm Hoàng Nam',
    phone: '0977222333',
    address: 'Số 88 Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội',
    orderTime: '16:14 - 07/26/2026',
    receiveTime: '16:55 - 07/26/2026',
    timeAgo: 'Vừa xong',
    itemsCountStr: '2 món',
    totalPriceStr: '115.000',
    totalPriceNum: 115000,
    paymentMethod: 'Ví GrabPay',
    channel: 'Grab',
    status: 'processing',
    partnerStatus: 'Đang tìm tài xế',
    items: [
      {
        id: 'item-u4-1',
        name: 'Bún chả Hà Nội đặc sản',
        qtyStr: '1',
        totalPriceStr: '65.000'
      },
      {
        id: 'item-u4-2',
        name: 'Nem hải sản chiên xù (2 chiếc)',
        qtyStr: '1',
        totalPriceStr: '50.000'
      }
    ]
  },
  {
    id: 'oo-u5',
    code: 'SPF-773107',
    customerName: 'Vũ Thu Trang',
    phone: '0904111222',
    address: '25 Nguyễn Du, Quận Hai Bà Trưng, Hà Nội',
    orderTime: '16:15 - 07/26/2026',
    receiveTime: '17:00 - 07/26/2026',
    timeAgo: 'Vừa xong',
    itemsCountStr: '1 món',
    totalPriceStr: '85.000',
    totalPriceNum: 85000,
    paymentMethod: 'Thanh toán qua Ví ShopeePay',
    channel: 'ShopeeFood',
    status: 'unconfirmed',
    items: [
      {
        id: 'item-u5-1',
        name: 'Mì Quảng tôm thịt trứng cút',
        qtyStr: '1',
        totalPriceStr: '85.000'
      }
    ]
  },
  {
    id: 'oo-1',
    code: 'DH2309000',
    customerName: 'Hoàng Mai Anh',
    phone: '0983123456',
    address: 'Số 18 Hàng Buồm, Phường Hàng Buồm, Quận Hoàn Kiếm, Hà Nội',
    orderTime: '16:07 - 07/23/2026',
    receiveTime: '18:51 - 07/23/2026',
    timeAgo: '2h trước',
    itemsCountStr: '1 món',
    totalPriceStr: '54.000',
    totalPriceNum: 54000,
    paymentMethod: 'Thanh toán tiền mặt',
    channel: 'ShopeeFood',
    status: 'processed',
    driverName: 'Đặng Quốc Huy',
    driverPhone: '0978 123 789',
    driverPlate: '29E1-456.78',
    driverStatus: 'Đã nhận đơn & đang di chuyển',
    items: [
      {
        id: 'item-1',
        name: 'Bún bề bề',
        qtyStr: '1',
        totalPriceStr: '50.000'
      }
    ]
  },
  {
    id: 'oo-2',
    code: 'DH2309001',
    customerName: 'Nguyễn Hoàng Nam',
    phone: '0912888999',
    address: 'Số 42 Hàng Bạc, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội',
    orderTime: '16:07 - 07/23/2026',
    receiveTime: '18:51 - 07/23/2026',
    timeAgo: '2h trước',
    itemsCountStr: '1 món',
    totalPriceStr: '54.000',
    totalPriceNum: 54000,
    paymentMethod: 'Thanh toán tiền mặt',
    channel: 'ShopeeFood',
    status: 'processed',
    partnerStatus: 'Tài xế đã nhận đơn',
    driverName: 'Nguyễn Tiến Minh',
    driverPhone: '0904 555 888',
    driverPlate: '29C1-888.12',
    driverStatus: 'Đang đến quán lấy đồ',
    note: 'Gọi điện trước khi đến 5 phút.',
    items: [
      {
        id: 'item-2',
        name: 'Bún bề bề đặc biệt',
        qtyStr: '1',
        totalPriceStr: '54.000',
        note: 'Thêm tỏi ớt băm riêng'
      }
    ]
  },
  {
    id: 'oo-3',
    code: 'GF2309002',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '12 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    orderTime: '15:30 - 07/23/2026',
    receiveTime: '18:00 - 07/23/2026',
    timeAgo: '3h trước',
    itemsCountStr: '2 món',
    totalPriceStr: '120.000',
    totalPriceNum: 120000,
    paymentMethod: 'Ví GrabPay',
    channel: 'Grab',
    status: 'processing',
    driverName: 'Trần Văn Đức',
    driverPhone: '0936 999 000',
    driverPlate: '30F-999.88',
    driverStatus: 'Đang đợi bếp chế biến',
    note: 'Để ở quầy bảo vệ tầng 1, người nhận anh Nam.',
    items: [
      {
        id: 'item-3-1',
        name: 'Cơm rang dưa bò',
        qtyStr: '1',
        totalPriceStr: '60.000',
        note: 'Nhiều dưa chua, rang khô giòn'
      },
      {
        id: 'item-3-2',
        name: 'Trà quất mật ong',
        qtyStr: '1',
        totalPriceStr: '60.000'
      }
    ]
  },
  {
    id: 'oo-4',
    code: 'DH2309003',
    customerName: 'Trần Thị B',
    phone: '0987654321',
    address: '45 Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội',
    orderTime: '15:10 - 07/23/2026',
    receiveTime: '17:45 - 07/23/2026',
    timeAgo: '3h trước',
    itemsCountStr: '1 món',
    totalPriceStr: '85.000',
    totalPriceNum: 85000,
    paymentMethod: 'Thanh toán tiền mặt',
    channel: 'ShopeeFood',
    status: 'processing',
    driverName: 'Lê Hoàng Anh',
    driverPhone: '0915 222 333',
    driverPlate: '29H1-777.66',
    driverStatus: 'Đã phân công tài xế',
    items: [
      {
        id: 'item-4-1',
        name: 'Phở bò tái lăn',
        qtyStr: '1',
        totalPriceStr: '85.000'
      }
    ]
  },
  {
    id: 'oo-5',
    code: 'GF2309004',
    customerName: 'Lê Văn C',
    phone: '0905111222',
    address: '88 Hai Bà Trưng, Hoàn Kiếm, Hà Nội',
    orderTime: '14:20 - 07/23/2026',
    receiveTime: '17:00 - 07/23/2026',
    timeAgo: '4h trước',
    itemsCountStr: '1 món',
    totalPriceStr: '65.000',
    totalPriceNum: 65000,
    paymentMethod: 'Ví GrabPay',
    channel: 'Grab',
    status: 'processing',
    driverName: 'Phạm Thanh Sơn',
    driverPhone: '0982 333 444',
    driverPlate: '30H-111.22',
    driverStatus: 'Đang di chuyển',
    items: [
      {
        id: 'item-5-1',
        name: 'Bún chả Hà Nội',
        qtyStr: '1',
        totalPriceStr: '65.000'
      }
    ]
  },
  {
    id: 'oo-6',
    code: 'DH2309005',
    customerName: 'Phạm Minh D',
    phone: '0933444555',
    address: '22 Ngô Quyền, Hoàn Kiếm, Hà Nội',
    orderTime: '14:00 - 07/23/2026',
    receiveTime: '16:30 - 07/23/2026',
    timeAgo: '4h trước',
    itemsCountStr: '2 món',
    totalPriceStr: '110.000',
    totalPriceNum: 110000,
    paymentMethod: 'Thanh toán tiền mặt',
    channel: 'ShopeeFood',
    status: 'processing',
    driverName: 'Vũ Ngọc Khánh',
    driverPhone: '0903 666 777',
    driverPlate: '29K1-333.22',
    driverStatus: 'Đã nhận đơn',
    items: [
      {
        id: 'item-6-1',
        name: 'Miến gà chạy bộ',
        qtyStr: '1',
        totalPriceStr: '70.000'
      },
      {
        id: 'item-6-2',
        name: 'Nước ngô ngọt',
        qtyStr: '1',
        totalPriceStr: '40.000'
      }
    ]
  },
  {
    id: 'oo-7',
    code: 'GF2309006',
    customerName: 'Hoàng Văn E',
    phone: '0977888999',
    address: '10 Hàng Gai, Hoàn Kiếm, Hà Nội',
    orderTime: '13:00 - 07/23/2026',
    receiveTime: '15:30 - 07/23/2026',
    timeAgo: '5h trước',
    itemsCountStr: '1 món',
    totalPriceStr: '95.000',
    totalPriceNum: 95000,
    paymentMethod: 'Ví GrabPay',
    channel: 'Grab',
    status: 'processed',
    driverName: 'Ngô Tấn Tài',
    driverPhone: '0918 444 555',
    driverPlate: '30E-555.44',
    driverStatus: 'Đang giao hàng',
    items: [
      {
        id: 'item-7-1',
        name: 'Cơm sườn nướng mật ong',
        qtyStr: '1',
        totalPriceStr: '95.000'
      }
    ]
  },
  {
    id: 'oo-8',
    code: 'DH2309007',
    customerName: 'Đỗ Thị F',
    phone: '0966555444',
    address: '55 Bà Triệu, Hoàn Kiếm, Hà Nội',
    orderTime: '12:00 - 07/23/2026',
    receiveTime: '14:30 - 07/23/2026',
    timeAgo: '6h trước',
    itemsCountStr: '1 món',
    totalPriceStr: '50.000',
    totalPriceNum: 50000,
    paymentMethod: 'Chuyển khoản',
    channel: 'ShopeeFood',
    status: 'completed',
    driverName: 'Bùi Đức Anh (ShopeeFood)',
    driverPhone: '0972 111 222',
    driverPlate: '29D2-999.00',
    driverStatus: 'Giao hàng hoàn tất',
    items: [
      {
        id: 'item-8-1',
        name: 'Bún riêu cua đặc biệt',
        qtyStr: '1',
        totalPriceStr: '50.000'
      }
    ]
  },
  {
    id: 'oo-10',
    code: 'GF2309009',
    customerName: 'Vũ Hải Đăng',
    phone: '0944111222',
    address: '77 Huỳnh Thúc Kháng, Đống Đa, Hà Nội',
    orderTime: '11:45 - 07/23/2026',
    receiveTime: '12:20 - 07/23/2026',
    timeAgo: '6h trước',
    itemsCountStr: '1 món',
    totalPriceStr: '45.000',
    totalPriceNum: 45000,
    paymentMethod: 'Ví GrabPay',
    channel: 'Grab',
    status: 'completed',
    driverName: 'Phạm Quốc Cường',
    driverPhone: '0912 333 444',
    driverPlate: '30G-888.99',
    driverStatus: 'Giao hàng hoàn tất',
    note: 'Giao hàng thành công tại lễ tân tầng 1.',
    items: [
      {
        id: 'item-10-1',
        name: 'Trà sữa ô long nướng (L)',
        qtyStr: '1',
        totalPriceStr: '45.000',
        note: '50% đường, ít đá'
      }
    ]
  },
  {
    id: 'oo-9',
    code: 'GF2309008',
    customerName: 'Ngô Quang G',
    phone: '0911222333',
    address: '30 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội',
    orderTime: '11:15 - 07/23/2026',
    receiveTime: '13:00 - 07/23/2026',
    timeAgo: '7h trước',
    itemsCountStr: '1 món',
    totalPriceStr: '45.000',
    totalPriceNum: 45000,
    paymentMethod: 'Ví GrabPay',
    channel: 'Grab',
    status: 'cancelled',
    cancelledBy: 'Do người dùng hủy',
    cancelReason: 'Khách đổi ý, không muốn nhận món đã đặt',
    driverName: 'Trịnh Quốc Bảo',
    driverPhone: '0901 888 999',
    driverPlate: '30A-123.99',
    driverStatus: 'Đã hủy',
    items: [
      {
        id: 'item-9-1',
        name: 'Phở gà đùi',
        qtyStr: '1',
        totalPriceStr: '45.000'
      }
    ]
  }
];

export default function OrderOnlineView({ 
  onBackToMain, 
  onNavigateToView,
  notifications = [],
  onNotificationClick,
  orders: controlledOrders,
  setOrders: controlledSetOrders,
  grabUnconfirmedCount = 0,
  shopeeUnconfirmedCount = 0,
  onlineUnconfirmedCount = 0,
  onConfirmAppOrder
}: OrderOnlineViewProps) {
  const [internalOrders, setInternalOrders] = useState<OnlineOrder[]>(INITIAL_ONLINE_ORDERS);
  const orders = controlledOrders ?? internalOrders;
  const setOrders = controlledSetOrders ?? setInternalOrders;

  const [activeTab, setActiveTab] = useState<'unconfirmed' | 'processing' | 'processed' | 'completed' | 'cancelled'>('unconfirmed');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<'all' | 'ShopeeFood' | 'Grab'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('oo-u1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rightDetailTab, setRightDetailTab] = useState<'info' | 'partner'>('info');
  const [printModalOrder, setPrintModalOrder] = useState<OnlineOrder | null>(null);
  const [deliveryPrintOrder, setDeliveryPrintOrder] = useState<OnlineOrder | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<OnlineOrder | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState<string>('');
  const [selectedReasonPreset, setSelectedReasonPreset] = useState<string>('Nhà hàng tạm hết món trong thực đơn');
  const [toastText, setToastText] = useState<string | null>(null);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState<boolean>(false);

  const getPaymentDetails = (order: OnlineOrder) => {
    let itemsSubtotal = order.items.reduce((sum, item) => {
      const val = parseInt(item.totalPriceStr.replace(/\D/g, ''), 10) || 0;
      return sum + val;
    }, 0);

    if (itemsSubtotal === 0) {
      itemsSubtotal = order.totalPriceNum || 100000;
    }

    const discount = itemsSubtotal >= 100000 ? 10000 : 5000;
    const shipping = order.channel === 'Grab' ? 20000 : 18000;
    const appFee = 5000;

    const currentTotal = itemsSubtotal - discount + shipping + appFee;
    let tip = order.totalPriceNum - currentTotal;

    let finalSubtotal = itemsSubtotal;
    let finalDiscount = discount;
    let finalShipping = shipping;
    let finalAppFee = appFee;

    if (tip < 0) {
      finalDiscount = Math.max(0, itemsSubtotal + shipping + appFee - order.totalPriceNum);
      tip = 0;
    }

    const formatVND = (val: number) => {
      return val.toLocaleString('vi-VN') + ',00';
    };

    return {
      subtotalStr: formatVND(finalSubtotal),
      discountStr: `-${formatVND(finalDiscount)}`,
      shippingStr: `+${formatVND(finalShipping)}`,
      appFeeStr: `+${formatVND(finalAppFee)}`,
      tipStr: `+${formatVND(tip)}`,
      totalStr: formatVND(order.totalPriceNum)
    };
  };

  useEffect(() => {
    if (toastText) {
      const timer = setTimeout(() => {
        setToastText(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastText]);

  const REASON_PRESETS = [
    'Nhà hàng tạm hết món trong thực đơn',
    'Quán quá tải, bận không phục vụ kịp',
    'Đã hết giờ bán hàng / chuẩn bị đóng cửa',
    'Khách hàng gọi điện báo hủy đơn',
    'Không liên hệ được với tài xế / khách hàng'
  ];

  const unconfirmedCount = useMemo(() => {
    return orders.filter(o => o.status === 'unconfirmed').length;
  }, [orders]);

  const processingCount = useMemo(() => {
    return orders.filter(o => o.status === 'processing').length;
  }, [orders]);

  const processedCount = useMemo(() => {
    return orders.filter(o => o.status === 'processed').length;
  }, [orders]);

  const shopeeCount = useMemo(() => {
    return orders.filter(o => (o.channel === 'ShopeeFood' || (!o.channel && !o.code.startsWith('GF'))) && o.status === activeTab).length;
  }, [orders, activeTab]);

  const grabCount = useMemo(() => {
    return orders.filter(o => (o.channel === 'Grab' || o.code.startsWith('GF')) && o.status === activeTab).length;
  }, [orders, activeTab]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showReceiptDropdown, setShowReceiptDropdown] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = o.status === activeTab;
      if (!matchStatus) return false;

      const isGrab = o.channel === 'Grab' || o.code.startsWith('GF');
      const channelName = isGrab ? 'Grab' : 'ShopeeFood';
      if (selectedChannelFilter !== 'all' && channelName !== selectedChannelFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.code.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    });
  }, [orders, activeTab, selectedChannelFilter, searchQuery]);

  // Keep selected order in sync
  const selectedOrder = useMemo(() => {
    const found = filteredOrders.find(o => o.id === selectedOrderId);
    return found || filteredOrders[0] || null;
  }, [filteredOrders, selectedOrderId]);

  const handleConfirmOrder = (orderId: string) => {
    if (onConfirmAppOrder) {
      onConfirmAppOrder(orderId);
    }
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      if (o.status === 'unconfirmed') {
        return { 
          ...o, 
          status: 'processing',
          partnerStatus: 'Quán đã xác nhận đơn'
        };
      }
      if (o.status === 'processing') {
        return { 
          ...o, 
          status: 'processed',
          partnerStatus: 'Tài xế đã lấy hàng'
        };
      }
      if (o.status === 'processed') {
        return { 
          ...o, 
          status: 'completed',
          partnerStatus: 'Giao hàng thành công'
        };
      }
      return o;
    }));
  };

  const handleCancelOrder = (orderId: string, customReason?: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { 
      ...o, 
      status: 'cancelled',
      partnerStatus: o.status === 'unconfirmed' ? 'Quán không thể phục vụ đơn hàng' : 'Đơn hàng đã bị hủy',
      cancelledBy: o.status === 'unconfirmed' ? 'Do quán từ chối' : 'Do quán hủy',
      cancelReason: customReason || 'Nhà hàng tạm hết món / bận không phục vụ kịp'
    } : o));
  };

  const handleConfirmCancelWithReason = () => {
    if (!cancelModalOrder) return;
    const finalReason = cancelReasonText.trim() || selectedReasonPreset;
    handleCancelOrder(cancelModalOrder.id, finalReason);
    const actionName = cancelModalOrder.status === 'unconfirmed' ? 'từ chối' : 'hủy';
    setToastText(`Đã ${actionName} đơn hàng ${cancelModalOrder.code}`);
    setCancelModalOrder(null);
  };

  return (
    <div id="order-online-container" className="flex flex-col h-full bg-[#E5E5E5] select-none text-[13px] font-sans relative">
      {/* Toast Notification Banner */}
      {toastText && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-gray-900/95 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-gray-700/60 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          <span>{toastText}</span>
          <button 
            onClick={() => setToastText(null)}
            className="ml-2 text-gray-400 hover:text-white transition cursor-pointer p-0.5 rounded hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. TOP HEADER BAR */}
      <header id="online-header" className="bg-[#0973B9] h-11 text-white flex items-center justify-between px-2 shrink-0 font-medium">
        <div id="header-left" className="flex items-center h-full">
          {/* Home Icon */}
          <button 
            id="btn-home-nav" 
            onClick={onBackToMain}
            className="hover:bg-[#00497D] h-full px-3 flex items-center transition"
            title="Về màn hình chính"
          >
            <Home className="w-5 h-5 text-white" />
          </button>

          {/* Tab: Order */}
          <button 
            id="tab-order-main" 
            onClick={onBackToMain}
            className="hover:bg-[#00497D] h-full px-4 flex items-center text-white/90 text-sm transition font-medium"
          >
            <span id="label-order">Order</span>
          </button>

          {/* Tab: Sơ đồ */}
          <button 
            id="tab-sodo-main" 
            onClick={onBackToMain}
            className="hover:bg-[#00497D] h-full px-4 flex items-center text-white/90 text-sm transition font-medium"
          >
            <span id="label-sodo">Sơ đồ</span>
          </button>

          {/* Active Tab: Order Online */}
          <div 
            id="tab-order-online-active" 
            className="bg-white text-[#0973B9] h-full flex items-center px-4 font-bold text-sm gap-1.5 shadow-sm rounded-t-lg"
          >
            <Bell className="w-4 h-4 text-[#0973B9]" />
            <span id="label-order-online" className="font-extrabold text-[#0973B9]">Order Online</span>
          </div>
        </div>

        {/* Header Right Actions - Matching MISA CUKCUK POS Header */}
        <div id="header-right" className="flex items-center h-full gap-1 sm:gap-1.5">
          {/* 1. + ORDER ▾ button */}
          <button 
            id="add-online-order-btn" 
            className="flex items-center gap-1 bg-transparent hover:bg-white/10 px-2.5 h-8 rounded text-white font-bold text-xs transition uppercase shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="tracking-wider">ORDER</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/90 -ml-0.5" />
          </button>

          {/* 2. Hamburger menu button */}
          <div className="relative h-full">
            <button 
              id="menu-toggle-btn-online"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`h-full px-2 sm:px-2.5 flex items-center hover:bg-[#00497D] transition ${dropdownOpen ? 'bg-[#00497D]' : ''}`}
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

          {/* 3. Globe icon */}
          <button id="globe-btn-online" className="hover:bg-[#00497D] p-2 rounded transition" title="MISA CUKCUK">
            <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 4. Cloud download icon */}
          <button id="cloud-sync-btn-online" className="hover:bg-[#00497D] p-2 rounded transition" title="Đồng bộ đám mây">
            <CloudDownload className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 5. Exchange / Arrows left right icon */}
          <button id="exchange-sync-btn-online" className="hover:bg-[#00497D] p-2 rounded transition" title="Đồng bộ dữ liệu">
            <ArrowLeftRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 6. Receipt icon with Dropdown */}
          <div className="relative" id="receipt-dropdown-container">
            <button 
              id="receipt-btn-online" 
              onClick={() => {
                setShowReceiptDropdown(!showReceiptDropdown);
                setShowNotificationsDropdown(false);
                setDropdownOpen(false);
              }}
              className={`p-2 rounded transition relative flex items-center justify-center ${
                unconfirmedCount > 0 
                  ? 'bg-[#F27024] text-white animate-pulse-fast' 
                  : 'hover:bg-[#00497D] text-white'
              }`} 
              title="Hóa đơn"
            >
              <div className="relative">
                <InvoiceIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                {unconfirmedCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#DA251C] text-white font-black text-[9px] w-3.5 h-3.5 rounded-sm flex items-center justify-center leading-none border border-white/20 select-none">
                    i
                  </span>
                )}
              </div>
            </button>

            {showReceiptDropdown && (
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
                    onNavigateToView('grab');
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
                  {grabUnconfirmedCount > 0 ? (
                    <span className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                      {grabUnconfirmedCount}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal text-xs">(0)</span>
                  )}
                </div>

                {/* 4. Giao hàng từ ShopeeFood */}
                <div 
                  onClick={() => {
                    onNavigateToView('shopeefood');
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
                  {shopeeUnconfirmedCount > 0 ? (
                    <span className="bg-[#DA251C] text-white font-bold text-xs h-5 px-2 rounded-full flex items-center justify-center">
                      {shopeeUnconfirmedCount}
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
              id="bell-alert-btn-online" 
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
                    <span>Thông báo đơn hàng ({notifications ? notifications.filter((n: any) => !n.read).length : 0} mới)</span>
                  </div>
                  <button onClick={() => setShowNotificationsDropdown(false)} className="text-white hover:text-gray-200 p-0.5 rounded hover:bg-white/10 transition cursor-pointer">✕</button>
                </div>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
                  {(!notifications || notifications.length === 0) ? (
                    <div className="p-4 text-center text-gray-500 font-medium text-xs">Không có thông báo mới.</div>
                  ) : (
                    notifications.map((notif: any) => {
                      const isGrab = notif.channel === 'Grab' || (notif.code && notif.code.startsWith('GF'));
                      return (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            if (onNotificationClick) onNotificationClick(notif);
                            setShowNotificationsDropdown(false);
                          }}
                          className={`p-3 hover:bg-[#F0F6FE] cursor-pointer transition-colors flex gap-2.5 items-center ${
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

          {/* 8. User profile icon */}
          <button id="user-profile-btn-online" className="hover:bg-[#00497D] p-2 rounded transition flex items-center justify-center" title="Tài khoản">
            <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* 2. SUB-HEADER FILTER BAR */}
      <div id="online-filter-bar" className="bg-white border-b border-gray-300 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-xs">
        <div id="filter-tabs" className="flex items-center gap-1.5 flex-wrap">
          <button
            id="btn-unconfirmed-tab"
            onClick={() => setActiveTab('unconfirmed')}
            className={`px-3 h-8 rounded text-xs font-bold transition border flex items-center justify-center shrink-0 ${
              activeTab === 'unconfirmed'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>Chưa xác nhận ({unconfirmedCount})</span>
          </button>

          <button
            id="btn-processing-tab"
            onClick={() => setActiveTab('processing')}
            className={`px-3 h-8 rounded text-xs font-bold transition border flex items-center justify-center shrink-0 ${
              activeTab === 'processing'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Chờ lấy hàng ({processingCount})
          </button>

          <button
            id="btn-processed-tab"
            onClick={() => setActiveTab('processed')}
            className={`px-3 h-8 rounded text-xs font-bold transition border flex items-center justify-center shrink-0 ${
              activeTab === 'processed'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Đã xử lý ({processedCount})
          </button>

          <button
            id="btn-completed-tab"
            onClick={() => setActiveTab('completed')}
            className={`px-3 h-8 rounded text-xs font-bold transition border flex items-center justify-center shrink-0 ${
              activeTab === 'completed'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Đã hoàn thành
          </button>

          <button
            id="btn-cancelled-tab"
            onClick={() => setActiveTab('cancelled')}
            className={`px-3 h-8 rounded text-xs font-bold transition border flex items-center justify-center shrink-0 ${
              activeTab === 'cancelled'
                ? 'bg-[#00497D] text-white border-[#00497D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Đã huỷ
          </button>

          {/* Partner filter chips */}
          <div className="h-4 w-px bg-gray-300 mx-2.5 hidden sm:block"></div>

          <div id="partner-filter-group" className="flex items-center gap-1.5 ml-0.5">
            <span className="text-xs font-semibold text-gray-600">Đối tác:</span>
            <button
              id="filter-partner-all"
              onClick={() => setSelectedChannelFilter('all')}
              className={`px-2.5 h-8 rounded text-xs font-bold transition border flex items-center justify-center ${
                selectedChannelFilter === 'all'
                  ? 'bg-[#00497D] text-white border-[#00497D]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>
            <button
              id="filter-partner-shopee"
              onClick={() => setSelectedChannelFilter('ShopeeFood')}
              className={`px-2.5 h-8 rounded text-xs font-bold transition border flex items-center gap-1 ${
                selectedChannelFilter === 'ShopeeFood'
                  ? 'bg-[#00497D] text-white border-[#00497D]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <img src={SHOPEE_LOGO} alt="ShopeeFood" className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" />
              <span>ShopeeFood</span>
            </button>
            <button
              id="filter-partner-grab"
              onClick={() => setSelectedChannelFilter('Grab')}
              className={`px-2.5 h-8 rounded text-xs font-bold transition border flex items-center gap-1 ${
                selectedChannelFilter === 'Grab'
                  ? 'bg-[#00497D] text-white border-[#00497D]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <img src={GRAB_LOGO} alt="Grab" className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" />
              <span>Grab</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div id="search-box-wrapper" className="relative w-72 sm:w-80">
          <input
            id="search-order-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm mã đơn, SĐT, khách hàng"
            className="w-full pl-3 pr-8 h-8 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#0973B9] bg-white text-gray-800 placeholder-gray-400"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 3. MAIN CONTENT BODY (2 COLUMNS) */}
      <div id="online-main-content" className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: ORDER CARDS GRID */}
        <div id="left-cards-area" className="flex-1 bg-[#E5E5E5] p-3 flex flex-col justify-between overflow-y-auto">
          {filteredOrders.length === 0 ? (
            <div id="empty-state-online" className="flex-1 flex flex-col items-center justify-center text-gray-500 font-medium py-10">
              <Truck className="w-12 h-12 text-gray-400 mb-2 stroke-1" />
              <p className="text-sm">Không có đơn hàng nào trong danh sách</p>
            </div>
          ) : (
            <div id="cards-grid" className="flex flex-wrap gap-3 items-start">
              {filteredOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                const isGrab = ord.channel === 'Grab' || ord.code.startsWith('GF');
                const channelName = isGrab ? 'Grab' : 'ShopeeFood';
                const logoUrl = isGrab ? GRAB_LOGO : SHOPEE_LOGO;

                return (
                  <div
                    key={ord.id}
                    id={`card-${ord.id}`}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`w-[230px] rounded bg-white shadow-xs overflow-hidden border cursor-pointer transition ${
                      isSelected 
                        ? isGrab 
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30' 
                          : 'border-orange-500 ring-2 ring-orange-400/30'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {/* Card Header */}
                    <div 
                      className={`px-2.5 py-1.5 flex items-center justify-between text-xs font-semibold ${
                        isSelected 
                          ? isGrab ? 'bg-emerald-700 text-white' : 'bg-orange-600 text-white'
                          : 'bg-white text-gray-800 border-b border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <img 
                          src={logoUrl} 
                          alt={channelName} 
                          className="w-[20px] h-[20px] object-contain shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <span className={`font-bold text-[13px] truncate ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}>
                          {ord.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className={isSelected ? 'text-white/90 text-[11px]' : 'text-amber-600 font-medium text-[11px]'}>
                          {ord.timeAgo}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center ml-0.5">
                            <Check className={`w-3 h-3 stroke-[3] ${isGrab ? 'text-emerald-700' : 'text-orange-600'}`} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-2.5 text-xs text-gray-800 space-y-1 bg-white">
                      <div className="font-semibold text-[#DF7D36] text-xs">{ord.customerName}</div>
                      <div className="text-[#DF7D36] text-xs font-medium">{ord.phone}</div>
                      <div className="text-gray-600 text-xs">Đặt lúc: {ord.orderTime}</div>
                      <div className="text-gray-600 text-xs">Nhận lúc: {ord.receiveTime}</div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-2.5 py-1.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between font-bold text-[13px] text-gray-900">
                      <span>{ord.itemsCountStr}</span>
                      <span className="text-gray-900">{ord.totalPriceStr}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Left Column Bottom Status */}
          <div id="left-bottom-status" className="mt-3 pt-2 text-xs text-gray-700 font-medium border-t border-gray-300 shrink-0 flex items-center justify-between">
            <span>Tổng số: {filteredOrders.length} yêu cầu giao hàng</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-orange-600 font-bold">ShopeeFood: {shopeeCount}</span>
              <span className="text-emerald-700 font-bold">Grab: {grabCount}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER DETAILS PANEL */}
        {selectedOrder ? (
          <div id="right-detail-panel" className="w-[410px] bg-white border-l border-gray-300 flex flex-col justify-between shrink-0 shadow-md">
            
            <div className="flex-1 overflow-y-auto">
              {/* Detail Header Tabs */}
              <div id="right-tabs-bar" className="flex items-center border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
                <button
                  id="tab-detail-info"
                  onClick={() => setRightDetailTab('info')}
                  className={`flex-1 py-2.5 text-center border-b-2 transition ${
                    rightDetailTab === 'info'
                      ? 'border-[#0973B9] text-[#0973B9] bg-white'
                      : 'border-transparent hover:text-gray-900'
                  }`}
                >
                  Thông tin order
                </button>
                <button
                  id="tab-detail-partner"
                  onClick={() => setRightDetailTab('partner')}
                  className={`flex-1 py-2.5 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                    rightDetailTab === 'partner'
                      ? 'border-[#0973B9] text-[#0973B9] bg-white'
                      : 'border-transparent hover:text-gray-900'
                  }`}
                >
                  <img 
                    src={(selectedOrder.channel === 'Grab' || selectedOrder.code.startsWith('GF')) ? GRAB_LOGO : SHOPEE_LOGO} 
                    alt="Partner" 
                    className="w-4 h-4 object-contain" 
                    referrerPolicy="no-referrer"
                  />
                  <span>Đối tác giao hàng</span>
                </button>
              </div>

              {/* Detail Info Card Box or Partner Tab Box */}
              {rightDetailTab === 'info' ? (
                <div id="detail-info-box" className="p-3 text-xs text-gray-800 space-y-2 border-b border-gray-200 bg-white">
                  {/* Note Section */}
                  <div>
                    <div className="text-gray-600 font-bold text-xs mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#245FDF] shrink-0" />
                      <span>Ghi chú đơn hàng:</span>
                    </div>
                    {selectedOrder.note ? (
                      <div className="text-xs text-[#245FDF] font-medium leading-relaxed pl-5">
                        {selectedOrder.note}
                      </div>
                    ) : (
                      <div className="text-gray-400 italic text-xs pl-5">Không có ghi chú</div>
                    )}
                  </div>
                </div>
              ) : (
                <div id="detail-partner-box" className="p-3 text-xs text-gray-800 space-y-3 border-b border-gray-200 bg-white">
                  {/* Partner Info Header with Read-Only Badge */}
                  {(() => {
                    const isGrab = selectedOrder.channel === 'Grab' || selectedOrder.code.startsWith('GF');
                    const shopeeInfo = getShopeeStatusProgression(selectedOrder);

                    return (
                      <>
                        <div className={`border rounded-lg p-2.5 flex items-center justify-between gap-2 ${
                          isGrab ? 'bg-emerald-50/80 border-emerald-200' : 'bg-orange-50/80 border-orange-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <img 
                              src={isGrab ? GRAB_LOGO : SHOPEE_LOGO} 
                              alt={isGrab ? "Grab" : "ShopeeFood"} 
                              className="w-6 h-6 object-contain shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-500 text-[11px] font-medium">Đối tác giao hàng:</span>
                                <span className="font-extrabold text-xs text-gray-900">
                                  {isGrab ? 'GrabFood' : 'ShopeeFood'}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono">Mã đơn: {selectedOrder.code}</div>
                            </div>
                          </div>
                        </div>

                        {/* Driver Info Header */}
                        {selectedOrder.driverName ? (
                          <div className="bg-blue-50/70 border border-blue-200/90 rounded-lg p-2.5 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                                  <Truck className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 font-medium leading-none">Tài xế nhận giao hàng</div>
                                  <div className="font-extrabold text-xs text-gray-900 mt-0.5">
                                    {selectedOrder.driverName.replace(/\s*\([^)]*\)/g, '').trim()}
                                  </div>
                                </div>
                              </div>
                              {selectedOrder.driverStatus && (
                                <span className="bg-blue-100 text-blue-800 text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0">
                                  {selectedOrder.driverStatus}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-blue-200/60 text-gray-700">
                              <div>
                                <span className="text-gray-500 font-medium mr-1">Số điện thoại:</span>
                                <span className="font-bold text-gray-900">{selectedOrder.driverPhone || 'Chưa cập nhật'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium mr-1">Biển số xe:</span>
                                <span className="font-bold text-gray-900 font-mono">{selectedOrder.driverPlate || 'Chưa cập nhật'}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 text-center space-y-0.5 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                            <div className="font-semibold text-gray-700 text-xs flex items-center justify-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-gray-400" />
                              <span>Chưa có thông tin tài xế</span>
                            </div>
                            <p className="text-[10.5px] text-gray-500">Đơn hàng đang chờ hệ thống phân công tài xế.</p>
                          </div>
                        )}

                        {/* SHOPEEFOOD STATUS TRACKER / TIMELINE */}
                        <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2.5 shadow-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <img 
                                src={isGrab ? GRAB_LOGO : SHOPEE_LOGO} 
                                alt={isGrab ? "Grab" : "ShopeeFood"} 
                                className="w-4 h-4 object-contain shrink-0" 
                                referrerPolicy="no-referrer"
                              />
                              <span className="font-extrabold text-gray-900 text-xs tracking-tight uppercase">
                                Tiến trình đơn hàng {isGrab ? 'GrabFood' : 'ShopeeFood'}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                              Kênh đẩy về
                            </span>
                          </div>

                          {/* Current Status Highlight Card */}
                          <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                            shopeeInfo.isCancelled || shopeeInfo.isRejected
                              ? 'bg-red-50 border-red-200 text-red-900'
                              : 'bg-gradient-to-r from-orange-50 to-amber-50/60 border-orange-200 text-orange-950'
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                              shopeeInfo.isCancelled || shopeeInfo.isRejected
                                ? 'bg-red-600 text-white'
                                : 'bg-orange-500 text-white shadow-xs'
                            }`}>
                              {shopeeInfo.isCancelled || shopeeInfo.isRejected ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                <CheckCircle2 className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                Trạng thái hiện tại
                              </div>
                              <div className="font-extrabold text-xs sm:text-sm leading-tight text-gray-900 mt-0.5">
                                {shopeeInfo.currentStatus}
                              </div>
                              <div className="text-[10.5px] text-gray-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                                <span>Thời gian đặt: {selectedOrder.orderTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Vertical Stepper Timeline of ShopeeFood Statuses */}
                          <div className="pt-2 space-y-0 relative pl-3.5 border-l-2 border-gray-200 ml-2">
                            {shopeeInfo.isCancelled || shopeeInfo.isRejected ? (
                              <div className="relative pb-3 pl-3">
                                <div className="absolute -left-[20px] top-0 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center ring-4 ring-white">
                                  <XCircle className="w-3.5 h-3.5" />
                                </div>
                                <div className="font-extrabold text-red-700 text-xs">{shopeeInfo.currentStatus}</div>
                                <div className="text-[10.5px] text-red-600 font-medium mt-0.5">
                                  {selectedOrder.cancelReason ? `Lý do: ${selectedOrder.cancelReason}` : 'Đơn hàng đã kết thúc hủy từ kênh'}
                                </div>
                              </div>
                            ) : (
                              shopeeInfo.stepsSequence.map((step, idx) => {
                                const isPassed = idx < shopeeInfo.activeIndex;
                                const isCurrent = idx === shopeeInfo.activeIndex;

                                return (
                                  <div key={idx} className="relative pb-3 pl-3.5 last:pb-0">
                                    {/* Node Bullet */}
                                    <div className={`absolute -left-[20px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white ${
                                      isPassed 
                                        ? 'bg-emerald-600 text-white' 
                                        : isCurrent 
                                          ? 'bg-orange-500 text-white shadow-xs ring-orange-200' 
                                          : 'bg-gray-200 text-gray-400'
                                    }`}>
                                      {isPassed ? (
                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                      ) : isCurrent ? (
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                      ) : (
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                      )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <div className={`text-xs ${
                                          isCurrent 
                                            ? 'font-extrabold text-orange-900' 
                                            : isPassed 
                                              ? 'font-bold text-gray-800' 
                                              : 'font-medium text-gray-400'
                                        }`}>
                                          {step.title}
                                        </div>
                                      </div>

                                      {isPassed && (
                                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded shrink-0">
                                          Đã xong
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* DANH SÁCH MÓN SECTION - Only show in 'info' tab */}
              {rightDetailTab === 'info' && (
                <div id="items-list-section" className="border-b border-gray-200">
                  <div className="px-3 py-2 bg-[#EAF5FC] border-y border-[#BBE2F9] flex items-center justify-between">
                    <span className="font-extrabold text-[#0973B9] uppercase text-xs tracking-wide">DANH SÁCH MÓN</span>
                    <span className="text-[11px] text-[#00497D] font-bold bg-white/80 px-2 py-0.5 rounded-full border border-[#BBE2F9]">Tổng {selectedOrder.items.length} món</span>
                  </div>

                  {/* Table matching strict prompts */}
                  <table id="online-items-table" className="w-full text-left text-[13px] border-collapse">
                    <thead className="bg-[#FAFAFA] text-gray-800 font-bold border-b border-gray-200 text-xs">
                      <tr>
                        <th className="py-2 px-3 text-left">Tên món</th>
                        <th className="py-2 px-2 text-center w-16">SL</th>
                        <th className="py-2 px-3 text-right w-28">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-semibold text-gray-900">
                            <div>{item.name}</div>
                            {item.note && (
                              <div className="text-[11px] font-normal text-[#245FDF] mt-0.5">
                                <span>Ghi chú: {item.note}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-center font-medium text-gray-800">{item.qtyStr}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-gray-900">{item.totalPriceStr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom Summary & Actions */}
            <div id="right-bottom-panel" className="bg-white border-t border-gray-200 p-3 space-y-3 shrink-0">
              {/* Tổng tiền / Thực nhận - Only show in 'info' tab */}
              {rightDetailTab === 'info' && (
                <div className="relative flex items-center justify-between text-sm font-bold text-gray-900 select-none">
                  <span>{selectedOrder.channel === 'ShopeeFood' ? 'Thực nhận' : 'Tổng tiền'}</span>
                  <div className="relative">
                    <div 
                      className="flex items-center gap-1.5 text-[#00497D] cursor-pointer hover:opacity-80 transition group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPaymentDropdown(!showPaymentDropdown);
                      }}
                      title="Xem chi tiết thanh toán"
                    >
                      <span className="text-base font-extrabold group-hover:underline">{selectedOrder.totalPriceStr}</span>
                      <div className="p-0.5 rounded-full hover:bg-blue-100 transition flex items-center justify-center">
                        <Info className="w-4 h-4 text-[#00497D] fill-[#00497D]/10 shrink-0" />
                      </div>
                    </div>

                    {/* Payment breakdown dropdown */}
                    {showPaymentDropdown && (() => {
                      const details = getPaymentDetails(selectedOrder);
                      return (
                        <>
                          {/* Transparent backdrop to close dropdown on outside click */}
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setShowPaymentDropdown(false)} 
                          />
                          
                          <div className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-3.5 z-40 text-xs text-gray-800 space-y-2.5 animate-in fade-in zoom-in-95 duration-150 select-text">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-bold text-gray-900 text-xs">
                              <span className="truncate pr-2">Chi tiết thanh toán ({selectedOrder.code})</span>
                              <button 
                                type="button"
                                onClick={() => setShowPaymentDropdown(false)}
                                className="text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-100 transition cursor-pointer shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Breakdown Rows */}
                            <div className="space-y-2">
                              {/* Section 1 */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-gray-800">
                                  <span className="font-semibold">Tổng tiền món</span>
                                  <span className="font-bold text-gray-900">{details.subtotalStr}</span>
                                </div>

                                <div className="flex justify-between items-center text-red-600">
                                  <span className="font-semibold">Giảm giá</span>
                                  <span className="font-bold text-red-600">{details.discountStr}</span>
                                </div>

                                <div className="flex justify-between items-center text-gray-800">
                                  <span className="font-semibold">Chiết khấu</span>
                                  <span className="font-bold text-gray-900">0đ</span>
                                </div>

                                <div className="flex justify-between items-center text-gray-800">
                                  <span className="font-semibold">Phí giao hàng</span>
                                  <span className="font-bold text-gray-900">{details.shippingStr}</span>
                                </div>

                                <div className="flex justify-between items-center text-gray-800">
                                  <span className="font-semibold">Phí đóng gói</span>
                                  <span className="font-bold text-gray-900">0đ</span>
                                </div>
                              </div>

                              {/* Section 2 */}
                              <div className="border-t border-gray-200 pt-2 space-y-1.5">
                                <div className="flex justify-between items-center text-gray-800">
                                  <span className="font-semibold">Hoa hồng {selectedOrder.channel === 'Grab' ? 'Grab' : 'ShopeeFood'}</span>
                                  <span className="font-bold text-gray-900">-{details.appFeeStr}</span>
                                </div>

                                <div className="flex justify-between items-center text-gray-800">
                                  <span className="font-semibold">Thuế khấu trừ</span>
                                  <span className="font-bold text-gray-900">0đ</span>
                                </div>
                              </div>

                              {/* Section 3 */}
                              <div className="border-t border-dashed border-gray-200 pt-2 flex items-center justify-between mt-2">
                                <span className="font-extrabold text-gray-900 uppercase">Quán thực nhận</span>
                                <span className="font-extrabold text-[#00497D] text-sm">{details.totalStr}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Action Buttons & Status Banners */}
              {(activeTab === 'unconfirmed' || activeTab === 'processing') && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    id="btn-cancel-online"
                    onClick={() => {
                      setCancelModalOrder(selectedOrder);
                      setSelectedReasonPreset(REASON_PRESETS[0]);
                      setCancelReasonText('');
                    }}
                    className="flex-1 h-[50px] px-3 bg-white text-red-600 border border-gray-300 hover:bg-red-50 rounded-lg font-bold text-sm transition flex items-center justify-center text-center cursor-pointer uppercase"
                  >
                    {activeTab === 'processing' ? 'Hủy đơn' : 'Từ chối'}
                  </button>
                  <button
                    id="btn-confirm-online"
                    onClick={() => {
                      if (activeTab === 'unconfirmed') {
                        setPrintModalOrder(selectedOrder);
                      } else if (activeTab === 'processing') {
                        setDeliveryPrintOrder(selectedOrder);
                      } else {
                        handleConfirmOrder(selectedOrder.id);
                      }
                    }}
                    className={`flex-1 h-[50px] px-3 text-white rounded-lg font-bold text-sm transition flex items-center justify-center text-center shadow-xs cursor-pointer uppercase ${
                      activeTab === 'processing'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-[#0973B9] hover:bg-[#00497D]'
                    }`}
                  >
                    {activeTab === 'processing' ? 'Hoàn tất chuẩn bị' : 'Xác nhận'}
                  </button>
                </div>
              )}

              {/* Status Banner for Completed Tab */}
              {activeTab === 'completed' && (
                <div className="pt-1">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 flex items-center justify-center gap-2 font-bold text-xs sm:text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Đã hoàn thành và giao hàng thành công</span>
                  </div>
                </div>
              )}

              {/* Status Banner for Cancelled Tab */}
              {activeTab === 'cancelled' && (
                <div className="pt-1">
                  <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-red-700">
                      <X className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Đã hủy đơn</span>
                    </div>
                    <div className="text-xs space-y-1 pt-1.5 border-t border-red-200/80 text-red-800">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-600">Phân loại:</span>
                        <span className="font-bold text-red-900">{selectedOrder.cancelledBy || 'Do người dùng hủy'}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-semibold text-gray-600 shrink-0">Lý do hủy:</span>
                        <span className="font-medium text-gray-800">{selectedOrder.cancelReason || selectedOrder.note || 'Khách hàng đổi ý, không muốn nhận đơn'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : null}

      </div>

      {/* KITCHEN PRINT RECEIPT MODAL */}
      {printModalOrder && (() => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = (now.getMonth() + 1).toString().padStart(2, '0');
        const dd = now.getDate().toString().padStart(2, '0');
        const hh = now.getHours().toString().padStart(2, '0');
        const min = now.getMinutes().toString().padStart(2, '0');
        const ss = now.getSeconds().toString().padStart(2, '0');
        const timeFormatted = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

        const isGrab = printModalOrder.channel === 'Grab' || printModalOrder.code.startsWith('GF');
        const channelName = isGrab ? 'GrabFood' : 'ShopeeFood';

        return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="bg-[#0973B9] text-white px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Printer className="w-4.5 h-4.5" />
                  <span>Phiếu in bếp chế biến</span>
                </div>
                <button 
                  onClick={() => setPrintModalOrder(null)}
                  className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Paper Receipt View */}
              <div className="p-4 sm:p-6 overflow-y-auto bg-gray-200/80 flex-1 min-h-0 flex flex-col items-center justify-start">
                <div className="bg-white p-6 shadow-md border border-gray-300 w-full max-w-[360px] font-mono text-[13px] text-gray-900 leading-snug space-y-3 shrink-0 my-auto sm:my-0">
                  
                  {/* Receipt Header */}
                  <div className="text-center space-y-1">
                    <div className="font-extrabold text-lg tracking-wide text-black uppercase">
                      PHIẾU BÁO BẾP
                    </div>
                    <div className="text-xs font-semibold text-gray-600">
                      Mã {channelName}: {printModalOrder.code}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {timeFormatted}
                    </div>
                  </div>

                  <div className="border-b border-dashed border-gray-400 my-2"></div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {printModalOrder.items.map((item, idx) => (
                      <div key={item.id || idx} className="space-y-1 pb-1.5 border-b border-dashed border-gray-300 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-sm text-black flex-1">
                            {idx + 1}. {item.name}
                          </span>
                          <span className="font-extrabold text-sm text-black shrink-0">
                            x{item.qtyStr.split(',')[0] || '1'}
                          </span>
                        </div>
                        {item.note && (
                          <div className="text-[12px] text-blue-600 italic pl-3">
                            ** {item.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-b border-dashed border-gray-400 my-2"></div>

                  {/* Customer Note */}
                  {printModalOrder.note && (
                    <>
                      <div className="space-y-1.5">
                        <div className="font-bold text-xs text-red-600">
                          Ghi chú từ khách:
                        </div>
                        <div className="bg-red-50 p-2.5 rounded-lg text-xs text-gray-900 italic font-medium leading-relaxed border border-red-100">
                          {printModalOrder.note}
                        </div>
                      </div>
                      <div className="border-b border-dashed border-gray-400 my-2"></div>
                    </>
                  )}

                  {/* Footer Mark */}
                  <div className="text-center text-xs text-gray-500 italic">
                    * Đơn hàng trực tuyến từ {channelName} *
                  </div>

                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  onClick={() => setPrintModalOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold text-xs hover:bg-gray-100 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    handleConfirmOrder(printModalOrder.id);
                    setToastText(`Đã nhận đơn ${printModalOrder.code} và chuyển sang Đang xử lý`);
                    setPrintModalOrder(null);
                  }}
                  className="px-6 py-2 bg-[#0973B9] text-white rounded-lg font-bold text-xs hover:bg-[#00497D] transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>In</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DELIVERY PRINT RECEIPT MODAL */}
      {deliveryPrintOrder && (() => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        const nowFormatted = `${timeStr} ${dateStr}`;
        const isGrab = deliveryPrintOrder.channel === 'Grab' || deliveryPrintOrder.code.startsWith('GF');
        const channelName = isGrab ? 'GrabFood' : 'ShopeeFood';

        return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="bg-[#0973B9] text-white px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Printer className="w-4.5 h-4.5" />
                  <span>Phiếu in giao hàng</span>
                </div>
                <button 
                  onClick={() => setDeliveryPrintOrder(null)}
                  className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Paper Receipt View */}
              <div className="p-4 sm:p-6 overflow-y-auto bg-gray-200/80 flex-1 min-h-0 flex flex-col items-center justify-start">
                <div className="bg-white p-6 shadow-md border border-gray-300 w-full max-w-[360px] font-mono text-[13px] text-gray-900 leading-snug space-y-3 shrink-0 my-auto sm:my-0">
                  
                  {/* Receipt Header */}
                  <div className="text-center space-y-1 pb-1">
                    <div className="font-extrabold text-sm tracking-wide text-gray-800 uppercase">
                      NHÀ HÀNG PHONG DÊ
                    </div>
                    <div className="text-xs font-bold text-black uppercase">
                      {channelName}
                    </div>
                    <div className="pt-1 flex flex-col items-center justify-center">
                      <span className="font-black text-2xl text-black tracking-tight leading-none">{deliveryPrintOrder.code}</span>
                    </div>
                  </div>

                  <div className="border-b border-dashed border-black/80 my-2"></div>

                  {/* Order Details */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold">Thời gian in:</span>
                      <span className="font-mono">{nowFormatted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Khách hàng:</span>
                      <span className="font-bold">{deliveryPrintOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Điện thoại:</span>
                      <span className="font-mono">{deliveryPrintOrder.phone}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold shrink-0">Địa chỉ giao:</span>
                      <span className="font-medium text-right break-words">{deliveryPrintOrder.address}</span>
                    </div>
                  </div>

                  <div className="border-b border-dashed border-black/80 my-2"></div>

                  {/* Banner Header */}
                  <div className="bg-gray-100 py-1.5 px-2 text-center font-extrabold text-xs uppercase tracking-wider border border-gray-300 text-black">
                    DANH SÁCH MÓN GIAO HÀNG
                  </div>

                  {/* Items List */}
                  <div className="pt-1">
                    <div className="flex justify-between font-extrabold text-xs pb-1.5 border-b border-dashed border-black/80 text-black">
                      <span>Tên món dịch vụ</span>
                      <span className="text-right">SL x ĐG</span>
                    </div>

                    <div className="divide-y divide-dashed divide-gray-300">
                      {deliveryPrintOrder.items.map((item, idx) => (
                        <div key={item.id || idx} className="py-2 space-y-0.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-gray-900 flex-1">
                              {idx + 1}. {item.name}
                            </span>
                            <span className="font-extrabold text-xs shrink-0 text-black">
                              x{item.qtyStr.split(',')[0] || '1'}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-600 pl-3">
                            <span>Đơn giá: {item.priceStr}</span>
                            <span className="font-semibold text-gray-900">{item.totalStr}</span>
                          </div>
                          {item.note && (
                            <div className="text-[11px] text-gray-600 italic pl-3">
                              Ghi chú: {item.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-b border-dashed border-black/80 my-2"></div>

                  {/* Summary */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-extrabold text-sm text-black">
                      <span>TỔNG TIỀN THANH TOÁN:</span>
                      <span className="text-base text-[#0973B9] font-black">{deliveryPrintOrder.totalPriceStr}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Hình thức thanh toán:</span>
                      <span className="font-semibold">{deliveryPrintOrder.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="border-b border-dashed border-black/80 my-2"></div>

                  {/* Footer Mark */}
                  <div className="text-center text-[10px] text-gray-500 italic">
                    [Thiết bị MISA CUKCUK - In lúc {timeStr}]
                  </div>

                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  onClick={() => setDeliveryPrintOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold text-xs hover:bg-gray-100 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    handleConfirmOrder(deliveryPrintOrder.id);
                    setToastText(`Đã chuyển đơn ${deliveryPrintOrder.code} sang Đã xử lý`);
                    setDeliveryPrintOrder(null);
                  }}
                  className="px-6 py-2 bg-[#0973B9] text-white rounded-lg font-bold text-xs hover:bg-[#00497D] transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>In</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CANCEL / REFUSE ORDER REASON MODAL */}
      {cancelModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-white shrink-0" />
                <span>
                  {cancelModalOrder.status === 'unconfirmed' ? 'Từ chối nhận đơn hàng' : 'Hủy đơn hàng'}
                </span>
              </div>
              <button 
                onClick={() => setCancelModalOrder(null)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 text-xs text-gray-800">
              {/* Order Info Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-gray-500 text-[11px] font-medium">Mã đơn hàng:</div>
                  <div className="font-extrabold text-sm text-gray-900">{cancelModalOrder.code}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-[11px] font-medium">Khách hàng:</div>
                  <div className="font-bold text-xs text-gray-900">{cancelModalOrder.customerName}</div>
                </div>
              </div>

              {/* Reason Presets */}
              <div className="space-y-2">
                <label className="font-bold text-xs text-gray-900 block">
                  Vui lòng chọn lý do {cancelModalOrder.status === 'unconfirmed' ? 'từ chối' : 'hủy đơn'}:
                </label>
                <div className="space-y-1.5">
                  {REASON_PRESETS.map((preset, idx) => (
                    <label 
                      key={idx}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition text-xs ${
                        selectedReasonPreset === preset 
                          ? 'border-red-500 bg-red-50/60 font-semibold text-red-900' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => setSelectedReasonPreset(preset)}
                    >
                      <input 
                        type="radio" 
                        name="cancelReasonPreset"
                        checked={selectedReasonPreset === preset}
                        onChange={() => setSelectedReasonPreset(preset)}
                        className="accent-red-600 w-3.5 h-3.5"
                      />
                      <span>{preset}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Reason Textarea */}
              <div className="space-y-1 pt-1">
                <label className="font-semibold text-gray-700 text-[11px]">Ghi chú/Lý do bổ sung (không bắt buộc):</label>
                <textarea
                  value={cancelReasonText}
                  onChange={(e) => setCancelReasonText(e.target.value)}
                  placeholder="Nhập lý do chi tiết..."
                  rows={2}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-end gap-2.5 shrink-0">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-bold text-xs hover:bg-gray-100 transition cursor-pointer"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleConfirmCancelWithReason}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs transition shadow-xs cursor-pointer"
              >
                {cancelModalOrder.status === 'unconfirmed' ? 'Xác nhận từ chối' : 'Xác nhận hủy đơn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. APP GLOBAL FOOTER BAR */}
      <footer id="online-footer-bar" className="bg-[#0973B9] h-6 text-white px-3 text-xs flex items-center justify-between shrink-0 font-mono">
        <div>
          MAKT - cttrang.cukcuk2.misa.local
        </div>
        <div className="flex items-center gap-4">
          <span>Tổng đài tư vấn: 024 7108 6866</span>
          <span>OVR</span>
          <span>NUM</span>
          <span>09:56 - 07/24/2026</span>
        </div>
      </footer>
    </div>
  );
}
