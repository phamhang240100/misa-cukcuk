import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

export interface FilterField {
  id: string;
  label: string;
  checked: boolean;
  condition: string;
  value: string;
}

interface AdvancedFilterProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FilterField[];
  onFieldsChange: (fields: FilterField[]) => void;
  onApply: () => void;
  onClear: () => void;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  isOpen,
  onClose,
  fields,
  onFieldsChange,
  onApply,
  onClear,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const updated = fields.map((f) => (f.id === id ? { ...f, checked } : f));
    onFieldsChange(updated);
  };

  const handleConditionChange = (id: string, condition: string) => {
    const updated = fields.map((f) => (f.id === id ? { ...f, condition } : f));
    onFieldsChange(updated);
  };

  const handleValueChange = (id: string, value: string) => {
    const updated = fields.map((f) => (f.id === id ? { ...f, value } : f));
    onFieldsChange(updated);
  };

  const filteredFields = fields.filter((f) =>
    f.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      className="flex flex-col bg-white select-none transition-all duration-250 ease-out h-full overflow-hidden"
      style={{
        width: '240px',
        borderRadius: '8px',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E9EAEB]">
        <h3 className="text-[#101828] font-semibold text-base">Bộ lọc</h3>
        <button
          onClick={onClose}
          className="text-[#717680] hover:text-[#101828] transition-colors p-1 hover:bg-[#F0F6FE] rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Search Field */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm trường..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2 text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none"
            style={{
              height: '32px',
              borderRadius: '8px',
            }}
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]" />
        </div>

        {/* Fields List */}
        <div className="space-y-2">
          {filteredFields.map((field) => {
            return (
              <div
                key={field.id}
                className={`transition-all rounded-md p-2 ${
                  field.checked ? 'bg-[#F0F6FE]' : 'hover:bg-gray-50'
                }`}
              >
                {/* Checkbox and Label */}
                <label className="flex items-start gap-2 cursor-pointer text-body-reg select-none">
                  <input
                    type="checkbox"
                    checked={field.checked}
                    onChange={(e) => handleCheckboxChange(field.id, e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-[#D5D7DA]"
                    style={{ borderRadius: '4px' }}
                  />
                  <span className={`text-[#101828] font-medium ${field.checked ? 'text-[#2563EB]' : ''}`}>
                    {field.label}
                  </span>
                </label>

                {/* Sub-controls when checked */}
                {field.checked && (
                  <div className="mt-2 pl-6 space-y-2 border-l-2 border-blue-200">
                    {/* Condition Dropdown */}
                    <div className="space-y-1">
                      <select
                        value={field.condition}
                        onChange={(e) => handleConditionChange(field.id, e.target.value)}
                        className="w-full text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:outline-none px-2 py-0.5"
                        style={{ height: '32px', borderRadius: '8px' }}
                      >
                        <option value="contains">Chứa</option>
                        <option value="equals">Bằng</option>
                        <option value="starts">Bắt đầu bằng</option>
                        <option value="ends">Kết thúc bằng</option>
                      </select>
                    </div>

                    {/* Value Input */}
                    <input
                      type="text"
                      placeholder="Nhập giá trị"
                      value={field.value}
                      onChange={(e) => handleValueChange(field.id, e.target.value)}
                      className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-2"
                      style={{ height: '32px', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#E9EAEB] bg-white px-4 flex items-center justify-between" style={{ height: '56px' }}>
        <button
          onClick={onClear}
          className="bg-white hover:bg-[#F0F6FE] border border-[#D5D7DA] text-[#101828] hover:text-[#2563EB] select-none text-body-reg cursor-pointer font-medium"
          style={{
            height: '32px',
            borderRadius: '8px',
            minWidth: '84px',
          }}
        >
          Bỏ lọc
        </button>
        <button
          onClick={onApply}
          className="bg-[#2563EB] hover:bg-[#1E40AF] text-white select-none text-body-reg cursor-pointer font-medium"
          style={{
            height: '32px',
            borderRadius: '8px',
            minWidth: '84px',
          }}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};
