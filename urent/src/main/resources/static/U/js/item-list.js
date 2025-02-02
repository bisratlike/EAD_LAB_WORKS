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
