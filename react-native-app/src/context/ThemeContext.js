import React from 'react';
import { View } from 'react-native';
import { useAppState } from '../context/AppContext';
import { getAccessibleTheme } from '../theme/accessibilityTheme';

const ThemeContext = React.createContext(null);

export function ThemeProvider({ children }) {
  const { state } = useAppState();
  const theme = React.useMemo(
    () => getAccessibleTheme(state.settings),
    [state.settings],
  );

  return (
    <ThemeContext.Provider value={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.pageBg }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useAccessibleTheme() {
  const theme = React.useContext(ThemeContext);
  if (!theme) {
    throw new Error('useAccessibleTheme must be used within ThemeProvider');
  }
  return theme;
}
