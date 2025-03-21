document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = '/Admin/JSON/json-general.json';

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
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
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
});