import { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { ClaimCard } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { CLAIMS } from '../data/staticData';
import './Claims.css';

const STATUS_TABS = [
  { key: 'all',      label: 'All Claims' },
  { key: 'pending',  label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const STATUS_INFO = {
  pending:  { icon: '⏳', color: 'info--pending',  text: 'Your claim is under review by campus staff.' },
  approved: { icon: '✅', color: 'info--approved', text: 'Claim approved — visit the campus office to collect your item.' },
  rejected: { icon: '❌', color: 'info--rejected', text: 'Claim was not verified. You may submit a new claim with more details.' },
};

export default function Claims() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? CLAIMS
    : CLAIMS.filter(c => c.status === activeTab);

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t.key] = t.key === 'all' ? CLAIMS.length : CLAIMS.filter(c => c.status === t.key).length;
    return acc;
  }, {});

  return (
    <div className="claims-page">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="claims__hero">
        <div className="container">
          <h1 className="claims__hero-title">My Claims</h1>
          <p className="claims__hero-sub">
            Track the status of items you have claimed below.
          </p>
        </div>
      </div>

      <Section noPadTop>
        {/* ── Status summary strip ────────────────────────────── */}
        <div className="claims__summary">
          {[
            { label: 'Total',    value: CLAIMS.length,                          cls: 'summary--total'    },
            { label: 'Pending',  value: CLAIMS.filter(c=>c.status==='pending').length,  cls: 'summary--pending'  },
            { label: 'Approved', value: CLAIMS.filter(c=>c.status==='approved').length, cls: 'summary--approved' },
            { label: 'Rejected', value: CLAIMS.filter(c=>c.status==='rejected').length, cls: 'summary--rejected' },
          ].map(s => (
            <div key={s.label} className={`claims__summary-item ${s.cls}`}>
              <span className="claims__summary-value">{s.value}</span>
              <span className="claims__summary-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Status info banners ─────────────────────────────── */}
        <div className="claims__info-banners">
          {Object.entries(STATUS_INFO).map(([status, info]) => (
            <div key={status} className={`claims__info-banner ${info.color}`}>
              <span aria-hidden="true">{info.icon}</span>
              <div>
                <strong>{status.charAt(0).toUpperCase() + status.slice(1)}:</strong> {info.text}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ────────────────────────────────────────────── */}
        <div className="claims__tabs" role="tablist">
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              className={`claims__tab ${activeTab === t.key ? 'claims__tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              <span className="claims__tab-count">{counts[t.key]}</span>
            </button>
          ))}
        </div>

        {/* ── Cards ───────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No claims here"
            message={`You have no ${activeTab === 'all' ? '' : activeTab + ' '}claims at the moment.`}
            action={<Link to="/browse" className="btn btn--primary btn--sm">Browse Found Items</Link>}
          />
        ) : (
          <div className="claims__grid">
            {filtered.map(claim => (
              <div key={claim.id} className="claims__card-wrap">
                <ClaimCard claim={claim} />
                <div className="claims__card-actions">
                  {claim.status === 'approved' && (
                    <span className="claims__collect-note">
                      📍 Collect from: Security Office, Main Building
                    </span>
                  )}
                  {claim.status === 'rejected' && (
                    <Link to="/browse" className="btn btn--outline btn--sm">
                      Browse Again
                    </Link>
                  )}
                  {claim.status === 'pending' && (
                    <span className="claims__pending-note">
                      ⏳ Estimated review: 1–2 business days
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────── */}
        <div className="claims__cta">
          <p>Looking for something you lost?</p>
          <Link to="/browse" className="btn btn--primary">Browse Found Items</Link>
          <Link to="/report-lost" className="btn btn--outline">Report a Lost Item</Link>
        </div>
      </Section>
    </div>
  );
}
