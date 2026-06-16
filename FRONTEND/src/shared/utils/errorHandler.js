import toast from "react-hot-toast";

/**
 * Centralized frontend error handler.
 * Logs the error to console.error and optionally alerts/toasts the user.
 *
 * @param {Error|any} error - The caught error object.
 * @param {string} contextMessage - Human-readable description of the operation that failed.
 * @param {object} [options] - Configuration parameters.
 * @param {boolean} [options.silent=false] - If true, logs to console but suppresses the user toast.
 * @param {boolean} [options.showAlert=false] - If true, falls back to standard window.alert instead of a toast.
 * @returns {string} The formatted error message string.
 */
export function handleFrontendError(error, contextMessage, options = {}) {
  const { silent = false } = options;

  // 1. Extract error details safely
  const errorMessage = error?.response?.data?.message
    || error?.message
    || (typeof error === "string" ? error : "An unexpected error occurred");

  // 2. Consistent console logging with stack traces
  console.error(`[Error] ${contextMessage}:`, error);

  // 3. User feedback
  if (!silent) {
    const formattedUserMsg = `${contextMessage}: ${errorMessage}`;
    toast.error(formattedUserMsg);
  }

  return errorMessage;
}
