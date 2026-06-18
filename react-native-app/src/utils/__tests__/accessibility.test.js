import { buttonA11y, radioA11y, switchA11y, checkboxA11y } from '../accessibility';

describe('accessibility utils', () => {
  test('buttonA11y returns role and label', () => {
    expect(buttonA11y('Save')).toEqual({
      accessibilityRole: 'button',
      accessibilityLabel: 'Save',
    });
  });

  test('buttonA11y includes hint when provided', () => {
    expect(buttonA11y('Save', 'Saves your settings')).toEqual({
      accessibilityRole: 'button',
      accessibilityLabel: 'Save',
      accessibilityHint: 'Saves your settings',
    });
  });

  test('radioA11y includes selected state', () => {
    expect(radioA11y('Large text', true)).toEqual({
      accessibilityRole: 'radio',
      accessibilityLabel: 'Large text',
      accessibilityState: { selected: true },
    });
  });

  test('switchA11y includes checked state', () => {
    expect(switchA11y('Sound alerts', false)).toEqual({
      accessibilityRole: 'switch',
      accessibilityLabel: 'Sound alerts',
      accessibilityState: { checked: false },
    });
  });

  test('checkboxA11y includes checked state', () => {
    expect(checkboxA11y('Share appointments', true)).toEqual({
      accessibilityRole: 'checkbox',
      accessibilityLabel: 'Share appointments',
      accessibilityState: { checked: true },
    });
  });
});
