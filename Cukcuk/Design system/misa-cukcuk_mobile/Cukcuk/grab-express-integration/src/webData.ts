// Dữ liệu màn Web quản lý (Ứng dụng) — logo thật từ MISA
const logo = (id: string) =>
  `https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=${id}&isTemp=true&tenantCode=misa`;

export interface WebApp {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  round?: boolean; // logo bo tròn
  isNew?: boolean;
  isConnected?: boolean;
  tint?: string; // fallback gradient
  short?: string; // fallback text
  isGrabExpress?: boolean;
}

export const APPLICATIONS_DATA: WebApp[] = [
  {
    id: 'hd-dt', title: 'Hóa đơn điện tử', category: 'Hóa đơn & Kế toán', isConnected: true,
    imageUrl: logo('b080aa53-fde5-45c1-ade7-bb22bf5a3893.png'), tint: 'from-sky-400 to-blue-600', short: 'HĐ',
    description: 'Kết nối phần mềm Hóa đơn điện tử MISA meInvoice và các nhà cung cấp khác từ đó có thể phát hành và gửi hóa đơn điện tử cho khách hàng ngay trên CukCuk.',
  },
  {
    id: 'amis-kt', title: 'MISA AMIS – Kế toán', category: 'Hóa đơn & Kế toán',
    imageUrl: logo('247e83f6-39f9-4605-b43d-6bb18d04ddc1.png'), tint: 'from-emerald-400 to-teal-600', short: 'KT',
    description: 'Kết nối ngay CUKCUK với phần mềm AMIS.VN – Kế toán để giảm thiểu công sức nhập liệu khi chuyển đổi dữ liệu bán hàng, kho, thu chi cho kế toán và chủ nhà hàng.',
  },
  {
    id: 'grab-express', title: 'Grab Express', category: 'Vận chuyển', isNew: true, round: true, isGrabExpress: true,
    imageUrl: logo('2cd87510-b0c7-4826-9b3e-f2c348b373b2.png'), tint: 'from-green-400 to-green-600', short: 'GE',
    description: 'Hỗ trợ kết nối đối tác giao hàng Grab Express, giúp giảm thiểu thao tác thủ công và quản lý bằng tay khi giao hàng cho khách hàng.',
  },
  {
    id: 'grab-food', title: 'Grab Food', category: 'Vận chuyển', round: true,
    imageUrl: logo('2cd87510-b0c7-4826-9b3e-f2c348b373b2.png'), tint: 'from-green-400 to-green-600', short: 'GF',
    description: 'Kết nối ngay Grab Food trên CUKCUK để chủ động kiểm soát đơn hàng, giờ đóng/mở cửa nhà hàng của bạn. Giúp tiết kiệm thời gian, chi phí bán hàng và tối ưu lợi nhuận.',
  },
  {
    id: 'shopeefood', title: 'ShopeeFood', category: 'Vận chuyển', isNew: true, round: true,
    imageUrl: logo('3e1ccfdd-602d-48c1-b5e8-6b06aac153b2.png'), tint: 'from-orange-400 to-red-500', short: 'SF',
    description: 'Kết nối ShopeeFood trên CUKCUK để đồng bộ đơn hàng, trạng thái hoạt động và thông tin gian hàng. Giúp doanh nghiệp xử lý đơn nhanh hơn, giảm thao tác thủ công và quản lý bán hàng tập trung hơn.',
  },
  {
    id: 'sme-net', title: 'MISA SME.NET 2020', category: 'Hóa đơn & Kế toán', round: true,
    imageUrl: logo('6250b77c-058f-47f6-a6c9-f459c449439c.png'), tint: 'from-blue-400 to-indigo-600', short: 'SME',
    description: 'Kết nối ngay CUKCUK với phần mềm SME.NET để giảm thiểu công sức nhập liệu khi chuyển đổi dữ liệu bán hàng, kho, thu chi cho kế toán và chủ nhà hàng.',
  },
  {
    id: 'amis-acc', title: 'AMIS Accounting', category: 'Hóa đơn & Kế toán', isConnected: true,
    imageUrl: logo('c450d4d9-2294-45aa-b592-8f3b1569ff60.png'), tint: 'from-red-400 to-rose-600', short: 'AC',
    description: 'Kết nối ngay CUKCUK với phần mềm AMIS Accounting để giảm thiểu công sức nhập liệu khi chuyển đổi dữ liệu bán hàng, kho, thu chi cho kế toán và chủ nhà hàng.',
  },
  {
    id: 'sms-mkt', title: 'SMS Marketing', category: 'Marketing & CSKH',
    imageUrl: logo('9c02274a-1772-4bc4-b506-e7d2dc3f414d.png'), tint: 'from-violet-400 to-purple-600', short: 'SMS',
    description: 'Hỗ trợ gửi tin nhắn chăm sóc khách hàng, tin nhắn brand Name từ đó giúp nhà hàng thêm lượng khách hàng mới, gia tăng tỉ lệ khách hàng cũ quay lại.',
  },
  {
    id: 'ahamove', title: 'AhaMove', category: 'Vận chuyển', round: true,
    imageUrl: logo('06e226e1-8f2a-4a6e-a329-7ec90a05f3ad.png'), tint: 'from-yellow-400 to-amber-600', short: 'AHA',
    description: 'Hỗ trợ kết nối đối tác giao hàng AhaMove, giúp giảm thiểu thao tác thủ công và quản lý bằng tay khi giao hàng cho khách hàng.',
  },
];

export const SIDEBAR_ITEMS: {id: string; title: string; icon: string; arrow?: boolean}[] = [
  {id: 'ban-lam-viec', title: 'Bàn làm việc', icon: 'LayoutDashboard'},
  {id: 'bao-cao', title: 'Báo cáo', icon: 'BarChart3', arrow: true},
  {id: 'hd-mua-hang', title: 'Hóa đơn mua hàng', icon: 'FileDown'},
  {id: 'hd-ban-hang', title: 'Hóa đơn bán hàng', icon: 'FileUp'},
  {id: 'mua-hang', title: 'Mua hàng', icon: 'ShoppingCart'},
  {id: 'kho', title: 'Kho', icon: 'Package'},
  {id: 'quy-tien-mat', title: 'Quỹ tiền mặt', icon: 'Wallet'},
  {id: 'quy-tien-gui', title: 'Quỹ tiền gửi', icon: 'CreditCard'},
  {id: 'chi-phi', title: 'Chi phí', icon: 'PiggyBank'},
  {id: 'khuyen-mai', title: 'Khuyến mại', icon: 'Percent'},
  {id: 'thuc-don', title: 'Thực đơn', icon: 'UtensilsCrossed'},
  {id: 'danh-muc', title: 'Danh mục', icon: 'Grid3x3'},
  {id: 'ket-noi-vay-von', title: 'Kết nối vay vốn', icon: 'TrendingUp'},
  {id: 'huy-hoa-don', title: 'Hủy hóa đơn', icon: 'FileX'},
  {id: 'ke-khai-thue', title: 'Kê khai thuế HKD', icon: 'FileText'},
  {id: 'ung-dung', title: 'Ứng dụng', icon: 'LayoutGrid'},
];
