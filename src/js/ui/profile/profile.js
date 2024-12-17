import {
  readProfile,
  readUserListings,
  updateAvatar,
} from "@api/profile.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || !user.name) {
    alert("You must log in to access your profile.");
    window.location.href = "/auth/login/index.html";
    return;
  }

  // Fetch and display profile data
  try {
    const profileResponse = await readProfile(user.name);
    const profileData = profileResponse.data;

    if (profileData) {
      const { name, avatar, credits } = profileData;

      localStorage.setItem("user", JSON.stringify(profileData));

      document.getElementById("username").textContent = name || "Unknown User";
      document.getElementById("avatar").src = avatar?.url || "";
      document.getElementById("credits").textContent = `Credits: ${credits || 0}`;
    }
  } catch (error) {
    console.error("Error reading profile:", error.message);
    document.getElementById("credits").textContent = "Credits: Unavailable";
  }

  // Fetch and display user listings
  try {
    const listingsResponse = await readUserListings(user.name);
    const listings = listingsResponse.data || [];

    const listingsContainer = document.getElementById("userListings");
    listingsContainer.innerHTML = listings.length
      ? listings
          .map(
            (listing) => `
          <div class="card">
            <img src="${listing.media?.[0]?.url || 'https://via.placeholder.com/400'}" alt="${listing.title}" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">${listing.title}</h5>
              <p class="card-text">${listing.description || "No description available"}</p>
              <a href="/listing/index.html?id=${listing.id}" class="btn btn-primary">View Listing</a>
            </div>
          </div>
        `
          )
          .join("")
      : "<p>No listings found.</p>";
  } catch (error) {
    console.error("Error fetching user listings:", error.message);
    document.getElementById("userListings").innerHTML =
      "<p>Error loading listings. Please try again later.</p>";
  }

  // Handle avatar upload with Cloudinary
  const avatarInput = document.getElementById("avatarInput");
  const updateAvatarButton = document.getElementById("updateAvatarButton");

  if (updateAvatarButton && avatarInput) {
    updateAvatarButton.addEventListener("click", () => avatarInput.click());

    avatarInput.addEventListener("change", async () => {
      const file = avatarInput.files[0];
      if (!file) {
        alert("Please select an image to upload.");
        return;
      }

      try {
        document.getElementById("avatar").alt = "Uploading...";

        // Update avatar using Cloudinary
        const updatedProfile = await updateAvatar(file);

        document.getElementById("avatar").src = updatedProfile.avatar.url;
        alert("Avatar updated successfully!");
      } catch (error) {
        console.error("Avatar Update Error:", error.message);
        alert(`Failed to update avatar: ${error.message}`);
      }
    });
  }
});
