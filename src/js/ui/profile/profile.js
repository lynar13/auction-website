// src/js/ui/profile/profile.js

import {
  readProfile,
  readUserListings,
  updateAvatar,
  readUserBids,
  readUserWinnings,
} from '/src/js/api/profile.js';
import { getTotalCredit } from '/src/js/api/profile.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Validate and initialize user
  let user = localStorage.getItem('user');
  if (!user) {
    console.error('User not found in localStorage. Redirecting to login.');
    alert('You must log in first.');
    window.location.href = '/auction-website/auth/login/index.html';
    return;
  }

  try {
    user = JSON.parse(user);
  } catch (error) {
    console.error('Invalid user data in localStorage:', error);
    alert('Invalid user data. Please log in again.');
    localStorage.removeItem('user');
    window.location.href = '/auction-website/auth/login/index.html';
    return;
  }

  // Load profile data
  try {
    const profile = await readProfile(user.name);
    if (profile) {
      localStorage.setItem('user', JSON.stringify(profile));
      user = profile;

      // Update UI
      document.getElementById('username').textContent = user.name || 'Unknown';
      document.getElementById('avatar').src = user.avatar?.url || './images/profile.jpeg';
      document.getElementById('credits').textContent = `Credits: ${user.credits || 0}`;
      document.getElementById('listingsCount').textContent = `Listings: ${user._count?.listings || 0}`;
      document.getElementById('winsCount').textContent = `Wins: ${user._count?.wins || 0}`;
    } else {
      throw new Error('Invalid profile data');
    }
  } catch (error) {
    console.error('Error validating token or loading profile:', error.message);
  }

  // Load user listings
  try {
    const listings = await readUserListings(user.name);
    const userListings = document.getElementById('userListings');

    listings.forEach((listing) => {
      if (!listing || !listing.title || !listing.id) return;

      const postCard = document.createElement('div');
      postCard.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';

      const mediaGallery = listing.media?.[0]?.url || 'https://via.placeholder.com/400';
      const endsAt = listing.endsAt
        ? new Date(listing.endsAt).toLocaleString()
        : 'No expiration date';

      postCard.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${mediaGallery}" alt="${listing.title}" class="img-fluid rounded mb-3">
          <div class="card-body">
            <h5 class="card-title">${listing.title || 'Untitled'}</h5>
            <p class="card-text">${listing.description ? listing.description.slice(0, 100) + '...' : 'No description available'}</p>
            <p class="text-muted"><strong>Ends At:</strong> ${endsAt}</p>
            <a href="/auction-website/listing/index.html?id=${encodeURIComponent(listing.id)}" class="btn btn-primary mt-auto">Place a Bid</a>
          </div>
        </div>
      `;
      userListings.appendChild(postCard);
    });
  } catch (error) {
    console.error('Failed to load listings:', error.message);
  }

  // Display user's bids
  try {
    const bids = await readUserBids(user.name);
    const bidsContainer = document.getElementById('userBids');
    bidsContainer.innerHTML = bids.length
      ? bids.map(bid => `
        <div class="card">
          <h5>Listing ID: ${bid.listingId}</h5>
          <p>Bid Amount: ${bid.amount}</p>
        </div>
      `).join('')
      : '<p>No bids found.</p>';
  } catch (error) {
    console.error('Error loading bids:', error.message);
  }

  // Display user's winnings
  try {
    const winnings = await readUserWinnings(user.name);
    const winningsContainer = document.getElementById('userWinnings');
    winningsContainer.innerHTML = winnings.length
      ? winnings.map(win => `
        <div class="card">
          <h5>${win.title}</h5>
          <p>Winning Bid: ${win.amount}</p>
        </div>
      `).join('')
      : '<p>No winnings found.</p>';
  } catch (error) {
    console.error('Error loading winnings:', error.message);
  }

  // Handle avatar update
  const avatarInput = document.getElementById('avatarInput');
  const updateAvatarButton = document.getElementById('updateAvatarButton');

  updateAvatarButton.addEventListener('click', () => avatarInput.click());
  avatarInput.addEventListener('change', async () => {
    const file = avatarInput.files[0];
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      const updatedUser = await updateAvatar(file);
      if (updatedUser?.avatar?.url) {
        document.getElementById('profileImage').src = updatedUser.avatar.url;
        alert('Avatar updated successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      alert('Failed to update avatar. Please try again.');
      console.error('Error updating avatar:', error.message);
    }
  });

  // Handle total credit fetch
  try {
    const totalCredits = await getTotalCredit();
    if (typeof totalCredits === 'number') {
      document.getElementById('credits').textContent = `Credits: ${totalCredits}`;
    } else {
      throw new Error('Invalid credit data');
    }
  } catch (error) {
    console.error('Error fetching total credit:', error.message);
    document.getElementById('credits').textContent = 'Credits: Unavailable';
  }
});
