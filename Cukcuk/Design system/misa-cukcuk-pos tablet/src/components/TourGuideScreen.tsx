import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Lightbulb, Play, BookOpen, MessageSquare, Check, HelpCircle, Sparkles, 
  ChevronRight, Info, Award, Smartphone, Monitor, ShieldCheck, Printer, FileText, 
  CalendarDays, ShoppingBag, ClipboardList, RefreshCw, ChefHat, UserCheck, HelpCircle as HelpIcon, PlayCircle
} from 'lucide-react';

interface TourGuideScreenProps {
  userProfile: any;
  onNavigateToScreen?: (screen: any) => void;
  onClose?: () => void;
  onStartInteractiveTour?: (stepIdx?: number) => void;
}

export default function TourGuideScreen({ userProfile, onNavigateToScreen, onClose, onStartInteractiveTour }: TourGuideScreenProps) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'tutorials' | 'protips' | 'assistant'>('workflow');
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Interactive Virtual Assistant State
  const [assistantMessage, setAssistantMessage] = useState<string>(
    `Xin chào ${userProfile?.name || 'Quý khách'}! Tôi là Trợ lý Ảo MISA CukCuk. Tôi có thể hướng dẫn bạn thao tác những nghiệp vụ nào hôm nay?`
  );
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const workflowSteps = [
    {
      title: 'Nghiệp vụ Ghi món (Order)',
      desc: 'Tạo hóa đơn ghi món nhanh chóng, tùy chỉnh món ăn linh hoạt cho từng bàn, tự động gộp dòng bia và nước ngọt đóng chai để phục vụ nhanh nhất.',
      icon: ClipboardList,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      screen: 'orderList',
      actionText: 'Vào màn hình Order',
      stepIdx: 0
    },
    {
      title: 'Quản lý Sơ đồ bàn',
      desc: 'Theo dõi trực quan trạng thái từng bàn ăn (Bàn trống, Đang phục vụ, Chờ thanh toán) và thực hiện gộp bàn, chuyển món dễ dàng chỉ với vài chạm.',
      icon: Play,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      screen: 'tables',
      actionText: 'Đến Sơ đồ bàn',
      stepIdx: 2
    },
    {
      title: 'Quản lý Hóa đơn',
      desc: 'Tra cứu danh sách hóa đơn bán hàng, kiểm tra lịch sử thanh toán, quản lý doanh thu và thực hiện xuất hóa đơn điện tử nhanh chóng, chính xác.',
      icon: FileText,
      color: 'text-brand bg-blue-50 border-blue-200',
      screen: 'invoices',
      actionText: 'Xem Hóa đơn',
      stepIdx: 4
    }
  ];

  const videoTutorials = [
    {
      id: 'quick-order',
      title: 'Hướng dẫn ghi món nhanh cho khách lẻ',
      duration: '1:30',
      desc: 'Cách chọn món ăn nhanh, áp dụng ghi chú riêng biệt cho món ăn và lưu nháp hóa đơn để tiếp khách tiếp theo.',
      views: '1,240 lượt xem'
    },
    {
      id: 'table-merge',
      title: 'Gộp bàn & chuyển món nâng cao',
      duration: '2:15',
      desc: 'Các thao tác nghiệp vụ chuyển bàn, gộp bàn và chia sẻ hóa đơn cho các nhóm khách đi chung trong giờ cao điểm.',
      views: '850 lượt xem'
    },
    {
      id: 'vietqr-setup',
      title: 'Cấu hình VietQR động nhận tiền tự động',
      duration: '3:05',
      desc: 'Cài đặt tài khoản ngân hàng và kích hoạt mã QR VietQR động chứa số tiền tương ứng trên hóa đơn.',
      views: '2,100 lượt xem'
    },
    {
      id: 'meinvoice-sync',
      title: 'Phần mềm xuất hóa đơn',
      duration: '4:12',
      desc: 'Liên kết tài khoản Phần mềm xuất hóa đơn và thiết lập tự động ký số hóa đơn điện tử chuyển thẳng lên Cơ quan Thuế.',
      views: '1,560 lượt xem'
    }
  ];

  const proTips = [
    {
      title: 'Quy tắc Gộp Dòng Đồ Uống',
      desc: 'Khi thêm món ăn, CukCuk sẽ tạo dòng mới để tùy biến riêng. Tuy nhiên, các loại Đồ uống đóng chai & Bia rượu sẽ TỰ ĐỘNG GỘP DÒNG tăng số lượng để phục vụ nhanh chóng!',
      category: 'Nghiệp vụ'
    },
    {
      title: 'Bàn phím nhập số lượng thông minh',
      desc: 'Khi nhấn vào số lượng món ăn, bảng NumPad thông minh hỗ trợ nút nhanh +/- lớn flanking hiển thị giá trị, nút Xóa nhanh (C) và Xóa ký tự giúp tránh sai sót thao tác.',
      category: 'Thao tác'
    },
    {
      title: 'Nạp Mô Tả Thực Đơn bằng AI (AVA)',
      desc: 'Tiết kiệm 95% thời gian tạo thực đơn bằng cách viết mô tả tự do (Ví dụ: "Phở tái nạm 55k, Bia Hà Nội 15k"), AI sẽ tự động phân tách món ăn và giá bán chuẩn xác.',
      category: 'Tính năng'
    },
    {
      title: 'Làm nổi bật món mới thêm',
      desc: 'Món ăn mới thêm vào giỏ hàng sẽ được viền xanh nhấp nháy phát sáng để phục vụ viên dễ nhận biết. Hiệu ứng tự tắt sau 3 giây hoặc khi có món mới tiếp theo được thêm.',
      category: 'Giao diện'
    }
  ];

  const assistantFaqs = [
    {
      question: 'Làm thế nào để xuất Hóa đơn điện tử?',
      answer: 'Để xuất HĐĐT, bạn tích chọn "Khách lấy hóa đơn điện tử" ở màn hình thanh toán, nhập MST/Thông tin người mua. Hệ thống sẽ kết nối phần mềm xuất hóa đơn và tự động gửi hóa đơn hợp lệ lên Cơ quan Thuế.'
    },
    {
      question: 'Tại sao đồ uống tự động gộp dòng?',
      answer: 'Đây là thiết kế tối ưu của CukCuk! Bia và đồ uống đóng chai thường không cần ghi chú chế biến riêng như món ăn, gộp dòng giúp giao diện thanh toán gọn gàng và tránh nhầm lẫn khi đếm chai.'
    },
    {
      question: 'Làm thế nào để nhận tiền bằng chuyển khoản nhanh?',
      answer: 'Bạn vào Onboarding -> Thiết lập thanh toán ngân hàng, nhập số tài khoản và ngân hàng. Hệ thống sẽ tự tạo mã VietQR động chứa sẵn số tiền của hóa đơn để khách quét chuyển khoản.'
    },
    {
      question: 'Tôi có thể quản lý thu chi nội bộ ở đâu?',
      answer: 'Bạn mở Menu 9-chấm (Apps Menu) ở góc dưới Sidebar, chọn "Kế toán Thu - Chi" để ghi nhận quỹ tiền mặt, phiếu thu cọc, chi mua nguyên liệu thực phẩm hàng ngày.'
    }
  ];

  const handleAskAssistant = (faq: typeof assistantFaqs[0]) => {
    setIsTyping(true);
    setAssistantMessage('Đang xử lý câu hỏi của bạn...');
    setTimeout(() => {
      setAssistantMessage(faq.answer);
      setIsTyping(false);
    }, 600);
  };

  const startDemoSimulation = (id: string) => {
    if (id === 'quick-order' && onStartInteractiveTour) {
      onStartInteractiveTour();
      if (onClose) onClose();
      return;
    }
    setSelectedTutorial(id);
    setActiveStep(0);
  };

  const demoSteps: Record<string, { title: string; desc: string; icon: any }[]> = {
    'quick-order': [
      { title: 'Chọn bàn phục vụ', desc: 'Nhấp chọn một bàn trống màu xám trên sơ đồ phòng bàn để mở màn hình Order.', icon: Monitor },
      { title: 'Chọn món trong thực đơn', desc: 'Nhấn vào danh sách món ăn, số lượng badge hiển thị ngay góc món để bạn biết bàn đang gọi món này.', icon: ChefHat },
      { title: 'Xác nhận gửi bếp/bar', desc: 'Nhấn "Gửi bếp/bar" để chuyển yêu cầu xuống bộ phận chế biến ngay lập tức.', icon: Printer }
    ],
    'vietqr-setup': [
      { title: 'Vào phân hệ Thiết lập Onboarding', desc: 'Mở thiết lập Quy trình Onboarding từ menu ứng dụng.', icon: UserCheck },
      { title: 'Khai báo Tài khoản Ngân hàng', desc: 'Nhập số tài khoản, tên chủ tài khoản viết hoa không dấu và chọn ngân hàng thụ hưởng.', icon: Smartphone },
      { title: 'Kiểm tra QR động tại màn hình thanh toán', desc: 'Khi khách thanh toán chuyển khoản, QR động tự sinh đúng số tiền hóa đơn để khách quét.', icon: FileText }
    ]
  };

  return (
    <div id="tourguide-screen" className="flex-1 h-full overflow-hidden flex flex-col bg-[#EEF0F4] p-3 text-slate-800">
      {/* Top Header Row */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-200 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center border border-brand/20">
            <Compass className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
              Virtual Tour Guide CUKCUK
              <span className="px-2 py-0.5 text-xs bg-brand text-white font-black rounded-full uppercase tracking-wider">AI Assistant</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Bản đồ tương tác, hướng dẫn thao tác chuẩn và mẹo bán hàng dành riêng cho nhà hàng của bạn</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {onStartInteractiveTour && (
            <button 
              onClick={onStartInteractiveTour}
              className="px-6 h-10 bg-brand hover:bg-brand-hover text-white font-black text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-brand/10 hover:shadow-brand/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Bắt đầu Tour hướng dẫn</span>
            </button>
          )}

          {onClose && (
            <button 
              onClick={onClose}
              className="px-6 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Đóng Trợ lý
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[240px_1fr] gap-3 overflow-hidden">
        {/* Left Sub-navigation Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-1.5 h-full overflow-y-auto">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider px-3 mb-2">Phân hệ Trợ lý</p>
          
          <button
            onClick={() => { setActiveTab('workflow'); setSelectedTutorial(null); }}
            className={`w-full px-4 py-3 flex items-center gap-3 rounded-xl text-left text-xs font-bold transition-all ${
              activeTab === 'workflow' ? 'bg-brand text-white shadow-lg shadow-brand/10' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Sơ đồ luồng POS</span>
          </button>

          <button
            onClick={() => { setActiveTab('tutorials'); setSelectedTutorial(null); }}
            className={`w-full px-4 py-3 flex items-center gap-3 rounded-xl text-left text-xs font-bold transition-all ${
              activeTab === 'tutorials' ? 'bg-brand text-white shadow-lg shadow-brand/10' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Play className="w-4 h-4 shrink-0" />
            <span>Tự học thao tác nhanh</span>
          </button>

          <button
            onClick={() => { setActiveTab('protips'); setSelectedTutorial(null); }}
            className={`w-full px-4 py-3 flex items-center gap-3 rounded-xl text-left text-xs font-bold transition-all ${
              activeTab === 'protips' ? 'bg-brand text-white shadow-lg shadow-brand/10' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span>Mẹo & Quy định POS</span>
          </button>

          <button
            onClick={() => { setActiveTab('assistant'); setSelectedTutorial(null); }}
            className={`w-full px-4 py-3 flex items-center gap-3 rounded-xl text-left text-xs font-bold transition-all ${
              activeTab === 'assistant' ? 'bg-brand text-white shadow-lg shadow-brand/10' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Trợ lý Ảo Hỏi-Đáp</span>
          </button>

          <div className="mt-auto p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 text-center">
            <Sparkles className="w-6 h-6 text-brand mx-auto mb-1.5 animate-pulse" />
            <p className="text-xs font-bold text-brand leading-snug">CUKCUK hỗ trợ 24/7</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">Hotline: 1900 8677</p>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full">
          
          {/* TAB 1: WORKFLOW VIEW */}
          {activeTab === 'workflow' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Compass className="w-5 h-5 text-brand" />
                <div>
                  <h2 className="text-base font-black text-slate-800">Sơ đồ Luồng Nghiệp Vụ Bán Hàng</h2>
                  <p className="text-xs text-slate-500 font-medium">Quy trình chuẩn 3 bước giúp vận hành nhà hàng hiệu quả và nhanh gọn</p>
                </div>
              </div>

              <div className="relative pl-6 border-l border-dashed border-slate-200 ml-3 space-y-8 py-2">
                {workflowSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={idx} className="relative flex gap-4 group">
                      {/* Node circle wrapper */}
                      <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-brand group-hover:scale-105 transition-all">
                        <span className="text-xs font-black text-slate-700 group-hover:text-brand">{idx + 1}</span>
                      </div>

                      <div className={`p-1.5 rounded-xl border ${step.color} h-11 w-11 flex items-center justify-center shrink-0`}>
                        <StepIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{step.title}</h3>
                          <div className="flex items-center gap-2">
                            {onNavigateToScreen && (
                              <button
                                onClick={() => onNavigateToScreen(step.screen)}
                                className="px-3 h-8 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <span>{step.actionText}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                            
                            {onStartInteractiveTour && (
                              <button
                                onClick={() => {
                                  onStartInteractiveTour(step.stepIdx);
                                  if (onClose) onClose();
                                }}
                                className="px-4 h-8 bg-brand hover:bg-brand-hover text-white text-xs font-black rounded-lg transition-all flex items-center gap-1.5 shadow-md active:scale-95 hover:shadow-brand/20"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                <span>Dùng ngay</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TUTORIALS & VIDEO SIMULATION */}
          {activeTab === 'tutorials' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 shrink-0">
                <Play className="w-5 h-5 text-brand" />
                <div>
                  <h2 className="text-base font-black text-slate-800">Tự học thao tác bán hàng nhanh</h2>
                  <p className="text-xs text-slate-500 font-medium">Bản hướng dẫn mô phỏng từng bước cho các thao tác nghiệp vụ cốt lõi</p>
                </div>
              </div>

              {!selectedTutorial ? (
                <div className="grid grid-cols-2 gap-4">
                  {videoTutorials.map((tut) => (
                    <div 
                      key={tut.id}
                      className="border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-brand/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded flex items-center gap-1">
                            <PlayCircle className="w-3 h-3 text-brand" />
                            {tut.duration}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{tut.views}</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 mb-2">{tut.title}</h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed mb-4">{tut.desc}</p>
                      </div>
                      
                      {demoSteps[tut.id] ? (
                        <button
                          onClick={() => startDemoSimulation(tut.id)}
                          className="w-full h-9 bg-blue-50 hover:bg-blue-100 text-brand text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Compass className="w-3.5 h-3.5 animate-spin" />
                          Bắt đầu Chạy thử Mô phỏng
                        </button>
                      ) : (
                        <button
                          onClick={() => alert('Đang cập nhật video hướng dẫn cho tính năng này!')}
                          className="w-full h-9 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          Xem Video hướng dẫn
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Compass className="w-4 h-4 text-brand animate-spin" />
                        Mô phỏng: {videoTutorials.find(t => t.id === selectedTutorial)?.title}
                      </h3>
                      <button 
                        onClick={() => setSelectedTutorial(null)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800"
                      >
                        Quay lại danh sách
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 relative">
                      {demoSteps[selectedTutorial]?.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isCurrent = activeStep === idx;
                        const isDone = idx < activeStep;
                        return (
                          <div 
                            key={idx}
                            onClick={() => setActiveStep(idx)}
                            className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex flex-col gap-2.5 relative ${
                              isCurrent ? 'border-brand bg-white shadow-md scale-[1.02]' : 
                              isDone ? 'border-emerald-500 bg-emerald-50/40 opacity-70' : 
                              'border-slate-200 bg-white opacity-40 hover:opacity-70'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCurrent ? 'bg-brand text-white' :
                                isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                              </span>
                              <StepIcon className={`w-4 h-4 ${isCurrent ? 'text-brand' : 'text-slate-400'}`} />
                            </div>
                            <h4 className="text-xs font-bold text-slate-700">{step.title}</h4>
                            <p className="text-xs text-slate-500 font-normal leading-relaxed">{step.desc}</p>
                            
                            {isCurrent && onStartInteractiveTour && selectedTutorial === 'quick-order' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStartInteractiveTour(idx);
                                }}
                                className="mt-2 h-8 px-4 bg-brand hover:bg-brand-hover text-white text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 self-start shadow-md active:scale-95"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Dùng ngay</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Bấm qua từng bước để tìm hiểu cách hệ thống hoạt động</span>
                    <div className="flex gap-2">
                      <button 
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                        className="px-4 h-9 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 rounded-lg text-xs font-bold transition-all"
                      >
                        Quay lại
                      </button>
                      
                      {activeStep < (demoSteps[selectedTutorial]?.length - 1) ? (
                        <button 
                          onClick={() => setActiveStep(prev => prev + 1)}
                          className="px-4 h-9 bg-brand text-white hover:bg-brand-hover rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        >
                          Bước tiếp theo
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setSelectedTutorial(null);
                            alert('Chúc mừng! Bạn đã hoàn thành bài chạy thử mô phỏng này.');
                          }}
                          className="px-4 h-9 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        >
                          Hoàn thành & Quay lại
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRO-TIPS & CUSTOM RULES */}
          {activeTab === 'protips' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Lightbulb className="w-5 h-5 text-brand" />
                <div>
                  <h2 className="text-base font-black text-slate-800">Quy định Nghiệp Vụ & Mẹo POS</h2>
                  <p className="text-xs text-slate-500 font-medium">Những quy tắc nghiệp vụ đặc thù được cấu hình trong hệ thống để giảm thiểu thời gian thao tác</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {proTips.map((tip, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 rounded-2xl p-4 hover:border-brand/25 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-black uppercase rounded">
                        {tip.category}
                      </span>
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 mb-1.5">{tip.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE AI ASSISTANT */}
          {activeTab === 'assistant' && (
            <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 shrink-0">
                <MessageSquare className="w-5 h-5 text-brand" />
                <div>
                  <h2 className="text-base font-black text-slate-800">Trợ lý Ảo Hỏi-Đáp CukCuk</h2>
                  <p className="text-xs text-slate-500 font-medium">Giải đáp thắc mắc về nghiệp vụ bán hàng, thanh toán và in ấn tức thì</p>
                </div>
              </div>

              {/* Chat Viewport */}
              <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 overflow-y-auto flex flex-col gap-3">
                {/* Assistant Welcome message */}
                <div className="flex gap-2.5 items-start max-w-[85%] self-start">
                  <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center border border-brand/20 text-brand font-black text-xs shrink-0">
                    AI
                  </div>
                  <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-sm border border-slate-150 text-xs text-slate-700 leading-relaxed font-medium shadow-sm">
                    {assistantMessage}
                  </div>
                </div>
                
                {isTyping && (
                  <div className="flex gap-2.5 items-start self-start">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center border border-brand/20 text-brand font-black text-xs shrink-0 animate-bounce">
                      AI
                    </div>
                    <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-sm border border-slate-150 text-xs text-slate-400 italic">
                      Đang nhập câu trả lời...
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Suggesion Faqs */}
              <div className="shrink-0 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Click vào câu hỏi mẫu để tương tác:</p>
                <div className="flex flex-wrap gap-2">
                  {assistantFaqs.map((faq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskAssistant(faq)}
                      className="px-3 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-brand/30 rounded-xl text-xs font-bold text-slate-600 hover:text-brand transition-all text-left max-w-sm"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
