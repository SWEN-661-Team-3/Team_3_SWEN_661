export function createReminder({
  id,
  title,
  dueTime,
  type = 'medication',
  instructions = null,
  relatedAppointment = null,
  relatedAppointmentTime = null,
  status = 'pending',
}) {
  return { id, title, dueTime, type, instructions, relatedAppointment, relatedAppointmentTime, status };
}

export function copyReminder(reminder, overrides = {}) {
  return { ...reminder, ...overrides };
}
