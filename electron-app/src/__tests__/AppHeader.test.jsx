import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppHeader from '../components/AppHeader';

describe('AppHeader', () => {
  const onAction = jest.fn();

  beforeEach(() => {
    onAction.mockClear();
  });

  it('renders the CareConnect brand', () => {
    render(<AppHeader onAction={onAction} />);
    expect(screen.getByText('CareConnect')).toBeInTheDocument();
  });

  it('renders the logo', () => {
    render(<AppHeader onAction={onAction} />);
    expect(screen.getByText('CC')).toBeInTheDocument();
  });

  it('renders all toolbar buttons', () => {
    render(<AppHeader onAction={onAction} />);
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Save Plan')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText("Today's Plan")).toBeInTheDocument();
    expect(screen.getByText('Care Team')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Emergency')).toBeInTheDocument();
  });

  it('calls onAction with correct action when buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<AppHeader onAction={onAction} />);

    await user.click(screen.getByText('New'));
    expect(onAction).toHaveBeenCalledWith('new-record');

    await user.click(screen.getByText('Save Plan'));
    expect(onAction).toHaveBeenCalledWith('save');

    await user.click(screen.getByText('Search'));
    expect(onAction).toHaveBeenCalledWith('search');

    await user.click(screen.getByText('Care Team'));
    expect(onAction).toHaveBeenCalledWith('view-care-team');
  });

  it('calls onAction with emergency when Emergency button is clicked', async () => {
    const user = userEvent.setup();
    render(<AppHeader onAction={onAction} />);

    await user.click(screen.getByText('Emergency'));
    expect(onAction).toHaveBeenCalledWith('emergency');
  });

  it('has correct toolbar accessibility label', () => {
    render(<AppHeader onAction={onAction} />);
    expect(screen.getByRole('navigation', { name: /toolbar/i })).toBeInTheDocument();
  });

  it('renders header as banner landmark', () => {
    render(<AppHeader onAction={onAction} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('applies active class to Today\'s Plan button', () => {
    render(<AppHeader onAction={onAction} />);
    const btn = screen.getByText("Today's Plan");
    expect(btn.className).toContain('toolbar-btn--active');
  });

  it('applies active class to Care Team button', () => {
    render(<AppHeader activeView="care-team" onAction={onAction} />);
    const btn = screen.getByText('Care Team');
    expect(btn.className).toContain('toolbar-btn--active');
    expect(screen.getByText("Today's Plan").className).not.toContain('toolbar-btn--active');
  });

  it('applies danger class to Emergency button', () => {
    render(<AppHeader onAction={onAction} />);
    const btn = screen.getByText('Emergency');
    expect(btn.className).toContain('toolbar-btn--danger');
  });
});
