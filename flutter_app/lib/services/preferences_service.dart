import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/accessibility_settings.dart';
import '../models/reminder_preferences.dart';

class PreferencesService {
  static const _settingsKey = 'accessibility_settings';
  static const _reminderPrefsKey = 'reminder_preferences';
  static const _onboardedKey = 'is_onboarded';

  Future<void> saveAccessibilitySettings(AccessibilitySettings settings) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_settingsKey, jsonEncode(settings.toJson()));
  }

  Future<AccessibilitySettings> loadAccessibilitySettings() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_settingsKey);
    if (raw == null) return const AccessibilitySettings();
    return AccessibilitySettings.fromJson(
      jsonDecode(raw) as Map<String, dynamic>,
    );
  }

  Future<void> saveReminderPreferences(ReminderPreferences preferences) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_reminderPrefsKey, jsonEncode(preferences.toJson()));
  }

  Future<ReminderPreferences> loadReminderPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_reminderPrefsKey);
    if (raw == null) return const ReminderPreferences();
    return ReminderPreferences.fromJson(
      jsonDecode(raw) as Map<String, dynamic>,
    );
  }

  Future<void> saveOnboarded(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_onboardedKey, value);
  }

  Future<bool> loadOnboarded() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_onboardedKey) ?? false;
  }
}
