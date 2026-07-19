import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Check, X, ChevronDown, Globe, ChevronUp, Plus } from 'lucide-react';
import CukCukLogo from './CukCukLogo';

interface AuthScreenProps {
  onLogin: (profile: { name: string; phone: string; shopName: string; isDemo: boolean }) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  // Screens: 'login' | 'register'
  const [activeScreen, setActiveScreen] = useState<'login' | 'register'>('login');
  
  // Login Tab states: 'online' | 'offline'
  const [loginTab, setLoginTab] = useState<'online' | 'offline'>('online');
  
  // Modal State for Restaurant Selection
  const [showResSelect, setShowResSelect] = useState(false);
  const [selectedRes, setSelectedRes] = useState('Mai Cafe Duy Tân');

  // Login Form values (prefilled like the screenshot for perfect high-fidelity)
  const [loginAccount, setLoginAccount] = useState('0362615545');
  const [loginPassword, setLoginPassword] = useState('123456789@ABC');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberAccount, setRememberAccount] = useState(true);

  // Register Form values (prefilled like Screenshot 3)
  const [businessType, setBusinessType] = useState<'enterprise' | 'individual'>('individual');
  const [cccd, setCccd] = useState('001000296854');
  const [taxCode, setTaxCode] = useState('16954325896');
  const [shopName, setShopName] = useState('Mai Cafe');
  const [ownerName, setOwnerName] = useState('Chị Mai');
  const [address, setAddress] = useState('Duy Tân, Cầu Giấy, Hà Nội');
  const [email, setEmail] = useState('maicafe.duytan@gmail.com');
  const [phone, setPhone] = useState('0967868963');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [nvkdCode, setNvkdCode] = useState('');

  const restaurants = [
    'Mai Cafe Duy Tân',
    'Mai Cafe Sân Vườn Cầu Giấy',
    'Mai Cafe Hà Nội'
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAccount || !loginPassword) {
      alert('Vui lòng điền tài khoản và mật khẩu');
      return;
    }
    // Proceed directly to login
    onLogin({
      name: ownerName || 'Nguyễn Linh An',
      phone: loginAccount,
      shopName: selectedRes || 'Aroma Seasonal Coffee Cầu Giấy',
      isDemo: true
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !shopName || !ownerName) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    // Proceed with registration
    onLogin({
      name: ownerName,
      phone: phone,
      shopName: shopName,
      isDemo: true
    });
  };

  return (
    <div id="auth-screen-wrapper" className="h-full w-full relative overflow-hidden font-sans select-none">
      
      {/* Background Images based on Screen */}
      <AnimatePresence mode="wait">
        {activeScreen === 'login' ? (
          <motion.div
            key="login-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 overflow-hidden"
            style={{ backgroundImage: `url("https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=c595569e-041d-499f-8d09-609dc2c72c91.png&preview=true&cId=69ba1fca7a0ff0333a05fc7e&tCode=misa&tenantcode=misa")` }}
          />
        ) : (
          <motion.div
            key="register-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 overflow-hidden"
            style={{ backgroundImage: `url("https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=c595569e-041d-499f-8d09-609dc2c72c91.png&preview=true&cId=69ba1fca7a0ff0333a05fc7e&tCode=misa&tenantcode=misa")` }}
          />
        )}
      </AnimatePresence>

      {/* GLOBAL HEADER (For Login Screen context) */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 pointer-events-none">
        {/* Left: Brand logo */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-slate-100 shrink-0">
            {/* New requested SVG logo */}
            <CukCukLogo size={24} fillColor="#076EFF" />
          </div>
          <svg width="90" height="11" viewBox="0 0 90 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm shrink-0">
            <path d="M23.1107 7.7791C23.1417 7.02101 22.8848 6.28056 22.3951 5.71693C21.8278 5.1413 21.1369 4.71368 20.3791 4.46931L19.76 4.25426C19.3347 4.12855 18.9341 3.92593 18.5767 3.65574C18.4778 3.57691 18.3978 3.47547 18.3429 3.35931C18.2879 3.24315 18.2596 3.1154 18.2601 2.98602C18.2584 2.85752 18.2883 2.73069 18.3469 2.61747C18.4055 2.50426 18.491 2.40839 18.5952 2.33889C18.8651 2.15174 19.1858 2.05932 19.5101 2.07523C19.828 2.06298 20.1399 2.16729 20.391 2.36982C20.6156 2.56064 20.7847 2.81237 20.8795 3.09699L20.9268 3.24429L22.8201 2.41745L22.7785 2.2893C22.5472 1.58831 22.0994 0.986077 21.5045 0.576021C20.9096 0.165966 20.201 -0.0289867 19.4884 0.021407C18.8958 0.0147249 18.3096 0.149102 17.7749 0.414203C17.2897 0.655423 16.8797 1.0333 16.5916 1.5047C16.311 1.9623 16.1651 2.49481 16.1718 3.03708C16.1629 3.38458 16.2217 3.73037 16.3447 4.05374C16.4676 4.37712 16.6522 4.67143 16.8874 4.91906C17.3564 5.40974 17.9289 5.78069 18.5597 6.00269L19.1651 6.2305C19.6848 6.40583 20.1765 6.66051 20.6239 6.98614C20.7421 7.08415 20.8371 7.20899 20.9015 7.35106C20.9659 7.49313 20.998 7.64863 20.9954 7.80561V7.81984C21.0017 7.97115 20.9701 8.12156 20.9038 8.25647C20.8374 8.39137 20.7385 8.50618 20.6168 8.58973C20.3275 8.79502 19.983 8.89988 19.6327 8.88923C19.4232 8.89643 19.2144 8.86048 19.0183 8.78345C18.8223 8.70642 18.6429 8.58985 18.4906 8.44046C18.163 8.10157 17.9335 7.67432 17.8279 7.20708L17.7863 7.05046L15.751 7.86943L15.7855 7.99758C16.0163 8.8807 16.5218 9.66002 17.2235 10.2144C17.8924 10.7225 18.6995 10.9976 19.5286 11H19.5906C20.1604 10.9992 20.7241 10.8779 21.2473 10.6435C21.777 10.4148 22.2362 10.04 22.5754 9.55993C22.9358 9.04501 23.1221 8.42105 23.1055 7.78498L23.1107 7.7791Z" fill="#245FDF"/>
            <path d="M52.2745 9.99546V10.838H54.2426V3.17851H52.1657V7.04017C52.1842 7.54357 52.0337 8.03803 51.7397 8.43901C51.6068 8.61392 51.4359 8.75363 51.2409 8.84667C51.0459 8.93971 50.8324 8.98341 50.6179 8.97419C50.4661 8.98144 50.3147 8.95163 50.1761 8.88716C50.0374 8.82269 49.9152 8.72536 49.8194 8.603C49.5958 8.29249 49.4861 7.90959 49.5098 7.52282V3.17065H47.4324V7.75309C47.3855 8.60346 47.6318 9.4434 48.1273 10.1226C48.3803 10.4169 48.6944 10.6475 49.0461 10.7971C49.3977 10.9468 49.7776 11.0114 50.1569 10.9863H50.1914C50.6407 10.9842 51.0835 10.8743 51.485 10.6652C51.7945 10.5074 52.0648 10.2779 52.275 9.99448L52.2745 9.99546Z" fill="#245FDF"/>
            <path d="M46.468 9.06893L46.5504 8.97074L45.0357 7.4737L44.9411 7.59497C44.6504 7.99693 44.2732 8.32282 43.8395 8.54661C43.4058 8.77039 42.9277 8.88587 42.4433 8.88383C41.8806 8.89271 41.3256 8.74775 40.834 8.46354C40.3545 8.18933 39.9604 7.77881 39.698 7.28024C39.414 6.73584 39.2713 6.12419 39.2839 5.50531C39.2706 4.88563 39.4154 4.27332 39.7037 3.73037C39.9661 3.23182 40.3602 2.82131 40.8397 2.54708C41.3331 2.26764 41.8869 2.123 42.449 2.12679C42.8823 2.1214 43.3112 2.21801 43.7033 2.40936C44.0955 2.60071 44.4406 2.88181 44.7129 3.23152L44.8076 3.34543L46.3118 1.82728L46.2233 1.72908C45.7497 1.17408 45.1652 0.732818 44.5104 0.436035C43.8556 0.139251 43.1463 -0.00592657 42.432 0.0106076H42.3771C41.4547 0.00989686 40.5483 0.260656 39.7487 0.737766C38.9504 1.20958 38.2877 1.89361 37.8289 2.71941C37.3619 3.5653 37.1198 4.52466 37.1274 5.49941C37.1155 6.47471 37.3579 7.43523 37.8289 8.27942C38.285 9.10481 38.9453 9.78891 39.7416 10.2611C40.5585 10.7451 41.4845 10.996 42.4253 10.9882H42.4874C43.2465 10.987 43.9968 10.8197 44.6893 10.4972C45.3805 10.17 45.9902 9.68292 46.4718 9.07335L46.468 9.06893Z" fill="#245FDF"/>
            <path d="M70.9899 7.58564C70.6993 7.98759 70.3221 8.31349 69.8884 8.53727C69.4547 8.76106 68.9765 8.87654 68.4922 8.87449C67.9294 8.88339 67.3744 8.73844 66.8829 8.4542C66.4034 8.17997 66.0093 7.76946 65.7469 7.27091C65.4628 6.72652 65.3201 6.11486 65.3327 5.49597C65.3194 4.87628 65.4643 4.26396 65.7526 3.72103C66.0169 3.22402 66.4105 2.81402 66.8885 2.53774C67.3819 2.2583 67.9358 2.11366 68.4979 2.11745C68.9312 2.11202 69.3601 2.20862 69.7522 2.39998C70.1443 2.59133 70.4895 2.87245 70.7618 3.22218L70.8565 3.33658L72.3635 1.81795L72.275 1.71974C71.8014 1.16474 71.2169 0.72348 70.5621 0.426696C69.9073 0.129913 69.198 -0.0152649 68.4837 0.00126926C67.5428 -0.00656353 66.6168 0.244339 65.7999 0.728431C65.0016 1.20029 64.3389 1.8843 63.8801 2.71008C63.4129 3.5559 63.1706 4.51528 63.1781 5.49008C63.1664 6.46543 63.409 7.42593 63.8801 8.27008C64.337 9.09739 65.0001 9.78189 65.7999 10.2517C66.5994 10.7288 67.5059 10.9796 68.4283 10.9789H68.5466C69.3057 10.9777 70.056 10.8104 70.7485 10.4879C71.4376 10.1567 72.0447 9.66669 72.5235 9.05517L72.6063 8.95698L71.0855 7.45994L70.9899 7.58564Z" fill="#245FDF"/>
            <path d="M78.2213 7.04602C78.2399 7.54942 78.0894 8.04389 77.7953 8.44486C77.6626 8.6197 77.4917 8.75937 77.2968 8.85241C77.1018 8.94544 76.8885 8.98918 76.6741 8.98004C76.5223 8.98728 76.3709 8.95747 76.2322 8.893C76.0936 8.82854 75.9714 8.73121 75.8756 8.60885C75.6518 8.29842 75.5419 7.9155 75.5655 7.52867V3.17749H73.4881V7.75992C73.4412 8.61029 73.6875 9.45023 74.1829 10.1295C74.4359 10.4237 74.7502 10.6543 75.1018 10.804C75.4534 10.9536 75.8332 11.0183 76.2125 10.9931H76.24C76.6893 10.991 77.1321 10.8811 77.5336 10.672C77.8447 10.5097 78.1175 10.2781 78.3326 9.99394V10.7648H80.3002V3.17749H78.2213V7.04602Z" fill="#245FDF"/>
            <path d="M2.10536 5.57602L2.02964 4.44281L4.38963 10.7643H6.02735L8.37362 4.44919L8.2979 5.56816V10.7643H10.4174V0.244324H7.78196L5.20186 7.32248L2.62838 0.244324H0V10.7648H2.10536V5.57602Z" fill="#245FDF"/>
            <path d="M29.5924 0.244324H27.2669L23.4756 10.7648H25.8219L26.6478 8.32017H30.2262L31.0517 10.7648H33.398L29.5924 0.244324ZM28.436 2.91041L28.7201 3.87964L29.5247 6.26046H27.3356L28.1544 3.87276L28.436 2.91041Z" fill="#245FDF"/>
            <path d="M14.5254 0.244324H12.3926V10.7648H14.5254V0.244324Z" fill="#245FDF"/>
            <path d="M62.9745 3.19028H60.2292L57.8152 5.72086V0.244324H55.7373V10.7648H57.8152V8.41985L58.5584 7.66421L60.4223 10.7638H62.975L60.0242 6.16717L62.9745 3.19028Z" fill="#245FDF"/>
            <path d="M89.0369 3.17655H86.2917L83.8777 5.70713V0.230591H81.7998V10.7511H83.8777V8.40611L84.6208 7.65047L86.4848 10.7501H89.0375L86.0853 6.15294L89.0369 3.17655Z" fill="#245FDF"/>
          </svg>
        </div>

        {/* Right: Language dropdown + Menu Hamburger */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 px-3 py-1.5 rounded-full flex items-center gap-2 text-slate-800 text-xs font-bold cursor-pointer hover:bg-white transition-all shadow-sm">
            <span className="w-5 h-4 bg-[#DA251D] flex items-center justify-center rounded-[2px] overflow-hidden relative">
              {/* Vietnamese Flag */}
              <span className="absolute w-2.5 h-2.5 bg-[#FFFF00] clip-star" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
            </span>
            <span>Tiếng Việt</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
          </div>
          
          <button className="w-9 h-9 bg-white/80 backdrop-blur-md border border-slate-200/80 hover:bg-white text-slate-800 rounded-full flex items-center justify-center transition-all shadow-sm">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H18M0 6H18M0 11H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* SCREEN CONTAINER */}
      <div className="absolute inset-0 flex items-center justify-center p-4 z-5 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* LOGIN CONTAINER */}
          {activeScreen === 'login' && (
            <motion.div
              key="login-box"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-[32px] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(7,110,255,0.14),0_0_0_1px_rgba(7,110,255,0.03)] overflow-hidden p-8 md:p-10 flex flex-col gap-6"
            >
              {/* Box Title */}
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Đăng nhập</h2>
              </div>

              {/* Form elements */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tài khoản</label>
                  <input 
                    required
                    type="text"
                    placeholder="Nhập số điện thoại/tài khoản"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:bg-white focus:outline-none focus:border-[#076EFF] focus:ring-2 focus:ring-[#076EFF]/15 text-[13px] font-normal text-slate-800 transition-all shadow-sm"
                    value={loginAccount}
                    onChange={(e) => setLoginAccount(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
                  <div className="relative">
                    <input 
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mật khẩu của bạn"
                      className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:bg-white focus:outline-none focus:border-[#076EFF] focus:ring-2 focus:ring-[#076EFF]/15 text-[13px] font-normal text-slate-800 transition-all shadow-sm"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot Row */}
                <div className="flex items-center justify-between text-xs font-bold">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={rememberAccount}
                      onChange={(e) => setRememberAccount(e.target.checked)}
                      className="w-4 h-4 rounded text-[#076EFF] border-slate-300 focus:ring-[#076EFF]"
                    />
                    <span>Ghi nhớ tài khoản</span>
                  </label>
                  <span className="text-[#076EFF] hover:underline cursor-pointer">Quên mật khẩu?</span>
                </div>

                {/* Login Action Button */}
                <button
                  type="submit"
                  className="w-full h-11 bg-[#076EFF] hover:bg-[#0057D6] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/15 active:scale-[0.98] transition-all uppercase tracking-wider"
                >
                  Đăng nhập
                </button>
              </form>

              {/* Switch to register */}
              <div className="text-center text-xs font-semibold text-slate-400 mt-2">
                <span>Bạn chưa có tài khoản? </span>
                <span 
                  onClick={() => setActiveScreen('register')}
                  className="text-[#076EFF] font-bold cursor-pointer hover:underline"
                >
                  Đăng ký dùng thử
                </span>
              </div>
            </motion.div>
          )}

          {/* REGISTER CONTAINER (MISA PLATFORM TRIAL REGISTRATION) */}
          {activeScreen === 'register' && (
            <motion.div
              key="register-box"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-[32px] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(7,110,255,0.14),0_0_0_1px_rgba(7,110,255,0.03)] overflow-y-auto p-6 md:p-8 flex flex-col gap-6"
            >
              {/* Form Title */}
              <div className="text-center space-y-1.5">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                  Đăng ký tài khoản dùng thử Misa Platform
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  Chỉ mất 1 phút để khởi tạo hệ thống quản lý nhà hàng chuyên nghiệp hoàn toàn miễn phí
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                
                {/* Section 1: Business type & Product selection */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <span className="font-bold text-slate-700">Mô hình kinh doanh:</span>
                    
                    <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-600">
                      <input 
                        type="radio" 
                        name="business_type"
                        checked={businessType === 'enterprise'}
                        onChange={() => setBusinessType('enterprise')}
                        className="w-4.5 h-4.5 text-[#076EFF] border-slate-300 focus:ring-[#076EFF]"
                      />
                      <span>Doanh nghiệp</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-600">
                      <input 
                        type="radio" 
                        name="business_type"
                        checked={businessType === 'individual'}
                        onChange={() => setBusinessType('individual')}
                        className="w-4.5 h-4.5 text-[#076EFF] border-slate-300 focus:ring-[#076EFF]"
                      />
                      <span>Hộ kinh doanh cá thể</span>
                    </label>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-200/60">
                    <label className="text-xs font-bold text-slate-600 block">
                      Giải pháp phần mềm đăng ký <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#076EFF] animate-pulse" />
                        <span className="text-xs font-bold text-slate-700">CukCuk - Quản lý nhà hàng, quán ăn, cafe</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Grouped Mandatory Fields (Bắt buộc) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-1.5 h-4 bg-[#076EFF] rounded-full" />
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-wider">
                      Thông tin bắt buộc đăng ký
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone Number - Crucial Login Credential at the top */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700">
                          Số điện thoại liên hệ <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-normal">Dùng làm tài khoản đăng nhập</span>
                      </div>
                      <input 
                        required
                        type="tel"
                        placeholder="Nhập số điện thoại để đăng nhập"
                        className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-[13px] font-semibold text-slate-800 shadow-sm"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    {/* Owner's Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Họ và tên chủ quán / đại diện <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required
                        type="text"
                        placeholder="Nhập họ và tên đầy đủ"
                        className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-[13px] font-semibold text-slate-800 shadow-sm"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                      />
                    </div>

                    {/* Shop/Business Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {businessType === 'enterprise' ? 'Tên doanh nghiệp' : 'Tên hộ kinh doanh / tên quán'} <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required
                        type="text"
                        placeholder={businessType === 'enterprise' ? 'Nhập tên doanh nghiệp của bạn' : 'Nhập tên cửa hàng, quán ăn của bạn'}
                        className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-[13px] font-semibold text-slate-800 shadow-sm"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                      />
                    </div>

                    {/* ID Card (CCCD) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Số CCCD / CMND người đại diện <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required
                        type="text"
                        placeholder="Nhập số căn cước công dân"
                        className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-[13px] font-semibold text-slate-800 shadow-sm"
                        value={cccd}
                        onChange={(e) => setCccd(e.target.value)}
                      />
                    </div>

                    {/* Address - Spans full width */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700">
                        Địa chỉ kinh doanh <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required
                        type="text"
                        placeholder="Nhập số nhà, tên đường, quận/huyện, tỉnh/thành phố"
                        className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-[13px] font-semibold text-slate-800 shadow-sm"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Dynamic Optional Fields Group (Không bắt buộc - Show More button style) */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="w-full h-11 px-4 flex items-center justify-between text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className={`w-4 h-4 text-[#076EFF] transition-transform duration-300 ${showOptionalFields ? 'rotate-45' : ''}`} />
                      <span>Thông tin bổ sung (Không bắt buộc: Mã số thuế, Email, Nhân viên hỗ trợ)</span>
                    </div>
                    {showOptionalFields ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showOptionalFields && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border-t border-slate-150 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Mã số thuế</label>
                            <input 
                              type="text"
                              placeholder="Nhập mã số thuế (nếu có)"
                              className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-[13px] font-semibold text-slate-800 shadow-sm"
                              value={taxCode}
                              onChange={(e) => setTaxCode(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Địa chỉ email</label>
                            <input 
                              type="email"
                              placeholder="Nhập email để nhận thông báo, hóa đơn"
                              className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-[13px] font-semibold text-slate-800 shadow-sm"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5 md:col-span-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold text-slate-700">Mã nhân viên kinh doanh hỗ trợ</label>
                              <span className="text-[10px] text-slate-400 font-normal">Dành cho nhân viên Misa hỗ trợ đăng ký</span>
                            </div>
                            <input 
                              type="text"
                              placeholder="Ví dụ: MISA12345"
                              className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#076EFF] text-[13px] font-semibold text-slate-800 shadow-sm"
                              value={nvkdCode}
                              onChange={(e) => setNvkdCode(e.target.value)}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Consent Terms */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input 
                    type="checkbox"
                    id="reg_terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4.5 h-4.5 text-[#076EFF] border-slate-300 rounded focus:ring-[#076EFF]"
                  />
                  <label htmlFor="reg_terms" className="text-xs text-slate-500 font-medium leading-normal">
                    Tôi đồng ý với các điều khoản dịch vụ trong <span className="text-[#076EFF] font-bold cursor-pointer hover:underline">Chính sách bảo mật thông tin</span> của Misa
                  </label>
                </div>

                {/* Submit Register Button - standard-case capitalization */}
                <button
                  type="submit"
                  disabled={!agreeTerms}
                  className="w-full h-11 bg-[#076EFF] hover:bg-[#0057D6] disabled:opacity-50 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2"
                >
                  Đăng ký dùng thử miễn phí
                </button>
              </form>

              {/* Switch back to login */}
              <div className="text-center text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
                <span>Bạn đã có tài khoản Misa Platform? </span>
                <span 
                  onClick={() => setActiveScreen('login')}
                  className="text-[#076EFF] font-bold cursor-pointer hover:underline"
                >
                  Đăng nhập ngay
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
