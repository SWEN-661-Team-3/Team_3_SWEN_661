import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';

function renderApp(route = '/') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <App />
        <CurrentPath />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function CurrentPath() {
  const { pathname } = useLocation();
  return <output data-testid="current-path">{pathname}</output>;
}

describe('App', () => {
  it('renders the skip link', () => {
    renderApp();
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('renders the header', () => {
    renderApp();
    expect(screen.getByText('CareConnect')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    renderApp();
    expect(screen.getByText(/Helping you manage daily care/)).toBeInTheDocument();
  });

  it('renders TodayPage on the root route', async () => {
    renderApp('/');
    expect(await screen.findByRole('heading', { name: "Today's Plan", level: 1 })).toBeInTheDocument();
    expect(screen.getByTestId('current-path')).toHaveTextContent('/today');
  });

  it('renders CareTeamPage on /care-team', async () => {
    renderApp('/care-team');
    expect(await screen.findByRole('heading', { name: 'Care Team', level: 1 })).toBeInTheDocument();
  });

  it('renders the caregiver detail page on a caregiver detail route', async () => {
    renderApp('/care-team/sarah');
    expect(await screen.findByRole('heading', { name: 'Sarah Johnson', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Care Team' })).toHaveAttribute('href', '/care-team');
  });

  it('renders SettingsPage on /settings', async () => {
    renderApp('/settings');
    expect(await screen.findByRole('heading', { name: 'Settings', level: 1 })).toBeInTheDocument();
  });

  it('renders the notification route guard in an unsupported environment', async () => {
    renderApp('/settings/notifications');
    expect(await screen.findByRole('heading', { name: 'Notification Settings Unavailable', level: 1 })).toBeInTheDocument();
  });

  it('renders EmergencyPage on /emergency', async () => {
    renderApp('/emergency');
    expect(await screen.findByRole('heading', { name: 'Emergency', level: 1 })).toBeInTheDocument();
  });

  it('renders NotFoundPage for unknown routes', async () => {
    renderApp('/some-nonexistent-page');
    expect(await screen.findByRole('heading', { name: 'Page Not Found', level: 1 })).toBeInTheDocument();
  });

  it('applies accessibility classes to document.body after initial data loads', async () => {
    renderApp();
    await screen.findByRole('heading', { name: "Today's Plan", level: 1 });
    expect(document.body.classList.contains('reduce-motion')).toBe(true);
  });

  it('removes classes on unmount', () => {
    const { unmount } = renderApp();
    unmount();
    expect(document.body.classList.contains('reduce-motion')).toBe(false);
  });
});
