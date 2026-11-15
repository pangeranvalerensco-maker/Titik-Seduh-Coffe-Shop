import { Star } from "lucide-react";

export const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 18,
  showValue = false,
}) => {
  const stars = [1, 2, 3, 4, 5];

  if (readOnly) {
    return (
      <span className="star-row" aria-label={`Rating ${value} dari 5`}>
        {stars.map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(value) ? "star-filled" : "star-empty"}
            fill={star <= Math.round(value) ? "currentColor" : "none"}
            aria-hidden="true"
          />
        ))}
        {showValue && <span className="rating-value">{value.toFixed(1)}</span>}
      </span>
    );
  }

  return (
    <div className="star-row star-row-input" role="group" aria-label="Pilih rating">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className="star-button"
          onClick={() => onChange(star)}
          aria-label={`${star} bintang`}
          aria-pressed={value === star}
        >
          <Star
            size={size}
            className={star <= value ? "star-filled" : "star-empty"}
            fill={star <= value ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
};
