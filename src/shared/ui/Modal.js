"use client";
import { useEffect, useId, useRef } from "react";
export default function Modal({ title, onClose, children, className = "" }) {
  const dialog = useRef(null);
  const id = useId();
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement;
    node.showModal();
    return () => {
      node.close();
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`appDialog ${className}`}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialogContent">
        <div className="dialogHeading">
          <h2 id={id}>{title}</h2>
          <button type="button" onClick={onClose} autoFocus aria-label="Close dialog">
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
