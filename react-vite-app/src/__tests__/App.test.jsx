import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';

function renderApp(route = '/') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  );
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

  it('redirects the root route to TodayPage', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: "Today's Plan", level: 1 })).toBeInTheDocument();
  });

  it('renders CareTeamPage on /care-team', () => {
    renderApp('/care-team');
    expect(screen.getByRole('heading', { name: 'Care Team', level: 1 })).toBeInTheDocument();
  });

  it('renders CareTeamPage on a caregiver detail route', () => {
    renderApp('/care-team/sarah');
    expect(screen.getByRole('heading', { name: 'Care Team', level: 1 })).toBeInTheDocument();
  });

  it('renders SettingsPage on /settings', () => {
    renderApp('/settings');
    expect(screen.getByRole('heading', { name: 'Settings', level: 1 })).toBeInTheDocument();
  });

  it('renders SettingsPage on /settings/notifications', () => {
    renderApp('/settings/notifications');
    expect(screen.getByRole('heading', { name: 'Settings', level: 1 })).toBeInTheDocument();
  });

  it('renders EmergencyPage on /emergency', () => {
    renderApp('/emergency');
    expect(screen.getByRole('heading', { name: 'Emergency', level: 1 })).toBeInTheDocument();
  });

  it('applies accessibility classes to document.body', () => {
    renderApp();
    expect(document.body.classList.contains('reduce-motion')).toBe(true);
  });

  it('removes classes on unmount', () => {
    const { unmount } = renderApp();
    unmount();
    expect(document.body.classList.contains('reduce-motion')).toBe(false);
  });
});
