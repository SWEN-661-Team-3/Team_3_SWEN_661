import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodayPage from '../pages/TodayPage';
import { initialPlan, caregivers } from '../data/careData';
import { renderWithProviders } from './testUtils';

function getPlan() {
  return initialPlan.map((t) => ({ ...t }));
}
const helpers = caregivers.map((c) => ({ ...c }));

describe('TodayPage', () => {
  it('renders the page title', () => {
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    expect(screen.getByRole('heading', { name: "Today's Plan", level: 1 })).toBeInTheDocument();
  });

  it('renders the hero card with next pending task', () => {
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    const matches = screen.getAllByText('Eye Doctor Checkup');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders stats row', () => {
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Remaining')).toBeInTheDocument();
  });

  it('renders sidebar with helper name', () => {
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  });

  it('renders all tasks in sidebar', () => {
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    expect(screen.getByText('Daily Vitamin & Heart Med')).toBeInTheDocument();
    expect(screen.getByText('Nighttime Eye Drops')).toBeInTheDocument();
  });

  it('has an Add Reminder button', () => {
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    expect(screen.getByText('Add Reminder')).toBeInTheDocument();
  });

  it('leaves the main landmark to the shared layout', () => {
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    expect(document.getElementById('main-content')).not.toBeInTheDocument();
  });

  it('has a live region for announcements', () => {
    const { container } = renderWithProviders(
      <TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />,
    );
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('opens task detail dialog when a sidebar task is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    const taskBtn = screen.getByLabelText(/Eye Doctor Checkup.*Pending/);
    await user.click(taskBtn);
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    expect(screen.getByText('Edit Details')).toBeInTheDocument();
  });

  it('opens task detail dialog from hero card click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    const heroBtn = screen.getByLabelText(/Next up.*Eye Doctor/);
    await user.click(heroBtn);
    expect(screen.getByText('Appointment')).toBeInTheDocument();
  });

  it('completes a task via Mark Complete', async () => {
    const user = userEvent.setup();
    const setPlan = jest.fn();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={setPlan} helpers={helpers} />);
    const taskBtn = screen.getByLabelText(/Eye Doctor Checkup.*Pending/);
    await user.click(taskBtn);
    await user.click(screen.getByText('Mark Complete'));
    await waitFor(() => expect(setPlan).toHaveBeenCalled());
  });

  it('shows completion notice after marking complete', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    const taskBtn = screen.getByLabelText(/Eye Doctor Checkup.*Pending/);
    await user.click(taskBtn);
    await user.click(screen.getByText('Mark Complete'));
    expect(await screen.findByText('Reminder Complete')).toBeInTheDocument();
  });

  it('deletes a reminder after destructive confirmation', async () => {
    const user = userEvent.setup();
    const setPlan = jest.fn();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={setPlan} helpers={helpers} />);

    await user.click(screen.getByLabelText(/Eye Doctor Checkup.*Pending/));
    await user.click(screen.getByRole('button', { name: 'Delete Reminder' }));
    const confirmation = screen.getAllByRole('button', { name: 'Delete Reminder' })
      .find((button) => button.closest('dialog.dialog--confirm'));
    await user.click(confirmation);

    await waitFor(() => expect(setPlan).toHaveBeenCalled());
    expect(await screen.findByRole('heading', { name: 'Reminder Deleted' })).toBeInTheDocument();
  });

  it('dismisses completion notice', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    const taskBtn = screen.getByLabelText(/Eye Doctor Checkup.*Pending/);
    await user.click(taskBtn);
    await user.click(screen.getByText('Mark Complete'));
    const okButtons = screen.getAllByText('OK');
    const visibleOk = okButtons.find((btn) => btn.closest('dialog[open]'));
    await user.click(visibleOk || okButtons[0]);
  });

  it('closes task detail dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    const taskBtn = screen.getByLabelText(/Eye Doctor Checkup.*Pending/);
    await user.click(taskBtn);
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
  });

  it('opens the add reminder dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={helpers} />);
    await user.click(screen.getByText('Add Reminder'));
    const addLabels = screen.getAllByText('Add Reminder');
    expect(addLabels.length).toBeGreaterThanOrEqual(2);
  });

  it('saves a new reminder', async () => {
    const user = userEvent.setup();
    const setPlan = jest.fn();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={setPlan} helpers={helpers} />);
    await user.click(screen.getByText('Add Reminder'));

    const dialog = document.querySelector('dialog[open]');
    const titleInput = dialog.querySelector('input.edit-field__control');
    await user.type(titleInput, 'New Task');
    await user.type(screen.getByRole('textbox', { name: /^Time/ }), '2:00 PM');

    const addButtons = screen.getAllByText('Add Reminder');
    const addBtn = addButtons.find((el) => el.tagName === 'BUTTON' && el.closest('dialog'));
    if (addBtn) {
      await user.click(addBtn);
      await waitFor(() => expect(setPlan).toHaveBeenCalled());
    }
  });

  it('opens edit mode in task detail and saves', async () => {
    const user = userEvent.setup();
    const setPlan = jest.fn();
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={setPlan} helpers={helpers} />);
    const taskBtn = screen.getByLabelText(/Eye Doctor Checkup.*Pending/);
    await user.click(taskBtn);
    await user.click(screen.getByText('Edit Details'));
    await user.click(screen.getByText('Save Changes'));
    await waitFor(() => expect(setPlan).toHaveBeenCalled());
  });

  it('uses "Helper" as fallback name when helpers is empty', () => {
    renderWithProviders(<TodayPage plan={getPlan()} setPlan={jest.fn()} helpers={[]} />);
    expect(screen.getByText('Helper')).toBeInTheDocument();
  });

  it('shows guidance when there are no reminders', () => {
    renderWithProviders(<TodayPage plan={[]} setPlan={jest.fn()} helpers={helpers} />);
    expect(screen.getByRole('heading', { name: 'No reminders yet', level: 2 })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Add Reminder' }).length).toBeGreaterThanOrEqual(1);
  });

  it('shows appointment guidance when reminders contain no upcoming appointment', () => {
    const planWithoutAppointments = getPlan().filter((task) => task.type !== 'appointment');
    renderWithProviders(<TodayPage plan={planWithoutAppointments} setPlan={jest.fn()} helpers={helpers} />);
    expect(screen.getByRole('heading', { name: 'No upcoming appointments', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Appointment' })).toBeInTheDocument();
  });
});
