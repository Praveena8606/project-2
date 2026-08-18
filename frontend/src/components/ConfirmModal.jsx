import "./ConfirmModal.css";

function ConfirmModal({ isOpen, title, message, confirmText = "Delete", cancelText = "Cancel", onConfirm, onCancel, isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">{isDanger ? "⚠️" : "ℹ️"}</span>
          <h3>{title}</h3>
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} type="button">
            {cancelText}
          </button>
          <button
            className={`btn ${isDanger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
