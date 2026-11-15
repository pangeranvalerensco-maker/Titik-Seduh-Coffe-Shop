import { useCallback, useMemo } from "react";
import { UseLocalStorage } from "../Hooks/UseLocalStorage";
import { NotificationContext } from "./NotificationContext";

const CreateId = () =>
  `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = UseLocalStorage(
    "titikseduh.notifications",
    [],
  );

  const PushNotification = useCallback(
    (type, title, message) => {
      setNotifications((previous) => [
        {
          id: CreateId(),
          type,
          title,
          message,
          time: Date.now(),
          read: false,
        },
        ...previous,
      ].slice(0, 60));
    },
    [setNotifications],
  );

  const MarkAllRead = useCallback(() => {
    setNotifications((previous) =>
      previous.map((notification) => ({ ...notification, read: true })),
    );
  }, [setNotifications]);

  const ClearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read)
        .length,
      PushNotification,
      MarkAllRead,
      ClearNotifications,
    }),
    [notifications, PushNotification, MarkAllRead, ClearNotifications],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
