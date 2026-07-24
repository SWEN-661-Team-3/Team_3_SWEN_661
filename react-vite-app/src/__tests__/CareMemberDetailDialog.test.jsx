import { render, screen } from '@testing-library/react';
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
});
