export interface OnlineOrder {
  id: string;
  orderNo: string;
  source: string; // Website / App / Grab / Shopee
  customerName: string;
  customerPhone: string;
  freetext: string;
  province: string;
  district: string;
  ward: string;
  items: {id: string; name: string; qty: number; price: number}[];
  subtotal: number;
  note?: string;
  deliveryTime: string;
  createdAt: string;
}

// Mock đơn Online chờ xác nhận — khớp bản tablet (ONLINE_ORDERS trong PosOrderSurface.tsx).
export const PC_ONLINE_ORDERS: OnlineOrder[] = [
  {
    id: 'pc-on1',
    orderNo: 'ONL-24093',
    source: 'Website',
    customerName: 'Ngô Bảo Châu',
    customerPhone: '0912 888 234',
    freetext: '25 Nguyễn Trãi',
    province: 'TP. Hà Nội',
    district: 'Quận Thanh Xuân',
    ward: 'Phường 1',
    items: [
      {id: 'm3', name: 'Phở gà ta', qty: 2, price: 60000},
      {id: 'm6', name: 'Nước cam ép', qty: 1, price: 35000},
    ],
    subtotal: 155000,
    note: 'Giao trước 12h giúp mình.',
    deliveryTime: '11:40',
    createdAt: '10:20 20/07/2026',
  },
  {
    id: 'pc-on2',
    orderNo: 'ONL-24094',
    source: 'App',
    customerName: 'Lý Gia Huy',
    customerPhone: '0938 111 777',
    freetext: '40 Cát Linh',
    province: 'TP. Hà Nội',
    district: 'Quận Đống Đa',
    ward: 'Phường Dịch Vọng',
    items: [{id: 'm1', name: 'Phở bò chín đặc biệt', qty: 1, price: 65000}],
    subtotal: 65000,
    deliveryTime: '12:15',
    createdAt: '11:05 20/07/2026',
  },
];
