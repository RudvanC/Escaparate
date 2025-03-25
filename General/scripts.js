document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = '../Admin/JSON/json-general.json';

    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            const products = Object.entries(data).flatMap(([section, items]) =>
                items.map(product => ({
                    ...product,
                    section: section.toLowerCase()
                }))
            );
            renderProducts(products);
            addAddToCartButtons(products);
        })
        .catch(error => console.error('Error:', error));

    function renderProducts(products) {
        products.forEach(product => {
            if (!product.visible) return;

            const section = document.getElementById(`${product.section}-section`);
            if (!section) return;

            const container = section.querySelector(`#products-container-${product.category}`);
            if (!container) return;

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

            let esImagenRemota = false;
            if (product.image.startsWith('http')) {
                esImagenRemota = true;
            }
            const imagePath = (!esImagenRemota ? '../Imagenes/' : '') + product.image;

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

    let cart = [];

    function addToCart(product) {
        const precioNumerico = parseFloat(product.price.replace('€', ''));
        if (!isNaN(precioNumerico)) {
            cart.push({ ...product, price: precioNumerico });
            updateCart();
        } else {
            console.error('Precio inválido:', product.price);
        }
    }

    function updateCart() {
        let total = 0;

        cart.forEach(item => {
            if (typeof item.price === 'number') {
                total += item.price;
            } else {
                console.error('Precio no numérico en el carrito:', item.price);
            }
        });

        cartTotal.textContent = `Total: ${total.toFixed(2)}€`;
        cartItems.innerHTML = `<span>Artículos: ${cart.length}</span><div id="cart-total">Total: ${total.toFixed(2)}€</div><button id="checkout-button">Finalizar Compra</button>`;
    }

    cartIcon.addEventListener('click', () => {
        if (cartContainer.style.display === 'block') {
            cartContainer.style.display = 'none';
        } else {
            cartContainer.style.display = 'block';
        }
    });

    checkoutButton.addEventListener('click', () => {
        alert('Compra finalizada. Total: ' + cartTotal.textContent);
        cart = [];
        updateCart();
        cartContainer.style.display = 'none';
    });

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

    function findProductById(id, products) {
        return products.find(product => product.id == id);
    }
});