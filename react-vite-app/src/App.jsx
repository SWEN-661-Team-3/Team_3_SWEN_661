import { useState, useEffect, lazy } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationRouteGuard from './components/NotificationRouteGuard';
import { caregivers, initialPlan } from './data/careData';
import useNotifications from './hooks/useNotifications';
import { ROUTES, ROUTE_SEGMENTS } from './routes';

const TodayPage = lazy(() => import('./pages/TodayPage'));
const CareTeamPage = lazy(() => import('./pages/CareTeamPage'));
const CaregiverDetailPage = lazy(() => import('./pages/CaregiverDetailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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
                    <SettingsPage settings={settings} onSettingsChange={setSettings} notifications={notifications} />
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
