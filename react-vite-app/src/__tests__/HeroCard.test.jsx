import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroCard from '../components/HeroCard';

const mockTask = {
  id: '2',
  title: 'Eye Doctor Checkup',
  time: '10:30 AM',
  location: 'City Eye Clinic',
  type: 'appointment',
  status: 'todo',
};

describe('HeroCard', () => {
  it('renders null when no task is provided', () => {
    const { container } = render(<HeroCard task={null} onClick={jest.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders task title and time', () => {
    render(<HeroCard task={mockTask} onClick={jest.fn()} />);
    expect(screen.getByText('Eye Doctor Checkup')).toBeInTheDocument();
    expect(screen.getByText(/10:30 AM/)).toBeInTheDocument();
  });

  it('shows the type label badge', () => {
    render(<HeroCard task={mockTask} onClick={jest.fn()} />);
    expect(screen.getByText(/Appointment/)).toBeInTheDocument();
  });

  it('includes location when present', () => {
    render(<HeroCard task={mockTask} onClick={jest.fn()} />);
    expect(screen.getByText(/City Eye Clinic/)).toBeInTheDocument();
  });

  it('omits location separator when location is empty', () => {
    const taskNoLocation = { ...mockTask, location: '' };
    render(<HeroCard task={taskNoLocation} onClick={jest.fn()} />);
    const timeEl = screen.getByText('10:30 AM');
    expect(timeEl.textContent).not.toContain('\u2022');
  });

  it('calls onClick with task id on click', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<HeroCard task={mockTask} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(mockTask.id, expect.any(Object));
  });

  it('has an accessible label describing the task', () => {
    render(<HeroCard task={mockTask} onClick={jest.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Eye Doctor Checkup'));
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('10:30 AM'));
  });

  it('falls back for unknown task type', () => {
    const unknownTypeTask = { ...mockTask, type: 'unknown-type' };
    render(<HeroCard task={unknownTypeTask} onClick={jest.fn()} />);
    expect(screen.getByText(/unknown-type/)).toBeInTheDocument();
  });
});
