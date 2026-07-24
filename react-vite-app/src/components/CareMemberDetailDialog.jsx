import { useEffect, useRef, useState } from 'react';
import CareConnectDialog from './CareConnectDialog';
import FieldHelpText from './FieldHelpText';
import { CAREGIVER_PHONE_MIN_DIGITS, validateCaregiver } from '../utils/formValidation';

function describedBy(...ids) {
  return ids.filter(Boolean).join(' ');
}

const availabilityLabels = {
  available: 'Available',
  away: 'Away',
  offline: 'Offline',
};

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function CareMemberDetailDialog({ member, open, mode = 'view', onClose, onSave, onRemove }) {
  const dialogRef = useRef(null);
  const fieldRefs = useRef({});
  const [isEditing, setIsEditing] = useState(mode === 'add');
  const [form, setForm] = useState(() => (member ? { ...member } : null));
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.classList.remove('dialog--enter');
      el.showModal();
      void el.offsetWidth;
      el.classList.add('dialog--enter');
    } else {
      el.close();
    }
  }, [open]);

  if (!member || !form) return null;

  const titleId = `care-member-detail-title-${member.id}`;
  const isAdding = mode === 'add';
  const title = isAdding ? 'Add Care Team Member' : member.name;
  const savedForm = {
    ...member,
    name: member.name.trim(),
    role: member.role.trim(),
    relationship: member.relationship.trim(),
    phone: member.phone.trim(),
    notes: (member.notes ?? '').trim(),
    email: (member.email ?? '').trim(),
  };
  const currentForm = {
    ...form,
    name: form.name.trim(),
    role: form.role.trim(),
    relationship: form.relationship.trim(),
    phone: form.phone.trim(),
    notes: (form.notes ?? '').trim(),
    email: (form.email ?? '').trim(),
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
    onClose();
  }

  function handleSave() {
    const nextErrors = validateCaregiver(currentForm);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalidField = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => fieldRefs.current[firstInvalidField]?.focus());
      return;
    }
    setErrors({});
    const nextMember = {
      ...currentForm,
      initials: getInitials(currentForm.name) || member.initials,
    };
    const didSave = onSave(nextMember);
    if (didSave) setIsEditing(false);
  }

  return (
    <>
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <div className="dialog__inner">
        <div className="dialog__header">
          <h2 id={titleId}>{title}</h2>
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
              {Object.keys(errors).length > 0 && (
                <div className="operation-status operation-status--error" role="alert" tabIndex="-1">
                  <p>Please correct the highlighted caregiver fields.</p>
                </div>
              )}
              <label className="edit-field" htmlFor="caregiver-name">
                <span className="edit-field__label"><strong>Name</strong> <em>(required)</em></span>
                <input
                  id="caregiver-name"
                  ref={(element) => { fieldRefs.current.name = element; }}
                  className="edit-field__control"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'caregiver-name-error' : undefined}
                />
                {errors.name && <span id="caregiver-name-error" className="field-error">{errors.name}</span>}
              </label>
              <label className="edit-field" htmlFor="caregiver-role">
                <span className="edit-field__label"><strong>Role</strong> <em>(required)</em></span>
                <input
                  id="caregiver-role"
                  className="edit-field__control"
                  value={form.role}
                  onChange={(event) => updateField('role', event.target.value)}
                  required
                />
              </label>
              <label className="edit-field" htmlFor="caregiver-relationship">
                <span className="edit-field__label"><strong>Relationship</strong> <em>(required)</em></span>
                <input
                  id="caregiver-relationship"
                  ref={(element) => { fieldRefs.current.relationship = element; }}
                  className="edit-field__control"
                  value={form.relationship}
                  onChange={(event) => updateField('relationship', event.target.value)}
                  required
                  aria-invalid={Boolean(errors.relationship)}
                  aria-describedby={errors.relationship ? 'caregiver-relationship-error' : undefined}
                />
                {errors.relationship && <span id="caregiver-relationship-error" className="field-error">{errors.relationship}</span>}
              </label>
              <label className="edit-field" htmlFor="caregiver-phone">
                <span className="edit-field__label"><strong>Phone</strong> <em>(required)</em></span>
                <input
                  id="caregiver-phone"
                  ref={(element) => { fieldRefs.current.phone = element; }}
                  className="edit-field__control"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  required
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy('caregiver-phone-help', errors.phone && 'caregiver-phone-error')}
                />
                <FieldHelpText id="caregiver-phone-help">
                  Enter at least {CAREGIVER_PHONE_MIN_DIGITS} digits.
                </FieldHelpText>
                {errors.phone && <span id="caregiver-phone-error" className="field-error">{errors.phone}</span>}
              </label>
              <label className="edit-field edit-field--full" htmlFor="caregiver-email">
                <span className="edit-field__label">Email (optional)</span>
                <input
                  id="caregiver-email"
                  ref={(element) => { fieldRefs.current.email = element; }}
                  className="edit-field__control"
                  type="email"
                  value={form.email ?? ''}
                  onChange={(event) => updateField('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy('caregiver-email-help', errors.email && 'caregiver-email-error')}
                />
                <FieldHelpText id="caregiver-email-help">Optional. Example: name@example.com.</FieldHelpText>
                {errors.email && <span id="caregiver-email-error" className="field-error">{errors.email}</span>}
              </label>
              <label className="edit-field edit-field--full" htmlFor="caregiver-notes">
                <span className="edit-field__label">Notes</span>
                <textarea
                  id="caregiver-notes"
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
                className="primary-btn"
                onClick={() => {
                  setForm({ ...member });
                  setIsEditing(true);
                }}
              >
                Edit Details
              </button>
              {!isAdding && (
                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => setConfirmRemoveOpen(true)}
                >
                  Remove Helper
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
                {isAdding ? 'Add Member' : 'Save Changes'}
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
      <CareConnectDialog
        open={confirmRemoveOpen}
        title="Remove Helper?"
        message={`Remove ${member.name} from the care team?`}
        cancelLabel="Keep Helper"
        confirmLabel="Remove Helper"
        variant="destructive"
        onCancel={() => setConfirmRemoveOpen(false)}
        onConfirm={() => {
          setConfirmRemoveOpen(false);
          onRemove(member.id);
        }}
      />
    </>
  );
}
