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