import React, {useState} from 'react';
import {
  ArrowLeft,
  Banknote,
  Check,
  Clock,
  CreditCard,
  Layers,
  Plus,
  Printer,
  QrCode,
  Save,
  Send,
  SplitSquareHorizontal,
  Trash2,
  User,
  Wallet,
  X,
} from 'lucide-react';
import type {ConnectionState, DeliveryOrder, ToastKind} from '../types';
import {formatCurrency} from '../constants';
import {GrabExpressChip} from '../components/ui';

type PayMethod = 'cash' | 'transfer' | 'ewallet' | 'multi';
const PAY_TABS: {id: PayMethod; label: string; icon: React.ReactNode}[] = [
  {id: 'cash', label: 'Tiền mặt', icon: <Banknote className="h-4 w-4" />},
  {id: 'transfer', label: 'Chuyển khoản', icon: <QrCode className="h-4 w-4" />},
  {id: 'ewallet', label: 'Ví điện tử', icon: <Wallet className="h-4 w-4" />},
  {id: 'multi', label: 'Đa phương thức', icon: <Layers className="h-4 w-4" />},
];

/**
 * Màn tính tiền (UI mới) — mở khi bấm "Giao hàng" / "Tính tiền".
 * Đơn Grab đang Chờ gửi đối tác: nút xanh = "Giao hàng" (thay cho Thanh toán).
 */
