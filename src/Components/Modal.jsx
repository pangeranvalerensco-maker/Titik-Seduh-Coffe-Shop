import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export const Modal = ({
  children,
  onClose,
  title,
  eyebrow,
  size = "normal",
  className = "",
}) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`modal modal-${size} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title || eyebrow || "Dialog"}
      >
        <div className="modal-head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="modal-title">{title}</h2>}
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Tutup dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
