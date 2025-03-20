 // Obtener todos los enlaces del menú
 const menuLinks = document.querySelectorAll('.menu a');

 // Obtener el checkbox del menú
 const menuCheckbox = document.getElementById('menu-toggle');

 // Añadir un event listener a cada enlace del menú
 menuLinks.forEach(link => {
     link.addEventListener('click', function() {
         menuCheckbox.checked = false; // Desmarcar el checkbox para cerrar el menú
     });
 });

 document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = '/Hombre/products.json';
  
    // Contenedores para cada categoría
    const containerShoes = document.getElementById('products-container-shoes');
    const containerShirts = document.getElementById('products-container-shirts');
    const containerPants = document.getElementById('products-container-pants');
  
    fetch(jsonPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo JSON');
        }
        return response.json();
      })
      .then(products => {
        // Recorremos cada producto
        products.forEach(product => {
          // Creamos una tarjeta para el producto
          const card = document.createElement('article');
          card.classList.add('product-card'); // Puedes definir estilos para .product-card en tu CSS
  
          card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="desc-text">
              <h3>${product.title}</h3>
              <p>${product.description}</p>
              <p>${product.colors}</p>
              <h5>${product.price}</h5>
            </div>
          `;
  
          // Agregamos la tarjeta al contenedor correspondiente según la categoría
          if (product.category === 'shoes') {
            containerShoes.appendChild(card);
          } else if (product.category === 'shirts') {
            containerShirts.appendChild(card);
          } else if (product.category === 'pants') {
            containerPants.appendChild(card);
          }
        });
      })
      .catch(error => {
        console.error('Error al cargar los productos:', error);
        // Puedes mostrar un mensaje de error en cada contenedor si lo deseas
      });
  });
  