import './EmptyState.css';

/**
 * Friendly empty-state placeholder.
 * Props:
 *   icon    – emoji or small SVG (default 📭)
 *   title   – short heading
 *   message – supporting text
 *   action  – optional JSX (e.g. a CTA button)
 */
export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  message = 'There are no items to display right now.',
  action,
}) {
  return (
    <div className="empty-state" role="status" aria-label={title}>
      <span className="empty-state__icon" aria-hidden="true">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      <p  className="empty-state__message">{message}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
