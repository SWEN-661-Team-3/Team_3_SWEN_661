import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from '../WelcomeScreen';

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate };

describe('WelcomeScreen', () => {
  beforeEach(() => mockNavigate.mockClear());

  test('renders app name and welcome heading', () => {
    const { getByText } = render(<WelcomeScreen navigation={navigation} />);
    expect(getByText('CareConnect')).toBeTruthy();
    expect(getByText('Welcome!')).toBeTruthy();
  });

  test('renders feature list', () => {
    const { getByText } = render(<WelcomeScreen navigation={navigation} />);
    expect(getByText('Large, easy-to-read text')).toBeTruthy();
    expect(getByText('Gentle medication reminders')).toBeTruthy();
  });

  test('Start Setup navigates to Setup', () => {
    const { getByLabelText } = render(<WelcomeScreen navigation={navigation} />);
    fireEvent.press(getByLabelText('Start Setup'));
    expect(mockNavigate).toHaveBeenCalledWith('Setup');
  });

  test('Use Recommended navigates to Setup', () => {
    const { getByLabelText } = render(<WelcomeScreen navigation={navigation} />);
    fireEvent.press(getByLabelText('Use Recommended Settings'));
    expect(mockNavigate).toHaveBeenCalledWith('Setup');
  });
});
