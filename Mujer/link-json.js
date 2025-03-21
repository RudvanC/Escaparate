document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = '/Admin/JSON/products-mujer.json'; // Ruta al archivo JSON (puedes adaptarlo para otras categorías)
    const mainContainer = document.querySelector('main'); // Contenedor principal para productos
    const adminContainer = document.getElementById('admin-products-container'); // Contenedor de administración
    const cartContainer = document.getElementById('cart'); // Contenedor para mostrar el carrito
    const saveButton = document.getElementById('save-visibility');
    const addSectionForm = document.getElementById('add-section-form');
    const addProductForm = document.getElementById('add-product-form');
    const productCategorySelect = document.getElementById('product-category');

    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Cargar productos desde localStorage o JSON
    const savedProducts = JSON.parse(localStorage.getItem('products'));
    if (savedProducts) {
        products = savedProducts;
        renderProducts();
    } else {
        fetch(jsonPath)
            .then(response => response.json())
            .then(data => {
                products = data;
                renderProducts();
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    // Función para renderizar los productos en la página principal
    function renderProducts() {
        // Limpiar el contenedor principal
        mainContainer.innerHTML = '';

        // Recuperar la visibilidad guardada en localStorage (si existe)
        const savedVisibility = JSON.parse(localStorage.getItem('productsVisibility')) || {};

        // Agrupar productos por categoría
        const groupedProducts = products.reduce((acc, product) => {
            if (!acc[product.category]) acc[product.category] = [];
            acc[product.category].push(product);
            return acc;
        }, {});

        // Renderizar cada categoría
        for (const [category, productsInCategory] of Object.entries(groupedProducts)) {
            // Crear la sección de la categoría
            const categorySection = document.createElement('section');
            categorySection.id = category;
            categorySection.classList.add(category);

            // Título de la categoría
            const categoryTitle = document.createElement('div');
            categoryTitle.classList.add('title');
            categoryTitle.innerHTML = `<h2>${category}</h2>`;
            categorySection.appendChild(categoryTitle);

            // Contenedor de productos
            const productsContainer = document.createElement('div');
            productsContainer.classList.add(`${category}-items`);
            productsContainer.id = `products-container-${category}`;

            // Renderizar productos de la categoría
            productsInCategory.forEach(product => {
                const isVisible = savedVisibility[product.id] !== undefined ? savedVisibility[product.id] : product.visible;

                if (isVisible) {
                    const card = document.createElement('article');
                    card.classList.add('product-card');

                    // Incluir el botón dentro del contenido
                    card.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <div class="desc-text">
                            <h3>${product.title}</h3>
                            <p>${product.description}</p>
                            <p>${product.colors}</p>
                            <h5>${product.price}</h5>
                            <button class="add-to-cart" data-title="${product.title}" data-price="${product.price}">
                                ${product.buttonText || "Añadir al carrito"}
                            </button>
                        </div>
                    `;

                    // Agregar el evento para el botón de carrito
                    const addButton = card.querySelector('.add-to-cart');
                    addButton.addEventListener('click', () => {
                        const title = addButton.getAttribute('data-title');
                        const price = addButton.getAttribute('data-price');
                        addToCart(title, price);
                    });

                    // Agregar la tarjeta al contenedor de productos
                    productsContainer.appendChild(card);
                }
            });

            // Agregar el contenedor de productos a la sección
            categorySection.appendChild(productsContainer);

            // Agregar la sección al contenedor principal
            mainContainer.appendChild(categorySection);
        }
    }

    // Función para añadir producto al carrito y actualizar el UI del carrito
    function addToCart(title, price) {
        const existing = cart.find(item => item.title === title);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ title, price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        alert(`¡Has añadido "${title}" con precio ${price} al carrito!`);
    }

    // Función para actualizar la interfaz del carrito
    function updateCartUI() {
        if (!cartContainer) return;
        cartContainer.innerHTML = '<h2>Carrito</h2>';
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.textContent = `${item.title} - ${item.price} x ${item.quantity}`;
            cartContainer.appendChild(itemDiv);
        });
    }

    // Actualizamos el UI del carrito al cargar la página
    updateCartUI();

    // El resto de tu código de administración (renderAdminProducts, agregar secciones, etc.)
    // ... (aquí puedes incluir el resto de funciones si también las tienes en admin.js)

});
