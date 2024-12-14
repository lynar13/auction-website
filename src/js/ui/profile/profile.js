// src/js/ui/profile/profile.js

// src/js/ui/profile/profile.js

import {
  readProfile,
  readUserListings,
  updateProfile,
} from "/src/js/api/profile.js";

/**
 * Upload image to Imgur and return the public URL
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
async function uploadImageToImgur(imageFile, retries = 3, delay = 2000) {
  const CLIENT_ID = "66768252f49364f"; 
  const IMGUR_UPLOAD_URL = "https://api.imgur.com/3/image";

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(IMGUR_UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${CLIENT_ID}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.data?.error || "Failed to upload image to Imgur"
        );
      }

      const data = await response.json();
      return data.data.link; // Return the URL of the uploaded image
    } catch (error) {
      console.error(`Attempt ${attempt}: ${error.message}`);
      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error(
          "All attempts to upload the image to Imgur have failed. Please try again later."
        );
      }
    }
  }
}


document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || !user.name) {
    alert("You must log in to access your profile.");
    window.location.href = "/auction-website/auth/login/index.html";
    return;
  }

  try {
    // Fetch and display profile data
    const profileData = await readProfile(user.name);
    console.log("Fetched profile data:", profileData);

    if (profileData && profileData.data) {
      const { name, credits, avatar } = profileData.data;

      // Update localStorage with profile data
      localStorage.setItem("user", JSON.stringify(profileData.data));

      // Update DOM
      document.getElementById("username").textContent = name || "Unknown User";
      document.getElementById("avatar").src =
        avatar?.url || "/auction-website/public/images/avatar.jpeg";
      document.getElementById("credits").textContent = `Credits: ${credits || 0}`;
    } else {
      throw new Error("Incomplete profile data.");
    }
  } catch (error) {
    console.error("Error reading profile:", error.message);
    document.getElementById("credits").textContent = "Credits: Unavailable";
  }

  // Fetch and display user listings
  try {
    const listingsResponse = await readUserListings(user.name);
    const listings = listingsResponse.data || [];
    console.log("Fetched user listings:", listings);

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
              <a href="/auction-website/listing/index.html?id=${listing.id}" class="btn btn-primary">View Listing</a>
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

  // Handle avatar update
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
        // Notify the user of upload progress
        document.getElementById('avatar').alt = "Uploading...";
        // Upload image to Imgur
        const imgurUrl = await uploadImageToImgur(file);

        // Update the profile with the new avatar URL
        const updatedUser = await updateProfile(user.name, {
          avatar: { url: imgurUrl, alt: "User avatar" },
        });

        if (updatedUser?.avatar?.url) {
          document.getElementById("avatar").src = updatedUser.avatar.url;
          alert("Avatar updated successfully!");
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        alert(`Failed to update avatar: ${error.message}`);
        console.error("Error updating avatar:", error.message);
      }
    });
  } else {
    console.error("Avatar update elements not found in DOM.");
  }
});
