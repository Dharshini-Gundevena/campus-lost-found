import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Section from '../components/ui/Section';
import { ClaimCard } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import './Claims.css';

// ─────────────────────────────────────────────────────────────
// Claim submission modal
// ─────────────────────────────────────────────────────────────
const CLAIM_INITIAL = {
  claimant:        '',
  contact:         '',
  note:            '',
  proofDescription:'',
  serialOrMarkings:'',
  additionalContext:'',
};

function ClaimModal({ item, onClose, onSubmit }) {
  const [form, setForm] = useState(CLAIM_INITIAL);
  const [step, setStep] = useState(1); // 1 = basic info, 2 = verification

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleNext(e) {
    e.preventDefault();
    setStep(2);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      foundItemId:  item.id,
      itemTitle:    item.title,
      claimant:     form.claimant,
      contact:      form.contact,
      note:         form.note,
      verificationDetails: {
        proofDescription:  form.proofDescription,
        serialOrMarkings:  form.serialOrMarkings,
        additionalContext: form.additionalContext,
      },
    });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="claim-modal-title">
      <div className="modal">
        {/* Header */}
        <div className="modal__header">
          <div>
            <p className="modal__step-label">
              Step {step} of 2 — {step === 1 ? 'Basic Information' : 'Ownership Verification'}
            </p>
            <h2 className="modal__title" id="claim-modal-title">
              Claim: {item.title}
            </h2>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Step 1 – Basic info */}
        {step === 1 && (
          <form onSubmit={handleNext} noValidate>
            <div className="modal__body">
              <div className="modal__item-summary">
                <span className="badge badge--found">Found Item</span>
                <span className="modal__item-meta">📂 {item.category} · 📍 {item.location}</span>
              </div>

              <div className="form-group">
                <label htmlFor="cm-claimant">Your Full Name <span aria-hidden="true">*</span></label>
                <input
                  id="cm-claimant" name="claimant" type="text" required
                  placeholder="e.g. Jordan Lee"
                  value={form.claimant} onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cm-contact">Your Email <span aria-hidden="true">*</span></label>
                <input
                  id="cm-contact" name="contact" type="email" required
                  placeholder="you@university.edu"
                  value={form.contact} onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cm-note">Brief Description of Your Item</label>
                <textarea
                  id="cm-note" name="note"
                  placeholder="Briefly describe the item and why you believe it is yours…"
                  value={form.note} onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn btn--outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn--primary">
                Next: Verify Ownership →
              </button>
            </div>
          </form>
        )}

        {/* Step 2 – Ownership verification */}
        {step === 2 && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal__body">
              <div className="modal__verify-intro">
                <span aria-hidden="true">🔐</span>
                <p>
                  Provide details that <strong>only the true owner would know</strong>.
                  This information is reviewed by campus staff before any claim is approved.
                  <strong> Items are never automatically approved.</strong>
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="cm-proof">
                  Identifying Features / Proof of Ownership <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="cm-proof" name="proofDescription" required
                  placeholder="Describe unique features — stickers, initials, damage, customisations…"
                  value={form.proofDescription} onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cm-serial">Serial Number / Markings</label>
                <input
                  id="cm-serial" name="serialOrMarkings" type="text"
                  placeholder="e.g. S/N: C02XY1234, engraving on back…"
                  value={form.serialOrMarkings} onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cm-context">Additional Context</label>
                <textarea
                  id="cm-context" name="additionalContext"
                  placeholder="When and where did you last have it? Can anyone confirm?"
                  value={form.additionalContext} onChange={handleChange}
                />
              </div>

              <div className="modal__verify-notice">
                ℹ️ Your verification details are only visible to campus administrators.
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn btn--outline" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="submit" className="btn btn--primary">
                Submit Claim
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Claim success banner (inline, not a modal)
// ─────────────────────────────────────────────────────────────
function ClaimSuccess({ itemTitle, onDismiss }) {
  return (
    <div className="claim-success-banner" role="status">
      <span aria-hidden="true">✅</span>
      <div>
        <strong>Claim submitted!</strong> Your claim for &ldquo;{itemTitle}&rdquo; is now
        pending admin review. You&apos;ll be notified once a decision is made.
      </div>
      <button className="claim-success-banner__close" onClick={onDismiss} aria-label="Dismiss">✕</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Claims page
// ─────────────────────────────────────────────────────────────
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
  const { claims, foundItems, submitClaim } = useApp();
  const location = useLocation();

  // Pre-populate modal if navigated from Browse with a found item
  const preselectedItem = location.state?.claimItem ?? null;

  const [activeTab,     setActiveTab]     = useState('all');
  const [modalItem,     setModalItem]     = useState(preselectedItem);
  const [successBanner, setSuccessBanner] = useState(null); // item title string

  // If a new preselected item arrives via navigation state, open modal
  useEffect(() => {
    if (preselectedItem) setModalItem(preselectedItem);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = activeTab === 'all'
    ? claims
    : claims.filter(c => c.status === activeTab);

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t.key] = t.key === 'all'
      ? claims.length
      : claims.filter(c => c.status === t.key).length;
    return acc;
  }, {});

  function handleClaimSubmit(claimData) {
    submitClaim(claimData);
    setSuccessBanner(claimData.itemTitle);
    setModalItem(null);
  }

  // Helper: find the found item object for "Claim an item" selector
  const availableItems = foundItems.filter(f => f.recoveryStatus !== 'recovered');

  return (
    <>
      {/* Claim modal */}
      {modalItem && (
        <ClaimModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onSubmit={handleClaimSubmit}
        />
      )}

      <div className="claims-page">
        {/* ── Hero ────────────────────────────────────────────── */}
        <div className="claims__hero">
          <div className="container claims__hero-inner">
            <div>
              <h1 className="claims__hero-title">My Claims</h1>
              <p className="claims__hero-sub">
                Track your submitted claims and submit new ones below.
              </p>
            </div>
            {availableItems.length > 0 && (
              <div className="claims__hero-action">
                <span className="claims__hero-action-label">Found your item listed?</span>
                <select
                  className="claims__item-picker"
                  value=""
                  onChange={e => {
                    const found = availableItems.find(f => f.id === e.target.value);
                    if (found) setModalItem(found);
                  }}
                  aria-label="Select a found item to claim"
                >
                  <option value="">+ Submit a new claim…</option>
                  {availableItems.map(f => (
                    <option key={f.id} value={f.id}>{f.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <Section noPadTop>
          {/* Success banner */}
          {successBanner && (
            <ClaimSuccess
              itemTitle={successBanner}
              onDismiss={() => setSuccessBanner(null)}
            />
          )}

          {/* ── Status summary strip ─────────────────────────── */}
          <div className="claims__summary">
            {[
              { label: 'Total',    value: claims.length,                                  cls: 'summary--total'    },
              { label: 'Pending',  value: claims.filter(c=>c.status==='pending').length,  cls: 'summary--pending'  },
              { label: 'Approved', value: claims.filter(c=>c.status==='approved').length, cls: 'summary--approved' },
              { label: 'Rejected', value: claims.filter(c=>c.status==='rejected').length, cls: 'summary--rejected' },
            ].map(s => (
              <div key={s.label} className={`claims__summary-item ${s.cls}`}>
                <span className="claims__summary-value">{s.value}</span>
                <span className="claims__summary-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── Status info banners ──────────────────────────── */}
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

          {/* ── Claim cards ───────────────────────────────────── */}
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

          {/* ── Bottom CTA ──────────────────────────────────────── */}
          <div className="claims__cta">
            <p>Looking for something you lost?</p>
            <Link to="/browse" className="btn btn--primary">Browse Found Items</Link>
            <Link to="/report-lost" className="btn btn--outline">Report a Lost Item</Link>
          </div>
        </Section>
      </div>
    </>
  );
}
