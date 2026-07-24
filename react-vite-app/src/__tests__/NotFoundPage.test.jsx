import { screen } from '@testing-library/react';
import { renderWithProviders } from './testUtils';
import NotFoundPage from '../pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('renders the not-found heading', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByRole('heading', { name: 'Page Not Found', level: 1 })).toBeInTheDocument();
  });

  it('displays an explanation message', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText(/does not exist or has been moved/)).toBeInTheDocument();
  });

  it('provides a link to Today\'s Plan', () => {
    renderWithProviders(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /Today's Plan/ });
    expect(link).toHaveAttribute('href', '/');
  });

  it('provides a link to Care Team', () => {
    renderWithProviders(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /Care Team/ });
    expect(link).toHaveAttribute('href', '/care-team');
  });

  it('has an accessible main landmark', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
