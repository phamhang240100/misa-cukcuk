import React, { useState } from "react";
import { motion } from "motion/react";
import { HelpCircle, X, ChevronDown, ChevronUp, Clock } from "lucide-react";

interface OpenShiftProps {
  onBackToPrinter: () => void;
  onConfirmOpenShift: (shiftData: {
    shiftName: string;
    startTime: string;
    endTime: string;
    initialFund: string;
    handoverPerson?: string;
    invoiceCount?: number;
    cardStubCount?: number;
    voucherStubCount?: number;
  }) => void;
  setToast: (val: { message: string; type: "success" | "error" | "info" } | null) => void;
}

export const OpenShift: React.FC<OpenShiftProps> = ({
  onBackToPrinter,
  onConfirmOpenShift,
  setToast,
}) => {
  // Main form states
  const [shiftName, setShiftName] = useState<"Sáng" | "Tối">("Sáng");
  const [initialFund, setInitialFund] = useState("0,00");
  const [isExpanded, setIsExpanded] = useState(false);

  // Expanded section states
  const [handoverPerson, setHandoverPerson] = useState("Mai Ngọc Sơn");
  const [invoiceCount, setInvoiceCount] = useState<number>(0);
  const [cardStubCount, setCardStubCount] = useState<number>(0);
  const [voucherStubCount, setVoucherStubCount] = useState<number>(0);

  // Const times for each shift
  const startTime = shiftName === "Sáng" ? "07:00" : "18:00";
  const endTime = shiftName === "Sáng" ? "15:00" : "24:00";

  const handleOpenShift = () => {
    onConfirmOpenShift({
      shiftName,
      startTime,
      endTime,
      initialFund,
      handoverPerson: isExpanded ? handoverPerson : undefined,
      invoiceCount: isExpanded ? invoiceCount : undefined,
      cardStubCount: isExpanded ? cardStubCount : undefined,
      voucherStubCount: isExpanded ? voucherStubCount : undefined,
    });
    setToast({
      message: `Mở ca làm việc [Ca ${shiftName}: ${startTime} - ${endTime}] thành công!`,
      type: "success",
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col justify-between overflow-hidden select-none">
      {/* 1. BACKGROUND CONTENT - SHIFT REVENUE SUMMARY SHEET (Matching image exactly) */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-5 flex flex-col gap-4 overflow-y-auto pb-6 relative">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between mt-1 select-none">
          <div className="flex-1 text-center font-semibold text-gray-700 text-[15px] pl-44">
            Giờ vào ca
          </div>
          <button
            onClick={() => setToast({ message: "Chức năng Xem doanh thu theo mặt hàng", type: "info" })}
            className="bg-[#005a96] hover:bg-[#004a7a] text-white px-5 py-2 rounded-sm text-[14px] font-bold shadow-sm transition-all cursor-pointer shrink-0"
          >
            Xem doanh thu theo mặt hàng
          </button>
        </div>

        {/* Main Grid: TỔNG HỢP & CHI TIẾT DOANH THU */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 items-stretch">
          
          {/* COLUMN 1: TỔNG HỢP (Col-span 4) */}
          <div className="md:col-span-4 bg-[#eaeaea] rounded-sm flex flex-col overflow-hidden p-5 text-[15px]">
            {/* Centered header label */}
            <div className="text-center font-bold text-gray-800 text-[13px] uppercase tracking-wider mb-5">
              TỔNG HỢP
            </div>
            
            <div className="space-y-4">
              {/* TỔNG TIỀN */}
              <div className="flex justify-between items-center font-bold text-gray-900 pb-1 border-b border-gray-300/40">
                <span>TỔNG TIỀN</span>
                <span className="text-gray-950 font-bold text-[16px]">0,00</span>
              </div>

              {/* Sub items under TỔNG TIỀN */}
              <div className="space-y-3.5 pl-3">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tiền mặt</span>
                  <span className="text-[#006cb2] font-medium">0,00</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Thẻ/Ví điện tử</span>
                  <span className="text-[#006cb2] font-medium">0,00</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Chuyển khoản</span>
                  <span className="text-[#006cb2] font-medium">0,00</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Voucher</span>
                  <span className="text-[#006cb2] font-medium">0,00</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Điểm</span>
                  <span className="text-[#006cb2] font-medium">0,00</span>
                </div>
              </div>

              {/* KHUYẾN MẠI */}
              <div className="flex justify-between items-center font-bold text-gray-800 pt-3 border-t border-gray-300/30">
                <span>KHUYẾN MẠI</span>
                <span className="text-[#006cb2] font-medium">0,00</span>
              </div>

              {/* THUẾ GTGT */}
              <div className="flex justify-between items-center font-bold text-gray-800">
                <span>THUẾ GTGT</span>
                <span className="text-gray-900 font-medium">0,00</span>
              </div>

              {/* PHÍ DỊCH VỤ */}
              <div className="flex justify-between items-center font-bold text-gray-800">
                <span>PHÍ DỊCH VỤ</span>
                <span className="text-gray-900 font-medium">0,00</span>
              </div>

              {/* THUẾ TTĐB */}
              <div className="flex justify-between items-center font-bold text-gray-800">
                <span>THUẾ TTĐB</span>
                <span className="text-gray-900 font-medium">0,00</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: CHI TIẾT DOANH THU (Col-span 8) */}
          <div className="md:col-span-8 flex flex-col gap-4">
            {/* Header grey banner block precisely as pictured */}
            <div className="bg-[#eaeaea] py-2.5 text-center font-bold text-[13px] text-gray-800 uppercase tracking-wider rounded-sm">
              CHI TIẾT DOANH THU
            </div>

            {/* Grid of four fieldsets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              
              {/* 1. BÁN HÀNG */}
              <fieldset className="border border-gray-200 rounded-sm p-5 pt-3.5 relative bg-white">
                <legend className="px-3.5 text-[13px] font-bold text-[#006cb2] uppercase bg-white mx-auto select-none">
                  BÁN HÀNG
                </legend>
                <div className="space-y-3 text-[15px]">
                  <div className="flex justify-between font-bold text-gray-800 pb-1 border-b border-gray-100">
                    <span>Tổng doanh thu</span>
                    <span className="text-[#006cb2] font-medium">0,00</span>
                  </div>
                  <div className="space-y-2.5 pl-3 text-gray-600">
                    <div className="flex justify-between">
                      <span>Tiền mặt</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thẻ/Ví điện tử</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chuyển khoản</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voucher</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Điểm</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ghi nợ</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* 2. THU NỢ */}
              <fieldset className="border border-gray-200 rounded-sm p-5 pt-3.5 relative bg-white">
                <legend className="px-3.5 text-[13px] font-bold text-[#006cb2] uppercase bg-white mx-auto select-none">
                  THU NỢ
                </legend>
                <div className="space-y-3 text-[15px]">
                  <div className="flex justify-between font-bold text-gray-800 pb-1 border-b border-gray-100">
                    <span>Thu nợ</span>
                    <span className="text-[#006cb2] font-medium">0,00</span>
                  </div>
                  <div className="space-y-2.5 pl-3 text-gray-600">
                    <div className="flex justify-between">
                      <span>Tiền mặt</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thẻ/Ví điện tử</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chuyển khoản</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* 3. ĐẶT CỌC */}
              <fieldset className="border border-gray-200 rounded-sm p-5 pt-3.5 relative bg-white">
                <legend className="px-3.5 text-[13px] font-bold text-[#006cb2] uppercase bg-white mx-auto select-none">
                  ĐẶT CỌC
                </legend>
                <div className="space-y-3 text-[15px]">
                  <div className="flex justify-between font-bold text-gray-800 pb-1">
                    <span>Đặt cọc</span>
                    <span className="text-[#006cb2] font-medium">0,00</span>
                  </div>
                  <div className="space-y-2.5 pl-3 text-gray-600">
                    <div className="flex justify-between">
                      <span>Tiền mặt</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thẻ/Ví điện tử</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chuyển khoản</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100 pb-1">
                    <span>Trả lại đặt cọc</span>
                    <span className="text-[#006cb2] font-medium">0,00</span>
                  </div>
                  <div className="space-y-2.5 pl-3 text-gray-600">
                    <div className="flex justify-between">
                      <span>Tiền mặt</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chuyển khoản</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* 4. NẠP TIỀN TRẢ TRƯỚC */}
              <fieldset className="border border-gray-200 rounded-sm p-5 pt-3.5 relative bg-white">
                <legend className="px-3.5 text-[13px] font-bold text-[#006cb2] uppercase bg-white mx-auto select-none">
                  NẠP TIỀN TRẢ TRƯỚC
                </legend>
                <div className="space-y-3 text-[15px]">
                  <div className="flex justify-between font-bold text-gray-800 pb-1 border-b border-gray-100">
                    <span>Nạp tiền trả trước</span>
                    <span className="text-[#006cb2] font-medium">0,00</span>
                  </div>
                  <div className="space-y-2.5 pl-3 text-gray-600">
                    <div className="flex justify-between">
                      <span>Tiền mặt</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thẻ/Ví điện tử</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chuyển khoản</span>
                      <span className="font-medium text-gray-700">0,00</span>
                    </div>
                  </div>
                </div>
              </fieldset>

            </div>
          </div>
        </div>
      </div>

      {/* 2. OVERLAY BACKDROP & MODAL DIALOG "MỞ CA LÀM VIỆC" */}
      <div className="absolute inset-0 bg-[#334155]/25 backdrop-blur-[0.5px] flex items-center justify-center p-4 z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-[#e4ebf2] rounded-sm shadow-2xl border border-gray-300 w-full max-w-[550px] flex flex-col overflow-hidden text-[15px] text-gray-800 font-sans"
        >
          {/* Dialog Title Bar matching image exactly */}
          <div className="h-11 bg-[#006cb2] flex items-center justify-between px-4 text-white select-none">
            <span className="font-bold text-[15px] uppercase tracking-wide">Mở ca làm việc</span>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => alert("Hướng dẫn mở ca làm việc POS PC.")}
                className="text-white hover:bg-white/15 p-1 rounded-sm transition-all cursor-pointer"
                title="Trợ giúp"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={onBackToPrinter}
                className="text-white hover:bg-white/15 p-1 rounded-sm transition-all cursor-pointer"
                title="Đóng (Quay lại thiết lập máy in)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dialog Content Area */}
          <div className="p-5 space-y-4 bg-white">
            
            {/* Field 1: Ca làm việc */}
            <div id="pos-tour-shift-select" className="flex items-center gap-4">
              <label className="w-[140px] text-gray-700 font-semibold select-none shrink-0">
                Ca làm việc <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="flex-1 relative">
                <select
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value as "Sáng" | "Tối")}
                  className="w-full bg-white border border-gray-300 text-gray-800 font-medium px-3 py-2 pr-8 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] appearance-none cursor-pointer text-[15px] h-10 shadow-xs"
                >
                  <option value="Sáng">Sáng</option>
                  <option value="Tối">Tối</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Field 2: Từ ... Đến (Locked Time Inputs - Set to medium weight per request) */}
            <div id="pos-tour-shift-hours" className="flex items-center gap-4">
              <label className="w-[140px] text-gray-700 font-semibold select-none shrink-0">
                Từ
              </label>
              <div className="flex-1 flex items-center gap-2">
                {/* Từ time */}
                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-sm h-10 select-none">
                  <span className="flex-1 px-3 font-medium text-gray-600 text-center text-[15px]">
                    {startTime}
                  </span>
                  <div className="w-10 h-full border-l border-gray-200 flex items-center justify-center text-gray-400 bg-gray-50">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                <span className="text-gray-500 font-semibold px-1 shrink-0">Đến</span>

                {/* Đến time */}
                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-sm h-10 select-none">
                  <span className="flex-1 px-3 font-medium text-gray-600 text-center text-[15px]">
                    {endTime}
                  </span>
                  <div className="w-10 h-full border-l border-gray-200 flex items-center justify-center text-gray-400 bg-gray-50">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Field 3: Tiền quỹ đầu ca (Set to medium weight per request) */}
            <div id="pos-tour-initial-fund" className="flex items-center gap-4">
              <label className="w-[140px] text-gray-700 font-semibold select-none shrink-0">
                Tiền quỹ đầu ca
              </label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={initialFund}
                  onChange={(e) => setInitialFund(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-right font-medium px-3 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] text-[15px] h-10 shadow-xs"
                  placeholder="0,00"
                />
              </div>
            </div>

            {/* EXPANDABLE SECTION FOR ADDITIONAL DETAILS */}
            {isExpanded && (
              <div className="pt-3.5 border-t border-gray-200 space-y-4">
                {/* Field A: Người bàn giao */}
                <div className="flex items-center gap-4">
                  <label className="w-[140px] text-gray-700 font-semibold select-none shrink-0">
                    Người bàn giao
                  </label>
                  <div className="flex-1 relative">
                    <select
                      value={handoverPerson}
                      onChange={(e) => setHandoverPerson(e.target.value)}
                      className="w-full bg-white border border-gray-300 text-gray-800 font-medium px-3 py-2 pr-8 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] appearance-none cursor-pointer text-[15px] h-10 shadow-xs"
                    >
                      <option value="Mai Ngọc Sơn">Mai Ngọc Sơn</option>
                      <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                      <option value="Trần Thị B">Trần Thị B</option>
                      <option value="Lê Văn C">Lê Văn C</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Field B: SL hóa đơn */}
                <div className="flex items-center gap-4">
                  <label className="w-[140px] text-gray-700 font-semibold select-none shrink-0">
                    SL hóa đơn
                  </label>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={invoiceCount}
                      onChange={(e) => setInvoiceCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-300 text-right font-medium px-3 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] text-[15px] h-10 shadow-xs"
                      min={0}
                    />
                  </div>
                </div>

                {/* Field C: SL cuống thẻ */}
                <div className="flex items-center gap-4">
                  <label className="w-[140px] text-gray-700 font-semibold select-none shrink-0">
                    SL cuống thẻ
                  </label>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={cardStubCount}
                      onChange={(e) => setCardStubCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-300 text-right font-medium px-3 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] text-[15px] h-10 shadow-xs"
                      min={0}
                    />
                  </div>
                </div>

                {/* Field D: SL cuống Voucher */}
                <div className="flex items-center gap-4">
                  <label className="w-[140px] text-gray-700 font-semibold select-none shrink-0">
                    SL cuống Voucher
                  </label>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={voucherStubCount}
                      onChange={(e) => setVoucherStubCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-300 text-right font-medium px-3 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] text-[15px] h-10 shadow-xs"
                      min={0}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Expand Link */}
            <div className="flex justify-end pr-1 select-none">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#006cb2] hover:underline flex items-center gap-1 font-bold text-[13px] cursor-pointer"
              >
                <span>{isExpanded ? "Thu gọn" : "Mở rộng"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 select-none">
              <button
                id="pos-tour-open-shift-btn"
                onClick={handleOpenShift}
                className="bg-[#005a96] hover:bg-[#004a7a] active:scale-95 text-white font-bold h-10 px-7 rounded-sm cursor-pointer shadow-sm transition-all text-[15px]"
              >
                MỞ CA
              </button>
              <button
                onClick={onBackToPrinter}
                className="bg-white hover:bg-gray-100 active:scale-95 text-red-600 border border-gray-300 font-bold h-10 px-7 rounded-sm cursor-pointer shadow-sm transition-all text-[15px]"
              >
                HỦY BỎ
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};
