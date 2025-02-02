
// global-chat.js 
// Constants
const WS_ENDPOINT = "ws://localhost:8090/ws-chat";
const RECONNECT_DELAY = 3000; // 3 seconds

// DOM Elements
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const typingIndicator = document.getElementById("typingIndicator");
const loadingSpinner = document.getElementById("loadingSpinner");

let socket = null;
let reconnectAttempts = 0;
let isTypingTimeout = null;

// Initialize WebSocket connection
function connectWebSocket() {
  socket = new WebSocket(WS_ENDPOINT);

  socket.onopen = () => {
    console.log("Connected to chat");
    reconnectAttempts = 0;
    loadingSpinner.classList.add("hidden");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    handleIncomingMessage(message);
  };

  socket.onclose = () => {
    console.log("Connection closed. Reconnecting...");
    loadingSpinner.classList.remove("hidden");
    setTimeout(connectWebSocket, RECONNECT_DELAY);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    socket.close();
  };
}

// Handle incoming messages
function handleIncomingMessage(message) {
  switch (message.type) {
    case "MESSAGE":
      appendMessage(message);
      break;
    case "TYPING":
      showTypingIndicator(message.sender);
      break;
    case "HISTORY":
      loadMessageHistory(message.messages);
      break;
  }
}

// Append a message to the chat
function appendMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message bg-white p-4 rounded-lg shadow mb-4";
  messageDiv.innerHTML = `
    <div class="flex justify-between mb-2">
      <span class="font-semibold">${message.sender}</span>
      <span class="text-gray-500 text-sm">${new Date(message.timestamp).toLocaleTimeString()}</span>
    </div>
    <p class="text-gray-800">${message.content}</p>
  `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}

// Load message history
function loadMessageHistory(messages) {
  messages.forEach(appendMessage);
}

// Show typing indicator
function showTypingIndicator(sender) {
  typingIndicator.textContent = `${sender} is typing...`;
  typingIndicator.classList.remove("hidden");
  clearTimeout(isTypingTimeout);
  isTypingTimeout = setTimeout(() => {
    typingIndicator.classList.add("hidden");
  }, 2000);
}

// Send message
function sendMessage() {
  const content = messageInput.value.trim();
  if (!content || !socket) return;

  const message = {
    type: "MESSAGE",
    content: content,
    sender: getCurrentUser().name,
    timestamp: new Date().toISOString(),
  };

  socket.send(JSON.stringify(message));
  messageInput.value = "";
}

// Handle typing events
messageInput.addEventListener("input", () => {
  if (!socket) return;
  socket.send(JSON.stringify({ type: "TYPING", sender: getCurrentUser().name }));
});

