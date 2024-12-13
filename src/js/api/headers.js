// src/js/api/headers.js

import { API_KEY } from './constants.js';

/**
 * Generate headers for API requests
 * 
 * @param {boolean} includeContentType - Include "Content-Type: application/json" (default: false)
 * @param {boolean} includeAuth - Include "Authorization: Bearer <token>" (default: true)
 * @returns {Headers} Configured headers for the request
 */

export function headers(includeContentType = false, includeAuth = true) {
  const headers = new Headers();

  // Always include the API key in the headers if available
  if (API_KEY) {
    headers.append('X-Noroff-API-Key', API_KEY);
  } else if (process.env.NODE_ENV === 'development') {
    console.error('API_KEY is missing. Please check your configuration.');
  }
  

  // Include Authorization header only if includeAuth is true and a token is present in localStorage
  if (includeAuth) {
  const token = localStorage.getItem('token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    } else {
      console.warn('Authorization token is missing in localStorage.');
    }
  }

  // Include Content-Type header for JSON body if specified
  if (includeContentType) {
    headers.append('Content-Type', 'application/json');
  }

  return headers;
}
