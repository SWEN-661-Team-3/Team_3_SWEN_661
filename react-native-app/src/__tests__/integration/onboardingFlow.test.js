import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AppProvider } from '../../context/AppContext';
import { ThemeProvider } from '../../context/ThemeContext';
import AppNavigator from '../../navigation/AppNavigator';

function TestApp() {
  const { SafeAreaProvider } = require('react-native-safe-area-context');
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ThemeProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

describe('Onboarding integration flow', () => {
  test('Welcome to Setup navigation', async () => {
    const { getByLabelText, getByText } = render(<TestApp />);

    await waitFor(() => {
      expect(getByText('CareConnect')).toBeTruthy();
    });

    fireEvent.press(getByLabelText('Start Setup'));

    await waitFor(() => {
      expect(getByText('Accessibility Settings')).toBeTruthy();
    });
  });

  test('Setup to Preview navigation', async () => {
    const { getByLabelText, getByText } = render(<TestApp />);

    await waitFor(() => getByLabelText('Start Setup'));
    fireEvent.press(getByLabelText('Start Setup'));

    await waitFor(() => getByText('Preview Settings'));
    fireEvent.press(getByText('Preview Settings'));

    await waitFor(() => {
      expect(getByText('Try Your Settings')).toBeTruthy();
    });
  });
});

describe('Home integration flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'is_onboarded') return Promise.resolve('true');
      return Promise.resolve(null);
    });
  });

  test('Home to Details via next appointment', async () => {
    const { getByLabelText, getByText } = render(<TestApp />);

    await waitFor(() => {
      expect(getByLabelText(/Next appointment/i)).toBeTruthy();
    });

    fireEvent.press(getByLabelText(/Next appointment/i));

    await waitFor(() => {
      expect(getByText('Item Details')).toBeTruthy();
      expect(getByLabelText('Mark Complete')).toBeTruthy();
    });
  });

  test('Home to Emergency screen', async () => {
    const { getAllByLabelText, getByText } = render(<TestApp />);

    await waitFor(() => expect(getAllByLabelText('Emergency help').length).toBeGreaterThan(0));
    fireEvent.press(getAllByLabelText('Emergency help')[0]);

    await waitFor(() => {
      expect(getByText('Emergency Help')).toBeTruthy();
      expect(getByText('I Need Help')).toBeTruthy();
    });
  });
});

describe('Reminder integration flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'is_onboarded') return Promise.resolve('true');
      return Promise.resolve(null);
    });
  });

  test('Home reminder to notification screen', async () => {
    const { getByLabelText, getByText } = render(<TestApp />);

    await waitFor(() => getByLabelText(/Afternoon Medication/i));
    fireEvent.press(getByLabelText(/Afternoon Medication/i));

    await waitFor(() => {
      expect(getByText('Reminder')).toBeTruthy();
      expect(getByLabelText('Mark Done')).toBeTruthy();
    });
  });
});
