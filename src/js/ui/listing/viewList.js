import { readListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', async () => {

  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');

  // Check if the user is logged in (by checking token or user data)
  const token = localStorage.getItem('token'); // Or use another method to check login status
  const user = JSON.parse(localStorage.getItem('user'));

  // If user is logged in, hide Login and Register buttons, and show Logout button
  if (token && user) {
    loginButton.style.display = 'none';  // Hide Login button
    registerButton.style.display = 'none';  // Hide Register button
    logoutButton.style.display = 'inline-block';  // Show Logout button
  } else {
    // If user is not logged in, hide Logout button and show Login/Register buttons
    loginButton.style.display = 'inline-block';  // Show Login button
    registerButton.style.display = 'inline-block';  // Show Register button
    logoutButton.style.display = 'none';  // Hide Logout button
  }

  const listingId = getListingIdFromUrl();
  if (listingId) {
    try {
      const listing = await readListing(listingId);
      displayListing(listing);
    } catch (error) {
      console.error('Failed to load listing:', error);
    }
  } else {
    console.error('No listing ID found in the URL');
  }
});

// Get listing ID from the URL
function getListingIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Display the listing content
function displayListing(listing) {
  const listingData = listing.data;

  document.getElementById('title').textContent = listingData.title || 'Untitled';
  document.getElementById('description').textContent = listingData.description || 'No description available';

  const mediaGallery = document.getElementById('mediaGallery');
  if (listingData.media && listingData.media.length) {
    mediaGallery.innerHTML = listingData.media
      .map((media) => {
        // Extract the URL and use it in the image tag
        const imageUrl = media.url; // Access the URL field from each media object
        return `<img src="${imageUrl}" alt="${listingData.title}" class="img-fluid mb-2">`;
      })
      .join('');
  } else {
    mediaGallery.innerHTML = `<p>No media available.</p>`;
  }

  const endsAt = document.getElementById('endsAt');
  endsAt.textContent = listingData.endsAt
    ? `Ends At: ${new Date(listingData.endsAt).toLocaleString()}`
    : 'No expiration date';

  const tags = document.getElementById('tags');
  tags.textContent = 'Tags: ' + (listingData.tags.length ? listingData.tags.join(', ') : 'No Tags');
}
