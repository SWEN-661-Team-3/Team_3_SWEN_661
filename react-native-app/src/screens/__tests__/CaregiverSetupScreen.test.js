import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CaregiverSetupScreen from '../CaregiverSetupScreen';
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
      <CaregiverSetupScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('CaregiverSetupScreen', () => {
  test('renders heading', () => {
    const { getByText } = renderScreen();
    expect(getByText('Add a Caregiver')).toBeTruthy();
  });

  test('renders form fields', () => {
    const { getByLabelText } = renderScreen();
    expect(getByLabelText('Full Name')).toBeTruthy();
    expect(getByLabelText('Relationship')).toBeTruthy();
    expect(getByLabelText('Phone Number')).toBeTruthy();
  });

  test('renders permission checkboxes', () => {
    const { getByText } = renderScreen();
    expect(getByText('View Appointments')).toBeTruthy();
    expect(getByText('Medication Reminders')).toBeTruthy();
    expect(getByText('Respond to Help Requests')).toBeTruthy();
  });

  test('Add Caregiver button is disabled without valid form', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Add Caregiver'));
    expect(navigation.navigate).not.toHaveBeenCalledWith('Confirmation');
  });

  test('filling valid form enables Add Caregiver', () => {
    const { getByText, getByLabelText } = renderScreen();
    fireEvent.changeText(getByLabelText('Full Name'), 'John Doe');
    fireEvent.changeText(getByLabelText('Phone Number'), '555-1234');
    fireEvent.press(getByText('Add Caregiver'));
    expect(navigation.navigate).toHaveBeenCalledWith('Confirmation');
  });

  test('shows phone validation hint for short number', () => {
    const { getByText, getByLabelText } = renderScreen();
    fireEvent.changeText(getByLabelText('Phone Number'), '123');
    expect(getByText('Phone number must have at least 7 digits')).toBeTruthy();
  });

  test('toggling permission checkbox works', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('View Appointments'));
    fireEvent.press(getByText('View Appointments'));
    expect(getByText('View Appointments')).toBeTruthy();
  });

  test('Skip for Now navigates to Confirmation', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('Skip for Now'));
    expect(navigation.navigate).toHaveBeenCalledWith('Confirmation');
  });

  test('back button calls goBack', () => {
    const { getByLabelText } = renderScreen();
    fireEvent.press(getByLabelText('Go back'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
