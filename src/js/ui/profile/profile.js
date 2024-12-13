// src/js/ui/profile/profile.js

import {
  readProfile,
  readUserListings,
  updateAvatar,
  readUserBids,
  readUserWinnings,
} from '/src/js/api/profile.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user || !user.name) {
    alert("You must log in to access your profile.");
    window.location.href = '/auction-website/auth/login/index.html';
    return;
  }

  try {
    // Fetch profile data
    const profileData = await readProfile(user.name);
    console.log('Fetched profile data:', profileData);

    if (profileData && profileData.data) {
      const { name, credits, avatar } = profileData.data;

      // Update localStorage with the nested profile data
      localStorage.setItem('user', JSON.stringify(profileData.data));

      // Update the DOM
      const usernameElement = document.getElementById('username');
      const avatarElement = document.getElementById('avatar');
      const creditsElement = document.getElementById('credits');

      if (usernameElement) {
        usernameElement.textContent = name || "Unknown User";
      } else {
        console.error("Username element not found in DOM.");
      }

      if (avatarElement) {
        avatarElement.src = avatar?.url || "/auction-website/public/images/avatar.jpeg";
      } else {
        console.error("Avatar element not found in DOM.");
      }

      if (creditsElement) {
        creditsElement.textContent = `Credits: ${credits || 0}`;
      } else {
        console.error("Credits element not found in DOM.");
      }
    } else {
      throw new Error("Profile data is incomplete or missing.");
    }
  } catch (error) {
    console.error("Error reading profile:", error.message);
    document.getElementById('credits').textContent = "Credits: Unavailable";
  }

  // Fetch and display user listings
  try {
    const listings = await readUserListings(user.name);
    const listingsContainer = document.getElementById('userListings');
    listingsContainer.innerHTML = listings.length
      ? listings.map(listing => `
        <div class="card">
          <img src="${listing.media?.[0]?.url || 'https://via.placeholder.com/400'}" alt="${listing.title}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description || 'No description available'}</p>
            <a href="/auction-website/listing/index.html?id=${listing.id}" class="btn btn-primary">View Listing</a>
          </div>
        </div>
      `).join('')
      : '<p>No listings found.</p>';
  } catch (error) {
    console.error("Error fetching user listings:", error.message);
  }

  // Fetch and display user bids
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
    console.error("Error fetching user bids:", error.message);
  }

  // Fetch and display user winnings
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
    console.error("Error fetching user winnings:", error.message);
  }

  // Handle avatar update
  const avatarInput = document.getElementById('avatarInput');
  const updateAvatarButton = document.getElementById('updateAvatarButton');

  if (updateAvatarButton && avatarInput) {
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
          document.getElementById('avatar').src = updatedUser.avatar.url;
          alert('Avatar updated successfully!');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        alert('Failed to update avatar. Please try again.');
        console.error('Error updating avatar:', error.message);
      }
    });
  } else {
    console.error("Avatar update elements not found in DOM.");
  }
});
