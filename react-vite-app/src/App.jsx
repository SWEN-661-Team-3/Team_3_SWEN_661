import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import OfflineStatusBanner from './components/OfflineStatusBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { caregivers, initialPlan } from './data/careData';
import useNotifications from './hooks/useNotifications';

const TodayPage = lazy(() => import('./pages/TodayPage'));
const CareTeamPage = lazy(() => import('./pages/CareTeamPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="app-layout app-layout--wide" role="status" aria-label="Loading page">
      <main id="main-content">
        <div className="main-content" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p>Loading...</p>
        </div>
      </main>
    </div>
  );
}

const initialAccessibilitySettings = {
  largeText: false,
  highContrast: false,
  darkTheme: false,
  reduceMotion: true,
};

export default function App() {
  const [plan, setPlan] = useState(() => structuredClone(initialPlan));
  const [helpers, setHelpers] = useState(() => structuredClone(caregivers));
  const [settings, setSettings] = useState(() => ({ ...initialAccessibilitySettings }));
  const notifications = useNotifications(plan);

  // Accessibility classes are applied to the document body so CSS can target
  // the entire page. Reduced motion must not remove functionality -- it only
  // disables decorative animations and transitions via CSS.
  useEffect(() => {
    document.body.classList.toggle('large-text', settings.largeText);
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('dark-mode', settings.darkTheme);
    document.body.classList.toggle('reduce-motion', settings.reduceMotion);

    return () => {
      document.body.classList.remove('large-text', 'high-contrast', 'dark-mode', 'reduce-motion');
    };
  }, [settings]);

  const emergencyContacts = helpers.slice(0, 2);

  return (
    <ErrorBoundary>
      <Helmet defaultTitle="CareConnect - Daily Care Management" titleTemplate="%s">
        <meta property="og:url" content="https://careconnect.app" />
        <meta property="og:site_name" content="CareConnect" />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <OfflineStatusBanner />

      <AppHeader />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={
              <TodayPage plan={plan} setPlan={setPlan} helpers={helpers} />
            }
          />
          <Route
            path="/care-team"
            element={<CareTeamPage helpers={helpers} setHelpers={setHelpers} />}
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                settings={settings}
                onSettingsChange={setSettings}
                notifications={notifications}
              />
            }
          />
          <Route
            path="/emergency"
            element={<EmergencyPage contacts={emergencyContacts} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <AppFooter />
    </ErrorBoundary>
  );
}
