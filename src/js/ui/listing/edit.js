import { readListing, updateListing } from './src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id');
  const form = document.getElementById('editlListingForm');

  /**
   * Check if a listing ID is present in the URL.
   * Alerts the user if the listing ID is missing and exits.
   */
  if (!listingId) {
    alert('No listing ID specified.');
    return;
  }

  try {
    /**
     * Fetch the listing details from the server.
     * @throws Will throw an error if the listing data is not found.
     */
    const listing = await readListing(listingId);
    if (!listing || !listing.data) throw new Error('Listing data not found');

    const listingData = listing.data; // Access the nested data property

    /**
     * Populate the edit form fields with the fetched listing data.
     * Ensures all form fields exist before setting their values.
     */
    if (form) {
      const titleField = form.querySelector('#title');
      const descriptionField = form.querySelector('#description');
      const endsAtField = form.querySelector('#endsAt');
      const mediaField = form.querySelector('#media');
      const tagsField = form.querySelector('#tags');

      if (titleField) {
        titleField.value = listingData.title || 'No Title Available';
      }
      if (descriptionField) {
        descriptionField.value = listingData.description || 'No Content Available';
      }
      if (tagsField) {
        tagsField.value = Array.isArray(listingData.tags) ? listingData.tags.join(', ') : '';
      }
      if (mediaField) {
        mediaField.value = Array.isArray(listingData.media) ? listingData.media.join('\n') : '';
      }
      if (endsAtField) {
        endsAtField.valueAsDate = listingData.endsAt ? new Date(listingData.endsAt) : null;
      }

      /**
       * Handle the form submission to update the listing.
       * @param {Event} event - The form submission event.
       */
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const updatedData = Object.fromEntries(formData.entries());

        // Convert the tags string into an array
        updatedData.tags = updatedData.tags.split(',').map(tag => tag.trim());

        try {
          /**
           * Call the updateListing API to update the listing details.
           * Redirects to the listing page on success.
           */
          await updateListing(listingId, updatedData);
          window.location.href = `/auction-website/listing/index.html?id=${listingId}`;
        } catch (error) {
          console.error('Failed to update listing:', error);
          alert('Failed to update listing');
        }
      });
    } else {
      console.error('Form element not found');
    }
  } catch (error) {
    console.error('Failed to load listing data:', error);
    alert('Failed to load listing');
  }
});
