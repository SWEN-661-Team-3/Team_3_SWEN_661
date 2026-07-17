import { Helmet } from 'react-helmet-async';
import SettingsPanel from '../components/SettingsPanel';

const defaultSettings = {
  largeText: false,
  highContrast: false,
  darkTheme: false,
  reduceMotion: true,
};

export default function SettingsPage({ settings, onSettingsChange }) {
  function handleSave(newSettings) {
    onSettingsChange(newSettings);
  }

  function handleReset() {
    onSettingsChange({ ...defaultSettings });
  }

  return (
    <>
      <Helmet>
        <title>Settings - CareConnect</title>
        <meta name="description" content="Adjust accessibility and display settings for CareConnect." />
        <meta property="og:title" content="Settings - CareConnect" />
        <meta property="og:description" content="Customize your CareConnect experience with accessibility settings." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="app-layout app-layout--wide">
        <main id="main-content" role="main" aria-label="Application settings">
          <div className="main-content">
            <SettingsPanel
              settings={settings}
              onChange={onSettingsChange}
              onSave={handleSave}
              onReset={handleReset}
            />
          </div>
        </main>
      </div>
    </>
  );
}
