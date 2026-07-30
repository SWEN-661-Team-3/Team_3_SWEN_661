import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_app/services/preferences_service.dart';
import 'package:flutter_app/models/accessibility_settings.dart';
import 'package:flutter_app/models/reminder_preferences.dart';

void main() {
  late PreferencesService service;

  setUp(() {
    SharedPreferences.setMockInitialValues({});
    service = PreferencesService();
  });

  group('PreferencesService - AccessibilitySettings', () {
    test('loadAccessibilitySettings returns defaults when nothing saved', () async {
      final settings = await service.loadAccessibilitySettings();
      expect(settings, isA<AccessibilitySettings>());
    });

    test('save and load round-trips settings', () async {
      const settings = AccessibilitySettings(
        textSize: 'extra-large',
        contrast: 'high',
        theme: 'dark',
        spacing: 'wide',
        motion: 'reduced',
        screenReader: 'on',
      );
      await service.saveAccessibilitySettings(settings);
      final loaded = await service.loadAccessibilitySettings();
      expect(loaded.textSize, 'extra-large');
      expect(loaded.contrast, 'high');
      expect(loaded.theme, 'dark');
      expect(loaded.spacing, 'wide');
      expect(loaded.motion, 'reduced');
      expect(loaded.screenReader, 'on');
    });

    test('loadAccessibilitySettings returns defaults on corrupt data', () async {
      SharedPreferences.setMockInitialValues({'accessibility_settings': 'not json'});
      service = PreferencesService();
      final settings = await service.loadAccessibilitySettings();
      expect(settings, isA<AccessibilitySettings>());
    });
  });

  group('PreferencesService - ReminderPreferences', () {
    test('loadReminderPreferences returns defaults when nothing saved', () async {
      final prefs = await service.loadReminderPreferences();
      expect(prefs, isA<ReminderPreferences>());
    });

    test('save and load round-trips preferences', () async {
      const prefs = ReminderPreferences(
        sound: false,
        vibration: false,
        persistent: true,
        repeat: true,
        caregiverNotify: false,
        quietHours: true,
        timing: '15-min-early',
      );
      await service.saveReminderPreferences(prefs);
      final loaded = await service.loadReminderPreferences();
      expect(loaded.sound, false);
      expect(loaded.vibration, false);
      expect(loaded.persistent, true);
      expect(loaded.repeat, true);
      expect(loaded.caregiverNotify, false);
      expect(loaded.quietHours, true);
      expect(loaded.timing, '15-min-early');
    });

    test('loadReminderPreferences returns defaults on corrupt data', () async {
      SharedPreferences.setMockInitialValues({'reminder_preferences': '{invalid'});
      service = PreferencesService();
      final prefs = await service.loadReminderPreferences();
      expect(prefs, isA<ReminderPreferences>());
    });
  });

  group('PreferencesService - Onboarded', () {
    test('loadOnboarded returns false when nothing saved', () async {
      final result = await service.loadOnboarded();
      expect(result, false);
    });

    test('save and load round-trips onboarded', () async {
      await service.saveOnboarded(true);
      final result = await service.loadOnboarded();
      expect(result, true);
    });
  });

  group('PreferencesService - NotificationsEnabled', () {
    test('loadNotificationsEnabled returns false when nothing saved', () async {
      final result = await service.loadNotificationsEnabled();
      expect(result, false);
    });

    test('save and load round-trips notifications enabled', () async {
      await service.saveNotificationsEnabled(true);
      final result = await service.loadNotificationsEnabled();
      expect(result, true);
    });
  });
}
