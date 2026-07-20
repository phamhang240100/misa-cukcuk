import React, {useEffect} from 'react';
import {AlertTriangle, Check, Info, X, XCircle} from 'lucide-react';
import type {GrabExpressStatus, ToastKind, ToastMsg} from '../types';
import {GE_STATUS} from '../constants';

// ---------------------------------------------------------------------------
// Grab Express brand mark (green Grab bubble + Express wordmark)
// ---------------------------------------------------------------------------
export const GrabExpressMark: React.FC<{size?: number; showText?: boolean}> = ({
  size = 28,
  showText = true,
}) => (
  <div className="flex items-center gap-2">
    <div
      className="flex items-center justify-center rounded-[10px] bg-grab text-white font-black shrink-0"
      style={{width: size, height: size, fontSize: size * 0.5}}
    >
      G
    </div>
    {showText && (
      <div className="leading-tight">
        <div className="font-bold text-text-primary" style={{fontSize: 14}}>
          Grab Express
        </div>
      </div>
    )}
  </div>
);

// Logo Grab Express — icon vuông bo góc xanh (không phải hình tròn), 2 dòng chữ
// xếp chồng: "Grab" (rỗng viền trắng) / "Express" (đặc trắng). Khớp logo thật.
export const GrabExpressLogo: React.FC<{size?: number; withText?: boolean; className?: string}> = ({
  size = 56,
  className = '',
}) => (
  <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label="Grab Express">
    <rect x="0" y="0" width="120" height="120" rx="26" fill="#00B14F" />
    <text
      x="60"
      y="54"
      textAnchor="middle"
      fontFamily="Inter, ui-sans-serif, sans-serif"
      fontSize="30"
      fontWeight="800"
      letterSpacing="-0.5"
      dominantBaseline="middle"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
    >
      Grab
    </text>
    <text
      x="60"
      y="84"
      textAnchor="middle"
      fontFamily="Inter, ui-sans-serif, sans-serif"
      fontSize="22"
      fontWeight="800"
      letterSpacing="-0.5"
      dominantBaseline="middle"
      fill="#fff"
    >
      Express
    </text>
  </svg>
);

export const GrabExpressChip: React.FC<{className?: string}> = ({className = ''}) => (
  <span
    className={`inline-flex items-center gap-1 rounded-md bg-grab-light px-1.5 py-0.5 text-[11px] font-semibold text-grab ${className}`}
  >
    <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-grab text-[9px] font-black text-white">
      G
    </span>
    Grab Express
  </span>
);

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'grab';
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: BtnVariant;
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
  }
> = ({variant = 'secondary', size = 'md', icon, className = '', children, ...rest}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
  const sizes = {sm: 'h-8 px-3 text-[13px]', md: 'h-10 px-4 text-[13px]'};
  const variants: Record<BtnVariant, string> = {
    primary: 'bg-brand text-white hover:bg-brand-hover',
    grab: 'bg-grab text-white hover:bg-grab-hover',
    secondary:
      'bg-white text-text-primary border border-border-neutral hover:bg-gray-50',
    ghost: 'text-text-secondary hover:bg-gray-100',
    danger: 'bg-white text-danger border border-danger/40 hover:bg-red-50',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  );
};

