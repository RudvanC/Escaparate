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