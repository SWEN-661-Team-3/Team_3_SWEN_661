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
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setForm({ ...emptyForm });
      setErrors({});
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.time.trim()) errs.time = 'Time is required';
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
    <dialog
      className="dialog"
      ref={dialogRef}
      aria-labelledby="new-appointment-title"
      onClose={onClose}
    >
      <form className="dialog__inner" onSubmit={handleSubmit}>
        <header className="dialog__header">
          <h2 id="new-appointment-title">New Appointment</h2>
          <button
            type="button"
            className="dialog__close"
            aria-label="Close new appointment"
            onClick={onClose}
          >
            Close
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
            />
            {errors.title && <p className="form-error" role="alert">{errors.title}</p>}
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
            />
            {errors.time && <p className="form-error" role="alert">{errors.time}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="appt-location" className="form-label">Location</label>
            <input
              id="appt-location"
              className="form-input"
              type="text"
              placeholder="Optional"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
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
          <button type="submit" className="primary-btn">
            Add Appointment
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </footer>
      </form>
    </dialog>
  );
}
