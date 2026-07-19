import { useEffect, useRef } from 'react';

export default function CareConnectDialog({
  open,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel,
  variant,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const confirmButtonClass = variant === 'destructive' ? 'danger-btn' : 'primary-btn';

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={`dialog dialog--confirm${variant ? ` dialog--${variant}` : ''}`}
      aria-labelledby="careconnect-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        if (cancelLabel) {
          onCancel();
        } else {
          onConfirm();
        }
      }}
      onClose={() => {
        if (open && !cancelLabel) onConfirm();
      }}
    >
      <div className="dialog__inner">
        <div className="dialog__header">
          <h2 id="careconnect-dialog-title">{title}</h2>
        </div>
        <div className="dialog__body">
          <p>{message}</p>
        </div>
        <div className="dialog__footer">
          {cancelLabel && (
            <button type="button" className="secondary-btn" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
          <button type="button" className={confirmButtonClass} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
