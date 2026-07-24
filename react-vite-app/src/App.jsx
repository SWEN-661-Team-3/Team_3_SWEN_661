import { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppLayout from './components/AppLayout';
import TodayPage from './pages/TodayPage';
import CareTeamPage from './pages/CareTeamPage';
import SettingsPage from './pages/SettingsPage';
import EmergencyPage from './pages/EmergencyPage';
import { caregivers, initialPlan } from './data/careData';
import useNotifications from './hooks/useNotifications';
import { ROUTES, ROUTE_SEGMENTS } from './routes';

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

      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.home} element={<Navigate to={ROUTES.today} replace />} />
          <Route
            path={ROUTES.today}
            element={<TodayPage plan={plan} setPlan={setPlan} helpers={helpers} />}
          />
          <Route path={ROUTES.careTeam}>
            <Route index element={<CareTeamPage helpers={helpers} setHelpers={setHelpers} />} />
            <Route
              path={ROUTE_SEGMENTS.caregiverId}
              element={<CareTeamPage helpers={helpers} setHelpers={setHelpers} />}
            />
          </Route>
          <Route path={ROUTES.settings}>
            <Route
              index
              element={<SettingsPage settings={settings} onSettingsChange={setSettings} notifications={notifications} />}
            />
            <Route
              path={ROUTE_SEGMENTS.notifications}
              element={<SettingsPage settings={settings} onSettingsChange={setSettings} notifications={notifications} />}
            />
          </Route>
          <Route path={ROUTES.emergency} element={<EmergencyPage contacts={emergencyContacts} />} />
        </Route>
      </Routes>
    </>
  );
}
