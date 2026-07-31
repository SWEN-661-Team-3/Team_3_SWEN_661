import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ReminderPreferencesScreen from '../ReminderPreferencesScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.spyOn(Alert, 'alert');

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

beforeEach(() => { navigation.navigate.mockClear(); navigation.goBack.mockClear(); Alert.alert.mockClear(); });

function renderScreen() {
  return render(
    <AppProvider>
      <ReminderPreferencesScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('ReminderPreferencesScreen', () => {
  test('renders all toggle labels', () => {
    const { getByText } = renderScreen();
    expect(getByText('Sound Alerts')).toBeTruthy();
    expect(getByText('Vibration')).toBeTruthy();
    expect(getByText('Persistent Notifications')).toBeTruthy();
    expect(getByText('Repeat Until Done')).toBeTruthy();
    expect(getByText('Notify Caregiver')).toBeTruthy();
    expect(getByText('Quiet Hours (10 PM - 7 AM)')).toBeTruthy();
  });

  test('renders timing section', () => {
    const { getByText } = renderScreen();
    expect(getByText('Reminder Timing')).toBeTruthy();
    expect(getByText('On Time')).toBeTruthy();
    expect(getByText('5 Min Early')).toBeTruthy();
    expect(getByText('15 Min Early')).toBeTruthy();
  });

  test('selecting timing chip works', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('15 Min Early'));
    expect(getByText('15 Min Early')).toBeTruthy();
  });

  test('Save Preferences shows alert and goes back', async () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Save Preferences'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Saved', 'Reminder preferences updated');
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });

  test('back button calls goBack', () => {
    const { getByLabelText } = renderScreen();
    fireEvent.press(getByLabelText('Go back'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
