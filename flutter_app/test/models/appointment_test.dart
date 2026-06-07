import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/appointment.dart';

void main() {
  group('Appointment', () {
    test('creates with required fields', () {
      const appt = Appointment(id: '1', title: 'Test', date: 'Today', time: '9:00 AM');
      expect(appt.id, '1');
      expect(appt.title, 'Test');
      expect(appt.date, 'Today');
      expect(appt.time, '9:00 AM');
    });

    test('has correct defaults', () {
      const appt = Appointment(id: '1', title: 'Test', date: 'Today', time: '9 AM');
      expect(appt.location, '');
      expect(appt.notes, '');
      expect(appt.type, 'appointment');
      expect(appt.status, 'todo');
      expect(appt.actionLabel, isNull);
    });

    test('copyWith replaces fields', () {
      const appt = Appointment(id: '1', title: 'A', date: 'Today', time: '9 AM');
      final copy = appt.copyWith(title: 'B', status: 'done');
      expect(copy.title, 'B');
      expect(copy.status, 'done');
      expect(copy.id, '1');
    });

    test('copyWith preserves original when no args', () {
      const appt = Appointment(
        id: '1', title: 'A', date: 'Today', time: '9 AM',
        location: 'Home', notes: 'Note', type: 'med', status: 'done',
        actionLabel: 'View',
      );
      final copy = appt.copyWith();
      expect(copy.id, appt.id);
      expect(copy.title, appt.title);
      expect(copy.location, appt.location);
      expect(copy.actionLabel, appt.actionLabel);
    });

    test('toString returns readable string', () {
      const appt = Appointment(id: '1', title: 'Eye Exam', date: 'Today', time: '2 PM', status: 'todo');
      expect(appt.toString(), 'Appointment(Eye Exam, 2 PM, todo)');
    });
  });
}
