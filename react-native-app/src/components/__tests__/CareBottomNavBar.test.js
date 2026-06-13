import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CareBottomNavBar from '../CareBottomNavBar';

describe('CareBottomNavBar', () => {
  test('renders Full Plan and Settings labels', () => {
    const { getByText } = render(
      <CareBottomNavBar onFullPlan={() => {}} onSettings={() => {}} />
    );
    expect(getByText('Full Plan')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  test('calls onFullPlan when pressed', () => {
    const onFullPlan = jest.fn();
    const { getByLabelText } = render(
      <CareBottomNavBar onFullPlan={onFullPlan} onSettings={() => {}} />
    );
    fireEvent.press(getByLabelText('Full Plan'));
    expect(onFullPlan).toHaveBeenCalledTimes(1);
  });

  test('calls onSettings when pressed', () => {
    const onSettings = jest.fn();
    const { getByLabelText } = render(
      <CareBottomNavBar onFullPlan={() => {}} onSettings={onSettings} />
    );
    fireEvent.press(getByLabelText('Settings'));
    expect(onSettings).toHaveBeenCalledTimes(1);
  });
});
