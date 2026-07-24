import { screen } from '@testing-library/react';
import NotificationRouteGuard from '../components/NotificationRouteGuard';
import { renderWithProviders } from './testUtils';

describe('NotificationRouteGuard', () => {
  let notificationDescriptor;
  let serviceWorkerDescriptor;

  beforeEach(() => {
    notificationDescriptor = Object.getOwnPropertyDescriptor(window, 'Notification');
    serviceWorkerDescriptor = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');
  });

  afterEach(() => {
    if (notificationDescriptor) {
      Object.defineProperty(window, 'Notification', notificationDescriptor);
    } else {
      delete window.Notification;
    }

    if (serviceWorkerDescriptor) {
      Object.defineProperty(navigator, 'serviceWorker', serviceWorkerDescriptor);
    } else {
      delete navigator.serviceWorker;
    }
  });

  it('renders protected content when notification and service worker APIs are available', () => {
    Object.defineProperty(window, 'Notification', { value: jest.fn(), configurable: true });
    Object.defineProperty(navigator, 'serviceWorker', { value: {}, configurable: true });

    renderWithProviders(
      <NotificationRouteGuard>
        <p>Protected notification settings</p>
      </NotificationRouteGuard>,
    );

    expect(screen.getByText('Protected notification settings')).toBeInTheDocument();
    expect(screen.queryByText('Notification Settings Unavailable')).not.toBeInTheDocument();
  });

  it('shows an accessible fallback when required APIs are unavailable', () => {
    delete window.Notification;
    delete navigator.serviceWorker;

    renderWithProviders(
      <NotificationRouteGuard>
        <p>Protected notification settings</p>
      </NotificationRouteGuard>,
    );

    expect(screen.getByRole('heading', { name: 'Notification Settings Unavailable', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Settings' })).toHaveAttribute('href', '/settings');
  });
});
