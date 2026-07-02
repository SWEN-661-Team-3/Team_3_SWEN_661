import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    visible: true,
    value: '',
    onChange: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onChange.mockClear();
    defaultProps.onClose.mockClear();
  });

  it('renders when visible is true', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
  });

  it('does not render when visible is false', () => {
    render(<SearchBar {...defaultProps} visible={false} />);
    expect(screen.queryByRole('search')).not.toBeInTheDocument();
  });

  it('focuses the input when becoming visible', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText(/search tasks/i)).toHaveFocus();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByPlaceholderText(/search tasks/i);
    await user.type(input, 'med');
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    await user.click(screen.getByLabelText(/close search/i));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('displays the current search value', () => {
    render(<SearchBar {...defaultProps} value="eye doctor" />);
    expect(screen.getByPlaceholderText(/search tasks/i).value).toBe('eye doctor');
  });

  it('has a label for the search input', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByLabelText(/search today/i)).toBeInTheDocument();
  });
});
