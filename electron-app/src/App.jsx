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
import NewAppointmentDialog from './components/NewAppointmentDialog';
import CompletionDialog from './components/CompletionDialog';

const initialAccessibilitySettings = {
  largeText: false,
  highContrast: false,
  darkTheme: false,
  reduceMotion: true,
};

export default function App() {
  const [plan, setPlan] = useState(() => structuredClone(initialPlan));
  const [selectedId, setSelectedId] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [newApptOpen, setNewApptOpen] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [settings, setSettings] = useState(() => ({ ...initialAccessibilitySettings }));
  const [appliedSettings, setAppliedSettings] = useState(() => ({
    ...initialAccessibilitySettings,
  }));

  const statusRef = useRef(null);
  const mainRef = useRef(null);

  const announce = useCallback((message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  }, []);

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
    const cleanup = window.careConnect?.onMenuAction?.(handleMenuAction);
    return () => cleanup?.();
  });

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && searchVisible) {
        closeSearch();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchVisible]);

  const nextTask = plan.find((t) => t.status === 'todo') ?? plan[0];
  const selectedTask = plan.find((t) => t.id === selectedId) ?? null;
  const helperName = caregivers[0]?.name ?? 'Helper';

  function openSearch() {
    setSearchVisible(true);
  }

  function closeSearch() {
    setSearchVisible(false);
    setSearchQuery('');
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
    setNewApptOpen(false);
    const message = `${newItem.title} saved!`;
    setCompletionMessage(message);
    setCompletionOpen(true);
    announce(message);
  }

  function openSettingsDialog() {
    setAppliedSettings(settings);
    setSettingsOpen(true);
  }

  function openShortcutsDialog() {
    setHelpOpen(true);
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
        setNewApptOpen(true);
        break;
      case 'save':
        announce("Today's plan saved");
        break;
      case 'search':
        openSearch();
        break;
      case 'view-todays-plan':
        mainRef.current?.focus({ preventScroll: true });
        announce("Showing today's plan");
        break;
      case 'open-settings':
        openSettingsDialog();
        break;
      case 'help':
      case 'shortcuts':
        openShortcutsDialog();
        break;
      case 'emergency':
        announce('Emergency help — alert sent to caregivers');
        break;
      default:
        break;
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <AppHeader onAction={handleMenuAction} />

      <SearchBar
        visible={searchVisible}
        value={searchQuery}
        onChange={setSearchQuery}
        onClose={closeSearch}
      />

      <div className="app-layout">
        <Sidebar
          helperName={helperName}
          tasks={plan}
          selectedId={selectedId}
          filter={searchQuery}
          onSelectTask={openTaskDetail}
        />

        <main id="main-content" className="main-content" tabIndex={-1} ref={mainRef}>
          <div className="page-header">
            <p className="page-subtitle">Here is today&apos;s plan.</p>
          </div>

          <div
            ref={statusRef}
            className="visually-hidden"
            aria-live="polite"
            aria-atomic="true"
          />

          <HeroCard task={nextTask} onClick={openTaskDetail} />
          <StatsRow tasks={plan} />
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
        onClose={() => setDetailOpen(false)}
        onComplete={completeTask}
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

      <NewAppointmentDialog
        open={newApptOpen}
        onClose={() => setNewApptOpen(false)}
        onAdd={addAppointment}
      />

      <CompletionDialog
        open={completionOpen}
        message={completionMessage}
        onClose={closeCompletionDialog}
      />
    </>
  );
}
