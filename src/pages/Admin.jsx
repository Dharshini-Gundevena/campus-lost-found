import { useState } from 'react';
import Section from '../components/ui/Section';
import { ItemCard, MatchCard, ClaimCard } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import {
  LOST_ITEMS,
  FOUND_ITEMS,
  MATCHED_ITEMS,
  CLAIMS,
  ADMIN_STATS,
} from '../data/staticData';
import './Admin.css';

// ── Stat card helper ──────────────────────────────────────────
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

// ── Simple table for lost/found reports ───────────────────────
function ReportTable({ items, type }) {
  return items.length === 0 ? (
    <EmptyState icon="📭" title="No reports" message={`No ${type} reports yet.`} />
  ) : (
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
                <span className={`badge badge--${item.type}`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Admin component ──────────────────────────────────────
export default function Admin() {
  const [reportsTab,  setReportsTab]  = useState('lost');
  const [matchesTab,  setMatchesTab]  = useState('all');
  const [claimsTab,   setClaimsTab]   = useState('all');

  // ── Filtered claims ─────────────────────────────────────────
  const filteredClaims = claimsTab === 'all'
    ? CLAIMS
    : CLAIMS.filter(c => c.status === claimsTab);

  // ── Filtered matches ────────────────────────────────────────
  const filteredMatches = matchesTab === 'all'
    ? MATCHED_ITEMS
    : MATCHED_ITEMS.filter(m => m.status === matchesTab);

  return (
    <div className="admin-page">
      {/* ── Hero ──────────────────────────────────────────────── */}
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
            <span>📅 Last updated: just now</span>
          </div>
        </div>
      </div>

      {/* ── Stats overview ────────────────────────────────────── */}
      <Section title="At a Glance" subtitle="Current system totals.">
        <div className="admin-stats-grid">
          <StatCard icon="🔍" label="Total Lost"       value={ADMIN_STATS.totalLost}      color="astat--lost"     />
          <StatCard icon="📦" label="Total Found"      value={ADMIN_STATS.totalFound}     color="astat--found"    />
          <StatCard icon="✅" label="Matched"          value={ADMIN_STATS.totalMatched}   color="astat--matched"  />
          <StatCard icon="📝" label="Pending Claims"   value={ADMIN_STATS.pendingClaims}  color="astat--pending"  />
          <StatCard icon="🎉" label="Resolved Today"   value={ADMIN_STATS.resolvedToday}  color="astat--resolved" />
        </div>
      </Section>

      {/* ── Reports section ───────────────────────────────────── */}
      <Section
        title="Item Reports"
        subtitle="All submitted lost and found reports."
      >
        {/* Tabs */}
        <div className="admin-tabs" role="tablist">
          {[
            { key: 'lost',  label: '🔍 Lost Reports',  count: LOST_ITEMS.length  },
            { key: 'found', label: '📦 Found Reports', count: FOUND_ITEMS.length },
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
          items={reportsTab === 'lost' ? LOST_ITEMS : FOUND_ITEMS}
          type={reportsTab}
        />

        {/* Card grid view below table */}
        <p className="admin__sub-label">Card View</p>
        <div className="admin-cards-grid">
          {(reportsTab === 'lost' ? LOST_ITEMS : FOUND_ITEMS).map(item => (
            <ItemCard
              key={item.id}
              item={item}
              actions={
                <div style={{ display: 'flex', gap: '.4rem' }}>
                  <button className="btn btn--outline btn--sm">Edit</button>
                  <button className="btn btn--danger  btn--sm">Remove</button>
                </div>
              }
            />
          ))}
        </div>
      </Section>

      {/* ── Matches section ───────────────────────────────────── */}
      <Section title="Match Management" subtitle="Review and manage potential item matches.">
        <div className="admin-tabs" role="tablist">
          {[
            { key: 'all',                  label: 'All Matches',        count: MATCHED_ITEMS.length },
            { key: 'pending_confirmation', label: '⏳ Pending',         count: MATCHED_ITEMS.filter(m => m.status === 'pending_confirmation').length },
            { key: 'confirmed',            label: '✅ Confirmed',       count: MATCHED_ITEMS.filter(m => m.status === 'confirmed').length },
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

        {filteredMatches.length === 0 ? (
          <EmptyState icon="🔗" title="No matches" message="No matches in this category." />
        ) : (
          <div className="admin-cards-grid">
            {filteredMatches.map(match => (
              <div key={match.id} className="admin-match-wrap">
                <MatchCard match={match} />
                <div className="admin-match-actions">
                  <button className="btn btn--success btn--sm">Confirm</button>
                  <button className="btn btn--danger  btn--sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Claims section ────────────────────────────────────── */}
      <Section title="Claims Management" subtitle="Review and action submitted claims.">
        <div className="admin-tabs" role="tablist">
          {[
            { key: 'all',      label: 'All',      count: CLAIMS.length },
            { key: 'pending',  label: '⏳ Pending',  count: CLAIMS.filter(c => c.status === 'pending').length  },
            { key: 'approved', label: '✅ Approved', count: CLAIMS.filter(c => c.status === 'approved').length },
            { key: 'rejected', label: '❌ Rejected', count: CLAIMS.filter(c => c.status === 'rejected').length },
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
            {filteredClaims.map(claim => (
              <div key={claim.id} className="admin-claim-wrap">
                <ClaimCard claim={claim} />
                {claim.status === 'pending' && (
                  <div className="admin-claim-actions">
                    <button className="btn btn--success btn--sm">Approve</button>
                    <button className="btn btn--danger  btn--sm">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
