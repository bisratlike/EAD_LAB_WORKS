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