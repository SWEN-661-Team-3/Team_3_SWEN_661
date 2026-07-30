import { Typography, Spacing, BorderRadius } from '../theme.js';

describe('theme', () => {
  test('Typography contains expected styles', () => {
    expect(Typography.headlineLarge.fontSize).toBe(30);
    expect(Typography.headlineMedium.fontSize).toBe(24);
    expect(Typography.headlineSmall.fontSize).toBe(20);
    expect(Typography.bodyLarge.fontSize).toBe(18);
    expect(Typography.bodyMedium.fontSize).toBe(16);
    expect(Typography.labelLarge.letterSpacing).toBe(1.5);
    expect(Typography.bodySmall.fontSize).toBe(16);
  });

  test('Spacing has correct values', () => {
    expect(Spacing.xs).toBe(4);
    expect(Spacing.sm).toBe(8);
    expect(Spacing.md).toBe(12);
    expect(Spacing.lg).toBe(16);
    expect(Spacing.xl).toBe(20);
    expect(Spacing.xxl).toBe(24);
    expect(Spacing.xxxl).toBe(32);
  });

  test('BorderRadius has correct values', () => {
    expect(BorderRadius.sm).toBe(8);
    expect(BorderRadius.md).toBe(14);
    expect(BorderRadius.lg).toBe(20);
    expect(BorderRadius.xl).toBe(36);
    expect(BorderRadius.full).toBe(999);
  });
});
