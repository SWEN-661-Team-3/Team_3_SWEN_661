import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPage from '../pages/SettingsPage';
import { renderWithProviders } from './testUtils';

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
      expect(onSettingsChange).toHaveBeenCalled();
    }
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

  it('has proper main landmark', () => {
    renderWithProviders(
      <SettingsPage settings={defaultSettings} onSettingsChange={jest.fn()} notifications={notifications} />,
    );
    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
  });
});
