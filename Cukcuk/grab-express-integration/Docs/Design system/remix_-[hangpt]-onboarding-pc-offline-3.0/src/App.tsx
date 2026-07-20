import { useState, useEffect, FormEvent } from "react";
import { 
  Phone, 
  Mail, 
  BookOpen, 
  HelpCircle, 
  X, 
  ChevronDown, 
  Check, 
  Lock, 
  User, 
  Wifi, 
  Database, 
  Laptop, 
  Activity, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight, 
  Play, 
  Square,
  Sparkles,
  Server,
  Terminal,
  Settings,
  LogOut,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Megaphone,
  Pause,
  Search,
  Grid,
  Key,
  Printer,
  ChevronUp,
  Home,
  Menu,
  CloudDownload,
  ArrowLeftRight,
  Receipt,
  Plus,
  Globe,
  Copy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PrinterSetup } from "./components/PrinterSetup";
import { OpenShift } from "./components/OpenShift";
import { OrderScreen } from "./components/OrderScreen";
const posHostessImg = "/src/assets/images/cukcuk_pos_hostess_1783401015724.jpg";

// Types
type Language = "vi" | "en";

interface Translation {
  title: string;
  loginTitle: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginButton: string;
  registerLink: string;
  forgotPasswordLink: string;
  createOfflineData: string;
  footerLeft: string;
  footerRight: string;
  supportPhone: string;
  supportEmail: string;
  userGuide: string;
  leftDesc: string;
  errorEmptyFields: string;
  errorInvalidCreds: string;
}

