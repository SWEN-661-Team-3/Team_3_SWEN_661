import { render, screen } from '@testing-library/react';
import HelpDialog from '../components/HelpDialog';

describe('HelpDialog', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders the help dialog title', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
  });

  it('lists keyboard shortcuts', () => {
    render(<HelpDialog open={true} onClose={onClose} />);
    expect(screen.getByText(/creates a new reminder/)).toBeInTheDocument();
    expect(screen.getByText(/saves the plan/)).toBeInTheDocument();
    expect(screen.getByText(/searches tasks/)).toBeInTheDocument();
    expect(screen.getByText(/opens today's plan/)).toBeInTheDocument();
    expect(screen.getByText(/opens the Care Team page/)).toBeInTheDocument();
    expect(screen.getByText(/opens settings/)).toBeInTheDocument();
    expect(screen.getByText(/closes the dialog/)).toBeInTheDocument();
    expect(screen.getByText(/opens the help dialog/)).toBeInTheDocument();
    expect(screen.getByText(/opens emergency help/)).toBeInTheDocument();
  });

  it('renders shortcut descriptions without list semantics', () => {
    const { container } = render(<HelpDialog open={true} onClose={onClose} />);

    expect(container.querySelector('ul')).not.toBeInTheDocument();
    expect(container.querySelector('ol')).not.toBeInTheDocument();
    expect(container.querySelector('li')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-label="F1, opens help dialog"]')).toBeInTheDocument();
    expect(container.querySelector('[aria-label="F2, opens emergency help"]')).toBeInTheDocument();
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
