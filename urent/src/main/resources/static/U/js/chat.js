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
