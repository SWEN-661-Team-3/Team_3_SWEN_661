import { useEffect, useMemo, useRef, useState } from 'react';

const emptyHelperForm = {
  name: '',
  role: '',
  phone: '',
  notes: '',
};

const availabilityLabels = {
  available: 'available',
  away: 'away',
  offline: 'offline',
};

const helperColors = ['#1d4ed8', '#047857', '#b45309', '#7c3aed', '#be123c'];

function getInitials(name) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'H';
}

function helperToForm(helper) {
  if (!helper) return { ...emptyHelperForm };

  return {
    name: helper.name ?? '',
    role: helper.role ?? helper.relationship ?? '',
    phone: helper.phone ?? '',
    notes: helper.notes ?? '',
  };
}

export default function CareTeamPage({ helpers, onHelpersChange, onAnnounce }) {
  const [formMode, setFormMode] = useState('add');
  const [editingHelper, setEditingHelper] = useState(null);
  const [helperDialogOpen, setHelperDialogOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  function openAddDialog() {
    setFormMode('add');
    setEditingHelper(null);
    setHelperDialogOpen(true);
  }

  function openEditDialog(helper) {
    setFormMode('edit');
    setEditingHelper(helper);
    setHelperDialogOpen(true);
  }

  function closeHelperDialog() {
    setHelperDialogOpen(false);
  }

  function saveHelper(form) {
    const normalized = {
      name: form.name.trim(),
      role: form.role.trim() || 'Helper',
      phone: form.phone.trim(),
      notes: form.notes.trim(),
    };

    if (formMode === 'edit' && editingHelper) {
      onHelpersChange((current) =>
        current.map((helper) =>
          helper.id === editingHelper.id
            ? {
                ...helper,
                ...normalized,
                relationship: normalized.role,
                initials: getInitials(normalized.name),
              }
            : helper,
        ),
      );
      closeHelperDialog();
      setConfirmation({
        title: 'Helper updated',
        message: `${normalized.name}'s details were updated.`,
      });
      onAnnounce?.(`${normalized.name}'s details were updated.`);
      return;
    }

    const newHelper = {
      id: `helper-${Date.now()}`,
      ...normalized,
      relationship: normalized.role,
      availability: 'available',
      initials: getInitials(normalized.name),
      colorIndex: helpers.length % helperColors.length,
    };

    onHelpersChange((current) => [...current, newHelper]);
    closeHelperDialog();
    setConfirmation({
      title: 'Helper saved',
      message: `${normalized.name} was added to your care team.`,
    });
    onAnnounce?.(`${normalized.name} was added to your care team.`);
  }

  function confirmRemove() {
    if (!removeTarget) return;

    onHelpersChange((current) =>
      current.filter((helper) => helper.id !== removeTarget.id),
    );
    onAnnounce?.(`${removeTarget.name} was removed from your care team.`);
    setRemoveTarget(null);
  }

  return (
    <>
      <section aria-labelledby="care-team-title">
        <div className="care-team-header">
          <div>
            <h2 id="care-team-title" className="page-title">Care Team</h2>
            <p className="care-team-subtitle">
              {helpers.length} helpers on your care team
            </p>
          </div>

          <button
            type="button"
            className="primary-btn care-team-add-btn"
            onClick={openAddDialog}
          >
            <span aria-hidden="true">+</span>
            Add Helper
          </button>
        </div>

        {helpers.length > 0 ? (
          <div className="care-team-grid">
            {helpers.map((helper, index) => (
              <HelperCard
                key={helper.id}
                helper={helper}
                color={helperColors[(helper.colorIndex ?? index) % helperColors.length]}
                onEdit={() => openEditDialog(helper)}
                onRemove={() => setRemoveTarget(helper)}
              />
            ))}
          </div>
        ) : (
          <div className="care-team-empty">
            <p className="care-team-empty__title">No helpers yet</p>
            <p className="care-team-empty__copy">Add a helper to start your care team.</p>
          </div>
        )}
      </section>

      <HelperFormDialog
        open={helperDialogOpen}
        mode={formMode}
        helper={editingHelper}
        onClose={closeHelperDialog}
        onSave={saveHelper}
      />

      <RemoveHelperDialog
        helper={removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={confirmRemove}
      />

      <HelperConfirmationDialog
        confirmation={confirmation}
        onClose={() => setConfirmation(null)}
      />
    </>
  );
}

function HelperCard({ helper, color, onEdit, onRemove }) {
  const availability = helper.availability ?? 'offline';
  const availabilityLabel = availabilityLabels[availability] ?? availabilityLabels.offline;

  return (
    <article className="care-helper-card" aria-labelledby={`helper-${helper.id}-name`}>
      <div className="care-helper-card__header">
        <span
          className="care-helper-card__avatar"
          aria-hidden="true"
          style={{ '--helper-color': color }}
        >
          {helper.initials ?? getInitials(helper.name)}
        </span>
        <div>
          <h3 id={`helper-${helper.id}-name`} className="care-helper-card__name">
            {helper.name}
          </h3>
          <p className="care-helper-card__role">{helper.role ?? 'Helper'}</p>
        </div>
      </div>

      <span className={`availability-badge availability-badge--${availability}`}>
        {availabilityLabel}
      </span>

      <div className="care-helper-card__details">
        <p className="care-helper-card__phone">
          <span className="care-helper-card__meta-label">Phone: </span>
          <a href={`tel:${helper.phone}`}>{helper.phone}</a>
        </p>
        {helper.notes && (
          <p className="care-helper-card__notes">
            <span className="care-helper-card__meta-label">Notes: </span>
            {helper.notes}
          </p>
        )}
      </div>

      <div className="care-helper-card__actions">
        <button
          type="button"
          className="care-helper-card__action care-helper-card__action--edit"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          type="button"
          className="care-helper-card__action care-helper-card__action--remove"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

function HelperFormDialog({ open, mode, helper, onClose, onSave }) {
  const dialogRef = useRef(null);
  const discardDialogRef = useRef(null);
  const [form, setForm] = useState({ ...emptyHelperForm });
  const [discardOpen, setDiscardOpen] = useState(false);

  const initialForm = useMemo(() => helperToForm(helper), [helper]);
  const isAddMode = mode === 'add';
  const title = isAddMode ? 'Add Helper' : 'Edit Helper';
  const canAddHelper = Boolean(form.name.trim() && form.phone.trim());
  const hasAnyText = ['name', 'role', 'phone', 'notes'].some((field) => form[field].trim());
  const hasChanges = ['name', 'role', 'phone', 'notes'].some(
    (field) => form[field] !== initialForm[field],
  );
  const shouldConfirmClose = isAddMode ? hasAnyText : hasChanges;

  useEffect(() => {
    if (open) {
      setForm(isAddMode ? { ...emptyHelperForm } : helperToForm(helper));
      setDiscardOpen(false);
    }
  }, [helper, isAddMode, open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
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

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function requestClose() {
    if (shouldConfirmClose) {
      setDiscardOpen(true);
      return;
    }

    onClose();
  }

  function handleCancel(event) {
    event.preventDefault();
    requestClose();
  }

  function confirmDiscard() {
    setDiscardOpen(false);
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isAddMode && !canAddHelper) return;
    onSave(form);
  }

  return (
    <>
      <dialog
        className="dialog dialog--helper"
        ref={dialogRef}
        aria-labelledby="helper-dialog-title"
        onCancel={handleCancel}
        onClose={onClose}
      >
        <form className="dialog__inner" onSubmit={handleSubmit}>
          <header className="dialog__header">
            <h2 id="helper-dialog-title">{title}</h2>
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
            <HelperField
              id="helper-name"
              label="Name"
              value={form.name}
              onChange={(value) => handleChange('name', value)}
              placeholder={isAddMode ? 'Full name' : null}
              required={isAddMode}
            />

            <HelperField
              id="helper-role"
              label="Role"
              value={form.role}
              onChange={(value) => handleChange('role', value)}
              placeholder={isAddMode ? 'e.g. Family, nurse, doctor' : null}
            />

            <HelperField
              id="helper-phone"
              label="Phone"
              value={form.phone}
              onChange={(value) => handleChange('phone', value)}
              placeholder={isAddMode ? '(555)000-0000' : null}
              required={isAddMode}
            />

            <HelperField
              id="helper-notes"
              label="Notes"
              value={form.notes}
              onChange={(value) => handleChange('notes', value)}
              placeholder={isAddMode ? 'e.g. Hours, location, or any other details' : null}
              multiline
            />
          </div>

          <footer className="dialog__footer">
            <button
              type="submit"
              className="primary-btn"
              disabled={isAddMode && !canAddHelper}
            >
              {isAddMode ? 'Add helper' : 'Save'}
            </button>
          </footer>
        </form>
      </dialog>

      {discardOpen && (
        <dialog
          className="dialog dialog--discard-helper"
          ref={discardDialogRef}
          aria-labelledby="discard-helper-title"
          aria-describedby="discard-helper-message"
          onClose={() => setDiscardOpen(false)}
        >
          <form method="dialog" className="dialog__inner">
            <header className="dialog__header">
              <h2 id="discard-helper-title">Are you sure?</h2>
            </header>

            <div className="dialog__body">
              <p id="discard-helper-message" className="discard-helper-message">
                This helper has unsaved information. Close without saving?
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

function HelperField({
  id,
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  required = false,
}) {
  const inputProps = {
    id,
    className: multiline ? 'form-control form-control--textarea' : 'form-control',
    placeholder,
    value,
    onChange: (event) => onChange(event.target.value),
    'aria-required': required ? 'true' : undefined,
  };

  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      {multiline ? <textarea {...inputProps} /> : <input type="text" {...inputProps} />}
    </div>
  );
}

function RemoveHelperDialog({ helper, onClose, onConfirm }) {
  const dialogRef = useRef(null);
  const open = Boolean(helper);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!helper) return null;

  return (
    <dialog
      className="dialog dialog--remove-helper"
      ref={dialogRef}
      aria-labelledby="remove-helper-title"
      aria-describedby="remove-helper-message"
      onClose={onClose}
    >
      <form method="dialog" className="dialog__inner">
        <header className="dialog__header">
          <h2 id="remove-helper-title">Are you sure?</h2>
        </header>

        <div className="dialog__body">
          <p id="remove-helper-message" className="remove-helper-message">
            Remove {helper.name} from your care team?
          </p>
        </div>

        <footer className="dialog__footer">
          <button
            type="button"
            className="danger-btn"
            onClick={onConfirm}
          >
            Remove helper
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
          >
            Keep helper
          </button>
        </footer>
      </form>
    </dialog>
  );
}

function HelperConfirmationDialog({ confirmation, onClose }) {
  const dialogRef = useRef(null);
  const open = Boolean(confirmation);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!confirmation) return null;

  return (
    <dialog
      className="dialog dialog--confirmation"
      ref={dialogRef}
      aria-labelledby="helper-confirmation-title"
      onClose={onClose}
    >
      <form method="dialog" className="dialog__inner">
        <header className="dialog__header">
          <h2 id="helper-confirmation-title">{confirmation.title}</h2>
          <button
            type="button"
            className="dialog__close"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">X</span>
          </button>
        </header>

        <div className="confirmation-panel">
          <div className="confirmation-panel__icon" aria-hidden="true">OK</div>
          <p className="confirmation-panel__title">{confirmation.message}</p>
        </div>
      </form>
    </dialog>
  );
}
