let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const title = this.getAttribute('data-title');
            const price = parseInt(this.getAttribute('data-price'));
            addToCart(id, title, price);
        });
    });
    
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterBooks(category);
        });
    });
});

function addToCart(id, title, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            title: title,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${title} added to cart`);
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-muted">Your cart is empty</p>';
        totalPriceElement.textContent = '₹0';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div>
                    <span class="cart-item-title">${item.title}</span>
                    <br>
                    <small class="text-muted">₹${item.price} × <span class="cart-item-quantity">${item.quantity}</span></small>
                </div>
                <div>
                    <span class="cart-item-price">₹${itemTotal}</span>
                    <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}">×</button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    totalPriceElement.textContent = `₹${total}`;
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            removeFromCart(id);
        });
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    showNotification('Item removed from cart');
}

function clearCart() {
    if (cart.length === 0) return;
    
    cart = [];
    updateCartDisplay();
    showNotification('Cart cleared');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some books before checkout.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`Order placed! Delivering to PCMC, Pune\n\nTotal items: ${itemCount}\nTotal amount: ₹${total}\n\nThank you for shopping at Pune Book Depot!`);
    
    cart = [];
    updateCartDisplay();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success alert-dismissible fade show position-fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1050';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function filterBooks(category) {
    const books = document.querySelectorAll('.col-md-6.col-lg-4.mb-4');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    books.forEach(book => {
        const bookCategory = book.querySelector('.card-text strong').nextSibling.textContent.trim().toLowerCase();
        
        if (category === 'all' || bookCategory === category.toLowerCase()) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    });
}