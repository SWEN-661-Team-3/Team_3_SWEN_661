import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DetailsScreen from '../DetailsScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = { navigate: mockNavigate, goBack: mockGoBack, canGoBack: () => true };

function renderWithProvider(route = {}) {
  return render(
    <AppProvider>
      <DetailsScreen navigation={navigation} route={{ params: route }} />
    </AppProvider>
  );
}

describe('DetailsScreen', () => {
  beforeEach(() => { mockNavigate.mockClear(); mockGoBack.mockClear(); });

  test('renders item details header', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    expect(getByText('Item Details')).toBeTruthy();
  });

  test('renders appointment title', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    expect(getByText('Eye Doctor Checkup')).toBeTruthy();
  });

  test('renders Mark Complete button', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    expect(getByText('Mark Complete')).toBeTruthy();
  });

  test('renders Ask Caregiver button', () => {
    const { getByText } = renderWithProvider({ id: '2' });
    expect(getByText('Ask Caregiver')).toBeTruthy();
  });

  test('falls back to next incomplete task when no id', () => {
    const { getByText } = renderWithProvider({});
    expect(getByText('Eye Doctor Checkup')).toBeTruthy();
  });
});
