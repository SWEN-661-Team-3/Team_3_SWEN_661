import React from 'react';
import { render } from '@testing-library/react-native';
import StatusBadge from '../StatusBadge';

describe('StatusBadge', () => {
  test.each([
    ['done', 'Done'],
    ['missed', 'Missed'],
    ['sent', 'Sent'],
    ['todo', 'To Do'],
  ])('renders %s badge with label %s', (type, label) => {
    const { getByText } = render(<StatusBadge type={type} />);
    expect(getByText(label)).toBeTruthy();
  });

  test('renders with accessibility label', () => {
    const { getByLabelText } = render(<StatusBadge type="done" />);
    expect(getByLabelText('Status: Done')).toBeTruthy();
  });

  test('falls back to todo for unknown type', () => {
    const { getByText } = render(<StatusBadge type="unknown" />);
    expect(getByText('To Do')).toBeTruthy();
  });
});
