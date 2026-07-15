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

    const sarahCard = screen.getByRole('button', { name: /^Sarah Johnson, Helper, available/ });
    expect(within(sarahCard).getByText('Helper')).toBeInTheDocument();
    expect(within(sarahCard).getByText('available')).toBeInTheDocument();
    expect(within(sarahCard).getByText('(555) 234-5678')).toBeInTheDocument();
    expect(within(sarahCard).getByText(/Available weekdays/)).toBeInTheDocument();
    expect(within(sarahCard).queryByRole('button', { name: 'Edit Sarah Johnson' })).not.toBeInTheDocument();
    expect(within(sarahCard).queryByRole('button', { name: 'Remove Sarah Johnson' })).not.toBeInTheDocument();

    const doctorCard = screen.getByRole('button', { name: /^Dr\. Emily Smith, Eye Doctor, away/ });
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
    expect(screen.getByRole('button', { name: /^Pat Lee, Nurse, available/ })).toBeInTheDocument();
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

  it('shows helper actions only after opening the card', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    const sarahCard = screen.getByRole('button', { name: /^Sarah Johnson, Helper, available/ });
    await user.click(sarahCard);

    const detailDialog = screen.getByRole('dialog', { name: 'Sarah Johnson' });
    expect(within(detailDialog).getByRole('button', { name: 'Edit Sarah Johnson' })).toBeInTheDocument();
    expect(within(detailDialog).getByRole('button', { name: 'Remove Sarah Johnson' })).toBeInTheDocument();
    expect(within(detailDialog).getByRole('link', { name: '(555) 234-5678' })).toHaveAttribute(
      'href',
      'tel:(555) 234-5678',
    );
  });

  it('edits helper details and shows a confirmation dialog', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    const sarahCard = screen.getByRole('button', { name: /^Sarah Johnson, Helper, available/ });
    await user.click(sarahCard);
    const detailDialog = screen.getByRole('dialog', { name: 'Sarah Johnson' });
    await user.click(within(detailDialog).getByRole('button', { name: 'Edit Sarah Johnson' }));

    expect(screen.getByRole('dialog', { name: 'Edit Helper' })).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Phone'));
    await user.type(screen.getByLabelText('Phone'), '(555) 999-0000');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const confirmation = screen.getByRole('dialog', { name: 'Helper updated' });
    expect(within(confirmation).getByText('Sarah Johnson was updated.')).toBeInTheDocument();
    expect(screen.getAllByText('(555) 999-0000').length).toBeGreaterThanOrEqual(1);
  });

  it('asks before closing Edit Helper after field changes', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    const sarahCard = screen.getByRole('button', { name: /^Sarah Johnson, Helper, available/ });
    await user.click(sarahCard);
    const detailDialog = screen.getByRole('dialog', { name: 'Sarah Johnson' });
    await user.click(within(detailDialog).getByRole('button', { name: 'Edit Sarah Johnson' }));
    const editDialog = screen.getByRole('dialog', { name: 'Edit Helper' });
    await user.type(within(editDialog).getByLabelText('Notes'), ' Call before arriving');
    await user.click(within(editDialog).getByRole('button', { name: /^Close$/ }));

    expect(screen.getByRole('dialog', { name: 'Are you sure?' })).toBeInTheDocument();
  });

  it('asks before removing a helper and removes after confirmation', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    const robertCard = screen.getByRole('button', { name: /^Robert Chen, Family, offline/ });
    await user.click(robertCard);
    const detailDialog = screen.getByRole('dialog', { name: 'Robert Chen' });
    await user.click(within(detailDialog).getByRole('button', { name: 'Remove Robert Chen' }));

    const removeDialog = screen.getByRole('dialog', { name: 'Remove helper?' });
    expect(within(removeDialog).getByText('Remove Robert Chen from your care team?')).toBeInTheDocument();

    await user.click(within(removeDialog).getByRole('button', { name: 'Remove helper' }));
    expect(screen.queryByRole('button', { name: /^Robert Chen, Family/ })).not.toBeInTheDocument();
    expect(screen.getByText('2 helpers on your care team')).toBeInTheDocument();
  });

  it('opens helper detail via keyboard Enter and Space', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    const sarahCard = screen.getByRole('button', { name: /^Sarah Johnson, Helper, available/ });
    sarahCard.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('dialog', { name: 'Sarah Johnson' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Close$/ }));

    const doctorCard = screen.getByRole('button', { name: /^Dr\. Emily Smith, Eye Doctor, away/ });
    doctorCard.focus();
    await user.keyboard(' ');

    expect(screen.getByRole('dialog', { name: 'Dr. Emily Smith' })).toBeInTheDocument();
  });

  it('discards unsaved helper form after confirmation', async () => {
    const user = userEvent.setup();
    render(<CareTeamHarness />);

    await user.click(screen.getByRole('button', { name: 'Add Helper' }));
    await user.type(screen.getByLabelText('Name'), 'Test');
    await user.click(screen.getByRole('button', { name: /^Close$/ }));

    const discard = screen.getByRole('dialog', { name: 'Are you sure?' });
    await user.click(within(discard).getByRole('button', { name: 'Close without saving' }));
    expect(screen.queryByRole('dialog', { name: 'Add Helper' })).not.toBeInTheDocument();
  });
});
