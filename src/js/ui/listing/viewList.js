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

  document.getElementById('title').textContent = listingData.title || 'Untitled';
  document.getElementById('description').textContent = listingData.description || 'No description available';

  const mediaGallery = document.getElementById('mediaGallery');
  if (listingData.media && listingData.media.length) {
    mediaGallery.innerHTML = listingData.media
      .map((media) => `<img src="${media}" alt="${listingData.title}" class="img-fluid mb-2">`)
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
