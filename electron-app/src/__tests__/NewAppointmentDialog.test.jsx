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
    expect(screen.getByText('New Reminder')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^time$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('disables Save until Title, Time, and Location are complete', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();

    await user.type(screen.getByLabelText(/title/i), 'Physical Therapy');
    expect(saveButton).toBeDisabled();

    await user.type(screen.getByLabelText(/^time$/i), '2:00 PM');
    expect(saveButton).toBeDisabled();

    await user.type(screen.getByLabelText(/location/i), 'PT Center');
    expect(saveButton).toBeEnabled();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('calls onAdd with form data when valid', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);

    await user.type(screen.getByLabelText(/title/i), 'Physical Therapy');
    await user.type(screen.getByLabelText(/^time$/i), '2:00 PM');
    await user.type(screen.getByLabelText(/location/i), 'PT Center');
    await user.type(screen.getByLabelText(/notes/i), 'Wear comfortable clothes');

    await user.click(screen.getByRole('button', { name: 'Save' }));

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

  it('asks before closing when the form has unsaved data', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);

    await user.type(screen.getByLabelText(/notes/i), 'Call when arriving');
    const closeButton = screen.getByRole('button', { name: /^Close$/ });
    expect(closeButton).toHaveTextContent('X');
    await user.click(closeButton);

    expect(screen.getByRole('heading', { name: 'Are you sure?' })).toBeInTheDocument();
    expect(screen.getByText('This reminder has unsaved information. Close without saving?')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Close without saving' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps editing when the discard check is dismissed', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);

    await user.type(screen.getByLabelText(/notes/i), 'Call when arriving');
    await user.click(screen.getByRole('button', { name: /^Close$/ }));
    await user.click(screen.getByRole('button', { name: 'Continue editing' }));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.queryByRole('heading', { name: 'Are you sure?' })).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Call when arriving')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);
    const closeButton = screen.getByRole('button', { name: /^Close$/ });
    expect(closeButton).toHaveTextContent('X');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('allows selecting appointment type', async () => {
    const user = userEvent.setup();
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);

    await user.selectOptions(screen.getByLabelText(/type/i), 'medication');
    await user.type(screen.getByLabelText(/title/i), 'Evening Meds');
    await user.type(screen.getByLabelText(/^time$/i), '8:00 PM');
    await user.type(screen.getByLabelText(/location/i), 'Kitchen');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'medication' }),
    );
  });

  it('has required aria attributes on required fields', () => {
    render(<NewAppointmentDialog open={true} onClose={onClose} onAdd={onAdd} />);
    expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/^time$/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/location/i)).toHaveAttribute('aria-required', 'true');
  });
});
