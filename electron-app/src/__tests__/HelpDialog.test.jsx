import { render, screen } from '@testing-library/react';
import HelpDialog from '../components/HelpDialog';

describe('HelpDialog', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders the help dialog title', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    expect(screen.getByText('CareConnect Help')).toBeInTheDocument();
  });

  it('lists keyboard shortcuts', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    expect(screen.getByText(/New appointment/)).toBeInTheDocument();
    expect(screen.getByText(/Save plan/)).toBeInTheDocument();
    expect(screen.getByText(/Search tasks/)).toBeInTheDocument();
    expect(screen.getByText(/Open settings/)).toBeInTheDocument();
    expect(screen.getByText(/Close dialog/)).toBeInTheDocument();
    expect(screen.getByText(/This help panel/)).toBeInTheDocument();
  });

  it('shows usage instructions', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    expect(
      screen.getByText(/Use the menu bar or toolbar for common actions/),
    ).toBeInTheDocument();
  });

  it('has a Got it button', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    expect(screen.getByText('Got it')).toBeInTheDocument();
  });

  it('has a close button with accessible label', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    expect(screen.getByLabelText(/close help/i)).toBeInTheDocument();
  });

  it('renders kbd elements for keyboard shortcuts', () => {
    const { container } = render(<HelpDialog open={true} onClose={onClose} />);
    const kbdElements = container.querySelectorAll('kbd');
    expect(kbdElements.length).toBeGreaterThan(0);
  });
});
