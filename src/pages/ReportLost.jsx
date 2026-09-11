import { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { useApp } from '../context/AppContext';
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
  brand: '',
};

export default function ReportLost() {
  const { addLostItem } = useApp();

  const [form, setForm]           = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const item = {
      id:          `l-${Date.now()}`,
      type:        'lost',
      title:       form.title,
      category:    form.category,
      location:    form.location,
      date:        form.date,
      description: form.description,
      contact:     form.contact,
      color:       form.color,
      brand:       form.brand,
    };

    // Add to global state — context will auto-compute matches
    addLostItem(item);
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
          <h2 className="report-success__title">Report Submitted!</h2>
          <p className="report-success__msg">
            Your lost item report has been received. We'll notify you if a match is found.
          </p>
          <div className="report-success__actions">
            <button className="btn btn--primary" onClick={handleReset}>Submit Another</button>
            <Link to="/browse" className="btn btn--outline">Browse Found Items</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Section
      title="Report a Lost Item"
      subtitle="Fill in as many details as possible to help us find a match."
    >
      <div className="report-layout">
        {/* ── Form ─────────────────────────────────────────── */}
        <form className="report-form" onSubmit={handleSubmit} noValidate>
          <div className="report-form__section-label">Item Details</div>

          <div className="form-group">
            <label htmlFor="title">Item Name <span aria-hidden="true">*</span></label>
            <input
              id="title" name="title" type="text" required
              placeholder="e.g. Blue North Face Backpack"
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
                placeholder="e.g. Navy blue with red strap"
                value={form.color} onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand / Make</label>
            <input
              id="brand" name="brand" type="text"
              placeholder="e.g. Apple, Nike, unknown…"
              value={form.brand} onChange={handleChange}
            />
          </div>

          <div className="report-form__section-label">Where &amp; When</div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Last Known Location <span aria-hidden="true">*</span></label>
              <select id="location" name="location" required value={form.location} onChange={handleChange}>
                <option value="">Select location…</option>
                {LOCATIONS.filter(l => l !== 'All').map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date Lost <span aria-hidden="true">*</span></label>
              <input
                id="date" name="date" type="date" required
                value={form.date} onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span aria-hidden="true">*</span></label>
            <textarea
              id="description" name="description" required
              placeholder="Describe identifying features, contents, markings…"
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
            <button type="submit" className="btn btn--danger">
              🔍 Submit Lost Report
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
              <li>Include unique identifiers (serial numbers, initials, stickers).</li>
              <li>Describe the exact location as precisely as possible.</li>
              <li>Add the approximate time of loss, not just the date.</li>
              <li>Mention any distinctive colours, brands, or damage.</li>
            </ul>
          </div>
          <div className="report-tips__card report-tips__card--info">
            <h3 className="report-tips__heading">📋 What Happens Next?</h3>
            <ol className="report-tips__list report-tips__list--numbered">
              <li>Your report is added to the lost items board.</li>
              <li>The system scans found items for potential matches.</li>
              <li>You'll be notified by email if a match is found.</li>
              <li>Visit the campus office to confirm and collect.</li>
            </ol>
          </div>
        </aside>
      </div>
    </Section>
  );
}
