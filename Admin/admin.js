let originalData = {
    hombre: [],
    mujer: [],
    nino: []
};

// Cargar datos iniciales
fetch('./JSON/json-general.json')
    .then(res => res.json())
    .then(data => {
        originalData = data;
        renderSections();
    });

function renderSections() {
    const container = document.getElementById('sections-container');
    container.innerHTML = '';

    // Renderizar cada sección (hombre, mujer, nino)
    Object.entries(originalData).forEach(([sectionName, products]) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-container';

        // Agrupar productos por categoría
        const categories = groupByCategory(products);

        sectionDiv.innerHTML = `
            <h2>${sectionName.toUpperCase()}</h2>
            <div class="categories-container" id="${sectionName}-categories"></div>
        `;

        const categoriesContainer = sectionDiv.querySelector(`#${sectionName}-categories`);

        // Renderizar cada categoría
        Object.entries(categories).forEach(([categoryName, categoryProducts]) => {
            const categoryGroup = document.createElement('div');
            categoryGroup.className = 'category-group';
            categoryGroup.innerHTML = `<h3>${categoryProducts[0].categoryDisplay}</h3>`;

            // Renderizar productos
            categoryProducts.forEach((product, index) => {
                const productItem = document.createElement('div');
                
                let imagePath = product.image
                if (!imagePath.startsWith('http')) {
                    imagePath = `../Imagenes/${imagePath}`
                }
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <label style="margin-right: 15px;">
                        <input type="checkbox" ${product.visible ? 'checked' : ''} 
                            onchange="toggleProductVisibility('${sectionName}', '${categoryName}', ${index}, this.checked)">
                    </label>
                    <img src="${imagePath}" class="product-image" alt="${product.title}">
                    <div class="product-info">
                        <div><strong>${product.title}</strong></div>
                        <div>${product.description}</div>
                        <div>Precio: ${product.price}</div>
                    </div>
                `;
                categoryGroup.appendChild(productItem);
            });

            categoriesContainer.appendChild(categoryGroup);
        });

        container.appendChild(sectionDiv);
    });
}

function groupByCategory(products) {
    return products.reduce((acc, product) => {
        const category = product.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});
}

function toggleProductVisibility(sectionName, categoryName, productIndex, isVisible) {
    const categoryProducts = originalData[sectionName].filter(p => p.category === categoryName);
    const globalIndex = originalData[sectionName].indexOf(categoryProducts[productIndex]);
    originalData[sectionName][globalIndex].visible = isVisible;
}

function saveChanges() {
    // Guardar en localStorage (solución temporal)
    localStorage.setItem('productsData', JSON.stringify(originalData));

    // Aquí deberías implementar el guardado en servidor
    alert('Cambios guardados (localStorage)');

    // Actualizar la vista
    renderSections();
}