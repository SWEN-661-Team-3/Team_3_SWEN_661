import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SnoozeOptionsScreen from '../SnoozeOptionsScreen';
import { AppProvider } from '../../context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

beforeEach(() => { navigation.navigate.mockClear(); navigation.goBack.mockClear(); });

function renderScreen(params = {}) {
  return render(
    <AppProvider>
      <SnoozeOptionsScreen navigation={navigation} route={{ params }} />
    </AppProvider>
  );
}

describe('SnoozeOptionsScreen', () => {
  test('renders heading', () => {
    const { getByText } = renderScreen();
    expect(getByText('How long would you like to snooze?')).toBeTruthy();
  });

  test('renders all duration options', () => {
    const { getByText } = renderScreen();
    expect(getByText('5 minutes')).toBeTruthy();
    expect(getByText('15 minutes')).toBeTruthy();
    expect(getByText('30 minutes')).toBeTruthy();
    expect(getByText('1 hour')).toBeTruthy();
    expect(getByText('2 hours')).toBeTruthy();
  });

  test('15 minutes is selected by default', () => {
    const { getByText } = renderScreen();
    expect(getByText('15 minutes')).toBeTruthy();
  });

  test('selecting a different duration works', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText('30 minutes'));
    expect(getByText('30 minutes')).toBeTruthy();
  });

  test('Snooze Reminder button navigates to Success', () => {
    const { getAllByText } = renderScreen();
    const buttons = getAllByText('Snooze Reminder');
    fireEvent.press(buttons[buttons.length - 1]);
    expect(navigation.navigate).toHaveBeenCalledWith('Success', expect.objectContaining({ type: 'snooze' }));
  });

  test('uses specific reminderId when provided', () => {
    const { getAllByText } = renderScreen({ reminderId: '1' });
    const buttons = getAllByText('Snooze Reminder');
    fireEvent.press(buttons[buttons.length - 1]);
    expect(navigation.navigate).toHaveBeenCalledWith('Success', { type: 'snooze', title: 'Afternoon Medication' });
  });

  test('back button calls goBack', () => {
    const { getByLabelText } = renderScreen();
    fireEvent.press(getByLabelText('Go back'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
