// src/js/ui/listing/viewList.js
import { readListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', async () => {
  const postId = getPostIdFromUrl();
  if (postId) {
    try {
      const post = await readListing(postId);
      displayPost(post);
    } catch (error) {
      console.error('Failed to load post:', error);
    }
  } else {
    console.error('No post ID found in the URL');
  }
});

// Get listing ID from the URL
function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Display the listing content
function displayPost(post) {
  const postData = post.data; // Access the nested data property
  
  document.getElementById('title').textContent = postData.title || 'Untitled';
  document.getElementById('body').textContent = postData.body || 'No Content Available';
  document.getElementById('tags').textContent = 'Tags: ' + (postData.tags.length ? postData.tags.join(', ') : 'No Tags');
  
  // Update the Edit Post link with the post ID for GitHub Pages
  const editLink = document.getElementById('editLink');
  editLink.href = `/listing/edit/index.html?id=${postData.id}`;
}
