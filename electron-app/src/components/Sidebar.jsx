import TaskList from './TaskList';

export default function Sidebar({ helperName, tasks, selectedId, filter, onSelectTask }) {
  return (
    <aside className="sidebar" aria-label="Plan summary">
      <section className="sidebar-section">
        <h2 className="sidebar-heading">Helper</h2>
        <div className="helper-card">
          <span className="helper-card__icon" aria-hidden="true">H</span>
          <div>
            <p className="helper-card__name">{helperName} is available</p>
            <p className="helper-card__role">Helper</p>
          </div>
        </div>
      </section>

      <section className="sidebar-section">
        <h2 className="sidebar-heading">Today&apos;s tasks</h2>
        <TaskList
          tasks={tasks}
          selectedId={selectedId}
          filter={filter}
          onSelectTask={onSelectTask}
        />
      </section>
    </aside>
  );
}
