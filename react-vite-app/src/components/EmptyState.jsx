export default function EmptyState({ title, message, action, id, tabIndex }) {
  return (
    <section id={id} tabIndex={tabIndex} className="empty-state" aria-labelledby="empty-state-title">
      <h2 id="empty-state-title">{title}</h2>
      <p>{message}</p>
      {action}
    </section>
  );
}
