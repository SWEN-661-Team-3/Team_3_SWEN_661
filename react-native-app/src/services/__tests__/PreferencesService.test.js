import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveAccessibilitySettings,
  loadAccessibilitySettings,
  saveReminderPreferences,
  loadReminderPreferences,
  saveOnboarded,
  loadOnboarded,
} from '../PreferencesService';
import { createAccessibilitySettings } from '../../models/AccessibilitySettings';
import { createReminderPreferences } from '../../models/ReminderPreferences';

describe('PreferencesService', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
  });

  test('saveAccessibilitySettings persists JSON', async () => {
    const settings = createAccessibilitySettings({ textSize: 'extra-large' });
    await saveAccessibilitySettings(settings);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'accessibility_settings',
      JSON.stringify(settings),
    );
  });

  test('loadAccessibilitySettings returns defaults when empty', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const settings = await loadAccessibilitySettings();
    expect(settings.textSize).toBe('large');
  });

  test('loadAccessibilitySettings parses stored JSON', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ textSize: 'medium', contrast: 'high' }));
    const settings = await loadAccessibilitySettings();
    expect(settings.textSize).toBe('medium');
    expect(settings.contrast).toBe('high');
  });

  test('loadAccessibilitySettings handles invalid JSON', async () => {
    AsyncStorage.getItem.mockResolvedValue('not-json');
    const settings = await loadAccessibilitySettings();
    expect(settings.textSize).toBe('large');
  });

  test('saveReminderPreferences persists JSON', async () => {
    const prefs = createReminderPreferences({ sound: false });
    await saveReminderPreferences(prefs);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'reminder_preferences',
      JSON.stringify(prefs),
    );
  });

  test('loadReminderPreferences returns defaults when empty', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const prefs = await loadReminderPreferences();
    expect(prefs.sound).toBe(true);
  });

  test('saveOnboarded and loadOnboarded round-trip', async () => {
    await saveOnboarded(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('is_onboarded', 'true');

    AsyncStorage.getItem.mockResolvedValue('true');
    expect(await loadOnboarded()).toBe(true);
  });

  test('loadOnboarded returns false on error', async () => {
    AsyncStorage.getItem.mockRejectedValue(new Error('storage error'));
    expect(await loadOnboarded()).toBe(false);
  });
});
