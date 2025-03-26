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
          card.dataset.productId = product.id;

          let imagePath = product.image;
          if (!imagePath.startsWith('http')) {
              imagePath = `../Imagenes/${imagePath}`;
          }

          card.innerHTML = `
              <img src="${imagePath}" alt="${product.title}">
              <div class="desc-text">
                  <h3>${product.title}</h3>
                  <p>${product.description}</p>
                  <p>${product.colors}</p>
                  <h5>${product.price}</h5>
                  <h6>${product.stock}</h6>
              </div>
          `;
          container.appendChild(card);
      });
  }

  // CARRITO
  const cartIcon = document.getElementById('cart-icon');
  const cartContainer = document.getElementById('cart-container');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  let checkoutButton = document.getElementById('checkout-button');

  let cart = [];

  function addToCart(product) {
      const precioNumerico = parseFloat(
          product.price.replace('€', '').replace('$', '').replace(',', '.')
      );
      if (!isNaN(precioNumerico)) {
          cart.push({ ...product, price: precioNumerico });
          updateCart();
      } else {
          console.error('Precio inválido:', product.price);
      }
  }

  function updateCart() {
      let total = 0;
      cartItems.innerHTML = '';

      cart.forEach(item => {
          total += item.price;
          const itemElement = document.createElement('div');
          itemElement.textContent = `${item.title} - ${item.price.toFixed(2)}€`;
          cartItems.appendChild(itemElement);
      });

      cartTotal.textContent = `Total: ${total.toFixed(2)}€`;

      if (!document.getElementById('checkout-button')) {
          checkoutButton = document.createElement('button');
          checkoutButton.id = 'checkout-button';
          checkoutButton.textContent = 'Finalizar Compra';
          checkoutButton.addEventListener('click', () => {
              openCheckoutWindow();
          });
          cartContainer.appendChild(checkoutButton);
      }
  }

  cartIcon.addEventListener('click', () => {
      cartContainer.style.display = (cartContainer.style.display === 'block') ? 'none' : 'block';
  });

  function findProductById(id, products) {
      return products.find(product => product.id === id);
  }

  function addAddToCartButtons(products) {
      const containers = document.querySelectorAll('.items-general-container');

      containers.forEach(container => {
          Array.from(container.children).forEach(productItem => {
              if (!productItem.classList.contains('product-item')) {
                  productItem.classList.add('product-item');
              }

              if (!productItem.querySelector('.btn-add')) {
                  const addButton = document.createElement('button');
                  addButton.textContent = 'Agregar al carrito';
                  addButton.classList.add('btn-add');
                  addButton.addEventListener('click', () => {
                      const productId = productItem.dataset.productId;
                      const product = findProductById(productId, products);
                      if (product) {
                          addToCart(product);
                      } else {
                          console.error('Producto no encontrado:', productId);
                      }
                  });
                  productItem.appendChild(addButton);
              }
          });
      });
  }

  const allProducts = [
      ...data.hombre,
      ...data.mujer,
      ...data.nino
  ];

  addAddToCartButtons(allProducts);

  function openCheckoutWindow() {
    if (localStorage.getItem('usuarioLogueado')) {
        // Usuario logueado, redirigir a la página de pago
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'pago.html';
    } else {
        // Usuario no logueado, redirigir a la página de inicio de sesión
        localStorage.setItem('../login/login.html', 'pago.html'); // Guardar la URL de pago
        window.location.href = '../login/login.html';
    }
}

});


const headerMenu = document.getElementById('header-menu');
const sidebar = document.getElementById('sidebar');
const main =document.getElementById('main')

headerMenu.addEventListener('click',()=>{
    sidebar.classList.toggle('menu-toggle')
    headerMenu.classList.toggle('menu-toggle');
})