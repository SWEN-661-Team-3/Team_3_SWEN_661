export default function LoadingStatus({ message = 'Loading...' }) {
  return (
    <div className="operation-status operation-status--loading" role="status" aria-live="polite" aria-atomic="true">
      <p>{message}</p>
    </div>
  );
}
