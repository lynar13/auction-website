// Import the Noroff API class
import { NoroffAPI } from '../api/index.js'; // Adjusted to relative path

const apiInstance = new NoroffAPI();

/**
 * Validates user data from localStorage.
 * Redirects to login if invalid.
 */
function validateUser() {
  const userData = localStorage.getItem('user');

  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (!user || !user.email) {
        throw new Error('Invalid user data');
      }
      return true; // Valid user
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  // Redirect if no valid user
  alert('You must be logged in to access this page.');
  window.location.href = '/auth/login/index.html';
  return false;
}

export default async function router(pathname = window.location.pathname) {
  switch (pathname) {
    case '/auth/login/index.html':
      await import('../ui/auth/login.js');
      break;
    case '/auth/register/index.html':
      await import('../ui/auth/register.js');
      break;
    case '/listing/create/index.html':
      if (validateUser()) { // Check before loading
        await import('../ui/listing/create.js');
      }
      break; // Added missing break
    case '/listing/edit/index.html':
      if (validateUser()) { // Check before loading
        await import('../ui/listing/edit.js');
      }
      break; // Added missing break
    case '/listing/index.html':
      await import('../ui/listing/view.js');
      break;
    case '/profile/index.html':
      if (validateUser()) { // Check before loading
        await import('../ui/profile/profile.js');
      }
      break;
    case '/listings/index.html':
      await import('../ui/listing/viewList.js');
      break;
    default:
      await import('../ui/home/home.js'); // Default home page
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Handle user authentication button visibility
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (token && user) {
    if (loginButton) loginButton.style.display = 'none';
    if (registerButton) registerButton.style.display = 'none';
    if (logoutButton) logoutButton.style.display = 'inline-block';
  } else {
    if (loginButton) loginButton.style.display = 'inline-block';
    if (registerButton) registerButton.style.display = 'inline-block';
    if (logoutButton) logoutButton.style.display = 'none';
  }

  // Initialize the router
  router();
});
