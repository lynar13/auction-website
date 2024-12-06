// src/js/api/profile.js
import { headers } from '../api/headers.js'; // Adjusted to a relative path
import { API_AUCTION_PROFILES } from '../api/constants.js'; // Adjusted to a relative path
import { currentUser } from '../utilities/currentUser.js'; // Adjusted to a relative path

/*
* Update avatar image
* Update user's profile data
*/

// Fetch profile data for the current user
export async function readProfile(username) {
  try {
      const response = await fetch(`${API_AUCTION_PROFILES}/${username}`, {
      method: 'GET',
      headers: headers(), // Use headers to include the API key and authorization token
    });
    const result = await response.json();
    if (!response.ok || !result.data) {
    throw new Error(result.message || 'Unexpected API response');
    }
    return result.data;
  } catch (error) {
    console.error('Error reading profile:', error);
    throw error;
  }
}

// Update profile data for the current user
export async function updateProfile(username, data) {
  try {
    const response = await fetch(`${API_AUCTION_PROFILES}/${username}`, {
      method: 'PUT',
      headers: headers(true), // Use headers to include the API key and authorization token
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    const { data: updatedProfile } = await response.json();
    return updatedProfile; // Return the updated profile data
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Fetch listings made by a specific user
export async function readUserListings(username) {
  const response = await fetch(`${API_AUCTION_PROFILES}/${username}/listings`, {
    headers: headers(true),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch user listings');
  return result.data || []; // Ensure an array is returned
}


// Update user avatar 
export async function updateAvatar(avatarUrl) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !localStorage.getItem('token')) {
      console.error("User is not logged in");
      return;
    }
  
    try {
      const response = await fetch(`${API_AUCTION_PROFILES}/${user.username}/avatar`, {
        method: "PUT",
        headers: headers(true, true),
        body: JSON.stringify({ avatar: avatarUrl }),
      });
  
      if (!response.ok) throw new Error("Failed to update avatar");
  
      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error;
    }
  }
  
  // Fetch total credit of a specific user
  export async function getTotalCredit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error("User not logged in");
  
    try {
      const response = await fetch(`${API_AUCTION_PROFILES}/${user.username}`, {
        headers: headers(true),
      });
  
      if (!response.ok) throw new Error("Failed to fetch user profile");
  
      const profile = await response.json();
      return profile.credits;
    } catch (error) {
      console.error("Error fetching total credit:", error);
      throw error;
    }
  }
  
  // Add a bid to a listing
  export async function addBid(listingId, amount) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error("User not logged in");
  
    try {
      const response = await fetch(`${API_AUCTION_LISTINGS_ID(listingId)}/bids`, {
        method: "POST",
        headers: headers(true, true),
        body: JSON.stringify({ amount }),
      });
  
      if (!response.ok) throw new Error("Failed to add bid");
  
      return await response.json();
    } catch (error) {
      console.error("Error adding bid:", error);
      throw error;
    }
  }
  
  // Fetch bids for a specific listing
  export async function getBids(listingId) {
    try {
      const response = await fetch(`${API_AUCTION_LISTINGS_ID(listingId)}/bids`, {
        headers: headers(true),
      });
  
      if (!response.ok) throw new Error("Failed to fetch bids");
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching bids:", error);
      throw error;
    }
  }