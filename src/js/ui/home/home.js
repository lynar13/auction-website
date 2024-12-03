// src/js/ui/home/home.js
import { readListings, createListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const postsPerPage = 12;

  const postList = document.getElementById('postList');
  const pagination = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const sortOptions = document.getElementById('sortOptions');
  const createPostForm = document.getElementById('createPostForm');
  const postTitle = document.getElementById('postTitle');
  const postContent = document.getElementById('postContent');
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');

  // Hide login/register buttons if user is logged in
  const user = localStorage.getItem('user');
  if (user) {
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    logoutButton.style.display = 'block'; // Show logout button
  } else {
    logoutButton.style.display = 'none'; // Hide logout button if user is not logged in
  }

  // Fetch and render posts
  async function loadPosts(page = 1, searchTerm = '', sortOption = '') {
    try {
      const posts = await readListings(page, 12, searchTerm, sortOption);
      displayListings(posts); // Delegate rendering to the displayListings function
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }

  // Function to display listings
  function displayListings(posts) {
      postList.innerHTML = ''; // Clear existing content
      posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'col-md-6 mb-4';
        postCard.innerHTML = `
          <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${post.title || 'Untitled'}</h5>
          <p class="card-text">${post.body ? post.body.slice(0, 100) + '...' : 'No Content Available'}</p>
          ${
            localStorage.getItem('user')
              ? `<a href="/listing/index.html?id=${post.id}" class="btn btn-primary">Place Bid</a>`
              : '<p class="text-muted">Log in to place a bid.</p>'
          }
        </div>
      </div>
    `;
        postList.appendChild(postCard);
      });
    
  // Handle search
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    loadPosts(1, searchTerm, sortOptions.value); // Trigger post loading with search term
  });

  // Handle sort
  sortOptions.addEventListener('change', () => {
    const sortOption = sortOptions.value;
    loadPosts(1, searchInput.value, sortOption); // Trigger post loading with sort option
  });

  // Handle create new post
  createPostForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPost = {
      title: postTitle.value,
      body: postContent.value,
    };

    try {
      await createListing(newPost);
      postTitle.value = '';
      postContent.value = '';
      loadPosts(1); // Reload posts after creating a new one
    } catch (error) {
      console.error('Failed to create a new post:', error);
    }
  });

  // Define the renderPagination function
  function renderPagination(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    pagination.innerHTML = ''; // Clear previous pagination buttons
    
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('li');
      pageButton.className = `page-item ${currentPage === i ? 'active' : ''}`;
      pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      
      // Event listener to change page
      pageButton.addEventListener('click', (event) => {
        event.preventDefault();
        currentPage = i;
        loadPosts(currentPage, searchInput.value, sortOptions.value);
        renderPagination(totalPosts); // Re-render pagination to update active state
      });
  
      pagination.appendChild(pageButton);
    }
  }
}  
  // Initial load
  loadPosts(currentPage);
});
