import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../components/EmptyState';
import GlobalErrorBanner from '../components/GlobalErrorBanner';
import InlineError from '../components/InlineError';
import LoadingStatus from '../components/LoadingStatus';
import SavingStatus from '../components/SavingStatus';
import { renderWithProviders } from './testUtils';

describe('shared status components', () => {
  it('renders loading and saving text in non-urgent status regions', () => {
    const { rerender } = renderWithProviders(<LoadingStatus message="Loading care team" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading care team');

    rerender(<SavingStatus message="Saving reminder" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saving reminder');
  });

  it('renders an inline error and invokes its retry action', async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    renderWithProviders(<InlineError message="Could not save reminder" onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not save reminder');
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders a global error banner with a keyboard-accessible retry action', async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    renderWithProviders(
      <GlobalErrorBanner title="Could not load care data" message="Check your connection." onRetry={onRetry} />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load care data');
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders an empty state with visible guidance and an optional action', () => {
    renderWithProviders(
      <EmptyState
        title="No reminders"
        message="Add a reminder to get started."
        action={<button type="button">Add Reminder</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'No reminders', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Add a reminder to get started.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Reminder' })).toBeInTheDocument();
  });
});
