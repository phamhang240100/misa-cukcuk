import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Lock, 
  Utensils, 
  Sparkles, 
  ChevronRight, 
  Check, 
  ArrowRight,
  Coffee,
  Flame,
  Wine,
  Building,
  Users,
  Store,
  Briefcase,
  Eye,
  EyeOff,
  HelpCircle,
  Globe,
  QrCode,
  Tablet,
  Printer,
  FileX,
  ShoppingCart,
  FileText,
  Percent,
  Layers,
  DollarSign,
  BarChart3,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginFlowProps {
  onComplete: (sector: string, scale: string) => void;
  onNotification: (message: string, type?: 'success' | 'info') => void;
}

export function LoginFlow({ onComplete, onNotification }: LoginFlowProps) {
  const [step, setStep] = useState<'login' | 'register' | 'survey'>('survey');
  const [loginTab, setLoginTab] = useState<'password' | 'qr'>('password');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login fields - prefilled by default for quick test and seamless experience
  const [username, setUsername] = useState('cukcuk@software.misa.com.vn');
  const [password, setPassword] = useState('cukcuk2026');
  const [isLoading, setIsLoading] = useState(false);

  // Onboarding selection state
  const [selectedSector, setSelectedSector] = useState<string>('Quán ăn / Nhà hàng');
  const [selectedScale, setSelectedScale] = useState<string>('Quy mô nhỏ (Dưới 10 nhân sự)');

  // New Survey State Questions
  const [surveyStep, setSurveyStep] = useState<number>(1);
  const [restaurantType, setRestaurantType] = useState<string>('Nhà hàng');
  const [orderingMethod, setOrderingMethod] = useState<string>('Khách ngồi tại bàn, có nhân viên phục vụ và thanh toán vào cuối bữa');
  const [kitchenDevice, setKitchenDevice] = useState<string>('Máy tính bảng');
  const [bepDevice, setBepDevice] = useState<string>('Máy in bếp');
  const [barDevice, setBarDevice] = useState<string>('Máy in bar');
  const [userNeeds, setUserNeeds] = useState<string[]>(['Bán hàng', 'Xuất hoá đơn', 'Quản lý kho', 'Báo cáo doanh thu', 'Chăm sóc khách hàng']);

  // Register fields
  const [businessType, setBusinessType] = useState<'enterprise' | 'household'>('enterprise');
  const [selectedProduct, setSelectedProduct] = useState<string>('CukCuk - Quản lý nhà hàng');
  const [taxCode, setTaxCode] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [jobPosition, setJobPosition] = useState<string>('Quản lý cửa hàng / Nhà hàng');
  const [isMisaStaff, setIsMisaStaff] = useState<boolean>(false);
  const [misaStaffCode, setMisaStaffCode] = useState<string>('');
  const [agreedToPolicy, setAgreedToPolicy] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  // Autofill sample account
  const handleAutofill = () => {
    setUsername('cukcuk@software.misa.com.vn');
    setPassword('cukcuk2026');
    setLoginTab('password');
    onNotification('Đã điền thông tin tài khoản mẫu!', 'success');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginTab === 'qr') {
      onNotification('Vui lòng quét mã QR hoặc sử dụng phương pháp đăng nhập mật khẩu', 'info');
      return;
    }
    if (!username || !password) {
      onNotification('Vui lòng nhập tên đăng nhập và mật khẩu', 'info');
      return;
    }

    setIsLoading(true);
    // Simulate minor delay for premium realism
    setTimeout(() => {
      setIsLoading(false);
      setStep('survey');
      onNotification('Đăng nhập thành công! Hãy cung cấp thông tin nhà hàng để tiếp tục.', 'success');
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxCode || !companyName || !fullName || !email || !phone) {
      onNotification('Vui lòng điền đầy đủ các thông tin bắt buộc (*)', 'info');
      return;
    }
    if (!agreedToPolicy) {
      onNotification('Vui lòng xác nhận đồng ý với Chính sách bảo vệ dữ liệu cá nhân', 'info');
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      onNotification('Đăng ký tài khoản dùng thử thành công!', 'success');
      setStep('survey');
    }, 1200);
  };

  const toggleBepDevice = (value: string) => {
    const currentList = bepDevice.split(', ').map(s => s.trim()).filter(Boolean);
    if (value === 'Chỉ phiếu ghi món') {
      setBepDevice('Chỉ phiếu ghi món');
    } else {
      const cleanList = currentList.filter(item => item !== 'Chỉ phiếu ghi món' && item !== 'Không sử dụng');
      if (cleanList.includes(value)) {
        const newList = cleanList.filter(item => item !== value);
        setBepDevice(newList.length > 0 ? newList.join(', ') : 'Chỉ phiếu ghi món');
      } else {
        setBepDevice([...cleanList, value].join(', '));
      }
    }
  };

  const toggleBarDevice = (value: string) => {
    const currentList = barDevice.split(', ').map(s => s.trim()).filter(Boolean);
    if (value === 'Chỉ phiếu ghi món') {
      setBarDevice('Chỉ phiếu ghi món');
    } else {
      const cleanList = currentList.filter(item => item !== 'Chỉ phiếu ghi món' && item !== 'Không sử dụng');
      if (cleanList.includes(value)) {
        const newList = cleanList.filter(item => item !== value);
        setBarDevice(newList.length > 0 ? newList.join(', ') : 'Chỉ phiếu ghi món');
      } else {
        setBarDevice([...cleanList, value].join(', '));
      }
    }
  };

  const handleSurveySubmit = () => {
    onNotification('Bắt đầu khởi tạo bàn làm việc mới cho bạn!', 'success');
    
    // Call onComplete callback with survey details mapping to sector/scale
    const finalDeviceString = (bepDevice === 'Không sử dụng' || bepDevice === 'Chỉ phiếu ghi món') && (barDevice === 'Không sử dụng' || barDevice === 'Chỉ phiếu ghi món')
      ? 'Chỉ phiếu ghi món'
      : `Bếp: ${bepDevice}, Bar: ${barDevice}`;
    const needsString = userNeeds.length > 0 ? `Nhu cầu: ${userNeeds.join(', ')}` : 'Không có';
    onComplete(restaurantType, `${orderingMethod} - Thiết bị: ${finalDeviceString} - ${needsString}`);
  };

  const handleSurveySkip = () => {
    onNotification('Bắt đầu khởi tạo bàn làm việc mới cho bạn!', 'success');
    onComplete('Nhà hàng', 'Bỏ qua khảo sát - Cấu hình mặc định');
  };

  // Option lists for onboarding
  const sectors = [
    { id: 'sector-1', name: 'Quán ăn / Nhà hàng', icon: Utensils, desc: 'Phục vụ ẩm thực, món ăn truyền thống, lẩu nướng, bia hơi' },
    { id: 'sector-2', name: 'Quán Cafe / Trà sữa', icon: Coffee, desc: 'Cà phê, trà hoa quả, nước ép, sinh tố và bánh ngọt lẻ' },
    { id: 'sector-3', name: 'Đồ ăn nhanh / Quán vặt', icon: Flame, desc: 'Bánh mì, gà rán, khoai tây chiên, pizza, xiên nướng vỉa hè' },
    { id: 'sector-4', name: 'Quán nhậu / Bar / Pub', icon: Wine, desc: 'Đồ uống có cồn, cocktail, nhạc sống, phục vụ muộn về đêm' }
  ];

  const scales = [
    { id: 'scale-1', name: 'Cá nhân / Hộ kinh doanh', icon: Store, desc: 'Phù hợp mô hình gia đình tự quản lý, không chia nhiều phòng ban' },
    { id: 'scale-2', name: 'Quy mô nhỏ (Dưới 10 nhân sự)', icon: Users, desc: 'Tối ưu cho cửa hàng đơn lẻ có ít nhân viên phục vụ, thu ngân' },
    { id: 'scale-3', name: 'Quy mô vừa (10 - 50 nhân sự)', icon: Building, desc: 'Có sự phân chia chuyên biệt giữa bếp, bar, phục vụ và quản lý' },
    { id: 'scale-4', name: 'Chuỗi cửa hàng / Quy mô lớn', icon: Briefcase, desc: 'Đồng bộ hóa dữ liệu thời gian thực giữa nhiều địa điểm chi nhánh' }
  ];

  const bgImage = step === 'survey'
    ? 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=11657c78-81e6-492f-bd31-6b3e48216e3c.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa'
    : 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=e3bcb416-0789-4adf-9bd8-8569c16b8625.png&isTemp=true&tenantCode=misa';

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-between p-4 md:p-8 relative select-none bg-cover bg-center"
      style={{ 
        backgroundImage: `url('${bgImage}')` 
      }}
    >
      {/* 🍂 Overlay layer to enhance login card pop with scenic depth */}
      <div className="absolute inset-0 bg-black/10 z-0" />

      {/* 🇻🇳 Top utilities bar (Language selection & Help) */}
      <div className="w-full flex justify-end items-center gap-3 z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md text-white text-[11px] font-bold py-1.5 px-3.5 rounded-full border border-white/10 shadow-sm">
          <span className="text-[12px]">🇻🇳</span>
          <span>Việt Nam</span>
        </div>
        <a 
          href="#help" 
          onClick={(e) => { 
            e.preventDefault(); 
            if (step === 'survey') {
              setStep('login');
              onNotification('Quay lại màn hình đăng nhập', 'info');
            } else {
              onNotification('Trang tài liệu hướng dẫn và trợ giúp MISA', 'info');
            }
          }}
          className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md text-white hover:bg-black/35 text-[11px] font-bold py-1.5 px-3.5 rounded-full border border-white/10 shadow-sm transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-white/95" />
          <span>Trợ giúp</span>
        </a>
      </div>

      <AnimatePresence mode="wait">
        {step === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-4xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 my-auto min-h-[500px]"
            id="login-card"
          >
            {/* 🤖 LEFT COLUMN: Styled with the requested MISA visual banner image, sized to display 100% of the image perfectly with no background showing */}
            <div className="w-full md:w-[460px] relative overflow-hidden flex-shrink-0 flex items-center justify-center p-0">
              <img 
                src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=f36e4206-24c0-4e91-8478-a4b5828e08c7.png&isTemp=true&tenantCode=misa" 
                alt="Banner" 
                className="w-full h-full object-fill block"
              />
            </div>

            {/* 📋 RIGHT COLUMN: Dynamic Login Form */}
            <div className="flex-1 p-8 flex flex-col justify-between bg-white min-h-[500px]">
              
              {/* Top MISA brand logo */}
              <div className="flex flex-col items-center mb-5">
                <img 
                  src="https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=710b4481-0817-40d6-963b-95bd6696dad6.png&isTemp=true&tenantCode=misa" 
                  alt="MISA AMIS Logo" 
                  className="h-14 w-auto object-contain"
                />
              </div>

              {/* Middle Login controls */}
              <div className="flex-1 flex flex-col justify-center my-1.5">
                <h2 className="text-[20px] font-extrabold text-[#111827] text-center mb-4 font-sans tracking-tight">
                  Đăng nhập
                </h2>

                {/* Tabs selection: Mật khẩu vs Mã QR */}
                <div className="flex border-b border-slate-100 w-full mb-5 select-none">
                  <button 
                    type="button"
                    onClick={() => setLoginTab('password')}
                    className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 text-center cursor-pointer ${
                      loginTab === 'password' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Với mật khẩu
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLoginTab('qr')}
                    className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 text-center cursor-pointer ${
                      loginTab === 'qr' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Với mã QR
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {loginTab === 'password' ? (
                    <motion.form 
                      key="pw-form"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                      onSubmit={handleLoginSubmit} 
                      className="space-y-4"
                    >
                      {/* Email / SDT Input */}
                      <div className="relative">
                        <input
                          id="username"
                          type="text"
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                          placeholder="Số điện thoại/email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>

                      {/* Password Input */}
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                          placeholder="Mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Login Button */}
                      <button
                        id="btn-login-submit"
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0066FF] hover:bg-[#0055EE] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-55"
                        style={{ height: '42px' }}
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                        ) : (
                          "Đăng nhập"
                        )}
                      </button>

                      {/* Links */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <a 
                          href="#forgot" 
                          onClick={(e) => { e.preventDefault(); onNotification('Vui lòng sử dụng Tài khoản mẫu để đăng nhập trực tiếp', 'info'); }}
                          className="text-[#0066FF] hover:underline font-bold transition-all"
                        >
                          Quên mật khẩu?
                        </a>
                        <button 
                          type="button"
                          onClick={() => setStep('register')}
                          className="text-[#0066FF] hover:underline font-bold transition-all cursor-pointer text-left"
                        >
                          Đăng ký
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="qr-code-form"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col items-center justify-center py-2 space-y-4"
                    >
                      {/* Gorgeous stylized QR Code with scrolling scanner line */}
                      <div className="relative w-40 h-40 bg-white p-3 border border-slate-200 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                        <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Corner squares */}
                          <path d="M2 2h6v6H2V2zm1 1v4h4V3H3zm13-1h6v6h-6V2zm1 1v4h4V3H3zM2 16h6v6H2v-6zm1 1v4h4V17H3z" fill="currentColor" />
                          {/* Random inner squares mimicking a high-fidelity QR Code */}
                          <rect x="4" y="4" width="2" height="2" fill="currentColor" />
                          <rect x="18" y="4" width="2" height="2" fill="currentColor" />
                          <rect x="4" y="18" width="2" height="2" fill="currentColor" />
                          <rect x="10" y="2" width="2" height="3" fill="currentColor" />
                          <rect x="13" y="4" width="3" height="2" fill="currentColor" />
                          <rect x="10" y="8" width="4" height="2" fill="currentColor" />
                          <rect x="16" y="10" width="2" height="4" fill="currentColor" />
                          <rect x="2" y="10" width="4" height="2" fill="currentColor" />
                          <rect x="8" y="13" width="3" height="3" fill="currentColor" />
                          <rect x="12" y="16" width="4" height="2" fill="currentColor" />
                          <rect x="18" y="15" width="4" height="4" fill="currentColor" />
                          <rect x="14" y="20" width="3" height="2" fill="currentColor" />
                          <rect x="10" y="19" width="2" height="3" fill="currentColor" />
                        </svg>
                        
                        {/* Scanning Laser */}
                        <motion.div 
                          animate={{ top: ['4%', '96%', '4%'] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                          className="absolute left-1 right-1 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                        />
                      </div>
                      
                      <p className="text-[11px] text-slate-500 text-center font-bold px-4 leading-normal">
                        Quét mã QR bằng ứng dụng <span className="text-[#0066FF]">MISA AMIS</span> di động để đăng nhập nhanh
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom login options */}
              <div className="pt-3 border-t border-slate-100 flex flex-col items-center">
                <div className="flex items-center w-full justify-center gap-2 mb-3">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Hoặc đăng nhập với
                  </span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>

                {/* Social Buttons */}
                <div className="flex items-center gap-3">
                  {/* Google */}
                  <button 
                    onClick={() => onNotification('Đang kết nối tài khoản Google...', 'info')}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                    title="Google"
                  >
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </button>

                  {/* Apple */}
                  <button 
                    onClick={() => onNotification('Đang kết nối tài khoản Apple...', 'info')}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 text-slate-800"
                    title="Apple ID"
                  >
                    <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.13.67-2.85 1.48-.61.69-1.14 1.83-1 2.96 1.09.09 2.14-.55 2.86-1.38z" />
                    </svg>
                  </button>

                  {/* Microsoft */}
                  <button 
                    onClick={() => onNotification('Đang kết nối tài khoản Microsoft...', 'info')}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                    title="Microsoft"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M0 0h11v11H0z" />
                      <path fill="#81bc06" d="M12 0h11v11H12z" />
                      <path fill="#05a6f0" d="M0 12h11v11H0z" />
                      <path fill="#ffba08" d="M12 12h11v11H12z" />
                    </svg>
                  </button>
                </div>

                {/* Highly elegant Sandbox account trigger badge */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleAutofill}
                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-spin-slow" />
                    Dùng tài khoản mẫu
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-[24px] shadow-2xl p-8 z-10 my-auto border border-slate-100"
            id="register-card"
          >
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-[22px] font-extrabold text-[#0F172A] leading-tight">
                  Đăng ký tài khoản dùng thử MISA AMIS
                </h2>
                <div className="border-b border-dashed border-slate-200 mt-4 mb-4" />
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-700">
                {/* Loại hình kinh doanh */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                    <span>Loại hình kinh doanh</span>
                    <span className="text-red-500">*</span>
                  </div>
                  <div className="flex items-center gap-8 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        name="businessType" 
                        checked={businessType === 'enterprise'} 
                        onChange={() => setBusinessType('enterprise')}
                        className="w-4.5 h-4.5 text-[#0066FF] border-slate-300 focus:ring-[#0066FF]"
                      />
                      <span className="text-slate-800 text-xs font-bold">Doanh nghiệp</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        name="businessType" 
                        checked={businessType === 'household'} 
                        onChange={() => setBusinessType('household')}
                        className="w-4.5 h-4.5 text-[#0066FF] border-slate-300 focus:ring-[#0066FF]"
                      />
                      <span className="text-slate-800 text-xs font-bold">Hộ kinh doanh</span>
                    </label>
                  </div>
                </div>

                {/* Lựa chọn sản phẩm theo loại hình */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                    <span>Lựa chọn sản phẩm theo loại hình</span>
                    <span className="text-red-500">*</span>
                  </div>
                  <select 
                    value={selectedProduct} 
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="CukCuk - Quản lý nhà hàng">CukCuk - Quản lý nhà hàng</option>
                    <option value="AMIS Kế toán">AMIS Kế toán</option>
                    <option value="AMIS Quy trình">AMIS Quy trình</option>
                    <option value="AMIS Nhân sự">AMIS Nhân sự</option>
                    <option value="AMIS Văn phòng số">AMIS Văn phòng số</option>
                  </select>
                </div>

                {/* Grid 2 cột cho các thông tin còn lại */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mã số thuế */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <span>Mã số thuế</span>
                      <span className="text-red-500">*</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Nhập mã số thuế"
                      value={taxCode}
                      onChange={(e) => setTaxCode(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  {/* Tên công ty */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <span>Tên công ty</span>
                      <span className="text-red-500">*</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Nhập tên công ty"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Họ và tên */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <span>Họ và tên</span>
                      <span className="text-red-500">*</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Nhập họ và tên"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <span>Email</span>
                      <span className="text-red-500">*</span>
                    </div>
                    <input 
                      type="email" 
                      placeholder="Nhập email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Số điện thoại */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <span>Số điện thoại</span>
                      <span className="text-red-500">*</span>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  {/* Vị trí công việc */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <span>Vị trí công việc</span>
                      <span className="text-red-500">*</span>
                    </div>
                    <select 
                      value={jobPosition} 
                      onChange={(e) => setJobPosition(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium cursor-pointer"
                    >
                      <option value="Quản lý cửa hàng / Nhà hàng">Chọn vị trí công việc</option>
                      <option value="Giám đốc/Chủ doanh nghiệp">Giám đốc/Chủ doanh nghiệp</option>
                      <option value="Kế toán trưởng/Kế toán viên">Kế toán trưởng/Kế toán viên</option>
                      <option value="Quản lý cửa hàng / Nhà hàng">Quản lý cửa hàng / Nhà hàng</option>
                      <option value="Nhân sự / Trưởng phòng">Nhân sự / Trưởng phòng</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                {/* Thêm mã nhân viên */}
                <div className="pt-1">
                  <button 
                    type="button"
                    onClick={() => setIsMisaStaff(!isMisaStaff)}
                    className="text-[#0066FF] hover:underline text-xs font-bold transition-all cursor-pointer text-left"
                  >
                    {isMisaStaff ? "- Ẩn ô nhập mã nhân viên" : "+ Thêm mã nhân viên (Dành cho nhân viên MISA đăng ký khách hàng)"}
                  </button>
                  {isMisaStaff && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <input 
                        type="text" 
                        placeholder="Nhập mã nhân viên MISA"
                        value={misaStaffCode}
                        onChange={(e) => setMisaStaffCode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Đồng ý chính sách */}
                <div className="flex items-start gap-2 pt-1">
                  <input 
                    id="policy-checkbox"
                    type="checkbox" 
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    className="w-4 h-4 text-[#0066FF] border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20 mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="policy-checkbox" className="text-xs text-slate-500 leading-normal cursor-pointer select-none">
                    Tôi đã đọc và xác nhận với <a href="#policy" onClick={(e) => e.preventDefault()} className="text-[#0066FF] hover:underline font-bold">Chính sách bảo vệ dữ liệu cá nhân</a>
                  </label>
                </div>

                {/* Đăng ký Button */}
                <button 
                  type="submit"
                  disabled={isRegistering}
                  className={`w-full text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98] cursor-pointer h-11 ${
                    (taxCode && companyName && fullName && email && phone && agreedToPolicy) 
                      ? 'bg-[#0066FF] hover:bg-[#0055EE]' 
                      : 'bg-[#BCC4D0] cursor-not-allowed'
                  }`}
                >
                  {isRegistering ? (
                    <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Đăng ký"
                  )}
                </button>
              </div>

              {/* Bạn đã sử dụng MISA AMIS? Đăng nhập */}
              <div className="text-center mt-4 pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Bạn đã sử dụng MISA AMIS?{' '}
                  <button 
                    type="button" 
                    onClick={() => setStep('login')} 
                    className="text-[#0066FF] hover:underline font-extrabold cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                </p>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'survey' && (
          <motion.div
            key="survey"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[750px] bg-white rounded-[24px] shadow-2xl border border-slate-200/50 p-8 z-10 my-auto flex flex-col"
            id="onboarding-survey-card"
          >
            {/* Header / Step Tracker */}
            <div className="text-center mb-6 mt-2">
              <h2 className="text-base md:text-lg font-bold text-slate-900">
                {surveyStep === 1 && "Loại hình nhà hàng bạn đang kinh doanh là gì?"}
                {surveyStep === 2 && "Quy trình phục vụ chính của nhà hàng bạn là gì?"}
                {surveyStep === 3 && (
                  <div className="flex flex-col items-center">
                    <span>Bếp/Bar của bạn đang sử dụng thiết bị nào để nhận order?</span>
                    <span className="text-[12px] font-normal text-slate-500 mt-1">(Có thể chọn nhiều thiết bị)</span>
                  </div>
                )}
                {surveyStep === 4 && (
                  <div className="flex flex-col items-center">
                    <span>Nhu cầu của bạn khi sử dụng phần mềm?</span>
                    <span className="text-[12px] font-normal text-slate-500 mt-1">(Có thể chọn nhiều nhu cầu)</span>
                  </div>
                )}
              </h2>
            </div>

            {/* Questions View */}
            <div className="min-h-[280px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {surveyStep === 1 && (
                  <motion.div
                    key="survey-q1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {[
                      { 
                        value: 'Nhà hàng', 
                        label: 'Nhà hàng', 
                        desc: 'Ẩm thực truyền thống, Á - Âu, lẩu nướng, hải sản', 
                        image: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=355ef6a2-cbb7-4690-ac5c-0e8b00e6b3f9.png&preview=true&cId=69e9c29d0426675a2209dee1&tCode=misa&tenantcode=misa' 
                      },
                      { 
                        value: 'Quán ăn', 
                        label: 'Quán ăn', 
                        desc: 'Cơm bình dân, phở, bún, đồ ăn nhanh, quán ăn gia đình', 
                        image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=c886166f-e15c-4776-acde-8a87c728fa09.png&isTemp=true&tenantCode=misa' 
                      },
                      { 
                        value: 'Cafe, Trà sữa', 
                        label: 'Cafe, Trà sữa', 
                        desc: 'Cà phê, trà sữa, sinh tố, bánh ngọt và đồ uống', 
                        image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=c8653efe-6ee6-4323-8444-5b983de9e173.png&isTemp=true&tenantCode=misa' 
                      },
                      { 
                        value: 'Buffet', 
                        label: 'Buffet', 
                        desc: 'Lẩu nướng, buffet tự chọn món ăn không giới hạn', 
                        image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=e4d90d83-ae3f-43d3-8d97-24bc27a1ac49.png&isTemp=true&tenantCode=misa' 
                      },
                      { 
                        value: 'Bar/Pub/Club', 
                        label: 'Bar/Pub/Club', 
                        desc: 'Đồ uống pha chế, cocktail, bia, nhạc sống, giải trí', 
                        image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=2378592f-e6f3-48ff-b172-331a7d7e4853.png&isTemp=true&tenantCode=misa' 
                      },
                      { 
                        value: 'Karaoke, Billiard', 
                        label: 'Karaoke, Billiard', 
                        desc: 'Dịch vụ karaoke, bida kết hợp đồ ăn uống tại chỗ', 
                        image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=185126a7-e780-4612-9ac0-ce2250583616.png&isTemp=true&tenantCode=misa' 
                      },
                      { 
                        value: 'Tiệm bánh', 
                        label: 'Tiệm bánh', 
                        desc: 'Bánh kem, bánh ngọt, bánh mì và các loại đồ uống đi kèm', 
                        image: 'https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=af2a8c53-2daa-4ad8-832b-89f2d103c5c1.png&preview=true&cId=69e9c29d0426675a2209dee1&tCode=misa&tenantcode=misa' 
                      },
                      { 
                        value: 'Căng tin', 
                        label: 'Căng tin', 
                        desc: 'Căng tin trường học, bệnh viện, văn phòng phục vụ nhanh', 
                        image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=6f0511c1-7f20-4b45-93a0-4471d394e870.png&isTemp=true&tenantCode=misa' 
                      }
                    ].map((opt) => {
                      const isSelected = restaurantType === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setRestaurantType(opt.value);
                            if (opt.value === 'Cafe, Trà sữa' || opt.value === 'Cafe, trà sữa') {
                              setOrderingMethod('Khách tự chọn, thanh toán ngay tại quầy');
                            } else {
                              setOrderingMethod('Khách ngồi tại bàn, có nhân viên phục vụ và thanh toán vào cuối bữa');
                            }
                          }}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex gap-3.5 items-center relative overflow-hidden select-none ${
                            isSelected 
                              ? 'border-[#0066FF] bg-blue-50/40 shadow-sm ring-1 ring-blue-500/30' 
                              : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="w-[68px] h-[68px] rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={opt.image} 
                              alt={opt.label} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 pr-3">
                            <h4 className={`text-[14px] font-bold ${isSelected ? 'text-[#0066FF]' : 'text-slate-800'}`}>
                              {opt.label}
                            </h4>
                            <p className="text-[13px] text-slate-500 mt-1 leading-normal font-medium line-clamp-2">
                              {opt.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-3 right-3 bg-[#0066FF] text-white rounded-full p-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {surveyStep === 2 && (
                  <motion.div
                    key="survey-q2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto w-full"
                  >
                    {(() => {
                      const options = [
                        { 
                          value: 'Khách ngồi tại bàn, có nhân viên phục vụ và thanh toán vào cuối bữa', 
                          label: 'Phục vụ tại bàn', 
                          image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=83828f58-1a4a-4830-a7a5-2feb60842b4e.png&isTemp=true&tenantCode=misa' 
                        },
                        { 
                          value: 'Khách tự chọn, thanh toán ngay tại quầy', 
                          label: 'Gọi món và thanh toán tại quầy', 
                          image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=faa3a872-b873-48e6-bf74-8d6b3fb224f2.png&isTemp=true&tenantCode=misa' 
                        }
                      ];
                      if (restaurantType === 'Cafe, Trà sữa' || restaurantType === 'Cafe, trà sữa') {
                        return [options[1], options[0]];
                      }
                      return options;
                    })().map((opt) => {
                      const isSelected = orderingMethod === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setOrderingMethod(opt.value)}
                          className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-center relative ${
                            isSelected 
                              ? 'border-[#0066FF] bg-blue-50/40 shadow-xs ring-1 ring-blue-500/30' 
                              : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="absolute top-3 right-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? 'bg-[#0066FF] border-[#0066FF] text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                          <div className="w-full aspect-[1.5] rounded-xl overflow-hidden mb-4">
                            <img 
                              src={opt.image} 
                              alt={opt.label} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h4 className={`text-sm sm:text-[15px] font-extrabold text-center w-full mt-1 mb-2 ${isSelected ? 'text-[#0066FF]' : 'text-slate-800'}`}>
                            {opt.label}
                          </h4>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {surveyStep === 3 && (
                  <motion.div
                    key="survey-q3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-5 w-full"
                  >
                    {/* Bộ phận Bếp */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-3.5 bg-[#0066FF] rounded-full" />
                        <h3 className="text-[12px] font-extrabold text-slate-800">
                          Bộ phận Bếp:
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { 
                            value: 'Máy in bếp', 
                            label: 'Máy in bếp', 
                            image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=6abae2d5-b978-48eb-bde1-06233100c7ea.png&isTemp=true&tenantCode=misa' 
                          },
                          { 
                            value: 'Tablet/POS/Smart TV', 
                            label: 'Tablet/POS/Smart TV', 
                            image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=21f951ff-7ecf-4f09-8f9a-7b370b89ab51.png&isTemp=true&tenantCode=misa' 
                          },
                          { 
                            value: 'Chỉ phiếu ghi món', 
                            label: 'Chỉ phiếu ghi món', 
                            image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=887ef113-65d5-493f-9ff4-a5ea7c99a8f1.png&isTemp=true&tenantCode=misa' 
                          }
                        ].map((opt) => {
                          const isSelected = bepDevice.split(', ').map(s => s.trim()).includes(opt.value);
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => toggleBepDevice(opt.value)}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer relative select-none min-h-[145px] ${
                                isSelected 
                                  ? 'border-[#0066FF] bg-blue-50/40 shadow-xs ring-1 ring-blue-500/30 text-[#0066FF]' 
                                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <div className="absolute top-2.5 right-2.5">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                                  isSelected ? 'bg-[#0066FF] border-[#0066FF] text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                              </div>

                              <div className="w-[80px] h-[80px] flex items-center justify-center mb-1.5 overflow-hidden">
                                <img 
                                  src={opt.image} 
                                  alt={opt.label} 
                                  className="w-[80px] h-[80px] object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <span className="text-[13px] font-extrabold leading-snug px-1">
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bộ phận Bar */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-3.5 bg-[#0066FF] rounded-full" />
                        <h3 className="text-[12px] font-extrabold text-slate-800">
                          Bộ phận Bar:
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { 
                            value: 'Máy in bar', 
                            label: 'Máy in bar', 
                            image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=6abae2d5-b978-48eb-bde1-06233100c7ea.png&isTemp=true&tenantCode=misa' 
                          },
                          { 
                            value: 'Tablet/POS/Smart TV', 
                            label: 'Tablet/POS/Smart TV', 
                            image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=21f951ff-7ecf-4f09-8f9a-7b370b89ab51.png&isTemp=true&tenantCode=misa' 
                          },
                          { 
                            value: 'Chỉ phiếu ghi món', 
                            label: 'Chỉ phiếu ghi món', 
                            image: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=887ef113-65d5-493f-9ff4-a5ea7c99a8f1.png&isTemp=true&tenantCode=misa' 
                          }
                        ].map((opt) => {
                          const isSelected = barDevice.split(', ').map(s => s.trim()).includes(opt.value);
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => toggleBarDevice(opt.value)}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer relative select-none min-h-[145px] ${
                                isSelected 
                                  ? 'border-[#0066FF] bg-blue-50/40 shadow-xs ring-1 ring-blue-500/30 text-[#0066FF]' 
                                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <div className="absolute top-2.5 right-2.5">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                                  isSelected ? 'bg-[#0066FF] border-[#0066FF] text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                              </div>

                              <div className="w-[80px] h-[80px] flex items-center justify-center mb-1.5 overflow-hidden">
                                <img 
                                  src={opt.image} 
                                  alt={opt.label} 
                                  className="w-[80px] h-[80px] object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <span className="text-[13px] font-extrabold leading-snug px-1">
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {surveyStep === 4 && (
                  <motion.div
                    key="survey-q4"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full"
                  >
                    {[
                      { value: 'Bán hàng', label: 'Bán hàng', desc: 'Order, tính tiền, thanh toán nhanh chóng và chính xác', imageUrl: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=a031f868-0d5d-4673-a7cb-e9e1c2a34107.png&isTemp=true&tenantCode=misa' },
                      { value: 'Xuất hoá đơn', label: 'Xuất hoá đơn', desc: 'Xuất hoá đơn điện tử trực tiếp từ máy tính tiền', imageUrl: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=6ac0af46-ed56-48cb-a749-6a3d3be997a7.png&isTemp=true&tenantCode=misa' },
                      { value: 'Quản lý kho', label: 'Quản lý kho', desc: 'Theo dõi nguyên vật liệu, định lượng tự động', imageUrl: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=995209c3-3cfa-4dce-b34e-929e3e4dcbbf.png&isTemp=true&tenantCode=misa' },
                      { value: 'Báo cáo doanh thu', label: 'Báo cáo doanh thu', desc: 'Biểu đồ phân tích doanh thu, chi phí tức thời', imageUrl: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=6027f14d-7faa-42d9-a48a-7ee866c9043b.png&isTemp=true&tenantCode=misa' },
                      { value: 'Chăm sóc khách hàng', label: 'Chăm sóc khách hàng', desc: 'Tích điểm, khuyến mại và quản lý thẻ thành viên', imageUrl: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=47a98abd-8470-4466-a57b-d19953799593.png&isTemp=true&tenantCode=misa' },
                      { value: 'Kê khai thuế', label: 'Kê khai thuế', desc: 'Đồng bộ dữ liệu bán hàng với cơ quan Thuế', imageUrl: 'https://misajsc.amis.vn/oneai/g1/api/file/v1/files/image?fileType=5003&fileId=301c9583-88e2-43c3-829b-38fbbad4c4de.png&isTemp=true&tenantCode=misa' }
                    ].map((opt) => {
                      const isSelected = userNeeds.includes(opt.value);
                      const toggleNeed = (val: string) => {
                        if (userNeeds.includes(val)) {
                          setUserNeeds(userNeeds.filter((item) => item !== val));
                        } else {
                          setUserNeeds([...userNeeds, val]);
                        }
                      };
                      return (
                        <button
                           key={opt.value}
                           type="button"
                           onClick={() => toggleNeed(opt.value)}
                           className={`flex flex-row items-center justify-start text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden select-none min-h-[110px] w-full gap-4 ${
                             isSelected 
                               ? 'border-[#0066FF] bg-blue-50/40 shadow-xs ring-1 ring-blue-500/30' 
                               : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                           }`}
                        >
                          <div className="w-[88px] h-[88px] flex items-center justify-center flex-shrink-0 select-none rounded-lg p-1">
                            <img
                              src={opt.imageUrl}
                              alt={opt.label}
                              className="w-[80px] h-[80px] object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0 pr-6 flex flex-col justify-center">
                            <h4 className={`text-[14px] font-bold leading-tight mb-1 ${isSelected ? 'text-[#0066FF]' : 'text-slate-800'}`}>
                              {opt.label}
                            </h4>
                            <p className="text-[13px] font-medium text-slate-500 leading-normal">
                              {opt.desc}
                            </p>
                          </div>
                          <div className="absolute top-3 right-3">
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                              isSelected ? 'bg-[#0066FF] border-[#0066FF] text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
 
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-6">
              <div />
              
              <div className="flex items-center gap-2">
                {surveyStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setSurveyStep(surveyStep - 1)}
                    className="border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-4 py-2 rounded-xl text-[13px] font-bold flex items-center justify-center transition-all cursor-pointer select-none h-10"
                  >
                    Quay lại
                  </button>
                )}
                
                {surveyStep < 2 ? (
                  <button
                    type="button"
                    onClick={() => setSurveyStep(surveyStep + 1)}
                    className="bg-[#1E62EC] hover:bg-[#1553D7] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1 px-5 transition-all shadow-md active:scale-[0.98] cursor-pointer h-10 select-none"
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSurveySubmit}
                    className="bg-[#1E62EC] hover:bg-[#1553D7] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 px-6 transition-all shadow-md active:scale-[0.98] cursor-pointer h-10 select-none"
                  >
                    Bắt đầu sử dụng
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏷️ Scenic footer centered at absolute bottom */}
      <div className="w-full text-center py-4 z-10 text-[11px] text-white/75 font-semibold tracking-wide drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.6)]">
        Copyright © 2012 - 2026 MISA JSC
      </div>
    </div>
  );
}
