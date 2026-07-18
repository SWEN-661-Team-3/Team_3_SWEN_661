import { useEffect, useRef, useState } from 'react';

const availabilityLabels = {
  available: 'Available',
  away: 'Away',
  offline: 'Offline',
};

const availabilityOptions = [
  { value: 'available', label: 'Available' },
  { value: 'away', label: 'Away' },
  { value: 'offline', label: 'Offline' },
];

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function CareMemberDetailDialog({ member, open, onClose, onSave }) {
  const dialogRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => (member ? { ...member } : null));

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  if (!member || !form) return null;

  const titleId = `care-member-detail-title-${member.id}`;

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSave(event) {
    event.preventDefault();
    const trimmedName = form.name.trim();
    const nextMember = {
      ...form,
      name: trimmedName,
      role: form.role.trim(),
      relationship: form.relationship.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
      initials: getInitials(trimmedName) || member.initials,
    };
    onSave(nextMember);
    setIsEditing(false);
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <form className="dialog__inner" onSubmit={handleSave}>
        <div className="dialog__header">
          <h2 id={titleId}>{member.name}</h2>
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
          {!isEditing ? (
            <dl className="detail-list">
              <div className="detail-row">
                <dt className="detail-row__label">Role</dt>
                <dd className="detail-row__value">{member.role}</dd>
              </div>
              <div className="detail-row">
                <dt className="detail-row__label">Relationship</dt>
                <dd className="detail-row__value">{member.relationship}</dd>
              </div>
              <div className="detail-row">
                <dt className="detail-row__label">Availability</dt>
                <dd className="detail-row__value">
                  <span className={`availability-badge availability-badge--${member.availability}`}>
                    {availabilityLabels[member.availability]}
                  </span>
                </dd>
              </div>
              <div className="detail-row">
                <dt className="detail-row__label">Phone</dt>
                <dd className="detail-row__value">{member.phone}</dd>
              </div>
              {member.notes && (
                <div className="detail-row">
                  <dt className="detail-row__label">Notes</dt>
                  <dd className="detail-row__value">{member.notes}</dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="edit-form">
              <label className="edit-field">
                <span className="edit-field__label">Name</span>
                <input
                  className="edit-field__control"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  required
                />
              </label>
              <label className="edit-field">
                <span className="edit-field__label">Role</span>
                <input
                  className="edit-field__control"
                  value={form.role}
                  onChange={(event) => updateField('role', event.target.value)}
                  required
                />
              </label>
              <label className="edit-field">
                <span className="edit-field__label">Relationship</span>
                <input
                  className="edit-field__control"
                  value={form.relationship}
                  onChange={(event) => updateField('relationship', event.target.value)}
                  required
                />
              </label>
              <label className="edit-field">
                <span className="edit-field__label">Availability</span>
                <select
                  className="edit-field__control"
                  value={form.availability}
                  onChange={(event) => updateField('availability', event.target.value)}
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="edit-field">
                <span className="edit-field__label">Phone</span>
                <input
                  className="edit-field__control"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  required
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
              <button type="button" className="primary-btn" onClick={() => setIsEditing(true)}>
                Edit Details
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setForm({ ...member });
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="primary-btn">
                Save Changes
              </button>
            </>
          )}
        </div>
      </form>
    </dialog>
  );
}
