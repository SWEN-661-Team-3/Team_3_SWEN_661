import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MobileNavigation from '../components/MobileNavigation';

const mockMatchMedia = {
  matches: true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);
  mockMatchMedia.addEventListener.mockClear();
  mockMatchMedia.removeEventListener.mockClear();
});

const items = [
  { label: 'Today', to: '/today', end: true },
  { label: 'Care Team', to: '/care-team' },
  { label: 'Settings', to: '/settings' },
  { label: 'Emergency', to: '/emergency', danger: true },
];

function renderNav() {
  return render(
    <MemoryRouter>
      <MobileNavigation items={items} />
    </MemoryRouter>
  );
}

describe('MobileNavigation', () => {
  it('renders the menu toggle button', () => {
    renderNav();
    expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
  });

  it('menu is closed by default', () => {
    renderNav();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('opens menu on toggle click', () => {
    renderNav();
    fireEvent.click(screen.getByLabelText('Open navigation menu'));
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders navigation links when open', () => {
    renderNav();
    fireEvent.click(screen.getByLabelText('Open navigation menu'));
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Care Team')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Emergency')).toBeInTheDocument();
  });

  it('closes menu on link click', () => {
    renderNav();
    fireEvent.click(screen.getByLabelText('Open navigation menu'));
    fireEvent.click(screen.getByText('Today'));
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('closes menu on Escape key', () => {
    renderNav();
    fireEvent.click(screen.getByLabelText('Open navigation menu'));
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('closes menu on outside click', () => {
    renderNav();
    fireEvent.click(screen.getByLabelText('Open navigation menu'));
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    fireEvent.pointerDown(document);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('closes menu when media query changes to desktop', () => {
    renderNav();
    fireEvent.click(screen.getByLabelText('Open navigation menu'));
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    const changeHandler = mockMatchMedia.addEventListener.mock.calls.find(
      (call) => call[0] === 'change'
    )[1];

    act(() => { changeHandler({ matches: false }); });
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('toggle button label updates when open', () => {
    renderNav();
    fireEvent.click(screen.getByLabelText('Open navigation menu'));
    expect(screen.getByLabelText('Close navigation menu')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = renderNav();
    unmount();
    expect(mockMatchMedia.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
