/**
 * Claim model
 *
 * Defines the shape, allowed values, and factory function for a claim/recovery
 * request against an existing lost or found item report.
 *
 * Kept deliberately minimal for Level 1:
 *   - A claimant identifies themselves and describes why they believe the item
 *     is theirs (or that they found the owner).
 *   - Status lifecycle: pending → approved | rejected
 *
 * No matching logic, confidence scoring, or ownership verification lives here —
 * those are Level 2 concerns.
 */

/** Lifecycle statuses for a claim. @readonly */
const CLAIM_STATUSES = Object.freeze(["pending", "approved", "rejected"]);

/**
 * Build a claim document ready for persistence.
 *
 * @param {object} fields
 * @param {string} fields.id                   - UUID assigned by the service layer
 * @param {string} fields.itemId               - ID of the item report being claimed
 * @param {string} fields.claimantName         - Full name of the person submitting the claim
 * @param {string} fields.claimantEmail        - Contact email for the claimant
 * @param {string} [fields.claimantPhone]
 * @param {string} fields.message              - Description / proof of ownership (max 1000 chars)
 * @param {string|null} [fields.verificationDetails] - Identifying details that prove ownership
 *   (e.g. unique marks, serial number, contents). Required before a claim can be approved.
 *   May be supplied at submission time or added later via PATCH /claims/:id/verification.
 * @returns {object} Claim document
 */
const createClaim = ({
  id,
  itemId,
  claimantName,
  claimantEmail,
  claimantPhone = null,
  message,
  verificationDetails = null,
}) => ({
  id,
  itemId,
  claimantName: claimantName.trim(),
  claimantEmail: claimantEmail.trim().toLowerCase(),
  claimantPhone: claimantPhone ? claimantPhone.trim() : null,
  message: message.trim(),
  verificationDetails: verificationDetails ? verificationDetails.trim() : null,
  status: "pending",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

module.exports = { CLAIM_STATUSES, createClaim };
