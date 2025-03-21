document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = '/Admin/JSON/json-general.json';
    let productsData = {};
    let currentCategory = 'hombre';
    let currentSubcategory = '';

    // Elementos del DOM
    const elements = {
        mainCategory: document.getElementById('main-category'),
        subCategory: document.getElementById('sub-category'),
        productsList: document.getElementById('products-list'),
        newSectionInput: document.getElementById('new-section-name'),
        productForm: document.getElementById('product-form'),
        sectionForm: document.getElementById('section-form')
    };

    // Cargar datos iniciales
    const loadData = async () => {
        try {
            const response = await fetch(jsonPath);
            productsData = await response.json();
            initCategories();
            loadSubcategories();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // Inicializar categorías principales
    const initCategories = () => {
        elements.mainCategory.innerHTML = Object.keys(productsData)
            .map(category => `<option value="${category}">${category.toUpperCase()}</option>`)
            .join('');
    };

    // Cargar subcategorías
    const loadSubcategories = () => {
        const categories = [...new Set(productsData[currentCategory].map(p => p.category))];
        elements.subCategory.innerHTML = categories
            .map(cat => `<option value="${cat}">${cat.toUpperCase()}</option>`)
            .join('');
        currentSubcategory = categories[0] || '';
        loadProducts();
    };

    // Cargar productos
    const loadProducts = () => {
        elements.productsList.innerHTML = productsData[currentCategory]
            .filter(p => p.category === currentSubcategory)
            .map((product, index) => `
                <div class="product-card ${product.visible ? 'visible' : 'hidden'}" data-index="${index}">
                    <img src="${product.image.startsWith('//') ? 'https:' + product.image : product.image}" alt="${product.title}">
                    <div class="product-info">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <div class="product-controls">
                            <label>
                                <input type="checkbox" ${product.visible ? 'checked' : ''}>
                                Visible
                            </label>
                            <button class="delete-product">Eliminar</button>
                        </div>
                    </div>
                </div>
            `).join('');
    };

    // Event Listeners
    elements.mainCategory.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        loadSubcategories();
    });

    elements.subCategory.addEventListener('change', (e) => {
        currentSubcategory = e.target.value;
        loadProducts();
    });

    elements.sectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newCategory = elements.newSectionInput.value.trim().toLowerCase();
        if (newCategory && !productsData[currentCategory].some(p => p.category === newCategory)) {
            productsData[currentCategory].push({
                id: Date.now(),
                category: newCategory,
                categoryDisplay: newCategory.charAt(0).toUpperCase() + newCategory.slice(1),
                title: `Nuevo Producto ${newCategory}`,
                description: "Descripción temporal",
                colors: "2 colores",
                price: "00.00€",
                image: "/Imagenes/placeholder.jpg",
                visible: false
            });
            elements.newSectionInput.value = '';
            loadSubcategories();
        }
    });

    elements.productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newProduct = {
            id: Date.now(),
            category: currentSubcategory,
            categoryDisplay: currentSubcategory.charAt(0).toUpperCase() + currentSubcategory.slice(1),
            title: formData.get('title'),
            description: formData.get('description'),
            colors: formData.get('colors'),
            price: formData.get('price'),
            image: formData.get('image'),
            visible: true
        };
        
        productsData[currentCategory].push(newProduct);
        e.target.reset();
        loadProducts();
    });

    // Delegación de eventos para controles dinámicos
    elements.productsList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const index = e.target.closest('.product-card').dataset.index;
            productsData[currentCategory][index].visible = e.target.checked;
        }
    });

    elements.productsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-product')) {
            const index = e.target.closest('.product-card').dataset.index;
            productsData[currentCategory].splice(index, 1);
            loadProducts();
        }
    });

    // Botón Guardar
    document.getElementById('save-changes').addEventListener('click', () => {
        localStorage.setItem('productsData', JSON.stringify(productsData));
        alert('Cambios guardados exitosamente');
    });

    // Inicialización
    loadData();
});