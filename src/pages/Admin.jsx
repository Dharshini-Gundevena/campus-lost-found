import { useState } from 'react';
import Section from '../components/ui/Section';
import { ItemCard, MatchCard, ClaimCard } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import './Admin.css';

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`admin-stat ${color}`}>
      <span className="admin-stat__icon" aria-hidden="true">{icon}</span>
      <div className="admin-stat__body">
        <span className="admin-stat__value">{value}</span>
        <span className="admin-stat__label">{label}</span>
      </div>
    </div>
  );
}

// ── Report table ──────────────────────────────────────────────
function ReportTable({ items, type }) {
  if (items.length === 0) {
    return <EmptyState icon="📭" title="No reports" message={`No ${type} reports yet.`} />;
  }
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Location</th>
            <th>Date</th>
            <th>Contact</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="admin-table__title">{item.title}</td>
              <td>{item.category}</td>
              <td>{item.location}</td>
              <td>{item.date}</td>
              <td className="admin-table__contact">{item.contact}</td>
              <td>
                {item.recoveryStatus === 'recovered' ? (
                  <span className="badge badge--recovered">✓ Recovered</span>
                ) : (
                  <span className={`badge badge--${item.type}`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Reject reason modal ───────────────────────────────────────
function RejectModal({ claim, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reject-modal-title">
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title" id="reject-modal-title">Reject Claim</h2>
          <button className="modal__close" onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <div className="modal__body">
          <p className="admin-modal__desc">
            Rejecting claim for <strong>"{claim.itemTitle}"</strong> by{' '}
            <strong>{claim.claimant}</strong>.
          </p>
          <div className="form-group" style={{ marginTop: '.9rem' }}>
            <label htmlFor="reject-reason">Reason for rejection (shown to claimant)</label>
            <textarea
              id="reject-reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Description did not match identifying features on file."
              style={{ minHeight: '80px' }}
            />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn--danger" onClick={() => onConfirm(reason)}>
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin component ──────────────────────────────────────
export default function Admin() {
  const {
    lostItems, foundItems, matches, claims,
    approveClaim, rejectClaim,
  } = useApp();

  const [reportsTab,  setReportsTab]  = useState('lost');
  const [matchesTab,  setMatchesTab]  = useState('all');
  const [claimsTab,   setClaimsTab]   = useState('all');
  const [rejectTarget, setRejectTarget] = useState(null); // claim being rejected
  const [actionFeedback, setActionFeedback] = useState(null); // { type, message }

  // ── Derived stats (live from context) ──────────────────────
  const stats = {
    totalLost:     lostItems.length,
    totalFound:    foundItems.length,
    totalMatched:  matches.length,
    pendingClaims: claims.filter(c => c.status === 'pending').length,
    recovered:     foundItems.filter(f => f.recoveryStatus === 'recovered').length,
  };

  // ── Filtered matches ────────────────────────────────────────
  const filteredMatches = matchesTab === 'all'
    ? matches
    : matchesTab === 'pending_confirmation'
      ? matches.filter(m => m.status === 'pending_confirmation')
      : matches.filter(m => m.status === matchesTab);

  // ── Filtered claims ─────────────────────────────────────────
  const filteredClaims = claimsTab === 'all'
    ? claims
    : claims.filter(c => c.status === claimsTab);

  // ── Action handlers ─────────────────────────────────────────
  function handleApprove(claimId, itemTitle) {
    approveClaim(claimId);
    showFeedback('success', `✅ Claim for "${itemTitle}" approved. Item marked as recovered.`);
  }

  function handleRejectOpen(claim) {
    setRejectTarget(claim);
  }

  function handleRejectConfirm(reason) {
    rejectClaim(rejectTarget.id, reason);
    showFeedback('warn', `❌ Claim for "${rejectTarget.itemTitle}" rejected.`);
    setRejectTarget(null);
  }

  function showFeedback(type, message) {
    setActionFeedback({ type, message });
    setTimeout(() => setActionFeedback(null), 4000);
  }

  return (
    <>
      {rejectTarget && (
        <RejectModal
          claim={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      <div className="admin-page">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="admin__hero">
          <div className="container admin__hero-inner">
            <div>
              <span className="admin__badge">Admin Panel</span>
              <h1 className="admin__hero-title">Dashboard Overview</h1>
              <p className="admin__hero-sub">
                Manage lost &amp; found reports, matches, and claims across campus.
              </p>
            </div>
            <div className="admin__hero-meta">
              <span>📅 Live data</span>
              {stats.pendingClaims > 0 && (
                <span className="admin__pending-alert">
                  ⚠️ {stats.pendingClaims} claim{stats.pendingClaims > 1 ? 's' : ''} awaiting review
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Action feedback banner ─────────────────────────── */}
        {actionFeedback && (
          <div className={`admin__feedback admin__feedback--${actionFeedback.type}`}>
            <div className="container">{actionFeedback.message}</div>
          </div>
        )}

        {/* ── Stats overview ─────────────────────────────────── */}
        <Section title="At a Glance" subtitle="Live totals from all reports.">
          <div className="admin-stats-grid">
            <StatCard icon="🔍" label="Total Lost"     value={stats.totalLost}     color="astat--lost"     />
            <StatCard icon="📦" label="Total Found"    value={stats.totalFound}    color="astat--found"    />
            <StatCard icon="🔗" label="Matches"        value={stats.totalMatched}  color="astat--matched"  />
            <StatCard icon="📝" label="Pending Claims" value={stats.pendingClaims} color="astat--pending"  />
            <StatCard icon="🎉" label="Recovered"      value={stats.recovered}     color="astat--resolved" />
          </div>
        </Section>

        {/* ── Reports ────────────────────────────────────────── */}
        <Section title="Item Reports" subtitle="All submitted lost and found reports.">
          <div className="admin-tabs" role="tablist">
            {[
              { key: 'lost',  label: '🔍 Lost Reports',  count: lostItems.length  },
              { key: 'found', label: '📦 Found Reports', count: foundItems.length },
            ].map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={reportsTab === t.key}
                className={`admin-tab ${reportsTab === t.key ? 'admin-tab--active' : ''}`}
                onClick={() => setReportsTab(t.key)}
              >
                {t.label}
                <span className="admin-tab-count">{t.count}</span>
              </button>
            ))}
          </div>

          <ReportTable
            items={reportsTab === 'lost' ? lostItems : foundItems}
            type={reportsTab}
          />

          <p className="admin__sub-label">Card View</p>
          <div className="admin-cards-grid">
            {(reportsTab === 'lost' ? lostItems : foundItems).map(item => (
              <ItemCard
                key={item.id}
                item={item}
                actions={
                  item.recoveryStatus !== 'recovered' && (
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <button className="btn btn--outline btn--sm">Edit</button>
                      <button className="btn btn--danger  btn--sm">Remove</button>
                    </div>
                  )
                }
              />
            ))}
          </div>
        </Section>

        {/* ── Matches ────────────────────────────────────────── */}
        <Section title="Match Management" subtitle="Potential matches computed automatically with confidence scores.">
          <div className="admin-tabs" role="tablist">
            {[
              { key: 'all',                  label: 'All',              count: matches.length },
              { key: 'pending_confirmation', label: '⏳ Pending',       count: matches.filter(m => m.status === 'pending_confirmation').length },
              { key: 'confirmed',            label: '✅ Confirmed',     count: matches.filter(m => m.status === 'confirmed').length },
            ].map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={matchesTab === t.key}
                className={`admin-tab ${matchesTab === t.key ? 'admin-tab--active' : ''}`}
                onClick={() => setMatchesTab(t.key)}
              >
                {t.label}
                <span className="admin-tab-count">{t.count}</span>
              </button>
            ))}
          </div>

          {/* Confidence breakdown */}
          {matches.length > 0 && (
            <div className="admin-conf-summary">
              {['high', 'medium', 'low'].map(lvl => (
                <span key={lvl} className={`badge badge--${lvl}`}>
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}: {matches.filter(m => m.confidence === lvl).length}
                </span>
              ))}
            </div>
          )}

          {filteredMatches.length === 0 ? (
            <EmptyState icon="🔗" title="No matches" message="No matches in this category." />
          ) : (
            <div className="admin-cards-grid">
              {filteredMatches.map(match => (
                <div key={match.id} className="admin-match-wrap">
                  <MatchCard match={match} />
                  <div className="admin-match-actions">
                    <button className="btn btn--success btn--sm">Confirm</button>
                    <button className="btn btn--danger  btn--sm">Dismiss</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ── Claims ─────────────────────────────────────────── */}
        <Section
          title="Claims Management"
          subtitle="Review ownership verification details and approve or reject claims."
        >
          <div className="admin-tabs" role="tablist">
            {[
              { key: 'all',      label: 'All',          count: claims.length },
              { key: 'pending',  label: '⏳ Pending',   count: claims.filter(c => c.status === 'pending').length  },
              { key: 'approved', label: '✅ Approved',  count: claims.filter(c => c.status === 'approved').length },
              { key: 'rejected', label: '❌ Rejected',  count: claims.filter(c => c.status === 'rejected').length },
            ].map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={claimsTab === t.key}
                className={`admin-tab ${claimsTab === t.key ? 'admin-tab--active' : ''}`}
                onClick={() => setClaimsTab(t.key)}
              >
                {t.label}
                <span className="admin-tab-count">{t.count}</span>
              </button>
            ))}
          </div>

          {filteredClaims.length === 0 ? (
            <EmptyState icon="📝" title="No claims" message="No claims in this category." />
          ) : (
            <div className="admin-cards-grid">
              {filteredClaims.map(claim => {
                const isPending = claim.status === 'pending';

                // Find related matches for context
                const relatedMatches = matches.filter(
                  m => m.foundId === claim.foundItemId
                );

                return (
                  <div key={claim.id} className="admin-claim-wrap">
                    {/* Claim card with verification details visible */}
                    <ClaimCard claim={claim} showVerify={true} />

                    {/* Related match info */}
                    {relatedMatches.length > 0 && (
                      <div className="admin-claim-match-hint">
                        <p className="admin-claim-match-hint__label">
                          🔗 {relatedMatches.length} auto-match{relatedMatches.length > 1 ? 'es' : ''} for this found item
                        </p>
                        {relatedMatches.map(m => (
                          <div key={m.id} className="admin-claim-match-hint__row">
                            <span className={`badge badge--${m.confidence}`}>
                              {m.confidence}
                            </span>
                            <span className="admin-claim-match-hint__lost">
                              Lost: &ldquo;{m.lostTitle}&rdquo; — {Math.round((m.score ?? 0) * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action buttons — only for pending claims */}
                    {isPending && (
                      <div className="admin-claim-actions">
                        <button
                          className="btn btn--success btn--sm"
                          onClick={() => handleApprove(claim.id, claim.itemTitle)}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => handleRejectOpen(claim)}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      </div>
    </>
  );
}
