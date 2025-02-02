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