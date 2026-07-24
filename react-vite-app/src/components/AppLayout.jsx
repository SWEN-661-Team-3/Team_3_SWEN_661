import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import OfflineStatusBanner from './OfflineStatusBanner';
import { ROUTES } from '../routes';

export default function AppLayout() {
  const { pathname } = useLocation();
  const isTodayRoute = pathname === ROUTES.today;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <OfflineStatusBanner />
      <AppHeader />
      <main
        id="main-content"
        className={`app-layout${isTodayRoute ? '' : ' app-layout--wide'}`}
        tabIndex="-1"
      >
        <Outlet />
      </main>
      <AppFooter />
    </>
  );
}
