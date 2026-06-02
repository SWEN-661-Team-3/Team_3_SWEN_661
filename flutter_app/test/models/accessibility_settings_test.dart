import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/accessibility_settings.dart';

void main() {
  group('AccessibilitySettings', () {
    test('has correct defaults', () {
      const s = AccessibilitySettings();
      expect(s.textSize, 'large');
      expect(s.contrast, 'standard');
      expect(s.theme, 'light');
      expect(s.spacing, 'standard');
      expect(s.motion, 'reduced');
      expect(s.screenReader, 'off');
    });

    test('copyWith replaces fields', () {
      const s = AccessibilitySettings();
      final copy = s.copyWith(textSize: 'extra-large', contrast: 'high');
      expect(copy.textSize, 'extra-large');
      expect(copy.contrast, 'high');
      expect(copy.theme, 'light');
    });

    test('toJson produces correct map', () {
      const s = AccessibilitySettings(textSize: 'medium', theme: 'dark');
      final json = s.toJson();
      expect(json['textSize'], 'medium');
      expect(json['theme'], 'dark');
      expect(json['contrast'], 'standard');
      expect(json.length, 6);
    });

    test('fromJson restores settings', () {
      final json = {
        'textSize': 'extra-large',
        'contrast': 'high',
        'theme': 'dark',
        'spacing': 'wide',
        'motion': 'standard',
        'screenReader': 'on',
      };
      final s = AccessibilitySettings.fromJson(json);
      expect(s.textSize, 'extra-large');
      expect(s.contrast, 'high');
      expect(s.theme, 'dark');
      expect(s.spacing, 'wide');
      expect(s.motion, 'standard');
      expect(s.screenReader, 'on');
    });

    test('fromJson handles missing keys with defaults', () {
      final s = AccessibilitySettings.fromJson({});
      expect(s.textSize, 'large');
      expect(s.contrast, 'standard');
      expect(s.theme, 'light');
    });

    test('activeLabels returns correct labels for defaults', () {
      const s = AccessibilitySettings();
      final labels = s.activeLabels;
      expect(labels, contains('Large Text'));
      expect(labels, contains('Reduced Motion'));
      expect(labels, isNot(contains('High Contrast Colors')));
    });

    test('activeLabels returns all labels when all active', () {
      const s = AccessibilitySettings(
        textSize: 'extra-large', contrast: 'high', theme: 'dark',
        spacing: 'wide', motion: 'reduced', screenReader: 'on',
      );
      final labels = s.activeLabels;
      expect(labels, contains('Extra Large Text'));
      expect(labels, contains('High Contrast Colors'));
      expect(labels, contains('Dark Mode'));
      expect(labels, contains('Wide Spacing'));
      expect(labels, contains('Reduced Motion'));
      expect(labels, contains('Screen Reader Support'));
    });

    test('activeLabels returns empty for minimal settings', () {
      const s = AccessibilitySettings(
        textSize: 'medium', contrast: 'standard', theme: 'light',
        spacing: 'standard', motion: 'standard', screenReader: 'off',
      );
      expect(s.activeLabels, isEmpty);
    });

    test('toString returns readable string', () {
      const s = AccessibilitySettings();
      expect(s.toString(), 'AccessibilitySettings(large, standard, light)');
    });

    test('roundtrip toJson/fromJson preserves all fields', () {
      const original = AccessibilitySettings(
        textSize: 'extra-large', contrast: 'high', theme: 'dark',
        spacing: 'wide', motion: 'standard', screenReader: 'on',
      );
      final restored = AccessibilitySettings.fromJson(original.toJson());
      expect(restored.textSize, original.textSize);
      expect(restored.contrast, original.contrast);
      expect(restored.theme, original.theme);
      expect(restored.spacing, original.spacing);
      expect(restored.motion, original.motion);
      expect(restored.screenReader, original.screenReader);
    });
  });
}
