import { render, screen, act } from '@testing-library/react';
import OfflineStatusBanner from '../components/OfflineStatusBanner';

describe('OfflineStatusBanner', () => {
  let originalOnLine;

  beforeEach(() => {
    originalOnLine = navigator.onLine;
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      value: originalOnLine,
      writable: true,
      configurable: true,
    });
  });

  it('renders nothing when online', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    const { container } = render(<OfflineStatusBanner />);
    expect(container.innerHTML).toBe('');
  });

  it('renders banner when offline', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    render(<OfflineStatusBanner />);
    expect(screen.getByText(/You are offline/)).toBeInTheDocument();
  });

  it('has role="status" and aria-live', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    render(<OfflineStatusBanner />);
    const banner = screen.getByRole('status');
    expect(banner).toHaveAttribute('aria-live', 'polite');
  });

  it('shows banner on offline event', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    render(<OfflineStatusBanner />);
    expect(screen.queryByText(/You are offline/)).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(screen.getByText(/You are offline/)).toBeInTheDocument();
  });

  it('hides banner on online event', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    render(<OfflineStatusBanner />);
    expect(screen.getByText(/You are offline/)).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(screen.queryByText(/You are offline/)).not.toBeInTheDocument();
  });
});
