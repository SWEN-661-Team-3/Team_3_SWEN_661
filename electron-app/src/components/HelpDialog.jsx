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
            <p className="help-list__row">
              <span className="visually-hidden">Control plus N, creates a new reminder.</span>
              <span aria-hidden="true"><kbd>Ctrl</kbd>+<kbd>N</kbd> creates a new reminder.</span>
            </p>
            <p className="help-list__row">
              <span className="visually-hidden">Control plus S, saves the plan.</span>
              <span aria-hidden="true"><kbd>Ctrl</kbd>+<kbd>S</kbd> saves the plan.</span>
            </p>
            <p className="help-list__row">
              <span className="visually-hidden">Control plus F, searches tasks.</span>
              <span aria-hidden="true"><kbd>Ctrl</kbd>+<kbd>F</kbd> searches tasks.</span>
            </p>
            <p className="help-list__row">
              <span className="visually-hidden">Control plus 1, opens today&apos;s plan.</span>
              <span aria-hidden="true"><kbd>Ctrl</kbd>+<kbd>1</kbd> opens today&apos;s plan.</span>
            </p>
            <p className="help-list__row">
              <span className="visually-hidden">Control plus 2, opens the Care Team page.</span>
              <span aria-hidden="true"><kbd>Ctrl</kbd>+<kbd>2</kbd> opens the Care Team page.</span>
            </p>
            <p className="help-list__row">
              <span className="visually-hidden">Control plus comma, opens settings.</span>
              <span aria-hidden="true"><kbd>Ctrl</kbd>+<kbd>,</kbd> opens settings.</span>
            </p>
            <p className="help-list__row">
              <span className="visually-hidden">Tab or Shift plus Tab, moves between panels.</span>
              <span aria-hidden="true"><kbd>Tab</kbd> or <kbd>Shift</kbd>+<kbd>Tab</kbd> moves between panels.</span>
            </p>
            <p className="help-list__row">
              <span className="visually-hidden">Escape, closes the dialog.</span>
              <span aria-hidden="true"><kbd>Esc</kbd> closes the dialog.</span>
            </p>
            <p className="help-list__row">
              <span className="visually-hidden">F1, opens help dialog.</span>
              <span aria-hidden="true"><kbd>F1</kbd> opens the help dialog.</span>
            </p>
            <p className="help-list__row">
              <span className="visually-hidden">F2, opens emergency help.</span>
              <span aria-hidden="true"><kbd>F2</kbd> opens emergency help.</span>
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
