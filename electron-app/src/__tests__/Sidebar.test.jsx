import { render, screen } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { initialPlan } from '../data';

describe('Sidebar', () => {
  const defaultProps = {
    helperName: 'Sarah',
    tasks: initialPlan,
    selectedId: null,
    filter: '',
    onSelectTask: jest.fn(),
  };

  it('renders the helper card with the given name', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Sarah is available')).toBeInTheDocument();
    const roles = screen.getAllByText('Helper');
    expect(roles.length).toBe(2);
  });

  it('renders the sidebar heading for helper section', () => {
    render(<Sidebar {...defaultProps} />);
    const headings = screen.getAllByRole('heading');
    const helperHeading = headings.find((h) => h.textContent === 'Helper');
    expect(helperHeading).toBeTruthy();
  });

  it('renders the sidebar heading for tasks section', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Today's tasks")).toBeInTheDocument();
  });

  it('renders the task list', () => {
    render(<Sidebar {...defaultProps} />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(initialPlan.length);
  });

  it('has plan summary aria label', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByRole('complementary', { name: /plan summary/i })).toBeInTheDocument();
  });

  it('renders with a different helper name', () => {
    render(<Sidebar {...defaultProps} helperName="Dr. Miller" />);
    expect(screen.getByText("Dr. Miller is available")).toBeInTheDocument();
  });
});
