import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewAppointmentDialog from '../components/NewAppointmentDialog';

describe('NewAppointmentDialog', () => {
  const onClose = jest.fn();
  const onAdd = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    onAdd.mockClear();
  });

  it('renders the dialog title', () => {
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);
    expect(screen.getByText('New Appointment')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^time$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);
    await user.click(screen.getByText('Add Appointment'));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Time is required')).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('calls onAdd with form data when valid', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);

    await user.type(screen.getByLabelText(/title/i), 'Physical Therapy');
    await user.type(screen.getByLabelText(/^time$/i), '2:00 PM');
    await user.type(screen.getByLabelText(/location/i), 'PT Center');
    await user.type(screen.getByLabelText(/notes/i), 'Wear comfortable clothes');

    await user.click(screen.getByText('Add Appointment'));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Physical Therapy',
        time: '2:00 PM',
        location: 'PT Center',
        notes: 'Wear comfortable clothes',
        type: 'appointment',
        status: 'todo',
      }),
    );
  });

  it('clears validation error when field is filled', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);

    await user.click(screen.getByText('Add Appointment'));
    expect(screen.getByText('Title is required')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/title/i), 'Test');
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);
    await user.click(screen.getByLabelText(/close new appointment/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('allows selecting appointment type', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);

    await user.selectOptions(screen.getByLabelText(/type/i), 'medication');
    await user.type(screen.getByLabelText(/title/i), 'Evening Meds');
    await user.type(screen.getByLabelText(/^time$/i), '8:00 PM');
    await user.click(screen.getByText('Add Appointment'));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'medication' }),
    );
  });

  it('has required aria attributes on required fields', () => {
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);
    expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/^time$/i)).toHaveAttribute('aria-required', 'true');
  });
});
