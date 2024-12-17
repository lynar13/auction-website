/**
 * Logs out the user by clearing user-related data from local storage and redirecting to the home page.
 * 
 * @returns {void}
 * @throws {Error} - Logs and alerts the user if an error occurs during the logout process.
 */
export function onLogout() {
  try {
    // Remove user-related information from local storage
    localStorage.removeItem("token"); // Remove the stored token
    localStorage.removeItem("user");  // Remove the stored user information

    // Notify the user
    alert("User has been logged out");

    // Redirect the user to the home page after a short delay
    setTimeout(() => {
      window.location.href = "/index.html"; // Adjusted for GitHub Pages
    }, 500); // Adding a slight delay to ensure storage operations complete before redirect
  } catch (error) {
    // Handle any unexpected errors during logout
    console.error("Error during logout:", error);
    alert("An error occurred while logging out. Please try again.");
  }
}

/**
 * Attaches an event listener to the logout button to handle user logout.
 * 
 * @returns {void}
 * @throws {Error} - Logs an error if the logout button is not found in the DOM.
 */
function attachLogoutEvent() {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", onLogout);
  } else {
    console.error("Logout button not found in the DOM. Retrying...");

    // Retry after a short delay if the button isn't found yet (for dynamically loaded buttons)
    setTimeout(attachLogoutEvent, 500); // Retry after 500ms
  }
}

/**
 * Ensures that the logout event listener is attached after the DOM content is fully loaded.
 * 
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", attachLogoutEvent);
