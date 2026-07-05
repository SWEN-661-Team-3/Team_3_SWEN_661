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
    expect(screen.getByText(/New reminder/)).toBeInTheDocument();
    expect(screen.getByText(/Save plan/)).toBeInTheDocument();
    expect(screen.getByText(/Search tasks/)).toBeInTheDocument();
    expect(screen.getByText(/Today's plan/)).toBeInTheDocument();
    expect(screen.getByText(/Care Team/)).toBeInTheDocument();
    expect(screen.getByText(/Open settings/)).toBeInTheDocument();
    expect(screen.getByText(/Close dialog/)).toBeInTheDocument();
    expect(screen.getByText(/This help panel/)).toBeInTheDocument();
    expect(screen.getByText(/Emergency help/)).toBeInTheDocument();
  });

  it('shows usage instructions', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    expect(
      screen.getByText(/Use the menu bar or toolbar for common actions/),
    ).toBeInTheDocument();
  });

  it('does not render a secondary dismissal button', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    expect(screen.queryByText('Got it')).not.toBeInTheDocument();
  });

  it('has a close button with accessible label', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    const closeButtons = screen.getAllByRole('button', { name: /^Close$/ });
    expect(closeButtons).toHaveLength(1);
    const [closeButton] = closeButtons;
    expect(closeButton).toHaveTextContent('X');
  });

  it('renders kbd elements for keyboard shortcuts', () => {
    const { container } = render(<HelpDialog open={true} onClose={onClose} />);
    const kbdElements = container.querySelectorAll('kbd');
    expect(kbdElements.length).toBeGreaterThan(0);
  });
});
