import { currentUser } from './currentUser.js';

export function authGuard() {
  // Check if the user and token are present in localStorage
  const user = currentUser();
  const token = localStorage.getItem("token");

  // If the user or token is not present, redirect to login page
  if (!user || !token) {
    alert("You must be logged in to access this page.");
    window.location.href = "/social-media-app/auth/login/index.html";  // Updated path for GitHub Pages
    return null;
  }

  // Check token validity (e.g., JWT expiration check)
  try {
    // Parse the token (if JWT) to check its expiration
    const parsedToken = JSON.parse(atob(token.split(".")[1]));
    const isExpired = parsedToken.exp && parsedToken.exp * 1000 < Date.now();
    
    if (isExpired) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/social-media-app/auth/login/index.html"; // Updated path for GitHub Pages
      return null;
    }
  } catch (e) {
    console.error("Failed to validate token:", e);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/social-media-app/auth/login/index.html"; // Updated path for GitHub Pages
    return null;
  }

  // Parse and return the user data
  return JSON.parse(user);
}
