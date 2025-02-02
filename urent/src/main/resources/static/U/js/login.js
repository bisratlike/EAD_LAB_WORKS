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
