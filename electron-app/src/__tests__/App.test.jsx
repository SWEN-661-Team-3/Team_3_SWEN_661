import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  it('renders the skip link', () => {
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('renders the app header', () => {
    render(<App />);
    expect(screen.getByText('CareConnect')).toBeInTheDocument();
  });

  it('renders the sidebar with helper info', () => {
    render(<App />);
    expect(screen.getByText('Sarah Johnson is available')).toBeInTheDocument();
  });

  it('renders the hero card with the next task', () => {
    render(<App />);
    const titles = screen.getAllByText('Eye Doctor Checkup');
    expect(titles.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Up Next')).toBeInTheDocument();
  });

  it('renders stats row', () => {
    render(<App />);
    expect(screen.getByText('Tasks done')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders keyboard shortcuts button and removes accessibility shortcuts button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Keyboard Shortcuts' })).toBeInTheDocument();
    expect(screen.queryByText('Accessibility Shortcuts')).not.toBeInTheDocument();
  });

  it('shows page header text', () => {
    render(<App />);
    expect(screen.getByText("Here is today's plan.")).toBeInTheDocument();
  });

  it('opens search bar when Search toolbar button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
  });

  it("focuses today's plan without scrolling the window", async () => {
    const user = userEvent.setup();
    render(<App />);
    const main = document.getElementById('main-content');
    const focusSpy = jest.spyOn(main, 'focus');

    await user.click(screen.getByRole('button', { name: "Today's Plan" }));

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('closes search bar when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByPlaceholderText(/search tasks/i)).not.toBeInTheDocument();
  });

  it('opens task detail dialog when a task is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    const taskBtns = screen.getAllByRole('button', { name: /Daily Vitamin/i });
    await user.click(taskBtns[0]);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('does not visually mark a task as previously opened', async () => {
    const user = userEvent.setup();
    render(<App />);
    const taskButton = screen.getAllByRole('button', { name: /Eye Doctor Checkup/i })[0];

    await user.click(taskButton);
    expect(taskButton).not.toHaveClass('task-list__btn--selected');

    const detailDialog = screen.getByRole('dialog', { name: 'Eye Doctor Checkup' });
    await user.click(within(detailDialog).getByRole('button', { name: 'Mark complete' }));

    expect(taskButton).not.toHaveClass('task-list__btn--selected');
  });

  it('opens new reminder dialog from toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'New' }));
    expect(screen.getByText('New Reminder')).toBeInTheDocument();
  });

  it('opens settings dialog from toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByText('Accessibility settings')).toBeInTheDocument();
  });

  it('opens the Care Team page from the toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Care Team' }));

    expect(screen.getByRole('heading', { name: 'Care Team' })).toBeInTheDocument();
    expect(screen.getByText('3 helpers on your care team')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Sarah Johnson, Helper, available/ })).toBeInTheDocument();
  });

  it('opens the Care Team page with Ctrl+2', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard('{Control>}2{/Control}');

    expect(screen.getByRole('heading', { name: 'Care Team' })).toBeInTheDocument();
  });

  it('switches to today view and opens search when Ctrl+F is pressed from Care Team', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Care Team' }));
    fireEvent.keyDown(document, { key: 'f', ctrlKey: true });

    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
    expect(screen.getByText('Up Next')).toBeInTheDocument();
  });

  it('opens shortcuts dialog from keyboard shortcuts button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Keyboard Shortcuts' }));
    expect(screen.getByText('CareConnect Help')).toBeInTheDocument();
  });

  it('opens shortcuts dialog with the F1 shortcut', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard('{F1}');

    expect(screen.getByText('CareConnect Help')).toBeInTheDocument();
  });

  it('opens emergency help from the toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Emergency' }));

    const emergencyDialog = screen.getByRole('dialog', { name: 'Emergency Help' });
    expect(within(emergencyDialog).getByRole('button', { name: 'I Need Help' })).toBeInTheDocument();
  });

  it('opens emergency help with the F2 shortcut', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard('{F2}');

    const emergencyDialog = screen.getByRole('dialog', { name: 'Emergency Help' });
    expect(within(emergencyDialog).getByRole('button', { name: 'I Need Help' })).toBeInTheDocument();
  });

  it('previews accessibility changes immediately and rolls them back on close', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.body).not.toHaveClass('large-text');
    expect(document.body).not.toHaveClass('dark-mode');
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.click(screen.getByLabelText('Larger text (125%)'));
    await user.click(screen.getByLabelText('Dark Theme'));

    expect(document.body).toHaveClass('large-text');
    expect(document.body).toHaveClass('dark-mode');

    const settingsDialog = screen.getByLabelText('Accessibility settings');
    await user.click(within(settingsDialog).getByRole('button', { name: /^Close$/ }));

    expect(document.body).not.toHaveClass('large-text');
    expect(document.body).not.toHaveClass('dark-mode');

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByLabelText('Larger text (125%)')).not.toBeChecked();
    expect(screen.getByLabelText('Dark Theme')).not.toBeChecked();
  });

  it('keeps immediately applied accessibility changes when saved', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.click(screen.getByLabelText('Dark Theme'));
    expect(document.body).toHaveClass('dark-mode');

    await user.click(screen.getByText('Save settings'));
    expect(document.body).toHaveClass('dark-mode');

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByLabelText('Dark Theme')).toBeChecked();
  });

  it('combines dark theme and high contrast without a separate setting', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.queryByLabelText(/dark high contrast/i)).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('High contrast mode'));
    await user.click(screen.getByLabelText('Dark Theme'));

    expect(document.body).toHaveClass('high-contrast', 'dark-mode');
  });

  it('can save a new reminder', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'New' }));
    await user.type(screen.getByLabelText(/title/i), 'Physical Therapy');
    await user.type(screen.getByLabelText(/^time$/i), '4:00 PM');
    await user.type(screen.getByLabelText(/location/i), 'PT Center');

    const reminderDialog = screen.getByRole('dialog', { name: 'New Reminder' });
    await user.click(within(reminderDialog).getByRole('button', { name: 'Save' }));

    const completionDialog = screen.getByRole('dialog', { name: 'Task complete' });
    expect(screen.getByText('Physical Therapy')).toBeInTheDocument();
    expect(within(completionDialog).getByText('Physical Therapy saved!')).toBeInTheDocument();
    await user.click(within(completionDialog).getByRole('button', { name: /^Close$/ }));
    expect(screen.queryByRole('dialog', { name: 'Task complete' })).not.toBeInTheDocument();
  });

  it("saves today's plan as a text file from the toolbar", async () => {
    const user = userEvent.setup();
    const savePlanText = jest.fn().mockResolvedValue({ saved: true, filePath: 'todays-plan.txt' });
    window.careConnect = { savePlanText };
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'New' }));
    await user.type(screen.getByLabelText(/title/i), 'Physical Therapy');
    await user.type(screen.getByLabelText(/^time$/i), '4:00 PM');
    await user.type(screen.getByLabelText(/location/i), 'PT Center');

    const reminderDialog = screen.getByRole('dialog', { name: 'New Reminder' });
    await user.click(within(reminderDialog).getByRole('button', { name: 'Save' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Task complete' }))
        .getByRole('button', { name: /^Close$/ }),
    );

    await user.click(screen.getByRole('button', { name: 'Save Plan' }));

    expect(savePlanText).toHaveBeenCalledWith(expect.stringContaining("Today's Plan"));
    expect(savePlanText).toHaveBeenCalledWith(expect.stringContaining(
      'Appointment - Physical Therapy\n4:00 PM\nPT Center',
    ));

    const saveDialog = screen.getByRole('dialog', { name: 'Plan saved' });
    expect(
      within(saveDialog).getByText("Today's plan was saved as a text file."),
    ).toBeInTheDocument();

    await user.click(within(saveDialog).getByRole('button', { name: /^Close$/ }));
    expect(screen.queryByRole('dialog', { name: 'Plan saved' })).not.toBeInTheDocument();
  });

  it('announces when saving is unavailable', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Save Plan' }));

    expect(await screen.findByText('Unable to save plan')).toBeInTheDocument();
  });

  it('announces when saving is canceled from the keyboard shortcut', async () => {
    const user = userEvent.setup();
    const savePlanText = jest.fn().mockResolvedValue({ canceled: true });
    window.careConnect = { savePlanText };
    render(<App />);

    await user.keyboard('{Control>}s{/Control}');

    await waitFor(() => expect(savePlanText).toHaveBeenCalled());
    expect(await screen.findByText('Save canceled')).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Plan saved' })).not.toBeInTheDocument();
  });

  it('announces when saving does not complete', async () => {
    const user = userEvent.setup();
    const savePlanText = jest.fn().mockResolvedValue({ saved: false });
    window.careConnect = { savePlanText };
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Save Plan' }));

    await waitFor(() => expect(savePlanText).toHaveBeenCalled());
    expect(await screen.findByText('Unable to save plan')).toBeInTheDocument();
  });

  it('can mark a task complete', async () => {
    const user = userEvent.setup();
    render(<App />);

    const taskBtn = screen.getAllByRole('button', { name: /Eye Doctor Checkup/i })[0];
    await user.click(taskBtn);
    await user.click(screen.getByText('Mark complete'));

    const completionDialog = screen.getByRole('dialog', { name: 'Task complete' });
    expect(within(completionDialog).getByText('Eye Doctor Checkup marked complete!')).toBeInTheDocument();
    expect(screen.getByText('2/6')).toBeInTheDocument();
    await user.click(within(completionDialog).getByRole('button', { name: /^Close$/ }));
    expect(screen.queryByRole('dialog', { name: 'Task complete' })).not.toBeInTheDocument();
  });

  it('edits a task from its detail dialog and updates Today\'s Plan', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('button', { name: /Eye Doctor Checkup/i })[0]);
    await user.click(screen.getByRole('button', { name: 'Edit Eye Doctor Checkup' }));

    const editDialog = screen.getByRole('dialog', { name: 'Edit Reminder' });
    const titleInput = within(editDialog).getByLabelText('Title');
    expect(titleInput).toHaveValue('Eye Doctor Checkup');
    expect(within(editDialog).getByLabelText('Time')).toHaveValue('10:30 AM');
    expect(within(editDialog).getByLabelText('Location')).toHaveValue(
      'City Eye Clinic, 123 Vision Way',
    );

    await user.clear(titleInput);
    await user.type(titleInput, 'Annual Eye Checkup');
    await user.click(within(editDialog).getByRole('button', { name: 'Save' }));

    expect(screen.getAllByText('Annual Eye Checkup').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText('Eye Doctor Checkup')).not.toBeInTheDocument();
    const confirmation = screen.getByRole('dialog', { name: 'Reminder updated' });
    expect(within(confirmation).getByText('Annual Eye Checkup was updated.')).toBeInTheDocument();
  });

  it('protects unsaved task edits', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('button', { name: /Eye Doctor Checkup/i })[0]);
    await user.click(screen.getByRole('button', { name: 'Edit Eye Doctor Checkup' }));
    const editDialog = screen.getByRole('dialog', { name: 'Edit Reminder' });
    await user.type(within(editDialog).getByLabelText('Notes'), ' Updated');
    await user.click(within(editDialog).getByRole('button', { name: /^Close$/ }));

    expect(screen.getByRole('dialog', { name: 'Are you sure?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue editing' }));
    expect(screen.getByRole('dialog', { name: 'Edit Reminder' })).toBeInTheDocument();
  });

  it('requires confirmation before removing a task and updates the next task', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('button', { name: /Eye Doctor Checkup/i })[0]);
    await user.click(screen.getByRole('button', { name: 'Remove Eye Doctor Checkup' }));

    let removeDialog = screen.getByRole('dialog', { name: 'Remove reminder?' });
    expect(within(removeDialog).getByText(
      "Remove Eye Doctor Checkup from today's plan?",
    )).toBeInTheDocument();

    await user.click(within(removeDialog).getByRole('button', { name: 'Keep reminder' }));
    expect(screen.getAllByText('Eye Doctor Checkup').length).toBeGreaterThanOrEqual(1);

    await user.click(screen.getByRole('button', { name: 'Remove Eye Doctor Checkup' }));
    removeDialog = screen.getByRole('dialog', { name: 'Remove reminder?' });
    await user.click(within(removeDialog).getByRole('button', { name: 'Remove reminder' }));

    expect(screen.queryByText('Eye Doctor Checkup')).not.toBeInTheDocument();
    expect(screen.getAllByText('Lunch and Afternoon Meds').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Eye Doctor Checkup was removed.')).toBeInTheDocument();
    expect(screen.getByText('1/5')).toBeInTheDocument();
  });
});
