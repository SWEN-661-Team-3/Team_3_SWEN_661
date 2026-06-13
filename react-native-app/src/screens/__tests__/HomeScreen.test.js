import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
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
      <HomeScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('HomeScreen', () => {
  test('renders app title', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('CareConnect')).toBeTruthy();
  });

  test('renders Next Appointment section', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Next Appointment')).toBeTruthy();
  });

  test('renders Upcoming Reminders section', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Upcoming Reminders')).toBeTruthy();
    expect(getByText('Afternoon Medication')).toBeTruthy();
  });

  test('renders Daily Health Tasks section', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Daily Health Tasks')).toBeTruthy();
  });

  test('renders Quick Links section', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Quick Links')).toBeTruthy();
    expect(getByText('Activity Log')).toBeTruthy();
  });

  test('renders bottom nav', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Full Plan')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });
});
