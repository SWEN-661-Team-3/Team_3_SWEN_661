import React from 'react';
import { render } from '@testing-library/react-native';
import TodaysPlanScreen from '../TodaysPlanScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate };

function renderWithProvider() {
  return render(
    <AppProvider>
      <TodaysPlanScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('TodaysPlanScreen', () => {
  test('renders greeting', () => {
    const { getByText } = renderWithProvider();
    expect(getByText(/Good Morning/)).toBeTruthy();
  });

  test('renders Up Next badge', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Up Next')).toBeTruthy();
  });

  test('renders task counts', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('1/6')).toBeTruthy();
    expect(getByText('Tasks Done')).toBeTruthy();
  });

  test('renders accessibility shortcuts', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Accessibility Shortcuts')).toBeTruthy();
  });
});
