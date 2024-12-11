import { createListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');

  // Check if the user is logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (token && user) {
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    logoutButton.style.display = 'inline-block';
  } else {
    loginButton.style.display = 'inline-block';
    registerButton.style.display = 'inline-block';
    logoutButton.style.display = 'none';
  }

  const form = document.getElementById('createListingForm');

  if (!form) {
    console.error("Create listing form not found in the DOM");
    return;
  }

  function showAlert(message, type = 'danger') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;

    form.parentElement.insertBefore(alertDiv, form);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  function validateForm(data) {
    if (!data.title.trim()) {
      showAlert('Title is required.', 'warning');
      return false;
    }
    if (!data.endsAt) {
      showAlert('End Date is required.', 'warning');
      return false;
    }
    if (new Date(data.endsAt) < new Date()) {
      showAlert('End Date cannot be in the past.', 'warning');
      return false;
    }
    if (!data.description.trim()) {
      showAlert('Description is required.', 'warning');
      return false;
    }
    return true;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const postData = Object.fromEntries(formData.entries());

    postData.tags = postData.tags ? postData.tags.split(",").map(tag => tag.trim()) : [];
    postData.media = postData.media ? postData.media.split(",").map(url => url.trim()) : [];
    if (postData.endsAt) {
      postData.endsAt = new Date(postData.endsAt).toISOString();
      delete postData.endsAt;
    }

    if (!validateForm(postData)) return;

    console.log("Data being sent to createListing:", postData);

    try {
      const listing = await createListing(postData);
      showAlert('Listing created successfully!', 'success');
      setTimeout(() => {
        window.location.href = `/auction-website/listing/index.html?id=${listing.id}`;
      }, 2000);
    } catch (error) {
      console.error("Error creating listing:", error);
      showAlert('Failed to create listing. Please try again.', 'danger');
    }
  });
});
