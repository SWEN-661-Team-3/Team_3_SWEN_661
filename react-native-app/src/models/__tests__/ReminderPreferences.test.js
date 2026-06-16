import {
  createReminderPreferences, copyPreferences,
  prefsToJson, prefsFromJson, DEFAULT_PREFS,
} from '../ReminderPreferences';

describe('ReminderPreferences', () => {
  test('creates with defaults', () => {
    const p = createReminderPreferences();
    expect(p).toEqual(DEFAULT_PREFS);
  });

  test('creates with overrides', () => {
    const p = createReminderPreferences({ sound: false, timing: '5-min-early' });
    expect(p.sound).toBe(false);
    expect(p.timing).toBe('5-min-early');
    expect(p.vibration).toBe(true);
  });

  test('copyPreferences applies overrides', () => {
    const original = createReminderPreferences();
    const copy = copyPreferences(original, { persistent: true });
    expect(copy.persistent).toBe(true);
    expect(original.persistent).toBe(false);
  });

  test('toJson/fromJson round-trip', () => {
    const p = createReminderPreferences({ sound: false, timing: '15-min-early' });
    const json = prefsToJson(p);
    const restored = prefsFromJson(json);
    expect(restored).toEqual(p);
  });

  test('fromJson handles missing fields', () => {
    const restored = prefsFromJson({});
    expect(restored).toEqual(DEFAULT_PREFS);
  });

  test('fromJson handles null', () => {
    const restored = prefsFromJson(null);
    expect(restored).toEqual(DEFAULT_PREFS);
  });
});
