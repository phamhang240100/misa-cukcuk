import React, {useState} from 'react';
import {ChefHat, ChevronDown, ChevronUp, Cloud, Gift, Minus, Plus, Receipt, Save, SaveAll, Search, Truck, X} from 'lucide-react';
import {MENU_CATEGORIES, POS_MENU, type PosMenuItem} from '../../posMenu';
import {MAX_COD, formatCurrency} from '../../constants';
import {GrabExpressChip, InfoTip} from '../../components/ui';
import type {DeliveryDraft} from './PosPcDeliveryInfoModal';

export interface PcCartItem extends PosMenuItem {
  qty: number;
}

const DishImg: React.FC<{item: PosMenuItem}> = ({item}) => {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${item.tint} text-2xl`}>
        {item.emoji}
      </div>
    );
  return (
    <img
      src={item.image}
      alt={item.name}
      onError={() => setErr(true)}
      referrerPolicy="no-referrer"
      className="h-full w-full object-cover"
    />
  );
};

export const PosPcOrderScreen: React.FC<{
  draft: DeliveryDraft | null;
  cart: PcCartItem[];
  onAddItem: (item: PosMenuItem) => void;
  onChangeQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCancel: () => void;
  onSave: () => void;
  onSaveAndAdd: () => void;
  onEditDelivery: () => void;
  pushToast: (kind: 'success' | 'error' | 'info' | 'warning', title: string, desc?: string) => void;
}> = ({draft, cart, onAddItem, onChangeQty, onRemoveItem, onCancel, onSave, onSaveAndAdd, onEditDelivery, pushToast}) => {
  const [activeCat, setActiveCat] = useState('Hay dùng');
  const [q, setQ] = useState('');

  const items = POS_MENU.filter((m) => {
    if (q.trim()) return m.name.toLowerCase().includes(q.trim().toLowerCase());
    return activeCat === 'Hay dùng' ? true : m.category === activeCat;
  });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const feeCustomer = draft?.feeCustomer ?? 0;
  const total = subtotal + feeCustomer;
  const hasItems = cart.length > 0;
  const isGrabCod = draft?.partner === 'GRAB' && draft.isCod;
  const codOverLimit = isGrabCod && total > MAX_COD;

  return (
    <div className="flex h-full">
      {/* ===== Lưới món ===== */}
      <div className="flex min-w-0 flex-1 flex-col border-r border-slate-200 bg-white">
        <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-2.5">
          {MENU_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`shrink-0 rounded-t-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                activeCat === c ? 'border-b-2 border-brand text-brand' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="shrink-0 border-b border-slate-100 p-2.5">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nhập mã/Tên món cần tìm..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] outline-none focus:border-brand focus:bg-white"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-5 gap-3">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => onAddItem(it)}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <DishImg item={it} />
                  <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {Math.round(it.price / 1000)}K
                  </span>
                </div>
                <div className="truncate px-2 py-1.5 text-[12px] font-medium text-slate-700">{it.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Giỏ hàng ===== */}
      <div className="flex w-[420px] shrink-0 flex-col bg-[#FAFBFC]">
        {/* Header đơn */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-3 py-2.5">
          {draft ? (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Truck size={14} className="shrink-0 text-brand" />
                  <span className="truncate text-[13px] font-bold text-slate-800">{draft.customer?.name ?? 'Khách lẻ'}</span>
                  {draft.partner === 'GRAB' && <GrabExpressChip />}
                </div>
                <div className="truncate text-[11px] text-slate-400">
                  {draft.address.freetext}
                  {draft.address.ward ? `, ${draft.address.ward}` : ''}
                </div>
              </div>
              <button
                onClick={onEditDelivery}
                title="Đổi hình thức / thông tin giao hàng"
                className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 hover:bg-amber-100"
              >
                <Truck size={12} /> Giao hàng
                <ChevronDown size={12} />
              </button>
            </div>
          ) : (
            <div className="text-[12.5px] text-slate-400">Chọn "+ORDER › Thêm order Giao hàng" để bắt đầu.</div>
          )}
        </div>

        <div className="flex shrink-0 items-center border-b border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase text-slate-400">
          <span className="flex-1">Tên món</span>
          <span className="w-14 text-center">SL</span>
          <span className="w-24 text-right">Thành tiền</span>
          <span className="w-6" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!hasItems ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-slate-300">
              <ChefHat size={36} />
              <div className="text-[12.5px]">Chọn món phía bên trái để ghi order</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {cart.map((it) => (
                <div key={it.id} className="flex items-center gap-2 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-slate-800">{it.name}</div>
                    <div className="text-[11px] text-slate-400">{formatCurrency(it.price)}/{it.unit}</div>
                  </div>
                  <div className="flex w-14 shrink-0 items-center justify-center gap-1">
                    <button
                      onClick={() => onChangeQty(it.id, Math.max(1, it.qty - 1))}
                      className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="w-4 text-center text-[12.5px] font-semibold">{it.qty}</span>
                    <button
                      onClick={() => onChangeQty(it.id, it.qty + 1)}
                      className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  <div className="w-24 shrink-0 text-right text-[13px] font-semibold text-slate-800">
                    {formatCurrency(it.price * it.qty)}
                  </div>
                  <button onClick={() => onRemoveItem(it.id)} className="w-6 shrink-0 text-slate-300 hover:text-danger">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thu hộ (COD) — chỉ hiện với đơn Grab Express, tự tính, cảnh báo khi vượt hạn mức */}
        {isGrabCod && (
          <div
            className={`flex shrink-0 flex-col gap-0.5 border-t border-slate-200 px-3 py-2 ${
              codOverLimit ? 'bg-red-50' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-slate-600">Thu hộ (COD)</span>
              <span className={`text-[14px] font-black ${codOverLimit ? 'text-danger' : 'text-slate-800'}`}>
                {formatCurrency(total)}
              </span>
            </div>
            {codOverLimit && (
              <div className="text-[11px] font-medium text-danger">
                Vượt hạn mức 2.000.000đ — không thể Cất, vui lòng đổi đối tác giao hàng khác.
              </div>
            )}
          </div>
        )}

        {/* + Thêm món khác / Quà tặng */}
        <div className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-3 py-2">
          <button className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#12B76A] text-[12.5px] font-semibold text-[#12B76A] hover:bg-green-50">
            <Plus size={14} /> Thêm món khác
          </button>
          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-danger hover:bg-red-50">
            <Gift size={16} />
          </button>
        </div>

        {/* Nhân viên phục vụ / Tổng tiền */}
        <div className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5">
          <div className="relative flex-1">
            <select className="h-9 w-full appearance-none rounded-md border border-slate-300 bg-white pl-3 pr-8 text-[12.5px] font-semibold text-slate-700 outline-none focus:border-brand">
              <option>Nhân viên phục vụ</option>
              <option>Nguyễn Thu Hằng</option>
              <option>Trần Văn An</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <span className="shrink-0 text-[13px] font-bold text-slate-800">Tổng tiền</span>
          <span className="shrink-0 text-[16px] font-black text-slate-900">{formatCurrency(total)}</span>
          <InfoTip
            text={
              draft?.partner === 'GRAB'
                ? `Tiền hàng ${formatCurrency(subtotal)} + Phí GH thu khách ${formatCurrency(feeCustomer)}`
                : `Tiền hàng ${formatCurrency(subtotal)}`
            }
          />
        </div>

        {/* Footer actions — icon trên, chữ dưới, khớp ảnh POS PC thật */}
        <div className="flex shrink-0 items-stretch gap-1.5 border-t border-slate-200 bg-white p-2">
          <div className="flex shrink-0 flex-col justify-center gap-0.5">
            <button className="flex h-5 w-7 items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronUp size={12} />
            </button>
            <button className="flex h-5 w-7 items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronDown size={12} />
            </button>
          </div>

          <FooterBtn
            icon={<Cloud size={20} />}
            label="Gửi bếp/bar"
            tone="disabled"
            disabled
            onClick={() => pushToast('info', 'Đã gửi bếp/bar')}
          />
          <FooterBtn icon={<X size={20} />} label="Hủy bỏ" tone="danger-outline" onClick={onCancel} />
          <FooterBtn
            icon={<Save size={20} />}
            label="Cất"
            tone="brand-outline"
            disabled={!hasItems || !draft || codOverLimit}
            onClick={onSave}
          />
          <FooterBtn
            icon={<SaveAll size={20} />}
            label="Cất & Thêm"
            tone="success"
            disabled={!hasItems || !draft || codOverLimit}
            onClick={onSaveAndAdd}
          />
          <FooterBtn
            icon={<Receipt size={20} />}
            label="Tính tiền"
            tone="warning"
            disabled={!hasItems}
            onClick={() =>
              draft?.partner === 'GRAB'
                ? pushToast(
                    'info',
                    'Đơn giao hàng thu tiền tại Sổ giao hàng',
                    'Nhấn Cất trước, sang tab Sổ giao hàng để Thu tiền khi Grab Express giao thành công.',
                  )
                : pushToast('info', 'Tính tiền')
            }
          />
        </div>
      </div>
    </div>
  );
};

type FooterTone = 'disabled' | 'danger-outline' | 'brand-outline' | 'success' | 'warning';

const FOOTER_TONE_CLS: Record<FooterTone, string> = {
  disabled: 'border border-slate-200 bg-slate-50 text-slate-300',
  'danger-outline': 'border border-slate-200 bg-white text-danger hover:bg-red-50',
  'brand-outline': 'border border-slate-200 bg-white text-brand hover:bg-brand-light',
  success: 'bg-[#12B76A] text-white hover:brightness-105',
  warning: 'bg-[#F79009] text-white hover:brightness-105',
};

const FooterBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  tone: FooterTone;
  disabled?: boolean;
  onClick: () => void;
}> = ({icon, label, tone, disabled, onClick}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex h-16 flex-1 flex-col items-center justify-center gap-1 rounded-md text-[11.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${FOOTER_TONE_CLS[tone]}`}
  >
    {icon}
    {label}
  </button>
);
