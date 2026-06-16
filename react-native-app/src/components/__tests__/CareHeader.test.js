import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CareHeader from '../CareHeader';

describe('CareHeader', () => {
  test('renders title', () => {
    const { getByText } = render(<CareHeader title="Test Title" />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  test('renders subtitle when provided', () => {
    const { getByText } = render(<CareHeader title="Title" subtitle="Sub" />);
    expect(getByText('Sub')).toBeTruthy();
  });

  test('shows back button when onBack provided', () => {
    const onBack = jest.fn();
    const { getByLabelText } = render(<CareHeader title="Title" onBack={onBack} />);
    fireEvent.press(getByLabelText('Go back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('hides back button when no onBack', () => {
    const { queryByLabelText } = render(<CareHeader title="Title" />);
    expect(queryByLabelText('Go back')).toBeNull();
  });

  test('shows emergency button when onEmergency provided', () => {
    const onEmergency = jest.fn();
    const { getByLabelText } = render(<CareHeader title="Title" onEmergency={onEmergency} />);
    fireEvent.press(getByLabelText('Emergency help'));
    expect(onEmergency).toHaveBeenCalledTimes(1);
  });
});
