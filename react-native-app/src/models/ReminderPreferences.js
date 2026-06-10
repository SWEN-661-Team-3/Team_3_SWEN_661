export const DEFAULT_PREFS = {
  sound: true,
  vibration: true,
  persistent: false,
  repeat: true,
  caregiverNotify: false,
  quietHours: true,
  timing: 'on-time',
};

export function createReminderPreferences(overrides = {}) {
  return { ...DEFAULT_PREFS, ...overrides };
}

export function copyPreferences(prefs, overrides = {}) {
  return { ...prefs, ...overrides };
}

export function prefsToJson(prefs) {
  return { ...prefs };
}

export function prefsFromJson(json) {
  return {
    sound: json?.sound ?? DEFAULT_PREFS.sound,
    vibration: json?.vibration ?? DEFAULT_PREFS.vibration,
    persistent: json?.persistent ?? DEFAULT_PREFS.persistent,
    repeat: json?.repeat ?? DEFAULT_PREFS.repeat,
    caregiverNotify: json?.caregiverNotify ?? DEFAULT_PREFS.caregiverNotify,
    quietHours: json?.quietHours ?? DEFAULT_PREFS.quietHours,
    timing: json?.timing ?? DEFAULT_PREFS.timing,
  };
}
