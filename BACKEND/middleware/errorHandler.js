/**
 * Error Handling Middleware
 * =========================
 * This file defines two middleware functions that run when something goes wrong.
 * Middleware in Express are functions that receive (req, res, next). They run in order.
 *
 * When do these run?
 * - notFound: Runs when no route above matched the request URL (404).
 * - errorHandler: Runs when any route or controller calls next(err) with an error.
 *
 * Why centralize? So we send consistent JSON error responses to the client
 * instead of leaking stack traces or HTML error pages.
 */

/**
 * notFound(req, res, next)
 * ------------------------
 * Called when the request URL did not match any of our defined routes.
 * Sends a 404 status and a JSON body { message: "Resource not found" }.
 * This runs only if no route handler sent a response (e.g. no GET /foo was defined).
 */
function notFound(req, res, next) {
  res.status(404).json({ message: 'Resource not found' });
}

/**
 * errorHandler(err, req, res, next)
 * ---------------------------------
 * Global error handler. Express recognizes it by the 4 parameters (err first).
 * It runs when any previous middleware or route calls next(err).
 *
 * Steps:
 * 1. Log the error for debugging.
 * 2. If we already sent headers (e.g. started streaming), delegate to default handler.
 * 3. Use err.statusCode (set by controllers, e.g. 400, 404) or default to 500.
 * 4. Send one JSON response: { message: "..." } so the frontend can show it.
 */
function errorHandler(err, req, res, next) {
  console.error('Server Error:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';

  res.status(statusCode).json({ message });
}

module.exports = {
  notFound,
  errorHandler
};
