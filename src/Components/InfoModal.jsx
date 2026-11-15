import { MessageCircle } from "lucide-react";
import { FormatDate, FormatRupiah } from "../Utils/Pricing";
import { Modal } from "./Modal";
import { StarRating } from "./StarRating";

export const InfoModal = ({ menu, stock, comments, onClose }) => {
  return (
    <Modal
      title={menu.name}
      eyebrow="Detail racikan"
      onClose={onClose}
      size="wide"
    >
      <div className="info-hero">
        <img src={menu.image} alt={menu.name} />
        <div className="info-hero-copy">
          <span className="menu-category">{menu.category}</span>
          <StarRating value={menu.rating} readOnly showValue size={16} />
        </div>
      </div>

      <p className="info-description">{menu.description}</p>

      <div className="info-grid">
        <div>
          <span>Kategori</span>
          <strong>{menu.category}</strong>
        </div>
        <div>
          <span>Harga</span>
          <strong>{FormatRupiah(menu.price)}</strong>
        </div>
        <div>
          <span>Stok tersedia</span>
          <strong>{stock} porsi</strong>
        </div>
        <div>
          <span>Rating kurasi</span>
          <strong>{menu.rating.toFixed(1)} / 5</strong>
        </div>
      </div>

      <div className="review-block">
        <div className="review-head">
          <div>
            <p className="eyebrow">Catatan pengunjung</p>
            <h3>Ulasan komunitas</h3>
          </div>
          <span className="review-count">
            <MessageCircle size={14} />
            {comments.length}
          </span>
        </div>

        {comments.length === 0 ? (
          <p className="review-empty">
            Belum ada ulasan. Buka tombol komentar untuk menjadi yang pertama.
          </p>
        ) : (
          <div className="review-list">
            {comments.map((comment) => (
              <article key={comment.id} className="review-item">
                <div className="review-item-head">
                  <StarRating value={comment.rating} readOnly size={13} />
                  <span>{FormatDate(comment.createdAt)}</span>
                </div>
                <p>{comment.text}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
