import { screen } from '@testing-library/react';
import { renderWithProviders } from './testUtils';
import NotFoundPage from '../pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('renders the not-found heading', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByRole('heading', { name: 'Page Not Found', level: 1 })).toBeInTheDocument();
  });

  it('sets a unique document title', () => {
    renderWithProviders(<NotFoundPage />);
    expect(document.title).toBe('Page Not Found - CareConnect');
  });

  it('displays an explanation message', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText(/does not exist or has been moved/)).toBeInTheDocument();
  });

  it('provides a link to Today\'s Plan', () => {
    renderWithProviders(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /Today's Plan/ });
    expect(link).toHaveAttribute('href', '/today');
  });

  it('provides a link to Care Team', () => {
    renderWithProviders(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /Care Team/ });
    expect(link).toHaveAttribute('href', '/care-team');
  });

  it('leaves the main landmark to the shared layout', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('shows the requested path when it is safe to display', () => {
    renderWithProviders(<NotFoundPage />, { route: '/missing-page' });
    expect(screen.getByText('/missing-page')).toBeInTheDocument();
  });
});
