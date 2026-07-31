import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';

function ProblemChild({ shouldThrow }) {
  if (shouldThrow) throw new Error('Test error');
  return <Text>No error</Text>;
}

describe('ErrorBoundary', () => {
  const originalWarn = console.warn;
  const originalError = console.error;
  beforeAll(() => { console.warn = jest.fn(); console.error = jest.fn(); });
  afterAll(() => { console.warn = originalWarn; console.error = originalError; });

  test('renders children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary><ProblemChild shouldThrow={false} /></ErrorBoundary>
    );
    expect(getByText('No error')).toBeTruthy();
  });

  test('renders fallback UI on error', () => {
    const { getByText } = render(
      <ErrorBoundary><ProblemChild shouldThrow={true} /></ErrorBoundary>
    );
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Please try again or restart the app.')).toBeTruthy();
  });

  test('Try Again button is pressable and has correct a11y', () => {
    const { getByLabelText } = render(
      <ErrorBoundary><ProblemChild shouldThrow={true} /></ErrorBoundary>
    );
    const btn = getByLabelText('Try again');
    expect(btn).toBeTruthy();
    fireEvent.press(btn);
  });
});
