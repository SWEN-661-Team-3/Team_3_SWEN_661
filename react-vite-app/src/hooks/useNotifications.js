import { useState, useEffect, useCallback, useRef } from 'react';
import { requestNotificationPermission } from '../services/notificationService';

// Notifications use browser setTimeout timers rather than backend push, so
// schedules exist only for this open browser session. Cleanup prevents stale
// timers after tasks change or the component unmounts; closed tabs cannot
// deliver these reminders.
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

// Both Notification API and ServiceWorker must be available. Missing support
// is an unsupported capability, while denied permission is recoverable in
// browser settings; the UI keeps those states distinct rather than failing silently.
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
      // Rebuild the session-only timer list from current tasks so completed,
      // edited, or removed reminders cannot leave orphaned notifications.
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
