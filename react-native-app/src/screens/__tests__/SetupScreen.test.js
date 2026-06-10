import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SetupScreen from '../SetupScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate, goBack: jest.fn(), canGoBack: () => true };

function renderWithProvider() {
  return render(
    <AppProvider>
      <SetupScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('SetupScreen', () => {
  beforeEach(() => mockNavigate.mockClear());

  test('renders header', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Accessibility Settings')).toBeTruthy();
  });

  test('renders all sections', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Text Size')).toBeTruthy();
    expect(getByText('Contrast Mode')).toBeTruthy();
    expect(getByText('Color Theme')).toBeTruthy();
    expect(getByText('Spacing')).toBeTruthy();
    expect(getByText('Motion')).toBeTruthy();
    expect(getByText('Screen Reader')).toBeTruthy();
  });

  test('renders Preview Settings button', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Preview Settings')).toBeTruthy();
  });
});
