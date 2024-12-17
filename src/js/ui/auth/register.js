// src/js/ui/auth/register.js
import { NoroffAPI } from '@api/index.js';

const api = new NoroffAPI();

/**
 * Handles the registration process when the registration form is submitted.
 * 
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} - Registers a new user and redirects to the login page on success.
 * @throws {Error} - Throws an error if validation fails or registration fails due to server issues.
 */
export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  console.log('Form Data:', data);

  // Validate registration data
  try {
    if (!data.name || !data.email || !data.password) {
      throw new Error('All fields are required: Name, Email, and Password');
    }
  } catch (error) {
    console.error('Validation Error:', error.message);
    alert(`Registration failed: ${error.message}`);
    return;
  }

  try {
    // Call the register method from the NoroffAPI instance
    const { user } = await api.auth.register(data);

    if (!user) {
      throw new Error('Registration failed: No user data returned');
    }

    console.log(`User registered successfully with name: ${user.name} and email: ${user.email}`);

    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user));

    console.log('Stored User in localStorage:', JSON.parse(localStorage.getItem('user')));

    // Redirect to the login page
    alert('Registration successful! Please log in to continue.');
    window.location.href = '../../auth/login/index.html';
  } catch (error) {
    console.error('Error during registration:', error.message);
    alert(`Registration failed: ${error.message}`);
  }
}

/**
 * Initializes the registration page by adding an event listener to the registration form.
 * 
 * @returns {void} - Sets up the event listener for registration form submission.
 * @throws {Error} - Logs an error if the registration form is not found in the DOM.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', onRegister);
  } else {
    console.error("Registration form not found in the DOM.");
  }
});
