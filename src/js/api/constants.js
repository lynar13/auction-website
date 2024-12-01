// src/js/api/constants.js
/*
 * API endpoints and constants
 *
 * This file contains all the API endpoints and constants used in the application.
 */

export const API_KEY = "c587b262-2244-4cb8-b2f1-bb31b6808b52";

export const API_BASE = "https://v2.api.noroff.dev";

export const API_AUTH = `${API_BASE}/auth`;

export const API_AUTH_LOGIN = `${API_AUTH}/login`;

export const API_AUTH_REGISTER = `${API_AUTH}/register`;

export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

export const API_AUCTION = `${API_BASE}/auction`;

export const API_AUCTION_LISTINGS = `${API_AUCTION}/listings`;

export const API_AUCTION_LISTINGS_ID = (id) => `${API_AUCTION}/listings/${id}`;

export const API_AUCTION_PROFILES = `${API_AUCTION}/profiles`;

export const API_AUCTION_PROFILES_NAME = `${API_AUCTION}/profiles/<name>`;

export const API_AUCTION_LISTINGS_TAG = (tag) => `${API_AUCTION_LISTINGS}?tag=${tag}`;

export const API_AUCTION_PROFILES_LISTINGS = (name) => `${API_AUCTION}/profiles/${name}/listings`;

export const API_AUCTION_LISTINGS_SEARCH = `${API_AUCTION_LISTING}/search`;