// src/js/ui/profile/profile.js
import {
  readProfile,
  readUserListings,
  updateAvatar,
  readUserBids,
  readUserWinnings,
  readOthersListings,
} from '/src/js/api/profile.js';
import { getTotalCredit } from '/src/js/api/profile.js';

document.addEventListener('DOMContentLoaded', async () => {
  const userData = localStorage.getItem('user');

  if (userData) {
    try {
      const user = JSON.parse(userData);
      const token = localStorage.getItem('token');

      // Validate token and load user data
      if (!token || !user.username) {
        throw new Error('Invalid token or user data');
      }

      // Continue if token is valid
      const profile = await readProfile(user.username);
      if (profile && profile.credits !== undefined) {
        user.credits = profile.credits;
        localStorage.setItem('user', JSON.stringify(user)); // Update localStorage

        document.getElementById('username').textContent = profile.username;
        document.getElementById('profileImage').src =
          profile.avatar || './images/profile.jpeg';
        document.getElementById('credits').textContent =
          `Credits: ${profile.credits || 1000}`;
        document.getElementById('listingsCount').textContent =
          `Listings: ${profile._count.listings || 0}`;
        document.getElementById('winsCount').textContent =
          `Wins: ${profile._count.wins || 0}`;
      } else {
        throw new Error('Invalid profile data');
      }
    } catch (error) {
      console.error(
        'Error validating token or loading profile:',
        error.message,
      );
      localStorage.removeItem('token');
      window.location.href = '/auction-website/auth/login/index.html';
    }
  }

  // Load user listings
  try {
    const listings = await readUserListings(user.username);
    const userListingsContainer = document.getElementById('userListings');
    if (Array.isArray(listings)) {
      userListingsContainer.innerHTML = listings
        .map(
          (listing) => `
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">${listing.title}</h5>
              <p class="card-description">${listing.description}</p>
              <p class="text-muted"><strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
              <a href="/auction-website/listing/edit.html?id=${listing.id}" class="btn btn-primary">Edit Listing</a>
              <a href="/auction-website/listing/delete.html?id=${listing.id}" class="btn btn-danger">Delete Listing</a>
              <a href="/auction-website/listing/index.html?id=${listing.id}" class="btn btn-primary">View Listing</a>
            </div>
          </div>
        </div>
      `,
        )
        .join('');
    } else {
      throw new Error('Listings data is not an array');
    }
  } catch (error) {
    console.error('Error loading listings:', error.message);
  }

  // Display user's bids
  try {
    const bids = await readUserBids(user.username);
    const bidsContainer = document.getElementById('userBids');
    bidsContainer.innerHTML = bids
      .map(
        (bid) => `
      <div class="card">
        <h5>Listing ID: ${bid.listingId}</h5>
        <p>Bid Amount: ${bid.amount}</p>
      </div>
    `,
      )
      .join('');
  } catch (error) {
    console.error('Error loading bids:', error);
  }

  // Display user's winnings
  try {
    const winnings = await readUserWinnings(user.username);
    const winningsContainer = document.getElementById('userWinnings');
    winningsContainer.innerHTML = winnings
      .map(
        (win) => `
      <div class="card">
        <h5>${win.title}</h5>
        <p>Winning Bid: ${win.amount}</p>
      </div>
    `,
      )
      .join('');
  } catch (error) {
    console.error('Error loading winnings:', error);
  }

  // Display other users' listings
  try {
    const otherListings = await readOthersListings();
    const othersContainer = document.getElementById('othersListings');
    othersContainer.innerHTML = otherListings
      .map(
        (listing) => `
      <div class="card">
        <h5>${listing.title}</h5>
        <p>${listing.description}</p>
        <p>Bids: ${listing._count.bids || 0}</p>
        <a href="/auction-website/listing/index.html?id=${listing.id}" class="btn btn-primary">View Listing</a>
      </div>
    `,
      )
      .join('');
  } catch (error) {
    console.error('Error loading other listings:', error);
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

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const updatedUser = await updateAvatar(reader.result);
        if (updatedUser && updatedUser.avatar) {
          document.getElementById('profileImage').src = updatedUser.avatar;
          alert('Avatar updated successfully!');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        alert('Failed to update avatar. Please try again.');
        console.error('Error updating avatar:', error.message);
      }
    };
    reader.readAsDataURL(file);
  });

  // Handle total credit fetch
  try {
    const totalCredits = await getTotalCredit();
    document.getElementById('credits').textContent = `Credits: ${totalCredits}`;
  } catch (error) {
    console.error('Error fetching total credit:', error);
  }
});
