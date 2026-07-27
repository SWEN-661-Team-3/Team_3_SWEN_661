import { lazy } from 'react';
import { screen } from '@testing-library/react';
import AppLayout from '../components/AppLayout';
import { GlobalFeedbackProvider } from '../components/GlobalFeedbackContext';
import { renderWithProviders } from './testUtils';

const PendingRoute = lazy(() => new Promise(() => {}));

describe('AppLayout', () => {
  it('shows the shared accessible loading status while a lazy route is pending', () => {
    renderWithProviders(
      <GlobalFeedbackProvider>
        <AppLayout>
          <PendingRoute />
        </AppLayout>
      </GlobalFeedbackProvider>,
    );

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Loading page...');
    expect(status.closest('.app-layout__loading')).toBeInTheDocument();
  });
});
