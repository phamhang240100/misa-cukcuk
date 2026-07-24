export interface OrderItem {
  id: string;
  name: string;
  originalPrice: number;
  qty: number;
  totalPrice: number;
  note?: string; // Ghi chú món ăn
}

export type OrderStatus = 'unconfirmed' | 'confirmed' | 'completed' | 'cancelled';
export type OrderChannel = 'Grab' | 'ShopeeFood';

// ShopeeFood: trạng thái đối soát ví (không thu tiền tại quầy)
export type SettlementStatus = 'pending' | 'received';
// ShopeeFood: hình thức nhận đơn (giao hàng / khách tự đến lấy)
export type OrderType = 'delivery' | 'customer_pickup';
// ShopeeFood: mã lý do hủy hợp lệ theo API (79 Hết món / 80 Quán quá tải / 81 Quán đóng cửa)
export type SpfCancelReasonCode = 79 | 80 | 81;

export interface Order {
  id: string;
  code: string;
  channel: OrderChannel;
  itemsCount: number;
  totalPrice: number;
  orderTime: string;
  status: OrderStatus;
  items: OrderItem[];
  customerPhone?: string;
  deliveryAddress?: string;
  driverName?: string;
  driverPhone?: string;
  note?: string; // Ghi chú đơn hàng
  // Detailed breakdown fields requested by user
  subtotalDiscounted?: number; // Thành tiền (đã trừ khuyến mại món)
  billDiscount?: number;       // Khuyến mại hóa đơn
  deliveryFee?: number;        // Phí vận chuyển
  platformFee?: number;        // Phí áp dụng
  driverTip?: number;          // Tip cho vận chuyển
  // ShopeeFood-only fields (Grab giữ nguyên luồng cũ, không dùng các field này)
  merchantNetAmount?: number;          // Quán thực nhận (sau hoa hồng/thuế/KM)
  settlementStatus?: SettlementStatus; // 'pending' Chờ đối soát | 'received' Đã nhận vào ví
  orderType?: OrderType;               // 'delivery' | 'customer_pickup'
  pickupCode?: string;                 // Mã nhận đơn khi khách tự đến lấy
  updatedByShopee?: boolean;           // Đơn đã bị Shopee cập nhật sau xác nhận
  cancelReasonCode?: SpfCancelReasonCode; // Mã lý do hủy 79|80|81
}

export type AppView = 'main' | 'grab' | 'shopeefood';
