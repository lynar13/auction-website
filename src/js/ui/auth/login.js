// src/js/ui/auth/login.js
import { NoroffAPI } from '@api/index.js';

const api = new NoroffAPI();

/**
 * Handles the login process when the login form is submitted.
 * 
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} - Logs the user in and redirects to the homepage on success.
 * @throws {Error} - Throws an error if the login request fails or user/token is missing.
 */
export async function onLogin(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const { user, token: accessToken } = await api.auth.login(data);

    if (user && accessToken) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', accessToken);

      console.log('User stored in localStorage:', JSON.parse(localStorage.getItem('user')));
      console.log('Token stored in localStorage:', localStorage.getItem('token'));

      // Redirect to the home page
      window.location.href = '/auction-website/index.html';
    } else {
      throw new Error('User or access token is undefined');
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
    console.error('Login Error:', error.message);
  }
}

/**
 * Initializes the login page by adding an event listener to the login form.
 * 
 * @returns {void} - Sets up the event listener for login form submission.
 * @throws {Error} - Logs an error if the login form is not found in the DOM.
 */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', onLogin);
  } else {
    console.error('Login form not found in the DOM');
  }
});
