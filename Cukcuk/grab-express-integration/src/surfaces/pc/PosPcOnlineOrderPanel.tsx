import React, {useState} from 'react';
import {CalendarDays, ChevronDown, Info, MapPin, NotebookPen, User, X} from 'lucide-react';
import type {ConnectionState, DeliveryOrder} from '../../types';
import {MSG, SERVICE_TYPE_DEFAULT, formatCurrency, quoteDelivery} from '../../constants';
import {AlertPopup, GrabExpressChip, InfoTip} from '../../components/ui';
import type {OnlineOrder} from './onlineOrder';

// ---------------------------------------------------------------------------
// Slide-out panel "Xác nhận đơn online" — bản PC, cùng nghiệp vụ bản tablet
// (FR-pos-072): 2 tab Thông tin đơn hàng / Đối tác giao hàng; footer
// Từ chối / Xác nhận & Giao hàng / Xác nhận → tạo đơn Chờ gửi đối tác.
// ---------------------------------------------------------------------------

type DeliveryMethod = 'SELF' | 'GRAB' | 'AHAMOVE' | 'SHOPEE';
const METHOD_LABELS: Record<DeliveryMethod, string> = {
  SELF: 'Nhà hàng tự giao',
  GRAB: 'Grab Express',
  AHAMOVE: 'AhaMove',
  SHOPEE: 'ShopeeFood',
};

const rowInput =
  'h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15';

