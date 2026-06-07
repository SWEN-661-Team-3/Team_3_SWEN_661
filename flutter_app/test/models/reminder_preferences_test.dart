import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/reminder_preferences.dart';

void main() {
  group('ReminderPreferences', () {
    test('has correct defaults', () {
      const p = ReminderPreferences();
      expect(p.sound, true);
      expect(p.vibration, true);
      expect(p.persistent, false);
      expect(p.repeat, true);
      expect(p.caregiverNotify, false);
      expect(p.quietHours, true);
      expect(p.timing, 'on-time');
    });

    test('copyWith replaces fields', () {
      const p = ReminderPreferences();
      final copy = p.copyWith(sound: false, timing: '15-before');
      expect(copy.sound, false);
      expect(copy.timing, '15-before');
      expect(copy.vibration, true);
    });

    test('toJson produces correct map', () {
      const p = ReminderPreferences(sound: false, persistent: true);
      final json = p.toJson();
      expect(json['sound'], false);
      expect(json['persistent'], true);
      expect(json['vibration'], true);
      expect(json.length, 7);
    });

    test('fromJson restores preferences', () {
      final json = {
        'sound': false,
        'vibration': false,
        'persistent': true,
        'repeat': false,
        'caregiverNotify': true,
        'quietHours': false,
        'timing': '5-before',
      };
      final p = ReminderPreferences.fromJson(json);
      expect(p.sound, false);
      expect(p.vibration, false);
      expect(p.persistent, true);
      expect(p.repeat, false);
      expect(p.caregiverNotify, true);
      expect(p.quietHours, false);
      expect(p.timing, '5-before');
    });

    test('fromJson handles missing keys with defaults', () {
      final p = ReminderPreferences.fromJson({});
      expect(p.sound, true);
      expect(p.timing, 'on-time');
    });

    test('toString returns readable string', () {
      const p = ReminderPreferences();
      expect(p.toString(), 'ReminderPreferences(sound=true, timing=on-time)');
    });

    test('roundtrip toJson/fromJson preserves all fields', () {
      const original = ReminderPreferences(
        sound: false, vibration: false, persistent: true,
        repeat: false, caregiverNotify: true, quietHours: false,
        timing: '15-before',
      );
      final restored = ReminderPreferences.fromJson(original.toJson());
      expect(restored.sound, original.sound);
      expect(restored.vibration, original.vibration);
      expect(restored.persistent, original.persistent);
      expect(restored.repeat, original.repeat);
      expect(restored.caregiverNotify, original.caregiverNotify);
      expect(restored.quietHours, original.quietHours);
      expect(restored.timing, original.timing);
    });
  });
}
