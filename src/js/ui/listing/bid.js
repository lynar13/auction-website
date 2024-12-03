import { placeBid } from '/src/js/api/bids.js';

document.addEventListener('DOMContentLoaded', () => {
  const bidForm = document.getElementById('bidForm');
  const bidAmountInput = document.getElementById('bidAmount');
  const bidMessage = document.getElementById('bidMessage');
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id'); // Get the listing ID from the URL

  bidForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const bidAmount = parseFloat(bidAmountInput.value);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token; // Ensure the user is logged in

    if (!token) {
      bidMessage.textContent = 'You need to log in to place a bid.';
      bidMessage.classList.add('text-danger');
      return;
    }

    try {
      const bidResult = await placeBid(listingId, bidAmount, token);
      bidMessage.textContent = 'Bid placed successfully!';
      bidMessage.classList.add('text-success');
      console.log('Bid result:', bidResult);
    } catch (error) {
      bidMessage.textContent = error.message || 'Failed to place bid.';
      bidMessage.classList.add('text-danger');
    }
  });
});
