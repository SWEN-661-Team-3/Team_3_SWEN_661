import { useRef, useEffect } from 'react';
import { statusLabels, typeLabels } from '../data';
import ItemActions from './ItemActions';
import { showModalWithInitialFocus } from '../dialogFocus';

export default function TaskDetailDialog({
  task,
  open,
  onClose,
  onComplete,
  onEdit,
  onRemove,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) showModalWithInitialFocus(dialog);
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

        <footer className="dialog__footer dialog__footer--item-actions">
          <ItemActions
            itemLabel={task.title}
            onEdit={() => onEdit(task.id)}
            onRemove={() => onRemove(task.id)}
          />
          {task.status !== 'done' && (
            <button
              type="button"
              className="primary-btn"
              onClick={() => onComplete(task.id)}
            >
              Mark complete
            </button>
          )}
        </footer>
      </form>
    </dialog>
  );
}
