document.addEventListener('DOMContentLoaded', () => {
    // Obtener los datos del carrito desde el almacenamiento local
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Mostrar el resumen de la compra
    const resumenCompra = document.getElementById('resumen-compra');
    let total = 0;
    cart.forEach(item => {
        resumenCompra.innerHTML += `<p>${item.title} - ${item.price.toFixed(2)}€</p>`;
        total += item.price;
    });
    resumenCompra.innerHTML += `<p><strong>Total: ${total.toFixed(2)}€</strong></p>`;

    // Mostrar las opciones de pago
    const metodoPago = document.getElementById('metodo-pago');
    metodoPago.innerHTML = `
        <p>Selecciona un método de pago:</p>
        <button id="paypal">PayPal</button>
        <button id="tarjeta">Tarjeta de Crédito</button>
    `;

    // Manejar el clic en el botón "Imprimir Ticket"
    const imprimirTicket = document.getElementById('imprimir-ticket');
    imprimirTicket.addEventListener('click', () => {
        window.print();
    });

    // Manejar el clic en los botones de pago
    document.getElementById('paypal').addEventListener('click', () => {
        // Redirigir a PayPal
        window.location.href = 'URL_DE_PAGO_DE_PAYPAL';
    });

    document.getElementById('tarjeta').addEventListener('click', () => {
        // Mostrar formulario de pago con tarjeta
        // (usar una biblioteca segura como Stripe.js)
    });
});