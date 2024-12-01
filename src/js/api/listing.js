// src/js/api/listings.js
import { headers } from "./headers.js";
import { API_AUCTION_LISTINGS, API_AUCTION_LISTINGS_ID, API_AUCTION_LISTINGS_SEARCH } from "./constants.js";
import { currentUser } from "../utilities/currentUser.js"; 

/*
   * Search for listings based on query.
   * @param {string} query - The search query.
   * @returns {Promise<Array<Listing>>} - Promise that resolves to an array of found listings.
   */
  export async function searchListings(query) {
    const url = new URL(API_AUCTION_LISTINGS_SEARCH);
    url.searchParams.set('search', query);

    try {
      const response = await fetch(url, {
        headers: headers(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Search failed');
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching for listings:', error);
      throw new Error('Failed to search listings: ' + error.message);
    }
  }

/* Create new listing */
export async function createListing(data) {
  const user = currentUser();

  /* Check if user is logged in and token is available */
  if (!user || !localStorage.getItem('token')) {
    console.error("User is not logged in or token is missing");
    window.location.href = "/auth/login/index.html"; // Redirect to login page
    return;
  }

  try {
    const response = await fetch(API_AUCTION_LISTINGS, {
      method: "POST",
      headers: headers(true, true), 
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Listing creation failed');
    }

    const result = await response.json();
    return result.data; 
  } catch (error) {
    console.error('Error creating listing:', error);
    throw new Error('Failed to create listing: ' + error.message);
  }
}

/* Get a specific post by ID */
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
    ? `${API_SOCIAL_POSTS_SEARCH}?${params.toString()}` // Use search endpoint if query exists
    : `${API_SOCIAL_POSTS}?${params.toString()}`;

  try {
    console.log("Fetching posts from:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: headers(true),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch posts");

    return result.data || result;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts: " + error.message);
  }
}


  