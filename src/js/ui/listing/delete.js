import { deleteListing } from '@api/listing.js';

document.addEventListener('DOMContentLoaded', () => {
  const deleteButton = document.getElementById('deleteButton');
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  /**
   * Check if a listing ID is present in the URL.
   * Logs an error and exits if no ID is found.
   */
  if (!postId) {
    console.error('No listing ID specified in URL.');
    return;
  }

  /**
   * Attach a click event listener to the delete button.
   * Handles the deletion of a listing after user confirmation.
   */
  if (deleteButton) {
    deleteButton.addEventListener('click', async () => {
      try {
        // Confirm deletion from the user
        const confirmed = confirm('Are you sure you want to delete this listing?');
        if (!confirmed) return;

        /**
         * Attempt to delete the listing by ID.
         * On success, display an alert and redirect the user to the listings page.
         * On failure, display an error message to the user.
         */
        const result = await deleteListing(listingId);
    
        alert('Listing deleted successfully');
        
        // Redirect to listings list after deletion with updated path for GitHub Pages
        window.location.href = '/profile/index.html';
      } catch (error) {
        console.error('Failed to delete listing:', error);
        alert('Failed to delete listing. Please try again.');
      }
    });
  } else {
    console.error('Delete button not found in the DOM.');
  }
});