// Get current user from localStorage
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user")) || { name: "Anonymous" };
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("authToken")) {
    window.location.href = "../login.html";
    return;
  }
  connectWebSocket();
});

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// home.js 
// Function to render items
function renderItems() {
    const itemsContainer = document.getElementById("items-container");
    const items = JSON.parse(localStorage.getItem("items")) || [];
  
    if (items.length === 0) {
      itemsContainer.innerHTML = "<p class='text-gray-600'>No items available.</p>";
      return;
    }
  
    itemsContainer.innerHTML = ""; // Clear existing content
  
    items.forEach((item) => {
      const isBookmarked = isItemBookmarked(item.id); // Check if item is already bookmarked
  
      const card = `
        <div class="bg-white shadow-xl rounded-3xl overflow-hidden w-64 h-96 flex flex-col items-center transition duration-300 transform hover:scale-105 relative">
          <div class="overflow-hidden w-full rounded-t-3xl">
            <img
              src="${item.image}"
              alt="${item.title}"
              class="w-full h-48 object-cover transition duration-300 transform hover:scale-110"
            />
          </div>
          <div class="p-4 text-center flex-grow">
            <h4 class="font-bold text-lg">${item.title}</h4>
            <p class="text-gray-600 text-sm">${item.price} birr/day</p>
            <p class="text-sm mt-2 ${
              item.availability === "available" ? "text-green-600" : "text-red-600"
            }">${item.availability === "available" ? "Available" : "Not Available"}</p>
          </div>
          <div class="w-full p-4 bg-gray-50 text-center">
            <p class="text-sm text-gray-600">Owner: ${item.owner || "Unknown"}</p>
            <p class="text-sm text-gray-600">Rating: ${item.rating || "N/A"} ★</p>
          </div>
          <!-- Save Icon at Bottom-Right Corner -->
          <button
            onclick="toggleBookmark(${item.id}, this)"
            class="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <i class="fas fa-bookmark ${
              isBookmarked ? "text-blue-600" : "text-gray-600"
            }"></i>
          </button>
        </div>
      `;
      itemsContainer.insertAdjacentHTML("beforeend", card);
    });
  }
  
  // Function to check if an item is already bookmarked
  function isItemBookmarked(itemId) {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    return bookmarks.some((b) => b.id === itemId);
  }
  
  // Function to toggle bookmark
  function toggleBookmark(itemId, button) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const item = items.find((i) => i.id === itemId);
  
    if (item) {
      let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      const bookmarkIndex = bookmarks.findIndex((b) => b.id === itemId);
  
      if (bookmarkIndex === -1) {
        // Add to bookmarks
        bookmarks.push(item);
        button.querySelector("i").classList.remove("text-gray-600");
        button.querySelector("i").classList.add("text-blue-600");
      } else {
        // Remove from bookmarks
        bookmarks.splice(bookmarkIndex, 1);
        button.querySelector("i").classList.remove("text-blue-600");
        button.querySelector("i").classList.add("text-gray-600");
      }
  
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  }
  
  // Initial render
  renderItems();

// utils.js 
// Utility function to get image URL from base64 data
function getImageUrl(base64String) {
    return base64String 
        ? `data:image/jpeg;base64,${base64String}`
        : 'https://via.placeholder.com/300x200?text=No+Image';
}


// post-item.js 
// Constants
const API_BASE_URL = "http://localhost:8090/api"; // Update if needed
const ITEMS_ENDPOINT = `${API_BASE_URL}/items`;

// DOM Elements
const postItemForm = document.getElementById("postItemForm");
const imageInput = document.getElementById("image");
const photoPreviewsContainer = document.getElementById("photoPreviewsContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

// Handle image preview for multiple images
imageInput.addEventListener("change", (event) => {
    const files = event.target.files;

    // Clear previous preview
    photoPreviewsContainer.innerHTML = "";

    Array.from(files).forEach((file) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewDiv = document.createElement("div");
                previewDiv.className = "relative group inline-block m-2";

                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "w-32 h-32 object-cover rounded-lg";

                const removeButton = document.createElement("button");
                removeButton.className =
                    "absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity";
                removeButton.innerHTML = "×";
                removeButton.onclick = () => {
                    previewDiv.remove();
                    imageInput.value = ""; // Reset input
                };

                previewDiv.appendChild(img);
                previewDiv.appendChild(removeButton);
                photoPreviewsContainer.appendChild(previewDiv);
            };
            reader.readAsDataURL(file);
        }
    });
});

// Handle form submission
postItemForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user?.id) {
        showError("You must be logged in to post an item.");
        return;
    }

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = document.getElementById("price").value.trim();
    const category = document.getElementById("category").value.trim();
    const location = document.getElementById("location").value.trim();
    const availability = document.querySelector(
        'input[name="availability"]:checked'
    ).value;

    if (!title || !description || !price || !category || !location) {
        showError("Please fill in all required fields.");
        return;
    }

    const image = imageInput.files[0];
    if (!image) {
        showError("Please upload at least one image.");
        return;
    }

    loadingSpinner.style.display = "block";
    errorMessage.classList.add("hidden");
    successMessage.classList.add("hidden");

    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("location", location);
        formData.append("availability", availability);
        formData.append("image", image);
        formData.append("userId", user.id);

        const response = await fetch(ITEMS_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to post item.");
        }

        showSuccess("Item posted successfully! Redirecting...");
        postItemForm.reset();
        photoPreviewsContainer.innerHTML = "";

        setTimeout(() => {
            window.location.href = "items.html";
        }, 2000);
    } catch (error) {
        console.error("Error posting item:", error);
        showError(error.message || "Failed to post item. Please try again.");
    } finally {
        loadingSpinner.style.display = "none";
    }
});

