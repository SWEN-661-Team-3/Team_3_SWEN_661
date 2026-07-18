import { useEffect, useRef, useState } from 'react';
import { statusLabels, typeLabels, typeOptions } from '../data/careData';
import CareConnectDialog from './CareConnectDialog';

export default function TaskDetailDialog({ task, open, mode = 'view', onClose, onComplete, onSave }) {
  const dialogRef = useRef(null);
  const [isEditing, setIsEditing] = useState(mode === 'add');
  const [form, setForm] = useState(() => (task ? { ...task } : null));
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  if (!task || !form) return null;

  const status = statusLabels[task.status];
  const typeInfo = typeLabels[task.type] ?? { label: task.type };
  const isAdding = mode === 'add';
  const title = isAdding ? 'Add Reminder' : task.title;
  const savedForm = {
    ...task,
    title: task.title.trim(),
    date: task.date.trim() || 'Today',
    time: task.time.trim(),
    location: task.location.trim(),
    notes: task.notes.trim(),
    actionLabel: task.actionLabel?.trim() || 'View Details',
  };
  const currentForm = {
    ...form,
    title: form.title.trim(),
    date: form.date.trim() || 'Today',
    time: form.time.trim(),
    location: form.location.trim(),
    notes: form.notes.trim(),
    actionLabel: form.actionLabel?.trim() || 'View Details',
  };
  const hasUnsavedChanges = isEditing && JSON.stringify(currentForm) !== JSON.stringify(savedForm);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function requestClose() {
    if (hasUnsavedChanges) {
      setConfirmCloseOpen(true);
      return;
    }
    onClose();
  }

  function handleSave() {
    const didSave = onSave(currentForm);
    if (didSave) setIsEditing(false);
  }

  return (
    <>
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="task-detail-title"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <div className="dialog__inner">
        <div className="dialog__header">
          <h2 id="task-detail-title">{title}</h2>
          <button
            type="button"
            className="dialog__close"
            onClick={requestClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <div className="dialog__body">
          {!isEditing ? (
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
          ) : (
            <div className="edit-form">
              <label className="edit-field edit-field--full">
                <span className="edit-field__label">Reminder</span>
                <input
                  className="edit-field__control"
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  required
                />
              </label>
              <label className="edit-field">
                <span className="edit-field__label">Type</span>
                <select
                  className="edit-field__control"
                  value={form.type}
                  onChange={(event) => updateField('type', event.target.value)}
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="edit-field">
                <span className="edit-field__label">Status</span>
                <select
                  className="edit-field__control"
                  value={form.status}
                  onChange={(event) => updateField('status', event.target.value)}
                >
                  <option value="todo">Pending</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label className="edit-field">
                <span className="edit-field__label">Date</span>
                <input
                  className="edit-field__control"
                  value={form.date}
                  onChange={(event) => updateField('date', event.target.value)}
                  required
                />
              </label>
              <label className="edit-field">
                <span className="edit-field__label">Time</span>
                <input
                  className="edit-field__control"
                  value={form.time}
                  onChange={(event) => updateField('time', event.target.value)}
                  required
                />
              </label>
              <label className="edit-field edit-field--full">
                <span className="edit-field__label">Location</span>
                <input
                  className="edit-field__control"
                  value={form.location}
                  onChange={(event) => updateField('location', event.target.value)}
                />
              </label>
              <label className="edit-field edit-field--full">
                <span className="edit-field__label">Notes</span>
                <textarea
                  className="edit-field__control"
                  rows="4"
                  value={form.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        <div className="dialog__footer">
          {!isEditing ? (
            <>
              <button type="button" className="secondary-btn" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setForm({ ...task });
                  setIsEditing(true);
                }}
              >
                Edit Details
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
            </>
          ) : (
            <>
              <button
                type="button"
                className="secondary-btn"
                onClick={requestClose}
              >
                Close
              </button>
              <button type="button" className="primary-btn" onClick={handleSave}>
                {isAdding ? 'Add Reminder' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
      <CareConnectDialog
        open={confirmCloseOpen}
        title="Close Without Saving?"
        message="You have unsaved changes. Close without saving?"
        cancelLabel="Keep Editing"
        confirmLabel="Close Without Saving"
        onCancel={() => setConfirmCloseOpen(false)}
        onConfirm={() => {
          setConfirmCloseOpen(false);
          onClose();
        }}
      />
    </>
  );
}
