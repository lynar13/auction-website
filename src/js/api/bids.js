export async function placeBid(listingId, amount, token) {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user.credits < amount) {
      throw new Error('Insufficient credits to place this bid.');
    }
  
    const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listingId}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
  
    if (!response.ok) throw new Error('Failed to place bid');
  
    // Deduct credits locally
    user.credits -= amount;
    localStorage.setItem('user', JSON.stringify(user));
  
    return await response.json();
  }
  