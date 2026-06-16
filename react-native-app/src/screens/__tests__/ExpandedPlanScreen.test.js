import React from 'react';
import { render } from '@testing-library/react-native';
import ExpandedPlanScreen from '../ExpandedPlanScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const mockGoBack = jest.fn();
const navigation = { navigate: jest.fn(), goBack: mockGoBack, canGoBack: () => true };

function renderWithProvider() {
  return render(
    <AppProvider>
      <ExpandedPlanScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('ExpandedPlanScreen', () => {
  test('renders Full Plan header', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Full Plan')).toBeTruthy();
  });

  test('renders time groups', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Morning')).toBeTruthy();
  });

  test('renders plan items', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Daily Vitamin & Heart Med')).toBeTruthy();
    expect(getByText('Eye Doctor Checkup')).toBeTruthy();
  });

  test('renders progress bar', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('1 of 6 completed')).toBeTruthy();
  });
});
