import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import CaregiverHelpScreen from '../CaregiverHelpScreen';
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
      <CaregiverHelpScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('CaregiverHelpScreen', () => {
  test('renders heading', () => {
    const { getByText } = renderScreen();
    expect(getByText('Your Caregivers')).toBeTruthy();
  });

  test('renders caregiver names', () => {
    const { getByText } = renderScreen();
    expect(getByText('Sarah')).toBeTruthy();
    expect(getByText("Dr. Miller's Office")).toBeTruthy();
  });

  test('renders relationships', () => {
    const { getByText } = renderScreen();
    expect(getByText('Daughter')).toBeTruthy();
    expect(getByText('Doctor')).toBeTruthy();
  });

  test('tapping caregiver shows notification alert', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Sarah'));
    expect(Alert.alert).toHaveBeenCalledWith('Notification Sent', 'Sarah has been notified.');
  });

  test('after notifying, shows Notified badge', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Sarah'));
    expect(getByText('Notified')).toBeTruthy();
  });

  test('notified caregiver cannot be tapped again', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Sarah'));
    Alert.alert.mockClear();
    fireEvent.press(getByText('Sarah'));
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  test('back button calls goBack', () => {
    const { getByLabelText } = renderScreen();
    fireEvent.press(getByLabelText('Go back'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
