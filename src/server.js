require("dotenv").config();

const express = require("express");
const cors = require("cors");

const healthRoutes       = require("./routes/healthRoutes");
const itemRoutes         = require("./routes/itemRoutes");
const { itemClaimRouter, claimRouter } = require("./routes/claimRoutes");
const matchRoutes        = require("./routes/matchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { errorHandler }   = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/health",               healthRoutes);
app.use("/items",                itemRoutes);
app.use("/items/:itemId/claims", itemClaimRouter);
app.use("/items/:id/matches",    matchRoutes);
app.use("/claims",               claimRouter);
app.use("/notifications",        notificationRoutes);

// ── Centralised error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
});

module.exports = app;
