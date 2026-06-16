import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CaregiverSetupScreen from '../CaregiverSetupScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = { navigate: mockNavigate, goBack: mockGoBack, canGoBack: () => true };

function renderWithProvider() {
  return render(
    <AppProvider>
      <CaregiverSetupScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('CaregiverSetupScreen', () => {
  beforeEach(() => mockNavigate.mockClear());

  test('renders heading', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Add a Caregiver')).toBeTruthy();
  });

  test('renders form fields', () => {
    const { getByLabelText } = renderWithProvider();
    expect(getByLabelText('Full Name')).toBeTruthy();
    expect(getByLabelText('Relationship')).toBeTruthy();
    expect(getByLabelText('Phone Number')).toBeTruthy();
  });

  test('renders permission checkboxes', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('View Appointments')).toBeTruthy();
    expect(getByText('Medication Reminders')).toBeTruthy();
    expect(getByText('Respond to Help Requests')).toBeTruthy();
  });

  test('skip navigates to Confirmation', () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('Skip for Now'));
    expect(mockNavigate).toHaveBeenCalledWith('Confirmation');
  });
});
