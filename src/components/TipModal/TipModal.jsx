import { useEffect } from "react";
import "./TipModal.css";

export default function TipModal({ isOpen, title, children, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="tipmodal-backdrop" onMouseDown={onClose} role="presentation">
      <div
        className="tipmodal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="tipmodal-header">
          <h3 className="tipmodal-title">{title}</h3>
          <button className="tipmodal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="tipmodal-body">{children}</div>

        <div className="tipmodal-footer">
          <button className="tipmodal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}