export const PosCheckoutScreen: React.FC<{
  order: DeliveryOrder;
  connection: ConnectionState;
  isGrab: boolean;
  onClose: () => void;
  onSend: (id: string) => void;
  pushToast: (kind: ToastKind, title: string, desc?: string) => void;
}> = ({order, connection, isGrab, onClose, onSend, pushToast}) => {
  const [pay, setPay] = useState<PayMethod>('cash');
  const [eInvoice, setEInvoice] = useState(false);
  const [sending, setSending] = useState(false);
  const [scenario, setScenario] = useState<'ok' | 'e002' | 'e003'>('ok'); // demo kịch bản gửi đơn

  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);
  const goods = order.subtotal;
  const promo = 0;
  const feeTax = order.shippingFeeCustomer;
  const total = goods + feeTax - promo;
  const remaining = order.isCod ? order.codAmount : total;

  const canSend = isGrab && order.cukcukStatus === 'cho_gui_doi_tac';
  const primaryLabel = canSend ? 'Giao hàng' : 'Thanh toán';
  const onPrimary = () => {
    if (canSend) {
      // FR-pos-021 — chống double-send (đơn đã ≥ Chờ giao hàng thì từ chối gửi lần 2).
      if (order.cukcukStatus !== 'cho_gui_doi_tac') {
        pushToast('warning', 'Đơn đã được gửi');
        return;
      }
      if (!connection.isConnected) {
        pushToast('warning', 'Chưa kết nối Grab Express', 'Vào Web quản lý › Ứng dụng để kết nối.');
        return;
      }
      if (sending) return;
      setSending(true);
      // FR-pos-024 (E-002) / FR-pos-025 (E-003) — giữ đơn ở Chờ gửi đối tác khi lỗi.
      if (scenario === 'e002') {
        setSending(false);
        pushToast('error', 'Gửi đơn không thành công', 'Grab từ chối do sai thông tin đơn — kiểm tra địa chỉ/SĐT rồi gửi lại.');
        return;
      }
      if (scenario === 'e003') {
        setSending(false);
        pushToast('error', 'Không thể gửi đơn, thử lại sau', 'Grab đang bận hoặc mất kết nối — đơn vẫn ở Chờ gửi đối tác.');
        return;
      }
      onSend(order.id);
    } else if (order.geStatus === 'COMPLETED' || !isGrab) {
      pushToast('success', 'Đã thanh toán', `Đơn ${order.invoiceNo ?? order.orderNo} chuyển sang Đã thanh toán.`);
      onClose();
    } else {
      pushToast('warning', 'Chưa thể thu tiền', 'Đơn chưa giao xong, chưa thể thu tiền.');
    }
  };

  return (
    <div className="flex h-full gap-3">
      {/* ===== TRÁI: đơn hàng ===== */}
      <div className="flex w-[440px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-100 p-3">
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-lg font-black text-slate-800">
                {isGrab ? 'Đơn giao hàng' : order.customerName || 'Đơn hàng'}
              </span>
              {isGrab && <GrabExpressChip />}
            </div>
            <div className="text-[12px] font-medium text-slate-400">#{order.invoiceNo ?? order.orderNo}</div>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
            <Clock className="h-3 w-3" /> {order.scheduledTime}
          </span>
        </div>

        {/* Khách hàng */}
        <div className="border-b border-slate-100 p-3">
          {order.customerName ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
                <User className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-bold text-slate-800">{order.customerName}</div>
                <div className="text-[12px] text-slate-400">{order.customerPhone}</div>
              </div>
            </div>
          ) : (
            <button className="flex w-full items-center gap-2 rounded-xl border border-dashed border-brand/40 px-3 py-2.5 text-[13px] font-semibold text-brand">
              <Plus className="h-4 w-4" /> Chọn khách hàng
            </button>
          )}
        </div>

        {/* Danh sách món */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {order.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-sky-100 to-white text-4xl">🍽️</div>
              Chưa có món nào
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-brand-light px-1.5 text-[13px] font-bold text-brand">
                    {it.qty}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold text-slate-800">{it.name}</div>
                    <div className="text-[12px] text-slate-400">{formatCurrency(it.price)}</div>
                  </div>
                  <span className="text-[13px] font-bold text-slate-800">{formatCurrency(it.qty * it.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 p-3">
          <FooterBtn icon={<Printer className="h-4 w-4" />} label="In tạm tính" onClick={() => pushToast('info', 'In tạm tính')} />
          <FooterBtn icon={<SplitSquareHorizontal className="h-4 w-4" />} label="Tách HĐ" onClick={() => pushToast('info', 'Tách hóa đơn')} />
        </div>
      </div>

      {/* ===== PHẢI: chi tiết thanh toán ===== */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Chi tiết thanh toán */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-[15px] font-black text-slate-800">
            <Banknote className="h-5 w-5 text-brand" /> Chi tiết thanh toán
          </div>
          <div className="flex items-end justify-between">
            <div className="flex gap-8">
              <Stat label={`Tiền hàng (${itemCount} món)`} value={formatCurrency(goods)} />
              <Stat label="Khuyến mại" value={'-' + formatCurrency(promo)} tone="danger" />
              <Stat label="Phí & Thuế" value={formatCurrency(feeTax)} />
            </div>
            <div className="text-right">
              <div className="text-[13px] font-medium text-slate-500">Tổng thanh toán</div>
              <div className="text-[28px] font-black leading-tight text-brand">{formatCurrency(total)}</div>
            </div>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex border-b border-slate-100">
            {PAY_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setPay(t.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-[13px] font-semibold transition-colors ${
                  pay === t.id ? 'border-b-2 border-brand text-brand' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {pay === 'multi' ? (
              <>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-slate-800">Thanh toán nhiều phương thức</div>
                    <div className="text-[12px] text-slate-400">Khách hàng thanh toán bằng nhiều nguồn</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] text-slate-400">Còn thiếu</div>
                    <div className="text-[15px] font-black text-success">{formatCurrency(0)}</div>
                  </div>
                </div>
                <div className="mb-2 flex items-center gap-2 rounded-xl border border-slate-200 p-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-success"><Banknote className="h-4 w-4" /></span>
                  <span className="flex-1 text-[13px] font-semibold text-slate-700">Tiền mặt</span>
                  <span className="text-[13px] font-bold text-slate-800">{formatCurrency(remaining)}</span>
                  <button className="text-slate-300 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-[13px] font-semibold text-slate-500 hover:bg-slate-50">
                  <Plus className="h-4 w-4" /> Thêm phương thức
                </button>
              </>
            ) : (
              <div>
                <div className="mb-2 flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-slate-600">Khách trả bằng {PAY_TABS.find((t) => t.id === pay)!.label.toLowerCase()}</span>
                  <span className="text-slate-400">Còn phải thu: <b className="text-slate-700">{formatCurrency(remaining)}</b></span>
                </div>
                <input
                  defaultValue={remaining}
                  className="h-14 w-full rounded-xl border border-slate-200 px-4 text-right text-2xl font-black text-slate-800 outline-none focus:border-brand"
                />
                {isGrab && order.isCod && (
                  <p className="mt-2 text-[12px] text-slate-400">
                    Đơn Grab Express thu hộ (COD) — tài xế đã thu {formatCurrency(order.codAmount)} của khách khi giao.
                  </p>
                )}
              </div>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-2 border-t border-slate-100 px-4 py-3 text-[13px] font-medium text-slate-600">
            <input type="checkbox" checked={eInvoice} onChange={(e) => setEInvoice(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" />
            Khách lấy hóa đơn điện tử
          </label>
        </div>

        {/* Nút dưới */}
        <div className="flex items-center gap-3">
          {/* Kịch bản gửi (demo) — để thử nhánh lỗi E-002/E-003 */}
          {canSend && (
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as 'ok' | 'e002' | 'e003')}
              title="Kịch bản gửi (demo)"
              className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-500 outline-none focus:border-brand"
            >
              <option value="ok">Demo: gửi thành công</option>
              <option value="e002">Demo: lỗi dữ liệu (E-002)</option>
              <option value="e003">Demo: lỗi tạm thời (E-003)</option>
            </select>
          )}
          <button onClick={onClose} className="flex h-12 items-center gap-2 rounded-xl bg-slate-100 px-5 text-[14px] font-bold text-slate-500 hover:bg-slate-200">
            <X className="h-4 w-4" /> Hủy
          </button>
          <button onClick={() => pushToast('success', 'Đã lưu tạm')} className="flex h-12 items-center gap-2 rounded-xl border border-brand bg-white px-5 text-[14px] font-bold text-brand hover:bg-brand-light">
            <Save className="h-4 w-4" /> Lưu tạm
          </button>
          <button
            onClick={onPrimary}
            disabled={sending}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#12B76A] text-[15px] font-bold text-white hover:brightness-105 disabled:opacity-60"
          >
            {canSend ? <Send className="h-5 w-5" /> : <Check className="h-5 w-5" />} {sending ? 'Đang gửi…' : primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{label: string; value: string; tone?: 'danger'}> = ({label, value, tone}) => (
  <div>
    <div className={`text-[12px] font-medium ${tone === 'danger' ? 'text-danger' : 'text-slate-500'}`}>{label}</div>
    <div className={`text-[15px] font-bold ${tone === 'danger' ? 'text-danger' : 'text-slate-800'}`}>{value}</div>
  </div>
);

const FooterBtn: React.FC<{icon: React.ReactNode; label: string; onClick?: () => void}> = ({icon, label, onClick}) => (
  <button
    onClick={onClick}
    className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50"
  >
    {icon} {label}
  </button>
);
