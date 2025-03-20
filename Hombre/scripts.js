 // Obtener todos los enlaces del menú
 const menuLinks = document.querySelectorAll('.menu a');

 // Obtener el checkbox del menú
 const menuCheckbox = document.getElementById('menu-toggle');

 // Añadir un event listener a cada enlace del menú
 menuLinks.forEach(link => {
     link.addEventListener('click', function() {
         menuCheckbox.checked = false; // Desmarcar el checkbox para cerrar el menú
     });
 });

 document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = 'products.json';
    const containerShoes = document.getElementById('products-container-shoes');
    const containerShirts = document.getElementById('products-container-shirts');
    const containerPants = document.getElementById('products-container-pants');

    let products = [];

    // Cargar productos desde el JSON
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    // Función para renderizar los productos en la página principal
    function renderProducts() {
        // Limpiar contenedores
        containerShoes.innerHTML = '';
        containerShirts.innerHTML = '';
        containerPants.innerHTML = '';

        // Recuperar la visibilidad guardada en localStorage
        const savedVisibility = JSON.parse(localStorage.getItem('productsVisibility')) || {};

        // Filtrar y renderizar solo los productos visibles
        products.forEach(product => {
            const isVisible = savedVisibility[product.id] !== undefined ? savedVisibility[product.id] : product.visible;

            if (isVisible) {
                const card = document.createElement('article');
                card.classList.add('product-card');

                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <div class="desc-text">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <p>${product.colors}</p>
                        <h5>${product.price}</h5>
                    </div>
                `;

                // Agregar la tarjeta al contenedor correspondiente
                if (product.category === 'shoes') {
                    containerShoes.appendChild(card);
                } else if (product.category === 'shirts') {
                    containerShirts.appendChild(card);
                } else if (product.category === 'pants') {
                    containerPants.appendChild(card);
                }
            }
        });
    }
});