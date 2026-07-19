import React from 'react';

interface AppIconProps {
  type: 'wave' | 'color-circle' | 'sme-circle' | 'diamond' | 'sms' | 'ahamove' | 'grab' | 'shopeefood' | 'api' | 'hotel';
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ type, size = 56 }) => {
  return (
    <div style={{ width: size, height: size }} className="flex-shrink-0 select-none">
      {type === 'wave' && (
        <div className="w-full h-full rounded-2xl bg-[#1E62EC] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-white" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
            <path d="M20,65 C35,45 45,45 60,65 C70,75 80,75 90,65" />
            <path d="M10,50 C25,30 35,30 50,50 C60,60 70,60 80,50" strokeWidth="8" />
            <path d="M25,35 C35,20 45,20 55,35 C65,45 75,45 85,35" strokeWidth="6" />
          </svg>
        </div>
      )}

      {type === 'color-circle' && (
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 A40,40 0 0,1 90,50 L70,50 A20,20 0 0,0 50,30 Z" fill="#22C55E" />
            <path d="M90,50 A40,40 0 0,1 50,90 L50,70 A20,20 0 0,0 70,50 Z" fill="#3B82F6" />
            <path d="M50,90 A40,40 0 0,1 10,50 L30,50 A20,20 0 0,0 50,70 Z" fill="#F97316" />
            <path d="M10,50 A40,40 0 0,1 50,10 L50,30 A20,20 0 0,0 30,50 Z" fill="#EF4444" />
            <circle cx="50" cy="50" r="10" fill="white" />
          </svg>
        </div>
      )}

      {type === 'sme-circle' && (
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="1" fill="none" />
            <path d="M50,10 A40,40 0 0,1 85,30 L70,40 A20,20 0 0,0 50,30 Z" fill="#0EA5E9" />
            <path d="M85,30 A40,40 0 0,1 90,65 L70,58 A20,20 0 0,0 70,40 Z" fill="#10B981" />
            <path d="M90,65 A40,40 0 0,1 55,90 L53,70 A20,20 0 0,0 70,58 Z" fill="#F59E0B" />
            <path d="M55,90 A40,40 0 0,1 15,60 L30,55 A20,20 0 0,0 53,70 Z" fill="#EF4444" />
            <path d="M15,60 A40,40 0 0,1 50,10 L50,30 A20,20 0 0,0 30,55 Z" fill="#6366F1" />
          </svg>
        </div>
      )}

      {type === 'diamond' && (
        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] rotate-45">
            <path d="M50,5 L95,50 L50,50 Z" fill="#F97316" />
            <path d="M95,50 L50,95 L50,50 Z" fill="#EF4444" />
            <path d="M50,95 L5,50 L50,50 Z" fill="#22C55E" />
            <path d="M5,50 L50,5 L50,50 Z" fill="#3B82F6" />
          </svg>
        </div>
      )}

      {type === 'sms' && (
        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center p-1 relative">
          <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] text-[#FBBF24]" fill="currentColor">
            <path d="M10,25 C10,21 13,18 17,18 L83,18 C87,18 90,21 90,25 L90,75 C90,79 87,82 83,82 L17,82 C13,82 10,79 10,75 Z" />
            <path d="M10,28 L50,55 L90,28 L90,75 C90,79 87,82 83,82 L17,82 C13,82 10,79 10,75 Z" fill="#F59E0B" />
            <path d="M10,25 L50,52 L90,25" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
          <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-red-500 rounded-full border border-white" />
        </div>
      )}

      {type === 'ahamove' && (
        <div className="w-full h-full rounded-full bg-[#181347] flex items-center justify-center p-1.5">
          <div className="flex flex-col items-center justify-center text-white font-bold leading-tight">
            <span className="text-[10px] tracking-wider text-[#FF5B00] uppercase font-black">Aha</span>
            <span className="text-[7px] tracking-tight -mt-1 font-semibold opacity-90">Move</span>
          </div>
        </div>
      )}

      {type === 'grab' && (
        <div className="w-full h-full rounded-full bg-[#00B14F] flex items-center justify-center p-1">
          <svg viewBox="0 0 100 100" className="w-[65%] h-[65%] text-white fill-current">
            <path d="M75,35 C75,25 65,20 50,20 C32,20 20,30 20,48 C20,68 35,78 52,78 C68,78 78,68 78,52 L62,52 C62,60 55,64 48,64 C40,64 34,58 34,48 C34,38 40,34 48,34 C55,34 60,38 61,42 L74,38 C75,37 75,36 75,35 Z" />
            <circle cx="65" cy="46" r="6" />
          </svg>
        </div>
      )}

      {type === ('shopeefood' as any) && (
        <div className="w-full h-full rounded-full bg-[#FF4500] flex items-center justify-center p-1">
          <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-white" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15,40 L85,40 L75,80 L25,80 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M30,40 C30,25 40,15 50,15 C60,15 70,25 70,40" />
            <circle cx="50" cy="55" r="8" fill="currentColor" />
          </svg>
        </div>
      )}

      {type === 'api' && (
        <div className="w-full h-full rounded-2xl bg-slate-50 flex items-center justify-center p-1">
          <svg viewBox="0 0 100 100" className="w-[75%] h-[75%] text-blue-600" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="20" y="15" width="60" height="25" rx="5" fill="#E0F2FE" />
            <rect x="20" y="55" width="60" height="25" rx="5" />
            <circle cx="35" cy="27" r="3" fill="currentColor" />
            <circle cx="35" cy="67" r="3" fill="currentColor" />
            <path d="M50,40 L50,55" strokeWidth="6" />
            <path d="M50,47 L65,47" strokeWidth="4" />
          </svg>
        </div>
      )}

      {type === 'hotel' && (
        <div className="w-full h-full rounded-2xl bg-[#E0F2FE] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-sky-600" fill="currentColor">
            <path d="M25,35 L75,35 L75,90 L25,90 Z" fillOpacity="0.4" stroke="currentColor" strokeWidth="4" />
            <path d="M15,90 L85,90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <rect x="42" y="65" width="16" height="25" rx="2" fill="#0369A1" />
            {/* Stars */}
            <path d="M25,20 L27,24 L31,24 L28,27 L29,31 L25,29 L21,31 L22,27 L19,24 L23,24 Z" fill="#F59E0B" />
            <path d="M37,14 L39,18 L43,18 L40,21 L41,25 L37,23 L33,25 L34,21 L31,18 L35,18 Z" fill="#F59E0B" />
            <path d="M50,10 L52,14 L56,14 L53,17 L54,21 L50,19 L46,21 L47,17 L44,14 L48,14 Z" fill="#F59E0B" />
            <path d="M63,14 L65,18 L69,18 L66,21 L67,25 L63,23 L59,25 L60,21 L57,18 L61,18 Z" fill="#F59E0B" />
            <path d="M75,20 L77,24 L81,24 L78,27 L79,31 L75,29 L71,31 L72,27 L69,24 L73,24 Z" fill="#F59E0B" />
          </svg>
        </div>
      )}
    </div>
  );
};
