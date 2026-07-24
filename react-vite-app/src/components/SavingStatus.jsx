export default function SavingStatus({ message = 'Saving changes...' }) {
  return (
    <div className="operation-status operation-status--saving" role="status" aria-live="polite" aria-atomic="true">
      <p>{message}</p>
    </div>
  );
}
