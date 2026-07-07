import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskDetailDialog from '../components/TaskDetailDialog';

const todoTask = {
  id: '2',
  title: 'Eye Doctor Checkup',
  time: '10:30 AM',
  location: 'City Eye Clinic',
  notes: 'Bring your glasses',
  type: 'appointment',
  status: 'todo',
};

const doneTask = {
  ...todoTask,
  id: '1',
  title: 'Daily Vitamin',
  status: 'done',
  notes: '',
};

describe('TaskDetailDialog', () => {
  const onClose = jest.fn();
  const onComplete = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    onComplete.mockClear();
  });

  it('renders task title in heading', () => {
    render(
      <TaskDetailDialog task={todoTask} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    expect(screen.getByText('Eye Doctor Checkup')).toBeInTheDocument();
  });

  it('shows task details (status, type, time, location)', () => {
    render(
      <TaskDetailDialog task={todoTask} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Appointment')).toBeInTheDocument();
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
    expect(screen.getByText('City Eye Clinic')).toBeInTheDocument();
  });

  it('shows health task type without the icon prefix', () => {
    const healthTask = { ...todoTask, type: 'health-task' };
    const { container } = render(
      <TaskDetailDialog task={healthTask} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    const typeValue = container.querySelector('.detail-row:nth-of-type(2) .detail-row__value');

    expect(typeValue).toHaveTextContent(/^Health Task$/);
    expect(typeValue).not.toHaveTextContent(/^H Health Task$/);
  });

  it('shows notes when present', () => {
    render(
      <TaskDetailDialog task={todoTask} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    expect(screen.getByText('Bring your glasses')).toBeInTheDocument();
  });

  it('does not show notes section when empty', () => {
    render(
      <TaskDetailDialog task={doneTask} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    expect(screen.queryByText('Notes')).not.toBeInTheDocument();
  });

  it('shows Mark complete button for todo tasks', () => {
    render(
      <TaskDetailDialog task={todoTask} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    expect(screen.getByText('Mark complete')).toBeInTheDocument();
  });

  it('hides Mark complete button for done tasks', () => {
    render(
      <TaskDetailDialog task={doneTask} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    expect(screen.queryByText('Mark complete')).not.toBeInTheDocument();
  });

  it('shows one close button as X with a Close accessible label', () => {
    render(
      <TaskDetailDialog task={todoTask} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    const closeButtons = screen.getAllByRole('button', { name: /^Close$/ });
    expect(closeButtons).toHaveLength(1);
    expect(closeButtons[0]).toHaveTextContent('X');
  });

  it('calls onComplete when Mark complete is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskDetailDialog task={todoTask} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    await user.click(screen.getByText('Mark complete'));
    expect(onComplete).toHaveBeenCalledWith('2');
  });

  it('renders nothing when task is null', () => {
    const { container } = render(
      <TaskDetailDialog task={null} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    expect(container.querySelector('dialog')).not.toBeInTheDocument();
  });

  it('defaults location to Home when empty', () => {
    const noLoc = { ...todoTask, location: '' };
    render(
      <TaskDetailDialog task={noLoc} open={true} onClose={onClose} onComplete={onComplete} />,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
