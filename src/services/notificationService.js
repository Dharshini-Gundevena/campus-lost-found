/**
 * Notification service  —  Level 2 in-app notifications
 *
 * Stores notification records in memory using the same Map pattern as
 * itemService and claimService. No external dependencies, no email sending.
 *
 * A notification is created for a user when a newly reported item produces
 * potential matches — the owner of each matched item is notified so they
 * can review the new report.
 *
 * Notification document shape:
 * {
 *   id:            string   (UUID)
 *   recipientEmail:string   (contactEmail of the matched item's reporter)
 *   type:          "potential_match"
 *   itemId:        string   (the matched item — what the recipient reported)
 *   matchedItemId: string   (the newly posted item that triggered the match)
 *   score:         number
 *   signals:       string[]
 *   read:          boolean
 *   createdAt:     ISO string
 * }
 */

const { v4: uuidv4 } = require("uuid");

// ── In-memory store ───────────────────────────────────────────────────────────
const store = new Map();   // key: notification.id

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Persist a new notification record.
 *
 * @param {object} fields
 * @param {string} fields.recipientEmail
 * @param {string} fields.itemId         - item the recipient owns/reported
 * @param {string} fields.matchedItemId  - newly posted item that triggered the match
 * @param {number} fields.score
 * @param {string[]} fields.signals
 * @returns {object} The created notification
 */
const createNotification = ({ recipientEmail, itemId, matchedItemId, score, signals }) => {
  const notification = {
    id:             uuidv4(),
    recipientEmail: recipientEmail.trim().toLowerCase(),
    type:           "potential_match",
    itemId,
    matchedItemId,
    score,
    signals,
    read:           false,
    createdAt:      new Date().toISOString(),
  };
  store.set(notification.id, notification);
  return notification;
};

/**
 * Return all notifications for a given recipient email, newest first.
 *
 * @param {string} email
 * @returns {object[]}
 */
const listForUser = (email) => {
  const target = email.trim().toLowerCase();
  return Array.from(store.values())
    .filter((n) => n.recipientEmail === target)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Retrieve a single notification by ID.
 *
 * @param {string} id
 * @returns {object|null}
 */
const getNotificationById = (id) => store.get(id) ?? null;

/**
 * Mark a notification as read.
 *
 * @param {string} id
 * @returns {object|null} Updated notification, or null if not found
 */
const markRead = (id) => {
  const n = store.get(id);
  if (!n) return null;
  const updated = { ...n, read: true };
  store.set(id, updated);
  return updated;
};

module.exports = { createNotification, listForUser, getNotificationById, markRead };
