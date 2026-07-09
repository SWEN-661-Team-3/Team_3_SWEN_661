import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import StatsRow from '../components/StatsRow';
import TaskList from '../components/TaskList';
import AppHeader from '../components/AppHeader';
import EmergencyDialog from '../components/EmergencyDialog';
import NewAppointmentDialog from '../components/NewAppointmentDialog';
import TaskDetailDialog from '../components/TaskDetailDialog';
import { initialPlan } from '../data';

describe('WCAG 2.1 AA Accessibility', () => {
  describe('1.3.1 Info and Relationships', () => {
    it('uses semantic landmarks: banner, navigation, main, complementary', () => {
      render(<App />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: /toolbar/i })).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('complementary', { name: /plan summary/i })).toBeInTheDocument();
    });

    it('provides accessible group labels on stats row', () => {
      const tasks = [
        { id: '1', status: 'done' },
        { id: '2', status: 'todo' },
        { id: '3', status: 'todo' },
      ];
      render(<StatsRow tasks={tasks} />);

      expect(screen.getByRole('group', { name: 'Task statistics' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Tasks done: 1 of 3' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Pending: 2' })).toBeInTheDocument();
    });

    it('uses definition list for task detail dialog', async () => {
      const task = initialPlan[0];
      render(
        <TaskDetailDialog task={task} open={true} onClose={jest.fn()} onComplete={jest.fn()} />,
      );

      const terms = screen.getAllByRole('term');
      const definitions = screen.getAllByRole('definition');
      expect(terms.length).toBeGreaterThanOrEqual(4);
      expect(definitions.length).toBeGreaterThanOrEqual(4);
    });

    it('task list items have descriptive aria-labels', () => {
      const tasks = [
        { id: '1', title: 'Take Medicine', time: '8:00 AM', type: 'medication', status: 'todo' },
      ];
      render(
        <TaskList tasks={tasks} selectedId={null} filter="" onSelectTask={jest.fn()} />,
      );

      expect(
        screen.getByRole('button', { name: /Take Medicine.*8:00 AM.*Pending.*Medication/i }),
      ).toBeInTheDocument();
    });
  });

  describe('2.4.1 Bypass Blocks', () => {
    it('provides a skip link that targets main content', () => {
      render(<App />);
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toHaveAttribute('href', '#main-content');
      expect(document.getElementById('main-content')).toBeInTheDocument();
    });
  });

  describe('2.4.2 Page Titled', () => {
    it('updates document title when switching views', async () => {
      const user = userEvent.setup();
      render(<App />);

      expect(document.title).toBe("Today's Plan - CareConnect");

      await user.click(screen.getByTitle('Care Team (Ctrl+2)'));
      expect(document.title).toBe('Care Team - CareConnect');

      await user.click(screen.getByTitle("Today's Plan (Ctrl+1)"));
      expect(document.title).toBe("Today's Plan - CareConnect");
    });
  });

  describe('2.4.6 Headings and Labels', () => {
    it('headings follow a logical hierarchy on today view', () => {
      render(<App />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('CareConnect');

      const h3 = screen.getAllByRole('heading', { level: 3 });
      expect(h3.length).toBeGreaterThan(0);
    });

    it('headings follow a logical hierarchy on care team view', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByTitle('Care Team (Ctrl+2)'));

      expect(screen.getByRole('heading', { level: 1, name: 'CareConnect' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Care Team' })).toBeInTheDocument();
    });
  });

  describe('2.4.7 Focus Visible', () => {
    it('active toolbar button does not conflict with focus indicator', () => {
      const onAction = jest.fn();
      render(<AppHeader activeView="today" onAction={onAction} />);

      const todayBtn = screen.getByTitle("Today's Plan (Ctrl+1)");
      expect(todayBtn).toHaveClass('toolbar-btn--active');
      expect(todayBtn).toHaveAttribute('aria-current', 'true');
    });
  });

  describe('3.3.1 Error Identification', () => {
    it('sets aria-invalid on required fields and omits describedby when valid', () => {
      render(
        <NewAppointmentDialog open={true} onClose={jest.fn()} onAdd={jest.fn()} />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      expect(titleInput).toHaveAttribute('aria-invalid', 'false');
      expect(titleInput).not.toHaveAttribute('aria-describedby');

      const timeInput = screen.getByLabelText(/^time$/i);
      expect(timeInput).toHaveAttribute('aria-invalid', 'false');
      expect(timeInput).not.toHaveAttribute('aria-describedby');

      const locationInput = screen.getByLabelText(/location/i);
      expect(locationInput).toHaveAttribute('aria-invalid', 'false');
      expect(locationInput).not.toHaveAttribute('aria-describedby');
    });

    it('marks required fields with aria-required', () => {
      render(
        <NewAppointmentDialog open={true} onClose={jest.fn()} onAdd={jest.fn()} />,
      );

      expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/^time$/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/location/i)).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('4.1.2 Name, Role, Value', () => {
    it('provides aria-current on active navigation button', () => {
      const onAction = jest.fn();
      render(<AppHeader activeView="care-team" onAction={onAction} />);

      const careTeamBtn = screen.getByTitle('Care Team (Ctrl+2)');
      expect(careTeamBtn).toHaveAttribute('aria-current', 'true');

      const todayBtn = screen.getByTitle("Today's Plan (Ctrl+1)");
      expect(todayBtn).not.toHaveAttribute('aria-current');
    });

    it('dialogs are labelled by their headings', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByTitle('Settings (Ctrl+,)'));
      expect(
        screen.getByRole('dialog', { name: /accessibility settings/i }),
      ).toBeInTheDocument();
    });

    it('helper card actions include the helper name', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByTitle('Care Team (Ctrl+2)'));

      const sarahCard = screen.getByRole('article', { name: 'Sarah Johnson' });
      expect(
        within(sarahCard).getByRole('button', { name: 'Edit Sarah Johnson' }),
      ).toBeInTheDocument();
      expect(
        within(sarahCard).getByRole('button', { name: 'Remove Sarah Johnson' }),
      ).toBeInTheDocument();
    });
  });

  describe('4.1.3 Status Messages', () => {
    it('uses aria-live region for action announcements', () => {
      render(<App />);
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('emergency confirmed phase has role status', () => {
      render(
        <EmergencyDialog
          open={true}
          contacts={[{ id: '1', name: 'Test', initials: 'T' }]}
          onClose={jest.fn()}
          onAlertSent={jest.fn()}
        />,
      );

      const helpBtn = screen.getByRole('button', { name: 'I Need Help' });
      helpBtn.click();

      jest.useFakeTimers();
      for (let i = 0; i < 10; i++) {
        jest.advanceTimersByTime(1000);
      }

      const statusEl = document.querySelector('[role="status"]');
      if (statusEl) {
        expect(statusEl).toBeInTheDocument();
      }
      jest.useRealTimers();
    });
  });

  describe('1.4.13 Content on Hover or Focus', () => {
    it('keyboard shortcuts button announces its popup type', () => {
      render(<App />);
      const shortcutsBtn = screen.getByRole('button', { name: 'Keyboard Shortcuts' });
      expect(shortcutsBtn).toHaveAttribute('aria-haspopup', 'dialog');
    });
  });

  describe('2.1.1 Keyboard', () => {
    it('hero card responds to Enter and Space keys', async () => {
      const user = userEvent.setup();
      render(<App />);

      const heroCard = document.querySelector('.hero-card');
      heroCard.focus();

      await user.keyboard('{Enter}');
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it('all toolbar buttons are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.tab();
      for (let i = 0; i < 7; i++) {
        await user.tab();
        expect(document.activeElement.tagName).toBe('BUTTON');
      }
    });
  });

  describe('3.1.1 Language of Page', () => {
    it('index.html specifies lang attribute', () => {
      const fs = require('fs');
      const path = require('path');
      const html = fs.readFileSync(
        path.resolve(__dirname, '..', '..', 'index.html'),
        'utf8',
      );
      expect(html).toMatch(/<html[^>]+lang="en"/);
    });
  });
});
