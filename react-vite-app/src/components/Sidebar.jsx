import { statusLabels } from '../data/careData';

export default function Sidebar({ helperName, tasks, onSelectTask }) {
  return (
    <aside className="sidebar" role="complementary" aria-label="Daily plan sidebar">
      <div className="sidebar-section">
        <h2 className="sidebar-heading">Your Helper</h2>
        <div className="helper-card">
          <span className="helper-card__icon" aria-hidden="true">SJ</span>
          <div>
            <p className="helper-card__name">{helperName}</p>
            <p className="helper-card__role">Available Now</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-section" aria-label="Today's tasks">
        <h2 className="sidebar-heading">Today&apos;s Tasks</h2>
        <ul className="task-list" role="list">
          {tasks.map((task) => {
            const status = statusLabels[task.status];
            return (
              <li key={task.id} className="task-list__item">
                <button
                  type="button"
                  className={`task-list__btn${task.status === 'done' ? ' task-list__btn--done' : ''}`}
                  onClick={() => onSelectTask(task.id)}
                  aria-label={`${task.title}, ${task.time}, ${status.label}`}
                >
                  <span className="task-list__status" aria-hidden="true">
                    {status.icon}
                  </span>
                  <span>
                    <span className="task-list__title">{task.title}</span>
                    <span className="task-list__time">{task.time}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
