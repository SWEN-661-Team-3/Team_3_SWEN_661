import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NotificationScreen from '../NotificationScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

beforeEach(() => { navigation.navigate.mockClear(); });

function renderScreen(params = {}) {
  return render(
    <AppProvider>
      <NotificationScreen navigation={navigation} route={{ params }} />
    </AppProvider>
  );
}

describe('NotificationScreen', () => {
  test('renders reminder heading', () => {
    const { getByText } = renderScreen();
    expect(getByText('Reminder')).toBeTruthy();
  });

  test('renders reminder title', () => {
    const { getByText } = renderScreen();
    expect(getByText('Afternoon Medication')).toBeTruthy();
  });

  test('renders due time', () => {
    const { getByText } = renderScreen();
    expect(getByText('12:30 PM')).toBeTruthy();
  });

  test('renders instructions', () => {
    const { getByText } = renderScreen();
    expect(getByText('Instructions')).toBeTruthy();
    expect(getByText(/Take one white pill/)).toBeTruthy();
  });

  test('View Details navigates with reminderId', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('View Details'));
    expect(navigation.navigate).toHaveBeenCalledWith('ReminderDetail', { reminderId: '1' });
  });

  test('Snooze navigates with reminderId', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Snooze'));
    expect(navigation.navigate).toHaveBeenCalledWith('SnoozeOptions', { reminderId: '1' });
  });

  test('Mark Done navigates to ReminderSuccess', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Mark Done'));
    expect(navigation.navigate).toHaveBeenCalledWith('ReminderSuccess');
  });

  test('uses specific reminderId param', () => {
    const { getByText } = renderScreen({ reminderId: '2' });
    expect(getByText('Hydration Check')).toBeTruthy();
  });
});
