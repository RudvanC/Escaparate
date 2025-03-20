document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = '/Admin/products.json'; // Ruta al archivo JSON
    const mainContainer = document.querySelector('main'); // Contenedor principal
    const mainCategory = 'Hombre'; // Cambia este valor según la página

    let products = [];

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

        // Recuperar la visibilidad guardada en localStorage
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

                    card.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <div class="desc-text">
                            <h3>${product.title}</h3>
                            <p>${product.description}</p>
                            <p>${product.colors}</p>
                            <h5>${product.price}</h5>
                        </div>
                    `;

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
});