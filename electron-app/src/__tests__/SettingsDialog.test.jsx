import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsDialog from '../components/SettingsDialog';

describe('SettingsDialog', () => {
  const defaultSettings = {
    largeText: false,
    highContrast: false,
    darkTheme: false,
    reduceMotion: true,
  };
  const onChange = jest.fn();
  const onSave = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
    onSave.mockClear();
    onClose.mockClear();
  });

  it('renders the dialog title', () => {
    render(
      <SettingsDialog open={true} settings={defaultSettings} onSave={onSave} onClose={onClose} />,
    );
    expect(screen.getByText('Accessibility settings')).toBeInTheDocument();
  });

  it('provides mouse and keyboard instructions for changing and saving settings', () => {
    render(
      <SettingsDialog open={true} settings={defaultSettings} onSave={onSave} onClose={onClose} />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Accessibility settings' });
    const instructions = screen.getByText(/Click an option, or focus it and press Space or Enter/i);

    expect(instructions).toHaveTextContent(
      'Click an option, or focus it and press Space or Enter, to toggle the setting. Click Save settings to apply and retain your changes.',
    );
    expect(dialog).toHaveAttribute('aria-describedby', instructions.id);
  });

  it('renders display settings checkboxes', () => {
    render(
      <SettingsDialog open={true} settings={defaultSettings} onSave={onSave} onClose={onClose} />,
    );
    expect(screen.getByText('Larger text (125%)')).toBeInTheDocument();
    expect(screen.getByText('High contrast mode')).toBeInTheDocument();
    expect(screen.getByText('Dark Theme')).toBeInTheDocument();
    expect(screen.getByText('Reduce motion')).toBeInTheDocument();
  });

  it('renders reading settings', () => {
    render(
      <SettingsDialog open={true} settings={defaultSettings} onSave={onSave} onClose={onClose} />,
    );
    expect(screen.getByText('Atkinson Hyperlegible font (always on)')).toBeInTheDocument();
  });

  it('reflects current settings values', () => {
    render(
      <SettingsDialog
        open={true}
        settings={{
          largeText: true,
          highContrast: true,
          darkTheme: true,
          reduceMotion: false,
        }}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    expect(screen.getByLabelText('Larger text (125%)')).toBeChecked();
    expect(screen.getByLabelText('High contrast mode')).toBeChecked();
    expect(screen.getByLabelText('Dark Theme')).toBeChecked();
    expect(screen.getByLabelText('Reduce motion')).not.toBeChecked();
  });

  it('calls onSave with updated settings on submit', async () => {
    const user = userEvent.setup();
    render(
      <SettingsDialog open={true} settings={defaultSettings} onSave={onSave} onClose={onClose} />,
    );
    const largeTextCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(largeTextCheckbox);
    await user.click(screen.getByText('Save settings'));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ largeText: true }),
    );
  });

  it('calls onChange as soon as a setting is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SettingsDialog
        open={true}
        settings={defaultSettings}
        onChange={onChange}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    await user.click(screen.getByLabelText('Dark Theme'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ darkTheme: true }),
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it('allows keyboard-only navigation and toggling for every display setting', async () => {
    const user = userEvent.setup();
    render(
      <SettingsDialog
        open={true}
        settings={defaultSettings}
        onChange={onChange}
        onSave={onSave}
        onClose={onClose}
      />,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: /^Close$/ })).toHaveFocus();

    const options = [
      screen.getByLabelText('Larger text (125%)'),
      screen.getByLabelText('High contrast mode'),
      screen.getByLabelText('Dark Theme'),
      screen.getByLabelText('Reduce motion'),
    ];

    for (const option of options) {
      await user.tab();
      expect(option).toHaveFocus();
      await user.keyboard(' ');
    }

    expect(options[0]).toBeChecked();
    expect(options[1]).toBeChecked();
    expect(options[2]).toBeChecked();
    expect(options[3]).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it('also toggles a focused display setting with Enter', async () => {
    const user = userEvent.setup();
    render(
      <SettingsDialog
        open={true}
        settings={defaultSettings}
        onChange={onChange}
        onSave={onSave}
        onClose={onClose}
      />,
    );

    const darkTheme = screen.getByLabelText('Dark Theme');
    darkTheme.focus();
    await user.keyboard('{Enter}');

    expect(darkTheme).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ darkTheme: true }),
    );
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SettingsDialog open={true} settings={defaultSettings} onSave={onSave} onClose={onClose} />,
    );
    const closeButton = screen.getByRole('button', { name: /^Close$/ });
    expect(closeButton).toHaveTextContent('X');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has Display and Reading fieldsets', () => {
    render(
      <SettingsDialog open={true} settings={defaultSettings} onSave={onSave} onClose={onClose} />,
    );
    expect(screen.getByText('Display')).toBeInTheDocument();
    expect(screen.getByText('Reading')).toBeInTheDocument();
  });
});
