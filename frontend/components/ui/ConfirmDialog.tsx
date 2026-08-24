import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
      <div
        className="relative w-full max-w-sm bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col p-6"
        style={{ width: "100%", maxWidth: "384px" }}
      >
        <h2 className="text-md font-serif text-ink mb-2">{title}</h2>
        <p className="text-xs text-muted mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`h-9 px-4 font-medium rounded-md text-on-primary inline-flex items-center justify-center text-xs transition-colors cursor-pointer ${
              isDestructive ? "bg-error hover:bg-error/95" : "bg-primary hover:bg-primary-active"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
