export function displayError(message) {
    let errorContainer = document.getElementById('error-container');
  
    // Create the error container if it doesn't exist
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'error-container';
      errorContainer.style.color = 'red';
      errorContainer.style.marginTop = '20px';
      document.body.appendChild(errorContainer);
    }
  
    // Set the error message in the error container
    errorContainer.textContent = message;
  }
  