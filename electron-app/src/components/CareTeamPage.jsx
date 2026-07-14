import { useEffect, useMemo, useRef, useState } from 'react';
import ItemActions from './ItemActions';
import RemoveItemDialog from './RemoveItemDialog';
import ConfirmationDialog from './ConfirmationDialog';
import { showModalWithInitialFocus } from '../dialogFocus';

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

const helperColors = ['#1C4CCE', '#046248', '#8A4500', '#6A1FEA', '#AD1037'];

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
  const [selectedHelperId, setSelectedHelperId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const selectedHelper = helpers.find((helper) => helper.id === selectedHelperId) ?? null;

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

  function openHelperDetail(helper) {
    setSelectedHelperId(helper.id);
    setDetailOpen(true);
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
        message: `${normalized.name} was updated.`,
      });
      onAnnounce?.(`${normalized.name} was updated.`);
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
    setSelectedHelperId(null);
    setDetailOpen(false);
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
                onOpen={() => openHelperDetail(helper)}
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

      <RemoveItemDialog
        itemName={removeTarget?.name}
        itemType="helper"
        message={removeTarget ? `Remove ${removeTarget.name} from your care team?` : ''}
        confirmLabel="Remove helper"
        keepLabel="Keep helper"
        onClose={() => setRemoveTarget(null)}
        onConfirm={confirmRemove}
      />

      <HelperDetailDialog
        helper={selectedHelper}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={() => openEditDialog(selectedHelper)}
        onRemove={() => setRemoveTarget(selectedHelper)}
      />

      <ConfirmationDialog
        confirmation={confirmation}
        onClose={() => setConfirmation(null)}
      />
    </>
  );
}

function HelperCard({ helper, color, onOpen }) {
  const availability = helper.availability ?? 'offline';
  const availabilityLabel = availabilityLabels[availability] ?? availabilityLabels.offline;

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  }

  return (
    <article
      className="care-helper-card"
      role="button"
      tabIndex={0}
      aria-label={`${helper.name}, ${helper.role ?? 'Helper'}, ${availabilityLabel}. Phone: ${helper.phone}. Press Enter to view details.`}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div aria-hidden="true">
        <div className="care-helper-card__header">
          <span
            className="care-helper-card__avatar"
            style={{ '--helper-color': color }}
          >
            {helper.initials ?? getInitials(helper.name)}
          </span>
          <div>
            <h3 className="care-helper-card__name">
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
            {helper.phone}
          </p>
          {helper.notes && (
            <p className="care-helper-card__notes">
              <span className="care-helper-card__meta-label">Notes: </span>
              {helper.notes}
            </p>
          )}
        </div>
        <span className="care-helper-card__hint">Open details</span>
      </div>
    </article>
  );
}
function HelperDetailDialog({ helper, open, onClose, onEdit, onRemove }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) showModalWithInitialFocus(dialog);
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!helper) return null;

  const availability = helper.availability ?? 'offline';
  const availabilityLabel = availabilityLabels[availability] ?? availabilityLabels.offline;

  return (
    <dialog
      className="dialog"
      ref={dialogRef}
      aria-labelledby="helper-detail-title"
      onClose={onClose}
    >
      <div className="dialog__inner">
        <header className="dialog__header">
          <h2 id="helper-detail-title">{helper.name}</h2>
          <button type="button" className="dialog__close" aria-label="Close" onClick={onClose}>
            <span aria-hidden="true">X</span>
          </button>
        </header>

        <div className="dialog__body">
          <dl className="detail-list">
            <div className="detail-row">
              <dt className="detail-row__label">Availability</dt>
              <dd className="detail-row__value">
                <span className={`availability-badge availability-badge--${availability}`}>
                  {availabilityLabel}
                </span>
              </dd>
            </div>
            <div className="detail-row">
              <dt className="detail-row__label">Role</dt>
              <dd className="detail-row__value">{helper.role ?? 'Helper'}</dd>
            </div>
            <div className="detail-row">
              <dt className="detail-row__label">Phone</dt>
              <dd className="detail-row__value"><a href={`tel:${helper.phone}`}>{helper.phone}</a></dd>
            </div>
            {helper.notes && (
              <div className="detail-row">
                <dt className="detail-row__label">Notes</dt>
                <dd className="detail-row__value">{helper.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <footer className="dialog__footer dialog__footer--item-actions">
          <ItemActions itemLabel={helper.name} onEdit={onEdit} onRemove={onRemove} />
        </footer>
      </div>
    </dialog>
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
  const canSaveHelper = Boolean(form.name.trim() && form.phone.trim());
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
    if (open && !dialog.open) showModalWithInitialFocus(dialog);
    if (!open && dialog.open) {
      setDiscardOpen(false);
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = discardDialogRef.current;
    if (!dialog) return;
    if (discardOpen && !dialog.open) showModalWithInitialFocus(dialog);
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
    if (!canSaveHelper) return;
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
              disabled={!canSaveHelper}
            >
              {isAddMode ? 'Add helper' : 'Save'}
            </button>
          </footer>
        </form>
      </dialog>

      {discardOpen && (
        <dialog
          className="dialog dialog--discard-item"
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
              <p id="discard-helper-message" className="discard-item-message">
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
