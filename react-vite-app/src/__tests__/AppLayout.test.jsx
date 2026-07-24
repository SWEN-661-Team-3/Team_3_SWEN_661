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

    expect(screen.getByRole('status')).toHaveTextContent('Loading page...');
  });
});
