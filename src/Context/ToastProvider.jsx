import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./ToastContext";

const CreateId = () =>
  `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const DismissToast = useCallback((id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const ShowToast = useCallback((title, message, tone = "default") => {
    const id = CreateId();
    setToasts((previous) => [...previous, { id, title, message, tone }]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(
    () => ({ toasts, ShowToast, DismissToast }),
    [toasts, ShowToast, DismissToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
