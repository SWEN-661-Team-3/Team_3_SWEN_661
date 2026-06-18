import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider, useAccessibleTheme } from '../../context/ThemeContext';
import { AppProvider } from '../../context/AppContext';

function TestConsumer() {
  const { colors } = useAccessibleTheme();
  return <Text>{colors.pageBg}</Text>;
}

describe('ThemeProvider', () => {
  test('provides theme colors from accessibility settings', () => {
    const { getByText } = render(
      <AppProvider>
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      </AppProvider>,
    );
    expect(getByText('#F8FAFC')).toBeTruthy();
  });
});
