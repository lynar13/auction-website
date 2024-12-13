// src/js/api/listings.js
import { headers } from "./headers.js";
import { API_AUCTION_LISTINGS, API_AUCTION_LISTINGS_ID, API_AUCTION_LISTINGS_SEARCH } from "./constants.js";

/* Create new listing */
export async function createListing(data) {
  try {
    const response = await fetch('https://v2.api.noroff.dev/auction/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.error("Error response from server:", responseData.errors || responseData.message);
      throw new Error(responseData.errors?.[0]?.message || 'Failed to create listing');
    }

    const createdListing = await response.json();

    // Optionally update user credits (if initial bids are involved)
    if (data.startingBid) {
      const user = JSON.parse(localStorage.getItem('user'));
      user.credits += data.startingBid;
      localStorage.setItem('user', JSON.stringify(user));
    }

    return createdListing;
  } catch (error) {
    console.error("Error creating listing:", error.message);
    throw error;
  }
}

/* Get a specific listing by ID */
export async function readListing(id) {
  const url = API_AUCTION_LISTINGS_ID(id);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers(true),
    });

    if (!response.ok) throw new Error("Failed to fetch listing");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching listing:", error.message);
    throw error;
  }
}

/* Update a listing by ID */
export async function updateListing(id, data) {
  try {
    const response = await fetch(API_AUCTION_LISTINGS_ID(id), {
      method: "PUT",
      headers: headers(true, true), // Include Content-Type and Authorization
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update listing");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating listing:", error.message);
    throw new Error("Failed to update listing: " + error.message);
  }
}

/* Delete a listing by ID */
export async function deleteListing(id) {
  try {
    const response = await fetch(API_AUCTION_LISTINGS_ID(id), {
      method: "DELETE",
      headers: headers(true),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete listing: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) return {};

    return JSON.parse(text);
  } catch (error) {
    console.error("Error during listing deletion:", error.message);
    throw new Error("Failed to delete listing: " + error.message);
  }
}

/* Get a paginated list of listings, search and sort listings */
export async function readListings(page = 1, perPage = 12, query = '', sort = '') {
  const params = new URLSearchParams({
    _page: page,
    _limit: perPage,
  });

  if (query) params.append("q", query); // Add search query if provided
  if (sort) params.append("_sort", sort); // Add sorting parameter if provided

  const url = query
    ? `${API_AUCTION_LISTINGS_SEARCH}?${params.toString()}` // Use search endpoint if query exists
    : `${API_AUCTION_LISTINGS}?${params.toString()}`;

  try {
    console.log("Fetching listings from:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: headers(true),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch listings");

    return result.data || result;
  } catch (error) {
    console.error("Error fetching listings:", error.message);
    throw new Error("Failed to fetch listings: " + error.message);
  }
}
