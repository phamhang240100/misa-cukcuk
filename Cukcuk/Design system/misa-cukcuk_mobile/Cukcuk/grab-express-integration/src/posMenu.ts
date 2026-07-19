export interface PosMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  emoji: string;
  tint: string; // gradient fallback
}

export const MENU_CATEGORIES = [
  'Hay dùng',
  'Cà phê',
  'Trà hoa quả',
  'Đá xay',
  'Đồ uống đóng chai',
  'Đồ ăn nhẹ',
];

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=320&h=240&fit=crop&auto=format&q=60`;

export const POS_MENU: PosMenuItem[] = [
  {id: 'cf1', name: 'Cà phê sữa đá', category: 'Cà phê', price: 29000, unit: 'Ly', image: u('1509042239860-f550ce710b93'), emoji: '☕', tint: 'from-amber-700 to-amber-900'},
  {id: 'cf2', name: 'Bạc xỉu', category: 'Cà phê', price: 32000, unit: 'Ly', image: u('1461023058943-07fcbe16d735'), emoji: '🥛', tint: 'from-amber-500 to-amber-700'},
  {id: 'cf3', name: 'Cà phê đen đá', category: 'Cà phê', price: 25000, unit: 'Ly', image: u('1514432324607-a09d9b4aefdd'), emoji: '☕', tint: 'from-neutral-700 to-neutral-900'},
  {id: 'cf4', name: 'Espresso', category: 'Cà phê', price: 35000, unit: 'Ly', image: u('1510591509098-f4fdc6d0ff04'), emoji: '☕', tint: 'from-yellow-800 to-neutral-900'},
  {id: 'cf5', name: 'Cappuccino', category: 'Cà phê', price: 39000, unit: 'Ly', image: u('1572442388796-11668a67e53d'), emoji: '☕', tint: 'from-amber-600 to-orange-800'},
  {id: 'cf6', name: 'Cold brew', category: 'Cà phê', price: 45000, unit: 'Ly', image: u('1517701550927-30cf4ba1dba5'), emoji: '🧊', tint: 'from-stone-700 to-stone-900'},
  {id: 'cf7', name: 'Latte', category: 'Cà phê', price: 42000, unit: 'Ly', image: u('1541167760496-1628856ab772'), emoji: '☕', tint: 'from-amber-400 to-amber-700'},
  {id: 'tr1', name: 'Trà đào cam sả', category: 'Trà hoa quả', price: 45000, unit: 'Ly', image: u('1556679343-c7306c1976bc'), emoji: '🍑', tint: 'from-orange-400 to-rose-500'},
  {id: 'tr2', name: 'Trà vải', category: 'Trà hoa quả', price: 42000, unit: 'Ly', image: u('1499638673689-79a0b5115d87'), emoji: '🧋', tint: 'from-rose-400 to-pink-600'},
  {id: 'tr3', name: 'Trà sen vàng', category: 'Trà hoa quả', price: 48000, unit: 'Ly', image: u('1558160074-4d7d8bdf4256'), emoji: '🍵', tint: 'from-lime-500 to-green-700'},
  {id: 'dx1', name: 'Đá xay matcha', category: 'Đá xay', price: 55000, unit: 'Ly', image: u('1515823662972-da6a2e4d3002'), emoji: '🍦', tint: 'from-green-400 to-emerald-700'},
  {id: 'dx2', name: 'Đá xay socola', category: 'Đá xay', price: 55000, unit: 'Ly', image: u('1481391319762-47dff72954d9'), emoji: '🍫', tint: 'from-amber-800 to-neutral-900'},
  {id: 'dc1', name: 'Coca Cola', category: 'Đồ uống đóng chai', price: 15000, unit: 'Chai', image: u('1554866585-cd94860890b7'), emoji: '🥤', tint: 'from-red-500 to-red-800'},
  {id: 'dc2', name: 'Nước suối Aquafina', category: 'Đồ uống đóng chai', price: 10000, unit: 'Chai', image: u('1560023907-5f339617ea30'), emoji: '💧', tint: 'from-sky-400 to-blue-600'},
  {id: 'an1', name: 'Bánh mì que', category: 'Đồ ăn nhẹ', price: 18000, unit: 'Phần', image: u('1509722747041-616f39b57569'), emoji: '🥖', tint: 'from-yellow-500 to-amber-700'},
  {id: 'an2', name: 'Khoai tây chiên', category: 'Đồ ăn nhẹ', price: 30000, unit: 'Phần', image: u('1573080496219-bb080dd4f877'), emoji: '🍟', tint: 'from-yellow-400 to-orange-600'},
  {id: 'an3', name: 'Bánh flan', category: 'Đồ ăn nhẹ', price: 20000, unit: 'Cái', image: u('1488477181946-6428a0291777'), emoji: '🍮', tint: 'from-amber-300 to-yellow-600'},
];
