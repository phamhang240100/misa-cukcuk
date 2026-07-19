import React, { useState, useEffect } from "react";
import { APPLICATIONS_DATA } from "../../data";
import { Application } from "../../types";
import { AppIcon } from "../AppIcon";
import {
  MessageSquare,
  Check,
  X,
  Shield,
  Info,
  ExternalLink,
  Settings,
  RefreshCw,
  Printer,
  MoreHorizontal,
  MoreVertical,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Smartphone,
  Utensils,
  Clock,
  FileSpreadsheet,
  Eye,
  Database,
  HelpCircle,
  Save,
  Link2,
  Link,
  Unlink,
  XCircle,
  ArrowUp,
  ArrowDown,
  FilePlus,
  Trash2,
  Copy,
  Pencil,
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
// @ts-ignore
import shopeeFoodBanner from "../../assets/images/shopeefood_banner_1782381848308.jpg";

const BACKEND_CUKCUK_STPVS = [
  {
    id: "b1",
    name: "100% đường (Bình thường)",
    category: "Độ ngọt",
    extraPrice: 0,
  },
  { id: "b2", name: "70% đường (Ít ngọt)", category: "Độ ngọt", extraPrice: 0 },
  {
    id: "b3",
    name: "50% đường (Ngọt vừa)",
    category: "Độ ngọt",
    extraPrice: 0,
  },
  { id: "b4", name: "Không đường", category: "Độ ngọt", extraPrice: 0 },
  {
    id: "b5",
    name: "Trân châu đen hoàng kim",
    category: "Topping",
    extraPrice: 10000,
  },
  {
    id: "b6",
    name: "Trân châu trắng giòn",
    category: "Topping",
    extraPrice: 10000,
  },
  {
    id: "b7",
    name: "Thạch sương sáo thanh mát",
    category: "Topping",
    extraPrice: 5000,
  },
  {
    id: "b8",
    name: "Pudding trứng béo ngậy",
    category: "Topping",
    extraPrice: 12000,
  },
  {
    id: "b9",
    name: "Thạch dừa sần sật",
    category: "Topping",
    extraPrice: 5000,
  },
  {
    id: "b10",
    name: "Kem mặn phô mai",
    category: "Topping",
    extraPrice: 15000,
  },
  {
    id: "b11",
    name: "Thạch trái cây hỗn hợp",
    category: "Topping",
    extraPrice: 8000,
  },
  { id: "b12", name: "Đá riêng", category: "Độ lạnh", extraPrice: 0 },
  { id: "b13", name: "Không đá", category: "Độ lạnh", extraPrice: 0 },
  { id: "b14", name: "Nóng", category: "Độ lạnh", extraPrice: 0 },
  { id: "b15", name: "Ít đá (50%)", category: "Độ lạnh", extraPrice: 0 },
  { id: "b16", name: "Thêm hành", category: "Gia vị", extraPrice: 0 },
  { id: "b17", name: "Không hành", category: "Gia vị", extraPrice: 0 },
  { id: "b18", name: "Ít hành", category: "Gia vị", extraPrice: 0 },
  { id: "b19", name: "Ít cay", category: "Gia vị", extraPrice: 0 },
  { id: "b20", name: "Cay vừa", category: "Gia vị", extraPrice: 0 },
  { id: "b21", name: "Cay nhiều", category: "Gia vị", extraPrice: 0 },
  { id: "b22", name: "Không cay", category: "Gia vị", extraPrice: 0 },
  { id: "b23", name: "Nhiều hành", category: "Gia vị", extraPrice: 0 },
  { id: "b24", name: "Thêm nước dùng", category: "Khác", extraPrice: 5000 },
  { id: "b25", name: "Không bột ngọt", category: "Gia vị", extraPrice: 0 },
  { id: "b26", name: "Nhiều bánh phở", category: "Khác", extraPrice: 10000 },
];

// Custom item rendering helper for high-fidelity images
const renderItemImage = (imageUrl?: string) => {
  if (imageUrl) {
    return (
      <div className="w-[44px] h-[44px] rounded-[4px] border border-[#E9EAEB] overflow-hidden flex items-center justify-center select-none mx-auto bg-white shadow-sm">
        <img
          src={imageUrl}
          alt="Món ăn"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }
  return (
    <div className="w-[44px] h-[44px] rounded-[4px] bg-[#F0F5FF] border border-[#D9E5FC] flex items-center justify-center select-none mx-auto">
      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm text-[#245FDF]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-utensils"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      </div>
    </div>
  );
};

interface ApplicationsViewProps {
  onNotification: (message: string, type: "success" | "info") => void;
  shopeeFoodDeepLinkActive?: boolean;
  onResetDeepLink?: () => void;
  shopeeFoodVayVonDeepLinkActive?: boolean;
  onResetVayVonDeepLink?: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  onNotification,
  shopeeFoodDeepLinkActive,
  onResetDeepLink,
  shopeeFoodVayVonDeepLinkActive,
  onResetVayVonDeepLink,
}) => {
  const [apps, setApps] = useState<Application[]>(APPLICATIONS_DATA);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");

  // Vay von flow flag
  const [isVayVonFlow, setIsVayVonFlow] = useState(false);

  // ShopeeFood custom integration screen states
  const [isShopeeFoodScreenActive, setIsShopeeFoodScreenActive] =
    useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrScanStatus, setQrScanStatus] = useState<
    "idle" | "scanning" | "authorizing" | "success"
  >("idle");
  const [shopeeSyncStarted, setShopeeSyncStarted] = useState(false);
  const [shopeeWizardStep, setShopeeWizardStep] = useState<1 | 2 | 3>(1);
  const [showUnlinkedConfirmModal, setShowUnlinkedConfirmModal] =
    useState(false);
  const [showShopeeSyncConfirmModal, setShowShopeeSyncConfirmModal] =
    useState(false);
  const [step2SyncProgress, setStep2SyncProgress] = useState(0);
  const [isStep2Syncing, setIsStep2Syncing] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isShopeeSuccessModalOpen, setIsShopeeSuccessModalOpen] =
    useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [quickSetupStatus, setQuickSetupStatus] = useState<"open" | "closed">("open");
  const [quickSetupRanges, setQuickSetupRanges] = useState<
    Array<{ from: string; to: string }>
  >([{ from: "00:00", to: "23:59" }]);

  // Choose Dish Modal States
  const [isChooseDishModalOpen, setIsChooseDishModalOpen] = useState(false);
  const [chooseDishLoaiMon, setChooseDishLoaiMon] = useState("Tất cả loại món");
  const [chooseDishNhomThucDon, setChooseDishNhomThucDon] =
    useState("Chọn nhóm thực đơn");
  const [chooseDishTopSearch, setChooseDishTopSearch] = useState("");

  // Grid filters in modal
  const [chooseDishFilterCode, setChooseDishFilterCode] = useState("");
  const [chooseDishFilterName, setChooseDishFilterName] = useState("");
  const [chooseDishFilterCategory, setChooseDishFilterCategory] = useState("");
  const [chooseDishFilterUnit, setChooseDishFilterUnit] = useState("");
  const [chooseDishFilterPrice, setChooseDishFilterPrice] = useState("");

  // Selected dish IDs in modal
  const [chooseDishSelectedIds, setChooseDishSelectedIds] = useState<string[]>(
    [],
  );

  // Base list of available dishes to select in modal
  const [chooseDishAvailableItems, setChooseDishAvailableItems] = useState<
    any[]
  >([
    {
      id: "m1",
      code: "M01",
      name: "Bún bò Huế",
      category: "Món chính",
      unit: "Tô",
      price: 55000,
    },
    {
      id: "m2",
      code: "M02",
      name: "Phở gà",
      category: "Món chính",
      unit: "Tô",
      price: 45000,
    },
    {
      id: "m3",
      code: "M03",
      name: "Gỏi cuốn tôm thịt",
      category: "Món ăn nhẹ",
      unit: "Cái",
      price: 10000,
    },
    {
      id: "m4",
      code: "M04",
      name: "Nước mía siêu sạch",
      category: "Đồ uống lạnh",
      unit: "Ly",
      price: 12000,
    },
    {
      id: "m5",
      code: "M05",
      name: "Bánh tráng trộn Tây Ninh",
      category: "Món ăn nhẹ",
      unit: "Suất",
      price: 20000,
    },
    {
      id: "m6",
      code: "M06",
      name: "Trà sữa trân châu đường đen",
      category: "Đồ uống lạnh",
      unit: "Cốc",
      price: 35000,
    },
    {
      id: "m7",
      code: "M07",
      name: "Súp cua măng tây",
      category: "Món ăn nhẹ",
      unit: "Bát",
      price: 25000,
    },
    {
      id: "m8",
      code: "M08",
      name: "Nem rán giòn rụm",
      category: "Món ăn nhẹ",
      unit: "Đĩa",
      price: 40000,
    },
  ]);

  // Filter logic for dishes inside the modal
  const filteredModalDishes = chooseDishAvailableItems.filter((item) => {
    // Top search
    if (chooseDishTopSearch) {
      const ts = chooseDishTopSearch.toLowerCase();
      const codeMatch = item.code.toLowerCase().includes(ts);
      const nameMatch = item.name.toLowerCase().includes(ts);
      if (!codeMatch && !nameMatch) return false;
    }

    // Top Select "Loại món"
    if (chooseDishLoaiMon !== "Tất cả loại món") {
      if (chooseDishLoaiMon === "Đồ uống" && item.category !== "Đồ uống lạnh")
        return false;
      if (chooseDishLoaiMon === "Món ăn" && item.category === "Đồ uống lạnh")
        return false;
    }

    // Top Select "Nhóm thực đơn"
    if (
      chooseDishNhomThucDon !== "Chọn nhóm thực đơn" &&
      item.category !== chooseDishNhomThucDon
    )
      return false;

    // Grid filter Mã món
    if (
      chooseDishFilterCode &&
      !item.code.toLowerCase().includes(chooseDishFilterCode.toLowerCase())
    )
      return false;

    // Grid filter Tên món
    if (
      chooseDishFilterName &&
      !item.name.toLowerCase().includes(chooseDishFilterName.toLowerCase())
    )
      return false;

    // Grid filter Nhóm thực đơn
    if (
      chooseDishFilterCategory &&
      !item.category
        .toLowerCase()
        .includes(chooseDishFilterCategory.toLowerCase())
    )
      return false;

    // Grid filter Đơn vị tính
    if (
      chooseDishFilterUnit &&
      !item.unit.toLowerCase().includes(chooseDishFilterUnit.toLowerCase())
    )
      return false;

    // Grid filter Giá bán
    if (chooseDishFilterPrice) {
      const maxPrice = parseFloat(chooseDishFilterPrice.replace(/\./g, ""));
      if (!isNaN(maxPrice) && item.price > maxPrice) return false;
    }

    return true;
  });

  const isAllModalSelected =
    filteredModalDishes.length > 0 &&
    filteredModalDishes.every((item) =>
      chooseDishSelectedIds.includes(item.id),
    );

  const toggleSelectAllModal = () => {
    if (isAllModalSelected) {
      // Deselect all visible
      const idsToRemove = filteredModalDishes.map((item) => item.id);
      setChooseDishSelectedIds((prev) =>
        prev.filter((id) => !idsToRemove.includes(id)),
      );
    } else {
      // Select all visible
      const idsToAdd = filteredModalDishes.map((item) => item.id);
      setChooseDishSelectedIds((prev) => {
        const nextSet = new Set([...prev, ...idsToAdd]);
        return Array.from(nextSet);
      });
    }
  };

  const toggleSelectRowModal = (id: string) => {
    setChooseDishSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    if (!isMoreMenuOpen) return;
    const handleClose = () => setIsMoreMenuOpen(false);
    document.addEventListener("click", handleClose);
    return () => document.removeEventListener("click", handleClose);
  }, [isMoreMenuOpen]);

  // States for connected ShopeeFood screen with tabs
  const [shopeeFoodTab, setShopeeFoodTab] = useState<"menu" | "settings">(
    "menu",
  );
  const [shopeeActiveSegment, setShopeeActiveSegment] = useState<
    "thuc-don" | "nhom-thuc-don" | "so-thich-phuc-vu" | "so-thich" | "lich-ban"
  >("thuc-don");
  const [shopeeSearchQuery, setShopeeSearchQuery] = useState("");
  const [shopeeCategoryFilter, setShopeeCategoryFilter] = useState("Tất cả");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [shopeeSyncMenuAuto, setShopeeSyncMenuAuto] = useState(true);
  const [shopeeSyncOrdersAuto, setShopeeSyncOrdersAuto] = useState(true);
  
  // New settings states
  const [shopeeSettingsSubTab, setShopeeSettingsSubTab] = useState<"operating_hours" | "order_settings">("operating_hours");
  const [shopeeHolidaySetting, setShopeeHolidaySetting] = useState(false);
  const [shopeeHolidays, setShopeeHolidays] = useState<any[]>([
    { id: 1, name: "Tết Nguyên Đán", from: "2026-02-17", to: "2026-02-21" }
  ]);
  const [shopeeAutoConfirmOrder, setShopeeAutoConfirmOrder] = useState(false);
  const [shopeeAutoConfirmType, setShopeeAutoConfirmType] = useState<"all" | "paid">("all");
  const [shopeeAutoPrintReceipt, setShopeeAutoPrintReceipt] = useState(false);
  const [shopeeAutoPrintTrigger, setShopeeAutoPrintTrigger] = useState<"confirmed" | "kitchen">("confirmed");

  // Edit mode and backup states for ShopeeFood settings
  const [isEditingOperatingHours, setIsEditingOperatingHours] = useState(false);
  const [backupOperatingDays, setBackupOperatingDays] = useState<any[]>([]);
  const [backupHolidaySetting, setBackupHolidaySetting] = useState(false);
  const [backupHolidays, setBackupHolidays] = useState<any[]>([]);

  const [isEditingOrderSettings, setIsEditingOrderSettings] = useState(false);
  const [backupAutoConfirmOrder, setBackupAutoConfirmOrder] = useState(false);
  const [backupAutoConfirmType, setBackupAutoConfirmType] = useState<"all" | "paid">("all");
  const [backupAutoPrintReceipt, setBackupAutoPrintReceipt] = useState(false);
  const [backupAutoPrintTrigger, setBackupAutoPrintTrigger] = useState<"confirmed" | "kitchen">("confirmed");

  const [shopeeOperatingDays, setShopeeOperatingDays] = useState<any[]>([
    {
      id: "T2",
      name: "T2",
      active: true,
      ranges: [{ from: "08:00", to: "22:00" }],
    },
    {
      id: "T3",
      name: "T3",
      active: true,
      ranges: [{ from: "08:00", to: "22:00" }],
    },
    {
      id: "T4",
      name: "T4",
      active: true,
      ranges: [{ from: "08:00", to: "22:00" }],
    },
    {
      id: "T5",
      name: "T5",
      active: true,
      ranges: [{ from: "08:00", to: "22:00" }],
    },
    {
      id: "T6",
      name: "T6",
      active: true,
      ranges: [{ from: "08:00", to: "22:00" }],
    },
    {
      id: "T7",
      name: "T7",
      active: true,
      ranges: [{ from: "08:00", to: "22:00" }],
    },
    {
      id: "CN",
      name: "CN",
      active: true,
      ranges: [{ from: "08:00", to: "22:00" }],
    },
  ]);
  const [shopeeMenuApplyType, setShopeeMenuApplyType] = useState<
    "all-day" | "by-hour"
  >("all-day");
  const [shopeeTimeGroups, setShopeeTimeGroups] = useState<any[]>([
    {
      id: "g1",
      name: "Thực đơn buổi sáng",
      timeRange:
        "T2 (07:00-16:00), T3 (07:00-16:00), T4 (07:00-16:00), T5 (07:00-16:00), T6 (07:00-16:00), T7 (07:00-16:00), CN (07:00-16:00)",
      menuGroups: "Bánh gạo, Gà rán, Nước giải khát",
    },
    {
      id: "g2",
      name: "Thực đơn buổi tối",
      timeRange:
        "T2 (17:00-22:00), T3 (17:00-22:00), T4 (17:00-22:00), T5 (17:00-22:00), T6 (17:00-22:00), T7 (17:00-22:00), CN (17:00-22:00)",
      menuGroups: "Bánh gạo, Gà rán, Nước giải khát, Lẩu, Bia",
    },
  ]);

  // States for ShopeeFood "Nhóm thực đơn"
  const [shopeeMenuGroups, setShopeeMenuGroups] = useState<any[]>([
    {
      id: "smg1",
      name: "Món chính",
      description: "Các món ăn chính thơm ngon, đầy đủ dinh dưỡng cho bữa ăn của bạn.",
      status: "Có bán",
      linkedGroupId: "ccmg1"
    },
    {
      id: "smg2",
      name: "Món ăn nhẹ",
      description: "Các món ăn vặt, ăn nhẹ lót dạ ngon miệng và nhanh chóng.",
      status: "Có bán",
      linkedGroupId: ""
    },
    {
      id: "smg3",
      name: "Đồ uống lạnh",
      description: "Nước giải khát, nước ép trái cây mát lạnh giải nhiệt hiệu quả.",
      status: "Có bán",
      linkedGroupId: "ccmg3"
    },
    {
      id: "smg4",
      name: "Món chè",
      description: "Các loại chè ngọt ngào, mát lạnh chuẩn vị truyền thống.",
      status: "Ngừng bán",
      linkedGroupId: ""
    },
  ]);
  const [selectedShopeeGroupId, setSelectedShopeeGroupId] = useState<string | null>("smg1");
  const [shopeeGroupSearchQuery, setShopeeGroupSearchQuery] = useState("");
  const [isEditingShopeeGroup, setIsEditingShopeeGroup] = useState(false);
  const [editingShopeeGroup, setEditingShopeeGroup] = useState<any | null>(null);
  const [isEditingStpvItem, setIsEditingStpvItem] = useState(false);
  const [editingStpvItem, setEditingStpvItem] = useState<any | null>(null);
  const [isViewingDishesModalOpen, setIsViewingDishesModalOpen] = useState(false);
  const [viewDishesGroupName, setViewDishesGroupName] = useState<string | null>(null);
  const [isLichBanEditing, setIsLichBanEditing] = useState(false);
  const [originalMenuApplyType, setOriginalMenuApplyType] = useState<string | null>(null);
  const [originalTimeGroups, setOriginalTimeGroups] = useState<any[] | null>(null);
  const [isLinkCukCukModalOpen, setIsLinkCukCukModalOpen] = useState(false);
  const [linkingShopeeItemId, setLinkingShopeeItemId] = useState<string | null>(null);
  const [cukcukSearchQuery, setCukcukSearchQuery] = useState("");
  const [selectedCukCukDishId, setSelectedCukCukDishId] = useState<string | null>(null);
  const [linkDishLoaiMon, setLinkDishLoaiMon] = useState("Tất cả loại món");
  const [linkDishNhomThucDon, setLinkDishNhomThucDon] = useState("Tất cả nhóm");

  // State for new Menu Group linking popup
  const [isLinkCukCukMenuGroupModalOpen, setIsLinkCukCukMenuGroupModalOpen] = useState(false);
  const [linkingShopeeMenuGroupId, setLinkingShopeeMenuGroupId] = useState<string | null>(null);
  const [selectedCukCukMenuGroupId, setSelectedCukCukMenuGroupId] = useState<string | null>(null);
  const [menuGroupPopupSearch, setMenuGroupPopupSearch] = useState("");

  // State for new Option Group linking popup
  const [isLinkCukCukOptionGroupModalOpen, setIsLinkCukCukOptionGroupModalOpen] = useState(false);
  const [linkingShopeeOptionGroupId, setLinkingShopeeOptionGroupId] = useState<string | null>(null);
  const [selectedCukCukOptionGroupId, setSelectedCukCukOptionGroupId] = useState<string | null>(null);
  const [optionGroupPopupSearch, setOptionGroupPopupSearch] = useState("");

  // Custom filters for menu group table columns
  const [menuGroupFilterName, setMenuGroupFilterName] = useState("");
  const [menuGroupFilterDesc, setMenuGroupFilterDesc] = useState("");
  const [menuGroupFilterCount, setMenuGroupFilterCount] = useState("");
  const [menuGroupFilterStatus, setMenuGroupFilterStatus] = useState("");
  const [menuGroupFilterLinked, setMenuGroupFilterLinked] = useState("");

  // Pagination states for Shopee Menu Group
  const [shopeeGroupPage, setShopeeGroupPage] = useState(1);
  const [shopeeGroupPageSize, setShopeeGroupPageSize] = useState(10);

  // States for "Sở thích phục vụ" (STPV)
  const [optionGroups, setOptionGroups] = useState<any[]>([
    {
      id: "og1",
      name: "Chọn lượng đường",
      required: true,
      maxSelect: 1,
      status: "Sử dụng",
      source: "cukcuk",
      items: [
        {
          order: 1,
          name: "100% đường (Bình thường)",
          status: "Đang hoạt động",
        },
        { order: 2, name: "70% đường (Ít ngọt)", status: "Đang hoạt động" },
        { order: 3, name: "50% đường (Ngọt vừa)", status: "Đang hoạt động" },
        { order: 4, name: "Không đường", status: "Đang hoạt động" },
      ],
      linkedGroupId: "ccsg2",
    },
    {
      id: "og2",
      name: "Toppings phong phú",
      required: false,
      maxSelect: 5,
      status: "Sử dụng",
      source: "cukcuk",
      items: [
        { order: 1, name: "Trân châu đen hoàng kim", status: "Đang hoạt động" },
        { order: 2, name: "Trân châu trắng giòn", status: "Đang hoạt động" },
        {
          order: 3,
          name: "Thạch sương sáo thanh mát",
          status: "Đang hoạt động",
        },
        { order: 4, name: "Pudding trứng béo ngậy", status: "Đang hoạt động" },
        { order: 5, name: "Thạch dừa sần sật", status: "Ngừng áp dụng" },
      ],
      linkedGroupId: "ccsg1",
    },
    {
      id: "og3",
      name: "Chọn lượng đá",
      required: true,
      maxSelect: 1,
      status: "Sử dụng",
      source: "shopeefood",
      items: [
        { order: 1, name: "Đá bình thường", status: "Đang hoạt động" },
        { order: 2, name: "Ít đá (50%)", status: "Đang hoạt động" },
        { order: 3, name: "Không đá", status: "Đang hoạt động" },
      ],
      linkedGroupId: "",
    },
    {
      id: "og4",
      name: "Kích cỡ ly (Size)",
      required: true,
      maxSelect: 1,
      status: "Ẩn",
      source: "shopeefood",
      items: [
        { order: 1, name: "Cốc vừa (Size M)", status: "Đang hoạt động" },
        {
          order: 2,
          name: "Cốc lớn (Size L + 10.000đ)",
          status: "Đang hoạt động",
        },
      ],
      linkedGroupId: "ccsg3",
    },
    {
      id: "og5",
      name: "Yêu cầu đặc biệt khác",
      required: false,
      maxSelect: 3,
      status: "Ngừng sử dụng",
      source: "cukcuk",
      items: [
        { order: 1, name: "Hâm nóng", status: "Đang hoạt động" },
        { order: 2, name: "Bọc màng co kỹ", status: "Đang hoạt động" },
        { order: 3, name: "Thêm muỗng nĩa", status: "Ngừng áp dụng" },
      ],
      linkedGroupId: "",
    },
  ]);

  const [selectedOptionGroup, setSelectedOptionGroup] = useState<any | null>(
    null,
  );
  const [optionGroupSearchQuery, setOptionGroupSearchQuery] = useState("");
  const [optionGroupPageSize, setOptionGroupPageSize] = useState(10);
  const [optionGroupPage, setOptionGroupPage] = useState(1);

  // New STPV states
  const [selectedStpvRowId, setSelectedStpvRowId] = useState<string | null>(
    "og1",
  );
  const [stpvFilterName, setStpvFilterName] = useState("");
  const [stpvFilterRequired, setStpvFilterRequired] = useState("");
  const [stpvFilterMaxSelect, setStpvFilterMaxSelect] = useState("");
  const [stpvFilterStatus, setStpvFilterStatus] = useState("");
  const [stpvFilterLinked, setStpvFilterLinked] = useState("");
  const [isEditingStpv, setIsEditingStpv] = useState(false);
  const [editingStpv, setEditingStpv] = useState<any | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );

  // States for backend CukCuk STPV linking
  const [showBackendStpvLinkSelector, setShowBackendStpvLinkSelector] =
    useState(false);
  const [linkingItemIndex, setLinkingItemIndex] = useState<number | null>(null);
  const [backendStpvSearchQuery, setBackendStpvSearchQuery] = useState("");
  const [selectedBackendStpvId, setSelectedBackendStpvId] = useState<
    string | null
  >(null);

  // States for the new tab "Sở thích phục vụ" (stpv items)
  const [stpvTabSearchQuery, setStpvTabSearchQuery] = useState("");
  const [stpvTabFilterName, setStpvTabFilterName] = useState("");
  const [stpvTabFilterGroup, setStpvTabFilterGroup] = useState("");
  const [stpvTabFilterPrice, setStpvTabFilterPrice] = useState("");
  const [stpvTabFilterStatus, setStpvTabFilterStatus] = useState("");
  const [stpvTabFilterLinked, setStpvTabFilterLinked] = useState("");
  const [stpvTabPage, setStpvTabPage] = useState(1);
  const [stpvTabPageSize, setStpvTabPageSize] = useState(10);
  const [selectedStpvTabRowId, setSelectedStpvTabRowId] = useState<string | null>(null);
  const [isLinkStpvItemModalOpen, setIsLinkStpvItemModalOpen] = useState(false);
  const [linkingStpvItemId, setLinkingStpvItemId] = useState<string | null>(null);
  const [selectedCukCukStpvId, setSelectedCukCukStpvId] = useState<string | null>(null);
  const [cukcukStpvSearchQuery, setCukcukStpvSearchQuery] = useState("");

  // Effect to automatically select the first row by default for STPV table
  useEffect(() => {
    const filtered = optionGroups.filter((group) => {
      const matchesSearch = group.name
        .toLowerCase()
        .includes(optionGroupSearchQuery.toLowerCase());
      const matchesFilterName =
        !stpvFilterName ||
        group.name.toLowerCase().includes(stpvFilterName.toLowerCase());

      let matchesFilterRequired = true;
      if (stpvFilterRequired === "yes") {
        matchesFilterRequired = group.required === true;
      } else if (stpvFilterRequired === "no") {
        matchesFilterRequired = group.required === false;
      }

      const matchesFilterMaxSelect =
        !stpvFilterMaxSelect ||
        group.maxSelect.toString().includes(stpvFilterMaxSelect);

      let matchesFilterStatus = true;
      if (stpvFilterStatus && stpvFilterStatus !== "all") {
        matchesFilterStatus = group.status === stpvFilterStatus;
      }

      return (
        matchesSearch &&
        matchesFilterName &&
        matchesFilterRequired &&
        matchesFilterMaxSelect &&
        matchesFilterStatus
      );
    });

    if (filtered.length > 0) {
      const isValid = filtered.some((g) => g.id === selectedStpvRowId);
      if (!isValid) {
        setSelectedStpvRowId(filtered[0].id);
      }
    } else {
      if (selectedStpvRowId !== null) {
        setSelectedStpvRowId(null);
      }
    }
  }, [
    optionGroups,
    optionGroupSearchQuery,
    stpvFilterName,
    stpvFilterRequired,
    stpvFilterMaxSelect,
    stpvFilterStatus,
    selectedStpvRowId,
  ]);

  // Custom grid filter states for ShopeeFood menu table
  const [gridFilterName, setGridFilterName] = useState("");
  const [gridFilterCategory, setGridFilterCategory] = useState("");
  const [gridFilterUnit, setGridFilterUnit] = useState("");
  const [gridFilterPrice, setGridFilterPrice] = useState("");
  const [gridFilterStatus, setGridFilterStatus] = useState("");
  const [gridFilterLinkStatus, setGridFilterLinkStatus] = useState("");
  const [selectedShopeeRowId, setSelectedShopeeRowId] = useState<number | null>(
    null,
  );

  // ShopeeFood menu items state
  const [shopeeMenuItems, setShopeeMenuItems] = useState<any[]>([
    {
      id: 1,
      name: "Bánh mì thịt nướng",
      category: "Món ăn nhẹ",
      unit: "Cái",
      price: 30000,
      status: "Có bán",
      isLinked: true,
      linkedDishId: "cc1",
    },
    {
      id: 2,
      name: "Phở bò tái",
      category: "Món chính",
      unit: "Bát",
      price: 50000,
      status: "Có bán",
      image:
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=100&auto=format&fit=crop&q=60",
      isLinked: true,
      linkedDishId: "cc2",
    },
    {
      id: 3,
      name: "Gà rán giòn",
      category: "Món chính",
      unit: "Đĩa",
      price: 100000,
      status: "Có bán",
      image:
        "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=100&auto=format&fit=crop&q=60",
      isLinked: false,
      linkedDishId: "",
    },
    {
      id: 4,
      name: "Bún chả Hà Nội",
      category: "Món ăn nhẹ",
      unit: "Đĩa",
      price: 50000,
      status: "Có bán",
      image:
        "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=100&auto=format&fit=crop&q=60",
      isLinked: true,
      linkedDishId: "cc11",
    },
    {
      id: 5,
      name: "Cơm tấm sườn nướng",
      category: "Món chính",
      unit: "Đĩa",
      price: 100000,
      status: "Ngừng bán",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60",
      isLinked: false,
      linkedDishId: "",
    },
    {
      id: 6,
      name: "Cocacola",
      category: "Đồ uống lạnh",
      unit: "Lon",
      price: 20000,
      status: "Có bán",
      image:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&auto=format&fit=crop&q=60",
      isLinked: true,
      linkedDishId: "cc6",
    },
    {
      id: 7,
      name: "Chè ba màu",
      category: "Món chè",
      unit: "Bát",
      price: 20000,
      status: "Ngừng bán",
      image:
        "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=100&auto=format&fit=crop&q=60",
      isLinked: true,
      linkedDishId: "cc7",
    },
    {
      id: 8,
      name: "Chè khúc bạch",
      category: "Món chè",
      unit: "Bát",
      price: 20000,
      status: "Ngừng bán",
      image:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=100&auto=format&fit=crop&q=60",
      isLinked: true,
      linkedDishId: "cc12",
    },
    {
      id: 9,
      name: "Khoai tây chiên",
      category: "Món ăn nhẹ",
      unit: "Đĩa",
      price: 25000,
      status: "Có bán",
      isLinked: true,
      linkedDishId: "cc9",
    },
    {
      id: 10,
      name: "Nước cam ép",
      category: "Đồ uống lạnh",
      unit: "Cốc",
      price: 30000,
      status: "Có bán",
      image:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=100&auto=format&fit=crop&q=60",
      isLinked: true,
      linkedDishId: "cc10",
    },
    {
      id: 11,
      name: "Sữa chua nếp cẩm",
      category: "Món chè",
      unit: "Hộp",
      price: 15000,
      status: "Ngừng bán",
      isLinked: true,
      linkedDishId: "",
    },
  ]);
  const [isShopeeEditOpen, setIsShopeeEditOpen] = useState(false);
  const [shopeeEditItem, setShopeeEditItem] = useState<any>(null);
  const [activeEditTab, setActiveEditTab] = useState<"general" | "preferences">("general");
  const [editingPreferences, setEditingPreferences] = useState<any[]>([]);
  const [selectedPreferenceId, setSelectedPreferenceId] = useState<string | null>(null);

  // States for Quick Link Modal (Liên kết món nhanh)
  const [isQuickLinkModalOpen, setIsQuickLinkModalOpen] = useState(false);
  const [quickLinkTab, setQuickLinkTab] = useState<"dish" | "menuGroup" | "stpv" | "stpvGroup">("dish");
  const [quickLinkEditingItems, setQuickLinkEditingItems] = useState<any[]>([]);
  const [quickLinkEditingStpv, setQuickLinkEditingStpv] = useState<any[]>([]);
  const [quickLinkEditingMenuGroups, setQuickLinkEditingMenuGroups] = useState<any[]>([]);
  const [quickLinkEditingStpvGroups, setQuickLinkEditingStpvGroups] = useState<any[]>([]);
  const [quickLinkMenuGroupNameSearch, setQuickLinkMenuGroupNameSearch] = useState("");
  const [quickLinkMenuGroupDescSearch, setQuickLinkMenuGroupDescSearch] = useState("");
  const [quickLinkMenuGroupCukCukSearch, setQuickLinkMenuGroupCukCukSearch] = useState("");
  const [quickLinkStpvGroupNameSearch, setQuickLinkStpvGroupNameSearch] = useState("");
  const [quickLinkStpvGroupDescSearch, setQuickLinkStpvGroupDescSearch] = useState("");
  const [quickLinkStpvGroupCukCukSearch, setQuickLinkStpvGroupCukCukSearch] = useState("");
  const [quickLinkActiveDropdownId, setQuickLinkActiveDropdownId] = useState<string | null>(null);
  const [quickLinkSearchText, setQuickLinkSearchText] = useState("");
  const [quickLinkCukCukSearchText, setQuickLinkCukCukSearchText] = useState("");
  const [quickLinkStatusFilter, setQuickLinkStatusFilter] = useState("");
  const [quickLinkCategoryFilter, setQuickLinkCategoryFilter] = useState("");
  const [quickLinkUnitFilter, setQuickLinkUnitFilter] = useState("");
  const [quickLinkStpvGroupFilter, setQuickLinkStpvGroupFilter] = useState("");
  const [quickLinkCellDropdownSearch, setQuickLinkCellDropdownSearch] = useState("");
  const [quickLinkPage, setQuickLinkPage] = useState(1);
  const [quickLinkRowsPerPage, setQuickLinkRowsPerPage] = useState(10);
  const [quickLinkSelectedIds, setQuickLinkSelectedIds] = useState<string[]>([]);

  // States for Wizard Step 2 Sync Complete View
  const [isWizardAlertVisible, setIsWizardAlertVisible] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);
  const [showSuspendConfirmModal, setShowSuspendConfirmModal] = useState(false);
  const [wizardSubTab, setWizardSubTab] = useState<"menu" | "menuGroup" | "stpv" | "stpvGroup">("menu");

  // Nhóm thực đơn tab filters
  const [wizardFilterMenuGroupName, setWizardFilterMenuGroupName] = useState("");
  const [wizardFilterMenuGroupDesc, setWizardFilterMenuGroupDesc] = useState("");
  const [wizardFilterMenuGroupStatus, setWizardFilterMenuGroupStatus] = useState("");
  const [wizardFilterMenuGroupCukCuk, setWizardFilterMenuGroupCukCuk] = useState("");

  // Nhóm STPV tab filters
  const [wizardFilterStpvGroupName, setWizardFilterStpvGroupName] = useState("");
  const [wizardFilterStpvGroupDesc, setWizardFilterStpvGroupDesc] = useState("");
  const [wizardFilterStpvGroupStatus, setWizardFilterStpvGroupStatus] = useState("");
  const [wizardFilterStpvGroupCukCuk, setWizardFilterStpvGroupCukCuk] = useState("");

  // Wizard Menu Groups (Nhóm thực đơn ShopeeFood)
  const [wizardMenuGroups, setWizardMenuGroups] = useState<any[]>([
    { id: "wmg1", name: "Món chính", description: "Các món chính của cửa hàng", linkedGroupId: "ccmg1" },
    { id: "wmg2", name: "Món ăn nhẹ", description: "Các món ăn vặt nhẹ", linkedGroupId: "" },
    { id: "wmg3", name: "Đồ uống lạnh", description: "Đồ uống giải khát", linkedGroupId: "ccmg3" },
    { id: "wmg4", name: "Món chè", description: "Các loại chè tráng miệng", linkedGroupId: "" },
  ]);

  // Wizard CukCuk Menu Groups (Nhóm thực đơn MISA CukCuk)
  const [wizardCukCukMenuGroups, setWizardCukCukMenuGroups] = useState<any[]>([
    { id: "ccmg1", name: "Món chính", code: "MC01" },
    { id: "ccmg2", name: "Món ăn nhẹ", code: "AN02" },
    { id: "ccmg3", name: "Đồ uống lạnh", code: "DU03" },
    { id: "ccmg4", name: "Món chè", code: "MC04" },
  ]);

  // Wizard Option Groups (Nhóm STPV ShopeeFood)
  const [wizardStpvGroups, setWizardStpvGroups] = useState<any[]>([
    { id: "wsog1", name: "Topping", description: "Các loại topping thêm kèm", linkedGroupId: "ccsg1" },
    { id: "wsog2", name: "Tùy chọn", description: "Tùy chọn độ ngọt, đá", linkedGroupId: "" },
    { id: "wsog3", name: "Size", description: "Kích thước cốc", linkedGroupId: "ccsg3" },
  ]);

  // Wizard CukCuk Option Groups (Nhóm STPV MISA CukCuk)
  const [wizardCukCukStpvGroups, setWizardCukCukStpvGroups] = useState<any[]>([
    { id: "ccsg1", name: "Topping", code: "TP01" },
    { id: "ccsg2", name: "Tùy chọn", code: "TC02" },
    { id: "ccsg3", name: "Size", code: "SZ03" },
  ]);

  // Món tab filters
  const [wizardFilterName, setWizardFilterName] = useState("");
  const [wizardFilterCategory, setWizardFilterCategory] = useState("");
  const [wizardFilterUnit, setWizardFilterUnit] = useState("");
  const [wizardFilterPrice, setWizardFilterPrice] = useState("");
  const [wizardFilterStatus, setWizardFilterStatus] = useState("");
  const [wizardFilterCukCuk, setWizardFilterCukCuk] = useState("");

  // Sở thích phục vụ tab filters
  const [wizardFilterStpvName, setWizardFilterStpvName] = useState("");
  const [wizardFilterStpvGroup, setWizardFilterStpvGroup] = useState("");
  const [wizardFilterStpvPrice, setWizardFilterStpvPrice] = useState("");
  const [wizardFilterStpvStatus, setWizardFilterStpvStatus] = useState("");
  const [wizardFilterStpvCukCuk, setWizardFilterStpvCukCuk] = useState("");

  // Wizard ShopeeFoods mock state (exactly 2 unlinked items initially)
  const [wizardFoods, setWizardFoods] = useState<any[]>([
    {
      id: 1,
      name: "Bánh mì thịt nướng",
      category: "Món ăn nhẹ",
      unit: "Cái",
      price: 30000,
      status: "Có bán",
      linkedDishId: "cc1",
      image:
        "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=120&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      name: "Phở bò tái",
      category: "Món chính",
      unit: "Bát",
      price: 50000,
      status: "Có bán",
      linkedDishId: "cc2",
      image:
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=120&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      name: "Gà rán giòn",
      category: "Món chính",
      unit: "Đĩa",
      price: 100000,
      status: "Có bán",
      linkedDishId: "cc3",
      image:
        "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=120&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      name: "Bún chả Hà Nội",
      category: "Món ăn nhẹ",
      unit: "Đĩa",
      price: 50000,
      status: "Có bán",
      linkedDishId: "",
      image:
        "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=120&auto=format&fit=crop&q=60",
    },
    {
      id: 5,
      name: "Cơm tấm sườn nướng",
      category: "Món chính",
      unit: "Đĩa",
      price: 100000,
      status: "Có bán",
      linkedDishId: "cc5",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=60",
    },
    {
      id: 6,
      name: "Cocacola",
      category: "Đồ uống lạnh",
      unit: "Lon",
      price: 20000,
      status: "Có bán",
      linkedDishId: "cc6",
      image:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=120&auto=format&fit=crop&q=60",
    },
    {
      id: 7,
      name: "Chè ba màu",
      category: "Món chè",
      unit: "Bát",
      price: 20000,
      status: "Có bán",
      linkedDishId: "cc7",
      image:
        "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=120&auto=format&fit=crop&q=60",
    },
    {
      id: 8,
      name: "Chè khúc bạch",
      category: "Món chè",
      unit: "Bát",
      price: 25000,
      status: "Có bán",
      linkedDishId: "",
      image:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=120&auto=format&fit=crop&q=60",
    },
    {
      id: 9,
      name: "Khoai tây chiên",
      category: "Món ăn nhẹ",
      unit: "Đĩa",
      price: 25000,
      status: "Có bán",
      linkedDishId: "cc9",
    },
    {
      id: 10,
      name: "Nước cam ép",
      category: "Đồ uống lạnh",
      unit: "Cốc",
      price: 30000,
      status: "Có bán",
      linkedDishId: "cc10",
      image:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=120&auto=format&fit=crop&q=60",
    },
  ]);

  // CukCuk corresponding dishes list
  const [wizardCukCukDishes, setWizardCukCukDishes] = useState<any[]>([
    { id: "cc1", name: "Bánh mì thịt nướng", code: "BM01" },
    { id: "cc2", name: "Phở bò tái", code: "PB02" },
    { id: "cc3", name: "Gà rán giòn", code: "GR03" },
    { id: "cc5", name: "Cơm tấm sườn nướng", code: "CT05" },
    { id: "cc6", name: "Cocacola", code: "DU06" },
    { id: "cc7", name: "Chè ba màu", code: "CH07" },
    { id: "cc9", name: "Khoai tây chiên", code: "KT09" },
    { id: "cc10", name: "Nước cam ép", code: "NC10" },
    { id: "cc11", name: "Bún chả Hà Nội", code: "BC11" },
    { id: "cc12", name: "Chè khúc bạch", code: "CH12" },
  ]);

  // Option Groups mock state (exactly 5 unlinked groups initially)
  const [wizardStpv, setWizardStpv] = useState<any[]>([
    {
      id: "stpv1",
      name: "Oreo",
      group: "Topping",
      price: 10000,
      linkedGroupId: "ccg_oreo",
    },
    {
      id: "stpv2",
      name: "Đậu đỏ",
      group: "Topping",
      price: 8000,
      linkedGroupId: "ccg_daudo",
    },
    {
      id: "stpv3",
      name: "Kem trứng",
      group: "Topping",
      price: 15000,
      linkedGroupId: "ccg_kemtrung",
    },
    {
      id: "stpv4",
      name: "Kem cheese",
      group: "Topping",
      price: 15000,
      linkedGroupId: "",
    },
    {
      id: "stpv5",
      name: "Trân châu",
      group: "Topping",
      price: 5000,
      linkedGroupId: "ccg_tranchau",
    },
    {
      id: "stpv6",
      name: "Nhiều đường",
      group: "Tùy chọn",
      price: 0,
      linkedGroupId: "ccg_nhieuduong",
    },
    {
      id: "stpv7",
      name: "Nhiều đá",
      group: "Tùy chọn",
      price: 0,
      linkedGroupId: "ccg_nhieuda",
    },
    { id: "stpv8", name: "Size M", group: "Size", price: 0, linkedGroupId: "" },
    {
      id: "stpv9",
      name: "Size L",
      group: "Size",
      price: 10000,
      linkedGroupId: "ccg_sizel",
    },
    {
      id: "stpv10",
      name: "Thạch dừa",
      group: "Topping",
      price: 10000,
      linkedGroupId: "",
    },
    {
      id: "stpv11",
      name: "Pudding trứng",
      group: "Topping",
      price: 15000,
      linkedGroupId: "",
    },
    {
      id: "stpv12",
      name: "Trân châu trắng",
      group: "Topping",
      price: 10000,
      linkedGroupId: "",
    },
    {
      id: "stpv13",
      name: "Sốt Socola",
      group: "Topping",
      price: 5000,
      linkedGroupId: "",
    },
  ]);

  // Effect to automatically select the first row by default for STPV table (Sở thích phục vụ)
  useEffect(() => {
    const filtered = wizardStpv.filter((item) => {
      const status = item.status || (["stpv4", "stpv11", "stpv12"].includes(item.id) ? "Ngừng sử dụng" : "Sử dụng");
      const isLinked = !!item.linkedGroupId;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(stpvTabSearchQuery.toLowerCase());

      const matchesFilterName =
        !stpvTabFilterName ||
        item.name
          .toLowerCase()
          .includes(stpvTabFilterName.toLowerCase());

      const matchesFilterGroup =
        !stpvTabFilterGroup ||
        item.group
          .toLowerCase()
          .includes(stpvTabFilterGroup.toLowerCase());

      const matchesFilterPrice =
        !stpvTabFilterPrice ||
        item.price
          .toString()
          .includes(stpvTabFilterPrice);

      let matchesFilterStatus = true;
      if (stpvTabFilterStatus) {
        matchesFilterStatus = status === stpvTabFilterStatus;
      }

      let matchesFilterLinked = true;
      if (stpvTabFilterLinked === "linked") {
        matchesFilterLinked = isLinked;
      } else if (stpvTabFilterLinked === "unlinked") {
        matchesFilterLinked = !isLinked;
      }

      return (
        matchesSearch &&
        matchesFilterName &&
        matchesFilterGroup &&
        matchesFilterPrice &&
        matchesFilterStatus &&
        matchesFilterLinked
      );
    });

    if (filtered.length > 0) {
      const isValid = filtered.some((item) => item.id === selectedStpvTabRowId);
      if (!isValid) {
        setSelectedStpvTabRowId(filtered[0].id);
      }
    } else {
      if (selectedStpvTabRowId !== null) {
        setSelectedStpvTabRowId(null);
      }
    }
  }, [
    wizardStpv,
    stpvTabSearchQuery,
    stpvTabFilterName,
    stpvTabFilterGroup,
    stpvTabFilterPrice,
    stpvTabFilterStatus,
    stpvTabFilterLinked,
    selectedStpvTabRowId,
  ]);

  // CukCuk corresponding Option Groups list
  const [wizardCukCukGroups, setWizardCukCukGroups] = useState<any[]>([
    { id: "ccg_oreo", name: "Oreo", code: "TP01" },
    { id: "ccg_daudo", name: "Đậu đỏ", code: "TP02" },
    { id: "ccg_kemtrung", name: "Kem trứng", code: "TP03" },
    { id: "ccg_kemcheese", name: "Kem cheese", code: "TP04" },
    { id: "ccg_tranchau", name: "Trân châu", code: "TP05" },
    { id: "ccg_nhieuduong", name: "Nhiều đường", code: "TC01" },
    { id: "ccg_nhieuda", name: "Nhiều đá", code: "TC02" },
    { id: "ccg_sizem", name: "Size M", code: "SZ01" },
    { id: "ccg_sizel", name: "Size L", code: "SZ02" },
    { id: "ccg_kembo", name: "Kem bơ", code: "TP06" },
    { id: "ccg_thachdua", name: "Thạch dừa", code: "TP07" },
    { id: "ccg_pudding", name: "Pudding trứng", code: "TP08" },
    { id: "ccg_tranchautrang", name: "Trân châu trắng", code: "TP09" },
    { id: "ccg_itduong", name: "Ít đường", code: "TC03" },
    { id: "ccg_itda", name: "Ít đá", code: "TC04" },
  ]);

  const openQuickLink = () => {
    // Map initial items from wizardFoods
    const initializedItems = wizardFoods.map((item) => {
      return {
        ...item,
        isLinked: !!item.linkedDishId,
      };
    });
    setQuickLinkEditingItems(initializedItems);
    
    // Map initial items from wizardStpv
    const initializedStpv = wizardStpv.map((item) => {
      return {
        ...item,
        isLinked: !!item.linkedGroupId,
      };
    });
    setQuickLinkEditingStpv(initializedStpv);

    // Map initial items from wizardMenuGroups
    const initializedMenuGroups = wizardMenuGroups.map((item) => {
      return {
        ...item,
        isLinked: !!item.linkedGroupId,
      };
    });
    setQuickLinkEditingMenuGroups(initializedMenuGroups);

    // Map initial items from wizardStpvGroups
    const initializedStpvGroups = wizardStpvGroups.map((item) => {
      return {
        ...item,
        isLinked: !!item.linkedGroupId,
      };
    });
    setQuickLinkEditingStpvGroups(initializedStpvGroups);

    setQuickLinkTab("dish");

    setQuickLinkSearchText("");
    setQuickLinkCukCukSearchText("");
    setQuickLinkStatusFilter("unlinked");
    setQuickLinkCategoryFilter("");
    setQuickLinkUnitFilter("");
    setQuickLinkStpvGroupFilter("");
    setQuickLinkMenuGroupNameSearch("");
    setQuickLinkMenuGroupDescSearch("");
    setQuickLinkMenuGroupCukCukSearch("");
    setQuickLinkStpvGroupNameSearch("");
    setQuickLinkStpvGroupDescSearch("");
    setQuickLinkStpvGroupCukCukSearch("");
    setQuickLinkActiveDropdownId(null);
    setQuickLinkSelectedIds([]);
    setIsQuickLinkModalOpen(true);
  };

  // Handle direct navigation (Deep Link) from "Hủy hóa đơn" menu
  useEffect(() => {
    if (shopeeFoodDeepLinkActive) {
      setApps((prevApps) =>
        prevApps.map((app) => {
          if (app.id === "shopeefood") {
            return { ...app, isConnected: true };
          }
          return app;
        }),
      );
      setIsShopeeFoodScreenActive(true);
      setShopeeFoodTab("menu");
      setShopeeSyncStarted(true); // Bypass onboarding to menu Directly on deep link
      if (onResetDeepLink) {
        onResetDeepLink();
      }
    }
  }, [shopeeFoodDeepLinkActive, onResetDeepLink]);

  // Handle direct navigation (Deep Link) from "Kết nối vay vốn" menu
  useEffect(() => {
    if (shopeeFoodVayVonDeepLinkActive) {
      setIsShopeeFoodScreenActive(true);
      setIsQrModalOpen(true);
      setShopeeWizardStep(2);
      setStep2SyncProgress(100);
      setIsStep2Syncing(false);
      setIsVayVonFlow(true);
      if (onResetVayVonDeepLink) {
        onResetVayVonDeepLink();
      }
    }
  }, [shopeeFoodVayVonDeepLinkActive, onResetVayVonDeepLink]);

  // Reset Vay Von flow status when QR modal is closed
  useEffect(() => {
    if (!isQrModalOpen) {
      setIsVayVonFlow(false);
    }
  }, [isQrModalOpen]);

  // Simulate scanning of ShopeeFood QR Code
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    if (isQrModalOpen) {
      setQrScanStatus("idle");

      // 1. First 2 seconds: idle (show QR code, button disabled)
      timer1 = setTimeout(() => {
        setQrScanStatus("scanning");

        // 2. Scan animation for 3.0 seconds
        timer2 = setTimeout(() => {
          setQrScanStatus("success");
        }, 3000);
      }, 2000);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isQrModalOpen]);

  // Simulate menu synchronization for Step 2 (takes 5 seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isQrModalOpen && shopeeWizardStep === 2) {
      if (isVayVonFlow) {
        // Skip sync simulator during Vay Von flow, keep at 100%
        return;
      }
      setStep2SyncProgress(0);
      setIsStep2Syncing(true);

      const startTime = Date.now();
      const duration = 5000; // 5 seconds

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
        setStep2SyncProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setIsStep2Syncing(false);
        }
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQrModalOpen, shopeeWizardStep, isVayVonFlow]);

  const handleToggleDay = (id: string) => {
    setShopeeOperatingDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)),
    );
  };

  const handleTimeChange = (
    dayId: string,
    rangeIndex: number,
    field: "from" | "to",
    value: string,
  ) => {
    setShopeeOperatingDays((prev) =>
      prev.map((d) => {
        if (d.id === dayId) {
          const updatedRanges = [...d.ranges];
          updatedRanges[rangeIndex] = {
            ...updatedRanges[rangeIndex],
            [field]: value,
          };
          return { ...d, ranges: updatedRanges };
        }
        return d;
      }),
    );
  };

  const handleQuickSetup = () => {
    setQuickSetupRanges([{ from: "00:00", to: "23:59" }]);
    setQuickSetupStatus("open");
    setIsQuickSetupOpen(true);
  };

  const handleAddHourRange = (id: string) => {
    setShopeeOperatingDays((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          if (d.ranges.length >= 3) {
            onNotification(
              "Tối đa 3 khung giờ hoạt động cho mỗi ngày!",
              "info",
            );
            return d;
          }
          return {
            ...d,
            ranges: [...d.ranges, { from: "08:00", to: "22:00" }],
          };
        }
        return d;
      }),
    );
  };

  const handleRemoveHourRange = (dayId: string, rangeIndex: number) => {
    setShopeeOperatingDays((prev) =>
      prev.map((d) => {
        if (d.id === dayId) {
          if (d.ranges.length <= 1) {
            return d;
          }
          return {
            ...d,
            ranges: d.ranges.filter(
              (_: any, idx: number) => idx !== rangeIndex,
            ),
          };
        }
        return d;
      }),
    );
  };

  // States for adding/editing time groups
  const [isTimeGroupModalOpen, setIsTimeGroupModalOpen] = useState(false);
  const [editingTimeGroup, setEditingTimeGroup] = useState<any>(null);
  const [timeGroupName, setTimeGroupName] = useState("");
  const [timeGroupRange, setTimeGroupRange] = useState("");
  const [timeGroupMenuGroups, setTimeGroupMenuGroups] = useState("");
  const [timeGroupType, setTimeGroupType] = useState<"all" | "custom">(
    "custom",
  );
  const [menuGroupList, setMenuGroupList] = useState<string[]>([]);
  const [selectedMenuGroupIndex, setSelectedMenuGroupIndex] = useState<
    number | null
  >(null);
  const [editingMenuGroupIndex, setEditingMenuGroupIndex] = useState<
    number | null
  >(null);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const handleOpenAddTimeGroup = () => {
    setEditingTimeGroup(null);
    setTimeGroupName("");
    setTimeGroupType("custom");

    // Get currently active operating days/hours set up in Section 1
    const activeDaysList = shopeeOperatingDays
      .filter((d) => d.active)
      .map(
        (d) =>
          `${d.name} (${d.ranges.map((r: any) => `${r.from}-${r.to}`).join(", ")})`,
      );

    // Set first day as selected by default to match image's "Thứ 3 Thứ 6" or similar context
    const initialTags = activeDaysList.slice(0, 2);
    setTimeGroupRange(initialTags.join(", "));
    setMenuGroupList(["BÁNH GẠO-GÀ RÁN", "CĂN TIN", "Bernice Signature"]);
    setSelectedMenuGroupIndex(null);
    setEditingMenuGroupIndex(null);
    setIsTimeGroupModalOpen(true);
    setIsTagDropdownOpen(false);
  };

  const handleOpenEditTimeGroup = (group: any) => {
    setEditingTimeGroup(group);
    setTimeGroupName(group.name);

    const isAll = group.timeRange === "Toàn bộ khung giờ" || !group.timeRange;
    setTimeGroupType(isAll ? "all" : "custom");
    setTimeGroupRange(isAll ? "" : group.timeRange);

    const initialList = group.menuGroups
      ? group.menuGroups
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];
    setMenuGroupList(initialList);
    setSelectedMenuGroupIndex(null);
    setEditingMenuGroupIndex(null);
    setIsTimeGroupModalOpen(true);
    setIsTagDropdownOpen(false);
  };

  const handleSaveTimeGroup = () => {
    if (!timeGroupName.trim()) {
      onNotification("Vui lòng nhập tên khung giờ!", "error");
      return;
    }

    const finalRange =
      timeGroupType === "all" ? "Toàn bộ khung giờ" : timeGroupRange;
    const finalMenuGroups = menuGroupList.join(", ");

    if (editingTimeGroup) {
      setShopeeTimeGroups((prev) =>
        prev.map((g) =>
          g.id === editingTimeGroup.id
            ? {
                ...g,
                name: timeGroupName,
                timeRange: finalRange,
                menuGroups: finalMenuGroups,
              }
            : g,
        ),
      );
      onNotification("Đã cập nhật khung giờ thành công!", "success");
    } else {
      const newGroup = {
        id: "g_" + Date.now(),
        name: timeGroupName,
        timeRange: finalRange,
        menuGroups: finalMenuGroups,
      };
      setShopeeTimeGroups((prev) => [...prev, newGroup]);
      onNotification("Đã thêm khung giờ thành công!", "success");
    }
    setIsTimeGroupModalOpen(false);
  };

  const handleDeleteTimeGroup = (id: string) => {
    setShopeeTimeGroups((prev) => prev.filter((g) => g.id !== id));
    onNotification("Đã xóa khung giờ!", "info");
  };

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = apps.filter(
    (app) =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleConnection = (appId: string) => {
    const updated = apps.map((app) => {
      if (app.id === appId) {
        const nextState = !app.isConnected;
        if (appId === "shopeefood" && !nextState) {
          setShopeeSyncStarted(false);
        }
        onNotification(
          nextState
            ? `Đã kết nối thành công ứng dụng ${app.title}`
            : `Đã ngắt kết nối ứng dụng ${app.title}`,
          nextState ? "success" : "info",
        );
        return { ...app, isConnected: nextState };
      }
      return app;
    });
    setApps(updated);

    // Update selected app state if it's currently open
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, isConnected: !selectedApp.isConnected });
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    onNotification(
      "Cảm ơn bạn đã gửi phản hồi! Chúng tôi sẽ phản hồi sớm nhất có thể.",
      "success",
    );
    setIsFeedbackOpen(false);
    setFeedbackText("");
    setFeedbackEmail("");
  };

  if (isShopeeFoodScreenActive) {
    const isConnected =
      apps.find((a) => a.id === "shopeefood")?.isConnected || false;

    if (isQrModalOpen) {
      return (
        <div className="fixed inset-0 z-[9999] flex flex-col h-screen w-screen animate-fade-in select-none bg-[#F0F2F4] font-sans">
          {/* 1️⃣ Page Header */}
          <div className="flex items-center justify-between py-3 px-6 bg-white border-b border-[#E9EAEB] select-none flex-shrink-0 h-14 w-full">
            <div className="flex items-center gap-3">
              <h2 className="text-[#101828] font-semibold text-xl font-sans">
                Kết nối ShopeeFood
              </h2>
            </div>

            {/* Stepper */}
            <div className="hidden md:flex items-center gap-2">
              {/* Step 1 */}
              <div className="flex items-center">
                <div
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] ${
                    shopeeWizardStep === 1
                      ? "bg-[#245FDF] text-white font-bold"
                      : shopeeWizardStep > 1
                        ? "bg-[#EDFCF4] text-[#245FDF] border border-[#245FDF]/30 font-bold"
                        : "bg-white border border-[#D5D7DA] text-[#717680] font-normal"
                  }`}
                >
                  {shopeeWizardStep > 1 ? "✓" : "1"}
                </div>
                <span
                  className={`text-[13px] font-sans ml-2 ${shopeeWizardStep === 1 ? "text-[#101828] font-bold" : "text-[#717680] font-normal"}`}
                >
                  Kết nối Shopee Partner
                </span>
              </div>
              <div className="w-12 h-[1px] bg-[#E9EAEB] mx-2"></div>

              {/* Step 2 */}
              <div className="flex items-center">
                <div
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] ${
                    shopeeWizardStep === 2
                      ? "bg-[#245FDF] text-white font-bold"
                      : shopeeWizardStep > 2
                        ? "bg-[#EDFCF4] text-[#245FDF] border border-[#245FDF]/30 font-bold"
                        : "bg-white border border-[#D5D7DA] text-[#717680] font-normal"
                  }`}
                >
                  {shopeeWizardStep > 2 ? "✓" : "2"}
                </div>
                <span
                  className={`text-[13px] font-sans ml-2 ${shopeeWizardStep === 2 ? "text-[#101828] font-bold" : "text-[#717680] font-normal"}`}
                >
                  Đồng bộ & Thiết lập thực đơn
                </span>
              </div>
              <div className="w-12 h-[1px] bg-[#E9EAEB] mx-2"></div>

              {/* Step 3 */}
              <div className="flex items-center">
                <div
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] ${
                    shopeeWizardStep === 3
                      ? "bg-[#245FDF] text-white font-bold"
                      : "bg-white border border-[#D5D7DA] text-[#717680] font-normal"
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-[13px] font-sans ml-2 ${shopeeWizardStep === 3 ? "text-[#101828] font-bold" : "text-[#717680] font-normal"}`}
                >
                  Thiết lập bán hàng
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsQrModalOpen(false);
                setShopeeWizardStep(1);
              }}
              className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer bg-transparent border-none flex items-center justify-center"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main content body with card */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col w-full">
            {/* Green Alert Banner (Moved outside card, to the top) */}
            {shopeeWizardStep === 2 &&
              step2SyncProgress === 100 &&
              isWizardAlertVisible && (
                <div className="mb-4 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-left flex items-start justify-between relative animate-fade-in w-full shadow-sm">
                  <div className="flex gap-3">
                    <img
                      src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=7a455866-0603-4dad-b673-9749aa7b640a.png&isTemp=true&tenantCode=misa"
                      className="w-10 h-10 object-contain flex-shrink-0 mt-0.5"
                      alt="Success"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-[#065F46] font-bold text-[14px] font-sans">
                        Đồng bộ thực đơn từ ShopeeFood về MISA CukCuk thành công !
                      </h4>
                      <p className="text-[#047857] text-[13px] mt-0.5 font-sans leading-relaxed">
                        Hệ thống đã đồng bộ danh mục thực đơn từ ShopeeFood. Vui lòng đối chiếu
                        các nhóm thực đơn, nhóm sở thích phục vụ, món ăn/sở thích phục vụ và
                        điều chỉnh giá bán nếu cần để hoàn tất thiết lập.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsWizardAlertVisible(false)}
                    className="text-[#047857] hover:text-[#065F46] opacity-70 hover:opacity-100 p-1 hover:bg-[#D1FAE5]/50 rounded transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                    title="Đóng"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

            <div
              className={`w-full bg-white rounded-xl shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] flex flex-col border border-[#E9EAEB] ${
                shopeeWizardStep === 3
                  ? "flex-initial h-auto overflow-visible"
                  : "flex-1 overflow-hidden"
              }`}
              style={shopeeWizardStep === 3 ? {} : { minHeight: "520px" }}
            >
              {/* Card Body */}
              <div
                className={`w-full ${
                  shopeeWizardStep === 3
                    ? "flex-initial flex flex-col overflow-visible h-auto"
                    : "flex-1 flex flex-col overflow-hidden"
                } ${
                  (shopeeWizardStep === 2 && step2SyncProgress === 100) ||
                  shopeeWizardStep === 3
                    ? "p-0 items-stretch justify-start"
                    : "p-6 items-center justify-center space-y-6 md:space-y-8"
                }`}
              >
                {shopeeWizardStep === 1 &&
                  (qrScanStatus === "success" ? (
                    /* KẾT NỐI THÀNH CÔNG SCREEN FROM THE IMAGE - NO PULSE, NO DROP-SHADOW */
                    <div className="flex flex-col items-center justify-center text-center animate-success-pop">
                      {/* Illustration of successful connection */}
                      <div className="flex items-center justify-center h-[240px] select-none">
                        <img
                          src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=c8698e8f-5b21-43a9-ab92-ea8fc4c30dc0.png&isTemp=true&tenantCode=misa"
                          alt="Kết nối thành công"
                          className="h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Congratulation text - Spacing increased to 32px (mt-8) */}
                      <h4 className="text-[#101828] font-bold text-[22px] font-sans mt-8 leading-normal select-none">
                        Kết nối thành công!
                      </h4>
                      <p className="text-center text-[#717680] text-[13px] leading-relaxed max-w-[620px] px-4 font-sans mt-2">
                        Hệ thống đã kết nối thành công với tài khoản quản lý{" "}
                        <strong className="font-semibold text-[#101828]">
                          ShopeeFood Partner
                        </strong>{" "}
                        của bạn.
                      </p>

                      {/* Connection Details Information Box */}
                      <div className="mt-6 px-6 py-4 bg-[#F5F9FF] border border-[#245FDF] rounded-[12px] text-left w-full max-w-[420px] flex flex-col gap-y-3 animate-fade-in">
                        <div className="flex justify-between items-center text-[14px]">
                          <span className="text-[#101828] font-normal font-sans">
                            Gian hàng:
                          </span>
                          <span className="text-[#101828] font-semibold font-sans">
                            Ánh Dương Restaurants 2
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[14px]">
                          <span className="text-[#101828] font-normal font-sans">
                            Thực đơn:
                          </span>
                          <span className="text-[#101828] font-semibold font-sans">
                            {wizardFoods.length} món, {wizardStpv.length} sở
                            thích phục vụ
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* QR CODE DISPLAY AND SCANNING SCREEN */
                    <>
                      {/* Two Logos Connected */}
                      <div className="flex items-center justify-center">
                        <img
                          src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=21c6b94b-a3f5-494c-8704-9d66af34ce1f.png&isTemp=true&tenantCode=misa"
                          alt="Kết nối CukCuk và Shopee Partner"
                          className="h-12 md:h-[52px] object-contain select-none"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* QR Card Box with custom background image */}
                      <div
                        className="w-full max-w-[440px] p-6 rounded-xl flex flex-col items-center justify-center gap-4 select-none"
                        style={{
                          backgroundImage:
                            "url('https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=9313ef14-70eb-4551-a979-f91a1be4ee03.png&isTemp=true&tenantCode=misa')",
                          backgroundSize: "100% 100%",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="relative w-44 h-44 bg-white flex items-center justify-center p-2 rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ShopeeFoodPartnerCukCukIntegration_SPF-98234-CUK"
                            alt="ShopeeFood QR Code"
                            className="w-full h-full object-contain select-none"
                            referrerPolicy="no-referrer"
                          />
                          {/* Center ShopeeFood Badge Logo image */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 rounded-lg border-2 border-white flex items-center justify-center shadow-md bg-white overflow-hidden">
                              <img
                                src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=7717488d-5460-4428-a978-9e222acdeda3.png&isTemp=true&tenantCode=misa"
                                alt="ShopeeFood Partner"
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>

                          {/* Vivid neon glowing scanner radar sweep wash */}
                          {qrScanStatus === "scanning" && (
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(238,77,45,0.08)] to-transparent animate-scan-glow z-10 pointer-events-none" />
                          )}

                          {/* Vivid neon glowing laser horizontal line */}
                          {qrScanStatus === "scanning" && (
                            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#EE4D2D] to-transparent shadow-[0_0_14px_6px_rgba(238,77,45,0.85)] animate-qr-scan z-20 pointer-events-none" />
                          )}
                        </div>

                        <div className="text-center text-[13px] text-gray-700 font-sans">
                          Gian hàng:{" "}
                          <span className="text-[#101828] font-bold">
                            Ánh Dương Restaurants 2
                          </span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <p className="text-center text-[#717680] text-[13px] leading-relaxed max-w-[620px] px-4 font-sans">
                        Vui lòng mở ứng dụng{" "}
                        <strong className="font-semibold text-[#101828]">
                          Shopee Partner
                        </strong>{" "}
                        (hoặc ứng dụng Shopee chính) trên điện thoại di động,
                        <br />
                        đi vào mục{" "}
                        <strong className="font-semibold text-[#101828]">
                          "Thiết lập / Đồng bộ CukCuk"
                        </strong>{" "}
                        và quét mã dưới đây để tích hợp nhanh cửa hàng.
                      </p>
                    </>
                  ))}

                {shopeeWizardStep === 2 &&
                  (step2SyncProgress < 100 ? (
                    /* STEP 2 - MENU SYNCHRONIZATION WITH PROGRESS BAR */
                    <div className="flex flex-col items-center justify-center w-full max-w-2xl text-center space-y-6 animate-fade-in p-6 mx-auto">
                      {/* Unique menu image for sync (does not affect intro) */}
                      <div className="flex items-center justify-center h-[200px] select-none">
                        <img
                          src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=8fbc624f-d945-4dd7-83c5-f638dc5ea670.png&isTemp=true&tenantCode=misa"
                          alt="Đồng bộ thực đơn"
                          className="h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="w-full max-w-[520px] flex flex-col items-center animate-fade-in">
                        {/* Progress Bar */}
                        <div className="w-full max-w-[380px] h-[7px] bg-[#E9EAEB] rounded-full overflow-hidden mb-6">
                          <div
                            className="h-full bg-[#245FDF] rounded-full transition-all duration-100 ease-out"
                            style={{ width: `${step2SyncProgress}%` }}
                          />
                        </div>

                        {/* Title */}
                        <h4 className="text-[#101828] font-bold text-[20px] font-sans mb-2 text-center tracking-tight">
                          Đang đồng bộ thực đơn từ ShopeeFood...
                        </h4>

                        {/* Subtitle */}
                        <p className="text-[13px] text-[#717680] font-sans text-center leading-relaxed max-w-[450px]">
                          Hệ thống đang đồng bộ thực đơn và tự động liên kết món
                          từ ShopeeFood với món trên MISA CukCuk.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* STEP 2 - SYNCHRONIZATION COMPLETED STATE (Vẽ lại y hệt như ảnh) */
                    <div className="flex-1 flex flex-col overflow-hidden w-full h-full text-left bg-white">
                      {/* Header Title & Button Block */}
                      <div className="px-6 py-4 flex items-center justify-between select-none">
                        <div>
                          <h3 className="text-[#101828] font-bold text-[16px] font-sans">
                            Thiết lập thực đơn ShopeeFood
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            setIsChooseDishModalOpen(true);
                            setChooseDishSelectedIds([]);
                          }}
                          className="bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-medium text-[13px] px-4 rounded-[8px] flex items-center justify-center transition-all h-[32px] cursor-pointer border-none shadow-sm font-sans flex-shrink-0"
                        >
                          Chọn món
                        </button>
                      </div>

                      {/* Tabs Strip and Warning Information */}
                      <div className="px-6 border-b border-[#E9EAEB] flex items-center justify-between select-none bg-white">
                        <div className="flex gap-6">
                          {/* Tab 1: Món (dynamic) */}
                          <button
                            onClick={() => setWizardSubTab("menu")}
                            className={`pb-3 text-[14px] font-semibold flex items-center gap-2 transition-all cursor-pointer border-b-2 border-solid relative bg-transparent outline-none ${
                              wizardSubTab === "menu"
                                ? "text-[#245FDF] border-[#245FDF]"
                                : "text-[#717680] border-transparent hover:text-[#101828]"
                            }`}
                          >
                            <span>Món ({wizardFoods.length})</span>
                            {wizardFoods.filter((f) => !f.linkedDishId).length >
                              0 && (
                              <AlertTriangle className="w-4 h-4 text-[#F59E0B] stroke-[2.5px]" />
                            )}
                          </button>

                          {/* Tab 2: Nhóm thực đơn (dynamic) */}
                          <button
                            onClick={() => setWizardSubTab("menuGroup")}
                            className={`pb-3 text-[14px] font-semibold flex items-center gap-2 transition-all cursor-pointer border-b-2 border-solid relative bg-transparent outline-none ${
                              wizardSubTab === "menuGroup"
                                ? "text-[#245FDF] border-[#245FDF]"
                                : "text-[#717680] border-transparent hover:text-[#101828]"
                            }`}
                          >
                            <span>Nhóm thực đơn ({wizardMenuGroups.length})</span>
                            {wizardMenuGroups.filter((g) => !g.linkedGroupId).length >
                              0 && (
                              <AlertTriangle className="w-4 h-4 text-[#F59E0B] stroke-[2.5px]" />
                            )}
                          </button>

                          {/* Tab 3: Sở thích phục vụ (dynamic) */}
                          <button
                            onClick={() => setWizardSubTab("stpv")}
                            className={`pb-3 text-[14px] font-semibold flex items-center gap-2 transition-all cursor-pointer border-b-2 border-solid relative bg-transparent outline-none ${
                              wizardSubTab === "stpv"
                                ? "text-[#245FDF] border-[#245FDF]"
                                : "text-[#717680] border-transparent hover:text-[#101828]"
                            }`}
                          >
                            <span>Sở thích phục vụ ({wizardStpv.length})</span>
                            {wizardStpv.filter((s) => !s.linkedGroupId).length >
                              0 && (
                              <AlertTriangle className="w-4 h-4 text-[#F59E0B] stroke-[2.5px]" />
                            )}
                          </button>

                          {/* Tab 4: Nhóm STPV (dynamic) */}
                          <button
                            onClick={() => setWizardSubTab("stpvGroup")}
                            className={`pb-3 text-[14px] font-semibold flex items-center gap-2 transition-all cursor-pointer border-b-2 border-solid relative bg-transparent outline-none ${
                              wizardSubTab === "stpvGroup"
                                ? "text-[#245FDF] border-[#245FDF]"
                                : "text-[#717680] border-transparent hover:text-[#101828]"
                            }`}
                          >
                            <span>Nhóm STPV ({wizardStpvGroups.length})</span>
                            {wizardStpvGroups.filter((sg) => !sg.linkedGroupId).length >
                              0 && (
                              <AlertTriangle className="w-4 h-4 text-[#F59E0B] stroke-[2.5px]" />
                            )}
                          </button>
                        </div>

                        {/* Warnings status column block on far right */}
                        {((wizardSubTab === "menu" &&
                          wizardFoods.filter((f) => !f.linkedDishId).length >
                            0) ||
                          (wizardSubTab === "menuGroup" &&
                            wizardMenuGroups.filter((g) => !g.linkedGroupId).length >
                              0) ||
                          (wizardSubTab === "stpv" &&
                            wizardStpv.filter((s) => !s.linkedGroupId).length >
                              0) ||
                          (wizardSubTab === "stpvGroup" &&
                            wizardStpvGroups.filter((sg) => !sg.linkedGroupId).length >
                              0)) && (
                          <div className="pb-3 flex items-center gap-2 text-[#B45309] font-medium text-[13px]">
                            <AlertTriangle className="w-4.5 h-4.5 text-[#F59E0B] stroke-[2.5px]" />
                            <span>
                              {wizardSubTab === "menu" && `Có ${wizardFoods.filter((f) => !f.linkedDishId).length}/${wizardFoods.length} món ăn chưa được liên kết`}
                              {wizardSubTab === "menuGroup" && `Có ${wizardMenuGroups.filter((g) => !g.linkedGroupId).length}/${wizardMenuGroups.length} nhóm thực đơn chưa được liên kết`}
                              {wizardSubTab === "stpv" && `Có ${wizardStpv.filter((s) => !s.linkedGroupId).length}/${wizardStpv.length} STPV chưa được liên kết`}
                              {wizardSubTab === "stpvGroup" && `Có ${wizardStpvGroups.filter((sg) => !sg.linkedGroupId).length}/${wizardStpvGroups.length} nhóm STPV chưa được liên kết`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Table Area */}
                      <div className="flex-1 overflow-auto p-0">
                        {wizardSubTab === "menu" && (
                          /* FOOD DISHES TABLE LAYOUT */
                          <div className="w-full bg-white">
                            <table className="w-full border-collapse text-left text-[13px]">
                              <thead>
                                {/* Single Header Row: Combining Titles and Filters with Vertically Centered Text */}
                                <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB]">
                                  {/* Ảnh */}
                                  <th className="px-4 py-2 text-center text-[#101828] font-bold w-[70px] border-r border-[#E9EAEB]">
                                    <div className="flex h-[72px] items-center justify-center text-center">
                                      <span>Ảnh</span>
                                    </div>
                                  </th>

                                  {/* Tên món */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[180px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Tên món</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterName}
                                          onChange={(e) =>
                                            setWizardFilterName(e.target.value)
                                          }
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Nhóm thực đơn */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[140px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Nhóm thực đơn</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterCategory}
                                          onChange={(e) =>
                                            setWizardFilterCategory(
                                              e.target.value,
                                            )
                                          }
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Đơn vị tính */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[100px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Đơn vị tính</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterUnit}
                                          onChange={(e) =>
                                            setWizardFilterUnit(e.target.value)
                                          }
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Giá bán trên ShopeeFood */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[150px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Giá bán trên ShopeeFood</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          ≤
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterPrice}
                                          onChange={(e) =>
                                            setWizardFilterPrice(e.target.value)
                                          }
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Trạng thái liên kết */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] w-[140px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Trạng thái liên kết</span>
                                      </div>
                                      <select
                                        value={wizardFilterStatus}
                                        onChange={(e) =>
                                          setWizardFilterStatus(e.target.value)
                                        }
                                        className="w-full h-[28px] border border-[#D5D7DA] rounded-[4px] text-[12px] bg-white text-[#101828] outline-none px-1 py-0 cursor-pointer focus:border-[#245FDF] font-normal"
                                      >
                                        <option value="">Tất cả</option>
                                        <option value="linked">
                                          Đã liên kết
                                        </option>
                                        <option value="unlinked">
                                          Chưa liên kết
                                        </option>
                                      </select>
                                    </div>
                                  </th>

                                  {/* Sao chép về MISA CukCuk */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] w-[150px] text-center">
                                    <div className="flex h-[72px] items-center justify-center text-center text-[#101828] font-bold">
                                      <span>Sao chép về MISA CukCuk</span>
                                    </div>
                                  </th>

                                  {/* Món tương ứng trên MISA CukCuk */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[220px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>
                                          Món tương ứng trên MISA CukCuk
                                        </span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterCukCuk}
                                          onChange={(e) =>
                                            setWizardFilterCukCuk(
                                              e.target.value,
                                            )
                                          }
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Action / Trash */}
                                  <th className="px-4 py-2 w-[60px] text-center">
                                    <div className="flex h-[72px] items-center justify-center text-center">
                                      <div className="flex-1 flex items-center justify-center" />
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {wizardFoods.filter((item) => {
                                  if (
                                    wizardFilterName &&
                                    !item.name
                                      .toLowerCase()
                                      .includes(wizardFilterName.toLowerCase())
                                  )
                                    return false;
                                  if (
                                    wizardFilterCategory &&
                                    !item.category
                                      .toLowerCase()
                                      .includes(
                                        wizardFilterCategory.toLowerCase(),
                                      )
                                  )
                                    return false;
                                  if (
                                    wizardFilterUnit &&
                                    !item.unit
                                      .toLowerCase()
                                      .includes(wizardFilterUnit.toLowerCase())
                                  )
                                    return false;
                                  if (wizardFilterPrice) {
                                    const val = parseFloat(
                                      wizardFilterPrice.replace(/\./g, ""),
                                    );
                                    if (!isNaN(val) && item.price > val)
                                      return false;
                                  }
                                  if (wizardFilterStatus) {
                                    const isL = !!item.linkedDishId;
                                    if (wizardFilterStatus === "linked" && !isL)
                                      return false;
                                    if (
                                      wizardFilterStatus === "unlinked" &&
                                      isL
                                    )
                                      return false;
                                  }
                                  if (wizardFilterCukCuk) {
                                    const ccName =
                                      wizardCukCukDishes.find(
                                        (c) => c.id === item.linkedDishId,
                                      )?.name || "";
                                    if (
                                      !ccName
                                        .toLowerCase()
                                        .includes(
                                          wizardFilterCukCuk.toLowerCase(),
                                        )
                                    )
                                      return false;
                                  }
                                  return true;
                                }).length > 0 ? (
                                  wizardFoods
                                    .filter((item) => {
                                      if (
                                        wizardFilterName &&
                                        !item.name
                                          .toLowerCase()
                                          .includes(
                                            wizardFilterName.toLowerCase(),
                                          )
                                      )
                                        return false;
                                      if (
                                        wizardFilterCategory &&
                                        !item.category
                                          .toLowerCase()
                                          .includes(
                                            wizardFilterCategory.toLowerCase(),
                                          )
                                      )
                                        return false;
                                      if (
                                        wizardFilterUnit &&
                                        !item.unit
                                          .toLowerCase()
                                          .includes(
                                            wizardFilterUnit.toLowerCase(),
                                          )
                                      )
                                        return false;
                                      if (wizardFilterPrice) {
                                        const val = parseFloat(
                                          wizardFilterPrice.replace(/\./g, ""),
                                        );
                                        if (!isNaN(val) && item.price > val)
                                          return false;
                                      }
                                      if (wizardFilterStatus) {
                                        const isL = !!item.linkedDishId;
                                        if (
                                          wizardFilterStatus === "linked" &&
                                          !isL
                                        )
                                          return false;
                                        if (
                                          wizardFilterStatus === "unlinked" &&
                                          isL
                                        )
                                          return false;
                                      }
                                      if (wizardFilterCukCuk) {
                                        const ccName =
                                          wizardCukCukDishes.find(
                                            (c) => c.id === item.linkedDishId,
                                          )?.name || "";
                                        if (
                                          !ccName
                                            .toLowerCase()
                                            .includes(
                                              wizardFilterCukCuk.toLowerCase(),
                                            )
                                        )
                                          return false;
                                      }
                                      return true;
                                    })
                                    .map((item) => {
                                      const isLinked = !!item.linkedDishId;
                                      return (
                                        <tr
                                          key={item.id}
                                          className="border-b border-[#E9EAEB] hover:bg-[#F9FAFB] transition-colors h-[54px]"
                                        >
                                          {/* Image */}
                                          <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-center select-none">
                                            {renderItemImage(item.image)}
                                          </td>

                                          {/* Name */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-[#101828] font-semibold">
                                            {item.name}
                                          </td>

                                          {/* Category */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-[#101828]">
                                            {item.category}
                                          </td>

                                          {/* Unit */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-[#101828]">
                                            {item.unit}
                                          </td>

                                          {/* Price */}
                                          <td className="px-3 py-1.5 border-r border-[#E9EAEB]">
                                            <div className="flex items-center bg-white border border-[#D5D7DA] rounded-[4px] px-2 py-0.5 h-[28px] focus-within:border-[#245FDF] w-[110px] ml-auto">
                                              <input
                                                type="text"
                                                value={item.price.toLocaleString(
                                                  "vi-VN",
                                                )}
                                                onChange={(e) => {
                                                  const rawVal =
                                                    e.target.value.replace(
                                                      /[^0-9]/g,
                                                      "",
                                                    );
                                                  const numericVal =
                                                    parseInt(rawVal, 10) || 0;
                                                  setWizardFoods((prev) =>
                                                    prev.map((f) =>
                                                      f.id === item.id
                                                        ? {
                                                            ...f,
                                                            price: numericVal,
                                                          }
                                                        : f,
                                                    ),
                                                  );
                                                }}
                                                className="w-full text-[13px] font-medium text-right bg-transparent outline-none border-none p-0 focus:ring-0 text-[#101828]"
                                              />
                                            </div>
                                          </td>

                                          {/* Status */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB]">
                                            {item.fromCukCuk ? (
                                              <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                                <span className="font-semibold text-[#10B981]">
                                                  Đã liên kết
                                                </span>
                                              </div>
                                            ) : (
                                              <div className="flex items-center gap-1.5">
                                                <span
                                                  className={`w-2 h-2 rounded-full ${isLinked ? "bg-[#10B981]" : "bg-[#717680]"}`}
                                                />
                                                <span
                                                  className={`font-semibold ${isLinked ? "text-[#10B981]" : "text-[#717680]"}`}
                                                >
                                                  {isLinked
                                                    ? "Đã liên kết"
                                                    : "Chưa liên kết"}
                                                </span>
                                              </div>
                                            )}
                                          </td>

                                          {/* Copy Button */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-center">
                                            {item.fromCukCuk ? (
                                              <button
                                                type="button"
                                                disabled
                                                className="p-1.5 text-gray-300 rounded-md cursor-not-allowed inline-flex items-center justify-center bg-transparent border border-transparent"
                                                title="Món ăn thêm từ Chọn món đã có trên MISA CukCuk"
                                              >
                                                <Copy className="w-4 h-4 text-gray-300" />
                                              </button>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const newId = `cc_auto_${item.id}`;
                                                  const newDishName = item.name;
                                                  const codePrefix =
                                                    item.category
                                                      .slice(0, 2)
                                                      .toUpperCase() || "MA";
                                                  const randomNum = Math.floor(
                                                    10 + Math.random() * 90,
                                                  );
                                                  const newCode = `${codePrefix}${randomNum}`;
                                                  setWizardCukCukDishes(
                                                    (prev) => {
                                                      if (
                                                        prev.some(
                                                          (d) => d.id === newId,
                                                        )
                                                      )
                                                        return prev;
                                                      return [
                                                        ...prev,
                                                        {
                                                          id: newId,
                                                          name: newDishName,
                                                          code: newCode,
                                                        },
                                                      ];
                                                    },
                                                  );
                                                  setWizardFoods((prev) =>
                                                    prev.map((f) =>
                                                      f.id === item.id
                                                        ? {
                                                            ...f,
                                                            linkedDishId: newId,
                                                          }
                                                        : f,
                                                    ),
                                                  );
                                                  onNotification(
                                                    `Món mới ${item.name} đã được sao chép về MISA CukCuk`,
                                                    "success",
                                                  );
                                                }}
                                                className="p-1.5 hover:bg-[#EBF5FF] text-[#245FDF] rounded-md transition-colors cursor-pointer inline-flex items-center justify-center bg-transparent border border-transparent hover:border-[#245FDF]/15 animate-pulse-once relative z-10"
                                                title="Sao chép món"
                                              >
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M11.667 2.5V5.83333C11.667 6.05435 11.7548 6.26631 11.9111 6.42259C12.0674 6.57887 12.2793 6.66667 12.5003 6.66667H15.8337M15.8337 7.91667V6.66667L11.667 2.5H5.83366C5.39163 2.5 4.96771 2.67559 4.65515 2.98816C4.34259 3.30072 4.16699 3.72464 4.16699 4.16667V15.8333C4.16699 16.2754 4.34259 16.6993 4.65515 17.0118C4.96771 17.3244 5.39163 17.5 5.83366 17.5H12.0837M11.667 13.3333H18.3337M15.8337 15.8333L18.3337 13.3333L15.8337 10.8333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                              </button>
                                            )}
                                          </td>

                                          {/* CukCuk Dish Selector */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] overflow-visible">
                                            {item.fromCukCuk ? (
                                              <div className="relative">
                                                <button
                                                  type="button"
                                                  disabled
                                                  className="w-full h-[32px] px-2 text-[13px] border border-[#D5D7DA] rounded-[6px] bg-[#F5F5F5] text-gray-500 cursor-not-allowed flex items-center justify-between font-medium font-sans"
                                                >
                                                  <span className="truncate">
                                                    {item.linkedDishId ? (
                                                      (() => {
                                                        const matched =
                                                          wizardCukCukDishes.find(
                                                            (cc) =>
                                                              cc.id ===
                                                              item.linkedDishId,
                                                          );
                                                        return matched
                                                          ? `${matched.code ? `[${matched.code}] ` : ""}${matched.name}`
                                                          : "";
                                                      })()
                                                    ) : (
                                                      <span className="text-gray-400 font-normal">
                                                        Chọn món tương ứng...
                                                      </span>
                                                    )}
                                                  </span>
                                                  <svg
                                                    className="w-4 h-4 text-[#A4A7AE] flex-shrink-0 ml-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M19 9l-7 7-7-7"
                                                    />
                                                  </svg>
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="relative">
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    if (
                                                      activeDropdownId ===
                                                      `food_${item.id}`
                                                    ) {
                                                      setActiveDropdownId(null);
                                                    } else {
                                                      setActiveDropdownId(
                                                        `food_${item.id}`,
                                                      );
                                                      setDropdownSearch("");
                                                    }
                                                  }}
                                                  className="w-full h-[32px] px-2 text-[13px] border border-[#D5D7DA] rounded-[6px] bg-white text-[#101828] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/10 flex items-center justify-between cursor-pointer font-medium text-left font-sans"
                                                >
                                                  <span className="truncate">
                                                    {item.linkedDishId ? (
                                                      (() => {
                                                        const matched =
                                                          wizardCukCukDishes.find(
                                                            (cc) =>
                                                              cc.id ===
                                                              item.linkedDishId,
                                                          );
                                                        return matched
                                                          ? `${matched.code ? `[${matched.code}] ` : ""}${matched.name}`
                                                          : "";
                                                      })()
                                                    ) : (
                                                      <span className="text-gray-400 font-normal">
                                                        Chọn món tương ứng...
                                                      </span>
                                                    )}
                                                  </span>
                                                  <svg
                                                    className="w-4 h-4 text-[#717680] flex-shrink-0 ml-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M19 9l-7 7-7-7"
                                                    />
                                                  </svg>
                                                </button>

                                                {activeDropdownId ===
                                                  `food_${item.id}` && (
                                                  <>
                                                    <div
                                                      className="fixed inset-0 z-40 bg-transparent"
                                                      onClick={() =>
                                                        setActiveDropdownId(
                                                          null,
                                                        )
                                                      }
                                                    />
                                                    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#D5D7DA] rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col text-left">
                                                      <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0">
                                                        <input
                                                          type="text"
                                                          placeholder="Tìm mã, tên món..."
                                                          value={dropdownSearch}
                                                          onChange={(e) =>
                                                            setDropdownSearch(
                                                              e.target.value,
                                                            )
                                                          }
                                                          className="w-full h-8 px-2.5 text-[12px] border border-[#D5D7DA] rounded-md outline-none focus:border-[#245FDF] bg-white text-[#101828]"
                                                          autoFocus
                                                          onClick={(e) =>
                                                            e.stopPropagation()
                                                          }
                                                        />
                                                      </div>
                                                      <div className="flex-1 overflow-y-auto max-h-[160px] divide-y divide-gray-50">
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            setWizardFoods(
                                                              (prev) =>
                                                                prev.map((f) =>
                                                                  f.id ===
                                                                  item.id
                                                                    ? {
                                                                        ...f,
                                                                        linkedDishId:
                                                                          "",
                                                                      }
                                                                    : f,
                                                                ),
                                                            );
                                                            setActiveDropdownId(
                                                              null,
                                                            );
                                                          }}
                                                          className="w-full px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-sans bg-white border-none"
                                                        >
                                                          -- Bỏ chọn --
                                                        </button>
                                                        {wizardCukCukDishes
                                                          .filter((cc) => {
                                                            if (!dropdownSearch)
                                                              return true;
                                                            const q =
                                                              dropdownSearch.toLowerCase();
                                                            return (
                                                              (cc.code || "")
                                                                .toLowerCase()
                                                                .includes(q) ||
                                                              cc.name
                                                                .toLowerCase()
                                                                .includes(q)
                                                            );
                                                          })
                                                          .map((cc) => (
                                                            <button
                                                              key={cc.id}
                                                              type="button"
                                                              onClick={() => {
                                                                setWizardFoods(
                                                                  (prev) =>
                                                                    prev.map(
                                                                      (f) =>
                                                                        f.id ===
                                                                        item.id
                                                                          ? {
                                                                              ...f,
                                                                              linkedDishId:
                                                                                cc.id,
                                                                            }
                                                                          : f,
                                                                    ),
                                                                );
                                                                setActiveDropdownId(
                                                                  null,
                                                                );
                                                              }}
                                                              className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 cursor-pointer flex flex-col font-sans border-none ${
                                                                item.linkedDishId ===
                                                                cc.id
                                                                  ? "bg-[#F0F6FE] text-[#245FDF] font-semibold"
                                                                  : "text-[#101828] bg-white"
                                                              }`}
                                                            >
                                                              <span className="text-[10px] text-gray-400 font-semibold font-mono">
                                                                {cc.code}
                                                              </span>
                                                              <span className="text-[13px]">
                                                                {cc.name}
                                                              </span>
                                                            </button>
                                                          ))}
                                                        {wizardCukCukDishes.filter(
                                                          (cc) => {
                                                            if (!dropdownSearch)
                                                              return true;
                                                            const q =
                                                              dropdownSearch.toLowerCase();
                                                            return (
                                                              (cc.code || "")
                                                                .toLowerCase()
                                                                .includes(q) ||
                                                              cc.name
                                                                .toLowerCase()
                                                                .includes(q)
                                                            );
                                                          },
                                                        ).length === 0 && (
                                                          <div className="px-3 py-3 text-center text-[12px] text-gray-400 font-sans">
                                                            Không tìm thấy món
                                                            ăn phù hợp
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </>
                                                )}
                                              </div>
                                            )}
                                          </td>

                                          {/* Trash / Delete Row Button */}
                                          <td className="px-4 py-2 text-center">
                                            <button
                                              onClick={() => {
                                                setWizardFoods((prev) =>
                                                  prev.filter(
                                                    (f) => f.id !== item.id,
                                                  ),
                                                );
                                                onNotification(
                                                  `Đã xóa món "${item.name}" khỏi danh mục đối chiếu`,
                                                  "info",
                                                );
                                              }}
                                              className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center bg-transparent border-none"
                                              title="Xóa đối chiếu"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={9}
                                      className="text-center py-8 text-[#717680] font-sans"
                                    >
                                      Không tìm thấy món ăn nào phù hợp với bộ
                                      lọc.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {wizardSubTab === "menuGroup" && (
                          /* MENU GROUPS (NHÓM THỰC ĐƠN) TABLE LAYOUT */
                          <div className="w-full bg-white animate-fade-in">
                            <table className="w-full border-collapse text-left text-[13px]">
                              <thead>
                                <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB]">
                                  {/* Tên nhóm thực đơn */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[200px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Tên nhóm thực đơn</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterMenuGroupName}
                                          onChange={(e) => setWizardFilterMenuGroupName(e.target.value)}
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Mô tả */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[200px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Mô tả</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterMenuGroupDesc}
                                          onChange={(e) => setWizardFilterMenuGroupDesc(e.target.value)}
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Trạng thái liên kết */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] w-[140px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Trạng thái liên kết</span>
                                      </div>
                                      <select
                                        value={wizardFilterMenuGroupStatus}
                                        onChange={(e) => setWizardFilterMenuGroupStatus(e.target.value)}
                                        className="w-full h-[28px] border border-[#D5D7DA] rounded-[4px] text-[12px] bg-white text-[#101828] outline-none px-1 py-0 cursor-pointer focus:border-[#245FDF] font-normal"
                                      >
                                        <option value="">Tất cả</option>
                                        <option value="linked">Đã liên kết</option>
                                        <option value="unlinked">Chưa liên kết</option>
                                      </select>
                                    </div>
                                  </th>

                                  {/* Nhóm thực đơn tương ứng trên MISA CukCuk */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[220px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Nhóm tương ứng trên MISA CukCuk</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterMenuGroupCukCuk}
                                          onChange={(e) => setWizardFilterMenuGroupCukCuk(e.target.value)}
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Xóa */}
                                  <th className="px-4 py-2 w-[60px] text-center">
                                    <div className="flex h-[72px] items-center justify-center text-center">
                                      <div className="flex-1 flex items-center justify-center" />
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {wizardMenuGroups.filter((item) => {
                                  if (wizardFilterMenuGroupName && !item.name.toLowerCase().includes(wizardFilterMenuGroupName.toLowerCase())) return false;
                                  if (wizardFilterMenuGroupDesc && !item.description.toLowerCase().includes(wizardFilterMenuGroupDesc.toLowerCase())) return false;
                                  if (wizardFilterMenuGroupStatus) {
                                    const isL = !!item.linkedGroupId;
                                    if (wizardFilterMenuGroupStatus === "linked" && !isL) return false;
                                    if (wizardFilterMenuGroupStatus === "unlinked" && isL) return false;
                                  }
                                  if (wizardFilterMenuGroupCukCuk) {
                                    const ccName = wizardCukCukMenuGroups.find((c) => c.id === item.linkedGroupId)?.name || "";
                                    if (!ccName.toLowerCase().includes(wizardFilterMenuGroupCukCuk.toLowerCase())) return false;
                                  }
                                  return true;
                                }).length > 0 ? (
                                  wizardMenuGroups
                                    .filter((item) => {
                                      if (wizardFilterMenuGroupName && !item.name.toLowerCase().includes(wizardFilterMenuGroupName.toLowerCase())) return false;
                                      if (wizardFilterMenuGroupDesc && !item.description.toLowerCase().includes(wizardFilterMenuGroupDesc.toLowerCase())) return false;
                                      if (wizardFilterMenuGroupStatus) {
                                        const isL = !!item.linkedGroupId;
                                        if (wizardFilterMenuGroupStatus === "linked" && !isL) return false;
                                        if (wizardFilterMenuGroupStatus === "unlinked" && isL) return false;
                                      }
                                      if (wizardFilterMenuGroupCukCuk) {
                                        const ccName = wizardCukCukMenuGroups.find((c) => c.id === item.linkedGroupId)?.name || "";
                                        if (!ccName.toLowerCase().includes(wizardFilterMenuGroupCukCuk.toLowerCase())) return false;
                                      }
                                      return true;
                                    })
                                    .map((item) => {
                                      const isLinked = !!item.linkedGroupId;
                                      return (
                                        <tr key={item.id} className="border-b border-[#E9EAEB] hover:bg-[#F9FAFB] transition-colors h-[54px]">
                                          {/* Name */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-[#101828] font-semibold">
                                            {item.name}
                                          </td>

                                          {/* Description */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-[#717680]">
                                            {item.description}
                                          </td>

                                          {/* Status */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB]">
                                            <div className="flex items-center gap-1.5">
                                              <span className={`w-2 h-2 rounded-full ${isLinked ? "bg-[#12B76A]" : "bg-[#717680]"}`} />
                                              <span className={`font-semibold ${isLinked ? "text-[#12B76A]" : "text-[#717680]"}`}>
                                                {isLinked ? "Đã liên kết" : "Chưa liên kết"}
                                              </span>
                                            </div>
                                          </td>

                                          {/* Dropdown Select CukCuk corresponding */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] overflow-visible">
                                            <div className="relative">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  if (activeDropdownId === `menugroup_${item.id}`) {
                                                    setActiveDropdownId(null);
                                                  } else {
                                                    setActiveDropdownId(`menugroup_${item.id}`);
                                                    setDropdownSearch("");
                                                  }
                                                }}
                                                className="w-full h-[32px] px-2 text-[13px] border border-[#D5D7DA] rounded-[6px] bg-white text-[#101828] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/10 flex items-center justify-between cursor-pointer font-medium text-left font-sans"
                                              >
                                                <span className="truncate">
                                                  {item.linkedGroupId ? (
                                                    (() => {
                                                      const matched = wizardCukCukMenuGroups.find((cc) => cc.id === item.linkedGroupId);
                                                      return matched ? `${matched.code ? `[${matched.code}] ` : ""}${matched.name}` : "";
                                                    })()
                                                  ) : (
                                                    <span className="text-gray-400 font-normal">Chọn nhóm tương ứng...</span>
                                                  )}
                                                </span>
                                                <svg className="w-4 h-4 text-[#717680] flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                              </button>

                                              {activeDropdownId === `menugroup_${item.id}` && (
                                                <>
                                                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActiveDropdownId(null)} />
                                                  <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#D5D7DA] rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col text-left">
                                                    <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0">
                                                      <input
                                                        type="text"
                                                        placeholder="Tìm mã, tên nhóm..."
                                                        value={dropdownSearch}
                                                        onChange={(e) => setDropdownSearch(e.target.value)}
                                                        className="w-full h-8 px-2.5 text-[12px] border border-[#D5D7DA] rounded-md outline-none focus:border-[#245FDF] bg-white text-[#101828]"
                                                        autoFocus
                                                        onClick={(e) => e.stopPropagation()}
                                                      />
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto max-h-[160px] divide-y divide-gray-50">
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setWizardMenuGroups((prev) =>
                                                            prev.map((g) => g.id === item.id ? { ...g, linkedGroupId: "" } : g)
                                                          );
                                                          setActiveDropdownId(null);
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-sans bg-white border-none"
                                                      >
                                                        -- Bỏ chọn --
                                                      </button>
                                                      {wizardCukCukMenuGroups
                                                        .filter((cc) => {
                                                          if (!dropdownSearch) return true;
                                                          const q = dropdownSearch.toLowerCase();
                                                          return (cc.code || "").toLowerCase().includes(q) || cc.name.toLowerCase().includes(q);
                                                        })
                                                        .map((cc) => (
                                                          <button
                                                            key={cc.id}
                                                            type="button"
                                                            onClick={() => {
                                                              setWizardMenuGroups((prev) =>
                                                                prev.map((g) => g.id === item.id ? { ...g, linkedGroupId: cc.id } : g)
                                                              );
                                                              setActiveDropdownId(null);
                                                            }}
                                                            className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 cursor-pointer flex flex-col font-sans border-none ${
                                                              item.linkedGroupId === cc.id ? "bg-[#F0F6FE] text-[#245FDF] font-semibold" : "text-[#101828] bg-white"
                                                            }`}
                                                          >
                                                            <span className="text-[10px] text-gray-400 font-semibold font-mono">{cc.code}</span>
                                                            <span className="text-[13px]">{cc.name}</span>
                                                          </button>
                                                        ))}
                                                      {wizardCukCukMenuGroups.filter((cc) => {
                                                        if (!dropdownSearch) return true;
                                                        const q = dropdownSearch.toLowerCase();
                                                        return (cc.code || "").toLowerCase().includes(q) || cc.name.toLowerCase().includes(q);
                                                      }).length === 0 && (
                                                        <div className="px-3 py-3 text-center text-[12px] text-gray-400 font-sans">
                                                          Không tìm thấy nhóm thực đơn phù hợp
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </td>

                                          {/* Delete button */}
                                          <td className="px-4 py-2 text-center">
                                            <button
                                              onClick={() => {
                                                setWizardMenuGroups((prev) => prev.filter((g) => g.id !== item.id));
                                                onNotification(`Đã xóa nhóm thực đơn "${item.name}" khỏi danh mục đối chiếu`, "info");
                                              }}
                                              className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center bg-transparent border-none"
                                              title="Xóa đối chiếu"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })
                                ) : (
                                  <tr>
                                    <td colSpan={6} className="text-center py-8 text-[#717680] font-sans">
                                      Không tìm thấy nhóm thực đơn nào phù hợp với bộ lọc.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {wizardSubTab === "stpv" && (
                          /* OPTION GROUPS (STPV) TABLE LAYOUT */
                          <div className="w-full bg-white">
                            <table className="w-full border-collapse text-left text-[13px]">
                              <thead>
                                {/* Single Header Row: Combining Titles and Filters with Vertically Centered Text */}
                                <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB]">
                                  {/* Tên sở thích phục vụ */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[200px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Tên sở thích phục vụ</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterStpvName}
                                          onChange={(e) =>
                                            setWizardFilterStpvName(
                                              e.target.value,
                                            )
                                          }
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Nhóm STPV */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[140px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Nhóm STPV</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterStpvGroup}
                                          onChange={(e) =>
                                            setWizardFilterStpvGroup(
                                              e.target.value,
                                            )
                                          }
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Giá bán trên ShopeeFood */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[150px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Giá bán trên ShopeeFood</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          ≤
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterStpvPrice}
                                          onChange={(e) =>
                                            setWizardFilterStpvPrice(
                                              e.target.value,
                                            )
                                          }
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Trạng thái liên kết */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] w-[140px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Trạng thái liên kết</span>
                                      </div>
                                      <select
                                        value={wizardFilterStpvStatus}
                                        onChange={(e) =>
                                          setWizardFilterStpvStatus(
                                            e.target.value,
                                          )
                                        }
                                        className="w-full h-[28px] border border-[#D5D7DA] rounded-[4px] text-[12px] bg-white text-[#101828] outline-none px-1 py-0 cursor-pointer focus:border-[#245FDF] font-normal"
                                      >
                                        <option value="">Tất cả</option>
                                        <option value="linked">
                                          Đã liên kết
                                        </option>
                                        <option value="unlinked">
                                          Chưa liên kết
                                        </option>
                                      </select>
                                    </div>
                                  </th>

                                  {/* STPV tương ứng trên MISA CukCuk */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[220px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>
                                          STPV tương ứng trên MISA CukCuk
                                        </span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterStpvCukCuk}
                                          onChange={(e) =>
                                            setWizardFilterStpvCukCuk(
                                              e.target.value,
                                            )
                                          }
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Action / Trash */}
                                  <th className="px-4 py-2 w-[60px] text-center">
                                    <div className="flex h-[72px] items-center justify-center text-center">
                                      <div className="flex-1 flex items-center justify-center" />
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {wizardStpv.filter((item) => {
                                  if (
                                    wizardFilterStpvName &&
                                    !item.name
                                      .toLowerCase()
                                      .includes(
                                        wizardFilterStpvName.toLowerCase(),
                                      )
                                  )
                                    return false;
                                  if (
                                    wizardFilterStpvGroup &&
                                    !item.group
                                      .toLowerCase()
                                      .includes(
                                        wizardFilterStpvGroup.toLowerCase(),
                                      )
                                  )
                                    return false;
                                  if (wizardFilterStpvPrice) {
                                    const val = parseInt(
                                      wizardFilterStpvPrice.replace(
                                        /[^0-9]/g,
                                        "",
                                      ),
                                    );
                                    if (!isNaN(val) && item.price > val)
                                      return false;
                                  }
                                  if (wizardFilterStpvStatus) {
                                    const isL = !!item.linkedGroupId;
                                    if (
                                      wizardFilterStpvStatus === "linked" &&
                                      !isL
                                    )
                                      return false;
                                    if (
                                      wizardFilterStpvStatus === "unlinked" &&
                                      isL
                                    )
                                      return false;
                                  }
                                  if (wizardFilterStpvCukCuk) {
                                    const ccName =
                                      wizardCukCukGroups.find(
                                        (c) => c.id === item.linkedGroupId,
                                      )?.name || "";
                                    if (
                                      !ccName
                                        .toLowerCase()
                                        .includes(
                                          wizardFilterStpvCukCuk.toLowerCase(),
                                        )
                                    )
                                      return false;
                                  }
                                  return true;
                                }).length > 0 ? (
                                  wizardStpv
                                    .filter((item) => {
                                      if (
                                        wizardFilterStpvName &&
                                        !item.name
                                          .toLowerCase()
                                          .includes(
                                            wizardFilterStpvName.toLowerCase(),
                                          )
                                      )
                                        return false;
                                      if (
                                        wizardFilterStpvGroup &&
                                        !item.group
                                          .toLowerCase()
                                          .includes(
                                            wizardFilterStpvGroup.toLowerCase(),
                                          )
                                      )
                                        return false;
                                      if (wizardFilterStpvPrice) {
                                        const val = parseInt(
                                          wizardFilterStpvPrice.replace(
                                            /[^0-9]/g,
                                            "",
                                          ),
                                        );
                                        if (!isNaN(val) && item.price > val)
                                          return false;
                                      }
                                      if (wizardFilterStpvStatus) {
                                        const isL = !!item.linkedGroupId;
                                        if (
                                          wizardFilterStpvStatus === "linked" &&
                                          !isL
                                        )
                                          return false;
                                        if (
                                          wizardFilterStpvStatus ===
                                            "unlinked" &&
                                          isL
                                        )
                                          return false;
                                      }
                                      if (wizardFilterStpvCukCuk) {
                                        const ccName =
                                          wizardCukCukGroups.find(
                                            (c) => c.id === item.linkedGroupId,
                                          )?.name || "";
                                        if (
                                          !ccName
                                            .toLowerCase()
                                            .includes(
                                              wizardFilterStpvCukCuk.toLowerCase(),
                                            )
                                        )
                                          return false;
                                      }
                                      return true;
                                    })
                                    .map((item) => {
                                      const isLinked = !!item.linkedGroupId;
                                      return (
                                        <tr
                                          key={item.id}
                                          className="border-b border-[#E9EAEB] hover:bg-[#F9FAFB] transition-colors h-[54px]"
                                        >
                                          {/* Name */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-[#101828] font-semibold">
                                            {item.name}
                                          </td>

                                          {/* Group */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-[#101828]">
                                            {item.group}
                                          </td>

                                          {/* Price */}
                                          <td className="px-3 py-1.5 border-r border-[#E9EAEB]">
                                            <div className="flex items-center bg-white border border-[#D5D7DA] rounded-[4px] px-2 py-0.5 h-[28px] focus-within:border-[#245FDF] w-[110px] ml-auto">
                                              <input
                                                type="text"
                                                value={item.price.toLocaleString(
                                                  "vi-VN",
                                                )}
                                                onChange={(e) => {
                                                  const rawVal =
                                                    e.target.value.replace(
                                                      /[^0-9]/g,
                                                      "",
                                                    );
                                                  const numericVal =
                                                    parseInt(rawVal, 10) || 0;
                                                  setWizardStpv((prev) =>
                                                    prev.map((s) =>
                                                      s.id === item.id
                                                        ? {
                                                            ...s,
                                                            price: numericVal,
                                                          }
                                                        : s,
                                                    ),
                                                  );
                                                }}
                                                className="w-full text-[13px] font-medium text-right bg-transparent outline-none border-none p-0 focus:ring-0 text-[#101828]"
                                              />
                                            </div>
                                          </td>

                                          {/* Status */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB]">
                                            <div className="flex items-center gap-1.5">
                                              <span
                                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                  isLinked
                                                    ? "bg-[#12B76A]"
                                                    : "bg-[#717680]"
                                                }`}
                                              />
                                              <span
                                                className={`font-semibold ${isLinked ? "text-[#12B76A]" : "text-[#717680]"}`}
                                              >
                                                {isLinked
                                                  ? "Đã liên kết"
                                                  : "Chưa liên kết"}
                                              </span>
                                            </div>
                                          </td>

                                          {/* CukCuk Option Selector */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] overflow-visible">
                                            <div className="relative">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  if (
                                                    activeDropdownId ===
                                                    `stpv_${item.id}`
                                                  ) {
                                                    setActiveDropdownId(null);
                                                  } else {
                                                    setActiveDropdownId(
                                                      `stpv_${item.id}`,
                                                    );
                                                    setDropdownSearch("");
                                                  }
                                                }}
                                                className="w-full h-[32px] px-2 text-[13px] border border-[#D5D7DA] rounded-[6px] bg-white text-[#101828] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/10 flex items-center justify-between cursor-pointer font-medium text-left font-sans"
                                              >
                                                <span className="truncate">
                                                  {item.linkedGroupId ? (
                                                    (() => {
                                                      const matched =
                                                        wizardCukCukGroups.find(
                                                          (ccg) =>
                                                            ccg.id ===
                                                            item.linkedGroupId,
                                                        );
                                                      return matched
                                                        ? `${matched.code ? `[${matched.code}] ` : ""}${matched.name}`
                                                        : "";
                                                    })()
                                                  ) : (
                                                    <span className="text-gray-400 font-normal">
                                                      Chọn STPV tương ứng...
                                                    </span>
                                                  )}
                                                </span>
                                                <svg
                                                  className="w-4 h-4 text-[#717680] flex-shrink-0 ml-1"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                  />
                                                </svg>
                                              </button>

                                              {activeDropdownId ===
                                                `stpv_${item.id}` && (
                                                <>
                                                  <div
                                                    className="fixed inset-0 z-40 bg-transparent"
                                                    onClick={() =>
                                                      setActiveDropdownId(null)
                                                    }
                                                  />
                                                  <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#D5D7DA] rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col text-left">
                                                    <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0">
                                                      <input
                                                        type="text"
                                                        placeholder="Tìm mã, tên STPV..."
                                                        value={dropdownSearch}
                                                        onChange={(e) =>
                                                          setDropdownSearch(
                                                            e.target.value,
                                                          )
                                                        }
                                                        className="w-full h-8 px-2.5 text-[12px] border border-[#D5D7DA] rounded-md outline-none focus:border-[#245FDF] bg-white text-[#101828]"
                                                        autoFocus
                                                        onClick={(e) =>
                                                          e.stopPropagation()
                                                        }
                                                      />
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto max-h-[160px] divide-y divide-gray-50">
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setWizardStpv(
                                                            (prev) =>
                                                              prev.map((s) =>
                                                                s.id === item.id
                                                                  ? {
                                                                      ...s,
                                                                      linkedGroupId:
                                                                        "",
                                                                    }
                                                                  : s,
                                                              ),
                                                          );
                                                          setActiveDropdownId(
                                                            null,
                                                          );
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-sans bg-white border-none"
                                                      >
                                                        -- Bỏ chọn --
                                                      </button>
                                                      {wizardCukCukGroups
                                                        .filter((ccg) => {
                                                          if (!dropdownSearch)
                                                            return true;
                                                          const q =
                                                            dropdownSearch.toLowerCase();
                                                          return (
                                                            (ccg.code || "")
                                                              .toLowerCase()
                                                              .includes(q) ||
                                                            ccg.name
                                                              .toLowerCase()
                                                              .includes(q)
                                                          );
                                                        })
                                                        .map((ccg) => (
                                                          <button
                                                            key={ccg.id}
                                                            type="button"
                                                            onClick={() => {
                                                              setWizardStpv(
                                                                (prev) =>
                                                                  prev.map(
                                                                    (s) =>
                                                                      s.id ===
                                                                      item.id
                                                                        ? {
                                                                            ...s,
                                                                            linkedGroupId:
                                                                              ccg.id,
                                                                          }
                                                                        : s,
                                                                  ),
                                                              );
                                                              setActiveDropdownId(
                                                                null,
                                                              );
                                                            }}
                                                            className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 cursor-pointer flex flex-col font-sans border-none ${
                                                              item.linkedGroupId ===
                                                              ccg.id
                                                                ? "bg-[#F0F6FE] text-[#245FDF] font-semibold"
                                                                : "text-[#101828] bg-white"
                                                            }`}
                                                          >
                                                            <span className="text-[10px] text-gray-400 font-semibold font-mono">
                                                              {ccg.code}
                                                            </span>
                                                            <span className="text-[13px]">
                                                              {ccg.name}
                                                            </span>
                                                          </button>
                                                        ))}
                                                      {wizardCukCukGroups.filter(
                                                        (ccg) => {
                                                          if (!dropdownSearch)
                                                            return true;
                                                          const q =
                                                            dropdownSearch.toLowerCase();
                                                          return (
                                                            (ccg.code || "")
                                                              .toLowerCase()
                                                              .includes(q) ||
                                                            ccg.name
                                                              .toLowerCase()
                                                              .includes(q)
                                                          );
                                                        },
                                                      ).length === 0 && (
                                                        <div className="px-3 py-3 text-center text-[12px] text-gray-400 font-sans">
                                                          Không tìm thấy STPV
                                                          phù hợp
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </td>

                                          {/* Trash / Delete Row Button */}
                                          <td className="px-4 py-2 text-center">
                                            <button
                                              onClick={() => {
                                                setWizardStpv((prev) =>
                                                  prev.filter(
                                                    (s) => s.id !== item.id,
                                                  ),
                                                );
                                                onNotification(
                                                  `Đã xóa sở thích phục vụ "${item.name}" khỏi danh mục đối chiếu`,
                                                  "info",
                                                );
                                              }}
                                              className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center bg-transparent border-none"
                                              title="Xóa đối chiếu"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={6}
                                      className="text-center py-8 text-[#717680] font-sans"
                                    >
                                      Không tìm thấy sở thích phục vụ nào phù
                                      hợp với bộ lọc.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {wizardSubTab === "stpvGroup" && (
                          /* STPV GROUPS (NHÓM STPV) TABLE LAYOUT */
                          <div className="w-full bg-white animate-fade-in">
                            <table className="w-full border-collapse text-left text-[13px]">
                              <thead>
                                <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB]">
                                  {/* Tên nhóm STPV */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[200px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Tên nhóm STPV</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterStpvGroupName}
                                          onChange={(e) => setWizardFilterStpvGroupName(e.target.value)}
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Mô tả */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[200px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Mô tả</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterStpvGroupDesc}
                                          onChange={(e) => setWizardFilterStpvGroupDesc(e.target.value)}
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Trạng thái liên kết */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] w-[140px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Trạng thái liên kết</span>
                                      </div>
                                      <select
                                        value={wizardFilterStpvGroupStatus}
                                        onChange={(e) => setWizardFilterStpvGroupStatus(e.target.value)}
                                        className="w-full h-[28px] border border-[#D5D7DA] rounded-[4px] text-[12px] bg-white text-[#101828] outline-none px-1 py-0 cursor-pointer focus:border-[#245FDF] font-normal"
                                      >
                                        <option value="">Tất cả</option>
                                        <option value="linked">Đã liên kết</option>
                                        <option value="unlinked">Chưa liên kết</option>
                                      </select>
                                    </div>
                                  </th>

                                  {/* Nhóm STPV tương ứng trên MISA CukCuk */}
                                  <th className="px-4 py-2 border-r border-[#E9EAEB] min-w-[220px]">
                                    <div className="flex flex-col w-full h-[72px] justify-between">
                                      <div className="flex-1 flex items-center justify-center text-center font-bold text-[#101828]">
                                        <span>Nhóm tương ứng trên MISA CukCuk</span>
                                      </div>
                                      <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                                        <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                          *
                                        </div>
                                        <input
                                          type="text"
                                          placeholder=""
                                          value={wizardFilterStpvGroupCukCuk}
                                          onChange={(e) => setWizardFilterStpvGroupCukCuk(e.target.value)}
                                          className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                        />
                                      </div>
                                    </div>
                                  </th>

                                  {/* Xóa */}
                                  <th className="px-4 py-2 w-[60px] text-center">
                                    <div className="flex h-[72px] items-center justify-center text-center">
                                      <div className="flex-1 flex items-center justify-center" />
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {wizardStpvGroups.filter((item) => {
                                  if (wizardFilterStpvGroupName && !item.name.toLowerCase().includes(wizardFilterStpvGroupName.toLowerCase())) return false;
                                  if (wizardFilterStpvGroupDesc && !item.description?.toLowerCase().includes(wizardFilterStpvGroupDesc.toLowerCase())) return false;
                                  if (wizardFilterStpvGroupStatus) {
                                    const isL = !!item.linkedGroupId;
                                    if (wizardFilterStpvGroupStatus === "linked" && !isL) return false;
                                    if (wizardFilterStpvGroupStatus === "unlinked" && isL) return false;
                                  }
                                  if (wizardFilterStpvGroupCukCuk) {
                                    const ccName = wizardCukCukStpvGroups.find((c) => c.id === item.linkedGroupId)?.name || "";
                                    if (!ccName.toLowerCase().includes(wizardFilterStpvGroupCukCuk.toLowerCase())) return false;
                                  }
                                  return true;
                                }).length > 0 ? (
                                  wizardStpvGroups
                                    .filter((item) => {
                                      if (wizardFilterStpvGroupName && !item.name.toLowerCase().includes(wizardFilterStpvGroupName.toLowerCase())) return false;
                                      if (wizardFilterStpvGroupDesc && !item.description?.toLowerCase().includes(wizardFilterStpvGroupDesc.toLowerCase())) return false;
                                      if (wizardFilterStpvGroupStatus) {
                                        const isL = !!item.linkedGroupId;
                                        if (wizardFilterStpvGroupStatus === "linked" && !isL) return false;
                                        if (wizardFilterStpvGroupStatus === "unlinked" && isL) return false;
                                      }
                                      if (wizardFilterStpvGroupCukCuk) {
                                        const ccName = wizardCukCukStpvGroups.find((c) => c.id === item.linkedGroupId)?.name || "";
                                        if (!ccName.toLowerCase().includes(wizardFilterStpvGroupCukCuk.toLowerCase())) return false;
                                      }
                                      return true;
                                    })
                                    .map((item) => {
                                      const isLinked = !!item.linkedGroupId;
                                      return (
                                        <tr key={item.id} className="border-b border-[#E9EAEB] hover:bg-[#F9FAFB] transition-colors h-[54px]">
                                          {/* Name */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-[#101828] font-semibold">
                                            {item.name}
                                          </td>

                                          {/* Description */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] text-[#717680] font-sans">
                                            {item.description}
                                          </td>

                                          {/* Status */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB]">
                                            <div className="flex items-center gap-1.5">
                                              <span className={`w-2 h-2 rounded-full ${isLinked ? "bg-[#12B76A]" : "bg-[#717680]"}`} />
                                              <span className={`font-semibold ${isLinked ? "text-[#12B76A]" : "text-[#717680]"}`}>
                                                {isLinked ? "Đã liên kết" : "Chưa liên kết"}
                                              </span>
                                            </div>
                                          </td>

                                          {/* Dropdown Select CukCuk corresponding */}
                                          <td className="px-4 py-2 border-r border-[#E9EAEB] overflow-visible">
                                            <div className="relative">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  if (activeDropdownId === `stpvgroup_${item.id}`) {
                                                    setActiveDropdownId(null);
                                                  } else {
                                                    setActiveDropdownId(`stpvgroup_${item.id}`);
                                                    setDropdownSearch("");
                                                  }
                                                }}
                                                className="w-full h-[32px] px-2 text-[13px] border border-[#D5D7DA] rounded-[6px] bg-white text-[#101828] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/10 flex items-center justify-between cursor-pointer font-medium text-left font-sans"
                                              >
                                                <span className="truncate">
                                                  {item.linkedGroupId ? (
                                                    (() => {
                                                      const matched = wizardCukCukStpvGroups.find((cc) => cc.id === item.linkedGroupId);
                                                      return matched ? `${matched.code ? `[${matched.code}] ` : ""}${matched.name}` : "";
                                                    })()
                                                  ) : (
                                                    <span className="text-gray-400 font-normal">Chọn nhóm tương ứng...</span>
                                                  )}
                                                </span>
                                                <svg className="w-4 h-4 text-[#717680] flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                              </button>

                                              {activeDropdownId === `stpvgroup_${item.id}` && (
                                                <>
                                                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActiveDropdownId(null)} />
                                                  <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#D5D7DA] rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col text-left">
                                                    <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0">
                                                      <input
                                                        type="text"
                                                        placeholder="Tìm mã, tên nhóm..."
                                                        value={dropdownSearch}
                                                        onChange={(e) => setDropdownSearch(e.target.value)}
                                                        className="w-full h-8 px-2.5 text-[12px] border border-[#D5D7DA] rounded-md outline-none focus:border-[#245FDF] bg-white text-[#101828]"
                                                        autoFocus
                                                        onClick={(e) => e.stopPropagation()}
                                                      />
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto max-h-[160px] divide-y divide-gray-50">
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setWizardStpvGroups((prev) =>
                                                            prev.map((sg) => sg.id === item.id ? { ...sg, linkedGroupId: "" } : sg)
                                                          );
                                                          setActiveDropdownId(null);
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-sans bg-white border-none"
                                                      >
                                                        -- Bỏ chọn --
                                                      </button>
                                                      {wizardCukCukStpvGroups
                                                        .filter((cc) => {
                                                          if (!dropdownSearch) return true;
                                                          const q = dropdownSearch.toLowerCase();
                                                          return (cc.code || "").toLowerCase().includes(q) || cc.name.toLowerCase().includes(q);
                                                        })
                                                        .map((cc) => (
                                                          <button
                                                            key={cc.id}
                                                            type="button"
                                                            onClick={() => {
                                                              setWizardStpvGroups((prev) =>
                                                                prev.map((sg) => sg.id === item.id ? { ...sg, linkedGroupId: cc.id } : sg)
                                                              );
                                                              setActiveDropdownId(null);
                                                            }}
                                                            className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 cursor-pointer flex flex-col font-sans border-none ${
                                                              item.linkedGroupId === cc.id ? "bg-[#F0F6FE] text-[#245FDF] font-semibold" : "text-[#101828] bg-white"
                                                            }`}
                                                          >
                                                            <span className="text-[10px] text-gray-400 font-semibold font-mono">{cc.code}</span>
                                                            <span className="text-[13px]">{cc.name}</span>
                                                          </button>
                                                        ))}
                                                      {wizardCukCukStpvGroups.filter((cc) => {
                                                        if (!dropdownSearch) return true;
                                                        const q = dropdownSearch.toLowerCase();
                                                        return (cc.code || "").toLowerCase().includes(q) || cc.name.toLowerCase().includes(q);
                                                      }).length === 0 && (
                                                        <div className="px-3 py-3 text-center text-[12px] text-gray-400 font-sans">
                                                          Không tìm thấy nhóm STPV phù hợp
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </td>

                                          {/* Delete button */}
                                          <td className="px-4 py-2 text-center">
                                            <button
                                              onClick={() => {
                                                setWizardStpvGroups((prev) => prev.filter((sg) => sg.id !== item.id));
                                                onNotification(`Đã xóa nhóm sở thích phục vụ "${item.name}" khỏi danh mục đối chiếu`, "info");
                                              }}
                                              className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center bg-transparent border-none"
                                              title="Xóa đối chiếu"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="text-center py-8 text-[#717680] font-sans">
                                      Không tìm thấy nhóm sở thích phục vụ nào phù hợp với bộ lọc.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                {shopeeWizardStep === 3 && (
                  <>
                  <div className="w-full text-left bg-white rounded-xl">
                    {/* Content Area - No independent scroll, let parent handle it */}
                    <div className="px-8 py-6 space-y-6">
                      {/* Section 1: Thời gian hoạt động */}
                      <div className="space-y-4">
                        <h4 className="text-[#101828] font-bold text-[14px]">
                          Thời gian hoạt động
                        </h4>

                        <div className="space-y-3.5 max-w-[600px]">
                          {shopeeOperatingDays.map((day) => (
                            <div
                              key={day.id}
                              className="flex items-start gap-4 text-[13px] text-[#101828]"
                            >
                              <span className="font-semibold select-none w-10 mt-2">
                                {day.name}
                              </span>

                              <div className="flex-1 space-y-2">
                                {day.ranges.map((range: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3"
                                  >
                                    {idx === 0 ? (
                                      <select
                                        value={day.active ? "open" : "closed"}
                                        onChange={(e) => {
                                          const active = e.target.value === "open";
                                          setShopeeOperatingDays((prev) =>
                                            prev.map((d) =>
                                              d.id === day.id ? { ...d, active } : d,
                                            ),
                                          );
                                        }}
                                        className="h-8 w-[100px] px-2.5 border border-[#D5D7DA] rounded-[8px] text-[#101828] text-[13px] font-medium focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 outline-none bg-white cursor-pointer font-sans"
                                      >
                                        <option value="open">Mở cửa</option>
                                        <option value="closed">Đóng cửa</option>
                                      </select>
                                    ) : (
                                      <div className="w-[100px]" />
                                    )}

                                    <div className={`flex items-center gap-3 transition-opacity ${day.active ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                                      <span className="text-[#717680] text-[13px] w-6">
                                        Từ
                                      </span>
                                      <input
                                        type="text"
                                        value={range.from}
                                        onChange={(e) =>
                                          handleTimeChange(
                                            day.id,
                                            idx,
                                            "from",
                                            e.target.value,
                                          )
                                        }
                                        className="w-24 h-9 px-3 border border-[#D5D7DA] rounded-lg text-[#101828] text-center font-medium focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 outline-none bg-white"
                                      />
                                      <span className="text-[#717680] text-[13px] w-8 text-center">
                                        Đến
                                      </span>
                                      <input
                                        type="text"
                                        value={range.to}
                                        onChange={(e) =>
                                          handleTimeChange(
                                            day.id,
                                            idx,
                                            "to",
                                            e.target.value,
                                          )
                                        }
                                        className="w-24 h-9 px-3 border border-[#D5D7DA] rounded-lg text-[#101828] text-center font-medium focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 outline-none bg-white"
                                      />

                                      {idx === 0 ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleAddHourRange(day.id)
                                          }
                                          disabled={!day.active}
                                          className="w-9 h-9 border border-[#245FDF] text-[#245FDF] hover:bg-[#F0F6FE] disabled:opacity-50 disabled:pointer-events-none rounded-lg flex items-center justify-center transition-all cursor-pointer font-semibold bg-transparent"
                                        >
                                          +
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveHourRange(day.id, idx)
                                          }
                                          disabled={!day.active}
                                          className="w-9 h-9 border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:pointer-events-none rounded-lg flex items-center justify-center transition-all cursor-pointer font-semibold bg-transparent"
                                        >
                                          -
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex flex-col gap-4">
                          <div>
                            <button
                              type="button"
                              onClick={handleQuickSetup}
                              className="px-4 py-1.5 border border-[#245FDF] text-[#245FDF] hover:bg-[#F0F6FE] rounded-lg text-[13px] font-semibold transition-all cursor-pointer bg-white"
                              style={{ height: "36px" }}
                            >
                              Thiết lập nhanh
                            </button>
                          </div>

                          {/* Holiday Setting Section inside Step 3 */}
                          <div className="space-y-3 max-w-[650px] pl-1">
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={shopeeHolidaySetting}
                                onChange={() => {
                                  setShopeeHolidaySetting(!shopeeHolidaySetting);
                                }}
                                className="h-4.5 w-4.5 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer mt-0.5"
                              />
                              <div>
                                <span className="font-semibold text-[13px] text-[#101828] block">Cài đặt ngày lễ / Ngày nghỉ tạm thời</span>
                                <span className="text-xs text-[#717680]">Thiết lập trước những ngày nhà hàng sẽ ngừng nhận đơn trên ShopeeFood trong năm (ngày nghỉ lễ, ngày bảo trì, Tết...).</span>
                              </div>
                            </label>

                            {shopeeHolidaySetting && (
                              <div className="pl-7 space-y-3 pt-2 border-t border-gray-100 animate-fade-in text-[13px]">
                                <div className="space-y-2">
                                  {shopeeHolidays.map((holiday) => (
                                    <div key={holiday.id} className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-[#E9EAEB]">
                                      <div className="flex-1 min-w-[150px]">
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Tên kỳ nghỉ</label>
                                        <input
                                          type="text"
                                          value={holiday.name}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setShopeeHolidays(prev => prev.map(h => h.id === holiday.id ? { ...h, name: val } : h));
                                          }}
                                          className="w-full h-[32px] px-3 border border-[#D5D7DA] rounded-[8px] text-[#101828] font-medium outline-none bg-white text-xs"
                                          placeholder="Ví dụ: Tết Nguyên Đán"
                                        />
                                      </div>
                                      <div className="w-[120px]">
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Từ ngày</label>
                                        <input
                                          type="date"
                                          value={holiday.from}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setShopeeHolidays(prev => prev.map(h => h.id === holiday.id ? { ...h, from: val } : h));
                                          }}
                                          className="w-full h-[32px] px-2 border border-[#D5D7DA] rounded-[8px] text-[#101828] font-medium outline-none bg-white text-xs"
                                        />
                                      </div>
                                      <div className="w-[120px]">
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Đến ngày</label>
                                        <input
                                          type="date"
                                          value={holiday.to}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setShopeeHolidays(prev => prev.map(h => h.id === holiday.id ? { ...h, to: val } : h));
                                          }}
                                          className="w-full h-[32px] px-2 border border-[#D5D7DA] rounded-[8px] text-[#101828] font-medium outline-none bg-white text-xs"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShopeeHolidays(prev => prev.filter(h => h.id !== holiday.id));
                                          onNotification("Đã xóa thiết lập nghỉ lễ", "info");
                                        }}
                                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors mt-5 bg-transparent border-none cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}

                                  {shopeeHolidays.length === 0 && (
                                    <p className="text-gray-400 italic text-xs py-2">Chưa thiết lập ngày nghỉ lễ nào. Vui lòng thêm bên dưới.</p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const newId = Date.now();
                                    setShopeeHolidays(prev => [...prev, { id: newId, name: "Kỳ nghỉ mới", from: "2026-06-28", to: "2026-06-28" }]);
                                  }}
                                  className="flex items-center gap-1.5 text-xs text-[#245FDF] hover:text-[#1849b2] font-semibold transition-all bg-transparent border-none cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                  Thêm ngày nghỉ lễ
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Lịch áp dụng thực đơn (always visible) */}
                      <div className="mt-6 pt-6 border-t border-[#E9EAEB] space-y-4 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[#101828] font-bold text-[14px] m-0">
                            Lịch áp dụng thực đơn
                          </h4>
                          <div className="group relative inline-block">
                            <HelpCircle className="w-4.5 h-4.5 text-[#717680] hover:text-[#245FDF] cursor-help transition-colors" />
                            {/* Tooltip box - aligned below/above cleanly */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-3 bg-[#101828] text-white text-[12px] font-normal leading-relaxed rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[99999] shadow-lg pointer-events-none text-left">
                              Thiết lập các khung giờ bán món cho các món thực đơn cụ thể. Ví dụ: Bữa sáng(Bún, Phở,...), Bữa trưa(Cơm văn phòng,...), Bữa tối(Nhậu, Nướng,...)
                              {/* Arrow */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#101828]"></div>
                            </div>
                          </div>
                        </div>

                          <div className="border border-[#E9EAEB] rounded-xl overflow-hidden bg-white shadow-sm">
                            <table className="w-full border-collapse text-left text-[13px]">
                              <thead>
                                <tr className="bg-[#F8F9FA] border-b border-[#E9EAEB] text-[#475467] font-semibold">
                                  <th className="px-4 py-3 border-r border-[#E9EAEB] font-semibold text-[#344054] w-[25%]">
                                    Tên khung giờ
                                  </th>
                                  <th className="px-4 py-3 border-r border-[#E9EAEB] font-semibold text-[#344054] w-[40%]">
                                    Khung giờ hoạt động
                                  </th>
                                  <th className="px-4 py-3 border-r border-[#E9EAEB] font-semibold text-[#344054] w-[30%]">
                                    Nhóm thực đơn áp dụng
                                  </th>
                                  <th className="px-4 py-3 font-semibold text-[#344054] w-[5%] text-center"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E9EAEB] text-[#344054]">
                                {shopeeTimeGroups.map((group) => (
                                  <tr
                                    key={group.id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                  >
                                    <td className="px-4 py-3.5 border-r border-[#E9EAEB] font-semibold text-[#101828]">
                                      {group.name}
                                    </td>
                                    <td className="px-4 py-3.5 border-r border-[#E9EAEB] text-[#475467]">
                                      {group.timeRange}
                                    </td>
                                    <td className="px-4 py-3.5 border-r border-[#E9EAEB] text-[#475467]">
                                      {group.menuGroups}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenEditTimeGroup(group)
                                          }
                                          className="p-1.5 hover:bg-gray-100 rounded text-[#475467] hover:text-[#101828] transition-colors cursor-pointer bg-transparent border-none"
                                          title="Sửa"
                                        >
                                          <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteTimeGroup(group.id)
                                          }
                                          className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-colors cursor-pointer bg-transparent border-none"
                                          title="Xóa"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {shopeeTimeGroups.length === 0 && (
                                  <tr>
                                    <td
                                      colSpan={4}
                                      className="text-center py-8 text-[#717680] font-sans"
                                    >
                                      Chưa cấu hình khung giờ thay đổi nào. Vui
                                      lòng bấm "Thêm khung giờ" để thiết lập.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex justify-start">
                            <button
                              type="button"
                              onClick={handleOpenAddTimeGroup}
                              className="px-4 h-[32px] border border-[#245FDF] text-[#245FDF] hover:bg-[#F0F6FE] rounded-lg text-[13px] font-semibold transition-all cursor-pointer bg-white flex items-center gap-1.5"
                              style={{ minWidth: "84px" }}
                            >
                              <Plus className="w-4 h-4" />
                              Thêm khung giờ
                            </button>
                          </div>
                        </div>

                      {/* Section 3: Cài đặt đơn hàng */}
                      <div className="mt-8 pt-8 border-t border-[#E9EAEB] space-y-5 animate-fade-in">
                        <h4 className="text-[#101828] font-bold text-[14px]">
                          Cài đặt đơn hàng
                        </h4>

                        <div className="space-y-6 max-w-[650px] pl-1">
                          {/* Toggle A: Tự động xác nhận Order */}
                          <div className="space-y-3">
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={shopeeAutoConfirmOrder}
                                onChange={() => {
                                  setShopeeAutoConfirmOrder(!shopeeAutoConfirmOrder);
                                }}
                                className="h-4.5 w-4.5 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer mt-0.5"
                              />
                              <div>
                                <span className="font-semibold text-[13px] text-[#101828] block">Tự động xác nhận Order</span>
                                <span className="text-xs text-[#717680] block mt-0.5 leading-relaxed">Hệ thống POS tự động phản hồi xác nhận đơn hàng khi nhận được Order đồng bộ từ ShopeeFood.</span>
                              </div>
                            </label>

                            {shopeeAutoConfirmOrder && (
                              <div className="pl-7 space-y-3.5 pt-2 animate-fade-in text-[13px]">
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="wizard_confirm_type"
                                    checked={shopeeAutoConfirmType === "all"}
                                    onChange={() => {
                                      setShopeeAutoConfirmType("all");
                                    }}
                                    className="h-4 w-4 text-[#245FDF] border-gray-300 focus:ring-[#245FDF] cursor-pointer mt-0.5"
                                  />
                                  <div>
                                    <span className="font-semibold text-[#101828]">Tất cả đơn hàng</span>
                                    <span className="block text-xs text-[#717680] mt-0.5">Tất cả đơn hàng đồng bộ về POS đều được tự động xác nhận</span>
                                  </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="wizard_confirm_type"
                                    checked={shopeeAutoConfirmType === "paid"}
                                    onChange={() => {
                                      setShopeeAutoConfirmType("paid");
                                    }}
                                    className="h-4 w-4 text-[#245FDF] border-gray-300 focus:ring-[#245FDF] cursor-pointer mt-0.5"
                                  />
                                  <div>
                                    <span className="font-semibold text-[#101828]">Đơn hàng đã thanh toán</span>
                                    <span className="block text-xs text-[#717680] mt-0.5">Chỉ những Order được thanh toán rồi mới được xác nhận</span>
                                  </div>
                                </label>
                              </div>
                            )}
                          </div>

                          {/* Toggle B: Tự động in hóa đơn tạm tính */}
                          <div className="space-y-3">
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={shopeeAutoPrintReceipt}
                                onChange={() => {
                                  setShopeeAutoPrintReceipt(!shopeeAutoPrintReceipt);
                                }}
                                className="h-4.5 w-4.5 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer mt-0.5"
                              />
                              <div>
                                <span className="font-semibold text-[13px] text-[#101828] block">Tự động in hóa đơn tạm tính</span>
                                <span className="text-xs text-[#717680] block mt-0.5 leading-relaxed">Tự động xuất hóa đơn tạm tính qua máy in liên kết của nhà hàng khi có đơn mới.</span>
                              </div>
                            </label>

                            {shopeeAutoPrintReceipt && (
                              <div className="pl-7 space-y-3.5 pt-2 animate-fade-in text-[13px]">
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="wizard_print_trigger"
                                    checked={shopeeAutoPrintTrigger === "confirmed"}
                                    onChange={() => {
                                      setShopeeAutoPrintTrigger("confirmed");
                                    }}
                                    className="h-4 w-4 text-[#245FDF] border-gray-300 focus:ring-[#245FDF] cursor-pointer mt-0.5"
                                  />
                                  <div>
                                    <span className="font-semibold text-[#101828]">Khi đơn hàng được xác nhận</span>
                                    <span className="block text-xs text-[#717680] mt-0.5">In hóa đơn ngay khi đơn được ghi nhận và xác nhận trên POS.</span>
                                  </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="wizard_print_trigger"
                                    checked={shopeeAutoPrintTrigger === "kitchen"}
                                    onChange={() => {
                                      setShopeeAutoPrintTrigger("kitchen");
                                    }}
                                    className="h-4 w-4 text-[#245FDF] border-gray-300 focus:ring-[#245FDF] cursor-pointer mt-0.5"
                                  />
                                  <div>
                                    <span className="font-semibold text-[#101828]">Khi đơn hàng được gửi bếp</span>
                                    <span className="block text-xs text-[#717680] mt-0.5">In hóa đơn khi món được chuyển lệnh xuống bộ phận chế biến.</span>
                                  </div>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Add/Edit Time Group Popup Modal */}
                    {isTimeGroupModalOpen && (
                      <div className="fixed inset-0 bg-black/40 z-[10005] flex items-center justify-center p-4 animate-fade-in font-sans">
                        <div className="bg-white rounded-xl shadow-2xl border border-[#D5D7DA] w-full max-w-[620px] overflow-hidden flex flex-col text-left">
                          {/* 1️⃣ Header */}
                          <div className="bg-white border-b border-[#E9EAEB] px-4 py-3 flex items-center justify-between text-[#101828] select-none">
                            <h3 className="text-[#101828] font-semibold text-sm font-sans tracking-wide m-0">
                              {editingTimeGroup
                                ? "Sửa khung giờ"
                                : "Thêm khung giờ"}
                            </h3>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  onNotification(
                                    "Hệ thống trợ giúp CukCuk 2.0 đang tải...",
                                    "info",
                                  )
                                }
                                className="text-[#717680] hover:text-[#245FDF] p-1.5 hover:bg-gray-100 rounded transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                title="Trợ giúp"
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsTimeGroupModalOpen(false)}
                                className="text-[#717680] hover:text-red-500 p-1.5 hover:bg-gray-100 rounded transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                title="Đóng"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* 2️⃣ Body content */}
                          <div className="p-5 space-y-4 flex-1">
                            {/* Row 1: Tên khung giờ */}
                            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                              <label className="text-[13px] font-sans text-gray-700 font-medium">
                                Tên khung giờ{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </label>
                              <input
                                type="text"
                                value={timeGroupName}
                                onChange={(e) =>
                                  setTimeGroupName(e.target.value)
                                }
                                placeholder="Ví dụ: Thứ 3 Thứ 6"
                                className="w-full h-8 px-3 border border-[#D5D7DA] rounded text-[#101828] text-[13px] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 font-sans"
                              />
                            </div>

                            {/* Row 2: Khung giờ hoạt động (Radio Select) */}
                            <div className="grid grid-cols-[160px_1fr] gap-4 items-center">
                              <label className="text-[13px] font-sans text-gray-700 font-medium">
                                Khung giờ hoạt động
                              </label>
                              <div className="flex items-center gap-6 select-none">
                                <label className="flex items-center gap-2 cursor-pointer text-[13px] font-sans text-[#101828]">
                                  <input
                                    type="radio"
                                    name="timeGroupType"
                                    checked={timeGroupType === "all"}
                                    onChange={() => setTimeGroupType("all")}
                                    className="h-4 w-4 border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                                  />
                                  Toàn bộ khung giờ
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-[13px] font-sans text-[#101828]">
                                  <input
                                    type="radio"
                                    name="timeGroupType"
                                    checked={timeGroupType === "custom"}
                                    onChange={() => setTimeGroupType("custom")}
                                    className="h-4 w-4 border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                                  />
                                  Chọn khung giờ
                                </label>
                              </div>
                            </div>

                            {/* Row 3: Chọn cụ thể khung giờ (chỉ hiển thị khi timeGroupType === "custom") */}
                            {timeGroupType === "custom" && (
                              <div className="grid grid-cols-[160px_1fr] gap-4 relative items-center animate-fade-in">
                                <label className="text-[13px] font-sans text-gray-700 font-medium">
                                  Chọn khung giờ <span className="text-red-500 font-bold">*</span>
                                </label>
                                <div>
                                  <div
                                    className="flex flex-wrap items-center gap-1.5 p-1 px-2 border border-[#D5D7DA] rounded min-h-[32px] bg-white relative cursor-pointer"
                                    onClick={() =>
                                      setIsTagDropdownOpen(!isTagDropdownOpen)
                                    }
                                  >
                                    <div className="flex flex-wrap gap-1 items-center flex-1 pr-6 select-none">
                                      {timeGroupRange
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean)
                                        .map((tag, idx) => (
                                          <span
                                            key={idx}
                                            className="bg-gray-100 hover:bg-gray-200 text-[#101828] text-[12px] font-sans px-2 py-0.5 rounded flex items-center gap-1 border border-[#E9EAEB] transition-colors"
                                          >
                                            {tag}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const nextTags = timeGroupRange
                                                  .split(",")
                                                  .map((s) => s.trim())
                                                  .filter(Boolean)
                                                  .filter(
                                                    (_, tIdx) => tIdx !== idx,
                                                  );
                                                setTimeGroupRange(
                                                  nextTags.join(", "),
                                                );
                                              }}
                                              className="text-gray-400 hover:text-red-500 font-bold p-0 border-none bg-transparent cursor-pointer flex items-center justify-center text-[10px] w-3 h-3 rounded-full hover:bg-gray-200"
                                            >
                                              ×
                                            </button>
                                          </span>
                                        ))}
                                      {(!timeGroupRange ||
                                        !timeGroupRange.trim()) && (
                                        <span className="text-gray-400 text-xs font-sans pl-1">
                                          Nhấp để chọn khung giờ...
                                        </span>
                                      )}
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-[#717680] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>

                                  {/* Dropdown element with overlay to close */}
                                  {isTagDropdownOpen && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-[10005] bg-transparent"
                                        onClick={() =>
                                          setIsTagDropdownOpen(false)
                                        }
                                      />
                                      <div className="absolute left-0 right-0 mt-1 bg-white border border-[#D5D7DA] rounded shadow-lg z-[10006] max-h-[180px] overflow-y-auto p-1 text-left font-sans text-xs">
                                        <div className="p-1.5 border-b border-[#E9EAEB] flex items-center justify-between text-gray-500 text-[11px] font-medium select-none">
                                          <span>Khung giờ từ Bước 1</span>
                                          <div className="flex gap-2">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const allActive =
                                                  shopeeOperatingDays
                                                    .filter((d) => d.active)
                                                    .map(
                                                      (d) =>
                                                        `${d.name} (${d.ranges.map((r: any) => `${r.from}-${r.to}`).join(", ")})`,
                                                    );
                                                setTimeGroupRange(
                                                  allActive.join(", "),
                                                );
                                              }}
                                              className="text-[#245FDF] hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer text-[10px]"
                                            >
                                              Chọn tất cả
                                            </button>
                                            <span className="text-[#D5D7DA]">
                                              |
                                            </span>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setTimeGroupRange("");
                                              }}
                                              className="text-[#717680] hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer text-[10px]"
                                            >
                                              Xóa chọn
                                            </button>
                                          </div>
                                        </div>
                                        <div className="py-1 space-y-0.5">
                                          {shopeeOperatingDays
                                            .filter((d) => d.active)
                                            .map((d) => {
                                              const formattedRange = d.ranges
                                                .map(
                                                  (r: any) =>
                                                    `${r.from}-${r.to}`,
                                                )
                                                .join(", ");
                                              const dayString = `${d.name} (${formattedRange})`;
                                              const currentTags = timeGroupRange
                                                .split(",")
                                                .map((s) => s.trim())
                                                .filter(Boolean);
                                              const isSelected =
                                                currentTags.includes(dayString);
                                              return (
                                                <label
                                                  key={d.id}
                                                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F0F6FE] rounded cursor-pointer select-none text-[#101828]"
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                >
                                                  <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {
                                                      let nextTags = [
                                                        ...currentTags,
                                                      ];
                                                      if (isSelected) {
                                                        nextTags =
                                                          nextTags.filter(
                                                            (t) =>
                                                              t !== dayString,
                                                          );
                                                      } else {
                                                        nextTags.push(
                                                          dayString,
                                                        );
                                                      }
                                                      const dayOrder = [
                                                        "T2",
                                                        "T3",
                                                        "T4",
                                                        "T5",
                                                        "T6",
                                                        "T7",
                                                        "CN",
                                                      ];
                                                      nextTags.sort((a, b) => {
                                                        const dayA =
                                                          a.split(" ")[0];
                                                        const dayB =
                                                          b.split(" ")[0];
                                                        return (
                                                          dayOrder.indexOf(
                                                            dayA,
                                                          ) -
                                                          dayOrder.indexOf(dayB)
                                                        );
                                                      });
                                                      setTimeGroupRange(
                                                        nextTags.join(", "),
                                                      );
                                                    }}
                                                    className="w-3.5 h-3.5 text-[#245FDF] rounded border-[#D5D7DA] focus:ring-[#245FDF]/20"
                                                  />
                                                  <span className="text-xs font-sans">
                                                    {dayString}
                                                  </span>
                                                </label>
                                              );
                                            })}
                                          {shopeeOperatingDays.filter(
                                            (d) => d.active,
                                          ).length === 0 && (
                                            <div className="p-3 text-center text-gray-400 italic">
                                              Chưa thiết lập ngày hoạt động nào
                                              ở Bước 1
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Section Header: Chọn nhóm thực đơn áp dụng */}
                            <div className="pt-3 border-t border-[#E9EAEB] mt-2">
                              <h4 className="text-[13px] font-sans font-bold text-[#101828] mb-1">
                                Chọn nhóm thực đơn áp dụng
                              </h4>

                              {/* Toolbar Lên / Xuống */}
                              <div className="flex items-center gap-4 py-1 border-b border-[#E9EAEB]">
                                <button
                                  type="button"
                                  disabled={
                                    selectedMenuGroupIndex === null ||
                                    selectedMenuGroupIndex === 0
                                  }
                                  onClick={() => {
                                    if (
                                      selectedMenuGroupIndex === null ||
                                      selectedMenuGroupIndex === 0
                                    )
                                      return;
                                    const newList = [...menuGroupList];
                                    const temp =
                                      newList[selectedMenuGroupIndex];
                                    newList[selectedMenuGroupIndex] =
                                      newList[selectedMenuGroupIndex - 1];
                                    newList[selectedMenuGroupIndex - 1] = temp;
                                    setMenuGroupList(newList);
                                    setSelectedMenuGroupIndex(
                                      selectedMenuGroupIndex - 1,
                                    );
                                  }}
                                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors bg-transparent border-none ${
                                    selectedMenuGroupIndex !== null &&
                                    selectedMenuGroupIndex > 0
                                      ? "text-[#245FDF] hover:bg-[#F0F6FE] cursor-pointer"
                                      : "text-gray-300 cursor-not-allowed"
                                  }`}
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                  Lên
                                </button>
                                <button
                                  type="button"
                                  disabled={
                                    selectedMenuGroupIndex === null ||
                                    selectedMenuGroupIndex ===
                                      menuGroupList.length - 1
                                  }
                                  onClick={() => {
                                    if (
                                      selectedMenuGroupIndex === null ||
                                      selectedMenuGroupIndex ===
                                        menuGroupList.length - 1
                                    )
                                      return;
                                    const newList = [...menuGroupList];
                                    const temp =
                                      newList[selectedMenuGroupIndex];
                                    newList[selectedMenuGroupIndex] =
                                      newList[selectedMenuGroupIndex + 1];
                                    newList[selectedMenuGroupIndex + 1] = temp;
                                    setMenuGroupList(newList);
                                    setSelectedMenuGroupIndex(
                                      selectedMenuGroupIndex + 1,
                                    );
                                  }}
                                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors bg-transparent border-none ${
                                    selectedMenuGroupIndex !== null &&
                                    selectedMenuGroupIndex <
                                      menuGroupList.length - 1
                                      ? "text-[#245FDF] hover:bg-[#F0F6FE] cursor-pointer"
                                      : "text-gray-300 cursor-not-allowed"
                                  }`}
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                  Xuống
                                </button>
                              </div>

                              {/* Table of Menu Groups */}
                              <div className="border border-[#D5D7DA] rounded-lg overflow-hidden mt-2 bg-white flex flex-col min-h-[160px] max-h-[220px]">
                                <table className="w-full text-left border-collapse table-fixed flex-1 flex flex-col">
                                  <thead className="bg-[#F7F7F8] border-b border-[#E9EAEB] flex-shrink-0 w-full">
                                    <tr className="flex w-full">
                                      <th className="w-[80px] py-2 text-center text-xs font-semibold text-gray-700 border-r border-[#E9EAEB] font-sans">
                                        Thứ tự
                                      </th>
                                      <th className="flex-1 py-2 text-center text-xs font-semibold text-gray-700 font-sans">
                                        Nhóm thực đơn
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="overflow-y-auto flex-1 w-full divide-y divide-[#E9EAEB]">
                                    {menuGroupList.map((item, idx) => {
                                      const isSelected =
                                        selectedMenuGroupIndex === idx;
                                      return (
                                        <tr
                                          key={idx}
                                          onClick={() => {
                                            setSelectedMenuGroupIndex(idx);
                                          }}
                                          onDoubleClick={() =>
                                            setEditingMenuGroupIndex(idx)
                                          }
                                          className={`flex w-full transition-colors cursor-pointer select-none items-center ${
                                            isSelected
                                              ? "bg-[#EDFCF4]"
                                              : "hover:bg-gray-50"
                                          }`}
                                        >
                                          <td className="w-[80px] py-2 text-right pr-4 text-xs text-[#101828] border-r border-[#E9EAEB] font-mono font-medium">
                                            {idx + 1}
                                          </td>
                                          <td className="flex-1 py-1 text-left px-3 text-xs text-[#101828] font-sans">
                                            {editingMenuGroupIndex === idx ? (
                                              <select
                                                value={item}
                                                autoFocus
                                                onChange={(e) => {
                                                  const newList = [
                                                    ...menuGroupList,
                                                  ];
                                                  newList[idx] = e.target.value;
                                                  setMenuGroupList(newList);
                                                }}
                                                onBlur={() =>
                                                  setEditingMenuGroupIndex(null)
                                                }
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                                className="w-full h-7 px-2 border border-[#245FDF] rounded focus:outline-none text-xs font-sans bg-white cursor-pointer"
                                              >
                                                <option value="">-- Chọn nhóm thực đơn --</option>
                                                <option value="Bánh gạo">Bánh gạo</option>
                                                <option value="Gà rán">Gà rán</option>
                                                <option value="Nước giải khát">Nước giải khát</option>
                                                <option value="Lẩu">Lẩu</option>
                                                <option value="Bia">Bia</option>
                                                <option value="Món chính">Món chính</option>
                                                <option value="Món ăn nhẹ">Món ăn nhẹ</option>
                                                <option value="Đồ uống lạnh">Đồ uống lạnh</option>
                                                <option value="Phở">Phở</option>
                                                <option value="Món ăn kèm">Món ăn kèm</option>
                                                <option value="Đồ uống">Đồ uống</option>
                                                <option value="Khai vị">Khai vị</option>
                                                <option value="Tráng miệng">Tráng miệng</option>
                                              </select>
                                            ) : (
                                              <div className="py-1 min-h-[24px] flex items-center justify-between group/row">
                                                <span>
                                                  {item || (
                                                    <span className="text-gray-400 italic">
                                                      (Chưa chọn nhóm)
                                                    </span>
                                                  )}
                                                </span>
                                                <span className="text-gray-400 text-[10px] opacity-0 group-hover/row:opacity-100 transition-opacity font-sans">
                                                  Double click để sửa
                                                </span>
                                              </div>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                    {menuGroupList.length === 0 && (
                                      <tr className="flex w-full">
                                        <td className="w-full text-center py-8 text-gray-400 italic text-xs font-sans">
                                          Chưa có nhóm thực đơn nào. Vui lòng
                                          thêm dòng.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              {/* Button Thêm dòng / Xóa dòng */}
                              <div className="flex items-center gap-2 mt-3 select-none">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newList = [...menuGroupList, ""];
                                    setMenuGroupList(newList);
                                    setSelectedMenuGroupIndex(
                                      newList.length - 1,
                                    );
                                    setEditingMenuGroupIndex(
                                      newList.length - 1,
                                    );
                                  }}
                                  className="h-8 px-3 bg-white hover:bg-gray-50 border border-[#D5D7DA] text-gray-700 rounded-lg flex items-center justify-center gap-1.5 text-xs font-sans font-medium transition-all cursor-pointer select-none"
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#245FDF]" />
                                  Thêm dòng
                                </button>
                                <button
                                  type="button"
                                  disabled={selectedMenuGroupIndex === null}
                                  onClick={() => {
                                    if (selectedMenuGroupIndex === null) return;
                                    const newList = menuGroupList.filter(
                                      (_, idx) =>
                                        idx !== selectedMenuGroupIndex,
                                    );
                                    setMenuGroupList(newList);
                                    setSelectedMenuGroupIndex(null);
                                    setEditingMenuGroupIndex(null);
                                  }}
                                  className={`h-8 px-3 border rounded-lg flex items-center justify-center gap-1.5 text-xs font-sans font-medium transition-all select-none ${
                                    selectedMenuGroupIndex !== null
                                      ? "bg-white hover:bg-red-50 border-red-200 text-red-600 cursor-pointer"
                                      : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                  }`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Xóa dòng
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3️⃣ Footer Action bar */}
                          <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] px-5 py-3 flex items-center justify-end select-none">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setIsTimeGroupModalOpen(false)}
                                className="h-8 min-w-[84px] px-4 bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] rounded-lg flex items-center justify-center text-xs font-sans font-medium transition-all cursor-pointer"
                              >
                                Hủy bỏ
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveTimeGroup}
                                className="h-8 min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white rounded-lg flex items-center justify-center text-xs font-sans font-semibold transition-all cursor-pointer border-none shadow-sm"
                              >
                                Lưu
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Screen Footer */}
          <div className="h-14 bg-white border-t border-[#E9EAEB] px-6 flex items-center justify-end gap-3 select-none flex-shrink-0 py-3 w-full animate-fade-in">
            {shopeeWizardStep === 1 ? (
              <button
                onClick={() => {
                  setIsQrModalOpen(false);
                  setShopeeWizardStep(1);
                }}
                className="bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-normal text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer"
                style={{ height: "32px", minWidth: "84px" }}
              >
                Hủy
              </button>
            ) : (
              <button
                onClick={() => {
                  if (shopeeWizardStep === 2) setShopeeWizardStep(1);
                  if (shopeeWizardStep === 3) setShopeeWizardStep(2);
                }}
                className="bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-normal text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer"
                style={{ height: "32px", minWidth: "84px" }}
              >
                Quay lại
              </button>
            )}

            {shopeeWizardStep < 3 ? (
              <button
                onClick={() => {
                  if (shopeeWizardStep === 1) {
                    if (qrScanStatus !== "success") return;
                    setShopeeWizardStep(2);
                  } else if (shopeeWizardStep === 2) {
                    if (step2SyncProgress < 100) return;

                    const unlinkedFoods = wizardFoods.filter(
                      (f) => !f.linkedDishId,
                    ).length;
                    const unlinkedMenuGroups = wizardMenuGroups.filter(
                      (g) => !g.linkedGroupId,
                    ).length;
                    const unlinkedStpv = wizardStpv.filter(
                      (s) => !s.linkedGroupId,
                    ).length;
                    const unlinkedStpvGroups = wizardStpvGroups.filter(
                      (sg) => !sg.linkedGroupId,
                    ).length;
                    if (unlinkedFoods > 0 || unlinkedMenuGroups > 0 || unlinkedStpv > 0 || unlinkedStpvGroups > 0) {
                      setShowUnlinkedConfirmModal(true);
                      return;
                    }

                    setShowShopeeSyncConfirmModal(true);
                  }
                }}
                disabled={
                  (shopeeWizardStep === 1 && qrScanStatus !== "success") ||
                  (shopeeWizardStep === 2 && step2SyncProgress < 100)
                }
                className={`font-normal text-[13px] rounded-[8px] flex items-center justify-center transition-all border-none ${
                  (shopeeWizardStep === 1 && qrScanStatus === "success") ||
                  (shopeeWizardStep === 2 && step2SyncProgress === 100)
                    ? "bg-[#245FDF] hover:bg-[#1B4EBA] text-white cursor-pointer"
                    : "bg-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed border border-[#D5D7DA]"
                }`}
                style={{ height: "32px", minWidth: "84px" }}
              >
                Tiếp tục
              </button>
            ) : (
              <button
                onClick={() => {
                  // Confetti fireworks animation
                  const duration = 2.5 * 1000;
                  const end = Date.now() + duration;

                  (function frame() {
                    confetti({
                      particleCount: 4,
                      angle: 60,
                      spread: 55,
                      origin: { x: 0, y: 0.8 },
                      colors: ["#245FDF", "#3B82F6", "#10B981", "#F59E0B"],
                    });
                    confetti({
                      particleCount: 4,
                      angle: 120,
                      spread: 55,
                      origin: { x: 1, y: 0.8 },
                      colors: ["#245FDF", "#3B82F6", "#10B981", "#F59E0B"],
                    });

                    if (Date.now() < end) {
                      requestAnimationFrame(frame);
                    }
                  })();

                  // Redirect/Navigate down to actual management screen first
                  setApps((prevApps) =>
                    prevApps.map((app) => {
                      if (app.id === "shopeefood")
                        return { ...app, isConnected: true };
                      return app;
                    }),
                  );
                  setIsQrModalOpen(false);
                  setShopeeSyncStarted(true);
                  setShopeeWizardStep(1);
                  setShopeeFoodTab("menu");
                  setShopeeActiveSegment("thuc-don");

                  // Now open the success popup modal
                  setIsShopeeSuccessModalOpen(true);
                }}
                className="bg-[#245FDF] hover:bg-[#1B4EBA] text-white cursor-pointer font-normal text-[13px] rounded-[8px] flex items-center justify-center transition-all border-none"
                style={{ height: "32px", minWidth: "84px" }}
              >
                Hoàn tất
              </button>
            )}
          </div>

          {/* Warning popup: showUnlinkedConfirmModal with a higher z-index (z-[10000]) than the main popup (z-[9999]) */}
          {showUnlinkedConfirmModal && (
            <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl border border-[#E9EAEB] w-full max-w-[420px] overflow-hidden animate-scale-up p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>

                <h3 className="text-[#101828] font-bold text-lg leading-6 mb-2">
                  Chưa hoàn tất liên kết thực đơn
                </h3>

                <p className="text-[#717680] text-[13px] leading-relaxed mb-6">
                  {(() => {
                    const unlinkedItems = [];
                    const countDishes = wizardFoods.filter((f) => !f.linkedDishId).length;
                    const countGroups = wizardMenuGroups.filter((g) => !g.linkedGroupId).length;
                    const countStpv = wizardStpv.filter((s) => !s.linkedGroupId).length;
                    const countStpvGroups = wizardStpvGroups.filter((sg) => !sg.linkedGroupId).length;

                    if (countDishes > 0) {
                      unlinkedItems.push(
                        <span key="dishes" className="font-semibold text-amber-600">
                          {countDishes} món ăn
                        </span>
                      );
                    }
                    if (countGroups > 0) {
                      unlinkedItems.push(
                        <span key="groups" className="font-semibold text-amber-600">
                          {countGroups} nhóm thực đơn
                        </span>
                      );
                    }
                    if (countStpv > 0) {
                      unlinkedItems.push(
                        <span key="stpv" className="font-semibold text-amber-600">
                          {countStpv} sở thích phục vụ
                        </span>
                      );
                    }
                    if (countStpvGroups > 0) {
                      unlinkedItems.push(
                        <span key="stpvGroups" className="font-semibold text-amber-600">
                          {countStpvGroups} nhóm STPV
                        </span>
                      );
                    }

                    if (unlinkedItems.length === 0) {
                      return "Mọi danh mục thực đơn đã được liên kết hoàn toàn với MISA CukCuk.";
                    }

                    return (
                      <>
                        Hiện vẫn còn{" "}
                        {unlinkedItems.map((item, index) => {
                          if (index === 0) return item;
                          if (index === unlinkedItems.length - 1) {
                            return (
                              <span key={`and-${index}`}>
                                {" và "}
                                {item}
                              </span>
                            );
                          }
                          return (
                            <span key={`comma-${index}`}>
                              {", "}
                              {item}
                            </span>
                          );
                        })}
                        {" chưa được liên kết với MISA CukCuk. Bạn có chắc chắn muốn tiếp tục?"}
                      </>
                    );
                  })()}
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowUnlinkedConfirmModal(false)}
                    className="flex-1 py-2 bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-semibold text-[13px] rounded-lg transition-all cursor-pointer h-9 flex items-center justify-center"
                  >
                    Quay lại liên kết
                  </button>
                  <button
                    onClick={() => {
                      setShowUnlinkedConfirmModal(false);
                      setShowShopeeSyncConfirmModal(true);
                    }}
                    className="flex-1 py-2 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-semibold text-[13px] rounded-lg transition-all cursor-pointer h-9 flex items-center justify-center border-none"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ShopeeFood Menu Sync Confirmation Modal: showShopeeSyncConfirmModal with high z-index (z-[10000]) */}
          {showShopeeSyncConfirmModal && (
            <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl border border-[#E9EAEB] w-full max-w-[420px] overflow-hidden animate-scale-up p-6 flex flex-col items-center text-center relative animate-fade-in">
                {/* Close Button X */}
                <button
                  onClick={() => setShowShopeeSyncConfirmModal(false)}
                  className="absolute top-4 right-4 text-[#717680] hover:text-[#101828] p-1.5 hover:bg-[#F0F6FE] rounded-lg transition-all cursor-pointer border-none bg-transparent flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-12 h-12 rounded-full bg-[#F0F6FE] flex items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6 text-[#245FDF]" />
                </div>

                <h3 className="text-[#101828] font-bold text-lg leading-6 mb-2 font-sans">
                  Đồng bộ thực đơn lên ShopeeFood
                </h3>

                <p className="text-[#717680] text-[13px] leading-relaxed mb-6 font-sans">
                  Bạn có muốn đồng bộ thực đơn lên ShopeeFood luôn không?
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      setShowShopeeSyncConfirmModal(false);
                      setShopeeWizardStep(3);
                    }}
                    className="flex-1 py-2 bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-semibold text-[13px] rounded-lg transition-all cursor-pointer h-9 flex items-center justify-center"
                  >
                    Để sau
                  </button>
                  <button
                    onClick={() => {
                      setShowShopeeSyncConfirmModal(false);
                      onNotification(
                        "Đang tải dữ liệu thực đơn lên ShopeeFood...",
                        "success"
                      );
                      setShopeeWizardStep(3);
                    }}
                    className="flex-1 py-2 bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-semibold text-[13px] rounded-lg transition-all cursor-pointer h-9 flex items-center justify-center border-none"
                  >
                    Đồng bộ ngay
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 💠 CHỌN MÓN POPUP MODAL */}
          {isChooseDishModalOpen && (
            <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4 animate-fade-in">
              <div
                className="bg-white flex flex-col w-full max-w-[960px] max-h-[85vh] shadow-2xl relative animate-scale-up select-none overflow-hidden"
                style={{ borderRadius: "12px" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Modal - White Background, Black Title */}
                <div
                  className="flex items-center justify-between px-6 bg-white border-b border-[#E9EAEB] text-[#101828] flex-shrink-0"
                  style={{ height: "48px" }}
                >
                  <h3 className="text-[#101828] font-semibold text-[16px] font-sans">
                    Chọn món
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsChooseDishModalOpen(false)}
                    className="text-[#717680] hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent outline-none flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Instruction Banner */}
                <div className="bg-[#F5F8FF] border-b border-[#E0E8F9] px-6 py-2.5 flex items-start gap-2.5 text-xs text-[#101828] font-sans flex-shrink-0">
                  <Info className="w-4 h-4 text-[#245FDF] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[#245FDF]">Hướng dẫn:</span> Tích chọn các món ăn từ danh sách món của MISA CukCuk dưới đây để đồng bộ và thêm trực tiếp vào danh sách Thực đơn ShopeeFood của nhà hàng.
                  </div>
                </div>

                {/* Filter and Top Controls Row */}
                <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-b border-[#E9EAEB] bg-white flex-shrink-0">
                  {/* Loại món */}
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#717680] font-sans whitespace-nowrap">
                      Loại món
                    </span>
                    <div className="relative">
                      <select
                        value={chooseDishLoaiMon}
                        onChange={(e) => setChooseDishLoaiMon(e.target.value)}
                        className="h-[32px] pl-3 pr-8 text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all text-[#101828] font-sans cursor-pointer appearance-none min-w-[150px]"
                      >
                        <option value="Tất cả loại món">Tất cả loại món</option>
                        <option value="Món ăn">Món ăn</option>
                        <option value="Đồ uống">Đồ uống</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Nhóm thực đơn */}
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#717680] font-sans whitespace-nowrap">
                      Nhóm thực đơn
                    </span>
                    <div className="relative">
                      <select
                        value={chooseDishNhomThucDon}
                        onChange={(e) =>
                          setChooseDishNhomThucDon(e.target.value)
                        }
                        className="h-[32px] pl-3 pr-8 text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all text-[#101828] font-sans cursor-pointer appearance-none min-w-[180px]"
                      >
                        <option value="Chọn nhóm thực đơn">
                          Chọn nhóm thực đơn
                        </option>
                        <option value="Món chính">Món chính</option>
                        <option value="Món ăn nhẹ">Món ăn nhẹ</option>
                        <option value="Đồ uống lạnh">Đồ uống lạnh</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Search */}
                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Nhập mã món, tên món"
                      value={chooseDishTopSearch}
                      onChange={(e) => setChooseDishTopSearch(e.target.value)}
                      className="w-full px-3 h-[32px] text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all placeholder:text-[#A4A7AE] text-[#101828] font-sans"
                    />
                  </div>

                  {/* Lấy dữ liệu button */}
                  <button
                    type="button"
                    onClick={() => {
                      onNotification(
                        "Đã cập nhật dữ liệu danh sách món ăn từ MISA CukCuk!",
                        "success",
                      );
                    }}
                    className="bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-medium text-[13px] px-4 rounded-[8px] flex items-center justify-center gap-1.5 transition-all h-[32px] cursor-pointer border-none shadow-sm font-sans flex-shrink-0"
                    style={{ minWidth: "84px" }}
                  >
                    <Search className="w-4 h-4" />
                    <span>Lấy dữ liệu</span>
                  </button>
                </div>

                {/* Table Area (Scrollable body) */}
                <div className="flex-1 overflow-auto min-h-[300px] bg-white">
                  <table className="w-full border-collapse text-left text-[13px] table-fixed">
                    <thead className="sticky top-0 bg-[#F7F7F8] z-10">
                      {/* First Header Row: Column Titles */}
                      <tr className="border-b border-[#E9EAEB]">
                        {/* Checkbox */}
                        <th className="p-2 w-[40px] text-center border-r border-[#E9EAEB]">
                          <div className="flex items-center justify-center h-full">
                            <input
                              type="checkbox"
                              checked={isAllModalSelected}
                              onChange={toggleSelectAllModal}
                              className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                            />
                          </div>
                        </th>

                        {/* Mã món */}
                        <th className="p-2 w-[120px] text-center text-[#101828] font-bold border-r border-[#E9EAEB]">
                          <div className="flex items-center justify-center h-full">
                            <span>Mã món</span>
                          </div>
                        </th>

                        {/* Tên món */}
                        <th className="p-2 min-w-[200px] text-center text-[#101828] font-bold border-r border-[#E9EAEB]">
                          <div className="flex items-center justify-center h-full">
                            <span>Tên món</span>
                          </div>
                        </th>

                        {/* Nhóm thực đơn */}
                        <th className="p-2 w-[180px] text-center text-[#101828] font-bold border-r border-[#E9EAEB]">
                          <div className="flex items-center justify-center h-full">
                            <span>Nhóm thực đơn</span>
                          </div>
                        </th>

                        {/* Đơn vị tính */}
                        <th className="p-2 w-[110px] text-center text-[#101828] font-bold border-r border-[#E9EAEB]">
                          <div className="flex items-center justify-center h-full">
                            <span>Đơn vị tính</span>
                          </div>
                        </th>

                        {/* Giá bán */}
                        <th className="p-2 w-[130px] text-center text-[#101828] font-bold">
                          <div className="flex items-center justify-center h-full">
                            <span>Giá bán</span>
                          </div>
                        </th>
                      </tr>

                      {/* Second Header Row: Column Filters */}
                      <tr className="border-b border-[#E9EAEB]">
                        {/* Checkbox cell */}
                        <th className="p-1 border-r border-[#E9EAEB]"></th>

                        {/* Mã món Filter */}
                        <th className="p-1.5 border-r border-[#E9EAEB]">
                          <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                            <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                              *
                            </div>
                            <input
                              type="text"
                              value={chooseDishFilterCode}
                              onChange={(e) =>
                                setChooseDishFilterCode(e.target.value)
                              }
                              className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                            />
                          </div>
                        </th>

                        {/* Tên món Filter */}
                        <th className="p-1.5 border-r border-[#E9EAEB]">
                          <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                            <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                              *
                            </div>
                            <input
                              type="text"
                              value={chooseDishFilterName}
                              onChange={(e) =>
                                setChooseDishFilterName(e.target.value)
                              }
                              className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                            />
                          </div>
                        </th>

                        {/* Nhóm thực đơn Filter */}
                        <th className="p-1.5 border-r border-[#E9EAEB]">
                          <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                            <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                              *
                            </div>
                            <input
                              type="text"
                              value={chooseDishFilterCategory}
                              onChange={(e) =>
                                setChooseDishFilterCategory(e.target.value)
                              }
                              className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                            />
                          </div>
                        </th>

                        {/* Đơn vị tính Filter */}
                        <th className="p-1.5 border-r border-[#E9EAEB]">
                          <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                            <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                              *
                            </div>
                            <input
                              type="text"
                              value={chooseDishFilterUnit}
                              onChange={(e) =>
                                setChooseDishFilterUnit(e.target.value)
                              }
                              className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                            />
                          </div>
                        </th>

                        {/* Giá bán Filter */}
                        <th className="p-1.5">
                          <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                            <div className="px-1.5 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                              ≤
                            </div>
                            <input
                              type="text"
                              value={chooseDishFilterPrice}
                              onChange={(e) => {
                                const raw = e.target.value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                setChooseDishFilterPrice(raw);
                              }}
                              className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828] text-right"
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredModalDishes.length > 0 ? (
                        filteredModalDishes.map((item) => {
                          const isSelected = chooseDishSelectedIds.includes(
                            item.id,
                          );
                          return (
                            <tr
                              key={item.id}
                              onClick={() => toggleSelectRowModal(item.id)}
                              className={`border-b border-[#E9EAEB] hover:bg-gray-50 cursor-pointer h-[40px] transition-colors ${
                                isSelected
                                  ? "bg-[#F0F6FE]/70 hover:bg-[#F0F6FE]"
                                  : ""
                              }`}
                            >
                              {/* Checkbox */}
                              <td
                                className="p-2 border-r border-[#E9EAEB] text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectRowModal(item.id)}
                                  className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                                />
                              </td>

                              {/* Mã món */}
                              <td className="p-2 border-r border-[#E9EAEB] text-[#101828] text-left font-mono">
                                {item.code}
                              </td>

                              {/* Tên món */}
                              <td className="p-2 border-r border-[#E9EAEB] text-[#101828] text-left font-medium">
                                {item.name}
                              </td>

                              {/* Nhóm thực đơn */}
                              <td className="p-2 border-r border-[#E9EAEB] text-[#101828] text-left">
                                {item.category}
                              </td>

                              {/* Đơn vị tính */}
                              <td className="p-2 border-r border-[#E9EAEB] text-[#101828] text-left">
                                {item.unit}
                              </td>

                              {/* Giá bán */}
                              <td className="p-2 text-[#101828] text-right font-semibold">
                                {item.price.toLocaleString("vi-VN")}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-16">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <svg
                                className="w-16 h-16 text-gray-300 mb-2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                              </svg>
                              <span className="text-[14px] text-gray-400 font-medium">
                                Không có dữ liệu
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Row in Modal */}
                <div className="h-[44px] bg-[#F7F7F8] border-t border-[#E9EAEB] flex items-center justify-between px-6 flex-shrink-0 select-none text-[12px] text-[#717680]">
                  {/* Left Controls: first, prev, input, next, last, refresh, size */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled
                      className="p-1 text-[#A4A7AE] cursor-not-allowed hover:bg-gray-200 rounded"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled
                      className="p-1 text-[#A4A7AE] cursor-not-allowed hover:bg-gray-200 rounded"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="flex items-center gap-1 font-sans">
                      Trang
                      <input
                        type="text"
                        value="1"
                        readOnly
                        className="w-8 h-5 text-center border border-[#D5D7DA] rounded bg-white text-[#101828] font-semibold outline-none font-sans"
                      />
                      trên 1
                    </span>
                    <button
                      type="button"
                      disabled
                      className="p-1 text-[#A4A7AE] cursor-not-allowed hover:bg-gray-200 rounded"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled
                      className="p-1 text-[#A4A7AE] cursor-not-allowed hover:bg-gray-200 rounded"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChooseDishFilterCode("");
                        setChooseDishFilterName("");
                        setChooseDishFilterCategory("");
                        setChooseDishFilterUnit("");
                        setChooseDishFilterPrice("");
                        setChooseDishTopSearch("");
                        setChooseDishLoaiMon("Tất cả loại món");
                        setChooseDishNhomThucDon("Chọn nhóm thực đơn");
                        onNotification("Đã tải lại danh sách món ăn", "info");
                      }}
                      className="p-1 text-[#717680] hover:text-[#101828] hover:bg-gray-200 rounded cursor-pointer"
                      title="Tải lại"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative">
                      <div className="flex items-center border border-[#D5D7DA] bg-white rounded px-2 py-0.5 h-6 select-none font-semibold text-[#101828] gap-1 font-sans">
                        <span>100</span>
                        <ChevronDown className="w-3 h-3 text-[#717680]" />
                      </div>
                    </div>
                  </div>

                  {/* Right Status */}
                  <div className="font-sans">
                    Hiển thị 1 - {filteredModalDishes.length} trên{" "}
                    {filteredModalDishes.length} kết quả
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="h-[56px] bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 flex items-center justify-end gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsChooseDishModalOpen(false)}
                    className="h-[32px] min-w-[84px] px-4 bg-white border border-[#D5D7DA] hover:bg-gray-50 text-[#101828] font-normal text-[13px] rounded-[8px] transition-colors cursor-pointer flex items-center justify-center font-sans"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const selectedDishes = chooseDishAvailableItems.filter(
                        (item) => chooseDishSelectedIds.includes(item.id),
                      );
                      if (selectedDishes.length === 0) {
                        onNotification(
                          "Vui lòng chọn ít nhất 1 món ăn để đồng ý!",
                          "info",
                        );
                        return;
                      }

                      // Add them to wizardCukCukDishes if not already present
                      setWizardCukCukDishes((prev) => {
                        const updated = [...prev];
                        selectedDishes.forEach((dish) => {
                          const targetId = `cc_added_${dish.id}`;
                          if (!updated.some((cc) => cc.id === targetId)) {
                            updated.push({
                              id: targetId,
                              name: dish.name,
                              code: dish.code,
                            });
                          }
                        });
                        return updated;
                      });

                      // Append to wizardFoods (for Step 2 display)
                      const newWizardFoods = selectedDishes.map(
                        (dish, index) => ({
                          id: `wizard_added_${dish.id}_${Date.now()}`,
                          name: dish.name,
                          category: dish.category,
                          unit: dish.unit,
                          price: dish.price,
                          status: "Có bán",
                          fromCukCuk: true, // Mark as coming from CukCuk
                          linkedDishId: `cc_added_${dish.id}`, // Linked to itself!
                          image: undefined, // default placeholder
                        }),
                      );

                      // Append to shopeeMenuItems (for outer page)
                      const nextOuterId = Math.max(
                        ...shopeeMenuItems.map((i) => i.id),
                        100,
                      );
                      const newOuterFoods = selectedDishes.map(
                        (dish, index) => ({
                          id: nextOuterId + index + 1,
                          name: dish.name,
                          category: dish.category,
                          unit: dish.unit,
                          price: dish.price,
                          status: "Có bán",
                          isLinked: true, // It is already linked
                          image: undefined,
                        }),
                      );

                      setWizardFoods((prev) => [...prev, ...newWizardFoods]);
                      setShopeeMenuItems((prev) => [...prev, ...newOuterFoods]);

                      setIsChooseDishModalOpen(false);
                      onNotification(
                        `Đã chọn và đồng bộ thêm ${selectedDishes.length} món ăn mới thành công!`,
                        "success",
                      );
                    }}
                    className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] border-none text-white font-normal text-[13px] rounded-[8px] transition-colors cursor-pointer flex items-center justify-center shadow-sm font-sans"
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 💠 QUICK SETUP (CÀI ĐẶT NHANH) POPUP MODAL */}
          {isQuickSetupOpen && (
            <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 animate-fade-in">
              <div
                className="bg-white flex flex-col w-full max-w-[580px] shadow-2xl relative animate-scale-up select-none overflow-hidden"
                style={{ borderRadius: "12px" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Modal */}
                <div
                  className="flex items-center justify-between px-6 border-b border-[#E9EAEB]"
                  style={{ height: "62px" }}
                >
                  <h3 className="text-[#101828] font-bold text-[16px] font-sans">
                    Cài đặt nhanh
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsQuickSetupOpen(false)}
                    className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Form */}
                <div className="p-6 space-y-4">
                  <p className="text-[#717680] text-[13px] font-sans">
                    Áp dụng các cài đặt này cho tất cả các ngày
                  </p>

                  <div className="space-y-3">
                    {quickSetupRanges.map((range, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {/* Dropdown Mở cửa/Đóng cửa */}
                        {idx === 0 ? (
                          <select
                            value={quickSetupStatus}
                            onChange={(e) => setQuickSetupStatus(e.target.value as "open" | "closed")}
                            className="h-[32px] w-[100px] px-2.5 border border-[#D5D7DA] rounded-[8px] text-[#101828] text-[13px] font-medium focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 outline-none bg-white cursor-pointer font-sans"
                          >
                            <option value="open">Mở cửa</option>
                            <option value="closed">Đóng cửa</option>
                          </select>
                        ) : (
                          <div className="w-[100px]" />
                        )}

                        <div className={`flex items-center gap-3 transition-opacity ${quickSetupStatus === "open" ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                          {/* From Time Input with icon */}
                          <div className="relative w-32">
                            <input
                              type="text"
                              value={range.from}
                              onChange={(e) => {
                                const val = e.target.value;
                                setQuickSetupRanges((prev) =>
                                  prev.map((r, i) =>
                                    i === idx ? { ...r, from: val } : r,
                                  ),
                                );
                              }}
                              className="w-full h-[32px] pl-3 pr-8 text-[13px] border border-[#D5D7DA] rounded-[8px] text-[#101828] font-medium focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 outline-none bg-white text-left font-sans"
                              placeholder="00:00"
                            />
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717680]">
                              <Clock className="w-4 h-4" />
                            </div>
                          </div>

                          <span className="text-[#717680] text-[13px] font-sans">
                            Đến
                          </span>

                          {/* To Time Input with icon */}
                          <div className="relative w-32">
                            <input
                              type="text"
                              value={range.to}
                              onChange={(e) => {
                                const val = e.target.value;
                                setQuickSetupRanges((prev) =>
                                  prev.map((r, i) =>
                                    i === idx ? { ...r, to: val } : r,
                                  ),
                                );
                              }}
                              className="w-full h-[32px] pl-3 pr-8 text-[13px] border border-[#D5D7DA] rounded-[8px] text-[#101828] font-medium focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 outline-none bg-white text-left font-sans"
                              placeholder="23:59"
                            />
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717680]">
                              <Clock className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Plus button / Trash button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (quickSetupRanges.length >= 3) {
                                onNotification(
                                  "Tối đa 3 khung giờ hoạt động!",
                                  "info",
                                );
                                return;
                              }
                              setQuickSetupRanges([
                                ...quickSetupRanges,
                                { from: "08:00", to: "22:00" },
                              ]);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#EDFCF4] transition-colors cursor-pointer border-none bg-transparent"
                            title="Thêm khung giờ"
                          >
                            <Plus className="w-5 h-5 text-[#12B76A]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (quickSetupRanges.length === 1) {
                                onNotification(
                                  "Cần ít nhất 1 khung giờ hoạt động!",
                                  "info",
                                );
                                return;
                              }
                              setQuickSetupRanges(
                                quickSetupRanges.filter((_, i) => i !== idx),
                              );
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-[#717680] hover:text-[#F04438] transition-colors cursor-pointer border-none bg-transparent"
                            title="Xóa khung giờ"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Modal */}
                <div
                  className="flex items-center justify-end px-6 border-t border-[#E9EAEB] bg-[#FAFAFA]"
                  style={{ height: "56px" }}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsQuickSetupOpen(false)}
                      className="px-4 py-1.5 border border-[#D5D7DA] text-[#101828] hover:bg-gray-100 rounded-[8px] text-[13px] font-semibold transition-all cursor-pointer bg-white font-sans"
                      style={{ height: "32px", minWidth: "84px" }}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShopeeOperatingDays((prev) =>
                          prev.map((d) => ({
                            ...d,
                            active: quickSetupStatus === "open",
                            ranges: [...quickSetupRanges],
                          })),
                        );
                        setIsQuickSetupOpen(false);
                        onNotification(
                          "Đã thiết lập nhanh thời gian hoạt động thành công cho tất cả các ngày!",
                          "success",
                        );
                      }}
                      className="px-4 py-1.5 bg-[#245FDF] hover:bg-[#1B4EBA] text-white rounded-[8px] text-[13px] font-semibold transition-all cursor-pointer border-none font-sans"
                      style={{ height: "32px", minWidth: "84px" }}
                    >
                      Lưu lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Filtered menu items using both toolbar query and column inputs
    const filteredMenuItems = shopeeMenuItems.filter((item) => {
      // Top-bar search query
      if (
        shopeeSearchQuery &&
        !item.name.toLowerCase().includes(shopeeSearchQuery.toLowerCase())
      ) {
        return false;
      }
      // Column Tên món filter (if not *)
      if (
        gridFilterName &&
        gridFilterName !== "*" &&
        !item.name.toLowerCase().includes(gridFilterName.toLowerCase())
      ) {
        return false;
      }
      // Column Nhóm thực đơn filter (if not *)
      if (
        gridFilterCategory &&
        gridFilterCategory !== "*" &&
        !item.category.toLowerCase().includes(gridFilterCategory.toLowerCase())
      ) {
        return false;
      }
      // Column Đơn vị tính filter
      if (
        gridFilterUnit &&
        !item.unit.toLowerCase().includes(gridFilterUnit.toLowerCase())
      ) {
        return false;
      }
      // Column Giá bán filter (<= condition)
      if (gridFilterPrice) {
        const val = parseFloat(
          gridFilterPrice.replace(/\./g, "").replace(/,/g, ""),
        );
        if (!isNaN(val) && item.price > val) {
          return false;
        }
      }
      // Column Trạng thái filter
      if (gridFilterStatus && item.status !== gridFilterStatus) {
        return false;
      }
      // Column Trạng thái liên kết filter
      if (gridFilterLinkStatus) {
        if (gridFilterLinkStatus === "linked" && !item.isLinked) return false;
        if (gridFilterLinkStatus === "unlinked" && item.isLinked) return false;
      }
      return true;
    });

    return (
      <div className="flex flex-col h-full animate-fade-in select-none">
        {/* 1️⃣ Page Header */}
        <div className="flex items-center justify-between py-3 px-6 bg-white border-b border-[#E9EAEB] select-none flex-shrink-0 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShopeeFoodScreenActive(false)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F0FCF4] transition-colors cursor-pointer text-[#717680] hover:text-[#245FDF] bg-transparent border-none"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[#101828] font-semibold text-xl">
              Kết nối ShopeeFood
            </h2>
            {isConnected && shopeeSyncStarted && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0FA958]"></span>
                Đã kết nối
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isConnected && shopeeSyncStarted && (
              <>
                <button
                  onClick={() =>
                    onNotification(
                      "Đang tải dữ liệu thực đơn lên ShopeeFood...",
                      "success",
                    )
                  }
                  className="bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-medium text-[13px] px-4 rounded-[8px] flex items-center justify-center transition-all h-8 cursor-pointer border-none"
                  style={{ minWidth: "84px" }}
                >
                  Đồng bộ lên ShopeeFood
                </button>
                <button
                  onClick={() => {
                    if (!isSuspended) {
                      setShowSuspendConfirmModal(true);
                    } else {
                      setIsSuspended(false);
                      onNotification(
                        "Đã mở nhận đơn trở lại trên ShopeeFood thành công!",
                        "success"
                      );
                    }
                  }}
                  className={`font-medium text-[13px] px-4 rounded-[8px] flex items-center justify-center transition-all h-8 cursor-pointer border ${
                    isSuspended
                      ? "bg-white text-[#245FDF] border-[#245FDF] hover:bg-[#F0F6FE]"
                      : "bg-white text-[#101828] border-[#D5D7DA] hover:bg-gray-50"
                  }`}
                  style={{ minWidth: "84px" }}
                >
                  {isSuspended ? "Tiếp tục nhận đơn" : "Tạm ngừng nhận đơn"}
                </button>
              </>
            )}
            <button
              onClick={() => {
                setIsFeedbackOpen(true);
              }}
              className="bg-white text-[#101828] border border-[#D5D7DA] hover:bg-gray-50 font-medium text-[13px] px-4 rounded-[8px] flex items-center justify-center transition-all h-8 cursor-pointer"
              style={{ minWidth: "84px" }}
            >
              Phản hồi
            </button>

            {isConnected && shopeeSyncStarted && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMoreMenuOpen(!isMoreMenuOpen);
                  }}
                  className="bg-white text-[#717680] hover:text-[#245FDF] border border-[#D5D7DA] hover:bg-gray-50 rounded-[8px] flex items-center justify-center transition-all h-8 w-8 cursor-pointer"
                  title="Tính năng mở rộng"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {isMoreMenuOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl py-1.5 z-50 border border-gray-100"
                    style={{
                      boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.10)",
                    }}
                  >
                    <button
                      onClick={() => {
                        setApps((prevApps) =>
                          prevApps.map((app) => {
                            if (app.id === "shopeefood")
                              return { ...app, isConnected: false };
                            return app;
                          }),
                        );
                        setShopeeSyncStarted(false);
                        setIsMoreMenuOpen(false);
                        onNotification(
                          "Đã ngắt kết nối với ShopeeFood!",
                          "info",
                        );
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-rose-50 text-rose-600 font-semibold transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                    >
                      <X className="w-4 h-4 text-rose-500" />
                      Ngắt kết nối
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {isConnected && shopeeSyncStarted ? (
          /* Connected view with 2 tabs: "Thực đơn" and "Thiết lập" */
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F0F2F4]">
            {/* 💠 Tabs Header */}
            <div className="h-12 bg-white px-6 border-b border-[#E9EAEB] flex items-center flex-shrink-0 justify-between">
              <div className="flex gap-8 h-full">
                <button
                  onClick={() => setShopeeFoodTab("menu")}
                  className={`relative h-full flex items-center text-[13px] font-semibold transition-colors cursor-pointer px-1 ${
                    shopeeFoodTab === "menu"
                      ? "text-[#245FDF]"
                      : "text-[#717680] hover:text-[#245FDF]"
                  }`}
                >
                  Quản lý thực đơn
                  {shopeeFoodTab === "menu" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#245FDF] rounded-t-full" />
                  )}
                </button>
                <button
                  onClick={() => setShopeeFoodTab("settings")}
                  className={`relative h-full flex items-center text-[13px] font-semibold transition-colors cursor-pointer px-1 ${
                    shopeeFoodTab === "settings"
                      ? "text-[#245FDF]"
                      : "text-[#717680] hover:text-[#245FDF]"
                  }`}
                >
                  Thiết lập
                  {shopeeFoodTab === "settings" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#245FDF] rounded-t-full" />
                  )}
                </button>
              </div>

              {/* Quick status banner inside tab bar */}
              <div className="text-[13px] text-[#717680] font-sans hidden md:block">
                Merchant ID:{" "}
                <span className="text-[#101828] font-medium font-sans">
                  SPF-98232-CUK
                </span>
              </div>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              {shopeeFoodTab === "menu" ? (
                <div className="flex flex-col flex-1 overflow-hidden">
                  {/* 💠 Segments for menu tabs */}
                  <div className="flex items-center bg-gray-100/80 p-1 rounded-xl mb-3 w-fit select-none">
                    <button
                      type="button"
                      onClick={() => setShopeeActiveSegment("thuc-don")}
                      className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 cursor-pointer border-none ${
                        shopeeActiveSegment === "thuc-don"
                          ? "bg-white text-[#245FDF]"
                          : "text-[#717680] hover:text-[#245FDF] hover:bg-[#EDFCF4] bg-transparent"
                      }`}
                      style={
                        shopeeActiveSegment === "thuc-don"
                          ? { boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.10)" }
                          : undefined
                      }
                    >
                      Thực đơn
                    </button>
                    <button
                      type="button"
                      onClick={() => setShopeeActiveSegment("nhom-thuc-don")}
                      className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 cursor-pointer border-none ${
                        shopeeActiveSegment === "nhom-thuc-don"
                          ? "bg-white text-[#245FDF]"
                          : "text-[#717680] hover:text-[#245FDF] hover:bg-[#EDFCF4] bg-transparent"
                      }`}
                      style={
                        shopeeActiveSegment === "nhom-thuc-don"
                          ? { boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.10)" }
                          : undefined
                      }
                    >
                      Nhóm thực đơn
                    </button>
                    <button
                      type="button"
                      onClick={() => setShopeeActiveSegment("so-thich-phuc-vu")}
                      className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 cursor-pointer border-none ${
                        shopeeActiveSegment === "so-thich-phuc-vu"
                          ? "bg-white text-[#245FDF]"
                          : "text-[#717680] hover:text-[#245FDF] hover:bg-[#EDFCF4] bg-transparent"
                      }`}
                      style={
                        shopeeActiveSegment === "so-thich-phuc-vu"
                          ? { boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.10)" }
                          : undefined
                      }
                    >
                      Sở thích phục vụ
                    </button>
                    <button
                      type="button"
                      onClick={() => setShopeeActiveSegment("so-thich")}
                      className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 cursor-pointer border-none ${
                        shopeeActiveSegment === "so-thich"
                          ? "bg-white text-[#245FDF]"
                          : "text-[#717680] hover:text-[#245FDF] hover:bg-[#EDFCF4] bg-transparent"
                      }`}
                      style={
                        shopeeActiveSegment === "so-thich"
                          ? { boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.10)" }
                          : undefined
                      }
                    >
                      Nhóm STPV
                    </button>
                    <button
                      type="button"
                      onClick={() => setShopeeActiveSegment("lich-ban")}
                      className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 cursor-pointer border-none ${
                        shopeeActiveSegment === "lich-ban"
                          ? "bg-white text-[#245FDF]"
                          : "text-[#717680] hover:text-[#245FDF] hover:bg-[#EDFCF4] bg-transparent"
                      }`}
                      style={
                        shopeeActiveSegment === "lich-ban"
                          ? { boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.10)" }
                          : undefined
                      }
                    >
                      Lịch bán món
                    </button>
                  </div>

                  {shopeeActiveSegment === "thuc-don" ? (
                    /* Tab 1: Thực đơn (DataTable style) */
                    <div
                      className="bg-white rounded-xl shadow-sm border border-[#E9EAEB] flex flex-col flex-1 overflow-hidden"
                      style={{ boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)" }}
                    >
                      {/* DataTable Toolbar (Thanh tìm kiếm & bộ lọc) */}
                      <div className="h-[56px] px-4 py-3 flex items-center border-b border-[#E9EAEB] flex-shrink-0 gap-2 overflow-x-auto">
                        {/* Search box with glass icon on left */}
                        <div className="relative w-48 flex-shrink-0">
                          <svg
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <input
                            type="text"
                            value={shopeeSearchQuery}
                            onChange={(e) =>
                              setShopeeSearchQuery(e.target.value)
                            }
                            placeholder="Tìm theo tên món"
                            className="w-full pl-8 pr-2.5 h-[32px] text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all placeholder:text-[#A4A7AE] text-[#101828]"
                          />
                        </div>

                        {/* Action buttons list */}
                        <button
                          onClick={() => {
                            setIsChooseDishModalOpen(true);
                            setChooseDishSelectedIds([]);
                          }}
                          className="bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-medium text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer border-none shadow-sm flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Chọn món
                        </button>

                        <button
                          type="button"
                          onClick={openQuickLink}
                          className="bg-white hover:bg-[#EDFCF4] text-[#245FDF] border border-[#245FDF]/30 font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Liên kết nhanh
                        </button>

                        <button
                          onClick={() => {
                            const selectedShopeeItem = shopeeMenuItems.find(
                              (i) => i.id === selectedShopeeRowId,
                            );
                            if (selectedShopeeItem) {
                              setShopeeEditItem({ ...selectedShopeeItem });
                              setActiveEditTab("general");
                              setSelectedPreferenceId(null);
                              // Initialize with some default preferences or existing ones
                              const initialPrefs = selectedShopeeItem.preferences || [
                                { id: "pref_1", name: "S", price: 0 },
                                { id: "pref_2", name: "nhóm 1", price: 0, isHeader: true },
                                { id: "pref_3", name: "ca lang", price: 20000 },
                                { id: "pref_4", name: "Cay", price: 0 },
                                { id: "pref_5", name: "Them suon", price: 10000 },
                              ];
                              setEditingPreferences([...initialPrefs]);
                              setIsShopeeEditOpen(true);
                            } else {
                              onNotification(
                                "Vui lòng chọn 1 món để sửa",
                                "info",
                              );
                            }
                          }}
                          className="bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-medium text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => {
                            const selectedShopeeItem = shopeeMenuItems.find(
                              (i) => i.id === selectedShopeeRowId,
                            );
                            if (selectedShopeeItem) {
                              setShopeeMenuItems((prev) =>
                                prev.filter(
                                  (i) => i.id !== selectedShopeeRowId,
                                ),
                              );
                              setSelectedShopeeRowId(null);
                              onNotification(
                                `Đã xóa món "${selectedShopeeItem.name}" khỏi thực đơn ShopeeFood`,
                                "success",
                              );
                            } else {
                              onNotification(
                                "Vui lòng chọn món để xóa",
                                "info",
                              );
                            }
                          }}
                          className="bg-white hover:bg-red-50 text-[#D92D20] border border-red-200 font-medium text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Xóa
                        </button>

                        <button
                          onClick={() =>
                            onNotification(
                              "Tính năng Nhập khẩu thực đơn",
                              "info",
                            )
                          }
                          className="bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-medium text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Nhập khẩu
                        </button>

                        <button
                          onClick={() =>
                            onNotification(
                              "Tính năng Xuất khẩu thực đơn",
                              "info",
                            )
                          }
                          className="bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-medium text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Xuất khẩu
                        </button>

                        <button
                          onClick={() => {
                            const selectedShopeeItem = shopeeMenuItems.find(
                              (i) => i.id === selectedShopeeRowId,
                            );
                            if (selectedShopeeItem) {
                              const foodImages = [
                                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&auto=format&fit=crop&q=60", // Pizza
                                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&auto=format&fit=crop&q=60", // Pizza 2
                                "https://images.unsplash.com/photo-1544025162-d76694265947?w=100&auto=format&fit=crop&q=60", // Ribs
                                "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=100&auto=format&fit=crop&q=60", // Toast
                                "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=100&auto=format&fit=crop&q=60", // Cake
                              ];
                              const randomImg =
                                foodImages[
                                  Math.floor(Math.random() * foodImages.length)
                                ];
                              setShopeeMenuItems((prev) =>
                                prev.map((i) =>
                                  i.id === selectedShopeeRowId
                                    ? { ...i, image: randomImg }
                                    : i,
                                ),
                              );
                              onNotification(
                                `Đã cập nhật ảnh cho món "${selectedShopeeItem.name}" thành công`,
                                "success",
                              );
                            } else {
                              onNotification(
                                "Vui lòng chọn món để cập nhật ảnh",
                                "info",
                              );
                            }
                          }}
                          className="bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-medium text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Cập nhật ảnh
                        </button>

                        <button
                          onClick={() =>
                            onNotification(
                              "Tính năng Sắp xếp thứ tự thực đơn",
                              "info",
                            )
                          }
                          className="bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-medium text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Sắp xếp thứ tự
                        </button>

                        {/* Right side icons */}
                        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                          <button
                            onClick={() =>
                              onNotification(
                                "Đang làm mới danh sách thực đơn...",
                                "info",
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border border-[#D5D7DA] hover:bg-gray-50 text-[#717680] rounded-[8px] bg-white transition-colors cursor-pointer"
                            title="Tải lại"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              onNotification(
                                "Đang mở tài liệu hướng dẫn liên kết thực đơn",
                                "info",
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border border-[#D5D7DA] hover:bg-gray-50 text-[#717680] rounded-[8px] bg-white transition-colors cursor-pointer"
                            title="Hướng dẫn"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-help-circle"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                              <line x1="12" x2="12.01" y1="17" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* 💠 DataTable Content */}
                      <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse select-none">
                          <thead>
                            <tr className="bg-[#FAFAFA] border-y border-[#E9EAEB] select-none">
                              <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-20 align-middle">
                                <div className="flex flex-col justify-center items-center h-[76px] w-full">
                                  <span className="text-[13px] font-semibold text-[#101828] text-center w-full leading-tight font-sans">
                                    Ảnh
                                  </span>
                                </div>
                              </th>

                              <th className="px-4 py-2 border-r border-[#E9EAEB] text-center min-w-[180px] align-middle">
                                <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                  <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                    <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                      Tên món
                                    </span>
                                  </div>
                                  <div className="w-full mt-1.5 flex-shrink-0">
                                    <div className="flex items-center w-full">
                                      <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                        *
                                      </div>
                                      <input
                                        type="text"
                                        value={gridFilterName}
                                        onChange={(e) =>
                                          setGridFilterName(e.target.value)
                                        }
                                        className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </th>

                              <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-44 align-middle">
                                <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                  <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                    <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                      Nhóm thực đơn
                                    </span>
                                  </div>
                                  <div className="w-full mt-1.5 flex-shrink-0">
                                    <div className="flex items-center w-full">
                                      <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                        *
                                      </div>
                                      <input
                                        type="text"
                                        value={gridFilterCategory}
                                        onChange={(e) =>
                                          setGridFilterCategory(e.target.value)
                                        }
                                        className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </th>

                              <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-28 align-middle">
                                <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                  <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                    <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                      Đơn vị tính
                                    </span>
                                  </div>
                                  <div className="w-full mt-1.5 flex-shrink-0">
                                    <div className="flex items-center w-full">
                                      <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                        *
                                      </div>
                                      <input
                                        type="text"
                                        value={gridFilterUnit}
                                        onChange={(e) =>
                                          setGridFilterUnit(e.target.value)
                                        }
                                        className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </th>

                              <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-48 align-middle">
                                <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                  <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                    <span className="text-[13px] font-semibold text-[#101828] font-sans whitespace-nowrap">
                                      Giá bán trên ShopeeFood
                                    </span>
                                  </div>
                                  <div className="w-full mt-1.5 flex-shrink-0">
                                    <div className="flex items-center w-full">
                                      <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                        ≤
                                      </div>
                                      <input
                                        type="text"
                                        value={gridFilterPrice}
                                        onChange={(e) =>
                                          setGridFilterPrice(e.target.value)
                                        }
                                        className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </th>

                              <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-36 align-middle">
                                <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                  <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                    <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                      Trạng thái
                                    </span>
                                  </div>
                                  <div className="w-full mt-1.5 flex-shrink-0">
                                    <div className="relative w-full">
                                      <select
                                        value={gridFilterStatus}
                                        onChange={(e) =>
                                          setGridFilterStatus(e.target.value)
                                        }
                                        className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans appearance-none pr-6"
                                      >
                                        <option value=""></option>
                                        <option value="Có bán">Có bán</option>
                                        <option value="Ngừng bán">
                                          Ngừng bán
                                        </option>
                                      </select>
                                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                        <svg
                                          className="w-3.5 h-3.5"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M19 9l-7 7-7-7"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </th>

                              <th className="px-4 py-2 text-center w-44 align-middle">
                                <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                  <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                    <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                      Trạng thái liên kết
                                    </span>
                                  </div>
                                  <div className="w-full mt-1.5 flex-shrink-0">
                                    <div className="relative w-full">
                                      <select
                                        value={gridFilterLinkStatus}
                                        onChange={(e) =>
                                          setGridFilterLinkStatus(
                                            e.target.value,
                                          )
                                        }
                                        className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans appearance-none pr-6"
                                      >
                                        <option value=""></option>
                                        <option value="linked">
                                          Đã liên kết
                                        </option>
                                        <option value="unlinked">
                                          Chưa liên kết
                                        </option>
                                      </select>
                                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                        <svg
                                          className="w-3.5 h-3.5"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M19 9l-7 7-7-7"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </th>

                              <th className="px-4 py-2 text-center w-28 align-middle">
                                <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                  <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                    <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                      Liên kết
                                    </span>
                                  </div>
                                  <div className="w-full mt-1.5 flex-shrink-0 h-7 flex items-center justify-center text-[11px] text-[#717680] font-normal">
                                    <select
                                      disabled
                                      className="w-full h-7 px-2 text-[12px] border border-[#E9EAEB] rounded-[4px] bg-[#F7F7F8] text-[#717680] outline-none font-sans appearance-none"
                                    >
                                      <option value="">Lọc</option>
                                    </select>
                                  </div>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredMenuItems.map((item) => {
                              const isSelected =
                                selectedShopeeRowId === item.id;
                              return (
                                <tr
                                  key={item.id}
                                  onClick={() =>
                                    setSelectedShopeeRowId(
                                      isSelected ? null : item.id,
                                    )
                                  }
                                  className={`group cursor-pointer border-b border-[#E9EAEB] transition-colors h-14 ${
                                    isSelected
                                      ? "bg-[#DDEAFC]"
                                      : "hover:bg-[#DDEAFC]"
                                  }`}
                                >
                                  <td className="px-4 text-center border-r border-[#E9EAEB]">
                                    {renderItemImage(item.image)}
                                  </td>
                                  <td className="px-4 text-[13px] text-[#101828] font-medium truncate border-r border-[#E9EAEB]">
                                    {item.name}
                                  </td>
                                  <td className="px-4 text-[13px] text-[#101828] border-r border-[#E9EAEB]">
                                    {item.category}
                                  </td>
                                  <td className="px-4 text-[13px] text-[#101828] border-r border-[#E9EAEB]">
                                    {item.unit}
                                  </td>
                                  <td className="px-4 text-[13px] text-[#101828] font-sans text-right font-normal border-r border-[#E9EAEB]">
                                    {item.price.toLocaleString("vi-VN")}
                                  </td>
                                  <td className="px-4 text-left border-r border-[#E9EAEB]">
                                    <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                      <span
                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                          item.status === "Có bán"
                                            ? "bg-[#12B76A]"
                                            : "bg-[#717680]"
                                        }`}
                                      ></span>
                                      <span
                                        className={
                                          item.status === "Có bán"
                                            ? "text-[#12B76A]"
                                            : "text-[#717680]"
                                        }
                                      >
                                        {item.status}
                                      </span>
                                    </span>
                                  </td>
                                  <td
                                    className="px-4 text-left border-r border-[#E9EAEB]"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold font-sans">
                                      <span
                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                          item.isLinked
                                            ? "bg-[#12B76A]"
                                            : "bg-[#717680]"
                                        }`}
                                      ></span>
                                      <span
                                        className={
                                          item.isLinked
                                            ? "text-[#12B76A]"
                                            : "text-[#717680]"
                                        }
                                      >
                                        {item.isLinked
                                          ? "Đã liên kết"
                                          : "Chưa liên kết"}
                                      </span>
                                    </span>
                                  </td>
                                  <td
                                    className="px-4 text-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-center gap-2">
                                      {item.isLinked ? (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShopeeMenuItems((prev) =>
                                              prev.map((i) =>
                                                i.id === item.id
                                                  ? { ...i, isLinked: false, linkedDishId: "" }
                                                  : i,
                                              ),
                                            );
                                            onNotification(
                                              `Đã hủy liên kết món "${item.name}"`,
                                              "info",
                                            );
                                          }}
                                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#717680] hover:text-[#101828] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                          title="Hủy liên kết"
                                        >
                                          <Unlink className="w-4 h-4" />
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setLinkingShopeeItemId(item.id);
                                            setSelectedCukCukDishId(null);
                                            setCukcukSearchQuery("");
                                            setIsLinkCukCukModalOpen(true);
                                          }}
                                          className="p-1.5 hover:bg-[#EDFCF4] rounded-lg text-[#245FDF] hover:text-[#1B4EBA] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                          title="Liên kết"
                                        >
                                          <Link className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                            {filteredMenuItems.length === 0 && (
                              <tr>
                                <td
                                  colSpan={8}
                                  className="px-4 py-8 text-center text-[13px] text-[#717680]"
                                >
                                  Không tìm thấy món ăn nào phù hợp với điều
                                  kiện lọc
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* 💠 DataTable Pagination (Thanh phân trang) */}
                      <div className="h-11 px-4 bg-[#F8F9FA] border-t border-[#E9EAEB] flex items-center justify-between flex-shrink-0 text-[13px] text-[#717680] select-none rounded-b-xl">
                        {/* Left group of pagination controls */}
                        <div className="flex items-center gap-3">
                          {/* First page button */}
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none"
                            onClick={() => {}}
                            title="Trang đầu"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
                            </svg>
                          </button>

                          {/* Prev page button */}
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none"
                            onClick={() => {}}
                            title="Trang trước"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </button>

                          <div className="flex items-center text-[13px]">
                            <span>Trang</span>
                            <input
                              type="text"
                              defaultValue="1"
                              className="w-8 h-6 mx-1.5 text-center border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none font-sans font-medium focus:border-[#245FDF]"
                            />
                            <span>trên 1</span>
                          </div>

                          {/* Next page button */}
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none"
                            onClick={() => {}}
                            title="Trang sau"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>

                          {/* Last page button */}
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none"
                            onClick={() => {}}
                            title="Trang cuối"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                            </svg>
                          </button>

                          {/* Refresh button */}
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none ml-1"
                            onClick={() => {
                              onNotification(
                                "Đã tải lại danh sách thực đơn",
                                "success",
                              );
                            }}
                            title="Tải lại"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Dropdown page size */}
                          <div className="ml-2">
                            <select
                              defaultValue="100"
                              className="h-6 border border-[#D5D7DA] rounded-[4px] bg-white text-[12px] px-1 outline-none text-[#101828] font-medium font-sans"
                            >
                              <option value="10">10</option>
                              <option value="20">20</option>
                              <option value="50">50</option>
                              <option value="100">100</option>
                            </select>
                          </div>
                        </div>

                        {/* Right part: item status */}
                        <div className="font-sans font-medium text-[#101828]">
                          Hiển thị 1 - {filteredMenuItems.length} trên{" "}
                          {filteredMenuItems.length} kết quả
                        </div>
                      </div>
                    </div>
                  ) : shopeeActiveSegment === "nhom-thuc-don" ? (
                    /* Tab 2: Nhóm thực đơn (Menu Groups) */
                    <div
                      className="bg-white rounded-xl border border-[#E9EAEB] flex flex-col flex-1 overflow-hidden"
                      style={{ boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)" }}
                    >
                      {/* Toolbar (Thanh tìm kiếm & bộ lọc) */}
                      <div className="h-[56px] px-4 py-3 flex items-center border-b border-[#E9EAEB] flex-shrink-0 gap-3 overflow-x-auto select-none">
                        {/* 💠 Search box with magnifying glass icon on left */}
                        <div className="relative w-56 flex-shrink-0">
                          <svg
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <input
                            type="text"
                            value={shopeeGroupSearchQuery}
                            onChange={(e) => {
                              setShopeeGroupSearchQuery(e.target.value);
                              setShopeeGroupPage(1);
                            }}
                            placeholder="Tìm kiếm nhóm thực đơn..."
                            className="w-full pl-8 pr-2.5 h-[32px] text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all placeholder:text-[#A4A7AE] text-[#101828]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={openQuickLink}
                          className="bg-white hover:bg-[#EDFCF4] text-[#245FDF] border border-[#245FDF]/30 font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Liên kết nhanh
                        </button>

                        {/* 💠 Toolbar action buttons (Sửa, Lên, Xuống) */}
                        <button
                          onClick={() => {
                            if (!selectedShopeeGroupId) {
                              onNotification(
                                "Vui lòng chọn 1 nhóm thực đơn để sửa",
                                "info",
                              );
                              return;
                            }
                            const groupToEdit = shopeeMenuGroups.find(
                              (g) => g.id === selectedShopeeGroupId,
                            );
                            if (groupToEdit) {
                              setEditingShopeeGroup({ ...groupToEdit });
                              setIsEditingShopeeGroup(true);
                            }
                          }}
                          className={`font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors border flex-shrink-0 min-w-[84px] ${
                            selectedShopeeGroupId
                              ? "bg-white hover:bg-gray-50 border-[#D5D7DA] text-[#101828]"
                              : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                          }`}
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => {
                            if (!selectedShopeeGroupId) {
                              onNotification(
                                "Vui lòng chọn 1 nhóm thực đơn để di chuyển",
                                "info",
                              );
                              return;
                            }
                            const idx = shopeeMenuGroups.findIndex(
                              (g) => g.id === selectedShopeeGroupId,
                            );
                            if (idx > 0) {
                              const updated = [...shopeeMenuGroups];
                              const temp = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = temp;
                              setShopeeMenuGroups(updated);
                              onNotification(
                                `Đã di chuyển nhóm thực đơn "${temp.name}" lên trên`,
                                "success",
                              );
                            } else {
                              onNotification(
                                "Nhóm thực đơn đã ở vị trí đầu tiên",
                                "info",
                              );
                            }
                          }}
                          className={`font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors border flex-shrink-0 min-w-[84px] ${
                            selectedShopeeGroupId
                              ? "bg-white hover:bg-gray-50 border-[#D5D7DA] text-[#101828]"
                              : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                          }`}
                        >
                          Lên
                        </button>

                        <button
                          onClick={() => {
                            if (!selectedShopeeGroupId) {
                              onNotification(
                                "Vui lòng chọn 1 nhóm thực đơn để di chuyển",
                                "info",
                              );
                              return;
                            }
                            const idx = shopeeMenuGroups.findIndex(
                              (g) => g.id === selectedShopeeGroupId,
                            );
                            if (idx !== -1 && idx < shopeeMenuGroups.length - 1) {
                              const updated = [...shopeeMenuGroups];
                              const temp = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = temp;
                              setShopeeMenuGroups(updated);
                              onNotification(
                                `Đã di chuyển nhóm thực đơn "${temp.name}" xuống dưới`,
                                "success",
                              );
                            } else {
                              onNotification(
                                "Nhóm thực đơn đã ở vị trí cuối cùng",
                                "info",
                              );
                            }
                          }}
                          className={`font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors border flex-shrink-0 min-w-[84px] ${
                            selectedShopeeGroupId
                              ? "bg-white hover:bg-gray-50 border-[#D5D7DA] text-[#101828]"
                              : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                          }`}
                        >
                          Xuống
                        </button>

                        {/* 💠 Far-right utility icons (Nạp, Giúp) */}
                        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                          <button
                            onClick={() => {
                              onNotification(
                                "Đang đồng bộ lại danh sách nhóm thực đơn từ ShopeeFood...",
                                "info",
                              );
                            }}
                            className="w-8 h-8 flex items-center justify-center border border-[#D5D7DA] hover:bg-gray-50 text-[#717680] rounded-[8px] bg-white transition-colors cursor-pointer"
                            title="Tải lại (Nạp)"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              onNotification(
                                "Đang mở tài liệu hướng dẫn quản lý nhóm thực đơn",
                                "info",
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border border-[#D5D7DA] hover:bg-gray-50 text-[#717680] rounded-[8px] bg-white transition-colors cursor-pointer"
                            title="Hướng dẫn (Giúp)"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content Table (Nội dung bảng) */}
                      {(() => {
                        const filteredGroups = shopeeMenuGroups.filter(
                          (group) => {
                            const matchesSearch = group.name
                              .toLowerCase()
                              .includes(shopeeGroupSearchQuery.toLowerCase());
                            const matchesFilterName =
                              !menuGroupFilterName ||
                              group.name
                                .toLowerCase()
                                .includes(menuGroupFilterName.toLowerCase());

                            const matchesFilterDesc =
                              !menuGroupFilterDesc ||
                              (group.description || "")
                                .toLowerCase()
                                .includes(menuGroupFilterDesc.toLowerCase());

                            // Count calculation
                            const itemCount = shopeeMenuItems.filter(
                              (item) => item.category === group.name
                            ).length;

                            let matchesFilterCount = true;
                            if (menuGroupFilterCount) {
                              const countVal = Number(menuGroupFilterCount);
                              if (!isNaN(countVal)) {
                                matchesFilterCount = itemCount <= countVal;
                              }
                            }

                            let matchesFilterStatus = true;
                            if (
                              menuGroupFilterStatus &&
                              menuGroupFilterStatus !== "all"
                            ) {
                              matchesFilterStatus =
                                group.status === menuGroupFilterStatus;
                            }

                            let matchesFilterLinked = true;
                            if (menuGroupFilterLinked) {
                              const isL = !!group.linkedGroupId;
                              if (menuGroupFilterLinked === "linked") {
                                matchesFilterLinked = isL;
                              } else if (menuGroupFilterLinked === "unlinked") {
                                matchesFilterLinked = !isL;
                              }
                            }

                            return (
                              matchesSearch &&
                              matchesFilterName &&
                              matchesFilterDesc &&
                              matchesFilterCount &&
                              matchesFilterStatus &&
                              matchesFilterLinked
                            );
                          },
                        );

                        const totalItems = filteredGroups.length;
                        const totalPages =
                          Math.ceil(totalItems / shopeeGroupPageSize) || 1;
                        const currentPage = Math.min(
                          shopeeGroupPage,
                          totalPages,
                        );
                        const startItem =
                          totalItems > 0
                            ? (currentPage - 1) * shopeeGroupPageSize + 1
                            : 0;
                        const endItem = Math.min(
                          currentPage * shopeeGroupPageSize,
                          totalItems,
                        );
                        const paginatedItems = filteredGroups.slice(
                          (currentPage - 1) * shopeeGroupPageSize,
                          currentPage * shopeeGroupPageSize,
                        );

                        return (
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto">
                              <table className="w-full text-left border-collapse select-none">
                                <thead className="sticky top-0 bg-[#F7F7F8] z-10 border-b border-[#E9EAEB]">
                                  <tr className="bg-[#F7F7F8] select-none text-[13px] text-[#101828] font-semibold align-middle">
                                    {/* Nhóm thực đơn - Text type (Image 1 style) */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Nhóm thực đơn
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="flex items-center w-full">
                                            <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                              *
                                            </div>
                                            <input
                                              type="text"
                                              value={menuGroupFilterName}
                                              onChange={(e) => {
                                                setMenuGroupFilterName(
                                                  e.target.value,
                                                );
                                                setShopeeGroupPage(1);
                                              }}
                                              placeholder="Tìm theo tên..."
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Mô tả - Text type */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Mô tả
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="flex items-center w-full">
                                            <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                              *
                                            </div>
                                            <input
                                              type="text"
                                              value={menuGroupFilterDesc}
                                              onChange={(e) => {
                                                setMenuGroupFilterDesc(
                                                  e.target.value,
                                                );
                                                setShopeeGroupPage(1);
                                              }}
                                              placeholder="Tìm theo mô tả..."
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Số lượng món - Number type (Image 2 style) */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-48 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans whitespace-nowrap">
                                            Số lượng món
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="flex items-center w-full">
                                            <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                              ≤
                                            </div>
                                            <input
                                              type="text"
                                              value={menuGroupFilterCount}
                                              onChange={(e) => {
                                                setMenuGroupFilterCount(
                                                  e.target.value,
                                                );
                                                setShopeeGroupPage(1);
                                              }}
                                              placeholder="Số lượng..."
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Trạng thái - Status type */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-48 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Trạng thái
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="relative w-full">
                                            <select
                                              value={menuGroupFilterStatus}
                                              onChange={(e) => {
                                                setMenuGroupFilterStatus(
                                                  e.target.value,
                                                );
                                                setShopeeGroupPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans appearance-none pr-6"
                                            >
                                              <option value="">Tất cả</option>
                                              <option value="Có bán">
                                                Có bán
                                              </option>
                                              <option value="Ngừng bán">
                                                Ngừng bán
                                              </option>
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                              <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2.5}
                                                  d="M19 9l-7 7-7-7"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Trạng thái liên kết - Status type */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-48 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Trạng thái liên kết
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="relative w-full">
                                            <select
                                              value={menuGroupFilterLinked}
                                              onChange={(e) => {
                                                setMenuGroupFilterLinked(
                                                  e.target.value,
                                                );
                                                setShopeeGroupPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans appearance-none pr-6"
                                            >
                                              <option value="">Tất cả</option>
                                              <option value="linked">
                                                Đã liên kết
                                              </option>
                                              <option value="unlinked">
                                                Chưa liên kết
                                              </option>
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                              <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2.5}
                                                  d="M19 9l-7 7-7-7"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Thao tác */}
                                    <th className="px-4 py-2 text-center w-28 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Thao tác
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0 h-7 flex items-center justify-center text-[11px] text-[#717680] font-normal">
                                          <select
                                            disabled
                                            className="w-full h-7 px-2 text-[12px] border border-[#E9EAEB] rounded-[4px] bg-[#F7F7F8] text-[#717680] outline-none font-sans appearance-none"
                                          >
                                            <option value="">Lọc</option>
                                          </select>
                                        </div>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {totalItems === 0 ? (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="py-12 text-center text-[#A4A7AE] text-[13px]"
                                      >
                                        Không tìm thấy kết quả phù hợp
                                      </td>
                                    </tr>
                                  ) : (
                                    paginatedItems.map((group) => {
                                      const isSelected =
                                        selectedShopeeGroupId === group.id;
                                      const itemCount = shopeeMenuItems.filter(
                                        (item) => item.category === group.name
                                      ).length;

                                      return (
                                        <tr
                                          key={group.id}
                                          onClick={() =>
                                            setSelectedShopeeGroupId(
                                              isSelected ? null : group.id,
                                            )
                                          }
                                          className={`group border-b border-[#E9EAEB] transition-colors h-14 cursor-pointer text-[13px] ${
                                            isSelected
                                              ? "bg-[#DDEAFC]"
                                              : "hover:bg-[#F0F6FE]"
                                          }`}
                                        >
                                          {/* Tên nhóm - Text (Căn trái) */}
                                          <td className="px-4 font-normal text-[#101828] border-r border-[#E9EAEB] text-left">
                                            {group.name}
                                          </td>

                                          {/* Mô tả - Text (Căn trái) */}
                                          <td className="px-4 font-normal text-[#717680] border-r border-[#E9EAEB] text-left">
                                            {group.description || <span className="text-gray-400 italic">Không có mô tả</span>}
                                          </td>

                                          {/* Số lượng món - Number (Căn phải) */}
                                          <td className="px-4 text-right font-normal font-mono border-r border-[#E9EAEB]">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation(); // Ngăn việc chọn dòng của bảng khi click hyperlink
                                                setViewDishesGroupName(group.name);
                                                setIsViewingDishesModalOpen(true);
                                              }}
                                              className="text-[#245FDF] hover:underline hover:text-[#1B4EBA] font-semibold bg-transparent border-none cursor-pointer p-0 font-mono text-[13px] inline-block"
                                            >
                                              {itemCount}
                                            </button>
                                          </td>

                                          {/* Trạng thái - Trạng thái (Căn trái) */}
                                          <td className="px-4 text-left border-r border-[#E9EAEB]">
                                            {group.status === "Có bán" ? (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#12B76A] flex-shrink-0"></span>
                                                <span className="text-[#12B76A]">
                                                  Có bán
                                                </span>
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#F04438] flex-shrink-0"></span>
                                                <span className="text-[#F04438]">
                                                  Ngừng bán
                                                </span>
                                              </span>
                                            )}
                                          </td>

                                          {/* Trạng thái liên kết - Trạng thái (Căn trái) */}
                                          <td className="px-4 text-left border-r border-[#E9EAEB]">
                                            {group.linkedGroupId ? (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#12B76A] flex-shrink-0"></span>
                                                <span className="text-[#12B76A]">
                                                  Đã liên kết
                                                </span>
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#717680] flex-shrink-0"></span>
                                                <span className="text-[#717680]">
                                                  Chưa liên kết
                                                </span>
                                              </span>
                                            )}
                                          </td>

                                          {/* Thao tác */}
                                          <td className="px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2">
                                              {group.linkedGroupId ? (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShopeeMenuGroups(prev => prev.map(g => g.id === group.id ? { ...g, linkedGroupId: "" } : g));
                                                    setWizardMenuGroups(prev => prev.map(g => g.name === group.name ? { ...g, linkedGroupId: "" } : g));
                                                    setWizardFoods(prev => prev.map(f => f.category === group.name ? { ...f, linkedDishId: "" } : f));
                                                    onNotification(`Đã hủy liên kết tất cả các món con trong nhóm "${group.name}"`, "success");
                                                  }}
                                                  className="p-1.5 hover:bg-gray-100 rounded-lg text-[#717680] hover:text-[#101828] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                                  title="Hủy liên kết"
                                                >
                                                  <Unlink className="w-4 h-4" />
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setLinkingShopeeMenuGroupId(group.id);
                                                    setSelectedCukCukMenuGroupId(null);
                                                    setMenuGroupPopupSearch("");
                                                    setIsLinkCukCukMenuGroupModalOpen(true);
                                                  }}
                                                  className="p-1.5 hover:bg-[#EDFCF4] rounded-lg text-[#245FDF] hover:text-[#1B4EBA] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                                  title="Liên kết"
                                                >
                                                  <Link className="w-4 h-4" />
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* 💠 DataTable Pagination (Thanh phân trang) */}
                            <div className="h-11 px-4 bg-[#F8F9FA] border-t border-[#E9EAEB] flex items-center justify-between flex-shrink-0 text-[13px] text-[#717680] select-none rounded-b-xl">
                              <div className="flex items-center gap-3">
                                {/* First page button */}
                                <button
                                  disabled={currentPage === 1}
                                  onClick={() => setShopeeGroupPage(1)}
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
                                  title="Trang đầu"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
                                  </svg>
                                </button>

                                {/* Prev page button */}
                                <button
                                  disabled={currentPage === 1}
                                  onClick={() =>
                                    setShopeeGroupPage((prev) =>
                                      Math.max(prev - 1, 1),
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
                                  title="Trang trước"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m15 18-6-6 6-6" />
                                  </svg>
                                </button>

                                <div className="flex items-center text-[13px]">
                                  <span>Trang</span>
                                  <input
                                    type="text"
                                    value={currentPage}
                                    readOnly
                                    className="w-8 h-6 mx-1.5 text-center border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none font-sans font-medium focus:border-[#245FDF]"
                                  />
                                  <span>trên {totalPages}</span>
                                </div>

                                {/* Next page button */}
                                <button
                                  disabled={currentPage >= totalPages}
                                  onClick={() =>
                                    setShopeeGroupPage((prev) =>
                                      Math.min(prev + 1, totalPages),
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
                                  title="Trang sau"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m9 18 6-6-6-6" />
                                  </svg>
                                </button>

                                {/* Last page button */}
                                <button
                                  disabled={currentPage >= totalPages}
                                  onClick={() => setShopeeGroupPage(totalPages)}
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
                                  title="Trang cuối"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                                  </svg>
                                </button>

                                {/* Refresh button */}
                                <button
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none ml-1"
                                  onClick={() => {
                                    onNotification(
                                      "Đã tải lại danh sách nhóm thực đơn",
                                      "success",
                                    );
                                  }}
                                  title="Tải lại"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>

                                {/* Dropdown page size */}
                                <div className="ml-2">
                                  <select
                                    value={shopeeGroupPageSize}
                                    onChange={(e) => {
                                      setShopeeGroupPageSize(
                                        Number(e.target.value),
                                      );
                                      setShopeeGroupPage(1);
                                    }}
                                    className="h-6 border border-[#D5D7DA] rounded-[4px] bg-white text-[12px] px-1 outline-none text-[#101828] font-medium font-sans"
                                  >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                  </select>
                                </div>
                              </div>

                              {/* Right part: item status */}
                              <div className="font-sans font-medium text-[#101828]">
                                Hiển thị {startItem} - {endItem} trên{" "}
                                {totalItems} kết quả
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : shopeeActiveSegment === "so-thich-phuc-vu" ? (
                    /* Tab 3: Sở thích phục vụ (Individual STPV items) */
                    <div
                      className="bg-white rounded-xl border border-[#E9EAEB] flex flex-col flex-1 overflow-hidden"
                      style={{ boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)" }}
                    >
                      {/* Toolbar (Thanh tìm kiếm & bộ lọc) */}
                      <div className="h-[56px] px-4 py-3 flex items-center border-b border-[#E9EAEB] flex-shrink-0 gap-3 overflow-x-auto select-none">
                        {/* 💠 Search box with magnifying glass icon on left */}
                        <div className="relative w-56 flex-shrink-0">
                          <svg
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <input
                            type="text"
                            value={stpvTabSearchQuery}
                            onChange={(e) => {
                              setStpvTabSearchQuery(e.target.value);
                              setStpvTabPage(1);
                            }}
                            placeholder="Tìm kiếm sở thích phục vụ..."
                            className="w-full pl-8 pr-2.5 h-[32px] text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all placeholder:text-[#A4A7AE] text-[#101828]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={openQuickLink}
                          className="bg-white hover:bg-[#EDFCF4] text-[#245FDF] border border-[#245FDF]/30 font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Liên kết nhanh
                        </button>

                        {/* 💠 Toolbar action buttons (Sửa, Lên, Xuống) */}
                        <button
                          onClick={() => {
                            if (!selectedStpvTabRowId) {
                              onNotification(
                                "Vui lòng chọn 1 dòng sở thích phục vụ để sửa",
                                "info",
                              );
                              return;
                            }
                            const itemToEdit = wizardStpv.find(
                              (i) => i.id === selectedStpvTabRowId,
                            );
                            if (itemToEdit) {
                              setEditingStpvItem({ ...itemToEdit });
                              setIsEditingStpvItem(true);
                            }
                          }}
                          className={`font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors border flex-shrink-0 min-w-[84px] ${
                            selectedStpvTabRowId
                              ? "bg-white hover:bg-gray-50 border-[#D5D7DA] text-[#101828]"
                              : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                          }`}
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => {
                            if (!selectedStpvTabRowId) {
                              onNotification(
                                "Vui lòng chọn 1 dòng sở thích phục vụ để di chuyển",
                                "info",
                              );
                              return;
                            }
                            const idx = wizardStpv.findIndex(
                              (i) => i.id === selectedStpvTabRowId,
                            );
                            if (idx > 0) {
                              const updated = [...wizardStpv];
                              const temp = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = temp;
                              setWizardStpv(updated);
                              onNotification(
                                `Đã di chuyển sở thích phục vụ "${temp.name}" lên trên`,
                                "success",
                              );
                            } else {
                              onNotification(
                                "Sở thích phục vụ đã ở vị trí đầu tiên",
                                "info",
                              );
                            }
                          }}
                          className={`font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors border flex-shrink-0 min-w-[84px] ${
                            selectedStpvTabRowId
                              ? "bg-white hover:bg-gray-50 border-[#D5D7DA] text-[#101828]"
                              : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                          }`}
                        >
                          Lên
                        </button>

                        <button
                          onClick={() => {
                            if (!selectedStpvTabRowId) {
                              onNotification(
                                "Vui lòng chọn 1 dòng sở thích phục vụ để di chuyển",
                                "info",
                              );
                              return;
                            }
                            const idx = wizardStpv.findIndex(
                              (i) => i.id === selectedStpvTabRowId,
                            );
                            if (idx !== -1 && idx < wizardStpv.length - 1) {
                              const updated = [...wizardStpv];
                              const temp = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = temp;
                              setWizardStpv(updated);
                              onNotification(
                                `Đã di chuyển sở thích phục vụ "${temp.name}" xuống dưới`,
                                "success",
                              );
                            } else {
                              onNotification(
                                "Sở thích phục vụ đã ở vị trí cuối cùng",
                                "info",
                              );
                            }
                          }}
                          className={`font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors border flex-shrink-0 min-w-[84px] ${
                            selectedStpvTabRowId
                              ? "bg-white hover:bg-gray-50 border-[#D5D7DA] text-[#101828]"
                              : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                          }`}
                        >
                          Xuống
                        </button>

                        {/* 💠 Far-right utility icons (Nạp, Giúp) */}
                        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                          <button
                            onClick={() => {
                              onNotification(
                                "Đang làm mới danh sách sở thích phục vụ...",
                                "info",
                              );
                            }}
                            className="w-8 h-8 flex items-center justify-center border border-[#D5D7DA] hover:bg-gray-50 text-[#717680] rounded-[8px] bg-white transition-colors cursor-pointer"
                            title="Tải lại (Nạp)"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              onNotification(
                                "Đang mở tài liệu hướng dẫn sở thích phục vụ",
                                "info",
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border border-[#D5D7DA] hover:bg-gray-50 text-[#717680] rounded-[8px] bg-white transition-colors cursor-pointer"
                            title="Hướng dẫn (Giúp)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-help-circle"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                              <line x1="12" x2="12.01" y1="17" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Content Table (Nội dung bảng) */}
                      {(() => {
                        const filteredStpvItems = wizardStpv.filter((item) => {
                          const status = item.status || (["stpv4", "stpv11", "stpv12"].includes(item.id) ? "Ngừng sử dụng" : "Sử dụng");
                          const isLinked = !!item.linkedGroupId;

                          const matchesSearch = item.name
                            .toLowerCase()
                            .includes(stpvTabSearchQuery.toLowerCase());

                          const matchesFilterName =
                            !stpvTabFilterName ||
                            item.name
                              .toLowerCase()
                              .includes(stpvTabFilterName.toLowerCase());

                          const matchesFilterGroup =
                            !stpvTabFilterGroup ||
                            item.group
                              .toLowerCase()
                              .includes(stpvTabFilterGroup.toLowerCase());

                          const matchesFilterPrice =
                            !stpvTabFilterPrice ||
                            item.price
                              .toString()
                              .includes(stpvTabFilterPrice);

                          let matchesFilterStatus = true;
                          if (stpvTabFilterStatus) {
                            matchesFilterStatus = status === stpvTabFilterStatus;
                          }

                          let matchesFilterLinked = true;
                          if (stpvTabFilterLinked === "linked") {
                            matchesFilterLinked = isLinked;
                          } else if (stpvTabFilterLinked === "unlinked") {
                            matchesFilterLinked = !isLinked;
                          }

                          return (
                            matchesSearch &&
                            matchesFilterName &&
                            matchesFilterGroup &&
                            matchesFilterPrice &&
                            matchesFilterStatus &&
                            matchesFilterLinked
                          );
                        });

                        const totalItems = filteredStpvItems.length;
                        const totalPages =
                          Math.ceil(totalItems / stpvTabPageSize) || 1;
                        const currentPage = Math.min(
                          stpvTabPage,
                          totalPages,
                        );
                        const startItem =
                          totalItems > 0
                            ? (currentPage - 1) * stpvTabPageSize + 1
                            : 0;
                        const endItem = Math.min(
                          currentPage * stpvTabPageSize,
                          totalItems,
                        );
                        const paginatedItems = filteredStpvItems.slice(
                          (currentPage - 1) * stpvTabPageSize,
                          currentPage * stpvTabPageSize,
                        );

                        return (
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto">
                              <table className="w-full text-left border-collapse select-none">
                                <thead className="sticky top-0 bg-[#FAFAFA] z-10 border-b border-[#E9EAEB]">
                                  <tr className="bg-[#FAFAFA] select-none text-[13px] text-[#101828] font-semibold align-middle">
                                    {/* Sở thích phục vụ */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Sở thích phục vụ
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="flex items-center w-full">
                                            <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                              *
                                            </div>
                                            <input
                                              type="text"
                                              value={stpvTabFilterName}
                                              onChange={(e) => {
                                                setStpvTabFilterName(
                                                  e.target.value,
                                                );
                                                setStpvTabPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Nhóm STPV */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center align-middle w-52">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Nhóm STPV
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="flex items-center w-full">
                                            <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                              *
                                            </div>
                                            <input
                                              type="text"
                                              value={stpvTabFilterGroup}
                                              onChange={(e) => {
                                                setStpvTabFilterGroup(
                                                  e.target.value,
                                                );
                                                setStpvTabPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Tiền thêm trên ShopeeFood */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center align-middle w-60">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans whitespace-nowrap">
                                            Tiền thêm trên ShopeeFood
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="flex items-center w-full">
                                            <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                              ≤
                                            </div>
                                            <input
                                              type="text"
                                              value={stpvTabFilterPrice}
                                              onChange={(e) => {
                                                setStpvTabFilterPrice(
                                                  e.target.value,
                                                );
                                                setStpvTabPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans text-right"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Trạng thái (Sử dụng/ Ngừng sử dụng) */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-52 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Trạng thái
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="relative w-full">
                                            <select
                                              value={stpvTabFilterStatus}
                                              onChange={(e) => {
                                                setStpvTabFilterStatus(
                                                  e.target.value,
                                                );
                                                setStpvTabPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans appearance-none pr-6"
                                            >
                                              <option value=""></option>
                                              <option value="Sử dụng">Sử dụng</option>
                                              <option value="Ngừng sử dụng">Ngừng sử dụng</option>
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                              <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2.5}
                                                  d="M19 9l-7 7-7-7"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Trạng thái liên kết */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-60 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Trạng thái liên kết
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="relative w-full">
                                            <select
                                              value={stpvTabFilterLinked}
                                              onChange={(e) => {
                                                setStpvTabFilterLinked(
                                                  e.target.value,
                                                );
                                                setStpvTabPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans appearance-none pr-6"
                                            >
                                              <option value=""></option>
                                              <option value="linked">Đã liên kết</option>
                                              <option value="unlinked">Chưa liên kết</option>
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                              <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2.5}
                                                  d="M19 9l-7 7-7-7"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Thao tác */}
                                    <th className="px-4 py-2 text-center w-28 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Thao tác
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0 h-7 flex items-center justify-center text-[11px] text-[#717680] font-normal">
                                          <select
                                            disabled
                                            className="w-full h-7 px-2 text-[12px] border border-[#E9EAEB] rounded-[4px] bg-[#F7F7F8] text-[#717680] outline-none font-sans appearance-none"
                                          >
                                            <option value="">Lọc</option>
                                          </select>
                                        </div>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {totalItems === 0 ? (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="py-12 text-center text-[#A4A7AE] text-[13px] font-sans bg-white"
                                      >
                                        Không tìm thấy kết quả phù hợp
                                      </td>
                                    </tr>
                                  ) : (
                                    paginatedItems.map((item) => {
                                      const status = item.status || (["stpv4", "stpv11", "stpv12"].includes(item.id) ? "Ngừng sử dụng" : "Sử dụng");
                                      const isLinked = !!item.linkedGroupId;
                                      const isSelected = selectedStpvTabRowId === item.id;
                                      const linkedCukCukGroup = wizardCukCukGroups.find(c => c.id === item.linkedGroupId);

                                      return (
                                        <tr
                                          key={item.id}
                                          onClick={() =>
                                            setSelectedStpvTabRowId(
                                              isSelected ? null : item.id,
                                            )
                                          }
                                          className={`group border-b border-[#E9EAEB] transition-colors h-14 cursor-pointer text-[13px] ${
                                            isSelected
                                              ? "bg-[#DDEAFC]"
                                              : "hover:bg-gray-50"
                                          }`}
                                        >
                                          {/* Sở thích phục vụ */}
                                          <td className="px-4 text-[13px] text-[#101828] font-medium truncate border-r border-[#E9EAEB]">
                                            {item.name}
                                          </td>

                                          {/* Nhóm STPV */}
                                          <td className="px-4 text-[13px] text-[#101828] border-r border-[#E9EAEB]">
                                            {item.group}
                                          </td>

                                          {/* Tiền thêm trên ShopeeFood */}
                                          <td className="px-4 text-[13px] text-[#101828] font-sans text-right border-r border-[#E9EAEB]">
                                            {item.price.toLocaleString("vi-VN")}
                                          </td>

                                          {/* Trạng thái */}
                                          <td className="px-4 text-left border-r border-[#E9EAEB]">
                                            {status === "Sử dụng" ? (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#12B76A] flex-shrink-0"></span>
                                                <span className="text-[#12B76A] font-semibold">
                                                  Sử dụng
                                                </span>
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#F04438] flex-shrink-0"></span>
                                                <span className="text-[#F04438] font-semibold">
                                                  Ngừng sử dụng
                                                </span>
                                              </span>
                                            )}
                                          </td>

                                          {/* Trạng thái liên kết */}
                                          <td className="px-4 text-left border-r border-[#E9EAEB]">
                                            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold font-sans">
                                              <span
                                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                  isLinked
                                                    ? "bg-[#12B76A]"
                                                    : "bg-[#717680]"
                                                }`}
                                              ></span>
                                              <span
                                                className={
                                                  isLinked
                                                    ? "text-[#12B76A]"
                                                    : "text-[#717680]"
                                                }
                                              >
                                                {isLinked ? "Đã liên kết" : "Chưa liên kết"}
                                              </span>
                                            </span>
                                          </td>

                                          {/* Thao tác */}
                                          <td className="px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2">
                                              {isLinked ? (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setWizardStpv((prev) =>
                                                      prev.map((i) =>
                                                        i.id === item.id
                                                          ? { ...i, linkedGroupId: "" }
                                                          : i,
                                                      ),
                                                    );
                                                    onNotification(
                                                      `Đã hủy liên kết sở thích phục vụ "${item.name}"`,
                                                      "info",
                                                    );
                                                  }}
                                                  className="p-1.5 hover:bg-gray-100 rounded-lg text-[#717680] hover:text-[#101828] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                                  title="Hủy liên kết"
                                                >
                                                  <Unlink className="w-4 h-4" />
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setLinkingStpvItemId(item.id);
                                                    setSelectedCukCukStpvId(null);
                                                    setCukcukStpvSearchQuery("");
                                                    setIsLinkStpvItemModalOpen(true);
                                                  }}
                                                  className="p-1.5 hover:bg-[#EDFCF4] rounded-lg text-[#245FDF] hover:text-[#1B4EBA] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                                  title="Liên kết"
                                                >
                                                  <Link className="w-4 h-4" />
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Pagination (Thanh phân trang) */}
                            <div className="h-11 px-4 bg-[#F8F9FA] border-t border-[#E9EAEB] flex items-center justify-between flex-shrink-0 text-[13px] text-[#717680] select-none rounded-b-xl">
                              <div className="flex items-center gap-3">
                                {/* First page button */}
                                <button
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none"
                                  onClick={() => setStpvTabPage(1)}
                                  disabled={stpvTabPage === 1}
                                  title="Trang đầu"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
                                  </svg>
                                </button>

                                {/* Prev page button */}
                                <button
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none"
                                  onClick={() => setStpvTabPage(Math.max(1, stpvTabPage - 1))}
                                  disabled={stpvTabPage === 1}
                                  title="Trang trước"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m15 18-6-6 6-6" />
                                  </svg>
                                </button>

                                {/* Page selection input/display */}
                                <div className="flex items-center gap-1.5">
                                  <span className="font-sans">Trang</span>
                                  <input
                                    type="text"
                                    value={stpvTabPage}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      if (val >= 1 && val <= totalPages) {
                                        setStpvTabPage(val);
                                      }
                                    }}
                                    className="w-8 h-6 text-center border border-[#D5D7DA] rounded-[4px] bg-white font-sans text-[13px] outline-none text-[#101828] focus:border-[#245FDF]"
                                  />
                                  <span className="font-sans">/ {totalPages}</span>
                                </div>

                                {/* Next page button */}
                                <button
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none"
                                  onClick={() => setStpvTabPage(Math.min(totalPages, stpvTabPage + 1))}
                                  disabled={stpvTabPage === totalPages}
                                  title="Trang sau"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m9 18 6-6-6-6" />
                                  </svg>
                                </button>

                                {/* Last page button */}
                                <button
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none"
                                  onClick={() => setStpvTabPage(totalPages)}
                                  disabled={stpvTabPage === totalPages}
                                  title="Trang cuối"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                                  </svg>
                                </button>

                                {/* Dropdown page size */}
                                <div className="ml-2">
                                  <select
                                    value={stpvTabPageSize}
                                    onChange={(e) => {
                                      setStpvTabPageSize(
                                        Number(e.target.value),
                                      );
                                      setStpvTabPage(1);
                                    }}
                                    className="h-6 border border-[#D5D7DA] rounded-[4px] bg-white text-[12px] px-1 outline-none text-[#101828] font-medium font-sans cursor-pointer"
                                  >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                  </select>
                                </div>
                              </div>

                              {/* Right part: item status */}
                              <div className="font-sans font-medium text-[#101828]">
                                Hiển thị {startItem} - {endItem} trên{" "}
                                {totalItems} kết quả
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : shopeeActiveSegment === "so-thich" ? (
                    /* Tab 3.5: Nhóm STPV (Option groups / STPV) */
                    <div
                      className="bg-white rounded-xl border border-[#E9EAEB] flex flex-col flex-1 overflow-hidden"
                      style={{ boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)" }}
                    >
                      {/* Toolbar (Thanh tìm kiếm & bộ lọc) */}
                      <div className="h-[56px] px-4 py-3 flex items-center border-b border-[#E9EAEB] flex-shrink-0 gap-3 overflow-x-auto select-none">
                        {/* 💠 Search box with magnifying glass icon on left */}
                        <div className="relative w-56 flex-shrink-0">
                          <svg
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <input
                            type="text"
                            value={optionGroupSearchQuery}
                            onChange={(e) => {
                              setOptionGroupSearchQuery(e.target.value);
                              setOptionGroupPage(1);
                            }}
                            placeholder="Tìm kiếm nhóm STPV..."
                            className="w-full pl-8 pr-2.5 h-[32px] text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all placeholder:text-[#A4A7AE] text-[#101828]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={openQuickLink}
                          className="bg-white hover:bg-[#EDFCF4] text-[#245FDF] border border-[#245FDF]/30 font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                          style={{ minWidth: "84px" }}
                        >
                          Liên kết nhanh
                        </button>

                        {/* 💠 Toolbar action buttons (Sửa, Lên, Xuống) */}
                        <button
                          onClick={() => {
                            if (!selectedStpvRowId) {
                              onNotification(
                                "Vui lòng chọn 1 nhóm STPV để sửa",
                                "info",
                              );
                              return;
                            }
                            const groupToEdit = optionGroups.find(
                              (g) => g.id === selectedStpvRowId,
                            );
                            if (groupToEdit) {
                              setEditingStpv({ ...groupToEdit });
                              setSelectedItemIndex(null);
                              setIsEditingStpv(true);
                            }
                          }}
                          className={`font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors border flex-shrink-0 min-w-[84px] ${
                            selectedStpvRowId
                              ? "bg-white hover:bg-gray-50 border-[#D5D7DA] text-[#101828]"
                              : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                          }`}
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => {
                            if (!selectedStpvRowId) {
                              onNotification(
                                "Vui lòng chọn 1 nhóm STPV để di chuyển",
                                "info",
                              );
                              return;
                            }
                            const idx = optionGroups.findIndex(
                              (g) => g.id === selectedStpvRowId,
                            );
                            if (idx > 0) {
                              const updated = [...optionGroups];
                              const temp = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = temp;
                              setOptionGroups(updated);
                              onNotification(
                                `Đã di chuyển nhóm "${temp.name}" lên trên`,
                                "success",
                              );
                            } else {
                              onNotification(
                                "Nhóm STPV đã ở vị trí đầu tiên",
                                "info",
                              );
                            }
                          }}
                          className={`font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors border flex-shrink-0 min-w-[84px] ${
                            selectedStpvRowId
                              ? "bg-white hover:bg-gray-50 border-[#D5D7DA] text-[#101828]"
                              : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                          }`}
                        >
                          Lên
                        </button>

                        <button
                          onClick={() => {
                            if (!selectedStpvRowId) {
                              onNotification(
                                "Vui lòng chọn 1 nhóm STPV để di chuyển",
                                "info",
                              );
                              return;
                            }
                            const idx = optionGroups.findIndex(
                              (g) => g.id === selectedStpvRowId,
                            );
                            if (idx !== -1 && idx < optionGroups.length - 1) {
                              const updated = [...optionGroups];
                              const temp = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = temp;
                              setOptionGroups(updated);
                              onNotification(
                                `Đã di chuyển nhóm "${temp.name}" xuống dưới`,
                                "success",
                              );
                            } else {
                              onNotification(
                                "Nhóm STPV đã ở vị trí cuối cùng",
                                "info",
                              );
                            }
                          }}
                          className={`font-semibold text-[13px] px-3.5 h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors border flex-shrink-0 min-w-[84px] ${
                            selectedStpvRowId
                              ? "bg-white hover:bg-gray-50 border-[#D5D7DA] text-[#101828]"
                              : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                          }`}
                        >
                          Xuống
                        </button>

                        {/* 💠 Far-right utility icons (Nạp, Giúp) */}
                        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                          <button
                            onClick={() => {
                              onNotification(
                                "Đang làm mới danh sách sở thích phục vụ...",
                                "info",
                              );
                            }}
                            className="w-8 h-8 flex items-center justify-center border border-[#D5D7DA] hover:bg-gray-50 text-[#717680] rounded-[8px] bg-white transition-colors cursor-pointer"
                            title="Tải lại (Nạp)"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              onNotification(
                                "Đang mở tài liệu hướng dẫn sở thích phục vụ",
                                "info",
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border border-[#D5D7DA] hover:bg-gray-50 text-[#717680] rounded-[8px] bg-white transition-colors cursor-pointer"
                            title="Hướng dẫn (Giúp)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-help-circle"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                              <line x1="12" x2="12.01" y1="17" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Content Table (Nội dung bảng) */}
                      {(() => {
                        const filteredOptionGroups = optionGroups.filter(
                          (group) => {
                            const matchesSearch = group.name
                              .toLowerCase()
                              .includes(optionGroupSearchQuery.toLowerCase());
                            const matchesFilterName =
                              !stpvFilterName ||
                              group.name
                                .toLowerCase()
                                .includes(stpvFilterName.toLowerCase());

                            let matchesFilterRequired = true;
                            if (stpvFilterRequired === "yes") {
                              matchesFilterRequired = group.required === true;
                            } else if (stpvFilterRequired === "no") {
                              matchesFilterRequired = group.required === false;
                            }

                            const matchesFilterMaxSelect =
                              !stpvFilterMaxSelect ||
                              group.maxSelect
                                .toString()
                                .includes(stpvFilterMaxSelect);

                            let matchesFilterStatus = true;
                            if (
                              stpvFilterStatus &&
                              stpvFilterStatus !== "all"
                            ) {
                              matchesFilterStatus =
                                group.status === stpvFilterStatus;
                            }

                            let matchesFilterLinked = true;
                            if (stpvFilterLinked) {
                              const isL = !!group.linkedGroupId;
                              if (stpvFilterLinked === "linked") {
                                matchesFilterLinked = isL;
                              } else if (stpvFilterLinked === "unlinked") {
                                matchesFilterLinked = !isL;
                              }
                            }

                            return (
                              matchesSearch &&
                              matchesFilterName &&
                              matchesFilterRequired &&
                              matchesFilterMaxSelect &&
                              matchesFilterStatus &&
                              matchesFilterLinked
                            );
                          },
                        );

                        const totalItems = filteredOptionGroups.length;
                        const totalPages =
                          Math.ceil(totalItems / optionGroupPageSize) || 1;
                        const currentPage = Math.min(
                          optionGroupPage,
                          totalPages,
                        );
                        const startItem =
                          totalItems > 0
                            ? (currentPage - 1) * optionGroupPageSize + 1
                            : 0;
                        const endItem = Math.min(
                          currentPage * optionGroupPageSize,
                          totalItems,
                        );
                        const paginatedItems = filteredOptionGroups.slice(
                          (currentPage - 1) * optionGroupPageSize,
                          currentPage * optionGroupPageSize,
                        );

                        return (
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto">
                              <table className="w-full text-left border-collapse select-none">
                                <thead className="sticky top-0 bg-[#FAFAFA] z-10 border-b border-[#E9EAEB]">
                                  <tr className="bg-[#FAFAFA] select-none text-[13px] text-[#101828] font-semibold align-middle">
                                    {/* Nhóm sở thích phục vụ - Text type (Image 1 style) */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Nhóm sở thích phục vụ
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="flex items-center w-full">
                                            <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                              *
                                            </div>
                                            <input
                                              type="text"
                                              value={stpvFilterName}
                                              onChange={(e) => {
                                                setStpvFilterName(
                                                  e.target.value,
                                                );
                                                setOptionGroupPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Bắt buộc chọn nhóm STPV - Status type (Image 3 style) */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-60 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans whitespace-nowrap">
                                            Bắt buộc chọn nhóm STPV
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="relative w-full">
                                            <select
                                              value={stpvFilterRequired}
                                              onChange={(e) => {
                                                setStpvFilterRequired(
                                                  e.target.value,
                                                );
                                                setOptionGroupPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans appearance-none pr-6"
                                            >
                                              <option value=""></option>
                                              <option value="yes">
                                                Bắt buộc
                                              </option>
                                              <option value="no">
                                                Không bắt buộc
                                              </option>
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                              <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2.5}
                                                  d="M19 9l-7 7-7-7"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Số lượng STPV được chọn tối đa - Number type (Image 2 style) */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-80 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans whitespace-nowrap">
                                            Số lượng STPV được chọn tối đa
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="flex items-center w-full">
                                            <div className="h-7 w-7 border border-[#D5D7DA] border-r-0 rounded-l-[4px] bg-[#F3F4F6] text-[#101828] text-[12px] flex items-center justify-center font-bold select-none flex-shrink-0">
                                              ≤
                                            </div>
                                            <input
                                              type="text"
                                              value={stpvFilterMaxSelect}
                                              onChange={(e) => {
                                                setStpvFilterMaxSelect(
                                                  e.target.value,
                                                );
                                                setOptionGroupPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-r-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Trạng thái - Status type (Image 3 style) */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-48 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Trạng thái
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="relative w-full">
                                            <select
                                              value={stpvFilterStatus}
                                              onChange={(e) => {
                                                setStpvFilterStatus(
                                                  e.target.value,
                                                );
                                                setOptionGroupPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans appearance-none pr-6"
                                            >
                                              <option value=""></option>
                                              <option value="Sử dụng">
                                                Sử dụng
                                              </option>
                                              <option value="Ngừng sử dụng">
                                                Ngừng sử dụng
                                              </option>
                                              <option value="Ẩn">Ẩn</option>
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                              <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2.5}
                                                  d="M19 9l-7 7-7-7"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Trạng thái liên kết - Status type */}
                                    <th className="px-4 py-2 border-r border-[#E9EAEB] text-center w-48 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Trạng thái liên kết
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0">
                                          <div className="relative w-full">
                                            <select
                                              value={stpvFilterLinked}
                                              onChange={(e) => {
                                                setStpvFilterLinked(
                                                  e.target.value,
                                                );
                                                setOptionGroupPage(1);
                                              }}
                                              className="w-full h-7 px-2 text-[12px] border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans appearance-none pr-6"
                                            >
                                              <option value="">Tất cả</option>
                                              <option value="linked">
                                                Đã liên kết
                                              </option>
                                              <option value="unlinked">
                                                Chưa liên kết
                                              </option>
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                              <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2.5}
                                                  d="M19 9l-7 7-7-7"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </th>

                                    {/* Thao tác */}
                                    <th className="px-4 py-2 text-center w-28 align-middle">
                                      <div className="flex flex-col justify-between items-center h-[76px] w-full">
                                        <div className="flex-1 flex items-center justify-center text-center w-full leading-tight">
                                          <span className="font-semibold text-[#101828] font-sans">
                                            Thao tác
                                          </span>
                                        </div>
                                        <div className="w-full mt-1.5 flex-shrink-0 h-7 flex items-center justify-center text-[11px] text-[#717680] font-normal">
                                          <select
                                            disabled
                                            className="w-full h-7 px-2 text-[12px] border border-[#E9EAEB] rounded-[4px] bg-[#F7F7F8] text-[#717680] outline-none font-sans appearance-none"
                                          >
                                            <option value="">Lọc</option>
                                          </select>
                                        </div>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {totalItems === 0 ? (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="py-12 text-center text-[#A4A7AE] text-[13px]"
                                      >
                                        Không tìm thấy kết quả phù hợp
                                      </td>
                                    </tr>
                                  ) : (
                                    paginatedItems.map((group) => {
                                      const isSelected =
                                        selectedStpvRowId === group.id;
                                      return (
                                        <tr
                                          key={group.id}
                                          onClick={() =>
                                            setSelectedStpvRowId(
                                              isSelected ? null : group.id,
                                            )
                                          }
                                          className={`group border-b border-[#E9EAEB] transition-colors h-14 cursor-pointer text-[13px] ${
                                            isSelected
                                              ? "bg-[#DDEAFC]"
                                              : "hover:bg-[#F0F6FE]"
                                          }`}
                                        >
                                          {/* Tên nhóm */}
                                          <td className="px-4 font-normal text-[#101828] border-r border-[#E9EAEB] text-left">
                                            {group.name}
                                          </td>

                                          {/* Bắt buộc chọn (Checkbox display - ONLY UNCHECKED DISABLED) */}
                                          <td
                                            className="px-4 text-center border-r border-[#E9EAEB]"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <div className="flex items-center justify-center">
                                              <input
                                                type="checkbox"
                                                checked={group.required}
                                                disabled={!group.required}
                                                readOnly={group.required}
                                                className={`w-4.5 h-4.5 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] ${
                                                  group.required
                                                    ? "cursor-default pointer-events-none opacity-100"
                                                    : "cursor-not-allowed opacity-40"
                                                }`}
                                                onClick={(e) => {
                                                  if (group.required) {
                                                    e.preventDefault();
                                                  }
                                                }}
                                              />
                                            </div>
                                          </td>

                                          {/* Tối đa chọn */}
                                          <td className="px-4 text-right font-normal text-[#101828] font-sans border-r border-[#E9EAEB]">
                                            {group.maxSelect}
                                          </td>

                                          {/* Trạng thái */}
                                          <td className="px-4 text-left border-r border-[#E9EAEB]">
                                            {group.status === "Sử dụng" ? (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#12B76A] flex-shrink-0"></span>
                                                <span className="text-[#12B76A]">
                                                  Sử dụng
                                                </span>
                                              </span>
                                            ) : group.status ===
                                              "Ngừng sử dụng" ? (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#F04438] flex-shrink-0"></span>
                                                <span className="text-[#F04438]">
                                                  Ngừng sử dụng
                                                </span>
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#717680] flex-shrink-0"></span>
                                                <span className="text-[#717680]">
                                                  Ẩn
                                                </span>
                                              </span>
                                            )}
                                          </td>

                                          {/* Trạng thái liên kết - Trạng thái (Căn trái) */}
                                          <td className="px-4 text-left border-r border-[#E9EAEB]">
                                            {group.linkedGroupId ? (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#12B76A] flex-shrink-0"></span>
                                                <span className="text-[#12B76A]">
                                                  Đã liên kết
                                                </span>
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold">
                                                <span className="w-2 h-2 rounded-full bg-[#717680] flex-shrink-0"></span>
                                                <span className="text-[#717680]">
                                                  Chưa liên kết
                                                </span>
                                              </span>
                                            )}
                                          </td>

                                          {/* Thao tác */}
                                          <td className="px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2">
                                              {group.linkedGroupId ? (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOptionGroups(prev => prev.map(g => g.id === group.id ? { ...g, linkedGroupId: "" } : g));
                                                    setWizardStpvGroups(prev => prev.map(g => g.name === group.name ? { ...g, linkedGroupId: "" } : g));
                                                    setWizardStpv(prev => prev.map(s => s.group === group.name ? { ...s, linkedGroupId: "" } : s));
                                                    onNotification(`Đã hủy liên kết tất cả các STPV con trong nhóm "${group.name}"`, "success");
                                                  }}
                                                  className="p-1.5 hover:bg-gray-100 rounded-lg text-[#717680] hover:text-[#101828] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                                  title="Hủy liên kết"
                                                >
                                                  <Unlink className="w-4 h-4" />
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setLinkingShopeeOptionGroupId(group.id);
                                                    setSelectedCukCukOptionGroupId(null);
                                                    setOptionGroupPopupSearch("");
                                                    setIsLinkCukCukOptionGroupModalOpen(true);
                                                  }}
                                                  className="p-1.5 hover:bg-[#EDFCF4] rounded-lg text-[#245FDF] hover:text-[#1B4EBA] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                                                  title="Liên kết"
                                                >
                                                  <Link className="w-4 h-4" />
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* 💠 DataTable Pagination (Thanh phân trang) - Matches "Thực đơn" exactly */}
                            <div className="h-11 px-4 bg-[#F8F9FA] border-t border-[#E9EAEB] flex items-center justify-between flex-shrink-0 text-[13px] text-[#717680] select-none rounded-b-xl">
                              {/* Left group of pagination controls */}
                              <div className="flex items-center gap-3">
                                {/* First page button */}
                                <button
                                  disabled={currentPage === 1}
                                  onClick={() => setOptionGroupPage(1)}
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
                                  title="Trang đầu"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
                                  </svg>
                                </button>

                                {/* Prev page button */}
                                <button
                                  disabled={currentPage === 1}
                                  onClick={() =>
                                    setOptionGroupPage((prev) =>
                                      Math.max(prev - 1, 1),
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
                                  title="Trang trước"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m15 18-6-6 6-6" />
                                  </svg>
                                </button>

                                <div className="flex items-center text-[13px]">
                                  <span>Trang</span>
                                  <input
                                    type="text"
                                    value={currentPage}
                                    readOnly
                                    className="w-8 h-6 mx-1.5 text-center border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] outline-none font-sans font-medium focus:border-[#245FDF]"
                                  />
                                  <span>trên {totalPages}</span>
                                </div>

                                {/* Next page button */}
                                <button
                                  disabled={currentPage >= totalPages}
                                  onClick={() =>
                                    setOptionGroupPage((prev) =>
                                      Math.min(prev + 1, totalPages),
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
                                  title="Trang sau"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m9 18 6-6-6-6" />
                                  </svg>
                                </button>

                                {/* Last page button */}
                                <button
                                  disabled={currentPage >= totalPages}
                                  onClick={() => setOptionGroupPage(totalPages)}
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
                                  title="Trang cuối"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                                  </svg>
                                </button>

                                {/* Refresh button */}
                                <button
                                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#717680] cursor-pointer bg-transparent border-none ml-1"
                                  onClick={() => {
                                    onNotification(
                                      "Đã tải lại danh sách sở thích phục vụ",
                                      "success",
                                    );
                                  }}
                                  title="Tải lại"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>

                                {/* Dropdown page size */}
                                <div className="ml-2">
                                  <select
                                    value={optionGroupPageSize}
                                    onChange={(e) => {
                                      setOptionGroupPageSize(
                                        Number(e.target.value),
                                      );
                                      setOptionGroupPage(1);
                                    }}
                                    className="h-6 border border-[#D5D7DA] rounded-[4px] bg-white text-[12px] px-1 outline-none text-[#101828] font-medium font-sans"
                                  >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                  </select>
                                </div>
                              </div>

                              {/* Right part: item status */}
                              <div className="font-sans font-medium text-[#101828]">
                                Hiển thị {startItem} - {endItem} trên{" "}
                                {totalItems} kết quả
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : shopeeActiveSegment === "lich-ban" ? (
                    /* Tab 4: Lịch bán món (Copy of "Lịch áp dụng thực đơn") */
                    <div
                      className="bg-white rounded-xl border border-[#E9EAEB] flex flex-col flex-1 overflow-auto p-6 text-left"
                      style={{ boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)" }}
                    >
                      <div className="space-y-6 w-full">
                        {/* Section 2: Lịch áp dụng thực đơn */}
                        <div className="space-y-4 w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="text-[#101828] font-bold text-[14px] m-0">
                                Lịch áp dụng thực đơn
                              </h4>
                              <div className="group relative inline-block">
                                <HelpCircle className="w-4.5 h-4.5 text-[#717680] hover:text-[#245FDF] cursor-help transition-colors" />
                                {/* Tooltip box */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-3 bg-[#101828] text-white text-[12px] font-normal leading-relaxed rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[99999] shadow-lg pointer-events-none text-left">
                                  Thiết lập các khung giờ bán món cho các món thực đơn cụ thể. Ví dụ: Bữa sáng(Bún, Phở,...), Bữa trưa(Cơm văn phòng,...), Bữa tối(Nhậu, Nướng,...)
                                  {/* Arrow */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#101828]"></div>
                                </div>
                              </div>
                              {!isLichBanEditing && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOriginalMenuApplyType(shopeeMenuApplyType);
                                    setOriginalTimeGroups([...shopeeTimeGroups]);
                                    setIsLichBanEditing(true);
                                  }}
                                  className="ml-1 p-1 hover:bg-gray-100 rounded text-[#717680] hover:text-[#245FDF] transition-colors cursor-pointer bg-transparent border-none flex items-center justify-center"
                                  title="Chỉnh sửa lịch áp dụng"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {isLichBanEditing && (
                              <div className="flex items-center gap-2 select-none">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Revert
                                    if (originalMenuApplyType) {
                                      setShopeeMenuApplyType(originalMenuApplyType as any);
                                    }
                                    if (originalTimeGroups) {
                                      setShopeeTimeGroups(originalTimeGroups);
                                    }
                                    setIsLichBanEditing(false);
                                  }}
                                  className="h-[32px] px-3.5 border border-[#D5D7DA] hover:bg-gray-50 text-[#475467] rounded-lg text-[13px] font-semibold transition-all cursor-pointer bg-white flex items-center justify-center"
                                >
                                  Hủy
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsLichBanEditing(false);
                                    onNotification("Đã lưu lịch bán món thành công!", "success");
                                  }}
                                  className="h-[32px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white rounded-lg text-[13px] font-semibold transition-all cursor-pointer border-none shadow-sm flex items-center justify-center"
                                >
                                  Lưu
                                </button>
                              </div>
                            )}
                          </div>

                            <div className="border border-[#E9EAEB] rounded-xl overflow-hidden bg-white shadow-sm">
                              <table className="w-full border-collapse text-left text-[13px]">
                                <thead>
                                  <tr className="bg-[#F8F9FA] border-b border-[#E9EAEB] text-[#475467] font-semibold">
                                    <th className="px-4 py-3 border-r border-[#E9EAEB] font-semibold text-[#344054] w-[25%]">
                                      Tên khung giờ
                                    </th>
                                    <th className="px-4 py-3 border-r border-[#E9EAEB] font-semibold text-[#344054] w-[40%]">
                                      Khung giờ hoạt động
                                    </th>
                                    <th className="px-4 py-3 border-r border-[#E9EAEB] font-semibold text-[#344054] w-[30%]">
                                      Nhóm thực đơn áp dụng
                                    </th>
                                    {isLichBanEditing && (
                                      <th className="px-4 py-3 font-semibold text-[#344054] w-[5%] text-center"></th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E9EAEB] text-[#344054]">
                                  {shopeeTimeGroups.map((group) => (
                                    <tr
                                      key={group.id}
                                      className="hover:bg-gray-50/50 transition-colors"
                                    >
                                      <td className="px-4 py-3.5 border-r border-[#E9EAEB] font-semibold text-[#101828]">
                                        {group.name}
                                      </td>
                                      <td className="px-4 py-3.5 border-r border-[#E9EAEB] text-[#475467]">
                                        {group.timeRange}
                                      </td>
                                      <td className="px-4 py-3.5 border-r border-[#E9EAEB] text-[#475467]">
                                        {group.menuGroups}
                                      </td>
                                      {isLichBanEditing && (
                                        <td className="px-4 py-3.5 text-center">
                                          <div className="flex items-center justify-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleOpenEditTimeGroup(group)
                                              }
                                              className="p-1.5 hover:bg-gray-100 rounded text-[#475467] hover:text-[#101828] transition-colors cursor-pointer bg-transparent border-none"
                                              title="Sửa"
                                            >
                                              <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleDeleteTimeGroup(group.id)
                                              }
                                              className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-colors cursor-pointer bg-transparent border-none"
                                              title="Xóa"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                  {shopeeTimeGroups.length === 0 && (
                                    <tr>
                                      <td
                                        colSpan={isLichBanEditing ? 4 : 3}
                                        className="text-center py-8 text-[#717680] font-sans"
                                      >
                                        Chưa cấu hình khung giờ thay đổi nào. Vui
                                        lòng bấm "Thêm khung giờ" để thiết lập.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {isLichBanEditing && (
                              <div className="flex justify-start">
                                <button
                                  type="button"
                                  onClick={handleOpenAddTimeGroup}
                                  className="px-4 h-[32px] border border-[#245FDF] text-[#245FDF] hover:bg-[#F0F6FE] rounded-lg text-[13px] font-semibold transition-all cursor-pointer bg-white flex items-center gap-1.5"
                                  style={{ minWidth: "84px" }}
                                >
                                  <Plus className="w-4 h-4" />
                                  Thêm khung giờ
                                </button>
                              </div>
                            )}
                          </div>
                      </div>
                    </div>
                  ) : (
                    /* Other segments are empty */
                    <div
                      className="flex-1 bg-white rounded-xl border border-[#E9EAEB] flex flex-col items-center justify-center p-12"
                      style={{ boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)" }}
                    >
                      <span className="text-[#A4A7AE] text-[13px] font-medium">
                        Tạm thời không có nội dung
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Tab 2: Thiết lập (Redesigned with Left Sidebar and Right Content Panel) */
                <div className="flex-1 flex bg-white rounded-xl border border-[#E9EAEB] overflow-hidden" style={{ boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)" }}>
                  {/* Left sub-tab Sidebar */}
                  <div className="w-[240px] border-r border-[#E9EAEB] bg-[#FAFAFA] flex flex-col p-3 gap-1 flex-shrink-0 select-none">
                    <button
                      onClick={() => setShopeeSettingsSubTab("operating_hours")}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer border-none ${
                        shopeeSettingsSubTab === "operating_hours"
                          ? "bg-[#EDFCF4] text-[#245FDF]"
                          : "text-[#101828] hover:bg-[#EDFCF4]/50 hover:text-[#245FDF] bg-transparent"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Thời gian hoạt động</span>
                    </button>
                    <button
                      onClick={() => setShopeeSettingsSubTab("order_settings")}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer border-none ${
                        shopeeSettingsSubTab === "order_settings"
                          ? "bg-[#EDFCF4] text-[#245FDF]"
                          : "text-[#101828] hover:bg-[#EDFCF4]/50 hover:text-[#245FDF] bg-transparent"
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Cài đặt đơn hàng</span>
                    </button>
                  </div>

                  {/* Right Content Panel */}
                  <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-white">
                    {shopeeSettingsSubTab === "operating_hours" && (
                      <div className="space-y-6 animate-fade-in text-left">
                        {/* Section Header */}
                        <div className="flex items-center gap-2 pb-4 border-b border-[#E9EAEB]">
                          <h3 className="text-[#101828] font-semibold text-[16px] font-sans flex items-center gap-2 m-0">
                            Thời gian hoạt động
                            <Pencil
                              className={`w-4 h-4 cursor-pointer transition-colors ${
                                isEditingOperatingHours
                                  ? "text-[#245FDF]"
                                  : "text-[#717680] hover:text-[#245FDF]"
                              }`}
                              onClick={() => {
                                if (!isEditingOperatingHours) {
                                  setBackupOperatingDays(JSON.parse(JSON.stringify(shopeeOperatingDays)));
                                  setBackupHolidaySetting(shopeeHolidaySetting);
                                  setBackupHolidays(JSON.parse(JSON.stringify(shopeeHolidays)));
                                  setIsEditingOperatingHours(true);
                                }
                              }}
                            />
                          </h3>
                        </div>

                        {/* operating hours list */}
                        <div className="space-y-3.5 max-w-[600px] bg-white p-5 rounded-xl">
                          {shopeeOperatingDays.map((day) => (
                            <div
                              key={day.id}
                              className="flex items-start gap-4 text-[13px] text-[#101828]"
                            >
                              <span className="font-semibold select-none w-10 mt-2 font-sans">
                                {day.name}
                              </span>

                              <div className="flex-1 space-y-2">
                                {day.ranges.map((range: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3"
                                  >
                                    {idx === 0 ? (
                                      <select
                                        disabled={!isEditingOperatingHours}
                                        value={day.active ? "open" : "closed"}
                                        onChange={(e) => {
                                          if (isEditingOperatingHours) {
                                            const active = e.target.value === "open";
                                            setShopeeOperatingDays((prev) =>
                                              prev.map((d) =>
                                                d.id === day.id ? { ...d, active } : d,
                                              ),
                                            );
                                          }
                                        }}
                                        className="h-8 w-[100px] px-2.5 border border-[#D5D7DA] rounded-[8px] text-[#101828] text-[13px] font-medium focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 outline-none bg-white cursor-pointer font-sans disabled:bg-[#FAFAFA] disabled:text-[#717680] disabled:cursor-not-allowed"
                                      >
                                        <option value="open">Mở cửa</option>
                                        <option value="closed">Đóng cửa</option>
                                      </select>
                                    ) : (
                                      <div className="w-[100px]" />
                                    )}

                                    <div className={`flex items-center gap-3 transition-opacity ${day.active ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                                    <span className="text-[#717680] text-[13px] w-6">
                                      Từ
                                    </span>
                                    <input
                                      type="text"
                                      disabled={!isEditingOperatingHours || !day.active}
                                      value={range.from}
                                      onChange={(e) => {
                                        if (isEditingOperatingHours) {
                                          handleTimeChange(
                                            day.id,
                                            idx,
                                            "from",
                                            e.target.value,
                                          );
                                        }
                                      }}
                                      className="w-24 h-[32px] px-3 border border-[#D5D7DA] rounded-[8px] text-[#101828] text-center font-medium focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 outline-none bg-white font-sans disabled:bg-[#FAFAFA] disabled:text-[#717680] disabled:cursor-not-allowed"
                                    />
                                    <span className="text-[#717680] text-[13px] w-8 text-center">
                                      Đến
                                    </span>
                                    <input
                                      type="text"
                                      disabled={!isEditingOperatingHours || !day.active}
                                      value={range.to}
                                      onChange={(e) => {
                                        if (isEditingOperatingHours) {
                                          handleTimeChange(
                                            day.id,
                                            idx,
                                            "to",
                                            e.target.value,
                                          );
                                        }
                                      }}
                                      className="w-24 h-[32px] px-3 border border-[#D5D7DA] rounded-[8px] text-[#101828] text-center font-medium focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 outline-none bg-white font-sans disabled:bg-[#FAFAFA] disabled:text-[#717680] disabled:cursor-not-allowed"
                                    />

                                    {idx === 0 ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isEditingOperatingHours) {
                                            handleAddHourRange(day.id);
                                          }
                                        }}
                                        disabled={!isEditingOperatingHours || !day.active}
                                        className="w-[32px] h-[32px] border border-[#245FDF] text-[#245FDF] hover:bg-[#EDFCF4] disabled:opacity-30 disabled:pointer-events-none rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-semibold bg-transparent"
                                      >
                                        +
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isEditingOperatingHours) {
                                            handleRemoveHourRange(day.id, idx);
                                          }
                                        }}
                                        disabled={!isEditingOperatingHours || !day.active}
                                        className="w-[32px] h-[32px] border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:pointer-events-none rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-semibold bg-transparent"
                                      >
                                        -
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              </div>
                            </div>
                          ))}

                          <div className="pt-2 border-t border-[#E9EAEB] mt-3">
                            <button
                              type="button"
                              disabled={!isEditingOperatingHours}
                              onClick={handleQuickSetup}
                              className="h-[32px] min-w-[84px] bg-white border border-[#245FDF] hover:bg-[#EDFCF4] text-[#245FDF] text-xs font-semibold rounded-[8px] px-4 transition-all cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                            >
                              Thiết lập nhanh
                            </button>
                          </div>
                        </div>

                        {/* Holiday Setting Section */}
                        <div className="max-w-[600px] p-5 space-y-4 bg-white">
                          <label className={`flex items-start gap-3 cursor-pointer select-none ${!isEditingOperatingHours ? "cursor-not-allowed" : ""}`}>
                            <input
                              type="checkbox"
                              disabled={!isEditingOperatingHours}
                              checked={shopeeHolidaySetting}
                              onChange={() => {
                                if (isEditingOperatingHours) {
                                  setShopeeHolidaySetting(!shopeeHolidaySetting);
                                }
                              }}
                              className="h-4.5 w-4.5 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <div>
                              <span className="font-semibold text-[13px] text-[#101828] block">Cài đặt ngày lễ / Ngày nghỉ tạm thời</span>
                              <span className="text-xs text-[#717680]">Thiết lập trước những ngày nhà hàng sẽ ngừng nhận đơn trên ShopeeFood trong năm (ngày nghỉ lễ, ngày bảo trì, Tết...).</span>
                            </div>
                          </label>

                          {shopeeHolidaySetting && (
                            <div className="pl-7 space-y-3 pt-2 border-t border-gray-100 animate-fade-in text-[13px]">
                              <div className="space-y-2">
                                {shopeeHolidays.map((holiday, hIdx) => (
                                  <div key={holiday.id} className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg">
                                    <div className="flex-1 min-w-[150px]">
                                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Tên kỳ nghỉ</label>
                                      <input
                                        type="text"
                                        disabled={!isEditingOperatingHours}
                                        value={holiday.name}
                                        onChange={(e) => {
                                          if (isEditingOperatingHours) {
                                            const val = e.target.value;
                                            setShopeeHolidays(prev => prev.map(h => h.id === holiday.id ? { ...h, name: val } : h));
                                          }
                                        }}
                                        className="w-full h-[32px] px-3 border border-[#D5D7DA] rounded-[8px] text-[#101828] font-medium outline-none bg-white text-xs disabled:bg-gray-50 disabled:text-[#717680] disabled:cursor-not-allowed"
                                        placeholder="Ví dụ: Tết Nguyên Đán"
                                      />
                                    </div>
                                    <div className="w-[120px]">
                                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Từ ngày</label>
                                      <input
                                        type="date"
                                        disabled={!isEditingOperatingHours}
                                        value={holiday.from}
                                        onChange={(e) => {
                                          if (isEditingOperatingHours) {
                                            const val = e.target.value;
                                            setShopeeHolidays(prev => prev.map(h => h.id === holiday.id ? { ...h, from: val } : h));
                                          }
                                        }}
                                        className="w-full h-[32px] px-2 border border-[#D5D7DA] rounded-[8px] text-[#101828] font-medium outline-none bg-white text-xs disabled:bg-gray-50 disabled:text-[#717680] disabled:cursor-not-allowed"
                                      />
                                    </div>
                                    <div className="w-[120px]">
                                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Đến ngày</label>
                                      <input
                                        type="date"
                                        disabled={!isEditingOperatingHours}
                                        value={holiday.to}
                                        onChange={(e) => {
                                          if (isEditingOperatingHours) {
                                            const val = e.target.value;
                                            setShopeeHolidays(prev => prev.map(h => h.id === holiday.id ? { ...h, to: val } : h));
                                          }
                                        }}
                                        className="w-full h-[32px] px-2 border border-[#D5D7DA] rounded-[8px] text-[#101828] font-medium outline-none bg-white text-xs disabled:bg-gray-50 disabled:text-[#717680] disabled:cursor-not-allowed"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      disabled={!isEditingOperatingHours}
                                      onClick={() => {
                                        if (isEditingOperatingHours) {
                                          setShopeeHolidays(prev => prev.filter(h => h.id !== holiday.id));
                                          onNotification("Đã xóa thiết lập nghỉ lễ", "info");
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors mt-5 bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}

                                {shopeeHolidays.length === 0 && (
                                  <p className="text-gray-400 italic text-xs py-2">Chưa thiết lập ngày nghỉ lễ nào. Vui lòng thêm bên dưới.</p>
                                )}
                              </div>

                              <button
                                type="button"
                                disabled={!isEditingOperatingHours}
                                onClick={() => {
                                  if (isEditingOperatingHours) {
                                    const newId = Date.now();
                                    setShopeeHolidays(prev => [...prev, { id: newId, name: "Kỳ nghỉ mới", from: "2026-06-28", to: "2026-06-28" }]);
                                  }
                                }}
                                className="flex items-center gap-1.5 text-xs text-[#245FDF] hover:text-[#1849b2] font-semibold transition-all bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                                Thêm ngày nghỉ lễ
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Save / Cancel controls for operating hours edit mode */}
                        {isEditingOperatingHours && (
                          <div className="flex items-center gap-3 pt-4 border-t border-[#E9EAEB] max-w-[600px]">
                            <button
                              type="button"
                              onClick={() => {
                                setShopeeOperatingDays(backupOperatingDays);
                                setShopeeHolidaySetting(backupHolidaySetting);
                                setShopeeHolidays(backupHolidays);
                                setIsEditingOperatingHours(false);
                                onNotification("Đã hủy bỏ thay đổi thời gian hoạt động", "info");
                              }}
                              className="h-[32px] px-4 bg-white border border-[#D5D7DA] text-[#101828] hover:bg-gray-50 text-[13px] font-medium rounded-[8px] cursor-pointer font-sans"
                            >
                              Hủy bỏ
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingOperatingHours(false);
                                onNotification("Đã lưu thiết lập thời gian hoạt động thành công!", "success");
                              }}
                              className="h-[32px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white text-[13px] font-medium rounded-[8px] cursor-pointer font-sans border-none shadow-sm"
                            >
                              Lưu
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {shopeeSettingsSubTab === "order_settings" && (
                      <div className="space-y-6 animate-fade-in text-left max-w-[600px]">
                        {/* Section Header */}
                        <div className="flex items-center gap-2 pb-4 border-b border-[#E9EAEB]">
                          <h3 className="text-[#101828] font-semibold text-[16px] font-sans flex items-center gap-2 m-0">
                            Cài đặt đơn hàng
                            <Pencil
                              className={`w-4 h-4 cursor-pointer transition-colors ${
                                isEditingOrderSettings
                                  ? "text-[#245FDF]"
                                  : "text-[#717680] hover:text-[#245FDF]"
                              }`}
                              onClick={() => {
                                if (!isEditingOrderSettings) {
                                  setBackupAutoConfirmOrder(shopeeAutoConfirmOrder);
                                  setBackupAutoConfirmType(shopeeAutoConfirmType);
                                  setBackupAutoPrintReceipt(shopeeAutoPrintReceipt);
                                  setBackupAutoPrintTrigger(shopeeAutoPrintTrigger);
                                  setIsEditingOrderSettings(true);
                                }
                              }}
                            />
                          </h3>
                        </div>

                        {/* Config Toggles & Radio Options */}
                        <div className="space-y-5">
                          {/* Toggle A: Tự động xác nhận Order */}
                          <div className="p-5 space-y-4 bg-white">
                            <label className={`flex items-start gap-3 cursor-pointer select-none ${!isEditingOrderSettings ? "cursor-not-allowed" : ""}`}>
                              <input
                                type="checkbox"
                                disabled={!isEditingOrderSettings}
                                checked={shopeeAutoConfirmOrder}
                                onChange={() => {
                                  if (isEditingOrderSettings) {
                                    setShopeeAutoConfirmOrder(!shopeeAutoConfirmOrder);
                                  }
                                }}
                                className="h-4.5 w-4.5 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <div>
                                <span className="font-semibold text-[13px] text-[#101828] block">Tự động xác nhận Order</span>
                                <span className="text-xs text-[#717680]">Hệ thống POS tự động phản hồi xác nhận đơn hàng khi nhận được Order đồng bộ từ ShopeeFood.</span>
                              </div>
                            </label>

                            {shopeeAutoConfirmOrder && (
                              <div className="pl-7 space-y-3 pt-3 border-t border-gray-100 animate-fade-in text-[13px]">
                                <div className="space-y-3">
                                  <label className={`flex items-start gap-3 cursor-pointer ${!isEditingOrderSettings ? "cursor-not-allowed" : ""}`}>
                                    <input
                                      type="radio"
                                      name="confirm_type"
                                      disabled={!isEditingOrderSettings}
                                      checked={shopeeAutoConfirmType === "all"}
                                      onChange={() => {
                                        if (isEditingOrderSettings) {
                                          setShopeeAutoConfirmType("all");
                                        }
                                      }}
                                      className="h-4 w-4 text-[#245FDF] border-gray-300 focus:ring-[#245FDF] cursor-pointer mt-0.5 disabled:opacity-50"
                                    />
                                    <div>
                                      <span className="font-semibold text-[#101828]">Tất cả đơn hàng</span>
                                      <span className="block text-xs text-[#717680] mt-0.5">Tất cả đơn hàng đồng bộ về POS đều được tự động xác nhận</span>
                                    </div>
                                  </label>

                                  <label className={`flex items-start gap-3 cursor-pointer ${!isEditingOrderSettings ? "cursor-not-allowed" : ""}`}>
                                    <input
                                      type="radio"
                                      name="confirm_type"
                                      disabled={!isEditingOrderSettings}
                                      checked={shopeeAutoConfirmType === "paid"}
                                      onChange={() => {
                                        if (isEditingOrderSettings) {
                                          setShopeeAutoConfirmType("paid");
                                        }
                                      }}
                                      className="h-4 w-4 text-[#245FDF] border-gray-300 focus:ring-[#245FDF] cursor-pointer mt-0.5 disabled:opacity-50"
                                    />
                                    <div>
                                      <span className="font-semibold text-[#101828]">Đơn hàng đã thanh toán</span>
                                      <span className="block text-xs text-[#717680] mt-0.5">Chỉ những Order được thanh toán rồi mới được xác nhận</span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Toggle B: Tự động in hóa đơn tạm tính */}
                          <div className="p-5 space-y-4 bg-white">
                            <label className={`flex items-start gap-3 cursor-pointer select-none ${!isEditingOrderSettings ? "cursor-not-allowed" : ""}`}>
                              <input
                                type="checkbox"
                                disabled={!isEditingOrderSettings}
                                checked={shopeeAutoPrintReceipt}
                                onChange={() => {
                                  if (isEditingOrderSettings) {
                                    setShopeeAutoPrintReceipt(!shopeeAutoPrintReceipt);
                                  }
                                }}
                                className="h-4.5 w-4.5 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <div>
                                <span className="font-semibold text-[13px] text-[#101828] block">Tự động in hóa đơn tạm tính</span>
                                <span className="text-xs text-[#717680]">Tự động xuất hóa đơn tạm tính qua máy in liên kết của nhà hàng khi có đơn mới.</span>
                              </div>
                            </label>

                            {shopeeAutoPrintReceipt && (
                              <div className="pl-7 space-y-3 pt-3 border-t border-gray-100 animate-fade-in text-[13px]">
                                <div className="space-y-3">
                                  <label className={`flex items-start gap-3 cursor-pointer ${!isEditingOrderSettings ? "cursor-not-allowed" : ""}`}>
                                    <input
                                      type="radio"
                                      name="print_trigger"
                                      disabled={!isEditingOrderSettings}
                                      checked={shopeeAutoPrintTrigger === "confirmed"}
                                      onChange={() => {
                                        if (isEditingOrderSettings) {
                                          setShopeeAutoPrintTrigger("confirmed");
                                        }
                                      }}
                                      className="h-4 w-4 text-[#245FDF] border-gray-300 focus:ring-[#245FDF] cursor-pointer mt-0.5 disabled:opacity-50"
                                    />
                                    <div>
                                      <span className="font-semibold text-[#101828]">Khi đơn hàng được xác nhận</span>
                                      <span className="block text-xs text-[#717680] mt-0.5">In hóa đơn ngay khi đơn được ghi nhận và xác nhận trên POS.</span>
                                    </div>
                                  </label>

                                  <label className={`flex items-start gap-3 cursor-pointer ${!isEditingOrderSettings ? "cursor-not-allowed" : ""}`}>
                                    <input
                                      type="radio"
                                      name="print_trigger"
                                      disabled={!isEditingOrderSettings}
                                      checked={shopeeAutoPrintTrigger === "kitchen"}
                                      onChange={() => {
                                        if (isEditingOrderSettings) {
                                          setShopeeAutoPrintTrigger("kitchen");
                                        }
                                      }}
                                      className="h-4 w-4 text-[#245FDF] border-gray-300 focus:ring-[#245FDF] cursor-pointer mt-0.5 disabled:opacity-50"
                                    />
                                    <div>
                                      <span className="font-semibold text-[#101828]">Khi đơn hàng được gửi bếp</span>
                                      <span className="block text-xs text-[#717680] mt-0.5">In hóa đơn khi món được chuyển lệnh xuống bộ phận chế biến.</span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Save / Cancel controls for order settings edit mode */}
                        {isEditingOrderSettings && (
                          <div className="flex items-center gap-3 pt-4 border-t border-[#E9EAEB]">
                            <button
                              type="button"
                              onClick={() => {
                                setShopeeAutoConfirmOrder(backupAutoConfirmOrder);
                                setShopeeAutoConfirmType(backupAutoConfirmType);
                                setShopeeAutoPrintReceipt(backupAutoPrintReceipt);
                                setShopeeAutoPrintTrigger(backupAutoPrintTrigger);
                                setIsEditingOrderSettings(false);
                                onNotification("Đã hủy bỏ thay đổi cài đặt đơn hàng", "info");
                              }}
                              className="h-[32px] px-4 bg-white border border-[#D5D7DA] text-[#101828] hover:bg-gray-50 text-[13px] font-medium rounded-[8px] cursor-pointer font-sans"
                            >
                              Hủy bỏ
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingOrderSettings(false);
                                onNotification("Đã lưu thiết lập cài đặt đơn hàng thành công!", "success");
                              }}
                              className="h-[32px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white text-[13px] font-medium rounded-[8px] cursor-pointer font-sans border-none shadow-sm"
                            >
                              Lưu
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !isConnected ? (
          /* CHƯA KẾT NỐI - Theo thiết kế ảnh đính kèm mới */
          <div className="flex-1 p-6 overflow-y-auto bg-[#F0F2F4]">
            <div
              className="w-full bg-white rounded-xl py-12 px-8 md:px-16 select-none flex flex-col items-center justify-center animate-fade-in"
              style={{
                boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)",
                minHeight: "calc(100vh - 170px)",
              }}
            >
              {/* 1. Header Title */}
              <h2 className="text-[#101828] font-semibold text-[20px] md:text-[22px] text-center mb-3 font-sans tracking-tight">
                Đẩy mạnh doanh thu nhà hàng cùng ShopeeFood!
              </h2>

              {/* 2. Subtitle description */}
              <p className="text-[#717680] text-[13px] leading-relaxed text-center max-w-[720px] mb-8 font-sans">
                Kết nối{" "}
                <strong className="text-[#101828] font-semibold">
                  ShopeeFood
                </strong>{" "}
                để nhận và xử lý đơn hàng ngay trên{" "}
                <strong className="text-[#101828] font-semibold">
                  MISA CukCuk
                </strong>
                . Tự động đồng bộ dữ liệu, giảm thao tác thủ công, đảm bảo chính
                xác doanh thu, tồn kho,... và giúp nhà hàng vận hành hiệu quả
                hơn.
              </p>

              {/* 3. Action Button */}
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-medium text-[13px] px-6 rounded-[8px] flex items-center justify-center transition-all h-8 cursor-pointer border-none shadow-sm shadow-blue-500/10 active:scale-95"
                style={{ height: "36px", minWidth: "160px" }}
              >
                Kết nối ShopeeFood
              </button>

              {/* 4. Thin horizontal line */}
              <div className="w-full max-w-[760px] border-b border-gray-100 my-10" />

              {/* 5. Process Steps */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-[900px] mb-12">
                {/* Step 1 */}
                <div className="relative w-full max-w-[260px] h-[200px] bg-white border border-dashed border-[#D5D7DA] rounded-xl flex flex-col items-center justify-center px-4 py-3">
                  {/* Badge number */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#245FDF] text-white flex items-center justify-center font-bold text-[13px] border-2 border-white shadow-sm">
                    1
                  </div>
                  <span className="text-[#101828] font-normal text-[13px] text-center mb-2 font-sans">
                    Kết nối Shopee Partner
                  </span>
                  {/* Image 1 */}
                  <div className="h-28 w-full flex items-center justify-center">
                    <img
                      src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=bb11c63f-5e34-4349-b254-d085a64170a0.png&isTemp=true&tenantCode=misa"
                      alt="Kết nối Shopee Partner"
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-[#D5D7DA] flex items-center justify-center rotate-90 md:rotate-0">
                  <svg
                    width="24"
                    height="16"
                    viewBox="0 0 24 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 2 8 L 20 8 M 14 3 L 20 8 L 14 13"
                      stroke="#D5D7DA"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Step 2 */}
                <div className="relative w-full max-w-[260px] h-[200px] bg-white border border-dashed border-[#D5D7DA] rounded-xl flex flex-col items-center justify-center px-4 py-3">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#245FDF] text-white flex items-center justify-center font-bold text-[13px] border-2 border-white shadow-sm">
                    2
                  </div>
                  <span className="text-[#101828] font-normal text-[13px] text-center mb-2 font-sans">
                    Đồng bộ & Thiết lập thực đơn
                  </span>
                  {/* Image 2 */}
                  <div className="h-28 w-full flex items-center justify-center">
                    <img
                      src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=257ab09b-2058-4150-9370-c734c0d09936.png&isTemp=true&tenantCode=misa"
                      alt="Đồng bộ thực đơn"
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-[#D5D7DA] flex items-center justify-center rotate-90 md:rotate-0">
                  <svg
                    width="24"
                    height="16"
                    viewBox="0 0 24 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 2 8 L 20 8 M 14 3 L 20 8 L 14 13"
                      stroke="#D5D7DA"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Step 3 */}
                <div className="relative w-full max-w-[260px] h-[200px] bg-white border border-dashed border-[#D5D7DA] rounded-xl flex flex-col items-center justify-center px-4 py-3">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#245FDF] text-white flex items-center justify-center font-bold text-[13px] border-2 border-white shadow-sm">
                    3
                  </div>
                  <span className="text-[#101828] font-normal text-[13px] text-center mb-2 font-sans">
                    Thiết lập bán hàng
                  </span>
                  {/* Image 3 */}
                  <div className="h-28 w-full flex items-center justify-center">
                    <img
                      src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=6cec4103-2379-4880-bf9e-2c4cb9a48e0c.png&isTemp=true&tenantCode=misa"
                      alt="Thiết lập bán hàng"
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Footer notes and support links */}
              <div className="space-y-2 text-center text-[13px] text-[#717680] font-sans">
                <p>
                  Vui lòng bảo đảm tên đăng ký cửa hàng khớp chính xác với
                  ShopeeFood.
                </p>
                <p>
                  Bạn có thể{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNotification(
                        "Đang kết nối tới tổng đài hỗ trợ MISA CUKCUK...",
                        "info",
                      );
                    }}
                    className="text-[#245FDF] hover:underline font-semibold"
                  >
                    liên hệ MISA CUKCUK
                  </a>{" "}
                  để nhận thêm tư vấn nâng cấp hoặc hỗ trợ đồng bộ nâng cao.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ĐÃ KẾT NỐI tài khoản nhưng CHƯA BẮT ĐẦU ĐỒNG BỘ */
          <div className="flex-1 p-6 overflow-hidden bg-[#F0F2F4]">
            <div
              className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              style={{ height: "calc(100vh - 170px)", minHeight: "480px" }}
            >
              {/* Left panel: Info & Connection actions */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto space-y-6 bg-white select-none animate-fade-in">
                {/* Custom Designed success icon with stars & crosses */}
                <div className="flex items-center justify-center">
                  <svg
                    width="310"
                    height="230"
                    viewBox="0 0 310 230"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="select-none pointer-events-none"
                  >
                    {/* Bright Green Sparkle (Bottom-Left) */}
                    <path
                      d="M 38 191 Q 38 202 49 202 Q 38 202 38 213 Q 38 202 27 202 Q 38 202 38 191 Z"
                      fill="#12B76A"
                    />

                    {/* Bright Green Sparkle (Top-Left) */}
                    <path
                      d="M 101 12 Q 101 22 111 22 Q 101 22 101 32 Q 101 22 91 22 Q 101 22 101 12 Z"
                      fill="#12B76A"
                    />

                    {/* Bright Green Sparkle (Bottom-Right) */}
                    <path
                      d="M 268 141 Q 268 150 277 150 Q 268 150 268 159 Q 268 150 259 150 Q 268 150 268 141 Z"
                      fill="#12B76A"
                    />

                    {/* Grey Sparkle (Top-Right) */}
                    <path
                      d="M 198 30 Q 198 38 206 38 Q 198 38 198 46 Q 198 38 190 38 Q 198 38 198 30 Z"
                      fill="#D5D7DA"
                    />

                    {/* Grey Sparkle (Far Right) */}
                    <path
                      d="M 296 87 Q 296 92 301 92 Q 296 92 296 97 Q 296 92 291 92 Q 296 92 296 87 Z"
                      fill="#D5D7DA"
                    />

                    {/* Grey Sparkle (Mid-Left) */}
                    <path
                      d="M 45 74 Q 45 80 51 80 Q 45 80 45 86 Q 45 80 39 80 Q 45 80 45 74 Z"
                      fill="#D5D7DA"
                    />

                    {/* Grey Sparkle (Far Bottom-Left) */}
                    <path
                      d="M 9 173 Q 9 178 14 178 Q 9 178 9 183 Q 9 178 4 178 Q 9 178 9 173 Z"
                      fill="#D5D7DA"
                    />

                    {/* Dark Cross (Top-Right) */}
                    <path
                      d="M 254 44 L 266 44 M 260 38 L 260 50"
                      stroke="#2D3142"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Dark Cross (Bottom-Right) */}
                    <path
                      d="M 266 206 L 278 206 M 272 200 L 272 212"
                      stroke="#2D3142"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Dark Cross (Far Left) */}
                    <path
                      d="M 0 128 L 8 128 M 4 124 L 4 132"
                      stroke="#2D3142"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Main Circle */}
                    <circle cx="150" cy="110" r="54" fill="#12B76A" />

                    {/* Main Checkmark (breaks outer border at top-right) */}
                    <path
                      d="M 118 114 L 144 140 L 208 76"
                      fill="none"
                      stroke="white"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="space-y-1 text-center">
                  <h3 className="text-[#101828] font-bold text-xl">
                    Kết nối thành công!
                  </h3>
                  <p className="text-[#717680] text-[13px] leading-relaxed max-w-sm">
                    Hệ thống đã kết nối đồng bộ thành công gian hàng{" "}
                    <strong className="text-[#101828] font-bold">
                      TRÀ SỮA TAM ĐẢO - CHI NHÁNH CHÍNH
                    </strong>{" "}
                    với tài khoản quản lý{" "}
                    <strong className="text-[#101828] font-bold">
                      ShopeeFood Partner
                    </strong>{" "}
                    của bạn.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShopeeSyncStarted(true);
                    onNotification(
                      "Bắt đầu đồng bộ thực đơn và đơn hàng thành công!",
                      "success",
                    );
                  }}
                  className="w-full max-w-md bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-sm py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer text-center flex items-center justify-center shadow-md shadow-blue-500/10 active:scale-95"
                  style={{ height: "40px" }}
                >
                  Bắt đầu thiết lập thực đơn
                </button>
              </div>

              {/* Right panel: Modern Illustration of partnership */}
              <div
                className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#E9EAEB] flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-6 overflow-y-auto"
                style={{
                  backgroundImage:
                    'url("https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=94a4e17a-55ed-450b-8aa1-9354887ceddd.png&isTemp=true&tenantCode=misa")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Image banner as per screenshot */}
                <div className="w-full max-w-[360px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-orange-100 bg-white">
                  <img
                    src={shopeeFoodBanner}
                    alt="Đẩy mạnh doanh thu nhà hàng cùng ShopeeFood!"
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Title & Desc */}
                <div className="space-y-3 max-w-md">
                  <h2 className="font-semibold text-[#101828] text-xl tracking-tight leading-snug">
                    Đẩy mạnh doanh thu nhà hàng cùng ShopeeFood!
                  </h2>
                  <p className="text-[#717680] text-[13px] md:text-sm leading-relaxed max-w-[400px] mx-auto">
                    Đơn hàng ShopeeFood được gửi trực tiếp vào máy tính tiền
                    CukCuk tại quầy, bếp in hóa đơn ngay tức thì mà không cần
                    nhập thủ công, giúp tăng doanh thu cửa hàng vượt trội.
                  </p>
                </div>

                {/* Feature benefits list */}
                <div className="flex flex-col gap-5 w-full max-w-[320px] mx-auto pt-4 text-left">
                  <div className="flex items-center gap-4">
                    <Smartphone
                      className="w-6 h-6 text-[#EE4D2D] flex-shrink-0"
                      strokeWidth={1.8}
                    />
                    <span className="text-[#101828] text-[15px] font-medium">
                      Nhận đơn tự động 100%
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Utensils
                      className="w-6 h-6 text-[#EE4D2D] flex-shrink-0"
                      strokeWidth={1.8}
                    />
                    <span className="text-[#101828] text-[15px] font-medium">
                      Đồng bộ thực đơn nhanh chóng
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Clock
                      className="w-6 h-6 text-[#EE4D2D] flex-shrink-0"
                      strokeWidth={1.8}
                    />
                    <span className="text-[#101828] text-[15px] font-medium">
                      Kiểm soát khung giờ hoạt động
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <FileSpreadsheet
                      className="w-6 h-6 text-[#EE4D2D] flex-shrink-0"
                      strokeWidth={1.8}
                    />
                    <span className="text-[#101828] text-[15px] font-medium">
                      Báo cáo tài chính chuẩn xác
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 💠 QR CODE MODAL POPUP (image 2) */}
        {isQrModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in">
            {qrScanStatus === "success" ? (
              /* Success connection popup */
              <div
                className="bg-white flex flex-col w-full max-w-[420px] overflow-hidden shadow-2xl relative animate-scale-up"
                style={{ borderRadius: "12px" }}
              >
                {/* Header Modal - Black text on white background styled as per design instructions */}
                <div
                  className="flex items-center justify-between px-6 bg-white border-b border-[#E9EAEB]"
                  style={{ height: "62px", padding: "24px 24px 16px 24px" }}
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw
                      className="w-4 h-4 text-[#245FDF] animate-spin animate-infinite"
                      style={{ animationDuration: "6s" }}
                    />
                    <h3 className="text-[#101828] font-bold text-sm tracking-wider uppercase">
                      KẾT NỐI THÀNH CÔNG!
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsQrModalOpen(false)}
                    className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Form */}
                <div className="p-6 flex flex-col items-center">
                  {/* Large light green circle checkmark */}
                  <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mt-2">
                    <Check className="w-8 h-8 text-[#10B981] stroke-[3px]" />
                  </div>

                  <h3 className="text-[#101828] font-bold text-lg text-center mt-4">
                    Môi trường kết nối hoàn tất!
                  </h3>

                  <p className="text-[#5E6470] text-xs text-center leading-relaxed mt-2 max-w-sm px-1">
                    Hệ thống đã kết nối đồng bộ thành công gian hàng{" "}
                    <strong className="text-[#101828] font-bold">
                      TRÀ SỮA TAM ĐẢO - CHI NHÁNH CHÍNH
                    </strong>{" "}
                    với tài khoản quản lý{" "}
                    <strong className="text-[#101828] font-bold">
                      ShopeeFood Partner
                    </strong>{" "}
                    của bạn.
                  </p>

                  {/* Properties table - Using Inter font instead of font-mono */}
                  <div className="bg-[#F8F9FA] border border-[#E9EAEB] rounded-xl p-4 space-y-3 w-full mt-5 text-[12px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#717680]">Merchant ID:</span>
                      <span className="font-bold text-[#101828] font-sans">
                        SPF-98234-CUK
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-[#717680] flex-shrink-0">
                        Tên cửa hàng:
                      </span>
                      <span className="font-bold text-[#101828] text-right ml-4">
                        TRÀ SỮA TAM ĐẢO - CHI NHÁNH CHÍNH
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#717680]">Số tài khoản:</span>
                      <span className="font-bold text-[#101828] font-sans">
                        0987******
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#717680]">
                        Trạng thái đồng bộ:
                      </span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1.5 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                        Chính thức
                      </span>
                    </div>
                  </div>

                  {/* CTA button inside body - Styled with primary BrandColor */}
                  <button
                    onClick={() => {
                      setIsQrModalOpen(false);
                      setShopeeFoodTab("menu");
                    }}
                    className="w-full bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-bold text-sm py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer text-center flex items-center justify-center mt-6 shadow-md shadow-blue-500/10 active:scale-95"
                    style={{ height: "40px" }}
                  >
                    Bắt đầu Đồng bộ dữ liệu bán hàng
                  </button>
                </div>
              </div>
            ) : (
              /* QR Code scanning flow popup */
              <div
                className="bg-white flex flex-col w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-up"
                style={{ borderRadius: "12px" }}
              >
                {/* Header Modal */}
                <div
                  className="flex items-center justify-between px-6 border-b border-[#E9EAEB]"
                  style={{ height: "62px" }}
                >
                  <h3 className="text-[#101828] font-semibold text-base">
                    Kết nối ShopeeFood
                  </h3>
                  <button
                    onClick={() => setIsQrModalOpen(false)}
                    className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Form */}
                <div className="p-6 flex flex-col items-center space-y-6">
                  {/* Yellow Instruction Banner */}
                  <div className="w-full bg-[#FFF9EC] border border-[#FFE4A3] rounded-lg p-4 flex gap-3 text-[#854D0E] text-xs leading-relaxed">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      Vui lòng{" "}
                      <strong className="font-semibold text-[#101828]">
                        mở ứng dụng Shopee Partner
                      </strong>{" "}
                      (hoặc ứng dụng Shopee chính) trên điện thoại di động, đi
                      vào mục{" "}
                      <strong className="font-semibold text-[#101828]">
                        "Thiết lập / Đồng bộ CukCuk"
                      </strong>{" "}
                      và quét mã dưới đây để tích hợp nhanh cửa hàng.
                    </div>
                  </div>

                  {/* Dashed QR Card */}
                  <div className="w-full border-2 border-dashed border-[#FF8E75]/40 bg-white rounded-xl p-5 flex flex-col items-center justify-center relative shadow-sm">
                    {/* QR Image representation */}
                    <div className="relative w-44 h-44 bg-white flex items-center justify-center p-2 rounded-lg border border-gray-100 shadow-inner overflow-hidden">
                      {/* Laser line overlay */}
                      {qrScanStatus === "scanning" && (
                        <div className="absolute top-2 left-2 right-2 h-[2px] bg-[#EE4D2D] shadow-[0_0_10px_3px_#EE4D2D] animate-qr-scan z-10" />
                      )}

                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ShopeeFoodPartnerCukCukIntegration_SPF-98234-CUK"
                          alt="ShopeeFood QR Code"
                          className="w-full h-full object-contain select-none"
                          referrerPolicy="no-referrer"
                        />
                        {/* Center ShopeeFood Badge Logo circle ("SF") */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-9 h-9 rounded-full bg-[#EE4D2D] border-2 border-white flex items-center justify-center shadow-md">
                            <span className="text-white text-[11px] font-black tracking-tighter">
                              SF
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-center select-none text-[11px] tracking-wider text-gray-500 font-semibold uppercase">
                      GIAN HÀNG:{" "}
                      <span className="text-[#101828] font-bold">
                        TRÀ SỮA TAM ĐẢO - CHI NHÁNH CHÍNH
                      </span>
                    </div>
                  </div>

                  {/* Status/Activity loading pill */}
                  <div className="inline-flex items-center gap-2 bg-[#F2F4F7] text-[#344054] px-4 py-1.5 rounded-full text-xs font-semibold shadow-inner select-none">
                    {qrScanStatus === "idle" && (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span>Mã QR sẵn sàng (quét sau 2s)...</span>
                      </>
                    )}
                    {qrScanStatus === "scanning" && (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EE4D2D]"></span>
                        </span>
                        <span className="text-[#EE4D2D] font-medium">
                          Đang quét mã QR...
                        </span>
                      </>
                    )}
                    {qrScanStatus === "authorizing" && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                        <span className="text-blue-600">
                          Đang chờ KH đăng nhập Shopee Partner & ủy quyền...
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 💠 CONNECTION DETAILS POPUP MODAL */}
        {isInfoModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in">
            <div
              className="bg-white flex flex-col w-full max-w-[440px] overflow-hidden shadow-2xl relative p-6 animate-scale-up"
              style={{ borderRadius: "12px" }}
            >
              {/* Close "X" button at top-right corner */}
              <button
                onClick={() => setIsInfoModalOpen(false)}
                className="absolute top-4 right-4 text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mt-3">
                {/* Large light green circle checkmark */}
                <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                  <Check className="w-8 h-8 text-[#10B981] stroke-[3px]" />
                </div>

                <h3 className="text-[#101828] font-bold text-lg text-center mt-4">
                  Kết nối thành công!
                </h3>

                <p className="text-[#717680] text-xs text-center leading-relaxed mt-2 max-w-sm px-1">
                  Hệ thống đã kết nối đồng bộ thành công gian hàng{" "}
                  <strong className="text-[#101828] font-semibold">
                    TRÀ SỮA TAM ĐẢO - CHI NHÁNH CHÍNH
                  </strong>{" "}
                  với tài khoản quản lý{" "}
                  <strong className="text-[#101828] font-semibold">
                    ShopeeFood Partner
                  </strong>{" "}
                  của bạn.
                </p>

                {/* Properties list */}
                <div className="bg-[#F8F9FA] border border-[#E9EAEB] rounded-xl p-4 space-y-3.5 w-full mt-5 text-[12px]">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-[#717680]">Merchant ID:</span>
                    <span className="font-bold text-[#101828] font-sans">
                      SPF-98234-CUK
                    </span>
                  </div>
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                    <span className="text-[#717680] flex-shrink-0">
                      Tên cửa hàng:
                    </span>
                    <span className="font-bold text-[#101828] text-right ml-4">
                      TRÀ SỮA TAM ĐẢO - CHI NHÁNH CHÍNH
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-[#717680]">Số tài khoản:</span>
                    <span className="font-bold text-[#101828] font-sans">
                      0987******
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#717680]">Trạng thái đồng bộ:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1.5 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      Chính thức
                    </span>
                  </div>
                </div>

                {/* Footer action */}
                <div className="w-full mt-6 flex justify-end">
                  <button
                    onClick={() => setIsInfoModalOpen(false)}
                    className="bg-white text-[#101828] hover:bg-gray-50 border border-[#D5D7DA] font-semibold text-xs py-2 px-4 rounded-[8px] transition-all duration-200 cursor-pointer min-w-[84px] h-[32px] flex items-center justify-center"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 💠 EDIT OPTION GROUP (STPV) POPUP MODAL */}
        {isEditingStpv && editingStpv && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in"
            onClick={() => {
              setIsEditingStpv(false);
              setEditingStpv(null);
            }}
          >
            <div
              className="bg-white flex flex-col w-full max-w-[720px] overflow-hidden shadow-2xl relative animate-scale-up"
              style={{ borderRadius: "12px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div
                className="flex items-center justify-between px-6 bg-white text-[#101828] border-b border-[#E9EAEB] select-none"
                style={{ height: "52px" }}
              >
                <h3 className="text-[#101828] font-semibold text-base font-sans">
                  Sửa nhóm sở thích phục vụ - {editingStpv.name}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onNotification(
                        "Hệ thống trợ giúp đang chuẩn bị thông tin...",
                        "info",
                      )
                    }
                    className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                    title="Trợ giúp"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingStpv(false);
                      setEditingStpv(null);
                    }}
                    className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Toolbar action buttons (Lên, Xuống) */}
              <div className="bg-white border-b border-[#E9EAEB] px-6 py-2 flex gap-2 select-none">
                <button
                  type="button"
                  disabled={
                    selectedItemIndex === null || selectedItemIndex === 0
                  }
                  onClick={() => {
                    if (selectedItemIndex === null || selectedItemIndex === 0)
                      return;
                    const items = [...editingStpv.items];
                    // Swap elements
                    const temp = items[selectedItemIndex];
                    items[selectedItemIndex] = items[selectedItemIndex - 1];
                    items[selectedItemIndex - 1] = temp;
                    // Fix order field
                    items.forEach((item, idx) => {
                      item.order = idx + 1;
                    });
                    setEditingStpv({ ...editingStpv, items });
                    setSelectedItemIndex(selectedItemIndex - 1);
                  }}
                  className={`flex items-center gap-1.5 px-3 h-[32px] rounded-[4px] border text-[13px] font-medium font-sans transition-all select-none ${
                    selectedItemIndex !== null && selectedItemIndex > 0
                      ? "bg-white hover:bg-[#F0F6FE] border-[#D5D7DA] text-[#101828] cursor-pointer"
                      : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed opacity-60"
                  }`}
                  style={{ minWidth: "84px" }}
                >
                  <ArrowUp className="w-4 h-4" />
                  Lên
                </button>

                <button
                  type="button"
                  disabled={
                    selectedItemIndex === null ||
                    selectedItemIndex === editingStpv.items.length - 1
                  }
                  onClick={() => {
                    if (
                      selectedItemIndex === null ||
                      selectedItemIndex === editingStpv.items.length - 1
                    )
                      return;
                    const items = [...editingStpv.items];
                    // Swap elements
                    const temp = items[selectedItemIndex];
                    items[selectedItemIndex] = items[selectedItemIndex + 1];
                    items[selectedItemIndex + 1] = temp;
                    // Fix order field
                    items.forEach((item, idx) => {
                      item.order = idx + 1;
                    });
                    setEditingStpv({ ...editingStpv, items });
                    setSelectedItemIndex(selectedItemIndex + 1);
                  }}
                  className={`flex items-center gap-1.5 px-3 h-[32px] rounded-[4px] border text-[13px] font-medium font-sans transition-all select-none ${
                    selectedItemIndex !== null &&
                    selectedItemIndex < editingStpv.items.length - 1
                      ? "bg-white hover:bg-[#F0F6FE] border-[#D5D7DA] text-[#101828] cursor-pointer"
                      : "bg-[#FAFAFA] border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed opacity-60"
                  }`}
                  style={{ minWidth: "84px" }}
                >
                  <ArrowDown className="w-4 h-4" />
                  Xuống
                </button>
              </div>

              {/* Body Form containing list and radio configs */}
              <div
                className="p-6 overflow-y-auto space-y-6 max-h-[460px]"
                style={{ padding: "16px 24px" }}
              >
                {/* 1. Items list Table */}
                <div className="border border-[#E9EAEB] rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB]">
                      <tr className="h-9 text-[13px] text-[#101828] font-semibold font-sans">
                        <th className="px-4 py-2 text-center w-20 border-r border-[#E9EAEB]">
                          Thứ tự
                        </th>
                        <th className="px-4 py-2 border-r border-[#E9EAEB]">
                          Sở thích phục vụ
                        </th>
                        <th className="px-4 py-2 text-center w-36 border-r border-[#E9EAEB]">
                          Trạng thái
                        </th>
                        <th className="px-4 py-2 text-center w-44 border-r border-[#E9EAEB]">
                          Trạng thái liên kết
                        </th>
                        <th className="px-4 py-2 text-center w-24">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editingStpv.items &&
                        editingStpv.items.map((item: any, idx: number) => {
                          const isItemSelected = selectedItemIndex === idx;
                          const isLinked = item.linked !== false;

                          return (
                            <tr
                              key={item.order || idx}
                              onClick={() => setSelectedItemIndex(idx)}
                              className={`group h-12 text-[13px] border-b border-[#E9EAEB] transition-colors cursor-pointer font-sans select-none ${
                                isItemSelected
                                  ? "bg-[#DDEAFC]"
                                  : "hover:bg-[#F0F6FE]"
                              }`}
                            >
                              <td className="px-4 text-center font-normal text-[#101828] border-r border-[#E9EAEB]">
                                {item.order || idx + 1}
                              </td>
                              <td className="px-4 font-normal text-[#101828] border-r border-[#E9EAEB]">
                                {item.name}
                              </td>
                              <td
                                className="px-3 text-center border-r border-[#E9EAEB]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="relative inline-block w-full max-w-[140px]">
                                  <select
                                    value={
                                      (item.status === "Sử dụng" || item.status === "Đang hoạt động")
                                        ? "Sử dụng"
                                        : "Ngừng sử dụng"
                                    }
                                    onChange={(e) => {
                                      const newStatus = e.target.value;
                                      const updatedItems = [...editingStpv.items];
                                      updatedItems[idx] = {
                                        ...updatedItems[idx],
                                        status: newStatus === "Sử dụng" ? "Đang hoạt động" : "Ngừng áp dụng",
                                      };
                                      setEditingStpv({
                                        ...editingStpv,
                                        items: updatedItems,
                                      });
                                    }}
                                    className="w-full h-[32px] pl-2.5 pr-8 text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white text-[#101828] outline-none font-sans cursor-pointer appearance-none"
                                  >
                                    <option value="Sử dụng">Sử dụng</option>
                                    <option value="Ngừng sử dụng">Ngừng sử dụng</option>
                                  </select>
                                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td
                                className="px-4 text-center border-r border-[#E9EAEB]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <span className="inline-flex items-center gap-1.5 text-[13px] font-normal font-sans">
                                    <span
                                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                        isLinked
                                          ? "bg-[#12B76A]"
                                          : "bg-[#717680]"
                                      }`}
                                    ></span>
                                    <span
                                      className={
                                        isLinked
                                          ? "text-[#12B76A]"
                                          : "text-[#717680]"
                                      }
                                    >
                                      {isLinked
                                        ? "Đã liên kết"
                                        : "Chưa liên kết"}
                                    </span>
                                  </span>
                                  {isLinked && item.cukcukItem && (
                                    <span
                                      className="text-[11px] text-[#717680] font-medium max-w-[160px] truncate"
                                      title={`Liên kết với: ${item.cukcukItem}`}
                                    >
                                      ({item.cukcukItem})
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td
                                className="px-4 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {isLinked ? (
                                  <button
                                    type="button"
                                    title="Hủy liên kết"
                                    onClick={() => {
                                      const items = [...editingStpv.items];
                                      items[idx] = {
                                        ...items[idx],
                                        linked: false,
                                        cukcukItem: undefined,
                                      };
                                      setEditingStpv({ ...editingStpv, items });
                                      onNotification(
                                        `Đã hủy liên kết "${item.name}"`,
                                        "success",
                                      );
                                    }}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-[#717680] hover:text-[#101828] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center inline-flex"
                                  >
                                    <Unlink className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    title="Liên kết"
                                    onClick={() => {
                                      setLinkingItemIndex(idx);
                                      setBackendStpvSearchQuery("");
                                      setSelectedBackendStpvId(null);
                                      setShowBackendStpvLinkSelector(true);
                                    }}
                                    className="p-1.5 hover:bg-[#EDFCF4] rounded-lg text-[#245FDF] hover:text-[#1B4EBA] transition-all cursor-pointer bg-transparent border-none flex items-center justify-center inline-flex"
                                  >
                                    <Link className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {/* Section header "THIẾT LẬP CHO NHÓM SỞ THÍCH PHỤC VỤ" */}
                <div className="pt-2">
                  <h3 className="text-[#101828] font-bold text-[13px] tracking-wide font-sans mb-1 uppercase">
                    Thiết lập cho nhóm sở thích phục vụ
                  </h3>
                  <div className="border-t border-[#E9EAEB] w-full my-3"></div>
                </div>

                {/* Form parameters */}
                <div className="space-y-4 select-none">
                  {/* Row 1: Bắt buộc chọn */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                    <span className="text-[13px] font-normal text-[#101828] font-sans">
                      Bắt buộc chọn nhóm sở thích phục vụ khi ghi nhận món:
                    </span>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#101828] font-sans">
                        <input
                          type="radio"
                          name="group-required"
                          checked={editingStpv.required === true}
                          onChange={() =>
                            setEditingStpv({ ...editingStpv, required: true })
                          }
                          className="w-4 h-4 text-[#245FDF] focus:ring-[#245FDF] border-gray-300"
                        />
                        Có
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#101828] font-sans">
                        <input
                          type="radio"
                          name="group-required"
                          checked={editingStpv.required === false}
                          onChange={() =>
                            setEditingStpv({ ...editingStpv, required: false })
                          }
                          className="w-4 h-4 text-[#245FDF] focus:ring-[#245FDF] border-gray-300"
                        />
                        Không
                      </label>
                    </div>
                  </div>

                  {/* Row 2: Số lượng tối đa */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                    <span className="text-[13px] font-normal text-[#101828] font-sans">
                      Số lượng sở thích phục vụ được chọn tối đa:
                    </span>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#101828] font-sans">
                        <input
                          type="radio"
                          name="group-max-select"
                          checked={editingStpv.maxSelect === 1}
                          onChange={() =>
                            setEditingStpv({ ...editingStpv, maxSelect: 1 })
                          }
                          className="w-4 h-4 text-[#245FDF] focus:ring-[#245FDF] border-gray-300"
                        />
                        1 loại
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#101828] font-sans">
                        <input
                          type="radio"
                          name="group-max-select"
                          checked={editingStpv.maxSelect > 1}
                          onChange={() =>
                            setEditingStpv({ ...editingStpv, maxSelect: 5 })
                          }
                          className="w-4 h-4 text-[#245FDF] focus:ring-[#245FDF] border-gray-300"
                        />
                        Nhiều loại
                      </label>

                      {editingStpv.maxSelect > 1 && (
                        <div className="flex items-center gap-1.5 ml-1 animate-fade-in">
                          <span className="text-xs text-[#717680] font-sans">
                            (Tối đa:
                          </span>
                          <input
                            type="number"
                            min="2"
                            max="99"
                            value={editingStpv.maxSelect}
                            onChange={(e) =>
                              setEditingStpv({
                                ...editingStpv,
                                maxSelect: Math.max(
                                  2,
                                  parseInt(e.target.value) || 2,
                                ),
                              })
                            }
                            className="w-12 h-7 px-1.5 text-center border border-[#D5D7DA] rounded-[4px] bg-white text-[#101828] text-xs outline-none focus:border-[#245FDF] font-sans font-semibold"
                          />
                          <span className="text-xs text-[#717680] font-sans">
                            )
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Trạng thái */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                    <span className="text-[13px] font-normal text-[#101828] font-sans">
                      Trạng thái:
                    </span>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#101828] font-sans">
                        <input
                          type="radio"
                          name="group-status"
                          checked={editingStpv.status === "Sử dụng"}
                          onChange={() =>
                            setEditingStpv({
                              ...editingStpv,
                              status: "Sử dụng",
                            })
                          }
                          className="w-4 h-4 text-[#245FDF] focus:ring-[#245FDF] border-gray-300"
                        />
                        Sử dụng
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#101828] font-sans">
                        <input
                          type="radio"
                          name="group-status"
                          checked={editingStpv.status === "Ngừng sử dụng"}
                          onChange={() =>
                            setEditingStpv({
                              ...editingStpv,
                              status: "Ngừng sử dụng",
                            })
                          }
                          className="w-4 h-4 text-[#245FDF] focus:ring-[#245FDF] border-gray-300"
                        />
                        Ngừng sử dụng
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#101828] font-sans">
                        <input
                          type="radio"
                          name="group-status"
                          checked={editingStpv.status === "Ẩn"}
                          onChange={() =>
                            setEditingStpv({ ...editingStpv, status: "Ẩn" })
                          }
                          className="w-4 h-4 text-[#245FDF] focus:ring-[#245FDF] border-gray-300"
                        />
                        Ẩn
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div
                className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB] select-none gap-2"
                style={{ height: "56px" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingStpv(false);
                    setEditingStpv(null);
                  }}
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium text-[13px] py-1.5 px-3 rounded-[8px] transition-all cursor-pointer min-w-[84px] h-[32px] flex items-center justify-center font-sans"
                >
                  Huỷ
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOptionGroups((prev) =>
                      prev.map((g) =>
                        g.id === editingStpv.id ? editingStpv : g,
                      ),
                    );
                    setIsEditingStpv(false);
                    setEditingStpv(null);
                    onNotification(
                      "Cập nhật nhóm sở thích phục vụ thành công",
                      "success",
                    );
                  }}
                  className="bg-[#245FDF] hover:bg-[#1B4EBA] text-white border-none font-medium text-[13px] py-1.5 px-4 rounded-[8px] transition-all cursor-pointer min-w-[84px] h-[32px] flex items-center justify-center font-sans"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 💠 SUB-MODAL: CHỌN SỞ THÍCH PHỤC VỤ TỪ BACKEND CUKCUK */}
        {showBackendStpvLinkSelector && linkingItemIndex !== null && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 transition-all duration-300 animate-fade-in"
            onClick={() => setShowBackendStpvLinkSelector(false)}
          >
            <div
              className="bg-white flex flex-col w-full max-w-[560px] overflow-hidden shadow-2xl relative animate-scale-up"
              style={{ borderRadius: "12px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal - White background, black text/icon */}
              <div
                className="flex items-center justify-between px-6 bg-white text-[#101828] border-b border-[#E9EAEB] select-none"
                style={{ height: "56px" }}
              >
                <h3 className="text-[#101828] font-semibold text-base font-sans">
                  Chọn sở thích phục vụ từ CukCuk
                </h3>
                <button
                  onClick={() => setShowBackendStpvLinkSelector(false)}
                  className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col h-[400px]">
                {/* Search box - Height: 32px */}
                <div className="relative mb-4 flex-shrink-0">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sở thích phục vụ..."
                    value={backendStpvSearchQuery}
                    onChange={(e) => setBackendStpvSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] focus:outline-none transition-all placeholder:text-[#A4A7AE] font-sans bg-white"
                    style={{ height: "32px", borderRadius: "8px" }}
                  />
                </div>

                {/* Subtitle / Selected Info */}
                <div className="text-[12px] text-[#717680] mb-2 font-sans flex-shrink-0">
                  Đang liên kết cho:{" "}
                  <strong className="text-[#101828]">
                    {editingStpv.items[linkingItemIndex]?.name}
                  </strong>
                </div>

                {/* Scrollable list styled as a proper Table */}
                <div className="flex-1 overflow-y-auto border border-[#E9EAEB] rounded-lg bg-white relative">
                  <table className="w-full text-left border-collapse select-none">
                    <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB] sticky top-0 z-10">
                      <tr className="h-9 text-[12px] text-[#717680] font-semibold font-sans">
                        <th className="px-4 py-2 text-center w-16 border-r border-[#E9EAEB]">
                          Chọn
                        </th>
                        <th className="px-4 py-2 border-r border-[#E9EAEB]">
                          Sở thích phục vụ
                        </th>
                        <th className="px-4 py-2 text-right w-32 pr-6">
                          Thu thêm
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9EAEB]">
                      {BACKEND_CUKCUK_STPVS.filter(
                        (item) =>
                          item.name
                            .toLowerCase()
                            .includes(backendStpvSearchQuery.toLowerCase()) ||
                          item.category
                            .toLowerCase()
                            .includes(backendStpvSearchQuery.toLowerCase()),
                      ).length > 0 ? (
                        BACKEND_CUKCUK_STPVS.filter(
                          (item) =>
                            item.name
                              .toLowerCase()
                              .includes(backendStpvSearchQuery.toLowerCase()) ||
                            item.category
                              .toLowerCase()
                              .includes(backendStpvSearchQuery.toLowerCase()),
                        ).map((item) => {
                          const isSelected = selectedBackendStpvId === item.id;
                          return (
                            <tr
                              key={item.id}
                              onClick={() => setSelectedBackendStpvId(item.id)}
                              onDoubleClick={() => {
                                const items = [...editingStpv.items];
                                items[linkingItemIndex] = {
                                  ...items[linkingItemIndex],
                                  linked: true,
                                  cukcukItem: item.name,
                                };
                                setEditingStpv({ ...editingStpv, items });
                                setShowBackendStpvLinkSelector(false);
                                onNotification(
                                  `Đã liên kết thành công với "${item.name}"`,
                                  "success",
                                );
                              }}
                              className={`h-11 hover:bg-[#F0F6FE]/50 cursor-pointer transition-all select-none font-sans text-[13px] ${
                                isSelected ? "bg-[#F0F6FE]" : ""
                              }`}
                            >
                              <td
                                className="px-4 text-center border-r border-[#E9EAEB]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="radio"
                                  name="backend_stpv_radio"
                                  checked={isSelected}
                                  onChange={() =>
                                    setSelectedBackendStpvId(item.id)
                                  }
                                  className="w-4.5 h-4.5 text-[#245FDF] focus:ring-[#245FDF] border-gray-300 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 border-r border-[#E9EAEB]">
                                <div className="flex flex-col py-0.5">
                                  <span
                                    className={`font-sans text-[13px] ${isSelected ? "text-[#245FDF] font-semibold" : "text-[#101828] font-normal"}`}
                                  >
                                    {item.name}
                                  </span>
                                  <span className="text-[11px] text-[#717680] font-sans font-normal">
                                    {item.category}
                                  </span>
                                </div>
                              </td>
                              <td
                                className={`px-4 text-right pr-6 font-sans text-[13px] ${isSelected ? "text-[#245FDF] font-semibold" : "text-[#101828] font-normal"}`}
                              >
                                {item.extraPrice > 0
                                  ? `${item.extraPrice.toLocaleString("vi-VN")}đ`
                                  : "0đ"}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center py-12 text-gray-400"
                          >
                            <p className="text-[13px] font-medium font-sans">
                              Không tìm thấy kết quả nào
                            </p>
                            <p className="text-[11px] mt-1 font-sans">
                              Vui lòng nhập từ khóa khác
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer action */}
              <div
                className="flex items-center justify-end px-5 bg-[#FAFAFA] border-t border-[#E9EAEB] select-none gap-2"
                style={{ height: "52px" }}
              >
                <button
                  type="button"
                  onClick={() => setShowBackendStpvLinkSelector(false)}
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium text-[13px] py-1.5 px-3 rounded-[8px] transition-all cursor-pointer min-w-[84px] h-[32px] flex items-center justify-center font-sans"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  disabled={!selectedBackendStpvId}
                  onClick={() => {
                    const matched = BACKEND_CUKCUK_STPVS.find(
                      (b) => b.id === selectedBackendStpvId,
                    );
                    if (matched) {
                      const items = [...editingStpv.items];
                      items[linkingItemIndex] = {
                        ...items[linkingItemIndex],
                        linked: true,
                        cukcukItem: matched.name,
                      };
                      setEditingStpv({ ...editingStpv, items });
                      setShowBackendStpvLinkSelector(false);
                      onNotification(
                        `Đã liên kết thành công với "${matched.name}"`,
                        "success",
                      );
                    }
                  }}
                  className={`border-none text-white font-medium text-[13px] py-1.5 px-4 rounded-[8px] transition-all cursor-pointer min-w-[84px] h-[32px] flex items-center justify-center font-sans ${
                    selectedBackendStpvId
                      ? "bg-[#245FDF] hover:bg-[#1B4EBA]"
                      : "bg-gray-300 cursor-not-allowed opacity-60"
                  }`}
                >
                  Liên kết
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 💠 OPTION GROUP ITEMS (STPV) DETAILS POPUP MODAL */}
        {selectedOptionGroup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in">
            <div
              className="bg-white flex flex-col w-full max-w-[560px] overflow-hidden shadow-2xl relative animate-scale-up"
              style={{ borderRadius: "12px" }}
            >
              {/* Header Modal */}
              <div
                className="flex items-center justify-between px-6 border-b border-[#E9EAEB]"
                style={{ height: "62px", padding: "24px 24px 16px 24px" }}
              >
                <h3 className="text-[#101828] font-semibold text-base font-sans">
                  Sở thích phục vụ: {selectedOptionGroup.name}
                </h3>
                <button
                  onClick={() => setSelectedOptionGroup(null)}
                  className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Form */}
              <div
                className="p-6 overflow-y-auto"
                style={{ padding: "0 24px 16px 24px" }}
              >
                <div className="mt-4 mb-3 flex items-center justify-between">
                  <div className="text-[12px] text-[#717680] font-sans">
                    Nhóm:{" "}
                    <span className="font-semibold text-[#101828]">
                      {selectedOptionGroup.name}
                    </span>
                    <span className="mx-2">•</span>
                    Nguồn:{" "}
                    <span className="font-semibold text-[#101828] capitalize">
                      {selectedOptionGroup.source}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#717680] font-sans">
                    Bắt buộc:{" "}
                    <span className="font-semibold text-[#101828]">
                      {selectedOptionGroup.required ? "Có" : "Không"}
                    </span>
                    <span className="mx-2">•</span>
                    Tối đa chọn:{" "}
                    <span className="font-bold text-[#101828] font-sans">
                      {selectedOptionGroup.maxSelect}
                    </span>
                  </div>
                </div>

                <div className="border border-[#E9EAEB] rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FAFAFA] border-b border-[#E9EAEB]">
                      <tr className="h-9 text-[12px] text-[#717680] font-semibold font-sans">
                        <th className="px-4 py-2 text-center w-20">Thứ tự</th>
                        <th className="px-4 py-2">Sở thích phục vụ</th>
                        <th className="px-4 py-2">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOptionGroup.items.map((item: any) => (
                        <tr
                          key={item.order}
                          className="h-10 text-[13px] border-b border-[#E9EAEB] hover:bg-gray-50"
                        >
                          <td className="px-4 text-center font-medium font-sans text-gray-500">
                            {item.order}
                          </td>
                          <td className="px-4 font-semibold text-[#101828]">
                            {item.name}
                          </td>
                          <td className="px-4">
                            {item.status === "Đang hoạt động" ? (
                              <span className="inline-flex items-center gap-1.5 text-[13px] font-normal font-sans">
                                <span className="w-2 h-2 rounded-full bg-[#12B76A] flex-shrink-0"></span>
                                <span className="text-[#12B76A]">
                                  Đang hoạt động
                                </span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[13px] font-normal font-sans">
                                <span className="w-2 h-2 rounded-full bg-[#717680] flex-shrink-0"></span>
                                <span className="text-[#717680]">
                                  Ngừng áp dụng
                                </span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Action */}
              <div
                className="flex items-center justify-end px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]"
                style={{ height: "56px" }}
              >
                <button
                  onClick={() => setSelectedOptionGroup(null)}
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-semibold text-xs py-2 px-4 rounded-[8px] transition-all duration-200 cursor-pointer min-w-[84px] h-[32px] flex items-center justify-center font-sans"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {isShopeeSuccessModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-[10010] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[24px] shadow-2xl border border-[#E9EAEB] w-full max-w-[480px] overflow-hidden animate-scale-up p-8 flex flex-col items-center text-center relative">
              {/* Close button */}
              <button
                type="button"
                onClick={() => {
                  setIsShopeeSuccessModalOpen(false);
                }}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors border-none cursor-pointer bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Celebration graphic */}
              <div className="relative w-full h-36 flex items-center justify-center mb-6 select-none">
                {/* Faint ambient glow behind */}
                <div className="absolute w-36 h-36 rounded-full bg-emerald-500/10 blur-xl"></div>

                {/* Central success circle */}
                <div className="w-24 h-24 rounded-full bg-[#10B981] flex items-center justify-center relative shadow-lg shadow-[#10B981]/20">
                  <Check className="w-12 h-12 text-white stroke-[3.5px]" />
                </div>

                {/* Sparkle stars and decoration crosses */}
                <div className="absolute top-[10%] left-[32%] animate-pulse">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#10B981"
                  >
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
                  </svg>
                </div>

                <div
                  className="absolute bottom-[15%] right-[28%] animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#10B981"
                  >
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
                  </svg>
                </div>

                <div
                  className="absolute bottom-[20%] left-[26%] animate-pulse"
                  style={{ animationDelay: "0.8s" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="#10B981"
                  >
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
                  </svg>
                </div>

                <div className="absolute top-[18%] right-[30%] opacity-60">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="#D1D5DB"
                  >
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
                  </svg>
                </div>

                <div className="absolute top-[40%] left-[22%] opacity-50">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="#D1D5DB"
                  >
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
                  </svg>
                </div>

                <div className="absolute top-[35%] left-[16%] text-gray-400 font-bold text-lg select-none">
                  +
                </div>
                <div className="absolute top-[15%] right-[22%] text-gray-400 font-bold text-lg select-none">
                  +
                </div>
                <div className="absolute bottom-[10%] right-[20%] text-gray-400 font-bold text-lg select-none">
                  +
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[#101828] font-bold text-2xl font-sans tracking-tight mb-3">
                Hoàn tất kết nối ShopeeFood!
              </h3>

              {/* Body description */}
              <p className="text-[#475467] text-[14px] leading-relaxed mb-8 max-w-[380px]">
                Nhà hàng đã sẵn sàng nhận đơn{" "}
                <span className="font-semibold text-[#101828]">ShopeeFood</span>{" "}
                ngay trên{" "}
                <span className="font-semibold text-[#101828]">
                  MISA CukCuk
                </span>
                . Đơn hàng và thực đơn sẽ được đồng bộ tự động, giúp bán hàng
                nhanh và chính xác hơn.
              </p>

              {/* Action button */}
              <button
                type="button"
                onClick={() => {
                  setIsShopeeSuccessModalOpen(false);
                }}
                className="w-full bg-[#245FDF] hover:bg-[#1B4EBA] text-white text-[14px] font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer text-center flex items-center justify-center shadow-md active:scale-[0.98] border-none"
              >
                Bắt đầu bán hàng
              </button>
            </div>
          </div>
        )}

        {/* 💠 Add/Edit Time Group Popup Modal for Connected Screen */}
        {isTimeGroupModalOpen && (
          <div className="fixed inset-0 bg-black/40 z-[10005] flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="bg-white rounded-xl shadow-2xl border border-[#D5D7DA] w-full max-w-[620px] overflow-hidden flex flex-col text-left">
              {/* 1️⃣ Header */}
              <div className="bg-white border-b border-[#E9EAEB] px-4 py-3 flex items-center justify-between text-[#101828] select-none">
                <h3 className="text-[#101828] font-semibold text-sm font-sans tracking-wide m-0">
                  {editingTimeGroup
                    ? "Sửa khung giờ"
                    : "Thêm khung giờ"}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onNotification(
                        "Hệ thống trợ giúp CukCuk 2.0 đang tải...",
                        "info",
                      )
                    }
                    className="text-[#717680] hover:text-[#245FDF] p-1.5 hover:bg-gray-100 rounded transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                    title="Trợ giúp"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTimeGroupModalOpen(false)}
                    className="text-[#717680] hover:text-red-500 p-1.5 hover:bg-gray-100 rounded transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                    title="Đóng"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2️⃣ Body content */}
              <div className="p-5 space-y-4 flex-1">
                {/* Row 1: Tên khung giờ */}
                <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                  <label className="text-[13px] font-sans text-gray-700 font-medium">
                    Tên khung giờ{" "}
                    <span className="text-red-500 font-bold">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={timeGroupName}
                    onChange={(e) =>
                      setTimeGroupName(e.target.value)
                    }
                    placeholder="Ví dụ: Thứ 3 Thứ 6"
                    className="w-full h-8 px-3 border border-[#D5D7DA] rounded text-[#101828] text-[13px] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/20 font-sans"
                  />
                </div>

                {/* Row 2: Khung giờ hoạt động (Multi-select dropdown) */}
                <div className="grid grid-cols-[160px_1fr] gap-4 relative items-center">
                  <label className="text-[13px] font-sans text-gray-700 font-medium">
                    Khung giờ hoạt động
                  </label>
                  <div>
                    <div
                      className="flex flex-wrap items-center gap-1.5 p-1 px-2 border border-[#D5D7DA] rounded min-h-[32px] bg-white relative cursor-pointer"
                      onClick={() =>
                        setIsTagDropdownOpen(!isTagDropdownOpen)
                      }
                    >
                      <div className="flex flex-wrap gap-1 items-center flex-1 pr-6 select-none">
                        {timeGroupRange
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 hover:bg-gray-200 text-[#101828] text-[12px] font-sans px-2 py-0.5 rounded flex items-center gap-1 border border-[#E9EAEB] transition-colors"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextTags = timeGroupRange
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                    .filter(
                                      (_, tIdx) => tIdx !== idx,
                                    );
                                  setTimeGroupRange(
                                    nextTags.join(", "),
                                  );
                                }}
                                className="text-gray-400 hover:text-red-500 font-bold p-0 border-none bg-transparent cursor-pointer flex items-center justify-center text-[10px] w-3 h-3 rounded-full hover:bg-gray-200"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        {(!timeGroupRange ||
                          !timeGroupRange.trim()) && (
                          <span className="text-gray-400 text-xs font-sans pl-1">
                            Nhấp để chọn khung giờ...
                          </span>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-[#717680] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Dropdown element with overlay to close */}
                    {isTagDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[10005] bg-transparent"
                          onClick={() =>
                            setIsTagDropdownOpen(false)
                          }
                        />
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-[#D5D7DA] rounded shadow-lg z-[10006] max-h-[180px] overflow-y-auto p-1 text-left font-sans text-xs">
                          <div className="p-1.5 border-b border-[#E9EAEB] flex items-center justify-between text-gray-500 text-[11px] font-medium select-none">
                            <span>Khung giờ từ Bước 1</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const allActive =
                                    shopeeOperatingDays
                                      .filter((d) => d.active)
                                      .map(
                                        (d) =>
                                          `${d.name} (${d.ranges.map((r: any) => `${r.from}-${r.to}`).join(", ")})`,
                                      );
                                  setTimeGroupRange(
                                    allActive.join(", "),
                                  );
                                }}
                                className="text-[#245FDF] hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer text-[10px]"
                              >
                                Chọn tất cả
                              </button>
                              <span className="text-[#D5D7DA]">
                                |
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTimeGroupRange("");
                                }}
                                className="text-[#717680] hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer text-[10px]"
                              >
                                Xóa chọn
                              </button>
                            </div>
                          </div>
                          <div className="py-1 space-y-0.5">
                            {shopeeOperatingDays
                              .filter((d) => d.active)
                              .map((d) => {
                                const formattedRange = d.ranges
                                  .map(
                                    (r: any) =>
                                      `${r.from}-${r.to}`,
                                  )
                                  .join(", ");
                                const dayString = `${d.name} (${formattedRange})`;
                                const currentTags = timeGroupRange
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean);
                                const isSelected =
                                  currentTags.includes(dayString);
                                return (
                                  <label
                                    key={d.id}
                                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F0F6FE] rounded cursor-pointer select-none text-[#101828]"
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {
                                        let nextTags = [
                                          ...currentTags,
                                        ];
                                        if (isSelected) {
                                          nextTags =
                                            nextTags.filter(
                                              (t) =>
                                                t !== dayString,
                                            );
                                        } else {
                                          nextTags.push(
                                            dayString,
                                          );
                                        }
                                        const dayOrder = [
                                          "T2",
                                          "T3",
                                          "T4",
                                          "T5",
                                          "T6",
                                          "T7",
                                          "CN",
                                        ];
                                        nextTags.sort((a, b) => {
                                          const dayA =
                                            a.split(" ")[0];
                                          const dayB =
                                            b.split(" ")[0];
                                          return (
                                            dayOrder.indexOf(
                                              dayA,
                                            ) -
                                            dayOrder.indexOf(dayB)
                                          );
                                        });
                                        setTimeGroupRange(
                                          nextTags.join(", "),
                                        );
                                      }}
                                      className="w-3.5 h-3.5 text-[#245FDF] rounded border-[#D5D7DA] focus:ring-[#245FDF]/20"
                                    />
                                    <span className="text-xs font-sans">
                                      {dayString}
                                    </span>
                                  </label>
                                );
                              })}
                            {shopeeOperatingDays.filter(
                              (d) => d.active,
                            ).length === 0 && (
                              <div className="p-3 text-center text-gray-400 italic">
                                Chưa thiết lập ngày hoạt động nào
                                ở Bước 1
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Section Header: Chọn nhóm thực đơn áp dụng */}
                <div className="pt-3 border-t border-[#E9EAEB] mt-2">
                  <h4 className="text-[13px] font-sans font-bold text-[#101828] mb-1">
                    Chọn nhóm thực đơn áp dụng
                  </h4>

                  {/* Toolbar Lên / Xuống */}
                  <div className="flex items-center gap-4 py-1 border-b border-[#E9EAEB]">
                    <button
                      type="button"
                      disabled={
                        selectedMenuGroupIndex === null ||
                        selectedMenuGroupIndex === 0
                      }
                      onClick={() => {
                        if (
                          selectedMenuGroupIndex === null ||
                          selectedMenuGroupIndex === 0
                        )
                          return;
                        const newList = [...menuGroupList];
                        const temp =
                          newList[selectedMenuGroupIndex];
                        newList[selectedMenuGroupIndex] =
                          newList[selectedMenuGroupIndex - 1];
                        newList[selectedMenuGroupIndex - 1] = temp;
                        setMenuGroupList(newList);
                        setSelectedMenuGroupIndex(
                          selectedMenuGroupIndex - 1,
                        );
                      }}
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors bg-transparent border-none ${
                        selectedMenuGroupIndex !== null &&
                        selectedMenuGroupIndex > 0
                          ? "text-[#245FDF] hover:bg-[#F0F6FE] cursor-pointer"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      Lên
                    </button>
                    <button
                      type="button"
                      disabled={
                        selectedMenuGroupIndex === null ||
                        selectedMenuGroupIndex ===
                          menuGroupList.length - 1
                      }
                      onClick={() => {
                        if (
                          selectedMenuGroupIndex === null ||
                          selectedMenuGroupIndex ===
                            menuGroupList.length - 1
                        )
                          return;
                        const newList = [...menuGroupList];
                        const temp =
                          newList[selectedMenuGroupIndex];
                        newList[selectedMenuGroupIndex] =
                          newList[selectedMenuGroupIndex + 1];
                        newList[selectedMenuGroupIndex + 1] = temp;
                        setMenuGroupList(newList);
                        setSelectedMenuGroupIndex(
                          selectedMenuGroupIndex + 1,
                        );
                      }}
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors bg-transparent border-none ${
                        selectedMenuGroupIndex !== null &&
                        selectedMenuGroupIndex <
                          menuGroupList.length - 1
                          ? "text-[#245FDF] hover:bg-[#F0F6FE] cursor-pointer"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      Xuống
                    </button>
                  </div>

                  {/* Table of Menu Groups */}
                  <div className="border border-[#D5D7DA] rounded-lg overflow-hidden mt-2 bg-white flex flex-col min-h-[160px] max-h-[220px]">
                    <table className="w-full text-left border-collapse table-fixed flex-1 flex flex-col">
                      <thead className="bg-[#F7F7F8] border-b border-[#E9EAEB] flex-shrink-0 w-full">
                        <tr className="flex w-full">
                          <th className="w-[80px] py-2 text-center text-xs font-semibold text-gray-700 border-r border-[#E9EAEB] font-sans">
                            Thứ tự
                          </th>
                          <th className="flex-1 py-2 text-center text-xs font-semibold text-gray-700 font-sans">
                            Nhóm thực đơn
                          </th>
                        </tr>
                      </thead>
                      <tbody className="overflow-y-auto flex-1 w-full divide-y divide-[#E9EAEB]">
                        {menuGroupList.map((item, idx) => {
                          const isSelected =
                            selectedMenuGroupIndex === idx;
                          return (
                            <tr
                              key={idx}
                              onClick={() => {
                                setSelectedMenuGroupIndex(idx);
                              }}
                              onDoubleClick={() =>
                                setEditingMenuGroupIndex(idx)
                              }
                              className={`flex w-full transition-colors cursor-pointer select-none items-center ${
                                isSelected
                                  ? "bg-[#EDFCF4]"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <td className="w-[80px] py-2 text-right pr-4 text-xs text-[#101828] border-r border-[#E9EAEB] font-mono font-medium">
                                {idx + 1}
                              </td>
                              <td className="flex-1 py-1 text-left px-3 text-xs text-[#101828] font-sans">
                                {editingMenuGroupIndex === idx ? (
                                  <select
                                    value={item}
                                    autoFocus
                                    onChange={(e) => {
                                      const newList = [
                                        ...menuGroupList,
                                      ];
                                      newList[idx] = e.target.value;
                                      setMenuGroupList(newList);
                                    }}
                                    onBlur={() =>
                                      setEditingMenuGroupIndex(null)
                                    }
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                    className="w-full h-7 px-2 border border-[#245FDF] rounded focus:outline-none text-xs font-sans bg-white cursor-pointer"
                                  >
                                    <option value="">-- Chọn nhóm thực đơn --</option>
                                    <option value="Bánh gạo">Bánh gạo</option>
                                    <option value="Gà rán">Gà rán</option>
                                    <option value="Nước giải khát">Nước giải khát</option>
                                    <option value="Lẩu">Lẩu</option>
                                    <option value="Bia">Bia</option>
                                    <option value="Món chính">Món chính</option>
                                    <option value="Món ăn nhẹ">Món ăn nhẹ</option>
                                    <option value="Đồ uống lạnh">Đồ uống lạnh</option>
                                    <option value="Phở">Phở</option>
                                    <option value="Món ăn kèm">Món ăn kèm</option>
                                    <option value="Đồ uống">Đồ uống</option>
                                    <option value="Khai vị">Khai vị</option>
                                    <option value="Tráng miệng">Tráng miệng</option>
                                  </select>
                                ) : (
                                  <div className="py-1 min-h-[24px] flex items-center justify-between group/row">
                                    <span>
                                      {item || (
                                        <span className="text-gray-400 italic">
                                          (Chưa chọn nhóm)
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-gray-400 text-[10px] opacity-0 group-hover/row:opacity-100 transition-opacity font-sans">
                                      Double click để sửa
                                    </span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {menuGroupList.length === 0 && (
                          <tr className="flex w-full">
                            <td className="w-full text-center py-8 text-gray-400 italic text-xs font-sans">
                              Chưa có nhóm thực đơn nào. Vui lòng
                              thêm dòng.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Button Thêm dòng / Xóa dòng */}
                  <div className="flex items-center gap-2 mt-3 select-none">
                    <button
                      type="button"
                      onClick={() => {
                        const newList = [...menuGroupList, ""];
                        setMenuGroupList(newList);
                        setSelectedMenuGroupIndex(
                          newList.length - 1,
                        );
                        setEditingMenuGroupIndex(
                          newList.length - 1,
                        );
                      }}
                      className="h-8 px-3 bg-white hover:bg-gray-50 border border-[#D5D7DA] text-gray-700 rounded-lg flex items-center justify-center gap-1.5 text-xs font-sans font-medium transition-all cursor-pointer select-none"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#245FDF]" />
                      Thêm dòng
                    </button>
                    <button
                      type="button"
                      disabled={selectedMenuGroupIndex === null}
                      onClick={() => {
                        if (selectedMenuGroupIndex === null) return;
                        const newList = menuGroupList.filter(
                          (_, idx) =>
                            idx !== selectedMenuGroupIndex,
                        );
                        setMenuGroupList(newList);
                        setSelectedMenuGroupIndex(null);
                        setEditingMenuGroupIndex(null);
                      }}
                      className={`h-8 px-3 border rounded-lg flex items-center justify-center gap-1.5 text-xs font-sans font-medium transition-all select-none ${
                        selectedMenuGroupIndex !== null
                          ? "bg-white hover:bg-red-50 border-red-200 text-red-600 cursor-pointer"
                          : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      Xóa dòng
                    </button>
                  </div>
                </div>
              </div>

              {/* 3️⃣ Footer Action bar */}
              <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] px-5 py-3 flex items-center justify-end select-none">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTimeGroupModalOpen(false)}
                    className="h-8 min-w-[84px] px-4 bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] rounded-lg flex items-center justify-center text-xs font-sans font-medium transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTimeGroup}
                    className="h-8 min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white rounded-lg flex items-center justify-center text-xs font-sans font-semibold transition-all cursor-pointer border-none shadow-sm"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 💠 EDIT SHOPEEFOOD MENU GROUP POPUP MODAL */}
        {isEditingShopeeGroup && editingShopeeGroup && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10006] p-4 animate-fade-in text-left"
            onClick={() => {
              setIsEditingShopeeGroup(false);
              setEditingShopeeGroup(null);
            }}
          >
            <div
              className="bg-white flex flex-col w-full max-w-[500px] overflow-hidden shadow-2xl relative animate-scale-up"
              style={{ borderRadius: "12px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div
                className="flex items-center justify-between px-6 bg-white text-[#101828] border-b border-[#E9EAEB] select-none"
                style={{ height: "62px" }}
              >
                <h3 className="text-[#101828] font-semibold text-[16px] font-sans m-0">
                  Sửa nhóm thực đơn
                </h3>
                <button
                  onClick={() => {
                    setIsEditingShopeeGroup(false);
                    setEditingShopeeGroup(null);
                  }}
                  className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Form */}
              <div className="p-6 space-y-4 text-left">
                {/* Field 1: Tên nhóm */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#101828] font-sans">
                    Tên nhóm thực đơn <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingShopeeGroup.name}
                    onChange={(e) =>
                      setEditingShopeeGroup({
                        ...editingShopeeGroup,
                        name: e.target.value,
                      })
                    }
                    placeholder="Nhập tên nhóm thực đơn..."
                    className="w-full h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none text-[13px] text-[#101828] font-sans"
                    autoFocus
                  />
                </div>

                {/* Field 2: Mô tả */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#101828] font-sans">
                    Mô tả
                  </label>
                  <textarea
                    rows={3}
                    value={editingShopeeGroup.description || ""}
                    onChange={(e) =>
                      setEditingShopeeGroup({
                        ...editingShopeeGroup,
                        description: e.target.value,
                      })
                    }
                    placeholder="Nhập mô tả cho nhóm thực đơn..."
                    className="w-full p-2.5 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none text-[13px] text-[#101828] font-sans resize-none"
                  />
                </div>

                {/* Field 3: Trạng thái */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#101828] font-sans">
                    Trạng thái
                  </label>
                  <select
                    value={editingShopeeGroup.status}
                    onChange={(e) =>
                      setEditingShopeeGroup({
                        ...editingShopeeGroup,
                        status: e.target.value,
                      })
                    }
                    className="w-full h-[32px] px-2.5 border border-[#D5D7DA] focus:border-[#245FDF] rounded-[8px] bg-white text-[13px] text-[#101828] outline-none font-sans cursor-pointer"
                  >
                    <option value="Có bán">Có bán</option>
                    <option value="Ngừng bán">Ngừng bán</option>
                  </select>
                </div>
              </div>

              {/* Footer Action */}
              <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 py-3 flex items-center justify-end h-14 select-none">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingShopeeGroup(false);
                      setEditingShopeeGroup(null);
                    }}
                    className="h-[32px] min-w-[84px] px-4 bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] rounded-[8px] flex items-center justify-center text-[13px] font-sans font-medium transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingShopeeGroup.name.trim()) {
                        onNotification(
                          "Tên nhóm thực đơn không được để trống",
                          "error",
                        );
                        return;
                      }
                      
                      // Find original name
                      const oldGroup = shopeeMenuGroups.find(g => g.id === editingShopeeGroup.id);
                      const oldName = oldGroup?.name;

                      // Update main list
                      const updated = shopeeMenuGroups.map((g) =>
                        g.id === editingShopeeGroup.id ? editingShopeeGroup : g
                      );
                      setShopeeMenuGroups(updated);

                      // If name changed, keep shopeeMenuItems synced
                      if (oldName && oldName !== editingShopeeGroup.name) {
                        const updatedItems = shopeeMenuItems.map(item => {
                          if (item.category === oldName) {
                            return { ...item, category: editingShopeeGroup.name };
                          }
                          return item;
                        });
                        setShopeeMenuItems(updatedItems);
                      }

                      setIsEditingShopeeGroup(false);
                      setEditingShopeeGroup(null);
                      onNotification(
                        "Đã lưu thông tin nhóm thực đơn thành công",
                        "success",
                      );
                    }}
                    className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white rounded-[8px] flex items-center justify-center text-[13px] font-sans font-semibold transition-all cursor-pointer border-none shadow-sm"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 💠 CHỌN MÓN POPUP MODAL FOR CONNECTED SCREEN */}
        {isChooseDishModalOpen && (
          <div className="fixed inset-0 bg-black/40 z-[10010] flex items-center justify-center p-4 animate-fade-in text-left">
            <div
              className="bg-white flex flex-col w-full max-w-[960px] max-h-[85vh] shadow-2xl relative animate-scale-up select-none overflow-hidden"
              style={{ borderRadius: "12px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal - White Background, Black Title */}
              <div
                className="flex items-center justify-between px-6 bg-white border-b border-[#E9EAEB] text-[#101828] flex-shrink-0"
                style={{ height: "48px" }}
              >
                <h3 className="text-[#101828] font-semibold text-[16px] font-sans">
                  Chọn món
                </h3>
                <button
                  type="button"
                  onClick={() => setIsChooseDishModalOpen(false)}
                  className="text-[#717680] hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent outline-none flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instruction Banner */}
              <div className="bg-[#F5F8FF] border-b border-[#E0E8F9] px-6 py-2.5 flex items-start gap-2.5 text-xs text-[#101828] font-sans flex-shrink-0">
                <Info className="w-4 h-4 text-[#245FDF] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#245FDF]">Hướng dẫn:</span> Tích chọn các món ăn từ danh sách món của MISA CukCuk dưới đây để đồng bộ và thêm trực tiếp vào danh sách Thực đơn ShopeeFood của nhà hàng.
                </div>
              </div>

              {/* Filter and Top Controls Row */}
              <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-b border-[#E9EAEB] bg-white flex-shrink-0">
                {/* Loại món */}
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#717680] font-sans whitespace-nowrap">
                    Loại món
                  </span>
                  <div className="relative">
                    <select
                      value={chooseDishLoaiMon}
                      onChange={(e) => setChooseDishLoaiMon(e.target.value)}
                      className="h-[32px] pl-3 pr-8 text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all text-[#101828] font-sans cursor-pointer appearance-none min-w-[150px]"
                    >
                      <option value="Tất cả loại món">Tất cả loại món</option>
                      <option value="Món ăn">Món ăn</option>
                      <option value="Đồ uống">Đồ uống</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Nhóm thực đơn */}
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#717680] font-sans whitespace-nowrap">
                    Nhóm thực đơn
                  </span>
                  <div className="relative">
                    <select
                      value={chooseDishNhomThucDon}
                      onChange={(e) =>
                        setChooseDishNhomThucDon(e.target.value)
                      }
                      className="h-[32px] pl-3 pr-8 text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all text-[#101828] font-sans cursor-pointer appearance-none min-w-[180px]"
                    >
                      <option value="Chọn nhóm thực đơn">
                        Chọn nhóm thực đơn
                      </option>
                      <option value="Món chính">Món chính</option>
                      <option value="Món ăn nhẹ">Món ăn nhẹ</option>
                      <option value="Đồ uống lạnh">Đồ uống lạnh</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Quick Search */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Nhập mã món, tên món"
                    value={chooseDishTopSearch}
                    onChange={(e) => setChooseDishTopSearch(e.target.value)}
                    className="w-full px-3 h-[32px] text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all placeholder:text-[#A4A7AE] text-[#101828] font-sans"
                  />
                </div>

                {/* Lấy dữ liệu button */}
                <button
                  type="button"
                  onClick={() => {
                    onNotification(
                      "Đã cập nhật dữ liệu danh sách món ăn từ MISA CukCuk!",
                      "success",
                    );
                  }}
                  className="bg-[#245FDF] hover:bg-[#1B4EBA] text-white font-medium text-[13px] px-4 rounded-[8px] flex items-center justify-center gap-1.5 transition-all h-[32px] cursor-pointer border-none shadow-sm font-sans flex-shrink-0"
                  style={{ minWidth: "84px" }}
                >
                  <Search className="w-4 h-4" />
                  <span>Lấy dữ liệu</span>
                </button>
              </div>

              {/* Table Area (Scrollable body) */}
              <div className="flex-1 overflow-auto min-h-[300px] bg-white">
                <table className="w-full border-collapse text-left text-[13px] table-fixed">
                  <thead className="sticky top-0 bg-[#F7F7F8] z-10">
                    {/* First Header Row: Column Titles */}
                    <tr className="border-b border-[#E9EAEB]">
                      {/* Checkbox */}
                      <th className="p-2 w-[40px] text-center border-r border-[#E9EAEB]">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="checkbox"
                            checked={isAllModalSelected}
                            onChange={toggleSelectAllModal}
                            className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                          />
                        </div>
                      </th>

                      {/* Mã món */}
                      <th className="p-2 w-[120px] text-center text-[#101828] font-bold border-r border-[#E9EAEB]">
                        <div className="flex items-center justify-center h-full">
                          <span>Mã món</span>
                        </div>
                      </th>

                      {/* Tên món */}
                      <th className="p-2 min-w-[200px] text-center text-[#101828] font-bold border-r border-[#E9EAEB]">
                        <div className="flex items-center justify-center h-full">
                          <span>Tên món</span>
                        </div>
                      </th>

                      {/* Nhóm thực đơn */}
                      <th className="p-2 w-[180px] text-center text-[#101828] font-bold border-r border-[#E9EAEB]">
                        <div className="flex items-center justify-center h-full">
                          <span>Nhóm thực đơn</span>
                        </div>
                      </th>

                      {/* Đơn vị tính */}
                      <th className="p-2 w-[110px] text-center text-[#101828] font-bold border-r border-[#E9EAEB]">
                        <div className="flex items-center justify-center h-full">
                          <span>Đơn vị tính</span>
                        </div>
                      </th>

                      {/* Giá bán */}
                      <th className="p-2 w-[130px] text-center text-[#101828] font-bold">
                        <div className="flex items-center justify-center h-full">
                          <span>Giá bán</span>
                        </div>
                      </th>
                    </tr>

                    {/* Second Header Row: Column Filters */}
                    <tr className="border-b border-[#E9EAEB]">
                      {/* Checkbox cell */}
                      <th className="p-1 border-r border-[#E9EAEB]"></th>

                      {/* Mã món Filter */}
                      <th className="p-1.5 border-r border-[#E9EAEB]">
                        <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                          <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                            *
                          </div>
                          <input
                            type="text"
                            value={chooseDishFilterCode}
                            onChange={(e) =>
                              setChooseDishFilterCode(e.target.value)
                            }
                            className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                          />
                        </div>
                      </th>

                      {/* Tên món Filter */}
                      <th className="p-1.5 border-r border-[#E9EAEB]">
                        <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                          <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                            *
                          </div>
                          <input
                            type="text"
                            value={chooseDishFilterName}
                            onChange={(e) =>
                              setChooseDishFilterName(e.target.value)
                            }
                            className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                          />
                        </div>
                      </th>

                      {/* Nhóm thực đơn Filter */}
                      <th className="p-1.5 border-r border-[#E9EAEB]">
                        <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                          <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                            *
                          </div>
                          <input
                            type="text"
                            value={chooseDishFilterCategory}
                            onChange={(e) =>
                              setChooseDishFilterCategory(e.target.value)
                            }
                            className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                          />
                        </div>
                      </th>

                      {/* Đơn vị tính Filter */}
                      <th className="p-1.5 border-r border-[#E9EAEB]">
                        <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                          <div className="px-2 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                            *
                          </div>
                          <input
                            type="text"
                            value={chooseDishFilterUnit}
                            onChange={(e) =>
                              setChooseDishFilterUnit(e.target.value)
                            }
                            className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                          />
                        </div>
                      </th>

                      {/* Giá bán Filter */}
                      <th className="p-1.5">
                        <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[28px] items-center font-normal">
                          <div className="px-1.5 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                            ≤
                          </div>
                          <input
                            type="text"
                            value={chooseDishFilterPrice}
                            onChange={(e) => {
                              const raw = e.target.value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              setChooseDishFilterPrice(raw);
                            }}
                            className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828] text-right"
                          />
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredModalDishes.length > 0 ? (
                      filteredModalDishes.map((item) => {
                        const isSelected = chooseDishSelectedIds.includes(
                          item.id,
                        );
                        return (
                          <tr
                            key={item.id}
                            onClick={() => toggleSelectRowModal(item.id)}
                            className={`border-b border-[#E9EAEB] hover:bg-gray-50 cursor-pointer h-[40px] transition-colors ${
                              isSelected
                                ? "bg-[#F0F6FE]/70 hover:bg-[#F0F6FE]"
                                : ""
                            }`}
                          >
                            {/* Checkbox */}
                            <td
                              className="p-2 border-r border-[#E9EAEB] text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectRowModal(item.id)}
                                className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                              />
                            </td>

                            {/* Mã món */}
                            <td className="p-2 border-r border-[#E9EAEB] text-[#101828] text-left font-mono">
                              {item.code}
                            </td>

                            {/* Tên món */}
                            <td className="p-2 border-r border-[#E9EAEB] text-[#101828] text-left font-medium">
                              {item.name}
                            </td>

                            {/* Nhóm thực đơn */}
                            <td className="p-2 border-r border-[#E9EAEB] text-[#101828] text-left">
                              {item.category}
                            </td>

                            {/* Đơn vị tính */}
                            <td className="p-2 border-r border-[#E9EAEB] text-[#101828] text-left">
                              {item.unit}
                            </td>

                            {/* Giá bán */}
                            <td className="p-2 text-[#101828] text-right font-semibold">
                              {item.price.toLocaleString("vi-VN")}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <svg
                              className="w-16 h-16 text-gray-300 mb-2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                              />
                            </svg>
                            <span className="text-[14px] text-gray-400 font-medium">
                              Không có dữ liệu
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Row in Modal */}
              <div className="h-[44px] bg-[#F7F7F8] border-t border-[#E9EAEB] flex items-center justify-between px-6 flex-shrink-0 select-none text-[12px] text-[#717680]">
                {/* Left Controls: first, prev, input, next, last, refresh, size */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled
                    className="p-1 text-[#A4A7AE] cursor-not-allowed hover:bg-gray-200 rounded"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled
                    className="p-1 text-[#A4A7AE] cursor-not-allowed hover:bg-gray-200 rounded"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="flex items-center gap-1 font-sans">
                    Trang
                    <input
                      type="text"
                      value="1"
                      readOnly
                      className="w-8 h-5 text-center border border-[#D5D7DA] rounded bg-white text-[#101828] font-semibold outline-none font-sans"
                    />
                    trên 1
                  </span>
                  <button
                    type="button"
                    disabled
                    className="p-1 text-[#A4A7AE] cursor-not-allowed hover:bg-gray-200 rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled
                    className="p-1 text-[#A4A7AE] cursor-not-allowed hover:bg-gray-200 rounded"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChooseDishFilterCode("");
                      setChooseDishFilterName("");
                      setChooseDishFilterCategory("");
                      setChooseDishFilterUnit("");
                      setChooseDishFilterPrice("");
                      setChooseDishTopSearch("");
                      setChooseDishLoaiMon("Tất cả loại món");
                      setChooseDishNhomThucDon("Chọn nhóm thực đơn");
                      onNotification("Đã tải lại danh sách món ăn", "info");
                    }}
                    className="p-1 text-[#717680] hover:text-[#101828] hover:bg-gray-200 rounded cursor-pointer"
                    title="Tải lại"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <div className="relative">
                    <div className="flex items-center border border-[#D5D7DA] bg-white rounded px-2 py-0.5 h-6 select-none font-semibold text-[#101828] gap-1 font-sans">
                      <span>100</span>
                      <ChevronDown className="w-3 h-3 text-[#717680]" />
                    </div>
                  </div>
                </div>

                {/* Right Status */}
                <div className="font-sans">
                  Hiển thị 1 - {filteredModalDishes.length} trên{" "}
                  {filteredModalDishes.length} kết quả
                </div>
              </div>

              {/* Footer Action Bar */}
              <div className="h-[56px] bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsChooseDishModalOpen(false)}
                  className="h-[32px] min-w-[84px] px-4 bg-white border border-[#D5D7DA] hover:bg-gray-50 text-[#101828] font-normal text-[13px] rounded-[8px] transition-colors cursor-pointer flex items-center justify-center font-sans"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const selectedDishes = chooseDishAvailableItems.filter(
                      (item) => chooseDishSelectedIds.includes(item.id),
                    );
                    if (selectedDishes.length === 0) {
                      onNotification(
                        "Vui lòng chọn ít nhất 1 món ăn để đồng ý!",
                        "info",
                      );
                      return;
                    }

                    // Add them to wizardCukCukDishes if not already present
                    setWizardCukCukDishes((prev) => {
                      const updated = [...prev];
                      selectedDishes.forEach((dish) => {
                        const targetId = `cc_added_${dish.id}`;
                        if (!updated.some((cc) => cc.id === targetId)) {
                          updated.push({
                            id: targetId,
                            name: dish.name,
                            code: dish.code,
                          });
                        }
                      });
                      return updated;
                    });

                    // Append to wizardFoods (for Step 2 display)
                    const newWizardFoods = selectedDishes.map(
                      (dish, index) => ({
                        id: `wizard_added_${dish.id}_${Date.now()}`,
                        name: dish.name,
                        category: dish.category,
                        unit: dish.unit,
                        price: dish.price,
                        status: "Có bán",
                        fromCukCuk: true, // Mark as coming from CukCuk
                        linkedDishId: `cc_added_${dish.id}`, // Linked to itself!
                        image: undefined, // default placeholder
                      }),
                    );

                    // Append to shopeeMenuItems (for outer page)
                    const nextOuterId = Math.max(
                      ...shopeeMenuItems.map((i) => i.id),
                      100,
                    );
                    const newOuterFoods = selectedDishes.map(
                      (dish, index) => ({
                        id: nextOuterId + index + 1,
                        name: dish.name,
                        category: dish.category,
                        unit: dish.unit,
                        price: dish.price,
                        status: "Có bán",
                        isLinked: true, // It is already linked
                        image: undefined,
                      }),
                    );

                    setWizardFoods((prev) => [...prev, ...newWizardFoods]);
                    setShopeeMenuItems((prev) => [...prev, ...newOuterFoods]);

                    setIsChooseDishModalOpen(false);
                    onNotification(
                      `Đã chọn và đồng bộ thêm ${selectedDishes.length} món ăn mới thành công!`,
                      "success",
                    );
                  }}
                  className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] border-none text-white font-normal text-[13px] rounded-[8px] transition-colors cursor-pointer flex items-center justify-center shadow-sm font-sans"
                >
                  Đồng ý
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 💠 VIEW DISHES POPUP MODAL */}
        {isViewingDishesModalOpen && viewDishesGroupName && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10006] p-4 animate-fade-in text-left"
            onClick={() => {
              setIsViewingDishesModalOpen(false);
              setViewDishesGroupName(null);
            }}
          >
            <div
              className="bg-white flex flex-col w-full max-w-[640px] overflow-hidden shadow-2xl relative animate-scale-up"
              style={{ borderRadius: "12px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div
                className="flex items-center justify-between px-6 bg-white text-[#101828] border-b border-[#E9EAEB] select-none"
                style={{ height: "62px" }}
              >
                <h3 className="text-[#101828] font-semibold text-[16px] font-sans m-0">
                  Món ăn trong nhóm "{viewDishesGroupName}"
                </h3>
                <button
                  onClick={() => {
                    setIsViewingDishesModalOpen(false);
                    setViewDishesGroupName(null);
                  }}
                  className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content: Dishes Table */}
              <div className="p-0 overflow-y-auto max-h-[400px]">
                {(() => {
                  const dishes = shopeeMenuItems.filter(
                    (item) => item.category === viewDishesGroupName
                  );

                  if (dishes.length === 0) {
                    return (
                      <div className="py-12 text-center text-[#A4A7AE] text-[13px] font-sans bg-white">
                        Không có món ăn nào trong nhóm thực đơn này.
                      </div>
                    );
                  }

                  return (
                    <table className="w-full text-left border-collapse select-none">
                      <thead className="sticky top-0 bg-[#F7F7F8] z-10 border-b border-[#E9EAEB]">
                        <tr className="bg-[#F7F7F8] text-[12px] text-[#101828] font-semibold">
                          <th className="px-4 py-3 font-semibold font-sans text-left">Tên món ăn</th>
                          <th className="px-4 py-3 font-semibold font-sans text-left">Đơn vị tính</th>
                          <th className="px-4 py-3 font-semibold font-sans text-right">Đơn giá</th>
                          <th className="px-4 py-3 font-semibold font-sans text-left">Trạng thái</th>
                          <th className="px-4 py-3 font-semibold font-sans text-center">Đã liên kết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dishes.map((dish) => (
                          <tr
                            key={dish.id}
                            className="border-b border-[#E9EAEB] hover:bg-[#F8F9FA] h-12 text-[13px] font-sans text-[#101828]"
                          >
                            {/* Name & Thumbnail */}
                            <td className="px-4 py-2 font-medium text-[#101828] text-left">
                              <div className="flex items-center gap-2.5">
                                {dish.image ? (
                                  <img
                                    src={dish.image}
                                    alt={dish.name}
                                    referrerPolicy="no-referrer"
                                    className="w-8 h-8 rounded-md object-cover border border-[#E9EAEB]"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-md bg-[#EDFCF4] text-[#245FDF] font-semibold text-[11px] flex items-center justify-center border border-[#E9EAEB]">
                                    Food
                                  </div>
                                )}
                                <span>{dish.name}</span>
                              </div>
                            </td>

                            {/* Unit */}
                            <td className="px-4 py-2 text-[#717680] text-left">
                              {dish.unit}
                            </td>

                            {/* Unit Price */}
                            <td className="px-4 py-2 text-right font-mono text-[#101828]">
                              {dish.price.toLocaleString("vi-VN")}đ
                            </td>

                            {/* Status */}
                            <td className="px-4 py-2 text-left">
                              {dish.status === "Có bán" ? (
                                <span className="inline-flex items-center gap-1 text-[12px] font-sans font-semibold text-[#12B76A]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]"></span>
                                  Có bán
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[12px] font-sans font-semibold text-[#F04438]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#F04438]"></span>
                                  Ngừng bán
                                </span>
                              )}
                            </td>

                            {/* Link status */}
                            <td className="px-4 py-2 text-center">
                              {dish.isLinked ? (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-[4px] bg-[#EDFCF4] border border-[#12B76A] text-[11px] text-[#12B76A] font-semibold font-sans">
                                  Đã liên kết
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-[4px] bg-gray-50 border border-[#D5D7DA] text-[11px] text-[#717680] font-semibold font-sans">
                                  Chưa liên kết
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>

              {/* Footer Action */}
              <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 py-3 flex items-center justify-end h-14 select-none">
                <button
                  type="button"
                  onClick={() => {
                    setIsViewingDishesModalOpen(false);
                    setViewDishesGroupName(null);
                  }}
                  className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white rounded-[8px] flex items-center justify-center text-[13px] font-sans font-semibold transition-all cursor-pointer border-none shadow-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 💠 LINK CUKCUK MENU GROUP POPUP MODAL */}
        {isLinkCukCukMenuGroupModalOpen && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10006] p-4 animate-fade-in text-left"
            onClick={() => setIsLinkCukCukMenuGroupModalOpen(false)}
          >
            <div
              className="bg-white flex flex-col w-full max-w-[600px] overflow-hidden shadow-2xl relative animate-scale-up"
              style={{ borderRadius: "12px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="h-[62px] px-6 border-b border-[#E9EAEB] flex items-center justify-between bg-white flex-shrink-0">
                <h3 className="text-[16px] font-semibold text-[#101828] font-sans">
                  Chọn nhóm thực đơn liên kết với MISA CukCuk
                </h3>
                <button
                  type="button"
                  onClick={() => setIsLinkCukCukMenuGroupModalOpen(false)}
                  className="p-1 hover:bg-[#EDFCF4] hover:text-[#245FDF] text-[#717680] rounded-lg transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow overflow-y-auto max-h-[400px]">
                {/* Search Bar */}
                <div className="relative w-full mb-4">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717680]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm mã, tên nhóm..."
                    value={menuGroupPopupSearch}
                    onChange={(e) => setMenuGroupPopupSearch(e.target.value)}
                    className="w-full h-[32px] pl-9 pr-3 text-[13px] border border-[#D5D7DA] rounded-[8px] bg-[#F5F5F5] focus:bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans transition-all"
                  />
                </div>

                {/* Table */}
                <div className="border border-[#E9EAEB] rounded-[8px] overflow-hidden bg-white">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB] text-[12px] h-9">
                        <th className="w-12 text-center align-middle font-semibold text-[#717680] border-r border-[#E9EAEB]">Chọn</th>
                        <th className="px-4 text-center align-middle font-semibold text-[#717680] border-r border-[#E9EAEB]">Mã nhóm</th>
                        <th className="px-4 text-center align-middle font-semibold text-[#717680]">Tên nhóm thực đơn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wizardCukCukMenuGroups
                        .filter((cg) => {
                          const query = menuGroupPopupSearch.toLowerCase();
                          return (
                            cg.name.toLowerCase().includes(query) ||
                            cg.code.toLowerCase().includes(query)
                          );
                        })
                        .map((cg) => {
                          const isSelected = selectedCukCukMenuGroupId === cg.id;
                          return (
                            <tr
                              key={cg.id}
                              onClick={() => setSelectedCukCukMenuGroupId(cg.id)}
                              className={`h-10 border-b border-[#E9EAEB] last:border-b-0 hover:bg-[#EDFCF4] cursor-pointer transition-colors text-[13px] ${
                                isSelected ? "bg-[#EDFCF4]" : ""
                              }`}
                            >
                              <td className="text-center align-middle border-r border-[#E9EAEB]">
                                <input
                                  type="radio"
                                  name="cukcukMenuGroup"
                                  checked={isSelected}
                                  onChange={() => setSelectedCukCukMenuGroupId(cg.id)}
                                  className="w-4.5 h-4.5 text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="px-4 text-left border-r border-[#E9EAEB] font-medium text-[#101828] font-mono">
                                {cg.code}
                              </td>
                              <td className="px-4 text-left font-normal text-[#101828]">
                                {cg.name}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="h-[56px] px-6 bg-[#FAFAFA] border-t border-[#E9EAEB] flex items-center justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsLinkCukCukMenuGroupModalOpen(false)}
                  className="h-[32px] min-w-[84px] px-4 bg-white hover:bg-gray-50 text-[#717680] border border-[#D5D7DA] rounded-[8px] flex items-center justify-center text-[13px] font-sans font-semibold transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={!selectedCukCukMenuGroupId}
                  onClick={() => {
                    const group = shopeeMenuGroups.find((g) => g.id === linkingShopeeMenuGroupId);
                    const ccGroup = wizardCukCukMenuGroups.find((cc) => cc.id === selectedCukCukMenuGroupId);
                    if (group && ccGroup) {
                      // Update Shopee Food Menu Groups
                      setShopeeMenuGroups((prev) =>
                        prev.map((g) => (g.id === group.id ? { ...g, linkedGroupId: ccGroup.id } : g))
                      );
                      // Update Wizard Menu Groups for parity
                      setWizardMenuGroups((prev) =>
                        prev.map((g) => (g.name === group.name ? { ...g, linkedGroupId: ccGroup.id } : g))
                      );
                      // Auto-link dishes inside
                      setWizardFoods((prev) =>
                        prev.map((f) => (f.category === group.name ? { ...f, linkedDishId: `cc_food_${f.id}` } : f))
                      );
                      onNotification(`Đã liên kết nhóm "${group.name}" với MISA CukCuk "${ccGroup.name}" thành công`, "success");
                    }
                    setIsLinkCukCukMenuGroupModalOpen(false);
                  }}
                  className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-[8px] flex items-center justify-center text-[13px] font-sans font-semibold transition-all cursor-pointer border-none shadow-sm"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 💠 LINK CUKCUK OPTION GROUP POPUP MODAL */}
        {isLinkCukCukOptionGroupModalOpen && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10006] p-4 animate-fade-in text-left"
            onClick={() => setIsLinkCukCukOptionGroupModalOpen(false)}
          >
            <div
              className="bg-white flex flex-col w-full max-w-[600px] overflow-hidden shadow-2xl relative animate-scale-up"
              style={{ borderRadius: "12px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="h-[62px] px-6 border-b border-[#E9EAEB] flex items-center justify-between bg-white flex-shrink-0">
                <h3 className="text-[16px] font-semibold text-[#101828] font-sans">
                  Chọn nhóm thực đơn liên kết
                </h3>
                <button
                  type="button"
                  onClick={() => setIsLinkCukCukOptionGroupModalOpen(false)}
                  className="p-1 hover:bg-[#EDFCF4] hover:text-[#245FDF] text-[#717680] rounded-lg transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow overflow-y-auto max-h-[400px]">
                {/* Search Bar */}
                <div className="relative w-full mb-4">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717680]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm mã, tên nhóm..."
                    value={optionGroupPopupSearch}
                    onChange={(e) => setOptionGroupPopupSearch(e.target.value)}
                    className="w-full h-[32px] pl-9 pr-3 text-[13px] border border-[#D5D7DA] rounded-[8px] bg-[#F5F5F5] focus:bg-white text-[#101828] outline-none focus:border-[#245FDF] font-sans transition-all"
                  />
                </div>

                {/* Table */}
                <div className="border border-[#E9EAEB] rounded-[8px] overflow-hidden bg-white">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB] text-[12px] h-9">
                        <th className="w-12 text-center align-middle font-semibold text-[#717680] border-r border-[#E9EAEB]">Chọn</th>
                        <th className="px-4 text-center align-middle font-semibold text-[#717680] border-r border-[#E9EAEB]">Mã nhóm</th>
                        <th className="px-4 text-center align-middle font-semibold text-[#717680]">Tên nhóm thực đơn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wizardCukCukStpvGroups
                        .filter((cg) => {
                          const query = optionGroupPopupSearch.toLowerCase();
                          return (
                            cg.name.toLowerCase().includes(query) ||
                            cg.code.toLowerCase().includes(query)
                          );
                        })
                        .map((cg) => {
                          const isSelected = selectedCukCukOptionGroupId === cg.id;
                          return (
                            <tr
                              key={cg.id}
                              onClick={() => setSelectedCukCukOptionGroupId(cg.id)}
                              className={`h-10 border-b border-[#E9EAEB] last:border-b-0 hover:bg-[#EDFCF4] cursor-pointer transition-colors text-[13px] ${
                                isSelected ? "bg-[#EDFCF4]" : ""
                              }`}
                            >
                              <td className="text-center align-middle border-r border-[#E9EAEB]">
                                <input
                                  type="radio"
                                  name="cukcukOptionGroup"
                                  checked={isSelected}
                                  onChange={() => setSelectedCukCukOptionGroupId(cg.id)}
                                  className="w-4.5 h-4.5 text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="px-4 text-left border-r border-[#E9EAEB] font-medium text-[#101828] font-mono">
                                {cg.code}
                              </td>
                              <td className="px-4 text-left font-normal text-[#101828]">
                                {cg.name}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="h-[56px] px-6 bg-[#FAFAFA] border-t border-[#E9EAEB] flex items-center justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsLinkCukCukOptionGroupModalOpen(false)}
                  className="h-[32px] min-w-[84px] px-4 bg-white hover:bg-gray-50 text-[#717680] border border-[#D5D7DA] rounded-[8px] flex items-center justify-center text-[13px] font-sans font-semibold transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={!selectedCukCukOptionGroupId}
                  onClick={() => {
                    const group = optionGroups.find((g) => g.id === linkingShopeeOptionGroupId);
                    const ccGroup = wizardCukCukStpvGroups.find((cc) => cc.id === selectedCukCukOptionGroupId);
                    if (group && ccGroup) {
                      // Update Shopee Food Option Groups
                      setOptionGroups((prev) =>
                        prev.map((g) => (g.id === group.id ? { ...g, linkedGroupId: ccGroup.id } : g))
                      );
                      // Update Wizard Option Groups for parity
                      setWizardStpvGroups((prev) =>
                        prev.map((g) => (g.name === group.name ? { ...g, linkedGroupId: ccGroup.id } : g))
                      );
                      // Auto-link STPV items inside
                      setWizardStpv((prev) =>
                        prev.map((s) => (s.group === group.name ? { ...s, linkedGroupId: `cc_stpv_${s.id}` } : s))
                      );
                      onNotification(`Đã liên kết nhóm "${group.name}" với MISA CukCuk "${ccGroup.name}" thành công`, "success");
                    }
                    setIsLinkCukCukOptionGroupModalOpen(false);
                  }}
                  className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-[8px] flex items-center justify-center text-[13px] font-sans font-semibold transition-all cursor-pointer border-none shadow-sm"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 💠 LINK CUKCUK DISH POPUP MODAL */}
        {isLinkCukCukModalOpen && linkingShopeeItemId && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10006] p-4 animate-fade-in text-left"
            onClick={() => setIsLinkCukCukModalOpen(false)}
          >
            <div
              className="bg-white flex flex-col w-full max-w-[800px] overflow-hidden shadow-2xl relative animate-scale-up"
              style={{ borderRadius: "12px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal - Height 62px */}
              <div
                className="flex items-center justify-between px-6 bg-white text-[#101828] border-b border-[#E9EAEB] select-none"
                style={{ height: "62px" }}
              >
                <h3 className="text-[#101828] font-semibold text-[16px] font-sans m-0">
                  Chọn món liên kết với MISA CukCuk
                </h3>
                <button
                  onClick={() => setIsLinkCukCukModalOpen(false)}
                  className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              {(() => {
                const activeShopeeItem = shopeeMenuItems.find(item => item.id === linkingShopeeItemId);
                
                // Filtered CukCuk dishes for the selection table
                const filteredLinkDishes = chooseDishAvailableItems.filter((dish) => {
                  // Loại món filter
                  if (linkDishLoaiMon !== "Tất cả loại món") {
                    const isDrink = dish.category === "Đồ uống lạnh" || dish.category === "Món chè";
                    if (linkDishLoaiMon === "Món ăn" && isDrink) return false;
                    if (linkDishLoaiMon === "Đồ uống" && !isDrink) return false;
                  }
                  
                  // Nhóm thực đơn filter
                  if (linkDishNhomThucDon !== "Tất cả nhóm") {
                    if (dish.category !== linkDishNhomThucDon) return false;
                  }

                  // Text search filter
                  if (cukcukSearchQuery) {
                    const q = cukcukSearchQuery.toLowerCase();
                    const codeMatch = dish.code.toLowerCase().includes(q);
                    const nameMatch = dish.name.toLowerCase().includes(q);
                    if (!codeMatch && !nameMatch) return false;
                  }

                  return true;
                });

                return (
                  <div className="px-6 pb-6 pt-4 flex flex-col flex-1 overflow-hidden" style={{ maxHeight: "70vh" }}>
                    <div className="mb-4 text-[13px] text-[#475467] font-sans flex items-center gap-2">
                      <span className="text-gray-500">Món ăn ShopeeFood đang chọn:</span>
                      <span className="font-semibold text-[#245FDF] px-2 py-0.5 bg-[#EDFCF4] border border-[#D5D7DA] rounded-md">{activeShopeeItem?.name}</span>
                    </div>

                    {/* Filter controls row */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 select-none">
                      {/* Loại món */}
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#717680] font-sans whitespace-nowrap">
                          Loại món
                        </span>
                        <div className="relative">
                          <select
                            value={linkDishLoaiMon}
                            onChange={(e) => setLinkDishLoaiMon(e.target.value)}
                            className="h-[32px] pl-3 pr-8 text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all text-[#101828] font-sans cursor-pointer appearance-none min-w-[150px]"
                          >
                            <option value="Tất cả loại món">Tất cả loại món</option>
                            <option value="Món ăn">Món ăn</option>
                            <option value="Đồ uống">Đồ uống</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Nhóm thực đơn */}
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#717680] font-sans whitespace-nowrap">
                          Nhóm thực đơn
                        </span>
                        <div className="relative">
                          <select
                            value={linkDishNhomThucDon}
                            onChange={(e) => setLinkDishNhomThucDon(e.target.value)}
                            className="h-[32px] pl-3 pr-8 text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all text-[#101828] font-sans cursor-pointer appearance-none min-w-[180px]"
                          >
                            <option value="Tất cả nhóm">Tất cả nhóm</option>
                            <option value="Món chính">Món chính</option>
                            <option value="Món ăn nhẹ">Món ăn nhẹ</option>
                            <option value="Đồ uống lạnh">Đồ uống lạnh</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Text Search with search icon */}
                      <div className="flex-1 min-w-[200px] relative">
                        <input
                          type="text"
                          value={cukcukSearchQuery}
                          onChange={(e) => setCukcukSearchQuery(e.target.value)}
                          placeholder="Tìm theo mã hoặc tên món ăn từ CukCuk"
                          className="w-full pl-8 pr-2.5 h-[32px] text-[13px] border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[8px] bg-white outline-none transition-all placeholder:text-[#A4A7AE] text-[#101828]"
                        />
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* CukCuk Dishes Table */}
                    <div className="flex-1 overflow-auto border border-[#E9EAEB] rounded-lg max-h-[300px]">
                      <table className="w-full text-left border-collapse select-none table-fixed">
                        <thead className="sticky top-0 bg-[#F7F7F8] z-10 border-b border-[#E9EAEB]">
                          <tr className="bg-[#F7F7F8] text-[12px] text-[#101828] font-semibold h-10 border-b border-[#D5D7DA]">
                            <th className="p-2 text-center w-12 font-sans font-bold">Chọn</th>
                            <th className="p-2 text-center w-28 font-sans font-bold">Mã món</th>
                            <th className="p-2 text-center min-w-[150px] font-sans font-bold">Tên món ăn</th>
                            <th className="p-2 text-center w-36 font-sans font-bold">Nhóm thực đơn</th>
                            <th className="p-2 text-center w-28 font-sans font-bold">Đơn vị tính</th>
                            <th className="p-2 text-center w-32 font-sans font-bold">Giá bán</th>
                          </tr>
                          {/* Filter row */}
                          <tr className="bg-white border-b border-[#E9EAEB]">
                            <th className="p-1 border-r border-[#E9EAEB]"></th>
                            <th className="p-1 border-r border-[#E9EAEB]">
                              <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[26px] items-center font-normal">
                                <div className="px-1.5 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  disabled
                                  placeholder="Lọc..."
                                  className="w-full px-1 py-0 text-[11px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </th>
                            <th className="p-1 border-r border-[#E9EAEB]">
                              <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[26px] items-center font-normal">
                                <div className="px-1.5 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  disabled
                                  placeholder="Lọc..."
                                  className="w-full px-1 py-0 text-[11px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </th>
                            <th className="p-1 border-r border-[#E9EAEB]">
                              <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[26px] items-center font-normal">
                                <div className="px-1.5 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  disabled
                                  placeholder="Lọc..."
                                  className="w-full px-1 py-0 text-[11px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </th>
                            <th className="p-1 border-r border-[#E9EAEB]">
                              <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[26px] items-center font-normal">
                                <div className="px-1.5 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  disabled
                                  placeholder="Lọc..."
                                  className="w-full px-1 py-0 text-[11px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </th>
                            <th className="p-1">
                              <div className="flex w-full border border-[#D5D7DA] rounded-[4px] overflow-hidden bg-white h-[26px] items-center font-normal">
                                <div className="px-1 bg-gray-50 text-gray-500 text-[11px] font-bold h-full flex items-center justify-center border-r border-[#E9EAEB] select-none">
                                  ≤
                                </div>
                                <input
                                  type="text"
                                  disabled
                                  placeholder="Lọc..."
                                  className="w-full px-1 py-0 text-[11px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828] text-right"
                                />
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLinkDishes.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-[#A4A7AE] text-[13px] font-sans bg-white">
                                Không tìm thấy món ăn nào phù hợp.
                              </td>
                            </tr>
                          ) : (
                            filteredLinkDishes.map(dish => {
                              const isChecked = selectedCukCukDishId === dish.id;
                              return (
                                <tr
                                  key={dish.id}
                                  onClick={() => setSelectedCukCukDishId(dish.id)}
                                  className={`border-b border-[#E9EAEB] transition-colors cursor-pointer h-11 text-[13px] font-sans ${
                                    isChecked ? "bg-[#EDFCF4] text-[#101828]" : "hover:bg-gray-50 text-[#344054]"
                                  }`}
                                >
                                  {/* Radio select column - centered */}
                                  <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center">
                                      <input
                                        type="radio"
                                        name="selectedCukCukDish"
                                        checked={isChecked}
                                        onChange={() => setSelectedCukCukDishId(dish.id)}
                                        className="h-4 w-4 border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF] cursor-pointer"
                                      />
                                    </div>
                                  </td>
                                  {/* Mã món - left-aligned text */}
                                  <td className="p-2 text-left font-mono text-xs text-[#717680]">
                                    {dish.code}
                                  </td>
                                  {/* Tên món - left-aligned text */}
                                  <td className="p-2 text-left font-medium text-[#101828] truncate">
                                    {dish.name}
                                  </td>
                                  {/* Nhóm thực đơn - left-aligned text */}
                                  <td className="p-2 text-left text-gray-500">
                                    {dish.category}
                                  </td>
                                  {/* Đơn vị tính - left-aligned text */}
                                  <td className="p-2 text-left text-gray-500">
                                    {dish.unit}
                                  </td>
                                  {/* Giá bán - right-aligned number */}
                                  <td className="p-2 text-right font-semibold text-[#101828]">
                                    {dish.price.toLocaleString("vi-VN")} đ
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Footer Action - Height 56px, background #FAFAFA, border-t */}
              <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 py-3 flex items-center justify-end h-14 select-none gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkCukCukModalOpen(false)}
                  className="h-[32px] min-w-[84px] px-4 border border-[#D5D7DA] hover:bg-gray-50 text-[#475467] rounded-[8px] flex items-center justify-center text-[13px] font-sans font-medium transition-all cursor-pointer bg-white"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedCukCukDishId) {
                      onNotification("Vui lòng chọn một món ăn từ danh sách để liên kết!", "warning");
                      return;
                    }
                    const activeShopeeItem = shopeeMenuItems.find(item => item.id === linkingShopeeItemId);
                    const dish = chooseDishAvailableItems.find(d => d.id === selectedCukCukDishId);
                    
                    setShopeeMenuItems(prev =>
                      prev.map(i =>
                        i.id === linkingShopeeItemId
                          ? { ...i, isLinked: true }
                          : i
                      )
                    );
                    onNotification(
                      `Liên kết thành công món "${activeShopeeItem?.name}" với "${dish?.name}"!`,
                      "success"
                    );
                    setIsLinkCukCukModalOpen(false);
                  }}
                  className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white rounded-[8px] flex items-center justify-center text-[13px] font-sans font-medium transition-all cursor-pointer border-none shadow-sm"
                >
                  Liên kết
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 💠 LINK CUKCUK INDIVIDUAL STPV POPUP MODAL */}
        {isLinkStpvItemModalOpen && linkingStpvItemId && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10007] p-4 animate-fade-in text-left"
            onClick={() => setIsLinkStpvItemModalOpen(false)}
          >
            <div
              className="bg-white flex flex-col w-full max-w-[500px] overflow-hidden shadow-2xl relative animate-scale-up"
              style={{ borderRadius: "12px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal - Height 62px */}
              <div
                className="flex items-center justify-between px-6 bg-white text-[#101828] border-b border-[#E9EAEB] select-none"
                style={{ height: "62px" }}
              >
                <h3 className="text-[#101828] font-semibold text-[16px] font-sans m-0">
                  Chọn sở thích phục vụ liên kết với MISA CukCuk
                </h3>
                <button
                  onClick={() => setIsLinkStpvItemModalOpen(false)}
                  className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              {(() => {
                const activeStpvItem = wizardStpv.find(item => item.id === linkingStpvItemId);
                
                // Filtered CukCuk groups (options) for individual STPV
                const filteredCukCukStpv = wizardCukCukGroups.filter((cc) => {
                  if (cukcukStpvSearchQuery) {
                    const q = cukcukStpvSearchQuery.toLowerCase();
                    return (
                      cc.name.toLowerCase().includes(q) ||
                      cc.code.toLowerCase().includes(q)
                    );
                  }
                  return true;
                });

                return (
                  <div className="px-6 pb-6 pt-4 flex flex-col flex-1 overflow-hidden">
                    <div className="mb-4 text-[13px] text-[#475467] font-sans flex flex-col gap-1 bg-[#F9FAFB] p-3 rounded-lg border border-[#E9EAEB]">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-sans">Sở thích phục vụ ShopeeFood:</span>
                        <span className="font-semibold text-[#245FDF] px-2 py-0.5 bg-[#EDFCF4] border border-[#D5D7DA] rounded-md">{activeStpvItem?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-gray-500 font-sans">Nhóm:</span>
                        <span className="text-[#101828] font-sans font-semibold">{activeStpvItem?.group}</span>
                      </div>
                    </div>

                    {/* Search box - Height 32px, filled background #F5F5F5 */}
                    <div className="relative mb-3 flex-shrink-0 select-none">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717680]" />
                      <input
                        type="text"
                        value={cukcukStpvSearchQuery}
                        onChange={(e) => setCukcukStpvSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm"
                        className="w-full pl-8 pr-2.5 h-[32px] text-[13px] border-none rounded-[8px] bg-[#F5F5F5] outline-none transition-all placeholder:text-[#A4A7AE] text-[#101828] font-sans focus:ring-1 focus:ring-[#245FDF]"
                      />
                    </div>

                    {/* Vertical list of items - max-h showing 8 items, then scroll */}
                    <div className="border border-[#E9EAEB] rounded-lg overflow-y-auto" style={{ maxHeight: "256px" }}>
                      {filteredCukCukStpv.length === 0 ? (
                        <div className="py-6 text-center text-[#A4A7AE] text-[13px] font-sans bg-white">
                          Không tìm thấy kết quả phù hợp
                        </div>
                      ) : (
                        filteredCukCukStpv.map((cc) => {
                          const isSelected = selectedCukCukStpvId === cc.id;
                          return (
                            <div
                              key={cc.id}
                              onClick={() => setSelectedCukCukStpvId(cc.id)}
                              className={`flex items-center justify-between px-4 h-[32px] cursor-pointer transition-colors text-[13px] font-sans ${
                                isSelected
                                  ? "bg-[#EDFCF4] text-[#245FDF] font-semibold"
                                  : "hover:bg-gray-50 text-[#101828]"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-mono text-xs text-[#717680]">{cc.code}</span>
                                <span className="truncate">{cc.name}</span>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#245FDF] flex-shrink-0" />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Footer Action */}
              <div className="bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 py-3 flex items-center justify-end h-14 select-none gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkStpvItemModalOpen(false)}
                  className="h-[32px] min-w-[84px] px-4 border border-[#D5D7DA] hover:bg-gray-50 text-[#475467] rounded-[8px] flex items-center justify-center text-[13px] font-sans font-medium transition-all cursor-pointer bg-white"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedCukCukStpvId) {
                      onNotification("Vui lòng chọn một sở thích phục vụ CukCuk để liên kết!", "warning");
                      return;
                    }
                    const activeStpvItem = wizardStpv.find(item => item.id === linkingStpvItemId);
                    const ccOption = wizardCukCukGroups.find(c => c.id === selectedCukCukStpvId);
                    
                    setWizardStpv((prev) =>
                      prev.map((i) =>
                        i.id === linkingStpvItemId
                          ? { ...i, linkedGroupId: selectedCukCukStpvId }
                          : i,
                      ),
                    );
                    onNotification(
                      `Liên kết thành công sở thích phục vụ "${activeStpvItem?.name}" với "${ccOption?.name}"!`,
                      "success"
                    );
                    setIsLinkStpvItemModalOpen(false);
                  }}
                  className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] text-white rounded-[8px] flex items-center justify-center text-[13px] font-sans font-medium transition-all cursor-pointer border-none shadow-sm"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {renderShopeeEditModal()}
        {renderQuickLinkModal()}
        {renderSuspendConfirmModal()}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 1️⃣ Page Header */}
      <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-[#E9EAEB] select-none">
        <h2 className="text-[#101828] font-semibold text-xl">Ứng dụng</h2>

        <div className="flex items-center gap-2">
          {/* Quick Search inside Applications Header */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm ứng dụng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 text-body-reg bg-white border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none w-52 placeholder-gray-400"
              style={{ height: "32px", borderRadius: "8px" }}
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-white border border-[#D5D7DA] text-[#101828] hover:text-[#2563EB] hover:bg-[#F0F6FE] transition-colors font-medium px-3 text-body-reg select-none cursor-pointer"
            style={{ height: "32px", borderRadius: "8px", minWidth: "84px" }}
          >
            <MessageSquare className="w-4 h-4 text-[#717680]" />
            Phản hồi
          </button>
        </div>
      </div>

      {/* 2️⃣ Application Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 overflow-y-auto pb-6">
        {filteredApps.length === 0 ? (
          <div className="col-span-full py-16 bg-white rounded-lg flex flex-col items-center justify-center text-gray-400">
            <Info className="w-12 h-12 mb-2 text-gray-300" />
            <p className="text-body-reg">Không tìm thấy ứng dụng nào phù hợp</p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const isRound = [
              "grab",
              "shopeefood",
              "ahamove",
              "color-circle",
              "sme-circle",
            ].includes(app.iconType);
            const radiusClass = isRound ? "rounded-full" : "rounded-2xl";
            return (
              <div
                key={app.id}
                onClick={() => {
                  if (app.id === "shopeefood") {
                    setIsShopeeFoodScreenActive(true);
                  } else {
                    setSelectedApp(app);
                  }
                }}
                className="group flex gap-4 p-5 cursor-pointer transition-all hover:scale-[1.01] hover:border-[#2563EB]/40 select-none"
                style={{
                  borderRadius: "12px",
                  border: "2px solid #FFF",
                  backgroundColor: "rgba(255, 255, 255, 0.80)",
                  boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)",
                }}
              >
                {/* Left logo */}
                {app.imageUrl ? (
                  <img
                    src={app.imageUrl}
                    alt={app.title}
                    className={`object-cover flex-shrink-0 ${radiusClass}`}
                    style={{ width: 56, height: 56 }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <AppIcon type={app.iconType} size={56} />
                )}

                {/* Right text details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="text-[#101828] font-semibold text-base truncate group-hover:text-[#2563EB] transition-colors">
                          {app.title}
                        </h3>
                        {app.isNew && (
                          <span className="flex-shrink-0 inline-flex items-center text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      {app.isConnected && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">
                          <Check className="w-3 h-3" /> Đã kết nối
                        </span>
                      )}
                    </div>
                    <p className="text-[#717680] text-[13px] line-clamp-2 mt-1 leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (app.id === "shopeefood") {
                          setIsShopeeFoodScreenActive(true);
                        } else {
                          setSelectedApp(app);
                        }
                      }}
                      className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold text-body-reg transition-all hover:underline"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3️⃣ Detail View Popup Modal (Layout màn Xem chi tiết dạng Popup) */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in">
          <div
            className="bg-white flex flex-col w-full max-w-2xl overflow-hidden shadow-2xl relative animate-scale-up"
            style={{ borderRadius: "12px" }}
          >
            {/* Header Modal */}
            <div
              className="flex items-center justify-between px-6 border-b border-[#E9EAEB]"
              style={{ height: "62px" }}
            >
              <h3 className="text-[#101828] font-semibold text-lg">
                {selectedApp.title}
              </h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* App Overview card inside modal */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {selectedApp.imageUrl ? (
                  <img
                    src={selectedApp.imageUrl}
                    alt={selectedApp.title}
                    className={`object-cover flex-shrink-0 border border-gray-100 shadow-sm ${
                      [
                        "grab",
                        "shopeefood",
                        "ahamove",
                        "color-circle",
                        "sme-circle",
                      ].includes(selectedApp.iconType)
                        ? "rounded-full"
                        : "rounded-2xl"
                    }`}
                    style={{ width: 64, height: 64 }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <AppIcon type={selectedApp.iconType} size={64} />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#101828] text-base">
                      {selectedApp.title}
                    </h4>
                    {selectedApp.isNew && (
                      <span className="flex-shrink-0 inline-flex items-center text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        New
                      </span>
                    )}
                    <span className="text-[11px] text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md font-medium">
                      {selectedApp.category}
                    </span>
                  </div>
                  <p className="text-[#717680] text-sm mt-1 leading-relaxed">
                    {selectedApp.description}
                  </p>
                </div>
              </div>

              {/* Readonly info structure matching the instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[#717680] font-medium text-xs mb-1">
                    Tên nhà cung cấp
                  </span>
                  <div className="text-body-reg text-[#101828] py-1 border-b border-[#D5D7DA]">
                    MISA Joint Stock Company
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[#717680] font-medium text-xs mb-1">
                    Phiên bản tích hợp
                  </span>
                  <div className="text-body-reg text-[#101828] py-1 border-b border-[#D5D7DA]">
                    v4.1.2 (Bản cập nhật 2026)
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[#717680] font-medium text-xs mb-1">
                    Trạng thái liên kết
                  </span>
                  <div className="text-body-reg font-semibold py-1 border-b border-[#D5D7DA] flex items-center gap-1.5">
                    {selectedApp.isConnected ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-emerald-700">Đã kết nối</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-[#717680]">Chưa kết nối</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[#717680] font-medium text-xs mb-1">
                    Tài khoản kết nối
                  </span>
                  <div className="text-body-reg text-[#101828] py-1 border-b border-[#D5D7DA] truncate">
                    {selectedApp.isConnected
                      ? "cukcuk_integration_admin@misa.com.vn"
                      : "N/A"}
                  </div>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <span className="text-[#717680] font-medium text-xs mb-1">
                    Phạm vi truy cập quyền dữ liệu (Scopes)
                  </span>
                  <div className="text-body-reg text-[#101828] py-1 border-b border-[#D5D7DA] flex flex-wrap gap-1.5 pt-2">
                    <span className="bg-blue-50 text-[#2563EB] text-xs px-2 py-0.5 rounded border border-blue-100 font-medium">
                      Read:Invoices
                    </span>
                    <span className="bg-blue-50 text-[#2563EB] text-xs px-2 py-0.5 rounded border border-blue-100 font-medium">
                      Write:Invoices
                    </span>
                    <span className="bg-blue-50 text-[#2563EB] text-xs px-2 py-0.5 rounded border border-blue-100 font-medium">
                      Sync:Inventory
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <span className="text-[#717680] font-medium text-xs mb-1">
                    Mã cấu hình Endpoint (Webhook)
                  </span>
                  <div className="text-body-reg text-[#101828] py-1.5 border-b border-[#D5D7DA] font-mono text-[11px] bg-gray-50 px-2 rounded mt-1 truncate">
                    {selectedApp.isConnected
                      ? `https://api.cukcuk.vn/v1/sync/webhook/active_id_${selectedApp.id}`
                      : "Chưa thiết lập"}
                  </div>
                </div>
              </div>

              {/* Helpful guide message */}
              <div className="flex gap-2.5 p-3.5 bg-[#F0F6FE] rounded-lg text-blue-800 text-xs">
                <Shield className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-900 mb-0.5">
                    Bảo mật & Đồng bộ dữ liệu
                  </h5>
                  <p className="leading-relaxed opacity-90">
                    Mọi hoạt động truyền gửi dữ liệu giữa MISA CukCuk và bên thứ
                    ba đều được mã hóa bằng chuẩn TLS 1.3 cao nhất. Bạn có thể
                    bật hoặc tắt đồng bộ bất cứ lúc nào bằng nút Thao tác bên
                    dưới.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action (Footer cố định dưới modal) */}
            <div
              className="flex items-center justify-between px-6 bg-[#FAFAFA] border-t border-[#E9EAEB]"
              style={{ height: "56px" }}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleConnection(selectedApp.id)}
                  className={`flex items-center gap-1.5 font-medium px-3 text-body-reg select-none cursor-pointer ${
                    selectedApp.isConnected
                      ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                      : "bg-[#2563EB] hover:bg-[#1E40AF] text-white"
                  }`}
                  style={{
                    height: "32px",
                    borderRadius: "8px",
                    minWidth: "84px",
                  }}
                >
                  {selectedApp.isConnected ? "Ngắt kết nối" : "Kết nối ngay"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium px-3 text-body-reg select-none cursor-pointer"
                  style={{
                    height: "32px",
                    borderRadius: "8px",
                    minWidth: "84px",
                  }}
                >
                  Đóng
                </button>
                <button
                  onClick={() =>
                    onNotification(
                      "Chức năng đang tải mẫu in cấu hình...",
                      "info",
                    )
                  }
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#717680] hover:text-[#101828] font-medium px-2.5 select-none cursor-pointer flex items-center justify-center"
                  style={{ height: "32px", width: "32px", borderRadius: "8px" }}
                  title="In cấu hình"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#717680] hover:text-[#101828] font-medium px-2.5 select-none cursor-pointer flex items-center justify-center"
                  style={{ height: "32px", width: "32px", borderRadius: "8px" }}
                  title="Thêm hành động"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4️⃣ Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div
            className="bg-white flex flex-col w-full max-w-md overflow-hidden shadow-2xl relative"
            style={{ borderRadius: "12px" }}
          >
            {/* Header Modal */}
            <div
              className="flex items-center justify-between px-6 border-b border-[#E9EAEB]"
              style={{ height: "62px" }}
            >
              <h3 className="text-[#101828] font-semibold text-lg">
                Gửi phản hồi cho MISA CukCuk
              </h3>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <form
              onSubmit={handleSendFeedback}
              className="flex-1 p-6 space-y-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#717680]">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none px-3"
                  style={{ height: "32px", borderRadius: "8px" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#717680]">
                  Nội dung góp ý / báo lỗi
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Hãy mô tả chi tiết thắc mắc hoặc ý kiến đóng góp của bạn để MISA cải tiến tốt hơn..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full text-body-reg border border-[#D5D7DA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none p-3 resize-none"
                  style={{ borderRadius: "8px" }}
                />
              </div>

              <div className="text-[11px] text-[#717680] leading-relaxed">
                MISA cam kết bảo mật tuyệt đối thông tin cá nhân của bạn và sử
                dụng góp ý này chỉ nhằm nâng cao chất lượng phần mềm.
              </div>

              {/* Footer Action */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(false)}
                  className="bg-white hover:bg-gray-50 border border-[#D5D7DA] text-[#101828] font-medium px-4 text-body-reg select-none cursor-pointer"
                  style={{ height: "32px", borderRadius: "8px" }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium px-4 text-body-reg select-none cursor-pointer"
                  style={{ height: "32px", borderRadius: "8px" }}
                >
                  Gửi phản hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5️⃣ Shopee Food Menu Item Edit Modal */}
      {renderShopeeEditModal()}

      {/* 6️⃣ Shopee Food Quick Link Modal */}
      {renderQuickLinkModal()}

      {/* 7️⃣ Shopee Food Suspend Confirm Modal */}
      {renderSuspendConfirmModal()}
    </div>
  );

  function renderSuspendConfirmModal() {
    if (!showSuspendConfirmModal) return null;
    return (
      <div className="fixed inset-0 bg-black/40 z-[10100] flex items-center justify-center p-4 animate-fade-in select-none">
        <div 
          className="bg-white rounded-[12px] shadow-2xl border border-[#E9EAEB] w-full max-w-[440px] overflow-hidden animate-scale-up p-6 flex flex-col items-center text-center text-left animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-500">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-[#101828] font-bold text-[16px] font-sans mb-2">
            Tạm ngừng nhận đơn?
          </h3>

          <p className="text-[#717680] text-[13px] leading-relaxed mb-6 font-sans">
            Khi tạm ngừng nhận đơn, nhà hàng của bạn trên ứng dụng ShopeeFood sẽ chuyển sang trạng thái <strong>Đóng cửa tạm thời</strong>. Khách hàng sẽ không thể đặt món cho đến khi bạn bật lại nhận đơn. Bạn có chắc chắn muốn thực hiện?
          </p>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => setShowSuspendConfirmModal(false)}
              className="flex-1 h-[32px] bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] font-medium text-[13px] rounded-[8px] transition-all cursor-pointer flex items-center justify-center"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSuspendConfirmModal(false);
                setIsSuspended(true);
                onNotification(
                  "Đã tạm ngừng nhận đơn trên ShopeeFood thành công!",
                  "success"
                );
              }}
              className="flex-1 h-[32px] bg-[#245FDF] hover:bg-[#1B4EBA] border-none text-white font-medium text-[13px] rounded-[8px] transition-all cursor-pointer flex items-center justify-center shadow-sm"
            >
              Tạm ngừng
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderShopeeEditModal() {
    if (!isShopeeEditOpen || !shopeeEditItem) return null;
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10020] p-4 text-left select-none">
          <div
            className="bg-white flex flex-col w-full max-w-[850px] shadow-2xl relative overflow-hidden"
            style={{ borderRadius: "12px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal - White background, Black title, as per instructions */}
            <div
              className="flex items-center justify-between px-6 bg-white border-b border-[#E9EAEB] text-[#101828] flex-shrink-0"
              style={{ height: "48px" }}
            >
              <h3 className="text-[#101828] font-bold text-[16px] font-sans">
                Sửa Món ăn
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onNotification(
                      "Trợ giúp: Bạn có thể cấu hình tên món, nhóm thực đơn, giá bán và các sở thích kèm theo của món ăn trước khi đồng bộ.",
                      "info"
                    );
                  }}
                  className="text-[#717680] hover:text-[#245FDF] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent outline-none flex items-center justify-center"
                  title="Trợ giúp"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsShopeeEditOpen(false);
                    setShopeeEditItem(null);
                  }}
                  className="text-[#717680] hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent outline-none flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Custom Tab Navigation Bar - Styled to match step 2 tab bar */}
            <div className="h-12 bg-white px-6 border-b border-[#E9EAEB] flex items-center flex-shrink-0 justify-between select-none">
              <div className="flex gap-8 h-full">
                <button
                  type="button"
                  onClick={() => setActiveEditTab("general")}
                  className={`relative h-full flex items-center text-[13px] font-semibold transition-colors cursor-pointer px-1 outline-none border-none bg-transparent ${
                    activeEditTab === "general"
                      ? "text-[#245FDF]"
                      : "text-[#717680] hover:text-[#245FDF]"
                  }`}
                >
                  Thông tin chung
                  {activeEditTab === "general" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#245FDF] rounded-t-full" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditTab("preferences")}
                  className={`relative h-full flex items-center text-[13px] font-semibold transition-colors cursor-pointer px-1 outline-none border-none bg-transparent ${
                    activeEditTab === "preferences"
                      ? "text-[#245FDF]"
                      : "text-[#717680] hover:text-[#245FDF]"
                  }`}
                >
                  Sở thích phục vụ
                  {activeEditTab === "preferences" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#245FDF] rounded-t-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Body of Modal */}
            <div className="p-6 flex-1 overflow-y-auto max-h-[60vh] bg-white min-h-[380px]">
              {activeEditTab === "general" ? (
                <div className="flex gap-6">
                  {/* Left Column (Inputs) */}
                  <div className="flex-1 space-y-4">
                    {/* Tên món */}
                    <div className="flex items-center">
                      <label className="w-[140px] text-[13px] font-sans text-[#101828] select-none flex-shrink-0">
                        Tên món <span className="text-red-500">(*)</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={shopeeEditItem.name}
                        onChange={(e) =>
                          setShopeeEditItem({
                            ...shopeeEditItem,
                            name: e.target.value,
                          })
                        }
                        className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                      />
                    </div>

                    {/* Nhóm thực đơn */}
                    <div className="flex items-center">
                      <label className="w-[140px] text-[13px] font-sans text-[#101828] select-none flex-shrink-0">
                        Nhóm thực đơn
                      </label>
                      <input
                        type="text"
                        value={shopeeEditItem.category}
                        onChange={(e) =>
                          setShopeeEditItem({
                            ...shopeeEditItem,
                            category: e.target.value,
                          })
                        }
                        className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                      />
                    </div>

                    {/* Đơn vị tính */}
                    <div className="flex items-center">
                      <label className="w-[140px] text-[13px] font-sans text-[#101828] select-none flex-shrink-0">
                        Đơn vị tính
                      </label>
                      <input
                        type="text"
                        value={shopeeEditItem.unit || ""}
                        onChange={(e) =>
                          setShopeeEditItem({
                            ...shopeeEditItem,
                            unit: e.target.value,
                          })
                        }
                        className="flex-1 h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all"
                      />
                    </div>

                    {/* Giá bán */}
                    <div className="flex items-center">
                      <label className="w-[140px] text-[13px] font-sans text-[#101828] select-none flex-shrink-0">
                        Giá bán
                      </label>
                      <div className="flex-1 flex justify-end">
                        <input
                          type="text"
                          value={(() => {
                            const bp = shopeeEditItem.basePrice !== undefined ? shopeeEditItem.basePrice : Math.round(shopeeEditItem.price * 0.9);
                            if (bp === 0) return "0";
                            return bp.toLocaleString("vi-VN");
                          })()}
                          onChange={(e) => {
                            const cleaned = parseInt(e.target.value.replace(/\D/g, "")) || 0;
                            setShopeeEditItem({
                              ...shopeeEditItem,
                              basePrice: cleaned,
                            });
                          }}
                          className="w-full text-right h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans font-semibold outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Giá bán ShopeeFood */}
                    <div className="flex items-center">
                      <label className="w-[140px] text-[13px] font-sans text-[#101828] select-none flex-shrink-0">
                        Giá bán ShopeeFood <span className="text-red-500">(*)</span>
                      </label>
                      <div className="flex-1 flex justify-end">
                        <input
                          type="text"
                          required
                          value={shopeeEditItem.price === 0 ? "0" : shopeeEditItem.price.toLocaleString("vi-VN")}
                          onChange={(e) => {
                            const cleaned = parseInt(e.target.value.replace(/\D/g, "")) || 0;
                            setShopeeEditItem({
                              ...shopeeEditItem,
                              price: cleaned,
                            });
                          }}
                          className="w-full text-right h-[32px] px-3 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans font-semibold outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Mô tả */}
                    <div className="flex items-start">
                      <label className="w-[140px] text-[13px] font-sans text-[#101828] pt-1.5 select-none flex-shrink-0">
                        Mô tả
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mô tả món ăn, hương vị, nguyên liệu..."
                        value={shopeeEditItem.description || ""}
                        onChange={(e) =>
                          setShopeeEditItem({
                            ...shopeeEditItem,
                            description: e.target.value,
                          })
                        }
                        className="flex-1 p-2 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Trạng thái món */}
                    <div className="flex items-center">
                      <label className="w-[140px] text-[13px] font-sans text-[#101828] select-none flex-shrink-0">
                        Trạng thái món
                      </label>
                      <div className="relative flex-1">
                        <select
                          value={shopeeEditItem.status}
                          onChange={(e) =>
                            setShopeeEditItem({
                              ...shopeeEditItem,
                              status: e.target.value,
                            })
                          }
                          className="w-full h-[32px] pl-3 pr-8 border border-[#D5D7DA] focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF] rounded-[4px] bg-white text-[#101828] text-[13px] font-sans outline-none cursor-pointer appearance-none"
                        >
                          <option value="Có bán">Có bán</option>
                          <option value="Ngừng bán">Ngừng bán</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#717680]">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Ảnh đại diện) */}
                  <div className="w-[280px] flex-shrink-0">
                    <div className="border border-[#D5D7DA] rounded-[8px] p-4 flex flex-col items-center relative bg-white">
                      {/* Fieldset label simulation */}
                      <span className="absolute -top-3 left-4 bg-white px-2 text-xs text-[#717680] font-sans">
                        Ảnh đại diện
                      </span>

                      <div className="flex items-stretch gap-3 w-full mt-2">
                        {/* Image Preview Box */}
                        <div className="w-[180px] h-[140px] border border-[#E9EAEB] rounded-[4px] bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden flex-shrink-0">
                          {shopeeEditItem.image ? (
                            <img
                              src={shopeeEditItem.image}
                              alt="Dish preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-[#A4A7AE] gap-1">
                              {/* Spoon and Fork Icon placeholder as in the image */}
                              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D5D7DA] flex items-center justify-center">
                                <Utensils className="w-8 h-8 text-[#D5D7DA]" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Image Action Buttons stack */}
                        <div className="flex flex-col gap-2">
                          {/* Browse Button "..." */}
                          <div className="relative group/btn">
                            <button
                              type="button"
                              className="w-[28px] h-[28px] border border-[#D5D7DA] hover:bg-gray-50 bg-white text-[#101828] rounded flex items-center justify-center font-bold text-sm cursor-pointer outline-none shadow-sm transition-colors"
                              title="Chọn ảnh mẫu"
                            >
                              ...
                            </button>
                            {/* Preset Selection Dropdown */}
                            <div className="hidden group-hover/btn:block hover:block absolute left-0 top-full mt-1 bg-white border border-[#D5D7DA] rounded-lg shadow-lg z-50 p-2 w-[180px]">
                              <div className="text-[11px] font-semibold text-[#717680] mb-1 px-1">Chọn ảnh món ăn mẫu:</div>
                              <div className="grid grid-cols-2 gap-1.5">
                                {[
                                  { name: "Bánh mì", url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=150&auto=format&fit=crop&q=60" },
                                  { name: "Phở", url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=150&auto=format&fit=crop&q=60" },
                                  { name: "Gà rán", url: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=150&auto=format&fit=crop&q=60" },
                                  { name: "Đồ uống", url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=60" },
                                ].map((img, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setShopeeEditItem({ ...shopeeEditItem, image: img.url })}
                                    className="p-1 border border-transparent hover:border-[#245FDF] hover:bg-[#F0F6FE] rounded cursor-pointer text-left outline-none"
                                  >
                                    <img src={img.url} className="w-full h-10 object-cover rounded" alt={img.name} />
                                    <div className="text-[10px] text-center mt-0.5 text-gray-700 truncate">{img.name}</div>
                                  </button>
                                ))}
                              </div>
                              <div className="border-t border-[#E9EAEB] mt-1.5 pt-1.5">
                                <label className="text-[10px] text-[#245FDF] font-medium hover:underline block text-center cursor-pointer">
                                  Tải lên tệp ảnh...
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                          setShopeeEditItem({
                                            ...shopeeEditItem,
                                            image: reader.result as string,
                                          });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Delete Button "x" */}
                          <button
                            type="button"
                            onClick={() => setShopeeEditItem({ ...shopeeEditItem, image: undefined })}
                            className="w-[28px] h-[28px] border border-[#D5D7DA] hover:bg-red-50 bg-white text-red-600 rounded flex items-center justify-center font-extrabold text-xs cursor-pointer outline-none shadow-sm transition-colors"
                            title="Xóa ảnh"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image Formats Instruction */}
                      <div className="text-[11px] text-[#717680] font-sans text-center mt-3 leading-snug">
                        Chọn các ảnh có định dạng
                        <br />
                        <span className="font-semibold text-[#101828]">(.jpg, .jpeg, .png, .gif)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Tab 2: Sở thích phục vụ */
                <div className="flex flex-col h-full space-y-4">
                  {/* Title of Active Item Preference */}
                  <div className="text-[13px] font-sans text-[#101828] select-none">
                    Món ăn: <span className="font-bold text-[#245FDF]">{shopeeEditItem.name}</span>
                  </div>

                  {/* Table area of Preferences */}
                  <div className="border border-[#D5D7DA] rounded-[8px] overflow-hidden bg-white min-h-[220px] flex flex-col">
                    <table className="w-full border-collapse text-left text-[13px] table-fixed">
                      <thead>
                        <tr className="bg-[#F7F7F8] border-b border-[#D5D7DA] h-[36px] select-none text-[#101828]">
                          {/* Title Header luôn căn giữa */}
                          <th className="px-4 text-center font-bold font-sans border-r border-[#D5D7DA] w-[60%]">
                            Sở thích phục vụ
                          </th>
                          <th className="px-4 text-center font-bold font-sans w-[40%]">
                            Thu thêm
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingPreferences.length > 0 ? (
                          editingPreferences.map((pref) => {
                            const isSelected = selectedPreferenceId === pref.id;
                            return (
                              <tr
                                key={pref.id}
                                onClick={() => setSelectedPreferenceId(isSelected ? null : pref.id)}
                                className={`border-b border-[#E9EAEB] hover:bg-[#F0F6FE]/40 cursor-pointer h-[36px] transition-colors ${
                                  isSelected ? "bg-[#F0F6FE] hover:bg-[#F0F6FE]" : ""
                                }`}
                              >
                                {/* Column 1: Sở thích phục vụ - Plain Text read-only always left-aligned */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left">
                                  {pref.isHeader ? (
                                    <span className="font-bold text-[#101828] text-[13px] font-sans">
                                      {pref.name}
                                    </span>
                                  ) : (
                                    <span className="text-[#101828] text-[13px] pl-4 font-sans">
                                      {pref.name}
                                    </span>
                                  )}
                                </td>

                                {/* Column 2: Thu thêm - Number always right-aligned, still editable */}
                                <td className="p-1 text-right">
                                  {pref.isHeader ? (
                                    <span className="text-gray-400 select-none pr-3">-</span>
                                  ) : (
                                    <input
                                      type="text"
                                      value={pref.price === 0 ? "0" : pref.price.toLocaleString("vi-VN")}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        const cleaned = parseInt(e.target.value.replace(/\D/g, "")) || 0;
                                        setEditingPreferences((prev) =>
                                          prev.map((p) =>
                                            p.id === pref.id ? { ...p, price: cleaned } : p
                                          )
                                        );
                                      }}
                                      className="w-full px-2 py-0.5 border border-transparent focus:border-[#245FDF] focus:bg-white bg-transparent outline-none rounded-[4px] font-semibold text-[#101828] text-[13px] text-right"
                                    />
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={2} className="text-center py-8 text-gray-400 text-xs font-sans">
                              Không có sở thích phục vụ nào được thiết lập.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Actions under the preferences table */}
                  <div className="flex items-center justify-between select-none">
                    {/* Left: Xóa dòng, Thêm dòng */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedPreferenceId) {
                            onNotification("Vui lòng chọn một dòng để xóa!", "info");
                            return;
                          }
                          setEditingPreferences((prev) => prev.filter((p) => p.id !== selectedPreferenceId));
                          setSelectedPreferenceId(null);
                          onNotification("Đã xóa dòng sở thích phục vụ thành công!", "success");
                        }}
                        className="h-[32px] px-3 bg-white hover:bg-red-50 text-red-600 border border-[#D5D7DA] rounded-[8px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[13px] font-sans"
                      >
                        <X className="w-4 h-4" />
                        <span>Xóa dòng</span>
                      </button>
                    </div>

                    {/* Right: Khôi phục mặc định */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPreferences([
                          { id: "pref_1", name: "S", price: 0 },
                          { id: "pref_2", name: "nhóm 1", price: 0, isHeader: true },
                          { id: "pref_3", name: "ca lang", price: 20000 },
                          { id: "pref_4", name: "Cay", price: 0 },
                          { id: "pref_5", name: "Them suon", price: 10000 },
                        ]);
                        setSelectedPreferenceId(null);
                        onNotification("Đã khôi phục danh sách sở thích phục vụ mặc định!", "info");
                      }}
                      className="h-[32px] px-3 bg-white hover:bg-gray-50 text-[#101828] border border-[#D5D7DA] rounded-[8px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[13px] font-sans"
                    >
                      <RefreshCw className="w-4 h-4 text-[#717680]" />
                      <span>Khôi phục mặc định</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Bar - Fixed at bottom */}
            <div className="h-[56px] bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 flex items-center justify-end gap-2 flex-shrink-0">
              {/* Button Hủy */}
              <button
                type="button"
                onClick={() => {
                  setIsShopeeEditOpen(false);
                  setShopeeEditItem(null);
                }}
                className="h-[32px] min-w-[84px] px-4 bg-white border border-[#D5D7DA] hover:bg-gray-50 text-[#101828] font-normal text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans"
              >
                Hủy
              </button>

              {/* Button Lưu */}
              <button
                type="button"
                onClick={() => {
                  // Save both general properties and customized preferences array back to shopeeEditItem
                  const updatedItem = {
                    ...shopeeEditItem,
                    preferences: [...editingPreferences],
                  };

                  setShopeeMenuItems((prev) =>
                    prev.map((item) =>
                      item.id === updatedItem.id ? updatedItem : item
                    )
                  );
                  setIsShopeeEditOpen(false);
                  setShopeeEditItem(null);
                  onNotification(
                    `Đã lưu và cập nhật thông tin món "${updatedItem.name}" thành công!`,
                    "success"
                  );
                }}
                className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] border-none text-white font-normal text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans shadow-sm"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      );
    }

    function renderQuickLinkModal() {
      if (!isQuickLinkModalOpen) return null;

      // Direct state updates to parent state so they save instantly
      const updateDishLink = (itemId: number, linkedDishId: string, isLinked: boolean) => {
        setQuickLinkEditingItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, linkedDishId, isLinked } : item))
        );
        setShopeeMenuItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, linkedDishId, isLinked } : item))
        );
        setWizardFoods((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, linkedDishId, isLinked } : item))
        );
      };

      const copyDishToCukCuk = (item: any) => {
        const newId = `cc_auto_${item.id}`;
        const newDishName = item.name;
        const codePrefix = (item.category || "MA").slice(0, 2).toUpperCase();
        const randomNum = Math.floor(10 + Math.random() * 90);
        const newCode = `${codePrefix}${randomNum}`;

        // Add to MISA CukCuk dishes if not already exists
        setWizardCukCukDishes((prev) => {
          if (prev.some((d) => d.id === newId)) return prev;
          return [
            ...prev,
            {
              id: newId,
              name: newDishName,
              code: newCode,
            },
          ];
        });

        // Link it
        updateDishLink(item.id, newId, true);
        onNotification(`Đã sao chép món "${newDishName}" về MISA CukCuk và thực hiện liên kết thành công!`, "success");
      };

      const updateStpvLink = (itemId: string, linkedGroupId: string) => {
        setQuickLinkEditingStpv((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, linkedGroupId } : item))
        );
        setWizardStpv((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, linkedGroupId } : item))
        );
      };

      const updateMenuGroupLink = (groupId: string, linkedGroupId: string) => {
        setQuickLinkEditingMenuGroups((prev) =>
          prev.map((g) => (g.id === groupId ? { ...g, linkedGroupId } : g))
        );
        setWizardMenuGroups((prev) =>
          prev.map((g) => (g.id === groupId ? { ...g, linkedGroupId } : g))
        );
        setShopeeMenuGroups((prev) =>
          prev.map((g) => (g.id === groupId ? { ...g, linkedGroupId } : g))
        );
      };

      const updateStpvGroupLink = (groupId: string, linkedGroupId: string) => {
        setQuickLinkEditingStpvGroups((prev) =>
          prev.map((g) => (g.id === groupId ? { ...g, linkedGroupId } : g))
        );
        setWizardStpvGroups((prev) =>
          prev.map((g) => (g.id === groupId ? { ...g, linkedGroupId } : g))
        );
        // Sync with optionGroups as well
        const group = wizardStpvGroups.find((g) => g.id === groupId);
        if (group) {
          setOptionGroups((prev) =>
            prev.map((g) => (g.name === group.name ? { ...g, linkedGroupId } : g))
          );
        }
      };

      const handleBulkUnlink = () => {
        if (quickLinkSelectedIds.length === 0) return;
        
        if (quickLinkTab === "dish") {
          const idsToUnlink = quickLinkSelectedIds.map(id => Number(id));
          setQuickLinkEditingItems((prev) =>
            prev.map((item) => (idsToUnlink.includes(item.id) ? { ...item, linkedDishId: "", isLinked: false } : item))
          );
          setShopeeMenuItems((prev) =>
            prev.map((item) => (idsToUnlink.includes(item.id) ? { ...item, linkedDishId: "", isLinked: false } : item))
          );
          setWizardFoods((prev) =>
            prev.map((item) => (idsToUnlink.includes(item.id) ? { ...item, linkedDishId: "", isLinked: false } : item))
          );
        } else if (quickLinkTab === "menuGroup") {
          setQuickLinkEditingMenuGroups((prev) =>
            prev.map((g) => (quickLinkSelectedIds.includes(g.id) ? { ...g, linkedGroupId: "" } : g))
          );
          setWizardMenuGroups((prev) =>
            prev.map((g) => (quickLinkSelectedIds.includes(g.id) ? { ...g, linkedGroupId: "" } : g))
          );
          setShopeeMenuGroups((prev) =>
            prev.map((g) => (quickLinkSelectedIds.includes(g.id) ? { ...g, linkedGroupId: "" } : g))
          );
        } else if (quickLinkTab === "stpv") {
          setQuickLinkEditingStpv((prev) =>
            prev.map((item) => (quickLinkSelectedIds.includes(item.id) ? { ...item, linkedGroupId: "" } : item))
          );
          setWizardStpv((prev) =>
            prev.map((item) => (quickLinkSelectedIds.includes(item.id) ? { ...item, linkedGroupId: "" } : item))
          );
        } else if (quickLinkTab === "stpvGroup") {
          setQuickLinkEditingStpvGroups((prev) =>
            prev.map((g) => (quickLinkSelectedIds.includes(g.id) ? { ...g, linkedGroupId: "" } : g))
          );
          setWizardStpvGroups((prev) =>
            prev.map((g) => (quickLinkSelectedIds.includes(g.id) ? { ...g, linkedGroupId: "" } : g))
          );
          
          const groupNames = wizardStpvGroups
            .filter((g) => quickLinkSelectedIds.includes(g.id))
            .map((g) => g.name);
          if (groupNames.length > 0) {
            setOptionGroups((prev) =>
              prev.map((g) => (groupNames.includes(g.name) ? { ...g, linkedGroupId: "" } : g))
            );
          }
        }
        
        onNotification(`Đã huỷ liên kết hàng loạt thành công cho ${quickLinkSelectedIds.length} bản ghi!`, "success");
        setQuickLinkSelectedIds([]);
      };

      const autoLinkDishes = () => {
        let count = 0;
        const updatedItems = quickLinkEditingItems.map((item) => {
          if (!item.linkedDishId) {
            const matched = wizardCukCukDishes.find(
              (cc) => cc.name.toLowerCase() === item.name.toLowerCase()
            );
            if (matched) {
              count++;
              return { ...item, linkedDishId: matched.id, isLinked: true };
            }
          }
          return item;
        });

        if (count > 0) {
          setQuickLinkEditingItems(updatedItems);
          setShopeeMenuItems(updatedItems);
          setWizardFoods(updatedItems);
          onNotification(`Đã thực hiện liên kết nhanh ${count} món trùng tên thành công!`, "success");
        } else {
          onNotification("Không tìm thấy món chưa liên kết nào trùng tên với món tại MISA CukCuk.", "info");
        }
      };

      const autoLinkStpvs = () => {
        let count = 0;
        const updatedItems = quickLinkEditingStpv.map((item) => {
          if (!item.linkedGroupId) {
            const matched = wizardCukCukGroups.find(
              (cc) => cc.name.toLowerCase() === item.name.toLowerCase()
            );
            if (matched) {
              count++;
              return { ...item, linkedGroupId: matched.id };
            }
          }
          return item;
        });

        if (count > 0) {
          setQuickLinkEditingStpv(updatedItems);
          setWizardStpv(updatedItems);
          onNotification(`Đã thực hiện liên kết nhanh ${count} sở thích phục vụ trùng tên thành công!`, "success");
        } else {
          onNotification("Không tìm thấy sở thích phục vụ chưa liên kết nào trùng tên với MISA CukCuk.", "info");
        }
      };

      const autoLinkMenuGroups = () => {
        let count = 0;
        const updatedGroups = quickLinkEditingMenuGroups.map((group) => {
          if (!group.linkedGroupId) {
            const matched = wizardCukCukMenuGroups.find(
              (cc) => cc.name.toLowerCase() === group.name.toLowerCase()
            );
            if (matched) {
              count++;
              return { ...group, linkedGroupId: matched.id };
            }
          }
          return group;
        });

        if (count > 0) {
          setQuickLinkEditingMenuGroups(updatedGroups);
          setWizardMenuGroups(updatedGroups);
          setShopeeMenuGroups(updatedGroups);
          onNotification(`Đã thực hiện liên kết nhanh ${count} nhóm thực đơn trùng tên thành công!`, "success");
        } else {
          onNotification("Không tìm thấy nhóm thực đơn chưa liên kết nào trùng tên với MISA CukCuk.", "info");
        }
      };

      const autoLinkStpvGroups = () => {
        let count = 0;
        const updatedGroups = quickLinkEditingStpvGroups.map((group) => {
          if (!group.linkedGroupId) {
            const matched = wizardCukCukStpvGroups.find(
              (cc) => cc.name.toLowerCase() === group.name.toLowerCase()
            );
            if (matched) {
              count++;
              return { ...group, linkedGroupId: matched.id };
            }
          }
          return group;
        });

        if (count > 0) {
          setQuickLinkEditingStpvGroups(updatedGroups);
          setWizardStpvGroups(updatedGroups);
          onNotification(`Đã thực hiện liên kết nhanh ${count} nhóm sở thích phục vụ trùng tên thành công!`, "success");
        } else {
          onNotification("Không tìm thấy nhóm sở thích phục vụ chưa liên kết nào trùng tên với MISA CukCuk.", "info");
        }
      };

      // Unlinked counts and matched unlinked counts for each subtab
      const dishesUnlinked = quickLinkEditingItems.filter((item) => !item.linkedDishId);
      const unlinkedDishesCount = dishesUnlinked.length;
      const unlinkedMatchedDishesCount = dishesUnlinked.filter((item) =>
        wizardCukCukDishes.some((cc) => cc.name.toLowerCase() === item.name.toLowerCase())
      ).length;

      const menuGroupsUnlinked = quickLinkEditingMenuGroups.filter((g) => !g.linkedGroupId);
      const unlinkedMenuGroupsCount = menuGroupsUnlinked.length;

      const stpvsUnlinked = quickLinkEditingStpv.filter((item) => !item.linkedGroupId);
      const unlinkedStpvsCount = stpvsUnlinked.length;
      const unlinkedMatchedStpvCount = stpvsUnlinked.filter((item) =>
        wizardCukCukGroups.some((cc) => cc.name.toLowerCase() === item.name.toLowerCase())
      ).length;

      const stpvGroupsUnlinked = quickLinkEditingStpvGroups.filter((g) => !g.linkedGroupId);
      const unlinkedStpvGroupsCount = stpvGroupsUnlinked.length;

      // Filtered items based on active subtab and filter values
      let filteredItems: any[] = [];

      if (quickLinkTab === "dish") {
        filteredItems = quickLinkEditingItems.filter((item) => {
          // Status filter
          if (quickLinkStatusFilter === "unlinked" && item.linkedDishId) return false;
          if (quickLinkStatusFilter === "linked" && !item.linkedDishId) return false;

          // Search text
          if (
            quickLinkSearchText &&
            !item.name.toLowerCase().includes(quickLinkSearchText.toLowerCase())
          ) {
            return false;
          }

          // Category filter
          if (
            quickLinkCategoryFilter &&
            !(item.category || "").toLowerCase().includes(quickLinkCategoryFilter.toLowerCase())
          ) {
            return false;
          }

          // Unit filter
          if (
            quickLinkUnitFilter &&
            !(item.unit || "").toLowerCase().includes(quickLinkUnitFilter.toLowerCase())
          ) {
            return false;
          }

          // CukCuk search text
          if (quickLinkCukCukSearchText) {
            const matchedCukCuk = wizardCukCukDishes.find((cc) => cc.id === item.linkedDishId);
            const ccName = matchedCukCuk ? matchedCukCuk.name.toLowerCase() : "";
            const ccCode = matchedCukCuk ? (matchedCukCuk.code || "").toLowerCase() : "";
            const search = quickLinkCukCukSearchText.toLowerCase();
            if (!ccName.includes(search) && !ccCode.includes(search)) {
              return false;
            }
          }

          return true;
        });
      } else if (quickLinkTab === "menuGroup") {
        filteredItems = quickLinkEditingMenuGroups.filter((group) => {
          // Status filter
          if (quickLinkStatusFilter === "unlinked" && group.linkedGroupId) return false;
          if (quickLinkStatusFilter === "linked" && !group.linkedGroupId) return false;

          // Group Name search
          if (
            quickLinkMenuGroupNameSearch &&
            !group.name.toLowerCase().includes(quickLinkMenuGroupNameSearch.toLowerCase())
          ) {
            return false;
          }

          // Group Desc search
          if (
            quickLinkMenuGroupDescSearch &&
            !(group.description || "").toLowerCase().includes(quickLinkMenuGroupDescSearch.toLowerCase())
          ) {
            return false;
          }

          // CukCuk Group search
          if (quickLinkMenuGroupCukCukSearch) {
            const matchedCukCuk = wizardCukCukMenuGroups.find((cc) => cc.id === group.linkedGroupId);
            const ccName = matchedCukCuk ? matchedCukCuk.name.toLowerCase() : "";
            const ccCode = matchedCukCuk ? (matchedCukCuk.code || "").toLowerCase() : "";
            const search = quickLinkMenuGroupCukCukSearch.toLowerCase();
            if (!ccName.includes(search) && !ccCode.includes(search)) {
              return false;
            }
          }

          return true;
        });
      } else if (quickLinkTab === "stpv") {
        filteredItems = quickLinkEditingStpv.filter((item) => {
          // Status filter
          if (quickLinkStatusFilter === "unlinked" && item.linkedGroupId) return false;
          if (quickLinkStatusFilter === "linked" && !item.linkedGroupId) return false;

          // Name search
          if (
            quickLinkSearchText &&
            !item.name.toLowerCase().includes(quickLinkSearchText.toLowerCase())
          ) {
            return false;
          }

          // Stpv Group Filter
          if (
            quickLinkStpvGroupFilter &&
            !(item.group || "").toLowerCase().includes(quickLinkStpvGroupFilter.toLowerCase())
          ) {
            return false;
          }

          // CukCuk search text
          if (quickLinkCukCukSearchText) {
            const matchedCukCuk = wizardCukCukGroups.find((cc) => cc.id === item.linkedGroupId);
            const ccName = matchedCukCuk ? matchedCukCuk.name.toLowerCase() : "";
            const ccCode = matchedCukCuk ? (matchedCukCuk.code || "").toLowerCase() : "";
            const search = quickLinkCukCukSearchText.toLowerCase();
            if (!ccName.includes(search) && !ccCode.includes(search)) {
              return false;
            }
          }

          return true;
        });
      } else if (quickLinkTab === "stpvGroup") {
        filteredItems = quickLinkEditingStpvGroups.filter((group) => {
          // Status filter
          if (quickLinkStatusFilter === "unlinked" && group.linkedGroupId) return false;
          if (quickLinkStatusFilter === "linked" && !group.linkedGroupId) return false;

          // Group Name search
          if (
            quickLinkStpvGroupNameSearch &&
            !group.name.toLowerCase().includes(quickLinkStpvGroupNameSearch.toLowerCase())
          ) {
            return false;
          }

          // Group Desc search
          if (
            quickLinkStpvGroupDescSearch &&
            !(group.description || "").toLowerCase().includes(quickLinkStpvGroupDescSearch.toLowerCase())
          ) {
            return false;
          }

          // CukCuk search
          if (quickLinkStpvGroupCukCukSearch) {
            const matchedCukCuk = wizardCukCukStpvGroups.find((cc) => cc.id === group.linkedGroupId);
            const ccName = matchedCukCuk ? matchedCukCuk.name.toLowerCase() : "";
            const ccCode = matchedCukCuk ? (matchedCukCuk.code || "").toLowerCase() : "";
            const search = quickLinkStpvGroupCukCukSearch.toLowerCase();
            if (!ccName.includes(search) && !ccCode.includes(search)) {
              return false;
            }
          }

          return true;
        });
      }

      // Pagination calculations
      const totalCount = filteredItems.length;
      const startIndex = (quickLinkPage - 1) * quickLinkRowsPerPage;
      const endIndex = Math.min(startIndex + quickLinkRowsPerPage, totalCount);
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      const totalPages = Math.ceil(totalCount / quickLinkRowsPerPage) || 1;

      // Matched counts for Menu Groups and STPV Groups
      const matchedMenuGroupsCount = quickLinkEditingMenuGroups.filter((g) =>
        wizardCukCukMenuGroups.some((cc) => cc.name.toLowerCase() === g.name.toLowerCase())
      ).length;
      const unlinkedMatchedMenuGroupsCount = quickLinkEditingMenuGroups.filter((g) => {
        const hasMatch = wizardCukCukMenuGroups.some((cc) => cc.name.toLowerCase() === g.name.toLowerCase());
        return hasMatch && !g.linkedGroupId;
      }).length;

      const matchedStpvGroupsCount = quickLinkEditingStpvGroups.filter((g) =>
        wizardCukCukStpvGroups.some((cc) => cc.name.toLowerCase() === g.name.toLowerCase())
      ).length;
      const unlinkedMatchedStpvGroupsCount = quickLinkEditingStpvGroups.filter((g) => {
        const hasMatch = wizardCukCukStpvGroups.some((cc) => cc.name.toLowerCase() === g.name.toLowerCase());
        return hasMatch && !g.linkedGroupId;
      }).length;

      let currentUnlinkedMatchedCount = 0;
      let currentItemTypeLabel = "";
      let activeUnlinkedCount = 0;

      if (quickLinkTab === "dish") {
        currentUnlinkedMatchedCount = unlinkedMatchedDishesCount;
        currentItemTypeLabel = "món";
        activeUnlinkedCount = unlinkedDishesCount;
      } else if (quickLinkTab === "menuGroup") {
        currentUnlinkedMatchedCount = unlinkedMatchedMenuGroupsCount;
        currentItemTypeLabel = "nhóm thực đơn";
        activeUnlinkedCount = unlinkedMenuGroupsCount;
      } else if (quickLinkTab === "stpv") {
        currentUnlinkedMatchedCount = unlinkedMatchedStpvCount;
        currentItemTypeLabel = "sở thích phục vụ";
        activeUnlinkedCount = unlinkedStpvsCount;
      } else if (quickLinkTab === "stpvGroup") {
        currentUnlinkedMatchedCount = unlinkedMatchedStpvGroupsCount;
        currentItemTypeLabel = "nhóm STPV";
        activeUnlinkedCount = unlinkedStpvGroupsCount;
      }

      const handleAutoLinkActiveTab = () => {
        if (quickLinkTab === "dish") autoLinkDishes();
        else if (quickLinkTab === "menuGroup") autoLinkMenuGroups();
        else if (quickLinkTab === "stpv") autoLinkStpvs();
        else if (quickLinkTab === "stpvGroup") autoLinkStpvGroups();
      };

      return (
        <div className="fixed inset-0 bg-[#F0F2F4] z-[10030] flex flex-col font-sans select-none overflow-hidden text-left animate-fade-in">
          {/* Header - White background, Black title, height 48px */}
          <div
            className="flex items-center justify-between px-6 bg-white border-b border-[#E9EAEB] text-[#101828] flex-shrink-0"
            style={{ height: "48px" }}
          >
            <div className="flex items-center gap-2">
              <h2 className="text-[#101828] font-bold text-[18px] font-sans">
                Liên kết món nhanh
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsQuickLinkModalOpen(false)}
              className="text-[#717680] hover:text-[#101828] p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent outline-none flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtab Navigation (Thực đơn / Nhóm thực đơn / Sở thích phục vụ / Nhóm SPTV) */}
          <div className="bg-white border-b border-[#E9EAEB] px-6 h-12 flex items-center gap-6 flex-shrink-0 overflow-x-auto whitespace-nowrap">
            {/* Tab 1: Thực đơn */}
            <button
              type="button"
              onClick={() => {
                setQuickLinkTab("dish");
                setQuickLinkPage(1);
                setQuickLinkSearchText("");
                setQuickLinkCukCukSearchText("");
                setQuickLinkStatusFilter("unlinked");
                setQuickLinkCategoryFilter("");
                setQuickLinkUnitFilter("");
                setQuickLinkActiveDropdownId(null);
                setQuickLinkSelectedIds([]);
              }}
              className={`h-full relative px-2 text-[14px] font-semibold transition-all cursor-pointer bg-transparent border-none outline-none ${
                quickLinkTab === "dish" ? "text-[#245FDF]" : "text-[#717680] hover:text-[#101828]"
              }`}
            >
              Thực đơn
              {quickLinkTab === "dish" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#245FDF] rounded-t-full" />
              )}
            </button>

            {/* Tab 2: Nhóm thực đơn */}
            <button
              type="button"
              onClick={() => {
                setQuickLinkTab("menuGroup");
                setQuickLinkPage(1);
                setQuickLinkStatusFilter("unlinked");
                setQuickLinkMenuGroupNameSearch("");
                setQuickLinkMenuGroupDescSearch("");
                setQuickLinkMenuGroupCukCukSearch("");
                setQuickLinkActiveDropdownId(null);
                setQuickLinkSelectedIds([]);
              }}
              className={`h-full relative px-2 text-[14px] font-semibold transition-all cursor-pointer bg-transparent border-none outline-none ${
                quickLinkTab === "menuGroup" ? "text-[#245FDF]" : "text-[#717680] hover:text-[#101828]"
              }`}
            >
              Nhóm thực đơn
              {quickLinkTab === "menuGroup" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#245FDF] rounded-t-full" />
              )}
            </button>

            {/* Tab 3: Sở thích phục vụ */}
            <button
              type="button"
              onClick={() => {
                setQuickLinkTab("stpv");
                setQuickLinkPage(1);
                setQuickLinkSearchText("");
                setQuickLinkCukCukSearchText("");
                setQuickLinkStatusFilter("unlinked");
                setQuickLinkStpvGroupFilter("");
                setQuickLinkActiveDropdownId(null);
                setQuickLinkSelectedIds([]);
              }}
              className={`h-full relative px-2 text-[14px] font-semibold transition-all cursor-pointer bg-transparent border-none outline-none ${
                quickLinkTab === "stpv" ? "text-[#245FDF]" : "text-[#717680] hover:text-[#101828]"
              }`}
            >
              Sở thích phục vụ
              {quickLinkTab === "stpv" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#245FDF] rounded-t-full" />
              )}
            </button>

            {/* Tab 4: Nhóm SPTV */}
            <button
              type="button"
              onClick={() => {
                setQuickLinkTab("stpvGroup");
                setQuickLinkPage(1);
                setQuickLinkStatusFilter("unlinked");
                setQuickLinkStpvGroupNameSearch("");
                setQuickLinkStpvGroupDescSearch("");
                setQuickLinkStpvGroupCukCukSearch("");
                setQuickLinkActiveDropdownId(null);
                setQuickLinkSelectedIds([]);
              }}
              className={`h-full relative px-2 text-[14px] font-semibold transition-all cursor-pointer bg-transparent border-none outline-none ${
                quickLinkTab === "stpvGroup" ? "text-[#245FDF]" : "text-[#717680] hover:text-[#101828]"
              }`}
            >
              Nhóm SPTV
              {quickLinkTab === "stpvGroup" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#245FDF] rounded-t-full" />
              )}
            </button>
          </div>

          {/* Main content body */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
            {/* 💠 Segments: Chưa liên kết vs Đã liên kết */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl w-fit select-none flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setQuickLinkStatusFilter("unlinked");
                  setQuickLinkPage(1);
                  setQuickLinkSelectedIds([]);
                }}
                className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 cursor-pointer border-none flex items-center gap-1.5 ${
                  quickLinkStatusFilter === "unlinked"
                    ? "bg-white text-[#245FDF] shadow-[0_1px_4px_0_rgba(0,0,0,0.1)]"
                    : "text-[#717680] hover:text-[#245FDF] hover:bg-[#F0F6FE]/50 bg-transparent"
                }`}
              >
                <span>Chưa liên kết</span>
                {activeUnlinkedCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#D92D20] text-white text-[10px] font-bold flex items-center justify-center font-mono">
                    {activeUnlinkedCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuickLinkStatusFilter("linked");
                  setQuickLinkPage(1);
                  setQuickLinkSelectedIds([]);
                }}
                className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 cursor-pointer border-none ${
                  quickLinkStatusFilter === "linked"
                    ? "bg-white text-[#245FDF] shadow-[0_1px_4px_0_rgba(0,0,0,0.1)]"
                    : "text-[#717680] hover:text-[#245FDF] hover:bg-[#F0F6FE]/50 bg-transparent"
                }`}
              >
                Đã liên kết
              </button>
            </div>

            {/* 💠 BulkActionBar for Quick Link "Linked" (Đã liên kết) tab when selected count > 0 */}
            {quickLinkStatusFilter === "linked" && quickLinkSelectedIds.length > 0 && (
              <div className="bg-[#F0F6FE] border border-[#245FDF]/20 rounded-lg p-3 flex items-center justify-between select-none animate-fade-in flex-shrink-0 h-[56px] px-4">
                <div className="flex items-center gap-4">
                  <span className="text-[#101828] text-[13px] font-sans">
                    Đã chọn <strong className="font-semibold text-[#245FDF]">{quickLinkSelectedIds.length}</strong> bản ghi
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickLinkSelectedIds([])}
                    className="text-[#245FDF] hover:underline font-medium text-[13px] bg-transparent border-none cursor-pointer"
                  >
                    Bỏ chọn
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBulkUnlink}
                    className="h-8 px-4 bg-white hover:bg-[#FEF3F2] border border-[#D5D7DA] text-[#D92D20] font-medium text-[13px] rounded-[8px] flex items-center gap-1.5 transition-all cursor-pointer font-sans shadow-sm"
                  >
                    <Unlink className="w-4 h-4" />
                    Hủy liên kết
                  </button>
                </div>
              </div>
            )}

            {/* Auto Link Suggestions Banner */}
            {currentUnlinkedMatchedCount > 0 && (
              <div className="bg-[#F0F6FE] border border-[#245FDF]/20 rounded-lg p-3.5 flex items-center justify-between select-none animate-fade-in flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#245FDF]/10 flex items-center justify-center text-[#245FDF] flex-shrink-0">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[#101828] text-[13px] font-semibold font-sans">
                      Gợi ý:
                    </span>
                    <span className="text-[#717680] text-[13px] font-sans ml-1">
                      Có <strong className="text-[#245FDF] font-semibold">{currentUnlinkedMatchedCount}</strong> {currentItemTypeLabel} chưa liên kết trên ShopeeFood trùng tên với {quickLinkTab === "dish" ? "thực đơn" : "mục tương ứng"} tại MISA CukCuk. Bạn có thể thực hiện Liên kết nhanh các {currentItemTypeLabel} này.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutoLinkActiveTab}
                  className="h-8 px-4 bg-[#245FDF] hover:bg-[#1B4EBA] border-none text-white font-medium text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans shadow-sm"
                >
                  Liên kết nhanh
                </button>
              </div>
            )}

            {/* DataTable Container */}
            <div
              className="bg-white rounded-xl border border-[#E9EAEB] flex flex-col flex-1 overflow-hidden"
              style={{ boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.04)" }}
            >
              {/* Table Area */}
              <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse select-none">
                  {quickLinkTab === "dish" ? (
                    <>
                      <colgroup>
                        {quickLinkStatusFilter === "linked" && <col style={{ width: "48px" }} />}
                        <col style={{ width: "80px" }} />
                        <col style={{ width: "220px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "120px" }} />
                        {quickLinkStatusFilter !== "linked" && <col style={{ width: "130px" }} />}
                        <col style={{ width: "320px" }} />
                        <col style={{ width: "60px" }} />
                      </colgroup>
                      <thead>
                        <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB]">
                          {/* Col 0: Checkbox */}
                          {quickLinkStatusFilter === "linked" && (
                            <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF]/10 cursor-pointer"
                                  checked={
                                    paginatedItems.length > 0 &&
                                    paginatedItems.every((item) =>
                                      quickLinkSelectedIds.includes(String(item.id))
                                    )
                                  }
                                  onChange={(e) => {
                                    const pageIds = paginatedItems.map((item) => String(item.id));
                                    if (e.target.checked) {
                                      setQuickLinkSelectedIds((prev) => {
                                        const next = [...prev];
                                        pageIds.forEach((id) => {
                                          if (!next.includes(id)) next.push(id);
                                        });
                                        return next;
                                      });
                                    } else {
                                      setQuickLinkSelectedIds((prev) =>
                                        prev.filter((id) => !pageIds.includes(id))
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </th>
                          )}

                          {/* Col 1: Ảnh */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <span className="text-[13px] font-semibold text-[#101828] font-sans">
                              Ảnh
                            </span>
                          </th>

                          {/* Col 2: Tên món ShopeeFood */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Tên món ShopeeFood
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkSearchText}
                                  onChange={(e) => setQuickLinkSearchText(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 3: Nhóm thực đơn */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Nhóm thực đơn
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkCategoryFilter}
                                  onChange={(e) => setQuickLinkCategoryFilter(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 4: Đơn vị tính */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Đơn vị tính
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkUnitFilter}
                                  onChange={(e) => setQuickLinkUnitFilter(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 5: Sao chép về CukCuk */}
                          {quickLinkStatusFilter !== "linked" && (
                            <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Sao chép về CukCuk
                              </span>
                            </th>
                          )}

                          {/* Col 6: Món tương ứng trên MISA CukCuk */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Món tương ứng trên MISA CukCuk
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkCukCukSearchText}
                                  onChange={(e) => setQuickLinkCukCukSearchText(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 7: Hủy liên kết action column with no header text */}
                          <th className="px-4 py-2 text-center align-middle h-[76px]">
                            {/* Empty header for Unlink action */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E9EAEB]">
                        {paginatedItems.length > 0 ? (
                          paginatedItems.map((item) => {
                            const spfCode = `SPF-${String(item.id).padStart(3, "0")}`;
                            const matchedCukCuk = wizardCukCukDishes.find((cc) => cc.id === item.linkedDishId);
                            const isLinked = !!item.linkedDishId;

                            return (
                              <tr key={item.id} className="hover:bg-[#EDFCF4]/40 border-b border-[#E9EAEB] transition-colors h-14">
                                {/* Col 0: Checkbox */}
                                {quickLinkStatusFilter === "linked" && (
                                  <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-center">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF]/10 cursor-pointer"
                                      checked={quickLinkSelectedIds.includes(String(item.id))}
                                      onChange={() => {
                                        const idStr = String(item.id);
                                        setQuickLinkSelectedIds((prev) =>
                                          prev.includes(idStr)
                                            ? prev.filter((id) => id !== idStr)
                                            : [...prev, idStr]
                                        );
                                      }}
                                    />
                                  </td>
                                )}

                                {/* Col 1: Ảnh */}
                                <td className="px-4 py-1 border-r border-[#E9EAEB] text-center">
                                  <div className="inline-block">
                                    {renderItemImage(item.image)}
                                  </div>
                                </td>

                                {/* Col 2: Tên */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] text-[#717680] font-mono font-bold leading-tight">
                                      {spfCode}
                                    </span>
                                    <span className="text-[13px] font-semibold text-[#101828] leading-normal">
                                      {item.name}
                                    </span>
                                  </div>
                                </td>

                                {/* Col 3: Nhóm thực đơn */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left text-[13px] text-[#101828]">
                                  {item.category}
                                </td>

                                {/* Col 4: Đơn vị tính */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left text-[13px] text-[#101828]">
                                  {item.unit}
                                </td>

                                {/* Col 5: Sao chép */}
                                {quickLinkStatusFilter !== "linked" && (
                                  <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-center">
                                    <button
                                      type="button"
                                      onClick={() => copyDishToCukCuk(item)}
                                      className="p-1.5 hover:bg-[#EBF5FF] text-[#245FDF] rounded-[8px] transition-colors cursor-pointer inline-flex items-center justify-center bg-transparent border border-transparent hover:border-[#245FDF]/15"
                                      title="Sao chép món về CukCuk"
                                    >
                                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.667 2.5V5.83333C11.667 6.05435 11.7548 6.26631 11.9111 6.42259C12.0674 6.57887 12.2793 6.66667 12.5003 6.66667H15.8337M15.8337 7.91667V6.66667L11.667 2.5H5.83366C5.39163 2.5 4.96771 2.67559 4.65515 2.98816C4.34259 3.30072 4.16699 3.72464 4.16699 4.16667V15.8333C4.16699 16.2754 4.34259 16.6993 4.65515 17.0118C4.96771 17.3244 5.39163 17.5 5.83366 17.5H12.0837M11.667 13.3333H18.3337M15.8337 15.8333L18.3337 13.3333L15.8337 10.8333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                  </td>
                                )}

                                {/* Col 6: Misa CukCuk tương ứng */}
                                <td className="px-4 py-1.5 text-left overflow-visible relative border-r border-[#E9EAEB]">
                                  <div className="flex items-center gap-2 w-full">
                                    <div className="relative flex-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (quickLinkActiveDropdownId === `quick_${item.id}`) {
                                            setQuickLinkActiveDropdownId(null);
                                          } else {
                                            setQuickLinkActiveDropdownId(`quick_${item.id}`);
                                            setQuickLinkCellDropdownSearch("");
                                          }
                                        }}
                                        className="w-full h-[32px] px-2.5 text-[13px] border border-[#D5D7DA] rounded-[8px] bg-white text-[#101828] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/10 flex items-center justify-between cursor-pointer font-medium text-left font-sans hover:border-[#245FDF]/50 transition-colors"
                                      >
                                        <span className="truncate">
                                          {matchedCukCuk ? (
                                            `[${matchedCukCuk.code}] ${matchedCukCuk.name}`
                                          ) : (
                                            <span className="text-gray-400 font-normal">
                                              Chọn món tương ứng...
                                            </span>
                                          )}
                                        </span>
                                        <svg className="w-4 h-4 text-[#717680] flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>

                                      {quickLinkActiveDropdownId === `quick_${item.id}` && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setQuickLinkActiveDropdownId(null)}
                                          />
                                          <div
                                            className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#D5D7DA] rounded-lg max-h-60 overflow-hidden flex flex-col text-left"
                                          >
                                            {/* Dropdown Search container */}
                                            <div className="p-2 border-b border-gray-100 bg-[#F5F5F5]">
                                              <input
                                                type="text"
                                                placeholder="Tìm mã, tên món..."
                                                value={quickLinkCellDropdownSearch}
                                                onChange={(e) => setQuickLinkCellDropdownSearch(e.target.value)}
                                                className="w-full h-8 px-2.5 text-[12px] border border-[#D5D7DA] rounded-md outline-none focus:border-[#245FDF] bg-white text-[#101828]"
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                              />
                                            </div>
                                            <div className="flex-1 overflow-y-auto max-h-[160px] divide-y divide-gray-50">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  updateDishLink(item.id, "", false);
                                                  setQuickLinkActiveDropdownId(null);
                                                }}
                                                className="w-full px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-sans bg-white border-none"
                                              >
                                                -- Bỏ chọn --
                                              </button>
                                              {wizardCukCukDishes
                                                .filter((cc) => {
                                                  if (!quickLinkCellDropdownSearch) return true;
                                                  const q = quickLinkCellDropdownSearch.toLowerCase();
                                                  return (
                                                    (cc.code || "").toLowerCase().includes(q) ||
                                                    cc.name.toLowerCase().includes(q)
                                                  );
                                                })
                                                .map((cc) => (
                                                  <button
                                                    key={cc.id}
                                                    type="button"
                                                    onClick={() => {
                                                      updateDishLink(item.id, cc.id, true);
                                                      setQuickLinkActiveDropdownId(null);
                                                    }}
                                                    className={`w-full px-3 py-1.5 text-left hover:bg-[#EDFCF4] cursor-pointer flex flex-col font-sans border-none ${
                                                      item.linkedDishId === cc.id
                                                        ? "bg-[#F0F6FE] text-[#245FDF] font-semibold"
                                                        : "text-[#101828] bg-white"
                                                    }`}
                                                  >
                                                    <span className="text-[10px] text-gray-400 font-semibold font-mono">
                                                      {cc.code}
                                                    </span>
                                                    <span className="text-[13px]">{cc.name}</span>
                                                  </button>
                                                ))}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Col 7: Hủy liên kết action column */}
                                <td className="px-4 py-1.5 text-center">
                                  {isLinked && (
                                    <button
                                      type="button"
                                      onClick={() => updateDishLink(item.id, "", false)}
                                      className="w-8 h-8 rounded-lg bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#D92D20] flex items-center justify-center transition-all cursor-pointer border-none outline-none inline-flex"
                                      title="Huỷ liên kết"
                                    >
                                      <Unlink className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-[#717680] text-[13px]">
                              Không tìm thấy thực đơn nào khớp với bộ lọc.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </>
                  ) : quickLinkTab === "menuGroup" ? (
                    <>
                      {/* Nhóm thực đơn columns */}
                      <colgroup>
                        {quickLinkStatusFilter === "linked" && <col style={{ width: "48px" }} />}
                        <col style={{ width: "280px" }} />
                        <col style={{ width: "320px" }} />
                        <col style={{ width: "380px" }} />
                        <col style={{ width: "60px" }} />
                      </colgroup>
                      <thead>
                        <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB]">
                          {/* Col 0: Checkbox */}
                          {quickLinkStatusFilter === "linked" && (
                            <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF]/10 cursor-pointer"
                                  checked={
                                    paginatedItems.length > 0 &&
                                    paginatedItems.every((item) =>
                                      quickLinkSelectedIds.includes(String(item.id))
                                    )
                                  }
                                  onChange={(e) => {
                                    const pageIds = paginatedItems.map((item) => String(item.id));
                                    if (e.target.checked) {
                                      setQuickLinkSelectedIds((prev) => {
                                        const next = [...prev];
                                        pageIds.forEach((id) => {
                                          if (!next.includes(id)) next.push(id);
                                        });
                                        return next;
                                      });
                                    } else {
                                      setQuickLinkSelectedIds((prev) =>
                                        prev.filter((id) => !pageIds.includes(id))
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </th>
                          )}

                          {/* Col 1: Tên nhóm thực đơn */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Tên nhóm thực đơn
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkMenuGroupNameSearch}
                                  onChange={(e) => setQuickLinkMenuGroupNameSearch(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 2: Mô tả */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Mô tả
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkMenuGroupDescSearch}
                                  onChange={(e) => setQuickLinkMenuGroupDescSearch(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 3: Nhóm thực đơn tương ứng trên MISA CukCuk */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Nhóm thực đơn tương ứng trên MISA CukCuk
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkMenuGroupCukCukSearch}
                                  onChange={(e) => setQuickLinkMenuGroupCukCukSearch(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 4: Thao tác column with no header text */}
                          <th className="px-4 py-2 text-center align-middle h-[76px]">
                            {/* Empty header for Action */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E9EAEB]">
                        {paginatedItems.length > 0 ? (
                          paginatedItems.map((group) => {
                            const matchedCukCuk = wizardCukCukMenuGroups.find((cc) => cc.id === group.linkedGroupId);
                            const isLinked = !!group.linkedGroupId;

                            return (
                              <tr key={group.id} className="hover:bg-[#EDFCF4]/40 border-b border-[#E9EAEB] transition-colors h-14">
                                {/* Col 0: Checkbox */}
                                {quickLinkStatusFilter === "linked" && (
                                  <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-center">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF]/10 cursor-pointer"
                                      checked={quickLinkSelectedIds.includes(String(group.id))}
                                      onChange={() => {
                                        const idStr = String(group.id);
                                        setQuickLinkSelectedIds((prev) =>
                                          prev.includes(idStr)
                                            ? prev.filter((id) => id !== idStr)
                                            : [...prev, idStr]
                                        );
                                      }}
                                    />
                                  </td>
                                )}

                                {/* Col 1: Tên nhóm */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left">
                                  <span className="text-[13px] font-semibold text-[#101828] leading-normal">
                                    {group.name}
                                  </span>
                                </td>

                                {/* Col 2: Mô tả */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left text-[13px] text-[#717680]">
                                  {group.description || "-"}
                                </td>

                                {/* Col 3: Nhóm thực đơn tương ứng trên MISA CukCuk */}
                                <td className="px-4 py-1.5 text-left overflow-visible relative border-r border-[#E9EAEB]">
                                  <div className="flex items-center gap-2 w-full">
                                    <div className="relative flex-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (quickLinkActiveDropdownId === `menugroup_${group.id}`) {
                                            setQuickLinkActiveDropdownId(null);
                                          } else {
                                            setQuickLinkActiveDropdownId(`menugroup_${group.id}`);
                                            setQuickLinkCellDropdownSearch("");
                                          }
                                        }}
                                        className="w-full h-[32px] px-2.5 text-[13px] border border-[#D5D7DA] rounded-[8px] bg-white text-[#101828] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/10 flex items-center justify-between cursor-pointer font-medium text-left font-sans hover:border-[#245FDF]/50 transition-colors"
                                      >
                                        <span className="truncate">
                                          {matchedCukCuk ? (
                                            `[${matchedCukCuk.code}] ${matchedCukCuk.name}`
                                          ) : (
                                            <span className="text-gray-400 font-normal">
                                              Chọn nhóm thực đơn...
                                            </span>
                                          )}
                                        </span>
                                        <svg className="w-4 h-4 text-[#717680] flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>

                                      {quickLinkActiveDropdownId === `menugroup_${group.id}` && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setQuickLinkActiveDropdownId(null)}
                                          />
                                          <div
                                            className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#D5D7DA] rounded-lg max-h-60 overflow-hidden flex flex-col text-left"
                                          >
                                            {/* Dropdown Search container */}
                                            <div className="p-2 border-b border-gray-100 bg-[#F5F5F5]">
                                              <input
                                                type="text"
                                                placeholder="Tìm mã, tên nhóm thực đơn..."
                                                value={quickLinkCellDropdownSearch}
                                                onChange={(e) => setQuickLinkCellDropdownSearch(e.target.value)}
                                                className="w-full h-8 px-2.5 text-[12px] border border-[#D5D7DA] rounded-md outline-none focus:border-[#245FDF] bg-white text-[#101828]"
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                              />
                                            </div>
                                            <div className="flex-1 overflow-y-auto max-h-[160px] divide-y divide-gray-50">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  updateMenuGroupLink(group.id, "");
                                                  setQuickLinkActiveDropdownId(null);
                                                }}
                                                className="w-full px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-sans bg-white border-none"
                                              >
                                                -- Bỏ chọn --
                                              </button>
                                              {wizardCukCukMenuGroups
                                                .filter((cc) => {
                                                  if (!quickLinkCellDropdownSearch) return true;
                                                  const q = quickLinkCellDropdownSearch.toLowerCase();
                                                  return (
                                                    (cc.code || "").toLowerCase().includes(q) ||
                                                    cc.name.toLowerCase().includes(q)
                                                  );
                                                })
                                                .map((cc) => (
                                                  <button
                                                    key={cc.id}
                                                    type="button"
                                                    onClick={() => {
                                                      updateMenuGroupLink(group.id, cc.id);
                                                      setQuickLinkActiveDropdownId(null);
                                                    }}
                                                    className={`w-full px-3 py-1.5 text-left hover:bg-[#EDFCF4] cursor-pointer flex flex-col font-sans border-none ${
                                                      group.linkedGroupId === cc.id
                                                        ? "bg-[#F0F6FE] text-[#245FDF] font-semibold"
                                                        : "text-[#101828] bg-white"
                                                    }`}
                                                  >
                                                    <span className="text-[10px] text-gray-400 font-semibold font-mono">
                                                      {cc.code}
                                                    </span>
                                                    <span className="text-[13px]">{cc.name}</span>
                                                  </button>
                                                ))}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Col 4: Hủy liên kết action column */}
                                <td className="px-4 py-1.5 text-center">
                                  {isLinked && (
                                    <button
                                      type="button"
                                      onClick={() => updateMenuGroupLink(group.id, "")}
                                      className="w-8 h-8 rounded-lg bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#D92D20] flex items-center justify-center transition-all cursor-pointer border-none outline-none inline-flex"
                                      title="Huỷ liên kết"
                                    >
                                      <Unlink className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={quickLinkStatusFilter === "linked" ? 5 : 4} className="text-center py-10 text-[#717680] text-[13px]">
                              Không tìm thấy nhóm thực đơn nào khớp với bộ lọc.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </>
                  ) : quickLinkTab === "stpv" ? (
                    <>
                      {/* Sở thích phục vụ columns */}
                      <colgroup>
                        {quickLinkStatusFilter === "linked" && <col style={{ width: "48px" }} />}
                        <col style={{ width: "320px" }} />
                        <col style={{ width: "200px" }} />
                        <col style={{ width: "380px" }} />
                        <col style={{ width: "60px" }} />
                      </colgroup>
                      <thead>
                        <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB]">
                          {/* Col 0: Checkbox */}
                          {quickLinkStatusFilter === "linked" && (
                            <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF]/10 cursor-pointer"
                                  checked={
                                    paginatedItems.length > 0 &&
                                    paginatedItems.every((item) =>
                                      quickLinkSelectedIds.includes(String(item.id))
                                    )
                                  }
                                  onChange={(e) => {
                                    const pageIds = paginatedItems.map((item) => String(item.id));
                                    if (e.target.checked) {
                                      setQuickLinkSelectedIds((prev) => {
                                        const next = [...prev];
                                        pageIds.forEach((id) => {
                                          if (!next.includes(id)) next.push(id);
                                        });
                                        return next;
                                      });
                                    } else {
                                      setQuickLinkSelectedIds((prev) =>
                                        prev.filter((id) => !pageIds.includes(id))
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </th>
                          )}

                          {/* Col 1: Tên sở thích phục vụ */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Tên sở thích phục vụ
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkSearchText}
                                  onChange={(e) => setQuickLinkSearchText(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 2: Nhóm STPV */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Nhóm STPV
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkStpvGroupFilter}
                                  onChange={(e) => setQuickLinkStpvGroupFilter(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 3: STPV tương ứng trên MISA CukCuk */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                STPV tương ứng trên MISA CukCuk
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkCukCukSearchText}
                                  onChange={(e) => setQuickLinkCukCukSearchText(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 4: Hủy liên kết action column with no header text */}
                          <th className="px-4 py-2 text-center align-middle h-[76px]">
                            {/* Empty header for Unlink action */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E9EAEB]">
                        {paginatedItems.length > 0 ? (
                          paginatedItems.map((item) => {
                            const matchedCukCukGroup = wizardCukCukGroups.find((cc) => cc.id === item.linkedGroupId);
                            const isLinked = !!item.linkedGroupId;

                            return (
                              <tr key={item.id} className="hover:bg-[#EDFCF4]/40 border-b border-[#E9EAEB] transition-colors h-14">
                                {/* Col 0: Checkbox */}
                                {quickLinkStatusFilter === "linked" && (
                                  <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-center">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF]/10 cursor-pointer"
                                      checked={quickLinkSelectedIds.includes(String(item.id))}
                                      onChange={() => {
                                        const idStr = String(item.id);
                                        setQuickLinkSelectedIds((prev) =>
                                          prev.includes(idStr)
                                            ? prev.filter((id) => id !== idStr)
                                            : [...prev, idStr]
                                        );
                                      }}
                                    />
                                  </td>
                                )}

                                {/* Col 1: Tên STPV */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left">
                                  <span className="text-[13px] font-semibold text-[#101828] leading-normal">
                                    {item.name}
                                  </span>
                                </td>

                                {/* Col 2: Nhóm STPV */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left text-[13px] text-[#101828]">
                                  {item.group}
                                </td>

                                {/* Col 3: STPV tương ứng trên MISA CukCuk */}
                                <td className="px-4 py-1.5 text-left overflow-visible relative border-r border-[#E9EAEB]">
                                  <div className="flex items-center gap-2 w-full">
                                    <div className="relative flex-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (quickLinkActiveDropdownId === `stpv_${item.id}`) {
                                            setQuickLinkActiveDropdownId(null);
                                          } else {
                                            setQuickLinkActiveDropdownId(`stpv_${item.id}`);
                                            setQuickLinkCellDropdownSearch("");
                                          }
                                        }}
                                        className="w-full h-[32px] px-2.5 text-[13px] border border-[#D5D7DA] rounded-[8px] bg-white text-[#101828] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/10 flex items-center justify-between cursor-pointer font-medium text-left font-sans hover:border-[#245FDF]/50 transition-colors"
                                      >
                                        <span className="truncate">
                                          {matchedCukCukGroup ? (
                                            `[${matchedCukCukGroup.code}] ${matchedCukCukGroup.name}`
                                          ) : (
                                            <span className="text-gray-400 font-normal">
                                              Chọn STPV tương ứng...
                                            </span>
                                          )}
                                        </span>
                                        <svg className="w-4 h-4 text-[#717680] flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>

                                      {quickLinkActiveDropdownId === `stpv_${item.id}` && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setQuickLinkActiveDropdownId(null)}
                                          />
                                          <div
                                            className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#D5D7DA] rounded-lg max-h-60 overflow-hidden flex flex-col text-left"
                                          >
                                            {/* Dropdown Search container */}
                                            <div className="p-2 border-b border-gray-100 bg-[#F5F5F5]">
                                              <input
                                                type="text"
                                                placeholder="Tìm mã, tên STPV..."
                                                value={quickLinkCellDropdownSearch}
                                                onChange={(e) => setQuickLinkCellDropdownSearch(e.target.value)}
                                                className="w-full h-8 px-2.5 text-[12px] border border-[#D5D7DA] rounded-md outline-none focus:border-[#245FDF] bg-white text-[#101828]"
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                              />
                                            </div>
                                            <div className="flex-1 overflow-y-auto max-h-[160px] divide-y divide-gray-50">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  updateStpvLink(item.id, "");
                                                  setQuickLinkActiveDropdownId(null);
                                                }}
                                                className="w-full px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-sans bg-white border-none"
                                              >
                                                -- Bỏ chọn --
                                              </button>
                                              {wizardCukCukGroups
                                                .filter((cc) => {
                                                  if (!quickLinkCellDropdownSearch) return true;
                                                  const q = quickLinkCellDropdownSearch.toLowerCase();
                                                  return (
                                                    (cc.code || "").toLowerCase().includes(q) ||
                                                    cc.name.toLowerCase().includes(q)
                                                  );
                                                })
                                                .map((cc) => (
                                                  <button
                                                    key={cc.id}
                                                    type="button"
                                                    onClick={() => {
                                                      updateStpvLink(item.id, cc.id);
                                                      setQuickLinkActiveDropdownId(null);
                                                    }}
                                                    className={`w-full px-3 py-1.5 text-left hover:bg-[#EDFCF4] cursor-pointer flex flex-col font-sans border-none ${
                                                      item.linkedGroupId === cc.id
                                                        ? "bg-[#F0F6FE] text-[#245FDF] font-semibold"
                                                        : "text-[#101828] bg-white"
                                                    }`}
                                                  >
                                                    <span className="text-[10px] text-gray-400 font-semibold font-mono">
                                                      {cc.code}
                                                    </span>
                                                    <span className="text-[13px]">{cc.name}</span>
                                                  </button>
                                                ))}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Col 4: Hủy liên kết action column */}
                                <td className="px-4 py-1.5 text-center">
                                  {isLinked && (
                                    <button
                                      type="button"
                                      onClick={() => updateStpvLink(item.id, "")}
                                      className="w-8 h-8 rounded-lg bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#D92D20] flex items-center justify-center transition-all cursor-pointer border-none outline-none inline-flex"
                                      title="Huỷ liên kết"
                                    >
                                      <Unlink className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={quickLinkStatusFilter === "linked" ? 5 : 4} className="text-center py-10 text-[#717680] text-[13px]">
                              Không tìm thấy sở thích phục vụ nào khớp với bộ lọc.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </>
                  ) : (
                    <>
                      {/* Nhóm SPTV columns */}
                      <colgroup>
                        {quickLinkStatusFilter === "linked" && <col style={{ width: "48px" }} />}
                        <col style={{ width: "280px" }} />
                        <col style={{ width: "320px" }} />
                        <col style={{ width: "380px" }} />
                        <col style={{ width: "60px" }} />
                      </colgroup>
                      <thead>
                        <tr className="bg-[#F7F7F8] border-b border-[#E9EAEB]">
                          {/* Col 0: Checkbox */}
                          {quickLinkStatusFilter === "linked" && (
                            <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF]/10 cursor-pointer"
                                  checked={
                                    paginatedItems.length > 0 &&
                                    paginatedItems.every((item) =>
                                      quickLinkSelectedIds.includes(String(item.id))
                                    )
                                  }
                                  onChange={(e) => {
                                    const pageIds = paginatedItems.map((item) => String(item.id));
                                    if (e.target.checked) {
                                      setQuickLinkSelectedIds((prev) => {
                                        const next = [...prev];
                                        pageIds.forEach((id) => {
                                          if (!next.includes(id)) next.push(id);
                                        });
                                        return next;
                                      });
                                    } else {
                                      setQuickLinkSelectedIds((prev) =>
                                        prev.filter((id) => !pageIds.includes(id))
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </th>
                          )}

                          {/* Col 1: Tên nhóm STPV */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Tên nhóm STPV
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkStpvGroupNameSearch}
                                  onChange={(e) => setQuickLinkStpvGroupNameSearch(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 2: Mô tả */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Mô tả
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkStpvGroupDescSearch}
                                  onChange={(e) => setQuickLinkStpvGroupDescSearch(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 3: Nhóm STPV tương ứng trên MISA CukCuk */}
                          <th className="px-4 py-2 text-center align-middle h-[76px] border-r border-[#E9EAEB]">
                            <div className="flex flex-col justify-between items-center h-full w-full">
                              <span className="text-[13px] font-semibold text-[#101828] font-sans">
                                Nhóm STPV tương ứng trên MISA CukCuk
                              </span>
                              <div className="w-full mt-1.5 flex border border-[#D5D7DA] rounded-[8px] bg-white h-7 items-center overflow-hidden font-normal">
                                <div className="w-7 h-full flex items-center justify-center border-r border-[#D5D7DA] bg-[#F2F4F7] text-[#717680] text-[11px] font-bold flex-shrink-0 select-none">
                                  *
                                </div>
                                <input
                                  type="text"
                                  value={quickLinkStpvGroupCukCukSearch}
                                  onChange={(e) => setQuickLinkStpvGroupCukCukSearch(e.target.value)}
                                  className="w-full px-2 py-0 text-[12px] bg-transparent outline-none h-full border-none focus:ring-0 text-[#101828]"
                                />
                              </div>
                            </div>
                          </th>

                          {/* Col 4: Thao tác column */}
                          <th className="px-4 py-2 text-center align-middle h-[76px]">
                            {/* Empty header */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E9EAEB]">
                        {paginatedItems.length > 0 ? (
                          paginatedItems.map((group) => {
                            const matchedCukCuk = wizardCukCukStpvGroups.find((cc) => cc.id === group.linkedGroupId);
                            const isLinked = !!group.linkedGroupId;

                            return (
                              <tr key={group.id} className="hover:bg-[#EDFCF4]/40 border-b border-[#E9EAEB] transition-colors h-14">
                                {/* Col 0: Checkbox */}
                                {quickLinkStatusFilter === "linked" && (
                                  <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-center">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-[#D5D7DA] text-[#245FDF] focus:ring-[#245FDF]/10 cursor-pointer"
                                      checked={quickLinkSelectedIds.includes(String(group.id))}
                                      onChange={() => {
                                        const idStr = String(group.id);
                                        setQuickLinkSelectedIds((prev) =>
                                          prev.includes(idStr)
                                            ? prev.filter((id) => id !== idStr)
                                            : [...prev, idStr]
                                        );
                                      }}
                                    />
                                  </td>
                                )}

                                {/* Col 1: Tên nhóm */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left">
                                  <span className="text-[13px] font-semibold text-[#101828] leading-normal">
                                    {group.name}
                                  </span>
                                </td>

                                {/* Col 2: Mô tả */}
                                <td className="px-4 py-1.5 border-r border-[#E9EAEB] text-left text-[13px] text-[#717680]">
                                  {group.description || "-"}
                                </td>

                                {/* Col 3: Nhóm STPV tương ứng trên MISA CukCuk */}
                                <td className="px-4 py-1.5 text-left overflow-visible relative border-r border-[#E9EAEB]">
                                  <div className="flex items-center gap-2 w-full">
                                    <div className="relative flex-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (quickLinkActiveDropdownId === `stpvgroup_${group.id}`) {
                                            setQuickLinkActiveDropdownId(null);
                                          } else {
                                            setQuickLinkActiveDropdownId(`stpvgroup_${group.id}`);
                                            setQuickLinkCellDropdownSearch("");
                                          }
                                        }}
                                        className="w-full h-[32px] px-2.5 text-[13px] border border-[#D5D7DA] rounded-[8px] bg-white text-[#101828] outline-none focus:border-[#245FDF] focus:ring-1 focus:ring-[#245FDF]/10 flex items-center justify-between cursor-pointer font-medium text-left font-sans hover:border-[#245FDF]/50 transition-colors"
                                      >
                                        <span className="truncate">
                                          {matchedCukCuk ? (
                                            `[${matchedCukCuk.code}] ${matchedCukCuk.name}`
                                          ) : (
                                            <span className="text-gray-400 font-normal">
                                              Chọn nhóm STPV...
                                            </span>
                                          )}
                                        </span>
                                        <svg className="w-4 h-4 text-[#717680] flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>

                                      {quickLinkActiveDropdownId === `stpvgroup_${group.id}` && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setQuickLinkActiveDropdownId(null)}
                                          />
                                          <div
                                            className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#D5D7DA] rounded-lg max-h-60 overflow-hidden flex flex-col text-left"
                                          >
                                            {/* Dropdown Search container */}
                                            <div className="p-2 border-b border-gray-100 bg-[#F5F5F5]">
                                              <input
                                                type="text"
                                                placeholder="Tìm mã, tên nhóm STPV..."
                                                value={quickLinkCellDropdownSearch}
                                                onChange={(e) => setQuickLinkCellDropdownSearch(e.target.value)}
                                                className="w-full h-8 px-2.5 text-[12px] border border-[#D5D7DA] rounded-md outline-none focus:border-[#245FDF] bg-white text-[#101828]"
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                              />
                                            </div>
                                            <div className="flex-1 overflow-y-auto max-h-[160px] divide-y divide-gray-50">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  updateStpvGroupLink(group.id, "");
                                                  setQuickLinkActiveDropdownId(null);
                                                }}
                                                className="w-full px-3 py-2 text-left text-[12px] text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-sans bg-white border-none"
                                              >
                                                -- Bỏ chọn --
                                              </button>
                                              {wizardCukCukStpvGroups
                                                .filter((cc) => {
                                                  if (!quickLinkCellDropdownSearch) return true;
                                                  const q = quickLinkCellDropdownSearch.toLowerCase();
                                                  return (
                                                    (cc.code || "").toLowerCase().includes(q) ||
                                                    cc.name.toLowerCase().includes(q)
                                                  );
                                                })
                                                .map((cc) => (
                                                  <button
                                                    key={cc.id}
                                                    type="button"
                                                    onClick={() => {
                                                      updateStpvGroupLink(group.id, cc.id);
                                                      setQuickLinkActiveDropdownId(null);
                                                    }}
                                                    className={`w-full px-3 py-1.5 text-left hover:bg-[#EDFCF4] cursor-pointer flex flex-col font-sans border-none ${
                                                      group.linkedGroupId === cc.id
                                                        ? "bg-[#F0F6FE] text-[#245FDF] font-semibold"
                                                        : "text-[#101828] bg-white"
                                                    }`}
                                                  >
                                                    <span className="text-[10px] text-gray-400 font-semibold font-mono">
                                                      {cc.code}
                                                    </span>
                                                    <span className="text-[13px]">{cc.name}</span>
                                                  </button>
                                                ))}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Col 4: Hủy liên kết action column */}
                                <td className="px-4 py-1.5 text-center">
                                  {isLinked && (
                                    <button
                                      type="button"
                                      onClick={() => updateStpvGroupLink(group.id, "")}
                                      className="w-8 h-8 rounded-lg bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#D92D20] flex items-center justify-center transition-all cursor-pointer border-none outline-none inline-flex"
                                      title="Huỷ liên kết"
                                    >
                                      <Unlink className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={quickLinkStatusFilter === "linked" ? 5 : 4} className="text-center py-10 text-[#717680] text-[13px]">
                              Không tìm thấy nhóm STPV nào khớp với bộ lọc.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </>
                  )}
                </table>
              </div>

              {/* Pagination fixed at bottom */}
              <div className="h-[48px] bg-gray-50 border-t border-[#E9EAEB] px-4 flex items-center justify-between flex-shrink-0 select-none">
                {/* Left: Tổng số: X */}
                <div className="text-[13px] text-[#101828] font-medium font-sans">
                  Tổng số: <span className="font-semibold">{totalCount}</span>
                </div>

                {/* Right: Số dòng/trang, Range, buttons */}
                <div className="flex items-center gap-6">
                  {/* Rows per page dropdown */}
                  <div className="flex items-center gap-1.5 text-[13px] text-[#717680] font-sans">
                    <span>Số dòng/trang:</span>
                    <select
                      value={quickLinkRowsPerPage}
                      onChange={(e) => {
                        setQuickLinkRowsPerPage(Number(e.target.value));
                        setQuickLinkPage(1);
                      }}
                      className="h-7 border border-[#D5D7DA] rounded-[6px] px-1 bg-white text-[#101828] text-[12px] outline-none cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  {/* Range display */}
                  <div className="text-[13px] text-[#717680] font-medium font-sans">
                    {totalCount > 0 ? `${startIndex + 1} – ${endIndex}` : "0 – 0"}
                  </div>

                  {/* Pagination Icon Buttons */}
                  <div className="flex items-center gap-0.5">
                    {/* First Page */}
                    <button
                      type="button"
                      disabled={quickLinkPage === 1}
                      onClick={() => setQuickLinkPage(1)}
                      className="p-1 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-md text-[#717680] transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                      title="Trang đầu"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>

                    {/* Previous Page */}
                    <button
                      type="button"
                      disabled={quickLinkPage === 1}
                      onClick={() => setQuickLinkPage((prev) => Math.max(prev - 1, 1))}
                      className="p-1 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-md text-[#717680] transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                      title="Trang trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Next Page */}
                    <button
                      type="button"
                      disabled={quickLinkPage === totalPages}
                      onClick={() => setQuickLinkPage((prev) => Math.min(prev + 1, totalPages))}
                      className="p-1 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-md text-[#717680] transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                      title="Trang sau"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Last Page */}
                    <button
                      type="button"
                      disabled={quickLinkPage === totalPages}
                      onClick={() => setQuickLinkPage(totalPages)}
                      className="p-1 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-md text-[#717680] transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                      title="Trang cuối"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Bar - only "Đóng" button */}
          <div className="h-[56px] bg-[#FAFAFA] border-t border-[#E9EAEB] px-6 flex items-center justify-end flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsQuickLinkModalOpen(false)}
              className="h-[32px] min-w-[84px] px-4 bg-[#245FDF] hover:bg-[#1B4EBA] border-none text-white font-medium text-[13px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer font-sans shadow-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      );
    }
};
