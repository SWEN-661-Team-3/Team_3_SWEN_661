import React from 'react';
import { render } from '@testing-library/react-native';
import PreviewScreen from '../PreviewScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn(), canGoBack: () => true };

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

  test('renders action buttons', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('Looks Good!')).toBeTruthy();
    expect(getByText('Make Changes')).toBeTruthy();
  });
});
