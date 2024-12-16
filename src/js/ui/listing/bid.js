import { placeBid, fetchBidsByProfile } from '../../../js/api/bids.js';

document.addEventListener('DOMContentLoaded', () => {
  const bidForm = document.getElementById('bidForm');
  const bidAmountInput = document.getElementById('bidAmount');
  const bidMessage = document.getElementById('bidMessage');
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id'); // Get the listing ID from the URL

  /**
   * Handles the bid form submission to place a bid on a listing.
   * 
   * @param {Event} event - The form submission event.
   * @returns {Promise<void>}
   */
  bidForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const bidAmount = parseFloat(bidAmountInput.value);
    const user = JSON.parse(localStorage.getItem('user')); // Get the user object from localStorage

    // Validate the user object and credits
    if (!user || user.credits === undefined) {
      bidMessage.textContent =
        'Unable to retrieve user information. Please try again.';
      bidMessage.classList.remove('text-success');
      bidMessage.classList.add('text-danger');
      return;
    }

    if (!bidAmount || bidAmount <= 0) {
      bidMessage.textContent =
        'Invalid bid amount. Please enter a valid number.';
      bidMessage.classList.remove('text-success');
      bidMessage.classList.add('text-danger');
      return;
    }

    if (user.credits < bidAmount) {
      bidMessage.textContent = 'Insufficient credits to place this bid.';
      bidMessage.classList.remove('text-success');
      bidMessage.classList.add('text-danger');
      return;
    }

    try {
      // Place the bid
      const bidResult = await placeBid(listingId, bidAmount);

      // Deduct credits locally and update the UI
      user.credits -= bidAmount;
      localStorage.setItem('user', JSON.stringify(user));
      document.getElementById('credits').textContent =
        `Credits: ${user.credits}`;

      bidMessage.textContent = 'Bid placed successfully!';
      bidMessage.classList.remove('text-danger');
      bidMessage.classList.add('text-success');
    } catch (error) {
      bidMessage.textContent = error.message || 'Failed to place bid.';
      bidMessage.classList.remove('text-success');
      bidMessage.classList.add('text-danger');
    }
  });

  /**
   * Fetches and displays all bids placed by the logged-in profile.
   * 
   * @returns {Promise<void>}
   */
  const fetchProfileBids = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.name) {
      console.error('User is not authenticated.');
      return;
    }

    try {
      const bids = await fetchBidsByProfile(user.name, true);
      console.log('Fetched bids:', bids);
      // Add logic to display fetched bids in the UI if needed.
    } catch (error) {
      console.error('Error fetching bids:', error.message);
    }
  };

  fetchProfileBids();
});
