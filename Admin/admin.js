document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = '/Admin/products.json'; // Ruta al archivo JSON
    const adminContainer = document.getElementById('admin-products-container');
    const saveButton = document.getElementById('save-visibility');
    const addSectionForm = document.getElementById('add-section-form');
    const addProductForm = document.getElementById('add-product-form');
    const productCategorySelect = document.getElementById('product-category');

    let products = [];
    let categories = [];

    // Cargar productos desde el JSON
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            products = data;
            categories = [...new Set(products.map(product => product.category))]; // Obtener categorías únicas
            renderAdminProducts();
            populateCategorySelect();
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    // Función para renderizar los productos en la página de administración
    function renderAdminProducts() {
        // Limpiar el contenedor
        adminContainer.innerHTML = '';

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
            const categorySection = document.createElement('div');
            categorySection.classList.add('category-section');

            // Título de la categoría (clickeable)
            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category;
            categoryTitle.classList.add('category-title');
            categoryTitle.addEventListener('click', () => {
                const content = categorySection.querySelector('.category-content');
                content.classList.toggle('visible');
            });

            // Contenedor del contenido (inicialmente oculto)
            const categoryContent = document.createElement('div');
            categoryContent.classList.add('category-content');

            // Renderizar productos de la categoría
            productsInCategory.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('admin-product');

                // Imagen del producto
                const productImage = document.createElement('img');
                productImage.src = product.image;
                productImage.alt = product.title;

                // Información del producto
                const productInfo = document.createElement('div');
                productInfo.classList.add('product-info');
                productInfo.innerHTML = `
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <p>${product.colors}</p>
                    <p class="price">${product.price}</p>
                `;

                // Checkbox para visibilidad
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = savedVisibility[product.id] !== undefined ? savedVisibility[product.id] : product.visible;
                checkbox.id = `product-${product.id}`;

                // Agregar elementos al contenedor del producto
                productDiv.appendChild(productImage);
                productDiv.appendChild(productInfo);
                productDiv.appendChild(checkbox);

                // Agregar el producto al contenedor de la categoría
                categoryContent.appendChild(productDiv);
            });

            // Agregar título y contenido a la sección de la categoría
            categorySection.appendChild(categoryTitle);
            categorySection.appendChild(categoryContent);

            // Agregar la sección de la categoría al contenedor principal
            adminContainer.appendChild(categorySection);
        }
    }

    // Función para llenar el select de categorías
    function populateCategorySelect() {
        productCategorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            productCategorySelect.appendChild(option);
        });
    }

    // Agregar nueva sección
    addSectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const sectionName = document.getElementById('section-name').value.trim();
        if (sectionName && !categories.includes(sectionName)) {
            categories.push(sectionName);
            localStorage.setItem('categories', JSON.stringify(categories)); // Guardar categorías
            populateCategorySelect();
            addSectionForm.reset();
            alert(`Sección "${sectionName}" agregada correctamente.`);
        } else {
            alert('La sección ya existe o el nombre es inválido.');
        }
    });

    // Agregar nuevo producto
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProduct = {
            id: Date.now(), // ID único basado en la fecha
            category: document.getElementById('product-category').value,
            title: document.getElementById('product-title').value.trim(),
            description: document.getElementById('product-description').value.trim(),
            colors: document.getElementById('product-colors').value.trim(),
            price: document.getElementById('product-price').value.trim(),
            image: document.getElementById('product-image').value.trim(),
            visible: true, // Por defecto, el producto es visible
        };

        if (newProduct.category && newProduct.title && newProduct.image) {
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            renderAdminProducts();
            addProductForm.reset();
            alert('Producto agregado correctamente.');
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });

    // Guardar cambios en localStorage
    saveButton.addEventListener('click', () => {
        const visibilityMap = {};

        // Recorrer todos los checkboxes y guardar su estado
        products.forEach(product => {
            const checkbox = document.getElementById(`product-${product.id}`);
            visibilityMap[product.id] = checkbox.checked;
        });

        // Guardar en localStorage
        localStorage.setItem('productsVisibility', JSON.stringify(visibilityMap));
        localStorage.setItem('products', JSON.stringify(products));
        alert('Cambios guardados correctamente.');
    });
});