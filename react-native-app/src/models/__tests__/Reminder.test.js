import { createReminder, copyReminder } from '../Reminder';

describe('Reminder', () => {
  test('creates with defaults', () => {
    const r = createReminder({ id: '1', title: 'Meds', dueTime: '12:00 PM' });
    expect(r.type).toBe('medication');
    expect(r.status).toBe('pending');
    expect(r.instructions).toBeNull();
    expect(r.relatedAppointment).toBeNull();
  });

  test('creates with all fields', () => {
    const r = createReminder({
      id: '1', title: 'Meds', dueTime: '12:00 PM',
      type: 'hydration', instructions: 'Drink water',
      relatedAppointment: 'Clinic', relatedAppointmentTime: 'Tuesday',
      status: 'snoozed',
    });
    expect(r.type).toBe('hydration');
    expect(r.status).toBe('snoozed');
    expect(r.instructions).toBe('Drink water');
  });

  test('copyReminder applies overrides', () => {
    const original = createReminder({ id: '1', title: 'Meds', dueTime: '12:00 PM' });
    const copy = copyReminder(original, { status: 'done' });
    expect(copy.status).toBe('done');
    expect(original.status).toBe('pending');
  });
});
