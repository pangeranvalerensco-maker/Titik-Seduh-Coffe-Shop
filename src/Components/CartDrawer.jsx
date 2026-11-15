import { useEffect, useState } from "react";
import {
  Check,
  Minus,
  Plus,
  Receipt,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { UseCart } from "../Context/CartContext";
import { UseToast } from "../Context/ToastContext";
import { FormatDate, FormatRupiah } from "../Utils/Pricing";
import { ConfirmModal } from "./ConfirmModal";
import { Modal } from "./Modal";

const PromoChips = ["UTS25", "HEMAT10", "KOPI15"];

export const CartDrawer = () => {
  const {
    cart,
    cartCount,
    GetStock,
    UpdateQty,
    RemoveItem,
    ClearCart,
    promo,
    ApplyPromo,
    RemovePromo,
    totals,
    Checkout,
    isCartOpen,
    OpenCart,
    CloseCart,
  } = UseCart();
  const [promoInput, setPromoInput] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmCheckout, setConfirmCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const { ShowToast } = UseToast();

  useEffect(() => {
    if (!isCartOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") CloseCart();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [CloseCart, isCartOpen]);

  const handlePromo = (event) => {
    event.preventDefault();
    if (ApplyPromo(promoInput)) setPromoInput("");
  };

  const handleCheckout = (event) => {
    event.preventDefault();
    const name = customerName.trim();
    if (!name) {
      ShowToast("Nama pemesan wajib diisi", "Isi nama sebelum melanjutkan pembayaran.", "warning");
      return;
    }
    const order = Checkout(name);
    if (order) {
      setConfirmCheckout(false);
      setCustomerName("");
      setReceipt(order);
    }
  };

  const openCheckout = () => {
    CloseCart();
    setConfirmCheckout(true);
  };

  const cancelCheckout = () => {
    setConfirmCheckout(false);
    OpenCart();
  };

  const openClearConfirmation = () => {
    CloseCart();
    setConfirmClear(true);
  };

  const cancelClear = () => {
    setConfirmClear(false);
    OpenCart();
  };

  return (
    <>
      <div
        className={`cart-layer ${isCartOpen ? "is-open" : ""}`}
        aria-hidden={!isCartOpen}
      >
        <button
          type="button"
          className="cart-overlay"
          onClick={CloseCart}
          aria-label="Tutup keranjang"
          tabIndex={isCartOpen ? 0 : -1}
        />

        <aside
          className="cart-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Keranjang belanja"
        >
          <div className="cart-head">
            <div>
              <p className="eyebrow">{"// manifest pesanan"}</p>
              <h2>
                Keranjang <span>({cartCount})</span>
              </h2>
            </div>
            <button
              type="button"
              className="modal-close"
              onClick={CloseCart}
              aria-label="Tutup keranjang"
            >
              <X size={18} />
            </button>
          </div>

          <div className="cart-body">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <span className="empty-icon">
                  <ShoppingBag size={26} />
                </span>
                <h3>Keranjang masih kosong</h3>
                <p>Pilih satu racikan dari arsip, lalu kembali ke sini.</p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={CloseCart}
                >
                  Pilih menu
                </button>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-main">
                      <div className="cart-item-head">
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.category}</span>
                        </div>
                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => RemoveItem(item.id)}
                          aria-label={`Hapus ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="cart-item-bottom">
                        <div className="qty-control">
                          <button
                            type="button"
                            onClick={() => UpdateQty(item.id, -1)}
                            aria-label="Kurangi jumlah"
                          >
                            <Minus size={13} />
                          </button>
                          <span>{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => UpdateQty(item.id, 1)}
                            aria-label="Tambah jumlah"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <div className="cart-item-price">
                          <strong>{FormatRupiah(item.price * item.qty)}</strong>
                          <span>Stok tersisa {GetStock(item.id)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-foot">
              <div className="promo-box">
                {promo ? (
                  <div className="promo-active">
                    <span>
                      <Tag size={14} />
                      {promo.code} · {promo.percent}%
                    </span>
                    <button type="button" onClick={RemovePromo}>
                      Lepas
                    </button>
                  </div>
                ) : (
                  <>
                    <form className="promo-form" onSubmit={handlePromo}>
                      <input
                        value={promoInput}
                        onChange={(event) => setPromoInput(event.target.value)}
                        placeholder="Kode promo"
                        aria-label="Kode promo"
                      />
                      <button type="submit">Pakai</button>
                    </form>
                    <div className="promo-chips">
                      {PromoChips.map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => ApplyPromo(code)}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="cart-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>{FormatRupiah(totals.subtotal)}</strong>
                </div>
                {totals.discount > 0 && (
                  <div className="is-discount">
                    <span>Diskon promo</span>
                    <strong>-{FormatRupiah(totals.discount)}</strong>
                  </div>
                )}
                <div>
                  <span>Pajak 10%</span>
                  <strong>{FormatRupiah(totals.tax)}</strong>
                </div>
                <div className="cart-total">
                  <span>Total</span>
                  <strong>{FormatRupiah(totals.total)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="button button-primary button-full checkout-button"
                onClick={openCheckout}
              >
                <Receipt size={16} />
                Checkout sekarang
              </button>
              <button
                type="button"
                className="button button-ghost button-full"
                onClick={openClearConfirmation}
              >
                Kosongkan keranjang
              </button>
            </div>
          )}
        </aside>
      </div>

      {confirmClear && (
        <ConfirmModal
          title="Kosongkan keranjang?"
          message="Semua item di keranjang akan dihapus. Tindakan ini tidak bisa dibatalkan."
          confirmLabel="Ya, kosongkan"
          tone="danger"
          onCancel={cancelClear}
          onConfirm={() => {
            ClearCart();
            setConfirmClear(false);
          }}
        />
      )}

      {confirmCheckout && (
        <Modal
          title="Konfirmasi pembayaran"
          eyebrow="// checkout"
          onClose={cancelCheckout}
          size="small"
          className="checkout-modal"
        >
          <form className="checkout-form" onSubmit={handleCheckout}>
            <label htmlFor="customer-name">Nama pemesan</label>
            <input
              id="customer-name"
              name="customerName"
              type="text"
              autoComplete="name"
              maxLength={60}
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Masukkan nama pemesan"
              required
              autoFocus
            />
            <p>
              Total {FormatRupiah(totals.total)} via QRIS. Struk dan nama pemesan
              akan tersimpan di riwayat.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-ghost"
                onClick={cancelCheckout}
              >
                Batal
              </button>
              <button type="submit" className="button button-primary">
                Bayar sekarang
              </button>
            </div>
          </form>
        </Modal>
      )}

      {receipt && (
        <Modal
          title="Struk pembayaran"
          eyebrow={`// ${receipt.id}`}
          onClose={() => setReceipt(null)}
          size="normal"
        >
          <div className="receipt-success">
            <span>
              <Check size={20} />
            </span>
            <div>
              <strong>Pembayaran berhasil</strong>
              <p>
                {receipt.customerName} · {FormatDate(receipt.paidAt)} · {receipt.method}
              </p>
            </div>
          </div>

          <div className="receipt-items">
            {receipt.items.map((item) => (
              <div key={item.id}>
                <span>
                  {item.name} × {item.qty}
                </span>
                <strong>{FormatRupiah(item.price * item.qty)}</strong>
              </div>
            ))}
          </div>

          <div className="receipt-summary">
            <div>
              <span>Subtotal</span>
              <strong>{FormatRupiah(receipt.subtotal)}</strong>
            </div>
            {receipt.discount > 0 && (
              <div className="is-discount">
                <span>Diskon {receipt.promoCode}</span>
                <strong>-{FormatRupiah(receipt.discount)}</strong>
              </div>
            )}
            <div>
              <span>Pajak 10%</span>
              <strong>{FormatRupiah(receipt.tax)}</strong>
            </div>
            <div className="cart-total">
              <span>Total dibayar</span>
              <strong>{FormatRupiah(receipt.total)}</strong>
            </div>
          </div>

          <button
            type="button"
            className="button button-primary button-full"
            onClick={() => setReceipt(null)}
          >
            Tutup struk
          </button>
        </Modal>
      )}
    </>
  );
};
