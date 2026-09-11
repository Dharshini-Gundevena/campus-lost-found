import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import { ItemCard, MatchCard } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import { CATEGORIES, LOCATIONS } from '../data/staticData';
import './Browse.css';

const TABS = [
  { key: 'lost',    label: '🔍 Lost' },
  { key: 'found',   label: '📦 Found' },
  { key: 'matched', label: '✅ Matched' },
];

// ClaimModal is defined in Claims.jsx — Browse just links there via state
// so we pass the selected item through location state.

export default function Browse() {
  const { lostItems, foundItems, matches, claims } = useApp();

  const [tab,      setTab]      = useState('lost');
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [sortBy,   setSortBy]   = useState('newest');
  const [confFilter, setConfFilter] = useState('all'); // all | high | medium | low

  // ── Tab counts (live from context) ──────────────────────────
  const tabCounts = {
    lost:    lostItems.length,
    found:   foundItems.length,
    matched: matches.length,
  };

  // ── Filtered & sorted items ──────────────────────────────────
  const items = useMemo(() => {
    if (tab === 'matched') {
      let result = [...matches];
      if (confFilter !== 'all') {
        result = result.filter(m => m.confidence === confFilter);
      }
      return result.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    }

    const source = tab === 'lost' ? lostItems : foundItems;

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
  }, [tab, search, category, location, sortBy, confFilter, lostItems, foundItems, matches]);

  function clearFilters() {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setSortBy('newest');
    setConfFilter('all');
  }

  const hasActiveFilters =
    search || category !== 'All' || location !== 'All' || confFilter !== 'all';

  // ── Helper: get potential matches for a found item ───────────
  function getMatchesForFound(foundId) {
    return matches.filter(m => m.foundId === foundId);
  }

  // ── Helper: is a found item already claimed/recovered? ───────
  function isRecovered(foundItem) {
    return foundItem.recoveryStatus === 'recovered';
  }

  // ── Helper: has this found item already got a pending claim? ──
  function hasPendingClaim(foundId) {
    return claims.some(c => c.foundItemId === foundId && c.status === 'pending');
  }

  return (
    <div className="browse">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="browse__hero">
        <div className="container">
          <h1 className="browse__hero-title">Browse Items</h1>
          <p className="browse__hero-sub">
            Search through lost and found reports across campus.
          </p>
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
              <button
                className="browse__search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >✕</button>
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
                <button
                  className="browse__filters-clear btn btn--outline btn--sm"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              )}
            </div>

            {tab !== 'matched' ? (
              <>
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
              </>
            ) : (
              /* Matched tab: confidence filter */
              <div className="form-group">
                <label htmlFor="filter-conf">Confidence</label>
                <select
                  id="filter-conf"
                  value={confFilter}
                  onChange={e => setConfFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            )}

            <div className="browse__filters-cta">
              <Link
                to="/report-lost"
                className="btn btn--danger btn--sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                + Report Lost
              </Link>
              <Link
                to="/report-found"
                className="btn btn--success btn--sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
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
                  <span className="browse__tab-count">{tabCounts[t.key]}</span>
                </button>
              ))}
            </div>

            {/* Results meta */}
            <p className="browse__results-meta">
              {tab === 'matched'
                ? `${items.length} match${items.length !== 1 ? 'es' : ''} found`
                : items.length === 0
                  ? 'No items match your filters.'
                  : `Showing ${items.length} item${items.length !== 1 ? 's' : ''}`}
              {hasActiveFilters && (
                <button className="browse__inline-clear" onClick={clearFilters}>
                  &nbsp;· Clear filters
                </button>
              )}
            </p>

            {/* ── Lost tab ──────────────────────────────────── */}
            {tab === 'lost' && (
              items.length === 0 ? (
                <EmptyState
                  icon="🔍"
                  title="No lost items found"
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
                        <Link to="/report-found" className="btn btn--success btn--sm">
                          I Found This
                        </Link>
                      }
                    />
                  ))}
                </div>
              )
            )}

            {/* ── Found tab ─────────────────────────────────── */}
            {tab === 'found' && (
              items.length === 0 ? (
                <EmptyState
                  icon="📦"
                  title="No found items"
                  message="Try adjusting your search or filters."
                  action={<button className="btn btn--outline btn--sm" onClick={clearFilters}>Clear filters</button>}
                />
              ) : (
                <div className="browse__grid">
                  {items.map(item => {
                    const recovered    = isRecovered(item);
                    const pendingClaim = hasPendingClaim(item.id);
                    const itemMatches  = getMatchesForFound(item.id);

                    return (
                      <div key={item.id} className="browse__found-wrap">
                        <ItemCard
                          item={item}
                          actions={
                            recovered ? null : (
                              <Link
                                to="/claims"
                                state={{ claimItem: item }}
                                className={`btn btn--sm ${pendingClaim ? 'btn--outline' : 'btn--primary'}`}
                              >
                                {pendingClaim ? '⏳ Claim Pending' : 'Claim Item'}
                              </Link>
                            )
                          }
                        />

                        {/* Potential matches for this found item */}
                        {!recovered && itemMatches.length > 0 && (
                          <div className="browse__item-matches">
                            <p className="browse__item-matches-label">
                              🔗 {itemMatches.length} potential lost item match{itemMatches.length > 1 ? 'es' : ''}
                            </p>
                            {itemMatches.map(m => (
                              <div key={m.id} className="browse__match-mini">
                                <span className={`badge badge--${m.confidence}`}>
                                  {m.confidence.charAt(0).toUpperCase() + m.confidence.slice(1)}
                                </span>
                                <span className="browse__match-mini-title">
                                  Lost: &ldquo;{m.lostTitle}&rdquo;
                                </span>
                                <span className="browse__match-mini-pct">
                                  {Math.round((m.score ?? 0) * 100)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* ── Matched tab ───────────────────────────────── */}
            {tab === 'matched' && (
              items.length === 0 ? (
                <EmptyState
                  icon="🔗"
                  title="No matches"
                  message={confFilter !== 'all' ? `No ${confFilter}-confidence matches.` : 'No matches computed yet.'}
                  action={confFilter !== 'all' && (
                    <button className="btn btn--outline btn--sm" onClick={() => setConfFilter('all')}>
                      Show all confidence levels
                    </button>
                  )}
                />
              ) : (
                <>
                  {/* Confidence summary strip */}
                  <div className="browse__conf-summary">
                    {['high', 'medium', 'low'].map(lvl => {
                      const count = matches.filter(m => m.confidence === lvl).length;
                      return (
                        <button
                          key={lvl}
                          className={`browse__conf-chip ${confFilter === lvl ? 'browse__conf-chip--active' : ''}`}
                          onClick={() => setConfFilter(confFilter === lvl ? 'all' : lvl)}
                        >
                          <span className={`badge badge--${lvl}`}>
                            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                          </span>
                          <span>{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="browse__grid">
                    {items.map(m => <MatchCard key={m.id} match={m} />)}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
