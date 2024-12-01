// src/js/api/headers.js
/*
 * Headers configuration
 *
 * This file contains the headers configuration for API requests.
 * It includes the API key, token, and Content-Type headers.
 */

import { API_KEY } from './constants.js';


export function headers(includeContentType = false, includeAuth = true) {
  const headers = new Headers();

  // Always include the API key in the headers if available
  if (API_KEY) {
    headers.append('X-Noroff-API-Key', API_KEY);
  } else {
    console.error('API_KEY is missing. Please check your configuration.');
  }

  // Include Authorization header only if includeAuth is true and a token is present in localStorage
  const token = localStorage.getItem('token');
  if (includeAuth) {
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    } else {
      console.error('Authorization token is missing in localStorage.');
    }
  }

  // Include Content-Type header for JSON body if specified
  if (includeContentType) {
    headers.append('Content-Type', 'application/json');
  }

  // Log headers for debugging purposes
  console.log('Request Headers:', [...headers.entries()]);

  return headers;
}
