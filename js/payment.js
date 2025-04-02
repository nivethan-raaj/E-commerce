// Payment JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html?redirect=cart.html';
        return;
    }
    
    // Get current order
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (!currentOrder) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display order information
    displayOrderInfo(currentOrder);
    
    // View order button
    const viewOrderBtn = document.getElementById('view-order');
    if (viewOrderBtn) {
        viewOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real app, this would link to an order details page
            alert('Order details functionality would be implemented in a full version.');
        });
    }
});

// Display order information
function displayOrderInfo(order) {
    const orderNumber = document.getElementById('order-number');
    const orderDate = document.getElementById('order-date');
    const orderTotal = document.getElementById('order-total');
    const customerEmail = document.getElementById('customer-email');
    
    if (!orderNumber) return;
    
    // Format date
    const date = new Date(order.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update elements
    orderNumber.textContent = order.id;
    orderDate.textContent = formattedDate;
    orderTotal.textContent = formatCurrency(order.total);
    
    // Get shipping info for email
    const shippingInfo = order.shipping;
    if (shippingInfo) {
        customerEmail.textContent = shippingInfo.email;
    }
}