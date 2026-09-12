/**
 * matcher.js
 * ──────────────────────────────────────────────────────────────
 * Automatic matching engine for lost ↔ found items.
 *
 * Scoring is intentionally transparent and easy to modify:
 * each signal contributes a named points value; the total is
 * divided by MAX_SCORE to produce a 0–1 confidence float.
 *
 * Scoring signals (max 100 pts):
 *   Category exact match          → 30 pts
 *   Keyword overlap (title/desc)  → up to 30 pts
 *   Location similarity           → up to 20 pts
 *   Date proximity (within 7d)    → up to 20 pts
 */

// ── Weights (easy to tune) ────────────────────────────────────
const WEIGHTS = {
  CATEGORY_EXACT:   30,
  KEYWORD_MAX:      30,
  LOCATION_MAX:     20,
  DATE_MAX:         20,
};
const MAX_SCORE = Object.values(WEIGHTS).reduce((a, b) => a + b, 0); // 100

// ── Helpers ──────────────────────────────────────────────────

/** Tokenise a string into lowercase words, stripping punctuation. */
function tokenise(str) {
  if (!str) return new Set();
  return new Set(
    str.toLowerCase()
       .replace(/[^a-z0-9\s]/g, ' ')
       .split(/\s+/)
       .filter(w => w.length > 2)           // drop tiny words
  );
}

/** Count shared tokens between two Sets. */
function tokenOverlap(setA, setB) {
  let count = 0;
  for (const t of setA) { if (setB.has(t)) count++; }
  return count;
}

/** Normalise a location string to its first significant segment. */
function normaliseLocation(loc) {
  if (!loc) return '';
  return loc.toLowerCase().split(/[–\-,]/)[0].trim();
}

/** Days between two ISO date strings.  Returns Infinity on bad input. */
function daysBetween(a, b) {
  const da = Date.parse(a);
  const db = Date.parse(b);
  if (isNaN(da) || isNaN(db)) return Infinity;
  return Math.abs(da - db) / 86_400_000;
}

// ── Core scorer ──────────────────────────────────────────────

/**
 * scorePair(lost, found)
 *
 * Returns { score: number (0–1), points: number, reasons: string[] }
 */
export function scorePair(lost, found) {
  let points = 0;
  const reasons = [];

  // 1. Category
  if (lost.category && found.category &&
      lost.category.toLowerCase() === found.category.toLowerCase()) {
    points += WEIGHTS.CATEGORY_EXACT;
    reasons.push(`Same category: ${lost.category}`);
  }

  // 2. Keyword overlap across title + description
  const lostTokens  = new Set([...tokenise(lost.title),  ...tokenise(lost.description)]);
  const foundTokens = new Set([...tokenise(found.title), ...tokenise(found.description)]);
  const shared = tokenOverlap(lostTokens, foundTokens);

  if (shared > 0) {
    // Scale: 1 shared word → 10pts, 2 → 20pts, 3+ → 30pts (capped)
    const kwPts = Math.min(shared * 10, WEIGHTS.KEYWORD_MAX);
    points += kwPts;
    const sample = [...lostTokens].filter(t => foundTokens.has(t)).slice(0, 3);
    reasons.push(`Shared keywords: "${sample.join('", "')}"`);
  }

  // 3. Location similarity
  const lostLoc  = normaliseLocation(lost.location);
  const foundLoc = normaliseLocation(found.location);
  if (lostLoc && foundLoc) {
    if (lostLoc === foundLoc) {
      points += WEIGHTS.LOCATION_MAX;
      reasons.push(`Same location: ${lost.location}`);
    } else {
      // Partial: one contains the other
      const partial = lostLoc.includes(foundLoc) || foundLoc.includes(lostLoc);
      if (partial) {
        points += Math.round(WEIGHTS.LOCATION_MAX * 0.5);
        reasons.push(`Similar location: "${lost.location}" ↔ "${found.location}"`);
      }
    }
  }

  // 4. Date proximity
  const days = daysBetween(lost.date, found.date);
  if (days <= 1) {
    points += WEIGHTS.DATE_MAX;
    reasons.push('Found within 1 day of loss');
  } else if (days <= 3) {
    points += Math.round(WEIGHTS.DATE_MAX * 0.75);
    reasons.push(`Found ${Math.round(days)} days after loss`);
  } else if (days <= 7) {
    points += Math.round(WEIGHTS.DATE_MAX * 0.5);
    reasons.push(`Found within a week (${Math.round(days)} days)`);
  }

  const score = points / MAX_SCORE;

  return { score: Math.min(score, 1), points, reasons };
}

// ── Confidence label ─────────────────────────────────────────

/**
 * Returns 'high' | 'medium' | 'low' based on score.
 * Thresholds are intentionally loose — can be tuned here.
 */
export function confidenceLabel(score) {
  if (score >= 0.60) return 'high';
  if (score >= 0.30) return 'medium';
  return 'low';
}

// ── Main API ─────────────────────────────────────────────────

/**
 * computeMatches(lostItems, foundItems, minScore?)
 *
 * Cross-joins every lost item with every found item and returns
 * all pairs whose score >= minScore (default 0.20), sorted
 * descending by score.
 *
 * Returns Array<{
 *   id: string,
 *   type: 'matched',
 *   lostId: string,
 *   foundId: string,
 *   lostTitle: string,
 *   foundTitle: string,
 *   score: number,
 *   confidence: 'high' | 'medium' | 'low',
 *   reasons: string[],
 *   matchedOn: string,          // ISO date today
 *   status: 'pending_confirmation',
 * }>
 */
export function computeMatches(lostItems, foundItems, minScore = 0.20) {
  const today = new Date().toISOString().slice(0, 10);
  const results = [];

  for (const lost of lostItems) {
    // skip items already recovered
    if (lost.recoveryStatus === 'recovered') continue;

    for (const found of foundItems) {
      // skip found items already claimed/recovered
      if (found.recoveryStatus === 'recovered') continue;

      const { score, reasons } = scorePair(lost, found);
      if (score < minScore) continue;

      results.push({
        id: `m-${lost.id}-${found.id}`,
        type: 'matched',
        lostId:      lost.id,
        foundId:     found.id,
        lostTitle:   lost.title,
        foundTitle:  found.title,
        score,
        confidence:  confidenceLabel(score),
        reasons,
        matchedOn:   today,
        status:      'pending_confirmation',
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
