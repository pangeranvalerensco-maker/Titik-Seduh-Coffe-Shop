import { createContext, useContext } from "react";

export const NotificationContext = createContext(null);

export const UseNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("UseNotifications harus dipakai di dalam NotificationProvider");
  }
  return context;
};
