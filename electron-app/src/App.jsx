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

export default function App() {
  const [plan, setPlan] = useState(() => structuredClone(initialPlan));
  const [selectedId, setSelectedId] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [newApptOpen, setNewApptOpen] = useState(false);
  const [settings, setSettings] = useState({
    largeText: false,
    highContrast: false,
    reduceMotion: true,
  });

  const statusRef = useRef(null);
  const mainRef = useRef(null);

  const announce = useCallback((message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('large-text', settings.largeText);
    document.body.classList.toggle('high-contrast', settings.highContrast);
  }, [settings]);

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
    setPlan((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t)),
    );
    setDetailOpen(false);
    const task = plan.find((t) => t.id === id);
    if (task) announce(`${task.title} marked complete`);
  }

  function addAppointment(newItem) {
    setPlan((prev) => [...prev, newItem]);
    setNewApptOpen(false);
    announce(`${newItem.title} added to today's plan`);
  }

  function handleSaveSettings(newSettings) {
    setSettings(newSettings);
    setSettingsOpen(false);
    announce('Settings saved');
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
        mainRef.current?.focus();
        announce("Showing today's plan");
        break;
      case 'open-settings':
        setSettingsOpen(true);
        break;
      case 'help':
      case 'shortcuts':
        setHelpOpen(true);
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
            <h2 className="page-title">Your setup is complete.</h2>
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

          <button
            type="button"
            className="primary-btn"
            onClick={() => setSettingsOpen(true)}
          >
            Accessibility Shortcuts
          </button>
        </main>
      </div>

      <TaskDetailDialog
        task={selectedTask}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onComplete={completeTask}
      />

      <SettingsDialog
        open={settingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setSettingsOpen(false)}
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
    </>
  );
}
