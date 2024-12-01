import { readProfile, readUserListings, updateAvatar, getTotalCredit } from '/src/js/api/profile.js';

document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/auth/login/index.html';
    return;
  }

  const { username } = user;

  // Load profile data
  try {
    const profile = await readProfile(username);
    document.getElementById('username').textContent = profile.username;
    document.getElementById('profileImage').src = profile.avatar || '/images/profile.jpeg';
    document.getElementById('followersCount').textContent = profile.followers?.length || 0;
    document.getElementById('followingCount').textContent = profile.following?.length || 0;
    document.getElementById('credits').textContent = `Credits: ${await getTotalCredit()}`;
  } catch (error) {
    console.error('Error loading profile:', error);
  }

  // Load user listings
  try {
    const listings = await readUserListings(username);
    const userPostsContainer = document.getElementById('userPosts');
    userPostsContainer.innerHTML = listings.map(listing => `
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description}</p>
            <a href="/listing/index.html?id=${listing.id}" class="btn btn-primary">View Listing</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading listings:', error);
  }

  // Handle avatar update
  const avatarInput = document.getElementById('avatarInput');
  const updateAvatarButton = document.getElementById('updateAvatarButton');

  updateAvatarButton.addEventListener('click', () => avatarInput.click());
  avatarInput.addEventListener('change', async () => {
    const file = avatarInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const updatedUser = await updateAvatar(reader.result);
          document.getElementById('profileImage').src = updatedUser.avatar;
          alert('Avatar updated successfully!');
        } catch (error) {
          console.error('Error updating avatar:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  });
});
