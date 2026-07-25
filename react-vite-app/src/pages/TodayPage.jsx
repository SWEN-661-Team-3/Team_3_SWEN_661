import { useState, useRef, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import HeroCard from '../components/HeroCard';
import StatsRow from '../components/StatsRow';
import TaskDetailDialog from '../components/TaskDetailDialog';
import CareConnectDialog from '../components/CareConnectDialog';
import EmptyState from '../components/EmptyState';
import { deleteReminder, markReminderComplete, saveReminder } from '../services/carePlanService';

export default function TodayPage({ plan, setPlan, helpers }) {
  const [selectedId, setSelectedId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [draftTask, setDraftTask] = useState(null);
  const [saveNotice, setSaveNotice] = useState(null);
  const [completeNotice, setCompleteNotice] = useState(null);
  const [deleteNotice, setDeleteNotice] = useState(null);
  const statusRef = useRef(null);
  const taskButtonRefs = useRef({});
  const triggerRef = useRef(null);

  const announce = useCallback((message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  }, []);

  // One pass produces the plan-derived values consumed by several sections;
  // keeping this stable avoids re-filtering while dialog and notice state changes.
  const planSummary = useMemo(() => {
    const pendingTasks = plan.filter((task) => task.status === 'todo');
    const upcomingAppointments = pendingTasks.filter((task) => task.type === 'appointment');

    return {
      hasTasks: plan.length > 0,
      hasUpcomingAppointments: upcomingAppointments.length > 0,
      nextTask: pendingTasks[0] ?? plan[0],
    };
  }, [plan]);

  const isAddingTask = selectedId === 'new';
  const selectedTask = isAddingTask
    ? draftTask
    : plan.find((t) => t.id === selectedId) ?? null;
  const helperName = helpers[0]?.name ?? 'Helper';

  function openTaskDetail(id, event) {
    triggerRef.current = event?.currentTarget ?? taskButtonRefs.current[id] ?? null;
    setSelectedId(id);
    setDetailOpen(true);
  }

  async function completeTask(id) {
    const task = plan.find((t) => t.id === id);
    if (!task) return false;
    const completedTask = await markReminderComplete(id);
    if (!completedTask) throw new Error('Reminder not found');
    setPlan((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t)),
    );
    setCompleteNotice({
      id,
      title: task.title,
    });
    return true;
  }

  async function deleteTask(id) {
    const task = plan.find((item) => item.id === id);
    if (!task) return false;

    await deleteReminder(id);
    setPlan((prev) => prev.filter((item) => item.id !== id));
    setDeleteNotice({ title: task.title });
    return true;
  }

  function closeCompleteNotice() {
    const completedId = completeNotice?.id;
    setCompleteNotice(null);
    requestAnimationFrame(() => {
      taskButtonRefs.current[completedId]?.focus();
    });
  }

  function closeTaskDetail() {
    // Returning focus to the trigger preserves the user's place after a
    // modal closes; ordinary success/status messages intentionally do not
    // move focus away from the control the user is using.
    setDetailOpen(false);
    setSelectedId(null);
    setDraftTask(null);
    requestAnimationFrame(() => {
      const trigger = triggerRef.current;
      if (trigger?.isConnected && !trigger.disabled) {
        trigger.focus();
      } else {
        document.getElementById('main-content')?.focus();
      }
    });
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
  }

  async function saveTask(task) {
    const savedTask = await saveReminder(task);
    if (isAddingTask) {
      setPlan((prev) => [...prev, savedTask]);
      setSaveNotice({
        title: 'Reminder Added',
        message: 'Reminder was added.',
      });
    } else {
      setPlan((prev) => prev.map((item) => (item.id === savedTask.id ? savedTask : item)));
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

      <>
        <Sidebar
          helperName={helperName}
          tasks={plan}
          onSelectTask={openTaskDetail}
          getTaskButtonRef={(id) => (element) => {
            taskButtonRefs.current[id] = element;
          }}
        />

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

            {planSummary.hasTasks ? (
              <>
                <HeroCard task={planSummary.nextTask} onClick={openTaskDetail} />
                <StatsRow tasks={plan} />
                {!planSummary.hasUpcomingAppointments && (
                  <EmptyState
                    title="No upcoming appointments"
                    message="Add an appointment reminder to keep visit details and timing in your daily plan."
                    action={(
                      <button type="button" className="secondary-btn" onClick={openAddReminder}>
                        Add Appointment
                      </button>
                    )}
                  />
                )}
              </>
            ) : (
              <EmptyState
                title="No reminders yet"
                message="Add a reminder to start building today’s care plan."
                action={(
                  <button type="button" className="primary-btn" onClick={openAddReminder}>
                    Add Reminder
                  </button>
                )}
              />
            )}
        </div>
      </>

      <TaskDetailDialog
        key={selectedId ?? 'closed'}
        task={selectedTask}
        open={detailOpen}
        mode={isAddingTask ? 'add' : 'view'}
        onClose={closeTaskDetail}
        onComplete={completeTask}
        onDelete={deleteTask}
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

      <CareConnectDialog
        open={Boolean(deleteNotice)}
        title="Reminder Deleted"
        message={`"${deleteNotice?.title ?? 'Reminder'}" was deleted.`}
        variant="success"
        onConfirm={() => setDeleteNotice(null)}
      />
    </>
  );
}
