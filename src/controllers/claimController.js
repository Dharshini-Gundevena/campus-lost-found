/**
 * Claim controller
 *
 * Handles request parsing, validation, and HTTP response shaping for claims.
 * All business/data logic is delegated to claimService.
 */

const {
  submitClaim,
  listClaimsByItem,
  getClaimById,
  listAllClaims,
  updateClaimStatus,
} = require("../services/claimService");

const { CLAIM_STATUSES } = require("../models/claimModel");

// ── Validation ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate POST /items/:itemId/claims body.
 * @param {object} body
 * @returns {string[]} Array of error messages (empty = valid)
 */
const validateClaimBody = (body) => {
  const errors = [];

  if (!body.claimantName || typeof body.claimantName !== "string" || body.claimantName.trim().length === 0)
    errors.push('"claimantName" is required and must be a non-empty string');

  if (!body.claimantEmail || !EMAIL_RE.test(body.claimantEmail.trim()))
    errors.push('"claimantEmail" is required and must be a valid email address');

  if (!body.message || typeof body.message !== "string" || body.message.trim().length === 0)
    errors.push('"message" is required and must be a non-empty string');
  else if (body.message.trim().length > 1000)
    errors.push('"message" must not exceed 1000 characters');

  return errors;
};

// ── Handlers ──────────────────────────────────────────────────────────────────

/**
 * POST /items/:itemId/claims
 * Submit a claim against a lost or found item report.
 */
const submitClaimHandler = (req, res, next) => {
  try {
    const errors = validateClaimBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ status: "error", errors });
    }

    const { claimantName, claimantEmail, claimantPhone, message } = req.body;
    const result = submitClaim(req.params.itemId, {
      claimantName,
      claimantEmail,
      claimantPhone: claimantPhone ?? null,
      message,
    });

    if (result.error) {
      return res.status(result.code).json({ status: "error", errors: [result.error] });
    }

    return res.status(201).json({ status: "success", data: result.claim });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /items/:itemId/claims
 * List all claims for a specific item report, newest first.
 */
const listClaimsHandler = (req, res, next) => {
  try {
    const result = listClaimsByItem(req.params.itemId);

    if (result.error) {
      return res.status(result.code).json({ status: "error", errors: [result.error] });
    }

    return res.status(200).json({
      status: "success",
      count: result.claims.length,
      data: result.claims,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /claims/:id
 * Retrieve a single claim by its ID.
 */
const getClaimHandler = (req, res, next) => {
  try {
    const claim = getClaimById(req.params.id);
    if (!claim) {
      return res.status(404).json({
        status: "error",
        errors: [`Claim with id "${req.params.id}" not found`],
      });
    }
    return res.status(200).json({ status: "success", data: claim });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /claims/:id/status
 * Update a claim's status: pending → approved | rejected.
 *
 * Body: { "status": "approved" | "rejected" | "pending" }
 */
const patchClaimStatusHandler = (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !CLAIM_STATUSES.includes(status)) {
      return res.status(400).json({
        status: "error",
        errors: [`"status" is required and must be one of: ${CLAIM_STATUSES.join(", ")}`],
      });
    }

    const result = updateClaimStatus(req.params.id, status);
    if (result.error) {
      return res.status(result.code).json({ status: "error", errors: [result.error] });
    }

    return res.status(200).json({ status: "success", data: result.claim });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /claims
 * List all claims across all items.
 *
 * Query params (all optional):
 *   status   "pending" | "approved" | "rejected"
 *   itemId   scope to a specific item
 */
const listAllClaimsHandler = (req, res, next) => {
  try {
    const { status, itemId } = req.query;

    if (status && !CLAIM_STATUSES.includes(status)) {
      return res.status(400).json({
        status: "error",
        errors: [`"status" filter must be one of: ${CLAIM_STATUSES.join(", ")}`],
      });
    }

    const claims = listAllClaims({ status, itemId });

    return res.status(200).json({
      status: "success",
      count: claims.length,
      data: claims,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitClaimHandler,
  listClaimsHandler,
  getClaimHandler,
  patchClaimStatusHandler,
  listAllClaimsHandler,
};
