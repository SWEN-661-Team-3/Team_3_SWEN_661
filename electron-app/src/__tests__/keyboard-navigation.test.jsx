import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Keyboard Navigation', () => {
  it('skip link is focusable via Tab', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    expect(screen.getByText('Skip to main content')).toHaveFocus();
  });

  it('toolbar buttons are reachable via Tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab(); // skip link
    await user.tab(); // first toolbar button (New)
    expect(screen.getByRole('button', { name: 'New' })).toHaveFocus();
  });

  it('can tab through all toolbar buttons', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab(); // skip link
    await user.tab(); // New
    await user.tab(); // Save
    expect(screen.getByRole('button', { name: 'Save Plan' })).toHaveFocus();
    await user.tab(); // Search
    expect(screen.getByRole('button', { name: 'Search' })).toHaveFocus();
    await user.tab(); // Today's Plan
    expect(screen.getByRole('button', { name: "Today's Plan" })).toHaveFocus();
    await user.tab(); // Care Team
    expect(screen.getByRole('button', { name: 'Care Team' })).toHaveFocus();
    await user.tab(); // Settings
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveFocus();
    await user.tab(); // Emergency
    expect(screen.getByRole('button', { name: 'Emergency' })).toHaveFocus();
  });

  it('hero card is focusable and activatable via keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);
    const heroCard = document.querySelector('.hero-card');

    heroCard.focus();
    expect(heroCard).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Eye Doctor Checkup' })).toHaveFocus();
  });

  it('focuses a shortcut-opened dialog card instead of its close button', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard('{F1}');

    const dialog = screen.getByRole('dialog', { name: 'CareConnect Help' });
    expect(dialog).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Close' })).not.toHaveFocus();
  });

  it('removes the dialog card focus state after focus moves inside it', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard('{F1}');
    const dialog = screen.getByRole('dialog', { name: 'CareConnect Help' });
    expect(dialog).toHaveAttribute('tabindex', '-1');

    await user.tab();

    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    expect(dialog).not.toHaveAttribute('tabindex');
    expect(dialog).not.toHaveFocus();
  });

  it('task list buttons are focusable', async () => {
    render(<App />);
    const taskBtns = screen.getAllByRole('button', { name: /Daily Vitamin/i });
    taskBtns[0].focus();
    expect(taskBtns[0]).toHaveFocus();
  });

  it('does not retain focus on a task after its dialog receives keyboard focus', async () => {
    const user = userEvent.setup();
    render(<App />);
    const taskButton = screen.getAllByRole('button', { name: /Daily Vitamin/i })[0];

    taskButton.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('dialog', { name: 'Daily Vitamin & Heart Med' })).toHaveFocus();
    expect(taskButton).not.toHaveFocus();
  });

  it('Escape closes the search bar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByPlaceholderText(/search tasks/i)).not.toBeInTheDocument();
  });

  it('search input is focused when search bar opens', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByPlaceholderText(/search tasks/i)).toHaveFocus();
  });

  it('tab order flows from toolbar to sidebar to main content', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab(); // skip link
    for (let i = 0; i < 7; i++) {
      await user.tab(); // toolbar buttons
    }
    await user.tab(); // first sidebar task
    const activeEl = document.activeElement;
    expect(activeEl.closest('.sidebar') || activeEl.closest('.task-list')).toBeTruthy();
  });

  it('new reminder form fields are navigable via Tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'New' }));

    const titleInput = screen.getByLabelText(/title/i);
    titleInput.focus();
    expect(titleInput).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/type/i)).toHaveFocus();
  });

  it('main content area has tabindex for focus management', () => {
    render(<App />);
    const main = document.getElementById('main-content');
    expect(main).toHaveAttribute('tabindex', '-1');
  });
});
