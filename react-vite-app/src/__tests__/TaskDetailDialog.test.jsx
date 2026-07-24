import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskDetailDialog from '../components/TaskDetailDialog';

const mockTask = {
  id: '2',
  title: 'Eye Doctor Checkup',
  date: 'Today',
  time: '10:30 AM',
  location: 'City Eye Clinic, 123 Vision Way',
  notes: 'Bring glasses and eye drop list.',
  type: 'appointment',
  status: 'todo',
  actionLabel: 'Get Directions',
};

describe('TaskDetailDialog', () => {
  it('renders nothing when task is null', () => {
    const { container } = render(
      <TaskDetailDialog task={null} open={false} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    expect(container.querySelector('dialog')).not.toBeInTheDocument();
  });

  it('renders task details in view mode', () => {
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    expect(screen.getByText('Eye Doctor Checkup')).toBeInTheDocument();
    expect(screen.getByText('Appointment')).toBeInTheDocument();
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows location when present', () => {
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    expect(screen.getByText('City Eye Clinic, 123 Vision Way')).toBeInTheDocument();
  });

  it('shows notes when present', () => {
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    expect(screen.getByText('Bring glasses and eye drop list.')).toBeInTheDocument();
  });

  it('hides location row when location is empty', () => {
    const noLoc = { ...mockTask, location: '' };
    render(
      <TaskDetailDialog task={noLoc} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    expect(screen.queryByText('Location')).not.toBeInTheDocument();
  });

  it('hides notes row when notes are empty', () => {
    const noNotes = { ...mockTask, notes: '' };
    render(
      <TaskDetailDialog task={noNotes} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    const noteLabels = screen.queryAllByText('Notes');
    expect(noteLabels).toHaveLength(0);
  });

  it('shows Mark Complete button for todo tasks', () => {
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    expect(screen.getByText('Mark Complete')).toBeInTheDocument();
  });

  it('keeps the view footer focused on complete, edit, and delete actions', () => {
    const { container } = render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    const footer = container.querySelector('.dialog__footer');

    expect(within(footer).queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(within(footer).getAllByRole('button').map((button) => button.textContent.trim()))
      .toEqual(['Mark Complete', 'Edit Details', 'Delete Reminder']);
  });

  it('hides Mark Complete button for done tasks', () => {
    const doneTask = { ...mockTask, status: 'done' };
    render(
      <TaskDetailDialog task={doneTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    expect(screen.queryByText('Mark Complete')).not.toBeInTheDocument();
  });

  it('calls onComplete when Mark Complete is clicked', async () => {
    const user = userEvent.setup();
    const onComplete = jest.fn();
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={onComplete} onSave={jest.fn()} />,
    );
    await user.click(screen.getByText('Mark Complete'));
    expect(onComplete).toHaveBeenCalledWith('2');
  });

  it('shows completion feedback and offers retry after a failed completion', async () => {
    const user = userEvent.setup();
    const onComplete = jest.fn()
      .mockRejectedValueOnce(new Error('Completion failed'))
      .mockResolvedValueOnce(true);
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={onComplete} onSave={jest.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Mark Complete' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not mark this reminder complete.');
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(2));
  });

  it('keeps the reminder available and offers retry when deletion fails', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn()
      .mockRejectedValueOnce(new Error('Delete failed'))
      .mockResolvedValueOnce(true);
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onDelete={onDelete} onSave={jest.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Delete Reminder' }));
    const deleteConfirmation = screen.getAllByRole('button', { name: 'Delete Reminder' })
      .find((button) => button.closest('dialog.dialog--confirm'));
    await user.click(deleteConfirmation);

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not delete this reminder.');
    expect(screen.getByText('Eye Doctor Checkup')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(2));
  });

  it('switches to edit mode when Edit Details is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    await user.click(screen.getByText('Edit Details'));
    expect(screen.getByDisplayValue('Eye Doctor Checkup')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('renders in add mode with empty form', () => {
    const newTask = {
      id: 'new-1',
      title: '',
      date: 'Today',
      time: '',
      location: '',
      notes: '',
      type: 'health-task',
      status: 'todo',
      actionLabel: 'View Details',
    };
    render(
      <TaskDetailDialog task={newTask} open={true} mode="add" onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    const addLabels = screen.getAllByText('Add Reminder');
    expect(addLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('shows proactive reminder guidance and non-live character counters', async () => {
    const user = userEvent.setup();
    const newTask = {
      ...mockTask,
      id: 'new-2',
      title: '',
      notes: '',
      type: 'health-task',
    };
    const { container } = render(
      <TaskDetailDialog task={newTask} open mode="add" onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );

    const title = screen.getByRole('textbox', { name: /Reminder/ });
    expect(title).toHaveAttribute('aria-describedby', expect.stringContaining('reminder-title-count'));
    expect(screen.getByText('0 of 120 characters.')).toBeInTheDocument();
    expect(screen.getByText('0 of 1000 characters.')).toBeInTheDocument();
    expect(document.querySelector('label[for="reminder-location"]')).toHaveTextContent('Location');
    expect(container.querySelectorAll('.field-help[aria-live]')).toHaveLength(0);

    await user.type(title, 'Call clinic');
    expect(screen.getByText('11 of 120 characters.')).toBeInTheDocument();
  });

  it('updates appointment location guidance when the type changes', async () => {
    const user = userEvent.setup();
    const newTask = { ...mockTask, id: 'new-3', type: 'health-task' };
    render(
      <TaskDetailDialog task={newTask} open mode="add" onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );

    expect(document.querySelector('label[for="reminder-location"]')).toHaveTextContent('Location');
    await user.selectOptions(screen.getByRole('combobox', { name: /Type/ }), 'appointment');
    expect(document.querySelector('label[for="reminder-location"]')).toHaveTextContent('Location (required)');
  });

  it('has close button with accessible label', () => {
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={jest.fn()} />,
    );
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('calls onSave with form data in edit mode', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn(() => true);
    render(
      <TaskDetailDialog task={mockTask} open={true} onClose={jest.fn()} onComplete={jest.fn()} onSave={onSave} />,
    );
    await user.click(screen.getByText('Edit Details'));
    await user.click(screen.getByText('Save Changes'));
    expect(onSave).toHaveBeenCalled();
  });

  it('shows accessible field errors and focuses the first invalid reminder field', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn(() => true);
    const invalidTask = { ...mockTask, title: ' ', time: '', location: '' };
    render(
      <TaskDetailDialog task={invalidTask} open mode="add" onClose={jest.fn()} onComplete={jest.fn()} onSave={onSave} />,
    );

    await user.click(screen.getByRole('button', { name: 'Add Reminder' }));

    const title = screen.getByRole('textbox', { name: /Reminder/ });
    expect(screen.getByRole('alert')).toHaveTextContent('Please correct the highlighted reminder fields.');
    expect(title).toHaveAttribute('aria-invalid', 'true');
    expect(title).toHaveAttribute('aria-describedby', expect.stringContaining('reminder-title-error'));
    expect(screen.getByText('Enter a reminder title.')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    await user.clear(title);
    await user.type(title, 'Follow-up appointment');
    expect(screen.queryByText('Enter a reminder title.')).not.toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: /Time/ }), '10:30 AM');
    await user.type(screen.getByRole('textbox', { name: /Location/ }), 'Clinic');
    await user.click(screen.getByRole('button', { name: 'Add Reminder' }));

    expect(onSave).toHaveBeenCalled();
    expect(screen.queryByText('Enter a reminder title.')).not.toBeInTheDocument();
  });

  it('shows a saving state and disables duplicate saves while the save is pending', async () => {
    const user = userEvent.setup();
    let resolveSave;
    const onSave = jest.fn(() => new Promise((resolve) => {
      resolveSave = resolve;
    }));
    render(
      <TaskDetailDialog task={mockTask} open onClose={jest.fn()} onComplete={jest.fn()} onSave={onSave} />,
    );

    await user.click(screen.getByRole('button', { name: 'Edit Details' }));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('status')).toHaveTextContent('Saving reminder...');
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    expect(onSave).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSave(true);
    });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Details' })).toBeInTheDocument());
  });

  it('preserves reminder values and offers retry when saving fails', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn()
      .mockRejectedValueOnce(new Error('Save failed'))
      .mockResolvedValueOnce(true);
    render(
      <TaskDetailDialog task={mockTask} open onClose={jest.fn()} onComplete={jest.fn()} onSave={onSave} />,
    );

    await user.click(screen.getByRole('button', { name: 'Edit Details' }));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not save this reminder.');
    expect(screen.getByDisplayValue('Eye Doctor Checkup')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Details' })).toBeInTheDocument());
  });
});
