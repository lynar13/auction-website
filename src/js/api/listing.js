// src/js/api/listings.js
import { headers } from "./headers.js";
import { API_AUCTION_LISTINGS, API_AUCTION_LISTINGS_ID, API_AUCTION_LISTINGS_SEARCH } from "./constants.js";
import { currentUser } from "../utilities/currentUser.js"; 

/*
   * Search for listings based on query.
   * @param {string} query - The search query.
   * @returns {Promise<Array<Listing>>} - Promise that resolves to an array of found listings.
   */

/* Create new listing */
export async function createListing(data) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('You must be logged in to create a listing.');

  const response = await fetch(API_AUCTION_LISTINGS, {
    method: 'POST',
    headers: headers(true, true), // Include Authorization
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error response from server:", errorData);
    throw new Error(errorData.message || "Failed to create listing");
  }  

  const createdListing = await response.json();

  // Add credits to the user's account upon successful listing
  const user = JSON.parse(localStorage.getItem('user'));
  user.credits += data.startingBid || 0; // Increment user credits (optional logic for initial bids)
  localStorage.setItem('user', JSON.stringify(user));

  return createdListing;
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
    console.error('Error fetching listing:', error);
    throw error;
  }
}

/* Update a listing by ID */
export async function updateListing(id, data) {
  try {
    const response = await fetch (API_AUCTION_LISTINGS_ID(id), {
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
    console.error("Error updating listing:", error);
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
    console.error('Error during listing deletion:', error);
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
    console.error("Error fetching listings:", error);
    throw new Error("Failed to fetch listings: " + error.message);
  }
}




  