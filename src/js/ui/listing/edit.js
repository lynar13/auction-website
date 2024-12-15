import { readListing, updateListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id');
  console.log('Listing ID:', listingId); // Debugging to confirm correct ID

  const form = document.getElementById('editListingForm');

  if (!listingId) {
    alert('No listing ID specified.');
    return;
  }

  try {
    const listing = await readListing(listingId);
    if (!listing || !listing.data) throw new Error('Listing data not found');

    const listingData = listing.data;

    if (form) {
      form.querySelector('#title').value = listingData.title || '';
      form.querySelector('#description').value = listingData.description || '';
      form.querySelector('#tags').value = listingData.tags
        ? listingData.tags.join(', ')
        : '';
      form.querySelector('#media').value = listingData.media
        ? listingData.media.map((item) => item.url).join('\n')
        : '';
      form.querySelector('#endDate').value = listingData.endsAt
        ? new Date(listingData.endsAt).toISOString().split('T')[0]
        : '';

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const updatedData = Object.fromEntries(formData.entries());

        updatedData.tags = updatedData.tags
          .split(',')
          .map((tag) => tag.trim());
        updatedData.media = updatedData.media
          .split('\n')
          .filter((url) => url.trim())
          .map((url) => ({ url: url.trim() }));

        updatedData.endsAt = updatedData.endDate
          ? new Date(updatedData.endDate).toISOString()
          : null;

        delete updatedData.endDate; // Remove unused key

        try {
          await updateListing(listingId, updatedData);
          alert('Listing updated successfully!');
          window.location.href = `/auction-website/profile/index.html?id=${listingId}`;
        } catch (error) {
          console.error('Failed to update listing:', error.message);
          alert('Failed to update listing.');
        }
      });
    } else {
      console.error('Form element not found');
    }
  } catch (error) {
    console.error('Failed to load listing data:', error.message);
    alert('Failed to load listing.');
  }
});
