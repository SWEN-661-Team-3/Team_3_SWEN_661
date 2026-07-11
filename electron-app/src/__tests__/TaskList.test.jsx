import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../components/TaskList';
import { initialPlan } from '../data';

describe('TaskList', () => {
  const onSelectTask = jest.fn();

  beforeEach(() => {
    onSelectTask.mockClear();
  });

  it('renders all tasks', () => {
    render(
      <TaskList tasks={initialPlan} selectedId={null} filter="" onSelectTask={onSelectTask} />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(initialPlan.length);
  });

  it('renders task titles', () => {
    render(
      <TaskList tasks={initialPlan} selectedId={null} filter="" onSelectTask={onSelectTask} />,
    );
    expect(screen.getByText('Daily Vitamin & Heart Med')).toBeInTheDocument();
    expect(screen.getByText('Eye Doctor Checkup')).toBeInTheDocument();
  });

  it('filters tasks by title', () => {
    render(
      <TaskList tasks={initialPlan} selectedId={null} filter="blood" onSelectTask={onSelectTask} />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(screen.getByText('Blood Pressure Log')).toBeInTheDocument();
  });

  it('filters tasks by type', () => {
    render(
      <TaskList
        tasks={initialPlan}
        selectedId={null}
        filter="medication"
        onSelectTask={onSelectTask}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });

  it('filters tasks by time', () => {
    render(
      <TaskList
        tasks={initialPlan}
        selectedId={null}
        filter="10:30"
        onSelectTask={onSelectTask}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(1);
  });

  it('calls onSelectTask when a task button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskList tasks={initialPlan} selectedId={null} filter="" onSelectTask={onSelectTask} />,
    );
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(onSelectTask).toHaveBeenCalledWith('1');
  });

  it('applies done styling for completed tasks', () => {
    render(
      <TaskList tasks={initialPlan} selectedId={null} filter="" onSelectTask={onSelectTask} />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].className).toContain('task-list__btn--done');
  });

  it('does not reveal which task was previously selected', () => {
    render(
      <TaskList tasks={initialPlan} selectedId="2" filter="" onSelectTask={onSelectTask} />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[1].className).not.toContain('task-list__btn--selected');
  });

  it('has accessible labels on task buttons', () => {
    render(
      <TaskList tasks={initialPlan} selectedId={null} filter="" onSelectTask={onSelectTask} />,
    );
    expect(
      screen.getByLabelText(/Daily Vitamin & Heart Med, 8:00 AM, Done, Medication/),
    ).toBeInTheDocument();
  });

  it('shows no items when filter matches nothing', () => {
    render(
      <TaskList
        tasks={initialPlan}
        selectedId={null}
        filter="xyznoexist"
        onSelectTask={onSelectTask}
      />,
    );
    const items = screen.queryAllByRole('listitem');
    expect(items.length).toBe(0);
  });
});
