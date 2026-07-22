import { useState } from 'react';
import { INITIAL_ORDERS } from './data';
import { Order, AppView, OrderItem, OrderStatus } from './types';
import MainOrderView from './components/MainOrderView';
import DeliveryView from './components/DeliveryView';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, PlusCircle, BellRing, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('main');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  
  // Lifted states to synchronize navigation and notifications click
  const [shopeeActiveTab, setShopeeActiveTab] = useState<OrderStatus>('unconfirmed');
  const [shopeeSelectedOrderId, setShopeeSelectedOrderId] = useState<string | null>(null);
  const [grabActiveTab, setGrabActiveTab] = useState<OrderStatus>('unconfirmed');
  const [grabSelectedOrderId, setGrabSelectedOrderId] = useState<string | null>(null);

  // Stateful notification center
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 'init-notif-1',
      text: 'Có đơn hàng SPF-901 gửi từ ShopeeFood. Bấm vào để xác nhận đơn hàng của khách hàng',
      orderId: 's-1',
      channel: 'ShopeeFood',
      status: 'unconfirmed',
      timestamp: '10:15 SA',
      read: false
    }
  ]);

  const [toastMessage, setToastMessage] = useState<{
    id: string;
    text: string;
    type: 'success' | 'info' | 'alert';
    onClick?: () => void;
  } | null>(null);

  // Derive unconfirmed counts matching the images
  const grabUnconfirmedCount = orders.filter(
    (order) => order.channel === 'Grab' && order.status === 'unconfirmed'
  ).length;

  const shopeeUnconfirmedCount = orders.filter(
    (order) => order.channel === 'ShopeeFood' && order.status === 'unconfirmed'
  ).length;

  // Sound cue or custom animation trigger for simulations
  const playPing = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio context block safeguard
    }
  };

  // Toast trigger helper with click action support
  const showToast = (
    text: string, 
    type: 'success' | 'info' | 'alert' = 'success', 
    onClick?: () => void
  ) => {
    const id = Date.now().toString();
    setToastMessage({ id, text, type, onClick });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.id === id ? null : prev));
    }, 8000); // Keep open a bit longer for readability
  };

  // Simulate a realistic new order
  const handleSimulateNewOrder = (channel: 'Grab' | 'ShopeeFood') => {
    playPing();

    const dishes = [
      { name: 'Cơm tấm sườn bì chả đặc biệt', price: 65000, note: 'Nước mắm nhiều ngọt' },
      { name: 'Phở bò tái lăn Hà Nội', price: 55000, note: 'Ít hành lá, nhiều tương ớt' },
      { name: 'Bún chả Hà Nội đặc sản', price: 60000, note: 'Thêm tỏi băm nhuyễn' },
      { name: 'Nem rán giòn rụm (cái)', price: 15000, note: 'Hạn chế dầu mỡ' },
      { name: 'Bánh mì thịt nướng sả', price: 35000, note: 'Không ăn rau mùi' },
      { name: 'Trà tắc khổng lồ', price: 20000, note: 'Ít đường nhiều đá' },
      { name: 'Lẩu nấm gà ta', price: 380000, note: 'Nấm tươi tổng hợp nhúng lẩu' }
    ];

    // Pick 1 to 3 random dishes
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedDishes: OrderItem[] = [];
    let totalPrice = 0;

    for (let i = 0; i < numItems; i++) {
      const dish = dishes[Math.floor(Math.random() * dishes.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      const id = `${channel.toLowerCase()}-item-${Date.now()}-${i}`;
      const itemTotal = dish.price * qty;
      selectedDishes.push({
        id,
        name: dish.name,
        originalPrice: dish.price,
        qty,
        totalPrice: itemTotal,
        note: dish.note
      });
      totalPrice += itemTotal;
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const code = channel === 'Grab' ? `GF-${randomSuffix}` : `SPF-${randomSuffix}`;

    const VN_FIRST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Huỳnh', 'Phan', 'Võ'];
    const VN_MID_NAMES = ['Văn', 'Thị', 'Quốc', 'Thành', 'Minh', 'Đăng', 'Ngọc'];
    const VN_LAST_NAMES = ['Hùng', 'Hải', 'Lan', 'Nam', 'An', 'Bảo', 'Vy', 'Sơn'];

    const randomName = `${VN_FIRST_NAMES[Math.floor(Math.random() * VN_FIRST_NAMES.length)]} ${VN_MID_NAMES[Math.floor(Math.random() * VN_MID_NAMES.length)]} ${VN_LAST_NAMES[Math.floor(Math.random() * VN_LAST_NAMES.length)]}`;
    const randomPhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;

    const addresses = [
      '12D Điện Biên Phủ, Quận Bình Thạnh',
      '234 Trần Hưng Đạo, Quận 1',
      '45 Nguyễn Văn Cừ, Quận 5',
      '89 Lê Văn Sỹ, Quận Phú Nhuận',
      '105 Võ Văn Tần, Quận 3',
      '55 Song Hành, Quận 2'
    ];
    const randomAddress = `${addresses[Math.floor(Math.random() * addresses.length)]}, TP. Hồ Chí Minh`;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'CH' : 'SA';
    const cleanHours = hours % 12 || 12;
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const orderTime = `${cleanHours.toString().padStart(2, '0')}:${minutes} ${ampm} - ${dateStr}`;

    const newOrder: Order = {
      id: `sim-${Date.now()}`,
      code,
      channel,
      itemsCount: selectedDishes.length,
      totalPrice,
      orderTime,
      status: 'unconfirmed',
      customerPhone: randomPhone,
      deliveryAddress: randomAddress,
      driverName: `${randomName} (${channel})`,
      driverPhone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      items: selectedDishes,
      note: channel === 'ShopeeFood' ? 'Giao đơn hàng nhanh, đóng gói cẩn thận.' : undefined,
      subtotalDiscounted: Math.round(totalPrice * 0.95),
      billDiscount: Math.round(totalPrice * 0.05),
      deliveryFee: 15000,
      platformFee: 4000,
      driverTip: 2000
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Add to stateful notifications
    const newNotif = {
      id: `notif-${Date.now()}`,
      text: `Có đơn hàng ${code} gửi từ ${channel}. Bấm vào để xác nhận đơn hàng của khách hàng`,
      orderId: newOrder.id,
      channel,
      status: 'unconfirmed',
      timestamp: `${cleanHours.toString().padStart(2, '0')}:${minutes} ${ampm}`,
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Handle toast click action to select the order directly
    const handleToastClick = () => {
      setCurrentView(channel.toLowerCase() as AppView);
      if (channel === 'ShopeeFood') {
        setShopeeActiveTab('unconfirmed');
        setShopeeSelectedOrderId(newOrder.id);
      } else {
        setGrabActiveTab('unconfirmed');
        setGrabSelectedOrderId(newOrder.id);
      }
      setToastMessage(null);
    };

    showToast(
      `Có đơn hàng ${code} gửi từ ${channel}. Bấm vào để xác nhận đơn hàng của khách hàng`,
      'info',
      handleToastClick
    );
  };

  // Notification click handler
  const handleNotificationClick = (notif: any) => {
    setCurrentView(notif.channel.toLowerCase() as AppView);
    if (notif.channel === 'ShopeeFood') {
      setShopeeActiveTab(notif.status);
      setShopeeSelectedOrderId(notif.orderId);
    } else {
      setGrabActiveTab(notif.status);
      setGrabSelectedOrderId(notif.orderId);
    }
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
  };

  // Confirm order action (unconfirmed -> confirmed)
  const handleConfirmOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          // If a notification exists for this order, mark it as read and update its state status to confirmed
          setNotifications((prevNotif) =>
            prevNotif.map((n) => n.orderId === orderId ? { ...n, read: true, status: 'confirmed' } : n)
          );
          return { ...order, status: 'confirmed' };
        }
        return order;
      })
    );
  };

  // Complete order action (confirmed -> completed)
  const handleCompleteOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          showToast(`🌟 Đơn hàng ${order.code} đã hoàn thành và giao đi!`, 'success');
          // Update notification status
          setNotifications((prevNotif) =>
            prevNotif.map((n) => n.orderId === orderId ? { ...n, read: true, status: 'completed' } : n)
          );
          return { ...order, status: 'completed' };
        }
        return order;
      })
    );
  };

  // Delete/Reject option (updates to 'cancelled' so they show in Completed tab as specified by brief)
  const handleDeleteOrder = (orderId: string, reason?: string) => {
    const orderToDel = orders.find((o) => o.id === orderId);
    if (!orderToDel) return;
    
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: 'cancelled' };
        }
        return order;
      })
    );
    // Update notification status
    setNotifications((prevNotif) =>
      prevNotif.map((n) => n.orderId === orderId ? { ...n, read: true, status: 'cancelled' } : n)
    );
    showToast(`❌ Đã từ chối đơn hàng ${orderToDel.code}${reason ? `: ${reason}` : ''}!`, 'alert');
  };

  return (
    <div id="app-viewport-wrapper" className="h-screen w-screen bg-[#10141d] flex items-center justify-center overflow-hidden font-sans">
      
      {/* Toast Notification overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast-notification-banner"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            onClick={() => {
              if (toastMessage.onClick) {
                toastMessage.onClick();
              }
            }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow-2xl border flex items-center gap-3 w-max max-w-lg cursor-pointer hover:brightness-110 active:scale-[0.98] transition ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 border-emerald-600 text-emerald-100'
                : toastMessage.type === 'alert'
                ? 'bg-rose-950 border-rose-700 text-rose-100'
                : 'bg-blue-950 border-blue-700 text-blue-100'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'alert' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toastMessage.type === 'info' && <BellRing className="w-5 h-5 text-sky-400 shrink-0 animate-bounce" />}
            
            <div className="flex-1 text-xs font-semibold leading-relaxed" id="toast-text-content">
              {toastMessage.text}
              {toastMessage.onClick && (
                <span className="block text-[10px] text-sky-300 font-bold underline mt-1">Bấm vào đây để xem chi tiết &gt;&gt;</span>
              )}
            </div>
            
            <button 
              id="close-toast-btn"
              onClick={(e) => {
                e.stopPropagation();
                setToastMessage(null);
              }} 
              className="text-white/40 hover:text-white/80 transition text-sm ml-2 font-bold focus:outline-none"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container mirroring POS tablet system */}
      <main id="pos-screen" className="w-full h-full bg-white flex flex-col overflow-hidden shadow-2xl relative">
        <AnimatePresence mode="wait">
          {currentView === 'main' ? (
            <motion.div
              key="main-view-anim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col"
            >
              <MainOrderView
                orders={orders}
                grabUnconfirmedCount={grabUnconfirmedCount}
                shopeeUnconfirmedCount={shopeeUnconfirmedCount}
                onNavigateToView={(view) => setCurrentView(view)}
                onSimulateNewOrder={handleSimulateNewOrder}
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
                onConfirmOrder={handleConfirmOrder}
                onCompleteOrder={handleCompleteOrder}
                onDeleteOrder={handleDeleteOrder}
                setShopeeSelectedOrderId={setShopeeSelectedOrderId}
                setGrabSelectedOrderId={setGrabSelectedOrderId}
                setShopeeActiveTab={setShopeeActiveTab}
                setGrabActiveTab={setGrabActiveTab}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`${currentView}-view-anim`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full h-full flex flex-col"
            >
              <DeliveryView
                channel={currentView === 'grab' ? 'Grab' : 'ShopeeFood'}
                orders={orders}
                onBackToMain={() => setCurrentView('main')}
                onConfirmOrder={handleConfirmOrder}
                onCompleteOrder={handleCompleteOrder}
                onDeleteOrder={handleDeleteOrder}
                
                activeTab={currentView === 'grab' ? grabActiveTab : shopeeActiveTab}
                setActiveTab={currentView === 'grab' ? setGrabActiveTab : setShopeeActiveTab}
                selectedOrderId={currentView === 'grab' ? grabSelectedOrderId : shopeeSelectedOrderId}
                setSelectedOrderId={currentView === 'grab' ? setGrabSelectedOrderId : setShopeeSelectedOrderId}
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
