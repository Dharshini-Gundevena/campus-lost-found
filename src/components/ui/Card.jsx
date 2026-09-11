import './Card.css';

/**
 * Generic surface card.
 * Props:
 *   className  – extra CSS classes
 *   padding    – 'sm' | 'md' (default) | 'lg'
 *   onClick    – makes card interactive / clickable
 *   children
 */
export default function Card({ children, className = '', padding = 'md', onClick }) {
  const cls = [
    'card',
    `card--pad-${padding}`,
    onClick ? 'card--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {children}
    </div>
  );
}

/**
 * Coloured top-border item card for lost / found / matched items.
 * Props:
 *   item  – object from staticData (type, title, category, location, date, description)
 *   actions – optional JSX rendered at bottom-right
 */
export function ItemCard({ item, actions }) {
  const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);

  return (
    <div className={`item-card item-card--${item.type}`}>
      <div className="item-card__header">
        <span className={`badge badge--${item.type}`}>{typeLabel}</span>
        <span className="item-card__date">{item.date}</span>
      </div>

      <h3 className="item-card__title">{item.title}</h3>

      <div className="item-card__meta">
        <span>📂 {item.category}</span>
        <span>📍 {item.location}</span>
      </div>

      <p className="item-card__desc">{item.description}</p>

      {actions && <div className="item-card__actions">{actions}</div>}
    </div>
  );
}

/**
 * Matched-pair card.
 * Props: match – object from MATCHED_ITEMS
 */
export function MatchCard({ match }) {
  const statusLabel = match.status === 'confirmed' ? 'Confirmed' : 'Pending Confirmation';
  const statusClass = match.status === 'confirmed' ? 'badge--approved' : 'badge--pending';

  return (
    <div className="item-card item-card--matched">
      <div className="item-card__header">
        <span className="badge badge--matched">Matched</span>
        <span className={`badge ${statusClass}`}>{statusLabel}</span>
      </div>
      <div className="match-card__pair">
        <div className="match-card__side">
          <span className="match-card__label">Lost</span>
          <span className="match-card__value">{match.lostTitle}</span>
        </div>
        <span className="match-card__arrow">⟷</span>
        <div className="match-card__side">
          <span className="match-card__label">Found</span>
          <span className="match-card__value">{match.foundTitle}</span>
        </div>
      </div>
      <p className="item-card__date" style={{ marginTop: '.5rem' }}>Matched on {match.matchedOn}</p>
    </div>
  );
}

/**
 * Claim status card.
 * Props: claim – object from CLAIMS
 */
export function ClaimCard({ claim }) {
  return (
    <div className={`item-card item-card--claim`}>
      <div className="item-card__header">
        <span className={`badge badge--${claim.status}`}>
          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
        </span>
        <span className="item-card__date">{claim.submittedOn}</span>
      </div>
      <h3 className="item-card__title">{claim.itemTitle}</h3>
      <p className="item-card__meta-line">👤 {claim.claimant}</p>
      <p className="item-card__desc">{claim.note}</p>
    </div>
  );
}
