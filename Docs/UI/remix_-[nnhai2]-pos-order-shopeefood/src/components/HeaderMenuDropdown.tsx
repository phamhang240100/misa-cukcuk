import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronRight,
  Printer,
  X,
  FileText
} from 'lucide-react';

interface HeaderMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateView?: (view: any) => void;
}

// Custom crisp MISA CUKCUK icons matching the exact dropdown image
const IconOrderList: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 17H8" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M10 9H8" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M15 11L18 8" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconInvoiceList: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="17" rx="2" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M3 8H21" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M8 2V5" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 2V5" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 13L11 15L15 11" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconReservationBook: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5V4.5C4 3.67 4.67 3 5.5 3H18.5C19.33 3 20 3.67 20 4.5V19.5" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M4 19.5C4 20.33 4.67 21 5.5 21H20" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 7H16" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11H16" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M10 15L11.5 16.5L14.5 13.5" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconDeliveryBook: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="14" height="11" rx="1.5" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M16 8H19L22 11V16H16V8Z" stroke="#0973B9" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="6" cy="18" r="2" stroke="#0973B9" strokeWidth="1.8"/>
    <circle cx="18" cy="18" r="2" stroke="#0973B9" strokeWidth="1.8"/>
  </svg>
);

const IconDebtCollect: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 17C2 17 5 15 9 15C13 15 15 17 22 14" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M2 17L5 21H18L22 17" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="3" stroke="#0973B9" strokeWidth="1.8"/>
    <circle cx="6" cy="10" r="2" stroke="#0973B9" strokeWidth="1.5"/>
  </svg>
);

const IconCashDisbursement: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#0973B9" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="3" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M7 9H7.01" stroke="#0973B9" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 15H17.01" stroke="#0973B9" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconSummaryReport: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 20V10" stroke="#0973B9" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 20V4" stroke="#0973B9" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 20V14" stroke="#0973B9" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconEditCancelInvoice: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="17" rx="2" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M3 8H21" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M8 2V5" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 2V5" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M10 12L14 16" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M14 12L10 16" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconSupplementInvoice: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="17" rx="2" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M3 8H21" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M8 2V5" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 2V5" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 11V17" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 14H15" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconAccessLog: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="3.5" stroke="#0973B9" strokeWidth="1.5"/>
    <path d="M12 12.5V14H13.5" stroke="#0973B9" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconKitchenHistory: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 18H18C18 14 15 12 12 12C9 12 6 14 6 18Z" stroke="#0973B9" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M12 12C14.2 12 16 10.2 16 8C16 6.8 15.2 5.8 14.2 5.3C13.5 3.9 12 3 10.3 3.3C8.8 3.5 7.6 4.7 7.4 6.2C6.1 6.8 5.3 8.1 5.6 9.6C5.9 11 7.2 12 8.7 12H12Z" stroke="#0973B9" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M18 19.5C18 20.3 17.3 21 16.5 21H7.5C6.7 21 6 20.3 6 19.5V18H18V19.5Z" stroke="#0973B9" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

const IconMenuFood: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M8 7H16" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11H16" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 15H13" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M15 15L16.5 16.5L19 14" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconMenuGroup: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M8 7H16" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 12H16" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 17H16" stroke="#0973B9" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconSettings: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0973B9]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#0973B9" strokeWidth="1.8"/>
    <path d="M19.4 15A1.65 1.65 0 0 0 20 16.2L20.1 16.3A2 2 0 0 1 20.1 19.1L20 19.2A2 2 0 0 1 17.2 19.2L17.1 19.1A1.65 1.65 0 0 0 15.9 18.5A1.65 1.65 0 0 0 14.7 19.4L14.6 19.5A2 2 0 0 1 11.8 19.5L11.7 19.4A1.65 1.65 0 0 0 10.5 18.5A1.65 1.65 0 0 0 9.3 19.1L9.2 19.2A2 2 0 0 1 6.4 19.2L6.3 19.1A2 2 0 0 1 6.3 16.3L6.4 16.2A1.65 1.65 0 0 0 7 15A1.65 1.65 0 0 0 6.1 13.8L6 13.7A2 2 0 0 1 6 10.9L6.1 10.8A2 2 0 0 1 8.9 10.8L9 10.9A1.65 1.65 0 0 0 10.2 11.5A1.65 1.65 0 0 0 11.4 10.6L11.5 10.5A2 2 0 0 1 14.3 10.5L14.4 10.6A1.65 1.65 0 0 0 15.6 11.5A1.65 1.65 0 0 0 16.8 10.9L16.9 10.8A2 2 0 0 1 19.7 10.8L19.8 10.9A2 2 0 0 1 19.8 13.7L19.7 13.8A1.65 1.65 0 0 0 19.4 15Z" stroke="#0973B9" strokeWidth="1.8"/>
  </svg>
);

