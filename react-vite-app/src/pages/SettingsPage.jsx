import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SettingsPanel from '../components/SettingsPanel';
import CareConnectDialog from '../components/CareConnectDialog';
import InlineError from '../components/InlineError';
import SavingStatus from '../components/SavingStatus';
import { defaultSettings, saveSettings } from '../services/settingsService';

export default function SettingsPage({ settings, onSettingsChange, notifications }) {
  const [draftSettings, setDraftSettings] = useState(() => ({ ...settings }));
  const savedSettingsRef = useRef({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  // Preferences are previewed immediately. Leaving before Save restores the
  // last persisted values, so previewing does not make a change permanent.
  useEffect(() => () => {
    onSettingsChange(savedSettingsRef.current);
  }, [onSettingsChange]);

  function handleChange(nextSettings) {
    setDraftSettings(nextSettings);
    onSettingsChange(nextSettings);
  }

  async function handleSave() {
    if (isSaving) return;
    const settingsToSave = draftSettings;
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedSettings = await saveSettings(settingsToSave);
      savedSettingsRef.current = savedSettings;
      onSettingsChange(savedSettings);
      setSaveSuccess(true);
    } catch {
      setSaveError('Could not save settings. Your changes are still here. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    handleChange({ ...defaultSettings });
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

      <div className="main-content">
        {isSaving && <SavingStatus message="Saving settings..." />}
        {saveError && <InlineError message={saveError} onRetry={handleSave} />}
        <SettingsPanel
          settings={draftSettings}
          onChange={handleChange}
          onSave={handleSave}
          onReset={handleReset}
          notifications={notifications}
        />
      </div>

      <CareConnectDialog
        open={saveSuccess}
        title="Settings Saved"
        message="Your settings have been saved."
        onConfirm={() => setSaveSuccess(false)}
      />
    </>
  );
}
