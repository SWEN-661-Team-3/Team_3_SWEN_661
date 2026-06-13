import React from 'react';
import { render } from '@testing-library/react-native';
import EmergencyConfirmedScreen from '../EmergencyConfirmedScreen';

const mockReset = jest.fn();
const navigation = { reset: mockReset };

describe('EmergencyConfirmedScreen', () => {
  test('renders heading', () => {
    const { getByText } = render(<EmergencyConfirmedScreen navigation={navigation} />);
    expect(getByText('Help Is On The Way')).toBeTruthy();
  });

  test('renders notified contacts', () => {
    const { getAllByText } = render(<EmergencyConfirmedScreen navigation={navigation} />);
    expect(getAllByText('Notified')).toHaveLength(2);
  });

  test('renders return home button', () => {
    const { getByText } = render(<EmergencyConfirmedScreen navigation={navigation} />);
    expect(getByText('Return Home')).toBeTruthy();
  });
});
