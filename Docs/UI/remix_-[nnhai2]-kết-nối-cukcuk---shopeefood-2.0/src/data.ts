import { Application, Invoice, MenuItem, SidebarMenuItem } from './types';

export const APPLICATIONS_DATA: Application[] = [
  {
    id: 'hd-dt',
    title: 'Hóa đơn điện tử',
    description: 'Kết nối phần mềm Hóa đơn điện tử MISA meInvoice và các nhà cung cấp khác từ đó có thể phát hành và gửi hóa đơn điện tử cho khách hàng ngay trên CukCuk.',
    iconType: 'wave',
    isConnected: true,
    category: 'Hóa đơn & Kế toán',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=af2ea7df-ffd8-4441-89ab-3a0e6635b35c.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
  },
  {
    id: 'amis-kt',
    title: 'MISA AMIS – Kế toán',
    description: 'Kết nối ngay CUKCUK với phần mềm AMIS.VN – Kế toán để giảm thiểu công sức nhập liệu khi chuyển đổi dữ liệu bán hàng, kho, thu chi cho kế toán và chủ nhà hàng.',
    iconType: 'color-circle',
    isConnected: false,
    category: 'Hóa đơn & Kế toán',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=ecb57dae-b2b3-4527-986e-cb0b4f6da00b.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
  },
  {
    id: 'grab',
    title: 'Grab',
    description: 'Kết nối ngay Grab trên CUKCUK để chủ động kiểm soát đơn hàng, giờ đóng/mở cửa nhà hàng của bạn. Giúp tiết kiệm thời gian, chi phí bán hàng, và tối ưu lợi nhuận.',
    iconType: 'grab',
    isConnected: false,
    category: 'Vận chuyển',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=71956450-e39c-4bc5-98e9-aea9568acff0.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
  },
  {
    id: 'shopeefood',
    title: 'ShopeeFood',
    description: 'Kết nối ShopeeFood trên CUKCUK để đồng bộ đơn hàng, trạng thái hoạt động và thông tin gian hàng. Giúp doanh nghiệp xử lý đơn nhanh hơn, giảm thao tác thủ công và quản lý bán hàng tập trung hơn.',
    iconType: 'shopeefood',
    isConnected: false,
    category: 'Vận chuyển',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=a1845383-a3df-4382-b09b-1524fa371b2c.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa',
    isNew: true
  },
  {
    id: 'sme-net',
    title: 'MISA SME.NET 2020',
    description: 'Kết nối ngay CUKCUK với phần mềm SME.NET để giảm thiểu công sức nhập liệu khi chuyển đổi dữ liệu bán hàng, kho, thu chi cho kế toán và chủ nhà hàng.',
    iconType: 'sme-circle',
    isConnected: false,
    category: 'Hóa đơn & Kế toán',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=fc98bcaf-2a04-42e3-9613-c57d8b7fd278.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
  },
  {
    id: 'amis-acc',
    title: 'AMIS Accounting',
    description: 'Kết nối ngay CUKCUK với phần mềm AMIS Accounting để giảm thiểu công sức nhập liệu khi chuyển đổi dữ liệu bán hàng, kho, thu chi cho kế toán và chủ nhà hàng.',
    iconType: 'diamond',
    isConnected: true,
    category: 'Hóa đơn & Kế toán',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=4e28b091-9560-4cf6-8e61-77502d3e710a.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
  },
  {
    id: 'sms-mkt',
    title: 'SMS Marketing',
    description: 'Hỗ trợ gửi tin nhắn chăm sóc khách hàng, tin nhắn brand Name từ đó giúp nhà hàng thêm lượng khách hàng mới, gia tăng tỉ lệ khách hàng cũ quay lại.',
    iconType: 'sms',
    isConnected: false,
    category: 'Marketing & Chăm sóc khách hàng',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=7322b128-2e19-48b6-8902-9ebfb49c23b6.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
  },
  {
    id: 'ahamove',
    title: 'AhaMove',
    description: 'Hỗ trợ kết nối đối tác giao hàng AhaMove, giúp giảm thiểu thao tác thủ công và quản lý bằng tay khi giao hàng cho khách hàng.',
    iconType: 'ahamove',
    isConnected: false,
    category: 'Vận chuyển',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=daaa8811-d0c7-42f4-93e0-4a3cefaa4798.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
  },
  {
    id: 'api-portal',
    title: 'API',
    description: 'API CUKCUK Portal helps integrate other systems (website, sale app, etc.) with CUKCUK to manage in one central place.',
    iconType: 'api',
    isConnected: true,
    category: 'Tích hợp',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=b5016dd3-a9e6-4744-a9f1-ff95928a6c63.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
  },
  {
    id: 'hotel-mgt',
    title: 'Phần mềm quản lý khách sạn',
    description: 'Giúp nhà hàng kết nối với phần mềm quản lý khách sạn để quản lý toàn bộ chi tiêu ăn uống của thực khách trong quá trình ở tại khách sạn và thực hiện thanh toán một lần khi trả phòng.',
    iconType: 'hotel',
    isConnected: false,
    category: 'Tích hợp',
    imageUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=b9a2944e-9990-4440-bcf4-dbf1f064ad8c.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
  }
];

