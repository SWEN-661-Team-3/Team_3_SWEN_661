import { Component } from 'react';
import { ROUTES } from '../routes';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  componentDidUpdate(previousProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.handleReset();
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isDev = typeof process !== 'undefined'
      ? process.env.NODE_ENV !== 'production'
      : false;

    const fallback = (
      <div className="main-content" role="alert" aria-labelledby="error-heading" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h1 id="error-heading" className="page-title">Something went wrong</h1>
          <p style={{ margin: '1rem 0' }}>
            An unexpected error occurred. You can try again or return to Today.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button type="button" className="primary-btn" onClick={this.handleReset}>
              Try Again
            </button>
            <a href={ROUTES.today} className="secondary-btn" style={{ textDecoration: 'none' }}>
              Return to Today
            </a>
          </div>

          {isDev && this.state.error && (
            <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px', marginInline: 'auto' }}>
              <summary>Technical Details (development only)</summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', padding: '1rem', background: 'var(--color-surface, #f5f5f5)', borderRadius: '0.5rem' }}>
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
      </div>
    );

    if (this.props.withinLayout) return fallback;

    return <main id="main-content">{fallback}</main>;
  }
}
