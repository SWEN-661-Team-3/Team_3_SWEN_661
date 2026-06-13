import React from 'react';
import { render } from '@testing-library/react-native';
import CaregiverHelpScreen from '../CaregiverHelpScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

function renderWithProvider() {
  return render(
    <AppProvider>
      <CaregiverHelpScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('CaregiverHelpScreen', () => {
  test('renders heading', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Your Caregivers')).toBeTruthy();
  });

  test('renders caregiver names', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Sarah')).toBeTruthy();
    expect(getByText("Dr. Miller's Office")).toBeTruthy();
  });
});
