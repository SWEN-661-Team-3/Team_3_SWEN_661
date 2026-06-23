import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, waitFor } from '@testing-library/react-native';
import AppNavigator from '../AppNavigator';
import { AppProvider } from '../../context/AppContext';

jest.mock('../../screens/WelcomeScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'WelcomeScreenMock');
});

jest.mock('../../screens/HomeScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'HomeScreenMock');
});

function renderNavigator() {
  const { SafeAreaProvider } = require('react-native-safe-area-context');
  return render(
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>,
  );
}

describe('AppNavigator', () => {
  test('shows welcome when not onboarded', async () => {
    const { getByText } = renderNavigator();
    await waitFor(() => {
      expect(getByText('WelcomeScreenMock')).toBeTruthy();
    });
  });

  test('shows home when onboarded', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'is_onboarded') return Promise.resolve('true');
      return Promise.resolve(null);
    });

    const { getByText } = renderNavigator();
    await waitFor(() => {
      expect(getByText('HomeScreenMock')).toBeTruthy();
    });
  });
});
