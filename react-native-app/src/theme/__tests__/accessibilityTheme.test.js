import { getAccessibleTheme, scaleFontSize } from '../accessibilityTheme';

describe('accessibilityTheme', () => {
  test('returns default theme for standard settings', () => {
    const theme = getAccessibleTheme({
      textSize: 'large',
      contrast: 'standard',
      theme: 'light',
      spacing: 'standard',
      motion: 'reduced',
      screenReader: 'off',
    });
    expect(theme.textScale).toBe(1.15);
    expect(theme.colors.pageBg).toBe('#F8FAFC');
    expect(theme.wideSpacing).toBe(false);
  });

  test('returns high contrast palette', () => {
    const theme = getAccessibleTheme({
      textSize: 'extra-large',
      contrast: 'high',
      theme: 'light',
      spacing: 'wide',
      motion: 'reduced',
      screenReader: 'on',
    });
    expect(theme.textScale).toBe(1.3);
    expect(theme.colors.pageBg).toBe('#000000');
    expect(theme.wideSpacing).toBe(true);
    expect(theme.screenReaderEnhanced).toBe(true);
  });

  test('returns dark palette', () => {
    const theme = getAccessibleTheme({
      textSize: 'medium',
      contrast: 'standard',
      theme: 'dark',
      spacing: 'standard',
      motion: 'standard',
      screenReader: 'off',
    });
    expect(theme.colors.pageBg).toBe('#0F172A');
  });

  test('scaleFontSize applies multiplier', () => {
    expect(scaleFontSize(16, 1.3)).toBe(21);
  });
});
