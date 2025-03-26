document.addEventListener('DOMContentLoaded', () => {
    try {
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
            try {
                // Reemplaza 'URL_DE_PAGO_DE_PAYPAL' con la URL real de tu página de pago de PayPal
                window.location.href = 'https://www.paypal.com/es/webapps/mpp/how-paypal-works';
            } catch (error) {
                console.error('Error al redirigir a PayPal:', error);
                alert('Ocurrió un error al procesar el pago con PayPal.');
            }
        });

        document.getElementById('tarjeta').addEventListener('click', () => {
            // Mostrar formulario de pago con tarjeta
            // (usar una biblioteca segura como Stripe.js)
            alert('La opción de pago con tarjeta aún no está implementada.'); // Mensaje temporal
        });
    } catch (error) {
        console.error('Error al cargar la página de pago:', error);
        alert('Ocurrió un error al cargar la página de pago. Por favor, inténtalo de nuevo.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    try {
        // ... (código existente para resumen de compra y métodos de pago) ...

        // Manejar el clic en el botón "Tarjeta de Crédito"
        document.getElementById('tarjeta').addEventListener('click', () => {
            // Mostrar el formulario de pago con tarjeta
            document.getElementById('tarjeta-form').style.display = 'block';

            // Inicializar Stripe
            const stripe = Stripe('pk_test_51R6rFVRNOtfkvEE4moNiEJxskmpWYlKaMGWBgqaWH2TjoWdPpkQtFMhmWkjNfzzUyWBz3fSKJAKYlf26J6WHEyUY00BYAs0yss'); // Reemplaza con tu clave pública de Stripe
            const elements = stripe.elements();

            // Crear el elemento de tarjeta
            const card = elements.create('card');

            // Montar el elemento de tarjeta en el formulario
            card.mount('#card-element');

            // Manejar errores de tarjeta en tiempo real
            card.on('change', (event) => {
                const displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });

            // Manejar el envío del formulario
            const form = document.getElementById('payment-form');
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                stripe.createToken(card).then((result) => {
                    if (result.error) {
                        // Informar al usuario si hay errores
                        const errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                    } else {
                        // Enviar el token a tu servidor
                        stripeTokenHandler(result.token);
                    }
                });
            });

            // Función para manejar el token de Stripe
            function stripeTokenHandler(token) {
                // Enviar el token a tu servidor usando AJAX
                // (reemplaza con tu URL de backend)
                fetch('/procesar-pago', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: token, cart: cart }) // Envía el token y el carrito
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Pago exitoso!');
                        // Redirigir a la página de confirmación
                    } else {
                        alert('Error en el pago: ' + data.error);
                    }
                });
            }
        });

        // ... (resto del código) ...
    } catch (error) {
        // ...
    }
});