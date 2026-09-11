const express = require("express");
const {
  getNotificationsHandler,
  markReadHandler,
} = require("../controllers/notificationController");

const router = express.Router();

// GET   /notifications?email=<email>  — list notifications for a user
router.get("/", getNotificationsHandler);

// PATCH /notifications/:id/read       — mark a notification as read
router.patch("/:id/read", markReadHandler);

module.exports = router;
