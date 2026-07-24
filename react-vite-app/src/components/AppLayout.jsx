import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import OfflineStatusBanner from './OfflineStatusBanner';
import ErrorBoundary from './ErrorBoundary';
import GlobalOperationBanner from './GlobalOperationBanner';
import { useGlobalFeedback } from './GlobalFeedbackContext';
import { ROUTES } from '../routes';

function PageLoader() {
  return (
    <div className="main-content" role="status" aria-label="Loading page">
      <p>Loading...</p>
    </div>
  );
}

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  const isTodayRoute = pathname === ROUTES.today;
  const { message, dismissFeedback } = useGlobalFeedback();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <OfflineStatusBanner />
      <AppHeader />
      {message && (
        <GlobalOperationBanner
          type={message.type}
          message={message.text}
          onDismiss={dismissFeedback}
          onRetry={message.onRetry}
        />
      )}
      <main
        id="main-content"
        className={`app-layout${isTodayRoute ? '' : ' app-layout--wide'}`}
        tabIndex="-1"
      >
        <ErrorBoundary withinLayout resetKey={pathname}>
          <Suspense fallback={<PageLoader />}>
            {children ?? <Outlet />}
          </Suspense>
        </ErrorBoundary>
      </main>
      <AppFooter />
    </>
  );
}
