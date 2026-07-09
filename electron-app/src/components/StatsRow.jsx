export default function StatsRow({ tasks }) {
  const done = tasks.filter((t) => t.status === 'done').length;
  const pending = tasks.filter((t) => t.status === 'todo').length;
  const total = tasks.length;

  return (
    <div className="stats-row" role="group" aria-label="Task statistics">
      <div className="stat-card" role="group" aria-label={`Tasks done: ${done} of ${total}`}>
        <span className="stat-card__icon stat-card__icon--success" aria-hidden="true">
          {'\u2713'}
        </span>
        <div>
          <p className="stat-card__value" aria-hidden="true">{done}/{total}</p>
          <p className="stat-card__label">Tasks done</p>
        </div>
      </div>
      <div className="stat-card" role="group" aria-label={`Pending: ${pending}`}>
        <span className="stat-card__icon stat-card__icon--warning" aria-hidden="true">
          {'\u25F7'}
        </span>
        <div>
          <p className="stat-card__value" aria-hidden="true">{pending}</p>
          <p className="stat-card__label">Pending</p>
        </div>
      </div>
    </div>
  );
}
