import './Card.css';

// ── Confidence badge labels ───────────────────────────────────
const CONFIDENCE_META = {
  high:   { label: 'High Match',   cls: 'badge--high'   },
  medium: { label: 'Medium Match', cls: 'badge--medium' },
  low:    { label: 'Low Match',    cls: 'badge--low'    },
};

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
    <div
      className={cls}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Coloured top-border item card for lost / found items.
 * Level 2: shows recovery badge when recoveryStatus === 'recovered'.
 *
 * Props:
 *   item    – LostItem | FoundItem
 *   actions – optional JSX (bottom-right)
 */
export function ItemCard({ item, actions }) {
  const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
  const recovered = item.recoveryStatus === 'recovered';

  return (
    <div className={`item-card item-card--${item.type} ${recovered ? 'item-card--recovered' : ''}`}>
      <div className="item-card__header">
        <div className="item-card__badges">
          <span className={`badge badge--${item.type}`}>{typeLabel}</span>
          {recovered && (
            <span className="badge badge--recovered">✓ Recovered</span>
          )}
        </div>
        <span className="item-card__date">{item.date}</span>
      </div>

      <h3 className="item-card__title">{item.title}</h3>

      <div className="item-card__meta">
        <span>📂 {item.category}</span>
        <span>📍 {item.location}</span>
      </div>

      <p className="item-card__desc">{item.description}</p>

      {recovered && item.claimedBy && (
        <p className="item-card__recovered-note">
          🎉 Claimed by <strong>{item.claimedBy}</strong>
        </p>
      )}

      {!recovered && actions && (
        <div className="item-card__actions">{actions}</div>
      )}
    </div>
  );
}

/**
 * Matched-pair card.
 * Level 2: shows confidence badge + score bar + reasons list.
 *
 * Props:
 *   match – MatchedItem (lostTitle, foundTitle, matchedOn, status,
 *            confidence?, score?, reasons?)
 */
export function MatchCard({ match }) {
  const statusLabel = match.status === 'confirmed'
    ? 'Confirmed'
    : match.status === 'pending_confirmation'
      ? 'Pending Confirmation'
      : match.status;
  const statusClass = match.status === 'confirmed' ? 'badge--approved' : 'badge--pending';

  const confMeta = match.confidence ? CONFIDENCE_META[match.confidence] : null;
  const scorePct = match.score != null ? Math.round(match.score * 100) : null;

  return (
    <div className="item-card item-card--matched">
      <div className="item-card__header">
        <div className="item-card__badges">
          <span className="badge badge--matched">Matched</span>
          <span className={`badge ${statusClass}`}>{statusLabel}</span>
          {confMeta && (
            <span className={`badge ${confMeta.cls}`}>{confMeta.label}</span>
          )}
        </div>
        {scorePct != null && (
          <span className="match-card__score-pct">{scorePct}%</span>
        )}
      </div>

      {/* Score bar */}
      {scorePct != null && (
        <div className="match-card__score-bar-wrap" aria-label={`Match confidence: ${scorePct}%`}>
          <div
            className={`match-card__score-bar match-card__score-bar--${match.confidence}`}
            style={{ width: `${scorePct}%` }}
          />
        </div>
      )}

      {/* Pair */}
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

      {/* Reasons */}
      {match.reasons && match.reasons.length > 0 && (
        <div className="match-card__reasons">
          <p className="match-card__reasons-title">Why this match?</p>
          <ul>
            {match.reasons.map((r, i) => (
              <li key={i}>✓ {r}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="item-card__date" style={{ marginTop: '.5rem' }}>
        Matched on {match.matchedOn}
      </p>
    </div>
  );
}

/**
 * Claim status card.
 * Level 2: shows verification details section when present.
 *
 * Props:
 *   claim       – Claim object
 *   showVerify  – boolean, show verification details (default false)
 */
export function ClaimCard({ claim, showVerify = false }) {
  const v = claim.verificationDetails;

  return (
    <div className="item-card item-card--claim">
      <div className="item-card__header">
        <div className="item-card__badges">
          <span className={`badge badge--${claim.status}`}>
            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
          </span>
          {claim.status === 'approved' && (
            <span className="badge badge--recovered">✓ Recovered</span>
          )}
        </div>
        <span className="item-card__date">{claim.submittedOn}</span>
      </div>

      <h3 className="item-card__title">{claim.itemTitle}</h3>
      <p className="item-card__meta-line">👤 {claim.claimant}</p>
      {claim.contact && (
        <p className="item-card__meta-line">✉️ {claim.contact}</p>
      )}
      <p className="item-card__desc">{claim.note}</p>

      {/* Ownership verification details */}
      {showVerify && v && (
        <div className="claim-card__verify">
          <p className="claim-card__verify-title">🔐 Ownership Verification</p>
          {v.proofDescription && (
            <div className="claim-card__verify-row">
              <span className="claim-card__verify-label">Identifying features</span>
              <span className="claim-card__verify-value">{v.proofDescription}</span>
            </div>
          )}
          {v.serialOrMarkings && (
            <div className="claim-card__verify-row">
              <span className="claim-card__verify-label">Serial / markings</span>
              <span className="claim-card__verify-value">{v.serialOrMarkings}</span>
            </div>
          )}
          {v.additionalContext && (
            <div className="claim-card__verify-row">
              <span className="claim-card__verify-label">Additional context</span>
              <span className="claim-card__verify-value">{v.additionalContext}</span>
            </div>
          )}
        </div>
      )}

      {/* Rejection reason */}
      {claim.status === 'rejected' && claim.rejectReason && (
        <div className="claim-card__reject-reason">
          ❌ <strong>Reason:</strong> {claim.rejectReason}
        </div>
      )}

      {/* Resolution date */}
      {claim.resolvedOn && (
        <p className="item-card__date" style={{ marginTop: '.4rem' }}>
          Resolved on {claim.resolvedOn}
        </p>
      )}
    </div>
  );
}
