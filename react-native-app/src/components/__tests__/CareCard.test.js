import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import CareCard from '../CareCard';

describe('CareCard', () => {
  test('renders children', () => {
    const { getByText } = render(
      <CareCard><Text>Hello</Text></CareCard>
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  test('renders as View when no onTap', () => {
    const { queryByRole } = render(
      <CareCard><Text>Static</Text></CareCard>
    );
    expect(queryByRole('button')).toBeNull();
  });

  test('renders as TouchableOpacity when onTap provided', () => {
    const onTap = jest.fn();
    const { getByRole } = render(
      <CareCard onTap={onTap}><Text>Tappable</Text></CareCard>
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(onTap).toHaveBeenCalledTimes(1);
  });

  test('passes accessibilityLabel', () => {
    const { getByLabelText } = render(
      <CareCard onTap={() => {}} accessibilityLabel="Card action">
        <Text>Content</Text>
      </CareCard>
    );
    expect(getByLabelText('Card action')).toBeTruthy();
  });
});
