import { useState, useEffect, useCallback, useRef } from 'react';
import { requestNotificationPermission } from '../services/notificationService';

// Notifications are scheduled as browser setTimeout timers, not through a
// backend push service. This means scheduling is session-dependent: timers
// are cleared when the tab closes or the component unmounts, and they will
// not fire after the browser is closed. This is an intentional scope
// limitation -- real server-side scheduling is outside the project scope.
const REMINDER_LEAD_MINUTES = 15;

function parseTime(timeStr) {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Both Notification API and ServiceWorker must be available. Environments
// that lack either (e.g. older browsers, insecure contexts) are treated as
// "unsupported" rather than failing silently. When permission is "denied",
// the UI shows recovery instructions instead of hiding the toggle entirely.
function getNotificationSupport() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export default function useNotifications(tasks) {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState(() =>
    'Notification' in window ? Notification.permission : 'unsupported',
  );
  const [isRequesting, setIsRequesting] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const [notificationSuccess, setNotificationSuccess] = useState(null);
  const timerIds = useRef([]);

  const clearScheduled = useCallback(() => {
    timerIds.current.forEach(clearTimeout);
    timerIds.current = [];
  }, []);

  const scheduleTaskNotifications = useCallback(
    (taskList) => {
      clearScheduled();
      if (!getNotificationSupport() || Notification.permission !== 'granted') return;

      const now = Date.now();

      taskList
        .filter((t) => t.status === 'todo')
        .forEach((task) => {
          const taskTime = parseTime(task.time);
          if (!taskTime) return;

          const notifyAt = taskTime.getTime() - REMINDER_LEAD_MINUTES * 60_000;
          const delay = notifyAt - now;

          if (delay > 0 && delay < 24 * 60 * 60_000) {
            const id = setTimeout(() => {
              new Notification('CareConnect Reminder', {
                body: `${task.title} in ${REMINDER_LEAD_MINUTES} minutes`,
                icon: '/icons/icon-192x192.svg',
                tag: `task-${task.id}`,
              });
            }, delay);
            timerIds.current.push(id);
          }
        });
    },
    [clearScheduled],
  );

  async function requestAndEnable() {
    if (!getNotificationSupport()) return;
    if (isRequesting) return;
    setIsRequesting(true);
    setNotificationError(null);
    try {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result === 'granted') {
        setEnabled(true);
        setNotificationSuccess('Notifications enabled. Upcoming reminders are scheduled.');
      } else if (result === 'denied') {
        setNotificationError('Notification permission was blocked. Enable it in your browser settings to receive reminders.');
      }
    } catch {
      setNotificationError('Could not request notification permission. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  }

  function disable() {
    setEnabled(false);
    clearScheduled();
    setNotificationSuccess('Notifications disabled.');
  }

  async function toggle() {
    if (enabled) {
      disable();
      return;
    }

    return requestAndEnable();
  }

  useEffect(() => {
    if (enabled && permission === 'granted') {
      scheduleTaskNotifications(tasks);
    }
    return clearScheduled;
  }, [enabled, permission, tasks, scheduleTaskNotifications, clearScheduled]);

  return {
    supported: getNotificationSupport(),
    enabled,
    permission,
    toggle,
    isRequesting,
    notificationError,
    notificationSuccess,
    retryPermission: requestAndEnable,
  };
}
