/**
 * api.js
 * Centered utility for executing HTTP requests to the backend.
 * Pre-configures the API base URL and handles errors robustly to avoid 
 * crashing when non-JSON HTML payloads are returned in production.
 */

export const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Executes a fetch request with enhanced status and content-type validation.
 * @param {string} path API endpoint path (e.g. '/services') or full URL
 * @param {RequestInit} [options] Fetch options
 * @returns {Promise<any>} Parsed JSON response body
 */
export async function safeFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  
  const response = await fetch(url, options);

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  // Handle non-2xx response codes
  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    if (isJson) {
      try {
        const errData = await response.json();
        errorMessage = errData.message || errorMessage;
      } catch (e) {
        // Fallback if parsing fails
      }
    } else {
      const text = await response.text();
      if (text && text.length < 150 && !text.trim().startsWith("<")) {
        errorMessage = text.trim();
      } else {
        errorMessage = `Server returned an HTML response (Status ${response.status}). The requested endpoint might be misconfigured, offline, or hitting a client routing fallback.`;
      }
    }
    throw new Error(errorMessage);
  }

  // Handle 2xx codes returning non-JSON payloads
  if (!isJson) {
    throw new Error(
      `Received non-JSON response from API (${contentType || "unknown content type"}). Check if the backend API URL is configured correctly.`
    );
  }

  return response.json();
}
