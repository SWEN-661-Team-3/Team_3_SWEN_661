import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SettingsPanel from '../components/SettingsPanel';
import CareConnectDialog from '../components/CareConnectDialog';

const defaultSettings = {
  largeText: false,
  highContrast: false,
  darkTheme: false,
  reduceMotion: true,
};

export default function SettingsPage({ settings, onSettingsChange, notifications }) {
  const [draftSettings, setDraftSettings] = useState(() => ({ ...settings }));
  const [pendingSettings, setPendingSettings] = useState(null);

  function handleSave(newSettings) {
    setPendingSettings(newSettings);
  }

  function confirmSaveSettings() {
    onSettingsChange(pendingSettings);
    setPendingSettings(null);
  }

  function handleReset() {
    setDraftSettings({ ...defaultSettings });
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
        <main id="main-content" aria-labelledby="settings-heading">
          <div className="main-content">
            <SettingsPanel
              settings={draftSettings}
              onChange={setDraftSettings}
              onSave={handleSave}
              onReset={handleReset}
              notifications={notifications}
            />
          </div>
        </main>
      </div>

      <CareConnectDialog
        open={Boolean(pendingSettings)}
        title="Save Settings?"
        message="Save these settings?"
        cancelLabel="Keep Editing"
        confirmLabel="Save Settings"
        onCancel={() => setPendingSettings(null)}
        onConfirm={confirmSaveSettings}
      />
    </>
  );
}
