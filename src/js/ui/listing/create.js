import { createListing } from '/src/js/api/listing.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createListingForm');

  if (!form) {
    console.error("Create listing form not found in the DOM");
    return;
  }

  /**
   * Displays an alert message above the form.
   *
   * @param {string} message - The message to display in the alert.
   * @param {string} [type='danger'] - The type of alert ('success', 'warning', 'danger', etc.).
   */
  function showAlert(message, type = 'danger') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;

    form.parentElement.insertBefore(alertDiv, form);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  /**
   * Validates the form input before submitting the data.
   *
   * @param {object} data - The form data object.
   * @returns {boolean} - Returns true if the form data is valid, otherwise false.
   */
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

  /**
   * Handles the form submission to create a new listing.
   *
   * @param {Event} event - The form submission event.
   * @returns {Promise<void>}
   */
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const formData = new FormData(form);
    const postData = Object.fromEntries(formData.entries());
  
    // Transform fields to match API requirements
    postData.tags = postData.tags ? postData.tags.split(',').map(tag => tag.trim()) : [];
    postData.media = postData.media ? postData.media.split(',').map(url => ({ url: url.trim() })) : [];
    if (postData.endsAt) {
      postData.endsAt = new Date(postData.endsAt).toISOString();
    }
  
    console.log('Payload being sent:', postData); // Log payload to verify
  
    try {
      const listing = await createListing(postData); // Call createListing with the object
      showAlert('Listing created successfully!', 'success');
      setTimeout(() => {
        window.location.href = `/auction-website/profile/index.html?id=${listing.id}`;
      }, 2000);
    } catch (error) {
      console.error("Error creating listing:", error.message);
      showAlert(`Failed to create listing: ${error.message}`, 'danger');
    }
  });
});
