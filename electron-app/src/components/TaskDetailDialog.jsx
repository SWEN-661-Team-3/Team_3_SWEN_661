import { useRef, useEffect } from 'react';
import { statusLabels, typeLabels } from '../data';

export default function TaskDetailDialog({ task, open, onClose, onComplete }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!task) return null;

  const status = statusLabels[task.status] ?? statusLabels.todo;
  const type = typeLabels[task.type] ?? { label: task.type, icon: '\u2022' };
  const location = task.location || 'Home';

  return (
    <dialog
      className="dialog"
      ref={dialogRef}
      aria-labelledby="detail-dialog-title"
      onClose={onClose}
    >
      <form method="dialog" className="dialog__inner">
        <header className="dialog__header">
          <h2 id="detail-dialog-title">{task.title}</h2>
          <button
            type="submit"
            className="dialog__close"
            value="cancel"
            aria-label="Close dialog"
          >
            Close
          </button>
        </header>

        <div className="dialog__body">
          <div className="detail-row">
            <p className="detail-row__label">Status</p>
            <p className="detail-row__value">
              <span className={`status-badge status-badge--${task.status}`}>
                <span aria-hidden="true">{status.icon}</span>
                {' '}{status.label}
              </span>
            </p>
          </div>
          <div className="detail-row">
            <p className="detail-row__label">Type</p>
            <p className="detail-row__value">
              <span aria-hidden="true">{type.icon}</span>
              {' '}{type.label}
            </p>
          </div>
          <div className="detail-row">
            <p className="detail-row__label">Time</p>
            <p className="detail-row__value">{task.time}</p>
          </div>
          <div className="detail-row">
            <p className="detail-row__label">Location</p>
            <p className="detail-row__value">{location}</p>
          </div>
          {task.notes && (
            <div className="detail-row">
              <p className="detail-row__label">Notes</p>
              <p className="detail-row__value">{task.notes}</p>
            </div>
          )}
        </div>

        <footer className="dialog__footer">
          {task.status !== 'done' && (
            <button
              type="button"
              className="primary-btn"
              onClick={() => onComplete(task.id)}
            >
              Mark complete
            </button>
          )}
          <button type="submit" className="secondary-btn" value="cancel">
            Close
          </button>
        </footer>
      </form>
    </dialog>
  );
}
