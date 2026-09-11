import { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { CATEGORIES, LOCATIONS } from '../data/staticData';
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
  const [form, setForm]           = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Static UI only — no real submission
    setSubmitted(true);
  }

  function handleReset() {
    setForm(INITIAL);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="report-success">
        <div className="container report-success__inner">
          <span className="report-success__icon" aria-hidden="true">✅</span>
          <h2 className="report-success__title">Thank You!</h2>
          <p className="report-success__msg">
            Your found item report has been submitted. The owner will be notified if we find a match.
          </p>
          <div className="report-success__actions">
            <button className="btn btn--primary" onClick={handleReset}>Submit Another</button>
            <Link to="/browse" className="btn btn--outline">Browse Lost Items</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Section
      title="Report a Found Item"
      subtitle="Help reunite someone with their belongings by logging what you found."
    >
      <div className="report-layout">
        {/* ── Form ─────────────────────────────────────────── */}
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

        {/* ── Sidebar tips ─────────────────────────────────── */}
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
