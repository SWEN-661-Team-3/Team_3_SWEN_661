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
