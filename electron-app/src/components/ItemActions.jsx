export default function ItemActions({ itemLabel, onEdit, onRemove, className = '' }) {
  return (
    <div className={['item-actions', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="item-action item-action--edit"
        aria-label={`Edit ${itemLabel}`}
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        type="button"
        className="item-action item-action--remove"
        aria-label={`Remove ${itemLabel}`}
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
}
