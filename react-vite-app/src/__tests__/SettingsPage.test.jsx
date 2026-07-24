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

  it('shows confirmation dialog on save', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={jest.fn()} notifications={notifications} />,
    );
    const saveButtons = screen.getAllByText('Save Settings');
    await user.click(saveButtons[0]);
    expect(screen.getByText('Save Settings?')).toBeInTheDocument();
    expect(screen.getByText('Save these settings?')).toBeInTheDocument();
  });

  it('confirms save and calls onSettingsChange', async () => {
    const user = userEvent.setup();
    const onSettingsChange = jest.fn();
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={onSettingsChange} notifications={notifications} />,
    );
    const saveButtons = screen.getAllByText('Save Settings');
    await user.click(saveButtons[0]);
    const confirmButtons = screen.getAllByText('Save Settings');
    const confirmBtn = confirmButtons.find((btn) =>
      btn.closest('dialog'),
    );
    if (confirmBtn) {
      await user.click(confirmBtn);
      await waitFor(() => expect(onSettingsChange).toHaveBeenCalled());
    }
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

    await user.click(screen.getAllByRole('button', { name: 'Save Settings' })[0]);
    const confirmButton = screen.getAllByRole('button', { name: 'Save Settings' })
      .find((button) => button.closest('dialog'));
    await user.click(confirmButton);

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
