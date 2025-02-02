// Constants
const API_BASE_URL = "http://localhost:8090/api";
const PROFILE_ENDPOINT = `${API_BASE_URL}/users/me`;
const AVATAR_UPLOAD_ENDPOINT = `${API_BASE_URL}/users/avatar`;

// DOM Elements
const profileForm = document.getElementById("profileForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const bioInput = document.getElementById("bio");
const avatarInput = document.getElementById("avatar");
const avatarPreview = document.getElementById("avatarPreview");
const trustScore = document.getElementById("trustScore");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// Load User Profile
async function loadProfile() {
  try {
    showLoading(true);
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(PROFILE_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to load profile");
    const user = await response.json();

    // Populate form fields
    nameInput.value = user.name || "";
    emailInput.value = user.email || "";
    phoneInput.value = user.phone || "";
    bioInput.value = user.bio || "";
    trustScore.textContent = user.trustScore?.toFixed(1) || "N/A";
    
    // Update avatar preview
    if (user.avatar) {
      avatarPreview.src = user.avatar;
      avatarPreview.classList.remove("hidden");
    }

  } catch (error) {
    showError(error.message || "Failed to load profile");
  } finally {
    showLoading(false);
  }
}

// Handle Avatar Upload
avatarInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) {
    showError("Please select an image file");
    return;
  }

  try {
    showLoading(true);
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(AVATAR_UPLOAD_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (!response.ok) throw new Error("Failed to upload avatar");
    const result = await response.json();
    
    avatarPreview.src = result.avatarUrl;
    avatarPreview.classList.remove("hidden");
    showSuccess("Avatar updated successfully!");

  } catch (error) {
    showError(error.message || "Avatar upload failed");
  } finally {
    showLoading(false);
  }
});

// Update Profile
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  try {
    showLoading(true);
    const token = localStorage.getItem("authToken");
    const updates = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      bio: bioInput.value.trim()
    };

    // Basic validation
    if (!updates.name) {
      showError("Name is required");
      return;
    }

    const response = await fetch(PROFILE_ENDPOINT, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) throw new Error("Failed to update profile");
    showSuccess("Profile updated successfully!");
    setTimeout(() => loadProfile(), 1500); // Refresh data

  } catch (error) {
    showError(error.message || "Profile update failed");
  } finally {
    showLoading(false);
  }
});

// Helpers
function showLoading(show) {
  loadingSpinner.classList.toggle("hidden", !show);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  successMessage.classList.add("hidden");
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.remove("hidden");
  errorMessage.classList.add("hidden");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("authToken")) {
    window.location.href = "../login.html";
    return;
  }
  loadProfile();
});