let cart = [];

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.id = 'empty-cart';
        emptyRow.innerHTML = `
            <td colspan="5" class="text-center">Your cart is empty</td>
        `;
        cartItems.appendChild(emptyRow);
        cartTotal.textContent = '0';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const row = document.createElement('tr');
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹ ${item.price}</td>
            <td>
                <button type="button" class="btn btn-sm btn-outline-secondary decrement" data-id="${item.id}">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button type="button" class="btn btn-sm btn-outline-secondary increment" data-id="${item.id}">+</button>
            </td>
            <td>₹ ${itemTotal}</td>
            <td><button type="button" class="btn btn-sm btn-danger remove" data-id="${item.id}">Remove</button></td>
        `;

        cartItems.appendChild(row);
    });

    cartTotal.textContent = total;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const id = parseInt(event.target.getAttribute('data-id'), 10);
            const name = event.target.getAttribute('data-name');
            const price = parseInt(event.target.getAttribute('data-price'), 10);

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            updateCartDisplay();
        });
    });

    document.getElementById('cart-items').addEventListener('click', event => {
        let target = event.target;
        while (target && target !== event.currentTarget) {
            if (target.classList.contains('increment') || target.classList.contains('decrement') || target.classList.contains('remove')) {
                const id = parseInt(target.getAttribute('data-id'), 10);
                const item = cart.find(item => item.id === id);

                if (target.classList.contains('increment') && item) {
                    item.quantity++;
                    updateCartDisplay();
                } else if (target.classList.contains('decrement') && item && item.quantity > 1) {
                    item.quantity--;
                    updateCartDisplay();
                } else if (target.classList.contains('remove')) {
                    cart = cart.filter(item => item.id !== id);
                    updateCartDisplay();
                }
                break;
            }
            target = target.parentElement;
        }
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Add some items first.');
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryLocation = 'Shivajinagar, Pune';
        alert(`Order Confirmed! Total: ₹ ${total}\nDelivering to ${deliveryLocation}`);

        cart = [];
        updateCartDisplay();
    });

    updateCartDisplay();
});
