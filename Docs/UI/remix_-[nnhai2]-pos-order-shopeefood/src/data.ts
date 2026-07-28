import { Order } from './types';

export const INITIAL_ORDERS: Order[] = [
  // --- GRAB ORDERS --- (Matches image 2)
  {
    id: 'g-1',
    code: 'GF-720',
    channel: 'Grab',
    itemsCount: 2,
    totalPrice: 410000,
    orderTime: '08:56 SA - 31/12/2020',
    status: 'unconfirmed',
    customerPhone: '0908 123 456',
    deliveryAddress: '22 Bis Nguyễn Thị Minh Khai, Đa Kao, Quận 1, TP. HCM',
    driverName: 'Nguyễn Văn Hùng (GrabExpress)',
    driverPhone: '0912 345 678',
    driverPlate: '59P1-888.99',
    driverStatus: 'Đang đến cửa hàng lấy đồ',
    note: 'Giao gấp trước 12h00, gọi trước khi giao 5 phút.',
    items: [
      {
        id: 'gi-1-1',
        name: 'Baba rang muối',
        originalPrice: 270000,
        qty: 1,
        totalPrice: 270000,
        note: 'Chiên giòn, ít muối, thêm lá lốt'
      },
      {
        id: 'gi-1-2',
        name: 'Cá bạc má kho',
        originalPrice: 150000,
        qty: 1,
        totalPrice: 150000,
        note: 'Nhiều nước kho tiêu, ăn kèm ớt quả'
      }
    ]
  },
  {
    id: 'g-2',
    code: 'GF-256',
    channel: 'Grab',
    itemsCount: 1,
    totalPrice: 260000,
    orderTime: '08:47 SA - 31/12/2020',
    status: 'unconfirmed',
    customerPhone: '0934 987 654',
    deliveryAddress: '155 Hai Bà Trưng, Phường 6, Quận 3, TP. HCM',
    driverName: 'Trần Minh Hải (Grab)',
    driverPhone: '0911 223 344',
    driverPlate: '51F-123.45',
    driverStatus: 'Đã nhận đơn',
    note: 'Nhà có em bé nhỏ, xin không bấm chuông. Gọi điện khách ra lấy.',
    items: [
      {
        id: 'gi-2-1',
        name: 'Lẩu hải sản thái',
        originalPrice: 260000,
        qty: 1,
        totalPrice: 260000,
        note: 'Chua cay vừa, không bỏ nấm rơm'
      }
    ]
  },
  {
    id: 'g-3',
    code: 'GF-369',
    channel: 'Grab',
    itemsCount: 1,
    totalPrice: 190000,
    orderTime: '08:47 SA - 31/12/2020',
    status: 'unconfirmed',
    customerPhone: '0988 555 123',
    deliveryAddress: 'Toà nhà Bitexco, 2 Hải Triều, Bến Nghé, Quận 1, TP. HCM',
    driverName: 'Lê Kiên Trung (Grab)',
    driverPhone: '0944 556 677',
    driverPlate: '59X2-333.44',
    driverStatus: 'Đang di chuyển',
    note: 'Giao cho chị Thu ở bàn lễ tân Tầng 1 Bitexco.',
    items: [
      {
        id: 'gi-3-1',
        name: 'Gà Đông Tảo hấp hành',
        originalPrice: 190000,
        qty: 1,
        totalPrice: 190000,
        note: 'Hấp kỹ, cho thêm muối tiêu chanh'
      }
    ]
  },
  {
    id: 'g-4',
    code: 'GF-449',
    channel: 'Grab',
    itemsCount: 3,
    totalPrice: 610000,
    orderTime: '04:51 CH - 28/12/2020',
    status: 'unconfirmed',
    customerPhone: '0977 444 888',
    deliveryAddress: '720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP. HCM',
    driverName: 'Hoàng Văn Thắng (Grab)',
    driverPhone: '0966 777 888',
    driverPlate: '59V1-999.11',
    driverStatus: 'Đang đến quán',
    note: 'Khách yêu cầu xin thêm 3 bộ muỗng nĩa nhựa và thêm tương ớt.',
    items: [
      {
        id: 'gi-4-1',
        name: 'Bò tơ Tây Ninh nướng',
        originalPrice: 240000,
        qty: 1,
        totalPrice: 240000,
        note: 'Nướng chín tới, giữ độ mềm thịt'
      },
      {
        id: 'gi-4-2',
        name: 'Tôm sú nướng muối ớt',
        originalPrice: 180000,
        qty: 2,
        totalPrice: 360000,
        note: 'Nướng vừa không cháy vỏ, cay vừa'
      },
      {
        id: 'gi-4-3',
        name: 'Bia Tiger lon',
        originalPrice: 10000,
        qty: 1,
        totalPrice: 10000,
        note: 'Ướp lạnh sẵn'
      }
    ]
  },
  {
    id: 'g-5',
    code: 'GF-113',
    channel: 'Grab',
    itemsCount: 3,
    totalPrice: 840000,
    orderTime: '07:03 SA - 22/12/2020',
    status: 'unconfirmed',
    customerPhone: '0901 234 567',
    deliveryAddress: 'Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. HCM',
    driverName: 'Lý Quốc Bảo (Grab)',
    driverPhone: '0933 445 566',
    driverPlate: '59T2-555.66',
    driverStatus: 'Chờ lấy hàng',
    note: 'Cua giao gói cẩn thận bằng giấy bạc giữ nóng.',
    items: [
      {
        id: 'gi-5-1',
        name: 'Cua Huỳnh Đế sốt ớt (840.000,00)',
        originalPrice: 840000,
        qty: 1,
        totalPrice: 840000,
        note: 'Sốt ớt riêng, bẻ sẵn càng cua'
      }
    ]
  },
  {
    id: 'g-6',
    code: 'GF-123',
    channel: 'Grab',
    itemsCount: 1,
    totalPrice: 20000,
    orderTime: '11:30 SA - 30/11/2020',
    status: 'unconfirmed',
    customerPhone: '0945 999 888',
    deliveryAddress: '88 Song Hành, An Phú, Quận 2, TP. HCM',
    driverName: 'Phạm Đức Duy (Grab)',
    driverPhone: '0909 888 777',
    driverPlate: '59Z1-112.33',
    driverStatus: 'Đã nhận đơn',
    note: 'Nước ướp lạnh sẵn.',
    items: [
      {
        id: 'gi-6-1',
        name: 'Nước suối Aquafina',
        originalPrice: 20000,
        qty: 1,
        totalPrice: 20000,
        note: 'Lấy chai lạnh trong tủ mát'
      }
    ]
  },

  // --- SHOPEEFOOD ORDERS --- (Customized addition with Notes and Breakdown items)
  {
    id: 's-1',
    code: 'SPF-901',
    channel: 'ShopeeFood',
    itemsCount: 2,
    totalPrice: 310000,
    orderTime: '10:15 SA - 18/06/2026',
    status: 'unconfirmed',
    customerPhone: '0912 999 111',
    deliveryAddress: '45 Lê Lợi, Bến Nghé, Quận 1, TP. HCM',
    driverName: 'Nguyễn Văn Đạt (ShopeeFood)',
    driverPhone: '0981 777 555',
    note: 'Xin thêm muỗng nĩa, không lấy ớt.',
    subtotalDiscounted: 290000,
    billDiscount: 10000,
    deliveryFee: 20000,
    platformFee: 5000,
    driverTip: 5000,
    items: [
      {
        id: 'si-1-1',
        name: 'Gà chiên nước mắm đặc sắc',
        originalPrice: 130000,
        qty: 1,
        totalPrice: 130000,
        note: 'Ít mặn, nhiều tỏi băm'
      },
      {
        id: 'si-1-2',
        name: 'Gà rán truyền thống giòn rụm',
        originalPrice: 180000,
        qty: 1,
        totalPrice: 180000,
        note: 'Rán thật giòn rụm'
      }
    ]
  },
  {
    id: 's-2',
    code: 'SPF-502',
    channel: 'ShopeeFood',
    itemsCount: 1,
    totalPrice: 120000,
    orderTime: '11:22 SA - 18/06/2026',
    status: 'unconfirmed',
    customerPhone: '0908 678 123',
    deliveryAddress: '320 Cao Thắng, Phường 12, Quận 10, TP. HCM',
    driverName: 'Trịnh Tiến Anh (ShopeeFood)',
    driverPhone: '0902 444 333',
    note: 'Không lấy ớt vào mắm tôm.',
    subtotalDiscounted: 100000,
    billDiscount: 5000,
    deliveryFee: 15000,
    platformFee: 5000,
    driverTip: 5000,
    items: [
      {
        id: 'si-2-1',
        name: 'Bún đậu mắm tôm Đặc biệt',
        originalPrice: 120000,
        qty: 1,
        totalPrice: 120000,
        note: 'Nhiều rau kinh giới'
      }
    ]
  },
  {
    id: 's-3',
    code: 'SPF-334',
    channel: 'ShopeeFood',
    itemsCount: 3,
    totalPrice: 450000,
    orderTime: '12:05 CH - 18/06/2026',
    status: 'unconfirmed',
    customerPhone: '0955 111 222',
    deliveryAddress: 'Toà nhà Sherwood, 127 Pasteur, Quận 3, TP. HCM',
    driverName: 'Vũ Hữu Việt (ShopeeFood)',
    driverPhone: '0917 666 888',
    note: 'Giao hàng không bấm chuông, gọi điện thoại.',
    subtotalDiscounted: 420000,
    billDiscount: 15000,
    deliveryFee: 25000,
    platformFee: 10000,
    driverTip: 10000,
    items: [
      {
        id: 'si-3-1',
        name: 'Lẩu thái Tomyum chua cay',
        originalPrice: 350000,
        qty: 1,
        totalPrice: 350000,
        note: 'Chua cay nhiều'
      },
      {
        id: 'si-3-2',
        name: 'Ba chỉ bò Mỹ nhúng lẩu',
        originalPrice: 80000,
        qty: 1,
        totalPrice: 80000,
        note: 'Cắt lát mỏng vừa phải'
      },
      {
        id: 'si-3-3',
        name: 'Rau nấm tổng hợp tươi',
        originalPrice: 20000,
        qty: 1,
        totalPrice: 20000,
        note: 'Thêm nấm kim châm'
      }
    ]
  },
  {
    id: 's-4',
    code: 'SPF-104',
    channel: 'ShopeeFood',
    itemsCount: 2,
    totalPrice: 90000,
    orderTime: '01:30 CH - 18/06/2026',
    status: 'unconfirmed',
    customerPhone: '0933 654 321',
    deliveryAddress: '12 Phan Xích Long, Phường 2, Phú Nhuận, TP. HCM',
    driverName: 'Lê Văn Nam (ShopeeFood)',
    driverPhone: '0988 222 333',
    note: 'Ly trà sữa ít ngọt, ly kem cheese béo ngậy.',
    subtotalDiscounted: 80000,
    billDiscount: 5000,
    deliveryFee: 10000,
    platformFee: 3000,
    driverTip: 2000,
    items: [
      {
        id: 'si-4-1',
        name: 'Trà sữa trân châu hoàng kim L',
        originalPrice: 50000,
        qty: 1,
        totalPrice: 50000,
        note: '30% đường, 50% đá'
      },
      {
        id: 'si-4-2',
        name: 'Kem cheese trà xanh mát lạnh',
        originalPrice: 40000,
        qty: 1,
        totalPrice: 40000,
        note: 'Thêm trân châu đường đen'
      }
    ]
  },
  {
    id: 's-5',
    code: 'SPF-8000',
    channel: 'ShopeeFood',
    itemsCount: 2,
    totalPrice: 180000,
    orderTime: '02:10 CH - 18/06/2026',
    status: 'unconfirmed',
    customerPhone: '0321 236 528',
    deliveryAddress: '180 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. HCM',
    driverName: 'Phạm Minh Đức (ShopeeFood)',
    driverPhone: '0977 111 444',
    note: 'Giao giờ hành chính, gọi trước 5 phút.',
    subtotalDiscounted: 160000,
    billDiscount: 10000,
    deliveryFee: 18000,
    platformFee: 4000,
    driverTip: 8000,
    items: [
      {
        id: 'si-5-1',
        name: 'Com bò né trứng ốp la',
        originalPrice: 110000,
        qty: 1,
        totalPrice: 110000,
        note: 'Trứng chín lòng đào'
      },
      {
        id: 'si-5-2',
        name: 'Canh rong biển thịt băm',
        originalPrice: 70000,
        qty: 1,
        totalPrice: 70000,
        note: 'Ít muối'
      }
    ]
  },
  {
    id: 's-6',
    code: 'SPF-0040',
    channel: 'ShopeeFood',
    itemsCount: 1,
    totalPrice: 95000,
    orderTime: '02:30 CH - 18/06/2026',
    status: 'unconfirmed',
    customerPhone: '0912 345 678',
    deliveryAddress: '88 Lê Văn Sỹ, Phường 11, Phú Nhuận, TP. HCM',
    driverName: 'Đặng Hoàng Nam (ShopeeFood)',
    driverPhone: '0938 222 555',
    note: 'Không bỏ hành lá.',
    subtotalDiscounted: 85000,
    billDiscount: 5000,
    deliveryFee: 12000,
    platformFee: 3000,
    driverTip: 0,
    isPickupAtStore: true,
    items: [
      {
        id: 'si-6-1',
        name: 'Mì Quảng đặc biệt tôm thịt',
        originalPrice: 95000,
        qty: 1,
        totalPrice: 95000,
        note: 'Nhiều bánh tráng nướng'
      }
    ]
  },
  {
    id: 's-7',
    code: 'SPF-2170',
    channel: 'ShopeeFood',
    itemsCount: 2,
    totalPrice: 210000,
    orderTime: '03:05 CH - 18/06/2026',
    status: 'unconfirmed',
    customerPhone: '0386 168 230',
    deliveryAddress: '254 CMT8, Phường 10, Quận 3, TP. HCM',
    driverName: 'Ngô Thanh Tùng (ShopeeFood)',
    driverPhone: '0909 333 777',
    note: 'Giao cổng chính tòa nhà.',
    subtotalDiscounted: 190000,
    billDiscount: 10000,
    deliveryFee: 20000,
    platformFee: 5000,
    driverTip: 5000,
    isPickupAtStore: true,
    items: [
      {
        id: 'si-7-1',
        name: 'Cơm tấm sườn xào chua ngọt',
        originalPrice: 120000,
        qty: 1,
        totalPrice: 120000,
        note: 'Thêm mỡ hành'
      },
      {
        id: 'si-7-2',
        name: 'Chả giò tôm thịt (5 cuốn)',
        originalPrice: 90000,
        qty: 1,
        totalPrice: 90000,
        note: 'Chiên giòn nóng'
      }
    ]
  },
  {
    id: 's-8',
    code: 'SPF-2180',
    channel: 'ShopeeFood',
    itemsCount: 3,
    totalPrice: 350000,
    orderTime: '03:45 CH - 18/06/2026',
    status: 'unconfirmed',
    customerPhone: '0903 888 999',
    deliveryAddress: '56 Nguyễn Đình Chiểu, Đa Kao, Quận 1, TP. HCM',
    driverName: 'Bùi Anh Tuấn (ShopeeFood)',
    driverPhone: '0918 444 999',
    note: 'Đóng gói cẩn thận giúp shop.',
    subtotalDiscounted: 320000,
    billDiscount: 15000,
    deliveryFee: 25000,
    platformFee: 5000,
    driverTip: 15000,
    items: [
      {
        id: 'si-8-1',
        name: 'Bún bò Huế đặc biệt chả giò',
        originalPrice: 150000,
        qty: 1,
        totalPrice: 150000,
        note: 'Cay vừa'
      },
      {
        id: 'si-8-2',
        name: 'Gỏi cuốn tôm thịt (4 cuốn)',
        originalPrice: 100000,
        qty: 1,
        totalPrice: 100000,
        note: 'Mắm nêm vừa ăn'
      },
      {
        id: 'si-8-3',
        name: 'Nước dừa tươi nguyên trái',
        originalPrice: 100000,
        qty: 1,
        totalPrice: 100000,
        note: 'Ướp lạnh sẵn'
      }
    ]
  }
];

export const OTHER_DROPDOWN_ITEMS = [
  { id: '5f-order', text: 'Đặt giao hàng từ 5Food', badge: null, active: false },
  { id: 'web-order', text: 'Đặt giao hàng trên Web', badge: null, active: false },
  // Grab and ShopeeFood are handled separately as dynamic links
  { id: '5f-invite', text: 'Mời khách hàng sử dụng 5Food', badge: null, img: null },
  { id: '5f-reserve', text: 'Đặt chỗ từ 5Food', badge: 0 },
  { id: 'sync-cust', text: 'Khách hàng chưa đồng bộ', badge: 0 },
  { id: 'sync-bill', text: 'Hóa đơn chưa đồng bộ', badge: 0 }
];
