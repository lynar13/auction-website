import { readListing } from '/src/js/api/listing.js';
import { placeBid } from '/src/js/api/bids.js';
import { readProfile } from '/src/js/api/profile.js'; // Ensure correct import

document.addEventListener('DOMContentLoaded', async () => {
  const listingId = getListingIdFromUrl();

  if (!listingId) {
    console.error('No listing ID provided.');
    document.getElementById('title').textContent = 'Error: No Listing ID';
    document.getElementById('description').textContent =
      'Please provide a valid listing ID in the URL.';
    return;
  }

  // Update user credits in localStorage
  await updateUserCreditsInLocalStorage();

  // Display credits
  updateCreditsDisplay();

  try {
    const listing = await readListing(listingId);
    displayListing(listing);
  } catch (error) {
    console.error('Failed to load listing:', error.message);
    document.getElementById('title').textContent = 'Error Loading Listing';
    document.getElementById('description').textContent =
      'There was an issue loading this listing. Please try again later.';
    return;
  }

  // Handle bid submission
  const bidForm = document.getElementById('bidForm');
  if (bidForm) {
    bidForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const bidAmount = parseFloat(document.getElementById('bidAmount').value);
      if (isNaN(bidAmount) || bidAmount <= 0) {
        showBidMessage(
          'Invalid bid amount. Please enter a valid number.',
          'danger',
        );
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        showBidMessage('You must be logged in to place a bid.', 'danger');
        return;
      }

      try {
        const bidResponse = await placeBid(listingId, bidAmount, token);
        showBidMessage('Bid placed successfully!', 'success');

        // Optionally, update the credits display and bid count
        await updateUserCreditsInLocalStorage();
        updateCreditsDisplay();

        const listing = await readListing(listingId);
        displayListing(listing);
      } catch (error) {
        console.error('Error placing bid:', error.message);
        showBidMessage(error.message, 'danger');
      }
    });
  }
});

/**
 * Update the user's credits in localStorage by fetching the latest profile data.
 */
async function updateUserCreditsInLocalStorage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user || !user.name) {
    console.error('User is not logged in or missing essential data.');
    return;
  }

  try {
    const profile = await readProfile(user.name); // Fetch profile data

    // Safely access credits with fallback
    const credits = profile?.data?.credits ?? 0;

    // Update localStorage with updated user profile including credits
    const updatedUser = { ...user, credits };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  } catch (error) {
    console.error(
      'Failed to update user credits in localStorage:',
      error.message,
    );
  }
}

/**
 * Display the user's credits in the UI.
 */
function updateCreditsDisplay() {
  const user = JSON.parse(localStorage.getItem('user'));
  const creditsDisplay = document.getElementById('credits');
  if (user && user.credits !== undefined && creditsDisplay) {
    creditsDisplay.textContent = `Credits: ${user.credits}`;
  }
}

/**
 * Extract the listing ID from the URL parameters.
 * @returns {string|null} The listing ID, or null if not found.
 */
function getListingIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    console.error('No listing ID found in the URL');
  }
  return id;
}

/**
 * Show a message in the bid message area with a specific type (e.g., success, danger).
 * @param {string} message - The message to display.
 * @param {string} [type='info'] - The type of the message (e.g., 'success', 'danger').
 */
function showBidMessage(message, type = 'info') {
  const bidMessage = document.getElementById('bidMessage');
  if (bidMessage) {
    bidMessage.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    setTimeout(() => {
      bidMessage.innerHTML = '';
    }, 3000);
  }
}

/**
 * Display the listing information in the UI.
 * @param {object} listing - The listing object to display.
 */
function displayListing(listing) {
  const listingData = listing.data;

  document.getElementById('title').textContent =
    listingData.title || 'Untitled';
  document.getElementById('description').textContent =
    listingData.description || 'No description available';

  const mediaGallery = document.getElementById('mediaGallery');
  if (listingData.media && listingData.media.length) {
    mediaGallery.innerHTML = listingData.media
      .map(
        (media) =>
          `<img src="${media.url}" alt="${listingData.title}" class="img-fluid mb-2">`,
      )
      .join('');
  } else {
    mediaGallery.innerHTML = `<p>No media available.</p>`;
  }

  const endsAt = document.getElementById('endsAt');
  endsAt.textContent = listingData.endsAt
    ? `Ends At: ${new Date(listingData.endsAt).toLocaleString()}`
    : 'No expiration date';

  const countElement = document.getElementById('count');
  if (listingData._count && typeof listingData._count.bids === 'number') {
    countElement.textContent = `Bids: ${listingData._count.bids}`;
  } else {
    countElement.textContent = 'No bids available';
  }
}
