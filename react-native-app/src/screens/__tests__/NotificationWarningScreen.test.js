import React from 'react';
import { render } from '@testing-library/react-native';
import NotificationWarningScreen from '../NotificationWarningScreen';
import { AppProvider } from '../../context/AppContext';

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

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

  test('renders enable button', () => {
    const { getByText } = renderScreen();
    expect(getByText('Enable Notifications')).toBeTruthy();
  });

  test('renders keep off button', () => {
    const { getByText } = renderScreen();
    expect(getByText('Keep Turned Off')).toBeTruthy();
  });
});
