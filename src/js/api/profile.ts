// src/js/api/profile.ts
import type { User, Profile, Listing } from '@types/types';
import { fetchWithLocalStorageCache } from '@utils/cachedFetch';
import { headers } from '@api/headers'; // Adjusted to a relative path
import {
  API_AUCTION_PROFILES,
  API_AUCTION_LISTINGS_ID,
} from '@api/constants';

/**
 * Utility to fetch the current user from localStorage
 * @returns {object|null} The parsed user object or null if not found
 */
function getCurrentUser(): User | null {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) as User : null;
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
    return null;
  }
}

/**
 * Fetch profile data for a user
 * @param {string} name - The user's name
 * @returns {Promise<object>} - The user's profile data
 */
export async function readProfile(name: string): Promise<Profile> {
  const url = `${API_AUCTION_PROFILES}/${name}`;
  const options = {
    method: 'GET',
    headers: headers(true),
  };

  try {
    return await fetchWithLocalStorageCache(url, options) as Profile;
  } catch (error) {
    console.error('Error reading profile:', (error as Error).message);
    throw error;
  }
}

/**
 * Fetch the total credit of the current user
 * @returns {Promise<number>} - Total credits of the user
 */
export async function getTotalCredit(): Promise<number> {
  const user = getCurrentUser();
  if (!user || !user.name) {
    throw new Error('User not found or invalid');
  }

  const url = `${API_AUCTION_PROFILES}/${user.name}`;
  const options = {
    method: 'GET',
    headers: headers(true),
  };

  try {
    const profile = await fetchWithLocalStorageCache(url, options) as Profile;
    return profile.credits || 0;
  } catch (error) {
    console.error('Error fetching total credit:', (error as Error).message);
    throw error;
  }
}

/**
 * Fetch the user's listings
 * @param {string} name - The user's name
 * @returns {Promise<Array>} - Array of user listings
 */
export async function readUserListings(name: string): Promise<Listing[]> {
  const url = `https://v2.api.noroff.dev/auction/profiles/${name}/listings`;
  const options = {
    method: 'GET',
    headers: headers(true),
  };

  try {
    return await fetchWithLocalStorageCache(url, options) as Listing[];
  } catch (error) {
    console.error('Error fetching user listings:', (error as Error).message);
    throw error;
  }
}

/**
 * Update the profile data of a user
 * @param {string} name - The user's name
 * @param {object} data - Profile data to update
 * @returns {Promise<object>} - Updated profile data
 */
export async function updateProfile(name: string, data: Partial<Profile>): Promise<Profile> {
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

    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', (error as Error).message);
    throw error;
  }
}

/**
 * Update the user's avatar.
 * @param {File} imageFile - The image file to set as the avatar.
 * @returns {Promise<object>} - Updated profile data.
 */
export async function updateAvatar(imageFile: File): Promise<Profile> {
  const user = getCurrentUser();
  if (!user || !user.name) throw new Error('User not found');

  const url = `${API_AUCTION_PROFILES}/${user.name}`;

  try {
    // Upload the image to Cloudinary
    const uploadedImageUrl = await uploadImageToCloudinary(imageFile);

    // Prepare payload with Cloudinary URL
    const payload = {
      avatar: {
        url: uploadedImageUrl,
        alt: `${user.name}'s avatar`,
      },
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update avatar');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating avatar:', (error as Error).message);
    throw error;
  }
}

/**
 * Upload image to an external service and return its URL.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
async function uploadImageToCloudinary(imageFile: File): Promise<string> {
  const CLOUDINARY_UPLOAD_URL =
    'https://api.cloudinary.com/v1_1/dfe8rtu97/image/upload';
  const UPLOAD_PRESET = 'avatar'; // Replace with your Cloudinary upload preset

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to hosting service');
    }

    const data = await response.json();
    return data.secure_url; // The hosted URL for the image
  } catch (error) {
    console.error('Error uploading image:', (error as Error).message);
    throw error;
  }
}

/**
 * Add a bid to a listing
 * @param {string} listingId - The listing ID
 * @param {number} amount - The bid amount
 * @returns {Promise<object>} - Updated listing data
 */
export async function addBid(listingId: string, amount: number): Promise<any> {
  const user = getCurrentUser();
  if (!user) throw new Error('User not logged in');

  try {
    const response = await fetch(`${API_AUCTION_LISTINGS_ID(listingId)}/bids`, {
      method: 'POST',
      headers: headers(true, true),
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add bid');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding bid:', (error as Error).message);
    throw error;
  }
}

/**
 * Fetch the user's bids
 * @param {string} name - The user's name
 * @returns {Promise<Array>} - Array of user's bids
 */
export async function readUserBids(name: string): Promise<any[]> {
  const url = `${API_AUCTION_PROFILES}/${name}/bids`;
  const options = {
    method: 'GET',
    headers: headers(true),
  };

  try {
    return await fetchWithLocalStorageCache(url, options) as any[];
  } catch (error) {
    console.error('Error fetching user bids:', (error as Error).message);
    throw error;
  }
}

/**
 * Fetch the user's winnings
 *
 */
export async function readUserWinnings(name: string): Promise<any[]> {
  const url = `${API_AUCTION_PROFILES}/${name}/wins`;
  const options = {
    method: 'GET',
    headers: headers(true),
  };

  try {
    return await fetchWithLocalStorageCache(url, options) as any[];
  } catch (error) {
    console.error('Error fetching user winnings:', (error as Error).message);
    throw error;
  }
}