// Helper functions
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

// api.js 
// API base URL
const API_BASE_URL = 'http://localhost:8090/api';

// API call helper
async function callApi(endpoint, options = {}) {
    try {
        const token = localStorage.getItem('authToken');
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
        
        // Handle non-2xx responses
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'API request failed');
        }

        // For 204 No Content or empty responses
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        // Try to parse JSON only if we have JSON content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        // Return null for non-JSON responses
        return null;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Get image URL from base64
function getImageUrl(photos) {
    return photos && photos.length > 0
        ? `data:image/jpeg;base64,${photos[0]}`
        : '/U/assets/default-item.jpg';
}

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}


// item-list.js 
// Function to render items
function renderItems() {
  // Check authentication
  const userData = localStorage.getItem('user');
  if (!userData) {
      window.location.href = '../login.html';
      throw new Error('User data not found. Please log in again.');
  }

  const user = JSON.parse(userData);
  if (!user || !user.id) {
      localStorage.removeItem('user');
  }

  const itemListContainer = document.getElementById("itemListContainer");
  const items = JSON.parse(localStorage.getItem("items")) || [];

  if (items.length === 0) {
    itemListContainer.innerHTML =
      "<p class='text-gray-600'>No items available.</p>";
    return;
  }

  itemListContainer.innerHTML = ""; // Clear existing content

  items.forEach((item) => {
    const card = `
        <div class="bg-white shadow-xl rounded-3xl overflow-hidden w-64 h-96 flex flex-col items-center transition duration-300 transform hover:scale-105 relative">
          <div class="overflow-hidden w-full rounded-t-3xl">
            <img
              src="${item.image}"
              alt="${item.title}"
              class="w-full h-48 object-cover transition duration-300 transform hover:scale-110"
            />
          </div>
          <div class="p-4 text-center flex-grow">
            <h4 class="font-bold text-lg">${item.title}</h4>
            <p class="text-gray-600 text-sm">${item.price} birr/day</p>
            <p class="text-sm mt-2 ${
              item.availability === "available"
                ? "text-green-600"
                : "text-red-600"
            }">${
      item.availability === "available" ? "Available" : "Not Available"
    }</p>
          </div>
          <div class="w-full p-4 bg-gray-50 text-center">
            <p class="text-sm text-gray-600">Owner: ${
              item.owner || "Unknown"
            }</p>
            <p class="text-sm text-gray-600">Rating: ${
              item.rating || "N/A"
            } ★</p>
          </div>
        </div>
      `;
    itemListContainer.insertAdjacentHTML("beforeend", card);
  });
}

// Initial render
renderItems();


// index.js 
// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

// Handle logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    updateAuthUI();
    window.location.href = '/U/login.html';
}

// Update UI based on auth status
function updateAuthUI() {
    const isAuthenticated = isLoggedIn();
    document.getElementById('authLinks').style.display = isAuthenticated ? 'flex' : 'none';
    document.getElementById('nonAuthLinks').style.display = isAuthenticated ? 'none' : 'flex';
}

