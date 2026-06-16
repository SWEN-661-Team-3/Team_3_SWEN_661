import React from 'react';
import { render } from '@testing-library/react-native';
import ReminderSuccessScreen from '../ReminderSuccessScreen';

const navigation = { reset: jest.fn() };

describe('ReminderSuccessScreen', () => {
  test('renders heading', () => {
    const { getByText } = render(<ReminderSuccessScreen navigation={navigation} />);
    expect(getByText('Reminder Complete!')).toBeTruthy();
  });

  test('renders info rows', () => {
    const { getByText } = render(<ReminderSuccessScreen navigation={navigation} />);
    expect(getByText('Task')).toBeTruthy();
    expect(getByText('Medication Reminder')).toBeTruthy();
    expect(getByText('Status')).toBeTruthy();
    expect(getByText('Done')).toBeTruthy();
  });

  test('renders return button', () => {
    const { getByText } = render(<ReminderSuccessScreen navigation={navigation} />);
    expect(getByText("Return to Today's Plan")).toBeTruthy();
  });
});
