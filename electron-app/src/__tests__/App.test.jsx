import { fireEvent, render, screen, within } from '@testing-library/react';
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
    await user.click(screen.getByTitle('Search (Ctrl+F)'));
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
  });

  it("focuses today's plan without scrolling the window", async () => {
    const user = userEvent.setup();
    render(<App />);
    const main = document.getElementById('main-content');
    const focusSpy = jest.spyOn(main, 'focus');

    await user.click(screen.getByTitle("Today's Plan (Ctrl+1)"));

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('closes search bar when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTitle('Search (Ctrl+F)'));
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

  it('opens new reminder dialog from toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTitle('New reminder (Ctrl+N)'));
    expect(screen.getByText('New Reminder')).toBeInTheDocument();
  });

  it('opens settings dialog from toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTitle('Settings (Ctrl+,)'));
    expect(screen.getByText('Accessibility settings')).toBeInTheDocument();
  });

  it('opens the Care Team page from the toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTitle('Care Team (Ctrl+2)'));

    expect(screen.getByRole('heading', { name: 'Care Team' })).toBeInTheDocument();
    expect(screen.getByText('3 helpers on your care team')).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Sarah Johnson' })).toBeInTheDocument();
  });

  it('opens the Care Team page with Ctrl+2', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard('{Control>}2{/Control}');

    expect(screen.getByRole('heading', { name: 'Care Team' })).toBeInTheDocument();
  });

  it('keeps menu shortcuts available inside Care Team dialogs', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTitle('Care Team (Ctrl+2)'));
    await user.click(screen.getByRole('button', { name: 'Add Helper' }));
    await user.click(screen.getByLabelText('Name'));
    fireEvent.keyDown(document, { key: 'f', ctrlKey: true });

    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Add Helper' })).toBeInTheDocument();
  });

  it('opens shortcuts dialog from keyboard shortcuts button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Keyboard Shortcuts' }));
    expect(screen.getByText('CareConnect Help')).toBeInTheDocument();
  });

  it('opens emergency help from the toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTitle('Emergency help (F2)'));

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
    await user.click(screen.getByTitle('Settings (Ctrl+,)'));
    await user.click(screen.getByLabelText('Larger text (125%)'));
    await user.click(screen.getByLabelText('Dark Theme'));

    expect(document.body).toHaveClass('large-text');
    expect(document.body).toHaveClass('dark-mode');

    const settingsDialog = screen.getByLabelText('Accessibility settings');
    await user.click(within(settingsDialog).getByRole('button', { name: /^Close$/ }));

    expect(document.body).not.toHaveClass('large-text');
    expect(document.body).not.toHaveClass('dark-mode');

    await user.click(screen.getByTitle('Settings (Ctrl+,)'));
    expect(screen.getByLabelText('Larger text (125%)')).not.toBeChecked();
    expect(screen.getByLabelText('Dark Theme')).not.toBeChecked();
  });

  it('keeps immediately applied accessibility changes when saved', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTitle('Settings (Ctrl+,)'));
    await user.click(screen.getByLabelText('Dark Theme'));
    expect(document.body).toHaveClass('dark-mode');

    await user.click(screen.getByText('Save settings'));
    expect(document.body).toHaveClass('dark-mode');

    await user.click(screen.getByTitle('Settings (Ctrl+,)'));
    expect(screen.getByLabelText('Dark Theme')).toBeChecked();
  });

  it('combines dark theme and high contrast without a separate setting', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTitle('Settings (Ctrl+,)'));
    expect(screen.queryByLabelText(/dark high contrast/i)).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('High contrast mode'));
    await user.click(screen.getByLabelText('Dark Theme'));

    expect(document.body).toHaveClass('high-contrast', 'dark-mode');
  });

  it('can save a new reminder', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTitle('New reminder (Ctrl+N)'));
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
});
