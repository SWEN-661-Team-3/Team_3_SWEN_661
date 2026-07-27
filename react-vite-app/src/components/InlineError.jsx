export default function InlineError({ message, onRetry, retryLabel = 'Try Again' }) {
  return (
    <div className="operation-status operation-status--error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="secondary-btn" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}
