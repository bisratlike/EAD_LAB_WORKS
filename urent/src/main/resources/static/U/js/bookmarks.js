// Constants
const API_BASE_URL = "http://localhost:8090/api";
const BOOKMARKS_ENDPOINT = `${API_BASE_URL}/bookmarks`;
const ITEMS_ENDPOINT = `${API_BASE_URL}/items`;

// DOM Elements
const bookmarksGrid = document.getElementById("bookmarksGrid");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");
const noBookmarksMessage = document.getElementById("noBookmarksMessage");

// Fetch item details
async function fetchItemDetails(itemId) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${ITEMS_ENDPOINT}/${itemId}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch item details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching item details:", error);
    return null;
  }
}

// Fetch bookmarks
async function fetchBookmarks() {
  try {
    showLoading(true);
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      window.location.href = "../login.html";
      return [];
    }

    console.log('Fetching bookmarks...');
    const response = await fetch(BOOKMARKS_ENDPOINT, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);

    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "../login.html";
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch bookmarks");
    }

    const bookmarks = await response.json();
    console.log('Fetched bookmarks:', bookmarks);
    return bookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    showError(error.message || "Failed to load bookmarks");
    return [];
  } finally {
    showLoading(false);
  }
}

// Render bookmarks
function renderBookmarks(bookmarks) {
  console.log('Rendering bookmarks:', bookmarks);
  bookmarksGrid.innerHTML = "";
  noBookmarksMessage.classList.add("hidden");
  errorMessage.classList.add("hidden");

  if (!bookmarks || bookmarks.length === 0) {
    console.log('No bookmarks to display');
    noBookmarksMessage.classList.remove("hidden");
    return;
  }

  bookmarks.forEach(bookmark => {
    const { item } = bookmark;
    if (!item) return;

    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1';
    card.innerHTML = `
      <div class="relative">
        <img src="${getImageUrl(item.photos?.[0])}" 
             alt="${item.title}" 
             class="w-full h-48 object-cover">
        <span class="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
          ETB ${item.price}/day
        </span>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">${item.title}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">${item.description}</p>
        <div class="flex justify-between items-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.availability === 'AVAILABLE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }">
            ${item.availability}
          </span>
          <div class="flex space-x-2">
            <button onclick="viewItemDetails('${item.id}')" 
                    class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-eye"></i>
            </button>
            <button onclick="removeBookmark('${bookmark.id}')" 
                    class="text-red-600 hover:text-red-800">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    bookmarksGrid.appendChild(card);
  });
}

// Remove bookmark
async function removeBookmark(bookmarkId) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${BOOKMARKS_ENDPOINT}/${bookmarkId}`, {
      method: 'DELETE',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Failed to remove bookmark");
    }

    // Reload bookmarks after removal
    loadBookmarks();
  } catch (error) {
    console.error("Error removing bookmark:", error);
    showError("Failed to remove bookmark");
  }
}

// View item details
function viewItemDetails(itemId) {
  window.location.href = `item-details.html?id=${itemId}`;
}

// Load bookmarks
async function loadBookmarks() {
  const bookmarks = await fetchBookmarks();
  renderBookmarks(bookmarks);
}

// Helpers
function showLoading(show) {
  if (show) {
    loadingSpinner.classList.remove("hidden");
    bookmarksGrid.classList.add("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
    bookmarksGrid.classList.remove("hidden");
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function getImageUrl(base64String) {
  return base64String 
    ? `data:image/jpeg;base64,${base64String}`
    : 'https://via.placeholder.com/300x200?text=No+Image';
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("authToken")) {
    window.location.href = "../login.html";
    return;
  }
  loadBookmarks();
});