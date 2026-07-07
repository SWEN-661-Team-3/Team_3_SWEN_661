import { typeLabels } from './data';

function textValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function formatType(type) {
  return typeLabels[type]?.label ?? (textValue(type) || 'Reminder');
}

export function buildTodaysPlanText(plan) {
  const lines = ["Today's Plan"];

  plan.forEach((reminder, index) => {
    if (index > 0) {
      lines.push('');
    }

    const reminderLines = [
      `${formatType(reminder.type)} - ${textValue(reminder.title)}`,
      textValue(reminder.time),
      textValue(reminder.location),
      textValue(reminder.notes),
    ].filter(Boolean);

    lines.push(...reminderLines);
  });

  return lines.join('\n');
}
