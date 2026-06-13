export function createAppointment({
  id,
  title,
  date,
  time,
  location = '',
  notes = '',
  type = 'appointment',
  status = 'todo',
  actionLabel = null,
}) {
  return { id, title, date, time, location, notes, type, status, actionLabel };
}

export function copyAppointment(appointment, overrides = {}) {
  return { ...appointment, ...overrides };
}
