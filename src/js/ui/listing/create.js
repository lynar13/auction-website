// src/js/ui/listing/create.js
import { createListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createPostForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Convert form data into an object
      const formData = new FormData(form);
      const postData = Object.fromEntries(formData.entries());

      // Convert tags to an array (assuming tags are comma-separated)
      postData.tags = postData.tags ? postData.tags.split(',').map(tag => tag.trim()) : [];
      postData.media = postData.media ? postData.media.split(',').map(url => url.trim()) : [];
      try {
        const post = await createListing(postData);
        
        // Redirect to the newly created post's view page with updated path for GitHub Pages
        window.location.href = `/listing/index.html?id=${post.id}`;
      } catch (error) {
        console.error('Error creating list:', error);
        alert('Failed to create listing: ' + error.message);
      }
    });
  } else {
    console.error("Create listing form not found in the DOM");
  }
});
