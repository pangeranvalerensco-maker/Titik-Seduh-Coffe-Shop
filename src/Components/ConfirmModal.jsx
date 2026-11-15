import { Modal } from "./Modal";

export const ConfirmModal = ({
  title,
  message,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  tone = "default",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal title={title} eyebrow="Konfirmasi" onClose={onCancel} size="small">
      <p className="confirm-message">{message}</p>
      <div className="modal-actions">
        <button type="button" className="button button-ghost" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`button ${tone === "danger" ? "button-danger" : "button-primary"}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};
