import { API_AUCTION_LISTINGS_BIDS, API_PROFILE_BIDS } from "./constants.js";
import { headers } from "./headers.js"; // Import the headers function

/**
 * Place a bid on a specific listing.
 * @param {string} listingId - The ID of the listing.
 * @param {number} amount - The bid amount.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<object>} - The bid response.
 */
export async function placeBid(listingId, amount) {
  try {
    const response = await fetch(API_AUCTION_LISTINGS_BIDS(listingId), {
      method: "POST",
      headers: headers(true), // Use headers function to generate the headers
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || "Failed to place bid");
    }

    return await response.json();
  } catch (error) {
    console.error("Error placing bid:", error.message);
    throw error;
  }
}

/**
 * Fetch all bids placed by the profile.
 * @param {string} profileName - The profile's name.
 * @param {boolean} includeListings - Whether to include associated listings.
 * @returns {Promise<object[]>} - List of bids.
 */
export async function fetchBidsByProfile(profileName, includeListings = false) {
  try {
    const response = await fetch(API_PROFILE_BIDS(profileName, includeListings), {
      method: "GET",
      headers: headers(true), // Use headers function to generate the headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || "Failed to fetch bids");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching bids:", error.message);
    throw error;
  }
}
