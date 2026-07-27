import { clone, simulateAsync } from './serviceUtils';

function notificationsSupported() {
  return typeof window !== 'undefined' && typeof window.Notification !== 'undefined';
}

/** @param {import('./serviceUtils').ServiceOptions} [options] */
export async function requestNotificationPermission(options = {}) {
  if (options.fail) return simulateAsync(null, options);
  if (!notificationsSupported()) return simulateAsync('unsupported', options);

  const permission = await window.Notification.requestPermission();
  return simulateAsync(permission, options);
}

/** @param {Record<string, unknown>} reminder @param {import('./serviceUtils').ServiceOptions} [options] */
export function registerNotification(reminder, options) {
  return simulateAsync(() => {
    if (!notificationsSupported() || window.Notification.permission !== 'granted') {
      return { registered: false, reminder: clone(reminder) };
    }

    new window.Notification('CareConnect Reminder', {
      body: `${reminder.title ?? 'Reminder'} is coming up.`,
      icon: '/icons/icon-192x192.svg',
      tag: `task-${reminder.id ?? 'reminder'}`,
    });
    return { registered: true, reminder: clone(reminder) };
  }, options);
}
