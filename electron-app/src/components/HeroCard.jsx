export default function HeroCard({ task, onClick }) {
  if (!task) return null;

  const location = task.location || 'Home';

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(task.id);
    }
  }

  return (
    <article
      className="hero-card"
      tabIndex={0}
      role="button"
      aria-label={`Up Next: ${task.title}, ${task.time}, ${location}. Press Enter to view details.`}
      onClick={() => onClick(task.id)}
      onKeyDown={handleKeyDown}
    >
      <div className="hero-card__badge" aria-hidden="true">
        <span>Up Next</span>
      </div>
      <h3 className="hero-card__title" aria-hidden="true">{task.title}</h3>
      <p className="hero-card__time" aria-hidden="true">{task.time} &middot; {location}</p>
      <p className="hero-card__hint" aria-hidden="true">Press Enter to view details</p>
    </article>
  );
}
