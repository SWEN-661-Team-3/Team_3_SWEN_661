export default function StatsRow({ tasks }) {
  const done = tasks.filter((t) => t.status === 'done').length;
  const pending = tasks.filter((t) => t.status === 'todo').length;
  const total = tasks.length;

  return (
    <div className="stats-row" role="status" aria-label={`Tasks done: ${done} of ${total}. Pending: ${pending}.`}>
      <div className="stat-card" aria-hidden="true">
        <span className="stat-card__icon stat-card__icon--success">
          {'\u2713'}
        </span>
        <div>
          <p className="stat-card__value">{done}/{total}</p>
          <p className="stat-card__label">Tasks done</p>
        </div>
      </div>
      <div className="stat-card" aria-hidden="true">
        <span className="stat-card__icon stat-card__icon--warning">
          {'\u25F7'}
        </span>
        <div>
          <p className="stat-card__value">{pending}</p>
          <p className="stat-card__label">Pending</p>
        </div>
      </div>
    </div>
  );
}
