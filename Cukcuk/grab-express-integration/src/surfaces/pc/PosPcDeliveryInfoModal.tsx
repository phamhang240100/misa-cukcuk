import React, {useState} from 'react';
import {ChevronDown, DollarSign, Plus, User, X} from 'lucide-react';
import type {Customer, CustomerAddress} from '../../types';
import {
  ALL_PROVINCES,
  MAX_COD,
  MSG,
  SERVICE_TYPE_DEFAULT,
  WARDS,
  districtsOf,
  formatCurrency,
  quoteDelivery,
} from '../../constants';
import {CUSTOMERS} from '../../data';
import {AlertPopup, GrabExpressChip, InfoTip} from '../../components/ui';

// ---------------------------------------------------------------------------
// Popup "Thông tin giao hàng" — bản PC, khớp ảnh chụp thật:
// radio Ngồi tại bàn / Gói mang về / Giao hàng tận nơi ở đầu; trái = thông tin
// khách hàng; phải = Hình thức giao hàng (đối tác). Nghiệp vụ COD/quote/validate
// giữ nguyên như bản tablet (constants.ts dùng chung).
// ---------------------------------------------------------------------------

export type PcPartner = 'SELF' | 'GRAB' | 'AHAMOVE' | 'SHOPEE';

export interface DeliveryDraft {
  customer: Customer | null;
  address: CustomerAddress;
  deliveryDate: string;
  deliveryTime: string;
  partner: PcPartner;
  partnerFee: number;
  feeCustomer: number;
  note: string;
  isCod: boolean;
}

const inputCls =
  'h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15';

