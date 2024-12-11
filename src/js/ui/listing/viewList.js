import { readListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', async () => {
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

  document.getElementById('title').textContent =
    listingData.title || 'Untitled';
  document.getElementById('description').textContent =
    listingData.description || 'No description available';

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

  const countElement = document.getElementById('count');

  // Check if _count exists and has the "bids" property
  if (listingData._count && typeof listingData._count.bids === 'number') {
    countElement.textContent = `Bids: ${listingData._count.bids}`;
  } else {
    // Fallback if _count or bids is not available
    countElement.textContent = 'No bids available';
  }
}
