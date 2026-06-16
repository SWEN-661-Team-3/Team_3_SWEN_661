import React from 'react';
import { render } from '@testing-library/react-native';
import NotificationScreen from '../NotificationScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn() };
const route = { params: {} };

function renderWithProvider() {
  return render(
    <AppProvider>
      <NotificationScreen navigation={navigation} route={route} />
    </AppProvider>
  );
}

describe('NotificationScreen', () => {
  test('renders reminder heading', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Reminder')).toBeTruthy();
  });

  test('renders reminder title', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Afternoon Medication')).toBeTruthy();
  });

  test('renders action buttons', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('View Details')).toBeTruthy();
    expect(getByText('Snooze')).toBeTruthy();
    expect(getByText('Mark Done')).toBeTruthy();
  });
});
