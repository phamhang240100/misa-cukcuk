import { useState } from 'react';
import { INITIAL_ORDERS } from './data';
import { Order, AppView, OrderItem, OrderStatus } from './types';
import MainOrderView from './components/MainOrderView';
import DeliveryView from './components/DeliveryView';
import OrderOnlineView, { OnlineOrder, INITIAL_ONLINE_ORDERS, SHOPEE_LOGO, GRAB_LOGO } from './components/OrderOnlineView';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('main');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [onlineOrders, setOnlineOrders] = useState<OnlineOrder[]>(INITIAL_ONLINE_ORDERS);
  
  // Lifted states to synchronize navigation and notifications click
  const [shopeeActiveTab, setShopeeActiveTab] = useState<OrderStatus>('unconfirmed');
  const [shopeeSelectedOrderId, setShopeeSelectedOrderId] = useState<string | null>(null);
  const [grabActiveTab, setGrabActiveTab] = useState<OrderStatus>('unconfirmed');
  const [grabSelectedOrderId, setGrabSelectedOrderId] = useState<string | null>(null);
  const [pendingPaymentOrderCode, setPendingPaymentOrderCode] = useState<string | null>(null);

  // Stateful notification center initialized with existing unconfirmed orders
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 'notif-init-1',
      code: 'SPF-829103',
      text: 'Đơn hàng mới từ ShopeeFood (SPF-829103) - 140.000đ',
      orderId: 'oo-u1',
      channel: 'ShopeeFood',
      status: 'unconfirmed',
      timestamp: '16:07',
      read: false
    },
    {
      id: 'notif-init-2',
      code: 'GF-992104',
      text: 'Đơn hàng mới từ Grab (GF-992104) - 90.000đ',
      orderId: 'oo-u2',
      channel: 'Grab',
      status: 'unconfirmed',
      timestamp: '16:10',
      read: false
    },
    {
      id: 'notif-init-3',
      code: 'SPF-881205',
      text: 'Đơn hàng mới từ ShopeeFood (SPF-881205) - 70.000đ',
      orderId: 'oo-u3',
      channel: 'ShopeeFood',
      status: 'unconfirmed',
      timestamp: '16:12',
      read: false
    },
    {
      id: 'notif-init-4',
      code: 'SPF-773107',
      text: 'Đơn hàng mới từ ShopeeFood (SPF-773107) - 85.000đ',
      orderId: 'oo-u5',
      channel: 'ShopeeFood',
      status: 'unconfirmed',
      timestamp: '16:15',
      read: false
    }
  ]);

  const [toastMessage, setToastMessage] = useState<{
    id: string;
    text: string;
    code?: string;
    channel?: 'Grab' | 'ShopeeFood';
    type?: 'success' | 'info' | 'alert';
    onClick?: () => void;
  } | null>(null);

  // Derive unconfirmed counts matching the images
  const grabUnconfirmedCount = orders.filter(
    (order) => order.channel === 'Grab' && order.status === 'unconfirmed'
  ).length;

  const shopeeUnconfirmedCount = orders.filter(
    (order) => order.channel === 'ShopeeFood' && order.status === 'unconfirmed'
  ).length;

  const onlineUnconfirmedCount = onlineOrders.filter(
    (order) => order.status === 'unconfirmed'
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

  // Toast trigger helper
  const showToast = (
    text: string, 
    type: 'success' | 'info' | 'alert' = 'info', 
    channel?: 'Grab' | 'ShopeeFood',
    code?: string,
    onClick?: () => void
  ) => {
    const id = Date.now().toString();
    setToastMessage({ id, text, code, type, channel, onClick });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.id === id ? null : prev));
    }, 6000);
  };

  // Simulate a realistic new order
  const handleSimulateNewOrder = (requestedChannel?: 'Grab' | 'ShopeeFood') => {
    playPing();

    const channel = requestedChannel || (Math.random() < 0.5 ? 'ShopeeFood' : 'Grab');

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
        note: Math.random() < 0.35 ? dish.note : undefined
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
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();

    const orderTime = `${hours}:${minutes} - ${month}/${day}/${year}`;

    const recDate = new Date(now.getTime() + 45 * 60000);
    const recHours = recDate.getHours().toString().padStart(2, '0');
    const recMinutes = recDate.getMinutes().toString().padStart(2, '0');
    const recMonth = (recDate.getMonth() + 1).toString().padStart(2, '0');
    const recDay = recDate.getDate().toString().padStart(2, '0');
    const recYear = recDate.getFullYear();
    const receiveTime = `${recHours}:${recMinutes} - ${recMonth}/${recDay}/${recYear}`;

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

    // Also add to onlineOrders so it appears in the "Order Online" tab under "Chưa xác nhận"
    const newOnlineOrder: OnlineOrder = {
      id: `oo-${Date.now()}`,
      code,
      customerName: randomName,
      phone: randomPhone,
      address: randomAddress,
      orderTime,
      receiveTime,
      timeAgo: 'Vừa xong',
      itemsCountStr: `${selectedDishes.length} Món`,
      totalPriceStr: `${totalPrice.toLocaleString('vi-VN')} đ`,
      totalPriceNum: totalPrice,
      paymentMethod: 'Thanh toán qua ví điện tử',
      channel,
      status: 'unconfirmed',
      items: selectedDishes.map((d, index) => ({
        id: `ooi-${Date.now()}-${index}`,
        name: d.name,
        qtyStr: `${d.qty}`,
        totalPriceStr: `${d.totalPrice.toLocaleString('vi-VN')} đ`,
        note: d.note
      }))
    };
    setOnlineOrders((prev) => [newOnlineOrder, ...prev]);

    // Add to stateful notifications
    const newNotif = {
      id: `notif-${Date.now()}`,
      code,
      text: `Đơn hàng mới từ ${channel} (${code}) - ${totalPrice.toLocaleString('vi-VN')}đ`,
      orderId: newOnlineOrder.id,
      channel,
      status: 'unconfirmed',
      timestamp: `${hours}:${minutes}`,
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Show lightweight toast message
    showToast(
      `Có đơn hàng ${code} gửi từ ${channel === 'Grab' ? 'Grabfood' : 'ShopeeFood'}. Bấm vào đây để xác nhận đơn hàng của khách hàng.`,
      'info',
      channel,
      code,
      () => setCurrentView('orderonline')
    );
  };

  // Notification click handler
  const handleNotificationClick = (notif: any) => {
    setCurrentView('orderonline');
    if (notif.orderId) {
      setShopeeSelectedOrderId(notif.orderId);
      setGrabSelectedOrderId(notif.orderId);
    }
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
  };

  // Confirm order action (unconfirmed -> confirmed)
  const handleConfirmOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId) || onlineOrders.find((o) => o.id === orderId);
    const targetCode = targetOrder?.code;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || (targetCode && order.code === targetCode)) {
          // If a notification exists for this order, mark it as read and update its state status to confirmed
          setNotifications((prevNotif) =>
            prevNotif.map((n) => (n.orderId === order.id || n.code === targetCode) ? { ...n, read: true, status: 'confirmed' } : n)
          );
          return { ...order, status: 'confirmed' };
        }
        return order;
      })
    );

    setOnlineOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || (targetCode && o.code === targetCode)) {
          return {
            ...o,
            status: 'processing',
            partnerStatus: 'Quán đã xác nhận đơn'
          };
        }
        return o;
      })
    );
  };

  // Complete order action (confirmed -> completed)
  const handleCompleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const cleanId = orderId.startsWith('ord-') ? orderId.replace('ord-', '') : orderId;
      const exists = prev.some((o) => o.id === orderId || o.code === orderId || o.code === cleanId || o.id === cleanId);
      if (exists) {
        return prev.map((order) => {
          if (order.id === orderId || order.code === orderId || order.code === cleanId || order.id === cleanId) {
            setNotifications((prevNotif) =>
              prevNotif.map((n) => n.orderId === order.id || n.orderId === orderId ? { ...n, read: true, status: 'completed' } : n)
            );
            return { ...order, status: 'completed' };
          }
          return order;
        });
      }
      const isGrab = cleanId.toLowerCase().startsWith('grab');
      const newOrder: Order = {
        id: orderId,
        code: cleanId,
        channel: isGrab ? 'Grab' : 'ShopeeFood',
        itemsCount: 2,
        totalPrice: 180000,
        orderTime: '16:10',
        status: 'completed',
        customerPhone: '0321 236 528',
        customerName: 'Chị Thu',
        deliveryAddress: '22 Bis Nguyễn Thị Minh Khai, Đa Kao, Quận 1',
        driverName: 'Minh Ngọc',
        driverPhone: '0912 345 678',
        driverPlate: '29A-12345',
        driverStatus: 'Đã giao hàng',
        note: 'Vui lòng dùng lạnh / Giao hàng khách',
        items: [
          { id: 'item-1', name: 'Ngô chiên', originalPrice: 25000, qty: 1, totalPrice: 25000 },
          { id: 'item-2', name: 'Mỳ tôm xào bò', originalPrice: 75000, qty: 1, totalPrice: 75000 }
        ]
      };
      return [newOrder, ...prev];
    });
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
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast-notification-banner"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={() => {
              if (toastMessage.onClick) {
                toastMessage.onClick();
                setToastMessage(null);
              }
            }}
            className="fixed top-4 right-4 z-[100] bg-white text-gray-900 px-3.5 py-3 rounded-xl shadow-xl border border-gray-200/90 flex items-center gap-3 max-w-sm sm:max-w-md w-auto select-none cursor-pointer hover:shadow-2xl hover:border-gray-300 transition-all"
          >
            {/* Round Channel Logo */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-gray-100 bg-white shadow-xs">
              {toastMessage.channel ? (
                <img 
                  src={toastMessage.channel === 'Grab' ? GRAB_LOGO : SHOPEE_LOGO} 
                  alt={toastMessage.channel} 
                  className="w-full h-full object-cover shrink-0" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-amber-500 flex items-center justify-center text-white">
                  <BellRing className="w-5 h-5 shrink-0" />
                </div>
              )}
            </div>

            {/* Content Text */}
            <div className="flex-1 min-w-0 text-xs sm:text-[13px] leading-snug text-gray-800">
              {toastMessage.code ? (
                <>
                  Có đơn hàng <span className="font-bold text-black">{toastMessage.code}</span> gửi từ {toastMessage.channel === 'Grab' ? 'Grabfood' : 'ShopeeFood'}. Bấm vào đây để xác nhận đơn hàng của khách hàng.
                </>
              ) : (
                toastMessage.text
              )}
            </div>

            {/* Close Button */}
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setToastMessage(null);
              }} 
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition shrink-0 cursor-pointer ml-1 text-xs"
              title="Đóng"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container mirroring POS tablet system */}
      <main id="pos-screen" className="w-full h-full bg-white flex flex-col overflow-hidden shadow-2xl relative">
        {currentView === 'main' ? (
          <div key="main-view" className="w-full h-full flex flex-col">
            <MainOrderView
              grabUnconfirmedCount={grabUnconfirmedCount}
              shopeeUnconfirmedCount={shopeeUnconfirmedCount}
              onlineUnconfirmedCount={onlineUnconfirmedCount}
              onNavigateToView={(view) => setCurrentView(view)}
              onSimulateNewOrder={handleSimulateNewOrder}
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              confirmedOrders={orders.filter(o => o.status === 'confirmed')}
              onOpenDeliveryOrder={(code) => {
                setPendingPaymentOrderCode(code);
                setCurrentView('shopeefood');
              }}
            />
          </div>
        ) : currentView === 'orderonline' ? (
          <div key="orderonline-view" className="w-full h-full flex flex-col">
            <OrderOnlineView
              onBackToMain={() => setCurrentView('main')}
              onNavigateToView={(view) => setCurrentView(view)}
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              orders={onlineOrders}
              setOrders={setOnlineOrders}
              onConfirmAppOrder={handleConfirmOrder}
              grabUnconfirmedCount={grabUnconfirmedCount}
              shopeeUnconfirmedCount={shopeeUnconfirmedCount}
              onlineUnconfirmedCount={onlineUnconfirmedCount}
            />
          </div>
        ) : (
          <div key={`${currentView}-view`} className="w-full h-full flex flex-col">
            <DeliveryView
              channel={currentView === 'grab' ? 'Grab' : 'ShopeeFood'}
              orders={orders}
              onBackToMain={() => setCurrentView('main')}
              onNavigateToView={(view) => setCurrentView(view)}
              onConfirmOrder={handleConfirmOrder}
              onCompleteOrder={handleCompleteOrder}
              onDeleteOrder={handleDeleteOrder}
              initialShowDeliveryBook={currentView === 'deliveryBook'}
              
              activeTab={currentView === 'grab' ? grabActiveTab : shopeeActiveTab}
              setActiveTab={currentView === 'grab' ? setGrabActiveTab : setShopeeActiveTab}
              selectedOrderId={currentView === 'grab' ? grabSelectedOrderId : shopeeSelectedOrderId}
              setSelectedOrderId={currentView === 'grab' ? setGrabSelectedOrderId : setShopeeSelectedOrderId}
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onlineUnconfirmedCount={onlineUnconfirmedCount}
              grabUnconfirmedCount={grabUnconfirmedCount}
              shopeeUnconfirmedCount={shopeeUnconfirmedCount}
              initialPaymentOrderCode={pendingPaymentOrderCode}
              onClearInitialPaymentOrderCode={() => setPendingPaymentOrderCode(null)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
