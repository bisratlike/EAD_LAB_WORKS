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