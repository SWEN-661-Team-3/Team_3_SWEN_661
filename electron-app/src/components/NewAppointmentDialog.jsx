import { useRef, useEffect, useState } from 'react';
import { typeOptions } from '../data';

const emptyForm = {
  title: '',
  time: '',
  location: '',
  notes: '',
  type: 'appointment',
};

export default function NewAppointmentDialog({ open, onClose, onAdd }) {
  const dialogRef = useRef(null);
  const discardDialogRef = useRef(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [discardOpen, setDiscardOpen] = useState(false);

  const hasRequiredFields = Boolean(
    form.title.trim() && form.time.trim() && form.location.trim(),
  );
  const hasUnsavedData = ['title', 'time', 'location', 'notes'].some(
    (field) => form[field].trim(),
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setForm({ ...emptyForm });
      setErrors({});
      setDiscardOpen(false);
      dialog.showModal();
    }
    if (!open && dialog.open) {
      setDiscardOpen(false);
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = discardDialogRef.current;
    if (!dialog) return;
    if (discardOpen && !dialog.open) dialog.showModal();
    if (!discardOpen && dialog.open) dialog.close();
  }, [discardOpen]);

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.time.trim()) errs.time = 'Time is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onAdd({
      id: String(Date.now()),
      title: form.title.trim(),
      date: 'Today',
      time: form.time.trim(),
      location: form.location.trim(),
      notes: form.notes.trim(),
      type: form.type,
      status: 'todo',
      actionLabel: 'View',
    });
  }

  function requestClose() {
    if (hasUnsavedData) {
      setDiscardOpen(true);
      return;
    }
    onClose();
  }

  function handleCancel(e) {
    if (hasUnsavedData) {
      e.preventDefault();
      setDiscardOpen(true);
    }
  }

  function confirmDiscard() {
    setDiscardOpen(false);
    onClose();
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  return (
    <>
      <dialog
        className="dialog"
        ref={dialogRef}
        aria-labelledby="new-reminder-title"
        onCancel={handleCancel}
        onClose={onClose}
      >
        <form className="dialog__inner" onSubmit={handleSubmit}>
          <header className="dialog__header">
            <h2 id="new-reminder-title">New Reminder</h2>
            <button
              type="button"
              className="dialog__close"
              aria-label="Close"
              onClick={requestClose}
            >
              <span aria-hidden="true">X</span>
            </button>
          </header>

        <div className="dialog__body">
          <div className="form-group">
            <label htmlFor="appt-title" className="form-label">Title</label>
            <input
              id="appt-title"
              className="form-input"
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'appt-title-error' : undefined}
            />
            {errors.title && <p id="appt-title-error" className="form-error" role="alert">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="appt-type" className="form-label">Type</label>
            <select
              id="appt-type"
              className="form-select"
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="appt-time" className="form-label">Time</label>
            <input
              id="appt-time"
              className="form-input"
              type="text"
              placeholder="e.g. 2:00 PM"
              value={form.time}
              onChange={(e) => handleChange('time', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.time}
              aria-describedby={errors.time ? 'appt-time-error' : undefined}
            />
            {errors.time && <p id="appt-time-error" className="form-error" role="alert">{errors.time}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="appt-location" className="form-label">Location</label>
            <input
              id="appt-location"
              className="form-input"
              type="text"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? 'appt-location-error' : undefined}
            />
            {errors.location && <p id="appt-location-error" className="form-error" role="alert">{errors.location}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="appt-notes" className="form-label">Notes</label>
            <textarea
              id="appt-notes"
              className="form-textarea"
              placeholder="Optional"
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>
        </div>

        <footer className="dialog__footer">
          <button
            type="submit"
            className="primary-btn"
            disabled={!hasRequiredFields}
          >
            Save
          </button>
        </footer>
        </form>
      </dialog>

      {discardOpen && (
        <dialog
          className="dialog dialog--discard-helper"
          ref={discardDialogRef}
          aria-labelledby="discard-reminder-title"
          aria-describedby="discard-reminder-message"
          onClose={() => setDiscardOpen(false)}
        >
          <form method="dialog" className="dialog__inner">
            <header className="dialog__header">
              <h2 id="discard-reminder-title">Are you sure?</h2>
            </header>

            <div className="dialog__body">
              <p id="discard-reminder-message" className="discard-helper-message">
                This reminder has unsaved information. Close without saving?
              </p>
            </div>

            <footer className="dialog__footer">
              <button
                type="button"
                className="danger-btn"
                onClick={confirmDiscard}
              >
                Close without saving
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setDiscardOpen(false)}
              >
                Continue editing
              </button>
            </footer>
          </form>
        </dialog>
      )}
    </>
  );
}
