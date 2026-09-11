const express = require("express");
const {
  reportItem,
  getItems,
  getItem,
  patchItemStatus,
  deleteItemHandler,
} = require("../controllers/itemController");

const router = express.Router();

// POST   /items          — report a new lost or found item
router.post("/", reportItem);

// GET    /items          — list / search all reports (supports limit, offset)
router.get("/", getItems);

// GET    /items/:id      — retrieve a single report
router.get("/:id", getItem);

// PATCH  /items/:id/status — update open/resolved status
router.patch("/:id/status", patchItemStatus);

// DELETE /items/:id      — remove an erroneous/spam report
router.delete("/:id", deleteItemHandler);

module.exports = router;
