import { createListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createListingForm');

  if (!form) {
    console.error("Create listing form not found in the DOM");
    return;
  }

  // Validate and initialize user
  let user = localStorage.getItem('user');
  if (!user) {
    console.error('User not found in localStorage. Redirecting to login.');
    alert('You must log in first.');
    window.location.href = '/auction-website/auth/login/index.html';
    return;
  }

  try {
    user = JSON.parse(user);
  } catch (error) {
    console.error('Invalid user data in localStorage:', error);
    alert('Invalid user data. Please log in again.');
    localStorage.removeItem('user');
    window.location.href = '/auction-website/auth/login/index.html';
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
  
    // Convert `tags` and `media` to arrays
    postData.tags = postData.tags ? postData.tags.split(",").map(tag => tag.trim()) : [];
    postData.media = postData.media
      ? postData.media.split(",").map(url => ({ url: url.trim(), alt: "" }))
      : [];
  
    // Ensure `endsAt` is formatted correctly
    if (postData.endsAt) {
      postData.endsAt = new Date(postData.endsAt).toISOString();
    }
  
    // Validate media URLs
    if (!validateMediaURLs(postData.media)) {
      showAlert('Invalid media URLs. Ensure all URLs are publicly accessible.', 'danger');
      return;
    }
  
    console.log("Data being sent to createListing:", postData);
  
    if (!validateForm(postData)) return;
  
    try {
      const listing = await createListing(postData);
      showAlert('Listing created successfully!', 'success');
      setTimeout(() => {
        window.location.href = `/auction-website/listing/index.html?id=${listing.id}`;
      }, 2000);
    } catch (error) {
      console.error("Error creating listing:", error.message);
      showAlert('Failed to create listing. Please try again.', 'danger');
    }
  });
  
  // Helper function to validate media URLs
  function validateMediaURLs(media) {
    return media.every(item => {
      try {
        const url = new URL(item.url);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    });
  }
  
});
