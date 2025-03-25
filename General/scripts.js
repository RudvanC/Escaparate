document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = '../Admin/JSON/json-general.json';

    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            // Convertir JSON a array plano
            const products = Object.entries(data).flatMap(([section, items]) =>
                items.map(product => ({
                    ...product,
                    section: section.toLowerCase()
                }))
            );
            renderProducts(products);
            addAddToCartButtons(products); // Llamar a la función después de renderizar los productos.
        })
        .catch(error => console.error('Error:', error));

    function renderProducts(products) {
        products.forEach(product => {
            if (!product.visible) return;

            // 1. Buscar la sección (hombre, mujer, nino)
            const section = document.getElementById(`${product.section}-section`);
            if (!section) return;

            // 2. Buscar el contenedor dentro de la sección
            const container = section.querySelector(`#products-container-${product.category}`);
            if (!container) return;

            // 3. Crear tarjeta
            const card = document.createElement('article');
            card.className = 'product-item';
            card.dataset.productId = product.id; // Agregar el atributo data-product-id
              
            
            let esImagenRemota = false
            if (product.image.startsWith('http')) {
                esImagenRemota = true
            }
            const imagePath = (!esImagenRemota ? '../Imagenes/' : '' ) + product.image 

            // let imagePath = product.image
            // if (!imagePath.startsWith('http')) {
            //     imagePath = `../Imagenes/${imagePath}`
            // }

            // const imagePath = (!product.image.startsWith('http') ? '../Imagenes/' : '') +  product.image


            card.innerHTML = `
                <img src="${imagePath}" alt="${product.title}">
                <div class="desc-text">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <p>${product.colors}</p>
                    <h5>${product.price}</h5>
                </div>
            `;
            container.appendChild(card);
        });
    }

    const cartIcon = document.getElementById('cart-icon');
    const cartContainer = document.getElementById('cart-container');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const cartCount = document.getElementById('cart-count');

    let cart = [];

    // Función para agregar un producto al carrito
    function addToCart(product) {
        cart.push(product);
        updateCart();
    }

    // Función para actualizar la visualización del carrito
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px;">
                <span>${item.title} - ${item.price}</span>
            `;
            cartItems.appendChild(itemDiv);
            total += parseFloat(item.price.replace('€', ''));
        });

        cartTotal.textContent = `Total: ${total.toFixed(2)}€`;
        cartCount.textContent = cart.length;
    }

    // Evento para mostrar/ocultar el carrito
    cartIcon.addEventListener('click', () => {
        if (cartContainer.style.display === 'block') {
            cartContainer.style.display = 'none';
        } else {
            cartContainer.style.display = 'block';
        }
    });

    // Evento para finalizar la compra (puedes personalizar esto)
    checkoutButton.addEventListener('click', () => {
        alert('Compra finalizada. Total: ' + cartTotal.textContent);
        cart = [];
        updateCart();
        cartContainer.style.display = 'none';
    });

    // Agregar eventos de clic a los botones "Agregar al carrito"
    function addAddToCartButtons(products) {
        const productSections = document.querySelectorAll('.shoes-items, .shirts-items, .pants-items, .chaquetas-items, .pantalones-items, .camisas-items, .faldas-items, .vestidos-items, .deporte-items, .conjuntos-items, .lenceria-items, .camisetas-items, .shorts-items, .zapatos-items');

        productSections.forEach(section => {
            section.querySelectorAll('.product-item').forEach(productItem => {
                const addButton = document.createElement('button');
                addButton.textContent = 'Agregar al carrito';
                addButton.addEventListener('click', () => {
                    const productId = productItem.dataset.productId;
                    const product = findProductById(productId, products);
                    if (product) {
                        addToCart(product);
                    }
                });
                productItem.appendChild(addButton);
            });
        });
    }

    // Función para encontrar un producto por su ID
    function findProductById(id, products) {
        return products.find(product => product.id == id);
    }
});