export const INVOICES_DATA: Invoice[] = [
  { id: '1', invoiceNumber: 'HD00124', customerName: 'Nguyễn Văn A', date: '2026-06-24', amount: 1250000, status: 'completed', note: 'Thanh toán tiền mặt', itemsCount: 4 },
  { id: '2', invoiceNumber: 'HD00125', customerName: 'Trần Thị B', date: '2026-06-24', amount: 890000, status: 'completed', note: 'Chuyển khoản Vietcombank', itemsCount: 3 },
  { id: '3', invoiceNumber: 'HD00126', customerName: 'Phạm Minh C', date: '2026-06-23', amount: 2450000, status: 'completed', note: 'Ăn tại bàn số 5', itemsCount: 8 },
  { id: '4', invoiceNumber: 'HD00127', customerName: 'Lê Hoàng D', date: '2026-06-23', amount: 320000, status: 'pending', note: 'Khách chưa thanh toán', itemsCount: 2 },
  { id: '5', invoiceNumber: 'HD00128', customerName: 'Vũ Hồng E', date: '2026-06-22', amount: 1540000, status: 'completed', note: 'Tiệc sinh nhật bàn 12', itemsCount: 6 },
  { id: '6', invoiceNumber: 'HD00129', customerName: 'Ngô Quốc F', date: '2026-06-22', amount: 450000, status: 'draft', note: 'Hóa đơn tạm tính', itemsCount: 2 },
  { id: '7', invoiceNumber: 'HD00130', customerName: 'Hoàng Minh G', date: '2026-06-21', amount: 2100000, status: 'cancelled', note: 'Khách hủy món', itemsCount: 5 },
  { id: '8', invoiceNumber: 'HD00131', customerName: 'Phan Văn H', date: '2026-06-21', amount: 1200000, status: 'completed', note: 'Mượn đồ mang về', itemsCount: 4 },
  { id: '9', invoiceNumber: 'HD00132', customerName: 'Lý Kim I', date: '2026-06-20', amount: 780000, status: 'completed', note: 'Giao hàng Grab', itemsCount: 3 },
  { id: '10', invoiceNumber: 'HD00133', customerName: 'Đặng Thanh J', date: '2026-06-20', amount: 5600000, status: 'completed', note: 'Liên hoan công ty', itemsCount: 15 },
  { id: '11', invoiceNumber: 'HD00134', customerName: 'Bùi Gia K', date: '2026-06-19', amount: 620000, status: 'completed', note: 'Thanh toán Momo', itemsCount: 2 },
  { id: '12', invoiceNumber: 'HD00135', customerName: 'Đỗ Chí L', date: '2026-06-19', amount: 1150000, status: 'pending', note: 'Chờ đối soát AhaMove', itemsCount: 4 }
];

