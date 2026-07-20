// ============================================================================
// Domain types — Tích hợp Grab Express với CukCuk (C86574)
// ============================================================================

export type Surface = 'web' | 'pos' | 'book';

/** Trạng thái đơn hàng phía CukCuk (thu ngân thao tác). */
export type CukcukStatus =
  | 'cho_gui_doi_tac' // Chờ gửi đối tác
  | 'cho_giao_hang' // Chờ giao hàng
  | 'dang_giao_hang' // Đang giao hàng
  | 'da_thanh_toan'; // Đã thanh toán

/** Trạng thái vòng đời đơn do Grab Express trả về (không tự map sang CukCuk). */
export type GrabExpressStatus =
  | 'ALLOCATING'
  | 'PENDING_PICKUP'
  | 'PICKING_UP'
  | 'PENDING_DROP_OFF'
  | 'IN_DELIVERY'
  | 'COMPLETED'
  | 'IN_RETURN'
  | 'RETURNED'
  | 'CANCELLED'
  | 'FAILED';

export interface RestaurantInfo {
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
}

export interface ConnectionState {
  isConnected: boolean;
  info: RestaurantInfo;
  requireVatInvoice: boolean; // Checkbox: Yêu cầu xuất hóa đơn Phí vận chuyển (VAT)
  vatEmail: string; // Email phục vụ việc xuất hóa đơn
}

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface CustomerAddress {
  id: string;
  freetext: string; // địa chỉ số nhà / đường (freetext)
  ward: string;
  district: string;
  province: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  addresses: CustomerAddress[];
  hasDeliveredBefore: boolean;
}

export interface DeliveryOrder {
  id: string;
  orderNo: string; // Số order
  invoiceNo?: string; // Số hóa đơn (nếu đã phát hành)
  trackingNo?: string; // Mã vận đơn do GE trả về
  customerName: string;
  customerPhone: string;
  address: CustomerAddress;
  items: OrderItem[];
  subtotal: number; // tiền hàng
  shippingFeePartner: number; // Phí GH trả đối tác
  shippingFeeCustomer: number; // Phí GH thu khách
  isCod: boolean; // đơn thu hộ (COD)
  codAmount: number; // Số tiền thu hộ = Còn phải thu
  note?: string; // Ghi chú giao hàng (<=255)
  serviceType: string; // Loại dịch vụ (Siêu tốc - Thực phẩm)
  cukcukStatus: CukcukStatus;
  geStatus?: GrabExpressStatus;
  geStatusUpdatedAt?: string; // Thời gian Grab Express cập nhật trạng thái gần nhất
  driverName?: string; // Người giao (tài xế Grab Express)
  driverPhone?: string; // SĐT tài xế
  scheduledTime: string; // Giờ hẹn trả
  createdAt: string;
}

export interface AppNotification {
  id: string;
  orderId: string;
  refNo: string; // Số hóa đơn nếu có, ngược lại Số order
  trackingNo: string;
  customerName: string;
  geStatus: GrabExpressStatus;
  read: boolean;
  time: string;
}

export type ToastKind = 'success' | 'error' | 'info' | 'warning';
export interface ToastMsg {
  id: number;
  kind: ToastKind;
  title: string;
  desc?: string;
}
