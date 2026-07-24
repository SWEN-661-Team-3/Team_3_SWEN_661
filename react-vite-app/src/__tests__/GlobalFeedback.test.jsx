import { act, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import GlobalOperationBanner from '../components/GlobalOperationBanner';
import { GlobalFeedbackProvider, useGlobalFeedback } from '../components/GlobalFeedbackContext';
import { renderWithProviders } from './testUtils';

function FeedbackHarness() {
  const { message, showFeedback, dismissFeedback } = useGlobalFeedback();
  const navigate = useNavigate();

  return (
    <>
      <button type="button" onClick={() => showFeedback({ type: 'success', text: 'Reminder saved.' })}>
        Show success
      </button>
      <button type="button" onClick={() => showFeedback({ type: 'error', text: 'Could not save reminder.' })}>
        Show error
      </button>
      <button type="button" onClick={() => showFeedback({ type: 'info', text: 'Notifications are ready.' })}>
        Show info
      </button>
      <button type="button" onClick={() => navigate('/settings')}>
        Change route
      </button>
      {message && (
        <GlobalOperationBanner
          type={message.type}
          message={message.text}
          onDismiss={dismissFeedback}
        />
      )}
    </>
  );
}

function renderFeedback() {
  return renderWithProviders(
    <GlobalFeedbackProvider>
      <FeedbackHarness />
    </GlobalFeedbackProvider>,
  );
}

describe('global operation feedback', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('announces a successful operation once and removes it after the brief delay', () => {
    jest.useFakeTimers();
    const { container } = renderFeedback();

    fireEvent.click(screen.getByRole('button', { name: 'Show success' }));

    expect(screen.getByRole('status')).toHaveTextContent('Reminder saved.');
    expect(container.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('keeps failure feedback visible until the user dismisses it', () => {
    jest.useFakeTimers();
    renderFeedback();

    fireEvent.click(screen.getByRole('button', { name: 'Show error' }));
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Could not save reminder.');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss message' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders informational feedback in the same single polite announcement region', () => {
    const { container } = renderFeedback();

    fireEvent.click(screen.getByRole('button', { name: 'Show info' }));

    expect(screen.getByRole('status')).toHaveTextContent('Notifications are ready.');
    expect(container.querySelectorAll('[role="status"]')).toHaveLength(1);
    expect(container.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
  });

  it('clears a message when the user navigates to a new route', () => {
    renderFeedback();

    fireEvent.click(screen.getByRole('button', { name: 'Show error' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Change route' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
