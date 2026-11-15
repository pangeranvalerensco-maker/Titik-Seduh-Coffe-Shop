import {
  AlertTriangle,
  Bell,
  Heart,
  MessageCircle,
  Receipt,
  RotateCcw,
  ShoppingCart,
  Tag,
  X,
} from "lucide-react";
import { UseToast } from "../Context/ToastContext";

const ToastIcons = {
  favorite: Heart,
  comment: MessageCircle,
  cart: ShoppingCart,
  promo: Tag,
  order: Receipt,
  reset: RotateCcw,
  warning: AlertTriangle,
  default: Bell,
};

export const ToastViewport = () => {
  const { toasts, DismissToast } = UseToast();

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const Icon = ToastIcons[toast.tone] || ToastIcons.default;
        return (
          <div key={toast.id} className={`toast toast-${toast.tone}`}>
            <span className="toast-icon">
              <Icon size={18} />
            </span>
            <div className="toast-copy">
              <strong>{toast.title}</strong>
              <p>{toast.message}</p>
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={() => DismissToast(toast.id)}
              aria-label="Tutup notifikasi"
            >
              <X size={14} />
            </button>
            <span className="toast-progress" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
};