export const HeaderMenuDropdown: React.FC<HeaderMenuDropdownProps> = ({
  isOpen,
  onClose,
  onNavigateView
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !showKitchenModal && !showDeliveryModal) return null;

  const handleItemClick = (action?: string) => {
    if (action === 'main') {
      onNavigateView?.('main');
    } else if (action === 'grab') {
      onNavigateView?.('grab');
    } else if (action === 'shopee') {
      onNavigateView?.('shopeefood');
    } else if (action === 'deliveryBook') {
      onNavigateView?.('deliveryBook');
    }
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          ref={containerRef}
          className="absolute left-0 top-full mt-0.5 z-[200] w-[260px] sm:w-[270px] bg-white text-gray-800 shadow-2xl border border-gray-300 py-1 font-sans text-xs sm:text-[13px] rounded-none select-none animate-in fade-in duration-100"
          style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)' }}
        >
          {/* 1. Danh sách order */}
          <div 
            onClick={() => handleItemClick('main')} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconOrderList className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Danh sách order</span>
          </div>

          {/* 2. Danh sách hóa đơn */}
          <div 
            onClick={() => handleItemClick('main')} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconInvoiceList className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Danh sách hóa đơn</span>
          </div>

          {/* 3. Sổ đặt chỗ */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconReservationBook className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Sổ đặt chỗ</span>
          </div>

          {/* 4. Sổ giao hàng */}
          <div 
            onClick={() => handleItemClick('deliveryBook')} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconDeliveryBook className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Sổ giao hàng</span>
          </div>

          {/* 5. Thu nợ */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconDebtCollect className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Thu nợ</span>
          </div>

          {/* 6. Chi tiền mặt */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconCashDisbursement className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Chi tiền mặt</span>
          </div>

          {/* 7. Báo cáo tổng hợp */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center justify-between cursor-pointer text-gray-800 transition-colors border-b border-gray-200"
          >
            <div className="flex items-center gap-3">
              <IconSummaryReport className="w-5 h-5 text-[#0973B9] shrink-0" />
              <span className="font-normal text-gray-800">Báo cáo tổng hợp</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-800" />
          </div>

          {/* 8. Sửa/Hủy hóa đơn */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconEditCancelInvoice className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Sửa/Hủy hóa đơn</span>
          </div>

          {/* 9. Danh sách nhập bù hóa đơn */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconSupplementInvoice className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Danh sách nhập bù hóa đơn</span>
          </div>

          {/* 10. Nhật ký truy cập */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors border-b border-gray-200"
          >
            <IconAccessLog className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Nhật ký truy cập</span>
          </div>

          {/* 11. Lịch sử gửi bếp/bar */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconKitchenHistory className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Lịch sử gửi bếp/bar</span>
          </div>

          {/* 12. Thực đơn */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <IconMenuFood className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Thực đơn</span>
          </div>

          {/* 13. Nhóm thực đơn */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors border-b border-gray-200"
          >
            <IconMenuGroup className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Nhóm thực đơn</span>
          </div>

          {/* 14. Thiết lập */}
          <div 
            onClick={() => handleItemClick()} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors border-b border-gray-200"
          >
            <IconSettings className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Thiết lập</span>
          </div>

          {/* 15. Xem phiếu in chế biến */}
          <div 
            onClick={() => {
              setShowKitchenModal(true);
              onClose();
            }} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors"
          >
            <Printer className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Xem phiếu in chế biến</span>
          </div>

          {/* 16. Phiếu Giao hàng */}
          <div 
            onClick={() => {
              setShowDeliveryModal(true);
              onClose();
            }} 
            className="px-3.5 py-2.5 hover:bg-[#EBF5FB] flex items-center gap-3 cursor-pointer text-gray-800 transition-colors border-t border-gray-100"
          >
            <FileText className="w-5 h-5 text-[#0973B9] shrink-0" />
            <span className="font-normal text-gray-800">Phiếu Giao hàng</span>
          </div>
        </div>
      )}

      {/* KITCHEN PRINT RECEIPT MODAL */}
      {showKitchenModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200 font-sans text-left text-gray-900">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-[#0973B9] text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Printer className="w-4.5 h-4.5" />
                <span>Phiếu in bếp chế biến</span>
              </div>
              <button 
                onClick={() => setShowKitchenModal(false)}
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
                    Mã GrabFood: GF-2000
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    2026-07-27 16:25:00
                  </div>
                </div>

                <div className="border-b border-dashed border-gray-400 my-2"></div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="space-y-1 pb-1.5 border-b border-dashed border-gray-300">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-extrabold text-sm text-black flex-1">
                        1. Dê tái chanh
                      </span>
                      <span className="font-extrabold text-sm text-black shrink-0">
                        x1
                      </span>
                    </div>
                    <div className="text-[12px] text-blue-600 italic pl-3">
                      ** Ít hành, thêm bóp vắt chanh
                    </div>
                  </div>

                  <div className="space-y-1 pb-1.5 border-b border-dashed border-gray-300">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-extrabold text-sm text-black flex-1">
                        2. Dê hấp sả
                      </span>
                      <span className="font-extrabold text-sm text-black shrink-0">
                        x2
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 pb-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-extrabold text-sm text-black flex-1">
                        3. Lẩu dê tươi (Size L)
                      </span>
                      <span className="font-extrabold text-sm text-black shrink-0">
                        x1
                      </span>
                    </div>
                    <div className="text-[12px] text-blue-600 italic pl-3">
                      ** Lẩu cay vừa, thêm rau muống
                    </div>
                  </div>
                </div>

                <div className="border-b border-dashed border-gray-400 my-2"></div>

                {/* Customer Note */}
                <div className="space-y-1.5">
                  <div className="font-bold text-xs text-red-600">
                    Ghi chú từ khách:
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs text-gray-900 italic font-medium leading-relaxed border border-red-100">
                    Giao trước 17h00. Vui lòng cho thêm đũa thìa dùng 1 lần.
                  </div>
                </div>

                <div className="border-b border-dashed border-gray-400 my-2"></div>

                {/* Footer Mark */}
                <div className="text-center text-xs text-gray-500 italic">
                  * Đơn hàng trực tuyến từ GrabFood *
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowKitchenModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold text-xs hover:bg-gray-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowKitchenModal(false)}
                className="px-6 py-2 bg-[#0973B9] text-white rounded-lg font-bold text-xs hover:bg-[#00497D] transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY PRINT RECEIPT MODAL */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200 font-sans text-left text-gray-900">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-[#0973B9] text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Printer className="w-4.5 h-4.5" />
                <span>Phiếu in giao hàng</span>
              </div>
              <button 
                onClick={() => setShowDeliveryModal(false)}
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
                    GRABFOOD
                  </div>
                  <div className="pt-1 flex flex-col items-center justify-center">
                    <span className="font-black text-2xl text-black tracking-tight leading-none">GF-2000</span>
                  </div>
                </div>

                <div className="border-b border-dashed border-black/80 my-2"></div>

                {/* Order Details */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold">Thời gian in:</span>
                    <span className="font-mono">16:25:00 27/07/2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Khách hàng:</span>
                    <span className="font-bold">Chị Nhàn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Điện thoại:</span>
                    <span className="font-mono">0987 456 221</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold shrink-0">Địa chỉ giao:</span>
                    <span className="font-medium text-right break-words">123 Nguyễn Trãi, Thanh Xuân, Hà Nội</span>
                  </div>
                </div>

                <div className="border-b border-dashed border-black/80 my-2"></div>

                {/* Banner Header */}
                <div className="bg-gray-100 py-1.5 px-2 text-center font-extrabold text-xs uppercase tracking-wider border border-gray-300 text-black">
                  DANH SÁCH MÓN GIAO HÀNG
                </div>

                {/* Items List */}
                <div className="pt-1 space-y-2">
                  <div className="flex justify-between font-extrabold text-xs pb-1 border-b border-dashed border-black/80 text-black">
                    <span>Tên món dịch vụ</span>
                    <span>Thành tiền</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-black">1. Dê tái chanh</div>
                        <div className="text-[11px] text-gray-600">1 x 185.000</div>
                      </div>
                      <span className="font-bold font-mono">185.000</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-black">2. Dê hấp sả</div>
                        <div className="text-[11px] text-gray-600">2 x 210.000</div>
                      </div>
                      <span className="font-bold font-mono">420.000</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-black">3. Lẩu dê tươi (Size L)</div>
                        <div className="text-[11px] text-gray-600">1 x 350.000</div>
                      </div>
                      <span className="font-bold font-mono">350.000</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-dashed border-black/80 my-2"></div>

                {/* Totals */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>TỔNG TIỀN MÓN:</span>
                    <span className="font-mono">955.000đ</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-black pt-1">
                    <span>THÀNH TIỀN:</span>
                    <span className="font-mono text-base">955.000đ</span>
                  </div>
                </div>

                <div className="border-b border-dashed border-black/80 my-2"></div>

                <div className="text-center text-xs text-gray-600 italic">
                  Cảm ơn quý khách và hẹn gặp lại!
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold text-xs hover:bg-gray-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="px-6 py-2 bg-[#0973B9] text-white rounded-lg font-bold text-xs hover:bg-[#00497D] transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
