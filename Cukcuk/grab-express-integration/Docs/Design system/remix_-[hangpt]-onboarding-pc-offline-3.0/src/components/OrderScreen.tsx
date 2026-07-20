import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  Plus, 
  Minus,
  Menu, 
  Globe, 
  Cloud, 
  RefreshCw, 
  FileText, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ChevronsUp, 
  ChevronsDown,
  User,
  X,
  HelpCircle, Info,
  Clock,
  Printer,
  FileSpreadsheet,
  Check,
  Trash2,
  Bell,
  CloudDownload,
  ArrowLeftRight,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Gift,
  Heart,
  Wine,
  LayoutGrid,
  Puzzle,
  Banknote,
  CreditCard,
  QrCode,
  Lightbulb
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
  isSent?: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  tableName: string;
  customerCount: number;
  items: OrderItem[];
  totalAmount: number;
  status: "Chờ thanh toán" | "Mang về" | "Chờ giao hàng" | "Đặt trước";
  createdAt: string;
}

interface OrderScreenProps {
  onBackToPrinter: () => void;
  onLogout: () => void;
  onGoToServer: () => void;
  setToast: (val: { message: string; type: "success" | "error" | "info" } | null) => void;
}

interface MenuItem {
  id: string;
  name: string;
  category: "Lẩu" | "Món chính" | "Khai vị" | "Bia & Đồ uống" | "Rau & Canh";
  type: "Đồ ăn" | "Đồ uống";
  unit: string;
  price: number;
  image?: string;
}

