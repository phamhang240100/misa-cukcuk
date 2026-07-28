import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface FilterComboboxProps {
  label: string;      // e.g., "Sản phẩm:" or "Trạng thái:"
  value: string;      // currently selected value
  options: string[];  // dropdown items
  onChange: (value: string) => void;
}

export const FilterCombobox: React.FC<FilterComboboxProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative inline-block text-left" style={{ width: '300px' }}>
      {/* Control Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-[#D5D7DA] hover:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all text-body-reg select-none cursor-pointer"
        style={{
          height: '32px',
          borderRadius: '8px',
        }}
      >
        <div className="flex items-center min-w-0 pl-3">
          <span className="text-[#717680] flex-shrink-0">{label}</span>
          <span className="text-[#101828] font-medium ml-1 truncate" title={value}>
            {value}
          </span>
        </div>
        <div className="flex items-center pr-2 ml-2 flex-shrink-0">
          <ChevronDown className="w-4 h-4 text-[#717680]" />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-1 w-full bg-white z-40 select-none flex flex-col"
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.10)',
            padding: '12px',
          }}
        >
          {/* Search box */}
          <div className="relative mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm"
              className="w-full pl-8 pr-3 text-body-reg bg-[#F5F5F5] border-none focus:outline-none text-[#101828]"
              style={{
                height: '32px',
                borderRadius: '8px',
              }}
              autoFocus
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]" />
          </div>

          {/* Options List */}
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: 'calc(8 * 32px)', // Max 8 items
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="flex items-center justify-center text-[#A4A7AE] italic" style={{ height: '32px' }}>
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option === value;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between text-left px-2 hover:bg-[#F0F6FE] transition-colors text-body-reg cursor-pointer`}
                    style={{ height: '32px' }}
                  >
                    <span className={`${isSelected ? 'text-[#2563EB] font-semibold' : 'text-[#101828]'}`}>
                      {option}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
