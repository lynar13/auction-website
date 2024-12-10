// src/js/ui/auth/login.js
import { NoroffAPI } from '../../api/index.js'; // Import the NoroffAPI class
import { API_AUTH, API_AUTH_LOGIN } from '../../api/constants.js';

// Create an instance of NoroffAPI
const api = new NoroffAPI();

export async function onLogin(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    // Clear old tokens and user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Call the login method from the NoroffAPI instance
    const { user, token: accessToken } = await api.auth.login(data);

    if (user && accessToken) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', accessToken);

      console.log(
        'User stored in localStorage:',
        JSON.parse(localStorage.getItem('user')),
      );
      console.log(
        'Token stored in localStorage:',
        localStorage.getItem('token'),
      );

      // Redirect to the home page
      window.location.href = '/auction-website/index.html';
    } else {
      throw new Error('User or access token is undefined');
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
    console.error('Login Error:', error);
  }
}

// Attach the event listener to the form on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', onLogin);
  } else {
    console.error('Login form not found in the DOM');
  }
});
