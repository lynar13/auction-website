/**
 * Fetch with localStorage caching
 * 
 * @param {string} url - The API endpoint
 * @param {Object} options - Fetch options (headers, method, etc.)
 * @param {number} cacheDuration - Cache duration in milliseconds (default: 5 minutes)
 * @returns {Promise<any>} - The API response
 */
export async function fetchWithLocalStorageCache(url, options = {}, cacheDuration = 300000) {
    const cacheKey = `${url}:${JSON.stringify(options)}`;
    const now = Date.now();
  
    // Check if a cached response exists
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));
    if (cachedData && now < cachedData.expiry) {
      console.log('Returning cached response from localStorage');
      return cachedData.data;
    }
  
    // Fetch new data from the API
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
  
    // Cache the response in localStorage
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ data, expiry: now + cacheDuration })
    );
    return data;
  }
  