/**
 * AppContext.jsx
 * ──────────────────────────────────────────────────────────────
 * Single shared-state store for the entire application.
 * All Level 2 features (matching, claims, notifications, recovery)
 * read and write through this context.
 *
 * Architecture note:
 *   - Seeded from staticData.js on first render.
 *   - All mutations are pure (immutable updates via map/filter/spread).
 *   - No external dependencies — drop-in ready for a real API later.
 */

import { createContext, useContext, useReducer, useMemo } from 'react';
import {
  LOST_ITEMS,
  FOUND_ITEMS,
  MATCHED_ITEMS,
  CLAIMS,
  NOTIFICATIONS,
} from '../data/staticData';
import { computeMatches } from '../utils/matcher';

// ── Initial state ─────────────────────────────────────────────
function buildInitialState() {
  // Seed the matcher against the static items so we start with
  // computed matches (merged with the existing MATCHED_ITEMS stubs).
  const computed = computeMatches(LOST_ITEMS, FOUND_ITEMS);

  // Merge: keep static entries that have no computed equivalent,
  // add any newly computed ones.
  const staticIds = new Set(MATCHED_ITEMS.map(m => m.id));
  const newMatches = computed.filter(m => !staticIds.has(m.id));

  return {
    lostItems:     LOST_ITEMS,
    foundItems:    FOUND_ITEMS,
    matches:       [...MATCHED_ITEMS, ...newMatches],
    claims:        CLAIMS,
    notifications: NOTIFICATIONS,
  };
}

// ── Action types ──────────────────────────────────────────────
const A = {
  ADD_LOST_ITEM:    'ADD_LOST_ITEM',
  ADD_FOUND_ITEM:   'ADD_FOUND_ITEM',
  SUBMIT_CLAIM:     'SUBMIT_CLAIM',
  APPROVE_CLAIM:    'APPROVE_CLAIM',
  REJECT_CLAIM:     'REJECT_CLAIM',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_READ:        'MARK_READ',
  MARK_ALL_READ:    'MARK_ALL_READ',
  DISMISS_NOTIF:    'DISMISS_NOTIF',
  RECOMPUTE_MATCHES:'RECOMPUTE_MATCHES',
};

// ── Reducer ───────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    // ── Reports ───────────────────────────────────────────────
    case A.ADD_LOST_ITEM: {
      const newLost = [...state.lostItems, action.item];
      const newMatches = computeMatches(newLost, state.foundItems);
      const existingIds = new Set(state.matches.map(m => m.id));
      const brand_new = newMatches.filter(m => !existingIds.has(m.id));
      return {
        ...state,
        lostItems: newLost,
        matches: [...state.matches, ...brand_new],
      };
    }

    case A.ADD_FOUND_ITEM: {
      const newFound = [...state.foundItems, action.item];
      const newMatches = computeMatches(state.lostItems, newFound);
      const existingIds = new Set(state.matches.map(m => m.id));
      const brand_new = newMatches.filter(m => !existingIds.has(m.id));
      // Notifications for high/medium matches
      const matchNotifs = brand_new
        .filter(m => m.confidence !== 'low')
        .map(m => makeNotif(
          'match',
          `Potential match found: "${m.lostTitle}" may match the newly reported "${m.foundTitle}" (${m.confidence} confidence).`,
        ));
      return {
        ...state,
        foundItems: newFound,
        matches: [...state.matches, ...brand_new],
        notifications: [...matchNotifs, ...state.notifications],
      };
    }

    // ── Claims ────────────────────────────────────────────────
    case A.SUBMIT_CLAIM: {
      const claim = action.claim;
      // Deduplicate: one pending claim per found item per claimant
      const alreadyExists = state.claims.some(
        c => c.foundItemId === claim.foundItemId &&
             c.claimant === claim.claimant &&
             c.status === 'pending'
      );
      if (alreadyExists) return state;
      return {
        ...state,
        claims: [claim, ...state.claims],
      };
    }

    case A.APPROVE_CLAIM: {
      const { claimId } = action;
      const claim = state.claims.find(c => c.id === claimId);
      if (!claim) return state;

      // Mark claim approved
      const updatedClaims = state.claims.map(c =>
        c.id === claimId ? { ...c, status: 'approved', resolvedOn: today() } : c
      );

      // Mark found item as recovered
      const updatedFound = state.foundItems.map(f =>
        f.id === claim.foundItemId ? { ...f, recoveryStatus: 'recovered', claimedBy: claim.claimant } : f
      );

      // Reject all OTHER pending claims for the same found item
      const finalClaims = updatedClaims.map(c =>
        (c.foundItemId === claim.foundItemId && c.id !== claimId && c.status === 'pending')
          ? { ...c, status: 'rejected', resolvedOn: today() }
          : c
      );

      // Notification to claimant
      const notif = makeNotif(
        'claim_approved',
        `Your claim for "${claim.itemTitle}" has been approved! Visit the campus office to collect your item.`,
      );

      return {
        ...state,
        claims: finalClaims,
        foundItems: updatedFound,
        notifications: [notif, ...state.notifications],
      };
    }

    case A.REJECT_CLAIM: {
      const { claimId, reason } = action;
      const claim = state.claims.find(c => c.id === claimId);
      if (!claim) return state;

      const updatedClaims = state.claims.map(c =>
        c.id === claimId ? { ...c, status: 'rejected', rejectReason: reason || '', resolvedOn: today() } : c
      );

      const notif = makeNotif(
        'claim_rejected',
        `Your claim for "${claim.itemTitle}" was not approved. ${reason ? 'Reason: ' + reason : 'Please contact the campus office for details.'}`,
      );

      return {
        ...state,
        claims: updatedClaims,
        notifications: [notif, ...state.notifications],
      };
    }

    // ── Notifications ─────────────────────────────────────────
    case A.ADD_NOTIFICATION:
      return { ...state, notifications: [action.notif, ...state.notifications] };

    case A.MARK_READ:
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      };

    case A.MARK_ALL_READ:
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };

    case A.DISMISS_NOTIF:
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.id) };

    // ── Re-run matcher manually (e.g. after bulk import) ──────
    case A.RECOMPUTE_MATCHES: {
      const fresh = computeMatches(state.lostItems, state.foundItems);
      const existingIds = new Set(state.matches.map(m => m.id));
      const brand_new = fresh.filter(m => !existingIds.has(m.id));
      return { ...state, matches: [...state.matches, ...brand_new] };
    }

    default:
      return state;
  }
}

