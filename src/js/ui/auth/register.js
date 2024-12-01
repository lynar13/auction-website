import { register } from '../../api/auth.js'; // Changed to a relative path

export async function onRegister(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form data and convert it to an object
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Log form data for debugging
  console.log('Form Data:', data);

  try {
    // Call the register function and handle the response
    const { user, accessToken } = await register(data); // Register the user

    // Verify that the user object is correctly returned
    if (!user || !accessToken) {
      throw new Error('Registration failed: No user data or access token returned');
    }

    console.log(`User registered successfully with name: ${user.name} and email: ${user.email}`);

    // Store user and token in local storage to be used in subsequent requests
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', accessToken);

    // Verify that localStorage has been correctly set
    console.log('Stored User in localStorage:', JSON.parse(localStorage.getItem('user')));
    console.log('Stored Token in localStorage:', localStorage.getItem('token'));

    // Redirect to the profile page or home page after successful registration and login
    window.location.href = '/profile/index.html';
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
