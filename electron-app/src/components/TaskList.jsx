import { statusLabels, typeLabels } from '../data';

export default function TaskList({ tasks, selectedId, filter, onSelectTask }) {
  const query = (filter || '').trim().toLowerCase();

  const filtered = tasks.filter((item) => {
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.time.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );
  });

  return (
    <ul className="task-list" role="list" aria-label="Task list">
      {filtered.map((item) => {
        const status = statusLabels[item.status] ?? statusLabels.todo;
        const type = typeLabels[item.type] ?? { label: item.type, icon: '\u2022' };

        const classes = [
          'task-list__btn',
          item.status === 'done' && 'task-list__btn--done',
          selectedId === item.id && 'task-list__btn--selected',
        ].filter(Boolean).join(' ');

        return (
          <li key={item.id} className="task-list__item" role="listitem">
            <button
              type="button"
              className={classes}
              aria-label={`${item.title}, ${item.time}, ${status.label}, ${type.label}`}
              onClick={() => onSelectTask(item.id)}
            >
              <span className="task-list__status" aria-hidden="true">{status.icon}</span>
              <span>
                <span className="task-list__title">{item.title}</span>
                <span className="task-list__time">{item.time} &middot; {type.label}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
