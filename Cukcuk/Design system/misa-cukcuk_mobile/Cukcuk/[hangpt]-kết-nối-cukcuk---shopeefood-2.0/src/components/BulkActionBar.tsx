import React from 'react';
import { Trash2, CheckCircle2, ShieldAlert, Archive, FileText, MoreHorizontal } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onExport?: () => void;
  onArchive?: () => void;
  onMarkDraft?: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onDelete,
  onApprove,
  onExport,
  onArchive,
  onMarkDraft,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between w-full select-none">
      {/* Left side: Selected count and Clear selection link */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-[#101828]">
          Đã chọn <span className="font-semibold">{selectedCount}</span> bản ghi
        </div>
        <button
          onClick={onClearSelection}
          className="text-[#2563EB] hover:underline text-sm font-medium focus:outline-none cursor-pointer"
        >
          Bỏ chọn
        </button>
      </div>

      {/* Right side: 5 main secondary actions + 1 more action */}
      <div className="flex items-center gap-2">
        {onApprove && (
          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 bg-white border border-[#D5D7DA] text-[#101828] hover:text-[#2563EB] hover:bg-[#F0F6FE] transition-colors font-medium px-3 text-body-reg select-none cursor-pointer"
            style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
          >
            <CheckCircle2 className="w-4 h-4 text-[#717680]" />
            Duyệt
          </button>
        )}

        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 bg-white border border-[#D5D7DA] text-[#101828] hover:text-[#2563EB] hover:bg-[#F0F6FE] transition-colors font-medium px-3 text-body-reg select-none cursor-pointer"
            style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
          >
            <FileText className="w-4 h-4 text-[#717680]" />
            Xuất Excel
          </button>
        )}

        {onArchive && (
          <button
            onClick={onArchive}
            className="flex items-center gap-1.5 bg-white border border-[#D5D7DA] text-[#101828] hover:text-[#2563EB] hover:bg-[#F0F6FE] transition-colors font-medium px-3 text-body-reg select-none cursor-pointer"
            style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
          >
            <Archive className="w-4 h-4 text-[#717680]" />
            Lưu trữ
          </button>
        )}

        {onMarkDraft && (
          <button
            onClick={onMarkDraft}
            className="flex items-center gap-1.5 bg-white border border-[#D5D7DA] text-[#101828] hover:text-[#2563EB] hover:bg-[#F0F6FE] transition-colors font-medium px-3 text-body-reg select-none cursor-pointer"
            style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
          >
            <ShieldAlert className="w-4 h-4 text-[#717680]" />
            Tạm ngưng
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium px-3 text-body-reg select-none cursor-pointer"
            style={{ height: '32px', borderRadius: '8px', minWidth: '84px' }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            Xóa
          </button>
        )}

        {/* More actions button */}
        <button
          className="flex items-center justify-center bg-white border border-[#D5D7DA] text-[#717680] hover:text-[#101828] hover:bg-gray-50 transition-all cursor-pointer"
          style={{ width: '32px', height: '32px', borderRadius: '8px' }}
          title="Thao tác khác"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
