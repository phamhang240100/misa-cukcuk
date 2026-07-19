/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Download, 
  Bell, 
  HelpCircle, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  BarChart3,
  FileDown,
  FileUp,
  ShoppingCart,
  Package,
  Wallet,
  CreditCard,
  PiggyBank,
  Percent,
  UtensilsCrossed,
  Grid,
  TrendingUp,
  FileX,
  FileText,
  LayoutGrid,
  Settings,
  LogOut,
  User,
  Key,
  Shield,
  Languages,
  CheckCircle2,
  Info,
  X,
  Briefcase,
  Check,
  ArrowRight,
  PlusCircle,
  Maximize2,
  Minimize2,
  ChefHat,
  Smartphone,
  Receipt,
  Monitor,
  ChevronUp,
  BookOpen,
  Video,
  Compass,
  PieChart,
  Utensils,
  History,
  ShoppingBag,
  Home,
  Store,
  QrCode,
  Globe,
  AppWindow,
  Bike,
  Gift,
  Users,
  List,
  Plus,
  Share2
} from 'lucide-react';

import { SidebarMenuItem } from './types';
import { SIDEBAR_ITEMS } from './data';
import { ApplicationsView } from './components/views/ApplicationsView';
import { DashboardView } from './components/views/DashboardView';
import { InvoicesView } from './components/views/InvoicesView';
import { ThucDonView } from './components/views/ThucDonView';
import { SettingsView } from './components/views/SettingsView';
import { LoginFlow } from './components/LoginFlow';
import { WorkspaceView } from './components/views/WorkspaceView';
import confetti from 'canvas-confetti';

const OrderStaffIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 12H15M9 16H15" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

