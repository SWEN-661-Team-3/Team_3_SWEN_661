import { ActivityType, ActivityStatus, createActivityEntry } from '../ActivityEntry';

describe('ActivityEntry', () => {
  test('ActivityType has expected values', () => {
    expect(ActivityType.MEDICATION).toBe('medication');
    expect(ActivityType.APPOINTMENT).toBe('appointment');
    expect(ActivityType.ALERT).toBe('alert');
  });

  test('ActivityStatus has expected values', () => {
    expect(ActivityStatus.DONE).toBe('done');
    expect(ActivityStatus.MISSED).toBe('missed');
    expect(ActivityStatus.SENT).toBe('sent');
    expect(ActivityStatus.TODO).toBe('todo');
  });

  test('creates an activity entry', () => {
    const date = new Date();
    const entry = createActivityEntry({
      id: '1', title: 'Medicine', time: '9:00 AM',
      type: ActivityType.MEDICATION, status: ActivityStatus.DONE, date,
    });
    expect(entry.id).toBe('1');
    expect(entry.title).toBe('Medicine');
    expect(entry.type).toBe('medication');
    expect(entry.status).toBe('done');
    expect(entry.date).toBe(date);
  });
});
