const cart = [];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const printBudgetButton = document.getElementById('print-budget');

    function addToCart(name, price) {
        cart.push({ name, price });
        updateCart();
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            cartItems.appendChild(li);
            total += item.price;
        });
        cartTotal.textContent = total.toFixed(2);
    }

    printBudgetButton.addEventListener('click', () => {
        const content = `
            <h2>Presupuesto</h2>
            <ul>${cartItems.innerHTML}</ul>
            <p>Total: $${cartTotal.textContent}</p>
        `;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(content);
        printWindow.document.print();
        printWindow.document.close();
    });