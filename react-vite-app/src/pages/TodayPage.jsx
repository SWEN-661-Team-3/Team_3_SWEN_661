import { useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import HeroCard from '../components/HeroCard';
import StatsRow from '../components/StatsRow';
import TaskDetailDialog from '../components/TaskDetailDialog';
import CareConnectDialog from '../components/CareConnectDialog';

export default function TodayPage({ plan, setPlan, helpers }) {
  const [selectedId, setSelectedId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [draftTask, setDraftTask] = useState(null);
  const [saveNotice, setSaveNotice] = useState(null);
  const [completeNotice, setCompleteNotice] = useState(null);
  const statusRef = useRef(null);
  const taskButtonRefs = useRef({});

  const announce = useCallback((message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  }, []);

  const nextTask = plan.find((t) => t.status === 'todo') ?? plan[0];
  const isAddingTask = selectedId === 'new';
  const selectedTask = isAddingTask
    ? draftTask
    : plan.find((t) => t.id === selectedId) ?? null;
  const helperName = helpers[0]?.name ?? 'Helper';

  function openTaskDetail(id) {
    setSelectedId(id);
    setDetailOpen(true);
    const task = plan.find((t) => t.id === id);
    if (task) announce(`Opened details for ${task.title}`);
  }

  function completeTask(id) {
    const task = plan.find((t) => t.id === id);
    if (!task) return;
    setPlan((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t)),
    );
    setSelectedId(null);
    setDetailOpen(false);
    setCompleteNotice({
      id,
      title: task.title,
    });
  }

  function closeCompleteNotice() {
    const completedId = completeNotice?.id;
    setCompleteNotice(null);
    requestAnimationFrame(() => {
      taskButtonRefs.current[completedId]?.focus();
    });
  }

  function closeTaskDetail() {
    setDetailOpen(false);
    setSelectedId(null);
    setDraftTask(null);
  }

  function openAddReminder() {
    setDraftTask({
      id: `reminder-${Date.now()}`,
      title: '',
      date: 'Today',
      time: '',
      location: '',
      notes: '',
      type: 'health-task',
      status: 'todo',
      actionLabel: 'View Details',
    });
    setSelectedId('new');
    setDetailOpen(true);
    announce('Opened add reminder form');
  }

  function saveTask(task) {
    if (isAddingTask) {
      setPlan((prev) => [...prev, task]);
      announce(`${task.title} added to reminders`);
      setSaveNotice({
        title: 'Reminder Added',
        message: 'Reminder was added.',
      });
    } else {
      setPlan((prev) => prev.map((item) => (item.id === task.id ? task : item)));
      announce(`${task.title} updated`);
      setSaveNotice({
        title: 'Reminder Saved',
        message: 'Reminder was saved.',
      });
    }
    setSelectedId(null);
    setDraftTask(null);
    setDetailOpen(false);
    return true;
  }

  return (
    <>
      <Helmet>
        <title>Today&apos;s Plan - CareConnect</title>
        <meta name="description" content="View and manage your daily care plan including medications, appointments, and health tasks." />
        <meta property="og:title" content="Today's Plan - CareConnect" />
        <meta property="og:description" content="Your personalized daily care plan at a glance." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="app-layout">
        <Sidebar
          helperName={helperName}
          tasks={plan}
          onSelectTask={openTaskDetail}
          getTaskButtonRef={(id) => (element) => {
            taskButtonRefs.current[id] = element;
          }}
        />

        <main id="main-content" aria-labelledby="today-plan-heading">
          <div className="main-content">
            <div className="page-header">
              <h1 id="today-plan-heading" className="page-title">Today&apos;s Plan</h1>
              <p className="page-subtitle">Here is today&apos;s plan.</p>
            </div>

            <div
              ref={statusRef}
              className="visually-hidden"
              aria-live="polite"
              aria-atomic="true"
            />

            <div className="page-actions">
              <button type="button" className="primary-btn" onClick={openAddReminder}>
                Add Reminder
              </button>
            </div>

            <HeroCard task={nextTask} onClick={openTaskDetail} />
            <StatsRow tasks={plan} />
          </div>
        </main>
      </div>

      <TaskDetailDialog
        key={selectedId ?? 'closed'}
        task={selectedTask}
        open={detailOpen}
        mode={isAddingTask ? 'add' : 'view'}
        onClose={closeTaskDetail}
        onComplete={completeTask}
        onSave={saveTask}
      />

      <CareConnectDialog
        open={Boolean(saveNotice)}
        title={saveNotice?.title ?? ''}
        message={saveNotice?.message ?? ''}
        onConfirm={() => setSaveNotice(null)}
      />

      <CareConnectDialog
        open={Boolean(completeNotice)}
        title="Reminder Complete"
        message={`"${completeNotice?.title ?? 'Reminder'}" was marked complete.`}
        variant="success"
        onConfirm={closeCompleteNotice}
      />
    </>
  );
}
