/**
 * Claim service
 *
 * All data-access logic for claim records.
 * Backed by an in-memory Map — the same pattern as itemService — so the server
 * runs without external dependencies. Replace the Map operations with DynamoDB
 * SDK calls here when the time comes; nothing else needs to change.
 */

const { v4: uuidv4 } = require("uuid");
const { createClaim, CLAIM_STATUSES } = require("../models/claimModel");
const { getItemById } = require("./itemService");

// ── In-memory store ───────────────────────────────────────────────────────────
// Key: claim.id (string)  Value: claim document (object)
const claimStore = new Map();

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Submit a new claim against an existing item report.
 *
 * @param {string} itemId
 * @param {object} data - Validated fields from the controller
 * @returns {{ claim: object }|{ error: string, code: number }}
 */
const submitClaim = (itemId, data) => {
  const item = getItemById(itemId);
  if (!item) {
    return { error: `Item with id "${itemId}" not found`, code: 404 };
  }
  if (item.status === "resolved") {
    return { error: "Cannot submit a claim on a resolved item", code: 409 };
  }

  const id = uuidv4();
  const claim = createClaim({ id, itemId, ...data });
  claimStore.set(id, claim);
  return { claim };
};

/**
 * Return all claims for a given item, newest first.
 *
 * @param {string} itemId
 * @returns {{ claims: object[] }|{ error: string, code: number }}
 */
const listClaimsByItem = (itemId) => {
  const item = getItemById(itemId);
  if (!item) {
    return { error: `Item with id "${itemId}" not found`, code: 404 };
  }

  const claims = Array.from(claimStore.values())
    .filter((c) => c.itemId === itemId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { claims };
};

/**
 * Retrieve a single claim by its own ID.
 *
 * @param {string} id
 * @returns {object|null}
 */
const getClaimById = (id) => claimStore.get(id) ?? null;

/**
 * List all claims across all items, with optional filters.
 *
 * Filters (all optional, combinable):
 *   status   "pending" | "approved" | "rejected"
 *   itemId   exact match — scopes results to one item
 *
 * Results are sorted newest first.
 *
 * @param {object} filters
 * @returns {object[]}
 */
const listAllClaims = (filters = {}) => {
  const { status, itemId } = filters;

  let results = Array.from(claimStore.values());

  if (status) results = results.filter((c) => c.status === status);
  if (itemId) results = results.filter((c) => c.itemId === itemId);

  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return results;
};

/**
 * Update the status of a claim (pending → approved | rejected).
 *
 * @param {string} id
 * @param {string} status - One of CLAIM_STATUSES
 * @returns {{ claim: object }|{ error: string, code: number }}
 */
const updateClaimStatus = (id, status) => {
  const claim = claimStore.get(id);
  if (!claim) {
    return { error: `Claim with id "${id}" not found`, code: 404 };
  }
  if (!CLAIM_STATUSES.includes(status)) {
    return {
      error: `"status" must be one of: ${CLAIM_STATUSES.join(", ")}`,
      code: 400,
    };
  }

  const updated = { ...claim, status, updatedAt: new Date().toISOString() };
  claimStore.set(id, updated);
  return { claim: updated };
};

module.exports = { submitClaim, listClaimsByItem, getClaimById, listAllClaims, updateClaimStatus };
