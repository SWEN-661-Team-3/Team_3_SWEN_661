import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found - CareConnect</title>
      </Helmet>

      <div className="main-content" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h1 id="not-found-heading" className="page-title">Page Not Found</h1>
        <p style={{ margin: '1rem 0' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Link to={ROUTES.today} className="primary-btn" style={{ textDecoration: 'none' }}>
            Go to Today&apos;s Plan
          </Link>
          <Link to={ROUTES.careTeam} className="secondary-btn" style={{ textDecoration: 'none' }}>
            View Care Team
          </Link>
        </div>
      </div>
    </>
  );
}
