// src/js/ui/profile/profile.js
import { readProfile, readUserListings, updateAvatar } from '/src/js/api/profile.js';
import { getTotalCredit } from '/src/js/api/profile.js';

document.addEventListener('DOMContentLoaded', async () => {
  const userString = localStorage.getItem('user');

  // Check for user data in localStorage
  if (!userString) {
    alert('User not found. Please login again.');
    window.location.href = '/auth/login/index.html';
    return;
  }

  let user;
  try {
    user = JSON.parse(userString);
    if (!user || typeof user !== 'object' || !user.name) {
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    alert('Invalid user data. Redirecting to login.');
    window.location.href = '/auth/login/index.html';
    return;
  }
    try {
    // Continue if token is valid
    const profile = await readProfile();
    if (profile && profile.credits !== undefined) {
      user.credits = profile.credits;
      localStorage.setItem('user', JSON.stringify(user)); // Update localStorage
      document.getElementById('username').textContent = profile.username;
      document.getElementById('profileImage').src = profile.avatar || '/images/profile.jpeg';
      document.getElementById('credits').textContent = `Credits: ${profile.credits || 0}`;
    } else {
      throw new Error('Invalid profile data');
    }
  } catch (error) {
    console.error('Error validating token or loading profile:', error.message);
    localStorage.removeItem('token');
    window.location.href = '/auth/login/index.html';
  }

  // Load user listings
  try {
    const listings = await readUserListings(user.username);
    const userListingsContainer = document.getElementById('userListings');
    if (Array.isArray(listings)) {
      userListingsContainer.innerHTML = listings.map(listing => `
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">${listing.title}</h5>
              <p class="card-description">${listing.description}</p>
              <p class="text-muted"><strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
              <a href="/listing/edit.html?id=${listing.id}" class="btn btn-primary">Edit Listing</a>
              <a href="/listing/delete.html?id=${listing.id}" class="btn btn-danger">Delete Listing</a>
              <a href="/listing/index.html?id=${listing.id}" class="btn btn-primary">View Listing</a>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      throw new Error('Listings data is not an array');
    }
  } catch (error) {
    console.error('Error loading listings:', error.message);
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

  
  

