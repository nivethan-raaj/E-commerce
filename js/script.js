// Common JavaScript for all pages

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && !event.target.closest('.nav-links') && !event.target.closest('.menu-toggle')) {
            navLinks.classList.remove('active');
        }
    });
    
    // Update cart count
    updateCartCount();
    
    // Check if user is logged in
    checkLoginStatus();
});

// Function to update cart count
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Function to check login status
function checkLoginStatus() {
    const loginLink = document.getElementById('login-link');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (loginLink && isLoggedIn && userData) {
        loginLink.innerHTML = `<i class="fas fa-user"></i> ${userData.name.split(' ')[0]}`;
        loginLink.href = '#';
        
        // Create dropdown for user menu
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <ul>
                <li><a href="profile.html">My Profile</a></li>
                <li><a href="orders.html">My Orders</a></li>
                <li><a href="#" id="logout-btn">Logout</a></li>
            </ul>
        `;
        
        loginLink.parentNode.appendChild(userMenu);
        
        // Toggle user menu
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            userMenu.classList.toggle('active');
        });
        
        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');
                window.location.href = 'index.html';
            });
        }
    }
}

// Format currency
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

// Generate random ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}