// ---------------------------------------------------------------------------
// Modal shell
// ---------------------------------------------------------------------------
export const Modal: React.FC<{
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  width?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  contained?: boolean;
}> = ({open, onClose, title, width = 520, children, footer, closeOnBackdrop = true, contained = false}) => {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={`${contained ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center p-4`}>
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={() => closeOnBackdrop && onClose?.()}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full rounded-2xl bg-white shadow-2xl animate-scale-up max-h-[90vh] flex flex-col"
        style={{maxWidth: width}}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border-neutral-light px-5 py-4">
            <h3 className="text-[16px] font-semibold text-text-primary">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-icon-neutral hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-border-neutral-light px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Confirm dialog (Có / Không) — dùng cho cảnh báo hủy kết nối, v.v.
// ---------------------------------------------------------------------------
export const ConfirmDialog: React.FC<{
  open: boolean;
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: 'danger' | 'warning';
  contained?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  open,
  title = 'Xác nhận',
  message,
  confirmText = 'Có',
  cancelText = 'Không',
  tone = 'warning',
  contained = false,
  onConfirm,
  onCancel,
}) => (
  <Modal open={open} onClose={onCancel} width={440} closeOnBackdrop={false} contained={contained}>
    <div className="flex gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          tone === 'danger' ? 'bg-red-50 text-danger' : 'bg-amber-50 text-warning'
        }`}
      >
        <AlertTriangle size={20} />
      </div>
      <div className="pt-0.5">
        <div className="mb-1 text-[15px] font-semibold text-text-primary">{title}</div>
        <p className="text-[13px] leading-relaxed text-text-secondary">{message}</p>
      </div>
    </div>
    <div className="mt-5 flex justify-end gap-3">
      <Button variant="secondary" onClick={onCancel} className="min-w-[96px]">
        {cancelText}
      </Button>
      <Button
        variant={tone === 'danger' ? 'grab' : 'primary'}
        onClick={onConfirm}
        className="min-w-[96px]"
      >
        {confirmText}
      </Button>
    </div>
  </Modal>
);

// ---------------------------------------------------------------------------
// Alert popup (1 nút, hoặc 2 nút tuỳ chọn) — dùng cho cảnh báo tỉnh/TP, COD...
// ---------------------------------------------------------------------------
export const AlertPopup: React.FC<{
  open: boolean;
  title?: string;
  message: React.ReactNode;
  primaryText?: string;
  secondaryText?: string;
  contained?: boolean;
  onPrimary?: () => void;
  onClose: () => void;
}> = ({open, title = 'Thông báo', message, primaryText, secondaryText = 'Đóng', contained = false, onPrimary, onClose}) => (
  <Modal open={open} onClose={onClose} width={460} closeOnBackdrop={false} contained={contained}>
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-warning">
        <AlertTriangle size={20} />
      </div>
      <div className="pt-0.5">
        <div className="mb-1 text-[15px] font-semibold text-text-primary">{title}</div>
        <p className="text-[13px] leading-relaxed text-text-secondary">{message}</p>
      </div>
    </div>
    <div className="mt-5 flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose} className="min-w-[96px]">
        {secondaryText}
      </Button>
      {primaryText && (
        <Button variant="primary" onClick={onPrimary} className="min-w-[140px]">
          {primaryText}
        </Button>
      )}
    </div>
  </Modal>
);

// ---------------------------------------------------------------------------
// Form field with inline error
// ---------------------------------------------------------------------------
export const Field: React.FC<{
  label: React.ReactNode;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({label, required, error, hint, children, className = ''}) => (
  <div className={className}>
    <label className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-text-primary">
      {label}
      {required && <span className="text-danger">*</span>}
    </label>
    {children}
    {hint && !error && <div className="mt-1 text-[12px] text-text-hint">{hint}</div>}
    {error && (
      <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-danger">
        <XCircle size={13} />
        {error}
      </div>
    )}
  </div>
);

export const inputCls = (hasError?: boolean) =>
  `h-10 w-full rounded-lg border bg-white px-3 text-[13px] text-text-primary outline-none transition-colors placeholder:text-text-hint focus:border-brand focus:ring-2 focus:ring-brand/15 ${
    hasError ? 'border-danger ring-2 ring-danger/15' : 'border-border-neutral'
  }`;

// ---------------------------------------------------------------------------
// Info tooltip (ghi chú chữ i)
// ---------------------------------------------------------------------------
export const InfoTip: React.FC<{text: string}> = ({text}) => (
  <span className="group relative inline-flex">
    <Info size={14} className="cursor-help text-icon-neutral" />
    <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-[12px] leading-relaxed text-white opacity-0 transition-opacity group-hover:opacity-100">
      {text}
    </span>
  </span>
);

// ---------------------------------------------------------------------------
// GE status pill
// ---------------------------------------------------------------------------
export const GeStatusPill: React.FC<{status?: GrabExpressStatus; className?: string}> = ({
  status,
  className = '',
}) => {
  if (!status) return <span className="text-text-hint">—</span>;
  const s = GE_STATUS[status];
  const tone = {
    progress: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    danger: 'bg-red-50 text-red-700',
    return: 'bg-orange-50 text-orange-700',
  }[s.tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold ${tone} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          s.tone === 'progress'
            ? 'bg-blue-500'
            : s.tone === 'success'
            ? 'bg-green-500'
            : s.tone === 'return'
            ? 'bg-orange-500'
            : 'bg-red-500'
        }`}
      />
      {s.label}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Toast host
// ---------------------------------------------------------------------------
export const ToastHost: React.FC<{toasts: ToastMsg[]; onDismiss: (id: number) => void}> = ({
  toasts,
  onDismiss,
}) => {
  const icon: Record<ToastKind, React.ReactNode> = {
    success: <Check size={16} className="text-white" />,
    error: <XCircle size={16} className="text-white" />,
    info: <Info size={16} className="text-white" />,
    warning: <AlertTriangle size={16} className="text-white" />,
  };
  const bg: Record<ToastKind, string> = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-brand',
    warning: 'bg-warning',
  };
  return (
    <div className="fixed right-5 top-5 z-[60] flex w-[360px] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast-in flex items-start gap-3 rounded-xl border border-border-neutral-light bg-white p-3 shadow-lg"
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${bg[t.kind]}`}
          >
            {icon[t.kind]}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="text-[13px] font-semibold text-text-primary">{t.title}</div>
            {t.desc && <div className="mt-0.5 text-[12px] text-text-secondary">{t.desc}</div>}
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-icon-neutral hover:text-text-primary"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};

// Simple toast state hook
export function useToasts() {
  const [toasts, setToasts] = React.useState<ToastMsg[]>([]);
  const push = (kind: ToastKind, title: string, desc?: string) => {
    const id = Date.now() + Math.floor(performance.now());
    setToasts((t) => [...t, {id, kind, title, desc}]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  };
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));
  return {toasts, push, dismiss};
}
