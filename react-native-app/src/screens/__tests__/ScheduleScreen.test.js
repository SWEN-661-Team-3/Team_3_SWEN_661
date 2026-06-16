import React from 'react';
import { render } from '@testing-library/react-native';
import ScheduleScreen from '../ScheduleScreen';
import { AppProvider } from '../../context/AppContext';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = { navigate: mockNavigate, goBack: mockGoBack, canGoBack: () => true };

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

function renderWithProvider(component) {
  return render(<AppProvider>{component}</AppProvider>);
}

describe('ScheduleScreen', () => {
  test('renders schedule items from state', () => {
    const { getByText } = renderWithProvider(
      <ScheduleScreen navigation={navigation} />
    );
    expect(getByText('Daily Vitamin & Heart Med')).toBeTruthy();
    expect(getByText('Eye Doctor Checkup')).toBeTruthy();
  });

  test('renders My Schedule header', () => {
    const { getByText } = renderWithProvider(
      <ScheduleScreen navigation={navigation} />
    );
    expect(getByText('My Schedule')).toBeTruthy();
  });
});
