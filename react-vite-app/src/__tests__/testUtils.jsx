import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

export function renderWithProviders(ui, { route = '/', ...options } = {}) {
  function Wrapper({ children }) {
    return (
      <HelmetProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="*" element={children} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
