document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const toastElement = document.getElementById('cartToast');
    const toastMessage = document.getElementById('toastMessage');
    
    const cartToast = new bootstrap.Toast(toastElement, {
        delay: 3000
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const card = this.closest('.product-card');
            const productName = card.querySelector('.product-name').textContent;
            
            toastMessage.innerHTML = `<strong>${productName}</strong> has been added to your cart!`;
            
            cartToast.show();
            
            const originalText = this.textContent;
            this.textContent = 'Added ✓';
            this.classList.replace('btn-primary', 'btn-success');
            
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.replace('btn-success', 'btn-primary');
            }, 2000);
        });
    });
});