import { useState } from "react";
import { Receipt, RotateCcw } from "lucide-react";
import { UseCart } from "../Context/CartContext";
import { FormatDate, FormatRupiah } from "../Utils/Pricing";
import { ConfirmModal } from "./ConfirmModal";
import { Modal } from "./Modal";

export const HistoryModal = ({ open, onClose }) => {
  const { orders, ResetAll } = UseCart();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!open) return null;

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <>
      <Modal
        title="Riwayat pesanan"
        eyebrow="// arsip transaksi"
        onClose={onClose}
        size="wide"
      >
        <div className="history-summary">
          <div>
            <span>Total transaksi</span>
            <strong>{orders.length}</strong>
          </div>
          <div>
            <span>Total belanja</span>
            <strong>{FormatRupiah(totalSpent)}</strong>
          </div>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setConfirmReset(true)}
          >
            <RotateCcw size={15} />
            Reset stok & riwayat
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state empty-state-compact">
            <span className="empty-icon">
              <Receipt size={26} />
            </span>
            <h3>Belum ada transaksi</h3>
            <p>Setelah checkout, struk dan riwayat pesanan akan muncul di sini.</p>
          </div>
        ) : (
          <div className="history-list">
            {orders.map((order) => (
              <article className="history-card" key={order.id}>
                <div className="history-card-head">
                  <div>
                    <strong>{order.id}</strong>
                    <span>
                      {order.customerName || "Pemesan"} · {FormatDate(order.paidAt)} · {order.method}
                    </span>
                  </div>
                  <b>{FormatRupiah(order.total)}</b>
                </div>
                <div className="history-items">
                  {order.items.map((item) => (
                    <span key={item.id}>
                      {item.name} × {item.qty}
                    </span>
                  ))}
                </div>
                <div className="history-card-foot">
                  <span>Subtotal {FormatRupiah(order.subtotal)}</span>
                  {order.discount > 0 && (
                    <span>Diskon {FormatRupiah(order.discount)}</span>
                  )}
                  <span>Pajak {FormatRupiah(order.tax)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Modal>

      {confirmReset && (
        <ConfirmModal
          title="Reset stok & riwayat?"
          message="Seluruh stok menu akan kembali seperti awal dan semua riwayat transaksi akan dihapus. Favorit dan komentar tetap tersimpan."
          confirmLabel="Ya, reset"
          tone="danger"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            ResetAll();
            setConfirmReset(false);
          }}
        />
      )}
    </>
  );
};
