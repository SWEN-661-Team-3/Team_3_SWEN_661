import { render, screen } from '@testing-library/react';
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
    expect(screen.getByText('Sarah is available')).toBeInTheDocument();
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

  it('renders accessibility shortcuts button', () => {
    render(<App />);
    expect(screen.getByText('Accessibility Shortcuts')).toBeInTheDocument();
  });

  it('shows page header text', () => {
    render(<App />);
    expect(screen.getByText('Your setup is complete.')).toBeInTheDocument();
    expect(screen.getByText("Here is today's plan.")).toBeInTheDocument();
  });

  it('opens search bar when Search toolbar button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTitle('Search (Ctrl+F)'));
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
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

  it('opens new appointment dialog from toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTitle('New appointment (Ctrl+N)'));
    expect(screen.getByText('New Appointment')).toBeInTheDocument();
  });

  it('opens settings dialog from toolbar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTitle('Settings (Ctrl+,)'));
    expect(screen.getByText('Accessibility settings')).toBeInTheDocument();
  });

  it('opens settings dialog from accessibility shortcuts button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Accessibility Shortcuts'));
    expect(screen.getByText('Accessibility settings')).toBeInTheDocument();
  });

  it('can add a new appointment', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTitle('New appointment (Ctrl+N)'));
    await user.type(screen.getByLabelText(/title/i), 'Physical Therapy');
    await user.type(screen.getByLabelText(/^time$/i), '4:00 PM');
    await user.click(screen.getByText('Add Appointment'));

    expect(screen.getByText('Physical Therapy')).toBeInTheDocument();
  });

  it('can mark a task complete', async () => {
    const user = userEvent.setup();
    render(<App />);

    const taskBtn = screen.getAllByRole('button', { name: /Eye Doctor Checkup/i })[0];
    await user.click(taskBtn);
    await user.click(screen.getByText('Mark complete'));

    expect(screen.getByText('2/6')).toBeInTheDocument();
  });
});
