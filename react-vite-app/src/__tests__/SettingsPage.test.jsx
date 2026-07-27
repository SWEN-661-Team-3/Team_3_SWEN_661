import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPage from '../pages/SettingsPage';
import { renderWithProviders } from './testUtils';
import { saveSettings } from '../services/settingsService';

jest.mock('../services/settingsService', () => {
  const actual = jest.requireActual('../services/settingsService');
  return { ...actual, saveSettings: jest.fn(actual.saveSettings) };
});

const defaultSettings = {
  largeText: false,
  highContrast: false,
  darkTheme: false,
  reduceMotion: true,
};

const notifications = {
  supported: true,
  enabled: false,
  permission: 'default',
  toggle: jest.fn(),
};

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the settings panel', () => {
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={jest.fn()} notifications={notifications} />,
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders all display checkboxes', () => {
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={jest.fn()} notifications={notifications} />,
    );
    expect(screen.getByText('Large Text')).toBeInTheDocument();
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
    expect(screen.getByText('Dark Theme')).toBeInTheDocument();
    expect(screen.getByText('Reduce Motion')).toBeInTheDocument();
  });

  it('renders save and reset buttons', () => {
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={jest.fn()} notifications={notifications} />,
    );
    const saveButtons = screen.getAllByText('Save Settings');
    expect(saveButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Reset Defaults')).toBeInTheDocument();
  });

  it('applies a setting immediately without saving it', async () => {
    const user = userEvent.setup();
    const onSettingsChange = jest.fn();
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={onSettingsChange} notifications={notifications} />,
    );
    await user.click(screen.getByRole('checkbox', { name: /large text/i }));

    expect(onSettingsChange).toHaveBeenCalledWith({ ...defaultSettings, largeText: true });
    expect(saveSettings).not.toHaveBeenCalled();
    expect(screen.queryByText('Save Settings?')).not.toBeInTheDocument();
  });

  it('restores the last saved settings when leaving without saving', async () => {
    const user = userEvent.setup();
    const onSettingsChange = jest.fn();
    const { unmount } = renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={onSettingsChange} notifications={notifications} />,
    );

    await user.click(screen.getByRole('checkbox', { name: /large text/i }));
    unmount();

    expect(onSettingsChange).toHaveBeenLastCalledWith(defaultSettings);
  });

  it('saves directly and shows a success dialog', async () => {
    const user = userEvent.setup();
    const onSettingsChange = jest.fn();
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={onSettingsChange} notifications={notifications} />,
    );
    await user.click(screen.getByRole('button', { name: 'Save Settings' }));
    await waitFor(() => expect(saveSettings).toHaveBeenCalledWith(defaultSettings));
    expect(screen.queryByText('Save Settings?')).not.toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Settings Saved' })).toBeInTheDocument();
  });

  it('keeps settings context and offers retry when saving fails', async () => {
    const user = userEvent.setup();
    const onSettingsChange = jest.fn();
    saveSettings
      .mockRejectedValueOnce(new Error('Save failed'))
      .mockResolvedValueOnce({ ...defaultSettings });
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={onSettingsChange} notifications={notifications} />,
    );

    await user.click(screen.getByRole('button', { name: 'Save Settings' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not save settings.');
    expect(screen.getByText('Settings')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    await waitFor(() => expect(onSettingsChange).toHaveBeenCalledTimes(1));
  });

  it('calls onSettingsChange on reset', async () => {
    const user = userEvent.setup();
    const onSettingsChange = jest.fn();
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={onSettingsChange} notifications={notifications} />,
    );
    await user.click(screen.getByText('Reset Defaults'));
    expect(onSettingsChange).toHaveBeenCalled();
  });

  it('leaves the main landmark to the shared layout', () => {
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={jest.fn()} notifications={notifications} />,
    );
    expect(document.getElementById('main-content')).not.toBeInTheDocument();
  });
});
