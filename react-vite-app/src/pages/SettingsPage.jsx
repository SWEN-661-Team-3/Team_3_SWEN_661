import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SettingsPanel from '../components/SettingsPanel';
import CareConnectDialog from '../components/CareConnectDialog';
import InlineError from '../components/InlineError';
import SavingStatus from '../components/SavingStatus';
import { defaultSettings, saveSettings } from '../services/settingsService';

export default function SettingsPage({ settings, onSettingsChange, notifications }) {
  const [draftSettings, setDraftSettings] = useState(() => ({ ...settings }));
  const [pendingSettings, setPendingSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  function handleSave(newSettings) {
    setPendingSettings(newSettings);
  }

  async function confirmSaveSettings() {
    if (!pendingSettings || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedSettings = await saveSettings(pendingSettings);
      onSettingsChange(savedSettings);
      setPendingSettings(null);
      setSaveSuccess('Settings saved.');
    } catch {
      setSaveError('Could not save settings. Your changes are still here. Please try again.');
    } finally {
      setIsSaving(false);
    }
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

      <div className="main-content">
        {isSaving && <SavingStatus message="Saving settings..." />}
        {saveError && <InlineError message={saveError} onRetry={confirmSaveSettings} />}
        {saveSuccess && <div className="operation-status" role="status"><p>{saveSuccess}</p></div>}
        <SettingsPanel
          settings={draftSettings}
          onChange={setDraftSettings}
          onSave={handleSave}
          onReset={handleReset}
          notifications={notifications}
        />
      </div>

      <CareConnectDialog
        open={Boolean(pendingSettings)}
        title="Save Settings?"
        message="Save these settings?"
        cancelLabel="Keep Editing"
        confirmLabel={isSaving ? 'Saving...' : 'Save Settings'}
        onCancel={() => setPendingSettings(null)}
        onConfirm={confirmSaveSettings}
        confirmDisabled={isSaving}
        cancelDisabled={isSaving}
      />
    </>
  );
}
