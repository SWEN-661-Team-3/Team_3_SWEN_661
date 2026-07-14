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

    expect(screen.getByText('10')).toBeInTheDocument();
    const announcement = screen.getByText(
      'Care Connect will notifiy your care team in 10 seconds unless the cancel button is clicked.',
    );
    expect(announcement).toHaveAttribute('aria-live', 'polite');
    expect(announcement).toHaveFocus();
    expect(screen.getByText('Notifying:')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Dr. Emily Smith')).toBeInTheDocument();
    expect(onAlertSent).not.toHaveBeenCalled();

    const countdownCancelButton = screen.getByRole('button', { name: 'Cancel' });
    act(() => {
      countdownCancelButton.focus();
    });
    expect(countdownCancelButton).toHaveFocus();
    expect(announcement).toBeEmptyDOMElement();

    for (let i = 0; i < 10; i += 1) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }

    const confirmedDialog = screen.getByRole('dialog', { name: 'Help Is On The Way' });
    expect(confirmedDialog).toBeInTheDocument();
    expect(confirmedDialog).toHaveFocus();
    expect(screen.getByText(/Your emergency contacts have been notified\. Stay calm and stay where you are\. Notified: Sarah Johnson, Helper\. Dr\. Emily Smith, Doctor/)).toBeInTheDocument();
    expect(screen.getByText(/Your emergency contacts have been notified/, { selector: '.emergency-panel__copy' })).toBeInTheDocument();
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
