export const REMINDER_TITLE_MAX_LENGTH = 120;
export const REMINDER_NOTES_MAX_LENGTH = 1000;
export const CAREGIVER_PHONE_MIN_DIGITS = 7;
const BASIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_PATTERN = /^(1[0-2]|[1-9]):[0-5]\d\s?(AM|PM)$/i;

function valueOf(value) {
  return String(value ?? '').trim();
}

function isValidDate(value) {
  const normalized = valueOf(value);
  return normalized.toLowerCase() === 'today' || !Number.isNaN(Date.parse(normalized));
}

/**
 * Validates a reminder form and returns field-specific messages.
 * @param {Record<string, unknown>} reminder
 * @returns {Record<string, string>}
 */
export function validateReminder(reminder) {
  const errors = {};
  const title = valueOf(reminder.title);
  const date = valueOf(reminder.date);
  const time = valueOf(reminder.time);
  const location = valueOf(reminder.location);
  const notes = valueOf(reminder.notes);

  if (!title) errors.title = 'Enter a reminder title.';
  else if (title.length > REMINDER_TITLE_MAX_LENGTH) {
    errors.title = `Keep the reminder title to ${REMINDER_TITLE_MAX_LENGTH} characters or fewer.`;
  }
  if (!date || !isValidDate(date)) errors.date = 'Enter a valid date.';
  if (!TIME_PATTERN.test(time)) errors.time = 'Enter a time such as 9:30 AM.';
  if (reminder.type === 'appointment' && !location) {
    errors.location = 'Enter a location for this appointment.';
  }
  if (notes.length > REMINDER_NOTES_MAX_LENGTH) {
    errors.notes = `Keep notes to ${REMINDER_NOTES_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

/**
 * Validates a caregiver form and returns field-specific messages.
 * @param {Record<string, unknown>} caregiver
 * @returns {Record<string, string>}
 */
export function validateCaregiver(caregiver) {
  const errors = {};
  const name = valueOf(caregiver.name);
  const relationship = valueOf(caregiver.relationship);
  const phoneDigits = valueOf(caregiver.phone).replace(/\D/g, '');
  const email = valueOf(caregiver.email);

  if (!name) errors.name = 'Enter the caregiver’s name.';
  if (!relationship) errors.relationship = 'Enter the caregiver’s relationship.';
  if (phoneDigits.length < CAREGIVER_PHONE_MIN_DIGITS) {
    errors.phone = 'Enter a phone number with at least 7 digits.';
  }
  if (email && !BASIC_EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}
