import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppHeader from '../components/AppHeader';
import { renderWithProviders } from './testUtils';

describe('AppHeader', () => {
  it('renders the brand link with logo and title', () => {
    renderWithProviders(<AppHeader />);
    const brand = screen.getByLabelText('CareConnect home');
    expect(brand).toBeInTheDocument();
    expect(screen.getByAltText('CareConnect logo')).toBeInTheDocument();
    expect(screen.getByText('CareConnect')).toBeInTheDocument();
  });

  it('renders main navigation with correct links', () => {
    renderWithProviders(<AppHeader />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByText("Today's Plan")).toBeInTheDocument();
    expect(screen.getByText('Care Team')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Emergency')).toBeInTheDocument();
  });

  it('renders navigation links as a list', () => {
    renderWithProviders(<AppHeader />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    const list = nav.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list.querySelectorAll('li')).toHaveLength(5);
  });

  it('applies active class to current route link', () => {
    renderWithProviders(<AppHeader />, { route: '/care-team' });
    const careTeamLink = screen.getByText('Care Team');
    expect(careTeamLink.className).toContain('active');
  });

  it('toggles the mobile menu and closes it after selecting a link', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppHeader />);

    const menuButton = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();

    await user.click(screen.getAllByText('Care Team')[1]);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});
