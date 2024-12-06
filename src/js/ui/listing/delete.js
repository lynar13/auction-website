import { deleteListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', () => {
  const deleteButton = document.getElementById('deleteButton');
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) {
    console.error('No listing ID specified in URL.');
    return;
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', async () => {
      try {
        const confirmed = confirm('Are you sure you want to delete this listing?');
        if (!confirmed) return;

        // Attempt to delete the listing
        const result = await deleteListing(listingId);
        console.log('Delete result:', result);
        
        alert('Listing deleted successfully');
        
        // Redirect to listings list after deletion with updated path for GitHub Pages
        window.location.href = '/listings/index.html';
      } catch (error) {
        console.error('Failed to delete listing:', error);
        alert('Failed to delete listing. Please try again.');
      }
    });
  } else {
    console.error('Delete button not found in the DOM.');
  }
});
