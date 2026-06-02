import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/providers/app_state.dart';
import 'package:flutter_app/models/caregiver.dart';

void main() {
  group('AppState', () {
    late AppState state;

    setUp(() {
      state = AppState();
    });

    test('initial state is not initialized', () {
      expect(state.initialized, false);
    });

    test('initial state is not onboarded', () {
      expect(state.isOnboarded, false);
    });

    test('initial state is not offline', () {
      expect(state.isOffline, false);
    });

    test('has default caregivers', () {
      expect(state.caregivers.length, 2);
      expect(state.caregivers.first.name, 'Sarah');
    });

    test('has default todays plan', () {
      expect(state.todaysPlan.length, 6);
      expect(state.todaysPlan.first.title, 'Daily Vitamin & Heart Med');
    });

    test('has default reminders', () {
      expect(state.reminders.length, 2);
      expect(state.reminders.first.title, 'Afternoon Medication');
    });

    test('has default activity log', () {
      expect(state.activityLog.length, 6);
    });

    test('completedTaskCount counts done tasks', () {
      expect(state.completedTaskCount, 1);
    });

    test('totalTaskCount returns total tasks', () {
      expect(state.totalTaskCount, 6);
    });

    test('completeTask marks task as done', () {
      state.completeTask('2');
      expect(state.todaysPlan.firstWhere((a) => a.id == '2').status, 'done');
      expect(state.completedTaskCount, 2);
    });

    test('completeTask does not affect other tasks', () {
      state.completeTask('2');
      expect(state.todaysPlan.firstWhere((a) => a.id == '3').status, 'todo');
    });

    test('snoozeReminder marks reminder as snoozed', () {
      state.snoozeReminder('1');
      expect(state.reminders.firstWhere((r) => r.id == '1').status, 'snoozed');
    });

    test('dismissReminder marks reminder as done', () {
      state.dismissReminder('1');
      expect(state.reminders.firstWhere((r) => r.id == '1').status, 'done');
    });

    test('addCaregiver adds to list', () {
      const newCaregiver = Caregiver(id: '3', name: 'Bob', relationship: 'Son');
      state.addCaregiver(newCaregiver);
      expect(state.caregivers.length, 3);
      expect(state.caregivers.last.name, 'Bob');
    });

    test('toggleOffline toggles state', () {
      expect(state.isOffline, false);
      state.toggleOffline();
      expect(state.isOffline, true);
      state.toggleOffline();
      expect(state.isOffline, false);
    });

    test('notifies listeners on completeTask', () {
      var notified = false;
      state.addListener(() => notified = true);
      state.completeTask('2');
      expect(notified, true);
    });

    test('notifies listeners on toggleOffline', () {
      var notified = false;
      state.addListener(() => notified = true);
      state.toggleOffline();
      expect(notified, true);
    });

    test('notifies listeners on addCaregiver', () {
      var notified = false;
      state.addListener(() => notified = true);
      state.addCaregiver(const Caregiver(id: '3', name: 'Test', relationship: 'Friend'));
      expect(notified, true);
    });

    test('notifies listeners on snoozeReminder', () {
      var notified = false;
      state.addListener(() => notified = true);
      state.snoozeReminder('1');
      expect(notified, true);
    });

    test('notifies listeners on dismissReminder', () {
      var notified = false;
      state.addListener(() => notified = true);
      state.dismissReminder('1');
      expect(notified, true);
    });

    test('default settings are correct', () {
      expect(state.settings.textSize, 'large');
      expect(state.settings.contrast, 'standard');
    });

    test('default reminder prefs are correct', () {
      expect(state.reminderPrefs.sound, true);
      expect(state.reminderPrefs.timing, 'on-time');
    });
  });
}
