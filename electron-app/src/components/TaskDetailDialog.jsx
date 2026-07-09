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
            type="button"
            className="dialog__close"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">X</span>
          </button>
        </header>

        <div className="dialog__body">
          <dl className="detail-list">
            <div className="detail-row">
              <dt className="detail-row__label">Status</dt>
              <dd className="detail-row__value">
                <span className={`status-badge status-badge--${task.status}`}>
                  <span aria-hidden="true">{status.icon}</span>
                  {' '}{status.label}
                </span>
              </dd>
            </div>
            <div className="detail-row">
              <dt className="detail-row__label">Type</dt>
              <dd className="detail-row__value">{type.label}</dd>
            </div>
            <div className="detail-row">
              <dt className="detail-row__label">Time</dt>
              <dd className="detail-row__value">{task.time}</dd>
            </div>
            <div className="detail-row">
              <dt className="detail-row__label">Location</dt>
              <dd className="detail-row__value">{location}</dd>
            </div>
            {task.notes && (
              <div className="detail-row">
                <dt className="detail-row__label">Notes</dt>
                <dd className="detail-row__value">{task.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        {task.status !== 'done' && (
          <footer className="dialog__footer">
            <button
              type="button"
              className="primary-btn"
              onClick={() => onComplete(task.id)}
            >
              Mark complete
            </button>
          </footer>
        )}
      </form>
    </dialog>
  );
}
