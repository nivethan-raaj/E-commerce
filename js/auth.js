// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');
            
            // Simple validation
            if (!email || !password) {
                errorElement.textContent = 'Please enter both email and password';
                return;
            }
            
            // Check credentials (in a real app, this would be a server request)
            if (email === 'nivethanraajt@gmail.com' && password === 'nive123') {
                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                
                // Store user data
                const userData = {
                    name: 'Nivethan Raaj',
                    email: email,
                    id: generateId()
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Redirect to home page or previous page
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
                window.location.href = redirectUrl;
            } else {
                errorElement.textContent = 'Invalid email or password';
            }
        });
    }
    
    // Signup form handling
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorElement = document.getElementById('signup-error');
            
            // Simple validation
            if (!name || !email || !password || !confirmPassword) {
                errorElement.textContent = 'Please fill in all fields';
                return;
            }
            
            if (password !== confirmPassword) {
                errorElement.textContent = 'Passwords do not match';
                return;
            }
            
            // In a real app, this would send data to a server
            // For demo purposes, we'll just store in localStorage
            
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            
            // Store user data
            const userData = {
                name: name,
                email: email,
                id: generateId()
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
        window.location.href = 'index.html';
    }
});