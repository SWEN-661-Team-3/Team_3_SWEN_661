import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';

export function supportsNotificationSettings() {
  return (
    typeof window !== 'undefined'
    && typeof window.Notification !== 'undefined'
    && typeof navigator !== 'undefined'
    && 'serviceWorker' in navigator
  );
}

export default function NotificationRouteGuard({ children }) {
  if (supportsNotificationSettings()) return children;

  return (
    <div className="main-content">
      <section aria-labelledby="notification-settings-unavailable-heading">
        <h1 id="notification-settings-unavailable-heading" className="page-title">
          Notification Settings Unavailable
        </h1>
        <p>
          This browser does not support both notifications and service workers, so task reminders
          cannot be configured here.
        </p>
        <Link to={ROUTES.settings} className="secondary-btn">
          Back to Settings
        </Link>
      </section>
    </div>
  );
}
