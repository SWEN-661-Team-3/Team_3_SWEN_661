import { memo, useMemo } from 'react';

// Memoized component + derived counts: this row only changes when the
// tasks array reference changes, avoiding unnecessary DOM updates.
export default memo(function StatsRow({ tasks }) {
  const { done, pending } = useMemo(() => ({
    done: tasks.filter((t) => t.status === 'done').length,
    pending: tasks.filter((t) => t.status === 'todo').length,
  }), [tasks]);

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
});
