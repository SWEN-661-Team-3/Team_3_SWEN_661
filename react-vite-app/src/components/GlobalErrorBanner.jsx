export default function GlobalErrorBanner({ title = 'Something went wrong', message, onRetry, retryLabel = 'Try Again' }) {
  return (
    <section className="global-error-banner" role="alert" aria-labelledby="global-error-title">
      <div>
        <h2 id="global-error-title">{title}</h2>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button type="button" className="secondary-btn" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </section>
  );
}
