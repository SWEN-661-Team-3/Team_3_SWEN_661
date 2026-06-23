import Colors from './colors';

const highContrastColors = {
  ...Colors,
  pageBg: '#000000',
  white: '#1E1E1E',
  heading: '#FFFFFF',
  mutedText: '#FFFFFF',
  disabledText: '#FFFFFF',
  border: '#FFFFFF',
  primaryAction: '#FACC15',
  primaryActionDark: '#EAB308',
  subtleBg: '#1E1E1E',
  blueBg: '#1E1E1E',
  blueLight: '#333333',
  successBg: '#1E1E1E',
  warningBg: '#1E1E1E',
  emergencyBg: '#1E1E1E',
};

const darkColors = {
  ...Colors,
  pageBg: '#0F172A',
  white: '#1E293B',
  heading: '#FFFFFF',
  mutedText: '#CBD5E1',
  disabledText: '#94A3B8',
  border: '#334155',
  subtleBg: '#1E293B',
  blueBg: '#1E3A5F',
  blueLight: '#1E40AF',
  successBg: '#064E3B',
  warningBg: '#78350F',
  emergencyBg: '#7F1D1D',
};

export function getAccessibleTheme(settings) {
  const textScale = settings.textSize === 'extra-large'
    ? 1.3
    : settings.textSize === 'large'
      ? 1.15
      : 1.0;

  let colors = Colors;
  if (settings.contrast === 'high') {
    colors = highContrastColors;
  } else if (settings.theme === 'dark') {
    colors = darkColors;
  }

  return {
    colors,
    textScale,
    wideSpacing: settings.spacing === 'wide',
    reduceMotion: settings.motion === 'reduced',
    screenReaderEnhanced: settings.screenReader === 'on',
  };
}

export function scaleFontSize(size, textScale) {
  return Math.round(size * textScale);
}
