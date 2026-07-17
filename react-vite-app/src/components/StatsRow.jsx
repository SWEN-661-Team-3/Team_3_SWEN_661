export default function StatsRow({ tasks }) {
  const done = tasks.filter((t) => t.status === 'done').length;
  const pending = tasks.filter((t) => t.status === 'todo').length;

  return (
    <section className="stats-row" aria-label="Plan completion statistics">
      <article className="stat-card">
        <span className="stat-card__icon stat-card__icon--success" aria-hidden="true">
          &#10003;
        </span>
        <div>
          <p className="stat-card__value">{done}</p>
          <p className="stat-card__label">Completed</p>
        </div>
      </article>
      <article className="stat-card">
        <span className="stat-card__icon stat-card__icon--warning" aria-hidden="true">
          &#9207;
        </span>
        <div>
          <p className="stat-card__value">{pending}</p>
          <p className="stat-card__label">Remaining</p>
        </div>
      </article>
    </section>
  );
}
