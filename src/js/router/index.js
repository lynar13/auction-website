// src/js/router/index.js

// Import the Noroff API class using alias
import { NoroffAPI } from '@api/index.js'; 

const apiInstance = new NoroffAPI();

/**
 * Validates user data from localStorage.
 * Redirects to login if invalid.
 */
export function validateUser() {
  const userData = localStorage.getItem('user');

  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (!user || !user.email || !user.name) {
        throw new Error('Invalid user data: Missing email or name');
      }
      return user; // Return the user object if valid
    } catch (error) {
      console.error('Error parsing user data:', error.message);
      alert('Invalid user data. Please log in again.');
      localStorage.removeItem('user'); // Clear corrupted data
      window.location.href = '/auth/login/index.html'; // Redirect to login page
      return false;
    }
  }

  // Redirect if no valid user
  alert('You must be logged in to access this page.');
  window.location.href = '/auth/login/index.html';
  return false;
}

export default async function router(pathname = window.location.pathname) {
  switch (pathname.replace('/auction-website', '')) {
    case '/auth/login/index.html':
      await import('@ui/auth/login.js');
      break;
    case '/auth/register/index.html':
      await import('@ui/auth/register.js');
      break;
    case '/listing/create/index.html':
      if (validateUser()) {
        await import('@ui/listing/create.js');
      }
      break;
    case '/listing/edit/index.html':
      if (validateUser()) {
        await import('@ui/listing/edit.js');
      }
      break;
    case '/listing/index.html':
      await import('@ui/listing/view.js');
      break;
    case '/profile/index.html':
      if (validateUser()) {
        await import('@ui/profile/profile.js');
      }
      break;
    case '/listings/index.html':
      await import('@ui/listing/viewList.js');
      break;
    default:
      await import('@ui/home/home.js');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    try {
      const parsedUser = JSON.parse(user);
      if (loginButton) loginButton.style.display = 'none';
      if (registerButton) registerButton.style.display = 'none';
      if (logoutButton) logoutButton.style.display = 'inline-block';
    } catch (error) {
      console.error('Error parsing user data:', error.message);
      localStorage.removeItem('user');
    }
  } else {
    if (loginButton) loginButton.style.display = 'inline-block';
    if (registerButton) registerButton.style.display = 'inline-block';
    if (logoutButton) logoutButton.style.display = 'none';
  }

  // Initialize the router
  router();
});
