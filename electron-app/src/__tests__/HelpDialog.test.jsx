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
    expect(screen.getAllByText(/creates a new reminder/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/saves the plan/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/searches tasks/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/opens today's plan/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/opens the Care Team page/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/opens settings/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/closes the dialog/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/opens the help dialog/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/opens emergency help/).length).toBeGreaterThan(0);
  });

  it('renders shortcut descriptions without list semantics', () => {
    const { container } = render(<HelpDialog open={true} onClose={onClose} />);

    expect(container.querySelector('ul')).not.toBeInTheDocument();
    expect(container.querySelector('ol')).not.toBeInTheDocument();
    expect(container.querySelector('li')).not.toBeInTheDocument();
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(screen.getByText('Control plus comma, opens settings.')).toHaveClass('visually-hidden');
    expect(screen.getByText('F1, opens help dialog.')).toHaveClass('visually-hidden');
    expect(screen.getByText('F2, opens emergency help.')).toHaveClass('visually-hidden');
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
