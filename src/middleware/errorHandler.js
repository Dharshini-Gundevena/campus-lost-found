/**
 * Centralised error-handling middleware.
 *
 * Must be registered AFTER all routes in server.js so Express routes
 * unexpected errors here via next(err).
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== "production";

  console.error(`[error] ${req.method} ${req.path} —`, err.message);

  res.status(err.status ?? 500).json({
    status: "error",
    errors: [err.message || "An unexpected error occurred"],
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
