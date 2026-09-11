import { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { MatchCard } from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { CATEGORIES, LOCATIONS } from '../data/staticData';
import { computeMatches } from '../utils/matcher';
import './ReportForm.css';

const INITIAL = {
  title: '',
  category: '',
  location: '',
  date: '',
  description: '',
  contact: '',
  color: '',
  storedAt: '',
};

export default function ReportFound() {
  const { lostItems, addFoundItem } = useApp();

  const [form, setForm]             = useState(INITIAL);
  const [submitted, setSubmitted]   = useState(false);
  const [newItem, setNewItem]       = useState(null);
  const [autoMatches, setAutoMatches] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const item = {
      id:             `f-${Date.now()}`,
      type:           'found',
      title:          form.title,
      category:       form.category,
      location:       form.location,
      date:           form.date,
      description:    form.description,
      contact:        form.contact,
      color:          form.color,
      storedAt:       form.storedAt,
      recoveryStatus: null,
      claimedBy:      null,
    };

    // Compute matches BEFORE adding to context so we can display them
    const matches = computeMatches(lostItems, [item]);
    setAutoMatches(matches);

    // Add to global state (also triggers notifications for high/medium matches)
    addFoundItem(item);

    setNewItem(item);
    setSubmitted(true);
  }

  function handleReset() {
    setForm(INITIAL);
    setSubmitted(false);
    setNewItem(null);
    setAutoMatches([]);
  }

  // ── Success / match results screen ──────────────────────────
  if (submitted) {
    return (
      <div className="report-success-page">
        <div className="container">
          {/* Thank-you banner */}
          <div className="report-success">
            <div className="report-success__inner">
              <span className="report-success__icon" aria-hidden="true">✅</span>
              <h2 className="report-success__title">Thank You!</h2>
              <p className="report-success__msg">
                Your found item report for <strong>"{newItem?.title}"</strong> has been submitted.
                The owner will be notified if we find a match.
              </p>
              <div className="report-success__actions">
                <button className="btn btn--primary" onClick={handleReset}>
                  Submit Another
                </button>
                <Link to="/browse" className="btn btn--outline">Browse Lost Items</Link>
              </div>
            </div>
          </div>

          {/* Auto-match results */}
          {autoMatches.length > 0 ? (
            <div className="report-matches">
              <div className="report-matches__header">
                <span className="report-matches__icon" aria-hidden="true">🔗</span>
                <div>
                  <h3 className="report-matches__title">
                    {autoMatches.length} Potential Match{autoMatches.length > 1 ? 'es' : ''} Found Automatically
                  </h3>
                  <p className="report-matches__sub">
                    The system compared your report against all lost items and found the following matches.
                    The owner(s) will be notified.
                  </p>
                </div>
              </div>

              <div className="report-matches__grid">
                {autoMatches.map(m => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>

              <p className="report-matches__note">
                📌 Matches are ranked by confidence. Campus staff will verify before contacting claimants.
              </p>
            </div>
          ) : (
            <div className="report-matches report-matches--none">
              <span aria-hidden="true">🔍</span>
              <p>No automatic matches found yet. Your report is live — we'll notify you if a match comes in.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────
  return (
    <Section
      title="Report a Found Item"
      subtitle="Help reunite someone with their belongings by logging what you found."
    >
      <div className="report-layout">
        {/* Form */}
        <form className="report-form" onSubmit={handleSubmit} noValidate>
          <div className="report-form__section-label">Item Details</div>

          <div className="form-group">
            <label htmlFor="title">Item Name <span aria-hidden="true">*</span></label>
            <input
              id="title" name="title" type="text" required
              placeholder="e.g. Silver MacBook Charger"
              value={form.title} onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category <span aria-hidden="true">*</span></label>
              <select id="category" name="category" required value={form.category} onChange={handleChange}>
                <option value="">Select category…</option>
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="color">Colour / Appearance</label>
              <input
                id="color" name="color" type="text"
                placeholder="e.g. Silver, white cable"
                value={form.color} onChange={handleChange}
              />
            </div>
          </div>

          <div className="report-form__section-label">Where &amp; When</div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Found Location <span aria-hidden="true">*</span></label>
              <select id="location" name="location" required value={form.location} onChange={handleChange}>
                <option value="">Select location…</option>
                {LOCATIONS.filter(l => l !== 'All').map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date Found <span aria-hidden="true">*</span></label>
              <input
                id="date" name="date" type="date" required
                value={form.date} onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="storedAt">Currently Stored At</label>
            <input
              id="storedAt" name="storedAt" type="text"
              placeholder="e.g. Library front desk, Security office…"
              value={form.storedAt} onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span aria-hidden="true">*</span></label>
            <textarea
              id="description" name="description" required
              placeholder="Describe the item — colour, brand, markings, condition…"
              value={form.description} onChange={handleChange}
            />
          </div>

          <div className="report-form__section-label">Contact</div>

          <div className="form-group">
            <label htmlFor="contact">Your Email <span aria-hidden="true">*</span></label>
            <input
              id="contact" name="contact" type="email" required
              placeholder="you@university.edu"
              value={form.contact} onChange={handleChange}
            />
          </div>

          <div className="report-form__footer">
            <button type="submit" className="btn btn--success">
              🤝 Submit Found Report
            </button>
            <button type="button" className="btn btn--outline" onClick={handleReset}>
              Clear
            </button>
          </div>
        </form>

        {/* Sidebar tips */}
        <aside className="report-tips">
          <div className="report-tips__card">
            <h3 className="report-tips__heading">💡 Tips for a Better Report</h3>
            <ul className="report-tips__list">
              <li>Note exactly where you found the item.</li>
              <li>Do not go through personal contents of wallets or bags.</li>
              <li>Hand in valuables to the nearest campus security desk.</li>
              <li>Take a photo before handing it in if possible.</li>
            </ul>
          </div>
          <div className="report-tips__card report-tips__card--info">
            <h3 className="report-tips__heading">🔗 Auto-Matching</h3>
            <p style={{ fontSize: '.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              After you submit, the system automatically compares your report
              against all active lost items and shows you any potential matches
              with a confidence score.
            </p>
          </div>
          <div className="report-tips__card report-tips__card--info">
            <h3 className="report-tips__heading">📋 What Happens Next?</h3>
            <ol className="report-tips__list report-tips__list--numbered">
              <li>Your report is listed on the found items board.</li>
              <li>The system checks for matching lost reports.</li>
              <li>The owner is notified and asked to submit a claim.</li>
              <li>Campus staff verify the claim before release.</li>
            </ol>
          </div>
        </aside>
      </div>
    </Section>
  );
}
