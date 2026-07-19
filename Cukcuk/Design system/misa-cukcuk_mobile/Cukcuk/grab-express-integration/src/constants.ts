import type {CukcukStatus, GrabExpressStatus} from './types';

// 5 tỉnh/TP Grab Express hỗ trợ giao hàng
export const SUPPORTED_PROVINCES = [
  'TP. Hồ Chí Minh',
  'TP. Hà Nội',
  'Đà Nẵng',
  'Quảng Ninh',
  'Cần Thơ',
];

export const ALL_PROVINCES = [
  'TP. Hồ Chí Minh',
  'TP. Hà Nội',
  'Đà Nẵng',
  'Quảng Ninh',
  'Cần Thơ',
  'Hải Phòng',
  'Bình Dương',
  'Đồng Nai',
  'Khánh Hòa',
  'Lâm Đồng',
];

export const isSupportedProvince = (p?: string) =>
  !!p && SUPPORTED_PROVINCES.includes(p.trim());

// Quận/Huyện theo Tỉnh/TP (mock)
export const DISTRICTS: Record<string, string[]> = {
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 5', 'Quận Bình Thạnh', 'Quận Phú Nhuận', 'TP. Thủ Đức'],
  'TP. Hà Nội': ['Quận Hoàn Kiếm', 'Quận Hai Bà Trưng', 'Quận Đống Đa', 'Quận Ba Đình', 'Quận Cầu Giấy', 'Quận Thanh Xuân'],
  'Đà Nẵng': ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu'],
  'Quảng Ninh': ['TP. Hạ Long', 'TP. Cẩm Phả', 'TP. Uông Bí', 'TP. Móng Cái', 'Thị xã Quảng Yên'],
  'Cần Thơ': ['Quận Ninh Kiều', 'Quận Bình Thủy', 'Quận Cái Răng', 'Quận Ô Môn', 'Quận Thốt Nốt'],
};

export const districtsOf = (province?: string): string[] =>
  (province && DISTRICTS[province]) || ['Quận/Huyện 1', 'Quận/Huyện 2', 'Quận/Huyện 3'];

// Phường/Xã (mock dùng chung)
export const WARDS = [
  'Phường 1', 'Phường 2', 'Phường 3', 'Phường Bến Nghé', 'Phường Nguyễn Du',
  'Phường Phạm Đình Hổ', 'Phường Dịch Vọng', 'Phường Bạch Đằng',
];

// Ngưỡng COD Grab Express hỗ trợ
export const MAX_COD = 2_000_000;

export const SERVICE_TYPE_DEFAULT = 'Siêu tốc - Thực phẩm';

export const VAT_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdp_Aily2qPABKzsjN_dOwv0AsuzYWCamwCnU8z_WxsQqj9n/viewform';

// ---- Message chuẩn (trích nguyên văn từ mindmap) ----
export const MSG = {
  provinceUnsupported:
    'Grab Express chỉ hỗ trợ giao hàng khu vực TP Hà Nội, TP Hồ Chí Minh, Đà Nẵng, Quảng Ninh, Cần Thơ.',
  provinceUnsupportedPickOther:
    'Grab Express chỉ hỗ trợ giao hàng khu vực TP Hà Nội, TP Hồ Chí Minh, Đà Nẵng, Quảng Ninh, Cần Thơ. Vui lòng lựa chọn đối tác giao hàng khác.',
  emptyField: 'Trường này không được để trống.',
  emailInvalid: 'Email chưa đúng định dạng, vui lòng kiểm tra lại.',
  codOverLimit:
    'GrabExpress chỉ hỗ trợ Thu hộ (COD) tối đa 2.000.000 VNĐ. Vui lòng chọn đối tác giao hàng khác.',
  connectFailed:
    'Chương trình không kết nối được với đối tác giao hàng Grab Express. Vui lòng kiểm tra lại kết nối hoặc chọn Đối tác giao hàng khác.',
  unlinkClean:
    'Bạn có chắc chắn muốn hủy kết nối với đối tác giao hàng Grab Express không?',
  unlinkInProgress:
    'Đối tác giao hàng Grab Express đang có hóa đơn trong quá trình giao vận. Nếu hủy kết nối bạn không thể tiếp tục nhận trạng thái đơn hàng từ đối tác. Bạn có chắc chắn muốn hủy kết nối với đối tác giao hàng Grab Express không?',
  feeHint:
    'Phí giao hàng được lấy theo đơn vị vận chuyển GrabExpress. Vui lòng liên hệ trực tiếp với đơn vị GrabExpress nếu nhận thấy có sai lệch.',
};

// ---- Nhãn trạng thái CukCuk ----
export const CUKCUK_STATUS: Record<
  CukcukStatus,
  {label: string; color: string; bg: string}
> = {
  cho_gui_doi_tac: {label: 'Chờ gửi đối tác', color: '#B54708', bg: '#FEF0C7'},
  cho_giao_hang: {label: 'Chờ giao hàng', color: '#B54708', bg: '#FEF0C7'},
  dang_giao_hang: {label: 'Đang giao hàng', color: '#175CD3', bg: '#EFF8FF'},
  da_thanh_toan: {label: 'Đã thanh toán', color: '#067647', bg: '#ECFDF3'},
};

// ---- Nhãn trạng thái Grab Express (đúng mô tả mindmap) ----
export const GE_STATUS: Record<
  GrabExpressStatus,
  {label: string; desc: string; tone: 'progress' | 'success' | 'danger' | 'return'}
> = {
  ALLOCATING: {label: 'Đang tìm tài xế', desc: 'Đang tìm tài xế', tone: 'progress'},
  PENDING_PICKUP: {
    label: 'Đã tìm được tài xế',
    desc: 'Đơn hàng đã tìm được tài xế',
    tone: 'progress',
  },
  PICKING_UP: {
    label: 'Tài xế đang tới lấy',
    desc: 'Đơn hàng đã tìm được tài xế',
    tone: 'progress',
  },
  PENDING_DROP_OFF: {
    label: 'Đã lấy hàng',
    desc: 'Lấy hàng thành công và bắt đầu giao hàng',
    tone: 'progress',
  },
  IN_DELIVERY: {label: 'Đang giao', desc: 'Đơn hàng đang được giao', tone: 'progress'},
  COMPLETED: {
    label: 'Giao thành công',
    desc: 'Đơn hàng được giao thành công',
    tone: 'success',
  },
  IN_RETURN: {
    label: 'Đang hoàn hàng',
    desc: 'Giao không thành công và đang hoàn hàng',
    tone: 'return',
  },
  RETURNED: {label: 'Đã trả hàng', desc: 'Trả hàng', tone: 'return'},
  CANCELLED: {
    label: 'Đã hủy',
    desc: 'Đơn hàng bị hủy bởi Tài xế hoặc Người Gửi',
    tone: 'danger',
  },
  FAILED: {label: 'Không tìm được tài xế', desc: 'Không tìm được Tài xế', tone: 'danger'},
};

// Vòng đời demo để "chạy" trạng thái GE
export const GE_LIFECYCLE: GrabExpressStatus[] = [
  'ALLOCATING',
  'PENDING_PICKUP',
  'PICKING_UP',
  'PENDING_DROP_OFF',
  'IN_DELIVERY',
  'COMPLETED',
];

// GE status coi như "đã kết thúc giao vận" -> cho phép hủy kết nối
export const GE_TERMINAL: GrabExpressStatus[] = ['COMPLETED', 'RETURNED'];

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat('vi-VN').format(Math.round(n)) + 'đ';

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
