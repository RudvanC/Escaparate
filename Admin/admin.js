document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const adminContainer = document.getElementById('admin-products-container');
    const saveButton = document.getElementById('save-visibility');
    const addSectionForm = document.getElementById('add-section-form');
    const addProductForm = document.getElementById('add-product-form');
    const categorySelect = document.getElementById('category-select');  // Selector principal: hombre, mujer, niño
    const productCategorySelect = document.getElementById('product-category'); // Selector de sección para agregar producto

    // Lista de categorías principales
    let categories = ['hombre', 'mujer', 'niño'];
    let currentCategory = 'hombre'; // Categoría seleccionada por defecto
    let data = {}; // Datos cargados desde el JSON

    // Función para cargar los datos desde el JSON
    function loadData() {
        const jsonPath = `/Admin/JSON/json-general.json`;
        fetch(jsonPath)
            .then(response => response.json())
            .then(json => {
                data = json;
                updateSectionSelect(); // Actualizar el select de secciones
                renderAdminProducts(); // Renderizar los productos
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }

    // Función para actualizar el select de secciones según la categoría seleccionada
    function updateSectionSelect() {
        productCategorySelect.innerHTML = '<option value="">Selecciona una sección</option>';
        if (data[currentCategory] && data[currentCategory].secciones) {
            data[currentCategory].secciones.forEach(seccion => {
                const option = document.createElement('option');
                option.value = seccion;
                option.textContent = seccion.charAt(0).toUpperCase() + seccion.slice(1);
                productCategorySelect.appendChild(option);
            });
        }
        // Opción para crear una nueva sección
        const newOption = document.createElement('option');
        newOption.value = 'new';
        newOption.textContent = 'Crear nueva sección';
        productCategorySelect.appendChild(newOption);
    }

    // Función para renderizar los productos en la página de administración
    function renderAdminProducts() {
        adminContainer.innerHTML = ''; // Limpiar el contenedor
        if (data[currentCategory] && data[currentCategory].productos) {
            data[currentCategory].productos.forEach(producto => {
                const card = document.createElement('article');
                card.classList.add('product-card');
                card.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.titulo}">
                    <div class="desc-text">
                        <h3>${producto.titulo}</h3>
                        <p>${producto.descripcion}</p>
                        <p>${producto.colores}</p>
                        <h5>${producto.precio}</h5>
                        <button class="add-to-cart" data-title="${producto.titulo}" data-price="${producto.precio}">
                            Añadir al carrito
                        </button>
                    </div>
                `;
                adminContainer.appendChild(card);
            });
        }
    }

    // Llenar el select de categorías principales
    function populateCategorySelect() {
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
        categorySelect.value = currentCategory;
    }

    // Evento para cambiar la categoría principal
    categorySelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        updateSectionSelect(); // Actualizar el select de secciones
        renderAdminProducts(); // Renderizar los productos
    });

    // Agregar nueva sección
    addSectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const sectionName = document.getElementById('section-name').value.trim();
        if (sectionName && data[currentCategory]) {
            if (!data[currentCategory].secciones.includes(sectionName)) {
                data[currentCategory].secciones.push(sectionName);
                localStorage.setItem('products', JSON.stringify(data));
                updateSectionSelect(); // Actualizar el select de secciones
                addSectionForm.reset();
                alert(`Sección "${sectionName}" creada en ${currentCategory}.`);
            } else {
                alert('La sección ya existe.');
            }
        } else {
            alert('Nombre de sección inválido.');
        }
    });

    // Agregar nuevo producto
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedSection = document.getElementById('product-category').value;
        const newProduct = {
            id: Date.now(),
            seccion: selectedSection,
            titulo: document.getElementById('product-title').value.trim(),
            descripcion: document.getElementById('product-description').value.trim(),
            colores: document.getElementById('product-colors').value.trim(),
            precio: document.getElementById('product-price').value.trim(),
            imagen: document.getElementById('product-image').value.trim(),
            visible: true
        };

        if (newProduct.titulo && newProduct.imagen && selectedSection && selectedSection !== 'new') {
            if (!data[currentCategory].productos) {
                data[currentCategory].productos = [];
            }
            data[currentCategory].productos.push(newProduct);
            localStorage.setItem('products', JSON.stringify(data));
            renderAdminProducts(); // Renderizar los productos actualizados
            addProductForm.reset();
            alert('Producto agregado correctamente.');
        } else if (selectedSection === 'new') {
            alert('Por favor, crea la nueva sección primero.');
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });

    // Inicialización
    populateCategorySelect();
    loadData();
});