export const PosPcOnlineOrderPanel: React.FC<{
  order: OnlineOrder;
  connection: ConnectionState;
  onClose: () => void;
  onReject: () => void;
  onConfirm: (deliveryOrder: DeliveryOrder, deliver: boolean) => void;
}> = ({order, connection, onClose, onReject, onConfirm}) => {
  const [ptab, setPtab] = useState<'info' | 'partner'>('info');
  const [method, setMethod] = useState<DeliveryMethod>('GRAB');
  const [feeCustomer, setFeeCustomer] = useState<number | null>(null);
  const [areaAlert, setAreaAlert] = useState(false);
  const [simNoQuote, setSimNoQuote] = useState(false); // demo: Grab không báo giá được

  const isGrab = method === 'GRAB';
  const quote = quoteDelivery(order);
  const supported = !simNoQuote && quote.covered;
  const partnerFee = isGrab && supported ? quote.fee : 0;
  const feeCust = feeCustomer ?? partnerFee;
  const total = order.subtotal + (isGrab ? feeCust : 0);

  const build = (): DeliveryOrder => ({
    id: 'pc-onl' + Date.now(),
    orderNo: order.orderNo,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    address: {id: 'onl', freetext: order.freetext, ward: order.ward, district: order.district, province: order.province, isDefault: true},
    items: order.items,
    subtotal: order.subtotal,
    shippingFeePartner: partnerFee,
    shippingFeeCustomer: feeCust,
    isCod: true,
    codAmount: total,
    serviceType: SERVICE_TYPE_DEFAULT,
    cukcukStatus: 'cho_gui_doi_tac',
    geStatus: undefined,
    scheduledTime: order.deliveryTime,
    createdAt: 'vừa xong',
  });

  const doConfirm = (deliver: boolean) => {
    if (isGrab && !supported) {
      setAreaAlert(true);
      setPtab('partner');
      return;
    }
    onConfirm(build(), deliver);
  };

  return (
    <div className="absolute inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30 animate-fade-in" onClick={onClose} />
      <div className="animate-slide-left relative z-10 flex h-full w-[520px] flex-col bg-white shadow-2xl">
        {/* Header xanh — đồng bộ style các popup PC khác */}
        <div className="flex shrink-0 items-center justify-between bg-[#1570EF] px-5 py-3.5 text-white">
          <h3 className="flex items-center gap-2 text-[15px] font-bold">
            Đơn Online · {order.orderNo}
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">{order.source}</span>
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 border-b border-slate-100">
          {(['info', 'partner'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPtab(t)}
              className={`flex-1 py-3 text-[13px] font-bold transition-colors ${
                ptab === t ? 'border-b-2 border-brand text-brand' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'info' ? 'Thông tin đơn hàng' : 'Đối tác giao hàng'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {ptab === 'info' ? (
            <>
              <p className="mb-4 text-[12.5px] italic text-slate-400">Thời gian đặt: {order.createdAt}</p>
              <div className="space-y-4">
                <PanelInfo icon={<CalendarDays className="h-5 w-5 text-slate-400" />} label="Thời gian nhận" value={order.deliveryTime} />
                <PanelInfo icon={<User className="h-5 w-5 text-slate-400" />} label="Khách hàng" value={`${order.customerName} · ${order.customerPhone}`} />
                <PanelInfo
                  icon={<MapPin className="h-5 w-5 text-slate-400" />}
                  label="Địa chỉ giao hàng"
                  value={`${order.freetext}, ${order.ward}, ${order.district}, ${order.province}`}
                />
                {order.note && <PanelInfo icon={<NotebookPen className="h-5 w-5 text-slate-400" />} label="Ghi chú" value={order.note} accent />}
              </div>
              <div className="mt-6">
                <h4 className="mb-2 text-[13px] font-bold text-slate-800">Danh sách món</h4>
                <div className="overflow-hidden rounded-md border border-slate-200">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-slate-50 font-medium text-slate-400">
                      <tr>
                        <th className="px-3 py-2">Tên món</th>
                        <th className="px-3 py-2 text-center">SL</th>
                        <th className="px-3 py-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.items.map((it) => (
                        <tr key={it.id}>
                          <td className="px-3 py-2 font-medium text-slate-700">{it.name}</td>
                          <td className="px-3 py-2 text-center text-slate-600">{it.qty}</td>
                          <td className="px-3 py-2 text-right font-semibold text-slate-900">{formatCurrency(it.qty * it.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              <label className="mb-1 block text-[12.5px] font-semibold text-slate-600">Hình thức giao</label>
              <div className="relative mb-4">
                <select
                  value={method}
                  onChange={(e) => {
                    const m = e.target.value as DeliveryMethod;
                    setMethod(m);
                    if (m === 'GRAB' && !supported) setAreaAlert(true);
                  }}
                  className={rowInput + ' appearance-none pr-8 font-bold'}
                >
                  <option value="SELF">Nhà hàng tự giao</option>
                  <option value="GRAB">Grab Express</option>
                  <option value="AHAMOVE">AhaMove</option>
                  <option value="SHOPEE">ShopeeFood</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {isGrab ? (
                <div className="space-y-3.5">
                  <div className="mb-1">
                    <GrabExpressChip />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12.5px] font-semibold text-slate-600">Loại dịch vụ</label>
                    <input value={SERVICE_TYPE_DEFAULT} disabled className={rowInput + ' bg-slate-50 text-slate-500'} />
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-dashed border-amber-300 bg-amber-50/60 px-3 py-2.5">
                    <span className="flex items-center gap-2 text-[12px] font-medium text-amber-700">
                      <Info className="h-4 w-4" /> Demo: Grab không báo giá được
                    </span>
                    <button
                      type="button"
                      onClick={() => setSimNoQuote((v) => !v)}
                      className={`relative h-6 w-12 shrink-0 rounded-full transition-all ${simNoQuote ? 'bg-amber-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${simNoQuote ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600">
                      Phí GH trả đối tác <InfoTip text={MSG.feeHint} />
                    </label>
                    <div className="flex h-9 items-center justify-end rounded-md border border-slate-300 bg-slate-50 px-3">
                      {supported ? (
                        <span className="text-[13px] font-bold text-slate-800">{formatCurrency(partnerFee)}</span>
                      ) : (
                        <span className="text-[12px] font-semibold text-amber-600">Không báo giá được</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[12.5px] font-semibold text-slate-600">Phí GH thu khách</label>
                    <input
                      type="number"
                      value={feeCust}
                      onChange={(e) => setFeeCustomer(Number(e.target.value))}
                      className={rowInput + ' text-right font-bold'}
                    />
                  </div>

                  {connection.isConnected ? (
                    <div className="rounded-md bg-grab-light/50 px-3 py-2 text-[12px] text-grab">
                      Nhà hàng đã kết nối Grab Express — đơn sẽ vào <b>Chờ gửi đối tác</b> sau khi xác nhận.
                    </div>
                  ) : (
                    <div className="rounded-md bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
                      Chưa kết nối Grab Express (vào Web quản lý › Ứng dụng để kết nối).
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[13px] text-slate-500">
                  Hình thức <b>{METHOD_LABELS[method]}</b> — xử lý theo nghiệp vụ đối tác tương ứng.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 bg-[#f5f5f5] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[13px] font-bold text-slate-600">
              Còn phải thu <Info className="h-3.5 w-3.5 text-brand" />
            </span>
            <span className="text-[18px] font-black text-slate-900">{formatCurrency(total)}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onReject} className="h-9 flex-1 rounded-md border border-red-200 text-[12.5px] font-bold text-danger hover:bg-red-50">
              Từ chối
            </button>
            <button
              onClick={() => doConfirm(true)}
              className="h-9 flex-1 rounded-md border border-brand text-[12.5px] font-bold text-brand hover:bg-brand-light"
            >
              Xác nhận & Giao hàng
            </button>
            <button onClick={() => doConfirm(false)} className="h-9 flex-1 rounded-md bg-brand text-[12.5px] font-bold text-white hover:bg-brand-hover">
              Xác nhận
            </button>
          </div>
        </div>
      </div>

      <AlertPopup contained open={areaAlert} title="Khu vực chưa được hỗ trợ" message={MSG.areaNoQuote} onClose={() => setAreaAlert(false)} />
    </div>
  );
};

const PanelInfo: React.FC<{icon: React.ReactNode; label: string; value: string; accent?: boolean}> = ({icon, label, value, accent}) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-slate-50">{icon}</div>
    <div className="min-w-0">
      <p className="text-[11px] font-medium tracking-wide text-slate-400">{label}</p>
      <p className={`mt-0.5 text-[13px] font-semibold leading-relaxed ${accent ? 'italic text-blue-500' : 'text-slate-700'}`}>{value}</p>
    </div>
  </div>
);
