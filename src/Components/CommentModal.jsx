import { useState } from "react";
import { Send } from "lucide-react";
import { FormatDate } from "../Utils/Pricing";
import { Modal } from "./Modal";
import { StarRating } from "./StarRating";

export const CommentModal = ({ menu, comments, onAdd, onClose }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!rating) {
      setError("Pilih rating bintang dulu.");
      return;
    }
    if (text.trim().length < 5) {
      setError("Komentar minimal 5 karakter.");
      return;
    }
    onAdd(menu.id, rating, text.trim());
    setRating(0);
    setText("");
    setError("");
  };

  return (
    <Modal
      title="Tulis ulasan"
      eyebrow={menu.name}
      onClose={onClose}
      size="normal"
    >
      <div className="comment-summary">
        <img src={menu.image} alt={menu.name} />
        <div>
          <strong>{menu.name}</strong>
          <span>{menu.category}</span>
        </div>
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <label className="field-label">Rating bintang</label>
        <StarRating value={rating} onChange={setRating} size={26} />

        <label className="field-label" htmlFor="comment-text">
          Komentar
        </label>
        <textarea
          id="comment-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          maxLength={280}
          placeholder="Ceritakan rasa, aroma, atau suasana saat menikmatinya..."
        />
        <div className="field-row">
          <span className="field-hint">Minimal 5 karakter.</span>
          <span className="field-count">{text.length}/280</span>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="button button-primary button-full">
          <Send size={16} />
          Kirim komentar
        </button>
      </form>

      <div className="comment-list">
        <div className="review-head">
          <div>
            <p className="eyebrow">Ulasan masuk</p>
            <h3>{comments.length} komentar</h3>
          </div>
        </div>

        {comments.length === 0 ? (
          <p className="review-empty">
            Belum ada komentar. Ulasan barumu akan muncul paling atas.
          </p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="comment-item">
              <div className="review-item-head">
                <StarRating value={comment.rating} readOnly size={13} />
                <span>{FormatDate(comment.createdAt)}</span>
              </div>
              <p>{comment.text}</p>
            </article>
          ))
        )}
      </div>
    </Modal>
  );
};
