export function createCaregiver({
  id,
  name,
  relationship,
  phone = '',
  permissions = ['appointments', 'reminders', 'help'],
}) {
  return { id, name, relationship, phone, permissions };
}

export function copyCaregiver(caregiver, overrides = {}) {
  return { ...caregiver, ...overrides };
}