const translations: Record<Language, Translation> = {
  vi: {
    title: "Phần mềm quản lý nhà hàng",
    loginTitle: "ĐĂNG NHẬP CUKCUK",
    usernameLabel: "Tên đăng nhập",
    usernamePlaceholder: "Số điện thoại/ Email",
    passwordLabel: "Mật khẩu",
    passwordPlaceholder: "Mật khẩu",
    loginButton: "ĐĂNG NHẬP",
    registerLink: "Đăng ký sử dụng",
    forgotPasswordLink: "Quên mật khẩu?",
    createOfflineData: "Tạo dữ liệu offline",
    footerLeft: "Copyright © 2015 - 2026 MISA JSC",
    footerRight: "Website:",
    supportPhone: "Tổng đài tư vấn 024 7108 6866",
    supportEmail: "Email: support@misa.com.vn",
    userGuide: "Hướng dẫn sử dụng",
    leftDesc: "Phiên bản CUKCUK Server tại nhà hàng cho phép kết nối cùng lúc nhiều thiết bị làm việc trên phần mềm CUKCUK khi nhà hàng thiết lập chế độ làm việc offline.",
    errorEmptyFields: "Vui lòng nhập tên đăng nhập và mật khẩu",
    errorInvalidCreds: "Tên đăng nhập hoặc mật khẩu không hợp lệ",
  },
  en: {
    title: "Restaurant Management Software",
    loginTitle: "CUKCUK LOGIN",
    usernameLabel: "Username",
    usernamePlaceholder: "Phone / Email",
    passwordLabel: "Password",
    passwordPlaceholder: "Password",
    loginButton: "SIGN IN",
    registerLink: "Register for service",
    forgotPasswordLink: "Forgot password?",
    createOfflineData: "Create offline database",
    footerLeft: "Copyright © 2015 - 2026 MISA JSC",
    footerRight: "Website:",
    supportPhone: "Support hotline: 024 7108 6866",
    supportEmail: "Email: support@misa.com.vn",
    userGuide: "User Guide",
    leftDesc: "CUKCUK Server edition allows multiple local devices to connect and operate simultaneously on CUKCUK software even when the restaurant runs in offline mode.",
    errorEmptyFields: "Please enter your username and password",
    errorInvalidCreds: "Invalid credentials",
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>("vi");
  const [langOpen, setLangOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  
  // App States
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Modals
  const [activeModal, setActiveModal] = useState<"register" | "forgot" | "offlineData" | "guide" | null>(null);
  
  // Server Simulation States (for Dashboard)
  const [serverRunning, setServerRunning] = useState(true);
  const [syncProgress, setSyncProgress] = useState(100);
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[System] Khởi động CUKCUK Server v4.5.12...",
    "[Database] Khởi chạy PostgreSQL Offline Database...",
    "[Server] Lắng nghe tại cổng local 3000...",
    "[Client] Đã kết nối POS-CASHIER (IP: 192.168.1.50)",
    "[Sync] Hoàn tất đồng bộ đám mây (Cloud sync completed)"
  ]);
  const [connectedClients, setConnectedClients] = useState([
    { id: "POS-01", name: "Máy thu ngân chính", ip: "192.168.1.50", status: "Active", type: "Desktop" },
    { id: "TAB-02", name: "Tablet nhà bếp", ip: "192.168.1.55", status: "Active", type: "Tablet" },
    { id: "PRT-01", name: "Máy in hóa đơn bếp", ip: "192.168.1.102", status: "Active", type: "Printer" },
    { id: "MOB-01", name: "Order di động - Phục vụ 1", ip: "192.168.1.81", status: "Idle", type: "Mobile" },
  ]);

  // CUKCUK Server Replica Specific States
  const [activeTab, setActiveTab] = useState<"general" | "sync" | "reset" | "help">("general");
  const [restaurantUrl, setRestaurantUrl] = useState("Nhà hàng Phong Dê");
  const [showBranchSelect, setShowBranchSelect] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("Nhà hàng Phong Dê");
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [machineName, setMachineName] = useState("MNSON");
  const [ipAddress, setIpAddress] = useState("192.168.16.194");
  const [portValue, setPortValue] = useState("42016");
  const [pushInterval, setPushInterval] = useState("5");
  const [workingMode, setWorkingMode] = useState("Offline");
  const [isServiceRunning, setIsServiceRunning] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [resetInProgress, setResetInProgress] = useState(false);

  // Tour Guide States
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [highlightRect, setHighlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // POS PC Tour Guide States
  const [posTourStep, setPosTourStep] = useState<number | null>(null);
  const [openShiftTourStep, setOpenShiftTourStep] = useState<number | null>(null);
  const [posTourCompleted, setPosTourCompleted] = useState(false);
  const [openShiftTourCompleted, setOpenShiftTourCompleted] = useState(false);
  const [posHighlightRect, setPosHighlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // POS PC Login States
  const [isPosLoggedIn, setIsPosLoggedIn] = useState(false);
  const [isLoggingInPos, setIsLoggingInPos] = useState(false);
  const [showPosPcLogin, setShowPosPcLogin] = useState(false);
  const [serverAddress, setServerAddress] = useState("");
  const [posUsername, setPosUsername] = useState("cttrang");
  const [posPassword, setPosPassword] = useState("••••••••");
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [isSearchingServer, setIsSearchingServer] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "pin">("password");
  const [pinValue, setPinValue] = useState("");

  // Printer Configuration States
  const [showPrinterSetup, setShowPrinterSetup] = useState(false);
  const [showOpenShift, setShowOpenShift] = useState(false);
  const [cashierPrinter, setCashierPrinter] = useState("XP-80C (Cashier Printer - USB)");
  const [allowOtherPrinter, setAllowOtherPrinter] = useState(false);
  const [printerActiveTab, setPrinterActiveTab] = useState<"bep-bar" | "tem-nhan">("bep-bar");
  const [barPrinter, setBarPrinter] = useState("Epson TM-U220 Bar (192.168.1.101)");
  const [kitchenPrinter, setKitchenPrinter] = useState("Xprinter XP-80 (LAN)");
  const [labelPrinter, setLabelPrinter] = useState("Xprinter XP-350B (Label USB)");
  const [activeReceipt, setActiveReceipt] = useState<{
    printerName: string;
    title: string;
    type: "cashier" | "bep" | "bar" | "label";
    items: { name: string; qty: number; note?: string }[];
  } | null>(null);

  // Reset Tour state on logout
  useEffect(() => {
    if (!isLoggedIn) {
      setTourCompleted(false);
      setTourStep(null);
    }
  }, [isLoggedIn]);

  // Activate tour automatically upon successful login and on general settings view
  useEffect(() => {
    if (isLoggedIn && activeTab === "general" && !tourCompleted) {
      const timer = setTimeout(() => {
        setTourStep(1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setTourStep(null);
    }
  }, [isLoggedIn, activeTab, tourCompleted]);

  // Monitor and calculate dynamic highlighted target element position
  useEffect(() => {
    if (tourStep === null) {
      setHighlightRect(null);
      return;
    }

    const updateRect = () => {
      let elementId = "";
      if (tourStep === 1) elementId = "tour-ip-address";
      if (tourStep === 2) elementId = "tour-port";
      if (tourStep === 3) elementId = "tour-ip-port-container";

      const el = document.getElementById(elementId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setHighlightRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Initial run
    updateRect();

    // Register event listeners
    window.addEventListener("resize", updateRect);
    const container = document.getElementById("main-tab-content");
    if (container) {
      container.addEventListener("scroll", updateRect);
    }

    // Interval polling to ensure position accuracy during transitions
    const timer = setInterval(updateRect, 100);

    return () => {
      window.removeEventListener("resize", updateRect);
      if (container) {
        container.removeEventListener("scroll", updateRect);
      }
      clearInterval(timer);
    };
  }, [tourStep]);

  // Reset POS Tour state on logout
  useEffect(() => {
    if (!isPosLoggedIn) {
      setPosTourCompleted(false);
      setPosTourStep(null);
      setOpenShiftTourCompleted(false);
      setOpenShiftTourStep(null);
    }
  }, [isPosLoggedIn]);

  // Keep Bếp & Bar active for kitchen and bar printer tour steps
  useEffect(() => {
    if (posTourStep !== null && (posTourStep === 2 || posTourStep === 3)) {
      setPrinterActiveTab("bep-bar");
    }
  }, [posTourStep]);

  // Monitor and calculate dynamic highlighted target element position for POS PC Guide Tour
  useEffect(() => {
    if (posTourStep === null && openShiftTourStep === null) {
      setPosHighlightRect(null);
      return;
    }

    const updateRect = () => {
      let elementId = "";
      if (posTourStep !== null) {
        if (posTourStep === 1) elementId = "pos-tour-cashier";
        if (posTourStep === 2) elementId = "pos-tour-kitchen";
        if (posTourStep === 3) elementId = "pos-tour-bar";
        if (posTourStep === 4) elementId = "pos-tour-save-btn";
      } else if (openShiftTourStep !== null) {
        if (openShiftTourStep === 1) elementId = "pos-tour-shift-select";
        if (openShiftTourStep === 2) elementId = "pos-tour-shift-hours";
        if (openShiftTourStep === 3) elementId = "pos-tour-initial-fund";
        if (openShiftTourStep === 4) elementId = "pos-tour-open-shift-btn";
      }

      if (!elementId) {
        setPosHighlightRect(null);
        return;
      }

      const el = document.getElementById(elementId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPosHighlightRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setPosHighlightRect(null);
      }
    };

    updateRect();

    window.addEventListener("resize", updateRect);
    const timer = setInterval(updateRect, 100);

    return () => {
      window.removeEventListener("resize", updateRect);
      clearInterval(timer);
    };
  }, [posTourStep, openShiftTourStep]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const t = translations[lang];

  // Auto add some logs over time if logged in and server running
  useEffect(() => {
    if (!isLoggedIn || !serverRunning) return;
    
    const interval = setInterval(() => {
      const randomEvents = [
        "[Sync] Kiểm tra cập nhật danh mục thực đơn...",
        "[Client] Đang lấy danh sách bàn trống...",
        "[Database] Tối ưu hóa chỉ mục hóa đơn (OK)",
        "[Client] Đồng bộ hóa đơn #HD-9081 thành công!",
        "[Backup] Sao lưu tự động dữ liệu offline thành công (C:/CukCuk/Backup/202607.bak)",
        "[Sync] Đang gửi 2 hóa đơn mới lên đám mây..."
      ];
      const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      setLogs((prev) => [...prev.slice(-30), `${new Date().toLocaleTimeString()} ${randomEvent}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLoggedIn, serverRunning]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError(t.errorEmptyFields);
      return;
    }

    setIsLoading(true);

    // Simulate Server Authentication Connection
    setTimeout(() => {
      setIsLoading(false);
      // Show branch select screen after successful credentials simulation
      setShowBranchSelect(true);
      setError("");
    }, 1500);
  };

  const triggerSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} [Sync] Khởi chạy đồng bộ hóa dữ liệu thủ công...`]);

    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setLogs((prevLogs) => [...prevLogs, `${new Date().toLocaleTimeString()} [Sync] Đồng bộ thành công! Tất cả 28 danh mục và 114 hóa đơn đã khớp.`]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAddClient = () => {
    const names = ["Order di động - Phục vụ 2", "Máy in Bar", "Máy POS thu ngân phụ", "Kiosk Tự phục vụ"];
    const ips = ["192.168.1.82", "192.168.1.103", "192.168.1.51", "192.168.1.75"];
    const types = ["Mobile", "Printer", "Desktop", "Tablet"];
    
    const randomIndex = Math.floor(Math.random() * names.length);
    const newClient = {
      id: `DEV-${Math.floor(Math.random() * 1000)}`,
      name: names[randomIndex],
      ip: ips[randomIndex],
      status: "Active",
      type: types[randomIndex]
    };

    setConnectedClients((prev) => [...prev, newClient]);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} [Client] Thiết bị mới kết nối: ${newClient.name} (${newClient.ip})`]);
  };

  const handleRemoveClient = (id: string, name: string) => {
    setConnectedClients((prev) => prev.filter(c => c.id !== id));
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} [Client] Thiết bị đã ngắt kết nối: ${name}`]);
  };

  // Live POS clock state
  const [posTime, setPosTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, '0');
      setPosTime(`${pad(now.getHours())}:${pad(now.getMinutes())} - ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePosLogin = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!serverAddress.trim()) {
      setToast({ message: "Vui lòng nhập hoặc tìm kiếm Địa chỉ máy chủ!", type: "error" });
      return;
    }
    
    setIsLoggingInPos(true);
    setToast({ message: "Đang kết nối đến máy chủ: " + serverAddress + "...", type: "info" });
    
    setTimeout(() => {
      setIsLoggingInPos(false);
      setIsPosLoggedIn(true);
      setShowPrinterSetup(true);
      setToast({ message: "Đăng nhập phần mềm POS PC Bán Hàng thành công!", type: "success" });
      if (!posTourCompleted) {
        setPosTourStep(1);
      }
    }, 1500);
  };

  useEffect(() => {
    if (loginMethod === "pin" && pinValue.length === 4) {
      handlePosLogin();
    }
  }, [pinValue, loginMethod]);

  if (showPosPcLogin) {
    const isSessionActive = isPosLoggedIn && !showPrinterSetup && !showOpenShift;
    return (
      <div 
        className={`flex flex-col h-screen w-screen overflow-hidden ${showPrinterSetup || showOpenShift || isSessionActive ? 'bg-white' : ''} font-sans antialiased text-[#101828] select-none`}
        style={!(showPrinterSetup || showOpenShift || isSessionActive) ? {
          backgroundImage: 'url("https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=e409c373-ecc6-497d-9c54-a046b0835c80.png&isTemp=true&tenantCode=misa")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        } : {}}
      >
        
        {/* TOP BLUE HEADER BAR (POS PC) */}
        {isPosLoggedIn ? (
          !isSessionActive ? (
            <header className="h-[48px] bg-[#004b7e] flex items-center justify-between px-4 text-white shrink-0 shadow-md relative z-10 select-none">
              {/* Left side Home button */}
              <button
                onClick={() => {
                  if (showPrinterSetup || showOpenShift) {
                    if (confirm("Bạn có muốn hủy bỏ phiên đăng nhập POS và quay lại phần mềm CUKCUK Server?")) {
                      setShowPrinterSetup(false);
                      setShowOpenShift(false);
                      setShowPosPcLogin(false);
                      setIsLoggedIn(true);
                    }
                  } else {
                    if (confirm("Bạn có muốn quay lại phần mềm CUKCUK Server?")) {
                      setShowPosPcLogin(false);
                      setIsLoggedIn(true);
                    }
                  }
                }}
                className="p-1.5 rounded text-white/90 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                title="Màn hình chính"
              >
                <Home className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Right side Group of function buttons exactly matching image sequence */}
              <div className="flex items-center gap-4">
                {/* 1. ORDER button with Plus and Dropdown icons */}
                <button
                  onClick={() => alert("Tạo Order bán hàng mới.")}
                  className="flex items-center gap-1.5 text-white font-bold h-[36px] rounded hover:bg-white/10 px-2 cursor-pointer transition-all text-xs select-none shrink-0"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                  <span className="tracking-wider text-[11px]">ORDER</span>
                  <span className="text-[8px] opacity-80 ml-0.5">▼</span>
                </button>

                {/* 2. Burger Icon */}
                <button
                  onClick={() => alert("Menu danh sách chức năng bán hàng POS.")}
                  className="p-1.5 rounded text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                  title="Thực đơn"
                >
                  <Menu className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* 3. Global Icon */}
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="p-1.5 rounded text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                  title="Ngôn ngữ"
                >
                  <Globe className="w-5 h-5" />
                </button>

                {/* 4. Cloud Download Icon */}
                <button
                  onClick={() => alert("Đang tải xuống dữ liệu đồng bộ từ đám mây...")}
                  className="p-1.5 rounded text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                  title="Tải dữ liệu"
                >
                  <CloudDownload className="w-5 h-5" />
                </button>

                {/* 5. Sync Icon (ArrowLeftRight inside a thin white circle) */}
                <button
                  onClick={triggerSync}
                  className={`p-1.5 rounded text-white hover:bg-white/10 transition-all cursor-pointer shrink-0 ${isSyncing ? "animate-spin" : ""}`}
                  title="Kiểm tra đồng bộ"
                >
                  <div className="border border-white rounded-full p-0.5 flex items-center justify-center w-[20px] h-[20px]">
                    <ArrowLeftRight className="w-3 h-3 stroke-[2.5]" />
                  </div>
                </button>

                {/* 6. Invoice Icon */}
                <button
                  onClick={() => alert("Nhật ký in / Hóa đơn tạm tính.")}
                  className="p-1.5 rounded text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                  title="Hóa đơn"
                >
                  <Receipt className="w-5 h-5" />
                </button>

                {/* 7. User Icon */}
                <button
                  onClick={() => alert("Thông tin tài khoản thu ngân: Mai Ngọc Sơn")}
                  className="p-1.5 rounded text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                  title="Tài khoản"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </header>
          ) : null
        ) : (
          <header className="h-[48px] bg-[#006cb2] flex items-center justify-between px-4 text-white shrink-0 shadow-md relative z-10 select-none">
            <div className="flex items-center gap-2.5">
              {/* CUKCUK Logo */}
              <img 
                src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=293cc555-0481-4a70-aeb8-68662ff048ec.png&isTemp=true&tenantCode=misa" 
                alt="CUKCUK Logo" 
                className="w-6 h-6 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-[18px] tracking-wide text-white">CUKCUK</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Selector matching layout */}
              <div className="relative">
                <button 
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-3 py-1 bg-[#005e9c] rounded hover:bg-[#004e82] text-xs font-semibold cursor-pointer border border-[#007cdb]"
                >
                  <span className="w-4 h-3.5 inline-flex items-center justify-center overflow-hidden relative">
                    <span className="bg-[#da251d] w-full h-full flex items-center justify-center relative">
                      <span className="text-[7px] text-[#ffff00] absolute">★</span>
                    </span>
                  </span>
                  <span>Tiếng Việt</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-90" />
                </button>
              </div>

              <button 
                onClick={() => alert("Trợ giúp trực tuyến CukCUK POS PC.")}
                className="p-1 rounded-full hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                title="Trợ giúp"
              >
                <HelpCircle className="w-5 h-5 text-white" />
              </button>

              <button 
                onClick={() => {
                  if (confirm("Bạn có muốn quay lại phần mềm CUKCUK Server?")) {
                    setShowPosPcLogin(false);
                    setIsLoggedIn(true);
                  }
                }}
                className="p-1 rounded-full hover:bg-red-600 active:bg-red-700 transition-all cursor-pointer"
                title="Quay lại Server"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </header>
        )}

        {/* MAIN BODY AREA */}
        <div className={`flex-1 w-full flex flex-col relative ${showOpenShift || isSessionActive ? "h-full" : "items-center justify-center p-4 overflow-y-auto"}`}>
          {isPosLoggedIn ? (
            <div className={`w-full ${showOpenShift || isSessionActive ? "h-full flex-1" : "flex flex-col items-center justify-center"} relative`}>
              <AnimatePresence mode="wait">
                {showPrinterSetup ? (
                  <PrinterSetup
                    setShowPrinterSetup={(val) => {
                      setShowPrinterSetup(val);
                      if (!val) {
                        setShowOpenShift(true);
                        if (posTourStep !== null) {
                          setPosTourStep(null);
                          setPosTourCompleted(true);
                          setOpenShiftTourStep(1);
                        }
                      }
                    }}
                    cashierPrinter={cashierPrinter}
                    setCashierPrinter={setCashierPrinter}
                    allowOtherPrinter={allowOtherPrinter}
                    setAllowOtherPrinter={setAllowOtherPrinter}
                    printerActiveTab={printerActiveTab}
                    setPrinterActiveTab={setPrinterActiveTab}
                    barPrinter={barPrinter}
                    setBarPrinter={setBarPrinter}
                    kitchenPrinter={kitchenPrinter}
                    setKitchenPrinter={setKitchenPrinter}
                    labelPrinter={labelPrinter}
                    setLabelPrinter={setLabelPrinter}
                    setActiveReceipt={setActiveReceipt}
                    setToast={setToast}
                  />
                ) : showOpenShift ? (
                  <OpenShift
                    onBackToPrinter={() => {
                      setShowOpenShift(false);
                      setShowPrinterSetup(true);
                      if (openShiftTourStep !== null) {
                        setOpenShiftTourStep(null);
                        setPosTourStep(4);
                      }
                    }}
                    onConfirmOpenShift={() => {
                      setShowOpenShift(false);
                      if (openShiftTourStep !== null) {
                        setOpenShiftTourStep(null);
                        setOpenShiftTourCompleted(true);
                      }
                    }}
                    setToast={setToast}
                  />
                ) : (
                  <OrderScreen
                    onBackToPrinter={() => setShowPrinterSetup(true)}
                    onLogout={() => {
                      setIsPosLoggedIn(false);
                      setToast({ message: "Đã đăng xuất khỏi POS PC!", type: "info" });
                    }}
                    onGoToServer={() => {
                      setShowPosPcLogin(false);
                      setIsLoggedIn(true);
                    }}
                    setToast={setToast}
                  />
                )}
              </AnimatePresence>

              {/* REALISTIC FLOATING PRINTED RECEIPT SIMULATION PREVIEW SLIP */}
              <AnimatePresence>
                {activeReceipt && (
                  <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 30 }}
                      className="bg-[#fefefe] shadow-2xl border border-gray-300 max-w-[340px] w-full rounded flex flex-col overflow-hidden text-gray-800 relative font-mono text-xs"
                    >
                      {/* Red Tear Line top strip */}
                      <div className="h-2 bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
                      
                      <div className="p-5 space-y-4">
                        <div className="text-center space-y-1 select-none">
                          <h4 className="font-bold text-[15px] uppercase tracking-wider text-gray-900">NHÀ HÀNG CUKCUK</h4>
                          <p className="text-[10px] text-gray-500">142 Lê Duẩn, Q. Đống Đa, Hà Nội</p>
                          <p className="text-[10px] text-gray-500">ĐT: 024.7108.6866</p>
                          <div className="h-[2px] border-b border-dashed border-gray-300 my-2" />
                          <h3 className="font-extrabold text-[13px] text-gray-900 tracking-wide mt-1">{activeReceipt.title}</h3>
                          <p className="text-[9px] text-gray-400 font-sans">Máy in: {activeReceipt.printerName}</p>
                          <p className="text-[9px] text-gray-400 font-sans">Thời gian: {new Date().toLocaleString()}</p>
                        </div>

                        {/* Receipt Items list */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between font-bold border-b border-dashed border-gray-300 pb-1 text-[11px]">
                            <span>Tên món</span>
                            <span>SL</span>
                          </div>
                          <div className="space-y-1.5 text-[11px]">
                            {activeReceipt.items.map((item, idx) => (
                              <div key={idx} className="space-y-0.5">
                                <div className="flex justify-between">
                                  <span>{idx + 1}. {item.name}</span>
                                  <span className="font-bold">x{item.qty}</span>
                                </div>
                                {item.note && (
                                  <div className="text-[10px] text-gray-500 pl-3 italic">
                                    * Chú ý: {item.note}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Barcode Mock */}
                        <div className="text-center pt-2 select-none">
                          <div className="h-[2px] border-b border-dashed border-gray-300 my-3" />
                          <div className="bg-gray-100 p-2 rounded inline-block">
                            <div className="flex justify-center items-center gap-[1px] h-8 bg-white px-2">
                              {[1,2,1,3,1,2,4,1,2,1,3,1,2,1,4,1,3,2,1,2,1].map((w, i) => (
                                <div key={i} className="bg-gray-900 h-full" style={{ width: `${w}px` }} />
                              ))}
                            </div>
                            <span className="text-[9px] tracking-widest text-gray-500 block mt-1">*CUKCUK-PRINT-TEST*</span>
                          </div>
                          <p className="text-[10px] text-emerald-600 font-sans font-bold mt-2">✓ Thiết bị đã in và phản hồi thành công</p>
                        </div>
                      </div>

                      {/* Close button inside paper roll */}
                      <div className="bg-gray-50 p-2.5 border-t border-gray-200 flex justify-center select-none">
                        <button 
                          onClick={() => setActiveReceipt(null)}
                          className="bg-gray-800 hover:bg-gray-900 text-white font-sans font-bold text-xs px-5 py-1.5 rounded cursor-pointer transition-colors"
                        >
                          Xác nhận hoàn tất
                        </button>
                      </div>

                      {/* Sawtooth bottom effect of thermal printer */}
                      <div className="flex w-full select-none">
                        {Array.from({ length: 34 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-2.5 h-1.5 bg-[#fefefe]" 
                            style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} 
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* SPLIT CARD LOGIN POS PC */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200 max-w-[920px] w-full rounded-lg flex overflow-hidden relative z-10 transition-all duration-300 ${
                loginMethod === "pin" ? "h-[585px]" : "h-[480px]"
              }`}
            >
              {/* Left Pane - Image banner with generated hostess asset */}
              <div className="w-[48%] h-full relative overflow-hidden bg-[#006cb2] select-none shrink-0 border-r border-gray-100 flex items-center justify-center">
                <img 
                  src={posHostessImg} 
                  alt="CukCuk Hostess" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to high quality restaurant hostess Unsplash placeholder in case of loading issues
                    e.currentTarget.src = "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              {/* Right Pane - Content Form */}
              <div className="flex-1 p-8 flex flex-col justify-between select-text relative">
                {isSearchingServer && (
                  <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-[#0070bc] animate-spin" />
                    <p className="text-xs font-bold text-gray-600 animate-pulse">Đang quét tìm kiếm máy chủ LAN...</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Title is always ĐĂNG NHẬP MISA CUKCUK */}
                  <div className="flex items-center justify-between pb-1">
                    <h2 className="text-[#005e9c] font-extrabold text-xl tracking-wide uppercase font-sans">
                      ĐĂNG NHẬP MISA CUKCUK
                    </h2>
                  </div>

                  <form onSubmit={handlePosLogin} className="space-y-3.5">
                    {/* Server address combobox input */}
                    <div className="space-y-1 relative">
                      <label className="block text-gray-800 text-xs font-bold mb-1">
                        Địa chỉ máy chủ
                      </label>
                      <div className="flex items-center gap-1.5">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={serverAddress}
                            onChange={(e) => setServerAddress(e.target.value)}
                            placeholder="Chọn hoặc nhập địa chỉ [ip:cổng]"
                            className="w-full border border-gray-300 rounded px-2.5 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0070bc] focus:ring-1 focus:ring-[#0070bc] pr-8 font-mono bg-white"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            setIsSearchingServer(true);
                            setToast({ message: "Đang dò quét máy chủ trong mạng nội bộ LAN...", type: "info" });
                            setTimeout(() => {
                              setIsSearchingServer(false);
                              setShowAddressDropdown(true);
                              setToast({ message: "Tìm kiếm hoàn tất! Vui lòng chọn máy chủ từ danh sách dưới đây.", type: "success" });
                            }, 1200);
                          }}
                          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 p-2 rounded flex items-center justify-center transition-colors shadow-sm cursor-pointer shrink-0 h-[34px] w-[34px]"
                          title="Tìm kiếm địa chỉ máy chủ tự động"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dropdown Options */}
                      <AnimatePresence>
                        {showAddressDropdown && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowAddressDropdown(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute left-0 right-[38px] mt-1 bg-white border border-gray-300 rounded-sm shadow-lg z-40 max-h-52 overflow-y-auto"
                            >
                              {[
                                { name: "NVCHINH-VDI", address: "10.1.96.109:42016" },
                                { name: "LVDUNG1-VDI", address: "10.1.98.201:42016" },
                                { name: "VDI-DEV-VM-898", address: "10.1.96.11:42016" },
                                { name: "CUKCUK-SERVER", address: `192.168.16.194:${portValue}` }
                              ].map((server, idx) => {
                                const isSelected = serverAddress === server.address;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setServerAddress(server.address);
                                      setShowAddressDropdown(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                      isSelected 
                                        ? "bg-[#9fc9e7] hover:bg-[#8ebcdb]" 
                                        : "hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex flex-col">
                                      <span className={`text-[12.5px] font-medium tracking-tight ${
                                        isSelected ? "text-gray-900" : "text-gray-800"
                                      }`}>
                                        {server.name}
                                      </span>
                                      <span className={`text-[11px] font-sans ${
                                        isSelected ? "text-gray-600" : "text-gray-400"
                                      }`}>
                                        {server.address}
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <div className="w-5 h-5 rounded-full bg-[#0070bc] flex items-center justify-center text-white shrink-0 shadow-sm mr-1">
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {loginMethod === "password" ? (
                      <>
                        {/* Username Input */}
                        <div className="space-y-1">
                          <label className="block text-gray-800 text-xs font-bold mb-1">
                            Tên đăng nhập
                          </label>
                          <input 
                            type="text" 
                            value={posUsername}
                            onChange={(e) => setPosUsername(e.target.value)}
                            placeholder="Số điện thoại / Email / Tên đăng nhập"
                            className="w-full border border-gray-300 rounded px-2.5 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#0070bc] focus:ring-1 focus:ring-[#0070bc]"
                          />
                        </div>

                        {/* Password input with submit button side-by-side */}
                        <div className="space-y-1">
                          <label className="block text-gray-800 text-xs font-bold mb-1">
                            Mật khẩu
                          </label>
                          <div className="flex items-center gap-1">
                            <input 
                              type="password" 
                              value={posPassword}
                              onChange={(e) => setPosPassword(e.target.value)}
                              placeholder="Mật khẩu của bạn"
                              className="flex-1 border border-gray-300 rounded-l px-2.5 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#0070bc] focus:ring-1 focus:ring-[#0070bc] h-[36px]"
                            />
                            <button 
                              type="submit"
                              disabled={isLoggingInPos}
                              className="bg-[#005e9c] hover:bg-[#004e82] text-white h-[36px] px-5 rounded-r flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
                              title="Đăng nhập"
                            >
                              {isLoggingInPos ? (
                                <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                              ) : (
                                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Remember Password Checkbox */}
                        <div className="flex items-center gap-2 pt-1">
                          <input 
                            type="checkbox" 
                            id="pos-remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-[#0070bc] border-gray-300 rounded focus:ring-[#0070bc] cursor-pointer"
                          />
                          <label htmlFor="pos-remember" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                            Nhớ mật khẩu
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        {/* PIN Code Fields */}
                        <div>
                          <label className="block text-gray-800 text-xs font-bold mb-1">
                            Mã PIN
                          </label>
                          <div className="flex gap-3 my-1 justify-center">
                            {[0, 1, 2, 3].map((index) => {
                              const isFocused = pinValue.length === index && !isLoggingInPos;
                              const char = pinValue[index];
                              return (
                                <div 
                                  key={index}
                                  className={`w-[54px] h-[44px] bg-white border ${
                                    isFocused ? "border-[#0070bc] ring-1 ring-[#0070bc]" : "border-gray-300"
                                  } rounded flex items-center justify-center text-lg font-bold text-gray-800 transition-all shadow-sm`}
                                >
                                  {char ? (
                                    <span className="w-3.5 h-3.5 rounded-full bg-gray-800" />
                                  ) : isFocused ? (
                                    <span className="w-[2px] h-6 bg-gray-900 animate-pulse" />
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Number Keyboard */}
                        <div className="grid grid-cols-4 gap-2 mt-3 max-w-[280px] mx-auto select-none">
                          {/* Row 1: 1, 2, 3, backspace */}
                          {[1, 2, 3].map((num) => (
                            <button 
                              key={num}
                              type="button" 
                              disabled={isLoggingInPos}
                              onClick={() => pinValue.length < 4 && setPinValue(prev => prev + num)}
                              className="h-11 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-800 shadow-sm rounded transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {num}
                            </button>
                          ))}
                          <button 
                            type="button" 
                            disabled={isLoggingInPos}
                            onClick={() => setPinValue(prev => prev.slice(0, -1))}
                            className="h-11 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center shadow-sm rounded transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-red-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                              <line x1="18" y1="9" x2="12" y2="15"/>
                              <line x1="12" y1="9" x2="18" y2="15"/>
                            </svg>
                          </button>

                          {/* Row 2: 4, 5, 6, C */}
                          {[4, 5, 6].map((num) => (
                            <button 
                              key={num}
                              type="button" 
                              disabled={isLoggingInPos}
                              onClick={() => pinValue.length < 4 && setPinValue(prev => prev + num)}
                              className="h-11 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-800 shadow-sm rounded transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {num}
                            </button>
                          ))}
                          <button 
                            type="button" 
                            disabled={isLoggingInPos}
                            onClick={() => setPinValue("")}
                            className="h-11 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-800 shadow-sm rounded transition-colors cursor-pointer disabled:opacity-50"
                          >
                            C
                          </button>

                          {/* Row 3: 7, 8, 9, 0 */}
                          {[7, 8, 9].map((num) => (
                            <button 
                              key={num}
                              type="button" 
                              disabled={isLoggingInPos}
                              onClick={() => pinValue.length < 4 && setPinValue(prev => prev + num)}
                              className="h-11 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-800 shadow-sm rounded transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {num}
                            </button>
                          ))}
                          <button 
                            type="button" 
                            disabled={isLoggingInPos}
                            onClick={() => pinValue.length < 4 && setPinValue(prev => prev + "0")}
                            className="h-11 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-800 shadow-sm rounded transition-colors cursor-pointer disabled:opacity-50"
                          >
                            0
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Switch Login Method Options Section */}
                <div className="flex flex-col items-center gap-1.5 select-none my-1.5">
                  <span className="text-[11px] font-bold text-gray-500">
                    Tùy chọn đăng nhập
                  </span>
                  <div className="flex gap-2">
                    {/* PIN layout selector button */}
                    <button 
                      type="button"
                      onClick={() => {
                        setLoginMethod("pin");
                        setPinValue("");
                      }}
                      className={`w-11 h-9 border rounded flex items-center justify-center cursor-pointer transition-all ${
                        loginMethod === "pin" 
                          ? "border-[#0070bc] bg-blue-50 text-[#0070bc] shadow-sm" 
                          : "border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:border-gray-300"
                      }`}
                      title="Đăng nhập bằng mã PIN"
                    >
                      <Grid className="w-5 h-5 stroke-[2.2]" />
                    </button>
                    {/* Password layout selector button */}
                    <button 
                      type="button"
                      onClick={() => setLoginMethod("password")}
                      className={`w-11 h-9 border rounded flex items-center justify-center cursor-pointer transition-all ${
                        loginMethod === "password" 
                          ? "border-[#0070bc] bg-blue-50 text-[#0070bc] shadow-sm" 
                          : "border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:border-gray-300"
                      }`}
                      title="Đăng nhập bằng Mật khẩu"
                    >
                      <Key className="w-5 h-5 stroke-[2.2]" />
                    </button>
                  </div>
                </div>

                {/* Footer links inside the box */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold select-none">
                  <button 
                    onClick={() => alert("Đăng ký sử dụng dịch vụ CukCUK POS PC.")}
                    className="text-[#006cb2] hover:underline cursor-pointer"
                  >
                    Đăng ký sử dụng
                  </button>
                  <button 
                    onClick={() => alert("Chức năng khôi phục mật khẩu POS.")}
                    className="text-gray-500 hover:text-gray-800 hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* BOTTOM WHITE INFO BANNER */}
        {!isPosLoggedIn && (
          <div className="bg-white border-t border-gray-300 py-3 text-center shrink-0 shadow-sm select-none">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-x-12 gap-y-1.5 text-xs text-gray-700 font-semibold px-4">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#006cb2]" />
                <span>Tổng đài tư vấn: 024 7108 6866</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#006cb2]" />
                <span>Email: support@misa.com.vn</span>
              </div>
              <button 
                onClick={() => alert("Đang mở tài liệu Hướng dẫn sử dụng POS PC.")}
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#006cb2] transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#006cb2]" />
                <span className="underline font-bold">Hướng dẫn sử dụng</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              Thời gian làm việc: Thứ 2 - Thứ 6: từ 7:30 đến 22:00, Thứ 7, Chủ nhật: Sáng 8:00 - 12:00; Chiều 13:30 - 22:00
            </p>
          </div>
        )}

        {/* BOTTOM STATUS DARK BAR */}
        {!isSessionActive && (
          <footer className="h-[28px] bg-[#004e80] text-white/90 text-[11px] font-medium flex items-center justify-between px-4 select-none shrink-0 font-mono">
            {isPosLoggedIn ? (
              <span className="font-sans font-bold tracking-wide">
                {restaurantUrl === "Buffet" && "BF0001 - Buffet Hải Sản Quốc Tế"}
                {restaurantUrl === "CTTrang" && "CTT0001 - Chi Nhánh CTTrang"}
                {restaurantUrl === "Chi nhánh Hà Nội" && "CNHN0001 - Chi Nhánh Hà Nội"}
                {restaurantUrl === "Chi nhánh Huyền Trang" && "CNHT0001 - Chi Nhánh Huyền Trang"}
                {restaurantUrl === "Dê ré Song Dương" && "DRSD0001 - Dê ré Song Dương"}
                {restaurantUrl === "Nhà hàng Phong Dê" && "NHPD0001 - Nhà hàng Phong Dê"}
                {restaurantUrl === "Hana shop" && "HNS0001 - Hana Shop"}
                {restaurantUrl === "KRU10-PXL2" && "KRU10-PXL2 - Chi Nhánh KRU10"}
                {restaurantUrl === "Thế Giới Hải Sản" && "TGHS0001 - Thế Giới Hải Sản Chi Nhánh Hùng Vương"}
                {!["Buffet", "CTTrang", "Chi nhánh Hà Nội", "Chi nhánh Huyền Trang", "Dê ré Song Dương", "Nhà hàng Phong Dê", "Hana shop", "KRU10-PXL2", "Thế Giới Hải Sản"].includes(restaurantUrl) && `${restaurantUrl.toUpperCase().replace(/\s+/g, '')}0001 - ${restaurantUrl}`}
              </span>
            ) : (
              <span>Copyright © 2015 - 2026 MISA JSC | www.misa.com.vn</span>
            )}
            <div className="flex items-center gap-4">
              <span>OVR</span>
              <span>NUM</span>
              <span>{posTime}</span>
            </div>
          </footer>
        )}

        {/* Toast rendering inside POS PC view */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 pointer-events-none select-none">
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`px-4 py-3 rounded shadow-2xl flex items-center gap-2 border text-xs font-semibold pointer-events-auto ${
                toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" :
                "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              {toast.type === "success" && <Check className="w-4 h-4 shrink-0 text-emerald-600" />}
              {toast.type === "error" && <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
              {toast.type === "info" && <HelpCircle className="w-4 h-4 shrink-0 text-blue-600" />}
              <span>{toast.message}</span>
            </motion.div>
          </div>
        )}

        {/* POS PC Guide Tour Overlay */}
        {isPosLoggedIn && (posTourStep !== null || openShiftTourStep !== null) && posHighlightRect && (
          <div className="fixed inset-0 z-40 select-none pointer-events-none">
            {/* 4 Transparent Backdrop panels that block click interactions outside the spotlight zone */}
            <div 
              className="fixed bg-transparent z-40 pointer-events-auto"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: Math.max(0, posHighlightRect.top - 8),
              }}
            />
            <div 
              className="fixed bg-transparent z-40 pointer-events-auto"
              style={{
                top: posHighlightRect.top + posHighlightRect.height + 8,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <div 
              className="fixed bg-transparent z-40 pointer-events-auto"
              style={{
                top: Math.max(0, posHighlightRect.top - 8),
                left: 0,
                width: Math.max(0, posHighlightRect.left - 8),
                height: posHighlightRect.height + 16,
              }}
            />
            <div 
              className="fixed bg-transparent z-40 pointer-events-auto"
              style={{
                top: Math.max(0, posHighlightRect.top - 8),
                left: posHighlightRect.left + posHighlightRect.width + 8,
                right: 0,
                height: posHighlightRect.height + 16,
              }}
            />

            {/* Single Backdrop panel with perfect rounded corners and massive box shadow to render the darkened overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed pointer-events-none z-40"
              style={{
                top: posHighlightRect.top - 8,
                left: posHighlightRect.left - 8,
                width: posHighlightRect.width + 16,
                height: posHighlightRect.height + 16,
                borderRadius: "8px",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)",
              }}
            />

            {/* Highlight zone outline */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed border-2 border-[#0070bc] rounded-lg pointer-events-none z-50"
              style={{
                top: posHighlightRect.top - 8,
                left: posHighlightRect.left - 8,
                width: posHighlightRect.width + 16,
                height: posHighlightRect.height + 16,
              }}
            />

            {/* Tooltip Balloon */}
            <motion.div
              initial={{ opacity: 0, y: (posTourStep === 4 || openShiftTourStep === 4) ? -15 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`fixed bg-white border border-gray-200 rounded-lg shadow-2xl p-5 z-50 flex flex-col gap-3 select-text w-[450px] pointer-events-auto ${(posTourStep === 4 || openShiftTourStep === 4) ? '-translate-y-full' : ''}`}
              style={{
                top: (posTourStep === 4 || openShiftTourStep === 4)
                  ? posHighlightRect.top - 16 
                  : posHighlightRect.top + posHighlightRect.height + 16,
                left: Math.max(16, Math.min(window.innerWidth - 466, posHighlightRect.left)),
              }}
            >
              {/* Arrow pointing to the highlighted component */}
              {(posTourStep === 4 || openShiftTourStep === 4) ? (
                /* Arrow at the bottom of the balloon pointing down */
                <div 
                  className="absolute -bottom-1.5 w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45"
                  style={{
                    left: Math.min(410, Math.max(20, posHighlightRect.left + (posHighlightRect.width / 2) - Math.max(16, Math.min(window.innerWidth - 466, posHighlightRect.left)) - 6)),
                  }}
                />
              ) : (
                /* Arrow at the top of the balloon pointing up */
                <div 
                  className="absolute -top-1.5 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"
                  style={{
                    left: Math.min(410, Math.max(20, posHighlightRect.left + (posHighlightRect.width / 2) - Math.max(16, Math.min(window.innerWidth - 466, posHighlightRect.left)) - 6)),
                  }}
                />
              )}

              {/* Header / Step Indicator */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-[11.5px] font-bold text-[#0070bc] uppercase tracking-wider">
                  {posTourStep !== null 
                    ? `Hướng dẫn thiết lập máy in • Bước ${posTourStep} / 4` 
                    : `Hướng dẫn mở ca bán hàng • Bước ${openShiftTourStep} / 4`
                  }
                </span>
                <button 
                  onClick={() => {
                    if (posTourStep !== null) {
                      setPosTourStep(null);
                      setPosTourCompleted(true);
                    } else if (openShiftTourStep !== null) {
                      setOpenShiftTourStep(null);
                      setOpenShiftTourCompleted(true);
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Đóng hướng dẫn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="text-[13px] text-gray-700 leading-relaxed font-semibold">
                {posTourStep === 1 && (
                  <p>
                    Đây là nơi thiết lập máy in cho quầy <strong>Thu ngân</strong>. Máy in này dùng để in <strong>Hóa đơn tạm tính</strong> và <strong>Hóa đơn thanh toán</strong>. 
                    MISA CUKCUK đã tự động chọn máy in mặc định <code className="bg-blue-50 px-1 py-0.5 rounded text-blue-700 font-sans font-bold text-[12.5px]">XP-80C (USB)</code>. 
                    Bạn có thể bấm <strong className="text-gray-900">In thử</strong> để kiểm tra kết nối với máy in thực tế.
                  </p>
                )}
                {posTourStep === 2 && (
                  <p>
                    Tiếp theo, hãy lựa chọn máy in cho khu vực <strong>Nhà bếp (Kitchen)</strong>. Phiếu chế biến món ăn sẽ tự động in tại đây ngay khi thu ngân gửi yêu cầu, 
                    giúp đầu bếp nhận món tức thì mà không cần di chuyển. Quý khách nên sử dụng máy in kết nối qua <strong>mạng LAN</strong> để đảm bảo đường truyền ổn định nhất.
                  </p>
                )}
                {posTourStep === 3 && (
                  <p>
                    Tương tự, hãy thiết lập máy in cho khu vực <strong>Quầy Bar / Pha chế</strong> để tự động in phiếu chế biến đồ uống. 
                    Phần mềm CUKCUK hỗ trợ cơ chế tách phiếu in thông minh và gửi chính xác các món đồ uống xuống quầy bar để pha chế tiện lợi, tránh nhầm lẫn.
                  </p>
                )}
                {posTourStep === 4 && (
                  <p>
                    Tuyệt vời! Bạn đã hoàn thành các thiết lập máy in cơ bản và quan trọng nhất cho quán. 
                    Bây giờ hãy nhấn nút <strong className="text-gray-900">Cất & Đồng ý</strong> để lưu toàn bộ cấu hình máy in và chuyển tiếp đến màn hình <strong>Mở ca làm việc</strong> để bắt đầu bán hàng!
                  </p>
                )}
                {openShiftTourStep === 1 && (
                  <p>
                    Đầu tiên, hãy lựa chọn ca làm việc hiện tại của bạn (ví dụ: Ca Sáng hoặc Ca Tối). Việc chọn đúng ca sẽ giúp hệ thống ghi nhận chính xác doanh thu và kiểm soát chênh lệch tiền quỹ bàn giao vào cuối ca.
                  </p>
                )}
                {openShiftTourStep === 2 && (
                  <p>
                    Khung giờ làm việc tương ứng của ca bạn chọn sẽ tự động hiển thị tại đây. Lưu ý: Khung giờ này đã được thiết lập sẵn theo đúng ca làm việc trên trang quản trị CUKCUK Web của nhà hàng.
                  </p>
                )}
                {openShiftTourStep === 3 && (
                  <p>
                    Kế tiếp, bạn hãy kiểm đếm thực tế và nhập số Tiền quỹ đầu ca nhận bàn giao từ ca trước (thường dùng để thối tiền mặt cho khách hàng). Việc này giúp quản lý đối soát dòng tiền chính xác hơn.
                  </p>
                )}
                {openShiftTourStep === 4 && (
                  <p>
                    Tất cả đã hoàn thành! Bây giờ, bạn hãy nhấn nút MỞ CA để kích hoạt ca làm việc mới. Hệ thống sẽ chính thức khởi động và đưa bạn trực tiếp tới giao diện bán hàng để bắt đầu phục vụ thực khách.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 mt-1">
                {/* Back Button */}
                {((posTourStep !== null && posTourStep > 1) || openShiftTourStep !== null) && (
                  <button 
                    onClick={() => {
                      if (posTourStep !== null) {
                        setPosTourStep((prev) => prev !== null ? prev - 1 : null);
                      } else if (openShiftTourStep !== null) {
                        if (openShiftTourStep === 1) {
                          setShowOpenShift(false);
                          setShowPrinterSetup(true);
                          setOpenShiftTourStep(null);
                          setPosTourStep(4);
                        } else {
                          setOpenShiftTourStep((prev) => prev !== null ? prev - 1 : null);
                        }
                      }
                    }}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 text-xs font-bold rounded-sm transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Quay lại</span>
                  </button>
                )}
                
                {/* Next / Complete Button */}
                {posTourStep !== null ? (
                  <button 
                    onClick={() => {
                      if (posTourStep === 4) {
                        setShowPrinterSetup(false);
                        setShowOpenShift(true);
                        setToast({ message: "Chúc mừng bạn đã hoàn tất hướng dẫn thiết lập máy in thành công! Chuyển sang Mở ca làm việc...", type: "success" });
                        setPosTourStep(null);
                        setPosTourCompleted(true);
                        setOpenShiftTourStep(1);
                      } else {
                        setPosTourStep((prev) => prev !== null ? prev + 1 : null);
                      }
                    }}
                    className="bg-[#0070bc] hover:bg-[#005a96] text-white px-4 py-1.5 text-xs font-bold rounded-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Tiếp tục</span>
                  </button>
                ) : openShiftTourStep !== null ? (
                  openShiftTourStep < 4 ? (
                    <button 
                      onClick={() => {
                        setOpenShiftTourStep((prev) => prev !== null ? prev + 1 : null);
                      }}
                      className="bg-[#0070bc] hover:bg-[#005a96] text-white px-4 py-1.5 text-xs font-bold rounded-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Tiếp tục</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setOpenShiftTourStep(null);
                        setOpenShiftTourCompleted(true);
                        setShowOpenShift(false);
                        setToast({ message: "Chúc mừng bạn đã hoàn tất hướng dẫn mở ca bán hàng thành công!", type: "success" });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold rounded-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Hoàn thành</span>
                    </button>
                  )
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f0f2f5] font-sans antialiased text-[#101828]">
      
      {/* 1. TOP BLUE HEADER BAR */}
      <header className="h-[48px] bg-[#006cb2] flex items-center justify-between px-4 text-white shrink-0 shadow-md relative z-10 select-none">
        <div className="flex items-center gap-2.5">
          {/* Spoon Fork Logo */}
          <img 
            src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=293cc555-0481-4a70-aeb8-68662ff048ec.png&isTemp=true&tenantCode=misa" 
            alt="CUKCUK Logo" 
            className="w-6 h-6 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="font-medium text-[13.5px] tracking-wide opacity-95">{t.title}</span>
        </div>

        {/* Right side controls: Language switcher & Close */}
        {!isLoggedIn ? (
          <div className="flex items-center gap-3">
            {/* Separate Flag block */}
            <div className="w-[38px] h-[24px] bg-[#da251d] flex items-center justify-center relative shadow-sm shrink-0 overflow-hidden border border-red-700/20">
              {lang === "vi" ? (
                // Vietnam flag
                <span className="bg-[#da251d] w-full h-full flex items-center justify-center relative">
                  <span className="text-[12px] text-[#ffff00] absolute font-bold">★</span>
                </span>
              ) : (
                // UK / US Flag stylized
                <span className="bg-blue-800 w-full h-full flex flex-wrap content-between relative">
                  <span className="absolute inset-0 bg-blue-800"></span>
                  <span className="absolute h-0.5 w-full bg-white top-2.5"></span>
                  <span className="absolute w-0.5 h-full bg-white left-4.5"></span>
                  <span className="absolute h-[3px] w-full bg-red-600 top-2.5"></span>
                  <span className="absolute w-[3px] h-full bg-red-600 left-4.5"></span>
                </span>
              )}
            </div>

            {/* Dropdown Lang Selector Button */}
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-white text-[13.5px] font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer py-1 pr-1 font-sans"
                id="lang-selector"
              >
                <span>{lang === "vi" ? "Tiếng Việt" : "English"}</span>
                <span className="text-[10px] opacity-90">▼</span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setLangOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-1.5 w-36 bg-white rounded-md shadow-lg border border-gray-200 py-1 text-gray-800 z-30"
                    >
                      <button 
                        onClick={() => { setLang("vi"); setLangOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-gray-100 font-medium text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-[#da251d] w-4 h-3 rounded flex items-center justify-center relative">
                            <span className="text-[6px] text-[#ffff00] absolute">★</span>
                          </span>
                          <span>Tiếng Việt</span>
                        </div>
                        {lang === "vi" && <Check className="w-3.5 h-3.5 text-[#006cb2] stroke-[3]" />}
                      </button>
                      <button 
                        onClick={() => { setLang("en"); setLangOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-gray-100 font-medium text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-800 w-4 h-3 flex items-center justify-center relative overflow-hidden">
                            <span className="absolute inset-0 bg-blue-900"></span>
                            <span className="absolute w-full h-0.5 bg-white"></span>
                            <span className="absolute w-0.5 h-full bg-white"></span>
                          </span>
                          <span>English</span>
                        </div>
                        {lang === "en" && <Check className="w-3.5 h-3.5 text-[#006cb2] stroke-[3]" />}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Vertical Separator */}
            <div className="w-[1px] h-5 bg-white/20 mx-1" />

            {/* Close Button matching mockup */}
            <button 
              onClick={() => {
                if (confirm(lang === "vi" ? "Bạn muốn đóng phiên làm việc và đăng xuất?" : "Do you want to log out and exit?")) {
                  setUsername("");
                  setPassword("");
                  setIsLoggedIn(false);
                }
              }}
              className="w-[36px] h-[36px] flex items-center justify-center text-white hover:bg-red-600 active:bg-red-700 transition-all text-lg font-light cursor-pointer"
              title={lang === "vi" ? "Đóng" : "Close"}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 select-none pr-2">
            {/* Minimize button */}
            <button 
              onClick={() => alert(lang === "vi" ? "Đã thu nhỏ ứng dụng xuống khay hệ thống." : "Application minimized to system tray.")}
              className="w-[36px] h-[36px] flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 transition-all text-xl font-light cursor-pointer"
              title={lang === "vi" ? "Thu nhỏ" : "Minimize"}
            >
              –
            </button>
            {/* Maximize button */}
            <button 
              onClick={() => alert(lang === "vi" ? "Hệ thống đang hoạt động ở chế độ tối ưu kích thước cửa sổ." : "Application is already optimized for standard container size.")}
              className="w-[36px] h-[36px] flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 transition-all text-sm font-light cursor-pointer"
              title={lang === "vi" ? "Phóng to" : "Maximize"}
            >
              ⬜
            </button>
            {/* Close button */}
            <button 
              onClick={() => {
                if (tourCompleted) {
                  if (confirm(lang === "vi" ? "Bạn muốn đóng phiên làm việc của CukCUK Server và chuyển sang phần mềm POS PC?" : "Do you want to close the CukCUK Server session and switch to POS PC?")) {
                    setIsLoggedIn(false);
                    setShowPosPcLogin(true);
                  }
                } else {
                  if (confirm(lang === "vi" ? "Bạn muốn đóng phiên làm việc và đăng xuất?" : "Do you want to log out and exit?")) {
                    setUsername("");
                    setPassword("");
                    setIsLoggedIn(false);
                  }
                }
              }}
              className="w-[36px] h-[36px] flex items-center justify-center text-white hover:bg-red-600 active:bg-red-700 transition-all text-lg font-light cursor-pointer"
              title={lang === "vi" ? "Đóng" : "Close"}
            >
              ✕
            </button>
          </div>
        )}
      </header>

      {/* 2. BODY CONTENT */}
      <main className="flex-1 w-full flex flex-col md:flex-row relative">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            showBranchSelect ? (
              // --- BRANCH SELECT CONTAINER STATE ---
              <motion.div 
                key="branch-select-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center bg-white h-full w-full select-none"
              >
                {/* Card Container exactly like screenshot */}
                <div className="w-[450px] bg-[#f8f9fa] border border-gray-300 rounded shadow-md font-sans relative">
                  {/* Header (Light grey, bold title) */}
                  <div className="bg-[#eaeaea] border-b border-gray-300 py-3 px-4 text-center rounded-t">
                    <h3 className="text-[#0d5c94] font-bold text-[16px] tracking-wide">
                      Bắt đầu làm việc
                    </h3>
                  </div>

                  {/* Body (White background) */}
                  <div className="bg-white p-6 space-y-4 rounded-b">
                    <div className="space-y-1.5">
                      <label className="block text-[13px] text-gray-800 font-bold">
                        Chọn nhà hàng trong chuỗi
                      </label>
                      
                      {/* Custom combobox dropdown structure matching mockup */}
                      <div className="relative">
                        <div 
                          onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                          className="flex items-center justify-between border border-gray-400 rounded cursor-pointer hover:border-gray-500 overflow-hidden h-[34px] bg-white text-sm"
                        >
                          {/* Left Side Pin Icon + Selected text */}
                          <div className="flex items-center gap-2 px-3 text-gray-800 font-medium">
                            {/* Pin / MapMarker Icon */}
                            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-600 fill-current shrink-0">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span className="text-[13px] text-gray-900 font-bold">{selectedBranch}</span>
                          </div>

                          {/* Right Side Dropper Button */}
                          <div className="bg-[#a2c8e6] hover:bg-[#8ebadc] h-full w-[36px] flex items-center justify-center border-l border-gray-400 shrink-0">
                            {/* Downward triangle marker */}
                            <span className="text-[8px] text-gray-800">▼</span>
                          </div>
                        </div>

                        {/* Dropdown Options Box with scrollbar */}
                        <AnimatePresence>
                          {branchDropdownOpen && (
                            <>
                              {/* Backdrop to close dropdown on outside click */}
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setBranchDropdownOpen(false)} 
                              />
                              <motion.div 
                                initial={{ opacity: 0, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 2 }}
                                className="absolute left-0 right-0 mt-1 bg-white border border-gray-400 rounded shadow-lg z-50 max-h-[220px] overflow-y-auto"
                              >
                                {[
                                  "Buffet",
                                  "CTTrang",
                                  "Chi nhánh Hà Nội",
                                  "Chi nhánh Huyền Trang",
                                  "Dê ré Song Dương",
                                  "Nhà hàng Phong Dê",
                                  "Hana shop",
                                  "KRU10-PXL2"
                                ].map((branchName) => {
                                  const isActive = selectedBranch === branchName;
                                  return (
                                    <div 
                                      key={branchName}
                                      onClick={() => {
                                        setSelectedBranch(branchName);
                                        setBranchDropdownOpen(false);
                                      }}
                                      className={`px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors ${
                                        isActive 
                                          ? "bg-[#8dc5e9] text-gray-900" 
                                          : "hover:bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {branchName}
                                    </div>
                                  );
                                })}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Accept Button at the bottom of the card to proceed */}
                    <div className="pt-4 flex justify-end border-t border-gray-100 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          // Crucial: Set restaurantName state to selected branch!
                          setRestaurantUrl(selectedBranch);
                          setIsLoggedIn(true);
                          setShowBranchSelect(false);
                          setToast({ message: `Đã kết nối làm việc tại ${selectedBranch}!`, type: "success" });
                        }}
                        className="px-6 py-1.5 bg-[#006cb2] hover:bg-[#005a96] text-white rounded text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                      >
                        Đồng ý
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              
              // --- LOGIN CONTAINER STATE ---
              <motion.div 
                key="login-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col md:flex-row h-full w-full"
              >
              {/* LEFT BLUE BRAND SIDEBAR */}
              <div className="w-full md:w-[35%] bg-gradient-to-b from-[#0067ac] to-[#00528c] text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden select-none shrink-0 border-r border-[#004e84]">
                
                {/* Massive Decorative Watermark Logo in left background */}
                <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full border-[14px] border-white/5 flex items-center justify-center pointer-events-none">
                  <img 
                    src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=293cc555-0481-4a70-aeb8-68662ff048ec.png&isTemp=true&tenantCode=misa" 
                    alt="CUKCUK Logo Background" 
                    className="w-48 h-48 object-contain opacity-5"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="relative z-10 space-y-8">
                  {/* CUKCUK Logo Header */}
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=293cc555-0481-4a70-aeb8-68662ff048ec.png&isTemp=true&tenantCode=misa" 
                      alt="CUKCUK Logo" 
                      className="w-12 h-12 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="flex items-center gap-2.5">
                      <span className="text-[32px] font-black tracking-tight text-white drop-shadow-sm font-sans leading-none">CUKCUK</span>
                      <span className="px-2 py-0.5 border border-white text-white rounded text-[12px] tracking-widest font-black uppercase bg-white/15 shadow-sm select-none leading-none">
                        SERVER
                      </span>
                    </div>
                  </div>

                  {/* Brand description copy matching mockup */}
                  <p className="text-[13.5px] leading-relaxed opacity-90 font-light text-justify select-text">
                    {t.leftDesc}
                  </p>
                </div>

                {/* Left side bottom help support details */}
                <div className="mt-8 md:mt-0 relative z-10 space-y-4 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 text-white/95 text-[13px] hover:text-white transition-colors">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{t.supportPhone}</span>
                  </div>

                  <div className="flex items-center gap-3 text-white/95 text-[13px] hover:text-white transition-colors">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium select-text">{t.supportEmail}</span>
                  </div>

                  <button 
                    onClick={() => setActiveModal("guide")}
                    className="flex items-center gap-3 text-white/95 text-[13px] hover:text-white transition-all text-left w-full cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span className="underline font-semibold tracking-wide">{t.userGuide}</span>
                  </button>
                </div>
              </div>

              {/* RIGHT FORM CONTAINER (Light gray background) */}
              <div className="flex-1 bg-[#f0f2f5] flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
                <div className="w-full max-w-[460px] space-y-6">
                  
                  {/* Main Header Form text */}
                  <div className="text-center md:text-left">
                    <h2 className="text-[#0061a4] font-bold text-xl md:text-2xl tracking-wide select-none">
                      {t.loginTitle}
                    </h2>
                  </div>

                  {/* Login Form Box */}
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-md flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    {/* Username input without icon */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t.usernameLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={username}
                          onFocus={() => {
                            if (!username) setUsername("02471086866");
                            if (!password) setPassword("admin");
                          }}
                          onClick={() => {
                            if (!username) setUsername("02471086866");
                            if (!password) setPassword("admin");
                          }}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={t.usernamePlaceholder}
                          className="w-full bg-white border border-gray-300 rounded px-3.5 py-2.5 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#006cb2] focus:ring-1 focus:ring-[#006cb2] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password input without icon */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t.passwordLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="password"
                          value={password}
                          onFocus={() => {
                            if (!username) setUsername("02471086866");
                            if (!password) setPassword("admin");
                          }}
                          onClick={() => {
                            if (!username) setUsername("02471086866");
                            if (!password) setPassword("admin");
                          }}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t.passwordPlaceholder}
                          className="w-full bg-white border border-gray-300 rounded px-3.5 py-2.5 text-[13.5px] text-gray-900 focus:outline-none focus:border-[#006cb2] focus:ring-1 focus:ring-[#006cb2] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Submit Login Button */}
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#005595] hover:bg-[#00477d] active:scale-[0.99] disabled:bg-[#a0b2cc] text-white py-3 rounded text-[14px] font-bold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-5"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{lang === "vi" ? "ĐANG KẾT NỐI MÁY CHỦ..." : "CONNECTING TO SERVER..."}</span>
                        </>
                      ) : (
                        <span>{t.loginButton}</span>
                      )}
                    </button>
                  </form>

                  {/* Under Buttons Link Menu */}
                  <div className="flex items-center justify-between text-xs text-[#005595] font-semibold border-b border-gray-200 pb-5">
                    <button 
                      onClick={() => setActiveModal("register")}
                      className="hover:text-blue-800 hover:underline cursor-pointer transition-all"
                    >
                      {t.registerLink}
                    </button>
                    <button 
                      onClick={() => setActiveModal("forgot")}
                      className="hover:text-blue-800 hover:underline cursor-pointer transition-all"
                    >
                      {t.forgotPasswordLink}
                    </button>
                  </div>

                  {/* Creating offline database helper link at bottom-right of column */}
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => setActiveModal("offlineData")}
                      className="flex items-center gap-1 text-xs text-[#005595] hover:text-blue-800 hover:underline cursor-pointer font-semibold"
                    >
                      <span>{t.createOfflineData}</span>
                      <HelpCircle className="w-4 h-4 text-[#005595]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            
            // --- CUKCUK SERVER DESKTOP APP LOOK (IF LOGGED IN) ---
            <motion.div 
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex overflow-hidden h-full w-full bg-[#f0f2f5]"
            >
              {/* SIDEBAR (Dark Blue matching mockup) */}
              <div className="w-[230px] bg-[#0070bc] flex flex-col justify-between select-none shrink-0 border-r border-[#005a96] text-white">
                <div className="flex flex-col pt-4">
                  {/* Sidebar items */}
                  <button 
                    onClick={() => setActiveTab("general")}
                    className={`flex items-center gap-3 px-5 py-3 text-left font-medium text-[13.5px] transition-all cursor-pointer ${
                      activeTab === "general" 
                        ? "bg-[#005a96] text-white border-l-4 border-white/60" 
                        : "hover:bg-[#0062a3] text-white/90 border-l-4 border-transparent"
                    }`}
                  >
                    <Settings className="w-5 h-5 shrink-0" />
                    <span>Thiết lập chung</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab("sync")}
                    className={`flex items-center gap-3 px-5 py-3 text-left font-medium text-[13.5px] transition-all cursor-pointer ${
                      activeTab === "sync" 
                        ? "bg-[#005a96] text-white border-l-4 border-white/60" 
                        : "hover:bg-[#0062a3] text-white/90 border-l-4 border-transparent"
                    }`}
                  >
                    <RefreshCw className="w-5 h-5 shrink-0" />
                    <span>Đồng bộ bằng tay</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab("reset")}
                    className={`flex items-center gap-3 px-5 py-3 text-left font-medium text-[13.5px] transition-all cursor-pointer ${
                      activeTab === "reset" 
                        ? "bg-[#005a96] text-white border-l-4 border-white/60" 
                        : "hover:bg-[#0062a3] text-white/90 border-l-4 border-transparent"
                    }`}
                  >
                    <Sliders className="w-5 h-5 shrink-0" />
                    <span>Thiết lập lại dữ liệu</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab("help")}
                    className={`flex items-center gap-3 px-5 py-3 text-left font-medium text-[13.5px] transition-all cursor-pointer ${
                      activeTab === "help" 
                        ? "bg-[#005a96] text-white border-l-4 border-white/60" 
                        : "hover:bg-[#0062a3] text-white/90 border-l-4 border-transparent"
                    }`}
                  >
                    <HelpCircle className="w-5 h-5 shrink-0" />
                    <span>Trợ giúp</span>
                  </button>
                </div>

                {/* Feedback button at the very bottom of the sidebar */}
                <div className="p-3">
                  <button 
                    onClick={() => setFeedbackOpen(true)}
                    className="w-full bg-[#1c8ad4] hover:bg-[#1a80c4] py-2 px-3 flex items-center justify-center gap-2 font-semibold text-[13.5px] transition-all cursor-pointer text-white shadow-sm border border-white/10 rounded-sm"
                  >
                    <Megaphone className="w-4 h-4 shrink-0" />
                    <span>Phản hồi</span>
                  </button>
                </div>
              </div>

              {/* RIGHT MAIN PANEL (White/Light-gray) */}
              <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden">
                {/* Header Strip inside the panel */}
                <div className="bg-[#eeeeee] border-b border-gray-300 h-[50px] px-6 flex items-center justify-between select-none shrink-0">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {/* Logo Icon */}
                      <img 
                        src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=e4b93ee8-1a1e-4ab0-b183-130d7b54ead8.png&isTemp=true&tenantCode=misa" 
                        alt="CUKCUK Logo" 
                        className="w-6 h-6 object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col justify-center">
                        <span className="font-semibold text-[13px] text-gray-800 leading-none">
                          {isServiceRunning ? "Đang hoạt động" : "Tạm ngừng hoạt động"}
                        </span>
                        {/* 3 connection blocks underneath the active state as seen in mockup */}
                        <div className="flex gap-[3px] mt-[4px]">
                          <span className={`w-[8px] h-[3px] rounded-sm transition-colors duration-300 ${isServiceRunning ? "bg-emerald-500" : "bg-gray-400"}`} />
                          <span className={`w-[8px] h-[3px] rounded-sm transition-colors duration-300 ${isServiceRunning ? "bg-emerald-500" : "bg-gray-400"}`} />
                          <span className={`w-[8px] h-[3px] rounded-sm transition-colors duration-300 ${isServiceRunning ? "bg-emerald-500" : "bg-gray-400"}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile & Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center gap-3 hover:bg-gray-200 px-3 py-1.5 rounded transition-colors cursor-pointer"
                    >
                      {/* Avatar */}
                      <div className="w-[28px] h-[28px] bg-[#0070bc] rounded-full flex items-center justify-center text-white">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-gray-800 text-[13.5px] font-medium">Mai Ngọc Sơn</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    </button>

                    {showProfileDropdown && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowProfileDropdown(false)} />
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 shadow-lg rounded py-1 z-35 select-none">
                          <div className="px-3 py-2 border-b border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Người dùng</p>
                            <p className="text-xs font-bold text-gray-800">Mai Ngọc Sơn</p>
                            <p className="text-[10px] text-gray-500 font-mono">Server Admin</p>
                          </div>
                          <button 
                            onClick={() => {
                              setShowProfileDropdown(false);
                              setIsLoggedIn(false);
                              setUsername("");
                              setPassword("");
                              setToast({ message: "Đã đăng xuất thành công!", type: "info" });
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5 font-medium cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Đăng xuất máy chủ</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Tab Contents Pane (White container filling rest of workspace) */}
                <div id="main-tab-content" className="flex-1 p-8 bg-white flex flex-col justify-between overflow-y-auto">
                  <div className="flex-1">
                    {activeTab === "general" && (
                      <div className="space-y-6 max-w-2xl select-text">
                        {/* Nhà hàng */}
                        <div className="grid grid-cols-[160px_1fr] items-baseline gap-4">
                          <span className="text-gray-700 text-[13.5px] font-medium">Nhà hàng</span>
                          <span className="text-[#0d84c6] hover:underline font-bold text-[13.5px] cursor-pointer">
                            {restaurantUrl}
                          </span>
                        </div>

                        {/* Tên máy */}
                        <div className="grid grid-cols-[160px_1fr] items-baseline gap-4">
                          <span className="text-gray-700 text-[13.5px] font-medium">Tên máy</span>
                          <span className="text-gray-900 font-bold text-[13.5px]">
                            {machineName}
                          </span>
                        </div>

                        {/* Group IP & Port for step 3 highlight */}
                        <div 
                          id="tour-ip-port-container" 
                          className="space-y-6 transition-all duration-300"
                        >
                          {/* Địa chỉ IP */}
                          <div 
                            id="tour-ip-address" 
                            className="grid grid-cols-[160px_1fr] items-baseline gap-4 transition-all duration-300"
                          >
                            <span className="text-gray-700 text-[13.5px] font-medium">Địa chỉ IP</span>
                            <span className="text-gray-900 font-bold font-mono text-[14px]">
                              {ipAddress}
                            </span>
                          </div>

                          {/* Cổng */}
                          <div 
                            id="tour-port" 
                            className="grid grid-cols-[160px_1fr] items-center gap-4 transition-all duration-300"
                          >
                            <span className="text-gray-700 text-[13.5px] font-medium">Cổng</span>
                            <input 
                              type="text"
                              value={portValue}
                              onChange={(e) => setPortValue(e.target.value)}
                              className="w-[200px] border border-gray-300 rounded px-2.5 py-1.5 text-[13px] text-gray-800 focus:outline-none focus:border-[#0070bc] focus:ring-1 focus:ring-[#0070bc] font-mono transition-all"
                            />
                          </div>
                        </div>

                        {/* Thời gian đẩy dữ liệu */}
                        <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                          <div className="flex items-center gap-1.5 text-gray-700 text-[13.5px] font-medium">
                            <span>Thời gian đẩy dữ liệu lên máy chủ MISA (phút)</span>
                            <button 
                              onClick={() => alert("Thời gian định kỳ hệ thống tự động đẩy dữ liệu giao dịch cục bộ lên máy chủ Cloud của MISA để đảm bảo an toàn và cập nhật báo cáo.")}
                              className="text-blue-500 hover:text-blue-700 focus:outline-none cursor-pointer flex shrink-0"
                            >
                              <HelpCircle className="w-4 h-4 fill-[#0d84c6] text-white" />
                            </button>
                          </div>
                          
                          <select 
                            value={pushInterval}
                            onChange={(e) => setPushInterval(e.target.value)}
                            className="w-[120px] bg-white border border-gray-300 rounded px-2.5 py-1.5 text-[13px] text-gray-800 focus:outline-none focus:border-[#0070bc]"
                          >
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="30">30</option>
                          </select>
                        </div>

                        {/* Chế độ làm việc */}
                        <div className="grid grid-cols-[160px_1fr] gap-4">
                          <span className="text-gray-700 text-[13.5px] font-medium pt-1.5">Chế độ làm việc</span>
                          <div className="space-y-4">
                            <select 
                              value={workingMode}
                              onChange={(e) => setWorkingMode(e.target.value)}
                              className="w-[150px] bg-white border border-gray-300 rounded px-2.5 py-1.5 text-[13px] text-gray-800 focus:outline-none focus:border-[#0070bc]"
                            >
                              <option value="Offline">Offline</option>
                              <option value="Online">Online</option>
                            </select>

                            <p className="text-[13px] text-gray-600 leading-relaxed max-w-lg select-text">
                              Khi chọn chế độ này các thiết bị sẽ chỉ có thể làm việc ở chế độ "Kết nối Offline". Nhà hàng cần kết nối các thiết bị qua máy chủ nội bộ để thực hiện bán hàng.{" "}
                              <button 
                                onClick={() => setActiveModal("offlineData")}
                                className="text-[#0d84c6] hover:underline font-medium cursor-pointer"
                              >
                                Xem hướng dẫn &gt;&gt;
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "sync" && (
                      <div className="space-y-6 max-w-2xl select-text">
                        <div className="border-b border-gray-200 pb-3">
                          <h3 className="text-base font-bold text-gray-800">Đồng bộ bằng tay lên MISA Cloud</h3>
                          <p className="text-xs text-gray-500">Cho phép đồng bộ tức thời mọi hóa đơn, doanh thu bán hàng hiện tại lên đám mây MISA.</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded p-4 text-[13px] text-gray-700 space-y-2.5">
                          <div className="font-bold flex items-center gap-1.5 text-blue-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Thông tin kết nối đám mây</span>
                          </div>
                          <p>Máy chủ nội bộ hiện đang kết nối trực tuyến với tài khoản quản lý nhà hàng trên MISA Cloud. Toàn bộ thông tin hóa đơn sẽ được bảo mật tuyệt đối.</p>
                          <div className="flex items-center gap-5 pt-1.5 text-xs font-mono text-gray-500">
                            <span>Lần đồng bộ thành công gần nhất: vừa xong</span>
                            <span>Trạng thái mạng: Hoạt động</span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <button 
                            onClick={triggerSync}
                            disabled={isSyncing}
                            className="bg-[#0070bc] hover:bg-[#005a96] disabled:bg-gray-400 text-white font-bold px-5 py-2.5 rounded text-xs transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                            <span>{isSyncing ? "ĐANG ĐỒNG BỘ..." : "BẮT ĐẦU ĐỒNG BỘ NGAY"}</span>
                          </button>
                          
                          {isSyncing && (
                            <div className="space-y-1.5 max-w-md">
                              <div className="flex justify-between text-xs font-bold text-gray-600">
                                <span>Tiến trình đồng bộ</span>
                                <span>{syncProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-[#0070bc] h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${syncProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "reset" && (
                      <div className="space-y-6 max-w-2xl select-text">
                        <div className="border-b border-gray-200 pb-3">
                          <h3 className="text-base font-bold text-red-600">Thiết lập lại dữ liệu máy chủ</h3>
                          <p className="text-xs text-gray-500">Khôi phục máy chủ nội bộ về trạng thái ban đầu để liên kết dữ liệu offline hoàn toàn mới.</p>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded p-4 text-[13px] text-gray-700 space-y-2">
                          <span className="font-bold text-red-800 block">⚠️ CẢNH BÁO QUAN TRỌNG:</span>
                          <p>Hành động này sẽ xóa toàn bộ nhật ký giao dịch và thông tin thiết bị con hiện tại trên máy chủ này. Hãy chắc chắn rằng bạn đã thực hiện đồng bộ tất cả hóa đơn lên MISA Cloud trước khi tiếp tục.</p>
                        </div>

                        <div className="space-y-4 pt-2">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-700 uppercase">
                              Nhập chữ <strong className="text-red-600 font-mono">RESET</strong> để xác nhận:
                            </label>
                            <input 
                              type="text"
                              value={resetConfirmText}
                              onChange={(e) => setResetConfirmText(e.target.value)}
                              placeholder="Nhập RESET"
                              className="w-[200px] border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 uppercase focus:outline-none focus:border-red-500 font-bold"
                            />
                          </div>

                          <button 
                            disabled={resetConfirmText !== "RESET" || resetInProgress}
                            onClick={() => {
                              setResetInProgress(true);
                              setToast({ message: "Đang tiến hành thiết lập lại...", type: "info" });
                              setTimeout(() => {
                                setResetInProgress(false);
                                setResetConfirmText("");
                                setPortValue("42016");
                                setPushInterval("5");
                                setWorkingMode("Offline");
                                setToast({ message: "Thiết lập lại dữ liệu máy chủ thành công!", type: "success" });
                              }, 2000);
                            }}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold px-5 py-2.5 rounded text-xs transition-colors cursor-pointer"
                          >
                            {resetInProgress ? "ĐANG THIẾT LẬP LẠI..." : "BẮT ĐẦU THIẾT LẬP LẠI"}
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "help" && (
                      <div className="space-y-6 max-w-3xl select-text">
                        <div className="border-b border-gray-200 pb-3">
                          <h3 className="text-base font-bold text-gray-800">Trợ giúp & Hướng dẫn kỹ thuật</h3>
                          <p className="text-xs text-gray-500">Mô hình hoạt động và các chỉ dẫn liên kết mạng nội bộ nhà hàng.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px] text-gray-700 font-medium">
                          <div className="space-y-3">
                            <h4 className="font-bold text-gray-800 border-l-2 border-blue-600 pl-2">Sơ đồ mạng nội bộ</h4>
                            <div className="bg-gray-900 text-emerald-400 p-4 rounded font-mono text-[11px] leading-relaxed select-none overflow-x-auto">
                              <div>┌───────────────────────────┐</div>
                              <div>│     CUKCUK CLOUD SERVERS  │</div>
                              <div>└─────────────┬─────────────┘</div>
                              <div className="text-center text-gray-400 text-[10px]">▲ (Đồng bộ Cloud khi có mạng)</div>
                              <div className="text-center text-gray-400">▼</div>
                              <div>┌───────────────────────────┐</div>
                              <div>│   CUKCUK SERVER (LOCAL)   │ &lt;-- Bạn đang ở đây</div>
                              <div>└──────┬─────────────┬──────┘</div>
                              <div>       │             │</div>
                              <div>       ▼             ▼</div>
                              <div>┌─────────────┐ ┌─────────────┐</div>
                              <div>│ MÁY THU NGÂN│ │ MÁY ORDER   │ (Kết nối qua Wifi)</div>
                              <div>└─────────────┘ └─────────────┘</div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-bold text-gray-800 border-l-2 border-blue-600 pl-2">Hướng dẫn kết nối máy con</h4>
                            <div className="space-y-2.5 text-gray-600 leading-relaxed text-justify">
                              <p>1. Thiết bị order (tablet, điện thoại) phải kết nối chung một mạng Wifi với máy tính chạy CUKCUK Server này.</p>
                              <p>2. Trên app CUKCUK bán hàng của máy con, chọn kết nối máy chủ và nhập địa chỉ IP <strong className="text-blue-600 font-mono">{ipAddress}</strong> và cổng <strong className="text-[#0d84c6] font-mono">{portValue}</strong>.</p>
                              <p>3. Trong trường hợp không kết nối được, hãy kiểm tra tường lửa Windows Defender Firewall trên máy tính này và cho phép cổng kết nối TCP inbound.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar at the bottom of the right panel */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6 shrink-0">
                    {/* Left side Action Button */}
                    <button 
                      onClick={() => {
                        setIsServiceRunning(!isServiceRunning);
                        setToast({ 
                          message: isServiceRunning ? "Đã tạm ngừng dịch vụ máy chủ nội bộ." : "Đã kích hoạt hoạt động dịch vụ máy chủ nội bộ.", 
                          type: "info" 
                        });
                      }}
                      className="border border-gray-300 hover:bg-gray-50 px-4 py-2 text-[13px] font-semibold text-gray-700 flex items-center gap-2 transition-colors cursor-pointer rounded bg-white shadow-sm"
                    >
                      {isServiceRunning ? (
                        <>
                          <div className="w-[18px] h-[18px] bg-[#0070bc] rounded-full flex items-center justify-center text-white">
                            <Pause className="w-3 h-3 fill-white text-white" />
                          </div>
                          <span>Tạm ngừng dịch vụ</span>
                        </>
                      ) : (
                        <>
                          <div className="w-[18px] h-[18px] bg-green-600 rounded-full flex items-center justify-center text-white">
                            <Play className="w-3 h-3 fill-white text-white ml-[1px]" />
                          </div>
                          <span>Kích hoạt dịch vụ</span>
                        </>
                      )}
                    </button>

                    {/* Right side Action Buttons */}
                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={() => {
                          if (tourCompleted) {
                            setToast({ message: "Đã cất cấu hình! Đang chuyển hướng sang màn hình đăng nhập POS PC...", type: "success" });
                            setTimeout(() => {
                              setIsLoggedIn(false);
                              setShowPosPcLogin(true);
                            }, 1000);
                          } else {
                            setToast({ message: "Cất cấu hình máy chủ thành công!", type: "success" });
                          }
                        }}
                        className="bg-[#0070bc] hover:bg-[#005a96] text-white px-8 py-2 text-[13px] font-bold tracking-wider rounded transition-colors shadow-sm cursor-pointer"
                      >
                        CẤT
                      </button>

                      <button 
                        onClick={() => {
                          if (confirm("Bạn có muốn hủy bỏ các thay đổi và đăng xuất?")) {
                            setUsername("");
                            setPassword("");
                            setIsLoggedIn(false);
                          }
                        }}
                        className="bg-white hover:bg-red-50 border border-gray-300 text-red-600 px-6 py-2 text-[13px] font-bold tracking-wider rounded transition-colors shadow-sm cursor-pointer"
                      >
                        HỦY BỎ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. MODALS (ANIME PRESENCE) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200"
            >
              {/* Modal header with active brand blue color */}
              <div className="bg-[#006cb2] text-white px-5 py-4 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 shrink-0" />
                  <h3 className="font-bold text-sm tracking-wide">
                    {activeModal === "register" && (lang === "vi" ? "Đăng ký sử dụng CUKCUK" : "Register CUKCUK Server")}
                    {activeModal === "forgot" && (lang === "vi" ? "Quên mật khẩu máy chủ" : "Forgot Server Password")}
                    {activeModal === "offlineData" && (lang === "vi" ? "Hướng dẫn Tạo dữ liệu offline" : "Offline Data Creation guide")}
                    {activeModal === "guide" && (lang === "vi" ? "Hướng dẫn sử dụng CUKCUK Server" : "CUKCUK Server User Manual")}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal main text copy/content */}
              <div className="p-6 text-xs leading-relaxed text-gray-700 space-y-4 max-h-[70vh] overflow-y-auto">
                
                {activeModal === "register" && (
                  <form onSubmit={(e) => { e.preventDefault(); alert(lang === "vi" ? "Gửi thông tin thành công! Nhân viên MISA sẽ liên hệ lại quý khách." : "Request submitted! MISA sales staff will contact you shortly."); setActiveModal(null); }} className="space-y-3 text-left">
                    <p className="text-gray-600 mb-2">
                      {lang === "vi" 
                        ? "Để thiết lập máy chủ offline CUKCUK Server tại nhà hàng, quý khách vui lòng để lại thông tin liên hệ." 
                        : "To setup a CUKCUK offline server, please submit your store contact details below."}
                    </p>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">{lang === "vi" ? "Họ và tên" : "Full Name"} *</label>
                      <input type="text" required className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#006cb2]" placeholder={lang === "vi" ? "Nguyễn Văn A" : "John Doe"} />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">{lang === "vi" ? "Số điện thoại liên hệ" : "Phone number"} *</label>
                      <input type="tel" required className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#006cb2]" placeholder="09xxxxxx" />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Email *</label>
                      <input type="email" required className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#006cb2]" placeholder="yourname@gmail.com" />
                    </div>
                    <div className="pt-2">
                      <button type="submit" className="w-full bg-[#006cb2] text-white py-2 rounded font-bold hover:bg-[#005a94] transition-all cursor-pointer">
                        {lang === "vi" ? "GỬI YÊU CẦU ĐĂNG KÝ" : "SUBMIT REGISTRATION"}
                      </button>
                    </div>
                  </form>
                )}

                {activeModal === "forgot" && (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-justify">
                      {lang === "vi"
                        ? "Mật khẩu máy chủ nội bộ CUKCUK Server được thiết lập trong lần khởi tạo dữ liệu ban đầu. Nếu quên mật khẩu, quý khách có thể thực hiện khôi phục theo các cách sau:"
                        : "The CUKCUK Server local password is set during initial db database creation. If forgotten, you can reset using these methods:"}
                    </p>
                    <div className="border border-gray-100 bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="font-bold text-gray-800 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{lang === "vi" ? "Cách 1: Khôi phục qua Tài khoản MISA" : "Method 1: Recovery via MISA ID"}</span>
                      </div>
                      <p className="text-gray-600">
                        {lang === "vi"
                          ? "Sử dụng số điện thoại hoặc email đã dùng để đăng ký giấy phép bản quyền phần mềm để khôi phục mật khẩu trực tuyến."
                          : "Use the email address or phone registered with the software subscription to reset your credentials online."}
                      </p>
                    </div>

                    <div className="border border-gray-100 bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="font-bold text-gray-800 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{lang === "vi" ? "Cách 2: Gọi tổng đài hỗ trợ" : "Method 2: Support hotline support"}</span>
                      </div>
                      <p className="text-gray-600">
                        {lang === "vi"
                          ? "Liên hệ trực tiếp tổng đài 024 7108 6866 hoặc gửi email hỗ trợ đến support@misa.com.vn kèm thông tin mã số thuế của nhà hàng."
                          : "Contact directly to support hotline 024 7108 6866 or send an email to support@misa.com.vn with restaurant tax info."}
                      </p>
                    </div>
                    
                    <button onClick={() => setActiveModal(null)} className="w-full bg-gray-100 text-gray-700 py-2 rounded font-semibold hover:bg-gray-200 transition-colors cursor-pointer">
                      {lang === "vi" ? "Đã hiểu" : "Got it"}
                    </button>
                  </div>
                )}

                {activeModal === "offlineData" && (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      {lang === "vi"
                        ? "Dữ liệu offline giúp nhà hàng có thể thu ngân, in hóa đơn và bán hàng bình thường ngay cả khi mất mạng Internet hoàn toàn."
                        : "Offline data mode allows restaurants to cash out, print kitchen orders and bill without any Internet connection."}
                    </p>
                    
                    <div className="space-y-2 text-left">
                      <span className="font-bold text-gray-800 block">{lang === "vi" ? "Các bước tạo dữ liệu offline mới:" : "Steps to initiate new offline data:"}</span>
                      <ol className="list-decimal list-inside space-y-1.5 text-gray-600">
                        <li>{lang === "vi" ? "Mở công cụ CUKCUK Server Tool trên khay hệ thống Windows." : "Open CUKCUK Server Tool on Windows system tray."}</li>
                        <li>{lang === "vi" ? "Chọn 'Tạo mới dữ liệu offline' và đăng nhập bằng Tài khoản MISA quản trị viên." : "Select 'Create offline database' and sign in with admin credentials."}</li>
                        <li>{lang === "vi" ? "Chọn nhà hàng và chi nhánh cần kết xuất đồng bộ." : "Select the restaurant branch and node to export/sync."}</li>
                        <li>{lang === "vi" ? "Thiết lập mật khẩu quản trị cục bộ và nhấn 'Bắt đầu kết xuất'." : "Setup a local password and tap 'Start Export'."}</li>
                      </ol>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[#005595] text-[11px] font-medium">
                      ⚠️ {lang === "vi" ? "Lưu ý: Thiết bị Server phải được cài đặt hệ điều hành Windows 10 trở lên, tối thiểu 4GB RAM." : "Note: Server node device must run Windows 10+ with minimum 4GB RAM configuration."}
                    </div>

                    <button onClick={() => setActiveModal(null)} className="w-full bg-[#006cb2] text-white py-2 rounded font-bold hover:bg-[#005a94] transition-colors cursor-pointer">
                      {lang === "vi" ? "ĐÓNG HƯỚNG DẪN" : "CLOSE GUIDE"}
                    </button>
                  </div>
                )}

                {activeModal === "guide" && (
                  <div className="space-y-4 text-left">
                    <p className="text-gray-600">
                      {lang === "vi"
                        ? "Mô hình kết nối CUKCUK Server trong mạng nội bộ tại nhà hàng:"
                        : "CUKCUK Server networking architecture inside the restaurant:"}
                    </p>

                    <div className="bg-gray-900 text-gray-300 p-3 rounded-lg font-mono text-[10px] space-y-1.5 select-none border border-gray-800">
                      <div>┌───────────────────────────┐</div>
                      <div>│     CUKCUK CLOUD SERVERS  │</div>
                      <div>└─────────────┬─────────────┘</div>
                      <div className="text-center">▲ (Sync cloud when internet is up)</div>
                      <div className="text-center">▼</div>
                      <div>┌───────────────────────────┐</div>
                      <div>│   CUKCUK SERVER (LOCAL)   │ &lt;--- (You are here)</div>
                      <div>└──────┬─────────────┬──────┘</div>
                      <div>       │             │</div>
                      <div>       ▼             ▼</div>
                      <div>┌─────────────┐ ┌─────────────┐</div>
                      <div>│ MÁY THU NGÂN│ │ MÁY ORDER   │ (Connected via Local Router)</div>
                      <div>└─────────────┘ └─────────────┘</div>
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <span className="font-bold text-gray-800 block">🔑 {lang === "vi" ? "Các lưu ý quan trọng:" : "Key Guidelines:"}</span>
                      <ul className="list-disc list-inside space-y-1">
                        <li>{lang === "vi" ? "Đảm bảo tất cả thiết bị tablet, điện thoại order kết nối chung một bộ phát Wifi với máy chủ." : "Ensure order tablets/phones connect to the exact same local Wi-Fi router."}</li>
                        <li>{lang === "vi" ? "Địa chỉ IP tĩnh của máy chủ nên được khóa trên Router mạng." : "Set a static IP lease on the Router for the main server node."}</li>
                        <li>{lang === "vi" ? "Bật tường lửa cho phép cổng 3000 kết nối TCP inbound." : "Open Firewall inbound rule on local port 3000 (TCP)."}</li>
                      </ul>
                    </div>

                    <button onClick={() => setActiveModal(null)} className="w-full bg-[#006cb2] text-white py-2 rounded font-bold hover:bg-[#005a94] transition-colors cursor-pointer">
                      {lang === "vi" ? "ĐỒNG Ý" : "AGREE"}
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. GRAY FOOTER BAR (Aligns perfectly at bottom) */}
      {!isLoggedIn && (
        <footer className="h-[40px] bg-[#d9d9d9] border-t border-gray-300 flex items-center justify-between px-4 text-[11px] text-gray-700 select-none shrink-0 font-medium">
          <div>
            <span>{t.footerLeft}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{t.footerRight}</span>
            <a 
              href="https://www.misa.com.vn" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#005595] hover:underline flex items-center gap-0.5"
            >
              <span>www.misa.com.vn</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </footer>
      )}

      {/* Tour Guide Overlay */}
      {isLoggedIn && tourStep !== null && highlightRect && (
        <div className="fixed inset-0 z-40 select-none pointer-events-none">
          {/* 4 Transparent Backdrop panels that block click interactions outside the spotlight zone */}
          <div 
            className="fixed bg-transparent z-40 pointer-events-auto"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: Math.max(0, highlightRect.top - 8),
            }}
          />
          <div 
            className="fixed bg-transparent z-40 pointer-events-auto"
            style={{
              top: highlightRect.top + highlightRect.height + 8,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <div 
            className="fixed bg-transparent z-40 pointer-events-auto"
            style={{
              top: Math.max(0, highlightRect.top - 8),
              left: 0,
              width: Math.max(0, highlightRect.left - 8),
              height: highlightRect.height + 16,
            }}
          />
          <div 
            className="fixed bg-transparent z-40 pointer-events-auto"
            style={{
              top: Math.max(0, highlightRect.top - 8),
              left: highlightRect.left + highlightRect.width + 8,
              right: 0,
              height: highlightRect.height + 16,
            }}
          />

          {/* Single Backdrop panel with perfect rounded corners and massive box shadow to render the darkened overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed pointer-events-none z-40"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
              borderRadius: "8px",
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)",
            }}
          />

          {/* Highlight zone outline */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed border-2 border-[#0070bc] rounded-lg pointer-events-none z-50"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
            }}
          />

          {/* Tooltip Balloon */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl p-5 z-50 flex flex-col gap-3 select-text w-[450px] pointer-events-auto"
            style={{
              top: highlightRect.top + highlightRect.height + 16,
              left: Math.max(16, Math.min(window.innerWidth - 466, highlightRect.left)),
            }}
          >
            {/* Little arrow at the top of the balloon pointing up */}
            <div 
              className="absolute -top-1.5 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"
              style={{
                left: Math.min(410, Math.max(20, highlightRect.left + (highlightRect.width / 2) - Math.max(16, Math.min(window.innerWidth - 466, highlightRect.left)) - 6)),
              }}
            />

            {/* Header / Step Indicator */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-[11px] font-bold text-[#0070bc] uppercase tracking-wider">
                Hướng dẫn kết nối • Bước {tourStep} / 3
              </span>
              <button 
                onClick={() => {
                  setTourStep(null);
                  setTourCompleted(true);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title="Đóng hướng dẫn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="text-[13.5px] text-gray-700 leading-relaxed font-medium">
              {tourStep === 1 && (
                <p>Đây là địa chỉ IP nội bộ của máy chủ này. Bạn sẽ sử dụng địa chỉ này để đăng nhập vào phần mềm POS PC của CukCUK</p>
              )}
              {tourStep === 2 && (
                <p>Cổng kết nối dịch vụ mạng của bạn là: <strong className="text-gray-900 font-mono text-[14.5px]">{portValue}</strong>. Bạn có thể thay đổi thông tin này tại đây.</p>
              )}
              {tourStep === 3 && (
                <div className="space-y-3">
                  <p>
                    Bạn sẽ cần sử dụng thông tin về địa chỉ IP máy chủ và Cổng kết nối mạng để đăng nhập vào phần mềm POS PC của CukCUK, theo cú pháp <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-600 font-mono font-bold text-[13px]">[địa chỉ ip:cổng]</code>.
                  </p>
                  <p>Bạn có thể lưu lại thông tin dưới đây để đăng nhập vào máy chủ của bạn:</p>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2.5 font-mono text-sm text-gray-800">
                    <span className="flex-1 font-bold text-gray-900">192.168.16.194 : {portValue}</span>
                    {isCopied ? (
                      <div className="bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded flex items-center gap-1.5 select-none shrink-0">
                        <Check className="w-3.5 h-3.5 text-gray-500" />
                        <span>Đã sao chép</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("192.168.16.194:" + portValue);
                          setToast({ message: "Đã sao chép thông tin đăng nhập vào bộ nhớ tạm!", type: "success" });
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className="bg-[#0070bc] hover:bg-[#005a96] text-white text-xs font-semibold px-2.5 py-1 rounded transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 mt-1">
              {tourStep > 1 && (
                <button 
                  onClick={() => setTourStep((prev) => prev !== null ? prev - 1 : null)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Quay lại</span>
                </button>
              )}
              
              {tourStep < 3 ? (
                <button 
                  onClick={() => setTourStep((prev) => prev !== null ? prev + 1 : null)}
                  className="bg-[#0070bc] hover:bg-[#005a96] text-white px-4 py-1.5 text-xs font-bold rounded-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Tiếp tục</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setTourStep(null);
                    setTourCompleted(true);
                    setToast({ message: "Chúc mừng bạn đã hoàn thành hướng dẫn kết nối máy chủ!", type: "success" });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold rounded-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Đã hiểu</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
