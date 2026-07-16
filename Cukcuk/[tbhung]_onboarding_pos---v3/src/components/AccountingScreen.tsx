import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Check, LayoutGrid, FileText, Settings, HelpCircle, Wallet, 
  Coins, ArrowDownRight, ArrowUpRight, CalendarDays, Filter, Download, 
  CloudDownload, Sparkles, CheckCircle2, RefreshCw, Eye, Landmark, Info
} from 'lucide-react';

interface AccountingScreenProps {
  userProfile: any;
  orders: any[];
  taxSettings: any;
  transactions: any[];
  onAddTransaction: (tx: any) => void;
  onClose: () => void;
}

export default function AccountingScreen({
  userProfile,
  orders,
  taxSettings,
  transactions,
  onAddTransaction,
  onClose
}: AccountingScreenProps) {
  const [activeTab, setActiveTab] = useState<'ledger' | 'tax'>('ledger');
  const [filterType, setFilterType] = useState<'all' | 'receipt' | 'payment'>('all');
  
  // Dialog state for adding transaction
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState<'receipt' | 'payment'>('receipt');
  const [txCategory, setTxCategory] = useState('Doanh thu bán hàng');
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');

  // Tax declaration states
  const [selectedMonth, setSelectedMonth] = useState('Tháng 7/2026');
  const [isFilingTax, setIsFilingTax] = useState(false);
  const [taxFilingStatus, setTaxFilingStatus] = useState<'idle' | 'checking' | 'signed' | 'success'>('idle');

  // Helper formats
  const formatCurrency = (val: number) => {
    return val.toLocaleString('vi-VN') + ' đ';
  };

  // Ledger Calculations
  const totalReceipts = transactions
    .filter(t => t.type === 'receipt')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayments = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalReceipts - totalPayments;

  // Add receipt/payment transaction
  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txDescription) return;
    
    const newTx = {
      id: 'T' + Date.now().toString().slice(-4),
      type: txType,
      category: txCategory,
      amount: parseInt(txAmount) || 0,
      description: txDescription,
      date: new Date().toISOString().split('T')[0]
    };

    onAddTransaction(newTx);
    setShowAddTx(false);
    setTxAmount('');
    setTxDescription('');
  };

  // Sync / File tax with Tax Authority
  const runTaxFiling = () => {
    setIsFilingTax(true);
    setTaxFilingStatus('checking');
    
    const stages = ['checking', 'signed', 'success'];
    stages.forEach((stage, idx) => {
      setTimeout(() => {
        setTaxFilingStatus(stage as any);
        if (stage === 'success') {
          setIsFilingTax(false);
        }
      }, (idx + 1) * 1500);
    });
  };

  // Generate tax records from invoices (based on orders)
  // Let's list some simulated invoices that are already declared
  const mockInvoices = [
    { no: 'HD-000021', date: '2026-07-02', customer: 'Trần Bảo', taxCode: '0101234567', amount: 1105000 },
    { no: 'HD-000034', date: '2026-07-02', customer: 'Nguyễn Lan', taxCode: '0316543210', amount: 690000 },
    { no: 'HD-000012', date: '2026-07-02', customer: 'Lê Minh Tuấn', taxCode: '0109988776', amount: 300000 },
  ];

  const totalInvoicedNet = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const vatRate = taxSettings?.rate || 10;
  const calculatedVAT = Math.round(totalInvoicedNet * vatRate / 100);

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* Background glass overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Main Glassmorphism Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Module Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand/10">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Phân hệ Kế toán & Quản lý Thuế</h2>
              <p className="text-xs text-slate-500 font-medium">Báo cáo doanh nghiệp tự setup cho Tablet POS</p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${activeTab === 'ledger' ? 'bg-[#076EFF] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Wallet className="w-4 h-4" />
              Sổ quỹ & Thu Chi
            </button>
            <button
              onClick={() => setActiveTab('tax')}
              className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${activeTab === 'tax' ? 'bg-[#076EFF] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <FileText className="w-4 h-4" />
              Tờ khai & Thuế VAT
            </button>
          </div>
        </div>

        {/* Core Screen Body */}
        <div className="flex-1 overflow-hidden flex">
          
          {/* LEDGER TAB */}
          {activeTab === 'ledger' && (
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              {/* Summary stats row */}
              <div className="grid grid-cols-3 gap-5 mb-6 shrink-0">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Tổng thu nhập (Quỹ Thu)</span>
                    <span className="text-lg font-black text-slate-800">{formatCurrency(totalReceipts)}</span>
                  </div>
                </div>

                <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Tổng chi phí (Quỹ Chi)</span>
                    <span className="text-lg font-black text-slate-800">{formatCurrency(totalPayments)}</span>
                  </div>
                </div>

                <div className="bg-brand-light/30 p-4 rounded-2xl border border-brand/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#076EFF] text-white flex items-center justify-center shrink-0">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Tồn quỹ hiện tại</span>
                    <span className="text-lg font-black text-[#076EFF]">{formatCurrency(currentBalance)}</span>
                  </div>
                </div>
              </div>

              {/* Transactions Header controls */}
              <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Danh sách Chứng từ thu chi</span>
                  
                  {/* Ledger Type Filters */}
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                    {(['all', 'receipt', 'payment'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${filterType === type ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
                      >
                        {type === 'all' ? 'Tất cả' : type === 'receipt' ? 'Thu' : 'Chi'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setTxType('receipt');
                      setTxCategory('Doanh thu bán hàng');
                      setShowAddTx(true);
                    }}
                    className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Lập phiếu thu
                  </button>
                  <button 
                    onClick={() => {
                      setTxType('payment');
                      setTxCategory('Chi phí nguyên liệu');
                      setShowAddTx(true);
                    }}
                    className="h-9 px-4 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Lập phiếu chi
                  </button>
                </div>
              </div>

              {/* Transactions list table */}
              <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-inner">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-600 uppercase">Mã phiếu</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-600 uppercase">Loại quỹ</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-600 uppercase">Phân mục</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-600 uppercase">Ngày ghi sổ</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-600 uppercase">Diễn giải</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-600 uppercase text-right">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {transactions
                      .filter(t => filterType === 'all' || t.type === filterType)
                      .map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3.5 font-mono text-xs font-bold text-[#076EFF]">{tx.id}</td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full ${tx.type === 'receipt' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'receipt' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              {tx.type === 'receipt' ? 'Phiếu Thu' : 'Phiếu Chi'}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-xs font-bold text-slate-700">{tx.category}</td>
                          <td className="px-6 py-3.5 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {tx.date}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-xs text-slate-500 font-medium max-w-xs truncate">{tx.description}</td>
                          <td className={`px-6 py-3.5 text-xs font-black text-right ${tx.type === 'receipt' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {tx.type === 'receipt' ? '+' : '-'} {tx.amount.toLocaleString()}đ
                          </td>
                        </tr>
                      ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-12 text-slate-400 italic text-xs">
                          Chưa có chứng từ thu chi nào được tạo lập.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAX DECLARATION TAB */}
          {activeTab === 'tax' && (
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              {/* Top report header controls */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 mb-6 shrink-0 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-brand-light text-brand rounded-xl border border-brand/15">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide">Tờ khai thuế giá trị gia tăng (VAT)</h4>
                    <select 
                      className="text-base font-black text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 pr-6 mt-0.5"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="Tháng 7/2026">Tháng 7 / 2026 (Quý III)</option>
                      <option value="Tháng 8/2026">Tháng 8 / 2026 (Quý III)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Thuế suất bình quân</span>
                    <span className="text-base font-black text-slate-800">{vatRate}% VAT</span>
                  </div>
                  <div className="w-px bg-slate-200 h-10" />
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Thuế bán ra dự tính</span>
                    <span className="text-base font-black text-[#076EFF]">{formatCurrency(calculatedVAT)}</span>
                  </div>
                </div>

                <button 
                  onClick={runTaxFiling}
                  disabled={isFilingTax}
                  className="h-11 px-6 bg-[#076EFF] hover:bg-brand-hover text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-brand/20 transition-all disabled:opacity-50"
                >
                  <CloudDownload className="w-4 h-4 animate-bounce-short" />
                  Ký số & Nộp Tờ khai thuế (eSign)
                </button>
              </div>

              {/* Grid content and invoices breakdown */}
              <div className="flex-1 overflow-hidden flex gap-5">
                
                {/* Left Report list */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center mb-3 shrink-0">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Danh sách Hóa đơn GTGT đầu ra</span>
                    <span className="text-xs text-slate-400 font-medium">Lấy dữ liệu tự động từ Phần mềm xuất hóa đơn</span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase">Ký hiệu HD</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase">Khách hàng</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase">MST Khách</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase text-right">Giá trị trước thuế</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase text-right">Thuế VAT ({vatRate}%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mockInvoices.map((inv) => (
                          <tr key={inv.no} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3 font-mono text-xs font-bold text-slate-700">{inv.no}</td>
                            <td className="px-5 py-3 text-xs font-bold text-slate-800">{inv.customer}</td>
                            <td className="px-5 py-3 font-mono text-[11px] text-slate-400">{inv.taxCode}</td>
                            <td className="px-5 py-3 text-xs text-slate-700 font-bold text-right">{inv.amount.toLocaleString()}đ</td>
                            <td className="px-5 py-3 text-xs text-brand font-black text-right">{Math.round(inv.amount * vatRate / 100).toLocaleString()}đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right authority compliance info */}
                <div className="w-[300px] shrink-0 bg-slate-50 p-5 rounded-2xl border border-slate-200/60 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                      <Landmark className="w-5 h-5 text-brand" />
                      Tổng cục Thuế Việt Nam
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sản phẩm MISA CukCuk kết nối chính thức đến Cơ quan Thuế. Hóa đơn điện tử khởi tạo từ máy tính bảng được tự động truyền lên Tổng cục Thuế ngay khi hoàn tất hóa đơn.
                    </p>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/50 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Trạng thái kết nối:</span>
                        <span className="text-emerald-600 font-bold">Hoạt động</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phiên bản TCT:</span>
                        <span className="font-semibold text-slate-800">XML v1.2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hình thức nộp:</span>
                        <span className="font-semibold text-slate-800">API xuất hóa đơn</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-blue-50 text-[11px] text-blue-600 rounded-xl leading-relaxed">
                    <strong>Lưu ý:</strong> Hãy luôn đảm bảo đã ký chữ ký số đám mây eSign trước ngày nộp tờ khai của chu kỳ tiếp theo!
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="px-8 py-4 border-t border-slate-100 shrink-0 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="h-10 px-8 bg-[#076EFF] hover:bg-brand-hover text-white rounded-xl font-bold text-xs shadow-md transition-colors min-w-[120px]"
          >
            ĐÓNG
          </button>
        </div>

      </motion.div>

      {/* TAX FILING LOADING OVERLAY */}
      <AnimatePresence>
        {isFilingTax && (
          <div className="absolute inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center flex flex-col items-center gap-4 relative z-10"
            >
              {taxFilingStatus === 'checking' && (
                <>
                  <div className="w-16 h-16 rounded-full border-4 border-[#076EFF] border-t-transparent animate-spin" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Đang kết xuất và kiểm tra tờ khai...</h4>
                    <p className="text-xs text-slate-400 mt-1">Hệ thống đang cấu trúc hóa đơn XML chuẩn TT78.</p>
                  </div>
                </>
              )}

              {taxFilingStatus === 'signed' && (
                <>
                  <div className="w-16 h-16 bg-blue-50 text-[#076EFF] rounded-full flex items-center justify-center animate-pulse border border-blue-100">
                    <Landmark className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Đang thực hiện ký số eSign Cloud...</h4>
                    <p className="text-xs text-slate-400 mt-1">Truy vấn chữ ký số đám mây mã số thuế {userProfile?.taxCode || '0101234567'}.</p>
                  </div>
                </>
              )}

              {taxFilingStatus === 'success' && (
                <>
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8 animate-bounce-short" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Khai thuế Thành công!</h4>
                    <p className="text-xs text-slate-400 mt-1">Tờ khai thuế đã được tiếp nhận bởi Tổng cục Thuế Việt Nam.</p>
                  </div>
                  <button 
                    onClick={() => setIsFilingTax(false)}
                    className="w-full h-10 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors mt-2"
                  >
                    Xác nhận
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD TRANSACTION DIALOG */}
      <AnimatePresence>
        {showAddTx && (
          <div className="absolute inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTx(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-100 flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="font-black text-slate-800 text-sm uppercase tracking-wide">
                  {txType === 'receipt' ? 'LẬP PHIẾU THU QUỸ' : 'LẬP PHIẾU CHI QUỸ'}
                </span>
                <button onClick={() => setShowAddTx(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs">ĐÓNG</button>
              </div>

              <form onSubmit={handleCreateTransaction} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phân loại danh mục quỹ *</label>
                  {txType === 'receipt' ? (
                    <select 
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-xs"
                      value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}
                    >
                      <option value="Doanh thu bán hàng">Doanh thu bán hàng</option>
                      <option value="Thu nợ khách hàng">Thu nợ khách hàng</option>
                      <option value="Thu cọc khách đặt chỗ">Thu cọc khách đặt chỗ</option>
                      <option value="Khác">Thu khác</option>
                    </select>
                  ) : (
                    <select 
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-xs"
                      value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}
                    >
                      <option value="Chi phí nguyên liệu">Chi phí nguyên liệu</option>
                      <option value="Trả lương nhân viên">Trả lương nhân viên</option>
                      <option value="Thanh toán tiền điện nước">Thanh toán tiền điện nước</option>
                      <option value="Chi phí tiếp khách">Chi phí tiếp khách</option>
                      <option value="Khác">Chi khác</option>
                    </select>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Số tiền (VNĐ) *</span>
                    <span 
                      onClick={() => setTxAmount(txType === 'receipt' ? '1500000' : '450000')} 
                      className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-[#076EFF] text-[9px] font-bold rounded cursor-pointer select-none transition-colors"
                    >
                      Điền mẫu
                    </span>
                  </label>
                  <input 
                    type="number"
                    required
                    placeholder="E.g. 150000"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-xs font-bold cursor-pointer"
                    value={txAmount}
                    onClick={() => { if (!txAmount) setTxAmount(txType === 'receipt' ? '1500000' : '450000'); }}
                    onChange={(e) => setTxAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Diễn giải chứng từ *</span>
                    <span 
                      onClick={() => setTxDescription(txType === 'receipt' ? 'Thu tiền mặt khách đặt cọc tiệc sinh nhật tối nay - Bàn VIP' : 'Chi mua đá sạch và rau củ quả tươi trong ngày')} 
                      className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-[#076EFF] text-[9px] font-bold rounded cursor-pointer select-none transition-colors"
                    >
                      Điền mẫu
                    </span>
                  </label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Nhập ghi chú chi tiết cho giao dịch này..."
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand text-xs font-medium cursor-pointer"
                    value={txDescription}
                    onClick={() => { if (!txDescription) setTxDescription(txType === 'receipt' ? 'Thu tiền mặt khách đặt cọc tiệc sinh nhật tối nay - Bàn VIP' : 'Chi mua đá sạch và rau củ quả tươi trong ngày'); }}
                    onChange={(e) => setTxDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full h-10 text-white font-bold text-xs rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-1.5 ${
                    txType === 'receipt' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {txType === 'receipt' ? 'Ghi Sổ Phiếu Thu' : 'Ghi Sổ Phiếu Chi'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
