import React from 'react';
import { render } from '@testing-library/react-native';
import NotificationWarningScreen from '../NotificationWarningScreen';

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

describe('NotificationWarningScreen', () => {
  test('renders heading', () => {
    const { getByText } = render(<NotificationWarningScreen navigation={navigation} />);
    expect(getByText('Notifications Are Off')).toBeTruthy();
  });

  test('renders enable button', () => {
    const { getByText } = render(<NotificationWarningScreen navigation={navigation} />);
    expect(getByText('Enable Notifications')).toBeTruthy();
  });

  test('renders keep off button', () => {
    const { getByText } = render(<NotificationWarningScreen navigation={navigation} />);
    expect(getByText('Keep Turned Off')).toBeTruthy();
  });
});
