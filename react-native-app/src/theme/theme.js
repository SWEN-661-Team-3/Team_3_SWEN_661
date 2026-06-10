import { StyleSheet } from 'react-native';
import Colors from './colors';

export const Typography = StyleSheet.create({
  headlineLarge: {
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 45,
    color: Colors.heading,
  },
  headlineMedium: {
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 36,
    color: Colors.heading,
  },
  headlineSmall: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    color: Colors.heading,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 27,
    color: Colors.heading,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.heading,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    letterSpacing: 1.5,
    color: Colors.mutedText,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    color: Colors.mutedText,
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 36,
  full: 999,
};
