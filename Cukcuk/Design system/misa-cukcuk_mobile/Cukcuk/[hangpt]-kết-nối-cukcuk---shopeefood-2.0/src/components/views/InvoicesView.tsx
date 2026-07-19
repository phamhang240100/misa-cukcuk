import React, { useState } from 'react';
import { INVOICES_DATA } from '../../data';
import { Invoice } from '../../types';
import { FilterCombobox } from '../FilterCombobox';
import { AdvancedFilter, FilterField } from '../AdvancedFilter';
import { BulkActionBar } from '../BulkActionBar';
import { Tooltip } from '../Tooltip';
import { Search, RotateCw, Settings, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Edit3, Trash, MoreHorizontal, CheckCircle, Clock, FileWarning, Printer, Calendar, User, DollarSign, X } from 'lucide-react';

interface InvoicesViewProps {
  onNotification: (message: string, type: 'success' | 'info') => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ onNotification }) => {
  // Master data state
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES_DATA);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Search & quick filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  // Advanced Filter state
  const [isAdvFilterOpen, setIsAdvFilterOpen] = useState(false);
  const [advFields, setAdvFields] = useState<FilterField[]>([
    { id: 'invoiceNumber', label: 'Số hóa đơn', checked: false, condition: 'contains', value: '' },
    { id: 'customerName', label: 'Tên khách hàng', checked: false, condition: 'contains', value: '' },
    { id: 'note', label: 'Ghi chú', checked: false, condition: 'contains', value: '' },
  ]);

  // Selected invoice for detail popup
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);

  // New Invoice Form state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customerName: '',
    amount: 150000,
    status: 'completed' as const,
    note: ''
  });

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Quick filters values
  const statusOptions = ['Tất cả', 'Đã thanh toán', 'Chờ thanh toán', 'Bản nháp', 'Đã hủy'];

  // Handle row hover effects for actions
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Filtering logic combining simple search, quick status, and advanced filters
  const filteredInvoices = invoices.filter((item) => {
    // 1. Basic search term
    const matchSearch =
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Status map
    let matchStatus = true;
    if (statusFilter === 'Đã thanh toán') matchStatus = item.status === 'completed';
    else if (statusFilter === 'Chờ thanh toán') matchStatus = item.status === 'pending';
    else if (statusFilter === 'Bản nháp') matchStatus = item.status === 'draft';
    else if (statusFilter === 'Đã hủy') matchStatus = item.status === 'cancelled';

    // 3. Advanced filters
    let matchAdv = true;
    advFields.forEach((field) => {
      if (field.checked && field.value.trim() !== '') {
        const val = field.value.toLowerCase().trim();
        const itemVal = (item[field.id as keyof Invoice] || '').toString().toLowerCase();

        if (field.condition === 'contains' && !itemVal.includes(val)) matchAdv = false;
        if (field.condition === 'equals' && itemVal !== val) matchAdv = false;
        if (field.condition === 'starts' && !itemVal.startsWith(val)) matchAdv = false;
        if (field.condition === 'ends' && !itemVal.endsWith(val)) matchAdv = false;
      }
    });

    return matchSearch && matchStatus && matchAdv;
  });

  // Pagination calculation
  const totalCount = filteredInvoices.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const startRange = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalCount);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedInvoices.map((inv) => inv.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Row operations
  const handleDeleteRow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setInvoices((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    onNotification("Đã xóa hóa đơn thành công", "success");
  };

  const handleBulkDelete = () => {
    setInvoices((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    onNotification(`Đã xóa ${selectedIds.length} hóa đơn được chọn`, "success");
  };

  const handleBulkApprove = () => {
    setInvoices((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: 'completed' as const } : item
      )
    );
    setSelectedIds([]);
    onNotification(`Đã cập nhật trạng thái "Đã thanh toán" cho ${selectedIds.length} hóa đơn`, "success");
  };

  const handleAddInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (invoices.length + 1).toString();
    const invoiceNum = `HD00${124 + invoices.length}`;
    const dateToday = new Date().toISOString().split('T')[0];
    
    const item: Invoice = {
      id: newId,
      invoiceNumber: invoiceNum,
      customerName: newInvoice.customerName || 'Khách vãng lai',
      date: dateToday,
      amount: Number(newInvoice.amount),
      status: newInvoice.status,
      note: newInvoice.note,
      itemsCount: Math.floor(Math.random() * 5) + 1
    };

    setInvoices([item, ...invoices]);
    setIsAddFormOpen(false);
    setNewInvoice({ customerName: '', amount: 150000, status: 'completed', note: '' });
    onNotification(`Đã thêm mới hóa đơn ${invoiceNum}`, "success");
  };

  return (
    <div className="flex flex-col h-full">
      {/* 1️⃣ Page Header / Bulk Action Bar overlay */}
      <div className="py-4 relative px-6 flex items-center justify-between bg-white border-b border-[#E9EAEB] select-none flex-shrink-0">
        {selectedIds.length > 0 ? (
          // Bulk Action Bar overlays Page Header when rows are selected as per instructions
          <div className="absolute inset-x-6 h-full flex items-center bg-transparent z-10 animate-fade-in">
            <BulkActionBar
              selectedCount={selectedIds.length}
              onClearSelection={() => setSelectedIds([])}
              onDelete={handleBulkDelete}
              onApprove={handleBulkApprove}
              onExport={() => onNotification(`Đang xuất dữ liệu ${selectedIds.length} hóa đơn ra Excel...`, "info")}
            />
          </div>
        ) : (
          // Normal Page Header
          <>
            <h2 className="text-[#101828] font-semibold text-xl">Hóa đơn bán hàng</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium text-body-reg select-none cursor-pointer"
                style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
              >
                Thêm mới
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main container wrapping Search, Content Table and Pagination */}
      <div className="flex gap-4 flex-1 p-6 overflow-hidden min-h-0">
        {/* Table + Filters section */}
        <div
          className="flex-1 flex flex-col bg-white overflow-hidden"
          style={{
            borderRadius: '8px',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Search & Filter bar (height 56px) */}
          <div className="flex items-center justify-between border-b border-[#E9EAEB] flex-wrap gap-2 px-3 select-none" style={{ height: '56px' }}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Left Search input */}
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm kiếm số hóa đơn, khách hàng..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none"
                  style={{ height: '32px', borderRadius: '8px' }}
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]" />
              </div>

              {/* Quick filter Combobox */}
              <FilterCombobox
                label="Trạng thái:"
                value={statusFilter}
                options={statusOptions}
                onChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Right operation icons */}
            <div className="flex items-center gap-2 pl-2">
              <button
                onClick={() => {
                  setInvoices(INVOICES_DATA);
                  setSelectedIds([]);
                  setSearchTerm('');
                  setStatusFilter('Tất cả');
                  onNotification("Danh sách hóa đơn đã được làm mới", "success");
                }}
                className="w-8 h-8 flex items-center justify-center text-[#717680] hover:text-[#2563EB] hover:bg-[#F0F6FE] transition-colors rounded-lg cursor-pointer"
                title="Làm mới"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNotification("Mở cài đặt cột bảng hóa đơn", "info")}
                className="w-8 h-8 flex items-center justify-center text-[#717680] hover:text-[#2563EB] hover:bg-[#F0F6FE] transition-colors rounded-lg cursor-pointer"
                title="Cài đặt bảng"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAdvFilterOpen(!isAdvFilterOpen)}
                className={`w-8 h-8 flex items-center justify-center transition-colors rounded-lg cursor-pointer ${
                  isAdvFilterOpen || advFields.some((f) => f.checked)
                    ? 'text-[#2563EB] bg-[#F0F6FE]'
                    : 'text-[#717680] hover:text-[#2563EB] hover:bg-[#F0F6FE]'
                }`}
                title="Bộ lọc nâng cao"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table Contents */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left table-fixed">
              {/* Header */}
              <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10 select-none">
                <tr className="text-body-reg font-semibold text-[#101828] h-10">
                  <th className="w-12 pl-4">
                    <input
                      type="checkbox"
                      checked={paginatedInvoices.length > 0 && paginatedInvoices.every((inv) => selectedIds.includes(inv.id))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                    />
                  </th>
                  <th className="w-28 pl-2">Số hóa đơn</th>
                  <th className="w-40 pl-2">Khách hàng</th>
                  <th className="w-28 pl-2">Ngày lập</th>
                  <th className="w-24 pl-2">Món ăn</th>
                  <th className="w-32 pl-2 text-right">Tổng tiền (đ)</th>
                  <th className="w-36 pl-4 text-center">Trạng thái</th>
                  <th className="w-48 pl-2">Ghi chú</th>
                  <th className="w-24 pr-4"></th> {/* Hover actions */}
                </tr>
              </thead>

              {/* Rows */}
              <tbody>
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-[#717680] text-body-reg bg-white">
                      Không tìm thấy hóa đơn nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((inv) => {
                    const isSelected = selectedIds.includes(inv.id);
                    return (
                      <tr
                        key={inv.id}
                        onMouseEnter={() => setHoveredRowId(inv.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        onClick={() => {
                          handleSelectRow(inv.id, !isSelected);
                        }}
                        className={`h-11 border-b border-[#E9EAEB] cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#DDEAFC]' : 'hover:bg-[#DDEAFC]'
                        }`}
                      >
                        {/* Checkbox column */}
                        <td className="pl-4 py-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(inv.id, e.target.checked)}
                            className="w-4 h-4 rounded text-[#2563EB] border-[#D5D7DA] cursor-pointer"
                          />
                        </td>

                        {/* ID column */}
                        <td 
                          className="pl-2 font-mono text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer truncate"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailInvoice(inv);
                          }}
                        >
                          {inv.invoiceNumber}
                        </td>

                        {/* Customer column */}
                        <td className="pl-2 text-body-reg font-medium text-[#101828] truncate">
                          {inv.customerName}
                        </td>

                        {/* Date column */}
                        <td className="pl-2 text-body-reg text-[#717680] truncate">
                          {inv.date}
                        </td>

                        {/* Items count */}
                        <td className="pl-2 text-body-reg text-[#717680]">
                          {inv.itemsCount} món
                        </td>

                        {/* Amount column */}
                        <td className="pl-2 text-body-reg font-semibold text-right text-[#101828] pr-2">
                          {inv.amount.toLocaleString('vi-VN')}
                        </td>

                        {/* Status column - outline style with pale bg & border */}
                        <td className="pl-4 text-center">
                          {inv.status === 'completed' && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300">
                              <CheckCircle className="w-3 h-3" /> Đã thanh toán
                            </span>
                          )}
                          {inv.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300">
                              <Clock className="w-3 h-3" /> Chờ thanh toán
                            </span>
                          )}
                          {inv.status === 'draft' && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-300">
                              <FileWarning className="w-3 h-3" /> Bản nháp
                            </span>
                          )}
                          {inv.status === 'cancelled' && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-300">
                              <X className="w-3 h-3" /> Đã hủy
                            </span>
                          )}
                        </td>

                        {/* Note column */}
                        <td className="pl-2 text-xs text-[#717680] truncate max-w-[180px]">
                          {inv.note || '—'}
                        </td>

                        {/* Hover row action buttons (Secondary Button type, max 3 main icons, ghost style with tooltip) */}
                        <td className="pr-4 py-1 flex items-center justify-end h-11 gap-1" onClick={(e) => e.stopPropagation()}>
                          {hoveredRowId === inv.id ? (
                            <>
                              <Tooltip content="Xem chi tiết">
                                <button
                                  onClick={() => setDetailInvoice(inv)}
                                  className="w-7 h-7 flex items-center justify-center bg-white border border-[#D5D7DA] hover:border-[#2563EB] text-[#717680] hover:text-[#2563EB] rounded shadow-sm transition-all cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </Tooltip>

                              <Tooltip content="In hóa đơn">
                                <button
                                  onClick={() => onNotification(`Mở mẫu in cho hóa đơn ${inv.invoiceNumber}`, "info")}
                                  className="w-7 h-7 flex items-center justify-center bg-white border border-[#D5D7DA] hover:border-[#2563EB] text-[#717680] hover:text-[#2563EB] rounded shadow-sm transition-all cursor-pointer"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                              </Tooltip>

                              <Tooltip content="Xóa">
                                <button
                                  onClick={(e) => handleDeleteRow(inv.id, e)}
                                  className="w-7 h-7 flex items-center justify-center bg-white border border-red-200 hover:border-red-500 text-red-500 hover:bg-red-50 rounded shadow-sm transition-all cursor-pointer"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </Tooltip>
                            </>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar (fixed bottom, height 40px approx, pale background, border top) */}
          <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] flex items-center justify-between px-4 select-none" style={{ height: '40px' }}>
            <div className="text-body-sm text-[#717680]">
              Tổng số: <span className="font-semibold text-[#101828]">{totalCount}</span>
            </div>

            <div className="flex items-center gap-4 text-body-sm">
              <div className="flex items-center gap-1 text-[#717680]">
                <span>Số dòng/trang:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#D5D7DA] text-[#101828] font-medium py-0.5 px-1.5 focus:outline-none"
                  style={{ height: '24px', borderRadius: '4px' }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="text-[#717680]">
                <span className="font-medium text-[#101828]">{startRange}</span> – <span className="font-medium text-[#101828]">{endRange}</span>
              </div>

              {/* Navigation button set (ghost/secondary icon buttons) */}
              <div className="flex items-center gap-0.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 disabled:hover:text-[#717680] cursor-pointer"
                  title="Trang đầu"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 disabled:hover:text-[#717680] cursor-pointer"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[#101828] font-medium px-2">{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 disabled:hover:text-[#717680] cursor-pointer"
                  title="Trang tiếp"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-6 h-6 flex items-center justify-center text-[#717680] hover:text-[#101828] disabled:opacity-30 disabled:hover:text-[#717680] cursor-pointer"
                  title="Trang cuối"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sliding Advanced Filter panel on the right (collapses/expands and shrinks table width) */}
        {isAdvFilterOpen && (
          <div className="flex-shrink-0 animate-slide-left" style={{ height: '100%' }}>
            <AdvancedFilter
              isOpen={isAdvFilterOpen}
              onClose={() => setIsAdvFilterOpen(false)}
              fields={advFields}
              onFieldsChange={(updated) => setAdvFields(updated)}
              onApply={() => {
                setCurrentPage(1);
                onNotification("Đã áp dụng các điều kiện lọc nâng cao", "success");
              }}
              onClear={() => {
                setAdvFields(advFields.map((f) => ({ ...f, checked: false, value: '' })));
                onNotification("Đã xóa tất cả bộ lọc nâng cao", "info");
              }}
            />
          </div>
        )}
      </div>

      {/* 2️⃣ Detail View Popup Modal (Layout màn Xem chi tiết (Detail View) dạng Popup) */}
      {detailInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 select-none">
          <div
            className="bg-white flex flex-col w-full max-w-xl shadow-2xl relative"
            style={{ borderRadius: '12px' }}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 border-b border-[#E9EAEB]" style={{ height: '62px' }}>
              <h3 className="text-[#101828] font-semibold text-lg">Chi tiết hóa đơn {detailInvoice.invoiceNumber}</h3>
              <button
                onClick={() => setDetailInvoice(null)}
                className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-[#717680] font-medium mb-1">Mã số hóa đơn</span>
                  <div className="text-body-reg font-mono font-semibold text-[#2563EB] pb-1 border-b border-[#D5D7DA]">
                    {detailInvoice.invoiceNumber}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-[#717680] font-medium mb-1">Khách hàng lập</span>
                  <div className="text-body-reg text-[#101828] pb-1 border-b border-[#D5D7DA]">
                    {detailInvoice.customerName}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-[#717680] font-medium mb-1">Ngày hóa đơn</span>
                  <div className="text-body-reg text-[#101828] pb-1 border-b border-[#D5D7DA]">
                    {detailInvoice.date}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-[#717680] font-medium mb-1">Số lượng mặt hàng</span>
                  <div className="text-body-reg text-[#101828] pb-1 border-b border-[#D5D7DA]">
                    {detailInvoice.itemsCount} món ăn / đồ uống
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-[#717680] font-medium mb-1">Tổng số tiền thanh toán</span>
                  <div className="text-body-reg font-bold text-emerald-600 pb-1 border-b border-[#D5D7DA]">
                    {detailInvoice.amount.toLocaleString('vi-VN')} đ
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-[#717680] font-medium mb-1">Trạng thái</span>
                  <div className="text-body-reg pb-1 border-b border-[#D5D7DA] font-semibold text-[#2563EB]">
                    {detailInvoice.status === 'completed' && 'Đã thanh toán'}
                    {detailInvoice.status === 'pending' && 'Chờ thanh toán'}
                    {detailInvoice.status === 'draft' && 'Bản nháp'}
                    {detailInvoice.status === 'cancelled' && 'Đã hủy bỏ'}
                  </div>
                </div>

                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-[#717680] font-medium mb-1">Ghi chú diễn giải</span>
                  <div className="text-body-reg text-[#101828] pb-1 border-b border-[#D5D7DA]">
                    {detailInvoice.note || 'Không có ghi chú thêm.'}
                  </div>
                </div>
              </div>

              {/* Sample list items */}
              <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-2">
                <div className="text-xs font-semibold text-[#717680] uppercase tracking-wider">Danh mục đặt món</div>
                <div className="flex justify-between text-xs py-1 border-b border-gray-200">
                  <span>Phở bò chín đặc biệt (x{detailInvoice.itemsCount})</span>
                  <span className="font-semibold">{detailInvoice.amount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]" style={{ height: '56px' }}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailInvoice(null)}
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium px-4 text-body-reg select-none cursor-pointer"
                  style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                >
                  Đóng
                </button>
                <button
                  onClick={() => onNotification("Bản in đang được chuyển tiếp tới máy in nội bộ...", "info")}
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#717680] hover:text-[#101828] font-medium px-4 text-body-reg select-none cursor-pointer"
                  style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                >
                  In
                </button>
                <button
                  onClick={() => {
                    onNotification("Chuyển sang chế độ Chỉnh sửa hóa đơn...", "info");
                    setDetailInvoice(null);
                  }}
                  className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-4 text-body-reg select-none cursor-pointer"
                  style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                >
                  Sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3️⃣ Add Popup Modal (Layout màn thêm mới, Sửa dạng Popup) */}
      {isAddFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 select-none">
          <div
            className="bg-white flex flex-col w-full max-w-md shadow-2xl relative"
            style={{ borderRadius: '12px' }}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 border-b border-[#E9EAEB]" style={{ height: '62px' }}>
              <h3 className="text-[#101828] font-semibold text-lg">Thêm mới hóa đơn</h3>
              <button
                onClick={() => setIsAddFormOpen(false)}
                className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleAddInvoiceSubmit}>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Tên khách hàng</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên khách hàng"
                    value={newInvoice.customerName}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
                    className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                    style={{ height: '32px', borderRadius: '8px' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Tổng số tiền (đ)</label>
                  <input
                    type="number"
                    required
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                    className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                    style={{ height: '32px', borderRadius: '8px' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Trạng thái ban đầu</label>
                  <select
                    value={newInvoice.status}
                    onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as any })}
                    className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-3"
                    style={{ height: '32px', borderRadius: '8px' }}
                  >
                    <option value="completed">Đã thanh toán</option>
                    <option value="pending">Chờ thanh toán</option>
                    <option value="draft">Bản nháp</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#717680]">Ghi chú / Diễn giải</label>
                  <input
                    type="text"
                    placeholder="Nhập ghi chú hóa đơn"
                    value={newInvoice.note}
                    onChange={(e) => setNewInvoice({ ...newInvoice, note: e.target.value })}
                    className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                    style={{ height: '32px', borderRadius: '8px' }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]" style={{ height: '56px' }}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddFormOpen(false)}
                    className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-4 text-body-reg select-none cursor-pointer"
                    style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
