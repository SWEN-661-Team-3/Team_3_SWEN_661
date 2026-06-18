export function buttonA11y(label, hint) {
  return {
    accessibilityRole: 'button',
    accessibilityLabel: label,
    ...(hint ? { accessibilityHint: hint } : {}),
  };
}

export function radioA11y(label, selected) {
  return {
    accessibilityRole: 'radio',
    accessibilityLabel: label,
    accessibilityState: { selected },
  };
}

export function switchA11y(label, checked) {
  return {
    accessibilityRole: 'switch',
    accessibilityLabel: label,
    accessibilityState: { checked },
  };
}

export function checkboxA11y(label, checked) {
  return {
    accessibilityRole: 'checkbox',
    accessibilityLabel: label,
    accessibilityState: { checked },
  };
}