// ── Helpers ───────────────────────────────────────────────────
let _notifCounter = 1000;

function makeNotif(type, message) {
  return {
    id: `notif-${Date.now()}-${_notifCounter++}`,
    type,
    message,
    time: 'just now',
    read: false,
  };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Context ───────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, buildInitialState);

  // Memoised derived values
  const unreadCount = useMemo(
    () => state.notifications.filter(n => !n.read).length,
    [state.notifications]
  );

  const pendingClaimsCount = useMemo(
    () => state.claims.filter(c => c.status === 'pending').length,
    [state.claims]
  );

  // ── Action creators ───────────────────────────────────────
  function addLostItem(item) {
    dispatch({ type: A.ADD_LOST_ITEM, item });
  }

  function addFoundItem(item) {
    dispatch({ type: A.ADD_FOUND_ITEM, item });
  }

  function submitClaim(claimData) {
    const claim = {
      id: `c-${Date.now()}`,
      ...claimData,
      submittedOn: today(),
      status: 'pending',
    };
    dispatch({ type: A.SUBMIT_CLAIM, claim });
    return claim.id;
  }

  function approveClaim(claimId) {
    dispatch({ type: A.APPROVE_CLAIM, claimId });
  }

  function rejectClaim(claimId, reason = '') {
    dispatch({ type: A.REJECT_CLAIM, claimId, reason });
  }

  function addNotification(type, message) {
    dispatch({ type: A.ADD_NOTIFICATION, notif: makeNotif(type, message) });
  }

  function markRead(id)    { dispatch({ type: A.MARK_READ, id }); }
  function markAllRead()   { dispatch({ type: A.MARK_ALL_READ }); }
  function dismissNotif(id){ dispatch({ type: A.DISMISS_NOTIF, id }); }

  function recomputeMatches() { dispatch({ type: A.RECOMPUTE_MATCHES }); }

  const value = {
    // State
    lostItems:         state.lostItems,
    foundItems:        state.foundItems,
    matches:           state.matches,
    claims:            state.claims,
    notifications:     state.notifications,
    unreadCount,
    pendingClaimsCount,
    // Actions
    addLostItem,
    addFoundItem,
    submitClaim,
    approveClaim,
    rejectClaim,
    addNotification,
    markRead,
    markAllRead,
    dismissNotif,
    recomputeMatches,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** Hook — throws a clear error if used outside <AppProvider> */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
