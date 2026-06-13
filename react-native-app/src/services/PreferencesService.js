import AsyncStorage from '@react-native-async-storage/async-storage';
import { settingsFromJson } from '../models/AccessibilitySettings';
import { prefsFromJson } from '../models/ReminderPreferences';

const SETTINGS_KEY = 'accessibility_settings';
const REMINDER_PREFS_KEY = 'reminder_preferences';
const ONBOARDED_KEY = 'is_onboarded';

export async function saveAccessibilitySettings(settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadAccessibilitySettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return settingsFromJson({});
    return settingsFromJson(JSON.parse(raw));
  } catch {
    return settingsFromJson({});
  }
}

export async function saveReminderPreferences(prefs) {
  await AsyncStorage.setItem(REMINDER_PREFS_KEY, JSON.stringify(prefs));
}

export async function loadReminderPreferences() {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_PREFS_KEY);
    if (!raw) return prefsFromJson({});
    return prefsFromJson(JSON.parse(raw));
  } catch {
    return prefsFromJson({});
  }
}

export async function saveOnboarded(value) {
  await AsyncStorage.setItem(ONBOARDED_KEY, value ? 'true' : 'false');
}

export async function loadOnboarded() {
  try {
    const raw = await AsyncStorage.getItem(ONBOARDED_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
}
