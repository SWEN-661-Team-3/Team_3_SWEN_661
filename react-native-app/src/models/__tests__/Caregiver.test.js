import { createCaregiver, copyCaregiver } from '../Caregiver';

describe('Caregiver', () => {
  test('creates with defaults', () => {
    const cg = createCaregiver({ id: '1', name: 'Sarah', relationship: 'Daughter' });
    expect(cg.phone).toBe('');
    expect(cg.permissions).toEqual(['appointments', 'reminders', 'help']);
  });

  test('creates with custom fields', () => {
    const cg = createCaregiver({
      id: '1', name: 'Dr. Smith', relationship: 'Doctor',
      phone: '555-1234', permissions: ['appointments'],
    });
    expect(cg.phone).toBe('555-1234');
    expect(cg.permissions).toEqual(['appointments']);
  });

  test('copyCaregiver applies overrides', () => {
    const original = createCaregiver({ id: '1', name: 'Sarah', relationship: 'Daughter' });
    const copy = copyCaregiver(original, { phone: '555-9999' });
    expect(copy.phone).toBe('555-9999');
    expect(copy.name).toBe('Sarah');
  });
});
