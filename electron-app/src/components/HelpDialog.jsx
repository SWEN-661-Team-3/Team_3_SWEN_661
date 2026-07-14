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
          <h2 id="help-dialog-title">CareConnect Help</h2>
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
          <ul className="help-list">
            <li><kbd>Ctrl</kbd>+<kbd>N</kbd> &mdash; New reminder</li>
            <li><kbd>Ctrl</kbd>+<kbd>S</kbd> &mdash; Save plan</li>
            <li><kbd>Ctrl</kbd>+<kbd>F</kbd> &mdash; Search tasks</li>
            <li><kbd>Ctrl</kbd>+<kbd>1</kbd> &mdash; Today&apos;s plan</li>
            <li><kbd>Ctrl</kbd>+<kbd>2</kbd> &mdash; Care Team</li>
            <li><kbd>Ctrl</kbd>+<kbd>,</kbd> &mdash; Open settings</li>
            <li><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> &mdash; Move between panels</li>
            <li><kbd>Esc</kbd> &mdash; Close dialog</li>
            <li><kbd>F1</kbd> &mdash; This help panel</li>
            <li><kbd>F2</kbd> &mdash; Emergency help</li>
          </ul>
        </div>
      </div>
    </dialog>
  );
}
