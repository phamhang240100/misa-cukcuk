import React, {useMemo, useState} from 'react';
import {Bell, Globe, Monitor, NotebookText} from 'lucide-react';
import type {
  AppNotification,
  ConnectionState,
  DeliveryOrder,
  Surface,
} from './types';
import {INITIAL_CONNECTION, INITIAL_ORDERS} from './data';
import {GrabExpressMark, ToastHost, useToasts} from './components/ui';
import {WebConnectSurface} from './surfaces/WebConnectSurface';
import {PosOrderSurface} from './surfaces/PosOrderSurface';
import {DeliveryBookSurface} from './surfaces/DeliveryBookSurface';

const SURFACES: {id: Surface; label: string; sub: string; icon: React.ReactNode}[] = [
  {id: 'web', label: 'Web quản lý', sub: 'Ứng dụng › Grab Express', icon: <Globe size={16} />},
  {id: 'pos', label: 'POS bán hàng', sub: 'Order & Giao hàng', icon: <Monitor size={16} />},
  {id: 'book', label: 'Sổ giao hàng', sub: 'Tab Grab Express', icon: <NotebookText size={16} />},
];

export default function App() {
  const [surface, setSurface] = useState<Surface>('web');
  const [connection, setConnection] = useState<ConnectionState>(INITIAL_CONNECTION);
  const [orders, setOrders] = useState<DeliveryOrder[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const {toasts, push, dismiss} = useToasts();

  const unread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const dataSurface = surface === 'web' ? 'web' : 'pos';

  return (
    <div data-surface={dataSurface} className="flex h-screen flex-col overflow-hidden bg-[#f0f2f4]">
      {/* Prototype top bar — chuyển bề mặt */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-neutral-light bg-white px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-3">
            <GrabExpressMark size={26} showText={false} />
            <div className="leading-tight">
              <div className="text-[13px] font-bold text-text-primary">
                CukCuk <span className="text-grab">×</span> Grab Express
              </div>
              <div className="text-[11px] text-text-hint">Prototype luồng tích hợp · C86574</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 rounded-xl bg-[#f0f2f4] p-1">
            {SURFACES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSurface(s.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  surface === s.id
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold md:inline-flex ${
              connection.isConnected
                ? 'bg-grab-light text-grab'
                : 'bg-gray-100 text-text-secondary'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connection.isConnected ? 'bg-grab' : 'bg-gray-400'
              }`}
            />
            {connection.isConnected ? 'Đã kết nối GE' : 'Chưa kết nối GE'}
          </span>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-icon-neutral hover:bg-gray-100">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden">
        {surface === 'web' && (
          <WebConnectSurface
            connection={connection}
            setConnection={setConnection}
            orders={orders}
            pushToast={push}
          />
        )}
        {surface === 'pos' && (
          <PosOrderSurface
            connection={connection}
            orders={orders}
            setOrders={setOrders}
            pushToast={push}
            goToBook={() => setSurface('book')}
          />
        )}
        {surface === 'book' && (
          <DeliveryBookSurface
            connection={connection}
            orders={orders}
            setOrders={setOrders}
            notifications={notifications}
            setNotifications={setNotifications}
            pushToast={push}
          />
        )}
      </main>

      <ToastHost toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
