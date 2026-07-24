import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found - CareConnect</title>
      </Helmet>

      <div className="app-layout app-layout--wide">
        <main id="main-content" aria-labelledby="not-found-heading">
          <div className="main-content" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <h1 id="not-found-heading" className="page-title">Page Not Found</h1>
            <p style={{ margin: '1rem 0' }}>
              The page you are looking for does not exist or has been moved.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <Link to="/" className="primary-btn" style={{ textDecoration: 'none' }}>
                Go to Today&apos;s Plan
              </Link>
              <Link to="/care-team" className="secondary-btn" style={{ textDecoration: 'none' }}>
                View Care Team
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
