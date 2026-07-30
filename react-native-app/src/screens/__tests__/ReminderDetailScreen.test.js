import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ReminderDetailScreen from '../ReminderDetailScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

beforeEach(() => { navigation.navigate.mockClear(); navigation.goBack.mockClear(); });

function renderWithProvider(params = {}) {
  return render(
    <AppProvider>
      <ReminderDetailScreen navigation={navigation} route={{ params }} />
    </AppProvider>
  );
}

describe('ReminderDetailScreen', () => {
  test('renders reminder title', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Afternoon Medication')).toBeTruthy();
  });

  test('renders due time', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('12:30 PM')).toBeTruthy();
  });

  test('renders instructions section', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Instructions')).toBeTruthy();
  });

  test('renders related appointment', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Follow-up: Heart Clinic')).toBeTruthy();
    expect(getByText('Next Tuesday at 10:30 AM')).toBeTruthy();
  });

  test('Mark Complete navigates to ReminderSuccess', () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('Mark Complete'));
    expect(navigation.navigate).toHaveBeenCalledWith('ReminderSuccess');
  });

  test('Snooze Reminder navigates to SnoozeOptions', () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('Snooze Reminder'));
    expect(navigation.navigate).toHaveBeenCalledWith('SnoozeOptions');
  });

  test('falls back to first reminder when id not found', () => {
    const { getByText } = renderWithProvider({ reminderId: 'nonexistent' });
    expect(getByText('Afternoon Medication')).toBeTruthy();
  });

  test('uses reminderId param when valid', () => {
    const { getByText } = renderWithProvider({ reminderId: '2' });
    expect(getByText('Hydration Check')).toBeTruthy();
  });

  test('back button calls goBack', () => {
    const { getByLabelText } = renderWithProvider();
    fireEvent.press(getByLabelText('Go back'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
