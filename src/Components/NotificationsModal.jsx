import {
  Bell,
  Heart,
  MessageCircle,
  Receipt,
  RotateCcw,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { UseNotifications } from "../Context/NotificationContext";
import { UseToast } from "../Context/ToastContext";
import { FormatDate } from "../Utils/Pricing";
import { Modal } from "./Modal";

const NotificationIcons = {
  favorite: Heart,
  comment: MessageCircle,
  cart: ShoppingCart,
  promo: Tag,
  order: Receipt,
  reset: RotateCcw,
  default: Bell,
};

export const NotificationsModal = ({ open, onClose }) => {
  const {
    notifications,
    unreadCount,
    MarkAllRead,
    ClearNotifications,
  } = UseNotifications();
  const { ShowToast } = UseToast();

  if (!open) return null;

  return (
    <Modal
      title="Notifikasi"
      eyebrow="// catatan aktivitas"
      onClose={onClose}
      size="normal"
    >
      <div className="notification-tools">
        <span>{unreadCount} belum dibaca</span>
        <div>
          <button
            type="button"
            onClick={() => {
              MarkAllRead();
              ShowToast("Notifikasi", "Semua aktivitas ditandai sudah dibaca.");
            }}
            disabled={unreadCount === 0}
          >
            Tandai dibaca
          </button>
          <button
            type="button"
            onClick={() => {
              ClearNotifications();
              ShowToast("Notifikasi", "Daftar notifikasi dibersihkan.", "reset");
            }}
            disabled={notifications.length === 0}
          >
            Hapus semua
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state empty-state-compact">
          <span className="empty-icon">
            <Bell size={26} />
          </span>
          <h3>Belum ada aktivitas</h3>
          <p>Setiap favorit, komentar, promo, dan pesanan akan tercatat di sini.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => {
            const Icon =
              NotificationIcons[notification.type] || NotificationIcons.default;
            return (
              <article
                className={`notification-item ${
                  notification.read ? "" : "is-unread"
                }`}
                key={notification.id}
              >
                <span className="notification-icon">
                  <Icon size={16} />
                </span>
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <span>{FormatDate(notification.time)}</span>
                </div>
                {!notification.read && <i className="notification-dot" />}
              </article>
            );
          })}
        </div>
      )}
    </Modal>
  );
};
