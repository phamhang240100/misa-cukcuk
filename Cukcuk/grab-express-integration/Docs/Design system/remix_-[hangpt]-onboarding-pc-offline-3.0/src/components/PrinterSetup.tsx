import React from "react";
import { motion } from "motion/react";
import { Printer, X, Settings, ChevronDown, ChevronUp } from "lucide-react";

interface PrinterSetupProps {
  setShowPrinterSetup: (val: boolean) => void;
  cashierPrinter: string;
  setCashierPrinter: (val: string) => void;
  allowOtherPrinter: boolean;
  setAllowOtherPrinter: (val: boolean) => void;
  printerActiveTab: "bep-bar" | "tem-nhan";
  setPrinterActiveTab: (val: "bep-bar" | "tem-nhan") => void;
  barPrinter: string;
  setBarPrinter: (val: string) => void;
  kitchenPrinter: string;
  setKitchenPrinter: (val: string) => void;
  labelPrinter: string;
  setLabelPrinter: (val: string) => void;
  setActiveReceipt: (val: any) => void;
  setToast: (val: { message: string; type: "success" | "error" | "info" } | null) => void;
}

export const PrinterSetup: React.FC<PrinterSetupProps> = ({
  setShowPrinterSetup,
  cashierPrinter,
  setCashierPrinter,
  allowOtherPrinter,
  setAllowOtherPrinter,
  printerActiveTab,
  setPrinterActiveTab,
  barPrinter,
  setBarPrinter,
  kitchenPrinter,
  setKitchenPrinter,
  labelPrinter,
  setLabelPrinter,
  setActiveReceipt,
  setToast,
}) => {
  return (
    <motion.div
      key="printer-setup-panel"
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 15 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-[920px] flex flex-col overflow-hidden text-sm relative"
    >
      {/* Window Header */}
      <div className="h-10 bg-[#006cb2] flex items-center justify-between px-3 text-white select-none">
        <div className="flex items-center gap-2">
          <Printer className="w-4 h-4 text-white stroke-[2.2]" />
          <span className="font-bold text-xs uppercase tracking-wider">Thiết lập máy in và mẫu in</span>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-5 bg-white space-y-5">
        {/* Section 1: THU NGÂN */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            THIẾT LẬP MÁY IN VÀ MẪU IN CHO THU NGÂN
          </div>

          <div id="pos-tour-cashier" className="border border-gray-200 p-4 rounded bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Blue Dropdown Select */}
              <div className="flex-1 w-full relative">
                <select
                  value={cashierPrinter}
                  onChange={(e) => setCashierPrinter(e.target.value)}
                  className="w-full bg-[#f1f7fc] border border-[#a4c9e7] text-gray-800 font-semibold px-3 py-1.5 pr-8 text-xs rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] appearance-none cursor-pointer h-9"
                >
                  <option value="XP-80C (Cashier Printer - USB)">XP-80C (Cashier Printer - USB)</option>
                  <option value="Epson TM-T82III (192.168.1.100)">Epson TM-T82III (192.168.1.100)</option>
                  <option value="Microsoft Print to PDF">Microsoft Print to PDF</option>
                  <option value="Không sử dụng máy in">Không sử dụng máy in</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Buttons group */}
              <div className="flex gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => {
                    setToast({ message: `Đang mở tùy chỉnh mẫu in cho Thu ngân...`, type: "info" });
                  }}
                  className="flex-1 sm:flex-none h-9 bg-[#f2f2f2] hover:bg-[#e6e6e6] active:bg-[#dbdbdb] text-gray-800 font-semibold px-4.5 rounded border border-gray-300 text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Settings className="w-3.5 h-3.5 text-gray-500" />
                  <span>Tùy chỉnh mẫu in</span>
                </button>

                <button
                  onClick={() => {
                    setActiveReceipt({
                      printerName: cashierPrinter,
                      title: "HÓA ĐƠN TẠM TÍNH",
                      type: "cashier",
                      items: [
                        { name: "Cua gạch hấp bia", qty: 2 },
                        { name: "Ghẹ xanh cháy tỏi", qty: 1 },
                        { name: "Bia Heineken lon", qty: 6 },
                        { name: "Khăn lạnh", qty: 3 },
                      ],
                    });
                    setToast({ message: `Đang in thử ra ${cashierPrinter}...`, type: "success" });
                  }}
                  className="flex-1 sm:flex-none h-9 bg-[#f2f2f2] hover:bg-[#e6e6e6] active:bg-[#dbdbdb] text-gray-800 font-semibold px-4.5 rounded border border-gray-300 text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-500" />
                  <span>In thử</span>
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 mt-3 select-none">
              <input
                type="checkbox"
                id="allow-other-printer"
                checked={allowOtherPrinter}
                onChange={(e) => setAllowOtherPrinter(e.target.checked)}
                className="w-4 h-4 text-[#006cb2] border-gray-300 rounded focus:ring-[#006cb2] cursor-pointer"
              />
              <label htmlFor="allow-other-printer" className="text-xs font-semibold text-gray-600 cursor-pointer">
                Cho phép chọn máy in khác khi in tạm tính/hóa đơn.
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Tab control & settings for Bếp & Bar / Tem nhãn */}
        <div className="space-y-0">
          {/* Tabs list with gray layout */}
          <div className="flex select-none">
            <button
              onClick={() => setPrinterActiveTab("bep-bar")}
              className={`px-5 py-2.5 text-xs font-bold uppercase transition-all border-r border-gray-200 cursor-pointer ${
                printerActiveTab === "bep-bar"
                  ? "bg-white border-t-2 border-t-[#006cb2] border-x border-x-gray-200 border-b border-b-transparent text-gray-800"
                  : "bg-[#f5f5f5] border border-gray-200 border-b-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              THIẾT LẬP MÁY IN VÀ MẪU IN CHO BẾP & BAR
            </button>
            <button
              onClick={() => setPrinterActiveTab("tem-nhan")}
              className={`px-5 py-2.5 text-xs font-bold uppercase transition-all border-r border-gray-200 cursor-pointer ${
                printerActiveTab === "tem-nhan"
                  ? "bg-white border-t-2 border-t-[#006cb2] border-x border-x-gray-200 border-b border-b-transparent text-gray-800"
                  : "bg-[#f5f5f5] border border-gray-200 border-b-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              THIẾT LẬP MÁY IN VÀ MẪU IN TEM NHÃN
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="border border-gray-200 p-5 bg-white rounded-b shadow-sm -mt-[1px] space-y-4">
            {printerActiveTab === "bep-bar" ? (
              <div className="space-y-4">
                {/* Bar row */}
                <div id="pos-tour-bar" className="flex gap-3 items-center">
                  <div className="w-[45px] text-xs font-extrabold text-gray-700 select-none">Bar</div>

                  {/* Select */}
                  <div className="flex-1 relative">
                    <select
                      value={barPrinter}
                      onChange={(e) => setBarPrinter(e.target.value)}
                      className="w-full bg-[#f1f7fc] border border-[#a4c9e7] text-gray-800 font-semibold px-3 py-1.5 pr-8 text-xs rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] appearance-none cursor-pointer h-9"
                    >
                      <option value="Epson TM-U220 Bar (192.168.1.101)">Epson TM-U220 Bar (192.168.1.101)</option>
                      <option value="XP-N160I (LAN)">XP-N160I (LAN)</option>
                      <option value="Microsoft Print to PDF">Microsoft Print to PDF</option>
                      <option value="Không sử dụng máy in">Không sử dụng máy in</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Buttons group */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setToast({ message: `Đang mở tùy chỉnh mẫu in cho khu vực Bar...`, type: "info" });
                      }}
                      className="h-9 bg-[#f2f2f2] hover:bg-[#e6e6e6] text-gray-800 font-semibold px-4.5 rounded border border-gray-300 text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-500" />
                      <span>Tùy chỉnh mẫu in</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveReceipt({
                          printerName: barPrinter,
                          title: "PHIẾU PHA CHẾ (BAR)",
                          type: "bar",
                          items: [
                            { name: "Nước ép dưa hấu", qty: 2, note: "Ít đường, nhiều đá" },
                            { name: "Mojito Chanh dây", qty: 1, note: "Đậm vị" },
                            { name: "Matcha đá xay", qty: 1 },
                          ],
                        });
                        setToast({ message: `Đang in thử lệnh chế biến ra quầy Bar: ${barPrinter}...`, type: "success" });
                      }}
                      className="h-9 bg-[#f2f2f2] hover:bg-[#e6e6e6] text-gray-800 font-semibold px-4.5 rounded border border-gray-300 text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-500" />
                      <span>In thử</span>
                    </button>
                  </div>
                </div>

                {/* Kitchen row */}
                <div id="pos-tour-kitchen" className="flex gap-3 items-center">
                  <div className="w-[45px] text-xs font-extrabold text-gray-700 select-none">Bếp</div>

                  {/* Select */}
                  <div className="flex-1 relative">
                    <select
                      value={kitchenPrinter}
                      onChange={(e) => setKitchenPrinter(e.target.value)}
                      className="w-full bg-[#f1f7fc] border border-[#a4c9e7] text-gray-800 font-semibold px-3 py-1.5 pr-8 text-xs rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] appearance-none cursor-pointer h-9"
                    >
                      <option value="Xprinter XP-80 (LAN)">Xprinter XP-80 (LAN)</option>
                      <option value="Epson TM-U220 Kitchen (192.168.1.102)">Epson TM-U220 Kitchen (192.168.1.102)</option>
                      <option value="Microsoft Print to PDF">Microsoft Print to PDF</option>
                      <option value="Không sử dụng máy in">Không sử dụng máy in</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Buttons group */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setToast({ message: `Đang mở tùy chỉnh mẫu in cho Nhà bếp (Kitchen)...`, type: "info" });
                      }}
                      className="h-9 bg-[#f2f2f2] hover:bg-[#e6e6e6] text-gray-800 font-semibold px-4.5 rounded border border-gray-300 text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-500" />
                      <span>Tùy chỉnh mẫu in</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveReceipt({
                          printerName: kitchenPrinter,
                          title: "PHIẾU CHẾ BIẾN (BẾP)",
                          type: "bep",
                          items: [
                            { name: "Lẩu cua đồng bắp bò", qty: 1, note: "Cay vừa, không hành" },
                            { name: "Cánh gà chiên mắm", qty: 2 },
                            { name: "Khoai tây chiên", qty: 1 },
                          ],
                        });
                        setToast({ message: `Đang in thử lệnh chế biến ra Nhà Bếp: ${kitchenPrinter}...`, type: "success" });
                      }}
                      className="h-9 bg-[#f2f2f2] hover:bg-[#e6e6e6] text-gray-800 font-semibold px-4.5 rounded border border-gray-300 text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-500" />
                      <span>In thử</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Tab 2: Tem nhãn */
              <div>
                <div className="flex gap-3 items-center">
                  <div className="w-[80px] text-xs font-extrabold text-gray-700 select-none">Tem nhãn</div>

                  {/* Select */}
                  <div className="flex-1 relative">
                    <select
                      value={labelPrinter}
                      onChange={(e) => setLabelPrinter(e.target.value)}
                      className="w-full bg-[#f1f7fc] border border-[#a4c9e7] text-gray-800 font-semibold px-3 py-1.5 pr-8 text-xs rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0070bc] focus:border-[#0070bc] appearance-none cursor-pointer h-9"
                    >
                      <option value="Xprinter XP-350B (Label USB)">Xprinter XP-350B (Label USB)</option>
                      <option value="Gprinter GP-3120TU">Gprinter GP-3120TU</option>
                      <option value="Không sử dụng máy in">Không sử dụng máy in</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Buttons group */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setToast({ message: `Đang mở tùy chỉnh mẫu tem nhãn hàng hóa...`, type: "info" });
                      }}
                      className="h-9 bg-[#f2f2f2] hover:bg-[#e6e6e6] text-gray-800 font-semibold px-4.5 rounded border border-gray-300 text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-500" />
                      <span>Tùy chỉnh mẫu in</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveReceipt({
                          printerName: labelPrinter,
                          title: "TEM NHÃN MÓN ĂN",
                          type: "label",
                          items: [
                            { name: "Trà sữa Matcha trân châu", qty: 1, note: "70% Đường | 50% Đá" },
                          ],
                        });
                        setToast({ message: `Đang in thử Tem Nhãn: ${labelPrinter}...`, type: "success" });
                      }}
                      className="h-9 bg-[#f2f2f2] hover:bg-[#e6e6e6] text-gray-800 font-semibold px-4.5 rounded border border-gray-300 text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-500" />
                      <span>In thử</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grey Footer Bar */}
      <div className="bg-[#eaeaea] border-t border-gray-300 p-3.5 flex items-center justify-end select-none">
        <div className="flex items-center gap-2">
          <button
            id="pos-tour-save-btn"
            onClick={() => {
              setShowPrinterSetup(false);
              setToast({ message: "Cất và đồng ý thiết lập máy in thành công!", type: "success" });
            }}
            className="bg-[#0070bc] hover:bg-[#005c9c] text-white font-bold px-6 py-1.5 rounded text-xs transition-colors cursor-pointer shadow-sm"
          >
            Cất & Đồng ý
          </button>

          {/* Up & Down Chevron Square Buttons from user image */}
          <div className="flex gap-1 pl-1 border-l border-gray-300">
            <button
              onClick={() => {
                setShowPrinterSetup(false);
                setToast({ message: "Cất thiết lập máy in thành công!", type: "success" });
              }}
              className="w-9 h-9 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer shadow-sm"
              title="Lưu & Đóng (Cất xuống)"
            >
              <ChevronDown className="w-4 h-4 text-gray-600 stroke-[2.5]" />
            </button>
            <button
              onClick={() => {
                setToast({ message: "Cuộn lên đầu trang thiết lập.", type: "info" });
              }}
              className="w-9 h-9 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer shadow-sm"
              title="Cuộn lên"
            >
              <ChevronUp className="w-4 h-4 text-gray-600 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
