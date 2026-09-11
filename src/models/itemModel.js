/**
 * Item model
 *
 * Defines the shape, allowed values, and factory function for a lost/found
 * item report. Keeping this separate from the service makes the DynamoDB
 * migration straightforward — swap the service's in-memory store for SDK
 * calls without touching the model definition.
 */

/** @readonly */
const ITEM_TYPES = Object.freeze(["lost", "found"]);

/** @readonly */
const ITEM_STATUSES = Object.freeze(["open", "resolved"]);

/**
 * Categories recognised by the system.
 * @readonly
 */
const ITEM_CATEGORIES = Object.freeze([
  "electronics",
  "clothing",
  "accessories",
  "books",
  "keys",
  "wallet",
  "bag",
  "id_card",
  "sports",
  "other",
]);

/**
 * Build a validated item document ready for persistence.
 *
 * @param {object} fields
 * @param {string} fields.id          - UUID assigned by the service layer
 * @param {"lost"|"found"} fields.type
 * @param {string} fields.title       - Short headline (max 100 chars)
 * @param {string} fields.description - Free-text detail (max 1000 chars)
 * @param {string} fields.category    - One of ITEM_CATEGORIES
 * @param {string} fields.location    - Where it was lost / found
 * @param {string} fields.date        - ISO-8601 date string (YYYY-MM-DD)
 * @param {string} fields.contactEmail
 * @param {string} [fields.contactPhone]
 * @returns {object} Immutable item document
 */
const createItem = ({
  id,
  type,
  title,
  description,
  category,
  location,
  date,
  contactEmail,
  contactPhone = null,
}) => ({
  id,
  type,
  title: title.trim(),
  description: description.trim(),
  category,
  location: location.trim(),
  date,
  contactEmail: contactEmail.trim().toLowerCase(),
  contactPhone: contactPhone ? contactPhone.trim() : null,
  status: "open",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

module.exports = { ITEM_TYPES, ITEM_STATUSES, ITEM_CATEGORIES, createItem };
