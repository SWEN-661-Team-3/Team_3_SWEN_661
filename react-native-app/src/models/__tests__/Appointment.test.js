import { createAppointment, copyAppointment } from '../Appointment';

describe('Appointment', () => {
  test('creates with required fields and defaults', () => {
    const apt = createAppointment({ id: '1', title: 'Test', date: 'Today', time: '9:00 AM' });
    expect(apt.id).toBe('1');
    expect(apt.title).toBe('Test');
    expect(apt.location).toBe('');
    expect(apt.notes).toBe('');
    expect(apt.type).toBe('appointment');
    expect(apt.status).toBe('todo');
    expect(apt.actionLabel).toBeNull();
  });

  test('creates with all fields', () => {
    const apt = createAppointment({
      id: '2', title: 'Eye Doctor', date: 'Today', time: '10:30 AM',
      location: 'Clinic', notes: 'Bring glasses', type: 'medication',
      status: 'done', actionLabel: 'View',
    });
    expect(apt.location).toBe('Clinic');
    expect(apt.type).toBe('medication');
    expect(apt.status).toBe('done');
    expect(apt.actionLabel).toBe('View');
  });

  test('copyAppointment preserves original and applies overrides', () => {
    const original = createAppointment({ id: '1', title: 'Test', date: 'Today', time: '9:00 AM' });
    const copy = copyAppointment(original, { status: 'done', title: 'Updated' });
    expect(copy.status).toBe('done');
    expect(copy.title).toBe('Updated');
    expect(copy.id).toBe('1');
    expect(original.status).toBe('todo');
  });
});
