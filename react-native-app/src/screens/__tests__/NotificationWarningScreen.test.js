import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NotificationWarningScreen from '../NotificationWarningScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

beforeEach(() => { navigation.navigate.mockClear(); navigation.goBack.mockClear(); });

function renderScreen() {
  return render(
    <AppProvider>
      <NotificationWarningScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('NotificationWarningScreen', () => {
  test('renders heading', () => {
    const { getByText } = renderScreen();
    expect(getByText('Notifications Are Off')).toBeTruthy();
  });

  test('renders warning text', () => {
    const { getByText } = renderScreen();
    expect(getByText(/Without notifications/)).toBeTruthy();
    expect(getByText(/Turning on notifications/)).toBeTruthy();
  });

  test('Enable Notifications calls setNotificationsEnabled and goBack', async () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Enable Notifications'));
    await waitFor(() => {
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });

  test('Keep Turned Off calls goBack', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Keep Turned Off'));
    expect(navigation.goBack).toHaveBeenCalled();
  });

  test('back button calls goBack', () => {
    const { getByLabelText } = renderScreen();
    const backBtn = getByLabelText('Go back');
    fireEvent.press(backBtn);
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
