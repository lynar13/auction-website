// src/js/api/constants.js
/*
 * API endpoints and constants
 *
 * This file contains all the API endpoints and constants used in the application.
 */

export const API_KEY = "78300a41-8e7a-40b2-804e-14463ccd9ab1";

// Base API URL for the application
export const API_BASE = "https://v2.api.noroff.dev";

// Authentication-related API endpoints
export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

// Auction-related API endpoints
export const API_AUCTION = `${API_BASE}/auction`;
export const API_AUCTION_LISTINGS = `${API_AUCTION}/listings`;
export const API_AUCTION_PROFILES = `${API_AUCTION}/profiles`;

// Dynamic URL generation functions for specific resources
export const API_AUCTION_LISTINGS_ID = (id) => `${API_AUCTION_LISTINGS}/${id}`;
export const API_AUCTION_PROFILES_NAME = (name) => `${API_AUCTION_PROFILES}/${name}`;
export const API_AUCTION_LISTINGS_TAG = (tag) => `${API_AUCTION_LISTINGS}?tag=${tag}`;
export const API_AUCTION_PROFILES_LISTINGS = (name) => `${API_AUCTION_PROFILES_NAME(name)}/listings`;
export const API_AUCTION_LISTINGS_SEARCH = `${API_AUCTION_LISTINGS}/search`;
export const API_AUCTION_PROFILES_BIDS = (name) => `${API_AUCTION_PROFILES_NAME(name)}/bids`;
export const API_AUCTION_PROFILES_WINNING_LISTINGS = (name) => `${API_AUCTION_PROFILES_NAME(name)}/wins`;
export const API_AUCTION_LISTINGS_BIDS = (listingId) => `${API_AUCTION_LISTINGS_ID(listingId)}/bids`;
