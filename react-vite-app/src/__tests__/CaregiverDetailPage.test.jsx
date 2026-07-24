import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import CaregiverDetailPage from '../pages/CaregiverDetailPage';
import { caregivers } from '../data/careData';
import { renderWithProviders } from './testUtils';

function renderDetail(route, setHelpers = jest.fn()) {
  return renderWithProviders(
    <Routes>
      <Route
        path="/care-team/:caregiverId"
        element={<CaregiverDetailPage helpers={caregivers.map((caregiver) => ({ ...caregiver }))} setHelpers={setHelpers} />}
      />
    </Routes>,
    { route },
  );
}

describe('CaregiverDetailPage', () => {
  it('renders the caregiver identified by the route', () => {
    renderDetail('/care-team/sarah');
    expect(screen.getByRole('heading', { name: 'Sarah Johnson', level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText('(555) 234-5678').length).toBeGreaterThanOrEqual(1);
  });

  it('provides a back link to the care team', () => {
    renderDetail('/care-team/sarah');
    expect(screen.getByRole('link', { name: 'Back to Care Team' })).toHaveAttribute('href', '/care-team');
  });

  it('renders an accessible not-found state for an unknown caregiver', () => {
    renderDetail('/care-team/missing');
    expect(screen.getByRole('heading', { name: 'Caregiver Not Found', level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/could not find a care team member/i)).toBeInTheDocument();
  });

  it('uses the existing dialog to edit the routed caregiver', async () => {
    const user = userEvent.setup();
    const setHelpers = jest.fn();
    renderDetail('/care-team/sarah', setHelpers);
    await user.click(screen.getByRole('button', { name: 'Edit Details' }));
    await user.click(screen.getAllByRole('button', { name: 'Edit Details' })[1]);
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() => expect(setHelpers).toHaveBeenCalled());
  });
});
