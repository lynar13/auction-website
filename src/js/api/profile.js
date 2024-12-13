// src/js/api/profile.js
import { headers } from '../api/headers.js'; // Adjusted to a relative path
import { 
  API_AUCTION_PROFILES, 
  API_AUCTION_LISTINGS, 
  API_AUCTION_LISTINGS_ID,
  API_AUCTION_LISTINGS_BIDS 
} from '../api/constants.js'; // Adjusted to a relative path

/** 
 * View or read user profile 
 * Update avatar image
 * Update user's profile data
 */

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect to login if no valid token or user
  if (!token || !user) {
    alert('You must log in first.');
    window.location.href = '/auction-website/auth/login/index.html';
    return;
  }

  try {
    // Fetch updated profile data and store it in localStorage
    const updatedProfile = await readProfile(user.name);
    localStorage.setItem('user', JSON.stringify(updatedProfile));

    // Display user info
    document.getElementById('username').textContent = updatedProfile.name || updatedProfile.username;
    document.getElementById('avatar').src = updatedProfile.avatar?.url || '/path/to/default-avatar.png';
    document.getElementById('credits').textContent = `Credits: ${updatedProfile.credits || 0}`;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
});

// Fetch profile data for the current user
export async function readProfile(name) {
  try {
    const response = await fetch(`${API_AUCTION_PROFILES}/${name}`, {
      method: 'GET',
      headers: headers(true),
    });

    if (!response.ok) {
      const errorMessage = (await response.json()).message || 'Failed to fetch profile';
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (!result.data) throw new Error('Profile data missing in response');

    return {
      ...result.data,
      _count: result.data._count || { listings: 0, wins: 0 },
      credits: result.data.credits || 0,
      avatar: result.data.avatar || { url: '', alt: '' },
    };
  } catch (error) {
    console.error('Error reading profile:', error.message);
    throw error;
  }
}

export async function getTotalCredit() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.name) {
    console.error('User not found or invalid.');
    throw new Error('User not logged in');
  }

  try {
    const response = await fetch(`${API_AUCTION_PROFILES}/${user.name}`, {
      method: 'GET',
      headers: headers(true),
    });

    if (!response.ok) {
      const errorMessage = (await response.json()).message || 'Failed to fetch total credit';
      throw new Error(errorMessage);
    }

    const profile = await response.json();
    return profile.credits || 0;
  } catch (error) {
    console.error('Error fetching total credit:', error.message);
    throw error;
  }
}


// Fetch user's listings
export async function readUserListings(name) {
  try {
    const response = await fetch(`${API_AUCTION_PROFILES}/${name}/listings`, {
      method: 'GET',
      headers: headers(true),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch user listings');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching user listings:', error);
    throw error;
  }
}

// Update profile data for the current user
export async function updateProfile(name, data) {
  try {
    const response = await fetch(`${API_AUCTION_PROFILES}/${name}`, {
      method: 'PUT',
      headers: headers(true),
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

// Update user avatar
export async function updateAvatar(imageFile) {
  try {
    const username = JSON.parse(localStorage.getItem('user')).name; // Dynamic username
    const url = `${API_AUCTION_PROFILES}/${username}`;

    // Create FormData object for avatar image
    const formData = new FormData();
    formData.append('avatar', imageFile);

    // Send the PUT request
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers(false, true), // Use headers without Content-Type
      body: formData, // Send avatar file in FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error('Failed to update avatar');
    }

    const data = await response.json();
    console.log('Avatar updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating avatar:', error);
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
    const response = await fetch(`${API_AUCTION_LISTINGS_BIDS(listingId)}`, {
      method: 'GET',
      headers: headers(true),
    });

    if (!response.ok) throw new Error("Failed to fetch bids");

    return await response.json();
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }
}

// Fetch user's bids
export async function readUserBids(name) {
  try {
    const response = await fetch(`${API_AUCTION_PROFILES}/${name}/bids`, {
      method: 'GET',
      headers: headers(true),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch user bids');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching user bids:', error);
    throw error;
  }
}

// Fetch user's winnings
export async function readUserWinnings(name) {
  try {
    const response = await fetch(`${API_AUCTION_PROFILES}/${name}/wins`, {
      method: 'GET',
      headers: headers(true),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch user winnings');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching user winnings:', error);
    throw error;
  }
}
