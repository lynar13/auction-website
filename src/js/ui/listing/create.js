import { createListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');

  // Check if the user is logged in (by checking token or user data)
  const token = localStorage.getItem('token'); // Or use another method to check login status
  const user = JSON.parse(localStorage.getItem('user'));

  // If user is logged in, hide Login and Register buttons, and show Logout button
  if (token && user) {
    loginButton.style.display = 'none';  // Hide Login button
    registerButton.style.display = 'none';  // Hide Register button
    logoutButton.style.display = 'inline-block';  // Show Logout button
  } else {
    // If user is not logged in, hide Logout button and show Login/Register buttons
    loginButton.style.display = 'inline-block';  // Show Login button
    registerButton.style.display = 'inline-block';  // Show Register button
    logoutButton.style.display = 'none';  // Hide Logout button
  }

  const form = document.getElementById('createListingForm');

  if (!form) {
    console.error("Create listing form not found in the DOM");
    return;
  }

  // Function to display alerts
  function showAlert(message, type = 'danger') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;

    form.parentElement.insertBefore(alertDiv, form);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  // Function to validate form data
  function validateForm(data) {
    if (!data.title.trim()) {
      showAlert('Title is required.', 'warning');
      return false;
    }
    if (!data.endDate) {
      showAlert('End Date is required.', 'warning');
      return false;
    }
    if (new Date(data.endDate) < new Date()) {
      showAlert('End Date cannot be in the past.', 'warning');
      return false;
    }
    if (!data.description.trim()) {
      showAlert('Description is required.', 'warning');
      return false;
    }
    return true;
  }

  // Handle form submission
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(form);
    const postData = Object.fromEntries(formData.entries());

    // Convert tags and media to arrays
    postData.tags = postData.tags ? postData.tags.split(',').map(tag => tag.trim()) : [];
    postData.media = postData.media ? postData.media.split(',').map(url => url.trim()) : [];

    // Validate form data
    if (!validateForm(postData)) return;

    try {
      // Attempt to create the listing
      const listing = await createListing(postData);

      // Redirect to the newly created post's details page
      showAlert('Listing created successfully!', 'success');
      setTimeout(() => {
        window.location.href = `/auction-website/listing/index.html?id=${listing.id}`;
      }, 2000);
    } catch (error) {
      console.error('Error creating listing:', error);
      showAlert('Failed to create listing. Please try again.', 'danger');
    }
  });
});
