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
            card.dataset.productId = product.id; // Agregar el atributo data-product-id
              
            
            // let esImagenRemota = false
            // if (product.image.startsWith('http')) {
            //     esImagenRemota = true
            // }
           

            let imagePath = product.image
            if (!imagePath.startsWith('http')) {
                imagePath = `../Imagenes/${imagePath}`
            }

            // const imagePath = (!product.image.startsWith('http') ? '../Imagenes/' : '') +  product.image

        
         

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



    //CARRITO
   // Elementos del DOM para el carrito
const cartIcon = document.getElementById('cart-icon');
const cartContainer = document.getElementById('cart-container');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
let checkoutButton = document.getElementById('checkout-button');

let cart = [];

// Función para agregar un producto al carrito
function addToCart(product) {
  // Soporta precios en € y $
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

// Función para actualizar la visualización del carrito
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
      alert('Compra finalizada. Total: ' + cartTotal.textContent);
      cart = [];
      updateCart();
      cartContainer.style.display = 'none';
    });
    cartContainer.appendChild(checkoutButton);
  }
}

// Mostrar u ocultar el contenedor del carrito
cartIcon.addEventListener('click', () => {
  cartContainer.style.display = (cartContainer.style.display === 'block') ? 'none' : 'block';
});

// Función de búsqueda: ahora los IDs son únicos, por lo que basta compararlos
function findProductById(id, products) {
  return products.find(product => product.id === id);
}

/* 
  Función para agregar el botón "Agregar al carrito" a cada producto.
  Se recorre cada contenedor con la clase .items-general-container y se asume que cada producto
  ya está renderizado en el HTML con la clase "product-item" y el atributo data-product-id.
*/
function addAddToCartButtons(products) {
  const containers = document.querySelectorAll('.items-general-container');
  
  containers.forEach(container => {
    Array.from(container.children).forEach(productItem => {
      // Si el producto no tiene la clase 'product-item', se la asignamos
      if (!productItem.classList.contains('product-item')) {
        productItem.classList.add('product-item');
      }
      
      // Evitar duplicar el botón
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

/*
  Se combinan los productos de todas las categorías.
  Se asume que 'data' es el objeto JSON con las propiedades "hombre", "mujer" y "nino".
*/
const allProducts = [
  ...data.hombre,
  ...data.mujer,
  ...data.nino
];

// Llamamos a la función para agregar los botones una vez que los productos se hayan renderizado en el HTML.
addAddToCartButtons(allProducts);

    
});