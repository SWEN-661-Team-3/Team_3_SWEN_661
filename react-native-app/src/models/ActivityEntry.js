export const ActivityType = {
  MEDICATION: 'medication',
  APPOINTMENT: 'appointment',
  ALERT: 'alert',
};

export const ActivityStatus = {
  DONE: 'done',
  MISSED: 'missed',
  SENT: 'sent',
  TODO: 'todo',
};

export function createActivityEntry({ id, title, time, type, status, date }) {
  return { id, title, time, type, status, date };
}
