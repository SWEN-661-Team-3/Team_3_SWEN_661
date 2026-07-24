import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CareConnectDialog from '../components/CareConnectDialog';

describe('CareConnectDialog', () => {
  it('renders title and message when open', () => {
    render(
      <CareConnectDialog
        open={true}
        title="Test Title"
        message="Test message body"
        onConfirm={jest.fn()}
      />,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message body')).toBeInTheDocument();
  });

  it('renders confirm button with custom label', () => {
    render(
      <CareConnectDialog
        open={true}
        title="Title"
        message="Message"
        confirmLabel="Yes, proceed"
        onConfirm={jest.fn()}
      />,
    );
    expect(screen.getByText('Yes, proceed')).toBeInTheDocument();
  });

  it('renders default OK label when no confirmLabel given', () => {
    render(
      <CareConnectDialog open={true} title="Title" message="Message" onConfirm={jest.fn()} />,
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    render(
      <CareConnectDialog open={true} title="Title" message="Message" onConfirm={onConfirm} />,
    );
    await user.click(screen.getByText('OK'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('renders cancel button when cancelLabel is provided', () => {
    render(
      <CareConnectDialog
        open={true}
        title="Title"
        message="Message"
        cancelLabel="Cancel"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(
      <CareConnectDialog
        open={true}
        title="Title"
        message="Message"
        cancelLabel="Cancel"
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('does not render cancel button when cancelLabel is absent', () => {
    render(
      <CareConnectDialog open={true} title="Title" message="Message" onConfirm={jest.fn()} />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
  });

  it('applies destructive variant class', () => {
    const { container } = render(
      <CareConnectDialog
        open={true}
        title="Delete?"
        message="Are you sure?"
        variant="destructive"
        onConfirm={jest.fn()}
      />,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog.className).toContain('destructive');
  });

  it('uses danger-btn class for destructive variant confirm button', () => {
    render(
      <CareConnectDialog
        open={true}
        title="Delete?"
        message="Sure?"
        variant="destructive"
        confirmLabel="Delete"
        onConfirm={jest.fn()}
      />,
    );
    const confirmBtn = screen.getByText('Delete');
    expect(confirmBtn.className).toContain('danger-btn');
  });

  it('uses primary-btn class for non-destructive confirm button', () => {
    render(
      <CareConnectDialog open={true} title="Done" message="All good" onConfirm={jest.fn()} />,
    );
    const confirmBtn = screen.getByText('OK');
    expect(confirmBtn.className).toContain('primary-btn');
  });
});
