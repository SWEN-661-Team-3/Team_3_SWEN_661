import React from 'react';
import { render } from '@testing-library/react-native';
import ScheduleScreen from '../ScheduleScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn(), canGoBack: () => true };

beforeEach(() => { navigation.navigate.mockClear(); navigation.goBack.mockClear(); });

function renderScreen() {
  return render(
    <AppProvider>
      <ScheduleScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('ScheduleScreen', () => {
  test('renders My Schedule header', () => {
    const { getByText } = renderScreen();
    expect(getByText('My Schedule')).toBeTruthy();
  });

  test('renders all plan items', () => {
    const { getByText } = renderScreen();
    expect(getByText('Daily Vitamin & Heart Med')).toBeTruthy();
    expect(getByText('Eye Doctor Checkup')).toBeTruthy();
    expect(getByText('Lunch & Afternoon Meds')).toBeTruthy();
    expect(getByText('Walk in the Park')).toBeTruthy();
    expect(getByText('Blood Pressure Log')).toBeTruthy();
    expect(getByText('Nighttime Eye Drops')).toBeTruthy();
  });

  test('renders Done badge for completed items', () => {
    const { getAllByText } = renderScreen();
    const doneBadges = getAllByText('Done');
    expect(doneBadges.length).toBeGreaterThanOrEqual(1);
  });

  test('renders To Do badges for pending items', () => {
    const { getAllByText } = renderScreen();
    const todoBadges = getAllByText('To Do');
    expect(todoBadges.length).toBeGreaterThanOrEqual(1);
  });

  test('renders times for items', () => {
    const { getByText } = renderScreen();
    expect(getByText('8:00 AM')).toBeTruthy();
    expect(getByText('10:30 AM')).toBeTruthy();
  });
});
