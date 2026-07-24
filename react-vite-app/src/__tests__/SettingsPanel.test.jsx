import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPanel from '../components/SettingsPanel';

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

describe('SettingsPanel', () => {
  it('renders the settings heading', () => {
    render(
      <SettingsPanel settings={defaultSettings} onChange={jest.fn()} onSave={jest.fn()} onReset={jest.fn()} />,
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders all display preference checkboxes', () => {
    render(
      <SettingsPanel settings={defaultSettings} onChange={jest.fn()} onSave={jest.fn()} onReset={jest.fn()} />,
    );
    expect(screen.getByText('Large Text')).toBeInTheDocument();
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
    expect(screen.getByText('Dark Theme')).toBeInTheDocument();
    expect(screen.getByText('Reduce Motion')).toBeInTheDocument();
  });

  it('reflects current settings state in checkboxes', () => {
    render(
      <SettingsPanel settings={defaultSettings} onChange={jest.fn()} onSave={jest.fn()} onReset={jest.fn()} />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked(); // largeText
    expect(checkboxes[1]).not.toBeChecked(); // highContrast
    expect(checkboxes[2]).not.toBeChecked(); // darkTheme
    expect(checkboxes[3]).toBeChecked();     // reduceMotion
  });

  it('calls onChange when a checkbox is toggled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SettingsPanel settings={defaultSettings} onChange={onChange} onSave={jest.fn()} onReset={jest.fn()} />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalledWith({ ...defaultSettings, largeText: true });
  });

  it('calls onSave when Save Settings is clicked', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(
      <SettingsPanel settings={defaultSettings} onChange={jest.fn()} onSave={onSave} onReset={jest.fn()} />,
    );
    await user.click(screen.getByText('Save Settings'));
    expect(onSave).toHaveBeenCalledWith(defaultSettings);
  });

  it('calls onReset when Reset Defaults is clicked', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    render(
      <SettingsPanel settings={defaultSettings} onChange={jest.fn()} onSave={jest.fn()} onReset={onReset} />,
    );
    await user.click(screen.getByText('Reset Defaults'));
    expect(onReset).toHaveBeenCalled();
  });

  it('renders notifications section when notifications prop is provided', () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={jest.fn()}
        onSave={jest.fn()}
        onReset={jest.fn()}
        notifications={notifications}
      />,
    );
    expect(screen.getByText('Task Reminders')).toBeInTheDocument();
  });

  it('shows blocked message when notifications are denied', () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={jest.fn()}
        onSave={jest.fn()}
        onReset={jest.fn()}
        notifications={{ ...notifications, permission: 'denied' }}
      />,
    );
    expect(screen.getByText(/blocked/i)).toBeInTheDocument();
  });

  it('shows unsupported message when notifications are not supported', () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={jest.fn()}
        onSave={jest.fn()}
        onReset={jest.fn()}
        notifications={{ ...notifications, supported: false }}
      />,
    );
    expect(screen.getByText(/not supported/i)).toBeInTheDocument();
  });

  it('does not render notifications section when prop is absent', () => {
    render(
      <SettingsPanel settings={defaultSettings} onChange={jest.fn()} onSave={jest.fn()} onReset={jest.fn()} />,
    );
    expect(screen.queryByText('Task Reminders')).not.toBeInTheDocument();
  });

  it('has aria-describedby on setting checkboxes', () => {
    render(
      <SettingsPanel settings={defaultSettings} onChange={jest.fn()} onSave={jest.fn()} onReset={jest.fn()} />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((cb) => {
      expect(cb).toHaveAttribute('aria-describedby');
    });
  });

  it('toggles highContrast', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SettingsPanel settings={defaultSettings} onChange={onChange} onSave={jest.fn()} onReset={jest.fn()} />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);
    expect(onChange).toHaveBeenCalledWith({ ...defaultSettings, highContrast: true });
  });

  it('toggles darkTheme', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SettingsPanel settings={defaultSettings} onChange={onChange} onSave={jest.fn()} onReset={jest.fn()} />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[2]);
    expect(onChange).toHaveBeenCalledWith({ ...defaultSettings, darkTheme: true });
  });

  it('toggles reduceMotion off', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SettingsPanel settings={defaultSettings} onChange={onChange} onSave={jest.fn()} onReset={jest.fn()} />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[3]);
    expect(onChange).toHaveBeenCalledWith({ ...defaultSettings, reduceMotion: false });
  });

  it('calls notifications.toggle when notification checkbox is clicked', async () => {
    const user = userEvent.setup();
    const toggle = jest.fn();
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={jest.fn()}
        onSave={jest.fn()}
        onReset={jest.fn()}
        notifications={{ ...notifications, toggle }}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    const notifCheckbox = checkboxes[checkboxes.length - 1];
    await user.click(notifCheckbox);
    expect(toggle).toHaveBeenCalled();
  });

  it('disables notification checkbox when permission denied', () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={jest.fn()}
        onSave={jest.fn()}
        onReset={jest.fn()}
        notifications={{ ...notifications, permission: 'denied' }}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    const notifCheckbox = checkboxes[checkboxes.length - 1];
    expect(notifCheckbox).toBeDisabled();
  });

  it('disables notification checkbox when unsupported', () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={jest.fn()}
        onSave={jest.fn()}
        onReset={jest.fn()}
        notifications={{ ...notifications, supported: false }}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    const notifCheckbox = checkboxes[checkboxes.length - 1];
    expect(notifCheckbox).toBeDisabled();
  });
});