// API call helper
async function callApi(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`http://localhost:8090/api${endpoint}`, {
            ...options,
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            updateAuthUI();
            return null;
        }

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load and display items
async function loadItems() {
    try {
        const items = await callApi('/items');
        if (items) {
            displayItems(items);
        }
    } catch (error) {
        console.error('Failed to load items:', error);
        document.getElementById('itemsGrid').innerHTML = `
            <div class="text-center text-gray-500 py-8">
                Failed to load items. Please try again later.
            </div>
        `;
    }
}

// Get image URL from base64
function getImageUrl(photos) {
    return photos && photos.length > 0
        ? `data:image/jpeg;base64,${photos[0]}`
        : 'https://via.placeholder.com/300x200?text=No+Image';
}

// Display items in grid
function displayItems(items) {
    const grid = document.getElementById('itemsGrid');
    grid.innerHTML = items.map(item => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover">
            <div class="relative">
                <img src="${getImageUrl(item.photos)}" 
                     alt="${item.title}" class="w-full h-48 object-cover">
                ${isLoggedIn() ? `
                    <button onclick="toggleBookmark('${item.id}')" 
                            class="absolute top-2 right-2 bg-white text-gray-600 hover:text-blue-600 rounded-full p-2 shadow-md transition-colors">
                        <i class="fas fa-bookmark"></i>
                    </button>
                ` : ''}
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">${item.title}</h3>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        ETB ${item.price}/day
                    </span>
                </div>
                <p class="text-gray-600 text-sm mb-4">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.availability === 'AVAILABLE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }">
                        ${item.availability === 'AVAILABLE' ? 'Available' : 'Rented Out'}
                    </span>
                    <button onclick="viewItem('${item.id}')" 
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Search items
async function searchItems() {
    const query = document.getElementById('searchInput').value;
    try {
        const items = await callApi(`/items/search?q=${encodeURIComponent(query)}`);
        if (items) {
            displayItems(items);
        }
    } catch (error) {
        console.error('Error searching items:', error);
    }
}

// View item details
function viewItem(itemId) {
    window.location.href = `user/item-details.html?id=${itemId}`;
}

// Toggle bookmark - requires auth
async function toggleBookmark(itemId) {
    if (!isLoggedIn()) {
        localStorage.setItem('redirectUrl', window.location.href);
        window.location.href = './login.html';
        return;
    }

    try {
        await callApi(`/bookmarks/${itemId}`, { method: 'POST' });
        loadItems(); // Reload items to reflect changes
    } catch (error) {
        console.error('Error toggling bookmark:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadItems();
});


// bookmarks.js 
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

    // Fetch item details for each bookmark
    const bookmarksWithItems = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const item = await fetchItemDetails(bookmark.itemId);
        return { ...bookmark, item };
      })
    );

    console.log('Bookmarks with items:', bookmarksWithItems);
    return bookmarksWithItems;
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

  bookmarks.forEach((bookmark, index) => {
    console.log(`Processing bookmark ${index}:`, bookmark);
    
    if (!bookmark) {
      console.error('Bookmark is null or undefined');
      return;
    }

    const item = bookmark.item;
    console.log(`Item data for bookmark ${index}:`, item);

    if (!item) {
      console.error('No item data for bookmark:', bookmark);
      return;
    }

    const bookmarkCard = document.createElement("div");
    bookmarkCard.className = "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow";

    // Use the first photo from photos array
    const imageUrl = item.photos && item.photos.length > 0
      ? `data:image/jpeg;base64,${item.photos[0]}`
      : 'https://via.placeholder.com/300x200?text=No+Image';
    
    console.log("Image URL for bookmark:", imageUrl); // Debug log

    const cardHtml = `
      <div class="relative pb-[60%]">
        <img src="${imageUrl}" 
             alt="${item.title}" 
             class="absolute inset-0 w-full h-full object-cover">
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-lg mb-2">${item.title}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">${item.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-blue-600 font-bold">$${item.price}/day</span>
          <div class="flex space-x-3">
            <button onclick="viewItemDetails('${item.id}')" class="text-blue-500 hover:text-blue-700">
              <i class="fas fa-eye"></i>
            </button>
            <button onclick="removeBookmark('${bookmark.id}')" class="text-red-400 hover:text-red-600">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    bookmarkCard.innerHTML = cardHtml;
    bookmarksGrid.appendChild(bookmarkCard);
  });
}

// Remove bookmark
async function removeBookmark(bookmarkId) {
  if (!confirm("Are you sure you want to remove this bookmark?")) return;

  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${BOOKMARKS_ENDPOINT}/${bookmarkId}`, {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to remove bookmark");
    }

    await loadBookmarks(); // Refresh list
  } catch (error) {
    console.error("Error removing bookmark:", error);
    showError(error.message || "Failed to remove bookmark");
  }
}

// View item details
function viewItemDetails(itemId) {
  window.location.href = `../item-detail.html?id=${itemId}`;
}

// Load bookmarks
async function loadBookmarks() {
  console.log('Starting to load bookmarks...');
  const bookmarks = await fetchBookmarks();
  console.log('Bookmarks loaded:', bookmarks);
  renderBookmarks(bookmarks);
}

// Helpers
function showLoading(show) {
  loadingSpinner.classList.toggle("hidden", !show);
  errorMessage.classList.add("hidden");
  if (show) {
    bookmarksGrid.innerHTML = "";
    noBookmarksMessage.classList.add("hidden");
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  loadingSpinner.classList.add("hidden");
  setTimeout(() => errorMessage.classList.add("hidden"), 5000);
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

// profile.js 
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

// items.js 
// Constants
const API_BASE_URL = "http://localhost:8090/api";
const ITEMS_ENDPOINT = `${API_BASE_URL}/items`;
const ITEMS_PER_PAGE = 12;

// DOM Elements
const itemsGrid = document.getElementById("itemsGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");
let currentPage = 1;
let isLoading = false;
let hasMore = true;

// Fetch items from API
async function fetchItems(page = 1, search = "", sort = "newest") {
  try {
    isLoading = true;
    toggleLoading(true);

    const response = await fetch(
      `${ITEMS_ENDPOINT}?page=${page}&limit=${ITEMS_PER_PAGE}` +
      `&search=${encodeURIComponent(search)}&sort=${sort}`
    );

    if (!response.ok) throw new Error("Failed to fetch items");
    const { items, total } = await response.json();
    console.log("Fetched items:", items); // Debug log
    hasMore = page * ITEMS_PER_PAGE < total;
    return items;
  } catch (error) {
    showError(error.message || "Failed to load items");
    return [];
  } finally {
    isLoading = false;
    toggleLoading(false);
  }
}

// Render items
function renderItems(items) {
  if (items.length === 0 && currentPage === 1) {
    itemsGrid.innerHTML = `<p class="text-gray-500 text-center col-span-full py-12">No items found</p>`;
    return;
  }

  items.forEach(item => {
    console.log("Rendering item:", item); // Debug log
    const itemCard = document.createElement("div");
    itemCard.className = "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow";
    
    // Use the first photo from photos array
    const imageUrl = item.photos && item.photos.length > 0
      ? `data:image/jpeg;base64,${item.photos[0]}`
      : 'https://via.placeholder.com/300x200?text=No+Image';
    
    console.log("Image URL:", imageUrl); // Debug log

    itemCard.innerHTML = `
      <div class="relative h-48">
        <img src="${imageUrl}" alt="${item.title}" 
             class="w-full h-full object-cover">
        ${item.availability === "RENTED_OUT" ? 
          `<span class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            Rented
          </span>` : ""}
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-lg truncate">${item.title}</h3>
        <p class="text-gray-600 text-sm mt-2 line-clamp-2">${item.description}</p>
        <div class="mt-4 flex justify-between items-center">
          <span class="text-blue-600 font-bold">ETB ${item.price}/day</span>
          <button onclick="toggleBookmark('${item.id}')" class="text-gray-400 hover:text-blue-500">
            <i class="fas fa-bookmark ${isBookmarked(item.id) ? 'text-blue-500' : ''}"></i>
          </button>
        </div>
      </div>
    `;
    itemCard.addEventListener("click", () => viewItemDetails(item.id));
    itemsGrid.appendChild(itemCard);
  });
}

// Handle search/sort changes
function handleSearchAndSort() {
  currentPage = 1;
  itemsGrid.innerHTML = "";
  loadItems();
}

// Infinite scroll
window.addEventListener("scroll", () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && hasMore) {
    currentPage++;
    loadItems();
  }
});

// Load items
async function loadItems() {
  const items = await fetchItems(
    currentPage,
    searchInput.value.trim(),
    sortSelect.value
  );
  renderItems(items);
}

// Utility functions
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  setTimeout(() => errorMessage.classList.add("hidden"), 5000);
}

