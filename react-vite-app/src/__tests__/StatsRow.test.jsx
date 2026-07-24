import { render, screen } from '@testing-library/react';
import StatsRow from '../components/StatsRow';

const tasks = [
  { id: '1', status: 'done' },
  { id: '2', status: 'todo' },
  { id: '3', status: 'todo' },
  { id: '4', status: 'done' },
  { id: '5', status: 'todo' },
];

describe('StatsRow', () => {
  it('displays the correct completed count', () => {
    render(<StatsRow tasks={tasks} />);
    const completed = screen.getByText('2');
    expect(completed).toBeInTheDocument();
  });

  it('displays the correct remaining count', () => {
    render(<StatsRow tasks={tasks} />);
    const remaining = screen.getByText('3');
    expect(remaining).toBeInTheDocument();
  });

  it('renders Completed and Remaining labels', () => {
    render(<StatsRow tasks={tasks} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Remaining')).toBeInTheDocument();
  });

  it('has an accessible section label', () => {
    render(<StatsRow tasks={tasks} />);
    expect(screen.getByRole('region', { name: 'Plan completion statistics' })).toBeInTheDocument();
  });

  it('handles all tasks done', () => {
    const allDone = tasks.map((t) => ({ ...t, status: 'done' }));
    render(<StatsRow tasks={allDone} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
