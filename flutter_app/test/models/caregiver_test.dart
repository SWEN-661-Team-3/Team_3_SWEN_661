import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/caregiver.dart';

void main() {
  group('Caregiver', () {
    test('creates with required fields', () {
      const c = Caregiver(id: '1', name: 'Sarah', relationship: 'Daughter');
      expect(c.id, '1');
      expect(c.name, 'Sarah');
      expect(c.relationship, 'Daughter');
    });

    test('has correct defaults', () {
      const c = Caregiver(id: '1', name: 'Sarah', relationship: 'Daughter');
      expect(c.phone, '');
      expect(c.permissions, ['appointments', 'reminders', 'help']);
    });

    test('copyWith replaces fields', () {
      const c = Caregiver(id: '1', name: 'Sarah', relationship: 'Daughter');
      final copy = c.copyWith(name: 'Bob', phone: '555-1234');
      expect(copy.name, 'Bob');
      expect(copy.phone, '555-1234');
      expect(copy.relationship, 'Daughter');
    });

    test('copyWith replaces all fields', () {
      const c = Caregiver(id: '1', name: 'A', relationship: 'B');
      final copy = c.copyWith(
        id: '2', name: 'C', relationship: 'D',
        phone: '555', permissions: ['appointments'],
      );
      expect(copy.id, '2');
      expect(copy.name, 'C');
      expect(copy.relationship, 'D');
      expect(copy.phone, '555');
      expect(copy.permissions, ['appointments']);
    });

    test('toString returns readable string', () {
      const c = Caregiver(id: '1', name: 'Sarah', relationship: 'Daughter');
      expect(c.toString(), 'Caregiver(Sarah, Daughter)');
    });
  });
}
