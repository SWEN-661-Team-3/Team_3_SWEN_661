import React from 'react';
import { render } from '@testing-library/react-native';
import SuccessScreen from '../SuccessScreen';

const mockReset = jest.fn();
const navigation = { reset: mockReset };

describe('SuccessScreen', () => {
  test('renders complete variant', () => {
    const { getByText } = render(
      <SuccessScreen navigation={navigation} route={{ params: { type: 'complete', title: 'Eye Exam' } }} />
    );
    expect(getByText('Task Complete!')).toBeTruthy();
    expect(getByText('Eye Exam')).toBeTruthy();
  });

  test('renders snooze variant', () => {
    const { getByText } = render(
      <SuccessScreen navigation={navigation} route={{ params: { type: 'snooze' } }} />
    );
    expect(getByText('Snoozed')).toBeTruthy();
  });

  test('renders postpone variant', () => {
    const { getByText } = render(
      <SuccessScreen navigation={navigation} route={{ params: { type: 'postpone' } }} />
    );
    expect(getByText('Postponed')).toBeTruthy();
  });

  test('defaults to complete for unknown type', () => {
    const { getByText } = render(
      <SuccessScreen navigation={navigation} route={{ params: {} }} />
    );
    expect(getByText('Task Complete!')).toBeTruthy();
  });

  test('renders navigation buttons', () => {
    const { getByText } = render(
      <SuccessScreen navigation={navigation} route={{ params: { type: 'complete' } }} />
    );
    expect(getByText('Return to Home')).toBeTruthy();
    expect(getByText("Return to Today's Plan")).toBeTruthy();
  });
});
