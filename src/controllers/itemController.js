/**
 * Item controller
 *
 * Handles request parsing, input validation, and HTTP response shaping.
 * All business/data logic is delegated to itemService.
 */

const {
  createReport,
  listItems,
  getItemById,
  updateItemStatus,
  deleteItem,
} = require("../services/itemService");

const {
  ITEM_TYPES,
  ITEM_STATUSES,
  ITEM_CATEGORIES,
} = require("../models/itemModel");

// ── Validation helpers ────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate the body for POST /items.
 * Returns an array of error strings (empty = valid).
 */
const validateCreateBody = (body) => {
  const errors = [];

  if (!body.type || !ITEM_TYPES.includes(body.type))
    errors.push(`"type" is required and must be one of: ${ITEM_TYPES.join(", ")}`);

  if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0)
    errors.push('"title" is required and must be a non-empty string');
  else if (body.title.trim().length > 100)
    errors.push('"title" must not exceed 100 characters');

  if (!body.description || typeof body.description !== "string" || body.description.trim().length === 0)
    errors.push('"description" is required and must be a non-empty string');
  else if (body.description.trim().length > 1000)
    errors.push('"description" must not exceed 1000 characters');

  if (!body.category || !ITEM_CATEGORIES.includes(body.category))
    errors.push(`"category" is required and must be one of: ${ITEM_CATEGORIES.join(", ")}`);

  if (!body.location || typeof body.location !== "string" || body.location.trim().length === 0)
    errors.push('"location" is required and must be a non-empty string');

  if (!body.date || !DATE_RE.test(body.date))
    errors.push('"date" is required and must be in YYYY-MM-DD format');

  if (!body.contactEmail || !EMAIL_RE.test(body.contactEmail.trim()))
    errors.push('"contactEmail" is required and must be a valid email address');

  return errors;
};

/**
 * Validate query params for GET /items.
 * Returns an array of error strings (empty = valid).
 */
const validateListQuery = (query) => {
  const errors = [];

  if (query.type && !ITEM_TYPES.includes(query.type))
    errors.push(`"type" filter must be one of: ${ITEM_TYPES.join(", ")}`);

  if (query.category && !ITEM_CATEGORIES.includes(query.category))
    errors.push(`"category" filter must be one of: ${ITEM_CATEGORIES.join(", ")}`);

  if (query.status && !ITEM_STATUSES.includes(query.status))
    errors.push(`"status" filter must be one of: ${ITEM_STATUSES.join(", ")}`);

  if (query.date && !DATE_RE.test(query.date))
    errors.push('"date" filter must be in YYYY-MM-DD format');

  // Pagination
  if (query.limit !== undefined) {
    const l = Number(query.limit);
    if (!Number.isInteger(l) || l < 1 || l > 100)
      errors.push('"limit" must be an integer between 1 and 100');
  }

  if (query.offset !== undefined) {
    const o = Number(query.offset);
    if (!Number.isInteger(o) || o < 0)
      errors.push('"offset" must be a non-negative integer');
  }

  return errors;
};

// ── Handlers ──────────────────────────────────────────────────────────────────

/**
 * POST /items
 * Report a new lost or found item.
 */
const reportItem = (req, res, next) => {
  try {
    const errors = validateCreateBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ status: "error", errors });
    }

    const { type, title, description, category, location, date, contactEmail, contactPhone } = req.body;

    const item = createReport({
      type,
      title,
      description,
      category,
      location,
      date,
      contactEmail,
      contactPhone: contactPhone ?? null,
    });

    return res.status(201).json({ status: "success", data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /items
 * Browse and search item reports with optional filters and pagination.
 *
 * Query params: type, category, status, location, keyword, date, limit, offset
 */
const getItems = (req, res, next) => {
  try {
    const errors = validateListQuery(req.query);
    if (errors.length > 0) {
      return res.status(400).json({ status: "error", errors });
    }

    const { type, category, status, location, keyword, date } = req.query;
    const limit  = req.query.limit  !== undefined ? Number(req.query.limit)  : 20;
    const offset = req.query.offset !== undefined ? Number(req.query.offset) : 0;

    const { items, total } = listItems({ type, category, status, location, keyword, date, limit, offset });

    return res.status(200).json({
      status: "success",
      total,
      limit,
      offset,
      count: items.length,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /items/:id
 * Retrieve a single item report by its ID.
 */
const getItem = (req, res, next) => {
  try {
    const item = getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({
        status: "error",
        errors: [`Item with id "${req.params.id}" not found`],
      });
    }
    return res.status(200).json({ status: "success", data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /items/:id/status
 * Update the status of a report (open → resolved).
 *
 * Body: { "status": "open" | "resolved" }
 */
const patchItemStatus = (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !ITEM_STATUSES.includes(status)) {
      return res.status(400).json({
        status: "error",
        errors: [`"status" is required and must be one of: ${ITEM_STATUSES.join(", ")}`],
      });
    }

    const updated = updateItemStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({
        status: "error",
        errors: [`Item with id "${req.params.id}" not found`],
      });
    }

    return res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /items/:id
 * Remove an erroneous or spam item report.
 * Rejected with 409 if the item has any pending claims.
 */
const deleteItemHandler = (req, res, next) => {
  try {
    const item = getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({
        status: "error",
        errors: [`Item with id "${req.params.id}" not found`],
      });
    }

    // Guard: block deletion when pending claims exist
    const { listAllClaims } = require("../services/claimService");
    const pendingClaims = listAllClaims({ itemId: req.params.id, status: "pending" });
    if (pendingClaims.length > 0) {
      return res.status(409).json({
        status: "error",
        errors: [
          `Cannot delete item with ${pendingClaims.length} pending claim(s). Resolve or reject them first.`,
        ],
      });
    }

    deleteItem(req.params.id);
    return res.status(200).json({
      status: "success",
      data: { id: req.params.id, deleted: true },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { reportItem, getItems, getItem, patchItemStatus, deleteItemHandler };
