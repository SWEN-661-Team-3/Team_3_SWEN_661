import { useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import HeroCard from '../components/HeroCard';
import StatsRow from '../components/StatsRow';
import TaskDetailDialog from '../components/TaskDetailDialog';

export default function TodayPage({ plan, setPlan, helpers }) {
  const [selectedId, setSelectedId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const statusRef = useRef(null);

  const announce = useCallback((message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  }, []);

  const nextTask = plan.find((t) => t.status === 'todo') ?? plan[0];
  const selectedTask = plan.find((t) => t.id === selectedId) ?? null;
  const helperName = helpers[0]?.name ?? 'Helper';

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
    if (task) announce(`${task.title} marked complete!`);
  }

  function closeTaskDetail() {
    setDetailOpen(false);
    setSelectedId(null);
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
        />

        <main id="main-content" role="main" aria-label="Today's care plan">
          <div className="main-content">
            <div className="page-header" aria-hidden="true">
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
          </div>
        </main>
      </div>

      <TaskDetailDialog
        task={selectedTask}
        open={detailOpen}
        onClose={closeTaskDetail}
        onComplete={completeTask}
      />
    </>
  );
}
