import { useState } from "react";
import {
  Heart,
  Info,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";
import { UseCart } from "../Context/CartContext";
import { FormatRupiah } from "../Utils/Pricing";
import { CommentModal } from "./CommentModal";
import { InfoModal } from "./InfoModal";
import { StarRating } from "./StarRating";

export const MenuCard = ({
  id,
  name,
  category,
  price,
  stock,
  image,
  description,
  rating,
  favorite,
  comments,
  onToggleFavorite,
  onAddComment,
}) => {
  const { AddToCart, GetStock } = UseCart();
  const [infoOpen, setInfoOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const currentStock = GetStock(id) ?? stock;
  const soldOut = currentStock <= 0;
  const lowStock = currentStock > 0 && currentStock <= 3;
  const menu = {
    id,
    name,
    category,
    price,
    stock: currentStock,
    image,
    description,
    rating,
  };

  return (
    <>
      <article className="menu-card">
        <div className="menu-media">
          <img src={image} alt={name} loading="lazy" />
          <span className="menu-category">{category}</span>
          {soldOut && <span className="menu-soldout">Habis</span>}
          <span className="menu-index">#{String(id).padStart(2, "0")}</span>
        </div>

        <div className="menu-body">
          <div className="menu-topline">
            <StarRating value={rating} readOnly showValue size={13} />
            <span className={`menu-stock ${lowStock ? "is-low" : ""}`}>
              Stok {currentStock}
            </span>
          </div>

          <h3 className="menu-name">{name}</h3>
          <p className="menu-description">{description}</p>

          <div className="menu-price-row">
            <span className="menu-price">{FormatRupiah(price)}</span>
            <span className="menu-category-note">{category}</span>
          </div>

          <div className="menu-actions">
            <button
              type="button"
              className="action-button"
              onClick={() => setInfoOpen(true)}
              aria-label={`Info ${name}`}
              title="Info"
            >
              <Info size={17} />
              <span>Info</span>
            </button>

            <button
              type="button"
              className={`action-button ${favorite ? "is-favorite" : ""}`}
              onClick={() => onToggleFavorite(menu)}
              aria-label={`Favorit ${name}`}
              aria-pressed={favorite}
              title="Favorit"
            >
              <Heart
                size={17}
                fill={favorite ? "currentColor" : "none"}
              />
              <span>{favorite ? "Tersimpan" : "Suka"}</span>
            </button>

            <button
              type="button"
              className="action-button"
              onClick={() => setCommentOpen(true)}
              aria-label={`Komentar ${name}`}
              title="Komentar"
            >
              <MessageCircle size={17} />
              <span>Komentar</span>
              {comments.length > 0 && (
                <b className="action-badge">{comments.length}</b>
              )}
            </button>

            <button
              type="button"
              className="action-button action-add"
              onClick={() => AddToCart(menu)}
              disabled={soldOut}
              aria-label={`Tambah ${name} ke keranjang`}
            >
              <ShoppingCart size={17} />
              <span>{soldOut ? "Habis" : "Tambah"}</span>
            </button>
          </div>
        </div>
      </article>

      {infoOpen && (
        <InfoModal
          menu={menu}
          stock={currentStock}
          comments={comments}
          onClose={() => setInfoOpen(false)}
        />
      )}

      {commentOpen && (
        <CommentModal
          menu={menu}
          comments={comments}
          onAdd={onAddComment}
          onClose={() => setCommentOpen(false)}
        />
      )}
    </>
  );
};