export const PosPcDeliveryInfoModal: React.FC<{
  initial?: Partial<DeliveryDraft>;
  onConfirm: (draft: DeliveryDraft) => void;
  onClose: () => void;
}> = ({initial, onConfirm, onClose}) => {
  const [customer, setCustomer] = useState<Customer | null>(initial?.customer ?? null);
  const [address, setAddress] = useState<CustomerAddress>(
    initial?.address ?? {id: 'new', freetext: '', ward: '', district: '', province: '', isDefault: false},
  );
  const [deliveryDate, setDeliveryDate] = useState(initial?.deliveryDate ?? new Date().toISOString().slice(0, 10));
  const [deliveryTime, setDeliveryTime] = useState(
    initial?.deliveryTime ?? new Date(Date.now() + 30 * 60000).toTimeString().slice(0, 5),
  );
  const [partner, setPartner] = useState<PcPartner>(initial?.partner ?? 'GRAB');
  const [feeCustomer, setFeeCustomer] = useState(initial?.feeCustomer ?? 0);
  const [note, setNote] = useState(initial?.note ?? '');
  const [custErr, setCustErr] = useState(false);
  const [addrErr, setAddrErr] = useState(false);
  const [areaAlert, setAreaAlert] = useState(false);
  const [codAlert, setCodAlert] = useState(false);

  const isGrab = partner === 'GRAB';
  const addressComplete = !!(address.province && address.district && address.ward);
  const quote = addressComplete ? quoteDelivery(address) : {covered: false, fee: 0};
  const partnerFee = isGrab ? quote.fee : 0;
  const effectiveFeeCustomer = isGrab && addressComplete && quote.covered ? feeCustomer || partnerFee : feeCustomer;
  const subtotalPlaceholder = 0; // giỏ hàng điền sau khi Đồng ý — COD hiển thị ước tính theo phí GH
  const codAmount = subtotalPlaceholder + effectiveFeeCustomer;

  const handlePickCustomer = (c: Customer) => {
    setCustomer(c);
    setCustErr(false);
    const def = c.addresses.find((a) => a.isDefault) ?? c.addresses[0];
    if (def) setAddress(def);
  };

  const handleConfirm = () => {
    const custMissing = !customer;
    const addrMissing = isGrab ? !(address.freetext.trim() && addressComplete) : !address.freetext.trim();
    setCustErr(custMissing);
    setAddrErr(addrMissing);
    if (custMissing || addrMissing) return;
    if (isGrab && addressComplete && !quote.covered) {
      setAreaAlert(true);
      return;
    }
    if (isGrab && codAmount > MAX_COD) {
      setCodAlert(true);
      return;
    }
    onConfirm({
      customer,
      address,
      deliveryDate,
      deliveryTime,
      partner,
      partnerFee,
      feeCustomer: effectiveFeeCustomer || partnerFee,
      note,
      isCod: isGrab,
    });
  };

  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" onClick={onClose} />
      <div className="animate-scale-up relative flex max-h-[92%] w-full max-w-[860px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header xanh */}
        <div className="flex items-center justify-between bg-[#1570EF] px-5 py-3.5 text-white">
          <h3 className="text-[15px] font-bold">Thông tin giao hàng</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Radio loại order */}
        <div className="flex items-center gap-6 border-b border-slate-100 px-5 py-3">
          <RadioDot label="Ngồi tại bàn" checked={false} disabled />
          <RadioDot label="Gói mang về" checked={false} disabled />
          <RadioDot label="Giao hàng tận nơi" checked />
        </div>

        {/* 2 cột */}
        <div className="grid flex-1 grid-cols-2 gap-6 overflow-y-auto p-5">
          {/* Trái — Thông tin khách hàng */}
          <div className="space-y-3.5">
            <div className="text-[12px] font-bold uppercase tracking-wide text-slate-400">Thông tin khách hàng</div>

            <FieldRow label="Thời gian giao hàng" required>
              <div className="flex gap-2">
                <input type="time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className={inputCls} />
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className={inputCls} />
              </div>
            </FieldRow>

            <FieldRow label="Tên khách hàng" required error={custErr}>
              <div className={`flex h-9 items-center gap-2 rounded-md border bg-white px-2.5 ${custErr ? 'border-danger' : 'border-slate-300'}`}>
                <select
                  value={customer?.id ?? ''}
                  onChange={(e) => {
                    const c = CUSTOMERS.find((x) => x.id === e.target.value);
                    if (c) handlePickCustomer(c);
                  }}
                  className="flex-1 border-none bg-transparent text-[13px] font-medium text-slate-800 outline-none"
                >
                  <option value="">Nhập tên hoặc SĐT khách...</option>
                  {CUSTOMERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.phone}
                    </option>
                  ))}
                </select>
                <Plus className="h-4 w-4 shrink-0 text-green-600" />
              </div>
            </FieldRow>

            <FieldRow label="Số điện thoại">
              <input value={customer?.phone ?? ''} disabled className={inputCls + ' bg-slate-50 text-slate-500'} />
            </FieldRow>

            <FieldRow label="Địa chỉ giao hàng" required error={addrErr} alignTop>
              <textarea
                value={address.freetext}
                onChange={(e) => {
                  setAddress((a) => ({...a, freetext: e.target.value}));
                  if (e.target.value.trim()) setAddrErr(false);
                }}
                placeholder="Số nhà, tên đường..."
                className="h-16 w-full resize-none rounded-md border border-slate-300 p-2.5 text-[13px] outline-none focus:border-brand"
              />
              <div className="mt-2 grid grid-cols-3 gap-2">
                <select
                  value={address.province}
                  onChange={(e) => setAddress((a) => ({...a, province: e.target.value, district: '', ward: ''}))}
                  className={inputCls}
                >
                  <option value="">Tỉnh/thành</option>
                  {ALL_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <select
                  value={address.district}
                  disabled={!address.province}
                  onChange={(e) => setAddress((a) => ({...a, district: e.target.value, ward: ''}))}
                  className={inputCls + ' disabled:bg-slate-50 disabled:text-slate-400'}
                >
                  <option value="">Quận/huyện</option>
                  {districtsOf(address.province).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={address.ward}
                  disabled={!address.district}
                  onChange={(e) => {
                    const ward = e.target.value;
                    setAddress((a) => ({...a, ward}));
                    const covered = quoteDelivery({...address, ward}).covered;
                    if (isGrab && ward && !covered) setAreaAlert(true);
                  }}
                  className={inputCls + ' disabled:bg-slate-50 disabled:text-slate-400'}
                >
                  <option value="">Phường/xã</option>
                  {WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </FieldRow>

            <FieldRow label="Tiền KH trả trước">
              <div className="flex items-center gap-2">
                <input value="0" disabled className={inputCls + ' bg-slate-50 text-right text-slate-500'} />
                <button
                  type="button"
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 text-[12.5px] font-semibold text-amber-700 hover:bg-amber-100"
                >
                  <DollarSign className="h-3.5 w-3.5" /> Thu tiền
                </button>
              </div>
            </FieldRow>

            <FieldRow label="Ghi chú khách hàng" alignTop>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 255))}
                placeholder="Ghi chú thêm cho Shipper..."
                className="h-14 w-full resize-none rounded-md border border-slate-300 p-2.5 text-[13px] outline-none focus:border-brand"
              />
            </FieldRow>
          </div>

          {/* Phải — Hình thức giao hàng */}
          <div className="space-y-3.5">
            <div className="text-[12px] font-bold uppercase tracking-wide text-slate-400">Hình thức giao hàng</div>

            <FieldRow label="Đối tác giao hàng">
              <div className="relative">
                <select
                  value={partner}
                  onChange={(e) => setPartner(e.target.value as PcPartner)}
                  className={inputCls + ' appearance-none pr-8 font-semibold'}
                >
                  <option value="SELF">Nhà hàng tự giao</option>
                  <option value="GRAB">Grab Express</option>
                  <option value="AHAMOVE">AhaMove</option>
                  <option value="SHOPEE">ShopeeFood</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              {isGrab && (
                <div className="mt-2">
                  <GrabExpressChip />
                </div>
              )}
            </FieldRow>

            {isGrab ? (
              <>
                <FieldRow label="Dịch vụ">
                  <input value={SERVICE_TYPE_DEFAULT} disabled className={inputCls + ' bg-slate-50 text-slate-500'} />
                </FieldRow>
                <FieldRow label="Phí GH trả đối tác">
                  <div className="flex h-9 items-center justify-between rounded-md border border-slate-300 bg-slate-50 px-3">
                    <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                      Theo Grab Express <InfoTip text={MSG.feeHint} />
                    </span>
                    {!addressComplete ? (
                      <span className="text-[11.5px] italic text-slate-400">Điền đủ địa chỉ</span>
                    ) : quote.covered ? (
                      <span className="text-[13px] font-bold text-slate-800">{formatCurrency(partnerFee)}</span>
                    ) : (
                      <span className="text-[11.5px] font-semibold text-amber-600">Không báo giá được</span>
                    )}
                  </div>
                </FieldRow>
                <FieldRow label="Phí GH thu khách">
                  <input
                    type="number"
                    value={effectiveFeeCustomer || ''}
                    disabled={!addressComplete}
                    onChange={(e) => setFeeCustomer(Number(e.target.value))}
                    placeholder="0"
                    className={inputCls + ' text-right font-bold disabled:bg-slate-50'}
                  />
                </FieldRow>
              </>
            ) : (
              <FieldRow label="Phí giao hàng">
                <input
                  type="number"
                  value={feeCustomer || ''}
                  onChange={(e) => setFeeCustomer(Number(e.target.value))}
                  placeholder="0"
                  className={inputCls + ' text-right font-bold'}
                />
              </FieldRow>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 border-t border-slate-100 bg-[#f5f5f5] px-5 py-3.5">
          <button onClick={onClose} className="h-9 min-w-[110px] rounded-md border border-slate-300 bg-white px-6 text-[13px] font-bold text-slate-700 hover:bg-slate-50">
            Hủy bỏ
          </button>
          <button onClick={handleConfirm} className="h-9 min-w-[110px] rounded-md bg-[#1570EF] px-6 text-[13px] font-bold text-white hover:brightness-110">
            Đồng ý
          </button>
        </div>
      </div>

      <AlertPopup
        contained
        open={areaAlert}
        title="Ngoài khu vực Grab Express hỗ trợ"
        message={MSG.areaNoQuote}
        secondaryText="Đóng"
        onClose={() => setAreaAlert(false)}
      />
      <AlertPopup
        contained
        open={codAlert}
        title="Vượt hạn mức thu hộ"
        message={MSG.codOverLimit}
        secondaryText="Đóng"
        onClose={() => setCodAlert(false)}
      />
    </div>
  );
};

const RadioDot: React.FC<{label: string; checked: boolean; disabled?: boolean}> = ({label, checked, disabled}) => (
  <span className={`flex items-center gap-1.5 text-[13px] ${disabled ? 'text-slate-300' : 'font-semibold text-slate-700'}`}>
    <span
      className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
        checked ? 'border-[#1570EF]' : 'border-slate-300'
      }`}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-[#1570EF]" />}
    </span>
    {label}
  </span>
);

const FieldRow: React.FC<{
  label: string;
  required?: boolean;
  error?: boolean;
  alignTop?: boolean;
  children: React.ReactNode;
}> = ({label, required, error, children}) => (
  <div>
    <label className="mb-1 flex items-center gap-1 text-[12.5px] font-semibold text-slate-600">
      {label}
      {required && <span className="text-danger">*</span>}
    </label>
    {children}
    {error && <div className="mt-1 text-[11px] font-medium text-danger">Trường này không được để trống.</div>}
  </div>
);
