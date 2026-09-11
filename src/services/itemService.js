/**
 * Item service
 *
 * Encapsulates all data-access logic for item reports.
 * Currently backed by an in-memory Map so the server is fully runnable
 * without any external dependency. When DynamoDB is introduced, only this
 * file needs to change — the controller and model layers stay untouched.
 */

const { v4: uuidv4 } = require("uuid");
const { createItem } = require("../models/itemModel");

// ── In-memory store ───────────────────────────────────────────────────────────
// Key: item.id (string)  Value: item document (object)
const store = new Map();

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Case-insensitive substring match.
 * @param {string} haystack
 * @param {string} needle
 */
const includes = (haystack, needle) =>
  haystack.toLowerCase().includes(needle.toLowerCase());

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Persist a new item report.
 * @param {object} data - Validated fields from the controller
 * @returns {object} The created item
 */
const createReport = (data) => {
  const id = uuidv4();
  const item = createItem({ id, ...data });
  store.set(id, item);
  return item;
};

/**
 * Return items with optional filtering and pagination.
 *
 * Filters (all optional, combinable):
 *   type       "lost" | "found"
 *   category   one of ITEM_CATEGORIES
 *   status     "open" | "resolved"
 *   location   substring match (case-insensitive)
 *   keyword    substring match against title + description (case-insensitive)
 *   date       exact match on the date field (YYYY-MM-DD)
 *
 * Pagination:
 *   limit      max items to return (default 20, max 100)
 *   offset     number of items to skip (default 0)
 *
 * @param {object} filters
 * @returns {{ items: object[], total: number }} total = count after filtering, before paging
 */
const listItems = (filters = {}) => {
  const { type, category, status, location, keyword, date, limit = 20, offset = 0 } = filters;

  let results = Array.from(store.values());

  if (type) results = results.filter((i) => i.type === type);
  if (category) results = results.filter((i) => i.category === category);
  if (status) results = results.filter((i) => i.status === status);
  if (date) results = results.filter((i) => i.date === date);
  if (location) results = results.filter((i) => includes(i.location, location));
  if (keyword)
    results = results.filter(
      (i) => includes(i.title, keyword) || includes(i.description, keyword)
    );

  // Newest first
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = results.length;
  const items = results.slice(offset, offset + limit);

  return { items, total };
};

/**
 * Retrieve a single item by ID.
 * @param {string} id
 * @returns {object|null}
 */
const getItemById = (id) => store.get(id) ?? null;

/**
 * Update the status of an existing item.
 * @param {string} id
 * @param {"open"|"resolved"} status
 * @returns {object|null} Updated item, or null if not found
 */
const updateItemStatus = (id, status) => {
  const item = store.get(id);
  if (!item) return null;

  const updated = { ...item, status, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
};

/**
 * Delete an item report by ID.
 * @param {string} id
 * @returns {boolean} true if deleted, false if not found
 */
const deleteItem = (id) => {
  if (!store.has(id)) return false;
  store.delete(id);
  return true;
};

module.exports = { createReport, listItems, getItemById, updateItemStatus, deleteItem };