export const MENU_ITEMS_DATA: MenuItem[] = [
  { id: 'm1', name: 'Phở bò chín đặc biệt', category: 'Phở', price: 65000, unit: 'Bát', status: 'active' },
  { id: 'm2', name: 'Phở bò tái lăn', category: 'Phở', price: 70000, unit: 'Bát', status: 'active' },
  { id: 'm3', name: 'Phở gà ta đùi cánh', category: 'Phở', price: 60000, unit: 'Bát', status: 'active' },
  { id: 'm4', name: 'Quẩy giòn rụm', category: 'Món ăn kèm', price: 5000, unit: 'Cái', status: 'active' },
  { id: 'm5', name: 'Trứng chần ngải cứu', category: 'Món ăn kèm', price: 10000, unit: 'Chén', status: 'active' },
  { id: 'm6', name: 'Nước cam ép nguyên chất', category: 'Đồ uống', price: 35000, unit: 'Ly', status: 'active' },
  { id: 'm7', name: 'Bột sắn dây hoa bưởi', category: 'Đồ uống', price: 25000, unit: 'Ly', status: 'active' },
  { id: 'm8', name: 'Trà đá Hà Nội', category: 'Đồ uống', price: 5000, unit: 'Cốc', status: 'active' },
  { id: 'm9', name: 'Phở bò sốt vang', category: 'Phở', price: 75000, unit: 'Bát', status: 'inactive' },
  { id: 'm10', name: 'Nước chanh leo hạt chia', category: 'Đồ uống', price: 30000, unit: 'Ly', status: 'active' }
];

export const SIDEBAR_ITEMS: SidebarMenuItem[] = [
  { id: 'tong-quan', title: 'Tổng quan', iconName: 'Compass' },
  { id: 'bao-cao', title: 'Báo cáo', iconName: 'Clock', hasArrow: true },
  { id: 'thuc-don', title: 'Thực đơn', iconName: 'Utensils' },
  { id: 'hd-mua-hang', title: 'Hóa đơn mua hàng', iconName: 'FileText' },
  { id: 'hd-ban-hang', title: 'Hóa đơn bán hàng', iconName: 'FileText' },
  { id: 'mua-hang', title: 'Mua hàng', iconName: 'ShoppingBag' },
  { id: 'kho', title: 'Kho', iconName: 'Home' },
  { id: 'quy-tien', title: 'Quỹ tiền', iconName: 'Wallet', hasArrow: true },
  { 
    id: 'ban-tai-nha-hang', 
    title: 'Bán tại nhà hàng', 
    iconName: 'Store', 
    isBadgeIcon: true, 
    badgeBg: 'bg-[#2563EB]', 
    sectionHeader: 'KÊNH BÁN HÀNG',
    hasPlusButton: true 
  },
  { id: 'qr-order', title: 'QR Order', iconName: 'QrCode', isBadgeIcon: true, badgeBg: 'bg-[#A855F7]' },
  { id: 'website-order', title: 'Website Order', iconName: 'Globe', isBadgeIcon: true, badgeBg: 'bg-[#EA580C]' },
  { 
    id: 'shopee-food', 
    title: 'Shopee Food', 
    iconName: 'ShopeeFood', 
    isBadgeIcon: true, 
    logoUrl: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=a1845383-a3df-4382-b09b-1524fa371b2c.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa' 
  },
  { id: 'zalo-mini-app', title: 'Zalo Mini app', iconName: 'AppWindow', isBadgeIcon: true, badgeBg: 'bg-[#2563EB]' },
  { id: 'food-delivery', title: 'Food Delivery', iconName: 'Bike', isBadgeIcon: true, badgeBg: 'bg-[#16A34A]' },
  { id: 'khuyen-mai', title: 'Khuyến mại', iconName: 'Gift', isDividerBefore: true },
  { id: 'marketing-loyalty', title: 'Marketing & Loyalty', iconName: 'Users' },
  { id: 'danh-muc', title: 'Danh mục', iconName: 'List', hasArrow: true },
  { id: 'ung-dung', title: 'Ứng dụng', iconName: 'LayoutGrid' }
];
