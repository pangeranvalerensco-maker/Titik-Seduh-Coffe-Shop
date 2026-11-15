import { createContext, useContext } from "react";

export const ToastContext = createContext(null);

export const UseToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("UseToast harus dipakai di dalam ToastProvider");
  }
  return context;
};
