// src/js/api/headers.js

import { API_KEY } from './constants.js';

/**
 * Generate headers for API requests
 * 
 * @param {boolean} includeContentType - Include "Content-Type: application/json" (default: false)
 * @param {boolean} includeAuth - Include "Authorization: Bearer <token>" (default: true)
 * @returns {Headers} Configured headers for the request
 */

export function headers(includeToken = true, isMultipart = false) {
  const baseHeaders = isMultipart
    ? {}
    : { 'Content-Type': 'application/json' };

  const token = localStorage.getItem('token');
  if (includeToken && token) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }

  if (API_KEY) {
    baseHeaders['X-Noroff-API-Key'] = API_KEY;
  }

  if (includeToken && token) {
    baseHeaders['Authorization'] = `Bearer ${token}`;
  }
  return baseHeaders;
}
