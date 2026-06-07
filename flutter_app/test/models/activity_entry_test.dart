import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/activity_entry.dart';

void main() {
  group('ActivityEntry', () {
    test('creates with required fields', () {
      final entry = ActivityEntry(
        id: '1', title: 'Med', time: '9 AM',
        type: ActivityType.medication, status: ActivityStatus.done,
        date: DateTime(2026, 6, 1),
      );
      expect(entry.id, '1');
      expect(entry.title, 'Med');
      expect(entry.type, ActivityType.medication);
      expect(entry.status, ActivityStatus.done);
    });

    test('toString returns readable string', () {
      final entry = ActivityEntry(
        id: '1', title: 'Med', time: '9 AM',
        type: ActivityType.medication, status: ActivityStatus.done,
        date: DateTime(2026, 6, 1),
      );
      expect(entry.toString(), 'ActivityEntry(Med, 9 AM, ActivityStatus.done)');
    });

    test('ActivityType enum has expected values', () {
      expect(ActivityType.values.length, 3);
      expect(ActivityType.values, contains(ActivityType.medication));
      expect(ActivityType.values, contains(ActivityType.appointment));
      expect(ActivityType.values, contains(ActivityType.alert));
    });

    test('ActivityStatus enum has expected values', () {
      expect(ActivityStatus.values.length, 4);
      expect(ActivityStatus.values, contains(ActivityStatus.done));
      expect(ActivityStatus.values, contains(ActivityStatus.missed));
      expect(ActivityStatus.values, contains(ActivityStatus.sent));
      expect(ActivityStatus.values, contains(ActivityStatus.todo));
    });
  });
}
