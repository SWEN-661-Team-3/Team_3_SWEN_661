import { useRef, useEffect } from 'react';
import { showModalWithInitialFocus } from '../dialogFocus';

export default function CompletionDialog({ open, message, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) showModalWithInitialFocus(dialog);
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!message) return null;

  return (
    <dialog
      className="dialog dialog--confirmation"
      ref={dialogRef}
      aria-labelledby="completion-dialog-title"
      onClose={onClose}
    >
      <div className="dialog__inner">
        <header className="dialog__header">
          <h2 id="completion-dialog-title">Task complete</h2>
          <button
            type="button"
            className="dialog__close"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">X</span>
          </button>
        </header>

        <div className="confirmation-panel">
          <div className="confirmation-panel__icon" aria-hidden="true">OK</div>
          <p className="confirmation-panel__title">
            {message}
          </p>
        </div>
      </div>
    </dialog>
  );
}
