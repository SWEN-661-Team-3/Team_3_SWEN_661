import { useState, useEffect, useCallback, useRef } from 'react';
import { caregivers, initialPlan } from './data';
import AppHeader from './components/AppHeader';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import HeroCard from './components/HeroCard';
import StatsRow from './components/StatsRow';
import TaskDetailDialog from './components/TaskDetailDialog';
import SettingsDialog from './components/SettingsDialog';
import HelpDialog from './components/HelpDialog';
import EmergencyDialog from './components/EmergencyDialog';
import NewAppointmentDialog from './components/NewAppointmentDialog';
import CompletionDialog from './components/CompletionDialog';
import CareTeamPage from './components/CareTeamPage';
import SavePlanConfirmationDialog from './components/SavePlanConfirmationDialog';
import RemoveItemDialog from './components/RemoveItemDialog';
import ConfirmationDialog from './components/ConfirmationDialog';
import { buildTodaysPlanText } from './planExport';

const initialAccessibilitySettings = {
  largeText: false,
  highContrast: false,
  darkTheme: false,
  reduceMotion: true,
};

export default function App() {
  const [plan, setPlan] = useState(() => structuredClone(initialPlan));
  const [helpers, setHelpers] = useState(() => structuredClone(caregivers));
  const [activeView, setActiveView] = useState('today');
  const [selectedId, setSelectedId] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [newApptOpen, setNewApptOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [removeTaskId, setRemoveTaskId] = useState(null);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [settings, setSettings] = useState(() => ({ ...initialAccessibilitySettings }));
  const [appliedSettings, setAppliedSettings] = useState(() => ({
    ...initialAccessibilitySettings,
  }));
  const [savePlanConfirmationOpen, setSavePlanConfirmationOpen] = useState(false);
  const [editConfirmation, setEditConfirmation] = useState(null);

  const statusRef = useRef(null);
  const mainRef = useRef(null);

  const announce = useCallback((message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  }, []);

  const saveTodaysPlan = useCallback(async () => {
    try {
      const savePlanText = window.careConnect?.savePlanText;
      if (!savePlanText) {
        throw new Error('Save plan is unavailable.');
      }

      const result = await savePlanText(buildTodaysPlanText(plan));
      if (result?.canceled) {
        announce('Save canceled');
        return;
      }

      if (result?.saved) {
        setSavePlanConfirmationOpen(true);
        announce('Plan saved');
        return;
      }

      throw new Error('Plan save did not complete.');
    } catch {
      announce('Unable to save plan');
    }
  }, [announce, plan]);

  useEffect(() => {
    document.body.classList.toggle('large-text', appliedSettings.largeText);
    document.body.classList.toggle('high-contrast', appliedSettings.highContrast);
    document.body.classList.toggle('dark-mode', appliedSettings.darkTheme);
    document.body.classList.toggle('reduce-motion', appliedSettings.reduceMotion);

    return () => {
      document.body.classList.remove(
        'large-text',
        'high-contrast',
        'dark-mode',
        'reduce-motion',
      );
    };
  }, [appliedSettings]);

  useEffect(() => {
    const titles = { today: "Today's Plan", 'care-team': 'Care Team' };
    document.title = `${titles[activeView] ?? 'CareConnect'} - CareConnect`;
  }, [activeView]);

  const handleMenuActionRef = useRef(handleMenuAction);
  handleMenuActionRef.current = handleMenuAction;

  useEffect(() => {
    const cleanup = window.careConnect?.onMenuAction?.((action) => {
      handleMenuActionRef.current(action);
    });
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      const hasMenuModifier = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (e.key === 'F2') {
        e.preventDefault();
        openEmergencyDialog();
      }

      if (e.key === 'F1') {
        e.preventDefault();
        openShortcutsDialog();
      }

      if (hasMenuModifier) {
        switch (key) {
          case 'n':
            e.preventDefault();
            openNewReminder();
            break;
          case 's':
            e.preventDefault();
            saveTodaysPlan();
            break;
          case 'f':
            e.preventDefault();
            openSearch();
            break;
          case '1':
            e.preventDefault();
            showTodaysPlan();
            break;
          case '2':
            e.preventDefault();
            showCareTeam();
            break;
          case ',':
            e.preventDefault();
            openSettingsDialog();
            break;
          default:
            break;
        }
      }

      if (e.key === 'Escape' && searchVisible) {
        closeSearch();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveTodaysPlan, searchVisible, activeView]);

  const nextTask = plan.find((t) => t.status === 'todo') ?? plan[0];
  const selectedTask = plan.find((t) => t.id === selectedId) ?? null;
  const editingTask = plan.find((t) => t.id === editingTaskId) ?? null;
  const removeTask = plan.find((t) => t.id === removeTaskId) ?? null;
  const helperName = helpers[0]?.name ?? 'Helper';
  const emergencyContacts = helpers.slice(0, 2);

  function openSearch() {
    if (activeView !== 'today') {
      showTodaysPlan();
    }
    setSearchVisible(true);
  }

  function closeSearch() {
    setSearchVisible(false);
    setSearchQuery('');
  }

  function showTodaysPlan() {
    setActiveView('today');
    mainRef.current?.focus({ preventScroll: true });
    announce("Showing today's plan");
  }

  function showCareTeam() {
    setActiveView('care-team');
    mainRef.current?.focus({ preventScroll: true });
    announce('Showing Care Team');
  }

  function openTaskDetail(id) {
    setSelectedId(id);
    setDetailOpen(true);
    const task = plan.find((t) => t.id === id);
    if (task) announce(`Opened details for ${task.title}`);
  }

  function completeTask(id) {
    const task = plan.find((t) => t.id === id);
    setPlan((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t)),
    );
    setSelectedId(null);
    setDetailOpen(false);
    if (task) {
      const message = `${task.title} marked complete!`;
      setCompletionMessage(message);
      setCompletionOpen(true);
      announce(message);
    }
  }

  function closeCompletionDialog() {
    setCompletionOpen(false);
    setCompletionMessage('');
  }

  function addAppointment(newItem) {
    setPlan((prev) => [...prev, newItem]);
    closeReminderForm();
    const message = `${newItem.title} saved!`;
    setCompletionMessage(message);
    setCompletionOpen(true);
    announce(message);
  }

  function closeTaskDetail() {
    setDetailOpen(false);
    setSelectedId(null);
  }

  function openNewReminder() {
    setEditingTaskId(null);
    setNewApptOpen(true);
  }

  function openEditTask(id) {
    setEditingTaskId(id);
    setNewApptOpen(true);
  }

  function closeReminderForm() {
    setNewApptOpen(false);
    setEditingTaskId(null);
  }

  function updateTask(updatedTask) {
    setPlan((current) =>
      current.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
    closeReminderForm();
    setEditConfirmation({
      title: 'Reminder updated',
      message: `${updatedTask.title} was updated.`,
    });
    announce(`${updatedTask.title} was updated.`);
  }

  function requestRemoveTask(id) {
    setRemoveTaskId(id);
  }

  function confirmRemoveTask() {
    if (!removeTask) return;

    setPlan((current) => current.filter((task) => task.id !== removeTask.id));
    setSelectedId(null);
    setDetailOpen(false);
    setRemoveTaskId(null);
    announce(`${removeTask.title} was removed.`);
  }

  function openSettingsDialog() {
    setAppliedSettings(settings);
    setSettingsOpen(true);
  }

  function openShortcutsDialog() {
    setHelpOpen(true);
  }

  function openEmergencyDialog() {
    setEmergencyOpen(true);
    announce('Emergency help opened');
  }

  function handleEmergencyAlertSent() {
    announce('Alert sent. Help is on the way. Your emergency contacts have been notified.');
  }

  function handlePreviewSettings(newSettings) {
    setAppliedSettings(newSettings);
  }

  function handleSaveSettings(newSettings) {
    setSettings(newSettings);
    setAppliedSettings(newSettings);
    setSettingsOpen(false);
    announce('Settings saved');
  }

  function handleCloseSettings() {
    setAppliedSettings(settings);
    setSettingsOpen(false);
  }

  function handleMenuAction(action) {
    switch (action) {
      case 'new-record':
        openNewReminder();
        break;
      case 'save':
        saveTodaysPlan();
        break;
      case 'search':
        openSearch();
        break;
      case 'view-todays-plan':
        showTodaysPlan();
        break;
      case 'view-care-team':
        showCareTeam();
        break;
      case 'open-settings':
        openSettingsDialog();
        break;
      case 'help':
      case 'shortcuts':
        openShortcutsDialog();
        break;
      case 'emergency':
        openEmergencyDialog();
        break;
      default:
        break;
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <AppHeader activeView={activeView} onAction={handleMenuAction} />

      <SearchBar
        visible={searchVisible}
        value={searchQuery}
        onChange={setSearchQuery}
        onClose={closeSearch}
      />

      <div className={`app-layout ${activeView === 'care-team' ? 'app-layout--care-team' : ''}`}>
        {activeView === 'today' && (
          <Sidebar
            helperName={helperName}
            tasks={plan}
            filter={searchQuery}
            onSelectTask={openTaskDetail}
          />
        )}

        <main
          id="main-content"
          className={`main-content ${activeView === 'care-team' ? 'main-content--wide' : ''}`}
          tabIndex={-1}
          ref={mainRef}
        >
          {activeView === 'today' && (
            <div className="page-header" aria-hidden="true">
              <p className="page-subtitle">Here is today&apos;s plan.</p>
            </div>
          )}

          <div
            ref={statusRef}
            className="visually-hidden"
            aria-live="polite"
            aria-atomic="true"
          />

          {activeView === 'today' ? (
            <>
              <HeroCard task={nextTask} onClick={openTaskDetail} />
              <StatsRow tasks={plan} />
            </>
          ) : (
            <CareTeamPage
              helpers={helpers}
              onHelpersChange={setHelpers}
              onAnnounce={announce}
            />
          )}
        </main>
      </div>

      <button
        type="button"
        className="floating-shortcuts-btn"
        aria-haspopup="dialog"
        onClick={openShortcutsDialog}
      >
        Keyboard Shortcuts
      </button>

      <TaskDetailDialog
        task={selectedTask}
        open={detailOpen}
        onClose={closeTaskDetail}
        onComplete={completeTask}
        onEdit={openEditTask}
        onRemove={requestRemoveTask}
      />

      <SettingsDialog
        open={settingsOpen}
        settings={settings}
        onChange={handlePreviewSettings}
        onSave={handleSaveSettings}
        onClose={handleCloseSettings}
      />

      <HelpDialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      <EmergencyDialog
        open={emergencyOpen}
        contacts={emergencyContacts}
        onClose={() => setEmergencyOpen(false)}
        onAlertSent={handleEmergencyAlertSent}
      />

      <NewAppointmentDialog
        open={newApptOpen}
        task={editingTask}
        onClose={closeReminderForm}
        onAdd={addAppointment}
        onSave={updateTask}
      />

      <RemoveItemDialog
        itemName={removeTask?.title}
        itemType="reminder"
        message={removeTask ? `Remove ${removeTask.title} from today's plan?` : ''}
        confirmLabel="Remove reminder"
        keepLabel="Keep reminder"
        onClose={() => setRemoveTaskId(null)}
        onConfirm={confirmRemoveTask}
      />

      <ConfirmationDialog
        confirmation={editConfirmation}
        onClose={() => setEditConfirmation(null)}
      />

      <CompletionDialog
        open={completionOpen}
        message={completionMessage}
        onClose={closeCompletionDialog}
      />

      <SavePlanConfirmationDialog
        open={savePlanConfirmationOpen}
        onClose={() => setSavePlanConfirmationOpen(false)}
      />
    </>
  );
}
