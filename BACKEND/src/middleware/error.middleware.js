import logger from "../services/logger.service.js";

/**
 * Global Express Error Handling Middleware.
 * Catches any unhandled errors in route controllers and returns a structured JSON payload.
 */
export function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log unhandled exception to Winston logger
  logger.error(`[Unhandled Exception] [${req.method}] ${req.originalUrl} - Status: ${statusCode} - Message: ${message}`, {
    stack: err.stack,
    ip: req.ip,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
}

/**
 * Standard utility to log and return an HTTP error response in Express controllers.
 * Use inside catch blocks.
 *
 * @param {Error|any} err - The error object caught.
 * @param {object} res - Express response object.
 * @param {string} [customMessage="Internal Server Error"] - Contextual message.
 * @param {number} [statusCode=500] - HTTP status code.
 */
export function handleBackendError(err, res, customMessage = "Internal Server Error", statusCode = 500) {
  const message = err.message || customMessage;

  // Log detailed error stack to Winston
  logger.error(`[Controller Catch] ${customMessage}: ${message}`, {
    stack: err.stack || new Error().stack,
    err,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
}
