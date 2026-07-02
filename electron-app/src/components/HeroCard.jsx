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
      aria-labelledby="hero-title hero-time"
      onClick={() => onClick(task.id)}
      onKeyDown={handleKeyDown}
    >
      <div className="hero-card__badge">
        <span>Up Next</span>
      </div>
      <h3 className="hero-card__title" id="hero-title">{task.title}</h3>
      <p className="hero-card__time" id="hero-time">{task.time} &middot; {location}</p>
      <p className="hero-card__hint">Press Enter to view details</p>
    </article>
  );
}
