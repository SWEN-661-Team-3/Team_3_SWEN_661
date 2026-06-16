import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ActivityLogScreen from '../ActivityLogScreen';

const navigation = { navigate: jest.fn(), goBack: jest.fn(), canGoBack: () => true };

describe('ActivityLogScreen', () => {
  test('renders Activity Log header', () => {
    const { getByText } = render(<ActivityLogScreen navigation={navigation} />);
    expect(getByText('Activity Log')).toBeTruthy();
  });

  test('renders today entries', () => {
    const { getByText, getAllByText } = render(<ActivityLogScreen navigation={navigation} />);
    expect(getAllByText('Blood Pressure Medicine').length).toBeGreaterThan(0);
    expect(getByText('Heart Clinic Follow-up')).toBeTruthy();
  });

  test('renders filter chips', () => {
    const { getByText } = render(<ActivityLogScreen navigation={navigation} />);
    expect(getByText('All')).toBeTruthy();
    expect(getByText('Meds')).toBeTruthy();
    expect(getByText('Appts')).toBeTruthy();
    expect(getByText('Alerts')).toBeTruthy();
  });

  test('filtering works', () => {
    const { getByText, queryByText } = render(<ActivityLogScreen navigation={navigation} />);
    fireEvent.press(getByText('Appts'));
    expect(getByText('Heart Clinic Follow-up')).toBeTruthy();
    expect(queryByText('Emergency Help Request')).toBeNull();
  });
});
