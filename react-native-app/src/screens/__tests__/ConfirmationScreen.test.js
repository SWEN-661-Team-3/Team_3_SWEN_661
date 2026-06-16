import React from 'react';
import { render } from '@testing-library/react-native';
import ConfirmationScreen from '../ConfirmationScreen';
import { AppProvider } from '../../context/AppContext';

const mockReset = jest.fn();
const navigation = { reset: mockReset };

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

function renderWithProvider(component) {
  return render(<AppProvider>{component}</AppProvider>);
}

describe('ConfirmationScreen', () => {
  test('renders success heading', () => {
    const { getByText } = renderWithProvider(
      <ConfirmationScreen navigation={navigation} />
    );
    expect(getByText("You're All Set!")).toBeTruthy();
  });

  test('renders active settings', () => {
    const { getByText } = renderWithProvider(
      <ConfirmationScreen navigation={navigation} />
    );
    expect(getByText('Active Settings')).toBeTruthy();
    expect(getByText('Large Text')).toBeTruthy();
  });

  test('renders CTA button', () => {
    const { getByText } = renderWithProvider(
      <ConfirmationScreen navigation={navigation} />
    );
    expect(getByText("Go to Today's Plan")).toBeTruthy();
  });
});
