import { useRef, useEffect } from 'react';

export default function HelpDialog({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      className="dialog dialog--help"
      ref={dialogRef}
      aria-labelledby="help-dialog-title"
      onClose={onClose}
    >
      <form method="dialog" className="dialog__inner">
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
            <li><kbd>Ctrl</kbd>+<kbd>N</kbd> — New reminder</li>
            <li><kbd>Ctrl</kbd>+<kbd>S</kbd> — Save plan</li>
            <li><kbd>Ctrl</kbd>+<kbd>F</kbd> — Search tasks</li>
            <li><kbd>Ctrl</kbd>+<kbd>,</kbd> — Open settings</li>
            <li><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> — Move between panels</li>
            <li><kbd>Esc</kbd> — Close dialog</li>
            <li><kbd>F1</kbd> — This help panel</li>
          </ul>
        </div>

      </form>
    </dialog>
  );
}
