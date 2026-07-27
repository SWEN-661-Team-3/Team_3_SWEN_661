import { render, screen } from '@testing-library/react';
import AppFooter from '../components/AppFooter';

describe('AppFooter', () => {
  it('renders the footer tagline', () => {
    render(<AppFooter />);
    expect(screen.getByText(/Helping you manage daily care/)).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<AppFooter />);
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('uses semantic footer element', () => {
    const { container } = render(<AppFooter />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
