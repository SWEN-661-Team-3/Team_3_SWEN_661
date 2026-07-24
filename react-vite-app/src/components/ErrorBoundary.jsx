import { Component } from 'react';

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

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isDev = typeof process !== 'undefined'
      ? process.env.NODE_ENV !== 'production'
      : false;

    return (
      <main id="main-content" role="alert" aria-labelledby="error-heading">
        <div className="main-content" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h1 id="error-heading" className="page-title">Something went wrong</h1>
          <p style={{ margin: '1rem 0' }}>
            An unexpected error occurred. You can try again or return to the home page.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button type="button" className="primary-btn" onClick={this.handleReset}>
              Try Again
            </button>
            <a href="/" className="secondary-btn" style={{ textDecoration: 'none' }}>
              Return Home
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
      </main>
    );
  }
}