const PHONG_DE_MENU: MenuItem[] = [
  { id: "MA01", name: "Lẩu dê Phong Dê đặc biệt", category: "Lẩu", type: "Đồ ăn", unit: "Nồi", price: 390000, image: "/src/assets/images/regenerated_image_1783583693651.png" },
  { id: "MA02", name: "Dê tái chanh Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 185000, image: "/src/assets/images/regenerated_image_1783581864584.png" },
  { id: "MA03", name: "Dê nướng tảng Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 250000, image: "/src/assets/images/de_nuong_tang_1783583413302.jpg" },
  { id: "MA04", name: "Đùi dê đút lò Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Cái", price: 1200000, image: "/src/assets/images/dui_de_dut_lo_1783583430431.jpg" },
  { id: "MA05", name: "Cơm cháy sốt dê Phong Dê", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 95000, image: "/src/assets/images/com_chay_sot_de_1783583443739.jpg" },
  { id: "MA06", name: "Gỏi tai dê Phong Dê", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 120000, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" },
  { id: "MA07", name: "Súp dê hầm sâm Phong Dê", category: "Khai vị", type: "Đồ ăn", unit: "Bát", price: 65000, image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80" },
  { id: "MA08", name: "Dê xào lăn Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 175000, image: "/src/assets/images/regenerated_image_1783583695434.png" },
  { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Ly", price: 20000, image: "/src/assets/images/bia_hoi_ha_noi_1783583470681.jpg" },
  { id: "DU02", name: "Bia tươi Tiger Draft (Ly 330ml)", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Ly", price: 35000, image: "/src/assets/images/regenerated_image_1783584880279.png" },
  { id: "DU03", name: "Rượu mơ Yên Tử hảo hạng", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Chai", price: 180000, image: "/src/assets/images/regenerated_image_1783584883757.png" },
  { id: "DU04", name: "Nước suối Aquafina 500ml", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Chai", price: 15000, image: "https://images.unsplash.com/photo-1608885898957-a599fb1b1494?auto=format&fit=crop&w=300&q=80" },
  { id: "MA09", name: "Chả dê nướng mỡ chài Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 180000, image: "https://images.unsplash.com/photo-1532636875304-0c8fe1197e14?auto=format&fit=crop&w=300&q=80" },
  { id: "MA10", name: "Dê né tỏi bản gang Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 195000, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80" },
  { id: "MA11", name: "Nầm dê nướng chao Phong Dê", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 190000, image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=300&q=80" },
  { id: "MA12", name: "Dê hấp tỏi sả Phong Dê", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 180000, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=80" },
  { id: "MA13", name: "Cháo dê đỗ xanh Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Tô", price: 75000, image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=300&q=80" },
  { id: "MA14", name: "Tiết canh dê Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Bát", price: 35000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80" },
  { id: "MA15", name: "Dê chao dầu vừng Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 175000, image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=300&q=80" },
  { id: "MA16", name: "Gỏi thịt dê hành tây Phong Dê", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 130000, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80" },
  { id: "MA17", name: "Lẩu dê nhúng mẻ Phong Dê", category: "Lẩu", type: "Đồ ăn", unit: "Nồi", price: 380000, image: "https://images.unsplash.com/photo-1547928576-a4a33237ecd3?auto=format&fit=crop&w=300&q=80" },
  { id: "DU05", name: "Bia chai Heineken Silver", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Chai", price: 28000, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=300&q=80" },
  { id: "DU06", name: "Bia chai Saigon Special", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Chai", price: 22000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=300&q=80" },
  { id: "DU07", name: "Nước ngọt Coca-Cola lon", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Lon", price: 20000, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80" },
  { id: "MA18", name: "Đậu phộng rang tỏi ớt", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 25000, image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=300&q=80" },
  { id: "MA19", name: "Dê ủ trấu bản xứ", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 210000, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80" },
  { id: "MA20", name: "Lẩu cua đồng bắp bò", category: "Lẩu", type: "Đồ ăn", unit: "Nồi", price: 350000, image: "https://images.unsplash.com/photo-1547928576-a4a33237ecd3?auto=format&fit=crop&w=300&q=80" },
  { id: "MA21", name: "Gà rang muối hạt", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 220000, image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=300&q=80" },
  { id: "MA22", name: "Khoai tây chiên bơ tỏi", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 45000, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80" },
  { id: "MA23", name: "Ngô chiên bơ giòn", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 45000, image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=300&q=80" },
  { id: "MA24", name: "Đậu hũ chiên sả ớt", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 50000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80" },
  { id: "MA25", name: "Sườn sụn rang muối", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 165000, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80" },
  { id: "MA26", name: "Ếch xào măng cay", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 150000, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=300&q=80" },
  { id: "MA27", name: "Mực trứng hấp hành gừng", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 220000, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=300&q=80" },
  { id: "MA28", name: "Tôm nướng muối ớt", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 240000, image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=300&q=80" },
  { id: "MA29", name: "Cá quả nướng mọi", category: "Món chính", type: "Đồ ăn", unit: "Con", price: 320000, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=300&q=80" },
  { id: "MA30", name: "Cá lăng nướng riềng mẻ", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 280000, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=300&q=80" },
  { id: "MA31", name: "Chân gà chiên mắm", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 95000, image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=300&q=80" },
  { id: "MA32", name: "Sụn gà rang muối", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 120000, image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=300&q=80" },
  { id: "MA33", name: "Lòng dê xào khế chua", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 140000, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=300&q=80" },
  { id: "MA34", name: "Dồi dê nướng thơm", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 120000, image: "https://images.unsplash.com/photo-1532636875304-0c8fe1197e14?auto=format&fit=crop&w=300&q=80" },
  { id: "MA35", name: "Dê nướng mọi mật ong", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 230000, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80" },
  { id: "MA36", name: "Rau muống xào tỏi", category: "Rau & Canh", type: "Đồ ăn", unit: "Đĩa", price: 45000, image: "/src/assets/images/regenerated_image_1783584886235.png" },
  { id: "MA37", name: "Cải ngồng luộc chấm trứng", category: "Rau & Canh", type: "Đồ ăn", unit: "Đĩa", price: 50000, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" },
  { id: "MA38", name: "Mướp đắng ruốc đá", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 55000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80" },
  { id: "MA39", name: "Kim chi cải thảo", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 25000, image: "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&w=300&q=80" },
  { id: "MA40", name: "Cơm chiên tỏi trứng", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 65000, image: "https://images.unsplash.com/photo-1603133872878-68550a5e2b6a?auto=format&fit=crop&w=300&q=80" },
  { id: "MA41", name: "Cơm chiên hải sản", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 120000, image: "https://images.unsplash.com/photo-1603133872878-68550a5e2b6a?auto=format&fit=crop&w=300&q=80" },
  { id: "MA42", name: "Mì xào bò rau cải", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 95000, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80" },
  { id: "MA43", name: "Miến xào lòng mề dê", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 95000, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80" },
  { id: "DU08", name: "Bia chai 333", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Chai", price: 18000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=300&q=80" },
  { id: "DU09", name: "Rượu táo mèo Tây Bắc", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Chai", price: 150000, image: "https://images.unsplash.com/photo-1528258339107-546cc29af377?auto=format&fit=crop&w=300&q=80" },
  { id: "DU10", name: "Rượu nếp cái hoa vàng", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Chai", price: 120000, image: "https://images.unsplash.com/photo-1528258339107-546cc29af377?auto=format&fit=crop&w=300&q=80" },
  { id: "DU11", name: "Nước cam ép nguyên chất", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Ly", price: 40000, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=300&q=80" },
  { id: "DU12", name: "Nước dừa xiêm tươi", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Quả", price: 35000, image: "https://images.unsplash.com/photo-1525385312-70c874df105c?auto=format&fit=crop&w=300&q=80" },
  { id: "DU13", name: "Trà đá Hà Nội", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Ly", price: 5000, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&q=80" },
  { id: "DU14", name: "Chanh leo tuyết đá", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Ly", price: 30000, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80" },
  { id: "DU15", name: "Sinh tố bơ béo ngậy", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Ly", price: 45000, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" },
  { id: "DU16", name: "Sinh tố xoài cát thơm", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Ly", price: 40000, image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=300&q=80" },
  { id: "DU17", name: "Trà sữa trân châu truyền thống", category: "Bia & Đồ uống", type: "Đồ uống", unit: "Ly", price: 35000, image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=300&q=80" },
  { id: "MA44", name: "Lẩu thái hải sản chua cay", category: "Lẩu", type: "Đồ ăn", unit: "Nồi", price: 380000, image: "https://images.unsplash.com/photo-1547928576-a4a33237ecd3?auto=format&fit=crop&w=300&q=80" },
  { id: "MA45", name: "Gỏi sứa tai heo đu đủ", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 110000, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" },
  { id: "MA46", name: "Khoai lang kén chiên", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 40000, image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=300&q=80" },
  { id: "MA47", name: "Salad hoàng đế sốt mè", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 75000, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=300&q=80" },
  { id: "MA48", name: "Nộm bò khô đu đủ", category: "Khai vị", type: "Đồ ăn", unit: "Đĩa", price: 85000, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" },
  { id: "MA49", name: "Đậu hũ Tứ Xuyên cay nồng", category: "Món chính", type: "Đồ ăn", unit: "Đĩa", price: 90000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80" },
  { id: "MA50", name: "Nấm đùi gà xào tỏi", category: "Rau & Canh", type: "Đồ ăn", unit: "Đĩa", price: 70000, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" },
  { id: "MA51", name: "Canh chua thịt băm hành hoa", category: "Rau & Canh", type: "Đồ ăn", unit: "Bát", price: 60000, image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80" }
];

// Helper to parse "Bàn 101" to short format "1.1"
const getShortTableName = (tableName: string) => {
  if (!tableName) return "Mang về";
  if (tableName === "Mang về") return "Mang về";
  const match = tableName.match(/\d+/);
  if (match) {
    const numStr = match[0];
    if (numStr.length >= 3) {
      const floor = numStr[0];
      const table = parseInt(numStr.slice(1), 10);
      return `${floor}.${table}`;
    }
    return numStr;
  }
  return tableName;
};

// Format currency with three decimal places exactly like in the MISA CUKCUK mockup
const formatMisaMoney = (amount: number) => {
  const formatted = new Intl.NumberFormat("vi-VN").format(amount);
  return `${formatted},000`;
};

// Seeding 29 "Chờ thanh toán", 5 "Mang về", 29 "Chờ giao hàng" to precisely match the mockup
const generateInitialOrders = (): Order[] => {
  const list: Order[] = [];
  
  // Seed the exact ones visible in the screenshot
  const visibleCards = [
    { table: "Bàn 101, 102", amount: 627000, elapsed: "789h44'", isMockup: true },
    { table: "Bàn 103", amount: 557000, elapsed: "787h35'" },
    { table: "Bàn 104", amount: 757000, elapsed: "787h35'" },
    { table: "Bàn 108", amount: 430000, elapsed: "787h30'" },
    { table: "Bàn 110", amount: 710000, elapsed: "787h27'" },
    { table: "Bàn 111", amount: 130000, elapsed: "787h17'" },
    { table: "Bàn 204", amount: 50000,  elapsed: "787h13'" },
    { table: "Bàn 205", amount: 80000,  elapsed: "787h01'" },
    { table: "Bàn 206", amount: 80000,  elapsed: "787h" },
    { table: "Bàn 207", amount: 230000, elapsed: "768h45'" },
    { table: "Bàn 208", amount: 280000, elapsed: "768h44'" },
    { table: "Bàn 211", amount: 130000, elapsed: "768h29'" },
    { table: "Bàn 102", amount: 507000, elapsed: "311h39'" },
    { table: "Bàn 101-2", amount: 530000, elapsed: "311h39'", realTable: "Bàn 101" },
    { table: "Bàn 106", amount: 591000, elapsed: "168h23'" },
    { table: "Bàn 102-2", amount: 699000, elapsed: "115h01'", realTable: "Bàn 102" },
    { table: "Bàn 105", amount: 1050000, elapsed: "114h50'" },
    { table: "Bàn 106-2", amount: 514000, elapsed: "114h48'", realTable: "Bàn 106" },
    { table: "Bàn 107", amount: 637000, elapsed: "114h44'" },
    { table: "Bàn 109", amount: 100000, elapsed: "113h22'" },
    { table: "Bàn 111-2", amount: 700000, elapsed: "112h38'", realTable: "Bàn 111" },
    { table: "Bàn 101-3", amount: 1865000, elapsed: "09'", realTable: "Bàn 101" },
  ];

  visibleCards.forEach((card, idx) => {
    const tableIdentifier = card.realTable || card.table;
    const orderNum = `OD-${String(idx + 1).padStart(4, "0")}`;
    
    // For the mockup card, seed the exact items shown in the screenshot
    const items = (card as any).isMockup ? [
      { id: "MOCK01", name: "Bông lý xào bò", price: 30000, qty: 4, isSent: true },
      { id: "MOCK02", name: "Bánh cá vược", price: 500000, qty: 1, isSent: true },
      { id: "MOCK03", name: "Bánh nem chuối", price: 7000, qty: 1, isSent: true },
    ] : [
      { id: "MA08", name: "Dê xào lăn Phong Dê", price: 175000, qty: Math.floor(card.amount / 175000) || 1, isSent: true }
    ];

    list.push({
      id: `seed-pay-${idx}`,
      orderNumber: orderNum,
      tableName: tableIdentifier,
      customerCount: idx === 0 ? 6 : 0, // 6 guests for Bàn 1.1 so total sum of guests is 6 to match mockup!
      items: items,
      totalAmount: card.amount,
      status: "Chờ thanh toán",
      createdAt: card.elapsed
    });
  });

  // Now, let's pad Chờ thanh toán to 29 orders
  let currentCount = list.length;
  for (let i = currentCount; i < 29; i++) {
    const tableIndex = (i % 10) + 1;
    const floor = (i % 3) + 1;
    const amount = 150000 + (i * 15000);
    list.push({
      id: `seed-pay-${i}`,
      orderNumber: `OD-${String(i + 1).padStart(4, "0")}`,
      tableName: `Bàn ${floor}0${tableIndex}`,
      customerCount: 0,
      items: [{ id: "MA08", name: "Dê xào lăn Phong Dê", price: 175000, qty: 1, isSent: true }],
      totalAmount: amount,
      status: "Chờ thanh toán",
      createdAt: "10h15'"
    });
  }

  // Seed Mang về (5 orders)
  for (let i = 0; i < 5; i++) {
    list.push({
      id: `seed-takeaway-${i}`,
      orderNumber: `OD-MV-${String(i + 1).padStart(3, "0")}`,
      tableName: "Mang về",
      customerCount: 0,
      items: [{ id: "MA05", name: "Cơm cháy sốt dê Phong Dê", price: 95000, qty: 1, isSent: true }],
      totalAmount: 95000,
      status: "Mang về",
      createdAt: "15'"
    });
  }

  // Seed Chờ giao hàng (29 orders)
  for (let i = 0; i < 29; i++) {
    list.push({
      id: `seed-deliv-${i}`,
      orderNumber: `OD-GH-${String(i + 1).padStart(3, "0")}`,
      tableName: "Mang về",
      customerCount: 0,
      items: [{ id: "MA06", name: "Gỏi tai dê Phong Dê", price: 120000, qty: 1, isSent: true }],
      totalAmount: 120000,
      status: "Chờ giao hàng",
      createdAt: "25'"
    });
  }

  return list;
};

export const OrderScreen: React.FC<OrderScreenProps> = ({
  onBackToPrinter,
  onLogout,
  onGoToServer,
  setToast,
}) => {
  // Navigation active sub-tab inside POS Order screen
  const [activeTab, setActiveTab] = useState<"Order" | "Sơ đồ" | "Order Online">("Order");
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [activeFloor, setActiveFloor] = useState<"Tầng 1" | "Tầng 2" | "Tầng 3">("Tầng 1");
  
  // Filtering states
  const [filterStatus, setFilterStatus] = useState<"Chờ thanh toán" | "Mang về" | "Chờ giao hàng" | "Đặt trước">("Chờ thanh toán");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderType, setSelectedOrderType] = useState("Tất cả");

  // Orders list state - initialized as empty for the first-time user flow
  const [orders, setOrders] = useState<Order[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Dropdowns and UI states
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Add Order Form states (initialized as "Chọn bàn..." / empty draft for Order screen integration)
  const [newTableName, setNewTableName] = useState("");
  const [newCustomerCount, setNewCustomerCount] = useState<number>(0);
  const [newOrderType, setNewOrderType] = useState<"Chờ thanh toán" | "Mang về" | "Chờ giao hàng" | "Đặt trước">("Chờ thanh toán");
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [currentOrderNote, setCurrentOrderNote] = useState("");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [tempQtyValues, setTempQtyValues] = useState<Record<string, string>>({});
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(null);

  // Xếp bàn Modal states
  const [showAssignTableModal, setShowAssignTableModal] = useState(false);
  const [assignTableSearch, setAssignTableSearch] = useState("");
  const [tempSelectedTable, setTempSelectedTable] = useState<number | null>(null);
  const [assignTableFloor, setAssignTableFloor] = useState<"Tầng 1" | "Tầng 2" | "Tầng 3">("Tầng 1");

  // Integrated POS menu navigation states
  const [activeCategory, setActiveCategory] = useState<string>("Hay dùng");
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>("");
  const [checkoutOrder, setCheckoutOrder] = useState<{ tableName: string; items: OrderItem[]; total: number; orderId?: string } | null>(null);
  const [checkoutMemberId, setCheckoutMemberId] = useState("100000057");
  const [checkoutMemberName, setCheckoutMemberName] = useState("a");
  const [isPromo15Checked, setIsPromo15Checked] = useState(true);
  const [isPromo500kChecked, setIsPromo500kChecked] = useState(false);
  const [isCheckoutTaxChecked, setIsCheckoutTaxChecked] = useState(true);
  const [isCheckoutReceiptChecked, setIsCheckoutReceiptChecked] = useState(true);
  const [selectedCheckoutRow, setSelectedCheckoutRow] = useState<number>(0);
  const [checkoutFocusedId, setCheckoutFocusedId] = useState<string | null>(null);
  const [checkoutTempQtyValues, setCheckoutTempQtyValues] = useState<Record<string, string>>({});
  const [waiterName, setWaiterName] = useState<string>("");

  // States for Electronic Invoice Issuance Modal (Phát hành hóa đơn điện tử)
  const [showEInvoiceModal, setShowEInvoiceModal] = useState<boolean>(false);
  const [invoiceCustomerName, setInvoiceCustomerName] = useState<string>("");
  const [invoiceCustomerPhone, setInvoiceCustomerPhone] = useState<string>("");
  const [invoiceCustomerEmail, setInvoiceCustomerEmail] = useState<string>("");
  const [invoiceCustomerIdCard, setInvoiceCustomerIdCard] = useState<string>("");
  const [invoiceCompanyName, setInvoiceCompanyName] = useState<string>("");
  const [invoiceTaxCode, setInvoiceTaxCode] = useState<string>("");
  const [invoiceCompanyAddress, setInvoiceCompanyAddress] = useState<string>("");
  const [invoiceIssueNow, setInvoiceIssueNow] = useState<boolean>(false);
  const [invoiceSendEmail, setInvoiceSendEmail] = useState<boolean>(false);
  const [invoiceSymbol, setInvoiceSymbol] = useState<string>("1C26MAC");

  // States for "Thu tiền" (Payment / Collection) dialog
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentInputAmount, setPaymentInputAmount] = useState<string>("0");
  const [paymentSelectedMethod, setPaymentSelectedMethod] = useState<string>("TIỀN MẶT");
  const [paymentDetailsList, setPaymentDetailsList] = useState<{ method: string; amount: number }[]>([]);
  const [selectedBeneficiaryAccount, setSelectedBeneficiaryAccount] = useState<string>("ACB - 4184901");
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [qrLoading, setQrLoading] = useState<boolean>(false);

  // Live clock state matching format "hh:mm - DD/MM/YYYY"
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const mMonth = String(now.getMonth() + 1).padStart(2, "0");
      const yyyy = now.getFullYear();
      setCurrentTime(`${hh}:${mm} - ${dd}/${mMonth}/${yyyy}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Guide Tour state for order journey
  const [orderTourStep, setOrderTourStep] = useState<number | null>(null);
  const [orderTourRect, setOrderTourRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isSodoTourFlow, setIsSodoTourFlow] = useState<boolean>(false);

  // Auto start tour on mount if first time
  useEffect(() => {
    const isCompleted = localStorage.getItem("orderTourCompleted") === "true";
    if (!isCompleted) {
      setOrderTourStep(1);
    } else {
      const savedOrders = localStorage.getItem("cukcuk_orders");
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (e) {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    }
  }, []);

  // Save orders to localStorage once tour is completed
  useEffect(() => {
    const isCompleted = localStorage.getItem("orderTourCompleted") === "true";
    if (isCompleted) {
      localStorage.setItem("cukcuk_orders", JSON.stringify(orders));
    }
  }, [orders]);

  // Track if we started the tour on the Sơ đồ tab
  useEffect(() => {
    if (orderTourStep === 1) {
      setIsSodoTourFlow(activeTab === "Sơ đồ");
    }
  }, [orderTourStep]);

  // Listen and calculate coordinates for highlighted element in Order screen tour
  useEffect(() => {
    if (orderTourStep === null) {
      setOrderTourRect(null);
      return;
    }

    const updateRect = () => {
      let elementId = "";
      if (orderTourStep === 1) {
        elementId = activeTab === "Sơ đồ" ? "tour-sodo-table-101" : "tour-order-btn";
      } else if (orderTourStep === 2) {
        elementId = "tour-table-select-box";
      } else if (orderTourStep === 3) {
        elementId = "tour-modal-table-101";
      } else if (orderTourStep === 4) {
        elementId = "tour-dish-catalog";
      } else if (orderTourStep === 5) {
        elementId = "tour-qty-input";
      } else if (orderTourStep === 6) {
        elementId = "tour-send-kitchen-btn";
      } else if (orderTourStep === 7) {
        elementId = "tour-save-btn";
      } else if (orderTourStep === 8) {
        elementId = activeTab === "Sơ đồ" ? "tour-sodo-table-101" : "tour-card-checkout-btn";
      } else if (orderTourStep === 9) {
        elementId = "tour-total-amount-box";
      } else if (orderTourStep === 10) {
        elementId = "tour-invoice-chk";
      } else if (orderTourStep === 11) {
        elementId = "tour-invoice-details-btn";
      } else if (orderTourStep === 12) {
        elementId = "tour-einvoice-form";
      } else if (orderTourStep === 13) {
        elementId = "tour-thutien-trigger-btn";
      } else if (orderTourStep === 14) {
        elementId = "tour-payment-methods";
      } else if (orderTourStep === 15) {
        elementId = "tour-payment-denoms";
      } else if (orderTourStep === 16) {
        elementId = "tour-payment-account-select";
      } else if (orderTourStep === 17) {
        elementId = showQrModal ? "tour-qr-code-box" : "tour-payment-qr-trigger";
      } else if (orderTourStep === 18) {
        elementId = "tour-qr-code-box";
      } else if (orderTourStep === 19) {
        elementId = "tour-payment-complete-btn";
      }

      if (!elementId) {
        setOrderTourRect(null);
        return;
      }

      const el = document.getElementById(elementId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setOrderTourRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setOrderTourRect(null);
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    const timer = setInterval(updateRect, 100);

    return () => {
      window.removeEventListener("resize", updateRect);
      clearInterval(timer);
    };
  }, [orderTourStep, activeTab, isOrdering, showEInvoiceModal, showPaymentModal, showQrModal]);

  // Sync screen states whenever orderTourStep changes to guarantee DOM elements exist
  useEffect(() => {
    if (orderTourStep === null) return;

    if (orderTourStep === 1) {
      setIsOrdering(false);
      setCheckoutOrder(null);
    } else if (orderTourStep === 2) {
      setIsOrdering(true);
      setActiveTab("Order");
      setShowAssignTableModal(false);
    } else if (orderTourStep === 3) {
      setIsOrdering(true);
      setActiveTab("Order");
      setAssignTableFloor("Tầng 1");
      setAssignTableSearch("");
      setShowAssignTableModal(true);
    } else if (orderTourStep === 4) {
      setIsOrdering(true);
      setActiveTab("Order");
      setShowAssignTableModal(false);
      if (!newTableName) {
        setNewTableName("Bàn 101");
        setNewCustomerCount(6);
      }
    } else if (orderTourStep === 5) {
      setIsOrdering(true);
      setActiveTab("Order");
      setShowAssignTableModal(false);
      if (!newTableName) {
        setNewTableName("Bàn 101");
        setNewCustomerCount(6);
      }
      if (cartItems.length === 0) {
        setCartItems([
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2 },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4 }
        ]);
      }
    } else if (orderTourStep === 6) {
      setIsOrdering(true);
      setActiveTab("Order");
      if (!newTableName) {
        setNewTableName("Bàn 101");
        setNewCustomerCount(6);
      }
      if (cartItems.length === 0) {
        setCartItems([
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2 },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4 }
        ]);
      }
    } else if (orderTourStep === 7) {
      setIsOrdering(true);
      setActiveTab("Order");
      if (!newTableName) {
        setNewTableName("Bàn 101");
        setNewCustomerCount(6);
      }
      if (cartItems.length === 0) {
        setCartItems([
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ]);
      }
    } else if (orderTourStep === 8) {
      setIsOrdering(false);
      setCheckoutOrder(null);
      const has101 = orders.some(o => o.tableName.includes("101"));
      if (!has101) {
        const defaultOrder: Order = {
          id: "tour-order-101",
          orderNumber: "OD-0101",
          tableName: "Bàn 101",
          customerCount: 6,
          items: [
            { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
            { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
          ],
          totalAmount: 450000,
          status: "Chờ thanh toán",
          createdAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        };
        setOrders([defaultOrder, ...orders]);
      }
    } else if (orderTourStep === 9) {
      setIsOrdering(false);
      setShowPaymentModal(false);
      setShowEInvoiceModal(false);
      if (!checkoutOrder || !checkoutOrder.tableName.includes("101")) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 10) {
      setIsOrdering(false);
      setShowPaymentModal(false);
      setShowEInvoiceModal(false);
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 11) {
      setIsOrdering(false);
      setShowPaymentModal(false);
      setShowEInvoiceModal(false);
      setIsCheckoutReceiptChecked(true);
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 12) {
      setIsOrdering(false);
      setShowPaymentModal(false);
      setIsCheckoutReceiptChecked(true);
      setShowEInvoiceModal(true);
      if (!invoiceCustomerName) setInvoiceCustomerName("Nguyễn Văn Minh");
      if (!invoiceCustomerPhone) setInvoiceCustomerPhone("0987654321");
      if (!invoiceCustomerEmail) setInvoiceCustomerEmail("minhnv@misa.com.vn");
      if (!invoiceTaxCode) setInvoiceTaxCode("0101243124");
      if (!invoiceCompanyName) setInvoiceCompanyName("Công ty Cổ phần MISA");
      if (!invoiceCompanyAddress) setInvoiceCompanyAddress("Tòa nhà Tháp B, tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội");
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 13) {
      setIsOrdering(false);
      setShowEInvoiceModal(false);
      setShowPaymentModal(false);
      setIsCheckoutReceiptChecked(true);
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 14) {
      setIsOrdering(false);
      setShowEInvoiceModal(false);
      setShowPaymentModal(true);
      setShowQrModal(false);
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 15) {
      setIsOrdering(false);
      setShowEInvoiceModal(false);
      setShowPaymentModal(true);
      setShowQrModal(false);
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 16) {
      setIsOrdering(false);
      setShowEInvoiceModal(false);
      setShowPaymentModal(true);
      setShowQrModal(false);
      if (paymentSelectedMethod !== "QRCode" && paymentSelectedMethod !== "Chuyển khoản" && paymentSelectedMethod !== "Techcombank") {
        setPaymentSelectedMethod("QRCode");
      }
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 17) {
      setIsOrdering(false);
      setShowEInvoiceModal(false);
      setShowPaymentModal(true);
      setShowQrModal(false);
      setPaymentSelectedMethod("QRCode");
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 18) {
      setIsOrdering(false);
      setShowEInvoiceModal(false);
      setShowPaymentModal(true);
      setShowQrModal(true);
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    } else if (orderTourStep === 19) {
      setIsOrdering(false);
      setShowEInvoiceModal(false);
      setShowPaymentModal(true);
      setShowQrModal(false);
      if (!checkoutOrder) {
        const items = [
          { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
          { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
        ];
        setCheckoutOrder({
          tableName: "Bàn 101",
          items: items,
          total: 450000,
        });
      }
    }
  }, [orderTourStep]);

  // Format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const handleUpdateCheckoutQty = (itemId: string, newQty: number) => {
    if (!checkoutOrder) return;
    
    // 1. Update items in checkout order
    const updatedItems = checkoutOrder.items.map(item => 
      item.id === itemId ? { ...item, qty: newQty } : item
    ).filter(item => item.qty > 0);

    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    setCheckoutOrder({
      ...checkoutOrder,
      items: updatedItems,
      total: updatedTotal
    });

    // 2. Update the corresponding order in active orders
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.tableName === checkoutOrder.tableName) {
          return {
            ...order,
            items: updatedItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              qty: item.qty,
              note: item.note || ""
            })),
            totalAmount: updatedTotal
          };
        }
        return order;
      }).filter(order => order.items.length > 0)
    );

    // 3. Update cart items if it's currently selected table in order entry
    if (newTableName === checkoutOrder.tableName) {
      setCartItems(updatedItems);
    }
  };

  // Helpers for Payment (Thu tiền)
  const getCheckoutTotalPayable = () => {
    if (!checkoutOrder) return 0;
    const subtotal = checkoutOrder.total;
    const isMockupOrder = subtotal === 627000 || checkoutOrder.tableName.includes("101") || checkoutOrder.tableName.includes("102");
    
    let discount = 0;
    if (isPromo15Checked) {
      discount = isMockupOrder ? 500000 : Math.round(subtotal * 0.15);
    } else if (isPromo500kChecked) {
      discount = Math.min(subtotal, 500000);
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    let tax = 0;
    if (isCheckoutTaxChecked) {
      tax = isMockupOrder ? 10674.481 : Math.round(taxableAmount * 0.08);
    }

    return taxableAmount + tax;
  };

  const getCurrentlyPaidAmount = () => {
    return paymentDetailsList.reduce((acc, cur) => acc + cur.amount, 0);
  };

  const updateCurrentMethodAmount = (newAmount: number) => {
    setPaymentInputAmount(newAmount.toString());
    setPaymentDetailsList(prev => {
      const exists = prev.some(item => item.method.toLowerCase() === paymentSelectedMethod.toLowerCase());
      if (exists) {
        return prev.map(item => 
          item.method.toLowerCase() === paymentSelectedMethod.toLowerCase()
            ? { ...item, amount: newAmount }
            : item
        );
      } else {
        return [...prev, { method: paymentSelectedMethod, amount: newAmount }];
      }
    });
  };

  const handleSelectPaymentMethod = (methodName: string) => {
    setPaymentSelectedMethod(methodName);
    const existing = paymentDetailsList.find(d => d.method.toLowerCase() === methodName.toLowerCase());
    if (existing) {
      setPaymentInputAmount(existing.amount.toString());
    } else {
      const isMock = checkoutOrder?.tableName.includes("101") || checkoutOrder?.tableName.includes("102");
      const total = isMock ? 214000 : getCheckoutTotalPayable();
      const alreadyPaid = paymentDetailsList.reduce((acc, cur) => acc + cur.amount, 0);
      const remaining = total - alreadyPaid;
      const newAmount = remaining > 0 ? remaining : 0;
      
      setPaymentDetailsList([...paymentDetailsList, { method: methodName, amount: newAmount }]);
      setPaymentInputAmount(newAmount.toString());
    }

    if (methodName === "QRCode") {
      setShowQrModal(true);
      setQrLoading(true);
      const timer = setTimeout(() => {
        setQrLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  };

  const handleAddDenomination = (denomValue: number) => {
    const currentVal = parseInt(paymentInputAmount) || 0;
    const newVal = currentVal + denomValue;
    updateCurrentMethodAmount(newVal);
  };

  const handleInputChange = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    const numVal = parseInt(numeric) || 0;
    updateCurrentMethodAmount(numVal);
  };

  const getCashSuggestions = (total: number) => {
    if (total <= 0) return [0, 10000, 20000, 50000, 100000, 200000];
    const steps = [
      total,
      total + 1000 > total ? Math.ceil(total / 1000) * 1000 : total,
      Math.ceil(total / 5000) * 5000,
      Math.ceil(total / 10000) * 10000,
      Math.ceil(total / 10000) * 10000 + 10000,
      Math.ceil(total / 50000) * 50000,
      Math.ceil(total / 100000) * 100000,
      Math.ceil(total / 500000) * 500000,
    ];
    const uniqueSorted = Array.from(new Set(steps))
      .filter(v => v >= total)
      .sort((a, b) => a - b);
    return uniqueSorted.slice(0, 6);
  };

  const handleCompletePayment = (shouldPrint: boolean) => {
    if (!checkoutOrder) return;
    const isMock = checkoutOrder.tableName.includes("101") || checkoutOrder.tableName.includes("102");
    const total = isMock ? 214000 : getCheckoutTotalPayable();
    const paid = getCurrentlyPaidAmount();
    
    if (paid < total) {
      setToast({
        message: `Số tiền khách đưa chưa đủ để hoàn tất thanh toán (Đã nhận: ${formatMoney(paid)} / Phải thu: ${formatMoney(total)})!`,
        type: "info"
      });
      return;
    }

    const finalDisplayVal = isMock ? "214.000 VNĐ" : `${formatMoney(total)} VNĐ`;
    
    // Complete checkout: remove from active orders
    setOrders(orders.filter(o => o.tableName !== checkoutOrder.tableName));
    setCartItems([]);
    setNewTableName("");
    setNewCustomerCount(0);
    setCheckoutOrder(null);
    setShowPaymentModal(false);
    
    if (shouldPrint) {
      setToast({
        message: `In hóa đơn & thanh toán thành công bàn ${checkoutOrder.tableName} số tiền ${finalDisplayVal}!`,
        type: "success"
      });
    } else {
      setToast({
        message: `Thanh toán thành công bàn ${checkoutOrder.tableName} số tiền ${finalDisplayVal}!`,
        type: "success"
      });
    }
  };

  useEffect(() => {
    if (!showPaymentModal) return;
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === "n" || e.key === "N")) || e.key === "F8") {
        e.preventDefault();
        handleCompletePayment(false);
      }
      if ((e.altKey && (e.key === "i" || e.key === "I")) || e.key === "F9") {
        e.preventDefault();
        handleCompletePayment(true);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowPaymentModal(false);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [showPaymentModal, paymentDetailsList, checkoutOrder]);

  // Keyboard shortcut listener for F2 or ALT+T to add order
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2" || (e.altKey && (e.key === "t" || e.key === "T"))) {
        e.preventDefault();
        setShowAddOrderModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter orders based on status tab & search query
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = o.status === filterStatus;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tableName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate status counts
  const countByStatus = (status: "Chờ thanh toán" | "Mang về" | "Chờ giao hàng" | "Đặt trước") => {
    return orders.filter((o) => o.status === status).length;
  };

  const totalCustomers = orders.reduce((acc, cur) => acc + cur.customerCount, 0);

  // Cart action helpers
  const addToCart = (menuItem: MenuItem) => {
    const existing = cartItems.find((item) => item.id === menuItem.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === menuItem.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          qty: 1,
          note: "",
        },
      ]);
    }
    setSelectedCartItemId(menuItem.id);
    if (orderTourStep === 4) {
      setOrderTourStep(5);
    }
  };

  const changeQty = (id: string, delta: number) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const updateItemNote = (id: string, note: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, note } : item
      )
    );
  };

  const handleSaveOrder = () => {
    if (cartItems.length === 0) {
      setToast({ message: "Vui lòng chọn ít nhất một món ăn!", type: "error" });
      return;
    }

    const nextOrderNum = `OD-${String(orders.length + 1).padStart(4, "0")}`;
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: nextOrderNum,
      tableName: newTableName,
      customerCount: newCustomerCount,
      items: cartItems,
      totalAmount,
      status: newOrderType,
      createdAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setOrders([newOrder, ...orders]);
    setShowAddOrderModal(false);
    setCartItems([]);
    setToast({
      message: `Tạo order thành công cho ${newTableName} (${formatMoney(totalAmount)}đ)!`,
      type: "success",
    });
  };

  const isTableOccupied = (tableNumber: number) => {
    return orders.some(o => o.tableName === `Bàn ${tableNumber}` || o.tableName === `${tableNumber}`);
  };

  const getFloorTableCounts = (floorNum: number) => {
    let occupiedCount = 0;
    for (let t = 1; t <= 10; t++) {
      if (isTableOccupied(floorNum * 100 + t)) {
        occupiedCount++;
      }
    }
    return {
      total: 10,
      occupied: occupiedCount,
      vacant: 10 - occupiedCount,
      seatsVacant: (10 - occupiedCount) * 6
    };
  };

  const getRestaurantTableCounts = () => {
    let totalOccupied = 0;
    for (let f = 1; f <= 3; f++) {
      for (let t = 1; t <= 10; t++) {
        if (isTableOccupied(f * 100 + t)) {
          totalOccupied++;
        }
      }
    }
    return {
      total: 30,
      occupied: totalOccupied,
      vacant: 30 - totalOccupied,
      seatsVacant: (30 - totalOccupied) * 6
    };
  };

  const renderTableUI = (tableNum: number, isOccupied: boolean) => {
    // Determine corresponding order if any
    const associatedOrder = orders.find(o => o.tableName === `Bàn ${tableNum}` || o.tableName === `${tableNum}`);
    const isReserved = isOccupied && associatedOrder?.orderType === "Đặt trước";

    // Dynamic gradient stops based on state: Vacant (Blue), Occupied (Grey), Reserved (Orange)
    const primaryColor = isReserved ? "#e67e22" : isOccupied ? "#707d7e" : "#0078D4";
    const lightColor = isReserved ? "#f39c12" : isOccupied ? "#dcdfe1" : "#ACCCE3";
    const deepColor = isReserved ? "#d35400" : isOccupied ? "#525b5c" : "#0064B0";

    return (
      <div 
        key={tableNum}
        id={tableNum === 101 ? "tour-sodo-table-101" : undefined}
        onClick={() => {
          if (isOccupied && associatedOrder) {
            if (orderTourStep === 8 && associatedOrder.tableName.includes("101")) {
              setCheckoutOrder({
                tableName: associatedOrder.tableName,
                items: associatedOrder.items,
                total: associatedOrder.totalAmount,
              });
              setOrderTourStep(9);
            } else {
              setNewTableName(associatedOrder.tableName);
              setNewCustomerCount(associatedOrder.customerCount);
              setCartItems(associatedOrder.items);
              setIsOrdering(true);
              setActiveTab("Order");
              setToast({ 
                message: `Đã mở chi tiết Order cho ${associatedOrder.tableName} - Tổng tiền: ${formatMoney(associatedOrder.totalAmount)}đ.`, 
                type: "success" 
              });
            }
          } else {
            setNewTableName(`Bàn ${tableNum}`);
            setNewCustomerCount(6);
            setCartItems([]);
            setIsOrdering(true);
            setActiveTab("Order");
            setToast({ message: `Đã tự động chọn Bàn ${tableNum} trong màn hình ghi món`, type: "success" });
            if (orderTourStep === 1 && tableNum === 101) {
              setOrderTourStep(4);
            }
          }
        }}
        className="group relative cursor-pointer active:scale-95 transition-all select-none"
      >
        <svg width="111" height="111" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[111px] h-[111px] drop-shadow-md group-hover:drop-shadow-lg transition-all">
          <rect x="48.5439" y="32.8889" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(90 48.5439 32.8889)" fill="#C4C4C4"/>
          <rect x="39.3799" y="32.8889" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(90 39.3799 32.8889)" fill="#C4C4C4"/>
          <path d="M50.2559 22.6223V32.5423C50.2559 33.8678 49.1813 34.9423 47.8559 34.9423H38.5439C37.2184 34.9423 36.1439 33.8678 36.1439 32.5423V22.6223H50.2559Z" fill={`url(#paint0_linear_3192_66900_t${tableNum})`}/>
          <rect x="51.5996" y="19.2" width="3.42223" height="16.8" rx="1.71111" transform="rotate(90 51.5996 19.2)" fill={`url(#paint1_linear_3192_66900_t${tableNum})`}/>
          <rect x="72.5439" y="32.8889" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(90 72.5439 32.8889)" fill="#C4C4C4"/>
          <rect x="63.3799" y="32.8889" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(90 63.3799 32.8889)" fill="#C4C4C4"/>
          <path d="M74.2559 22.6223V32.5423C74.2559 33.8678 73.1813 34.9423 71.8559 34.9423H62.5439C61.2184 34.9423 60.1439 33.8678 60.1439 32.5423V22.6223H74.2559Z" fill={`url(#paint2_linear_3192_66900_t${tableNum})`}/>
          <rect x="75.5996" y="19.2" width="3.42223" height="16.8" rx="1.71111" transform="rotate(90 75.5996 19.2)" fill={`url(#paint3_linear_3192_66900_t${tableNum})`}/>
          <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(0 -1 -1 0 48.5439 77.511)" fill="#C4C4C4"/>
          <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(0 -1 -1 0 39.3799 77.511)" fill="#C4C4C4"/>
          <path d="M50.2559 87.7776V77.8576C50.2559 76.5321 49.1813 75.4576 47.8559 75.4576H38.5439C37.2184 75.4576 36.1439 76.5321 36.1439 77.8576V87.7776H50.2559Z" fill={`url(#paint4_linear_3192_66900_t${tableNum})`}/>
          <rect width="3.42223" height="16.8" rx="1.71111" transform="matrix(0 -1 -1 0 51.5996 91.2)" fill={`url(#paint5_linear_3192_66900_t${tableNum})`}/>
          <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(0 -1 -1 0 72.5439 77.511)" fill="#C4C4C4"/>
          <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(0 -1 -1 0 63.3799 77.511)" fill="#C4C4C4"/>
          <path d="M74.2559 87.7776V77.8576C74.2559 76.5321 73.1813 75.4576 71.8559 75.4576H62.5439C61.2184 75.4576 60.1439 76.5321 60.1439 77.8576V87.7776H74.2559Z" fill={`url(#paint6_linear_3192_66900_t${tableNum})`}/>
          <rect width="3.42223" height="16.8" rx="1.71111" transform="matrix(0 -1 -1 0 75.5996 91.2)" fill={`url(#paint7_linear_3192_66900_t${tableNum})`}/>
          <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(1 0 0 -1 18.4893 49.7446)" fill="#C4C4C4"/>
          <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(1 0 0 -1 18.4893 40.5813)" fill="#C4C4C4"/>
          <path d="M8.22168 51.4565H18.1417C19.4672 51.4565 20.5417 50.382 20.5417 49.0565V39.7445C20.5417 38.4191 19.4672 37.3445 18.1417 37.3445H8.22168V51.4565Z" fill={`url(#paint8_linear_3192_66900_t${tableNum})`}/>
          <rect width="3.42223" height="16.8" rx="1.71111" transform="matrix(1 0 0 -1 4.7998 52.8)" fill={`url(#paint9_linear_3192_66900_t${tableNum})`}/>
          <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(1 0 0 -1 18.4893 71.3445)" fill="#C4C4C4"/>
          <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(1 0 0 -1 18.4893 62.1812)" fill="#C4C4C4"/>
          <path d="M8.22168 73.0564H18.1417C19.4672 73.0564 20.5417 71.9819 20.5417 70.6564V61.3444C20.5417 60.0189 19.4672 58.9444 18.1417 58.9444H8.22168V73.0564Z" fill={`url(#paint10_linear_3192_66900_t${tableNum})`}/>
          <rect width="3.42223" height="16.8" rx="1.71111" transform="matrix(1 0 0 -1 4.7998 74.3999)" fill={`url(#paint11_linear_3192_66900_t${tableNum})`}/>
          <rect x="91.9111" y="49.7446" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(180 91.9111 49.7446)" fill="#C4C4C4"/>
          <rect x="91.9111" y="40.5813" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(180 91.9111 40.5813)" fill="#C4C4C4"/>
          <path d="M102.179 51.4565H92.2587C90.9332 51.4565 89.8587 50.382 89.8587 49.0565V39.7445C89.8587 38.4191 90.9332 37.3445 92.2587 37.3445H102.179V51.4565Z" fill={`url(#paint12_linear_3192_66900_t${tableNum})`}/>
          <rect x="105.601" y="52.8" width="3.42223" height="16.8" rx="1.71111" transform="rotate(180 105.601 52.8)" fill={`url(#paint13_linear_3192_66900_t${tableNum})`}/>
          <rect x="91.9111" y="71.3445" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(180 91.9111 71.3445)" fill="#C4C4C4"/>
          <rect x="91.9111" y="62.1812" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(180 91.9111 62.1812)" fill="#C4C4C4"/>
          <path d="M102.179 73.0564H92.2587C90.9332 73.0564 89.8587 71.9819 89.8587 70.6564V61.3444C89.8587 60.0189 90.9332 58.9444 92.2587 58.9444H102.179V73.0564Z" fill={`url(#paint14_linear_3192_66900_t${tableNum})`}/>
          <rect x="105.601" y="74.3999" width="3.42223" height="16.8" rx="1.71111" transform="rotate(180 105.601 74.3999)" fill={`url(#paint15_linear_3192_66900_t${tableNum})`}/>
          <rect x="16.7998" y="31.2" width="76.8" height="48" rx="4.8" fill={`url(#paint16_linear_3192_66900_t${tableNum})`}/>
          
          {/* Table Number and optional Price/Indicator */}
          <text 
            x="55.2" 
            y={isOccupied && associatedOrder ? "50" : "56"} 
            fill="white" 
            fontSize="12.5" 
            fontWeight="bold" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="font-sans select-none pointer-events-none tracking-wide"
          >
            {tableNum}
          </text>
          
          {isOccupied && associatedOrder && (
            <text 
              x="55.2" 
              y="64" 
              fill="#ffffff" 
              fontSize="8" 
              fontWeight="bold" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="font-sans select-none pointer-events-none opacity-95 tracking-tight"
            >
              {formatMoney(associatedOrder.totalAmount)}đ
            </text>
          )}

          <defs>
            <linearGradient id={`paint0_linear_3192_66900_t${tableNum}`} x1="41.6319" y1="32.8889" x2="41.6319" y2="23.3068" gradientUnits="userSpaceOnUse">
              <stop stopColor={lightColor}/>
              <stop offset="1" stopColor={primaryColor}/>
            </linearGradient>
            <linearGradient id={`paint1_linear_3192_66900_t${tableNum}`} x1="55.0218" y1="28.272" x2="51.9418" y2="28.272" gradientUnits="userSpaceOnUse">
              <stop stopColor={primaryColor}/>
              <stop offset="1" stopColor={lightColor}/>
            </linearGradient>
            <linearGradient id={`paint2_linear_3192_66900_t${tableNum}`} x1="65.6319" y1="32.8889" x2="65.6319" y2="23.3068" gradientUnits="userSpaceOnUse">
              <stop stopColor={lightColor}/>
              <stop offset="1" stopColor={primaryColor}/>
            </linearGradient>
            <linearGradient id={`paint3_linear_3192_66900_t${tableNum}`} x1="79.0218" y1="28.272" x2="75.9418" y2="28.272" gradientUnits="userSpaceOnUse">
              <stop stopColor={primaryColor}/>
              <stop offset="1" stopColor={lightColor}/>
            </linearGradient>
            <linearGradient id={`paint4_linear_3192_66900_t${tableNum}`} x1="41.6319" y1="77.5109" x2="41.6319" y2="87.0931" gradientUnits="userSpaceOnUse">
              <stop stopColor={lightColor}/>
              <stop offset="1" stopColor={primaryColor}/>
            </linearGradient>
            <linearGradient id={`paint5_linear_3192_66900_t${tableNum}`} x1="3.42223" y1="9.072" x2="0.342223" y2="9.072" gradientUnits="userSpaceOnUse">
              <stop stopColor={primaryColor}/>
              <stop offset="1" stopColor={lightColor}/>
            </linearGradient>
            <linearGradient id={`paint6_linear_3192_66900_t${tableNum}`} x1="65.6319" y1="77.5109" x2="65.6319" y2="87.0931" gradientUnits="userSpaceOnUse">
              <stop stopColor={lightColor}/>
              <stop offset="1" stopColor={primaryColor}/>
            </linearGradient>
            <linearGradient id={`paint7_linear_3192_66900_t${tableNum}`} x1="3.42223" y1="9.072" x2="0.342223" y2="9.072" gradientUnits="userSpaceOnUse">
              <stop stopColor={primaryColor}/>
              <stop offset="1" stopColor={lightColor}/>
            </linearGradient>
            <linearGradient id={`paint8_linear_3192_66900_t${tableNum}`} x1="18.4884" y1="42.8325" x2="8.90613" y2="42.8325" gradientUnits="userSpaceOnUse">
              <stop stopColor={lightColor}/>
              <stop offset="1" stopColor={primaryColor}/>
            </linearGradient>
            <linearGradient id={`paint9_linear_3192_66900_t${tableNum}`} x1="3.42223" y1="9.072" x2="0.342223" y2="9.072" gradientUnits="userSpaceOnUse">
              <stop stopColor={primaryColor}/>
              <stop offset="1" stopColor={lightColor}/>
            </linearGradient>
            <linearGradient id={`paint10_linear_3192_66900_t${tableNum}`} x1="18.4884" y1="64.4324" x2="8.90613" y2="64.4324" gradientUnits="userSpaceOnUse">
              <stop stopColor={lightColor}/>
              <stop offset="1" stopColor={primaryColor}/>
            </linearGradient>
            <linearGradient id={`paint11_linear_3192_66900_t${tableNum}`} x1="3.42223" y1="9.072" x2="0.342223" y2="9.072" gradientUnits="userSpaceOnUse">
              <stop stopColor={primaryColor}/>
              <stop offset="1" stopColor={lightColor}/>
            </linearGradient>
            <linearGradient id={`paint12_linear_3192_66900_t${tableNum}`} x1="91.912" y1="42.8325" x2="101.494" y2="42.8325" gradientUnits="userSpaceOnUse">
              <stop stopColor={lightColor}/>
              <stop offset="1" stopColor={primaryColor}/>
            </linearGradient>
            <linearGradient id={`paint13_linear_3192_66900_t${tableNum}`} x1="109.023" y1="61.872" x2="105.943" y2="61.872" gradientUnits="userSpaceOnUse">
              <stop stopColor={primaryColor}/>
              <stop offset="1" stopColor={lightColor}/>
            </linearGradient>
            <linearGradient id={`paint14_linear_3192_66900_t${tableNum}`} x1="91.912" y1="64.4324" x2="101.494" y2="64.4324" gradientUnits="userSpaceOnUse">
              <stop stopColor={lightColor}/>
              <stop offset="1" stopColor={primaryColor}/>
            </linearGradient>
            <linearGradient id={`paint15_linear_3192_66900_t${tableNum}`} x1="109.023" y1="83.4719" x2="105.943" y2="83.4719" gradientUnits="userSpaceOnUse">
              <stop stopColor={primaryColor}/>
              <stop offset="1" stopColor={lightColor}/>
            </linearGradient>
            <linearGradient id={`paint16_linear_3192_66900_t${tableNum}`} x1="55.1998" y1="31.2" x2="55.1998" y2="79.2" gradientUnits="userSpaceOnUse">
              <stop stopColor={primaryColor}/>
              <stop offset="1" stopColor={deepColor}/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const renderModalTableUI = (tableNum: number) => {
    const isOccupied = isTableOccupied(tableNum);
    const associatedOrder = orders.find(o => o.tableName === `Bàn ${tableNum}` || o.tableName === `${tableNum}`);
    const isReserved = isOccupied && associatedOrder?.status === "Đặt trước";

    // Dynamic gradient stops based on state: Vacant (Blue), Occupied (Grey), Reserved (Orange)
    const primaryColor = isReserved ? "#e67e22" : isOccupied ? "#707d7e" : "#0078D4";
    const lightColor = isReserved ? "#f39c12" : isOccupied ? "#dcdfe1" : "#ACCCE3";
    const deepColor = isReserved ? "#d35400" : isOccupied ? "#525b5c" : "#0064B0";

    const isSelectedInModal = tempSelectedTable === tableNum;

    return (
      <div 
        key={`modal-table-${tableNum}`}
        id={tableNum === 101 ? "tour-modal-table-101" : undefined}
        onClick={() => setTempSelectedTable(tableNum)}
        className={`group relative cursor-pointer active:scale-95 transition-all select-none p-1 rounded-sm ${
          isSelectedInModal ? "ring-2 ring-green-500 bg-green-50/20" : ""
        }`}
      >
        <div className="relative w-[111px] h-[111px]">
          <svg width="111" height="111" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[111px] h-[111px] drop-shadow-md group-hover:drop-shadow-lg transition-all">
            <rect x="48.5439" y="32.8889" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(90 48.5439 32.8889)" fill="#C4C4C4"/>
            <rect x="39.3799" y="32.8889" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(90 39.3799 32.8889)" fill="#C4C4C4"/>
            <path d="M50.2559 22.6223V32.5423C50.2559 33.8678 49.1813 34.9423 47.8559 34.9423H38.5439C37.2184 34.9423 36.1439 33.8678 36.1439 32.5423V22.6223H50.2559Z" fill={`url(#paint0_linear_modal_t${tableNum})`}/>
            <rect x="51.5996" y="19.2" width="3.42223" height="16.8" rx="1.71111" transform="rotate(90 51.5996 19.2)" fill={`url(#paint1_linear_modal_t${tableNum})`}/>
            <rect x="72.5439" y="32.8889" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(90 72.5439 32.8889)" fill="#C4C4C4"/>
            <rect x="63.3799" y="32.8889" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(90 63.3799 32.8889)" fill="#C4C4C4"/>
            <path d="M74.2559 22.6223V32.5423C74.2559 33.8678 73.1813 34.9423 71.8559 34.9423H62.5439C61.2184 34.9423 60.1439 33.8678 60.1439 32.5423V22.6223H74.2559Z" fill={`url(#paint2_linear_modal_t${tableNum})`}/>
            <rect x="75.5996" y="19.2" width="3.42223" height="16.8" rx="1.71111" transform="rotate(90 75.5996 19.2)" fill={`url(#paint3_linear_modal_t${tableNum})`}/>
            <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(0 -1 -1 0 48.5439 77.511)" fill="#C4C4C4"/>
            <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(0 -1 -1 0 39.3799 77.511)" fill="#C4C4C4"/>
            <path d="M50.2559 87.7776V77.8576C50.2559 76.5321 49.1813 75.4576 47.8559 75.4576H38.5439C37.2184 75.4576 36.1439 76.5321 36.1439 77.8576V87.7776H50.2559Z" fill={`url(#paint4_linear_modal_t${tableNum})`}/>
            <rect width="3.42223" height="16.8" rx="1.71111" transform="matrix(0 -1 -1 0 51.5996 91.2)" fill={`url(#paint5_linear_modal_t${tableNum})`}/>
            <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(0 -1 -1 0 72.5439 77.511)" fill="#C4C4C4"/>
            <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(0 -1 -1 0 63.3799 77.511)" fill="#C4C4C4"/>
            <path d="M74.2559 87.7776V77.8576C74.2559 76.5321 73.1813 75.4576 71.8559 75.4576H62.5439C61.2184 75.4576 60.1439 76.5321 60.1439 77.8576V87.7776H74.2559Z" fill={`url(#paint6_linear_modal_t${tableNum})`}/>
            <rect width="3.42223" height="16.8" rx="1.71111" transform="matrix(0 -1 -1 0 75.5996 91.2)" fill={`url(#paint7_linear_modal_t${tableNum})`}/>
            <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(1 0 0 -1 18.4893 49.7446)" fill="#C4C4C4"/>
            <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(1 0 0 -1 18.4893 40.5813)" fill="#C4C4C4"/>
            <path d="M8.22168 51.4565H18.1417C19.4672 51.4565 20.5417 50.382 20.5417 49.0565V39.7445C20.5417 38.4191 19.4672 37.3445 18.1417 37.3445H8.22168V51.4565Z" fill={`url(#paint8_linear_modal_t${tableNum})`}/>
            <rect width="3.42223" height="16.8" rx="1.71111" transform="matrix(1 0 0 -1 4.7998 52.8)" fill={`url(#paint9_linear_modal_t${tableNum})`}/>
            <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(1 0 0 -1 18.4893 71.3445)" fill="#C4C4C4"/>
            <rect width="3.11112" height="1.52727" rx="0.763636" transform="matrix(1 0 0 -1 18.4893 62.1812)" fill="#C4C4C4"/>
            <path d="M8.22168 73.0564H18.1417C19.4672 73.0564 20.5417 71.9819 20.5417 70.6564V61.3444C20.5417 60.0189 19.4672 58.9444 18.1417 58.9444H8.22168V73.0564Z" fill={`url(#paint10_linear_modal_t${tableNum})`}/>
            <rect width="3.42223" height="16.8" rx="1.71111" transform="matrix(1 0 0 -1 4.7998 74.3999)" fill={`url(#paint11_linear_modal_t${tableNum})`}/>
            <rect x="91.9111" y="49.7446" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(180 91.9111 49.7446)" fill="#C4C4C4"/>
            <rect x="91.9111" y="40.5813" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(180 91.9111 40.5813)" fill="#C4C4C4"/>
            <path d="M102.179 51.4565H92.2587C90.9332 51.4565 89.8587 50.382 89.8587 49.0565V39.7445C89.8587 38.4191 90.9332 37.3445 92.2587 37.3445H102.179V51.4565Z" fill={`url(#paint12_linear_modal_t${tableNum})`}/>
            <rect x="105.601" y="52.8" width="3.42223" height="16.8" rx="1.71111" transform="rotate(180 105.601 52.8)" fill={`url(#paint13_linear_modal_t${tableNum})`}/>
            <rect x="91.9111" y="71.3445" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(180 91.9111 71.3445)" fill="#C4C4C4"/>
            <rect x="91.9111" y="62.1812" width="3.11112" height="1.52727" rx="0.763636" transform="rotate(180 91.9111 62.1812)" fill="#C4C4C4"/>
            <path d="M102.179 73.0564H92.2587C90.9332 73.0564 89.8587 71.9819 89.8587 70.6564V61.3444C89.8587 60.0189 90.9332 58.9444 92.2587 58.9444H102.179V73.0564Z" fill={`url(#paint14_linear_modal_t${tableNum})`}/>
            <rect x="105.601" y="74.3999" width="3.42223" height="16.8" rx="1.71111" transform="rotate(180 105.601 74.3999)" fill={`url(#paint15_linear_modal_t${tableNum})`}/>
            <rect x="16.7998" y="31.2" width="76.8" height="48" rx="4.8" fill={`url(#paint16_linear_modal_t${tableNum})`}/>
            
            <text 
              x="55.2" 
              y={isOccupied && associatedOrder ? "50" : "56"} 
              fill="white" 
              fontSize="12.5" 
              fontWeight="bold" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="font-sans select-none pointer-events-none tracking-wide"
            >
              {tableNum}
            </text>
            
            {isOccupied && associatedOrder && (
              <text 
                x="55.2" 
                y="64" 
                fill="#ffffff" 
                fontSize="8" 
                fontWeight="bold" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="font-sans select-none pointer-events-none opacity-95 tracking-tight"
              >
                {formatMoney(associatedOrder.totalAmount)}đ
              </text>
            )}

            <defs>
              <linearGradient id={`paint0_linear_modal_t${tableNum}`} x1="41.6319" y1="32.8889" x2="41.6319" y2="23.3068" gradientUnits="userSpaceOnUse">
                <stop stopColor={lightColor}/>
                <stop offset="1" stopColor={primaryColor}/>
              </linearGradient>
              <linearGradient id={`paint1_linear_modal_t${tableNum}`} x1="55.0218" y1="28.272" x2="51.9418" y2="28.272" gradientUnits="userSpaceOnUse">
                <stop stopColor={primaryColor}/>
                <stop offset="1" stopColor={lightColor}/>
              </linearGradient>
              <linearGradient id={`paint2_linear_modal_t${tableNum}`} x1="65.6319" y1="32.8889" x2="65.6319" y2="23.3068" gradientUnits="userSpaceOnUse">
                <stop stopColor={lightColor}/>
                <stop offset="1" stopColor={primaryColor}/>
              </linearGradient>
              <linearGradient id={`paint3_linear_modal_t${tableNum}`} x1="79.0218" y1="28.272" x2="75.9418" y2="28.272" gradientUnits="userSpaceOnUse">
                <stop stopColor={primaryColor}/>
                <stop offset="1" stopColor={lightColor}/>
              </linearGradient>
              <linearGradient id={`paint4_linear_modal_t${tableNum}`} x1="41.6319" y1="77.5109" x2="41.6319" y2="87.0931" gradientUnits="userSpaceOnUse">
                <stop stopColor={lightColor}/>
                <stop offset="1" stopColor={primaryColor}/>
              </linearGradient>
              <linearGradient id={`paint5_linear_modal_t${tableNum}`} x1="3.42223" y1="9.072" x2="0.342223" y2="9.072" gradientUnits="userSpaceOnUse">
                <stop stopColor={primaryColor}/>
                <stop offset="1" stopColor={lightColor}/>
              </linearGradient>
              <linearGradient id={`paint6_linear_modal_t${tableNum}`} x1="65.6319" y1="77.5109" x2="65.6319" y2="87.0931" gradientUnits="userSpaceOnUse">
                <stop stopColor={lightColor}/>
                <stop offset="1" stopColor={primaryColor}/>
              </linearGradient>
              <linearGradient id={`paint7_linear_modal_t${tableNum}`} x1="3.42223" y1="9.072" x2="0.342223" y2="9.072" gradientUnits="userSpaceOnUse">
                <stop stopColor={primaryColor}/>
                <stop offset="1" stopColor={lightColor}/>
              </linearGradient>
              <linearGradient id={`paint8_linear_modal_t${tableNum}`} x1="18.4884" y1="42.8325" x2="8.90613" y2="42.8325" gradientUnits="userSpaceOnUse">
                <stop stopColor={lightColor}/>
                <stop offset="1" stopColor={primaryColor}/>
              </linearGradient>
              <linearGradient id={`paint9_linear_modal_t${tableNum}`} x1="3.42223" y1="9.072" x2="0.342223" y2="9.072" gradientUnits="userSpaceOnUse">
                <stop stopColor={primaryColor}/>
                <stop offset="1" stopColor={lightColor}/>
              </linearGradient>
              <linearGradient id={`paint10_linear_modal_t${tableNum}`} x1="18.4884" y1="64.4324" x2="8.90613" y2="64.4324" gradientUnits="userSpaceOnUse">
                <stop stopColor={lightColor}/>
                <stop offset="1" stopColor={primaryColor}/>
              </linearGradient>
              <linearGradient id={`paint11_linear_modal_t${tableNum}`} x1="3.42223" y1="9.072" x2="0.342223" y2="9.072" gradientUnits="userSpaceOnUse">
                <stop stopColor={primaryColor}/>
                <stop offset="1" stopColor={lightColor}/>
              </linearGradient>
              <linearGradient id={`paint12_linear_modal_t${tableNum}`} x1="91.912" y1="42.8325" x2="101.494" y2="42.8325" gradientUnits="userSpaceOnUse">
                <stop stopColor={lightColor}/>
                <stop offset="1" stopColor={primaryColor}/>
              </linearGradient>
              <linearGradient id={`paint13_linear_modal_t${tableNum}`} x1="109.023" y1="61.872" x2="105.943" y2="61.872" gradientUnits="userSpaceOnUse">
                <stop stopColor={primaryColor}/>
                <stop offset="1" stopColor={lightColor}/>
              </linearGradient>
              <linearGradient id={`paint14_linear_modal_t${tableNum}`} x1="91.912" y1="64.4324" x2="101.494" y2="64.4324" gradientUnits="userSpaceOnUse">
                <stop stopColor={lightColor}/>
                <stop offset="1" stopColor={primaryColor}/>
              </linearGradient>
              <linearGradient id={`paint15_linear_modal_t${tableNum}`} x1="109.023" y1="83.4719" x2="105.943" y2="83.4719" gradientUnits="userSpaceOnUse">
                <stop stopColor={primaryColor}/>
                <stop offset="1" stopColor={lightColor}/>
              </linearGradient>
              <linearGradient id={`paint16_linear_modal_t${tableNum}`} x1="55.1998" y1="31.2" x2="55.1998" y2="79.2" gradientUnits="userSpaceOnUse">
                <stop stopColor={primaryColor}/>
                <stop offset="1" stopColor={deepColor}/>
              </linearGradient>
            </defs>
          </svg>

          {/* Green check icon badge on top right if selected */}
          {isSelectedInModal && (
            <div className="absolute top-3.5 right-3.5 w-6 h-6 bg-[#27ae60] rounded-full border-2 border-white flex items-center justify-center shadow-md z-20">
              <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Bạn có chắc chắn muốn hủy order này không?")) {
      setOrders(orders.filter((o) => o.id !== orderId));
      setToast({ message: "Đã hủy order thành công!", type: "info" });
    }
  };

  // Handler for selecting tables on the dropdown
  const handleTableChange = (tableName: string) => {
    setNewTableName(tableName);
    if (tableName === "") {
      setCartItems([]);
      setNewCustomerCount(0);
      return;
    }
    const existingOrder = orders.find((o) => o.tableName === tableName);
    if (existingOrder) {
      setCartItems(existingOrder.items);
      setNewCustomerCount(existingOrder.customerCount);
      setToast({ message: `Đã tải Order đang phục vụ tại ${tableName}`, type: "info" });
    } else {
      setCartItems([]);
      setNewCustomerCount(6); // Default guests for empty table
    }
  };

  // Kitchen printing trigger
  const handleSendToKitchen = () => {
    if (!newTableName) {
      setToast({ message: "Vui lòng chọn bàn/vị trí trước khi gửi bếp!", type: "error" });
      return;
    }
    if (cartItems.length === 0) {
      setToast({ message: "Chưa có món ăn nào trong order để gửi bếp!", type: "error" });
      return;
    }
    
    // Mark all items currently in cart as sent to kitchen
    const updatedCart = cartItems.map(item => ({ ...item, isSent: true }));
    setCartItems(updatedCart);

    // If there is an existing order for this table, let's sync it immediately so it persists
    const existingOrderIdx = orders.findIndex((o) => o.tableName === newTableName);
    if (existingOrderIdx > -1) {
      const updatedOrders = [...orders];
      updatedOrders[existingOrderIdx] = {
        ...updatedOrders[existingOrderIdx],
        items: updatedCart,
        totalAmount: updatedCart.reduce((sum, item) => sum + item.price * item.qty, 0),
      };
      setOrders(updatedOrders);
    }

    setToast({ message: `Đã gửi yêu cầu chế biến cho ${newTableName} đến Bếp & Bar thành công!`, type: "success" });
    if (orderTourStep === 6) {
      setOrderTourStep(7);
    }
  };

  // Cancel order or clear current draft
  const handleCancelOrder = () => {
    if (!newTableName) {
      setCartItems([]);
      setNewCustomerCount(0);
      setIsOrdering(false);
      setToast({ message: "Đã xóa trắng danh sách món nháp!", type: "info" });
      return;
    }
    const existingOrder = orders.find((o) => o.tableName === newTableName);
    if (existingOrder) {
      if (confirm(`Bạn có chắc chắn muốn hủy toàn bộ order của ${newTableName}?`)) {
        setOrders(orders.filter((o) => o.tableName !== newTableName));
        setCartItems([]);
        setNewTableName("");
        setNewCustomerCount(0);
        setIsOrdering(false);
        setToast({ message: `Đã hủy order của ${newTableName}!`, type: "info" });
      }
    } else {
      setCartItems([]);
      setIsOrdering(false);
      setToast({ message: "Đã hủy thao tác ghi món nháp!", type: "info" });
    }
  };

  // Save/Commit current order
  const handleCommitOrder = () => {
    if (!newTableName) {
      setToast({ message: "Vui lòng chọn bàn/vị trí trước khi cất!", type: "error" });
      return;
    }
    if (cartItems.length === 0) {
      setToast({ message: "Vui lòng chọn ít nhất một món ăn!", type: "error" });
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const existingOrderIdx = orders.findIndex((o) => o.tableName === newTableName);

    if (existingOrderIdx > -1) {
      const updatedOrders = [...orders];
      updatedOrders[existingOrderIdx] = {
        ...updatedOrders[existingOrderIdx],
        items: cartItems,
        customerCount: newCustomerCount,
        totalAmount,
      };
      setOrders(updatedOrders);
    } else {
      const nextOrderNum = `OD-${String(orders.length + 1).padStart(4, "0")}`;
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber: nextOrderNum,
        tableName: newTableName,
        customerCount: newCustomerCount,
        items: cartItems,
        totalAmount,
        status: "Chờ thanh toán",
        createdAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setOrders([newOrder, ...orders]);
    }

    setToast({ message: `Đã cất & đồng bộ order của ${newTableName} thành công!`, type: "success" });
    setActiveTab("Order"); // Switch back to see status
    setIsOrdering(false);
    if (orderTourStep === 7) {
      setOrderTourStep(8);
    }
  };

  // Save/Commit current order and clear for next entry immediately
  const handleCommitAndAddOrder = () => {
    if (!newTableName) {
      setToast({ message: "Vui lòng chọn bàn/vị trí trước khi cất!", type: "error" });
      return;
    }
    if (cartItems.length === 0) {
      setToast({ message: "Vui lòng chọn ít nhất một món ăn!", type: "error" });
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const existingOrderIdx = orders.findIndex((o) => o.tableName === newTableName);

    if (existingOrderIdx > -1) {
      const updatedOrders = [...orders];
      updatedOrders[existingOrderIdx] = {
        ...updatedOrders[existingOrderIdx],
        items: cartItems,
        customerCount: newCustomerCount,
        totalAmount,
      };
      setOrders(updatedOrders);
    } else {
      const nextOrderNum = `OD-${String(orders.length + 1).padStart(4, "0")}`;
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber: nextOrderNum,
        tableName: newTableName,
        customerCount: newCustomerCount,
        items: cartItems,
        totalAmount,
        status: "Chờ thanh toán",
        createdAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setOrders([newOrder, ...orders]);
    }

    setToast({ message: `Đã cất order cho ${newTableName}. Sẵn sàng ghi order tiếp theo...`, type: "success" });
    setCartItems([]);
    setNewTableName("");
    setNewCustomerCount(0);
  };

  // Payment checkout button trigger
  const handlePayment = () => {
    if (!newTableName) {
      setToast({ message: "Vui lòng chọn bàn cần thanh toán!", type: "error" });
      return;
    }
    if (cartItems.length === 0) {
      setToast({ message: "Bàn này chưa gọi món ăn nào để thanh toán!", type: "error" });
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    setCheckoutOrder({
      tableName: newTableName,
      items: cartItems,
      total: totalAmount,
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#cbd5e1] flex flex-col justify-between select-none font-sans text-gray-800">
      
      {/* 1. TOP MAIN HEADER - Blue Color Theme */}
      <header className="h-[48px] bg-[#004b7e] flex items-center justify-between px-3 text-white select-none shrink-0 shadow-md">
        
        {/* Left Side: Navigation Items */}
        <div className="flex items-center h-full gap-1">
          {/* Home Button back to Server Dashboard */}
          <button
            onClick={() => {
              setActiveTab("Sơ đồ");
              setIsOrdering(false);
            }}
            className="h-9 w-9 flex items-center justify-center hover:bg-white/10 active:scale-95 rounded-sm transition-all cursor-pointer"
            title="Sơ đồ phòng bàn"
          >
            <Home className="w-5 h-5 text-white" />
          </button>

          <div className="h-5 w-[1px] bg-white/20 mx-1" />

          {/* TAB ORDER */}
          <button
            onClick={() => {
              setActiveTab("Order");
              setIsOrdering(false);
            }}
            className={`h-[48px] px-4 flex items-center gap-2 font-semibold text-[14px] transition-all cursor-pointer ${
              activeTab === "Order"
                ? "bg-white text-[#004b7e] rounded-t-sm"
                : "text-white hover:bg-white/10"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Order</span>
          </button>

          {/* TAB SƠ ĐỒ */}
          <button
            onClick={() => {
              setActiveTab("Sơ đồ");
              setIsOrdering(false);
            }}
            className={`h-[48px] px-4 flex items-center gap-2 font-semibold text-[14px] transition-all cursor-pointer ${
              activeTab === "Sơ đồ"
                ? "bg-white text-[#004b7e] rounded-t-sm"
                : "text-white hover:bg-white/10"
            }`}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M4 4h7v7H4zm9 0h7v7h-7zm0 9h7v7h-7zM4 13h7v7H4z"/>
            </svg>
            <span>Sơ đồ</span>
          </button>

          {/* TAB ORDER ONLINE */}
          <button
            onClick={() => {
              setActiveTab("Order Online");
              setToast({ message: "Đang tải dữ liệu đơn trực tuyến từ app MISA CukCuk...", type: "info" });
            }}
            className={`h-[48px] px-4 flex items-center gap-2 font-semibold text-[14px] relative transition-all cursor-pointer ${
              activeTab === "Order Online"
                ? "bg-white text-[#004b7e] rounded-t-sm"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Order Online</span>
          </button>
        </div>

        {/* Right Side: Quick Action Widgets & Shortcuts */}
        <div className="flex items-center gap-2.5">
          {/* Guide Tour Button */}
          <button
            onClick={() => {
              setOrderTourStep(1);
              setToast({ message: "Bắt đầu hướng dẫn quy trình bán hàng Order!", type: "info" });
            }}
            className="flex items-center gap-1.5 text-[#f39c12] hover:text-[#f1c40f] font-bold h-[36px] rounded hover:bg-white/10 px-2 cursor-pointer transition-all text-xs select-none shrink-0"
            title="Hướng dẫn quy trình bán hàng"
          >
            <Lightbulb className="w-4 h-4 fill-[#f39c12]" />
            <span className="text-[11px] text-white">HƯỚNG DẪN</span>
          </button>

          <div className="h-5 w-[1px] bg-white/20 mx-0.5" />

          {/* Quick ADD ORDER Button */}
          <button
            id="tour-order-btn"
            onClick={() => {
              if (orderTourStep === 1) {
                setNewTableName("");
                setNewCustomerCount(1);
                setCartItems([]);
                setIsOrdering(true);
                setActiveTab("Order");
                setOrderTourStep(2);
                setToast({ message: "Vui lòng chọn bàn phục vụ ở bước tiếp theo", type: "info" });
              } else {
                setNewTableName("");
                setNewCustomerCount(1);
                setCartItems([]);
                setIsOrdering(true);
                setActiveTab("Order");
                setToast({ message: "Vui lòng chọn bàn/vị trí để bắt đầu ghi món", type: "info" });
              }
            }}
            className="flex items-center gap-1.5 text-white font-bold h-[36px] rounded hover:bg-white/10 px-2 cursor-pointer transition-all text-xs select-none shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span className="tracking-wider text-[11px]">ORDER</span>
            <span className="text-[8px] opacity-80 ml-0.5">▼</span>
          </button>

          <div className="h-5 w-[1px] bg-white/20 mx-1" />

          {/* Settings Menu Button */}
          <button
            onClick={() => alert("MISA CukCuk Menu Cài đặt nhanh hệ thống.")}
            className="p-1.5 hover:bg-white/10 active:scale-95 rounded-sm transition-all cursor-pointer"
            title="Menu tùy chọn"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Notification Alert Globe */}
          <div className="relative">
            <button
              onClick={() => setToast({ message: "Có 6 đơn từ app gọi món đang chờ xác nhận", type: "info" })}
              className="p-1.5 hover:bg-white/10 active:scale-95 rounded-sm transition-all cursor-pointer relative"
              title="Đơn online"
            >
              <Globe className="w-5 h-5" />
            </button>
          </div>

          {/* Cloud Status */}
          <button
            onClick={() => alert("Đang tải xuống dữ liệu đồng bộ từ đám mây...")}
            className="p-1.5 hover:bg-white/10 active:scale-95 rounded-sm transition-all cursor-pointer"
            title="Tải dữ liệu"
          >
            <CloudDownload className="w-5 h-5" />
          </button>

          {/* Refresh/Sync arrow */}
          <button
            onClick={() => setToast({ message: "Đang đồng bộ dữ liệu phiên bán hàng với máy chủ MISA CukCuk...", type: "info" })}
            className="p-1.5 hover:bg-white/10 active:scale-95 rounded-sm transition-all cursor-pointer"
            title="Kiểm tra đồng bộ"
          >
            <div className="border border-white rounded-full p-0.5 flex items-center justify-center w-[20px] h-[20px]">
              <ArrowLeftRight className="w-3 h-3 stroke-[2.5]" />
            </div>
          </button>

          {/* Printer Setup Button replaced with Invoice (FileText) */}
          <button
            onClick={onBackToPrinter}
            className="p-1.5 hover:bg-white/10 active:scale-95 rounded-sm transition-all cursor-pointer"
            title="Thiết lập hóa đơn"
          >
            <FileText className="w-5 h-5" />
          </button>

          {/* Help notification bell replaced with user icon to toggle profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-1.5 hover:bg-white/10 active:scale-95 rounded-sm transition-all cursor-pointer"
              title="Tài khoản"
            >
              <User className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {profileOpen && (
                <div className="absolute right-0 mt-1.5 bg-white text-gray-800 rounded shadow-xl border border-gray-300 w-44 overflow-hidden z-50">
                  <div className="p-3 bg-gray-50 border-b border-gray-100 select-none">
                    <p className="font-bold text-xs text-gray-900">Chu Thị Trang</p>
                    <p className="text-[10px] text-gray-500">cttrang@software.misa.com.vn</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onBackToPrinter();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-gray-50 text-[13px] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Thiết lập hóa đơn</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 text-[13px] font-bold border-t border-gray-100 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                    <span>Đăng xuất POS</span>
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {activeTab === "Sơ đồ" && (
        <div className="bg-[#f0f0f0] border-b border-gray-300 h-10 flex items-center justify-between px-3 select-none shrink-0">
          {/* Left Side: Breadcrumb Text exactly like the picture */}
          <div className="flex items-center gap-1 text-[12px] font-sans text-gray-800">
            <span className="font-bold text-gray-900">Toàn bộ nhà hàng:</span>
            <span className="text-gray-600">Trống {getRestaurantTableCounts().vacant}/{getRestaurantTableCounts().total} bàn - {getRestaurantTableCounts().seatsVacant} ghế</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1" />
            <span className="font-bold text-gray-900">{activeFloor}:</span>
            <span className="text-gray-600">Trống {getFloorTableCounts(activeFloor === "Tầng 1" ? 1 : activeFloor === "Tầng 2" ? 2 : 3).vacant}/10 bàn - {getFloorTableCounts(activeFloor === "Tầng 1" ? 1 : activeFloor === "Tầng 2" ? 2 : 3).seatsVacant} ghế</span>
          </div>

          {/* Right Side: Status Legends precisely matching the picture */}
          <div className="flex items-center gap-4 text-[11px] font-medium text-gray-700">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 bg-gradient-to-br from-[#3490FF] to-[#004ECC] rounded-xs inline-block shadow-3xs" />
              <span>Bàn trống</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 bg-gradient-to-br from-[#aab2b7] to-[#5c6465] rounded-xs inline-block shadow-3xs" />
              <span>Bàn đang phục vụ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 bg-gradient-to-br from-[#f39c12] to-[#d35400] rounded-xs inline-block shadow-3xs" />
              <span>Bàn đặt trước</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Order Online" && (
        <div className="bg-white border-b border-gray-300 h-11 flex items-center justify-between px-3 select-none shrink-0">
          <div className="flex items-center gap-1 text-[13px] font-bold text-gray-800">
            <span>Đơn hàng trực tuyến</span>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      {checkoutOrder ? (
        <div className="flex-1 w-full bg-[#bfbfbf] flex overflow-hidden">
          {/* LEFT SIDEBAR: Thẻ thành viên & Khuyến mại (width 320px) */}
          <div className="w-[320px] bg-white border-r border-gray-300 flex flex-col justify-between shrink-0 font-sans">
            <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
              
              {/* Thẻ thành viên */}
              <div className="bg-[#f2f2f2] border border-gray-300 p-3 rounded-xs space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-[12px] text-gray-700 select-none">
                  <span className="w-2 h-3.5 bg-[#006cb2] inline-block" />
                  <span>Thẻ thành viên</span>
                </div>
                
                {/* Mã thành viên */}
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-500 font-bold block">Mã thành viên</label>
                  <div className="flex border border-gray-300 rounded-sm overflow-hidden bg-white h-7.5 items-center">
                    {/* card icon */}
                    <div className="px-2 text-gray-400 border-r border-gray-250 h-full flex items-center justify-center bg-gray-50">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={checkoutMemberId}
                      onChange={(e) => setCheckoutMemberId(e.target.value)}
                      className="flex-1 px-2.5 font-bold text-gray-800 text-[11.5px] focus:outline-none h-full"
                    />
                    <button 
                      onClick={() => setToast({ message: `Đang tìm thành viên: ${checkoutMemberId}`, type: "info" })}
                      className="h-full px-2.5 bg-gray-100 hover:bg-gray-200 border-l border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Tên thành viên */}
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-500 font-bold block">Tên thành viên</label>
                  <div className="flex gap-1.5 items-center">
                    <div className="flex-1 relative">
                      <select
                        value={checkoutMemberName}
                        onChange={(e) => setCheckoutMemberName(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-sm h-7.5 px-2.5 font-bold text-gray-800 text-[11.5px] appearance-none focus:outline-none focus:border-[#006cb2]"
                      >
                        <option value="a">a</option>
                        <option value="b">Nguyễn Văn A</option>
                        <option value="c">Trần Thị B</option>
                      </select>
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[8px]">▼</span>
                    </div>
                    <button 
                      onClick={() => {
                        const newName = prompt("Nhập tên thành viên mới:");
                        if (newName) {
                          setCheckoutMemberName(newName);
                          setToast({ message: `Đã thêm thành viên ${newName}`, type: "success" });
                        }
                      }}
                      className="w-7.5 h-7.5 bg-white border border-gray-300 hover:border-green-500 text-green-600 font-extrabold text-[16px] rounded-sm flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* SỬ DỤNG ĐIỂM & MÃ ƯU ĐÃI Button */}
                <button
                  onClick={() => setToast({ message: "Đang mở cửa sổ quy đổi điểm và nhập mã ưu đãi...", type: "info" })}
                  className="w-full h-8.5 bg-white hover:bg-[#fafafa] border border-[#006cb2] text-[#006cb2] font-bold text-[11px] rounded-sm flex items-center justify-between px-3 cursor-pointer transition-all uppercase tracking-wide shadow-3xs"
                >
                  <span>Sử dụng điểm & mã ưu đãi</span>
                  <span className="text-[10px] font-extrabold">➔</span>
                </button>
              </div>

              {/* Chương trình khuyến mại */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-[12px] text-[#006cb2] select-none">
                  <Gift className="w-4 h-4" />
                  <span>Chương trình khuyến mại</span>
                </div>
                
                {/* List promotions */}
                <div className="border border-gray-300 rounded-xs bg-white divide-y divide-gray-200">
                  {/* Promo 1: giảm giá hóa đơn 500k */}
                  <label className={`p-3 flex items-start gap-2.5 cursor-pointer transition-colors hover:bg-slate-50 select-none ${isPromo500kChecked ? "bg-sky-50/40" : ""}`}>
                    <input
                      type="checkbox"
                      checked={isPromo500kChecked}
                      onChange={() => {
                        setIsPromo500kChecked(!isPromo500kChecked);
                        if (!isPromo500kChecked) {
                          setIsPromo15Checked(false);
                        }
                      }}
                      className="mt-0.5 rounded text-[#006cb2] focus:ring-[#006cb2] cursor-pointer"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold text-[12px] text-gray-800 block">giảm giá hóa đơn 500k</span>
                      <span className="text-[10px] text-gray-400 block leading-snug">Áp dụng giảm trừ trực tiếp 500.000đ cho hóa đơn đạt yêu cầu</span>
                    </div>
                  </label>

                  {/* Promo 2: Giảm 15% hóa đơn thứ 2 */}
                  <label className={`p-3 flex items-start gap-2.5 cursor-pointer transition-colors hover:bg-slate-50 select-none ${isPromo15Checked ? "bg-sky-50/40" : ""}`}>
                    <input
                      type="checkbox"
                      checked={isPromo15Checked}
                      onChange={() => {
                        setIsPromo15Checked(!isPromo15Checked);
                        if (!isPromo15Checked) {
                          setIsPromo500kChecked(false);
                        }
                      }}
                      className="mt-0.5 rounded text-[#006cb2] focus:ring-[#006cb2] cursor-pointer"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold text-[12px] text-[#006cb2] block">Giảm 15% hóa đơn thứ 2</span>
                      <span className="text-[10px] text-gray-400 block leading-snug">Giảm giá hóa đơn 15% cho hóa đơn phát sinh vào ngày thứ 2 hàng tuần</span>
                    </div>
                  </label>
                </div>

                {/* Bottom of list actions */}
                <div className="flex gap-2 items-center justify-between pt-1 select-none">
                  <button
                    onClick={() => setToast({ message: "Đang tải thêm danh sách chương trình khuyến mại khác...", type: "info" })}
                    className="h-8.5 px-3 bg-white hover:bg-slate-50 border border-gray-300 text-gray-700 font-bold text-[11px] rounded-sm flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <span>+ KHUYẾN MẠI KHÁC</span>
                  </button>
                  <div className="flex gap-1">
                    <button className="w-8.5 h-8.5 bg-white border border-gray-300 hover:bg-slate-50 rounded-sm flex items-center justify-center cursor-pointer text-gray-500 shadow-3xs">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button className="w-8.5 h-8.5 bg-white border border-gray-300 hover:bg-slate-50 rounded-sm flex items-center justify-center cursor-pointer text-gray-500 shadow-3xs">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom button Phím tắt */}
            <div className="p-2 border-t border-gray-300 bg-[#f9f9f9] flex justify-between items-center select-none shrink-0 h-11">
              <button
                onClick={() => alert("Phím tắt màn hình thanh toán:\n- Enter hoặc F9: Thu tiền\n- Esc: Quay lại")}
                className="px-3 py-1 bg-white hover:bg-slate-50 border border-gray-300 text-gray-700 font-bold text-[11px] rounded-xs flex items-center gap-1.5 cursor-pointer h-7 shadow-3xs"
              >
                {/* Finger or lightning hand icon */}
                <svg className="w-3.5 h-3.5 text-[#006cb2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 11V5c0-1.66 1.34-3 3-3s3 1.34 3 3v6c0 .55-.45 1-1 1s-1-.45-1-1V5c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55-.45 1-1 1s-1-.45-1-1zm6 4c0 .55-.45 1-1 1s-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 2.21 1.79 4 4 4h2c2.21 0 4-1.79 4-4v-3c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55-.45 1-1 1s-1-.45-1-1v-3c0-.55-.45-1-1-1s-1 .45-1 1v3z" />
                </svg>
                <span>Phím tắt</span>
              </button>
            </div>
          </div>

          {/* RIGHT WORKSPACE: Bill items table & final calculations summary (flex-1) */}
          <div className="flex-1 bg-[#eeeeee] flex flex-col justify-between overflow-hidden relative">
            
            {/* Upper Table view */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              
              {/* Header inside right workspace */}
              <div className="h-10 border-b border-gray-300 bg-[#f5f5f5] px-4 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCheckoutOrder(null)}
                    className="w-7.5 h-7 bg-white hover:bg-slate-50 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:text-gray-800 font-bold transition-all cursor-pointer shadow-3xs"
                    title="Quay lại danh sách bàn"
                  >
                    ➔
                  </button>
                  <button className="text-gray-400 hover:text-gray-700 cursor-pointer">
                    {/* Pencil icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <span className="font-extrabold text-[13.5px] text-[#006cb2] tracking-wide font-sans">
                    2603000002 - Bàn: {checkoutOrder.tableName}
                  </span>
                </div>
                
                <div className="text-[11.5px] font-bold text-gray-500 font-sans pr-1">
                  07/07/2026 09:38
                </div>
              </div>

              {/* Items Table container */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f0f0f0] border-b border-gray-300 text-gray-500 font-extrabold text-[11px] uppercase h-9 select-none">
                      <th className="pl-4 font-extrabold py-1.5 w-[50%]">Tên món</th>
                      <th className="text-right pr-6 font-extrabold py-1.5 w-[12%]">SL</th>
                      <th className="text-right pr-6 font-extrabold py-1.5 w-[18%]">Đơn giá</th>
                      <th className="text-right pr-6 font-extrabold py-1.5 w-[18%]">Thành tiền</th>
                      <th className="w-10 pr-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {checkoutOrder.items.map((item, idx) => {
                      const isSelected = selectedCheckoutRow === idx;
                      return (
                        <tr
                          key={`${item.id}-${idx}`}
                          onClick={() => setSelectedCheckoutRow(idx)}
                          className={`h-11 transition-colors cursor-pointer select-none font-sans font-bold text-[12px] ${
                            isSelected ? "bg-[#e2eef7] text-[#006cb2]" : "hover:bg-slate-50 text-gray-800"
                          }`}
                        >
                          {/* Item Name */}
                          <td className="pl-4 py-2 font-bold font-sans">
                            {item.name}
                          </td>
                          {/* Qty formatted as float x.xx, editable in checkout */}
                          <td className="text-right pr-6 py-1">
                            <div className="flex justify-end">
                              <input
                                type="text"
                                value={
                                  checkoutFocusedId === item.id 
                                    ? (checkoutTempQtyValues[item.id] !== undefined ? checkoutTempQtyValues[item.id] : item.qty.toString()) 
                                    : item.qty.toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',')
                                }
                                onFocus={() => {
                                  setCheckoutFocusedId(item.id);
                                  setCheckoutTempQtyValues({ ...checkoutTempQtyValues, [item.id]: item.qty.toString() });
                                }}
                                onBlur={() => {
                                  setCheckoutFocusedId(null);
                                  if (checkoutTempQtyValues[item.id] === "" || isNaN(parseFloat(checkoutTempQtyValues[item.id]?.replace(',', '.')))) {
                                    const updatedTemp = { ...checkoutTempQtyValues };
                                    delete updatedTemp[item.id];
                                    setCheckoutTempQtyValues(updatedTemp);
                                  }
                                }}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCheckoutTempQtyValues({ ...checkoutTempQtyValues, [item.id]: val });
                                  const normalized = val.replace(',', '.');
                                  const parsed = parseFloat(normalized);
                                  if (!isNaN(parsed) && parsed >= 0) {
                                    handleUpdateCheckoutQty(item.id, parsed);
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className={`w-[52px] h-[28px] text-center text-[12px] font-bold text-gray-900 rounded focus:outline-none focus:ring-1 focus:ring-[#006cb2] focus:border-[#006cb2] font-sans ${
                                  checkoutFocusedId === item.id ? "bg-white border border-gray-400" : "bg-[#dfdfdf] border border-transparent"
                                }`}
                              />
                            </div>
                          </td>
                          {/* Price formatted with dots */}
                          <td className="text-right pr-6 font-bold font-sans">
                            {formatMoney(item.price)}
                          </td>
                          {/* Total Line item price formatted with dots */}
                          <td className="text-right pr-6 font-bold font-sans">
                            {formatMoney(item.price * item.qty)}
                          </td>
                          {/* Gift Icon block */}
                          <td className="pr-4 py-1 text-center">
                            <div className="w-6.5 h-6.5 bg-[#fcdbdc] hover:bg-[#fabec0] rounded flex items-center justify-center text-red-600 transition-colors mx-auto" title="Quà tặng">
                              <Gift className="w-3.5 h-3.5 text-[#e74c3c]" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Calculations and summary fields */}
            {(() => {
              const subtotal = checkoutOrder.total;
              const isMockupOrder = subtotal === 627000 || checkoutOrder.tableName.includes("101") || checkoutOrder.tableName.includes("102");
              
              let discount = 0;
              let discountLabel = "";
              if (isPromo15Checked) {
                discount = isMockupOrder ? 500000 : Math.round(subtotal * 0.15);
                discountLabel = "Giảm 15% hóa đơn thứ 2";
              } else if (isPromo500kChecked) {
                discount = Math.min(subtotal, 500000);
                discountLabel = "giảm giá hóa đơn 500k";
              }

              const taxableAmount = Math.max(0, subtotal - discount);
              let tax = 0;
              if (isCheckoutTaxChecked) {
                tax = isMockupOrder ? 10674.481 : Math.round(taxableAmount * 0.08);
              }

              const totalPayable = taxableAmount + tax;

              return (
                <div className="bg-[#fcfcfc] border-t border-gray-300 p-4 shrink-0 font-sans text-xs">
                  <div className="grid grid-cols-12 gap-8 items-start">
                    
                    {/* Left block of summary */}
                    <div className="col-span-7 space-y-2">
                      {/* Subtotal row */}
                      <div className="flex justify-between items-center text-[13px] font-bold text-gray-800">
                        <span>Thành tiền</span>
                        <span className="font-extrabold text-[15.5px] text-gray-950 font-sans">
                          {formatMoney(subtotal)}
                        </span>
                      </div>

                      {/* Active discounts list */}
                      {discount > 0 && (
                        <div className="flex items-center justify-between bg-[#fdf3f2] border border-red-100 px-2.5 py-1.5 rounded-sm text-[12px] font-bold text-red-700">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsPromo15Checked(false);
                                setIsPromo500kChecked(false);
                              }}
                              className="w-5 h-5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded flex items-center justify-center cursor-pointer text-[10px] font-extrabold shrink-0"
                              title="Gỡ khuyến mại"
                            >
                              ✕
                            </button>
                            <span>{discountLabel}</span>
                          </div>
                          <span className="font-sans text-[13px] text-red-600">
                            {formatMoney(discount)}
                          </span>
                        </div>
                      )}

                      {/* Checkbox: Tiền thuế */}
                      <div className="flex justify-between items-center pt-1">
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isCheckoutTaxChecked}
                            onChange={() => setIsCheckoutTaxChecked(!isCheckoutTaxChecked)}
                            className="rounded text-[#006cb2] focus:ring-[#006cb2] cursor-pointer"
                          />
                          <span>Tiền thuế</span>
                        </label>
                        {isCheckoutTaxChecked ? (
                          <span className="font-bold text-gray-800 font-sans text-[12px]">
                            {isMockupOrder ? "10.674,481" : formatMoney(tax)}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-semibold font-sans">0</span>
                        )}
                      </div>

                      {/* Checkbox: Khách lấy hóa đơn GTGT */}
                      <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer select-none">
                          <input
                            id="tour-invoice-chk"
                            type="checkbox"
                            checked={isCheckoutReceiptChecked}
                            onChange={() => {
                              setIsCheckoutReceiptChecked(!isCheckoutReceiptChecked);
                              if (orderTourStep === 10) {
                                setOrderTourStep(11);
                              }
                            }}
                            className="rounded text-[#006cb2] focus:ring-[#006cb2] cursor-pointer"
                          />
                          <span>Khách lấy hóa đơn GTGT</span>
                        </label>
                        <button
                          id="tour-invoice-details-btn"
                          onClick={() => {
                            setShowEInvoiceModal(true);
                            if (orderTourStep === 11) {
                              setInvoiceCustomerName("Nguyễn Văn Minh");
                              setInvoiceCustomerPhone("0987654321");
                              setInvoiceCustomerEmail("minhnv@misa.com.vn");
                              setInvoiceTaxCode("0101243124");
                              setInvoiceCompanyName("Công ty Cổ phần MISA");
                              setInvoiceCompanyAddress("Tòa nhà Tháp B, tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội");
                              setOrderTourStep(12);
                            }
                          }}
                          className="text-[#006cb2] hover:underline font-bold text-[11px] cursor-pointer"
                        >
                          Xem chi tiết &gt;&gt;
                        </button>
                      </div>
                    </div>

                    {/* Right block of summary */}
                    <div className="col-span-5 border-l border-gray-200 pl-8 space-y-3">
                      
                      {/* Tổng thanh toán */}
                      <div className="flex justify-between items-baseline text-[13px] font-bold text-gray-800">
                        <span className="shrink-0">Tổng thanh toán</span>
                        <span className="font-extrabold text-[20px] text-black font-sans tracking-tight text-right w-full">
                          {isMockupOrder ? "137.674,481" : formatMoney(totalPayable)}
                        </span>
                      </div>

                      {/* Voucher button */}
                      <div className="flex justify-end pt-0.5">
                        <button
                          onClick={() => setToast({ message: "Vui lòng nhập hoặc chọn mã Voucher giảm giá...", type: "info" })}
                          className="px-3.5 py-1.5 border border-gray-300 hover:bg-slate-50 rounded bg-white text-gray-700 font-bold text-[11.5px] flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
                        >
                          <Gift className="w-3.5 h-3.5 text-gray-400" />
                          <span>Voucher</span>
                        </button>
                      </div>

                      {/* Còn phải thu */}
                      <div id="tour-total-amount-box" className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-[13px] font-bold text-gray-800">
                        <span className="shrink-0">Còn phải thu</span>
                        <span className="font-extrabold text-[20px] text-black font-sans tracking-tight text-right w-full">
                          {isMockupOrder ? "137.674,481" : formatMoney(totalPayable)}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* Horizontal dividers & Bottom buttons bar exactly matching image */}
                  <div className="mt-4 pt-3.5 border-t border-gray-200 flex justify-between items-center select-none shrink-0 text-xs">
                    
                    {/* Back / Quay lại button */}
                    <button
                      onClick={() => setCheckoutOrder(null)}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-gray-300 text-[#006cb2] font-extrabold text-[12px] rounded-xs flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
                    >
                      <span>&lt;</span>
                      <span>QUAY LẠI</span>
                    </button>

                    {/* Right core checkouts actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setToast({ message: "Tính năng Tách Hóa Đơn (Tách món hoặc tách đều đầu người).", type: "info" })}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-gray-300 text-[#006cb2] font-bold text-[11.5px] rounded-xs cursor-pointer shadow-3xs transition-colors"
                      >
                        TÁCH HĐ
                      </button>
                      <button
                        onClick={() => setToast({ message: "Đang in phiếu tạm tính cho bếp và quầy thu ngân...", type: "success" })}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-gray-300 text-[#006cb2] font-bold text-[11.5px] rounded-xs flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#006cb2]" />
                        <span>IN TẠM TÍNH</span>
                      </button>
                      <button
                        onClick={() => {
                          setToast({ message: `Đã lưu tạm hóa đơn cho ${checkoutOrder.tableName} thành công!`, type: "success" });
                          setCheckoutOrder(null);
                        }}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-gray-300 text-[#006cb2] font-bold text-[11.5px] rounded-xs cursor-pointer shadow-3xs transition-colors"
                      >
                        LƯU TẠM HĐ
                      </button>
                      <button
                        id="tour-thutien-trigger-btn"
                        onClick={() => {
                          const isMock = checkoutOrder.tableName.includes("101") || checkoutOrder.tableName.includes("102");
                          const amount = isMock ? 214000 : totalPayable;
                          
                          setPaymentDetailsList([
                            { method: "Tiền mặt", amount: amount }
                          ]);
                          setPaymentInputAmount("0");
                          setPaymentSelectedMethod("TIỀN MẶT");
                          setShowPaymentModal(true);

                          if (orderTourStep === 12) {
                            setPaymentSelectedMethod("QRCode");
                            setOrderTourStep(13);
                          }
                        }}
                        className="px-5 py-2 bg-[#f27b23] hover:bg-[#de6c1a] text-white border border-[#f27b23] font-bold text-[12px] rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
                      >
                        <span className="font-extrabold text-[14px]">$</span>
                        <span className="tracking-wide">THU TIỀN</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      ) : activeTab === "Sơ đồ" ? (
        <div className="flex-1 w-full bg-[#bfbfbf] flex overflow-hidden">
          {/* Sidebar Left: Level selector */}
          <div className="w-44 bg-white border-r border-gray-300 flex flex-col justify-between shrink-0">
            <div className="flex-1 py-1">
              {[
                { name: "Tầng 1", count: getFloorTableCounts(1).vacant },
                { name: "Tầng 2", count: getFloorTableCounts(2).vacant },
                { name: "Tầng 3", count: getFloorTableCounts(3).vacant },
              ].map((floor) => {
                const isSelected = activeFloor === floor.name;
                return (
                  <button
                    key={floor.name}
                    onClick={() => setActiveFloor(floor.name as any)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-2.5 font-bold text-[13px] transition-all border-b border-gray-100 cursor-pointer ${
                      isSelected
                        ? "bg-[#e2eef7] text-[#006cb2]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {/* Blue square icon prefix like in image */}
                    <span className="w-2.5 h-2.5 bg-[#006cb2] inline-block shrink-0" />
                    <span className={isSelected ? "text-[#e67e22]" : ""}>{floor.name}</span>
                    <span className="text-[#006cb2] font-semibold">({floor.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom of sidebar: Chevron-up and chevron-down buttons side-by-side inside a border-t */}
            <div className="p-2 border-t border-gray-300 bg-[#f9f9f9] flex gap-2 justify-center select-none">
              <button 
                onClick={() => {
                  if (activeFloor === "Tầng 3") setActiveFloor("Tầng 2");
                  else if (activeFloor === "Tầng 2") setActiveFloor("Tầng 1");
                }}
                className="flex-1 h-8 bg-white border border-gray-300 hover:bg-gray-50 active:scale-95 rounded-sm flex items-center justify-center cursor-pointer shadow-3xs"
              >
                <ChevronUp className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={() => {
                  if (activeFloor === "Tầng 1") setActiveFloor("Tầng 2");
                  else if (activeFloor === "Tầng 2") setActiveFloor("Tầng 3");
                }}
                className="flex-1 h-8 bg-white border border-gray-300 hover:bg-gray-50 active:scale-95 rounded-sm flex items-center justify-center cursor-pointer shadow-3xs"
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Main Sơ đồ Area (with white background workspace container filling completely) */}
          <div className="flex-1 bg-white overflow-y-auto p-8 md:p-12 relative flex flex-col items-center justify-start min-h-0 select-none">
            
            {/* Double doors visual layout indicator precisely placed on the left edge/wall */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-20 flex items-center justify-start z-10 pointer-events-none opacity-40">
              {/* Visual SVG of double swinging doors as seen in image */}
              <svg className="w-8 h-24 text-gray-400 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 32 96">
                {/* Left swinging door arc */}
                <path d="M 0 10 A 16 16 0 0 1 16 26 L 16 48 L 0 48" />
                {/* Right swinging door arc */}
                <path d="M 0 86 A 16 16 0 0 0 16 70 L 16 48 L 0 48" />
                {/* Door frames */}
                <line x1="0" y1="10" x2="0" y2="86" />
              </svg>
            </div>

            {/* Grid of Tables in balanced, beautifully spaced responsive columns */}
            <div className="w-full max-w-5xl flex-1 flex items-center justify-center py-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 md:gap-x-12 gap-y-10 md:gap-y-12 justify-items-center items-center justify-center w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const floorNum = activeFloor === "Tầng 1" ? 1 : activeFloor === "Tầng 2" ? 2 : 3;
                  const tableNum = floorNum * 100 + num;
                  const isOccupied = isTableOccupied(tableNum);
                  return renderTableUI(tableNum, isOccupied);
                })}
              </div>
            </div>

          </div>
        </div>
      ) : activeTab === "Order Online" ? (
        <div className="flex-1 w-full bg-[#bfbfbf] p-4 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-lg p-6 select-none bg-white/60 rounded border border-gray-300">
            <Globe className="w-16 h-16 text-gray-400 mb-4 animate-pulse" />
            <p className="text-gray-600 font-semibold text-[15px] leading-relaxed">
              Không có đơn hàng trực tuyến nào mới trong phiên bán hàng này.
            </p>
          </div>
        </div>
      ) : isOrdering ? (
        <div className="flex-1 flex flex-col md:flex-row bg-[#cbd5e1] overflow-hidden">
          
          {/* LEFT SIDE: Menu & Categories (60% width on desktop) */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-gray-300">
            
            {/* Category Tabs */}
            <div className="bg-[#f0f2f5] border-b border-gray-300 px-3 py-2 shrink-0 select-none">
              <div className="flex w-full border border-gray-300 divide-x divide-gray-300 rounded-sm overflow-hidden bg-[#f2f2f2] shadow-2xs">
                {[
                  { 
                    name: "Hay dùng", 
                    icon: (isActive: boolean) => (
                      <Heart className={`w-4 h-4 ${isActive ? "fill-white text-white" : "text-[#006cb2]"}`} />
                    )
                  },
                  { 
                    name: "Món ăn", 
                    icon: (isActive: boolean) => (
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={`w-4 h-4 ${isActive ? "text-white" : "text-[#006cb2]"}`}
                      >
                        {/* Steam on the left */}
                        <path d="M8 3.5c.3-.8.7-.8.9-.2.2.5-.2 1 0 1.5" />
                        {/* Handle loop */}
                        <path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                        {/* Dome */}
                        <path d="M4.5 17a7.5 7.5 0 0 1 15 0" strokeDasharray="" />
                        {/* Base plate */}
                        <path d="M2.5 18a1.5 1.5 0 0 0 1.5 1.5h16a1.5 1.5 0 0 0 1.5-1.5h-19z" />
                      </svg>
                    )
                  },
                  { 
                    name: "Đồ uống", 
                    icon: (isActive: boolean) => (
                      <Wine className={`w-4 h-4 ${isActive ? "text-white" : "text-[#006cb2]"}`} />
                    )
                  },
                  { 
                    name: "Combo", 
                    icon: (isActive: boolean) => (
                      <LayoutGrid className={`w-4 h-4 ${isActive ? "text-white" : "text-[#006cb2]"}`} />
                    )
                  },
                  { 
                    name: "Khác", 
                    icon: (isActive: boolean) => (
                      <Puzzle className={`w-4 h-4 ${isActive ? "text-white" : "text-[#006cb2]"}`} />
                    )
                  }
                ].map((cat) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex-1 py-2 px-1 flex items-center justify-center gap-1.5 text-[11px] sm:text-[12px] font-bold transition-all cursor-pointer select-none ${
                        isActive
                          ? "bg-[#006cb2] text-white"
                          : "bg-[#f2f2f2] hover:bg-[#e6e6e6] text-[#006cb2]"
                      }`}
                    >
                      {cat.icon(isActive)}
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Search Bar */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2 shrink-0 select-none">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  placeholder="Nhập mã hoặc tên món cần tìm..."
                  className="w-full bg-white border border-gray-300 pl-8 pr-3 py-1.5 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-[#006cb2] focus:border-[#006cb2] placeholder-gray-400 font-medium h-9 text-gray-800"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                {menuSearchQuery && (
                  <button
                    onClick={() => setMenuSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Dishes Grid Catalog */}
            <div id="tour-dish-catalog" className="flex-1 overflow-y-auto p-3.5 bg-[#f0f4f8]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {PHONG_DE_MENU.filter((item) => {
                  let matchesCategory = true;
                  if (activeCategory === "Hay dùng") {
                    matchesCategory = ["MA01", "MA02", "MA03", "MA04", "MA05", "MA08", "DU01", "DU02", "DU03", "MA36"].includes(item.id);
                  } else if (activeCategory === "Món ăn") {
                    matchesCategory = item.type === "Đồ ăn" && item.category !== "Lẩu";
                  } else if (activeCategory === "Đồ uống") {
                    matchesCategory = item.type === "Đồ uống";
                  } else if (activeCategory === "Combo") {
                    matchesCategory = item.category === "Lẩu" || item.name.toLowerCase().includes("combo");
                  } else if (activeCategory === "Khác") {
                    matchesCategory = item.category === "Rau & Canh" || (item.category === "Khai vị" && !["MA01", "MA02", "MA03", "MA04", "MA05", "MA08", "DU01", "DU02", "DU03", "MA36"].includes(item.id));
                  }

                  const matchesSearch =
                    item.id.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
                    item.name.toLowerCase().includes(menuSearchQuery.toLowerCase());

                  return matchesCategory && matchesSearch;
                }).map((item) => {
                  const formattedPrice = item.price >= 1000000 
                    ? (item.price / 1000).toLocaleString('vi-VN') + 'K' 
                    : Math.round(item.price / 1000).toLocaleString('vi-VN') + 'K';

                  return (
                    <div
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="bg-white rounded-md border border-[#d3d3d3] hover:border-[#006cb2] hover:shadow-md transition-all flex flex-col cursor-pointer relative group select-none overflow-hidden h-[155px]"
                    >
                      {/* Price Tag Badge */}
                      <span className="absolute top-0 right-0 bg-[#4da6ff] text-white text-[12px] font-bold px-2 py-1.5 z-10 shadow-sm leading-none">
                        {formattedPrice}
                      </span>

                      {/* Realistic Representative Image */}
                      <div className="w-full h-[105px] bg-[#f8f9fa] flex items-center justify-center overflow-hidden border-b border-gray-200 relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";
                            }}
                          />
                        ) : (
                          <img
                            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>

                      {/* Content block: Centered Title only with Light Gray background */}
                      <div className="flex-1 p-2 flex items-center justify-center text-center bg-[#f2f2f2]">
                        <p className="text-gray-900 font-semibold text-[12px] leading-tight line-clamp-2 px-0.5 group-hover:text-[#006cb2] transition-colors">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-2 px-3 flex justify-between items-center select-none shrink-0">
              <button
                onClick={() => alert("Chức năng Phím tắt bàn phím bán hàng.")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold text-xs px-3 py-1.5 rounded-sm shadow-3xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <span>⌨️</span>
                <span>Phím tắt</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => alert("Trang trước")}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 p-1.5 rounded-sm shadow-3xs cursor-pointer transition-all active:scale-95"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert("Trang sau")}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 p-1.5 rounded-sm shadow-3xs cursor-pointer transition-all active:scale-95"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Cart Billing and Action Form (40% width on desktop) */}
          <div className="w-full md:w-[420px] lg:w-[460px] shrink-0 bg-white flex flex-col overflow-hidden">
            
            {/* Top Toolbar matching mockup row */}
            <div className="p-2 bg-[#f4f4f4] border-b border-gray-300 flex items-center gap-1.5 shrink-0 select-none">
              
              {/* Order type selector */}
              <select
                value={newOrderType === "Chờ thanh toán" ? "Tại bàn" : newOrderType}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "Tại bàn") setNewOrderType("Chờ thanh toán");
                  else setNewOrderType(val as any);
                }}
                className="bg-white border border-gray-300 text-gray-800 font-bold text-[11px] rounded-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#006cb2] cursor-pointer shadow-3xs h-8"
              >
                <option value="Tại bàn">1.1 Tại bàn</option>
                <option value="Mang về">Mang về</option>
                <option value="Chờ giao hàng">Giao hàng</option>
                <option value="Đặt trước">Đặt trước</option>
              </select>

              {/* Table code select box */}
              <div id="tour-table-select-box" className="flex-1 flex items-center bg-white border border-gray-300 rounded-xs h-8 pl-1.5 overflow-hidden">
                <input
                  type="text"
                  value={newTableName}
                  readOnly
                  placeholder="Chọn bàn..."
                  className="flex-1 bg-transparent text-xs font-bold text-gray-800 focus:outline-none placeholder-gray-400"
                />
                <button
                  onClick={() => {
                    const match = newTableName.match(/\d+/);
                    const initialTableNum = match ? parseInt(match[0]) : 101;
                    setTempSelectedTable(initialTableNum);
                    const floorIndex = Math.floor(initialTableNum / 100);
                    const initialFloor = floorIndex === 2 ? "Tầng 2" : floorIndex === 3 ? "Tầng 3" : "Tầng 1";
                    setAssignTableFloor(initialFloor as any);
                    setAssignTableSearch("");
                    setShowAssignTableModal(true);
                  }}
                  className="px-2 h-full bg-[#f4f4f4] hover:bg-gray-200 border-l border-gray-300 text-gray-600 flex items-center justify-center cursor-pointer active:bg-gray-300"
                  title="Xếp bàn"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Guest count input trigger */}
              <button
                onClick={() => {
                  const count = prompt("Nhập số lượng khách:", String(newCustomerCount || 1));
                  if (count !== null) {
                    setNewCustomerCount(Math.max(0, parseInt(count) || 0));
                  }
                }}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-xs px-2 h-8 flex items-center gap-1 cursor-pointer shadow-3xs shrink-0"
                title="Số lượng khách"
              >
                <User className="w-3.5 h-3.5 text-[#006cb2] fill-current" />
                <span className="text-xs font-bold text-gray-800">{newCustomerCount || 0}</span>
              </button>

              {/* Note creator */}
              <button
                onClick={() => {
                  const note = prompt("Nhập ghi chú cho order này:", currentOrderNote);
                  if (note !== null) {
                    setCurrentOrderNote(note);
                    setToast({ message: "Đã cập nhật ghi chú cho đơn hàng", type: "success" });
                  }
                }}
                className="bg-white hover:bg-gray-50 border border-gray-300 p-1.5 rounded-xs h-8 w-8 flex items-center justify-center cursor-pointer shadow-3xs shrink-0"
                title="Thêm ghi chú đơn hàng"
              >
                <FileText className="w-4 h-4 text-[#006cb2]" />
              </button>

              {/* Reset button "R" */}
              <button
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn xóa sạch giỏ hàng hiện tại?")) {
                    setCartItems([]);
                    setToast({ message: "Đã xóa toàn bộ giỏ hàng nháp", type: "info" });
                  }
                }}
                className="bg-[#006cb2] hover:bg-[#005288] text-white font-extrabold text-xs h-8 w-8 rounded-xs flex items-center justify-center cursor-pointer shadow-sm shrink-0"
                title="Khởi tạo lại giỏ hàng (Reset)"
              >
                R
              </button>
            </div>

            {/* Table Header block for Cart list */}
            <div className="grid grid-cols-12 bg-[#f2f2f2] border-b border-gray-300 text-gray-800 font-bold text-[12px] py-2 px-3 select-none items-center font-sans">
              <span className="col-span-6">Tên món</span>
              <span className="col-span-2 text-center">SL</span>
              <span className="col-span-3 text-right pr-4">Thành tiền</span>
              <span className="col-span-1"></span>
            </div>

            {/* Cart Items List Area */}
            <div className="flex-1 overflow-y-auto bg-white">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none bg-slate-50/50">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 text-gray-300">
                    <svg className="w-8 h-8 stroke-current" fill="none" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-bold text-xs max-w-xs leading-relaxed">
                    Vui lòng chọn món phía bên trái để ghi order cho {newTableName || "bàn đang chọn"}.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, idx) => {
                    const isSelected = selectedCartItemId === item.id;
                    return (
                      <div 
                        key={`${item.id}-${idx}`} 
                        onClick={() => setSelectedCartItemId(item.id)}
                        className={`p-2 px-3 transition-all flex flex-col justify-center border-b border-gray-200 cursor-pointer ${
                          isSelected ? "bg-[#9bcbe9]" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="grid grid-cols-12 items-center gap-2">
                          {/* Title block - ONLY ITEM NAME with steaming pot icon on left if sent to kitchen */}
                          <div className="col-span-6 flex items-center gap-2">
                            {item.isSent ? (
                              <svg className="w-[18px] h-[18px] text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" title="Đã gửi bếp">
                                {/* Steam lines */}
                                <path d="M8 4C8 3 8.5 2.5 8.5 2M12 4C12 3 12.5 2.5 12.5 2M16 4C16 3 16.5 2.5 16.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                {/* Pot lid */}
                                <path d="M5 8H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M10 8V6.5C10 6.2 10.2 6 10.5 6H13.5C13.8 6 14 6.2 14 6.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                {/* Pot body */}
                                <path d="M6 9V13.5C6 15.5 7.5 17 9.5 17H14.5C16.5 17 18 15.5 18 13.5V9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                {/* Handles */}
                                <path d="M6 10.5H4V12H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18 10.5H20V12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : (
                              <div className="w-[18px] h-[18px] shrink-0" />
                            )}
                            <p className="font-bold text-[12px] text-gray-900 leading-snug font-sans">
                              {item.name}
                            </p>
                          </div>

                          {/* Quantity inputs directly editable when clicked */}
                          <div className="col-span-2 flex justify-center">
                            <input
                              type="text"
                              id={(item.id === "p1" || idx === 0) ? "tour-qty-input" : undefined}
                              value={
                                focusedId === item.id 
                                  ? (tempQtyValues[item.id] !== undefined ? tempQtyValues[item.id] : item.qty.toString()) 
                                  : item.qty.toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',')
                              }
                              onFocus={() => {
                                setFocusedId(item.id);
                                setTempQtyValues({ ...tempQtyValues, [item.id]: item.qty.toString() });
                              }}
                              onBlur={() => {
                                setFocusedId(null);
                                if (item.qty <= 0) {
                                  setCartItems(cartItems.filter(i => i.id !== item.id));
                                }
                              }}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTempQtyValues({ ...tempQtyValues, [item.id]: val });
                                const normalized = val.replace(',', '.');
                                const parsed = parseFloat(normalized);
                                if (!isNaN(parsed) && parsed >= 0) {
                                  setCartItems(
                                    cartItems.map((i) =>
                                      i.id === item.id ? { ...i, qty: parsed } : i
                                    )
                                  );
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`w-[52px] h-[28px] text-center text-[12px] font-bold text-gray-900 rounded focus:outline-none focus:ring-1 focus:ring-[#006cb2] focus:border-[#006cb2] font-sans ${
                                focusedId === item.id ? "bg-white border border-gray-400" : "bg-[#dfdfdf] border border-transparent"
                              }`}
                            />
                          </div>

                          {/* Total price block */}
                          <div className="col-span-3 text-right font-bold text-[12px] text-gray-900 font-sans pr-4">
                            {formatMoney(item.price * item.qty)}
                          </div>

                          {/* Action column with button (blue vertical 3-dots if sent, red X if draft) */}
                          <div className="col-span-1 flex justify-center">
                            {item.isSent ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setToast({ message: `Thao tác bổ sung cho món ${item.name} (Đã gửi bếp)`, type: "info" });
                                }}
                                className="w-7 h-7 bg-white hover:bg-slate-100 border border-gray-300 rounded flex items-center justify-center text-[#006cb2] font-extrabold text-[16px] cursor-pointer transition-all"
                                title="Thao tác món"
                              >
                                ⋮
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changeQty(item.id, -item.qty);
                                }}
                                className="w-7 h-7 bg-white hover:bg-red-50 border border-gray-300 rounded flex items-center justify-center text-red-600 font-bold text-[14px] cursor-pointer transition-all"
                                title="Xóa món"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick action buttons row: + Thêm món khác, Gift, scroll triggers */}
            <div className="p-2 border-t border-gray-200 bg-[#fbfbfb] flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setMenuSearchQuery("");
                    setToast({ message: "Vui lòng chọn món ăn ở danh mục bên trái", type: "info" });
                  }}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-[#008d3c] hover:text-[#007431] font-bold text-[11px] h-7 px-3.5 rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>+</span>
                  <span>Thêm món khác</span>
                </button>

                <button
                  onClick={() => alert("Chức năng tặng quà / khuyến mãi món ăn.")}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-red-500 hover:text-red-600 p-1 rounded-xs flex items-center justify-center cursor-pointer w-7 h-7 transition-colors"
                  title="Tặng món khuyến mãi"
                >
                  <Gift className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => alert("Cuộn lên")}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-600 p-1 rounded-xs flex items-center justify-center cursor-pointer w-7 h-7"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => alert("Cuộn xuống")}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-600 p-1 rounded-xs flex items-center justify-center cursor-pointer w-7 h-7"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom calculation details & Waiter display matching mockup */}
            <div className="p-3 bg-[#f2f2f2] border-t border-gray-300 select-none shrink-0 flex items-center justify-between relative">
              <div>
                <select
                  value={waiterName}
                  onChange={(e) => setWaiterName(e.target.value)}
                  className="bg-white border border-[#b8d2e6] text-gray-700 text-[12px] font-semibold rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#006cb2] cursor-pointer h-8 text-[12px] font-sans"
                >
                  <option value="">Nhân viên phục vụ</option>
                  <option value="Chu Thị Trang">Chu Thị Trang</option>
                  <option value="Nguyễn Văn Phong">Nguyễn Văn Phong</option>
                  <option value="Lê Thị Mai">Lê Thị Mai</option>
                  <option value="Trần Đình Hùng">Trần Đình Hùng</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold text-gray-800 font-sans">Tổng tiền</span>
                <span className="text-[15px] font-extrabold text-gray-900 font-sans tracking-wide">
                  {formatMoney(cartItems.reduce((sum, i) => sum + i.price * i.qty, 0))}
                </span>
                <button 
                  onClick={() => alert("Thông tin đơn hàng")}
                  className="text-[#006cb2] hover:opacity-85 transition-opacity shrink-0 cursor-pointer flex items-center justify-center"
                >
                  <Info className="w-[18px] h-[18px] fill-[#006cb2] text-white stroke-2" />
                </button>
              </div>

              {/* Jagged / Sawtooth Receipt bottom edge */}
              <div className="absolute left-0 right-0 bottom-[-8px] h-[8px] w-full z-10 pointer-events-none overflow-hidden">
                <div 
                  className="w-full h-full drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.18)]" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 12' width='24' height='12'%3E%3Cpolygon points='0,0 12,12 24,0' fill='%23f2f2f2'/%3E%3C/svg%3E")`,
                    backgroundSize: '16px 8px',
                    backgroundRepeat: 'repeat-x'
                  }} 
                />
              </div>
            </div>

            {/* Footer controls: 5 Buttons layout row */}
            <div className="flex items-center justify-between w-full p-2 border-t border-gray-300 bg-[#eaeaea] shrink-0 select-none h-[68px]">
              {/* Left group / Gửi bếp/bar button */}
              <button
                id="tour-send-kitchen-btn"
                onClick={handleSendToKitchen}
                disabled={cartItems.length === 0}
                className={`w-[24%] min-w-[76px] max-w-[110px] h-[52px] border font-bold text-[11px] rounded-sm flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all shrink-0 ${
                  cartItems.length === 0
                    ? "bg-[#f4f4f4] text-[#b0b0b0] border-[#e2e2e2] cursor-not-allowed"
                    : "bg-white hover:bg-gray-50 text-[#777777] border-[#d9d9d9] cursor-pointer"
                }`}
              >
                <div className="relative w-7 h-5 flex items-center justify-center">
                  <svg className={`w-[22px] h-[22px] ${cartItems.length === 0 ? "text-[#b0b0b0]" : "text-[#777777]"}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-2.4 0-4.38 1.56-5 3.73-.78-.42-1.67-.73-2.65-.73-2.4 0-4.35 1.8-4.35 4 0 1.25.64 2.37 1.63 3.09C1.12 12.63 1 13.3 1 14c0 2.2 1.8 4 4 4h14c2.2 0 4-1.8 4-4 0-.7-.12-1.37-.63-1.91.99-.72 1.63-1.84 1.63-3.09 0-2.2-1.95-4-4.35-4-.98 0-1.87.31-2.65.73C16.38 3.56 14.4 2 12 2zm-3 18h6v2H9v-2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium font-sans whitespace-nowrap">Gửi bếp/bar</span>
              </button>

              {/* Right group buttons */}
              <div className="flex items-center gap-1 flex-1 justify-end">
                <button
                  onClick={handleCancelOrder}
                  className="w-[18%] min-w-[50px] max-w-[75px] h-[52px] bg-white hover:bg-red-50 text-[#d91a1a] border border-[#d9d9d9] font-bold text-[11px] rounded-sm cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all shrink-0"
                >
                  <svg className="w-5 h-5 text-red-600 stroke-[3.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span className="text-[11px] font-medium font-sans whitespace-nowrap">Hủy bỏ</span>
                </button>

                <button
                  id="tour-save-btn"
                  onClick={handleCommitOrder}
                  className="w-[18%] min-w-[50px] max-w-[75px] h-[52px] bg-white hover:bg-blue-50 text-[#006cb2] border border-[#d9d9d9] font-bold text-[11px] rounded-sm cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all shrink-0"
                >
                  <svg className="w-5 h-5 text-[#006cb2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                  </svg>
                  <span className="text-[11px] font-medium font-sans whitespace-nowrap">Cất</span>
                </button>

                <button
                  onClick={handleCommitAndAddOrder}
                  className="w-[32%] min-w-[85px] max-w-[115px] h-[52px] bg-[#009d3e] hover:bg-[#008534] text-white border border-[#009d3e] font-bold text-[11px] rounded-sm cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all shrink-0 shadow-sm"
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                    </svg>
                    <span className="absolute right-[-4px] top-[-3px] text-white text-[13px] font-extrabold leading-none">+</span>
                  </div>
                  <span className="text-[11px] font-medium font-sans whitespace-nowrap">Cất & Thêm</span>
                </button>

                <button
                  id="tour-checkout-btn"
                  onClick={handlePayment}
                  className="w-[26%] min-w-[72px] max-w-[95px] h-[52px] bg-[#f27b23] hover:bg-[#de6c1a] text-white border border-[#f27b23] font-bold text-[11px] rounded-sm cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all shrink-0 shadow-sm"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="5" y="3" width="14" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 7h6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 11h2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 11h2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 15h2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 15h2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 18h2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 18h2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[11px] font-medium font-sans">Tính tiền</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full bg-[#bfbfbf] flex flex-col overflow-hidden">
          
          {/* Toolbar matching mockup */}
          <div className="bg-[#f2f2f2] border-b border-gray-300 p-2.5 flex flex-wrap items-center justify-between gap-3 select-none shrink-0">
            {/* Status filter buttons */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(["Chờ thanh toán", "Mang về", "Chờ giao hàng", "Đặt trước"] as const).map((status) => {
                const isActive = filterStatus === status;
                const count = countByStatus(status);
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`h-[28px] px-3.5 text-[12px] font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-[#006cb2] border border-[#005a96] text-white rounded-xs shadow-3xs"
                        : "bg-[#e8e8e8] border border-gray-300 text-gray-800 hover:bg-gray-100 rounded-xs"
                    }`}
                  >
                    <span>{status}</span>
                    <span className="ml-1 font-bold">({count})</span>
                  </button>
                );
              })}

              {/* Select Tìm số order ▾ */}
              <div className="relative">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-white border border-gray-300 text-gray-800 font-bold px-3.5 h-[28px] text-[12px] rounded-xs focus:outline-none cursor-pointer appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234a5568%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-[right_10px_center] bg-no-repeat"
                >
                  <option value={filterStatus}>Tìm số order</option>
                  <option value="Chờ thanh toán">Chờ thanh toán</option>
                  <option value="Mang về">Mang về</option>
                  <option value="Chờ giao hàng">Chờ giao hàng</option>
                  <option value="Đặt trước">Đặt trước</option>
                </select>
              </div>
            </div>

            {/* Search and view toggle */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="relative flex-1 sm:w-60">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo số order"
                  className="w-full bg-white border border-gray-300 pl-3 pr-10 py-1 rounded-xs text-[12px] focus:outline-none placeholder-gray-400 font-semibold h-[28px] text-gray-800"
                />
                <button className="absolute right-0 top-0 h-full w-8 bg-[#e8e8e8] border-l border-gray-300 flex items-center justify-center cursor-pointer rounded-r-xs hover:bg-gray-200">
                  <Search className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>

              {/* Grid / List View toggle button with dropdown arrow matching mockup */}
              <button 
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className={`border p-1 px-2 rounded-xs flex items-center justify-center cursor-pointer h-[28px] gap-1 transition-all ${
                  viewMode === "grid" 
                    ? "bg-[#006cb2] text-white border-[#005a96]"
                    : "bg-[#e8e8e8] border-gray-300 hover:bg-gray-200 text-gray-700" 
                }`}
                title={viewMode === "grid" ? "Chuyển sang dạng danh sách" : "Chuyển sang dạng lưới"}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
                </svg>
                <span className="text-[10px] font-bold leading-none select-none relative top-[0.5px]">▼</span>
              </button>
            </div>
          </div>
 
          {/* List or No Data */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#bfbfbf]">
            {filteredOrders.length === 0 ? (
              /* REAL NO DATA STATE exactly matching image */
              <div className="flex-1 flex flex-col items-center justify-center text-center select-none bg-[#bfbfbf] p-6">
                
                {/* Plate with crossed Fork and Spoon replaced with CUKCUK logo image from url */}
                <div className="mb-6 flex items-center justify-center">
                  <img 
                    src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=2c7763c2-2e20-4d67-ad2e-83ec81c4f164.png&isTemp=true&tenantCode=misa" 
                    alt="CUKCUK Logo" 
                    className="w-[180px] h-[180px] object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
 
                {/* Text caption matching image exactly */}
                <p className="text-[#8c8c8c] text-[15px] font-semibold max-w-xl leading-relaxed select-none">
                  Nhà hàng chưa có order nào, vui lòng Thêm order để ghi món cho khách
                </p>
              </div>
            ) : viewMode === "grid" ? (
              /* HIGH FIDELITY MISA ORDER CARDS GRID */
              <div className="flex-1 overflow-y-auto p-3.5 bg-[#bfbfbf]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3.5 justify-items-stretch">
                  {filteredOrders.map((order) => {
                    const shortName = getShortTableName(order.tableName);
                    return (
                      <div
                        key={order.id}
                        onClick={() => {
                          setNewTableName(order.tableName);
                          setNewCustomerCount(order.customerCount);
                          setCartItems(order.items);
                          setNewOrderType(order.status);
                          setIsOrdering(true);
                          setToast({ message: `Đang ghi món cho ${order.tableName}`, type: "info" });
                        }}
                        className="bg-white border border-gray-300 shadow-3xs flex flex-col overflow-hidden text-xs text-gray-800 h-[155px] hover:shadow-xs transition-shadow relative cursor-pointer hover:border-[#2d8bc6] group transition-all"
                        id={`order-card-${order.id}`}
                      >
                        {/* Header Block */}
                        <div className="h-[34px] bg-[#2d8bc6] flex items-center justify-between px-3 text-white shrink-0 select-none">
                          <span className="font-bold text-[14px] tracking-wide font-sans">
                            {shortName}
                          </span>
                          <div className="flex items-center gap-1 text-white/90">
                            <svg className="w-3.5 h-3.5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            <span className="font-bold text-[12.5px] leading-none">{order.customerCount || 0}</span>
                          </div>
                        </div>
 
                        {/* Body - Two parts (Light blue left accent panel + content right panel) */}
                        <div className="flex-1 flex overflow-hidden">
                          {/* Left Panel: light blue accent block */}
                          <div className="w-[42%] bg-[#e8f1f5] border-r border-gray-200 shrink-0" />
 
                          {/* Right Panel: Content */}
                          <div className="w-[58%] flex flex-col justify-between p-2 font-sans select-none">
                            {/* Total Amount Row */}
                            <div className="flex-1 flex items-center justify-end pr-1 min-w-0">
                              <span className="font-extrabold text-[15.5px] text-gray-950 tracking-tight truncate select-text" title={formatMoney(order.totalAmount)}>
                                {formatMisaMoney(order.totalAmount)}
                              </span>
                            </div>
 
                            {/* Bottom Info Row: Elapsed Time and Sitting/Dining Icon */}
                            <div className="flex items-center justify-between border-t border-gray-150 pt-1.5 shrink-0 select-none pb-0.5">
                              {/* Clock & Elapsed time */}
                              <div className="flex items-center gap-1 text-gray-400">
                                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-[10px] text-gray-500 font-bold tracking-tight shrink-0">
                                  {order.createdAt}
                                </span>
                              </div>
 
                              {/* Green MISA dining client silhouette */}
                              <div className="text-green-600 shrink-0 select-none" title="Khách đang ngồi">
                                <svg className="w-6 h-[22px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 13h12v2H6v-2zm12.5-4c0-.83-.67-1.5-1.5-1.5h-2V4h-1V2h-4v2h-1v3.5h-2c-.83 0-1.5.67-1.5 1.5v2.5h13V9zM15 17H9v3h6v-3z" fill="#27ae60" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
 
                        {/* Footer row with 4 equal action buttons */}
                        <div className="h-9 border-t border-gray-200 bg-[#f2f2f2] flex items-center divide-x divide-gray-300 shrink-0">
                          {/* Button 1: Calculator / Payment */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCheckoutOrder({
                                tableName: order.tableName,
                                items: order.items,
                                total: order.totalAmount,
                              });
                            }}
                            className="flex-1 h-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-orange-500 active:bg-gray-200 cursor-pointer transition-colors"
                            title="Tính tiền / Thanh toán"
                            id={order.tableName.includes("101") ? "tour-card-checkout-btn" : `btn-calc-${order.id}`}
                          >
                            <svg className="w-[18px] h-[18px] text-gray-500 hover:text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <rect x="4" y="3" width="16" height="18" rx="2" />
                              <line x1="9" y1="7" x2="15" y2="7" />
                              <line x1="9" y1="11" x2="15" y2="11" />
                              <line x1="9" y1="15" x2="15" y2="15" />
                              <line x1="9" y1="19" x2="15" y2="19" />
                            </svg>
                          </button>
 
                          {/* Button 2: Pencil / Edit / Record items */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewTableName(order.tableName);
                              setNewCustomerCount(order.customerCount);
                              setCartItems(order.items);
                              setNewOrderType(order.status);
                              setIsOrdering(true);
                              setToast({ message: `Đang ghi món cho ${order.tableName}`, type: "info" });
                            }}
                            className="flex-1 h-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#006cb2] active:bg-gray-200 cursor-pointer transition-colors"
                            title="Ghi món / Sửa Order"
                            id={`btn-edit-${order.id}`}
                          >
                            <svg className="w-[18px] h-[18px] text-gray-500 hover:text-[#006cb2]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                          </button>
 
                          {/* Button 3: Clipboard checklist / Send to Kitchen */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setToast({ message: `Đã gửi yêu cầu chế biến cho ${order.tableName} đến Bếp & Bar thành công!`, type: "success" });
                            }}
                            className="flex-1 h-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-green-500 active:bg-gray-200 cursor-pointer transition-colors"
                            title="Đồng bộ bếp & bar"
                            id={`btn-check-${order.id}`}
                          >
                            <svg className="w-[18px] h-[18px] text-gray-500 hover:text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                              <rect x="8" y="2" width="8" height="4" rx="1" />
                              <path d="M9 14l2 2 4-4" />
                            </svg>
                          </button>
 
                          {/* Button 4: Ellipsis option dropdown */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Bạn có chắc chắn muốn hủy Order của ${order.tableName}?`)) {
                                handleDeleteOrder(order.id);
                              }
                            }}
                            className="flex-1 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-red-500 active:bg-gray-200 cursor-pointer font-extrabold text-[14px] leading-none pb-1 transition-colors"
                            title="Hủy Order"
                            id={`btn-more-${order.id}`}
                          >
                            ...
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ORDER LIST TABLE */
              <div className="flex-1 overflow-auto bg-white m-3 rounded-sm border border-gray-300 shadow-3xs">
                <div className="min-w-[700px] select-text">
                  <div className="grid grid-cols-12 bg-gray-100 text-gray-500 font-bold text-[11px] py-2.5 px-4 border-b border-gray-200 uppercase tracking-wider select-none">
                    <div className="col-span-2">Mã Order</div>
                    <div className="col-span-2">Bàn / Vị trí</div>
                    <div className="col-span-2 text-center">Thời gian</div>
                    <div className="col-span-1 text-center">Số khách</div>
                    <div className="col-span-2 text-right">Tổng tiền</div>
                    <div className="col-span-3 text-center select-none">Hành động</div>
                  </div>
 
                  <div className="divide-y divide-gray-200 bg-white">
                    {filteredOrders.map((order) => (
                      <div 
                        key={order.id} 
                        onClick={() => {
                          setNewTableName(order.tableName);
                          setNewCustomerCount(order.customerCount);
                          setCartItems(order.items);
                          setNewOrderType(order.status);
                          setIsOrdering(true);
                          setToast({ message: `Đang sửa Order cho ${order.tableName}`, type: "info" });
                        }}
                        className="grid grid-cols-12 py-3.5 px-4 items-center text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer hover:text-[#006cb2]"
                      >
                        <div className="col-span-2 font-sans text-[13px] font-extrabold text-[#006cb2]">{order.orderNumber}</div>
                        <div className="col-span-2 font-bold text-gray-900 text-[13px]">{order.tableName || "Mang về"}</div>
                        <div className="col-span-2 text-center text-gray-500 font-medium">{order.createdAt}</div>
                        <div className="col-span-1 text-center text-gray-700 font-bold">{order.customerCount}</div>
                        <div className="col-span-2 text-right font-sans text-[13.5px] font-extrabold text-red-600">{formatMoney(order.totalAmount)}đ</div>
                        <div className="col-span-3 flex items-center justify-center gap-2 select-none">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewTableName(order.tableName);
                              setNewCustomerCount(order.customerCount);
                              setCartItems(order.items);
                              setNewOrderType(order.status);
                              setIsOrdering(true);
                              setToast({ message: `Đang sửa Order cho ${order.tableName}`, type: "info" });
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-[#006cb2] border border-blue-200 text-[11px] font-bold px-2.5 py-1.5 rounded-xs shadow-3xs cursor-pointer transition-colors"
                          >
                            Ghi món
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCheckoutOrder({
                                tableName: order.tableName,
                                items: order.items,
                                total: order.totalAmount,
                              });
                            }}
                            className="bg-orange-50 hover:bg-orange-100 text-[#ff9800] border border-orange-200 text-[11px] font-bold px-2.5 py-1.5 rounded-xs shadow-3xs cursor-pointer transition-colors"
                          >
                            Tính tiền
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id);
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-1.5 rounded-xs shadow-3xs cursor-pointer transition-colors"
                            title="Hủy Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Summary Bar precisely matching the mockup */}
          <div className="bg-[#eeeeee] border-t border-gray-300 h-9 px-4 flex items-center justify-between select-none shrink-0 text-gray-800 text-xs">
            <div className="flex items-center gap-4">
              <select className="bg-white border border-gray-300 text-gray-800 font-semibold px-2 py-0.5 text-[11px] rounded-xs focus:outline-none cursor-pointer h-6">
                <option>-Tất cả-</option>
              </select>
              <div className="flex items-center gap-4 font-bold text-gray-700">
                <span>Tổng số Order: <span className="font-extrabold text-black">{filteredOrders.length}</span></span>
                <span>Tổng số khách hàng: <span className="font-extrabold text-black">{filteredOrders.reduce((acc, curr) => acc + (curr.customerCount || 0), 0)}</span></span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <span className="font-bold text-[11.5px]">Thêm Order: <span className="text-gray-900">F2</span> hoặc <span className="text-gray-900">ALT+T</span></span>
              <div className="flex items-center border border-gray-300 rounded-xs bg-white overflow-hidden h-6 divide-x divide-gray-200">
                <button className="px-1.5 hover:bg-gray-100 h-full flex items-center justify-center text-gray-400 cursor-not-allowed" disabled>
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button className="px-1.5 hover:bg-gray-100 h-full flex items-center justify-center text-gray-400 cursor-not-allowed" disabled>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="px-1.5 hover:bg-gray-100 h-full flex items-center justify-center text-gray-400 cursor-not-allowed" disabled>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button className="px-1.5 hover:bg-gray-100 h-full flex items-center justify-center text-gray-400 cursor-not-allowed" disabled>
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. VERY BOTTOM BLUE STATUS LINE BAR */}
      <div className="h-8.5 bg-[#005a96] flex items-center justify-between px-3 text-white select-none shrink-0 text-[12px] font-sans border-t border-[#004e82]">
        <div className="flex items-center gap-1 font-medium">
          <span>NHPD001 - Nhà hàng Phong Dê</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-200">
          <span>Tổng đài tư vấn: 024 7108 6866</span>
          <span>|</span>
          <span className="font-sans font-bold text-[10px] bg-sky-800 px-1 py-0.5 rounded">OVR</span>
          <span className="font-sans font-bold text-[10px] bg-sky-800 px-1 py-0.5 rounded">NUM</span>
          <span>|</span>
          <span className="text-white font-bold flex items-center gap-1.5 font-sans">
            <Clock className="w-3.5 h-3.5 text-sky-200" />
            {currentTime}
          </span>
        </div>
      </div>

      {/* 6. MODAL OVERLAYS */}
      <AnimatePresence>
        {showAssignTableModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center p-4 z-50 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded border border-gray-300 shadow-2xl w-[900px] h-[580px] max-w-full flex flex-col overflow-hidden text-xs text-gray-800"
            >
              {/* Header block with standard window controls */}
              <div className="h-11 bg-[#006cb2] flex items-center justify-between px-4 text-white shrink-0">
                <span className="font-bold text-[13px] tracking-wide">
                  Xếp bàn
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => alert("Hướng dẫn xếp bàn: Hãy chọn một bàn trên sơ đồ để chuyển/gán đơn hàng hiện tại.")}
                    className="text-white hover:bg-white/15 p-1 rounded-sm transition-all cursor-pointer font-bold text-[14px] w-6 h-6 flex items-center justify-center"
                    title="Trợ giúp"
                  >
                    ?
                  </button>
                  <button
                    onClick={() => setShowAssignTableModal(false)}
                    className="text-white hover:bg-white/15 p-1 rounded-sm transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Row 1: Search and Selected Table information */}
              <div className="p-3 bg-white border-b border-gray-200 flex items-center gap-4 shrink-0 font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-700 font-medium">Xếp vào bàn</span>
                  <div className="relative w-56 flex items-center border border-gray-300 rounded-sm overflow-hidden bg-white h-7.5 px-2">
                    <input
                      type="text"
                      placeholder=""
                      value={assignTableSearch}
                      onChange={(e) => setAssignTableSearch(e.target.value)}
                      className="w-full bg-transparent text-xs text-gray-800 focus:outline-none placeholder-gray-400 font-medium pr-6"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2" />
                  </div>
                </div>

                <div className="text-[12px] text-gray-700 font-medium ml-4">
                  Bàn đang chọn: <span className="font-bold text-[#00a854] text-[13px] ml-1">{tempSelectedTable ? `${tempSelectedTable}` : "Chưa chọn"}</span>
                </div>
              </div>

              {/* Row 2: Sub-header / Stats and Legends */}
              <div className="bg-[#f0f0f0] border-b border-gray-300 h-9 flex items-center justify-between px-4 select-none shrink-0 font-sans text-[11.5px]">
                {/* Stats Breadcrumb */}
                <div className="flex items-center gap-1 text-gray-800">
                  <span className="font-bold text-gray-900">Toàn bộ nhà hàng:</span>
                  <span className="text-gray-600">Trống {getRestaurantTableCounts().vacant}/{getRestaurantTableCounts().total} bàn - {getRestaurantTableCounts().seatsVacant} ghế</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1 inline-block" />
                  <span className="font-bold text-gray-900">{assignTableFloor}:</span>
                  <span className="text-gray-600">Trống {getFloorTableCounts(assignTableFloor === "Tầng 1" ? 1 : assignTableFloor === "Tầng 2" ? 2 : 3).vacant}/10 bàn - {getFloorTableCounts(assignTableFloor === "Tầng 1" ? 1 : assignTableFloor === "Tầng 2" ? 2 : 3).seatsVacant} ghế</span>
                </div>

                {/* Legends */}
                <div className="flex items-center gap-4 text-gray-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 bg-[#0078D4] rounded-xs inline-block shadow-3xs" />
                    <span>Bàn trống</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 bg-[#707d7e] rounded-xs inline-block shadow-3xs" />
                    <span>Bàn đang phục vụ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 bg-[#e67e22] rounded-xs inline-block shadow-3xs" />
                    <span>Bàn đặt trước</span>
                  </div>
                </div>
              </div>

              {/* Core Content: Sidebar + Table grid */}
              <div className="flex-1 flex bg-[#bfbfbf] overflow-hidden">
                {/* Sidebar Left: Floor selection */}
                <div className="w-44 bg-white border-r border-gray-300 flex flex-col justify-between shrink-0 font-sans">
                  <div className="flex-1 py-1">
                    {[
                      { name: "Tầng 1", count: getFloorTableCounts(1).vacant },
                      { name: "Tầng 2", count: getFloorTableCounts(2).vacant },
                      { name: "Tầng 3", count: getFloorTableCounts(3).vacant },
                    ].map((floor) => {
                      const isSelected = assignTableFloor === floor.name;
                      return (
                        <button
                          key={`assign-floor-${floor.name}`}
                          onClick={() => setAssignTableFloor(floor.name as any)}
                          className={`w-full text-left px-4 py-3 flex items-center gap-2.5 font-bold text-[12px] transition-all border-b border-gray-100 cursor-pointer ${
                            isSelected
                              ? "bg-[#e2eef7] text-[#006cb2]"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="w-2.5 h-2.5 bg-[#006cb2] inline-block shrink-0" />
                          <span className={isSelected ? "text-[#e67e22]" : ""}>{floor.name}</span>
                          <span className="text-[#006cb2] font-semibold">({floor.count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sidebar bottom: Up/Down buttons */}
                  <div className="p-2 border-t border-gray-300 bg-[#f9f9f9] flex gap-2 justify-center select-none">
                    <button
                      onClick={() => {
                        if (assignTableFloor === "Tầng 3") setAssignTableFloor("Tầng 2");
                        else if (assignTableFloor === "Tầng 2") setAssignTableFloor("Tầng 1");
                      }}
                      className="flex-1 h-8 bg-white border border-gray-300 hover:bg-gray-50 active:scale-95 rounded-sm flex items-center justify-center cursor-pointer shadow-3xs"
                    >
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        if (assignTableFloor === "Tầng 1") setAssignTableFloor("Tầng 2");
                        else if (assignTableFloor === "Tầng 2") setAssignTableFloor("Tầng 3");
                      }}
                      className="flex-1 h-8 bg-white border border-gray-300 hover:bg-gray-50 active:scale-95 rounded-sm flex items-center justify-center cursor-pointer shadow-3xs"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Table Layout Canvas with Swinging Doors */}
                <div className="flex-1 bg-white overflow-y-auto p-6 relative flex flex-col items-center justify-start min-h-0 select-none">
                  {/* Doors indicator */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-20 flex items-center justify-start z-10 pointer-events-none opacity-40">
                    <svg className="w-8 h-24 text-gray-400 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 32 96">
                      <path d="M 0 10 A 16 16 0 0 1 16 26 L 16 48 L 0 48" />
                      <path d="M 0 86 A 16 16 0 0 0 16 70 L 16 48 L 0 48" />
                      <line x1="0" y1="10" x2="0" y2="86" />
                    </svg>
                  </div>

                  {/* Grid of Tables configured exactly like mockup */}
                  <div className="w-full max-w-xl py-2">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 justify-items-center items-center justify-center w-full">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                        .filter((num) => {
                          const floorNum = assignTableFloor === "Tầng 1" ? 1 : assignTableFloor === "Tầng 2" ? 2 : 3;
                          const tableNum = floorNum * 100 + num;
                          return tableNum.toString().includes(assignTableSearch);
                        })
                        .map((num) => {
                          const floorNum = assignTableFloor === "Tầng 1" ? 1 : assignTableFloor === "Tầng 2" ? 2 : 3;
                          const tableNum = floorNum * 100 + num;
                          return renderModalTableUI(tableNum);
                        })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dialog Footer with Action Buttons */}
              <div className="bg-[#eeeeee] border-t border-gray-300 p-3 px-4 flex justify-end gap-3 shrink-0 font-sans">
                <button
                  onClick={() => {
                    if (!tempSelectedTable) {
                      setToast({ message: "Vui lòng chọn một bàn trên sơ đồ!", type: "info" });
                      return;
                    }
                    
                    // Assign selected table to order
                    setNewTableName(`Bàn ${tempSelectedTable}`);
                    
                    // If table already has an active order, let's load that order!
                    const associatedOrder = orders.find(o => o.tableName === `Bàn ${tempSelectedTable}` || o.tableName === `${tempSelectedTable}`);
                    if (associatedOrder) {
                      setCartItems(associatedOrder.items);
                      setNewCustomerCount(associatedOrder.customerCount);
                      setToast({ message: `Đã mở giỏ hàng hiện tại của Bàn ${tempSelectedTable}`, type: "success" });
                    } else {
                      // If table is vacant, we can clear cart or retain draft for it
                      setNewCustomerCount(6); // Default seats in mockup
                      setToast({ message: `Đã chuyển đơn hàng sang Bàn ${tempSelectedTable}`, type: "success" });
                    }
                    
                    if (orderTourStep === 3) {
                      setOrderTourStep(4);
                    }
                    setShowAssignTableModal(false);
                  }}
                  className="bg-[#006cb2] hover:bg-[#005a96] text-white font-bold px-6 py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-[11.5px]"
                >
                  ĐỒNG Ý
                </button>
                <button
                  onClick={() => setShowAssignTableModal(false)}
                  className="bg-white hover:bg-gray-50 text-[#d91a1a] border border-gray-300 font-bold px-6 py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-[11.5px]"
                >
                  HỦY BỎ
                </button>
              </div>

            </motion.div>
          </div>
        )}

        {showEInvoiceModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center p-4 z-50 select-none">
            <motion.div
              id="tour-einvoice-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded border border-gray-300 shadow-2xl w-full max-w-[680px] flex flex-col overflow-hidden text-xs text-gray-800"
            >
              {/* Header block */}
              <div className="h-11 bg-[#006cb2] flex items-center justify-between px-4 text-white shrink-0">
                <span className="font-bold text-[13.5px] tracking-wide">
                  Phát hành hóa đơn điện tử
                </span>
                <button
                  onClick={() => setShowEInvoiceModal(false)}
                  className="text-white hover:bg-white/15 p-1 rounded-sm transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 font-sans">
                {/* 2-column input fields */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
                  {/* Tên khách hàng */}
                  <div className="flex items-center w-full">
                    <label className="w-[115px] text-[12px] font-medium text-gray-800 shrink-0">
                      Tên khách hàng
                    </label>
                    <input
                      type="text"
                      className="flex-1 h-[28px] border border-gray-300 bg-white px-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#006cb2] focus:ring-1 focus:ring-[#006cb2] transition-all"
                      value={invoiceCustomerName}
                      onChange={(e) => setInvoiceCustomerName(e.target.value)}
                    />
                  </div>

                  {/* SĐT khách hàng */}
                  <div className="flex items-center w-full">
                    <label className="w-[115px] text-[12px] font-medium text-gray-800 shrink-0">
                      SĐT khách hàng
                    </label>
                    <input
                      type="text"
                      className="flex-1 h-[28px] border border-gray-300 bg-white px-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#006cb2] focus:ring-1 focus:ring-[#006cb2] transition-all"
                      value={invoiceCustomerPhone}
                      onChange={(e) => setInvoiceCustomerPhone(e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex items-center w-full">
                    <label className="w-[115px] text-[12px] font-medium text-gray-800 shrink-0">
                      Email
                    </label>
                    <input
                      type="email"
                      className="flex-1 h-[28px] border border-gray-300 bg-white px-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#006cb2] focus:ring-1 focus:ring-[#006cb2] transition-all"
                      value={invoiceCustomerEmail}
                      onChange={(e) => setInvoiceCustomerEmail(e.target.value)}
                    />
                  </div>

                  {/* Số CCCD/CMND */}
                  <div className="flex items-center w-full">
                    <label className="w-[115px] text-[12px] font-medium text-gray-800 shrink-0">
                      Số CCCD/CMND
                    </label>
                    <input
                      type="text"
                      className="flex-1 h-[28px] border border-gray-300 bg-white px-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#006cb2] focus:ring-1 focus:ring-[#006cb2] transition-all"
                      value={invoiceCustomerIdCard}
                      onChange={(e) => setInvoiceCustomerIdCard(e.target.value)}
                    />
                  </div>

                  {/* Tên công ty */}
                  <div className="flex items-center w-full">
                    <label className="w-[115px] text-[12px] font-medium text-gray-800 shrink-0">
                      Tên công ty
                    </label>
                    <input
                      type="text"
                      className="flex-1 h-[28px] border border-gray-300 bg-white px-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#006cb2] focus:ring-1 focus:ring-[#006cb2] transition-all"
                      value={invoiceCompanyName}
                      onChange={(e) => setInvoiceCompanyName(e.target.value)}
                    />
                  </div>

                  {/* Mã số thuế */}
                  <div className="flex items-center w-full">
                    <label className="w-[115px] text-[12px] font-medium text-gray-800 shrink-0">
                      Mã số thuế
                    </label>
                    <div className="flex-1 flex gap-1 items-center min-w-0">
                      <input
                        type="text"
                        className="flex-1 h-[28px] border border-gray-300 bg-white px-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#006cb2] focus:ring-1 focus:ring-[#006cb2] transition-all min-w-0"
                        value={invoiceTaxCode}
                        onChange={(e) => setInvoiceTaxCode(e.target.value)}
                      />
                      <button
                        type="button"
                        className="w-8 h-[28px] border border-gray-300 bg-[#eeeeee] flex items-center justify-center cursor-pointer hover:bg-gray-200 shrink-0"
                      >
                        <span className="border-t-[4px] border-t-gray-800 border-x-[4px] border-x-transparent border-b-0 w-0 h-0 inline-block"></span>
                      </button>
                    </div>
                  </div>

                  {/* Địa chỉ công ty */}
                  <div className="col-span-2 flex items-center w-full">
                    <label className="w-[115px] text-[12px] font-medium text-gray-800 shrink-0">
                      Địa chỉ công ty
                    </label>
                    <input
                      type="text"
                      className="flex-1 h-[28px] border border-gray-300 bg-white px-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#006cb2] focus:ring-1 focus:ring-[#006cb2] transition-all"
                      value={invoiceCompanyAddress}
                      onChange={(e) => setInvoiceCompanyAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Custom Checkboxes */}
                <div className="space-y-4 pt-1">
                  {/* Checkbox 1 */}
                  <div
                    className="flex items-start gap-3 cursor-pointer select-none"
                    onClick={() => setInvoiceIssueNow(!invoiceIssueNow)}
                  >
                    <div
                      className={`w-[22px] h-[22px] border flex items-center justify-center shrink-0 mt-0.5 transition-all bg-white ${
                        invoiceIssueNow
                          ? "border-gray-400"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {invoiceIssueNow && <span className="text-[14px] font-extrabold text-[#006cb2]">✓</span>}
                    </div>
                    <div>
                      <span className="text-[12px] text-gray-800 font-medium">
                        Phát hành hóa đơn điện tử ngay
                      </span>
                      <p className="text-[11px] text-gray-400 italic mt-0.5 leading-normal font-sans">
                        Hệ thống sẽ phát hành hóa đơn điện tử ngay sau khi hoàn thành thu tiền
                      </p>
                    </div>
                  </div>

                  {/* Checkbox 2 */}
                  <div
                    className="flex items-center gap-3 cursor-pointer select-none"
                    onClick={() => setInvoiceSendEmail(!invoiceSendEmail)}
                  >
                    <div
                      className={`w-[22px] h-[22px] border flex items-center justify-center shrink-0 transition-all bg-white ${
                        invoiceSendEmail
                          ? "border-gray-400"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {invoiceSendEmail && <span className="text-[14px] font-extrabold text-[#006cb2]">✓</span>}
                    </div>
                    <span className="text-[12px] text-gray-800 font-medium">
                      Gửi email hóa đơn cho khách hàng
                    </span>
                  </div>
                </div>

                {/* Ký hiệu mẫu */}
                <div className="mt-5 flex items-center gap-3 pt-2">
                  <span className="text-[12px] text-gray-800 font-medium shrink-0">Ký hiệu mẫu</span>
                  <div className="relative border border-gray-300 rounded-sm bg-white h-[28px] w-64 flex items-center justify-between px-3 cursor-pointer hover:border-gray-400 transition-colors">
                    <select
                      value={invoiceSymbol}
                      onChange={(e) => setInvoiceSymbol(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    >
                      <option value="1C26MAC">1C26MAC</option>
                      <option value="1C26MAB">1C26MAB</option>
                      <option value="2C26MAC">2C26MAC</option>
                    </select>
                    <span className="text-xs text-gray-800 font-medium">{invoiceSymbol}</span>
                    <span className="border-t-[4px] border-t-gray-800 border-x-[4px] border-x-transparent border-b-0 w-0 h-0 inline-block"></span>
                  </div>
                </div>
              </div>

              {/* Dialog Footer with Action Buttons */}
              <div className="bg-[#eeeeee] border-t border-gray-300 p-3 px-4 flex justify-between items-center shrink-0 font-sans">
                {/* Left Action Button */}
                <button
                  onClick={() => {
                    setToast({
                      message: `Đang kết nối để xem trước hóa đơn điện tử mẫu ${invoiceSymbol}...`,
                      type: "info",
                    });
                  }}
                  className="bg-white hover:bg-gray-50 text-[#006cb2] border border-gray-300 font-bold px-4 py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-[11.5px]"
                >
                  XEM TRƯỚC HÓA ĐƠN
                </button>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (!invoiceCustomerName && !invoiceCompanyName) {
                        setToast({
                          message: "Vui lòng nhập Tên khách hàng hoặc Tên công ty để phát hành hóa đơn!",
                          type: "info",
                        });
                        return;
                      }
                      setToast({
                        message: "Lưu thông tin hóa đơn điện tử thành công!",
                        type: "success",
                      });
                      setShowEInvoiceModal(false);
                    }}
                    className="bg-[#006cb2] hover:bg-[#005a96] text-white font-bold px-7 py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-[11.5px]"
                  >
                    ĐỒNG Ý
                  </button>
                  <button
                    onClick={() => setShowEInvoiceModal(false)}
                    className="bg-white hover:bg-gray-50 text-[#d91a1a] border border-gray-300 font-bold px-7 py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-[11.5px]"
                  >
                    HỦY BỎ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showPaymentModal && checkoutOrder && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center p-4 z-50 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded border border-gray-300 shadow-2xl w-full max-w-[740px] flex flex-col overflow-hidden text-xs text-gray-800 font-sans"
            >
              {/* Header block */}
              <div className="h-11 bg-[#006cb2] flex items-center justify-between px-4 text-white shrink-0">
                <span className="font-bold text-[14px] tracking-wide">
                  Thu tiền
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setToast({
                      message: "Phím tắt sử dụng:\n- F8 hoặc ALT+N: Đóng (Thanh toán)\n- F9 hoặc ALT+I: In & Đóng\n- Esc: Hủy bỏ",
                      type: "info"
                    })}
                    className="text-white hover:bg-white/15 p-1 rounded-sm transition-all cursor-pointer font-bold text-[14px] w-6 h-6 flex items-center justify-center"
                    title="Trợ giúp"
                  >
                    ?
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-white hover:bg-white/15 p-1 rounded-sm transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              {(() => {
                const isMock = checkoutOrder.tableName.includes("101") || checkoutOrder.tableName.includes("102");
                const currentTotal = isMock ? 214000 : getCheckoutTotalPayable();
                const currentlyPaid = getCurrentlyPaidAmount();
                const remaining = currentTotal - currentlyPaid;
                const remainingDisplay = remaining > 0 ? remaining : 0;
                const changeDisplay = currentlyPaid > currentTotal ? currentlyPaid - currentTotal : 0;

                const denominations = [
                  500000, 200000, 100000,
                  50000, 20000, 10000,
                  5000, 2000, 1000
                ];

                return (
                  <div className="grid grid-cols-12 gap-0 min-h-[420px] bg-white">
                    {/* Left Panel */}
                    <div className="col-span-7 p-4 border-r border-gray-200 flex flex-col gap-4">
                      {/* Section Title */}
                      <div>
                        <span className="text-[12px] font-bold text-gray-800 flex items-center gap-1.5">
                          <span>Nhập số tiền khách đưa</span>
                          <span className="text-gray-400">➔</span>
                          <span className="text-gray-500 font-medium">Hình thức thanh toán</span>
                        </span>
                      </div>

                      {/* Display input amount */}
                      <div className="border border-gray-300 rounded-xs bg-[#eef4f8]/40 p-2 flex justify-between items-center h-10.5 focus-within:border-[#006cb2] focus-within:ring-1 focus-within:ring-[#006cb2] transition-all">
                        <span className="text-[11.5px] font-bold text-[#006cb2] uppercase tracking-wide px-1.5">
                          {paymentSelectedMethod}
                        </span>
                        <input
                          type="text"
                          className="flex-1 text-right font-sans font-bold text-[16px] text-gray-950 bg-transparent focus:outline-none pr-1 w-full"
                          value={formatMoney(parseInt(paymentInputAmount) || 0)}
                          onChange={(e) => handleInputChange(e.target.value)}
                        />
                      </div>

                      {/* Denominations label & block */}
                      <div className="space-y-1.5 flex-1 flex flex-col">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Nhập số tiền theo mệnh giá
                        </span>
                        <div className="flex gap-3 h-full">
                          {/* Grid of 3x3 denominations */}
                          <div className="grid grid-cols-3 gap-1.5 flex-1">
                            {denominations.map((denom) => (
                              <button
                                key={denom}
                                onClick={() => handleAddDenomination(denom)}
                                className="bg-white hover:bg-slate-50 active:bg-slate-100 border border-gray-200 hover:border-gray-300 rounded-sm text-[12px] font-bold text-gray-800 transition-all flex items-center justify-center cursor-pointer shadow-3xs"
                              >
                                {formatMoney(denom)}
                              </button>
                            ))}
                          </div>

                          {/* Stack of vertical payment methods */}
                          <div id="tour-payment-methods" className="w-28 flex flex-col gap-1 shrink-0">
                            {/* TIỀN MẶT */}
                            <button
                              onClick={() => handleSelectPaymentMethod("TIỀN MẶT")}
                              className={`flex flex-col items-center justify-center py-1 rounded-sm border transition-all cursor-pointer flex-1 gap-0.5 shadow-3xs ${
                                paymentSelectedMethod === "TIỀN MẶT"
                                  ? "bg-[#e3effa] border-[#006cb2] text-[#006cb2] font-bold"
                                  : "bg-white hover:bg-slate-50 border-gray-200 text-gray-700"
                              }`}
                            >
                              <Banknote className="w-4 h-4 text-[#00a854]" />
                              <span className="text-[10px]">TIỀN MẶT</span>
                            </button>

                            {/* Chuyển khoản */}
                            <button
                              onClick={() => handleSelectPaymentMethod("Chuyển khoản")}
                              className={`flex flex-col items-center justify-center py-1 rounded-sm border transition-all cursor-pointer flex-1 gap-0.5 shadow-3xs ${
                                paymentSelectedMethod === "Chuyển khoản"
                                  ? "bg-[#e3effa] border-[#006cb2] text-[#006cb2] font-bold"
                                  : "bg-white hover:bg-slate-50 border-gray-200 text-gray-700"
                              }`}
                            >
                              <CreditCard className="w-4 h-4 text-sky-500" />
                              <span className="text-[10px]">Chuyển khoản</span>
                            </button>

                            {/* Techcombank */}
                            <button
                              onClick={() => handleSelectPaymentMethod("Techcombank")}
                              className={`flex flex-col items-center justify-center py-1 rounded-sm border transition-all cursor-pointer flex-1 gap-0.5 shadow-3xs ${
                                paymentSelectedMethod === "Techcombank"
                                  ? "bg-[#e3effa] border-[#006cb2] text-[#006cb2] font-bold"
                                  : "bg-white hover:bg-slate-50 border-gray-200 text-gray-700"
                              }`}
                            >
                              <div className="w-5 h-5 rounded-sm bg-red-600 text-[8px] font-extrabold text-white flex items-center justify-center">TCB</div>
                              <span className="text-[10px]">Techcombank</span>
                            </button>

                            {/* QRCode */}
                            <button
                              id="tour-payment-qr-trigger"
                              onClick={() => {
                                handleSelectPaymentMethod("QRCode");
                                if (orderTourStep === 13) {
                                  setOrderTourStep(14);
                                }
                              }}
                              className={`flex flex-col items-center justify-center py-1 rounded-sm border transition-all cursor-pointer flex-1 gap-0.5 shadow-3xs ${
                                paymentSelectedMethod === "QRCode"
                                  ? "bg-[#e3effa] border-[#006cb2] text-[#006cb2] font-bold"
                                  : "bg-white hover:bg-slate-50 border-gray-200 text-gray-700"
                              }`}
                            >
                              <QrCode className="w-4 h-4 text-purple-600" />
                              <span className="text-[10px]">QRCode</span>
                            </button>

                            {/* Khác */}
                            <button
                              onClick={() => handleSelectPaymentMethod("Khác")}
                              className={`flex flex-col items-center justify-center py-1 rounded-sm border transition-all cursor-pointer flex-1 gap-0.5 shadow-3xs ${
                                paymentSelectedMethod === "Khác"
                                  ? "bg-[#e3effa] border-[#006cb2] text-[#006cb2] font-bold"
                                  : "bg-white hover:bg-slate-50 border-gray-200 text-gray-700"
                              }`}
                            >
                              <div className="flex items-center gap-0.5">
                                <span className="text-[10px]">Khác</span>
                                <ChevronDown className="w-3 h-3 text-gray-500" />
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Cash Suggestions (Gợi ý tiền mặt) */}
                      <div id="tour-payment-denoms" className="space-y-1 pt-1 border-t border-gray-100">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Gợi ý tiền mặt
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {getCashSuggestions(currentTotal).map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => updateCurrentMethodAmount(sug)}
                              className="bg-[#00a854] hover:bg-[#009148] text-white font-extrabold py-1.5 rounded-sm text-[12px] text-center transition-all cursor-pointer shadow-3xs active:scale-97"
                            >
                              {formatMoney(sug)},00
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Panel */}
                    <div className="col-span-5 bg-slate-50 p-4 flex flex-col justify-between border-l border-gray-200">
                      {/* Top Calculation Block */}
                      <div className="space-y-3">
                        {/* Số tiền còn phải thu */}
                        <div className="flex flex-col items-end pb-2 border-b border-gray-200">
                          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                            Số tiền còn phải thu
                          </span>
                          <span className="font-extrabold text-[22px] text-black font-sans tracking-tight">
                            {formatMoney(remainingDisplay)},00
                          </span>
                        </div>

                        {/* Active Payments Table */}
                        <div className="flex flex-col flex-1">
                          <div className="bg-gray-200 px-3 py-1 flex justify-between font-bold text-gray-700 text-[10.5px] uppercase rounded-t-sm shrink-0">
                            <span>Hình thức thanh toán</span>
                            <span>Số tiền</span>
                          </div>
                          <div className="bg-white border-x border-b border-gray-200 h-32 overflow-y-auto divide-y divide-gray-100 rounded-b-sm">
                            {paymentDetailsList.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between px-3 py-1.5 text-[11.5px] bg-[#e3effa]/40">
                                <span className="font-semibold text-[#006cb2]">{item.method}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-sans font-bold text-gray-900">
                                    {formatMoney(item.amount)},00
                                  </span>
                                  <button
                                    onClick={() => {
                                      setPaymentDetailsList(prev => prev.filter((_, i) => i !== idx));
                                      if (paymentSelectedMethod.toLowerCase() === item.method.toLowerCase()) {
                                        setPaymentInputAmount("0");
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5 text-red-500 font-bold border border-red-200/50 rounded-xs bg-white flex items-center justify-center p-0.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {paymentDetailsList.length === 0 && (
                              <div className="p-8 text-center text-gray-400 italic">
                                Chưa nhập số tiền
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Return Money Block */}
                      <div className="flex flex-col gap-1.5 pt-3 border-t border-gray-200 shrink-0">
                        <div className="flex flex-col items-end">
                          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                            Tiền trả lại cho khách
                          </span>
                          <span className="font-extrabold text-[22px] text-black font-sans tracking-tight">
                            {formatMoney(changeDisplay)},00
                          </span>
                        </div>

                        {/* Tài khoản thu combobox displayed when "Chuyển khoản", "Techcombank" or "QRCode" is selected or in the payment list */}
                        {(paymentSelectedMethod === "Chuyển khoản" || paymentSelectedMethod === "Techcombank" || paymentSelectedMethod === "QRCode" || orderTourStep === 16 || paymentDetailsList.some(item => item.method === "Chuyển khoản" || item.method === "Techcombank" || item.method === "QRCode")) && (
                          <div id="tour-payment-account-select" className="flex items-center justify-between pt-2.5 mt-1.5 border-t border-dashed border-gray-200 font-sans gap-4">
                            <span className="text-[12px] font-semibold text-gray-800 shrink-0">
                              Tài khoản thu
                            </span>
                            <div className="relative w-36 shrink-0">
                              <select
                                value={selectedBeneficiaryAccount}
                                onChange={(e) => setSelectedBeneficiaryAccount(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-sm h-[28px] pl-2.5 pr-6 font-semibold text-gray-800 text-[11px] appearance-none focus:outline-none focus:border-[#006cb2] cursor-pointer"
                              >
                                <option value="ACB - 4184901">ACB - 4184901</option>
                                <option value="Techcombank - 1903456789">Techcombank - 1903456789</option>
                                <option value="VietinBank - 110234567">VietinBank - 110234567</option>
                                <option value="Vietcombank - 0071001234">Vietcombank - 0071001234</option>
                              </select>
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[8px]">▼</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Footer */}
              <div className="bg-[#eeeeee] border-t border-gray-300 p-3 px-4 flex justify-between items-center shrink-0">
                {/* Left Hints */}
                <div className="flex flex-col text-[11px] text-gray-500 font-medium">
                  <div>
                    <span className="font-bold text-gray-800">Đóng:</span> ALT+N hoặc F8
                  </div>
                  <div>
                    <span className="font-bold text-gray-800">In & Đóng:</span> ALT+I hoặc F9
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleCompletePayment(false)}
                    className="bg-[#006cb2] hover:bg-[#005a96] text-white font-bold px-5 py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-[12px] flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>ĐÓNG</span>
                  </button>
                  <button
                    id="tour-payment-complete-btn"
                    onClick={() => {
                      handleCompletePayment(true);
                      if (orderTourStep === 14) {
                        setShowQrModal(false);
                        setShowPaymentModal(false);
                        setOrderTourStep(null);
                        setShowCelebration(true);
                      }
                    }}
                    className="bg-[#006cb2] hover:bg-[#005a96] text-white font-bold px-5 py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-[12px] flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>IN & ĐÓNG</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="bg-white hover:bg-gray-50 text-[#d91a1a] border border-gray-300 font-bold px-5 py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-[12px]"
                  >
                    HỦY BỎ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showQrModal && checkoutOrder && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center p-4 z-[100] select-none font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded border border-gray-300 shadow-2xl w-full max-w-[430px] p-6 flex flex-col items-center overflow-hidden text-xs text-gray-800"
            >
              {/* Header/Title */}
              <div className="text-center w-full relative">
                <h3 className="text-[14px] font-bold text-gray-800 uppercase tracking-wide">
                  Số tiền thanh toán
                </h3>
                <div className="text-[28px] font-extrabold text-black mt-1 font-sans tracking-tight">
                  {(() => {
                    const isMock = checkoutOrder.tableName.includes("101") || checkoutOrder.tableName.includes("102");
                    const amount = isMock ? 214000 : getCheckoutTotalPayable();
                    return formatMoney(amount);
                  })()}
                </div>
              </div>

              {/* Subtext info */}
              <div className="text-center px-4 mt-3">
                <p className="text-[11.5px] text-gray-500 leading-normal font-medium">
                  Sử dụng ứng dụng Mobile Banking của 30 ngân hàng
                  <br />
                  hoặc 9 ví điện tử để quét mã
                </p>
                <button
                  type="button"
                  className="text-[11px] text-[#006cb2] hover:underline font-bold mt-1.5 cursor-pointer block mx-auto uppercase tracking-wide"
                  onClick={() => {
                    setToast({
                      message: "Hệ thống hỗ trợ hơn 30 ngân hàng chính thức: Vietcombank, Techcombank, BIDV, VietinBank, ACB, MB...",
                      type: "info"
                    });
                  }}
                >
                  Danh sách ngân hàng và ví điện tử chấp nhận mã QR
                </button>
              </div>

              {/* QR Square Code Box */}
              <div id="tour-qr-code-box" className="w-[280px] h-[280px] bg-white border border-gray-200 shadow-sm rounded-sm mt-5 flex flex-col items-center justify-center p-4 relative shrink-0">
                {qrLoading ? (
                  <div className="flex flex-col items-center justify-center">
                    {/* Spinner dots container - high fidelity */}
                    <div className="w-20 h-20 relative animate-spin" style={{ animationDuration: '1.4s' }}>
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const angle = (idx * 45);
                        const size = 5 + (idx * 0.85); // 5px to 11px
                        const opacity = 0.2 + (idx * 0.1); // 0.2 to 0.9
                        return (
                          <div
                            key={idx}
                            className="absolute bg-[#006cb2] rounded-full"
                            style={{
                              width: `${size}px`,
                              height: `${size}px`,
                              top: `calc(50% - ${size/2}px)`,
                              left: `calc(50% - ${size/2}px)`,
                              transform: `rotate(${angle}deg) translate(28px)`,
                              opacity: opacity
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Small loading indicator row */}
                    <div className="flex items-center gap-1.5 justify-center mt-6">
                      <div className="w-3.5 h-3.5 border-2 border-[#006cb2] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[11.5px] font-bold text-[#006cb2]">
                        Đang khởi tạo giao dịch
                      </span>
                    </div>
                  </div>
                ) : (
                  // QR Code Loaded state! Let's display a beautiful VietQR block
                  <div className="w-full h-full flex flex-col justify-between items-center bg-white">
                    {/* VietQR Header */}
                    <div className="w-full flex justify-between items-center border-b border-gray-100 pb-1.5 px-1 shrink-0">
                      <span className="text-[10px] font-extrabold text-[#006cb2] tracking-wide">VietQR</span>
                      <span className="text-[10px] font-extrabold text-red-600 tracking-wide">NAPAS 247</span>
                    </div>

                    {/* QR code container */}
                    <div className="relative w-44 h-44 border border-gray-100 p-1 bg-white rounded-xs flex items-center justify-center shadow-3xs">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://vietqr.me"
                        alt="VietQR Payment Code"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=200&auto=format&fit=crop";
                        }}
                      />
                      {/* Center Logo overlay */}
                      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white p-0.5 rounded-sm shadow-xs border border-gray-100 flex items-center justify-center">
                        <img
                          src="https://inviva.vn/wp-content/uploads/2026/04/logo-techcombank-vector-05.jpg"
                          alt="Techcombank Logo"
                          className="w-full h-full object-contain rounded-xs"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Beneficiary details */}
                    <div className="w-full text-center mt-1 pb-0.5 shrink-0">
                      <div className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">
                        CÔNG TY CỔ PHẦN MISA
                      </div>
                      <div className="text-[10px] font-bold text-gray-500 mt-0.5 font-mono">
                        STK: {selectedBeneficiaryAccount.split(" - ")[1]} ({selectedBeneficiaryAccount.split(" - ")[0]})
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2.5 w-full mt-6 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setToast({
                      message: "Đang tiến hành in mã QR thanh toán...",
                      type: "info"
                    });
                  }}
                  className="bg-white hover:bg-slate-50 border border-gray-300 text-[#006cb2] text-[11px] font-extrabold py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-center"
                >
                  IN MÃ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToast({
                      message: "Đang kết nối cổng thanh toán để kiểm tra giao dịch...",
                      type: "info"
                    });
                    setTimeout(() => {
                      setToast({
                        message: "Giao dịch thành công! Số tiền đã được chuyển vào tài khoản thụ hưởng.",
                        type: "success"
                      });
                      setShowQrModal(false);
                      handleCompletePayment(false);
                    }, 1200);
                  }}
                  className="bg-white hover:bg-slate-50 border border-gray-300 text-[#006cb2] text-[11px] font-extrabold py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-center"
                >
                  KIỂM TRA GIAO DỊCH
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="bg-[#006cb2] hover:bg-[#005a96] text-white text-[11px] font-extrabold py-2 rounded-xs cursor-pointer shadow-3xs transition-all active:scale-97 text-center"
                >
                  ĐÓNG
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guide Tour Overlay and Balloon */}
      {orderTourStep !== null && orderTourRect && (
        <div className="fixed inset-0 pointer-events-none z-[999]">
          {/* Dark Mask removed to keep highlighted area fully white and bright */}
          
          {/* Highlighted Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed border-2 border-[#0070bc] rounded-lg pointer-events-none z-[1000] bg-transparent"
            style={{
              top: orderTourRect.top - 8,
              left: orderTourRect.left - 8,
              width: orderTourRect.width + 16,
              height: orderTourRect.height + 16,
              boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.45)",
            }}
          />

          {/* Tooltip Balloon */}
          {(() => {
            const isSidePlacement = orderTourStep === 4 || orderTourStep === 12 || orderTourStep === 14 || orderTourStep === 18;
            const isBalloonAbove = !isSidePlacement && (orderTourRect.top > window.innerHeight / 2);
            
            // Calculate coordinates
            let topVal = 0;
            let leftVal = 0;
            
            if (isSidePlacement) {
              // Place to the right of the highlighted box
              topVal = orderTourRect.top + (orderTourStep === 4 || orderTourStep === 12 ? 120 : 40); // slightly offset from top
              leftVal = orderTourRect.left + orderTourRect.width + 24; // 24px gap to the right
              // Ensure it doesn't overflow screen right boundary
              if (leftVal + 450 > window.innerWidth) {
                leftVal = window.innerWidth - 466;
              }
            } else {
              topVal = isBalloonAbove 
                ? orderTourRect.top - 16 
                : orderTourRect.top + orderTourRect.height + 16;
              leftVal = Math.max(16, Math.min(window.innerWidth - 466, orderTourRect.left));
            }

            return (
              <motion.div
                initial={{ opacity: 0, y: isBalloonAbove ? -15 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className={`fixed bg-white border border-gray-200 rounded-lg shadow-2xl p-5 z-[1001] flex flex-col gap-3 select-text w-[450px] pointer-events-auto ${isBalloonAbove ? '-translate-y-full' : ''}`}
                style={{
                  top: topVal,
                  left: leftVal,
                }}
              >
                {/* Arrow */}
                {isSidePlacement ? (
                  <div 
                    className="absolute -left-1.5 w-3 h-3 bg-white border-b border-l border-gray-200 rotate-45"
                    style={{
                      top: (orderTourStep === 4 || orderTourStep === 12) ? 128 : 48,
                    }}
                  />
                ) : isBalloonAbove ? (
                  <div 
                    className="absolute -bottom-1.5 w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45"
                    style={{
                      left: Math.min(410, Math.max(20, orderTourRect.left + (orderTourRect.width / 2) - Math.max(16, Math.min(window.innerWidth - 466, orderTourRect.left)) - 6)),
                    }}
                  />
                ) : (
                  <div 
                    className="absolute -top-1.5 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"
                    style={{
                      left: Math.min(410, Math.max(20, orderTourRect.left + (orderTourRect.width / 2) - Math.max(16, Math.min(window.innerWidth - 466, orderTourRect.left)) - 6)),
                    }}
                  />
                )}

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">
                    Hướng dẫn bán hàng
                  </span>
                  {localStorage.getItem("orderTourCompleted") === "true" && (
                    <button 
                      onClick={() => {
                        setOrderTourStep(null);
                        setToast({ message: "Đã đóng hướng dẫn bán hàng.", type: "info" });
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      title="Đóng hướng dẫn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Parent Process Bar */}
                {(() => {
                  const currentGroupInfo = (() => {
                    if (orderTourStep >= 1 && orderTourStep <= 3) {
                      return { title: "I - Tạo order", index: 0 };
                    } else if (orderTourStep >= 4 && orderTourStep <= 7) {
                      return { title: "II - Ghi order", index: 1 };
                    } else if (orderTourStep >= 8 && orderTourStep <= 12) {
                      return { title: "III - Tính tiền", index: 2 };
                    } else {
                      return { title: "IV - Thu tiền", index: 3 };
                    }
                  })();

                  const groupsList = [
                    { label: "I. Tạo order" },
                    { label: "II. Ghi order" },
                    { label: "III. Tính tiền" },
                    { label: "IV. Thu tiền" }
                  ];

                  return (
                    <div className="flex flex-col gap-1 mt-1 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        {groupsList.map((grp, gIdx) => {
                          const isActive = currentGroupInfo.index === gIdx;
                          const isCompleted = currentGroupInfo.index > gIdx;
                          return (
                            <div 
                              key={`progress-bar-${grp.label}`}
                              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                                isActive 
                                  ? "bg-[#0070bc]" 
                                  : isCompleted 
                                    ? "bg-emerald-500" 
                                    : "bg-gray-200"
                              }`}
                              title={grp.label}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-tight select-none px-0.5">
                        {groupsList.map((grp, gIdx) => {
                          const isActive = currentGroupInfo.index === gIdx;
                          const isCompleted = currentGroupInfo.index > gIdx;
                          return (
                            <span 
                              key={`progress-text-${grp.label}`}
                              className={isActive ? "text-[#0070bc]" : isCompleted ? "text-emerald-600" : "text-gray-400"}
                            >
                              {grp.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Content title with pristine hierarchical design */}
                {(() => {
                  const currentGroupInfo = (() => {
                    if (orderTourStep >= 1 && orderTourStep <= 3) {
                      const totalSub = isSodoTourFlow ? 1 : 3;
                      const currentSub = isSodoTourFlow ? 1 : orderTourStep;
                      return { 
                        title: "I - Tạo order", 
                        totalSub, 
                        currentSub 
                      };
                    } else if (orderTourStep >= 4 && orderTourStep <= 7) {
                      return { 
                        title: "II - Ghi order", 
                        totalSub: 4, 
                        currentSub: orderTourStep - 3 
                      };
                    } else if (orderTourStep >= 8 && orderTourStep <= 12) {
                      return { 
                        title: "III - Tính tiền", 
                        totalSub: 5, 
                        currentSub: orderTourStep - 7 
                      };
                    } else {
                      return { 
                        title: "IV - Thu tiền", 
                        totalSub: 7, 
                        currentSub: orderTourStep - 12 
                      };
                    }
                  })();

                  return (
                    <div className="flex flex-col select-none border-l-2 border-[#0070bc]/30 pl-2.5 py-0.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-extrabold text-[#0070bc] uppercase tracking-wide">
                          {currentGroupInfo.title}
                        </span>
                        <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded-sm font-mono">
                          {currentGroupInfo.currentSub}/{currentGroupInfo.totalSub}
                        </span>
                      </div>
                      <span className="text-[12.5px] font-bold text-gray-900 mt-1">
                        {orderTourStep === 1 && (isSodoTourFlow ? "1. Lựa chọn bàn trên Sơ đồ bàn" : "1. Khởi tạo Order mới")}
                        {orderTourStep === 2 && "2. Chọn bàn / vị trí phục vụ"}
                        {orderTourStep === 3 && "3. Lựa chọn bàn trên Sơ đồ bàn"}
                        {orderTourStep === 4 && "1. Chọn món khách dùng"}
                        {orderTourStep === 5 && "2. Điều chỉnh số lượng món"}
                        {orderTourStep === 6 && "3. Gửi thông tin xuống Bếp / Bar"}
                        {orderTourStep === 7 && "4. Cất & Lưu thông tin bàn"}
                        {orderTourStep === 8 && "1. Thanh toán / Tính tiền"}
                        {orderTourStep === 9 && "2. Báo cáo số tiền phải thu"}
                        {orderTourStep === 10 && "3. Đăng ký lấy hóa đơn điện tử"}
                        {orderTourStep === 11 && "4. Xem chi tiết thông tin hóa đơn"}
                        {orderTourStep === 12 && "5. Điền chi tiết thông tin xuất hóa đơn"}
                        {orderTourStep === 13 && "1. Mở giao diện Thu tiền"}
                        {orderTourStep === 14 && "2. Chọn phương thức thanh toán"}
                        {orderTourStep === 15 && "3. Nhập số tiền hoặc chọn gợi ý tiền mặt"}
                        {orderTourStep === 16 && "4. Lựa chọn tài khoản thu thụ hưởng"}
                        {orderTourStep === 17 && "5. Quét mã VietQR động thông minh"}
                        {orderTourStep === 18 && "6. Khách hàng quét mã VietQR"}
                        {orderTourStep === 19 && "7. Hoàn tất & In hóa đơn thanh toán"}
                      </span>
                    </div>
                  );
                })()}

                {/* Content */}
                <div className="text-[13px] text-gray-700 leading-relaxed font-semibold font-sans">
                  {orderTourStep === 1 && (
                    isSodoTourFlow ? (
                      <p>
                        Chào mừng bạn đến với quy trình hướng dẫn bán hàng khép kín! Bạn hãy click vào <strong className="text-gray-900">Bàn 101</strong> trên sơ đồ bàn để bắt đầu ghi nhận món ăn cho bàn này.
                      </p>
                    ) : (
                      <p>
                        Chào mừng bạn đến với quy trình hướng dẫn bán hàng khép kín! Đầu tiên, hãy click chọn nút <strong className="text-gray-900">"Thêm Order"</strong> ở thanh tiêu đề để mở màn hình ghi nhận món ăn cho thực khách.
                      </p>
                    )
                  )}
                  {orderTourStep === 2 && (
                    <p>
                      Hệ thống yêu cầu chỉ định bàn hoặc vị trí cho order này. Bạn hãy nhấp vào ô <strong className="text-gray-900">"Chọn bàn..."</strong> để mở Sơ đồ bàn/phòng.
                    </p>
                  )}
                  {orderTourStep === 3 && (
                    <p>
                      Hộp thoại Sơ đồ bàn/phòng hiện lên hiển thị toàn bộ phòng bàn trực quan. Bạn hãy click vào <strong className="text-gray-900">Bàn 101</strong> để chọn bàn này cho order.
                    </p>
                  )}
                  {orderTourStep === 4 && (
                    <p>
                      Thực đơn món ăn của quán được hiển thị trực quan theo danh mục (Món nước, Khai vị, Đồ uống...). Bạn click chọn các món khách gọi (ví dụ: <strong className="text-gray-900">Dê tái chanh, Bia hơi...</strong>) để đưa vào danh sách phục vụ.
                    </p>
                  )}
                  {orderTourStep === 5 && (
                    <p>
                      Để chỉnh số lượng, bạn có thể click trực tiếp vào ô <strong className="text-gray-900">SL</strong> trong giỏ hàng để thay đổi số lượng món (ví dụ: thay đổi số lượng món Dê tái chanh thành 2). Tổng tiền sẽ được tự động cập nhật ngay lập tức.
                    </p>
                  )}
                  {orderTourStep === 6 && (
                    <p>
                      Sau khi chọn món và điều chỉnh số lượng xong, nhấn nút <strong className="text-gray-900">"GỬI BẾP/BAR"</strong> ở góc dưới cùng bên phải để tự động chuyển lệnh chế biến xuống khu vực nhà bếp và pha chế, tránh việc nhân viên phải chạy đi chạy lại.
                    </p>
                  )}
                  {orderTourStep === 7 && (
                    <p>
                      Tiếp theo, hãy bấm nút <strong className="text-gray-900">"CẤT"</strong> để lưu trữ thông tin order của Bàn 101 vào hệ thống. Trạng thái của bàn sẽ tự động chuyển sang màu vàng (đang phục vụ) để thu ngân tiện theo dõi.
                    </p>
                  )}
                  {orderTourStep === 8 && (
                    <p>
                      Khi khách ăn xong và yêu cầu thanh toán, bạn có thể click vào biểu tượng <strong className="text-gray-900">Tính tiền / Thanh toán</strong> (máy tính tiền) trên thẻ của Bàn 101 để mở giao diện tính tiền.
                    </p>
                  )}
                  {orderTourStep === 9 && (
                    <p>
                      Hệ thống hiển thị bảng tính tiền chi tiết cho bàn của khách. Bạn có thể kiểm tra tổng số tiền tạm tính, nhập mã giảm giá (nếu có) và xem <strong className="text-gray-900">Số tiền thực tế còn phải thu</strong> ở góc phải.
                    </p>
                  )}
                  {orderTourStep === 10 && (
                    <p>
                      Để đáp ứng quy định nhà nước và phục vụ khách hàng doanh nghiệp, bạn tích chọn <strong className="text-gray-900">"Khách lấy hóa đơn GTGT"</strong> nếu khách có nhu cầu xuất Hóa đơn điện tử.
                    </p>
                  )}
                  {orderTourStep === 11 && (
                    <p>
                      Nhấp chuột vào chữ <strong className="text-[#006cb2]">"Xem chi tiết &gt;&gt;"</strong> để mở biểu mẫu điền thông tin phát hành Hóa đơn điện tử cho khách hàng (Tên đơn vị, Mã số thuế, Email nhận hóa đơn...).
                    </p>
                  )}
                  {orderTourStep === 12 && (
                    <p>
                      Biểu mẫu điền thông tin phát hành hóa đơn điện tử xuất hiện. Hãy điền các thông tin của công ty khách hàng rồi bấm <strong className="text-gray-900">"ĐỒNG Ý"</strong> để lưu lại thông tin khách hàng xuất hóa đơn GTGT.
                    </p>
                  )}
                  {orderTourStep === 13 && (
                    <p>
                      Tiếp theo, bạn nhấn nút <strong className="text-gray-900">"THU TIỀN"</strong> màu cam ở góc dưới cùng bên phải để hiển thị hộp thoại thanh toán, chuẩn bị thu tiền từ thực khách.
                    </p>
                  )}
                  {orderTourStep === 14 && (
                    <p>
                      Tại giao diện Thu tiền, hãy chọn phương thức thanh toán phù hợp (ví dụ: <strong className="text-gray-900">TIỀN MẶT</strong>, <strong className="text-gray-900">Chuyển khoản</strong>, hoặc <strong className="text-gray-900">QRCode</strong>).
                    </p>
                  )}
                  {orderTourStep === 15 && (
                    <p>
                      Bạn có thể tự nhập số tiền khách đưa hoặc chọn nhanh từ các ô <strong className="text-gray-900">Gợi ý tiền mặt</strong> bên dưới (hệ thống tự động đề xuất các mệnh giá tối ưu tương ứng).
                    </p>
                  )}
                  {orderTourStep === 16 && (
                    <p>
                      Chọn <strong className="text-gray-900">Tài khoản thu</strong> ngân hàng tương ứng để theo dõi dòng tiền chính xác cho quán (chỉ áp dụng đối với các hình thức thanh toán chuyển khoản hoặc QR Code).
                    </p>
                  )}
                  {orderTourStep === 17 && (
                    <p>
                      Chọn phương thức <strong className="text-gray-900">"QRCode"</strong> để hệ thống hiển thị mã VietQR động đã tích hợp sẵn số tiền phải thu và số tài khoản ngân hàng thụ hưởng của quán để khách quét thanh toán tức thì.
                    </p>
                  )}
                  {orderTourStep === 18 && (
                    <p>
                      Bảo khách hàng quét mã <strong className="text-gray-900">QR động</strong> trên màn hình để thanh toán.
                    </p>
                  )}
                  {orderTourStep === 19 && (
                    <p>
                      Sau cùng, nhấn nút <strong className="text-gray-900">"IN & ĐÓNG"</strong> để hoàn tất giao dịch. Hệ thống sẽ in hóa đơn thanh toán cho khách, đồng thời giải phóng Bàn 101 về trạng thái trống để sẵn sàng đón lượt khách tiếp theo!
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                  {/* Skip Button */}
                  <button
                    onClick={() => {
                      setOrderTourStep(null);
                      setToast({ message: "Đã đóng hướng dẫn bán hàng.", type: "info" });
                    }}
                    className="text-gray-400 hover:text-gray-600 hover:underline px-2 py-1 text-xs font-bold rounded transition-all cursor-pointer select-none"
                  >
                    Bỏ qua
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Back Button */}
                    {orderTourStep > 1 && (
                      <button 
                        onClick={() => {
                          const prevStep = (orderTourStep === 4 && isSodoTourFlow) ? 1 : (orderTourStep - 1);
                          setOrderTourStep(prevStep);
                          if (prevStep === 1) {
                            if (isSodoTourFlow) {
                              setIsOrdering(false);
                              setActiveTab("Sơ đồ");
                            } else {
                              setIsOrdering(false);
                              setCheckoutOrder(null);
                            }
                          } else if (prevStep === 2) {
                            setIsOrdering(true);
                            setActiveTab("Order");
                            setShowAssignTableModal(false);
                          } else if (prevStep === 3) {
                            setIsOrdering(true);
                            setActiveTab("Order");
                            setShowAssignTableModal(true);
                          } else if (prevStep === 4) {
                            setShowAssignTableModal(false);
                          } else if (prevStep === 8) {
                            setIsOrdering(false);
                            setCheckoutOrder(null);
                          } else if (prevStep === 9) {
                            setShowEInvoiceModal(false);
                          } else if (prevStep === 10) {
                            setShowEInvoiceModal(false);
                          } else if (prevStep === 11) {
                            setShowEInvoiceModal(false);
                          } else if (prevStep === 12) {
                            setShowEInvoiceModal(true);
                            setShowPaymentModal(false);
                          } else if (prevStep === 13) {
                            setShowPaymentModal(false);
                          } else if (prevStep === 14) {
                            setShowQrModal(false);
                            setShowPaymentModal(true);
                          } else if (prevStep === 15) {
                            setShowQrModal(false);
                            setShowPaymentModal(true);
                          } else if (prevStep === 16) {
                            setShowQrModal(false);
                            setShowPaymentModal(true);
                          } else if (prevStep === 17) {
                            setShowQrModal(false);
                            setShowPaymentModal(true);
                          } else if (prevStep === 18) {
                            setShowQrModal(true);
                            setShowPaymentModal(true);
                          }
                        }}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 text-xs font-bold rounded-sm transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>Quay lại</span>
                      </button>
                    )}
                    
                    {/* Next / Complete Button */}
                    <button 
                      onClick={() => {
                        if (orderTourStep === 1) {
                          if (isSodoTourFlow) {
                            setNewTableName("Bàn 101");
                            setNewCustomerCount(6);
                            setIsOrdering(true);
                            setOrderTourStep(4);
                          } else {
                            setNewTableName("");
                            setNewCustomerCount(1);
                            setCartItems([]);
                            setIsOrdering(true);
                            setActiveTab("Order");
                            setOrderTourStep(2);
                          }
                        } else if (orderTourStep === 2) {
                          setShowAssignTableModal(true);
                          setOrderTourStep(3);
                        } else if (orderTourStep === 3) {
                          setNewTableName("Bàn 101");
                          setNewCustomerCount(6);
                          setShowAssignTableModal(false);
                          setOrderTourStep(4);
                        } else if (orderTourStep === 4) {
                          setCartItems([
                            { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2 },
                            { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4 }
                          ]);
                          setOrderTourStep(5);
                        } else if (orderTourStep === 5) {
                          setOrderTourStep(6);
                        } else if (orderTourStep === 6) {
                          setCartItems(prev => prev.map(item => ({ ...item, isSent: true })));
                          setToast({ message: "Đã gửi thông tin chế biến xuống Bếp/Bar!", type: "success" });
                          setOrderTourStep(7);
                        } else if (orderTourStep === 7) {
                          handleCommitOrder();
                          setToast({ message: "Đã lưu thông tin order Bàn 101!", type: "success" });
                          setOrderTourStep(8);
                        } else if (orderTourStep === 8) {
                          setCheckoutOrder({
                            tableName: "Bàn 101",
                            items: [
                              { id: "MA02", name: "Dê tái chanh Phong Dê", price: 185000, qty: 2, isSent: true },
                              { id: "DU01", name: "Bia hơi Hà Nội (Ly 500ml)", price: 20000, qty: 4, isSent: true }
                            ],
                            total: 450000
                          });
                          setOrderTourStep(9);
                        } else if (orderTourStep === 9) {
                          setOrderTourStep(10);
                        } else if (orderTourStep === 10) {
                          setIsCheckoutReceiptChecked(true);
                          setOrderTourStep(11);
                        } else if (orderTourStep === 11) {
                          setShowEInvoiceModal(true);
                          setInvoiceCustomerName("Nguyễn Văn Minh");
                          setInvoiceCustomerPhone("0987654321");
                          setInvoiceCustomerEmail("minhnv@misa.com.vn");
                          setInvoiceTaxCode("0101243124");
                          setInvoiceCompanyName("Công ty Cổ phần MISA");
                          setInvoiceCompanyAddress("Tòa nhà Tháp B, tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội");
                          setOrderTourStep(12);
                        } else if (orderTourStep === 12) {
                          setShowEInvoiceModal(false);
                          setOrderTourStep(13);
                        } else if (orderTourStep === 13) {
                          setShowPaymentModal(true);
                          setPaymentDetailsList([
                            { method: "Tiền mặt", amount: 450000 }
                          ]);
                          setPaymentSelectedMethod("TIỀN MẶT");
                          setPaymentInputAmount("450000");
                          setOrderTourStep(14);
                        } else if (orderTourStep === 14) {
                          setOrderTourStep(15);
                        } else if (orderTourStep === 15) {
                          setOrderTourStep(16);
                        } else if (orderTourStep === 16) {
                          setPaymentSelectedMethod("QRCode");
                          setOrderTourStep(17);
                        } else if (orderTourStep === 17) {
                          setShowQrModal(true);
                          setOrderTourStep(18);
                        } else if (orderTourStep === 18) {
                          setOrderTourStep(19);
                        } else if (orderTourStep === 19) {
                          handleCompletePayment(true);
                          setShowQrModal(false);
                          setShowPaymentModal(false);
                          setOrderTourStep(null);
                          setShowCelebration(true);
                        }
                      }}
                      className="bg-[#0070bc] hover:bg-[#005a96] text-white px-4 py-1.5 text-xs font-bold rounded-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>{orderTourStep === 19 ? "Hoàn thành" : "Tiếp tục"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] select-none font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded border border-gray-200 shadow-2xl max-w-lg w-full p-8 text-center flex flex-col items-center gap-4 relative overflow-hidden text-slate-800"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-50/20 flex items-center justify-center shadow-inner border border-emerald-200 mt-2">
              <Check className="w-9 h-9 text-white stroke-[3]" />
            </div>
            
            <h3 className="text-xl font-extrabold text-black uppercase tracking-wide whitespace-nowrap">
              Hoàn thành hướng dẫn bán hàng
            </h3>
            
            <p className="text-[13px] text-gray-600 leading-relaxed font-semibold">
              Bạn đã hoàn thành quy trình hướng dẫn bán hàng khép kín trên phần mềm quản lý nhà hàng <strong className="text-gray-900">MISA CUKCUK</strong>!
            </p>
            
            <div className="w-full bg-slate-50 border border-slate-200 rounded p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 pb-2 border-b border-gray-200 mb-1">
                <span>TIẾN TRÌNH QUY TRÌNH</span>
                <span className="text-emerald-600">HOÀN THÀNH 100%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 relative">
                {/* Progress line */}
                <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-emerald-500 z-0" />
                
                {[
                  { id: "I", label: "Tạo Order" },
                  { id: "II", label: "Ghi Order" },
                  { id: "III", label: "Tính tiền" },
                  { id: "IV", label: "Thanh toán" },
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center z-10 relative">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm border-2 border-white">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                    <div className="mt-1.5 flex flex-col items-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{step.id}</span>
                      <span className="text-[11px] text-gray-800 font-semibold leading-tight">{step.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowCelebration(false);
                localStorage.setItem("orderTourCompleted", "true");
                setOrders([]);
                localStorage.setItem("cukcuk_orders", JSON.stringify([]));
                setToast({ message: "Chúc bạn có những trải nghiệm bán hàng tuyệt vời!", type: "success" });
              }}
              className="w-full py-2.5 bg-[#006cb2] hover:bg-[#005a96] active:scale-98 transition-all text-white font-bold text-xs rounded shadow-md cursor-pointer uppercase tracking-wider"
            >
              Bắt đầu bán hàng thực tế
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

