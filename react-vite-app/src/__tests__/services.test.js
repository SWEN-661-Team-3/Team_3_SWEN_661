import {
  deleteReminder,
  getCarePlan,
  markReminderComplete,
  saveReminder,
} from '../services/carePlanService';
import { getCaregiver, getCareTeam, saveCaregiver } from '../services/careTeamService';
import { registerNotification, requestNotificationPermission } from '../services/notificationService';
import { getSettings, saveSettings } from '../services/settingsService';

const immediate = { delayMs: 0 };

describe('session-only services', () => {
  it('loads cloned care-plan data and saves, completes, and deletes reminders asynchronously', async () => {
    const plan = await getCarePlan(immediate);
    plan[0].title = 'Changed only in test result';
    expect((await getCarePlan(immediate))[0].title).not.toBe('Changed only in test result');

    const reminder = {
      id: 'service-test-reminder',
      title: 'Service test reminder',
      time: '4:00 PM',
      status: 'todo',
    };
    await expect(saveReminder(reminder, immediate)).resolves.toMatchObject(reminder);
    await expect(markReminderComplete(reminder.id, immediate)).resolves.toMatchObject({ status: 'done' });
    await expect(deleteReminder(reminder.id, immediate)).resolves.toEqual({ id: reminder.id });
  });

  it('loads caregiver data, finds a caregiver, and saves an updated caregiver asynchronously', async () => {
    expect(await getCareTeam(immediate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'sarah' }),
    ]));
    expect(await getCaregiver('sarah', immediate)).toMatchObject({ name: 'Sarah Johnson' });
    expect(await getCaregiver('not-a-caregiver', immediate)).toBeNull();

    const updated = {
      ...(await getCaregiver('sarah', immediate)),
      notes: 'Updated by service test',
    };
    await expect(saveCaregiver(updated, immediate)).resolves.toMatchObject(updated);
  });

  it('loads and saves cloned settings asynchronously', async () => {
    const settings = await getSettings(immediate);
    settings.largeText = true;
    await expect(saveSettings(settings, immediate)).resolves.toMatchObject({ largeText: true });
    settings.largeText = false;
    expect((await getSettings(immediate)).largeText).toBe(true);
  });

  it('supports controlled service failures', async () => {
    await expect(getCarePlan({ ...immediate, fail: true, errorMessage: 'Planned failure' }))
      .rejects.toThrow('Planned failure');
  });

  it('requests permission and registers notifications through Promise-based helpers', async () => {
    const originalNotification = window.Notification;
    window.Notification = jest.fn();
    window.Notification.permission = 'granted';
    window.Notification.requestPermission = jest.fn(() => Promise.resolve('granted'));

    await expect(requestNotificationPermission(immediate)).resolves.toBe('granted');
    await expect(registerNotification({ id: 'notice', title: 'Test reminder' }, immediate))
      .resolves.toMatchObject({ registered: true });
    expect(window.Notification).toHaveBeenCalled();

    window.Notification.permission = 'default';
    await expect(registerNotification({ id: 'notice' }, immediate)).resolves.toMatchObject({ registered: false });
    window.Notification = originalNotification;
  });
});
