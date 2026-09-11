import './LoadingPlaceholder.css';

/**
 * Skeleton loading placeholder.
 * Props:
 *   count  – number of skeleton cards to render (default 4)
 *   type   – 'card' | 'row' | 'text' (default 'card')
 */
export default function LoadingPlaceholder({ count = 4, type = 'card' }) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'text') {
    return (
      <div className="skeleton-text-group" aria-busy="true" aria-label="Loading…">
        {items.map(i => (
          <div key={i} className="skeleton skeleton--text" style={{ width: `${85 - i * 10}%` }} />
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className="skeleton-rows" aria-busy="true" aria-label="Loading…">
        {items.map(i => (
          <div key={i} className="skeleton-row">
            <div className="skeleton skeleton--circle" />
            <div className="skeleton-row__lines">
              <div className="skeleton skeleton--line" style={{ width: '60%' }} />
              <div className="skeleton skeleton--line" style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // default: card
  return (
    <div className="skeleton-grid" aria-busy="true" aria-label="Loading…">
      {items.map(i => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton--line" style={{ width: '35%' }} />
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--line" style={{ width: '75%' }} />
          <div className="skeleton skeleton--line" style={{ width: '55%' }} />
          <div className="skeleton skeleton--line" />
        </div>
      ))}
    </div>
  );
}
