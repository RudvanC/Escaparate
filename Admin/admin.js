document.addEventListener("DOMContentLoaded", () => {
    const adminContainer = document.getElementById('admin-products-container');
    const saveButton = document.getElementById('save-visibility');
    const addSectionForm = document.getElementById('add-section-form');
    const addProductForm = document.getElementById('add-product-form');
    const categorySelect = document.getElementById('category-select');  // Selección de categorías
    const productCategorySelect = document.getElementById('product-category'); // Selección de categoría en el formulario de productos

    let products = [];
    let categories = ['hombre', 'mujer', 'niño']; // Categorías predeterminadas
    let currentCategory = 'hombre'; // Categoría seleccionada por defecto

    // Cargar productos desde el archivo JSON según la categoría seleccionada
    function loadProducts(category) {
        const jsonPath = `/Admin/JSON/products-${category}.json`; // Ruta al archivo JSON correspondiente
        fetch(jsonPath)
            .then(response => response.json())
            .then(data => {
                products = data;
                renderAdminProducts();
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    // Cargar productos por defecto al cargar la página
    loadProducts(currentCategory);

    // Función para renderizar los productos en la página de administración
    function renderAdminProducts() {
        // Limpiar el contenedor de productos
        adminContainer.innerHTML = '';

        // Agrupar productos por categoría
        const groupedProducts = products.reduce((acc, product) => {
            if (!acc[product.category]) acc[product.category] = [];
            acc[product.category].push(product);
            return acc;
        }, {});

        // Solo renderizamos los productos de la categoría seleccionada
        const productsInCategory = groupedProducts[currentCategory] || [];

        // Crear la sección para la categoría seleccionada
        const categorySection = document.createElement('div');
        categorySection.classList.add('category-section');

        // Título de la categoría
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1); // Capitalizar primera letra
        categoryTitle.classList.add('category-title');

        // Contenedor del contenido (productos)
        const categoryContent = document.createElement('div');
        categoryContent.classList.add('category-content');

        // Renderizar productos
        productsInCategory.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('admin-product');

            const productImage = document.createElement('img');
            productImage.src = product.image;
            productImage.alt = product.title;

            const productInfo = document.createElement('div');
            productInfo.classList.add('product-info');
            productInfo.innerHTML = `
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>${product.colors}</p>
                <p class="price">${product.price}</p>
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = product.visible;
            checkbox.id = `product-${product.id}`;

            productDiv.appendChild(productImage);
            productDiv.appendChild(productInfo);
            productDiv.appendChild(checkbox);
            categoryContent.appendChild(productDiv);
        });

        categorySection.appendChild(categoryTitle);
        categorySection.appendChild(categoryContent);
        adminContainer.appendChild(categorySection);
    }

    // Función para llenar el select de categorías tanto para administrar como para agregar productos
    function populateCategorySelect() {
        // Llenar el select de categorías para administración
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });

        // Llenar el select de categorías para agregar productos
        productCategorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            productCategorySelect.appendChild(option);
        });
    }

    // Cargar productos de la categoría seleccionada
    categorySelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        loadProducts(currentCategory);
    });

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
            id: Date.now(),
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
            loadProducts(currentCategory); // Recargar los productos después de agregar uno nuevo
            addProductForm.reset();
            alert('Producto agregado correctamente.');
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });

    // Guardar cambios en visibilidad y productos
    saveButton.addEventListener('click', () => {
        const visibilityMap = {};

        // Recorrer los checkboxes y guardar el estado
        products.forEach(product => {
            const checkbox = document.getElementById(`product-${product.id}`);
            visibilityMap[product.id] = checkbox.checked;
        });

        // Guardar visibilidad y productos
        localStorage.setItem('productsVisibility', JSON.stringify(visibilityMap));
        localStorage.setItem('products', JSON.stringify(products));
        alert('Cambios guardados correctamente.');
    });

    // Inicializar categorías en el select
    populateCategorySelect();
});
