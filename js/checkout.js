// Checkout JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html?redirect=checkout.html';
        return;
    }
    
    // Load cart items in checkout summary
    loadCheckoutItems();
    
    // Set up checkout steps navigation
    setupCheckoutSteps();
    
    // Pre-fill email if user is logged in
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && document.getElementById('email')) {
        document.getElementById('email').value = userData.email;
    }
});

// Load checkout items
function loadCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (!checkoutItemsContainer) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if cart is empty
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Clear checkout items container
    checkoutItemsContainer.innerHTML = '';
    
    // Add each item to the checkout summary
    cart.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        
        checkoutItem.innerHTML = `
            <div class="checkout-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="checkout-item-details">
                <h4>${item.name}</h4>
                <div class="checkout-item-price">${formatCurrency(item.price)}</div>
                <div class="checkout-item-quantity">Qty: ${item.quantity}</div>
            </div>
        `;
        
        checkoutItemsContainer.appendChild(checkoutItem);
    });
    
    // Update checkout summary
    updateCheckoutSummary();
}

// Update checkout summary
function updateCheckoutSummary() {
    const subtotalElement = document.getElementById('checkout-subtotal');
    const shippingElement = document.getElementById('checkout-shipping');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    
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
    
    // Also update review totals if they exist
    const reviewSubtotal = document.getElementById('review-subtotal');
    const reviewShipping = document.getElementById('review-shipping-cost');
    const reviewTax = document.getElementById('review-tax');
    const reviewTotal = document.getElementById('review-total');
    
    if (reviewSubtotal) {
        reviewSubtotal.textContent = formatCurrency(subtotal);
        reviewShipping.textContent = formatCurrency(shipping);
        reviewTax.textContent = formatCurrency(tax);
        reviewTotal.textContent = formatCurrency(total);
    }
}

// Set up checkout steps navigation
function setupCheckoutSteps() {
    // Step elements
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    // Form elements
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    const reviewForm = document.getElementById('review-form');
    
    // Button elements
    const shippingNextBtn = document.getElementById('shipping-next');
    const paymentPrevBtn = document.getElementById('payment-prev');
    const paymentNextBtn = document.getElementById('payment-next');
    const reviewPrevBtn = document.getElementById('review-prev');
    const placeOrderBtn = document.getElementById('place-order');
    const editShippingBtn = document.getElementById('edit-shipping');
    const editPaymentBtn = document.getElementById('edit-payment');
    
    if (!shippingNextBtn) return;
    
    // Shipping to Payment
    shippingNextBtn.addEventListener('click', function() {
        // Validate shipping form
        const shippingInfoForm = document.getElementById('shipping-info-form');
        if (!validateForm(shippingInfoForm)) return;
        
        // Save shipping info
        const shippingInfo = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('phone').value
        };
        
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
        
        // Move to payment step
        shippingForm.classList.remove('active');
        paymentForm.classList.add('active');
        
        step1.classList.remove('active');
        step1.classList.add('completed');
        step2.classList.add('active');
    });
    
    // Payment to Shipping (back)
    paymentPrevBtn.addEventListener('click', function() {
        paymentForm.classList.remove('active');
        shippingForm.classList.add('active');
        
        step2.classList.remove('active');
        step1.classList.remove('completed');
        step1.classList.add('active');
    });
    
    // Payment to Review
    paymentNextBtn.addEventListener('click', function() {
        // Validate payment form
        const paymentInfoForm = document.getElementById('payment-info-form');
        if (!validateForm(paymentInfoForm)) return;
        
        // Save payment info
        const paymentInfo = {
            cardName: document.getElementById('card-name').value,
            cardNumber: document.getElementById('card-number').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value
        };
        
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
        
        // Move to review step
        paymentForm.classList.remove('active');
        reviewForm.classList.add('active');
        
        step2.classList.remove('active');
        step2.classList.add('completed');
        step3.classList.add('active');
        
        // Update review information
        updateReviewInfo();
    });
    
    // Review to Payment (back)
    reviewPrevBtn.addEventListener('click', function() {
        reviewForm.classList.remove('active');
        paymentForm.classList.add('active');
        
        step3.classList.remove('active');
        step2.classList.remove('completed');
        step2.classList.add('active');
    });
    
    // Edit shipping
    editShippingBtn.addEventListener('click', function() {
        reviewForm.classList.remove('active');
        shippingForm.classList.add('active');
        
        step3.classList.remove('active');
        step2.classList.remove('completed');
        step1.classList.remove('completed');
        step1.classList.add('active');
    });
    
    // Edit payment
    editPaymentBtn.addEventListener('click', function() {
        reviewForm.classList.remove('active');
        paymentForm.classList.add('active');
        
        step3.classList.remove('active');
        step2.classList.remove('completed');
        step2.classList.add('active');
    });
    
    // Place order
    placeOrderBtn.addEventListener('click', function() {
        // Create order
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo')) || {};
        
        // Calculate totals
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.0825;
        const total = subtotal + shipping + tax;
        
        // Create order object
        const order = {
            id: generateOrderNumber(),
            date: new Date().toISOString(),
            items: cart,
            shipping: shippingInfo,
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total
        };
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Save order ID for confirmation page
        localStorage.setItem('currentOrder', JSON.stringify(order));
        
        // Redirect to payment success page
        window.location.href = 'payment.html';
    });
}

// Validate form
function validateForm(form) {
    const inputs = form.querySelectorAll('input, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Update review information
function updateReviewInfo() {
    const reviewShipping = document.getElementById('review-shipping');
    const reviewPayment = document.getElementById('review-payment');
    const reviewItems = document.getElementById('review-items');
    
    // Get saved information
    const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo')) || {};
    const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo')) || {};
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update shipping information
    reviewShipping.innerHTML = `
        <p>${shippingInfo.firstName} ${shippingInfo.lastName}</p>
        <p>${shippingInfo.address}</p>
        <p>${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}</p>
        <p>${shippingInfo.country}</p>
        <p>${shippingInfo.phone}</p>
        <p>${shippingInfo.email}</p>
    `;
    
    // Update payment information
    const maskedCardNumber = paymentInfo.cardNumber.replace(/\d(?=\d{4})/g, "*");
    reviewPayment.innerHTML = `
        <p>${paymentInfo.cardName}</p>
        <p>${maskedCardNumber}</p>
        <p>Expires: ${paymentInfo.expiry}</p>
    `;
    
    // Update items
    reviewItems.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'review-item';
        itemElement.innerHTML = `
            <div class="review-item-name">${item.name} x ${item.quantity}</div>
            <div class="review-item-price">${formatCurrency(item.price * item.quantity)}</div>
        `;
        reviewItems.appendChild(itemElement);
    });
}

// Generate order number
function generateOrderNumber() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
}