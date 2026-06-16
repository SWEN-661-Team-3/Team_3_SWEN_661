import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EmergencyScreen from '../EmergencyScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = { navigate: mockNavigate, goBack: mockGoBack };

describe('EmergencyScreen', () => {
  beforeEach(() => { mockNavigate.mockClear(); mockGoBack.mockClear(); });

  test('renders initial state', () => {
    const { getByText } = render(<EmergencyScreen navigation={navigation} />);
    expect(getByText('Emergency Help')).toBeTruthy();
    expect(getByText('I Need Help')).toBeTruthy();
  });

  test('starts countdown on help press', () => {
    const { getByText } = render(<EmergencyScreen navigation={navigation} />);
    fireEvent.press(getByText('I Need Help'));
    expect(getByText('10')).toBeTruthy();
    expect(getByText(/Sending alert in/)).toBeTruthy();
  });

  test('cancel goes back', () => {
    const { getByText } = render(<EmergencyScreen navigation={navigation} />);
    fireEvent.press(getByText('Cancel'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
