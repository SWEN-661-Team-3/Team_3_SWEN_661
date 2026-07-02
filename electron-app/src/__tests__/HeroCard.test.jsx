import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroCard from '../components/HeroCard';

const mockTask = {
  id: '2',
  title: 'Eye Doctor Checkup',
  time: '10:30 AM',
  location: 'City Eye Clinic',
  status: 'todo',
  type: 'appointment',
};

describe('HeroCard', () => {
  const onClick = jest.fn();

  beforeEach(() => {
    onClick.mockClear();
  });

  it('renders the task title', () => {
    render(<HeroCard task={mockTask} onClick={onClick} />);
    expect(screen.getByText('Eye Doctor Checkup')).toBeInTheDocument();
  });

  it('renders the task time and location', () => {
    render(<HeroCard task={mockTask} onClick={onClick} />);
    expect(screen.getByText(/10:30 AM/)).toBeInTheDocument();
    expect(screen.getByText(/City Eye Clinic/)).toBeInTheDocument();
  });

  it('shows "Up Next" badge', () => {
    render(<HeroCard task={mockTask} onClick={onClick} />);
    expect(screen.getByText('Up Next')).toBeInTheDocument();
  });

  it('shows hint text', () => {
    render(<HeroCard task={mockTask} onClick={onClick} />);
    expect(screen.getByText('Press Enter to view details')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<HeroCard task={mockTask} onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith('2');
  });

  it('calls onClick on Enter key press', () => {
    render(<HeroCard task={mockTask} onClick={onClick} />);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledWith('2');
  });

  it('calls onClick on Space key press', () => {
    render(<HeroCard task={mockTask} onClick={onClick} />);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    expect(onClick).toHaveBeenCalledWith('2');
  });

  it('renders nothing when task is null', () => {
    const { container } = render(<HeroCard task={null} onClick={onClick} />);
    expect(container.innerHTML).toBe('');
  });

  it('defaults location to Home when not provided', () => {
    const taskNoLocation = { ...mockTask, location: '' };
    render(<HeroCard task={taskNoLocation} onClick={onClick} />);
    expect(screen.getByText(/Home/)).toBeInTheDocument();
  });

  it('is focusable via tabIndex', () => {
    render(<HeroCard task={mockTask} onClick={onClick} />);
    const card = screen.getByRole('button');
    expect(card.tabIndex).toBe(0);
  });
});
