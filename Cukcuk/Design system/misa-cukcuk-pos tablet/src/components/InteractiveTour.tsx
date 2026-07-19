import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToScreen?: (screen: any) => void;
  onOpenAppsMenu?: () => void;
  currentScreen?: string;
  initialStep?: number;
  orders?: any[];
  customizingItem?: any;
  orderItems?: any[];
}

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: 'right' | 'left' | 'top' | 'bottom';
}

export default function InteractiveTour({ 
  isOpen, 
  onClose, 
  onNavigateToScreen, 
  onOpenAppsMenu, 
  currentScreen, 
  initialStep,
  orders,
  customizingItem,
  orderItems
}: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const checkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial step when tour opens
  useEffect(() => {
    if (isOpen) {
      if (initialStep !== undefined) {
        setCurrentStep(initialStep);
      } else {
        setCurrentStep(0);
      }
    }
  }, [isOpen, initialStep]);

  // Reactive state machine to auto-advance steps based on actual user interactions
  useEffect(() => {
    if (!isOpen) return;

    if (currentStep === 0) {
      // Step 0: User clicks "Order" sidebar button
      if (currentScreen === 'order') {
        setCurrentStep(1);
      }
    } else if (currentStep === 1) {
      // Step 1: User selects a dish (customizingItem becomes not null)
      if (customizingItem !== null) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Step 2: User selects customization preference
      const currentCustomizedInCart = customizingItem 
        ? (customizingItem.instanceId 
            ? orderItems?.find(oi => oi.instanceId === customizingItem.instanceId)
            : orderItems?.find(oi => oi.id === customizingItem.id && !oi.instanceId))
        : null;
      const hasSelectedAddon = !!(currentCustomizedInCart?.addons && currentCustomizedInCart.addons.length > 0);
      if (hasSelectedAddon) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      // Step 3: User clicks confirm (customizingItem becomes null again, and we have items in cart)
      if (customizingItem === null && orderItems && orderItems.length > 0) {
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      // Step 4: User clicks "Lưu" (currentScreen becomes 'orderList')
      if (currentScreen === 'orderList') {
        setCurrentStep(5);
      }
    }
  }, [currentScreen, customizingItem, orderItems, isOpen, currentStep]);

  const getTourSteps = (): TourStep[] => [
    {
      targetId: 'tour-sidebar-order',
      title: '1. Bắt đầu ghi món',
      description: 'Chạm vào nút [Order] ở thanh menu trái để bắt đầu ghi nhận đơn món mới.',
      position: 'right'
    },
    {
      targetId: 'tour-menu-first-item',
      title: '2. Chọn món ăn',
      description: 'Chọn một món ăn bất kỳ trên thực đơn (ví dụ: món đầu tiên *Cà phê Phin Sữa đá*) để đưa vào đơn.',
      position: 'bottom'
    },
    {
      targetId: 'tour-addon-first-item',
      title: '3. Chọn yêu cầu đặc biệt',
      description: 'Chọn các tùy chọn như *Nhiều sữa*, *Nhiều đá* theo đúng yêu cầu khẩu vị của khách.',
      position: 'right'
    },
    {
      targetId: 'tour-customization-confirm',
      title: '4. Xác nhận tùy chọn',
      description: 'Chạm [Xác nhận] để lưu tùy chọn đặc biệt và đưa món ăn vào giỏ hàng.',
      position: 'top'
    },
    {
      targetId: 'tour-cart-save-btn',
      title: '5. Lưu đơn hàng',
      description: 'Chạm [Lưu] để ghi nhận đơn tạm tính và đồng bộ thông tin lên hệ thống.',
      position: 'top'
    },
    {
      targetId: 'tour-first-order-card',
      title: '6. Hoàn thành ghi đơn',
      description: 'Tuyệt vời! Đơn hàng đã được lưu và hiển thị ngay tại danh sách Order. Bạn đã hoàn thành xuất sắc luồng ghi món của CukCuk.',
      position: 'bottom'
    }
  ];

  const tourSteps = getTourSteps();
  const step = tourSteps[currentStep] || tourSteps[0];

  const updateCoordinates = () => {
    const activeStepObj = tourSteps[currentStep];
    if (!activeStepObj) return;

    const element = document.getElementById(activeStepObj.targetId);
    const container = document.getElementById('tablet-app-container');
    if (element && container) {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setCoords(null);
      } else {
        // Calculate the actual transform scale of the container
        const scale = containerRect.width / container.offsetWidth || 1;
        setCoords({
          top: (rect.top - containerRect.top) / scale,
          left: (rect.left - containerRect.left) / scale,
          width: rect.width / scale,
          height: rect.height / scale,
        });
      }
    } else {
      setCoords(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoordinates();
      window.addEventListener('resize', updateCoordinates);
      checkTimerRef.current = setInterval(updateCoordinates, 400);
    } else {
      setCoords(null);
    }

    return () => {
      window.removeEventListener('resize', updateCoordinates);
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
      }
    };
  }, [isOpen, currentStep, currentScreen, customizingItem, orderItems]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Tooltip dynamic positioning calculation next to the target element (relative to tablet-app-container)
  const getTooltipStyle = () => {
    const tooltipWidth = 340;
    const tooltipHeight = 180; // Estimated height of the guide popover card
    
    const container = document.getElementById('tablet-app-container');
    const width = container ? container.clientWidth : 1092; // 1120px minus borders
    const height = container ? container.clientHeight : 602;

    const minLeft = 12;
    const maxRight = width - 12;
    const minTop = 12;
    const maxBottom = height - 12;

    if (!coords) {
      // Calculate exact center position inside the tablet container
      const leftCenter = (width - tooltipWidth) / 2;
      const topCenter = (height - tooltipHeight) / 2;
      return { 
        position: 'absolute' as const,
        top: `${topCenter}px`, 
        left: `${leftCenter}px`, 
        width: `${tooltipWidth}px`,
        zIndex: 110 
      };
    }
    
    const gap = 16;
    let left = coords.left + coords.width + gap;
    let top = coords.top + (coords.height / 2) - 90;

    // Check boundary
    if (left + tooltipWidth > maxRight) {
      left = coords.left - tooltipWidth - gap;
    }
    
    // Fallback to top or bottom if out of bounds on both sides
    if (left < minLeft || left + tooltipWidth > maxRight) {
      left = Math.max(minLeft, coords.left + (coords.width / 2) - (tooltipWidth / 2));
      if (left + tooltipWidth > maxRight) {
        left = maxRight - tooltipWidth;
      }
      top = coords.top + coords.height + gap;
      if (top + tooltipHeight > maxBottom) {
        top = coords.top - tooltipHeight - gap;
      }
    } else {
      if (top < minTop) {
        top = minTop;
      } else if (top + tooltipHeight > maxBottom) {
        top = maxBottom - tooltipHeight;
      }
    }

    // Double check constraints to stay inside the tablet screen
    if (left < minLeft) {
      left = minLeft;
    }
    if (left + tooltipWidth > maxRight) {
      left = maxRight - tooltipWidth;
    }
    if (top < minTop) {
      top = minTop;
    }
    if (top + tooltipHeight > maxBottom) {
      top = maxBottom - tooltipHeight;
    }

    return {
      position: 'absolute' as const,
      left: `${left}px`,
      top: `${top}px`,
      width: `${tooltipWidth}px`,
      zIndex: 110,
    };
  };

  return (
    <div id="interactive-tour-overlay" className="absolute inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Target spotlight focusing effect using soft shadow (no blocking masks) */}
      {coords && (
        <div 
          id="tour-spotlight-box"
          className="absolute pointer-events-none rounded-2xl border-2 border-[#245FDF] transition-all duration-300"
          style={{
            top: coords.top - 4,
            left: coords.left - 4,
            width: coords.width + 8,
            height: coords.height + 8,
            zIndex: 100,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65), 0 0 16px rgba(36, 95, 223, 0.5)',
          }}
        >
          <div className="absolute inset-0 rounded-2xl border-2 border-[#245FDF] animate-pulse opacity-60"></div>
        </div>
      )}

      {/* Global Close X button */}
      <button 
        id="tour-close-btn"
        onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white text-slate-800 shadow-[0_4px_12px_rgba(16,24,40,0.1)] flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all z-[111] pointer-events-auto border border-slate-100"
        title="Đóng hướng dẫn"
      >
        <X className="w-4 h-4 text-[#717680]" strokeWidth={2.5} />
      </button>

      {/* Floating Tooltip Popover Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.15 }}
          style={getTooltipStyle()}
          id="tour-tooltip-card"
          className="bg-white rounded-xl shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)] border border-[#E9EAEB] p-5 flex flex-col gap-3.5 pointer-events-auto text-[#101828]"
        >
          {/* Header & Title */}
          <div className="flex flex-col gap-1">
            <h3 className="text-[16px] font-semibold text-[#101828] leading-snug flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#245FDF]" />
              {step.title}
            </h3>
          </div>

          {/* Description Body */}
          <p className="text-[13px] font-normal text-[#101828] leading-relaxed">
            {step.description}
          </p>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E9EAEB]">
            {/* Steps indicator */}
            <span className="text-[12px] font-normal text-[#717680]">
              Mục {currentStep + 1}/{tourSteps.length}
            </span>

            {/* Back & Next/Done Controls */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  id="tour-prev-btn"
                  onClick={handlePrev}
                  className="h-8 px-3 bg-[#FAFAFA] hover:bg-[#F0F2F4] border border-[#D5D7DA] text-[#717680] text-[13px] font-normal rounded-lg transition-all active:scale-95"
                >
                  Quay lại
                </button>
              )}
              
              <button
                id="tour-next-btn"
                onClick={handleNext}
                className="h-8 px-4 bg-[#245FDF] hover:bg-[#245FDF]/90 text-white text-[13px] font-normal rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
              >
                <span>{currentStep === tourSteps.length - 1 ? 'Hoàn thành' : 'Bỏ qua bước'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
