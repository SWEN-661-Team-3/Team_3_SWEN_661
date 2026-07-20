import { useEffect, useState } from 'react';

const offlineMessage = 'You are offline. Some information may be outdated, and some actions may be unavailable.';

export default function OfflineStatusBanner() {
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator !== 'undefined' && !navigator.onLine,
  );

  useEffect(() => {
    const showOffline = () => setIsOffline(true);
    const showOnline = () => setIsOffline(false);

    window.addEventListener('offline', showOffline);
    window.addEventListener('online', showOnline);

    return () => {
      window.removeEventListener('offline', showOffline);
      window.removeEventListener('online', showOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="offline-status-banner" role="status" aria-live="polite" aria-atomic="true">
      <span className="offline-status-banner__icon" aria-hidden="true">!</span>
      <p><strong>Offline status:</strong> {offlineMessage}</p>
    </div>
  );
}
