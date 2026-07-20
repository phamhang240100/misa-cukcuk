import React from 'react';
import {Bike, MapPin, Phone, Store, X} from 'lucide-react';
import type {DeliveryOrder} from '../types';
import {GE_STATUS} from '../constants';

// ---------------------------------------------------------------------------
// Bản đồ lộ trình + vị trí tài xế (mock tĩnh) — mở khi double-click đơn đang
// giao trong Sổ giao hàng (yêu cầu update Google Doc). Dùng chung tablet + PC.
// ---------------------------------------------------------------------------

// Vị trí driver dọc tuyến đường theo trạng thái GE (0 = còn ở quán, 1 = đã tới khách).
const PROGRESS_BY_STATUS: Record<string, number> = {
  ALLOCATING: 0,
  PENDING_PICKUP: 0.06,
  PICKING_UP: 0.14,
  PENDING_DROP_OFF: 0.55,
  IN_DELIVERY: 0.72,
  COMPLETED: 1,
  IN_RETURN: 0.4,
  RETURNED: 0.05,
};

// Đường cong minh họa (toạ độ trong viewBox 0 0 600 360)
const ROUTE_PATH = 'M 90 280 C 180 220, 200 120, 300 150 S 460 260, 520 90';

const pointOnCubic = (
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number,
): [number, number] => {
  const mt = 1 - t;
  const x =
    mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0];
  const y =
    mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1];
  return [x, y];
};

// Xấp xỉ vị trí trên đường cong ghép 2 đoạn Bezier của ROUTE_PATH (đủ cho mock trực quan).
const driverPosition = (t: number): [number, number] => {
  if (t <= 0.5) {
    const local = t / 0.5;
    return pointOnCubic([90, 280], [180, 220], [200, 120], [300, 150], local);
  }
  const local = (t - 0.5) / 0.5;
  return pointOnCubic([300, 150], [340, 175], [460, 260], [520, 90], local);
};

export const DriverMapMock: React.FC<{
  order: DeliveryOrder;
  onClose: () => void;
  contained?: boolean;
}> = ({order, onClose, contained = false}) => {
  const geStatus = order.geStatus;
  const t = geStatus ? PROGRESS_BY_STATUS[geStatus] ?? 0.5 : 0.5;
  const [dx, dy] = driverPosition(t);
  const statusInfo = geStatus ? GE_STATUS[geStatus] : undefined;
  const fullAddress = [order.address.freetext, order.address.ward, order.address.district, order.address.province]
    .filter(Boolean)
    .join(', ');

  return (
    <div className={`${contained ? 'absolute' : 'fixed'} inset-0 z-[90] flex items-center justify-center p-4`}>
      <div className="absolute inset-0 bg-slate-900/50 animate-fade-in" onClick={onClose} />
      <div className="animate-scale-up relative flex w-full max-w-[820px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800">Lộ trình giao hàng</h3>
            <div className="text-[12px] text-slate-400">
              {order.trackingNo ?? '—'} · {order.invoiceNo ?? order.orderNo}
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {/* Map mock */}
        <div className="relative h-[360px] w-full overflow-hidden bg-[#dbe7ef]">
          <svg viewBox="0 0 600 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="#c7d7e0" strokeWidth="1" />
              </pattern>
              <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e4edf3" />
                <stop offset="100%" stopColor="#cfe0e9" />
              </linearGradient>
            </defs>
            <rect width="600" height="360" fill="url(#mapBg)" />
            <rect width="600" height="360" fill="url(#grid)" />
            {/* vài khối "công trình" minh họa cho có cảm giác bản đồ */}
            {[
              [40, 40, 90, 60],
              [420, 30, 110, 70],
              [30, 250, 80, 70],
              [230, 260, 100, 60],
              [470, 200, 90, 90],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx={6} fill="#ffffff" opacity={0.55} />
            ))}
            {/* Tuyến đường */}
            <path d={ROUTE_PATH} fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
            <path
              d={ROUTE_PATH}
              fill="none"
              stroke="#00B14F"
              strokeWidth="4"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            {/* Marker quán */}
            <g transform="translate(90,280)">
              <circle r="16" fill="#245FDF" />
              <circle r="16" fill="none" stroke="#fff" strokeWidth="3" />
            </g>
            {/* Marker khách hàng */}
            <g transform="translate(520,90)">
              <circle r="16" fill="#101828" />
              <circle r="16" fill="none" stroke="#fff" strokeWidth="3" />
            </g>
            {/* Marker tài xế (di động theo % tiến trình) */}
            <g transform={`translate(${dx},${dy})`}>
              <circle r="22" fill="#00B14F" opacity="0.18">
                <animate attributeName="r" values="16;26;16" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.28;0;0.28" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle r="14" fill="#00B14F" stroke="#fff" strokeWidth="3" />
            </g>
          </svg>

          {/* Icon overlay (lucide, đặt đè lên marker svg) */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white"
              style={{left: `${(90 / 600) * 100}%`, top: `${(280 / 360) * 100}%`}}
            >
              <Store size={13} />
            </div>
            <div
              className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white"
              style={{left: `${(520 / 600) * 100}%`, top: `${(90 / 360) * 100}%`}}
            >
              <MapPin size={13} />
            </div>
            <div
              className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white"
              style={{left: `${(dx / 600) * 100}%`, top: `${(dy / 360) * 100}%`}}
            >
              <Bike size={14} />
            </div>
          </div>

          {/* Nhãn 2 đầu tuyến */}
          <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow">
            Nhà hàng Phở Thìn 13 Lò Đúc
          </div>
          <div className="absolute right-3 top-3 max-w-[220px] rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow">
            {order.customerName} · {fullAddress}
          </div>
        </div>

        {/* Info tài xế */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-grab-light text-grab">
              <Bike size={20} />
            </div>
            <div>
              <div className="text-[13px] font-bold text-slate-800">
                {order.driverName ?? 'Đang tìm tài xế'}
              </div>
              <div className="text-[12px] text-slate-400">
                {order.driverPhone ?? 'Chưa có SĐT tài xế'} · {statusInfo?.label ?? 'Chưa gửi đối tác'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {order.driverPhone && (
              <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[12.5px] font-semibold text-slate-600">
                <Phone size={13} /> {order.driverPhone}
              </span>
            )}
            <span className="rounded-lg bg-brand-light px-3 py-2 text-[12.5px] font-semibold text-brand">
              Giờ hẹn trả: {order.scheduledTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
