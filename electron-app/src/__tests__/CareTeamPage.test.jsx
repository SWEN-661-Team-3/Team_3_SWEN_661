import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CareTeamPage from '../components/CareTeamPage';
import { caregivers } from '../data';

function CareTeamHarness({ initialHelpers = caregivers }) {
  const [helpers, setHelpers] = useState(() => structuredClone(initialHelpers));

  return (
    <CareTeamPage
      helpers={helpers}
      onHelpersChange={setHelpers}
      onAnnounce={jest.fn()}
    />
  );
}

describe('CareTeamPage', () => {
  it('renders the page header, helper count, and helper cards', () => {
    render(<CareTeamHarness />);

    expect(screen.getByRole('heading', { name: 'Care Team' })).toBeInTheDocument();
    expect(screen.getByText('3 helpers on your care team')).toBeInTheDocument();

    const sarahCard = screen.getByRole('article', { name: 'Sarah Johnson' });
    expect(within(sarahCard).getByText('Helper')).toBeInTheDocument();
    expect(within(sarahCard).getByText('available')).toBeInTheDocument();
    expect(within(sarahCard).getByText('(555) 234-5678')).toBeInTheDocument();
    expect(within(sarahCard).getByText(/Available weekdays/)).toBeInTheDocument();
    expect(within(sarahCard).getByRole('button', { name: 'Edit Sarah Johnson' })).toBeInTheDocument();
    expect(within(sarahCard).getByRole('button', { name: 'Remove Sarah Johnson' })).toBeInTheDocument();

    const doctorCard = screen.getByRole('article', { name: 'Dr. Emily Smith' });
    expect(within(doctorCard).getByText('away')).toBeInTheDocument();
  });

  it('opens Add Helper with example placeholders and disables Add helper until name and phone are filled', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    await user.click(screen.getByRole('button', { name: 'Add Helper' }));

    expect(screen.getByRole('dialog', { name: 'Add Helper' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('placeholder', 'Full name');
    expect(screen.getByLabelText('Role')).toHaveAttribute('placeholder', 'e.g. Family, nurse, doctor');
    expect(screen.getByLabelText('Phone')).toHaveAttribute('placeholder', '(555)000-0000');
    expect(screen.getByLabelText('Notes')).toHaveAttribute('placeholder', 'e.g. Hours, location, or any other details');
    expect(screen.queryByText('Full name')).not.toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: 'Add helper' });
    expect(addButton).toBeDisabled();

    await user.type(screen.getByLabelText('Name'), 'Pat Lee');
    expect(addButton).toBeDisabled();

    await user.type(screen.getByLabelText('Phone'), '(555) 111-2222');
    expect(addButton).toBeEnabled();
  });

  it('adds a helper and shows a confirmation dialog', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    await user.click(screen.getByRole('button', { name: 'Add Helper' }));
    await user.type(screen.getByLabelText('Name'), 'Pat Lee');
    await user.type(screen.getByLabelText('Role'), 'Nurse');
    await user.type(screen.getByLabelText('Phone'), '(555) 111-2222');
    await user.type(screen.getByLabelText('Notes'), 'Weekends only');
    await user.click(screen.getByRole('button', { name: 'Add helper' }));

    const confirmation = screen.getByRole('dialog', { name: 'Helper saved' });
    expect(within(confirmation).getByText('Pat Lee was added to your care team.')).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Pat Lee' })).toBeInTheDocument();
  });

  it('closes a blank Add Helper dialog without confirmation', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    await user.click(screen.getByRole('button', { name: 'Add Helper' }));
    await user.click(screen.getByRole('button', { name: /^Close$/ }));

    expect(screen.queryByRole('dialog', { name: 'Add Helper' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Are you sure?' })).not.toBeInTheDocument();
  });

  it('asks before closing Add Helper when any field has text', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    await user.click(screen.getByRole('button', { name: 'Add Helper' }));
    await user.type(screen.getByLabelText('Role'), 'Family');
    await user.click(screen.getByRole('button', { name: /^Close$/ }));

    expect(screen.getByRole('dialog', { name: 'Are you sure?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue editing' }));
    expect(screen.getByRole('dialog', { name: 'Add Helper' })).toBeInTheDocument();
  });

  it('edits helper details and shows a confirmation dialog', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    const sarahCard = screen.getByRole('article', { name: 'Sarah Johnson' });
    await user.click(within(sarahCard).getByRole('button', { name: 'Edit Sarah Johnson' }));

    expect(screen.getByRole('dialog', { name: 'Edit Helper' })).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Phone'));
    await user.type(screen.getByLabelText('Phone'), '(555) 999-0000');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const confirmation = screen.getByRole('dialog', { name: 'Helper updated' });
    expect(within(confirmation).getByText("Sarah Johnson's details were updated.")).toBeInTheDocument();
    expect(screen.getByText('(555) 999-0000')).toBeInTheDocument();
  });

  it('asks before closing Edit Helper after field changes', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    const sarahCard = screen.getByRole('article', { name: 'Sarah Johnson' });
    await user.click(within(sarahCard).getByRole('button', { name: 'Edit Sarah Johnson' }));
    await user.type(screen.getByLabelText('Notes'), ' Call before arriving');
    await user.click(screen.getByRole('button', { name: /^Close$/ }));

    expect(screen.getByRole('dialog', { name: 'Are you sure?' })).toBeInTheDocument();
  });

  it('asks before removing a helper and removes after confirmation', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    const robertCard = screen.getByRole('article', { name: 'Robert Chen' });
    await user.click(within(robertCard).getByRole('button', { name: 'Remove Robert Chen' }));

    const removeDialog = screen.getByRole('dialog', { name: 'Are you sure?' });
    expect(within(removeDialog).getByText('Remove Robert Chen from your care team?')).toBeInTheDocument();

    await user.click(within(removeDialog).getByRole('button', { name: 'Remove helper' }));
    expect(screen.queryByRole('article', { name: 'Robert Chen' })).not.toBeInTheDocument();
    expect(screen.getByText('2 helpers on your care team')).toBeInTheDocument();
  });
});
