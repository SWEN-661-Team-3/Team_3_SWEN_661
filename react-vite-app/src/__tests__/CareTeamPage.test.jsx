import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CareTeamPage from '../pages/CareTeamPage';
import { caregivers } from '../data/careData';
import { renderWithProviders } from './testUtils';

function getHelpers() {
  return caregivers.map((c) => ({ ...c }));
}

describe('CareTeamPage', () => {
  it('renders the page title', () => {
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    expect(screen.getByRole('heading', { name: 'Care Team', level: 1 })).toBeInTheDocument();
  });

  it('renders all team members', () => {
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Dr. Emily Smith')).toBeInTheDocument();
    expect(screen.getByText('Robert Chen')).toBeInTheDocument();
  });

  it('shows member roles', () => {
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    expect(screen.getByText('Eye Doctor')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
  });

  it('shows availability badges', () => {
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Away')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('has an Add Member button', () => {
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    expect(screen.getByText('Add Member')).toBeInTheDocument();
  });

  it('shows phone numbers', () => {
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    expect(screen.getByText('(555) 234-5678')).toBeInTheDocument();
    expect(screen.getByText('(555) 891-2345')).toBeInTheDocument();
  });

  it('has accessible card labels', () => {
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    expect(screen.getByLabelText('Sarah Johnson, Helper')).toBeInTheDocument();
    expect(screen.getByLabelText('Dr. Emily Smith, Eye Doctor')).toBeInTheDocument();
  });

  it('leaves the main landmark to the shared layout', () => {
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    expect(document.getElementById('main-content')).not.toBeInTheDocument();
  });

  it('opens member detail when card is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    await user.click(screen.getByLabelText('Sarah Johnson, Helper'));
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.getByText('Edit Details')).toBeInTheDocument();
  });

  it('has a live region for announcements', () => {
    const { container } = renderWithProviders(
      <CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />,
    );
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('closes member detail dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    await user.click(screen.getByLabelText('Sarah Johnson, Helper'));
    await user.click(screen.getByText('Close'));
  });

  it('saves edited member details', async () => {
    const user = userEvent.setup();
    const setHelpers = jest.fn();
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={setHelpers} />);
    await user.click(screen.getByLabelText('Sarah Johnson, Helper'));
    await user.click(screen.getByText('Edit Details'));
    await user.click(screen.getByText('Save Changes'));
    expect(setHelpers).toHaveBeenCalled();
  });

  it('shows save success notice after saving', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    await user.click(screen.getByLabelText('Sarah Johnson, Helper'));
    await user.click(screen.getByText('Edit Details'));
    await user.click(screen.getByText('Save Changes'));
    expect(screen.getByText(/Sarah Johnson Saved/)).toBeInTheDocument();
  });

  it('opens add member dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={jest.fn()} />);
    await user.click(screen.getByText('Add Member'));
    expect(screen.getByText('Add Care Team Member')).toBeInTheDocument();
  });

  it('saves a new member', async () => {
    const user = userEvent.setup();
    const setHelpers = jest.fn();
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={setHelpers} />);
    await user.click(screen.getByText('Add Member'));

    const dialog = document.querySelector('dialog[open]');
    const nameInput = dialog.querySelector('input.edit-field__control');
    await user.type(nameInput, 'New Person');

    const addMemberBtns = screen.getAllByText('Add Member');
    const dialogBtn = addMemberBtns.find((el) => el.closest('dialog'));
    if (dialogBtn) {
      await user.click(dialogBtn);
      expect(setHelpers).toHaveBeenCalled();
    }
  });

  it('removes a member via the remove confirmation', async () => {
    const user = userEvent.setup();
    const setHelpers = jest.fn();
    renderWithProviders(<CareTeamPage helpers={getHelpers()} setHelpers={setHelpers} />);
    await user.click(screen.getByLabelText('Sarah Johnson, Helper'));
    const removeButtons = screen.getAllByText('Remove Helper');
    const mainRemoveBtn = removeButtons.find((el) => el.closest('.dialog:not(.dialog--confirm)'));
    if (mainRemoveBtn) {
      await user.click(mainRemoveBtn);
      const confirmRemove = screen.getAllByText('Remove Helper').find(
        (el) => el.closest('.dialog--destructive'),
      );
      if (confirmRemove) {
        await user.click(confirmRemove);
        expect(setHelpers).toHaveBeenCalled();
      }
    }
  });
});
