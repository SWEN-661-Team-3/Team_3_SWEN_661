import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/reminder.dart';

void main() {
  group('Reminder', () {
    test('creates with required fields', () {
      const r = Reminder(id: '1', title: 'Med', dueTime: '12:30 PM');
      expect(r.id, '1');
      expect(r.title, 'Med');
      expect(r.dueTime, '12:30 PM');
    });

    test('has correct defaults', () {
      const r = Reminder(id: '1', title: 'Med', dueTime: '12:30 PM');
      expect(r.type, 'medication');
      expect(r.instructions, isNull);
      expect(r.relatedAppointment, isNull);
      expect(r.relatedAppointmentTime, isNull);
      expect(r.status, 'pending');
    });

    test('copyWith replaces status', () {
      const r = Reminder(id: '1', title: 'Med', dueTime: '12:30 PM');
      final snoozed = r.copyWith(status: 'snoozed');
      expect(snoozed.status, 'snoozed');
      expect(snoozed.title, 'Med');
    });

    test('copyWith replaces all fields', () {
      const r = Reminder(id: '1', title: 'A', dueTime: '9 AM');
      final copy = r.copyWith(
        id: '2', title: 'B', dueTime: '10 AM', type: 'hydration',
        instructions: 'Drink water', relatedAppointment: 'Appt',
        relatedAppointmentTime: 'Tomorrow', status: 'done',
      );
      expect(copy.id, '2');
      expect(copy.title, 'B');
      expect(copy.dueTime, '10 AM');
      expect(copy.type, 'hydration');
      expect(copy.instructions, 'Drink water');
      expect(copy.relatedAppointment, 'Appt');
      expect(copy.relatedAppointmentTime, 'Tomorrow');
      expect(copy.status, 'done');
    });

    test('toString returns readable string', () {
      const r = Reminder(id: '1', title: 'Med', dueTime: '12 PM', status: 'pending');
      expect(r.toString(), 'Reminder(Med, 12 PM, pending)');
    });
  });
}
