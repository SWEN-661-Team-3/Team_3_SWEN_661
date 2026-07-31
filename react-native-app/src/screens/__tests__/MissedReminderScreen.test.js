import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MissedReminderScreen from '../MissedReminderScreen';

const navigation = { navigate: jest.fn() };

beforeEach(() => navigation.navigate.mockClear());

describe('MissedReminderScreen', () => {
  test('renders heading', () => {
    const { getByText } = render(<MissedReminderScreen navigation={navigation} />);
    expect(getByText('Missed Reminder')).toBeTruthy();
  });

  test('renders medication info', () => {
    const { getByText } = render(<MissedReminderScreen navigation={navigation} />);
    expect(getByText('Afternoon Medication')).toBeTruthy();
    expect(getByText('Was due at 12:30 PM')).toBeTruthy();
  });

  test('Complete Now navigates to ReminderSuccess', () => {
    const { getByText } = render(<MissedReminderScreen navigation={navigation} />);
    fireEvent.press(getByText('Complete Now'));
    expect(navigation.navigate).toHaveBeenCalledWith('ReminderSuccess');
  });

  test('Snooze navigates to SnoozeOptions', () => {
    const { getByText } = render(<MissedReminderScreen navigation={navigation} />);
    fireEvent.press(getByText('Snooze'));
    expect(navigation.navigate).toHaveBeenCalledWith('SnoozeOptions');
  });

  test('Ask for Help navigates to CaregiverHelp', () => {
    const { getByText } = render(<MissedReminderScreen navigation={navigation} />);
    fireEvent.press(getByText('Ask for Help'));
    expect(navigation.navigate).toHaveBeenCalledWith('CaregiverHelp');
  });
});
