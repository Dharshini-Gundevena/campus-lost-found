/**
 * Notification controller
 *
 * Handles request parsing, validation, and HTTP response shaping for
 * in-app notifications. All data logic is delegated to notificationService.
 */

const {
  listForUser,
  getNotificationById,
  markRead,
} = require("../services/notificationService");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Handlers ──────────────────────────────────────────────────────────────────

/**
 * GET /notifications?email=<email>
 *
 * Retrieve all notifications for a given user email, newest first.
 *
 * Response:
 * { status, count, data: [ ...notifications ] }
 */
const getNotificationsHandler = (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email || !EMAIL_RE.test(email.trim())) {
      return res.status(400).json({
        status: "error",
        errors: ['"email" query parameter is required and must be a valid email address'],
      });
    }

    const notifications = listForUser(email);

    return res.status(200).json({
      status: "success",
      count:  notifications.length,
      data:   notifications,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /notifications/:id/read
 *
 * Mark a notification as read.
 *
 * Response:
 * { status, data: { ...updatedNotification } }
 */
const markReadHandler = (req, res, next) => {
  try {
    const notification = getNotificationById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        status: "error",
        errors: [`Notification with id "${req.params.id}" not found`],
      });
    }

    const updated = markRead(req.params.id);
    return res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotificationsHandler, markReadHandler };
