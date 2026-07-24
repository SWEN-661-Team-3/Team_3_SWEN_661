import { initialPlan } from '../data/careData';
import { clone, simulateAsync } from './serviceUtils';

let carePlan = clone(initialPlan);

/** @param {import('./serviceUtils').ServiceOptions} [options] */
export function getCarePlan(options) {
  return simulateAsync(() => carePlan, options);
}

/** @param {Record<string, unknown> & { id: string }} reminder @param {import('./serviceUtils').ServiceOptions} [options] */
export function saveReminder(reminder, options) {
  return simulateAsync(() => {
    const nextReminder = clone(reminder);
    const index = carePlan.findIndex((item) => item.id === nextReminder.id);
    carePlan = index === -1
      ? [...carePlan, nextReminder]
      : carePlan.map((item) => (item.id === nextReminder.id ? nextReminder : item));
    return nextReminder;
  }, options);
}

/** @param {string} reminderId @param {import('./serviceUtils').ServiceOptions} [options] */
export function deleteReminder(reminderId, options) {
  return simulateAsync(() => {
    carePlan = carePlan.filter((item) => item.id !== reminderId);
    return { id: reminderId };
  }, options);
}

/** @param {string} reminderId @param {import('./serviceUtils').ServiceOptions} [options] */
export function markReminderComplete(reminderId, options) {
  return simulateAsync(() => {
    let completedReminder = null;
    carePlan = carePlan.map((item) => {
      if (item.id !== reminderId) return item;
      completedReminder = { ...item, status: 'done' };
      return completedReminder;
    });
    return completedReminder;
  }, options);
}
