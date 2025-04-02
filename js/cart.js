// Cart JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCart();
    
    // Continue shopping button
    const continueShoppingBtn = document.getElementById('continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            
            if (!isLoggedIn) {
                // Redirect to login page with return URL
                window.location.href = 'login.html?redirect=checkout.html';
            } else {
                // Proceed to checkout
                window.location.href = 'checkout.html';
            }
        });
    }
});

// Load cart items
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartContainer = document.getElementById('cart-container');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartItemsContainer) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartContainer.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        return;
    }
    
    // Clear cart items container
    cartItemsContainer.innerHTML = '';
    
    // Add each item to the cart
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            </div>
            <div class="cart-item-total">
                ${formatCurrency(item.price * item.quantity)}
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners for quantity buttons and remove buttons
    addCartEventListeners();
    
    // Update cart summary
    updateCartSummary();
}

// Add event listeners for cart items
function addCartEventListeners() {
    // Decrease quantity buttons
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateItemQuantity(id, 'decrease');
        });
    });
    
    // Increase quantity buttons
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateItemQuantity(id, 'increase');
        });
    });
    
    // Quantity input fields
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const quantity = parseInt(this.value);
            
            if (quantity < 1) {
                this.value = 1;
                updateItemQuantity(id, 'set', 1);
            } else {
                updateItemQuantity(id, 'set', quantity);
            }
        });
    });
    
    // Remove buttons
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeCartItem(id);
        });
    });
}

// Update item quantity
function updateItemQuantity(id, action, value = null) {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the item
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        switch (action) {
            case 'increase':
                cart[itemIndex].quantity += 1;
                break;
            case 'decrease':
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity -= 1;
                }
                break;
            case 'set':
                cart[itemIndex].quantity = value;
                break;
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Reload cart
        loadCart();
        
        // Update cart count
        updateCartCount();
    }
}

// Remove item from cart
function removeCartItem(id) {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Filter out the item to remove
    const updatedCart = cart.filter(item => item.id !== id);
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Reload cart
    loadCart();
    
    // Update cart count
    updateCartCount();
}

// Update cart summary
function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate shipping (free over $50, otherwise $5.99)
    const shipping = subtotal > 50 ? 0 : 5.99;
    
    // Calculate tax (8.25%)
    const tax = subtotal * 0.0825;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Update elements
    subtotalElement.textContent = formatCurrency(subtotal);
    shippingElement.textContent = formatCurrency(shipping);
    taxElement.textContent = formatCurrency(tax);
    totalElement.textContent = formatCurrency(total);
}