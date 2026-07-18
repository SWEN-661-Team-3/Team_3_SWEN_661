import { typeLabels } from '../data/careData';

export default function HeroCard({ task, onClick }) {
  if (!task) return null;

  const typeInfo = typeLabels[task.type] ?? { label: task.type, icon: '?' };

  return (
    <button
      type="button"
      className="hero-card"
      onClick={() => onClick(task.id)}
      aria-label={`Next up: ${task.title} at ${task.time}. Click for details.`}
    >
      <span className="hero-card__badge">
        Next Up &mdash; {typeInfo.label}
      </span>
      <h2 className="hero-card__title">{task.title}</h2>
      <p className="hero-card__time">{task.time}{task.location ? ` \u2022 ${task.location}` : ''}</p>
      <p className="hero-card__hint">Click to view details</p>
    </button>
  );
}
