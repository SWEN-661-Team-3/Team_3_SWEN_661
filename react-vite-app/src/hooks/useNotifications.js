import { useState, useEffect, useCallback, useRef } from 'react';

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

function getNotificationSupport() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export default function useNotifications(tasks) {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState(() =>
    'Notification' in window ? Notification.permission : 'unsupported',
  );
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

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      setEnabled(true);

      new Notification('CareConnect', {
        body: 'Notifications enabled. You will be reminded before upcoming tasks.',
        icon: '/icons/icon-192x192.svg',
        tag: 'welcome',
      });
    }
  }

  function disable() {
    setEnabled(false);
    clearScheduled();
  }

  function toggle() {
    if (enabled) {
      disable();
    } else {
      requestAndEnable();
    }
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
  };
}
