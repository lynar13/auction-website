export function currentUser() {
    // Retrieve user and token from localStorage
    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    // Check if user or token is missing and return null if either is not present
    if (!userString || !token) {
      console.error("No user or token found in localStorage");
      return null;
    }
  
    try {
      // Parse the user string into an object
      const user = JSON.parse(userString);
      user.token = token; // Attach token to user object for convenience
  
      // Log the current user only if parsing was successful
      console.log("Current User:", user);
      return user;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  }
  