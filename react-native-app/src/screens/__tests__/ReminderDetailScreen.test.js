import React from 'react';
import { render } from '@testing-library/react-native';
import ReminderDetailScreen from '../ReminderDetailScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

function renderWithProvider() {
  return render(
    <AppProvider>
      <ReminderDetailScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('ReminderDetailScreen', () => {
  test('renders reminder title', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Afternoon Medication')).toBeTruthy();
  });

  test('renders instructions', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Instructions')).toBeTruthy();
  });

  test('renders related appointment', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Follow-up: Heart Clinic')).toBeTruthy();
  });

  test('renders action buttons', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Mark Complete')).toBeTruthy();
    expect(getByText('Snooze Reminder')).toBeTruthy();
  });
});
