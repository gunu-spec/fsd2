let cart = [];

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function renderCart() {
    const tbody = document.getElementById('cartTable');
    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">Your cart is empty. Add items from the menu.</td>
            </tr>
        `;
        updateTotal();
        return;
    }

    tbody.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        return `
            <tr data-index="${index}">
                <td>${item.name}</td>
                <td>${item.price} ₹</td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-secondary cart-qty-btn" data-action="decrease" data-index="${index}">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button type="button" class="btn btn-sm btn-outline-secondary cart-qty-btn" data-action="increase" data-index="${index}">+</button>
                </td>
                <td>${itemTotal} ₹</td>
                <td><button type="button" class="btn btn-danger btn-sm cart-remove-btn" data-index="${index}">Remove</button></td>
            </tr>
        `;
    }).join('');
    updateTotal();
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalAmount').textContent = total;
}

function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartCount();
    renderCart();
}

function changeQuantity(index, delta) {
    const item = cart[index];
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

function setupEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id, 10);
            const name = button.dataset.name;
            const price = parseInt(button.dataset.price, 10);
            addToCart(id, name, price);
        });
    });

    document.getElementById('cartTable').addEventListener('click', event => {
        const target = event.target;
        if (target.matches('.cart-qty-btn')) {
            const index = parseInt(target.dataset.index, 10);
            const delta = target.dataset.action === 'increase' ? 1 : -1;
            changeQuantity(index, delta);
        }
        if (target.matches('.cart-remove-btn')) {
            const index = parseInt(target.dataset.index, 10);
            removeItem(index);
        }
    });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Add items before checkout.');
            return;
        }
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const location = 'Shivajinagar, Pune';
        alert(`Checkout Total: ₹${total}\nDelivery Location: ${location}`);
        cart = [];
        updateCartCount();
        renderCart();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderCart();
});