const titles = {
  success: 'Success',
  error: 'Action failed',
  info: 'Information',
};

export default function GlobalOperationBanner({ type = 'info', message, onDismiss, onRetry }) {
  const isError = type === 'error';

  // Errors use an assertive alert because recovery needs prompt attention;
  // success and informational updates are polite. Local forms announce their
  // own validation, so this banner is reserved for cross-page operations.
  return (
    <section
      className={`global-operation-banner global-operation-banner--${type}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? undefined : 'polite'}
      aria-atomic="true"
    >
      <div>
        <h2>{titles[type] ?? titles.info}</h2>
        <p>{message}</p>
      </div>
      <div className="global-operation-banner__actions">
        {onRetry && (
          <button type="button" className="primary-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
        <button type="button" className="secondary-btn" onClick={onDismiss}>
          Dismiss message
        </button>
      </div>
    </section>
  );
}
