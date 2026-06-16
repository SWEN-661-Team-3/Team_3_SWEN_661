export const DEFAULT_SETTINGS = {
  textSize: 'large',
  contrast: 'standard',
  theme: 'light',
  spacing: 'standard',
  motion: 'reduced',
  screenReader: 'off',
};

export function createAccessibilitySettings(overrides = {}) {
  return { ...DEFAULT_SETTINGS, ...overrides };
}

export function copySettings(settings, overrides = {}) {
  return { ...settings, ...overrides };
}

export function settingsToJson(settings) {
  return { ...settings };
}

export function settingsFromJson(json) {
  return {
    textSize: json?.textSize ?? DEFAULT_SETTINGS.textSize,
    contrast: json?.contrast ?? DEFAULT_SETTINGS.contrast,
    theme: json?.theme ?? DEFAULT_SETTINGS.theme,
    spacing: json?.spacing ?? DEFAULT_SETTINGS.spacing,
    motion: json?.motion ?? DEFAULT_SETTINGS.motion,
    screenReader: json?.screenReader ?? DEFAULT_SETTINGS.screenReader,
  };
}

export function getActiveLabels(settings) {
  const labels = [];
  if (settings.textSize === 'extra-large') labels.push('Extra Large Text');
  if (settings.textSize === 'large') labels.push('Large Text');
  if (settings.contrast === 'high') labels.push('High Contrast Colors');
  if (settings.theme === 'dark') labels.push('Dark Mode');
  if (settings.spacing === 'wide') labels.push('Wide Spacing');
  if (settings.motion === 'reduced') labels.push('Reduced Motion');
  if (settings.screenReader === 'on') labels.push('Screen Reader Support');
  return labels;
}
