import { readListing, updateListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id');
  const form = document.getElementById('editlListingForm');
  
  if (!postId) {
    alert('No listing ID specified.');
    return;
  }

  try {
    const listing = await readListing(listingId);
    if (!listing || !listing.data) throw new Error('Listing data not found');

    const listingData = listing.data; // Access the nested data property

    // Ensure that form and its fields exist before populating them
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
        mediaField.value = Array.isArray(listingData.media)? listingData.media.join('\n') : '';
      }
      if (endsAtField) {
        endsAtField.valueAsDate = listingData.endsAt? new Date(listingData.endsAt) : null;
      }

      // Handle form submission
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const updatedData = Object.fromEntries(formData.entries());

        // Convert the tags string into an array
        updatedData.tags = updatedData.tags.split(',').map(tag => tag.trim());
        
        try {
          // Update the post using the modified payload structure
          await updateListing(listingId, updatedData);
          window.location.href = `/listing/index.html?id=${listingId}`;
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
