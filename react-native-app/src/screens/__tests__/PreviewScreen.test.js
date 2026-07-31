import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PreviewScreen from '../PreviewScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn(), canGoBack: () => true };

beforeEach(() => { navigation.navigate.mockClear(); navigation.goBack.mockClear(); });

function renderWithProvider() {
  return render(
    <AppProvider>
      <PreviewScreen navigation={navigation} />
    </AppProvider>
  );
}

describe('PreviewScreen', () => {
  test('renders heading', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Try Your Settings')).toBeTruthy();
  });

  test('renders preview cards', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Eye Doctor Appt')).toBeTruthy();
    expect(getByText('Medicine Reminder')).toBeTruthy();
  });

  test('renders size toggle buttons', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Large')).toBeTruthy();
    expect(getByText('Extra Large')).toBeTruthy();
    expect(getByText('High Contrast')).toBeTruthy();
    expect(getByText('Dark Mode')).toBeTruthy();
    expect(getByText('Wide Spacing')).toBeTruthy();
  });

  test('switching to Extra Large updates preview', () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('Extra Large'));
    expect(getByText('Extra Large')).toBeTruthy();
  });

  test('toggling High Contrast works', () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('High Contrast'));
    expect(getByText('High Contrast')).toBeTruthy();
  });

  test('toggling Dark Mode works', () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('Dark Mode'));
    expect(getByText('Dark Mode')).toBeTruthy();
  });

  test('toggling Wide Spacing works', () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('Wide Spacing'));
    expect(getByText('Wide Spacing')).toBeTruthy();
  });

  test('Looks Good navigates to CaregiverSetup', async () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('Looks Good!'));
    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('CaregiverSetup');
    });
  });

  test('Make Changes navigates to Setup', () => {
    const { getByText } = renderWithProvider();
    fireEvent.press(getByText('Make Changes'));
    expect(navigation.navigate).toHaveBeenCalledWith('Setup');
  });

  test('back button calls goBack', () => {
    const { getByLabelText } = renderWithProvider();
    fireEvent.press(getByLabelText('Go back'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