function toggleLoading(show) {
  loadingSpinner.classList.toggle("hidden", !show);
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}

function getImageUrl(image) {
  return `data:image/jpeg;base64,${image}`;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  searchInput.addEventListener("input", debounce(handleSearchAndSort, 300));
  sortSelect.addEventListener("change", handleSearchAndSort);
  loadItems();
});

// chat.js 
// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

// Update UI based on auth status
function updateAuthUI() {
    const isAuthenticated = isLoggedIn();
    document.getElementById('authLinks').style.display = isAuthenticated ? 'flex' : 'none';
    document.getElementById('nonAuthLinks').style.display = isAuthenticated ? 'none' : 'flex';
    
    // Show/hide message input based on auth
    const messageInput = document.getElementById('messageInput');
    const loginPrompt = document.getElementById('loginPrompt');
    if (messageInput && loginPrompt) {
        messageInput.style.display = isAuthenticated ? 'flex' : 'none';
        loginPrompt.style.display = isAuthenticated ? 'none' : 'flex';
    }
}

// API call helper
async function callApi(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`http://localhost:8090/api${endpoint}`, {
            ...options,
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            updateAuthUI();
            return null;
        }

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load chat messages
async function loadMessages() {
    try {
        const messages = await callApi('/chat/messages');
        if (messages) {
            displayMessages(messages);
        }
    } catch (error) {
        console.error('Failed to load messages:', error);
    }
}

// Display messages
function displayMessages(messages) {
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.innerHTML = messages.map(msg => `
        <div class="p-3 ${msg.isMine ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} rounded-lg max-w-[70%] mb-3">
            <div class="font-semibold text-sm text-gray-800">${msg.username}</div>
            <div class="text-gray-700">${msg.content}</div>
            <div class="text-xs text-gray-500 mt-1">${new Date(msg.timestamp).toLocaleString()}</div>
        </div>
    `).join('');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send message
async function sendMessage(event) {
    event.preventDefault();
    
    if (!isLoggedIn()) {
        localStorage.setItem('redirectUrl', window.location.href);
        window.location.href = './login.html';
        return;
    }

    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;

    try {
        await callApi('/chat/messages', {
            method: 'POST',
            body: JSON.stringify({ content: message })
        });
        
        messageInput.value = '';
        loadMessages();
    } catch (error) {
        console.error('Failed to send message:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadMessages();
    
    // Set up message form
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', sendMessage);
    }
    
    // Optional: Set up auto-refresh for messages
    setInterval(loadMessages, 5000);
});


// login.js 
function showError(message) {
    const errorDiv = document.getElementById("errorMessage");
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove("hidden");
    }
}

// Handle login form
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.classList.add('hidden');
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if (!email || !password) {
        showError("Please fill in all fields");
        return;
    }
    
    try {
        const response = await fetch('http://localhost:8090/api/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Login failed');
        }

        const data = await response.json();
        const token = data.token;
        const user = data.user;

        if (token && user) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = './index.html';
        } else {
            throw new Error("Invalid response from server");
        }
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || "Login failed. Please try again.");
    }
});

