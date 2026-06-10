import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate };

describe('HomeScreen', () => {
  test('renders app title', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('CareConnect')).toBeTruthy();
  });

  test('renders Next Appointment section', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('Next Appointment')).toBeTruthy();
    expect(getByText('Eye Exam')).toBeTruthy();
  });

  test('renders Upcoming Reminders section', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('Upcoming Reminders')).toBeTruthy();
    expect(getByText('Afternoon Medication')).toBeTruthy();
  });

  test('renders Daily Health Tasks section', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('Daily Health Tasks')).toBeTruthy();
    expect(getByText('Morning Medication')).toBeTruthy();
  });

  test('renders Quick Links section', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('Quick Links')).toBeTruthy();
    expect(getByText('Activity Log')).toBeTruthy();
  });

  test('renders bottom nav', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('Full Plan')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });
});
