document.getElementById('formulario-login').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que el formulario se envíe

    // Obtén los valores del formulario
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    // Obtén los usuarios almacenados en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Busca el usuario
    const usuarioEncontrado = usuarios.find(user => user.email === usuario && user.contrasena === contrasena);

    if (usuarioEncontrado) {
        alert('Inicio de sesión exitoso!');
        window.location.href = 'bienvenido.html'; // Redirige a la página de bienvenida
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
});