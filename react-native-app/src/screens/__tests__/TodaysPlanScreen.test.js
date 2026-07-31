import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TodaysPlanScreen from '../TodaysPlanScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate };

beforeEach(() => mockNavigate.mockClear());

function renderWithProvider() {
  return render(
    <AppProvider>
      <TodaysPlanScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('TodaysPlanScreen', () => {
  test('renders greeting with caregiver name', () => {
    const { getByText } = renderWithProvider();
    expect(getByText(/Good Morning, Sarah!/)).toBeTruthy();
  });

  test('renders pending tasks count', () => {
    const { getByText } = renderWithProvider();
    expect(getByText(/5 tasks remaining today/)).toBeTruthy();
  });

  test('renders Up Next badge', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Up Next')).toBeTruthy();
  });

  test('renders task counts', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('1/6')).toBeTruthy();
    expect(getByText('Tasks Done')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
  });

  test('home button navigates to Home', () => {
    const { getByLabelText } = renderWithProvider();
    fireEvent.press(getByLabelText('Go home'));
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  test('emergency button navigates to Emergency', () => {
    const { getByLabelText } = renderWithProvider();
    fireEvent.press(getByLabelText('Emergency help'));
    expect(mockNavigate).toHaveBeenCalledWith('Emergency');
  });

  test('accessibility shortcuts button navigates to Setup', () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('Accessibility Shortcuts'));
    expect(mockNavigate).toHaveBeenCalledWith('Setup');
  });
});
