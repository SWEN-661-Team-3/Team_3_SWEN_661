import {
  createAccessibilitySettings, copySettings,
  settingsToJson, settingsFromJson, getActiveLabels,
  DEFAULT_SETTINGS,
} from '../AccessibilitySettings';

describe('AccessibilitySettings', () => {
  test('creates with defaults', () => {
    const s = createAccessibilitySettings();
    expect(s).toEqual(DEFAULT_SETTINGS);
  });

  test('creates with overrides', () => {
    const s = createAccessibilitySettings({ textSize: 'extra-large', contrast: 'high' });
    expect(s.textSize).toBe('extra-large');
    expect(s.contrast).toBe('high');
    expect(s.theme).toBe('light');
  });

  test('copySettings applies overrides', () => {
    const s = createAccessibilitySettings();
    const copy = copySettings(s, { theme: 'dark' });
    expect(copy.theme).toBe('dark');
    expect(copy.textSize).toBe('large');
  });

  test('toJson/fromJson round-trip', () => {
    const s = createAccessibilitySettings({ textSize: 'extra-large', contrast: 'high' });
    const json = settingsToJson(s);
    const restored = settingsFromJson(json);
    expect(restored).toEqual(s);
  });

  test('fromJson handles missing fields', () => {
    const restored = settingsFromJson({});
    expect(restored).toEqual(DEFAULT_SETTINGS);
  });

  test('fromJson handles null', () => {
    const restored = settingsFromJson(null);
    expect(restored).toEqual(DEFAULT_SETTINGS);
  });

  test('getActiveLabels returns correct labels', () => {
    expect(getActiveLabels(DEFAULT_SETTINGS)).toEqual(['Large Text', 'Reduced Motion']);
    expect(getActiveLabels({ ...DEFAULT_SETTINGS, textSize: 'extra-large', contrast: 'high' }))
      .toContain('Extra Large Text');
    expect(getActiveLabels({ ...DEFAULT_SETTINGS, theme: 'dark' })).toContain('Dark Mode');
    expect(getActiveLabels({ ...DEFAULT_SETTINGS, screenReader: 'on' })).toContain('Screen Reader Support');
    expect(getActiveLabels({ ...DEFAULT_SETTINGS, spacing: 'wide' })).toContain('Wide Spacing');
  });
});
