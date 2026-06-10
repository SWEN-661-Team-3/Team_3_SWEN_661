import React from 'react';
import { render } from '@testing-library/react-native';
import MissedReminderScreen from '../MissedReminderScreen';

const navigation = { navigate: jest.fn() };

describe('MissedReminderScreen', () => {
  test('renders heading', () => {
    const { getByText } = render(<MissedReminderScreen navigation={navigation} />);
    expect(getByText('Missed Reminder')).toBeTruthy();
  });

  test('renders action buttons', () => {
    const { getByText } = render(<MissedReminderScreen navigation={navigation} />);
    expect(getByText('Complete Now')).toBeTruthy();
    expect(getByText('Snooze')).toBeTruthy();
    expect(getByText('Ask for Help')).toBeTruthy();
  });
});
