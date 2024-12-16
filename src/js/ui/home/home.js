import { readListings, createListing } from '../../../js/api/listing.js';

document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const listingsPerPage = 12;

  const listingList = document.getElementById('listingList');
  const pagination = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const sortOptions = document.getElementById('sortOptions');
  const createListingForm = document.getElementById('createListingForm');
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');

  // Manage login/register/logout visibility
  const user = localStorage.getItem('user');
  if (user) {
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    logoutButton.style.display = 'block';
  } else {
    logoutButton.style.display = 'none';
  }

  /**
   * Loads listings from the API and displays them in the UI.
   * 
   * @param {number} [page=1] - The current page number.
   * @param {number} [limit=12] - The number of listings to fetch per page.
   * @param {string} [searchTerm=''] - The search term to filter listings.
   * @param {string} [sortOption=''] - The sorting option to apply.
   * @returns {Promise<void>}
   */
  async function loadListings(page = 1, limit = 12, searchTerm = '', sortOption = '') {
    try {
      const listings = await readListings(page, limit, searchTerm, sortOption);
      const totalListings = listings.total || listings.length;
      displayListings(listings.results || listings);
      renderPagination(totalListings);
    } catch (error) {
      console.error('Failed to load listings:', error);
    }
  }

  /**
   * Renders and displays the fetched listings in the UI.
   * 
   * @param {Array} listings - Array of listing objects to display.
   * @returns {void}
   */
  function displayListings(listings) {
    listingList.innerHTML = '';
    listings.forEach((listing) => {
      const postCard = document.createElement('div');
      postCard.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';

      // Validate media
      const mediaGallery = listing.media?.[0]?.url
        ? `<img src="${listing.media[0].url}" alt="${listing.title}" class="img-fluid rounded mb-3">`
        : `<img src="https://via.placeholder.com/400" alt="Default Image" class="img-fluid rounded mb-3">`;

      // Validate endsAt
      const endsAt = listing.endsAt
        ? `<p class="text-muted small"><strong>Ends At:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>`
        : `<p class="text-muted small"><strong>Ends At:</strong> No expiration date</p>`;

      // Validate listing.id
      const listingLink = listing.id
        ? `<a href="/auction-website/listing/index.html?id=${encodeURIComponent(listing.id)}" class="btn btn-primary mt-auto">Place a Bid</a>`
        : '<p class="text-muted small">No valid listing ID available.</p>';

      // Construct the post card
      postCard.innerHTML = `
        <div class="card h-100 border-0 shadow-sm">
          <div class="media-gallery">${mediaGallery}</div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-truncate">${listing.title || 'Untitled'}</h5>
            <p class="card-text text-truncate">${listing.description?.slice(0, 100) || 'No description available'}...</p>
            ${endsAt}
            ${listingLink}
          </div>
        </div>
      `;

      listingList.appendChild(postCard);
    });
  }

  /**
   * Renders pagination controls based on the total number of listings.
   * 
   * @param {number} totalListings - The total number of listings available.
   * @returns {void}
   */
  function renderPagination(totalListings) {
    const totalPages = Math.ceil(totalListings / listingsPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('li');
      pageButton.className = `page-item ${currentPage === i ? 'active' : ''}`;
      pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;

      pageButton.addEventListener('click', (event) => {
        event.preventDefault();
        currentPage = i;
        loadListings(currentPage, listingsPerPage, searchInput.value.trim(), sortOptions.value);
      });

      pagination.appendChild(pageButton);
    }
  }

  /**
   * Handles the search input and reloads the listings based on the search term.
   * 
   * @returns {void}
   */
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    loadListings(1, listingsPerPage, searchTerm, sortOptions.value);
  });

  /**
   * Handles the sorting option changes and reloads the listings.
   * 
   * @returns {void}
   */
  sortOptions.addEventListener('change', () => {
    const sortOption = sortOptions.value;
    loadListings(1, listingsPerPage, searchInput.value.trim(), sortOption);
  });

  /**
   * Handles the creation of a new listing via the form and reloads listings after successful creation.
   * 
   * @returns {void}
   */
  if (createListingForm) {
    createListingForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const newListing = {
        title: listingTitle.value.trim(),
        description: listingContent.value.trim(),
      };

      try {
        await createListing(newListing);
        listingTitle.value = '';
        listingContent.value = '';
        loadListings(1, listingsPerPage); // Reload listings
      } catch (error) {
        console.error('Failed to create a new listing:', error);
      }
    });
  }

  // Set initial parameters and load listings
  loadListings(currentPage, listingsPerPage);
});
