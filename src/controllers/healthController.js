/**
 * Health check controller
 * Confirms the backend is running and reachable.
 */
const getHealth = (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Campus Lost & Found backend is running",
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };
