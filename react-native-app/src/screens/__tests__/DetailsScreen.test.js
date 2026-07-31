import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import DetailsScreen from '../DetailsScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.spyOn(Alert, 'alert');

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = { navigate: mockNavigate, goBack: mockGoBack, canGoBack: () => true };

beforeEach(() => { mockNavigate.mockClear(); mockGoBack.mockClear(); Alert.alert.mockClear(); });

function renderWithProvider(route = {}) {
  return render(
    <AppProvider>
      <DetailsScreen navigation={navigation} route={{ params: route }} />
    </AppProvider>
  );
}

describe('DetailsScreen', () => {
  test('renders item details header', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    expect(getByText('Item Details')).toBeTruthy();
  });

  test('renders appointment title and time', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    expect(getByText('Eye Doctor Checkup')).toBeTruthy();
    expect(getByText(/10:30 AM/)).toBeTruthy();
  });

  test('renders location when present', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    expect(getByText(/City Eye Clinic/)).toBeTruthy();
  });

  test('renders notes section when present', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    expect(getByText('Important Notes')).toBeTruthy();
    expect(getByText(/Remember to bring/)).toBeTruthy();
  });

  test('Mark Complete navigates to Success', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    fireEvent.press(getByText('Mark Complete'));
    expect(mockNavigate).toHaveBeenCalledWith('Success', { type: 'complete', title: 'Eye Doctor Checkup' });
  });

  test('Snooze for 1 Hour navigates to Success', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    fireEvent.press(getByText('Snooze for 1 Hour'));
    expect(mockNavigate).toHaveBeenCalledWith('Success', { type: 'snooze', title: 'Eye Doctor Checkup' });
  });

  test('Edit Details shows alert', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    fireEvent.press(getByText('Edit Details'));
    expect(Alert.alert).toHaveBeenCalledWith('Edit', 'Edit functionality coming soon');
  });

  test('Ask Caregiver navigates to CaregiverHelp', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    fireEvent.press(getByText('Ask Caregiver'));
    expect(mockNavigate).toHaveBeenCalledWith('CaregiverHelp');
  });

  test('falls back to next incomplete task when no id', () => {
    const { getByText } = renderWithProvider({});
    expect(getByText('Eye Doctor Checkup')).toBeTruthy();
  });

  test('hides action buttons for done items', () => {
    const { queryByText } = renderWithProvider({ id: '1' });
    expect(queryByText('Mark Complete')).toBeNull();
    expect(queryByText('Snooze for 1 Hour')).toBeNull();
  });

  test('back button calls goBack', () => {
    const { getByLabelText } = renderWithProvider({ id: '2' });
    fireEvent.press(getByLabelText('Go back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
