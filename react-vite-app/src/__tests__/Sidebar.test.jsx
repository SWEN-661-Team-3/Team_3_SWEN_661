import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../components/Sidebar';

const tasks = [
  { id: '1', title: 'Morning Meds', time: '8:00 AM', status: 'done' },
  { id: '2', title: 'Eye Appointment', time: '10:30 AM', status: 'todo' },
  { id: '3', title: 'Afternoon Walk', time: '3:00 PM', status: 'todo' },
];

describe('Sidebar', () => {
  it('renders the helper name', () => {
    render(<Sidebar helperName="Sarah Johnson" tasks={tasks} onSelectTask={jest.fn()} />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  });

  it('renders all tasks in the list', () => {
    render(<Sidebar helperName="Sarah Johnson" tasks={tasks} onSelectTask={jest.fn()} />);
    expect(screen.getByText('Morning Meds')).toBeInTheDocument();
    expect(screen.getByText('Eye Appointment')).toBeInTheDocument();
    expect(screen.getByText('Afternoon Walk')).toBeInTheDocument();
  });

  it('shows task times', () => {
    render(<Sidebar helperName="Sarah Johnson" tasks={tasks} onSelectTask={jest.fn()} />);
    expect(screen.getByText('8:00 AM')).toBeInTheDocument();
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
    expect(screen.getByText('3:00 PM')).toBeInTheDocument();
  });

  it('calls onSelectTask when a task button is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<Sidebar helperName="Sarah Johnson" tasks={tasks} onSelectTask={onSelect} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(onSelect).toHaveBeenCalledWith('1', expect.any(Object));
  });

  it('applies done styling to completed tasks', () => {
    render(<Sidebar helperName="Sarah Johnson" tasks={tasks} onSelectTask={jest.fn()} />);
    const doneButton = screen.getByLabelText(/Morning Meds.*Done/);
    expect(doneButton.className).toContain('done');
  });

  it('uses semantic aside element', () => {
    const { container } = render(
      <Sidebar helperName="Sarah Johnson" tasks={tasks} onSelectTask={jest.fn()} />,
    );
    expect(container.querySelector('aside')).toBeInTheDocument();
  });

  it('has accessible navigation label', () => {
    render(<Sidebar helperName="Sarah Johnson" tasks={tasks} onSelectTask={jest.fn()} />);
    expect(screen.getByRole('navigation', { name: "Today's tasks" })).toBeInTheDocument();
  });
});
