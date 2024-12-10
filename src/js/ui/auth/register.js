// src/js/ui/auth/register.js
import { NoroffAPI } from '../../api/index.js'; // Import the NoroffAPI class

// Create an instance of NoroffAPI
const api = new NoroffAPI();

export async function onRegister(event) {
  event.preventDefault(); // Prevent default form submission

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  console.log('Form Data:', data);

  try {
    // Call the register method from the NoroffAPI instance
    const { user, token: accessToken } = await api.auth.register(data);

    if (!user || !accessToken) {
      throw new Error('Registration failed: No user data or access token returned');
    }

    console.log(`User registered successfully with name: ${user.name} and email: ${user.email}`);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', accessToken);

    console.log('Stored User in localStorage:', JSON.parse(localStorage.getItem('user')));
    console.log('Stored Token in localStorage:', localStorage.getItem('token'));

    // Redirect to the home page
    window.location.href = '/auction-website/index.html';
  } catch (error) {
    console.error('Error during registration:', error.message);
    alert(`Registration failed: ${error.message}`);
  }
}

// Attach the event listener to the form on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', onRegister);
  } else {
    console.error("Registration form not found in the DOM.");
  }
});