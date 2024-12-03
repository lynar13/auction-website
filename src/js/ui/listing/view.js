// src/js/ui/listing/view.js
import { readListings } from '/src/js/api/listing.js';

let currentPage = 1;
let postsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
  loadPosts(currentPage, postsPerPage);
  setupPaginationControls();
});

// Load listings based on the current page and limit
async function loadPosts(page, limit) {
  try {
    const posts = await readListings(page, limit);
    const postList = document.getElementById('postList');
    postList.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.className = 'col-md-4 mb-4';
      postCard.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${post.title || 'Untitled'}</h5>
            <p class="card-text">${post.body ? post.body.slice(0, 100) + '...' : 'No Content Available'}</p>
            <a href="/listing/index.html?id=${post.id}" class="btn btn-primary">Read More</a>
          </div>
        </div>
      `;
      postList.appendChild(postCard);
    });
  } catch (error) {
    console.error('Failed to load posts:', error);
  }
}

// Set up pagination control listeners
function setupPaginationControls() {
  const paginationButtons = document.querySelectorAll('[data-page]');
  const limitButtons = document.querySelectorAll('[data-limit]');

  // Ensure buttons are present in the DOM before adding listeners
  if (paginationButtons.length > 0) {
    paginationButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const page = parseInt(btn.getAttribute('data-page'));
        goToPage(page);
      });
    });
  }

  if (limitButtons.length > 0) {
    limitButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const limit = parseInt(btn.getAttribute('data-limit'));
        setPostsPerPage(limit);
      });
    });
  }
}

// Go to a specific page
function goToPage(page) {
  currentPage = page;
  loadPosts(currentPage, postsPerPage);
  updateUrlParams();
}

// Set the number of posts per page
function setPostsPerPage(limit) {
  postsPerPage = limit;
  currentPage = 1; // Reset to the first page
  loadPosts(currentPage, postsPerPage);
  updateUrlParams();
}

// Update URL parameters to reflect the current page and limit
function updateUrlParams() {
  const url = new URL(window.location);
  url.searchParams.set('page', currentPage);
  url.searchParams.set('limit', postsPerPage);
  window.history.pushState({}, '', url);
}
