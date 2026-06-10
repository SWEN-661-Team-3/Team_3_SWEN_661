import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SnoozeOptionsScreen from '../SnoozeOptionsScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate, goBack: jest.fn() };

function renderWithProvider() {
  return render(
    <AppProvider>
      <SnoozeOptionsScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('SnoozeOptionsScreen', () => {
  test('renders heading', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('How long would you like to snooze?')).toBeTruthy();
  });

  test('renders duration options', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('5 minutes')).toBeTruthy();
    expect(getByText('15 minutes')).toBeTruthy();
    expect(getByText('1 hour')).toBeTruthy();
  });

  test('renders snooze button', () => {
    const { getAllByText } = renderWithProvider();
    expect(getAllByText('Snooze Reminder').length).toBeGreaterThan(0);
  });
});
