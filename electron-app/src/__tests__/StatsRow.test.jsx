import { render, screen } from '@testing-library/react';
import StatsRow from '../components/StatsRow';

describe('StatsRow', () => {
  const tasks = [
    { id: '1', status: 'done' },
    { id: '2', status: 'todo' },
    { id: '3', status: 'todo' },
    { id: '4', status: 'done' },
  ];

  it('displays correct done count', () => {
    render(<StatsRow tasks={tasks} />);
    expect(screen.getByText('2/4')).toBeInTheDocument();
  });

  it('displays correct pending count', () => {
    render(<StatsRow tasks={tasks} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows "Tasks done" label', () => {
    render(<StatsRow tasks={tasks} />);
    expect(screen.getByText('Tasks done')).toBeInTheDocument();
  });

  it('shows "Pending" label', () => {
    render(<StatsRow tasks={tasks} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('handles all tasks done', () => {
    const allDone = [
      { id: '1', status: 'done' },
      { id: '2', status: 'done' },
    ];
    render(<StatsRow tasks={allDone} />);
    expect(screen.getByText('2/2')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles empty task list', () => {
    render(<StatsRow tasks={[]} />);
    expect(screen.getByText('0/0')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
