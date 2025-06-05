import { readListings } from '@api/listing';

let currentPage = 1;
let listingsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
  loadListings(currentPage, listingsPerPage);
  setupPaginationControls();
});

/**
 * Load and display listings based on the current page and limit.
 * Fetches data from the server and dynamically updates the DOM.
 *
 * @param {number} page - The current page to load.
 * @param {number} limit - The number of listings to load per page.
 */
async function loadListings(page, limit) {
  try {
    const listings = await readListings(page, limit);
    const listingList = document.getElementById('listingList');
    listingList.innerHTML = ''; // Clear existing listings

    listings.forEach((listing) => {
      const postCard = document.createElement('div');
      postCard.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';

      const mediaGallery = listing.media?.[0]?.url
        ? `<img src="${listing.media[0].url}" alt="${listing.title}" class="img-fluid rounded mb-3">`
        : `<img src="https://via.placeholder.com/400" alt="Default Image" class="img-fluid rounded mb-3">`;

      const endsAt = listing.endsAt
        ? `<p class="text-muted"><strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>`
        : `<p class="text-muted"><strong>Ends At:</strong> No expiration date</p>`;

      const listingLink = listing.id
        ? `<a href="/listing/index.html?id=${encodeURIComponent(listing.id)}" class="btn btn-primary mt-auto">Place a Bid</a>`
        : '<p class="text-muted small">No valid listing ID available.</p>';

      postCard.innerHTML = `
        <div class="card h-100 shadow-sm">
          ${mediaGallery}
          <div class="card-body">
            <h4 class="card-title">${listing.title || 'Untitled'}</h4>
            <p class="card-text">${listing.description ? listing.description.slice(0, 100) + '...' : 'No description available'}</p>
            ${endsAt}
            ${listingLink}
            <a href="/listing/index.html?id=${listing.id}" class="btn btn-primary">Read More</a>
          </div>
        </div>
      `;

      listingList.appendChild(postCard);
    });
  } catch (error) {
    console.error('Failed to load listings:', error);
  }
}

/**
 * Set up event listeners for pagination and limit controls.
 * Handles user interaction to navigate between pages or change the number of items per page.
 */
function setupPaginationControls() {
  const paginationButtons = document.querySelectorAll('[data-page]');
  const limitButtons = document.querySelectorAll('[data-limit]');

  if (paginationButtons.length > 0) {
    paginationButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const page = parseInt(btn.getAttribute('data-page'));
        goToPage(page);
      });
    });
  }

  if (limitButtons.length > 0) {
    limitButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const limit = parseInt(btn.getAttribute('data-limit'));
        setListingsPerPage(limit);
      });
    });
  }
}

/**
 * Navigate to a specific page.
 * Updates the current page, loads new listings, and updates the URL parameters.
 *
 * @param {number} page - The page number to navigate to.
 */
function goToPage(page) {
  currentPage = page;
  loadListings(currentPage, listingsPerPage);
  updateUrlParams();
}

/**
 * Set the number of listings to display per page.
 * Updates the limit, resets to the first page, loads new listings, and updates the URL parameters.
 *
 * @param {number} limit - The number of listings to display per page.
 */
function setListingsPerPage(limit) {
  listingsPerPage = limit;
  currentPage = 1;
  loadListings(currentPage, listingsPerPage);
  updateUrlParams();
}

/**
 * Update the browser URL to reflect the current page and limit.
 * Modifies the URL parameters without reloading the page.
 */
function updateUrlParams() {
  const url = new URL(window.location);
  url.searchParams.set('page', currentPage);
  url.searchParams.set('limit', listingsPerPage);
  window.history.pushState({}, '', url);
}
