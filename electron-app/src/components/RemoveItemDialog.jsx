import { useEffect, useRef } from 'react';
import { showModalWithInitialFocus } from '../dialogFocus';

export default function RemoveItemDialog({
  itemName,
  itemType,
  message,
  confirmLabel,
  keepLabel,
  onClose,
  onConfirm,
}) {
  const dialogRef = useRef(null);
  const open = Boolean(itemName);
  const titleId = `remove-${itemType}-title`;
  const messageId = `remove-${itemType}-message`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) showModalWithInitialFocus(dialog);
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!itemName) return null;

  return (
    <dialog
      className="dialog dialog--remove-item"
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onClose={onClose}
    >
      <form method="dialog" className="dialog__inner">
        <header className="dialog__header">
          <h2 id={titleId}>{`Remove ${itemType}?`}</h2>
        </header>

        <div className="dialog__body">
          <p id={messageId} className="remove-item-message">{message}</p>
        </div>

        <footer className="dialog__footer">
          <button type="button" className="danger-btn" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button type="button" className="secondary-btn" onClick={onClose}>
            {keepLabel}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
