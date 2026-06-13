import React from 'react';
import { render } from '@testing-library/react-native';
import ReminderPreferencesScreen from '../ReminderPreferencesScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

function renderWithProvider() {
  return render(
    <AppProvider>
      <ReminderPreferencesScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('ReminderPreferencesScreen', () => {
  test('renders heading', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Reminder Preferences')).toBeTruthy();
  });

  test('renders toggle labels', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Sound Alerts')).toBeTruthy();
    expect(getByText('Vibration')).toBeTruthy();
    expect(getByText('Repeat Until Done')).toBeTruthy();
  });

  test('renders timing options', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Reminder Timing')).toBeTruthy();
    expect(getByText('On Time')).toBeTruthy();
    expect(getByText('5 Min Early')).toBeTruthy();
  });

  test('renders save button', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Save Preferences')).toBeTruthy();
  });
});
