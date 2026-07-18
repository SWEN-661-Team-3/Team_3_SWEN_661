export default function SettingsPanel({ settings, onChange, onSave, onReset }) {
  function handleToggle(key) {
    onChange({ ...settings, [key]: !settings[key] });
  }

  return (
    <section aria-labelledby="settings-heading">
      <h1 id="settings-heading" className="page-title">Accessibility Settings</h1>
      <p>Adjust display preferences to improve readability and comfort.</p>

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
