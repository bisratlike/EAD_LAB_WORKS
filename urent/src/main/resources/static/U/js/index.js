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
                        ${item.availability}
                    </span>
                    <a href="user/item-details.html?id=${item.id}" 
                       class="inline-flex items-center text-blue-600 hover:text-blue-700">
                        View Details
                        <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Debounce helper
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

// Search items
const searchItems = debounce(async () => {
    try {
        const searchQuery = document.getElementById('searchInput').value.trim();
        if (!searchQuery) {
            loadItems();
            return;
        }

        const items = await callApi(`/items/search?query=${encodeURIComponent(searchQuery)}`);
        if (items) {
            displayItems(items);
        }
    } catch (error) {
        console.error('Search failed:', error);
        showSearchError();
    }
});

// Show search error
function showSearchError() {
    document.getElementById('itemsGrid').innerHTML = `
        <div class="text-center text-gray-500 py-8">
            Failed to search items. Please try again later.
        </div>
    `;
}

// Toggle bookmark
async function toggleBookmark(itemId) {
    if (!isLoggedIn()) {
        window.location.href = '/U/login.html';
        return;
    }

    try {
        await callApi(`/bookmarks/${itemId}`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('Failed to toggle bookmark:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadItems();
    
    // Add search input listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchItems);
    }
});