const express = require("express");
const {
  submitClaimHandler,
  listClaimsHandler,
  getClaimHandler,
  patchClaimStatusHandler,
  listAllClaimsHandler,
  addVerificationHandler,
} = require("../controllers/claimController");

// ── Item-scoped claim routes (mounted at /items in server.js) ─────────────────
const itemClaimRouter = express.Router({ mergeParams: true });

// POST  /items/:itemId/claims  — submit a claim
itemClaimRouter.post("/", submitClaimHandler);

// GET   /items/:itemId/claims  — list claims for an item
itemClaimRouter.get("/", listClaimsHandler);

// ── Standalone claim routes (mounted at /claims in server.js) ─────────────────
const claimRouter = express.Router();

// GET   /claims                       — list all claims (admin view); filterable by status, itemId
claimRouter.get("/", listAllClaimsHandler);

// GET   /claims/:id                   — retrieve a single claim
claimRouter.get("/:id", getClaimHandler);

// PATCH /claims/:id/verification      — add ownership verification evidence
claimRouter.patch("/:id/verification", addVerificationHandler);

// PATCH /claims/:id/status            — update claim status (approve/reject)
claimRouter.patch("/:id/status", patchClaimStatusHandler);

module.exports = { itemClaimRouter, claimRouter };
