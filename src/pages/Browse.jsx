import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { ItemCard, MatchCard } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { LOST_ITEMS, FOUND_ITEMS, MATCHED_ITEMS, CATEGORIES, LOCATIONS } from '../data/staticData';
import './Browse.css';

const TABS = [
  { key: 'lost',    label: '🔍 Lost',    count: LOST_ITEMS.length },
  { key: 'found',   label: '🤝 Found',   count: FOUND_ITEMS.length },
  { key: 'matched', label: '✅ Matched', count: MATCHED_ITEMS.length },
];

export default function Browse() {
  const [tab,      setTab]      = useState('lost');
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [sortBy,   setSortBy]   = useState('newest');

  // ── Filtered & sorted items ──────────────────────────────
  const items = useMemo(() => {
    const source = tab === 'lost' ? LOST_ITEMS : tab === 'found' ? FOUND_ITEMS : MATCHED_ITEMS;

    if (tab === 'matched') return source;

    let result = source.filter(item => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      const matchCat = category === 'All' || item.category === category;
      const matchLoc = location === 'All' || item.location.startsWith(location);

      return matchSearch && matchCat && matchLoc;
    });

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => b.date.localeCompare(a.date));
    } else if (sortBy === 'oldest') {
      result = [...result].sort((a, b) => a.date.localeCompare(b.date));
    } else if (sortBy === 'az') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [tab, search, category, location, sortBy]);

  function clearFilters() {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setSortBy('newest');
  }

  const hasActiveFilters = search || category !== 'All' || location !== 'All';

  return (
    <div className="browse">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="browse__hero">
        <div className="container">
          <h1 className="browse__hero-title">Browse Items</h1>
          <p className="browse__hero-sub">
            Search through lost and found reports across campus.
          </p>

          {/* Search bar */}
          <div className="browse__search-wrap">
            <span className="browse__search-icon" aria-hidden="true">🔎</span>
            <input
              className="browse__search"
              type="search"
              placeholder="Search by name, description, or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search items"
            />
            {search && (
              <button className="browse__search-clear" onClick={() => setSearch('')} aria-label="Clear search">✕</button>
            )}
          </div>
        </div>
      </div>

      <Section noPadTop>
        <div className="browse__layout">
          {/* ── Sidebar filters ─────────────────────────────── */}
          <aside className="browse__filters">
            <div className="browse__filters-header">
              <span className="browse__filters-title">Filters</span>
              {hasActiveFilters && (
                <button className="browse__filters-clear btn btn--outline btn--sm" onClick={clearFilters}>
                  Clear all
                </button>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="filter-category">Category</label>
              <select
                id="filter-category"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="filter-location">Location</label>
              <select
                id="filter-location"
                value={location}
                onChange={e => setLocation(e.target.value)}
              >
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="filter-sort">Sort By</label>
              <select
                id="filter-sort"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="az">A → Z</option>
              </select>
            </div>

            <div className="browse__filters-cta">
              <Link to="/report-lost"  className="btn btn--danger  btn--sm" style={{ width: '100%', justifyContent: 'center' }}>
                + Report Lost
              </Link>
              <Link to="/report-found" className="btn btn--success btn--sm" style={{ width: '100%', justifyContent: 'center' }}>
                + Report Found
              </Link>
            </div>
          </aside>

          {/* ── Main content ────────────────────────────────── */}
          <div className="browse__main">
            {/* Tabs */}
            <div className="browse__tabs" role="tablist">
              {TABS.map(t => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  className={`browse__tab ${tab === t.key ? 'browse__tab--active' : ''}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                  <span className="browse__tab-count">{t.count}</span>
                </button>
              ))}
            </div>

            {/* Results meta */}
            {tab !== 'matched' && (
              <p className="browse__results-meta">
                {items.length === 0
                  ? 'No items match your filters.'
                  : `Showing ${items.length} item${items.length !== 1 ? 's' : ''}`}
                {hasActiveFilters && (
                  <button className="browse__inline-clear" onClick={clearFilters}>
                    &nbsp;· Clear filters
                  </button>
                )}
              </p>
            )}

            {/* Cards */}
            {tab === 'matched' ? (
              <div className="browse__grid">
                {MATCHED_ITEMS.map(m => <MatchCard key={m.id} match={m} />)}
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={tab === 'lost' ? '🔍' : '📦'}
                title="No items found"
                message="Try adjusting your search or filters."
                action={<button className="btn btn--outline btn--sm" onClick={clearFilters}>Clear filters</button>}
              />
            ) : (
              <div className="browse__grid">
                {items.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    actions={
                      <Link
                        to={tab === 'lost' ? '/report-found' : '/claims'}
                        className={`btn btn--sm ${tab === 'lost' ? 'btn--success' : 'btn--primary'}`}
                      >
                        {tab === 'lost' ? 'I Found This' : 'Claim Item'}
                      </Link>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
