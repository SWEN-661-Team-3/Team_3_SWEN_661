import { useEffect, useRef, useState } from 'react';
import { statusLabels, typeLabels, typeOptions } from '../data/careData';
import CareConnectDialog from './CareConnectDialog';
import { validateReminder } from '../utils/formValidation';

export default function TaskDetailDialog({ task, open, mode = 'view', onClose, onComplete, onSave }) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const closeButtonRef = useRef(null);
  const fieldRefs = useRef({});
  const [isEditing, setIsEditing] = useState(mode === 'add');
  const [form, setForm] = useState(() => (task ? { ...task } : null));
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Focus management: when the dialog opens, focus moves to the heading
  // (via tabIndex="-1") so screen readers announce the dialog context
  // immediately. The close button is the fallback if the heading ref is
  // missing. Focus is restored to the triggering element when the dialog
  // closes (handled in the parent page's closeTaskDetail callback).
  // The rAF delay ensures the DOM has painted after showModal() before
  // attempting to focus an element inside the now-visible dialog.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.classList.remove('dialog--enter');
      el.showModal();
      requestAnimationFrame(() => {
        const initialFocus = titleRef.current ?? closeButtonRef.current;
        if (el.open && initialFocus && el.contains(initialFocus)) {
          initialFocus.focus({ preventScroll: true });
        }
      });
      void el.offsetWidth;
      el.classList.add('dialog--enter');
    } else if (!open && el.open) {
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
    setErrors((current) => {
      if (!current[field]) return current;
      const { [field]: _message, ...remaining } = current;
      return remaining;
    });
  }

  function requestClose() {
    if (hasUnsavedChanges) {
      setConfirmCloseOpen(true);
      return;
    }
    dialogRef.current?.close();
  }

  function handleSave() {
    const nextErrors = validateReminder(currentForm);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalidField = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => fieldRefs.current[firstInvalidField]?.focus());
      return;
    }
    setErrors({});
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
          <h2 ref={titleRef} id="task-detail-title" tabIndex="-1">{title}</h2>
          <button
            ref={closeButtonRef}
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
              {Object.keys(errors).length > 0 && (
                <div className="operation-status operation-status--error" role="alert" tabIndex="-1">
                  <p>Please correct the highlighted reminder fields.</p>
                </div>
              )}
              <label className="edit-field edit-field--full" htmlFor="reminder-title">
                <span className="edit-field__label">Reminder</span>
                <input
                  id="reminder-title"
                  ref={(element) => { fieldRefs.current.title = element; }}
                  className="edit-field__control"
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  required
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? 'reminder-title-error' : undefined}
                />
                {errors.title && <span id="reminder-title-error" className="field-error">{errors.title}</span>}
              </label>
              <label className="edit-field" htmlFor="reminder-type">
                <span className="edit-field__label">Type</span>
                <select
                  id="reminder-type"
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
              <label className="edit-field" htmlFor="reminder-status">
                <span className="edit-field__label">Status</span>
                <select
                  id="reminder-status"
                  className="edit-field__control"
                  value={form.status}
                  onChange={(event) => updateField('status', event.target.value)}
                >
                  <option value="todo">Pending</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label className="edit-field" htmlFor="reminder-date">
                <span className="edit-field__label">Date</span>
                <input
                  id="reminder-date"
                  ref={(element) => { fieldRefs.current.date = element; }}
                  className="edit-field__control"
                  value={form.date}
                  onChange={(event) => updateField('date', event.target.value)}
                  required
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? 'reminder-date-error' : undefined}
                />
                {errors.date && <span id="reminder-date-error" className="field-error">{errors.date}</span>}
              </label>
              <label className="edit-field" htmlFor="reminder-time">
                <span className="edit-field__label">Time</span>
                <input
                  id="reminder-time"
                  ref={(element) => { fieldRefs.current.time = element; }}
                  className="edit-field__control"
                  value={form.time}
                  onChange={(event) => updateField('time', event.target.value)}
                  required
                  aria-invalid={Boolean(errors.time)}
                  aria-describedby={errors.time ? 'reminder-time-error' : undefined}
                />
                {errors.time && <span id="reminder-time-error" className="field-error">{errors.time}</span>}
              </label>
              <label className="edit-field edit-field--full" htmlFor="reminder-location">
                <span className="edit-field__label">Location</span>
                <input
                  id="reminder-location"
                  ref={(element) => { fieldRefs.current.location = element; }}
                  className="edit-field__control"
                  value={form.location}
                  onChange={(event) => updateField('location', event.target.value)}
                  aria-invalid={Boolean(errors.location)}
                  aria-describedby={errors.location ? 'reminder-location-error' : undefined}
                />
                {errors.location && <span id="reminder-location-error" className="field-error">{errors.location}</span>}
              </label>
              <label className="edit-field edit-field--full" htmlFor="reminder-notes">
                <span className="edit-field__label">Notes</span>
                <textarea
                  id="reminder-notes"
                  ref={(element) => { fieldRefs.current.notes = element; }}
                  className="edit-field__control"
                  rows="4"
                  value={form.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  aria-invalid={Boolean(errors.notes)}
                  aria-describedby={errors.notes ? 'reminder-notes-error' : undefined}
                />
                {errors.notes && <span id="reminder-notes-error" className="field-error">{errors.notes}</span>}
              </label>
            </div>
          )}
        </div>

        <div className="dialog__footer">
          {!isEditing ? (
            <>
              <button type="button" className="secondary-btn" onClick={requestClose}>
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
                  onClick={() => {
                    onComplete(task.id);
                    dialogRef.current?.close();
                  }}
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
          dialogRef.current?.close();
        }}
      />
    </>
  );
}
