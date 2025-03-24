document.addEventListener("DOMContentLoaded", () => {
  const jsonPath = '/Admin/JSON/json-general.json'; // Ruta al archivo JSON
  const adminContainer = document.getElementById('admin-products-container');
  const saveButton = document.getElementById('save-visibility');

  let products = [];

  // Cargar productos desde el JSON
  fetch(jsonPath)
      .then(response => response.json())
      .then(data => {
          products = data;
          renderAdminProducts();
      })
      .catch(error => console.error('Error al cargar los productos:', error));

  // Función para renderizar los productos en la página de administración
  function renderAdminProducts() {
      // Limpiar el contenedor
      adminContainer.innerHTML = '';

      // Recuperar la visibilidad guardada en localStorage
      const savedVisibility = JSON.parse(localStorage.getItem('productsVisibility')) || {};

      // Agrupar productos por categoría
      const categories = {
          shoes: [],
          shirts: [],
          pants: []
      };

      products.forEach(product => {
          categories[product.category].push(product);
      });

      // Renderizar cada categoría
      for (const [category, productsInCategory] of Object.entries(categories)) {
          const categorySection = document.createElement('div');
          categorySection.classList.add('category-section');

          // Título de la categoría (hacerlo clickeable)
          const categoryTitle = document.createElement('h2');
          categoryTitle.textContent = category === 'shoes' ? 'Zapatillas' :
                                    category === 'shirts' ? 'Camisetas' :
                                    'Pantalones';
          categoryTitle.classList.add('category-title');
          categoryTitle.addEventListener('click', () => {
              // Alternar la visibilidad del contenido
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
      alert('Cambios guardados correctamente.');
  });
});