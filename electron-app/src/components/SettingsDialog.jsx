import { useRef, useEffect, useState } from 'react';

export default function SettingsDialog({ open, settings, onChange, onSave, onClose }) {
  const dialogRef = useRef(null);
  const [local, setLocal] = useState({ ...settings });

  useEffect(() => {
    setLocal({ ...settings });
  }, [settings, open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleSave(e) {
    e.preventDefault();
    onSave(local);
  }

  function handleSettingChange(name, value) {
    const nextSettings = { ...local, [name]: value };
    setLocal(nextSettings);
    onChange?.(nextSettings);
  }

  return (
    <dialog
      className="dialog"
      ref={dialogRef}
      aria-labelledby="settings-dialog-title"
      onClose={onClose}
    >
      <form className="dialog__inner" onSubmit={handleSave}>
        <header className="dialog__header">
          <h2 id="settings-dialog-title">Accessibility settings</h2>
          <button
            type="button"
            className="dialog__close"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">X</span>
          </button>
        </header>

        <div className="dialog__body">
          <fieldset className="settings-fieldset">
            <legend>Display</legend>
            <label className="settings-row">
              <input
                type="checkbox"
                checked={local.largeText}
                onChange={(e) => handleSettingChange('largeText', e.target.checked)}
              />
              <span>Larger text (125%)</span>
            </label>
            <label className="settings-row">
              <input
                type="checkbox"
                checked={local.highContrast}
                onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
              />
              <span>High contrast mode</span>
            </label>
            <label className="settings-row">
              <input
                type="checkbox"
                checked={local.darkTheme}
                onChange={(e) => handleSettingChange('darkTheme', e.target.checked)}
              />
              <span>Dark Theme</span>
            </label>
            <label className="settings-row">
              <input
                type="checkbox"
                checked={local.reduceMotion}
                onChange={(e) => handleSettingChange('reduceMotion', e.target.checked)}
              />
              <span>Reduce motion</span>
            </label>
          </fieldset>
          <fieldset className="settings-fieldset">
            <legend>Reading</legend>
            <label className="settings-row">
              <input type="checkbox" checked disabled />
              <span>Atkinson Hyperlegible font (always on)</span>
            </label>
          </fieldset>
        </div>

        <footer className="dialog__footer">
          <button type="submit" className="primary-btn">
            Save settings
          </button>
        </footer>
      </form>
    </dialog>
  );
}
