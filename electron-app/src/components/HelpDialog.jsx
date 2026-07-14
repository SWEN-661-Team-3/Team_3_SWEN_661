import { useRef, useEffect } from 'react';
import { showModalWithInitialFocus } from '../dialogFocus';

export default function HelpDialog({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) showModalWithInitialFocus(dialog);
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      className="dialog dialog--help"
      ref={dialogRef}
      aria-labelledby="help-dialog-title"
      onClose={onClose}
    >
      <div className="dialog__inner">
        <header className="dialog__header">
          <h2 id="help-dialog-title">Keyboard shortcuts</h2>
          <button
            type="button"
            className="dialog__close"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">X</span>
          </button>
        </header>

        <div className="dialog__body">
          <p>
            Use the menu bar or toolbar for common actions. All primary
            actions work with the keyboard.
          </p>
          <div className="help-list">
            <p className="help-list__row" aria-label="Ctrl+N, creates a new reminder"><kbd>Ctrl</kbd>+<kbd>N</kbd> creates a new reminder.</p>
            <p className="help-list__row" aria-label="Ctrl+S, saves the plan"><kbd>Ctrl</kbd>+<kbd>S</kbd> saves the plan.</p>
            <p className="help-list__row" aria-label="Ctrl+F, searches tasks"><kbd>Ctrl</kbd>+<kbd>F</kbd> searches tasks.</p>
            <p className="help-list__row" aria-label="Ctrl+1, opens today's plan"><kbd>Ctrl</kbd>+<kbd>1</kbd> opens today&apos;s plan.</p>
            <p className="help-list__row" aria-label="Ctrl+2, opens the Care Team page"><kbd>Ctrl</kbd>+<kbd>2</kbd> opens the Care Team page.</p>
            <p className="help-list__row" aria-label="Control plus comma, opens settings"><kbd>Ctrl</kbd>+<kbd>,</kbd> opens settings.</p>
            <p className="help-list__row" aria-label="Tab or Shift+Tab, moves between panels"><kbd>Tab</kbd> or <kbd>Shift</kbd>+<kbd>Tab</kbd> moves between panels.</p>
            <p className="help-list__row" aria-label="Escape, closes the dialog"><kbd>Esc</kbd> closes the dialog.</p>
            <p className="help-list__row" aria-label="F1, opens help dialog"><kbd>F1</kbd> opens the help dialog.</p>
            <p className="help-list__row" aria-label="F2, opens emergency help"><kbd>F2</kbd> opens emergency help.</p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
