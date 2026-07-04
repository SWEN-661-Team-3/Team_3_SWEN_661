import { act, fireEvent, render, screen } from '@testing-library/react';
import EmergencyDialog from '../components/EmergencyDialog';

const contacts = [
  {
    id: 'sarah',
    name: 'Sarah Johnson',
    relationship: 'Helper',
    initials: 'SJ',
  },
  {
    id: 'doctor',
    name: 'Dr. Emily Smith',
    relationship: 'Doctor',
    initials: 'ES',
  },
];

function renderEmergencyDialog(props = {}) {
  const onClose = jest.fn();
  const onAlertSent = jest.fn();

  render(
    <EmergencyDialog
      open={true}
      contacts={contacts}
      onClose={onClose}
      onAlertSent={onAlertSent}
      {...props}
    />,
  );

  return { onClose, onAlertSent };
}

describe('EmergencyDialog', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the initial emergency help state', () => {
    renderEmergencyDialog();

    expect(screen.getByRole('dialog', { name: 'Emergency Help' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'I Need Help' })).toBeInTheDocument();
    expect(screen.getByText(/Your emergency contacts will be notified/)).toBeInTheDocument();
  });

  it('starts a ten second countdown before sending the alert', () => {
    const { onAlertSent } = renderEmergencyDialog();

    fireEvent.click(screen.getByRole('button', { name: 'I Need Help' }));

    expect(screen.getByLabelText('Sending alert in 10 seconds')).toBeInTheDocument();
    expect(screen.getByText('Notifying:')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Dr. Emily Smith')).toBeInTheDocument();
    expect(onAlertSent).not.toHaveBeenCalled();

    for (let i = 0; i < 10; i += 1) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByRole('dialog', { name: 'Help Is On The Way' })).toBeInTheDocument();
    expect(screen.getByText(/Your emergency contacts have been notified/)).toBeInTheDocument();
    expect(screen.getAllByText('Notified')).toHaveLength(2);
    expect(onAlertSent).toHaveBeenCalledTimes(1);
  });

  it('cancels the countdown without sending the alert', () => {
    const { onAlertSent, onClose } = renderEmergencyDialog();

    fireEvent.click(screen.getByRole('button', { name: 'I Need Help' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(onAlertSent).not.toHaveBeenCalled();
  });

  it('returns home from the confirmed state', () => {
    const { onClose } = renderEmergencyDialog();

    fireEvent.click(screen.getByRole('button', { name: 'I Need Help' }));
    for (let i = 0; i < 10; i += 1) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }

    fireEvent.click(screen.getByRole('button', { name: 'Return Home' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
