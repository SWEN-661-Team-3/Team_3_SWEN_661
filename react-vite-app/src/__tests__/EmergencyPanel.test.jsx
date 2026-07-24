import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmergencyPanel from '../components/EmergencyPanel';

const contacts = [
  { id: 'sarah', name: 'Sarah Johnson', relationship: 'Helper', phone: '(555) 234-5678', initials: 'SJ' },
  { id: 'drsmith', name: 'Dr. Emily Smith', relationship: 'Doctor', phone: '(555) 891-2345', initials: 'ES' },
];

describe('EmergencyPanel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the idle state with Get Help Now button', () => {
    render(<EmergencyPanel contacts={contacts} />);
    expect(screen.getByText('Need Help?')).toBeInTheDocument();
    expect(screen.getByText('Get Help Now')).toBeInTheDocument();
  });

  it('displays emergency contacts', () => {
    render(<EmergencyPanel contacts={contacts} />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Dr. Emily Smith')).toBeInTheDocument();
  });

  it('shows contact details', () => {
    render(<EmergencyPanel contacts={contacts} />);
    expect(screen.getByText(/Helper/)).toBeInTheDocument();
    expect(screen.getByText(/\(555\) 234-5678/)).toBeInTheDocument();
  });

  it('starts countdown when Get Help Now is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<EmergencyPanel contacts={contacts} />);
    await user.click(screen.getByText('Get Help Now'));
    expect(screen.getByText('Sending Alert...')).toBeInTheDocument();
    expect(screen.getByText('Cancel Alert')).toBeInTheDocument();
  });

  it('shows countdown timer decreasing', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<EmergencyPanel contacts={contacts} />);
    await user.click(screen.getByText('Get Help Now'));

    expect(screen.getByText(/5 seconds/)).toBeInTheDocument();

    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByText(/4 seconds/)).toBeInTheDocument();

    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByText(/3 seconds/)).toBeInTheDocument();
  });

  it('cancels the alert and returns to idle', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<EmergencyPanel contacts={contacts} />);
    await user.click(screen.getByText('Get Help Now'));
    await user.click(screen.getByText('Cancel Alert'));
    expect(screen.getByText('Need Help?')).toBeInTheDocument();
  });

  it('shows confirmed state after countdown completes', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<EmergencyPanel contacts={contacts} />);
    await user.click(screen.getByText('Get Help Now'));

    act(() => { jest.advanceTimersByTime(5000); });
    expect(screen.getByText('Alert Sent')).toBeInTheDocument();
    expect(screen.getByText('Return to Safety')).toBeInTheDocument();
  });

  it('returns to idle from confirmed state', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<EmergencyPanel contacts={contacts} />);
    await user.click(screen.getByText('Get Help Now'));

    act(() => { jest.advanceTimersByTime(5000); });
    await user.click(screen.getByText('Return to Safety'));
    expect(screen.getByText('Need Help?')).toBeInTheDocument();
  });

  it('renders with empty contacts', () => {
    render(<EmergencyPanel contacts={[]} />);
    expect(screen.getByText('Need Help?')).toBeInTheDocument();
    expect(screen.queryByText('Emergency Contacts')).not.toBeInTheDocument();
  });

  it('has an accessible send alert button label', () => {
    render(<EmergencyPanel contacts={contacts} />);
    expect(screen.getByLabelText('Send emergency alert')).toBeInTheDocument();
  });

  it('uses aria-live assertive for status announcements', () => {
    const { container } = render(<EmergencyPanel contacts={contacts} />);
    const liveRegion = container.querySelector('[aria-live="assertive"]');
    expect(liveRegion).toBeInTheDocument();
  });
});
