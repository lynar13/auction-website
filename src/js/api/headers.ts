// src/js/api/headers.ts

const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Generate headers for API requests.
 *
 * @param {boolean} includeToken - Include "Authorization: Bearer <token>" (default: true).
 * @param {boolean} isMultipart - Use headers for multipart requests (default: false).
 * @returns {Object} Configured headers for the request.
 */
export function headers(includeToken = true, isMultipart = false) {
  // Default headers
  const baseHeaders = isMultipart
    ? {}
    : { 'Content-Type': 'application/json' };

  // Add Authorization token if available and required
  const token = localStorage.getItem('token');
  if (includeToken && token) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }

  // Add API key if available
  if (API_KEY) {
    baseHeaders['X-Noroff-API-Key'] = API_KEY;
  }

  return baseHeaders;
}
