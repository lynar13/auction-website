import { login } from '../../api/auth.js'; // Changed to a relative path

export async function onLogin(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    // Call the login function and get user details
    const { user, accessToken } = await login(data);

    // Log the received user data for debugging
    console.log('User received from login:', user);
    console.log('Access Token received:', accessToken);

    // Ensure user and token are defined before storing in localStorage
    if (user && accessToken) {
      // Store user details in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', accessToken);

      // Log to check if the values are stored correctly
      console.log("User stored in localStorage:", JSON.parse(localStorage.getItem('user')));
      console.log("Token stored in localStorage:", localStorage.getItem('token'));

      // Redirect to the profile or home page after successful login
      window.location.href = '/profile/index.html';
    } else {
      throw new Error('User or access token is undefined');
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
    console.error("Login Error:", error);
  }
}

// Attach the event listener to the form on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', onLogin);
  } else {
    console.error("Login form not found in the DOM");
  }
});
