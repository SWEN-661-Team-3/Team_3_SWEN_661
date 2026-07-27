import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CareMemberDetailDialog from '../components/CareMemberDetailDialog';

const mockMember = {
  id: 'sarah',
  name: 'Sarah Johnson',
  relationship: 'Helper',
  role: 'Helper',
  availability: 'available',
  phone: '(555) 234-5678',
  notes: 'Available weekdays 8 am - 6 pm.',
  initials: 'SJ',
  colorIndex: 0,
};

describe('CareMemberDetailDialog', () => {
  it('renders nothing when member is null', () => {
    const { container } = render(
      <CareMemberDetailDialog member={null} open={false} onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(container.querySelector('dialog')).not.toBeInTheDocument();
  });

  it('renders member details in view mode', () => {
    render(
      <CareMemberDetailDialog member={mockMember} open={true} onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getAllByText('Helper').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('(555) 234-5678')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('shows notes when present', () => {
    render(
      <CareMemberDetailDialog member={mockMember} open={true} onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(screen.getByText('Available weekdays 8 am - 6 pm.')).toBeInTheDocument();
  });

  it('hides notes when empty', () => {
    const noNotes = { ...mockMember, notes: '' };
    render(
      <CareMemberDetailDialog member={noNotes} open={true} onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );
    const noteLabels = screen.queryAllByText('Notes');
    expect(noteLabels).toHaveLength(0);
  });

  it('switches to edit mode on Edit Details click', async () => {
    const user = userEvent.setup();
    render(
      <CareMemberDetailDialog member={mockMember} open={true} onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );
    await user.click(screen.getByText('Edit Details'));
    expect(screen.getByDisplayValue('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('shows Remove Helper button in view mode', () => {
    render(
      <CareMemberDetailDialog member={mockMember} open={true} onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );
    const removeButtons = screen.getAllByText('Remove Helper');
    expect(removeButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders in add mode with correct title', () => {
    const newMember = {
      id: 'new-1',
      name: '',
      relationship: 'Helper',
      role: '',
      availability: 'available',
      phone: '',
      notes: '',
      initials: '',
      colorIndex: 3,
    };
    render(
      <CareMemberDetailDialog member={newMember} open={true} mode="add" onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(screen.getByText('Add Care Team Member')).toBeInTheDocument();
    expect(screen.getByText('Add Member')).toBeInTheDocument();
  });

  it('shows proactive caregiver guidance before submission', () => {
    render(
      <CareMemberDetailDialog member={mockMember} open mode="add" onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );

    const phone = screen.getByRole('textbox', { name: /Phone/ });
    const email = screen.getByRole('textbox', { name: /Email/ });
    expect(screen.getByText('Enter at least 7 digits.')).toBeInTheDocument();
    expect(screen.getByText('Optional. Example: name@example.com.')).toBeInTheDocument();
    expect(phone).toHaveAttribute('aria-describedby', 'caregiver-phone-help');
    expect(email).toHaveAttribute('aria-describedby', 'caregiver-email-help');
  });

  it('does not show Remove Helper button in the main dialog in add mode', () => {
    const newMember = {
      id: 'new-1',
      name: '',
      relationship: 'Helper',
      role: '',
      availability: 'available',
      phone: '',
      notes: '',
      initials: '',
      colorIndex: 3,
    };
    render(
      <CareMemberDetailDialog member={newMember} open={true} mode="add" onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );
    const mainDialog = screen.getByLabelText('Add Care Team Member').closest('dialog');
    const dangerButtons = mainDialog.querySelectorAll('.danger-btn');
    expect(dangerButtons).toHaveLength(0);
  });

  it('has close button with accessible label', () => {
    render(
      <CareMemberDetailDialog member={mockMember} open={true} onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('calls onSave with updated data in edit mode', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn(() => true);
    render(
      <CareMemberDetailDialog member={mockMember} open={true} onClose={jest.fn()} onSave={onSave} onRemove={jest.fn()} />,
    );
    await user.click(screen.getByText('Edit Details'));
    await user.click(screen.getByText('Save Changes'));
    expect(onSave).toHaveBeenCalled();
  });

  it('shows field-specific accessible errors for an invalid caregiver', async () => {
    const user = userEvent.setup();
    const invalidMember = {
      ...mockMember,
      name: ' ',
      relationship: ' ',
      phone: '123',
      email: 'not-an-email',
    };
    render(
      <CareMemberDetailDialog member={invalidMember} open mode="add" onClose={jest.fn()} onSave={jest.fn()} onRemove={jest.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Add Member' }));

    const name = screen.getByRole('textbox', { name: /Name/ });
    const email = screen.getByRole('textbox', { name: /Email/ });
    expect(screen.getByRole('alert')).toHaveTextContent('Please correct the highlighted caregiver fields.');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAttribute('aria-describedby', expect.stringContaining('caregiver-email-error'));
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Optional. Example: name@example.com.')).toBeInTheDocument();
  });

  it('shows saving feedback and prevents duplicate caregiver submissions', async () => {
    const user = userEvent.setup();
    let resolveSave;
    const onSave = jest.fn(() => new Promise((resolve) => {
      resolveSave = resolve;
    }));
    render(
      <CareMemberDetailDialog member={mockMember} open onClose={jest.fn()} onSave={onSave} onRemove={jest.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Edit Details' }));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('status')).toHaveTextContent('Saving caregiver...');
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    expect(onSave).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSave(true);
    });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Details' })).toBeInTheDocument());
  });

  it('preserves caregiver content and offers retry after a failed save', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn()
      .mockRejectedValueOnce(new Error('Save failed'))
      .mockResolvedValueOnce(true);
    render(
      <CareMemberDetailDialog member={mockMember} open onClose={jest.fn()} onSave={onSave} onRemove={jest.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Edit Details' }));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not save this caregiver.');
    expect(screen.getByDisplayValue('Sarah Johnson')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Details' })).toBeInTheDocument());
  });
});
