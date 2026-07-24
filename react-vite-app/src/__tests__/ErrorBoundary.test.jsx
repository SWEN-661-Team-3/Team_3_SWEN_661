import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../components/ErrorBoundary';

function ThrowingChild({ shouldThrow }) {
  if (shouldThrow) throw new Error('Test explosion');
  return <p>Working child</p>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Working child')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText(/unexpected error occurred/)).toBeInTheDocument();
  });

  it('provides a Try Again button that resets the boundary', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(screen.getByText('Working child')).toBeInTheDocument();
  });

  it('provides a Return Home link', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    const link = screen.getByRole('link', { name: 'Return Home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('uses role="alert" for the fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
