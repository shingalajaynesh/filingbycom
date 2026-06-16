/**
 * api.js
 * Centered utility for executing HTTP requests to the backend using Axios.
 * Pre-configures the API base URL and handles errors robustly.
 */

import axios from "axios";

export const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Executes a request with Axios under the hood, mapping typical fetch arguments.
 * @param {string} path API endpoint path (e.g. '/services') or full URL
 * @param {object} [options] Fetch-like options (method, headers, body, credentials)
 * @returns {Promise<any>} Response data
 */
export async function safeFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  
  const method = (options.method || "GET").toUpperCase();
  const headers = options.headers || {};
  
  // Extract body, if it's stringified JSON, parse it back for axios
  let data = options.body;
  if (data && typeof data === "string") {
    const contentType = headers["Content-Type"] || headers["content-type"];
    if (!contentType || contentType.includes("application/json")) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }
  }

  // Axios configuration
  const config = {
    url,
    method,
    headers,
    data,
    withCredentials: options.credentials === "include" || options.credentials === "same-origin" || true,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    let errorMessage = error.message;
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
}
