import { useEffect, useRef } from 'react';
import { statusLabels, typeLabels } from '../data/careData';

export default function TaskDetailDialog({ task, open, onClose, onComplete }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  if (!task) return null;

  const status = statusLabels[task.status];
  const typeInfo = typeLabels[task.type] ?? { label: task.type };

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="task-detail-title"
      onClose={onClose}
    >
      <div className="dialog__inner">
        <div className="dialog__header">
          <h2 id="task-detail-title">{task.title}</h2>
          <button
            type="button"
            className="dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <div className="dialog__body">
          <dl className="detail-list">
            <div className="detail-row">
              <dt className="detail-row__label">Type</dt>
              <dd className="detail-row__value">{typeInfo.label}</dd>
            </div>
            <div className="detail-row">
              <dt className="detail-row__label">Time</dt>
              <dd className="detail-row__value">{task.time}</dd>
            </div>
            <div className="detail-row">
              <dt className="detail-row__label">Status</dt>
              <dd className="detail-row__value">
                <span className={`status-badge status-badge--${task.status}`}>
                  <span aria-hidden="true">{status.icon}</span> {status.label}
                </span>
              </dd>
            </div>
            {task.location && (
              <div className="detail-row">
                <dt className="detail-row__label">Location</dt>
                <dd className="detail-row__value">{task.location}</dd>
              </div>
            )}
            {task.notes && (
              <div className="detail-row">
                <dt className="detail-row__label">Notes</dt>
                <dd className="detail-row__value">{task.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="dialog__footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Close
          </button>
          {task.status === 'todo' && (
            <button
              type="button"
              className="primary-btn"
              onClick={() => onComplete(task.id)}
            >
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
