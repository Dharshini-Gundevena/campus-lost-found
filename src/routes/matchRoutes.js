const express = require("express");
const { getMatches } = require("../controllers/matchController");

const router = express.Router({ mergeParams: true });

// GET /items/:id/matches  — retrieve ranked potential matches for an item
router.get("/", getMatches);

module.exports = router;
