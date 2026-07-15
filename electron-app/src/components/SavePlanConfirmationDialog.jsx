import { useEffect, useRef } from 'react';
import { showModalWithInitialFocus } from '../dialogFocus';

export default function SavePlanConfirmationDialog({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) showModalWithInitialFocus(dialog);
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      className="dialog dialog--confirmation"
      ref={dialogRef}
      aria-labelledby="save-plan-confirmation-title"
      onClose={onClose}
    >
      <div className="dialog__inner">
        <header className="dialog__header">
          <h2 id="save-plan-confirmation-title">Plan saved</h2>
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
            Today&apos;s plan was saved as a text file.
          </p>
        </div>
      </div>
    </dialog>
  );
}
