import { appReducer, initialState, ACTION_TYPES, getCompletedCount } from '../AppContext';

describe('appReducer', () => {
  test('returns initial state by default', () => {
    const result = appReducer(initialState, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('INIT sets initialized, settings, reminderPrefs, isOnboarded', () => {
    const settings = { textSize: 'extra-large', contrast: 'high' };
    const reminderPrefs = { sound: false };
    const result = appReducer(initialState, {
      type: ACTION_TYPES.INIT,
      payload: { settings, reminderPrefs, isOnboarded: true },
    });
    expect(result.initialized).toBe(true);
    expect(result.settings).toEqual(settings);
    expect(result.reminderPrefs).toEqual(reminderPrefs);
    expect(result.isOnboarded).toBe(true);
  });

  test('UPDATE_SETTINGS replaces settings', () => {
    const newSettings = { textSize: 'extra-large' };
    const result = appReducer(initialState, {
      type: ACTION_TYPES.UPDATE_SETTINGS,
      payload: newSettings,
    });
    expect(result.settings).toEqual(newSettings);
  });

  test('UPDATE_REMINDER_PREFS replaces reminderPrefs', () => {
    const newPrefs = { sound: false, timing: '5-min-early' };
    const result = appReducer(initialState, {
      type: ACTION_TYPES.UPDATE_REMINDER_PREFS,
      payload: newPrefs,
    });
    expect(result.reminderPrefs).toEqual(newPrefs);
  });

  test('MARK_ONBOARDED sets isOnboarded to true', () => {
    const result = appReducer(initialState, { type: ACTION_TYPES.MARK_ONBOARDED });
    expect(result.isOnboarded).toBe(true);
  });

  test('ADD_CAREGIVER appends to caregivers', () => {
    const newCg = { id: '99', name: 'Bob', relationship: 'Son' };
    const result = appReducer(initialState, {
      type: ACTION_TYPES.ADD_CAREGIVER,
      payload: newCg,
    });
    expect(result.caregivers).toHaveLength(initialState.caregivers.length + 1);
    expect(result.caregivers[result.caregivers.length - 1]).toEqual(newCg);
  });

  test('COMPLETE_TASK marks task as done', () => {
    const result = appReducer(initialState, {
      type: ACTION_TYPES.COMPLETE_TASK,
      payload: '2',
    });
    const task = result.todaysPlan.find((a) => a.id === '2');
    expect(task.status).toBe('done');
    expect(result.todaysPlan.find((a) => a.id === '1').status).toBe('done');
  });

  test('SNOOZE_REMINDER marks reminder as snoozed', () => {
    const result = appReducer(initialState, {
      type: ACTION_TYPES.SNOOZE_REMINDER,
      payload: '1',
    });
    expect(result.reminders.find((r) => r.id === '1').status).toBe('snoozed');
    expect(result.reminders.find((r) => r.id === '2').status).toBe('pending');
  });

  test('DISMISS_REMINDER marks reminder as done', () => {
    const result = appReducer(initialState, {
      type: ACTION_TYPES.DISMISS_REMINDER,
      payload: '1',
    });
    expect(result.reminders.find((r) => r.id === '1').status).toBe('done');
  });

  test('TOGGLE_OFFLINE flips isOffline', () => {
    const result1 = appReducer(initialState, { type: ACTION_TYPES.TOGGLE_OFFLINE });
    expect(result1.isOffline).toBe(true);
    const result2 = appReducer(result1, { type: ACTION_TYPES.TOGGLE_OFFLINE });
    expect(result2.isOffline).toBe(false);
  });
});

describe('getCompletedCount', () => {
  test('counts completed tasks', () => {
    expect(getCompletedCount(initialState.todaysPlan)).toBe(1);
  });

  test('returns 0 for empty plan', () => {
    expect(getCompletedCount([])).toBe(0);
  });

  test('returns total when all done', () => {
    const allDone = initialState.todaysPlan.map((a) => ({ ...a, status: 'done' }));
    expect(getCompletedCount(allDone)).toBe(allDone.length);
  });
});
