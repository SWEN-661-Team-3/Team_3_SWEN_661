import { screen } from '@testing-library/react';
import NotificationSettingsPage from '../pages/NotificationSettingsPage';
import { defaultSettings } from '../services/settingsService';
import { renderWithProviders } from './testUtils';

it('renders the lazily routed notification settings page through the shared settings UI', () => {
  renderWithProviders(
    <NotificationSettingsPage
      settings={defaultSettings}
      onSettingsChange={jest.fn()}
      notifications={{ supported: false, enabled: false, permission: 'unsupported', toggle: jest.fn() }}
    />,
  );

  expect(screen.getByRole('heading', { name: 'Settings', level: 1 })).toBeInTheDocument();
  expect(screen.getByText('Task Reminders')).toBeInTheDocument();
});
