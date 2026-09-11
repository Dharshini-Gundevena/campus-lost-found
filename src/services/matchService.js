/**
 * Match service  —  Level 2 automatic potential-matching
 *
 * Given a target item, scans the store for open items of the opposite type
 * that share the same category and have at least one additional signal
 * (location overlap OR nearby date).
 *
 * Scoring (deterministic, no confidence-score field):
 *   +2  location overlap  — either location string contains the other (case-insensitive)
 *   +1  nearby date       — |daysBetween| ≤ DATE_WINDOW_DAYS (default 7)
 *
 * Inclusion rule:
 *   Hard filters:  opposite type  +  same category  +  candidate status === "open"
 *   Soft minimum:  score ≥ 1  (category alone does not qualify)
 *
 * Results are sorted by score desc, then by createdAt desc, capped at MAX_RESULTS.
 */

const { listItems } = require("./itemService");

// ── Tuneable constants ────────────────────────────────────────────────────────
const DATE_WINDOW_DAYS = 7;
const MAX_RESULTS      = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns true when either location string contains the other (case-insensitive).
 * @param {string} a
 * @param {string} b
 */
const locationsOverlap = (a, b) => {
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  return al.includes(bl) || bl.includes(al);
};

/**
 * Returns the absolute number of calendar days between two YYYY-MM-DD strings.
 * Returns Infinity when either date is missing or unparseable.
 * @param {string} a
 * @param {string} b
 */
const daysBetween = (a, b) => {
  const da = new Date(a);
  const db = new Date(b);
  if (isNaN(da) || isNaN(db)) return Infinity;
  return Math.abs((da - db) / 86_400_000);
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Find potential matches for a given item.
 *
 * @param {object} target  — the item whose matches we want (full item document)
 * @returns {object[]}     — array of { item, score, signals } sorted best-first
 */
const findMatches = (target) => {
  const oppositeType = target.type === "lost" ? "found" : "lost";

  // Fetch all open items of the opposite type in the same category.
  // listItems returns { items, total }; pass a large limit so we scan everything.
  const { items: candidates } = listItems({
    type: oppositeType,
    category: target.category,
    status: "open",
    limit: 1000,
    offset: 0,
  });

  const scored = [];

  for (const candidate of candidates) {
    // Never match an item against itself (shouldn't happen given opposite type,
    // but defensive check costs nothing).
    if (candidate.id === target.id) continue;

    let score = 0;
    const signals = [];

    // Location overlap (+2)
    if (locationsOverlap(target.location, candidate.location)) {
      score += 2;
      signals.push("location_overlap");
    }

    // Nearby date (+1)
    if (daysBetween(target.date, candidate.date) <= DATE_WINDOW_DAYS) {
      score += 1;
      signals.push("nearby_date");
    }

    // Must have at least one signal to qualify
    if (score >= 1) {
      scored.push({ item: candidate, score, signals });
    }
  }

  // Sort: highest score first, then newest item first
  scored.sort((a, b) =>
    b.score - a.score ||
    new Date(b.item.createdAt) - new Date(a.item.createdAt)
  );

  return scored.slice(0, MAX_RESULTS);
};

module.exports = { findMatches, DATE_WINDOW_DAYS, MAX_RESULTS };
