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