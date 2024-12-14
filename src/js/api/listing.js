// src/js/api/listings.js
import { headers } from './headers.js';
import {
  API_AUCTION_LISTINGS,
  API_AUCTION_LISTINGS_ID,
  API_AUCTION_LISTINGS_SEARCH,
} from './constants.js';

/**
 * Create a new listing.
 * 
 * @param {object} data - The listing data to be created.
 * @returns {Promise<object>} - The created listing data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function createListing(data) {
  const apiUrl = 'https://v2.api.noroff.dev/auction/listings';

  try {
    const headersObject = headers(true); // Include token

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headersObject,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.error(
        'Error response from server:',
        responseData.errors || responseData.message,
      );
      throw new Error(
        responseData.errors?.[0]?.message || 'Failed to create listing',
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating listing:', error.message);
    throw error;
  }
}

/**
 * Get a specific listing by ID.
 * 
 * @param {string} id - The ID of the listing to retrieve.
 * @returns {Promise<object>} - The fetched listing data.
 * @throws {Error} - Throws an error if the request fails or the ID is invalid.
 */
export async function readListing(id) {
  if (!id) {
    throw new Error('Invalid listing ID');
  }

  const url = API_AUCTION_LISTINGS_ID(id);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers(true),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        'API Error:',
        errorData.message || 'Failed to fetch listing',
      );
      throw new Error(errorData.message || 'Failed to fetch listing');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching listing:', error.message);
    throw error;
  }
}

/**
 * Update a specific listing by ID.
 * 
 * @param {string} id - The ID of the listing to update.
 * @param {object} data - The updated listing data.
 * @returns {Promise<object>} - The updated listing data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function updateListing(id, data) {
  try {
    const response = await fetch(API_AUCTION_LISTINGS_ID(id), {
      method: 'PUT',
      headers: headers(true, true), // Include Content-Type and Authorization
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update listing');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating listing:', error.message);
    throw new Error('Failed to update listing: ' + error.message);
  }
}

/**
 * Delete a specific listing by ID.
 * 
 * @param {string} id - The ID of the listing to delete.
 * @returns {Promise<object>} - The response of the delete operation.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function deleteListing(id) {
  try {
    const response = await fetch(API_AUCTION_LISTINGS_ID(id), {
      method: 'DELETE',
      headers: headers(true),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete listing: ${response.status} ${response.statusText}`,
      );
    }

    const text = await response.text();
    if (!text) return {};

    return JSON.parse(text);
  } catch (error) {
    console.error('Error during listing deletion:', error.message);
    throw new Error('Failed to delete listing: ' + error.message);
  }
}

/**
 * Get a paginated list of listings with optional search and sort parameters.
 * 
 * @param {number} [page=1] - The current page number.
 * @param {number} [perPage=12] - The number of listings per page.
 * @param {string} [query=''] - The search query to filter listings.
 * @param {string} [sort=''] - The sorting criteria.
 * @returns {Promise<object[]>} - A list of listings.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function readListings(
  page = 1,
  perPage = 12,
  query = '',
  sort = '',
) {
  const params = new URLSearchParams({
    _page: page,
    _limit: perPage,
  });

  if (query) params.append('q', query); // Add search query if provided
  if (sort) params.append('_sort', sort); // Add sorting parameter if provided

  const url = query
    ? `${API_AUCTION_LISTINGS_SEARCH}?${params.toString()}` // Use search endpoint if query exists
    : `${API_AUCTION_LISTINGS}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers(true),
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || 'Failed to fetch listings');

    return result.data || result;
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    throw new Error('Failed to fetch listings: ' + error.message);
  }
}
