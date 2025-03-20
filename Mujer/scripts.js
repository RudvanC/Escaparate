const menuToggleHombres = document.getElementById('menu-toggle-hombres');
const menuToggleMujeres = document.getElementById('menu-toggle-mujeres');
const menuToggleNinos = document.getElementById('menu-toggle-ninos');

function closeOtherMenus(currentMenu) {
  if (currentMenu !== menuToggleHombres && menuToggleHombres.checked) {
    menuToggleHombres.checked = false;
  }
  if (currentMenu !== menuToggleMujeres && menuToggleMujeres.checked) {
    menuToggleMujeres.checked = false;
  }
  if (currentMenu !== menuToggleNinos && menuToggleNinos.checked) {
    menuToggleNinos.checked = false;
  }
}

menuToggleHombres.addEventListener('change', () => {
  if (menuToggleHombres.checked) {
    closeOtherMenus(menuToggleHombres);
  }
});

menuToggleMujeres.addEventListener('change', () => {
  if (menuToggleMujeres.checked) {
    closeOtherMenus(menuToggleMujeres);
  }
});

menuToggleNinos.addEventListener('change', () => {
  if (menuToggleNinos.checked) {
    closeOtherMenus(menuToggleNinos);
  }
});

/*carro*/
const cartItems = [];
let cartTotal = 0;

function addToCart(nombre, precio) {
    cartItems.push({ nombre, precio });
    cartTotal += precio;
    updateCart();
}

function removeFromCart(nombre) {
    const index = cartItems.findIndex((item) => item.nombre === nombre);
    if (index !== -1) {
        cartTotal -= cartItems[index].precio;
        cartItems.splice(index, 1);
        updateCart();
    }
}

function updateCart() {
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    

    cartTotalElement.textContent = cartTotal.toFixed(2);
}

// Agrega un event listener a cada botón "Añadir al carrito"
const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const nombre = button.dataset.nombre;
        const precio = parseFloat(button.dataset.precio);
        addToCart(nombre, precio);
    });
});

// Agrega un event listener a cada botón "Quitar del carrito"
const removeFromCartButtons = document.querySelectorAll(".remove-from-cart");
removeFromCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const nombre = button.dataset.nombre;
        removeFromCart(nombre);
    });
});

document.getElementById("print-budget").addEventListener("click", () => {
    window.print();
});