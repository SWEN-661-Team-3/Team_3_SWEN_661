import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsDialog from '../components/SettingsDialog';

describe('SettingsDialog', () => {
  const defaultSettings = {
    largeText: false,
    highContrast: false,
    reduceMotion: true,
  };
  const onSave = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
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
        settings={{ largeText: true, highContrast: true, reduceMotion: false }}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(true);
    expect(checkboxes[2].checked).toBe(false);
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

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SettingsDialog open={true} settings={defaultSettings} onSave={onSave} onClose={onClose} />,
    );
    await user.click(screen.getByLabelText(/close settings/i));
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
