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

export interface Order {
  id: string;
  code: string;
  channel: OrderChannel;
  itemsCount: number;
  totalPrice: number;
  orderTime: string;
  status: OrderStatus;
  items: OrderItem[];
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  driverName?: string;
  driverPhone?: string;
  driverPlate?: string; // Biển số xe tài xế
  driverStatus?: string; // Trạng thái tài xế (VD: Đang tới quán, Đang giao)
  note?: string; // Ghi chú đơn hàng
  // Detailed breakdown fields requested by user
  subtotalDiscounted?: number; // Thành tiền (đã trừ khuyến mại món)
  billDiscount?: number;       // Khuyến mại hóa đơn
  deliveryFee?: number;        // Phí vận chuyển
  platformFee?: number;        // Phí áp dụng
  driverTip?: number;          // Tip cho vận chuyển
  isPickupAtStore?: boolean;   // Đơn hàng lấy tại quán
}

export type AppView = 'main' | 'grab' | 'shopeefood' | 'orderonline' | 'deliveryBook';
