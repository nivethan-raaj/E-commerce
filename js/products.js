// Products JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sample product data (in a real app, this would come from a server)
    const products = [
        {
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            price: 79.99,
            image: "/images/bluetooth.jpg",
            category: 'electronics',
            rating: 4.5,
            description: 'High-quality wireless headphones with noise cancellation and long battery life.'
        },
        {
            id: 2,
            name: 'Men\'s Casual T-Shirt',
            price: 24.99,
            image: "/images/tshirt.jpg",
            category: 'clothing',
            rating: 4.2,
            description: 'Comfortable cotton t-shirt for everyday wear.'
        },
        {
            id: 3,
            name: 'Smart Home Speaker',
            price: 129.99,
            image: "/images/seaker.jpeg",
            category: 'electronics',
            rating: 4.7,
            description: 'Voice-controlled smart speaker with premium sound quality.'
        },
        {
            id: 4,
            name: 'Non-Stick Cooking Set',
            price: 89.99,
            image: "/images/cooking.jpeg",
            category: 'home',
            rating: 4.3,
            description: 'Complete set of non-stick cookware for your kitchen.'
        },
        {
            id: 5,
            name: 'Facial Cleanser',
            price: 19.99,
            image: "/images/cleanser.jpeg",
            category: 'beauty',
            rating: 4.6,
            description: 'Gentle facial cleanser for all skin types.'
        },
        {
            id: 6,
            name: 'Women\'s Running Shoes',
            price: 69.99,
            image: "/images/shoe.jpeg",
            category: 'clothing',
            rating: 4.4,
            description: 'Lightweight and comfortable running shoes for women.'
        },
        {
            id: 7,
            name: 'Stainless Steel Water Bottle',
            price: 24.99,
            image: "/images/bottle.jpg",
            category: 'home',
            rating: 4.8,
            description: 'Insulated water bottle that keeps drinks cold for 24 hours.'
        },
        {
            id: 8,
            name: 'Smartphone',
            price: 699.99,
            image: "/images/cell.jpeg",
            category: 'electronics',
            rating: 4.9,
            description: 'Latest smartphone with advanced camera and long battery life.'
        }
    ];
    
    // Load featured products on home page
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        // Display only 4 products for featured section
        const featuredProducts = products.slice(0, 4);
        
        featuredProducts.forEach(product => {
            const productCard = createProductCard(product);
            featuredProductsContainer.appendChild(productCard);
        });
    }
    
    // Load all products on products page
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        // Get category from URL if any
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        let filteredProducts = products;
        
        if (categoryParam) {
            filteredProducts = products.filter(product => product.category === categoryParam);
            document.querySelector('.products-header h2').textContent = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
            
            // Check the corresponding category filter
            const categoryCheckbox = document.getElementById(categoryParam);
            if (categoryCheckbox) {
                categoryCheckbox.checked = true;
            }
        }
        
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
        // Set up filters
        setupFilters(products, productsGrid);
        
        // Set up sorting
        setupSorting(filteredProducts, productsGrid);
        
        // Set up search
        setupSearch(products, productsGrid);
    }
});

// Create product card
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Generate star rating HTML
    const ratingStars = generateRatingStars(product.rating);
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-rating">${ratingStars}</div>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add event listener to Add to Cart button
    const addToCartBtn = productCard.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        addToCart(product);
    });
    
    return productCard;
}

// Generate rating stars
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Add to cart function
function addToCart(product) {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Increase quantity if product already exists
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    alert(`${product.name} added to cart!`);
}

// Set up filters
function setupFilters(products, productsGrid) {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const categoryFilters = document.querySelectorAll('#category-filters input');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    
    if (applyFiltersBtn && priceRange) {
        // Update price display
        priceRange.addEventListener('input', function() {
            priceValue.textContent = `$${this.value}`;
        });
        
        // Apply filters
        applyFiltersBtn.addEventListener('click', function() {
            // Get selected categories
            const selectedCategories = [];
            categoryFilters.forEach(filter => {
                if (filter.checked) {
                    selectedCategories.push(filter.value);
                }
            });
            
            // Get max price
            const maxPrice = parseFloat(priceRange.value);
            
            // Filter products
            let filteredProducts = products;
            
            if (selectedCategories.length > 0) {
                filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
            }
            
            filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
            
            // Clear and repopulate products grid
            productsGrid.innerHTML = '';
            
            if (filteredProducts.length === 0) {
                productsGrid.innerHTML = '<p class="no-products">No products match your filters. Please try different criteria.</p>';
            } else {
                filteredProducts.forEach(product => {
                    const productCard = createProductCard(product);
                    productsGrid.appendChild(productCard);
                });
            }
        });
    }
}

// Set up sorting
function setupSorting(products, productsGrid) {
    const sortSelect = document.getElementById('sort-by');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            let sortedProducts = [...products];
            
            switch (sortValue) {
                case 'price-low':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                default:
                    // Default sorting (featured)
                    break;
            }
            
            // Clear and repopulate products grid
            productsGrid.innerHTML = '';
            
            sortedProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        });
    }
}

// Set up search
function setupSearch(products, productsGrid) {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        // Search function
        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // If search is empty, show all products
                productsGrid.innerHTML = '';
                products.forEach(product => {
                    const productCard = createProductCard(product);
                    productsGrid.appendChild(productCard);
                });
                return;
            }
            
            // Filter products by search term
            const searchResults = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            
            // Clear and repopulate products grid
            productsGrid.innerHTML = '';
            
            if (searchResults.length === 0) {
                productsGrid.innerHTML = '<p class="no-products">No products match your search. Please try different keywords.</p>';
            } else {
                searchResults.forEach(product => {
                    const productCard = createProductCard(product);
                    productsGrid.appendChild(productCard);
                });
            }
        };
        
        // Search on button click
        searchBtn.addEventListener('click', performSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}