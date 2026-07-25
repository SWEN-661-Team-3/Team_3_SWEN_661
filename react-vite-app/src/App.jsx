import { useState, useEffect, lazy } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { GlobalFeedbackProvider, useGlobalFeedback } from './components/GlobalFeedbackContext';
import LoadingStatus from './components/LoadingStatus';
import NotificationRouteGuard from './components/NotificationRouteGuard';
import useNotifications from './hooks/useNotifications';
import { ROUTES, ROUTE_SEGMENTS } from './routes';
import { getCarePlan } from './services/carePlanService';
import { getCareTeam } from './services/careTeamService';
import { defaultSettings, getSettings } from './services/settingsService';

const TodayPage = lazy(() => import('./pages/TodayPage'));
const CareTeamPage = lazy(() => import('./pages/CareTeamPage'));
const CaregiverDetailPage = lazy(() => import('./pages/CaregiverDetailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotificationSettingsPage = lazy(() => import('./pages/NotificationSettingsPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <GlobalFeedbackProvider>
      <AppContent />
    </GlobalFeedbackProvider>
  );
}

function AppContent() {
  const { pathname } = useLocation();
  const [plan, setPlan] = useState(null);
  const [helpers, setHelpers] = useState(null);
  const [settings, setSettings] = useState(() => structuredClone(defaultSettings));
  const [loadError, setLoadError] = useState(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const notifications = useNotifications(plan ?? []);
  const { dismissFeedback, showFeedback } = useGlobalFeedback();
  const loadingMessage = pathname.startsWith(ROUTES.careTeam)
    ? 'Loading care team...'
    : pathname.startsWith(ROUTES.settings)
      ? 'Loading settings...'
      : pathname === ROUTES.emergency
        ? 'Loading emergency contacts...'
        : "Loading today's plan...";

  useEffect(() => {
    let isCurrent = true;

    Promise.all([getCarePlan(), getCareTeam(), getSettings()])
      .then(([loadedPlan, loadedTeam, loadedSettings]) => {
        if (!isCurrent) return;
        setPlan(loadedPlan);
        setHelpers(loadedTeam);
        setSettings(loadedSettings);
        setLoadError(null);
        dismissFeedback();
      })
      .catch((error) => {
        if (!isCurrent) return;
        setLoadError(error);
        showFeedback({
          type: 'error',
          text: 'CareConnect could not load your session data. Please try again.',
          onRetry: () => setLoadAttempt((attempt) => attempt + 1),
        });
      });

    return () => {
      isCurrent = false;
    };
  }, [loadAttempt, dismissFeedback, showFeedback]);

  // These body classes let CSS apply preferences across route content. Large
  // text and high contrast change readability, while reduced motion removes
  // only decorative motion so controls and timing-dependent flows still work.
  useEffect(() => {
    document.body.classList.toggle('large-text', settings.largeText);
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('dark-mode', settings.darkTheme);
    document.body.classList.toggle('reduce-motion', settings.reduceMotion);

    return () => {
      document.body.classList.remove('large-text', 'high-contrast', 'dark-mode', 'reduce-motion');
    };
  }, [settings]);

  if (loadError) {
    return (
      <AppLayout>
        <div className="main-content" />
      </AppLayout>
    );
  }

  if (!plan || !helpers) {
    return (
      <AppLayout>
        <div className="main-content">
          <LoadingStatus message={loadingMessage} />
        </div>
      </AppLayout>
    );
  }

  const emergencyContacts = helpers.slice(0, 2);

  return (
    <>
      <Helmet defaultTitle="CareConnect - Daily Care Management" titleTemplate="%s">
        <meta property="og:url" content="https://careconnect.app" />
        <meta property="og:site_name" content="CareConnect" />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      <ErrorBoundary>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              path={ROUTES.home}
              element={<Navigate to={ROUTES.today} replace />}
            />
            <Route
              path={ROUTES.today}
              element={<TodayPage plan={plan} setPlan={setPlan} helpers={helpers} />}
            />
            <Route path={ROUTES.careTeam}>
              <Route index element={<CareTeamPage helpers={helpers} setHelpers={setHelpers} />} />
              <Route
                path={ROUTE_SEGMENTS.caregiverId}
                element={<CaregiverDetailPage helpers={helpers} setHelpers={setHelpers} />}
              />
            </Route>
            <Route path={ROUTES.settings}>
              <Route
                index
                element={<SettingsPage settings={settings} onSettingsChange={setSettings} notifications={notifications} />}
              />
              <Route
                path={ROUTE_SEGMENTS.notifications}
                element={
                  <NotificationRouteGuard>
                    <NotificationSettingsPage
                      settings={settings}
                      onSettingsChange={setSettings}
                      notifications={notifications}
                    />
                  </NotificationRouteGuard>
                }
              />
            </Route>
            <Route path={ROUTES.emergency} element={<EmergencyPage contacts={emergencyContacts} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </>
  );
}