function renderFormattedText(text: string, onActionClick?: (action: string) => void, completedSteps?: Record<number, boolean>) {
  if (!text) return null;

  // Sửa lỗi câu trả lời của AVA quá nhiều khoảng cách xuống dòng, không quá 2 Enter (tối đa 2 newlines)
  let sanitizedText = text.replace(/(\r?\n\s*){3,}/g, '\n\n');
  sanitizedText = sanitizedText.replace(/\n+\s*(?=❓)/g, '\n');

  // Thêm emoji "bóng đèn" ở đầu các cấu trúc "Dựa theo mô hình nhà hàng..." nếu chưa có
  sanitizedText = sanitizedText.replace(/(💡\s*)?(\*?\*?Dựa theo mô hình nhà hàng)/g, (match, bulb, rest) => {
    if (bulb) return match;
    return `💡 ${rest}`;
  });

  // Hủy hiển thị dở dang của ngoặc vuông [ khi đang gõ bằng cách xóa phần dở dang ở cuối
  sanitizedText = sanitizedText.replace(/\[[^\]]*$/, '');

  // Tự động đóng các thẻ định dạng dở dang để tránh nhấp nháy chữ thô khi đang gõ chữ
  let boldOpen = false;
  let italicOpen = false;
  let i = 0;
  while (i < sanitizedText.length) {
    if (sanitizedText.startsWith('**', i)) {
      boldOpen = !boldOpen;
      i += 2;
    } else if (sanitizedText[i] === '*') {
      italicOpen = !italicOpen;
      i += 1;
    } else {
      i += 1;
    }
  }
  if (boldOpen) sanitizedText += '**';
  if (italicOpen) sanitizedText += '*';

  // Extract all inline buttons from the message text
  const buttons: Array<{ text: string; action: string }> = [];
  const matches = sanitizedText.matchAll(/\[(.*?)\]/g);
  for (const match of matches) {
    const content = match[1];
    const [btnText, btnAction] = content.split('|');
    buttons.push({ text: btnText, action: btnAction || btnText });
  }

  // Determine if this is a completion message
  let finalButtons = [...buttons];
  const hasCompletionAction = buttons.some(btn => {
    const action = btn.action;
    return (
      action.startsWith('go_to_step') ||
      action.startsWith('complete_step') ||
      action === 'go_to_dashboard' ||
      action === 'go_to_workspace'
    );
  });

  const textLower = sanitizedText.toLowerCase();
  const isCompletionMessage = hasCompletionAction || 
    textLower.includes('phê duyệt hoàn thành') || 
    textLower.includes('hoàn thành bước') || 
    textLower.includes('hoàn thiện bước') || 
    textLower.includes('hoàn thành toàn bộ 7 bước') || 
    textLower.includes('hoàn thành xuất sắc') ||
    textLower.includes('hoàn thành 7 bước');

  if (isCompletionMessage && !textLower.includes('bản tin') && !textLower.includes('báo cáo') && !textLower.includes('bổ trợ') && !textLower.includes('ứng dụng bổ trợ')) {
    // Detect the step number N
    let stepNumber: number | null = null;
    if (textLower.includes('bước 1') || textLower.includes('thuế suất') || textLower.includes('cấu hình thuế suất')) {
      stepNumber = 1;
    } else if (textLower.includes('bước 2') || textLower.includes('thực đơn') || textLower.includes('complete_step2') || textLower.includes('complete_step2_ava') || textLower.includes('complete_step2_excel') || textLower.includes('complete_step2_manual')) {
      stepNumber = 2;
    } else if (textLower.includes('bước 3') || textLower.includes('bếp/bar') || textLower.includes('khu chế biến')) {
      stepNumber = 3;
    } else if (textLower.includes('bước 4') || textLower.includes('sơ đồ bàn') || textLower.includes('phòng bàn')) {
      stepNumber = 4;
    } else if (textLower.includes('bước 5') || textLower.includes('thanh toán') || textLower.includes('vietqr')) {
      stepNumber = 5;
    } else if (textLower.includes('bước 6') || textLower.includes('hóa đơn') || textLower.includes('meinvoice')) {
      stepNumber = 6;
    } else if (textLower.includes('bước 7') || textLower.includes('nhân viên') || textLower.includes('phân quyền') || textLower.includes('7 bước')) {
      stepNumber = 7;
    }

    const congratsText = stepNumber 
      ? `Chúc mừng bạn đã hoàn tất Bước ${stepNumber}! 🎆`
      : `Chúc mừng bạn đã hoàn tất quy trình thiết lập! 🎆`;

    return (
      <div className="flex items-center gap-2 select-none font-bold text-[13px] sm:text-[14px]">
        <span className="text-[15px] sm:text-[16px]">🎉</span>
        <span>{congratsText}</span>
      </div>
    );
  }

  // Clean the main body text by removing inline buttons
  const cleanedText = sanitizedText.replace(/\[(.*?)\]/g, '');
  const lines = cleanedText.split('\n');

  const renderedText = lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    const parsedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIdx} className="font-extrabold text-slate-950 font-sans">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <strong key={partIdx} className="font-extrabold text-slate-950 font-sans">
            {part.slice(1, -1)}
          </strong>
        );
      }
      return part;
    });

    return (
      <React.Fragment key={lineIdx}>
        {parsedLine}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <div>{renderedText}</div>
      {finalButtons.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 pt-1 border-t border-slate-100/50" id="ava-suggested-buttons">
          {finalButtons.map((btn, idx) => {
            const isStepButton = btn.text.toLowerCase().includes('tiếp tục bước') || btn.text.toLowerCase().includes('tiếp tục sang bước') || btn.action === 'start_setup';
            return (
              <button
                key={idx}
                onClick={() => onActionClick?.(btn.action)}
                className={`inline-flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg text-[13px] transition-all active:scale-95 cursor-pointer shadow-xs select-none ${
                  isStepButton
                    ? 'bg-[#2563EB] hover:bg-blue-700 text-white border-2 border-[#2563EB]'
                    : 'bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border-2 border-[#2563EB]'
                }`}
              >
                {btn.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const triggerFireworks = () => {
  const duration = 1500;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 99999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 30 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
};

export default function App() {
  const [appLoading, setAppLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [showTrialBanner, setShowTrialBanner] = useState<boolean>(() => {
    return localStorage.getItem('show_trial_banner') !== 'false';
  });

  useEffect(() => {
    if (!appLoading) return;

    const duration = 5000; // 5 seconds
    const intervalTime = 50; // 50ms
    const totalSteps = duration / intervalTime; // 100 steps
    let currentStep = 0;
    setLoadingProgress(0);

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / totalSteps) * 100, 100);
      setLoadingProgress(progress);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setAppLoading(false);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [appLoading]);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_logged_in') === 'true';
  });
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('cukcuk_onboarded') === 'true';
  });
  const [restaurantSector, setRestaurantSector] = useState<string>(() => {
    return localStorage.getItem('cukcuk_sector') || '';
  });
  const [companyScale, setCompanyScale] = useState<string>(() => {
    return localStorage.getItem('cukcuk_scale') || '';
  });

  const [activeMenuId, setActiveMenuId] = useState<string>(() => {
    const loggedIn = localStorage.getItem('cukcuk_logged_in') === 'true';
    const onboarded = localStorage.getItem('cukcuk_onboarded') === 'true';
    return (loggedIn && onboarded) ? 'ban-lam-viec' : 'ung-dung';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean>(false);
  const [isSetupDropdownOpen, setIsSetupDropdownOpen] = useState<boolean>(false);
  const [isFloatingDropdownOpen, setIsFloatingDropdownOpen] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('Nhà hàng Phong Dê');
  const [shopeeFoodDeepLinkActive, setShopeeFoodDeepLinkActive] = useState<boolean>(false);
  const [shopeeFoodVayVonDeepLinkActive, setShopeeFoodVayVonDeepLinkActive] = useState<boolean>(false);

  const isCurrentlyShowingBanner = showTrialBanner && isLoggedIn && isOnboarded && activeMenuId === 'ban-lam-viec';

  // 💠 Onboarding step completion shared state
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_completed_steps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveCompletedSteps = (steps: Record<number, boolean> | ((prev: Record<number, boolean>) => Record<number, boolean>)) => {
    setCompletedSteps(prev => {
      const updated = typeof steps === 'function' ? steps(prev) : steps;
      localStorage.setItem('cukcuk_completed_steps', JSON.stringify(updated));
      return updated;
    });
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / 7) * 100);

  // Complete transition phases for checklist panel:
  // 'normal' | 'success' | 'hiding' | 'hidden'
  const [checklistPhase, setChecklistPhase] = useState<'normal' | 'success' | 'hiding' | 'hidden'>(() => {
    try {
      const saved = localStorage.getItem('cukcuk_completed_steps');
      if (saved) {
        const parsed = JSON.parse(saved);
        const count = Object.values(parsed).filter(Boolean).length;
        if (count === 7) {
          return 'hidden';
        }
      }
    } catch {}
    return 'normal';
  });

  useEffect(() => {
    if (completedCount === 7) {
      if (checklistPhase === 'normal') {
        setChecklistPhase('success');
      } else if (checklistPhase === 'success') {
        const timer = setTimeout(() => {
          setChecklistPhase('hiding');
        }, 3000); // Show success green state with tick animation for 3 seconds, then hide
        return () => clearTimeout(timer);
      } else if (checklistPhase === 'hiding') {
        const timer = setTimeout(() => {
          setChecklistPhase('hidden');
        }, 800); // Wait for the 800ms exit animation, then mark as fully hidden
        return () => clearTimeout(timer);
      }
    } else {
      if (checklistPhase !== 'normal') {
        setChecklistPhase('normal');
      }
    }
  }, [completedCount, checklistPhase]);

  // 💠 AI Sheet chatbot state
  const [isAiSheetOpen, setIsAiSheetOpen] = useState<boolean>(false);
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const [isSetupPopupOpen, setIsSetupPopupOpen] = useState<boolean>(false);
  const [isCongratulationsPopupOpen, setIsCongratulationsPopupOpen] = useState<boolean>(false);
  const [expandedCongratsAppId, setExpandedCongratsAppId] = useState<string | null>(null);

  const getStepSuggestedQuestions = (stepId: number | null): string[] => {
    switch (stepId) {
      case 1:
        return [
          'Nên chọn Khấu trừ hay Trực tiếp doanh thu cho Nhà hàng Phong Dê?',
          'Đồ ăn áp dụng 8%, bia rượu áp dụng 10% đúng không?',
          'Có được đổi phương pháp thuế sau khi lưu không?'
        ];
      case 2:
        return [
          'AVA gợi ý thực đơn tháp bia và món nhậu đắt khách',
          'AVA quét ảnh menu mất bao lâu và cần lưu ý gì?',
          'Có nhập khẩu món ăn từ Excel mẫu được không?'
        ];
      case 3:
        return [
          'Làm thế nào để tự động in order bia xuống quầy bar và món nhắm xuống bếp?',
          'Thiết lập màn hình KDS cho quầy bia có khó không?',
          'Có thể kết nối nhiều máy in cùng lúc không?'
        ];
      case 4:
        return [
          'Thiết lập sơ đồ bàn cho Nhà hàng Nhà hàng Phong Dê 3 tầng rộng lớn?',
          'Làm thế nào để thêm bớt bàn hoặc gộp bàn khi khách nhậu đông?',
          'Có thể đổi tên số bàn theo ý muốn không?'
        ];
      case 5:
        return [
          'VietQR động giúp quầy bar Nhà hàng Phong Dê tính tiền nhanh thế nào?',
          'Có mất phí khi khách quét chuyển khoản VietQR?',
          'Hệ thống hỗ trợ những ví điện tử nào?'
        ];
      case 6:
        return [
          'Xuất hóa đơn điện tử cho khách công ty đi nhậu thế nào?',
          'Chữ ký số từ xa MISA eSign có an toàn không?',
          'Thủ tục đăng ký meInvoice cần những giấy tờ gì?'
        ];
      case 7:
        return [
          'Phân quyền Thu ngân khác gì nhân viên Phục vụ?',
          'Quản lý doanh số và đối soát bia rượu theo ca của nhân viên?',
          'Nhân viên dùng app ghi order bằng tài khoản nào?'
        ];
      default:
        return [
          'Hướng dẫn nhanh các tính năng của MISA CukCuk',
          'Gợi ý thực đơn giúp tăng doanh thu cho quán bia',
          'Hướng dẫn kê khai thuế nhà hàng năm 2026'
        ];
    }
  };

  const [isAiSheetExpanded, setIsAiSheetExpanded] = useState<boolean>(false);
  const [hasAutoOpenedWorkspace, setHasAutoOpenedWorkspace] = useState<boolean>(false);
  const [currentChatName, setCurrentChatName] = useState<string>("Tư vấn thiết lập thuế & thực đơn");
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState<boolean>(false);

  const [chatHistory, setChatHistory] = useState<Array<{ id: number; title: string; date: string; messages: Array<{ sender: 'user' | 'ai'; text: string; time: string }> }>>([
    {
      id: 1,
      title: "Tư vấn thiết lập thuế & thực đơn",
      date: "Hôm nay, 10:30",
      messages: [
        {
          sender: 'ai',
          text: 'Xin chào! Tôi là Trợ lý MISA AVA. Tôi có thể giúp bạn tạo thực đơn mẫu, tư vấn biểu thuế suất GTGT, hướng dẫn phân quyền nhân viên, hoặc phân tích báo cáo doanh số ban đầu. Hãy hỏi tôi bất cứ điều gì!',
          time: 'Vừa xong'
        }
      ]
    },
    {
      id: 2,
      title: "Hỏi về hóa đơn điện tử meInvoice",
      date: "Hôm qua, 15:45",
      messages: [
        {
          sender: 'user',
          text: 'Hóa đơn điện tử meInvoice có tự động xuất khi thanh toán không?',
          time: '15:44'
        },
        {
          sender: 'ai',
          text: 'Chào chị Hà! Đúng vậy, khi kết nối thành công meInvoice tại mục "Thiết lập", mỗi khi nhân viên thu ngân hoàn tất thanh toán hóa đơn trên phần mềm, hệ thống sẽ tự động xuất hóa đơn điện tử mã hóa gửi trực tiếp lên cơ quan Thuế một cách nhanh chóng.',
          time: '15:45'
        }
      ]
    },
    {
      id: 3,
      title: "Đồng bộ món ăn từ file Excel",
      date: "2 ngày trước",
      messages: [
        {
          sender: 'user',
          text: 'Tôi có file Excel danh sách 50 món ăn của quán Phở Phú Gia, làm sao để tải lên?',
          time: '09:12'
        },
        {
          sender: 'ai',
          text: 'Chào chị Hà! Chị có thể vào phân hệ "Thực đơn" -> nhấp vào nút "Nhập khẩu" hoặc "Tải tệp Excel". Hệ thống sẽ cung cấp tệp Excel mẫu để chị copy danh sách món ăn vào và tải ngược lên. AVA cũng có thể tự động nhận dạng món ăn và điền nhóm, giá bán cho chị nữa đấy!',
          time: '09:13'
        }
      ]
    }
  ]);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: '👋 **Chào mừng bạn đến với MISA CukCuk!** Tôi là Trợ lý ảo **MISA AVA** đồng hành cùng bạn.\n\nDựa trên thông tin khảo sát về mô hình **Nhà hàng Phong Dê** của bạn, với quy trình **nhân viên ghi order tại bàn** và bộ phận bếp nhận yêu cầu qua **màn hình Bếp/Bar**, tôi đã chuẩn bị sẵn **Hướng dẫn Thiết lập gồm 7 bước** ở bên trái để đồng bộ hóa quy trình vận hành khép kín và tinh gọn nhất.\n\n🎯 **Nhiệm vụ đầu tiên của bạn:** Hãy nhấn vào nút dưới đây để bắt đầu thiết lập phương pháp tính thuế GTGT cho nhà hàng nhé!\n\n[Bắt đầu thiết lập|start_setup]\n\nNếu có bất kỳ thắc mắc nào trong quá trình cài đặt, hãy chat ngay với tôi tại đây!',
      time: 'Vừa xong'
    }
  ]);

  const chatMessagesRef = useRef(chatMessages);
  chatMessagesRef.current = chatMessages;

  const handleSelectHistoryChat = (chatId: number) => {
    setChatHistory(prev => {
      const updated = prev.map(c => {
        if (c.title === currentChatName) {
          return { ...c, messages: chatMessages };
        }
        return c;
      });
      
      const targetChat = updated.find(c => c.id === chatId);
      if (targetChat) {
        setCurrentChatName(targetChat.title);
        setChatMessages(targetChat.messages);
      }
      return updated;
    });
    
    setIsChatHistoryOpen(false);
    triggerNotification("Đã chuyển đổi sang hội thoại cũ", "info");
  };

  const handleCreateNewChat = () => {
    setChatHistory(prev => {
      const updated = prev.map(c => {
        if (c.title === currentChatName) {
          return { ...c, messages: chatMessages };
        }
        return c;
      });
      
      const nextId = prev.length + 1;
      const newTitle = `Hội thoại mới #${nextId}`;
      const newChat = {
        id: nextId,
        title: newTitle,
        date: "Vừa xong",
        messages: [
          {
            sender: 'ai',
            text: 'Xin chào! Tôi đã khởi tạo một đoạn hội thoại mới. Tôi có thể hỗ trợ gì cho bạn hôm nay?',
            time: 'Vừa xong'
          }
        ]
      };
      
      setCurrentChatName(newTitle);
      setChatMessages(newChat.messages);
      setIsChatHistoryOpen(false);
      
      return [...updated, newChat];
    });
    
    triggerNotification("Khởi tạo hội thoại mới thành công", "success");
  };

  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const scrollSuggestions = (direction: 'left' | 'right') => {
    if (suggestionsRef.current) {
      const scrollAmount = 180;
      suggestionsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  // 💜 Typing Effect Streaming Engine
  const aiMessageQueueRef = useRef<string[]>([]);
  const isAiStreamingRef = useRef<boolean>(false);

  const addStreamingAiMessage = (fullText: string, onStart?: () => void) => {
    // Sửa lỗi câu trả lời của AVA quá nhiều khoảng cách xuống dòng, không quá 2 Enter (tối đa 2 newlines)
    let sanitizedText = fullText.replace(/(\r?\n\s*){3,}/g, '\n\n');
    sanitizedText = sanitizedText.replace(/\n+\s*(?=❓)/g, '\n');

    // Thêm emoji "bóng đèn" ở đầu các cấu trúc "Dựa theo mô hình nhà hàng..." nếu chưa có
    sanitizedText = sanitizedText.replace(/(💡\s*)?(\*?\*?Dựa theo mô hình nhà hàng)/g, (match, bulb, rest) => {
      if (bulb) return match;
      return `💡 ${rest}`;
    });

    // Tránh sinh lại bong bóng chat nếu nội dung giống y hệt tin nhắn cũ!
    const latestMessages = chatMessagesRef.current;
    if (latestMessages.length > 0) {
      const lastMsg = latestMessages[latestMessages.length - 1];
      if (lastMsg.sender === 'ai' && lastMsg.text === sanitizedText) {
        // Nội dung giống y hệt, không cần sinh lại bong bóng chat
        if (onStart) onStart();
        return;
      }
    }

    if (onStart) onStart();

    // Push to the sequence queue
    aiMessageQueueRef.current.push(sanitizedText);

    // If already streaming, let the current streaming loop process it
    if (isAiStreamingRef.current) {
      return;
    }

    const startStreamingNext = () => {
      if (aiMessageQueueRef.current.length === 0) {
        isAiStreamingRef.current = false;
        setIsAiTyping(false);
        return;
      }

      isAiStreamingRef.current = true;
      setIsAiTyping(true);
      const currentText = aiMessageQueueRef.current[0];

      const delay = 600;
      setTimeout(() => {
        setIsAiTyping(false);
        const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        
        // Add a placeholder message for this stream
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: '', time: currentTime }
        ]);

        let charIndex = 0;
        const step = 10; // Optimized larger step size for smoother browser rendering performance
        
        const interval = setInterval(() => {
          charIndex += step;
          if (charIndex >= currentText.length) {
            clearInterval(interval);
            setChatMessages(prev => {
              const updated = [...prev];
              if (updated.length > 0) {
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  text: currentText
                };
              }
              return updated;
            });

            // Finished typing current message. Remove it from queue.
            aiMessageQueueRef.current.shift();
            // Process the next message after a brief pause
            setTimeout(() => {
              startStreamingNext();
            }, 300);
          } else {
            setChatMessages(prev => {
              const updated = [...prev];
              if (updated.length > 0) {
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  text: currentText.slice(0, charIndex)
                };
              }
              return updated;
            });
          }
        }, 30);
      }, delay);
    };

    startStreamingNext();
  };

  // 💜 Tax Guidance Interactive States
  const [isTaxGuidanceActive, setIsTaxGuidanceActive] = useState<boolean>(false);
  const [isChecklistExpanded, setIsChecklistExpanded] = useState<boolean>(false);
  const [taxChecklist, setTaxChecklist] = useState<Array<{ id: number; text: string; isCompleted: boolean }>>([
    { id: 1, text: 'Chọn Phương pháp tính thuế thích hợp cho nhà hàng', isCompleted: false },
    { id: 2, text: 'Cấu hình chi tiết mức thuế GTGT hoặc thuế TNCN tương ứng', isCompleted: false },
  ]);

  // 💜 Menu Guidance Interactive States
  const [isMenuGuidanceActive, setIsMenuGuidanceActive] = useState<boolean>(false);
  const [openMenuModalType, setOpenMenuModalType] = useState<'none' | 'scan_image' | 'excel_import' | 'manual_entry'>('none');
  const [activeMenuGuideTab, setActiveMenuGuideTab] = useState<'excel' | 'ava' | 'manual'>('excel');
  const [excelMenuChecklist, setExcelMenuChecklist] = useState<Array<{ id: number; text: string; isCompleted: boolean }>>([
    { id: 1, text: 'Bước 1: Tải file dữ liệu', isCompleted: false },
    { id: 2, text: 'Bước 2: Chọn Tiếp tục', isCompleted: false },
    { id: 3, text: 'Bước 3: Chọn Thực hiện', isCompleted: false },
  ]);
  const [avaMenuChecklist, setAvaMenuChecklist] = useState<Array<{ id: number; text: string; isCompleted: boolean }>>([
    { id: 1, text: 'Bước 1: Tải ảnh thực đơn', isCompleted: false },
    { id: 2, text: 'Bước 2: Nhấn Tạo thực đơn', isCompleted: false },
    { id: 3, text: 'Bước 3: Cập nhật thông tin (nếu cần)', isCompleted: false },
  ]);
  const [manualMenuChecklist, setManualMenuChecklist] = useState<Array<{ id: number; text: string; isCompleted: boolean }>>([
    { id: 1, text: 'Bước 1: Nhập Tên món', isCompleted: false },
    { id: 2, text: 'Bước 2: Nhập Mã món', isCompleted: false },
    { id: 3, text: 'Bước 3: Chọn Đơn vị tính', isCompleted: false },
    { id: 4, text: 'Bước 4: Nhập giá bán', isCompleted: false },
    { id: 5, text: 'Bước 5: Chọn Nhóm ngành nghề / Thuê้ suất', isCompleted: false },
  ]);

  const handleToggleExcelChecklist = (id: number) => {
    setExcelMenuChecklist(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
    triggerNotification("Đã cập nhật trạng thái nhiệm vụ nhập khẩu Excel!", "info");
  };

  const handleToggleAvaChecklist = (id: number) => {
    setAvaMenuChecklist(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
    triggerNotification("Đã cập nhật trạng thái nhiệm vụ tạo thực đơn AVA!", "info");
  };

  const handleToggleManualChecklist = (id: number) => {
    setManualMenuChecklist(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
    triggerNotification("Đã cập nhật trạng thái nhiệm vụ khai báo thủ công!", "info");
  };

  // 💜 Employee Guidance Interactive States
  const [isEmployeeGuidanceActive, setIsEmployeeGuidanceActive] = useState<boolean>(false);
  const [employeeChecklist, setEmployeeChecklist] = useState<Array<{ id: number; text: string; isCompleted: boolean }>>([
    { id: 1, text: 'Chọn Quản lý nhân viên trong Thiết lập hệ thống', isCompleted: true },
    { id: 2, text: 'Phân ca, quyền hạn chế chỉ xem hóa đơn của ca', isCompleted: false },
  ]);

  // 💜 Payment Guidance Interactive States
  const [isPaymentGuidanceActive, setIsPaymentGuidanceActive] = useState<boolean>(false);
  const [paymentChecklist, setPaymentChecklist] = useState<Array<{ id: number; text: string; isCompleted: boolean }>>([
    { id: 1, text: 'Kích hoạt phương thức Tiền mặt', isCompleted: true },
    { id: 2, text: 'Cấu hình liên kết Tài khoản ngân hàng', isCompleted: false },
    { id: 3, text: 'Kích hoạt tính năng VietQR động tự động cho đơn hàng', isCompleted: false },
  ]);

  // 💜 Invoice Guidance Interactive States
  const [isInvoiceGuidanceActive, setIsInvoiceGuidanceActive] = useState<boolean>(false);
  const [invoiceChecklist, setInvoiceChecklist] = useState<Array<{ id: number; text: string; isCompleted: boolean }>>([
    { id: 1, text: 'Kết nối ứng dụng Hóa đơn điện tử meInvoice', isCompleted: false },
    { id: 2, text: 'Đăng ký sử dụng MISA eSign (Chữ ký số từ xa)', isCompleted: false },
    { id: 3, text: 'Kiểm tra liên thông phát hành hóa đơn tự động', isCompleted: false },
  ]);

  const handleStartMenuGuidance = () => {
    const text = '💬 **MISA AVA Hướng dẫn: Bước 2 - Khai báo thực đơn**\n\nChào mừng bạn đến với trang quản lý **Thực đơn**! Trợ lý AVA hỗ trợ bạn khai báo thực đơn nhanh chóng qua **3 phương pháp** dưới đây:\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** sử dụng phương thức **Tạo thực đơn từ ảnh menu** bằng AI để tự động nạp nhanh chóng danh sách món ăn, mồi nhậu và các loại bia tươi/bia chai từ menu giấy, giúp tiết kiệm thời gian và hạn chế sai sót.\n\nCác phương thức thực hiện:\n\n📊 **1. Nhập khẩu từ Excel**:\n- *Bước 1*: Tải file dữ liệu biểu mẫu chuẩn.\n- *Bước 2*: Chọn "Tiếp tục" để kiểm duyệt danh mục.\n- *Bước 3*: Chọn "Thực hiện" để đồng bộ hàng loạt.\n👉 [📊 Nhập khẩu từ Excel|excel_import]\n\n✍️ **2. Thêm mới trực tiếp**:\n- *Bước 1*: Nhập Tên món.\n- *Bước 2*: Nhập Mã món.\n- *Bước 3*: Chọn Đơn vị tính.\n- *Bước 4*: Nhập giá bán.\n- *Bước 5*: Chọn **Nhóm ngành nghề** (đối với phương pháp nộp thuế Trực tiếp trên doanh thu) hoặc Chọn **Thuế suất** (đối với phương pháp Khấu trừ áp dụng nhiều mức thuế).\n- *Bước 6*: Nhấn "Lưu".\n👉 [✍️ Thêm mới trực tiếp|manual_entry]\n\n🤖 **3. Tạo thực đơn từ ảnh menu** (Khuyên dùng):\n- *Bước 1*: Tải ảnh thực đơn thực tế của quán.\n- *Bước 2*: Nhấn "Tạo thực đơn" để quét bằng AI.\n- *Bước 3*: Cập nhật thông tin chi tiết (nếu cần).\n- *Bước 4*: Nhấn "Lưu" để hoàn thành.\n👉 [🤖 Tạo thực đơn từ ảnh menu|scan_image]\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nBạn muốn AVA hỗ trợ quét thực đơn tự động bằng AI từ một bức ảnh chụp menu sẵn có, hay bạn muốn tải file Excel mẫu để nhập nhanh hàng loạt món?';

    addStreamingAiMessage(text, () => {
      setIsMenuGuidanceActive(true);
      setIsTaxGuidanceActive(false);
      setIsEmployeeGuidanceActive(false);
      setIsPaymentGuidanceActive(false);
      setIsInvoiceGuidanceActive(false);
      setIsAiSheetOpen(true);
      setActiveStepId(2);
      setActiveMenuId('thuc-don');
    });
    triggerNotification("Bắt đầu Hướng dẫn Khai báo thực đơn với Trợ lý AVA!", "success");
  };

  const handleStartEmployeeGuidance = () => {
    const text = '👥 **MISA AVA Hướng dẫn: Bước 7 - Khai báo nhân viên**\n\nKhai báo danh sách nhân viên giúp bạn quản lý chặt chẽ ca làm việc, két tiền, hạn chế tối đa thất thoát doanh thu.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** tạo đầy đủ các tài khoản phân quyền: vai trò **Thu ngân** quản lý két tiền mặt tại quầy, vai trò **Phục vụ** ghi order di động tại bàn và vai trò **Bếp/Bar** để theo dõi chế biến trên máy tính bảng.\n\nCác vai trò chính:\n1. **Thu ngân**: Quản lý két tiền, tạo đơn and tính tiền.\n2. **Phục vụ**: Ghi order tại bàn ăn and chuyển xuống bếp.\n3. **Bếp/Bar**: Nhận danh sách món cần chế biến.\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nBạn cần phân quyền tài khoản cho bao nhiêu nhân viên phục vụ bàn di động and thu ngân tại quầy để hệ thống hoạt động đồng bộ tốt nhất?';

    addStreamingAiMessage(text, () => {
      setIsEmployeeGuidanceActive(true);
      setIsTaxGuidanceActive(false);
      setIsMenuGuidanceActive(false);
      setIsPaymentGuidanceActive(false);
      setIsInvoiceGuidanceActive(false);
      setIsAiSheetOpen(true);
      setActiveStepId(7);
      setActiveMenuId('settings');
      setSettingsActiveTab('detail');
      setSelectedSettingsGroup('employees');
    });
    triggerNotification("Bắt đầu Hướng dẫn Thiết lập Nhân viên!", "success");
  };

  const handleStartPaymentGuidance = () => {
    const text = '⚡ **MISA AVA Hướng dẫn: Bước 5 - Thiết lập hình thức thanh toán**\n\nĐa dạng hóa phương thức thanh toán giúp khách hàng thanh toán tiện lợi and thu ngân đối soát doanh số nhanh chóng, chính xác.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** kích hoạt ngay phương thức **Chuyển khoản VietQR động** để khách hàng quét mã chuyển khoản nhanh ngay tại bàn nhậu, tự động điền số tiền and nội dung hóa đơn, tránh thất thoát and nhầm lẫn tiền bạc.\n\nCác phương thức chính:\n1. **Tiền mặt**: Kích hoạt sẵn sàng cho thu ngân.\n2. **Mã VietQR động**: Tự động sinh mã QR chứa số tiền chính xác cho từng hóa đơn khi xuất bán, giúp khách quét nhanh không sợ nhập nhầm số tiền.\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nBạn mong muốn kết nối tài khoản ngân hàng chính của mình để tạo mã VietQR động trực tiếp hiển thị trên máy in hóa đơn/máy POS không?';

    addStreamingAiMessage(text, () => {
      setIsPaymentGuidanceActive(true);
      setIsTaxGuidanceActive(false);
      setIsMenuGuidanceActive(false);
      setIsEmployeeGuidanceActive(false);
      setIsInvoiceGuidanceActive(false);
      setIsAiSheetOpen(true);
      setActiveStepId(5);
      setActiveMenuId('settings');
      setSettingsActiveTab('detail');
      setSelectedSettingsGroup('general');
    });
    triggerNotification("Bắt đầu Hướng dẫn Thiết lập Phương thức thanh toán!", "success");
  };

  const handleStartInvoiceGuidance = () => {
    const text = '🧾 **MISA AVA Hướng dẫn: Bước 6 - Kết nối hóa đơn điện tử**\n\nViệc liên kết hóa đơn điện tử giúp xuất hóa đơn trực tiếp từ máy tính tiền ngay khi khách hoàn tất thanh toán.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** tích hợp giải pháp **MISA meInvoice** cùng chữ ký số từ xa **MISA eSign** để xuất hóa đơn nhanh chóng, chuyên nghiệp and hợp lệ cho các khách hàng cơ quan, doanh nghiệp liên hoan tiệc tùng.\n\nCác ứng dụng:\n1. **Kết nối meInvoice**: Phần mềm hóa đơn điện tử an toàn hàng đầu MISA.\n2. **MISA eSign**: Chữ ký số từ xa ký hóa đơn mọi lúc mọi nơi không cần USB Token.\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nQuán của bạn hiện tại đã sử dụng dịch vụ hóa đơn điện tử MISA meInvoice chưa hay cần trợ lý AVA đăng ký mới tài khoản and chữ ký số từ xa MISA eSign?';

    addStreamingAiMessage(text, () => {
      setIsInvoiceGuidanceActive(true);
      setIsTaxGuidanceActive(false);
      setIsMenuGuidanceActive(false);
      setIsEmployeeGuidanceActive(false);
      setIsPaymentGuidanceActive(false);
      setIsAiSheetOpen(true);
      setActiveStepId(6);
      setActiveMenuId('ung-dung');
    });
    triggerNotification("Bắt đầu Hướng dẫn Kết nối Hóa đơn điện tử & Chữ ký số!", "success");
  };

  const handleCompleteOnboarding = () => {
    setInvoiceChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
    saveCompletedSteps(prevSteps => ({ ...prevSteps, 7: true }));
    triggerNotification("Xuất sắc hoàn thành 7 bước thiết lập ban đầu! 🎉", "success");
    triggerFireworks();
    setIsCongratulationsPopupOpen(true);

    setIsInvoiceGuidanceActive(false);
    setIsTaxGuidanceActive(false);
    setIsMenuGuidanceActive(false);
    setIsEmployeeGuidanceActive(false);
    setIsPaymentGuidanceActive(false);

    const text = `🎉 **MISA AVA chúc mừng bạn đã xuất sắc hoàn thành toàn bộ 7 bước Thiết lập ban đầu cho nhà hàng Nhà hàng Phong Dê!**

💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn** (quy mô lớn 3 tầng, diện tích 3000 m2), tôi đề xuất bạn cài đặt thêm các ứng dụng bổ trợ sau đây để đồng bộ và tối ưu hóa quy trình vận hành khép kín:

1. 💻 **Thu ngân, lễ tân (CukCuk PC/POS)**:
   - Giúp ghi nhận order tại quầy nhanh chóng, quản lý dòng tiền mặt của két an toàn.
   - Hỗ trợ in hóa đơn tạm tính/chính thức và kết nối máy in hóa đơn tiện lợi.

2. 📱 **Nhân viên ghi order (App Mobile Android/iOS)**:
   - Cho phép nhân viên phục vụ ghi order trực tiếp tại bàn theo sơ đồ thực tế 3 tầng sân vườn.
   - Gửi yêu cầu gọi món xuống Bếp/Bar tức thì qua Wifi chỉ trong 1 chạm, tránh nhầm lẫn món.

3. 🍳 **Màn hình Bếp/Bar (KDS/Tablet/Smart TV)**:
   - Số hóa hoàn toàn quy trình chế biến, thay thế phiếu giấy truyền thống.
   - Hiển thị danh sách món cần làm theo thời gian thực, hỗ trợ gộp món và báo hoàn thành nhanh chóng.

4. 📈 **Quản lý, Chủ quán (App Quản lý trên điện thoại)**:
   - Theo dõi tình hình kinh doanh, doanh thu, báo cáo mọi lúc mọi nơi qua các biểu đồ trực quan.

❓ **Bạn có muốn tôi hướng dẫn chi tiết cách tải và thiết lập ứng dụng nào trước tiên không?**

[💻 Cài đặt phần mềm|go_to_software_install]`;

    setIsAiSheetOpen(true);
    addStreamingAiMessage(text);
  };

  const handleChatActionClick = (action: string) => {
    if (action === 'start_setup') {
      setActiveMenuId('ban-lam-viec');
      setTimeout(() => {
        const handled = (window as any)._cukcuk_workspace_action?.('go_to_step1_popup');
        if (!handled) {
          triggerNotification("Đang mở bảng thiết lập cho: Thiết lập phương pháp tính thuế", "info");
        } else {
          triggerNotification("Đang mở bảng thiết lập cho: Thiết lập phương pháp tính thuế", "info");
        }
      }, 150);
    } else if (action.endsWith('_popup') || (action.startsWith('go_to_step') && action.endsWith('_popup'))) {
      setActiveMenuId('ban-lam-viec');
      setTimeout(() => {
        const handled = (window as any)._cukcuk_workspace_action?.(action);
        if (!handled) {
          // Fallback if the handler is not yet registered
          triggerNotification("Đang mở hộp thoại thiết lập tương ứng...", "info");
        }
      }, 150);
    } else if (action === 'complete_step2' || action === 'complete_step2_popup') {
      saveCompletedSteps(prev => ({ ...prev, 2: true }));
      triggerNotification("Đã lưu thực đơn và tự động hoàn thành Bước 2! 🎉", "success");
      const text = '🍳 **MISA AVA Hướng dẫn: Bước 3 - Thiết lập khu vực Bếp/Bar**\n\nThiết lập khu vực chế biến giúp tự động in phiếu chế biến xuống đúng bếp/bar tương ứng ngay khi nhân viên gửi order, tránh thất thoát hay chậm trễ.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** thiết lập ít nhất hai khu vực chế biến độc lập: một **Bếp nướng/Mồi nhậu** cho các món ăn và một **Quầy Bia/Đồ uống** để phục vụ bia tươi, bia chai nhanh chóng tại chỗ.\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nMô hình Nhà hàng Phong Dê của bạn có phân tách riêng biệt khu vực chế biến bia hơi tại vòi và khu bếp nấu đồ nhậu nóng/lạnh hay gộp chung tại một quầy duy nhất?';
      addStreamingAiMessage(text);
      if (activeMenuId === 'ban-lam-viec') {
        setTimeout(() => {
          (window as any)._cukcuk_workspace_action?.('go_to_step3_popup');
        }, 150);
      }
    } else if (action === 'scan_image') {
      setActiveMenuId('thuc-don');
      setOpenMenuModalType('scan_image');
      triggerNotification("Đã mở chức năng Khai báo thông minh bằng AI (Quét hình ảnh)!", "success");
    } else if (action === 'excel_import') {
      setActiveMenuId('thuc-don');
      setOpenMenuModalType('excel_import');
      triggerNotification("Đã mở chức năng Nhập khẩu thực đơn bằng Excel!", "success");
    } else if (action === 'manual_entry') {
      setActiveMenuId('thuc-don');
      setOpenMenuModalType('manual_entry');
      triggerNotification("Đã mở chức năng Khai báo món thủ công!", "success");
    } else if (action.startsWith('go_to_step') && !action.endsWith('_popup')) {
      const popupAction = `${action}_popup`;
      setActiveMenuId('ban-lam-viec');
      setTimeout(() => {
        const handled = (window as any)._cukcuk_workspace_action?.(popupAction);
        if (!handled) {
          // Fallback to legacy behavior if workspace action handler is not available
          if (action === 'go_to_step2') {
            handleStartMenuGuidance();
          } else if (action === 'go_to_step3') {
            triggerNotification('Đang chuyển sang thiết lập Bếp/Bar...', 'success');
            setActiveMenuId('settings');
            saveCompletedSteps(prev => ({ ...prev, 3: true }));
            const text = '🎉 **Tuyệt vời!** Bạn đã bắt đầu cấu hình khu vực chế biến cho Bếp/Bar.\n\nTrợ lý AVA đã phê duyệt hoàn thành **Bước 3: Thiết lập Bếp/Bar**!';
            addStreamingAiMessage(text);
          } else if (action === 'go_to_step4') {
            triggerNotification('Đang chuyển sang thiết lập Sơ đồ bàn...', 'success');
            setActiveMenuId('settings');
            saveCompletedSteps(prev => ({ ...prev, 4: true }));
            const text = '🎉 **Tuyệt vời!** Bạn đã mở trang sơ đồ bàn ăn để cấu hình khu vực phòng bàn.\n\nTrợ lý AVA đã phê duyệt hoàn thành **Bước 4: Thiết lập sơ đồ bàn**!';
            addStreamingAiMessage(text);
          } else if (action === 'go_to_step5') {
            handleStartPaymentGuidance();
          } else if (action === 'go_to_step6') {
            handleStartInvoiceGuidance();
          } else if (action === 'go_to_step7') {
            handleStartEmployeeGuidance();
          }
        }
      }, 150);
    } else if (action === 'complete_step3') {
      saveCompletedSteps(prevSteps => ({ ...prevSteps, 3: true }));
      triggerNotification("Đã tự động hoàn thiện Bước 3! 🎉", "success");
      const text = '🎉 **Tuyệt vời!** Bạn đã cấu hình khu vực chế biến cho Bếp/Bar thành công.\n\nTrợ lý AVA đã phê duyệt hoàn thành **Bước 3: Thiết lập Bếp/Bar**!';
      addStreamingAiMessage(text);
    } else if (action === 'complete_step4') {
      saveCompletedSteps(prevSteps => ({ ...prevSteps, 4: true }));
      triggerNotification("Đã tự động hoàn thiện Bước 4! 🎉", "success");
      const text = '🎉 **Tuyệt vời!** Bạn đã cấu hình sơ đồ phòng bàn thành công.\n\nTrợ lý AVA đã phê duyệt hoàn thành **Bước 4: Thiết lập sơ đồ bàn**!';
      addStreamingAiMessage(text);
    } else if (action === 'complete_step5') {
      setPaymentChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
      saveCompletedSteps(prevSteps => ({ ...prevSteps, 5: true }));
      triggerNotification("Đã tự động hoàn thiện Bước 5! 🎉", "success");
      const text = '🎉 **Rất tốt!** Bạn đã kích hoạt thanh toán Tiền mặt và mã VietQR động thành công.\n\nTrợ lý AVA đã phê duyệt hoàn thành **Bước 5: Thiết lập hình thức thanh toán**!';
      addStreamingAiMessage(text);
    } else if (action === 'complete_step6') {
      setInvoiceChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
      saveCompletedSteps(prevSteps => ({ ...prevSteps, 6: true }));
      triggerNotification("Đã tự động hoàn thiện Bước 6! 🎉", "success");
      const text = '🎉 **Rất tốt!** Bạn đã kết nối hóa đơn điện tử meInvoice thành công.\n\nTrợ lý AVA đã phê duyệt hoàn thành **Bước 6: Kết nối hóa đơn điện tử**!';
      addStreamingAiMessage(text);
    } else if (action === 'complete_step7') {
      setEmployeeChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
      saveCompletedSteps(prevSteps => ({ ...prevSteps, 7: true }));
      triggerNotification("Đã tự động hoàn thiện toàn bộ quy trình thiết lập ban đầu! 🎉", "success");
      triggerFireworks();
      setIsCongratulationsPopupOpen(true);
      const text = '🎉 **Chúc mừng bạn xuất sắc hoàn thành toàn bộ 7 bước Thiết lập ban đầu!**\n\nTừ giờ, nhà hàng **Nhà hàng Phong Dê** đã sẵn sàng vận hành trơn tru. Để đồng bộ quy trình bán hàng khép kín tại nhà hàng, tôi xin giới thiệu các ứng dụng chuyên dụng trong phần **Cài đặt phần mềm** ngay bên dưới bàn làm việc để bạn tải và thiết lập cho các bộ phận:\n\n1. 💻 **Thu ngân, lễ tân (Windows/PC/POS)**:\n   - Giúp ghi nhận order tại quầy, quản lý két tiền mặt chặt chẽ.\n   - Hỗ trợ in hóa đơn tạm tính/chính thức và kết nối máy in hóa đơn tiện lợi.\n\n2. 📱 **Nhân viên ghi order (App Mobile Android/iOS)**:\n   - Cho phép nhân viên phục vụ ghi order trực tiếp tại bàn theo sơ đồ thực tế.\n   - Gửi yêu cầu gọi món xuống Bếp/Bar tức thì qua Wifi chỉ trong 1 chạm.\n\n3. 🍳 **Màn hình Bếp/Bar (KDS/Tablet/Smart TV)**:\n   - Số hóa hoàn toàn quy trình chế biến, thay thế phiếu giấy truyền thống.\n   - Hiển thị món cần làm theo thứ tự gọi, hỗ trợ gộp món và báo hoàn thành nhanh chóng.\n\n4. 📈 **Quản lý, Chủ quán (App Quản lý trên điện thoại)**:\n   - Theo dõi tình hình kinh doanh, doanh thu, báo cáo mọi lúc mọi nơi qua các biểu đồ trực quan.\n\n[💻 Cài đặt phần mềm|go_to_software_install]';
      addStreamingAiMessage(text);
    } else if (action === 'go_to_software_install') {
      setActiveMenuId('ban-lam-viec');
      setIsTaxGuidanceActive(false);
      setIsMenuGuidanceActive(false);
      setIsEmployeeGuidanceActive(false);
      setIsPaymentGuidanceActive(false);
      setIsInvoiceGuidanceActive(false);
      setTimeout(() => {
        const element = document.getElementById('software-install-card');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } else if (action === 'go_to_workspace') {
      setActiveMenuId('ban-lam-viec');
      setIsTaxGuidanceActive(false);
      setIsMenuGuidanceActive(false);
      setIsEmployeeGuidanceActive(false);
      setIsPaymentGuidanceActive(false);
      setIsInvoiceGuidanceActive(false);
    } else if (action === 'go_to_dashboard') {
      setActiveMenuId('tong-quan');
      setIsTaxGuidanceActive(false);
      setIsMenuGuidanceActive(false);
      setIsEmployeeGuidanceActive(false);
      setIsPaymentGuidanceActive(false);
      setIsInvoiceGuidanceActive(false);
    } else {
      handleSendMessageToAi(action);
    }
  };

  // Settings active tab and group lifted up
  const [settingsActiveTab, setSettingsActiveTab] = useState<'overview' | 'detail'>('detail');
  const [selectedSettingsGroup, setSelectedSettingsGroup] = useState<string>('tax');
  const [settingsInitialIsEditing, setSettingsInitialIsEditing] = useState<boolean>(true);

  const handleSaveTaxSettings = () => {
    // Auto complete all 3 steps of the tax settings checklist
    setTaxChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
    
    // Automatically set Step 1 ("Khai báo thuế suất") as completed
    saveCompletedSteps(prevSteps => ({ ...prevSteps, 1: true }));
    
    // Reset initial editing trigger
    setSettingsInitialIsEditing(false);
    
    // Trigger success notification
    triggerNotification("Đã lưu cấu hình thuế suất và tự động hoàn thành Bước 1! 🎉", "success");
    
    const text = '🎉 **Chúc mừng bạn!** Tôi ghi nhận bạn vừa thực hiện lưu cấu hình thông số thuế suất thành công.\n\nTrợ lý AVA đã tự động phê duyệt và đánh dấu hoàn thành toàn bộ **3 nhiệm vụ** trong quy trình Khai báo thuế suất (Bước 1).\n\n👉 Nhấn nút dưới đây để tiếp tục thiết lập ngay:\n\n[👉 Tiếp tục sang Bước 2: Khai báo thực đơn|go_to_step2]';

    addStreamingAiMessage(text, () => {
      setIsAiSheetOpen(true);
    });
  };

  const handleToggleTaxChecklist = (id: number) => {
    triggerNotification("Phải nhấn 'Sửa' ở góc trên để thay đổi các tham số thuế suất, sau đó nhấn 'Lưu' để Trợ lý AVA tự động đồng bộ hoàn thiện bước!", "info");
  };

  const handleToggleEmployeeChecklist = (id: number) => {
    setEmployeeChecklist(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
    triggerNotification("Đã cập nhật trạng thái nhiệm vụ khai báo nhân viên!", "info");
  };

  const handleTogglePaymentChecklist = (id: number) => {
    setPaymentChecklist(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
    triggerNotification("Đã cập nhật trạng thái nhiệm vụ thiết lập phương thức thanh toán!", "info");
  };

  const handleToggleInvoiceChecklist = (id: number) => {
    setInvoiceChecklist(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
    triggerNotification("Đã cập nhật trạng thái nhiệm vụ kết nối hóa đơn!", "info");
  };

  const handleStepPopupActivated = (stepNumber: number | null) => {
    if (stepNumber === null || stepNumber === 0) {
      setIsSetupPopupOpen(false);
      return;
    }

    setIsSetupPopupOpen(true);
    setIsAiSheetOpen(true);
    setActiveStepId(stepNumber);

    // If step is already completed, do not generate a new message
    if (completedSteps[stepNumber]) {
      return;
    }

    let text = '';
    
    switch (stepNumber) {
      case 1:
        text = '📊 **MISA AVA Hướng dẫn: Bước 1 - Thiết lập phương pháp tính thuế**\n\nĐể CukCuk hỗ trợ tính tiền và báo cáo thuế chính xác, bạn hãy chọn phương pháp thuế phù hợp với mô hình nhà hàng:\n\n1. **Phương pháp khấu trừ** (Khuyên dùng): Áp dụng mức thuế suất GTGT cho từng món ăn (chỉ áp dụng 1 mức thuế hoặc nhiều mức thuế).\n2. **Trực tiếp trên doanh thu**: Tính thuế theo tỷ lệ % cố định trên doanh thu hoặc Thu nhập tính thuế.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** sử dụng **Phương pháp khấu trừ** với mức thuế suất GTGT ưu đãi 8% cho dịch vụ ăn uống và 10% đối với rượu, bia, đồ uống có cồn để tối ưu hóa hóa đơn và tuân thủ đúng quy định pháp luật.\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nNhà hàng Nhà hàng Phong Dê của bạn hiện tại áp dụng mức thuế suất GTGT cố định 8% cho toàn bộ thực đơn hay có phân tách chi tiết mức thuế khác nhau cho từng loại bia rượu và món ăn?';
        break;
      case 2:
        text = '🍎 **MISA AVA Hướng dẫn: Bước 2 - Khai báo thực đơn**\n\nKhai báo món ăn giúp nhân viên ghi order nhanh chóng và chính xác.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** bạn sử dụng tính năng **Tạo thực đơn từ ảnh menu** bằng AI của AVA để tự động nhận dạng hàng chục món ăn, mồi nhắm và đồ uống từ menu giấy của quán chỉ trong vài giây.\n\n[📊 Nhập khẩu từ Excel|excel_import_popup] [✍️ Thêm mới trực tiếp|manual_popup] [📸 Tạo thực đơn từ ảnh menu|scan_image_popup]\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nBạn muốn AVA hỗ trợ quét thực đơn tự động bằng AI từ một bức ảnh chụp menu sẵn có, hay bạn muốn tải file Excel mẫu để nhập nhanh hàng loạt món?';
        break;
      case 3:
        text = '🍳 **MISA AVA Hướng dẫn: Bước 3 - Thiết lập Bếp/Bar**\n\nThiết lập khu vực chế biến giúp tự động in phiếu chế biến xuống đúng bếp/bar tương ứng ngay khi nhân viên gửi order, tránh thất thoát hay chậm trễ.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** thiết lập ít nhất hai khu vực chế biến độc lập: một **Bếp nướng/Mồi nhậu** cho các món ăn và một **Quầy Bia/Đồ uống** để phục vụ bia tươi, bia chai nhanh chóng tại chỗ.\n\n[🍳 Thêm khu vực bếp|add_kitchen_popup]\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nMô hình Nhà hàng Phong Dê của bạn có phân tách riêng biệt khu vực chế biến bia hơi tại vòi và khu bếp nấu đồ nhậu nóng/lạnh hay gộp chung tại một quầy duy nhất?';
        break;
      case 4:
        text = '📐 **MISA AVA Hướng dẫn: Bước 4 - Sơ đồ bàn**\n\nSơ đồ phòng bàn trực quan giúp phục vụ gọi món nhanh theo đúng vị trí thực tế, thu ngân kiểm soát bàn trống và thanh toán chính xác.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** tạo các khu vực bàn đặc thù bao gồm: **Khu vực Sân vườn** (phù hợp nhậu ngoài trời thoáng đãng), **Khu vực Trong nhà** và **Phòng VIP** (cho khách hàng cần không gian riêng tư).\n\n[📐 Thêm khu vực bàn|add_zone_popup]\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nMô hình Nhà hàng Phong Dê của bạn có phân chia khu sân vườn ngoài trời chiếm tỷ lệ lớn không và bạn dự kiến bố trí tổng cộng bao nhiêu bàn cho khu vực này?';
        break;
      case 5:
        text = '⚡ **MISA AVA Hướng dẫn: Bước 5 - Thiết lập hình thức thanh toán**\n\nĐa dạng hóa phương thức thanh toán giúp khách hàng thanh toán tiện lợi và thu ngân đối soát doanh số nhanh chóng, chính xác.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** kích hoạt ngay phương thức **Chuyển khoản VietQR động** để khách hàng quét mã chuyển khoản nhanh ngay tại bàn nhậu, tự động điền số tiền và nội dung hóa đơn, tránh thất thoát và nhầm lẫn tiền bạc.\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nBạn mong muốn kết nối tài khoản ngân hàng chính của mình để tạo mã VietQR động trực tiếp hiển thị trên máy in hóa đơn/máy POS không?';
        break;
      case 6:
        text = '🧾 **MISA AVA Hướng dẫn: Bước 6 - Kết nối hóa đơn điện tử**\n\nViệc liên kết hóa đơn điện tử giúp xuất hóa đơn trực tiếp từ máy tính tiền ngay khi khách hoàn tất thanh toán.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** tích hợp giải pháp **MISA meInvoice** cùng chữ ký số từ xa **MISA eSign** để xuất hóa đơn nhanh chóng, chuyên nghiệp và hợp lệ cho các khách hàng cơ quan, doanh nghiệp liên hoan tiệc tùng.\n\n[🧾 Kết nối MISA meInvoice|connect_meinvoice_popup]\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nQuán của bạn hiện tại đã sử dụng dịch vụ hóa đơn điện tử MISA meInvoice chưa hay cần trợ lý AVA đăng ký mới tài khoản và chữ ký số từ xa MISA eSign?';
        break;
      case 7:
        text = '👥 **MISA AVA Hướng dẫn: Bước 7 - Khai báo nhân viên**\n\nChúc mừng bạn đã đến bước cuối cùng trong quy trình! Khai báo danh sách nhân viên giúp bạn quản lý chặt chẽ ca làm việc, két tiền, hạn chế tối đa thất thoát doanh thu.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** tạo đầy đủ các tài khoản phân quyền: vai trò **Thu ngân** quản lý két tiền mặt tại quầy, vai trò **Phục vụ** ghi order di động tại bàn và vai trò **Bếp/Bar** để theo dõi chế biến trên máy tính bảng.\n\n[👥 Thêm mới nhân viên|add_employee_popup]\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nBạn cần phân quyền tài khoản cho bao nhiêu nhân viên phục vụ bàn di động và thu ngân tại quầy để hệ thống hoạt động đồng bộ tốt nhất?';
        break;
      default:
        return;
    }

    addStreamingAiMessage(text);
  };

  const handleChecklistStepClick = (stepId: number, stepText: string) => {
    triggerNotification(`Đang mở ${stepText}`, "info");
    setActiveStepId(stepId);
    
    if (stepId === 2) {
      // Bước 2 là màn riêng (Thực đơn) -> tự động đi tới màn đó và kích hoạt hướng dẫn
      setActiveMenuId('thuc-don');
      handleStartMenuGuidance();
    } else {
      // Các bước khác -> ra màn "Bàn làm việc" và mở popup tương ứng với số bước đó
      setActiveMenuId('ban-lam-viec');
      setTimeout(() => {
        const actionName = `go_to_step${stepId}_popup`;
        const handled = (window as any)._cukcuk_workspace_action?.(actionName);
        if (!handled) {
          triggerNotification("Đang mở hộp thoại thiết lập tương ứng...", "info");
        }
      }, 150);
    }
  };

  const handleStartTaxGuidance = () => {
    const text = '💬 **Hướng dẫn Thiết lập Phương pháp tính thuế (Bước 1):**\n\nChào mừng bạn! Để bắt đầu cấu hình hệ thống, bạn cần xác định phương pháp tính thuế của nhà hàng mình. Đây is yêu cầu bắt buộc trước khi chuyển sang Bước 2 (Khai báo thực đơn):\n\n1. **Phương pháp khấu trừ**:\n   - *Chỉ áp dụng 1 mức thuế*: Bạn được thiết lập 1 mức thuế suất áp dụng cụ thể.\n   - *Áp dụng nhiều mức thuế*: Thích hợp nếu quán của bạn bán các loại mặt hàng chịu thuế suất khác nhau.\n\n2. **Trực tiếp doanh thu**:\n   - *Theo tỷ lệ % trên doanh thu*.\n   - *Thu nhập tính thuế*.\n\n**Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn, MISA AVA đề xuất** sử dụng **Phương pháp khấu trừ** với mức thuế suất GTGT ưu đãi 8% cho dịch vụ ăn uống và 10% đối với rượu, bia, đồ uống có cồn để tối ưu hóa hóa đơn và tuân thủ đúng quy định pháp luật.\n\n❓ **MISA AVA muốn hỏi để hiểu thêm nhu cầu của bạn:**\nNhà hàng Nhà hàng Phong Dê của bạn hiện tại áp dụng mức thuế suất GTGT cố định 8% cho toàn bộ thực đơn hay có phân tách chi tiết mức thuế khác nhau cho từng loại bia rượu và món ăn?';

    addStreamingAiMessage(text, () => {
      setIsTaxGuidanceActive(true);
      setIsMenuGuidanceActive(false);
      setIsEmployeeGuidanceActive(false);
      setIsPaymentGuidanceActive(false);
      setIsInvoiceGuidanceActive(false);
      setIsAiSheetOpen(true);
      setActiveStepId(1);
      setSettingsActiveTab('detail');
      setSelectedSettingsGroup('tax');
      setSettingsInitialIsEditing(true);
      setActiveMenuId('settings');
    });
    triggerNotification("Bắt đầu Hướng dẫn Thiết lập Phương pháp tính thuế!", "success");
  };

  const handleSendMessageToAi = (text: string) => {
    if (!text.trim()) return;

    let aiResponse = '';
    const query = text.toLowerCase();

    // Match step-specific suggested questions
    if (query.includes('khấu trừ hay trực tiếp doanh thu')) {
      aiResponse = `📊 **Tư vấn từ MISA AVA:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn** có quy mô lớn (3000 m2, 3 tầng), việc sử dụng **phương pháp khấu trừ** là cực kỳ tối ưu vì bạn có nguồn hóa đơn đầu vào dồi dào từ các nhà cung cấp bia, thực phẩm lớn. Thuế suất đầu ra cho dịch vụ ăn uống thông thường là 8%, còn bia rượu là 10%.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn áp dụng nhiều mức thuế suất tự động tách biệt cho đồ ăn (8%) và bia rượu (10%) trên phần mềm hay không?`;
    } else if (query.includes('đổi phương pháp thuế')) {
      aiResponse = `📝 **MISA AVA giải thích:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** bạn hoàn toàn có thể thay đổi lại phương pháp tính thuế bất kỳ lúc nào bằng cách click vào nút **"Cấu hình lại"** tại Bước 1 trên Bàn làm việc ban đầu. Tuy nhiên, việc thay đổi phương pháp thuế sau khi bán hàng có thể ảnh hưởng đến cách tính doanh thu sau thuế trong các báo cáo cũ.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Hiện tại nhà hàng Nhà hàng Phong Dê của bạn đã quyết định áp dụng phương pháp Thuế Khấu Trừ chưa để AVA hỗ trợ phê duyệt hoàn thành Bước 1?`;
    } else if (query.includes('thuế suất 8% áp dụng') || query.includes('đồ ăn áp dụng 8%')) {
      aiResponse = `🧾 **Chính sách Thuế cho Nhà hàng Phong Dê:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** các món ăn mồi nhắm và dịch vụ ăn uống sẽ được hưởng thuế suất ưu đãi **8%** (theo Nghị định 72/2024/NĐ-CP). Riêng đối với các loại **Bia hơi, Bia tháp, Bia chai, Rượu** và đồ uống có cồn, mức thuế suất bắt buộc áp dụng vẫn giữ nguyên **10%**.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có cần hỗ trợ thiết lập nhóm thuế suất riêng biệt cho danh mục Bia và danh mục Đồ ăn chín trên menu không?`;
    } else if (query.includes('quét ảnh menu mất bao lâu') || query.includes('quét ảnh menu')) {
      aiResponse = `🤖 **Hướng dẫn Quét thực đơn AI:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** menu thường có rất nhiều món nhậu và các loại bia đa dạng. Trợ lý AI chỉ mất **3-5 giây** để bóc tách toàn bộ danh mục từ ảnh chụp của bạn.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Thực đơn Nhà hàng Phong Dê của bạn có khoảng bao nhiêu món để AVA đề xuất nhóm món ăn phù hợp?`;
    } else if (query.includes('nhập khẩu món ăn từ excel') || query.includes('từ excel')) {
      aiResponse = `📂 **Nhập khẩu từ Excel:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** nếu có sẵn file thực đơn nhiều món từ trước, hãy chọn **[📊 Nhập khẩu từ Excel]** để nạp hàng loạt món kèm giá bán chỉ trong tích tắc.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn đã có tệp Excel danh sách món ăn của quán chưa để AVA gửi tệp mẫu chuẩn của CukCuk cho bạn?`;
    } else if (query.includes('chỉnh sửa giá và đơn vị') || query.includes('sửa món')) {
      aiResponse = `✍️ **Chỉnh sửa món ăn:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** bạn có thể sửa trực tiếp giá bán bia theo tháp/cốc/chai hoặc đơn vị đĩa/mẹt của các món ăn trong phân hệ **Thực đơn** ở menu bên trái.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Nhà hàng của bạn có bán bia theo dạng Combo hay Tháp bia lớn không để AVA hướng dẫn cấu hình định lượng?`;
    } else if (query.includes('tự động in order') || query.includes('in order') || query.includes('xuống bếp')) {
      aiResponse = `🍳 **Hướng dẫn in tự động:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** với quy mô 3 tầng rộng lớn, việc tự động in order là cực kỳ quan trọng. Hệ thống sẽ tự động chuyển order đồ ăn xuống bếp nấu và order bia hơi/rượu xuống quầy bar bia ngay khi nhân viên bấm gửi.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn muốn chia làm mấy quầy bia và bếp chế biến độc lập để hệ thống tách phiếu in tự động chính xác nhất?`;
    } else if (query.includes('màn hình kds') || query.includes('kds')) {
      aiResponse = `📺 **Hệ thống KDS (Kitchen Display System):**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** với tần suất phục vụ nhanh liên tục, việc sử dụng máy tính bảng chạy app **CukCuk - Bếp/Bar** (KDS) sẽ giúp đầu bếp và nhân viên quầy bia xem món cần chế biến tức thì, không sợ ướt hay mất phiếu giấy.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có dự định trang bị máy tính bảng KDS cho khu vực bếp nướng ngoài trời không?`;
    } else if (query.includes('nhiều máy in cùng lúc') || query.includes('máy in')) {
      aiResponse = `🖨️ **Kết nối đa máy in:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** hệ thống cho phép kết nối song song nhiều máy in. Một order bia hơi có thể vừa in phiếu ở quầy bar tầng 1, vừa in phiếu đối soát ở quầy thu ngân trung tâm.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Các tầng của nhà hàng Nhà hàng Phong Dê có dùng chung một quầy bia chính không hay mỗi tầng có tủ bia riêng?`;
    } else if (query.includes('phân quyền thu ngân') || query.includes('phân quyền')) {
      aiResponse = `👥 **Phân quyền vai trò:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** lượng khách đông và dòng tiền lớn yêu cầu phân quyền chặt chẽ. Thu ngân được quyền thanh toán, đóng/mở ca; còn nhân viên chạy bàn chỉ được order, tránh thất thoát bia rượu.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn cần phân quyền cho bao nhiêu nhân viên thu ngân và quản lý ca trực cho nhà hàng?`;
    } else if (query.includes('nhân viên dùng app ghi order') || query.includes('ghi order')) {
      aiResponse = `📱 **Tài khoản ghi order:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** diện tích rộng 3000m2 đòi hỏi nhân viên phải ghi order ngay tại bàn bằng app di động để thông tin chuyển thẳng xuống quầy bia/bếp, giúp tiết kiệm thời gian di chuyển.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn AVA hướng dẫn cách cấp tài khoản nhanh cho nhân viên phục vụ ghi order không?`;
    } else if (query.includes('quản lý doanh số theo ca') || query.includes('doanh số') || query.includes('ca')) {
      aiResponse = `📊 **Quản lý doanh số theo ca:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** quán thường hoạt động từ trưa đến đêm muộn với nhiều ca kíp. Tính năng bàn giao ca sẽ tự động chốt số lượng két tiền mặt, doanh thu chuyển khoản theo từng thu ngân.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Nhà hàng của bạn dự kiến chia làm mấy ca làm việc trong ngày để AVA gợi ý cài đặt giờ đóng/mở ca phù hợp?`;
    } else if (query.includes('thêm bớt bàn hoặc gộp bàn') || query.includes('gộp bàn') || query.includes('ghép bàn')) {
      aiResponse = `📐 **Quản lý phòng bàn:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** khách đi theo đoàn đông thường xuyên có nhu cầu ghép bàn, chuyển bàn. Nhân viên có thể thao tác gộp/tách hóa đơn dễ dàng ngay trên sơ đồ bàn tương tác.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Sức chứa tốias đa của mỗi khu vực bàn là bao nhiêu để AVA hỗ trợ bạn tối ưu hóa khoảng cách phục vụ?`;
    } else if (query.includes('sơ đồ bàn cho nhà hàng nhiều tầng') || query.includes('sơ đồ bàn') || query.includes('3 tầng')) {
      aiResponse = `🏢 **Thiết lập nhà hàng nhiều tầng:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn** có 3 tầng (3000 m2), việc phân chia rõ ràng các khu vực (ví dụ: Tầng 1 - Sân vườn bia, Tầng 2 - Máy lạnh, Tầng 3 - Rooftop) giúp nhân viên phục vụ không bị nhầm lẫn bàn.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn đã cấu hình đầy đủ sơ đồ 3 tầng ở Bước 5 chưa, bạn có cần hỗ trợ điều chỉnh số lượng bàn mặc định ở mỗi tầng không?`;
    } else if (query.includes('đổi tên số bàn') || query.includes('tên bàn')) {
      aiResponse = `✍️ **Đổi tên bàn:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** bạn nên đặt tên bàn gắn liền với ký hiệu tầng để dễ phục vụ, ví dụ: Bàn T1.01 (Tầng 1), Bàn RT.05 (Rooftop), VIP.01...\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn đặt ký hiệu bàn đặc biệt cho các khu vực bàn VIP/phòng lạnh riêng không?`;
    } else if (query.includes('vietqr động hoạt động') || query.includes('vietqr') || query.includes('mã quét')) {
      aiResponse = `⚡ **VietQR động thông minh:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** giờ cao điểm khách thanh toán dồn dập, mã VietQR động tự sinh đúng số tiền hóa đơn sẽ giúp thu ngân đối soát nhanh chóng, khách không cần gõ số tiền thủ công, tránh chuyển khoản nhầm lẫn.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn muốn kết nối tài khoản ngân hàng nào để hiển thị mã quét VietQR động cho khách thanh toán?`;
    } else if (query.includes('mất phí khi khách quét') || query.includes('phí')) {
      aiResponse = `💸 **Phí giao dịch:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** việc thanh toán qua VietQR hoàn toàn **miễn phí 100%** giao dịch, giúp bạn tối ưu chi phí vận hành hơn so với quẹt thẻ tín dụng.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn AVA hướng dẫn liên kết tài khoản ngân hàng nhận tiền VietQR ngay tại Bước 6 không?`;
    } else if (query.includes('ví điện tử') || query.includes('momo') || query.includes('zalopay')) {
      aiResponse = `📱 **Hỗ trợ ví điện tử:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** thanh toán qua ví điện tử như MoMo, ZaloPay rất được khách hàng trẻ ưa chuộng, hệ thống hỗ trợ kết nối trực tiếp đối soát doanh thu tự động.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn muốn tích hợp cổng thanh toán ví điện tử nào trước cho nhà hàng Nhà hàng Phong Dê?`;
    } else if (query.includes('xuất hóa đơn điện tử trực tiếp') || query.includes('xuất hóa đơn điện tử') || query.includes('hóa đơn')) {
      aiResponse = `🧾 **Xuất hóa đơn trực tiếp:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** nhiều khách hàng doanh nghiệp đi tiếp khách, liên hoan sẽ yêu cầu xuất hóa đơn đỏ trực tiếp. Phần mềm kết nối meInvoice giúp tự xuất hóa đơn ngay khi thanh toán.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Nhà hàng của bạn đã có thông tin chữ ký số và tài khoản meInvoice chưa để AVA hướng dẫn cấu hình?`;
    } else if (query.includes('chữ ký số từ xa misa esign') || query.includes('esign') || query.includes('misa esign')) {
      aiResponse = `🔑 **Ký số từ xa MISA eSign:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** quản lý không cần trực tiếp ở quán vẫn có thể ký số hóa đơn điện tử từ xa qua điện thoại thông minh cực kỳ an toàn mà không cần cắm USB Token tại quầy.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có cần đăng ký dùng thử dịch vụ chữ ký số từ xa MISA eSign tích hợp cùng meInvoice không?`;
    } else if (query.includes('thủ tục đăng ký meinvoice') || query.includes('thủ tục')) {
      aiResponse = `📝 **Thủ tục đăng ký:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** thủ tục đăng ký meInvoice chỉ cần giấy phép kinh doanh và CCCD người đại diện. AVA sẽ hỗ trợ chuyển tiếp thông tin tới ban chuyên trách kích hoạt nhanh nhất.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn AVA gửi danh sách hồ sơ chi tiết cần chuẩn bị qua email của bạn không?`;
    }
    
    // Intercept COMPLETE_STEP2 actions
    else if (text === 'COMPLETE_STEP2_AVA') {
      aiResponse = `🎉 **Tuyệt vời!** Trợ lý **MISA AVA** đã quét thành công hình ảnh thực đơn và tự động bóc tách được **6 món ăn & đồ uống** cùng đơn giá chính xác.\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** danh mục món ăn hiện đã được nạp đầy đủ vào hệ thống và **Bước 2 (Khai báo thực đơn)** đã được tự động phê duyệt hoàn thành!\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn đã sẵn sàng chuyển sang Bước 3 để thiết lập quầy Bar phục vụ bia tươi và khu bếp làm mồi nhậu chưa?`;
    } else if (text === 'COMPLETE_STEP2_EXCEL') {
      aiResponse = `🎉 **Thành công rực rỡ!** Hệ thống đã xử lý tệp Excel và nhập khẩu thành công **4 món ăn & đồ uống** tiêu chuẩn của nhà hàng.\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** danh mục món ăn hiện đã được lưu và **Bước 2 (Khai báo thực đơn)** đã được phê duyệt hoàn thành!\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có cần hướng dẫn cách chỉnh sửa định lượng hoặc cập nhật giá bán bia theo tháp/ly trực tiếp trên app không?`;
    } else if (text === 'COMPLETE_STEP2_MANUAL') {
      aiResponse = `🎉 **Rất tốt!** Bạn đã tự tay thêm món ăn đầu tiên vào thực đơn thành công.\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** Trợ lý AVA ghi nhận sự nỗ lực tỉ mỉ của bạn và đã phê duyệt hoàn thành **Bước 2 (Khai báo thực đơn)**!\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn muốn tiếp tục thêm thủ công các loại tháp bia khác hay muốn quét ảnh thực đơn nhanh để tiết kiệm công sức?`;
    } else if (text === 'complete_step2' || text === 'complete_step2_popup' || text.includes('Tôi đã hoàn thành Bước 2') || text.includes('hoàn thành Bước 2') || text.includes('hoàn thành bước 2')) {
      aiResponse = `🍳 **MISA AVA Hướng dẫn: Bước 3 - Thiết lập khu vực Bếp/Bar**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** có các khu chế biến riêng biệt như bếp nấu nướng, quầy pha chế đồ uống, quầy chiết rót bia tươi? Hãy thiết lập danh sách khu vực chế biến:\n\n- Giúp tự động in phiếu chế biến xuống đúng bếp/bar tương ứng ngay khi nhân viên gửi order.\n- Nhân viên bếp/bar theo dõi danh sách món cần làm trên màn hình tablet/máy in.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn muốn thiết lập bao nhiêu quầy bia tươi và bếp chế biến mồi độc lập để hệ thống tự động tách phiếu chính xác nhất?`;
    } else if (isTaxGuidanceActive && (query.includes('hoàn thành') || query.includes('hoan thanh') || query.includes('xong'))) {
      aiResponse = `🎉 **Tuyệt vời!** Bạn đã hoàn tất tất cả các bước thiết lập cấu hình thuế suất ưu đãi GTGT cho nhà hàng.\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** Trợ lý AVA đã tự động phê duyệt và đánh dấu hoàn thành toàn bộ nhiệm vụ trong quy trình Khai báo thuế suất (Bước 1).\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Chúng ta có nên chuyển sang Bước 2 để cập nhật thực đơn mồi nhắm và tháp bia tươi của quán không?`;
    } else if (query.includes('hướng dẫn nhanh các tính năng') || query.includes('tính năng của misa cukcuk') || query.includes('tính năng của cukcuk') || query.includes('các tính năng')) {
      aiResponse = `🚀 **MISA CukCuk - Hệ sinh thái quản lý nhà hàng toàn diện:**\n\nChào mừng bạn đến với MISA CukCuk! Trợ lý ảo AVA xin hướng dẫn nhanh các tính năng cốt lõi giúp số hóa hoàn toàn quy trình vận hành nhà hàng của bạn:\n\n1. 💻 **Thu ngân & Lễ tân (Windows/PC/POS)**:\n   - Ghi nhận order tại quầy, quản lý két tiền mặt chặt chẽ.\n   - Hỗ trợ in hóa đơn tạm tính/chính thức và kết nối máy in hóa đơn tiện lợi.\n\n2. 📱 **Nhân viên ghi order (App Mobile Android/iOS)**:\n   - Cho phép nhân viên phục vụ ghi order trực tiếp tại bàn theo sơ đồ thực tế.\n   - Gửi yêu cầu gọi món xuống Bếp/Bar tức thì qua Wifi chỉ trong 1 chạm.\n\n3. 🍳 **Màn hình Bếp/Bar (KDS/Tablet/Smart TV)**:\n   - Số hóa hoàn toàn quy trình chế biến, thay thế phiếu giấy truyền thống.\n   - Hiển thị món cần làm theo thứ tự gọi, hỗ trợ gộp món và báo hoàn thành nhanh chóng.\n\n4. 🧾 **Kế toán & Khai báo thuế (meInvoice & MISA eSign)**:\n   - Kết nối trực tiếp hệ hệ thống hóa đơn điện tử meInvoice để phát hành hóa đơn đỏ tức thì khi khách yêu cầu.\n   - Tích hợp ký số từ xa MISA eSign an toàn, ký hóa đơn mọi lúc mọi nơi từ điện thoại.\n\n5. ⚡ **Thanh toán VietQR động thông minh**:\n   - Tự động sinh mã QR chứa đúng số tiền hóa đơn tại quầy thu ngân.\n   - Khách hàng quét mã thanh toán tức thì không cần nhập số tiền, thu ngân đối soát tự động tránh nhầm lẫn.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn AVA mở hướng dẫn từng bước thiết lập ban đầu (gồm 7 bước) ngay trên bàn làm việc không?`;
    } else if (query.includes('thực đơn giúp tăng doanh thu') || query.includes('tăng doanh thu cho quán bia') || query.includes('thực đơn giúp tăng') || query.includes('thực đơn và món ăn')) {
      aiResponse = `🍺 **Trợ lý AVA đề xuất thực đơn tăng doanh thu tối ưu cho Quán Bia:**\n\nDựa trên số liệu phân tích hành vi khách hàng tại các quán bia, AVA xin gợi ý danh mục thực đơn và chiến lược giá giúp kích thích chi tiêu của khách hàng lên 25%:\n\n1. 🍺 **Các loại Tháp Bia & Bia tươi đắt khách**:\n   - **Tháp Bia Tươi Tiger Gold 3L** - Giá đề xuất: 280,000đ | Tỷ suất lợi nhuận: 70%. Rất kích thích gọi nhóm đông.\n   - **Bia hơi Hà Nội (Ca 1L / 2L)** - Giá đề xuất: 45,000đ/L | Lượng tiêu thụ cực lớn, xoay vòng nhanh.\n   - **Bia tươi Heineken Draft 500ml** - Giá đề xuất: 55,000đ/ly | Dành cho phân khúc cao cấp hơn.\n\n2. 🍖 **Món nhậu Signature chế biến nhanh**:\n   - **Mẹt Gà Lên Mâm 5 Món** - Giá bán: 390,000đ | Món nhậu signature dễ ăn, chế biến nhanh, khẩu phần lớn phù hợp nhóm nhậu đông.\n   - **Chân giò heo chiên giòn kiểu Đức** - Giá bán: 269,000đ | Hoàn hảo khi kết hợp với các loại bia tươi.\n   - **Lẩu Thái Hải Sản / Riêu Cua Sườn Sụn** - Giá bán: 250,000đ - 350,000đ | Thích hợp chốt bill sau khi uống bia, giúp tăng giá trị trung bình trên mỗi hóa đơn.\n\n3. 💡 **Chiến lược tối ưu Combo tăng doanh thu**:\n   - Tạo **Combo "Đồng hành chiến hữu"** gồm: 1 Tháp Bia Tiger 3L + 1 Chân giò heo chiên giòn với mức giá ưu đãi giảm nhẹ 5%. Khách hàng thường có xu hướng chọn combo thay vì gọi lẻ món.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn AVA tự động đồng bộ nhóm thực đơn nhậu đặc sắc này vào danh sách quản lý của bạn ở Bước 2 không?`;
    } else if (query.includes('kê khai thuế nhà hàng') || query.includes('kê khai thuế') || query.includes('thuế nhà hàng năm 2026') || query.includes('thuế 2026')) {
      aiResponse = `🧾 **Hướng dẫn kê khai Thuế Nhà hàng năm 2026:**\n\nTrợ lý AVA xin cập nhật các quy định và hướng dẫn chi tiết về kê khai thuế cho cơ sở kinh doanh dịch vụ ăn uống trong năm 2026:\n\n1. ⚖️ **Mức thuế suất giá trị gia tăng (GTGT) áp dụng**:\n   - **Mức thuế ưu đãi 8%**: Áp dụng đối với các nhóm dịch vụ ăn uống, đồ ăn chín, mồi nhắm do nhà hàng chế biến phục vụ khách.\n   - **Mức thuế suất 10%**: Áp dụng bắt buộc đối với tất cả các mặt hàng đồ uống có cồn (như Bia hơi, Bia chai, Bia tháp, Rượu) và đồ uống đóng lon/chai khác.\n   *(MISA CukCuk hỗ trợ tính năng tự động tách hóa đơn và áp thuế suất riêng cho từng dòng sản phẩm cực kỳ chuẩn xác).*\n\n2. 📂 **Phương pháp kê khai thuế**:\n   - **Phương pháp khấu trừ**: Thích hợp cho nhà hàng quy mô lớn có đầy đủ chứng từ, hóa đơn đỏ mua vào (nhập bia từ nhà máy, mua thực phẩm từ siêu thị).\n   - **Phương pháp trực tiếp trên doanh thu**: Áp dụng cho hộ kinh doanh hoặc nhà hàng quy mô nhỏ, đóng thuế khoán hoặc tính tỷ lệ 3% trên doanh thu dịch vụ ăn uống.\n\n3. ⚡ **Quy trình chuẩn hóa hóa đơn điện tử năm 2026**:\n   - Toàn bộ hóa đơn bán ra phải được lập và ký số truyền lên cơ quan thuế ngay khi hoàn tất thanh toán.\n   - Sử dụng giải pháp hóa đơn điện tử khởi tạo từ máy tính tiền **MISA meInvoice** tích hợp sẵn trên CukCuk để tự động hóa quy trình này mà không tốn công nhập lại dữ liệu.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn AVA hướng dẫn thiết lập phương pháp tính thuế và cấu hình nhóm thuế suất chi tiết tại Bước 1 không?`;
    } else if (query.includes('thực đơn') || query.includes('thuc don') || query.includes('món ăn') || query.includes('gợi ý thực đơn')) {
      aiResponse = `🍺 **Thực đơn Nhà hàng Phong Dê đắt khách đề xuất:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** tôi xin gợi ý nhóm tháp bia và các món nhậu đặc sắc, có tỷ suất lợi nhuận cao và chế biến nhanh:\n\n1. 🍺 **Tháp Bia Tươi Tiger Gold 3L** - Giá bán: 280,000đ | Lợi nhuận: 70%\n2. 🍖 **Mẹt Gà Lên Mâm 5 Món** - Giá bán: 390,000đ | Món nhậu signature\n3. 🦐 **Lẩu Thái Hải Sản Nhà hàng Phong Dê** - Giá bán: 250,000đ | Thích hợp nhóm khách đông\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn AVA tự động đồng bộ nhóm thực đơn nhậu đặc sắc này vào danh sách quản lý của bạn không?`;
    } else if (query.includes('thuế') || query.includes('thue') || query.includes('%')) {
      aiResponse = `🧾 **Chính sách Thuế cho Nhà hàng Phong Dê:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** các món ăn mồi nhắm và dịch vụ ăn uống sẽ được hưởng thuế suất ưu đãi **8%**. Riêng đối với các loại **Bia hơi, Bia chai, Rượu** và đồ uống có cồn, mức thuế suất bắt buộc áp dụng vẫn giữ nguyên **10%**.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có cần hỗ trợ thiết lập nhóm thuế suất riêng biệt cho danh mục Bia và danh mục Đồ ăn chín trên menu không?`;
    } else if (query.includes('qr') || query.includes('vietqr') || query.includes('thanh toan')) {
      aiResponse = `⚡ **VietQR động thông minh:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** giờ cao điểm khách thanh toán dồn dập, mã VietQR động tự sinh đúng số tiền hóa đơn sẽ giúp thu ngân đối soát nhanh chóng, khách không cần gõ số tiền thủ công, tránh chuyển khoản nhầm lẫn.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn muốn kết nối tài khoản ngân hàng nào để hiển thị mã quét VietQR động cho khách thanh toán?`;
    } else if (query.includes('nhân viên') || query.includes('nhan vien') || query.includes('phân quyền')) {
      aiResponse = `👥 **Phân quyền vai trò:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** lượng khách đông và dòng tiền lớn yêu cầu phân quyền chặt chẽ. Thu ngân được quyền thanh toán, đóng/mở ca; còn nhân viên chạy bàn chỉ được order, tránh thất thoát bia rượu.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn cần phân quyền cho bao nhiêu nhân viên thu ngân và quản lý ca trực cho nhà hàng?`;
    } else if (query.includes('bước 7') || query.includes('buoc 7') || query.includes('hoàn thành 7 bước') || query.includes('hoan thanh 7 buoc') || query.includes('hoàn thành tất cả') || query.includes('hoan thanh tat ca') || query.includes('hoàn tất hướng dẫn') || query.includes('hoan tat huong dan')) {
      aiResponse = `🎉 **Chúc mừng bạn xuất sắc hoàn thành toàn bộ 7 bước Thiết lập ban đầu!**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn,** từ giờ hệ thống đã sẵn sàng vận hành trơn tru phục vụ lượng khách lớn. Để đồng bộ quy trình bán hàng khép kín từ quầy lễ tân đến nhân viên chạy bàn và khu chế biến bếp/bar bia, tôi xin giới thiệu các ứng dụng chuyên dụng trong phần **Cài đặt phần mềm** ngay bên dưới bàn làm việc để bạn tải và thiết lập cho các bộ phận:\n\n1. 💻 **Thu ngân, lễ tân (Windows/PC/POS)**:\n   - Giúp ghi nhận order tại quầy, quản lý két tiền mặt chặt chẽ.\n   - Hỗ trợ in hóa đơn tạm tính/chính thức và kết nối máy in hóa đơn tiện lợi.\n\n2. 📱 **Nhân viên ghi order (App Mobile Android/iOS)**:\n   - Cho phép nhân viên phục vụ ghi order trực tiếp tại bàn theo sơ đồ thực tế.\n   - Gửi yêu cầu gọi món xuống Bếp/Bar tức thì qua Wifi chỉ trong 1 chạm.\n\n3. 🍳 **Màn hình Bếp/Bar (KDS/Tablet/Smart TV)**:\n   - Số hóa hoàn toàn quy trình chế biến, thay thế phiếu giấy truyền thống.\n   - Hiển thị món cần làm theo thứ tự gọi, hỗ trợ gộp món và báo hoàn thành nhanh chóng.\n\n4. 📈 **Quản lý, Chủ quán (App Quản lý trên điện thoại)**:\n   - Theo dõi tình hình kinh doanh, doanh thu, báo cáo mọi lúc mọi nơi qua các biểu đồ trực quan.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn có muốn AVA hướng dẫn tải nhanh app ghi order cho nhân viên ngay bây giờ không?\n\n[👉 Quay lại Bàn làm việc|go_to_workspace]`;
    } else {
      aiResponse = `✨ **MISA AVA phản hồi:**\n\n💡 **Dựa theo mô hình nhà hàng Nhà hàng Phong Dê của bạn** (quy mô lớn 3 tầng, diện tích 3000 m2), tôi đề xuất bạn nên thực hiện tuần tự các bước trong danh sách "Thiết lập ban đầu" ở bàn làm việc để đảm bảo quản lý chặt chẽ doanh số và tránh thất thoát bia rượu.\n\n❓ **AVA muốn hỏi để hiểu thêm nhu cầu của bạn:** Bạn đang muốn tối ưu hóa phần nào trước tiên cho nhà hàng Nhà hàng Phong Dê: thiết lập biểu thuế suất GTGT 10% cho bia rượu hay tạo sơ đồ phân chia bàn 3 tầng sân vườn?`;
    }

    // Format & sanitize predicted response
    let sanitizedResponse = aiResponse.replace(/(\r?\n\s*){3,}/g, '\n\n');
    sanitizedResponse = sanitizedResponse.replace(/\n+\s*(?=❓)/g, '\n');
    sanitizedResponse = sanitizedResponse.replace(/(💡\s*)?(\*?\*?Dựa theo mô hình nhà hàng)/g, (match, bulb, rest) => {
      if (bulb) return match;
      return `💡 ${rest}`;
    });

    // Check if the last AI message in chat is identical to the predicted response
    const latestMessages = chatMessagesRef.current;
    const lastAiMsg = latestMessages.slice().reverse().find(m => m.sender === 'ai');
    
    if (lastAiMsg && lastAiMsg.text === sanitizedResponse) {
      // Nội dung giống y hệt, không cần sinh lại bong bóng chat! Vẫn chạy side-effects:
      if (text === 'COMPLETE_STEP2_AVA' || text === 'COMPLETE_STEP2_EXCEL' || text === 'COMPLETE_STEP2_MANUAL') {
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 2: true }));
        if (activeMenuId === 'ban-lam-viec') {
          setTimeout(() => {
            (window as any)._cukcuk_workspace_action?.('go_to_step3_popup');
          }, 150);
        }
      } else if (text === 'complete_step2' || text === 'complete_step2_popup' || text.includes('Tôi đã hoàn thành Bước 2') || text.includes('hoàn thành Bước 2') || text.includes('hoàn thành bước 2')) {
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 2: true }));
        if (activeMenuId === 'ban-lam-viec') {
          setTimeout(() => {
            (window as any)._cukcuk_workspace_action?.('go_to_step3_popup');
          }, 150);
        }
      } else if (isTaxGuidanceActive && (query.includes('hoàn thành') || query.includes('hoan thanh') || query.includes('xong'))) {
        setTaxChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 1: true }));
      } else if (query.includes('bước 4') || query.includes('buoc 4')) {
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 4: true }));
      } else if (query.includes('bước 5') || query.includes('buoc 5')) {
        setPaymentChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 5: true }));
      } else if (query.includes('bước 6') || query.includes('buoc 6')) {
        setInvoiceChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 6: true }));
      } else if (query.includes('bước 7') || query.includes('buoc 7') || query.includes('hoàn thành 7 bước') || query.includes('hoan thanh 7 buoc') || query.includes('hoàn thành tất cả') || query.includes('hoan thanh tat ca') || query.includes('hoàn tất hướng dẫn') || query.includes('hoan tat huong dan')) {
        setEmployeeChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 7: true }));
      }
      setIsAiSheetOpen(true);
      return;
    }

    const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text, time: currentTime }]);
    setIsAiTyping(true);
    setIsAiSheetOpen(true); // Always open the chatbot drawer/sidesheet!

    setTimeout(() => {
      // Match step-specific suggested questions and execute side-effects
      if (text === 'COMPLETE_STEP2_AVA' || text === 'COMPLETE_STEP2_EXCEL' || text === 'COMPLETE_STEP2_MANUAL') {
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 2: true }));
        if (activeMenuId === 'ban-lam-viec') {
          setTimeout(() => {
            (window as any)._cukcuk_workspace_action?.('go_to_step3_popup');
          }, 150);
        }
      } else if (text === 'complete_step2' || text === 'complete_step2_popup' || text.includes('Tôi đã hoàn thành Bước 2') || text.includes('hoàn thành Bước 2') || text.includes('hoàn thành bước 2')) {
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 2: true }));
        if (activeMenuId === 'ban-lam-viec') {
          setTimeout(() => {
            (window as any)._cukcuk_workspace_action?.('go_to_step3_popup');
          }, 150);
        }
      } else if (isTaxGuidanceActive && (query.includes('hoàn thành') || query.includes('hoan thanh') || query.includes('xong'))) {
        setTaxChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 1: true }));
        triggerNotification("Đã lưu cấu hình thuế suất và tự động hoàn thành Bước 1! 🎉", "success");
      } else if (query.includes('bước 4') || query.includes('buoc 4')) {
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 4: true }));
      } else if (query.includes('bước 5') || query.includes('buoc 5')) {
        setPaymentChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 5: true }));
      } else if (query.includes('bước 6') || query.includes('buoc 6')) {
        setInvoiceChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 6: true }));
      } else if (query.includes('bước 7') || query.includes('buoc 7') || query.includes('hoàn thành 7 bước') || query.includes('hoan thanh 7 buoc') || query.includes('hoàn thành tất cả') || query.includes('hoan thanh tat ca') || query.includes('hoàn tất hướng dẫn') || query.includes('hoan tat huong dan')) {
        setEmployeeChecklist(prev => prev.map(item => ({ ...item, isCompleted: true })));
        saveCompletedSteps(prevSteps => ({ ...prevSteps, 7: true }));
      }

      addStreamingAiMessage(aiResponse);
      triggerNotification('Trợ lý MISA AVA vừa phản hồi câu hỏi của bạn', 'info');
    }, 1200);
  };

  const [sheetInput, setSheetInput] = useState('');
  const sheetMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiSheetOpen) {
      setTimeout(() => {
        // Use instant 'auto' scroll during typing/streaming to avoid heavy layout thrashing,
        // and smooth scroll only for discrete non-streaming events
        const isStreaming = isAiStreamingRef.current;
        sheetMessagesEndRef.current?.scrollIntoView({ 
          behavior: isStreaming ? 'auto' : 'smooth' 
        });
      }, 100);
    }
  }, [chatMessages, isAiTyping, isAiSheetOpen]);

  // Custom toast notification system
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sidebar mapping of icons
  const renderSidebarIcon = (iconName: string, sizeClass = "w-[18px] h-[18px]") => {
    const props = { className: `${sizeClass} flex-shrink-0` };
    switch (iconName) {
      case 'Briefcase': return <Briefcase {...props} />;
      case 'LayoutDashboard': return <LayoutDashboard {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'FileDown': return <FileDown {...props} />;
      case 'FileUp': return <FileUp {...props} />;
      case 'ShoppingCart': return <ShoppingCart {...props} />;
      case 'Package': return <Package {...props} />;
      case 'Wallet': return <Wallet {...props} />;
      case 'CreditCard': return <CreditCard {...props} />;
      case 'PiggyBank': return <PiggyBank {...props} />;
      case 'Percent': return <Percent {...props} />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} />;
      case 'Grid': return <Grid {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'FileX': return <FileX {...props} />;
      case 'Settings': return <Settings {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'LayoutGrid': return <LayoutGrid {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'PieChart': return <PieChart {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'History': return <History {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'Home': return <Home {...props} />;
      case 'Store': return <Store {...props} />;
      case 'QrCode': return <QrCode {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'AppWindow': return <AppWindow {...props} />;
      case 'Bike': return <Bike {...props} />;
      case 'Gift': return <Gift {...props} />;
      case 'Users': return <Users {...props} />;
      case 'List': return <List {...props} />;
      default: return <LayoutGrid {...props} />;
    }
  };

  // Close profile and other menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setIsProfileOpen(false);
      setIsRestaurantOpen(false);
      setIsSetupDropdownOpen(false);
      setIsChatHistoryOpen(false);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Auto-open MISA AVA on the welcome screen first load - disabled on user request to keep collapsed by default
  useEffect(() => {
    if (isLoggedIn && isOnboarded && activeMenuId === 'ban-lam-viec') {
      if (!hasAutoOpenedWorkspace) {
        setIsAiSheetOpen(false);
        setHasAutoOpenedWorkspace(true);
      }
    }
  }, [isLoggedIn, isOnboarded, activeMenuId, hasAutoOpenedWorkspace]);

  if (appLoading) {
    return (
      <div 
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-between p-8 bg-cover bg-center select-none"
        style={{ 
          backgroundImage: `url('https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=3980f035-79a7-47f1-8153-7075de56534d.png&isTemp=true&tenantCode=misa')` 
        }}
      >
        {/* Top spacer to keep elements balanced */}
        <div className="h-10" />

        {/* Centered logo, progress and label */}
        <div className="flex flex-col items-center -translate-y-[20px]">
          <img 
            src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=5a9ce2b8-0164-469e-80e1-9a923f5ef51d.png&isTemp=true&tenantCode=misa" 
            alt="MISA CukCuk" 
            style={{ height: '86px' }}
            className="object-contain mb-8"
            referrerPolicy="no-referrer"
          />
          
          {/* Progress bar container */}
          <div className="w-64 sm:w-72 bg-[#1E62EC]/10 h-[12px] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-75 ease-out"
              style={{ 
                width: `${loadingProgress}%`,
                backgroundImage: 'linear-gradient(to right, #7BA4FF, #2563EB)'
              }}
            />
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-center">
          <p className="text-[11px] text-[#717680] font-medium font-sans">
            Copyright @ 2015 - 2026 MISA JSC
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isCurrentlyShowingBanner && (
        <div 
          className="fixed top-0 left-0 right-0 z-[100000] bg-[#EDF5FE] h-11 border-b border-blue-100 flex items-center justify-between px-4 text-slate-800 select-none animate-fade-in"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '14px' }}
        >
          <div className="flex-1 flex items-center gap-3 py-2 pr-4 text-left overflow-hidden">
            <span className="truncate">
              Thời gian dùng thử <span className="font-bold text-[#2563EB]">MISA CukCuk</span> chỉ còn <span className="font-bold text-[#2563EB]">14 NGÀY</span>. Quý khách vui lòng nâng cấp lên bản trả phí để không bị gián đoạn công việc.
            </span>
            <a
              href="https://ai.studio/apps/23d706bc-cec3-4f09-996f-b16e2647fce9?fullscreenApplet=true"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                triggerNotification("Hệ thống đang chuyển hướng tới trang nâng cấp dịch vụ...", "success");
              }}
              className="bg-gradient-to-r from-[#2559FF] to-[#52CBFF] hover:opacity-95 active:scale-95 text-white font-bold rounded-lg px-4 py-1.5 transition-all text-[14px] shadow-sm select-none cursor-pointer flex-shrink-0 inline-flex items-center justify-center no-underline"
            >
              Nâng cấp ngay
            </a>
          </div>
          <div className="flex items-center gap-4 h-full pl-4 flex-shrink-0">
            <button
              onClick={() => {
                setShowTrialBanner(false);
                localStorage.setItem('show_trial_banner', 'false');
                triggerNotification("Đã ẩn thông báo dùng thử", "info");
              }}
              className="text-[#717680] hover:text-[#101828] text-[14px] font-medium transition-colors cursor-pointer select-none"
            >
              Để sau
            </button>
          </div>
        </div>
      )}

      {!isLoggedIn || !isOnboarded ? (
        <div 
          className="min-h-screen bg-[#F0F2F4] text-[#101828] antialiased"
          style={{ paddingTop: isCurrentlyShowingBanner ? '44px' : '0px' }}
        >
          <LoginFlow 
            onComplete={(sector, scale) => {
              localStorage.setItem('cukcuk_logged_in', 'true');
              localStorage.setItem('cukcuk_onboarded', 'true');
              localStorage.setItem('cukcuk_sector', sector);
              localStorage.setItem('cukcuk_scale', scale);
              setIsLoggedIn(true);
              setIsOnboarded(true);
              setRestaurantSector(sector);
              setCompanyScale(scale);
              setActiveMenuId('ban-lam-viec');
              setIsAiSheetOpen(false);
              setHasAutoOpenedWorkspace(true);
            }}
            onNotification={triggerNotification}
          />
          {/* 💠 SLIDING POPUP TOAST SYSTEM FOR LOGIN FLOW */}
          {toast && (
            <div 
              className="fixed left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl animate-fade-in max-w-sm md:max-w-md w-max border border-white/10"
              style={{ zIndex: 10000, top: isCurrentlyShowingBanner ? '100px' : '56px' }}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-xs font-semibold leading-normal flex-1">
                {toast.message}
              </div>
              <button 
                onClick={() => setToast(null)} 
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-screen flex flex-col bg-[#F0F2F4] text-[#101828] antialiased">
      
      {/* 💠 HEADING HEADER (height 48px, fixed top) */}
      <header 
        className="fixed left-0 right-0 z-40 bg-[#1E62EC] h-12 flex items-center justify-between px-3 select-none text-white shadow-sm border-b border-[#2563EB]/40"
        style={{ top: isCurrentlyShowingBanner ? '44px' : '0px' }}
      >
        {/* Left Side Header: Logo and Restaurant Selector */}
        <div className="flex items-center gap-3">
          {/* 9-dot Grid dots icon */}
          <button 
            onClick={() => {
              // 1. Clear all localStorage keys starting with 'cukcuk_' to reset setup state and tour
              Object.keys(localStorage).forEach(key => {
                if (key.startsWith('cukcuk_')) {
                  localStorage.removeItem(key);
                }
              });

              // 2. Reset React states to clean initial values
              setIsLoggedIn(false);
              setIsOnboarded(false);
              setRestaurantSector('');
              setCompanyScale('');
              setCompletedSteps({});
              setActiveMenuId('ung-dung');
              setIsCongratulationsPopupOpen(false);
              setExpandedCongratsAppId(null);
              setHasAutoOpenedWorkspace(false);
              setAppLoading(false);

              // 3. Reset Chat Messages to default welcome state
              setChatMessages([
                {
                  sender: 'ai',
                  text: '👋 **Chào mừng bạn đến với MISA CukCuk!** Tôi là Trợ lý ảo **MISA AVA** đồng hành cùng bạn.\n\nDựa trên thông tin khảo sát về mô hình **Nhà hàng Phong Dê** của bạn, với quy trình **nhân viên ghi order tại bàn** và bộ phận bếp nhận yêu cầu qua **màn hình Bếp/Bar**, tôi đã chuẩn bị sẵn **Hướng dẫn Thiết lập gồm 7 bước** ở bên trái để đồng bộ hóa quy trình vận hành khép kín và tinh gọn nhất.\n\n🎯 **Nhiệm vụ đầu tiên của bạn:** Hãy nhấn vào nút dưới đây để bắt đầu thiết lập phương pháp tính thuế GTGT cho nhà hàng nhé!\n\n[Bắt đầu thiết lập|start_setup]\n\nNếu có bất kỳ thắc mắc nào trong quá trình cài đặt, hãy chat ngay với tôi tại đây!',
                  time: 'Vừa xong'
                }
              ]);

              // Also reset trial banner state
              localStorage.removeItem('show_trial_banner');
              setShowTrialBanner(true);

              // 4. Dispatch event to notify nested components if needed
              window.dispatchEvent(new Event('cukcuk_reset_steps'));
              
              triggerNotification("Đã đăng xuất, khôi phục toàn bộ dữ liệu thiết lập ban đầu và quay về màn hình tải!", "success");
            }}
            className="p-1 hover:bg-[#2563EB] rounded cursor-pointer transition-colors"
            title="Menu đăng nhập"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <circle cx="5" cy="5" r="2" />
              <circle cx="12" cy="5" r="2" />
              <circle cx="19" cy="5" r="2" />
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
              <circle cx="5" cy="19" r="2" />
              <circle cx="12" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
            </svg>
          </button>

          {/* Logo MISA CukCuk */}
          <div 
            onClick={() => {
              setActiveMenuId('ung-dung');
              triggerNotification("Quay lại màn hình Ứng dụng chính", "info");
            }}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {/* Custom high fidelity logo icon */}
            <img 
              src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=2e0e75f9-784b-48d9-b545-ce17762135dc.png&isTemp=true&tenantCode=misa" 
              alt="MISA CukCuk" 
              className="h-6 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-extrabold text-[18px] tracking-tight">MISA CukCuk</span>
          </div>

          {/* Restaurant switcher dropdown select (Styled exactly as instructions) */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-md text-[13px] font-semibold select-none cursor-pointer border border-[#1E62EC] transition-all ml-4"
              style={{ height: '32px' }}
            >
              <span className="truncate max-w-[150px]">{selectedRestaurant}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {isRestaurantOpen && (
              <div 
                className="absolute left-4 top-10 w-52 bg-white text-text-primary rounded-lg shadow-lg py-1 border border-gray-100 z-50 animate-fade-in"
              >
                {['Nhà hàng Phong Dê', 'Chi nhánh Cầu Giấy', 'Chi nhánh Hoàn Kiếm'].map((rest) => (
                  <button
                    key={rest}
                    onClick={() => {
                      setSelectedRestaurant(rest);
                      setIsRestaurantOpen(false);
                      triggerNotification(`Đã chuyển sang chi nhánh: ${rest}`, "success");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedRestaurant === rest ? 'text-[#2563EB] font-bold bg-[#F0F6FE]' : 'text-[#101828]'
                    }`}
                  >
                    {rest}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Header Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => triggerNotification("Thay đổi ngôn ngữ hiển thị hệ thống", "info")}
              className="flex items-center gap-1 px-2.5 py-1 text-[13px] font-medium hover:bg-[#2563EB] rounded cursor-pointer"
              style={{ height: '32px' }}
            >
              <span>Tiếng Việt</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>

          {/* Download apps button with Notification Badge 1 */}
          <button 
            onClick={() => triggerNotification("Tải ứng dụng MISA CukCuk cho điện thoại & tablet", "info")}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#2563EB] rounded-lg cursor-pointer relative"
            title="Tải ứng dụng"
          >
            <Download className="w-[18px] h-[18px]" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center border border-[#1E62EC]">
              1
            </span>
          </button>

          {/* Bell Icon Notification */}
          <button 
            onClick={() => triggerNotification("Chưa có thông báo hệ thống mới nào", "info")}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#2563EB] rounded-lg cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>

          {/* Icon "AI" AVA, click vào sẽ ra màn Chatbot với AI xổ sang trái (Side Sheet) */}
          <button 
            onClick={() => setIsAiSheetOpen(!isAiSheetOpen)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all relative ${
              isAiSheetOpen ? 'bg-[#1D4ED8] scale-105' : 'hover:bg-[#2563EB]'
            }`}
            title="Hỏi Trợ lý AI MISA AVA"
          >
            <div className="w-6.5 h-6.5 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-200/40">
              <img 
                src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=27a8e564-f87d-449a-b620-fef9e2113373.png&isTemp=true&tenantCode=misa" 
                alt="MISA AVA"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-blue-600 rounded-full" />
          </button>

          {/* Help Center */}
          <button 
            onClick={() => triggerNotification("Đang mở Trung tâm Trợ giúp MISA CukCuk...", "info")}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#2563EB] rounded-lg cursor-pointer"
            title="Trợ giúp"
          >
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>

          {/* Settings gear icon on Header as per instructions */}
          <button 
            onClick={() => {
              setActiveMenuId('settings');
              triggerNotification("Mở thiết lập cấu hình hệ thống", "info");
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
              activeMenuId === 'settings' ? 'bg-[#1D4ED8]' : 'hover:bg-[#2563EB]'
            }`}
            title="Thiết lập hệ thống"
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>

          {/* More options triple dot */}
          <button 
            onClick={() => triggerNotification("Hiển thị tính năng mở rộng khác...", "info")}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#2563EB] rounded-lg cursor-pointer"
          >
            <MoreVertical className="w-[18px] h-[18px]" />
          </button>

          {/* User Profile Avatar (Displays picture, click to toggle dropdown profile card) */}
          <div className="relative ml-1" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-white hover:border-[#F0F6FE] focus:outline-none transition-all cursor-pointer shadow"
            >
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120" 
                alt="User profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Profile Dropdown Card (Formulated as requested by guidelines) */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50 text-text-primary animate-scale-up"
              >
                {/* Profile header with user picture & details centered */}
                <div className="flex flex-col items-center px-4 py-3 border-b border-gray-100 select-none">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120" 
                      alt="User profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="font-bold text-sm text-[#101828]">Nguyễn Thị Thanh Hà</div>
                  <div className="text-[11px] text-[#717680] mt-0.5 font-medium">cukcuk@software.misa.com.vn</div>
                </div>

                {/* Primary navigation to Workspace */}
                <div className="px-4 py-2.5 border-b border-gray-100 bg-[#F8FAFC]">
                  <button
                    onClick={() => {
                      setActiveMenuId('ban-lam-viec');
                      setIsProfileOpen(false);
                      triggerNotification("Đang đi tới Bàn làm việc", "success");
                    }}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98] select-none"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Đi tới Bàn làm việc
                  </button>
                </div>

                {/* Profile menus list */}
                <div className="py-1">
                  <button 
                    onClick={() => triggerNotification("Chức năng đổi mật khẩu đang được bảo trì", "info")}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#101828] hover:bg-gray-50 transition-colors font-medium text-left cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-[#717680]" />
                    Đổi mật khẩu
                  </button>
                  <button 
                    onClick={() => {
                      setActiveMenuId('settings');
                      triggerNotification("Mở trang Thiết lập tài khoản", "info");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#101828] hover:bg-gray-50 transition-colors font-medium text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#717680]" />
                    Thiết lập tài khoản
                  </button>
                  <button 
                    onClick={() => {
                      setActiveMenuId('settings');
                      triggerNotification("Mở trang Thiết lập bảo mật", "info");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#101828] hover:bg-gray-50 transition-colors font-medium text-left cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-[#717680]" />
                    Thiết lập bảo mật
                  </button>
                  <button 
                    onClick={() => triggerNotification("Tính năng đổi ngôn ngữ trong cài đặt cá nhân", "info")}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#101828] hover:bg-gray-50 transition-colors font-medium text-left cursor-pointer"
                  >
                    <Languages className="w-4 h-4 text-[#717680]" />
                    Đổi ngôn ngữ
                  </button>
                </div>

                {/* Logout action */}
                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button 
                    onClick={() => {
                      localStorage.removeItem('cukcuk_logged_in');
                      localStorage.removeItem('cukcuk_onboarded');
                      localStorage.removeItem('cukcuk_sector');
                      localStorage.removeItem('cukcuk_scale');
                      setIsLoggedIn(false);
                      setIsOnboarded(false);
                      setRestaurantSector('');
                      setCompanyScale('');
                      setIsProfileOpen(false);
                      setActiveMenuId('ung-dung');
                      // Also reset trial banner state
                      localStorage.removeItem('show_trial_banner');
                      setShowTrialBanner(true);
                      triggerNotification('Đã đăng xuất tài khoản thành công', 'info');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-semibold text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main container holding Sidebar and Main Content */}
      <div 
        className="flex-1 flex min-h-0"
        style={{ paddingTop: isCurrentlyShowingBanner ? '92px' : '48px' }}
      >
        
        {/* 💠 SIDEBAR (occupies full height minus header, collapsible) */}
        <aside 
          className="flex-shrink-0 bg-white border-r border-[#E9EAEB] flex flex-col justify-between sticky bottom-0 overflow-y-auto select-none transition-all duration-300"
          style={{ 
            width: isSidebarCollapsed ? '64px' : '220px', 
            height: isCurrentlyShowingBanner ? 'calc(100vh - 92px)' : 'calc(100vh - 48px)',
            top: isCurrentlyShowingBanner ? '92px' : '48px'
          }}
        >
          {/* Sidebar Menu vertical items list */}
          <div className="py-2 space-y-0.5">
            {SIDEBAR_ITEMS
              .map((item) => {
                const isActive = activeMenuId === item.id || (item.id === 'thiet-lap-ht' && activeMenuId === 'settings');
                return (
                  <div key={item.id} className="w-full">
                    {/* Render optional separator before */}
                    {item.isSeparatorBefore && (
                      <hr className="my-1.5 border-gray-100 mx-3" />
                    )}

                    {/* Render optional header before */}
                    {item.isHeaderBefore && (
                      isSidebarCollapsed ? (
                        <hr className="my-1.5 border-gray-100 mx-3" />
                      ) : (
                        <div className="px-3 pt-3.5 pb-1 flex items-center justify-between text-[10px] font-bold tracking-wider text-gray-400 select-none">
                          <span>{item.headerTitle}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerNotification("Thêm kênh bán hàng mới", "info");
                            }}
                            className="hover:text-[#2563EB] hover:bg-slate-100 p-0.5 rounded transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )
                    )}

                    <button
                      onClick={() => {
                        if (item.id === 'huy-hoa-don') {
                          setActiveMenuId('ung-dung');
                          setShopeeFoodDeepLinkActive(true);
                          triggerNotification(`Hủy hóa đơn - Kết nối ShopeeFood (Đã kết nối), tab Thực đơn`, "info");
                        } else if (item.id === 'ket-noi-vay-von') {
                          setActiveMenuId('ung-dung');
                          setShopeeFoodVayVonDeepLinkActive(true);
                          triggerNotification(`Kết nối vay vốn - Mở đồng bộ thực đơn ShopeeFood hoàn tất`, "success");
                        } else if (item.id === 'thuc-don' && !completedSteps[1]) {
                          triggerNotification("⚠️ Lưu ý: Bạn bắt buộc phải chọn Phương pháp tính thuế tại Bước 1 trước khi thiết lập thực đơn!", "info");
                          setActiveMenuId('settings');
                          setSelectedSettingsGroup('tax');
                          setSettingsActiveTab('detail');
                        } else if (item.id === 'thiet-lap-ht') {
                          setActiveMenuId('settings');
                          setSettingsActiveTab('detail');
                          setSelectedSettingsGroup('tax');
                          triggerNotification(`Mở phân hệ: Thiết lập hệ thống`, "info");
                        } else if (item.isChannel) {
                          setActiveMenuId(item.id);
                          triggerNotification(`Mở kênh bán hàng: ${item.title}`, "info");
                        } else {
                          setActiveMenuId(item.id);
                          triggerNotification(`Mở phân hệ: ${item.title}`, "info");
                        }
                      }}
                      className={`w-full flex items-center text-left py-2 px-3 text-body-reg transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#F0F6FE] text-[#2563EB] font-semibold border-l-4 border-[#2563EB] rounded-l-none' 
                          : 'text-[#101828] hover:bg-gray-50 hover:text-blue-600 font-medium'
                      }`}
                      style={{ height: '36px' }}
                      title={item.title}
                    >
                      {/* Left icon with active color overrides or channel colored box */}
                      {item.isChannel ? (
                        <div className={`mr-2.5 flex items-center justify-center w-5 h-5 rounded-md flex-shrink-0 text-white ${item.channelColor}`}>
                          {renderSidebarIcon(item.iconName, 'w-3 h-3')}
                        </div>
                      ) : (
                        <div className={`mr-2.5 transition-colors flex-shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-[#717680]'}`}>
                          {renderSidebarIcon(item.iconName)}
                        </div>
                      )}

                      {/* Item text (hidden when collapsed) */}
                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1 text-xs">
                          {item.title}
                        </span>
                      )}

                      {/* Right Indicator arrow (hidden when collapsed) */}
                      {!isSidebarCollapsed && item.hasArrow && (
                        <ChevronDown className="w-3 h-3 text-[#717680] opacity-60" />
                      )}
                    </button>

                    {/* Submenu lists when the item has children and is active and NOT collapsed */}
                    {!isSidebarCollapsed && isActive && item.children && (
                      <div className="bg-gray-50 py-1 border-l-2 border-blue-200 ml-4 animate-fade-in">
                        {item.children.map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={() => triggerNotification(`Mở tính năng phụ: ${sub}`, "info")}
                            className="w-full text-left pl-6 pr-3 py-1.5 text-[11px] text-[#717680] hover:text-[#2563EB] hover:bg-blue-50 transition-colors font-medium truncate"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Bottom Sidebar Collapse/Expand Toggle arrow as per instructions */}
          <div className="p-2 border-t border-[#E9EAEB] flex justify-end bg-white">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-8 h-8 rounded-lg border border-[#D5D7DA] hover:border-[#2563EB] hover:bg-[#F0F6FE] flex items-center justify-center text-[#717680] hover:text-[#2563EB] transition-all cursor-pointer shadow-sm"
              title={isSidebarCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </aside>

        {/* 💠 MAIN CONTENT AREA */}
        <main 
          className="flex-1 overflow-y-auto bg-[#F0F2F4]"
          style={{ height: isCurrentlyShowingBanner ? 'calc(100vh - 92px)' : 'calc(100vh - 48px)', padding: '0px' }}
        >
          <div className="h-full">
             {activeMenuId === 'ban-lam-viec' && (
              <WorkspaceView 
                onNotification={triggerNotification} 
                setActiveMenuId={setActiveMenuId} 
                completedSteps={completedSteps}
                setCompletedSteps={saveCompletedSteps}
                onSendMessageToAi={handleSendMessageToAi}
                chatMessages={chatMessages}
                isAiTyping={isAiTyping}
                onStartTaxGuidance={handleStartTaxGuidance}
                onStartMenuGuidance={handleStartMenuGuidance}
                onStartEmployeeGuidance={handleStartEmployeeGuidance}
                onStartPaymentGuidance={handleStartPaymentGuidance}
                onStartInvoiceGuidance={handleStartInvoiceGuidance}
                onStepActivated={handleStepPopupActivated}
                onAddAiMessage={(text) => {
                  setIsAiSheetOpen(true);
                  addStreamingAiMessage(text);
                }}
                isAiSheetOpen={isAiSheetOpen}
                onOpenAiSheet={() => setIsAiSheetOpen(true)}
                onCompleteOnboarding={handleCompleteOnboarding}
                showTrialBanner={isCurrentlyShowingBanner}
              />
            )}

            {activeMenuId === 'ung-dung' && (
              <ApplicationsView 
                onNotification={triggerNotification} 
                shopeeFoodDeepLinkActive={shopeeFoodDeepLinkActive}
                onResetDeepLink={() => setShopeeFoodDeepLinkActive(false)}
                shopeeFoodVayVonDeepLinkActive={shopeeFoodVayVonDeepLinkActive}
                onResetVayVonDeepLink={() => setShopeeFoodVayVonDeepLinkActive(false)}
              />
            )}
            
            {activeMenuId === 'tong-quan' && (
              <DashboardView onNotification={triggerNotification} />
            )}

            {activeMenuId === 'hd-ban-hang' && (
              <InvoicesView onNotification={triggerNotification} />
            )}

            {activeMenuId === 'thuc-don' && (
              <ThucDonView 
                onNotification={triggerNotification} 
                completedSteps={completedSteps}
                setCompletedSteps={saveCompletedSteps}
                openMenuModalType={openMenuModalType}
                setOpenMenuModalType={setOpenMenuModalType}
                onSendMessageToAi={handleSendMessageToAi}
                setActiveMenuId={setActiveMenuId}
                isMenuGuidanceActive={isMenuGuidanceActive}
                activeMenuGuideTab={activeMenuGuideTab}
                setActiveMenuGuideTab={setActiveMenuGuideTab}
                excelMenuChecklist={excelMenuChecklist}
                setExcelMenuChecklist={setExcelMenuChecklist}
                avaMenuChecklist={avaMenuChecklist}
                setAvaMenuChecklist={setAvaMenuChecklist}
                manualMenuChecklist={manualMenuChecklist}
                setManualMenuChecklist={setManualMenuChecklist}
              />
            )}

            {activeMenuId === 'settings' && (
              <SettingsView 
                onNotification={triggerNotification} 
                activeTab={settingsActiveTab}
                setActiveTab={setSettingsActiveTab}
                selectedGroup={selectedSettingsGroup}
                setSelectedGroup={setSelectedSettingsGroup}
                taxChecklist={taxChecklist}
                onTaxTaskToggle={handleToggleTaxChecklist}
                onSaveTaxSettings={handleSaveTaxSettings}
                initialIsEditing={settingsInitialIsEditing}
              />
            )}

            {/* Other unimplemented modules - showing high quality placeholders */}
            {activeMenuId !== 'ban-lam-viec' &&
             activeMenuId !== 'ung-dung' && 
             activeMenuId !== 'tong-quan' && 
             activeMenuId !== 'hd-ban-hang' && 
             activeMenuId !== 'thuc-don' && 
             activeMenuId !== 'settings' && (
              <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-sm p-12 text-center border-2 border-white">
                <div className="w-16 h-16 rounded-full bg-[#F0F6FE] text-[#2563EB] flex items-center justify-center mb-4">
                  <LayoutGrid className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-[#101828]">Phân hệ đang được hoàn thiện</h3>
                <p className="text-xs text-[#717680] max-w-md mt-1 leading-relaxed">
                  Phân hệ này hiện đang trong quá trình đồng bộ và phát triển giao diện. Bạn vui lòng trải nghiệm phân hệ <strong>Ứng dụng</strong> (nhấp vào mục "Ứng dụng"), <strong>Tổng quan</strong>, <strong>Hóa đơn bán hàng</strong>, <strong>Thực đơn</strong> hoặc nhấp biểu tượng bánh răng trên đầu để xem <strong>Thiết lập</strong>.
                </p>
                <button
                  onClick={() => setActiveMenuId('ung-dung')}
                  className="mt-6 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 select-none cursor-pointer"
                  style={{ height: '32px', borderRadius: '8px' }}
                >
                  Trải nghiệm Ứng dụng tích hợp
                </button>
              </div>
            )}
          </div>
        </main>

        {/* 💠 INTEGRATED AI CHAT PANEL (SIDE CARD) */}
        <AnimatePresence>
          {isAiSheetOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isAiSheetExpanded ? '100%' : '400px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden shadow-lg ${
                isAiSheetExpanded ? 'fixed inset-x-0 bottom-0 z-40' : 'relative'
              }`}
              style={{ 
                height: isCurrentlyShowingBanner ? 'calc(100vh - 92px)' : 'calc(100vh - 48px)',
                top: isAiSheetExpanded ? (isCurrentlyShowingBanner ? '92px' : '48px') : undefined
              }}
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0 relative">
                <div className="flex items-center gap-2.5 min-w-0" onClick={(e) => e.stopPropagation()}>
                  <div className="w-8.5 h-8.5 rounded-full overflow-hidden flex items-center justify-center bg-indigo-50 border border-indigo-100 shadow-sm flex-shrink-0 select-none">
                    <img 
                      src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=27a8e564-f87d-449a-b620-fef9e2113373.png&isTemp=true&tenantCode=misa" 
                      alt="MISA AVA"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <h2 
                      className="text-[18px] font-extrabold text-slate-950 flex items-center gap-1.5 leading-tight"
                      style={{ fontSize: '18px' }}
                    >
                      Trợ lý MISA AVA
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    </h2>
                    
                    {/* Active Chat Name with Down Icon dropdown trigger */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsChatHistoryOpen(!isChatHistoryOpen);
                        }}
                        className="flex items-center gap-1 text-[12px] font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200/80 px-2 py-0.5 rounded mt-0.5 cursor-pointer max-w-[180px] select-none"
                        title="Xem lịch sử hội thoại"
                      >
                        <span className="truncate">{currentChatName}</span>
                        <ChevronDown className="w-3 h-3 flex-shrink-0" />
                      </button>

                      {isChatHistoryOpen && (
                        <div 
                          className="absolute left-0 mt-1 w-64 bg-white border border-slate-150 rounded-lg shadow-xl z-50 p-2 animate-fade-in text-slate-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-[9px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-slate-100 mb-1">Lịch sử hội thoại</div>
                          <div className="max-h-48 overflow-y-auto space-y-0.5">
                            {chatHistory.map((chat) => (
                              <button
                                key={chat.id}
                                onClick={() => handleSelectHistoryChat(chat.id)}
                                className={`w-full text-left px-2 py-1.5 rounded transition-colors flex flex-col gap-0.5 cursor-pointer ${
                                  currentChatName === chat.title 
                                    ? 'bg-blue-50 text-blue-700 font-bold' 
                                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                <span className="text-[10px] truncate w-full">{chat.title}</span>
                                <span className="text-[8px] text-slate-400 font-medium">{chat.date}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons (Tạo mới, Mở rộng, Đóng) */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Icon tạo mới (Tạo mới đoạn chat khác) */}
                  <button
                    onClick={handleCreateNewChat}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="Tạo hội thoại mới"
                  >
                    <PlusCircle className="w-4.5 h-4.5" />
                  </button>

                  {/* Icon mở rộng (Mở rộng toàn màn hình) */}
                  <button
                    onClick={() => {
                      setIsAiSheetExpanded(!isAiSheetExpanded);
                      triggerNotification(isAiSheetExpanded ? "Đã thu nhỏ khung chat" : "Đã mở rộng khung chat toàn màn hình!", "info");
                    }}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    title={isAiSheetExpanded ? "Thu nhỏ khung chat" : "Mở rộng toàn màn hình"}
                  >
                    {isAiSheetExpanded ? (
                      <Minimize2 className="w-4.5 h-4.5" />
                    ) : (
                      <Maximize2 className="w-4.5 h-4.5" />
                    )}
                  </button>

                  {/* Close button X */}
                  <button
                    onClick={() => {
                      setIsAiSheetOpen(false);
                      setIsAiSheetExpanded(false);
                    }}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title="Đóng bảng chat"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* 💜 HƯỚNG DẪN THIẾT LẬP CHECKLIST PANEL */}
              <AnimatePresence>
                {checklistPhase !== 'hiding' && checklistPhase !== 'hidden' && (
                  <motion.div
                    key="setup-checklist-panel"
                    initial={{ opacity: 1, height: 'auto', scale: 1 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ 
                      opacity: 0, 
                      height: 0, 
                      marginTop: 0, 
                      marginBottom: 0, 
                      paddingTop: 0, 
                      paddingBottom: 0, 
                      borderWidth: 0,
                      overflow: 'hidden' 
                    }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className={`mx-4 mt-3 mb-3 border ${
                      checklistPhase === 'success' 
                        ? 'border-emerald-200 bg-white shadow-[0_2px_12px_rgba(16,185,129,0.12)]' 
                        : 'border-[#DCD3F9] bg-white shadow-[0_2px_8px_rgba(109,40,217,0.04)]'
                    } rounded-2xl overflow-hidden flex-shrink-0`}
                  >
                    {/* Header */}
                    <div 
                      onClick={() => {
                        if (checklistPhase !== 'success') {
                          setIsChecklistExpanded(!isChecklistExpanded);
                        }
                      }}
                      className={`${
                        checklistPhase === 'success' 
                          ? 'bg-emerald-50 hover:bg-emerald-100' 
                          : 'bg-[#EBE5FC] hover:bg-[#E2DAFB]'
                      } px-4 py-2.5 flex items-center justify-between cursor-pointer select-none transition-colors`}
                    >
                      <div className="flex items-center gap-2">
                        {checklistPhase === 'success' ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[4]" />
                          </motion.div>
                        ) : null}
                        <span className={`text-[13px] font-bold ${checklistPhase === 'success' ? 'text-emerald-800' : 'text-[#3B2D60]'}`}>
                          {checklistPhase === 'success' ? 'Đã hoàn thành thiết lập!' : 'Hướng dẫn thiết lập'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] font-bold whitespace-nowrap ${checklistPhase === 'success' ? 'text-emerald-800' : 'text-[#3B2D60]'}`}>
                            {completionPercentage}% ({completedCount}/7)
                          </span>
                          <div className={`w-16 h-1.5 ${checklistPhase === 'success' ? 'bg-emerald-100' : 'bg-[#DCD3F9]'} rounded-full overflow-hidden`}>
                            <div 
                              className={`${checklistPhase === 'success' ? 'bg-emerald-500' : 'bg-indigo-600'} h-full rounded-full transition-all duration-500`} 
                              style={{ width: `${completionPercentage}%` }} 
                            />
                          </div>
                        </div>
                        {checklistPhase !== 'success' && (
                          <ChevronDown className={`w-3.5 h-3.5 text-[#3B2D60] transition-transform ${isChecklistExpanded ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <AnimatePresence>
                      {isChecklistExpanded && checklistPhase !== 'success' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="p-3 bg-white space-y-2 max-h-72 overflow-y-auto"
                        >
                          {[
                            { id: 1, text: 'Thiết lập phương pháp tính thuế' },
                            { id: 2, text: 'Khai báo thực đơn' },
                            { id: 3, text: 'Thiết lập Bếp/Bar' },
                            { id: 4, text: 'Sơ đồ bàn' },
                            { id: 5, text: 'Thiết lập hình thức thanh toán' },
                            { id: 6, text: 'Kết nối hóa đơn điện tử' },
                            { id: 7, text: 'Khai báo nhân viên' },
                          ].map((step) => {
                            const isStepCompleted = completedSteps[step.id];
                            return (
                              <div 
                                key={step.id}
                                className="flex items-center justify-between gap-3 p-1.5 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer"
                                onClick={() => {
                                  setIsChecklistExpanded(false);
                                  handleChecklistStepClick(step.id, step.text);
                                }}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div 
                                    className="flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      saveCompletedSteps(prev => ({ ...prev, [step.id]: !prev[step.id] }));
                                      triggerNotification(`Đã cập nhật trạng thái ${step.text}`, "success");
                                    }}
                                  >
                                    {isStepCompleted ? (
                                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                        <Check className="w-2.5 h-2.5 stroke-[4]" />
                                      </div>
                                    ) : (
                                      <div className="w-4.5 h-4.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-[9px] font-extrabold group-hover:border-blue-400 group-hover:text-blue-600 transition-colors">
                                        {step.id}
                                      </div>
                                    )}
                                  </div>

                                  <span className={`text-[13px] font-semibold transition-all select-none ${
                                    isStepCompleted 
                                      ? 'line-through text-slate-400 font-normal' 
                                      : 'text-slate-700 group-hover:text-slate-900'
                                  }`}>
                                    {step.text}
                                  </span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F7FA]">
                {chatMessages.filter(msg => {
                  const textLower = msg.text.toLowerCase();
                  if (msg.sender === 'user') {
                    const isAutomatedUser = 
                      textLower.includes('tôi đã hoàn thành bước') ||
                      textLower.includes('chúc mừng đã hoàn thành') ||
                      textLower.includes('hãy hướng dẫn tôi tiếp tục') ||
                      textLower.includes('chúc mừng đã hoàn thành tất cả') ||
                      textLower.includes('tôi đã hoàn thành bước 7');
                    if (isAutomatedUser) return false;
                  }
                  const isCompletion = msg.sender === 'ai' && (
                    msg.text.includes('go_to_step') ||
                    msg.text.includes('complete_step') ||
                    msg.text.includes('go_to_dashboard') ||
                    msg.text.includes('go_to_workspace') ||
                    textLower.includes('phê duyệt hoàn thành') || 
                    textLower.includes('hoàn thành bước') || 
                    textLower.includes('hoàn thiện bước') || 
                    textLower.includes('hoàn thành toàn bộ 7 bước') || 
                    textLower.includes('hoàn thành xuất sắc') ||
                    textLower.includes('hoàn thành 7 bước') ||
                    textLower.includes('chúc mừng bạn đã hoàn tất') ||
                    textLower.includes('misa ava chúc mừng') ||
                    textLower.includes('tuyệt vời! bạn đã hoàn thiện')
                  ) && !textLower.includes('bản tin') && !textLower.includes('báo cáo') && !textLower.includes('ứng dụng bổ trợ');
                  return !isCompletion;
                }).map((msg, index) => {
                  const textLower = msg.text.toLowerCase();
                  const isCompletion = false; // We already filtered them out, so this is never true here

                  return (
                    <div
                      key={index}
                      className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        {msg.sender === 'ai' && (
                          <div className="flex items-center gap-1.5 mb-1 select-none">
                            <div className="w-5.5 h-5.5 rounded-full overflow-hidden flex items-center justify-center bg-indigo-50 border border-indigo-100 shadow-xs flex-shrink-0">
                              <img 
                                src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=27a8e564-f87d-449a-b620-fef9e2113373.png&isTemp=true&tenantCode=misa" 
                                alt="MISA AVA"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="text-[12px] font-semibold text-slate-600">MISA AVA</span>
                          </div>
                        )}
                        <div className={`rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-xs ${
                          msg.sender === 'user'
                            ? 'bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE] font-medium rounded-2xl rounded-tr-none'
                            : isCompletion
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl rounded-tl-none'
                              : 'bg-white text-slate-800 border border-slate-200/60 rounded-2xl rounded-tl-none'
                        }`}>
                          {renderFormattedText(msg.text, handleChatActionClick, completedSteps)}
                        </div>
                        <span className={`text-[9px] text-slate-400 font-semibold px-1 ${
                          msg.sender === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isAiTyping && (
                  <div className="flex w-full justify-start animate-pulse">
                    <div className="flex flex-col gap-1 max-w-[85%] items-start">
                      <div className="flex items-center gap-1.5 mb-1 select-none">
                        <div className="w-5.5 h-5.5 rounded-full overflow-hidden flex items-center justify-center bg-indigo-50 border border-indigo-100 shadow-xs flex-shrink-0">
                          <img 
                            src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=27a8e564-f87d-449a-b620-fef9e2113373.png&isTemp=true&tenantCode=misa" 
                            alt="MISA AVA"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[12px] font-semibold text-slate-600">MISA AVA</span>
                      </div>
                      <div className="bg-white text-slate-800 border border-slate-200/60 rounded-2xl rounded-tl-none px-4 py-2.5 text-[14px] flex items-center gap-2 shadow-xs">
                        <span className="text-slate-400 font-semibold">MISA AVA đang trả lời</span>
                        <span className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={sheetMessagesEndRef} />
              </div>



              {/* Bottom Input Area */}
              <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200/60 focus-within:border-slate-300 focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={sheetInput}
                    onChange={(e) => setSheetInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessageToAi(sheetInput);
                        setSheetInput('');
                      }
                    }}
                    className="flex-1 bg-transparent border-none outline-none focus:outline-none text-[14px] text-slate-800 placeholder:text-slate-400 py-2"
                    placeholder="Hỏi bất cứ điều gì..."
                  />
                  <button
                    onClick={() => {
                      if (sheetInput.trim()) {
                        handleSendMessageToAi(sheetInput);
                        setSheetInput('');
                      }
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      sheetInput.trim()
                        ? 'bg-slate-900 text-white shadow-sm hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  </button>
                </div>

                {/* Step-specific suggestion chips below the text input */}
                {false && (
                  <div className="flex items-center gap-1.5 mt-3 select-none">
                    <button
                      type="button"
                      onClick={() => scrollSuggestions('left')}
                      className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 active:scale-95 text-[12px] font-bold shadow-2xs"
                      title="Xem thêm bên trái"
                    >
                      &larr;
                    </button>

                    <div 
                      ref={suggestionsRef}
                      className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-none scroll-smooth pb-0.5"
                    >
                      {getStepSuggestedQuestions(activeStepId).map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleSendMessageToAi(q);
                          }}
                          className="text-[12px] font-semibold text-slate-600 hover:text-[#1E62EC] bg-slate-50 hover:bg-[#1E62EC]/5 border border-slate-200 hover:border-[#1E62EC]/20 rounded-lg px-2.5 py-1.5 transition-all text-left cursor-pointer active:scale-95 duration-150 shadow-2xs whitespace-nowrap flex-shrink-0"
                        >
                          💡 {q}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollSuggestions('right')}
                      className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 active:scale-95 text-[12px] font-bold shadow-2xs"
                      title="Xem thêm bên phải"
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 💠 SLIDING POPUP TOAST SYSTEM */}
      {toast && (
        <div 
          className="fixed left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl animate-fade-in max-w-sm md:max-w-md w-max border border-white/10"
          style={{ zIndex: 10000, top: showTrialBanner ? '100px' : '56px' }}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs font-semibold leading-normal flex-1">
            {toast.message}
          </div>
          <button 
            onClick={() => setToast(null)} 
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 💠 FLOATING SETUP GUIDE WIDGET */}
      {!isAiSheetOpen && !isSetupPopupOpen && completionPercentage < 100 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" onClick={(e) => e.stopPropagation()}>
          {/* Dropdown Checklist (Opens upwards) */}
          <AnimatePresence>
            {isFloatingDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="mb-3 w-85 bg-white text-slate-800 rounded-2xl shadow-[0_12px_40px_-4px_rgba(0,0,0,0.15),0_8px_16px_-4px_rgba(0,0,0,0.1)] border border-slate-200/80 p-4 flex flex-col gap-3.5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-900">Hướng dẫn Thiết lập</span>
                    <span className="text-[11px] text-slate-500 font-medium">Tiến trình hoàn thành: {completedCount}/7 bước</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {completionPercentage}%
                  </span>
                </div>

                {/* Primary navigation to Workspace */}
                <div className="border-b border-slate-100 pb-2.5 bg-[#F8FAFC]/50 -mx-4 px-4 pt-1">
                  <button
                    onClick={() => {
                      setActiveMenuId('ban-lam-viec');
                      setIsFloatingDropdownOpen(false);
                      triggerNotification("Đang đi tới Bàn làm việc", "success");
                    }}
                    className="w-full bg-[#1E62EC] hover:bg-[#154fc4] text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] select-none"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Đi tới Bàn làm việc
                  </button>
                </div>

                <div className="space-y-2 my-0.5 max-h-64 overflow-y-auto pr-1">
                  {[
                    { id: 1, text: 'Thiết lập phương pháp tính thuế' },
                    { id: 2, text: 'Khai báo thực đơn' },
                    { id: 3, text: 'Thiết lập Bếp/Bar' },
                    { id: 4, text: 'Sơ đồ bàn' },
                    { id: 5, text: 'Thiết lập hình thức thanh toán' },
                    { id: 6, text: 'Kết nối hóa đơn điện tử' },
                    { id: 7, text: 'Khai báo nhân viên' },
                  ].map((step) => {
                    const isStepCompleted = completedSteps[step.id];
                    return (
                      <div 
                        key={step.id}
                        onClick={() => {
                          setIsFloatingDropdownOpen(false);
                          handleChecklistStepClick(step.id, step.text);
                        }}
                        className="flex items-center justify-between gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {isStepCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-[10px] font-extrabold group-hover:border-blue-400 group-hover:text-blue-600 transition-colors">
                                {step.id}
                              </div>
                            )}
                          </div>
                          <span className={`text-[12px] font-semibold transition-colors ${
                            isStepCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-700 group-hover:text-slate-900'
                          }`}>
                            {step.text}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Trigger Badge */}
          <button
            onClick={() => setIsFloatingDropdownOpen(!isFloatingDropdownOpen)}
            className="flex items-center gap-3 px-4.5 py-3 bg-[#1E62EC] hover:bg-[#154fc4] text-white rounded-full shadow-[0_8px_30px_rgba(30,98,236,0.35)] border border-white/20 cursor-pointer transition-all hover:scale-105 active:scale-95 group select-none"
            title="Xem hướng dẫn thiết lập"
          >
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/90 shadow-md bg-white">
                <img 
                  src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=27a8e564-f87d-449a-b620-fef9e2113373.png&isTemp=true&tenantCode=misa" 
                  alt="MISA AVA"
                  className="w-full h-full object-cover animate-pulse"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col items-start text-left leading-tight">
              <span className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">Trợ lý AVA</span>
              <span className="text-[13px] font-bold flex items-center gap-1.5">
                <span>Hướng dẫn Thiết lập</span>
                <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                  {completionPercentage}%
                </span>
              </span>
            </div>
          </button>
        </div>
      )}
        </div>
      )}
      {/* 💠 POPUP CHÚC MỪNG HOÀN THÀNH 7 BƯỚC THIẾT LẬP */}
      <AnimatePresence>
        {isCongratulationsPopupOpen && (
          <div className="fixed inset-0 z-[110000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            {/* Background click to close */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent cursor-pointer"
              onClick={() => setIsCongratulationsPopupOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
              {/* Decorative top success border banner */}
              <div className="h-2 w-full bg-emerald-500" />

              {/* Close Button */}
              <button
                onClick={() => setIsCongratulationsPopupOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                title="Đóng"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col items-center">
                {/* Tick xanh nổi bật */}
                <div className="relative mb-4 flex items-center justify-center">
                  {/* Outer breathing success ring */}
                  <span className="absolute inline-flex h-20 w-20 rounded-full bg-emerald-100 animate-ping opacity-35" />
                  <div className="relative w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                    <Check className="w-9 h-9 stroke-[4]" />
                  </div>
                </div>

                <div className="text-center max-w-lg mb-6">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    Hoàn tất thiết lập!
                  </h2>
                  <p className="text-[13px] text-slate-500 mt-2 font-medium leading-relaxed line-clamp-2">
                    Bạn đã hoàn thành các thiết lập ban đầu cho nhà hàng. Hãy cài đặt ứng dụng cho từng bộ phận dưới đây để đồng bộ quy trình bán hàng và chế biến.
                  </p>
                </div>

                {/* Phần mềm cho từng bộ phận section header */}
                <div className="w-full flex items-center justify-between border-t border-slate-100 pt-5 mt-1 mb-4 select-none">
                  <span className="text-[15px] font-bold text-[#10141B] font-sans">
                    Phần mềm cho từng bộ phận
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerNotification("Đang tải tài liệu hướng dẫn quy trình vận hành đồng bộ cho từng bộ phận...", "success")}
                    className="bg-[#245FDF] hover:bg-[#1C51C5] text-white text-[13px] font-semibold h-9 px-4 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-sm shadow-[#245FDF]/10 cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Tải hướng dẫn</span>
                  </button>
                </div>

                {/* Danh sách Cài đặt phần mềm cho từng nhân viên */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 text-left">
                  {[
                    {
                      id: 'cashier',
                      role: 'Thu ngân, Lễ Tân',
                      badge: 'Máy tính (PC), Máy POS',
                      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
                      platforms: ['Windows'],
                      desc: 'Ghi order nhanh chóng, áp dụng khuyến mãi, quản lý dòng két tiền an toàn, in hóa đơn tạm tính/chính thức và bàn giao ca dễ dàng.',
                      icon: Receipt,
                      iconBg: 'bg-blue-50 text-blue-600',
                      iconActiveBg: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
                      image: "https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=f010e3ee-fc89-4671-be13-aaa59f292392.png&isTemp=true&tenantCode=misa",
                      actions: [
                        { label: 'Tải bộ cài', type: 'download', onClick: () => triggerNotification('Đang chuẩn bị tải bộ cài đặt Thu ngân & Lễ tân CukCuk...', 'success') },
                        { label: 'Xem hướng dẫn', type: 'doc', onClick: () => triggerNotification('Mở hướng dẫn cấu hình chi tiết máy POS thu ngân', 'info') },
                        { label: 'Video hướng dẫn', type: 'video', onClick: () => triggerNotification('Đang mở video hướng dẫn lắp đặt thiết bị thu ngân...', 'info') },
                        { label: 'Chia sẻ', type: 'share', onClick: () => {
                          navigator.clipboard.writeText('https://cukcuk.vn/cashier-app');
                          triggerNotification('Đã sao chép liên kết tải ứng dụng Thu ngân & Lễ tân! Gửi cho nhân viên để cài đặt.', 'success');
                        }}
                      ]
                    },
                    {
                      id: 'waiter',
                      role: 'Nhân viên ghi order',
                      badge: 'Điện thoại Android/iOS',
                      badgeColor: 'bg-orange-50 text-orange-700 border-orange-100',
                      platforms: ['Android', 'iOS'],
                      desc: 'Ghi nhận order trực quan theo sơ đồ bàn, quản lý số khách, ghi chú món ăn chi tiết và gửi yêu cầu tức thì đến Bếp/Bar qua Wifi.',
                      icon: OrderStaffIcon,
                      iconBg: 'bg-orange-50 text-orange-600',
                      iconActiveBg: 'bg-orange-600 text-white shadow-md shadow-orange-500/20',
                      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://cukcuk.vn/waiter-app',
                      actions: [
                        { label: 'Tài liệu hướng dẫn', type: 'doc', onClick: () => triggerNotification('Mở tài liệu hướng dẫn sử dụng app Ghi Order cho nhân viên', 'info') },
                        { label: 'Video hướng dẫn', type: 'video', onClick: () => triggerNotification('Đang mở video hướng dẫn sử dụng ứng dụng ghi order...', 'info') },
                        { label: 'Chia sẻ', type: 'share', onClick: () => {
                          navigator.clipboard.writeText('https://cukcuk.vn/waiter-app');
                          triggerNotification('Đã sao chép liên kết tải app Ghi order! Gửi cho nhân viên phục vụ.', 'success');
                        }}
                      ]
                    },
                    {
                      id: 'kitchen',
                      role: 'Bếp/Bar',
                      badge: 'KDS, Tablet, Smart TV',
                      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                      platforms: ['Android'],
                      desc: 'Hiển thị danh sách món cần chế biến theo thứ tự gọi, tự động gộp số lượng các món cùng loại và báo hoàn thành món chỉ với 1 chạm.',
                      icon: ChefHat,
                      iconBg: 'bg-emerald-50 text-emerald-600',
                      iconActiveBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20',
                      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://cukcuk.vn/kitchen-app',
                      actions: [
                        { label: 'Tài liệu hướng dẫn', type: 'doc', onClick: () => triggerNotification('Mở tài liệu hướng dẫn thiết lập màn hình bếp/bar', 'info') },
                        { label: 'Video hướng dẫn', type: 'video', onClick: () => triggerNotification('Đang mở video hướng dẫn lắp đặt màn hình bếp...', 'info') },
                        { label: 'Chia sẻ', type: 'share', onClick: () => {
                          navigator.clipboard.writeText('https://cukcuk.vn/kitchen-app');
                          triggerNotification('Đã sao chép liên kết tải app Bếp/Bar! Gửi cho bộ phận chế biến.', 'success');
                        }}
                      ]
                    },
                    {
                      id: 'manager',
                      role: 'Quản lý, Chủ quán',
                      badge: 'App Quản lý (Điện thoại)',
                      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
                      platforms: ['Android', 'iOS'],
                      desc: 'Theo dõi tức thời doanh thu, số lượng hóa đơn, lượng bàn đang sử dụng và xem báo cáo kinh doanh trực quan mọi lúc mọi nơi.',
                      icon: Briefcase,
                      iconBg: 'bg-purple-50 text-purple-600',
                      iconActiveBg: 'bg-purple-600 text-white shadow-md shadow-purple-500/20',
                      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://cukcuk.vn/manager-app',
                      actions: [
                        { label: 'Tài liệu hướng dẫn', type: 'doc', onClick: () => triggerNotification('Mở tài liệu hướng dẫn sử dụng App Quản lý cho chủ quán', 'info') },
                        { label: 'Video hướng dẫn', type: 'video', onClick: () => triggerNotification('Đang mở video giới thiệu và sử dụng App Quản lý...', 'info') },
                        { label: 'Chia sẻ', type: 'share', onClick: () => {
                          navigator.clipboard.writeText('https://cukcuk.vn/manager-app');
                          triggerNotification('Đã sao chép liên kết tải App Quản lý! Gửi cho chủ quán / quản lý.', 'success');
                        }}
                      ]
                    }
                  ].map((app) => {
                    const AppIcon = app.icon;

                    return (
                      <div 
                        key={app.id}
                        className="border border-slate-200 bg-white rounded-xl p-5 flex flex-col justify-between hover:shadow-sm hover:border-[#245FDF]/40 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4 justify-between">
                          {/* Left side: Content */}
                          <div className="flex-1 min-w-0 text-left">
                            {/* Icon, Role, Badge */}
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${app.iconBg}`}>
                                <AppIcon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-[13.5px] font-bold text-slate-900 leading-none">Dành cho {app.role}</h4>
                                  <span className={`text-[9.5px] border font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans leading-none ${app.badgeColor}`}>
                                    {app.badge}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* App description */}
                            <p className="text-[12px] text-[#6B707A] mt-3 font-medium font-sans leading-relaxed">
                              {app.desc}
                            </p>

                            {/* Platforms tag lists - No bg, no border as requested */}
                            <div className="flex flex-wrap items-center gap-3 mt-3 select-none">
                              {app.platforms.includes('Windows') && (
                                <div className="flex items-center gap-1 py-0.5">
                                  <Monitor className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="text-[11px] font-semibold text-[#6B707A]">Windows (PC/POS)</span>
                                </div>
                              )}
                              {app.platforms.includes('Android') && (
                                <div className="flex items-center gap-1 py-0.5">
                                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.25391 1.74414C3.06456 1.93348 2.95898 2.21312 2.95898 2.53125V21.4688C2.95898 21.7869 3.06456 22.0665 3.25391 22.2559L13.1117 12.398L3.25391 1.74414Z" fill="#0DF2FE"/>
                                    <path d="M17.0674 8.44238L13.1113 12.3984L17.0674 16.3545L20.5947 14.3496C21.603 13.7744 21.603 11.0224 20.5947 10.4473L17.0674 8.44238Z" fill="#FFC900"/>
                                    <path d="M13.1113 12.3984L3.25391 22.2559C3.51865 22.5206 3.96102 22.5323 4.45344 22.252L17.0674 15.0718L13.1113 12.3984Z" fill="#FF1943"/>
                                    <path d="M13.1113 12.3984L17.0674 8.44238L4.45344 1.26224C3.96102 0.981832 3.51865 0.993514 3.25391 1.25826L13.1113 12.3984Z" fill="#00F177"/>
                                  </svg>
                                  <span className="text-[11px] font-bold text-[#475467]">Android</span>
                                </div>
                              )}
                              {app.platforms.includes('iOS') && (
                                <div className="flex items-center gap-1 py-0.5">
                                  <svg className="w-3.5 h-3.5 flex-shrink-0 fill-current text-slate-900" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.029-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.07 1.004 1.45 2.185 3.078 3.766 3.014 1.524-.058 2.098-.981 3.937-.981 1.829 0 2.366.981 3.96.95 1.624-.029 2.664-1.479 3.654-2.924 1.153-1.68 1.624-3.303 1.654-3.385-.03-.015-3.174-1.218-3.204-4.814-.03-2.994 2.445-4.434 2.564-4.514-1.404-2.059-3.564-2.295-4.324-2.355-2.009-.163-3.29 1.04-3.96 1.04zm2.14-3.834c.829-1.024 1.389-2.445 1.234-3.864-1.215.05-2.69.81-3.564 1.829-.765.885-1.434 2.325-1.254 3.714 1.355.105 2.755-.655 3.584-1.679z"/>
                                  </svg>
                                  <span className="text-[11px] font-bold text-[#475467]">iOS</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right side: Image / QR Code */}
                          <div className="flex-shrink-0 self-start">
                            {app.image ? (
                              <div className="w-24 h-24 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                                <img 
                                  src={app.image}
                                  alt={app.role}
                                  className="w-full h-full object-contain select-none"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : app.qrUrl ? (
                              <div className="w-24 h-24 bg-slate-50 border border-slate-100 p-1.5 rounded-xl flex flex-col items-center justify-center relative">
                                <img 
                                  src={app.qrUrl} 
                                  alt="QR Code" 
                                  className="w-[82px] h-[82px] object-contain select-none"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Action buttons row (at the bottom) - No separator/border as requested */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-4">
                          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                            {app.actions.map((act, actIdx) => (
                              <button
                                key={actIdx}
                                onClick={act.onClick}
                                className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-2xs ${
                                  act.type === 'download' 
                                    ? 'bg-[#245FDF] hover:bg-blue-700 text-white' 
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {act.type === 'download' && <Download className="w-3.5 h-3.5" />}
                                {act.type === 'doc' && <BookOpen className="w-3.5 h-3.5" />}
                                {act.type === 'video' && <Video className="w-3.5 h-3.5" />}
                                {act.type === 'share' && <Share2 className="w-3.5 h-3.5 text-[#245FDF]" />}
                                {act.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pinned Sticky Footer containing "Bắt đầu bán hàng" */}
              <div className="p-5 bg-white border-t border-slate-100 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCongratulationsPopupOpen(false)}
                  className="w-full bg-[#245FDF] hover:bg-[#1C51C5] text-white rounded-xl text-[13px] font-bold py-3.5 transition-all shadow-md active:scale-[0.98] cursor-pointer text-center select-none"
                >
                  Bắt đầu bán hàng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
