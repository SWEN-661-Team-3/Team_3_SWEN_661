import InlineError from './InlineError';
import SavingStatus from './SavingStatus';

export default function SettingsPanel({ settings, onChange, onSave, onReset, notifications }) {
  function handleToggle(key) {
    onChange({ ...settings, [key]: !settings[key] });
  }

  return (
    <section aria-labelledby="settings-heading">
      <h1 id="settings-heading" className="page-title">Settings</h1>
      <p>Adjust display and notification preferences.
      Tap a setting or press the Spacebar to toggle it. 
      Tap the Save Settings button to keep your changes.</p>

      <fieldset className="settings-fieldset">
        <legend>Display Preferences</legend>

        <label className="settings-row">
          <input
            type="checkbox"
            checked={settings.largeText}
            onChange={() => handleToggle('largeText')}
            aria-describedby="large-text-desc"
          />
          <span>
            Large Text
            <br />
            <small id="large-text-desc">Increases font size by 25% across the application</small>
          </span>
        </label>

        <label className="settings-row">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={() => handleToggle('highContrast')}
            aria-describedby="contrast-desc"
          />
          <span>
            High Contrast
            <br />
            <small id="contrast-desc">Maximizes color contrast for better visibility</small>
          </span>
        </label>

        <label className="settings-row">
          <input
            type="checkbox"
            checked={settings.darkTheme}
            onChange={() => handleToggle('darkTheme')}
            aria-describedby="dark-desc"
          />
          <span>
            Dark Theme
            <br />
            <small id="dark-desc">Reduces screen brightness with a dark color scheme</small>
          </span>
        </label>

        <label className="settings-row">
          <input
            type="checkbox"
            checked={settings.reduceMotion}
            onChange={() => handleToggle('reduceMotion')}
            aria-describedby="motion-desc"
          />
          <span>
            Reduce Motion
            <br />
            <small id="motion-desc">Disables animations and transitions</small>
          </span>
        </label>
      </fieldset>

      {notifications && (
        <fieldset className="settings-fieldset">
          <legend>Notifications</legend>

          <label className="settings-row">
            <input
              type="checkbox"
              checked={notifications.enabled}
              disabled={!notifications.supported || notifications.permission === 'denied' || notifications.isRequesting}
              onChange={notifications.toggle}
              aria-describedby="notif-desc"
            />
            <span>
              Task Reminders
              <br />
              <small id="notif-desc">
                {!notifications.supported
                  ? 'Notifications are not supported in this browser'
                  : notifications.permission === 'denied'
                    ? 'Notifications were blocked. Enable them in your browser settings.'
                    : 'Get notified 15 minutes before upcoming tasks'}
              </small>
            </span>
          </label>
          {notifications.supported && notifications.permission === 'default' && (
            <button type="button" className="secondary-btn" onClick={notifications.toggle} disabled={notifications.isRequesting}>
              {notifications.isRequesting ? 'Requesting permission...' : 'Enable Task Reminders'}
            </button>
          )}
          {notifications.isRequesting && <SavingStatus message="Requesting notification permission..." />}
          {notifications.notificationError && (
            <InlineError message={notifications.notificationError} onRetry={notifications.retryPermission} />
          )}
          {notifications.notificationSuccess && (
            <div className="operation-status" role="status"><p>{notifications.notificationSuccess}</p></div>
          )}
        </fieldset>
      )}

      <div className="dialog__footer" style={{ padding: 0, borderTop: 'none' }}>
        <button type="button" className="secondary-btn" onClick={onReset}>
          Reset Defaults
        </button>
        <button type="button" className="primary-btn" onClick={() => onSave(settings)}>
          Save Settings
        </button>
      </div>
    </section>
  );
}
