import { readListing, updateListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const form = document.getElementById('editPostForm');
  
  if (!postId) {
    alert('No post ID specified.');
    return;
  }

  try {
    const post = await readListing(postId);
    if (!post || !post.data) throw new Error('Post data not found');

    const postData = post.data; // Access the nested data property

    // Ensure that form and its fields exist before populating them
    if (form) {
      const titleField = form.querySelector('#title');
      const bodyField = form.querySelector('#body');
      const tagsField = form.querySelector('#tags');

      if (titleField) {
        titleField.value = postData.title || 'No Title Available';
      }
      if (bodyField) {
        bodyField.value = postData.body || 'No Content Available';
      }
      if (tagsField) {
        tagsField.value = Array.isArray(postData.tags) ? postData.tags.join(', ') : '';
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
          await updateListing(postId, updatedData);
          window.location.href = `/listing/index.html?id=${postId}`;
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
