// API base URL
const API_BASE_URL = 'http://localhost:8090/api';

// API call helper
async function callApi(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/U/login.html';
            return null;
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'API request failed');
        }

        return await response.json();
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
